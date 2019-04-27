
let count = 0;
const ij_red = "#d55e00";
const ih_green = "#009e73";
const hj_blue = "#0072b2";
let viz = new Viz({ workerURL: 'lite.render.js' });

function genDotStr(D, ct, nh, ni, nj) {
    let w = D[0].length;
    D.forEach(row => {
        assert(row.length == w);
    });

    let str = "digraph{ Node [style=\"filled\"];";

    for (let n = 0; n < w; n++) {
        let isSpecialNode = (n == nh) || (n == ni) || (n == nj);
        let lb = isSpecialNode ? "[" : "";
        let ish = (n == nh) ? "shape=doublecircle" : "";
        let jhi = (n == nh && n == ni) ? "," : "";
        let isi = (n == ni) ? "color=\"#56b4e9\"" : "";
        let jij = ((n == nh || n == ni) && n == nj) ? "," : "";
        let isj = (n == nj) ? "fillcolor=\"#f0e442\"" : "";
        let rb = isSpecialNode ? "]" : "";
        str += (n + 1) + " " + lb + ish + jhi + isi + jij + isj + rb + ";"
    }

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < w; j++) {
            if (isFinite(D[i][j])) {
                if (ct !== undefined && ct[i] !== undefined && ct[i][j] !== undefined) {
                    ct[i][j].forEach(color => {
                        str += (i + 1) + "->" + (j + 1) + "[label=\"" + D[i][j] + "\",color=\"" + color + "\"];"
                    });
                } else {
                    str += (i + 1) + "->" + (j + 1) + "[label=\"" + D[i][j] + "\"];"
                }
            }
        }
    }

    str += "}"
    return str;
}

function matrix(mat, name, ct) {
    let div = document.createElement("div");
    div.className = "matrix";
    div.appendChild(paragraph(name + " = "));

    let t = document.createElement("table");

    for (let i = 0; i < mat.length; i++) {

        let tr = document.createElement("tr");

        for (let j = 0; j < mat.length; j++) {

            let td = document.createElement("td");
            let ele = mat[i][j];

            td.innerText = (isNaN(ele)) ? "-" : ((isFinite(ele)) ? ele : "∞");
            if (ct !== undefined && ct[i] !== undefined && ct[i][j] !== undefined) {
                if (ct[i][j].length == 3) {
                    td.style.backgroundColor = ct[i][j][0];
                    td.style.borderLeft = ".3em solid"
                    td.style.borderRight = ".3em solid";
                    td.style.borderLeftColor = ct[i][j][1];
                    td.style.borderRightColor = ct[i][j][2];
                } else if (ct[i][j].length == 2) {
                    td.style.backgroundColor = ct[i][j][0];
                    td.style.borderLeft = ".3em solid"
                    td.style.borderRight = ".3em solid";
                    td.style.borderLeftColor = ct[i][j][1];
                    td.style.borderRightColor = ct[i][j][1];
                } else {
                    td.style.backgroundColor = ct[i][j][0];
                }
            }
            tr.appendChild(td);
        }
        t.appendChild(tr);
    }
    div.appendChild(t);
    return div;
}

function paragraph(str) {
    let p = document.createElement("p");
    p.innerText = str;
    return p;
}

function graph(str) {
    let div = document.createElement("div");
    div.className = "graph";
    viz.renderSVGElement(str)
        .then(function (element) {
            div.appendChild(element);
        });
    return div;
}

function colorTable() {
    let ary = Array();
    return ary;
}

function setColor(table, i, j, color) {
    if (table[i] === undefined) {
        table[i] = Array();
    }
    if (table[i][j] == undefined) {
        table[i][j] = Array();
    }
    table[i][j].push(color);
}

function template(name) {
    let template = document.getElementById(name);
    return document.importNode(template.content, true);
}

function trace(F, gct, i, j, color) {
    if (F[i][j] == (i + 1)) {
        setColor(gct, i, j, color);
        return;
    }
    let prev = F[i][j] - 1;
    setColor(gct, prev, j, color);
    trace(F, gct, i, prev, color);

}

window.onload = function () {
    document.getElementById("go").addEventListener("click", function () {
        {
            let log = document.getElementById("log");
            let clone = log.cloneNode(false);
            log.parentNode.replaceChild(clone, log);
        }
        let inp = document.getElementById("in").value;
        let A = (() => {
            let tmp = inp.trim().split("\n");
            return tmp
                .map((s) =>
                    s.trim().split(",").map((s2) => parseInt(s2.trim()))
                );
        })();

        let w = A[0].length;
        A.forEach(row => {
            assert(row.length == w);
        });

        let D = Array(w);
        let F = Array(w);
        for (let i = 0; i < w; i++) {
            F[i] = Array(w);
            D[i] = Array(w);
            for (let j = 0; j < w; j++) {
                if (isNaN(A[i][j])) {
                    F[i][j] = NaN;
                    D[i][j] = Infinity;
                }
                else {
                    F[i][j] = (i + 1);
                    D[i][j] = A[i][j];
                }
            }
        }

        let id = 0;
        let ans = document.getElementById("ans");
        let clone = ans.cloneNode(false);
        ans.parentNode.replaceChild(clone, ans);
        ans = clone;

        {
            let section = document.createElement("section");
            section.id = "section-" + id++;
            let info = document.createElement("div");
            info.className = "info";
            ans.appendChild(section);

            section.appendChild(graph(genDotStr(A)));

            section.appendChild(info);
            info.appendChild(paragraph("初期化処理"));
            info.appendChild(matrix(D, "D"));
            info.appendChild(matrix(F, "F"));
        }

        for (let h = 0; h < w; h++) {
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < w; j++) {
                    let gct_ih = colorTable();
                    let gct_hj = colorTable();
                    let gct_ij = colorTable();

                    let replace = D[i][j] > D[i][h] + D[h][j];
                    let unreachable = !(isFinite(D[i][h]) && isFinite(D[h][j]));

                    if (isFinite(D[i][h])) {
                        trace(F, gct_ih, i, h, ih_green);
                    }

                    if (isFinite(D[h][j])) {
                        trace(F, gct_hj, h, j, hj_blue);
                    }

                    if (isFinite(D[i][j])) {
                        trace(F, gct_ij, i, j, ij_red);
                    }

                    {
                        let section = document.createElement("section");
                        section.id = "section-" + id++;
                        let info = document.createElement("div");
                        info.className = "info";
                        ans.appendChild(section);

                        section.appendChild(graph(genDotStr(A, gct_ij, h, i, j)));
                        section.appendChild(graph(genDotStr(A, gct_ih, h, i, j)));
                        section.appendChild(graph(genDotStr(A, gct_hj, h, i, j)));

                        section.appendChild(info);
                        info.appendChild(paragraph("(h, i, j) = (" + (h + 1) + ", " + (i + 1) + ", " + (j + 1) + ")"));

                        let dct = colorTable();
                        setColor(dct, i, j, ij_red);
                        setColor(dct, i, h, ih_green);
                        setColor(dct, h, j, hj_blue);

                        let fct = colorTable();
                        if (replace) {
                            setColor(fct, i, j, ij_red);
                        }

                        info.appendChild(matrix(D, "D", dct));
                        info.appendChild(matrix(F, "F", fct));

                        if (replace) {
                            info.appendChild(template("replace-template"));
                        } else if (unreachable) {
                            info.appendChild(template("unreachable-template"));
                        }
                        else {
                            info.appendChild(template("detour-template"));
                        }
                    }

                    if (replace) {
                        D[i][j] = D[i][h] + D[h][j];
                        F[i][j] = F[h][j];
                    }
                }
            }
        }

        {
            let section = document.createElement("section");
            section.id = "section-" + id++;
            let info = document.createElement("div");
            info.className = "info";
            ans.appendChild(section);
            section.appendChild(info);
            info.appendChild(paragraph("最終結果"));
            info.appendChild(matrix(D, "D"));
            info.appendChild(matrix(F, "F"));
        }

    });
}
function assert(exp) {
    if (!exp) {
        {
            let ans = document.getElementById("ans");
            let clone = ans.cloneNode(false);
            ans.parentNode.replaceChild(clone, ans);
            ans = clone;
        }
        let log = document.getElementById("log");
        let clone = log.cloneNode(false);
        log.parentNode.replaceChild(clone, log);
        log = clone;
        log.appendChild(template("error-template"));
        throw new Error();
    }
}
let intervalID;
function resetCount() {
    count = 0;
    location.hash = "";
    clearInterval(intervalID);
}
function nextCount() {
    let e = document.getElementById("section-" + (++count));
    if (e !== null) {
        location.hash = "";
        location.hash = "section-" + count;
    }
}
function autoCount() {
    clearInterval(intervalID);
    intervalID = setInterval(() => {
        let e = document.getElementById("section-" + (++count));
        if (e == null) {
            clearInterval(intervalID);
        }
        else {
            location.hash = "";
            location.hash = "section-" + count;
        }
    }, 1000);
}