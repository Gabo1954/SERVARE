import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  employees: string[]; 
}

interface Employee {
  id: string;
  name: string;
  position: string;
  status: string;
  startDate: string;
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'ProjectManager'>;
}

const ProjectManager = ({ navigation }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Crear nuevo proyecto
  const createProject = async () => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: 'Nuevo Proyecto',
      description: 'Descripción del proyecto',
      status: 'Activo',
      startDate: new Date().toISOString().split('T')[0],
      employees: [] // Ningún empleado asignado inicialmente
    };
    
    try {
      const updatedProjects = [...projects, newProject];
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  // Cargar proyectos desde AsyncStorage
  const loadProjects = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  // Cargar empleados desde AsyncStorage
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

  // Asignar empleado a proyecto
  const assignEmployeeToProject = async (employeeId: string) => {
    if (!selectedProjectId) return;

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          employees: [...project.employees, employeeId] // Añadimos el empleado al proyecto
        };
      }
      return project;
    });

    try {
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      setModalVisible(false); // Cerrar modal después de asignar
    } catch (error) {
      console.error('Error assigning employee to project:', error);
    }
  };

  // Cargar proyectos y empleados cuando el componente se monta
  useEffect(() => {
    loadProjects();
    loadEmployees();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuButton}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.logoContainer}>
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        </TouchableOpacity>
      </View>

      {/* Listado de proyectos */}
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              setSelectedProjectId(item.id);
              setModalVisible(true);
            }}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
            <Text style={styles.projectStatus}>{item.status}</Text>
            <Text style={styles.projectDate}>Inicio: {item.startDate}</Text>
          </TouchableOpacity>
        )}
      />
      
      {/* Botón flotante para crear proyecto */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={createProject}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para asignar empleados a proyectos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un empleado</Text>
            <FlatList
              data={employees}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => assignEmployeeToProject(item.id)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#1E1E1E',
    width: '100%',
  },
  menuButton: {
    position: 'absolute',
    left: 15,
    top: 40,
    padding: 5,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: '80%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  listItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  listItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectStatus: {
    color: '#4D92AD',
    fontSize: 14,
    marginTop: 5,
  },
  projectDate: {
    color: '#7A9EB1',
    fontSize: 12,
    marginTop: 3,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default ProjectManager;
