import { useMediaQuery } from '@/hooks/use-media-query';
import UserLocationTab from "@/components/custom/UserLocationTab";
import { Button } from "@/components/ui/button";
import SearchTab from "@/components/custom/SearchTab";
import LocationTab from '@/components/custom/LocationTab';
import AccountTab from '@/components/custom/AccountTab';
import HamburgerMenu from '@/components/custom/HamburgerMenu';
import { ChevronRight, ShoppingCart, User } from 'lucide-react'

const menuItems = [
    { label: "Today's Deals", href: "#" },
    { label: "Customer Service", href: "#" },
    { label: "Registry", href: "#" },
    { label: " Gift Cards", href: "#" },
    { label: " Sell", href: "#" },
    { label: "Amazon Basics", href: "#" },
    { label: "New Releases", href: "#" },
    { label: "Music", href: "#" },
    { label: "Saks", href: "#" },
    { label: "Prime", href: "#" },
];

function Header() {
    const isTablet = useMediaQuery("(min-width: 760px)")
    const isDesktop = useMediaQuery("(min-width: 1024px)")

    return (

        <header className='overflow-hidden'>

            <nav aria-label='main' className="bg-header-bgcolor-dark max-tablet:flex max-tablet:flex-wrap max-tablet:justify-between max-tablet:pt-1">

                {/* top Nav Bar started here (the div is flatten with display of contents for max width of 760px) */}

                <div className='flex max-tablet:contents max-tablet:flex-wrap justify-between gap-1 xl:gap-2 items-end w-full text-nav-color max-w-full p-2.5 bg-header-bgcolor-dark'>

                    <div className="flex items-center ml-2.5">

                        {!isTablet && <HamburgerMenu />}

                        <Button variant="navButton" asChild>
                            <a href="/" aria-label="Amazon" className="hover:bg-transparent focus:bg-transparent">
                                <img src="images/amazon_logo.png" className='w-25 h-auto' alt="amazon" width="1596" height="529" />
                            </a>
                        </Button>

                    </div>

                    <UserLocationTab isTablet={isTablet} />

                    <SearchTab />

                    {isDesktop && <LocationTab />}

                    {/**|| start nav top right container (this div is flatten with display content at min-width of 760px) */}

                    <div className="flex items-center gap-3 tablet:contents mr-2.5">

                        {/* start sign in tab (is different for mobile and other viewport) */}

                        {!isDesktop && <a href="" className="flex items-start" aria-label="sign in to your account">
                            {!isTablet && <div className="flex items-center gap-px">
                                <span className="text-[14px]">Sign in</span>
                                <ChevronRight size={10} />
                            </div>
                            }
                            <User />
                        </a>}

                        {isDesktop && <AccountTab />}

                        {/** end sign in tab */}

                        {/** start returns and order tab */}

                        {isDesktop && <a href="" className="text-left leading-[1.1] text-nav-color hover:outline-solid! hover:outline-offset-3! hover:outline-white! hover:outline-1">
                            <span className="text-[13px]">Returns</span>
                            <span className="block text-base'>">&amp; Orders</span>
                        </a>}

                        {/** end returns and order tab */}

                        {/** start cart */}

                        <a href="" className="flex items-end gap-1 text-left leading-[1.1] text-nav-color hover:outline-solid! hover:outline-offset-3! hover:outline-white! hover:outline-1 pr-0 tablet:pr-3">
                            <div className="relative">
                                <ShoppingCart size={isTablet ? '28' : '24'} />
                                <span className="absolute -top-[40%] left-1/2 text-[14px]">0</span>
                            </div>
                             <span className='w-3.75 text-bold hidden xl:inline'>Cart</span>
                        </a>

                        {/** end cart */}

                    </div>

                    {/**|| end nav top right container */}

                </div>

                {/*|| top Nav ends here */}

                {/*|| bottom Nav start here */}

                <div className='flex max-tablet:order-2 gap-[3ch] justifty-start items-center bg-submenu-bgcolor text-nav-color max-lg:overflow-auto scrollbar-hide'>
                    {/* bottom Nav Bar added here */}

                    {isTablet && <HamburgerMenu />}

                    <menu className="flex items-center px-1 py-2.5 gap-4 text-nowrap">
                        {menuItems.map(({ label, href }, index) => (
                            <li key={index}>
                                <a href={href} className='text-base p-0 hover:outline-solid! hover:outline-offset-3! hover:outline-white! hover:outline-1 focus-visible:border-none rounded-none! focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#ff9900,0_0_0_3px_rgba(255,153,0,0.5)] transition-none text-[clamp(0.8125rem,0.625rem+0.417vw,0.9375rem)]'>{label}</a>
                            </li>
                        ))}
                    </menu>

                </div>

                {/*|| bottom Nav ends here */}

            </nav>

        </header>

    )
}

export default Header
