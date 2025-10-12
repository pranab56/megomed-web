import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientJobTenderPreview from "./clientJobTenderPreview";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ClientAppliedJobsTender({
  category = "jobs",
  type = "applied",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handlePreviewClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const getContent = () => {
    if (category === "jobs") {
      if (type === "applied") {
        return {
          title: "Applied Jobs",
          items: [
            {
              id: 1,
              title: "Frontend Developer Position",
              company: "Tech Corp",
              status: "Applied",
            },
            {
              id: 2,
              title: "React Developer Role",
              company: "StartupXYZ",
              status: "Applied",
            },
            {
              id: 3,
              title: "UI/UX Designer",
              company: "Design Studio",
              status: "Applied",
            },
          ],
        };
      } else {
        return {
          title: "Shortlisted Jobs",
          items: [
            {
              id: 1,
              title: "Senior Frontend Developer",
              company: "BigTech Inc",
              status: "Shortlisted",
            },
            {
              id: 2,
              title: "Full Stack Developer",
              company: "Innovation Labs",
              status: "Shortlisted",
            },
          ],
        };
      }
    } else {
      if (type === "applied") {
        return {
          title: "Applied Tenders",
          items: [
            {
              id: 1,
              title: "Website Development Project",
              client: "Local Business",
              status: "Applied",
            },
            {
              id: 2,
              title: "Mobile App Development",
              client: "Healthcare Co",
              status: "Applied",
            },
            {
              id: 3,
              title: "E-commerce Platform",
              client: "Retail Store",
              status: "Applied",
            },
          ],
        };
      } else if (type === "shortlisted") {
        return {
          title: "Shortlisted Tenders",
          items: [
            {
              id: 1,
              title: "Enterprise Software Development",
              client: "Corporation ABC",
              status: "Shortlisted",
            },
            {
              id: 2,
              title: "Digital Marketing Campaign",
              client: "Marketing Agency",
              status: "Shortlisted",
            },
          ],
        };
      } else if (type === "accepted") {
        return {
          title: "Accepted Tenders",
          items: [
            {
              id: 1,
              title: "Enterprise Software Development",
              client: "Corporation ABC",
              status: "Accepted",
            },
            {
              id: 2,
              title: "Digital Marketing Campaign",
              client: "Marketing Agency",
              status: "Accepted",
            },
          ],
        };
      } else if (type === "rejected") {
        return {
          title: "Rejected Tenders",
          items: [
            {
              id: 1,
              title: "Enterprise Software Development",
              client: "Corporation ABC",
              status: "Rejected",
            },
          ],
        };
      }
    }
  };

  const content = getContent();

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {content.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {content.items.length} {content.items.length === 1 ? "item" : "items"}{" "}
          found
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 mx-auto  md:px-0">
        {content.items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-8">
                    <Avatar size={10} className="size-10 rounded-full">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-medium text-foreground ">
                        Md. Robin Gibson
                      </h4>
                      <p className="text-sm text-muted-foreground ">
                        Data Analytics Engineer
                      </p>
                    </div>
                  </div>
                  <h4 className="text-lg font-medium text-foreground mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category === "jobs"
                      ? `Company: ${item.company}`
                      : `Client: ${item.client}`}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "Applied"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : item.status === "Shortlisted"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : item.status === "Accepted"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-left md:text-right space-y-4 mt-4 md:mt-0">
                  <p className="text-xs text-muted-foreground">
                    {category === "jobs" ? "Job ID" : "Tender ID"}: #{item.id}
                  </p>{" "}
                  <Button className="button-gradient">Message</Button>
                  <div className="flex flex-wrap gap-2 md:mt-8">
                    <Button
                      className="button-gradient"
                      onClick={() => handlePreviewClick(item)}
                    >
                      Preview
                    </Button>
                    <Button className="button-gradient">Shortlist</Button>
                    <Button className="button-gradient">Accpet</Button>
                    <Button variant="destructive">Reject</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {content.items.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No {content.title.toLowerCase()} found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal */}
      <ClientJobTenderPreview
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jobData={selectedJob}
        category={category}
      />
    </div>
  );
}

export default ClientAppliedJobsTender;
