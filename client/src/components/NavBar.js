import React, { useContext } from "react";
import { Context } from "..";
import {Nav, Container, Navbar, Button, Form, Col, Row} from 'react-bootstrap'
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite"
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";




const NavBar =observer(()=>{
  // return(<>'hello'</>);
      const {user} = useContext(Context);      
      const navigate = useNavigate();      
      console.debug("NavBar render");
      var logout = ()=>{
        user.logout();
        localStorage.removeItem('token');
        navigate(SHOP_ROUTE);
      };
  
      return(
          <Navbar bg="dark" variant="dark">
            <Container>
              <Col md={2}>
                <Link to={SHOP_ROUTE} style={{ textDecoration: 'none', color:"white" }}>SHOP NAME</Link>
              </Col>              
              <Col md={4}>
                <SearchBar/>
             </Col>
             <Col md={2}>
                
             </Col>
             <Col md={4} >
              <Row className="d-flex justify-content-end">
              {user.isAuth?
              <Nav className="d-flex justify-content-end">
                  <Button variant="outline-light" onClick={logout}>Log out</Button>
                  <Button variant="outline-light" onClick={()=>{navigate(BASKET_ROUTE)}}>Basket</Button>
                  {user.user.role=="ADMIN"&&<Button variant="outline-light" onClick={()=>{navigate(ADMIN_ROUTE)}}>Admin panel</Button>}
              </Nav>
              :
              <Nav className="d-flex justify-content-end">
                  <Button className="mr-auto" variant="outline-light" onClick={()=>{navigate(LOGIN_ROUTE)}}>Authorization</Button>                
              </Nav>
              }
              </Row>
              </Col>
            </Container>
          </Navbar>        
      );
})

export default NavBar;