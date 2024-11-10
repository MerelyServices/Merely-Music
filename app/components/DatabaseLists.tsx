import React from 'react';

import { ObjectIdMap, Album, Playlist, Artist, Song } from '@/models/database';
import { View, Text, Image, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { Link } from 'expo-router';

import { baseStyles } from '@/constants/Stylesheet';

export function Playlists(
  props: Omit<React.ComponentProps<any>, 'data'> & { data: Playlist[], songs: ObjectIdMap<Song[]> }
) {
  function renderItem(info:ListRenderItemInfo<Playlist>) {
    return (
      <View key={info.item._id.toString()} style={styles.listItem}>
        {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
          <Image style={styles.playlistImage} src={require('../assets/images/playlist.png')}/>
          <Image style={styles.playlistSong} src={require('../assets/images/track.png')}/>
          <Image style={{ ...styles.playlistSong, left:54, opacity:0.6 }} src={require('../assets/images/track.png')}/>
          <Image style={{ ...styles.playlistSong, left:116, opacity:0.4 }} src={require('../assets/images/track.png')}/>
          <Text>{info.item.name}</Text>
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
          <Image style={styles.artworkImage} src={require('../assets/images/album.png')}/>
          <Text>{info.item.name}</Text>
          <Text>{props.artists[info.item.artist.toString()].name}</Text>
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
  playlistImage: {
    width: 256,
    height: 192,
  },
  playlistSong: {
    position: 'absolute',
    left: 8,
    top: 50,
    opacity: 0.8,
  },
  artworkImage: {
    width: 192,
    height: 192,
  },
  ...baseStyles
});