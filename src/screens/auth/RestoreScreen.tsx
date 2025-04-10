import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Image 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

const RestoreScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleRestore = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Ingresa tu correo electrónico");
      return;
    }

    Alert.alert(
      "Enlace enviado",
      `Se ha enviado un enlace de recuperación a ${email}`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo clickeable: al presionarlo se redirige a la pantalla de Login */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Recuperar Contraseña</Text>
      
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#5BBFBA" />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRestore}>
        <Text style={styles.buttonText}>Enviar enlace</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkContainer}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.linkText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "80%",            // El logo ocupará el 80% del ancho del contenedor
    aspectRatio: 300 / 360,   // Mantiene la relación de aspecto original (ancho / alto)
    resizeMode: "contain",
    marginBottom: "5%",       // Espacio adaptable debajo del logo
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "7%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    paddingHorizontal: "5%",
    marginBottom: "5%",
    borderWidth: 1,
    borderColor: "#4D92AD",
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    color: "white",
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#5BBFBA",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
    width: "100%",
  },
  buttonText: {
    color: "#1E3A47",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: "5%",
    alignItems: "center",
  },
  linkText: {
    color: "#5BBFBA",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default RestoreScreen;
