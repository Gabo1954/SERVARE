// MaterialesReport.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { generateMaterialesExcel } from '../../../components/reports/generateExcelReport';



type NavigationProp = StackNavigationProp<RootStackParamList, "MaterialesReport">;

const MaterialesReport: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [menuVisible, setMenuVisible] = useState(false);
  
    const toggleMenu = () => setMenuVisible(!menuVisible);
  
    const goToProfile = () => {
      setMenuVisible(false);
      navigation.navigate("Profile");
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
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
          <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
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
      

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title}>Tabla de Materiales</Text>
        <TouchableOpacity style={styles.button} onPress={generateMaterialesExcel}>
          <Text style={styles.buttonText}>Descargar Excel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E3A47' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#1E3A47',
    width: '100%',
  },
  menuButton: { position: 'absolute', left: 15, top: 40, padding: 5 },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    left: 15,
    backgroundColor: '#4D92AD',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: 10,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  menuText: { color: 'white', fontSize: 16, marginLeft: 10 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: { color: '#0B2D45', fontSize: 18, fontWeight: 'bold' },
});

export default MaterialesReport;
