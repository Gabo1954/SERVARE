import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// Importamos las pantallas
import HomeScreen from "../screens/HomeScreen";
import FormScreen from "../screens/FormScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AdminDashboard from "../screens/AdminDashboard";
import LeaderDashboard from "../screens/LeaderDashboard";
import UserDashboard from "../screens/UserDashboard";
import FormBuilderScreen from "../screens/FormBuilderScreen"; 
import ReportsScreen from "../screens/ReportsScreen"; 
import DynamicForm from "../components/DynamicForm"; // 🔹 Importamos correctamente DynamicForm

// Definimos las rutas de navegación
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Form: undefined;
  AdminDashboard: undefined;
  LeaderDashboard: undefined;
  UserDashboard: undefined;
  FormBuilderScreen: undefined;
  ReportsScreen: undefined;
  DynamicForm: { formId: string }; // 🔹 DynamicForm ahora recibe formId como parámetro
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const { role } = JSON.parse(storedUser);
          setUserRole(role);
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario", error);
      }
      setLoading(false);
    };
    checkUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Pantallas de Autenticación */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* Pantallas principales */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
        <Stack.Screen name="Form" component={FormScreen} options={{ title: "Formulario" }} />

        {/* Dashboards protegidos */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: "Administrador" }} />
        <Stack.Screen name="LeaderDashboard" component={LeaderDashboard} options={{ title: "Líder de Equipo" }} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: "Usuario" }} />

        {/* Pantallas de formularios */}
        <Stack.Screen name="FormBuilderScreen" component={FormBuilderScreen} options={{ title: "Crear Formulario" }} />
        <Stack.Screen name="DynamicForm" component={DynamicForm} options={{ title: "Formulario Dinámico" }} />

        {/* Pantallas de Fichas */}
        <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{ title: "Fichas" }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
