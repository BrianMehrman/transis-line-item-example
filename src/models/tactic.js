export default Transis.Model.extend("Tactic", function() {
  this.attr("name", "string");
  this.attr("createdAt", "datetime");
  this.hasMany("flights", "Flight", { inverse: "tactic" });
  this.hasOne("propertyBuy", "PropertyBuy", { inverse: "tactics" });
});
