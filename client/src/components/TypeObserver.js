import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "..";
import { DEVICES_ROUTE } from "../utils/consts";

const TypeObserver = observer(()=>{    
    const {types, devices} = useContext(Context);  
    const navigate = useNavigate();
    
    let selectType = function (){                
        navigate(DEVICES_ROUTE+this.id);
        devices.setDevices([]);
        devices.resetStore();
    }

    return(
        <ListGroup className="mt-2">            
            {types.types.map(el=>
                <ListGroup.Item style={{cursor:'pointer', border:'0px'}} key={el.id} onClick={selectType.bind(el)}>{el.name}</ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeObserver;