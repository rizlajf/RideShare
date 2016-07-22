var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

mongoose.connect("mongodb://localhost/RiderShareDb");
var db = mongoose.connection;

// define the collection
//var collection = db.collection('RiderShare');

var RiderSchema = mongoose.Schema({
    FirstName: String,
    LastName: String,
    UserName: String,
    PassWord: String,
    Email: String,
    userType: String
});

var UserLocationSchema = mongoose.Schema({
    UserName: String,
    Longitude: String,
    Latitude: String
});

var RiderModel = mongoose.model("Rider", RiderSchema, 'RiderShare');
var UserLocationModel = mongoose.model("UserLocation", UserLocationSchema, 'RiderShare');


db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
    console.log("RiderShareDb is open...");
});

//var salt = bcrypt.genSaltSync(10);

exports.Register = function (request, response) {
    
    RiderModel.findOne(
        { UserName: request.body.UserName },
  function (error, user) {
            if (error)
                response.send(500, { error: addError });
            if (user) {
                var msg = 'Username "' + request.body.UserName + '" is already exists';
                response.json({ success: true, message: msg });
            }
            else {
                CreateUser();
            }
        }
    );
    
    function CreateUser() {
        //bcrypt.genSalt(10, function (err, salt) {
        //    bcrypt.hash(request.body.PassWord, salt, function (err, hash) {
        //        var passwordToSave = hash;
        //    });
        //});
        //var passwordToSave = bcrypt.hashSync(request.body.PassWord, salt);
        var passwordToSave = request.body.Password;
        var NewRider = { FirstName: request.body.FirstName, LastName: request.body.LastName, UserName: request.body.UserName, PassWord: passwordToSave, Email: request.body.Email, userType: request.body.UserType };
        RiderModel.create(NewRider, function (addError, addedRider) {
            if (addError) {
                response.send(500, { error: addError });
            }
            else {
                response.json({ success: true });
            }
        });
    };
};

exports.AuthenticateUser = function (request, response) {
    RiderModel.findOne(
        { UserName: request.body.UserName },
    function (error, user) {
            if (error)
                response.send(500, { error: addError });
            
            //if (user && bcrypt.compareSync(request.body.PassWord, user.PassWord)) { 
            if (user) {
                //bcrypt.compare(request.body.PassWord, hash, function (err, res) {
                //    if (res === true) {
                //        var token = jwt.sign(user, "secret");
                //        GetUserCordinates(token);
                //    }
                //});       
                console.log(request.body.UserName);
                console.log(request.body.Password);
                console.log(user.PassWord);
                if (request.body.Password != user.PassWord) {
                    response.json({ success: false, Message: 'Authentication failed' });
                }
                else {
                    var token = jwt.sign(user, "secret");
                    response.json({ success: true, token: token });
                }
            }
            else
                response.json({ success: false, Message: 'User not found' });
        }
    )

};



function GetUserCordinates(token) {
    UserLocationModel.findOne(
        { UserName: request.body.UserName }, function (Error, userCordinate) {
            if (Error)
                response.send(500, { Error: addError });
            if (userCordinate.Longitude != null)
                response.json({ success: true, token: token, Longitude: userCordinate.Longitude, Latitude: userCordinate.Latitude });
            else
                response.json({ success: true, token: token, UserLocation: 'Enter user cordinates' });
        }
    )
};

exports.UpdateUser = function (req, res) {
    RiderModel.findOne({ UserName: req.body.UserName }, function (err, user) {
        if (err)
            res.send(500, { error: addError });
        if (user != null) {
            user.FirstName = req.body.UserName,
            user.LastName = req.body.UserName,
            user.UserName = req.body.UserName,
            //user.PassWord = bcrypt.hashSync(req.body.PassWord, salt),
            user.PassWord = req.body.Password,
            user.Email = req.body.UserName,
            user.userType = req.body.UserType
            
            user.save(function (err) {
                if (err)
                    res.send(500, { error: addError });
                res.json({ success: true });
            })
        }
    }
        
    )
};

exports.UpdateUserCordinates = function (request, response) {
    UserLocationModel.findOne(
        { UserName: request.body.UserName }, function (error, userCordinates) {
            if (error)
                response.send(500, { error: addError });
            if (userCordinates != null) {
                userCordinates.Longitude = request.body.Longitude,
                userCordinates.Latitude = request.body.Latitude
                
                userCordinates.save(function (err) {
                    if (err)
                        response.send(500, { error: addError });
                    
                    response.json({ success: true });
                })
            }
            else {
                var NewUserLocationModel = new UserLocationModel(
                    {
                        NewUserLocationModel: UserName = request.body.UserName,
                        NewUserLocationModel: Longitude = request.body.Longitude,
                        NewUserLocationModel: Latitude = request.body.Latitude
                    });
                
                NewUserLocationModel.save(function (error) {
                    if (error)
                        response.send(500, { error: addError });
                    
                    response.json({ success: true });
                })
            }
        }
    )
};

exports.fetchDrivers = function (request, response) {
    RiderModel.find({ "userType": "driver" }).exec(function (err, res) {
        if (err) {
            request.send(500, { error: err });
        }
        else {
            response.json(res);
        }
    });
};

//test methods
exports.fetch = function (request, response) {
    RiderModel.find({}, function (err, users) {
        if (err) {
            response.send(500, { error: err });
        }
        else {
            
            var userDatas = new Array();
            users.forEach(function (user) {
                var userData = {};
                userData.UserName = user.UserName;
                userData.Email = user.Email;
                userData.FirstName = user.FirstName;
                userData.LastName = user.LastName;
                userData.Longitude = user.Longitude;
                userData.Latitude = user.Latitude;
                userData.userType = user.userType;
                userDatas.push(userData);
            });
            
            response.send({ users: userDatas, success: true });
        }
    });
};

exports.fetchLocations = function (request, response) {
    UserLocationModel.find().exec(function (err, res) {
        if (err) {
            response.send(500, { error: err });
        }
        else {
            response.send(res);
        }
    });
};

exports.deleteUser = function (request, response) {
    if (request.body.id != null) {
        RiderModel.remove(
            { _id: request.body.id }, function (err, result) {
                if (err)
                    response.send(500, { error: err });
                else
                    response.send((result === 1) ? { msg: 'Deleted' } : { msg: 'result: ' + result });
            }
        )
    }
    else {
        RiderModel.remove(
            { UserName: request.body.UserName }, function (err, result) {
                if (err)
                    response.send(500, { error: err });
                else
                    response.send((result === 1) ? { msg: 'Deleted' } : { msg: 'result: ' + result });
            }
        )
    }
};