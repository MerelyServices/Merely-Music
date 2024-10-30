import express from "express";
import dotenv from 'dotenv';

import { MongoHelper } from './mongo.helper';
import routesBuilder from './routes';
import { PassportLink, AuthSessions } from './models';

dotenv.config();

const app = express();
const dburl = process.env.DBURL;
const port = 8080;
const passport = new PassportLink(4, process.env.SECRET, `http://localhost:${port}/user/callback`);
// let authSessions: AuthSessions;
const routes = routesBuilder(passport, /*authSessions*/ null);

app.use(routes);

// 404 page
app.use((req, res, next) => {
  res.status(404).json({message: "Command not found!"});
});

// 500 page
/*app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({message: "The server encountered an error!"});
});*/

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