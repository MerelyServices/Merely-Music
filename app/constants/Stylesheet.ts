import { StyleSheet } from "react-native";
import Colors from "./Colors";

export const baseStyles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    marginRight: 15,
  },
  container: {
    marginHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 14,
  },
  smallTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'grey',
    marginTop: -10,
  },
  paragraph: {
    marginTop: 14,
  },
  note: {
    marginTop: 14,
    maxWidth: '80%',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    marginTop: 14,
  },
  link: {
    marginTop: 14,
  },
  linkText: {
    fontSize: 18,
    color: Colors.action,
  },
  dangerLinkText: {
    fontSize: 18,
    color: Colors.danger,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.bg,
  },
  buttonText: {
    color: 'white'
  }
});