import { Topic } from '../models/topic.js';
import { Link } from '../models/link.js';

export const TopicsController = {
  // Home: listar todo
  index(req, res) {
    const topics = Topic.allWithLinksSorted();
    res.render('index', { topics });
  },

  // ---- TOPICS ----
  createTopic(req, res) {
    const { title } = req.body;
    if (!title || !title.trim()) return res.redirect('/');
    Topic.create({ title: title.trim() });
    res.redirect('/');
  },

  updateTopic(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    if (!title || !title.trim()) return res.redirect('/');
    Topic.update({ id: Number(id), title: title.trim() });
    res.redirect('/');
  },

  deleteTopic(req, res) {
    const { id } = req.params;
    Topic.remove(Number(id));
    res.redirect('/');
  },

  // ---- LINKS ----
  createLink(req, res) {
    const { topic_id, title, url } = req.body;
    if (!title?.trim() || !url?.trim()) return res.redirect('/');
    Link.create({ topic_id: Number(topic_id), title: title.trim(), url: url.trim() });
    res.redirect('/');
  },

  updateLink(req, res) {
    const { id } = req.params;
    const { title, url } = req.body;
    if (!title?.trim() || !url?.trim()) return res.redirect('/');
    Link.update({ id: Number(id), title: title.trim(), url: url.trim() });
    res.redirect('/');
  },

  deleteLink(req, res) {
    const { id } = req.params;
    Link.remove(Number(id));
    res.redirect('/');
  },

  // ---- VOTES ----
  voteTopic(req, res) {
    const { id } = req.params;
    const { dir } = req.query;         // "up" | "down"
    const delta = dir === 'down' ? -1 : 1;
    const updated = Topic.vote(Number(id), delta);
    res.json({ ok: true, topic: updated });
  },

  voteLink(req, res) {
    const { id } = req.params;
    const { dir } = req.query;         // "up" | "down"
    const delta = dir === 'down' ? -1 : 1;
    const updated = Link.vote(Number(id), delta);
    res.json({ ok: true, link: updated });
  }
};
