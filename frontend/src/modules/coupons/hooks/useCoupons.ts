import { useState, useCallback } from 'react'
import { couponService } from '../services/coupon.service'
import type { Cupon, CuponFilter, CuponCreate, CuponUpdate } from '../types/coupon'

interface UseCouponsReturn {
  coupons: Cupon[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: CuponFilter) => Promise<void>
  reset: () => void
}

export function useCoupons(): UseCouponsReturn {
  const [coupons, setCoupons] = useState<Cupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: CuponFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await couponService.list(filters)
      setCoupons(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cupones')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setCoupons([])
    setError(null)
  }, [])

  return {
    coupons,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}

interface UseCouponFormReturn {
  isOpen: boolean
  editingCoupon: Cupon | null
  isLoading: boolean
  readOnly: boolean
  openCreate: () => void
  openEdit: (coupon: Cupon) => void
  openView: (coupon: Cupon) => void
  close: () => void
  submit: (data: CuponCreate | CuponUpdate) => Promise<void>
  changeState: (id: number, estado: 'activo' | 'inactivo') => Promise<void>
  deleteCoupon: (id: number) => Promise<void>
}

export function useCouponForm(onSuccess: () => void): UseCouponFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Cupon | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingCoupon(null)
    setReadOnly(false)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((coupon: Cupon) => {
    setEditingCoupon(coupon)
    setReadOnly(false)
    setIsOpen(true)
  }, [])

  const openView = useCallback((coupon: Cupon) => {
    setEditingCoupon(coupon)
    setReadOnly(true)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingCoupon(null)
    setReadOnly(false)
  }, [])

  const submit = useCallback(async (data: CuponCreate | CuponUpdate) => {
    setIsLoading(true)
    try {
      if (editingCoupon) {
        await couponService.update(editingCoupon.id, data as CuponUpdate)
      } else {
        await couponService.create(data as CuponCreate)
      }
      close()
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [editingCoupon, close, onSuccess])

  const changeState = useCallback(async (id: number, estado: 'activo' | 'inactivo') => {
    setIsLoading(true)
    try {
      await couponService.changeState(id, estado)
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  const deleteCoupon = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      await couponService.delete(id)
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  return {
    isOpen,
    editingCoupon,
    isLoading,
    openCreate,
    openEdit,
    openView,
    close,
    submit,
    changeState,
    deleteCoupon,
    readOnly,
  }
}
