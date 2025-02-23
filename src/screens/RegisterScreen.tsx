import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('usuario'); // Valor por defecto

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const user = { email, password, role };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      Alert.alert('Registro exitoso', `Usuario registrado como ${role}`);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.welcomeText}>Crear cuenta</Text>

      {/* Campo de correo */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="white" style={styles.icon} />
        <TextInput
          placeholder="Correo"
          placeholderTextColor="#ccc"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Campo de contraseña */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={24} color="white" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirmar contraseña */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="white" style={styles.icon} />
        <TextInput
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#ccc"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Selector de rol */}
      <View style={styles.pickerContainer}>
  <Picker
    selectedValue={role}
    onValueChange={(itemValue) => setRole(itemValue)}
    style={styles.picker}
    dropdownIconColor="white"
    mode="dropdown"
  >
    <Picker.Item label="Usuario Básico" value="usuario" color="white" />
    <Picker.Item label="Líder de Equipo" value="lider" color="white" />
    <Picker.Item label="Administrador" value="admin" color="white" />
  </Picker>
</View>

      {/* Botón de Registro */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Texto "¿Ya tienes cuenta?" */}
      <Text style={styles.loginPrompt}>¿Ya tienes una cuenta?</Text>

      {/* Botón para ir al login */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "90%",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    height: 50,
  },
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Fondo oscuro semi-transparente
    borderRadius: 25,
    width: "90%",
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
    overflow: "hidden", // Evita desbordes
  },
  picker: {
    height: 50,
    color: "white", // Forzar el texto en blanco
    backgroundColor: "transparent", // Evita fondo blanco por defecto
  },
  registerButton: {
    backgroundColor: "#5BBFBA",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginPrompt: {
    color: "white",
    marginTop: 15,
    fontSize: 14,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#4D92AD",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
