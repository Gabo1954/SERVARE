import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
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

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ProjectDetail'>;
  route: RouteProp<RootStackParamList, 'ProjectDetail'>;
};

const ProjectDetailScreen: React.FC<Props> = ({ route }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { projectId } = route.params;

  useEffect(() => {
    const loadProject = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('projects');
        if (storedProjects) {
          const projects: Project[] = JSON.parse(storedProjects);
          const foundProject = projects.find(p => p.id === projectId);
          setProject(foundProject || null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading project:', error);
        setLoading(false);
      }
    };
    
    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4D92AD" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Proyecto no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.status}>Estado: {project.status}</Text>
      <Text style={styles.date}>Fecha de inicio: {project.startDate}</Text>
      <Text style={styles.description}>{project.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E3A47',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  status: {
    fontSize: 18,
    color: '#4D92AD',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#7A9EB1',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ProjectDetailScreen;