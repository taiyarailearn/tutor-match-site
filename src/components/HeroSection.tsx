import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroEducation from "@/assets/hero-education.jpg";

export const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroEducation})` }}
      >
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-hero text-primary-foreground mb-6 animate-fade-in">
            Connect. Grow. 
            <span className="bg-accent-gradient bg-clip-text text-transparent"> Transform Education</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in">
            Join thousands of educators worldwide. Find opportunities, build meaningful connections, 
            and shape the future of learning together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button variant="accent" size="lg" className="text-lg px-8 py-4 h-auto" asChild>
              <Link to="/signup">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20" asChild>
              <Link to="/jobs">
                Explore Opportunities
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-gradient rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-medium">
                <Users className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">10K+</div>
              <div className="text-primary-foreground/80">Active Teachers</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-rich/90 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-medium">
                <Briefcase className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">5K+</div>
              <div className="text-primary-foreground/80">Job Opportunities</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-gradient rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-medium">
                <MessageCircle className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">50K+</div>
              <div className="text-primary-foreground/80">Connections Made</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-rich/90 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-medium">
                <Star className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">4.9</div>
              <div className="text-primary-foreground/80">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};