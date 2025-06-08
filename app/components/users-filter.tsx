import { useSearchParams } from 'react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const UsersFilter = () => {

  const [searchParams, setSearchParams] = useSearchParams({ filter: 'all' })


  const handleChange = (value: string) => {
    setSearchParams((params) => {
      if (value === 'all') {
        params.delete('filter')
      } else {
        params.set('filter', value)
      }

      return params
    })
  }

  return (
    <div className='w-full lg:flex-1 flex items-center gap-2'>
      <Select onValueChange={handleChange} value={searchParams.get('filter') || 'all'}>
        <SelectTrigger className='w-full lg:w-[200px]'>
          <SelectValue placeholder='Select filter' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All</SelectItem>
          <SelectItem value='admin'>Admins</SelectItem>
          <SelectItem value='candidate'>Candidates</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default UsersFilter