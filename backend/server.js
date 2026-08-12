/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Complete Backend Server - Express.js
 * Production-Ready Code
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Also serve the frontend/ directory for local development
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fence-estimator';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// ============================================
// DATABASE SCHEMAS/MODELS
// ============================================

// User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['admin', 'estimator', 'crew'], 
    default: 'estimator'
  },
  company: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET || 'fence-estimator-secret-key',
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true,
    lowercase: true
  },
  customerPhone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  province: { 
    type: String, 
    required: true 
  },
  postalCode: { 
    type: String, 
    required: true 
  },
  propertySize: { 
    type: String 
  },
  projectNotes: { 
    type: String 
  },
  photos: [{ 
    type: String 
  }],
  estimator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  status: { 
    type: String, 
    enum: ['draft', 'estimate', 'contract', 'active', 'completed'], 
    default: 'draft' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Project = mongoose.model('Project', projectSchema);

// Fence Specifications Schema
const fenceSpecsSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  fenceType: { 
    type: String, 
    enum: ['Chain Link', 'Wood', 'Vinyl', 'Wrought Iron', 'Composite', 'Metal', 'PVC', 'Aluminum'], 
    required: true 
  },
  height: { 
    type: Number, 
    required: true 
  },
  color: { 
    type: String 
  },
  postGauge: { 
    type: Number 
  },
  postDiameter: { 
    type: Number 
  },
  gateType: { 
    type: String, 
    enum: ['Swing', 'Sliding', 'Double Swing', 'Cantilever', 'Barrier', 'None'],
    default: 'None'
  },
  barchedWire: { 
    type: Boolean, 
    default: false 
  },
  installationType: { 
    type: String, 
    enum: ['Residential', 'Commercial', 'Industrial', 'Specialty'],
    default: 'Residential'
  },
  linearFeet: { 
    type: Number, 
    required: true 
  },
  numberPosts: { 
    type: Number, 
    required: true 
  },
  numberGates: { 
    type: Number, 
    default: 0 
  },
  specialRequirements: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const FenceSpecs = mongoose.model('FenceSpecs', fenceSpecsSchema);

// Estimate Schema
const estimateSchema = new mongoose.Schema({
  estimateNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  customerName: { 
    type: String, 
    required: true 
  },
  fenceType: { 
    type: String, 
    required: true 
  },
  linearFeet: { 
    type: Number, 
    required: true 
  },
  height: { 
    type: Number 
  },
  materialCost: { 
    type: Number, 
    required: true 
  },
  laborHours: { 
    type: Number, 
    required: true 
  },
  laborRate: { 
    type: Number,
    default: 50
  },
  laborCost: { 
    type: Number, 
    required: true 
  },
  equipmentCost: { 
    type: Number, 
    required: true 
  },
  permitCost: { 
    type: Number, 
    default: 0 
  },
  utilityCost: { 
    type: Number, 
    default: 0 
  },
  contingency: { 
    type: Number, 
    default: 0 
  },
  subtotal: { 
    type: Number, 
    required: true 
  },
  tax: { 
    type: Number, 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  notes: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'rejected'], 
    default: 'draft' 
  },
  validUntil: { 
    type: Date 
  },
  estimator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Estimate = mongoose.model('Estimate', estimateSchema);

// Contract Schema
const contractSchema = new mongoose.Schema({
  contractNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  estimateNumber: { 
    type: String, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  customerName: { 
    type: String, 
    required: true 
  },
  scopeOfWork: { 
    type: String, 
    required: true 
  },
  materials: { 
    type: String, 
    required: true 
  },
  labor: { 
    type: String, 
    required: true 
  },
  timeline: { 
    type: String 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  priceLocked: { 
    type: Boolean, 
    default: true 
  },
  depositAmount: { 
    type: Number 
  },
  depositPaid: { 
    type: Boolean, 
    default: false 
  },
  finalBalance: { 
    type: Number 
  },
  warranty: { 
    type: String 
  },
  terms: { 
    type: String 
  },
  customerSignature: { 
    type: String 
  },
  customerSignDate: { 
    type: Date 
  },
  companySignature: { 
    type: String 
  },
  companySignDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'signed', 'active', 'completed'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Contract = mongoose.model('Contract', contractSchema);

// Change Order Schema
const changeOrderSchema = new mongoose.Schema({
  changeOrderNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  contractNumber: { 
    type: String, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  description: { 
    type: String, 
    required: true 
  },
  reason: { 
    type: String 
  },
  materialCostChange: { 
    type: Number, 
    default: 0 
  },
  laborCostChange: { 
    type: Number, 
    default: 0 
  },
  timelineChange: { 
    type: String 
  },
  newTotal: { 
    type: Number, 
    required: true 
  },
  customerApproval: { 
    type: Boolean, 
    default: false 
  },
  customerSignature: { 
    type: String 
  },
  approvalDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

const ChangeOrder = mongoose.model('ChangeOrder', changeOrderSchema);

// Sign-Off Schema
const signOffSchema = new mongoose.Schema({
  signOffNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  contractNumber: { 
    type: String, 
    required: true 
  },
  completionDate: { 
    type: Date, 
    default: Date.now 
  },
  fenceInspectionPassed: { 
    type: Boolean, 
    required: true 
  },
  customerWalkthrough: { 
    type: Boolean, 
    required: true 
  },
  warrantyExplained: { 
    type: Boolean, 
    required: true 
  },
  photos: { 
    type: [String] 
  },
  outstandingItems: { 
    type: String 
  },
  followUpNeeded: { 
    type: Boolean, 
    default: false 
  },
  warrantyStartDate: { 
    type: Date 
  },
  nextMaintenanceDate: { 
    type: Date 
  },
  customerSignature: { 
    type: String 
  },
  customerSignDate: { 
    type: Date 
  },
  companyRep: { 
    type: String, 
    required: true 
  },
  companyRepSignature: { 
    type: String 
  },
  companyRepSignDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'signed', 'completed'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

const SignOff = mongoose.model('SignOff', signOffSchema);

// Notes Schema (Central Hub)
const notesSchema = new mongoose.Schema({
  noteId: { 
    type: String, 
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Site Conditions', 'Materials', 'Labor', 'Warranty', 'Safety', 'Other'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  usageCount: { 
    type: Number, 
    default: 0 
  },
  lastUsed: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Notes = mongoose.model('Notes', notesSchema);

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authorization denied. Please login first.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fence-estimator-secret-key');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Token is not valid or has expired'
    });
  }
};

// Role-based authorization
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to access this resource'
      });
    }
    next();
  };
};

// ============================================
// CALCULATION ENGINE
// ============================================

class CalculationEngine {
  
  // Material Cost Calculation
  static calculateMaterialCost(fenceType, linearFeet, height, barchedWire) {
    const baseCosts = {
      'Chain Link': { base: 8, perFoot: 2 },
      'Wood': { base: 15, perFoot: 3.5 },
      'Vinyl': { base: 12, perFoot: 4 },
      'Wrought Iron': { base: 20, perFoot: 5 },
      'Composite': { base: 18, perFoot: 4.5 },
      'Metal': { base: 14, perFoot: 3 },
      'PVC': { base: 11, perFoot: 3.8 },
      'Aluminum': { base: 13, perFoot: 3.2 }
    };

    const fence = baseCosts[fenceType] || baseCosts['Chain Link'];
    let cost = fence.base + (linearFeet * fence.perFoot);
    
    // Height adjustment (per inch from 48" standard)
    const heightMultiplier = height / 48;
    cost *= heightMultiplier;
    
    // Barbed wire additional cost
    if (barchedWire) {
      cost += linearFeet * 0.50;
    }
    
    return Math.round(cost * 100) / 100;
  }

  // Labor Cost Calculation
  static calculateLaborCost(linearFeet, fenceType, installationType, laborRate = 50) {
    
    const baseHoursPerFoot = {
      'Chain Link': 0.015,
      'Wood': 0.020,
      'Vinyl': 0.018,
      'Wrought Iron': 0.025,
      'Composite': 0.022,
      'Metal': 0.016,
      'PVC': 0.017,
      'Aluminum': 0.016
    };

    const hoursPerFoot = baseHoursPerFoot[fenceType] || 0.015;
    let hours = linearFeet * hoursPerFoot;

    // Installation type multiplier
    const multipliers = {
      'Residential': 1.0,
      'Commercial': 1.2,
      'Industrial': 1.5,
      'Specialty': 1.8
    };

    const multiplier = multipliers[installationType] || 1.0;
    hours *= multiplier;

    const laborCost = hours * laborRate;
    
    return {
      hours: Math.round(hours * 100) / 100,
      cost: Math.round(laborCost * 100) / 100
    };
  }

  // Equipment Cost Calculation
  static calculateEquipmentCost(linearFeet, numberPosts) {
    const equipmentDailyRate = linearFeet > 500 ? 250 : 150;
    const estimatedDays = Math.ceil(linearFeet / 200);
    return Math.round(equipmentDailyRate * estimatedDays);
  }

  // Total Calculation
  static calculateTotal(estimateData) {
    const subtotal = estimateData.materialCost + estimateData.laborCost + 
                     estimateData.equipmentCost + (estimateData.permitCost || 0) + 
                     (estimateData.utilityCost || 0) + (estimateData.contingency || 0);
    
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }
}

// ============================================
// API ROUTES - AUTHENTICATION
// ============================================

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role, company, phone } = req.body;

    if (!username || !email || !password || !company) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide username, email, password, and company'
      });
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ 
        error: 'User Already Exists',
        message: 'Email or username is already in use'
      });
    }

    user = new User({
      username,
      email,
      password,
      role: role || 'estimator',
      company,
      phone
    });

    await user.save();
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      });
    }

    const token = user.generateToken();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// Get Current User
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// API ROUTES - PROJECTS (TAB 1)
// ============================================

app.post('/api/projects', auth, async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, address, city, province, postalCode, propertySize, projectNotes } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !address || !city || !province || !postalCode) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide all required project information'
      });
    }

    const projectId = `PRJ-${Date.now()}`;
    const project = new Project({
      projectId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      province,
      postalCode,
      propertySize,
      projectNotes,
      estimator: req.userId
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ estimator: req.userId })
      .populate('estimator', 'username email company')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/projects/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId })
      .populate('estimator', 'username email company');

    if (!project) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.put('/api/projects/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { projectId: req.params.projectId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// API ROUTES - ESTIMATES (TAB 8)
// ============================================

app.post('/api/estimates', auth, async (req, res) => {
  try {
    const { projectId, customerName, fenceType, linearFeet, height, barchedWire, installationType, laborRate, permitCost, utilityCost, contingency, notes } = req.body;

    if (!projectId || !customerName || !fenceType || !linearFeet) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide all required estimate information'
      });
    }

    const materialCost = CalculationEngine.calculateMaterialCost(fenceType, linearFeet, height || 48, barchedWire);
    const laborData = CalculationEngine.calculateLaborCost(linearFeet, fenceType, installationType, laborRate || 50);
    const equipmentCost = CalculationEngine.calculateEquipmentCost(linearFeet, 50);

    const estimateNumber = `EST-${Date.now()}`;

    const estimateData = {
      estimateNumber,
      projectId,
      customerName,
      fenceType,
      linearFeet,
      height: height || 48,
      materialCost,
      laborHours: laborData.hours,
      laborRate: laborRate || 50,
      laborCost: laborData.cost,
      equipmentCost,
      permitCost: permitCost || 0,
      utilityCost: utilityCost || 0,
      contingency: contingency || 0,
      notes: notes || '',
      estimator: req.userId
    };

    const totals = CalculationEngine.calculateTotal(estimateData);
    estimateData.subtotal = totals.subtotal;
    estimateData.tax = totals.tax;
    estimateData.total = totals.total;

    const estimate = new Estimate(estimateData);
    await estimate.save();

    await Project.findOneAndUpdate({ projectId }, { status: 'estimate' });

    res.status(201).json({
      success: true,
      message: 'Estimate created successfully',
      estimate,
      breakdown: {
        materials: materialCost,
        labor: laborData.cost,
        equipment: equipmentCost,
        permits: estimateData.permitCost,
        utilities: estimateData.utilityCost,
        contingency: estimateData.contingency,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/estimates/:projectId', auth, async (req, res) => {
  try {
    const estimates = await Estimate.find({ projectId: req.params.projectId })
      .populate('estimator', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: estimates.length,
      estimates
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// API ROUTES - CONTRACTS (TAB 9)
// ============================================

app.post('/api/contracts', auth, async (req, res) => {
  try {
    const { estimateNumber, projectId, customerName, scopeOfWork, depositAmount, warranty, terms } = req.body;

    if (!estimateNumber || !projectId || !customerName) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide all required contract information'
      });
    }

    const estimate = await Estimate.findOne({ estimateNumber });
    if (!estimate) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Estimate not found'
      });
    }

    const contractNumber = `CON-${Date.now()}`;
    const contract = new Contract({
      contractNumber,
      estimateNumber,
      projectId,
      customerName,
      scopeOfWork: scopeOfWork || 'Installation of fence as per specifications',
      materials: `Fence Type: ${estimate.fenceType}, Linear Feet: ${estimate.linearFeet}`,
      labor: `Estimated Labor Hours: ${estimate.laborHours}`,
      timeline: '2-4 weeks',
      totalPrice: estimate.total,
      priceLocked: true,
      depositAmount: depositAmount || Math.round(estimate.total * 0.25 * 100) / 100,
      warranty: warranty || '2 years on materials, 1 year on labor',
      terms: terms || 'Deposit due upon signing. Balance due upon completion.'
    });

    await contract.save();
    await Project.findOneAndUpdate({ projectId }, { status: 'contract' });

    res.status(201).json({
      success: true,
      message: '🔒 Contract created successfully. PRICING IS NOW LOCKED!',
      contract,
      warning: 'The price in this contract is LOCKED and cannot be changed without a Change Order'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/contracts/:projectId', auth, async (req, res) => {
  try {
    const contracts = await Contract.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contracts.length,
      contracts
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error(`Error: ${err.stack}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║ FENCE DEPOT FENCE ESTIMATOR - RUNNING  ║`);
      console.log(`║ Server: http://localhost:${PORT}`);
      console.log(`║ API: http://localhost:${PORT}/api`);
      console.log(`╚════════════════════════════════════════╝\n`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;