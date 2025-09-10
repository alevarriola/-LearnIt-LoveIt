import db from '../db.js';

export const Topic = {
  allWithLinksSorted() {
    const topics = db.prepare(`SELECT * FROM topics ORDER BY votes DESC, id DESC`).all();
    const linksStmt = db.prepare(`SELECT * FROM links WHERE topic_id = ? ORDER BY votes DESC, id DESC`);
    return topics.map(t => ({ ...t, links: linksStmt.all(t.id) }));
  },

  create({ title }) {
    const info = db.prepare(`INSERT INTO topics (title) VALUES (?)`).run(title);
    return db.prepare(`SELECT * FROM topics WHERE id = ?`).get(info.lastInsertRowid);
  },

  update({ id, title }) {
    db.prepare(`UPDATE topics SET title = ? WHERE id = ?`).run(title, id);
    return db.prepare(`SELECT * FROM topics WHERE id = ?`).get(id);
  },

  remove(id) {
    db.prepare(`DELETE FROM topics WHERE id = ?`).run(id);
  },

  vote(id, delta) {
  db.prepare(`UPDATE topics SET votes = votes + ? WHERE id = ?`).run(delta, id);
  return db.prepare(`SELECT * FROM topics WHERE id = ?`).get(id);
  }

};

