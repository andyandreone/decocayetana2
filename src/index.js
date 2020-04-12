const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOVerride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Initializations
const app = express();
require('./config/database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
//ESTA LINEA DE CODIGO ES PARA QUE CUANDO SE ENVIEN LOS FORMULARIOS SE PUEDAN ENTENDER, PERO OJO QUE PARECE QUE EL EXTENDED FALSE NO PERMITE IMAGENES
app.use(express.urlencoded({extended: false}));

app.use(methodOVerride('_method'));
app.use(session({
  secret: 'appparamiprima',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//Global Variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;


  next();
});
//Routes
app.use(require('./routes/index'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});

//Parche
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
app.engine('.hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
