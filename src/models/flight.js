export default Transis.Model.extend("Flight", function() {
  this.attr("startDate", "date");
  this.attr("endDate", "date");
  this.attr("rate", "number");
  this.attr("cost", "number");
  this.attr("unit", "number");
  this.attr("type", "string");
  this.attr("createdAt", "datetime");
  this.hasOne("tactic", "Tactic", { inverse: "flights" });
});
