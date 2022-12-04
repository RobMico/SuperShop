import React from "react";
import { Col, Row } from "react-bootstrap";

const NamePanel = ({device, isAdmin})=>{    

    return(
        <Row className="">
          <Col md={10}>
            <h2>{device.name}</h2>
          </Col>
          {isAdmin?<Col md={2}>
          <h2>ID:{device.id}</h2>
          </Col>
        :''}
        </Row>
    );
}   

export default NamePanel;