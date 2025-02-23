import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const DynamicForm = ({ route }: any) => {
  const { formId } = route.params;
  const [form, setForm] = useState<{ title: string; fields: any[] } | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const loadForm = async () => {
      const savedForm = await AsyncStorage.getItem(`form_${formId}`);
      if (savedForm) {
        setForm(JSON.parse(savedForm));
      }
    };
    loadForm();
  }, [formId]);

  const handleInputChange = (label: string, value: any) => {
    setFormData({ ...formData, [label]: value });
  };

  const handleSubmit = () => {
    console.log("Formulario Enviado:", formData);
    Alert.alert("Datos enviados", JSON.stringify(formData, null, 2));
  };

  if (!form) {
    return <Text>Cargando formulario...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{form.title}</Text>

      {form.fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <Text style={styles.label}>{field.label}</Text>

          {/* Campos de entrada de texto, número, email y fecha */}
          {["text", "email", "number", "date"].includes(field.type) && (
            <TextInput
              style={styles.input}
              keyboardType={field.type === "number" ? "numeric" : "default"}
              onChangeText={(text) => handleInputChange(field.label, text)}
              placeholder={`Ingrese ${field.label}`}
            />
          )}

          {/* Selector (Dropdown) */}
          {field.type === "select" && (
            <Picker
              selectedValue={formData[field.label] || ""}
              onValueChange={(itemValue) => handleInputChange(field.label, itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione una opción" value="" />
              {field.options?.map((option: string, idx: number) => (
                <Picker.Item key={idx} label={option} value={option} />
              ))}
            </Picker>
          )}

          {/* Checkbox (Switch) */}
          {field.type === "checkbox" && (
            <Switch
              value={formData[field.label] === true}
              onValueChange={(value) => handleInputChange(field.label, value)}
            />
          )}

          {/* Radio Buttons */}
          {field.type === "radio" &&
            field.options?.map((option: string, idx: number) => (
              <TouchableOpacity key={idx} onPress={() => handleInputChange(field.label, option)}>
                <Text
                  style={[
                    styles.radioButton,
                    formData[field.label] === option && styles.radioButtonSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

          {/* Textarea (Texto largo) */}
          {field.type === "textarea" && (
            <TextInput
              style={styles.textarea}
              multiline
              onChangeText={(text) => handleInputChange(field.label, text)}
            />
          )}

          {/* Selector de Imagen */}
          {field.type === "image" && (
            <TouchableOpacity
              onPress={async () => {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                  Alert.alert("Permiso denegado", "Se requiere acceso a la galería para subir imágenes.");
                  return;
                }
                const result = await ImagePicker.launchImageLibraryAsync();
                if (!result.canceled && result.assets.length > 0) {
                  handleInputChange(field.label, result.assets[0].uri);
                }
              }}
            >
              <Text style={styles.link}>Seleccionar Imagen</Text>
            </TouchableOpacity>
          )}

          {/* Obtener ubicación GPS */}
          {field.type === "location" && (
            <TouchableOpacity
              onPress={async () => {
                const permission = await Location.requestForegroundPermissionsAsync();
                if (!permission.granted) {
                  Alert.alert("Permiso denegado", "Se requiere acceso a la ubicación.");
                  return;
                }
                const location = await Location.getCurrentPositionAsync();
                handleInputChange(
                  field.label,
                  `Lat: ${location.coords.latitude}, Lng: ${location.coords.longitude}`
                );
              }}
            >
              <Text style={styles.link}>Obtener Ubicación</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    height: 80,
  },
  radioButton: {
    padding: 5,
    backgroundColor: "#ccc",
    color: "white",
    borderRadius: 5,
    textAlign: "center",
    marginVertical: 2,
  },
  radioButtonSelected: {
    backgroundColor: "#4D92AD",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default DynamicForm;
