import express from 'express';
import path from 'path';

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

// Ruta temporal para probar la vista 
app.get('/', (req, res) => {
  // Datos "fake" para ver la estructura de la vista:
  const topics = [
    { id: 2, title: 'JavaScript', votes: 3, links: [
      { id: 21, title: 'MDN Array methods', url: 'https://developer.mozilla.org/', votes: 2 },
      { id: 22, title: 'You Don’t Know JS', url: 'https://github.com/getify/You-Dont-Know-JS', votes: 1 },
    ]},
    { id: 1, title: 'Node.js', votes: 1, links: [
      { id: 11, title: 'Node docs', url: 'https://nodejs.org/en/docs', votes: 1 },
    ]},
  ];
  res.render('index', { topics });  // <- Render de la vista
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor listo: http://localhost:${PORT}`);
});
