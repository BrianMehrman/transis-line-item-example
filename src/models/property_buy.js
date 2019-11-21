export default Transis.Model.extend("PropertyBuy", function() {
  this.attr("name", "string");
  this.attr("createdAt", "datetime");
  this.hasMany("tactics", "Tactic", { inverse: "propertyBuy" });
  this.hasOne("proposal", "Proposal", { inverse: "propertyBuys" });

  this.prop("lineItems", {
    on: ["tactics.flights"],
    get: flights => flights
  });
});
