"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "#f9f8f4",
        color: "#2d2a26",
      },
      body: {
        lineHeight: "1.5",
      },
    },
  },
  fonts: {
    heading: "var(--font-dm-sans)",
    body: "var(--font-nunito)",
  },
  colors: {
    brand: {
      50: "#f0f5f2",
      100: "#d9e6dd",
      200: "#b8cfc2",
      300: "#8fb39f",
      400: "#6b9b8a",
      500: "#517d6d",
      600: "#3f6356",
      700: "#355048",
      800: "#2d423a",
      900: "#273731",
    },
    study: {
      cream: "#f5f3ef",
      paper: "#faf9f7",
      sage: "#6b9b8a",
      sageMuted: "#8fb39f",
      ink: "#2d2a26",
      inkMuted: "#6b6560",
      border: "#e8e6e1",
    },
  },
  shadows: {
    soft: "0 2px 12px rgba(45, 42, 38, 0.06)",
    card: "0 4px 20px rgba(45, 42, 38, 0.08)",
    cardHover: "0 16px 38px rgba(45, 42, 38, 0.12)",
  },
  radii: {
    card: "1rem",
    button: "0.75rem",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "0.75rem",
        fontWeight: "600",
        transition: "all 0.18s ease",
      },
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
            transform: "translateY(-1px)",
            boxShadow: "soft",
          },
          _active: {
            bg: "brand.700",
            transform: "translateY(0)",
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "study.border",
            bg: "study.paper",
            _placeholder: { color: "study.inkMuted" },
            _focus: {
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
            },
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        letterSpacing: "-0.02em",
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "600",
      },
    },
    Progress: {
      baseStyle: {
        track: {
          borderRadius: "full",
          bg: "study.border",
        },
        filledTrack: {
          borderRadius: "full",
          transition: "width 0.5s ease",
        },
      },
    },
  },
});

export default function Providers({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
