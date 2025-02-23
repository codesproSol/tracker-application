(function (e, t) {
  "use strict";
  function m() {}
  function g(e, t) {
    if (!e) {
      return;
    }
    if (typeof e === "object") {
      e = [].slice.call(e);
    }
    for (var n = 0, r = e.length; n < r; n++) {
      t.call(e, e[n], n);
    }
  }
  function y(e, n) {
    var r = Object.prototype.toString.call(n).slice(8, -1);
    return n !== t && n !== null && r === e;
  }
  function b(e) {
    return y("Function", e);
  }
  function w(e) {
    return y("Array", e);
  }
  function E(e) {
    var t = e.split("/"),
      n = t[t.length - 1],
      r = n.indexOf("?");
    return r !== -1 ? n.substring(0, r) : n;
  }
  function S(e) {
    e = e || m;
    if (e._done) {
      return;
    }
    e();
    e._done = 1;
  }
  function x(e, t, n, r) {
    var i =
      typeof e === "object"
        ? e
        : {
            test: e,
            success: !!t ? (w(t) ? t : [t]) : false,
            failure: !!n ? (w(n) ? n : [n]) : false,
            callback: r || m,
          };
    var s = !!i.test;
    if (s && !!i.success) {
      i.success.push(i.callback);
      c.load.apply(null, i.success);
    } else if (!s && !!i.failure) {
      i.failure.push(i.callback);
      c.load.apply(null, i.failure);
    } else {
      r();
    }
    return c;
  }
  function T(e) {
    var t = {};
    if (typeof e === "object") {
      for (var n in e) {
        if (!!e[n]) {
          t = {
            name: n,
            url: e[n],
          };
        }
      }
    } else {
      t = {
        name: E(e),
        url: e,
      };
    }
    var r = o[t.name];
    if (r && r.url === t.url) {
      return r;
    }
    o[t.name] = t;
    return t;
  }
  function N(e) {
    e = e || o;
    for (var t in e) {
      if (e.hasOwnProperty(t) && e[t].state !== v) {
        return false;
      }
    }
    return true;
  }
  function C(e) {
    e.state = p;
    g(e.onpreload, function (e) {
      e.call();
    });
  }
  function k(e, n) {
    if (e.state === t) {
      e.state = h;
      e.onpreload = [];
      M(
        {
          url: e.url,
          type: "cache",
        },
        function () {
          C(e);
        },
      );
    }
  }
  function L() {
    var e = arguments,
      t = [].slice.call(e, 1),
      n = t[0];
    if (!a) {
      i.push(function () {
        c.load.apply(null, e);
      });
      return c;
    }
    if (!!n) {
      g(t, function (e) {
        if (!b(e) && !!e) {
          k(T(e));
        }
      });
      O(
        T(e[0]),
        b(n)
          ? n
          : function () {
              c.load.apply(null, t);
            },
      );
    } else {
      O(T(e[0]));
    }
    return c;
  }
  function A() {
    var e = arguments,
      t = e[e.length - 1],
      n = {};
    if (!b(t)) {
      t = null;
    }
    g(e, function (r, i) {
      if (r !== t) {
        r = T(r);
        n[r.name] = r;
        O(
          r,
          t && i === e.length - 2
            ? function () {
                if (N(n)) {
                  S(t);
                }
              }
            : null,
        );
      }
    });
    return c;
  }
  function O(e, t) {
    t = t || m;
    if (e.state === v) {
      t();
      return;
    }
    if (e.state === d) {
      c.ready(e.name, t);
      return;
    }
    if (e.state === h) {
      e.onpreload.push(function () {
        O(e, t);
      });
      return;
    }
    e.state = d;
    M(e, function () {
      e.state = v;
      t();
      g(s[e.name], function (e) {
        S(e);
      });
      if (f && N()) {
        g(s.ALL, function (e) {
          S(e);
        });
      }
    });
  }
  function M(t, r) {
    function i(t) {
      t = t || e.event;
      o.onload = o.onreadystatechange = o.onerror = null;
      r();
    }
    function s(t) {
      t = t || e.event;
      if (
        t.type === "load" ||
        (/loaded|complete/.test(o.readyState) && (!n.documentMode || n.documentMode < 9))
      ) {
        o.onload = o.onreadystatechange = o.onerror = null;
        r();
      }
    }
    r = r || m;
    var o;
    if (/\.css[^\.]*$/.test(t.url)) {
      o = n.createElement("link");
      o.type = "text/" + (t.type || "css");
      o.rel = "stylesheet";
      o.href = t.url;
    } else {
      o = n.createElement("script");
      o.type = "text/" + (t.type || "javascript");
      o.src = t.url;
    }
    o.onload = o.onreadystatechange = s;
    o.onerror = i;
    o.async = false;
    o.defer = false;
    var u = n.head || n.getElementsByTagName("head")[0];
    u.insertBefore(o, u.lastChild);
  }
  function _() {
    var e = n.getElementsByTagName("script");
    for (var t = 0, r = e.length; t < r; t++) {
      var i = e[t].getAttribute("data-headjs-load");
      if (!!i) {
        c.load(i);
        return;
      }
    }
  }
  function D(e, t) {
    if (e === n) {
      if (f) {
        S(t);
      } else {
        r.push(t);
      }
      return c;
    }
    if (b(e)) {
      t = e;
      e = "ALL";
    }
    if (typeof e !== "string" || !b(t)) {
      return c;
    }
    var i = o[e];
    if ((i && i.state === v) || (e === "ALL" && N() && f)) {
      S(t);
      return c;
    }
    var u = s[e];
    if (!u) {
      u = s[e] = [t];
    } else {
      u.push(t);
    }
    return c;
  }
  function P() {
    if (!n.body) {
      e.clearTimeout(c.readyTimeout);
      c.readyTimeout = e.setTimeout(P, 50);
      return;
    }
    if (!f) {
      f = true;
      _();
      g(r, function (e) {
        S(e);
      });
    }
  }
  function H() {
    if (n.addEventListener) {
      n.removeEventListener("DOMContentLoaded", H, false);
      P();
    } else if (n.readyState === "complete") {
      n.detachEvent("onreadystatechange", H);
      P();
    }
  }
  var n = e.document,
    r = [],
    i = [],
    s = {},
    o = {},
    u =
      "async" in n.createElement("script") || "MozAppearance" in n.documentElement.style || e.opera,
    a,
    f,
    l = (e.head_conf && e.head_conf.head) || "head",
    c = (e[l] =
      e[l] ||
      function () {
        c.ready.apply(null, arguments);
      }),
    h = 1,
    p = 2,
    d = 3,
    v = 4;
  if (n.readyState === "complete") {
    P();
  } else if (n.addEventListener) {
    n.addEventListener("DOMContentLoaded", H, false);
    e.addEventListener("load", P, false);
  } else {
    n.attachEvent("onreadystatechange", H);
    e.attachEvent("onload", P);
    var B = false;
    try {
      B = !e.frameElement && n.documentElement;
    } catch (j) {}
    if (B && B.doScroll) {
      (function F() {
        if (!f) {
          try {
            B.doScroll("left");
          } catch (t) {
            e.clearTimeout(c.readyTimeout);
            c.readyTimeout = e.setTimeout(F, 50);
            return;
          }
          P();
        }
      })();
    }
  }
  c.load = c.js = u ? A : L;
  c.test = x;
  c.ready = D;
  c.ready(n, function () {
    if (N()) {
      g(s.ALL, function (e) {
        S(e);
      });
    }
    if (c.feature) {
      c.feature("domloaded", true);
    }
  });
  setTimeout(function () {
    a = true;
    g(i, function (e) {
      e();
    });
  }, 300);
})(window);
