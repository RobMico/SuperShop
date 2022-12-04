import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Button, Card, Container, Form, FormLabel } from "react-bootstrap";
import { postRate } from "../../http/deviceAPI";
import { Context } from "../../index";


const NewRatingForm=observer(({deviceId, rerenderParentCallback, IsAnswer, commentId})=>{
    const {user} = useContext(Context);
    const [rate, setRate] = useState(4);
    const [comment, setComment] = useState('');

    const click = ()=>{        
        postRate(comment, rate, deviceId).then(data=>{
            rerenderParentCallback(comment);
        }).catch(err=>{
            console.error(err)
            alert("something was wrong")
        });
    }

    const stars=[1, 2, 3, 4, 5]    
    return(
        <>
        {user.isAuth?
        <Card>
        <Form>
            <FormLabel className="mt-1">Rate device</FormLabel>
            <Container className="d-flex flex-coumn h4">{stars.map(e=><div key={e} style={{color:e>rate?'black':'yellow'}} onClick={()=>setRate(e)}>★</div>)}</Container>
            <FormLabel>Enter comment</FormLabel>
            <Form.Control as="textarea" rows={3} value={comment} onChange={e=>setComment(e.target.value)}/>
            <Button onClick={click} className="mt-3 mb-3">Submit</Button>
        </Form>
        </Card>
        :
        <Button>Login to comment</Button>
        }
        </>
    );
})

export default NewRatingForm;