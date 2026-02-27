import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Clock, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface MarketProps {
  market: {
    id: number;
    question: string;
    description: string;
    category: string;
    endTime: string | Date;
    yesLiquidity: string;
    noLiquidity: string;
    totalVolume: string;
    status: string;
  };
}

export function MarketCard({ market }: MarketProps) {
  const [isTrading, setIsTrading] = useState(false);
  const [tradeAction, setTradeAction] = useState<"YES" | "NO">("YES");
  const [tradeAmount, setTradeAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isConnected } = useAccount();

  // Math for probability
  const yesLiq = parseFloat(market.yesLiquidity || '0');
  const noLiq = parseFloat(market.noLiquidity || '0');
  const totalLiq = yesLiq + noLiq;
  const yesProb = totalLiq > 0 ? Math.round((yesLiq / totalLiq) * 100) : 50;
  const noProb = 100 - yesProb;

  const handleSimulatedTrade = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    // Simulate smart contract transaction delay
    await new Promise(r => setTimeout(r, 1500));
    
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold">Trade Executed</span>
        <span className="text-sm opacity-90">Bought {tradeAmount} AVAX of {tradeAction} at {tradeAction === "YES" ? yesProb : noProb}¢</span>
      </div>
    );
    
    setIsSubmitting(false);
    setIsTrading(false);
    setTradeAmount("");
  };

  const isClosed = new Date(market.endTime) < new Date() || market.status !== 'active';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/30 transition-colors pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/5 backdrop-blur-md">
            {market.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border backdrop-blur-md ${isClosed ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            {isClosed ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {isClosed ? 'Closed' : formatDistanceToNow(new Date(market.endTime), { addSuffix: true })}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-display tracking-tight leading-none text-white drop-shadow-md">
            {yesProb}¢
          </div>
          <div className="text-xs text-white/50 font-medium">Vol: {parseFloat(market.totalVolume).toFixed(1)} AVAX</div>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold font-display text-white leading-tight z-10">
        {market.question}
      </h3>
      
      {/* Progress Bar & Buttons */}
      <div className="mt-auto flex flex-col gap-3 z-10">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-emerald-400">YES {yesProb}%</span>
            <span className="text-red-400">{noProb}% NO</span>
          </div>
          <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${yesProb}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${noProb}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-l from-red-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
            />
          </div>
        </div>

        {!isClosed && (
          <Button 
            onClick={() => setIsTrading(!isTrading)} 
            variant="outline"
            className="w-full bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl transition-all h-11 font-bold group"
          >
            <TrendingUp className="w-4 h-4 mr-2 text-primary group-hover:text-pink-400 transition-colors" /> 
            Trade Now
            {isTrading ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </Button>
        )}
      </div>

      {/* Inline Trading Form */}
      <AnimatePresence>
        {isTrading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden z-10"
          >
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex gap-2 p-1 bg-black/30 rounded-xl border border-white/5">
                <button 
                  onClick={() => setTradeAction("YES")}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tradeAction === "YES" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "text-white/50 hover:text-white/80"}`}
                >
                  Buy YES
                </button>
                <button 
                  onClick={() => setTradeAction("NO")}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tradeAction === "NO" ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "text-white/50 hover:text-white/80"}`}
                >
                  Buy NO
                </button>
              </div>

              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Amount in AVAX" 
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="glass-input h-12 rounded-xl pr-16 font-mono text-lg"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                  AVAX
                </div>
              </div>

              <div className="flex justify-between text-xs text-white/60 px-1 font-medium">
                <span>Estimated shares:</span>
                <span className="text-white">
                  {tradeAmount && parseFloat(tradeAmount) > 0 
                    ? Math.floor((parseFloat(tradeAmount) / ((tradeAction === "YES" ? yesProb : noProb) / 100))).toLocaleString() 
                    : 0}
                </span>
              </div>

              <Button 
                onClick={handleSimulatedTrade}
                disabled={isSubmitting}
                className={`w-full h-12 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${tradeAction === "YES" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25" : "bg-red-600 hover:bg-red-500 shadow-red-500/25"}`}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Tx...</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5 mr-2" /> Confirm {tradeAction}</>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
