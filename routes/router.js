var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Story = require('../models/story');
var Part= require('../models/part');
var url = require('url');


// GET route for reading data
router.get('/', function (req, res, next) {
  Story.find({}).populate('author').exec(function (err, stories) {
  res.render("index",{stories:stories,user:req.session.username });
});
});
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
router.get("/signup",function(req,res){
  
  res.render("signup",{user:req.session.username})
});

router.get("/login",function(req,res){
  res.render("login",{user:req.session.username})
});

   
   



// router.post('/story:id',function(req,res,next){
//   console.log("burda")
//   if(req.body.content){
//     console.log(req.params.id)
//     var partData = new Part({
//       content: req.body.content,
//       author:req.session.userId,
//       story:req.params.id
//     });
//     Part.create(partData, function (error, part) {
//       if (error) {
//         return next(error);
//       } else {
//         User.findOne({_id: req.session.userId},function (err, user){
//           if(err) {
//             console.log(err)
//           }
//           else{
//             console.log(user.username)
        
          
//         user.parts.push(partData);
//         console.log(user.parts[0])
        
//         user.save( function(err) {
//           if(err){
//               console.log(err)
//           }
          
//       });
        
//            }
        
        
//       });
//       Story.findOne({_id: req.params.id},function (err, story){
//         if(err) {
//           console.log(err)
//         }
//         else{
//           console.log(story.title)
      
        
//       story.parts.push(partData);
//       console.log(story.parts[0])
      
//       story.save( function(err) {
//         if(err){
//             console.log(err)
//         }
        
//     });
      
//          }
      
      
//     });
//     }

//   });
//   console.log("burda")
//   res.redirect("/story"+req.params.id)
//   }
// });
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
        req.session.username=user.username;
        req.session.userId=user._id;
        res.redirect("/")
        
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
        req.session.username=user.username;
        req.session.userId=user._id;
        console.log("giriş başarılı")
        res.redirect("/")
        
        
        
      }
      
    });
  }
  
  else if(req.body.title&&req.body.content) { // create a story
    var storyData = new Story({
      title: req.body.title,
      content: req.body.content,
      author:req.session.userId
    });
    Story.create(storyData, function (error, story) {
      if (error) {
        return next(error);
      } else {
        User.findOne({_id: req.session.userId},function (err, user){
          if(err) {
            console.log(err)
          }
          else{
            console.log(user.username)
        
          
        user.stories.push(storyData);
        console.log(user.stories)
        
        user.save( function(err) {
          if(err){
              console.log(err)
          }
          
      });
        res.redirect("/")
           }
        
        
      });
    }

  });
}

  else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

router.get('/story:id', function (req, res, next) {
  console.log("get idlide")
  Story.findOne({_id: req.params.id}).populate('author').exec(function (err, story){
    //console.log(story._id)
    Part.find({story: story._id}).populate('author').exec(function (err, parts){
    
    res.render('story',{story:story,user:req.session.username,parts:parts,storyId:req.params.id,userId:req.session.userId});  
  });
  });
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