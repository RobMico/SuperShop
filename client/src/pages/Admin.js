import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateDevice from "../components/modals/CreateDevice";
import CreateBrand from "../components/modals/CreateBrand";
import AdminNav from "../components/adminPage/AdminNav";


const Admin = () => {
  

    return (
      <Container >        
        <AdminNav/>        
      </Container>
    );
  }
  
export default Admin;
  