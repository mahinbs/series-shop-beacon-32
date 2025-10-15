import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CircleService } from '@/services/circleService';
import { RefreshCw, Mail } from 'lucide-react';

interface MemberRow {
  id: string;
  email: string;
  user_full_name?: string;
  user_avatar_url?: string;
  joined_at: string;
}

export default function CirclesAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<MemberRow[]>([]);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const circle = await CircleService.getGlobalCircle();
      if (circle) {
        const list = await CircleService.getCircleMembers(circle.id);
        setMembers(list as any);
      } else {
        setMembers([]);
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load members', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Circle Members</h2>
          <p className="text-muted-foreground">
            List of emails submitted by users via the join circle form on the website
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadMembers} 
          disabled={isLoading}
          className="border-gray-700 text-gray-300"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Reload
        </Button>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> 
            Submitted Emails ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No members yet. Users can join via the /join-circle page.
            </div>
          ) : (
            <div className="border border-gray-800 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/70">
                  <tr className="text-left text-gray-400">
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-t border-gray-800 text-gray-200 hover:bg-gray-800/50">
                      <td className="py-3 px-4 font-medium">{m.email}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(m.joined_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
