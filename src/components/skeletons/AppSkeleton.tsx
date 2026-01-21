import { Skeleton } from "@/components/ui/skeleton";

export function AppSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar Skeleton */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex">
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            <Skeleton className="h-8 w-[200px]" />
                        </div>
                        <nav className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Content Skeleton */}
            <main className="container py-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-[300px]" />
                        <Skeleton className="h-4 w-[500px]" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-[120px] rounded-xl" />
                        <Skeleton className="h-[120px] rounded-xl" />
                        <Skeleton className="h-[120px] rounded-xl" />
                        <Skeleton className="h-[120px] rounded-xl" />
                    </div>
                    <div className="min-h-[400px] rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 space-y-4">
                            <Skeleton className="h-6 w-[150px]" />
                            <Skeleton className="h-[300px] w-full" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
