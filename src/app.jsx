import React, { useState, useEffect } from "react";
import "./App.css";
import MediaPlan from "./models/media_plan";
import { Binding } from "@babel/traverse";

window.MediaPlan = MediaPlan;

function App() {
  const [mediaPlan, setMediaPlan] = useState({});
  const [lineItemCount, setLineItemCount] = useState(0);

  const loadMediaPlan = () => {
    const plan = MediaPlan.get("4f995473-3b84-4140-adab-571aa3600dc2")
    plan.then(() => {
      setLineItemCount(plan.lineItems.length);
    });
    setMediaPlan(plan);
  };
  debugger
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button className="App-link" onClick={loadMediaPlan}>
          Load Media Plan
        </button>
      </header>
      <div>
        {!mediaPlan.isLoaded && !mediaPlan.isBusy && <span>no media plan loaded</span>}
        {mediaPlan && mediaPlan.isBusy && <span>media plan is loading...</span>}
        {mediaPlan && mediaPlan.isLoaded && !mediaPlan.isBusy && (
          <span>There are {lineItemCount} line items loaded</span>
        )}
      </div>
    </div>
  );
}

export default App;
