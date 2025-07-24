
const axios = require("axios")
const Clinic = require('../models/Clinic');

const util_permission = require('../utilities/permission');

const permission_name = ["CLINICS"];

exports.clinicPage = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.render('403')

	res.render('clinic');
};

exports.createClinic = async (req, res, next) => {
	// permission
	_permission = 2; // create
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const newRecord = Clinic.build({
			clinic_id: req.body.clinic_id,
			name: req.body.name,
			acronym: req.body.acronym,
			address1: req.body.address1,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zip: req.body.zip,
			phone: req.body.phone,
			email: req.body.email,
			web: req.body.web,
			protal: req.body.portal,
		});

		// Save the new record to the database
		await newRecord.save()
		res.send('ok');
	} catch (error) {
		res.send(error.message);
	}
};

// read from db
exports.read = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const clinic = await Clinic.findAll();
		res.json({ data: clinic });
	} catch (error) {
		res.send(error.message);
	}
};

// read from conector
exports.readClinics = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	// before this, we will get all clinic information from pro.conectorhealth.com
	const clinic = await Clinic.findOne({ where: { id: 1 } });
	if (clinic == null || new Date() - new Date(clinic[0].updatedAt) > 3600 * 24 * 1000) {
		await axios.post("https://pro.conectorhealth.com/api/setting/getconectorcliniclist").then(response => {
			if (response.data) {
				response.data.forEach(async item => {
					const one = await Clinic.findOne({ where: { clinic_id: item.id } })
					if (one == null) {
						const newRecord = Clinic.build({
							clinic_id: item.id,
							name: item.name,
							address1: item.address1,
							address2: item.address2,
							city: item.city,
							state: item.state,
							zip: item.zip,
							phone: item.phone,
							email: item.email,
							web: item.web,
							portal: item.portal,
						});

						// Save the new record to the database
						await newRecord.save()
					} else {
						const updates = {
							clinic_id: item.id,
							name: item.name,
							address1: item.address1,
							address2: item.address2,
							city: item.city,
							state: item.state,
							zip: item.zip,
							phone: item.phone,
							email: item.email,
							web: item.web,
							portal: item.portal,
						};
						numRowsAffected = await Clinic.update(updates, {
							where: {
								clinic_id: updates.clinic_id // Update the record with the specified ID
							}
						})
					}
				})
			}
		}).catch(async error => {
		});
	}

	try {
		const clinics = await Clinic.findAll();
		res.json({ data: clinics });
	} catch (error) {
		res.send(error.message);
	}
};

exports.readOnlyNames = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const names = await Clinic.findAll({ attributes: ['id', 'name'] });
		res.json({ data: names });
	} catch (error) {
		res.send(error.message);
	}
};

exports.readOneClinic = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const clinic = await Clinic.findOne({ where: { id: req.body.id } });
		res.json(clinic);
	} catch (error) {
		res.send(error.message);
	}
};

exports.updateClinic = async (req, res, next) => {
	// permission
	_permission = 5; // write
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const updates = {
			clinic_id: req.body.clinic_id,
			name: req.body.name,
			acronym: req.body.acronym,
			address1: req.body.address1,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zip: req.body.zip,
			phone: req.body.phone,
			email: req.body.email,
			web: req.body.web,
			portal: req.body.portal,
		};
		// Update the record
		numRowsAffected = await Clinic.update(updates, {
			where: {
				id: req.body.id // Update the record with the specified ID
			}
		})
		res.send('ok');
	} catch (error) {
		res.send(error.message);
	};
};

exports.deleteClinic = async (req, res, next) => {
	// permission
	_permission = 7; // delete
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		await Clinic.destroy({ where: { id: req.body.id } });
		res.send('ok');
	} catch (error) {
		res.send(error.message);
	}
};
