import * as express from 'express';
import * as mongodb from 'mongodb';
import axios from "axios";
import qs from "qs";
import { MongoHelper } from './mongo.helper';
import { PassportLink, PassportUser, AuthSessions } from './models';

const routes = express.Router();

export default function(passport:PassportLink, authsessions:AuthSessions ){
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
    res.json({'redirect':`https://passport.yiays.com/api/oauth2/authorize?id=${passport.AppId}&redirect=${redirect}`});
  });

  routes.get('/user/callback', async (req, res) => {
    const data = {client_id: passport.AppId, client_secret: passport.Secret, code: req.query.code};
    const result = await axios.post<any>('https://passport.yiays.com/api/oauth2/token',
                                          qs.stringify(data),
                                          {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
                                        ).catch((_)=>{res.status(500).json({success:false, msg:"Failed to authenticate with Passport!"}).end()});
    if(result && result.status === 200){
      res.json(result.data);
    }else{
      throw Error("Callback failed and error wasn't caught, this shouldn't happen.");
    }
  });

  return routes;
}