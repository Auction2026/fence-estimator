const express = require('express');
const { createContract, signContract } = require('../controllers/contractController');
const { routeLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/', routeLimiter, createContract);
router.patch('/:contractNumber/sign', routeLimiter, signContract);

module.exports = router;
