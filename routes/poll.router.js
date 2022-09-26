import { Router } from 'express';
import { getPoll, postPoll } from '../controllers/poll.controller.js';

const pollRouter = Router();

pollRouter.post('/poll', postPoll);
pollRouter.get('/poll', getPoll);

export default pollRouter;