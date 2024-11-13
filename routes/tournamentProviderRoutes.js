import express from 'express';
import { createTournamentProvider } from '../controllers/tournamentProviderController.js';

const router = express.Router();

router.post('/create-provider', createTournamentProvider);

export default router;
