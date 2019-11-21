import http from "./http";
import AttrMunger from "./attr_munger";

const ResourceMapper = Transis.Object.extend(function() {
  this.prototype.init = function(resourceURL) {
    if (resourceURL) {
      this.resourceURL = resourceURL;
    }
  };

  this.prototype.resourcePath = function(id) {
    return id != null ? this.resourceURL + "/" + id : this.resourceURL;
  };

  this.prototype.parseResponse = function(response) {
    return AttrMunger.camelize(response);
  };

  this.prototype.parseErrorResponse = function(response) {
    return AttrMunger.camelize(response);
  };

  this.prototype.serializeModel = function(model) {
    var attrs = model.attrs();
    delete attrs.meta;
    return AttrMunger.underscore(attrs);
  };

  this.prototype.errorCallback = function(response) {
    return Promise.reject(
      response.data.errors
        ? this.parseErrorResponse(response.data.errors)
        : response.data
    );
  };

  this.prototype.query = function(params) {
    return http.get(this.resourcePath(), { params: params }).then(
      function(response) {
        return this.parseResponse(response.data);
      }.bind(this)
    );
  };
  this.prototype.get = function(id) {
    return http.get(this.resourcePath(id)).then(
      function(response) {
        return this.parseResponse(response.data);
      }.bind(this)
    );
  };
});

export default ResourceMapper;
