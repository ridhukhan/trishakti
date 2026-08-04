import Link from "next/link";
export default function Home() {
  
  return (
    <div className="bg-blue-800 h-screen">
      <nav className="bg-fuchsia-800 h-30  text-center">
        <h1 className="font-bold text-3xl text-yellow-500">TRISHAKI FOUNDATION</h1>
  <p>
    since 2017
  </p>
      </nav>

      <div className="h-40 font-bold flex flex-col gap-6
      
      bg-amber-500 m-20 text-center rounded shadow-2xl">
        <Link href={"/shonchoi"}><h1 className="bg-red-600  shadow-[4px_5px_15px_black] p-2 w-33 ml-26 mt-9">সঞ্চয়
           হিসাব
           </h1></Link>
<Link href={"/shonchoi"}><h1 className="bg-green-600 p-2 shadow-[4px_5px_15px_black] w-33 ml-26">ঋণ
   হিসাব
           </h1></Link>

      </div>
  </div>
 );
}
