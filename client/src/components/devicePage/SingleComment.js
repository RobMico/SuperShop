import React, { useEffect, useState } from "react";
import { Row, Button, Alert } from "react-bootstrap";
import { removeComment } from "../../http/commentAPI";
import CommentForm from "./CommentForm";

const SingleComment = ({ ratingId, user, comment, rerenderCallback }) => {
    const [show, setShow] = useState(false);
    const rerender = (function (data) {
        setShow(false);
        rerenderCallback(data)
    }).bind({ test: 'test', rerenderCallback: rerenderCallback, setShow: setShow })

    const _removeComment = async () => {
        try {
            await removeComment(comment.id)
            rerender()            
        } catch {
            alert("Something was wrong")
        }
    }


    return (
        <>
            {comment ?
                <Row key={comment.id} className="">
                    <div style={{ backgroundColor: user.user.id == comment.userId ? "#5DADE2" : "lightgray", display: 'flex' }}>
                        {user.user.id == comment.userId ? 'you' : comment.userName}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '1rem' }}>
                            <div style={{ marginLeft: '1rem', color: '#283747' }}>{comment.updatedAt.slice(0, 10)}</div>
                            {user.isAuth ?
                                <button className="" bsSize="xsmall"
                                    style={{ float: 'right', border: 'none', background: 'none', marginLeft: '1rem', textDecorationLine: 'underline' }}
                                    onClick={e => setShow(!show)}>{user.user.id == comment.userId ? 'Edit' : 'Answer'}</button>
                                : ''}
                            {user.user.role == "ADMIN" ?
                                <button className="" bsSize="xsmall"
                                    style={{ float: 'right', border: 'none', background: 'none', marginLeft: '1rem', textDecorationLine: 'underline', color: 'red' }}
                                    onClick={_removeComment}>Remove</button>
                                : ''}
                        </div>
                    </div>
                    <div>{comment.comment}</div>
                    <hr />
                    <Alert show={show} variant="success">
                        {user.user.id == comment.userId ? <CommentForm prototype={comment} rerender={rerender} /> : <CommentForm ratingId={ratingId} rerender={rerender} />}
                    </Alert>
                </Row> :''}
        </>
    );
}

export default SingleComment;