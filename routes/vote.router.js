import { Router } from 'express';
import { getResult, votePost } from '../controllers/vote.controller.js'; 

const voteRouter = Router();

voteRouter.post('/choice/:id/vote', votePost);
voteRouter.get('/poll/:id/result', getResult);

export default voteRouter;