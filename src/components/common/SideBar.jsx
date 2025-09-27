"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetAllCategoryQuery } from '../../features/category/categoryApi';
import { useGetAllServicesQuery } from '../../features/services/servicesApi';

function SideBar({
  selectedServices,
  setSelectedServices,
  selectedCategories,
  setSelectedCategories
}) {
  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useGetAllCategoryQuery();
  const { data: serviceData, isLoading: serviceLoading, isError: serviceError } = useGetAllServicesQuery();

  // Handlers that use the lifted-up state setters
  const handleServiceChange = (service, checked) => {
    if (checked) {
      setSelectedServices(prev => [...prev, service]);
    } else {
      setSelectedServices(prev => prev.filter((s) => s !== service));
    }
  };

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter((c) => c !== category));
    }
  };

  // Show loading states
  if (categoryLoading || serviceLoading) {
    return (
      <div className="w-64 bg-white space-y-8 hidden lg:block">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Service Type</h2>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Category Type</h2>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error states
  if (categoryError || serviceError) {
    return (
      <div className="w-64 bg-white space-y-8 hidden lg:block p-4">
        <div className="text-red-500 text-sm">
          Error loading filter options. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white space-y-8 hidden lg:block">
      {/* Service Type Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Service Type</h2>
        <div className="space-y-3">
          {serviceData?.data?.map((service, index) => (
            <div key={service._id} className="flex items-center space-x-3">
              <Checkbox
                id={`service-${service._id}`}
                checked={selectedServices?.includes(service.name)}
                onCheckedChange={(checked) =>
                  handleServiceChange(service.name, checked)
                }
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label
                htmlFor={`service-${service._id}`}
                className="text-sm font-medium text-gray-700 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {service.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Category Type Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Category Type</h2>
        <div className="space-y-3">
          {categoryData?.data?.map((category, index) => (
            <div key={category._id} className="flex items-center space-x-3">
              <Checkbox
                id={`category-${category._id}`}
                checked={selectedCategories?.includes(category.name)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.name, checked)
                }
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label
                htmlFor={`category-${category._id}`}
                className="text-sm font-medium text-gray-700 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Optional: Selected Items Summary */}
      {(selectedServices?.length > 0 || selectedCategories?.length > 0) && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Selected Filters
          </h3>
          <div className="space-y-2">
            {selectedServices.map((service, index) => (
              <div
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2 mb-2"
              >
                {service}
              </div>
            ))}
            {selectedCategories.map((category, index) => (
              <div
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mr-2 mb-2"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;