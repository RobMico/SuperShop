import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react"
import { Container, Tabs, Tab, Form, Dropdown, Button } from "react-bootstrap"
import { Context } from "../../../.."
import { uploadJSON } from "../../../../http/adminAPI";
import { fetchTypes } from "../../../../http/typeAPI";

let UploadData = () => {
    const {types} = useContext(Context);
    const [_type, _setType] = useState(null);
    const [_file, _setFile] = useState(null);

    useEffect(()=>{
        console.log("DFGHJJHGFGHJBVHJ", types.types)
        if(types.types&&types.types.length==0)
        {
            fetchTypes().then(data=>{
                types.setTypes(data);
            })
        }
    }, [])


    const _submit = ()=>{
        if(!_type||!_file)
        {
            alert("Fill all fields")
            return;
        }
        const formData = new FormData();
        formData.append('typeId', _type.id);
        formData.append('data', _file);
        uploadJSON(formData).then((res)=>{
            alert(res.data);
        });
    }
    return (
        <Container>
            <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle>{_type?_type.name:'Select type'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {types.types.map(type =>
                            <Dropdown.Item
                                key={type.id}
                                onClick={()=>{_setType(type)}}>
                                {type.name}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                    <Form.Control className="mt-2" type="file" onChange={(e)=>{_setFile(e.target.files[0])}} />
                    <Button onClick = {_submit}>Submit</Button>
                </Dropdown>
        </Container>
    )
}

export default observer(UploadData);