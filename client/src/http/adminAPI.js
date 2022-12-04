import { authHost, host } from ".";


export const downloadLogs = async ()=>{       
    authHost.get('api/admin/logs', {responseType: 'blob'}).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');        
        link.href = url;
        link.setAttribute('download', 'logs.log');
        document.body.appendChild(link);
        link.click();
      });    
}

export const getFileHolders = async ()=>{       
  let res = await host.get('api/admin/getfservers');
  let tmp = res.data.split(';')
  localStorage.setItem('FilseHolders', JSON.stringify(tmp));
  return res;
}

export const fetchRedisKeys = async ()=>{
  let res = await authHost.get('api/admin/rkeys')
  return res;
}

export const getRedisFilters = async ()=>{
  let res = await authHost.get('api/admin/rfilters')
  return res;
}

export const regenerateRedisStorage = async (filters)=>{
  let res = await authHost.post('api/admin/rregenerate', {filters:filters})
  return res;
}

export const clearRedisCache = async ()=>{
  let res = await authHost.post('api/admin/rcacheclear')
  return res;
}

export const uploadJSON = async (data)=>{
  let res = await authHost.post('api/admin/uploadjson', data)
  return res;
}

