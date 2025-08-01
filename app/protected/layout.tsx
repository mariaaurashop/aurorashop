"use client"
import { CartProvider } from "@/context/CarContext";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>  <CartProvider>
          {children}  
          </CartProvider>
    </>
  );
}
