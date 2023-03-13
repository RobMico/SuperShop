import { authHost, host } from ".";
import jwt_decode from 'jwt-decode';


export const registration = async (email, password, name) => {
    let {data} = await host.post('api/user/register', { email: email, password: password, name: name });
    try {
        data = JSON.parse(data);
    } catch { }
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const login = async (email, password) => {
    let { data } = await host.post('api/user/login', { email: email, password: password });

    try {
        data = JSON.parse(data);

    } catch { }
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const check = async () => {
    console.log("HI")
    try {
        console.log('1');
        let { data } = await authHost.get('api/user/auth');
        console.log(data);
        try {
            data = JSON.parse(data);
        } catch { }

        localStorage.setItem('token', data.token);
        return jwt_decode(data.token);
    } catch (ex) {
        console.log(ex);
        localStorage.removeItem('token');
        throw ex;
    }
}
