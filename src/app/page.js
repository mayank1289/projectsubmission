import FormData from "../../components/FormData";
import Link from 'next/link';
export default function Home() {
  return (
    <div className="h-full flex flex-col items-center gap-4">
      
      <FormData />
      <Link href="/api/searchdata"><h1 className="text-blue-500">search the database</h1></Link>
    </div>
  );
}
