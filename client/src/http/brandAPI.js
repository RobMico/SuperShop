import { authHost, host } from ".";
import jwt_decode from 'jwt-decode';


export const createBrand = async (Data)=>{    
    const {data} = await authHost.post('api/brand', Data);
    return data;
    
}

export const editBrand = async (Data)=>{    
    const {data} = await authHost.post('api/brand/edit', Data);
    return data;
    
}

export const fetchBrands = async ()=>{    
    const {data} = await host.get('api/brand');
    return data;
    
}
