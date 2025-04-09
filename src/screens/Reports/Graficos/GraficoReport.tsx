import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'GraficoReport'>;

const GraficoReport: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas Globales</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('ClientListReport')}
      >
        <Text style={styles.buttonText}>Lista de Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('SalesReport')}
      >
        <Text style={styles.buttonText}>Ventas</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('PlansReport')}
      >
        <Text style={styles.buttonText}>Planes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#1E3A47',
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B2D45',
  },
});

export default GraficoReport;