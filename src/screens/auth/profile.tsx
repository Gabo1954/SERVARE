import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, "Profile">;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalUserData, setOriginalUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
    ocupacion: "",
    role: "",
    empresa: ""
  });
  
  const [userData, setUserData] = useState({ ...originalUserData });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const user = {
          nombre: parsedUser.nombre || "",
          apellido: parsedUser.apellido || "",
          email: parsedUser.email || "",
          telefono: parsedUser.telefono || "",
          pais: parsedUser.pais || "",
          ocupacion: parsedUser.ocupacion || "",
          role: parsedUser.role || "",
          empresa: parsedUser.empresa || ""
        };
        setUserData(user);
        setOriginalUserData(user);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del usuario");
    }
  };

  const handleEdit = () => {
    if (!isEditing) {
      setOriginalUserData(userData);
    } else {
      setUserData(originalUserData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!userData.nombre || !userData.apellido) {
      Alert.alert("Error", "Nombre y apellido son obligatorios");
      return;
    }

    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la información");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.titleText}>Mi Perfil</Text>

        {/* Botón de Editar/Cancelar */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Text>
        </TouchableOpacity>

        {/* Campos del perfil */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="white" style={styles.icon} />
          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={userData.nombre}
            onChangeText={(text) => setUserData({ ...userData, nombre: text })}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="user-o" size={20} color="white" style={styles.icon} />
          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={userData.apellido}
            onChangeText={(text) => setUserData({ ...userData, apellido: text })}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="white" style={styles.icon} />
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={userData.email}
            editable={false}  // El correo está siempre bloqueado
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="phone-portrait" size={22} color="white" style={styles.icon} />
          <TextInput
            placeholder="Teléfono"
            placeholderTextColor="#ccc"
            style={styles.input}
            keyboardType="phone-pad"
            value={userData.telefono}
            onChangeText={(text) => setUserData({ ...userData, telefono: text })}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="earth" size={24} color="white" style={styles.icon} />
          <TextInput
            placeholder="País"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={userData.pais}
            onChangeText={(text) => setUserData({ ...userData, pais: text })}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="work" size={24} color="white" style={styles.icon} />
          <TextInput
            placeholder="Ocupación"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={userData.ocupacion}
            onChangeText={(text) => setUserData({ ...userData, ocupacion: text })}
            editable={isEditing}
          />
        </View>

        {userData.role === "clienteInstitucion" && (
          <View style={styles.inputContainer}>
            <MaterialIcons name="business" size={24} color="white" style={styles.icon} />
            <TextInput
              placeholder="Empresa"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={userData.empresa}
              onChangeText={(text) => setUserData({ ...userData, empresa: text })}
              editable={isEditing}
            />
          </View>
        )}

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "contain",
    marginBottom: 40,
  },
  titleText: {
    fontSize: 24,
    color: "white",
    marginBottom: 30,
    fontWeight: "bold",
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
  editButton: {
    backgroundColor: "#4D92AD",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#5BBFBA",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
