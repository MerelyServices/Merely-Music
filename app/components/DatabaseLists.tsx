import React, { useContext } from 'react';

import { ObjectIdMap, Album, Playlist, Artist, Metadata, Song, ResolveObjects, mapObjectId, SongMetadata } from '@/models/database';
import { View, Image, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { Link } from 'expo-router';

import { baseStyles } from '@/constants/Stylesheet';
import { Text } from '@/components/Themed';
import ObjectId from 'mongo-objectid';
import { DbContext } from '@/context/database';

type PropsData<T> = Omit<React.ComponentProps<any>, 'data'> & { data: T[] };

function PlaylistSongPreview(props: PropsData<ObjectId> & {songMeta: ObjectIdMap<SongMetadata>}) {
  return <>
    {props.data.slice(0, 3).reverse().map((songRef, i) => (
      <Image
        key={songRef.toString()}
        style={{ ...styles.playlistSong, left: (54 * i) + 4, opacity: 1 - (0.2 * i) }}
        source={require('../assets/images/song.png')}
      />
    ))}
  </>
}

export function Playlists(props: PropsData<Playlist>) {
  const dbparams = useContext(DbContext);
  if(!dbparams?.localDb) return <></>;
  const songMeta = mapObjectId(dbparams.localDb.songs);

  function renderItem(info:ListRenderItemInfo<Playlist>) {
    return (
      <View key={info.item._id.toString()} style={styles.listItem}>
        {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
          <Image style={styles.playlistImage} source={require('../assets/images/playlist.png')}/>
          <PlaylistSongPreview data={info.item.songs} songMeta={songMeta}/>
          <Text style={{ ...styles.listItemName, maxWidth:256 }}>{info.item.name}</Text>
          <Text style={styles.subtitle}>{info.item.songs.length} song{info.item.songs.length == 1? '': 's'}</Text>
        {/*</Link>*/}
      </View>
    );
  }
  return <FlatList data={props.data} renderItem={renderItem} horizontal={true}/>;
}

export function Albums(props: PropsData<Album>) {
  const dbparams = useContext(DbContext);
  if(!dbparams?.localDb) return <></>;
  const artists = mapObjectId(dbparams.localDb.artists);

  function renderItem(info:ListRenderItemInfo<Album>) {
    return (
      <View key={info.item._id.toString()} style={styles.listItem}>
        {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
          <Image style={styles.artworkImage} source={require('../assets/images/album.png')}/>
          <Text style={styles.listItemName}>{info.item.name}</Text>
          <Text style={styles.subtitle}>{artists[info.item.artist.toString()].name}</Text>
        {/*</Link>*/}
      </View>
    );
  }
  return <FlatList data={props.data} renderItem={renderItem} horizontal={true}/>;
}

export function Songs(props: PropsData<ObjectId>) {
  //TODO: add song duration section
  const dbparams = useContext(DbContext);
  if(!dbparams?.localDb) return <></>;
  const songMeta = mapObjectId(dbparams.localDb.songs);
  const artists = mapObjectId(dbparams.localDb.artists);
  const albums = mapObjectId(dbparams.localDb.albums);

  function renderItem(songId:ObjectId) {
    const song = songMeta[songId.toString()];
    const artistNames = song.metadata.artists.map((artistId) => artists[artistId.toString()].name).join(', ');
    return (
      <View key={song._id.toString()} style={styles.wideItem}>
        <Image style={styles.wideItemArtwork} source={require('../assets/images/song.png')}/>
        <Text style={styles.wideCol1}>{song.metadata.title}</Text>
        <Text style={styles.wideCol2}>{artistNames}</Text>
        <Text style={styles.wideCol3}>{albums[song.metadata.album.toString()].name}</Text>
        <Text style={styles.wideCol4}>{song.duration}</Text>
      </View>
    )
  }

  return <>{props.data.map(renderItem)}</>
}

export function Artists(props: PropsData<Artist>) {
  const dbparams = useContext(DbContext);
  if(!dbparams?.localDb) return <></>;

  function renderItem(info:ListRenderItemInfo<Artist>) {
    return (
      <View key={info.item._id.toString()} style={styles.listItem}>
        {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
          <Image style={styles.artworkImage} source={require('../assets/images/artist.png')}/>
          <Text style={styles.listItemName}>{info.item.name}</Text>
          <Text style={styles.subtitle}>? Songs</Text>
        {/*</Link>*/}
      </View>
    );
  }
  return <FlatList data={props.data} renderItem={renderItem} horizontal={true}/>;
}

const styles = StyleSheet.create({
  ...baseStyles,
  listItem: {
    position: 'relative',
  },
  listItemName: {
    marginTop: 8,
    marginBottom: 12,
    maxWidth: 192,
  },
  playlistImage: {
    width: 256,
    height: 192,
  },
  playlistSong: {
    position: 'absolute',
    top: 50,
    width: 136,
    height: 136,
  },
  wideItem: {
    position: 'relative',
    width: '100%',
    height: 32,
  },
  wideItemArtwork: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 24,
    height: 24,
  },
  wideCol1: {
    left: 36,
    right: '30%',
  },
  wideCol2: {
    left: '30%',
    right: '40%',
  },
  wideCol3: {
    left: '60%',
    right: '20%',
  },
  wideCol4: {
    left: '80%',
    right: 4,
  },
});