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
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about LeadRocket.ai
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg shadow-elegant px-6"
              >
                <AccordionTrigger className="text-left font-semibold py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
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