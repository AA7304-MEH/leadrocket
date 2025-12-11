
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTA = () => {
    return (
        <div className="bg-primary">
            <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to Get More Replies?
                        <br />
                        Join 500+ founders who stopped wasting time.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground">
                        Start your 14-day free trial today. No credit card required.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/register">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto font-semibold">
                                Start Free 14-Day Trial →
                            </Button>
                        </Link>
                        <Link to="/pricing">
                            <Button variant="link" className="text-sm font-semibold leading-6 text-white hover:text-white/80">
                                View Pricing <span aria-hidden="true">→</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalCTA;
