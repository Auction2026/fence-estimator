/**
 * FENCE DEPOT ESTIMATOR - Project Controller
 * backend/controllers/projectController.js
 */

'use strict';

const bcrypt  = require('bcryptjs');
const authMW  = require('../middleware/auth');

// In-memory fallback store when MongoDB is unavailable
// In production this is replaced by Mongoose models from server.js
const STORE = {
  users:    [],
  projects: [],
  products: require('./catalogData').PRODUCTS || [],
};

function makeId() {
  return 'PRJ-' + Date.now().toString(36).toUpperCase();
}

// ============================================================
// AUTH CONTROLLERS
// ============================================================
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Try Mongoose User model if available
    let user = null;
    if (global.UserModel) {
      user = await global.UserModel.findOne({ $or: [{ username }, { email: username }] });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } else {
      // In-memory fallback
      user = STORE.users.find(function (u) { return u.username === username || u.email === username; });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = authMW.generateToken(user._id || user.id, user.role);
    res.json({
      success: true,
      token,
      user: { id: user._id || user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function register(req, res) {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, and password required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const hash = await bcrypt.hash(password, 12);

    if (global.UserModel) {
      const exists = await global.UserModel.findOne({ $or: [{ username }, { email }] });
      if (exists) return res.status(409).json({ success: false, message: 'Username or email already registered' });
      const newUser = await global.UserModel.create({ username, email, password: hash, firstName, lastName });
      const token = authMW.generateToken(newUser._id, newUser.role);
      return res.status(201).json({ success: true, token, user: { id: newUser._id, username, email } });
    }

    // In-memory fallback
    if (STORE.users.find(function (u) { return u.username === username || u.email === email; })) {
      return res.status(409).json({ success: false, message: 'Username or email already registered' });
    }
    const id = Date.now();
    STORE.users.push({ id, username, email, password: hash, role: 'estimator', firstName, lastName });
    const token = authMW.generateToken(id, 'estimator');
    res.status(201).json({ success: true, token, user: { id, username, email, role: 'estimator' } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

function logout(req, res) {
  res.json({ success: true, message: 'Logged out' });
}

// ============================================================
// PROJECT CONTROLLERS
// ============================================================
async function getProjects(req, res) {
  try {
    if (global.ProjectModel) {
      const projects = await global.ProjectModel.find({ createdBy: req.user.id }).sort({ updatedAt: -1 }).limit(100);
      return res.json({ success: true, projects });
    }
    const projects = STORE.projects.filter(function (p) { return !p.userId || p.userId === req.user.id; });
    res.json({ success: true, projects: projects.slice(0, 100) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getProject(req, res) {
  try {
    const id = req.params.id;
    if (global.ProjectModel) {
      const project = await global.ProjectModel.findById(id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.json({ success: true, project });
    }
    const project = STORE.projects.find(function (p) { return p.id === id; });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createProject(req, res) {
  try {
    const data = req.body;
    if (global.ProjectModel) {
      const project = await global.ProjectModel.create({ ...data, createdBy: req.user.id });
      return res.status(201).json({ success: true, project });
    }
    const project = { ...data, id: makeId(), userId: req.user.id, createdAt: new Date().toISOString() };
    STORE.projects.push(project);
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateProject(req, res) {
  try {
    const id = req.params.id;
    if (global.ProjectModel) {
      const project = await global.ProjectModel.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true });
      if (!project) return res.status(404).json({ success: false, message: 'Not found' });
      return res.json({ success: true, project });
    }
    const idx = STORE.projects.findIndex(function (p) { return p.id === id; });
    if (idx < 0) return res.status(404).json({ success: false, message: 'Not found' });
    STORE.projects[idx] = { ...STORE.projects[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, project: STORE.projects[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteProject(req, res) {
  try {
    const id = req.params.id;
    if (global.ProjectModel) {
      await global.ProjectModel.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Deleted' });
    }
    STORE.projects = STORE.projects.filter(function (p) { return p.id !== id; });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ============================================================
// ESTIMATE CONTROLLERS
// ============================================================
function calculateEstimate(req, res) {
  try {
    const specs = req.body;
    const linFt  = parseFloat(specs.linearFeet) || 0;
    const fType  = specs.fenceType || 'chain_link';
    const height = parseFloat(specs.height) || 4;
    const gates  = parseInt(specs.gates, 10) || 0;

    const matRates = { chain_link: 4.5, wood_privacy: 8, vinyl: 10, aluminum: 12, wrought_iron: 16, split_rail: 4, farm: 2.5 };
    const labRates = { chain_link: 8.5, wood_privacy: 14, vinyl: 16, aluminum: 18, wrought_iron: 22, split_rail: 9, farm: 6 };

    const MARKUP   = parseFloat(specs.markupPct)  / 100 || 0.30;
    const TAX_RATE = parseFloat(specs.taxRatePct) / 100 || 0.08;

    const postCt   = Math.ceil(linFt / 8) + 1;
    const matBase  = (matRates[fType] || 4.5) * linFt * (height / 4);
    const matPosts = postCt * 18;
    const matGates = gates * 85;
    const matHW    = linFt * 0.80;
    const matConc  = postCt * 4;
    const matSub   = matBase + matPosts + matGates + matHW + matConc;
    const matMarkup = matSub * MARKUP;
    const matTax   = (matSub + matMarkup) * TAX_RATE;

    const labInst  = linFt  * (labRates[fType] || 8.5);
    const labPosts = postCt * 45;
    const labGates = gates  * 120;
    const labClean = linFt  * 0.5;
    const labSub   = labInst + labPosts + labGates + labClean;

    const equipSub = Math.ceil(linFt / 200) * (150 + 80) + 150;

    const grandTotal = matSub + matMarkup + matTax + labSub + equipSub;

    res.json({
      success: true,
      estimate: {
        materials: { subtotal: r(matSub), markup: r(matMarkup), tax: r(matTax), total: r(matSub + matMarkup + matTax) },
        labor:     { subtotal: r(labSub) },
        equipment: { subtotal: r(equipSub) },
        grandTotal:    r(grandTotal),
        perLinearFoot: r(linFt > 0 ? grandTotal / linFt : 0),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function r(n) { return Math.round((n || 0) * 100) / 100; }

async function saveEstimate(req, res) {
  try {
    const { id } = req.params;
    if (global.ProjectModel) {
      await global.ProjectModel.findByIdAndUpdate(id, { estimate: req.body, updatedAt: new Date() });
    } else {
      const idx = STORE.projects.findIndex(function (p) { return p.id === id; });
      if (idx >= 0) STORE.projects[idx].estimate = req.body;
    }
    res.json({ success: true, message: 'Estimate saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getEstimate(req, res) {
  try {
    const { id } = req.params;
    let estimate = null;
    if (global.ProjectModel) {
      const project = await global.ProjectModel.findById(id);
      estimate = project && project.estimate;
    } else {
      const project = STORE.projects.find(function (p) { return p.id === id; });
      estimate = project && project.estimate;
    }
    res.json({ success: true, estimate: estimate || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ============================================================
// CONTRACT CONTROLLERS
// ============================================================
async function lockContract(req, res) {
  try {
    const { id } = req.params;
    const lockedAt = new Date().toISOString();
    if (global.ProjectModel) {
      await global.ProjectModel.findByIdAndUpdate(id, { 'contract.locked': true, 'contract.lockedAt': lockedAt });
    } else {
      const idx = STORE.projects.findIndex(function (p) { return p.id === id; });
      if (idx >= 0) {
        STORE.projects[idx].contract = STORE.projects[idx].contract || {};
        STORE.projects[idx].contract.locked   = true;
        STORE.projects[idx].contract.lockedAt = lockedAt;
      }
    }
    res.json({ success: true, message: 'Contract locked', lockedAt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function saveSignature(req, res) {
  try {
    const { id } = req.params;
    const { signature } = req.body;
    if (global.ProjectModel) {
      await global.ProjectModel.findByIdAndUpdate(id, { 'contract.signature': signature, 'contract.signedAt': new Date() });
    }
    res.json({ success: true, message: 'Signature saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ============================================================
// CHANGE ORDER CONTROLLERS
// ============================================================
async function getChangeOrders(req, res) {
  const { id } = req.params;
  try {
    const project = STORE.projects.find(function (p) { return p.id === id; });
    res.json({ success: true, changeOrders: (project && project.changeOrders) || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createChangeOrder(req, res) {
  const { id } = req.params;
  const co = { ...req.body, id: Date.now(), requestedAt: new Date().toISOString(), approved: false };
  const idx = STORE.projects.findIndex(function (p) { return p.id === id; });
  if (idx >= 0) {
    STORE.projects[idx].changeOrders = STORE.projects[idx].changeOrders || [];
    STORE.projects[idx].changeOrders.push(co);
  }
  res.status(201).json({ success: true, changeOrder: co });
}

async function updateChangeOrder(req, res) {
  res.json({ success: true, message: 'Change order updated' });
}

async function deleteChangeOrder(req, res) {
  res.json({ success: true, message: 'Change order deleted' });
}

// ============================================================
// PRODUCT CONTROLLERS
// ============================================================
function getProducts(req, res) {
  const { q, category } = req.query;
  let products = STORE.products;
  if (q)        products = products.filter(function (p) { return (p.name + p.sku + p.department).toLowerCase().includes(q.toLowerCase()); });
  if (category) products = products.filter(function (p) { return p.department === category; });
  res.json({ success: true, products: products.slice(0, 200), total: products.length });
}

function getProduct(req, res) {
  const product = STORE.products.find(function (p) { return p.id === req.params.id || p.sku === req.params.id; });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
}

// ============================================================
// PDF / EMAIL CONTROLLERS
// ============================================================
function generatePDF(req, res) {
  res.status(501).json({ success: false, message: 'PDF generation requires pdfkit setup. Use browser print for now.' });
}

function sendEmail(req, res) {
  res.status(501).json({ success: false, message: 'Email sending requires nodemailer configuration.' });
}

// ============================================================
// ADMIN CONTROLLERS
// ============================================================
function getAdminStats(req, res) {
  res.json({
    success: true,
    stats: {
      totalProjects: STORE.projects.length,
      totalUsers:    STORE.users.length,
      totalProducts: STORE.products.length,
      uptime:        process.uptime(),
      nodeVersion:   process.version,
    },
  });
}

function getUsers(req, res) {
  const users = STORE.users.map(function (u) {
    return { id: u.id, username: u.username, email: u.email, role: u.role };
  });
  res.json({ success: true, users });
}

module.exports = {
  login, register, logout,
  getProjects, getProject, createProject, updateProject, deleteProject,
  calculateEstimate, saveEstimate, getEstimate,
  lockContract, saveSignature,
  getChangeOrders, createChangeOrder, updateChangeOrder, deleteChangeOrder,
  getProducts, getProduct,
  generatePDF, sendEmail,
  getAdminStats, getUsers,
};
