import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import useToast from "@/hooks/showToast/ShowToast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

// Define translations locally
const dialogTranslations = {
  title: "Select Date & Add Reason",
  dateLabel: "Date",
  datePlaceholder: "Pick a date",
  reasonLabel: "Add Reason",
  reasonPlaceholder: "Enter your reason...",
  submitButton: "Submit",
};

export default function ExtendDeliveryDialog({ isOpen, onClose }) {
  const showToast = useToast();

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const [open, setOpen] = React.useState(isOpen);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      date: null,
      reason: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    showToast.success("Delivery date extended successfully", {
      description: `New delivery date: ${format(data.date, "PPP")}`,
    });
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{dialogTranslations.title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>{dialogTranslations.dateLabel}</Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{dialogTranslations.datePlaceholder}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            {/* Reason Textarea */}
            <div className="space-y-2">
              <Label htmlFor="reason">{dialogTranslations.reasonLabel}</Label>
              <Textarea
                id="reason"
                placeholder={dialogTranslations.reasonPlaceholder}
                {...register("reason", { required: "Reason is required" })}
              />
              {errors.reason && (
                <p className="text-red-500 text-sm">{errors.reason.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="button-gradient"
                onClick={handleSubmit(onSubmit)}
              >
                {dialogTranslations.submitButton}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}