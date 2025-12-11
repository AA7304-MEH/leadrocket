
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

const CampaignCloneModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Copy className="h-4 w-4" /> Clone
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Clone Campaign</DialogTitle>
                    <DialogDescription>
                        Create a copy of this campaign. You can modify the steps and leads later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" defaultValue="Copy of SaaS Outreach" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Clone Campaign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CampaignCloneModal;
