"use client"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebounce } from "@/hooks/use-debouce";
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { useEffect, useState } from "react";
import { Spinner } from "./spinner";

interface iAppProps {
  handleChange?: (value: string) => void;
  value?: string;
  isLoading?: boolean;
  placeholder?: string;
}
const SearchBar = ({ handleChange, value = "", isLoading = false, placeholder = "Search..." }: iAppProps) => {
  const [searchText, setSearchText] = useState(value);
  const debouncedSearchText = useDebounce<string>(searchText, 300);

  useEffect(() => {
    handleChange?.(debouncedSearchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  const isTypeing = searchText !== debouncedSearchText;
  return (
    <InputGroup>
      <InputGroupInput placeholder={placeholder} onChange={(e) => setSearchText(e.target.value)} value={searchText} disabled={isLoading} />
      <InputGroupAddon>
        {isTypeing ? <Spinner /> : <HugeiconsIcon icon={Search01Icon} />}
      </InputGroupAddon>
      {searchText.trim() && <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          onClick={() => {
            setSearchText("");
            handleChange?.("");
          }}
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </InputGroupButton>
      </InputGroupAddon>}
    </InputGroup>
  )
}

export default SearchBar 
