import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import {BrowserRouter, Route, Redirect, Routes, Switch} from 'react-router-dom';
import { Context } from "..";
import Admin from "../pages/Admin";
import Basket from "../pages/Basket";
import DevicePage from "../pages/DevicePage";
import Login from "../pages/Login";
import Registry from "../pages/Registry";
import Shop from "../pages/Shop";

import { authRoutes, publicRoutes } from "../routes";

import {ADMIN_CACHE, ADMIN_DEVICES, ADMIN_ADVERT, ADMIN_BRANDS, ADMIN_ROUTE, ADMIN_TYPES, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, DEVICES_ROUTE } from "../utils/consts";
import AdminBrands from "./adminPage/subPages/AdminBrands";
import AdminTypes from "./adminPage/subPages/AdminTypes";
import AdminDevices from "./adminPage/subPages/AdminDevices";
import AdminAdvert from "./adminPage/subPages/AdminAdvert";
import AdminCache from "./adminPage/subPages/AdminCache";
import TypeDevices from "../pages/TypeDevices";



const AppRouter = () => {
  const {user} =useContext(Context);
  console.debug('AppRouter render')
    return (
      <Routes>
        {user.isAuth&&<Route path={BASKET_ROUTE} element={<Basket/>}></Route>}
        {user.isAuth&&user.user.role=="ADMIN"&&<Route path={ADMIN_ROUTE} element={<Admin/>} exact></Route>}
        <Route path={DEVICE_ROUTE+'/:id'} element={<DevicePage/>} exact></Route>
        <Route path={SHOP_ROUTE} element={<Shop/>} exact></Route>
        <Route path={DEVICES_ROUTE+':typeId'} element={<TypeDevices/>} exact></Route>
        <Route path={REGISTRATION_ROUTE} element={<Registry/>} exact></Route>
        <Route path={LOGIN_ROUTE} element={<Login/>} exact></Route>
        <Route path={ADMIN_TYPES} element={<AdminTypes/>}/>
        <Route path={ADMIN_BRANDS} element={<AdminBrands/>} />
        <Route path={ADMIN_DEVICES} element={<AdminDevices/>} />
        <Route path={ADMIN_ADVERT} element={<AdminAdvert/>} />
        <Route path={ADMIN_CACHE} element={<AdminCache/>} />
      </Routes>
    );
  }
  
export default observer(AppRouter);