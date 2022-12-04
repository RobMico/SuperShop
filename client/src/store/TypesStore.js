import { makeAutoObservable } from 'mobx'




export default class TypeStore {
    constructor() {
        this._types = [];
        this._selectedType = {};
        this._props = null;
        makeAutoObservable(this);
    }

    setSelectedType(obj) {
        this._selectedType = obj;
    }

    setTypes(types) {
        if(types==undefined)
        {
            throw 'FUCKIN BASTRAD';
        }
        this._types = types;
    }

    get types() {
        
        return this._types;
    }

    get selectedType() {
        return this._selectedType;
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

    parsePropsArr(val) {
        let tmp;
        let res = val.reduce((prev, cur) => {
            tmp = cur.str.split("_")
            prev[tmp[0]] ? prev[tmp[0]].push(tmp[1]) : (prev[tmp[0]] = [tmp[1]])
            return prev;
        }, [])

        return Object.keys(res).map(e => { return { name: e, vals: res[e], textPart: '' } });
    }

    getTypeNameById(id){
        let tmp = this._types.find(e=>e.id==id);
        if(tmp)
        {
            return tmp.name;
        }
        else
        {
            return null;
        }
    }


}