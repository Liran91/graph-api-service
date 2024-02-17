import { Graph } from '../models/graph.js';
import fs from 'fs/promises';
import * as dfsRunner from '../helpers/dfs-runner.js'

export class GraphManager {

    async init(inputFilePath) {
        logger.info(`Initializing graph - using input file ${inputFilePath}`);
        try {
            const fileBody = await fs.readFile(inputFilePath, 'utf-8');
            const graphInputData = JSON.parse(fileBody);
            this.graph = await this._buildGraph(graphInputData.nodes, graphInputData.edges);
            logger.info(`Started generating graph routes`);
            this.routes = await this._generateGraphRoutes();
            logger.info(`Graph routes generated successfully`);
        }
        catch (err) {
            logger.error(`An error occured during GraphManager init`, err);
            throw err;
        }
    }

    getRoutes() {
        return this.routes;
    }

    getNodes() {
        return this.graph.nodes;
    }

    async _buildGraph(nodesArr, edgesArr) {
        logger.info(`Started building graph`);
        const newGraph = new Graph();
        this._addNodes(newGraph, nodesArr);
        this._addEdges(newGraph, edgesArr);
        logger.info(`Finished building graph`);
        return newGraph;
    }

    _addNodes(graph, nodes) {
        nodes.forEach(nodeToAdd => { graph.addNode(nodeToAdd); });
    }

    _addEdges(graph, edges) {
        edges.forEach((edge) => {
            const sourceNode = edge.from;
            edge.to.forEach((destinationNode) => { graph.addEdge(sourceNode, destinationNode); });
        });
    }

    _generateGraphRoutes() {
        return dfsRunner.performDFS(this.graph);
    }
};

const graphManager = new GraphManager();
export default graphManager;