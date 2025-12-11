
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Is cold email legal?",
        answer: "Yes, provided you follow compliance rules like CAN-SPAM and GDPR. LeadRockets includes features like unsubscribe links and suppression lists to help keep you compliant.",
    },
    {
        question: "How does AI personalization work?",
        answer: "We scan the prospect's LinkedIn profile and company website (provided via URL) to find relevant recent activities or unique facts, then generate a personalized opening line.",
    },
    {
        question: "What's your deliverability rate?",
        answer: "Our users see an average of 92-98% deliverability. We include a dedicated Deliverability Dashboard to help you maintain high scores.",
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, absolutely. There are no contracts. You can cancel with one click from your dashboard.",
    },
    {
        question: "How does the free plan work?",
        answer: "You get 100 emails per month free, forever. You have access to basic features. It's great for testing the platform.",
    },
];

const FAQ = () => {
    return (
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
                    <Accordion type="single" collapsible className="w-full mt-10">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
