import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Context } from "../..";
import { fetchBrands } from "../../http/brandAPI";
import { createDevice } from "../../http/deviceAPI";
import { fetchProps, fetchTypes } from "../../http/typeAPI";
import objectMap from '../../utils/objectMap';


const CreateDevice = ({ show, onHide }) => {

    //Validation part
    let [nameValid, setNameValid] = useState(true);
    let [priceValid, setPriceValid] = useState(true);
    let [imagesValid, setImagesValid] = useState(true);
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
        if (!file || file.length < 3 || file.length > 8) {
            valid = false;
            setImagesValid(false);
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

        if (_suggestProps) {
            _suggestProps.forEach(e => {
                if (!e.textPart.length || e.textPart.length > 30) {
                    valid = false;
                    e.valueValid = false;
                }
            })
        }
        if (!valid) {
            setInfo([...info]);
            if(_suggestProps)
            {
                _setSuggestProps([..._suggestProps]);
            }
        }
        return valid;
        //return emailValid && nameValid && passwordValid && confPasswordValid;
    }
    //End of validation part



    const { types, brands } = useContext(Context);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState([]);
    const [info, setInfo] = useState([]);

    const [_suggestProps, _setSuggestProps] = useState(null)

    useEffect(() => {
        types.types&&types.types.length==0&&fetchTypes().then(data => {
            types.setTypes(data);
        });
        fetchBrands().then(data => {
            brands.setBrands(data);
        });
    }, []);

    const _selectType = async function () {
        setTypeValid(true)
        try {
            const data = await fetchProps(this.id);
            _setSuggestProps(types.parsePropsArr(data))
        } catch {
            _setSuggestProps(null);
        }
        types.setSelectedType(this);
    }

    const addInfo = () => {
        setInfo([...info, { title: '', numPart: null, textPart: '', number: Date.now() }])
    }
    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }
    const selectFile = (e) => {
        setImagesValid(true)        
        setFile(e.target.files)
    }
    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? { ...i, [key]: value, titleValid: true, valueValid: true } : i));
    }
    const _removeSuggestInfo = (obj) => {
        _setSuggestProps(_suggestProps.filter(i => i !== obj))
    }
    const _changeSuggestInfo = (key, value, obj) => {
        _setSuggestProps(_suggestProps.map(i => i === obj ? { ...i, [key]: value } : i));
    }

    const AddDevice = () => {
        if (!__validate()) {
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);

        for (const f of file) {
            formData.append('img', f);
        }



        formData.append('brandId', brands.selectedBrand.id);
        formData.append('typeId', types.selectedType.id);
        formData.append('info', JSON.stringify(info.concat(_suggestProps.map(e => { return { title: e.name, textPart: e.textPart } }))))        
        createDevice(formData).then(data => { //onHide() });            
            onHide()
        });
    }

    const _clearAll = () => {
        setName('');
        setPrice(0);
        setFile(null);
        setInfo([]);
        _setSuggestProps(null);
        brands.setSelectedBrand({})
        types.setSelectedType({});
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
                <Button onClick={_clearAll}>Clear all</Button>
                <Row className="mt-2">
                    <Col md={1}><Form.Label>Name:</Form.Label></Col>
                    <Col><Form.Control placeholder="Enter device name" value={name} onChange={e => { setName(e.target.value); setNameValid(true) }} /></Col>
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
                {typeValid ? '' : <div>Type not chosen</div>}
                <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle>{brands.selectedBrand.name || 'Select brand'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {brands.brands.map(brand =>
                            <Dropdown.Item
                                key={brand.id}
                                onClick={() => { brands.setSelectedBrand(brand); setBrandValid(true) }}>
                                {brand.name}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                {brandValid ? '' : <div>Brand not chosen</div>}
                <Row className="mt-2">
                    <Col md={1}><Form.Label>Price:</Form.Label></Col>
                    <Col><Form.Control placeholder="Enter device price" type="Number" value={price} onChange={e => { setPrice((e.target.value)); setPriceValid(true) }} /></Col>
                </Row>
                {priceValid ? '' : <div>Incorrect price</div>}
                <Form.Control className="mt-2" type="file" multiple onChange={selectFile} />
                {imagesValid ? '' : <div>Upload 3 to 8 images</div>}
                <Button variant="outline-dark" className="mt-2 mb-2" onClick={addInfo}>Add new property</Button>
                {_suggestProps ? _suggestProps.map((el) =>
                    <InputGroup className="mb-3" key={el.name}>
                        <Form.Label >{el.name}:</Form.Label>
                        <Form.Control aria-label="Text input with dropdown button" value={el.textPart} onChange={e => _changeSuggestInfo('textPart', e.target.value, el)} />
                        {el.valueValid == false ? <div>Incorrect value</div> : ''}
                        <DropdownButton
                            variant="outline-secondary"
                            title="Suggest"
                            id="input-group-dropdown-2"
                            align="end"
                        >
                            {el.vals.map(e =>
                                <Dropdown.Item as={Button} key={e} onClick={() => { _changeSuggestInfo('textPart', e, el) }}>{e}</Dropdown.Item>
                            )}
                        </DropdownButton>
                        <Button variant="outline-danger" onClick={() => _removeSuggestInfo(el)}>Delete</Button>
                    </InputGroup>

                ) : ''}
                {info.map(i => <Row className="mt-4" key={i.number}>
                    <Col md={5}>
                        <Form.Control placeholder="Name of property" value={i.title} onChange={e => { changeInfo('title', e.target.value, i.number) }} />
                        {i.titleValid == false ? <div>Incorrect title</div> : ''}
                    </Col>
                    <Col md={5}>
                        <Form.Control placeholder="Value of property" value={i.textPart} onChange={e => { changeInfo('textPart', e.target.value, i.number) }} />
                        {i.valueValid == false ? <div>Incorrect value</div> : ''}
                    </Col>
                    <Col md={1}>
                        <Button variant="outline-danger" onClick={() => removeInfo(i.number)}>Delete</Button>
                    </Col>
                </Row>)}
            </Modal.Body>:<></>}
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={AddDevice}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default observer(CreateDevice);