import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { Context } from "..";
import { Search } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";

const SearchBar = observer(() => {
    console.info('SearchBar render')
    const [_query, _setQuery] = useState('');
    const { types, devices } = useContext(Context);
    const navigate = useNavigate();
    const _submit=(ev)=>{
        ev.preventDefault();
        console.log(window.location.pathname);
        if(window.location.pathname.startsWith('/devices/'))
        {
            devices.setSavedFilters({nameSubstr:_query});
            if(devices.__rerenderTypeDevices)
            {
                devices.__rerenderTypeDevices(_query);   
            }
        }
        else
        {
            devices.resetStore();
            devices.setSavedFilters({nameSubstr:_query});
            navigate('/devices/custom');
        }
        
    }

    return (
        <Form className="d-flex" style={{backgroundColor:"white", borderRadius:"10px"}} onSubmit={_submit}>
            <Form.Control
                style={{background:"none", borderRadius:"10px 0 0 10px"}}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={_query}
                onChange={(e)=>{_setQuery(e.target.value)}}
            />
            <Button style={{background:"none", color:'black', borderRadius:"0 10px 10px 0", borderColor:'none' }} onClick={_submit}><Search/></Button>
        </Form>
    );
});

export default SearchBar;