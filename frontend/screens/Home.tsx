import React, { useState, useCallback, useMemo } from 'react';
import { Button, Dimensions, Platform, StyleSheet, Text, TextInput, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

const Home: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [cadastroFeito, setCadastroFeito] = useState(false);
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get('window');

  // URL base do seu backend - ajuste conforme necessário
  const API_BASE_URL = 'http://192.168.100.24:3000';

  // Memoizar a idade calculada para evitar recálculos desnecessários
  const idade = useMemo(() => {
    if (dateOfBirth && cadastroFeito) {
      return calcularIdade(dateOfBirth);
    }
    return null;
  }, [dateOfBirth, cadastroFeito]);

  // Validação otimizada dos campos
  const isFormValid = useMemo(() => {
    return nome.trim().length > 0 && 
           email.trim().length > 0 && 
           dateOfBirth.trim().length > 0 &&
           email.includes('@');
  }, [nome, email, dateOfBirth]);

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
        email: email.trim().toLowerCase(),
        dateOfBirth: dateOfBirth.trim()
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
        
        // Limpar campos após sucesso (opcional)
        // setNome('');
        // setEmail('');
        // setDateOfBirth('');
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
  }, [nome, email, dateOfBirth, isFormValid, API_BASE_URL]);

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
        style={[styles.textoInput, !dateOfBirth.trim() && styles.inputError]}
        placeholder="Data de nascimento (YYYY-MM-DD)"
        onChangeText={setDateOfBirth}
        value={dateOfBirth}
        editable={!loading}
        returnKeyType="next"
        maxLength={10}
      />
      
      <TextInput
        style={[styles.textoInput, (!email.trim() || !email.includes('@')) && styles.inputError]}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        editable={!loading}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={handleCadastro}
      />

      <View style={styles.buttonContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cadastrando...</Text>
          </View>
        ) : (
          <Button 
            title="Cadastrar" 
            onPress={handleCadastro} 
            disabled={!isFormValid}
          />
        )}
      </View>

      {cadastroFeito && idade !== null && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            ✅ Cadastro realizado com sucesso!{"\n"}
            Bem-vindo, {nome}!{"\n"}
            Idade: {idade} anos{"\n"}
            Email: {email}
          </Text>
        </View>
      )}

      <View style={styles.navigationButtons}>
        <Button title="Segunda Página" onPress={() => navigation.navigate('Second')} />
        <View style={{ height: 10 }} />
        <Button title="Terceira Página" onPress={() => navigation.navigate('Third')} />
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
});
