import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  TouchableOpacity,
  Switch, // Importando Switch
} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {
  GestureHandlerRootView,
  TouchableOpacity as GestureTouchableOpacity,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Usar DateTimePicker

const { width } = Dimensions.get('window');

type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'name'
  | 'checkbox'
  | 'radio'
  | 'dropdown'
  | 'date'
  | 'file'
  | 'calculation'
  | 'signature'
  | 'location';

interface Field {
  id: string;
  type: FieldType;
  label: string;
  value?: any;
  options?: string[]; // Options for checkbox, radio, and dropdown fields
  required?: boolean;
  visible?: boolean; // For conditional visibility
}

const availableFields: Field[] = [
  { id: '1', type: 'name', label: 'Nombre Completo' },
  { id: '2', type: 'email', label: 'Correo' },
  { id: '3', type: 'phone', label: 'Teléfono' },
  { id: '4', type: 'number', label: 'Número' },
  { id: '5', type: 'checkbox', label: 'Casillas de Verificación', options: ['Opción 1', 'Opción 2', 'Opción 3'] },
  { id: '6', type: 'radio', label: 'Botones de Opción', options: ['Sí', 'No'] },
  { id: '7', type: 'dropdown', label: 'Menú Desplegable', options: ['Opción A', 'Opción B', 'Opción C'] },
  { id: '8', type: 'date', label: 'Fecha' },
  { id: '9', type: 'file', label: 'Archivo Adjunto' },
  { id: '10', type: 'calculation', label: 'Cálculo' },
  { id: '11', type: 'signature', label: 'Firma' },
  { id: '12', type: 'location', label: 'Ubicación' },
];

export default function FormBuilderScreen() {
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // Para mostrar el picker de fecha
  const [selectedDate, setSelectedDate] = useState('');

  const handleAddField = (field: Field) => {
    const newField: Field =
      field.type === 'name'
        ? {
            ...field,
            id: Math.random().toString(),
            value: { first: '', last: '' },
          }
        : { ...field, id: Math.random().toString(), value: '' };

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
    if (field.type === 'name') {
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
    }

    if (field.type === 'checkbox') {
      return (
        <View style={styles.checkboxContainer}>
          {field.options?.map((option, index) => (
            <View key={index} style={styles.checkboxOption}>
              <Switch
                value={field.value?.[option] || false}
                onValueChange={(newValue: boolean) =>
                  handleInputChange(field.id, {
                    ...field.value,
                    [option]: newValue,
                  })
                }
              />
              <Text>{option}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (field.type === 'radio') {
      return (
        <View style={styles.radioContainer}>
          {field.options?.map((option, index) => (
            <View key={index} style={styles.radioOption}>
              <Switch
                value={field.value === option}
                onValueChange={() => handleInputChange(field.id, option)}
              />
              <Text>{option}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (field.type === 'dropdown') {
      return (
        <View style={styles.dropdownContainer}>
          <TextInput
            placeholder={`Selecciona ${field.label.toLowerCase()}`}
            value={field.value}
            onChangeText={(text) => handleInputChange(field.id, text)}
            style={styles.input}
          />
        </View>
      );
    }

    if (field.type === 'date') {
      return (
        <TouchableOpacity
          onPress={() => setDatePickerVisible(true)} // Abrir el DatePicker
        >
          <TextInput
            placeholder="Selecciona una fecha"
            value={field.value}
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
      );
    }

    if (field.type === 'file') {
      return (
        <TouchableOpacity onPress={() => Alert.alert('Implementar carga de archivo')}>
          <Text style={styles.input}>Seleccionar archivo</Text>
        </TouchableOpacity>
      );
    }

    if (field.type === 'signature') {
      return (
        <TouchableOpacity onPress={() => Alert.alert('Implementar firma')}>
          <Text style={styles.input}>Firma electrónica</Text>
        </TouchableOpacity>
      );
    }

    if (field.type === 'location') {
      return (
        <TouchableOpacity onPress={() => Alert.alert('Implementar ubicación')}>
          <Text style={styles.input}>Selecciona tu ubicación</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TextInput
        placeholder={`Ingrese ${field.label.toLowerCase()}`}
        keyboardType={
          field.type === 'email'
            ? 'email-address'
            : field.type === 'phone' || field.type === 'number'
            ? 'numeric'
            : 'default'
        }
        style={styles.input}
        value={field.value as string}
        onChangeText={(text) => handleInputChange(field.id, text)}
      />
    );
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

      {/* DatePicker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          const dateString = date.toLocaleDateString();
          setSelectedDate(dateString);
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 200,
    padding: 16,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldText: {
    fontSize: 16,
    marginLeft: 8,
  },
  dropZone: {
    flex: 1,
    padding: 16,
  },
  dropTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dropMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropMessage: {
    fontSize: 16,
    color: '#777',
  },
  previewField: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeField: {
    backgroundColor: '#f9f9f9',
  },
  labelInput: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  deleteButton: {
    marginLeft: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  nameFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    marginTop: 8,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioContainer: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dropdownContainer: {
    marginTop: 8,
  },
});
