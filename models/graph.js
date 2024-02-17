export class Graph {
    constructor() {
        this.adjacencyList = new Map();
        this.nodes = new Map();
    }

    getNodes() {
        return this.nodes;
    }

    getAdjacencyList(){
        return this.adjacencyList;
    }

    addNode(nodeData) {
        this.nodes.set(nodeData.name, nodeData)
        this.adjacencyList.set(nodeData.name, []);
    }

    addEdge(sourceNode, destinationNode) {
        this.adjacencyList.get(sourceNode).push(destinationNode);
    }
};