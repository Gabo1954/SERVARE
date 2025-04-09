import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [text, setText] = React.useState(''); // State para el TextInput

  // Función para manejar el clic del botón
  const handlePress = () => {
    alert('¡Haz hecho clic en el botón!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a mi app!</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Escribe algo aquí"
        value={text}
        onChangeText={setText} // Actualiza el estado cuando el texto cambia
      />
      
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Haz clic aquí</Text>
      </TouchableOpacity>

      <Text style={styles.textOutput}>Texto ingresado: {text}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  textOutput: {
    fontSize: 18,
    color: '#555',
  },
});
