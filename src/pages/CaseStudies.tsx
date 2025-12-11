
import FinalCTA from "@/components/marketing/FinalCTA";

const caseStudies = [
    {
        title: "How SaaSify added $10k MRR in 30 days",
        category: "SaaS",
        description: "Learn how this B2B SaaS used AI personalization to triple their reply rates.",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    },
    {
        title: "AgencyScale's journey to 100 clients",
        category: "Agency",
        description: "See how an agency owner automated their outreach and saved 20 hours a week.",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    },
    {
        title: "From 0 to 10 meetings a week",
        category: "Consulting",
        description: "A solo consultant's playbook for generating consistent leads on autopilot.",
        imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    },
];

const CaseStudies = () => {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Success Stories</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        See how real businesses are growing with LeadRockets.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {caseStudies.map((post) => (
                        <article key={post.title} className="flex flex-col items-start justify-between">
                            <div className="relative w-full">
                                <img
                                    src={post.imageUrl}
                                    alt=""
                                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                                />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                            </div>
                            <div className="max-w-xl">
                                <div className="mt-8 flex items-center gap-x-4 text-xs">
                                    <span className="text-gray-500">{post.category}</span>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                        <a href="#">
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </a>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <FinalCTA />
        </div>
    );
};

export default CaseStudies;
