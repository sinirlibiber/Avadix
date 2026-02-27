import { Navbar } from "@/components/Navbar";
import { useCampaigns, useDonate } from "@/hooks/use-campaigns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { CreateCampaignModal } from "@/components/CreateCampaignModal";
import { Coins, Heart, Share2, Info } from "lucide-react";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();
  const { address } = useAccount();
  const donateMutation = useDonate();
  const [amounts, setAmounts] = useState<Record<number, string>>({});

  const handleDonate = async (id: number, customAmount?: number) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    const amount = customAmount || parseFloat(amounts[id] || "0");
    if (amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      await donateMutation.mutateAsync({ id, amount, donorAddress: address });
      toast.success("Donation successful!");
      setAmounts(prev => ({ ...prev, [id]: "" }));
    } catch (err) {
      toast.error("Donation failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <Heart className="w-3 h-3 text-pink-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Support Community</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 tracking-tight">
            Support <span className="text-gradient">Impact</span><br />
            Change the World
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a decentralized ecosystem of giving. Support innovative projects on Avalanche through transparent, direct-to-creator funding.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CreateCampaignModal />
            <Button variant="outline" className="glass-button h-12 px-8 rounded-xl text-white border-white/10">
              How it Works
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl bg-white/5 animate-pulse border border-white/5" />
            ))
          ) : (
            campaigns?.map(c => (
              <Card key={c.id} className="group glass border-white/5 overflow-hidden flex flex-col transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] rounded-3xl">
                <div className="h-56 w-full overflow-hidden relative">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={c.title} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                    Avalanche
                  </div>
                </div>
                
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl font-bold text-white line-clamp-1">{c.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                    {c.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-xs text-white/30 uppercase font-bold tracking-widest mb-1">Raised</span>
                        <span className="text-2xl font-mono font-bold text-emerald-400">{c.raisedAmount} <span className="text-xs text-white/50">AVAX</span></span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-white/30 uppercase font-bold tracking-widest mb-1">Target</span>
                        <span className="text-sm font-mono font-bold text-white/70">{c.targetAmount} AVAX</span>
                      </div>
                    </div>
                    <div className="relative w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(52,211,153,0.3)]" 
                        style={{ width: `${Math.min(100, (parseFloat(c.raisedAmount) / parseFloat(c.targetAmount)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 p-6 pt-0">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {[0.5, 1, 5].map(preset => (
                      <Button 
                        key={preset}
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDonate(c.id, preset)}
                        className="glass-button h-9 text-[10px] font-bold border-white/5 hover:border-emerald-500/50 text-white/70 hover:text-emerald-400"
                      >
                        {preset} AVAX
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 w-full">
                    <div className="relative flex-1 group/input">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-emerald-400 transition-colors" />
                      <Input 
                        type="number" 
                        placeholder="Custom" 
                        className="glass-input h-11 pl-10 text-sm border-white/5 focus:border-emerald-500/50" 
                        value={amounts[c.id] || ""}
                        onChange={(e) => setAmounts(prev => ({ ...prev, [c.id]: e.target.value }))}
                      />
                    </div>
                    <Button 
                      onClick={() => handleDonate(c.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                      disabled={donateMutation.isPending}
                    >
                      Donate
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between w-full pt-2 border-t border-white/5">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest">
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest">
                      <Info className="w-3 h-3" /> Details
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-bold tracking-widest text-white/20 uppercase mb-2">Avadix Protocol</p>
          <p className="text-xs text-white/10">Built By Avadix Labs • 2026</p>
        </div>
      </footer>
    </div>
  );
}
