import {makeAutoObservable} from 'mobx'

export default class UserStore{
    constructor(){
        this._isAuth=false;
        this._user={};
        makeAutoObservable(this);
    }

    setIsAuth(bool){
        this._isAuth=bool;
    }
    setUser(user){
        this._user=user;
    }

    logout(){
        this._user={};
        this._isAuth=false;
    }

    get isAuth(){
        return this._isAuth;
    }

    get user(){
        return this._user;
    }
}