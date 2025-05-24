'use client'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'

export function SearchInput() {
  const [value, setValue] = useState('')

  const debouncedValue = useDebounce(value, 500)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentTags = searchParams.getAll('tags')
  const currentQuery = searchParams.get('query')

  useEffect(() => {
    if (currentQuery === debouncedValue) return
    if (!currentQuery && !debouncedValue) return

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          query: debouncedValue,
          tags: currentTags,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.push(url)
  }, [currentQuery, debouncedValue, currentTags, pathname, router])

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
