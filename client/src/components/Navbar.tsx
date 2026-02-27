import { Link } from "wouter";
import { CreateMarketModal } from "./CreateMarketModal";
import { Activity, BarChart3, Users } from "lucide-react";
import { useMarkets } from "@/hooks/use-markets";

export function Navbar() {
  const { data: markets } = useMarkets();
  
  const totalVolume = markets?.reduce((acc, m) => acc + parseFloat(m.totalVolume || '0'), 0) || 0;
  const activeMarkets = markets?.filter(m => m.status === 'active').length || 0;

  return (
    <div className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">Avadix</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 ml-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">Markets</Link>
            <Link href="/campaigns" className="text-white/70 hover:text-white transition-colors">Campaigns</Link>
            <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
          </div>

          {/* Desktop Stats Bar */}
          <div className="hidden md:flex items-center gap-8 px-6 py-2 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">24h Volume</span>
                <span className="text-sm font-bold text-white font-mono">{totalVolume.toFixed(2)} AVAX</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Active Markets</span>
                <span className="text-sm font-bold text-white font-mono">{activeMarkets}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Traders</span>
                <span className="text-sm font-bold text-white font-mono">1,482</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <CreateMarketModal />
            {/* Wagmi / Web3Modal standard connect button */}
            <w3m-button balance="hide" size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}
