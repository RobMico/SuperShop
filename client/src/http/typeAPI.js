import { authHost, host } from ".";


export const createType = async (Data)=>{    
    const {data} = await authHost.post('api/type', Data);
    return data;
    
}

export const fetchTypes = async ()=>{    
    const {data} = await host.get('api/type');
    return data;
    
}

export const fetchProps = async (typeId)=>{    
    const {data} = await host.get('api/type/getprops', {params:{typeId:typeId}});
    return data;
    
}

export const loadSuggestions = async (propName)=>{     
    const {data} = await authHost.post('api/type/suggestme', {propName:propName});
    return data;
    
}

export const addTypeProps = async (typeId, title, values)=>{ 
    const {data} = await authHost.post('api/type/addtypeprop', {typeId:typeId, title:title, values:values});
    return data;
}

export const editType = async (Data)=>{ 
    const {data} = await authHost.post('api/type/edit', Data);
    return data;
}
