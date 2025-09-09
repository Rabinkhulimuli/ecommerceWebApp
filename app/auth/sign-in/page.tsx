import React from 'react'
import Login from './Login'
import ShootingStars from '@/components/shootingStar/ShootingStar'
import NightSky from '@/components/shootingStar/NightSky'

export default function page() {
  return (
    <div className="relative min-h-screen w-full">
  {/* Background Sky */}
  <NightSky />

  {/* Foreground Content */}
  <div className="relative z-10">
    <Login />
  </div>
</div>

  )
}
