import React, { useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Second'>;

const Second: React.FC<Props> = ({ navigation }) => {
  const [selectedGame, setSelectedGame] = useState<'pokemon' | 'magic' | null>(null);

  const handleCardPress = (game: 'pokemon' | 'magic') => {
    setSelectedGame(game);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>Segunda Página</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.card} onPress={() => handleCardPress('pokemon')}>
            <Text style={styles.cardText}>Pokémon TCG</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleCardPress('magic')}>
            <Text style={styles.cardText}>Magic: The Gathering</Text>
          </TouchableOpacity>
        </View>

        {selectedGame === 'pokemon' && (
          <Image
            source={require('../assets/images/pokemon_types.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {selectedGame === 'magic' && (
          <Image
            source={require('../assets/images/magic_colors.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={{ marginTop: 30 }}>
          <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
          <View style={{ height: 10 }} />
          <Button title="Ir para Terceira Página" onPress={() => navigation.navigate('Third')} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  container: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  image: {
    width: 250,
    height: 350,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Second;
