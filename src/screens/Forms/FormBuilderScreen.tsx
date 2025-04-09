import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'name'
  | 'address'
  | 'date'
  | 'url'
  | 'dropdown'
  | 'checkbox'
  | 'switch'
  | 'multiline';

interface Field {
  id: string;
  type: FieldType;
  label: string;
  value?: any;
  options?: string[]; // for dropdown
}

const availableFields: Field[] = [
  { id: '1', type: 'name', label: 'Nombre' },
  { id: '2', type: 'email', label: 'Correo electrónico' },
  { id: '3', type: 'phone', label: 'Teléfono' },
  { id: '4', type: 'number', label: 'Número' },
  { id: '5', type: 'address', label: 'Dirección' },
  { id: '6', type: 'date', label: 'Fecha' },
  { id: '7', type: 'url', label: 'Sitio web' },
  { id: '8', type: 'dropdown', label: 'Seleccionar opción', options: ['Opción 1', 'Opción 2'] },
  { id: '9', type: 'checkbox', label: 'Acepto términos y condiciones' },
  { id: '10', type: 'switch', label: '¿Activado?' },
  { id: '11', type: 'multiline', label: 'Comentario' },
];

export default function FormBuilderScreen() {
  const [formFields, setFormFields] = useState<Field[]>([]);

  const handleAddField = (field: Field) => {
    const newField: Field = {
      ...field,
      id: Math.random().toString(),
      value:
        field.type === 'name'
          ? { first: '', last: '' }
          : field.type === 'checkbox' || field.type === 'switch'
          ? false
          : field.type === 'date'
          ? new Date()
          : '',
    };
    setFormFields((prev) => [...prev, newField]);
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    setFormFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, label: newLabel } : f))
    );
  };

  const handleRemoveField = (id: string) => {
    setFormFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleInputChange = (
    id: string,
    value: any,
    part: 'first' | 'last' | null = null
  ) => {
    setFormFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;

        if (f.type === 'name' && part) {
          return {
            ...f,
            value: {
              ...(f.value as { first: string; last: string }),
              [part]: value,
            },
          };
        }

        return { ...f, value };
      })
    );
  };

  const handleSave = () => {
    Alert.alert('Formulario guardado', JSON.stringify(formFields, null, 2));
  };

  const renderFormField = (field: Field) => {
    switch (field.type) {
      case 'name':
        return (
          <View style={styles.nameFieldContainer}>
            <TextInput
              placeholder="Nombre"
              value={(field.value as any)?.first}
              onChangeText={(text) => handleInputChange(field.id, text, 'first')}
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TextInput
              placeholder="Apellido"
              value={(field.value as any)?.last}
              onChangeText={(text) => handleInputChange(field.id, text, 'last')}
              style={[styles.input, { flex: 1 }]}
            />
          </View>
        );

      case 'dropdown':
        return (
          <View style={styles.dropdownWrapper}>
            <Picker
              selectedValue={field.value}
              onValueChange={(itemValue) => handleInputChange(field.id, itemValue)}
              style={styles.picker}
            >
              {field.options?.map((option, idx) => (
                <Picker.Item key={idx} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );

      case 'checkbox':
        return (
          <View style={styles.checkboxContainer}>
            <Text style={{ flex: 1 }}>{field.label}</Text>
            <Switch
              value={field.value}
              onValueChange={(val) => handleInputChange(field.id, val)}
            />
          </View>
        );

      case 'switch':
        return (
          <View style={styles.checkboxContainer}>
            <Text style={{ flex: 1 }}>{field.label}</Text>
            <Switch
              value={field.value}
              onValueChange={(val) => handleInputChange(field.id, val)}
            />
          </View>
        );

      case 'date':
        return (
          <View>
            {Platform.OS === 'android' ? (
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  Alert.alert('Fecha', (field.value as Date).toLocaleDateString())
                }
              >
                <Text>{(field.value as Date).toLocaleDateString()}</Text>
              </TouchableOpacity>
            ) : (
              <DateTimePicker
                value={field.value}
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  handleInputChange(field.id, selectedDate || new Date())
                }
              />
            )}
          </View>
        );

      default: {
        let keyboardType: any = 'default';
        if (field.type === 'email') keyboardType = 'email-address';
        if (field.type === 'phone' || field.type === 'number') keyboardType = 'numeric';
        if (field.type === 'url') keyboardType = 'url';

        return (
          <TextInput
            placeholder={field.label}
            keyboardType={keyboardType}
            style={[styles.input, field.type === 'multiline' && styles.multiline]}
            multiline={field.type === 'multiline'}
            value={field.value}
            onChangeText={(text) => handleInputChange(field.id, text)}
          />
        );
      }
    }
  };

  const renderItem = ({ item, drag, isActive }: any) => (
    <ScaleDecorator>
      <View style={[styles.previewField, isActive && styles.activeField]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onLongPress={drag}>
            <Ionicons name="menu" size={20} color="#333" />
          </TouchableOpacity>

          <TextInput
            style={styles.labelInput}
            value={item.label}
            onChangeText={(text) => handleLabelChange(item.id, text)}
          />

          <TouchableOpacity
            onPress={() => handleRemoveField(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
          </TouchableOpacity>
        </View>

        {/* Render field input */}
        {renderFormField(item)}
      </View>
    </ScaleDecorator>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.title}>Campos</Text>
        {availableFields.map((field) => (
          <TouchableOpacity
            key={field.id}
            style={styles.fieldButton}
            onPress={() => handleAddField(field)}
          >
            <Ionicons name="add-circle-outline" size={18} color="#007bff" />
            <Text style={styles.fieldText}>{field.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Drop zone */}
      <View style={styles.dropZone}>
        <Text style={styles.dropTitle}>Vista previa del formulario</Text>

        {formFields.length === 0 ? (
          <View style={styles.dropMessageContainer}>
            <Text style={styles.dropMessage}>
              ¡Empieza a construir! Arrastra los campos desde la izquierda.
            </Text>
          </View>
        ) : (
          <>
            <DraggableFlatList
              data={formFields}
              onDragEnd={({ data }) => setFormFields(data)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Guardar formulario</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 140,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  fieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fieldText: {
    marginLeft: 6,
  },
  dropZone: {
    flex: 1,
    padding: 16,
  },
  dropTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropMessageContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  dropMessage: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  previewField: {
    flexDirection: 'column',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeField: {
    backgroundColor: '#e6f0ff',
  },
  labelInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  deleteButton: {
    marginLeft: 10,
  },
  input: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  nameFieldContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 45,
    width: '100%',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
