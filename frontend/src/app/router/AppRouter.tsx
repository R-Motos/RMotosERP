import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { AppShell } from '@/components/layout/AppShell'
import { SplashScreen } from '@/pages/SplashScreen'
import { LoginScreen } from '@/pages/LoginScreen'
import { LoadingScreen } from '@/pages/LoadingScreen'
import { Dashboard } from '@/pages/Dashboard'
import { POS } from '@/pages/POS'
import { ProductList } from '@/pages/ProductList'
import { ClientList } from '@/pages/ClientList'
import { SupplierList } from '@/pages/SupplierList'
import { CategoryList } from '@/pages/CategoryList'
import { BrandList } from '@/pages/BrandList'
import { TagList } from '@/pages/TagList'
import { CouponList } from '@/pages/CouponList'
import { UserList } from '@/pages/UserList'
import { PurchaseOrderList } from '@/pages/PurchaseOrderList'
import { PurchaseOrderDetail } from '@/pages/PurchaseOrderDetail'
import { PurchaseReceiptForm } from '@/pages/PurchaseReceiptForm'
import { SalesList } from '@/pages/SalesList'
import { SalesDetail } from '@/pages/SalesDetail'
import { InventoryList } from '@/pages/InventoryList'
import { InventoryDetail } from '@/pages/InventoryDetail'
import { AuditList } from '@/pages/AuditList'
import { Settings } from '@/pages/Settings'
import { Finanzas } from '@/pages/Finanzas'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppShell>{children}</AppShell>
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <POS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <ClientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proveedores"
          element={
            <ProtectedRoute>
              <SupplierList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <CategoryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marcas"
          element={
            <ProtectedRoute>
              <BrandList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etiquetas"
          element={
            <ProtectedRoute>
              <TagList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cupones"
          element={
            <ProtectedRoute>
              <CouponList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordenes-compra"
          element={
            <ProtectedRoute>
              <PurchaseOrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordenes-compra/:id"
          element={
            <ProtectedRoute>
              <PurchaseOrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordenes-compra/:id/recibir"
          element={
            <ProtectedRoute>
              <PurchaseReceiptForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finanzas"
          element={
            <ProtectedRoute>
              <Finanzas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas"
          element={
            <ProtectedRoute>
              <SalesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas/:id"
          element={
            <ProtectedRoute>
              <SalesDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario"
          element={
            <ProtectedRoute>
              <InventoryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario/:productoId"
          element={
            <ProtectedRoute>
              <InventoryDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auditoria"
          element={
            <ProtectedRoute>
              <AuditList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
