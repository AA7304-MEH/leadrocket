
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTA = () => {
    return (
        <div className="bg-primary">
            <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Launch Your First Campaign in 5 Minutes Today.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground">
                        Join 500+ founders sending cold emails that convert.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/register">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto font-bold shadow-lg">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalCTA;
