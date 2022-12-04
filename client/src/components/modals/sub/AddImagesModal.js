import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Col, Row, Container, Image } from "react-bootstrap";
import { editDeviceImages } from "../../../http/deviceAPI";


const AddImagesModal = ({ device, onHide }) => {
    const [_file, _setFile] = useState([]);

    const _send = async ()=>{
        const formData = new FormData();
        formData.append('deviceId', device.id);        
        
        for (const f of _file) {
            formData.append('addImgs', f);
        }

        try{
            await editDeviceImages(formData)
            onHide(false);

        }catch{
            alert("Something was wrong")
        }

    }

    const selectFile = (e) => {        
        _setFile(e.target.files)
    }

    return <>
        <Form>
            <Form.Label>Upload images</Form.Label>
            <Form.Control className="mt-2" type="file" multiple onChange={selectFile} />            
            <Button variant="outline-success" onClick={_send}>Add</Button>
        </Form>
    </>
}

export default AddImagesModal;