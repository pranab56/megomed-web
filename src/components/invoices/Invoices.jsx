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
  Calendar,
  CreditCard,
  FileText,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateInvoicesDialog from "./CreateInvoicesDialog";
import ExtendDeliveryDialog from "./EntendDeliveryDialog";
import ProjectCompleteDialog from "./ProjectCompleteDialog";
import ViewInvoiceDetailsDialog from "./ViewInvoiceDetailsDialog";

// Define translations locally
const invoiceTranslations = {
  title: "Invoices",
  subtitle: "With our simple invoicing system, managing payments is quick and easy for both freelancers and clients. Never miss a payment or detail again!",
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

const invoices = [
  {
    id: "12345",
    client: "XYZ Corp",
    amount: "$500",
    status: "Pending",
  },
  {
    id: "12345",
    client: "XYZ Corp",
    amount: "$500",
    status: "Pending",
  },
];

// Define user type - you can set this based on your authentication logic
// Options: "freelancer" or "client"
const userType = "freelancer"; // Change this based on your auth system

// Main component content
const InvoicesContent = () => {
  const router = useRouter();

  const [isCreateInvoicesDialogOpen, setIsCreateInvoicesDialogOpen] =
    useState(false);
  const [isViewInvoiceDetailsDialogOpen, setIsViewInvoiceDetailsDialogOpen] =
    useState(false);
  const [isProjectCompleteDialogOpen, setIsProjectCompleteDialogOpen] =
    useState(false);
  const [isExtendDeliveryDialogOpen, setIsExtendDeliveryDialogOpen] =
    useState(false);

  return (
    <div className="w-full bg-white py-4 md:py-6 max-w-7xl mx-auto px-4 md:px-6 2xl:px-0">
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:mb-6 gap-4">
          <div
            className={`w-full  ${userType === "freelancer"
                ? "flex flex-col items-start"
                : "flex flex-col items-center"
              }`}
          >
            <h1
              className={`text-2xl md:text-3xl font-bold h2-gradient-text mb-2 ${userType === "freelancer" ? "text-left" : "text-center"
                }`}
            >
              {invoiceTranslations.title}
            </h1>
            <p
              className={`text-gray-600 max-w-2xl text-sm md:text-base ${userType === "freelancer" ? "text-left" : "text-center"
                }`}
            >
              {invoiceTranslations.subtitle}
            </p>
          </div>

          {userType === "freelancer" && (
            <Button
              className="button-gradient cursor-pointer w-full md:w-auto"
              onClick={() => setIsCreateInvoicesDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {invoiceTranslations.createNewInvoice}
            </Button>
          )}
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
          {invoices.map((invoice, index) => (
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
                  </div>

                  {/* Action Buttons - Stacked */}
                  <div className="space-y-2">
                    <Button
                      className="button-gradient w-full"
                      onClick={() =>
                        setIsViewInvoiceDetailsDialogOpen(true)
                      }
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {invoiceTranslations.viewDetails}
                    </Button>

                    <Button
                      className="button-gradient w-full"
                      onClick={() => setIsExtendDeliveryDialogOpen(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {invoiceTranslations.extendDeliveryDate}
                    </Button>

                    <Button
                      className="button-gradient w-full"
                      onClick={() => setIsProjectCompleteDialogOpen(true)}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      {invoiceTranslations.deliveryNow}
                    </Button>
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
                            router.push("/payment");
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
                    </div>

                    {userType === "freelancer" && (
                      <div className="flex items-center gap-3">
                        <Button
                          className="button-gradient"
                          onClick={() =>
                            setIsExtendDeliveryDialogOpen(true)
                          }
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {invoiceTranslations.extendDeliveryDate}
                        </Button>

                        <Button
                          className="button-gradient"
                          onClick={() =>
                            setIsProjectCompleteDialogOpen(true)
                          }
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          {invoiceTranslations.deliveryNow}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
          />
        )}

        {/* Extend Delivery Dialog */}
        {isExtendDeliveryDialogOpen && (
          <ExtendDeliveryDialog
            isOpen={isExtendDeliveryDialogOpen}
            onClose={() => setIsExtendDeliveryDialogOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

// Dynamic import with no SSR (simplified)
const InvoicesDynamic = dynamic(
  () => Promise.resolve(InvoicesContent),
  { ssr: false }
);

function Invoices() {
  return <InvoicesDynamic />;
}

export default Invoices;