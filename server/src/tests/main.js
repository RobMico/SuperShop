const PORT = 5000;
const request = require('request');
const userTests = require('./src/userTests');
const typeTests = require('./src/typeTests');
const brandTests = require('./src/brandTests');
const deviceTests = require('./src/deviceTests');
const basketTests = require('./src/basketTests');
const commentTests = require('./src/commentTest');


class Tests{
    static async run()
    {        
        await userTests.runAll(PORT);        
        //await userTests.getAdminToken(PORT);
        // await typeTests.runAll(PORT, userTests.adminToken);
        // await brandTests.runAll(PORT, userTests.adminToken);
        await Promise.all([typeTests.runAll(PORT, userTests.adminToken), brandTests.runAll(PORT, userTests.adminToken)]);
        await deviceTests.runAll(PORT, userTests.adminToken, typeTests.successType, brandTests.successBrand);
        basketTests.runAll(PORT, userTests.userToken?userTests.userToken:userTests.adminToken, deviceTests.successDeviceId);
    }
}

/*
DROP TEST DB:

DELETE FROM baskets;
DELETE FROM device_infos;
DELETE FROM comments;
DELETE FROM ratings;
DELETE FROM devices;
DELETE FROM brands;
DELETE FROM types;
DELETE FROM type_brands;
DELETE FROM users WHERE "role"!='ADMIN';

*/ 

Tests.run();