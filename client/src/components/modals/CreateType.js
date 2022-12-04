import React, { useState } from "react";
import { Button, Form, Modal, Col, Row, Container, Image } from "react-bootstrap";
import { createType, editType } from "../../http/typeAPI";

const CreateType = ({ show, onHide, edit }) => {

    //Validation part    
    let [_nameValid, _setNameValid] = useState(true);
    const __validate = function () {
        //TODO
        let valid = true;
        if (value.length < 1 || value.length > 15) {
            valid = false;
            _setNameValid(false);
        }
        return valid;
    }
    //End of validation part


    const [value, setValue] = useState('');
    const [_description, _setDescription] = useState('');
    const [_img, _setImg] = useState(null);
    const [_editIdent, _setEditIdent] = useState(null);



    const _addType = () => {
        console.log("HHHH1")
        if (!__validate()) {
            return;
        }
        const formData = new FormData();
        formData.append('name', value)
        formData.append('description', _description)
        if (_img) {
            formData.append('img', _img[0]);
        }
        createType(formData).then(data => {
            setValue('')
            _setDescription('')
            _setImg(null)
            onHide();
        }).catch((ex => {
            try {
                alert(ex.response.data.message)
            } catch {
                alert(ex.message);
            }
            console.log(ex);
        }))
    }

    const _editType = async () => {
        console.log("HHHH2")
        try {
            const formData = new FormData();
            formData.append('typeId', edit.id)
            formData.append('name', value)
            formData.append('description', _description)

            if (_img) {
                formData.append('img', _img[0]);
            }

            let res = await editType(formData)
            setValue('')
            _setDescription('');
            _setImg(null)
            onHide();
            edit.name = value
            edit.description = _description
        } catch (ex) {
            try {
                alert(ex.response.data.message)
            } catch {
                alert(ex.message);
            }
            console.log(ex);
        }
    }

    const selectFile = (e) => {
        _setImg(e.target.files);
    }

    if (edit && _editIdent != edit.id) {
        _setEditIdent(edit.id)
        setValue(edit.name)
        _setDescription(edit.description ? edit.description : '')
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
                    {edit ? "Add new type" : "Edit type"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Control placeholder="Enter type name" value={value} onChange={e => { setValue(e.target.value); _setNameValid(true) }} />
                    {_nameValid ? '' : <div>Invalid name</div>}
                    <Form.Control placeholder="Enter type description" value={_description} onChange={e => _setDescription(e.target.value)} className="mt-2" />
                    {edit ? <Container className="mt-2">
                        <Form.Label> Current image:</Form.Label>
                        {edit.img ?
                            <Image src={process.env.REACT_APP_API_URL + 'types/' + edit.img} height="100px" width="100px" />
                            :
                            'NO IMAGE'
                        }
                        <Row> <Form.Label> New image:  </Form.Label><Form.Control className="mt-2" type="file" onChange={selectFile} />
                        </Row>
                    </Container> :
                        <Form.Control className="mt-2" type="file" onChange={selectFile} />
                    }
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={edit ? _editType : _addType}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateType;