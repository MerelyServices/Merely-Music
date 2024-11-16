import * as express from 'express';
import { FindOptions, ObjectId } from 'mongodb';
import { Conn } from './mongo.helper';
import { PassportLink, PassportProfile } from './passport';
import { Album, Artist, UserDatabase, Genre, Metadata, OtherUser, Playlist, Song, User, SongMetadata } from './models';

const routes = express.Router();
routes.use(express.json());

export default function (passport: PassportLink): express.Router {
  // define a route handler for the default home page
  routes.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
  });

  async function getSongs(token:string): Promise<Song[]> {
    const search = {
      'owners.owner': passport.sessionUsers[token]._id
    };
    return await Conn.db.collection('song').find(search).toArray() as Song[];
  }

  routes.get("/songs", async (req, res) => {
    const result = await getSongs(req.token);
    res.status(200).send(result);
  });

  async function getSong(id:ObjectId, token:string): Promise<Song[]> {
    const search = {
      _id: id,
      'owners.owner': passport.sessionUsers[token]._id
    };
    return await Conn.db.collection('song').find(search).toArray() as Song[];
  }

  routes.get("/song/:id", async (req, res) => {
    const result = await getSong(new ObjectId(req.params.id), req.token);
    if (result[0])
      res.status(200).send(result[0] as Song);
    else
      res.status(404).end();
  });

  async function getMetadata(id:ObjectId): Promise<Metadata[]> {
    // TODO: security
    const search = {
      _id: id
    };
    return await Conn.db.collection('metadata').find(search).toArray() as Metadata[];
  }

  routes.get("/metadata/:id", async (req, res) => {
    const result = await getMetadata(new ObjectId(req.params.id));
    if (result[0])
      res.status(200).send(result[0] as Metadata);
    else
      res.status(404).end();
  });

  async function getSongsWithMetadata(userId:ObjectId): Promise<SongMetadata[]> {
    const pipeline = [
      {$match: {'owners.owner': userId}},
      {$lookup: {
        from: 'metadata',
        localField: 'owners.metadata',
        foreignField: '_id',
        as: 'metadata'
      }},
      {$unwind: '$metadata'},
      {$project: {
        owners: 0
      }}
    ];
    return await Conn.db.collection('song').aggregate(pipeline).toArray() as SongMetadata[];
  }

  routes.get("/songmetadata", async (req, res) => {
    const result = await getSongsWithMetadata(passport.sessionUsers[req.token]._id);
    res.status(200).send(result);
  });

  async function getAlbums(): Promise<Album[]> {
    // This object is shared between all users
    return await Conn.db.collection('album').find({}).toArray() as Album[];
  }

  routes.get("/albums", async (req, res) => {
    const result = await getAlbums();
    res.status(200).send(result);
  });

  async function getAlbum(id:ObjectId): Promise<Album[]> {
    const search = {
      _id: id
    };
    return await Conn.db.collection('album').find(search).toArray() as Album[];
  }

  routes.get("/album/:id", async (req, res) => {
    const result = await getAlbum(new ObjectId(req.params.id));
    if (result[0])
      res.status(200).send(result[0] as Album);
    else
      res.status(404).end();
  });

  async function getArtists(): Promise<Artist[]> {
    // This object is shared between all users
    return await Conn.db.collection('artist').find({}).toArray() as Artist[];
  }

  routes.get("/artists", async (req, res) => {
    const result = await getArtists();
    res.status(200).send(result);
  });

  async function getArtist(id:ObjectId): Promise<Artist[]> {
    const search = {
      _id: id
    };
    return await Conn.db.collection('artist').find(search).toArray() as Artist[];
  }

  routes.get("/artist/:id", async (req, res) => {
    const result = await getArtist(new ObjectId(req.params.id));
    if (result[0])
      res.status(200).send(result[0] as Artist);
    else
      res.status(404).end();
  });

  async function getGenres(): Promise<Genre[]> {
    // This object is shared between all users
    return await Conn.db.collection('genre').find({}).toArray() as Genre[];
  }

  routes.get("/genres", async (req, res) => {
    const result = await getGenres();
    res.status(200).send(result);
  });

  async function getPlaylists(token:string): Promise<Playlist[]> {
    const search = {
      $or: [
        { owner: passport.sessionUsers[token]._id },
        { collaborators: passport.sessionUsers[token]._id },
      ]
    };
    return await Conn.db.collection('playlist').find(search).toArray() as Playlist[];
  }

  routes.get("/playlists", async (req, res) => {
    const result = await getPlaylists(req.token);
    res.status(200).send(result);
  });

  async function getPlaylist(id:ObjectId, token:string): Promise<Playlist[]> {
    const search = {
      _id: id,
      $or: [
        { owner: passport.sessionUsers[token]._id },
        { collaborators: passport.sessionUsers[token]._id },
      ]
    };
    return await Conn.db.collection('playlist').find(search).toArray() as Playlist[];
  }

  routes.get("/playlist/:id", async (req, res) => {
    const result = await getPlaylist(new ObjectId(req.params.id), req.token);
    if (result[0])
      res.status(200).send(result[0] as Playlist);
    else
      res.status(404).end();
  });

  async function getUsers(id:ObjectId) {
    const search = {_id: {$ne: id}};
    const options: FindOptions = {projection: {_id:1, username:1}}
    return await Conn.db.collection('user').find(search, options).toArray() as OtherUser[];
  }

  routes.get("/user", async (req, res) => {
    res.status(200).send(passport.sessionUsers[req.token]);
  });

  routes.post("/sync", async (req, res) => {
    // TODO: readonly for now
    const userId = passport.sessionUsers[req.token]._id;

    const result: Omit<UserDatabase, 'lastSync'> = {
      artists: await getArtists(),
      albums: await getAlbums(),
      genres: await getGenres(),
      songs: await getSongsWithMetadata(userId),
      users: await getUsers(userId),
      playlists: await getPlaylists(req.token),
    }
    res.status(200).send(result);
  });

  return routes;
}