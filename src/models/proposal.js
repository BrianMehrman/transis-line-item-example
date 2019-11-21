export default Transis.Model.extend("Proposal", function() {
  this.attr("name", "string");
  this.attr("createdAt", "datetime");

  this.hasMany("propertyBuys", "PropertyBuy", { inverse: "proposal" });
  this.hasOne("mediaPlan", "MediaPlan", { inverse: "proposals" });

  this.prop("lineItems", {
    on: ["propertyBuys.lineItems"],
    get: lineItems => lineItems
  });
});
