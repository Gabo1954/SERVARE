import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('usuario');
  const [empresa, setEmpresa] = useState('');
  const [isEmpresaEnabled, setIsEmpresaEnabled] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || (isEmpresaEnabled && !empresa)) {
      Alert.alert('Error', 'Todos los campos obligatorios deben ser completados');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const user = { email, password, role, empresa: isEmpresaEnabled ? empresa : '' };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      Alert.alert('Registro exitoso', `Usuario registrado como ${role}`);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>Crear cuenta</Text>


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

        <View style={styles.pickerContainer}>
          <Ionicons name="people" size={24} color="white" style={styles.pickerIcon} />
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
            dropdownIconColor="white"
            mode="dropdown"
          >
            
            <Picker.Item label="Institución" value="clienteInstitucion" color="black" />
            <Picker.Item label="Usuario General" value="clienteUsuario" color="black" />
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => {
            const newValue = !isEmpresaEnabled;
            setIsEmpresaEnabled(newValue);
            if (!newValue) setEmpresa('');
          }}
        >
          <MaterialIcons 
            name={isEmpresaEnabled ? "check-box" : "check-box-outline-blank"} 
            size={24} 
            color="white" 
          />
          <Text style={styles.checkboxLabel}>Registrar como empresa</Text>
        </TouchableOpacity>

        {isEmpresaEnabled && (
          <View style={styles.inputContainer}>
            <MaterialIcons name="business" size={24} color="white" style={styles.icon} />
            <TextInput
              placeholder="Empresa"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={empresa}
              onChangeText={setEmpresa}
              editable={isEmpresaEnabled}
            />
          </View>
        )}


        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>


        <Text style={styles.loginPrompt}>¿Ya tienes una cuenta?</Text>


        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 360,
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
    width: "100%",
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: "white",
    backgroundColor: "transparent",
    height: 50,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    paddingLeft: 10,
  },
  checkboxLabel: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default RegisterScreen;