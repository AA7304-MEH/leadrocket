import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, RefreshCw, Copy, Check } from 'lucide-react';

export const RemixWidget = () => {
    const [content, setContent] = useState("We help companies scale their outreach using AI agents.");
    const [tone, setTone] = useState("witty");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRemix = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/remix`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content, tone })
            });
            const data = await res.json();
            if (data.success) {
                setResult(data.data.remixed);
            }
        } catch (error) {
            console.error("Remix failed", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="glass-card h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-500" /> AI Campaign Remix
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Enter your base message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[100px] bg-white/50"
                />

                <div className="flex gap-2">
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="w-[140px] bg-white/50">
                            <SelectValue placeholder="Tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="witty">Witty</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="empathic">Empathic</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleRemix}
                        disabled={loading || !content}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        Remix It
                    </Button>
                </div>

                {result && (
                    <div className="mt-4 p-4 rounded-lg bg-white/40 border border-white/30 relative animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{result}</p>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={copyToClipboard}
                        >
                            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
