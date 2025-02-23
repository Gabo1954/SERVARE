import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const { role } = JSON.parse(storedUser);
          setUserRole(role);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el rol del usuario');
      }
    };

    loadUserRole();
  }, []);

  const quickActions = [
    { id: '1', title: 'Nuevo Formulario', screen: 'Form' },
    { id: '2', title: 'Ver Reportes', screen: 'Reports' },
    { id: '3', title: 'Galería de Fotos', screen: 'Gallery' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Servare</Text>
      <Text style={styles.subtitle}>Rol: {userRole}</Text>

      {/* Accesos Rápidos */}
      <FlatList
        data={quickActions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(item.screen as any)}>
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Opciones Basadas en el Rol */}
      {userRole === 'admin' && (
        <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('AdminDashboard')}>
          <Text style={styles.buttonText}>Panel de Administración</Text>
        </TouchableOpacity>
      )}

      {userRole === 'lider' && (
        <TouchableOpacity style={styles.leaderButton} onPress={() => navigation.navigate('LeaderDashboard')}>
          <Text style={styles.buttonText}>Panel de Líder</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 20 },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, width: '80%', alignItems: 'center', marginBottom: 10 },
  adminButton: { backgroundColor: '#dc3545', padding: 12, borderRadius: 8, width: '80%', alignItems: 'center', marginTop: 10 },
  leaderButton: { backgroundColor: '#ff9800', padding: 12, borderRadius: 8, width: '80%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default HomeScreen;
