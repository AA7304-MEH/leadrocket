
const testimonials = [
    {
        body: "I was spending $300/mo on Lemlist and NeverBounce. LeadRockets does it all for $49. No brainer.",
        author: {
            name: "Alex Cohen",
            handle: "SaaS Founder",
            imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "The AI open lines are actually good. I expected generic fluff, but it pulled recent posts from LinkedIn flawlessly.",
        author: {
            name: "Sarah Jenkins",
            handle: "Agency Owner",
            imageUrl: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "Reply rates went from 4% to 12% in the first week. The dashboard makes it addictive to check stats.",
        author: {
            name: "Marcus Reid",
            handle: "Solo Founder",
            imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
];

const Testimonials = () => {
    return (
        <div className="bg-white py-24 sm:py-32" id="testimonials">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Trusted by Founders Who Ship
                    </p>
                </div>
                <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.author.name} className="flex flex-col justify-between rounded-2xl bg-gray-50 p-8 leading-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <blockquote className="text-gray-900 flex-1">
                                    <p className="italic">“{testimonial.body}”</p>
                                </blockquote>
                                <div className="mt-6 flex items-center gap-x-4">
                                    <img className="h-10 w-10 rounded-full bg-gray-50 object-cover" src={testimonial.author.imageUrl} alt="" />
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                                        <div className="text-gray-600 text-sm">{testimonial.author.handle}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
