import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

function ExploreMore() {
  const exploreOption = [
    {
      id: 1,
      name: "Graphic&Design",
      src: "",
    },
    {
      id: 2,
      name: "Cartoon Animation",
      src: "",
    },
    {
      id: 3,
      name: "Illustration",
      src: "",
    },
    {
      id: 4,
      name: "Flyers & Vouchers",
      src: "",
    },
    {
      id: 5,
      name: "Logo Design",
      src: "",
    },
    {
      id: 6,
      name: "Social graphics",
      src: "",
    },
    {
      id: 7,
      name: "Article writing",
      src: "",
    },
    {
      id: 8,
      name: "Video Editing",
      src: "",
    },
  ];
  return (
    <div className="my-10 px-4 sm:px-6 2xl:px-0">
      <h1 className="text-5xl font-bold text-center h2-gradient-text leading-tight">
        Explore More Design Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 my-4">
        {exploreOption.map((item) => (
          <Card
            className="min-h-40 flex items-center justify-center"
            key={item.id}
          >
            <h3>{item.name}</h3>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Button className="button-gradient min-w-60 my-4 ">
          See All Categories
        </Button>
      </div>
    </div>
  );
}

export default ExploreMore;
