
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ajustar

/**
 * Función genérica para generar y compartir un archivo Excel.
 * @param data - Matriz de datos (la primera fila son las cabeceras).
 * @param sheetName - Nombre de la hoja en el Excel.
 * @param fileName - Nombre del archivo Excel.
 */
const generateExcel = async (data: any[][], sheetName: string, fileName: string) => {
  try {
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const uri = FileSystem.cacheDirectory + fileName;
    await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Compartir archivo Excel',
      UTI: 'com.microsoft.excel.xlsx',
    });
  } catch (error) {
    console.error('Error al generar el Excel:', error);
  }
};


// 1. Materiales
export const generateMaterialesExcel = async () => {
  try {
    const ref = collection(db, "materiales");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Nombre', 'Descripción', 'Valor', 'Fecha de Registro']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.nombre,
        info.descripcion,
        info.valor,
        info.fechaRegistro
      ]);
    });
    await generateExcel(data, 'Materiales', 'Materiales.xlsx');
  } catch (error) {
    console.error("Error en Materiales:", error);
  }
};

// 2. Alteraciones
export const generateAlteracionesExcel = async () => {
  try {
    const ref = collection(db, "alteraciones");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Tipo', 'Fecha', 'Detalle', 'Responsable']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.tipo,
        info.fecha,
        info.detalle,
        info.responsable
      ]);
    });
    await generateExcel(data, 'Alteraciones', 'Alteraciones.xlsx');
  } catch (error) {
    console.error("Error en Alteraciones:", error);
  }
};

// 3. Incidencia
export const generateIncidenciaExcel = async () => {
  try {
    const ref = collection(db, "incidencia");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Evento', 'Fecha', 'Ubicación', 'Descripción']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.evento,
        info.fecha,
        info.ubicacion,
        info.descripcion
      ]);
    });
    await generateExcel(data, 'Incidencia', 'Incidencia.xlsx');
  } catch (error) {
    console.error("Error en Incidencia:", error);
  }
};

// 4. Extensión
export const generateExtensionExcel = async () => {
  try {
    const ref = collection(db, "extension");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Área', 'Volumen', 'Unidad']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.area,
        info.volumen,
        info.unidad
      ]);
    });
    await generateExcel(data, 'Extensión', 'Extension.xlsx');
  } catch (error) {
    console.error("Error en Extensión:", error);
  }
};

// 5. Estado de Conservación
export const generateEstadoConservacionExcel = async () => {
  try {
    const ref = collection(db, "estadoConservacion");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Estado', 'Cálculo', 'Observaciones', 'Fecha de Inspección']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.estado,
        info.calculo,
        info.observaciones,
        info.fechaInspeccion
      ]);
    });
    await generateExcel(data, 'Estado de Conservación', 'EstadoConservacion.xlsx');
  } catch (error) {
    console.error("Error en Estado de Conservación:", error);
  }
};

// 6. Vulnerabilidad Mat/Alt
export const generateVulnerabilidadExcel = async () => {
  try {
    const ref = collection(db, "vulnerabilidad");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Material', 'Nivel de Riesgo', 'Observaciones']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.material,
        info.nivelRiesgo,
        info.observaciones
      ]);
    });
    await generateExcel(data, 'Vulnerabilidad Mat/Alt', 'Vulnerabilidad.xlsx');
  } catch (error) {
    console.error("Error en Vulnerabilidad:", error);
  }
};

// 7. Factores de Riesgo
export const generateFactoresRiesgoExcel = async () => {
  try {
    const ref = collection(db, "factoresRiesgo");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Factor', 'Impacto', 'Medidas Preventivas']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.factor,
        info.impacto,
        info.medidas
      ]);
    });
    await generateExcel(data, 'Factores de Riesgo', 'FactoresRiesgo.xlsx');
  } catch (error) {
    console.error("Error en Factores de Riesgo:", error);
  }
};

// 8. Dinámica del Deterioro
export const generateDinamicaDeterioroExcel = async () => {
  try {
    const ref = collection(db, "dinamicaDeterioro");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Patrón', 'Velocidad', 'Factores']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.patron,
        info.velocidad,
        info.factores
      ]);
    });
    await generateExcel(data, 'Dinámica del Deterioro', 'DinamicaDeterioro.xlsx');
  } catch (error) {
    console.error("Error en Dinámica del Deterioro:", error);
  }
};

// 9. Condiciones Ambientales
export const generateCondicionesAmbientalesExcel = async () => {
  try {
    const ref = collection(db, "condicionesAmbientales");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Humedad', 'Temperatura', 'Otros']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.humedad,
        info.temperatura,
        info.otros
      ]);
    });
    await generateExcel(data, 'Condiciones Ambientales', 'CondicionesAmbientales.xlsx');
  } catch (error) {
    console.error("Error en Condiciones Ambientales:", error);
  }
};

// 10. Condiciones Externas
export const generateCondicionesExternasExcel = async () => {
  try {
    const ref = collection(db, "condicionesExternas");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Ubicación', 'Riesgo', 'Observaciones']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.ubicacion,
        info.riesgo,
        info.observaciones
      ]);
    });
    await generateExcel(data, 'Condiciones Externas', 'CondicionesExternas.xlsx');
  } catch (error) {
    console.error("Error en Condiciones Externas:", error);
  }
};

// 11. Historial de Intervenciones
export const generateHistorialIntervencionesExcel = async () => {
  try {
    const ref = collection(db, "historialIntervenciones");
    const querySnapshot = await getDocs(ref);
    const data = [['ID', 'Fecha', 'Técnica', 'Resultados']];
    querySnapshot.forEach(doc => {
      const info = doc.data();
      data.push([
        doc.id,
        info.fecha,
        info.tecnica,
        info.resultados
      ]);
    });
    await generateExcel(data, 'Historial de Intervenciones', 'HistorialIntervenciones.xlsx');
  } catch (error) {
    console.error("Error en Historial de Intervenciones:", error);
  }
};
