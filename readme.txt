Summary:

On server init, the graph input data is loaded from the JSON file via Graph Manager, afterwards the node and edge data from the file is used to create a graph class with an adjacency list and a node data list.
Once the graph is constructed we find all routes in the graph by running DFS on all nodes concurrently using Worker Threads. Afterwards the server is up and ready to handle API requests.
The API server contains a single GET endpoint which returns a graph.The graph can be filtered using the 'filter' query param together with a valid supported filter value.
Once a request to get the graph is made, we fetch the graph routes and nodesData and then filter the graph according to the filter type (if an invalid filter type was supplied the graph is returned unfiltered).
Once the routes are filtered we generate a graph structure, that can be easy to render in a client side application by collecting all unique nodes in the routes and all the edges and returning them to the client.


Implementation reasoning:

I've chosen an Adjacency List as my graph data structure because it is more efficicent for traversal algorithms such as the one I am using (DFS).
I've chosen the DFS algorithm in order to traverse the graph and find all routes in it since its a commonly used algorithm for such use cases, I assumed there are no cycles in the graph.
I've decided to use Worker Threads in order to utilize concurrency when running DFS on the graph, allocating a job of running DFS on a single starting node for each worker.

For the purpose of the task I've decided to run DFS and find all routes in the graph at the start of the program/server to avoid running it every time a query is made. 
This is ok for this case since we use a static file, but if we had an input graph which is not static I would have had to re-run processing when a change to the graph was made, probably only on the affected area of the graph.


Clarifications:

1.I have mainly worked with CommonJs syntax but I've tried to use the ES6 Import/Export syntax to the best of my knowledge.

2.This is my first time working with Workers, I am not fully aware of the possible pitfalls/limitations of using them and running DFS on each node with a new worker might cause issues on large graphs.
If I would've run into the issue of lacking resources/threads I would've used some form of thread pool or something similar to manage the available resources efficiently.


Assumptions:

1.I am not familiar nor could I find information about the best format to return a graph to a client, so I adopted the format in which the input JSON was structured in.

2.I assumed the client requires the actual filtered graph with the node data and not only the routes themselves.

3.I assumed I did not need to create a proper error manager for the purpose of this task.

4.I could've merged the adjacency list and node data into a single Map where the key is the node id and the value is an object containing 2 fields: nodeData and the node's neighbors list.
For the limited use case of this task I've decided keeping them seperately is the correct and cleaner way but I might change my mind given a larger scope.

5.I assumed I did not need to support environment variable beyond default ones for the purpose of the task.


API Information:

Method: GET
URL: {BASE_URL}/api/v1/graph?filter=${filterType}
valid filterType:
contains_vulnerabilities
ends_in_sink
starts_with_public_service
