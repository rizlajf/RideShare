var express = require('express');
var router = express.Router();
var DbOps = require('./DBAccessLayer/DBOperations.js');
var jwt = require('jsonwebtoken');


router.post('/newRider', DbOps.Register);
router.post('/rider/auth', DbOps.AuthenticateUser);


router.get('/', function (request, response) {
    response.send("<b>This response is generated from rooooooo router!!</b>");
});

router.get('/newRider', function (request, response) {
    response.send("<b>This response is generated from get router!!</b>");
});

//test methods
router.get('/Riders', DbOps.fetch);

router.use ( function (request, response, next) {
    
    // check header or url parameters or post parameters for token
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    
    // decode token
    if (token) {
        jwt.verify(token, "secret", function (Error, decoded) {
            if (Error)
                return response.json({ success: false, message: 'Failed to authenticate token.' });
            else {
                // if everything is good, save to request for use in other routes
                //request.decoded = decoded;
                next();
            }
        });
    }
    else {
        // if there is no token
        // return an error
        return response.status(403).send({
            success: false, 
            message: 'No token provided.'
        });
    }
});

router.post('/riderCordinates', DbOps.UpdateUserCordinates);
router.get('/drivers', DbOps.fetchDrivers);
router.post('/rider', DbOps.UpdateUser);


router.get('/ridersCordinates', DbOps.fetchLocations);
router.post('/rider/delete', DbOps.deleteUser);



module.exports = router;

