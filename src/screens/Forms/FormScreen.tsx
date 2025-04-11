// FormScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList, "FormScreen">;
const { width, height } = Dimensions.get("window");
interface FormData {
  id: string;
  title: string;
  creationDate?: string;
  fields?: any[];
}

const FormScreen: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const navigation = useNavigation<FormScreenNavigationProp>();

  useEffect(() => {
    const loadForms = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const formKeys = keys.filter((key) => key.startsWith("form_"));
      const formEntries = await AsyncStorage.multiGet(formKeys);
      const loadedForms = formEntries.map(([_, value]) => value && JSON.parse(value));
      setForms(loadedForms.filter(Boolean));
    };

    const unsubscribe = navigation.addListener("focus", loadForms);
    return unsubscribe;
  }, [navigation]);

  const deleteForm = (id: string) => {
    Alert.alert("¿Eliminar formulario?", "Esta acción no se puede deshacer.", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const updatedForms = forms.filter((form) => form.id !== id);
          setForms(updatedForms);
          await AsyncStorage.removeItem(`form_${id}`);
        },
      },
    ]);
  };

  const editForm = async (id: string) => {
    const formJson = await AsyncStorage.getItem(`form_${id}`);
    if (formJson) {
      const formToEdit = JSON.parse(formJson);
      navigation.navigate("FormBuilderScreen", { formToEdit });
    } else {
      Alert.alert("Error", "No se pudo cargar el formulario.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis formularios</Text>
      <FlatList
        data={forms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.formItem}>
            <Text style={styles.formTitle}>{item.title}</Text>
            {item.creationDate && (
              <Text style={styles.metaText}>Creado: {new Date(item.creationDate).toLocaleDateString()}</Text>
            )}
            {item.fields && (
              <Text style={styles.metaText}>Campos: {item.fields.length}</Text>
            )}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editForm(item.id)} style={styles.editBtn}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteForm(item.id)} style={styles.deleteBtn}>
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay formularios guardados.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  formItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: "#1e88e5",
    padding: 8,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: "#e53935",
    padding: 8,
    borderRadius: 4,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#999",
  },
});

export default FormScreen;
