"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  CreditCard,
  FileText,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import CreateInvoicesDialog from "./CreateInvoicesDialog";
import ExtendDeliveryDialog from "./EntendDeliveryDialog";
import ProjectCompleteDialog from "./ProjectCompleteDialog";
import ViewInvoiceDetailsDialog from "./ViewInvoiceDetailsDialog";
import toast from "react-hot-toast";
import useToast from "@/hooks/showToast/ShowToast";
import {
  useGetInvoiceFreelancerQuery,
  useGetInvoiceClientQuery,
  useExtendRequestMutation,
  useApproveExtendRequestMutation,
  useCreateStripePaymentMutation,
  useAcceptRespondInvoiceMutation,
} from "@/features/invoice/invoiceApi";

// Define translations locally
const invoiceTranslations = {
  title: "Invoices",
  subtitle:
    "With our simple invoicing system, managing payments is quick and easy for both freelancers and clients. Never miss a payment or detail again!",
  createNewInvoice: "Create New Invoice",
  search: "Search",
  invoiceFilter: {
    all: "All Invoice",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
  },
  viewDetails: "View Details",
  extendDeliveryDate: "Extend Delivery Date",
  deliveryNow: "Delivery Now",
  payNow: "Pay Now",
};

// Main component content
const InvoicesContent = () => {
  const router = useRouter();
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;

  const [isCreateInvoicesDialogOpen, setIsCreateInvoicesDialogOpen] =
    useState(false);
  const [isViewInvoiceDetailsDialogOpen, setIsViewInvoiceDetailsDialogOpen] =
    useState(false);
  const [isProjectCompleteDialogOpen, setIsProjectCompleteDialogOpen] =
    useState(false);
  const [isExtendDeliveryDialogOpen, setIsExtendDeliveryDialogOpen] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [popoverOpen, setPopoverOpen] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isAcceptExtendModalOpen, setIsAcceptExtendModalOpen] = useState(false);
  const [selectedExtendInvoice, setSelectedExtendInvoice] = useState(null);
  const showToast = useToast();

  // Extend request mutation
  const [extendRequest, { isLoading: isExtendLoading }] =
    useExtendRequestMutation();
  const [approveExtendRequest, { isLoading: isApproveLoading }] =
    useApproveExtendRequestMutation();
  const [acceptRespondInvoice, { isLoading: isAcceptLoading }] =
    useAcceptRespondInvoiceMutation();

  // Handle opening accept extend request modal
  const handleOpenAcceptExtendModal = (invoice) => {
    console.log("Opening accept extend modal for invoice:", invoice.id);
    setSelectedExtendInvoice(invoice);
    setIsAcceptExtendModalOpen(true);
    setMessage({ type: "", text: "" });
  };

  // Handle extend request submission
  const handleExtendRequestSubmit = async (action, invoice) => {
    if (!invoice) return;

    console.log("Starting extend request:", { action, invoiceId: invoice.id });

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      console.log("Calling approveExtendRequest API with:", {
        invoiceID: invoice.id,
        action: action,
      });

      // Use approveExtendRequest API for both accept and reject
      const result = await approveExtendRequest({
        invoiceID: invoice.id,
        action: action, // "accept" or "reject"
      }).unwrap();

      console.log("Extend request API response:", result);

      if (action === "accept") {
        setMessage({
          type: "success",
          text: "Extend request approved successfully!",
        });

        // Close modal and clear message after success
        setTimeout(() => {
          setMessage({ type: "", text: "" });
          setIsAcceptExtendModalOpen(false);
          setSelectedExtendInvoice(null);
        }, 2000);
      } else {
        setMessage({
          type: "info",
          text: "Extend request rejected.",
        });

        // Close modal and clear message after reject
        setTimeout(() => {
          setMessage({ type: "", text: "" });
          setIsAcceptExtendModalOpen(false);
          setSelectedExtendInvoice(null);
        }, 1000);
      }
    } catch (error) {
      console.log("Extend request error:", error);
      setMessage({
        type: "error",
        text:
          error?.data?.message ||
          "Failed to submit extend request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayNow = async (invoice) => {
    if (!invoice) return;

    console.log("Starting payment process for invoice:", invoice.id);

    try {
      const result = await acceptRespondInvoice({
        invoiceID: invoice.id,
      }).unwrap();

      console.log("Payment API response:", result);

      if (result?.success && result?.data?.url) {
        console.log("Payment successful, showing toast");
        showToast.success("Redirecting to payment...", {
          description: "Please complete your payment in the new tab",
        });

        // Open Stripe checkout in new tab
        window.open(result.data.url, "_blank");
      } else {
        console.log("Payment failed - no success or URL");
        showToast.error("Failed to process payment", {
          description: "Please try again later",
        });
      }
    } catch (error) {
      console.log("Payment error:", error);

      // Handle specific error messages from API
      let errorMessage = "Payment failed";
      let errorDescription = "Please try again later";

      if (error?.data?.message) {
        errorDescription = error.data.message;
      } else if (error?.data?.errorSources?.[0]?.message) {
        errorDescription = error.data.errorSources[0].message;
      }

      showToast.error(errorMessage, {
        description: errorDescription,
      });
    }
  };

  // Fetch data based on user role
  const {
    data: freelancerData,
    isLoading: freelancerLoading,
    error: freelancerError,
  } = useGetInvoiceFreelancerQuery(undefined, {
    skip: userType !== "freelancer",
  });

  const {
    data: clientData,
    isLoading: clientLoading,
    error: clientError,
  } = useGetInvoiceClientQuery(undefined, {
    skip: userType !== "client",
  });

  // Determine which data to use
  const apiData = userType === "freelancer" ? freelancerData : clientData;
  const isLoading =
    userType === "freelancer" ? freelancerLoading : clientLoading;
  const error = userType === "freelancer" ? freelancerError : clientError;

  // Transform API data to component format
  const transformedInvoices = useMemo(() => {
    if (!apiData?.data) return [];

    return apiData.data.map((invoice, index) => ({
      id: invoice._id || index,
      client: userType === "freelancer" ? "Client" : "Freelancer",
      amount: `$${invoice.amount}`,
      status:
        invoice.status === "pending"
          ? "Pending"
          : invoice.status === "accepted"
          ? "Accepted"
          : invoice.status === "delivered"
          ? "Delivered"
          : invoice.status === "declined"
          ? "Declined"
          : invoice.status === "completed"
          ? "Completed"
          : "Pending",
      statusColor:
        invoice.status === "pending"
          ? "bg-yellow-600"
          : invoice.status === "accepted"
          ? "bg-blue-600"
          : invoice.status === "delivered"
          ? "bg-green-600"
          : invoice.status === "declined"
          ? "bg-red-600"
          : invoice.status === "completed"
          ? "bg-purple-600"
          : "bg-yellow-600",
      paymentStatus: invoice.paymentStatus,
      serviceType: invoice.serviceType,
      invoiceType: invoice.invoiceType,
      date: new Date(invoice.date).toLocaleDateString(),
      deliveryFiles: invoice.deliveryFiles,
      deliveryMessage: invoice.deliveryMessage,
      extendDate: invoice.extendDate,
      tenderId: invoice.tenderId,
      freelancerUserId: invoice.freelancerUserId,
      clientUserId: invoice.clientUserId,
    }));
  }, [apiData, userType]);

  if (isLoading) {
    return (
      <div className="w-full bg-white py-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-6 2xl:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-6 2xl:px-0">
        <div className="text-center">
          <p className="text-red-600">
            Error loading invoices: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:mb-6 gap-4">
          <div
            className={`w-full  ${
              userType === "freelancer"
                ? "flex flex-col items-start"
                : "flex flex-col items-center"
            }`}
          >
            <h1
              className={`text-2xl md:text-3xl font-bold h2-gradient-text mb-2 ${
                userType === "freelancer" ? "text-left" : "text-center"
              }`}
            >
              {invoiceTranslations.title}
            </h1>
            <p
              className={`text-gray-600 max-w-2xl text-sm md:text-base ${
                userType === "freelancer" ? "text-left" : "text-center"
              }`}
            >
              {invoiceTranslations.subtitle}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={invoiceTranslations.search}
              className="pl-10 border-gray-300"
            />
          </div>

          <Select defaultValue="all-invoice">
            <SelectTrigger className="w-full md:w-48 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-invoice">
                {invoiceTranslations.invoiceFilter.all}
              </SelectItem>
              <SelectItem value="paid">
                {invoiceTranslations.invoiceFilter.paid}
              </SelectItem>
              <SelectItem value="pending">
                {invoiceTranslations.invoiceFilter.pending}
              </SelectItem>
              <SelectItem value="overdue">
                {invoiceTranslations.invoiceFilter.overdue}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoices List */}
        <div className="space-y-4 md:space-y-6">
          {transformedInvoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No invoices found</p>
            </div>
          ) : (
            transformedInvoices.map((invoice, index) => (
              <Card
                key={index}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 md:p-6">
                  {/* Mobile: Stacked Layout */}
                  <div className="md:hidden space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold h2-gradient-text">
                        Invoice #{invoice.id}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-gray-700 gradient px-3 py-1"
                      >
                        {invoice.status}
                      </Badge>
                    </div>

                    {/* Client Info */}
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Client:</span>{" "}
                        {invoice.client}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span>{" "}
                        {invoice.amount}
                      </p>
                      <p>
                        <span className="font-medium">Service:</span>{" "}
                        {invoice.serviceType}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {invoice.date}
                      </p>
                      {userType === "freelancer" && (
                        <p>
                          <span className="font-medium">Payment Status:</span>{" "}
                          <span
                            className={`capitalize ${
                              invoice.paymentStatus === "pending"
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {invoice.paymentStatus}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Action Buttons - Stacked */}
                    <div className="space-y-2">
                      <Button
                        className="button-gradient w-full"
                        onClick={() => setIsViewInvoiceDetailsDialogOpen(true)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {invoiceTranslations.viewDetails}
                      </Button>

                      {/* Freelancer: Extend Delivery Date */}
                      {userType === "freelancer" && (
                        <Button
                          className="button-gradient w-full"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsExtendDeliveryDialogOpen(true);
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {invoiceTranslations.extendDeliveryDate}
                        </Button>
                      )}

                      {/* Client: Accept Extend Request (only when extendDate exists) */}
                      {userType === "client" && invoice.extendDate && (
                        <Button
                          className="button-gradient w-full"
                          onClick={() => handleOpenAcceptExtendModal(invoice)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Accept Extend Request
                        </Button>
                      )}
                      {/* Freelancer: Delivery Now */}
                      {userType === "freelancer" &&
                        invoice.status !== "delivered" && (
                          <Button
                            className="button-gradient w-full"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsProjectCompleteDialogOpen(true);
                            }}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            {invoiceTranslations.deliveryNow}
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Desktop: Original Layout */}
                  <div className="hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      {/* Invoice Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold h2-gradient-text mb-3">
                          Invoice #{invoice.id}
                        </h3>
                      </div>
                      <div className="flex-1 h-9 ">
                        <Badge
                          variant="outline"
                          className=" text-gray-700 gradient px-4 py-1 h-9"
                        >
                          {invoice.status}
                        </Badge>
                      </div>

                      {/* Status and Main Actions */}
                      <div className="flex items-center gap-4">
                        <Button
                          className="button-gradient"
                          onClick={() =>
                            setIsViewInvoiceDetailsDialogOpen(true)
                          }
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {invoiceTranslations.viewDetails}
                        </Button>
                        {userType === "client" && (
                          <Button
                            className="button-gradient"
                            onClick={() => {
                              handlePayNow(invoice);
                            }}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            {invoiceTranslations.payNow}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Client Info and Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Client:</span>{" "}
                          {invoice.client}
                        </p>
                        <p>
                          <span className="font-medium">Amount:</span>{" "}
                          {invoice.amount}
                        </p>
                        <p>
                          <span className="font-medium">Service:</span>{" "}
                          {invoice.serviceType}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {invoice.date}
                        </p>
                        {userType === "freelancer" && (
                          <p>
                            <span className="font-medium">Payment Status:</span>{" "}
                            <span
                              className={`capitalize ${
                                invoice.paymentStatus === "pending"
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {invoice.paymentStatus}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Freelancer: Extend Delivery Date and Delivery Now */}
                      {userType === "freelancer" && (
                        <div className="flex items-center gap-3">
                          <Button
                            className="button-gradient"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsExtendDeliveryDialogOpen(true);
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {invoiceTranslations.extendDeliveryDate}
                          </Button>
                          {console.log("invoice.status", invoice.status)}

                          {invoice.status === "Delivered" ? (
                            <>
                              <Button
                                className="button-gradient disabled cursor-not-allowed"
                                disabled
                              >
                                <Truck className="w-4 h-4 mr-2 " />
                                Delivered
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                className="button-gradient"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setIsProjectCompleteDialogOpen(true);
                                }}
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                {invoiceTranslations.deliveryNow}
                              </Button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Client: Accept Extend Request (only when extendDate exists) */}
                      {userType === "client" && invoice.extendDate && (
                        <div className="flex items-center gap-3">
                          <Button
                            className="button-gradient"
                            onClick={() => handleOpenAcceptExtendModal(invoice)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Accept Extend Request
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Invoices Dialog */}
        {isCreateInvoicesDialogOpen && (
          <CreateInvoicesDialog
            isOpen={isCreateInvoicesDialogOpen}
            onClose={() => setIsCreateInvoicesDialogOpen(false)}
          />
        )}

        {/* View Invoice Details Dialog */}
        {isViewInvoiceDetailsDialogOpen && (
          <ViewInvoiceDetailsDialog
            isOpen={isViewInvoiceDetailsDialogOpen}
            onClose={() => setIsViewInvoiceDetailsDialogOpen(false)}
          />
        )}

        {/* Project Complete Dialog */}
        {isProjectCompleteDialogOpen && (
          <ProjectCompleteDialog
            isOpen={isProjectCompleteDialogOpen}
            onClose={() => setIsProjectCompleteDialogOpen(false)}
            invoiceId={selectedInvoice?.id}
          />
        )}

        {/* Extend Delivery Dialog */}
        {isExtendDeliveryDialogOpen && (
          <ExtendDeliveryDialog
            isOpen={isExtendDeliveryDialogOpen}
            onClose={() => setIsExtendDeliveryDialogOpen(false)}
            invoiceId={selectedInvoice?.id}
          />
        )}

        {/* Accept Extend Request Modal */}
        <Dialog
          open={isAcceptExtendModalOpen}
          onOpenChange={setIsAcceptExtendModalOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Extend Delivery Request</DialogTitle>
            </DialogHeader>

            {selectedExtendInvoice && (
              <div className="space-y-4">
                {/* Success/Error Message */}
                {message.text && (
                  <div
                    className={`p-3 rounded-md ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : message.type === "error"
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Show Extend Date and Reason from invoice data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extend Date
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedExtendInvoice.extendDate
                      ? new Date(
                          selectedExtendInvoice.extendDate
                        ).toLocaleDateString()
                      : "No date specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedExtendInvoice.deliveryMessage ||
                      "Freelancer has requested an extension to complete the project."}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() =>
                      handleExtendRequestSubmit("reject", selectedExtendInvoice)
                    }
                    disabled={isSubmitting}
                  >
                    Reject
                  </Button>
                  <Button
                    className="flex-1 button-gradient"
                    onClick={() =>
                      handleExtendRequestSubmit("accept", selectedExtendInvoice)
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Accept"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Dynamic import with no SSR (simplified)
const InvoicesDynamic = dynamic(() => Promise.resolve(InvoicesContent), {
  ssr: false,
});

function Invoices() {
  return <InvoicesDynamic />;
}

export default Invoices;
