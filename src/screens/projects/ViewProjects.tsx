import React, { useEffect, useState } from "react";
import { Alert } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = StackNavigationProp<RootStackParamList, "ViewProjects">;

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  employees: string[];
}

const ViewProjects: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const goToProfile = () => {
    setMenuVisible(false);
    navigation.navigate("ProfileScreen");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userRole");
    setMenuVisible(false);
    navigation.navigate("Login");
  };

  const fetchProjects = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem("projects");
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los proyectos");
      setLoading(false);
    }
  };

  const handleDeleteProjects = async () => {
    try {
      await AsyncStorage.removeItem("projects");
      setProjects([]); // Limpiar el estado de los proyectos
      Alert.alert("Proyectos eliminados.");
    } catch (error) {
      Alert.alert("Error al eliminar los proyectos.");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      await AsyncStorage.setItem("projects", JSON.stringify(updatedProjects));
      setProjects(updatedProjects); // Actualizar el estado de proyectos
      Alert.alert("Proyecto eliminado.");
    } catch (error) {
      Alert.alert("Error al eliminar el proyecto.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.projectCard}
      onPress={() => navigation.navigate("ProjectDetail", { projectId: item.id })}
    >
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{item.name}</Text>
        <Text style={[styles.projectStatus, { color: item.status === "Activo" ? "#4D92AD" : "#FF6B6B" }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.projectDescription}>{item.description}</Text>
      <Text style={styles.projectDate}>Inicio: {item.startDate}</Text>

      {/* Botón para eliminar proyecto */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteProject(item.id)}
      >
        <Ionicons name="trash" size={20} color="white" />
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4D92AD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProjects}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={goToProfile} style={styles.menuItem}>
            <Ionicons name="person-circle" size={20} color="white" />
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.menuText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Proyectos Registrados</Text>
        
        {projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open" size={50} color="#4D92AD" />
            <Text style={styles.emptyText}>No hay proyectos registrados</Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Botón para eliminar todos los proyectos */}
        <TouchableOpacity onPress={handleDeleteProjects} style={styles.deleteAllButton}>
          <Text style={styles.buttonText}>Eliminar Todos los Proyectos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A47",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#1E3A47",
    width: "100%",
  },
  menuButton: {
    position: "absolute",
    left: 15,
    top: 40,
    padding: 5,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    left: 15,
    backgroundColor: "#4D92AD",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  screenTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  projectCard: {
    backgroundColor: "#2A4E5E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  projectTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  projectStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  projectDescription: {
    color: "#9EB8C4",
    fontSize: 14,
    marginBottom: 8,
  },
  projectDate: {
    color: "#7A9EB1",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A47",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A47",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    marginBottom: 10,
  },
  retryText: {
    color: "#4D92AD",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#4D92AD",
    fontSize: 16,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  deleteAllButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ViewProjects;
