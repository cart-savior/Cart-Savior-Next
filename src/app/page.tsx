"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Flex, Heading, Link, Text, HStack } from "@chakra-ui/react";
import SearchBox from "@/components/SearchBox";
import "./page.module.scss";

const RANDOM_KEYS = [
  "쌀",
  "찹쌀",
  "콩",
  "팥",
  "녹두",
  "고구마",
  "감자",
  "배추",
  "양배추",
  "시금치",
  "상추",
  "얼갈이배추",
  "수박",
  "참외",
  "오이",
  "호박",
  "토마토",
  "무",
  "당근",
  "열무",
  "건고추",
  "풋고추",
  "붉은고추",
  "양파",
  "파",
  "생강",
  "고춧가루",
  "미나리",
  "깻잎",
  "피망",
  "파프리카",
  "깐마늘",
  "방울토마토",
  "참깨",
  "땅콩",
  "느타리버섯",
  "팽이버섯",
  "새송이버섯",
  "호두",
  "아몬드",
  "사과",
  "바나나",
  "참다래",
  "파인애플",
  "오렌지",
  "레몬",
  "건포도",
  "건블루베리",
  "망고",
  "소고기",
  "돼지고기",
  "닭고기",
  "계란",
  "우유",
  "고등어",
  "꽁치",
  "갈치",
  "명태",
  "물오징어",
  "건멸치",
  "건오징어",
  "김",
  "건미역",
  "새우젓",
  "멸치액젓",
  "굵은소금",
  "전복",
  "새우",
];

export default function Home() {
  const [randomKeys, setRandomKeys] = useState<string[]>([]);

  useEffect(() => {
    setRandomKeys(RANDOM_KEYS.sort(() => Math.random() - 0.5).slice(0, 3));
  }, []);

  return (
    <Box as="section" w="100vw">
      <Flex
        direction={{ base: "column-reverse", md: "row" }}
        justifyContent="space-between"
        mt={{ base: 16, md: 32 }}
        mx={4}
        gap={16}
      >
        <Box
          display="flex"
          flexDir="column"
          flex="1"
          ml={{ base: 4, md: 16 }}
          justifyContent="center"
        >
          <Heading as="h2" size="2xl" mb={4} lineHeight={1.2}>
            장보기 전,
            <br />
            이제는{" "}
            <Text as="span" color="brand.500">
              시세
            </Text>{" "}
            먼저 보자
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={4}>
            카트 세이버로 농산물, 수산물, 축산물 등 다양한 식재료의 시세를
            한눈에 확인하세요.
          </Text>
          <SearchBox />
          <HStack pt={4} gap={4}>
            {randomKeys.map((key) => (
              <Link
                key={key}
                href={`/search/${key}`}
                px={3}
                py={1}
                borderRadius="md"
                bg="brand.500"
                color="white"
              >
                # {key}
              </Link>
            ))}
          </HStack>
        </Box>
        <Box mr={-4}>
          <Image src="/images/main.svg" alt="" width={600} height={481} />
        </Box>
      </Flex>
    </Box>
  );
}
