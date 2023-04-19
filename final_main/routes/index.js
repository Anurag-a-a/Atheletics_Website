
import userRoutes from './users.js';
const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('*', (req, res) => {
      res.status(404).json({ error: '404 Error: Not found' });
    });
  };
  
export default constructorMethod;