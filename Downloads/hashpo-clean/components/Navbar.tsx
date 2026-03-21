'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Hash, ShoppingCart, X, ChevronDown } from 'lucide-react';

interface CartItem { slug:string; price:number; type:string; }
interface NavbarProps { cart?:CartItem[]; onRemove?:(s:string)=>void; onCheckout?:()=>void; }

const NAV = [
  { href:'/', label:'Home' },
  { href:'/directory', label:'Directory' },
  { href:'/slugs', label:'Slugs' },
  { href:'/site/edit', label:'My Site' },
];

export default function Navbar({ cart=[], onRemove, onCheckout }:NavbarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const total = cart.reduce((s,i)=>s+i.price,0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Hash className="w-4 h-4 text-white"/>
          </div>
          <span className="font-black text-lg text-purple-700">HASHPO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n=>(
            <Link key={n.href} href={n.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname===n.href?'bg-purple-100 text-purple-700':'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {onRemove && (
            <div className="relative">
              <button onClick={()=>setCartOpen(!cartOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${cart.length?'bg-purple-600 border-purple-600 text-white':'bg-white border-gray-200 text-gray-700'}`}>
                <ShoppingCart className="w-4 h-4"/>
                Cart
                {cart.length>0 && <span className="bg-white text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">{cart.length}</span>}
              </button>
              {cartOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={()=>setCartOpen(false)}/>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b">
                      <span className="font-bold text-gray-900">Cart ({cart.length})</span>
                      <button onClick={()=>setCartOpen(false)}><X className="w-4 h-4 text-gray-400"/></button>
                    </div>
                    {cart.length===0?(
                      <div className="p-8 text-center text-gray-400 text-sm">Cart is empty</div>
                    ):(
                      <>
                        <div className="max-h-64 overflow-y-auto">
                          {cart.map(item=>(
                            <div key={item.slug} className="flex items-center justify-between p-4 border-b border-gray-50">
                              <div>
                                <p className="font-mono font-bold text-gray-900">/{item.slug}</p>
                                <p className="text-xs text-gray-400">{item.type==='premium'?'Premium':item.type==='user_listing'?'User listing':'Standard $12/yr'}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-black text-purple-700 text-lg">${item.price.toLocaleString()}</span>
                                <button onClick={()=>onRemove?.(item.slug)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5"/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-gray-700">Total</span>
                            <span className="font-black text-2xl text-purple-700">${total.toLocaleString()} USDC</span>
                          </div>
                          <button onClick={()=>{onCheckout?.();setCartOpen(false);}}
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4"/> Checkout
                          </button>
                          <p className="text-center text-xs text-gray-400 mt-2">Pay with USDC · Polygon</p>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {user ? (
            <Link href="/dashboard" className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">Dashboard</Link>
          ) : (
            <Link href="/auth" className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
