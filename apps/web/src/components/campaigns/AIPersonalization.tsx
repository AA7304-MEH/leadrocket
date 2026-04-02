
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIPersonalization = () => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedLines, setGeneratedLines] = useState<string[]>([]);
    const [tone, setTone] = useState([50]); // 0 = Formal, 100 = Casual

    const handleGenerate = async () => {
        if (!url) return;
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setGeneratedLines([
                "I noticed on your website that you recently launched the version 2.0. Congrats on the milestone!",
                "Saw your recent post about scaling challenges - your point about team alignment really resonated with me.",
                "Your background at [Company] is impressive. I bet that experience is super valuable for what you're building now.",
            ]);
            setLoading(false);
        }, 1500);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Personalization Engine
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="text-sm font-medium mb-1 block">Prospect URL (LinkedIn or Website)</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="https://linkedin.com/in/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <Button onClick={handleGenerate} disabled={loading || !url}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                        </Button>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Tone Recommender</label>
                        <span className="text-xs text-muted-foreground">{tone[0] < 30 ? "Formal" : tone[0] > 70 ? "Casual" : "Balanced"}</span>
                    </div>
                    <Slider
                        value={tone}
                        onValueChange={setTone}
                        max={100}
                        step={10}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Formal</span>
                        <span>Casual</span>
                    </div>
                </div>

                {generatedLines.length > 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Generated Opening Lines:</h3>
                        {generatedLines.map((line, idx) => (
                            <div key={idx} className="p-3 bg-muted rounded-md relative group hover:ring-1 hover:ring-primary transition-all">
                                <p className="text-sm pr-8">{line}</p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(line)}
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AIPersonalization;
