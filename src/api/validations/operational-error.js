// Represents all errors raised by us because of fault in inputs .
export default class OperationalError {
    constructor(type, problem) {
        this.problem = problem
        this.type = type
    }
}


export const ALREADY_EXISTS_ERROR = {code: 400, template: 'AlreadyExists'}

export const NOT_FOUND_ERROR = {code: 404, template: 'NotFound'}

export const REQUIRED_FIELD_ERROR = {code: 400, template: 'FieldRequired'}

export const INVALID_OPERATION_ERROR = {code: 400, template: 'OperationInvalid'}

export const NOT_AUTHENTICATED_ERROR = {code: 401, template: 'NotAuthenticated'}

export const NOT_AUTHORIZED_ERROR = {code: 401, template: 'AccessNotGranted'}

export const WRONG_CREDENTIALS_ERROR = {code: 401, template: 'WrongCredentials'}

export const ACCOUNT_SUSPENDED_ERROR = {code: 403, template: 'AccountSuspended'}