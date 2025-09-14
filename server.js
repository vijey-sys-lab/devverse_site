const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helpers to read/write simple JSON files (synchronous for brevity)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// Initialize files if missing
const usersFile = path.join(DATA_DIR, 'users.json');
const coursesFile = path.join(DATA_DIR, 'courses.json');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));
if (!fs.existsSync(coursesFile)) {
  const sampleCourses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      short: "HTML, CSS, JS, Node, Express, DBs",
      level: "Beginner → Advanced",
      price: "Free/Paid"
    },
    {
      id: 2,
      title: "Frontend Mastery (React)",
      short: "React, Hooks, State, Routing",
      level: "Intermediate",
      price: "Paid"
    }
  ];
  fs.writeFileSync(coursesFile, JSON.stringify(sampleCourses, null, 2));
}

// API: get courses
app.get('/api/courses', (req, res) => {
  try {
    const data = fs.readFileSync(coursesFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'Unable to read courses' });
  }
});

// API: register user
app.post('/api/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone: phone || '',
      createdAt: new Date().toISOString()
      // NOTE: In production, never store plaintext passwords — hash them!
    };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.json({ success: true, user: newUser });
  } catch (e) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Fallback to index.html for SPA/paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Devverse server running on port ${PORT}`);
});
