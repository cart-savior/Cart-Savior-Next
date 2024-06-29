import { Suspense } from "react";
import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import { Flex, Spacer, Text } from "@chakra-ui/react";
import Header from "@/components/Header";
import { Providers } from "./providers";
import Loading from "./loading";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '카트 세이버',
  description: '장보기 전, 이제는 시세 먼저 보자',
  icons: [
    { url: '/images/favicon.ico', rel: 'icon' },
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Flex direction="column" bgColor="white" minH="100vh" backgroundImage="/images/background.svg" backgroundSize="cover">
            <Header />
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
            <Spacer />
            <Text textAlign="center" color="gray.600" fontSize="md" py={4}>
              © 2024 cart savior.
            </Text>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
