import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// Pantallas
import FormScreen from "../screens/Forms/FormScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RestoreScreen from "../screens/auth/RestoreScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import AdminDashboard from "../screens/Users/AdminDashboard";
import LeaderDashboard from "../screens/Users/LeaderDashboard";
import UserDashboard from "../screens/Users/UserDashboard";
import InstitutionDashboard from "../screens/Users/InstitutionDashboard";
import ProfileScreen from "../screens/auth/profile";
import FormBuilderScreen from "../screens/Forms/FormBuilderScreen"; 
import DynamicForm from "../components/DynamicForm";
import FormMenuScreen from "../screens/Forms/FormMenuScreen";

import ReportScreen from "../screens/Reports/ReportScreen";
import ExcelReport from "../screens/Reports/Tablas/ExcelReport";
import HistorialIntervencionesReport from "../screens/Reports/Tablas/HistorialIntervencionesReport";
import CondicionesExternasReport from "../screens/Reports/Tablas/CondicionesExternasReport";
import IncidenciaReport from "../screens/Reports/Tablas/IncidenciaReport";
import ExtensionReport from "../screens/Reports/Tablas/ExtensionReport";
import EstadoConservacionReport from "../screens/Reports/Tablas/EstadoConservacionReport";
import VulnerabilidadReport from "../screens/Reports/Tablas/VulnerabilidadReport";
import CondicionesAmbientalesReport from "../screens/Reports/Tablas/CondicionesAmbientalesReport";
import MaterialesReport from "../screens/Reports/Tablas/MaterialesReport";
import AlteracionesReport from "../screens/Reports/Tablas/AlteracionesReport";
import FactoresRiesgoReport from "../screens/Reports/Tablas/FactoresRiesgoReport";
import DinamicaDeterioroReport from "../screens/Reports/Tablas/DinamicaDeterioroReport";
import FichaReport from "../screens/Reports/Fichas/FichaReport";
import MyFichasReport from "../screens/Reports/MyFichasReport";
import GraficoReport from "../screens/Reports/Graficos/GraficoReport";
import GeneralFichaReport from "../screens/Reports/Graficos/GeneralFichaReport";

import ProjectManager from "../screens/projects/ProjectManager";
import ViewProjects from "../screens/projects/ViewProjects";
import ProjectDetailScreen from "../screens/projects/ProjectDetailScreen";
import ProjectMenuScreen from "../screens/projects/ProjectMenuScreen";

import ContactScreen from "../screens/Users/ContactScreen";
import CreateTicketScreen from "../screens/auth/CreateTicketScreen";
import EmployeesScreen from "../screens/Users/Employees";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RestoreScreen: undefined;
  ProfileScreen: undefined;
  Restore: undefined;
  Home: undefined;
  Form: undefined;
  HomeScreen: undefined;

  AdminDashboard: undefined;
  LeaderDashboard: undefined;
  UserDashboard: undefined;
  InstitutionDashboard: undefined;

  FormBuilderScreen: { formToEdit: FormData | null };
  FormScreen: undefined;
  DynamicForm: { formId: string };
  FormMenu: undefined;

  ReportScreen: undefined;
  ExcelReport: undefined;
  GraficoReport: undefined;
  FichaReport: undefined;
  HistorialIntervencionesReport: undefined;
  CondicionesExternasReport: undefined;
  IncidenciaReport: undefined;
  ExtensionReport: undefined;
  EstadoConservacionReport: undefined;
  VulnerabilidadReport: undefined;
  CondicionesAmbientalesReport: undefined;
  MaterialesReport: undefined;
  AlteracionesReport: undefined;
  FactoresRiesgoReport: undefined;
  DinamicaDeterioroReport: undefined;

  ProjectDetail: { projectId: string };
  ProjectManager: undefined;
  ViewProjects: undefined;
  ProjectMenuScreen: undefined;

  Employees: undefined;
  Profile: undefined;

  TeamScreen: undefined;
  Projects: undefined;
  CreateForm: undefined;
  generateExcelReport: undefined;
  MyFichasReport: undefined;
  GeneralFichaReport: undefined;
  ClientListReport: undefined;
  SalesReport: undefined;
  PlansReport: undefined;
  GenerateGeneralReport: undefined;
  ContactScreen: undefined;
  CreateTicketScreen: undefined;
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
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RestoreScreen" component={RestoreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: "Mi Perfil" }} />
      <Stack.Screen name="Form" component={FormScreen} options={{ title: "Ver Formularios" }} />

      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: "Servare" }} />
      <Stack.Screen name="LeaderDashboard" component={LeaderDashboard} options={{ title: "Usuario" }} />
      <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: "Usuario General" }} />
      <Stack.Screen name="InstitutionDashboard" component={InstitutionDashboard} options={{ title: "Institución" }} />

      <Stack.Screen name="FormBuilderScreen" component={FormBuilderScreen} options={{ title: "Crear Formulario" }} />
      <Stack.Screen name="DynamicForm" component={DynamicForm} options={{ title: "Formulario Dinámico" }} />
      <Stack.Screen name="FormMenu" component={FormMenuScreen} options={{ title: "Menú Formularios" }} />
      <Stack.Screen name="FormScreen" component={FormScreen} options={{ title: "Vista de los formularios" }} />

      <Stack.Screen name="ProjectManager" component={ProjectManager} options={{ title: "Administrar Proyectos" }} />
      <Stack.Screen name="ViewProjects" component={ViewProjects} options={{ title: "Ver Proyectos" }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Detalles del Proyecto" }} />
      <Stack.Screen name="ProjectMenuScreen" component={ProjectMenuScreen} options={{ title: "Menú de Proyectos" }} />

      <Stack.Screen name="Employees" component={EmployeesScreen} options={{ title: "Empleados" }} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} options={{ title: "Reportes y Estadísticas" }} />
      <Stack.Screen name="CondicionesExternasReport" component={CondicionesExternasReport} options={{ title: "Condiciones Externas" }} />
      <Stack.Screen name="MaterialesReport" component={MaterialesReport} options={{ title: "Materiales" }} />
      <Stack.Screen name="AlteracionesReport" component={AlteracionesReport} options={{ title: "Alteraciones" }} />
      <Stack.Screen name="IncidenciaReport" component={IncidenciaReport} options={{ title: "Incidencia" }} />
      <Stack.Screen name="ExtensionReport" component={ExtensionReport} options={{ title: "Extensión" }} />
      <Stack.Screen name="EstadoConservacionReport" component={EstadoConservacionReport} options={{ title: "Estado de Conservación" }} />
      <Stack.Screen name="VulnerabilidadReport" component={VulnerabilidadReport} options={{ title: "Vulnerabilidad" }} />
      <Stack.Screen name="CondicionesAmbientalesReport" component={CondicionesAmbientalesReport} options={{ title: "Condiciones Ambientales" }} />
      <Stack.Screen name="HistorialIntervencionesReport" component={HistorialIntervencionesReport} options={{ title: "Historial de Intervenciones" }} />
      <Stack.Screen name="FactoresRiesgoReport" component={FactoresRiesgoReport} options={{ title: "Factores de Riesgo" }} />
      <Stack.Screen name="DinamicaDeterioroReport" component={DinamicaDeterioroReport} options={{ title: "Dinámica del Deterioro" }} />
      <Stack.Screen name="ExcelReport" component={ExcelReport} options={{ title: "Reporte Excel" }} />

      <Stack.Screen name="GraficoReport" component={GraficoReport} options={{ title: "Reporte Gráfico" }} />
      <Stack.Screen name="FichaReport" component={FichaReport} options={{ title: "Reportes Ficha" }} />
      <Stack.Screen name="MyFichasReport" component={MyFichasReport} options={{ title: "Mis Fichas" }} />
      <Stack.Screen name="GeneralFichaReport" component={GeneralFichaReport} options={{ title: "Ficha General" }} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ title: "Contacto y Soporte" }} />
      <Stack.Screen name="CreateTicketScreen" component={CreateTicketScreen} options={{ title: "Nuevo Ticket" }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
