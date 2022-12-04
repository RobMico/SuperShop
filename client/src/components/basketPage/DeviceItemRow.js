import React from "react";
import { Button, Card, Col, Image, Nav, NavLink, Row } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from "../../utils/consts";
import getFullPath from '../../utils/FullFilePath'


const DeviceItemRow = ({data, removeFromBasket})=>{    
    console.log('deviceItem render')
    const navigate = useNavigate();
    console.log(data.device)
    let frontIco = data.device.img.split(';')[0]
    console.log(frontIco)
    
    return(
    <Card style={{ width: '13rem' }}>
        <Card.Img variant="top" src={getFullPath(frontIco)} style={{width:'10rem', height:'10rem', marginLeft:'.8rem', marginTop:'.8rem'}}/>
        <Card.Body>
          <Link style={{textDecoration: 'none'}} to={DEVICE_ROUTE+'/'+data.device.id}>{data.device.name} {data.device.price}$</Link>
          <Card.Text>
            count:{data.count}
          </Card.Text>
          <Button onClick={removeFromBasket.bind(data)} variant="primary">Remove</Button>
        </Card.Body>
    </Card>
  
    );
}   

export default DeviceItemRow;