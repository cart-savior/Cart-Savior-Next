"use client";

import { ChakraProvider, StyleFunctionProps, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#F5FCF6',
      100: '#EAF5EA',
      200: '#a7d6c2',
      300: '#86c5ac',
      400: '#65b597',
      500: '#4c9c80',
      600: '#3a7965',
      700: '#275645',
      800: '#143526',
      900: '#001408',
    }
  },
  components: {
    Button: {
      variants: {
        brand: (props: StyleFunctionProps) => ({
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.50',
          color: props.colorMode === 'dark' ? 'white' : 'brand.500',
        }),
        brand_light: (props: StyleFunctionProps) => ({
          bg: props.colorMode === 'dark' ? 'brand.50' : 'brand.500',
          color: props.colorMode === 'dark' ? 'brand.500' : 'white',
        }),
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
