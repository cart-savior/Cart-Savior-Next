import { Box, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      color="gray.500"
      fontSize="xl"
    >
      <Spinner size="xl" mr={4} />
      Loading...
    </Box>
  );
}
