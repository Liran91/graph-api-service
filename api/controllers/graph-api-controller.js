import * as graphApiHandler from "../handlers/graph-api-handler.js";

export function getGraph(req, res, next) {
    try {
        const filterType = req.query.filter;
        const graph = graphApiHandler.getGraph(filterType);
        res.send(graph);
    }
    catch (err) {
        next({ statusCode: 500, message: `An unexpected internal error occured when getting graph`, err });
    }
}