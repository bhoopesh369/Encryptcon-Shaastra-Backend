const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const config = require('./config');

const indexRouter = require('./ui/routes/index');
const apiRouter = require('./ui/routes/api');
const indyHandler = require('./indy/src/handler')({ defaultHandlers: true, eventHandlers: [] }); // () executes the function so that we can potentially have multiple indy handlers;
// const uiMessageHandlers = require('./ui/uiMessageHandlers');
// uiMessageHandlers.enableDefaultHandlers(indyHandler);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'ui/views'));
app.set('view engine', 'ejs');

const FileStore = require('session-file-store')(session);
app.use(session({
  name: `server-session-cookie-id-for-${config.walletName}`,
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true,
  rolling: true,
  store: new FileStore()
}));

app.use(logger('dev'));

app.use(cors({
  origin: ['http://localhost:5173'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use((req, res, next) => {
  const corsWhitelist = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:9000',
  ];
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'ui/public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.post('/indy', indyHandler.middleware);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
