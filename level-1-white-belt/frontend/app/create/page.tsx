'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWalletStore } from '@/store/walletStore';
import { toast } from 'sonner';
import { getGovernanceClient, mapSorobanError } from '@/lib/soroban';

export default function CreateProposal() {
  const router = useRouter();
  const { publicKey } = useWalletStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const amount = formData.get('amount') as string;
      const recipient = formData.get('recipient') as string;

      const client = getGovernanceClient(publicKey);
      const stroopsAmount = BigInt(Math.floor(Number(amount) * 10000000));

      const tx = await client.create_proposal({
        proposer: publicKey,
        title,
        description,
        amount: stroopsAmount,
        recipient,
        duration_seconds: BigInt(86400 * 3), // 3 days
      });

      await tx.signAndSend();
      
      toast.success('Proposal created successfully!');
      router.push('/');
    } catch (err: any) {
      toast.error(mapSorobanError(err).message || 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Proposal</CardTitle>
          <CardDescription>Request funds from the Treasury for a DAO initiative.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="proposal-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Proposal Title</Label>
              <Input id="title" name="title" placeholder="e.g., Fund Marketing Campaign" required className="bg-black/50 border-white/10" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                name="description" 
                placeholder="Explain why the DAO should fund this..."
                required
                className="flex min-h-[120px] w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Requested Amount (XLM)</Label>
                <Input id="amount" name="amount" type="number" min="1" placeholder="5000" required className="bg-black/50 border-white/10" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Public Key</Label>
                <Input id="recipient" name="recipient" placeholder="G..." required className="bg-black/50 border-white/10" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-white/10 pt-6">
          <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" form="proposal-form" disabled={loading || !publicKey} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Submitting...' : 'Submit Proposal'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
