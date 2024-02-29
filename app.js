var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const http = require('http');

var app = express();


const server = http.createServer(app);
const io = require("socket.io")(server);
io.on('connection', function(socket){
  console.log('User Connected..');
  socket.emit("msg", "Anew user is connected");
})
//IMPORT ROUTE CONTACT
const contactsRouter = require('./routes/contact')
////////////////////////////////////////////////


//import database 
var mongoose = require('mongoose')
var configDB = require('./database/mongodb.json');


//config mongo (cnx a base)
mongoose.connect(configDB.mongo.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to DB !!");
}).catch(err => {
  console.error("Error connecting to DB:", err);
});


///////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

///////Utilistation route Contact////////
app.use('/contact',contactsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
