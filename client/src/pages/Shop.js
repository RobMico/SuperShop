import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Context } from "..";
import DeviceList from "../components/DeviceList";
import Pages from "../components/Pages";
import BrandsCarousel from "../components/shopPage/BrandsCarousel";
import TypeObserver from "../components/TypeObserver";
import { fetchDevices } from "../http/deviceAPI";
import { fetchTypes } from '../http/typeAPI';

const Shop = observer(() => {
  const { devices, types, brands } = useContext(Context);
  const [loaded, setLoaded] = useState(false);
  const [_rerender, _setRerender] = useState(false);

  //loading data on page loaded
  useEffect(() => {
    if (types.types.length == 0) {
      fetchTypes().then(data => {
        types.setTypes(data);
      });
    }
    //TODO
    // fetchBrands().then(data=>{      
    //   brands.setBrands(data);
    // });
    fetchDevices(null, devices.limit).then(data => {
      devices.setDevices(data.rows);
      devices.setTotalCount(data.count);
      devices.setPage(1);
    });
  }, []);

  //load devices on pagination
  useEffect(() => {
    fetchDevices(types.selectedType ? types.selectedType.id : null, devices.limit, (devices.page - 1) * devices.limit).then(data => {
      devices.setDevices(data.rows);
      devices.setTotalCount(data.count);
      setLoaded(true);
      _setRerender(!_rerender);
    });
  }, [devices.page]);

  return (
    <Container>
      {loaded ?
        <Row>
          <Col md={2}>
            <TypeObserver />
          </Col>
          <Col md={10}>
            <BrandsCarousel/>
            <DeviceList devices={devices.devices} __rerender={_rerender} />
            {/* <Pages /> */}
          </Col>
        </Row>
        : <></>}
    </Container>
  );
});

export default Shop;
