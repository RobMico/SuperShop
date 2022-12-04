class ApiError extends Error{
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }
    static badRequest(message){
        return new ApiError(400, message);
    }
    static internal(message)
    {
        return new ApiError(500, message);
    }
    static forbidden(message)
    {
        return new ApiError(403, message);
    }
    static validation(ex)
    {
        let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});
        return new ApiError(400, errors);
    }
}
module.exports = ApiError;