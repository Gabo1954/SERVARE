// FormBuilderScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Switch,
  Button,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

// Campos por defecto disponibles
const defaultFields = [
  { id: '1', type: 'text', label: 'Texto (Una línea)' },
  { id: '2', type: 'multiline', label: 'Texto Largo' },
  { id: '3', type: 'number', label: 'Número' },
  { id: '4', type: 'dropdown', label: 'Desplegable', options: ['Opción 1', 'Opción 2'] },
  { id: '5', type: 'checkbox', label: 'Checkbox' },
  { id: '6', type: 'date', label: 'Fecha' },
  { id: '7', type: 'time', label: 'Hora' },
  { id: '8', type: 'section', label: 'Nueva Sección' },
];

// Crea un campo nuevo basado en el tipo
const createField = (base) => ({
  ...base,
  id: Math.random().toString(),
  value: base.type === 'checkbox' ? false :
         base.type === 'date' || base.type === 'time' ? new Date() : '',
  visibleIf: null, // lógica condicional
  hidden: false,
  editing: false,
});

export default function FormBuilderScreen() {
  const [formFields, setFormFields] = useState([]);
  const [currentEditing, setCurrentEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');

  useEffect(() => {
    loadForm();
  }, []);

  // Cargar el formulario guardado desde AsyncStorage
  const loadForm = async () => {
    try {
      const savedForm = await AsyncStorage.getItem('form');
      if (savedForm) {
        setFormFields(JSON.parse(savedForm));
      }
    } catch (e) {
      console.error('Error loading form', e);
    }
  };

  // Guardar el formulario en AsyncStorage
  const saveForm = async () => {
    try {
      await AsyncStorage.setItem('form', JSON.stringify(formFields));
      Alert.alert('Formulario guardado');
    } catch (e) {
      console.error('Error saving form', e);
    }
  };

  // Añadir un nuevo campo al formulario
  const handleAddField = (field) => {
    setFormFields((prev) => [...prev, createField(field)]);
  };

  // Editar el valor de un campo
  const handleInputChange = (id, value, part = null) => {
    setFormFields((prev) => prev.map(f => {
      if (f.id !== id) return f;
      if (f.type === 'name' && part) {
        return {
          ...f,
          value: { ...f.value, [part]: value },
        };
      }
      return { ...f, value };
    }));
  };

  // Mostrar/Ocultar campo según la lógica condicional
  const handleVisibilityChange = (id, visibleIf) => {
    setFormFields((prev) =>
      prev.map(f =>
        f.id === id ? { ...f, visibleIf } : f
      )
    );
  };

  // Eliminar un campo
  const handleDeleteField = (id) => {
    setFormFields((prev) => prev.filter(f => f.id !== id));
  };

  // Cambiar a modo de edición
  const handleEditField = (id) => {
    setCurrentEditing(id);
    setShowModal(true);
  };

  // Cancelar la edición
  const handleCancelEdit = () => {
    setCurrentEditing(null);
    setShowModal(false);
  };

  // Guardar la edición
  const handleSaveEdit = (field) => {
    setFormFields((prev) =>
      prev.map(f => (f.id === currentEditing ? { ...f, ...field } : f))
    );
    setShowModal(false);
    setCurrentEditing(null);
  };

  // Mostrar el campo según el tipo
  const renderField = (field) => {
    if (field.hidden) return null;

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            placeholder={field.label}
            style={styles.input}
            value={field.value}
            onChangeText={(text) => handleInputChange(field.id, text)}
          />
        );
      case 'multiline':
        return (
          <TextInput
            placeholder={field.label}
            multiline
            style={[styles.input, { height: 100 }]}
            value={field.value}
            onChangeText={(text) => handleInputChange(field.id, text)}
          />
        );
      case 'number':
        return (
          <TextInput
            placeholder={field.label}
            keyboardType="numeric"
            style={styles.input}
            value={field.value}
            onChangeText={(text) => handleInputChange(field.id, text)}
          />
        );
      case 'dropdown':
        return (
          <View style={styles.input}>
            <Picker
              selectedValue={field.value}
              onValueChange={(itemValue) => handleInputChange(field.id, itemValue)}
            >
              {field.options.map((opt, idx) => (
                <Picker.Item label={opt} value={opt} key={idx} />
              ))}
            </Picker>
          </View>
        );
      case 'checkbox':
        return (
          <View style={styles.checkboxContainer}>
            <Text>{field.label}</Text>
            <Switch value={field.value} onValueChange={(val) => handleInputChange(field.id, val)} />
          </View>
        );
      case 'date':
      case 'time':
        return (
          <DateTimePicker
            value={field.value}
            mode={field.type}
            display="default"
            onChange={(e, selectedDate) => handleInputChange(field.id, selectedDate)}
          />
        );
      case 'section':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionText}>{field.label}</Text>
          </View>
        );
      default:
        return <Text>{field.label}</Text>;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.sidebar}>
        <ScrollView>
          <Text style={styles.title}>Campos</Text>
          {defaultFields.map((field) => (
            <TouchableOpacity key={field.id} style={styles.fieldButton} onPress={() => handleAddField(field)}>
              <Ionicons name="add-circle-outline" size={16} color="#333" />
              <Text style={styles.fieldText}>{field.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.formArea}>
        <TextInput
          style={styles.formTitle}
          placeholder="Título del formulario"
          value={formTitle}
          onChangeText={setFormTitle}
        />
        <ScrollView contentContainerStyle={styles.responsiveContainer}>
          {formFields.map((field) => (
            <View key={field.id} style={styles.previewField}>
              {renderField(field)}
              <View style={styles.fieldActions}>
                <TouchableOpacity onPress={() => handleEditField(field.id)}>
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteField(field.id)}>
                  <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <Button title="Guardar Formulario" onPress={saveForm} />
      </View>

      <Modal visible={showModal} onRequestClose={handleCancelEdit}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Campo</Text>
          <TextInput
            style={styles.input}
            value={formFields.find(f => f.id === currentEditing)?.label || ''}
            onChangeText={(text) => handleSaveEdit({ label: text })}
          />
          <Button title="Guardar Cambios" onPress={() => handleSaveEdit({ label: formFields.find(f => f.id === currentEditing)?.label })} />
          <Button title="Cancelar" onPress={handleCancelEdit} />
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 160,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  formArea: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldText: {
    marginLeft: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  responsiveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  previewField: {
    width: width > 600 ? '48%' : '100%',
    marginBottom: 15,
  },
  fieldActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    color: 'blue',
  },
  formTitle: {
    fontSize: 22,
    marginBottom: 15,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
