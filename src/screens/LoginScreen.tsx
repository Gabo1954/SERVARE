<<<<<<< HEAD
// LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from "react-native";
=======
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
<<<<<<< HEAD
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    try {
      const storedUser = await AsyncStorage.getItem("usuario");
      if (storedUser) {
        let userData;
        try {
          userData = JSON.parse(storedUser);
        } catch (error) {
          Alert.alert("Error", "Error al leer los datos del usuario");
          return;
        }

        const { email: storedEmail, password: storedPassword, role } = userData;
        if (email === storedEmail && password === storedPassword) {
          Alert.alert("Bienvenido", `Has iniciado sesión como ${role}`);
=======
    if (!email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const storedUserStr = await AsyncStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        const { email: storedEmail, password: storedPassword, role } = storedUser;

        if (email === storedEmail && password === storedPassword) {
          Alert.alert("Bienvenido", `Has iniciado sesión como ${role}`);

          // Redirigir según el rol
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
          switch (role) {
            case "admin":
              navigation.navigate("AdminDashboard");
              break;
            case "lider":
              navigation.navigate("LeaderDashboard");
              break;
<<<<<<< HEAD
            default:
              navigation.navigate("UserDashboard");
=======
            case "usuario":
              navigation.navigate("UserDashboard");
              break;
            default:
              Alert.alert("Error", "Rol de usuario no reconocido");
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
          }
        } else {
          Alert.alert("Error", "Correo o contraseña incorrectos");
        }
      } else {
        Alert.alert("Error", "No hay usuarios registrados");
      }
    } catch (error) {
<<<<<<< HEAD
      Alert.alert("Error", "No se pudo iniciar sesión");
=======
      console.error(error);
      Alert.alert("Error", "Ocurrió un error al iniciar sesión");
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.welcomeText}>Bienvenido</Text>
=======
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.welcomeText}>Bienvenido</Text>

>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="white" style={styles.icon} />
        <TextInput
          placeholder="Correo"
          placeholderTextColor="#ccc"
          style={styles.input}
          keyboardType="email-address"
<<<<<<< HEAD
          autoCapitalize="none"
=======
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
          value={email}
          onChangeText={setEmail}
        />
      </View>
<<<<<<< HEAD
=======

>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={24} color="white" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          style={styles.input}
          secureTextEntry
<<<<<<< HEAD
          autoCapitalize="none"
=======
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
          value={password}
          onChangeText={setPassword}
        />
      </View>
<<<<<<< HEAD
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.7}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <Text style={styles.registerPrompt}>¿No tiene una cuenta?</Text>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")} activeOpacity={0.7}>
=======

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.registerPrompt}>¿No tienes una cuenta?</Text>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
        <Text style={styles.registerButtonText}>Crear cuenta</Text>
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
<<<<<<< HEAD
=======
    resizeMode: "contain",
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
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
  loginButton: {
    backgroundColor: "#4D92AD",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerPrompt: {
    color: "white",
    marginTop: 15,
    fontSize: 14,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#5BBFBA",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
<<<<<<< HEAD


=======
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
