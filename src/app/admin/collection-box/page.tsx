'use client'

import { Suspense } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CollectionBox from '@/components/admin/CollectionBox'

export default function CollectionBoxPage() {
  return (
    <AdminLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        <CollectionBox />
      </Suspense>
    </AdminLayout>
  )
}
