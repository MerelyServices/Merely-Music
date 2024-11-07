import express from "express";
import dotenv from 'dotenv';

import { MongoHelper } from './mongo.helper';
import routesBuilder from './routes';
import { PassportLink } from './passport';

dotenv.config();

const app = express();
const dburl = process.env.DBURL;
const port = 8080;
const passport = new PassportLink('https://passport.yiays.com/api');
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
    await MongoHelper.connect(dburl);
    console.info(`Connected to Mongo!`);
  } catch (err) {
    console.error(`Unable to connect to Mongo!`, err);
  }
	console.log(`Listening on http://localhost:${port}...`);
});

server.on('close', () => {
	console.info("Disconnecting database...");
	if(MongoHelper.client) MongoHelper.client.close();
});