import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import { editComment, postComment } from "../../http/commentAPI";


const CommentForm=observer(({prototype, ratingId, rerender})=>{
    const [comment, setComment] = useState(prototype?prototype.comment:'');
    
    const post = prototype?
    (()=>{
        editComment(prototype.id, comment).then((data)=>{
            rerender(comment+ratingId);
        }).catch((err)=>{
            alert("something was wrong");
        });
    })
    :
    (()=>{
        postComment(ratingId, comment).then((data)=>{
            rerender(comment+ratingId);
        }).catch((err)=>{
            //console.warn(err);
            alert("something was wrong");
        });
    })
    

    return(        
        <Form>
            <FormLabel>Enter comment</FormLabel>
            <Form.Control as="textarea" rows={3} value={comment} onChange={e=>setComment(e.target.value)}/>
            <Button onClick={post}>Submit</Button>
        </Form>
    );
})

export default CommentForm;