<<<<<<< HEAD
// LeaderDashboard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
=======
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
<<<<<<< HEAD
import { globalStyles } from "../styles/globalStyles";

type LeaderScreenNavigationProp = StackNavigationProp<RootStackParamList, "LeaderDashboard">;

=======
import { globalStyles } from "../styles/globalStyles"; // Importar estilos globales

type LeaderScreenNavigationProp = StackNavigationProp<RootStackParamList, "LeaderDashboard">;
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
interface Props {
  navigation: LeaderScreenNavigationProp;
}

const LeaderDashboard: React.FC<Props> = ({ navigation }) => {
<<<<<<< HEAD
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
=======
  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
      Alert.alert("Cierre de sesión", "Has cerrado sesión correctamente");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Panel de Líder de Equipo</Text>
      <Text style={globalStyles.description}>Supervisa el trabajo del equipo y revisa formularios.</Text>
<<<<<<< HEAD
      <DashboardButton icon="home" text="Volver a Home" color="#f39c12" onPress={() => navigation.navigate("Home")} />
      <DashboardButton icon="file-document-edit" text="Crear Formulario" color="#007bff" onPress={() => navigation.navigate("FormBuilderScreen")} />
=======

      {/* Botón para ir a Home */}
      <DashboardButton icon="home" text="Volver a Home" color="#f39c12" onPress={() => navigation.navigate("Home")} />

      {/* Botón para ir a la pantalla de creación de formularios */}
      <DashboardButton
        icon="file-document-edit"
        text="Crear Formulario"
        color="#007bff"
        onPress={() => navigation.navigate("FormBuilderScreen")}
      />

      {/* Botón de Cerrar Sesión */}
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
      <DashboardButton icon="logout" text="Cerrar Sesión" color="#dc3545" onPress={handleLogout} />
    </View>
  );
};

<<<<<<< HEAD
const DashboardButton = ({ icon, text, color, onPress }: { icon: string; text: string; color: string; onPress: () => void }) => (
  <TouchableOpacity style={[globalStyles.button, { backgroundColor: color }, styles.dashboardButton]} onPress={onPress}>
=======
// Componente reutilizable para botones
const DashboardButton = ({ icon, text, color, onPress }: { icon: string; text: string; color: string; onPress: () => void }) => (
  <TouchableOpacity style={[globalStyles.button, { backgroundColor: color }]} onPress={onPress}>
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
    <Icon name={icon} size={20} color="#fff" style={globalStyles.icon} />
    <Text style={globalStyles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

<<<<<<< HEAD
const styles = StyleSheet.create({
  dashboardButton: { marginVertical: 10 }
});

=======
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
export default LeaderDashboard;
