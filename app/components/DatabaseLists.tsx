import React from 'react';

import { ObjectIdMap, Album, Playlist, Artist } from '@/models/database';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export function Playlists(
  props: Omit<React.ComponentProps<any>, 'data'> & { data: Playlist[] }
) {
  return props.data.map((playlist) =>
    <View key={playlist._id.toString()}>
      {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
        <Text>{playlist.name}</Text>
      {/*</Link>*/}
    </View>
  );
}

export function Albums(
  props: Omit<React.ComponentProps<any>, 'data'> & { data: Album[], artists: ObjectIdMap<Artist> }
) {
  return props.data.map((album) =>
    <View key={album._id.toString()}>
      {/*<Link href={'/playlist/'+playlist._id.toString()}>*/}
        <Text>{album.name}</Text>
        <Text>{props.artists[album.artist.toString()].name}</Text>
      {/*</Link>*/}
    </View>
  );
}
