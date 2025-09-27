"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* About Us Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 2xl:px-0 py-4 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              About Us - Lunq
            </h1>
            <p className="text-gray-600 leading-relaxed">
              At Lunq, we connect businesses with top freelance talent across various industries. Our platform ensures a seamless experience for both clients and freelancers, addressing their specific needs. Whether you're a startup or an enterprise, Lunq helps you achieve success with featured performance solutions.
            </p>
            <Button className="button-gradient text-white px-6 py-2 rounded-md">
              Hire Freelancers →
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative w-full">
            <Image
              src="/aboutus/about_us_1.png"
              width={700}
              height={400}
              alt="Professional man in suit"
              className="object-cover rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-8 sm:py-12 lg:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              {/* Left Content */}
              <div className="w-full lg:w-1/2 border border-gray-100 rounded-xl sm:p-6">
                <p className="text-gray-600 leading-relaxed text-justify text-sm sm:text-base mb-4">
                  At Lunq, we are passionate about connecting businesses with the best freelancers from around the globe. Our platform brings together top-tier talent and clients, ensuring every project meets the highest standards. We thrive on quality, innovation, and collaboration. Lunq empowers businesses to find the perfect freelancers and helps them achieve their goals efficiently. Whether you're looking for web development, design, content creation, or any other service, we ensure a seamless experience from start to finish. Our mission is to create opportunities, foster creativity, and deliver outstanding outcomes that help businesses grow and succeed.
                </p>
                <p className="text-gray-600 leading-relaxed text-justify text-sm sm:text-base">
                  We believe in the power of connection. We provide businesses access to a rich ecosystem of talent across every category of professional services. Whether small or big, our platform and verified network have opportunity and excellence for all scales.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="w-full lg:w-1/2 border border-gray-100 rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full">
                  <div className="text-center p-4 sm:p-6 border border-blue-900 rounded-xl flex flex-col items-center justify-center min-h-[120px]">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                      4,000+
                    </div>
                    <div className="text-gray-600 font-medium text-sm sm:text-base">
                      Verified Clients
                    </div>
                  </div>
                  <div className="text-center p-4 sm:p-6 border border-blue-900 rounded-xl flex flex-col items-center justify-center min-h-[120px]">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                      10,000+
                    </div>
                    <div className="text-gray-600 font-medium text-sm sm:text-base">
                      Verified Freelancers
                    </div>
                  </div>
                  <div className="text-center p-4 sm:p-6 border border-blue-900 rounded-xl flex flex-col items-center justify-center min-h-[120px]">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                      2,000+
                    </div>
                    <div className="text-gray-600 font-medium text-sm sm:text-base">
                      Orders Completed
                    </div>
                  </div>
                  <div className="text-center p-4 sm:p-6 border border-blue-900 rounded-xl flex flex-col items-center justify-center min-h-[120px]">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                      1,500+
                    </div>
                    <div className="text-gray-600 font-medium text-sm sm:text-base">
                      Reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Dream Section */}
      <div className="bg-gray-50 px-4 sm:px-6 2xl:px-0 py-4 md:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 h2-gradient-text">
                Our Dream
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our dream is to build a world where businesses and freelancers seamlessly collaborate to create innovative solutions. We envision a platform that empowers organizations with the best talent, while providing freelancers with opportunities to showcase their skills and grow. By fostering a community of creativity, expertise, and trust, we aim to revolutionize the way work is done, making business success accessible for everyone.
              </p>
            </div>

            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                alt="Team collaboration"
                className="w-full max-w-md h-[300px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"
                alt="Target and mission"
                className="w-full max-w-md h-[300px] object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 h2-gradient-text">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to bridge the gap between businesses and skilled freelancers, offering access to top-tier talent across various industries. We are dedicated to providing high-quality services that ensure success and deliver exceptional results. Our platform is designed to be seamless and reliable, ensuring a smooth experience from project start to finish. By connecting businesses with top-tier professionals, we empower organizations to achieve their goals efficiently and effectively. With a focus on talent, innovation, and client satisfaction, we aim to be the go-to platform for businesses seeking skilled freelancers to bring their ideas to life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Vision Section */}
      <div className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 h2-gradient-text">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our vision is to become the leading platform that connects businesses with exceptional freelancers, driving innovation and success across industries. We aim to create a world where talent and opportunity meet seamlessly, empowering both clients and freelancers to excel. Through our commitment to quality, reliability, and collaboration, we strive to shape the future of work, empowering businesses and freelancers alike to achieve their full potential.
              </p>
            </div>

            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
                alt="Vision and growth"
                className="w-full max-w-md h-[300px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;