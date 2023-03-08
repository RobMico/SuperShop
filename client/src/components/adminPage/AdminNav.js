import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { downloadLogs } from "../../http/adminAPI";
import { ADMIN_BRANDS, ADMIN_DEVICES, ADMIN_TYPES, ADMIN_ADVERT, ADMIN_CACHE } from "../../utils/consts";
import CreateBrand from "../modals/CreateBrand";
import CreateDevice from "../modals/CreateDevice";
import CreateType from "../modals/CreateType";



const AdminNav = observer(() => {
    const [brandVisible, setBrandVisible] =useState(false);
    const [typeVisible, setTypeVisible] =useState(false);
    const [deviceVisible, setDeviceVisible] =useState(false);
    const navigate = useNavigate();

    return (
        <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">                        
                        
                        <NavDropdown title="Types" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Button} onClick={()=>{setTypeVisible(true)}}>Add</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={ADMIN_TYPES}>
                                Edit                            
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Brands" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Button} onClick={()=>{setBrandVisible(true)}}>Add</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={ADMIN_BRANDS}>
                                Edit
                            </NavDropdown.Item>                            
                        </NavDropdown>
                        <NavDropdown title="Devices" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Button} onClick={()=>{setDeviceVisible(true)}}>Add</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={ADMIN_DEVICES}>
                                Show disabled
                            </NavDropdown.Item>                            
                        </NavDropdown>
                        <Nav.Link as={Link} to={ADMIN_ADVERT}>Adverts</Nav.Link>
                        <NavDropdown title="Logs" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Button} onClick={downloadLogs}>Downloads</NavDropdown.Item>                            
                        </NavDropdown>
                        <Nav.Link as={Link} to={ADMIN_CACHE}>Cache</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <CreateType show={typeVisible} onHide={()=>{setTypeVisible(false)}}/>
        <CreateDevice show={deviceVisible} onHide={()=>{setDeviceVisible(false)}}/>
        <CreateBrand show={brandVisible} onHide={()=>{setBrandVisible(false)}}/>
        </>
    );
});



export default AdminNav;