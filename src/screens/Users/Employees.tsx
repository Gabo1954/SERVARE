import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Alert,Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Employee {
  id: string;
  name: string;
  position: string;
  status: string;
  startDate: string;
}
const { width, height } = Dimensions.get("window");
const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeePosition, setNewEmployeePosition] = useState('');

  const createEmployee = async () => {
    if (!newEmployeeName || !newEmployeePosition) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const newEmployee: Employee = {
      id: `employee_${Date.now()}`,
      name: newEmployeeName,
      position: newEmployeePosition,
      status: 'Activo',
      startDate: new Date().toISOString().split('T')[0],
    };

    try {
      const updatedEmployees = [...employees, newEmployee];
      await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
      setEmployees(updatedEmployees);
      setNewEmployeeName('');
      setNewEmployeePosition('');
      Alert.alert('Éxito', 'Empleado creado correctamente');
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const storedEmployees = await AsyncStorage.getItem('employees');
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del empleado"
        placeholderTextColor="#ccc"
        value={newEmployeeName}
        onChangeText={setNewEmployeeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Posición"
        placeholderTextColor="#ccc"
        value={newEmployeePosition}
        onChangeText={setNewEmployeePosition}
      />
      <TouchableOpacity style={styles.createButton} onPress={createEmployee}>
        <Text style={styles.buttonText}>Crear Empleado</Text>
      </TouchableOpacity>

      <FlatList
        data={employees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeItem}>
            <Text style={styles.employeeText}>{item.name} - {item.position}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A47',
    padding: 20,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginBottom: 15,
    paddingLeft: 15,
    color: 'white',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#5BBFBA',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeItem: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 10,
  },
  employeeText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Employees;
