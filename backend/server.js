// GET /contacts - Fetch all contacts with pagination
app.get('/contacts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
   
    const countStmt = db.prepare('SELECT COUNT(*) AS total FROM contacts');
    const countResult = countStmt.get();
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

   
    const stmt = db.prepare('SELECT * FROM contacts LIMIT ? OFFSET ?');
    const rows = stmt.all(limit, offset);

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

  try {
    const stmt = db.prepare('INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, phone);
    
    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      phone
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/contacts/:id', (req, res) => {
  const id = req.params.id;
  
  try {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});