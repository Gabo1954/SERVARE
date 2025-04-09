import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, 'ReportScreen'>;

const Tablas: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tablas Excel</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MaterialesReport')}>
        <Text style={styles.buttonText}>Tabla de Materiales</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AlteracionesReport')}>
        <Text style={styles.buttonText}>Tabla de Alteraciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('IncidenciaReport')}>
        <Text style={styles.buttonText}>Tabla de Incidencia</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExtensionReport')}>
        <Text style={styles.buttonText}>Tabla de Extensión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EstadoConservacionReport')}>
        <Text style={styles.buttonText}>Tabla de Estado de Conservación</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VulnerabilidadReport')}>
        <Text style={styles.buttonText}>Tabla de Vulnerabilidad Mat/Alt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FactoresRiesgoReport')}>
        <Text style={styles.buttonText}>Tabla de Factores de Riesgo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DinamicaDeterioroReport')}>
        <Text style={styles.buttonText}>Tabla de Dinámica del Deterioro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CondicionesAmbientalesReport')}>
        <Text style={styles.buttonText}>Tabla de Condiciones Ambientales</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CondicionesExternasReport')}>
        <Text style={styles.buttonText}>Tabla de Condiciones Externas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HistorialIntervencionesReport')}>
        <Text style={styles.buttonText}>Tabla de Historial de Intervenciones</Text>
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

export default Tablas;