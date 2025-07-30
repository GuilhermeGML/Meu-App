import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Pokemon'>;

const Pokemon: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokemon Screen</Text>
      <Text style={styles.subtitle}>Welcome to the Pokemon page!</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Home Screen"
          onPress={() => navigation.navigate('Home')}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="Go to Second Screen"
          onPress={() => navigation.navigate('Second')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8e8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d5016',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#4a7c2a',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacing: {
    height: 15,
  },
});

export default Third;
