interface GridItem {
    title: string;
    href: string;
    imgSrc: string;
    imgAlt: string;
}

function ShopCategoryGrid({ itemsArray, className = "" }: { itemsArray?: GridItem[]; className: string }) {
    return (
        <ul className={className}>
           { itemsArray ? itemsArray.map(({title, href, imgSrc, imgAlt}, index) => (
            <li key={index}>
                <a href={href}>
                    <img src={imgSrc} alt={imgAlt}/>
                    <p className="text-[0.9rem]">{title}</p>
                </a>
            </li>
            )) : null}           
        </ul>
    )
}

export default ShopCategoryGrid