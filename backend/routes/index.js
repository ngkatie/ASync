import generalRoutes from './general.js';

const constructorMethod = (app) => {
  app.use('/api', generalRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;