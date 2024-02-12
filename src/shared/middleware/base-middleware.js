require('dotenv').config();
const Express = require('express');
const app = Express();

const adminRoutes = [
  '/email-list',
  '/region-avg',
  '/calc-residential'
];

const registerBaseMiddleWare = (app) => {
  app.use(Express.json());
  app.use(logger);
  app.use(checkAuthToken);
};

const logger = (req,res,next) => {
  const message = `API call: ${req.method} on ${req.originalUrl} at ${new Date()}`
  console.log(message);
  next();
};

const checkAuthToken = (req,res,next) => {
  const url = req.url.slice(0,req.url.indexOf('?'));

  if(!adminRoutes.includes(url)){
    next();
    return;
  }

  const inputToken = req.headers.token;
  const savedToken = process.env.TOKEN;

  if(inputToken !== savedToken){
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  next();
};

module.exports = {registerBaseMiddleWare};