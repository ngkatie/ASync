import express from 'express';
const app = express();
import configRoutesFunction from './routes/index.js';

// **** REDIS ****
// import redis from 'redis';
// const client = redis.createClient();
// client.connect();

app.use(express.json());

app.use(async (req, res, next) => {
  let requestBody = {...req.body};

  if (requestBody?.password) {
    delete requestBody.password;
  }

  const urlPath = "http://localhost:3000" + req.originalUrl;
  const httpVerb = req.method;
  
  if (httpVerb === "GET") {
    requestBody = {};
  }

  console.log(`[${new Date().toUTCString()}]: \n\t${httpVerb} ${urlPath} \n\tRequest Body: ${JSON.stringify(requestBody)}`);
  next();
});

configRoutesFunction(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});