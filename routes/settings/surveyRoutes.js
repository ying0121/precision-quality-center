const express = require('express');
const router = express.Router()

const SurveyController = require('../../app/controllers/settings/SurveyController');

router.get('/', SurveyController.surveyPage);

// survey category
router.post('/addSurveyCategory', SurveyController.addSurveyCategory)
router.post('/readSurveyCategory', SurveyController.readSurveyCategory)
router.post('/readOneSurveyCategory', SurveyController.readOneSurveyCategory)
router.post('/updateSurveyCategory', SurveyController.updateSurveyCategory)
router.post('/deleteSurveyCategory', SurveyController.deleteSurveyCategory)

// survey types
router.post('/addSurveyTypes', SurveyController.addSurveyTypes)
router.post('/readSurveyTypes', SurveyController.readSurveyTypes)
router.post('/readOneSurveyTypes', SurveyController.readOneSurveyTypes)
router.post('/updateSurveyTypes', SurveyController.updateSurveyTypes)
router.post('/deleteSurveyTypes', SurveyController.deleteSurveyTypes)

// survey question
router.post('/addSurveyQuestion', SurveyController.addSurveyQuestion)
router.post('/readSurveyQuestion', SurveyController.readSurveyQuestion)
router.post('/readOneSurveyQuestion', SurveyController.readOneSurveyQuestion)
router.post('/updateSurveyQuestion', SurveyController.updateSurveyQuestion)
router.post('/deleteSurveyQuestion', SurveyController.deleteSurveyQuestion)

// survey footer
router.post('/readSurveyFooter', SurveyController.readSurveyFooter)
router.post('/setSurveyFooter', SurveyController.updateSurveyFooter)

// survey response
router.post('/addSurveyResponse', SurveyController.addSurveyResponse)
router.post('/readSurveyResponse', SurveyController.readSurveyResponse)
router.post('/readOneSurveyResponse', SurveyController.readOneSurveyResponse)
router.post('/updateSurveyResponse', SurveyController.updateSurveyResponse)
router.post('/deleteSurveyResponse', SurveyController.deleteSurveyResponse)
router.post('/updateSurveyResponseItem', SurveyController.updateSurveyResponseItem)

// survey question type
router.post('/addSurveyQuestionType', SurveyController.addSurveyQuestionType)
router.post('/readSurveyQuestionType', SurveyController.readSurveyQuestionType)
router.post('/readOneSurveyQuestionType', SurveyController.readOneSurveyQuestionType)
router.post('/updateSurveyQuestionType', SurveyController.updateSurveyQuestionType)
router.post('/deleteSurveyQuestionType', SurveyController.deleteSurveyQuestionType)

// event status
router.post('/addEventStatus', SurveyController.addEventStatus)
router.post('/readEventStatus', SurveyController.readEventStatus)
router.post('/readOneEventStatus', SurveyController.readOneEventStatus)
router.post('/updateEventStatus', SurveyController.updateEventStatus)
router.post('/deleteEventStatus', SurveyController.deleteEventStatus)

module.exports = router;
