import React from "react";

const Bio = ({ id, bio }) => (
  <span>
    {bio &&
      bio.split("\n").map((part, i) => (
        <span key={`bio-${id}-${i}`}>
          {part}
          <br />
        </span>
      ))}
  </span>
);

export default Bio;
