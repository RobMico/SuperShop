import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Container, Row, Image } from "react-bootstrap";
import { createBrand, editBrand } from "../../http/brandAPI";
import getFullPath from "../../utils/FullFilePath";

const CreateBrand = ({ show, onHide, edit }) => {

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

    const _addBrand = () => {
        if (!__validate()) {
            return;
        }
        const formData = new FormData();
        formData.append('name', value)
        formData.append('description', _description)
        if (_img) {
            formData.append('img', _img[0]);
        }

        createBrand(formData).then(data => {
            setValue('')
            _setDescription('');
            _setImg(null)
            onHide();
        }).catch((ex => {
            try {
                alert(ex.response.data.message)
            } catch {
                alert(ex.message);
            }
            console.error(ex);
        }))
    }
    const _editBrand = () => {
        const formData = new FormData();
        formData.append('brandId', edit.id)
        formData.append('name', value)
        formData.append('description', _description)
        if (_img) {
            formData.append('img', _img[0]);
        }

        editBrand(formData).then(data => {
            setValue('')
            _setDescription('');
            _setImg(null)
            onHide();
            edit.name = value
        }).catch((ex => {
            try {
                alert(ex.response.data.message)
            } catch {
                alert(ex.message);
            }
            console.error(ex);
        }))
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
                    {edit ? "Edit brand" : "Add new brand"}
                </Modal.Title>
            </Modal.Header>

            {show?<Modal.Body>
                <Form>
                    <Form.Control placeholder="Enter brand name" value={value} onChange={e => { setValue(e.target.value); _setNameValid(true) }} />
                    {_nameValid ? '' : <div>Invalid name</div>}
                    <Form.Control placeholder="Enter brand description" value={_description} onChange={e => _setDescription(e.target.value)} className="mt-2" />
                    {edit ? <Container className="mt-2">
                        <Form.Label> Current image:</Form.Label>
                        {edit.img ?
                            <Image src={getFullPath(edit.img, 'brands/')} height="100px" width="100px" />
                            :
                            'NO IMAGE'
                        }
                        <Row> <Form.Label> New image:  </Form.Label><Form.Control className="mt-2" type="file" onChange={selectFile} />
                        </Row>
                    </Container> :
                        <Form.Control className="mt-2" type="file" onChange={selectFile} />
                    }
                </Form>
            </Modal.Body>:''}
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={edit ? _editBrand : _addBrand}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateBrand;