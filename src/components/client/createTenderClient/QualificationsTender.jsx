import TipTapEditor from "@/utils/TipTapEditor/TipTapEditor";
import { useState } from "react";

function QualificationsTender() {
  const [mustHaveQualifications, setMustHaveQualifications] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleMustHaveQualifications = (qualifications) => {
    setMustHaveQualifications(qualifications);
  };

  // If you need a reset function, you can add:
  const resetQualifications = () => {
    setMustHaveQualifications("");
    setResetTrigger(prev => !prev); // Toggle reset trigger if needed by TipTapEditor
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-medium ">Must-have qualifications</h2>
          <p>
            Your applicants must have these qualifications to be considered for
            the role.
          </p>
        </div>
        <div>
          <TipTapEditor
            handleMustHaveQualifications={handleMustHaveQualifications}
            resetTrigger={resetTrigger}
          />
        </div>
      </div>
    </div>
  );
}

export default QualificationsTender;