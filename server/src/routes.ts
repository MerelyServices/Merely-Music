import * as express from 'express';
import * as mongodb from 'mongodb';
import { Conn } from './mongo.helper';
import { PassportLink, PassportProfile } from './passport';
import { Album, Artist, Genre, Metadata, Playlist, Song, User } from './models';

const routes = express.Router();
routes.use(express.json());

export default function (passport: PassportLink): express.Router {
  // define a route handler for the default home page
  routes.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
  });

  routes.get("/songs", async (req, res) => {
    const search = {
      'owners.owner': passport.sessionUsers[req.token]._id
    };
    const songs = await Conn.db.collection('song').find(search).toArray() as Song[];
    res.status(200).send(songs);
  });

  routes.get("/song/:id", async (req, res) => {
    const search = {
      _id: new mongodb.ObjectId(req.params.id),
      'owners.owner': passport.sessionUsers[req.token]._id
    };
    const result = await Conn.db.collection('song').find(search).toArray();
    if (result[0])
      res.status(200).send(result[0] as Song);
    else
      res.status(404).end();
  });

  routes.get("/metadata/:id", async (req, res) => {
    // TODO: security
    const search = {
      _id: new mongodb.ObjectId(req.params.id)
    };
    const result = await Conn.db.collection('metadata').find(search).toArray();
    if (result[0])
      res.status(200).send(result[0] as Metadata);
    else
      res.status(404).end();
  });

  routes.get("/albums", async (req, res) => {
    // This object is shared between all users
    const albums = await Conn.db.collection('album').find({}).toArray() as Album[];
    res.status(200).send(albums);
  });

  routes.get("/album/:id", async (req, res) => {
    // TODO: aggregate all owned songs that fit in this album
    const search = {
      _id: new mongodb.ObjectId(req.params.id)
    };
    const result = await Conn.db.collection('album').find(search).toArray();
    if (result[0])
      res.status(200).send(result[0] as Album);
    else
      res.status(404).end();
  });

  routes.get("/artists", async (req, res) => {
    // This object is shared between all users
    const artists = await Conn.db.collection('artist').find({}).toArray() as Artist[];
    res.status(200).send(artists);
  });

  routes.get("/artist/:id", async (req, res) => {
    // TODO: aggregate all owned songs that belong to this artist
    const search = {
      _id: new mongodb.ObjectId(req.params.id)
    };
    const result = await Conn.db.collection('artist').find(search).toArray();
    if (result[0])
      res.status(200).send(result[0] as Artist);
    else
      res.status(404).end();
  });

  routes.get("/genres", async (req, res) => {
    // This object is shared between all users
    const genres = await Conn.db.collection('genre').find({}).toArray() as Genre[];
    res.status(200).send(genres);
  });

  routes.get("/playlists", async (req, res) => {
    const search = {
      $or: [
        { owner: passport.sessionUsers[req.token]._id },
        { collaborators: passport.sessionUsers[req.token]._id },
      ]
    };
    const playlists = await Conn.db.collection('playlist').find(search).toArray() as Playlist[];
    res.status(200).send(playlists);
  });

  routes.get("/playlist/:id", async (req, res) => {
    const search = {
      _id: new mongodb.ObjectId(req.params.id),
      $or: [
        { owner: passport.sessionUsers[req.token]._id },
        { collaborators: passport.sessionUsers[req.token]._id },
      ]
    };
    const result = await Conn.db.collection('playlist').find(search).toArray();
    if (result[0])
      res.status(200).send(result[0] as Playlist);
    else
      res.status(404).end();
  });

  routes.get("/user", async (req, res) => {
    res.status(200).send(passport.sessionUsers[req.token]);
  });

  return routes;
}