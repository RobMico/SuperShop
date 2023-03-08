import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ChatFill } from 'react-bootstrap-icons';
import { setDeviceAvaliable, setDeviceDisable } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import EditDeviceImages from "../modals/EditDeviceImages";
import EditDevice from "../modals/EditDevice";


const ButtonsPanel = ({ device, isAdmin }) => {    
    const [_editImagesVisible, _setEditImagesVisible] =useState(false);
    const [_editDeviceVisible, _setEditDeviceVisible] =useState(false);
    let arr = [];
    const [_rerenderme, _reremderMe] = useState(false)


    for (let i = 1; i <= 5; i++) {
        if (device.rate >= i) {
            arr.push(1);
        }
        else {
            arr.push(0);
        }
    }    

    const _disableDevice =async ()=>{
        await setDeviceDisable(!device.disabled,device.id);
        device.disabled = !device.disabled;        
        _reremderMe(!_rerenderme);
    }

    const _setAvaliable =async ()=>{
        await setDeviceAvaliable(!device.avaliable, device.id)
        device.avaliable = !device.avaliable;
        _reremderMe(!_rerenderme);
    }

    const _editDevice = ()=>{
        _setEditDeviceVisible(true);
    }

    const _editImages = ()=>{
        _setEditImagesVisible(true);
    }
    

    return (
        <Row className="d-flex">
            <Col className="d-flex" md={4}>
                <div className="d-flex">
                    {arr.map((e, i) =>
                        <div className={e == 1 ? "text-warning" : "text-secondary"} key={i}>★</div>
                    )}
                </div>
                <div style={{ marginLeft: '0.5rem' }}>{device.ratecount}<ChatFill className="text-warning" /></div>
            </Col>            
            {isAdmin?<Col className="d-flex" md={8}>
                <Container style={{float:"right"}} className="d-flex justify-content-end">
                <Button variant="danger" onClick={_editDevice}>
                    Edit
                </Button>
                <Button variant="danger" onClick={_disableDevice}>
                    {device.disabled?'Enable':'Disable'}
                </Button>
                <Button variant="danger" onClick={_setAvaliable}>
                    {device.avaliable?'Avaliable':'Not avaliable'}
                </Button>
                <Button variant="danger" onClick={_editImages}>
                    Edit images
                </Button>
                <EditDeviceImages show={_editImagesVisible} onHide={_setEditImagesVisible} device={device}/>
                <EditDevice show={_editDeviceVisible} onHide={_setEditDeviceVisible} edit={device}/>
                </Container>
            </Col>:''}
            
        </Row>
    );
}

export default observer(ButtonsPanel);