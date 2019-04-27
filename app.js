var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');
var Story = require('./models/story');
var Part= require('./models/part');

//connect to MongoDB
mongoose.connect('mongodb://localhost/bizimhikayemiz');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static('views'))


// app.get('/', function (req, res, next) {
//   res.render('index')
// });

var routes = require('./routes/router');
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

var User = require('./models/user');
var Story = require('./models/story');
server = app.listen(3000)
const io = require("socket.io")(server)
io.on('connection', (socket) => {
  socket.username="batuhan"
	console.log('New user connected')
    socket.on('new_message', (data) => {
      //veritabanına kayıt işlemi burada olacak
      console.log("story id:"+data.storyId)
      console.log("user id:"+data.userId)
      var partData = new Part({
              content: data.message,
              author:data.userId,
              story:data.storyId
            });
            Part.create(partData, function (error, part) {
              if (error) {
                console.log(error);
              } else {
                User.findOne({_id: data.userId},function (err, user){
                  if(err) {
                    console.log(err)
                  }
                  else{
                    console.log(user.username)
                
                  
                user.parts.push(partData);
                console.log(user.parts[0])
                
                user.save( function(err) {
                  if(err){
                      console.log(err)
                  }
                  
              });
                
                   }
                
                
              });
              Story.findOne({_id: data.storyId},function (err, story){
                if(err) {
                  console.log(err)
                }
                else{
                  console.log(story.title)
              
                
              story.parts.push(partData);
              console.log(story.parts[0])
              
              story.save( function(err) {
                if(err){
                    console.log(err)
                }
                
            });
              
                 }
              
              
            });
            }
        
          });
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })
	
	

    //listen on change_username
    // socket.on('change_username', (data) => {
    //     socket.username = data.username
    // })

    // //listen on new_message
    // socket.on('new_message', (data) => {
    //     //broadcast the new message
    //     io.sockets.emit('new_message', {message : data.message, username : socket.username});
    // })

    // //listen on typing
    // socket.on('typing', (data) => {
    // 	socket.broadcast.emit('typing', {username : socket.username})
    // })
})
// const user = new User({
//   username: 'IanFleming',
//   password:"ksdfjksld",
//   email: 'batuhanozkan23@gmail.com',
  
// });


// user.save(function (err) {
//   if (err) return handleError(err);

//   const story1 = new Story({
//     title: 'Casino Royale',
//     content:'denemeler',
//     author: user._id    // assign the _id from the person
//   });
 
 
  
  

//   story1.save(function (err) {
    
//     if (err) return handleError(err);
//     // thats it!
//     else {
//   //     Story.
//   //     findOne({ title: 'Casino Royale' }).
//   //     populate('author').
//   //     exec(function (err, story) {
//   //     if (err) return handleError(err);
//   //       console.log('The author is %s', story.author.username);
    
//   // });
  
  
//     }
//   });
// });
// const story2 = new Story({
//   title: 'Casino Royale',
//   content:'denemeler',
//   author: user._id    // assign the _id from the person
// });
// user.stories.push(story2);
// user.save();
// User.
//   findOne({ username: 'IanFleming' }).
//   populate('stories'). // only works if we pushed refs to children
//   exec(function (err, user) {
//     if (err) return handleError(err);
//     console.log(user.stories[0]);
//   });
  // Story.
  // findOne({ title: 'Casino Royale' }).
  // populate('parts'). // only works if we pushed refs to children
  // exec(function (err, story) {
  //   if (err) return handleError(err);
  //   console.log(story.parts[3].content);
  // });
//console.log("sddfmsd"+session.userId)
// listen on port 3000
