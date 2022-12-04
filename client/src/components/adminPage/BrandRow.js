import React from "react"
import { Col, Container, Row, Image, Card, Button } from "react-bootstrap"

let BrandRow = ({brand, brandBuffer, showModal}) => {    
    let edit = ()=>{
        brandBuffer(brand);
        showModal(true);
    }
    
    return (
        <Card style={{ width: 'auto', paddingLeft:"25px", paddingRight:"25px", marginTop:"10px"}}>
        <Row xs="auto" className="align-items-center">
            <Col className="align-items-center">
                <Row>{brand.id}:{brand.name}</Row>
                <Row><Button variant="outline-danger" className="mt-2" onClick={edit}>Edit</Button></Row>
            </Col>
            <Col>
                <Image src={process.env.REACT_APP_API_URL + 'brands/' + (brand.img ? brand.img : "default.jpg")} height="100px" width="100px" />
            </Col>
            <Col>Description:{brand.description}</Col>            
        </Row>
        </Card>
    )
}

export default BrandRow;