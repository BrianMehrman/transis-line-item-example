import MediaPlanMapper from "./media_plan_mapper";

export default Transis.Model.extend("MediaPlan", function() {
  this.mapper = new MediaPlanMapper();

  this.attr("name", "string");
  this.attr("createdAt", "datetime");

  this.hasMany("proposals", "Proposal", { inverse: "mediaPlan" });

  this.prop("lineItems", {
    on: ["proposals.lineItems"],
    get: lineItems => lineItems
  });
});
