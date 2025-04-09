import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = StackNavigationProp<RootStackParamList, "InstitutionDashboard">;

const InstitutionDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const goToProfile = () => {
    setMenuVisible(false);
    navigation.navigate("Profile");
  };

  const goToProjects = () => navigation.navigate("Projects");
  const goToForms = () => navigation.navigate("FormBuilderScreen");
  const goToReports = () => navigation.navigate("ReportScreen");
  const goToEmployees = () => navigation.navigate("Employees");
  const goToContact = () => navigation.navigate("ContactScreen");

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userRole");
    setMenuVisible(false);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      </View>

      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={goToProfile} style={styles.menuItem}>
            <Ionicons name="person-circle" size={20} color="white" />
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.menuText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.squareButton} onPress={goToProjects}>
            <Text style={styles.buttonText}>Proyectos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squareButton} onPress={goToForms}>
            <Text style={styles.buttonText}>Formularios</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.squareButton} onPress={goToReports}>
            <Text style={styles.buttonText}>Reportes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squareButton} onPress={goToEmployees}>
            <Text style={styles.buttonText}>Empleados</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={goToContact}>
          <Text style={styles.buttonText}>Contáctanos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
    alignItems: "center", // Centra el contenido horizontalmente
  },
  header: {
    flexDirection: "column", // Cambié la dirección a columna para centrar el logo sobre los botones
    alignItems: "center", // Centra el logo horizontalmente
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#1E3A47",
    width: "100%", // Asegura que ocupe todo el ancho
  },
  menuButton: {
    position: "absolute", // Mueve el botón de menú a la esquina superior izquierda
    left: 15,
    top: 40,
    padding: 5,
  },
  logo: {
    width: 80, // Puedes ajustar el tamaño si es necesario
    height: 80,
    resizeMode: "contain",
    marginBottom: 20, // Da espacio entre el logo y los botones
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    left: 15,
    backgroundColor: "#4D92AD",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%", // Asegura que ocupe todo el ancho
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  squareButton: {
    backgroundColor: "#4D92AD",
    width: "48%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 7,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  buttonPrimary: {
    backgroundColor: "#4D92AD",
  },
});

export default InstitutionDashboard;
