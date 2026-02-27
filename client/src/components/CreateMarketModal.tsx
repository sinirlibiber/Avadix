import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { useCreateMarket } from "@/hooks/use-markets";
import { api } from "@shared/routes";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = api.markets.create.input.extend({
  // Override dates to strings for the HTML form inputs, then we coerce back
  endTime: z.string().min(1, "End date is required"),
  resolutionTime: z.string().min(1, "Resolution date is required"),
  initialLiquidity: z.coerce.number().min(0.2, "Minimum 0.2 AVAX required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateMarketModal() {
  const [open, setOpen] = useState(false);
  const createMarket = useCreateMarket();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      description: "",
      category: "Crypto",
      endTime: "",
      resolutionTime: "",
      initialLiquidity: 0.2,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createMarket.mutateAsync(data as any);
      toast.success("Market created successfully!");
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to create market");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all hover:scale-105 active:scale-95 border border-primary/50">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Market
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10 sm:max-w-[500px] text-foreground p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-display text-gradient mb-4">Create New Market</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Will BTC reach 100k by 2025?" className="glass-input rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Description & Rules</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Resolution criteria, edge cases..." 
                        className="glass-input rounded-xl resize-none min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-input rounded-xl">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="glass border-white/10 text-white">
                          <SelectItem value="Crypto">Crypto</SelectItem>
                          <SelectItem value="Politics">Politics</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Pop Culture">Pop Culture</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initialLiquidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Initial Liquidity (AVAX)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" min="0.2" className="glass-input rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Trading Ends</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="glass-input rounded-xl [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="resolutionTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Resolution Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="glass-input rounded-xl [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all bg-gradient-to-r from-primary to-purple-600"
                  disabled={createMarket.isPending}
                >
                  {createMarket.isPending ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing to Network</>
                  ) : (
                    "Create Market"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
