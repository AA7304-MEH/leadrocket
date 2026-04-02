import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import dashboardAnalytics from "@/assets/carousel/dashboard-analytics.png";
import dashboardDataviz from "@/assets/carousel/dashboard-dataviz.png";
import teamCollaboration from "@/assets/carousel/team-collaboration.png";

const demoImages = [
    {
        src: dashboardAnalytics,
        alt: "Dashboard Overview",
        caption: "Comprehensive Analytics Dashboard"
    },
    {
        src: dashboardDataviz,
        alt: "Data Visualization",
        caption: "Real-time Data Visualization"
    },
    {
        src: teamCollaboration,
        alt: "Team Collaboration",
        caption: "Seamless Team Collaboration"
    }
];

const VideoDemo = () => {
    return (
        <section id="demo" className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Explore the Platform
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Take a closer look at our powerful features and intuitive interface.
                    </p>
                </div>

                <div className="relative mx-auto max-w-5xl">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {demoImages.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <div className="overflow-hidden rounded-2xl shadow-2xl bg-gray-900 border border-gray-200">
                                            <div className="relative aspect-video">
                                                <img
                                                    src={image.src}
                                                    alt={image.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 text-white text-center">
                                                    <p className="font-medium text-lg">{image.caption}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-none" />
                        <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-none" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default VideoDemo;
