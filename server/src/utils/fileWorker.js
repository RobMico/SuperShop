const fs = require("fs");
const __path = require("path");
const uuid = require('uuid');


const fileWorker = {
    /*
        if an error occurs further, this callback will delete the saved files
    */
    __removeCallback:async function (imgs, path){
        if(this.fullPath)
        {
            return fs.unlink(this.fullPath, ()=>{});
        }
        else if(imgs||this.imgs)
        {
            let filenames = (imgs||this.imgs).replaceAll('%0:', '').split(';');
            path = this.path||path;
            path=path?path:'';
            filenames.forEach(file => {
                fs.unlink(__path.resolve(process.env.static,path, file), ()=>{});
            });

        }
        
    },

    removeFiles:async function (files, path=''){                
        files.replaceAll('%0:', '').split(';').forEach(file => {
            try{
                fs.unlink(__path.resolve(process.env.static,path, file), ()=>{});
            }catch(ex){
            }
        });        
    },
    
    /*
        param path will be added to static dir
        extentions filter incoming files by file extentions
        maxSize filter incoming file by size
    */
    saveFiles: async ({files, path='', extentions=['jpg'], maxSize=5200000})=>{
        //result filanames
        let fileNames='';
        //needed to run promise all
        let writeAll = [];            
        //If only one image is sent, here i get an object instead of an array(a single image is not good at all)
        if(!files.length)
        {            
            throw {message:'files is not array'};
        }
        //Files validation
        for(let i =0;i<files.length; i++)
        {
            let extention = files[i].name.split('.').pop();
            
            if(!extentions.find(e=>e===extention))
            {
                throw {message:'file extention not mach'};
            }                
            
            if(files[i].size>maxSize)//5200000 5mb
            {
                throw {message:'file size too big'}
            }
            files[i].extention = extention;
        }

        //Save images
        for(let i =0;i<files.length; i++)
        {
            let filename = uuid.v4() +'.'+ files[i].extention;
            fileNames+='%0:'+filename+';'
            writeAll.push(files[i].mv(__path.resolve(process.env.static, path, filename)));                
        }

        try{
            await Promise.all(writeAll);
            return {
                removeFile:fileWorker.__removeCallback.bind({imgs:fileNames}),
                fileName:fileNames
            }
        }catch(ex){
            fileWorker.__removeCallback(fileNames);
            throw ex;
        }


    },
    /*
        param path will be added to static dir
        extentions filter incoming files by file extentions
        maxSize filter incoming file by size
    */
    saveFile: async ({file, path='', extentions=['jpg'], maxSize=5200000, name})=>{

        let extention = file.name.split('.').pop();
        
        if(!extentions.find(e=>e===extention))
        {
            throw {message:'file extention not mach'}
        }
        if(file.size>maxSize)
        {
            throw {message:'file size too big'}
        }
        if(!name)
        {
            name = uuid.v4();
        }
        else{
            name = name.split('.')[0];
        }
        name = name+'.'+extention;
        let filePath = __path.resolve(process.env.static, path, name)        
        name = '%0:'+name;
        await file.mv(filePath);

        return {
            removeFile:fileWorker.__removeCallback.bind({fullPath:filePath}), 
            fileName:name
        }
    },
    
};

module.exports = fileWorker;