import { authHost, host } from ".";
import jwt_decode from 'jwt-decode';


export const addToBasket = async (deviceId, deviceCount)=>{    
    const {data} = await authHost.post('api/basket/add', {deviceId:deviceId, deviceCount:deviceCount});
    return data;
    
}

export const buyDevice = async (brand)=>{ 
    //TODO   
    const {data} = await authHost.post('api/basket/buy', {name:brand});
    return data;
    
}

export const removeFromBasket = async (basketId)=>{    
    const {data} = await authHost.post('api/basket/remove', {basketId:basketId});
    return data;
    
}

export const fetchBasket = async ()=>{    
    const {data} = await authHost.get('api/basket/');
    return data;
    
}
