import React, { useState } from "react"
import { Col, Container, Row, Image, Card, Button } from "react-bootstrap"
import { fetchProps } from "../../http/typeAPI";
import getFullPath from "../../utils/FullFilePath";
import TypePropRow from "./TypePropRow";

var myMap = function (obj, callback) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof callback === 'function') {
                result.push(callback(obj[key], key, obj));
            }
        }
    }
    return result;
};

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};


let TypeRow = ({ type, typeBuffer, showEditModal, showAddPropModal, addPropBuffer }) => {

    const [showProps, setShowProps] = useState(false);
    const [_props, _setProps] = useState({});

    let edit = () => {
        typeBuffer(type);
        showEditModal(true);
    }

    let addProp = () => {
        addPropBuffer({ typeId: type.id })
        showAddPropModal(true)
    }

    let _showProps = async () => {
        setShowProps(!showProps)        
        if(Object.keys(_props).length==0) {
            let data = await fetchProps(type.id)
            let tmp = data.map(e => { 
                let _tmp =e.str.split('_')
                return {
                    count:e.count,
                    title:_tmp[0],
                    value:_tmp[1]
                }
            })
            _setProps(groupBy(tmp, 'title'))
        }
    }





    return (
        <Card style={{ width: 'auto', paddingLeft: "25px", paddingRight: "25px", marginTop: "10px", justifyContent: 'left' }}>
            <Row xs="auto" className="align-items-center">
                <Col className="align-items-center">
                    <Row>{type.id}:{type.name}</Row>
                    <Row><Button variant="outline-warning" className="mt-2" onClick={edit}>Edit</Button></Row>
                </Col>
                <Col>
                    <Image src={(type.img ? getFullPath(type.img, 'types/') :process.env.REACT_APP_API_URL+"types/default.jpg")} height="100px" width="100px" />
                </Col>
                <Col>Description:{type.description}</Col>
                <Col style={{ justifyContent: 'left' }} className="align-items-center">
                    <Row><Button variant="outline-warning" onClick={addProp}>Add</Button></Row>
                    <Row><Button onClick={_showProps} variant="outline-success">{showProps?'/\\':'\\/'}</Button></Row>
                </Col>
            </Row>
            {showProps? myMap(_props, (el, title)=><TypePropRow props={el} title={title} key={title} />):''}
            {/* {showProps ? _props.map(e => ) : ''} */}
        </Card>
    )
}

export default TypeRow;