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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Loader2,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  MessageSquare,
  FileImage,
  ExternalLink,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  useGetMyProjectFreelancerQuery,
  useGetMyProjectClientQuery,
} from "@/features/myProject/myProjectApi";
import { useState, useMemo } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

// Define translations locally
const translations = {
  title: "Ongoing Projects",
  subtitle:
    "Stay on top of your work and ensure smooth collaboration until project completion!",
  search: "Search",
  filter: {
    all: "All Projects",
    inProgress: "In Progress",
    completed: "Completed",
    pending: "Pending",
    delivered: "Delivered",
  },
  projectDetails: {
    client: "Client",
    deadline: "Deadline",
    amount: "Amount",
    status: "Status",
    viewDetails: "View Details",
  },
  statuses: {
    inProgress: "In Progress",
    completed: "Completed",
  },
};

// Main component content
const OngoingProjectsContent = () => {
  const currentUser = localStorage.getItem("role");
  const userType = currentUser;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening project details modal
  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Helper function to get file type
  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    return extension;
  };

  // Helper function to check if file is an image
  const isImageFile = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const extension = getFileType(filename);
    return imageExtensions.includes(extension);
  };

  // Handle file click - open in new tab
  const handleFileClick = (file) => {
    // Assuming the file path needs to be constructed with your base URL
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const fileUrl = `${baseURL}/${file}`;
    window.open(fileUrl, "_blank");
  };

  // Fetch data based on user role
  const {
    data: freelancerData,
    isLoading: freelancerLoading,
    error: freelancerError,
  } = useGetMyProjectFreelancerQuery(undefined, {
    skip: userType !== "freelancer",
  });

  const {
    data: clientData,
    isLoading: clientLoading,
    error: clientError,
  } = useGetMyProjectClientQuery(undefined, {
    skip: userType !== "client",
  });

  // Determine which data to use
  const apiData = userType === "freelancer" ? freelancerData : clientData;
  const isLoading =
    userType === "freelancer" ? freelancerLoading : clientLoading;
  const error = userType === "freelancer" ? freelancerError : clientError;

  // Transform API data to component format
  const transformedProjects = useMemo(() => {
    if (!apiData?.data) return [];

    return apiData.data.map((project, index) => {
      // Map API status to display status
      let displayStatus;
      let statusColor;

      switch (project.status) {
        case "delivered":
          displayStatus = "Delivered";
          statusColor = "bg-green-600";
          break;
        case "in_progress":
          displayStatus = "In Progress";
          statusColor = "bg-blue-600";
          break;
        case "pending":
          displayStatus = "Pending";
          statusColor = "bg-yellow-600";
          break;
        case "completed":
          displayStatus = "Completed";
          statusColor = "bg-green-600";
          break;
        default:
          displayStatus = "In Progress";
          statusColor = "bg-blue-600";
      }

      return {
        id: project._id || index,
        title: `${project.serviceType} - ${project.invoiceType}`,
        client: userType === "freelancer" ? "Client" : "Freelancer", // You might want to fetch actual names
        deadline: new Date(project.date).toLocaleDateString(),
        amount: `$${project.amount}`,
        status: displayStatus,
        statusColor: statusColor,
        paymentStatus: project.paymentStatus,
        deliveryFiles: project.deliveryFiles,
        deliveryMessage: project.deliveryMessage,
        extendDate: project.extendDate,
        tenderId: project.tenderId,
        originalStatus: project.status, // Keep original status for filtering
      };
    });
  }, [apiData, userType]);

  // Filter projects based on search and status
  const filteredProjects = useMemo(() => {
    let filtered = transformedProjects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => {
        switch (statusFilter) {
          case "in-progress":
            return (
              project.originalStatus === "in_progress" ||
              project.status === "In Progress"
            );
          case "completed":
            return (
              project.originalStatus === "completed" ||
              project.status === "Completed"
            );
          case "pending":
            return project.paymentStatus === "pending";
          case "delivered":
            return (
              project.originalStatus === "delivered" ||
              project.status === "Delivered"
            );
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [transformedProjects, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="w-full bg-white py-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-6 2xl:px-0">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-6 2xl:px-0">
        <div className="text-center">
          <p className="text-red-600">
            Error loading projects: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-6 2xl:px-0">
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold h2-gradient-text mb-2 leading-relaxed">
            {translations.title}
          </h1>
          <p className="text-gray-600">{translations.subtitle}</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full md:max-w-md ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={translations.search}
              className="pl-10 border-gray-300 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translations.filter.all}</SelectItem>
              <SelectItem value="in-progress">
                {translations.filter.inProgress}
              </SelectItem>
              <SelectItem value="completed">
                {translations.filter.completed}
              </SelectItem>
              <SelectItem value="pending">
                {translations.filter.pending}
              </SelectItem>
              <SelectItem value="delivered">
                {translations.filter.delivered}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    {/* Project Info */}
                    <div className="flex-1 ">
                      <h3 className="text-xl font-semibold h2-gradient-text mb-3">
                        {project.title}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-700">
                        {/* <p>
                          <span className="font-medium">
                            {translations.projectDetails.client}:
                          </span>{" "}
                          {project.client}
                        </p> */}
                        <p>
                          <span className="font-medium">
                            {translations.projectDetails.deadline}:
                          </span>{" "}
                          {project.deadline}
                        </p>
                        <p>
                          <span className="font-medium">
                            {translations.projectDetails.amount}:
                          </span>{" "}
                          {project.amount}
                        </p>
                        {userType === "freelancer" && (
                          <p>
                            <span className="font-medium">Payment Status:</span>{" "}
                            <span
                              className={`capitalize ${
                                project.paymentStatus === "pending"
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {project.paymentStatus}
                            </span>
                          </p>
                        )}
                        {project.deliveryMessage && (
                          <p>
                            <span className="font-medium">
                              Delivery Message:
                            </span>{" "}
                            {project.deliveryMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 ">
                      <Badge
                        className={`${project.statusColor} text-white hover:${project.statusColor} h-9 px-4 py-1 gradient`}
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-4 ">
                      <Button
                        className="button-gradient"
                        onClick={() => handleViewDetails(project)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {translations.projectDetails.viewDetails}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Project Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xl md:max-w-2xl lg:min-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold h2-gradient-text">
                Project Details
              </DialogTitle>
              <DialogDescription>
                Complete information about this project
              </DialogDescription>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-6">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {selectedProject.title}
                    </h3>
                    <Badge
                      className={`${selectedProject.statusColor} text-white`}
                    >
                      {selectedProject.status}
                    </Badge>
                  </div>
                </div>

                {/* Project Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium">Client:</span>
                          <span className="ml-2">{selectedProject.client}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium">Deadline:</span>
                          <span className="ml-2">
                            {selectedProject.deadline}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium">Amount:</span>
                          <span className="ml-2">{selectedProject.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium">Payment Status:</span>
                          <span
                            className={`ml-2 capitalize ${
                              selectedProject.paymentStatus === "pending"
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {selectedProject.paymentStatus}
                          </span>
                        </div>
                      </div>
                      {selectedProject.extendDate && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="font-medium">Extended Date:</span>
                            <span className="ml-2">
                              {new Date(
                                selectedProject.extendDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                {selectedProject.deliveryMessage && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Delivery Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {selectedProject.deliveryMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Delivery Files */}
                {selectedProject.deliveryFiles &&
                  selectedProject.deliveryFiles.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <FileImage className="w-5 h-5" />
                        Delivery Files
                      </h4>
                      <div className="space-y-4">
                        {/* Images Section - Horizontal Scrollable */}
                        {selectedProject.deliveryFiles.filter((file) =>
                          isImageFile(file)
                        ).length > 0 && (
                          <div>
                            <h5 className="font-medium text-md mb-3 flex items-center gap-2">
                              <FileImage className="w-4 h-4" />
                              Images (
                              {
                                selectedProject.deliveryFiles.filter((file) =>
                                  isImageFile(file)
                                ).length
                              }
                              )
                            </h5>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                              {selectedProject.deliveryFiles
                                .filter((file) => isImageFile(file))
                                .map((file, index) => (
                                  <div
                                    key={`image-${index}`}
                                    className="flex-shrink-0 space-y-2"
                                  >
                                    <div className="w-64 h-48 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                      <Image
                                        src={getImageUrl(file)}
                                        alt={`Delivery image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        width={256}
                                        height={192}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FileImage className="w-4 h-4" />
                                      <span className="truncate max-w-48">
                                        {file.split("/").pop()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Other Files Section */}
                        {selectedProject.deliveryFiles.filter(
                          (file) => !isImageFile(file)
                        ).length > 0 && (
                          <div>
                            <h5 className="font-medium text-md mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Documents (
                              {
                                selectedProject.deliveryFiles.filter(
                                  (file) => !isImageFile(file)
                                ).length
                              }
                              )
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedProject.deliveryFiles
                                .filter((file) => !isImageFile(file))
                                .map((file, index) => {
                                  const fileType = getFileType(file);
                                  return (
                                    <div
                                      key={`file-${index}`}
                                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                      onClick={() => handleFileClick(file)}
                                    >
                                      <div className="flex-shrink-0">
                                        {fileType === "pdf" ? (
                                          <FileText className="w-5 h-5 text-red-500" />
                                        ) : fileType === "doc" ||
                                          fileType === "docx" ? (
                                          <FileText className="w-5 h-5 text-blue-500" />
                                        ) : (
                                          <FileImage className="w-5 h-5 text-gray-500" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {file.split("/").pop()}
                                        </p>
                                        <p className="text-xs text-gray-500 uppercase">
                                          {fileType} file
                                        </p>
                                      </div>
                                      <div className="flex-shrink-0">
                                        <div className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                                          <ExternalLink className="w-3 h-3" />
                                          <span>Click to open</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Project ID:</span>
                      <span className="ml-2 text-gray-600">
                        {selectedProject.id}
                      </span>
                    </div>
                    {selectedProject.tenderId && (
                      <div>
                        <span className="font-medium">Tender ID:</span>
                        <span className="ml-2 text-gray-600">
                          {selectedProject.tenderId}
                        </span>
                      </div>
                    )}
                  </div>
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
const OngoingProjectsDynamic = dynamic(
  () => Promise.resolve(OngoingProjectsContent),
  { ssr: false }
);

function OngoingProjects() {
  return <OngoingProjectsDynamic />;
}

export default OngoingProjects;
