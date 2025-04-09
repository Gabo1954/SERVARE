import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

type FieldType =
  | 'name'
  | 'address'
  | 'phone'
  | 'email'
  | 'text'
  | 'multiline'
  | 'number'
  | 'currency'
  | 'formula'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'multiple'
  | 'image'
  | 'video'
  | 'rating'
  | 'slider'
  | 'description'
  | 'date'
  | 'time'
  | 'datetime'
  | 'month'
  | 'terms'
  | 'signature';

type FieldOption = {
  id: string;
  type: FieldType;
  label: string;
  options?: string[];
};

type FieldValue =
  | string
  | number
  | boolean
  | Date
  | { first: string; last: string }
  | string[]
  | null
  | { uri: string };  // Added support for image URI

type Field = FieldOption & {
  value: FieldValue;
};

const defaultFields: FieldOption[] = [
  { id: '1', type: 'name', label: 'Name' },
  { id: '2', type: 'address', label: 'Address' },
  { id: '3', type: 'phone', label: 'Phone' },
  { id: '4', type: 'email', label: 'Email' },
  { id: '5', type: 'text', label: 'Single Line' },
  { id: '6', type: 'multiline', label: 'Multi Line' },
  { id: '7', type: 'number', label: 'Number' },
  { id: '8', type: 'currency', label: 'Currency' },
  { id: '9', type: 'formula', label: 'Formula' },
  { id: '10', type: 'dropdown', label: 'Dropdown', options: ['Option 1', 'Option 2'] },
  { id: '11', type: 'radio', label: 'Radio', options: ['Yes', 'No'] },
  { id: '12', type: 'checkbox', label: 'Checkbox' },
  { id: '13', type: 'multiple', label: 'Multiple Choice', options: ['One', 'Two', 'Three'] },
  { id: '14', type: 'image', label: 'Image Upload' },  // Image upload field
  { id: '15', type: 'video', label: 'Audio/Video Upload' },
  { id: '16', type: 'rating', label: 'Rating' },
  { id: '17', type: 'slider', label: 'Slider' },
  { id: '18', type: 'description', label: 'Description' },
  { id: '19', type: 'date', label: 'Date' },
  { id: '20', type: 'time', label: 'Time' },
  { id: '21', type: 'datetime', label: 'Date-Time' },
  { id: '22', type: 'month', label: 'Month-Year' },
  { id: '23', type: 'terms', label: 'Terms and Conditions' },
  { id: '24', type: 'signature', label: 'Signature' },
];

const createField = (base: FieldOption): Field => ({
  ...base,
  id: Math.random().toString(),
  value:
    base.type === 'name'
      ? { first: '', last: '' }
      : base.type === 'checkbox'
      ? false
      : base.type === 'date' ||
        base.type === 'time' ||
        base.type === 'datetime'
      ? new Date()
      : base.type === 'multiple' || base.type === 'radio'
      ? ''
      : base.type === 'image'
      ? { uri: '' }  // Initialize empty image URI
      : '',
});

export default function FormBuilderScreen() {
  const [formFields, setFormFields] = useState<Field[]>([]);

  const handleAddField = (field: FieldOption) => {
    setFormFields((prev: Field[]) => [...prev, createField(field)]);
  };

  const handleInputChange = (
    id: string,
    value: FieldValue,
    part: 'first' | 'last' | null = null
  ) => {
    setFormFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        if (f.type === 'name' && part && typeof f.value === 'object' && f.value !== null) {
          return {
            ...f,
            value: {
              ...f.value,
              [part]: value as string,
            },
          };
        }
        return { ...f, value };
      })
    );
  };

  const handleRemoveField = (id: string) => {
    setFormFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleImagePick = async (id: string) => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      // Pick an image from the gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormFields((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, value: { uri: result.assets[0].uri } } // Access the URI correctly
              : f
          )
        );
      }
    }
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'name':
        return (
          <View style={styles.nameFieldContainer}>
            <TextInput
              placeholder="First Name"
              value={(field.value as { first: string }).first}
              onChangeText={(text) => handleInputChange(field.id, text, 'first')}
              style={styles.input}
            />
            <TextInput
              placeholder="Last Name"
              value={(field.value as { last: string }).last}
              onChangeText={(text) => handleInputChange(field.id, text, 'last')}
              style={styles.input}
            />
          </View>
        );
      case 'image':
        return (
          <View style={styles.imageFieldContainer}>
            {field.value && (field.value as { uri: string }).uri ? (
              <Image
                source={{ uri: (field.value as { uri: string }).uri }}
                style={styles.imagePreview}
              />
            ) : (
              <Text style={styles.imagePreviewText}>No image selected</Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImagePick(field.id)}
            >
              <Ionicons name="image" size={20} color="#fff" />
              <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <TextInput
            placeholder={field.label}
            style={styles.input}
            value={field.value as string}
            onChangeText={(text) => handleInputChange(field.id, text)}
          />
        );
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.sidebar}>
        <ScrollView>
          <Text style={styles.title}>Campos</Text>
          {defaultFields.map((field) => (
            <TouchableOpacity key={field.label} style={styles.fieldButton} onPress={() => handleAddField(field)}>
              <Ionicons name="add-circle-outline" size={16} color="#333" />
              <Text style={styles.fieldText}>{field.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.formArea}>
        <Text style={styles.title}>Vista previa del formulario</Text>
        <ScrollView contentContainerStyle={styles.responsiveContainer}>
          {formFields.map((field) => (
            <View key={field.id} style={styles.previewField}>
              {renderField(field)}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveField(field.id)}
              >
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
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
  nameFieldContainer: {  // Add this style definition
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageFieldContainer: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  imagePreviewText: {
    color: '#ccc',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 6,
    borderRadius: 12,
  },
  previewField: {
    marginBottom: 20,
    position: 'relative',
  },
  responsiveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
