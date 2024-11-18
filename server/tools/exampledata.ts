import dotenv from 'dotenv';
import { Document } from 'mongodb';
import { Conn } from '../src/mongo.helper';
import { Album, Artist, Genre, Metadata, Playlist, Song, User } from '../src/models';
import { ObjectId } from 'mongodb';

dotenv.config();

async function main() {
  await Conn.connect(process.env.DBURL as string);

  // Verify connection
  await Conn.client.db("admin").command({ ping: 1 });
  console.log("Connected successfully to MongoDB");

  const db = Conn.client.db("music");

  await db.collection('artist').deleteMany({});
  const artistId = new ObjectId();
  const artist = {
    _id: artistId,
    name: 'Example Artist',
    bio: "An artist entry that exists purely to test features during development."
  } as Artist;
  await db.collection('artist').insertOne(artist);

  await db.collection('album').deleteMany({});
  const albumId = new ObjectId();
  const album = {
    _id: albumId,
    name: 'Example Album',
    artist: artistId
  } as Album;
  await db.collection('album').insertOne(album);

  await db.collection('genre').deleteMany({});
  const genreId = new ObjectId();
  const genre = {
    _id: genreId,
    name: 'Example Genre'
  } as Genre;
  await db.collection('genre').insertOne(genre);

  await db.collection('metadata').deleteMany({});
  const metadataId = new ObjectId();
  const metadata = {
    _id: metadataId,
    title: 'Example Song',
    artists: [artistId],
    position: 1,
    album: albumId,
    added: new Date(),
    published: new Date(),
    genres: [genreId],
    explicit: false
  } as Metadata;
  await db.collection('metadata').insertOne(metadata);

  await db.collection('user').deleteMany({});
  const userId = new ObjectId();
  const user = {
    _id: userId,
    id: 'testing',
    username: 'Example',
    ratings: [],
    preferences: {}
  } as User;
  await db.collection('user').insertOne(user);

  await db.collection('playlist').deleteMany({});
  const playlistId = new ObjectId();
  const playlist = {
    _id: playlistId,
    owner: userId,
    name: "Example Playlist",
    description: "A playlist that exists purely to test features during development.",
    songs: [metadataId]
  } as Playlist;
  await db.collection('playlist').insertOne(playlist);

  await db.collection('song').deleteMany({});
  const songId = new ObjectId();
  const song = {
    _id: songId,
    owners: [{owner: userId, metadata: metadataId}],
    quality: {codec: 'mp3', bitrate: 196},
    duration: 90,
    hash: 'example'
  } as Song;
  await db.collection('song').insertOne(song);

  const liked = {
    $push: {
      ratings: {
        song: songId,
        value: 1
      }
    }
  } as Document // Pick<User, 'ratings'>
  await db.collection('user').updateOne({_id: userId}, liked);

  console.log("Finished resetting database.")
}

main().catch(console.dir);