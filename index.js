const path = require('path');
// load dependencies
const env = require('dotenv');
//const csrf = require('csurf');
const express = require('express');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressHbs = require('express-handlebars');
const SequelizeStore = require("connect-session-sequelize")(session.Store); // initalize sequelize with session store
const cors = require('cors');

const app = express();
//const csrfProtection = csrf();
const router = express.Router();

//Loading Routes
const landingRoutes = require('./routes/dashboard/landing');
const webRoutes = require('./routes/web');
const sequelize = require('./config/database');
const errorController = require('./app/controllers/ErrorController');

env.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
	const originalRedirect = res.redirect.bind(res);
	res.redirect = (url) => {
		if (url.startsWith('/')) {
			url = process.env.PREFIX_URL + url;
		}
		originalRedirect(url);
	};
	next();
});
app.use(process.env.PREFIX_URL, express.static(path.join(__dirname, 'public')));

// required for csurf
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET,
	cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
	store: new SequelizeStore({
		db: sequelize
	}),
}));

//app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	if (req.session.user)
		res.locals.username = req.session.user.fname + " " + req.session.user.lname;
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.env = process.env;
	//res.locals.csrfToken = req.csrfToken();
	next();
});

app.engine(
	'hbs',
	expressHbs({
		helpers: {
			json: function (context) {
				return JSON.stringify(context);
			},
			getProperty: function (context, key) {
				return context[key];
			}
		},
		layoutsDir: 'views/layouts/',
		defaultLayout: 'web_layout',
		extname: 'hbs'
	})
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(cors());
app.use("/", landingRoutes);
app.use(process.env.PREFIX_URL, webRoutes);

app.use(errorController.pageNotFound);

sequelize
	.sync()
	// .sync({ alter: true })
	.then(() => {
		app.listen(process.env.PORT);
		//pending set timezone
		console.log("App listening on port " + process.env.PORT);
	})
	.catch(err => {
		console.log(err);
	});
