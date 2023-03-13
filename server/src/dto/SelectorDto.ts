import ApiError from "../error/ApiError";
import Validator from "../utils/Validator";

export default class SelectorDto {
    page: number;
    limit: number;
    offset: number;
    constructor(body: any) {
        if ((!body.page && !body.offset)) {
            throw ApiError.badRequest('page, offset undefined');
        }
        this.limit = Validator.ValidatePositiveNumber(body.limit, 'limit');
        if (body.page) {
            this.page = Validator.ValidatePositiveNumber(body.page)-1;
            this.offset = this.limit * this.page;
        }
        else{
            this.offset = Validator.ValidatePositiveNumber(body.offset);
            this.page = this.offset/this.limit;
        }
    }
}