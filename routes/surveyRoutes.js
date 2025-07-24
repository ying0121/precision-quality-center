const express = require('express');
const router = express.Router()
const SurveyController = require('../app/controllers/SurveyController');

// survey
router.get('/', SurveyController.surveyPage);

router.post('/add', SurveyController.add)
router.post('/read', SurveyController.read)
router.post('/readOne', SurveyController.readOne)
router.post('/update', SurveyController.update)
router.post('/delete', SurveyController.delete)

// survey preview
router.get('/survey_preview', SurveyController.survey_previewPage);

// survey view
router.get('/survey_view', SurveyController.survey_viewPage);
router.post('/readSurveyView', SurveyController.readSurveyView);
router.post('/saveSurveyView', SurveyController.saveSurveyView);

router.post('/survey_cateques', SurveyController.readSurveyCateAndQuestion);
router.post('/survey_resp', SurveyController.readSurveyResponse);

// survey feedback
router.post('/surveyFeedback', SurveyController.surveyFeedback);
router.post('/addSurveyFeedback', SurveyController.addSurveyFeedback);
router.post('/deleteSurveyFeedback', SurveyController.deleteSurveyFeedback);

router.post('/sendEmail', SurveyController.sendEmail);

module.exports = router;
