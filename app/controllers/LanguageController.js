
const Language = require('../models/Language');

exports.read = async (req, res, next) => {
    try {
        const languages = await Language.findAll();
        res.json({ data: languages });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOneById = async (req, res, next) => {
    try {
        const languages = await Language.findAll({ where: { id: req.body.id } });
        res.json({ data: languages });
    } catch (error) {
        res.send(error.message);
    }
};

exports.readOneByCode = async (req, res, next) => {
    try {
        const languages = await Language.findAll({ where: { code: req.body.code } });
        res.json({ data: languages });
    } catch (error) {
        res.send(error.message);
    }
};