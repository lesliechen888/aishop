'use client'

import { Suspense } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductCollection from '@/components/admin/ProductCollection'

export default function ProductCollectionPage() {
  return (
    <AdminLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        <ProductCollection />
      </Suspense>
    </AdminLayout>
  )
}
