import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native'; // Cambiar a CommonActions
import { globalStyles } from '../../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/AppNavigator';

const AdminDashboard = () => {
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }]
        })
      );
    } catch (error) {
      console.error('Error en cierre de sesión:', error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Panel de Administración</Text>

      <TouchableOpacity
        style={globalStyles.buttonPrimary}
        onPress={() => navigation.navigate('Admin', {
          screen: 'FormBuilder',
          params: { projectId: undefined }
        })}
      >
        <Text style={globalStyles.buttonText}>Crear Formulario</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.buttonSecondary}
        onPress={() => navigation.navigate('Admin', {
          screen: 'ProjectManager'
        })}
      >
        <Text style={globalStyles.buttonText}>Gestionar Proyectos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.buttonDanger}
        onPress={handleLogout}
      >
        <Text style={globalStyles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminDashboard;