"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

// Define translations locally
const dialogTranslations = {
  title: "Invoice Details",
  invoiceId: "Invoice ID",
  clientName: "Client/Freelancer",
  serviceType: "Service Type",
  projectType: "Project Type",
  tenderId: "Tender ID",
  freelancerUserId: "Freelancer ID",
  clientUserId: "Client ID",
  date: "Date",
  createdAt: "Created",
  updatedAt: "Updated",
  totalAmount: "Total Amount",
  status: "Status",
  paymentStatus: "Payment Status",
  message: "Message",
  deliveryMessage: "Delivery Message",
  uploadDocuments: "Upload Documents",
  deliveryFiles: "Delivery Files",
  extendDate: "Extended Date",
  doneButton: "Done",
};

export default function ViewInvoiceDetailsDialog({
  isOpen,
  onClose,
  invoiceData = null,
}) {
  // Use provided invoice data or fall back to default
  const invoice = invoiceData || {
    client: "No client info",
    serviceType: "No service type",
    amount: "$0",
    status: "Pending",
    paymentStatus: "pending",
    invoiceType: "unknown",
    date: "No date",
    message: "No message",
    deliveryMessage: "No delivery message",
  };

  const handleDone = () => {
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b-0">
          <DialogTitle className="text-lg font-semibold text-blue-600 h2-gradient-text">
            {dialogTranslations.title}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Invoice Details Card */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 relative">
            <h3 className="text-lg font-semibold mb-4 h2-gradient-text">
              {dialogTranslations.title}
            </h3>

            <div className="space-y-3">
              {/* Invoice ID */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.invoiceId}:
                </span>
                <span className="text-gray-700 ml-2">{invoice.id}</span>
              </div>

              {/* Client/Freelancer */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.clientName}:
                </span>
                <span className="text-gray-700 ml-2">{invoice.client}</span>
              </div>

              {/* Service Type */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.serviceType}:
                </span>
                <span className="text-gray-700 ml-2">
                  {invoice.serviceType || "N/A"}
                </span>
              </div>

              {/* Project Type */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.projectType}:
                </span>
                <span className="text-gray-700 ml-2">
                  {invoice.invoiceType || "N/A"}
                </span>
              </div>

              {/* Tender ID (if available) */}
              {invoice.tenderId && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.tenderId}:
                  </span>
                  <span className="text-gray-700 ml-2">{invoice.tenderId}</span>
                </div>
              )}

              {/* Freelancer User ID */}
              {invoice.freelancerUserId && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.freelancerUserId}:
                  </span>
                  <span className="text-gray-700 ml-2">
                    {invoice.freelancerUserId}
                  </span>
                </div>
              )}

              {/* Client User ID */}
              {invoice.clientUserId && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.clientUserId}:
                  </span>
                  <span className="text-gray-700 ml-2">
                    {invoice.clientUserId}
                  </span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.date}:
                </span>
                <span className="text-gray-700 ml-2">{invoice.date}</span>
              </div>

              {/* Created At */}
              {invoice.createdAt && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.createdAt}:
                  </span>
                  <span className="text-gray-700 ml-2">
                    {new Date(invoice.createdAt).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Updated At */}
              {invoice.updatedAt && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.updatedAt}:
                  </span>
                  <span className="text-gray-700 ml-2">
                    {new Date(invoice.updatedAt).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.totalAmount}:
                </span>
                <span className="text-gray-700 ml-2 font-semibold">
                  ${invoice.amount}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.status}:
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded-md text-sm font-medium ${
                    invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : invoice.status === "accepted"
                      ? "bg-blue-100 text-blue-800"
                      : invoice.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "declined"
                      ? "bg-red-100 text-red-800"
                      : invoice.status === "completed"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {invoice.status
                    ? invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)
                    : "Unknown"}
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-[140px]">
                  {dialogTranslations.paymentStatus}:
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded-md text-sm font-medium ${
                    invoice.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {invoice.paymentStatus
                    ? invoice.paymentStatus.charAt(0).toUpperCase() +
                      invoice.paymentStatus.slice(1)
                    : "Unknown"}
                </span>
              </div>

              {/* Extended Date (if available) */}
              {invoice.extendDate && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.extendDate}:
                  </span>
                  <span className="text-gray-700 ml-2">
                    {new Date(invoice.extendDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Message (if available) */}
              {invoice.message && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.message}:
                  </span>
                  <span className="text-gray-700 ml-2">{invoice.message}</span>
                </div>
              )}

              {/* Delivery Message (if available) */}
              {invoice.deliveryMessage && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.deliveryMessage}:
                  </span>
                  <span className="text-gray-700 ml-2">
                    {invoice.deliveryMessage}
                  </span>
                </div>
              )}

              {/* Upload Documents (if available) */}
              {invoice.uploadDocuments &&
                invoice.uploadDocuments.length > 0 && (
                  <div className="flex items-start">
                    <span className="font-medium text-gray-900 min-w-[140px]">
                      {dialogTranslations.uploadDocuments}:
                    </span>
                    <div className="ml-2">
                      {invoice.uploadDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {doc.split("\\").pop()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Delivery Files (if available) */}
              {invoice.deliveryFiles && invoice.deliveryFiles.length > 0 && (
                <div className="flex items-start">
                  <span className="font-medium text-gray-900 min-w-[140px]">
                    {dialogTranslations.deliveryFiles}:
                  </span>
                  <div className="ml-2">
                    {invoice.deliveryFiles.map((file, index) => (
                      <div
                        key={index}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {file.split("\\").pop()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logo */}
            <div className="absolute top-5 right-5">
              <Image
                src={"/jobtender/job_tender.png"}
                alt="Invoice Logo"
                width={160}
                height={160}
                className="w-20 h-20 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            onClick={handleDone}
            className="px-8 button-gradient py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {dialogTranslations.doneButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
