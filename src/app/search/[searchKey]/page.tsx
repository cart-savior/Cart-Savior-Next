"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Link,
  Button,
  Icon,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { ItemSummary } from "@/types/item";
import styles from "@/app/icons.module.scss";

const LIST = [
  {
    item_code: "100",
    item_name: "쌀",
    kind_name: "백미",
    item_price: 10000,
    rank: "상품",
    diff: 1000,
    date: "2021-10-01",
  },
  {
    item_code: "200",
    item_name: "찹쌀",
    kind_name: "찹쌀",
    item_price: 15000,
    rank: "상품",
    diff: -500,
    date: "2021-10-01",
  },
  {
    item_code: "300",
    item_name: "콩",
    kind_name: "콩",
    item_price: 8000,
    rank: "상품",
    diff: 0,
    date: "2021-10-01",
  },
  {
    item_code: "400",
    item_name: "팥",
    kind_name: "팥",
    item_price: 12000,
    rank: "상품",
    diff: 2000,
    date: "2021-10-01",
  },
  {
    item_code: "500",
    item_name: "녹두",
    kind_name: "녹두",
    item_price: 7000,
    rank: "상품",
    diff: -1000,
    date: "2021-10-01",
  },
];

async function getData(keyword: string): Promise<ItemSummary[]> {
  const res = await fetch(`/api/items?keyword=${keyword}`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function SearchPage({
  params,
}: {
  params: { searchKey: string };
}) {
  const [data, setData] = useState<ItemSummary[]>([]);
  const searchKey = decodeURIComponent(params.searchKey);
  console.log(data, searchKey);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getData(searchKey);
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <>
      <Heading as="h2" size="md" mt={10}>
        <Text as="span" color="brand.500">
          {searchKey}
        </Text>{" "}
        키워드로 검색한&nbsp;
        <Text as="span" color="brand.500">
          {LIST.length}개
        </Text>
        의 결과입니다.
      </Heading>
      <Skeleton isLoaded={data.length > 0} height={48}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={6}>
          {data.map((info, index) => (
            <Box key={index} p={6} bgColor="white" rounded="lg" boxShadow="md">
              <Link
                href={`/detail/${info.itemName}`}
                className={`${styles.item_info} ${
                  styles[`type_${info.itemCode}`]
                }`}
                mb={4}
                display="block"
              >
                <Heading as="h3" size="md">
                  {info.itemName} ({info.rank})
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {info.kindName}
                </Text>
              </Link>
              <Box mb={4}>
                <Text fontSize="xl" fontWeight="700" color="brand.500">
                  1000원
                </Text>
                {/* TODO: API에 가격이 없음. info.item_price.toLocaleString() */}
                <Text color="gray.500" fontWeight="700">
                  {info.diffWeekAgo > 0 && (
                    <>
                      일주일 전보다&nbsp;
                      <Text as="span" color="red.500">
                        {info.diffWeekAgo.toLocaleString()}원&nbsp;
                        <Icon
                          as={TrendingUp}
                          boxSize={7}
                          verticalAlign="middle"
                        />
                      </Text>
                    </>
                  )}
                  {info.diffWeekAgo < 0 && (
                    <>
                      일주일 전보다&nbsp;
                      <Text as="span" color="blue.500">
                        {info.diffWeekAgo.toLocaleString()}원&nbsp;
                        <Icon
                          as={TrendingDown}
                          boxSize={7}
                          verticalAlign="middle"
                        />
                      </Text>
                    </>
                  )}
                  {info.diffWeekAgo === 0 && (
                    <Text as="span">일주일 전과 가격이 동일합니다.</Text>
                  )}
                </Text>
              </Box>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="sm" color="gray.500">
                  {new Date(info.searchDate).toLocaleDateString("ko-KR", {
                    year: "2-digit",
                    month: "numeric",
                    day: "numeric",
                  })}{" "}
                  / 1kg 기준
                </Text>
                <Button
                  as={Link}
                  href={`/detail/?itemCode=${info.itemCode}&date=${info.searchDate}`}
                  variant="brand_light"
                >
                  자세히 보기
                </Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Skeleton>
    </>
  );
}
