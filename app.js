var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var webhookRouter = require('./routes/webhook');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/nexmo-client/dist/')));
app.use(express.static(path.join(__dirname, 'public')));

var User = require('./models/user');
var session = require('express-session');
var passport = require('passport');
var jwtStrategy = require('passport-jwt').Strategy;
var jwtExtractor = require('passport-jwt').ExtractJwt;

app.use(session({ 
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new jwtStrategy({ 
  jwtFromRequest: jwtExtractor.fromUrlQueryParameter('token'),
  secretOrKey: process.env.SECRET
}, (payload, done) => {
  return done(null, payload);
}))

app.use('/', indexRouter);
app.use('/webhooks', webhookRouter);
app.use('/auth', passport.authenticate('jwt', { session: true }), authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
