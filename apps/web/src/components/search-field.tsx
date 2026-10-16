import { SearchView } from "@/components/m3e/search";
import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function useSearchQuery<T>(queryKey: QueryKey, queryFn: (query: string) => Promise<T>) {
  const [value, setValue] = useState("");
  const result = useQuery({
    queryKey: [...queryKey, value],
    placeholderData: keepPreviousData,
    queryFn: () => queryFn(value),
  });
  return { value, setValue, ...result };
}

export function SearchField({
  placeholder,
  value,
  onValueChange,
  trailing,
  children,
}: {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <SearchView
      open={open}
      placeholder={placeholder}
      value={value}
      onOpenChange={setOpen}
      trailing={trailing}
      onValueChange={(next) => {
        onValueChange(next);
        setOpen(true);
      }}
    >
      {children}
    </SearchView>
  );
}
