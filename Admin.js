// Admin.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

const Admin = () => {
  const [placeName, setPlaceName] = useState('');
  const [locationLink, setLocationLink] = useState('');

  const handleSavePlace = () => {
    // Vous pouvez ajouter ici la logique pour sauvegarder les données du formulaire
    // par exemple, les envoyer à un serveur, les stocker localement, etc.
    console.log('Nom de la place:', placeName);
    console.log('Lien de localisation:', locationLink);

    // Réinitialiser les champs après la sauvegarde
    setPlaceName('');
    setLocationLink('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choix de place</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom de la place"
          value={placeName}
          onChangeText={(text) => setPlaceName(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Lien de localisation"
          value={locationLink}
          onChangeText={(text) => setLocationLink(text)}
        />

        <Button title="Enregistrer la place" onPress={handleSavePlace} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default Admin;
