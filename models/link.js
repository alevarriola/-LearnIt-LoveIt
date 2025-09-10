import db from '../db.js';

export const Link = {
  byTopic(topicId) {
    return db.prepare(`SELECT * FROM links WHERE topic_id = ? ORDER BY votes DESC, id DESC`).all(topicId);
  }
};