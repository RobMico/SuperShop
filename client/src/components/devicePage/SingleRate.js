import React, { useEffect, useState } from "react";
import { Row, Button, Alert, Container } from "react-bootstrap";
import CommentForm from "./CommentForm";
import SingleComment from "./SingleComment";

const SingleRate = ({rating, user, rerenderCallback, rerenderVar})=>{
    const [show, setShow] = useState(false);
    useEffect(()=>{
        setShow(false);
    }, [rerenderVar])
    rating.comments = rating.comments.sort((a, b)=>a.id<b.id);    
    let arr = [];
    for (let i = 1; i <= 5; i++) {
        if (rating.rate >= i) {
            arr.push(1);
        }
        else {
            arr.push(0);
        }
    }    


    return(
        <Row key={rating.id} className="">
            <div style={{backgroundColor: user.user.id==rating.userId?"#5DADE2":"lightgray", display: 'flex'}}>{user.user.id==rating.userId?'you':rating.userName}
                <div style={{display: 'flex', justifyContent:'space-between', marginLeft:'1rem'}}>
                    {arr.map((e, i) =>
                        <div className={e == 1 ? "text-warning" : "text-secondary"} key={i}>★</div>
                    )}
                    <div style={{marginLeft:'1rem', color:'#283747'}}>{rating.updatedAt.slice(0, 10)}</div>
                    {user.isAuth?<button className="" bsSize="xsmall" 
                    style={{float: 'right', border:'none', background:'none', marginLeft:'1rem', textDecorationLine:'underline'}} 
                    onClick={e=>setShow(!show)}>
                        Answer
                        </button>:''}
                </div>
            </div>
            {/* <div>{rating.rating}</div> */}
            <div>{rating.comment}</div>
            <hr/>
            <Container style={{paddingLeft:"2rem"}}>
                {rating.comments.map(el=><SingleComment ratingId={rating.id} user={user} comment={el} rerenderCallback={rerenderCallback}/>)}
            </Container>
            <Alert show={show} variant="success">
                <CommentForm ratingId={rating.id} rerender={rerenderCallback}/>
            </Alert>
        </Row>
    );
}

export default SingleRate;