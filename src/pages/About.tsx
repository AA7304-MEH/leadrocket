
import FinalCTA from "@/components/marketing/FinalCTA";

const About = () => {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About LeadRockets</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We're on a mission to democratize cold email for founders and small teams.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-start">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <p>
                                    Cold email used to be hard. You needed one tool for verification, another for scraping, another for sending, and another for warm-up. And if you messed up one step, you'd burn your domain.
                                </p>
                                <p className="mt-8">
                                    We built LeadRockets to solve that. We combined everything into one seamless platform. But we didn't stop there. We added AI to handle the hardest part: personalization.
                                </p>
                                <p className="mt-8">
                                    Our goal is simple: Help you get more replies, book more meetings, and grow your business, without spending thousands on tools or agencies.
                                </p>
                            </div>
                        </div>
                        <div className="sm:px-6 lg:px-0">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
                                alt="Team brainstorming"
                                className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                                width={2432}
                                height={1442}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <FinalCTA />
        </div>
    );
};

export default About;
