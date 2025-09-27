import TipTapEditor from "@/utils/TipTapEditor/TipTapEditor";
import { useState } from "react";

function TenderDescription() {
  const [tenderDescription, setTenderDescription] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleTenderDescription = (description) => {
    setTenderDescription(description);
  };

  // If you need a reset function, you can add:
  const resetDescription = () => {
    setTenderDescription("");
    setResetTrigger(prev => !prev); // Toggle reset trigger if needed by TipTapEditor
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-medium ">Tender Description</h2>
          <p>This will be visible to anyone who views your tender post.</p>
        </div>
        <div>
          <TipTapEditor
            handleJobDescription={handleTenderDescription}
            resetTrigger={resetTrigger}
          />
        </div>
      </div>
    </div>
  );
}

export default TenderDescription;