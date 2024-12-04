import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header({ 
  title, 
  onSearch, 
  onFilter,
  filterOptions
}: { 
  title: string, 
  onSearch: (query: string) => void,
  onFilter: (filter: string) => void,
  filterOptions: string[]
}) {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 bg-gray-700 text-white placeholder-gray-400 border-gray-600"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-700 text-white border-gray-600">
            {filterOptions.map((option) => (
              <DropdownMenuItem 
                key={option} 
                onClick={() => onFilter(option)}
                className="hover:bg-gray-600"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

