import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Briefcase, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date_posted: string;
  posted_by: string | null;
}

export const Jobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchJobs();
  }, [user, navigate]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('date_posted', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load jobs",
        });
      } else {
        setJobs(data || []);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load jobs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            job_id: jobId,
            user_id: user.id,
          }
        ]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to apply for job",
        });
      } else {
        toast({
          title: "Success!",
          description: "Application submitted successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply for job",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-section-title text-primary">Teaching Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Discover your next teaching opportunity
            </p>
          </div>
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
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
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground">Be the first to post a teaching job!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader>
                  <CardTitle className="text-primary">{job.title}</CardTitle>
                  <CardDescription className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location || "Remote"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4 line-clamp-3">
                    {job.description || "No description provided"}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(job.date_posted).toLocaleDateString()}
                    </Badge>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="hero"
                    onClick={() => handleApplyJob(job.id)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};