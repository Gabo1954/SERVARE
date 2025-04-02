import { createStackNavigator } from '@react-navigation/stack';
import UserDashboard from '../screens/Users/UserDashboard';
import DynamicForm from '../components/forms/DynamicForm';
import { RootStackParamList } from './AppNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="User"  // Pantalla principal del stack
      component={UserDashboard} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="DynamicForm"  // Nombre único definido en RootStackParamList
      component={DynamicForm} 
      options={{ title: 'Formulario' }}
    />
  </Stack.Navigator>
);

export default UserStack;