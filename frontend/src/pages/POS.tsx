import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { POSLayout, SearchBar, ProductGrid, ProductCard, CartPanel, CartItem, PaymentFooter, EmptyCart, EmptyProducts } from '@/components/pos'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { SlidersHorizontal, ShoppingCart, UserPlus, Tag, X } from 'lucide-react'
import { useCart } from '@/app/providers/CartProvider'
import { usePOS } from '@/modules/pos/hooks/usePOS'
import { useCheckout } from '@/modules/pos/hooks/useCheckout'
import { useClients } from '@/modules/clients/hooks/useClients'
import { useCoupons } from '@/modules/coupons/hooks/useCoupons'
import { Wallet, CreditCard, Building2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utils/classNames'
import type { Producto } from '@/modules/products/types/product'
import type { Cliente } from '@/modules/clients/types/client'
import type { Cupon } from '@/modules/coupons/types/coupon'

type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'otro'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function POS() {
  const { items, addItem, removeItem, updateQuantity, clearCart, subtotal, total, itemsCount, discount, setDiscount, selectedClient, setSelectedClient, selectedCoupon, setSelectedCoupon } = useCart()

  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory, marcaId, setMarcaId, etiquetaId, setEtiquetaId, filteredProducts, error, refreshProducts, categories, marcas, etiquetas, hasMore, loadMore, isFetchingMore } = usePOS()

  const { isProcessing, paymentMethod, setPaymentMethod, cashReceived, setCashReceived, cashReceivedNum, change, isCashValid, handlePay, resetPayment } = useCheckout()

  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [clientQuery, setClientQuery] = useState('')
  const [couponQuery, setCouponQuery] = useState('')

  const { clients, isLoading: isLoadingClients, executeFetch: fetchClients } = useClients()
  const { coupons, isLoading: isLoadingCoupons, executeFetch: fetchCoupons } = useCoupons()

  const searchInputRef = useRef<HTMLInputElement>(null)
  const productGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchClients({ q: clientQuery, estado: 'activo' })
  }, [clientQuery, fetchClients])

  useEffect(() => {
    fetchCoupons({ q: couponQuery, estado: 'activo' })
  }, [couponQuery, fetchCoupons])

  useEffect(() => {
    if (selectedCoupon) {
      const now = new Date()
      const start = new Date(selectedCoupon.fecha_inicio)
      const end = new Date(selectedCoupon.fecha_fin)
      if (now < start || now > end || selectedCoupon.usos_realizados >= selectedCoupon.uso_maximo) {
        setSelectedCoupon(null)
        setDiscount(0)
      }
    }
  }, [selectedCoupon, setDiscount, setSelectedCoupon])

  const handleAddItem = useCallback((product: Producto) => {
    addItem(product, 1)
  }, [addItem])

  const handleOpenPayment = useCallback(() => {
    setIsPaymentOpen(true)
    setPaymentMethod('efectivo')
    setCashReceived('')
  }, [setPaymentMethod, setCashReceived])

  const handleClosePayment = useCallback(() => {
    setIsPaymentOpen(false)
    resetPayment()
  }, [resetPayment])

  const applyCoupon = useCallback((coupon: Cupon) => {
    if (selectedCoupon?.id === coupon.id) {
      setSelectedCoupon(null)
      setDiscount(0)
      return
    }
    setSelectedCoupon(coupon)
    setIsCouponModalOpen(false)
    setCouponQuery('')
    const valor = Number(coupon.valor)
    if (coupon.tipo === 'porcentaje') {
      const discountValue = Math.min(subtotal * (valor / 100), subtotal)
      setDiscount(discountValue)
    } else {
      setDiscount(Math.min(valor, subtotal))
    }
  }, [subtotal, setDiscount, selectedCoupon])

  const selectClient = useCallback((client: Cliente) => {
    if (selectedClient?.id === client.id) {
      setSelectedClient(null)
      return
    }
    setSelectedClient(client)
    setIsClientModalOpen(false)
    setClientQuery('')
  }, [selectedClient])

  const handlePayClick = useCallback(async () => {
    const success = await handlePay(selectedClient?.id ?? null)
    if (success) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setIsPaymentOpen(false)
        resetPayment()
        clearCart()
        refreshProducts()
      }, 1800)
    }
  }, [handlePay, selectedClient, refreshProducts, resetPayment, clearCart, setDiscount])

  const handleQuickCash = useCallback(() => {
    setCashReceived(String(Math.round(total)))
  }, [total, setCashReceived])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPaymentOpen) {
          handleClosePayment()
        } else if (searchQuery) {
          setSearchQuery('')
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPaymentOpen, searchQuery, handleClosePayment, setSearchQuery])

  const handleProductKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!productGridRef.current) return
    const buttons = Array.from(productGridRef.current.querySelectorAll('[role="button"]'))
    const currentIndex = buttons.indexOf(document.activeElement as HTMLElement)
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        if (currentIndex < buttons.length - 1) (buttons[currentIndex + 1] as HTMLElement).focus()
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (currentIndex > 0) (buttons[currentIndex - 1] as HTMLElement).focus()
        break
      case 'ArrowDown':
        e.preventDefault()
        if (currentIndex + 5 < buttons.length) (buttons[currentIndex + 5] as HTMLElement).focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        if (currentIndex - 5 >= 0) {
          (buttons[currentIndex - 5] as HTMLElement).focus()
        } else {
          searchInputRef.current?.focus()
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        ;(document.activeElement as HTMLElement).click()
        break
    }
  }, [])

  const posCategories = categories.map(c => ({ id: String(c.id), name: c.nombre }))

  return (
    <POSLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100dvh-64px)]">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="shrink-0 px-4 md:px-6 pt-4 md:pt-6 pb-3">
            <div className="flex gap-2 mb-3">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar producto o escanear..."
                inputRef={searchInputRef}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0"
              >
                <SlidersHorizontal size={16} />
                {showFilters ? 'Ocultar' : 'Filtros'}
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Select
                  size="sm"
                  fullWidth={false}
                  options={[{ value: '', label: 'Todas las categorías' }, ...posCategories.map(c => ({ value: c.id, label: c.name }))]}
                  value={activeCategory !== null ? String(activeCategory) : ''}
                  onChange={e => setActiveCategory(e.target.value ? Number(e.target.value) : null)}
                />
                <Select
                  size="sm"
                  fullWidth={false}
                  options={[{ value: '', label: 'Todas las marcas' }, ...marcas.map(m => ({ value: String(m.id), label: m.nombre }))]}
                  value={marcaId !== null ? String(marcaId) : ''}
                  onChange={e => setMarcaId(e.target.value ? Number(e.target.value) : null)}
                />
                <Select
                  size="sm"
                  fullWidth={false}
                  options={[{ value: '', label: 'Todas las etiquetas' }, ...etiquetas.map(e => ({ value: String(e.id), label: e.nombre }))]}
                  value={etiquetaId !== null ? String(etiquetaId) : ''}
                  onChange={e => setEtiquetaId(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6">
            {error && (
              <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-700">{error}</p>
                <button onClick={refreshProducts} className="text-sm text-primary-600 hover:text-primary-700 mt-1">Reintentar</button>
              </div>
            )}
            {filteredProducts.length === 0 ? (
              <EmptyProducts onClearSearch={() => { setSearchQuery('') }} />
            ) : (
              <>
                <ProductGrid ref={productGridRef} onKeyDown={handleProductKeyDown}>
                  {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    name={product.nombre}
                    sku={product.sku || undefined}
                    price={product.precio_venta}
                    gestionarInventario={product.gestionar_inventario}
                    sinStock={product.cantidad_disponible <= 0}
                    image={
                      product.imagen ? (
                        <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover" />
                      ) : undefined
                    }
                    onAdd={() => handleAddItem(product)}
                  />
                  ))}
                </ProductGrid>
                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="secondary"
                      onClick={loadMore}
                      loading={isFetchingMore}
                    >
                      {isFetchingMore ? 'Cargando...' : 'Cargar más'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:block lg:w-[380px] xl:w-[420px] shrink-0">
          <CartPanel
            header={
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Carrito</h2>
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-neutral-500">
                  Limpiar
                </Button>
              )}
            </div>
            }
            footer={
              items.length > 0 ? (
                <PaymentFooter
                  total={total}
                  itemsCount={itemsCount}
                  onPay={handleOpenPayment}
                />
              ) : null
            }
          >
            <div className="space-y-2 mb-3">
              <div className="flex gap-2">
                <Button
                  variant={selectedClient ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsClientModalOpen(true)}
                >
                  <UserPlus size={16} />
                  {selectedClient ? `Cliente: ${selectedClient.nombre}` : 'Cliente'}
                </Button>
                <Button
                  variant={selectedCoupon ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsCouponModalOpen(true)}
                >
                  <Tag size={16} />
                  {selectedCoupon ? `Cupón: ${selectedCoupon.codigo}` : 'Cupón'}
                </Button>
              </div>
              <div className="flex gap-2">
                {selectedClient && (
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="flex-1 relative text-left rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600 group"
                  >
                    <p className="font-medium text-neutral-900">{selectedClient.nombre}</p>
                    {selectedClient.telefono && <p>{selectedClient.telefono}</p>}
                    <span className="absolute top-1 right-1 text-neutral-400 hover:text-error-600">
                      <X size={12} />
                    </span>
                  </button>
                )}
                {selectedCoupon && (
                  <button
                    onClick={() => {
                      setSelectedCoupon(null)
                      setDiscount(0)
                    }}
                    className="flex-1 relative text-left rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600 group"
                  >
                    <p className="font-medium text-neutral-900">{selectedCoupon.codigo}</p>
                    <p>{selectedCoupon.tipo === 'porcentaje' ? `${Math.round(Number(selectedCoupon.valor))}%` : formatCOP(Number(selectedCoupon.valor))}</p>
                    <span className="absolute top-1 right-1 text-neutral-400 hover:text-error-600">
                      <X size={12} />
                    </span>
                  </button>
                )}
              </div>
            </div>
            {items.length === 0 ? (
              <EmptyCart onClear={clearCart} />
            ) : (
              <motion.div layout className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {items.map(item => (
                    <motion.div
                      key={item.producto_id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    >
                      <CartItem
                        name={item.nombre}
                        price={item.precio}
                        quantity={item.cantidad}
                        onUpdateQuantity={delta => updateQuantity(item.producto_id, delta)}
                        onRemove={() => removeItem(item.producto_id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </CartPanel>
        </div>
      </div>

      <div className="lg:hidden">
          <Button
            variant="primary"
            size="lg"
            className="fixed bottom-4 right-4 z-40 shadow-lg rounded-full w-14 h-14"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={22} />
          </Button>

        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="shrink-0 px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Carrito</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)} className="text-neutral-500">
                  Cerrar
                </Button>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant={selectedClient ? 'primary' : 'secondary'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setIsClientModalOpen(true)}
                  >
                    <UserPlus size={16} />
                    {selectedClient ? selectedClient.nombre : 'Cliente'}
                  </Button>
                  <Button
                    variant={selectedCoupon ? 'primary' : 'secondary'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setIsCouponModalOpen(true)}
                  >
                    <Tag size={16} />
                    {selectedCoupon ? selectedCoupon.codigo : 'Cupón'}
                  </Button>
                </div>
                <div className="flex gap-2">
                  {selectedClient && (
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="flex-1 relative text-left rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600"
                    >
                      <p className="font-medium text-neutral-900">{selectedClient.nombre}</p>
                      {selectedClient.telefono && <p>{selectedClient.telefono}</p>}
                    <span className="absolute top-1 right-1 text-neutral-400 hover:text-error-600">
                      <X size={12} />
                    </span>
                    </button>
                  )}
                  {selectedCoupon && (
                    <button
                      onClick={() => {
                        setSelectedCoupon(null)
                        setDiscount(0)
                      }}
                      className="flex-1 relative text-left rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600"
                    >
                      <p className="font-medium text-neutral-900">{selectedCoupon.codigo}</p>
                      <p>{selectedCoupon.tipo === 'porcentaje' ? `${Math.round(Number(selectedCoupon.valor))}%` : formatCOP(Number(selectedCoupon.valor))}</p>
                    <span className="absolute top-1 right-1 text-neutral-400 hover:text-error-600">
                      <X size={12} />
                    </span>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="px-4 py-3">
                  {items.length === 0 ? (
                    <EmptyCart onClear={clearCart} />
                  ) : (
                    <motion.div layout className="space-y-1">
                      <AnimatePresence mode="popLayout">
                        {items.map(item => (
                          <motion.div
                            key={item.producto_id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                          >
                            <CartItem
                              name={item.nombre}
                              price={item.precio}
                              quantity={item.cantidad}
                              onUpdateQuantity={delta => updateQuantity(item.producto_id, delta)}
                              onRemove={() => removeItem(item.producto_id)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>
              {items.length > 0 && (
                <PaymentFooter
                  total={total}
                  itemsCount={itemsCount}
                  onPay={handleOpenPayment}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={isPaymentOpen} onClose={handleClosePayment} title="Cobrar" size="md">
        <div className="space-y-5">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8"
            >
              <CheckCircle2 size={64} className="text-success-600 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Venta completada</h3>
              <p className="text-sm text-neutral-500">Total: ${formatCOP(total)}</p>
            </motion.div>
          ) : (
            <>
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-500">Subtotal</span>
                  <span className="text-sm font-medium text-neutral-900">${formatCOP(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-500">Descuento</span>
                    <span className="text-sm font-medium text-error-600">-${formatCOP(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                  <span className="text-base font-semibold text-neutral-700">Total</span>
                  <span className="text-xl font-bold text-neutral-900">${formatCOP(total)}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-neutral-500">
                {selectedClient && (
                  <div className="flex items-center justify-between">
                    <span>Cliente</span>
                    <span className="text-neutral-900">{selectedClient.nombre}</span>
                  </div>
                )}
                {selectedCoupon && (
                  <div className="flex items-center justify-between">
                    <span>Cupón</span>
                    <span className="text-neutral-900">{selectedCoupon.codigo}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Método de pago</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'efectivo', label: 'Efectivo', icon: Wallet },
                    { id: 'transferencia', label: 'Transferencia', icon: Building2 },
                    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-fast',
                        paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      )}
                    >
                      <method.icon size={20} />
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'efectivo' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Input
                    label="Efectivo recibido"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={cashReceived}
                    onChange={e => setCashReceived(e.target.value)}
                    error={cashReceivedNum > 0 && !isCashValid ? 'Monto insuficiente' : undefined}
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Cambio</span>
                    <span className="font-semibold text-neutral-900">${formatCOP(change)}</span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleQuickCash} className="w-full">
                    Pago exacto
                  </Button>
                </motion.div>
              )}

              {paymentMethod === 'tarjeta' && (
                <div className="bg-neutral-50 rounded-xl p-4 text-center">
                  <CreditCard size={32} className="text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600">Inserta o acerca la tarjeta al lector</p>
                </div>
              )}

              {paymentMethod === 'transferencia' && (
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-sm text-neutral-600 text-center">Esperando confirmación de transferencia...</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" className="flex-1" onClick={handleClosePayment}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={!isCashValid}
                  loading={isProcessing}
                  onClick={handlePayClick}
                >
                  Confirmar
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Seleccionar cliente" size="md">
        <div className="space-y-3">
          <Input
            placeholder="Buscar cliente..."
            value={clientQuery}
            onChange={e => setClientQuery(e.target.value)}
          />
          <div className="max-h-80 overflow-y-auto space-y-2">
            {isLoadingClients && <p className="text-sm text-neutral-500">Cargando clientes...</p>}
            {!isLoadingClients && clients.length === 0 && (
              <p className="text-sm text-neutral-500">No se encontraron clientes</p>
            )}
            {clients.map(client => (
              <button
                key={client.id}
                onClick={() => selectClient(client)}
                className={cn(
                  'w-full text-left rounded-lg border px-3 py-2 transition-colors',
                  selectedClient?.id === client.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'
                )}
              >
                <p className="text-sm font-medium text-neutral-900">{client.nombre}</p>
                {client.telefono && <p className="text-xs text-neutral-500">{client.telefono}</p>}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} title="Seleccionar cupón" size="md">
        <div className="space-y-3">
          <Input
            placeholder="Buscar cupón..."
            value={couponQuery}
            onChange={e => setCouponQuery(e.target.value)}
          />
          <div className="max-h-80 overflow-y-auto space-y-2">
            {isLoadingCoupons && <p className="text-sm text-neutral-500">Cargando cupones...</p>}
            {!isLoadingCoupons && coupons.length === 0 && (
              <p className="text-sm text-neutral-500">No se encontraron cupones activos</p>
            )}
            {coupons.map(coupon => (
              <button
                key={coupon.id}
                onClick={() => applyCoupon(coupon)}
                className={cn(
                  'w-full text-left rounded-lg border px-3 py-2 transition-colors',
                  selectedCoupon?.id === coupon.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'
                )}
              >
                <p className="text-sm font-medium text-neutral-900">{coupon.codigo}</p>
                <p className="text-xs text-neutral-500">
                  {coupon.tipo === 'porcentaje' ? `${Math.round(Number(coupon.valor))}% de descuento` : `${formatCOP(Number(coupon.valor))} de descuento`}
                </p>
                <p className="text-xs text-neutral-400">
                  Vence: {new Date(coupon.fecha_fin).toLocaleDateString('es-CO')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </POSLayout>
  )
}