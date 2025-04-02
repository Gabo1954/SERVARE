import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import AlterationPicker from '../pickers/AlterationPicker';
import MaterialityPicker from '../pickers/MaterialityPicker';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

// Tipo específico para las props
type DynamicFormRouteProp = RouteProp<RootStackParamList, 'DynamicForm'>;

interface DynamicFormProps {
  route: DynamicFormRouteProp;
}

const DynamicForm = ({ route }: DynamicFormProps) => {
  const { formId } = route.params; // Ahora TS reconoce formId

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Formulario: {formId}</Text>
      
      <TextInput
        style={globalStyles.input}
        placeholder="Nombre del elemento"
        placeholderTextColor="#5BBFBA"
      />
      
      <AlterationPicker />
      <MaterialityPicker />

      <TouchableOpacity 
        style={globalStyles.buttonPrimary}
        onPress={() => console.log('Guardar datos')}
      >
        <Text style={globalStyles.buttonText}>Guardar Levantamiento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DynamicForm;