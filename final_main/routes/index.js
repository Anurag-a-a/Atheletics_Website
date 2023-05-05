
import userRoutes from './users.js';
import gymRoutes from './gymDetails.js';
import reviewRoutes from './reviews.js';
import appointmentRoutes from './appointments.js';
import { loggingMiddleware } from '../middleware.js';
const constructorMethod = (app) => {
    app.use(loggingMiddleware);
    app.use('/', userRoutes);
    app.use('/amenities', userRoutes);
    app.use('/membershipPlans', userRoutes);
    app.use('/joinnow', userRoutes);
    app.use('/signin', userRoutes);
    app.use('/protectedUserHomePage', userRoutes);
    app.use('/userProfile', userRoutes);
    app.use('/updateplan', userRoutes);
    app.use('/logout', userRoutes);
    app.use('/location', gymRoutes);
    app.use('/membershipplandetails',gymRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/myAppointments', appointmentRoutes);
    app.use('*', (req, res) => {
      res.status(404).json({ error: '404 Error: Not found' });
    });
  };
  
export default constructorMethod;