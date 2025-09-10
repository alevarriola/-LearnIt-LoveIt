import { Router } from 'express';
import { TopicsController } from '../controllers/topicsController.js';

const router = Router();

// Home
router.get('/', TopicsController.index);

// CRUD Topics
router.post('/topics', TopicsController.createTopic);
router.post('/topics/:id/edit', TopicsController.updateTopic);
router.post('/topics/:id/delete', TopicsController.deleteTopic);

// CRUD Links
router.post('/links', TopicsController.createLink);
router.post('/links/:id/edit', TopicsController.updateLink);
router.post('/links/:id/delete', TopicsController.deleteLink);

export default router;
