
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const EmailVerifier = () => {
    const [file, setFile] = useState<File | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [results, setResults] = useState<{ valid: number, invalid: number, risky: number } | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const startVerification = () => {
        if (!file) return;
        setVerifying(true);
        // Simulate API
        setTimeout(() => {
            setVerifying(false);
            setResults({
                valid: 85,
                invalid: 10,
                risky: 5
            });
        }, 2000);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Email List Verifier</CardTitle>
            </CardHeader>
            <CardContent>
                {!results ? (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-4" />
                        <p className="text-sm font-medium mb-1">Upload your CSV list</p>
                        <p className="text-xs text-gray-500 mb-4">We'll identify valid, invalid, and risky emails.</p>
                        <Input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            id="file-upload"
                            onChange={handleUpload}
                        />
                        <label htmlFor="file-upload">
                            <Button variant="outline" asChild className="cursor-pointer">
                                <span>{file ? file.name : "Select File"}</span>
                            </Button>
                        </label>
                        {file && (
                            <Button className="mt-4" onClick={startVerification} disabled={verifying}>
                                {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {verifying ? "Verifying..." : "Start Verification"}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-700">{results.valid}%</div>
                                <div className="text-xs text-green-600">Valid</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-red-700">{results.invalid}%</div>
                                <div className="text-xs text-red-600">Invalid</div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-yellow-700">{results.risky}%</div>
                                <div className="text-xs text-yellow-600">Risky</div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>List Quality Score</span>
                                <span className="font-bold">85/100</span>
                            </div>
                            <Progress value={85} className="h-2" />
                        </div>

                        <div className="flex gap-4">
                            <Button className="w-full flex-1">Download Clean List</Button>
                            <Button variant="outline" onClick={() => { setResults(null); setFile(null); }}>Verify Another</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default EmailVerifier
