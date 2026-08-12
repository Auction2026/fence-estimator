const express = require('express');
const { createContract, signContract } = require('../controllers/contractController');

const router = express.Router();

router.post('/', createContract);
router.patch('/:contractNumber/sign', signContract);

module.exports = router;
