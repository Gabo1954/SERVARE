import { StyleSheet } from "react-native";
import { colors } from "./colors"; // Importa los colores

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    color: colors.textPrimary,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonPrimary,
    padding: 12,
    borderRadius: 20,
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  sidebar: {
    width: "30%",
    padding: 10,
    backgroundColor: "#e9f7f1",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  formContainer: {
    padding: 10,
    width: "70%",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  field: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 5,
    borderRadius: 5,
  },
  placeholder: {
    marginTop: 8,
    color: "#666",
    fontStyle: "italic",
  },
});
