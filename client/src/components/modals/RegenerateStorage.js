import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Modal, Row } from "react-bootstrap";
import {regenerateRedisStorage} from "../../http/adminAPI";


const RegenerateStorage = ({ show, onHide}) => {
    const [_rawJson, _setRawJson] = useState('');
    const _submit = ()=>{
        console.log(_rawJson);
        regenerateRedisStorage(_rawJson).then(e=>{
            alert(e.data);
        })
        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Regenerate storage
                </Modal.Title>
            </Modal.Header>


            {show?<Modal.Body>
                Map:
                <Form.Control as="textarea" style={{height:"500px"}} onChange={e=>{_setRawJson(e.target.value)}}/>
            </Modal.Body>:''}
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={_submit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default observer(RegenerateStorage);