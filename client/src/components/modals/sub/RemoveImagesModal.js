import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Col, Row, Container, Image } from "react-bootstrap";
import {editDeviceImages} from '../../../http/deviceAPI';

const RemoveImagesModal = ({ device, onHide }) => {

    const [_curImgs, _setCurImgs] = useState([]);
    useEffect(() => {
        _setCurImgs(device.img.split(';').filter(e => e != '').map(e => { return { src: e, remove: false } }));
    }, [])

    const _setRemove = function (){        
        _setCurImgs(_curImgs.map(e=>{
            if(e==this)
            {
                e.remove = !e.remove;
            }
            return e;
        }));
    }

    const _send = async ()=>{
        const formData = new FormData();
        formData.append('deviceId', device.id);
        formData.append('removeImgs', _curImgs.reduce((prev, cur)=>{
            if(cur.remove)
            {
                prev+=cur.src+';';
            }
            return prev;
        }, ''))        

        try{
            await editDeviceImages(formData)
            onHide(false);

        }catch{
            alert("Something was wrong")
        }

    }

    return <>
        <Form>
            <Form.Label>Click on image to select</Form.Label>
            {_curImgs.map(e => <Row>
                <Col><Button onClick={_setRemove.bind(e)} style={{ backgroundColor: e.remove ? 'red' : 'white', border: 'none' }}>
                    <Image height="100px" width="100px" src={process.env.REACT_APP_API_URL + e.src} />
                </Button></Col>
            </Row>)}
            <Button variant="outline-danger" onClick={_send}>Remove</Button>
        </Form>
    </>
}

export default RemoveImagesModal;