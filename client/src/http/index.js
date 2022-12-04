import axios from 'axios';

const host = axios.create(
    {
        baseURL:process.env.REACT_APP_API_URL
    }
);

const authHost = axios.create(
    {
        baseURL:process.env.REACT_APP_API_URL
    }
);


const authInterceptor = config =>{
    if(localStorage.getItem('token'))
    {
        config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    }
    throw {message:'No token'}   
}
const authOptionalInterceptor = config =>{
    if(localStorage.getItem('token'))
    {
        config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    }    
    return config;
}

authHost.interceptors.request.use(authInterceptor);
host.interceptors.request.use(authOptionalInterceptor);

export{
    host,
    authHost
}