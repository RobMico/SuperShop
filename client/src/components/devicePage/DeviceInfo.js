import React from "react";
import { Row } from "react-bootstrap";

const DeviceInfo = ({info})=>{    
    return(
        <Row className="d-flex flex-column m-3">
          <h2>Characteristics:</h2>
          {info.map((_info, index)=>
            <Row key={_info.id} style={{background:index%2==0?'lightgray':'transparent', padding:10}}>
              {_info.title}:{_info.textPart}
            </Row>
            )}
        </Row>
    );
}   

export default DeviceInfo;