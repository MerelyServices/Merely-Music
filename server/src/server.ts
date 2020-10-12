import express from "express";
import { MongoHelper } from './mongo.helper';
import routesBuilder from './routes';
import { PassportLink, AuthSession } from './models';

import yargs from 'yargs';
const argv = yargs.options({
                            dburl: { type: 'string', description: "The URL of the MongoDB server.", demandOption: true, alias: 'db' },
                            help: { alias: 'h', description: "Presents you with this help page." },
                            version: {alias: ['ver', 'v'], description: "Returns the current version of this server." }
                          }).argv

const app = express();
const dburl = argv.dburl;
const port = 8080;
const passport:PassportLink = new PassportLink(4, "", "http://localhost:8080/user/callback");
const authSessions:AuthSession[] = [];
const routes = routesBuilder(passport, authSessions);

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