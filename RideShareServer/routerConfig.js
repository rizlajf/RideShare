var express = require('express');
var router = express.Router();
var DbOps = require('./DBAccessLayer/DBOperations.js');

router.post('/newRider', DbOps.Register);
router.post('/rider/auth', DbOps.AuthenticateUser);
router.post('/riderCordinates', DbOps.UpdateUserCordinates);
router.get('/drivers', DbOps.fetchDrivers);
router.post('/rider', DbOps.UpdateUser);

//test methods
router.get('/Riders', DbOps.fetch);
router.get('/ridersCordinates', DbOps.fetchLocations);
router.post('/rider/delete', DbOps.deleteUser);

router.get('/', function (request, response) {
    response.send("<b>This response is generated from rooooooo router!!</b>");
});

router.get('/newRider', function (request, response) {
    response.send("<b>This response is generated from get router!!</b>");
});

module.exports = router;

