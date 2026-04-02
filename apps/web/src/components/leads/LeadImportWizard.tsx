import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Users,
    Mail,
    Building,
    Briefcase,
    Link,
    Globe,
    Linkedin
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface FieldMapping {
    csvField: string;
    appField: string;
    sample: string;
}

interface ValidationResult {
    valid: number;
    invalid: number;
    duplicates: number;
    errors: { row: number; field: string; message: string }[];
}

interface LeadImportWizardProps {
    onComplete: (leads: any[], mappings: FieldMapping[]) => void;
    onCancel: () => void;
}

const APP_FIELDS = [
    { id: 'email', label: 'Email', icon: Mail, required: true },
    { id: 'first_name', label: 'First Name', icon: Users, required: false },
    { id: 'last_name', label: 'Last Name', icon: Users, required: false },
    { id: 'company', label: 'Company', icon: Building, required: false },
    { id: 'title', label: 'Job Title', icon: Briefcase, required: false },
    { id: 'phone', label: 'Phone', icon: null, required: false },
    { id: 'website', label: 'Website', icon: Globe, required: false },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, required: false },
    { id: 'industry', label: 'Industry', icon: null, required: false },
    { id: 'skip', label: 'Skip this field', icon: null, required: false },
];

const LeadImportWizard: React.FC<LeadImportWizardProps> = ({ onComplete, onCancel }) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mappings, setMappings] = useState<FieldMapping[]>([]);
    const [validation, setValidation] = useState<ValidationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    // Enrichment options
    const [enrichOptions, setEnrichOptions] = useState({
        verifyEmails: true,
        enrichCompany: false,
        findLinkedIn: false
    });

    const parseCSV = (text: string): string[][] => {
        const lines = text.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const values: string[] = [];
            let current = '';
            let inQuotes = false;

            for (const char of line) {
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());
            return values;
        });
    };

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (!uploadedFile) return;

        if (!uploadedFile.name.match(/\.(csv|xlsx?)$/i)) {
            toast({ title: "Invalid File", description: "Please upload a CSV or Excel file" });
            return;
        }

        setFile(uploadedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const parsed = parseCSV(text);

                if (parsed.length < 2) {
                    toast({ title: "Invalid CSV", description: "File must have headers and at least one row" });
                    return;
                }

                const csvHeaders = parsed[0];
                const rows = parsed.slice(1);

                setHeaders(csvHeaders);
                setCsvData(rows);

                // Auto-map common fields
                const autoMappings: FieldMapping[] = csvHeaders.map(header => {
                    const normalized = header.toLowerCase().replace(/[_\s-]/g, '');
                    let appField = 'skip';

                    if (normalized.includes('email')) appField = 'email';
                    else if (normalized.includes('firstname') || normalized === 'first') appField = 'first_name';
                    else if (normalized.includes('lastname') || normalized === 'last') appField = 'last_name';
                    else if (normalized.includes('company') || normalized.includes('organization')) appField = 'company';
                    else if (normalized.includes('title') || normalized.includes('position')) appField = 'title';
                    else if (normalized.includes('phone') || normalized.includes('tel')) appField = 'phone';
                    else if (normalized.includes('website') || normalized.includes('url')) appField = 'website';
                    else if (normalized.includes('linkedin')) appField = 'linkedin';
                    else if (normalized.includes('industry')) appField = 'industry';

                    return {
                        csvField: header,
                        appField,
                        sample: rows[0]?.[csvHeaders.indexOf(header)] || ''
                    };
                });

                setMappings(autoMappings);
                setStep(2);
                toast({ title: "File Loaded ✅", description: `${rows.length} rows found` });
            } catch {
                toast({ title: "Parse Error", description: "Could not parse the CSV file" });
            }
        };
        reader.readAsText(uploadedFile);
    }, [toast]);

    const updateMapping = (csvField: string, appField: string) => {
        setMappings(mappings.map(m =>
            m.csvField === csvField ? { ...m, appField } : m
        ));
    };

    const validateData = () => {
        setIsProcessing(true);

        // Simulate validation
        setTimeout(() => {
            const emailFieldIndex = mappings.findIndex(m => m.appField === 'email');
            const emails = csvData.map(row => row[emailFieldIndex]);

            const validEmails = emails.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
            const invalidEmails = emails.filter(e => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

            const uniqueEmails = new Set(validEmails);
            const duplicates = validEmails.length - uniqueEmails.size;

            setValidation({
                valid: uniqueEmails.size,
                invalid: invalidEmails.length,
                duplicates,
                errors: invalidEmails.slice(0, 5).map((email, i) => ({
                    row: i + 2,
                    field: 'email',
                    message: `Invalid email: ${email || '(empty)'}`
                }))
            });

            setIsProcessing(false);
            setStep(3);
        }, 1000);
    };

    const handleImport = () => {
        setIsProcessing(true);
        setStep(4);

        // Simulate import progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                // Create lead objects
                const leads = csvData.map(row => {
                    const lead: Record<string, string> = {};
                    mappings.forEach((mapping, index) => {
                        if (mapping.appField !== 'skip') {
                            lead[mapping.appField] = row[index] || '';
                        }
                    });
                    return lead;
                });

                setTimeout(() => {
                    setIsProcessing(false);
                    onComplete(leads, mappings);
                    toast({
                        title: "Import Complete! 🎉",
                        description: `${validation?.valid || leads.length} leads imported successfully`
                    });
                }, 500);
            }
            setImportProgress(Math.min(progress, 100));
        }, 200);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
                {[
                    { num: 1, label: 'Upload' },
                    { num: 2, label: 'Map Fields' },
                    { num: 3, label: 'Review' },
                    { num: 4, label: 'Import' }
                ].map((s, i) => (
                    <React.Fragment key={s.num}>
                        <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step > s.num ? 'bg-green-500 text-white' :
                                    step === s.num ? 'bg-primary text-white' :
                                        'bg-gray-200 text-gray-500'
                                }`}>
                                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                            </div>
                            <span className={`font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                                {s.label}
                            </span>
                        </div>
                        {i < 3 && (
                            <div className={`flex-1 h-1 mx-4 rounded ${step > s.num ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Your Leads</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-700 mb-2">
                                Drag & drop your CSV file here
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                or click to browse
                            </p>
                            <Badge variant="outline">Supports: CSV, Excel</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Card className="p-4 cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-primary transition-all">
                                <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                                <p className="font-medium">CSV File</p>
                                <p className="text-xs text-gray-500">Standard format</p>
                            </Card>
                            <Card className="p-4 cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-primary transition-all opacity-50">
                                <Linkedin className="w-8 h-8 text-blue-600 mb-2" />
                                <p className="font-medium">LinkedIn Export</p>
                                <p className="text-xs text-gray-500">Pro feature</p>
                                <Badge className="mt-2 bg-primary/10 text-primary">Pro</Badge>
                            </Card>
                            <Card className="p-4 cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-primary transition-all opacity-50">
                                <Link className="w-8 h-8 text-purple-600 mb-2" />
                                <p className="font-medium">CRM Sync</p>
                                <p className="text-xs text-gray-500">HubSpot, Salesforce</p>
                                <Badge className="mt-2 bg-primary/10 text-primary">Pro</Badge>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Map Fields */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Map Your Fields</span>
                            <Badge variant="outline">{csvData.length} rows</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>CSV Column</TableHead>
                                    <TableHead>Sample Data</TableHead>
                                    <TableHead>Map To</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mappings.map((mapping) => {
                                    const fieldDef = APP_FIELDS.find(f => f.id === mapping.appField);
                                    return (
                                        <TableRow key={mapping.csvField}>
                                            <TableCell className="font-medium">{mapping.csvField}</TableCell>
                                            <TableCell className="text-gray-500 max-w-[200px] truncate">
                                                {mapping.sample || '(empty)'}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={mapping.appField}
                                                    onValueChange={(value) => updateMapping(mapping.csvField, value)}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {APP_FIELDS.map(field => (
                                                            <SelectItem key={field.id} value={field.id}>
                                                                <div className="flex items-center gap-2">
                                                                    {field.icon && <field.icon className="w-4 h-4" />}
                                                                    {field.label}
                                                                    {field.required && <span className="text-red-500">*</span>}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                {mapping.appField === 'skip' ? (
                                                    <Badge variant="secondary">Skipped</Badge>
                                                ) : fieldDef?.required ? (
                                                    <Badge className="bg-green-100 text-green-700">Required ✓</Badge>
                                                ) : (
                                                    <Badge variant="outline">Mapped</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {!mappings.some(m => m.appField === 'email') && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                <AlertTriangle className="w-5 h-5" />
                                <span>You must map an Email field to continue</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Review & Enrich */}
            {step === 3 && validation && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Validation Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="font-medium text-green-700">Valid</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">{validation.valid}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <XCircle className="w-5 h-5 text-red-600" />
                                        <span className="font-medium text-red-700">Invalid</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-600">{validation.invalid}</p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                                        <span className="font-medium text-amber-700">Duplicates</span>
                                    </div>
                                    <p className="text-2xl font-bold text-amber-600">{validation.duplicates}</p>
                                </div>
                            </div>

                            {validation.errors.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium mb-2">Issues Found:</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        {validation.errors.map((error, i) => (
                                            <li key={i}>Row {error.row}: {error.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Enrichment Options
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium">Verify Email Addresses</p>
                                        <p className="text-sm text-gray-500">Check deliverability before sending</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={enrichOptions.verifyEmails}
                                        onChange={(e) => setEnrichOptions({ ...enrichOptions, verifyEmails: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer opacity-50">
                                    <div>
                                        <p className="font-medium">Enrich Company Data</p>
                                        <p className="text-sm text-gray-500">Add industry, size, revenue</p>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary">Pro</Badge>
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer opacity-50">
                                    <div>
                                        <p className="font-medium">Find LinkedIn Profiles</p>
                                        <p className="text-sm text-gray-500">Match to LinkedIn accounts</p>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary">Pro</Badge>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Step 4: Importing */}
            {step === 4 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {importProgress < 100 ? 'Importing Leads...' : 'Import Complete! 🎉'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {importProgress < 100
                                ? 'Please wait while we process your leads'
                                : `${validation?.valid} leads imported successfully`
                            }
                        </p>
                        <div className="max-w-md mx-auto">
                            <Progress value={importProgress} className="h-3" />
                            <p className="text-sm text-gray-500 mt-2">{Math.round(importProgress)}%</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            {step < 4 && (
                <div className="flex items-center justify-between mt-6">
                    <Button variant="outline" onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>

                    {step === 2 && (
                        <Button
                            onClick={validateData}
                            disabled={!mappings.some(m => m.appField === 'email') || isProcessing}
                        >
                            {isProcessing ? 'Validating...' : 'Validate Data'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}

                    {step === 3 && (
                        <Button onClick={handleImport}>
                            Import {validation?.valid} Leads
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeadImportWizard;
