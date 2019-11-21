import _ from "lodash";
let defaultParams = {};

const INVALID_RESPONSE_TYPE = "INVALID_RESPONSE_TYPE";

function toQueryString(params, origParams, keyBase) {
  var value, i, item, key;
  for (key in origParams) {
    value = origParams[key];
    if (value != null) {
      if (keyBase) {
        key = keyBase + "[" + key + "]";
      }

      if (Array.isArray(value)) {
        key = key + "[]";
        for (i = 0; i < value.length; ++i) {
          item = value[i];
          if (typeof item === "object") {
            toQueryString(params, item, key);
          } else {
            params[key] = value;
          }
        }
      } else if (typeof value === "object") {
        toQueryString(params, value, key);
      } else {
        params[key] = value;
      }
    }
  }
}

// TODO(pwong): do we need this?
function encodeUriQuery(val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, " ");
}

// TODO(pwong): Replace with URI.js (alex will be using it for routing)
function buildUrl(url, params) {
  if (!params) return url;
  const parts = [];
  const newParams = {};
  toQueryString(newParams, params);

  Object.keys(newParams)
    .sort()
    .forEach(function(key) {
      let value = newParams[key];
      if (value == null) return;
      if (!Array.isArray(value)) value = [value];

      value.forEach(function(v) {
        if (typeof v === "object") {
          v = Array.isArray(v) ? v.toISOString() : JSON.stringify(v);
        }

        parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v));
      });
    });

  if (parts.length > 0) {
    url += (url.indexOf("?") === -1 ? "?" : "&") + parts.join("&");
  }
  return url;
}

function fetch(method, url, options = {}) {
  return new Promise((resolve, reject) => {
    let params = options.params || {};
    const skipDefaultErrorHandlers = options.skipDefaultErrorHandlers || false;
    const data = JSON.stringify(options.data);
    const xhr = new XMLHttpRequest();

    if (options.responseType) {
      // IE 10-11 have an issue with some response types...
      try {
        xhr.responseType = options.responseType;
      } catch (e) {
        reject(INVALID_RESPONSE_TYPE);
      }
    }

    if (!_.isEmpty(defaultParams)) {
      _.each(defaultParams, function(value, key) {
        if (_.has(params, key)) {
          throw new Error(
            "Provided param {" +
              key +
              "} already exists as a default parameter in http.js"
          );
        }
      });
      params = _.merge(params, defaultParams);
    }

    xhr.open(method, buildUrl(url, params));

    xhr.setRequestHeader("Accept", "application/json;charset=UTF-8");

    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }

    if (xhr.responseType instanceof String) {
      xhr.responseType = "json";
    }

    xhr.send(data);

    xhr.onerror = function() {
      reject(xhr);
    };
    xhr.onload = function() {
      let response = xhr.response;
      const statusOk = xhr.status >= 200 && xhr.status <= 300;

      if (
        /application\/json/.test(this.getResponseHeader("Content-Type")) &&
        response.length
      ) {
        try {
          response = JSON.parse(response);
        } catch (e) {
          reject(e);
        }
      }

      const payload = { data: response };

      if (statusOk) {
        if (options.resolveXHR) {
          resolve(xhr);
        } else {
          resolve(payload);
        }
      } else {
        reject(payload);

        if (!skipDefaultErrorHandlers) {
          http._errorHandlers.forEach(errorHandler => {
            errorHandler(xhr);
          });
        }
      }
    };
  });
}

// Downloads a file using HTML5.
// This is done by setting the responseType to `arraybuffer` and treating the response as binary
function download(url, options) {
  const FILENAME_REGEX = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

  return new Promise((resolve, reject) => {
    fetch("GET", url, {
      ...options,
      resolveXHR: true,
      responseType: "arraybuffer",
      skipDefaultErrorHandlers: true
    })
      .then(xhr => {
        let filename;
        const disposition = xhr.getResponseHeader("Content-Disposition");
        const type = xhr.getResponseHeader("Content-Type"); // get content type of downloaded file
        const blob = new Blob([xhr.response], { type }); // create blob (https://developer.mozilla.org/en-US/docs/Web/API/Blob) from file content
        const downloadUrl = URL.createObjectURL(blob); // create url to download in-memory blob
        const fallbackUrl = buildUrl(url, options.params || {}); // backup url for unsupported or caught exceptions

        // Detect downloaded file's original filename
        if (disposition && disposition.includes("attachment")) {
          const matches = FILENAME_REGEX.exec(disposition);
          if (matches && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
          }
        }

        if (!filename) window.location = downloadUrl;
        else {
          const a = document.createElement("a");
          if (typeof a.download === "undefined") {
            // handle redirect for browsers without `a.download` capabilities
            // Currently (3/21/17) - Safari 10 and IE 11 do not support.
            // http://caniuse.com/#search=a.download
            window.location.href = fallbackUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        }

        // Revoke the URL, removing the refs to this object
        // allows browser GC to release memory
        window.setTimeout(() => {
          window.URL.revokeObjectURL(downloadUrl);
        }, 100);
        resolve();
      })
      .catch(error => {
        if (error === INVALID_RESPONSE_TYPE) {
          window.location.href = "/";
          resolve();
        } else {
          reject(error);
        }
      });
  });
}

const http = {
  STATUS_UNAUTHORIZED: 401,
  STATUS_CONFLICT: 409,
  STATUS_LOCKED: 423,
  STATUS_SERVER_ERROR: 500,

  get: fetch.bind(null, "GET"),
  put: fetch.bind(null, "PUT"),
  post: fetch.bind(null, "POST"),
  buildUrl: buildUrl,
  delete: fetch.bind(null, "DELETE"),
  download: download,
  setDefaultParams: function(params) {
    defaultParams = params;
  },

  _errorHandlers: [],
  registerErrorHandler: function(handler) {
    if (typeof handler === "function") {
      http._errorHandlers.push(handler);
    }
  }
};

export default http;
