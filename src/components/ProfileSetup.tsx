import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSetupProps {
  onComplete: () => void;
  initialData?: {
    full_name?: string;
    bio?: string;
    subjects?: string[];
    location?: string;
    experience?: number;
  };
}

export const ProfileSetup = ({ onComplete, initialData }: ProfileSetupProps) => {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    bio: initialData?.bio || "",
    subjects: initialData?.subjects?.join(", ") || "",
    location: initialData?.location || "",
    experience: initialData?.experience || 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert subjects string to array
      const subjects = formData.subjects
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const profileData = {
        ...formData,
        subjects,
        experience: Number(formData.experience),
      };

      await apiService.updateProfile(profileData);
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      onComplete();
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Fallback to direct Supabase update if API fails
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const subjects = formData.subjects
            .split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0);

          await supabase
            .from('profiles')
            .update({
              full_name: formData.full_name,
              bio: formData.bio,
              subjects,
              location: formData.location,
              experience: Number(formData.experience),
            })
            .eq('id', user.id);

          toast({
            title: "Success",
            description: "Profile updated successfully!",
          });
          onComplete();
        }
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Help other educators connect with you by completing your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself and your teaching experience..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="subjects">Teaching Subjects</Label>
            <Input
              id="subjects"
              value={formData.subjects}
              onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
              placeholder="Math, Science, English (separate with commas)"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};