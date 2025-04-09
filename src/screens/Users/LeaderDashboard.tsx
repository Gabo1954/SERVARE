import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, "LeaderDashboard">;

const { width, height } = Dimensions.get("window");

const LeaderDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const goToProfile = () => {
    setMenuVisible(false);
    navigation.navigate("Profile");
  };

  const handleLogout = async () => {
    // Eliminar el estado del usuario y el rol en AsyncStorage
    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("user"); // Asumiendo que el estado del usuario también se guarda aquí.

    setMenuVisible(false);
    // Redirigir al login
    navigation.replace("Login");
  };

  const goToForms = () => navigation.navigate("FormBuilderScreen");
  const goToReports = () => navigation.navigate("ReportScreen");
  const goToTeam = () => navigation.navigate("TeamScreen");
  const goToContact = () => navigation.navigate("ContactScreen");

  return (
    <View style={styles.container}>
      {/* Header con Logo y Menú */}
      <View style={styles.header}>
        {/* Menú desplegable */}
        <View>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Logo centrado */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        {/* Espacio vacío para alinear */}
        <View style={{ width: 30 }} />
      </View>

      {/* Modal del Menú */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={goToProfile}>
              <Ionicons name="person" size={24} color="black" />
              <Text style={styles.menuText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="black" />
              <Text style={styles.menuText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Botones principales */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.squareButton} onPress={goToForms}>
          <Text style={styles.buttonText}>Formularios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton} onPress={goToReports}>
          <Text style={styles.buttonText}>Reportes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton} onPress={goToTeam}>
          <Text style={styles.buttonText}>Equipo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={goToContact}
        >
          <Text style={styles.buttonText}>Contáctanos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LeaderDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: "contain",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menu: {
    backgroundColor: "white",
    paddingVertical: 10,
    width: width * 0.5,
    borderRadius: 10,
    marginTop: height * 0.08,
    marginLeft: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
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
