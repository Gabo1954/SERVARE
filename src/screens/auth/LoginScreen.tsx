import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native'; // Añadir Text
import { globalStyles } from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    const mockUser = { role: 'admin' };
    navigation.reset({
      index: 0,
      routes: [{ name: 'Admin' }]
    });
  };

  return (
    <View style={globalStyles.container}>
      <TextInput
        style={globalStyles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#5BBFBA"
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#5BBFBA"
      />

      <TouchableOpacity
        style={globalStyles.buttonPrimary}
        onPress={handleLogin}
      >
        <Text style={globalStyles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;