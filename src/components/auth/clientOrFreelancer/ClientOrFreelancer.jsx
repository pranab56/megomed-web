import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setCurrentUser } from "@/redux/features/currentUser/currentuserSlice";
import { Star, User, Users } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

const AccountTypeDialog = () => {
  const [selectedType, setSelectedType] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();

  const handleAccountTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleGetStarted = () => {
    console.log("Selected account type:", selectedType);
    setIsOpen(false);
    localStorage.setItem("accountType", selectedType);
    dispatch(setCurrentUser({ type: selectedType }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 bg-white rounded-3xl border-0 shadow-2xl">
        <div className="px-8 py-8">
          {/* Header with Avatar Icon */}
          <DialogHeader className="text-center space-y-4 mb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2 mx-auto text-center">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Select Your Account Type
              </DialogTitle>
              <p className="text-gray-600 text-base">
                Choose the account that best fits your needs.
              </p>
            </div>
          </DialogHeader>

          {/* Account Type Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Freelancer Option */}
            <div
              onClick={() => handleAccountTypeSelect("freelancer")}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedType === "freelancer"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
                }`}
            >
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="relative">
                    <User className="w-6 h-6 text-gray-600" />
                    <Star className="w-3 h-3 text-gray-600 absolute -top-1 -right-1" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">Freelancer</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Showcase your skills and find projects.
                  </p>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedType === "freelancer" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>

            {/* Client Option */}
            <div
              onClick={() => handleAccountTypeSelect("client")}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedType === "client"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
                }`}
            >
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">
                    Client (Company)
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Post jobs and hire freelancers.
                  </p>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedType === "client" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Get Started Button */}
          <Button
            onClick={handleGetStarted}
            disabled={!selectedType}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium text-base rounded-xl transition-colors duration-200"
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountTypeDialog;
