import React from 'react';
import { View, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const UserDashboard = ({ navigation }: Props) => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Mis Formularios Activos</Text>
      {/* Implementar lista de formularios asignados aquí */}
    </View>
  );
};

export default UserDashboard;