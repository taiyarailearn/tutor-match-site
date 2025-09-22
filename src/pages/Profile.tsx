import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProfileSetup } from "@/components/ProfileSetup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";
import { Edit, MapPin, Calendar, BookOpen } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  bio: string;
  subjects: string[];
  experience: number;
  location: string;
  profile_image?: string;
  created_at: string;
}

export const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const data = await apiService.getProfile();
      setProfile(data as Profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      
      // Fallback to direct Supabase query
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error) {
          console.error("Fallback profile fetch failed:", error);
          toast({
            title: "Error",
            description: "Failed to load profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setProfile(data);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = () => {
    setIsEditing(false);
    fetchProfile();
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!profile || isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ProfileSetup 
            onComplete={handleProfileComplete}
            initialData={profile || undefined}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profile_image} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                  
                  <div className="flex items-center text-muted-foreground space-x-4">
                    {profile.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profile.location}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {profile.experience} years experience
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-muted-foreground mt-2">{profile.bio}</p>
                  )}
                </div>
              </div>
            </CardHeader>

            {profile.subjects && profile.subjects.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span className="font-medium">Teaching Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.experience}</div>
                  <div className="text-sm text-muted-foreground">Years Teaching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.subjects?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Subjects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Date(profile.created_at).getFullYear()}
                  </div>
                  <div className="text-sm text-muted-foreground">Member Since</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};