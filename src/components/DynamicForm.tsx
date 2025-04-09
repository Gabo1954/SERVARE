import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase"; // Asegúrate de tener esta importación configurada correctamente

interface FormData {
  Nombre_Completo: string;
  email: string;
  edad?: number;
  Imagen_Alteracion?: string;
}

const DynamicForm = ({ route }: any) => {
  const { formId } = route.params;  // Obtén el formId del parámetro de la ruta
  const [form, setForm] = useState<{ title: string; fields: any[] } | null>(null);
  const [formData, setFormData] = useState<FormData>({} as FormData);

  // Definir el esquema de validación con Yup
  const schema = Yup.object().shape({
    Nombre_Completo: Yup.string().required("El nombre es obligatorio").min(3, "Debe tener al menos 3 caracteres"),
    email: Yup.string().email("Debe ser un correo válido").required("El correo es obligatorio"),
    edad: Yup.number().typeError("Debe ser un número").positive("Debe ser un número positivo"),
    // Agregar más campos de validación si es necesario
  });

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Cargar el formulario desde Firestore
  useEffect(() => {
    const loadForm = async () => {
      try {
        const formDoc = doc(db, 'formularios', formId);  // 'formularios' es la colección en Firestore
        const formSnapshot = await getDoc(formDoc); // Usamos getDoc en lugar de get
        if (formSnapshot.exists()) {
          setForm(formSnapshot.data() as { title: string; fields: any[] });
        } else {
          console.log('Formulario no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar formulario desde Firestore:', error);
      }
    };

    loadForm();
  }, [formId]);

  // Enviar el formulario
  const onSubmit = (data: FormData) => {
    console.log("Formulario Enviado:", data);
    Alert.alert("Datos enviados", JSON.stringify(data, null, 2));
  };

  // Manejo de la selección de imágenes
  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      if (selectedImage?.uri) {
        setFormData({ ...formData, Imagen_Alteracion: selectedImage.uri });
      }
    }
=======
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
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
  };

  if (!form) {
    return <Text>Cargando formulario...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{form.title}</Text>

<<<<<<< HEAD
      {/* Renderizar los campos del formulario dinámicamente */}
      {form.fields.map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field.name}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={field.placeholder || "Ingrese un valor"}
              />
              {/* Manejo de errores */}
              {errors[field.name as keyof FormData] && <Text style={styles.error}>{(errors[field.name as keyof FormData] as any)?.message}</Text>}
            </View>
          )}
        />
      ))}

      {/* Botón para seleccionar una imagen */}
      <TouchableOpacity onPress={handleImagePicker}>
        <Text>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {formData.Imagen_Alteracion && <Text>Imagen seleccionada: {formData.Imagen_Alteracion}</Text>}

      <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
=======
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
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  inputContainer: { marginBottom: 10 },
  inputLabel: { fontSize: 14, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  error: { color: "red", fontSize: 12, marginTop: 2 },
=======
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
>>>>>>> 31649b0 (Primer commit desde la rama Gabriel)
});

export default DynamicForm;
