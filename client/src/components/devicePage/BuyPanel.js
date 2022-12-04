import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ChatFill } from 'react-bootstrap-icons';
import { addToBasket } from "../../http/basketAPI";



const BuyPanel = ({ device, isAdmin }) => {
    let _addToBasket = ()=>{
        addToBasket(device.id, 1).then(res=>{
            alert("successfully added")
        }).catch(e=>{
            alert("error occured")
            console.error(e)
        })
    }

    return (
        <Container>
            <br />
            <br />
            <Row style={{ textAlign: 'center' }}>
                <h2>Price:{device.price}$</h2>
            </Row>
            <br />
            <br />
            <br />
            <br />
            <Row style={{padding:"40px"}}>
                <Button variant="outline-dark" onClick={_addToBasket}>Add to basket</Button>
            </Row>
        </Container>
    );
}

export default BuyPanel;