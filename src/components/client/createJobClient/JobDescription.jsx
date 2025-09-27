"use client";

import TipTapEditor from "@/utils/TipTapEditor/TipTapEditor";
import { useCallback, useEffect, useState } from "react";

function JobDescription({ onDescriptionChange, resetForm }) {
  const [description, setDescription] = useState("");

  // Notify parent of description changes
  useEffect(() => {
    if (onDescriptionChange) {
      onDescriptionChange(description);
    }
  }, [description, onDescriptionChange]);

  // Reset description when resetForm prop changes
  useEffect(() => {
    if (resetForm) {
      setDescription("");
    }
  }, [resetForm]);

  // Memoize the callback to prevent unnecessary re-renders
  const handleJobDescription = useCallback((newDescription) => {
    console.log("Job description:", newDescription);
    setDescription(newDescription);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-medium ">Job Description</h2>
          <p>This will be visible to anyone who views your job post.</p>
        </div>
        <div>
          <TipTapEditor
            handleJobDescription={handleJobDescription}
            resetTrigger={resetForm}
            initialContent={description}
          />
        </div>
      </div>
    </div>
  );
}

export default JobDescription;