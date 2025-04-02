import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalStyles';
import { generateExcelReport } from '../../services/reportService';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  route: RouteProp<RootStackParamList, 'Reports'>;
};

const ReportScreen = ({ route }: Props) => {
  const { formId } = route.params;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Reportes del Formulario #{formId}</Text>
      
      <TouchableOpacity 
        style={globalStyles.buttonPrimary}
        onPress={() => generateExcelReport(formId)}
      >
        <Text style={globalStyles.buttonText}>Exportar a Excel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportScreen;