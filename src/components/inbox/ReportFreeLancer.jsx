import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function ReportFreeLancer({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      reason: "",
      message: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Report submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast
      toast.success("Report submitted successfully!", {
        description: "We'll review your report within 24 hours.",
        duration: 5000,
      });

      // Reset form and close dialog
      reset();
      onClose?.();
    } catch (error) {
      toast.error("Failed to submit report", {
        description: "Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full md:min-w-xl mx-auto p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Report Freelancer
        </h2>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Report Reason */}
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium text-gray-900">
            Report Reason
          </Label>
          <Input
            id="reason"
            placeholder="Write Reason"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("reason", {
              required: "Please provide a reason for the report",
            })}
          />
          {errors.reason && (
            <p className="text-sm text-red-600">{errors.reason.message}</p>
          )}
        </div>

        {/* Verify Message */}
        <div className="space-y-2">
          <Label
            htmlFor="message"
            className="text-sm font-medium text-gray-900"
          >
            Verify Message
          </Label>
          <div className="relative">
            <Textarea
              id="message"
              placeholder="Write Message / Send Message"
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("message", {
                required: "Please provide a detailed message",
              })}
            />
            <button
              type="button"
              className="absolute bottom-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip size={18} />
            </button>
          </div>
          {errors.message && (
            <p className="text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onClose?.();
            }}
            className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 button-gradient text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Report Client"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}