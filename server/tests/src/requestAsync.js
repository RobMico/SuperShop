const request = require('request');

var myObj ={
post:(params)=>{
    return new Promise(function (resolve, reject) {
      request.post(params, function (error, res, body) {
        if (!error) {
          resolve(res);
        } else {
          reject(error);
        }
      });
    });
  },
  get:(params)=>{
    return new Promise(function (resolve, reject) {
      request.get(params, function (error, res, body) {
        if (!error) {
          resolve(res);
        } else {
          reject(error);
        }
      });
    });
  }
}

module.exports = myObj;