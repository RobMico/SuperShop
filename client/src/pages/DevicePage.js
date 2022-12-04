import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BigStar from '../assets/big_star.png'
import RatingWiew from "../components/devicePage/RatingWiew";
import DeviceInfo from "../components/devicePage/DeviceInfo";
import { addToBasket } from "../http/basketAPI";
import { fetchOneDevice } from "../http/deviceAPI";
import NamePanel from "../components/devicePage/NamePanel";
import { Context } from "..";
import ButtonsPanel from "../components/devicePage/ButtonsPanel";
import ImagesCarousel from "../components/devicePage/ImagesCarousel"
import BuyPanel from "../components/devicePage/BuyPanel"
import RecommendedDevices from "../components/RecommendedDevices";
import BreadcrumbPanel from "../components/BreadcrumbPanel";

const DevicePage = () => {
  const [device, setDevice] = useState({ info: [], rating: [] });
  const { id } = useParams();
  const { user } = useContext(Context);
  let isAdmin = user.user && user.user.role == "ADMIN";

  useEffect(() => {
    fetchOneDevice(id).then((data) => {
      setDevice(data);
    })
  }, []);
  return (
    <>{device.id ? <Container>
      <NamePanel device={device} isAdmin={isAdmin}></NamePanel>
      <BreadcrumbPanel typeId={device.typeId} deviceName={device.name}/>
      <ButtonsPanel device={device} isAdmin={isAdmin}></ButtonsPanel>

      <Row>
        <Col md={8}>
          <ImagesCarousel device={device} isAdmin={isAdmin}/>
        </Col>
        <Col md={4}>
          <BuyPanel device={device} isAdmin={isAdmin}/>          
        </Col>        
      </Row>
      
      <RecommendedDevices/>

      <DeviceInfo info={device.info}/>
      
      <RatingWiew device={device} user={user} />
    </Container>
      : <div>you shouldn't see this</div>}</>
  );
}

export default DevicePage;
