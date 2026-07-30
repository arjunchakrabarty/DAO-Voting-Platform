'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWalletStore } from '@/store/walletStore';
import { ExternalLink, PlusCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getGovernanceClient, mapSorobanError } from '@/lib/soroban';
import { Proposal } from 'governance';
import { toast } from 'sonner';

export default function Dashboard() {
  const { publicKey, connect } = useWalletStore();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      const client = getGovernanceClient(publicKey || "");
      const { result: countResult } = await client.get_proposal_count();
      const count = Number(countResult);
      
      const fetchedProposals: Proposal[] = [];
      for (let i = 1; i <= count; i++) {
        const { result: proposal } = await client.get_proposal({ proposal_id: i });
        if (proposal) fetchedProposals.push(proposal);
      }
      
      // Sort newest first
      fetchedProposals.reverse();
      setProposals(fetchedProposals);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    // Poll every 10 seconds
    const interval = setInterval(fetchProposals, 10000);
    return () => clearInterval(interval);
  }, [publicKey]);

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!publicKey) return;
    setActionLoading(`vote-${support ? 'yes' : 'no'}-${proposalId}`);
    try {
      const client = getGovernanceClient(publicKey);
      const tx = await client.vote({
        voter: publicKey,
        proposal_id: proposalId,
        support
      });
      await tx.signAndSend();
      toast.success(`Voted ${support ? 'Yes' : 'No'} successfully!`);
      await fetchProposals();
    } catch (err) {
      toast.error(mapSorobanError(err).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExecute = async (proposalId: number) => {
    if (!publicKey) return;
    setActionLoading(`execute-${proposalId}`);
    try {
      const client = getGovernanceClient(publicKey);
      const tx = await client.execute({ proposal_id: proposalId });
      await tx.signAndSend();
      toast.success('Proposal executed successfully! Funds have been released.');
      await fetchProposals();
    } catch (err) {
      toast.error(mapSorobanError(err).message);
    } finally {
      setActionLoading(null);
    }
  };

  const isVotingEnded = (endTime: bigint | number) => {
    return Date.now() / 1000 > Number(endTime);
  };

  const formatAmount = (amount: bigint | number) => {
    return (Number(amount) / 10000000).toLocaleString() + ' XLM';
  };

  const getStatus = (proposal: Proposal) => {
    if (proposal.executed) return 'Executed';
    if (Number(proposal.yes_votes) >= 2) return 'Passed';
    if (isVotingEnded(proposal.end_time)) {
      return Number(proposal.yes_votes) > Number(proposal.no_votes) ? 'Passed' : 'Failed';
    }
    return 'Active';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Governance Proposals</h1>
          <p className="text-gray-400 mt-1">Vote on active initiatives to shape the future of Nexus DAO.</p>
        </div>
        <Link href="/create">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Proposal
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border border-white/10 rounded-xl bg-white/5">
          No proposals found. Be the first to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal) => {
            const yes = Number(proposal.yes_votes);
            const no = Number(proposal.no_votes);
            const totalVotes = yes + no;
            const yesPercentage = totalVotes === 0 ? 0 : (yes / totalVotes) * 100;
            const status = getStatus(proposal);

            return (
              <Card key={Number(proposal.id)} className="bg-white/5 border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white">{proposal.title}</CardTitle>
                      <CardDescription className="text-gray-400 mt-2 line-clamp-2">
                        {proposal.description}
                      </CardDescription>
                    </div>
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      status === 'Active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      status === 'Executed' || status === 'Passed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-300">Requested: {formatAmount(proposal.amount)}</span>
                    <span className="text-gray-500">ID: #{Number(proposal.id)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {yes}
                      </span>
                      <span className="text-red-400 flex items-center gap-1">
                        {no} <XCircle className="w-4 h-4" />
                      </span>
                    </div>
                    <Progress value={yesPercentage} className="h-2 bg-red-950 [&>div]:bg-green-500" />
                  </div>
                </CardContent>
                <CardFooter className="bg-black/20 border-t border-white/5 p-4 flex flex-col gap-3">
                  {!publicKey ? (
                    <Button variant="secondary" className="w-full" onClick={connect}>
                      Connect to Vote
                    </Button>
                  ) : (
                    <>
                      {status === 'Active' && (
                        <div className="flex w-full gap-3">
                          <Button 
                            variant="outline" 
                            disabled={actionLoading !== null}
                            onClick={() => handleVote(Number(proposal.id), true)}
                            className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
                          >
                            {actionLoading === `vote-yes-${Number(proposal.id)}` ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Vote Yes'}
                          </Button>
                          <Button 
                            variant="outline" 
                            disabled={actionLoading !== null}
                            onClick={() => handleVote(Number(proposal.id), false)}
                            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            {actionLoading === `vote-no-${Number(proposal.id)}` ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Vote No'}
                          </Button>
                        </div>
                      )}
                      
                      {status === 'Passed' && (
                        <Button 
                          onClick={() => handleExecute(Number(proposal.id))}
                          disabled={actionLoading !== null}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          {actionLoading === `execute-${Number(proposal.id)}` ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Execute Proposal'}
                        </Button>
                      )}

                      {(status === 'Active' || status === 'Failed' || status === 'Executed') && (
                         <Button 
                          variant="outline" 
                          disabled 
                          className={`w-full opacity-50 ${status === 'Executed' ? 'border-green-500/30 text-green-400' : ''}`}
                        >
                          {status === 'Active' ? 'Requires 2 Yes Votes to Execute' : status === 'Executed' ? 'Proposal Executed' : 'Voting Failed'}
                        </Button>
                      )}
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
