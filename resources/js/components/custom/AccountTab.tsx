import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuArrow,
} from "@/components/ui/dropdown-menu"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link, usePage } from "@inertiajs/react"
import { ChevronDown, UserCircle, UserCircle2 } from 'lucide-react'
import { useState } from "react"
import { login, register } from "@/routes"
import { type SharedData } from '@/types';
import { logout } from "@/routes"
import TextLink from "../app/text-link"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"


function AccountTab() {
    const [open, setOpen] = useState(false)
    const { auth } = usePage<SharedData>().props;
    const [firstName] = auth.user ? auth.user.name.split(' ') : ''

    return (
        <DropdownMenu open={open} onOpenChange={setOpen} modal>
            <div
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className="relative ml-3"
            >
                <div className='flex gap-0.5 justify-between items-end hover:outline-solid! hover:outline-offset-3! hover:outline-white! hover:outline-1 mr-0.5'>
                    <Link href={login()} className="text-left leading-[1.1] text-nav-color">
                        <span className="text-[13px]">Hello,
                            {auth.user ? ' ' + firstName : ' Sign in'}
                        </span>
                        <span className="block text-base'>">Account &amp; Lists</span>
                    </Link>
                    <DropdownMenuTrigger asChild>
                        <button className='bg-transparent cursor-pointer' aria-label="Expand Account and Lists menu">
                            <ChevronDown strokeWidth={3} size={18} />
                        </button>
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent className="w-120 rounded-none px-4" align="center">
                    <DropdownMenuArrow className="" />

                    {auth.user ?
                        (
                            <Card className="py-0 px-3 bg-[#d8f7eb]">
                                <CardHeader>
                                    <CardTitle className="sr-only"> Your Account </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center px-0 py-1">
                                    <div className="flex gap-3 items-center">
                                        <UserCircle2 size={35} className="bg-gray-400 rounded-full text-white" />
                                        <p className="leading-3">
                                            <span className="block text-[0.9375rem] font-semibold">{firstName}</span>
                                            <span className="text-sm">{auth.user.email}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm ">
                                        <Link className="hover:underline text-link-color">
                                            Switch Accounts
                                        </Link>
                                        <Link href={logout()} className="hover:underline text-link-color cursor-pointer">
                                            Sign Out
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ) :
                        (
                            <>
                                <div className="grid place-items-center my-3 gap-2">
                                    <Button asChild className="bg-brand-accent text-black text-sm px-16 py-1 hover:bg-brand-accent">
                                        <Link href={login()} className="hover:underline">
                                            Sign In
                                        </Link>
                                    </Button>

                                    <div className="text-center text-xs text-muted-foreground">
                                        New customer?{' '}
                                        <TextLink href={register()} tabIndex={5}>
                                            Start here
                                        </TextLink>
                                    </div>
                                </div>
                            </>
                        )
                    }

                    <Separator />

                    <div className="grid grid-cols-2 pt-3">
                        <DropdownMenuGroup className="flex-1">
                            <DropdownMenuLabel className="font-bold text-lg">Your List</DropdownMenuLabel>
                            {[
                                {
                                    label: "Create a List",
                                    href: "#"
                                },
                                {
                                    label: "Find a List or Registry",
                                    href: "#"
                                },
                            ].map(({ label, href }) => (
                                <DropdownMenuItem className="text-sm leading-3 text-zinc-600" asChild>
                                    <Link href={href} className="cursor-pointer">
                                        {label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        <div className="flex items-center">
                            <Separator orientation="vertical" />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="font-bold text-lg">Your Account</DropdownMenuLabel>
                                {[
                                    {
                                        label: "Account",
                                        href: "#"
                                    },
                                    {
                                        label: "Order",
                                        href: "#"
                                    },
                                    {
                                        label: "Recommendations",
                                        href: "#"
                                    },
                                    {
                                        label: "Browsing history",
                                        href: "#"
                                    },
                                    {
                                        label: "Your Shopping Preferences",
                                        href: "#"
                                    },
                                    {
                                        label: "Watch List",
                                        href: "#"
                                    },
                                ].map(({ label, href }) => (
                                    <DropdownMenuItem className="text-sm leading-3 text-zinc-600" asChild>
                                        <Link href={href} className="cursor-pointer">
                                            {label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}

                            </DropdownMenuGroup>
                        </div>
                    </div>
                </DropdownMenuContent>
            </div >
        </DropdownMenu >

    )
}

export default AccountTab
