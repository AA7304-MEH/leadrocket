import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "We booked $80K in demos in 3 weeks. LeadRocket's AI found prospects we never would have discovered ourselves.",
    author: "Sarah Chen",
    role: "CEO",
    company: "GrowthStack",
    rating: 5
  },
  {
    quote: "Finally, leads that actually reply. The intent data is incredibly accurate - these prospects are ready to buy.",
    author: "James Rodriguez",
    role: "Founder",
    company: "Agency Pro",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
            ⭐ Customer Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Trusted by 500+ Founders
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            See what our customers are saying about their results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group relative bg-gradient-card shadow-elegant hover:shadow-floating transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-primary/10 animate-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="p-8 relative">
                {/* Quote Icon */}
                <div className="absolute top-4 right-6 text-6xl text-primary/10 font-serif">"</div>
                
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                
                <blockquote className="text-lg mb-8 leading-relaxed text-foreground/90 relative z-10">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center relative z-10">
                  <div className="relative w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-4 shadow-glow group-hover:animate-pulse-glow">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {testimonial.author}
                    </div>
                    <div className="text-muted-foreground">
                      {testimonial.role} @ {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional Social Proof */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="flex justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">97% Customer Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">$10M+ Revenue Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">50,000+ Leads Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};