import Database from 'better-sqlite3';

const db = new Database('app.db');       // crea/abre el archivo SQLite local
db.pragma('journal_mode = WAL');         // modo recomendado para concurrencia

// Crear tablas si no existen
db.exec(`
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);
`);

// Seed (solo si está vacío)
const getCountTopics = db.prepare(`SELECT COUNT(*) as n FROM topics`).get().n;
if (getCountTopics === 0) {
  const insertTopic = db.prepare(`INSERT INTO topics (title, votes) VALUES (?, ?)`);
  const insertLink  = db.prepare(`INSERT INTO links (topic_id, title, url, votes) VALUES (?, ?, ?, ?)`);

  // Tema 1
  const info1 = insertTopic.run('Cómo programar como un ninja', 1);
  insertLink.run(info1.lastInsertRowid, 'Node docs', 'https://nodejs.org/en/docs', 1);

  // Tema 2
  const info2 = insertTopic.run('Dominar el arte de preparar café', 3);
  insertLink.run(info2.lastInsertRowid, 'Juan Valdez', 'https://juanvaldez.com/', 2);
  insertLink.run(info2.lastInsertRowid, 'Cafe Martinez', 'https://www.cafemartinez.com/', 1);

  console.log('Seed inicial insertado');
}

export default db;
