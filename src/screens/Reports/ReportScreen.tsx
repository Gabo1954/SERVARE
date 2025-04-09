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
    navigation.navigate("FichaReport"); // Ruta para reportes de tipo Ficha,Remplazar con la ruta que estamos usasndo pra ello
  };

  const goToGraficoReport = () => {
    navigation.navigate("GraficoReport"); // Ruta para reportes de tipo Gráfico,Remplazar con la ruta que estamos usasndo pra ello
  };

  const goToExcelReport = () => {
    navigation.navigate("ExcelReport"); // Ruta para reportes de tipo Excel,Remplazar con la ruta que estamos usasndo pra ello
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
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <TouchableOpacity style={styles.profileButton} onPress={goToProfile}>
          <Ionicons name="person-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

    
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.squareButton} onPress={goToFichaReport}>
          <MaterialCommunityIcons name="file-document-outline" size={30} color="white" />
          <Text style={styles.buttonText}>Ficha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton} onPress={goToGraficoReport}>
          <MaterialCommunityIcons name="chart-line" size={30} color="white" />
          <Text style={styles.buttonText}>Gráfico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton} onPress={goToExcelReport}>
          <MaterialCommunityIcons name="microsoft-excel" size={30} color="white" />
          <Text style={styles.buttonText}>Excel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReportScreen;

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
  profileButton: {
   
  },
  buttonsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
   
  },
  squareButton: {
    backgroundColor: "#4D92AD",
    width: "30%", 
    aspectRatio: 1,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
