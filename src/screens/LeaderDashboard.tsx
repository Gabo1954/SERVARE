// LeaderDashboard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../styles/globalStyles";

type LeaderScreenNavigationProp = StackNavigationProp<RootStackParamList, "LeaderDashboard">;

interface Props {
  navigation: LeaderScreenNavigationProp;
}

const LeaderDashboard: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
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
      <DashboardButton icon="home" text="Volver a Home" color="#f39c12" onPress={() => navigation.navigate("Home")} />
      <DashboardButton icon="file-document-edit" text="Crear Formulario" color="#007bff" onPress={() => navigation.navigate("FormBuilderScreen")} />
      <DashboardButton icon="logout" text="Cerrar Sesión" color="#dc3545" onPress={handleLogout} />
    </View>
  );
};

const DashboardButton = ({ icon, text, color, onPress }: { icon: string; text: string; color: string; onPress: () => void }) => (
  <TouchableOpacity style={[globalStyles.button, { backgroundColor: color }, styles.dashboardButton]} onPress={onPress}>
    <Icon name={icon} size={20} color="#fff" style={globalStyles.icon} />
    <Text style={globalStyles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  dashboardButton: { marginVertical: 10 }
});

export default LeaderDashboard;
