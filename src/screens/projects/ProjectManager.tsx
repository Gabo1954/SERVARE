import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  forms: string[];
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'ProjectManager'>;
}

const ProjectManager = ({ navigation }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const createProject = async () => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: 'Nuevo Proyecto',
      description: 'Descripción del proyecto',
      status: 'Activo',
      startDate: new Date().toISOString().split('T')[0],
      forms: []
    };
    
    try {
      const updatedProjects = [...projects, newProject];
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

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

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
            <Text style={styles.projectStatus}>{item.status}</Text>
            <Text style={styles.projectDate}>Inicio: {item.startDate}</Text>
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={createProject}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos se mantienen iguales

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
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
});

export default ProjectManager;