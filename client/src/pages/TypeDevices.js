import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Context } from "..";
import TypeBar from "../components/TypePage/TypeBar";
import DeviceList from "../components/DeviceList";
import Pages from "../components/Pages";
import { fetchDevices } from "../http/deviceAPI";

import { fetchTypes } from '../http/typeAPI';
import BreadcrumbPanel from "../components/BreadcrumbPanel";

const TypeDevices = observer(() => {
    console.info("TypeDevices render")
    const { devices, brands, filters } = useContext(Context);
    const { typeId } = useParams();
    const [loaded, setLoaded] = useState(false);

    //close this bullshit and never open again, it works
    {//rerender this page if user search something by search bar on top
        //saving rerender method to global devices storage, so that it can be called from search bar
        const [__rerenderMe, __setRerenderMe] = useState(null);
        devices.__rerenderTypeDevices = __setRerenderMe;
        useEffect(() => {
            if (loaded) {
                fetchDevices(null, devices.limit, (devices.page - 1) * devices.limit, JSON.stringify(filters.lastFilters)).then(data => {
                    setLoaded(true);
                    devices.setDevices(data.rows);
                    devices.setTotalCount(data.count);
                });
            }
        }, [__rerenderMe]);
    }



    //LOAD DEVICES ON PAGE LOADED
    useEffect(() => {
        if (typeId == "custom") {
            fetchDevices(null, devices.limit, (devices.page - 1) * devices.limit, JSON.stringify(filters.lastFilters)).then(data => {
                setLoaded(true);
                devices.setDevices(data.rows);
                devices.setTotalCount(data.count);
                //filters.setResultKey();
            });
        }
        else if (typeId) {
            if (filters.typeId == typeId) {
                fetchDevices(typeId, devices.limit, (devices.page - 1) * devices.limit, JSON.stringify(filters.lastFilters)).then(data => {
                    setLoaded(true);
                    devices.setDevices(data.rows);
                    devices.setTotalCount(data.count);
                });
            }
            else {
                filters.resetAll();
                fetchDevices(typeId, devices.limit).then(data => {
                    devices.setDevices(data.rows);
                    devices.setTotalCount(data.count);
                    setLoaded(true);
                });
            }
        }
    }, []);

    //LOAD DEVICES ON PAGINATION
    useEffect(() => {
        if (loaded) {
            fetchDevices(typeId == "custom" ? null : typeId, devices.limit, (devices.page - 1) * devices.limit, JSON.stringify(filters.lastFilters)).then(data => {
                devices.setDevices(data.rows);
                devices.setTotalCount(data.count);
            });
        }
    }, [devices.page]);


    return (
        <Container>{loaded ?
            <Row>

                <Col md={2}>
                    <TypeBar typeId={typeId} />
                </Col>
                <Col md={10}>
                    <BreadcrumbPanel typeId={typeId} />
                    <DeviceList devices={devices.devices} />
                    <Pages />
                </Col>
            </Row>
            : <></>}
        </Container>
    );
});

export default TypeDevices;
