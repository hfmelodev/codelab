'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

export function SearchInput() {
  const [value, setValue] = useState('')

  return (
    <div className="relative max-w-[400px] flex-1">
      <Input
        className="peer h-9 pl-9"
        placeholder="Busque por um curso"
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      <Search
        className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground transition-all peer-focus:text-primary"
        size={16}
      />
    </div>
  )
}
