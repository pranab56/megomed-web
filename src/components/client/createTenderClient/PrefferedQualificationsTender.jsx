import TipTapEditor from "@/utils/TipTapEditor/TipTapEditor";
import { useState } from "react";

function PrefferedQualificationsTender() {
  const [preferredQualifications, setPreferredQualifications] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false);

  const handlePreferredQualifications = (qualifications) => {
    setPreferredQualifications(qualifications);
  };

  // If you need a reset function, you can add:
  const resetQualifications = () => {
    setPreferredQualifications("");
    setResetTrigger(prev => !prev); // Toggle reset trigger if needed by TipTapEditor
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 2xl:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-medium ">Preferred qualifications</h2>
          <p>
            Your applicants don't need to have these qualifications, but you
            prefer to hire someone with them.
          </p>
        </div>
        <div>
          <TipTapEditor
            handlePreferredQualifications={handlePreferredQualifications}
            resetTrigger={resetTrigger}
          />
        </div>
      </div>
    </div>
  );
}

export default PrefferedQualificationsTender;