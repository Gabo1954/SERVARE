import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { RootStackParamList } from './AppNavigator'; // Importación correcta

const Stack = createStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Auth" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Admin" 
      component={RegisterScreen} 
      options={{ title: 'Registro' }}
    />
  </Stack.Navigator>
);

export default AuthStack;