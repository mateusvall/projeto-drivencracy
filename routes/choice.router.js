import { Router } from 'express';
import { getChoice, postChoice } from '../controllers/choice.controller.js';

const choiceRouter = Router();

choiceRouter.post('/choice', postChoice);
choiceRouter.get('/poll/:id/choice', getChoice);

export default choiceRouter;