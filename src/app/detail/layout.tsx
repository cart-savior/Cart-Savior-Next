import { Suspense } from "react";
import { Container } from "@chakra-ui/react";
import Page from "@/app/detail/page";
import Loading from "@/app/detail/loading";

export default function Layout() {
  return (
    <Suspense fallback={<Loading />}>
      <Container maxW="container.lg" px={2}>
        <Page />
      </Container>
    </Suspense>
  );
}
