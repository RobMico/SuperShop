import { NextFunction, Request, Response } from "express";
import CreateCommentDto from "../dto/Comment/CreateCommentDto";
import EditCommentDto from "../dto/Comment/EditCommentDto";
import ErrorHandlerWrap from "../middleware/errorHandlerWrap";
import CommentService from "../services/CommentService";
import AuthRequest from "../utils/authRequest";
import Validator from "../utils/Validator";

class CommentController {
    @ErrorHandlerWrap
    async postComment(req: AuthRequest, res: Response, next: NextFunction) {
        const commentDto = new CreateCommentDto(req.body);
        const user = req.user;
        const result = await CommentService.createComment(commentDto, user);
        return res.json(result);
    }

    @ErrorHandlerWrap
    async editComment(req: AuthRequest, res: Response, next: NextFunction){
        const commentDto = new EditCommentDto(req.body);
        const user = req.user;
        const result = await CommentService.editComment(commentDto, user);
        return res.json(result);
    }

    @ErrorHandlerWrap
    async removeComment(req: AuthRequest, res: Response, next: NextFunction){
        const commentId = Validator.ValidatePositiveNumber(req.body.commentId, 'commentId');
        const result = await CommentService.removeComment(commentId);
        return res.json(result);
    }
}

export default new CommentController();