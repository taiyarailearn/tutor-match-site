import { Users, Briefcase, MessageCircle, BookOpen, Award, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import networkIllustration from "@/assets/network-illustration.jpg";

export const FeatureSection = () => {
  const features = [
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with educators worldwide. Build meaningful relationships that advance your career and enrich your teaching experience.",
    },
    {
      icon: Briefcase,
      title: "Career Opportunities", 
      description: "Discover teaching positions, administrative roles, and education consulting opportunities tailored to your expertise.",
    },
    {
      icon: MessageCircle,
      title: "Direct Messaging",
      description: "Communicate seamlessly with colleagues, mentors, and potential employers through our secure messaging system.",
    },
    {
      icon: BookOpen,
      title: "Resource Sharing",
      description: "Share lesson plans, teaching strategies, and educational resources with a community that values collaboration.",
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Access workshops, certifications, and professional development opportunities to enhance your teaching skills.",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join a diverse community of educators from different cultures, backgrounds, and educational philosophies.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-section-title text-primary mb-4">
            Everything You Need to Thrive as an Educator
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Teacherson provides all the tools and connections you need to advance your 
            teaching career and make a lasting impact on education.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-medium transition-smooth bg-card-gradient border-border/50">
                  <div className="w-12 h-12 bg-hero-gradient rounded-xl flex items-center justify-center mb-4 shadow-soft">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg text-primary mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={networkIllustration} 
                alt="Teachers connecting and collaborating"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-6 -right-6 bg-card shadow-strong rounded-2xl p-4 animate-float">
              <div className="text-2xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-accent-gradient shadow-strong rounded-2xl p-4 animate-float" style={{animationDelay: "2s"}}>
              <div className="text-2xl font-bold text-accent-foreground">24/7</div>
              <div className="text-sm text-accent-foreground/80">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};