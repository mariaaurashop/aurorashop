import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { ShoppingCart } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/store" className="font-bold text-md text-neutral-700">Tienda</Link>
      <Link href="/protected/chat" className="font-bold text-md text-neutral-700">Chat bot</Link>
       <Link href="/protected/car" className="font-bold text-md text-neutral-700 p-2 rounded-lg bg-neutral-100"><ShoppingCart/></Link>
     
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-4 flex-row items-center justify-center">
      <Link href="/store" className="font-bold text-md text-neutral-700">Tienda</Link>
      <Link href="/protected/chat" className="font-bold text-md text-neutral-700">Chat bot</Link>
      <Link href="/protected/car" className="font-bold text-md text-neutral-700 p-2 rounded-lg bg-neutral-100"><ShoppingCart/></Link>
      <Button asChild size="sm" variant={"default"} className="bg-indigo-600 hover:bg-indigo-800">
        <Link href="/auth/login" className="font-bold text-md ">Iniciar sesión</Link>
      </Button>
      
    </div>
  );
}
