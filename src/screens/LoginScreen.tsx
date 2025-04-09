import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from "react-native";
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
    if (!email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const { email: storedEmail, password: storedPassword, role } = JSON.parse(storedUser);
        if (email === storedEmail && password === storedPassword) {
          Alert.alert("Bienvenido", `Has iniciado sesión como ${role}`);

          // Redirigir según el rol del usuario
          if (role === "admin") {
            navigation.navigate("AdminDashboard");
          } else if (role === "lider") {
            navigation.navigate("LeaderDashboard");
          } else {
            navigation.navigate("UserDashboard");
          }
        } else {
          Alert.alert("Error", "Correo o contraseña incorrectos");
        }
      } else {
        Alert.alert("Error", "No hay usuarios registrados");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      {/* Espacio para la imagen */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.welcomeText}>Bienvenido</Text>

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

      {/* Botón de Login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Texto "¿No tiene una cuenta?" */}
      <Text style={styles.registerPrompt}>¿No tiene una cuenta?</Text>

      {/* Botón para crear cuenta */}
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
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
