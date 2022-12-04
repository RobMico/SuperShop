import {makeAutoObservable} from 'mobx'

export default class BrandStore{
    constructor(){
        this._brands=[];
        this._selectedBrand={};
        makeAutoObservable(this);
    }

    setSelectedBrand(obj){        
        this._selectedBrand=obj;
    }

    setBrands(brands){
        this._brands = brands;
    }    

    get brands(){
        return this._brands;
    }

    get selectedBrand(){
        return this._selectedBrand
    }
}