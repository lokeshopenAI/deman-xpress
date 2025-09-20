require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 10000;


app.use(cors());
app.use(express.json());

app.get('/contacts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  
  db.get('SELECT COUNT(*) AS total FROM contacts', (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    
    db.all('SELECT * FROM contacts LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        contacts: rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalContacts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    });
  });
});

app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone must be 10 digits' });
  }

  const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
  const params = [name, email, phone];
  
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      name,
      email,
      phone
    });
  });
});

app.delete('/contacts/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM contacts WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
