import {makeAutoObservable} from 'mobx'

export default class BasketStore{
    constructor(){
        this._deices=[];
        //this._selectedBrand={};
        makeAutoObservable(this);
    }

    // setSelectedBrand(obj){        
    //     this._selectedBrand=obj;
    // }

    setDevices(devices){
        this._deices = devices;
    }    

    get devices(){
        return this._deices;
    }

    // get selectedBrand(){
    //     return this._selectedBrand
    // }
}