import React from 'react'
import { DashboardLayout } from './DashboardLayout'
import { Toaster } from '@/components/ui/toaster'

const RootLayout = () => {
  return (
    <>
      <DashboardLayout />
      <Toaster />
    </>
  )
}

export default RootLayout