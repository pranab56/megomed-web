import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import ClientJobTenderPreview from "./freelanderJobTenderPreview";

export function AppliedJobsTender({ category = "jobs", type = "applied" }) {
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
      } else {
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
      <div className="grid grid-cols-1 gap-6 mx-auto px-4 md:px-0">
        {content.items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
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
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {category === "jobs" ? "Job ID" : "Tender ID"}: #{item.id}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className="button-gradient"
                      onClick={() => handlePreviewClick(item)}
                    >
                      Preview
                    </Button>
                    <Button className="button-gradient">Message</Button>
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

export default AppliedJobsTender;
