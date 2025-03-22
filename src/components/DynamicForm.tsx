import React, { useEffect, useState } from "react";
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
  };

  if (!form) {
    return <Text>Cargando formulario...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{form.title}</Text>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  inputContainer: { marginBottom: 10 },
  inputLabel: { fontSize: 14, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  error: { color: "red", fontSize: 12, marginTop: 2 },
});

export default DynamicForm;
