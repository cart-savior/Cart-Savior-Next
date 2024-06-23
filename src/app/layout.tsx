"use client";

import { Inter } from "next/font/google";
import "./globals.scss";
import { Providers } from "./providers";
import { Box, Container, HStack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import SearchBox from "./searchBox";
import { Space } from "lucide-react";

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
            <Container maxW="container.xl">{children}</Container>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
