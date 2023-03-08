import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Button, Card, Container, Form, NavLink } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "..";
import { login } from "../http/userAPI";
import { REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";

const Login = observer(() => {

  //Validation part
  let [emailValid, setEmailValid] = useState(true);
  let [passwordValid, setPasswordValid] = useState(true);
  const __validate = function () {
    //TODO
    const emailRe = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    let valid = true;
    if (!email.match(emailRe)) {
      setEmailValid(false);
      valid = false;
    }
    if (password.length < 6 || password.length > 10) {
      valid = false;
      setPasswordValid(false);
    }
    return valid;
  }
  //End of validation part




  const { user } = useContext(Context)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigator = useNavigate();


  const clickLogin = async () => {
    if (__validate()) {
      try {
        const response = await login(email, password);
        user.setUser(response);
        user.setIsAuth(true);
        navigator(SHOP_ROUTE);
      } catch (ex) {
        console.error(ex)
        if (ex.response) {
          alert(ex.response.data.message);
        } else {
          alert('Some problems on server');
        }
      }
    }
  }

  return (
    <Container className="d-flex justify-content-center align-item-center" style={{ height: window.innerHeight - 54 }}>
      <Card style={{ width: 600, height: 500 }} className="p-5">
        <h2 className="m-auto">Authorization</h2>
        <Form className="d-flex flex-column">
          <Form.Control className="mt-2" placeholder="Enter your email" value={email} onChange={e =>{setEmail(e.target.value);setEmailValid(true)}} />
          {emailValid ? '' : <div>Incorrect email</div>}
          <Form.Control className="mt-2" placeholder="Enter your password" value={password} onChange={e =>{setPassword(e.target.value);setPasswordValid(true)}} type="password" />
          {passwordValid ? '' : <div>Incorrect password</div>}
          <div>
            No account? <Link to={REGISTRATION_ROUTE}>Registry</Link>
          </div>
          <Button variant="outline-success" className="mt-3 align-self-end" onClick={clickLogin}>Log in</Button>
        </Form>
      </Card>
    </Container>
  );
});

export default Login;