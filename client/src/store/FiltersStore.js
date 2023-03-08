import { makeAutoObservable } from 'mobx'

var myMap = function (obj, callback) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof callback === 'function') {
                let tmp = callback(obj[key], key, obj)
                if(tmp)
                {
                    result.push(tmp);
                }
            }
        }
    }
    return result;
};

export default class FiltersStore {
    constructor() {
        this._dynamic=[];
        this._priceMax='';
        this._priceMin='';
        this._props=null;
        this._resultKey=null;
        this._searchString=null;
        this._typeId=null;
        this._lastFilters=null;
        this._sortBy='Sort by';
        this._sortOrder = true;//true - desc
        this._brands=[];
        makeAutoObservable(this);
    }
    get brands(){
        return this._brands;
    }
    addBrand(brandId){
        this._brands.push(brandId);
    }
    removeBrand(brandId){
        this._brands = this._brands.filter(el=>el!=brandId);
    }

    get sortBy(){
        return this._sortBy;
    }
    setSortBy(val){
        this._sortBy = val;
    }
    get sortOrder(){
        return this._sortOrder;
    }
    setSortOrder(val){
        this._sortOrder = val;
    }
    get lastFilters(){
        if(!this._lastFilters)
        {
            this.getAllFilters();
        }
        return this._lastFilters;
    }
    setDynamic(val){
        this._dynamic= val;
    }
    get dynamic ()
    {
        return this._dynamic;
    }
    setResultKey(val){
        if(this._lastFilters)
        {
            this._lastFilters.result_key = val;
        }
        this._resultKey= val;
    }
    get resultKey ()
    {
        return this._resultKey;
    }
    setTypeId(val){
        this._typeId= val;
    }
    get typeId ()
    {
        return this._typeId;
    }
    setSearchString(val){
        this._searchString= val;
    }
    get searchString ()
    {
        return this._searchString;
    }
    setPriceMin(val){
        this._priceMin= val;
    }
    get priceMin ()
    {
        return this._priceMin;
    }
    setPriceMax(val){
        this._priceMax= val;
    }
    get priceMax ()
    {
        return this._priceMax;
    }
    setProps(val) {
        this._props = val;
    }
    get props() {
        return this._props;
    }


    parsePropsObj(val, removeZeros = false) {
        let tmp;
        let res = val.reduce((prev, cur) => {
            if (removeZeros) {
                if (cur.count != 0) {
                    tmp = cur.str.split("_")
                    prev[tmp[0]] ? prev[tmp[0]].push({val:tmp[1], count:cur.count, checked:false}) : (prev[tmp[0]] = [{val:tmp[1], count:cur.count, checked:false}])
                }
            }
            else {
                tmp = cur.str.split("_")
                prev[tmp[0]] ? prev[tmp[0]].push(tmp[1]) : (prev[tmp[0]] = [tmp[1]])
            }
            return prev;
        }, {})
        return res;
    }
    getAllFilters()
    {
        let dynamic = myMap(this._props, (val, key)=>{
            return val.reduce((prev, cur)=>{                
                if(cur.checked){
                    if(!prev){
                        prev = key+"_"+cur.val;
                    }
                    else if(Array.isArray(prev)){
                        prev.push(key+"_"+cur.val);
                    }
                    else{
                        prev = [prev, key+"_"+cur.val];
                    }
                }
                return prev;
            }, null);
        });
        let filtersObject = {dynamic:dynamic, result_key:null};
        this._searchString&&(filtersObject.nameSubstr=this._searchString);
        this._priceMax&&(filtersObject.maxPrice=this._priceMax);
        this._priceMin&&(filtersObject.minPrice=this._priceMin);

        this._sortBy!='Sort by'&&(filtersObject.sortBy=this._sortBy);
        this._sortBy!='Sort by'&&(filtersObject.sortOrder=this._sortOrder);
        this._brands.length>0&&(filtersObject.brands=this._brands);

        this._lastFilters = filtersObject;
        return filtersObject;
    }
    resetAll()
    {
        this._dynamic=[];
        this._priceMax='';
        this._priceMin='';
        this._props = null;
        this._resultKey=null;
        this._searchString=null;
        this._typeId=null;
        this._sortBy='Sort by';
        this._sortOrder = true;//true - desc
        this._brands=[];
    }
    setFilters(typeId, resultKey){
        this.resetAll();
        this._typeId = typeId;
        this._resultKey = resultKey;
    }
    get resetFilters(){
        return this._resetFilters.bind(this);
    }

    _resetFilters(){
        this._priceMax='';
        this._priceMin='';
        this._sortBy='Sort by';
        this._sortOrder = true;//true - desc
        this._brands=[];
        myMap(this._props, (el => {
            el.forEach(val=>{
                val.checked=false;
            });
            return el;
        }));
        this.setProps({...this._props});
    }
    currentType(){
        
    }

}