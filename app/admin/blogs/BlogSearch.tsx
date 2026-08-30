/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  placeholder?: string;
  defaultValue?: string;
}

export default function BlogSearch({ placeholder = 'Search...', defaultValue = '' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
      <input 
        type="text" 
        value={value}
        onChange={handleSearch}
        placeholder={placeholder} 
        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm bg-white"
      />
    </div>
  );
}