import { ObjectId, Timestamp } from "mongodb";

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

export interface UserPreferences {

}

export type UserRatings = {song:ObjectId, value:-1|1}[]

export interface User {
  _id: ObjectId,
  id: string,
  username: string,
  ratings: UserRatings,
  preferences: UserPreferences
}

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