import React from 'react';

import { ObjectIdMap, Album, Playlist, Artist, Metadata } from '@/models/database';
import { View, Image, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { Link } from 'expo-router';

import { baseStyles } from '@/constants/Stylesheet';
import { Text } from '@/components/Themed';
import ObjectId from 'mongo-objectid';

type PropsData<T, R> = Omit<React.ComponentProps<any>, 'data'> & { data: T[], map: ObjectIdMap<R>[] };

function PlaylistSongPreview(props: PropsData<ObjectId, Metadata>) {
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

export function Playlists(props: PropsData<Playlist, Metadata>) {
  function renderItem(info:ListRenderItemInfo<Playlist>) {
    return (
      <View key={info.item._id.toString()} style={styles.listItem}>
        {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
          <Image style={styles.playlistImage} source={require('../assets/images/playlist.png')}/>
          <PlaylistSongPreview data={info.item.songs} map={props.map}/>
          <Text style={styles.listItemName}>{info.item.name}</Text>
          <Text style={styles.subtitle}>{info.item.songs.length} song{info.item.songs.length == 1? '': 's'}</Text>
        {/*</Link>*/}
      </View>
    );
  }
  return <FlatList data={props.data} renderItem={renderItem} horizontal={true}/>;
}

export function Albums(
  props: Omit<React.ComponentProps<any>, 'data'> & { data: Album[], artists: ObjectIdMap<Artist> }
) {
  function renderItem(info:ListRenderItemInfo<Album>) {
    return (
      <View key={info.item._id.toString()} style={styles.listItem}>
        {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
          <Image style={styles.artworkImage} source={require('../assets/images/album.png')}/>
          <Text style={styles.listItemName}>{info.item.name}</Text>
          <Text style={styles.subtitle}>{props.artists[info.item.artist.toString()].name}</Text>
        {/*</Link>*/}
      </View>
    );
  }
  return <FlatList data={props.data} renderItem={renderItem} horizontal={true}/>;
}

const styles = StyleSheet.create({
  listItem: {
    position: 'relative',
  },
  listItemName: {
    marginTop: 8,
    marginBottom: 12
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
  ...baseStyles
});