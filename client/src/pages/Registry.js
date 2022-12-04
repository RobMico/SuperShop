import { observer } from "mobx-react-lite";
import React, { useContext, useRef, useState } from "react";
import { Button, Card, Container, Form, NavLink } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "..";
import { registration } from "../http/userAPI";
import { LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";

const Registry = observer(() => {
    
    
    //Validation part
    let [emailValid, setEmailValid] = useState(true);
    let [nameValid, setNameValid] = useState(true);
    let [passwordValid, setPasswordValid] = useState(true);
    let [confPasswordValid, setConfPasswordValid] = useState(true);
    const __validate = function () {
        //TODO
        const emailRe = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/        
        let valid=true;
        if (!email.match(emailRe)) {
            setEmailValid(false);
            valid = false;
        }
        if (name.length < 4 || name.length > 15) {
            valid = false;
            setNameValid(false);
        }
        if (password.length < 6 || password.length > 10) {
            valid = false;
            setPasswordValid(false);
        }
        if (password != _confPassword) {
            valid = false;
            setConfPasswordValid(false);
        }
        return valid;
        //return emailValid && nameValid && passwordValid && confPasswordValid;
    }
    //End of validation part




    const { user } = useContext(Context)
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [_confPassword, _setConfPassword] = useState('');
    const navigator = useNavigate();

    const clickRgistry = async (el) => {
        if (__validate()) {            
            try {
                const response = await registration(email, password, name);
                user.setUser(response);
                user.setIsAuth(true);
                navigator(SHOP_ROUTE);
            } catch (ex) {
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
                <h2 className="m-auto">Registration</h2>
                <Form className="d-flex flex-column">
                    <Form.Control className="mt-2" placeholder="Enter your email" value={email} onChange={e => { setEmail(e.target.value); setEmailValid(true) }} />
                    {emailValid ? '' : <div>Incorrect email</div>}
                    <Form.Control className="mt-2" placeholder="Enter your name" value={name} onChange={e => { setName(e.target.value); setNameValid(true) }} />
                    {nameValid ? '' : <div>Incorrect name</div>}
                    <Form.Control className="mt-2" placeholder="Enter your password" type="password" value={password} onChange={e => { setPassword(e.target.value); setPasswordValid(true) }} />
                    {passwordValid ? '' : <div>Incorrect password</div>}
                    <Form.Control className="mt-2" placeholder="Confirm your password" type="password" value={_confPassword} onChange={e => { _setConfPassword(e.target.value); setConfPasswordValid(true) }} />
                    {confPasswordValid ? '' : <div>Passwords not mached</div>}
                    <div>
                        Already have an account? <Link to={LOGIN_ROUTE}>Log in</Link>
                    </div>
                    <Button variant="outline-success" className="mt-3 align-self-end" onClick={clickRgistry}>Registry</Button>
                </Form>
            </Card>
        </Container>
    );
});

export default Registry;