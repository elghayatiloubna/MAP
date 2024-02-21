import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Audio } from 'expo-av';

const ImageScreen2 = ({  route, navigation }) => {
  useEffect(() => {
    // Load and play audio
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/fssm.m4a')
      );
      await sound.playAsync(); 
    };

    playSound();

    return () => {
      // Unload the audio when the component unmounts
      sound.unloadAsync();
    };
  }, []);

  // Fonction à exécuter lorsque le bouton "route" est pressé
  // Fonction à exécuter lorsque le bouton "route" est pressé
  const handleRouteButtonPress = () => {
    navigation.navigate('Read');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 31.649126465206116,
          longitude: -8.01538321669438,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 31.649126465206116, longitude: -8.01538321669438 }}
          title="Emplacement de la place"
        />
      </MapView>
      <Image source={require('./assets/fssm.png')} style={styles.image} />

      {/* Ajouter le bouton "route" */}
      <TouchableOpacity onPress={handleRouteButtonPress} style={styles.routeButton}>
        <Text style={styles.routeButtonText}>Route</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#508DA7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    margin: 30,
  },
  map: {
    width: '100%',
    height: 350,
    marginTop: 30,
  },
  routeButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  routeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageScreen2;
