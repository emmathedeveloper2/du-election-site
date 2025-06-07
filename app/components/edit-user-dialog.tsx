import { usersTable } from '~/database/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useFetcher } from 'react-router';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { LoaderIcon, UserPenIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { PROGRAMMES } from '~/lib/constants';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

interface UserTableOptionsProps {
    user: Omit<typeof usersTable.$inferSelect, "password">;
    children?: React.ReactNode;
}

const EditUserDialog = ({ user }: UserTableOptionsProps) => {

    const fetcher = useFetcher()


    useEffect(() => {
        if (fetcher?.data?.success) {
            toast.success(fetcher.data.message || 'User updated successfully');
        }
    }, [fetcher.data]);

    return (
        <Dialog>
            <DialogTrigger asChild className='w-full flex justify-between items-center p-2'>
                <Button variant="ghost">
                    Edit User
                    <UserPenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <fetcher.Form method="post" action={`/api/users/edit/${user.id}`} className='flex flex-col gap-4'>

                    {
                        fetcher.data && !fetcher.data.success && (
                            <div className='text-red-500'>
                                {fetcher.data.error || 'An error occurred while updating the user.'}
                            </div>
                        )
                    }

                    <div className='grid gap-4'>
                        <Label htmlFor="matricNumber">Matric NO</Label>
                        <Input type="text" id="matricNumber" name="matricNumber" defaultValue={user.matricNumber} required disabled />
                    </div>
                    <div className='grid gap-4'>
                        <Label htmlFor="fullname">Fullname</Label>
                        <Input type="text" id="fullname" name="fullname" defaultValue={user.fullname} required />
                    </div>
                    <div className='grid gap-4'>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name="email" defaultValue={user.email} required />
                    </div>

                    <div className='grid gap-4'>
                        <Label htmlFor="programme">Programme</Label>
                        <Select name="programme" defaultValue={user.programme}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROGRAMMES.map((programme) => (
                                    <SelectItem key={programme} value={programme.toLowerCase()}>
                                        {programme}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit">
                        {fetcher.state === 'submitting' ? <LoaderIcon className='animate-spin' /> : 'Save Changes'}
                    </Button>
                </fetcher.Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditUserDialog