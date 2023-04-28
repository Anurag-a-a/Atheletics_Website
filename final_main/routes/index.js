
import userRoutes from './users.js';
import gymRoutes from './gymDetails.js';
const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/amenities', userRoutes);
    app.use('/membershipdetails', userRoutes);
    app.use('/joinnow', userRoutes);
    app.use('/location', gymRoutes);
    app.use('/membershipplandetails',gymRoutes);
    app.use('*', (req, res) => {
      res.status(404).json({ error: '404 Error: Not found' });
    });
  };
  
export default constructorMethod;