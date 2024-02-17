import { FILTER_TYPES, SINK_TYPES, VULNERABILITIES } from "../constants/constants.js";

export function filterRoutes(filterType, routes, nodesData) {
    switch (filterType) {

        case FILTER_TYPES.startsWithPublicService:
            logger.info(`Filtering graph for routes that start in a public service`)
            return _routeStartWithPublicServiceFilter(routes, nodesData);

        case FILTER_TYPES.endsInSink:
            logger.info(`Filtering graph for routes that end in sink`)
            return _routeEndsInSinkFilter(routes, nodesData);

        case FILTER_TYPES.containsVulnerabilities:
            logger.info(`Filtering graph for routes that contain vulnerabilities`)
            return _vulnerabilityInRouteFilter(routes, nodesData);

        default:
            logger.info(`Returning unfiltered graph`);
            return routes;
    }
}

function _vulnerabilityInRouteFilter(routes, nodesData) {
    return routes.filter(route => route.some(node => nodesData.get(node)[VULNERABILITIES]));
}

function _routeEndsInSinkFilter(routes, nodesData) {
    return routes.filter(route => {
        if (route.length > 0) {
            const lastNodeId = route[route.length - 1];
            const lastNodeData = nodesData.get(lastNodeId);
            return SINK_TYPES.includes(lastNodeData.kind);
        }
    });
}

function _routeStartWithPublicServiceFilter(routes, nodesData) {
    return routes.filter(route => {
        if (route.length > 0) {
            const firstNodeId = route[0];
            const firstNodeData = nodesData.get(firstNodeId);
            return firstNodeData.publicExposed === true;
        }
    });
}
