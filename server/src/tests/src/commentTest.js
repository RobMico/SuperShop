//const request = require('request');
const request = require('./requestAsync');
const logger = require('./logger');
const jwt_decode = require('jwt-decode');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


class commentsTest {
    async runAll(PORT) {
        this.path = 'http://localhost:'+PORT+'/api/comment/';
        this.component = 'COMMENTS';
    }
}

module.exports = new commentsTest();