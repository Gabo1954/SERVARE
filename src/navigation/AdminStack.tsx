import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/Users/AdminDashboard';
import FormBuilderScreen from '../screens/Forms/FormBuilderScreen';
import ProjectManager from '../screens/projects/ProjectManager';
import { AdminStackParamList } from './AppNavigator'; // Añadir esta importación

const Stack = createStackNavigator<AdminStackParamList>();

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen 
      name="AdminDashboard" 
      component={AdminDashboard} 
      options={{ title: 'Dashboard' }}
    />
    <Stack.Screen 
      name="FormBuilder" 
      component={FormBuilderScreen} 
      options={{ title: 'Constructor de Formularios' }}
    />
    <Stack.Screen 
      name="ProjectManager" 
      component={ProjectManager} 
      options={{ title: 'Gestor de Proyectos' }}
    />
  </Stack.Navigator>
);

export default AdminStack;