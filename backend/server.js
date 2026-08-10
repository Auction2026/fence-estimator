require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDatabase } = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const fenceSpecsRoutes = require('./routes/fenceSpecs');
const estimateRoutes = require('./routes/estimates');
const contractRoutes = require('./routes/contracts');
const changeOrderRoutes = require('./routes/changeorders');
const signOffRoutes = require('./routes/signoff');
const notesRoutes = require('./routes/notes');
const adminRoutes = require('./routes/admin');
const documentsRoutes = require('./routes/documents');

const app = express();
app.use(helmet());
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').filter(Boolean) : '*';
app.use(cors({ origin: corsOrigin.length ? corsOrigin : '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);        // Tab 1
app.use('/api/fence-specs', fenceSpecsRoutes);  // Tab 2
app.use('/api/estimates', estimateRoutes);      // Tab 8
app.use('/api/contracts', contractRoutes);      // Tab 9
app.use('/api/change-orders', changeOrderRoutes); // Tab 12
app.use('/api/signoff', signOffRoutes);         // Tab 13
app.use('/api/notes', notesRoutes);             // Tab 14
app.use('/api/admin', adminRoutes);             // Tab 15
app.use('/api/documents', documentsRoutes);

app.post('/api/layout', (req, res) => res.status(201).json({ tab: 3, saved: true, data: req.body }));
app.post('/api/installation', (req, res) => res.status(201).json({ tab: 4, saved: true, data: req.body }));
app.post('/api/shop-drawings', (req, res) => res.status(201).json({ tab: 5, saved: true, data: req.body }));
app.post('/api/permits', (req, res) => res.status(201).json({ tab: 6, saved: true, data: req.body }));
app.post('/api/utilities', (req, res) => res.status(201).json({ tab: 7, saved: true, data: req.body }));
app.post('/api/extras', (req, res) => res.status(201).json({ tab: 10, saved: true, data: req.body }));
app.post('/api/crew', (req, res) => res.status(201).json({ tab: 11, saved: true, data: req.body }));
app.get('/api/catalog', (req, res) => res.json({ tab: 16, items: [] }));
app.post('/api/mapping', (req, res) => res.status(201).json({ tab: 17, saved: true, data: req.body }));

app.use(errorHandler);

async function start() {
  const port = Number(process.env.PORT || 5000);
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  await connectDatabase(process.env.MONGODB_URI);
  app.listen(port, () => logger.info(`Server listening on ${port}`));
}

if (require.main === module) {
  start().catch((error) => {
    logger.error('Failed to start server', { message: error.message, stack: error.stack });
    process.exit(1);
  });
}

module.exports = app;
