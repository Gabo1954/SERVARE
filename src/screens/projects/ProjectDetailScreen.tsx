import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView,Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
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

const ProjectDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { projectId } = route.params;

  useEffect(() => {
    const loadProject = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('projects');
        if (storedProjects) {
          const projects: Project[] = JSON.parse(storedProjects);
          const foundProject = projects.find(p => p.id === projectId);
          if (foundProject) {
            setProject(foundProject);
            setEditedProject(foundProject);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading project:', error);
        setLoading(false);
      }
    };
    
    loadProject();
  }, [projectId]);

  const handleSave = async () => {
    if (!editedProject?.name || !editedProject.description) {
      Alert.alert('Error', 'Nombre y descripción son obligatorios');
      return;
    }

    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        const projects: Project[] = JSON.parse(storedProjects);
        const updatedProjects = projects.map(p => 
          p.id === projectId ? editedProject : p
        );
        await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
        setProject(editedProject);
        setIsEditing(false);
        Alert.alert('Éxito', 'Proyecto actualizado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el proyecto');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4D92AD" />
      </View>
    );
  }

  if (!project || !editedProject) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Proyecto no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{project.name}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.buttonText}>
              {isEditing ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="title" size={24} color="white" style={styles.icon} />
          <TextInput
            placeholder="Nombre del proyecto"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={editedProject.name}
            onChangeText={(text) => setEditedProject({...editedProject, name: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="document-text" size={24} color="white" style={styles.icon} />
          <TextInput
            placeholder="Descripción"
            placeholderTextColor="#ccc"
            style={[styles.input, styles.multilineInput]}
            value={editedProject.description}
            onChangeText={(text) => setEditedProject({...editedProject, description: text})}
            editable={isEditing}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="flag" size={24} color="white" style={styles.icon} />
          <TextInput
            placeholder="Estado"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={editedProject.status}
            onChangeText={(text) => setEditedProject({...editedProject, status: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="date-range" size={24} color="white" style={styles.icon} />
          <TextInput
            placeholder="Fecha de inicio (YYYY-MM-DD)"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={editedProject.startDate}
            onChangeText={(text) => setEditedProject({...editedProject, startDate: text})}
            editable={isEditing}
          />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#1E3A47',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  editButton: {
    backgroundColor: '#4D92AD',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    height: 50,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingVertical: 15,
  },
  saveButton: {
    backgroundColor: '#5BBFBA',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProjectDetailScreen;