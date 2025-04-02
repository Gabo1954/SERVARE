import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface FormData {
  id: string;
  title: string;
  // Añadir más propiedades según tu estructura real
}

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const FormsHomeScreen = ({ navigation }: Props) => {
  const [forms, setForms] = useState<FormData[]>([]);

  useEffect(() => {
    const loadForms = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const formKeys = keys.filter(k => k.startsWith('form_'));
        const formsData = await AsyncStorage.multiGet(formKeys);
        const parsedForms = formsData
          .filter(([_, value]) => value !== null)
          .map(([_, value]) => JSON.parse(value!) as FormData);
        setForms(parsedForms);
      } catch (error) {
        console.error('Error loading forms:', error);
      }
    };
    loadForms();
  }, []);

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={forms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={globalStyles.listItem}
            onPress={() => navigation.navigate('DynamicForm', { formId: item.id })}
          >
            <Text style={globalStyles.listItemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FormsHomeScreen;