var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Story = require('../models/story');


// GET route for reading data
router.get('/', function (req, res, next) {
  res.render("index");
});

router.get("/signup",function(req,res){
  res.render("signup")
});

router.get("/login",function(req,res){
  res.render("login")
});

router.post('/', function (req, res, next) {
  if (req.body.reg_username && //signup
    req.body.reg_password) {
    var userData = {
      username: req.body.reg_username,
      password: req.body.reg_password,
      email:req.body.reg_email,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        res.render("index");
        
      }
    });
  }
  else if (req.body.lg_username && req.body.lg_password) { //LOGIN
      
    User.authenticate(req.body.lg_username, req.body.lg_password, function (error, user) {
        console.log(user);
      if (!user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        res.render("index")
        
        
        
      }
      
    });
  }
  
  else if(req.body.title&&req.body.content) {
    var storyData = {
      title: req.body.title,
      content: req.body.content,
    }
    Story.create(storyData, function (error, story) {
      if (error) {
        return next(error);
      } else {
        res.render("index");
        
      }
    });

  }

  else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});



//POST route for updating data
// router.post('/', function (req, res, next) {
//   // confirm that user typed same password twice
//   if (req.body.password !== req.body.passwordConf) {
//     var err = new Error('Passwords do not match.');
//     err.status = 400;
//     res.send("passwords dont match");
//     return next(err);
//   }

//   if (req.body.email &&
//     req.body.username &&
//     req.body.password &&
//     req.body.passwordConf) {

//     var userData = {
//       email: req.body.email,
//       username: req.body.username,
//       password: req.body.password,
//     }

//     User.create(userData, function (error, user) {
//       if (error) {
//         return next(error);
//       } else {
//         req.session.userId = user._id;
//         console.log("registerdayız");
//         return res.redirect('/profile');
//       }
//     });

//   } else if (req.body.logemail && req.body.logpassword) {
//     User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
//       if (error || !user) {
//         var err = new Error('Wrong email or password.');
//         err.status = 401;
//         return next(err);
//       } else {
//         req.session.userId = user._id;
//         console.log("logindeyiz");
//         return res.redirect('/profile');
//       }
//     });
//   } else {
//     var err = new Error('All fields required.');
//     err.status = 400;
//     return next(err);
//   }
// })

// // GET route after registering
// router.get('/profile', function (req, res, next) {
//   User.findById(req.session.userId)
//     .exec(function (error, user) {
//       if (error) {
//         return next(error);
//       } else {
//         if (user === null) {
//           var err = new Error('Not authorized! Go back!');
//           err.status = 400;
//           return next(err);
//         } else {
//           return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
//         }
//       }
//     });
// });

// // GET for logout logout
// router.get('/logout', function (req, res, next) {
//   if (req.session) {
//     // delete session object
//     req.session.destroy(function (err) {
//       if (err) {
//         return next(err);
//       } else {
//         return res.redirect('/');
//       }
//     });
//   }
// });

 module.exports = router;