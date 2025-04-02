import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalStyles';
import { FormData, FormField } from '../../types/form';

interface Props {
  route: RouteProp<{ FormBuilder: { projectId?: string } }, 'FormBuilder'>;
  navigation: NavigationProp<any>;
  projectId?: string; // Añadir esta línea
}

const GoogleFormsClone = ({ route, navigation, projectId }: Props) => {
  // Usar projectId de props o de route.params
  const initialProjectId = projectId || route.params?.projectId;
  
  const [form, setForm] = useState<FormData>({
    id: Date.now().toString(),
    title: 'Nuevo Formulario',
    description: '',
    projectId: initialProjectId, // Usar el valor combinado
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
      navigation.navigate('ProjectManager', { projectId: form.projectId });
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