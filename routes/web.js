const express = require('express');
const router = express.Router();

const AuthController = require('../app/controllers/AuthController');
const SurveyController = require('../app/controllers/SurveyController');

const isAuth = require('../app/middlewares/isAuth');

const dashboardRoutes = require('./dashboardRoutes');
const communityServiceRoutes = require('./communityServiceRoutes');
const patientServiceRoutes = require('./patientServiceRoutes');
const clinicRoutes = require('./clinicRoutes');
const educationRoutes = require('./educationRoutes');
const insuranceRoutes = require('./insuranceRoutes');
const clinicInsuranceRoutes = require('./clinicInsuranceRoutes');
const paymentsRoutes = require('./paymentsRoutes');
const surveyRoutes = require('./surveyRoutes');
const agreementRoutes = require('./agreementRoutes');
const userRoutes = require('./userRoutes');
const ticketRoutes = require('./ticketRoutes');

const languageRoutes = require('./languageRoutes');

const settingsRoutes = require('./settingRoutes');

const educationCategoryRoutes = require('./settings/educationCategoryRoutes');
const pqsettingRoutes = require('./settings/pqsettingRoutes');
const surveySettingRoutes = require('./settings/surveyRoutes');
const security_questionRoutes = require('./settings/securityquestionRoutes');
const generalRoutes = require("./settings/generalRoutes");
const roleRoutes = require('./settings/roleRoutes');
const permissionRoutes = require('./settings/permissionRoutes');

const apiRoutes = require('./apiRoutes');

router.get('/login', AuthController.loginPage);
router.post('/login', AuthController.login);

router.get('/security', AuthController.securityPage);
router.post('/security', AuthController.security);

router.get('/logout', AuthController.logout);

router.get('/', (req, res, next) => {
    res.redirect('/dashboard');
});
router.use('/dashboard', isAuth, dashboardRoutes);
router.use('/community_service', isAuth, communityServiceRoutes);
router.use('/patient_service', isAuth, patientServiceRoutes);
router.use('/clinic', isAuth, clinicRoutes);
router.use('/education', isAuth, educationRoutes);
router.use('/insurance', isAuth, insuranceRoutes);
router.use('/clinic_insurance', isAuth, clinicInsuranceRoutes);
router.use('/payments', isAuth, paymentsRoutes);
router.use('/survey', isAuth, surveyRoutes);
router.use('/agreement', isAuth, agreementRoutes);
router.use('/user', isAuth, userRoutes);
router.use('/ticket', isAuth, ticketRoutes);

router.use('/language', languageRoutes);

router.use('/settings', isAuth, settingsRoutes);

router.use('/setting/edu_cate', isAuth, educationCategoryRoutes);
router.use('/setting/pqsetting', isAuth, pqsettingRoutes);
router.use('/setting/survey', isAuth, surveySettingRoutes);
router.use('/setting/squestion', isAuth, security_questionRoutes);
router.use('/setting/general', isAuth, generalRoutes);
router.use('/setting/role', isAuth, roleRoutes);
router.use('/setting/permission', isAuth, permissionRoutes);

router.use('/api', apiRoutes);

router.get('/feedback', SurveyController.feedback);
router.post('/feedback/submit', SurveyController.addSurveyFeedback);

module.exports = router;