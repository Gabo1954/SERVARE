import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import AlterationPicker from '../pickers/AlterationPicker';
import MaterialityPicker from '../pickers/MaterialityPicker';
import { FormField } from '../../types/form';

interface FormFieldProps {
  field: FormField;
}

const FormFieldComponent = ({ field }: FormFieldProps) => {
  return (
    <View style={globalStyles.questionContainer}>
      <Text style={globalStyles.fieldLabel}>{field.label}</Text>
      
      {field.type === 'text' && (
        <TextInput 
          style={globalStyles.input}
          placeholder="Ingrese texto"
          placeholderTextColor="#5BBFBA"
        />
      )}
      
      {field.type === 'alteration' && <AlterationPicker />}
      {field.type === 'materiality' && <MaterialityPicker />}
    </View>
  );
};

export default FormFieldComponent;