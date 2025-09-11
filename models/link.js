import db from '../db.js';

export const Link = {
  // devuele todo los datos ordenaros por votos y si empatan el mas nuevo primero
  byTopic(topicId) {
    return db.prepare(`SELECT * FROM links WHERE topic_id = ? ORDER BY votes DESC, id DESC`).all(topicId);
  },

  // crea un nuevo link, ? es para evitar inyecciones
  create({ topic_id, title, url }) {
    const info = db.prepare(
      `INSERT INTO links (topic_id, title, url) VALUES (?, ?, ?)`
    ).run(topic_id, title, url);
    return db.prepare(`SELECT * FROM links WHERE id = ?`).get(info.lastInsertRowid);
  },

  // actualiza los links y retorna los links actualizados
  update({ id, title, url }) {
    db.prepare(`UPDATE links SET title = ?, url = ? WHERE id = ?`).run(title, url, id);
    return db.prepare(`SELECT * FROM links WHERE id = ?`).get(id);
  },

  // elimina de la db y no retorna nada
  remove(id) {
    db.prepare(`DELETE FROM links WHERE id = ?`).run(id);
  },

  // modifica los links y los actualiza con los votos
  vote(id, delta) {
  db.prepare(`UPDATE links SET votes = votes + ? WHERE id = ?`).run(delta, id);
  return db.prepare(`SELECT * FROM links WHERE id = ?`).get(id);
  }
};
