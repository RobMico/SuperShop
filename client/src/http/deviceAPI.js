import { authHost, host } from ".";
import jwt_decode from 'jwt-decode';


export const createDevice = async (Data)=>{
    const {data} = await authHost.post('api/device',Data);
    return data;
}

export const editDevice = async (Data)=>{    
    const {data} = await authHost.post('api/device/editdevice', Data);    
    return data;
}

export const editDeviceImages = async (Data)=>{    
    const {data} = await authHost.post('api/device/editimgs', Data);    
    return data;
}

export const fetchDevices = async (typeId, limit=40, offset = 0, filters)=>{
    if(typeId=="custom"){
        typeId = null;
    }
    const {data} = await host.get('api/device', {
        params:{
            typeId:typeId, offset:offset, limit:limit, filters:filters
        }});
    return data;
}

export const fetchDisabledDevices = async (limit=40, offset = 0)=>{    
    const {data} = await authHost.get('api/device/disabled', {
        params:{
            offset:offset, limit:limit
        }});
    return data;
}


export const fetchOneDevice = async (id)=>{
    const {data} = await host.get('api/device/'+id);
    return data;
    
}

export const getRate = async (limit, page, deviceId)=>{
    const {data} = await host.get('api/device/rating',{params:{limit:limit, page:page, deviceId:deviceId}});
    return data;
}

export const postRate = async (comment, rate, deviceId)=>{
    const {data} = await authHost.post('api/device/rating',{comment:comment, rate:rate, deviceId:deviceId});
    return data;
}


export const setDeviceDisable = async (disable, deviceId)=>{    
    const {data} = await authHost.post('api/device/setdisable',{disabled:disable, deviceId:deviceId});
    return data;
}

export const setDeviceAvaliable = async (avaliable, deviceId)=>{
    const {data} = await authHost.post('api/device/setavaliable',{avaliable:avaliable, deviceId:deviceId});
    return data;
}
