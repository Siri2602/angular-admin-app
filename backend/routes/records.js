const express = require('express');
const fs = require('fs');
const path = require('path');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const RECORDS_FILE = path.join(__dirname, '..', 'data', 'records.json');

function loadRecords() {
  return JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf-8'));
}

// GET /api/records?delay=<ms>
// General Users see only "General User" level records
// Admins see all records
router.get('/', authMiddleware, (req, res) => {
  const delay = parseInt(req.query.delay) || 0; // configurable API delay

  console.log(`[Records API] Requested by: ${req.user.userId} (${req.user.role}) | delay=${delay}ms`);

  setTimeout(() => {
    let records = loadRecords();

    if (req.user.role !== 'Admin') {
      records = records.filter(r => r.accessLevel === 'General User');
    }

    res.json({
      totalRecords: records.length,
      userRole: req.user.role,
      delayApplied: delay,
      records
    });
  }, delay);
});

module.exports = router;

