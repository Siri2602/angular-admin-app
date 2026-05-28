const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// GET /api/users — Admin only: list all users
router.get('/', authMiddleware, adminOnly, (req, res) => {
  const delay = parseInt(req.query.delay) || 0; // configurable delay in ms
  setTimeout(() => {
    const users = loadUsers().map(({ password, plainPassword, ...u }) => u);
    res.json(users);
  }, delay);
});

// PUT /api/users/:id — Admin only: update a user
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = parseInt(req.params.id);
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  const { name, email, role, department, status, password } = req.body;
  if (name) users[idx].name = name;
  if (email) users[idx].email = email;
  if (role) users[idx].role = role;
  if (department) users[idx].department = department;
  if (status) users[idx].status = status;
  if (password) {
    users[idx].password = await bcrypt.hash(password, 10);
    users[idx].plainPassword = password;
  }

  saveUsers(users);
  const { password: _, plainPassword: __, ...safeUser } = users[idx];
  res.json({ message: 'User updated', user: safeUser });
});

// DELETE /api/users/:id — Admin only: delete a user
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  let users = loadUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(idx, 1);
  saveUsers(users);
  res.json({ message: 'User deleted' });
});

module.exports = router;

