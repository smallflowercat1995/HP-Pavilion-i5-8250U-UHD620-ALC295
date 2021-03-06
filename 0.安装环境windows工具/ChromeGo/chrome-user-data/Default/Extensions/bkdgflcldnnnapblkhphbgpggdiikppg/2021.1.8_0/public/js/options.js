(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')
var onload = require('on-load')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  willvalidate: 1
}
var COMMENT_TAG = '!--'
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // If adding onload events
  if (props.onload || props.onunload) {
    var load = props.onload || function () {}
    var unload = props.onunload || function () {}
    onload(el, function belOnload () {
      load(el)
    }, function belOnunload () {
      unload(el)
    },
    // We have to use non-standard `caller` to find who invokes `belCreateElement`
    belCreateElement.caller.caller.caller)
    delete props.onload
    delete props.onunload
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS[key]) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        typeof node === 'function' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"global/document":3,"hyperx":6,"on-load":8}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":2}],4:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],6:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":5}],7:[function(require,module,exports){
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],8:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var assert = require('assert')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  if (document.body) {
    beginObserve(observer)
  } else {
    document.addEventListener('DOMContentLoaded', function (event) {
      beginObserve(observer)
    })
  }
}

function beginObserve (observer) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  assert(document.body, 'on-load: will not work prior to DOMContentLoaded')
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"assert":7,"global/document":3,"global/window":4}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Check if `vhost` is a valid suffix of `hostname` (top-domain)
 *
 * It means that `vhost` needs to be a suffix of `hostname` and we then need to
 * make sure that: either they are equal, or the character preceding `vhost` in
 * `hostname` is a '.' (it should not be a partial label).
 *
 * * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
 * * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
 * * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
 */
function shareSameDomainSuffix(hostname, vhost) {
    if (hostname.endsWith(vhost)) {
        return (hostname.length === vhost.length ||
            hostname[hostname.length - vhost.length - 1] === '.');
    }
    return false;
}
/**
 * Given a hostname and its public suffix, extract the general domain.
 */
function extractDomainWithSuffix(hostname, publicSuffix) {
    // Locate the index of the last '.' in the part of the `hostname` preceding
    // the public suffix.
    //
    // examples:
    //   1. not.evil.co.uk  => evil.co.uk
    //         ^    ^
    //         |    | start of public suffix
    //         | index of the last dot
    //
    //   2. example.co.uk   => example.co.uk
    //     ^       ^
    //     |       | start of public suffix
    //     |
    //     | (-1) no dot found before the public suffix
    const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
    const lastDotBeforeSuffixIndex = hostname.lastIndexOf('.', publicSuffixIndex);
    // No '.' found, then `hostname` is the general domain (no sub-domain)
    if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
    }
    // Extract the part between the last '.'
    return hostname.slice(lastDotBeforeSuffixIndex + 1);
}
/**
 * Detects the domain based on rules and upon and a host string
 */
function getDomain(suffix, hostname, options) {
    // Check if `hostname` ends with a member of `validHosts`.
    if (options.validHosts !== null) {
        const validHosts = options.validHosts;
        for (let i = 0; i < validHosts.length; i += 1) {
            const vhost = validHosts[i];
            if (shareSameDomainSuffix(hostname, vhost)) {
                return vhost;
            }
        }
    }
    // If `hostname` is a valid public suffix, then there is no domain to return.
    // Since we already know that `getPublicSuffix` returns a suffix of `hostname`
    // there is no need to perform a string comparison and we only compare the
    // size.
    if (suffix.length === hostname.length) {
        return null;
    }
    // To extract the general domain, we start by identifying the public suffix
    // (if any), then consider the domain to be the public suffix with one added
    // level of depth. (e.g.: if hostname is `not.evil.co.uk` and public suffix:
    // `co.uk`, then we take one more level: `evil`, giving the final result:
    // `evil.co.uk`).
    return extractDomainWithSuffix(hostname, suffix);
}

/**
 * Return the part of domain without suffix.
 *
 * Example: for domain 'foo.com', the result would be 'foo'.
 */
function getDomainWithoutSuffix(domain, suffix) {
    // Note: here `domain` and `suffix` cannot have the same length because in
    // this case we set `domain` to `null` instead. It is thus safe to assume
    // that `suffix` is shorter than `domain`.
    return domain.slice(0, -suffix.length - 1);
}

/**
 * @param url - URL we want to extract a hostname from.
 * @param urlIsValidHostname - hint from caller; true if `url` is already a valid hostname.
 */
function extractHostname(url, urlIsValidHostname) {
    let start = 0;
    let end = url.length;
    let hasUpper = false;
    // If url is not already a valid hostname, then try to extract hostname.
    if (urlIsValidHostname === false) {
        // Special handling of data URLs
        if (url.startsWith('data:') === true) {
            return null;
        }
        // Trim leading spaces
        while (start < url.length && url.charCodeAt(start) <= 32) {
            start += 1;
        }
        // Trim trailing spaces
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
            end -= 1;
        }
        // Skip scheme.
        if (url.charCodeAt(start) === 47 /* '/' */ &&
            url.charCodeAt(start + 1) === 47 /* '/' */) {
            start += 2;
        }
        else {
            const indexOfProtocol = url.indexOf(':/', start);
            if (indexOfProtocol !== -1) {
                // Implement fast-path for common protocols. We expect most protocols
                // should be one of these 4 and thus we will not need to perform the
                // more expansive validity check most of the time.
                const protocolSize = indexOfProtocol - start;
                const c0 = url.charCodeAt(start);
                const c1 = url.charCodeAt(start + 1);
                const c2 = url.charCodeAt(start + 2);
                const c3 = url.charCodeAt(start + 3);
                const c4 = url.charCodeAt(start + 4);
                if (protocolSize === 5 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */ &&
                    c4 === 115 /* 's' */) ;
                else if (protocolSize === 4 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */) ;
                else if (protocolSize === 3 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */ &&
                    c2 === 115 /* 's' */) ;
                else if (protocolSize === 2 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */) ;
                else {
                    // Check that scheme is valid
                    for (let i = start; i < indexOfProtocol; i += 1) {
                        const lowerCaseCode = url.charCodeAt(i) | 32;
                        if (((lowerCaseCode >= 97 && lowerCaseCode <= 122) || // [a, z]
                            (lowerCaseCode >= 48 && lowerCaseCode <= 57) || // [0, 9]
                            lowerCaseCode === 46 || // '.'
                            lowerCaseCode === 45 || // '-'
                            lowerCaseCode === 43) === false // '+'
                        ) {
                            return null;
                        }
                    }
                }
                // Skip 0, 1 or more '/' after ':/'
                start = indexOfProtocol + 2;
                while (url.charCodeAt(start) === 47 /* '/' */) {
                    start += 1;
                }
            }
        }
        // Detect first occurrence of '/', '?' or '#'. We also keep track of the
        // last occurrence of '@', ']' or ':' to speed-up subsequent parsing of
        // (respectively), identifier, ipv6 or port.
        let indexOfIdentifier = -1;
        let indexOfClosingBracket = -1;
        let indexOfPort = -1;
        for (let i = start; i < end; i += 1) {
            const code = url.charCodeAt(i);
            if (code === 35 || // '#'
                code === 47 || // '/'
                code === 63 // '?'
            ) {
                end = i;
                break;
            }
            else if (code === 64) {
                // '@'
                indexOfIdentifier = i;
            }
            else if (code === 93) {
                // ']'
                indexOfClosingBracket = i;
            }
            else if (code === 58) {
                // ':'
                indexOfPort = i;
            }
            else if (code >= 65 && code <= 90) {
                hasUpper = true;
            }
        }
        // Detect identifier: '@'
        if (indexOfIdentifier !== -1 &&
            indexOfIdentifier > start &&
            indexOfIdentifier < end) {
            start = indexOfIdentifier + 1;
        }
        // Handle ipv6 addresses
        if (url.charCodeAt(start) === 91 /* '[' */) {
            if (indexOfClosingBracket !== -1) {
                return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
            }
            return null;
        }
        else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) {
            // Detect port: ':'
            end = indexOfPort;
        }
    }
    // Trim trailing dots
    while (end > start + 1 && url.charCodeAt(end - 1) === 46 /* '.' */) {
        end -= 1;
    }
    const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
    if (hasUpper) {
        return hostname.toLowerCase();
    }
    return hostname;
}

/**
 * Check if a hostname is an IP. You should be aware that this only works
 * because `hostname` is already garanteed to be a valid hostname!
 */
function isProbablyIpv4(hostname) {
    // Cannot be shorted than 1.1.1.1
    if (hostname.length < 7) {
        return false;
    }
    // Cannot be longer than: 255.255.255.255
    if (hostname.length > 15) {
        return false;
    }
    let numberOfDots = 0;
    for (let i = 0; i < hostname.length; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            numberOfDots += 1;
        }
        else if (code < 48 /* '0' */ || code > 57 /* '9' */) {
            return false;
        }
    }
    return (numberOfDots === 3 &&
        hostname.charCodeAt(0) !== 46 /* '.' */ &&
        hostname.charCodeAt(hostname.length - 1) !== 46 /* '.' */);
}
/**
 * Similar to isProbablyIpv4.
 */
function isProbablyIpv6(hostname) {
    if (hostname.length < 3) {
        return false;
    }
    let start = hostname[0] === '[' ? 1 : 0;
    let end = hostname.length;
    if (hostname[end - 1] === ']') {
        end -= 1;
    }
    // We only consider the maximum size of a normal IPV6. Note that this will
    // fail on so-called "IPv4 mapped IPv6 addresses" but this is a corner-case
    // and a proper validation library should be used for these.
    if (end - start > 39) {
        return false;
    }
    let hasColon = false;
    for (; start < end; start += 1) {
        const code = hostname.charCodeAt(start);
        if (code === 58 /* ':' */) {
            hasColon = true;
        }
        else if (((code >= 48 && code <= 57) || // 0-9
            (code >= 97 && code <= 102) || // a-f
            (code >= 65 && code <= 90) // A-F
        ) === false) {
            return false;
        }
    }
    return hasColon;
}
/**
 * Check if `hostname` is *probably* a valid ip addr (either ipv6 or ipv4).
 * This *will not* work on any string. We need `hostname` to be a valid
 * hostname.
 */
function isIp(hostname) {
    return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
}

/**
 * Implements fast shallow verification of hostnames. This does not perform a
 * struct check on the content of labels (classes of Unicode characters, etc.)
 * but instead check that the structure is valid (number of labels, length of
 * labels, etc.).
 *
 * If you need stricter validation, consider using an external library.
 */
function isValidAscii(code) {
    return ((code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code > 127);
}
/**
 * Check if a hostname string is valid. It's usually a preliminary check before
 * trying to use getDomain or anything else.
 *
 * Beware: it does not check if the TLD exists.
 */
function isValidHostname (hostname) {
    if (hostname.length > 255) {
        return false;
    }
    if (hostname.length === 0) {
        return false;
    }
    if (!isValidAscii(hostname.charCodeAt(0))) {
        return false;
    }
    // Validate hostname according to RFC
    let lastDotIndex = -1;
    let lastCharCode = -1;
    const len = hostname.length;
    for (let i = 0; i < len; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            if (
            // Check that previous label is < 63 bytes long (64 = 63 + '.')
            i - lastDotIndex > 64 ||
                // Check that previous character was not already a '.'
                lastCharCode === 46 ||
                // Check that the previous label does not end with a '-' (dash)
                lastCharCode === 45 ||
                // Check that the previous label does not end with a '_' (underscore)
                lastCharCode === 95) {
                return false;
            }
            lastDotIndex = i;
        }
        else if (!(isValidAscii(code) || code === 45 || code === 95)) {
            // Check if there is a forbidden character in the label
            return false;
        }
        lastCharCode = code;
    }
    return (
    // Check that last label is shorter than 63 chars
    len - lastDotIndex - 1 <= 63 &&
        // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45);
}

function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname = true, mixedInputs = true, validHosts = null, validateHostname = true, }) {
    return {
        allowIcannDomains,
        allowPrivateDomains,
        detectIp,
        extractHostname,
        mixedInputs,
        validHosts,
        validateHostname,
    };
}
const DEFAULT_OPTIONS = setDefaultsImpl({});
function setDefaults(options) {
    if (options === undefined) {
        return DEFAULT_OPTIONS;
    }
    return setDefaultsImpl(options);
}

/**
 * Returns the subdomain of a hostname string
 */
function getSubdomain(hostname, domain) {
    // If `hostname` and `domain` are the same, then there is no sub-domain
    if (domain.length === hostname.length) {
        return '';
    }
    return hostname.slice(0, -domain.length - 1);
}

/**
 * Implement a factory allowing to plug different implementations of suffix
 * lookup (e.g.: using a trie or the packed hashes datastructures). This is used
 * and exposed in `tldts.ts` and `tldts-experimental.ts` bundle entrypoints.
 */
function getEmptyResult() {
    return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        publicSuffix: null,
        subdomain: null,
    };
}
function resetResult(result) {
    result.domain = null;
    result.domainWithoutSuffix = null;
    result.hostname = null;
    result.isIcann = null;
    result.isIp = null;
    result.isPrivate = null;
    result.publicSuffix = null;
    result.subdomain = null;
}
function parseImpl(url, step, suffixLookup, partialOptions, result) {
    const options = setDefaults(partialOptions);
    // Very fast approximate check to make sure `url` is a string. This is needed
    // because the library will not necessarily be used in a typed setup and
    // values of arbitrary types might be given as argument.
    if (typeof url !== 'string') {
        return result;
    }
    // Extract hostname from `url` only if needed. This can be made optional
    // using `options.extractHostname`. This option will typically be used
    // whenever we are sure the inputs to `parse` are already hostnames and not
    // arbitrary URLs.
    //
    // `mixedInput` allows to specify if we expect a mix of URLs and hostnames
    // as input. If only hostnames are expected then `extractHostname` can be
    // set to `false` to speed-up parsing. If only URLs are expected then
    // `mixedInputs` can be set to `false`. The `mixedInputs` is only a hint
    // and will not change the behavior of the library.
    if (options.extractHostname === false) {
        result.hostname = url;
    }
    else if (options.mixedInputs === true) {
        result.hostname = extractHostname(url, isValidHostname(url));
    }
    else {
        result.hostname = extractHostname(url, false);
    }
    if (step === 0 /* HOSTNAME */ || result.hostname === null) {
        return result;
    }
    // Check if `hostname` is a valid ip address
    if (options.detectIp === true) {
        result.isIp = isIp(result.hostname);
        if (result.isIp === true) {
            return result;
        }
    }
    // Perform optional hostname validation. If hostname is not valid, no need to
    // go further as there will be no valid domain or sub-domain.
    if (options.validateHostname === true &&
        options.extractHostname === true &&
        isValidHostname(result.hostname) === false) {
        result.hostname = null;
        return result;
    }
    // Extract public suffix
    suffixLookup(result.hostname, options, result);
    if (step === 2 /* PUBLIC_SUFFIX */ || result.publicSuffix === null) {
        return result;
    }
    // Extract domain
    result.domain = getDomain(result.publicSuffix, result.hostname, options);
    if (step === 3 /* DOMAIN */ || result.domain === null) {
        return result;
    }
    // Extract subdomain
    result.subdomain = getSubdomain(result.hostname, result.domain);
    if (step === 4 /* SUB_DOMAIN */) {
        return result;
    }
    // Extract domain without suffix
    result.domainWithoutSuffix = getDomainWithoutSuffix(result.domain, result.publicSuffix);
    return result;
}

function fastPathLookup (hostname, options, out) {
    // Fast path for very popular suffixes; this allows to by-pass lookup
    // completely as well as any extra allocation or string manipulation.
    if (options.allowPrivateDomains === false && hostname.length > 3) {
        const last = hostname.length - 1;
        const c3 = hostname.charCodeAt(last);
        const c2 = hostname.charCodeAt(last - 1);
        const c1 = hostname.charCodeAt(last - 2);
        const c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 /* 'm' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 99 /* 'c' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'com';
            return true;
        }
        else if (c3 === 103 /* 'g' */ &&
            c2 === 114 /* 'r' */ &&
            c1 === 111 /* 'o' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'org';
            return true;
        }
        else if (c3 === 117 /* 'u' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 101 /* 'e' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'edu';
            return true;
        }
        else if (c3 === 118 /* 'v' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 103 /* 'g' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'gov';
            return true;
        }
        else if (c3 === 116 /* 't' */ &&
            c2 === 101 /* 'e' */ &&
            c1 === 110 /* 'n' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'net';
            return true;
        }
        else if (c3 === 101 /* 'e' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'de';
            return true;
        }
    }
    return false;
}

const exceptions = (function () {
    const _0 = { "$": 1, "succ": {} }, _1 = { "$": 2, "succ": {} }, _2 = { "$": 0, "succ": { "city": _0 } };
    const exceptions = { "$": 0, "succ": { "ck": { "$": 0, "succ": { "www": _0 } }, "jp": { "$": 0, "succ": { "kawasaki": _2, "kitakyushu": _2, "kobe": _2, "nagoya": _2, "sapporo": _2, "sendai": _2, "yokohama": _2 } }, "com": { "$": 0, "succ": { "algorithmia": { "$": 0, "succ": { "teams": _1, "test": _1 } } } } } };
    return exceptions;
})();
const rules = (function () {
    const _3 = { "$": 1, "succ": {} }, _4 = { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "net": _3, "mil": _3, "org": _3 } }, _5 = { "$": 2, "succ": {} }, _6 = { "$": 1, "succ": { "blogspot": _5 } }, _7 = { "$": 1, "succ": { "gov": _3 } }, _8 = { "$": 0, "succ": { "*": _5 } }, _9 = { "$": 0, "succ": { "*": _3 } }, _10 = { "$": 1, "succ": { "com": _3, "edu": _3, "net": _3, "org": _3, "gov": _3 } }, _11 = { "$": 1, "succ": { "co": _5 } }, _12 = { "$": 1, "succ": { "ng": _5 } }, _13 = { "$": 0, "succ": { "s3": _5 } }, _14 = { "$": 0, "succ": { "dualstack": _13 } }, _15 = { "$": 0, "succ": { "s3": _5, "dualstack": _13, "s3-website": _5 } }, _16 = { "$": 0, "succ": { "apps": _5 } }, _17 = { "$": 0, "succ": { "app": _5 } }, _18 = { "$": 0, "succ": { "j": _5 } }, _19 = { "$": 0, "succ": { "user": _5 } }, _20 = { "$": 1, "succ": { "ybo": _5 } }, _21 = { "$": 1, "succ": { "gov": _3, "blogspot": _5, "nym": _5 } }, _22 = { "$": 0, "succ": { "cust": _5 } }, _23 = { "$": 1, "succ": { "edu": _3, "biz": _3, "net": _3, "org": _3, "gov": _3, "info": _3, "com": _3 } }, _24 = { "$": 1, "succ": { "blogspot": _5, "nym": _5 } }, _25 = { "$": 1, "succ": { "for": _5 } }, _26 = { "$": 1, "succ": { "barsy": _5 } }, _27 = { "$": 0, "succ": { "forgot": _5 } }, _28 = { "$": 0, "succ": { "jelastic": _5 } }, _29 = { "$": 1, "succ": { "gs": _3 } }, _30 = { "$": 0, "succ": { "nes": _3 } }, _31 = { "$": 1, "succ": { "k12": _3, "cc": _3, "lib": _3 } }, _32 = { "$": 1, "succ": { "cc": _3, "lib": _3 } };
    const rules = { "$": 0, "succ": { "ac": _4, "ad": { "$": 1, "succ": { "nom": _3 } }, "ae": { "$": 1, "succ": { "co": _3, "net": _3, "org": _3, "sch": _3, "ac": _3, "gov": _3, "mil": _3, "blogspot": _5, "nom": _5 } }, "aero": { "$": 1, "succ": { "accident-investigation": _3, "accident-prevention": _3, "aerobatic": _3, "aeroclub": _3, "aerodrome": _3, "agents": _3, "aircraft": _3, "airline": _3, "airport": _3, "air-surveillance": _3, "airtraffic": _3, "air-traffic-control": _3, "ambulance": _3, "amusement": _3, "association": _3, "author": _3, "ballooning": _3, "broker": _3, "caa": _3, "cargo": _3, "catering": _3, "certification": _3, "championship": _3, "charter": _3, "civilaviation": _3, "club": _3, "conference": _3, "consultant": _3, "consulting": _3, "control": _3, "council": _3, "crew": _3, "design": _3, "dgca": _3, "educator": _3, "emergency": _3, "engine": _3, "engineer": _3, "entertainment": _3, "equipment": _3, "exchange": _3, "express": _3, "federation": _3, "flight": _3, "fuel": _3, "gliding": _3, "government": _3, "groundhandling": _3, "group": _3, "hanggliding": _3, "homebuilt": _3, "insurance": _3, "journal": _3, "journalist": _3, "leasing": _3, "logistics": _3, "magazine": _3, "maintenance": _3, "media": _3, "microlight": _3, "modelling": _3, "navigation": _3, "parachuting": _3, "paragliding": _3, "passenger-association": _3, "pilot": _3, "press": _3, "production": _3, "recreation": _3, "repbody": _3, "res": _3, "research": _3, "rotorcraft": _3, "safety": _3, "scientist": _3, "services": _3, "show": _3, "skydiving": _3, "software": _3, "student": _3, "trader": _3, "trading": _3, "trainer": _3, "union": _3, "workinggroup": _3, "works": _3 } }, "af": { "$": 1, "succ": { "gov": _3, "com": _3, "org": _3, "net": _3, "edu": _3, "nom": _5 } }, "ag": { "$": 1, "succ": { "com": _3, "org": _3, "net": _3, "co": _3, "nom": _3 } }, "ai": { "$": 1, "succ": { "off": _3, "com": _3, "net": _3, "org": _3, "uwu": _5, "nom": _5 } }, "al": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "blogspot": _5, "nom": _5 } }, "am": { "$": 1, "succ": { "co": _3, "com": _3, "commune": _3, "net": _3, "org": _3, "blogspot": _5, "neko": _5, "nyaa": _5 } }, "ao": { "$": 1, "succ": { "ed": _3, "gv": _3, "og": _3, "co": _3, "pb": _3, "it": _3 } }, "aq": _3, "ar": { "$": 1, "succ": { "com": _6, "edu": _3, "gob": _3, "gov": _3, "int": _3, "mil": _3, "musica": _3, "net": _3, "org": _3, "tur": _3 } }, "arpa": { "$": 1, "succ": { "e164": _3, "in-addr": _3, "ip6": _3, "iris": _3, "uri": _3, "urn": _3 } }, "as": _7, "asia": { "$": 1, "succ": { "cloudns": _5 } }, "at": { "$": 1, "succ": { "ac": { "$": 1, "succ": { "sth": _3 } }, "co": _6, "gv": _3, "or": _3, "funkfeuer": { "$": 0, "succ": { "wien": _5 } }, "futurecms": { "$": 0, "succ": { "*": _5, "ex": _8, "in": _8 } }, "futurehosting": _5, "futuremailing": _5, "ortsinfo": { "$": 0, "succ": { "ex": _8, "kunden": _8 } }, "biz": _5, "info": _5, "priv": _5, "12hp": _5, "2ix": _5, "4lima": _5, "lima-city": _5 } }, "au": { "$": 1, "succ": { "com": _6, "net": _3, "org": _3, "edu": { "$": 1, "succ": { "act": _3, "catholic": _3, "nsw": { "$": 1, "succ": { "schools": _3 } }, "nt": _3, "qld": _3, "sa": _3, "tas": _3, "vic": _3, "wa": _3 } }, "gov": { "$": 1, "succ": { "qld": _3, "sa": _3, "tas": _3, "vic": _3, "wa": _3 } }, "asn": _3, "id": _3, "info": _3, "conf": _3, "oz": _3, "act": _3, "nsw": _3, "nt": _3, "qld": _3, "sa": _3, "tas": _3, "vic": _3, "wa": _3 } }, "aw": { "$": 1, "succ": { "com": _3 } }, "ax": { "$": 1, "succ": { "be": _5, "cat": _5, "es": _5, "eu": _5, "gg": _5, "mc": _5, "us": _5, "xy": _5 } }, "az": { "$": 1, "succ": { "com": _3, "net": _3, "int": _3, "gov": _3, "org": _3, "edu": _3, "info": _3, "pp": _3, "mil": _3, "name": _3, "pro": _3, "biz": _3 } }, "ba": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "blogspot": _5 } }, "bb": { "$": 1, "succ": { "biz": _3, "co": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "net": _3, "org": _3, "store": _3, "tv": _3 } }, "bd": _9, "be": { "$": 1, "succ": { "ac": _3, "webhosting": _5, "blogspot": _5, "transurl": _8 } }, "bf": _7, "bg": { "$": 1, "succ": { "0": _3, "1": _3, "2": _3, "3": _3, "4": _3, "5": _3, "6": _3, "7": _3, "8": _3, "9": _3, "a": _3, "b": _3, "c": _3, "d": _3, "e": _3, "f": _3, "g": _3, "h": _3, "i": _3, "j": _3, "k": _3, "l": _3, "m": _3, "n": _3, "o": _3, "p": _3, "q": _3, "r": _3, "s": _3, "t": _3, "u": _3, "v": _3, "w": _3, "x": _3, "y": _3, "z": _3, "blogspot": _5, "barsy": _5 } }, "bh": _10, "bi": { "$": 1, "succ": { "co": _3, "com": _3, "edu": _3, "or": _3, "org": _3 } }, "biz": { "$": 1, "succ": { "cloudns": _5, "dyndns": _5, "for-better": _5, "for-more": _5, "for-some": _5, "for-the": _5, "selfip": _5, "webhop": _5, "bpl": _5, "orx": _5, "mmafan": _5, "myftp": _5, "no-ip": _5, "dscloud": _5 } }, "bj": { "$": 1, "succ": { "asso": _3, "barreau": _3, "gouv": _3, "blogspot": _5 } }, "bm": _10, "bn": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "co": _5 } }, "bo": { "$": 1, "succ": { "com": _3, "edu": _3, "gob": _3, "int": _3, "org": _3, "net": _3, "mil": _3, "tv": _3, "web": _3, "academia": _3, "agro": _3, "arte": _3, "blog": _3, "bolivia": _3, "ciencia": _3, "cooperativa": _3, "democracia": _3, "deporte": _3, "ecologia": _3, "economia": _3, "empresa": _3, "indigena": _3, "industria": _3, "info": _3, "medicina": _3, "movimiento": _3, "musica": _3, "natural": _3, "nombre": _3, "noticias": _3, "patria": _3, "politica": _3, "profesional": _3, "plurinacional": _3, "pueblo": _3, "revista": _3, "salud": _3, "tecnologia": _3, "tksat": _3, "transporte": _3, "wiki": _3 } }, "br": { "$": 1, "succ": { "9guacu": _3, "abc": _3, "adm": _3, "adv": _3, "agr": _3, "aju": _3, "am": _3, "anani": _3, "aparecida": _3, "app": _3, "arq": _3, "art": _3, "ato": _3, "b": _3, "barueri": _3, "belem": _3, "bhz": _3, "bib": _3, "bio": _3, "blog": _3, "bmd": _3, "boavista": _3, "bsb": _3, "campinagrande": _3, "campinas": _3, "caxias": _3, "cim": _3, "cng": _3, "cnt": _3, "com": _6, "contagem": _3, "coop": _3, "coz": _3, "cri": _3, "cuiaba": _3, "curitiba": _3, "def": _3, "des": _3, "det": _3, "dev": _3, "ecn": _3, "eco": _3, "edu": _3, "emp": _3, "enf": _3, "eng": _3, "esp": _3, "etc": _3, "eti": _3, "far": _3, "feira": _3, "flog": _3, "floripa": _3, "fm": _3, "fnd": _3, "fortal": _3, "fot": _3, "foz": _3, "fst": _3, "g12": _3, "geo": _3, "ggf": _3, "goiania": _3, "gov": { "$": 1, "succ": { "ac": _3, "al": _3, "am": _3, "ap": _3, "ba": _3, "ce": _3, "df": _3, "es": _3, "go": _3, "ma": _3, "mg": _3, "ms": _3, "mt": _3, "pa": _3, "pb": _3, "pe": _3, "pi": _3, "pr": _3, "rj": _3, "rn": _3, "ro": _3, "rr": _3, "rs": _3, "sc": _3, "se": _3, "sp": _3, "to": _3 } }, "gru": _3, "imb": _3, "ind": _3, "inf": _3, "jab": _3, "jampa": _3, "jdf": _3, "joinville": _3, "jor": _3, "jus": _3, "leg": { "$": 1, "succ": { "ac": _5, "al": _5, "am": _5, "ap": _5, "ba": _5, "ce": _5, "df": _5, "es": _5, "go": _5, "ma": _5, "mg": _5, "ms": _5, "mt": _5, "pa": _5, "pb": _5, "pe": _5, "pi": _5, "pr": _5, "rj": _5, "rn": _5, "ro": _5, "rr": _5, "rs": _5, "sc": _5, "se": _5, "sp": _5, "to": _5 } }, "lel": _3, "log": _3, "londrina": _3, "macapa": _3, "maceio": _3, "manaus": _3, "maringa": _3, "mat": _3, "med": _3, "mil": _3, "morena": _3, "mp": _3, "mus": _3, "natal": _3, "net": _3, "niteroi": _3, "nom": _9, "not": _3, "ntr": _3, "odo": _3, "ong": _3, "org": _3, "osasco": _3, "palmas": _3, "poa": _3, "ppg": _3, "pro": _3, "psc": _3, "psi": _3, "pvh": _3, "qsl": _3, "radio": _3, "rec": _3, "recife": _3, "rep": _3, "ribeirao": _3, "rio": _3, "riobranco": _3, "riopreto": _3, "salvador": _3, "sampa": _3, "santamaria": _3, "santoandre": _3, "saobernardo": _3, "saogonca": _3, "seg": _3, "sjc": _3, "slg": _3, "slz": _3, "sorocaba": _3, "srv": _3, "taxi": _3, "tc": _3, "tec": _3, "teo": _3, "the": _3, "tmp": _3, "trd": _3, "tur": _3, "tv": _3, "udi": _3, "vet": _3, "vix": _3, "vlog": _3, "wiki": _3, "zlg": _3 } }, "bs": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "edu": _3, "gov": _3, "we": _5 } }, "bt": _10, "bv": _3, "bw": { "$": 1, "succ": { "co": _3, "org": _3 } }, "by": { "$": 1, "succ": { "gov": _3, "mil": _3, "com": _6, "of": _3, "nym": _5 } }, "bz": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "edu": _3, "gov": _3, "za": _5, "nom": _5, "nym": _5 } }, "ca": { "$": 1, "succ": { "ab": _3, "bc": _3, "mb": _3, "nb": _3, "nf": _3, "nl": _3, "ns": _3, "nt": _3, "nu": _3, "on": _3, "pe": _3, "qc": _3, "sk": _3, "yk": _3, "gc": _3, "barsy": _5, "awdev": _8, "co": _5, "blogspot": _5, "no-ip": _5 } }, "cat": _3, "cc": { "$": 1, "succ": { "cloudns": _5, "ftpaccess": _5, "game-server": _5, "myphotos": _5, "scrapping": _5, "twmail": _5, "csx": _5, "fantasyleague": _5 } }, "cd": _7, "cf": _6, "cg": _3, "ch": { "$": 1, "succ": { "square7": _5, "blogspot": _5, "linkyard-cloud": _5, "dnsking": _5, "gotdns": _5, "firenet": { "$": 0, "succ": { "*": _5, "svc": _8 } }, "12hp": _5, "2ix": _5, "4lima": _5, "lima-city": _5 } }, "ci": { "$": 1, "succ": { "org": _3, "or": _3, "com": _3, "co": _3, "edu": _3, "ed": _3, "ac": _3, "net": _3, "go": _3, "asso": _3, "xn--aroport-bya": _3, "a??roport": _3, "int": _3, "presse": _3, "md": _3, "gouv": _3, "fin": _5, "nl": _5 } }, "ck": _9, "cl": { "$": 1, "succ": { "aprendemas": _3, "co": _3, "gob": _3, "gov": _3, "mil": _3, "blogspot": _5, "nom": _5 } }, "cm": { "$": 1, "succ": { "co": _3, "com": _3, "gov": _3, "net": _3 } }, "cn": { "$": 1, "succ": { "ac": _3, "com": { "$": 1, "succ": { "amazonaws": { "$": 0, "succ": { "compute": _8, "eb": { "$": 0, "succ": { "cn-north-1": _5, "cn-northwest-1": _5 } }, "elb": _8, "cn-north-1": _13 } } } }, "edu": _3, "gov": _3, "net": _3, "org": _3, "mil": _3, "xn--55qx5d": _3, "??????": _3, "xn--io0a7i": _3, "??????": _3, "xn--od0alg": _3, "??????": _3, "ah": _3, "bj": _3, "cq": _3, "fj": _3, "gd": _3, "gs": _3, "gz": _3, "gx": _3, "ha": _3, "hb": _3, "he": _3, "hi": _3, "hl": _3, "hn": _3, "jl": _3, "js": _3, "jx": _3, "ln": _3, "nm": _3, "nx": _3, "qh": _3, "sc": _3, "sd": _3, "sh": _3, "sn": _3, "sx": _3, "tj": _3, "xj": _3, "xz": _3, "yn": _3, "zj": _3, "hk": _3, "mo": _3, "tw": _3, "instantcloud": _5 } }, "co": { "$": 1, "succ": { "arts": _3, "com": _6, "edu": _3, "firm": _3, "gov": _3, "info": _3, "int": _3, "mil": _3, "net": _3, "nom": _3, "org": _3, "rec": _3, "web": _3, "carrd": _5, "crd": _5, "otap": _8, "leadpages": _5, "lpages": _5, "mypi": _5, "n4t": _5, "nodum": _5, "repl": _5 } }, "com": { "$": 1, "succ": { "adobeaemcloud": { "$": 2, "succ": { "dev": _8 } }, "kasserver": _5, "algorithmia": _8, "amazonaws": { "$": 0, "succ": { "compute": _8, "compute-1": _8, "us-east-1": { "$": 2, "succ": { "dualstack": _13 } }, "elb": _8, "s3": _5, "s3-ap-northeast-1": _5, "s3-ap-northeast-2": _5, "s3-ap-south-1": _5, "s3-ap-southeast-1": _5, "s3-ap-southeast-2": _5, "s3-ca-central-1": _5, "s3-eu-central-1": _5, "s3-eu-west-1": _5, "s3-eu-west-2": _5, "s3-eu-west-3": _5, "s3-external-1": _5, "s3-fips-us-gov-west-1": _5, "s3-sa-east-1": _5, "s3-us-gov-west-1": _5, "s3-us-east-2": _5, "s3-us-west-1": _5, "s3-us-west-2": _5, "ap-northeast-2": _15, "ap-south-1": _15, "ca-central-1": _15, "eu-central-1": _15, "eu-west-2": _15, "eu-west-3": _15, "us-east-2": _15, "ap-northeast-1": _14, "ap-southeast-1": _14, "ap-southeast-2": _14, "eu-west-1": _14, "sa-east-1": _14, "s3-website-us-east-1": _5, "s3-website-us-west-1": _5, "s3-website-us-west-2": _5, "s3-website-ap-northeast-1": _5, "s3-website-ap-southeast-1": _5, "s3-website-ap-southeast-2": _5, "s3-website-eu-west-1": _5, "s3-website-sa-east-1": _5 } }, "elasticbeanstalk": { "$": 2, "succ": { "ap-northeast-1": _5, "ap-northeast-2": _5, "ap-northeast-3": _5, "ap-south-1": _5, "ap-southeast-1": _5, "ap-southeast-2": _5, "ca-central-1": _5, "eu-central-1": _5, "eu-west-1": _5, "eu-west-2": _5, "eu-west-3": _5, "sa-east-1": _5, "us-east-1": _5, "us-east-2": _5, "us-gov-west-1": _5, "us-west-1": _5, "us-west-2": _5 } }, "on-aptible": _5, "myasustor": _5, "balena-devices": _5, "betainabox": _5, "bplaced": _5, "ar": _5, "br": _5, "cn": _5, "de": _5, "eu": _5, "gb": _5, "hu": _5, "jpn": _5, "kr": _5, "mex": _5, "no": _5, "qc": _5, "ru": _5, "sa": _5, "uk": _5, "us": _5, "uy": _5, "za": _5, "africa": _5, "gr": _5, "co": _5, "xenapponazure": _5, "jdevcloud": _5, "wpdevcloud": _5, "cloudcontrolled": _5, "cloudcontrolapp": _5, "trycloudflare": _5, "customer-oci": { "$": 0, "succ": { "*": _5, "oci": _8, "ocp": _8, "ocs": _8 } }, "dattolocal": _5, "dattorelay": _5, "dattoweb": _5, "mydatto": _5, "builtwithdark": _5, "drayddns": _5, "dreamhosters": _5, "mydrobo": _5, "dyndns-at-home": _5, "dyndns-at-work": _5, "dyndns-blog": _5, "dyndns-free": _5, "dyndns-home": _5, "dyndns-ip": _5, "dyndns-mail": _5, "dyndns-office": _5, "dyndns-pics": _5, "dyndns-remote": _5, "dyndns-server": _5, "dyndns-web": _5, "dyndns-wiki": _5, "dyndns-work": _5, "blogdns": _5, "cechire": _5, "dnsalias": _5, "dnsdojo": _5, "doesntexist": _5, "dontexist": _5, "doomdns": _5, "dyn-o-saur": _5, "dynalias": _5, "est-a-la-maison": _5, "est-a-la-masion": _5, "est-le-patron": _5, "est-mon-blogueur": _5, "from-ak": _5, "from-al": _5, "from-ar": _5, "from-ca": _5, "from-ct": _5, "from-dc": _5, "from-de": _5, "from-fl": _5, "from-ga": _5, "from-hi": _5, "from-ia": _5, "from-id": _5, "from-il": _5, "from-in": _5, "from-ks": _5, "from-ky": _5, "from-ma": _5, "from-md": _5, "from-mi": _5, "from-mn": _5, "from-mo": _5, "from-ms": _5, "from-mt": _5, "from-nc": _5, "from-nd": _5, "from-ne": _5, "from-nh": _5, "from-nj": _5, "from-nm": _5, "from-nv": _5, "from-oh": _5, "from-ok": _5, "from-or": _5, "from-pa": _5, "from-pr": _5, "from-ri": _5, "from-sc": _5, "from-sd": _5, "from-tn": _5, "from-tx": _5, "from-ut": _5, "from-va": _5, "from-vt": _5, "from-wa": _5, "from-wi": _5, "from-wv": _5, "from-wy": _5, "getmyip": _5, "gotdns": _5, "hobby-site": _5, "homelinux": _5, "homeunix": _5, "iamallama": _5, "is-a-anarchist": _5, "is-a-blogger": _5, "is-a-bookkeeper": _5, "is-a-bulls-fan": _5, "is-a-caterer": _5, "is-a-chef": _5, "is-a-conservative": _5, "is-a-cpa": _5, "is-a-cubicle-slave": _5, "is-a-democrat": _5, "is-a-designer": _5, "is-a-doctor": _5, "is-a-financialadvisor": _5, "is-a-geek": _5, "is-a-green": _5, "is-a-guru": _5, "is-a-hard-worker": _5, "is-a-hunter": _5, "is-a-landscaper": _5, "is-a-lawyer": _5, "is-a-liberal": _5, "is-a-libertarian": _5, "is-a-llama": _5, "is-a-musician": _5, "is-a-nascarfan": _5, "is-a-nurse": _5, "is-a-painter": _5, "is-a-personaltrainer": _5, "is-a-photographer": _5, "is-a-player": _5, "is-a-republican": _5, "is-a-rockstar": _5, "is-a-socialist": _5, "is-a-student": _5, "is-a-teacher": _5, "is-a-techie": _5, "is-a-therapist": _5, "is-an-accountant": _5, "is-an-actor": _5, "is-an-actress": _5, "is-an-anarchist": _5, "is-an-artist": _5, "is-an-engineer": _5, "is-an-entertainer": _5, "is-certified": _5, "is-gone": _5, "is-into-anime": _5, "is-into-cars": _5, "is-into-cartoons": _5, "is-into-games": _5, "is-leet": _5, "is-not-certified": _5, "is-slick": _5, "is-uberleet": _5, "is-with-theband": _5, "isa-geek": _5, "isa-hockeynut": _5, "issmarterthanyou": _5, "likes-pie": _5, "likescandy": _5, "neat-url": _5, "saves-the-whales": _5, "selfip": _5, "sells-for-less": _5, "sells-for-u": _5, "servebbs": _5, "simple-url": _5, "space-to-rent": _5, "teaches-yoga": _5, "writesthisblog": _5, "ddnsfree": _5, "ddnsgeek": _5, "giize": _5, "gleeze": _5, "kozow": _5, "loseyourip": _5, "ooguy": _5, "theworkpc": _5, "mytuleap": _5, "evennode": { "$": 0, "succ": { "eu-1": _5, "eu-2": _5, "eu-3": _5, "eu-4": _5, "us-1": _5, "us-2": _5, "us-3": _5, "us-4": _5 } }, "onfabrica": _5, "fbsbx": _16, "fastly-terrarium": _5, "fastvps-server": _5, "mydobiss": _5, "firebaseapp": _5, "freebox-os": _5, "freeboxos": _5, "gentapps": _5, "gentlentapis": _5, "githubusercontent": _5, "0emm": _8, "appspot": { "$": 2, "succ": { "r": _8 } }, "blogspot": _5, "codespot": _5, "googleapis": _5, "googlecode": _5, "pagespeedmobilizer": _5, "publishproxy": _5, "withgoogle": _5, "withyoutube": _5, "awsmppl": _5, "herokuapp": _5, "herokussl": _5, "myravendb": _5, "pixolino": _5, "dopaas": _5, "hidora": _5, "ik-server": { "$": 0, "succ": { "jcloud": _5 } }, "jelastic": { "$": 0, "succ": { "demo": _5 } }, "joyent": { "$": 0, "succ": { "cns": _8 } }, "lpusercontent": _5, "lmpm": _17, "linode": { "$": 0, "succ": { "members": _5, "nodebalancer": _8 } }, "linodeobjects": _8, "barsycenter": _5, "barsyonline": _5, "miniserver": _5, "meteorapp": { "$": 2, "succ": { "eu": _5 } }, "hostedpi": _5, "mythic-beasts": { "$": 0, "succ": { "customer": _5, "lynx": _5, "ocelot": _5, "onza": _5, "sphinx": _5, "vs": _5, "x": _5, "yali": _5 } }, "4u": _5, "nfshost": _5, "001www": _5, "ddnslive": _5, "myiphost": _5, "blogsyte": _5, "ciscofreak": _5, "damnserver": _5, "ditchyourip": _5, "dnsiskinky": _5, "dynns": _5, "geekgalaxy": _5, "health-carereform": _5, "homesecuritymac": _5, "homesecuritypc": _5, "myactivedirectory": _5, "mysecuritycamera": _5, "net-freaks": _5, "onthewifi": _5, "point2this": _5, "quicksytes": _5, "securitytactics": _5, "serveexchange": _5, "servehumour": _5, "servep2p": _5, "servesarcasm": _5, "stufftoread": _5, "unusualperson": _5, "workisboring": _5, "3utilities": _5, "ddnsking": _5, "myvnc": _5, "servebeer": _5, "servecounterstrike": _5, "serveftp": _5, "servegame": _5, "servehalflife": _5, "servehttp": _5, "serveirc": _5, "servemp3": _5, "servepics": _5, "servequake": _5, "observableusercontent": { "$": 0, "succ": { "static": _5 } }, "operaunite": _5, "skygearapp": _5, "outsystemscloud": _5, "ownprovider": _5, "pgfog": _5, "pagefrontapp": _5, "pagexl": _5, "gotpantheon": _5, "platter-app": _5, "pleskns": _5, "prgmr": { "$": 0, "succ": { "xen": _5 } }, "qualifioapp": _5, "qbuser": _5, "qa2": _5, "dev-myqnapcloud": _5, "alpha-myqnapcloud": _5, "myqnapcloud": _5, "quipelements": _8, "rackmaze": _5, "rhcloud": _5, "render": _17, "onrender": _5, "logoip": _5, "scrysec": _5, "firewall-gateway": _5, "myshopblocks": _5, "shopitsite": _5, "1kapp": _5, "appchizi": _5, "applinzi": _5, "sinaapp": _5, "vipsinaapp": _5, "bounty-full": { "$": 2, "succ": { "alpha": _5, "beta": _5 } }, "stackhero-network": _5, "playstation-cloud": _5, "stdlib": { "$": 0, "succ": { "api": _5 } }, "temp-dns": _5, "dsmynas": _5, "familyds": _5, "thingdustdata": _5, "bloxcms": _5, "townnews-staging": _5, "hk": _5, "wafflecell": _5, "remotewd": _5, "wiardweb": { "$": 0, "succ": { "pages": _5 } }, "xnbay": { "$": 2, "succ": { "u2": _5, "u2-local": _5 } }, "yolasite": _5, "wpenginepowered": _5, "impertrixcdn": _5, "impertrix": _5 } }, "coop": _3, "cr": { "$": 1, "succ": { "ac": _3, "co": _3, "ed": _3, "fi": _3, "go": _3, "or": _3, "sa": _3 } }, "cu": { "$": 1, "succ": { "com": _3, "edu": _3, "org": _3, "net": _3, "gov": _3, "inf": _3 } }, "cv": _6, "cw": { "$": 1, "succ": { "com": _3, "edu": _3, "net": _3, "org": _3 } }, "cx": { "$": 1, "succ": { "gov": _3, "ath": _5, "info": _5 } }, "cy": { "$": 1, "succ": { "ac": _3, "biz": _3, "com": { "$": 1, "succ": { "blogspot": _5, "scaleforce": _18 } }, "ekloges": _3, "gov": _3, "ltd": _3, "name": _3, "net": _3, "org": _3, "parliament": _3, "press": _3, "pro": _3, "tm": _3 } }, "cz": { "$": 1, "succ": { "co": _5, "realm": _5, "e4": _5, "blogspot": _5, "metacentrum": { "$": 0, "succ": { "cloud": _5, "custom": _5 } }, "muni": { "$": 0, "succ": { "cloud": { "$": 0, "succ": { "flt": _5, "usr": _5 } } } } } }, "de": { "$": 1, "succ": { "bplaced": _5, "square7": _5, "com": _5, "cosidns": { "$": 0, "succ": { "dyn": _5 } }, "dynamisches-dns": _5, "dnsupdater": _5, "internet-dns": _5, "l-o-g-i-n": _5, "dnshome": _5, "fuettertdasnetz": _5, "isteingeek": _5, "istmein": _5, "lebtimnetz": _5, "leitungsen": _5, "traeumtgerade": _5, "ddnss": { "$": 2, "succ": { "dyn": _5, "dyndns": _5 } }, "dyndns1": _5, "dyn-ip24": _5, "home-webserver": { "$": 2, "succ": { "dyn": _5 } }, "myhome-server": _5, "goip": _5, "blogspot": _5, "dyn-berlin": _5, "in-berlin": _5, "in-brb": _5, "in-butter": _5, "in-dsl": _5, "in-vpn": _5, "mein-iserv": _5, "schulserver": _5, "test-iserv": _5, "keymachine": _5, "git-repos": _5, "lcube-server": _5, "svn-repos": _5, "barsy": _5, "logoip": _5, "firewall-gateway": _5, "my-gateway": _5, "my-router": _5, "spdns": _5, "speedpartner": { "$": 0, "succ": { "customer": _5 } }, "taifun-dns": _5, "12hp": _5, "2ix": _5, "4lima": _5, "lima-city": _5, "dd-dns": _5, "dray-dns": _5, "draydns": _5, "dyn-vpn": _5, "dynvpn": _5, "mein-vigor": _5, "my-vigor": _5, "my-wan": _5, "syno-ds": _5, "synology-diskstation": _5, "synology-ds": _5, "uberspace": _8, "virtualuser": _5, "virtual-user": _5, "community-pro": _5, "diskussionsbereich": _5 } }, "dj": _3, "dk": { "$": 1, "succ": { "biz": _5, "co": _5, "firm": _5, "reg": _5, "store": _5, "blogspot": _5 } }, "dm": _10, "do": { "$": 1, "succ": { "art": _3, "com": _3, "edu": _3, "gob": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "sld": _3, "web": _3 } }, "dz": { "$": 1, "succ": { "com": _3, "org": _3, "net": _3, "gov": _3, "edu": _3, "asso": _3, "pol": _3, "art": _3 } }, "ec": { "$": 1, "succ": { "com": _3, "info": _3, "net": _3, "fin": _3, "k12": _3, "med": _3, "pro": _3, "org": _3, "edu": _3, "gov": _3, "gob": _3, "mil": _3, "nym": _5 } }, "edu": { "$": 1, "succ": { "rit": { "$": 0, "succ": { "git-pages": _5 } } } }, "ee": { "$": 1, "succ": { "edu": _3, "gov": _3, "riik": _3, "lib": _3, "med": _3, "com": _6, "pri": _3, "aip": _3, "org": _3, "fie": _3 } }, "eg": { "$": 1, "succ": { "com": _6, "edu": _3, "eun": _3, "gov": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "sci": _3 } }, "er": _9, "es": { "$": 1, "succ": { "com": _6, "nom": _3, "org": _3, "gob": _3, "edu": _3 } }, "et": { "$": 1, "succ": { "com": _3, "gov": _3, "org": _3, "edu": _3, "biz": _3, "name": _3, "info": _3, "net": _3 } }, "eu": { "$": 1, "succ": { "mycd": _5, "cloudns": _5, "barsy": _5, "wellbeingzone": _5, "spdns": _5, "transurl": _8, "diskstation": _5 } }, "fi": { "$": 1, "succ": { "aland": _3, "dy": _5, "blogspot": _5, "xn--hkkinen-5wa": _5, "h??kkinen": _5, "iki": _5 } }, "fj": { "$": 1, "succ": { "ac": _3, "biz": _3, "com": _3, "gov": _3, "info": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "pro": _3 } }, "fk": _9, "fm": _3, "fo": _3, "fr": { "$": 1, "succ": { "asso": _3, "com": _3, "gouv": _3, "nom": _3, "prd": _3, "tm": _3, "aeroport": _3, "avocat": _3, "avoues": _3, "cci": _3, "chambagri": _3, "chirurgiens-dentistes": _3, "experts-comptables": _3, "geometre-expert": _3, "greta": _3, "huissier-justice": _3, "medecin": _3, "notaires": _3, "pharmacien": _3, "port": _3, "veterinaire": _3, "en-root": _5, "fbx-os": _5, "fbxos": _5, "freebox-os": _5, "freeboxos": _5, "blogspot": _5, "on-web": _5, "chirurgiens-dentistes-en-france": _5 } }, "ga": _3, "gb": _3, "gd": { "$": 1, "succ": { "nom": _5 } }, "ge": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "org": _3, "mil": _3, "net": _3, "pvt": _3, "nom": _5 } }, "gf": _3, "gg": { "$": 1, "succ": { "co": _3, "net": _3, "org": _3, "kaas": _5, "cya": _5, "panel": { "$": 2, "succ": { "daemon": _5 } } } }, "gh": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "org": _3, "mil": _3 } }, "gi": { "$": 1, "succ": { "com": _3, "ltd": _3, "gov": _3, "mod": _3, "edu": _3, "org": _3 } }, "gl": { "$": 1, "succ": { "co": _3, "com": _3, "edu": _3, "net": _3, "org": _3, "biz": _5, "nom": _5, "xx": _5 } }, "gm": _3, "gn": { "$": 1, "succ": { "ac": _3, "com": _3, "edu": _3, "gov": _3, "org": _3, "net": _3 } }, "gov": _3, "gp": { "$": 1, "succ": { "com": _3, "net": _3, "mobi": _3, "edu": _3, "org": _3, "asso": _3, "app": _5 } }, "gq": _3, "gr": { "$": 1, "succ": { "com": _3, "edu": _3, "net": _3, "org": _3, "gov": _3, "blogspot": _5, "nym": _5 } }, "gs": _3, "gt": { "$": 1, "succ": { "com": _3, "edu": _3, "gob": _3, "ind": _3, "mil": _3, "net": _3, "org": _3, "nom": _5, "blog": _5, "de": _5, "to": _5 } }, "gu": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "guam": _3, "info": _3, "net": _3, "org": _3, "web": _3 } }, "gw": _3, "gy": { "$": 1, "succ": { "co": _3, "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "nym": _5, "be": _5 } }, "hk": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "idv": _3, "net": _3, "org": _3, "xn--55qx5d": _3, "??????": _3, "xn--wcvs22d": _3, "??????": _3, "xn--lcvr32d": _3, "??????": _3, "xn--mxtq1m": _3, "??????": _3, "xn--gmqw5a": _3, "??????": _3, "xn--ciqpn": _3, "??????": _3, "xn--gmq050i": _3, "??????": _3, "xn--zf0avx": _3, "??????": _3, "xn--io0a7i": _3, "??????": _3, "xn--mk0axi": _3, "??????": _3, "xn--od0alg": _3, "??????": _3, "xn--od0aq3b": _3, "??????": _3, "xn--tn0ag": _3, "??????": _3, "xn--uc0atv": _3, "??????": _3, "xn--uc0ay4a": _3, "??????": _3, "blogspot": _5, "nym": _5, "ltd": _5, "inc": _5 } }, "hm": _3, "hn": { "$": 1, "succ": { "com": _3, "edu": _3, "org": _3, "net": _3, "mil": _3, "gob": _3, "nom": _5, "cc": _5 } }, "hr": { "$": 1, "succ": { "iz": _3, "from": _3, "name": _3, "com": _3, "blogspot": _5, "free": _5 } }, "ht": { "$": 1, "succ": { "com": _3, "shop": _3, "firm": _3, "info": _3, "adult": _3, "net": _3, "pro": _3, "org": _3, "med": _3, "art": _3, "coop": _3, "pol": _3, "asso": _3, "edu": _3, "rel": _3, "gouv": _3, "perso": _3 } }, "hu": { "$": 1, "succ": { "2000": _3, "co": _3, "info": _3, "org": _3, "priv": _3, "sport": _3, "tm": _3, "agrar": _3, "bolt": _3, "casino": _3, "city": _3, "erotica": _3, "erotika": _3, "film": _3, "forum": _3, "games": _3, "hotel": _3, "ingatlan": _3, "jogasz": _3, "konyvelo": _3, "lakas": _3, "media": _3, "news": _3, "reklam": _3, "sex": _3, "shop": _3, "suli": _3, "szex": _3, "tozsde": _3, "utazas": _3, "video": _3, "blogspot": _5 } }, "id": { "$": 1, "succ": { "ac": _3, "biz": _3, "co": _6, "desa": _3, "go": _3, "mil": _3, "my": _3, "net": _3, "or": _3, "ponpes": _3, "sch": _3, "web": _3 } }, "ie": _21, "il": { "$": 1, "succ": { "ac": _3, "co": _6, "gov": _3, "idf": _3, "k12": _3, "muni": _3, "net": _3, "org": _3 } }, "im": { "$": 1, "succ": { "ac": _3, "co": { "$": 1, "succ": { "ltd": _3, "plc": _3 } }, "com": _3, "net": _3, "org": _3, "tt": _3, "tv": _3, "ro": _5, "nom": _5 } }, "in": { "$": 1, "succ": { "co": _3, "firm": _3, "net": _3, "org": _3, "gen": _3, "ind": _3, "nic": _3, "ac": _3, "edu": _3, "res": _3, "gov": _3, "mil": _3, "cloudns": _5, "blogspot": _5, "barsy": _5 } }, "info": { "$": 1, "succ": { "cloudns": _5, "dynamic-dns": _5, "dyndns": _5, "barrel-of-knowledge": _5, "barrell-of-knowledge": _5, "for-our": _5, "groks-the": _5, "groks-this": _5, "here-for-more": _5, "knowsitall": _5, "selfip": _5, "webhop": _5, "barsy": _5, "mayfirst": _5, "forumz": _5, "nsupdate": _5, "dvrcam": _5, "ilovecollege": _5, "no-ip": _5, "dnsupdate": _5, "v-info": _5 } }, "int": { "$": 1, "succ": { "eu": _3 } }, "io": { "$": 1, "succ": { "2038": _5, "com": _3, "apigee": _5, "b-data": _5, "backplaneapp": _5, "banzaicloud": { "$": 0, "succ": { "app": _5, "backyards": _8 } }, "boxfuse": _5, "browsersafetymark": _5, "bigv": { "$": 0, "succ": { "uk0": _5 } }, "cleverapps": _5, "dappnode": { "$": 0, "succ": { "dyndns": _5 } }, "dedyn": _5, "drud": _5, "definima": _5, "enonic": { "$": 2, "succ": { "customer": _5 } }, "shw": _5, "github": _5, "gitlab": _5, "lolipop": _5, "hasura-app": _5, "hostyhosting": _5, "moonscale": _8, "jele": _5, "loginline": _5, "barsy": _5, "azurecontainer": _8, "ngrok": _5, "nodeart": { "$": 0, "succ": { "stage": _5 } }, "nodum": _5, "nid": _5, "pantheonsite": _5, "dyn53": _5, "protonet": _5, "qcx": { "$": 2, "succ": { "sys": _8 } }, "vaporcloud": _5, "vbrplsbx": { "$": 0, "succ": { "g": _5 } }, "on-k3s": _8, "on-rio": _8, "readthedocs": _5, "resindevice": _5, "resinstaging": { "$": 0, "succ": { "devices": _5 } }, "hzc": _5, "sandcats": _5, "shiftedit": _5, "mo-siemens": _5, "lair": _16, "stolos": _8, "spacekit": _5, "utwente": _5, "applicationcloud": _5, "scapp": _5, "s5y": _8, "telebit": _5, "thingdust": { "$": 0, "succ": { "dev": _22, "disrec": _22, "prod": _22, "testing": _22 } }, "wedeploy": _5, "basicserver": _5, "virtualserver": _5 } }, "iq": _4, "ir": { "$": 1, "succ": { "ac": _3, "co": _3, "gov": _3, "id": _3, "net": _3, "org": _3, "sch": _3, "xn--mgba3a4f16a": _3, "??????????": _3, "xn--mgba3a4fra": _3, "??????????": _3 } }, "is": { "$": 1, "succ": { "net": _3, "com": _3, "edu": _3, "gov": _3, "org": _3, "int": _3, "cupcake": _5, "blogspot": _5 } }, "it": { "$": 1, "succ": { "gov": _3, "edu": _3, "abr": _3, "abruzzo": _3, "aosta-valley": _3, "aostavalley": _3, "bas": _3, "basilicata": _3, "cal": _3, "calabria": _3, "cam": _3, "campania": _3, "emilia-romagna": _3, "emiliaromagna": _3, "emr": _3, "friuli-v-giulia": _3, "friuli-ve-giulia": _3, "friuli-vegiulia": _3, "friuli-venezia-giulia": _3, "friuli-veneziagiulia": _3, "friuli-vgiulia": _3, "friuliv-giulia": _3, "friulive-giulia": _3, "friulivegiulia": _3, "friulivenezia-giulia": _3, "friuliveneziagiulia": _3, "friulivgiulia": _3, "fvg": _3, "laz": _3, "lazio": _3, "lig": _3, "liguria": _3, "lom": _3, "lombardia": _3, "lombardy": _3, "lucania": _3, "mar": _3, "marche": _3, "mol": _3, "molise": _3, "piedmont": _3, "piemonte": _3, "pmn": _3, "pug": _3, "puglia": _3, "sar": _3, "sardegna": _3, "sardinia": _3, "sic": _3, "sicilia": _3, "sicily": _3, "taa": _3, "tos": _3, "toscana": _3, "trentin-sud-tirol": _3, "xn--trentin-sd-tirol-rzb": _3, "trentin-s??d-tirol": _3, "trentin-sudtirol": _3, "xn--trentin-sdtirol-7vb": _3, "trentin-s??dtirol": _3, "trentin-sued-tirol": _3, "trentin-suedtirol": _3, "trentino-a-adige": _3, "trentino-aadige": _3, "trentino-alto-adige": _3, "trentino-altoadige": _3, "trentino-s-tirol": _3, "trentino-stirol": _3, "trentino-sud-tirol": _3, "xn--trentino-sd-tirol-c3b": _3, "trentino-s??d-tirol": _3, "trentino-sudtirol": _3, "xn--trentino-sdtirol-szb": _3, "trentino-s??dtirol": _3, "trentino-sued-tirol": _3, "trentino-suedtirol": _3, "trentino": _3, "trentinoa-adige": _3, "trentinoaadige": _3, "trentinoalto-adige": _3, "trentinoaltoadige": _3, "trentinos-tirol": _3, "trentinostirol": _3, "trentinosud-tirol": _3, "xn--trentinosd-tirol-rzb": _3, "trentinos??d-tirol": _3, "trentinosudtirol": _3, "xn--trentinosdtirol-7vb": _3, "trentinos??dtirol": _3, "trentinosued-tirol": _3, "trentinosuedtirol": _3, "trentinsud-tirol": _3, "xn--trentinsd-tirol-6vb": _3, "trentins??d-tirol": _3, "trentinsudtirol": _3, "xn--trentinsdtirol-nsb": _3, "trentins??dtirol": _3, "trentinsued-tirol": _3, "trentinsuedtirol": _3, "tuscany": _3, "umb": _3, "umbria": _3, "val-d-aosta": _3, "val-daosta": _3, "vald-aosta": _3, "valdaosta": _3, "valle-aosta": _3, "valle-d-aosta": _3, "valle-daosta": _3, "valleaosta": _3, "valled-aosta": _3, "valledaosta": _3, "vallee-aoste": _3, "xn--valle-aoste-ebb": _3, "vall??e-aoste": _3, "vallee-d-aoste": _3, "xn--valle-d-aoste-ehb": _3, "vall??e-d-aoste": _3, "valleeaoste": _3, "xn--valleaoste-e7a": _3, "vall??eaoste": _3, "valleedaoste": _3, "xn--valledaoste-ebb": _3, "vall??edaoste": _3, "vao": _3, "vda": _3, "ven": _3, "veneto": _3, "ag": _3, "agrigento": _3, "al": _3, "alessandria": _3, "alto-adige": _3, "altoadige": _3, "an": _3, "ancona": _3, "andria-barletta-trani": _3, "andria-trani-barletta": _3, "andriabarlettatrani": _3, "andriatranibarletta": _3, "ao": _3, "aosta": _3, "aoste": _3, "ap": _3, "aq": _3, "aquila": _3, "ar": _3, "arezzo": _3, "ascoli-piceno": _3, "ascolipiceno": _3, "asti": _3, "at": _3, "av": _3, "avellino": _3, "ba": _3, "balsan-sudtirol": _3, "xn--balsan-sdtirol-nsb": _3, "balsan-s??dtirol": _3, "balsan-suedtirol": _3, "balsan": _3, "bari": _3, "barletta-trani-andria": _3, "barlettatraniandria": _3, "belluno": _3, "benevento": _3, "bergamo": _3, "bg": _3, "bi": _3, "biella": _3, "bl": _3, "bn": _3, "bo": _3, "bologna": _3, "bolzano-altoadige": _3, "bolzano": _3, "bozen-sudtirol": _3, "xn--bozen-sdtirol-2ob": _3, "bozen-s??dtirol": _3, "bozen-suedtirol": _3, "bozen": _3, "br": _3, "brescia": _3, "brindisi": _3, "bs": _3, "bt": _3, "bulsan-sudtirol": _3, "xn--bulsan-sdtirol-nsb": _3, "bulsan-s??dtirol": _3, "bulsan-suedtirol": _3, "bulsan": _3, "bz": _3, "ca": _3, "cagliari": _3, "caltanissetta": _3, "campidano-medio": _3, "campidanomedio": _3, "campobasso": _3, "carbonia-iglesias": _3, "carboniaiglesias": _3, "carrara-massa": _3, "carraramassa": _3, "caserta": _3, "catania": _3, "catanzaro": _3, "cb": _3, "ce": _3, "cesena-forli": _3, "xn--cesena-forl-mcb": _3, "cesena-forl??": _3, "cesenaforli": _3, "xn--cesenaforl-i8a": _3, "cesenaforl??": _3, "ch": _3, "chieti": _3, "ci": _3, "cl": _3, "cn": _3, "co": _3, "como": _3, "cosenza": _3, "cr": _3, "cremona": _3, "crotone": _3, "cs": _3, "ct": _3, "cuneo": _3, "cz": _3, "dell-ogliastra": _3, "dellogliastra": _3, "en": _3, "enna": _3, "fc": _3, "fe": _3, "fermo": _3, "ferrara": _3, "fg": _3, "fi": _3, "firenze": _3, "florence": _3, "fm": _3, "foggia": _3, "forli-cesena": _3, "xn--forl-cesena-fcb": _3, "forl??-cesena": _3, "forlicesena": _3, "xn--forlcesena-c8a": _3, "forl??cesena": _3, "fr": _3, "frosinone": _3, "ge": _3, "genoa": _3, "genova": _3, "go": _3, "gorizia": _3, "gr": _3, "grosseto": _3, "iglesias-carbonia": _3, "iglesiascarbonia": _3, "im": _3, "imperia": _3, "is": _3, "isernia": _3, "kr": _3, "la-spezia": _3, "laquila": _3, "laspezia": _3, "latina": _3, "lc": _3, "le": _3, "lecce": _3, "lecco": _3, "li": _3, "livorno": _3, "lo": _3, "lodi": _3, "lt": _3, "lu": _3, "lucca": _3, "macerata": _3, "mantova": _3, "massa-carrara": _3, "massacarrara": _3, "matera": _3, "mb": _3, "mc": _3, "me": _3, "medio-campidano": _3, "mediocampidano": _3, "messina": _3, "mi": _3, "milan": _3, "milano": _3, "mn": _3, "mo": _3, "modena": _3, "monza-brianza": _3, "monza-e-della-brianza": _3, "monza": _3, "monzabrianza": _3, "monzaebrianza": _3, "monzaedellabrianza": _3, "ms": _3, "mt": _3, "na": _3, "naples": _3, "napoli": _3, "no": _3, "novara": _3, "nu": _3, "nuoro": _3, "og": _3, "ogliastra": _3, "olbia-tempio": _3, "olbiatempio": _3, "or": _3, "oristano": _3, "ot": _3, "pa": _3, "padova": _3, "padua": _3, "palermo": _3, "parma": _3, "pavia": _3, "pc": _3, "pd": _3, "pe": _3, "perugia": _3, "pesaro-urbino": _3, "pesarourbino": _3, "pescara": _3, "pg": _3, "pi": _3, "piacenza": _3, "pisa": _3, "pistoia": _3, "pn": _3, "po": _3, "pordenone": _3, "potenza": _3, "pr": _3, "prato": _3, "pt": _3, "pu": _3, "pv": _3, "pz": _3, "ra": _3, "ragusa": _3, "ravenna": _3, "rc": _3, "re": _3, "reggio-calabria": _3, "reggio-emilia": _3, "reggiocalabria": _3, "reggioemilia": _3, "rg": _3, "ri": _3, "rieti": _3, "rimini": _3, "rm": _3, "rn": _3, "ro": _3, "roma": _3, "rome": _3, "rovigo": _3, "sa": _3, "salerno": _3, "sassari": _3, "savona": _3, "si": _3, "siena": _3, "siracusa": _3, "so": _3, "sondrio": _3, "sp": _3, "sr": _3, "ss": _3, "suedtirol": _3, "xn--sdtirol-n2a": _3, "s??dtirol": _3, "sv": _3, "ta": _3, "taranto": _3, "te": _3, "tempio-olbia": _3, "tempioolbia": _3, "teramo": _3, "terni": _3, "tn": _3, "to": _3, "torino": _3, "tp": _3, "tr": _3, "trani-andria-barletta": _3, "trani-barletta-andria": _3, "traniandriabarletta": _3, "tranibarlettaandria": _3, "trapani": _3, "trento": _3, "treviso": _3, "trieste": _3, "ts": _3, "turin": _3, "tv": _3, "ud": _3, "udine": _3, "urbino-pesaro": _3, "urbinopesaro": _3, "va": _3, "varese": _3, "vb": _3, "vc": _3, "ve": _3, "venezia": _3, "venice": _3, "verbania": _3, "vercelli": _3, "verona": _3, "vi": _3, "vibo-valentia": _3, "vibovalentia": _3, "vicenza": _3, "viterbo": _3, "vr": _3, "vs": _3, "vt": _3, "vv": _3, "blogspot": _5, "16-b": _5, "32-b": _5, "64-b": _5, "syncloud": _5 } }, "je": { "$": 1, "succ": { "co": _3, "net": _3, "org": _3 } }, "jm": _9, "jo": { "$": 1, "succ": { "com": _3, "org": _3, "net": _3, "edu": _3, "sch": _3, "gov": _3, "mil": _3, "name": _3 } }, "jobs": _3, "jp": { "$": 1, "succ": { "ac": _3, "ad": _3, "co": _3, "ed": _3, "go": _3, "gr": _3, "lg": _3, "ne": { "$": 1, "succ": { "aseinet": _19, "gehirn": _5 } }, "or": _3, "aichi": { "$": 1, "succ": { "aisai": _3, "ama": _3, "anjo": _3, "asuke": _3, "chiryu": _3, "chita": _3, "fuso": _3, "gamagori": _3, "handa": _3, "hazu": _3, "hekinan": _3, "higashiura": _3, "ichinomiya": _3, "inazawa": _3, "inuyama": _3, "isshiki": _3, "iwakura": _3, "kanie": _3, "kariya": _3, "kasugai": _3, "kira": _3, "kiyosu": _3, "komaki": _3, "konan": _3, "kota": _3, "mihama": _3, "miyoshi": _3, "nishio": _3, "nisshin": _3, "obu": _3, "oguchi": _3, "oharu": _3, "okazaki": _3, "owariasahi": _3, "seto": _3, "shikatsu": _3, "shinshiro": _3, "shitara": _3, "tahara": _3, "takahama": _3, "tobishima": _3, "toei": _3, "togo": _3, "tokai": _3, "tokoname": _3, "toyoake": _3, "toyohashi": _3, "toyokawa": _3, "toyone": _3, "toyota": _3, "tsushima": _3, "yatomi": _3 } }, "akita": { "$": 1, "succ": { "akita": _3, "daisen": _3, "fujisato": _3, "gojome": _3, "hachirogata": _3, "happou": _3, "higashinaruse": _3, "honjo": _3, "honjyo": _3, "ikawa": _3, "kamikoani": _3, "kamioka": _3, "katagami": _3, "kazuno": _3, "kitaakita": _3, "kosaka": _3, "kyowa": _3, "misato": _3, "mitane": _3, "moriyoshi": _3, "nikaho": _3, "noshiro": _3, "odate": _3, "oga": _3, "ogata": _3, "semboku": _3, "yokote": _3, "yurihonjo": _3 } }, "aomori": { "$": 1, "succ": { "aomori": _3, "gonohe": _3, "hachinohe": _3, "hashikami": _3, "hiranai": _3, "hirosaki": _3, "itayanagi": _3, "kuroishi": _3, "misawa": _3, "mutsu": _3, "nakadomari": _3, "noheji": _3, "oirase": _3, "owani": _3, "rokunohe": _3, "sannohe": _3, "shichinohe": _3, "shingo": _3, "takko": _3, "towada": _3, "tsugaru": _3, "tsuruta": _3 } }, "chiba": { "$": 1, "succ": { "abiko": _3, "asahi": _3, "chonan": _3, "chosei": _3, "choshi": _3, "chuo": _3, "funabashi": _3, "futtsu": _3, "hanamigawa": _3, "ichihara": _3, "ichikawa": _3, "ichinomiya": _3, "inzai": _3, "isumi": _3, "kamagaya": _3, "kamogawa": _3, "kashiwa": _3, "katori": _3, "katsuura": _3, "kimitsu": _3, "kisarazu": _3, "kozaki": _3, "kujukuri": _3, "kyonan": _3, "matsudo": _3, "midori": _3, "mihama": _3, "minamiboso": _3, "mobara": _3, "mutsuzawa": _3, "nagara": _3, "nagareyama": _3, "narashino": _3, "narita": _3, "noda": _3, "oamishirasato": _3, "omigawa": _3, "onjuku": _3, "otaki": _3, "sakae": _3, "sakura": _3, "shimofusa": _3, "shirako": _3, "shiroi": _3, "shisui": _3, "sodegaura": _3, "sosa": _3, "tako": _3, "tateyama": _3, "togane": _3, "tohnosho": _3, "tomisato": _3, "urayasu": _3, "yachimata": _3, "yachiyo": _3, "yokaichiba": _3, "yokoshibahikari": _3, "yotsukaido": _3 } }, "ehime": { "$": 1, "succ": { "ainan": _3, "honai": _3, "ikata": _3, "imabari": _3, "iyo": _3, "kamijima": _3, "kihoku": _3, "kumakogen": _3, "masaki": _3, "matsuno": _3, "matsuyama": _3, "namikata": _3, "niihama": _3, "ozu": _3, "saijo": _3, "seiyo": _3, "shikokuchuo": _3, "tobe": _3, "toon": _3, "uchiko": _3, "uwajima": _3, "yawatahama": _3 } }, "fukui": { "$": 1, "succ": { "echizen": _3, "eiheiji": _3, "fukui": _3, "ikeda": _3, "katsuyama": _3, "mihama": _3, "minamiechizen": _3, "obama": _3, "ohi": _3, "ono": _3, "sabae": _3, "sakai": _3, "takahama": _3, "tsuruga": _3, "wakasa": _3 } }, "fukuoka": { "$": 1, "succ": { "ashiya": _3, "buzen": _3, "chikugo": _3, "chikuho": _3, "chikujo": _3, "chikushino": _3, "chikuzen": _3, "chuo": _3, "dazaifu": _3, "fukuchi": _3, "hakata": _3, "higashi": _3, "hirokawa": _3, "hisayama": _3, "iizuka": _3, "inatsuki": _3, "kaho": _3, "kasuga": _3, "kasuya": _3, "kawara": _3, "keisen": _3, "koga": _3, "kurate": _3, "kurogi": _3, "kurume": _3, "minami": _3, "miyako": _3, "miyama": _3, "miyawaka": _3, "mizumaki": _3, "munakata": _3, "nakagawa": _3, "nakama": _3, "nishi": _3, "nogata": _3, "ogori": _3, "okagaki": _3, "okawa": _3, "oki": _3, "omuta": _3, "onga": _3, "onojo": _3, "oto": _3, "saigawa": _3, "sasaguri": _3, "shingu": _3, "shinyoshitomi": _3, "shonai": _3, "soeda": _3, "sue": _3, "tachiarai": _3, "tagawa": _3, "takata": _3, "toho": _3, "toyotsu": _3, "tsuiki": _3, "ukiha": _3, "umi": _3, "usui": _3, "yamada": _3, "yame": _3, "yanagawa": _3, "yukuhashi": _3 } }, "fukushima": { "$": 1, "succ": { "aizubange": _3, "aizumisato": _3, "aizuwakamatsu": _3, "asakawa": _3, "bandai": _3, "date": _3, "fukushima": _3, "furudono": _3, "futaba": _3, "hanawa": _3, "higashi": _3, "hirata": _3, "hirono": _3, "iitate": _3, "inawashiro": _3, "ishikawa": _3, "iwaki": _3, "izumizaki": _3, "kagamiishi": _3, "kaneyama": _3, "kawamata": _3, "kitakata": _3, "kitashiobara": _3, "koori": _3, "koriyama": _3, "kunimi": _3, "miharu": _3, "mishima": _3, "namie": _3, "nango": _3, "nishiaizu": _3, "nishigo": _3, "okuma": _3, "omotego": _3, "ono": _3, "otama": _3, "samegawa": _3, "shimogo": _3, "shirakawa": _3, "showa": _3, "soma": _3, "sukagawa": _3, "taishin": _3, "tamakawa": _3, "tanagura": _3, "tenei": _3, "yabuki": _3, "yamato": _3, "yamatsuri": _3, "yanaizu": _3, "yugawa": _3 } }, "gifu": { "$": 1, "succ": { "anpachi": _3, "ena": _3, "gifu": _3, "ginan": _3, "godo": _3, "gujo": _3, "hashima": _3, "hichiso": _3, "hida": _3, "higashishirakawa": _3, "ibigawa": _3, "ikeda": _3, "kakamigahara": _3, "kani": _3, "kasahara": _3, "kasamatsu": _3, "kawaue": _3, "kitagata": _3, "mino": _3, "minokamo": _3, "mitake": _3, "mizunami": _3, "motosu": _3, "nakatsugawa": _3, "ogaki": _3, "sakahogi": _3, "seki": _3, "sekigahara": _3, "shirakawa": _3, "tajimi": _3, "takayama": _3, "tarui": _3, "toki": _3, "tomika": _3, "wanouchi": _3, "yamagata": _3, "yaotsu": _3, "yoro": _3 } }, "gunma": { "$": 1, "succ": { "annaka": _3, "chiyoda": _3, "fujioka": _3, "higashiagatsuma": _3, "isesaki": _3, "itakura": _3, "kanna": _3, "kanra": _3, "katashina": _3, "kawaba": _3, "kiryu": _3, "kusatsu": _3, "maebashi": _3, "meiwa": _3, "midori": _3, "minakami": _3, "naganohara": _3, "nakanojo": _3, "nanmoku": _3, "numata": _3, "oizumi": _3, "ora": _3, "ota": _3, "shibukawa": _3, "shimonita": _3, "shinto": _3, "showa": _3, "takasaki": _3, "takayama": _3, "tamamura": _3, "tatebayashi": _3, "tomioka": _3, "tsukiyono": _3, "tsumagoi": _3, "ueno": _3, "yoshioka": _3 } }, "hiroshima": { "$": 1, "succ": { "asaminami": _3, "daiwa": _3, "etajima": _3, "fuchu": _3, "fukuyama": _3, "hatsukaichi": _3, "higashihiroshima": _3, "hongo": _3, "jinsekikogen": _3, "kaita": _3, "kui": _3, "kumano": _3, "kure": _3, "mihara": _3, "miyoshi": _3, "naka": _3, "onomichi": _3, "osakikamijima": _3, "otake": _3, "saka": _3, "sera": _3, "seranishi": _3, "shinichi": _3, "shobara": _3, "takehara": _3 } }, "hokkaido": { "$": 1, "succ": { "abashiri": _3, "abira": _3, "aibetsu": _3, "akabira": _3, "akkeshi": _3, "asahikawa": _3, "ashibetsu": _3, "ashoro": _3, "assabu": _3, "atsuma": _3, "bibai": _3, "biei": _3, "bifuka": _3, "bihoro": _3, "biratori": _3, "chippubetsu": _3, "chitose": _3, "date": _3, "ebetsu": _3, "embetsu": _3, "eniwa": _3, "erimo": _3, "esan": _3, "esashi": _3, "fukagawa": _3, "fukushima": _3, "furano": _3, "furubira": _3, "haboro": _3, "hakodate": _3, "hamatonbetsu": _3, "hidaka": _3, "higashikagura": _3, "higashikawa": _3, "hiroo": _3, "hokuryu": _3, "hokuto": _3, "honbetsu": _3, "horokanai": _3, "horonobe": _3, "ikeda": _3, "imakane": _3, "ishikari": _3, "iwamizawa": _3, "iwanai": _3, "kamifurano": _3, "kamikawa": _3, "kamishihoro": _3, "kamisunagawa": _3, "kamoenai": _3, "kayabe": _3, "kembuchi": _3, "kikonai": _3, "kimobetsu": _3, "kitahiroshima": _3, "kitami": _3, "kiyosato": _3, "koshimizu": _3, "kunneppu": _3, "kuriyama": _3, "kuromatsunai": _3, "kushiro": _3, "kutchan": _3, "kyowa": _3, "mashike": _3, "matsumae": _3, "mikasa": _3, "minamifurano": _3, "mombetsu": _3, "moseushi": _3, "mukawa": _3, "muroran": _3, "naie": _3, "nakagawa": _3, "nakasatsunai": _3, "nakatombetsu": _3, "nanae": _3, "nanporo": _3, "nayoro": _3, "nemuro": _3, "niikappu": _3, "niki": _3, "nishiokoppe": _3, "noboribetsu": _3, "numata": _3, "obihiro": _3, "obira": _3, "oketo": _3, "okoppe": _3, "otaru": _3, "otobe": _3, "otofuke": _3, "otoineppu": _3, "oumu": _3, "ozora": _3, "pippu": _3, "rankoshi": _3, "rebun": _3, "rikubetsu": _3, "rishiri": _3, "rishirifuji": _3, "saroma": _3, "sarufutsu": _3, "shakotan": _3, "shari": _3, "shibecha": _3, "shibetsu": _3, "shikabe": _3, "shikaoi": _3, "shimamaki": _3, "shimizu": _3, "shimokawa": _3, "shinshinotsu": _3, "shintoku": _3, "shiranuka": _3, "shiraoi": _3, "shiriuchi": _3, "sobetsu": _3, "sunagawa": _3, "taiki": _3, "takasu": _3, "takikawa": _3, "takinoue": _3, "teshikaga": _3, "tobetsu": _3, "tohma": _3, "tomakomai": _3, "tomari": _3, "toya": _3, "toyako": _3, "toyotomi": _3, "toyoura": _3, "tsubetsu": _3, "tsukigata": _3, "urakawa": _3, "urausu": _3, "uryu": _3, "utashinai": _3, "wakkanai": _3, "wassamu": _3, "yakumo": _3, "yoichi": _3 } }, "hyogo": { "$": 1, "succ": { "aioi": _3, "akashi": _3, "ako": _3, "amagasaki": _3, "aogaki": _3, "asago": _3, "ashiya": _3, "awaji": _3, "fukusaki": _3, "goshiki": _3, "harima": _3, "himeji": _3, "ichikawa": _3, "inagawa": _3, "itami": _3, "kakogawa": _3, "kamigori": _3, "kamikawa": _3, "kasai": _3, "kasuga": _3, "kawanishi": _3, "miki": _3, "minamiawaji": _3, "nishinomiya": _3, "nishiwaki": _3, "ono": _3, "sanda": _3, "sannan": _3, "sasayama": _3, "sayo": _3, "shingu": _3, "shinonsen": _3, "shiso": _3, "sumoto": _3, "taishi": _3, "taka": _3, "takarazuka": _3, "takasago": _3, "takino": _3, "tamba": _3, "tatsuno": _3, "toyooka": _3, "yabu": _3, "yashiro": _3, "yoka": _3, "yokawa": _3 } }, "ibaraki": { "$": 1, "succ": { "ami": _3, "asahi": _3, "bando": _3, "chikusei": _3, "daigo": _3, "fujishiro": _3, "hitachi": _3, "hitachinaka": _3, "hitachiomiya": _3, "hitachiota": _3, "ibaraki": _3, "ina": _3, "inashiki": _3, "itako": _3, "iwama": _3, "joso": _3, "kamisu": _3, "kasama": _3, "kashima": _3, "kasumigaura": _3, "koga": _3, "miho": _3, "mito": _3, "moriya": _3, "naka": _3, "namegata": _3, "oarai": _3, "ogawa": _3, "omitama": _3, "ryugasaki": _3, "sakai": _3, "sakuragawa": _3, "shimodate": _3, "shimotsuma": _3, "shirosato": _3, "sowa": _3, "suifu": _3, "takahagi": _3, "tamatsukuri": _3, "tokai": _3, "tomobe": _3, "tone": _3, "toride": _3, "tsuchiura": _3, "tsukuba": _3, "uchihara": _3, "ushiku": _3, "yachiyo": _3, "yamagata": _3, "yawara": _3, "yuki": _3 } }, "ishikawa": { "$": 1, "succ": { "anamizu": _3, "hakui": _3, "hakusan": _3, "kaga": _3, "kahoku": _3, "kanazawa": _3, "kawakita": _3, "komatsu": _3, "nakanoto": _3, "nanao": _3, "nomi": _3, "nonoichi": _3, "noto": _3, "shika": _3, "suzu": _3, "tsubata": _3, "tsurugi": _3, "uchinada": _3, "wajima": _3 } }, "iwate": { "$": 1, "succ": { "fudai": _3, "fujisawa": _3, "hanamaki": _3, "hiraizumi": _3, "hirono": _3, "ichinohe": _3, "ichinoseki": _3, "iwaizumi": _3, "iwate": _3, "joboji": _3, "kamaishi": _3, "kanegasaki": _3, "karumai": _3, "kawai": _3, "kitakami": _3, "kuji": _3, "kunohe": _3, "kuzumaki": _3, "miyako": _3, "mizusawa": _3, "morioka": _3, "ninohe": _3, "noda": _3, "ofunato": _3, "oshu": _3, "otsuchi": _3, "rikuzentakata": _3, "shiwa": _3, "shizukuishi": _3, "sumita": _3, "tanohata": _3, "tono": _3, "yahaba": _3, "yamada": _3 } }, "kagawa": { "$": 1, "succ": { "ayagawa": _3, "higashikagawa": _3, "kanonji": _3, "kotohira": _3, "manno": _3, "marugame": _3, "mitoyo": _3, "naoshima": _3, "sanuki": _3, "tadotsu": _3, "takamatsu": _3, "tonosho": _3, "uchinomi": _3, "utazu": _3, "zentsuji": _3 } }, "kagoshima": { "$": 1, "succ": { "akune": _3, "amami": _3, "hioki": _3, "isa": _3, "isen": _3, "izumi": _3, "kagoshima": _3, "kanoya": _3, "kawanabe": _3, "kinko": _3, "kouyama": _3, "makurazaki": _3, "matsumoto": _3, "minamitane": _3, "nakatane": _3, "nishinoomote": _3, "satsumasendai": _3, "soo": _3, "tarumizu": _3, "yusui": _3 } }, "kanagawa": { "$": 1, "succ": { "aikawa": _3, "atsugi": _3, "ayase": _3, "chigasaki": _3, "ebina": _3, "fujisawa": _3, "hadano": _3, "hakone": _3, "hiratsuka": _3, "isehara": _3, "kaisei": _3, "kamakura": _3, "kiyokawa": _3, "matsuda": _3, "minamiashigara": _3, "miura": _3, "nakai": _3, "ninomiya": _3, "odawara": _3, "oi": _3, "oiso": _3, "sagamihara": _3, "samukawa": _3, "tsukui": _3, "yamakita": _3, "yamato": _3, "yokosuka": _3, "yugawara": _3, "zama": _3, "zushi": _3 } }, "kochi": { "$": 1, "succ": { "aki": _3, "geisei": _3, "hidaka": _3, "higashitsuno": _3, "ino": _3, "kagami": _3, "kami": _3, "kitagawa": _3, "kochi": _3, "mihara": _3, "motoyama": _3, "muroto": _3, "nahari": _3, "nakamura": _3, "nankoku": _3, "nishitosa": _3, "niyodogawa": _3, "ochi": _3, "okawa": _3, "otoyo": _3, "otsuki": _3, "sakawa": _3, "sukumo": _3, "susaki": _3, "tosa": _3, "tosashimizu": _3, "toyo": _3, "tsuno": _3, "umaji": _3, "yasuda": _3, "yusuhara": _3 } }, "kumamoto": { "$": 1, "succ": { "amakusa": _3, "arao": _3, "aso": _3, "choyo": _3, "gyokuto": _3, "kamiamakusa": _3, "kikuchi": _3, "kumamoto": _3, "mashiki": _3, "mifune": _3, "minamata": _3, "minamioguni": _3, "nagasu": _3, "nishihara": _3, "oguni": _3, "ozu": _3, "sumoto": _3, "takamori": _3, "uki": _3, "uto": _3, "yamaga": _3, "yamato": _3, "yatsushiro": _3 } }, "kyoto": { "$": 1, "succ": { "ayabe": _3, "fukuchiyama": _3, "higashiyama": _3, "ide": _3, "ine": _3, "joyo": _3, "kameoka": _3, "kamo": _3, "kita": _3, "kizu": _3, "kumiyama": _3, "kyotamba": _3, "kyotanabe": _3, "kyotango": _3, "maizuru": _3, "minami": _3, "minamiyamashiro": _3, "miyazu": _3, "muko": _3, "nagaokakyo": _3, "nakagyo": _3, "nantan": _3, "oyamazaki": _3, "sakyo": _3, "seika": _3, "tanabe": _3, "uji": _3, "ujitawara": _3, "wazuka": _3, "yamashina": _3, "yawata": _3 } }, "mie": { "$": 1, "succ": { "asahi": _3, "inabe": _3, "ise": _3, "kameyama": _3, "kawagoe": _3, "kiho": _3, "kisosaki": _3, "kiwa": _3, "komono": _3, "kumano": _3, "kuwana": _3, "matsusaka": _3, "meiwa": _3, "mihama": _3, "minamiise": _3, "misugi": _3, "miyama": _3, "nabari": _3, "shima": _3, "suzuka": _3, "tado": _3, "taiki": _3, "taki": _3, "tamaki": _3, "toba": _3, "tsu": _3, "udono": _3, "ureshino": _3, "watarai": _3, "yokkaichi": _3 } }, "miyagi": { "$": 1, "succ": { "furukawa": _3, "higashimatsushima": _3, "ishinomaki": _3, "iwanuma": _3, "kakuda": _3, "kami": _3, "kawasaki": _3, "marumori": _3, "matsushima": _3, "minamisanriku": _3, "misato": _3, "murata": _3, "natori": _3, "ogawara": _3, "ohira": _3, "onagawa": _3, "osaki": _3, "rifu": _3, "semine": _3, "shibata": _3, "shichikashuku": _3, "shikama": _3, "shiogama": _3, "shiroishi": _3, "tagajo": _3, "taiwa": _3, "tome": _3, "tomiya": _3, "wakuya": _3, "watari": _3, "yamamoto": _3, "zao": _3 } }, "miyazaki": { "$": 1, "succ": { "aya": _3, "ebino": _3, "gokase": _3, "hyuga": _3, "kadogawa": _3, "kawaminami": _3, "kijo": _3, "kitagawa": _3, "kitakata": _3, "kitaura": _3, "kobayashi": _3, "kunitomi": _3, "kushima": _3, "mimata": _3, "miyakonojo": _3, "miyazaki": _3, "morotsuka": _3, "nichinan": _3, "nishimera": _3, "nobeoka": _3, "saito": _3, "shiiba": _3, "shintomi": _3, "takaharu": _3, "takanabe": _3, "takazaki": _3, "tsuno": _3 } }, "nagano": { "$": 1, "succ": { "achi": _3, "agematsu": _3, "anan": _3, "aoki": _3, "asahi": _3, "azumino": _3, "chikuhoku": _3, "chikuma": _3, "chino": _3, "fujimi": _3, "hakuba": _3, "hara": _3, "hiraya": _3, "iida": _3, "iijima": _3, "iiyama": _3, "iizuna": _3, "ikeda": _3, "ikusaka": _3, "ina": _3, "karuizawa": _3, "kawakami": _3, "kiso": _3, "kisofukushima": _3, "kitaaiki": _3, "komagane": _3, "komoro": _3, "matsukawa": _3, "matsumoto": _3, "miasa": _3, "minamiaiki": _3, "minamimaki": _3, "minamiminowa": _3, "minowa": _3, "miyada": _3, "miyota": _3, "mochizuki": _3, "nagano": _3, "nagawa": _3, "nagiso": _3, "nakagawa": _3, "nakano": _3, "nozawaonsen": _3, "obuse": _3, "ogawa": _3, "okaya": _3, "omachi": _3, "omi": _3, "ookuwa": _3, "ooshika": _3, "otaki": _3, "otari": _3, "sakae": _3, "sakaki": _3, "saku": _3, "sakuho": _3, "shimosuwa": _3, "shinanomachi": _3, "shiojiri": _3, "suwa": _3, "suzaka": _3, "takagi": _3, "takamori": _3, "takayama": _3, "tateshina": _3, "tatsuno": _3, "togakushi": _3, "togura": _3, "tomi": _3, "ueda": _3, "wada": _3, "yamagata": _3, "yamanouchi": _3, "yasaka": _3, "yasuoka": _3 } }, "nagasaki": { "$": 1, "succ": { "chijiwa": _3, "futsu": _3, "goto": _3, "hasami": _3, "hirado": _3, "iki": _3, "isahaya": _3, "kawatana": _3, "kuchinotsu": _3, "matsuura": _3, "nagasaki": _3, "obama": _3, "omura": _3, "oseto": _3, "saikai": _3, "sasebo": _3, "seihi": _3, "shimabara": _3, "shinkamigoto": _3, "togitsu": _3, "tsushima": _3, "unzen": _3 } }, "nara": { "$": 1, "succ": { "ando": _3, "gose": _3, "heguri": _3, "higashiyoshino": _3, "ikaruga": _3, "ikoma": _3, "kamikitayama": _3, "kanmaki": _3, "kashiba": _3, "kashihara": _3, "katsuragi": _3, "kawai": _3, "kawakami": _3, "kawanishi": _3, "koryo": _3, "kurotaki": _3, "mitsue": _3, "miyake": _3, "nara": _3, "nosegawa": _3, "oji": _3, "ouda": _3, "oyodo": _3, "sakurai": _3, "sango": _3, "shimoichi": _3, "shimokitayama": _3, "shinjo": _3, "soni": _3, "takatori": _3, "tawaramoto": _3, "tenkawa": _3, "tenri": _3, "uda": _3, "yamatokoriyama": _3, "yamatotakada": _3, "yamazoe": _3, "yoshino": _3 } }, "niigata": { "$": 1, "succ": { "aga": _3, "agano": _3, "gosen": _3, "itoigawa": _3, "izumozaki": _3, "joetsu": _3, "kamo": _3, "kariwa": _3, "kashiwazaki": _3, "minamiuonuma": _3, "mitsuke": _3, "muika": _3, "murakami": _3, "myoko": _3, "nagaoka": _3, "niigata": _3, "ojiya": _3, "omi": _3, "sado": _3, "sanjo": _3, "seiro": _3, "seirou": _3, "sekikawa": _3, "shibata": _3, "tagami": _3, "tainai": _3, "tochio": _3, "tokamachi": _3, "tsubame": _3, "tsunan": _3, "uonuma": _3, "yahiko": _3, "yoita": _3, "yuzawa": _3 } }, "oita": { "$": 1, "succ": { "beppu": _3, "bungoono": _3, "bungotakada": _3, "hasama": _3, "hiji": _3, "himeshima": _3, "hita": _3, "kamitsue": _3, "kokonoe": _3, "kuju": _3, "kunisaki": _3, "kusu": _3, "oita": _3, "saiki": _3, "taketa": _3, "tsukumi": _3, "usa": _3, "usuki": _3, "yufu": _3 } }, "okayama": { "$": 1, "succ": { "akaiwa": _3, "asakuchi": _3, "bizen": _3, "hayashima": _3, "ibara": _3, "kagamino": _3, "kasaoka": _3, "kibichuo": _3, "kumenan": _3, "kurashiki": _3, "maniwa": _3, "misaki": _3, "nagi": _3, "niimi": _3, "nishiawakura": _3, "okayama": _3, "satosho": _3, "setouchi": _3, "shinjo": _3, "shoo": _3, "soja": _3, "takahashi": _3, "tamano": _3, "tsuyama": _3, "wake": _3, "yakage": _3 } }, "okinawa": { "$": 1, "succ": { "aguni": _3, "ginowan": _3, "ginoza": _3, "gushikami": _3, "haebaru": _3, "higashi": _3, "hirara": _3, "iheya": _3, "ishigaki": _3, "ishikawa": _3, "itoman": _3, "izena": _3, "kadena": _3, "kin": _3, "kitadaito": _3, "kitanakagusuku": _3, "kumejima": _3, "kunigami": _3, "minamidaito": _3, "motobu": _3, "nago": _3, "naha": _3, "nakagusuku": _3, "nakijin": _3, "nanjo": _3, "nishihara": _3, "ogimi": _3, "okinawa": _3, "onna": _3, "shimoji": _3, "taketomi": _3, "tarama": _3, "tokashiki": _3, "tomigusuku": _3, "tonaki": _3, "urasoe": _3, "uruma": _3, "yaese": _3, "yomitan": _3, "yonabaru": _3, "yonaguni": _3, "zamami": _3 } }, "osaka": { "$": 1, "succ": { "abeno": _3, "chihayaakasaka": _3, "chuo": _3, "daito": _3, "fujiidera": _3, "habikino": _3, "hannan": _3, "higashiosaka": _3, "higashisumiyoshi": _3, "higashiyodogawa": _3, "hirakata": _3, "ibaraki": _3, "ikeda": _3, "izumi": _3, "izumiotsu": _3, "izumisano": _3, "kadoma": _3, "kaizuka": _3, "kanan": _3, "kashiwara": _3, "katano": _3, "kawachinagano": _3, "kishiwada": _3, "kita": _3, "kumatori": _3, "matsubara": _3, "minato": _3, "minoh": _3, "misaki": _3, "moriguchi": _3, "neyagawa": _3, "nishi": _3, "nose": _3, "osakasayama": _3, "sakai": _3, "sayama": _3, "sennan": _3, "settsu": _3, "shijonawate": _3, "shimamoto": _3, "suita": _3, "tadaoka": _3, "taishi": _3, "tajiri": _3, "takaishi": _3, "takatsuki": _3, "tondabayashi": _3, "toyonaka": _3, "toyono": _3, "yao": _3 } }, "saga": { "$": 1, "succ": { "ariake": _3, "arita": _3, "fukudomi": _3, "genkai": _3, "hamatama": _3, "hizen": _3, "imari": _3, "kamimine": _3, "kanzaki": _3, "karatsu": _3, "kashima": _3, "kitagata": _3, "kitahata": _3, "kiyama": _3, "kouhoku": _3, "kyuragi": _3, "nishiarita": _3, "ogi": _3, "omachi": _3, "ouchi": _3, "saga": _3, "shiroishi": _3, "taku": _3, "tara": _3, "tosu": _3, "yoshinogari": _3 } }, "saitama": { "$": 1, "succ": { "arakawa": _3, "asaka": _3, "chichibu": _3, "fujimi": _3, "fujimino": _3, "fukaya": _3, "hanno": _3, "hanyu": _3, "hasuda": _3, "hatogaya": _3, "hatoyama": _3, "hidaka": _3, "higashichichibu": _3, "higashimatsuyama": _3, "honjo": _3, "ina": _3, "iruma": _3, "iwatsuki": _3, "kamiizumi": _3, "kamikawa": _3, "kamisato": _3, "kasukabe": _3, "kawagoe": _3, "kawaguchi": _3, "kawajima": _3, "kazo": _3, "kitamoto": _3, "koshigaya": _3, "kounosu": _3, "kuki": _3, "kumagaya": _3, "matsubushi": _3, "minano": _3, "misato": _3, "miyashiro": _3, "miyoshi": _3, "moroyama": _3, "nagatoro": _3, "namegawa": _3, "niiza": _3, "ogano": _3, "ogawa": _3, "ogose": _3, "okegawa": _3, "omiya": _3, "otaki": _3, "ranzan": _3, "ryokami": _3, "saitama": _3, "sakado": _3, "satte": _3, "sayama": _3, "shiki": _3, "shiraoka": _3, "soka": _3, "sugito": _3, "toda": _3, "tokigawa": _3, "tokorozawa": _3, "tsurugashima": _3, "urawa": _3, "warabi": _3, "yashio": _3, "yokoze": _3, "yono": _3, "yorii": _3, "yoshida": _3, "yoshikawa": _3, "yoshimi": _3 } }, "shiga": { "$": 1, "succ": { "aisho": _3, "gamo": _3, "higashiomi": _3, "hikone": _3, "koka": _3, "konan": _3, "kosei": _3, "koto": _3, "kusatsu": _3, "maibara": _3, "moriyama": _3, "nagahama": _3, "nishiazai": _3, "notogawa": _3, "omihachiman": _3, "otsu": _3, "ritto": _3, "ryuoh": _3, "takashima": _3, "takatsuki": _3, "torahime": _3, "toyosato": _3, "yasu": _3 } }, "shimane": { "$": 1, "succ": { "akagi": _3, "ama": _3, "gotsu": _3, "hamada": _3, "higashiizumo": _3, "hikawa": _3, "hikimi": _3, "izumo": _3, "kakinoki": _3, "masuda": _3, "matsue": _3, "misato": _3, "nishinoshima": _3, "ohda": _3, "okinoshima": _3, "okuizumo": _3, "shimane": _3, "tamayu": _3, "tsuwano": _3, "unnan": _3, "yakumo": _3, "yasugi": _3, "yatsuka": _3 } }, "shizuoka": { "$": 1, "succ": { "arai": _3, "atami": _3, "fuji": _3, "fujieda": _3, "fujikawa": _3, "fujinomiya": _3, "fukuroi": _3, "gotemba": _3, "haibara": _3, "hamamatsu": _3, "higashiizu": _3, "ito": _3, "iwata": _3, "izu": _3, "izunokuni": _3, "kakegawa": _3, "kannami": _3, "kawanehon": _3, "kawazu": _3, "kikugawa": _3, "kosai": _3, "makinohara": _3, "matsuzaki": _3, "minamiizu": _3, "mishima": _3, "morimachi": _3, "nishiizu": _3, "numazu": _3, "omaezaki": _3, "shimada": _3, "shimizu": _3, "shimoda": _3, "shizuoka": _3, "susono": _3, "yaizu": _3, "yoshida": _3 } }, "tochigi": { "$": 1, "succ": { "ashikaga": _3, "bato": _3, "haga": _3, "ichikai": _3, "iwafune": _3, "kaminokawa": _3, "kanuma": _3, "karasuyama": _3, "kuroiso": _3, "mashiko": _3, "mibu": _3, "moka": _3, "motegi": _3, "nasu": _3, "nasushiobara": _3, "nikko": _3, "nishikata": _3, "nogi": _3, "ohira": _3, "ohtawara": _3, "oyama": _3, "sakura": _3, "sano": _3, "shimotsuke": _3, "shioya": _3, "takanezawa": _3, "tochigi": _3, "tsuga": _3, "ujiie": _3, "utsunomiya": _3, "yaita": _3 } }, "tokushima": { "$": 1, "succ": { "aizumi": _3, "anan": _3, "ichiba": _3, "itano": _3, "kainan": _3, "komatsushima": _3, "matsushige": _3, "mima": _3, "minami": _3, "miyoshi": _3, "mugi": _3, "nakagawa": _3, "naruto": _3, "sanagochi": _3, "shishikui": _3, "tokushima": _3, "wajiki": _3 } }, "tokyo": { "$": 1, "succ": { "adachi": _3, "akiruno": _3, "akishima": _3, "aogashima": _3, "arakawa": _3, "bunkyo": _3, "chiyoda": _3, "chofu": _3, "chuo": _3, "edogawa": _3, "fuchu": _3, "fussa": _3, "hachijo": _3, "hachioji": _3, "hamura": _3, "higashikurume": _3, "higashimurayama": _3, "higashiyamato": _3, "hino": _3, "hinode": _3, "hinohara": _3, "inagi": _3, "itabashi": _3, "katsushika": _3, "kita": _3, "kiyose": _3, "kodaira": _3, "koganei": _3, "kokubunji": _3, "komae": _3, "koto": _3, "kouzushima": _3, "kunitachi": _3, "machida": _3, "meguro": _3, "minato": _3, "mitaka": _3, "mizuho": _3, "musashimurayama": _3, "musashino": _3, "nakano": _3, "nerima": _3, "ogasawara": _3, "okutama": _3, "ome": _3, "oshima": _3, "ota": _3, "setagaya": _3, "shibuya": _3, "shinagawa": _3, "shinjuku": _3, "suginami": _3, "sumida": _3, "tachikawa": _3, "taito": _3, "tama": _3, "toshima": _3 } }, "tottori": { "$": 1, "succ": { "chizu": _3, "hino": _3, "kawahara": _3, "koge": _3, "kotoura": _3, "misasa": _3, "nanbu": _3, "nichinan": _3, "sakaiminato": _3, "tottori": _3, "wakasa": _3, "yazu": _3, "yonago": _3 } }, "toyama": { "$": 1, "succ": { "asahi": _3, "fuchu": _3, "fukumitsu": _3, "funahashi": _3, "himi": _3, "imizu": _3, "inami": _3, "johana": _3, "kamiichi": _3, "kurobe": _3, "nakaniikawa": _3, "namerikawa": _3, "nanto": _3, "nyuzen": _3, "oyabe": _3, "taira": _3, "takaoka": _3, "tateyama": _3, "toga": _3, "tonami": _3, "toyama": _3, "unazuki": _3, "uozu": _3, "yamada": _3 } }, "wakayama": { "$": 1, "succ": { "arida": _3, "aridagawa": _3, "gobo": _3, "hashimoto": _3, "hidaka": _3, "hirogawa": _3, "inami": _3, "iwade": _3, "kainan": _3, "kamitonda": _3, "katsuragi": _3, "kimino": _3, "kinokawa": _3, "kitayama": _3, "koya": _3, "koza": _3, "kozagawa": _3, "kudoyama": _3, "kushimoto": _3, "mihama": _3, "misato": _3, "nachikatsuura": _3, "shingu": _3, "shirahama": _3, "taiji": _3, "tanabe": _3, "wakayama": _3, "yuasa": _3, "yura": _3 } }, "yamagata": { "$": 1, "succ": { "asahi": _3, "funagata": _3, "higashine": _3, "iide": _3, "kahoku": _3, "kaminoyama": _3, "kaneyama": _3, "kawanishi": _3, "mamurogawa": _3, "mikawa": _3, "murayama": _3, "nagai": _3, "nakayama": _3, "nanyo": _3, "nishikawa": _3, "obanazawa": _3, "oe": _3, "oguni": _3, "ohkura": _3, "oishida": _3, "sagae": _3, "sakata": _3, "sakegawa": _3, "shinjo": _3, "shirataka": _3, "shonai": _3, "takahata": _3, "tendo": _3, "tozawa": _3, "tsuruoka": _3, "yamagata": _3, "yamanobe": _3, "yonezawa": _3, "yuza": _3 } }, "yamaguchi": { "$": 1, "succ": { "abu": _3, "hagi": _3, "hikari": _3, "hofu": _3, "iwakuni": _3, "kudamatsu": _3, "mitou": _3, "nagato": _3, "oshima": _3, "shimonoseki": _3, "shunan": _3, "tabuse": _3, "tokuyama": _3, "toyota": _3, "ube": _3, "yuu": _3 } }, "yamanashi": { "$": 1, "succ": { "chuo": _3, "doshi": _3, "fuefuki": _3, "fujikawa": _3, "fujikawaguchiko": _3, "fujiyoshida": _3, "hayakawa": _3, "hokuto": _3, "ichikawamisato": _3, "kai": _3, "kofu": _3, "koshu": _3, "kosuge": _3, "minami-alps": _3, "minobu": _3, "nakamichi": _3, "nanbu": _3, "narusawa": _3, "nirasaki": _3, "nishikatsura": _3, "oshino": _3, "otsuki": _3, "showa": _3, "tabayama": _3, "tsuru": _3, "uenohara": _3, "yamanakako": _3, "yamanashi": _3 } }, "xn--4pvxs": _3, "??????": _3, "xn--vgu402c": _3, "??????": _3, "xn--c3s14m": _3, "??????": _3, "xn--f6qx53a": _3, "??????": _3, "xn--8pvr4u": _3, "??????": _3, "xn--uist22h": _3, "??????": _3, "xn--djrs72d6uy": _3, "?????????": _3, "xn--mkru45i": _3, "??????": _3, "xn--0trq7p7nn": _3, "?????????": _3, "xn--8ltr62k": _3, "??????": _3, "xn--2m4a15e": _3, "??????": _3, "xn--efvn9s": _3, "??????": _3, "xn--32vp30h": _3, "??????": _3, "xn--4it797k": _3, "??????": _3, "xn--1lqs71d": _3, "??????": _3, "xn--5rtp49c": _3, "??????": _3, "xn--5js045d": _3, "??????": _3, "xn--ehqz56n": _3, "??????": _3, "xn--1lqs03n": _3, "??????": _3, "xn--qqqt11m": _3, "??????": _3, "xn--kbrq7o": _3, "??????": _3, "xn--pssu33l": _3, "??????": _3, "xn--ntsq17g": _3, "??????": _3, "xn--uisz3g": _3, "??????": _3, "xn--6btw5a": _3, "??????": _3, "xn--1ctwo": _3, "??????": _3, "xn--6orx2r": _3, "??????": _3, "xn--rht61e": _3, "??????": _3, "xn--rht27z": _3, "??????": _3, "xn--djty4k": _3, "??????": _3, "xn--nit225k": _3, "??????": _3, "xn--rht3d": _3, "??????": _3, "xn--klty5x": _3, "??????": _3, "xn--kltx9a": _3, "??????": _3, "xn--kltp7d": _3, "??????": _3, "xn--uuwu58a": _3, "??????": _3, "xn--zbx025d": _3, "??????": _3, "xn--ntso0iqx3a": _3, "?????????": _3, "xn--elqq16h": _3, "??????": _3, "xn--4it168d": _3, "??????": _3, "xn--klt787d": _3, "??????": _3, "xn--rny31h": _3, "??????": _3, "xn--7t0a264c": _3, "??????": _3, "xn--5rtq34k": _3, "??????": _3, "xn--k7yn95e": _3, "??????": _3, "xn--tor131o": _3, "??????": _3, "xn--d5qv7z876c": _3, "?????????": _3, "kawasaki": _9, "kitakyushu": _9, "kobe": _9, "nagoya": _9, "sapporo": _9, "sendai": _9, "yokohama": _9, "usercontent": _5, "blogspot": _5 } }, "ke": { "$": 1, "succ": { "ac": _3, "co": _6, "go": _3, "info": _3, "me": _3, "mobi": _3, "ne": _3, "or": _3, "sc": _3, "nom": _5 } }, "kg": { "$": 1, "succ": { "org": _3, "net": _3, "com": _3, "edu": _3, "gov": _3, "mil": _3, "blog": _5, "io": _5, "jp": _5, "tv": _5, "uk": _5, "us": _5 } }, "kh": _9, "ki": _23, "km": { "$": 1, "succ": { "org": _3, "nom": _3, "gov": _3, "prd": _3, "tm": _3, "edu": _3, "mil": _3, "ass": _3, "com": _3, "coop": _3, "asso": _3, "presse": _3, "medecin": _3, "notaires": _3, "pharmaciens": _3, "veterinaire": _3, "gouv": _3 } }, "kn": { "$": 1, "succ": { "net": _3, "org": _3, "edu": _3, "gov": _3 } }, "kp": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "org": _3, "rep": _3, "tra": _3 } }, "kr": { "$": 1, "succ": { "ac": _3, "co": _3, "es": _3, "go": _3, "hs": _3, "kg": _3, "mil": _3, "ms": _3, "ne": _3, "or": _3, "pe": _3, "re": _3, "sc": _3, "busan": _3, "chungbuk": _3, "chungnam": _3, "daegu": _3, "daejeon": _3, "gangwon": _3, "gwangju": _3, "gyeongbuk": _3, "gyeonggi": _3, "gyeongnam": _3, "incheon": _3, "jeju": _3, "jeonbuk": _3, "jeonnam": _3, "seoul": _3, "ulsan": _3, "blogspot": _5 } }, "kw": { "$": 1, "succ": { "com": _3, "edu": _3, "emb": _3, "gov": _3, "ind": _3, "net": _3, "org": _3 } }, "ky": _10, "kz": { "$": 1, "succ": { "org": _3, "edu": _3, "net": _3, "gov": _3, "mil": _3, "com": _3, "nym": _5 } }, "la": { "$": 1, "succ": { "int": _3, "net": _3, "info": _3, "edu": _3, "gov": _3, "per": _3, "com": _3, "org": _3, "bnr": _5, "c": _5, "nym": _5 } }, "lb": _10, "lc": { "$": 1, "succ": { "com": _3, "net": _3, "co": _3, "org": _3, "edu": _3, "gov": _3, "nym": _5, "oy": _5 } }, "li": { "$": 1, "succ": { "blogspot": _5, "caa": _5, "nom": _5, "nym": _5 } }, "lk": { "$": 1, "succ": { "gov": _3, "sch": _3, "net": _3, "int": _3, "com": _3, "org": _3, "edu": _3, "ngo": _3, "soc": _3, "web": _3, "ltd": _3, "assn": _3, "grp": _3, "hotel": _3, "ac": _3 } }, "lr": _10, "ls": { "$": 1, "succ": { "ac": _3, "biz": _3, "co": _3, "edu": _3, "gov": _3, "info": _3, "net": _3, "org": _3, "sc": _3, "de": _5 } }, "lt": _21, "lu": _24, "lv": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "org": _3, "mil": _3, "id": _3, "net": _3, "asn": _3, "conf": _3, "nom": _5 } }, "ly": { "$": 1, "succ": { "com": _3, "net": _3, "gov": _3, "plc": _3, "edu": _3, "sch": _3, "med": _3, "org": _3, "id": _3 } }, "ma": { "$": 1, "succ": { "co": _3, "net": _3, "gov": _3, "org": _3, "ac": _3, "press": _3 } }, "mc": { "$": 1, "succ": { "tm": _3, "asso": _3 } }, "md": { "$": 1, "succ": { "blogspot": _5, "at": _5, "de": _5, "jp": _5, "to": _5 } }, "me": { "$": 1, "succ": { "co": _3, "net": _3, "org": _3, "edu": _3, "ac": _3, "gov": _3, "its": _3, "priv": _3, "c66": _5, "daplie": { "$": 2, "succ": { "localhost": _5 } }, "edgestack": _5, "couk": _5, "ukco": _5, "filegear": _5, "filegear-au": _5, "filegear-de": _5, "filegear-gb": _5, "filegear-ie": _5, "filegear-jp": _5, "filegear-sg": _5, "glitch": _5, "ravendb": _5, "barsy": _5, "nctu": _5, "soundcast": _5, "tcp4": _5, "brasilia": _5, "ddns": _5, "dnsfor": _5, "hopto": _5, "loginto": _5, "noip": _5, "webhop": _5, "nym": _5, "diskstation": _5, "dscloud": _5, "i234": _5, "myds": _5, "synology": _5, "wedeploy": _5, "yombo": _5, "nohost": _5 } }, "mg": { "$": 1, "succ": { "org": _3, "nom": _3, "gov": _3, "prd": _3, "tm": _3, "edu": _3, "mil": _3, "com": _3, "co": _3 } }, "mh": _3, "mil": _3, "mk": { "$": 1, "succ": { "com": _3, "org": _3, "net": _3, "edu": _3, "gov": _3, "inf": _3, "name": _3, "blogspot": _5, "nom": _5 } }, "ml": { "$": 1, "succ": { "com": _3, "edu": _3, "gouv": _3, "gov": _3, "net": _3, "org": _3, "presse": _3 } }, "mm": _9, "mn": { "$": 1, "succ": { "gov": _3, "edu": _3, "org": _3, "nyc": _5, "nym": _5 } }, "mo": _10, "mobi": { "$": 1, "succ": { "barsy": _5, "dscloud": _5 } }, "mp": _3, "mq": _3, "mr": { "$": 1, "succ": { "gov": _3, "blogspot": _5 } }, "ms": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "lab": _5 } }, "mt": { "$": 1, "succ": { "com": _6, "edu": _3, "net": _3, "org": _3 } }, "mu": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "ac": _3, "co": _3, "or": _3 } }, "museum": { "$": 1, "succ": { "academy": _3, "agriculture": _3, "air": _3, "airguard": _3, "alabama": _3, "alaska": _3, "amber": _3, "ambulance": _3, "american": _3, "americana": _3, "americanantiques": _3, "americanart": _3, "amsterdam": _3, "and": _3, "annefrank": _3, "anthro": _3, "anthropology": _3, "antiques": _3, "aquarium": _3, "arboretum": _3, "archaeological": _3, "archaeology": _3, "architecture": _3, "art": _3, "artanddesign": _3, "artcenter": _3, "artdeco": _3, "arteducation": _3, "artgallery": _3, "arts": _3, "artsandcrafts": _3, "asmatart": _3, "assassination": _3, "assisi": _3, "association": _3, "astronomy": _3, "atlanta": _3, "austin": _3, "australia": _3, "automotive": _3, "aviation": _3, "axis": _3, "badajoz": _3, "baghdad": _3, "bahn": _3, "bale": _3, "baltimore": _3, "barcelona": _3, "baseball": _3, "basel": _3, "baths": _3, "bauern": _3, "beauxarts": _3, "beeldengeluid": _3, "bellevue": _3, "bergbau": _3, "berkeley": _3, "berlin": _3, "bern": _3, "bible": _3, "bilbao": _3, "bill": _3, "birdart": _3, "birthplace": _3, "bonn": _3, "boston": _3, "botanical": _3, "botanicalgarden": _3, "botanicgarden": _3, "botany": _3, "brandywinevalley": _3, "brasil": _3, "bristol": _3, "british": _3, "britishcolumbia": _3, "broadcast": _3, "brunel": _3, "brussel": _3, "brussels": _3, "bruxelles": _3, "building": _3, "burghof": _3, "bus": _3, "bushey": _3, "cadaques": _3, "california": _3, "cambridge": _3, "can": _3, "canada": _3, "capebreton": _3, "carrier": _3, "cartoonart": _3, "casadelamoneda": _3, "castle": _3, "castres": _3, "celtic": _3, "center": _3, "chattanooga": _3, "cheltenham": _3, "chesapeakebay": _3, "chicago": _3, "children": _3, "childrens": _3, "childrensgarden": _3, "chiropractic": _3, "chocolate": _3, "christiansburg": _3, "cincinnati": _3, "cinema": _3, "circus": _3, "civilisation": _3, "civilization": _3, "civilwar": _3, "clinton": _3, "clock": _3, "coal": _3, "coastaldefence": _3, "cody": _3, "coldwar": _3, "collection": _3, "colonialwilliamsburg": _3, "coloradoplateau": _3, "columbia": _3, "columbus": _3, "communication": _3, "communications": _3, "community": _3, "computer": _3, "computerhistory": _3, "xn--comunicaes-v6a2o": _3, "comunica????es": _3, "contemporary": _3, "contemporaryart": _3, "convent": _3, "copenhagen": _3, "corporation": _3, "xn--correios-e-telecomunicaes-ghc29a": _3, "correios-e-telecomunica????es": _3, "corvette": _3, "costume": _3, "countryestate": _3, "county": _3, "crafts": _3, "cranbrook": _3, "creation": _3, "cultural": _3, "culturalcenter": _3, "culture": _3, "cyber": _3, "cymru": _3, "dali": _3, "dallas": _3, "database": _3, "ddr": _3, "decorativearts": _3, "delaware": _3, "delmenhorst": _3, "denmark": _3, "depot": _3, "design": _3, "detroit": _3, "dinosaur": _3, "discovery": _3, "dolls": _3, "donostia": _3, "durham": _3, "eastafrica": _3, "eastcoast": _3, "education": _3, "educational": _3, "egyptian": _3, "eisenbahn": _3, "elburg": _3, "elvendrell": _3, "embroidery": _3, "encyclopedic": _3, "england": _3, "entomology": _3, "environment": _3, "environmentalconservation": _3, "epilepsy": _3, "essex": _3, "estate": _3, "ethnology": _3, "exeter": _3, "exhibition": _3, "family": _3, "farm": _3, "farmequipment": _3, "farmers": _3, "farmstead": _3, "field": _3, "figueres": _3, "filatelia": _3, "film": _3, "fineart": _3, "finearts": _3, "finland": _3, "flanders": _3, "florida": _3, "force": _3, "fortmissoula": _3, "fortworth": _3, "foundation": _3, "francaise": _3, "frankfurt": _3, "franziskaner": _3, "freemasonry": _3, "freiburg": _3, "fribourg": _3, "frog": _3, "fundacio": _3, "furniture": _3, "gallery": _3, "garden": _3, "gateway": _3, "geelvinck": _3, "gemological": _3, "geology": _3, "georgia": _3, "giessen": _3, "glas": _3, "glass": _3, "gorge": _3, "grandrapids": _3, "graz": _3, "guernsey": _3, "halloffame": _3, "hamburg": _3, "handson": _3, "harvestcelebration": _3, "hawaii": _3, "health": _3, "heimatunduhren": _3, "hellas": _3, "helsinki": _3, "hembygdsforbund": _3, "heritage": _3, "histoire": _3, "historical": _3, "historicalsociety": _3, "historichouses": _3, "historisch": _3, "historisches": _3, "history": _3, "historyofscience": _3, "horology": _3, "house": _3, "humanities": _3, "illustration": _3, "imageandsound": _3, "indian": _3, "indiana": _3, "indianapolis": _3, "indianmarket": _3, "intelligence": _3, "interactive": _3, "iraq": _3, "iron": _3, "isleofman": _3, "jamison": _3, "jefferson": _3, "jerusalem": _3, "jewelry": _3, "jewish": _3, "jewishart": _3, "jfk": _3, "journalism": _3, "judaica": _3, "judygarland": _3, "juedisches": _3, "juif": _3, "karate": _3, "karikatur": _3, "kids": _3, "koebenhavn": _3, "koeln": _3, "kunst": _3, "kunstsammlung": _3, "kunstunddesign": _3, "labor": _3, "labour": _3, "lajolla": _3, "lancashire": _3, "landes": _3, "lans": _3, "xn--lns-qla": _3, "l??ns": _3, "larsson": _3, "lewismiller": _3, "lincoln": _3, "linz": _3, "living": _3, "livinghistory": _3, "localhistory": _3, "london": _3, "losangeles": _3, "louvre": _3, "loyalist": _3, "lucerne": _3, "luxembourg": _3, "luzern": _3, "mad": _3, "madrid": _3, "mallorca": _3, "manchester": _3, "mansion": _3, "mansions": _3, "manx": _3, "marburg": _3, "maritime": _3, "maritimo": _3, "maryland": _3, "marylhurst": _3, "media": _3, "medical": _3, "medizinhistorisches": _3, "meeres": _3, "memorial": _3, "mesaverde": _3, "michigan": _3, "midatlantic": _3, "military": _3, "mill": _3, "miners": _3, "mining": _3, "minnesota": _3, "missile": _3, "missoula": _3, "modern": _3, "moma": _3, "money": _3, "monmouth": _3, "monticello": _3, "montreal": _3, "moscow": _3, "motorcycle": _3, "muenchen": _3, "muenster": _3, "mulhouse": _3, "muncie": _3, "museet": _3, "museumcenter": _3, "museumvereniging": _3, "music": _3, "national": _3, "nationalfirearms": _3, "nationalheritage": _3, "nativeamerican": _3, "naturalhistory": _3, "naturalhistorymuseum": _3, "naturalsciences": _3, "nature": _3, "naturhistorisches": _3, "natuurwetenschappen": _3, "naumburg": _3, "naval": _3, "nebraska": _3, "neues": _3, "newhampshire": _3, "newjersey": _3, "newmexico": _3, "newport": _3, "newspaper": _3, "newyork": _3, "niepce": _3, "norfolk": _3, "north": _3, "nrw": _3, "nyc": _3, "nyny": _3, "oceanographic": _3, "oceanographique": _3, "omaha": _3, "online": _3, "ontario": _3, "openair": _3, "oregon": _3, "oregontrail": _3, "otago": _3, "oxford": _3, "pacific": _3, "paderborn": _3, "palace": _3, "paleo": _3, "palmsprings": _3, "panama": _3, "paris": _3, "pasadena": _3, "pharmacy": _3, "philadelphia": _3, "philadelphiaarea": _3, "philately": _3, "phoenix": _3, "photography": _3, "pilots": _3, "pittsburgh": _3, "planetarium": _3, "plantation": _3, "plants": _3, "plaza": _3, "portal": _3, "portland": _3, "portlligat": _3, "posts-and-telecommunications": _3, "preservation": _3, "presidio": _3, "press": _3, "project": _3, "public": _3, "pubol": _3, "quebec": _3, "railroad": _3, "railway": _3, "research": _3, "resistance": _3, "riodejaneiro": _3, "rochester": _3, "rockart": _3, "roma": _3, "russia": _3, "saintlouis": _3, "salem": _3, "salvadordali": _3, "salzburg": _3, "sandiego": _3, "sanfrancisco": _3, "santabarbara": _3, "santacruz": _3, "santafe": _3, "saskatchewan": _3, "satx": _3, "savannahga": _3, "schlesisches": _3, "schoenbrunn": _3, "schokoladen": _3, "school": _3, "schweiz": _3, "science": _3, "scienceandhistory": _3, "scienceandindustry": _3, "sciencecenter": _3, "sciencecenters": _3, "science-fiction": _3, "sciencehistory": _3, "sciences": _3, "sciencesnaturelles": _3, "scotland": _3, "seaport": _3, "settlement": _3, "settlers": _3, "shell": _3, "sherbrooke": _3, "sibenik": _3, "silk": _3, "ski": _3, "skole": _3, "society": _3, "sologne": _3, "soundandvision": _3, "southcarolina": _3, "southwest": _3, "space": _3, "spy": _3, "square": _3, "stadt": _3, "stalbans": _3, "starnberg": _3, "state": _3, "stateofdelaware": _3, "station": _3, "steam": _3, "steiermark": _3, "stjohn": _3, "stockholm": _3, "stpetersburg": _3, "stuttgart": _3, "suisse": _3, "surgeonshall": _3, "surrey": _3, "svizzera": _3, "sweden": _3, "sydney": _3, "tank": _3, "tcm": _3, "technology": _3, "telekommunikation": _3, "television": _3, "texas": _3, "textile": _3, "theater": _3, "time": _3, "timekeeping": _3, "topology": _3, "torino": _3, "touch": _3, "town": _3, "transport": _3, "tree": _3, "trolley": _3, "trust": _3, "trustee": _3, "uhren": _3, "ulm": _3, "undersea": _3, "university": _3, "usa": _3, "usantiques": _3, "usarts": _3, "uscountryestate": _3, "usculture": _3, "usdecorativearts": _3, "usgarden": _3, "ushistory": _3, "ushuaia": _3, "uslivinghistory": _3, "utah": _3, "uvic": _3, "valley": _3, "vantaa": _3, "versailles": _3, "viking": _3, "village": _3, "virginia": _3, "virtual": _3, "virtuel": _3, "vlaanderen": _3, "volkenkunde": _3, "wales": _3, "wallonie": _3, "war": _3, "washingtondc": _3, "watchandclock": _3, "watch-and-clock": _3, "western": _3, "westfalen": _3, "whaling": _3, "wildlife": _3, "williamsburg": _3, "windmill": _3, "workshop": _3, "york": _3, "yorkshire": _3, "yosemite": _3, "youth": _3, "zoological": _3, "zoology": _3, "xn--9dbhblg6di": _3, "??????????????": _3, "xn--h1aegh": _3, "????????": _3 } }, "mv": { "$": 1, "succ": { "aero": _3, "biz": _3, "com": _3, "coop": _3, "edu": _3, "gov": _3, "info": _3, "int": _3, "mil": _3, "museum": _3, "name": _3, "net": _3, "org": _3, "pro": _3 } }, "mw": { "$": 1, "succ": { "ac": _3, "biz": _3, "co": _3, "com": _3, "coop": _3, "edu": _3, "gov": _3, "int": _3, "museum": _3, "net": _3, "org": _3 } }, "mx": { "$": 1, "succ": { "com": _3, "org": _3, "gob": _3, "edu": _3, "net": _3, "blogspot": _5, "nym": _5 } }, "my": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "edu": _3, "mil": _3, "name": _3, "blogspot": _5 } }, "mz": { "$": 1, "succ": { "ac": _3, "adv": _3, "co": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3 } }, "na": { "$": 1, "succ": { "info": _3, "pro": _3, "name": _3, "school": _3, "or": _3, "dr": _3, "us": _3, "mx": _3, "ca": _3, "in": _3, "cc": _3, "tv": _3, "ws": _3, "mobi": _3, "co": _3, "com": _3, "org": _3 } }, "name": { "$": 1, "succ": { "her": _27, "his": _27 } }, "nc": { "$": 1, "succ": { "asso": _3, "nom": _3 } }, "ne": _3, "net": { "$": 1, "succ": { "adobeaemcloud": _5, "alwaysdata": _5, "cloudfront": _5, "t3l3p0rt": _5, "myfritz": _5, "blackbaudcdn": _5, "boomla": _5, "bplaced": _5, "square7": _5, "gb": _5, "hu": _5, "jp": _5, "se": _5, "uk": _5, "in": _5, "clic2000": _5, "cloudaccess": _5, "cdn77-ssl": _5, "cdn77": { "$": 0, "succ": { "r": _5 } }, "cloudeity": _5, "feste-ip": _5, "knx-server": _5, "static-access": _5, "cryptonomic": _8, "dattolocal": _5, "mydatto": _5, "debian": _5, "bitbridge": _5, "at-band-camp": _5, "blogdns": _5, "broke-it": _5, "buyshouses": _5, "dnsalias": _5, "dnsdojo": _5, "does-it": _5, "dontexist": _5, "dynalias": _5, "dynathome": _5, "endofinternet": _5, "from-az": _5, "from-co": _5, "from-la": _5, "from-ny": _5, "gets-it": _5, "ham-radio-op": _5, "homeftp": _5, "homeip": _5, "homelinux": _5, "homeunix": _5, "in-the-band": _5, "is-a-chef": _5, "is-a-geek": _5, "isa-geek": _5, "kicks-ass": _5, "office-on-the": _5, "podzone": _5, "scrapper-site": _5, "selfip": _5, "sells-it": _5, "servebbs": _5, "serveftp": _5, "thruhere": _5, "webhop": _5, "definima": _5, "casacam": _5, "dynu": _5, "dynv6": _5, "twmail": _5, "ru": _5, "channelsdvr": { "$": 2, "succ": { "u": _5 } }, "fastlylb": { "$": 2, "succ": { "map": _5 } }, "fastly": { "$": 0, "succ": { "freetls": _5, "map": _5, "prod": { "$": 0, "succ": { "a": _5, "global": _5 } }, "ssl": { "$": 0, "succ": { "a": _5, "b": _5, "global": _5 } } } }, "edgeapp": _5, "flynnhosting": _5, "cloudfunctions": _5, "moonscale": _5, "in-dsl": _5, "in-vpn": _5, "ipifony": _5, "iobb": _5, "cloudjiffy": _5, "elastx": { "$": 0, "succ": { "jls-sto1": _5 } }, "saveincloud": _28, "kinghost": _5, "uni5": _5, "barsy": _5, "memset": _5, "azurewebsites": _5, "azure-mobile": _5, "cloudapp": _5, "dnsup": _5, "hicam": _5, "now-dns": _5, "ownip": _5, "vpndns": _5, "eating-organic": _5, "mydissent": _5, "myeffect": _5, "mymediapc": _5, "mypsx": _5, "mysecuritycamera": _5, "nhlfan": _5, "no-ip": _5, "pgafan": _5, "privatizehealthinsurance": _5, "bounceme": _5, "ddns": _5, "redirectme": _5, "serveblog": _5, "serveminecraft": _5, "sytes": _5, "cloudycluster": _5, "bar0": _5, "bar1": _5, "bar2": _5, "rackmaze": _5, "schokokeks": _5, "firewall-gateway": _5, "seidat": _5, "senseering": _5, "siteleaf": _5, "srcf": { "$": 0, "succ": { "soc": _5, "user": _5 } }, "dsmynas": _5, "familyds": _5, "community-pro": _5, "meinforum": _5, "yandexcloud": { "$": 2, "succ": { "storage": _5, "website": _5 } }, "za": _5 } }, "nf": { "$": 1, "succ": { "com": _3, "net": _3, "per": _3, "rec": _3, "web": _3, "arts": _3, "firm": _3, "info": _3, "other": _3, "store": _3 } }, "ng": { "$": 1, "succ": { "com": _6, "edu": _3, "gov": _3, "i": _3, "mil": _3, "mobi": _3, "name": _3, "net": _3, "org": _3, "sch": _3, "col": _5, "firm": _5, "gen": _5, "ltd": _5, "ngo": _5 } }, "ni": { "$": 1, "succ": { "ac": _3, "biz": _3, "co": _3, "com": _3, "edu": _3, "gob": _3, "in": _3, "info": _3, "int": _3, "mil": _3, "net": _3, "nom": _3, "org": _3, "web": _3 } }, "nl": { "$": 1, "succ": { "amsw": _5, "virtueeldomein": _5, "co": _5, "hosting-cluster": _5, "blogspot": _5, "khplay": _5, "transurl": _8, "cistron": _5, "demon": _5 } }, "no": { "$": 1, "succ": { "fhs": _3, "vgs": _3, "fylkesbibl": _3, "folkebibl": _3, "museum": _3, "idrett": _3, "priv": _3, "mil": _3, "stat": _3, "dep": _3, "kommune": _3, "herad": _3, "aa": _29, "ah": _29, "bu": _29, "fm": _29, "hl": _29, "hm": _29, "jan-mayen": _29, "mr": _29, "nl": _29, "nt": _29, "of": _29, "ol": _29, "oslo": _29, "rl": _29, "sf": _29, "st": _29, "svalbard": _29, "tm": _29, "tr": _29, "va": _29, "vf": _29, "akrehamn": _3, "xn--krehamn-dxa": _3, "??krehamn": _3, "algard": _3, "xn--lgrd-poac": _3, "??lg??rd": _3, "arna": _3, "brumunddal": _3, "bryne": _3, "bronnoysund": _3, "xn--brnnysund-m8ac": _3, "br??nn??ysund": _3, "drobak": _3, "xn--drbak-wua": _3, "dr??bak": _3, "egersund": _3, "fetsund": _3, "floro": _3, "xn--flor-jra": _3, "flor??": _3, "fredrikstad": _3, "hokksund": _3, "honefoss": _3, "xn--hnefoss-q1a": _3, "h??nefoss": _3, "jessheim": _3, "jorpeland": _3, "xn--jrpeland-54a": _3, "j??rpeland": _3, "kirkenes": _3, "kopervik": _3, "krokstadelva": _3, "langevag": _3, "xn--langevg-jxa": _3, "langev??g": _3, "leirvik": _3, "mjondalen": _3, "xn--mjndalen-64a": _3, "mj??ndalen": _3, "mo-i-rana": _3, "mosjoen": _3, "xn--mosjen-eya": _3, "mosj??en": _3, "nesoddtangen": _3, "orkanger": _3, "osoyro": _3, "xn--osyro-wua": _3, "os??yro": _3, "raholt": _3, "xn--rholt-mra": _3, "r??holt": _3, "sandnessjoen": _3, "xn--sandnessjen-ogb": _3, "sandnessj??en": _3, "skedsmokorset": _3, "slattum": _3, "spjelkavik": _3, "stathelle": _3, "stavern": _3, "stjordalshalsen": _3, "xn--stjrdalshalsen-sqb": _3, "stj??rdalshalsen": _3, "tananger": _3, "tranby": _3, "vossevangen": _3, "afjord": _3, "xn--fjord-lra": _3, "??fjord": _3, "agdenes": _3, "al": _3, "xn--l-1fa": _3, "??l": _3, "alesund": _3, "xn--lesund-hua": _3, "??lesund": _3, "alstahaug": _3, "alta": _3, "xn--lt-liac": _3, "??lt??": _3, "alaheadju": _3, "xn--laheadju-7ya": _3, "??laheadju": _3, "alvdal": _3, "amli": _3, "xn--mli-tla": _3, "??mli": _3, "amot": _3, "xn--mot-tla": _3, "??mot": _3, "andebu": _3, "andoy": _3, "xn--andy-ira": _3, "and??y": _3, "andasuolo": _3, "ardal": _3, "xn--rdal-poa": _3, "??rdal": _3, "aremark": _3, "arendal": _3, "xn--s-1fa": _3, "??s": _3, "aseral": _3, "xn--seral-lra": _3, "??seral": _3, "asker": _3, "askim": _3, "askvoll": _3, "askoy": _3, "xn--asky-ira": _3, "ask??y": _3, "asnes": _3, "xn--snes-poa": _3, "??snes": _3, "audnedaln": _3, "aukra": _3, "aure": _3, "aurland": _3, "aurskog-holand": _3, "xn--aurskog-hland-jnb": _3, "aurskog-h??land": _3, "austevoll": _3, "austrheim": _3, "averoy": _3, "xn--avery-yua": _3, "aver??y": _3, "balestrand": _3, "ballangen": _3, "balat": _3, "xn--blt-elab": _3, "b??l??t": _3, "balsfjord": _3, "bahccavuotna": _3, "xn--bhccavuotna-k7a": _3, "b??hccavuotna": _3, "bamble": _3, "bardu": _3, "beardu": _3, "beiarn": _3, "bajddar": _3, "xn--bjddar-pta": _3, "b??jddar": _3, "baidar": _3, "xn--bidr-5nac": _3, "b??id??r": _3, "berg": _3, "bergen": _3, "berlevag": _3, "xn--berlevg-jxa": _3, "berlev??g": _3, "bearalvahki": _3, "xn--bearalvhki-y4a": _3, "bearalv??hki": _3, "bindal": _3, "birkenes": _3, "bjarkoy": _3, "xn--bjarky-fya": _3, "bjark??y": _3, "bjerkreim": _3, "bjugn": _3, "bodo": _3, "xn--bod-2na": _3, "bod??": _3, "badaddja": _3, "xn--bdddj-mrabd": _3, "b??d??ddj??": _3, "budejju": _3, "bokn": _3, "bremanger": _3, "bronnoy": _3, "xn--brnny-wuac": _3, "br??nn??y": _3, "bygland": _3, "bykle": _3, "barum": _3, "xn--brum-voa": _3, "b??rum": _3, "telemark": { "$": 0, "succ": { "bo": _3, "xn--b-5ga": _3, "b??": _3 } }, "nordland": { "$": 0, "succ": { "bo": _3, "xn--b-5ga": _3, "b??": _3, "heroy": _3, "xn--hery-ira": _3, "her??y": _3 } }, "bievat": _3, "xn--bievt-0qa": _3, "biev??t": _3, "bomlo": _3, "xn--bmlo-gra": _3, "b??mlo": _3, "batsfjord": _3, "xn--btsfjord-9za": _3, "b??tsfjord": _3, "bahcavuotna": _3, "xn--bhcavuotna-s4a": _3, "b??hcavuotna": _3, "dovre": _3, "drammen": _3, "drangedal": _3, "dyroy": _3, "xn--dyry-ira": _3, "dyr??y": _3, "donna": _3, "xn--dnna-gra": _3, "d??nna": _3, "eid": _3, "eidfjord": _3, "eidsberg": _3, "eidskog": _3, "eidsvoll": _3, "eigersund": _3, "elverum": _3, "enebakk": _3, "engerdal": _3, "etne": _3, "etnedal": _3, "evenes": _3, "evenassi": _3, "xn--eveni-0qa01ga": _3, "even??????i": _3, "evje-og-hornnes": _3, "farsund": _3, "fauske": _3, "fuossko": _3, "fuoisku": _3, "fedje": _3, "fet": _3, "finnoy": _3, "xn--finny-yua": _3, "finn??y": _3, "fitjar": _3, "fjaler": _3, "fjell": _3, "flakstad": _3, "flatanger": _3, "flekkefjord": _3, "flesberg": _3, "flora": _3, "fla": _3, "xn--fl-zia": _3, "fl??": _3, "folldal": _3, "forsand": _3, "fosnes": _3, "frei": _3, "frogn": _3, "froland": _3, "frosta": _3, "frana": _3, "xn--frna-woa": _3, "fr??na": _3, "froya": _3, "xn--frya-hra": _3, "fr??ya": _3, "fusa": _3, "fyresdal": _3, "forde": _3, "xn--frde-gra": _3, "f??rde": _3, "gamvik": _3, "gangaviika": _3, "xn--ggaviika-8ya47h": _3, "g????gaviika": _3, "gaular": _3, "gausdal": _3, "gildeskal": _3, "xn--gildeskl-g0a": _3, "gildesk??l": _3, "giske": _3, "gjemnes": _3, "gjerdrum": _3, "gjerstad": _3, "gjesdal": _3, "gjovik": _3, "xn--gjvik-wua": _3, "gj??vik": _3, "gloppen": _3, "gol": _3, "gran": _3, "grane": _3, "granvin": _3, "gratangen": _3, "grimstad": _3, "grong": _3, "kraanghke": _3, "xn--kranghke-b0a": _3, "kr??anghke": _3, "grue": _3, "gulen": _3, "hadsel": _3, "halden": _3, "halsa": _3, "hamar": _3, "hamaroy": _3, "habmer": _3, "xn--hbmer-xqa": _3, "h??bmer": _3, "hapmir": _3, "xn--hpmir-xqa": _3, "h??pmir": _3, "hammerfest": _3, "hammarfeasta": _3, "xn--hmmrfeasta-s4ac": _3, "h??mm??rfeasta": _3, "haram": _3, "hareid": _3, "harstad": _3, "hasvik": _3, "aknoluokta": _3, "xn--koluokta-7ya57h": _3, "??k??oluokta": _3, "hattfjelldal": _3, "aarborte": _3, "haugesund": _3, "hemne": _3, "hemnes": _3, "hemsedal": _3, "more-og-romsdal": { "$": 0, "succ": { "heroy": _3, "sande": _3 } }, "xn--mre-og-romsdal-qqb": { "$": 0, "succ": { "xn--hery-ira": _3, "sande": _3 } }, "m??re-og-romsdal": { "$": 0, "succ": { "her??y": _3, "sande": _3 } }, "hitra": _3, "hjartdal": _3, "hjelmeland": _3, "hobol": _3, "xn--hobl-ira": _3, "hob??l": _3, "hof": _3, "hol": _3, "hole": _3, "holmestrand": _3, "holtalen": _3, "xn--holtlen-hxa": _3, "holt??len": _3, "hornindal": _3, "horten": _3, "hurdal": _3, "hurum": _3, "hvaler": _3, "hyllestad": _3, "hagebostad": _3, "xn--hgebostad-g3a": _3, "h??gebostad": _3, "hoyanger": _3, "xn--hyanger-q1a": _3, "h??yanger": _3, "hoylandet": _3, "xn--hylandet-54a": _3, "h??ylandet": _3, "ha": _3, "xn--h-2fa": _3, "h??": _3, "ibestad": _3, "inderoy": _3, "xn--indery-fya": _3, "inder??y": _3, "iveland": _3, "jevnaker": _3, "jondal": _3, "jolster": _3, "xn--jlster-bya": _3, "j??lster": _3, "karasjok": _3, "karasjohka": _3, "xn--krjohka-hwab49j": _3, "k??r????johka": _3, "karlsoy": _3, "galsa": _3, "xn--gls-elac": _3, "g??ls??": _3, "karmoy": _3, "xn--karmy-yua": _3, "karm??y": _3, "kautokeino": _3, "guovdageaidnu": _3, "klepp": _3, "klabu": _3, "xn--klbu-woa": _3, "kl??bu": _3, "kongsberg": _3, "kongsvinger": _3, "kragero": _3, "xn--krager-gya": _3, "krager??": _3, "kristiansand": _3, "kristiansund": _3, "krodsherad": _3, "xn--krdsherad-m8a": _3, "kr??dsherad": _3, "kvalsund": _3, "rahkkeravju": _3, "xn--rhkkervju-01af": _3, "r??hkker??vju": _3, "kvam": _3, "kvinesdal": _3, "kvinnherad": _3, "kviteseid": _3, "kvitsoy": _3, "xn--kvitsy-fya": _3, "kvits??y": _3, "kvafjord": _3, "xn--kvfjord-nxa": _3, "kv??fjord": _3, "giehtavuoatna": _3, "kvanangen": _3, "xn--kvnangen-k0a": _3, "kv??nangen": _3, "navuotna": _3, "xn--nvuotna-hwa": _3, "n??vuotna": _3, "kafjord": _3, "xn--kfjord-iua": _3, "k??fjord": _3, "gaivuotna": _3, "xn--givuotna-8ya": _3, "g??ivuotna": _3, "larvik": _3, "lavangen": _3, "lavagis": _3, "loabat": _3, "xn--loabt-0qa": _3, "loab??t": _3, "lebesby": _3, "davvesiida": _3, "leikanger": _3, "leirfjord": _3, "leka": _3, "leksvik": _3, "lenvik": _3, "leangaviika": _3, "xn--leagaviika-52b": _3, "lea??gaviika": _3, "lesja": _3, "levanger": _3, "lier": _3, "lierne": _3, "lillehammer": _3, "lillesand": _3, "lindesnes": _3, "lindas": _3, "xn--linds-pra": _3, "lind??s": _3, "lom": _3, "loppa": _3, "lahppi": _3, "xn--lhppi-xqa": _3, "l??hppi": _3, "lund": _3, "lunner": _3, "luroy": _3, "xn--lury-ira": _3, "lur??y": _3, "luster": _3, "lyngdal": _3, "lyngen": _3, "ivgu": _3, "lardal": _3, "lerdal": _3, "xn--lrdal-sra": _3, "l??rdal": _3, "lodingen": _3, "xn--ldingen-q1a": _3, "l??dingen": _3, "lorenskog": _3, "xn--lrenskog-54a": _3, "l??renskog": _3, "loten": _3, "xn--lten-gra": _3, "l??ten": _3, "malvik": _3, "masoy": _3, "xn--msy-ula0h": _3, "m??s??y": _3, "muosat": _3, "xn--muost-0qa": _3, "muos??t": _3, "mandal": _3, "marker": _3, "marnardal": _3, "masfjorden": _3, "meland": _3, "meldal": _3, "melhus": _3, "meloy": _3, "xn--mely-ira": _3, "mel??y": _3, "meraker": _3, "xn--merker-kua": _3, "mer??ker": _3, "moareke": _3, "xn--moreke-jua": _3, "mo??reke": _3, "midsund": _3, "midtre-gauldal": _3, "modalen": _3, "modum": _3, "molde": _3, "moskenes": _3, "moss": _3, "mosvik": _3, "malselv": _3, "xn--mlselv-iua": _3, "m??lselv": _3, "malatvuopmi": _3, "xn--mlatvuopmi-s4a": _3, "m??latvuopmi": _3, "namdalseid": _3, "aejrie": _3, "namsos": _3, "namsskogan": _3, "naamesjevuemie": _3, "xn--nmesjevuemie-tcba": _3, "n????mesjevuemie": _3, "laakesvuemie": _3, "nannestad": _3, "narvik": _3, "narviika": _3, "naustdal": _3, "nedre-eiker": _3, "akershus": _30, "buskerud": _30, "nesna": _3, "nesodden": _3, "nesseby": _3, "unjarga": _3, "xn--unjrga-rta": _3, "unj??rga": _3, "nesset": _3, "nissedal": _3, "nittedal": _3, "nord-aurdal": _3, "nord-fron": _3, "nord-odal": _3, "norddal": _3, "nordkapp": _3, "davvenjarga": _3, "xn--davvenjrga-y4a": _3, "davvenj??rga": _3, "nordre-land": _3, "nordreisa": _3, "raisa": _3, "xn--risa-5na": _3, "r??isa": _3, "nore-og-uvdal": _3, "notodden": _3, "naroy": _3, "xn--nry-yla5g": _3, "n??r??y": _3, "notteroy": _3, "xn--nttery-byae": _3, "n??tter??y": _3, "odda": _3, "oksnes": _3, "xn--ksnes-uua": _3, "??ksnes": _3, "oppdal": _3, "oppegard": _3, "xn--oppegrd-ixa": _3, "oppeg??rd": _3, "orkdal": _3, "orland": _3, "xn--rland-uua": _3, "??rland": _3, "orskog": _3, "xn--rskog-uua": _3, "??rskog": _3, "orsta": _3, "xn--rsta-fra": _3, "??rsta": _3, "hedmark": { "$": 0, "succ": { "os": _3, "valer": _3, "xn--vler-qoa": _3, "v??ler": _3 } }, "hordaland": { "$": 0, "succ": { "os": _3 } }, "osen": _3, "osteroy": _3, "xn--ostery-fya": _3, "oster??y": _3, "ostre-toten": _3, "xn--stre-toten-zcb": _3, "??stre-toten": _3, "overhalla": _3, "ovre-eiker": _3, "xn--vre-eiker-k8a": _3, "??vre-eiker": _3, "oyer": _3, "xn--yer-zna": _3, "??yer": _3, "oygarden": _3, "xn--ygarden-p1a": _3, "??ygarden": _3, "oystre-slidre": _3, "xn--ystre-slidre-ujb": _3, "??ystre-slidre": _3, "porsanger": _3, "porsangu": _3, "xn--porsgu-sta26f": _3, "pors????gu": _3, "porsgrunn": _3, "radoy": _3, "xn--rady-ira": _3, "rad??y": _3, "rakkestad": _3, "rana": _3, "ruovat": _3, "randaberg": _3, "rauma": _3, "rendalen": _3, "rennebu": _3, "rennesoy": _3, "xn--rennesy-v1a": _3, "rennes??y": _3, "rindal": _3, "ringebu": _3, "ringerike": _3, "ringsaker": _3, "rissa": _3, "risor": _3, "xn--risr-ira": _3, "ris??r": _3, "roan": _3, "rollag": _3, "rygge": _3, "ralingen": _3, "xn--rlingen-mxa": _3, "r??lingen": _3, "rodoy": _3, "xn--rdy-0nab": _3, "r??d??y": _3, "romskog": _3, "xn--rmskog-bya": _3, "r??mskog": _3, "roros": _3, "xn--rros-gra": _3, "r??ros": _3, "rost": _3, "xn--rst-0na": _3, "r??st": _3, "royken": _3, "xn--ryken-vua": _3, "r??yken": _3, "royrvik": _3, "xn--ryrvik-bya": _3, "r??yrvik": _3, "rade": _3, "xn--rde-ula": _3, "r??de": _3, "salangen": _3, "siellak": _3, "saltdal": _3, "salat": _3, "xn--slt-elab": _3, "s??l??t": _3, "xn--slat-5na": _3, "s??lat": _3, "samnanger": _3, "vestfold": { "$": 0, "succ": { "sande": _3 } }, "sandefjord": _3, "sandnes": _3, "sandoy": _3, "xn--sandy-yua": _3, "sand??y": _3, "sarpsborg": _3, "sauda": _3, "sauherad": _3, "sel": _3, "selbu": _3, "selje": _3, "seljord": _3, "sigdal": _3, "siljan": _3, "sirdal": _3, "skaun": _3, "skedsmo": _3, "ski": _3, "skien": _3, "skiptvet": _3, "skjervoy": _3, "xn--skjervy-v1a": _3, "skjerv??y": _3, "skierva": _3, "xn--skierv-uta": _3, "skierv??": _3, "skjak": _3, "xn--skjk-soa": _3, "skj??k": _3, "skodje": _3, "skanland": _3, "xn--sknland-fxa": _3, "sk??nland": _3, "skanit": _3, "xn--sknit-yqa": _3, "sk??nit": _3, "smola": _3, "xn--smla-hra": _3, "sm??la": _3, "snillfjord": _3, "snasa": _3, "xn--snsa-roa": _3, "sn??sa": _3, "snoasa": _3, "snaase": _3, "xn--snase-nra": _3, "sn??ase": _3, "sogndal": _3, "sokndal": _3, "sola": _3, "solund": _3, "songdalen": _3, "sortland": _3, "spydeberg": _3, "stange": _3, "stavanger": _3, "steigen": _3, "steinkjer": _3, "stjordal": _3, "xn--stjrdal-s1a": _3, "stj??rdal": _3, "stokke": _3, "stor-elvdal": _3, "stord": _3, "stordal": _3, "storfjord": _3, "omasvuotna": _3, "strand": _3, "stranda": _3, "stryn": _3, "sula": _3, "suldal": _3, "sund": _3, "sunndal": _3, "surnadal": _3, "sveio": _3, "svelvik": _3, "sykkylven": _3, "sogne": _3, "xn--sgne-gra": _3, "s??gne": _3, "somna": _3, "xn--smna-gra": _3, "s??mna": _3, "sondre-land": _3, "xn--sndre-land-0cb": _3, "s??ndre-land": _3, "sor-aurdal": _3, "xn--sr-aurdal-l8a": _3, "s??r-aurdal": _3, "sor-fron": _3, "xn--sr-fron-q1a": _3, "s??r-fron": _3, "sor-odal": _3, "xn--sr-odal-q1a": _3, "s??r-odal": _3, "sor-varanger": _3, "xn--sr-varanger-ggb": _3, "s??r-varanger": _3, "matta-varjjat": _3, "xn--mtta-vrjjat-k7af": _3, "m??tta-v??rjjat": _3, "sorfold": _3, "xn--srfold-bya": _3, "s??rfold": _3, "sorreisa": _3, "xn--srreisa-q1a": _3, "s??rreisa": _3, "sorum": _3, "xn--srum-gra": _3, "s??rum": _3, "tana": _3, "deatnu": _3, "time": _3, "tingvoll": _3, "tinn": _3, "tjeldsund": _3, "dielddanuorri": _3, "tjome": _3, "xn--tjme-hra": _3, "tj??me": _3, "tokke": _3, "tolga": _3, "torsken": _3, "tranoy": _3, "xn--trany-yua": _3, "tran??y": _3, "tromso": _3, "xn--troms-zua": _3, "troms??": _3, "tromsa": _3, "romsa": _3, "trondheim": _3, "troandin": _3, "trysil": _3, "trana": _3, "xn--trna-woa": _3, "tr??na": _3, "trogstad": _3, "xn--trgstad-r1a": _3, "tr??gstad": _3, "tvedestrand": _3, "tydal": _3, "tynset": _3, "tysfjord": _3, "divtasvuodna": _3, "divttasvuotna": _3, "tysnes": _3, "tysvar": _3, "xn--tysvr-vra": _3, "tysv??r": _3, "tonsberg": _3, "xn--tnsberg-q1a": _3, "t??nsberg": _3, "ullensaker": _3, "ullensvang": _3, "ulvik": _3, "utsira": _3, "vadso": _3, "xn--vads-jra": _3, "vads??": _3, "cahcesuolo": _3, "xn--hcesuolo-7ya35b": _3, "????hcesuolo": _3, "vaksdal": _3, "valle": _3, "vang": _3, "vanylven": _3, "vardo": _3, "xn--vard-jra": _3, "vard??": _3, "varggat": _3, "xn--vrggt-xqad": _3, "v??rgg??t": _3, "vefsn": _3, "vaapste": _3, "vega": _3, "vegarshei": _3, "xn--vegrshei-c0a": _3, "veg??rshei": _3, "vennesla": _3, "verdal": _3, "verran": _3, "vestby": _3, "vestnes": _3, "vestre-slidre": _3, "vestre-toten": _3, "vestvagoy": _3, "xn--vestvgy-ixa6o": _3, "vestv??g??y": _3, "vevelstad": _3, "vik": _3, "vikna": _3, "vindafjord": _3, "volda": _3, "voss": _3, "varoy": _3, "xn--vry-yla5g": _3, "v??r??y": _3, "vagan": _3, "xn--vgan-qoa": _3, "v??gan": _3, "voagat": _3, "vagsoy": _3, "xn--vgsy-qoa0j": _3, "v??gs??y": _3, "vaga": _3, "xn--vg-yiab": _3, "v??g??": _3, "ostfold": { "$": 0, "succ": { "valer": _3 } }, "xn--stfold-9xa": { "$": 0, "succ": { "xn--vler-qoa": _3 } }, "??stfold": { "$": 0, "succ": { "v??ler": _3 } }, "co": _5, "blogspot": _5 } }, "np": _9, "nr": _23, "nu": { "$": 1, "succ": { "merseine": _5, "mine": _5, "shacknet": _5, "nom": _5, "uwu": _5, "enterprisecloud": _5 } }, "nz": { "$": 1, "succ": { "ac": _3, "co": _6, "cri": _3, "geek": _3, "gen": _3, "govt": _3, "health": _3, "iwi": _3, "kiwi": _3, "maori": _3, "mil": _3, "xn--mori-qsa": _3, "m??ori": _3, "net": _3, "org": _3, "parliament": _3, "school": _3, "nym": _5 } }, "om": { "$": 1, "succ": { "co": _3, "com": _3, "edu": _3, "gov": _3, "med": _3, "museum": _3, "net": _3, "org": _3, "pro": _3 } }, "onion": _3, "org": { "$": 1, "succ": { "altervista": _5, "amune": { "$": 0, "succ": { "tele": _5 } }, "pimienta": _5, "poivron": _5, "potager": _5, "sweetpepper": _5, "ae": _5, "us": _5, "certmgr": _5, "cdn77": { "$": 0, "succ": { "c": _5, "rsc": _5 } }, "cdn77-secure": { "$": 0, "succ": { "origin": { "$": 0, "succ": { "ssl": _5 } } } }, "cloudns": _5, "duckdns": _5, "tunk": _5, "dyndns": { "$": 2, "succ": { "go": _5, "home": _5 } }, "blogdns": _5, "blogsite": _5, "boldlygoingnowhere": _5, "dnsalias": _5, "dnsdojo": _5, "doesntexist": _5, "dontexist": _5, "doomdns": _5, "dvrdns": _5, "dynalias": _5, "endofinternet": _5, "endoftheinternet": _5, "from-me": _5, "game-host": _5, "gotdns": _5, "hobby-site": _5, "homedns": _5, "homeftp": _5, "homelinux": _5, "homeunix": _5, "is-a-bruinsfan": _5, "is-a-candidate": _5, "is-a-celticsfan": _5, "is-a-chef": _5, "is-a-geek": _5, "is-a-knight": _5, "is-a-linux-user": _5, "is-a-patsfan": _5, "is-a-soxfan": _5, "is-found": _5, "is-lost": _5, "is-saved": _5, "is-very-bad": _5, "is-very-evil": _5, "is-very-good": _5, "is-very-nice": _5, "is-very-sweet": _5, "isa-geek": _5, "kicks-ass": _5, "misconfused": _5, "podzone": _5, "readmyblog": _5, "selfip": _5, "sellsyourhome": _5, "servebbs": _5, "serveftp": _5, "servegame": _5, "stuff-4-sale": _5, "webhop": _5, "ddnss": _5, "accesscam": _5, "camdvr": _5, "freeddns": _5, "mywire": _5, "webredirect": _5, "eu": { "$": 2, "succ": { "al": _5, "asso": _5, "at": _5, "au": _5, "be": _5, "bg": _5, "ca": _5, "cd": _5, "ch": _5, "cn": _5, "cy": _5, "cz": _5, "de": _5, "dk": _5, "edu": _5, "ee": _5, "es": _5, "fi": _5, "fr": _5, "gr": _5, "hr": _5, "hu": _5, "ie": _5, "il": _5, "in": _5, "int": _5, "is": _5, "it": _5, "jp": _5, "kr": _5, "lt": _5, "lu": _5, "lv": _5, "mc": _5, "me": _5, "mk": _5, "mt": _5, "my": _5, "net": _5, "ng": _5, "nl": _5, "no": _5, "nz": _5, "paris": _5, "pl": _5, "pt": _5, "q-a": _5, "ro": _5, "ru": _5, "se": _5, "si": _5, "sk": _5, "tr": _5, "uk": _5, "us": _5 } }, "twmail": _5, "fedorainfracloud": _5, "fedorapeople": _5, "fedoraproject": { "$": 0, "succ": { "cloud": _5, "os": _17, "stg": { "$": 0, "succ": { "os": _17 } } } }, "freedesktop": _5, "hepforge": _5, "in-dsl": _5, "in-vpn": _5, "js": _5, "uklugs": _5, "barsy": _5, "mayfirst": _5, "mozilla-iot": _5, "bmoattachments": _5, "dynserv": _5, "now-dns": _5, "cable-modem": _5, "collegefan": _5, "couchpotatofries": _5, "mlbfan": _5, "mysecuritycamera": _5, "nflfan": _5, "read-books": _5, "ufcfan": _5, "hopto": _5, "myftp": _5, "no-ip": _5, "zapto": _5, "pubtls": _5, "my-firewall": _5, "myfirewall": _5, "spdns": _5, "dsmynas": _5, "familyds": _5, "edugit": _5, "tuxfamily": _5, "diskstation": _5, "hk": _5, "wmflabs": _5, "toolforge": _5, "wmcloud": _5, "za": _5 } }, "pa": { "$": 1, "succ": { "ac": _3, "gob": _3, "com": _3, "org": _3, "sld": _3, "edu": _3, "net": _3, "ing": _3, "abo": _3, "med": _3, "nom": _3 } }, "pe": { "$": 1, "succ": { "edu": _3, "gob": _3, "nom": _3, "mil": _3, "org": _3, "com": _3, "net": _3, "blogspot": _5, "nym": _5 } }, "pf": { "$": 1, "succ": { "com": _3, "org": _3, "edu": _3 } }, "pg": _9, "ph": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "edu": _3, "ngo": _3, "mil": _3, "i": _3 } }, "pk": { "$": 1, "succ": { "com": _3, "net": _3, "edu": _3, "org": _3, "fam": _3, "biz": _3, "web": _3, "gov": _3, "gob": _3, "gok": _3, "gon": _3, "gop": _3, "gos": _3, "info": _3 } }, "pl": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "aid": _3, "agro": _3, "atm": _3, "auto": _3, "biz": _3, "edu": _3, "gmina": _3, "gsm": _3, "info": _3, "mail": _3, "miasta": _3, "media": _3, "mil": _3, "nieruchomosci": _3, "nom": _3, "pc": _3, "powiat": _3, "priv": _3, "realestate": _3, "rel": _3, "sex": _3, "shop": _3, "sklep": _3, "sos": _3, "szkola": _3, "targi": _3, "tm": _3, "tourism": _3, "travel": _3, "turystyka": _3, "gov": { "$": 1, "succ": { "ap": _3, "ic": _3, "is": _3, "us": _3, "kmpsp": _3, "kppsp": _3, "kwpsp": _3, "psp": _3, "wskr": _3, "kwp": _3, "mw": _3, "ug": _3, "um": _3, "umig": _3, "ugim": _3, "upow": _3, "uw": _3, "starostwo": _3, "pa": _3, "po": _3, "psse": _3, "pup": _3, "rzgw": _3, "sa": _3, "so": _3, "sr": _3, "wsa": _3, "sko": _3, "uzs": _3, "wiih": _3, "winb": _3, "pinb": _3, "wios": _3, "witd": _3, "wzmiuw": _3, "piw": _3, "wiw": _3, "griw": _3, "wif": _3, "oum": _3, "sdn": _3, "zp": _3, "uppo": _3, "mup": _3, "wuoz": _3, "konsulat": _3, "oirm": _3 } }, "augustow": _3, "babia-gora": _3, "bedzin": _3, "beskidy": _3, "bialowieza": _3, "bialystok": _3, "bielawa": _3, "bieszczady": _3, "boleslawiec": _3, "bydgoszcz": _3, "bytom": _3, "cieszyn": _3, "czeladz": _3, "czest": _3, "dlugoleka": _3, "elblag": _3, "elk": _3, "glogow": _3, "gniezno": _3, "gorlice": _3, "grajewo": _3, "ilawa": _3, "jaworzno": _3, "jelenia-gora": _3, "jgora": _3, "kalisz": _3, "kazimierz-dolny": _3, "karpacz": _3, "kartuzy": _3, "kaszuby": _3, "katowice": _3, "kepno": _3, "ketrzyn": _3, "klodzko": _3, "kobierzyce": _3, "kolobrzeg": _3, "konin": _3, "konskowola": _3, "kutno": _3, "lapy": _3, "lebork": _3, "legnica": _3, "lezajsk": _3, "limanowa": _3, "lomza": _3, "lowicz": _3, "lubin": _3, "lukow": _3, "malbork": _3, "malopolska": _3, "mazowsze": _3, "mazury": _3, "mielec": _3, "mielno": _3, "mragowo": _3, "naklo": _3, "nowaruda": _3, "nysa": _3, "olawa": _3, "olecko": _3, "olkusz": _3, "olsztyn": _3, "opoczno": _3, "opole": _3, "ostroda": _3, "ostroleka": _3, "ostrowiec": _3, "ostrowwlkp": _3, "pila": _3, "pisz": _3, "podhale": _3, "podlasie": _3, "polkowice": _3, "pomorze": _3, "pomorskie": _3, "prochowice": _3, "pruszkow": _3, "przeworsk": _3, "pulawy": _3, "radom": _3, "rawa-maz": _3, "rybnik": _3, "rzeszow": _3, "sanok": _3, "sejny": _3, "slask": _3, "slupsk": _3, "sosnowiec": _3, "stalowa-wola": _3, "skoczow": _3, "starachowice": _3, "stargard": _3, "suwalki": _3, "swidnica": _3, "swiebodzin": _3, "swinoujscie": _3, "szczecin": _3, "szczytno": _3, "tarnobrzeg": _3, "tgory": _3, "turek": _3, "tychy": _3, "ustka": _3, "walbrzych": _3, "warmia": _3, "warszawa": _3, "waw": _3, "wegrow": _3, "wielun": _3, "wlocl": _3, "wloclawek": _3, "wodzislaw": _3, "wolomin": _3, "wroclaw": _3, "zachpomor": _3, "zagan": _3, "zarow": _3, "zgora": _3, "zgorzelec": _3, "beep": _5, "krasnik": _5, "leczna": _5, "lubartow": _5, "lublin": _5, "poniatowa": _5, "swidnik": _5, "co": _5, "art": _5, "gliwice": _5, "krakow": _5, "poznan": _5, "wroc": _5, "zakopane": _5, "gda": _5, "gdansk": _5, "gdynia": _5, "med": _5, "sopot": _5 } }, "pm": { "$": 1, "succ": { "own": _5 } }, "pn": { "$": 1, "succ": { "gov": _3, "co": _3, "org": _3, "edu": _3, "net": _3 } }, "post": _3, "pr": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "edu": _3, "isla": _3, "pro": _3, "biz": _3, "info": _3, "name": _3, "est": _3, "prof": _3, "ac": _3 } }, "pro": { "$": 1, "succ": { "aaa": _3, "aca": _3, "acct": _3, "avocat": _3, "bar": _3, "cpa": _3, "eng": _3, "jur": _3, "law": _3, "med": _3, "recht": _3, "cloudns": _5, "dnstrace": { "$": 0, "succ": { "bci": _5 } }, "barsy": _5 } }, "ps": { "$": 1, "succ": { "edu": _3, "gov": _3, "sec": _3, "plo": _3, "com": _3, "org": _3, "net": _3 } }, "pt": { "$": 1, "succ": { "net": _3, "gov": _3, "org": _3, "edu": _3, "int": _3, "publ": _3, "com": _3, "nome": _3, "blogspot": _5, "nym": _5 } }, "pw": { "$": 1, "succ": { "co": _3, "ne": _3, "or": _3, "ed": _3, "go": _3, "belau": _3, "cloudns": _5, "x443": _5, "nom": _5 } }, "py": { "$": 1, "succ": { "com": _3, "coop": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3 } }, "qa": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "sch": _3, "blogspot": _5, "nom": _5 } }, "re": { "$": 1, "succ": { "asso": _3, "com": _3, "nom": _3, "blogspot": _5 } }, "ro": { "$": 1, "succ": { "arts": _3, "com": _3, "firm": _3, "info": _3, "nom": _3, "nt": _3, "org": _3, "rec": _3, "store": _3, "tm": _3, "www": _3, "shop": _5, "blogspot": _5, "nym": _5 } }, "rs": { "$": 1, "succ": { "ac": _3, "co": _3, "edu": _3, "gov": _3, "in": _3, "org": _3, "blogspot": _5, "ua": _5, "nom": _5, "ox": _5 } }, "ru": { "$": 1, "succ": { "ac": _5, "edu": _5, "gov": _5, "int": _5, "mil": _5, "test": _5, "adygeya": _5, "bashkiria": _5, "bir": _5, "cbg": _5, "com": _5, "dagestan": _5, "grozny": _5, "kalmykia": _5, "kustanai": _5, "marine": _5, "mordovia": _5, "msk": _5, "mytis": _5, "nalchik": _5, "nov": _5, "pyatigorsk": _5, "spb": _5, "vladikavkaz": _5, "vladimir": _5, "blogspot": _5, "na4u": _5, "regruhosting": _28, "myjino": { "$": 2, "succ": { "hosting": _8, "landing": _8, "spectrum": _8, "vps": _8 } }, "cldmail": { "$": 0, "succ": { "hb": _5 } }, "mcdir": { "$": 2, "succ": { "vps": _5 } }, "net": _5, "org": _5, "pp": _5, "ras": _5 } }, "rw": { "$": 1, "succ": { "ac": _3, "co": _3, "coop": _3, "gov": _3, "mil": _3, "net": _3, "org": _3 } }, "sa": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "med": _3, "pub": _3, "edu": _3, "sch": _3 } }, "sb": _10, "sc": _10, "sd": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "edu": _3, "med": _3, "tv": _3, "gov": _3, "info": _3 } }, "se": { "$": 1, "succ": { "a": _3, "ac": _3, "b": _3, "bd": _3, "brand": _3, "c": _3, "d": _3, "e": _3, "f": _3, "fh": _3, "fhsk": _3, "fhv": _3, "g": _3, "h": _3, "i": _3, "k": _3, "komforb": _3, "kommunalforbund": _3, "komvux": _3, "l": _3, "lanbib": _3, "m": _3, "n": _3, "naturbruksgymn": _3, "o": _3, "org": _3, "p": _3, "parti": _3, "pp": _3, "press": _3, "r": _3, "s": _3, "t": _3, "tm": _3, "u": _3, "w": _3, "x": _3, "y": _3, "z": _3, "com": _5, "blogspot": _5, "conf": _5 } }, "sg": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "edu": _3, "per": _3, "blogspot": _5 } }, "sh": { "$": 1, "succ": { "com": _3, "net": _3, "gov": _3, "org": _3, "mil": _3, "hashbang": _5, "platform": { "$": 0, "succ": { "bc": _5, "ent": _5, "eu": _5, "us": _5 } }, "now": _5, "vxl": _5, "wedeploy": _5 } }, "si": { "$": 1, "succ": { "gitpage": _5, "blogspot": _5, "nom": _5 } }, "sj": _3, "sk": _24, "sl": _10, "sm": _3, "sn": { "$": 1, "succ": { "art": _3, "com": _3, "edu": _3, "gouv": _3, "org": _3, "perso": _3, "univ": _3, "blogspot": _5 } }, "so": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "me": _3, "net": _3, "org": _3, "sch": _5 } }, "sr": _3, "ss": { "$": 1, "succ": { "biz": _3, "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3 } }, "st": { "$": 1, "succ": { "co": _3, "com": _3, "consulado": _3, "edu": _3, "embaixada": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "principe": _3, "saotome": _3, "store": _3, "nom": _5, "noho": _5 } }, "su": { "$": 1, "succ": { "abkhazia": _5, "adygeya": _5, "aktyubinsk": _5, "arkhangelsk": _5, "armenia": _5, "ashgabad": _5, "azerbaijan": _5, "balashov": _5, "bashkiria": _5, "bryansk": _5, "bukhara": _5, "chimkent": _5, "dagestan": _5, "east-kazakhstan": _5, "exnet": _5, "georgia": _5, "grozny": _5, "ivanovo": _5, "jambyl": _5, "kalmykia": _5, "kaluga": _5, "karacol": _5, "karaganda": _5, "karelia": _5, "khakassia": _5, "krasnodar": _5, "kurgan": _5, "kustanai": _5, "lenug": _5, "mangyshlak": _5, "mordovia": _5, "msk": _5, "murmansk": _5, "nalchik": _5, "navoi": _5, "north-kazakhstan": _5, "nov": _5, "obninsk": _5, "penza": _5, "pokrovsk": _5, "sochi": _5, "spb": _5, "tashkent": _5, "termez": _5, "togliatti": _5, "troitsk": _5, "tselinograd": _5, "tula": _5, "tuva": _5, "vladikavkaz": _5, "vladimir": _5, "vologda": _5, "nym": _5 } }, "sv": { "$": 1, "succ": { "com": _3, "edu": _3, "gob": _3, "org": _3, "red": _3 } }, "sx": { "$": 1, "succ": { "gov": _3, "nym": _5 } }, "sy": _4, "sz": { "$": 1, "succ": { "co": _3, "ac": _3, "org": _3 } }, "tc": { "$": 1, "succ": { "ch": _5, "me": _5, "we": _5 } }, "td": _6, "tel": _3, "tf": _3, "tg": _3, "th": { "$": 1, "succ": { "ac": _3, "co": _3, "go": _3, "in": _3, "mi": _3, "net": _3, "or": _3, "online": _5, "shop": _5 } }, "tj": { "$": 1, "succ": { "ac": _3, "biz": _3, "co": _3, "com": _3, "edu": _3, "go": _3, "gov": _3, "int": _3, "mil": _3, "name": _3, "net": _3, "nic": _3, "org": _3, "test": _3, "web": _3, "nom": _5 } }, "tk": _3, "tl": _7, "tm": { "$": 1, "succ": { "com": _3, "co": _3, "org": _3, "net": _3, "nom": _3, "gov": _3, "mil": _3, "edu": _3 } }, "tn": { "$": 1, "succ": { "com": _3, "ens": _3, "fin": _3, "gov": _3, "ind": _3, "intl": _3, "nat": _3, "net": _3, "org": _3, "info": _3, "perso": _3, "tourism": _3, "edunet": _3, "rnrt": _3, "rns": _3, "rnu": _3, "mincom": _3, "agrinet": _3, "defense": _3, "turen": _3 } }, "to": { "$": 1, "succ": { "611": _5, "com": _3, "gov": _3, "net": _3, "org": _3, "edu": _3, "mil": _3, "oya": _5, "rdv": _5, "vpnplus": _5, "quickconnect": { "$": 0, "succ": { "direct": _5 } }, "nyan": _5 } }, "tr": { "$": 1, "succ": { "av": _3, "bbs": _3, "bel": _3, "biz": _3, "com": _6, "dr": _3, "edu": _3, "gen": _3, "gov": _3, "info": _3, "mil": _3, "k12": _3, "kep": _3, "name": _3, "net": _3, "org": _3, "pol": _3, "tel": _3, "tsk": _3, "tv": _3, "web": _3, "nc": _7 } }, "tt": { "$": 1, "succ": { "co": _3, "com": _3, "org": _3, "net": _3, "biz": _3, "info": _3, "pro": _3, "int": _3, "coop": _3, "jobs": _3, "mobi": _3, "travel": _3, "museum": _3, "aero": _3, "name": _3, "gov": _3, "edu": _3 } }, "tv": { "$": 1, "succ": { "dyndns": _5, "better-than": _5, "on-the-web": _5, "worse-than": _5 } }, "tw": { "$": 1, "succ": { "edu": _3, "gov": _3, "mil": _3, "com": { "$": 1, "succ": { "mymailer": _5 } }, "net": _3, "org": _3, "idv": _3, "game": _3, "ebiz": _3, "club": _3, "xn--zf0ao64a": _3, "??????": _3, "xn--uc0atv": _3, "??????": _3, "xn--czrw28b": _3, "??????": _3, "url": _5, "blogspot": _5, "nym": _5 } }, "tz": { "$": 1, "succ": { "ac": _3, "co": _3, "go": _3, "hotel": _3, "info": _3, "me": _3, "mil": _3, "mobi": _3, "ne": _3, "or": _3, "sc": _3, "tv": _3 } }, "ua": { "$": 1, "succ": { "com": _3, "edu": _3, "gov": _3, "in": _3, "net": _3, "org": _3, "cherkassy": _3, "cherkasy": _3, "chernigov": _3, "chernihiv": _3, "chernivtsi": _3, "chernovtsy": _3, "ck": _3, "cn": _3, "cr": _3, "crimea": _3, "cv": _3, "dn": _3, "dnepropetrovsk": _3, "dnipropetrovsk": _3, "donetsk": _3, "dp": _3, "if": _3, "ivano-frankivsk": _3, "kh": _3, "kharkiv": _3, "kharkov": _3, "kherson": _3, "khmelnitskiy": _3, "khmelnytskyi": _3, "kiev": _3, "kirovograd": _3, "km": _3, "kr": _3, "krym": _3, "ks": _3, "kv": _3, "kyiv": _3, "lg": _3, "lt": _3, "lugansk": _3, "lutsk": _3, "lv": _3, "lviv": _3, "mk": _3, "mykolaiv": _3, "nikolaev": _3, "od": _3, "odesa": _3, "odessa": _3, "pl": _3, "poltava": _3, "rivne": _3, "rovno": _3, "rv": _3, "sb": _3, "sebastopol": _3, "sevastopol": _3, "sm": _3, "sumy": _3, "te": _3, "ternopil": _3, "uz": _3, "uzhgorod": _3, "vinnica": _3, "vinnytsia": _3, "vn": _3, "volyn": _3, "yalta": _3, "zaporizhzhe": _3, "zaporizhzhia": _3, "zhitomir": _3, "zhytomyr": _3, "zp": _3, "zt": _3, "cc": _5, "inf": _5, "ltd": _5, "biz": _5, "co": _5, "pp": _5, "v": _5 } }, "ug": { "$": 1, "succ": { "co": _3, "or": _3, "ac": _3, "sc": _3, "go": _3, "ne": _3, "com": _3, "org": _3, "blogspot": _5, "nom": _5 } }, "uk": { "$": 1, "succ": { "ac": _3, "co": { "$": 1, "succ": { "bytemark": { "$": 0, "succ": { "dh": _5, "vm": _5 } }, "blogspot": _5, "layershift": _18, "barsy": _5, "barsyonline": _5, "retrosnub": _22, "nh-serv": _5, "no-ip": _5, "wellbeingzone": _5, "gwiddle": _5 } }, "gov": { "$": 1, "succ": { "service": _5, "homeoffice": _5 } }, "ltd": _3, "me": _3, "net": _3, "nhs": _3, "org": { "$": 1, "succ": { "glug": _5, "lug": _5, "lugs": _5 } }, "plc": _3, "police": _3, "sch": _9, "conn": _5, "copro": _5, "barsy": _5 } }, "us": { "$": 1, "succ": { "dni": _3, "fed": _3, "isa": _3, "kids": _3, "nsn": _3, "ak": _31, "al": _31, "ar": _31, "as": _31, "az": _31, "ca": _31, "co": _31, "ct": _31, "dc": _31, "de": { "$": 1, "succ": { "k12": _3, "cc": _3, "lib": _5 } }, "fl": _31, "ga": _31, "gu": _31, "hi": _32, "ia": _31, "id": _31, "il": _31, "in": _31, "ks": _31, "ky": _31, "la": _31, "ma": { "$": 1, "succ": { "k12": { "$": 1, "succ": { "pvt": _3, "chtr": _3, "paroch": _3 } }, "cc": _3, "lib": _3 } }, "md": _31, "me": _31, "mi": { "$": 1, "succ": { "k12": _3, "cc": _3, "lib": _3, "ann-arbor": _3, "cog": _3, "dst": _3, "eaton": _3, "gen": _3, "mus": _3, "tec": _3, "washtenaw": _3 } }, "mn": _31, "mo": _31, "ms": _31, "mt": _31, "nc": _31, "nd": _32, "ne": _31, "nh": _31, "nj": _31, "nm": _31, "nv": _31, "ny": _31, "oh": _31, "ok": _31, "or": _31, "pa": _31, "pr": _31, "ri": _32, "sc": _31, "sd": _32, "tn": _31, "tx": _31, "ut": _31, "vi": _31, "vt": _31, "va": _31, "wa": _31, "wi": _31, "wv": { "$": 1, "succ": { "cc": _3 } }, "wy": _31, "cloudns": _5, "drud": _5, "is-by": _5, "land-4-sale": _5, "stuff-4-sale": _5, "graphox": _5, "freeddns": _5, "golffan": _5, "noip": _5, "pointto": _5, "platterp": _5 } }, "uy": { "$": 1, "succ": { "com": _6, "edu": _3, "gub": _3, "mil": _3, "net": _3, "org": _3, "nom": _5 } }, "uz": { "$": 1, "succ": { "co": _3, "com": _3, "net": _3, "org": _3 } }, "va": _3, "vc": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "mil": _3, "edu": _3, "gv": { "$": 2, "succ": { "d": _5 } }, "0e": _5, "nom": _5 } }, "ve": { "$": 1, "succ": { "arts": _3, "co": _3, "com": _3, "e12": _3, "edu": _3, "firm": _3, "gob": _3, "gov": _3, "info": _3, "int": _3, "mil": _3, "net": _3, "org": _3, "rec": _3, "store": _3, "tec": _3, "web": _3 } }, "vg": { "$": 1, "succ": { "nom": _5, "at": _5 } }, "vi": { "$": 1, "succ": { "co": _3, "com": _3, "k12": _3, "net": _3, "org": _3 } }, "vn": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "edu": _3, "gov": _3, "int": _3, "ac": _3, "biz": _3, "info": _3, "name": _3, "pro": _3, "health": _3, "blogspot": _5 } }, "vu": { "$": 1, "succ": { "com": _3, "edu": _3, "net": _3, "org": _3, "blog": _5, "dev": _5, "me": _5, "cn": _5 } }, "wf": _3, "ws": { "$": 1, "succ": { "com": _3, "net": _3, "org": _3, "gov": _3, "edu": _3, "advisor": _8, "cloud66": _5, "dyndns": _5, "mypets": _5 } }, "yt": _3, "xn--mgbaam7a8h": _3, "????????????": _3, "xn--y9a3aq": _3, "??????": _3, "xn--54b7fta0cc": _3, "???????????????": _3, "xn--90ae": _3, "????": _3, "xn--90ais": _3, "??????": _3, "xn--fiqs8s": _3, "??????": _3, "xn--fiqz9s": _3, "??????": _3, "xn--lgbbat1ad8j": _3, "??????????????": _3, "xn--wgbh1c": _3, "??????": _3, "xn--e1a4c": _3, "????": _3, "xn--qxa6a": _3, "????": _3, "xn--mgbah1a3hjkrd": _3, "??????????????????": _3, "xn--node": _3, "??????": _3, "xn--qxam": _3, "????": _3, "xn--j6w193g": { "$": 1, "succ": { "xn--55qx5d": _3, "xn--wcvs22d": _3, "xn--mxtq1m": _3, "xn--gmqw5a": _3, "xn--od0alg": _3, "xn--uc0atv": _3 } }, "??????": { "$": 1, "succ": { "??????": _3, "??????": _3, "??????": _3, "??????": _3, "??????": _3, "??????": _3 } }, "xn--2scrj9c": _3, "????????????": _3, "xn--3hcrj9c": _3, "????????????": _3, "xn--45br5cyl": _3, "????????????": _3, "xn--h2breg3eve": _3, "??????????????????": _3, "xn--h2brj9c8c": _3, "???????????????": _3, "xn--mgbgu82a": _3, "????????": _3, "xn--rvc1e0am3e": _3, "???????????????": _3, "xn--h2brj9c": _3, "????????????": _3, "xn--mgbbh1a": _3, "????????": _3, "xn--mgbbh1a71e": _3, "??????????": _3, "xn--fpcrj9c3d": _3, "???????????????": _3, "xn--gecrj9c": _3, "????????????": _3, "xn--s9brj9c": _3, "????????????": _3, "xn--45brj9c": _3, "????????????": _3, "xn--xkc2dl3a5ee0h": _3, "?????????????????????": _3, "xn--mgba3a4f16a": _3, "??????????": _3, "xn--mgba3a4fra": _3, "??????????": _3, "xn--mgbtx2b": _3, "????????": _3, "xn--mgbayh7gpa": _3, "????????????": _3, "xn--3e0b707e": _3, "??????": _3, "xn--80ao21a": _3, "??????": _3, "xn--fzc2c9e2c": _3, "????????????": _3, "xn--xkc2al3hye2a": _3, "??????????????????": _3, "xn--mgbc0a9azcg": _3, "????????????": _3, "xn--d1alf": _3, "??????": _3, "xn--l1acc": _3, "??????": _3, "xn--mix891f": _3, "??????": _3, "xn--mix082f": _3, "??????": _3, "xn--mgbx4cd0ab": _3, "????????????": _3, "xn--mgb9awbf": _3, "????????": _3, "xn--mgbai9azgqp6j": _3, "??????????????": _3, "xn--mgbai9a5eva00b": _3, "??????????????": _3, "xn--ygbi2ammx": _3, "????????????": _3, "xn--90a3ac": { "$": 1, "succ": { "xn--o1ac": _3, "xn--c1avg": _3, "xn--90azh": _3, "xn--d1at": _3, "xn--o1ach": _3, "xn--80au": _3 } }, "??????": { "$": 1, "succ": { "????": _3, "??????": _3, "??????": _3, "????": _3, "??????": _3, "????": _3 } }, "xn--p1ai": _3, "????": _3, "xn--wgbl6a": _3, "??????": _3, "xn--mgberp4a5d4ar": _3, "????????????????": _3, "xn--mgberp4a5d4a87g": _3, "????????????????": _3, "xn--mgbqly7c0a67fbc": _3, "????????????????": _3, "xn--mgbqly7cvafr": _3, "????????????????": _3, "xn--mgbpl2fh": _3, "??????????": _3, "xn--yfro4i67o": _3, "?????????": _3, "xn--clchc0ea0b2g2a9gcd": _3, "?????????????????????????????????": _3, "xn--ogbpf8fl": _3, "??????????": _3, "xn--mgbtf8fl": _3, "??????????": _3, "xn--o3cw4h": { "$": 1, "succ": { "xn--12c1fe0br": _3, "xn--12co0c3b4eva": _3, "xn--h3cuzk1di": _3, "xn--o3cyx2a": _3, "xn--m3ch0j3a": _3, "xn--12cfi8ixb8l": _3 } }, "?????????": { "$": 1, "succ": { "???????????????": _3, "??????????????????": _3, "??????????????????": _3, "????????????": _3, "????????????": _3, "??????????????????": _3 } }, "xn--pgbs0dh": _3, "????????": _3, "xn--kpry57d": _3, "??????": _3, "xn--kprw13d": _3, "??????": _3, "xn--nnx388a": _3, "??????": _3, "xn--j1amh": _3, "??????": _3, "xn--mgb2ddes": _3, "??????????": _3, "xxx": _3, "ye": _9, "za": { "$": 0, "succ": { "ac": _3, "agric": _3, "alt": _3, "co": _6, "edu": _3, "gov": _3, "grondar": _3, "law": _3, "mil": _3, "net": _3, "ngo": _3, "nic": _3, "nis": _3, "nom": _3, "org": _3, "school": _3, "tm": _3, "web": _3 } }, "zm": { "$": 1, "succ": { "ac": _3, "biz": _3, "co": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "mil": _3, "net": _3, "org": _3, "sch": _3 } }, "zw": { "$": 1, "succ": { "ac": _3, "co": _3, "gov": _3, "mil": _3, "org": _3 } }, "aaa": _3, "aarp": _3, "abarth": _3, "abb": _3, "abbott": _3, "abbvie": _3, "abc": _3, "able": _3, "abogado": _3, "abudhabi": _3, "academy": { "$": 1, "succ": { "official": _5 } }, "accenture": _3, "accountant": _3, "accountants": _3, "aco": _3, "actor": _3, "adac": _3, "ads": _3, "adult": _3, "aeg": _3, "aetna": _3, "afamilycompany": _3, "afl": _3, "africa": _3, "agakhan": _3, "agency": _3, "aig": _3, "airbus": _3, "airforce": _3, "airtel": _3, "akdn": _3, "alfaromeo": _3, "alibaba": _3, "alipay": _3, "allfinanz": _3, "allstate": _3, "ally": _3, "alsace": _3, "alstom": _3, "amazon": _3, "americanexpress": _3, "americanfamily": _3, "amex": _3, "amfam": _3, "amica": _3, "amsterdam": _3, "analytics": _3, "android": _3, "anquan": _3, "anz": _3, "aol": _3, "apartments": _3, "app": { "$": 1, "succ": { "wnext": _5, "run": { "$": 2, "succ": { "a": _5 } }, "web": _5, "hasura": _5, "loginline": _5, "netlify": _5, "telebit": _5, "vercel": _5 } }, "apple": _3, "aquarelle": _3, "arab": _3, "aramco": _3, "archi": _3, "army": _3, "art": _3, "arte": _3, "asda": _3, "associates": _3, "athleta": _3, "attorney": _3, "auction": _3, "audi": _3, "audible": _3, "audio": _3, "auspost": _3, "author": _3, "auto": _3, "autos": _3, "avianca": _3, "aws": _3, "axa": _3, "azure": _3, "baby": _3, "baidu": _3, "banamex": _3, "bananarepublic": _3, "band": _3, "bank": _3, "bar": _3, "barcelona": _3, "barclaycard": _3, "barclays": _3, "barefoot": _3, "bargains": _3, "baseball": _3, "basketball": _3, "bauhaus": _3, "bayern": _3, "bbc": _3, "bbt": _3, "bbva": _3, "bcg": _3, "bcn": _3, "beats": _3, "beauty": _3, "beer": _3, "bentley": _3, "berlin": _3, "best": _3, "bestbuy": _3, "bet": _3, "bharti": _3, "bible": _3, "bid": _3, "bike": _3, "bing": _3, "bingo": _3, "bio": _3, "black": _3, "blackfriday": _3, "blockbuster": _3, "blog": _3, "bloomberg": _3, "blue": _3, "bms": _3, "bmw": _3, "bnpparibas": _3, "boats": _3, "boehringer": _3, "bofa": _3, "bom": _3, "bond": _3, "boo": _3, "book": _3, "booking": _3, "bosch": _3, "bostik": _3, "boston": _3, "bot": _3, "boutique": _3, "box": _3, "bradesco": _3, "bridgestone": _3, "broadway": _3, "broker": _3, "brother": _3, "brussels": _3, "budapest": _3, "bugatti": _3, "build": _3, "builders": _3, "business": _11, "buy": _3, "buzz": _3, "bzh": _3, "cab": _3, "cafe": _3, "cal": _3, "call": _3, "calvinklein": _3, "cam": _3, "camera": _3, "camp": _3, "cancerresearch": _3, "canon": _3, "capetown": _3, "capital": _3, "capitalone": _3, "car": _3, "caravan": _3, "cards": _3, "care": _3, "career": _3, "careers": _3, "cars": _3, "casa": { "$": 1, "succ": { "nabu": { "$": 0, "succ": { "ui": _5 } } } }, "case": _3, "caseih": _3, "cash": _3, "casino": _3, "catering": _3, "catholic": _3, "cba": _3, "cbn": _3, "cbre": _3, "cbs": _3, "ceb": _3, "center": _3, "ceo": _3, "cern": _3, "cfa": _3, "cfd": _3, "chanel": _3, "channel": _3, "charity": _3, "chase": _3, "chat": _3, "cheap": _3, "chintai": _3, "christmas": _3, "chrome": _3, "church": _3, "cipriani": _3, "circle": _3, "cisco": _3, "citadel": _3, "citi": _3, "citic": _3, "city": _12, "cityeats": _3, "claims": _3, "cleaning": _3, "click": _3, "clinic": _3, "clinique": _3, "clothing": _3, "cloud": { "$": 1, "succ": { "banzai": _8, "statics": _8, "jele": _5, "linkyard": _5, "magentosite": _8, "perspecta": _5, "vapor": _5, "on-rancher": _8, "sensiosite": _8, "trafficplex": _5, "urown": _5, "voorloper": _5 } }, "club": { "$": 1, "succ": { "cloudns": _5, "jele": _5, "barsy": _5, "pony": _5 } }, "clubmed": _3, "coach": _3, "codes": { "$": 1, "succ": { "owo": _8 } }, "coffee": _3, "college": _3, "cologne": _3, "comcast": _3, "commbank": _3, "community": { "$": 1, "succ": { "ravendb": _5, "myforum": _5 } }, "company": _3, "compare": _3, "computer": _3, "comsec": _3, "condos": _3, "construction": _3, "consulting": _3, "contact": _3, "contractors": _3, "cooking": _3, "cookingchannel": _3, "cool": { "$": 1, "succ": { "de": _5 } }, "corsica": _3, "country": _3, "coupon": _3, "coupons": _3, "courses": _3, "cpa": _3, "credit": _3, "creditcard": _3, "creditunion": _3, "cricket": _3, "crown": _3, "crs": _3, "cruise": _3, "cruises": _3, "csc": _3, "cuisinella": _3, "cymru": _3, "cyou": _3, "dabur": _3, "dad": _3, "dance": _3, "data": _3, "date": _3, "dating": _3, "datsun": _3, "day": _3, "dclk": _3, "dds": _3, "deal": _3, "dealer": _3, "deals": _3, "degree": _3, "delivery": _3, "dell": _3, "deloitte": _3, "delta": _3, "democrat": _3, "dental": _3, "dentist": _3, "desi": _3, "design": { "$": 1, "succ": { "bss": _5 } }, "dev": { "$": 1, "succ": { "lcl": _8, "stg": _8, "workers": _5, "curv": _5, "fly": _5, "iserv": _5, "loginline": _5, "platter-app": _5, "vercel": _5, "webhare": _8 } }, "dhl": _3, "diamonds": _3, "diet": _3, "digital": { "$": 1, "succ": { "cloudapps": { "$": 2, "succ": { "london": _5 } } } }, "direct": _3, "directory": _3, "discount": _3, "discover": _3, "dish": _3, "diy": _3, "dnp": _3, "docs": _3, "doctor": _3, "dog": _3, "domains": _3, "dot": _3, "download": _3, "drive": _3, "dtv": _3, "dubai": _3, "duck": _3, "dunlop": _3, "dupont": _3, "durban": _3, "dvag": _3, "dvr": _3, "earth": { "$": 1, "succ": { "dapps": { "$": 0, "succ": { "*": _5, "bzz": _8 } } } }, "eat": _3, "eco": _3, "edeka": _3, "education": _11, "email": _3, "emerck": _3, "energy": _3, "engineer": _3, "engineering": _3, "enterprises": _3, "epson": _3, "equipment": _3, "ericsson": _3, "erni": _3, "esq": _3, "estate": { "$": 1, "succ": { "compute": _8 } }, "etisalat": _3, "eurovision": _3, "eus": { "$": 1, "succ": { "party": _19 } }, "events": _11, "exchange": _3, "expert": _3, "exposed": _3, "express": _3, "extraspace": _3, "fage": _3, "fail": _3, "fairwinds": _3, "faith": _20, "family": _3, "fan": _3, "fans": _3, "farm": { "$": 1, "succ": { "storj": _5 } }, "farmers": _3, "fashion": { "$": 1, "succ": { "of": _5, "on": _5 } }, "fast": _3, "fedex": _3, "feedback": _3, "ferrari": _3, "ferrero": _3, "fiat": _3, "fidelity": _3, "fido": _3, "film": _3, "final": _3, "finance": _3, "financial": _11, "fire": _3, "firestone": _3, "firmdale": _3, "fish": _3, "fishing": _3, "fit": { "$": 1, "succ": { "ptplus": _5 } }, "fitness": _3, "flickr": _3, "flights": _3, "flir": _3, "florist": _3, "flowers": _3, "fly": _3, "foo": _3, "food": _3, "foodnetwork": _3, "football": { "$": 1, "succ": { "of": _5 } }, "ford": _3, "forex": _3, "forsale": _3, "forum": _3, "foundation": _3, "fox": _3, "free": _3, "fresenius": _3, "frl": _3, "frogans": _3, "frontdoor": _3, "frontier": _3, "ftr": _3, "fujitsu": _3, "fujixerox": _3, "fun": _3, "fund": _3, "furniture": _3, "futbol": _3, "fyi": _3, "gal": _3, "gallery": _3, "gallo": _3, "gallup": _3, "game": _3, "games": _3, "gap": _3, "garden": _3, "gay": _3, "gbiz": _3, "gdn": { "$": 1, "succ": { "cnpy": _5 } }, "gea": _3, "gent": _3, "genting": _3, "george": _3, "ggee": _3, "gift": _3, "gifts": _3, "gives": _3, "giving": _3, "glade": _3, "glass": _3, "gle": _3, "global": _3, "globo": _3, "gmail": _3, "gmbh": _3, "gmo": _3, "gmx": _3, "godaddy": _3, "gold": _3, "goldpoint": _3, "golf": _3, "goo": _3, "goodyear": _3, "goog": { "$": 1, "succ": { "cloud": _5 } }, "google": _3, "gop": _3, "got": _3, "grainger": _3, "graphics": _3, "gratis": _3, "green": _3, "gripe": _3, "grocery": _3, "group": { "$": 1, "succ": { "discourse": _5 } }, "guardian": _3, "gucci": _3, "guge": _3, "guide": _3, "guitars": _3, "guru": _3, "hair": _3, "hamburg": _3, "hangout": _3, "haus": _3, "hbo": _3, "hdfc": _3, "hdfcbank": _3, "health": _3, "healthcare": _3, "help": _3, "helsinki": _3, "here": _3, "hermes": _3, "hgtv": _3, "hiphop": _3, "hisamitsu": _3, "hitachi": _3, "hiv": _3, "hkt": _3, "hockey": _3, "holdings": _3, "holiday": _3, "homedepot": _3, "homegoods": _3, "homes": _3, "homesense": _3, "honda": _3, "horse": _3, "hospital": _3, "host": { "$": 1, "succ": { "cloudaccess": _5, "freesite": _5, "fastvps": _5, "myfast": _5, "jele": _5, "mircloud": _5, "pcloud": _5, "half": _5 } }, "hosting": { "$": 1, "succ": { "opencraft": _5 } }, "hot": _3, "hoteles": _3, "hotels": _3, "hotmail": _3, "house": _3, "how": _3, "hsbc": _3, "hughes": _3, "hyatt": _3, "hyundai": _3, "ibm": _3, "icbc": _3, "ice": _3, "icu": _3, "ieee": _3, "ifm": _3, "ikano": _3, "imamat": _3, "imdb": _3, "immo": _3, "immobilien": _3, "inc": _3, "industries": _3, "infiniti": _3, "ing": _3, "ink": _12, "institute": _3, "insurance": _3, "insure": _3, "intel": _3, "international": _3, "intuit": _3, "investments": _3, "ipiranga": _3, "irish": _3, "ismaili": _3, "ist": _3, "istanbul": _3, "itau": _3, "itv": _3, "iveco": _3, "jaguar": _3, "java": _3, "jcb": _3, "jcp": _3, "jeep": _3, "jetzt": _3, "jewelry": _3, "jio": _3, "jll": _3, "jmp": _3, "jnj": _3, "joburg": _3, "jot": _3, "joy": _3, "jpmorgan": _3, "jprs": _3, "juegos": _3, "juniper": _3, "kaufen": _3, "kddi": _3, "kerryhotels": _3, "kerrylogistics": _3, "kerryproperties": _3, "kfh": _3, "kia": _3, "kim": _3, "kinder": _3, "kindle": _3, "kitchen": _3, "kiwi": _3, "koeln": _3, "komatsu": _3, "kosher": _3, "kpmg": _3, "kpn": _3, "krd": { "$": 1, "succ": { "co": _5, "edu": _5 } }, "kred": _3, "kuokgroup": _3, "kyoto": _3, "lacaixa": _3, "lamborghini": _3, "lamer": _3, "lancaster": _3, "lancia": _3, "land": { "$": 1, "succ": { "static": { "$": 2, "succ": { "dev": _5, "sites": _5 } } } }, "landrover": _3, "lanxess": _3, "lasalle": _3, "lat": _3, "latino": _3, "latrobe": _3, "law": _3, "lawyer": _3, "lds": _3, "lease": _3, "leclerc": _3, "lefrak": _3, "legal": _3, "lego": _3, "lexus": _3, "lgbt": _3, "lidl": _3, "life": _3, "lifeinsurance": _3, "lifestyle": _3, "lighting": _3, "like": _3, "lilly": _3, "limited": _3, "limo": _3, "lincoln": _3, "linde": _3, "link": { "$": 1, "succ": { "cyon": _5, "mypep": _5, "dweb": _8 } }, "lipsy": _3, "live": _3, "living": _3, "lixil": _3, "llc": _3, "llp": _3, "loan": _3, "loans": _3, "locker": _3, "locus": _3, "loft": _3, "lol": _3, "london": { "$": 1, "succ": { "in": _5, "of": _5 } }, "lotte": _3, "lotto": _3, "love": _3, "lpl": _3, "lplfinancial": _3, "ltd": _3, "ltda": _3, "lundbeck": _3, "lupin": _3, "luxe": _3, "luxury": _3, "macys": _3, "madrid": _3, "maif": _3, "maison": _3, "makeup": _3, "man": _3, "management": { "$": 1, "succ": { "router": _5 } }, "mango": _3, "map": _3, "market": _3, "marketing": _3, "markets": _3, "marriott": _3, "marshalls": _3, "maserati": _3, "mattel": _3, "mba": _3, "mckinsey": _3, "med": _3, "media": _3, "meet": _3, "melbourne": _3, "meme": _3, "memorial": _3, "men": _25, "menu": _26, "merckmsd": _3, "metlife": _3, "miami": _3, "microsoft": _3, "mini": _3, "mint": _3, "mit": _3, "mitsubishi": _3, "mlb": _3, "mls": _3, "mma": _3, "mobile": _3, "moda": _3, "moe": _3, "moi": _3, "mom": { "$": 1, "succ": { "and": _5, "for": _5 } }, "monash": _3, "money": _3, "monster": _3, "mormon": _3, "mortgage": _3, "moscow": _3, "moto": _3, "motorcycles": _3, "mov": _3, "movie": _3, "msd": _3, "mtn": _3, "mtr": _3, "mutual": _3, "nab": _3, "nagoya": _3, "nationwide": _3, "natura": _3, "navy": _3, "nba": _3, "nec": _3, "netbank": _3, "netflix": _3, "network": { "$": 1, "succ": { "alces": _8, "co": _5, "arvo": _5, "azimuth": _5 } }, "neustar": _3, "new": _3, "newholland": _3, "news": _3, "next": _3, "nextdirect": _3, "nexus": _3, "nfl": _3, "ngo": _3, "nhk": _3, "nico": _3, "nike": _3, "nikon": _3, "ninja": _3, "nissan": _3, "nissay": _3, "nokia": _3, "northwesternmutual": _3, "norton": _3, "now": _3, "nowruz": _3, "nowtv": _3, "nra": _3, "nrw": _3, "ntt": _3, "nyc": _3, "obi": _3, "observer": _3, "off": _3, "office": _3, "okinawa": _3, "olayan": _3, "olayangroup": _3, "oldnavy": _3, "ollo": _3, "omega": _3, "one": { "$": 1, "succ": { "onred": { "$": 2, "succ": { "staging": _5 } }, "for": _5, "homelink": _5 } }, "ong": _3, "onl": _3, "online": _26, "onyourside": _3, "ooo": _3, "open": _3, "oracle": _3, "orange": _3, "organic": _3, "origins": _3, "osaka": _3, "otsuka": _3, "ott": _3, "ovh": { "$": 1, "succ": { "nerdpol": _5 } }, "page": { "$": 1, "succ": { "pdns": _5, "plesk": _5, "prvcy": _5 } }, "panasonic": _3, "paris": _3, "pars": _3, "partners": _3, "parts": _3, "party": _20, "passagens": _3, "pay": _3, "pccw": _3, "pet": _3, "pfizer": _3, "pharmacy": _3, "phd": _3, "philips": _3, "phone": _3, "photo": _3, "photography": _3, "photos": _3, "physio": _3, "pics": _3, "pictet": _3, "pictures": { "$": 1, "succ": { "1337": _5 } }, "pid": _3, "pin": _3, "ping": _3, "pink": _3, "pioneer": _3, "pizza": _3, "place": _11, "play": _3, "playstation": _3, "plumbing": _3, "plus": _3, "pnc": _3, "pohl": _3, "poker": _3, "politie": _3, "porn": { "$": 1, "succ": { "indie": _5 } }, "pramerica": _3, "praxi": _3, "press": _3, "prime": _3, "prod": _3, "productions": _3, "prof": _3, "progressive": _3, "promo": _3, "properties": _3, "property": _3, "protection": _3, "pru": _3, "prudential": _3, "pub": _26, "pwc": _3, "qpon": _3, "quebec": _3, "quest": _3, "qvc": _3, "racing": _3, "radio": _3, "raid": _3, "read": _3, "realestate": _3, "realtor": _3, "realty": _3, "recipes": _3, "red": _3, "redstone": _3, "redumbrella": _3, "rehab": _3, "reise": _3, "reisen": _3, "reit": _3, "reliance": _3, "ren": _3, "rent": _3, "rentals": _3, "repair": _3, "report": _3, "republican": _3, "rest": _3, "restaurant": _3, "review": _20, "reviews": _3, "rexroth": _3, "rich": _3, "richardli": _3, "ricoh": _3, "ril": _3, "rio": _3, "rip": { "$": 1, "succ": { "clan": _5 } }, "rmit": _3, "rocher": _3, "rocks": { "$": 1, "succ": { "myddns": _5, "lima-city": _5, "webspace": _5 } }, "rodeo": _3, "rogers": _3, "room": _3, "rsvp": _3, "rugby": _3, "ruhr": _3, "run": { "$": 1, "succ": { "hs": _5, "development": _5, "ravendb": _5, "repl": _5 } }, "rwe": _3, "ryukyu": _3, "saarland": _3, "safe": _3, "safety": _3, "sakura": _3, "sale": _25, "salon": _3, "samsclub": _3, "samsung": _3, "sandvik": _3, "sandvikcoromant": _3, "sanofi": _3, "sap": _3, "sarl": _3, "sas": _3, "save": _3, "saxo": _3, "sbi": _3, "sbs": _3, "sca": _3, "scb": _3, "schaeffler": _3, "schmidt": _3, "scholarships": _3, "school": _12, "schule": _3, "schwarz": _3, "science": _20, "scjohnson": _3, "scot": { "$": 1, "succ": { "gov": _5 } }, "search": _3, "seat": _3, "secure": _3, "security": _3, "seek": _3, "select": _3, "sener": _3, "services": { "$": 1, "succ": { "loginline": _5 } }, "ses": _3, "seven": _3, "sew": _3, "sex": _3, "sexy": _3, "sfr": _3, "shangrila": _3, "sharp": _3, "shaw": _3, "shell": _3, "shia": _3, "shiksha": _3, "shoes": _3, "shop": _26, "shopping": _3, "shouji": _3, "show": _3, "showtime": _3, "shriram": _3, "silk": _3, "sina": _3, "singles": _3, "site": { "$": 1, "succ": { "cloudera": _5, "cyon": _5, "fastvps": _5, "jele": _5, "lelux": _5, "loginline": _5, "barsy": _5, "opensocial": _5, "platformsh": _8, "byen": _5, "mintere": _5 } }, "ski": _3, "skin": _3, "sky": _3, "skype": _3, "sling": _3, "smart": _3, "smile": _3, "sncf": _3, "soccer": _3, "social": _3, "softbank": _3, "software": _3, "sohu": _3, "solar": _3, "solutions": _3, "song": _3, "sony": _3, "soy": _3, "spa": _3, "space": { "$": 1, "succ": { "myfast": _5, "linkitools": _5, "uber": _5, "xs4all": _5 } }, "sport": _3, "spot": _3, "spreadbetting": _3, "srl": _3, "stada": _3, "staples": _3, "star": _3, "statebank": _3, "statefarm": _3, "stc": _3, "stcgroup": _3, "stockholm": _3, "storage": _3, "store": { "$": 1, "succ": { "shopware": _5 } }, "stream": _3, "studio": _3, "study": _3, "style": _3, "sucks": _3, "supplies": _3, "supply": _3, "support": _26, "surf": _3, "surgery": _3, "suzuki": _3, "swatch": _3, "swiftcover": _3, "swiss": _3, "sydney": _3, "systems": { "$": 1, "succ": { "knightpoint": _5 } }, "tab": _3, "taipei": _3, "talk": _3, "taobao": _3, "target": _3, "tatamotors": _3, "tatar": _3, "tattoo": _3, "tax": _3, "taxi": _3, "tci": _3, "tdk": _3, "team": { "$": 1, "succ": { "discourse": _5, "jelastic": _5 } }, "tech": _3, "technology": _11, "temasek": _3, "tennis": _3, "teva": _3, "thd": _3, "theater": _3, "theatre": _3, "tiaa": _3, "tickets": _3, "tienda": _3, "tiffany": _3, "tips": _3, "tires": _3, "tirol": _3, "tjmaxx": _3, "tjx": _3, "tkmaxx": _3, "tmall": _3, "today": _3, "tokyo": _3, "tools": _3, "top": { "$": 1, "succ": { "now-dns": _5, "ntdll": _5 } }, "toray": _3, "toshiba": _3, "total": _3, "tours": _3, "town": _3, "toyota": _3, "toys": _3, "trade": _20, "trading": _3, "training": _3, "travel": _3, "travelchannel": _3, "travelers": _3, "travelersinsurance": _3, "trust": _3, "trv": _3, "tube": _3, "tui": _3, "tunes": _3, "tushu": _3, "tvs": _3, "ubank": _3, "ubs": _3, "unicom": _3, "university": _3, "uno": _3, "uol": _3, "ups": _3, "vacations": _3, "vana": _3, "vanguard": _3, "vegas": _3, "ventures": _3, "verisign": _3, "versicherung": _3, "vet": _3, "viajes": _3, "video": _3, "vig": _3, "viking": _3, "villas": _3, "vin": _3, "vip": _3, "virgin": _3, "visa": _3, "vision": _3, "viva": _3, "vivo": _3, "vlaanderen": _3, "vodka": _3, "volkswagen": _3, "volvo": _3, "vote": _3, "voting": _3, "voto": _3, "voyage": _3, "vuelos": _3, "wales": _3, "walmart": _3, "walter": _3, "wang": _3, "wanggou": _3, "watch": _3, "watches": _3, "weather": _3, "weatherchannel": _3, "webcam": _3, "weber": _3, "website": _3, "wed": _3, "wedding": _3, "weibo": _3, "weir": _3, "whoswho": _3, "wien": _3, "wiki": _3, "williamhill": _3, "win": _3, "windows": _3, "wine": _3, "winners": _3, "wme": _3, "wolterskluwer": _3, "woodside": _3, "work": { "$": 1, "succ": { "of": _5, "to": _5 } }, "works": _3, "world": _3, "wow": _3, "wtc": _3, "wtf": _3, "xbox": _3, "xerox": _3, "xfinity": _3, "xihuan": _3, "xin": _3, "xn--11b4c3d": _3, "?????????": _3, "xn--1ck2e1b": _3, "?????????": _3, "xn--1qqw23a": _3, "??????": _3, "xn--30rr7y": _3, "??????": _3, "xn--3bst00m": _3, "??????": _3, "xn--3ds443g": _3, "??????": _3, "xn--3oq18vl8pn36a": _3, "????????????": _3, "xn--3pxu8k": _3, "??????": _3, "xn--42c2d9a": _3, "?????????": _3, "xn--45q11c": _3, "??????": _3, "xn--4gbrim": _3, "????????": _3, "xn--55qw42g": _3, "??????": _3, "xn--55qx5d": _3, "??????": _3, "xn--5su34j936bgsg": _3, "????????????": _3, "xn--5tzm5g": _3, "??????": _3, "xn--6frz82g": _3, "??????": _3, "xn--6qq986b3xl": _3, "?????????": _3, "xn--80adxhks": _3, "????????????": _3, "xn--80aqecdr1a": _3, "??????????????": _3, "xn--80asehdb": _3, "????????????": _3, "xn--80aswg": _3, "????????": _3, "xn--8y0a063a": _3, "??????": _3, "xn--9dbq2a": _3, "??????": _3, "xn--9et52u": _3, "??????": _3, "xn--9krt00a": _3, "??????": _3, "xn--b4w605ferd": _3, "?????????": _3, "xn--bck1b9a5dre4c": _3, "??????????????????": _3, "xn--c1avg": _3, "??????": _3, "xn--c2br7g": _3, "?????????": _3, "xn--cck2b3b": _3, "?????????": _3, "xn--cckwcxetd": _3, "????????????": _3, "xn--cg4bki": _3, "??????": _3, "xn--czr694b": _3, "??????": _3, "xn--czrs0t": _3, "??????": _3, "xn--czru2d": _3, "??????": _3, "xn--d1acj3b": _3, "????????": _3, "xn--eckvdtc9d": _3, "????????????": _3, "xn--efvy88h": _3, "??????": _3, "xn--fct429k": _3, "??????": _3, "xn--fhbei": _3, "??????": _3, "xn--fiq228c5hs": _3, "?????????": _3, "xn--fiq64b": _3, "??????": _3, "xn--fjq720a": _3, "??????": _3, "xn--flw351e": _3, "??????": _3, "xn--fzys8d69uvgm": _3, "????????????": _3, "xn--g2xx48c": _3, "??????": _3, "xn--gckr3f0f": _3, "????????????": _3, "xn--gk3at1e": _3, "??????": _3, "xn--hxt814e": _3, "??????": _3, "xn--i1b6b1a6a2e": _3, "???????????????": _3, "xn--imr513n": _3, "??????": _3, "xn--io0a7i": _3, "??????": _3, "xn--j1aef": _3, "??????": _3, "xn--jlq480n2rg": _3, "?????????": _3, "xn--jlq61u9w7b": _3, "?????????": _3, "xn--jvr189m": _3, "??????": _3, "xn--kcrx77d1x4a": _3, "?????????": _3, "xn--kput3i": _3, "??????": _3, "xn--mgba3a3ejt": _3, "????????????": _3, "xn--mgba7c0bbn0a": _3, "??????????????": _3, "xn--mgbaakc7dvf": _3, "??????????????": _3, "xn--mgbab2bd": _3, "??????????": _3, "xn--mgbca7dzdo": _3, "????????????": _3, "xn--mgbi4ecexp": _3, "??????????????": _3, "xn--mgbt3dhd": _3, "??????????": _3, "xn--mk1bu44c": _3, "??????": _3, "xn--mxtq1m": _3, "??????": _3, "xn--ngbc5azd": _3, "????????": _3, "xn--ngbe9e0a": _3, "????????": _3, "xn--ngbrx": _3, "??????": _3, "xn--nqv7f": _3, "??????": _3, "xn--nqv7fs00ema": _3, "????????????": _3, "xn--nyqy26a": _3, "??????": _3, "xn--otu796d": _3, "??????": _3, "xn--p1acf": _3, "??????": _3, "xn--pssy2u": _3, "??????": _3, "xn--q9jyb4c": _3, "?????????": _3, "xn--qcka1pmc": _3, "????????????": _3, "xn--rhqv96g": _3, "??????": _3, "xn--rovu88b": _3, "??????": _3, "xn--ses554g": _3, "??????": _3, "xn--t60b56a": _3, "??????": _3, "xn--tckwe": _3, "??????": _3, "xn--tiq49xqyj": _3, "?????????": _3, "xn--unup4y": _3, "??????": _3, "xn--vermgensberater-ctb": _3, "verm??gensberater": _3, "xn--vermgensberatung-pwb": _3, "verm??gensberatung": _3, "xn--vhquv": _3, "??????": _3, "xn--vuq861b": _3, "??????": _3, "xn--w4r85el8fhu5dnra": _3, "???????????????": _3, "xn--w4rs40l": _3, "??????": _3, "xn--xhq521b": _3, "??????": _3, "xn--zfr164b": _3, "??????": _3, "xyz": { "$": 1, "succ": { "blogsite": _5, "fhapp": _5, "crafting": _5, "zapto": _5, "telebit": _8 } }, "yachts": _3, "yahoo": _3, "yamaxun": _3, "yandex": _3, "yodobashi": _3, "yoga": _3, "yokohama": _3, "you": _3, "youtube": _3, "yun": _3, "zappos": _3, "zara": _3, "zero": _3, "zip": _3, "zone": { "$": 1, "succ": { "cloud66": _5, "hs": _5, "triton": _8, "lima": _5 } }, "zuerich": _3 } };
    return rules;
})();

/**
 * Lookup parts of domain in Trie
 */
function lookupInTrie(parts, trie, index, allowedMask) {
    let result = null;
    let node = trie;
    while (node !== undefined) {
        // We have a match!
        if ((node.$ & allowedMask) !== 0) {
            result = {
                index: index + 1,
                isIcann: node.$ === 1 /* ICANN */,
                isPrivate: node.$ === 2 /* PRIVATE */,
            };
        }
        // No more `parts` to look for
        if (index === -1) {
            break;
        }
        const succ = node.succ;
        node = succ && (succ[parts[index]] || succ['*']);
        index -= 1;
    }
    return result;
}
/**
 * Check if `hostname` has a valid public suffix in `trie`.
 */
function suffixLookup(hostname, options, out) {
    if (fastPathLookup(hostname, options, out) === true) {
        return;
    }
    const hostnameParts = hostname.split('.');
    const allowedMask = (options.allowPrivateDomains === true ? 2 /* PRIVATE */ : 0) |
        (options.allowIcannDomains === true ? 1 /* ICANN */ : 0);
    // Look for exceptions
    const exceptionMatch = lookupInTrie(hostnameParts, exceptions, hostnameParts.length - 1, allowedMask);
    if (exceptionMatch !== null) {
        out.isIcann = exceptionMatch.isIcann;
        out.isPrivate = exceptionMatch.isPrivate;
        out.publicSuffix = hostnameParts.slice(exceptionMatch.index + 1).join('.');
        return;
    }
    // Look for a match in rules
    const rulesMatch = lookupInTrie(hostnameParts, rules, hostnameParts.length - 1, allowedMask);
    if (rulesMatch !== null) {
        out.isIcann = rulesMatch.isIcann;
        out.isPrivate = rulesMatch.isPrivate;
        out.publicSuffix = hostnameParts.slice(rulesMatch.index).join('.');
        return;
    }
    // No match found...
    // Prevailing rule is '*' so we consider the top-level domain to be the
    // public suffix of `hostname` (e.g.: 'example.org' => 'org').
    out.isIcann = false;
    out.isPrivate = false;
    out.publicSuffix = hostnameParts[hostnameParts.length - 1];
}

// For all methods but 'parse', it does not make sense to allocate an object
// every single time to only return the value of a specific attribute. To avoid
// this un-necessary allocation, we use a global object which is re-used.
const RESULT = getEmptyResult();
function parse(url, options = {}) {
    return parseImpl(url, 5 /* ALL */, suffixLookup, options, getEmptyResult());
}
function getHostname(url, options = {}) {
    resetResult(RESULT);
    return parseImpl(url, 0 /* HOSTNAME */, suffixLookup, options, RESULT).hostname;
}
function getPublicSuffix(url, options = {}) {
    resetResult(RESULT);
    return parseImpl(url, 2 /* PUBLIC_SUFFIX */, suffixLookup, options, RESULT).publicSuffix;
}
function getDomain$1(url, options = {}) {
    resetResult(RESULT);
    return parseImpl(url, 3 /* DOMAIN */, suffixLookup, options, RESULT).domain;
}
function getSubdomain$1(url, options = {}) {
    resetResult(RESULT);
    return parseImpl(url, 4 /* SUB_DOMAIN */, suffixLookup, options, RESULT).subdomain;
}
function getDomainWithoutSuffix$1(url, options = {}) {
    resetResult(RESULT);
    return parseImpl(url, 5 /* ALL */, suffixLookup, options, RESULT).domainWithoutSuffix;
}

exports.getDomain = getDomain$1;
exports.getDomainWithoutSuffix = getDomainWithoutSuffix$1;
exports.getHostname = getHostname;
exports.getPublicSuffix = getPublicSuffix;
exports.getSubdomain = getSubdomain$1;
exports.parse = parse;


},{}],10:[function(require,module,exports){
"use strict";

var fetch = function fetch(message) {
  return new Promise(function (resolve, reject) {
    window.chrome.runtime.sendMessage(message, function (result) {
      return resolve(result);
    });
  });
};

var backgroundMessage = function backgroundMessage(thisModel) {
  // listen for messages from background and
  // // notify subscribers
  window.chrome.runtime.onMessage.addListener(function (req, sender) {
    if (sender.id !== chrome.runtime.id) return;
    if (req.whitelistChanged) thisModel.send('whitelistChanged');
    if (req.updateTabData) thisModel.send('updateTabData');
    if (req.didResetTrackersData) thisModel.send('didResetTrackersData', req.didResetTrackersData);
    if (req.closePopup) window.close();
  });
};

var getBackgroundTabData = function getBackgroundTabData() {
  return new Promise(function (resolve, reject) {
    fetch({
      getCurrentTab: true
    }).then(function (tab) {
      if (tab) {
        fetch({
          getTab: tab.id
        }).then(function (backgroundTabObj) {
          resolve(backgroundTabObj);
        });
      }
    });
  });
};

var search = function search(url) {
  window.chrome.tabs.create({
    url: "https://duckduckgo.com/?q=".concat(url, "&bext=").concat(window.localStorage['os'], "cr")
  });
};

var getExtensionURL = function getExtensionURL(path) {
  return chrome.extension.getURL(path);
};

var openExtensionPage = function openExtensionPage(path) {
  window.chrome.tabs.create({
    url: getExtensionURL(path)
  });
};

var openOptionsPage = function openOptionsPage(browser) {
  if (browser === 'moz') {
    openExtensionPage('/html/options.html');
    window.close();
  } else {
    window.chrome.runtime.openOptionsPage();
  }
};

var reloadTab = function reloadTab(id) {
  window.chrome.tabs.reload(id);
};

var closePopup = function closePopup() {
  var w = window.chrome.extension.getViews({
    type: 'popup'
  })[0];
  w.close();
};

module.exports = {
  fetch: fetch,
  reloadTab: reloadTab,
  closePopup: closePopup,
  backgroundMessage: backgroundMessage,
  getBackgroundTabData: getBackgroundTabData,
  search: search,
  openOptionsPage: openOptionsPage,
  openExtensionPage: openExtensionPage,
  getExtensionURL: getExtensionURL
};

},{}],11:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

var browserUIWrapper = require('./../base/chrome-ui-wrapper.es6.js');
/**
 * Background messaging is done via two methods:
 *
 * 1. Passive messages from background -> backgroundMessage model -> subscribing model
 *
 *  The background sends these messages using chrome.runtime.sendMessage({'name': 'value'})
 *  The backgroundMessage model (here) receives the message and forwards the
 *  it to the global event store via model.send(msg)
 *  Other modules that are subscribed to state changes in backgroundMessage are notified
 *
 * 2. Two-way messaging using this.model.fetch() as a passthrough
 *
 *  Each model can use a fetch method to send and receive a response from the background.
 *  Ex: this.model.fetch({'name': 'value'}).then((response) => console.log(response))
 *  Listeners must be registered in the background to respond to messages with this 'name'.
 *
 *  The common fetch method is defined in base/model.es6.js
 */


function BackgroundMessage(attrs) {
  Parent.call(this, attrs);
  var thisModel = this;
  browserUIWrapper.backgroundMessage(thisModel);
}

BackgroundMessage.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'backgroundMessage'
});
module.exports = BackgroundMessage;

},{"./../base/chrome-ui-wrapper.es6.js":10}],12:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

function PrivacyOptions(attrs) {
  // set some default values for the toggle switches in the template
  attrs.trackerBlockingEnabled = true;
  attrs.httpsEverywhereEnabled = true;
  attrs.embeddedTweetsEnabled = false;
  attrs.GPC = false;
  Parent.call(this, attrs);
}

PrivacyOptions.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'privacyOptions',
  toggle: function toggle(k) {
    if (this.hasOwnProperty(k)) {
      this[k] = !this[k];
      console.log("PrivacyOptions model toggle ".concat(k, " is now ").concat(this[k]));
      this.fetch({
        updateSetting: {
          name: k,
          value: this[k]
        }
      });
    }
  },
  getSettings: function getSettings() {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.fetch({
        getSetting: 'all'
      }).then(function (settings) {
        self.trackerBlockingEnabled = settings['trackerBlockingEnabled'];
        self.httpsEverywhereEnabled = settings['httpsEverywhereEnabled'];
        self.embeddedTweetsEnabled = settings['embeddedTweetsEnabled'];
        self.GPC = settings['GPC'];
        resolve();
      });
    });
  }
});
module.exports = PrivacyOptions;

},{}],13:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

var tldts = require('tldts');

function Whitelist(attrs) {
  attrs.list = {};
  Parent.call(this, attrs);
  this.setWhitelistFromSettings();
}

Whitelist.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'whitelist',
  removeDomain: function removeDomain(itemIndex) {
    var domain = this.list[itemIndex];
    console.log("whitelist: remove ".concat(domain));
    this.fetch({
      'whitelisted': {
        list: 'whitelisted',
        domain: domain,
        value: false
      }
    }); // Remove domain whitelist opt-in status, if present

    this.fetch({
      'whitelistOptIn': {
        list: 'whitelistOptIn',
        domain: domain,
        value: false
      }
    }); // Update list
    // use splice() so it reindexes the array

    this.list.splice(itemIndex, 1);
  },
  addDomain: function addDomain(url) {
    // We only whitelist domains, not full URLs:
    // - use getDomain, it will return null if the URL is invalid
    // - prefix with getSubDomain, which returns an empty string if none is found
    // But first, strip the 'www.' part, otherwise getSubDomain will include it
    // and whitelisting won't work for that site
    url = url ? url.replace('www.', '') : '';
    var localDomain = url.match(/^localhost(:[0-9]+)?$/i) ? 'localhost' : null;
    var subDomain = tldts.getSubdomain(url);
    var domain = tldts.getDomain(url) || localDomain;

    if (domain) {
      var domainToWhitelist = subDomain ? subDomain + '.' + domain : domain;
      console.log("whitelist: add ".concat(domainToWhitelist));
      this.fetch({
        'whitelisted': {
          list: 'whitelisted',
          domain: domainToWhitelist,
          value: true
        }
      });
      this.setWhitelistFromSettings();
    }

    return domain;
  },
  setWhitelistFromSettings: function setWhitelistFromSettings() {
    var self = this;
    this.fetch({
      getSetting: {
        name: 'whitelisted'
      }
    }).then(function (whitelist) {
      whitelist = whitelist || {};
      var wlist = Object.keys(whitelist);
      wlist.sort(); // Publish whitelist change notification via the store
      // used to know when to rerender the view

      self.set('list', wlist);
    });
  }
});
module.exports = Whitelist;

},{"tldts":9}],14:[function(require,module,exports){
"use strict";

module.exports = {
  setBrowserClassOnBodyTag: function setBrowserClassOnBodyTag() {
    window.chrome.runtime.sendMessage({
      'getBrowser': true
    }, function (browser) {
      if (['edg', 'edge', 'brave'].includes(browser)) {
        browser = 'chrome';
      }

      var browserClass = 'is-browser--' + browser;
      window.$('html').addClass(browserClass);
      window.$('body').addClass(browserClass);
    });
  }
};

},{}],15:[function(require,module,exports){
"use strict";

module.exports = {
  setBrowserClassOnBodyTag: require('./chrome-set-browser-class.es6.js'),
  parseQueryString: require('./parse-query-string.es6.js')
};

},{"./chrome-set-browser-class.es6.js":14,"./parse-query-string.es6.js":16}],16:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = {
  parseQueryString: function parseQueryString(qs) {
    if (typeof qs !== 'string') {
      throw new Error('tried to parse a non-string query string');
    }

    var parsed = {};

    if (qs[0] === '?') {
      qs = qs.substr(1);
    }

    var parts = qs.split('&');
    parts.forEach(function (part) {
      var _part$split = part.split('='),
          _part$split2 = _slicedToArray(_part$split, 2),
          key = _part$split2[0],
          val = _part$split2[1];

      if (key && val) {
        parsed[key] = val;
      }
    });
    return parsed;
  }
};

},{}],17:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Page;

var mixins = require('./mixins/index.es6.js');

var PrivacyOptionsView = require('./../views/privacy-options.es6.js');

var PrivacyOptionsModel = require('./../models/privacy-options.es6.js');

var privacyOptionsTemplate = require('./../templates/privacy-options.es6.js');

var WhitelistView = require('./../views/whitelist.es6.js');

var WhitelistModel = require('./../models/whitelist.es6.js');

var whitelistTemplate = require('./../templates/whitelist.es6.js');

var BackgroundMessageModel = require('./../models/background-message.es6.js');

var browserUIWrapper = require('./../base/chrome-ui-wrapper.es6.js');

function Options(ops) {
  Parent.call(this, ops);
}

Options.prototype = window.$.extend({}, Parent.prototype, mixins.setBrowserClassOnBodyTag, {
  pageName: 'options',
  ready: function ready() {
    var $parent = window.$('#options-content');
    Parent.prototype.ready.call(this);
    this.setBrowserClassOnBodyTag();
    window.$('.js-feedback-link').click(this._onFeedbackClick.bind(this));
    window.$('.js-report-site-link').click(this._onReportSiteClick.bind(this));
    this.views.options = new PrivacyOptionsView({
      pageView: this,
      model: new PrivacyOptionsModel({}),
      appendTo: $parent,
      template: privacyOptionsTemplate
    });
    this.views.whitelist = new WhitelistView({
      pageView: this,
      model: new WhitelistModel({}),
      appendTo: $parent,
      template: whitelistTemplate
    });
    this.message = new BackgroundMessageModel({});
  },
  _onFeedbackClick: function _onFeedbackClick(e) {
    e.preventDefault();
    browserUIWrapper.openExtensionPage("/html/feedback.html");
  },
  _onReportSiteClick: function _onReportSiteClick(e) {
    e.preventDefault();
    browserUIWrapper.openExtensionPage("/html/feedback.html?broken=1");
  }
}); // kickoff!

window.DDG = window.DDG || {};
window.DDG.page = new Options();

},{"./../base/chrome-ui-wrapper.es6.js":10,"./../models/background-message.es6.js":11,"./../models/privacy-options.es6.js":12,"./../models/whitelist.es6.js":13,"./../templates/privacy-options.es6.js":18,"./../templates/whitelist.es6.js":21,"./../views/privacy-options.es6.js":22,"./../views/whitelist.es6.js":23,"./mixins/index.es6.js":15}],18:[function(require,module,exports){
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["<section class=\"options-content__privacy divider-bottom\">\n    <h2 class=\"menu-title\">Options</h2>\n    <ul class=\"default-list\">\n        <li>\n            Show embedded Tweets\n            ", "\n        </li>\n        <li class=\"options-content__gpc-enabled\">\n            <h2 class=\"menu-title\">Global Privacy Control (GPC)</h2>\n            <p class=\"menu-paragraph\">\n                Your data shouldn't be for sale. At DuckDuckGo, we agree.\n                Activate the \"Global Privacy Control\" (GPC) settings and we'll\n                signal to websites your preference to:\n            </p>\n            <ul>\n                <li>\n                    Not sell your personal data.\n                </li>\n                <li>\n                    Limit sharing of your personal data to other companies.\n                </li>\n            </ul>\n            Global Privacy Control (GPC)\n            ", "\n            <p class=\"gpc-disclaimer\">\n                <b>\n                    Since Global Privacy Control (GPC) is a new standard,\n                    most websites won't recognize it yet, but we're working hard\n                    to ensure it becomes accepted worldwide.\n                </b>\n                However, websites are only required to act on the signal to the\n                extent applicable laws compel them to do so.\n                <a href=\"https://duckduckgo.com/global-privacy-control-learn-more\">Learn more</a>\n            </p>\n        </li>\n    </ul>\n</section>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var toggleButton = require('./shared/toggle-button.es6.js');

module.exports = function () {
  return bel(_templateObject(), toggleButton(this.model.embeddedTweetsEnabled, 'js-options-embedded-tweets-enabled', 'embeddedTweetsEnabled'), toggleButton(this.model.GPC, 'js-options-gpc-enabled', 'GPC'));
};

},{"./shared/toggle-button.es6.js":19,"bel":1}],19:[function(require,module,exports){
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n<button class=\"toggle-button toggle-button--is-active-", " ", "\"\n    data-key=\"", "\"\n    type=\"button\"\n    aria-pressed=\"", "\"\n    >\n    <div class=\"toggle-button__bg\">\n    </div>\n    <div class=\"toggle-button__knob\"></div>\n</button>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (isActiveBoolean, klass, dataKey) {
  // make `klass` and `dataKey` optional:
  klass = klass || '';
  dataKey = dataKey || '';
  return bel(_templateObject(), isActiveBoolean, klass, dataKey, isActiveBoolean ? 'true' : 'false');
};

},{"bel":1}],20:[function(require,module,exports){
"use strict";

function _templateObject3() {
  var data = _taggedTemplateLiteral(["<li>No unprotected sites added</li>"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n<li class=\"js-whitelist-list-item\">\n    <a class=\"link-secondary\" href=\"https://", "\">", "</a>\n    <button class=\"remove pull-right js-whitelist-remove\" data-item=\"", "\">\xD7</button>\n</li>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (list) {
  if (list.length > 0) {
    var i = 0;
    return bel(_templateObject(), list.map(function (dom) {
      return bel(_templateObject2(), dom, dom, i++);
    }));
  }

  return bel(_templateObject3());
};

},{"bel":1}],21:[function(require,module,exports){
"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<div>\n    <p class=\"whitelist-show-add js-whitelist-show-add\">\n        <a href=\"javascript:void(0)\">Add unprotected site</a>\n    </p>\n    <input class=\"is-hidden whitelist-url float-left js-whitelist-url\" type=\"text\" placeholder=\"Enter URL\">\n    <div class=\"is-hidden whitelist-add is-disabled float-right js-whitelist-add\">Add</div>\n\n    <div class=\"is-hidden modal-box js-whitelist-error float-right\">\n        <div class=\"modal-box__popout\">\n            <div class=\"modal-box__popout__body\">\n            </div>\n        </div>\n        <div class=\"modal-box__body\">\n            <span class=\"icon icon__error\">\n            </span>\n            <span class=\"modal__body__text\">\n                Invalid URL\n            </span>\n        </div>\n    </div>\n</div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<section class=\"options-content__whitelist\">\n    <h2 class=\"menu-title\">Unprotected Sites</h2>\n    <p class=\"menu-paragraph\">These sites will not be enhanced by Privacy Protection.</p>\n    <ul class=\"default-list js-whitelist-container\">\n        ", "\n    </ul>\n    ", "\n</section>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var whitelistItems = require('./whitelist-items.es6.js');

module.exports = function () {
  return bel(_templateObject(), whitelistItems(this.model.list), addToWhitelist());

  function addToWhitelist() {
    return bel(_templateObject2());
  }
};

},{"./whitelist-items.es6.js":20,"bel":1}],22:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;

function PrivacyOptions(ops) {
  var _this = this;

  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  Parent.call(this, ops);
  this.model.getSettings().then(function () {
    _this.rerender();
  });
}

PrivacyOptions.prototype = window.$.extend({}, Parent.prototype, {
  _clickSetting: function _clickSetting(e) {
    var key = window.$(e.target).data('key') || window.$(e.target).parent().data('key');
    console.log("privacyOptions view click for setting \"".concat(key, "\""));
    this.model.toggle(key);
    this.rerender();
  },
  setup: function setup() {
    this._cacheElems('.js-options', ['blocktrackers', 'https-everywhere-enabled', 'embedded-tweets-enabled', 'gpc-enabled']);

    this.bindEvents([[this.$blocktrackers, 'click', this._clickSetting], [this.$httpseverywhereenabled, 'click', this._clickSetting], [this.$embeddedtweetsenabled, 'click', this._clickSetting], [this.$gpcenabled, 'click', this._clickSetting]]);
  },
  rerender: function rerender() {
    this.unbindEvents();

    this._rerender();

    this.setup();
  }
});
module.exports = PrivacyOptions;

},{}],23:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;
var isHiddenClass = 'is-hidden';
var isDisabledClass = 'is-disabled';
var isInvalidInputClass = 'is-invalid-input';

var whitelistItemsTemplate = require('./../templates/whitelist-items.es6.js');

function Whitelist(ops) {
  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  Parent.call(this, ops); // bind events

  this.setup();
}

Whitelist.prototype = window.$.extend({}, Parent.prototype, {
  _removeItem: function _removeItem(e) {
    var itemIndex = window.$(e.target).data('item');
    this.model.removeDomain(itemIndex); // No need to rerender the whole view

    this._renderList();
  },
  _addItem: function _addItem(e) {
    if (!this.$add.hasClass(isDisabledClass)) {
      var url = this.$url.val();
      var isValidInput = false;

      if (url) {
        isValidInput = this.model.addDomain(url);
      }

      if (isValidInput) {
        this.rerender();
      } else {
        this._showErrorMessage();
      }
    }
  },
  _showErrorMessage: function _showErrorMessage() {
    this.$add.addClass(isHiddenClass);
    this.$error.removeClass(isHiddenClass);
    this.$url.addClass(isInvalidInputClass);
  },
  _hideErrorMessage: function _hideErrorMessage() {
    this.$add.removeClass(isHiddenClass);
    this.$error.addClass(isHiddenClass);
    this.$url.removeClass(isInvalidInputClass);
  },
  _manageInputChange: function _manageInputChange(e) {
    var isButtonDisabled = this.$add.hasClass(isDisabledClass);

    this._hideErrorMessage();

    if (this.$url.val() && isButtonDisabled) {
      this.$add.removeClass(isDisabledClass);
    } else if (!this.$url.val()) {
      this.$add.addClass(isDisabledClass);
    }

    if (!isButtonDisabled && e.key === 'Enter') {
      // also add to whitelist on enter
      this._addItem();
    }
  },
  _showAddToWhitelistInput: function _showAddToWhitelistInput(e) {
    this.$url.removeClass(isHiddenClass);
    this.$url.focus();
    this.$add.removeClass(isHiddenClass);
    this.$showadd.addClass(isHiddenClass);
    e.preventDefault();
  },
  setup: function setup() {
    this._cacheElems('.js-whitelist', ['remove', 'add', 'error', 'show-add', 'container', 'list-item', 'url']);

    this.bindEvents([[this.$remove, 'click', this._removeItem], [this.$add, 'click', this._addItem], [this.$showadd, 'click', this._showAddToWhitelistInput], [this.$url, 'keyup', this._manageInputChange], // listen to changes to the whitelist model
    [this.store.subscribe, 'change:whitelist', this.rerender]]);
  },
  rerender: function rerender() {
    this.unbindEvents();

    this._rerender();

    this.setup();
  },
  _renderList: function _renderList() {
    this.unbindEvents();
    this.$container.html(whitelistItemsTemplate(this.model.list));
    this.setup();
  }
});
module.exports = Whitelist;

},{"./../templates/whitelist-items.es6.js":20}]},{},[17]);
