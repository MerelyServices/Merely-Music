import * as express from 'express';
import * as mongodb from 'mongodb';
import { MongoHelper } from './mongo.helper';
import { PassportLink, PassportProfile } from './passport';
import { Album, Artist, Genre, Metadata, Playlist, Song, User } from './models';

const routes = express.Router();
routes.use(express.json())

export default function(passport:PassportLink){
  // define a route handler for the default home page
  routes.get("/", (req, res) => {
    res.json({message: "Server is running!"});
  });

  routes.get("/songs", async (req, res) => {
    try {
      const songs = await MongoHelper.client.db('music').collection('song').find({}).toArray() as Song[];
      res.status(200).send(songs);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/song/:id", async (req, res) => {
    const search = {_id: new mongodb.ObjectId(req.params.id)}
    try {
      const song = (await MongoHelper.client.db('music').collection('song').find(search).toArray())[0] as Song;
      res.status(200).send(song);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/metadata/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const metadata = (await MongoHelper.client.db('music').collection('metadata').find(search).toArray())[0] as Metadata;
      res.status(200).send(metadata);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/albums", async (req, res) => {
    try {
      const albums = await MongoHelper.client.db('music').collection('album').find({}).toArray() as Album[];
      res.status(200).send(albums);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/album/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const album = (await MongoHelper.client.db('music').collection('album').find(search).toArray())[0] as Album;
      res.status(200).send(album);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/artists", async (req, res) => {
    try {
      const artists = await MongoHelper.client.db('music').collection('artist').find({}).toArray() as Artist[];
      res.status(200).send(artists);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/artist/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const artist = (await MongoHelper.client.db('music').collection('artist').find(search).toArray())[0] as Artist;
      res.status(200).send(artist);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/genres", async (req, res) => {
    try {
      const genres = await MongoHelper.client.db('music').collection('genre').find({}).toArray() as Genre[];
      res.status(200).send(genres);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/genre/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const genre = (await MongoHelper.client.db('music').collection('genre').find(search).toArray())[0] as Genre;
      res.status(200).send(genre);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/playlists", async (req, res) => {
    try {
      const playlists = await MongoHelper.client.db('music').collection('playlist').find({}).toArray() as Playlist[];
      res.status(200).send(playlists);
    } catch (error) {
      res.status(500).send({error:error.message});
    }
  });

  routes.get("/playlist/:id", async (req, res) => {
    try {
      const search = {_id: new mongodb.ObjectId(req.params.id)};
      const playlist = (await MongoHelper.client.db('music').collection('playlist').find(search).toArray())[0] as Playlist;
      res.status(200).send(playlist);
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  });

  routes.get("/user", async (req, res) => {
    try {
      const profile = await passport.getProfile(req.cookies['_passportToken']);
      if(profile == false) {
        res.status(401);
        return;
      }
      const search = { id: profile.username.toLowerCase() };
      const user = (await MongoHelper.client.db('music').collection('playlist').find(search).toArray())[0] as User;
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  });

  routes.get("/user/login", async (req, res) => {
    const redirect = encodeURIComponent("https://merely.yiays.com/music/");
    res.send({'redirect':`https://passport.yiays.com/?redirect=${redirect}`});
  });

  routes.get('/user/callback', async (req, res) => {
    res.send({});
  });

  return routes;
}