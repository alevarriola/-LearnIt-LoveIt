import db from '../db.js';

export const Link = {
  byTopic(topicId) {
    return db.prepare(`SELECT * FROM links WHERE topic_id = ? ORDER BY votes DESC, id DESC`).all(topicId);
  },

  create({ topic_id, title, url }) {
    const info = db.prepare(
      `INSERT INTO links (topic_id, title, url) VALUES (?, ?, ?)`
    ).run(topic_id, title, url);
    return db.prepare(`SELECT * FROM links WHERE id = ?`).get(info.lastInsertRowid);
  },

  update({ id, title, url }) {
    db.prepare(`UPDATE links SET title = ?, url = ? WHERE id = ?`).run(title, url, id);
    return db.prepare(`SELECT * FROM links WHERE id = ?`).get(id);
  },

  remove(id) {
    db.prepare(`DELETE FROM links WHERE id = ?`).run(id);
  },

  vote(id, delta) {
  db.prepare(`UPDATE links SET votes = votes + ? WHERE id = ?`).run(delta, id);
  return db.prepare(`SELECT * FROM links WHERE id = ?`).get(id);
  }
};
