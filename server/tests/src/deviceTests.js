//const request = require('request');
const request = require('./requestAsync');
const logger = require('./logger');
const crypto = require('crypto');
const fs = require('fs')
const path = require('path')


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandomString()
{
    const randomString1 = crypto.randomBytes(4).toString('hex');
    return randomString1;
}

class deviceTest {
    async runAll(PORT, adminToken, successType, successBrand) {
        this.path = 'http://localhost:'+PORT+'/api/device/';
        this.component = 'DEVICE';
        this.adminToken = adminToken;
        this.successBrand = successBrand;
        this.successType = successType;
        try{
        let files= await new Promise((resolve, reject)=>fs.readdir(path.join(__dirname, '..', 'assets'), (err, files)=>{if(err){reject(err)};resolve(files)}));        
        this.fileName = files[Math.floor(Math.random() * files.length)];        
        }
        catch(ex)
        {
            logger.printInternal("DEVICE:Can not get file")
        }

        await this.createTests();
        await timeout(1000);
        await this.getAllTests();
        await this.getOneTests();
        await this.postRatingTests();
        await timeout(1000);
        await this.loadRatingTests();
        

    }    
    async createTests()
    {   
        //TEST EMPTY DATA
        {
            let testName = ';CREATE:EMPTY DATA TEST '
            
                try{                
                    //{email:'qwerty@mail.com', password:'qwerty', name:'qwerty'}
                    let headers = {'Authorization': 'Bearer '+this.adminToken}
                    const result = await request.post({                
                        url:     this.path + '',
                        body: {},
                        json: true,
                        headers:headers
                    });                                                      
                    if(result.statusCode!=400)
                    {                
                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                         
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }            
            
        }
        //TEST CORRECT DATA
        {
            let testName = ';CREATE:CORRECT DATA TEST '            
                try{                
                    //{email:'qwerty@mail.com', password:'qwerty', name:'qwerty'}
                    let headers = {'Authorization': 'Bearer '+this.adminToken}
                    const result = await request.post({                
                        url:     this.path + '',
                        formData: {
                            'name':getRandomString(),
                            'price':Math.floor(Math.random() * 100000),
                            'brandId':this.successBrand,
                            'typeId':this.successType,
                            'info':JSON.stringify([
                             {
                                title:getRandomString(),
                                description:Math.floor(Math.random() * 100000)
                             },
                             {
                                title:getRandomString(),
                                description:Math.floor(Math.random() * 100000)
                             },
                             {
                                title:getRandomString(),
                                description:Math.floor(Math.random() * 100000)
                             }   
                            ]),
                            'img':fs.createReadStream(path.join(__dirname, '..', 'assets', this.fileName))
                        },                        
                        headers:headers
                    });                    
                    result.body = JSON.parse(result.body);
                    if(result.statusCode!=200||!result.body.id)
                    {                
                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                         
                        this.successDeviceId = result.body.id;
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }            
            
        }

    }
    async getAllTests()
    {
        //TEST INCORRECT ARGS
        {
            {
                let testName = ';GET ALL:EMPTY DATA TEST '            
                try{                            
                    const result = await request.get({                
                        url:     this.path + ''
                    });                    
                    result.body = JSON.parse(result.body);                                        
                    if(result.statusCode!=200||result.body.count<=0)
                    {                                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                                                 
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }
                
            }
            {
                let testName = ';GET ALL:INCORRECT LIMIT TEST '            
                try{                            
                    const result = await request.get({                
                        url:     this.path + '',
                        qs:{
                            brandId:this.successBrand,
                            limit:-1,
                            page:1
                        }
                    });                                                            
                    if(result.statusCode==200)
                    {                                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                                                 
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }
                
            }
            {
                let testName = ';GET ALL:INCORRECT brandId TEST '            
                try{                            
                    const result = await request.get({                
                        url:     this.path + '',
                        qs:{
                            brandId:'-1'                            
                        }
                    });                 
                    result.body = JSON.parse(result.body);                    
                    if(result.body.count>0)
                    {                                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                                                 
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }
                
            }
        }
        //TESTING FILTERS
        {
            {
                let testName = ';GET ALL:CORRECT brandId TEST '            
                try{                            
                    const result = await request.get({                
                        url:     this.path + '',
                        qs:{
                            brandId:this.successBrand                            
                        }
                    });                 
                    result.body = JSON.parse(result.body);                    
                    if(result.body.count!=1)
                    {                                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                                                 
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }
                
            }
            {
                let testName = ';GET ALL:OFFSET TEST '            
                try{                            
                    const result = await request.get({                
                        url:     this.path + '',
                        qs:{
                            limit:3
                        }
                    });                         
                    result.body = JSON.parse(result.body);                    
                    if(result.body.rows.length>3)
                    {                                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                                                 
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }
                
            }
        }
    }
    async getOneTests()
    {
        //TEST INCORRECT ID
        {
            let testName = ';GET ONE:INCORRECT ID TEST '            
                try{                            
                    const result = await request.get({                
                        url:     this.path + '-1'              
                    });                    
                    result.body = JSON.parse(result.body);                    
                    if(result.statusCode==200)
                    {                                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                                                 
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }            
            
        }
        //TEST CORRECT ID
        {
            let testName = ';GET ONE:CORRECT ID TEST '            
                try{                            
                    const result = await request.get({                
                        url:     this.path + this.successDeviceId
                    });                    
                    result.body = JSON.parse(result.body);                    
                    if(result.statusCode!=200||result.body.id!=this.successDeviceId)
                    {                                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                                     
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }            
            
        }
    }
    
    async postRatingTests()
    {
        //TEST INCORRECT DATA
        {
            let testName = ';POST RATING:INCORRECT DATA TEST '
            
                try{                                    
                    let headers = {'Authorization': 'Bearer '+this.adminToken}
                    const result = await request.post({                
                        url:     this.path + 'rating',
                        body: {
                            comment:'HELLO?',
                            rate:-1,
                            deviceId:this.successDeviceId
                        },
                        json: true,
                        headers:headers
                    });
                    //result.body = JSON.parse(result.body);                    
                    if(result.statusCode!=400||!result.body.message.length>0)
                    {                
                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                         
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
                }            
            
        }
        //TEST CORRECT DATA
        {
            let testName = ';POST RATING:CORRECT DATA TEST '
            
                try{                                    
                    let headers = {'Authorization': 'Bearer '+this.adminToken}
                    const result = await request.post({                
                        url:     this.path + 'rating',
                        body: {
                            comment:'0',
                            rate:Math.floor(Math.random() * 5)+1,
                            deviceId:this.successDeviceId
                        },
                        json: true,
                        headers:headers
                    });                    
                    if(result.statusCode!=200)
                    {                
                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                         
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
            }            
        }

        //FILL COMMENTS FOR NEXT TEST
        {
            let testName = ';POST RATING:FILL COMMENTS ';
            try{                      
                for(let i=1;i<11;i++)
                {                              
                    let headers = {'Authorization': 'Bearer '+this.adminToken}
                    const result = await request.post({                
                        url:     this.path + 'rating',
                        body: {
                            comment:`${i}`,
                            rate:Math.floor(Math.random() * 5)+1,
                            deviceId:this.successDeviceId
                        },
                        json: true,
                        headers:headers
                    });                
                }
            }catch(ex){
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex);
            }
        }
    }

    async loadRatingTests()
    {
        //CHECK RATING EXISTS
        {
            let testName = ';GET RATING:CHECK RATINGS '
            
                try{                                    
                    let headers = {'Authorization': 'Bearer '+this.adminToken}
                    const result = await request.get({                
                        url:     this.path + 'rating',
                        qs: {                            
                            deviceId:this.successDeviceId,
                            limit:4,
                            page:1
                        },                        
                        headers:headers
                    });                
                    try{
                        result.body = JSON.parse(result.body)
                    }catch(ex){}                   
                    if(result.statusCode!=200||result.body.length!=4||result.body[0].comment!="10"||result.body[3].comment!="7")
                    {
                        
                        return logger.printError(this.component+testName+ 'FAILED');    
                    }
                    else
                    {                         
                        logger.printSuccess(this.component+testName+ 'SUCCESS');
                    }            
                }catch(ex){
                    logger.printInternal(this.component+ testName+'CRASHED');
                    console.error(ex);
            }            
        }
        {   
            let testName = ';GET RATING:CHECK RATINGS PAGE 2 '
        try{                                    
            let headers = {'Authorization': 'Bearer '+this.adminToken}
            const result = await request.get({                
                url:     this.path + 'rating',
                qs: {                            
                    deviceId:this.successDeviceId,
                    limit:4,
                    page:2
                },                        
                headers:headers
            });                
            try{
                result.body = JSON.parse(result.body)
            }catch(ex){}                   
            if(result.statusCode!=200||result.body.length!=4||result.body[0].comment!="6"||result.body[3].comment!="3")
            {
                
                return logger.printError(this.component+testName+ 'FAILED');    
            }
            else
            {                         
                logger.printSuccess(this.component+testName+ 'SUCCESS');
            }            
        }catch(ex){
            logger.printInternal(this.component+ testName+'CRASHED');
            console.error(ex);
        }    
        }
    }
    
}

module.exports =new deviceTest();