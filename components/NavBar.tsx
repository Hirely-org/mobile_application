'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  const { user } = useUser();

  return (
    <div className="flex justify-between items-center w-full h-16 px-6 bg-gray-100 shadow-sm">
      {/* Left Section */}
      {user ? (
         <ul className="flex gap-6">
         <li>
           <Link href="/">
             <Button variant="link">Home</Button>
           </Link>
         </li>
         {/* <li>
           <Link href="/job">
             <Button variant="link">Jobs</Button>
           </Link>
         </li> */}
         {/* <li>
           <Link href="/contact">
             <Button variant="link">Contact</Button>
           </Link>
         </li> */}
       </ul>
      ) : null}
     

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={user.picture || '/default-profile.png'}
                alt={`${user.name}'s profile picture`}
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/profile" prefetch>Profile</Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href="/api/auth/logout" prefetch>Logout</Link>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
         null
        )}
      </div>
    </div>
  );
}
