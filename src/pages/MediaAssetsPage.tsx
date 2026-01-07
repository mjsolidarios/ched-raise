
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Image as ImageIcon, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

// Mock data for initial display
const MEDIA_ASSETS = [
    {
        id: 0,
        title: "CHED Memo",
        type: "document",
        thumbnail: "/thumb-default.svg",
        date: "Dec 22, 2025",
        description: "CHED Memo for RAISE Summit 2025.",
        file: "/downloads/ched-raise-memo.pdf"
    },
    {
        id: 1,
        title: "Event Brochure",
        type: "document",
        thumbnail: "/thumb-default.svg",
        date: "Dec 10, 2025",
        description: "Download the official event brochure with schedule and speaker info.",
        file: "/downloads/ched-raise-event-brochure.pdf"
    },
    {
        id: 2,
        title: "Press Kit",
        type: "document",
        thumbnail: "/thumb-default.svg",
        date: "Nov 28, 2025",
        description: "Assets and information for media partners.",
        file: "/downloads/ched-raise-brand-kit.zip"
    },
    {
        id: 3,
        title: "Brand Guidelines",
        type: "document",
        thumbnail: "/thumb-default.svg",
        date: "Nov 28, 2025",
        description: "Brand Guidelines for RAISE Summit 2025.",
        file: "/downloads/ched-raise-brand-guidelines.pdf"
    }
];

const handleDownload = (asset: any) => {
    window.open(asset.file, '_blank');
};

const MediaAssetsPage = () => {
    return (
        <div>
            <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col">
                {/* Background Elements */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 flex-1 w-full pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <Badge variant="outline" className="mb-4 text-primary border-primary/50 px-4 py-1">
                            Media Center
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                            Media & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Resources</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Access official photos, videos, documents, and promotional materials for the CHED RAISE Summit 2025.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MEDIA_ASSETS.map((asset, index) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="bg-slate-900/50 border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 group h-full flex flex-col">
                                    <div className="relative aspect-video overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-300 z-10" />
                                        <img
                                            src={asset.thumbnail}
                                            alt={asset.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 z-20">
                                            <Badge className="bg-black/50 backdrop-blur-md border-white/10 text-white hover:bg-black/70">
                                                {asset.type === 'video' && <Play className="w-3 h-3 mr-1" />}
                                                {asset.type === 'image' && <ImageIcon className="w-3 h-3 mr-1" />}
                                                {asset.type === 'document' && <FileText className="w-3 h-3 mr-1" />}
                                                <span className="capitalize">{asset.type}</span>
                                            </Badge>
                                        </div>
                                        {asset.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg shadow-primary/50">
                                                    <Play className="w-5 h-5 ml-1" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted-foreground font-medium">{asset.date}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {asset.title}
                                        </h3>
                                        {asset.description && (
                                            <p className="text-sm text-slate-400 mb-6 flex-1">
                                                {asset.description}
                                            </p>
                                        )}
                                        <Button className="w-full mt-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all" onClick={() => handleDownload(asset)}>
                                            {asset.type === 'document' ? (
                                                <>
                                                    <Download className="w-4 h-4 mr-2" /> Download Asset
                                                </>
                                            ) : (
                                                <>
                                                    View {asset.type === 'video' ? 'Video' : 'Image'}
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MediaAssetsPage;
