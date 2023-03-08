import React, { useEffect, useState } from "react"
import { Col, Container, Row, Image, Card, Button } from "react-bootstrap"

let TypePropRow = ({props, title}) => {
    return (
        <Card style={{ width: 'auto', paddingLeft:"25px", paddingRight:"25px", marginTop:"10px", justifyContent:'left'}}>
        <Row xs="auto" className="align-items-center">
            <Col className="align-items-center">
                {title}:
            </Col>
            <Col>{props.map(e=><span key={e.value}>{e.value}({e.count}); </span>)} </Col>
        </Row>
        </Card>
    )
}

export default TypePropRow;