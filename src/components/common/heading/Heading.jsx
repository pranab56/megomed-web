import React from "react";

function Heading({ heading, subheading }) {
  return (
    <div>
      <h1 className="text-5xl font-bold leading-tight">{heading}</h1>
      <p>{subheading}</p>
    </div>
  );
}

export default Heading;
