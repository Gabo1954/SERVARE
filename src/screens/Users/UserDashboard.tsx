import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image,Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, "UserDashboard">;
const { width, height } = Dimensions.get("window");
const UserDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const goToProfile = () => {
    setMenuVisible(false);
    navigation.navigate("Profile");
  };

  const goToForms = () => navigation.navigate("FormMenu");
  const goToReports = () => navigation.navigate("ReportScreen");
  const goToContact = () => navigation.navigate("ContactScreen");

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // Elimina el usuario y el rol
    await AsyncStorage.removeItem("userRole"); // Elimina el rol guardado
    setMenuVisible(false);
    navigation.navigate("Login"); // Redirige al Login
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Image source={require("../../assets/images/Logo1.png")} style={styles.logo} />
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
        <TouchableOpacity style={styles.squareButton} onPress={goToForms}>
          <Text style={styles.buttonText}>Formularios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton} onPress={goToReports}>
          <Text style={styles.buttonText}>Reportes</Text>
        </TouchableOpacity>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#1E3A47",
  },
  menuButton: {
    padding: 5,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
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
  },
  squareButton: {
    backgroundColor: "#4D92AD",
    width: "48%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
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

export default UserDashboard;
