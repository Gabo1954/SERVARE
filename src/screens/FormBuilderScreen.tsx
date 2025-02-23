import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Alert, FlatList, 
  TouchableOpacity, StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../styles/globalStyles";
import Slider from "@react-native-community/slider"; // ✅ Corrección de importación

// Definir la interfaz de los campos
interface FormField {
  label: string;
  type: string;
  options?: string[];
}

const fieldTypes: string[] = [
  "text", "email", "number", "date", 
  "select", "checkbox", "radio", 
  "textarea", "image", "location", "slider"
];

const FormBuilderScreen = ({ navigation }: any) => {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [options, setOptions] = useState("");
  const [savedForms, setSavedForms] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    const storedForms = await AsyncStorage.getItem("savedForms");
    if (storedForms) {
      setSavedForms(JSON.parse(storedForms));
    }
  };

  const addField = () => {
    if (!newFieldLabel) {
      Alert.alert("Error", "El campo debe tener un nombre");
      return;
    }

    const newField: FormField = { label: newFieldLabel, type: newFieldType };

    if (newFieldType === "select" || newFieldType === "radio") {
      newField.options = options.split(",").map((o) => o.trim());
    }

    setFields([...fields, newField]);
    setNewFieldLabel("");
    setNewFieldType("text");
    setOptions("");
  };

  const saveForm = async () => {
    if (!formTitle || fields.length === 0) {
      Alert.alert("Error", "Debe ingresar un título y al menos un campo");
      return;
    }

    const formId = Date.now().toString();
    const newForm = { id: formId, title: formTitle, fields };

    const storedForms = await AsyncStorage.getItem("savedForms");
    const existingForms = storedForms ? JSON.parse(storedForms) : [];

    const updatedForms = [...existingForms, { id: formId, title: formTitle }];
    await AsyncStorage.setItem("savedForms", JSON.stringify(updatedForms));
    await AsyncStorage.setItem(`form_${formId}`, JSON.stringify(newForm));

    setSavedForms(updatedForms);
    Alert.alert("Formulario Guardado", "Tu formulario ha sido guardado con éxito");

    // ✅ Redirección corregida
    navigation.navigate("DynamicForm", { formId });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Crear Nuevo Formulario</Text>

      <TextInput
        placeholder="Título del formulario"
        style={styles.input}
        value={formTitle}
        onChangeText={setFormTitle}
        placeholderTextColor="#ccc"
      />

      <TextInput
        placeholder="Nombre del campo"
        style={styles.input}
        value={newFieldLabel}
        onChangeText={setNewFieldLabel}
        placeholderTextColor="#ccc"
      />

      {/* Selección de Tipo de Campo */}
      <FlatList
        data={fieldTypes}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => setNewFieldType(item)} 
            style={[styles.fieldTypeButton, newFieldType === item && styles.selectedFieldType]}
          >
            <Text style={styles.fieldTypeText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Campo de opciones para Select y Radio */}
      {(newFieldType === "select" || newFieldType === "radio") && (
        <TextInput
          placeholder="Opciones (separadas por comas)"
          style={styles.input}
          value={options}
          onChangeText={setOptions}
          placeholderTextColor="#ccc"
        />
      )}

      {/* Campo de Slider */}
      {newFieldType === "slider" && (
        <View>
          <Text style={styles.label}>Selecciona un rango</Text>
          <Slider
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={50}
            minimumTrackTintColor="#1E90FF"
            maximumTrackTintColor="#D3D3D3"
          />
        </View>
      )}

      <TouchableOpacity style={globalStyles.button} onPress={addField}>
        <Text style={globalStyles.buttonText}>Agregar Campo</Text>
      </TouchableOpacity>

      {/* Lista de Campos Agregados */}
      <FlatList
        data={fields}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.fieldItem}>
            <Text style={styles.fieldText}>{item.label} ({item.type})</Text>
          </View>
        )}
      />

      <TouchableOpacity style={globalStyles.button} onPress={saveForm}>
        <Text style={globalStyles.buttonText}>Guardar Formulario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#3B4A5A",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    color: "#fff",
    marginBottom: 10,
  },
  fieldTypeButton: {
    padding: 10,
    backgroundColor: "#ccc",
    margin: 5,
    borderRadius: 5,
  },
  selectedFieldType: {
    backgroundColor: "#4D92AD",
  },
  fieldTypeText: {
    color: "white",
  },
  fieldItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  fieldText: {
    color: "#fff",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
});

export default FormBuilderScreen;
