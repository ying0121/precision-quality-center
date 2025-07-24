
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');
const UserSecurity = require("../models/settings/UserSecurity");
const SecurityQuestion = require("../models/settings/SecurityQuestion");

const message = (req) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	return message;
}

const oldInput = (req) => {
	let oldInput = req.flash('oldInput');
	if (oldInput.length > 0) {
		oldInput = oldInput[0];
	} else {
		oldInput = null;
	}

	return oldInput;
}

exports.loginPage = (req, res, next) => {
	res.render('login', { layout: 'login_layout', loginPage: true, pageTitle: 'Login', errorMessage: message(req), oldInput: oldInput(req) });
};

exports.securityPage = (req, res, next) => {
	if (req.session.user) {
		res.render('security', { layout: 'login_layout', loginPage: true, pageTitle: 'Security', errorMessage: message(req), oldInput: oldInput(req), question: req.session.question });
	} else {
		res.redirect("/");
	}
};

exports.login = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.inputEmail)) validationErrors.push('Please enter a valid email address.');
	if (validator.isEmpty(req.body.inputPassword)) validationErrors.push('Password cannot be blank.');
	if (validationErrors.length) {
		req.flash('error', validationErrors);
		return res.redirect('/login');
	}
	User.findOne({
		where: {
			email: req.body.inputEmail
		}
	}).then(user => {
		if (user) {
			if (user.status != 1) {
				req.flash('error', 'Sorry, your account is not actived.');
				return res.redirect('/login');
			} else if (user.status == 1) {
				bcrypt.compare(req.body.inputPassword, user.password).then(doMatch => {
					if (doMatch) {
						// security
						UserSecurity.findAll({
							where: {
								user_id: user.id
							}
						}).then((ques => {
							if (ques.length) {
								// random number
								const index = Math.floor(Math.random() * 100) % ques.length;
								SecurityQuestion.findOne({
									where: {
										id: ques[index].question_id
									}
								}).then(que => {
									req.session.user = user.dataValues;
									req.session.question = que.question;
									req.session.question_id = que.id;

									return req.session.save(err => {
										return res.redirect("/security");
									});
								})
							} else {
								req.session.isLoggedIn = true;
								req.session.user = user.dataValues;
								req.session.cookie._expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day in milliseconds
								req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // 1 day in milliseconds

								return req.session.save(err => {
									return res.redirect("/");
								})
							}
						}))
					} else {
						req.flash('error', 'Your email or password is not correct.');
						req.flash('oldInput', { email: req.body.inputEmail });
						return res.redirect('/login');
					}
				}).catch(err => {
					console.log(err);
					req.flash('error', 'Sorry! Somethig went wrong.');
					req.flash('oldInput', { email: req.body.inputEmail });
					return res.redirect('/login');
				});
			}
		} else {
			req.flash('error', 'No user found with this email');
			req.flash('oldInput', { email: req.body.inputEmail });
			return res.redirect('/login');
		}
	}).catch(err => console.log(err));
};

exports.security = async (req, res, next) => {
	const validationErrors = [];
	try {
		if (validator.isEmpty(req.body.inputAnswer)) validationErrors.push('Password cannot be blank.');
		if (validationErrors.length) {
			req.flash('error', validationErrors);
			return res.redirect('/security');
		}

		const user_security = await UserSecurity.findOne({ where: { user_id: req.session.user.id } })
		if (user_security) {
			bcrypt.compare(req.body.inputAnswer, user_security.answer).then(doMatch => {
				if (doMatch) {
					req.session.isLoggedIn = true;
					req.session.save(error => {
						console.log(error);
						res.redirect("/");
					})
				} else {
					req.session.destroy(err => {
						return res.redirect('/');
					});
				}
			})
		} else {
			req.flash('error', 'Your answer is not correct.');
			return res.redirect('/login');
		}
	} catch (error) {
		console.log(error)
	}
};

exports.logout = (req, res, next) => {
	if (res.locals.isAuthenticated) {
		req.session.destroy(err => {
			return res.redirect('/');
		});
	} else {
		return res.redirect('/login');
	}
};

exports.signUpPage = (req, res, next) => {
	res.render('sign_up', { layout: 'login_layout', signUpPage: true, errorMessage: message(req), oldInput: oldInput(req) });
};

exports.signUp = (req, res, next) => {
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if (!user) {
			return bcrypt
				.hash(req.body.password, 12)
				.then(hashedPassword => {
					const user = new User({
						fullName: req.body.name,
						email: req.body.email,
						password: hashedPassword,
					});
					return user.save();
				})
				.then(result => {
					return res.redirect('/login');
				});
		} else {
			req.flash('error', 'E-Mail exists already, please pick a different one.');
			req.flash('oldInput', { name: req.body.name });
			return res.redirect('/sign-up');
		}
	}).catch(err => console.log(err));
};