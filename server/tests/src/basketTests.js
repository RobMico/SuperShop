//const request = require('request');
const request = require('./requestAsync');
const logger = require('./logger');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


class basketTests {
    async runAll(PORT, userToken, deviceId) {
        this.path = 'http://localhost:'+PORT+'/api/basket/';
        this.component = 'BASKET';
        this.userToken = userToken;
        this.deviceId = deviceId;

        await this.addItemTest();
        timeout(1000);
        await this.getAllTest();
        await this.buyTest();
        this.removeItemTest();
    }
    async addItemTest(){
        //INCORRECT DEVICE ID
        {
            let testName = ';ADD:TEST INCORRECT DEVICEID ';
            let headers = {'Authorization': 'Bearer '+this.userToken}
            try{
                let result = await request.post({url:this.path + 'add', 
                body:{
                    deviceId:this.deviceId+1,
                    deviceCount:1
                },
                headers:headers,
                json:true
            });     
            try{    
                result.body = JSON.parse(result.body)
            }catch(ex){}            
                if(result.statusCode==200)
                {
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }
        //CORRECT DATA TEST
        {
            let testName = ';ADD:TEST CORRECT DEVICEID ';
            let headers = {'Authorization': 'Bearer '+this.userToken}
            try{
                let result = await request.post({url:this.path + 'add', 
                body:{
                    deviceId:this.deviceId,
                    deviceCount:1
                },
                headers:headers,
                json:true
            });     
            try{    
                result.body = JSON.parse(result.body)
                
            }catch(ex){}                                                
                if(result.statusCode!=200||!result.body.id)
                {
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    this.deviceInBasket = result.body.id;
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }
    }
    async removeItemTest(){
        //INCORRECT DEVICE ID
        {
            let testName = ';REMOVE:TEST INCORRECT DEVICEID ';
            let headers = {'Authorization': 'Bearer '+this.userToken}
            try{
                let result = await request.post({url:this.path + 'remove', 
                body:{
                    basketId:this.deviceInBasket+1                    
                },
                headers:headers,
                json:true
            });     
            try{    
                result.body = JSON.parse(result.body)
            }catch(ex){}            
                if(result.statusCode==200)
                {
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }
        //CORRECT DATA TEST
        {
            let testName = ';REMOVE:TEST CORRECT DEVICEID ';
            let headers = {'Authorization': 'Bearer '+this.userToken}
            try{
                let result = await request.post({url:this.path + 'remove', 
                body:{
                    basketId:this.deviceInBasket                    
                },
                headers:headers,
                json:true
            });     
            try{    
                result.body = JSON.parse(result.body)
            }catch(ex){}            
                if(result.statusCode!=200)
                {
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }

    }
    async getAllTest(){
        //CORRECT DATA TEST
        {
            let testName = ';GET ALL:TEST ';
            let headers = {'Authorization': 'Bearer '+this.userToken}
            try{
                let result = await request.get({url:this.path + '',                 
                headers:headers                
            });     
            try{    
                result.body = JSON.parse(result.body)
            }catch(ex){}                                
                if(result.statusCode!=200||result.body.length!=1)
                {
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }
    }

    async buyTest(){
        //TODO
    }
}

module.exports = new basketTests();