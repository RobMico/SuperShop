import { authHost, host } from ".";
import jwt_decode from 'jwt-decode';


export const registration = async (email, password, name)=>{    
    const res = await host.post('api/user/register', {email:email,password:password,name:name, role:"ADMIN"});        
    console.log(res);
    const data = res.data;
    try{
        data= JSON.parse(data);
    }catch{}
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const login = async (email, password)=>{
    const {data} = await host.post('api/user/login', {email:email,password:password});    
    try{
        data= JSON.parse(data);
    }catch{}    
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const check = async ()=>{
    try{
        const {data} = await authHost.get('api/user/auth');
        try{
            data= JSON.parse(data);
        }catch{}

        localStorage.setItem('token', data.token);        
        return jwt_decode(data.token);
    }catch(ex)
    {
        localStorage.removeItem('token');
        throw ex;
    }
}
