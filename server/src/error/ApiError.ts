class ApiError extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }
    static badRequest(message: string) {
        return new ApiError(400, message);
    }
    static internal(message: string) {
        return new ApiError(500, message);
    }
    static forbidden(message: string) {
        return new ApiError(403, message);
    }
    static validationError(message: string) {
        return new ApiError(400, message);
    }
    static validation(ex) {
        let errors = ex.errors.map((ex) => { return { type: ex.type, message: ex.message, field: ex.path } });
        return new ApiError(400, errors);
    }
}

export default ApiError;