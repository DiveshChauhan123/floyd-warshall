Floyd-Warshall Algorithm Visualizer

This project is a visualizer for the Floyd-Warshall algorithm, a dynamic programming algorithm used to find the shortest paths between all pairs of vertices in a weighted graph. The visualizer takes a matrix input and shows step-by-step updates for each possible path.
About the Floyd-Warshall Algorithm

The Floyd-Warshall Algorithm is designed to find the shortest paths in a weighted directed graph. It systematically examines all pairs of nodes and iteratively updates the shortest known path between them. The algorithm is based on the idea of considering intermediate nodes between pairs of nodes and checking if adding an intermediate node provides a shorter path.

Time Complexity: O(V3)O(V3), where VV is the number of vertices in the graph.

Key Concept: The algorithm initializes distances based on direct edges between nodes, then iteratively improves them by checking if a route passing through an intermediate vertex is shorter than the direct route.
How It Works

    Initialization: The distance matrix is initialized with given edge weights. If there is no edge between two vertices, the value is set to infinity (or x in this visualizer).
    Iteration: For each possible intermediate vertex k, the algorithm updates the distance between every pair of vertices (i, j) by comparing the direct distance d[i][j] with the distance obtained by passing through k, d[i][k] + d[k][j].
    Result: After iterating through all vertices, the matrix contains the shortest distances between all pairs of vertices.

For example, if we have:

 x, x, 3, -1
-2, x, x, x
 4, 2, x, 2
 x, 4, x, x

The algorithm will update each cell to reflect the shortest possible paths between all pairs of vertices.
Usage Instructions
1. Clone the Repository

Clone this repository to your local machine.

git clone https://github.com/YourUsername/floyd-warshall-visualizer.git
cd floyd-warshall-visualizer

2. Run the Application

Open index.html in a web browser. This is a static web app, so no server setup is required.
3. Enter the Graph Matrix

Enter an adjacency matrix in the provided textarea on the page. Use x to denote no direct path between two vertices. Each row represents a source node, and each column represents a destination node. For example:

 x, x, 3, -1
-2, x, x, x
 4, 2, x, 2
 x, 4, x, x

4. Visualize the Algorithm

    Visualize: Click the "Visualize" button to start the algorithm. This will show step-by-step updates of the matrix as each path is calculated.
    Reset: Clears the current state and returns to the initial input.
    Next: Moves forward one step in the algorithm, showing the next update.
    Auto: Automatically runs through all steps of the algorithm.

5. Observe the Output

The log and ans sections display the intermediate states and final shortest paths matrix.
Files

    index.html: The main HTML structure for the application.
    main.js: JavaScript file containing the Floyd-Warshall algorithm and visualization logic.
    main.css: CSS file for basic styling.

Example Use Case

The Floyd-Warshall algorithm is particularly useful for applications where finding the shortest path between all pairs of nodes is necessary, such as:

    Navigation systems
    Network routing algorithms
    Social network analysis
