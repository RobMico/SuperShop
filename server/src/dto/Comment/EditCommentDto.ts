import Validator from "../../utils/Validator";

export default class EditCommentDto {
    comment: string;
    commentId: number;
    constructor(body: any) {
        this.comment = Validator.ValidateString(body.comment, true, 'comment');
        this.commentId = Validator.ValidatePositiveNumber(body.commentId, 'commentId');
    }
}