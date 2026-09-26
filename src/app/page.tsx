import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Compass, Zap, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 flex-grow flex items-center justify-center text-white relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(139, 0, 0, 0.85), rgba(139, 0, 0, 0.85)), url("/hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <Image src="/niat-logo.jpg" alt="NIAT Logo" width={180} height={80} className="rounded-lg shadow-xl border-2 border-white/10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-md">
            NxtWave of Innovation in<br/><span className="text-red-200">Advanced Technologies</span>
          </h1>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto font-light">
            Discover internships, hackathons, scholarships, and campus opportunities personalized for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/opportunities">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-white hover:bg-red-50 text-[#8b0000]">
                Explore Opportunities
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-white hover:bg-red-50 text-[#8b0000]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600">Your journey to success in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md hover:border-[#8b0000]/20">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-[#8b0000] mb-6 shadow-sm border border-red-100">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">1. Discover</h3>
              <p className="text-slate-600">Browse through hundreds of curated opportunities across different categories and campuses.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md hover:border-[#8b0000]/20">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-[#8b0000] mb-6 shadow-sm border border-red-100">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">2. Personalize</h3>
              <p className="text-slate-600">Set up your profile to receive AI-powered recommendations based on your branch and interests.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md hover:border-[#8b0000]/20">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-[#8b0000] mb-6 shadow-sm border border-red-100">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">3. Track</h3>
              <p className="text-slate-600">Save interesting opportunities and manage all your applications in one centralized dashboard.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-center mt-auto border-t-4 border-[#8b0000]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Image src="/niat-logo.jpg" alt="NIAT Logo" width={80} height={40} className="rounded" />
            <p className="text-xl font-bold">NxtWave of Innovation</p>
          </div>
          <p className="text-slate-400">© 2026 NIAT Students Platform. Demo MVP.</p>
        </div>
      </footer>
    </div>
  )
}
