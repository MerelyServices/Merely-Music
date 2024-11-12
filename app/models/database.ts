import ObjectId from "mongo-objectid";

export interface BaseItem {
  _id: ObjectId
}

export interface ObjectIdMap<T> {
  [id: string]: T
}

export function mapObjectId<T extends BaseItem>(arr:T[]): ObjectIdMap<T>[] {
  return arr.map((val) => {
    let out = {} as ObjectIdMap<T>;
    out[val._id.toString()] = val;
    return out;
  });
}

export interface Artist {
  _id: ObjectId,
  name: string,
  aka?: string[],
  bio?: string,
  artwork?: string,
}

export interface Album {
  _id: ObjectId,
  name: string,
  artist: ObjectId,
  // contributing artists: query
  // songs: query
  artwork?: string
}

export interface Genre {
  _id: ObjectId,
  name: string
}

export interface Metadata {
  _id: ObjectId,
  title: string,
  artists: ObjectId[],
  position?: number,
  album: ObjectId,
  added: Date,
  published: Date,
  genres: ObjectId[],
  explicit: boolean
}

interface UserPreferences {

}

type UserRatings = { song:ObjectId, value:-1|1 }[]

export interface User {
  _id: ObjectId,
  id: string,
  username: string,
  ratings: UserRatings,
  preferences: UserPreferences
}

export type OtherUser = Pick<User, '_id'|'username'>

export interface Playlist {
  _id: ObjectId,
  owner: ObjectId,
  collaborators?: ObjectId[],
  name: string,
  description?: string,
  songs: ObjectId[]
}

export interface Song {
  _id: ObjectId,
  owners: {owner:ObjectId, metadata: ObjectId}[],
  quality: {codec: 'mp3'|'aac'|'flac', bitrate:number},
  hash: string,
  acoustid?: string,
  artwork?: string
}

export interface DbCache {
  artists: Artist[],
  albums: Album[],
  genres: Genre[],
  metadata: Metadata[],
  users: OtherUser[],
  playlists: Playlist[],
  lastSync: number,
}