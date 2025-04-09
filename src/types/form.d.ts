import { NavigatorScreenParams } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

declare type RootStackParamList = {
  Auth: undefined;
  Admin: NavigatorScreenParams<AdminStackParamList>;
  User: NavigatorScreenParams<UserStackParamList>;
};

declare type AdminStackParamList = {
  AdminDashboard: undefined;
  FormBuilder: { projectId?: string };
  ProjectManager: undefined;
};

declare type UserStackParamList = {
  UserDashboard: undefined;
  DynamicForm: { formId: string };
};

declare type FormField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'linearScale' | 'image' | 'section' | 'alteration' | 'materiality';
  required: boolean;
  options?: string[];
  linearScale?: { min: number; max: number; minLabel?: string; maxLabel?: string };
};
declare type FormField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'linearScale' | 'image' | 'section' | 'alteration' | 'materiality';
  required: boolean;
  options?: string[];
  linearScale?: { min: number; max: number; minLabel?: string; maxLabel?: string };
};

declare type FormData = {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  questions: FormField[];
};

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Auth: undefined;
      Admin: undefined;
      User: undefined;
      ProjectManager: { projectId?: string };
      FormBuilder: { projectId?: string };
      DynamicForm: { formId: string };
    }
  }
}

declare type Alteration = {
  codigo: string;
  nombre: string;
  // Agrega otros campos si son necesarios
};

declare type Materiality = {
  codigo: string;
  nombre: string;
  // Agregar más propiedades si son necesarias
};