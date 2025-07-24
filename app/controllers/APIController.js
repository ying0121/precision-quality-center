
const ContactTrack = require('../models/ContactTrack');
const Insurance = require('../models/Insurance')
const Clinic = require('../models/Clinic')
const ClinicInsurance = require('../models/ClinicInsurance');
const Agreement = require("../models/Agreement");

const sequelize = require('sequelize');
const { Op, Sequelize } = require('sequelize');

exports.createAPI = async (req, res, next) => {
	const newRecord = ContactTrack.build({
		clinic: req.body.clinic,
		case_number: req.body.case_number,
		type: req.body.type,
		reason: req.body.reason,
		name: req.body.name,
		email: req.body.email,
		cel: req.body.cel,
		dob: req.body.dob,
		subject: req.body.subject,
		message: req.body.message,
		assign: req.body.assign,
		date: new Date(),
		lang: req.body.lang,
		besttime: req.body.besttime
	});

	// Save the new record to the database
	newRecord.save()
		.then((record) => {
			res.send('ok');
		})
		.catch((error) => {
			res.send(error.message);
		});
};

exports.readAPI = async (req, res, next) => {
	try {
		const contact_tracks = await ContactTrack.findAll({ where: { clinic: req.body.clinic } });
		res.json({ data: contact_tracks });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};
exports.readOneAPI = async (req, res, next) => {
	try {
		const contact_track = await ContactTrack.findOne({ where: { id: req.body.id } });
		if (!contact_track)
			throw new Error('Contact track not found');
		res.json(contact_track);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.updateAPI = async (req, res, next) => {
	const updates = {
		assign: req.body.assign,
		status: req.body.status,
		priority: req.body.priority,
	};
	// Update the record
	ContactTrack.update(updates, {
		where: {
			id: req.body.id // Update the record with the specified ID
		}
	}).then(numRowsAffected => {
		res.send('ok');
	}).catch(error => {
		res.send(error.message);
	});
};
exports.updateByCaseNumber = async (req, res, next) => {
	const updates = {
		assign: req.body.assign,
		status: req.body.status,
		priority: req.body.priority,
	};
	try {
		await ContactTrack.update(updates, { where: { case_number: req.body.case_number } })

		// send email
		if (updates.status == 3) { // closed status
		}
		res.send('ok');
	} catch (error) {
		res.send(error.message)
	}
};
exports.deleteAPI = async (req, res, next) => {
	try {
		await ContactTrack.destroy({ where: { id: req.body.id } });
		res.send('ok');
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.deleteByCaseNumber = async (req, res, next) => {
	try {
		await ContactTrack.destroy({ where: { case_number: req.body.case_number } });
		res.send('ok');
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
exports.readInsuranceByClinicAPI = async (req, res, next) => {
	try {
		let insurances = [];
		// 1. get clinic information
		const clinic = await Clinic.findOne({ where: { clinic_id: req.body.clinic_id } });
		// 2. get all insurances of the clinic
		const insurance_infoes = await ClinicInsurance.findAll({
			where: { clinic_id: clinic.id },
			attributes: [[sequelize.col('insurance_id'), 'id']]
		});
		// 3. get insurances
		if (insurance_infoes.length > 1) {
			let ids = []
			insurance_infoes.forEach(item => {
				ids.push({ id: item.id })
			})
			insurances = await Insurance.findAll({
				where: {
					[Op.or]: ids
				}
			})
		} else if (insurance_infoes.length == 1) {
			insurances = await Insurance.findAll({ where: { id: insurance_infoes[0].id } })
		}
		res.json(insurances);
	} catch (error) {
		res.status(500).json([])
	}
}
exports.getTermsOfUse = async (req, res, next) => {
	let lang_id = 17
	if (req.body.lang == "en") {
		lang_id = 17
	} else if (req.body.lang == "es") {
		lang_id = 25
	}

	try {
		// get clinic id
		const clinic = await Clinic.findOne({ where: { clinic_id: req.body.clinic_id } });


		const agreement = await Agreement.findOne({
			where: {
				[Sequelize.Op.and]: [
					Sequelize.where(Sequelize.fn('FIND_IN_SET', clinic.id, Sequelize.col('clinic_id')), { [Op.ne]: 0 }),
					{ name: 'terms of use' },
					{ lang_id: lang_id }
				]
			}
		});
		res.json(agreement);
	} catch (error) {
		res.send(error.message);
	}
}
exports.getPrivacyPolicy = async (req, res, next) => {
	let lang_id = 17
	if (req.body.lang == "en") {
		lang_id = 17
	} else if (req.body.lang == "es") {
		lang_id = 25
	}

	try {
		// get clinic id
		const clinic = await Clinic.findOne({ where: { clinic_id: req.body.clinic_id } });

		const agreement = await Agreement.findOne({
			where: {
				[Op.and]: [
					Sequelize.where(Sequelize.fn('FIND_IN_SET', clinic.id, Sequelize.col('clinic_id')), { [Op.ne]: 0 }),
					{ name: 'privacy policy' },
					{ lang_id: lang_id }
				]
			}
		});
		res.json(agreement);
	} catch (error) {
		res.send(error.message);
	}
}