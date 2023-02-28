//const request = require('request');
const request = require('./requestAsync');
const logger = require('./logger');
const jwt_decode = require('jwt-decode');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


class userTests {
    async runAll(PORT) {
        this.path = 'http://localhost:'+PORT+'/api/user/';
        this.component = 'USER';
        await this.registrationTest(PORT);
        
        //sequelize need some time to add a record in db

        await timeout(1000);        
        await this.loginTest();      
        await this.checkAuthTest();        
        await this.checkAuthTest();
        

    }
    async registrationTest(PORT){
        //TEST EMPTY DATA
        {
            try{
                let result = await request.post({url:this.path + 'register'});            
                if(result.statusCode!=400||!result.body)
                {                
                    logger.printError(this.component+ ';REGISTER:TEST EMPTY DATA FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+ ';REGISTER:TEST EMPTY DATA SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ ';REGISTER:TEST EMPTY DATA CRASHED');
                console.error(ex);
            }
        }
        //TEST INCORRECT DATA
        {
            try{
                const result = await request.post({
                    url:     this.path + 'register',
                    body: {email:'myEmail', password:'_)(**&$%$#@@', name:'!@#$%^&*((*&%$#@#$%_'},
                    json: true            
                });                 
                if(result.statusCode!=400||!result.body.message||result.body.message.length!=2)
                {                                    
                    logger.printError(this.component+ ';REGISTER:TEST INCORRECT DATA FAILED');
                }
                else
                {                    
                    logger.printSuccess(this.component+ ';REGISTER:TEST INCORRECT DATA SUCCESS');
                }            
            }catch(ex){
                logger.printInternal(this.component+ ';REGISTER:TEST EMPTY DATA CRASHED');
                console.error(ex)
            }
        }        
        //TEST CORRECT DATA
        {
        const testCorrectData = async ()=> {
            try{
                let random = Math.floor(Math.random()*100000);
                //{email:'qwerty@mail.com', password:'qwerty', name:'qwerty'}
                const result = await request.post({                
                    url:     this.path + 'register',
                    body: {email:'test'+random+'@mail.com', 
                    password:'mySecret', 
                    name:'test'},
                    json: true  
                });              
                if(result.body.message == 'User with this email already exist')
                {
                    logger.printInternal('bad random')
                    return testCorrectData();
                }

                if(result.statusCode==400)
                {                
                    
                    return logger.printError(this.component+ ';REGISTER:TEST CORRECT DATA FAILED');    
                }
                else
                {   
                    try{                 
                        const user = jwt_decode(result.body.token);                        
                        if(user.email!='test'+random+'@mail.com'||user.role!='USER')
                        {
                            throw 'SOMETHING WAS WRONG'
                        }
                    }catch(ex)
                    {
                        return logger.printError(this.component+ ';REGISTER:TEST CORRECT DATA FAILED');                            
                    }

                    this.successRegister = random;
                    logger.printSuccess(this.component+ ';REGISTER:TEST CORRECT DATA SUCCESS');
                }            
            }catch(ex){
                logger.printInternal(this.component+ ';REGISTER:TEST CORRECT DATA CRASHED');
                console.error(ex);
            }
        }
        await testCorrectData();
        }
        //TEST ADDING EXISTING USER
        {
            let testName=';REGISTER:TEST EXISTING USER ';
            try{                                        
                const result = await request.post({                
                    url:     this.path + 'register',
                    body: {email:'qwerty@mail.com', password:'qwerty', name:'qwerty'},
                    json: true  
                });                
                if(result.statusCode==200||result.body.message!='User with this email already exist')
                {                                        
                    return logger.printError(this.component+testName+'FAILED');    
                }
                else
                {                                                                                   
                    logger.printSuccess(this.component+ testName +'SUCCESS');
                }            
            }catch(ex){
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex);
            }                        
        }

    }
    async loginTest()
    {
        if(!this.successRegister)
        {
            return logger.printInternal('USER;LOGIN:THIS TESTS CAN NOT BE DONE');
        }        
        //TEST EMPTY DATA
        {
            try{
                let result = await request.post({url:this.path + 'login'});      
                if(result.statusCode!=400||!result.body)
                {
                    logger.printError(this.component+ ';LOGIN:TEST EMPTY DATA FAILED');
                }
                else
                {
                    logger.printSuccess(this.component+ ';LOGIN:TEST EMPTY DATA SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ ';LOGIN:TEST EMPTY DATA CRASHED');
                console.error(ex);
            }
        }
        //TEST INCORECT EMAIL
        {
            let testName = ";LOGIN:TEST INCORRECT EMAIL ";
            try{
                const result = await request.post({
                    url:     this.path + 'login',
                    body: {
                        email:'myEmail@mail.com', 
                        password:'_)(**&$%$#@@@!!@#$%^&*()))($$#@$^&'                        
                    },
                    json: true
                });
                if(result.statusCode!=400||result.body.message!='User not found')//||!result.body.message||result.body.message.length!=2)
                {                                    
                    logger.printError(this.component+ testName +'FAILED');
                }
                else
                {                    
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }            
            }catch(ex){
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex)
            }
        }        
        //TEST INCORRECT PASSWORD
        {
            let testName = ";LOGIN:TEST INCORRECT PASSWORD ";
            try{
                const result = await request.post({
                    url:     this.path + 'login',
                    body: {
                        email:'test'+this.successRegister+'@mail.com', 
                        password:'_)(**&$%$#@@@!!@#$%^&*()))($$#@$^&'                        
                    },
                    json: true
                });                
                if(result.statusCode!=400||result.body.message!='Incorrect password')//||!result.body.message||result.body.message.length!=2)
                {                                    
                    logger.printError(this.component+ testName +'FAILED');
                }
                else
                {                    
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }            
            }catch(ex){
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex)
            }
        }
        //CORRECT TEST
        {
            let testName = ";LOGIN:TEST CORRECT DATA ";
            try{
                const result = await request.post({
                    url:     this.path + 'login',
                    body: {
                        email:'test'+this.successRegister+'@mail.com', 
                        password:'mySecret'
                    },
                    json: true
                });                
                try{
                    result = JSON.parse(result);
                }catch{}
                if(result.statusCode!=200||result.body.token.split('.').length!=3)
                {                                    
                    logger.printError(this.component+ testName +'FAILED');
                }
                else
                {                    
                    try{                 
                        const user = jwt_decode(result.body.token);
                        if(user.email!='test'+this.successRegister+'@mail.com'||user.role!='USER')
                        {
                            throw 'SOMETHING WAS WRONG'
                        }
                    }catch(ex)
                    {
                        return logger.printError(this.component+ testName+'FAILED');                            
                    }
                    this.userToken=result.body.token;
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }            
            }catch(ex){
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex)
            }
        }
        //GET ADMIN TOKEN
        {
            let testName = ";LOGIN:TEST CORRECT DATA 2 ";
            try{
                const result = await request.post({
                    url:     this.path + 'login',
                    body: {email:'qwerty@mail.com', password:'qwerty'},
                    json: true
                });
                if(result.statusCode!=200||result.body.token.split('.').length!=3)
                {                                    
                    logger.printError(this.component+ testName +'FAILED');
                }
                else
                {                                        
                    this.adminToken=result.body.token;
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }            
            }catch(ex){
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex)
            }
        }


    }
    async checkAuthTest()
    {        
        if(!this.adminToken&&!this.userToken)
        {
            return logger.printInternal("THIS TEST CAN NOT BE DONE");
        }   
        //CHECK EMPTY DATA
        {
            let testName = ';CHECK:TEST EMPTY DATA ';
            try{
                let result = await request.get({url:this.path + 'auth'});                
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
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }


        //TEST INCORRECT TOKEN
        {
            let testName = ';CHECK:TEST INCORRECT TOKEN ';
            let headers = {'Authorization': 'Hello '+this.userToken+'2'}
            try{
                let result = await request.get({url:this.path + 'auth', 
                headers:headers
            });            
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
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }

        //TEST CORRECT TOKEN
        {
            let testName = ';CHECK:TEST CORRECT TOKEN ';
            let headers = {'Authorization': 'Bearer '+this.userToken}
            try{
                let result = await request.get({url:this.path + 'auth', 
                headers:headers
            });            
            try{
                result.body = JSON.parse(result.body);
            }catch(ex){}            
                if(result.statusCode!=200)
                {
                    logger.printError(this.component+testName+ 'FAILED');
                }
                else
                {
                    try{                 
                        const user = jwt_decode(result.body.token);                        
                        if(user.email!='test'+this.successRegister+'@mail.com'||user.role!='USER')
                        {
                            throw 'SOMETHING WAS WRONG'
                        }
                    }catch(ex)
                    {
                        return logger.printError(this.component+ testName+'FAILED');                            
                    }
                    this.userToken=result.body.token;
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                }
                        
            }catch(ex)
            {
                logger.printInternal(this.component+ testName+ 'CRASHED');
                console.error(ex);
            }
        }

    }
    async getAdminToken(PORT)
    {
        this.path = 'http://localhost:'+PORT+'/api/user/';
        this.component = 'USER';
        {
            let testName = ";LOGIN:TEST CORRECT DATA 2 ";
            try{
                const result = await request.post({
                    url:     this.path + 'login',
                    body: {email:'qwerty@mail.com', password:'qwerty'},
                    json: true
                });
                if(result.statusCode!=200||result.body.token.split('.').length!=3)//||!result.body.message||result.body.message.length!=2)
                {                                    
                    logger.printError(this.component+ testName +'FAILED');
                }
                else
                {                                        
                    this.adminToken=result.body.token;                    
                    logger.printSuccess(this.component+ testName+'SUCCESS');
                    return this.adminToken;
                }            
            }catch(ex){
                logger.printInternal(this.component+ testName+'CRASHED');
                console.error(ex)
            }
        }
    }

    getCommentsTest()
    {
        //TODO
    }

}

module.exports = new userTests();