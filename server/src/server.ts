import express from "express";
import asyncMiddleware from "middleware-async";
import dotenv from 'dotenv';
import cors from 'cors';

import { Conn } from './mongo.helper';
import routesBuilder from './routes';
import { PassportLink } from './passport';

dotenv.config();

const app = express();
const dburl = process.env.DBURL;
const port = Number(process.env.PORT);
const passport = new PassportLink('https://passport.yiays.com/api');
// Add middleware
// Cross Origin Request
if(process.env.CORS)
  app.use(cors());
// Authentication
app.use(asyncMiddleware(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if(!token) {
    return res.status(401).json({message: "This API requires a token."});
  }
  else {
    const profile = await passport.getProfile(token, Conn.db);
    if(profile == false) {
      return res.status(401).json({message: "Token is invalid."});
    }else{
      req.token = token;
      req.profile = profile;
      return next();
    }
  }
}));
const routes = routesBuilder(passport);

app.use(routes);

// 404 page
app.use((req, res, next) => {
  res.status(404).json({message: "Command not found!"});
});

// start the Express server
const server = app.listen(port);

server.on('listening', async () => {
  try {
    await Conn.connect(dburl);
    console.info(`Connected to Mongo!`);
  } catch (err) {
    console.error(`Unable to connect to Mongo!`, err);
    return;
  }
	console.log(`Listening on http://localhost:${port}...`);
});

server.on('close', () => {
	console.info("Disconnecting database...");
	if(Conn.client) Conn.client.close();
});