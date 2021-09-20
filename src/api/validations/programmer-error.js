// Represents all errors raised because of a fault in system.
export default class ProgrammingError {
    constructor(message, location, code = 500) {
        this.message = message
        this.location = location
        this.code = code
    }
}
