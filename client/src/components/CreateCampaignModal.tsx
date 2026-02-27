import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";
import { useCreateCampaign } from "@/hooks/use-campaigns";
import { api } from "@shared/routes";
import { z } from "zod";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const formSchema = api.campaigns.create.input.extend({
  targetAmount: z.coerce.number().min(0.1, "Minimum 0.1 AVAX required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCampaignModal() {
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const createCampaign = useCreateCampaign();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      targetAmount: 1,
      imageUrl: "",
      creatorAddress: address || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!address) {
      toast.error("Please connect wallet first");
      return;
    }
    try {
      await createCampaign.mutateAsync({
        ...data,
        targetAmount: data.targetAmount.toString(),
        creatorAddress: address,
      } as any);
      toast.success("Campaign created successfully!");
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to create campaign");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-emerald-500/20">
          <PlusCircle className="w-5 h-5 mr-2" />
          Start Growing
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10 sm:max-w-[500px] text-foreground p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display text-white mb-4">Start New Campaign</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Save the environment" className="glass-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is this campaign for?" className="glass-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Target Amount (AVAX)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" className="glass-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." className="glass-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 mt-4"
              disabled={createCampaign.isPending}
            >
              {createCampaign.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Campaign
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
