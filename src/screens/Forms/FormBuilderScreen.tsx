import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Modal,
  Pressable,
  Platform,
  Image,
  FlatList,
} from 'react-native';
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// Tipos de campos
const fieldTypes = [
  'text',
  'number',
  'email',
  'checkbox',
  'radio',
  'dropdown',
  'date',
  'signature',
  'image',
  'location',
  'rating',
  'slider',
  'paragraph',
  'header',
  'divider',
] as const;

type FieldType = (typeof fieldTypes)[number];

interface FieldStyle {
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: number;
  color?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface Field {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean | string[] | Date;
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  logic?: LogicRule[];
  imageUri?: string;
  location?: LocationData;
  rating?: number;
  style?: FieldStyle;
}

interface Section {
  id: string;
  name: string;
  description?: string;
  fields: Field[];
  collapsed?: boolean;
}

interface Page {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
}

interface LogicRule {
  ifFieldId: string;
  operator: 'equals' | 'not equals' | 'contains' | 'not contains' | 'greater than' | 'less than';
  value: string;
  thenAction: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'not require';
  targetFieldId: string;
}

type DefaultFieldProps = {
  [key in FieldType]: Partial<Field>;
};

const FormBuilderScreen = () => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: uuid.v4().toString(),
      title: 'Formulario sin título',
      sections: [
        {
          id: uuid.v4().toString(),
          name: 'Sección principal',
          fields: [],
        },
      ],
    },
  ]);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showLogicModal, setShowLogicModal] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newLogicRule, setNewLogicRule] = useState<Partial<LogicRule>>({
    operator: 'equals',
    thenAction: 'show',
  });
  const [activeTab, setActiveTab] = useState<'settings' | 'logic'>('settings');

  // Permisos
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        await Location.requestForegroundPermissionsAsync();
      }
    })();
  }, []);

  const updatePages = (newPages: Page[]) => setPages(newPages);

  const addPage = () => {
    const newPage: Page = {
      id: uuid.v4().toString(),
      title: `Página ${pages.length + 1}`,
      sections: [
        {
          id: uuid.v4().toString(),
          name: 'Nueva sección',
          fields: [],
        },
      ],
    };
    updatePages([...pages, newPage]);
  };

  const addSection = (pageId: string) => {
    const newSection: Section = {
      id: uuid.v4().toString(),
      name: 'Nueva sección',
      fields: [],
    };
    updatePages(
      pages.map(p =>
        p.id === pageId ? { ...p, sections: [...p.sections, newSection] } : p
      )
    );
  };

  const addField = (pageId: string, sectionId: string, type: FieldType) => {
    const defaultFieldProps: DefaultFieldProps = {
      text: { 
        label: 'Campo de texto', 
        placeholder: 'Escriba aquí...',
        defaultValue: ''
      },
      number: { 
        label: 'Campo numérico', 
        placeholder: 'Ingrese un número',
        defaultValue: 0
      },
      email: { 
        label: 'Correo electrónico', 
        placeholder: 'ejemplo@dominio.com',
        defaultValue: ''
      },
      checkbox: { 
        label: 'Casillas de verificación', 
        options: ['Opción 1', 'Opción 2'], 
        defaultValue: [] 
      },
      radio: { 
        label: 'Botones de opción', 
        options: ['Opción 1', 'Opción 2'],
        defaultValue: ''
      },
      dropdown: { 
        label: 'Lista desplegable', 
        options: ['Opción 1', 'Opción 2'],
        defaultValue: ''
      },
      date: { 
        label: 'Fecha', 
        defaultValue: new Date().toISOString().split('T')[0] 
      },
      signature: { 
        label: 'Firma',
        defaultValue: ''
      },
      image: { 
        label: 'Imagen',
        defaultValue: ''
      },
      location: { 
        label: 'Ubicación',
        defaultValue: undefined
      },
      rating: { 
        label: 'Calificación', 
        defaultValue: 3,
        rating: 3
      },
      slider: { 
        label: 'Deslizador', 
        min: 0, 
        max: 100, 
        step: 1, 
        defaultValue: 50 
      },
      paragraph: { 
        label: 'Párrafo', 
        defaultValue: 'Texto descriptivo...', 
        style: { fontSize: 14, color: '#666' } 
      },
      header: { 
        label: 'Título', 
        style: { fontSize: 18, color: '#333', textAlign: 'left' } 
      },
      divider: { 
        label: 'Separador',
        defaultValue: undefined
      }
    };

    const newField: Field = {
      id: uuid.v4().toString(),
      type,
      label: defaultFieldProps[type].label || `Campo ${type}`,
      ...defaultFieldProps[type]
    };
    
    updatePages(
      pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId
                  ? { ...s, fields: [...s.fields, newField] }
                  : s
              ),
            }
          : p
      )
    );
    
    setEditingField(newField);
    setShowFieldModal(true);
  };

  const updateField = (pageId: string, sectionId: string, fieldId: string, updates: Partial<Field>) => {
    updatePages(
      pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId
                  ? {
                      ...s,
                      fields: s.fields.map(f =>
                        f.id === fieldId ? { ...f, ...updates } : f
                      ),
                    }
                  : s
              ),
            }
          : p
      )
    );
  };

  const deleteField = (pageId: string, sectionId: string, fieldId: string) => {
    Alert.alert(
      'Eliminar campo',
      '¿Estás seguro de que quieres eliminar este campo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            updatePages(
              pages.map(p =>
                p.id === pageId
                  ? {
                      ...p,
                      sections: p.sections.map(s =>
                        s.id === sectionId
                          ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
                          : s
                      ),
                    }
                  : p
              )
            );
          },
        },
      ]
    );
  };

  const duplicateField = (pageId: string, sectionId: string, field: Field) => {
    const duplicatedField = { 
      ...field, 
      id: uuid.v4().toString(), 
      label: `${field.label} (copia)`,
      options: field.options ? [...field.options] : undefined
    };
    updatePages(
      pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId
                  ? { ...s, fields: [...s.fields, duplicatedField] }
                  : s
              ),
            }
          : p
      )
    );
  };

  const reorderFields = (pageId: string, sectionId: string, data: Field[]) => {
    updatePages(
      pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId ? { ...s, fields: data } : s
              ),
            }
          : p
      )
    );
  };

  const toggleSectionCollapse = (pageId: string, sectionId: string) => {
    updatePages(
      pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s
              ),
            }
          : p
      )
    );
  };

  const saveTemplate = async () => {
    try {
      await AsyncStorage.setItem('form_template', JSON.stringify(pages));
      Alert.alert('Éxito', 'Plantilla guardada correctamente');
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar la plantilla');
    }
  };

  const loadTemplate = async () => {
    try {
      const json = await AsyncStorage.getItem('form_template');
      if (json) {
        updatePages(JSON.parse(json));
        Alert.alert('Éxito', 'Plantilla cargada correctamente');
      } else {
        Alert.alert('Info', 'No hay plantillas guardadas');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar la plantilla');
    }
  };

  const handleAddOption = () => {
    if (!newOption.trim() || !editingField) return;
    
    const updatedOptions = [...(editingField.options || []), newOption];
    setEditingField({ ...editingField, options: updatedOptions });
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    if (!editingField || !editingField.options) return;
    
    const updatedOptions = [...editingField.options];
    updatedOptions.splice(index, 1);
    setEditingField({ ...editingField, options: updatedOptions });
  };

  const handleAddLogicRule = () => {
    if (!newLogicRule.ifFieldId || !newLogicRule.targetFieldId || !editingField) return;
    
    const rule: LogicRule = {
      ifFieldId: newLogicRule.ifFieldId,
      operator: newLogicRule.operator || 'equals',
      value: newLogicRule.value || '',
      thenAction: newLogicRule.thenAction || 'show',
      targetFieldId: newLogicRule.targetFieldId,
    };
    
    setEditingField({
      ...editingField,
      logic: [...(editingField.logic || []), rule],
    });
    
    setNewLogicRule({
      operator: 'equals',
      thenAction: 'show',
    });
  };

  const handleRemoveLogicRule = (index: number) => {
    if (!editingField || !editingField.logic) return;
    
    const updatedLogic = [...editingField.logic];
    updatedLogic.splice(index, 1);
    setEditingField({ ...editingField, logic: updatedLogic });
  };

  const handleSaveFieldChanges = () => {
    if (!editingField) return;
    
    const updatedPages = pages.map(page => ({
      ...page,
      sections: page.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => 
          field.id === editingField.id ? editingField : field
        )
      }))
    }));
    
    setPages(updatedPages);
    setShowFieldModal(false);
    setShowOptionsModal(false);
    setShowLogicModal(false);
  };

  const pickImage = async () => {
    if (!editingField) return;
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setEditingField({
        ...editingField,
        imageUri: result.assets[0].uri,
      });
    }
  };

  const getLocation = async () => {
    if (!editingField) return;
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setEditingField({
      ...editingField,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  const renderFieldPreview = (field: Field) => {
    switch (field.type) {
      case 'text':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <TextInput
              style={styles.previewInput}
              placeholder={field.placeholder || 'Ingrese texto'}
              editable={false}
            />
          </View>
        );
      case 'number':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <TextInput
              style={styles.previewInput}
              placeholder={field.placeholder || 'Ingrese número'}
              keyboardType="numeric"
              editable={false}
            />
          </View>
        );
      case 'email':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <TextInput
              style={styles.previewInput}
              placeholder={field.placeholder || 'Ingrese email'}
              keyboardType="email-address"
              editable={false}
            />
          </View>
        );
      case 'checkbox':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            {(field.options || []).map((option, idx) => (
              <View key={`${field.id}-option-${idx}`} style={styles.optionItem}>
                <Ionicons name="checkbox-outline" size={24} color="#555" />
                <Text style={styles.optionText}>{option}</Text>
              </View>
            ))}
          </View>
        );
      case 'radio':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            {(field.options || []).map((option, idx) => (
              <View key={`${field.id}-option-${idx}`} style={styles.optionItem}>
                <Ionicons name="radio-button-off" size={24} color="#555" />
                <Text style={styles.optionText}>{option}</Text>
              </View>
            ))}
          </View>
        );
      case 'dropdown':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <View style={[styles.previewInput, { justifyContent: 'space-between' }]}>
              <Text style={{ color: '#888' }}>Seleccione una opción</Text>
              <Ionicons name="chevron-down" size={18} color="#888" />
            </View>
          </View>
        );
      case 'date':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <View style={[styles.previewInput, { justifyContent: 'space-between' }]}>
              <Text style={{ color: '#888' }}>{field.defaultValue?.toString() || 'Seleccione fecha'}</Text>
              <Ionicons name="calendar" size={18} color="#888" />
            </View>
          </View>
        );
      case 'rating':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={`${field.id}-star-${star}`}
                  name={star <= (field.rating || 3) ? 'star' : 'star-outline'}
                  size={32}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
        );
      case 'slider':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={field.min || 0}
              maximumValue={field.max || 100}
              step={field.step || 1}
              value={typeof field.defaultValue === 'number' ? field.defaultValue : 50}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#CCCCCC"
              thumbTintColor="#007AFF"
              disabled
            />
            <Text style={styles.sliderValue}>
              Valor: {typeof field.defaultValue === 'number' ? field.defaultValue : field.min || 0}
            </Text>
          </View>
        );
      case 'image':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <TouchableOpacity style={styles.imageUploadBtn}>
              <Ionicons name="image-outline" size={24} color="#007AFF" />
              <Text style={styles.imageUploadText}>Subir imagen</Text>
            </TouchableOpacity>
            {field.imageUri && (
              <Image source={{ uri: field.imageUri }} style={styles.imagePreview} />
            )}
          </View>
        );
      case 'location':
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}{field.required && <Text style={styles.required}> *</Text>}</Text>
            {field.description && <Text style={styles.fieldDescription}>{field.description}</Text>}
            <TouchableOpacity style={styles.locationBtn}>
              <Ionicons name="location-outline" size={24} color="#007AFF" />
              <Text style={styles.locationBtnText}>Obtener ubicación</Text>
            </TouchableOpacity>
            {field.location && (
              <Text style={styles.locationText}>
                Lat: {field.location.latitude.toFixed(4)}, Long: {field.location.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        );
      case 'paragraph':
        return (
          <View style={styles.fieldPreview}>
            <TextInput
              style={[styles.paragraphInput, {
                fontSize: field.style?.fontSize || 14,
                color: field.style?.color || '#666',
              }]}
              value={typeof field.defaultValue === 'string' ? field.defaultValue : ''}
              placeholder="Texto descriptivo..."
              multiline
              editable={false}
            />
          </View>
        );
      case 'header':
        return (
          <View style={styles.fieldPreview}>
            <TextInput
              style={[styles.headerInput, {
                fontSize: field.style?.fontSize || 18,
                color: field.style?.color || '#333',
                textAlign: field.style?.textAlign || 'left',
              }]}
              value={field.label}
              placeholder="Título"
              editable={false}
            />
          </View>
        );
      case 'divider':
        return (
          <View style={styles.dividerPreview}>
            <View style={styles.dividerLine} />
          </View>
        );
      default:
        return (
          <View style={styles.fieldPreview}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Text style={{ color: '#888' }}>Vista previa no disponible</Text>
          </View>
        );
    }
  };

  const renderFieldEditor = () => {
    if (!editingField) return null;

    const allFields: Field[] = [];
    pages.forEach(page => {
      page.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.id !== editingField.id) {
            allFields.push(field);
          }
        });
      });
    });

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showFieldModal}
        onRequestClose={() => setShowFieldModal(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar campo: {editingField.type}</Text>
            <TouchableOpacity onPress={() => setShowFieldModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
              onPress={() => setActiveTab('settings')}
            >
              <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Configuración</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'logic' && styles.activeTab]}
              onPress={() => setActiveTab('logic')}
            >
              <Text style={[styles.tabText, activeTab === 'logic' && styles.activeTabText]}>Lógica</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'settings' ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldGroupTitle}>Configuración básica</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Etiqueta del campo</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editingField.label}
                    onChangeText={(text) => setEditingField({ ...editingField, label: text })}
                  />
                </View>

                {editingField.type !== 'header' && editingField.type !== 'divider' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Descripción (texto de ayuda)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editingField.description}
                      onChangeText={(text) => setEditingField({ ...editingField, description: text })}
                      placeholder="Texto que aparecerá como ayuda"
                    />
                  </View>
                )}

                {editingField.type !== 'header' && editingField.type !== 'divider' && editingField.type !== 'paragraph' && (
                  <View style={[styles.inputGroup, styles.switchContainer]}>
                    <Text style={styles.inputLabel}>Campo obligatorio</Text>
                    <Switch
                      value={editingField.required || false}
                      onValueChange={(value) => setEditingField({ ...editingField, required: value })}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={editingField.required ? "#007AFF" : "#f4f3f4"}
                    />
                  </View>
                )}

                {editingField.type === 'paragraph' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Texto</Text>
                    <TextInput
                      style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                      value={typeof editingField.defaultValue === 'string' ? editingField.defaultValue : ''}
                      onChangeText={(text) => setEditingField({ ...editingField, defaultValue: text })}
                      multiline
                      placeholder="Escriba el texto descriptivo..."
                    />
                  </View>
                )}

                {editingField.type === 'header' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Texto del título</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editingField.label}
                      onChangeText={(text) => setEditingField({ ...editingField, label: text })}
                      placeholder="Escriba el título..."
                    />
                  </View>
                )}

                {['text', 'number', 'email', 'date', 'dropdown'].includes(editingField.type) && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Texto de placeholder</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editingField.placeholder}
                      onChangeText={(text) => setEditingField({ ...editingField, placeholder: text })}
                      placeholder="Texto que aparecerá como ayuda"
                    />
                  </View>
                )}
              </View>

              {['checkbox', 'radio', 'dropdown'].includes(editingField.type) && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldGroupTitle}>Opciones</Text>
                  
                  {(editingField.options || []).map((option, idx) => (
                    <View key={`${editingField.id}-option-${idx}`} style={styles.optionItemEdit}>
                      <Text style={styles.optionText}>{option}</Text>
                      <TouchableOpacity onPress={() => handleRemoveOption(idx)}>
                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addOptionBtn} 
                    onPress={() => setShowOptionsModal(true)}
                  >
                    <Ionicons name="add" size={20} color="#007AFF" />
                    <Text style={styles.addOptionText}>Agregar opción</Text>
                  </TouchableOpacity>
                </View>
              )}

              {editingField.type === 'slider' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldGroupTitle}>Configuración del rango</Text>
                  
                  <View style={styles.sliderConfig}>
                    <View style={styles.sliderInputGroup}>
                      <Text style={styles.inputLabel}>Valor mínimo</Text>
                      <TextInput
                        style={[styles.modalInput, { width: 80 }]}
                        value={editingField.min?.toString() || '0'}
                        onChangeText={(text) => setEditingField({ 
                          ...editingField, 
                          min: Number(text) || 0 
                        })}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.sliderInputGroup}>
                      <Text style={styles.inputLabel}>Valor máximo</Text>
                      <TextInput
                        style={[styles.modalInput, { width: 80 }]}
                        value={editingField.max?.toString() || '100'}
                        onChangeText={(text) => setEditingField({ 
                          ...editingField, 
                          max: Number(text) || 100 
                        })}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.sliderInputGroup}>
                      <Text style={styles.inputLabel}>Incremento</Text>
                      <TextInput
                        style={[styles.modalInput, { width: 80 }]}
                        value={editingField.step?.toString() || '1'}
                        onChangeText={(text) => setEditingField({ 
                          ...editingField, 
                          step: Number(text) || 1 
                        })}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.sliderInputGroup}>
                      <Text style={styles.inputLabel}>Valor predeterminado</Text>
                      <TextInput
                        style={[styles.modalInput, { width: 80 }]}
                        value={editingField.defaultValue?.toString() || '50'}
                        onChangeText={(text) => setEditingField({ 
                          ...editingField, 
                          defaultValue: Number(text) || 50 
                        })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              )}

              {editingField.type === 'rating' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldGroupTitle}>Configuración de calificación</Text>
                  
                  <View style={styles.ratingConfig}>
                    <Text style={styles.inputLabel}>Valor predeterminado</Text>
                    <View style={styles.ratingStarsEdit}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={`${editingField.id}-star-${star}`}
                          onPress={() => setEditingField({ 
                            ...editingField, 
                            rating: star,
                            defaultValue: star
                          })}
                        >
                          <Ionicons
                            name={star <= (editingField.rating || 3) ? 'star' : 'star-outline'}
                            size={32}
                            color="#FFD700"
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {editingField.type === 'date' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldGroupTitle}>Configuración de fecha</Text>
                  
                  <TouchableOpacity 
                    style={styles.datePickerBtn}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.datePickerBtnText}>
                      {editingField.defaultValue?.toString() || 'Seleccionar fecha predeterminada'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {editingField.type === 'image' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldGroupTitle}>Imagen de ejemplo</Text>
                  
                  <TouchableOpacity 
                    style={styles.imagePickerBtn}
                    onPress={pickImage}
                  >
                    <Ionicons name="image-outline" size={24} color="#007AFF" />
                    <Text style={styles.imagePickerBtnText}>
                      {editingField.imageUri ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </Text>
                  </TouchableOpacity>
                  
                  {editingField.imageUri && (
                    <Image 
                      source={{ uri: editingField.imageUri }} 
                      style={styles.imageEditorPreview} 
                    />
                  )}
                </View>
              )}

              {editingField.type === 'location' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldGroupTitle}>Ubicación de ejemplo</Text>
                  
                  <TouchableOpacity 
                    style={styles.locationPickerBtn}
                    onPress={getLocation}
                  >
                    <Ionicons name="location-outline" size={24} color="#007AFF" />
                    <Text style={styles.locationPickerBtnText}>
                      {editingField.location ? 'Actualizar ubicación' : 'Obtener ubicación'}
                    </Text>
                  </TouchableOpacity>
                  
                  {editingField.location && (
                    <Text style={styles.locationEditorText}>
                      Latitud: {editingField.location.latitude.toFixed(6)}{'\n'}
                      Longitud: {editingField.location.longitude.toFixed(6)}
                    </Text>
                  )}
                </View>
              )}

              {['header', 'paragraph'].includes(editingField.type) && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldGroupTitle}>Estilo</Text>
                  
                  <View style={styles.styleConfig}>
                    {editingField.type === 'header' && (
                      <View style={styles.styleInputGroup}>
                        <Text style={styles.inputLabel}>Alineación</Text>
                        <View style={styles.alignmentOptions}>
                          {['left', 'center', 'right'].map((align) => (
                            <TouchableOpacity
                              key={`${editingField.id}-align-${align}`}
                              style={[
                                styles.alignmentBtn,
                                editingField.style?.textAlign === align && styles.alignmentBtnActive
                              ]}
                              onPress={() => setEditingField({
                                ...editingField,
                                style: {
                                  ...editingField.style,
                                  textAlign: align as 'left' | 'center' | 'right'
                                }
                              })}
                            >
                              <Text style={[
                                styles.alignmentBtnText,
                                editingField.style?.textAlign === align && styles.alignmentBtnTextActive
                              ]}>
                                {align === 'left' ? 'Izq' : align === 'center' ? 'Centro' : 'Der'}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    <View style={styles.styleInputGroup}>
                      <Text style={styles.inputLabel}>Tamaño de texto</Text>
                      <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={editingField.type === 'header' ? 14 : 10}
                        maximumValue={editingField.type === 'header' ? 32 : 24}
                        step={1}
                        value={editingField.style?.fontSize || (editingField.type === 'header' ? 18 : 14)}
                        onValueChange={(value) => setEditingField({
                          ...editingField,
                          style: {
                            ...editingField.style,
                            fontSize: value
                          }
                        })}
                        minimumTrackTintColor="#007AFF"
                        maximumTrackTintColor="#CCCCCC"
                        thumbTintColor="#007AFF"
                      />
                      <Text style={styles.sliderValue}>
                        {editingField.style?.fontSize || (editingField.type === 'header' ? 18 : 14)}px
                      </Text>
                    </View>
                    
                    <View style={styles.styleInputGroup}>
                      <Text style={styles.inputLabel}>Color del texto</Text>
                      <View style={styles.colorOptions}>
                        {['#333', '#666', '#007AFF', '#FF3B30', '#34C759', '#5856D6'].map((color) => (
                          <TouchableOpacity
                            key={`${editingField.id}-color-${color}`}
                            style={[
                              styles.colorBtn,
                              { backgroundColor: color },
                              editingField.style?.color === color && styles.colorBtnActive
                            ]}
                            onPress={() => setEditingField({
                              ...editingField,
                              style: {
                                ...editingField.style,
                                color
                              }
                            })}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldGroupTitle}>Lógica condicional</Text>
              <Text style={styles.logicDescription}>
                Define reglas para mostrar, ocultar o requerir este campo basado en las respuestas de otros campos.
              </Text>
              
              {(editingField.logic || []).length > 0 ? (
                editingField.logic?.map((rule, idx) => (
                  <View key={`${editingField.id}-rule-${idx}`} style={styles.logicRule}>
                    <Text style={styles.logicRuleText}>
                      SI <Text style={styles.logicRuleField}>{getFieldLabel(rule.ifFieldId)}</Text> {rule.operator} "{rule.value}"
                      ENTONCES {rule.thenAction} <Text style={styles.logicRuleField}>{getFieldLabel(rule.targetFieldId)}</Text>
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveLogicRule(idx)}>
                      <Ionicons name="trash-outline" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noLogicText}>No hay reglas de lógica definidas para este campo.</Text>
              )}
              
              <TouchableOpacity 
                style={styles.addLogicBtn}
                onPress={() => setShowLogicModal(true)}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={styles.addLogicText}>Agregar regla</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowFieldModal(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveFieldChanges}
            >
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal para agregar opciones */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showOptionsModal}
          onRequestClose={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsModalContainer}>
            <View style={styles.optionsModalContent}>
              <Text style={styles.optionsModalTitle}>Agregar nueva opción</Text>
              
              <TextInput
                style={styles.modalInput}
                value={newOption}
                onChangeText={setNewOption}
                placeholder="Escriba la nueva opción"
                onSubmitEditing={handleAddOption}
              />
              
              <View style={styles.optionsModalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowOptionsModal(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddOption}
                >
                  <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal para agregar lógica */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLogicModal}
          onRequestClose={() => setShowLogicModal(false)}
        >
          <View style={styles.optionsModalContainer}>
            <View style={[styles.optionsModalContent, { width: '90%' }]}>
              <Text style={styles.optionsModalTitle}>Agregar regla de lógica</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SI este campo:</Text>
                <View style={styles.picker}>
                  {allFields.length > 0 ? (
                    <FlatList
                      data={allFields}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item: field }) => (
                        <TouchableOpacity
                          style={[
                            styles.fieldPickerItem,
                            newLogicRule.ifFieldId === field.id && styles.fieldPickerItemSelected
                          ]}
                          onPress={() => setNewLogicRule({ ...newLogicRule, ifFieldId: field.id })}
                        >
                          <Text style={styles.fieldPickerText}>{field.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <Text style={styles.noFieldsText}>No hay otros campos disponibles</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Operador:</Text>
                <View style={styles.operatorOptions}>
                  {['equals', 'not equals', 'contains', 'not contains', 'greater than', 'less than'].map(op => (
                    <TouchableOpacity
                      key={`operator-${op}`}
                      style={[
                        styles.operatorBtn,
                        newLogicRule.operator === op && styles.operatorBtnActive
                      ]}
                      onPress={() => setNewLogicRule({ ...newLogicRule, operator: op as any })}
                    >
                      <Text style={[
                        styles.operatorBtnText,
                        newLogicRule.operator === op && styles.operatorBtnTextActive
                      ]}>
                        {op === 'equals' ? 'es igual a' : 
                         op === 'not equals' ? 'no es igual a' : 
                         op === 'contains' ? 'contiene' : 
                         op === 'not contains' ? 'no contiene' : 
                         op === 'greater than' ? 'es mayor que' : 'es menor que'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Valor:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newLogicRule.value}
                  onChangeText={(text) => setNewLogicRule({ ...newLogicRule, value: text })}
                  placeholder="Valor a comparar"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ENTONCES:</Text>
                <View style={styles.actionOptions}>
                  {['show', 'hide', 'enable', 'disable', 'require', 'not require'].map(action => (
                    <TouchableOpacity
                      key={`action-${action}`}
                      style={[
                        styles.actionBtn,
                        newLogicRule.thenAction === action && styles.actionBtnActive
                      ]}
                      onPress={() => setNewLogicRule({ ...newLogicRule, thenAction: action as any })}
                    >
                      <Text style={[
                        styles.actionBtnText,
                        newLogicRule.thenAction === action && styles.actionBtnTextActive
                      ]}>
                        {action === 'show' ? 'mostrar' : 
                         action === 'hide' ? 'ocultar' : 
                         action === 'enable' ? 'habilitar' : 
                         action === 'disable' ? 'deshabilitar' : 
                         action === 'require' ? 'hacer obligatorio' : 'no requerir'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Este campo:</Text>
                <Text style={styles.targetFieldText}>{editingField?.label}</Text>
              </View>
              
              <View style={styles.optionsModalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLogicModal(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddLogicRule}
                  disabled={!newLogicRule.ifFieldId}
                >
                  <Text style={styles.buttonText}>Agregar regla</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={currentDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date && editingField) {
                setEditingField({
                  ...editingField,
                  defaultValue: date.toISOString().split('T')[0]
                });
              }
            }}
          />
        )}
      </Modal>
    );
  };

  const getFieldLabel = (fieldId: string) => {
    for (const page of pages) {
      for (const section of page.sections) {
        for (const field of section.fields) {
          if (field.id === fieldId) {
            return field.label;
          }
        }
      }
    }
    return 'Campo desconocido';
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={addPage} style={styles.btn}>
            <Ionicons name="add" size={20} color="#333" />
            <Text style={styles.btnText}>Página</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={saveTemplate} style={styles.btn}>
            <Ionicons name="save-outline" size={20} color="#333" />
            <Text style={styles.btnText}>Guardar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={loadTemplate} style={styles.btn}>
            <Ionicons name="folder-open-outline" size={20} color="#333" />
            <Text style={styles.btnText}>Cargar</Text>
          </TouchableOpacity>
        </View>

        {pages.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No hay páginas en este formulario</Text>
            <TouchableOpacity onPress={addPage} style={[styles.btn, { marginTop: 16 }]}>
              <Text style={styles.btnText}>Crear primera página</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={pages}
          keyExtractor={(item) => item.id}
          renderItem={({ item: page }) => (
            <View style={styles.page}>
              <View style={styles.pageHeader}>
                <TextInput
                  style={styles.pageTitle}
                  value={page.title}
                  onChangeText={(t) => updatePages(pages.map(p => p.id === page.id ? { ...p, title: t } : p))}
                  placeholder="Título de la página"
                />
                {pages.length > 1 && (
                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => {
                      Alert.alert(
                        'Eliminar página',
                        '¿Estás seguro de que quieres eliminar esta página?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Eliminar',
                            style: 'destructive',
                            onPress: () => updatePages(pages.filter(p => p.id !== page.id))
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                )}
              </View>

              {page.description && (
                <TextInput
                  style={styles.pageDescription}
                  value={page.description}
                  onChangeText={(t) => updatePages(pages.map(p => p.id === page.id ? { ...p, description: t } : p))}
                  placeholder="Descripción de la página"
                  multiline
                />
              )}

              <FlatList
                data={page.sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item: section }) => (
                  <View key={section.id} style={styles.section}>
                    <TouchableOpacity 
                      style={styles.sectionHeader}
                      onPress={() => toggleSectionCollapse(page.id, section.id)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons 
                          name={section.collapsed ? "chevron-forward" : "chevron-down"} 
                          size={20} 
                          color="#555" 
                        />
                        <TextInput
                          style={styles.sectionTitle}
                          value={section.name}
                          onChangeText={(t) =>
                            updatePages(
                              pages.map(p =>
                                p.id === page.id
                                  ? {
                                      ...p,
                                      sections: p.sections.map(s =>
                                        s.id === section.id ? { ...s, name: t } : s
                                      ),
                                    }
                                  : p
                              )
                            )
                          }
                          placeholder="Nombre de la sección"
                        />
                      </View>
                      {section.fields.length > 0 && (
                        <TouchableOpacity 
                          style={styles.deleteBtn}
                          onPress={() => {
                            Alert.alert(
                              'Eliminar sección',
                              '¿Estás seguro de que quieres eliminar esta sección?',
                              [
                                { text: 'Cancelar', style: 'cancel' },
                                {
                                  text: 'Eliminar',
                                  style: 'destructive',
                                  onPress: () => updatePages(
                                    pages.map(p => 
                                      p.id === page.id 
                                        ? { ...p, sections: p.sections.filter(s => s.id !== section.id) } 
                                        : p
                                    )
                                  )
                                },
                              ]
                            );
                          }}
                        >
                          <Ionicons name="trash-outline" size={20} color="#ff4444" />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>

                    {section.description && !section.collapsed && (
                      <TextInput
                        style={styles.sectionDescription}
                        value={section.description}
                        onChangeText={(t) =>
                          updatePages(
                            pages.map(p =>
                              p.id === page.id
                                ? {
                                    ...p,
                                    sections: p.sections.map(s =>
                                      s.id === section.id ? { ...s, description: t } : s
                                    ),
                                  }
                                : p
                            )
                          )
                        }
                        placeholder="Descripción de la sección"
                        multiline
                      />
                    )}

                    {!section.collapsed && (
                      <>
                        {section.fields.length === 0 ? (
                          <View style={styles.emptySection}>
                            <Text style={styles.emptySectionText}>Esta sección no tiene campos</Text>
                            <View style={styles.fieldButtons}>
                              {fieldTypes.slice(0, 6).map(type => (
                                <TouchableOpacity 
                                  key={`${section.id}-type-${type}`}
                                  onPress={() => addField(page.id, section.id, type)} 
                                  style={styles.fieldTypeBtn}
                                >
                                  <Text style={styles.fieldTypeText}>{type}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                            <View style={styles.fieldButtons}>
                              {fieldTypes.slice(6).map(type => (
                                <TouchableOpacity 
                                  key={`${section.id}-type-${type}`}
                                  onPress={() => addField(page.id, section.id, type)} 
                                  style={styles.fieldTypeBtn}
                                >
                                  <Text style={styles.fieldTypeText}>{type}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        ) : (
                          <>
                            <DraggableFlatList
                              data={section.fields}
                              keyExtractor={(item) => item.id}
                              onDragEnd={({ data }) => reorderFields(page.id, section.id, data)}
                              renderItem={({ item, drag }) => (
                                <View style={styles.fieldContainer}>
                                  <TouchableOpacity 
                                    onLongPress={drag} 
                                    style={styles.dragHandle}
                                  >
                                    <Ionicons name="reorder-three-outline" size={24} color="#555" />
                                  </TouchableOpacity>
                                  
                                  <Pressable 
                                    style={styles.fieldContent}
                                    onPress={() => {
                                      setEditingField(item);
                                      setShowFieldModal(true);
                                    }}
                                  >
                                    {renderFieldPreview(item)}
                                  </Pressable>
                                  
                                  <View style={styles.fieldActions}>
                                    <TouchableOpacity onPress={() => duplicateField(page.id, section.id, item)}>
                                      <Ionicons name="copy-outline" size={20} color="#555" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteField(page.id, section.id, item.id)}>
                                      <Ionicons name="trash-outline" size={20} color="#ff4444" />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              )}
                            />
                            
                            <View style={styles.addFieldBtnContainer}>
                              <TouchableOpacity 
                                style={styles.addFieldBtn}
                                onPress={() => {
                                  Alert.alert(
                                    'Agregar campo',
                                    'Seleccione el tipo de campo:',
                                    fieldTypes.map(type => ({
                                      text: type,
                                      onPress: () => addField(page.id, section.id, type)
                                    }))
                                  );
                                }}
                              >
                                <Ionicons name="add" size={20} color="#007AFF" />
                                <Text style={styles.addFieldBtnText}>Agregar campo</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        )}
                      </>
                    )}
                  </View>
                )}
              />

              <TouchableOpacity 
                onPress={() => addSection(page.id)} 
                style={[styles.btn, styles.addSectionBtn]}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={[styles.btnText, { color: '#007AFF' }]}>Agregar sección</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      
      {renderFieldEditor()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  page: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  pageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  section: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyStateText: {
    marginTop: 12,
    color: '#888',
    fontSize: 16,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptySectionText: {
    color: '#888',
    marginBottom: 16,
  },
  fieldButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  fieldTypeBtn: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  fieldTypeText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '500',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dragHandle: {
    padding: 8,
  },
  fieldContent: {
    flex: 1,
    padding: 8,
  },
  fieldActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 8,
  },
  fieldPreview: {
    padding: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  fieldDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  required: {
    color: 'red',
  },
  previewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraphInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  headerInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionItemEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  optionText: {
    marginLeft: 8,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sliderValue: {
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
  imageUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
    gap: 8,
  },
  imageUploadText: {
    color: '#007AFF',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    marginTop: 8,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
    gap: 8,
  },
  locationBtnText: {
    color: '#007AFF',
  },
  locationText: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
  dividerPreview: {
    paddingVertical: 8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
  addFieldBtnContainer: {
    marginTop: 8,
  },
  addFieldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
    gap: 8,
  },
  addFieldBtnText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  addSectionBtn: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderConfig: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  sliderInputGroup: {
    minWidth: '48%',
    marginBottom: 12,
  },
  ratingConfig: {
    marginBottom: 12,
  },
  ratingStarsEdit: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  datePickerBtnText: {
    color: '#333',
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
    gap: 8,
    marginBottom: 12,
  },
  imagePickerBtnText: {
    color: '#007AFF',
  },
  imageEditorPreview: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  locationPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
    gap: 8,
    marginBottom: 12,
  },
  locationPickerBtnText: {
    color: '#007AFF',
  },
  locationEditorText: {
    color: '#666',
    fontSize: 12,
  },
  styleConfig: {
    marginTop: 12,
  },
  styleInputGroup: {
    marginBottom: 16,
  },
  alignmentOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  alignmentBtn: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
  },
  alignmentBtnActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  alignmentBtnText: {
    color: '#666',
  },
  alignmentBtnTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  colorBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorBtnActive: {
    borderColor: '#007AFF',
  },
  logicDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  logicRule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  logicRuleText: {
    flex: 1,
    color: '#333',
  },
  logicRuleField: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  noLogicText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  addLogicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    gap: 8,
  },
  addLogicText: {
    color: '#007AFF',
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    gap: 8,
  },
  addOptionText: {
    color: '#007AFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontWeight: '500',
  },
  optionsModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  optionsModalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  optionsModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    maxHeight: 200,
    backgroundColor: '#fafafa',
  },
  fieldPicker: {
    padding: 8,
  },
  fieldPickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fieldPickerItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  fieldPickerText: {
    color: '#333',
  },
  noFieldsText: {
    color: '#888',
    textAlign: 'center',
    padding: 16,
    fontStyle: 'italic',
  },
  operatorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  operatorBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  operatorBtnActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  operatorBtnText: {
    color: '#666',
  },
  operatorBtnTextActive: {
    color: '#007AFF',
  },
  actionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  actionBtnActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  actionBtnText: {
    color: '#666',
  },
  actionBtnTextActive: {
    color: '#007AFF',
  },
  targetFieldText: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    color: '#333',
  },
});

export default FormBuilderScreen;