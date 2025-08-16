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
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by 500+ Founders
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our customers are saying about their results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-premium transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                
                <blockquote className="text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-4">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">
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
      </div>
    </section>
  );
};