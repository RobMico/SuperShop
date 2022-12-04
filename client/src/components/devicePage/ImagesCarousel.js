import React from "react";
import { Button, Carousel, Col, Container, Row } from "react-bootstrap";
import { ChatFill } from 'react-bootstrap-icons';
import getFullPath from '../../utils/FullFilePath';

const ImagesCarousel = ({ device, isAdmin }) => {
    console.log(device)
    return (
        <Carousel slide={false} interval={null}>
            {device.img.split(';').map((e, i)=>
                e?<Carousel.Item key={e}><img
                    className="d-block w-100"
                    src={getFullPath(e)}
                    alt="First slide"
                    height="400px"
                /></Carousel.Item>:''
            )}            
        </Carousel>
    );
}

export default ImagesCarousel;