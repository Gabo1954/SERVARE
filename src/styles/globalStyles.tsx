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
