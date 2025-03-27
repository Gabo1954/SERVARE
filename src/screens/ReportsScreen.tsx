// ReportsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type ReportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReportsScreen'>;

interface Props {
  navigation: ReportsScreenNavigationProp;
}

interface Reporte {
  id_reporte: string;
  nombre: string;
  tipo: string;
  fecha_creación: string;
}

const ReportsScreen: React.FC<Props> = ({ navigation }) => {
  const [reportes, setReportes] = useState<Reporte[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const storedReports = await AsyncStorage.getItem("reportes");
    if (storedReports) {
      setReportes(JSON.parse(storedReports));
    }
  };

  const renderReporte = ({ item }: { item: Reporte }) => (
    <TouchableOpacity style={styles.reportItem} onPress={() => Alert.alert("Reporte", `Accediendo a ${item.nombre}`)}>
      <Text style={styles.reportName}>{item.nombre}</Text>
      <Text style={styles.reportDetails}>{item.tipo} - {new Date(item.fecha_creación).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes</Text>
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id_reporte}
        renderItem={renderReporte}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay reportes disponibles</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  reportItem: { padding: 15, backgroundColor: "#f0f0f0", borderRadius: 8, marginBottom: 10 },
  reportName: { fontSize: 18, fontWeight: "bold" },
  reportDetails: { fontSize: 14, color: "#555" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
});

export default ReportsScreen;
