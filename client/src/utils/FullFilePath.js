let filesHolders;

let load = ()=>{

    filesHolders = localStorage.getItem('FilseHolders')
    if(filesHolders)
    {
        filesHolders = JSON.parse(filesHolders);
    }
}
load();

var getFullPath = function (img, path) {
    
    if(!filesHolders)
    {
        load();
    }
    filesHolders.forEach((element, i) => {
        img = img.replace('%'+i+':', path?(element+path):element);
    });
    //return 'https://files.foxtrot.com.ua/PhotoNew/img_0_60_8610_0_1_637877047973579105.jpg'
    //        https://files.foxtrot.com.ua/PhotoNewimg_0_142_5637_0_1_637769094106910221.jpg
    return img;


};

export default getFullPath;