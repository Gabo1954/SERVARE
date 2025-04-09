import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, "FormMenu">;

const FormMenuScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const goToCreateForm = () => {
    navigation.navigate("CreateForm"); // Remplazar con la ruta que estamos usasndo pra ello
  };

  const goToViewForms = () => {
    navigation.navigate("ViewForms"); // Remplazar con la ruta que estamos usasndo pra ello
  };

  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
      <Image source={require('../../assets/images/Logo1.png')} style={styles.logo} />

        <TouchableOpacity style={styles.profileButton} onPress={goToProfile}>
          <Ionicons name="person-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

     
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={goToCreateForm}>
          <Text style={styles.buttonText}>Crear nuevo formulario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={goToViewForms}>
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
  profileButton: {
   
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
