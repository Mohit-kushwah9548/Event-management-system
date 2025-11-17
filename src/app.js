const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
// In development, disable helmet security headers to avoid CSP issues with inline scripts/styles
// In production, implement proper external CSS/JS files and strict CSP
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  // Development: minimal security, allow inline content
  app.use(helmet({ 
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false 
  }));
}

// Override CSP headers explicitly for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'");
    next();
  });
}

// Allow CORS from configured FRONTEND_URL or allow all in development when not set
const corsOptions = process.env.FRONTEND_URL ? { origin: process.env.FRONTEND_URL, credentials: true } : {};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date() 
  });
});

// Simple test endpoint frontend can use to verify connectivity
app.get('/api/foo', (req, res) => {
  res.json({ success: true, message: 'API reachable' });
});

// Serve frontend static files when available (useful for local dev)
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Serve index.html at root
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  // SPA fallback: for any GET that doesn't start with /api, serve index.html
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;