import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-44" />
                        <Skeleton className="h-4 w-52 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-44" />
                        <Skeleton className="h-4 w-52 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-44" />
                        <Skeleton className="h-4 w-52 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-44" />
                        <Skeleton className="h-4 w-52 mt-2" />
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-36" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="ml-4 space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                <Skeleton className="ml-auto h-4 w-[50px]" />
                            </div>
                            <div className="flex items-center">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="ml-4 space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                <Skeleton className="ml-auto h-4 w-[50px]" />
                            </div>
                            <div className="flex items-center">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="ml-4 space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                <Skeleton className="ml-auto h-4 w-[50px]" />
                            </div>
                            <div className="flex items-center">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="ml-4 space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                <Skeleton className="ml-auto h-4 w-[50px]" />
                            </div>
                             <div className="flex items-center">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="ml-4 space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                <Skeleton className="ml-auto h-4 w-[50px]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 