import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';
import TypeStore from './store/TypesStore';
import BrandStore from './store/BrandStore';
import BasketStore from './store/BasketStore';
//import reportWebVitals from './reportWebVitals';


export const Context = createContext(null);
const root = ReactDOM.createRoot(document.getElementById('root'));
console.debug("index render")
root.render(
  <Context.Provider value={
    {
      user:new UserStore(),
      devices:new DeviceStore(),
      types:new TypeStore(),
      brands:new BrandStore(),
      basket:new BasketStore()
    }}>
    
      <App />
    
  </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
