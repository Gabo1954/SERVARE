import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormStructure {
  id: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  label: string;
  type: string;
  // ... otras propiedades según tu estructura
}

export const saveFormResponse = async (formId: string, data: any) => {
  try {
    const responses = await AsyncStorage.getItem(`responses_${formId}`) || '[]';
    const newResponses = [...JSON.parse(responses), data];
    await AsyncStorage.setItem(`responses_${formId}`, JSON.stringify(newResponses));
  } catch (error) {
    console.error('Error saving form response:', error);
    throw new Error('Failed to save form response');
  }
};

export const loadFormStructure = async (formId: string): Promise<FormStructure> => {
  try {
    const formData = await AsyncStorage.getItem(`form_${formId}`) || '{}';
    return JSON.parse(formData) as FormStructure;
  } catch (error) {
    console.error('Error loading form structure:', error);
    throw new Error('Form not found or invalid format');
  }
};