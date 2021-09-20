import fs from "fs";
import path from "path";

export const MORGAN_LOG_FORMAT = ':remote-addr - [:date[iso]] (:method :url :status) :total-time - ":user-agent"'

export const MORGAN_CONFIG = {
    stream: fs.createWriteStream(path.join(__dirname, '../log', 'access.log'), {flags: 'a'}),
    interval: '3d'
}

export const MONGODB_CONFIG = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
}

export const SWAGGER_CONFIG = { explorer: true }

export const SYSTEM_FISCAL_YEAR = {fiscalYear: 1400}