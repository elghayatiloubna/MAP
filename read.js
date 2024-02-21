import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { StyleSheet } from 'react-native';
import { Entypo, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

// Importez vos images
import walkIcon from './images/walkIcon.jpg';
import leftTurnIcon from './images/leftTurnIcon.jpg';
import rightTurnIcon from './images/rightTurnIcon.jpg';
import roundaboutExitIcon from './images/roundaboutExitIcon.jpg';
import arriveIcon from './images/arriveIcon.jpg';

const actionIcons = {
  depart: walkIcon,
  turn: {
    left: leftTurnIcon,
    right: rightTurnIcon,
  },
  roundaboutExit: roundaboutExitIcon,
  arrive: arriveIcon,
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingRight:10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 17,
    backgroundColor: '#508DA7'
  },
  back:{
    backgroundColor: '#508DA7',
  },
  image: {
    width: 320,
    height: 320,
  },
  timeText: {
    marginBottom:60,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

function formatDuree(seconde) {
  const heures = Math.floor(seconde / 3600);
  const minutes = Math.floor((seconde % 3600) / 60);
  const secondes = seconde % 60;

  const dureeFormattee = `${heures}h ${minutes}m ${secondes}s`;
  return dureeFormattee;
}

const Read = () => {
  const [instructions, setInstructions] = useState([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  useEffect(() => {
    const backendURL = 'http://localhost:3000';
    const fetchInstructions = async () => {
      try {
        const response = await fetch(`${backendURL}/getRouteInstructions`);
        const data = await response.json();
        setInstructions(data.instructions);
        // Lancer la première instruction automatiquement dès l'ouverture de la page
        speakInstruction(0);
      } catch (error) {
        console.error('Erreur lors de la récupération des instructions :', error);
      }
    };

    fetchInstructions();
  }, []);

  useEffect(() => {
    const speakNextInstruction = () => {
      if (currentInstructionIndex < instructions.length) {
        const instruction = instructions[currentInstructionIndex];
        Speech.speak(instruction.instruction, {
          language: 'ar',
          inProgress: false,
          paused: false,
          pitch: 1,
          rate: 1,
          onDone: () => {
            setCurrentInstructionIndex((prevIndex) => prevIndex + 1);
          },
        });
      }
    };

    speakNextInstruction();
  }, [currentInstructionIndex, instructions]);

  const getTurnIcon = (direction) => {
    return direction === 'left' ? actionIcons.turn.left : actionIcons.turn.right;
  };

  return (
    <View style={styles.container}>
      {currentInstructionIndex < instructions.length && (
        <View>
          <Text style={styles.timeText}>{ formatDuree(instructions[currentInstructionIndex].duration)} <AntDesign name="clockcircleo" size={40} color="black" /></Text>
          <Image
            source={ instructions[currentInstructionIndex].direction
              ? actionIcons.turn[instructions[currentInstructionIndex].direction]
              : actionIcons[instructions[currentInstructionIndex].action]}
            style={styles.image}
          />
        </View>
      )}
    </View>
  );
};

export default Read;
