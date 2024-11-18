import ObjectId from "mongo-objectid";


// Models

export interface BaseItem {
  _id: ObjectId
}

export interface ObjectIdMap<T> {
  [id: string]: T
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

interface UserPreferences {}

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
  user: User,
  artists: Artist[],
  albums: Album[],
  genres: Genre[],
  songs: SongMetadata[],
  users: OtherUser[],
  playlists: Playlist[],
  lastSync: number,
}

// Utilities

export function mapObjectId<T extends BaseItem>(arr:T[]): ObjectIdMap<T> {
  let out = {} as ObjectIdMap<T>;
  arr.forEach((val) => {
    out[val._id.toString()] = val;
  });
  return out;
}

export function filterByMetadata<T extends BaseItem>(items:T[], meta:SongMetadata[], metaKey:keyof Metadata): T[] {
  const itemRefs = meta.reduce<string[]>((out, curr) => {
    const reference = curr.metadata[metaKey] as ObjectId|ObjectId[];
    const references = reference instanceof Array? reference: [reference];
    out.push(...references.map(refId => refId.toString()));
    return out;
  }, []);
  const result =  items.filter((item) => itemRefs.includes(item._id.toString()));
  return result;
}

export function filterByRating(ratings:UserRating[], value:-1|1): ObjectId[] {
  return ratings.filter((rating) => rating.value == value).map((rating) => rating.song);
}

export function ResolveObjects<T extends BaseItem>(ids:ObjectId[], map:ObjectIdMap<T>): T[] {
  return ids.map((id) => map[id.toString()]);
}