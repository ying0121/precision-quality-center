const PatientServiceCategory = require('../models/PatientServiceCategory');
const PatientService = require('../models/PatientService');
const util_upload = require('../utilities/upload');
const util_permission = require('../utilities/permission');

const permission_name = ["PATIENT_SERVICES", "PATIENT_SERVICE_CATEGORY"];

exports.categoryPage = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.render('403')

	res.render('patient_service_category');
};

exports.createCategory = async (req, res, next) => {
	// permission
	_permission = 2; // create
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const newRecord = PatientServiceCategory.build({
			en_name: req.body.en_name,
			es_name: req.body.es_name
		});

		// Save the new record to the database
		await newRecord.save()
		res.send('ok');
	} catch (error) {
		res.send(error.message);
	}
};

exports.readCategories = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const categories = await PatientServiceCategory.findAll();
		res.json({ data: categories });
	} catch (error) {
		res.send(error.message);
	}
};

exports.readOneCategory = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const category = await PatientServiceCategory.findOne({ where: { id: req.body.id } });
		res.json(category);
	} catch (error) {
		res.send(error.message);
	}
};

exports.updateCategory = async (req, res, next) => {
	// permission
	_permission = 5; // write
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const updates = {
			en_name: req.body.en_name,
			es_name: req.body.es_name,
			status: req.body.status
		};
		// Update the record
		numRowsAffected = await PatientServiceCategory.update(updates, {
			where: {
				id: req.body.id // Update the record with the specified ID
			}
		})
		res.send('ok');
	} catch (error) {
		res.send(error.message);
	};
};

exports.deleteCategory = async (req, res, next) => {
	// permission
	_permission = 7; // delete
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);
	if (!_status) return res.status(403).send("")

	try {
		await PatientServiceCategory.destroy({ where: { id: req.body.id } });
		res.send('ok');
	} catch (error) {
		res.send(error.message);
	}
};


exports.servicePage = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[1], _permission);
	if (!_status) return res.render('403')

	const categories = await PatientServiceCategory.findAll();
	const result = categories.find(item => item.id == req.query.category_id);

	res.render('patient_service', { category_id: req.query.category_id, category_name: result.en_name, categories: categories });
};

exports.createService = async (req, res, next) => {
	// permission
	_permission = 2; // create
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[1], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const newRecord = PatientService.build({
			category_id: req.body.category_id,
			en_name: req.body.en_name,
			es_name: req.body.es_name
		});

		// Save the new record to the database
		await newRecord.save();
		res.send('ok');
	}
	catch (error) {
		res.send(error.message);
	}
};

exports.readServices = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[1], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const services = await PatientService.findAll({ where: { category_id: req.body.category_id } });
		res.json({ data: services });
	} catch (error) {
		res.send(error.message);
	}
};

exports.readOneService = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[1], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const service = await PatientService.findOne({ where: { id: req.body.id } });
		res.json(service);
	} catch (error) {
		res.send(error.message);
	}
};

exports.updateService = async (req, res, next) => {
	// permission
	_permission = 5; // write
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[1], _permission);
	if (!_status) return res.status(403).send("")

	try {
		const updates = {
			category_id: req.body.category_id,
			en_name: req.body.en_name,
			es_name: req.body.es_name,
			en_desc: req.body.en_desc,
			es_desc: req.body.es_desc,
			en_detail: req.body.en_detail,
			es_detail: req.body.es_detail,
			contact: req.body.contact,
			status: req.body.status
		};
		// Update the record
		numRowsAffected = await PatientService.update(updates, {
			where: {
				id: req.body.id // Update the record with the specified ID
			}
		});
		res.send('ok');
	}
	catch (error) {
		res.send(error.message);
	}
};

exports.deleteService = async (req, res, next) => {
	// permission
	_permission = 7; // delete
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[1], _permission);
	if (!_status) return res.status(403).send("")

	try {
		await PatientService.destroy({ where: { id: req.body.id } });
		res.send('ok');
	} catch (error) {
		res.send(error.message);
	}
};

// // Usage example
exports.uploadServiceImage = async (req, res, next) => {
	// permission
	_permission = 5; // write
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[1], _permission);
	if (!_status) return res.status(403).send("")

	const destination = './public/assets/images/patient_service'; // Destination directory

	util_upload.uploadFile(req, destination, []).then(async (savedFileName) => {
		console.log('File uploaded successfully:', savedFileName);
		const service = await PatientService.findOne({ where: { id: req.body.id } });
		await util_upload.deleteOldFile(service.image, './public/assets/images/patient_service')

		const updates = {
			image: savedFileName
		};
		// Update the record
		numRowsAffected = await PatientService.update(updates, {
			where: {
				id: req.body.id // Update the record with the specified ID
			}
		});
		res.send('ok');
	}).catch(error => {
		res.send(error.message);
	});
};


