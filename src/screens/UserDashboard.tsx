import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../styles/globalStyles";

type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, "UserDashboard">;

interface Props {
  navigation: UserScreenNavigationProp;
}

const UserDashboard: React.FC<Props> = ({ navigation }) => {
  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      Alert.alert("Cierre de sesión", "Has cerrado sesión correctamente");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión");
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Ícono de usuario */}
      <Icon name="account" size={60} color="#fff" style={{ marginBottom: 10 }} />
      
      <Text style={globalStyles.title}>Panel de Usuario</Text>
      <Text style={globalStyles.description}>Accede a los formularios y reportes asignados.</Text>

      {/* Botón para ir a Home */}
      <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Home")}>
        <Icon name="home" size={20} color="#fff" />
        <Text style={globalStyles.buttonText}>Volver a Home</Text>
      </TouchableOpacity>

      {/* Botón para ir a la pantalla de creación de formularios */}
      <TouchableOpacity style={[globalStyles.button, { backgroundColor: "#5A9EC9" }]} onPress={() => navigation.navigate("FormBuilderScreen")}>
        <Icon name="file-document-edit" size={20} color="#fff" />
        <Text style={globalStyles.buttonText}>Crear Formulario</Text>
      </TouchableOpacity>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={[globalStyles.button, { backgroundColor: "#DC3545" }]} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={globalStyles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserDashboard;
