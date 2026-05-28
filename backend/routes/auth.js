const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { userId, password, role } = req.body;

  if (!userId || !password || !role) {
    return res.status(400).json({ message: 'User ID, Password and Role are required.' });
  }

  const users = loadUsers();
  const user = users.find(u => u.userId === userId && u.role === role);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials or role mismatch.' });
  }

  // For demo: compare with plain password (stored alongside hashed for convenience)
  if (password !== user.plainPassword) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  const token = jwt.sign(
    { id: user.id, userId: user.userId, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      joinDate: user.joinDate,
      status: user.status
    }
  });
});

// GET /api/auth/profile  (authenticated)
router.get('/profile', authMiddleware, (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { password, plainPassword, ...safeUser } = user;
  res.json(safeUser);
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { userId, password, name, email, role, department } = req.body;

  if (!userId || !password || !name || !email || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const users = loadUsers();
  if (users.find(u => u.userId === userId)) {
    return res.status(409).json({ message: 'User ID already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    userId,
    password: hashedPassword,
    plainPassword: password,
    name,
    email,
    role,
    department: department || 'Unassigned',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  const { password: _, plainPassword: __, ...safeUser } = newUser;
  res.status(201).json({ message: 'User registered successfully', user: safeUser });
});

module.exports = router;

