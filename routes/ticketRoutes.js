const express = require('express')
const router = express.Router()
const TicketController = require('../app/controllers/TicketController')

router.get('/', TicketController.ticketPage)
router.post('/create', TicketController.createTicket);
router.post('/read', TicketController.readTicket);
router.post('/readById', TicketController.readTicketById);
router.post('/update', TicketController.updateTicket);
router.post('/delete', TicketController.deleteTicket);
router.post('/calc', TicketController.calculateCounts);

module.exports = router