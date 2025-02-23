import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Drawer } from 'react-native-paper';

// Definir el tipo de navegación para AdminDashboard
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminDashboard'>;

interface Props {
  navigation: AdminScreenNavigationProp;
}

const AdminDashboard: React.FC<Props> = ({ navigation }) => {
  const [selectedScreen, setSelectedScreen] = useState('Home');

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    Alert.alert("Cierre de sesión", "Has cerrado sesión correctamente");
    navigation.replace("Login");
  };

  const sections = [
    { id: '1', title: 'Formularios', icon: 'file-document-outline' },
    { id: '2', title: 'Reportes', icon: 'chart-bar' },
    { id: '3', title: 'Usuarios', icon: 'account-group-outline' },
    { id: '4', title: 'Configuración', icon: 'cog-outline' },
  ];

  return (
    <View style={styles.container}>
      {/* Menú lateral */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Admin Panel</Text>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={styles.menuItem}
            onPress={() => setSelectedScreen(section.title)}
          >
            <Icon name={section.icon} size={24} color="#fff" />
            <Text style={styles.menuText}>{section.title}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.menuText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Principal */}
      <View style={styles.content}>
        {selectedScreen === 'Home' && (
          <View>
            <Text style={styles.title}>Bienvenido, Administrador</Text>
            <Text style={styles.subtitle}>Resumen del Sistema</Text>
            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Icon name="file-document-outline" size={40} color="#007bff" />
                <Text style={styles.metricNumber}>20</Text>
                <Text>Formularios</Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="chart-bar" size={40} color="#28a745" />
                <Text style={styles.metricNumber}>15</Text>
                <Text>Reportes</Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="account-group-outline" size={40} color="#ff9800" />
                <Text style={styles.metricNumber}>5</Text>
                <Text>Usuarios</Text>
              </View>
            </View>
          </View>
        )}

        {selectedScreen !== 'Home' && (
          <View>
            <Text style={styles.title}>{selectedScreen}</Text>
            <Text style={styles.subtitle}>Aquí verás {selectedScreen.toLowerCase()}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#f5f5f5' },
  sidebar: { width: 250, backgroundColor: '#007bff', padding: 20, alignItems: 'flex-start' },
  sidebarTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuText: { color: '#fff', fontSize: 16, marginLeft: 10 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginTop: 30 },
  
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 20 },
  
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  metricCard: { backgroundColor: '#fff', padding: 20, borderRadius: 8, alignItems: 'center', width: 100, elevation: 3 },
  metricNumber: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
});

export default AdminDashboard;
