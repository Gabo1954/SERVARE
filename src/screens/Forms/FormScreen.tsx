import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Alert, FlatList, 
  TouchableOpacity, StyleSheet, Button 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../../styles/globalStyles";
import Slider from "@react-native-community/slider";
import { useForm, Controller } from "react-hook-form";
import { TextInput as PaperTextInput } from "react-native-paper";

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
  const { control, handleSubmit, formState: { errors } } = useForm();
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
    if (!newFieldLabel.trim()) {
      Alert.alert("Error", "El campo debe tener un nombre");
      return;
    }

    if ((newFieldType === "select" || newFieldType === "radio") && !options.trim()) {
      Alert.alert("Error", "Debe ingresar opciones separadas por comas");
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

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const saveForm = async () => {
    if (!formTitle.trim() || fields.length === 0) {
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

    if (navigation && navigation.navigate) {
      navigation.navigate("DynamicForm", { formId });
    } else {
      Alert.alert("Error", "No se puede navegar a la vista de formulario");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Crear Nuevo Formulario</Text>

      <Controller
        control={control}
        name="nombre"
        rules={{ required: "El nombre es obligatorio" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PaperTextInput
            label="Nombre"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
          />
        )}
      />
      {errors.nombre && (
        <Text style={styles.error}>{errors.nombre?.message?.toString()}</Text>
      )}

      <TouchableOpacity style={globalStyles.button} onPress={addField}>
        <Text style={globalStyles.buttonText}>Agregar Campo</Text>
      </TouchableOpacity>

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

      <Button title="Guardar" onPress={handleSubmit(saveForm)} />
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
  fieldItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  fieldText: {
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default FormBuilderScreen;
