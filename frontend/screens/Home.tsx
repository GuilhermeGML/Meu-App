import React, { useState } from 'react';
import { Button, Dimensions, Platform, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
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
  const [idade, setIdade] = useState<number | null>(null);
  const { width, height } = Dimensions.get('window');

  const handleCadastro = () => {
    const idadeCalculada = calcularIdade(dateOfBirth);
    setIdade(idadeCalculada);
    setCadastroFeito(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Registro de Desenvolvedor</Text>

      <TextInput
        style={styles.textoInput}
        placeholder="Digite seu nome"
        onChangeText={setNome}
        value={nome}
      />
      <TextInput
        style={styles.textoInput}
        placeholder="Digite sua data de nascimento (YYYY-MM-DD)"
        onChangeText={setDateOfBirth}
        value={dateOfBirth}
      />
      <TextInput
        style={styles.textoInput}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />

      <Button title="Cadastrar" onPress={handleCadastro} />

      {cadastroFeito && idade !== null && (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.texto}>
            Cadastro feito com sucesso!{"\n"}
            Bem-vindo ao site {nome}!{"\n"}
            Data de nascimento: {dateOfBirth}{"\n"}
            Idade: {idade} anos{"\n"}
            Email: {email}
          </Text>
        </View>
      )}

      <View style={{ height: 20 }} />
      <Button title="Segunda Página" onPress={() => navigation.navigate('Second')} />
      <View style={{ height: 10 }} />
      <Button title="Terceira Página" onPress={() => navigation.navigate('Third')} />
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
    borderRadius: 5,
    width: Platform.select({
      web: '30%',
      android: '80%',
      ios: '80%',
    }),
    padding: 10,
  },
  titulo: {
    fontSize: 32,
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },
});
