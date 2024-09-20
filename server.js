const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

// Supabase db connection
const pool = new Pool({
    user: 'postgres.ldevklncggkloyxmkvrz',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    database: 'postgres',
    password: '@Foxstep200202',
    port: 6543,
    ssl: { rejectUnauthorized: false }
});

// Supabase db connection test
pool.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos:', err.message)
    } else {
        console.log('¡Se ha conectado a la base de datos con éxito!')
    }
})

/// Endpoints for artists
app.get('/artistas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Artists')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

app.get('/artistas/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM Artists WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Artista no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/artistas', async (req, res) => {
  const { name, bio, email } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO Artists (name, bio, email) VALUES ($1, $2, $3) RETURNING *',
      [name, bio, email]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/artistas/:id', async (req, res) => {
  const { id } = req.params
  const { name, bio, email } = req.body
  try {
    const result = await pool.query(
      'UPDATE Artists SET name = $1, bio = $2, email = $3 WHERE id = $4 RETURNING *',
      [name, bio, email, id]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Artista no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/artistas/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM Artists WHERE id = $1 RETURNING *', [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Artista no encontrado' })
    }
    res.json({ message: 'Artista eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/// Endpoints for categories
app.get('/categoria', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/categoria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/categoria', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO Categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/categoria/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  try {
    const result = await pool.query(
      'UPDATE Categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/categoria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Categories WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000')
})