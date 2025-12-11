
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TemplateList } from "@/components/templates/TemplateList";
import { ComplianceGuard } from "@/components/compliance/ComplianceGuard";

const Templates = () => {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
                    <p className="text-muted-foreground">Manage your high-performing email templates.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Template
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TemplateList />
                </div>
                <div>
                    <ComplianceGuard />
                </div>
            </div>
        </div>
    );
};

export default Templates;
