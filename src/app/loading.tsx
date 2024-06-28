import { Box, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="red.500"
      color="white"
      fontSize="xl"
    >
      <Spinner size="xl" />
      Loading...
    </Box>
  );
}
