import Validator from "../../utils/Validator";

export default class CreateCommentDto{
    comment: string;
    rateId:number;
    constructor(body:any){
        this.comment = Validator.ValidateString(body.comment, true, 'comment');
        this.rateId = Validator.ValidatePositiveNumber(body.ratingId, 'rateId');
    }
}