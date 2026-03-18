"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "@/context/auth-context";

const theme = extendTheme({
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
