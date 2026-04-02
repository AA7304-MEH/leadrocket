import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Twitter, Mail, Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareWidgetProps {
    referralLink: string;
}

export const ShareWidget: React.FC<ShareWidgetProps> = ({ referralLink }) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast({
            title: "Link Copied!",
            description: "Share it with your network to earn rewards.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const shareSocial = (platform: 'twitter' | 'linkedin' | 'email') => {
        const text = "I'm using LeadRockets to automate my cold outreach. It's built for viral growth! \n\nCheck it out:";
        let url = '';

        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
                break;
            case 'email':
                url = `mailto:?subject=You gotta check this out&body=${encodeURIComponent(text + ' ' + referralLink)}`;
                break;
        }
        window.open(url, '_blank');
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Invite Links</CardTitle>
                <CardDescription>Share your unique link to earn 10% lifetime commissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex space-x-2">
                    <Input value={referralLink} readOnly className="font-mono bg-muted" />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="w-full" onClick={() => shareSocial('twitter')}>
                        <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                        Twitter
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => shareSocial('linkedin')}>
                        <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                        LinkedIn
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => shareSocial('email')}>
                        <Mail className="mr-2 h-4 w-4 text-gray-600" />
                        Email
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
