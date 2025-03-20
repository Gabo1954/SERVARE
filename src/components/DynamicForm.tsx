import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const DynamicForm = ({ route }: any) => {
  const { formId } = route.params;
  const [form, setForm] = useState<{ title: string; fields: any[] } | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  // Esquema de validación con Yup
  const schema = Yup.object().shape({
    Nombre_Completo: Yup.string().required("El nombre es obligatorio").min(3, "Debe tener al menos 3 caracteres"),
    email: Yup.string().email("Debe ser un correo válido").required("El correo es obligatorio"),
    edad: Yup.number().typeError("Debe ser un número").positive("Debe ser un número positivo"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const loadForm = async () => {
      const savedForm = await AsyncStorage.getItem(`form_${formId}`);
      if (savedForm) {
        setForm(JSON.parse(savedForm));
      }
    };
    loadForm();
  }, [formId]);

  const onSubmit = (data: any) => {
    console.log("Formulario Enviado:", data);
    Alert.alert("Datos enviados", JSON.stringify(data, null, 2));
  };

  if (!form) {
    return <Text>Cargando formulario...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{form.title}</Text>

      {form.fields.map((field, index) => {
        const fieldKey = field.label.replace(/\s+/g, "_") as keyof typeof errors; // Corrección aquí

        return (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>

            {["text", "email", "number"].includes(field.type) && (
              <Controller
                control={control}
                name={field.label.replace(/\s+/g, "_")}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      style={styles.input}
                      keyboardType={field.type === "number" ? "numeric" : "default"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={`Ingrese ${field.label}`}
                    />
                    {errors[fieldKey]?.message && (
                      <Text style={styles.error}>{errors[fieldKey]?.message}</Text>
                    )}
                  </>
                )}
              />
            )}
          </View>
        );
      })}

      <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  fieldContainer: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  error: { color: "red", fontSize: 12, marginTop: 2 },
});

export default DynamicForm;
