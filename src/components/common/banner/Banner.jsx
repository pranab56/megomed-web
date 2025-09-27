import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Banner({ src, header, text, buttonName, buttonLink }) {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 py-4 px-4 sm:px-6 lg:px-10 2xl:px-0">
      {/* Text section */}
      <div className="space-y-4 w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl h2-gradient-text leading-snug font-bold">
          {header}
        </h2>
        <p className="text-sm sm:text-base text-gray-700">{text}</p>
        {/* {buttonName &&
          (buttonLink ? (
            <Link href={buttonLink}>
              <Button className="button-gradient">{buttonName}</Button>
            </Link>
          ) : (
            <Button className="button-gradient">{buttonName}</Button>
          ))} */}
      </div>

      {/* Image section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src={src}
          width={400}
          height={400}
          alt={header || "Banner Image"}
          className="w-3/4 sm:w-2/3 md:w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}

export default Banner;
