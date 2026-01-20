'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapView } from '@/components/map/MapView'
import { StylePicker } from '@/components/styles/StylePicker'
import { DevicePicker } from '@/components/devices/DevicePicker'
import { GenerateButton } from '@/components/generation/GenerateButton'
import { CropPositionSelector } from '@/components/generation/CropPositionSelector'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Palette, Smartphone, Menu, X, Download, LogOut, Sparkles } from 'lucide-react'
import { LoadingLogo } from '@/components/ui/loading-logo'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { motion } from 'framer-motion'

export default function AppPage() {
	const router = useRouter()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { authenticated, user, isLoading: authLoading, signOut } = useAuth()
	const { isPro, isLoading: subscriptionLoading } = useSubscription()
	const isLoading = authLoading || subscriptionLoading

	// Redirect to auth page if not authenticated
	useEffect(() => {
		if (!isLoading && !authenticated) {
			router.replace('/auth?redirect=/app')
		}
	}, [isLoading, authenticated, router])

	// Show loading state
	if (isLoading || !authenticated) {
		return (
			<main className='h-screen flex items-center justify-center bg-background'>
				<LoadingLogo size="lg" text="Loading..." />
			</main>
		)
	}

	// Authenticated but not Pro - show upgrade prompt
	if (!isPro) {
		return (
			<main className='h-screen flex flex-col bg-background'>
				<header className='shrink-0 z-50 border-b bg-background/80 backdrop-blur-md'>
					<div className='flex h-[60px] md:h-[70px] items-center justify-between px-4 md:px-6 max-w-6xl mx-auto'>
						<Link href="/" className='flex items-center gap-2'>
							<Image src='/logo.webp' alt='City Frame' width={32} height={32} className='w-8 h-8 md:w-9 md:h-9' />
							<span className='font-extrabold text-lg md:text-xl tracking-tight'>City Frame</span>
						</Link>
						<div className='flex items-center gap-3'>
							<span className='text-sm text-muted-foreground hidden sm:block font-medium'>
								{user?.email}
							</span>
							<Button size='sm' variant='ghost' onClick={signOut} className='rounded-xl hover:bg-primary/5 hover:text-foreground transition-all'>
								<LogOut className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</header>

				<div className='flex-1 flex items-center justify-center p-4'>
					<Card className='max-w-md w-full p-8 md:p-10 text-center rounded-2xl border-2 shadow-xl'>
						<div className='w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30'>
							<Sparkles className='w-10 h-10 text-white' />
						</div>
						<h1 className='text-2xl md:text-3xl font-extrabold tracking-tight mb-3'>Upgrade to Pro</h1>
						<p className='text-muted-foreground mb-8 text-base md:text-lg'>
							Get lifetime access to all styles, devices, and AI-upscaled 4K wallpapers.
						</p>
						<Link href='/pricing'>
							<Button size='lg' className='w-full gap-2 h-14 rounded-xl text-base font-semibold shadow-lg shadow-primary/20'>
								<Sparkles className='w-5 h-5' />
								Get Pro Access
							</Button>
						</Link>
						<Link href='/' className='block mt-4'>
							<Button variant='ghost' size='sm' className='font-medium'>
								Back to Home
							</Button>
						</Link>
					</Card>
				</div>
			</main>
		)
	}

	// Authenticated and Pro - show full app
	return (
		<main className='h-screen flex flex-col bg-background overflow-hidden'>
			{/* Header */}
			<header className='shrink-0 z-50 border-b bg-background/80 backdrop-blur-md'>
				<div className='flex h-[60px] md:h-[70px] items-center px-4 md:px-6 w-full'>
					<Link href="/" className='flex items-center gap-2'>
						<Image src='/logo.webp' alt='City Frame' width={32} height={32} className='w-8 h-8 md:w-9 md:h-9' />
						<span className='font-extrabold text-lg md:text-xl tracking-tight hidden sm:block'>City Frame</span>
					</Link>

					<nav className='hidden md:flex items-center gap-4 ml-auto'>
						<div className='flex items-center gap-3'>
							<span className='text-sm text-muted-foreground font-medium'>
								{user?.email}
							</span>
							<span className='px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-sm'>
								Unlimited
							</span>
							<Button size='sm' variant='ghost' onClick={signOut} className='rounded-xl hover:bg-primary/5 hover:text-foreground transition-all'>
								<LogOut className='w-4 h-4' />
							</Button>
						</div>
					</nav>

					{/* Mobile menu button */}
					<div className='md:hidden ml-auto flex items-center gap-2'>
						<span className='px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-sm'>
							Unlimited
						</span>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className='rounded-xl'
						>
							{sidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className='flex-1 flex flex-col md:flex-row relative min-h-0'>
				{/* Map Area */}
				<div className='flex-1 relative min-h-[40vh] md:min-h-0'>
					<MapView />
				</div>

				{/* Mobile Sidebar Overlay */}
				{sidebarOpen && (
					<div
						className='fixed inset-0 bg-black/50 z-40 md:hidden'
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Sidebar */}
				<aside
					className={cn(
						'fixed md:static right-0 top-[60px] md:top-auto bottom-0 md:bottom-auto w-80 md:w-72 lg:w-80 md:h-full bg-background/95 backdrop-blur-md border-l z-50 md:z-auto',
						'transform transition-transform duration-300 ease-in-out',
						'md:transform-none',
						sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
					)}
				>
					<div className='h-full flex flex-col overflow-hidden'>
						{/* Scrollable Content */}
						<div className='flex-1 overflow-y-auto p-4 space-y-6'>
							{/* Style Section */}
							<motion.section
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
								className='flex flex-col gap-3'
							>
								<div className='flex items-center gap-2'>
									<div className='w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center'>
										<Palette className='w-4 h-4 text-primary' />
									</div>
									<h2 className='text-sm font-bold'>Style</h2>
								</div>
								<StylePicker />
							</motion.section>

							{/* Device Section */}
							<motion.section
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className='flex flex-col gap-3'
							>
								<div className='flex items-center gap-2'>
									<div className='w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center'>
										<Smartphone className='w-4 h-4 text-primary' />
									</div>
									<h2 className='text-sm font-bold'>Devices</h2>
								</div>
								<DevicePicker />
							</motion.section>

							{/* Crop Position Section */}
							<motion.section
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<CropPositionSelector />
							</motion.section>
						</div>

						{/* Fixed Bottom */}
						<div className='shrink-0 p-4 border-t bg-background/95 backdrop-blur-md'>
							<GenerateButton />
							<p className='text-[10px] text-muted-foreground text-center mt-3 font-medium'>
								&copy; {new Date().getFullYear()} City Frame
							</p>
						</div>
					</div>
				</aside>

				{/* Mobile Generate Button (when sidebar is closed) */}
				<div className='md:hidden fixed bottom-4 left-4 right-4 z-30'>
					{!sidebarOpen && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Card className='p-3 shadow-2xl shadow-primary/10 border-2 rounded-2xl bg-background/95 backdrop-blur-md'>
								<div className='flex gap-3'>
									<Button
										variant='outline'
										className='flex-1 h-12 rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/30 hover:text-foreground transition-all'
										onClick={() => setSidebarOpen(true)}
									>
										<Palette className='w-4 h-4 mr-2' />
										Customize
									</Button>
									<Button
										className='flex-1 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all'
										onClick={() => setSidebarOpen(true)}
									>
										<Download className='w-4 h-4 mr-2' />
										Generate
									</Button>
								</div>
							</Card>
						</motion.div>
					)}
				</div>
			</div>
		</main>
	)
}
