import rootRoutes from './root.js';
import userRoutes from './users.js';
import adminRoutes from './admin.js';
import gymRoutes from './gymDetails.js';
import classRoutes from './classes.js';
import reviewRoutes from './reviews.js';
import appointmentRoutes from './appointments.js';
import gymreviewsRoutes from './gymreviews.js'
import { loggingMiddleware } from '../middleware.js';
import classandeventRoutes from './classandevent.js';
const constructorMethod = (app) => {
  app.use(loggingMiddleware);
  app.use('/',rootRoutes);
  app.use('/user', userRoutes);
  app.use('/admin', adminRoutes);
  app.use('/gym', gymRoutes);
  app.use('/reviews', reviewRoutes);
  app.use('/myAppointments', appointmentRoutes);
  app.use('/class',classRoutes);
  app.use('/classandevent', classandeventRoutes);
  app.use('/allreviews', gymreviewsRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({ error: '404 Error: Not found' });
  });
};

export default constructorMethod;