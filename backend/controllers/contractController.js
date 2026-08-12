const Contract = require('../models/Contract');
const { buildContractNumber } = require('../services/contractNumberService');

async function createContract(req, res) {
  try {
    const payload = req.body || {};
    if (!payload.projectId || !payload.customerName) {
      return res.status(400).json({ message: 'projectId and customerName required' });
    }
    const contract = await Contract.create({
      ...payload,
      contractNumber: payload.contractNumber || buildContractNumber(payload.projectId),
      status: payload.status || 'draft',
    });
    return res.status(201).json(contract);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Contract number already exists' });
    }
    return res.status(500).json({ message: 'Failed to create contract' });
  }
}

async function signContract(req, res) {
  try {
    const contract = await Contract.findOne({ contractNumber: req.params.contractNumber });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    contract.status = 'signed';
    contract.signedAt = new Date();
    await contract.save();
    return res.json(contract);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to sign contract' });
  }
}

module.exports = { createContract, signContract };
