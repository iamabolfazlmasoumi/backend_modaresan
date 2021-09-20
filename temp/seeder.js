import {} from "dotenv/config";
import mongoose from "mongoose";
import {
    runServer
} from '../src/api/server'
import {
    MONGODB_CONFIG
} from "../config";

import {
    permissionSeeder
} from "./permissionSeeder";
import {
    roleSeeder
} from "./roleSeeder";
import {
    cat1Seeder
} from "./cat1Seeder";
import {
    cat2Seeder
} from "./cat2Seeder";
import {
    regionSeeder
} from "./regionSeeder";
import {
    fiscalYearSeeder
} from "./fiscalYearSeeder";
import {
    subjectSeeder
} from "./subjectSeeder";

function serverInit() {
    mongoose.connect(process.env.MONGO_URI, MONGODB_CONFIG)
        .then(() => console.log('MongoDB connected.'))
        .then(() =>
            runServer()
        )
        .then(() => {
            console.log("[seed]: running ...")
            setTimeout(function () {
                cat1Seeder();
            }, 1000);
        }).then(() => {
            setTimeout(function () {
                cat2Seeder();
            }, 3000);
        }).then(() => {
            setTimeout(function () {
                fiscalYearSeeder();
            }, 5000);
        }).then(() => {
            setTimeout(function () {
                regionSeeder();
            }, 7000);
        }).then(() => {
            setTimeout(function () {
                permissionSeeder();
            }, 9000);
        }).then(() => {
            setTimeout(function () {
                roleSeeder();
            }, 11000);

        }).then(() => {
            setTimeout(function () {
                subjectSeeder();
            }, 13000);
        })
        .catch(err => console.log(err));
}


serverInit();