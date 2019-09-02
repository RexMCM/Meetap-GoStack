import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/userController';
import SessionController from './app/controllers/SessionController';
import fileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), fileController.store);
routes.post('/meetup', MeetupController.store);
routes.put('/meetup', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetup', MeetupController.delete);
export default routes;
