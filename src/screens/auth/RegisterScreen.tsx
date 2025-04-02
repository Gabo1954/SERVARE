import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>;

type UserRole = 'user' | 'admin' | 'client';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = () => {
    // Lógica de registro con todos los campos
    const userData = {
      email,
      password,
      company,
      role
    };
    console.log('Registrando:', userData);
    
    navigation.navigate('Auth');
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

      <TextInput
        style={globalStyles.input}
        placeholder="Empresa"
        value={company}
        onChangeText={setCompany}
        placeholderTextColor="#5BBFBA"
      />

      <View style={globalStyles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(value) => setRole(value as UserRole)}
          style={globalStyles.picker}
          dropdownIconColor="#1E3A47">
          <Picker.Item label="Usuario" value="user" />
          <Picker.Item label="Administrador" value="admin" />
          <Picker.Item label="Cliente" value="client" />
        </Picker>
      </View>

      <TouchableOpacity
        style={globalStyles.buttonPrimary}
        onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Auth')}>
        <Text style={globalStyles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;