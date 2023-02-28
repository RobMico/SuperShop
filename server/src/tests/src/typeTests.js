//const request = require('request');
const request = require('./requestAsync');
const logger = require('./logger');
const crypto = require('crypto');

function getRandomString()
{
    const randomString1 = crypto.randomBytes(4).toString('hex');
    return randomString1;
}

class typeTests {
    async runAll(PORT, adminToken) {
        this.path = 'http://localhost:'+PORT+'/api/type/';
        this.component = 'TYPE';
        this.adminToken = adminToken;
        await this.createNewTest();
        await this.getAllTest();
    }

    async createNewTest(){        
        //NOT AUTHORIZED DATA TEST
        {
            let testName = ';CREATE:TEST EMPTY DATA ';
            try{
                let result = await request.post({url:this.path});                
                if(result.statusCode!=401||!result.body.includes('User not autorized'))
                {                
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex);
            }
        }
        //INCORRECT DATA TEST
        {
            let testName=';CREATE:TEST INCORRECT DATA ';
            try{
                let headers = {'Authorization': 'Bearer '+this.adminToken}                
                let result = await request.post({
                    url:this.path, 
                    headers:headers,
                    body:{
                        name:getRandomString()+'!@#$%^&*(<>[])*^%$@#$%&*()'
                    },
                    json:true
                });                
                if(result.statusCode!=400||!result.body.message.length)
                {                
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+testName+ 'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex);
            }
        }
        //CORRECT DATA TEST
        {
            let testName=';CREATE:TEST CORRECT DATA ';
            try{
                let headers = {'Authorization': 'Bearer '+this.adminToken}
                let name =getRandomString()
                let result = await request.post({
                    url:this.path, 
                    headers:headers,
                    body:{
                        name:name
                    },
                    json:true
                });                
                if(result.statusCode!=200||result.body.name!=name)
                {                
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    this.successType = result.body.id;
                    logger.printSuccess(this.component+testName+ 'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex);
            }
        }
    }
    async getAllTest()
    {
        //CORRECT TEST
        {
            let testName = ';GET:TEST CORRECT DATA ';
            try{
                let result = await request.get({url:this.path});                
                result.body = JSON.parse(result.body);                
                if(result.statusCode!=200||!result.body.length)
                {                
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    if(!result.body.find(e=>{return e.id==this.successType}) )
                    {
                        return logger.printError(this.component+testName+ 'FAILED 2');
                    }
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex);
            }
        }
    }
    async removeOneTest()
    {
        //TODO

        //EMPY DATA TEST

        //INCORRECT DATA TEST

        //CORRECT TEST

    }
}

module.exports = new typeTests();