import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// Importamos las pantallas

import FormScreen from "../screens/Forms/FormScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RestoreScreen from "../screens/auth/RestoreScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import AdminDashboard from "../screens/Users/AdminDashboard";
import LeaderDashboard from "../screens/Users/LeaderDashboard";
import UserDashboard from "../screens/Users/UserDashboard";
import FormBuilderScreen from "../screens/Forms/FormBuilderScreen"; 
import DynamicForm from "../components/DynamicForm";
import InstitutionDashboard from "../screens/Users/InstitutionDashboard";
import ReportScreen from "../screens/Reports/ReportScreen";
import FormMenuScreen from "../screens/Forms/FormMenuScreen";
import ExcelReport from "../screens/Reports/Tablas/ExcelReport";
import HistorialIntervencionesReport from "../screens/Reports/Tablas/HistorialIntervencionesReport";
import ProjectManager from "../screens/projects/ProjectManager";
import ProjectMenuScreen from "../screens/projects/ProjectMenuScreen";
import ViewProjects from "../screens/projects/ViewProjects";
import ProjectDetailScreen from '../screens/projects/ProjectDetailScreen';
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
import ContactScreen from "../screens/Users/ContactScreen";
import CreateTicketScreen from "../screens/CreateTicketScreen";


// Definimos las rutas de navegación
export type RootStackParamList = {
  // Autenticación
  Login: undefined;
  Register: undefined;
  RestoreScreen: undefined;
  
  // Principales
  Home: undefined;
  Form: undefined;
  HomeScreen: undefined;
  
  // Dashboards
  AdminDashboard: undefined;
  LeaderDashboard: undefined;
  UserDashboard: undefined;
  InstitutionDashboard: undefined;
  
  // Formularios
  FormBuilderScreen: undefined;
  DynamicForm: { formId: string };
  FormMenu: undefined;
  
  // Reportes
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
  
  // Proyectos
  ProjectDetail: { projectId: string };
  ProjectManager: undefined;
  ViewProjects: undefined;
  ProjectMenuScreen: undefined;
  
  // Otros
  Employees: undefined;
  Profile: undefined;
  
  TeamScreen: undefined;
  Projects: undefined;
  CreateForm: undefined;
  ViewForms: undefined;
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        {/* Pantallas de Autenticación */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RestoreScreen" component={RestoreScreen} options={{ headerShown: false }} />

        {/* Pantallas principales */}
       
        <Stack.Screen name="Form" component={FormScreen} options={{ title: "Formulario" }} />

        {/* Dashboards */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: "Administrador" }} />
        <Stack.Screen name="LeaderDashboard" component={LeaderDashboard} options={{ title: "Líder de Equipo" }} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: "Usuario" }} />
        <Stack.Screen name="InstitutionDashboard" component={InstitutionDashboard} options={{ title: "Institución" }} />
        

        {/* Formularios */}
        <Stack.Screen name="FormBuilderScreen" component={FormBuilderScreen} options={{ title: "Crear Formulario" }} />
        <Stack.Screen name="DynamicForm" component={DynamicForm} options={{ title: "Formulario Dinámico" }} />
        <Stack.Screen name="FormMenu" component={FormMenuScreen} options={{ title: "Menú Formularios" }} />

        {/* Proyectos */}
        <Stack.Screen name="ProjectManager" component={ProjectManager} options={{ title: "Administrar Proyectos" }} />
        <Stack.Screen name="ViewProjects" component={ViewProjects} options={{ title: "Ver Proyectos" }} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Detalles del Proyecto" }} />
        <Stack.Screen name="ProjectMenuScreen" component={ProjectMenuScreen} options={{ title: "Menú de Proyectos" }} />

        {/* Reportes */}
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

        {/* Otras pantallas */}
        <Stack.Screen name="GraficoReport" component={GraficoReport} options={{ title: "Reporte Gráfico" }} />
        <Stack.Screen name="FichaReport" component={FichaReport} options={{ title: 'Reportes Ficha' }}/>
        <Stack.Screen name="MyFichasReport" component={MyFichasReport} options={{ title: 'Mis Fichas' }}/>
        <Stack.Screen name="GeneralFichaReport" component={GeneralFichaReport}options={{ title: 'Ficha General' }}/>
        <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ title: 'Contacto y Soporte' }}/>
        <Stack.Screen name="CreateTicketScreen" component={CreateTicketScreen} options={{ title: 'Nuevo Ticket' }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

  
  //<Stack.Screen 
  //name="ClientListReport" 
  //component={ClientListReport} 
  //options={{ title: 'Listado de Clientes' }}/>
//<Stack.Screen 
  //name="SalesReport" 
  //component={SalesReport}
  //options={{ title: 'Estadísticas de Ventas' }}/>
//<Stack.Screen 
  //name="PlansReport" 
  //component={PlansReport}
  //options={{ title: 'Estadísticas de Planes' }}/>