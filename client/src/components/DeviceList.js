import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Row } from "react-bootstrap";
import { Context } from "..";
import DeviceItem from "./DeviceItem";
import RecommendedDevices from "./RecommendedDevices";

function LoadDevices(devices, recomendations){
    const rows = [];
    for (let i = 0; i < devices.length; i++) {

        if(recomendations&&i!=0 &&i%4==0)
        {            
            rows.push(<RecommendedDevices key={i}/>)
        }
        rows.push(<DeviceItem key = {devices[i].id} device={devices[i]}/>);
    }
    return rows;
}


const DeviceList = observer(({devices, recomendations=true})=>{
    console.info('deviceList render')
    //const {devices, types, brands, user} = useContext(Context);
     
    return (
        <Row className="d-flex">
            {LoadDevices(devices, recomendations=recomendations)}
        </Row>
    );
});



export default DeviceList;