import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { apiService } from "@/services/api";
import { Users, UserPlus, MessageCircle } from "lucide-react";

interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  bio: string | null;
  subjects: string[] | null;
  location: string | null;
  experience: number | null;
}

export const Network = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchConnections();
    fetchProfiles();
  }, [user, navigate]);

  const fetchConnections = async () => {
    if (!user) return;

    try {
      const data = await apiService.getConnections();
      setConnections((data as Connection[]) || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      // Fallback to direct Supabase query
      try {
        const { data, error } = await supabase
          .from('connections')
          .select('*')
          .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

        if (!error) {
          setConnections(data || []);
        }
      } catch (fallbackError) {
        console.error("Fallback connection fetch failed:", fallbackError);
      }
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id);

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (profileId: string) => {
    if (!user) return;

    try {
      await apiService.createConnection(profileId);
      
      toast({
        title: "Success!",
        description: "Connection request sent",
      });
      
      fetchConnections();
    } catch (error) {
      console.error("Error creating connection:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send connection request",
      });
    }
  };

  const isConnected = (profileId: string) => {
    return connections.some(conn => 
      (conn.user_id === profileId || conn.connected_user_id === profileId) &&
      conn.status === 'accepted'
    );
  };

  const hasPendingRequest = (profileId: string) => {
    return connections.some(conn => 
      (conn.user_id === profileId || conn.connected_user_id === profileId) &&
      conn.status === 'pending'
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-section-title text-primary">Professional Network</h1>
          <p className="text-muted-foreground mt-2">
            Connect with fellow educators and expand your professional network
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div>
                      <div className="h-5 bg-muted rounded w-24"></div>
                      <div className="h-4 bg-muted rounded w-16 mt-1"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Educators Found</h3>
            <p className="text-muted-foreground">Be the first to join the network!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <Card key={profile.id} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile.full_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-primary">{profile.full_name}</CardTitle>
                      <CardDescription>
                        {profile.location || "Location not specified"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4 line-clamp-3">
                    {profile.bio || "No bio available"}
                  </p>
                  
                  {profile.subjects && profile.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.subjects.slice(0, 3).map((subject, index) => (
                        <Badge key={index} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {profile.experience && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {profile.experience} years of experience
                    </p>
                  )}

                  <div className="flex gap-2">
                    {isConnected(profile.id) ? (
                      <Button variant="secondary" className="flex-1" disabled>
                        <Users className="w-4 h-4 mr-2" />
                        Connected
                      </Button>
                    ) : hasPendingRequest(profile.id) ? (
                      <Button variant="secondary" className="flex-1" disabled>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Pending
                      </Button>
                    ) : (
                      <Button 
                        variant="hero" 
                        className="flex-1"
                        onClick={() => handleConnect(profile.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                    
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};