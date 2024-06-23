import { Search } from 'lucide-react';
import {
  Flex,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { useState } from 'react';
import Link from 'next/link';

export default function SearchBox() {
  const [searchValue, setSearchValue] = useState('');
  const handleChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }
  return (
    <Flex pl={2} border="1px" borderColor="gray.200" bgColor="white" rounded="md">
      <Input
        value={searchValue}
        variant="unstyled"
        type="text"
        name="search_text"
        placeholder="오늘의 무 값은?"
        maxLength={50}
        onChange={handleChangeSearchValue}
      />
      <IconButton as={Link} href={`/search/${searchValue}`} icon={<Search />} variant="ghost" aria-label="검색" />
    </Flex>
  )
}
