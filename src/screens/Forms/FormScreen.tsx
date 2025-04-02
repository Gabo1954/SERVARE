import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  route: RouteProp<RootStackParamList, 'DynamicForm'>; // Asegúrate que coincida con el nombre en tu RootStackParamList
};

const FormScreen = ({ route }: Props) => {
  const { formId } = route.params;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Formulario #{formId}</Text>
      {/* Implementar lógica de formulario dinámico aquí */}
    </View>
  );
};

export default FormScreen;