import express from 'express';
import { setUpDatabase } from '../controllers/setup.controller.js';

const router = express.Router();

router.post('/setup', setUpDatabase);

export default router;