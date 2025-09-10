import express from 'express';

const app = express();

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor listo: http://localhost:${PORT}`);
});
