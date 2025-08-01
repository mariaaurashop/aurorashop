"use client"
import { useCart } from '../../../context/CarContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="w-full px-28 p-10 h-screen flex flex-col items-start mx-auto p-4">
        <h1 className="text-4xl text-primary font-bold">Tu carrito</h1>
        <p className="mt-4">Esta vacio. </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 h-fit flex flex-col justify-center">
      <h1 className="text-2xl font-bold">Carrito de compras</h1>
      
      {cart?.map(item => (
        <div key={item?.id} className="flex items-center justify-between border-b py-4">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p>${item?.price?.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center">
            <input 
              type="number"
              min="1"
              value={item?.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e?.target?.value))}
              className="w-16 border rounded px-2 py-1 mr-2"
            />
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="mt-4 flex space-x-4">
          <button 
            onClick={clearCart}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Limpiar carro
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
}