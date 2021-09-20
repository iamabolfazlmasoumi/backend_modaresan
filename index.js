import { } from 'dotenv/config'
import os from 'os'
import { runServer } from './src/api/server'
import mongoose from "mongoose";
import { MONGODB_CONFIG } from "./config";
import cluster from "cluster";

const debug = require('debug')('app:dev');
function init() {
    global.__basedir = __dirname;
    mongoose.connect(process.env.MONGO_URI, MONGODB_CONFIG)
        .then(() => debug('MongoDB connected.'))
        .then(() =>
            runServer()
        )
        .catch(err => console.log(err));
}

// Clustering server instances.
function runCluster() {
    if (cluster.isMaster)
        for (let i = 0; i < os.cpus().length - 1; i++)
            cluster.fork()
    else init()
}


runCluster()
