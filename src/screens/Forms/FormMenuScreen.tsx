import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Navigation typing
type NavigationProp = StackNavigationProp<RootStackParamList, "FormMenu">;
const { width, height } = Dimensions.get("window");
const FormMenuScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const goToProfile = () => {
    setMenuVisible(false);
    navigation.navigate("ProfileScreen");
  };

  const goToCreateForm = () => {
    navigation.navigate("FormBuilderScreen", {
      formToEdit: null, // <-- navegación correcta
    });
  };

  const goToViewForms = () => {
    navigation.navigate("FormScreen");
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
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
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
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={goToCreateForm}
        >
          <Text style={styles.buttonText}>Crear nuevo formulario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={goToViewForms}
        >
          <Text style={styles.buttonText}>Ver formularios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#1E3A47",
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
  buttonSecondary: {
    backgroundColor: "#5BBFBA",
  },
});
