import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Card, ListGroup, Nav, Row } from "react-bootstrap";
import { Context } from "..";

const BrandBar = observer(()=>{
    console.info('Brand bar render');
    const {brands, devices} = useContext(Context);
    return(
        <ul className="row list-group-horizontal m-2">
            <li className="col-3 list-group-item" key="-1" onClick={()=>{brands.setSelectedBrand({});devices.setPage(1)}}>Clear all</li>
            {brands.brands.map(el=>
                <li style={{background:el.id==brands.selectedBrand.id?'blue':'white'}} className="col-3 list-group-item" key={el.id} onClick={()=>{brands.setSelectedBrand(el);devices.setPage(1)}}>{el.name}</li>
            )}
        </ul>        
    );
});

export default BrandBar;