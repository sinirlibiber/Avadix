import { Navbar } from "@/components/Navbar";
import { useMarkets } from "@/hooks/use-markets";
import { useCampaigns } from "@/hooks/use-campaigns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Activity, Users, Heart } from "lucide-react";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const { address } = useAccount();
  const { data: markets } = useMarkets();
  const { data: campaigns } = useCampaigns();

  const userMarkets = markets?.filter(m => m.status === 'active') || [];
  const userCampaigns = campaigns?.filter(c => c.creatorAddress === address) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold font-display text-gradient mb-8">User Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">My Active Markets</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userMarkets.length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">My Campaigns</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userCampaigns.length}</div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Connected Wallet</CardTitle>
              <Users className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xs font-mono text-white/50 truncate">
                {address || "Not connected"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Market Activity</h2>
            <div className="space-y-4">
              {userMarkets.length === 0 ? (
                <p className="text-white/50">No active markets found.</p>
              ) : (
                userMarkets.map(m => (
                  <Card key={m.id} className="glass border-white/10">
                    <CardContent className="p-4 flex justify-between items-center">
                      <span className="text-white font-medium">{m.question}</span>
                      <span className="text-primary font-bold">{m.category}</span>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Donation Activity</h2>
            <div className="space-y-4">
              {userCampaigns.length === 0 ? (
                <p className="text-white/50">No active campaigns found.</p>
              ) : (
                userCampaigns.map(c => (
                  <Card key={c.id} className="glass border-white/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{c.title}</span>
                        <span className="text-emerald-400 font-bold">{c.raisedAmount} / {c.targetAmount} AVAX</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-emerald-400 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (parseFloat(c.raisedAmount) / parseFloat(c.targetAmount)) * 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
