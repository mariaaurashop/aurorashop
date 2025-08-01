"use client"
import { CartProvider } from "@/context/CarContext";
import Store from "./Store";



export default function StorePage() {
   

    return (
        <>
        <CartProvider>
       <Store/>
       </CartProvider>
        </>
    );
}