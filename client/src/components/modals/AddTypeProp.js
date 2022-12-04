import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { addTypeProps, loadSuggestions } from "../../http/typeAPI";


const AddTypeProp = ({ show, onHide, data }) => {

    //Validation part
    let [_propNameValid, setPropNameValid] = useState(true);
    const __validate = function () {
        //TODO                
        let valid = true;
        if (_propName.length < 1 || _propName.length > 300) {            
            setPropNameValid(false);
            valid = false;
        }
        return valid;
        //return emailValid && nameValid && passwordValid && confPasswordValid;
    }
    //End of validation part


    const [_propValues, _setPropValues] = useState([]);
    const [_propName, _setPropName] = useState('');
    const [_customProp, _setCustomProp] = useState('');

    let _loadSuggestions = async () => {
        let data = await loadSuggestions(_propName);
        data = data.filter(e => {
            let a = _propValues.find(el => !el.suggested && el.value == e.textPart)
            return !a
        })
        _setPropValues([
            ...data.map(e => { return { value: e.textPart, count: e.count, suggested: true } }),
            ..._propValues.filter(e => !e.suggested)])
    }
    let removeInfo = (prop) => {
        _setPropValues(_propValues.filter(e => e.value != prop.value))
    }
    let changeInfo = (prop, sugg) => {
        _setPropValues(_propValues.map(e => {
            if (e.value == prop.value) {
                e.suggested = sugg;
            }
            return e
        }))

    }
    let addProp = () => {
        if (_customProp.length > 30) {
            alert("Prop value too large")
        }
        else {
            _setPropValues([..._propValues, { value: _customProp, suggested: false }])
            _setCustomProp('');
        }
    }

    let submit = async () => {
        if (__validate()) {
            if (_propName) {
                let tmp = _propValues.reduce((prew, cur) => {
                    if (!cur.suggested) {
                        prew.push(cur.value)
                    }
                    return prew
                }, [])

                let result = await addTypeProps(data.typeId, _propName, JSON.stringify(tmp))
                onHide(true)
                _setPropValues([]);
                _setPropName('');
                _setCustomProp('');
            }
        }
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
                    Add type props
                </Modal.Title>
            </Modal.Header>

            {show?<Modal.Body>
                <Form>
                    <Row> <Form.Control placeholder="Enter prop name" value={_propName} onChange={e => {_setPropName(e.target.value);setPropNameValid(true)}} />
                        {_propNameValid?'':<div>Prop name too large</div>}
                        {_propName != '' ? <Button onClick={_loadSuggestions}>Load suggestions</Button> : ''}
                    </Row>
                </Form>
                <Form className="mt-3">
                    <Row>
                        <Col md={4}><Form.Label>Prop value:</Form.Label></Col>
                        <Col md={6}> <Form.Control value={_customProp} onChange={e => _setCustomProp(e.target.value)}></Form.Control></Col>
                        <Col md={2}><Button onClick={addProp}>Add</Button></Col>
                    </Row>
                </Form>
                {_propValues.map(i => <Row className="mt-4" key={i.value}>
                    <Col md={2}>
                        <Form.Check checked={!i.suggested} onChange={e => changeInfo(i, !i.suggested)} />
                    </Col>
                    <Col md={4}>
                        <Form.Label>{i.value}</Form.Label>
                    </Col>
                    <Col md={4}>
                        {i.count ? <Form.Label>Device count:{i.count}</Form.Label> : ''}
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-danger" onClick={() => removeInfo(i)}>Delete</Button>
                    </Col>
                </Row>)}
            </Modal.Body>:<></>}
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={submit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddTypeProp;