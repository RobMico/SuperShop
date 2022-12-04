var logger = {    
    data:[],
    printError:(message)=>{
        logger.data.push({type:'E', message:message});
        console.log('\x1b[31m', message ,'\x1b[0m');    
    },
    printSuccess:(message)=>{
        logger.data.push({type:'S', message:message});
        console.log('\x1b[32m', message ,'\x1b[0m');    
    },
    printAdditional:(message)=>{
        logger.data.push({type:'A', message:message});
        console.log('\x1b[30m', message ,'\x1b[0m');    
    },
    printInternal:(message)=>{
        logger.data.push({type:'I', message:message});
        console.log('\x1b[41m', message ,'\x1b[0m');    
    }
}


module.exports = logger;