import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);

export function performDFS(graph) {
    const workers = [];
    const routes = [];

    return new Promise((resolve, reject) => {
        for (const nodeId of graph.nodes.keys()) {
            const worker = new Worker(__filename, {
                workerData: { nodeId: nodeId, adjacencyList: graph.adjacencyList.get(nodeId) }
            });
            workers.push(worker);

            worker.on('message', (message) => {
                routes.push(...message);
                worker.finished = true;
                if (workers.every(worker => worker.finished)) {
                    logger.info('All Workers finished running DFS on graph nodes');
                    resolve(routes);
                }
            });

            worker.on('error', (error) => {
                logger.error(`Worker error for graph node ${nodeId}:`, error);
                reject(error);
            });

            worker.on('exit', (code) => {
                worker.finished = true;
            });
        }
    });
}

function _dfs(startNode, adjacencyList, visited, currentRoute) {
    let routes = [];
    visited.add(startNode);
    currentRoute.push(startNode);

    for (const neighbor of adjacencyList) {
        if (!visited.has(neighbor)) {
            const newRoutes = _dfs(neighbor, adjacencyList, visited, [...currentRoute]);
            routes = routes.concat(newRoutes);
        }
    }

    return routes.length > 0 ? routes : [currentRoute];
}

if (!isMainThread) {
    const { nodeId, adjacencyList } = workerData;
    const visited = new Set();
    const currentRoute = [];
    const routes = _dfs(nodeId, adjacencyList, visited, currentRoute);

    parentPort.postMessage(routes);
}