import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this legal? How do you get the data?",
    answer: "Yes, completely legal. We use only public data sources like LinkedIn, job postings, funding announcements, and company websites. All data is publicly available and compliant with GDPR and other privacy regulations."
  },
  {
    question: "How do you find buying intent signals?",
    answer: "Our AI monitors multiple data sources including job postings (hiring for relevant roles), funding news, technology stack changes, leadership changes, and company growth indicators. These signals indicate companies actively looking for solutions like yours."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel with one click from your dashboard. No contracts, no hidden fees, no questions asked. If you cancel, you keep access until the end of your billing period."
  },
  {
    question: "What industries do you cover?",
    answer: "We cover all B2B industries including SaaS, professional services, agencies, e-commerce, healthcare, fintech, and more. Our AI adapts to your specific industry and ideal customer profile."
  },
  {
    question: "How accurate are the leads?",
    answer: "Our leads are verified through multiple touchpoints with 95%+ accuracy for contact information and 90%+ relevance based on your ideal customer profile. We guarantee 50 qualified leads in your first week or 50% off."
  }
];

export const FaqSection = () => {
  return (
    <section className="py-24 bg-gradient-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-16 w-40 h-40 border border-primary/20 rounded-full" />
        <div className="absolute bottom-24 right-20 w-32 h-32 border border-primary/20 rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
            ❓ Got Questions?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about LeadRocket.ai
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto animate-slide-up">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="group bg-gradient-card rounded-2xl shadow-elegant hover:shadow-floating transition-all duration-300 border border-primary/10 px-8 transform hover:scale-[1.02] overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                <AccordionTrigger className="text-left font-semibold py-8 text-lg hover:text-primary transition-colors relative z-10 [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-8 leading-relaxed relative z-10">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};