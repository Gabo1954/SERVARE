import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = StackNavigationProp<RootStackParamList, "ReportScreen">;

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const goToProfile = () => {
    setMenuVisible(false);
    navigation.navigate("Profile");
  };

  const goToFichaReport = () => {
    navigation.navigate("FichaReport");
  };

  const goToGraficoReport = () => {
    navigation.navigate("GraficoReport");
  };

  const goToExcelReport = () => {
    navigation.navigate("ExcelReport");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userRole");
    setMenuVisible(false);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.logoButton}>
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
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
          <TouchableOpacity style={styles.squareButton} onPress={goToFichaReport}>
            <MaterialCommunityIcons name="file-document-outline" size={30} color="white" />
            <Text style={styles.buttonText}>Ficha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squareButton} onPress={goToGraficoReport}>
            <MaterialCommunityIcons name="chart-line" size={30} color="white" />
            <Text style={styles.buttonText}>Gráfico</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.squareButton} onPress={goToExcelReport}>
            <MaterialCommunityIcons name="microsoft-excel" size={30} color="white" />
            <Text style={styles.buttonText}>Excel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
    alignItems: "center", // Center all content
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#1E3A47",
    width: "100%",
  },
  logoButton: {
    width: 300, // Ajusta el tamaño del logo
    height: 280,
    marginBottom: 20,
  },
  menuButton: {
    position: "absolute",
    left: 15,
    top: 40,
    padding: 5,
  },
  logo: {
    width: "100%", // El logo ocupa todo el ancho del contenedor
    height: undefined, // Mantiene la proporción
    aspectRatio: 1, // Mantiene la proporción original
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
    width: "100%",
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
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ReportScreen;
