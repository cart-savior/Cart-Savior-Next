"use client";

import { useState } from 'react';
import Image from "next/image";
import { Box, Heading, Text, SimpleGrid, Flex, Button, Link, Select, Icon, Spacer } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MoveDown, MoveUp } from 'lucide-react';
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

type Unit = 'kg' | 'g' | 'mg';

export default function SearchPage({ params }: { params: { itemKey: string } }) {
  const [unit, setUnit] = useState<Unit>('kg');

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

      <Flex align="center" gap={4} mb={4} p={4} border="1px" borderColor="gray.200" rounded="lg" bgColor="white">
        <Image src="/images/icon_loading.png" alt="Loading" width={50} height={50} />
        <Box>
          <Text size="md" color="gray.500">Tip</Text>
          <Text size="lg" fontWeight="bold">{item.wiki}</Text>
        </Box>
      </Flex>
    </Box>
  )
}
