import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalStyles';
import { FormData, FormField } from '../../types/form';
import { RootStackParamList } from '../../navigation/AppNavigator'; // Asegúrate de importar el tipo correcto

interface Props {
  route: RouteProp<RootStackParamList, 'GoogleFormsClone'>;
  navigation: NavigationProp<RootStackParamList>;
}

const GoogleFormsClone = ({ route, navigation }: Props) => {
  const projectId = route.params?.projectId; // Obtener el projectId de los parámetros

  const [form, setForm] = useState<FormData>({
    id: Date.now().toString(),
    title: 'Nuevo Formulario',
    description: '',
    projectId: projectId || '', // Usar el projectId desde los parámetros o un valor por defecto
    questions: []
  });

  const addQuestion = (type: FormField['type']) => {
    const newQuestion: FormField = {
      id: Date.now().toString(),
      label: 'Nueva pregunta',
      type,
      required: false
    };
    setForm(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const saveForm = async () => {
    try {
      await AsyncStorage.setItem(`form_${form.id}`, JSON.stringify(form));
      if (form.projectId) {
        navigation.navigate('ProjectManager', { projectId: form.projectId });
      } else {
        console.error('Project ID is undefined');
      }
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };



  return (
    <View style={globalStyles.container}>
      <TextInput
        style={globalStyles.formTitle}
        value={form.title}
        onChangeText={text => setForm(prev => ({ ...prev, title: text }))}
        placeholder="Título del formulario"
      />

      <FlatList
        data={form.questions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.questionContainer}>
            <TextInput
              value={item.label}
              onChangeText={text => setForm(prev => ({
                ...prev,
                questions: prev.questions.map(q => q.id === item.id ? { ...q, label: text } : q)
              }))}
              style={globalStyles.questionInput}
              placeholder="Texto de la pregunta"
            />

            <Picker
              selectedValue={item.type}
              onValueChange={value => setForm(prev => ({
                ...prev,
                questions: prev.questions.map(q => q.id === item.id ? { ...q, type: value } : q)
              }))}>
              <Picker.Item label="Texto" value="text" />
              <Picker.Item label="Alteración" value="alteration" />
              <Picker.Item label="Materialidad" value="materiality" />
              <Picker.Item label="Escala Lineal" value="linearScale" />
            </Picker>
          </View>
        )}
      />

      <TouchableOpacity
        style={globalStyles.floatingButton}
        onPress={() => addQuestion('text')}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.saveButton}
        onPress={saveForm}
      >
        <Text style={globalStyles.buttonText}>Guardar Formulario</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleFormsClone;
