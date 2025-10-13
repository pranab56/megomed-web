import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ClientJobTenderPreview({
  isOpen,
  onClose,
  jobData,
  category = "jobs",
}) {
  if (!jobData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl md:max-w-5xl lg:min-w-6xl max-h-[95vh] ">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-xl  font-bold text-center">
            {category === "jobs" ? "Job Preview" : "Tender Preview"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h2 className="text-lg lg:text-2xl font-bold text-foreground">
              {jobData.title}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground">
              {category === "jobs" ? jobData.company : jobData.client}
            </p>
            <Badge
              variant={
                jobData.status === "Applied"
                  ? "default"
                  : jobData.status === "Shortlisted"
                  ? "secondary"
                  : jobData.status === "Accepted"
                  ? "default"
                  : "destructive"
              }
              className="text-sm px-3 py-1"
            >
              {jobData.status}
            </Badge>
          </div>

          {/* Freelancer Profile Section */}

          <div className=" lg:max-h-[65vh] max-h-[55vh] overflow-y-auto">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">RG</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Robin Gibson
                </h3>
                <p className="text-muted-foreground">Data Analytics Engineer</p>
              </div>
            </div>

            {/* Freelancer Proposal Content */}
            <div className="space-y-4">
              {/* Introduction Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Introduction</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                    <p className="text-muted-foreground">
                      I believe I am the right fit for this project because of
                      my extensive experience in data analytics and proven track
                      record of delivering high-quality results. With over 5
                      years in the field, I have successfully completed similar
                      projects and understand the specific requirements needed
                      for this role.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Proposal Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Proposal</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                    <p className="text-muted-foreground">
                      My approach involves thorough data analysis, advanced
                      modeling techniques, and clear reporting. I will start by
                      understanding your specific requirements, then develop a
                      comprehensive data strategy that aligns with your business
                      objectives. The project will be delivered in phases with
                      regular updates and feedback sessions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Documents Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Upload Documents
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-400 text-xs font-bold">
                          PDF
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        Project_Presentation.pdf
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded flex items-center justify-center">
                        <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">
                          PPT
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        Case_Study.pptx
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estimated Time and Price Quote */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Estimated Time
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border text-center">
                      <span className="text-2xl font-bold text-foreground">
                        4 weeks
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Price Quote</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border text-center">
                      <span className="text-2xl font-bold text-foreground">
                        $5,000
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <Button variant="outline" onClick={onClose} className="px-8">
                Close
              </Button>
              <Button
                className="button-gradient px-8"
                onClick={() => {
                  // Handle message action
                  console.log("Message clicked");
                }}
              >
                Message Client
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClientJobTenderPreview;
