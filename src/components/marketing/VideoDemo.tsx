
const VideoDemo = () => {
    return (
        <section id="demo" className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        See How Easy It Is in 90 Seconds
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        No credit card required. Start free trial after watching.
                    </p>
                </div>
                <div className="relative mx-auto max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                    {/* Placeholder for video - in real app, replace with iframe */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors cursor-pointer group">
                                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2 group-hover:scale-110 transition-transform"></div>
                            </div>
                            <p className="text-white font-medium">Click to Play Demo</p>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000"
                        alt="Dashboard Preview"
                        className="w-full h-full object-cover opacity-50"
                    />
                </div>
            </div>
        </section>
    );
};

export default VideoDemo;
