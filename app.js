var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hotelRouter=require('./routes/hotel');
var indexRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var hbs=require('express-handlebars')
var app = express();
var db=require('./config/connection')
var session = require('express-session')
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'keyboard cat',
  cookie: { maxAge:600000 }
}))
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partial/'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
db.connect((err)=>{
  if(err) console.log("connectiion not succesfull "+err);
  else console.log("Data base connected");
})
app.use('/admin', indexRouter);
app.use('/', usersRouter);
app.use('/hotel', hotelRouter);


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
