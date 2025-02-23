import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Text } from "react-native-paper";

const FormScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log("Datos del formulario:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Patrimonio</Text>

      <Controller
        control={control}
        name="nombre"
        rules={{ required: "El nombre es obligatorio" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
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
        <Text style={styles.error}>{(errors.nombre as any).message}</Text>
      )}

      <Button title="Guardar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default FormScreen;
