import * as express from 'express';
import * as mongodb from 'mongodb';
import { MongoHelper } from './mongo.helper';
import { PassportLink, AuthSession } from './models';

const routes = express.Router();

export default function(passport:PassportLink, authsessions:AuthSession[] ){
  // define a route handler for the default home page
  routes.get("/", (req, res) => {
    res.json({message: "Server is running!"});
  });

  routes.get("/songs", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('song');
    collection.find({}).toArray((err, songs) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(songs);
      }
    });
  });

  routes.get("/song/:id", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('song');
    collection.find({_id: new mongodb.ObjectId(req.params.id)}).toArray((err, song) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(song);
      }
    });
  });

  routes.get("/metadata/:id", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('metadata');
    collection.find({_id: new mongodb.ObjectId(req.params.id)}).toArray((err, meta) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(meta);
      }
    });
  });

  routes.get("/albums", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('album');
    collection.find({}).toArray((err, albums) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(albums);
      }
    });
  });

  routes.get("/album/:id", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('album');
    collection.find({_id: new mongodb.ObjectId(req.params.id)}).toArray((err, album) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(album);
      }
    });
  });

  routes.get("/artists", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('artist');
    collection.find({}).toArray((err, artists) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(artists);
      }
    });
  });

  routes.get("/artist/:id", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('artist');
    collection.find({_id: new mongodb.ObjectId(req.params.id)}).toArray((err, artist) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(artist);
      }
    });
  });

  routes.get("/genres", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('genre');
    collection.find({}).toArray((err, genres) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(genres);
      }
    });
  });

  routes.get("/genre/:id", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('genre');
    collection.find({_id: new mongodb.ObjectId(req.params.id)}).toArray((err, genre) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(genre);
      }
    });
  });

  routes.get("/playlists", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('playlist');
    collection.find({}).toArray((err, playlist) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(playlist);
      }
    });
  });

  routes.get("/playlist/:id", (req, res) => {
    const collection = MongoHelper.client.db('music').collection('playlist');
    collection.find({_id: new mongodb.ObjectId(req.params.id)}).toArray((err, playlist) => {
      if (err) {
        res.status(500);
        res.end();
        console.error('Caught error', err);
      } else {
        res.json(playlist);
      }
    });
  });

  routes.get("/user", (req, res) => {
    res.json({});
  });

  routes.get("/user/login", (req, res) => {
    const redirect = encodeURIComponent(passport.CallbackUrl);
    res.json({'redirect':`https://passport.yiays.com/oauth2/authorize?id=${passport.AppId}&redirect=${redirect}`});
  });

  routes.get('/user/callback', (req, res) => {
    res.json({});
  });

  return routes;
}