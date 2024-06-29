"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import { Box, Heading, Text, SimpleGrid, Flex, Button, Link, Select, Icon, Spacer, HStack, Divider, VStack, Skeleton } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MoveDown, MoveUp } from 'lucide-react';
import styles from "@/app/icons.module.scss";
import { ItemTips } from '@/types/item';

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

type Unit = 'kg' | 'g' | 'mg';

async function getData(itemName: string): Promise<ItemTips> {
  const res = await fetch(`/api/itemTips?itemName=${itemName}`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default function DetailPage({ params }: { params: { itemKey: string } }) {
  const [unit, setUnit] = useState<Unit>('kg');
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
    if (unit === 'kg') {
      return item.item_price;
    } else if (unit === 'g') {
      return item.item_price / 1000;
    } else if (unit === 'mg') {
      return item.item_price / 1000000;
    }
  }

  const data = [
    { name: '오늘', value: item.item_price },
    { name: '지난 주', value: item.last_week },
    { name: '지난 달', value: item.last_month },
    { name: '지난 해', value: item.last_year }
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
        <Text fontSize="sm" color="gray.500">{item.kind_name}</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <Box p={4} bg="white" borderWidth="1px" borderRadius="md">
          <Box display="flex" flexDir="column" height="full">
            <Text>{new Date(item.date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })} 기준</Text>
            <Text fontSize="xl" fontWeight="bold">
              평균가는<br />
              <Text as="span" color="green.500">{item.item_price.toLocaleString()}원</Text>
              &nbsp;입니다.
            </Text>
            <Text fontSize="xl" fontWeight="bold" mt={4}>
              전주 대비<br />
              {item.diff > 0 && (
                <Text as="span" color="red.500">
                  {item.diff.toLocaleString()}원
                  &nbsp;더 비싸요.
                  <Icon as={MoveUp} boxSize={4} />
                </Text>
              )}
              {item.diff < 0 && (
                <Text as="span" color="blue.500">
                  {item.diff.toLocaleString()}원
                  &nbsp;더 싸요.
                  <Icon as={MoveDown} boxSize={4} />
                </Text>
              )}
              {item.diff === 0 && <Text as="span">가격이 동일해요.</Text>}
            </Text>
            <Text color="gray.500">지난 주 평균가 : {item.last_week.toLocaleString()}원</Text>
            <Spacer />
            <Text mt={6} alignSelf="flex-end" justifySelf="end" fontSize="sm" color="gray.500">자료 : 한국농수산식품유통공사</Text>
          </Box>
        </Box>

        <Box p={4} bg="white" borderWidth="1px" borderRadius="md">
          <Heading as="h3" size="md" mb={4}>지난 <Text as="span" color="green.500">{item.item_name}</Text>의 가격을 확인해보세요.</Heading>
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
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4ea37a' : '#AEE4BD'} /> // 첫 번째 막대의 색상 변경
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
      <Heading as="h3" size="md" mt={8}>{`좋은 ${itemKey} 고르는 방법`}</Heading>
      <Skeleton isLoaded={!!itemTipsData} height={16}>
        <Box mt={4} p={4} rounded="lg" bgColor="white">
          <Text size="lg" fontWeight="bold">{itemTipsData?.tips}</Text>
        </Box>
      </Skeleton>
      <Heading as="h3" size="md" mt={8}>원하는 식재료가 너무 비싸다면?</Heading>
      <Skeleton isLoaded={!!itemTipsData} height={16}>
        <HStack mt={4} gap={2}>
          {itemTipsData?.substitute.map((substitute) => (
            <Link key={substitute} href={`/search/${substitute}`} px="2" py="1" borderRadius="md" bg="green.500" color="white">
              # {substitute}
            </Link>
          ))}
        </HStack>
      </Skeleton>
      <Heading as="h3" size="md" mt={8}>이런 레시피는 어때요?</Heading>
      <Skeleton isLoaded={!!itemTipsData} height={32}>
        <Box mt={4} p={4} rounded="lg" bgColor="white">
          <Text fontSize="lg" fontWeight="bold">{itemTipsData?.recipe.title}</Text>
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
    </Box>
  )
}
