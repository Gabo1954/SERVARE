<<<<<<< HEAD
// FormBuilderScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from "../styles/globalStyles";

export interface FormField {
  label: string;
  type: string;
  options?: string[];
  // Propiedad para condiciones (IF anidado). Cada clave es el valor de activación y el valor es un array de campos adicionales.
  condiciones?: Record<string, FormField[]>;
}

const fieldTypes: string[] = [
  "text", "multiline", "number", "decimal", "nombre", "fecha", "fecha-hora",
  "dropdown", "decision", "multiple", "opción", "checkbox",
  "imagen", "audio", "video", "descripción", "sección",
  "slider", "puntuación", "id_unico", "fórmula", "georreferenciación"
=======
import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Alert, FlatList, 
  TouchableOpacity, StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../styles/globalStyles";
import Slider from "@react-native-community/slider"; 

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
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
];

const FormBuilderScreen = ({ navigation }: any) => {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [options, setOptions] = useState("");
<<<<<<< HEAD
  const [savedForms, setSavedForms] = useState<any[]>([]);
=======
  const [savedForms, setSavedForms] = useState<{ id: string; title: string }[]>([]);
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
<<<<<<< HEAD
    const storedForms = await AsyncStorage.getItem("formularios");
=======
    const storedForms = await AsyncStorage.getItem("savedForms");
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
    if (storedForms) {
      setSavedForms(JSON.parse(storedForms));
    }
  };

  const addField = () => {
    if (!newFieldLabel.trim()) {
      Alert.alert("Error", "El campo debe tener un nombre");
      return;
    }
<<<<<<< HEAD
    // Si el tipo es dropdown o multiple se requiere ingresar opciones
    if ((newFieldType === "dropdown" || newFieldType === "multiple") && !options.trim()) {
      Alert.alert("Error", "Debe ingresar opciones separadas por comas");
      return;
    }
    const newField: FormField = { label: newFieldLabel, type: newFieldType };
    if (newFieldType === "dropdown" || newFieldType === "multiple") {
      newField.options = options.split(",").map((o) => o.trim());
    }
    // Aquí se podría implementar una ventana modal para configurar condiciones y reglas (IF anidado)
=======

    if ((newFieldType === "select" || newFieldType === "radio") && !options.trim()) {
      Alert.alert("Error", "Debe ingresar opciones separadas por comas");
      return;
    }

    const newField: FormField = { label: newFieldLabel, type: newFieldType };

    if (newFieldType === "select" || newFieldType === "radio") {
      newField.options = options.split(",").map((o) => o.trim());
    }

>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
    setFields([...fields, newField]);
    setNewFieldLabel("");
    setNewFieldType("text");
    setOptions("");
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const saveForm = async () => {
    if (!formTitle.trim() || fields.length === 0) {
      Alert.alert("Error", "Debe ingresar un título y al menos un campo");
      return;
    }
<<<<<<< HEAD
    const formId = Date.now().toString();
    // Se genera el objeto de formulario según el modelo de negocio
    const newForm = {
      id_formulario: formId,
      cod_formulario: `CCP_${formId}`,
      nombre: formTitle,
      descripción: "",
      creado_por: "", // Aquí se asignaría el id del usuario autenticado
      fecha_creación: new Date().toISOString(),
      estado: "Borrador",
      // La estructura del formulario se guarda en configuración_json
      configuración_json: JSON.stringify({ campos: fields })
    };

    const storedForms = await AsyncStorage.getItem("formularios");
    const existingForms = storedForms ? JSON.parse(storedForms) : [];
    const updatedForms = [...existingForms, newForm];
    await AsyncStorage.setItem("formularios", JSON.stringify(updatedForms));
=======

    const formId = Date.now().toString();
    const newForm = { id: formId, title: formTitle, fields };

    const storedForms = await AsyncStorage.getItem("savedForms");
    const existingForms = storedForms ? JSON.parse(storedForms) : [];

    const updatedForms = [...existingForms, { id: formId, title: formTitle }];
    await AsyncStorage.setItem("savedForms", JSON.stringify(updatedForms));
    await AsyncStorage.setItem(`form_${formId}`, JSON.stringify(newForm));

    setSavedForms(updatedForms);
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
    Alert.alert("Formulario Guardado", "Tu formulario ha sido guardado con éxito");

    if (navigation && navigation.navigate) {
      navigation.navigate("DynamicForm", { formId });
    } else {
      Alert.alert("Error", "No se puede navegar a la vista de formulario");
    }
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

<<<<<<< HEAD
      <Text style={styles.label}>Nombre del campo</Text>
      <TextInput
        placeholder="Ingrese el nombre del campo"
=======
      <TextInput
        placeholder="Nombre del campo"
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
        style={styles.input}
        value={newFieldLabel}
        onChangeText={setNewFieldLabel}
        placeholderTextColor="#ccc"
      />

<<<<<<< HEAD
      <Text style={styles.label}>Tipo de Campo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={newFieldType}
          onValueChange={(itemValue) => setNewFieldType(itemValue)}
          style={styles.picker}
          dropdownIconColor="#007bff"
        >
          {fieldTypes.map((tipo) => (
            <Picker.Item key={tipo} label={tipo} value={tipo} />
          ))}
        </Picker>
      </View>

      {(newFieldType === "dropdown" || newFieldType === "multiple") && (
=======
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
            <Text style={styles.fieldText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Campo de opciones para Select y Radio */}
      {(newFieldType === "select" || newFieldType === "radio") && (
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
        <TextInput
          placeholder="Opciones (separadas por comas)"
          style={styles.input}
          value={options}
          onChangeText={setOptions}
          placeholderTextColor="#ccc"
        />
      )}

<<<<<<< HEAD
      {/* Botón para agregar condiciones IF anidado */}
      <TouchableOpacity style={styles.conditionalButton} onPress={() => Alert.alert("Funcionalidad pendiente", "Configurar condiciones y reglas IF anidado.")}>
        <Text style={styles.conditionalButtonText}>Agregar Condición (IF anidado)</Text>
      </TouchableOpacity>

=======
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
      <TouchableOpacity style={globalStyles.button} onPress={addField}>
        <Text style={globalStyles.buttonText}>Agregar Campo</Text>
      </TouchableOpacity>

<<<<<<< HEAD
=======
      {/* Lista de Campos Agregados */}
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
      <FlatList
        data={fields}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.fieldItem}>
            <Text style={styles.fieldText}>{item.label} ({item.type})</Text>
            <TouchableOpacity onPress={() => removeField(index)}>
              <Text style={{ color: "red" }}>Eliminar</Text>
            </TouchableOpacity>
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
<<<<<<< HEAD
  label: {
    color: "#fff",
    marginBottom: 5,
    fontWeight: "bold"
  },
  pickerContainer: {
    backgroundColor: "#3B4A5A",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    color: "#fff",
    width: "100%",
    height: 50,
  },
  conditionalButton: {
    backgroundColor: "#4D92AD",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  conditionalButtonText: {
    color: "#fff",
    fontWeight: "bold"
=======
  fieldTypeButton: {
    padding: 10,
    backgroundColor: "#ccc",
    margin: 5,
    borderRadius: 5,
  },
  selectedFieldType: {
    backgroundColor: "#4D92AD",
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
  },
  fieldItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  fieldText: {
    color: "#fff",
  },
});

<<<<<<< HEAD
export default FormBuilderScreen;
=======
export default FormBuilderScreen;
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
