import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ExcelReport = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reportes en Excel</Text>
      <View style={styles.buttonContainer}>
        {/* Añadir navegacion aun */}
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Materiales</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Alteraciones</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Incidencia</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Extensión</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Estado de Conservación</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Vulnerabilidad Mat/Alt</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Factores de Riesgo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Dinámica del Deterioro</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Condiciones Ambientales</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Condiciones Externas</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Tabla de Historial de Intervenciones</Text></TouchableOpacity>
      </View>
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
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
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

export default ExcelReport;