import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";

// Web3 Setup
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/web3'

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: 'd2e5a610f449298bf3eb24e107f4369e', // Public dummy id for demonstration
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'hsl(262, 83%, 58%)',
    '--w3m-border-radius-master': '1px'
  }
})

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/campaigns" component={Campaigns} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(20, 20, 30, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '1rem',
            },
            className: 'font-sans'
          }}
        />
        <Router />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
