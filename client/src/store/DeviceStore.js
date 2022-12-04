import {makeAutoObservable} from 'mobx'

export default class DeviceStore{
    constructor(){
        this._devices=[];
        this._disabled=false;
        this._page=1;
        this._totalCount=0;
        this._limit=20;
        this._nameFilter = null;
        this._filters = [];
        this._savedFilters = {dynamic:[], typeId:-1, minPrice:'', maxPrice:'',result_key:null}
        this._paginationKey = null;
        makeAutoObservable(this);
    }
    
    resetStore(){
        this._paginationKey=null;
        this._devices = [];
        this._disabled=false;
        this._page=1;
        this._totalCount=0;
        this._limit=20;
        this._nameFilter = null;
        this._filters = [];
        this._savedFilters = {dynamic:[], typeId:-1, minPrice:'', maxPrice:'', result_key:null}
    }

    setSavedFilters({typeId, dynamic, all, minPrice, maxPrice, result_key, nameSubstr}){        
        if(all)
        {
            this._savedFilters = all;
            return;
        }
        if(typeId)
        {
            this._savedFilters.typeId = typeId;
        }
        if(dynamic)
        {
            this._savedFilters.dynamic = dynamic;
        }
        if(minPrice!==undefined)
        {
            this._savedFilters.minPrice = minPrice;
        }
        if(maxPrice!==undefined)
        {
            this._savedFilters.maxPrice = maxPrice;
        }        
        if(result_key!==undefined)
        {
            this._savedFilters.result_key = result_key;
        }
        if(nameSubstr!==undefined)
        {
            this._savedFilters.nameSubstr = nameSubstr;
        }
    }

    get savedFilters()
    {
        return this._savedFilters;
    }


    setDisabled(val){
        this._disabled= val;
    }
    get disabled ()
    {
        return this._disabled;
    }

    addBrandFilters(brandId)
    {
        let temp = {name:'_brand', type:null, value:brandId}
        this._filters.push(temp);
        return temp;
    }

    get filters()
    {
        return this._filters.map(e=>{if(e){return e}});
    }

    setNameFilter(filter)
    {
        this._nameFilter = filter?filter:null;
    }

    get NameFilter()
    {
        return this._nameFilter;
    }

    setDevices(devices){
        this._devices = devices;
    }    

    get devices(){
        return this._devices;
    }

    setPage(page)
    {
        this._page = page;
    }

    setTotalCount(total)
    {
        this._totalCount = total;
    }
    
    setLimit(limit)
    {
        this._limit = limit;
    }

    get page(){
        return this._page;
    }
    get totalCount(){
        return this._totalCount;
    }
    get limit(){
        return this._limit;
    }
    get paginationKey(){
        return this._paginationKey;
    }
    setPaginationKey(key){
        this._paginationKey = key;
    }

}