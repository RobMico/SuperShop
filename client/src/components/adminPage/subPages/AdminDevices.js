import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { Context } from "../../..";
import { fetchDisabledDevices } from "../../../http/deviceAPI";
import DeviceList from "../../DeviceList";
import Pages from "../../Pages";
import AdminNav from "../AdminNav";

let AdminDevices = () => {
    const { devices } = useContext(Context);
    const [_loaded, _setloaded] = useState(false);

    let limit = 40, offset = 0;
    useEffect(() => {
        fetchDisabledDevices(limit, offset).then((data) => {
            devices.setDevices(data.rows);
            devices.setTotalCount(data.count);    
            _setloaded(true)
        })
    }, [])

    useEffect(() => {
        fetchDisabledDevices(devices.limit, (devices.page - 1) * devices.limit).then(data => {
            devices.setDevices(data.rows);
            devices.setTotalCount(data.count);            
            _setloaded(true)
        });
    }, [devices.page]);


    return (
        <Container>
            <AdminNav />
            {_loaded?<Container>
                <DeviceList devices={devices.devices} recomendations={false} />
                <Pages />
            </Container>
            :''}
        </Container>
    )
}

export default observer(AdminDevices);