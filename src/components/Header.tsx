"use client"

import Image from "next/image";
import Link from "next/link";
import { HStack } from "@chakra-ui/react";
import SearchBox from "@/components/SearchBox";

export default function Header() {
  return (
    <HStack as="nav" px={6} py={4} justify="space-between">
      <Link href="/">
        <Image src="/images/logo.svg" alt="Logo" width={160} height={35} />
      </Link>
      <SearchBox />
    </HStack>
  );
}
