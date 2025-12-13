"use state"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebounce } from "@/hooks/use-debouce";
import { Search, XIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { Spinner } from "./spinner";

interface iAppProps {
  onChange: (value: string) => void;
  value: string;
  isLoading?: boolean;
  placeholder?: string;
}
const SearchBar = ({ onChange, value, isLoading = false, placeholder = "Search..." }: iAppProps) => {
  const [searchText, setSearchText] = useState(value);
  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    onChange(debouncedSearchText);
  }, [debouncedSearchText, onChange]);

  const isTypeing = searchText !== debouncedSearchText;
  return (
    <InputGroup>
      <InputGroupInput placeholder={placeholder} onChange={(e) => setSearchText(e.target.value)} value={searchText} disabled={isLoading} />
      <InputGroupAddon>
        {isTypeing ? <Spinner /> : <Search />}
      </InputGroupAddon>
      {searchText.trim() && <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          onClick={() => {
            setSearchText("");
            onChange("");
          }}
        >
          <XIcon />
        </InputGroupButton>
      </InputGroupAddon>}
    </InputGroup>
  )
}

export default SearchBar 
