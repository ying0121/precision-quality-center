const CommunityServiceCategory = require('../models/CommunityServiceCategory');
const CommunityService = require('../models/CommunityService');
const Clinic = require('../models/Clinic');

const util_upload = require('../utilities/upload');
const util_permission = require('../utilities/permission');

const permission_name = ["COMMUNITY_SERVICES"];

exports.createCategory = async (req, res, next) => {
	// permission
	_permission = 2; // create
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const newRecord = CommunityServiceCategory.build({
				en_name: req.body.en_name,
				es_name: req.body.es_name
			});

			// Save the new record to the database
			await newRecord.save()
			res.send('ok');
		} catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};

exports.readCategories = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const categories = await CommunityServiceCategory.findAll();
			res.json({ data: categories });
		} catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};

exports.readOneCategory = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const category = await CommunityServiceCategory.findOne({ where: { id: req.body.id } });
			res.json(category);
		} catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};

exports.updateCategory = async (req, res, next) => {
	// permission
	_permission = 5; // update
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const updates = {
				en_name: req.body.en_name,
				es_name: req.body.es_name,
				status: req.body.status
			};
			// Update the record
			numRowsAffected = await CommunityServiceCategory.update(updates, {
				where: {
					id: req.body.id // Update the record with the specified ID
				}
			})
			res.send('ok');
		} catch (error) {
			res.send(error.message);
		};
	} else {
		res.status(403).send("")
	}
};

exports.deleteCategory = async (req, res, next) => {
	// permission
	_permission = 5; // update
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			await CommunityServiceCategory.destroy({ where: { id: req.body.id } });

			const services = await CommunityService.findAll({ where: { category_id: req.body.id } });

			// Iterate over each service
			for (const service of services) {
				if (service.image !== 'default.jpg')
					await util_upload.deleteOldFile(service.image, './public/assets/images/community_service');
				// Delete the service
				await service.destroy();
			}

			res.send('ok');
		} catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};




exports.servicePage = async (req, res, next) => {
	// permission
	_permission = 2 * 3 * 5 * 7; // create && read && update && delete
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		const categories = await CommunityServiceCategory.findAll({ order: [['en_name', 'ASC']] });
		const clinics = await Clinic.findAll();
		res.render('community_service', { categories: categories, clinics: clinics });
	} else {
		res.render('403');
	}
};

exports.createService = async (req, res, next) => {
	// permission
	_permission = 2; // create
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const newRecord = CommunityService.build({
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
	} else {
		res.status(403).send("");
	}
};

exports.readServices = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const services = await CommunityService.findAll();
			res.json({ data: services });
		} catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};

exports.readOneService = async (req, res, next) => {
	// permission
	_permission = 3; // read
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const service = await CommunityService.findOne({ where: { id: req.body.id } });
			res.json(service);
		} catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};

exports.updateService = async (req, res, next) => {
	// permission
	_permission = 5; // write
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const updates = {
				category: req.body.category,
				clinic_allowance: req.body.clinic_allowance,
				en_name: req.body.en_name,
				es_name: req.body.es_name,

				address_1: req.body.address_1,
				address_2: req.body.address_2,
				city: req.body.city,
				state: req.body.state,
				zip: req.body.zip,
				country: req.body.country,
				phone: req.body.phone,
				email: req.body.email,
				fax: req.body.fax,
				link: req.body.link,

				en_desc: req.body.en_desc,
				es_desc: req.body.es_desc,
				en_detail: req.body.en_detail,
				es_detail: req.body.es_detail,
				additional: req.body.additional,
				status: req.body.status
			};
			// Update the record
			numRowsAffected = await CommunityService.update(updates, {
				where: {
					id: req.body.id // Update the record with the specified ID
				}
			});
			res.send('ok');
		}
		catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};

exports.deleteService = async (req, res, next) => {
	// permission
	_permission = 7; // delete
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const service = await CommunityService.findOne({ where: { id: req.body.id } });
			if (service.image !== 'default.jpg')
				await util_upload.deleteOldFile(service.image, './public/assets/images/community_service');
			await CommunityService.destroy({ where: { id: req.body.id } });
			res.send('ok');
		} catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
};


// // Usage example
exports.uploadServiceImage = async (req, res, next) => {
	// permission
	_permission = 7; // delete
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		const destination = './public/assets/images/community_service'; // Destination directory

		util_upload.uploadFile(req, destination, []).then(async (savedFileName) => {
			console.log('File uploaded successfully:', savedFileName);
			const service = await CommunityService.findOne({ where: { id: req.body.id } });
			if (service.image !== 'default.jpg')
				await util_upload.deleteOldFile(service.image, './public/assets/images/community_service')

			const updates = {
				image: savedFileName
			};
			// Update the record
			numRowsAffected = await CommunityService.update(updates, {
				where: {
					id: req.body.id // Update the record with the specified ID
				}
			});
			res.send('ok');
		}).catch(error => {
			res.send(error.message);
		});
	} else {
		res.status(403).send("")
	}
};

exports.updateClinic = async (req, res, next) => {
	// permission
	_permission = 5; // write
	const _status = await util_permission.checkPermission(req.session.user.role_id, permission_name[0], _permission);

	if (_status) {
		try {
			const updates = {
				clinic_allowance: req.body.clinic_allowance,
			};
			// Update the record
			numRowsAffected = await CommunityService.update(updates, {
				where: {
					id: req.body.id // Update the record with the specified ID
				}
			});
			res.send('ok');
		}
		catch (error) {
			res.send(error.message);
		}
	} else {
		res.status(403).send("")
	}
}
