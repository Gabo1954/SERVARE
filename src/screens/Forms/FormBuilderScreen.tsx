import React from 'react';
import { View } from 'react-native';
import { RouteProp, NavigationProp } from '@react-navigation/native'; // Añadir NavigationProp
import GoogleFormsClone from '../../components/forms/GoogleFormsClone';
import { globalStyles } from '../../styles/globalStyles';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  route: RouteProp<RootStackParamList, 'FormBuilder'>;
};

const FormBuilderScreen = ({ route }: Props) => {
  return (
    <View style={globalStyles.container}>
      <GoogleFormsClone 
        projectId={route.params.projectId}
        navigation={{} as NavigationProp<any>}
        route={route}
      />
    </View>
  );
};
export default FormBuilderScreen;