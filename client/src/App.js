import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {BrowserRouter} from 'react-router-dom';
import { Context } from ".";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { getFileHolders } from "./http/adminAPI";
import { check } from "./http/userAPI";

function App() {
  console.debug("app;render");
  const {user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    check().then(data=>{
      user.setUser(data);
      user.setIsAuth(true);
    
    }).catch(ex=>{      
      user.setUser({});
      user.setIsAuth(false);
    }).finally(()=>{
      setLoading(false);
    })
  }, [])
  useEffect(()=>{
    getFileHolders();
  }, [])


  if(loading)
  {
    return <Spinner animation={"grow"}/>
  }
  return (
    // <>Hello</>    
    <BrowserRouter>
      <NavBar/>
      <AppRouter/>      
    </BrowserRouter>
  );
}
export default observer(App);
