import React, { useState, useCallback, useMemo } from 'react';
import { Button, Dimensions, Platform, StyleSheet, Text, TextInput, View, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;



const Home: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [cadastroFeito, setCadastroFeito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sexo, setSexo] = useState<'masculino' | 'feminino'>('masculino');
  const { width, height } = Dimensions.get('window');

  // URL base do seu backend - ajuste conforme necessário
  const API_BASE_URL = 'http://localhost:3000';



  // Validação otimizada dos campos
  const isFormValid = useMemo(() => {
  return nome.trim().length > 0 && 
    cpf.trim().length > 0 &&
    departamento.trim().length > 0 &&
    (sexo === 'masculino' || sexo === 'feminino');
  }, [nome, cpf, departamento, sexo]);

  const handleCadastro = useCallback(async () => {
    if (!isFormValid) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente');
      return;
    }

    setLoading(true);
    
    try {
      // Dados para enviar ao backend
      const developerData = {
        nome: nome.trim(),
        cpf: cpf.trim(),
        departamento: departamento.trim(),
        sexo
      };

      // Controller para timeout da requisição
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      // Requisição POST para o backend com timeout
      const response = await fetch(`${API_BASE_URL}/developers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(developerData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('Desenvolvedor cadastrado:', result);
        
        // Mostrar sucesso imediatamente
        setCadastroFeito(true);
        Alert.alert('Sucesso', 'Desenvolvedor cadastrado com sucesso!');
        
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        console.error('Erro do servidor:', errorData);
        Alert.alert('Erro', `Erro ao cadastrar: ${errorData.message}`);
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      if (error.name === 'AbortError') {
        Alert.alert('Timeout', 'A requisição demorou muito. Tente novamente.');
      } else {
        Alert.alert('Erro', 'Erro de conexão. Verifique sua internet e se o backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  }, [nome, cpf, departamento, isFormValid, API_BASE_URL]);

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.titulo}>Registro de Desenvolvedor</Text>

      <TextInput
        style={[styles.textoInput, !nome.trim() && styles.inputError]}
        placeholder="Digite seu nome"
        onChangeText={setNome}
        value={nome}
        editable={!loading}
        autoCapitalize="words"
        returnKeyType="next"
      />
      
      <TextInput
        style={[styles.textoInput, !cpf.trim() && styles.inputError]}
        placeholder="Digite seu CPF"
        onChangeText={setCpf}
        value={cpf}
        editable={!loading}
        keyboardType="numeric"
        returnKeyType="next"
        maxLength={14}
      />
      
      <TextInput
        style={[styles.textoInput, !departamento.trim() && styles.inputError]}
        placeholder="Digite o departamento"
        onChangeText={setDepartamento}
        value={departamento}
        editable={!loading}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="next"
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Text style={{ marginRight: 10 }}>Sexo:</Text>
        <TouchableOpacity
          style={{ backgroundColor: sexo === 'masculino' ? '#2196F3' : '#eee', padding: 10, borderRadius: 5, marginRight: 10 }}
          onPress={() => setSexo('masculino')}
        >
          <Text style={{ color: sexo === 'masculino' ? '#fff' : '#000' }}>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: sexo === 'feminino' ? '#E91E63' : '#eee', padding: 10, borderRadius: 5 }}
          onPress={() => setSexo('feminino')}
        >
          <Text style={{ color: sexo === 'feminino' ? '#fff' : '#000' }}>Feminino</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cadastrando...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[
              styles.cadastrarButton, 
              !isFormValid && styles.cadastrarButtonDisabled
            ]}
            onPress={handleCadastro} 
            disabled={!isFormValid}
          >
            <Text style={[
              styles.cadastrarButtonText,
              !isFormValid && styles.cadastrarButtonTextDisabled
            ]}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {cadastroFeito && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            ✅ Cadastro realizado com sucesso!{"\n"}
            Bem-vindo: {nome}!{"\n"}
            CPF: {cpf} {"\n"}
            Departamento: {departamento}{"\n"}
            Sexo: {sexo === 'masculino' ? 'Masculino' : 'Feminino'}
          </Text>
        </View>
      )}

      <View style={styles.navigationButtons}>
        <Button title="Segunda Página" onPress={() => navigation.navigate('Second')} />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 60,
    backgroundColor: 'lightblue',
  },
  texto: {
    fontSize: 18,
    color: 'purple',
    textAlign: 'center',
    marginTop: 30,
  },
  textoInput: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    width: Platform.select({
      web: '30%',
      android: '80%',
      ios: '80%',
    }),
    padding: 12,
  },
  inputError: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
  },
  titulo: {
    fontSize: 32,
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 20,
    minHeight: 50,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  successText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
  },
  navigationButtons: {
    marginTop: 30,
  },
  cadastrarButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cadastrarButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  cadastrarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cadastrarButtonTextDisabled: {
    color: '#999',
  },
});
