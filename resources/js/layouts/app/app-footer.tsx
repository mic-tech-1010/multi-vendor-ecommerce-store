export default function Footer() {
  return (
    <footer className="mt-4 text-sm">

      {/* Back to top */}
      <div className="text-center text-white bg-[#37475a] py-2">
        <a href="#main" className="text-[13px] bg-transparent border-none">
          Back to top
        </a>
      </div>

      {/* Top links */}
      <div className="bg-[#232f3e]">
        <div className="max-w-[1000px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4 pb-8 md:pt-10">
          <ul>
            <h3 className="text-white text-base font-bold whitespace-nowrap mb-2">Get to Know Us</h3>
            {["Careers", "Blog", "About Amazon", "Investor Relations", "Amazon Devices", "Amazon Science"].map((item) => (
              <li key={item}><a href="#" className="text-[#DDD] text-[13px] leading-[120%] hover:underline">{item}</a></li>
            ))}
          </ul>

          <ul>
            <h3 className="text-white text-base font-bold whitespace-nowrap mb-2">Make Money with Us</h3>
            {[
              "Sell products on Amazon", "Sell on Amazon Business", "Sell apps on Amazon",
              "Become an Affiliate", "Advertise Your Products", "Self-Publish with Us",
              "Host an Amazon Hub", "See More Make Money with Us"
            ].map((item) => (
              <li key={item}><a href="#" className="text-[#DDD] text-[13px] hover:underline">{item}</a></li>
            ))}
          </ul>

          <ul>
            <h3 className="text-white text-base font-bold whitespace-nowrap mb-2">Amazon Payment Products</h3>
            {[
              "Amazon Business Card", "Shop with points", "Reload Your Balance", "Amazon Currency Converter"
            ].map((item) => (
              <li key={item}><a href="#" className="text-[#DDD] text-[13px] hover:underline">{item}</a></li>
            ))}
          </ul>

          <ul>
            <h3 className="text-white text-base font-bold whitespace-nowrap mb-2">Let Us Help You</h3>
            {[
              "Amazon and COVID 19", "Your Account", "Your Orders", "Shipping Rates & Policies",
              "Returns & Replacements", "Manage Your Content and Devices", "Help"
            ].map((item) => (
              <li key={item}><a href="#" className="text-[#DDD] text-[13px] hover:underline">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Page settings */}
      <div className="bg-[#131A22] flex justify-center flex-wrap items-center gap-5 py-8 md:bg-[#232f3e] md:py-4 md:pt-4 md:border-t md:border-[#3a4553] md:rounded-md">
        <a href="/" className="hidden md:block w-20 mr-6" aria-label="Amazon">
          <img src="images/amazon_logo.png" alt="amazon" className="w-full h-auto" />
        </a>

        <a href="#" className="text-[#ccc] text-[13px] flex items-center border border-[#848688] rounded px-3 py-1.5 md:px-4 md:py-1.5 gap-2">
          🌐 English
        </a>

        <a href="#" className="text-[#ccc] text-[13px] border border-[#848688] rounded px-4 py-1.5">
          $ USD - U.S. Dollar
        </a>

        <a href="#" className="text-[#ccc] text-[13px] border border-[#848688] rounded px-3 py-1.5 flex items-center gap-2">
          <img src="images/us_flag.png" alt="flag" className="w-5 aspect-square" />
          United States
        </a>
      </div>

      {/* Category links (desktop only) */}
      <div className="bg-[#131A22]">
        <div className="hidden md:grid max-w-[1000px] mx-auto grid-cols-[repeat(auto-fit,minmax(130px,1fr))] p-4 gap-y-4">
          {[
            ["Amazon Music", "Stream millions of songs"],
            ["Amazon Ads", "Reach customers wherever they spend their time"],
            ["6pm", "Score deals on fashion brands"],
            ["AbeBooks", "Books, art & collectibles"],
            ["ACX", "Audiobook Publishing Made Easy"],
            ["Sell on Amazon", "Start a selling Account"],
            ["Veeqo", "Shipping Software inventory Management"],
            ["Amazon Business", "Everything For Your Business"],
            ["Amazon Global", "Ship Orders Internationally"],
            ["Amazon Web Services", "Scalable cloud computing services"],
            ["Audible", "Listen to Books & Original Audio Performances"],
            ["Box Office Mojo", "Find Movie Box Office Data"],
            ["GoodReads", "Books reviews & recommendations"],
            ["IMDb", "Movies, TV & celebrities"],
            ["IMDbPro", "Get info entertainment Professionals Need"],
            ["Kindle Direct Publishing", "Indie Digital & Print Publishing Made easy"],
            ["Prime Video Direct", "Video Distribution Made Easy"],
            ["Shopbop", "Designer Fashion Brands"],
            ["Woot!", "Deals and Shenanigans"],
            ["Zappos", "Shoes & clothing"],
            ["Ring", "Smart Home Security Systems"],
            ["eero WIFI", "Stream 4k Video in Every Room"],
            ["Blink", "Smart Security for Every Home"],
            ["Neighbours App", "Real-Time Crime & Safety Alerts"],
            ["Amazon subscription Boxes", "Top subscription boxes - right to your door"],
            ["PillPack", "Pharmacy Simplified"],
          ].map(([title, desc]) => (
            <div key={title}>
              <h3 className="text-[#DDD] text-[12px] font-normal leading-3.5 w-4/5">{title}</h3>
              <p className="w-4/5 leading-tight text-[0.75rem]">
                <a href="#" className="text-[#999] hover:underline leading-[18px]">{desc}</a>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom links */}
      <div className="bg-[#131A22] text-center pb-4">

        <h4 className="md:hidden font-semibold text-base text-white">
          <a href="#">Already a customer? Sign in</a>
        </h4>

        <ul className="flex flex-wrap justify-center list-none py-2 gap-x-2 max-w-[81%] mx-auto text-nowrap">
          {[
            "Conditions of Use",
            "Privacy Notice",
            "Consumer Health Data",
            "Privacy Disclosure",
            "Your Ads Privacy Choices",
          ].map((item) => (
            <li key={item}><a href="#" className="text-[#ddd] text-[12px] hover:underline">{item}</a></li>
          ))}
        </ul>

        <p className="text-[#ddd] text-[12px] leading-tight">
          &copy; 1966–2025 Amazon.com, Inc. or its affiliates
        </p>

      </div>
    </footer>
  );
}
