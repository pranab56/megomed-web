import TipTapEditor from "@/utils/TipTapEditor/TipTapEditor";
import { useDispatch, useSelector } from "react-redux";
import { setMustHaveQualifications } from "@/redux/features/createJob/createjobSlice";
import React from "react";

function Qualifications() {
  const dispatch = useDispatch();
  const resetTrigger = "reset";

  const handleMustHaveQualifications = (qualifications) => {
    dispatch(setMustHaveQualifications(qualifications));
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

export default Qualifications;
