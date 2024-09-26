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

app.get('/artworks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Artworks');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/artworks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Artworks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Obra de arte no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/artworks', async (req, res) => {
  const { title, description, price, artist_id, category_id, image_url } = req.body;

  // Verificar que los campos requeridos existan
  if (!title || !price || !artist_id || !category_id) {
    return res.status(400).json({ error: 'Title, price, artist_id y category_id son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO Artworks (title, description, price, artist_id, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, price, artist_id, category_id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/artworks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price, artist_id, category_id, image_url } = req.body;

  if (!title || !price || !artist_id || !category_id) {
    return res.status(400).json({ error: 'Title, price, artist_id y category_id son requeridos' });
  }

  try {
    const result = await pool.query(
      'UPDATE Artworks SET title = $1, description = $2, price = $3, artist_id = $4, category_id = $5, image_url = $6 WHERE id = $7 RETURNING *',
      [title, description, price, artist_id, category_id, image_url, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Obra de arte no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/artworks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Artworks WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Obra de arte no encontrada' });
    }
    res.json({ message: 'Obra de arte eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/usuario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Customers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Customers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/usuario', async (req, res) => {
  const { name, email, address, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'El nombre y el email son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO Customers (name, email, address, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'El nombre y el email son requeridos' });
  }

  try {
    const result = await pool.query(
      'UPDATE Customers SET name = $1, email = $2, address = $3, phone = $4 WHERE id = $5 RETURNING *',
      [name, email, address, phone, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Customers WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/pedido', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/pedido/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Orders WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/pedido', async (req, res) => {
  const { customer_id, status } = req.body;

  if (!customer_id || !status) {
    return res.status(400).json({ error: 'Customer_id y status son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO Orders (customer_id, status) VALUES ($1, $2) RETURNING *',
      [customer_id, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/pedido/:id', async (req, res) => {
  const { id } = req.params;
  const { customer_id, status } = req.body;

  if (!customer_id || !status) {
    return res.status(400).json({ error: 'Customer_id y status son requeridos' });
  }

  try {
    const result = await pool.query(
      'UPDATE Orders SET customer_id = $1, status = $2 WHERE id = $3 RETURNING *',
      [customer_id, status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/pedido/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Orders WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json({ message: 'Orden eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/detallespedido', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM OrderItems');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/detallespedido/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM OrderItems WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Elemento de orden no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/detallespedido', async (req, res) => {
  const { order_id, artwork_id, quantity, price } = req.body;

  if (!order_id || !artwork_id || !quantity || !price) {
    return res.status(400).json({ error: 'Order_id, artwork_id, quantity y price son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO OrderItems (order_id, artwork_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, artwork_id, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/detallespedido/:id', async (req, res) => {
  const { id } = req.params;
  const { order_id, artwork_id, quantity, price } = req.body;

  if (!order_id || !artwork_id || !quantity || !price) {
    return res.status(400).json({ error: 'Order_id, artwork_id, quantity y price son requeridos' });
  }

  try {
    const result = await pool.query(
      'UPDATE OrderItems SET order_id = $1, artwork_id = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *',
      [order_id, artwork_id, quantity, price, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Elemento de orden no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/detallespedido/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM OrderItems WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Elemento de orden no encontrado' });
    }
    res.json({ message: 'Elemento de orden eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000')
})