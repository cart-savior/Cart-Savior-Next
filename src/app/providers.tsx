"use client";

import { ChakraProvider, StyleFunctionProps, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      50: "#f2f8f1",
      400: "#4ea38e",
    },
  },
  components: {
    Button: {
      variants: {
        brand: (props: StyleFunctionProps) => ({
          bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.50',
          color: props.colorMode === 'dark' ? 'white' : 'brand.400',
        }),
        brand_light: (props: StyleFunctionProps) => ({
          bg: props.colorMode === 'dark' ? 'brand.50' : 'brand.400',
          color: props.colorMode === 'dark' ? 'brand.400' : 'white',
        }),
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
