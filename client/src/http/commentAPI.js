import { authHost} from ".";


export const postComment = async (rateId, comment)=>{    
    const {data} = await authHost.post('api/comment/', {comment:comment, ratingId:rateId});
    return data;
    
}

export const editComment = async (commentId, comment)=>{    
    const {data} = await authHost.post('api/comment/edit', {comment:comment, commentId:commentId});
    return data;
}

export const removeComment = async (commentId)=>{    
    const {data} = await authHost.post('api/comment/remove', {commentId:commentId});
    return data;
}