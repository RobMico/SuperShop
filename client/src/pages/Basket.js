import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { fetchBasket, removeFromBasket } from "../http/basketAPI";
import { Context } from "..";
import { Row } from "react-bootstrap";
import DeviceItemRow from "../components/basketPage/DeviceItemRow";



const Basket = observer(() => {
  const {basket} = useContext(Context);
  console.info("BASKET PAGE RENDER")
  useEffect(()=>{
    fetchBasket().then(data=>{
      basket.setDevices(data);
    })
  },[])  
  const removeDevice = function(){
    removeFromBasket(this.id).then(data=>{
      basket.setDevices(basket.devices.filter((el)=>el!=this));
    }).catch(ex=>{
      console.error(ex);
      alert(ex.message);
    });
  }  
    return (      
      <Row className="d-flex">
        {basket.devices.map(e=>{          
          return <DeviceItemRow data={e} removeFromBasket={removeDevice}/>
          }
        )}
      </Row>      
    );
  });
export default Basket;
  