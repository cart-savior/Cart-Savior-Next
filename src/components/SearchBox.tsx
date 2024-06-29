import { useEffect, useState } from 'react';
import {
  Flex,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function SearchBox() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // pathname 변경을 감지하여 검색창을 초기화
  useEffect(() => {
    setSearchValue('');
  }, [pathname]);

  const handleChangeSearchValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchValue === '') return;
    if (e.key === 'Enter') {
      router.push(`/search/${searchValue}`);
    }
  }
  return (
    <Flex maxW={72} pl={4} border="1px" borderColor="gray.200" bgColor="white" rounded="lg">
      <Input
        value={searchValue}
        variant="unstyled"
        type="text"
        name="search_text"
        placeholder="오늘의 무 값은?"
        maxLength={50}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => handleChangeSearchValue(e)}
      />
      <IconButton
        onClick={() => router.push(`/search/${searchValue}`)}
        icon={<Search />}
        variant="unstyled"
        aria-label="검색"
        isDisabled={searchValue === ''}
      />
    </Flex>
  )
}
