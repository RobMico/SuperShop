import React from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from "../utils/consts";
import { ChatFill } from 'react-bootstrap-icons';
import getFullPath from "../utils/FullFilePath";
import { addToBasket } from "../http/basketAPI";

const DeviceItem = ({ device }) => {
    let _addToBasket = (e)=>{
        e.stopPropagation()
        addToBasket(device.id, 1).then(res=>{
            alert("successfully added")
        }).catch(e=>{
            alert("error occured")
            console.error(e);
        })
    }
    console.info('deviceItem render');
    const navigate = useNavigate();
    return (
        // <Col md={5} className="mt-1">
        <Card style={{ width: '250px', cursor: 'pointer', marginTop:'5px', marginLeft:'5px', backgroundColor:device.avaliable?'white':'silver'}}
            onClick={() => { navigate(DEVICE_ROUTE + '/' + device.id) }}>
            <Container style={{ padding: 0, margin: 0 }} className="text-center">
                <Image width={220} height={220} src={getFullPath(device.img.split(';')[0])}  filter='grayscale(100%)'/>
            </Container>
            <div>{device.name}</div>
            {device.avaliable?
            <>
            <div className="d-flex">
                {[...Array(5)].map((e, i) => <div className={device.rate > i ? "text-warning" : "text-secondary"} style={{ margin: 0, padding: 0 }}
                    key={i}>★</div>)}
                <div style={{ marginLeft: '0.5rem' }}>{device.ratecount}<ChatFill className="text-warning" /></div>
            </div>
            <Row>
                <Col md={6}><h2>{device.price}$</h2></Col>
                <Col md={6}><Button onClick={_addToBasket}>To basket</Button></Col>
            </Row>
            </>:'Not avaliable now'}
        </Card>
        // <Card style={{with:"1rem", cursor:'pointer', backgroundColor:'red'}} border={'light'} onClick={()=>{navigate(DEVICE_ROUTE+'/'+device.id)}}>
        //     <Container style={{padding:0, margin:0}} className="text-center">
        //         <Image width={220} height={220} src = {process.env.REACT_APP_API_URL+device.img.split(';')[0]}/>                    
        //     </Container>
        //     <div className="d-flex justify-content-between align-item-center md-1">
        //         <div className="text-black-50">Samsung</div>
        //         <div>{Math.round(device.rate*10)/10}★</div>                    
        //     </div>
        //     <div>{device.name}</div>
        // </Card>
        // </Col>
    );
}

export default DeviceItem;