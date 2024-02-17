import graphManager from "../../modules/graph-manager.js";
import * as graphFilter from "../../helpers/graph-filter.js";

export function getGraph(filterType) {
    try {
        const routes = graphManager.getRoutes();
        const nodesData = graphManager.getNodes();
        const filteredRoutes = graphFilter.filterRoutes(filterType, routes, nodesData);
        const filteredGraph = _createGraphFromRoutes(filteredRoutes, nodesData)
        return filteredGraph;
    }
    catch (err) {
        logger.error(`An unexpected internal error occured when getting graph`, err);
        throw err;
    }
}


/* I am SUPER UNHAPPY with this function, it is ugly but I currently have no cleaner way to convert the data to the format that I assumed is required by the client.
Iterating over all the routes and then over the edges is not efficient, with more elbaoration and a larger scope I would've done something better to avoid it,
(such as returning just the nodes and the routes and using the routes to build the edges by the client)
The function collects all the unique node ids and edges, afterwards we get the node data for all the unique node ids and then formats the edges to the same from-to format we have in the input JSON file
*/
function _createGraphFromRoutes(routes, nodesData) {
    const nodesSet = new Set();
    const edgesMap = new Map();
    const edges = [];

    routes.forEach(route => {
        route.forEach((nodeId, index) => {
            nodesSet.add(nodesData.get(nodeId));

            if (index < route.length - 1) {
                if (!edgesMap.get(nodeId)) {
                    edgesMap.set(nodeId, []);
                }
                edgesMap.get(nodeId).push(route[index + 1]);
            }
        });
    });

    for (const edge of edgesMap.keys()) {
        edges.push({ from: edge, to: edgesMap.get(edge) });
    }

    return { nodes: Array.from(nodesSet), edges: edges };
}