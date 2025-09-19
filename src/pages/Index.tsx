import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Math Teacher",
      content: "Teacherson helped me connect with amazing colleagues worldwide. I found my dream teaching position through their platform!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Elementary Principal", 
      content: "The networking opportunities are incredible. I've built lasting professional relationships that have transformed my career.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "ESL Instructor",
      content: "Finally, a platform designed specifically for educators. The job matching is spot-on and the community is so supportive.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeatureSection />
      
      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-section-title text-primary mb-4">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of teachers who have transformed their careers with Teacherson
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card-gradient p-6 rounded-2xl shadow-medium border border-border/50 transition-smooth hover:shadow-strong">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircle key={i} className="w-5 h-5 text-accent-vibrant fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-primary">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-section-title text-primary-foreground mb-6">
            Ready to Transform Your Teaching Career?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join Teacherson today and discover opportunities, connections, and resources 
            that will elevate your impact in education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" className="text-lg px-8 py-4 h-auto" asChild>
              <Link to="/signup">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20" asChild>
              <Link to="/jobs">
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-xl font-bold">Teacherson</span>
              </div>
              <p className="text-primary-foreground/80 leading-relaxed">
                Connecting educators worldwide to create a better future for education.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/jobs" className="hover:text-primary-foreground transition-smooth">Find Jobs</Link></li>
                <li><Link to="/network" className="hover:text-primary-foreground transition-smooth">Network</Link></li>
                <li><Link to="/resources" className="hover:text-primary-foreground transition-smooth">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/help" className="hover:text-primary-foreground transition-smooth">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-primary-foreground transition-smooth">Contact Us</Link></li>
                <li><Link to="/community" className="hover:text-primary-foreground transition-smooth">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/about" className="hover:text-primary-foreground transition-smooth">About</Link></li>
                <li><Link to="/careers" className="hover:text-primary-foreground transition-smooth">Careers</Link></li>
                <li><Link to="/privacy" className="hover:text-primary-foreground transition-smooth">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Teacherson.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
