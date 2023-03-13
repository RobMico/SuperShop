import CreateCommentDto from "../dto/Comment/CreateCommentDto";
import EditCommentDto from "../dto/Comment/EditCommentDto";
import TokenUserData from "../dto/TokenUserDataDto";
import ApiError from "../error/ApiError";
import ErrorHandlerWrap from "../middleware/errorHandlerWrap";
import CommentsModel from "../models/CommentsModel";

class CommentService {
    async removeComment(commentId: number) {
        const result = await CommentsModel.destroy({ where: { id: commentId } });
        if (result === 0) {
            throw ApiError.badRequest('Such comment not exists');
        }
        return result;
    }
    async editComment(commentDto: EditCommentDto, user: TokenUserData) {
        const result = await CommentsModel.update({ comment: commentDto.comment }, { where: { id: commentDto.commentId, userId: user.id } });
        if (result[0] === 0) {
            throw ApiError.badRequest('Comment does not exist, or does not belong to you');
        }
        return result;
    }
    async createComment(commentDto: CreateCommentDto, user: TokenUserData) {
        const result = await CommentsModel.create({ comment: commentDto.comment, rateId: commentDto.rateId, userName: user.email, userId: user.id });
        return result;
    }
}

export default new CommentService();