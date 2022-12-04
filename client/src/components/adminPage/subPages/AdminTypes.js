import React, { useContext, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { Context } from "../../..";
import { fetchTypes } from "../../../http/typeAPI";
import AddTypeProp from "../../modals/AddTypeProp";
import CreateType from "../../modals/CreateType";
import AdminNav from "../AdminNav";
import TypeRow from "../TypeRow";

let AdminTypes = ()=>{
    const { types } = useContext(Context);    
    const [_types, set_types] = useState(null);

    const [typeVisible, setTypeVisible] =useState(false);
    const [typeBuffer, setTypeBuffer] = useState(null)        

    const [_addPropsVisible, _setAddPropsVisible] = useState(false);
    const [_addPropsBuffer, _setAddPropsBuffer] = useState(null)        

    useEffect(() => {
        types.types&&types.types.length==0&&fetchTypes().then(data => {
            types.setTypes(data);                        
            set_types(data)
        });        
    }, []);    
    return (
        <Container>
            <AdminNav />
            <CreateType show={typeVisible} onHide={()=>{setTypeVisible(false)}} edit={typeBuffer}/>
            <AddTypeProp show={_addPropsVisible} onHide={()=>{_setAddPropsVisible(false)}} data={_addPropsBuffer}/>
            {types.types.map(e =><TypeRow type={e} typeBuffer={setTypeBuffer} showEditModal={setTypeVisible} 
            showAddPropModal={_setAddPropsVisible} addPropBuffer={_setAddPropsBuffer} key={e.id}/>)}
        </Container>
    )
}

export default AdminTypes;