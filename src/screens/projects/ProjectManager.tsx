import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Project {
  id: string;
  name: string;
  forms: string[];
}

interface Props {
  navigation: NavigationProp<RootStackParamList, 'ProjectManager'>;
}

const ProjectManager = ({ navigation }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const createProject = async () => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: 'Nuevo Proyecto',
      forms: []
    };
    await AsyncStorage.setItem(newProject.id, JSON.stringify(newProject));
    setProjects(prev => [...prev, newProject]);
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const projectKeys = keys.filter(k => k.startsWith('project_'));
        const projectsData = await AsyncStorage.multiGet(projectKeys);
        const validProjects = projectsData
          .filter(([_, value]) => value !== null)
          .map(([key, value]) => JSON.parse(value!) as Project);
        setProjects(validProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, []);

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.listItem}
            onPress={() => navigation.navigate('FormBuilder', { projectId: item.id })}
          >
            <Text style={globalStyles.listItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity
        style={globalStyles.floatingButton}
        onPress={createProject}
      >
        <Text style={globalStyles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectManager;