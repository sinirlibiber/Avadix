import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MarketCard } from "@/components/MarketCard";
import { useMarkets } from "@/hooks/use-markets";
import { Loader2, Search, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const CATEGORIES = ["All", "Crypto", "Politics", "Sports", "Pop Culture"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // We pass undefined if 'All' to fetch everything, otherwise pass the category
  const { data: markets, isLoading, error } = useMarkets(activeCategory === "All" ? undefined : activeCategory);

  const filteredMarkets = markets?.filter(market => 
    market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold font-display leading-[1.1] text-white"
            >
              Predict the <span className="text-gradient">Future</span>.<br/>Trade the Truth.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-white/60 leading-relaxed font-medium"
            >
              The most accurate prediction market on Avalanche Fuji. Buy YES or NO shares on the world's most highly debated topics and profit from being right.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-auto relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="glass-card p-6 rounded-3xl relative border-white/10 shadow-2xl flex flex-col items-center justify-center gap-2 min-w-[280px]">
              <Flame className="w-10 h-10 text-pink-500 mb-2" />
              <div className="text-sm font-bold text-white/50 uppercase tracking-wider">Top Performing</div>
              <div className="text-2xl font-bold font-display text-white">BTC to $100k</div>
              <div className="flex gap-4 mt-2">
                <span className="text-emerald-400 font-bold">YES 82¢</span>
                <span className="text-white/20">|</span>
                <span className="text-white/60 font-bold">Vol 145.2 AVAX</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls: Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-24 z-40 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-transparent sm:rounded-xl">
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto gap-2 scrollbar-hide no-scrollbar items-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === category 
                    ? "bg-white text-background shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search markets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-11 h-12 rounded-full w-full"
            />
          </div>
        </div>

        {/* Markets Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/50">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="font-medium text-lg">Loading prediction markets...</p>
          </div>
        ) : error ? (
          <div className="glass-card border-red-500/20 bg-red-500/5 p-10 rounded-3xl text-center">
            <p className="text-red-400 font-bold text-lg">Failed to load markets.</p>
            <p className="text-white/50 mt-2 text-sm">Please check your connection or try again later.</p>
          </div>
        ) : filteredMarkets?.length === 0 ? (
          <div className="glass-card border-white/5 p-20 rounded-3xl text-center flex flex-col items-center justify-center">
            <Search className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/80 font-bold text-xl">No markets found</p>
            <p className="text-white/40 mt-2">Try adjusting your search or filters, or create a new market!</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMarkets?.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </motion.div>
        )}

      </main>
    </div>
  );
}
