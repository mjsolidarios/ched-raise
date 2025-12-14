
import { Check, UserPen, FileSearch, CheckCircle2, PlayCircle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RegistrationProgressProps {
    status: 'idle' | 'pending' | 'confirmed' | 'rejected' | null;
}

export function RegistrationProgress({ status }: RegistrationProgressProps) {
    const steps = [
        {
            id: 'start',
            label: "Start",
            icon: PlayCircle,
            status: 'completed' // Always completed as we are in the flow
        },
        {
            id: 'update',
            label: "Update Info",
            icon: UserPen,
            status: !status ? 'current' : 'completed'
        },
        {
            id: 'review',
            label: "Review", // Shortened for mobile
            icon: FileSearch,
            status: !status ? 'upcoming' : (status === 'pending' ? 'current' : 'completed')
        },
        {
            id: 'confirm',
            label: "Confirm", // Shortened for mobile
            icon: CheckCircle2,
            status: status === 'confirmed' ? 'current' : (status === 'rejected' ? 'error' : 'upcoming')
        },
        {
            id: 'finish',
            label: "Finish",
            icon: Flag,
            status: status === 'confirmed' ? 'completed' : 'upcoming'
        }
    ];

    // Helper to determine step styles
    const getStepStyles = (buttonStep: typeof steps[0]) => {
        // Special case for Confirm and Finish steps when completed/current to be green
        if ((buttonStep.id === 'confirm' || buttonStep.id === 'finish') && (buttonStep.status === 'completed' || buttonStep.status === 'current')) {
            return "bg-green-500 border-green-500 text-white ring-green-500/20";
        }

        switch (buttonStep.status) {
            case 'completed':
                return "bg-primary text-primary-foreground border-primary";
            case 'current':
                return "bg-background border-primary text-primary ring-2 ring-primary/20 ring-offset-2";
            case 'error':
                return "bg-destructive text-destructive-foreground border-destructive";
            default:
                return "bg-muted text-muted-foreground border-muted-foreground/30";
        }
    };

    // Helper for icon-only nodes (Start/Finish)
    const getIconStyles = (buttonStep: typeof steps[0]) => {
        if (buttonStep.id === 'finish' && (buttonStep.status === 'completed' || buttonStep.status === 'current')) {
            return "text-green-500";
        }
        if (buttonStep.status === 'completed' || buttonStep.status === 'current') {
            return "text-primary";
        }
        return "text-muted-foreground/30";
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 py-4 px-2 sm:px-6">
            <div className="flex items-center justify-between w-full">
                {steps.map((step, index) => {
                    const isIconOnly = step.id === 'start' || step.id === 'finish';

                    return (
                        <div key={step.id} className="flex flex-1 items-center last:flex-none">
                            {/* Step Node */}
                            <div className="relative flex flex-col items-center group">
                                <motion.div
                                    initial={false}
                                    animate={{ scale: step.status === 'current' ? 1.1 : 1 }}
                                    className={cn(
                                        "relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300",
                                        !isIconOnly && "rounded-full border-2 shadow-sm",
                                        isIconOnly ? getIconStyles(step) : getStepStyles(step)
                                    )}
                                >
                                    {step.status === 'completed' && step.id !== 'start' && step.id !== 'finish' ? (
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <step.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", isIconOnly && "w-6 h-6 sm:w-8 sm:h-8")} />
                                    )}
                                </motion.div>

                                {/* Label */}
                                <span className={cn(
                                    "absolute top-10 sm:top-12 text-[10px] sm:text-xs font-medium transition-colors duration-300 text-center w-20 sm:w-24 whitespace-normal leading-tight",
                                    step.status === 'upcoming' ? "text-muted-foreground" : "text-foreground"
                                )}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Connecting Line (if not last step) */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-[2px] mx-1 sm:mx-2 bg-muted relative rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-primary"
                                        initial={{ x: '-100%' }}
                                        animate={{
                                            x: (steps[index + 1].status === 'completed' || steps[index + 1].status === 'current' || steps[index + 1].status === 'error')
                                                ? '0%'
                                                : '-100%'
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Spacer for labels */}
            <div className="h-8 sm:h-10"></div>
        </div>
    );
}
