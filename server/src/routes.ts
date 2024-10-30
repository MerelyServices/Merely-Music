import * as express from 'express';
import * as mongodb from 'mongodb';
import { MongoHelper } from './mongo.helper';
import { PassportLink, PassportUser, AuthSessions } from './models';

const routes = express.Router();
routes.use(express.json())

export default function(passport:PassportLink, authsessions:AuthSessions|null ){
  // define a route handler for the default home page
  routes.get("/", (req, res) => {
    res.json({message: "Server is running!"});
  });

  routes.get("/songs", async (req, res) => {
    try {
      const songs = await MongoHelper.client.db('music').collection('song').find({}).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/song/:id", async (req, res) => {
    const search = {_id: new mongodb.ObjectId(req.params.id)}
    try {
      const songs = await MongoHelper.client.db('music').collection('song').find(search).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/metadata/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const songs = await MongoHelper.client.db('music').collection('metadata').find(search).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/albums", async (req, res) => {
    try {
      const songs = await MongoHelper.client.db('music').collection('album').find({}).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/album/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const songs = await MongoHelper.client.db('music').collection('album').find(search).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/artists", async (req, res) => {
    try {
      const songs = await MongoHelper.client.db('music').collection('artist').find({}).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/artist/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const songs = await MongoHelper.client.db('music').collection('artist').find(search).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/genres", async (req, res) => {
    try {
      const songs = await MongoHelper.client.db('music').collection('genre').find({}).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/genre/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const songs = await MongoHelper.client.db('music').collection('genre').find(search).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/playlists", async (req, res) => {
    try {
      const songs = await MongoHelper.client.db('music').collection('playlist').find({}).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/playlist/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const songs = await MongoHelper.client.db('music').collection('playlist').find(search).toArray();
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  });

  routes.get("/user", (req, res) => {
    res.send({});
  });

  routes.get("/user/login", (req, res) => {
    const redirect = encodeURIComponent(passport.CallbackUrl);
    res.send({'redirect':`https://passport.yiays.com/api/oauth2/authorize?id=${passport.AppId}&redirect=${redirect}`});
  });

  routes.get('/user/callback', async (req, res) => {
    res.send({});
  });

  return routes;
}