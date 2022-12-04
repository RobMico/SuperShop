import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Context } from "../..";
import { fetchBrands } from "../../http/brandAPI";
import { editDevice } from "../../http/deviceAPI";
import { fetchTypes } from "../../http/typeAPI";


const EditDevice = ({ show, onHide, edit }) => {

    //Validation part    
    let [nameValid, setNameValid] = useState(true);
    let [priceValid, setPriceValid] = useState(true);    
    let [brandValid, setBrandValid] = useState(true);
    let [typeValid, setTypeValid] = useState(true);
    const __validate = function () {
        //TODO        
        let valid = true;
        if (name.length < 4 || name.length > 100) {
            valid = false;
            setNameValid(false);
        }
        if (!price || price < 0) {
            valid = false;
            setPriceValid(false);
        }        
        if (!brands.selectedBrand.id) {
            valid = false;
            setBrandValid(false)
        }
        if (!types.selectedType.id) {
            valid = false;
            setTypeValid(false)
        }

        info.forEach(e => {
            if (!e.title.length || e.title.length > 30) {
                valid = false;
                e.titleValid = false;
            }
            if (!e.textPart.length || e.textPart.length > 30) {
                valid = false;
                e.valueValid = false;
            }
        })

        // if (_suggestProps) {
        //     _suggestProps.forEach(e => {
        //         if (!e.textPart.length || e.textPart.length > 30) {
        //             valid = false;
        //             e.valueValid = false;
        //         }
        //     })
        // }
        if (!valid) {
            setInfo([...info]);
        }
        return valid;
        //return emailValid && nameValid && passwordValid && confPasswordValid;
    }
    //End of validation part



    const { types, brands } = useContext(Context);

    const [name, setName] = useState(edit.name);
    const [price, setPrice] = useState(edit.price);
    const [info, setInfo] = useState(edit.info.map(e => { e.number = e.id; return e }));


    useEffect(() => {

        types.types&&types.types.length == 0 && fetchTypes().then(data => {
            types.setTypes(data);
            types.setSelectedType(types.types.find(e => e.id == edit.typeId))
        });
        brands.brands.length == 0 && fetchBrands().then(data => {
            brands.setBrands(data);
            brands.setSelectedBrand(brands.brands.find(e => e.id == edit.brandId))
        });

        types.setSelectedType(types.types.find(e => e.id == edit.typeId) | [])
        brands.setSelectedBrand(brands.brands.find(e => e.id == edit.brandId) | [])
    }, []);

    if (!show) {
        return;
    }

    const _selectType = async function () {
        types.setSelectedType(this);
    }

    const addInfo = () => {
        setInfo([...info, { title: '', numPart: null, textPart: '', number: Date.now() }])
    }
    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? { ...i, [key]: value, titleValid: true, valueValid: true } : i));
        // setInfo(info.map(i => {
        //     i.number === number && (i[key] = value)
        //     return i;
        // }));
    }

    const _editDevice = () => {
        if(!__validate())
        {
            return
        }        
        const formData = new FormData();
        formData.append('deviceId', edit.id);
        formData.append('name', name);
        formData.append('price', price);

        formData.append('brandId', brands.selectedBrand.id);
        formData.append('typeId', types.selectedType.id);
        formData.append('info', JSON.stringify(info))
        editDevice(formData).then(data => {
            onHide()
        });
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
                    Add new device
                </Modal.Title>
            </Modal.Header>


            {show?<Modal.Body>
                <Row className="mt-2">
                    <Col md={1}><Form.Label>Name:</Form.Label></Col>
                    <Col><Form.Control placeholder="Enter device name" value={name} onChange={e => setName(e.target.value)} /></Col>
                    {nameValid ? '' : <div>Incorrect name</div>}
                </Row>
                <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle>{types.selectedType.name || 'Select type'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {types.types.map(type =>
                            <Dropdown.Item
                                key={type.id}
                                onClick={_selectType.bind(type)}>
                                {type.name}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                {typeValid ? '' : <div>Incorrect type</div>}
                <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle>{brands.selectedBrand.name || 'Select brand'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {brands.brands.map(brand =>
                            <Dropdown.Item
                                key={brand.id}
                                onClick={() => { brands.setSelectedBrand(brand) }}>
                                {brand.name}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                {brandValid ? '' : <div>Incorrect brand</div>}
                <Row className="mt-2">
                    <Col md={1}><Form.Label>Price:</Form.Label></Col>
                    <Col><Form.Control placeholder="Enter device price" type="Number" value={price} onChange={e => setPrice((e.target.value))} /></Col>
                </Row>
                <Button variant="outline-dark" className="mt-2 mb-2" onClick={addInfo}>Add new property</Button>
                {info.map(i =>{return i.remove?<></>:<Row className="mt-4" key={i.number}>                    
                    <Col md={5}>
                        {i.id ? <Form.Label>{i.title}:</Form.Label> :
                            <Form.Control placeholder="Name of property" value={i.title} onChange={e => changeInfo('title', e.target.value, i.number)} />}
                            {i.titleValid == false ? <div>Incorrect title</div> : ''}
                    </Col>
                    <Col md={5}>
                        <Form.Control placeholder="Value of property" value={i.textPart} onChange={e => changeInfo('textPart', e.target.value, i.number)} />
                        {i.valueValid == false ? <div>Incorrect value</div> : ''}
                    </Col>
                    <Col md={1}>
                        <Button variant="outline-danger" onClick={() => changeInfo('remove', true, i.number)}>Delete</Button>
                    </Col>
                </Row>})}
            </Modal.Body>:''}
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={_editDevice}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default observer(EditDevice);