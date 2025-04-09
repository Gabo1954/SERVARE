import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
<<<<<<< HEAD
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// Importamos las pantallas
=======
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importación de pantallas
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
import HomeScreen from "../screens/HomeScreen";
import FormScreen from "../screens/FormScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AdminDashboard from "../screens/AdminDashboard";
import LeaderDashboard from "../screens/LeaderDashboard";
import UserDashboard from "../screens/UserDashboard";
<<<<<<< HEAD
import FormBuilderScreen from "../screens/FormBuilderScreen"; 
import ReportsScreen from "../screens/ReportsScreen"; 
import DynamicForm from "../components/DynamicForm"; // 🔹 Importamos correctamente DynamicForm

// Definimos las rutas de navegación
export type RootStackParamList = {
=======
import FormBuilderScreen from "../screens/FormBuilderScreen";
import DynamicForm from "../components/DynamicForm";
import UserRegistration from "../screens/UserRegistration";
import EnterpriseUsers from "../screens/EnterpriseUsers";

// Definición de tipos para navegación
type RootStackParamList = {
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Form: undefined;
  AdminDashboard: undefined;
  LeaderDashboard: undefined;
  UserDashboard: undefined;
  FormBuilderScreen: undefined;
<<<<<<< HEAD
  ReportsScreen: undefined;
  DynamicForm: { formId: string }; // 🔹 DynamicForm ahora recibe formId como parámetro
=======
  DynamicForm: { formId: string };
  UserRegistration: undefined;
  EnterpriseUsers: undefined;
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
<<<<<<< HEAD
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
=======
        const storedRole = await AsyncStorage.getItem("userRole");
        if (storedRole) {
          setUserRole(storedRole);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
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
<<<<<<< HEAD
      <Stack.Navigator initialRouteName="Login">
        {/* Pantallas de Autenticación */}
=======
      <Stack.Navigator initialRouteName={userRole ? "Home" : "Login"}>
        {/* Pantallas de autenticación */}
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* Pantallas principales */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
        <Stack.Screen name="Form" component={FormScreen} options={{ title: "Formulario" }} />

<<<<<<< HEAD
        {/* Dashboards protegidos */}
=======
        {/* Dashboards por rol (registrados siempre) */}
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: "Administrador" }} />
        <Stack.Screen name="LeaderDashboard" component={LeaderDashboard} options={{ title: "Líder de Equipo" }} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: "Usuario" }} />

<<<<<<< HEAD
        {/* Pantallas de formularios */}
        <Stack.Screen name="FormBuilderScreen" component={FormBuilderScreen} options={{ title: "Crear Formulario" }} />
        <Stack.Screen name="DynamicForm" component={DynamicForm} options={{ title: "Formulario Dinámico" }} />

        {/* Pantallas de Fichas */}
        <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{ title: "Fichas" }} />
        
=======
        {/* Formularios */}
        <Stack.Screen name="FormBuilderScreen" component={FormBuilderScreen} options={{ title: "Crear Formulario" }} />
        <Stack.Screen name="DynamicForm" component={DynamicForm} options={{ title: "Formulario Dinámico" }} />

        {/* Pantallas adicionales */}
        <Stack.Screen name="UserRegistration" component={UserRegistration} options={{ title: "Registro de Usuarios" }} />
        <Stack.Screen name="EnterpriseUsers" component={EnterpriseUsers} options={{ title: "Usuarios Empresariales" }} />
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
<<<<<<< HEAD
=======
export type { RootStackParamList };
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
