"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "@/context/auth-context";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#fdf6ee",
      100: "#f9e8d0",
      200: "#f3d0a0",
      300: "#ecb56a",
      400: "#e59a3f",
      500: "#c97c28",
      600: "#a6601e",
      700: "#834918",
      800: "#623613",
      900: "#42240d",
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "transparent",
      },
    },
  },
});

export default function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
}
