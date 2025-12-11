
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Zap, Rocket } from "lucide-react";

const HeroSection = () => {
    return (
        <div className="relative overflow-hidden bg-white pb-16 pt-20 lg:pb-32 lg:pt-32">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                        Cold Email That <span className="text-primary">Actually Gets Replies</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                        The all-in-one platform for founders and teams. Send AI-personalized emails, avoid spam, and track results in one place.
                    </p>
                    <div className="mt-10 flex justify-center gap-x-6">
                        <Link to="/register">
                            <Button size="lg" className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary-dark">
                                Start Free 14-Day Trial →
                            </Button>
                        </Link>
                        <a href="#demo">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                                Watch 90-Second Demo
                            </Button>
                        </a>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                        No credit card required. Start free trial after watching.
                    </p>
                    <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                            <Check className="h-5 w-5 text-success" />
                            <span className="font-medium text-gray-700">Trusted by 500+ founders</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                            <Zap className="h-5 w-5 text-warning" />
                            <span className="font-medium text-gray-700">38% average open rate</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                            <Rocket className="h-5 w-5 text-primary" />
                            <span className="font-medium text-gray-700">12% average reply rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
