"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "#0f172a",
        color: "#e2e8f0",
      },
    },
  },
  fonts: {
    heading: "var(--font-space-grotesk)",
    body: "var(--font-manrope)",
  },
  colors: {
    brand: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
  },
});

export default function Providers({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
