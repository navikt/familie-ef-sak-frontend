import './konfigurerApp.js';
import express, { Router } from 'express';
import { setupBackend } from './server-felles';

const app = express();
const router = Router();

setupBackend(app, router);
