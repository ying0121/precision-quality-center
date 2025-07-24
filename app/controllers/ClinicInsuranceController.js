
const ClinicInsurance = require('../models/ClinicInsurance');
const Clinic = require('../models/Clinic');
const Insurance = require('../models/Insurance');

exports.createClinicInsurance = async (req, res, next) => {
    try {
        const newRecord = ClinicInsurance.build({
            clinic_id: req.body.clinic_id,
            insurance_id: req.body.insurance_id,
            pt_portal_repid: req.body.pt_portal_repid,
            pcp_portal_repid: req.body.pcp_portal_repid,
            pt_eligib_repid: req.body.pt_eligib_repid,
            hedis_repid: req.body.hedis_repid,
            coverage_repid: req.body.coverage_repid
        });

        // Save the new record to the database
        await newRecord.save()
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};
exports.createByClinic = async (req, res, next) => {
    try {
        // delete already existed
        await ClinicInsurance.destroy({ where: { clinic_id: req.body.clinic_id } });

        const insurances = await Insurance.findAll({ attributes: ['id'] });
        let records = insurances.map(insurance => ({
            clinic_id: req.body.clinic_id,
            insurance_id: insurance.id,
        }))
        ClinicInsurance.bulkCreate(records);

        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};
exports.createByInsurance = async (req, res, next) => {
    try {
        // delete already existed
        await ClinicInsurance.destroy({ where: { insurance_id: req.body.insurance_id } });

        const clinics = await Clinic.findAll({ attributes: ['id'] });
        let records = clinics.map(clinic => ({
            insurance_id: req.body.insurance_id,
            clinic_id: clinic.id,
        }))
        ClinicInsurance.bulkCreate(records);

        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};

exports.readClinicsInsurance = async (req, res, next) => {
    try {
        const clinic_insurance = await ClinicInsurance.findAll();
        res.json({ data: clinic_insurance });
    } catch (error) {
        res.send(error.message);
    }
};
exports.readOneClinicInsurance = async (req, res, next) => {
    try {
        const clinic_insurance = await ClinicInsurance.findOne({ where: { id: req.body.id } });
        res.json(clinic_insurance);
    } catch (error) {
        res.send(error.message);
    }
};
exports.readInsuranceOfClinic = async (req, res, next) => {
    try {
        const clinic_insurance = await ClinicInsurance.findAll({ where: { clinic_id: req.body.clinic_id } });
        res.json(clinic_insurance);
    } catch (error) {
        res.send(error.message);
    }
};
exports.readClinicOfInsurance = async (req, res, next) => {
    try {
        const clinic_insurance = await ClinicInsurance.findAll({ where: { insurance_id: req.body.insurance_id } });
        res.json(clinic_insurance);
    } catch (error) {
        res.send(error.message);
    }
};

exports.updateClinicInsurance = async (req, res, next) => {
    try {
        const updates = {
            clinic_id: req.body.clinic_id,
            insurance_id: req.body.insurance_id,
            pt_portal_repid: req.body.pt_portal_repid,
            pcp_portal_repid: req.body.pcp_portal_repid,
            pt_eligib_repid: req.body.pt_eligib_repid,
            hedis_repid: req.body.hedis_repid,
            coverage_repid: req.body.coverage_repid
        };
        // Update the record
        numRowsAffected = await ClinicInsurance.update(updates, {
            where: {
                id: req.body.id // Update the record with the specified ID
            }
        })
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    };
};

exports.deleteClinicInsurance = async (req, res, next) => {
    try {
        await ClinicInsurance.destroy({ where: { id: req.body.id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
};
exports.deleteByInsuranceAndClinic = async (req, res, next) => {
    try {
        await ClinicInsurance.destroy({ where: { clinic_id: req.body.clinic_id, insurance_id: req.body.insurance_id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}
exports.deleteByClinic = async (req, res, next) => {
    try {
        await ClinicInsurance.destroy({ where: { clinic_id: req.body.clinic_id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}
exports.deleteByInsurance = async (req, res, next) => {
    try {
        await ClinicInsurance.destroy({ where: { insurance_id: req.body.insurance_id } });
        res.send('ok');
    } catch (error) {
        res.send(error.message);
    }
}
