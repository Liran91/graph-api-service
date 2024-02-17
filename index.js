import express from 'express';
import config from 'config';
import graphManager from './modules/graph-manager.js';
import * as graphApiController from './api/controllers/graph-api-controller.js'
import * as graphApiValidator from './api/validators/graph-api-validator.js'
const app = express();
const router = express.Router();
global.logger = console;

app.use(router);

app.use((err, req, res, next) => {
    const responseBody = {
        message: err.message,
        code: err.name,
        statusCode: err.statusCode || 400,
        details: err.details
    };
    res.errorMsg = responseBody.message;

    return res.status(responseBody.statusCode).json(responseBody);
});

router.get('/api/v1/graph', graphApiValidator.getGraph, graphApiController.getGraph)


init();

async function init() {
    try {
        logger.info(`Starting graph API service initializing`)
        const port = config.server.port;
        const inputFilePath = config.graphManager.inputFilePath;
        await graphManager.init(inputFilePath);
        logger.info(`Graph Manager initialized successfully`)
        app.listen(3000, () => {
            logger.info(`Graph API server is up and listening to port ${port}`);
        })
    }
    catch (err) {
        logger.error(`Failed to initialize Graph API server`,err);
        process.exit(1);
    }
}