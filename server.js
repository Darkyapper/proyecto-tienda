const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    user: 'postgres.ldevklncggkloyxmkvrz',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    database: 'postgres',
    password: '@Foxstep200202',
    port: 6543,
    ssl: { rejectUnauthorized: false }
});

pool.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos:', err.message)
    } else {
        console.log('¡Conexión exitosa a la base de datos de Supabase!')
    }
})

app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000')
})