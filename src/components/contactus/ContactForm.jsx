// components/ContactForm.js
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useCreateContactMutation } from '../../features/contact/contactApi';
import { Label } from "../ui/label";

function ContactForm() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: ""
  });

  const messages = "EN";
  const contactFormTranslations = messages?.contactUs?.form || {};

  const [createContact, { isLoading, isSuccess, isError, error }] = useCreateContactMutation();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createContact(formData).unwrap();
      // Reset form on success
      if (isSuccess) {
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          message: ""
        });
      }

      console.log("response", response)

      toast.success(response?.message || 'Message sent successfully!');
    } catch (err) {
      console.error('Failed to send message:', err);

      console.log("Error ", err);
      toast.error(err?.message || 'Failed to send message. Please try again.');
    }
  };

  // Only render on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state on server, content on client
  if (!isClient) {
    return (
      <div className="max-w-7xl mx-auto my-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section Skeleton */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Name Fields Row Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-16 bg-gray-300 rounded-xl"></div>
                <div className="h-16 bg-gray-300 rounded-xl"></div>
              </div>

              {/* Email and Phone Row Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-16 bg-gray-300 rounded-xl"></div>
                <div className="h-16 bg-gray-300 rounded-xl"></div>
              </div>

              {/* Message Field Skeleton */}
              <div className="h-40 bg-gray-300 rounded-xl"></div>

              {/* Submit Button Skeleton */}
              <div className="flex justify-center">
                <div className="h-12 bg-gray-300 rounded-xl w-48"></div>
              </div>
            </div>
          </div>

          {/* Contact Details Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="h-80 bg-gray-300 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blue-200 rounded-xl flex flex-col items-start p-2 px-3">
                <Label className="p-0 text-xs">
                  {contactFormTranslations.firstName?.label || "First Name*"}
                </Label>
                <Input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={
                    contactFormTranslations.firstName?.placeholder ||
                    "First Name*"
                  }
                  required
                  className="h-6 p-0 border-none shadow-none focus:border-none"
                />
              </div>
              <div className="border border-blue-200 rounded-xl flex flex-col items-start p-2">
                <Label className="p-0 text-xs">
                  {contactFormTranslations.lastName?.label || "Last Name*"}
                </Label>
                <Input
                  type="text"
                  placeholder={
                    contactFormTranslations.lastName?.placeholder ||
                    "Last Name*"
                  }
                  className=" p-0 border-none shadow-none focus:border-none "
                />
              </div>
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blue-200 rounded-xl flex flex-col items-start p-2">
                <Label className="p-0 text-xs">
                  {contactFormTranslations.email?.label || "Email*"}
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    contactFormTranslations.email?.placeholder || "Email*"
                  }
                  required
                  className="p-0 border-none shadow-none focus:border-none"
                />
              </div>
              <div className="border border-blue-200 rounded-xl flex flex-col items-start p-2">
                <Label className="p-0 text-xs">
                  {contactFormTranslations.phone?.label || "Phone*"}
                </Label>
                <Input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={
                    contactFormTranslations.phone?.placeholder || "Phone"
                  }
                  required
                  className="p-0 border-none shadow-none focus:border-none"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={
                  contactFormTranslations.message?.placeholder || "Message"
                }
                rows={10}
                required
                className="border-blue-200 rounded-xl focus:border-blue-400 focus:ring-blue-400 h-40 resize-none"
              />
            </div>



            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="button-gradient text-white px-12 py-3 h-12 rounded-xl font-medium text-base min-w-60 md:w-auto"
              >
                {isLoading ? "Sending..." : (contactFormTranslations.submit || "Send Message")}
              </Button>
            </div>
          </form>
        </div>

        {/* Contact Details Card */}
        <div className="lg:col-span-1">
          <Card className="border-blue-200 rounded-2xl shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {contactFormTranslations.contactDetails?.title ||
                  "Contact details"}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {contactFormTranslations.contactDetails?.description ||
                  "Likewise, a range of activities enriches life, blending vigor with balance. The result is a lifestyle that's not only dynamic but also deeply rewarding."}
              </p>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {contactFormTranslations.contactDetails?.address?.title ||
                        "Address"}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {contactFormTranslations.contactDetails?.address?.text ||
                        "123 Queensberry Street, North Melbourne VIC3051, Australia."}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {contactFormTranslations.contactDetails?.email?.title ||
                        "Email"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {contactFormTranslations.contactDetails?.email?.text ||
                        "ali@boxcars.com"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;