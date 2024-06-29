import { Box, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgColor="#F8FFF9"
      color="gray.500"
      fontSize="lg"
    >
      <Spinner size="lg" mr={4} />
      Loading...
    </Box>
  );
}
