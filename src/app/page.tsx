"use client";

import Image from "next/image";
import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Link,
  Text,
} from "@chakra-ui/react";
import "./page.module.scss";
import SearchBox from "./searchBox";

const RANDOM_KEYS = ['쌀', '찹쌀', '콩', '팥', '녹두', '고구마', '감자', '배추', '양배추', '시금치', '상추',
'얼갈이배추', '수박', '참외', '오이', '호박', '토마토', '무', '당근', '열무',
'건고추', '풋고추', '붉은고추', '양파', '파', '생강', '고춧가루', '미나리', '깻잎', '피망',
'파프리카', '깐마늘', '방울토마토', '참깨', '땅콩', '느타리버섯', '팽이버섯',
'새송이버섯', '호두', '아몬드', '사과', '바나나', '참다래', '파인애플', '오렌지',
'레몬', '건포도', '건블루베리', '망고', '쇠고기', '돼지고기', '닭고기', '계란', '우유',
'고등어', '꽁치', '갈치', '명태', '물오징어', '건멸치', '건오징어', '김', '건미역',
'새우젓', '멸치액젓', '굵은소금', '전복', '새우']

export default function Home() {
  const randomKeys = (() => {
    return RANDOM_KEYS.sort(() => Math.random() - 0.5).slice(0, 3)
  })();
  return (
    <Box as="section" h="100vh">
      <Flex direction={{ base: "column", md: "row" }} className="main_wrap">
        <Box display="flex" flexDir="column" flex="1" p="4" justifyContent="center">
          <Heading as="h2" size="lg" mb="4">
            장보기 전,<br />이제는 <Text as="span" color="green.400">시세</Text>먼저 보자.
          </Heading>
          <SearchBox />
          <List className="hash_list" pt="4" display="flex" flexWrap="wrap">
            {randomKeys.map((key) => (
              <ListItem className="hash_item" key={key} mr="2" mb="2">
                <Link href={`/search/${key}`} px="2" py="1" borderRadius="md" bg="green.500" color="white">
                  # {key}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flex="2" p="4" className="flex-item">
          <Image src="/images/img_main.png" alt="" width={800} height={600} />
        </Box>
      </Flex>
    </Box>
  );
}
