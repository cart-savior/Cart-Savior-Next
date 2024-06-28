"use client";

import { Suspense } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Box, Container, HStack } from "@chakra-ui/react";
import SearchBox from "@/components/SearchBox";
import { Providers } from "./providers";
import "./globals.scss";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Box bgColor="brand.50" minH="100vh">
            <HStack as="nav" px={6} py={4} justify="space-between">
              <Link href="/">
                <Image src="/images/logo_pc.svg" alt="Logo" width={160} height={50} />
              </Link>
              <SearchBox />
            </HStack>
            <Suspense fallback={<Loading />}>
              <Container maxW="container.xl">{children}</Container>
            </Suspense>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
