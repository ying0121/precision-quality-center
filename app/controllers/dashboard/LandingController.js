
var nodemailer = require('nodemailer');

const pqsetting = require('../../models/settings/QPSetting');
const setting = require("../../models/Setting");

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

exports.landingPage = async (req, res, next) => {
	try {
		let config = {}
		// get background status
		const bg_status = await setting.findOne({ where: { code: 'bg_status' } })
		if (bg_status) {
			if (bg_status.display == "video") {
				config["bg_status"] = "video"

				// get url
				const url = await setting.findOne({ where: { code: "bg_video" } })
				config["bg_url"] = url ? url.display : ""
			} else {
				config["bg_status"] = "image"

				// get url
				const url = await setting.findOne({ where: { code: "bg_image" } })
				config["bg_url"] = url ? url.display : "../default-bg.jpg"
			}
		} else {
			config["bg_status"] = "image"

			// get url
			const url = await setting.findOne({ where: { code: "bg_image" } })
			config["bg_url"] = url ? url.display : "../default-bg.jpg"
		}

		// get background text status
		text_status = await setting.findOne({ where: { code: "bg_text" } })
		if (text_status && text_status.display == "true") {
			config["bg_text"] = true
		} else {
			config["bg_text"] = false
		}

		// get background footer
		const footer = await setting.findOne({ where: { code: 'bg_footer' } })
		if (footer) {
			config['bg_footer'] = footer.detail
		} else {
			config['bg_footer'] = ""
		}

		const wordlist = await pqsetting.findAll();
		res.render('dashboard/landing', { layout: '', wordlist: wordlist, config: config, loginPage: true, pageTitle: 'PRECISION QUALITY', errorMessage: message(req), oldInput: oldInput(req), site_key: process.env.GOOGLE_SITE_KEY });
	} catch (error) {
		res.render('dashboard/landing', { layout: '', wordlist: [], config: config, loginPage: true, pageTitle: 'PRECISION QUALITY', errorMessage: message(req), oldInput: oldInput(req), site_key: process.env.GOOGLE_SITE_KEY });
	}
};

exports.sendMail = async (req, res, next) => {
	const information = req.body

	try {
		// initialize mailer
		var mail = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			}
		})
		// mail configuration
		const options = {
			from: information.email,
			to: "info@precisionq.com,roswellg@gmail.com",
			subject: `${information.name} sent a message!`,
			html: `<div>
				<p>Name : ${information.name}</p>
				<p>Email : ${information.email}</p>
				<p>Phone Number : ${information.phone}</p>
				<p>${information.message}</p>
			</div>`
		}
		mail.sendMail(options, err => {
			console.log(mail)
			if (err) {
				res.status(200).json({ status: 'error' })
			} else {
				res.status(200).json({ status: 'success' })
			}
		})
	} catch (error) {
		res.status(500).send(error.message)
	}
}
