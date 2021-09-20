import express from 'express';
import cors from 'cors';
import api from './routes';
import helmet from "helmet";
import compression from "compression";
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'
import { errorHandler } from "./middlewares/error-handler";
import morgan from 'morgan'
import { createTerminus } from '@godaddy/terminus';
import { MORGAN_CONFIG, MORGAN_LOG_FORMAT, SWAGGER_CONFIG } from "../../config";

const app = express();


export function runServer() {

    app.enable("trust proxy");

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(compression());
    app.use(morgan(MORGAN_LOG_FORMAT, MORGAN_CONFIG));
    app.use( morgan( 'dev' ) );
    app.use(express.static("resources"));

    app.use('/api', api)// Defining server port
    app.use('/api-docs', swaggerUi.serveWithOptions(SWAGGER_CONFIG), swaggerUi.setup(swaggerDocument));

    app.use(errorHandler);

    app.listen(process.env.WEB_PORT, (port) => {
        console.log(`Server is up. PID: ${process.pid}`)
    })

    createTerminus(app, {});

}


export default app
