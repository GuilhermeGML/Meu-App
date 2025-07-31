import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Third'>;

type Developer = {
  id: string;
  nome: string;
  email: string;
  dateOfBirth: string;
};

const Third: React.FC<Props> = ({ navigation }) => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = () => {
    setLoading(true);
    fetch('http://192.168.100.24:3000/developers')
      .then((response) => response.json())
      .then((data) => {
        setDevelopers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar desenvolvedores:', error);
        setLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    fetch(`http://192.168.100.24:3000/developers/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao deletar desenvolvedor');
        }
        setDevelopers((prev) => prev.filter((dev) => dev.id !== id));
        setDeletingId(null);
      })
      .catch((error) => {
        console.error(error);
        setDeletingId(null);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Third Screen</Text>
      <Text style={styles.subtitle}>Bem-vindo à terceira página!</Text>

      <Text style={styles.listTitle}>Cadastros Feitos:</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2d5016" />
      ) : (
        <FlatList
          data={developers}
          keyExtractor={(item) => item.id}
          style={{ width: '30%' }}
          contentContainerStyle={developers.length === 0 ? styles.flatListEmpty : undefined}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#555' }}>Nenhum desenvolvedor cadastrado.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.devCard}>
              <Text style={styles.devText}>👤 {item.nome}</Text>
              <Text style={styles.devText}>📧 {item.email}</Text>
              <Text style={styles.devText}>🎂 {item.dateOfBirth}</Text>
              <View style={styles.buttonInsideCard}>
                <Button
                  title={deletingId === item.id ? 'Deletando...' : 'Deletar'}
                  onPress={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  color="#b22222"
                />
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
        <View style={styles.buttonSpacing} />
        <Button title="Ir para Segunda Página" onPress={() => navigation.navigate('Second')} />
      </View>
    </View>
  );
};

export default Third;

const styles = StyleSheet.create({
  container: {
    flex: 1, // importante para ocupar tela inteira e permitir scroll
    padding: 20,
    backgroundColor: '#f0f8e8',
    alignItems: 'center', // centraliza horizontalmente
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d5016',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a7c2a',
    textAlign: 'center',
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#2d5016',
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  devCard: {
    backgroundColor: '#d9f2d9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center', // centraliza conteúdo do card
    width: '100%',
  },
  devText: {
    fontSize: 16,
    color: '#2a4d14',
    marginBottom: 4,
    textAlign: 'center',
  },
  buttonInsideCard: {
    marginTop: 8,
    width: '60%',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonSpacing: {
    height: 10,
  },
});
