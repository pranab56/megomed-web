import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function JobsFollowersLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <Card className="w-full h-full">
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <h1 className="h2-gradient-text text-xl font-semibold">Jobs</h1>
          <p className="text-4xl text-black font-bold">400+</p>
        </div>
      </Card>
      <Card className="w-full h-full">
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <h1 className="h2-gradient-text text-xl font-semibold">Followers</h1>
          <p className="text-4xl text-black font-bold">400+</p>
        </div>
      </Card>
      <Card className="w-full h-full">
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <h1 className="h2-gradient-text text-xl font-semibold">Links</h1>

          <div className="flex flex-col items-center justify-center space-y-2">
            <Link href="/">Website</Link>
            <Link href="/">Facebook</Link>
            <Link href="/">Instagram</Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default JobsFollowersLinks;
