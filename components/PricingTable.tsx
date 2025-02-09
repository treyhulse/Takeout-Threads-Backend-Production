"use client";
import { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": any; // Allows TypeScript to accept the custom element
    }
  }
}

const PricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="bg-primary mb-24">
      <stripe-pricing-table
        pricing-table-id="prctbl_1QqMIEG8ouTMhA7USWijsOWj"
        publishable-key="pk_live_51QqLZpG8ouTMhA7UfILL6lh6FBWQIAg9iwe4zhlchxpRoi2tvfc5tJ9lwl1F4q0JotwVvUTYqqsIdi2zCmkLjXuu008Dfg3foU"
      ></stripe-pricing-table>
    </div>
  );
};

export default PricingTable;
