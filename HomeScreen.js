import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sound, setSound] = useState(null); // Déclaration de sound



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission de localisation non accordée');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    // Load and play audio
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/audio1.m4a')
      );
      setSound(sound); // Attribution de la valeur de sound
      await sound.playAsync(); 
    };

    playSound();

    // Nettoyage lors du démontage du composant
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const handleImagePress = (imageSource, location) => {
    navigation.navigate('FST', { imageSource, location });
  };

  const handleImage2Press = () => {
    navigation.navigate('FSSM');
  };

  const handleAdminButtonPress = () => {
    navigation.navigate('Admin');
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Votre emplacement"
          />
        </MapView>
      )}

      {errorMsg && <Text>{errorMsg}</Text>}

      <TouchableOpacity onPress={handleImagePress} style={styles.imageContainer}>
        <Image source={require('./assets/fst.jpg')} style={styles.image} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleImage2Press} style={styles.imageContainer}>
        <Image source={require('./assets/fssm.png')} style={styles.image} />
      </TouchableOpacity>

      {/* Ajouter un bouton pour aller vers Admin.js */}
      <Button title="+" onPress={handleAdminButtonPress} />
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
  map: {
    width: '100 %',
    height: '10%',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default HomeScreen;
