import _ from "lodash";

const AttrMunger = (function() {
  var munge = function(attrs, opts) {
    if (opts == null) {
      opts = {};
    }
    if (_.isArray(attrs)) {
      for (var i = 0; i < attrs.length; i++) {
        var o = attrs[i];
        munge(o, opts);
      }
    } else if (_.isObject(attrs)) {
      for (var k in attrs) {
        var v = attrs[k];
        if (_.isObject(v)) {
          munge(v, opts);
        }
        let transformed;
        if (opts.camelize) {
          transformed = Transis.camelize(k);
        } else {
          if (opts.underscore) {
            transformed = Transis.underscore(k);
          } else {
            transformed = k;
          }
        }

        if (k !== transformed) {
          attrs[transformed] = v;
          delete attrs[k];
        }
      }
    }
    return attrs;
  };
  return {
    // Public: Munges the given object or array of objects by converting all keys
    // to `camelCase` format.
    camelize: function(attrs) {
      return munge(_.cloneDeep(attrs), {
        camelize: true
      });
    },
    // Public: Munges the given object or array of objects by converting all keys
    // to `under_score` format.
    underscore: function(attrs) {
      return munge(_.cloneDeep(attrs), {
        underscore: true
      });
    }
  };
})();

export default AttrMunger;
