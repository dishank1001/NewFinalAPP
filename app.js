const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const db = require('./config/db')
const morgan  = require('morgan')
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');


dotenv.config({path: './config/config.env'})

db()

const app = express()

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(passport.initialize());
app.use(passport.session())
require('./config/passport')(passport);

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))

app.use(flash());


// Routes
app.use('/', require('./routes/index.js'))
app.use('/users', require('./routes/users.js'))

if(process.env.NODE_ENV === 'production') {
   
  app.use(express.static(path.join(__dirname, "client", "build")))

  app.get('*',(req, res) => {
      res.sendFile(path.join(__dirname,'client','build','index.html'));
  });
}

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log( `Server running in ${process.env.NODE_ENV} mode`)) 