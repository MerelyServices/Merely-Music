import { ObjectId } from "mongodb";

export interface BaseItem {
  _id: ObjectId
}

export interface Artist extends BaseItem {
  name: string,
  aka?: string[],
  bio?: string,
  artwork?: string,
}

export interface Album extends BaseItem {
  name: string,
  artist: ObjectId,
  // contributing artists: query
  // songs: query
  artwork?: string
}

export interface Genre extends BaseItem {
  name: string
}

interface UserPreferences {

}

type UserRating = { song:ObjectId, value:-1|1 }

export interface User extends BaseItem {
  id: string,
  username: string,
  ratings: UserRating[],
  preferences: UserPreferences
}

export type OtherUser = Pick<User, '_id'|'username'>

export interface Playlist extends BaseItem {
  owner: ObjectId,
  collaborators?: ObjectId[],
  name: string,
  description?: string,
  songs: ObjectId[]
}

export interface Metadata extends BaseItem {
  title: string,
  artists: ObjectId[],
  position?: number,
  album: ObjectId,
  added: Date,
  published: Date,
  genres: ObjectId[],
  explicit: boolean
}

export interface Song extends BaseItem {
  owners: {owner:ObjectId, metadata: ObjectId}[],
  quality: {codec: 'mp3'|'aac'|'flac', bitrate:number},
  duration: number,
  hash: string,
  acoustid?: string,
  artwork?: string
}

export interface SongMetadata extends Omit<Song, 'owners'> {
  metadata: Metadata
}

export interface UserDatabase {
  artists: Artist[],
  albums: Album[],
  genres: Genre[],
  songs: SongMetadata[],
  users: OtherUser[],
  playlists: Playlist[],
  lastSync: number,
}