import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import { useToast } from '@/components/layout/ToastContainer'
import type { Producto } from '@/modules/products/types/product'
import type { Cliente } from '@/modules/clients/types/client'
import type { Cupon } from '@/modules/coupons/types/coupon'

export interface CartItem {
  producto_id: number
  nombre: string
  precio: number
  cantidad: number
  stock: number
  descuento: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Producto, quantity?: number) => boolean
  removeItem: (producto_id: number) => void
  updateQuantity: (producto_id: number, delta: number) => boolean
  updateDiscount: (producto_id: number, descuento: number) => void
  clearCart: () => void
  subtotal: number
  total: number
  itemsCount: number
  discount: number
  setDiscount: (value: number) => void
  selectedClient: Cliente | null
  setSelectedClient: (client: Cliente | null) => void
  selectedCoupon: Cupon | null
  setSelectedCoupon: (coupon: Cupon | null) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<Cupon | null>(null)

  const addItem = useCallback((product: Producto, quantity: number = 1): boolean => {
    if (!product.gestionar_inventario) {
      addToast({ type: 'error', message: `Producto no disponible para venta directa: ${product.nombre}` })
      return false
    }

    if (product.cantidad_disponible <= 0) {
      addToast({ type: 'error', message: `Sin stock: ${product.nombre}` })
      return false
    }

    setItems(prev => {
      const existing = prev.find(item => item.producto_id === product.id)
      if (existing) {
        const newQuantity = existing.cantidad + quantity
        if (newQuantity > product.cantidad_disponible) {
          addToast({ type: 'warning', message: `Stock insuficiente para ${product.nombre}` })
          return prev
        }
        return prev.map(item =>
          item.producto_id === product.id
            ? { ...item, cantidad: newQuantity }
            : item
        )
      }
      if (quantity > product.cantidad_disponible) {
        addToast({ type: 'warning', message: `Stock insuficiente para ${product.nombre}` })
        return prev
      }
      return [...prev, {
        producto_id: product.id,
        nombre: product.nombre,
        precio: product.precio_venta,
        cantidad: quantity,
        stock: product.cantidad_disponible,
        descuento: 0,
      }]
    })
    return true
  }, [addToast])

  const removeItem = useCallback((producto_id: number) => {
    setItems(prev => prev.filter(item => item.producto_id !== producto_id))
  }, [])

  const updateQuantity = useCallback((producto_id: number, delta: number): boolean => {
    setItems(prev => {
      const item = prev.find(item => item.producto_id === producto_id)
      if (!item) return prev
      const newQuantity = item.cantidad + delta
      if (newQuantity <= 0) return prev
      if (item.stock > 0 && newQuantity > item.stock) {
        addToast({ type: 'warning', message: `Stock insuficiente para ${item.nombre}` })
        return prev
      }
      return prev.map(item =>
        item.producto_id === producto_id
          ? { ...item, cantidad: newQuantity }
          : item
      )
    })
    return true
  }, [addToast])

  const updateDiscount = useCallback((producto_id: number, descuento: number) => {
    setItems(prev =>
      prev.map(item =>
        item.producto_id === producto_id
          ? { ...item, descuento }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setDiscount(0)
    setSelectedClient(null)
    setSelectedCoupon(null)
  }, [])

  const subtotal = useMemo(() =>
    items.reduce((sum, item) => sum + (item.precio * item.cantidad) - item.descuento, 0),
    [items]
  )
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount])
  const itemsCount = useMemo(() => items.reduce((sum, item) => sum + item.cantidad, 0), [items])

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateDiscount,
    clearCart,
    subtotal,
    total,
    itemsCount,
    discount,
    setDiscount,
    selectedClient,
    setSelectedClient,
    selectedCoupon,
    setSelectedCoupon,
  }), [items, addItem, removeItem, updateQuantity, updateDiscount, clearCart, subtotal, total, itemsCount, discount, setDiscount, selectedClient, selectedCoupon])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
