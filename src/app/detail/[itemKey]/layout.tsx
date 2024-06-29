import { Suspense } from "react";
import { Container } from "@chakra-ui/react";
import Page from "@/app/detail/[itemKey]/page";
import Loading from "@/app/detail/[itemKey]/loading";

export default function Layout({ params }: { params: { itemKey: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <Container maxW="container.lg" px={2}>
        <Page params={params} />
      </Container>
    </Suspense>
  )
}

