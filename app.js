import express from 'express';
import path from 'path';
import './db.js';             
import router from './routes/index.js'; 

const app = express();

// View engine: EJS
const __dirname = process.cwd();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos (CSS/JS del front)
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares para formularios 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// todas las rutas
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor listo: http://localhost:${PORT}`);
});
