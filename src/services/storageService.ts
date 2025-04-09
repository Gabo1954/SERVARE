import AsyncStorage from '@react-native-async-storage/async-storage';

// Definición de interfaces
interface Alteration {
  codigo: string;
  nombre: string;
  descripcion: string;
  materialidad: string[];
}

interface Materiality {
  codigo: string;
  nombre: string;
  categoria: string;
}

interface FormData {
  id: string;
  projectId?: string;
  title: string;
  questions: any[]; // Usar interfaz más específica si está disponible
  // ... otras propiedades según tu estructura
}

// Datos iniciales
const initialAlterations: Alteration[] = [
  {
    codigo: 'ALT-001',
    nombre: 'Alteración Cromática',
    descripcion: 'Cambios en el color original del material',
    materialidad: ['MAT-001', 'MAT-002']
  }
];

const initialMaterialities: Materiality[] = [
  {
    codigo: 'MAT-001',
    nombre: 'Madera',
    categoria: 'Orgánicos'
  }
];

export const initializeAppData = async () => {
  try {
    if (!(await AsyncStorage.getItem('alterations'))) {
      await AsyncStorage.setItem('alterations', JSON.stringify(initialAlterations));
    }
    
    if (!(await AsyncStorage.getItem('materialities'))) {
      await AsyncStorage.setItem('materialities', JSON.stringify(initialMaterialities));
    }
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};

export const saveForm = async (form: FormData) => {
  try {
    await AsyncStorage.setItem(`form_${form.id}`, JSON.stringify(form));
  } catch (error) {
    console.error('Error saving form:', error);
    throw new Error('Failed to save form');
  }
};

export const loadFormsByProject = async (projectId: string): Promise<FormData[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const formKeys = keys.filter(k => k.startsWith('form_'));
    const formsData = await AsyncStorage.multiGet(formKeys);
    
    return formsData
      .filter(([_, value]) => value !== null)
      .map(([_, value]) => JSON.parse(value!) as FormData)
      .filter(f => f.projectId === projectId);
  } catch (error) {
    console.error('Error loading forms:', error);
    return [];
  }
};