"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCartIcon } from 'lucide-react';
import React, { useState } from 'react';
import img from "../public/img.webp"
import Image from 'next/image';
import { useCart } from '@/context/CarContext';

const Store = () => {
    const { addToCart } = useCart();
    // Mock data
    const products = [
        { id: 1, name: "Camiseta Básica", category: "Camisetas", price: 19.99, image:img },
        { id: 2, name: "Pantalón Jeans", category: "Pantalones", price: 39.99, image: img },
        { id: 3, name: "Chaqueta Casual", category: "Chaquetas", price: 59.99, image: img},
        { id: 4, name: "Vestido Verano", category: "Vestidos", price: 29.99, image: img},
        { id: 5, name: "Sudadera Deportiva", category: "Sudaderas", price: 24.99, image:img },
    ];

    const categories = [
        "Todas",
        ...Array.from(new Set(products.map((p) => p?.category))),
    ];
 const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");

    const filteredProducts = products.filter((product) => {
        const matchesCategory = category === "Todas" || product?.category === category;
        const matchesSearch = product?.name?.toLowerCase()?.includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    return (
         <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Tienda de Ropa</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => setSearch(e?.target?.value)}
                    className="md:w-1/2"
                />
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground">
                        No se encontraron productos.
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <Card key={product.id}>
                            <CardHeader>
                                <Image
                                    src={product?.image}
                                    alt={product?.name}
                                    className="w-full h-40 object-cover rounded"
                                />
                                <CardTitle className="mt-2">{product?.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-lg">${product?.price?.toFixed(2)}</span>
                                    <Button onClick={() => addToCart(product)} className='bg-indigo-700 hover:bg-indigo-800'>
                                        <ShoppingCartIcon className='w-6 h-6 text-white'/>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default Store;
