import db from '../db.js';

export const Topic = {
  allWithLinksSorted() {
    const topics = db.prepare(`SELECT * FROM topics ORDER BY votes DESC, id DESC`).all();
    const linksStmt = db.prepare(`SELECT * FROM links WHERE topic_id = ? ORDER BY votes DESC, id DESC`);
    return topics.map(t => ({ ...t, links: linksStmt.all(t.id) }));
  }
};
