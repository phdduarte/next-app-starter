import React from "react";

export default function GlobalStyles() {
  return (
    <style global jsx>{`
      :root {
        --font: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI",
          "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
          "Helvetica Neue", sans-serif;
      }

      *,
      * > * {
        font-family: var(--font);
        box-sizing: border-box;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p {
        padding: 0;
        margin: 0;
      }
    `}</style>
  );
}
