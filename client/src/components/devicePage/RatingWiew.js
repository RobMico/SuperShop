import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { Context } from "../..";
import { getRate } from "../../http/deviceAPI";
import NewCommentForm from "./NewRatingForm";
import SingleRate from "./SingleRate"

const CommentWiew =observer(function ({device, user}){    
    const limits = 10;
    const [ratings, setRatings] = useState([]);
    const [rated, setRated] = useState(false);
    const [page, setPage] = useState(1);
    const [__temp ,rerender]= useState(null); 

    useEffect(()=>{
        getRate(limits, page, device.id).then(data=>{            
            setPage(page+1);
            setRatings(data);
        })
    },[])    

    useEffect(()=>{
        getRate(limits, 1, device.id).then(data=>{            
            setPage(1);
            setRatings(data);
            if(data.find(el=>el.userId==user.user.id)){setRated(true);}
        })
    },[__temp])



    const click = ()=>{
        getRate(limits, page, device.id).then(data=>{
            setPage(page+1);
            setRatings([...ratings, ...data]);

        })
    }        

    return(
        
        <Row className="d-flex flex-column m-3">          
        <h2>Comments:</h2>
        {!rated?<NewCommentForm deviceId={device.id} rerenderParentCallback={rerender}/>:''}
            {ratings.map(rate=>{
                return <SingleRate key={rate.id} rating={rate} user={user} rerenderCallback={rerender} rerenderVar={__temp}/>                
            })}
            {ratings.length<device.ratecount?<Button onClick={click}>Load more</Button>:''}
        </Row>

    );
});

export default CommentWiew;