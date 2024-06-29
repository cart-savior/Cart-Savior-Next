"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Link,
  Select,
  Icon,
  HStack,
  Divider,
  VStack,
  Skeleton,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  Popover,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingDown, TrendingUp, CircleHelp, Bot } from 'lucide-react';
import { ItemTips } from '@/types/item';
import styles from "@/app/icons.module.scss";

const item = {
  item_code: "123456",
  item_name: "쌀",
  kind_name: "백미",
  rank: "A",
  date: "2021-09-01",
  item_price: 10000,
  diff: 1000,
  last_week: 9000,
  last_month: 8000,
  last_year: 7000,
  last_week_date: "2021-08-25",
  last_month_date: "2021-08-01",
  last_year_date: "2020-09-01",
  wiki: "쌀은 밥의 원료로 사용되는 곡식입니다."
};

type Unit = '1kg' | '500g' | '100g' | '1g';

async function getData(itemName: string): Promise<ItemTips> {
  const res = await fetch(`/api/itemTips?itemName=${itemName}`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default function DetailPage({ params }: { params: { itemKey: string } }) {
  const [unit, setUnit] = useState<Unit>('1kg');
  const [itemTipsData, setItemTipsData] = useState<ItemTips>();
  const itemKey = decodeURIComponent(params.itemKey);
  console.log(itemTipsData, itemKey);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getData(itemKey);
      setItemTipsData(result);
    }
    fetchData();
  }, [])
  console.log('itemTipsData', itemTipsData)

  const changeUnit = (price: number) => {
    if (unit === '1g') {
      return price / 1000;
    } else if (unit === '500g') {
      return price / 2;
    } else if (unit === '100g') {
      return price / 10;
    } else {
      return price;
    }
  }

  const handleSelectUnit = (value: string) => {
    setUnit(value as Unit);
  }

  const data = [
    { name: '오늘', value: item.item_price },
    { name: '지난주', value: item.last_week },
    { name: '지난달', value: item.last_month },
    { name: '작년', value: item.last_year }
  ];

  const CustomLabel = ({ x = 0, y = 0, value = '' }) => (
    <text x={x + 25} y={y} dy={-10} textAnchor="middle" fill="#4ea38e" fontSize="14px" fontWeight="bold">
    {value} 원
  </text>
  );

  return (
    <Box as="section" p={4}>
      <Box mb={4} className={`${styles.item_info} ${styles[`type_${item.item_code}`]}`} display="block">
        <Heading as="h3" size="md">{item.item_name} ({item.rank})</Heading>
        <Text fontSize="sm" color="gray.600">{item.kind_name}</Text>
      </Box>
      <Skeleton isLoaded={!!item}>
        <Grid templateColumns='repeat(3, 1fr)' gap={4} mb={4}>
          <GridItem
            colSpan={{ base: 3, md: 1 }}
            display="flex"
            flexDir="column"
            alignItems="flex-start"
            height="full"
            p={4}
            bg="white"
            rounded="lg"
            boxShadow="md"
          >
            <Text as="span" color="gray.500">
              {new Date(item.date).toLocaleDateString('ko-KR', { year: '2-digit', month: 'numeric', day: 'numeric' })} / 1kg 기준
            </Text>
            <Text fontSize="x-large" fontWeight="bold" mt={4}>
              평균가는<br />
              <Text as="span" color="brand.500">{item.item_price.toLocaleString()}원</Text>
              &nbsp;입니다.
            </Text>
            <Text fontSize="x-large" fontWeight="bold" mt={4}>
              지난주 보다<br />
              {item.diff > 0 && (
                <Text as="span" color="red.500">
                  {item.diff.toLocaleString()}원&nbsp;
                  더 비싸요.
                  <Icon as={TrendingUp} boxSize={7} verticalAlign="middle" />
                </Text>
              )}
              {item.diff < 0 && (
                <Text as="span" color="blue.500">
                  {item.diff.toLocaleString()}원&nbsp;
                  더 싸요.
                  <Icon as={TrendingDown} boxSize={7} verticalAlign="middle" />
                </Text>
              )}
              {item.diff === 0 && <Text as="span">가격이 동일해요.</Text>}
            </Text>
            <Text color="gray.500">지난 주 평균가 : {item.last_week.toLocaleString()}원</Text>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 2 }} p={4} bg="white" rounded="lg" boxShadow="md">
            <Flex mb={6} alignItems="center" justifyContent="space-between">
              <Heading as="h3" size="md">지난 <Text as="span" color="brand.500">{item.item_name}</Text>의 가격을 확인해보세요.</Heading>
              <Popover>
                <PopoverTrigger>
                  <Icon as={CircleHelp} color="gray.400" boxSize={5} verticalAlign="middle" />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>데이터 출처 및 기준</PopoverHeader>
                  <PopoverBody>
                    <VStack alignItems="flex-start" gap={2}>
                      <Text fontSize="sm" color="gray.600">지난 주 : {item.last_week_date}</Text>
                      <Text fontSize="sm" color="gray.600">지난 달 : {item.last_month_date}</Text>
                      <Text fontSize="sm" color="gray.600">지난 해 : {item.last_year_date}</Text>
                      <Text fontSize="sm" color="gray.600">자료 : 한국농수산식품유통공사</Text>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={14} />
                <YAxis hide domain={[0, 'dataMax + 1000']} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#4ea38e"
                  barSize={50} 
                  radius={[10, 10, 0, 0]}
                  label={CustomLabel}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3A7A66' : '#c6e7d8'} /> // 첫 번째 막대의 색상 변경
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GridItem>
        </Grid>
      </Skeleton>
      <Heading as="h3" size="md" mt={8}>단가 계산하기</Heading>
      <Skeleton isLoaded={!!item.item_price}>
        <Flex alignItems="center" mt={4} p={4} rounded="lg" bgColor="white" boxShadow="md" fontSize="lg">
          <Select w={32} onChange={(e) => handleSelectUnit(e.target.value)}>
            <option value="1kg">1kg</option>
            <option value="500g">500g</option>
            <option value="100g">100g</option>
            <option value="1g">1g</option>
          </Select>
          &nbsp;기준으로&nbsp;
          <Text as="span" fontWeight="bold" color="brand.500">
            {changeUnit(item.item_price).toLocaleString()}원
          </Text>
          &nbsp;입니다.
        </Flex>
      </Skeleton>
      <Heading as="h3" size="md" mt={8}>{`좋은 ${itemKey} 고르는 방법`}</Heading>
      <Skeleton isLoaded={!!itemTipsData}>
        <Box mt={4} p={4} py={6} rounded="lg" bgColor="white" boxShadow="md">
          <Box className={`${styles.item_info} ${styles[`type_${item.item_code}`]}`} display="block">
            <Text size="lg" fontWeight="bold" color="brand.600">{itemTipsData?.tips}</Text>
          </Box>
        </Box>
      </Skeleton>
      <Heading as="h3" display="flex" alignItems="center" size="md" mt={8}>
        AI가 골라주는 오늘의 레시피
        <Box display="inline-block" bgColor="brand.500" p={1} ml={2} w={7} h={7} rounded="full" verticalAlign="middle">
          <Icon as={Bot} boxSize={5} color="white" verticalAlign="top" />
        </Box>
      </Heading>
      <Skeleton isLoaded={!!itemTipsData}>
        <Box mt={4} p={4} rounded="lg" bgColor="white" boxShadow="md">
          <Text fontSize="lg" fontWeight="bold">
            {itemTipsData?.recipe.title}
          </Text>
          <Divider mt={4} />
          <Heading size="sm" mt={4} mb={4}>재료</Heading>
          <Text as="span" mr={2} fontSize="md" color="gray.600">{itemTipsData?.recipe.ingredients.join(', ')}</Text>
          <Divider mt={4} />
          <Heading size="sm" mt={4}>조리법</Heading>
          <VStack mt={4} gap={2} alignItems="flex-start">
            {itemTipsData?.recipe.steps.map((step, index) => (
              <Text key={index} fontSize="md">{`${index + 1}. ${step}`}</Text>
            ))}
          </VStack>
        </Box>
      </Skeleton>
      <Heading as="h3" size="md" mt={8}>원하는 식재료가 너무 비싸다면?</Heading>
      <Skeleton isLoaded={!!itemTipsData}>
        <HStack mt={4} gap={2}>
          {itemTipsData?.substitute.map((substitute) => (
            <Link key={substitute} href={`/search/${substitute}`} px={3} py={1} rounded="lg" boxShadow="md" bg="brand.500" color="white">
              # {substitute}
            </Link>
          ))}
        </HStack>
      </Skeleton>
    </Box>
  )
}
