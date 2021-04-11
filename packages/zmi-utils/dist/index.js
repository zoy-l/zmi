'use strict'
Object.defineProperty(exports, '__esModule', { value: !0 })
var t = require('fs'),
  e = require('path'),
  n = require('util'),
  r = require('os'),
  i = require('net'),
  o = require('tty'),
  u = require('stream'),
  s = require('zlib'),
  c = require('readline'),
  a = require('assert'),
  f = require('events'),
  l = require('child_process'),
  h = require('buffer'),
  p = require('string_decoder'),
  d = require('crypto'),
  v = require('constants'),
  y = require('cheerio'),
  b = require('glob')
function g(t) {
  return t && 'object' == typeof t && 'default' in t ? t : { default: t }
}
var m = g(t),
  D = g(e),
  w = g(n),
  _ = g(r),
  E = g(i),
  x = g(o),
  S = g(u),
  C = g(s),
  F = g(c),
  O = g(a),
  j = g(f),
  A = g(l),
  k = g(h),
  I = g(p),
  T = g(d),
  N = g(v),
  B = g(y),
  P = g(b),
  R =
    Array.isArray ||
    function (t) {
      return '[object Array]' === Object.prototype.toString.call(t)
    },
  L = M
function M(t, e, n) {
  t instanceof RegExp && (t = U(t, n)), e instanceof RegExp && (e = U(e, n))
  var r = V(t, e, n)
  return (
    r && {
      start: r[0],
      end: r[1],
      pre: n.slice(0, r[0]),
      body: n.slice(r[0] + t.length, r[1]),
      post: n.slice(r[1] + e.length)
    }
  )
}
function U(t, e) {
  var n = e.match(t)
  return n ? n[0] : null
}
function V(t, e, n) {
  var r,
    i,
    o,
    u,
    s,
    c = n.indexOf(t),
    a = n.indexOf(e, c + 1),
    f = c
  if (c >= 0 && a > 0) {
    if (t === e) return [c, a]
    for (r = [], o = n.length; f >= 0 && !s; )
      f == c
        ? (r.push(f), (c = n.indexOf(t, f + 1)))
        : 1 == r.length
        ? (s = [r.pop(), a])
        : ((i = r.pop()) < o && ((o = i), (u = a)), (a = n.indexOf(e, f + 1))),
        (f = c < a && c >= 0 ? c : a)
    r.length && (s = [o, u])
  }
  return s
}
M.range = V
var $ = function (t) {
    if (!t) return []
    '{}' === t.substr(0, 2) && (t = '\\{\\}' + t.substr(2))
    return et(
      (function (t) {
        return t
          .split('\\\\')
          .join(z)
          .split('\\{')
          .join(q)
          .split('\\}')
          .join(W)
          .split('\\,')
          .join(G)
          .split('\\.')
          .join(K)
      })(t),
      !0
    ).map(H)
  },
  z = '\0SLASH' + Math.random() + '\0',
  q = '\0OPEN' + Math.random() + '\0',
  W = '\0CLOSE' + Math.random() + '\0',
  G = '\0COMMA' + Math.random() + '\0',
  K = '\0PERIOD' + Math.random() + '\0'
function Y(t) {
  return parseInt(t, 10) == t ? parseInt(t, 10) : t.charCodeAt(0)
}
function H(t) {
  return t
    .split(z)
    .join('\\')
    .split(q)
    .join('{')
    .split(W)
    .join('}')
    .split(G)
    .join(',')
    .split(K)
    .join('.')
}
function X(t) {
  if (!t) return ['']
  var e = [],
    n = L('{', '}', t)
  if (!n) return t.split(',')
  var r = n.pre,
    i = n.body,
    o = n.post,
    u = r.split(',')
  u[u.length - 1] += '{' + i + '}'
  var s = X(o)
  return (
    o.length && ((u[u.length - 1] += s.shift()), u.push.apply(u, s)),
    e.push.apply(e, u),
    e
  )
}
function J(t) {
  return '{' + t + '}'
}
function Z(t) {
  return /^-?0\d/.test(t)
}
function Q(t, e) {
  return t <= e
}
function tt(t, e) {
  return t >= e
}
function et(t, e) {
  var n = [],
    r = L('{', '}', t)
  if (!r || /\$$/.test(r.pre)) return [t]
  var i,
    o = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(r.body),
    u = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(r.body),
    s = o || u,
    c = r.body.indexOf(',') >= 0
  if (!s && !c)
    return r.post.match(/,.*\}/) ? et((t = r.pre + '{' + r.body + W + r.post)) : [t]
  if (s) i = r.body.split(/\.\./)
  else if (1 === (i = X(r.body)).length && 1 === (i = et(i[0], !1).map(J)).length)
    return (l = r.post.length ? et(r.post, !1) : ['']).map(function (t) {
      return r.pre + i[0] + t
    })
  var a,
    f = r.pre,
    l = r.post.length ? et(r.post, !1) : ['']
  if (s) {
    var h = Y(i[0]),
      p = Y(i[1]),
      d = Math.max(i[0].length, i[1].length),
      v = 3 == i.length ? Math.abs(Y(i[2])) : 1,
      y = Q
    p < h && ((v *= -1), (y = tt))
    var b = i.some(Z)
    a = []
    for (var g = h; y(g, p); g += v) {
      var m
      if (u) '\\' === (m = String.fromCharCode(g)) && (m = '')
      else if (((m = String(g)), b)) {
        var D = d - m.length
        if (D > 0) {
          var w = new Array(D + 1).join('0')
          m = g < 0 ? '-' + w + m.slice(1) : w + m
        }
      }
      a.push(m)
    }
  } else
    a = (function (t, e) {
      for (var n = [], r = 0; r < t.length; r++) {
        var i = e(t[r], r)
        R(i) ? n.push.apply(n, i) : n.push(i)
      }
      return n
    })(i, function (t) {
      return et(t, !1)
    })
  for (var _ = 0; _ < a.length; _++)
    for (var E = 0; E < l.length; E++) {
      var x = f + a[_] + l[E]
      ;(!e || s || x) && n.push(x)
    }
  return n
}
var nt = at
at.Minimatch = ft
var rt = { sep: '/' }
try {
  rt = D.default
} catch (t) {}
var it = (at.GLOBSTAR = ft.GLOBSTAR = {}),
  ot = {
    '!': { open: '(?:(?!(?:', close: '))[^/]*?)' },
    '?': { open: '(?:', close: ')?' },
    '+': { open: '(?:', close: ')+' },
    '*': { open: '(?:', close: ')*' },
    '@': { open: '(?:', close: ')' }
  },
  ut = (function (t) {
    return t.split('').reduce(function (t, e) {
      return (t[e] = !0), t
    }, {})
  })('().*{}+?[]^$\\!')
var st = /\/+/
function ct(t, e) {
  ;(t = t || {}), (e = e || {})
  var n = {}
  return (
    Object.keys(e).forEach(function (t) {
      n[t] = e[t]
    }),
    Object.keys(t).forEach(function (e) {
      n[e] = t[e]
    }),
    n
  )
}
function at(t, e, n) {
  if ('string' != typeof e) throw new TypeError('glob pattern string required')
  return (
    n || (n = {}),
    !(!n.nocomment && '#' === e.charAt(0)) &&
      ('' === e.trim() ? '' === t : new ft(e, n).match(t))
  )
}
function ft(t, e) {
  if (!(this instanceof ft)) return new ft(t, e)
  if ('string' != typeof t) throw new TypeError('glob pattern string required')
  e || (e = {}),
    (t = t.trim()),
    '/' !== rt.sep && (t = t.split(rt.sep).join('/')),
    (this.options = e),
    (this.set = []),
    (this.pattern = t),
    (this.regexp = null),
    (this.negate = !1),
    (this.comment = !1),
    (this.empty = !1),
    this.make()
}
function lt(t, e) {
  if (
    (e || (e = this instanceof ft ? this.options : {}),
    void 0 === (t = void 0 === t ? this.pattern : t))
  )
    throw new TypeError('undefined pattern')
  return e.nobrace || !t.match(/\{.*\}/) ? [t] : $(t)
}
;(at.filter = function (t, e) {
  return (
    (e = e || {}),
    function (n, r, i) {
      return at(n, t, e)
    }
  )
}),
  (at.defaults = function (t) {
    if (!t || !Object.keys(t).length) return at
    var e = at,
      n = function (n, r, i) {
        return e.minimatch(n, r, ct(t, i))
      }
    return (
      (n.Minimatch = function (n, r) {
        return new e.Minimatch(n, ct(t, r))
      }),
      n
    )
  }),
  (ft.defaults = function (t) {
    return t && Object.keys(t).length ? at.defaults(t).Minimatch : ft
  }),
  (ft.prototype.debug = function () {}),
  (ft.prototype.make = function () {
    if (this._made) return
    var t = this.pattern,
      e = this.options
    if (!e.nocomment && '#' === t.charAt(0)) return void (this.comment = !0)
    if (!t) return void (this.empty = !0)
    this.parseNegate()
    var n = (this.globSet = this.braceExpand())
    e.debug && (this.debug = console.error)
    this.debug(this.pattern, n),
      (n = this.globParts = n.map(function (t) {
        return t.split(st)
      })),
      this.debug(this.pattern, n),
      (n = n.map(function (t, e, n) {
        return t.map(this.parse, this)
      }, this)),
      this.debug(this.pattern, n),
      (n = n.filter(function (t) {
        return -1 === t.indexOf(!1)
      })),
      this.debug(this.pattern, n),
      (this.set = n)
  }),
  (ft.prototype.parseNegate = function () {
    var t = this.pattern,
      e = !1,
      n = this.options,
      r = 0
    if (n.nonegate) return
    for (var i = 0, o = t.length; i < o && '!' === t.charAt(i); i++) (e = !e), r++
    r && (this.pattern = t.substr(r))
    this.negate = e
  }),
  (at.braceExpand = function (t, e) {
    return lt(t, e)
  }),
  (ft.prototype.braceExpand = lt),
  (ft.prototype.parse = function (t, e) {
    if (t.length > 65536) throw new TypeError('pattern is too long')
    var n = this.options
    if (!n.noglobstar && '**' === t) return it
    if ('' === t) return ''
    var r,
      i = '',
      o = !!n.nocase,
      u = !1,
      s = [],
      c = [],
      a = !1,
      f = -1,
      l = -1,
      h = '.' === t.charAt(0) ? '' : n.dot ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)',
      p = this
    function d() {
      if (r) {
        switch (r) {
          case '*':
            ;(i += '[^/]*?'), (o = !0)
            break
          case '?':
            ;(i += '[^/]'), (o = !0)
            break
          default:
            i += '\\' + r
        }
        p.debug('clearStateChar %j %j', r, i), (r = !1)
      }
    }
    for (var v, y = 0, b = t.length; y < b && (v = t.charAt(y)); y++)
      if ((this.debug('%s\t%s %s %j', t, y, i, v), u && ut[v])) (i += '\\' + v), (u = !1)
      else
        switch (v) {
          case '/':
            return !1
          case '\\':
            d(), (u = !0)
            continue
          case '?':
          case '*':
          case '+':
          case '@':
          case '!':
            if ((this.debug('%s\t%s %s %j <-- stateChar', t, y, i, v), a)) {
              this.debug('  in class'), '!' === v && y === l + 1 && (v = '^'), (i += v)
              continue
            }
            p.debug('call clearStateChar %j', r), d(), (r = v), n.noext && d()
            continue
          case '(':
            if (a) {
              i += '('
              continue
            }
            if (!r) {
              i += '\\('
              continue
            }
            s.push({
              type: r,
              start: y - 1,
              reStart: i.length,
              open: ot[r].open,
              close: ot[r].close
            }),
              (i += '!' === r ? '(?:(?!(?:' : '(?:'),
              this.debug('plType %j %j', r, i),
              (r = !1)
            continue
          case ')':
            if (a || !s.length) {
              i += '\\)'
              continue
            }
            d(), (o = !0)
            var g = s.pop()
            ;(i += g.close), '!' === g.type && c.push(g), (g.reEnd = i.length)
            continue
          case '|':
            if (a || !s.length || u) {
              ;(i += '\\|'), (u = !1)
              continue
            }
            d(), (i += '|')
            continue
          case '[':
            if ((d(), a)) {
              i += '\\' + v
              continue
            }
            ;(a = !0), (l = y), (f = i.length), (i += v)
            continue
          case ']':
            if (y === l + 1 || !a) {
              ;(i += '\\' + v), (u = !1)
              continue
            }
            if (a) {
              var m = t.substring(l + 1, y)
              try {
                RegExp('[' + m + ']')
              } catch (t) {
                var D = this.parse(m, ht)
                ;(i = i.substr(0, f) + '\\[' + D[0] + '\\]'), (o = o || D[1]), (a = !1)
                continue
              }
            }
            ;(o = !0), (a = !1), (i += v)
            continue
          default:
            d(), u ? (u = !1) : !ut[v] || ('^' === v && a) || (i += '\\'), (i += v)
        }
    a &&
      ((m = t.substr(l + 1)),
      (D = this.parse(m, ht)),
      (i = i.substr(0, f) + '\\[' + D[0]),
      (o = o || D[1]))
    for (g = s.pop(); g; g = s.pop()) {
      var w = i.slice(g.reStart + g.open.length)
      this.debug('setting tail', i, g),
        (w = w.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (t, e, n) {
          return n || (n = '\\'), e + e + n + '|'
        })),
        this.debug('tail=%j\n   %s', w, w, g, i)
      var _ = '*' === g.type ? '[^/]*?' : '?' === g.type ? '[^/]' : '\\' + g.type
      ;(o = !0), (i = i.slice(0, g.reStart) + _ + '\\(' + w)
    }
    d(), u && (i += '\\\\')
    var E = !1
    switch (i.charAt(0)) {
      case '.':
      case '[':
      case '(':
        E = !0
    }
    for (var x = c.length - 1; x > -1; x--) {
      var S = c[x],
        C = i.slice(0, S.reStart),
        F = i.slice(S.reStart, S.reEnd - 8),
        O = i.slice(S.reEnd - 8, S.reEnd),
        j = i.slice(S.reEnd)
      O += j
      var A = C.split('(').length - 1,
        k = j
      for (y = 0; y < A; y++) k = k.replace(/\)[+*?]?/, '')
      var I = ''
      '' === (j = k) && e !== ht && (I = '$'), (i = C + F + j + I + O)
    }
    '' !== i && o && (i = '(?=.)' + i)
    E && (i = h + i)
    if (e === ht) return [i, o]
    if (!o)
      return (function (t) {
        return t.replace(/\\(.)/g, '$1')
      })(t)
    var T = n.nocase ? 'i' : ''
    try {
      var N = new RegExp('^' + i + '$', T)
    } catch (t) {
      return new RegExp('$.')
    }
    return (N._glob = t), (N._src = i), N
  })
var ht = {}
function pt(t) {
  return 'function' == typeof t
    ? t
    : ((e = t),
      function (t, n) {
        var r = new nt.Minimatch(e, { matchBase: !0 })
        return (!r.negate || n.isFile()) && r.match(t)
      })
  var e
}
;(at.makeRe = function (t, e) {
  return new ft(t, e || {}).makeRe()
}),
  (ft.prototype.makeRe = function () {
    if (this.regexp || !1 === this.regexp) return this.regexp
    var t = this.set
    if (!t.length) return (this.regexp = !1), this.regexp
    var e = this.options,
      n = e.noglobstar
        ? '[^/]*?'
        : e.dot
        ? '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?'
        : '(?:(?!(?:\\/|^)\\.).)*?',
      r = e.nocase ? 'i' : '',
      i = t
        .map(function (t) {
          return t
            .map(function (t) {
              return t === it
                ? n
                : 'string' == typeof t
                ? (function (t) {
                    return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
                  })(t)
                : t._src
            })
            .join('\\/')
        })
        .join('|')
    ;(i = '^(?:' + i + ')$'), this.negate && (i = '^(?!' + i + ').*$')
    try {
      this.regexp = new RegExp(i, r)
    } catch (t) {
      this.regexp = !1
    }
    return this.regexp
  }),
  (at.match = function (t, e, n) {
    var r = new ft(e, (n = n || {}))
    return (
      (t = t.filter(function (t) {
        return r.match(t)
      })),
      r.options.nonull && !t.length && t.push(e),
      t
    )
  }),
  (ft.prototype.match = function (t, e) {
    if ((this.debug('match', t, this.pattern), this.comment)) return !1
    if (this.empty) return '' === t
    if ('/' === t && e) return !0
    var n = this.options
    '/' !== rt.sep && (t = t.split(rt.sep).join('/'))
    ;(t = t.split(st)), this.debug(this.pattern, 'split', t)
    var r,
      i,
      o = this.set
    for (
      this.debug(this.pattern, 'set', o), i = t.length - 1;
      i >= 0 && !(r = t[i]);
      i--
    );
    for (i = 0; i < o.length; i++) {
      var u = o[i],
        s = t
      if ((n.matchBase && 1 === u.length && (s = [r]), this.matchOne(s, u, e)))
        return !!n.flipNegate || !this.negate
    }
    return !n.flipNegate && this.negate
  }),
  (ft.prototype.matchOne = function (t, e, n) {
    var r = this.options
    this.debug('matchOne', { this: this, file: t, pattern: e }),
      this.debug('matchOne', t.length, e.length)
    for (var i = 0, o = 0, u = t.length, s = e.length; i < u && o < s; i++, o++) {
      this.debug('matchOne loop')
      var c,
        a = e[o],
        f = t[i]
      if ((this.debug(e, a, f), !1 === a)) return !1
      if (a === it) {
        this.debug('GLOBSTAR', [e, a, f])
        var l = i,
          h = o + 1
        if (h === s) {
          for (this.debug('** at the end'); i < u; i++)
            if ('.' === t[i] || '..' === t[i] || (!r.dot && '.' === t[i].charAt(0)))
              return !1
          return !0
        }
        for (; l < u; ) {
          var p = t[l]
          if (
            (this.debug('\nglobstar while', t, l, e, h, p),
            this.matchOne(t.slice(l), e.slice(h), n))
          )
            return this.debug('globstar found match!', l, u, p), !0
          if ('.' === p || '..' === p || (!r.dot && '.' === p.charAt(0))) {
            this.debug('dot detected!', t, l, e, h)
            break
          }
          this.debug('globstar swallow a segment, and continue'), l++
        }
        return !(!n || (this.debug('\n>>> no match, partial?', t, l, e, h), l !== u))
      }
      if (
        ('string' == typeof a
          ? ((c = r.nocase ? f.toLowerCase() === a.toLowerCase() : f === a),
            this.debug('string match', a, f, c))
          : ((c = f.match(a)), this.debug('pattern match', a, f, c)),
        !c)
      )
        return !1
    }
    if (i === u && o === s) return !0
    if (i === u) return n
    if (o === s) return i === u - 1 && '' === t[i]
    throw new Error('wtf?')
  })
var dt = function t(e, n, r) {
  if (('function' == typeof n && ((r = n), (n = [])), !r))
    return new Promise(function (r, i) {
      t(e, n || [], function (t, e) {
        t ? i(t) : r(e)
      })
    })
  n = n.map(pt)
  var i = []
  m.default.readdir(e, function (o, u) {
    if (o) return r(o)
    var s = u.length
    if (!s) return r(null, i)
    u.forEach(function (o) {
      var u = D.default.join(e, o)
      m.default.stat(u, function (e, o) {
        if (e) return r(e)
        if (
          n.some(function (t) {
            return t(u, o)
          })
        )
          return (s -= 1) ? null : r(null, i)
        if (o.isDirectory())
          t(u, n, function (t, e) {
            return t ? r(t) : ((i = i.concat(e)), (s -= 1) ? void 0 : r(null, i))
          })
        else if ((i.push(u), !(s -= 1))) return r(null, i)
      })
    })
  })
}
function vt(t) {
  if (
    ((t !== t.toLowerCase() && t !== t.toUpperCase()) || (t = t.toLocaleLowerCase()),
    -1 === t.indexOf('-') && -1 === t.indexOf('_'))
  )
    return t
  {
    let e = '',
      n = !1
    const r = t.match(/^-+/)
    for (let i = r ? r[0].length : 0; i < t.length; i++) {
      let r = t.charAt(i)
      n && ((n = !1), (r = r.toLocaleUpperCase())),
        0 === i || ('-' !== r && '_' !== r)
          ? '-' !== r && '_' !== r && (e += r)
          : (n = !0)
    }
    return e
  }
}
function yt(t, e) {
  const n = t.toLocaleLowerCase()
  e = e || '-'
  let r = ''
  for (let i = 0; i < t.length; i++) {
    const o = n.charAt(i),
      u = t.charAt(i)
    r += o !== u && i > 0 ? `${e}${n.charAt(i)}` : u
  }
  return r
}
function bt(t) {
  return (
    null != t &&
    ('number' == typeof t ||
      !!/^0x[0-9a-f]+$/i.test(t) ||
      (!(t.length > 1 && '0' === t[0]) &&
        /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(t)))
  )
}
let gt
function mt(t) {
  return void 0 !== t ? t + 1 : 1
}
function Dt(t) {
  return '__proto__' === t ? '___proto___' : t
}
const wt =
  process && process.env && process.env.YARGS_MIN_NODE_VERSION
    ? Number(process.env.YARGS_MIN_NODE_VERSION)
    : 10
if (process && process.version) {
  if (Number(process.version.match(/v([^.]+)/)[1]) < wt)
    throw Error(
      `yargs parser supports a minimum Node.js version of ${wt}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`
    )
}
const _t = process ? process.env : {},
  Et = new (class {
    constructor(t) {
      gt = t
    }
    parse(t, e) {
      const n = Object.assign(
          {
            alias: void 0,
            array: void 0,
            boolean: void 0,
            config: void 0,
            configObjects: void 0,
            configuration: void 0,
            coerce: void 0,
            count: void 0,
            default: void 0,
            envPrefix: void 0,
            narg: void 0,
            normalize: void 0,
            string: void 0,
            number: void 0,
            __: void 0,
            key: void 0
          },
          e
        ),
        r = (function (t) {
          if (Array.isArray(t)) return t.map((t) => ('string' != typeof t ? t + '' : t))
          t = t.trim()
          let e = 0,
            n = null,
            r = null,
            i = null
          const o = []
          for (let u = 0; u < t.length; u++)
            (n = r),
              (r = t.charAt(u)),
              ' ' !== r || i
                ? (r === i ? (i = null) : ("'" !== r && '"' !== r) || i || (i = r),
                  o[e] || (o[e] = ''),
                  (o[e] += r))
                : ' ' !== n && e++
          return o
        })(t),
        i = (function (t) {
          const e = [],
            n = Object.create(null)
          let r = !0
          Object.keys(t).forEach(function (n) {
            e.push([].concat(t[n], n))
          })
          for (; r; ) {
            r = !1
            for (let t = 0; t < e.length; t++)
              for (let n = t + 1; n < e.length; n++) {
                if (
                  e[t].filter(function (t) {
                    return -1 !== e[n].indexOf(t)
                  }).length
                ) {
                  ;(e[t] = e[t].concat(e[n])), e.splice(n, 1), (r = !0)
                  break
                }
              }
          }
          return (
            e.forEach(function (t) {
              const e = (t = t.filter(function (t, e, n) {
                return n.indexOf(t) === e
              })).pop()
              void 0 !== e && 'string' == typeof e && (n[e] = t)
            }),
            n
          )
        })(Object.assign(Object.create(null), n.alias)),
        o = Object.assign(
          {
            'boolean-negation': !0,
            'camel-case-expansion': !0,
            'combine-arrays': !1,
            'dot-notation': !0,
            'duplicate-arguments-array': !0,
            'flatten-duplicate-arrays': !0,
            'greedy-arrays': !0,
            'halt-at-non-option': !1,
            'nargs-eats-options': !1,
            'negation-prefix': 'no-',
            'parse-numbers': !0,
            'parse-positional-numbers': !0,
            'populate--': !1,
            'set-placeholder-key': !1,
            'short-option-groups': !0,
            'strip-aliased': !1,
            'strip-dashed': !1,
            'unknown-options-as-args': !1
          },
          n.configuration
        ),
        u = Object.assign(Object.create(null), n.default),
        s = n.configObjects || [],
        c = n.envPrefix,
        a = o['populate--'],
        f = a ? '--' : '_',
        l = Object.create(null),
        h = Object.create(null),
        p = n.__ || gt.format,
        d = {
          aliases: Object.create(null),
          arrays: Object.create(null),
          bools: Object.create(null),
          strings: Object.create(null),
          numbers: Object.create(null),
          counts: Object.create(null),
          normalize: Object.create(null),
          configs: Object.create(null),
          nargs: Object.create(null),
          coercions: Object.create(null),
          keys: []
        },
        v = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/,
        y = new RegExp('^--' + o['negation-prefix'] + '(.+)')
      ;[]
        .concat(n.array || [])
        .filter(Boolean)
        .forEach(function (t) {
          const e = 'object' == typeof t ? t.key : t,
            n = Object.keys(t)
              .map(function (t) {
                return { boolean: 'bools', string: 'strings', number: 'numbers' }[t]
              })
              .filter(Boolean)
              .pop()
          n && (d[n][e] = !0), (d.arrays[e] = !0), d.keys.push(e)
        }),
        []
          .concat(n.boolean || [])
          .filter(Boolean)
          .forEach(function (t) {
            ;(d.bools[t] = !0), d.keys.push(t)
          }),
        []
          .concat(n.string || [])
          .filter(Boolean)
          .forEach(function (t) {
            ;(d.strings[t] = !0), d.keys.push(t)
          }),
        []
          .concat(n.number || [])
          .filter(Boolean)
          .forEach(function (t) {
            ;(d.numbers[t] = !0), d.keys.push(t)
          }),
        []
          .concat(n.count || [])
          .filter(Boolean)
          .forEach(function (t) {
            ;(d.counts[t] = !0), d.keys.push(t)
          }),
        []
          .concat(n.normalize || [])
          .filter(Boolean)
          .forEach(function (t) {
            ;(d.normalize[t] = !0), d.keys.push(t)
          }),
        'object' == typeof n.narg &&
          Object.entries(n.narg).forEach(([t, e]) => {
            'number' == typeof e && ((d.nargs[t] = e), d.keys.push(t))
          }),
        'object' == typeof n.coerce &&
          Object.entries(n.coerce).forEach(([t, e]) => {
            'function' == typeof e && ((d.coercions[t] = e), d.keys.push(t))
          }),
        void 0 !== n.config &&
          (Array.isArray(n.config) || 'string' == typeof n.config
            ? []
                .concat(n.config)
                .filter(Boolean)
                .forEach(function (t) {
                  d.configs[t] = !0
                })
            : 'object' == typeof n.config &&
              Object.entries(n.config).forEach(([t, e]) => {
                ;('boolean' != typeof e && 'function' != typeof e) || (d.configs[t] = e)
              })),
        (function (...t) {
          t.forEach(function (t) {
            Object.keys(t || {}).forEach(function (t) {
              d.aliases[t] ||
                ((d.aliases[t] = [].concat(i[t] || [])),
                d.aliases[t].concat(t).forEach(function (e) {
                  if (/-/.test(e) && o['camel-case-expansion']) {
                    const n = vt(e)
                    n !== t &&
                      -1 === d.aliases[t].indexOf(n) &&
                      (d.aliases[t].push(n), (l[n] = !0))
                  }
                }),
                d.aliases[t].concat(t).forEach(function (e) {
                  if (e.length > 1 && /[A-Z]/.test(e) && o['camel-case-expansion']) {
                    const n = yt(e, '-')
                    n !== t &&
                      -1 === d.aliases[t].indexOf(n) &&
                      (d.aliases[t].push(n), (l[n] = !0))
                  }
                }),
                d.aliases[t].forEach(function (e) {
                  d.aliases[e] = [t].concat(
                    d.aliases[t].filter(function (t) {
                      return e !== t
                    })
                  )
                }))
            })
          })
        })(n.key, i, n.default, d.arrays),
        Object.keys(u).forEach(function (t) {
          ;(d.aliases[t] || []).forEach(function (e) {
            u[e] = u[t]
          })
        })
      let b = null
      Object.keys(d.counts).find((t) =>
        T(t, d.arrays)
          ? ((b = Error(
              p('Invalid configuration: %s, opts.count excludes opts.array.', t)
            )),
            !0)
          : !!T(t, d.nargs) &&
            ((b = Error(
              p('Invalid configuration: %s, opts.count excludes opts.narg.', t)
            )),
            !0)
      )
      let g = []
      const m = Object.assign(Object.create(null), { _: [] }),
        D = {}
      for (let t = 0; t < r.length; t++) {
        const e = r[t]
        let n, i, u, s, c, a
        if ('--' !== e && B(e)) w(e)
        else {
          if (e.match(/---+(=|$)/)) {
            w(e)
            continue
          }
          if (e.match(/^--.+=/) || (!o['short-option-groups'] && e.match(/^-.+=/)))
            (s = e.match(/^--?([^=]+)=([\s\S]*)$/)),
              null !== s &&
                Array.isArray(s) &&
                s.length >= 3 &&
                (T(s[1], d.arrays)
                  ? (t = E(t, s[1], r, s[2]))
                  : !1 !== T(s[1], d.nargs)
                  ? (t = _(t, s[1], r, s[2]))
                  : x(s[1], s[2]))
          else if (e.match(y) && o['boolean-negation'])
            (s = e.match(y)),
              null !== s &&
                Array.isArray(s) &&
                s.length >= 2 &&
                ((i = s[1]), x(i, !!T(i, d.arrays) && [!1]))
          else if (e.match(/^--.+/) || (!o['short-option-groups'] && e.match(/^-[^-]+/)))
            (s = e.match(/^--?(.+)/)),
              null !== s &&
                Array.isArray(s) &&
                s.length >= 2 &&
                ((i = s[1]),
                T(i, d.arrays)
                  ? (t = E(t, i, r))
                  : !1 !== T(i, d.nargs)
                  ? (t = _(t, i, r))
                  : ((c = r[t + 1]),
                    void 0 === c ||
                    (c.match(/^-/) && !c.match(v)) ||
                    T(i, d.bools) ||
                    T(i, d.counts)
                      ? /^(true|false)$/.test(c)
                        ? (x(i, c), t++)
                        : x(i, P(i))
                      : (x(i, c), t++)))
          else if (e.match(/^-.\..+=/))
            (s = e.match(/^-([^=]+)=([\s\S]*)$/)),
              null !== s && Array.isArray(s) && s.length >= 3 && x(s[1], s[2])
          else if (e.match(/^-.\..+/) && !e.match(v))
            (c = r[t + 1]),
              (s = e.match(/^-(.\..+)/)),
              null !== s &&
                Array.isArray(s) &&
                s.length >= 2 &&
                ((i = s[1]),
                void 0 === c || c.match(/^-/) || T(i, d.bools) || T(i, d.counts)
                  ? x(i, P(i))
                  : (x(i, c), t++))
          else if (e.match(/^-[^-]+/) && !e.match(v)) {
            ;(u = e.slice(1, -1).split('')), (n = !1)
            for (let o = 0; o < u.length; o++) {
              if (((c = e.slice(o + 2)), u[o + 1] && '=' === u[o + 1])) {
                ;(a = e.slice(o + 3)),
                  (i = u[o]),
                  T(i, d.arrays)
                    ? (t = E(t, i, r, a))
                    : !1 !== T(i, d.nargs)
                    ? (t = _(t, i, r, a))
                    : x(i, a),
                  (n = !0)
                break
              }
              if ('-' !== c) {
                if (
                  /[A-Za-z]/.test(u[o]) &&
                  /^-?\d+(\.\d*)?(e-?\d+)?$/.test(c) &&
                  !1 === T(c, d.bools)
                ) {
                  x(u[o], c), (n = !0)
                  break
                }
                if (u[o + 1] && u[o + 1].match(/\W/)) {
                  x(u[o], c), (n = !0)
                  break
                }
                x(u[o], P(u[o]))
              } else x(u[o], c)
            }
            ;(i = e.slice(-1)[0]),
              n ||
                '-' === i ||
                (T(i, d.arrays)
                  ? (t = E(t, i, r))
                  : !1 !== T(i, d.nargs)
                  ? (t = _(t, i, r))
                  : ((c = r[t + 1]),
                    void 0 === c ||
                    (/^(-|--)[^-]/.test(c) && !c.match(v)) ||
                    T(i, d.bools) ||
                    T(i, d.counts)
                      ? /^(true|false)$/.test(c)
                        ? (x(i, c), t++)
                        : x(i, P(i))
                      : (x(i, c), t++)))
          } else if (e.match(/^-[0-9]$/) && e.match(v) && T(e.slice(1), d.bools))
            (i = e.slice(1)), x(i, P(i))
          else {
            if ('--' === e) {
              g = r.slice(t + 1)
              break
            }
            if (o['halt-at-non-option']) {
              g = r.slice(t)
              break
            }
            w(e)
          }
        }
      }
      function w(t) {
        const e = F('_', t)
        ;('string' != typeof e && 'number' != typeof e) || m._.push(e)
      }
      function _(t, e, n, r) {
        let i,
          u = T(e, d.nargs)
        if (((u = 'number' != typeof u || isNaN(u) ? 1 : u), 0 === u))
          return R(r) || (b = Error(p('Argument unexpected for: %s', e))), x(e, P(e)), t
        let s = R(r) ? 0 : 1
        if (o['nargs-eats-options'])
          n.length - (t + 1) + s < u &&
            (b = Error(p('Not enough arguments following: %s', e))),
            (s = u)
        else {
          for (
            i = t + 1;
            i < n.length && (!n[i].match(/^-[^0-9]/) || n[i].match(v) || B(n[i]));
            i++
          )
            s++
          s < u && (b = Error(p('Not enough arguments following: %s', e)))
        }
        let c = Math.min(s, u)
        for (!R(r) && c > 0 && (x(e, r), c--), i = t + 1; i < c + t + 1; i++) x(e, n[i])
        return t + c
      }
      function E(t, e, n, r) {
        let i = [],
          s = r || n[t + 1]
        const c = T(e, d.nargs)
        if (T(e, d.bools) && !/^(true|false)$/.test(s)) i.push(!0)
        else if (R(s) || (R(r) && /^-/.test(s) && !v.test(s) && !B(s))) {
          if (void 0 !== u[e]) {
            const t = u[e]
            i = Array.isArray(t) ? t : [t]
          }
        } else {
          R(r) || i.push(C(e, r))
          for (
            let r = t + 1;
            r < n.length &&
            !(
              (!o['greedy-arrays'] && i.length > 0) ||
              (c && 'number' == typeof c && i.length >= c)
            ) &&
            ((s = n[r]), !/^-/.test(s) || v.test(s) || B(s));
            r++
          )
            (t = r), i.push(C(e, s))
        }
        return (
          'number' == typeof c &&
            ((c && i.length < c) || (isNaN(c) && 0 === i.length)) &&
            (b = Error(p('Not enough arguments following: %s', e))),
          x(e, i),
          t
        )
      }
      function x(t, e) {
        if (/-/.test(t) && o['camel-case-expansion']) {
          const e = t
            .split('.')
            .map(function (t) {
              return vt(t)
            })
            .join('.')
          S(t, e)
        }
        const n = C(t, e),
          r = t.split('.')
        if (
          (I(m, r, n),
          d.aliases[t] &&
            d.aliases[t].forEach(function (t) {
              const e = t.split('.')
              I(m, e, n)
            }),
          r.length > 1 &&
            o['dot-notation'] &&
            (d.aliases[r[0]] || []).forEach(function (e) {
              let i = e.split('.')
              const o = [].concat(r)
              o.shift(),
                (i = i.concat(o)),
                (d.aliases[t] || []).includes(i.join('.')) || I(m, i, n)
            }),
          T(t, d.normalize) && !T(t, d.arrays))
        ) {
          ;[t].concat(d.aliases[t] || []).forEach(function (t) {
            Object.defineProperty(D, t, {
              enumerable: !0,
              get: () => e,
              set(t) {
                e = 'string' == typeof t ? gt.normalize(t) : t
              }
            })
          })
        }
      }
      function S(t, e) {
        ;(d.aliases[t] && d.aliases[t].length) || ((d.aliases[t] = [e]), (l[e] = !0)),
          (d.aliases[e] && d.aliases[e].length) || S(e, t)
      }
      function C(t, e) {
        'string' != typeof e ||
          ("'" !== e[0] && '"' !== e[0]) ||
          e[e.length - 1] !== e[0] ||
          (e = e.substring(1, e.length - 1)),
          (T(t, d.bools) || T(t, d.counts)) && 'string' == typeof e && (e = 'true' === e)
        let n = Array.isArray(e)
          ? e.map(function (e) {
              return F(t, e)
            })
          : F(t, e)
        return (
          T(t, d.counts) && (R(n) || 'boolean' == typeof n) && (n = mt()),
          T(t, d.normalize) &&
            T(t, d.arrays) &&
            (n = Array.isArray(e) ? e.map((t) => gt.normalize(t)) : gt.normalize(e)),
          n
        )
      }
      function F(t, e) {
        if (!o['parse-positional-numbers'] && '_' === t) return e
        if (!T(t, d.strings) && !T(t, d.bools) && !Array.isArray(e)) {
          ;((bt(e) &&
            o['parse-numbers'] &&
            Number.isSafeInteger(Math.floor(parseFloat(`${e}`)))) ||
            (!R(e) && T(t, d.numbers))) &&
            (e = Number(e))
        }
        return e
      }
      function O(t, e) {
        Object.keys(t).forEach(function (n) {
          const r = t[n],
            i = e ? e + '.' + n : n
          'object' == typeof r && null !== r && !Array.isArray(r) && o['dot-notation']
            ? O(r, i)
            : (!k(m, i.split('.')) || (T(i, d.arrays) && o['combine-arrays'])) && x(i, r)
        })
      }
      function j(t, e) {
        if (void 0 === c) return
        const n = 'string' == typeof c ? c : '',
          r = gt.env()
        Object.keys(r).forEach(function (i) {
          if ('' === n || 0 === i.lastIndexOf(n, 0)) {
            const o = i.split('__').map(function (t, e) {
              return 0 === e && (t = t.substring(n.length)), vt(t)
            })
            ;((e && d.configs[o.join('.')]) || !e) && !k(t, o) && x(o.join('.'), r[i])
          }
        })
      }
      function A(t, e, n, r = !1) {
        Object.keys(n).forEach(function (i) {
          k(t, i.split('.')) ||
            (I(t, i.split('.'), n[i]),
            r && (h[i] = !0),
            (e[i] || []).forEach(function (e) {
              k(t, e.split('.')) || I(t, e.split('.'), n[i])
            }))
        })
      }
      function k(t, e) {
        let n = t
        o['dot-notation'] || (e = [e.join('.')]),
          e.slice(0, -1).forEach(function (t) {
            n = n[t] || {}
          })
        const r = e[e.length - 1]
        return 'object' == typeof n && r in n
      }
      function I(t, e, n) {
        let r = t
        o['dot-notation'] || (e = [e.join('.')]),
          e.slice(0, -1).forEach(function (t) {
            ;(t = Dt(t)),
              'object' == typeof r && void 0 === r[t] && (r[t] = {}),
              'object' != typeof r[t] || Array.isArray(r[t])
                ? (Array.isArray(r[t]) ? r[t].push({}) : (r[t] = [r[t], {}]),
                  (r = r[t][r[t].length - 1]))
                : (r = r[t])
          })
        const i = Dt(e[e.length - 1]),
          u = T(e.join('.'), d.arrays),
          s = Array.isArray(n)
        let c = o['duplicate-arguments-array']
        !c &&
          T(i, d.nargs) &&
          ((c = !0),
          ((!R(r[i]) && 1 === d.nargs[i]) ||
            (Array.isArray(r[i]) && r[i].length === d.nargs[i])) &&
            (r[i] = void 0)),
          n === mt()
            ? (r[i] = mt(r[i]))
            : Array.isArray(r[i])
            ? c && u && s
              ? (r[i] = o['flatten-duplicate-arrays']
                  ? r[i].concat(n)
                  : (Array.isArray(r[i][0]) ? r[i] : [r[i]]).concat([n]))
              : c || Boolean(u) !== Boolean(s)
              ? (r[i] = r[i].concat([n]))
              : (r[i] = n)
            : void 0 === r[i] && u
            ? (r[i] = s ? n : [n])
            : !c || void 0 === r[i] || T(i, d.counts) || T(i, d.bools)
            ? (r[i] = n)
            : (r[i] = [r[i], n])
      }
      function T(t, e) {
        const n = [].concat(d.aliases[t] || [], t),
          r = Object.keys(e),
          i = n.find((t) => r.includes(t))
        return !!i && e[i]
      }
      function N(t) {
        const e = Object.keys(d)
        return [].concat(e.map((t) => d[t])).some(function (e) {
          return Array.isArray(e) ? e.includes(t) : e[t]
        })
      }
      function B(t) {
        return (
          o['unknown-options-as-args'] &&
          (function (t) {
            if (t.match(v)) return !1
            if (
              (function (t) {
                if (t.match(v) || !t.match(/^-[^-]+/)) return !1
                let e,
                  n = !0
                const r = t.slice(1).split('')
                for (let i = 0; i < r.length; i++) {
                  if (((e = t.slice(i + 2)), !N(r[i]))) {
                    n = !1
                    break
                  }
                  if (
                    (r[i + 1] && '=' === r[i + 1]) ||
                    '-' === e ||
                    (/[A-Za-z]/.test(r[i]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(e)) ||
                    (r[i + 1] && r[i + 1].match(/\W/))
                  )
                    break
                }
                return n
              })(t)
            )
              return !1
            return !(function (t, ...e) {
              return [].concat(...e).some(function (e) {
                const n = t.match(e)
                return n && N(n[1])
              })
            })(
              t,
              /^-+([^=]+?)=[\s\S]*$/,
              y,
              /^-+([^=]+?)$/,
              /^-+([^=]+?)-$/,
              /^-+([^=]+?\d+)$/,
              /^-+([^=]+?)\W+.*$/
            )
          })(t)
        )
      }
      function P(t) {
        return T(t, d.bools) || T(t, d.counts) || !(`${t}` in u)
          ? { boolean: !0, string: '', number: void 0, array: [] }[
              (function (t) {
                let e = 'boolean'
                return (
                  T(t, d.strings)
                    ? (e = 'string')
                    : T(t, d.numbers)
                    ? (e = 'number')
                    : T(t, d.bools)
                    ? (e = 'boolean')
                    : T(t, d.arrays) && (e = 'array'),
                  e
                )
              })(t)
            ]
          : u[t]
      }
      function R(t) {
        return void 0 === t
      }
      return (
        j(m, !0),
        j(m, !1),
        (function (t) {
          const e = Object.create(null)
          A(e, d.aliases, u),
            Object.keys(d.configs).forEach(function (n) {
              const r = t[n] || e[n]
              if (r)
                try {
                  let t = null
                  const e = gt.resolve(gt.cwd(), r),
                    i = d.configs[n]
                  if ('function' == typeof i) {
                    try {
                      t = i(e)
                    } catch (e) {
                      t = e
                    }
                    if (t instanceof Error) return void (b = t)
                  } else t = gt.require(e)
                  O(t)
                } catch (e) {
                  'PermissionDenied' === e.name
                    ? (b = e)
                    : t[n] && (b = Error(p('Invalid JSON config file: %s', r)))
                }
            })
        })(m),
        void 0 !== s &&
          s.forEach(function (t) {
            O(t)
          }),
        A(m, d.aliases, u, !0),
        (function (t) {
          let e
          const n = new Set()
          Object.keys(t).forEach(function (r) {
            if (!n.has(r) && ((e = T(r, d.coercions)), 'function' == typeof e))
              try {
                const i = F(r, e(t[r]))
                ;[].concat(d.aliases[r] || [], r).forEach((e) => {
                  n.add(e), (t[e] = i)
                })
              } catch (t) {
                b = t
              }
          })
        })(m),
        o['set-placeholder-key'] &&
          (function (t) {
            d.keys.forEach((e) => {
              ~e.indexOf('.') || (void 0 === t[e] && (t[e] = void 0))
            })
          })(m),
        Object.keys(d.counts).forEach(function (t) {
          k(m, t.split('.')) || x(t, 0)
        }),
        a && g.length && (m[f] = []),
        g.forEach(function (t) {
          m[f].push(t)
        }),
        o['camel-case-expansion'] &&
          o['strip-dashed'] &&
          Object.keys(m)
            .filter((t) => '--' !== t && t.includes('-'))
            .forEach((t) => {
              delete m[t]
            }),
        o['strip-aliased'] &&
          [].concat(...Object.keys(i).map((t) => i[t])).forEach((t) => {
            o['camel-case-expansion'] &&
              t.includes('-') &&
              delete m[
                t
                  .split('.')
                  .map((t) => vt(t))
                  .join('.')
              ],
              delete m[t]
          }),
        {
          aliases: Object.assign({}, d.aliases),
          argv: Object.assign(D, m),
          configuration: o,
          defaulted: Object.assign({}, h),
          error: b,
          newAliases: Object.assign({}, l)
        }
      )
    }
  })({
    cwd: process.cwd,
    env: () => _t,
    format: n.format,
    normalize: e.normalize,
    resolve: e.resolve,
    require: (e) => {
      if ('undefined' != typeof require) return require(e)
      if (e.match(/\.json$/)) return t.readFileSync(e, 'utf8')
      throw Error('only .json config files are supported in ESM')
    }
  }),
  xt = function (t, e) {
    return Et.parse(t.slice(), e).argv
  }
;(xt.detailed = function (t, e) {
  return Et.parse(t.slice(), e)
}),
  (xt.camelCase = vt),
  (xt.decamelize = yt),
  (xt.looksLikeNumber = bt)
var St =
  'undefined' != typeof globalThis
    ? globalThis
    : 'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
    ? global
    : 'undefined' != typeof self
    ? self
    : {}
function Ct(t) {
  if (t.__esModule) return t
  var e = Object.defineProperty({}, '__esModule', { value: !0 })
  return (
    Object.keys(t).forEach(function (n) {
      var r = Object.getOwnPropertyDescriptor(t, n)
      Object.defineProperty(
        e,
        n,
        r.get
          ? r
          : {
              enumerable: !0,
              get: function () {
                return t[n]
              }
            }
      )
    }),
    e
  )
}
function Ft(t) {
  var e = { exports: {} }
  return t(e, e.exports), e.exports
}
var Ot = Ft(function (t, e) {
    !(function (e) {
      function n(t, e) {
        e |= 0
        for (var n = Math.max(t.length - e, 0), r = Array(n), i = 0; i < n; i++)
          r[i] = t[e + i]
        return r
      }
      var r = function (t) {
          var e = n(arguments, 1)
          return function () {
            var r = n(arguments)
            return t.apply(null, e.concat(r))
          }
        },
        i = function (t) {
          return function () {
            var e = n(arguments),
              r = e.pop()
            t.call(this, e, r)
          }
        }
      function o(t) {
        var e = typeof t
        return null != t && ('object' == e || 'function' == e)
      }
      var u = 'function' == typeof setImmediate && setImmediate,
        s = 'object' == typeof process && 'function' == typeof process.nextTick
      function c(t) {
        setTimeout(t, 0)
      }
      function a(t) {
        return function (e) {
          var r = n(arguments, 1)
          t(function () {
            e.apply(null, r)
          })
        }
      }
      var f = a(u ? setImmediate : s ? process.nextTick : c)
      function l(t) {
        return i(function (e, n) {
          var r
          try {
            r = t.apply(this, e)
          } catch (t) {
            return n(t)
          }
          o(r) && 'function' == typeof r.then
            ? r.then(
                function (t) {
                  h(n, null, t)
                },
                function (t) {
                  h(n, t.message ? t : new Error(t))
                }
              )
            : n(null, r)
        })
      }
      function h(t, e, n) {
        try {
          t(e, n)
        } catch (t) {
          f(p, t)
        }
      }
      function p(t) {
        throw t
      }
      var d = 'function' == typeof Symbol
      function v(t) {
        return d && 'AsyncFunction' === t[Symbol.toStringTag]
      }
      function y(t) {
        return v(t) ? l(t) : t
      }
      function b(t) {
        return function (e) {
          var r = n(arguments, 1),
            o = i(function (n, r) {
              var i = this
              return t(
                e,
                function (t, e) {
                  y(t).apply(i, n.concat(e))
                },
                r
              )
            })
          return r.length ? o.apply(this, r) : o
        }
      }
      var g = 'object' == typeof St && St && St.Object === Object && St,
        m = 'object' == typeof self && self && self.Object === Object && self,
        D = g || m || Function('return this')(),
        w = D.Symbol,
        _ = Object.prototype,
        E = _.hasOwnProperty,
        x = _.toString,
        S = w ? w.toStringTag : void 0
      function C(t) {
        var e = E.call(t, S),
          n = t[S]
        try {
          t[S] = void 0
          var r = !0
        } catch (t) {}
        var i = x.call(t)
        return r && (e ? (t[S] = n) : delete t[S]), i
      }
      var F = Object.prototype.toString
      function O(t) {
        return F.call(t)
      }
      var j = '[object Null]',
        A = '[object Undefined]',
        k = w ? w.toStringTag : void 0
      function I(t) {
        return null == t ? (void 0 === t ? A : j) : k && k in Object(t) ? C(t) : O(t)
      }
      var T = '[object AsyncFunction]',
        N = '[object Function]',
        B = '[object GeneratorFunction]',
        P = '[object Proxy]'
      function R(t) {
        if (!o(t)) return !1
        var e = I(t)
        return e == N || e == B || e == T || e == P
      }
      var L = 9007199254740991
      function M(t) {
        return 'number' == typeof t && t > -1 && t % 1 == 0 && t <= L
      }
      function U(t) {
        return null != t && M(t.length) && !R(t)
      }
      var V = {}
      function $() {}
      function z(t) {
        return function () {
          if (null !== t) {
            var e = t
            ;(t = null), e.apply(this, arguments)
          }
        }
      }
      var q = 'function' == typeof Symbol && Symbol.iterator,
        W = function (t) {
          return q && t[q] && t[q]()
        }
      function G(t, e) {
        for (var n = -1, r = Array(t); ++n < t; ) r[n] = e(n)
        return r
      }
      function K(t) {
        return null != t && 'object' == typeof t
      }
      var Y = '[object Arguments]'
      function H(t) {
        return K(t) && I(t) == Y
      }
      var X = Object.prototype,
        J = X.hasOwnProperty,
        Z = X.propertyIsEnumerable,
        Q = H(
          (function () {
            return arguments
          })()
        )
          ? H
          : function (t) {
              return K(t) && J.call(t, 'callee') && !Z.call(t, 'callee')
            },
        tt = Array.isArray
      function et() {
        return !1
      }
      var nt = 'object' == typeof e && e && !e.nodeType && e,
        rt = nt && t && !t.nodeType && t,
        it = rt && rt.exports === nt ? D.Buffer : void 0,
        ot = (it ? it.isBuffer : void 0) || et,
        ut = 9007199254740991,
        st = /^(?:0|[1-9]\d*)$/
      function ct(t, e) {
        var n = typeof t
        return (
          !!(e = null == e ? ut : e) &&
          ('number' == n || ('symbol' != n && st.test(t))) &&
          t > -1 &&
          t % 1 == 0 &&
          t < e
        )
      }
      var at = '[object Arguments]',
        ft = '[object Array]',
        lt = '[object Boolean]',
        ht = '[object Date]',
        pt = '[object Error]',
        dt = '[object Function]',
        vt = '[object Map]',
        yt = '[object Number]',
        bt = '[object Object]',
        gt = '[object RegExp]',
        mt = '[object Set]',
        Dt = '[object String]',
        wt = '[object WeakMap]',
        _t = '[object ArrayBuffer]',
        Et = '[object DataView]',
        xt = '[object Float64Array]',
        Ct = '[object Int8Array]',
        Ft = '[object Int16Array]',
        Ot = '[object Int32Array]',
        jt = '[object Uint8Array]',
        At = '[object Uint8ClampedArray]',
        kt = '[object Uint16Array]',
        It = '[object Uint32Array]',
        Tt = {}
      function Nt(t) {
        return K(t) && M(t.length) && !!Tt[I(t)]
      }
      function Bt(t) {
        return function (e) {
          return t(e)
        }
      }
      ;(Tt['[object Float32Array]'] = Tt[xt] = Tt[Ct] = Tt[Ft] = Tt[Ot] = Tt[jt] = Tt[
        At
      ] = Tt[kt] = Tt[It] = !0),
        (Tt[at] = Tt[ft] = Tt[_t] = Tt[lt] = Tt[Et] = Tt[ht] = Tt[pt] = Tt[dt] = Tt[
          vt
        ] = Tt[yt] = Tt[bt] = Tt[gt] = Tt[mt] = Tt[Dt] = Tt[wt] = !1)
      var Pt = 'object' == typeof e && e && !e.nodeType && e,
        Rt = Pt && t && !t.nodeType && t,
        Lt = Rt && Rt.exports === Pt && g.process,
        Mt = (function () {
          try {
            var t = Rt && Rt.require && Rt.require('util').types
            return t || (Lt && Lt.binding && Lt.binding('util'))
          } catch (t) {}
        })(),
        Ut = Mt && Mt.isTypedArray,
        Vt = Ut ? Bt(Ut) : Nt,
        $t = Object.prototype.hasOwnProperty
      function zt(t, e) {
        var n = tt(t),
          r = !n && Q(t),
          i = !n && !r && ot(t),
          o = !n && !r && !i && Vt(t),
          u = n || r || i || o,
          s = u ? G(t.length, String) : [],
          c = s.length
        for (var a in t)
          (!e && !$t.call(t, a)) ||
            (u &&
              ('length' == a ||
                (i && ('offset' == a || 'parent' == a)) ||
                (o && ('buffer' == a || 'byteLength' == a || 'byteOffset' == a)) ||
                ct(a, c))) ||
            s.push(a)
        return s
      }
      var qt = Object.prototype
      function Wt(t) {
        var e = t && t.constructor
        return t === (('function' == typeof e && e.prototype) || qt)
      }
      function Gt(t, e) {
        return function (n) {
          return t(e(n))
        }
      }
      var Kt = Gt(Object.keys, Object),
        Yt = Object.prototype.hasOwnProperty
      function Ht(t) {
        if (!Wt(t)) return Kt(t)
        var e = []
        for (var n in Object(t)) Yt.call(t, n) && 'constructor' != n && e.push(n)
        return e
      }
      function Xt(t) {
        return U(t) ? zt(t) : Ht(t)
      }
      function Jt(t) {
        var e = -1,
          n = t.length
        return function () {
          return ++e < n ? { value: t[e], key: e } : null
        }
      }
      function Zt(t) {
        var e = -1
        return function () {
          var n = t.next()
          return n.done ? null : (e++, { value: n.value, key: e })
        }
      }
      function Qt(t) {
        var e = Xt(t),
          n = -1,
          r = e.length
        return function () {
          var i = e[++n]
          return n < r ? { value: t[i], key: i } : null
        }
      }
      function te(t) {
        if (U(t)) return Jt(t)
        var e = W(t)
        return e ? Zt(e) : Qt(t)
      }
      function ee(t) {
        return function () {
          if (null === t) throw new Error('Callback was already called.')
          var e = t
          ;(t = null), e.apply(this, arguments)
        }
      }
      function ne(t) {
        return function (e, n, r) {
          if (((r = z(r || $)), t <= 0 || !e)) return r(null)
          var i = te(e),
            o = !1,
            u = 0,
            s = !1
          function c(t, e) {
            if (((u -= 1), t)) (o = !0), r(t)
            else {
              if (e === V || (o && u <= 0)) return (o = !0), r(null)
              s || a()
            }
          }
          function a() {
            for (s = !0; u < t && !o; ) {
              var e = i()
              if (null === e) return (o = !0), void (u <= 0 && r(null))
              ;(u += 1), n(e.value, e.key, ee(c))
            }
            s = !1
          }
          a()
        }
      }
      function re(t, e, n, r) {
        ne(e)(t, y(n), r)
      }
      function ie(t, e) {
        return function (n, r, i) {
          return t(n, e, r, i)
        }
      }
      function oe(t, e, n) {
        n = z(n || $)
        var r = 0,
          i = 0,
          o = t.length
        function u(t, e) {
          t ? n(t) : (++i !== o && e !== V) || n(null)
        }
        for (0 === o && n(null); r < o; r++) e(t[r], r, ee(u))
      }
      var ue = ie(re, 1 / 0),
        se = function (t, e, n) {
          ;(U(t) ? oe : ue)(t, y(e), n)
        }
      function ce(t) {
        return function (e, n, r) {
          return t(se, e, y(n), r)
        }
      }
      function ae(t, e, n, r) {
        ;(r = r || $), (e = e || [])
        var i = [],
          o = 0,
          u = y(n)
        t(
          e,
          function (t, e, n) {
            var r = o++
            u(t, function (t, e) {
              ;(i[r] = e), n(t)
            })
          },
          function (t) {
            r(t, i)
          }
        )
      }
      var fe = ce(ae),
        le = b(fe)
      function he(t) {
        return function (e, n, r, i) {
          return t(ne(n), e, y(r), i)
        }
      }
      var pe = he(ae),
        de = ie(pe, 1),
        ve = b(de)
      function ye(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r && !1 !== e(t[n], n, t); );
        return t
      }
      function be(t) {
        return function (e, n, r) {
          for (var i = -1, o = Object(e), u = r(e), s = u.length; s--; ) {
            var c = u[t ? s : ++i]
            if (!1 === n(o[c], c, o)) break
          }
          return e
        }
      }
      var ge = be()
      function me(t, e) {
        return t && ge(t, e, Xt)
      }
      function De(t, e, n, r) {
        for (var i = t.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i; )
          if (e(t[o], o, t)) return o
        return -1
      }
      function we(t) {
        return t != t
      }
      function _e(t, e, n) {
        for (var r = n - 1, i = t.length; ++r < i; ) if (t[r] === e) return r
        return -1
      }
      function Ee(t, e, n) {
        return e == e ? _e(t, e, n) : De(t, we, n)
      }
      var xe = function (t, e, r) {
        'function' == typeof e && ((r = e), (e = null)), (r = z(r || $))
        var i = Xt(t).length
        if (!i) return r(null)
        e || (e = i)
        var o = {},
          u = 0,
          s = !1,
          c = Object.create(null),
          a = [],
          f = [],
          l = {}
        function h(t, e) {
          a.push(function () {
            b(t, e)
          })
        }
        function p() {
          if (0 === a.length && 0 === u) return r(null, o)
          for (; a.length && u < e; ) a.shift()()
        }
        function d(t, e) {
          var n = c[t]
          n || (n = c[t] = []), n.push(e)
        }
        function v(t) {
          ye(c[t] || [], function (t) {
            t()
          }),
            p()
        }
        function b(t, e) {
          if (!s) {
            var i = ee(function (e, i) {
              if ((u--, arguments.length > 2 && (i = n(arguments, 1)), e)) {
                var a = {}
                me(o, function (t, e) {
                  a[e] = t
                }),
                  (a[t] = i),
                  (s = !0),
                  (c = Object.create(null)),
                  r(e, a)
              } else (o[t] = i), v(t)
            })
            u++
            var a = y(e[e.length - 1])
            e.length > 1 ? a(o, i) : a(i)
          }
        }
        function g() {
          for (var t = 0; f.length; )
            t++,
              ye(m(f.pop()), function (t) {
                0 == --l[t] && f.push(t)
              })
          if (t !== i)
            throw new Error(
              'async.auto cannot execute tasks due to a recursive dependency'
            )
        }
        function m(e) {
          var n = []
          return (
            me(t, function (t, r) {
              tt(t) && Ee(t, e, 0) >= 0 && n.push(r)
            }),
            n
          )
        }
        me(t, function (e, n) {
          if (!tt(e)) return h(n, [e]), void f.push(n)
          var r = e.slice(0, e.length - 1),
            i = r.length
          if (0 === i) return h(n, e), void f.push(n)
          ;(l[n] = i),
            ye(r, function (o) {
              if (!t[o])
                throw new Error(
                  'async.auto task `' +
                    n +
                    '` has a non-existent dependency `' +
                    o +
                    '` in ' +
                    r.join(', ')
                )
              d(o, function () {
                0 == --i && h(n, e)
              })
            })
        }),
          g(),
          p()
      }
      function Se(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length, i = Array(r); ++n < r; )
          i[n] = e(t[n], n, t)
        return i
      }
      var Ce = '[object Symbol]'
      function Fe(t) {
        return 'symbol' == typeof t || (K(t) && I(t) == Ce)
      }
      var Oe = 1 / 0,
        je = w ? w.prototype : void 0,
        Ae = je ? je.toString : void 0
      function ke(t) {
        if ('string' == typeof t) return t
        if (tt(t)) return Se(t, ke) + ''
        if (Fe(t)) return Ae ? Ae.call(t) : ''
        var e = t + ''
        return '0' == e && 1 / t == -Oe ? '-0' : e
      }
      function Ie(t, e, n) {
        var r = -1,
          i = t.length
        e < 0 && (e = -e > i ? 0 : i + e),
          (n = n > i ? i : n) < 0 && (n += i),
          (i = e > n ? 0 : (n - e) >>> 0),
          (e >>>= 0)
        for (var o = Array(i); ++r < i; ) o[r] = t[r + e]
        return o
      }
      function Te(t, e, n) {
        var r = t.length
        return (n = void 0 === n ? r : n), !e && n >= r ? t : Ie(t, e, n)
      }
      function Ne(t, e) {
        for (var n = t.length; n-- && Ee(e, t[n], 0) > -1; );
        return n
      }
      function Be(t, e) {
        for (var n = -1, r = t.length; ++n < r && Ee(e, t[n], 0) > -1; );
        return n
      }
      function Pe(t) {
        return t.split('')
      }
      var Re = RegExp(
        '[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]'
      )
      function Le(t) {
        return Re.test(t)
      }
      var Me = '\\ud800-\\udfff',
        Ue = '[' + Me + ']',
        Ve = '[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]',
        $e = '\\ud83c[\\udffb-\\udfff]',
        ze = '[^' + Me + ']',
        qe = '(?:\\ud83c[\\udde6-\\uddff]){2}',
        We = '[\\ud800-\\udbff][\\udc00-\\udfff]',
        Ge = '(?:' + Ve + '|' + $e + ')?',
        Ke = '[\\ufe0e\\ufe0f]?',
        Ye = '(?:\\u200d(?:' + [ze, qe, We].join('|') + ')' + Ke + Ge + ')*',
        He = Ke + Ge + Ye,
        Xe = '(?:' + [ze + Ve + '?', Ve, qe, We, Ue].join('|') + ')',
        Je = RegExp($e + '(?=' + $e + ')|' + Xe + He, 'g')
      function Ze(t) {
        return t.match(Je) || []
      }
      function Qe(t) {
        return Le(t) ? Ze(t) : Pe(t)
      }
      function tn(t) {
        return null == t ? '' : ke(t)
      }
      var en = /^\s+|\s+$/g
      function nn(t, e, n) {
        if ((t = tn(t)) && (n || void 0 === e)) return t.replace(en, '')
        if (!t || !(e = ke(e))) return t
        var r = Qe(t),
          i = Qe(e)
        return Te(r, Be(r, i), Ne(r, i) + 1).join('')
      }
      var rn = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m,
        on = /,/,
        un = /(=.+)?(\s*)$/,
        sn = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
      function cn(t) {
        return (t = (t = (t = (t = t.toString().replace(sn, ''))
          .match(rn)[2]
          .replace(' ', ''))
          ? t.split(on)
          : []).map(function (t) {
          return nn(t.replace(un, ''))
        }))
      }
      function an(t, e) {
        var n = {}
        me(t, function (t, e) {
          var r,
            i = v(t),
            o = (!i && 1 === t.length) || (i && 0 === t.length)
          if (tt(t))
            (r = t.slice(0, -1)),
              (t = t[t.length - 1]),
              (n[e] = r.concat(r.length > 0 ? u : t))
          else if (o) n[e] = t
          else {
            if (((r = cn(t)), 0 === t.length && !i && 0 === r.length))
              throw new Error('autoInject task functions require explicit parameters.')
            i || r.pop(), (n[e] = r.concat(u))
          }
          function u(e, n) {
            var i = Se(r, function (t) {
              return e[t]
            })
            i.push(n), y(t).apply(null, i)
          }
        }),
          xe(n, e)
      }
      function fn() {
        ;(this.head = this.tail = null), (this.length = 0)
      }
      function ln(t, e) {
        ;(t.length = 1), (t.head = t.tail = e)
      }
      function hn(t, e, n) {
        if (null == e) e = 1
        else if (0 === e) throw new Error('Concurrency must not be zero')
        var r = y(t),
          i = 0,
          o = [],
          u = !1
        function s(t, e, n) {
          if (null != n && 'function' != typeof n)
            throw new Error('task callback must be a function')
          if (((l.started = !0), tt(t) || (t = [t]), 0 === t.length && l.idle()))
            return f(function () {
              l.drain()
            })
          for (var r = 0, i = t.length; r < i; r++) {
            var o = { data: t[r], callback: n || $ }
            e ? l._tasks.unshift(o) : l._tasks.push(o)
          }
          u ||
            ((u = !0),
            f(function () {
              ;(u = !1), l.process()
            }))
        }
        function c(t) {
          return function (e) {
            i -= 1
            for (var n = 0, r = t.length; n < r; n++) {
              var u = t[n],
                s = Ee(o, u, 0)
              0 === s ? o.shift() : s > 0 && o.splice(s, 1),
                u.callback.apply(u, arguments),
                null != e && l.error(e, u.data)
            }
            i <= l.concurrency - l.buffer && l.unsaturated(),
              l.idle() && l.drain(),
              l.process()
          }
        }
        var a = !1,
          l = {
            _tasks: new fn(),
            concurrency: e,
            payload: n,
            saturated: $,
            unsaturated: $,
            buffer: e / 4,
            empty: $,
            drain: $,
            error: $,
            started: !1,
            paused: !1,
            push: function (t, e) {
              s(t, !1, e)
            },
            kill: function () {
              ;(l.drain = $), l._tasks.empty()
            },
            unshift: function (t, e) {
              s(t, !0, e)
            },
            remove: function (t) {
              l._tasks.remove(t)
            },
            process: function () {
              if (!a) {
                for (a = !0; !l.paused && i < l.concurrency && l._tasks.length; ) {
                  var t = [],
                    e = [],
                    n = l._tasks.length
                  l.payload && (n = Math.min(n, l.payload))
                  for (var u = 0; u < n; u++) {
                    var s = l._tasks.shift()
                    t.push(s), o.push(s), e.push(s.data)
                  }
                  ;(i += 1),
                    0 === l._tasks.length && l.empty(),
                    i === l.concurrency && l.saturated()
                  var f = ee(c(t))
                  r(e, f)
                }
                a = !1
              }
            },
            length: function () {
              return l._tasks.length
            },
            running: function () {
              return i
            },
            workersList: function () {
              return o
            },
            idle: function () {
              return l._tasks.length + i === 0
            },
            pause: function () {
              l.paused = !0
            },
            resume: function () {
              !1 !== l.paused && ((l.paused = !1), f(l.process))
            }
          }
        return l
      }
      function pn(t, e) {
        return hn(t, 1, e)
      }
      ;(fn.prototype.removeLink = function (t) {
        return (
          t.prev ? (t.prev.next = t.next) : (this.head = t.next),
          t.next ? (t.next.prev = t.prev) : (this.tail = t.prev),
          (t.prev = t.next = null),
          (this.length -= 1),
          t
        )
      }),
        (fn.prototype.empty = function () {
          for (; this.head; ) this.shift()
          return this
        }),
        (fn.prototype.insertAfter = function (t, e) {
          ;(e.prev = t),
            (e.next = t.next),
            t.next ? (t.next.prev = e) : (this.tail = e),
            (t.next = e),
            (this.length += 1)
        }),
        (fn.prototype.insertBefore = function (t, e) {
          ;(e.prev = t.prev),
            (e.next = t),
            t.prev ? (t.prev.next = e) : (this.head = e),
            (t.prev = e),
            (this.length += 1)
        }),
        (fn.prototype.unshift = function (t) {
          this.head ? this.insertBefore(this.head, t) : ln(this, t)
        }),
        (fn.prototype.push = function (t) {
          this.tail ? this.insertAfter(this.tail, t) : ln(this, t)
        }),
        (fn.prototype.shift = function () {
          return this.head && this.removeLink(this.head)
        }),
        (fn.prototype.pop = function () {
          return this.tail && this.removeLink(this.tail)
        }),
        (fn.prototype.toArray = function () {
          for (var t = Array(this.length), e = this.head, n = 0; n < this.length; n++)
            (t[n] = e.data), (e = e.next)
          return t
        }),
        (fn.prototype.remove = function (t) {
          for (var e = this.head; e; ) {
            var n = e.next
            t(e) && this.removeLink(e), (e = n)
          }
          return this
        })
      var dn = ie(re, 1)
      function vn(t, e, n, r) {
        r = z(r || $)
        var i = y(n)
        dn(
          t,
          function (t, n, r) {
            i(e, t, function (t, n) {
              ;(e = n), r(t)
            })
          },
          function (t) {
            r(t, e)
          }
        )
      }
      function yn() {
        var t = Se(arguments, y)
        return function () {
          var e = n(arguments),
            r = this,
            i = e[e.length - 1]
          'function' == typeof i ? e.pop() : (i = $),
            vn(
              t,
              e,
              function (t, e, i) {
                e.apply(
                  r,
                  t.concat(function (t) {
                    var e = n(arguments, 1)
                    i(t, e)
                  })
                )
              },
              function (t, e) {
                i.apply(r, [t].concat(e))
              }
            )
        }
      }
      var bn = function () {
          return yn.apply(null, n(arguments).reverse())
        },
        gn = Array.prototype.concat,
        mn = function (t, e, r, i) {
          i = i || $
          var o = y(r)
          pe(
            t,
            e,
            function (t, e) {
              o(t, function (t) {
                return t ? e(t) : e(null, n(arguments, 1))
              })
            },
            function (t, e) {
              for (var n = [], r = 0; r < e.length; r++) e[r] && (n = gn.apply(n, e[r]))
              return i(t, n)
            }
          )
        },
        Dn = ie(mn, 1 / 0),
        wn = ie(mn, 1),
        _n = function () {
          var t = n(arguments),
            e = [null].concat(t)
          return function () {
            return arguments[arguments.length - 1].apply(this, e)
          }
        }
      function En(t) {
        return t
      }
      function xn(t, e) {
        return function (n, r, i, o) {
          o = o || $
          var u,
            s = !1
          n(
            r,
            function (n, r, o) {
              i(n, function (r, i) {
                r ? o(r) : t(i) && !u ? ((s = !0), (u = e(!0, n)), o(null, V)) : o()
              })
            },
            function (t) {
              t ? o(t) : o(null, s ? u : e(!1))
            }
          )
        }
      }
      function Sn(t, e) {
        return e
      }
      var Cn = ce(xn(En, Sn)),
        Fn = he(xn(En, Sn)),
        On = ie(Fn, 1)
      function jn(t) {
        return function (e) {
          var r = n(arguments, 1)
          r.push(function (e) {
            var r = n(arguments, 1)
            'object' == typeof console &&
              (e
                ? console.error && console.error(e)
                : console[t] &&
                  ye(r, function (e) {
                    console[t](e)
                  }))
          }),
            y(e).apply(null, r)
        }
      }
      var An = jn('dir')
      function kn(t, e, r) {
        r = ee(r || $)
        var i = y(t),
          o = y(e)
        function u(t) {
          if (t) return r(t)
          var e = n(arguments, 1)
          e.push(s), o.apply(this, e)
        }
        function s(t, e) {
          return t ? r(t) : e ? void i(u) : r(null)
        }
        s(null, !0)
      }
      function In(t, e, r) {
        r = ee(r || $)
        var i = y(t),
          o = function (t) {
            if (t) return r(t)
            var u = n(arguments, 1)
            if (e.apply(this, u)) return i(o)
            r.apply(null, [null].concat(u))
          }
        i(o)
      }
      function Tn(t, e, n) {
        In(
          t,
          function () {
            return !e.apply(this, arguments)
          },
          n
        )
      }
      function Nn(t, e, n) {
        n = ee(n || $)
        var r = y(e),
          i = y(t)
        function o(t) {
          if (t) return n(t)
          i(u)
        }
        function u(t, e) {
          return t ? n(t) : e ? void r(o) : n(null)
        }
        i(u)
      }
      function Bn(t) {
        return function (e, n, r) {
          return t(e, r)
        }
      }
      function Pn(t, e, n) {
        se(t, Bn(y(e)), n)
      }
      function Rn(t, e, n, r) {
        ne(e)(t, Bn(y(n)), r)
      }
      var Ln = ie(Rn, 1)
      function Mn(t) {
        return v(t)
          ? t
          : i(function (e, n) {
              var r = !0
              e.push(function () {
                var t = arguments
                r
                  ? f(function () {
                      n.apply(null, t)
                    })
                  : n.apply(null, t)
              }),
                t.apply(this, e),
                (r = !1)
            })
      }
      function Un(t) {
        return !t
      }
      var Vn = ce(xn(Un, Un)),
        $n = he(xn(Un, Un)),
        zn = ie($n, 1)
      function qn(t) {
        return function (e) {
          return null == e ? void 0 : e[t]
        }
      }
      function Wn(t, e, n, r) {
        var i = new Array(e.length)
        t(
          e,
          function (t, e, r) {
            n(t, function (t, n) {
              ;(i[e] = !!n), r(t)
            })
          },
          function (t) {
            if (t) return r(t)
            for (var n = [], o = 0; o < e.length; o++) i[o] && n.push(e[o])
            r(null, n)
          }
        )
      }
      function Gn(t, e, n, r) {
        var i = []
        t(
          e,
          function (t, e, r) {
            n(t, function (n, o) {
              n ? r(n) : (o && i.push({ index: e, value: t }), r())
            })
          },
          function (t) {
            t
              ? r(t)
              : r(
                  null,
                  Se(
                    i.sort(function (t, e) {
                      return t.index - e.index
                    }),
                    qn('value')
                  )
                )
          }
        )
      }
      function Kn(t, e, n, r) {
        ;(U(e) ? Wn : Gn)(t, e, y(n), r || $)
      }
      var Yn = ce(Kn),
        Hn = he(Kn),
        Xn = ie(Hn, 1)
      function Jn(t, e) {
        var n = ee(e || $),
          r = y(Mn(t))
        function i(t) {
          if (t) return n(t)
          r(i)
        }
        i()
      }
      var Zn = function (t, e, n, r) {
          r = r || $
          var i = y(n)
          pe(
            t,
            e,
            function (t, e) {
              i(t, function (n, r) {
                return n ? e(n) : e(null, { key: r, val: t })
              })
            },
            function (t, e) {
              for (
                var n = {}, i = Object.prototype.hasOwnProperty, o = 0;
                o < e.length;
                o++
              )
                if (e[o]) {
                  var u = e[o].key,
                    s = e[o].val
                  i.call(n, u) ? n[u].push(s) : (n[u] = [s])
                }
              return r(t, n)
            }
          )
        },
        Qn = ie(Zn, 1 / 0),
        tr = ie(Zn, 1),
        er = jn('log')
      function nr(t, e, n, r) {
        r = z(r || $)
        var i = {},
          o = y(n)
        re(
          t,
          e,
          function (t, e, n) {
            o(t, e, function (t, r) {
              if (t) return n(t)
              ;(i[e] = r), n()
            })
          },
          function (t) {
            r(t, i)
          }
        )
      }
      var rr = ie(nr, 1 / 0),
        ir = ie(nr, 1)
      function or(t, e) {
        return e in t
      }
      function ur(t, e) {
        var r = Object.create(null),
          o = Object.create(null)
        e = e || En
        var u = y(t),
          s = i(function (t, i) {
            var s = e.apply(null, t)
            or(r, s)
              ? f(function () {
                  i.apply(null, r[s])
                })
              : or(o, s)
              ? o[s].push(i)
              : ((o[s] = [i]),
                u.apply(
                  null,
                  t.concat(function () {
                    var t = n(arguments)
                    r[s] = t
                    var e = o[s]
                    delete o[s]
                    for (var i = 0, u = e.length; i < u; i++) e[i].apply(null, t)
                  })
                ))
          })
        return (s.memo = r), (s.unmemoized = t), s
      }
      var sr = a(s ? process.nextTick : u ? setImmediate : c)
      function cr(t, e, r) {
        r = r || $
        var i = U(e) ? [] : {}
        t(
          e,
          function (t, e, r) {
            y(t)(function (t, o) {
              arguments.length > 2 && (o = n(arguments, 1)), (i[e] = o), r(t)
            })
          },
          function (t) {
            r(t, i)
          }
        )
      }
      function ar(t, e) {
        cr(se, t, e)
      }
      function fr(t, e, n) {
        cr(ne(e), t, n)
      }
      var lr = function (t, e) {
          var n = y(t)
          return hn(
            function (t, e) {
              n(t[0], e)
            },
            e,
            1
          )
        },
        hr = function (t, e) {
          var n = lr(t, e)
          return (
            (n.push = function (t, e, r) {
              if ((null == r && (r = $), 'function' != typeof r))
                throw new Error('task callback must be a function')
              if (((n.started = !0), tt(t) || (t = [t]), 0 === t.length))
                return f(function () {
                  n.drain()
                })
              e = e || 0
              for (var i = n._tasks.head; i && e >= i.priority; ) i = i.next
              for (var o = 0, u = t.length; o < u; o++) {
                var s = { data: t[o], priority: e, callback: r }
                i ? n._tasks.insertBefore(i, s) : n._tasks.push(s)
              }
              f(n.process)
            }),
            delete n.unshift,
            n
          )
        }
      function pr(t, e) {
        if (((e = z(e || $)), !tt(t)))
          return e(new TypeError('First argument to race must be an array of functions'))
        if (!t.length) return e()
        for (var n = 0, r = t.length; n < r; n++) y(t[n])(e)
      }
      function dr(t, e, r, i) {
        vn(n(t).reverse(), e, r, i)
      }
      function vr(t) {
        var e = y(t)
        return i(function (t, r) {
          return (
            t.push(function (t, e) {
              var i
              t
                ? r(null, { error: t })
                : ((i = arguments.length <= 2 ? e : n(arguments, 1)),
                  r(null, { value: i }))
            }),
            e.apply(this, t)
          )
        })
      }
      function yr(t) {
        var e
        return (
          tt(t)
            ? (e = Se(t, vr))
            : ((e = {}),
              me(t, function (t, n) {
                e[n] = vr.call(this, t)
              })),
          e
        )
      }
      function br(t, e, n, r) {
        Kn(
          t,
          e,
          function (t, e) {
            n(t, function (t, n) {
              e(t, !n)
            })
          },
          r
        )
      }
      var gr = ce(br),
        mr = he(br),
        Dr = ie(mr, 1)
      function wr(t) {
        return function () {
          return t
        }
      }
      function _r(t, e, n) {
        var r = 5,
          i = 0,
          o = { times: r, intervalFunc: wr(i) }
        function u(t, e) {
          if ('object' == typeof e)
            (t.times = +e.times || r),
              (t.intervalFunc =
                'function' == typeof e.interval ? e.interval : wr(+e.interval || i)),
              (t.errorFilter = e.errorFilter)
          else {
            if ('number' != typeof e && 'string' != typeof e)
              throw new Error('Invalid arguments for async.retry')
            t.times = +e || r
          }
        }
        if (
          (arguments.length < 3 && 'function' == typeof t
            ? ((n = e || $), (e = t))
            : (u(o, t), (n = n || $)),
          'function' != typeof e)
        )
          throw new Error('Invalid arguments for async.retry')
        var s = y(e),
          c = 1
        function a() {
          s(function (t) {
            t && c++ < o.times && ('function' != typeof o.errorFilter || o.errorFilter(t))
              ? setTimeout(a, o.intervalFunc(c))
              : n.apply(null, arguments)
          })
        }
        a()
      }
      var Er = function (t, e) {
        e || ((e = t), (t = null))
        var n = y(e)
        return i(function (e, r) {
          function i(t) {
            n.apply(null, e.concat(t))
          }
          t ? _r(t, i, r) : _r(i, r)
        })
      }
      function xr(t, e) {
        cr(dn, t, e)
      }
      var Sr = ce(xn(Boolean, En)),
        Cr = he(xn(Boolean, En)),
        Fr = ie(Cr, 1)
      function Or(t, e, n) {
        var r = y(e)
        function i(t, e) {
          var n = t.criteria,
            r = e.criteria
          return n < r ? -1 : n > r ? 1 : 0
        }
        fe(
          t,
          function (t, e) {
            r(t, function (n, r) {
              if (n) return e(n)
              e(null, { value: t, criteria: r })
            })
          },
          function (t, e) {
            if (t) return n(t)
            n(null, Se(e.sort(i), qn('value')))
          }
        )
      }
      function jr(t, e, n) {
        var r = y(t)
        return i(function (i, o) {
          var u,
            s = !1
          function c() {
            var e = t.name || 'anonymous',
              r = new Error('Callback function "' + e + '" timed out.')
            ;(r.code = 'ETIMEDOUT'), n && (r.info = n), (s = !0), o(r)
          }
          i.push(function () {
            s || (o.apply(null, arguments), clearTimeout(u))
          }),
            (u = setTimeout(c, e)),
            r.apply(null, i)
        })
      }
      var Ar = Math.ceil,
        kr = Math.max
      function Ir(t, e, n, r) {
        for (var i = -1, o = kr(Ar((e - t) / (n || 1)), 0), u = Array(o); o--; )
          (u[r ? o : ++i] = t), (t += n)
        return u
      }
      function Tr(t, e, n, r) {
        var i = y(n)
        pe(Ir(0, t, 1), e, i, r)
      }
      var Nr = ie(Tr, 1 / 0),
        Br = ie(Tr, 1)
      function Pr(t, e, n, r) {
        arguments.length <= 3 && ((r = n), (n = e), (e = tt(t) ? [] : {})),
          (r = z(r || $))
        var i = y(n)
        se(
          t,
          function (t, n, r) {
            i(e, t, n, r)
          },
          function (t) {
            r(t, e)
          }
        )
      }
      function Rr(t, e) {
        var r,
          i = null
        ;(e = e || $),
          Ln(
            t,
            function (t, e) {
              y(t)(function (t, o) {
                ;(r = arguments.length > 2 ? n(arguments, 1) : o), (i = t), e(!t)
              })
            },
            function () {
              e(i, r)
            }
          )
      }
      function Lr(t) {
        return function () {
          return (t.unmemoized || t).apply(null, arguments)
        }
      }
      function Mr(t, e, r) {
        r = ee(r || $)
        var i = y(e)
        if (!t()) return r(null)
        var o = function (e) {
          if (e) return r(e)
          if (t()) return i(o)
          var u = n(arguments, 1)
          r.apply(null, [null].concat(u))
        }
        i(o)
      }
      function Ur(t, e, n) {
        Mr(
          function () {
            return !t.apply(this, arguments)
          },
          e,
          n
        )
      }
      var Vr = function (t, e) {
          if (((e = z(e || $)), !tt(t)))
            return e(
              new Error('First argument to waterfall must be an array of functions')
            )
          if (!t.length) return e()
          var r = 0
          function i(e) {
            var n = y(t[r++])
            e.push(ee(o)), n.apply(null, e)
          }
          function o(o) {
            if (o || r === t.length) return e.apply(null, arguments)
            i(n(arguments, 1))
          }
          i([])
        },
        $r = {
          apply: r,
          applyEach: le,
          applyEachSeries: ve,
          asyncify: l,
          auto: xe,
          autoInject: an,
          cargo: pn,
          compose: bn,
          concat: Dn,
          concatLimit: mn,
          concatSeries: wn,
          constant: _n,
          detect: Cn,
          detectLimit: Fn,
          detectSeries: On,
          dir: An,
          doDuring: kn,
          doUntil: Tn,
          doWhilst: In,
          during: Nn,
          each: Pn,
          eachLimit: Rn,
          eachOf: se,
          eachOfLimit: re,
          eachOfSeries: dn,
          eachSeries: Ln,
          ensureAsync: Mn,
          every: Vn,
          everyLimit: $n,
          everySeries: zn,
          filter: Yn,
          filterLimit: Hn,
          filterSeries: Xn,
          forever: Jn,
          groupBy: Qn,
          groupByLimit: Zn,
          groupBySeries: tr,
          log: er,
          map: fe,
          mapLimit: pe,
          mapSeries: de,
          mapValues: rr,
          mapValuesLimit: nr,
          mapValuesSeries: ir,
          memoize: ur,
          nextTick: sr,
          parallel: ar,
          parallelLimit: fr,
          priorityQueue: hr,
          queue: lr,
          race: pr,
          reduce: vn,
          reduceRight: dr,
          reflect: vr,
          reflectAll: yr,
          reject: gr,
          rejectLimit: mr,
          rejectSeries: Dr,
          retry: _r,
          retryable: Er,
          seq: yn,
          series: xr,
          setImmediate: f,
          some: Sr,
          someLimit: Cr,
          someSeries: Fr,
          sortBy: Or,
          timeout: jr,
          times: Nr,
          timesLimit: Tr,
          timesSeries: Br,
          transform: Pr,
          tryEach: Rr,
          unmemoize: Lr,
          until: Ur,
          waterfall: Vr,
          whilst: Mr,
          all: Vn,
          allLimit: $n,
          allSeries: zn,
          any: Sr,
          anyLimit: Cr,
          anySeries: Fr,
          find: Cn,
          findLimit: Fn,
          findSeries: On,
          forEach: Pn,
          forEachSeries: Ln,
          forEachLimit: Rn,
          forEachOf: se,
          forEachOfSeries: dn,
          forEachOfLimit: re,
          inject: vn,
          foldl: vn,
          foldr: dr,
          select: Yn,
          selectLimit: Hn,
          selectSeries: Xn,
          wrapSync: l
        }
      ;(e.default = $r),
        (e.apply = r),
        (e.applyEach = le),
        (e.applyEachSeries = ve),
        (e.asyncify = l),
        (e.auto = xe),
        (e.autoInject = an),
        (e.cargo = pn),
        (e.compose = bn),
        (e.concat = Dn),
        (e.concatLimit = mn),
        (e.concatSeries = wn),
        (e.constant = _n),
        (e.detect = Cn),
        (e.detectLimit = Fn),
        (e.detectSeries = On),
        (e.dir = An),
        (e.doDuring = kn),
        (e.doUntil = Tn),
        (e.doWhilst = In),
        (e.during = Nn),
        (e.each = Pn),
        (e.eachLimit = Rn),
        (e.eachOf = se),
        (e.eachOfLimit = re),
        (e.eachOfSeries = dn),
        (e.eachSeries = Ln),
        (e.ensureAsync = Mn),
        (e.every = Vn),
        (e.everyLimit = $n),
        (e.everySeries = zn),
        (e.filter = Yn),
        (e.filterLimit = Hn),
        (e.filterSeries = Xn),
        (e.forever = Jn),
        (e.groupBy = Qn),
        (e.groupByLimit = Zn),
        (e.groupBySeries = tr),
        (e.log = er),
        (e.map = fe),
        (e.mapLimit = pe),
        (e.mapSeries = de),
        (e.mapValues = rr),
        (e.mapValuesLimit = nr),
        (e.mapValuesSeries = ir),
        (e.memoize = ur),
        (e.nextTick = sr),
        (e.parallel = ar),
        (e.parallelLimit = fr),
        (e.priorityQueue = hr),
        (e.queue = lr),
        (e.race = pr),
        (e.reduce = vn),
        (e.reduceRight = dr),
        (e.reflect = vr),
        (e.reflectAll = yr),
        (e.reject = gr),
        (e.rejectLimit = mr),
        (e.rejectSeries = Dr),
        (e.retry = _r),
        (e.retryable = Er),
        (e.seq = yn),
        (e.series = xr),
        (e.setImmediate = f),
        (e.some = Sr),
        (e.someLimit = Cr),
        (e.someSeries = Fr),
        (e.sortBy = Or),
        (e.timeout = jr),
        (e.times = Nr),
        (e.timesLimit = Tr),
        (e.timesSeries = Br),
        (e.transform = Pr),
        (e.tryEach = Rr),
        (e.unmemoize = Lr),
        (e.until = Ur),
        (e.waterfall = Vr),
        (e.whilst = Mr),
        (e.all = Vn),
        (e.allLimit = $n),
        (e.allSeries = zn),
        (e.any = Sr),
        (e.anyLimit = Cr),
        (e.anySeries = Fr),
        (e.find = Cn),
        (e.findLimit = Fn),
        (e.findSeries = On),
        (e.forEach = Pn),
        (e.forEachSeries = Ln),
        (e.forEachLimit = Rn),
        (e.forEachOf = se),
        (e.forEachOfSeries = dn),
        (e.forEachOfLimit = re),
        (e.inject = vn),
        (e.foldl = vn),
        (e.foldr = dr),
        (e.select = Yn),
        (e.selectLimit = Hn),
        (e.selectSeries = Xn),
        (e.wrapSync = l),
        Object.defineProperty(e, '__esModule', { value: !0 })
    })(e)
  }),
  jt = 1e3,
  At = 60 * jt,
  kt = 60 * At,
  It = 24 * kt,
  Tt = 7 * It,
  Nt = 365.25 * It,
  Bt = function (t, e) {
    e = e || {}
    var n = typeof t
    if ('string' === n && t.length > 0)
      return (function (t) {
        if ((t = String(t)).length > 100) return
        var e = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          t
        )
        if (!e) return
        var n = parseFloat(e[1])
        switch ((e[2] || 'ms').toLowerCase()) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return n * Nt
          case 'weeks':
          case 'week':
          case 'w':
            return n * Tt
          case 'days':
          case 'day':
          case 'd':
            return n * It
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return n * kt
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return n * At
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return n * jt
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return n
          default:
            return
        }
      })(t)
    if ('number' === n && isFinite(t))
      return e.long
        ? (function (t) {
            var e = Math.abs(t)
            if (e >= It) return Pt(t, e, It, 'day')
            if (e >= kt) return Pt(t, e, kt, 'hour')
            if (e >= At) return Pt(t, e, At, 'minute')
            if (e >= jt) return Pt(t, e, jt, 'second')
            return t + ' ms'
          })(t)
        : (function (t) {
            var e = Math.abs(t)
            if (e >= It) return Math.round(t / It) + 'd'
            if (e >= kt) return Math.round(t / kt) + 'h'
            if (e >= At) return Math.round(t / At) + 'm'
            if (e >= jt) return Math.round(t / jt) + 's'
            return t + 'ms'
          })(t)
    throw new Error(
      'val is not a non-empty string or a valid number. val=' + JSON.stringify(t)
    )
  }
function Pt(t, e, n, r) {
  var i = e >= 1.5 * n
  return Math.round(t / n) + ' ' + r + (i ? 's' : '')
}
var Rt = function (t) {
    function e(t) {
      for (var e = 0, r = 0; r < t.length; r++)
        (e = (e << 5) - e + t.charCodeAt(r)), (e |= 0)
      return n.colors[Math.abs(e) % n.colors.length]
    }
    function n(t) {
      var o
      function u() {
        if (u.enabled) {
          for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
            e[r] = arguments[r]
          var i = u,
            s = Number(new Date()),
            c = s - (o || s)
          ;(i.diff = c),
            (i.prev = o),
            (i.curr = s),
            (o = s),
            (e[0] = n.coerce(e[0])),
            'string' != typeof e[0] && e.unshift('%O')
          var a = 0
          ;(e[0] = e[0].replace(/%([a-zA-Z%])/g, function (t, r) {
            if ('%%' === t) return t
            a++
            var o = n.formatters[r]
            if ('function' == typeof o) {
              var u = e[a]
              ;(t = o.call(i, u)), e.splice(a, 1), a--
            }
            return t
          })),
            n.formatArgs.call(i, e)
          var f = i.log || n.log
          f.apply(i, e)
        }
      }
      return (
        (u.namespace = t),
        (u.enabled = n.enabled(t)),
        (u.useColors = n.useColors()),
        (u.color = e(t)),
        (u.destroy = r),
        (u.extend = i),
        'function' == typeof n.init && n.init(u),
        n.instances.push(u),
        u
      )
    }
    function r() {
      var t = n.instances.indexOf(this)
      return -1 !== t && (n.instances.splice(t, 1), !0)
    }
    function i(t, e) {
      return n(this.namespace + (void 0 === e ? ':' : e) + t)
    }
    return (
      (n.debug = n),
      (n.default = n),
      (n.coerce = function (t) {
        if (t instanceof Error) return t.stack || t.message
        return t
      }),
      (n.disable = function () {
        n.enable('')
      }),
      (n.enable = function (t) {
        var e
        n.save(t), (n.names = []), (n.skips = [])
        var r = ('string' == typeof t ? t : '').split(/[\s,]+/),
          i = r.length
        for (e = 0; e < i; e++)
          r[e] &&
            ('-' === (t = r[e].replace(/\*/g, '.*?'))[0]
              ? n.skips.push(new RegExp('^' + t.substr(1) + '$'))
              : n.names.push(new RegExp('^' + t + '$')))
        for (e = 0; e < n.instances.length; e++) {
          var o = n.instances[e]
          o.enabled = n.enabled(o.namespace)
        }
      }),
      (n.enabled = function (t) {
        if ('*' === t[t.length - 1]) return !0
        var e, r
        for (e = 0, r = n.skips.length; e < r; e++) if (n.skips[e].test(t)) return !1
        for (e = 0, r = n.names.length; e < r; e++) if (n.names[e].test(t)) return !0
        return !1
      }),
      (n.humanize = Bt),
      Object.keys(t).forEach(function (e) {
        n[e] = t[e]
      }),
      (n.instances = []),
      (n.names = []),
      (n.skips = []),
      (n.formatters = {}),
      (n.selectColor = e),
      n.enable(n.load()),
      n
    )
  },
  Lt = Ft(function (t, e) {
    function n(t) {
      return (n =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t
            }
          : function (t) {
              return t &&
                'function' == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? 'symbol'
                : typeof t
            })(t)
    }
    ;(e.log = function () {
      var t
      return (
        'object' === ('undefined' == typeof console ? 'undefined' : n(console)) &&
        console.log &&
        (t = console).log.apply(t, arguments)
      )
    }),
      (e.formatArgs = function (e) {
        if (
          ((e[0] =
            (this.useColors ? '%c' : '') +
            this.namespace +
            (this.useColors ? ' %c' : ' ') +
            e[0] +
            (this.useColors ? '%c ' : ' ') +
            '+' +
            t.exports.humanize(this.diff)),
          !this.useColors)
        )
          return
        var n = 'color: ' + this.color
        e.splice(1, 0, n, 'color: inherit')
        var r = 0,
          i = 0
        e[0].replace(/%[a-zA-Z%]/g, function (t) {
          '%%' !== t && (r++, '%c' === t && (i = r))
        }),
          e.splice(i, 0, n)
      }),
      (e.save = function (t) {
        try {
          t ? e.storage.setItem('debug', t) : e.storage.removeItem('debug')
        } catch (t) {}
      }),
      (e.load = function () {
        var t
        try {
          t = e.storage.getItem('debug')
        } catch (t) {}
        !t && 'undefined' != typeof process && 'env' in process && (t = process.env.DEBUG)
        return t
      }),
      (e.useColors = function () {
        if (
          'undefined' != typeof window &&
          window.process &&
          ('renderer' === window.process.type || window.process.__nwjs)
        )
          return !0
        if (
          'undefined' != typeof navigator &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
        )
          return !1
        return (
          ('undefined' != typeof document &&
            document.documentElement &&
            document.documentElement.style &&
            document.documentElement.style.WebkitAppearance) ||
          ('undefined' != typeof window &&
            window.console &&
            (window.console.firebug ||
              (window.console.exception && window.console.table))) ||
          ('undefined' != typeof navigator &&
            navigator.userAgent &&
            navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
            parseInt(RegExp.$1, 10) >= 31) ||
          ('undefined' != typeof navigator &&
            navigator.userAgent &&
            navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
        )
      }),
      (e.storage = (function () {
        try {
          return localStorage
        } catch (t) {}
      })()),
      (e.colors = [
        '#0000CC',
        '#0000FF',
        '#0033CC',
        '#0033FF',
        '#0066CC',
        '#0066FF',
        '#0099CC',
        '#0099FF',
        '#00CC00',
        '#00CC33',
        '#00CC66',
        '#00CC99',
        '#00CCCC',
        '#00CCFF',
        '#3300CC',
        '#3300FF',
        '#3333CC',
        '#3333FF',
        '#3366CC',
        '#3366FF',
        '#3399CC',
        '#3399FF',
        '#33CC00',
        '#33CC33',
        '#33CC66',
        '#33CC99',
        '#33CCCC',
        '#33CCFF',
        '#6600CC',
        '#6600FF',
        '#6633CC',
        '#6633FF',
        '#66CC00',
        '#66CC33',
        '#9900CC',
        '#9900FF',
        '#9933CC',
        '#9933FF',
        '#99CC00',
        '#99CC33',
        '#CC0000',
        '#CC0033',
        '#CC0066',
        '#CC0099',
        '#CC00CC',
        '#CC00FF',
        '#CC3300',
        '#CC3333',
        '#CC3366',
        '#CC3399',
        '#CC33CC',
        '#CC33FF',
        '#CC6600',
        '#CC6633',
        '#CC9900',
        '#CC9933',
        '#CCCC00',
        '#CCCC33',
        '#FF0000',
        '#FF0033',
        '#FF0066',
        '#FF0099',
        '#FF00CC',
        '#FF00FF',
        '#FF3300',
        '#FF3333',
        '#FF3366',
        '#FF3399',
        '#FF33CC',
        '#FF33FF',
        '#FF6600',
        '#FF6633',
        '#FF9900',
        '#FF9933',
        '#FFCC00',
        '#FFCC33'
      ]),
      (t.exports = Rt(e)),
      (t.exports.formatters.j = function (t) {
        try {
          return JSON.stringify(t)
        } catch (t) {
          return '[UnexpectedJSONParseError]: ' + t.message
        }
      })
  }),
  Mt = (t, e = process.argv) => {
    const n = t.startsWith('-') ? '' : 1 === t.length ? '-' : '--',
      r = e.indexOf(n + t),
      i = e.indexOf('--')
    return -1 !== r && (-1 === i || r < i)
  }
const { env: Ut } = process
let Vt
function $t(t) {
  return 0 !== t && { level: t, hasBasic: !0, has256: t >= 2, has16m: t >= 3 }
}
function zt(t, e) {
  if (0 === Vt) return 0
  if (Mt('color=16m') || Mt('color=full') || Mt('color=truecolor')) return 3
  if (Mt('color=256')) return 2
  if (t && !e && void 0 === Vt) return 0
  const n = Vt || 0
  if ('dumb' === Ut.TERM) return n
  if ('win32' === process.platform) {
    const t = _.default.release().split('.')
    return Number(t[0]) >= 10 && Number(t[2]) >= 10586
      ? Number(t[2]) >= 14931
        ? 3
        : 2
      : 1
  }
  if ('CI' in Ut)
    return [
      'TRAVIS',
      'CIRCLECI',
      'APPVEYOR',
      'GITLAB_CI',
      'GITHUB_ACTIONS',
      'BUILDKITE'
    ].some((t) => t in Ut) || 'codeship' === Ut.CI_NAME
      ? 1
      : n
  if ('TEAMCITY_VERSION' in Ut)
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(Ut.TEAMCITY_VERSION) ? 1 : 0
  if ('truecolor' === Ut.COLORTERM) return 3
  if ('TERM_PROGRAM' in Ut) {
    const t = parseInt((Ut.TERM_PROGRAM_VERSION || '').split('.')[0], 10)
    switch (Ut.TERM_PROGRAM) {
      case 'iTerm.app':
        return t >= 3 ? 3 : 2
      case 'Apple_Terminal':
        return 2
    }
  }
  return /-256(color)?$/i.test(Ut.TERM)
    ? 2
    : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Ut.TERM) ||
      'COLORTERM' in Ut
    ? 1
    : n
}
Mt('no-color') || Mt('no-colors') || Mt('color=false') || Mt('color=never')
  ? (Vt = 0)
  : (Mt('color') || Mt('colors') || Mt('color=true') || Mt('color=always')) && (Vt = 1),
  'FORCE_COLOR' in Ut &&
    (Vt =
      'true' === Ut.FORCE_COLOR
        ? 1
        : 'false' === Ut.FORCE_COLOR
        ? 0
        : 0 === Ut.FORCE_COLOR.length
        ? 1
        : Math.min(parseInt(Ut.FORCE_COLOR, 10), 3))
var qt = {
    supportsColor: function (t) {
      return $t(zt(t, t && t.isTTY))
    },
    stdout: $t(zt(!0, x.default.isatty(1))),
    stderr: $t(zt(!0, x.default.isatty(2)))
  },
  Wt = Ft(function (t, e) {
    ;(e.init = function (t) {
      t.inspectOpts = {}
      for (var n = Object.keys(e.inspectOpts), r = 0; r < n.length; r++)
        t.inspectOpts[n[r]] = e.inspectOpts[n[r]]
    }),
      (e.log = function () {
        return process.stderr.write(w.default.format.apply(w.default, arguments) + '\n')
      }),
      (e.formatArgs = function (n) {
        var r = this.namespace
        if (this.useColors) {
          var i = this.color,
            o = '[3' + (i < 8 ? i : '8;5;' + i),
            u = '  '.concat(o, ';1m').concat(r, ' [0m')
          ;(n[0] = u + n[0].split('\n').join('\n' + u)),
            n.push(o + 'm+' + t.exports.humanize(this.diff) + '[0m')
        } else
          n[0] =
            (function () {
              if (e.inspectOpts.hideDate) return ''
              return new Date().toISOString() + ' '
            })() +
            r +
            ' ' +
            n[0]
      }),
      (e.save = function (t) {
        t ? (process.env.DEBUG = t) : delete process.env.DEBUG
      }),
      (e.load = function () {
        return process.env.DEBUG
      }),
      (e.useColors = function () {
        return 'colors' in e.inspectOpts
          ? Boolean(e.inspectOpts.colors)
          : x.default.isatty(process.stderr.fd)
      }),
      (e.colors = [6, 2, 3, 4, 5, 1])
    try {
      qt &&
        (qt.stderr || qt).level >= 2 &&
        (e.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ])
    } catch (t) {}
    ;(e.inspectOpts = Object.keys(process.env)
      .filter(function (t) {
        return /^debug_/i.test(t)
      })
      .reduce(function (t, e) {
        var n = e
            .substring(6)
            .toLowerCase()
            .replace(/_([a-z])/g, function (t, e) {
              return e.toUpperCase()
            }),
          r = process.env[e]
        return (
          (r =
            !!/^(yes|on|true|enabled)$/i.test(r) ||
            (!/^(no|off|false|disabled)$/i.test(r) && ('null' === r ? null : Number(r)))),
          (t[n] = r),
          t
        )
      }, {})),
      (t.exports = Rt(e))
    var n = t.exports.formatters
    ;(n.o = function (t) {
      return (
        (this.inspectOpts.colors = this.useColors),
        w.default
          .inspect(t, this.inspectOpts)
          .split('\n')
          .map(function (t) {
            return t.trim()
          })
          .join(' ')
      )
    }),
      (n.O = function (t) {
        return (
          (this.inspectOpts.colors = this.useColors),
          w.default.inspect(t, this.inspectOpts)
        )
      })
  }),
  Gt = Ft(function (t) {
    'undefined' == typeof process ||
    'renderer' === process.type ||
    !0 === process.browser ||
    process.__nwjs
      ? (t.exports = Lt)
      : (t.exports = Wt)
  }),
  Kt = parseInt('0777', 8),
  Yt = (Ht.mkdirp = Ht.mkdirP = Ht)
function Ht(t, e, n, r) {
  'function' == typeof e
    ? ((n = e), (e = {}))
    : (e && 'object' == typeof e) || (e = { mode: e })
  var i = e.mode,
    o = e.fs || m.default
  void 0 === i && (i = Kt), r || (r = null)
  var u = n || function () {}
  ;(t = D.default.resolve(t)),
    o.mkdir(t, i, function (n) {
      if (!n) return u(null, (r = r || t))
      switch (n.code) {
        case 'ENOENT':
          if (D.default.dirname(t) === t) return u(n)
          Ht(D.default.dirname(t), e, function (n, r) {
            n ? u(n, r) : Ht(t, e, u, r)
          })
          break
        default:
          o.stat(t, function (t, e) {
            t || !e.isDirectory() ? u(n, r) : u(null, r)
          })
      }
    })
}
Ht.sync = function t(e, n, r) {
  ;(n && 'object' == typeof n) || (n = { mode: n })
  var i = n.mode,
    o = n.fs || m.default
  void 0 === i && (i = Kt), r || (r = null), (e = D.default.resolve(e))
  try {
    o.mkdirSync(e, i), (r = r || e)
  } catch (i) {
    switch (i.code) {
      case 'ENOENT':
        ;(r = t(D.default.dirname(e), n, r)), t(e, n, r)
        break
      default:
        var u
        try {
          u = o.statSync(e)
        } catch (t) {
          throw i
        }
        if (!u.isDirectory()) throw i
    }
  }
  return r
}
var Xt = Ft(function (t, e) {
    var n = Yt.mkdirp,
      r = Gt('portfinder:testPort'),
      i = Gt('portfinder:getPort'),
      o = Gt('portfinder:defaultHosts'),
      u = {
        testPort: function (t, n) {
          function i() {
            r('done w/ testPort(): OK', t.host, 'port', t.port),
              t.server.removeListener('error', o),
              t.server.close(),
              n(null, t.port)
          }
          function o(o) {
            if (
              (r(
                'done w/ testPort(): failed',
                t.host,
                'w/ port',
                t.port,
                'with error',
                o.code
              ),
              t.server.removeListener('listening', i),
              'EADDRINUSE' != o.code && 'EACCES' != o.code)
            )
              return n(o)
            var s = e.nextPort(t.port)
            if (s > e.highestPort) return n(new Error('No open ports available'))
            u.testPort({ port: s, host: t.host, server: t.server }, n)
          }
          n || ((n = t), (t = {})),
            (t.server = t.server || E.default.createServer(function () {})),
            r('entered testPort(): trying', t.host, 'port', t.port),
            t.server.once('error', o),
            t.server.once('listening', i),
            t.host ? t.server.listen(t.port, t.host) : t.server.listen(t.port)
        }
      }
    ;(e.basePort = 8e3),
      (e.highestPort = 65535),
      (e.basePath = '/tmp/portfinder'),
      (e.getPort = function (t, n) {
        if (
          (n || ((n = t), (t = {})),
          (t.port = Number(t.port) || Number(e.basePort)),
          (t.host = t.host || null),
          (t.stopPort = Number(t.stopPort) || Number(e.highestPort)),
          !t.startPort)
        ) {
          if (((t.startPort = Number(t.port)), t.startPort < 0))
            throw Error(
              'Provided options.startPort(' +
                t.startPort +
                ') is less than 0, which are cannot be bound.'
            )
          if (t.stopPort < t.startPort)
            throw Error(
              'Provided options.stopPort(' +
                t.stopPort +
                'is less than options.startPort (' +
                t.startPort +
                ')'
            )
        }
        if (t.host) {
          for (var r, o = 0; o < e._defaultHosts.length; o++)
            if (e._defaultHosts[o] === t.host) {
              r = !0
              break
            }
          r || e._defaultHosts.push(t.host)
        }
        var s,
          c = []
        return Ot.eachSeries(
          e._defaultHosts,
          function (e, n) {
            return (
              i('in eachSeries() iteration callback: host is', e),
              u.testPort({ host: e, port: t.port }, function (t, r) {
                return t
                  ? (i(
                      'in eachSeries() iteration callback testPort() callback',
                      'with an err:',
                      t.code
                    ),
                    (s = e),
                    n(t))
                  : (i(
                      'in eachSeries() iteration callback testPort() callback',
                      'with a success for port',
                      r
                    ),
                    c.push(r),
                    n())
              })
            )
          },
          function (r) {
            if (r) {
              if (
                (i('in eachSeries() result callback: err is', r),
                'EADDRNOTAVAIL' === r.code || 'EINVAL' === r.code)
              ) {
                if (t.host === s) {
                  var o =
                    'Provided host ' +
                    t.host +
                    ' could NOT be bound. Please provide a different host address or hostname'
                  return n(Error(o))
                }
                var u = e._defaultHosts.indexOf(s)
                return e._defaultHosts.splice(u, 1), e.getPort(t, n)
              }
              return n(r)
            }
            if (
              (c.sort(function (t, e) {
                return t - e
              }),
              i('in eachSeries() result callback: openPorts is', c),
              c[0] === c[c.length - 1])
            ) {
              if (c[0] <= t.stopPort) return n(null, c[0])
              o = 'No open ports found in between ' + t.startPort + ' and ' + t.stopPort
              return n(Error(o))
            }
            return e.getPort(
              {
                port: c.pop(),
                host: t.host,
                startPort: t.startPort,
                stopPort: t.stopPort
              },
              n
            )
          }
        )
      }),
      (e.getPortPromise = function (t) {
        if ('function' != typeof Promise)
          throw Error(
            'Native promise support is not available in this version of node.Please install a polyfill and assign Promise to global.Promise before calling this method'
          )
        return (
          t || (t = {}),
          new Promise(function (n, r) {
            e.getPort(t, function (t, e) {
              if (t) return r(t)
              n(e)
            })
          })
        )
      }),
      (e.getPorts = function (t, n, r) {
        r || ((r = n), (n = {}))
        var i = null
        Ot.timesSeries(
          t,
          function (t, r) {
            i && (n.port = e.nextPort(i)),
              e.getPort(n, function (t, e) {
                t ? r(t) : ((i = e), r(null, e))
              })
          },
          r
        )
      }),
      (e.getSocket = function (t, r) {
        function i() {
          m.default.stat(t.path, function (n) {
            n
              ? 'ENOENT' == n.code
                ? r(null, t.path)
                : r(n)
              : ((t.path = e.nextSocket(t.path)), e.getSocket(t, r))
          })
        }
        return (
          r || ((r = t), (t = {})),
          (t.mod = t.mod || parseInt(755, 8)),
          (t.path = t.path || e.basePath + '.sock'),
          t.exists
            ? i()
            : (function () {
                var e = D.default.dirname(t.path)
                m.default.stat(e, function (o, u) {
                  if (o || !u.isDirectory())
                    return (function (e) {
                      n(e, t.mod, function (e) {
                        if (e) return r(e)
                        ;(t.exists = !0), i()
                      })
                    })(e)
                  ;(t.exists = !0), i()
                })
              })()
        )
      }),
      (e.nextPort = function (t) {
        return t + 1
      }),
      (e.nextSocket = function (t) {
        var e = D.default.dirname(t),
          n = D.default.basename(t, '.sock').match(/^([a-zA-z]+)(\d*)$/i),
          r = parseInt(n[2]),
          i = n[1]
        return isNaN(r) && (r = 0), (r += 1), D.default.join(e, i + r + '.sock')
      }),
      (e._defaultHosts = (function () {
        var t = {}
        try {
          t = _.default.networkInterfaces()
        } catch (t) {
          if ('uv_interface_addresses' !== t.syscall) throw t
        }
        for (var e = Object.keys(t), n = ['0.0.0.0'], r = 0; r < e.length; r++)
          for (var i = t[e[r]], u = 0; u < i.length; u++) {
            var s = i[u]
            n.push(s.address)
          }
        return n.push(null), o('exports._defaultHosts is: %o', n), n
      })())
  }),
  Jt = (t) =>
    'string' == typeof t
      ? t.replace(
          (({ onlyFirst: t = !1 } = {}) => {
            const e = [
              '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
              '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
            ].join('|')
            return new RegExp(e, t ? void 0 : 'g')
          })(),
          ''
        )
      : t
function Zt(t) {
  var e = /\.[^.]*$/.exec(t)
  return e ? e.index + 1 : t.length
}
function Qt(t, e, n) {
  if (t.reduce) return t.reduce(e, n)
  for (var r = 0, i = arguments.length >= 3 ? n : t[r++]; r < t.length; r++) e(i, t[r], r)
  return i
}
function te(t, e) {
  if (t.forEach) return t.forEach(e)
  for (var n = 0; n < t.length; n++) e.call(t, t[n], n)
}
function ee(t, e) {
  if (t.map) return t.map(e)
  for (var n = [], r = 0; r < t.length; r++) n.push(e.call(t, t[r], r))
  return n
}
var ne = function (t) {
  return (
    (function (t) {
      return !!t && 'object' == typeof t
    })(t) &&
    !(function (t) {
      var e = Object.prototype.toString.call(t)
      return (
        '[object RegExp]' === e ||
        '[object Date]' === e ||
        (function (t) {
          return t.$$typeof === re
        })(t)
      )
    })(t)
  )
}
var re = 'function' == typeof Symbol && Symbol.for ? Symbol.for('react.element') : 60103
function ie(t, e) {
  return !1 !== e.clone && e.isMergeableObject(t)
    ? ae(((n = t), Array.isArray(n) ? [] : {}), t, e)
    : t
  var n
}
function oe(t, e, n) {
  return t.concat(e).map(function (t) {
    return ie(t, n)
  })
}
function ue(t) {
  return Object.keys(t).concat(
    (function (t) {
      return Object.getOwnPropertySymbols
        ? Object.getOwnPropertySymbols(t).filter(function (e) {
            return t.propertyIsEnumerable(e)
          })
        : []
    })(t)
  )
}
function se(t, e) {
  try {
    return e in t
  } catch (t) {
    return !1
  }
}
function ce(t, e, n) {
  var r = {}
  return (
    n.isMergeableObject(t) &&
      ue(t).forEach(function (e) {
        r[e] = ie(t[e], n)
      }),
    ue(e).forEach(function (i) {
      ;(function (t, e) {
        return (
          se(t, e) &&
          !(Object.hasOwnProperty.call(t, e) && Object.propertyIsEnumerable.call(t, e))
        )
      })(t, i) ||
        (se(t, i) && n.isMergeableObject(e[i])
          ? (r[i] = (function (t, e) {
              if (!e.customMerge) return ae
              var n = e.customMerge(t)
              return 'function' == typeof n ? n : ae
            })(i, n)(t[i], e[i], n))
          : (r[i] = ie(e[i], n)))
    }),
    r
  )
}
function ae(t, e, n) {
  ;((n = n || {}).arrayMerge = n.arrayMerge || oe),
    (n.isMergeableObject = n.isMergeableObject || ne),
    (n.cloneUnlessOtherwiseSpecified = ie)
  var r = Array.isArray(e)
  return r === Array.isArray(t) ? (r ? n.arrayMerge(t, e, n) : ce(t, e, n)) : ie(e, n)
}
ae.all = function (t, e) {
  if (!Array.isArray(t)) throw new Error('first argument should be an array')
  return t.reduce(function (t, n) {
    return ae(t, n, e)
  }, {})
}
var fe = ae,
  le = ['write', 'end', 'destroy'],
  he = ['resume', 'pause'],
  pe = ['data', 'close'],
  de = Array.prototype.slice,
  ve = function (t, e) {
    var n = new S.default(),
      r = !1
    return (
      ye(le, i),
      ye(he, o),
      ye(pe, u),
      e.on('end', s),
      t.on('drain', function () {
        n.emit('drain')
      }),
      t.on('error', c),
      e.on('error', c),
      (n.writable = t.writable),
      (n.readable = e.readable),
      n
    )
    function i(e) {
      n[e] = function () {
        return t[e].apply(t, arguments)
      }
    }
    function o(t) {
      n[t] = function () {
        n.emit(t)
        var r = e[t]
        if (r) return r.apply(e, arguments)
        e.emit(t)
      }
    }
    function u(t) {
      e.on(t, function () {
        var e = de.call(arguments)
        e.unshift(t), n.emit.apply(n, e)
      })
    }
    function s() {
      if (!r) {
        r = !0
        var t = de.call(arguments)
        t.unshift('end'), n.emit.apply(n, t)
      }
    }
    function c(t) {
      n.emit('error', t)
    }
  }
function ye(t, e) {
  if (t.forEach) return t.forEach(e)
  for (var n = 0; n < t.length; n++) e(t[n], n)
}
var be = Ft(function (t) {
    const { promisify: e } = w.default,
      n = (t) => ({ level: 9, ...t }),
      r = e(C.default.gzip)
    ;(t.exports = async (t, e) => {
      if (!t) return 0
      return (await r(t, n(e))).length
    }),
      (t.exports.sync = (t, e) => C.default.gzipSync(t, n(e)).length),
      (t.exports.stream = (t) => {
        const e = new S.default.PassThrough(),
          r = new S.default.PassThrough(),
          i = ve(e, r)
        let o = 0
        const u = C.default
          .createGzip(n(t))
          .on('data', (t) => {
            o += t.length
          })
          .on('error', () => {
            i.gzipSize = 0
          })
          .on('end', () => {
            ;(i.gzipSize = o), i.emit('gzip-size', o), r.end()
          })
        return e.pipe(u), e.pipe(r, { end: !1 }), i
      }),
      (t.exports.file = (e, n) =>
        new Promise((r, i) => {
          const o = m.default.createReadStream(e)
          o.on('error', i)
          const u = o.pipe(t.exports.stream(n))
          u.on('error', i), u.on('gzip-size', r)
        })),
      (t.exports.fileSync = (e, n) => t.exports.sync(m.default.readFileSync(e), n))
  }),
  ge = Ft(function (t, e) {
    /**
     * filesize
     *
     * @copyright 2020 Jason Mulligan <jason.mulligan@avoidwork.com>
     * @license BSD-3-Clause
     * @version 6.1.0
     */
    !(function (e) {
      var n = /^(b|B)$/,
        r = {
          iec: {
            bits: ['b', 'Kib', 'Mib', 'Gib', 'Tib', 'Pib', 'Eib', 'Zib', 'Yib'],
            bytes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
          },
          jedec: {
            bits: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
            bytes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          }
        },
        i = {
          iec: ['', 'kibi', 'mebi', 'gibi', 'tebi', 'pebi', 'exbi', 'zebi', 'yobi'],
          jedec: ['', 'kilo', 'mega', 'giga', 'tera', 'peta', 'exa', 'zetta', 'yotta']
        }
      function o(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          o = [],
          u = 0,
          s = void 0,
          c = void 0,
          a = void 0,
          f = void 0,
          l = void 0,
          h = void 0,
          p = void 0,
          d = void 0,
          v = void 0,
          y = void 0,
          b = void 0,
          g = void 0,
          m = void 0,
          D = void 0,
          w = void 0,
          _ = void 0,
          E = void 0
        if (isNaN(t)) throw new TypeError('Invalid number')
        return (
          (a = !0 === e.bits),
          (m = !0 === e.unix),
          (c = e.base || 2),
          (g = void 0 !== e.round ? e.round : m ? 1 : 2),
          (p = void 0 !== e.locale ? e.locale : ''),
          (d = e.localeOptions || {}),
          (D = void 0 !== e.separator ? e.separator : ''),
          (w = void 0 !== e.spacer ? e.spacer : m ? '' : ' '),
          (E = e.symbols || {}),
          (_ = (2 === c && e.standard) || 'jedec'),
          (b = e.output || 'string'),
          (l = !0 === e.fullform),
          (h = e.fullforms instanceof Array ? e.fullforms : []),
          (s = void 0 !== e.exponent ? e.exponent : -1),
          (f = c > 2 ? 1e3 : 1024),
          (v = (y = Number(t)) < 0) && (y = -y),
          (-1 === s || isNaN(s)) &&
            (s = Math.floor(Math.log(y) / Math.log(f))) < 0 &&
            (s = 0),
          s > 8 && (s = 8),
          'exponent' === b
            ? s
            : (0 === y
                ? ((o[0] = 0), (o[1] = m ? '' : r[_][a ? 'bits' : 'bytes'][s]))
                : ((u = y / (2 === c ? Math.pow(2, 10 * s) : Math.pow(1e3, s))),
                  a && (u *= 8) >= f && s < 8 && ((u /= f), s++),
                  (o[0] = Number(u.toFixed(s > 0 ? g : 0))),
                  o[0] === f && s < 8 && void 0 === e.exponent && ((o[0] = 1), s++),
                  (o[1] =
                    10 === c && 1 === s
                      ? a
                        ? 'kb'
                        : 'kB'
                      : r[_][a ? 'bits' : 'bytes'][s]),
                  m &&
                    ((o[1] =
                      'jedec' === _
                        ? o[1].charAt(0)
                        : s > 0
                        ? o[1].replace(/B$/, '')
                        : o[1]),
                    n.test(o[1]) && ((o[0] = Math.floor(o[0])), (o[1] = '')))),
              v && (o[0] = -o[0]),
              (o[1] = E[o[1]] || o[1]),
              !0 === p
                ? (o[0] = o[0].toLocaleString())
                : p.length > 0
                ? (o[0] = o[0].toLocaleString(p, d))
                : D.length > 0 && (o[0] = o[0].toString().replace('.', D)),
              'array' === b
                ? o
                : (l &&
                    (o[1] = h[s]
                      ? h[s]
                      : i[_][s] + (a ? 'bit' : 'byte') + (1 === o[0] ? '' : 's')),
                  'object' === b
                    ? { value: o[0], symbol: o[1], exponent: s }
                    : o.join(w)))
        )
      }
      ;(o.partial = function (t) {
        return function (e) {
          return o(e, t)
        }
      }),
        (t.exports = o)
    })()
  }),
  me = Object.prototype.toString,
  De =
    Array.isArray ||
    function (t) {
      return '[object Array]' === me.call(t)
    }
function we(t) {
  return 'function' == typeof t
}
function _e(t) {
  return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
}
function Ee(t, e) {
  return null != t && 'object' == typeof t && e in t
}
var xe = RegExp.prototype.test
var Se = /\S/
function Ce(t) {
  return !(function (t, e) {
    return xe.call(t, e)
  })(Se, t)
}
var Fe = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}
var Oe = /\s*/,
  je = /\s+/,
  Ae = /\s*=/,
  ke = /\s*\}/,
  Ie = /#|\^|\/|>|\{|&|=|!/
function Te(t) {
  ;(this.string = t), (this.tail = t), (this.pos = 0)
}
function Ne(t, e) {
  ;(this.view = t), (this.cache = { '.': this.view }), (this.parent = e)
}
function Be() {
  this.templateCache = {
    _cache: {},
    set: function (t, e) {
      this._cache[t] = e
    },
    get: function (t) {
      return this._cache[t]
    },
    clear: function () {
      this._cache = {}
    }
  }
}
;(Te.prototype.eos = function () {
  return '' === this.tail
}),
  (Te.prototype.scan = function (t) {
    var e = this.tail.match(t)
    if (!e || 0 !== e.index) return ''
    var n = e[0]
    return (this.tail = this.tail.substring(n.length)), (this.pos += n.length), n
  }),
  (Te.prototype.scanUntil = function (t) {
    var e,
      n = this.tail.search(t)
    switch (n) {
      case -1:
        ;(e = this.tail), (this.tail = '')
        break
      case 0:
        e = ''
        break
      default:
        ;(e = this.tail.substring(0, n)), (this.tail = this.tail.substring(n))
    }
    return (this.pos += e.length), e
  }),
  (Ne.prototype.push = function (t) {
    return new Ne(t, this)
  }),
  (Ne.prototype.lookup = function (t) {
    var e,
      n,
      r,
      i = this.cache
    if (i.hasOwnProperty(t)) e = i[t]
    else {
      for (var o, u, s, c = this, a = !1; c; ) {
        if (t.indexOf('.') > 0)
          for (o = c.view, u = t.split('.'), s = 0; null != o && s < u.length; )
            s === u.length - 1 &&
              (a =
                Ee(o, u[s]) ||
                ((n = o),
                (r = u[s]),
                null != n &&
                  'object' != typeof n &&
                  n.hasOwnProperty &&
                  n.hasOwnProperty(r))),
              (o = o[u[s++]])
        else (o = c.view[t]), (a = Ee(c.view, t))
        if (a) {
          e = o
          break
        }
        c = c.parent
      }
      i[t] = e
    }
    return we(e) && (e = e.call(this.view)), e
  }),
  (Be.prototype.clearCache = function () {
    void 0 !== this.templateCache && this.templateCache.clear()
  }),
  (Be.prototype.parse = function (t, e) {
    var n = this.templateCache,
      r = t + ':' + (e || Pe.tags).join(':'),
      i = void 0 !== n,
      o = i ? n.get(r) : void 0
    return (
      null == o &&
        ((o = (function (t, e) {
          if (!t) return []
          var n,
            r,
            i,
            o = !1,
            u = [],
            s = [],
            c = [],
            a = !1,
            f = !1,
            l = '',
            h = 0
          function p() {
            if (a && !f) for (; c.length; ) delete s[c.pop()]
            else c = []
            ;(a = !1), (f = !1)
          }
          function d(t) {
            if (('string' == typeof t && (t = t.split(je, 2)), !De(t) || 2 !== t.length))
              throw new Error('Invalid tags: ' + t)
            ;(n = new RegExp(_e(t[0]) + '\\s*')),
              (r = new RegExp('\\s*' + _e(t[1]))),
              (i = new RegExp('\\s*' + _e('}' + t[1])))
          }
          d(e || Pe.tags)
          for (var v, y, b, g, m, D, w = new Te(t); !w.eos(); ) {
            if (((v = w.pos), (b = w.scanUntil(n))))
              for (var _ = 0, E = b.length; _ < E; ++_)
                Ce((g = b.charAt(_)))
                  ? (c.push(s.length), (l += g))
                  : ((f = !0), (o = !0), (l += ' ')),
                  s.push(['text', g, v, v + 1]),
                  (v += 1),
                  '\n' === g && (p(), (l = ''), (h = 0), (o = !1))
            if (!w.scan(n)) break
            if (
              ((a = !0),
              (y = w.scan(Ie) || 'name'),
              w.scan(Oe),
              '=' === y
                ? ((b = w.scanUntil(Ae)), w.scan(Ae), w.scanUntil(r))
                : '{' === y
                ? ((b = w.scanUntil(i)), w.scan(ke), w.scanUntil(r), (y = '&'))
                : (b = w.scanUntil(r)),
              !w.scan(r))
            )
              throw new Error('Unclosed tag at ' + w.pos)
            if (
              ((m = '>' == y ? [y, b, v, w.pos, l, h, o] : [y, b, v, w.pos]),
              h++,
              s.push(m),
              '#' === y || '^' === y)
            )
              u.push(m)
            else if ('/' === y) {
              if (!(D = u.pop())) throw new Error('Unopened section "' + b + '" at ' + v)
              if (D[1] !== b) throw new Error('Unclosed section "' + D[1] + '" at ' + v)
            } else 'name' === y || '{' === y || '&' === y ? (f = !0) : '=' === y && d(b)
          }
          if ((p(), (D = u.pop())))
            throw new Error('Unclosed section "' + D[1] + '" at ' + w.pos)
          return (function (t) {
            for (var e, n = [], r = n, i = [], o = 0, u = t.length; o < u; ++o)
              switch ((e = t[o])[0]) {
                case '#':
                case '^':
                  r.push(e), i.push(e), (r = e[4] = [])
                  break
                case '/':
                  ;(i.pop()[5] = e[2]), (r = i.length > 0 ? i[i.length - 1][4] : n)
                  break
                default:
                  r.push(e)
              }
            return n
          })(
            (function (t) {
              for (var e, n, r = [], i = 0, o = t.length; i < o; ++i)
                (e = t[i]) &&
                  ('text' === e[0] && n && 'text' === n[0]
                    ? ((n[1] += e[1]), (n[3] = e[3]))
                    : (r.push(e), (n = e)))
              return r
            })(s)
          )
        })(t, e)),
        i && n.set(r, o)),
      o
    )
  }),
  (Be.prototype.render = function (t, e, n, r) {
    var i = this.getConfigTags(r),
      o = this.parse(t, i),
      u = e instanceof Ne ? e : new Ne(e, void 0)
    return this.renderTokens(o, u, n, t, r)
  }),
  (Be.prototype.renderTokens = function (t, e, n, r, i) {
    for (var o, u, s, c = '', a = 0, f = t.length; a < f; ++a)
      (s = void 0),
        '#' === (u = (o = t[a])[0])
          ? (s = this.renderSection(o, e, n, r, i))
          : '^' === u
          ? (s = this.renderInverted(o, e, n, r, i))
          : '>' === u
          ? (s = this.renderPartial(o, e, n, i))
          : '&' === u
          ? (s = this.unescapedValue(o, e))
          : 'name' === u
          ? (s = this.escapedValue(o, e, i))
          : 'text' === u && (s = this.rawValue(o)),
        void 0 !== s && (c += s)
    return c
  }),
  (Be.prototype.renderSection = function (t, e, n, r, i) {
    var o = this,
      u = '',
      s = e.lookup(t[1])
    if (s) {
      if (De(s))
        for (var c = 0, a = s.length; c < a; ++c)
          u += this.renderTokens(t[4], e.push(s[c]), n, r, i)
      else if ('object' == typeof s || 'string' == typeof s || 'number' == typeof s)
        u += this.renderTokens(t[4], e.push(s), n, r, i)
      else if (we(s)) {
        if ('string' != typeof r)
          throw new Error(
            'Cannot use higher-order sections without the original template'
          )
        null !=
          (s = s.call(e.view, r.slice(t[3], t[5]), function (t) {
            return o.render(t, e, n, i)
          })) && (u += s)
      } else u += this.renderTokens(t[4], e, n, r, i)
      return u
    }
  }),
  (Be.prototype.renderInverted = function (t, e, n, r, i) {
    var o = e.lookup(t[1])
    if (!o || (De(o) && 0 === o.length)) return this.renderTokens(t[4], e, n, r, i)
  }),
  (Be.prototype.indentPartial = function (t, e, n) {
    for (var r = e.replace(/[^ \t]/g, ''), i = t.split('\n'), o = 0; o < i.length; o++)
      i[o].length && (o > 0 || !n) && (i[o] = r + i[o])
    return i.join('\n')
  }),
  (Be.prototype.renderPartial = function (t, e, n, r) {
    if (n) {
      var i = this.getConfigTags(r),
        o = we(n) ? n(t[1]) : n[t[1]]
      if (null != o) {
        var u = t[6],
          s = t[5],
          c = t[4],
          a = o
        0 == s && c && (a = this.indentPartial(o, c, u))
        var f = this.parse(a, i)
        return this.renderTokens(f, e, n, a, r)
      }
    }
  }),
  (Be.prototype.unescapedValue = function (t, e) {
    var n = e.lookup(t[1])
    if (null != n) return n
  }),
  (Be.prototype.escapedValue = function (t, e, n) {
    var r = this.getConfigEscape(n) || Pe.escape,
      i = e.lookup(t[1])
    if (null != i) return 'number' == typeof i && r === Pe.escape ? String(i) : r(i)
  }),
  (Be.prototype.rawValue = function (t) {
    return t[1]
  }),
  (Be.prototype.getConfigTags = function (t) {
    return De(t) ? t : t && 'object' == typeof t ? t.tags : void 0
  }),
  (Be.prototype.getConfigEscape = function (t) {
    return t && 'object' == typeof t && !De(t) ? t.escape : void 0
  })
var Pe = {
    name: 'mustache.js',
    version: '4.2.0',
    tags: ['{{', '}}'],
    clearCache: void 0,
    escape: void 0,
    parse: void 0,
    render: void 0,
    Scanner: void 0,
    Context: void 0,
    Writer: void 0,
    set templateCache(t) {
      Re.templateCache = t
    },
    get templateCache() {
      return Re.templateCache
    }
  },
  Re = new Be()
;(Pe.clearCache = function () {
  return Re.clearCache()
}),
  (Pe.parse = function (t, e) {
    return Re.parse(t, e)
  }),
  (Pe.render = function (t, e, n, r) {
    if ('string' != typeof t)
      throw new TypeError(
        'Invalid template! Template should be a "string" but "' +
          ((De((i = t)) ? 'array' : typeof i) +
            '" was given as the first argument for mustache#render(template, view, partials)')
      )
    var i
    return Re.render(t, e, n, r)
  }),
  (Pe.escape = function (t) {
    return String(t).replace(/[&<>"'`=\/]/g, function (t) {
      return Fe[t]
    })
  }),
  (Pe.Scanner = Te),
  (Pe.Context = Ne),
  (Pe.Writer = Be)
var Le = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
}
const Me = {}
for (const t of Object.keys(Le)) Me[Le[t]] = t
const Ue = {
  rgb: { channels: 3, labels: 'rgb' },
  hsl: { channels: 3, labels: 'hsl' },
  hsv: { channels: 3, labels: 'hsv' },
  hwb: { channels: 3, labels: 'hwb' },
  cmyk: { channels: 4, labels: 'cmyk' },
  xyz: { channels: 3, labels: 'xyz' },
  lab: { channels: 3, labels: 'lab' },
  lch: { channels: 3, labels: 'lch' },
  hex: { channels: 1, labels: ['hex'] },
  keyword: { channels: 1, labels: ['keyword'] },
  ansi16: { channels: 1, labels: ['ansi16'] },
  ansi256: { channels: 1, labels: ['ansi256'] },
  hcg: { channels: 3, labels: ['h', 'c', 'g'] },
  apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
  gray: { channels: 1, labels: ['gray'] }
}
var Ve = Ue
for (const t of Object.keys(Ue)) {
  if (!('channels' in Ue[t])) throw new Error('missing channels property: ' + t)
  if (!('labels' in Ue[t])) throw new Error('missing channel labels property: ' + t)
  if (Ue[t].labels.length !== Ue[t].channels)
    throw new Error('channel and label counts mismatch: ' + t)
  const { channels: e, labels: n } = Ue[t]
  delete Ue[t].channels,
    delete Ue[t].labels,
    Object.defineProperty(Ue[t], 'channels', { value: e }),
    Object.defineProperty(Ue[t], 'labels', { value: n })
}
function $e(t, e) {
  return (t[0] - e[0]) ** 2 + (t[1] - e[1]) ** 2 + (t[2] - e[2]) ** 2
}
function ze(t) {
  const e = (function () {
      const t = {},
        e = Object.keys(Ve)
      for (let n = e.length, r = 0; r < n; r++) t[e[r]] = { distance: -1, parent: null }
      return t
    })(),
    n = [t]
  for (e[t].distance = 0; n.length; ) {
    const t = n.pop(),
      r = Object.keys(Ve[t])
    for (let i = r.length, o = 0; o < i; o++) {
      const i = r[o],
        u = e[i]
      ;-1 === u.distance &&
        ((u.distance = e[t].distance + 1), (u.parent = t), n.unshift(i))
    }
  }
  return e
}
function qe(t, e) {
  return function (n) {
    return e(t(n))
  }
}
function We(t, e) {
  const n = [e[t].parent, t]
  let r = Ve[e[t].parent][t],
    i = e[t].parent
  for (; e[i].parent; )
    n.unshift(e[i].parent), (r = qe(Ve[e[i].parent][i], r)), (i = e[i].parent)
  return (r.conversion = n), r
}
;(Ue.rgb.hsl = function (t) {
  const e = t[0] / 255,
    n = t[1] / 255,
    r = t[2] / 255,
    i = Math.min(e, n, r),
    o = Math.max(e, n, r),
    u = o - i
  let s, c
  o === i
    ? (s = 0)
    : e === o
    ? (s = (n - r) / u)
    : n === o
    ? (s = 2 + (r - e) / u)
    : r === o && (s = 4 + (e - n) / u),
    (s = Math.min(60 * s, 360)),
    s < 0 && (s += 360)
  const a = (i + o) / 2
  return (
    (c = o === i ? 0 : a <= 0.5 ? u / (o + i) : u / (2 - o - i)), [s, 100 * c, 100 * a]
  )
}),
  (Ue.rgb.hsv = function (t) {
    let e, n, r, i, o
    const u = t[0] / 255,
      s = t[1] / 255,
      c = t[2] / 255,
      a = Math.max(u, s, c),
      f = a - Math.min(u, s, c),
      l = function (t) {
        return (a - t) / 6 / f + 0.5
      }
    return (
      0 === f
        ? ((i = 0), (o = 0))
        : ((o = f / a),
          (e = l(u)),
          (n = l(s)),
          (r = l(c)),
          u === a
            ? (i = r - n)
            : s === a
            ? (i = 1 / 3 + e - r)
            : c === a && (i = 2 / 3 + n - e),
          i < 0 ? (i += 1) : i > 1 && (i -= 1)),
      [360 * i, 100 * o, 100 * a]
    )
  }),
  (Ue.rgb.hwb = function (t) {
    const e = t[0],
      n = t[1]
    let r = t[2]
    const i = Ue.rgb.hsl(t)[0],
      o = (1 / 255) * Math.min(e, Math.min(n, r))
    return (r = 1 - (1 / 255) * Math.max(e, Math.max(n, r))), [i, 100 * o, 100 * r]
  }),
  (Ue.rgb.cmyk = function (t) {
    const e = t[0] / 255,
      n = t[1] / 255,
      r = t[2] / 255,
      i = Math.min(1 - e, 1 - n, 1 - r)
    return [
      100 * ((1 - e - i) / (1 - i) || 0),
      100 * ((1 - n - i) / (1 - i) || 0),
      100 * ((1 - r - i) / (1 - i) || 0),
      100 * i
    ]
  }),
  (Ue.rgb.keyword = function (t) {
    const e = Me[t]
    if (e) return e
    let n,
      r = 1 / 0
    for (const e of Object.keys(Le)) {
      const i = $e(t, Le[e])
      i < r && ((r = i), (n = e))
    }
    return n
  }),
  (Ue.keyword.rgb = function (t) {
    return Le[t]
  }),
  (Ue.rgb.xyz = function (t) {
    let e = t[0] / 255,
      n = t[1] / 255,
      r = t[2] / 255
    ;(e = e > 0.04045 ? ((e + 0.055) / 1.055) ** 2.4 : e / 12.92),
      (n = n > 0.04045 ? ((n + 0.055) / 1.055) ** 2.4 : n / 12.92),
      (r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92)
    return [
      100 * (0.4124 * e + 0.3576 * n + 0.1805 * r),
      100 * (0.2126 * e + 0.7152 * n + 0.0722 * r),
      100 * (0.0193 * e + 0.1192 * n + 0.9505 * r)
    ]
  }),
  (Ue.rgb.lab = function (t) {
    const e = Ue.rgb.xyz(t)
    let n = e[0],
      r = e[1],
      i = e[2]
    ;(n /= 95.047),
      (r /= 100),
      (i /= 108.883),
      (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116),
      (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116),
      (i = i > 0.008856 ? i ** (1 / 3) : 7.787 * i + 16 / 116)
    return [116 * r - 16, 500 * (n - r), 200 * (r - i)]
  }),
  (Ue.hsl.rgb = function (t) {
    const e = t[0] / 360,
      n = t[1] / 100,
      r = t[2] / 100
    let i, o, u
    if (0 === n) return (u = 255 * r), [u, u, u]
    i = r < 0.5 ? r * (1 + n) : r + n - r * n
    const s = 2 * r - i,
      c = [0, 0, 0]
    for (let t = 0; t < 3; t++)
      (o = e + (1 / 3) * -(t - 1)),
        o < 0 && o++,
        o > 1 && o--,
        (u =
          6 * o < 1
            ? s + 6 * (i - s) * o
            : 2 * o < 1
            ? i
            : 3 * o < 2
            ? s + (i - s) * (2 / 3 - o) * 6
            : s),
        (c[t] = 255 * u)
    return c
  }),
  (Ue.hsl.hsv = function (t) {
    const e = t[0]
    let n = t[1] / 100,
      r = t[2] / 100,
      i = n
    const o = Math.max(r, 0.01)
    ;(r *= 2), (n *= r <= 1 ? r : 2 - r), (i *= o <= 1 ? o : 2 - o)
    return [
      e,
      100 * (0 === r ? (2 * i) / (o + i) : (2 * n) / (r + n)),
      100 * ((r + n) / 2)
    ]
  }),
  (Ue.hsv.rgb = function (t) {
    const e = t[0] / 60,
      n = t[1] / 100
    let r = t[2] / 100
    const i = Math.floor(e) % 6,
      o = e - Math.floor(e),
      u = 255 * r * (1 - n),
      s = 255 * r * (1 - n * o),
      c = 255 * r * (1 - n * (1 - o))
    switch (((r *= 255), i)) {
      case 0:
        return [r, c, u]
      case 1:
        return [s, r, u]
      case 2:
        return [u, r, c]
      case 3:
        return [u, s, r]
      case 4:
        return [c, u, r]
      case 5:
        return [r, u, s]
    }
  }),
  (Ue.hsv.hsl = function (t) {
    const e = t[0],
      n = t[1] / 100,
      r = t[2] / 100,
      i = Math.max(r, 0.01)
    let o, u
    u = (2 - n) * r
    const s = (2 - n) * i
    return (
      (o = n * i),
      (o /= s <= 1 ? s : 2 - s),
      (o = o || 0),
      (u /= 2),
      [e, 100 * o, 100 * u]
    )
  }),
  (Ue.hwb.rgb = function (t) {
    const e = t[0] / 360
    let n = t[1] / 100,
      r = t[2] / 100
    const i = n + r
    let o
    i > 1 && ((n /= i), (r /= i))
    const u = Math.floor(6 * e),
      s = 1 - r
    ;(o = 6 * e - u), 0 != (1 & u) && (o = 1 - o)
    const c = n + o * (s - n)
    let a, f, l
    switch (u) {
      default:
      case 6:
      case 0:
        ;(a = s), (f = c), (l = n)
        break
      case 1:
        ;(a = c), (f = s), (l = n)
        break
      case 2:
        ;(a = n), (f = s), (l = c)
        break
      case 3:
        ;(a = n), (f = c), (l = s)
        break
      case 4:
        ;(a = c), (f = n), (l = s)
        break
      case 5:
        ;(a = s), (f = n), (l = c)
    }
    return [255 * a, 255 * f, 255 * l]
  }),
  (Ue.cmyk.rgb = function (t) {
    const e = t[0] / 100,
      n = t[1] / 100,
      r = t[2] / 100,
      i = t[3] / 100
    return [
      255 * (1 - Math.min(1, e * (1 - i) + i)),
      255 * (1 - Math.min(1, n * (1 - i) + i)),
      255 * (1 - Math.min(1, r * (1 - i) + i))
    ]
  }),
  (Ue.xyz.rgb = function (t) {
    const e = t[0] / 100,
      n = t[1] / 100,
      r = t[2] / 100
    let i, o, u
    return (
      (i = 3.2406 * e + -1.5372 * n + -0.4986 * r),
      (o = -0.9689 * e + 1.8758 * n + 0.0415 * r),
      (u = 0.0557 * e + -0.204 * n + 1.057 * r),
      (i = i > 0.0031308 ? 1.055 * i ** (1 / 2.4) - 0.055 : 12.92 * i),
      (o = o > 0.0031308 ? 1.055 * o ** (1 / 2.4) - 0.055 : 12.92 * o),
      (u = u > 0.0031308 ? 1.055 * u ** (1 / 2.4) - 0.055 : 12.92 * u),
      (i = Math.min(Math.max(0, i), 1)),
      (o = Math.min(Math.max(0, o), 1)),
      (u = Math.min(Math.max(0, u), 1)),
      [255 * i, 255 * o, 255 * u]
    )
  }),
  (Ue.xyz.lab = function (t) {
    let e = t[0],
      n = t[1],
      r = t[2]
    ;(e /= 95.047),
      (n /= 100),
      (r /= 108.883),
      (e = e > 0.008856 ? e ** (1 / 3) : 7.787 * e + 16 / 116),
      (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116),
      (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116)
    return [116 * n - 16, 500 * (e - n), 200 * (n - r)]
  }),
  (Ue.lab.xyz = function (t) {
    let e, n, r
    ;(n = (t[0] + 16) / 116), (e = t[1] / 500 + n), (r = n - t[2] / 200)
    const i = n ** 3,
      o = e ** 3,
      u = r ** 3
    return (
      (n = i > 0.008856 ? i : (n - 16 / 116) / 7.787),
      (e = o > 0.008856 ? o : (e - 16 / 116) / 7.787),
      (r = u > 0.008856 ? u : (r - 16 / 116) / 7.787),
      (e *= 95.047),
      (n *= 100),
      (r *= 108.883),
      [e, n, r]
    )
  }),
  (Ue.lab.lch = function (t) {
    const e = t[0],
      n = t[1],
      r = t[2]
    let i
    ;(i = (360 * Math.atan2(r, n)) / 2 / Math.PI), i < 0 && (i += 360)
    return [e, Math.sqrt(n * n + r * r), i]
  }),
  (Ue.lch.lab = function (t) {
    const e = t[0],
      n = t[1],
      r = (t[2] / 360) * 2 * Math.PI
    return [e, n * Math.cos(r), n * Math.sin(r)]
  }),
  (Ue.rgb.ansi16 = function (t, e = null) {
    const [n, r, i] = t
    let o = null === e ? Ue.rgb.hsv(t)[2] : e
    if (((o = Math.round(o / 50)), 0 === o)) return 30
    let u =
      30 + ((Math.round(i / 255) << 2) | (Math.round(r / 255) << 1) | Math.round(n / 255))
    return 2 === o && (u += 60), u
  }),
  (Ue.hsv.ansi16 = function (t) {
    return Ue.rgb.ansi16(Ue.hsv.rgb(t), t[2])
  }),
  (Ue.rgb.ansi256 = function (t) {
    const e = t[0],
      n = t[1],
      r = t[2]
    if (e === n && n === r)
      return e < 8 ? 16 : e > 248 ? 231 : Math.round(((e - 8) / 247) * 24) + 232
    return (
      16 +
      36 * Math.round((e / 255) * 5) +
      6 * Math.round((n / 255) * 5) +
      Math.round((r / 255) * 5)
    )
  }),
  (Ue.ansi16.rgb = function (t) {
    let e = t % 10
    if (0 === e || 7 === e) return t > 50 && (e += 3.5), (e = (e / 10.5) * 255), [e, e, e]
    const n = 0.5 * (1 + ~~(t > 50))
    return [(1 & e) * n * 255, ((e >> 1) & 1) * n * 255, ((e >> 2) & 1) * n * 255]
  }),
  (Ue.ansi256.rgb = function (t) {
    if (t >= 232) {
      const e = 10 * (t - 232) + 8
      return [e, e, e]
    }
    let e
    t -= 16
    return [
      (Math.floor(t / 36) / 5) * 255,
      (Math.floor((e = t % 36) / 6) / 5) * 255,
      ((e % 6) / 5) * 255
    ]
  }),
  (Ue.rgb.hex = function (t) {
    const e = (
      ((255 & Math.round(t[0])) << 16) +
      ((255 & Math.round(t[1])) << 8) +
      (255 & Math.round(t[2]))
    )
      .toString(16)
      .toUpperCase()
    return '000000'.substring(e.length) + e
  }),
  (Ue.hex.rgb = function (t) {
    const e = t.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i)
    if (!e) return [0, 0, 0]
    let n = e[0]
    3 === e[0].length &&
      (n = n
        .split('')
        .map((t) => t + t)
        .join(''))
    const r = parseInt(n, 16)
    return [(r >> 16) & 255, (r >> 8) & 255, 255 & r]
  }),
  (Ue.rgb.hcg = function (t) {
    const e = t[0] / 255,
      n = t[1] / 255,
      r = t[2] / 255,
      i = Math.max(Math.max(e, n), r),
      o = Math.min(Math.min(e, n), r),
      u = i - o
    let s, c
    return (
      (s = u < 1 ? o / (1 - u) : 0),
      (c =
        u <= 0
          ? 0
          : i === e
          ? ((n - r) / u) % 6
          : i === n
          ? 2 + (r - e) / u
          : 4 + (e - n) / u),
      (c /= 6),
      (c %= 1),
      [360 * c, 100 * u, 100 * s]
    )
  }),
  (Ue.hsl.hcg = function (t) {
    const e = t[1] / 100,
      n = t[2] / 100,
      r = n < 0.5 ? 2 * e * n : 2 * e * (1 - n)
    let i = 0
    return r < 1 && (i = (n - 0.5 * r) / (1 - r)), [t[0], 100 * r, 100 * i]
  }),
  (Ue.hsv.hcg = function (t) {
    const e = t[1] / 100,
      n = t[2] / 100,
      r = e * n
    let i = 0
    return r < 1 && (i = (n - r) / (1 - r)), [t[0], 100 * r, 100 * i]
  }),
  (Ue.hcg.rgb = function (t) {
    const e = t[0] / 360,
      n = t[1] / 100,
      r = t[2] / 100
    if (0 === n) return [255 * r, 255 * r, 255 * r]
    const i = [0, 0, 0],
      o = (e % 1) * 6,
      u = o % 1,
      s = 1 - u
    let c = 0
    switch (Math.floor(o)) {
      case 0:
        ;(i[0] = 1), (i[1] = u), (i[2] = 0)
        break
      case 1:
        ;(i[0] = s), (i[1] = 1), (i[2] = 0)
        break
      case 2:
        ;(i[0] = 0), (i[1] = 1), (i[2] = u)
        break
      case 3:
        ;(i[0] = 0), (i[1] = s), (i[2] = 1)
        break
      case 4:
        ;(i[0] = u), (i[1] = 0), (i[2] = 1)
        break
      default:
        ;(i[0] = 1), (i[1] = 0), (i[2] = s)
    }
    return (
      (c = (1 - n) * r),
      [255 * (n * i[0] + c), 255 * (n * i[1] + c), 255 * (n * i[2] + c)]
    )
  }),
  (Ue.hcg.hsv = function (t) {
    const e = t[1] / 100,
      n = e + (t[2] / 100) * (1 - e)
    let r = 0
    return n > 0 && (r = e / n), [t[0], 100 * r, 100 * n]
  }),
  (Ue.hcg.hsl = function (t) {
    const e = t[1] / 100,
      n = (t[2] / 100) * (1 - e) + 0.5 * e
    let r = 0
    return (
      n > 0 && n < 0.5 ? (r = e / (2 * n)) : n >= 0.5 && n < 1 && (r = e / (2 * (1 - n))),
      [t[0], 100 * r, 100 * n]
    )
  }),
  (Ue.hcg.hwb = function (t) {
    const e = t[1] / 100,
      n = e + (t[2] / 100) * (1 - e)
    return [t[0], 100 * (n - e), 100 * (1 - n)]
  }),
  (Ue.hwb.hcg = function (t) {
    const e = t[1] / 100,
      n = 1 - t[2] / 100,
      r = n - e
    let i = 0
    return r < 1 && (i = (n - r) / (1 - r)), [t[0], 100 * r, 100 * i]
  }),
  (Ue.apple.rgb = function (t) {
    return [(t[0] / 65535) * 255, (t[1] / 65535) * 255, (t[2] / 65535) * 255]
  }),
  (Ue.rgb.apple = function (t) {
    return [(t[0] / 255) * 65535, (t[1] / 255) * 65535, (t[2] / 255) * 65535]
  }),
  (Ue.gray.rgb = function (t) {
    return [(t[0] / 100) * 255, (t[0] / 100) * 255, (t[0] / 100) * 255]
  }),
  (Ue.gray.hsl = function (t) {
    return [0, 0, t[0]]
  }),
  (Ue.gray.hsv = Ue.gray.hsl),
  (Ue.gray.hwb = function (t) {
    return [0, 100, t[0]]
  }),
  (Ue.gray.cmyk = function (t) {
    return [0, 0, 0, t[0]]
  }),
  (Ue.gray.lab = function (t) {
    return [t[0], 0, 0]
  }),
  (Ue.gray.hex = function (t) {
    const e = 255 & Math.round((t[0] / 100) * 255),
      n = ((e << 16) + (e << 8) + e).toString(16).toUpperCase()
    return '000000'.substring(n.length) + n
  }),
  (Ue.rgb.gray = function (t) {
    return [((t[0] + t[1] + t[2]) / 3 / 255) * 100]
  })
const Ge = {}
Object.keys(Ve).forEach((t) => {
  ;(Ge[t] = {}),
    Object.defineProperty(Ge[t], 'channels', { value: Ve[t].channels }),
    Object.defineProperty(Ge[t], 'labels', { value: Ve[t].labels })
  const e = (function (t) {
    const e = ze(t),
      n = {},
      r = Object.keys(e)
    for (let t = r.length, i = 0; i < t; i++) {
      const t = r[i]
      null !== e[t].parent && (n[t] = We(t, e))
    }
    return n
  })(t)
  Object.keys(e).forEach((n) => {
    const r = e[n]
    ;(Ge[t][n] = (function (t) {
      const e = function (...e) {
        const n = e[0]
        if (null == n) return n
        n.length > 1 && (e = n)
        const r = t(e)
        if ('object' == typeof r)
          for (let t = r.length, e = 0; e < t; e++) r[e] = Math.round(r[e])
        return r
      }
      return 'conversion' in t && (e.conversion = t.conversion), e
    })(r)),
      (Ge[t][n].raw = (function (t) {
        const e = function (...e) {
          const n = e[0]
          return null == n ? n : (n.length > 1 && (e = n), t(e))
        }
        return 'conversion' in t && (e.conversion = t.conversion), e
      })(r))
  })
})
var Ke = Ge,
  Ye = Ft(function (t) {
    const e = (t, e) => (...n) => `[${t(...n) + e}m`,
      n = (t, e) => (...n) => {
        const r = t(...n)
        return `[${38 + e};5;${r}m`
      },
      r = (t, e) => (...n) => {
        const r = t(...n)
        return `[${38 + e};2;${r[0]};${r[1]};${r[2]}m`
      },
      i = (t) => t,
      o = (t, e, n) => [t, e, n],
      u = (t, e, n) => {
        Object.defineProperty(t, e, {
          get: () => {
            const r = n()
            return (
              Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0 }),
              r
            )
          },
          enumerable: !0,
          configurable: !0
        })
      }
    let s
    const c = (t, e, n, r) => {
      void 0 === s && (s = Ke)
      const i = r ? 10 : 0,
        o = {}
      for (const [r, u] of Object.entries(s)) {
        const s = 'ansi16' === r ? 'ansi' : r
        r === e ? (o[s] = t(n, i)) : 'object' == typeof u && (o[s] = t(u[e], i))
      }
      return o
    }
    Object.defineProperty(t, 'exports', {
      enumerable: !0,
      get: function () {
        const t = new Map(),
          s = {
            modifier: {
              reset: [0, 0],
              bold: [1, 22],
              dim: [2, 22],
              italic: [3, 23],
              underline: [4, 24],
              inverse: [7, 27],
              hidden: [8, 28],
              strikethrough: [9, 29]
            },
            color: {
              black: [30, 39],
              red: [31, 39],
              green: [32, 39],
              yellow: [33, 39],
              blue: [34, 39],
              magenta: [35, 39],
              cyan: [36, 39],
              white: [37, 39],
              blackBright: [90, 39],
              redBright: [91, 39],
              greenBright: [92, 39],
              yellowBright: [93, 39],
              blueBright: [94, 39],
              magentaBright: [95, 39],
              cyanBright: [96, 39],
              whiteBright: [97, 39]
            },
            bgColor: {
              bgBlack: [40, 49],
              bgRed: [41, 49],
              bgGreen: [42, 49],
              bgYellow: [43, 49],
              bgBlue: [44, 49],
              bgMagenta: [45, 49],
              bgCyan: [46, 49],
              bgWhite: [47, 49],
              bgBlackBright: [100, 49],
              bgRedBright: [101, 49],
              bgGreenBright: [102, 49],
              bgYellowBright: [103, 49],
              bgBlueBright: [104, 49],
              bgMagentaBright: [105, 49],
              bgCyanBright: [106, 49],
              bgWhiteBright: [107, 49]
            }
          }
        ;(s.color.gray = s.color.blackBright),
          (s.bgColor.bgGray = s.bgColor.bgBlackBright),
          (s.color.grey = s.color.blackBright),
          (s.bgColor.bgGrey = s.bgColor.bgBlackBright)
        for (const [e, n] of Object.entries(s)) {
          for (const [e, r] of Object.entries(n))
            (s[e] = { open: `[${r[0]}m`, close: `[${r[1]}m` }),
              (n[e] = s[e]),
              t.set(r[0], r[1])
          Object.defineProperty(s, e, { value: n, enumerable: !1 })
        }
        return (
          Object.defineProperty(s, 'codes', { value: t, enumerable: !1 }),
          (s.color.close = '[39m'),
          (s.bgColor.close = '[49m'),
          u(s.color, 'ansi', () => c(e, 'ansi16', i, !1)),
          u(s.color, 'ansi256', () => c(n, 'ansi256', i, !1)),
          u(s.color, 'ansi16m', () => c(r, 'rgb', o, !1)),
          u(s.bgColor, 'ansi', () => c(e, 'ansi16', i, !0)),
          u(s.bgColor, 'ansi256', () => c(n, 'ansi256', i, !0)),
          u(s.bgColor, 'ansi16m', () => c(r, 'rgb', o, !0)),
          s
        )
      }
    })
  })
var He = {
  stringReplaceAll: (t, e, n) => {
    let r = t.indexOf(e)
    if (-1 === r) return t
    const i = e.length
    let o = 0,
      u = ''
    do {
      ;(u += t.substr(o, r - o) + e + n), (o = r + i), (r = t.indexOf(e, o))
    } while (-1 !== r)
    return (u += t.substr(o)), u
  },
  stringEncaseCRLFWithFirstIndex: (t, e, n, r) => {
    let i = 0,
      o = ''
    do {
      const u = '\r' === t[r - 1]
      ;(o += t.substr(i, (u ? r - 1 : r) - i) + e + (u ? '\r\n' : '\n') + n),
        (i = r + 1),
        (r = t.indexOf('\n', i))
    } while (-1 !== r)
    return (o += t.substr(i)), o
  }
}
const Xe = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
  Je = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
  Ze = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
  Qe = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
  tn = new Map([
    ['n', '\n'],
    ['r', '\r'],
    ['t', '\t'],
    ['b', '\b'],
    ['f', '\f'],
    ['v', '\v'],
    ['0', '\0'],
    ['\\', '\\'],
    ['e', ''],
    ['a', '']
  ])
function en(t) {
  const e = 'u' === t[0],
    n = '{' === t[1]
  return (e && !n && 5 === t.length) || ('x' === t[0] && 3 === t.length)
    ? String.fromCharCode(parseInt(t.slice(1), 16))
    : e && n
    ? String.fromCodePoint(parseInt(t.slice(2, -1), 16))
    : tn.get(t) || t
}
function nn(t, e) {
  const n = [],
    r = e.trim().split(/\s*,\s*/g)
  let i
  for (const e of r) {
    const r = Number(e)
    if (Number.isNaN(r)) {
      if (!(i = e.match(Ze)))
        throw new Error(`Invalid Chalk template style argument: ${e} (in style '${t}')`)
      n.push(i[2].replace(Qe, (t, e, n) => (e ? en(e) : n)))
    } else n.push(r)
  }
  return n
}
function rn(t) {
  Je.lastIndex = 0
  const e = []
  let n
  for (; null !== (n = Je.exec(t)); ) {
    const t = n[1]
    if (n[2]) {
      const r = nn(t, n[2])
      e.push([t].concat(r))
    } else e.push([t])
  }
  return e
}
function on(t, e) {
  const n = {}
  for (const t of e) for (const e of t.styles) n[e[0]] = t.inverse ? null : e.slice(1)
  let r = t
  for (const [t, e] of Object.entries(n))
    if (Array.isArray(e)) {
      if (!(t in r)) throw new Error(`Unknown Chalk style: ${t}`)
      r = e.length > 0 ? r[t](...e) : r[t]
    }
  return r
}
var un = (t, e) => {
  const n = [],
    r = []
  let i = []
  if (
    (e.replace(Xe, (e, o, u, s, c, a) => {
      if (o) i.push(en(o))
      else if (s) {
        const e = i.join('')
        ;(i = []),
          r.push(0 === n.length ? e : on(t, n)(e)),
          n.push({ inverse: u, styles: rn(s) })
      } else if (c) {
        if (0 === n.length)
          throw new Error('Found extraneous } in Chalk template literal')
        r.push(on(t, n)(i.join(''))), (i = []), n.pop()
      } else i.push(a)
    }),
    r.push(i.join('')),
    n.length > 0)
  ) {
    const t = `Chalk template literal is missing ${n.length} closing bracket${
      1 === n.length ? '' : 's'
    } (\`}\`)`
    throw new Error(t)
  }
  return r.join('')
}
const { stdout: sn, stderr: cn } = qt,
  { stringReplaceAll: an, stringEncaseCRLFWithFirstIndex: fn } = He,
  { isArray: ln } = Array,
  hn = ['ansi', 'ansi', 'ansi256', 'ansi16m'],
  pn = Object.create(null)
class dn {
  constructor(t) {
    return vn(t)
  }
}
const vn = (t) => {
  const e = {}
  return (
    ((t, e = {}) => {
      if (e.level && !(Number.isInteger(e.level) && e.level >= 0 && e.level <= 3))
        throw new Error('The `level` option should be an integer from 0 to 3')
      const n = sn ? sn.level : 0
      t.level = void 0 === e.level ? n : e.level
    })(e, t),
    (e.template = (...t) => En(e.template, ...t)),
    Object.setPrototypeOf(e, yn.prototype),
    Object.setPrototypeOf(e.template, e),
    (e.template.constructor = () => {
      throw new Error(
        '`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.'
      )
    }),
    (e.template.Instance = dn),
    e.template
  )
}
function yn(t) {
  return vn(t)
}
for (const [t, e] of Object.entries(Ye))
  pn[t] = {
    get() {
      const n = Dn(this, mn(e.open, e.close, this._styler), this._isEmpty)
      return Object.defineProperty(this, t, { value: n }), n
    }
  }
pn.visible = {
  get() {
    const t = Dn(this, this._styler, !0)
    return Object.defineProperty(this, 'visible', { value: t }), t
  }
}
const bn = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256']
for (const t of bn)
  pn[t] = {
    get() {
      const { level: e } = this
      return function (...n) {
        const r = mn(Ye.color[hn[e]][t](...n), Ye.color.close, this._styler)
        return Dn(this, r, this._isEmpty)
      }
    }
  }
for (const t of bn) {
  pn['bg' + t[0].toUpperCase() + t.slice(1)] = {
    get() {
      const { level: e } = this
      return function (...n) {
        const r = mn(Ye.bgColor[hn[e]][t](...n), Ye.bgColor.close, this._styler)
        return Dn(this, r, this._isEmpty)
      }
    }
  }
}
const gn = Object.defineProperties(() => {}, {
    ...pn,
    level: {
      enumerable: !0,
      get() {
        return this._generator.level
      },
      set(t) {
        this._generator.level = t
      }
    }
  }),
  mn = (t, e, n) => {
    let r, i
    return (
      void 0 === n ? ((r = t), (i = e)) : ((r = n.openAll + t), (i = e + n.closeAll)),
      { open: t, close: e, openAll: r, closeAll: i, parent: n }
    )
  },
  Dn = (t, e, n) => {
    const r = (...t) =>
      ln(t[0]) && ln(t[0].raw)
        ? wn(r, En(r, ...t))
        : wn(r, 1 === t.length ? '' + t[0] : t.join(' '))
    return (
      Object.setPrototypeOf(r, gn),
      (r._generator = t),
      (r._styler = e),
      (r._isEmpty = n),
      r
    )
  },
  wn = (t, e) => {
    if (t.level <= 0 || !e) return t._isEmpty ? '' : e
    let n = t._styler
    if (void 0 === n) return e
    const { openAll: r, closeAll: i } = n
    if (-1 !== e.indexOf(''))
      for (; void 0 !== n; ) (e = an(e, n.close, n.open)), (n = n.parent)
    const o = e.indexOf('\n')
    return -1 !== o && (e = fn(e, i, r, o)), r + e + i
  }
let _n
const En = (t, ...e) => {
  const [n] = e
  if (!ln(n) || !ln(n.raw)) return e.join(' ')
  const r = e.slice(1),
    i = [n.raw[0]]
  for (let t = 1; t < n.length; t++)
    i.push(String(r[t - 1]).replace(/[{}\\]/g, '\\$&'), String(n.raw[t]))
  return void 0 === _n && (_n = un), _n(t, i.join(''))
}
Object.defineProperties(yn.prototype, pn)
const xn = yn()
;(xn.supportsColor = sn),
  (xn.stderr = yn({ level: cn ? cn.level : 0 })),
  (xn.stderr.supportsColor = cn)
var Sn = xn,
  Cn = /[|\\{}()[\]^$+*?.]/g,
  Fn = function (t) {
    if ('string' != typeof t) throw new TypeError('Expected a string')
    return t.replace(Cn, '\\$&')
  }
const { platform: On } = process,
  jn = {
    tick: '✔',
    cross: '✖',
    star: '★',
    square: '▇',
    squareSmall: '◻',
    squareSmallFilled: '◼',
    play: '▶',
    circle: '◯',
    circleFilled: '◉',
    circleDotted: '◌',
    circleDouble: '◎',
    circleCircle: 'ⓞ',
    circleCross: 'ⓧ',
    circlePipe: 'Ⓘ',
    circleQuestionMark: '?⃝',
    bullet: '●',
    dot: '․',
    line: '─',
    ellipsis: '…',
    pointer: '❯',
    pointerSmall: '›',
    info: 'ℹ',
    warning: '⚠',
    hamburger: '☰',
    smiley: '㋡',
    mustache: '෴',
    heart: '♥',
    nodejs: '⬢',
    arrowUp: '↑',
    arrowDown: '↓',
    arrowLeft: '←',
    arrowRight: '→',
    radioOn: '◉',
    radioOff: '◯',
    checkboxOn: '☒',
    checkboxOff: '☐',
    checkboxCircleOn: 'ⓧ',
    checkboxCircleOff: 'Ⓘ',
    questionMarkPrefix: '?⃝',
    oneHalf: '½',
    oneThird: '⅓',
    oneQuarter: '¼',
    oneFifth: '⅕',
    oneSixth: '⅙',
    oneSeventh: '⅐',
    oneEighth: '⅛',
    oneNinth: '⅑',
    oneTenth: '⅒',
    twoThirds: '⅔',
    twoFifths: '⅖',
    threeQuarters: '¾',
    threeFifths: '⅗',
    threeEighths: '⅜',
    fourFifths: '⅘',
    fiveSixths: '⅚',
    fiveEighths: '⅝',
    sevenEighths: '⅞'
  },
  An = {
    tick: '√',
    cross: '×',
    star: '*',
    square: '█',
    squareSmall: '[ ]',
    squareSmallFilled: '[█]',
    play: '►',
    circle: '( )',
    circleFilled: '(*)',
    circleDotted: '( )',
    circleDouble: '( )',
    circleCircle: '(○)',
    circleCross: '(×)',
    circlePipe: '(│)',
    circleQuestionMark: '(?)',
    bullet: '*',
    dot: '.',
    line: '─',
    ellipsis: '...',
    pointer: '>',
    pointerSmall: '»',
    info: 'i',
    warning: '‼',
    hamburger: '≡',
    smiley: '☺',
    mustache: '┌─┐',
    heart: jn.heart,
    nodejs: '♦',
    arrowUp: jn.arrowUp,
    arrowDown: jn.arrowDown,
    arrowLeft: jn.arrowLeft,
    arrowRight: jn.arrowRight,
    radioOn: '(*)',
    radioOff: '( )',
    checkboxOn: '[×]',
    checkboxOff: '[ ]',
    checkboxCircleOn: '(×)',
    checkboxCircleOff: '( )',
    questionMarkPrefix: '？',
    oneHalf: '1/2',
    oneThird: '1/3',
    oneQuarter: '1/4',
    oneFifth: '1/5',
    oneSixth: '1/6',
    oneSeventh: '1/7',
    oneEighth: '1/8',
    oneNinth: '1/9',
    oneTenth: '1/10',
    twoThirds: '2/3',
    twoFifths: '2/5',
    threeQuarters: '3/4',
    threeFifths: '3/5',
    threeEighths: '3/8',
    fourFifths: '4/5',
    fiveSixths: '5/6',
    fiveEighths: '5/8',
    sevenEighths: '7/8'
  }
'linux' === On && (jn.questionMarkPrefix = '?')
const kn = 'win32' === On ? An : jn
var In = Object.assign((t) => {
    if (kn === jn) return t
    for (const [e, n] of Object.entries(jn))
      n !== kn[e] && (t = t.replace(new RegExp(Fn(n), 'g'), kn[e]))
    return t
  }, kn),
  Tn = jn,
  Nn = An
;(In.main = Tn), (In.windows = Nn)
class Bn {
  constructor(t) {
    ;(this.type = 'separator'), (this.line = Sn.dim(t || new Array(15).join(In.line)))
  }
  toString() {
    return this.line
  }
}
Bn.exclude = function (t) {
  return 'separator' !== t.type
}
var Pn = Bn,
  Rn = Ft(function (t, e) {
    function n(t, e, n) {
      ;(t =
        t ||
        function (t) {
          this.queue(t)
        }),
        (e =
          e ||
          function () {
            this.queue(null)
          })
      var r = !1,
        i = !1,
        o = [],
        u = !1,
        s = new S.default()
      function c() {
        for (; o.length && !s.paused; ) {
          var t = o.shift()
          if (null === t) return s.emit('end')
          s.emit('data', t)
        }
      }
      function a() {
        ;(s.writable = !1), e.call(s), !s.readable && s.autoDestroy && s.destroy()
      }
      return (
        (s.readable = s.writable = !0),
        (s.paused = !1),
        (s.autoDestroy = !(n && !1 === n.autoDestroy)),
        (s.write = function (e) {
          return t.call(this, e), !s.paused
        }),
        (s.queue = s.push = function (t) {
          return u || (null === t && (u = !0), o.push(t), c()), s
        }),
        s.on('end', function () {
          ;(s.readable = !1),
            !s.writable &&
              s.autoDestroy &&
              process.nextTick(function () {
                s.destroy()
              })
        }),
        (s.end = function (t) {
          if (!r) return (r = !0), arguments.length && s.write(t), a(), s
        }),
        (s.destroy = function () {
          if (!i)
            return (
              (i = !0),
              (r = !0),
              (o.length = 0),
              (s.writable = s.readable = !1),
              s.emit('close'),
              s
            )
        }),
        (s.pause = function () {
          if (!s.paused) return (s.paused = !0), s
        }),
        (s.resume = function () {
          return (
            s.paused && ((s.paused = !1), s.emit('resume')),
            c(),
            s.paused || s.emit('drain'),
            s
          )
        }),
        s
      )
    }
    ;(t.exports = n), (n.through = n)
  }),
  Ln = 'object' == typeof St && St && St.Object === Object && St,
  Mn = 'object' == typeof self && self && self.Object === Object && self,
  Un = Ln || Mn || Function('return this')(),
  Vn = Un.Symbol,
  $n = Object.prototype,
  zn = $n.hasOwnProperty,
  qn = $n.toString,
  Wn = Vn ? Vn.toStringTag : void 0
var Gn = function (t) {
    var e = zn.call(t, Wn),
      n = t[Wn]
    try {
      t[Wn] = void 0
      var r = !0
    } catch (t) {}
    var i = qn.call(t)
    return r && (e ? (t[Wn] = n) : delete t[Wn]), i
  },
  Kn = Object.prototype.toString
var Yn = function (t) {
    return Kn.call(t)
  },
  Hn = Vn ? Vn.toStringTag : void 0
var Xn = function (t) {
  return null == t
    ? void 0 === t
      ? '[object Undefined]'
      : '[object Null]'
    : Hn && Hn in Object(t)
    ? Gn(t)
    : Yn(t)
}
var Jn = function (t) {
  var e = typeof t
  return null != t && ('object' == e || 'function' == e)
}
var Zn,
  Qn = function (t) {
    if (!Jn(t)) return !1
    var e = Xn(t)
    return (
      '[object Function]' == e ||
      '[object GeneratorFunction]' == e ||
      '[object AsyncFunction]' == e ||
      '[object Proxy]' == e
    )
  },
  tr = Un['__core-js_shared__'],
  er = (Zn = /[^.]+$/.exec((tr && tr.keys && tr.keys.IE_PROTO) || ''))
    ? 'Symbol(src)_1.' + Zn
    : ''
var nr = function (t) {
    return !!er && er in t
  },
  rr = Function.prototype.toString
var ir = function (t) {
    if (null != t) {
      try {
        return rr.call(t)
      } catch (t) {}
      try {
        return t + ''
      } catch (t) {}
    }
    return ''
  },
  or = /^\[object .+?Constructor\]$/,
  ur = Function.prototype,
  sr = Object.prototype,
  cr = ur.toString,
  ar = sr.hasOwnProperty,
  fr = RegExp(
    '^' +
      cr
        .call(ar)
        .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
      '$'
  )
var lr = function (t) {
  return !(!Jn(t) || nr(t)) && (Qn(t) ? fr : or).test(ir(t))
}
var hr = function (t, e) {
  return null == t ? void 0 : t[e]
}
var pr = function (t, e) {
    var n = hr(t, e)
    return lr(n) ? n : void 0
  },
  dr = (function () {
    try {
      var t = pr(Object, 'defineProperty')
      return t({}, '', {}), t
    } catch (t) {}
  })()
var vr = function (t, e, n) {
  '__proto__' == e && dr
    ? dr(t, e, { configurable: !0, enumerable: !0, value: n, writable: !0 })
    : (t[e] = n)
}
var yr = function (t, e) {
    return t === e || (t != t && e != e)
  },
  br = Object.prototype.hasOwnProperty
var gr = function (t, e, n) {
  var r = t[e]
  ;(br.call(t, e) && yr(r, n) && (void 0 !== n || e in t)) || vr(t, e, n)
}
var mr = function (t, e, n, r) {
  var i = !n
  n || (n = {})
  for (var o = -1, u = e.length; ++o < u; ) {
    var s = e[o],
      c = r ? r(n[s], t[s], s, n, t) : void 0
    void 0 === c && (c = t[s]), i ? vr(n, s, c) : gr(n, s, c)
  }
  return n
}
var Dr = function (t) {
  return t
}
var wr = function (t, e, n) {
    switch (n.length) {
      case 0:
        return t.call(e)
      case 1:
        return t.call(e, n[0])
      case 2:
        return t.call(e, n[0], n[1])
      case 3:
        return t.call(e, n[0], n[1], n[2])
    }
    return t.apply(e, n)
  },
  _r = Math.max
var Er = function (t, e, n) {
  return (
    (e = _r(void 0 === e ? t.length - 1 : e, 0)),
    function () {
      for (var r = arguments, i = -1, o = _r(r.length - e, 0), u = Array(o); ++i < o; )
        u[i] = r[e + i]
      i = -1
      for (var s = Array(e + 1); ++i < e; ) s[i] = r[i]
      return (s[e] = n(u)), wr(t, this, s)
    }
  )
}
var xr = function (t) {
    return function () {
      return t
    }
  },
  Sr = dr
    ? function (t, e) {
        return dr(t, 'toString', {
          configurable: !0,
          enumerable: !1,
          value: xr(e),
          writable: !0
        })
      }
    : Dr,
  Cr = Date.now
var Fr = (function (t) {
  var e = 0,
    n = 0
  return function () {
    var r = Cr(),
      i = 16 - (r - n)
    if (((n = r), i > 0)) {
      if (++e >= 800) return arguments[0]
    } else e = 0
    return t.apply(void 0, arguments)
  }
})(Sr)
var Or = function (t, e) {
  return Fr(Er(t, e, Dr), t + '')
}
var jr = function (t) {
  return 'number' == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991
}
var Ar = function (t) {
    return null != t && jr(t.length) && !Qn(t)
  },
  kr = /^(?:0|[1-9]\d*)$/
var Ir = function (t, e) {
  var n = typeof t
  return (
    !!(e = null == e ? 9007199254740991 : e) &&
    ('number' == n || ('symbol' != n && kr.test(t))) &&
    t > -1 &&
    t % 1 == 0 &&
    t < e
  )
}
var Tr = function (t, e, n) {
  if (!Jn(n)) return !1
  var r = typeof e
  return (
    !!('number' == r ? Ar(n) && Ir(e, n.length) : 'string' == r && e in n) && yr(n[e], t)
  )
}
var Nr = function (t) {
  return Or(function (e, n) {
    var r = -1,
      i = n.length,
      o = i > 1 ? n[i - 1] : void 0,
      u = i > 2 ? n[2] : void 0
    for (
      o = t.length > 3 && 'function' == typeof o ? (i--, o) : void 0,
        u && Tr(n[0], n[1], u) && ((o = i < 3 ? void 0 : o), (i = 1)),
        e = Object(e);
      ++r < i;

    ) {
      var s = n[r]
      s && t(e, s, r, o)
    }
    return e
  })
}
var Br = function (t, e) {
  for (var n = -1, r = Array(t); ++n < t; ) r[n] = e(n)
  return r
}
var Pr = function (t) {
  return null != t && 'object' == typeof t
}
var Rr = function (t) {
    return Pr(t) && '[object Arguments]' == Xn(t)
  },
  Lr = Object.prototype,
  Mr = Lr.hasOwnProperty,
  Ur = Lr.propertyIsEnumerable,
  Vr = Rr(
    (function () {
      return arguments
    })()
  )
    ? Rr
    : function (t) {
        return Pr(t) && Mr.call(t, 'callee') && !Ur.call(t, 'callee')
      },
  $r = Array.isArray
var zr = function () {
    return !1
  },
  qr = Ft(function (t, e) {
    var n = e && !e.nodeType && e,
      r = n && t && !t.nodeType && t,
      i = r && r.exports === n ? Un.Buffer : void 0,
      o = (i ? i.isBuffer : void 0) || zr
    t.exports = o
  }),
  Wr = {}
;(Wr['[object Float32Array]'] = Wr['[object Float64Array]'] = Wr[
  '[object Int8Array]'
] = Wr['[object Int16Array]'] = Wr['[object Int32Array]'] = Wr[
  '[object Uint8Array]'
] = Wr['[object Uint8ClampedArray]'] = Wr['[object Uint16Array]'] = Wr[
  '[object Uint32Array]'
] = !0),
  (Wr['[object Arguments]'] = Wr['[object Array]'] = Wr['[object ArrayBuffer]'] = Wr[
    '[object Boolean]'
  ] = Wr['[object DataView]'] = Wr['[object Date]'] = Wr['[object Error]'] = Wr[
    '[object Function]'
  ] = Wr['[object Map]'] = Wr['[object Number]'] = Wr['[object Object]'] = Wr[
    '[object RegExp]'
  ] = Wr['[object Set]'] = Wr['[object String]'] = Wr['[object WeakMap]'] = !1)
var Gr = function (t) {
  return Pr(t) && jr(t.length) && !!Wr[Xn(t)]
}
var Kr = function (t) {
    return function (e) {
      return t(e)
    }
  },
  Yr = Ft(function (t, e) {
    var n = e && !e.nodeType && e,
      r = n && t && !t.nodeType && t,
      i = r && r.exports === n && Ln.process,
      o = (function () {
        try {
          var t = r && r.require && r.require('util').types
          return t || (i && i.binding && i.binding('util'))
        } catch (t) {}
      })()
    t.exports = o
  }),
  Hr = Yr && Yr.isTypedArray,
  Xr = Hr ? Kr(Hr) : Gr,
  Jr = Object.prototype.hasOwnProperty
var Zr = function (t, e) {
    var n = $r(t),
      r = !n && Vr(t),
      i = !n && !r && qr(t),
      o = !n && !r && !i && Xr(t),
      u = n || r || i || o,
      s = u ? Br(t.length, String) : [],
      c = s.length
    for (var a in t)
      (!e && !Jr.call(t, a)) ||
        (u &&
          ('length' == a ||
            (i && ('offset' == a || 'parent' == a)) ||
            (o && ('buffer' == a || 'byteLength' == a || 'byteOffset' == a)) ||
            Ir(a, c))) ||
        s.push(a)
    return s
  },
  Qr = Object.prototype
var ti = function (t) {
  var e = t && t.constructor
  return t === (('function' == typeof e && e.prototype) || Qr)
}
var ei = function (t) {
    var e = []
    if (null != t) for (var n in Object(t)) e.push(n)
    return e
  },
  ni = Object.prototype.hasOwnProperty
var ri = function (t) {
  if (!Jn(t)) return ei(t)
  var e = ti(t),
    n = []
  for (var r in t) ('constructor' != r || (!e && ni.call(t, r))) && n.push(r)
  return n
}
var ii = function (t) {
    return Ar(t) ? Zr(t, !0) : ri(t)
  },
  oi = Nr(function (t, e) {
    mr(e, ii(e), t)
  })
var ui = function (t, e) {
  for (var n = -1, r = null == t ? 0 : t.length, i = Array(r); ++n < r; )
    i[n] = e(t[n], n, t)
  return i
}
var si = function () {
  ;(this.__data__ = []), (this.size = 0)
}
var ci = function (t, e) {
    for (var n = t.length; n--; ) if (yr(t[n][0], e)) return n
    return -1
  },
  ai = Array.prototype.splice
var fi = function (t) {
  var e = this.__data__,
    n = ci(e, t)
  return !(n < 0) && (n == e.length - 1 ? e.pop() : ai.call(e, n, 1), --this.size, !0)
}
var li = function (t) {
  var e = this.__data__,
    n = ci(e, t)
  return n < 0 ? void 0 : e[n][1]
}
var hi = function (t) {
  return ci(this.__data__, t) > -1
}
var pi = function (t, e) {
  var n = this.__data__,
    r = ci(n, t)
  return r < 0 ? (++this.size, n.push([t, e])) : (n[r][1] = e), this
}
function di(t) {
  var e = -1,
    n = null == t ? 0 : t.length
  for (this.clear(); ++e < n; ) {
    var r = t[e]
    this.set(r[0], r[1])
  }
}
;(di.prototype.clear = si),
  (di.prototype.delete = fi),
  (di.prototype.get = li),
  (di.prototype.has = hi),
  (di.prototype.set = pi)
var vi = di
var yi = function () {
  ;(this.__data__ = new vi()), (this.size = 0)
}
var bi = function (t) {
  var e = this.__data__,
    n = e.delete(t)
  return (this.size = e.size), n
}
var gi = function (t) {
  return this.__data__.get(t)
}
var mi = function (t) {
    return this.__data__.has(t)
  },
  Di = pr(Un, 'Map'),
  wi = pr(Object, 'create')
var _i = function () {
  ;(this.__data__ = wi ? wi(null) : {}), (this.size = 0)
}
var Ei = function (t) {
    var e = this.has(t) && delete this.__data__[t]
    return (this.size -= e ? 1 : 0), e
  },
  xi = Object.prototype.hasOwnProperty
var Si = function (t) {
    var e = this.__data__
    if (wi) {
      var n = e[t]
      return '__lodash_hash_undefined__' === n ? void 0 : n
    }
    return xi.call(e, t) ? e[t] : void 0
  },
  Ci = Object.prototype.hasOwnProperty
var Fi = function (t) {
  var e = this.__data__
  return wi ? void 0 !== e[t] : Ci.call(e, t)
}
var Oi = function (t, e) {
  var n = this.__data__
  return (
    (this.size += this.has(t) ? 0 : 1),
    (n[t] = wi && void 0 === e ? '__lodash_hash_undefined__' : e),
    this
  )
}
function ji(t) {
  var e = -1,
    n = null == t ? 0 : t.length
  for (this.clear(); ++e < n; ) {
    var r = t[e]
    this.set(r[0], r[1])
  }
}
;(ji.prototype.clear = _i),
  (ji.prototype.delete = Ei),
  (ji.prototype.get = Si),
  (ji.prototype.has = Fi),
  (ji.prototype.set = Oi)
var Ai = ji
var ki = function () {
  ;(this.size = 0),
    (this.__data__ = { hash: new Ai(), map: new (Di || vi)(), string: new Ai() })
}
var Ii = function (t) {
  var e = typeof t
  return 'string' == e || 'number' == e || 'symbol' == e || 'boolean' == e
    ? '__proto__' !== t
    : null === t
}
var Ti = function (t, e) {
  var n = t.__data__
  return Ii(e) ? n['string' == typeof e ? 'string' : 'hash'] : n.map
}
var Ni = function (t) {
  var e = Ti(this, t).delete(t)
  return (this.size -= e ? 1 : 0), e
}
var Bi = function (t) {
  return Ti(this, t).get(t)
}
var Pi = function (t) {
  return Ti(this, t).has(t)
}
var Ri = function (t, e) {
  var n = Ti(this, t),
    r = n.size
  return n.set(t, e), (this.size += n.size == r ? 0 : 1), this
}
function Li(t) {
  var e = -1,
    n = null == t ? 0 : t.length
  for (this.clear(); ++e < n; ) {
    var r = t[e]
    this.set(r[0], r[1])
  }
}
;(Li.prototype.clear = ki),
  (Li.prototype.delete = Ni),
  (Li.prototype.get = Bi),
  (Li.prototype.has = Pi),
  (Li.prototype.set = Ri)
var Mi = Li
var Ui = function (t, e) {
  var n = this.__data__
  if (n instanceof vi) {
    var r = n.__data__
    if (!Di || r.length < 199) return r.push([t, e]), (this.size = ++n.size), this
    n = this.__data__ = new Mi(r)
  }
  return n.set(t, e), (this.size = n.size), this
}
function Vi(t) {
  var e = (this.__data__ = new vi(t))
  this.size = e.size
}
;(Vi.prototype.clear = yi),
  (Vi.prototype.delete = bi),
  (Vi.prototype.get = gi),
  (Vi.prototype.has = mi),
  (Vi.prototype.set = Ui)
var $i = Vi
var zi = function (t, e) {
  for (var n = -1, r = null == t ? 0 : t.length; ++n < r && !1 !== e(t[n], n, t); );
  return t
}
var qi = function (t, e) {
    return function (n) {
      return t(e(n))
    }
  },
  Wi = qi(Object.keys, Object),
  Gi = Object.prototype.hasOwnProperty
var Ki = function (t) {
  if (!ti(t)) return Wi(t)
  var e = []
  for (var n in Object(t)) Gi.call(t, n) && 'constructor' != n && e.push(n)
  return e
}
var Yi = function (t) {
  return Ar(t) ? Zr(t) : Ki(t)
}
var Hi = function (t, e) {
  return t && mr(e, Yi(e), t)
}
var Xi = function (t, e) {
    return t && mr(e, ii(e), t)
  },
  Ji = Ft(function (t, e) {
    var n = e && !e.nodeType && e,
      r = n && t && !t.nodeType && t,
      i = r && r.exports === n ? Un.Buffer : void 0,
      o = i ? i.allocUnsafe : void 0
    t.exports = function (t, e) {
      if (e) return t.slice()
      var n = t.length,
        r = o ? o(n) : new t.constructor(n)
      return t.copy(r), r
    }
  })
var Zi = function (t, e) {
  var n = -1,
    r = t.length
  for (e || (e = Array(r)); ++n < r; ) e[n] = t[n]
  return e
}
var Qi = function (t, e) {
  for (var n = -1, r = null == t ? 0 : t.length, i = 0, o = []; ++n < r; ) {
    var u = t[n]
    e(u, n, t) && (o[i++] = u)
  }
  return o
}
var to = function () {
    return []
  },
  eo = Object.prototype.propertyIsEnumerable,
  no = Object.getOwnPropertySymbols,
  ro = no
    ? function (t) {
        return null == t
          ? []
          : ((t = Object(t)),
            Qi(no(t), function (e) {
              return eo.call(t, e)
            }))
      }
    : to
var io = function (t, e) {
  return mr(t, ro(t), e)
}
var oo = function (t, e) {
    for (var n = -1, r = e.length, i = t.length; ++n < r; ) t[i + n] = e[n]
    return t
  },
  uo = qi(Object.getPrototypeOf, Object),
  so = Object.getOwnPropertySymbols
    ? function (t) {
        for (var e = []; t; ) oo(e, ro(t)), (t = uo(t))
        return e
      }
    : to
var co = function (t, e) {
  return mr(t, so(t), e)
}
var ao = function (t, e, n) {
  var r = e(t)
  return $r(t) ? r : oo(r, n(t))
}
var fo = function (t) {
  return ao(t, Yi, ro)
}
var lo = function (t) {
    return ao(t, ii, so)
  },
  ho = pr(Un, 'DataView'),
  po = pr(Un, 'Promise'),
  vo = pr(Un, 'Set'),
  yo = pr(Un, 'WeakMap'),
  bo = ir(ho),
  go = ir(Di),
  mo = ir(po),
  Do = ir(vo),
  wo = ir(yo),
  _o = Xn
;((ho && '[object DataView]' != _o(new ho(new ArrayBuffer(1)))) ||
  (Di && '[object Map]' != _o(new Di())) ||
  (po && '[object Promise]' != _o(po.resolve())) ||
  (vo && '[object Set]' != _o(new vo())) ||
  (yo && '[object WeakMap]' != _o(new yo()))) &&
  (_o = function (t) {
    var e = Xn(t),
      n = '[object Object]' == e ? t.constructor : void 0,
      r = n ? ir(n) : ''
    if (r)
      switch (r) {
        case bo:
          return '[object DataView]'
        case go:
          return '[object Map]'
        case mo:
          return '[object Promise]'
        case Do:
          return '[object Set]'
        case wo:
          return '[object WeakMap]'
      }
    return e
  })
var Eo = _o,
  xo = Object.prototype.hasOwnProperty
var So = function (t) {
    var e = t.length,
      n = new t.constructor(e)
    return (
      e &&
        'string' == typeof t[0] &&
        xo.call(t, 'index') &&
        ((n.index = t.index), (n.input = t.input)),
      n
    )
  },
  Co = Un.Uint8Array
var Fo = function (t) {
  var e = new t.constructor(t.byteLength)
  return new Co(e).set(new Co(t)), e
}
var Oo = function (t, e) {
    var n = e ? Fo(t.buffer) : t.buffer
    return new t.constructor(n, t.byteOffset, t.byteLength)
  },
  jo = /\w*$/
var Ao = function (t) {
    var e = new t.constructor(t.source, jo.exec(t))
    return (e.lastIndex = t.lastIndex), e
  },
  ko = Vn ? Vn.prototype : void 0,
  Io = ko ? ko.valueOf : void 0
var To = function (t) {
  return Io ? Object(Io.call(t)) : {}
}
var No = function (t, e) {
  var n = e ? Fo(t.buffer) : t.buffer
  return new t.constructor(n, t.byteOffset, t.length)
}
var Bo = function (t, e, n) {
    var r = t.constructor
    switch (e) {
      case '[object ArrayBuffer]':
        return Fo(t)
      case '[object Boolean]':
      case '[object Date]':
        return new r(+t)
      case '[object DataView]':
        return Oo(t, n)
      case '[object Float32Array]':
      case '[object Float64Array]':
      case '[object Int8Array]':
      case '[object Int16Array]':
      case '[object Int32Array]':
      case '[object Uint8Array]':
      case '[object Uint8ClampedArray]':
      case '[object Uint16Array]':
      case '[object Uint32Array]':
        return No(t, n)
      case '[object Map]':
        return new r()
      case '[object Number]':
      case '[object String]':
        return new r(t)
      case '[object RegExp]':
        return Ao(t)
      case '[object Set]':
        return new r()
      case '[object Symbol]':
        return To(t)
    }
  },
  Po = Object.create,
  Ro = (function () {
    function t() {}
    return function (e) {
      if (!Jn(e)) return {}
      if (Po) return Po(e)
      t.prototype = e
      var n = new t()
      return (t.prototype = void 0), n
    }
  })()
var Lo = function (t) {
  return 'function' != typeof t.constructor || ti(t) ? {} : Ro(uo(t))
}
var Mo = function (t) {
    return Pr(t) && '[object Map]' == Eo(t)
  },
  Uo = Yr && Yr.isMap,
  Vo = Uo ? Kr(Uo) : Mo
var $o = function (t) {
    return Pr(t) && '[object Set]' == Eo(t)
  },
  zo = Yr && Yr.isSet,
  qo = zo ? Kr(zo) : $o,
  Wo = {}
;(Wo['[object Arguments]'] = Wo['[object Array]'] = Wo['[object ArrayBuffer]'] = Wo[
  '[object DataView]'
] = Wo['[object Boolean]'] = Wo['[object Date]'] = Wo['[object Float32Array]'] = Wo[
  '[object Float64Array]'
] = Wo['[object Int8Array]'] = Wo['[object Int16Array]'] = Wo['[object Int32Array]'] = Wo[
  '[object Map]'
] = Wo['[object Number]'] = Wo['[object Object]'] = Wo['[object RegExp]'] = Wo[
  '[object Set]'
] = Wo['[object String]'] = Wo['[object Symbol]'] = Wo['[object Uint8Array]'] = Wo[
  '[object Uint8ClampedArray]'
] = Wo['[object Uint16Array]'] = Wo['[object Uint32Array]'] = !0),
  (Wo['[object Error]'] = Wo['[object Function]'] = Wo['[object WeakMap]'] = !1)
var Go = function t(e, n, r, i, o, u) {
  var s,
    c = 1 & n,
    a = 2 & n,
    f = 4 & n
  if ((r && (s = o ? r(e, i, o, u) : r(e)), void 0 !== s)) return s
  if (!Jn(e)) return e
  var l = $r(e)
  if (l) {
    if (((s = So(e)), !c)) return Zi(e, s)
  } else {
    var h = Eo(e),
      p = '[object Function]' == h || '[object GeneratorFunction]' == h
    if (qr(e)) return Ji(e, c)
    if ('[object Object]' == h || '[object Arguments]' == h || (p && !o)) {
      if (((s = a || p ? {} : Lo(e)), !c)) return a ? co(e, Xi(s, e)) : io(e, Hi(s, e))
    } else {
      if (!Wo[h]) return o ? e : {}
      s = Bo(e, h, c)
    }
  }
  u || (u = new $i())
  var d = u.get(e)
  if (d) return d
  u.set(e, s),
    qo(e)
      ? e.forEach(function (i) {
          s.add(t(i, n, r, i, e, u))
        })
      : Vo(e) &&
        e.forEach(function (i, o) {
          s.set(o, t(i, n, r, o, e, u))
        })
  var v = l ? void 0 : (f ? (a ? lo : fo) : a ? ii : Yi)(e)
  return (
    zi(v || e, function (i, o) {
      v && (i = e[(o = i)]), gr(s, o, t(i, n, r, o, e, u))
    }),
    s
  )
}
var Ko = function (t) {
    return 'symbol' == typeof t || (Pr(t) && '[object Symbol]' == Xn(t))
  },
  Yo = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  Ho = /^\w*$/
var Xo = function (t, e) {
  if ($r(t)) return !1
  var n = typeof t
  return (
    !('number' != n && 'symbol' != n && 'boolean' != n && null != t && !Ko(t)) ||
    Ho.test(t) ||
    !Yo.test(t) ||
    (null != e && t in Object(e))
  )
}
function Jo(t, e) {
  if ('function' != typeof t || (null != e && 'function' != typeof e))
    throw new TypeError('Expected a function')
  var n = function () {
    var r = arguments,
      i = e ? e.apply(this, r) : r[0],
      o = n.cache
    if (o.has(i)) return o.get(i)
    var u = t.apply(this, r)
    return (n.cache = o.set(i, u) || o), u
  }
  return (n.cache = new (Jo.Cache || Mi)()), n
}
Jo.Cache = Mi
var Zo = Jo
var Qo = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  tu = /\\(\\)?/g,
  eu = (function (t) {
    var e = Zo(t, function (t) {
        return 500 === n.size && n.clear(), t
      }),
      n = e.cache
    return e
  })(function (t) {
    var e = []
    return (
      46 === t.charCodeAt(0) && e.push(''),
      t.replace(Qo, function (t, n, r, i) {
        e.push(r ? i.replace(tu, '$1') : n || t)
      }),
      e
    )
  }),
  nu = Vn ? Vn.prototype : void 0,
  ru = nu ? nu.toString : void 0
var iu = function t(e) {
  if ('string' == typeof e) return e
  if ($r(e)) return ui(e, t) + ''
  if (Ko(e)) return ru ? ru.call(e) : ''
  var n = e + ''
  return '0' == n && 1 / e == -Infinity ? '-0' : n
}
var ou = function (t) {
  return null == t ? '' : iu(t)
}
var uu = function (t, e) {
  return $r(t) ? t : Xo(t, e) ? [t] : eu(ou(t))
}
var su = function (t) {
  var e = null == t ? 0 : t.length
  return e ? t[e - 1] : void 0
}
var cu = function (t) {
  if ('string' == typeof t || Ko(t)) return t
  var e = t + ''
  return '0' == e && 1 / t == -Infinity ? '-0' : e
}
var au = function (t, e) {
  for (var n = 0, r = (e = uu(e, t)).length; null != t && n < r; ) t = t[cu(e[n++])]
  return n && n == r ? t : void 0
}
var fu = function (t, e, n) {
  var r = -1,
    i = t.length
  e < 0 && (e = -e > i ? 0 : i + e),
    (n = n > i ? i : n) < 0 && (n += i),
    (i = e > n ? 0 : (n - e) >>> 0),
    (e >>>= 0)
  for (var o = Array(i); ++r < i; ) o[r] = t[r + e]
  return o
}
var lu = function (t, e) {
  return e.length < 2 ? t : au(t, fu(e, 0, -1))
}
var hu = function (t, e) {
    return (e = uu(e, t)), null == (t = lu(t, e)) || delete t[cu(su(e))]
  },
  pu = Function.prototype,
  du = Object.prototype,
  vu = pu.toString,
  yu = du.hasOwnProperty,
  bu = vu.call(Object)
var gu = function (t) {
  if (!Pr(t) || '[object Object]' != Xn(t)) return !1
  var e = uo(t)
  if (null === e) return !0
  var n = yu.call(e, 'constructor') && e.constructor
  return 'function' == typeof n && n instanceof n && vu.call(n) == bu
}
var mu = function (t) {
    return gu(t) ? void 0 : t
  },
  Du = Vn ? Vn.isConcatSpreadable : void 0
var wu = function (t) {
  return $r(t) || Vr(t) || !!(Du && t && t[Du])
}
var _u = function t(e, n, r, i, o) {
  var u = -1,
    s = e.length
  for (r || (r = wu), o || (o = []); ++u < s; ) {
    var c = e[u]
    n > 0 && r(c) ? (n > 1 ? t(c, n - 1, r, i, o) : oo(o, c)) : i || (o[o.length] = c)
  }
  return o
}
var Eu = function (t) {
  return (null == t ? 0 : t.length) ? _u(t, 1) : []
}
var xu = (function (t) {
    return Fr(Er(t, void 0, Eu), t + '')
  })(function (t, e) {
    var n = {}
    if (null == t) return n
    var r = !1
    ;(e = ui(e, function (e) {
      return (e = uu(e, t)), r || (r = e.length > 1), e
    })),
      mr(t, lo(t), n),
      r && (n = Go(n, 7, mu))
    for (var i = e.length; i--; ) hu(n, e[i])
    return n
  }),
  Su = Cu
function Cu(t) {
  S.default.apply(this),
    (t = t || {}),
    (this.writable = this.readable = !0),
    (this.muted = !1),
    this.on('pipe', this._onpipe),
    (this.replace = t.replace),
    (this._prompt = t.prompt || null),
    (this._hadControl = !1)
}
function Fu(t) {
  return function () {
    var e = this._dest,
      n = this._src
    e && e[t] && e[t].apply(e, arguments), n && n[t] && n[t].apply(n, arguments)
  }
}
;(Cu.prototype = Object.create(S.default.prototype)),
  Object.defineProperty(Cu.prototype, 'constructor', { value: Cu, enumerable: !1 }),
  (Cu.prototype.mute = function () {
    this.muted = !0
  }),
  (Cu.prototype.unmute = function () {
    this.muted = !1
  }),
  Object.defineProperty(Cu.prototype, '_onpipe', {
    value: function (t) {
      this._src = t
    },
    enumerable: !1,
    writable: !0,
    configurable: !0
  }),
  Object.defineProperty(Cu.prototype, 'isTTY', {
    get: function () {
      return this._dest ? this._dest.isTTY : !!this._src && this._src.isTTY
    },
    set: function (t) {
      Object.defineProperty(this, 'isTTY', {
        value: t,
        enumerable: !0,
        writable: !0,
        configurable: !0
      })
    },
    enumerable: !0,
    configurable: !0
  }),
  Object.defineProperty(Cu.prototype, 'rows', {
    get: function () {
      return this._dest ? this._dest.rows : this._src ? this._src.rows : void 0
    },
    enumerable: !0,
    configurable: !0
  }),
  Object.defineProperty(Cu.prototype, 'columns', {
    get: function () {
      return this._dest ? this._dest.columns : this._src ? this._src.columns : void 0
    },
    enumerable: !0,
    configurable: !0
  }),
  (Cu.prototype.pipe = function (t, e) {
    return (this._dest = t), S.default.prototype.pipe.call(this, t, e)
  }),
  (Cu.prototype.pause = function () {
    if (this._src) return this._src.pause()
  }),
  (Cu.prototype.resume = function () {
    if (this._src) return this._src.resume()
  }),
  (Cu.prototype.write = function (t) {
    if (this.muted) {
      if (!this.replace) return !0
      if (t.match(/^\u001b/))
        return (
          0 === t.indexOf(this._prompt) &&
            ((t = (t = t.substr(this._prompt.length)).replace(/./g, this.replace)),
            (t = this._prompt + t)),
          (this._hadControl = !0),
          this.emit('data', t)
        )
      this._prompt &&
        this._hadControl &&
        0 === t.indexOf(this._prompt) &&
        ((this._hadControl = !1),
        this.emit('data', this._prompt),
        (t = t.substr(this._prompt.length))),
        (t = t.toString().replace(/./g, this.replace))
    }
    this.emit('data', t)
  }),
  (Cu.prototype.end = function (t) {
    this.muted &&
      (t = t && this.replace ? t.toString().replace(/./g, this.replace) : null),
      t && this.emit('data', t),
      this.emit('end')
  }),
  (Cu.prototype.destroy = Fu('destroy')),
  (Cu.prototype.destroySoon = Fu('destroySoon')),
  (Cu.prototype.close = Fu('close'))
var Ou = { extend: oi, omit: xu }
var ju = class {
    constructor(t) {
      this.rl ||
        (this.rl = F.default.createInterface(
          (function (t) {
            ;(t = t || {}).skipTTYChecks = void 0 === t.skipTTYChecks || t.skipTTYChecks
            var e = t.input || process.stdin
            if (!t.skipTTYChecks && !e.isTTY) {
              const t = new Error(
                'Prompts can not be meaningfully rendered in non-TTY environments'
              )
              throw ((t.isTtyError = !0), t)
            }
            var n = new Su()
            n.pipe(t.output || process.stdout)
            var r = n
            return Ou.extend(
              { terminal: !0, input: e, output: r },
              Ou.omit(t, ['input', 'output'])
            )
          })(t)
        )),
        this.rl.resume(),
        (this.onForceClose = this.onForceClose.bind(this)),
        process.on('exit', this.onForceClose),
        this.rl.on('SIGINT', this.onForceClose)
    }
    onForceClose() {
      this.close(), process.kill(process.pid, 'SIGINT'), console.log('')
    }
    close() {
      this.rl.removeListener('SIGINT', this.onForceClose),
        process.removeListener('exit', this.onForceClose),
        this.rl.output.unmute(),
        this.activePrompt &&
          'function' == typeof this.activePrompt.close &&
          this.activePrompt.close(),
        this.rl.output.end(),
        this.rl.pause(),
        this.rl.close()
    }
  },
  Au = Ft(function (t) {
    const e = t.exports
    t.exports.default = e
    const n = '[',
      r = ']',
      i = '',
      o = ';',
      u = 'Apple_Terminal' === process.env.TERM_PROGRAM
    ;(e.cursorTo = (t, e) => {
      if ('number' != typeof t) throw new TypeError('The `x` argument is required')
      return 'number' != typeof e ? n + (t + 1) + 'G' : n + (e + 1) + ';' + (t + 1) + 'H'
    }),
      (e.cursorMove = (t, e) => {
        if ('number' != typeof t) throw new TypeError('The `x` argument is required')
        let r = ''
        return (
          t < 0 ? (r += n + -t + 'D') : t > 0 && (r += n + t + 'C'),
          e < 0 ? (r += n + -e + 'A') : e > 0 && (r += n + e + 'B'),
          r
        )
      }),
      (e.cursorUp = (t = 1) => n + t + 'A'),
      (e.cursorDown = (t = 1) => n + t + 'B'),
      (e.cursorForward = (t = 1) => n + t + 'C'),
      (e.cursorBackward = (t = 1) => n + t + 'D'),
      (e.cursorLeft = '[G'),
      (e.cursorSavePosition = u ? '7' : '[s'),
      (e.cursorRestorePosition = u ? '8' : '[u'),
      (e.cursorGetPosition = '[6n'),
      (e.cursorNextLine = '[E'),
      (e.cursorPrevLine = '[F'),
      (e.cursorHide = '[?25l'),
      (e.cursorShow = '[?25h'),
      (e.eraseLines = (t) => {
        let n = ''
        for (let r = 0; r < t; r++) n += e.eraseLine + (r < t - 1 ? e.cursorUp() : '')
        return t && (n += e.cursorLeft), n
      }),
      (e.eraseEndLine = '[K'),
      (e.eraseStartLine = '[1K'),
      (e.eraseLine = '[2K'),
      (e.eraseDown = '[J'),
      (e.eraseUp = '[1J'),
      (e.eraseScreen = '[2J'),
      (e.scrollUp = '[S'),
      (e.scrollDown = '[T'),
      (e.clearScreen = 'c'),
      (e.clearTerminal =
        'win32' === process.platform ? `${e.eraseScreen}[0f` : `${e.eraseScreen}[3J[H`),
      (e.beep = i),
      (e.link = (t, e) => [r, '8', o, o, e, i, t, r, '8', o, o, i].join('')),
      (e.image = (t, e = {}) => {
        let n = `${r}1337;File=inline=1`
        return (
          e.width && (n += `;width=${e.width}`),
          e.height && (n += `;height=${e.height}`),
          !1 === e.preserveAspectRatio && (n += ';preserveAspectRatio=0'),
          n + ':' + t.toString('base64') + i
        )
      }),
      (e.iTerm = {
        setCwd: (t = process.cwd()) => `${r}50;CurrentDir=${t}${i}`,
        annotation: (t, e = {}) => {
          let n = `${r}1337;`
          const o = void 0 !== e.x,
            u = void 0 !== e.y
          if ((o || u) && (!o || !u || void 0 === e.length))
            throw new Error(
              '`x`, `y` and `length` must be defined when `x` or `y` is defined'
            )
          return (
            (t = t.replace(/\|/g, '')),
            (n += e.isHidden ? 'AddHiddenAnnotation=' : 'AddAnnotation='),
            e.length > 0
              ? (n += (o ? [t, e.length, e.x, e.y] : [e.length, t]).join('|'))
              : (n += t),
            n + i
          )
        }
      })
  }),
  ku = function (t, e) {
    t.output.write(Au.cursorBackward(e))
  },
  Iu = function (t, e) {
    t.output.write(Au.cursorForward(e))
  },
  Tu = function (t, e) {
    t.output.write(Au.cursorUp(e))
  },
  Nu = function (t, e) {
    t.output.write(Au.cursorDown(e))
  },
  Bu = function (t, e) {
    t.output.write(Au.eraseLines(e))
  },
  Pu = { last: su }
var Ru = class extends ju {
  constructor(t) {
    super((t = t || {})),
      (this.log = Rn(this.writeLog.bind(this))),
      (this.bottomBar = t.bottomBar || ''),
      this.render()
  }
  render() {
    return this.write(this.bottomBar), this
  }
  clean() {
    return Bu(this.rl, this.bottomBar.split('\n').length), this
  }
  updateBottomBar(t) {
    return (
      Bu(this.rl, 1),
      this.rl.output.unmute(),
      this.clean(),
      (this.bottomBar = t),
      this.render(),
      this.rl.output.mute(),
      this
    )
  }
  writeLog(t) {
    return (
      this.rl.output.unmute(),
      this.clean(),
      this.rl.output.write(this.enforceLF(t.toString())),
      this.render(),
      this.rl.output.mute(),
      this
    )
  }
  enforceLF(t) {
    return t.match(/[\r\n]$/) ? t : t + '\n'
  }
  write(t) {
    var e = t.split(/\n/)
    ;(this.height = e.length),
      this.rl.setPrompt(Pu.last(e)),
      0 === this.rl.output.rows &&
        0 === this.rl.output.columns &&
        ku(this.rl, t.length + this.rl.line.length),
      this.rl.output.write(t)
  }
}
var Lu = function (t) {
  return Go(t, 4)
}
var Mu = function (t, e, n, r) {
  if (!Jn(t)) return t
  for (var i = -1, o = (e = uu(e, t)).length, u = o - 1, s = t; null != s && ++i < o; ) {
    var c = cu(e[i]),
      a = n
    if ('__proto__' === c || 'constructor' === c || 'prototype' === c) return t
    if (i != u) {
      var f = s[c]
      void 0 === (a = r ? r(f, c, s) : void 0) && (a = Jn(f) ? f : Ir(e[i + 1]) ? [] : {})
    }
    gr(s, c, a), (s = s[c])
  }
  return t
}
var Uu = function (t, e, n) {
    return null == t ? t : Mu(t, e, n)
  },
  Vu = function (t, e) {
    return (Vu =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (t, e) {
          t.__proto__ = e
        }) ||
      function (t, e) {
        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
      })(t, e)
  }
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ function $u(
  t,
  e
) {
  function n() {
    this.constructor = t
  }
  Vu(t, e),
    (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()))
}
function zu(t) {
  return 'function' == typeof t
}
var qu = !1,
  Wu = {
    Promise: void 0,
    set useDeprecatedSynchronousErrorHandling(t) {
      t && new Error().stack
      qu = t
    },
    get useDeprecatedSynchronousErrorHandling() {
      return qu
    }
  }
function Gu(t) {
  setTimeout(function () {
    throw t
  }, 0)
}
var Ku = {
    closed: !0,
    next: function (t) {},
    error: function (t) {
      if (Wu.useDeprecatedSynchronousErrorHandling) throw t
      Gu(t)
    },
    complete: function () {}
  },
  Yu = (function () {
    return (
      Array.isArray ||
      function (t) {
        return t && 'number' == typeof t.length
      }
    )
  })()
function Hu(t) {
  return null !== t && 'object' == typeof t
}
var Xu = (function () {
    function t(t) {
      return (
        Error.call(this),
        (this.message = t
          ? t.length +
            ' errors occurred during unsubscription:\n' +
            t
              .map(function (t, e) {
                return e + 1 + ') ' + t.toString()
              })
              .join('\n  ')
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = t),
        this
      )
    }
    return (t.prototype = Object.create(Error.prototype)), t
  })(),
  Ju = (function () {
    function t(t) {
      ;(this.closed = !1),
        (this._parentOrParents = null),
        (this._subscriptions = null),
        t && ((this._ctorUnsubscribe = !0), (this._unsubscribe = t))
    }
    return (
      (t.prototype.unsubscribe = function () {
        var e
        if (!this.closed) {
          var n = this,
            r = n._parentOrParents,
            i = n._ctorUnsubscribe,
            o = n._unsubscribe,
            u = n._subscriptions
          if (
            ((this.closed = !0),
            (this._parentOrParents = null),
            (this._subscriptions = null),
            r instanceof t)
          )
            r.remove(this)
          else if (null !== r)
            for (var s = 0; s < r.length; ++s) {
              r[s].remove(this)
            }
          if (zu(o)) {
            i && (this._unsubscribe = void 0)
            try {
              o.call(this)
            } catch (t) {
              e = t instanceof Xu ? Zu(t.errors) : [t]
            }
          }
          if (Yu(u)) {
            s = -1
            for (var c = u.length; ++s < c; ) {
              var a = u[s]
              if (Hu(a))
                try {
                  a.unsubscribe()
                } catch (t) {
                  ;(e = e || []),
                    t instanceof Xu ? (e = e.concat(Zu(t.errors))) : e.push(t)
                }
            }
          }
          if (e) throw new Xu(e)
        }
      }),
      (t.prototype.add = function (e) {
        var n = e
        if (!e) return t.EMPTY
        switch (typeof e) {
          case 'function':
            n = new t(e)
          case 'object':
            if (n === this || n.closed || 'function' != typeof n.unsubscribe) return n
            if (this.closed) return n.unsubscribe(), n
            if (!(n instanceof t)) {
              var r = n
              ;(n = new t())._subscriptions = [r]
            }
            break
          default:
            throw new Error('unrecognized teardown ' + e + ' added to Subscription.')
        }
        var i = n._parentOrParents
        if (null === i) n._parentOrParents = this
        else if (i instanceof t) {
          if (i === this) return n
          n._parentOrParents = [i, this]
        } else {
          if (-1 !== i.indexOf(this)) return n
          i.push(this)
        }
        var o = this._subscriptions
        return null === o ? (this._subscriptions = [n]) : o.push(n), n
      }),
      (t.prototype.remove = function (t) {
        var e = this._subscriptions
        if (e) {
          var n = e.indexOf(t)
          ;-1 !== n && e.splice(n, 1)
        }
      }),
      (t.EMPTY = (function (t) {
        return (t.closed = !0), t
      })(new t())),
      t
    )
  })()
function Zu(t) {
  return t.reduce(function (t, e) {
    return t.concat(e instanceof Xu ? e.errors : e)
  }, [])
}
var Qu = (function () {
    return 'function' == typeof Symbol
      ? Symbol('rxSubscriber')
      : '@@rxSubscriber_' + Math.random()
  })(),
  ts = (function (t) {
    function e(n, r, i) {
      var o = t.call(this) || this
      switch (
        ((o.syncErrorValue = null),
        (o.syncErrorThrown = !1),
        (o.syncErrorThrowable = !1),
        (o.isStopped = !1),
        arguments.length)
      ) {
        case 0:
          o.destination = Ku
          break
        case 1:
          if (!n) {
            o.destination = Ku
            break
          }
          if ('object' == typeof n) {
            n instanceof e
              ? ((o.syncErrorThrowable = n.syncErrorThrowable),
                (o.destination = n),
                n.add(o))
              : ((o.syncErrorThrowable = !0), (o.destination = new es(o, n)))
            break
          }
        default:
          ;(o.syncErrorThrowable = !0), (o.destination = new es(o, n, r, i))
      }
      return o
    }
    return (
      $u(e, t),
      (e.prototype[Qu] = function () {
        return this
      }),
      (e.create = function (t, n, r) {
        var i = new e(t, n, r)
        return (i.syncErrorThrowable = !1), i
      }),
      (e.prototype.next = function (t) {
        this.isStopped || this._next(t)
      }),
      (e.prototype.error = function (t) {
        this.isStopped || ((this.isStopped = !0), this._error(t))
      }),
      (e.prototype.complete = function () {
        this.isStopped || ((this.isStopped = !0), this._complete())
      }),
      (e.prototype.unsubscribe = function () {
        this.closed || ((this.isStopped = !0), t.prototype.unsubscribe.call(this))
      }),
      (e.prototype._next = function (t) {
        this.destination.next(t)
      }),
      (e.prototype._error = function (t) {
        this.destination.error(t), this.unsubscribe()
      }),
      (e.prototype._complete = function () {
        this.destination.complete(), this.unsubscribe()
      }),
      (e.prototype._unsubscribeAndRecycle = function () {
        var t = this._parentOrParents
        return (
          (this._parentOrParents = null),
          this.unsubscribe(),
          (this.closed = !1),
          (this.isStopped = !1),
          (this._parentOrParents = t),
          this
        )
      }),
      e
    )
  })(Ju),
  es = (function (t) {
    function e(e, n, r, i) {
      var o,
        u = t.call(this) || this
      u._parentSubscriber = e
      var s = u
      return (
        zu(n)
          ? (o = n)
          : n &&
            ((o = n.next),
            (r = n.error),
            (i = n.complete),
            n !== Ku &&
              (zu((s = Object.create(n)).unsubscribe) && u.add(s.unsubscribe.bind(s)),
              (s.unsubscribe = u.unsubscribe.bind(u)))),
        (u._context = s),
        (u._next = o),
        (u._error = r),
        (u._complete = i),
        u
      )
    }
    return (
      $u(e, t),
      (e.prototype.next = function (t) {
        if (!this.isStopped && this._next) {
          var e = this._parentSubscriber
          Wu.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable
            ? this.__tryOrSetError(e, this._next, t) && this.unsubscribe()
            : this.__tryOrUnsub(this._next, t)
        }
      }),
      (e.prototype.error = function (t) {
        if (!this.isStopped) {
          var e = this._parentSubscriber,
            n = Wu.useDeprecatedSynchronousErrorHandling
          if (this._error)
            n && e.syncErrorThrowable
              ? (this.__tryOrSetError(e, this._error, t), this.unsubscribe())
              : (this.__tryOrUnsub(this._error, t), this.unsubscribe())
          else if (e.syncErrorThrowable)
            n ? ((e.syncErrorValue = t), (e.syncErrorThrown = !0)) : Gu(t),
              this.unsubscribe()
          else {
            if ((this.unsubscribe(), n)) throw t
            Gu(t)
          }
        }
      }),
      (e.prototype.complete = function () {
        var t = this
        if (!this.isStopped) {
          var e = this._parentSubscriber
          if (this._complete) {
            var n = function () {
              return t._complete.call(t._context)
            }
            Wu.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable
              ? (this.__tryOrSetError(e, n), this.unsubscribe())
              : (this.__tryOrUnsub(n), this.unsubscribe())
          } else this.unsubscribe()
        }
      }),
      (e.prototype.__tryOrUnsub = function (t, e) {
        try {
          t.call(this._context, e)
        } catch (t) {
          if ((this.unsubscribe(), Wu.useDeprecatedSynchronousErrorHandling)) throw t
          Gu(t)
        }
      }),
      (e.prototype.__tryOrSetError = function (t, e, n) {
        if (!Wu.useDeprecatedSynchronousErrorHandling) throw new Error('bad call')
        try {
          e.call(this._context, n)
        } catch (e) {
          return Wu.useDeprecatedSynchronousErrorHandling
            ? ((t.syncErrorValue = e), (t.syncErrorThrown = !0), !0)
            : (Gu(e), !0)
        }
        return !1
      }),
      (e.prototype._unsubscribe = function () {
        var t = this._parentSubscriber
        ;(this._context = null), (this._parentSubscriber = null), t.unsubscribe()
      }),
      e
    )
  })(ts)
function ns(t) {
  for (; t; ) {
    var e = t,
      n = e.closed,
      r = e.destination,
      i = e.isStopped
    if (n || i) return !1
    t = r && r instanceof ts ? r : null
  }
  return !0
}
var rs = (function () {
  return ('function' == typeof Symbol && Symbol.observable) || '@@observable'
})()
function is(t) {
  return t
}
function os() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
  return us(t)
}
function us(t) {
  return 0 === t.length
    ? is
    : 1 === t.length
    ? t[0]
    : function (e) {
        return t.reduce(function (t, e) {
          return e(t)
        }, e)
      }
}
var ss = (function () {
  function t(t) {
    ;(this._isScalar = !1), t && (this._subscribe = t)
  }
  return (
    (t.prototype.lift = function (e) {
      var n = new t()
      return (n.source = this), (n.operator = e), n
    }),
    (t.prototype.subscribe = function (t, e, n) {
      var r = this.operator,
        i = (function (t, e, n) {
          if (t) {
            if (t instanceof ts) return t
            if (t[Qu]) return t[Qu]()
          }
          return t || e || n ? new ts(t, e, n) : new ts(Ku)
        })(t, e, n)
      if (
        (r
          ? i.add(r.call(i, this.source))
          : i.add(
              this.source ||
                (Wu.useDeprecatedSynchronousErrorHandling && !i.syncErrorThrowable)
                ? this._subscribe(i)
                : this._trySubscribe(i)
            ),
        Wu.useDeprecatedSynchronousErrorHandling &&
          i.syncErrorThrowable &&
          ((i.syncErrorThrowable = !1), i.syncErrorThrown))
      )
        throw i.syncErrorValue
      return i
    }),
    (t.prototype._trySubscribe = function (t) {
      try {
        return this._subscribe(t)
      } catch (e) {
        Wu.useDeprecatedSynchronousErrorHandling &&
          ((t.syncErrorThrown = !0), (t.syncErrorValue = e)),
          ns(t) ? t.error(e) : console.warn(e)
      }
    }),
    (t.prototype.forEach = function (t, e) {
      var n = this
      return new (e = cs(e))(function (e, r) {
        var i
        i = n.subscribe(
          function (e) {
            try {
              t(e)
            } catch (t) {
              r(t), i && i.unsubscribe()
            }
          },
          r,
          e
        )
      })
    }),
    (t.prototype._subscribe = function (t) {
      var e = this.source
      return e && e.subscribe(t)
    }),
    (t.prototype[rs] = function () {
      return this
    }),
    (t.prototype.pipe = function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return 0 === t.length ? this : us(t)(this)
    }),
    (t.prototype.toPromise = function (t) {
      var e = this
      return new (t = cs(t))(function (t, n) {
        var r
        e.subscribe(
          function (t) {
            return (r = t)
          },
          function (t) {
            return n(t)
          },
          function () {
            return t(r)
          }
        )
      })
    }),
    (t.create = function (e) {
      return new t(e)
    }),
    t
  )
})()
function cs(t) {
  if ((t || (t = Wu.Promise || Promise), !t)) throw new Error('no Promise impl found')
  return t
}
var as = (function () {
    function t() {
      return (
        Error.call(this),
        (this.message = 'object unsubscribed'),
        (this.name = 'ObjectUnsubscribedError'),
        this
      )
    }
    return (t.prototype = Object.create(Error.prototype)), t
  })(),
  fs = (function (t) {
    function e(e, n) {
      var r = t.call(this) || this
      return (r.subject = e), (r.subscriber = n), (r.closed = !1), r
    }
    return (
      $u(e, t),
      (e.prototype.unsubscribe = function () {
        if (!this.closed) {
          this.closed = !0
          var t = this.subject,
            e = t.observers
          if (((this.subject = null), e && 0 !== e.length && !t.isStopped && !t.closed)) {
            var n = e.indexOf(this.subscriber)
            ;-1 !== n && e.splice(n, 1)
          }
        }
      }),
      e
    )
  })(Ju),
  ls = (function (t) {
    function e(e) {
      var n = t.call(this, e) || this
      return (n.destination = e), n
    }
    return $u(e, t), e
  })(ts),
  hs = (function (t) {
    function e() {
      var e = t.call(this) || this
      return (
        (e.observers = []),
        (e.closed = !1),
        (e.isStopped = !1),
        (e.hasError = !1),
        (e.thrownError = null),
        e
      )
    }
    return (
      $u(e, t),
      (e.prototype[Qu] = function () {
        return new ls(this)
      }),
      (e.prototype.lift = function (t) {
        var e = new ps(this, this)
        return (e.operator = t), e
      }),
      (e.prototype.next = function (t) {
        if (this.closed) throw new as()
        if (!this.isStopped)
          for (var e = this.observers, n = e.length, r = e.slice(), i = 0; i < n; i++)
            r[i].next(t)
      }),
      (e.prototype.error = function (t) {
        if (this.closed) throw new as()
        ;(this.hasError = !0), (this.thrownError = t), (this.isStopped = !0)
        for (var e = this.observers, n = e.length, r = e.slice(), i = 0; i < n; i++)
          r[i].error(t)
        this.observers.length = 0
      }),
      (e.prototype.complete = function () {
        if (this.closed) throw new as()
        this.isStopped = !0
        for (var t = this.observers, e = t.length, n = t.slice(), r = 0; r < e; r++)
          n[r].complete()
        this.observers.length = 0
      }),
      (e.prototype.unsubscribe = function () {
        ;(this.isStopped = !0), (this.closed = !0), (this.observers = null)
      }),
      (e.prototype._trySubscribe = function (e) {
        if (this.closed) throw new as()
        return t.prototype._trySubscribe.call(this, e)
      }),
      (e.prototype._subscribe = function (t) {
        if (this.closed) throw new as()
        return this.hasError
          ? (t.error(this.thrownError), Ju.EMPTY)
          : this.isStopped
          ? (t.complete(), Ju.EMPTY)
          : (this.observers.push(t), new fs(this, t))
      }),
      (e.prototype.asObservable = function () {
        var t = new ss()
        return (t.source = this), t
      }),
      (e.create = function (t, e) {
        return new ps(t, e)
      }),
      e
    )
  })(ss),
  ps = (function (t) {
    function e(e, n) {
      var r = t.call(this) || this
      return (r.destination = e), (r.source = n), r
    }
    return (
      $u(e, t),
      (e.prototype.next = function (t) {
        var e = this.destination
        e && e.next && e.next(t)
      }),
      (e.prototype.error = function (t) {
        var e = this.destination
        e && e.error && this.destination.error(t)
      }),
      (e.prototype.complete = function () {
        var t = this.destination
        t && t.complete && this.destination.complete()
      }),
      (e.prototype._subscribe = function (t) {
        return this.source ? this.source.subscribe(t) : Ju.EMPTY
      }),
      e
    )
  })(hs)
function ds() {
  return function (t) {
    return t.lift(new vs(t))
  }
}
var vs = (function () {
    function t(t) {
      this.connectable = t
    }
    return (
      (t.prototype.call = function (t, e) {
        var n = this.connectable
        n._refCount++
        var r = new ys(t, n),
          i = e.subscribe(r)
        return r.closed || (r.connection = n.connect()), i
      }),
      t
    )
  })(),
  ys = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.connectable = n), r
    }
    return (
      $u(e, t),
      (e.prototype._unsubscribe = function () {
        var t = this.connectable
        if (t) {
          this.connectable = null
          var e = t._refCount
          if (e <= 0) this.connection = null
          else if (((t._refCount = e - 1), e > 1)) this.connection = null
          else {
            var n = this.connection,
              r = t._connection
            ;(this.connection = null), !r || (n && r !== n) || r.unsubscribe()
          }
        } else this.connection = null
      }),
      e
    )
  })(ts),
  bs = (function (t) {
    function e(e, n) {
      var r = t.call(this) || this
      return (
        (r.source = e), (r.subjectFactory = n), (r._refCount = 0), (r._isComplete = !1), r
      )
    }
    return (
      $u(e, t),
      (e.prototype._subscribe = function (t) {
        return this.getSubject().subscribe(t)
      }),
      (e.prototype.getSubject = function () {
        var t = this._subject
        return (
          (t && !t.isStopped) || (this._subject = this.subjectFactory()), this._subject
        )
      }),
      (e.prototype.connect = function () {
        var t = this._connection
        return (
          t ||
            ((this._isComplete = !1),
            (t = this._connection = new Ju()).add(
              this.source.subscribe(new ms(this.getSubject(), this))
            ),
            t.closed && ((this._connection = null), (t = Ju.EMPTY))),
          t
        )
      }),
      (e.prototype.refCount = function () {
        return ds()(this)
      }),
      e
    )
  })(ss),
  gs = (function () {
    var t = bs.prototype
    return {
      operator: { value: null },
      _refCount: { value: 0, writable: !0 },
      _subject: { value: null, writable: !0 },
      _connection: { value: null, writable: !0 },
      _subscribe: { value: t._subscribe },
      _isComplete: { value: t._isComplete, writable: !0 },
      getSubject: { value: t.getSubject },
      connect: { value: t.connect },
      refCount: { value: t.refCount }
    }
  })(),
  ms = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.connectable = n), r
    }
    return (
      $u(e, t),
      (e.prototype._error = function (e) {
        this._unsubscribe(), t.prototype._error.call(this, e)
      }),
      (e.prototype._complete = function () {
        ;(this.connectable._isComplete = !0),
          this._unsubscribe(),
          t.prototype._complete.call(this)
      }),
      (e.prototype._unsubscribe = function () {
        var t = this.connectable
        if (t) {
          this.connectable = null
          var e = t._connection
          ;(t._refCount = 0),
            (t._subject = null),
            (t._connection = null),
            e && e.unsubscribe()
        }
      }),
      e
    )
  })(ls)
var Ds = (function () {
    function t(t, e, n, r) {
      ;(this.keySelector = t),
        (this.elementSelector = e),
        (this.durationSelector = n),
        (this.subjectSelector = r)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(
          new ws(
            t,
            this.keySelector,
            this.elementSelector,
            this.durationSelector,
            this.subjectSelector
          )
        )
      }),
      t
    )
  })(),
  ws = (function (t) {
    function e(e, n, r, i, o) {
      var u = t.call(this, e) || this
      return (
        (u.keySelector = n),
        (u.elementSelector = r),
        (u.durationSelector = i),
        (u.subjectSelector = o),
        (u.groups = null),
        (u.attemptedToUnsubscribe = !1),
        (u.count = 0),
        u
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e
        try {
          e = this.keySelector(t)
        } catch (t) {
          return void this.error(t)
        }
        this._group(t, e)
      }),
      (e.prototype._group = function (t, e) {
        var n = this.groups
        n || (n = this.groups = new Map())
        var r,
          i = n.get(e)
        if (this.elementSelector)
          try {
            r = this.elementSelector(t)
          } catch (t) {
            this.error(t)
          }
        else r = t
        if (!i) {
          ;(i = this.subjectSelector ? this.subjectSelector() : new hs()), n.set(e, i)
          var o = new Es(e, i, this)
          if ((this.destination.next(o), this.durationSelector)) {
            var u = void 0
            try {
              u = this.durationSelector(new Es(e, i))
            } catch (t) {
              return void this.error(t)
            }
            this.add(u.subscribe(new _s(e, i, this)))
          }
        }
        i.closed || i.next(r)
      }),
      (e.prototype._error = function (t) {
        var e = this.groups
        e &&
          (e.forEach(function (e, n) {
            e.error(t)
          }),
          e.clear()),
          this.destination.error(t)
      }),
      (e.prototype._complete = function () {
        var t = this.groups
        t &&
          (t.forEach(function (t, e) {
            t.complete()
          }),
          t.clear()),
          this.destination.complete()
      }),
      (e.prototype.removeGroup = function (t) {
        this.groups.delete(t)
      }),
      (e.prototype.unsubscribe = function () {
        this.closed ||
          ((this.attemptedToUnsubscribe = !0),
          0 === this.count && t.prototype.unsubscribe.call(this))
      }),
      e
    )
  })(ts),
  _s = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, n) || this
      return (i.key = e), (i.group = n), (i.parent = r), i
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.complete()
      }),
      (e.prototype._unsubscribe = function () {
        var t = this.parent,
          e = this.key
        ;(this.key = this.parent = null), t && t.removeGroup(e)
      }),
      e
    )
  })(ts),
  Es = (function (t) {
    function e(e, n, r) {
      var i = t.call(this) || this
      return (i.key = e), (i.groupSubject = n), (i.refCountSubscription = r), i
    }
    return (
      $u(e, t),
      (e.prototype._subscribe = function (t) {
        var e = new Ju(),
          n = this.refCountSubscription,
          r = this.groupSubject
        return n && !n.closed && e.add(new xs(n)), e.add(r.subscribe(t)), e
      }),
      e
    )
  })(ss),
  xs = (function (t) {
    function e(e) {
      var n = t.call(this) || this
      return (n.parent = e), e.count++, n
    }
    return (
      $u(e, t),
      (e.prototype.unsubscribe = function () {
        var e = this.parent
        e.closed ||
          this.closed ||
          (t.prototype.unsubscribe.call(this),
          (e.count -= 1),
          0 === e.count && e.attemptedToUnsubscribe && e.unsubscribe())
      }),
      e
    )
  })(Ju),
  Ss = (function (t) {
    function e(e) {
      var n = t.call(this) || this
      return (n._value = e), n
    }
    return (
      $u(e, t),
      Object.defineProperty(e.prototype, 'value', {
        get: function () {
          return this.getValue()
        },
        enumerable: !0,
        configurable: !0
      }),
      (e.prototype._subscribe = function (e) {
        var n = t.prototype._subscribe.call(this, e)
        return n && !n.closed && e.next(this._value), n
      }),
      (e.prototype.getValue = function () {
        if (this.hasError) throw this.thrownError
        if (this.closed) throw new as()
        return this._value
      }),
      (e.prototype.next = function (e) {
        t.prototype.next.call(this, (this._value = e))
      }),
      e
    )
  })(hs),
  Cs = (function (t) {
    function e(e, n) {
      var r = t.call(this, e, n) || this
      return (r.scheduler = e), (r.work = n), (r.pending = !1), r
    }
    return (
      $u(e, t),
      (e.prototype.schedule = function (t, e) {
        if ((void 0 === e && (e = 0), this.closed)) return this
        this.state = t
        var n = this.id,
          r = this.scheduler
        return (
          null != n && (this.id = this.recycleAsyncId(r, n, e)),
          (this.pending = !0),
          (this.delay = e),
          (this.id = this.id || this.requestAsyncId(r, this.id, e)),
          this
        )
      }),
      (e.prototype.requestAsyncId = function (t, e, n) {
        return void 0 === n && (n = 0), setInterval(t.flush.bind(t, this), n)
      }),
      (e.prototype.recycleAsyncId = function (t, e, n) {
        if (
          (void 0 === n && (n = 0), null !== n && this.delay === n && !1 === this.pending)
        )
          return e
        clearInterval(e)
      }),
      (e.prototype.execute = function (t, e) {
        if (this.closed) return new Error('executing a cancelled action')
        this.pending = !1
        var n = this._execute(t, e)
        if (n) return n
        !1 === this.pending &&
          null != this.id &&
          (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
      }),
      (e.prototype._execute = function (t, e) {
        var n = !1,
          r = void 0
        try {
          this.work(t)
        } catch (t) {
          ;(n = !0), (r = (!!t && t) || new Error(t))
        }
        if (n) return this.unsubscribe(), r
      }),
      (e.prototype._unsubscribe = function () {
        var t = this.id,
          e = this.scheduler,
          n = e.actions,
          r = n.indexOf(this)
        ;(this.work = null),
          (this.state = null),
          (this.pending = !1),
          (this.scheduler = null),
          -1 !== r && n.splice(r, 1),
          null != t && (this.id = this.recycleAsyncId(e, t, null)),
          (this.delay = null)
      }),
      e
    )
  })(
    (function (t) {
      function e(e, n) {
        return t.call(this) || this
      }
      return (
        $u(e, t),
        (e.prototype.schedule = function (t, e) {
          return this
        }),
        e
      )
    })(Ju)
  ),
  Fs = (function (t) {
    function e(e, n) {
      var r = t.call(this, e, n) || this
      return (r.scheduler = e), (r.work = n), r
    }
    return (
      $u(e, t),
      (e.prototype.schedule = function (e, n) {
        return (
          void 0 === n && (n = 0),
          n > 0
            ? t.prototype.schedule.call(this, e, n)
            : ((this.delay = n), (this.state = e), this.scheduler.flush(this), this)
        )
      }),
      (e.prototype.execute = function (e, n) {
        return n > 0 || this.closed
          ? t.prototype.execute.call(this, e, n)
          : this._execute(e, n)
      }),
      (e.prototype.requestAsyncId = function (e, n, r) {
        return (
          void 0 === r && (r = 0),
          (null !== r && r > 0) || (null === r && this.delay > 0)
            ? t.prototype.requestAsyncId.call(this, e, n, r)
            : e.flush(this)
        )
      }),
      e
    )
  })(Cs),
  Os = (function () {
    function t(e, n) {
      void 0 === n && (n = t.now), (this.SchedulerAction = e), (this.now = n)
    }
    return (
      (t.prototype.schedule = function (t, e, n) {
        return void 0 === e && (e = 0), new this.SchedulerAction(this, t).schedule(n, e)
      }),
      (t.now = function () {
        return Date.now()
      }),
      t
    )
  })(),
  js = (function (t) {
    function e(n, r) {
      void 0 === r && (r = Os.now)
      var i =
        t.call(this, n, function () {
          return e.delegate && e.delegate !== i ? e.delegate.now() : r()
        }) || this
      return (i.actions = []), (i.active = !1), (i.scheduled = void 0), i
    }
    return (
      $u(e, t),
      (e.prototype.schedule = function (n, r, i) {
        return (
          void 0 === r && (r = 0),
          e.delegate && e.delegate !== this
            ? e.delegate.schedule(n, r, i)
            : t.prototype.schedule.call(this, n, r, i)
        )
      }),
      (e.prototype.flush = function (t) {
        var e = this.actions
        if (this.active) e.push(t)
        else {
          var n
          this.active = !0
          do {
            if ((n = t.execute(t.state, t.delay))) break
          } while ((t = e.shift()))
          if (((this.active = !1), n)) {
            for (; (t = e.shift()); ) t.unsubscribe()
            throw n
          }
        }
      }),
      e
    )
  })(Os),
  As = new ((function (t) {
    function e() {
      return (null !== t && t.apply(this, arguments)) || this
    }
    return $u(e, t), e
  })(js))(Fs),
  ks = As,
  Is = new ss(function (t) {
    return t.complete()
  })
function Ts(t) {
  return t
    ? (function (t) {
        return new ss(function (e) {
          return t.schedule(function () {
            return e.complete()
          })
        })
      })(t)
    : Is
}
function Ns(t) {
  return t && 'function' == typeof t.schedule
}
var Bs,
  Ps = function (t) {
    return function (e) {
      for (var n = 0, r = t.length; n < r && !e.closed; n++) e.next(t[n])
      e.complete()
    }
  }
function Rs(t, e) {
  return new ss(function (n) {
    var r = new Ju(),
      i = 0
    return (
      r.add(
        e.schedule(function () {
          i !== t.length
            ? (n.next(t[i++]), n.closed || r.add(this.schedule()))
            : n.complete()
        })
      ),
      r
    )
  })
}
function Ls(t, e) {
  return e ? Rs(t, e) : new ss(Ps(t))
}
function Ms() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
  var n = t[t.length - 1]
  return Ns(n) ? (t.pop(), Rs(t, n)) : Ls(t)
}
function Us(t, e) {
  return new ss(
    e
      ? function (n) {
          return e.schedule(Vs, 0, { error: t, subscriber: n })
        }
      : function (e) {
          return e.error(t)
        }
  )
}
function Vs(t) {
  var e = t.error
  t.subscriber.error(e)
}
Bs || (Bs = {})
var $s = (function () {
  function t(t, e, n) {
    ;(this.kind = t), (this.value = e), (this.error = n), (this.hasValue = 'N' === t)
  }
  return (
    (t.prototype.observe = function (t) {
      switch (this.kind) {
        case 'N':
          return t.next && t.next(this.value)
        case 'E':
          return t.error && t.error(this.error)
        case 'C':
          return t.complete && t.complete()
      }
    }),
    (t.prototype.do = function (t, e, n) {
      switch (this.kind) {
        case 'N':
          return t && t(this.value)
        case 'E':
          return e && e(this.error)
        case 'C':
          return n && n()
      }
    }),
    (t.prototype.accept = function (t, e, n) {
      return t && 'function' == typeof t.next ? this.observe(t) : this.do(t, e, n)
    }),
    (t.prototype.toObservable = function () {
      switch (this.kind) {
        case 'N':
          return Ms(this.value)
        case 'E':
          return Us(this.error)
        case 'C':
          return Ts()
      }
      throw new Error('unexpected notification kind value')
    }),
    (t.createNext = function (e) {
      return void 0 !== e ? new t('N', e) : t.undefinedValueNotification
    }),
    (t.createError = function (e) {
      return new t('E', void 0, e)
    }),
    (t.createComplete = function () {
      return t.completeNotification
    }),
    (t.completeNotification = new t('C')),
    (t.undefinedValueNotification = new t('N', void 0)),
    t
  )
})()
var zs = (function () {
    function t(t, e) {
      void 0 === e && (e = 0), (this.scheduler = t), (this.delay = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new qs(t, this.scheduler, this.delay))
      }),
      t
    )
  })(),
  qs = (function (t) {
    function e(e, n, r) {
      void 0 === r && (r = 0)
      var i = t.call(this, e) || this
      return (i.scheduler = n), (i.delay = r), i
    }
    return (
      $u(e, t),
      (e.dispatch = function (t) {
        var e = t.notification,
          n = t.destination
        e.observe(n), this.unsubscribe()
      }),
      (e.prototype.scheduleMessage = function (t) {
        this.destination.add(
          this.scheduler.schedule(e.dispatch, this.delay, new Ws(t, this.destination))
        )
      }),
      (e.prototype._next = function (t) {
        this.scheduleMessage($s.createNext(t))
      }),
      (e.prototype._error = function (t) {
        this.scheduleMessage($s.createError(t)), this.unsubscribe()
      }),
      (e.prototype._complete = function () {
        this.scheduleMessage($s.createComplete()), this.unsubscribe()
      }),
      e
    )
  })(ts),
  Ws = (function () {
    return function (t, e) {
      ;(this.notification = t), (this.destination = e)
    }
  })(),
  Gs = (function (t) {
    function e(e, n, r) {
      void 0 === e && (e = Number.POSITIVE_INFINITY),
        void 0 === n && (n = Number.POSITIVE_INFINITY)
      var i = t.call(this) || this
      return (
        (i.scheduler = r),
        (i._events = []),
        (i._infiniteTimeWindow = !1),
        (i._bufferSize = e < 1 ? 1 : e),
        (i._windowTime = n < 1 ? 1 : n),
        n === Number.POSITIVE_INFINITY
          ? ((i._infiniteTimeWindow = !0), (i.next = i.nextInfiniteTimeWindow))
          : (i.next = i.nextTimeWindow),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype.nextInfiniteTimeWindow = function (e) {
        if (!this.isStopped) {
          var n = this._events
          n.push(e), n.length > this._bufferSize && n.shift()
        }
        t.prototype.next.call(this, e)
      }),
      (e.prototype.nextTimeWindow = function (e) {
        this.isStopped ||
          (this._events.push(new Ks(this._getNow(), e)), this._trimBufferThenGetEvents()),
          t.prototype.next.call(this, e)
      }),
      (e.prototype._subscribe = function (t) {
        var e,
          n = this._infiniteTimeWindow,
          r = n ? this._events : this._trimBufferThenGetEvents(),
          i = this.scheduler,
          o = r.length
        if (this.closed) throw new as()
        if (
          (this.isStopped || this.hasError
            ? (e = Ju.EMPTY)
            : (this.observers.push(t), (e = new fs(this, t))),
          i && t.add((t = new qs(t, i))),
          n)
        )
          for (var u = 0; u < o && !t.closed; u++) t.next(r[u])
        else for (u = 0; u < o && !t.closed; u++) t.next(r[u].value)
        return (
          this.hasError ? t.error(this.thrownError) : this.isStopped && t.complete(), e
        )
      }),
      (e.prototype._getNow = function () {
        return (this.scheduler || ks).now()
      }),
      (e.prototype._trimBufferThenGetEvents = function () {
        for (
          var t = this._getNow(),
            e = this._bufferSize,
            n = this._windowTime,
            r = this._events,
            i = r.length,
            o = 0;
          o < i && !(t - r[o].time < n);

        )
          o++
        return i > e && (o = Math.max(o, i - e)), o > 0 && r.splice(0, o), r
      }),
      e
    )
  })(hs),
  Ks = (function () {
    return function (t, e) {
      ;(this.time = t), (this.value = e)
    }
  })(),
  Ys = (function (t) {
    function e() {
      var e = (null !== t && t.apply(this, arguments)) || this
      return (e.value = null), (e.hasNext = !1), (e.hasCompleted = !1), e
    }
    return (
      $u(e, t),
      (e.prototype._subscribe = function (e) {
        return this.hasError
          ? (e.error(this.thrownError), Ju.EMPTY)
          : this.hasCompleted && this.hasNext
          ? (e.next(this.value), e.complete(), Ju.EMPTY)
          : t.prototype._subscribe.call(this, e)
      }),
      (e.prototype.next = function (t) {
        this.hasCompleted || ((this.value = t), (this.hasNext = !0))
      }),
      (e.prototype.error = function (e) {
        this.hasCompleted || t.prototype.error.call(this, e)
      }),
      (e.prototype.complete = function () {
        ;(this.hasCompleted = !0),
          this.hasNext && t.prototype.next.call(this, this.value),
          t.prototype.complete.call(this)
      }),
      e
    )
  })(hs),
  Hs = 1,
  Xs = (function () {
    return Promise.resolve()
  })(),
  Js = {}
function Zs(t) {
  return t in Js && (delete Js[t], !0)
}
var Qs = function (t) {
    var e = Hs++
    return (
      (Js[e] = !0),
      Xs.then(function () {
        return Zs(e) && t()
      }),
      e
    )
  },
  tc = function (t) {
    Zs(t)
  },
  ec = (function (t) {
    function e(e, n) {
      var r = t.call(this, e, n) || this
      return (r.scheduler = e), (r.work = n), r
    }
    return (
      $u(e, t),
      (e.prototype.requestAsyncId = function (e, n, r) {
        return (
          void 0 === r && (r = 0),
          null !== r && r > 0
            ? t.prototype.requestAsyncId.call(this, e, n, r)
            : (e.actions.push(this),
              e.scheduled || (e.scheduled = Qs(e.flush.bind(e, null))))
        )
      }),
      (e.prototype.recycleAsyncId = function (e, n, r) {
        if (
          (void 0 === r && (r = 0),
          (null !== r && r > 0) || (null === r && this.delay > 0))
        )
          return t.prototype.recycleAsyncId.call(this, e, n, r)
        0 === e.actions.length && (tc(n), (e.scheduled = void 0))
      }),
      e
    )
  })(Cs),
  nc = new ((function (t) {
    function e() {
      return (null !== t && t.apply(this, arguments)) || this
    }
    return (
      $u(e, t),
      (e.prototype.flush = function (t) {
        ;(this.active = !0), (this.scheduled = void 0)
        var e,
          n = this.actions,
          r = -1,
          i = n.length
        t = t || n.shift()
        do {
          if ((e = t.execute(t.state, t.delay))) break
        } while (++r < i && (t = n.shift()))
        if (((this.active = !1), e)) {
          for (; ++r < i && (t = n.shift()); ) t.unsubscribe()
          throw e
        }
      }),
      e
    )
  })(js))(ec),
  rc = nc,
  ic = new js(Cs),
  oc = ic,
  uc = (function (t) {
    function e(e, n) {
      var r = t.call(this, e, n) || this
      return (r.scheduler = e), (r.work = n), r
    }
    return (
      $u(e, t),
      (e.prototype.requestAsyncId = function (e, n, r) {
        return (
          void 0 === r && (r = 0),
          null !== r && r > 0
            ? t.prototype.requestAsyncId.call(this, e, n, r)
            : (e.actions.push(this),
              e.scheduled ||
                (e.scheduled = requestAnimationFrame(function () {
                  return e.flush(null)
                })))
        )
      }),
      (e.prototype.recycleAsyncId = function (e, n, r) {
        if (
          (void 0 === r && (r = 0),
          (null !== r && r > 0) || (null === r && this.delay > 0))
        )
          return t.prototype.recycleAsyncId.call(this, e, n, r)
        0 === e.actions.length && (cancelAnimationFrame(n), (e.scheduled = void 0))
      }),
      e
    )
  })(Cs),
  sc = new ((function (t) {
    function e() {
      return (null !== t && t.apply(this, arguments)) || this
    }
    return (
      $u(e, t),
      (e.prototype.flush = function (t) {
        ;(this.active = !0), (this.scheduled = void 0)
        var e,
          n = this.actions,
          r = -1,
          i = n.length
        t = t || n.shift()
        do {
          if ((e = t.execute(t.state, t.delay))) break
        } while (++r < i && (t = n.shift()))
        if (((this.active = !1), e)) {
          for (; ++r < i && (t = n.shift()); ) t.unsubscribe()
          throw e
        }
      }),
      e
    )
  })(js))(uc),
  cc = sc,
  ac = (function (t) {
    function e(e, n) {
      void 0 === e && (e = fc), void 0 === n && (n = Number.POSITIVE_INFINITY)
      var r =
        t.call(this, e, function () {
          return r.frame
        }) || this
      return (r.maxFrames = n), (r.frame = 0), (r.index = -1), r
    }
    return (
      $u(e, t),
      (e.prototype.flush = function () {
        for (
          var t, e, n = this.actions, r = this.maxFrames;
          (e = n[0]) &&
          e.delay <= r &&
          (n.shift(), (this.frame = e.delay), !(t = e.execute(e.state, e.delay)));

        );
        if (t) {
          for (; (e = n.shift()); ) e.unsubscribe()
          throw t
        }
      }),
      (e.frameTimeFactor = 10),
      e
    )
  })(js),
  fc = (function (t) {
    function e(e, n, r) {
      void 0 === r && (r = e.index += 1)
      var i = t.call(this, e, n) || this
      return (
        (i.scheduler = e),
        (i.work = n),
        (i.index = r),
        (i.active = !0),
        (i.index = e.index = r),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype.schedule = function (n, r) {
        if ((void 0 === r && (r = 0), !this.id))
          return t.prototype.schedule.call(this, n, r)
        this.active = !1
        var i = new e(this.scheduler, this.work)
        return this.add(i), i.schedule(n, r)
      }),
      (e.prototype.requestAsyncId = function (t, n, r) {
        void 0 === r && (r = 0), (this.delay = t.frame + r)
        var i = t.actions
        return i.push(this), i.sort(e.sortActions), !0
      }),
      (e.prototype.recycleAsyncId = function (t, e, n) {}),
      (e.prototype._execute = function (e, n) {
        if (!0 === this.active) return t.prototype._execute.call(this, e, n)
      }),
      (e.sortActions = function (t, e) {
        return t.delay === e.delay
          ? t.index === e.index
            ? 0
            : t.index > e.index
            ? 1
            : -1
          : t.delay > e.delay
          ? 1
          : -1
      }),
      e
    )
  })(Cs)
function lc() {}
var hc = (function () {
    function t() {
      return (
        Error.call(this),
        (this.message = 'argument out of range'),
        (this.name = 'ArgumentOutOfRangeError'),
        this
      )
    }
    return (t.prototype = Object.create(Error.prototype)), t
  })(),
  pc = (function () {
    function t() {
      return (
        Error.call(this),
        (this.message = 'no elements in sequence'),
        (this.name = 'EmptyError'),
        this
      )
    }
    return (t.prototype = Object.create(Error.prototype)), t
  })(),
  dc = (function () {
    function t() {
      return (
        Error.call(this),
        (this.message = 'Timeout has occurred'),
        (this.name = 'TimeoutError'),
        this
      )
    }
    return (t.prototype = Object.create(Error.prototype)), t
  })()
function vc(t, e) {
  return function (n) {
    if ('function' != typeof t)
      throw new TypeError('argument is not a function. Are you looking for `mapTo()`?')
    return n.lift(new yc(t, e))
  }
}
var yc = (function () {
    function t(t, e) {
      ;(this.project = t), (this.thisArg = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new bc(t, this.project, this.thisArg))
      }),
      t
    )
  })(),
  bc = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.project = n), (i.count = 0), (i.thisArg = r || i), i
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e
        try {
          e = this.project.call(this.thisArg, t, this.count++)
        } catch (t) {
          return void this.destination.error(t)
        }
        this.destination.next(e)
      }),
      e
    )
  })(ts)
function gc(t) {
  var e = this,
    n = t.args,
    r = t.subscriber,
    i = t.params,
    o = i.callbackFunc,
    u = i.context,
    s = i.scheduler,
    c = i.subject
  if (!c) {
    c = i.subject = new Ys()
    try {
      o.apply(
        u,
        n.concat([
          function () {
            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
            var r = t.length <= 1 ? t[0] : t
            e.add(s.schedule(mc, 0, { value: r, subject: c }))
          }
        ])
      )
    } catch (t) {
      c.error(t)
    }
  }
  this.add(c.subscribe(r))
}
function mc(t) {
  var e = t.value,
    n = t.subject
  n.next(e), n.complete()
}
function Dc(t) {
  var e = this,
    n = t.params,
    r = t.subscriber,
    i = t.context,
    o = n.callbackFunc,
    u = n.args,
    s = n.scheduler,
    c = n.subject
  if (!c) {
    c = n.subject = new Ys()
    try {
      o.apply(
        i,
        u.concat([
          function () {
            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
            var r = t.shift()
            if (r) e.add(s.schedule(_c, 0, { err: r, subject: c }))
            else {
              var i = t.length <= 1 ? t[0] : t
              e.add(s.schedule(wc, 0, { value: i, subject: c }))
            }
          }
        ])
      )
    } catch (t) {
      this.add(s.schedule(_c, 0, { err: t, subject: c }))
    }
  }
  this.add(c.subscribe(r))
}
function wc(t) {
  var e = t.value,
    n = t.subject
  n.next(e), n.complete()
}
function _c(t) {
  var e = t.err
  t.subject.error(e)
}
var Ec = (function (t) {
    function e() {
      return (null !== t && t.apply(this, arguments)) || this
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function (t, e, n, r, i) {
        this.destination.next(e)
      }),
      (e.prototype.notifyError = function (t, e) {
        this.destination.error(t)
      }),
      (e.prototype.notifyComplete = function (t) {
        this.destination.complete()
      }),
      e
    )
  })(ts),
  xc = (function (t) {
    function e(e, n, r) {
      var i = t.call(this) || this
      return (i.parent = e), (i.outerValue = n), (i.outerIndex = r), (i.index = 0), i
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.parent.notifyNext(this.outerValue, t, this.outerIndex, this.index++, this)
      }),
      (e.prototype._error = function (t) {
        this.parent.notifyError(t, this), this.unsubscribe()
      }),
      (e.prototype._complete = function () {
        this.parent.notifyComplete(this), this.unsubscribe()
      }),
      e
    )
  })(ts)
function Sc() {
  return 'function' == typeof Symbol && Symbol.iterator ? Symbol.iterator : '@@iterator'
}
var Cc = Sc(),
  Fc = function (t) {
    return t && 'number' == typeof t.length && 'function' != typeof t
  }
function Oc(t) {
  return !!t && 'function' != typeof t.subscribe && 'function' == typeof t.then
}
var jc = function (t) {
  if (t && 'function' == typeof t[rs])
    return (
      (r = t),
      function (t) {
        var e = r[rs]()
        if ('function' != typeof e.subscribe)
          throw new TypeError(
            'Provided object does not correctly implement Symbol.observable'
          )
        return e.subscribe(t)
      }
    )
  if (Fc(t)) return Ps(t)
  if (Oc(t))
    return (
      (n = t),
      function (t) {
        return (
          n
            .then(
              function (e) {
                t.closed || (t.next(e), t.complete())
              },
              function (e) {
                return t.error(e)
              }
            )
            .then(null, Gu),
          t
        )
      }
    )
  if (t && 'function' == typeof t[Cc])
    return (
      (e = t),
      function (t) {
        for (var n = e[Cc](); ; ) {
          var r = void 0
          try {
            r = n.next()
          } catch (e) {
            return t.error(e), t
          }
          if (r.done) {
            t.complete()
            break
          }
          if ((t.next(r.value), t.closed)) break
        }
        return (
          'function' == typeof n.return &&
            t.add(function () {
              n.return && n.return()
            }),
          t
        )
      }
    )
  var e,
    n,
    r,
    i = Hu(t) ? 'an invalid object' : "'" + t + "'"
  throw new TypeError(
    'You provided ' +
      i +
      ' where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.'
  )
}
function Ac(t, e, n, r, i) {
  if ((void 0 === i && (i = new xc(t, n, r)), !i.closed))
    return e instanceof ss ? e.subscribe(i) : jc(e)(i)
}
var kc = {}
var Ic = (function () {
    function t(t) {
      this.resultSelector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Tc(t, this.resultSelector))
      }),
      t
    )
  })(),
  Tc = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (
        (r.resultSelector = n), (r.active = 0), (r.values = []), (r.observables = []), r
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.values.push(kc), this.observables.push(t)
      }),
      (e.prototype._complete = function () {
        var t = this.observables,
          e = t.length
        if (0 === e) this.destination.complete()
        else {
          ;(this.active = e), (this.toRespond = e)
          for (var n = 0; n < e; n++) {
            var r = t[n]
            this.add(Ac(this, r, void 0, n))
          }
        }
      }),
      (e.prototype.notifyComplete = function (t) {
        0 == (this.active -= 1) && this.destination.complete()
      }),
      (e.prototype.notifyNext = function (t, e, n) {
        var r = this.values,
          i = r[n],
          o = this.toRespond ? (i === kc ? --this.toRespond : this.toRespond) : 0
        ;(r[n] = e),
          0 === o &&
            (this.resultSelector
              ? this._tryResultSelector(r)
              : this.destination.next(r.slice()))
      }),
      (e.prototype._tryResultSelector = function (t) {
        var e
        try {
          e = this.resultSelector.apply(this, t)
        } catch (t) {
          return void this.destination.error(t)
        }
        this.destination.next(e)
      }),
      e
    )
  })(Ec)
function Nc(t, e) {
  if (null != t) {
    if (
      (function (t) {
        return t && 'function' == typeof t[rs]
      })(t)
    )
      return (function (t, e) {
        return new ss(function (n) {
          var r = new Ju()
          return (
            r.add(
              e.schedule(function () {
                var i = t[rs]()
                r.add(
                  i.subscribe({
                    next: function (t) {
                      r.add(
                        e.schedule(function () {
                          return n.next(t)
                        })
                      )
                    },
                    error: function (t) {
                      r.add(
                        e.schedule(function () {
                          return n.error(t)
                        })
                      )
                    },
                    complete: function () {
                      r.add(
                        e.schedule(function () {
                          return n.complete()
                        })
                      )
                    }
                  })
                )
              })
            ),
            r
          )
        })
      })(t, e)
    if (Oc(t))
      return (function (t, e) {
        return new ss(function (n) {
          var r = new Ju()
          return (
            r.add(
              e.schedule(function () {
                return t.then(
                  function (t) {
                    r.add(
                      e.schedule(function () {
                        n.next(t),
                          r.add(
                            e.schedule(function () {
                              return n.complete()
                            })
                          )
                      })
                    )
                  },
                  function (t) {
                    r.add(
                      e.schedule(function () {
                        return n.error(t)
                      })
                    )
                  }
                )
              })
            ),
            r
          )
        })
      })(t, e)
    if (Fc(t)) return Rs(t, e)
    if (
      (function (t) {
        return t && 'function' == typeof t[Cc]
      })(t) ||
      'string' == typeof t
    )
      return (function (t, e) {
        if (!t) throw new Error('Iterable cannot be null')
        return new ss(function (n) {
          var r,
            i = new Ju()
          return (
            i.add(function () {
              r && 'function' == typeof r.return && r.return()
            }),
            i.add(
              e.schedule(function () {
                ;(r = t[Cc]()),
                  i.add(
                    e.schedule(function () {
                      if (!n.closed) {
                        var t, e
                        try {
                          var i = r.next()
                          ;(t = i.value), (e = i.done)
                        } catch (t) {
                          return void n.error(t)
                        }
                        e ? n.complete() : (n.next(t), this.schedule())
                      }
                    })
                  )
              })
            ),
            i
          )
        })
      })(t, e)
  }
  throw new TypeError(((null !== t && typeof t) || t) + ' is not observable')
}
function Bc(t, e) {
  return e ? Nc(t, e) : t instanceof ss ? t : new ss(jc(t))
}
var Pc = (function (t) {
    function e(e) {
      var n = t.call(this) || this
      return (n.parent = e), n
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.parent.notifyNext(t)
      }),
      (e.prototype._error = function (t) {
        this.parent.notifyError(t), this.unsubscribe()
      }),
      (e.prototype._complete = function () {
        this.parent.notifyComplete(), this.unsubscribe()
      }),
      e
    )
  })(ts),
  Rc = (function (t) {
    function e() {
      return (null !== t && t.apply(this, arguments)) || this
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function (t) {
        this.destination.next(t)
      }),
      (e.prototype.notifyError = function (t) {
        this.destination.error(t)
      }),
      (e.prototype.notifyComplete = function () {
        this.destination.complete()
      }),
      e
    )
  })(ts)
function Lc(t, e) {
  if (!e.closed) {
    if (t instanceof ss) return t.subscribe(e)
    var n
    try {
      n = jc(t)(e)
    } catch (t) {
      e.error(t)
    }
    return n
  }
}
function Mc(t, e, n) {
  return (
    void 0 === n && (n = Number.POSITIVE_INFINITY),
    'function' == typeof e
      ? function (r) {
          return r.pipe(
            Mc(function (n, r) {
              return Bc(t(n, r)).pipe(
                vc(function (t, i) {
                  return e(n, t, r, i)
                })
              )
            }, n)
          )
        }
      : ('number' == typeof e && (n = e),
        function (e) {
          return e.lift(new Uc(t, n))
        })
  )
}
var Uc = (function () {
    function t(t, e) {
      void 0 === e && (e = Number.POSITIVE_INFINITY),
        (this.project = t),
        (this.concurrent = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Vc(t, this.project, this.concurrent))
      }),
      t
    )
  })(),
  Vc = (function (t) {
    function e(e, n, r) {
      void 0 === r && (r = Number.POSITIVE_INFINITY)
      var i = t.call(this, e) || this
      return (
        (i.project = n),
        (i.concurrent = r),
        (i.hasCompleted = !1),
        (i.buffer = []),
        (i.active = 0),
        (i.index = 0),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.active < this.concurrent ? this._tryNext(t) : this.buffer.push(t)
      }),
      (e.prototype._tryNext = function (t) {
        var e,
          n = this.index++
        try {
          e = this.project(t, n)
        } catch (t) {
          return void this.destination.error(t)
        }
        this.active++, this._innerSub(e)
      }),
      (e.prototype._innerSub = function (t) {
        var e = new Pc(this),
          n = this.destination
        n.add(e)
        var r = Lc(t, e)
        r !== e && n.add(r)
      }),
      (e.prototype._complete = function () {
        ;(this.hasCompleted = !0),
          0 === this.active && 0 === this.buffer.length && this.destination.complete(),
          this.unsubscribe()
      }),
      (e.prototype.notifyNext = function (t) {
        this.destination.next(t)
      }),
      (e.prototype.notifyComplete = function () {
        var t = this.buffer
        this.active--,
          t.length > 0
            ? this._next(t.shift())
            : 0 === this.active && this.hasCompleted && this.destination.complete()
      }),
      e
    )
  })(Rc),
  $c = Mc
function zc(t) {
  return void 0 === t && (t = Number.POSITIVE_INFINITY), Mc(is, t)
}
function qc() {
  return zc(1)
}
function Wc() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
  return qc()(Ms.apply(void 0, t))
}
function Gc(t) {
  return new ss(function (e) {
    var n
    try {
      n = t()
    } catch (t) {
      return void e.error(t)
    }
    return (n ? Bc(n) : Ts()).subscribe(e)
  })
}
function Kc(t, e) {
  return new ss(function (n) {
    var r = t.length
    if (0 !== r)
      for (
        var i = new Array(r),
          o = 0,
          u = 0,
          s = function (s) {
            var c = Bc(t[s]),
              a = !1
            n.add(
              c.subscribe({
                next: function (t) {
                  a || ((a = !0), u++), (i[s] = t)
                },
                error: function (t) {
                  return n.error(t)
                },
                complete: function () {
                  ;(++o !== r && a) ||
                    (u === r &&
                      n.next(
                        e
                          ? e.reduce(function (t, e, n) {
                              return (t[e] = i[n]), t
                            }, {})
                          : i
                      ),
                    n.complete())
                }
              })
            )
          },
          c = 0;
        c < r;
        c++
      )
        s(c)
    else n.complete()
  })
}
function Yc(t, e, n, r, i) {
  var o
  if (
    (function (t) {
      return (
        t &&
        'function' == typeof t.addEventListener &&
        'function' == typeof t.removeEventListener
      )
    })(t)
  ) {
    var u = t
    t.addEventListener(e, n, i),
      (o = function () {
        return u.removeEventListener(e, n, i)
      })
  } else if (
    (function (t) {
      return t && 'function' == typeof t.on && 'function' == typeof t.off
    })(t)
  ) {
    var s = t
    t.on(e, n),
      (o = function () {
        return s.off(e, n)
      })
  } else if (
    (function (t) {
      return (
        t && 'function' == typeof t.addListener && 'function' == typeof t.removeListener
      )
    })(t)
  ) {
    var c = t
    t.addListener(e, n),
      (o = function () {
        return c.removeListener(e, n)
      })
  } else {
    if (!t || !t.length) throw new TypeError('Invalid event target')
    for (var a = 0, f = t.length; a < f; a++) Yc(t[a], e, n, r, i)
  }
  r.add(o)
}
function Hc(t) {
  var e = t.subscriber,
    n = t.condition
  if (!e.closed) {
    if (t.needIterate)
      try {
        t.state = t.iterate(t.state)
      } catch (t) {
        return void e.error(t)
      }
    else t.needIterate = !0
    if (n) {
      var r = void 0
      try {
        r = n(t.state)
      } catch (t) {
        return void e.error(t)
      }
      if (!r) return void e.complete()
      if (e.closed) return
    }
    var i
    try {
      i = t.resultSelector(t.state)
    } catch (t) {
      return void e.error(t)
    }
    if (!e.closed && (e.next(i), !e.closed)) return this.schedule(t)
  }
}
function Xc(t) {
  return !Yu(t) && t - parseFloat(t) + 1 >= 0
}
function Jc(t) {
  var e = t.subscriber,
    n = t.counter,
    r = t.period
  e.next(n), this.schedule({ subscriber: e, counter: n + 1, period: r }, r)
}
function Zc() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
  var n = Number.POSITIVE_INFINITY,
    r = null,
    i = t[t.length - 1]
  return (
    Ns(i)
      ? ((r = t.pop()),
        t.length > 1 && 'number' == typeof t[t.length - 1] && (n = t.pop()))
      : 'number' == typeof i && (n = t.pop()),
    null === r && 1 === t.length && t[0] instanceof ss ? t[0] : zc(n)(Ls(t, r))
  )
}
var Qc = new ss(lc)
function ta(t) {
  var e = t.keys,
    n = t.index,
    r = t.subscriber,
    i = t.subscription,
    o = t.obj
  if (!r.closed)
    if (n < e.length) {
      var u = e[n]
      r.next([u, o[u]]),
        i.add(
          this.schedule({ keys: e, index: n + 1, subscriber: r, subscription: i, obj: o })
        )
    } else r.complete()
}
function ea(t, e) {
  function n() {
    return !n.pred.apply(n.thisArg, arguments)
  }
  return (n.pred = t), (n.thisArg = e), n
}
function na(t, e) {
  return function (n) {
    return n.lift(new ra(t, e))
  }
}
var ra = (function () {
    function t(t, e) {
      ;(this.predicate = t), (this.thisArg = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new ia(t, this.predicate, this.thisArg))
      }),
      t
    )
  })(),
  ia = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.predicate = n), (i.thisArg = r), (i.count = 0), i
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e
        try {
          e = this.predicate.call(this.thisArg, t, this.count++)
        } catch (t) {
          return void this.destination.error(t)
        }
        e && this.destination.next(t)
      }),
      e
    )
  })(ts)
function oa() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
  if (1 === t.length) {
    if (!Yu(t[0])) return t[0]
    t = t[0]
  }
  return Ls(t, void 0).lift(new ua())
}
var ua = (function () {
    function t() {}
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new sa(t))
      }),
      t
    )
  })(),
  sa = (function (t) {
    function e(e) {
      var n = t.call(this, e) || this
      return (n.hasFirst = !1), (n.observables = []), (n.subscriptions = []), n
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.observables.push(t)
      }),
      (e.prototype._complete = function () {
        var t = this.observables,
          e = t.length
        if (0 === e) this.destination.complete()
        else {
          for (var n = 0; n < e && !this.hasFirst; n++) {
            var r = Ac(this, t[n], void 0, n)
            this.subscriptions && this.subscriptions.push(r), this.add(r)
          }
          this.observables = null
        }
      }),
      (e.prototype.notifyNext = function (t, e, n) {
        if (!this.hasFirst) {
          this.hasFirst = !0
          for (var r = 0; r < this.subscriptions.length; r++)
            if (r !== n) {
              var i = this.subscriptions[r]
              i.unsubscribe(), this.remove(i)
            }
          this.subscriptions = null
        }
        this.destination.next(e)
      }),
      e
    )
  })(Ec)
function ca(t) {
  var e = t.start,
    n = t.index,
    r = t.count,
    i = t.subscriber
  n >= r
    ? i.complete()
    : (i.next(e), i.closed || ((t.index = n + 1), (t.start = e + 1), this.schedule(t)))
}
function aa(t, e, n) {
  void 0 === t && (t = 0)
  var r = -1
  return (
    Xc(e) ? (r = Number(e) < 1 ? 1 : Number(e)) : Ns(e) && (n = e),
    Ns(n) || (n = oc),
    new ss(function (e) {
      var i = Xc(t) ? t : +t - n.now()
      return n.schedule(fa, i, { index: 0, period: r, subscriber: e })
    })
  )
}
function fa(t) {
  var e = t.index,
    n = t.period,
    r = t.subscriber
  if ((r.next(e), !r.closed)) {
    if (-1 === n) return r.complete()
    ;(t.index = e + 1), this.schedule(t, n)
  }
}
function la() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
  var n = t[t.length - 1]
  return 'function' == typeof n && t.pop(), Ls(t, void 0).lift(new ha(n))
}
var ha = (function () {
    function t(t) {
      this.resultSelector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new pa(t, this.resultSelector))
      }),
      t
    )
  })(),
  pa = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.resultSelector = n),
        (i.iterators = []),
        (i.active = 0),
        (i.resultSelector = 'function' == typeof n ? n : void 0),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this.iterators
        Yu(t)
          ? e.push(new va(t))
          : 'function' == typeof t[Cc]
          ? e.push(new da(t[Cc]()))
          : e.push(new ya(this.destination, this, t))
      }),
      (e.prototype._complete = function () {
        var t = this.iterators,
          e = t.length
        if ((this.unsubscribe(), 0 !== e)) {
          this.active = e
          for (var n = 0; n < e; n++) {
            var r = t[n]
            if (r.stillUnsubscribed) this.destination.add(r.subscribe())
            else this.active--
          }
        } else this.destination.complete()
      }),
      (e.prototype.notifyInactive = function () {
        this.active--, 0 === this.active && this.destination.complete()
      }),
      (e.prototype.checkIterators = function () {
        for (
          var t = this.iterators, e = t.length, n = this.destination, r = 0;
          r < e;
          r++
        ) {
          if ('function' == typeof (u = t[r]).hasValue && !u.hasValue()) return
        }
        var i = !1,
          o = []
        for (r = 0; r < e; r++) {
          var u,
            s = (u = t[r]).next()
          if ((u.hasCompleted() && (i = !0), s.done)) return void n.complete()
          o.push(s.value)
        }
        this.resultSelector ? this._tryresultSelector(o) : n.next(o), i && n.complete()
      }),
      (e.prototype._tryresultSelector = function (t) {
        var e
        try {
          e = this.resultSelector.apply(this, t)
        } catch (t) {
          return void this.destination.error(t)
        }
        this.destination.next(e)
      }),
      e
    )
  })(ts),
  da = (function () {
    function t(t) {
      ;(this.iterator = t), (this.nextResult = t.next())
    }
    return (
      (t.prototype.hasValue = function () {
        return !0
      }),
      (t.prototype.next = function () {
        var t = this.nextResult
        return (this.nextResult = this.iterator.next()), t
      }),
      (t.prototype.hasCompleted = function () {
        var t = this.nextResult
        return Boolean(t && t.done)
      }),
      t
    )
  })(),
  va = (function () {
    function t(t) {
      ;(this.array = t), (this.index = 0), (this.length = 0), (this.length = t.length)
    }
    return (
      (t.prototype[Cc] = function () {
        return this
      }),
      (t.prototype.next = function (t) {
        var e = this.index++,
          n = this.array
        return e < this.length ? { value: n[e], done: !1 } : { value: null, done: !0 }
      }),
      (t.prototype.hasValue = function () {
        return this.array.length > this.index
      }),
      (t.prototype.hasCompleted = function () {
        return this.array.length === this.index
      }),
      t
    )
  })(),
  ya = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.parent = n),
        (i.observable = r),
        (i.stillUnsubscribed = !0),
        (i.buffer = []),
        (i.isComplete = !1),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype[Cc] = function () {
        return this
      }),
      (e.prototype.next = function () {
        var t = this.buffer
        return 0 === t.length && this.isComplete
          ? { value: null, done: !0 }
          : { value: t.shift(), done: !1 }
      }),
      (e.prototype.hasValue = function () {
        return this.buffer.length > 0
      }),
      (e.prototype.hasCompleted = function () {
        return 0 === this.buffer.length && this.isComplete
      }),
      (e.prototype.notifyComplete = function () {
        this.buffer.length > 0
          ? ((this.isComplete = !0), this.parent.notifyInactive())
          : this.destination.complete()
      }),
      (e.prototype.notifyNext = function (t) {
        this.buffer.push(t), this.parent.checkIterators()
      }),
      (e.prototype.subscribe = function () {
        return Lc(this.observable, new Pc(this))
      }),
      e
    )
  })(Rc),
  ba = Object.freeze({
    __proto__: null,
    Observable: ss,
    ConnectableObservable: bs,
    GroupedObservable: Es,
    observable: rs,
    Subject: hs,
    BehaviorSubject: Ss,
    ReplaySubject: Gs,
    AsyncSubject: Ys,
    asap: rc,
    asapScheduler: nc,
    async: oc,
    asyncScheduler: ic,
    queue: ks,
    queueScheduler: As,
    animationFrame: cc,
    animationFrameScheduler: sc,
    VirtualTimeScheduler: ac,
    VirtualAction: fc,
    Scheduler: Os,
    Subscription: Ju,
    Subscriber: ts,
    Notification: $s,
    get NotificationKind() {
      return Bs
    },
    pipe: os,
    noop: lc,
    identity: is,
    isObservable: function (t) {
      return (
        !!t &&
        (t instanceof ss ||
          ('function' == typeof t.lift && 'function' == typeof t.subscribe))
      )
    },
    ArgumentOutOfRangeError: hc,
    EmptyError: pc,
    ObjectUnsubscribedError: as,
    UnsubscriptionError: Xu,
    TimeoutError: dc,
    bindCallback: function t(e, n, r) {
      if (n) {
        if (!Ns(n))
          return function () {
            for (var i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o]
            return t(e, r)
              .apply(void 0, i)
              .pipe(
                vc(function (t) {
                  return Yu(t) ? n.apply(void 0, t) : n(t)
                })
              )
          }
        r = n
      }
      return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
        var i,
          o = this,
          u = { context: o, subject: i, callbackFunc: e, scheduler: r }
        return new ss(function (n) {
          if (r) {
            var s = { args: t, subscriber: n, params: u }
            return r.schedule(gc, 0, s)
          }
          if (!i) {
            i = new Ys()
            try {
              e.apply(
                o,
                t.concat([
                  function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
                    i.next(t.length <= 1 ? t[0] : t), i.complete()
                  }
                ])
              )
            } catch (t) {
              ns(i) ? i.error(t) : console.warn(t)
            }
          }
          return i.subscribe(n)
        })
      }
    },
    bindNodeCallback: function t(e, n, r) {
      if (n) {
        if (!Ns(n))
          return function () {
            for (var i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o]
            return t(e, r)
              .apply(void 0, i)
              .pipe(
                vc(function (t) {
                  return Yu(t) ? n.apply(void 0, t) : n(t)
                })
              )
          }
        r = n
      }
      return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
        var i = { subject: void 0, args: t, callbackFunc: e, scheduler: r, context: this }
        return new ss(function (n) {
          var o = i.context,
            u = i.subject
          if (r) return r.schedule(Dc, 0, { params: i, subscriber: n, context: o })
          if (!u) {
            u = i.subject = new Ys()
            try {
              e.apply(
                o,
                t.concat([
                  function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
                    var n = t.shift()
                    n ? u.error(n) : (u.next(t.length <= 1 ? t[0] : t), u.complete())
                  }
                ])
              )
            } catch (t) {
              ns(u) ? u.error(t) : console.warn(t)
            }
          }
          return u.subscribe(n)
        })
      }
    },
    combineLatest: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      var n = void 0,
        r = void 0
      return (
        Ns(t[t.length - 1]) && (r = t.pop()),
        'function' == typeof t[t.length - 1] && (n = t.pop()),
        1 === t.length && Yu(t[0]) && (t = t[0]),
        Ls(t, r).lift(new Ic(n))
      )
    },
    concat: Wc,
    defer: Gc,
    empty: Ts,
    forkJoin: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      if (1 === t.length) {
        var n = t[0]
        if (Yu(n)) return Kc(n, null)
        if (Hu(n) && Object.getPrototypeOf(n) === Object.prototype) {
          var r = Object.keys(n)
          return Kc(
            r.map(function (t) {
              return n[t]
            }),
            r
          )
        }
      }
      if ('function' == typeof t[t.length - 1]) {
        var i = t.pop()
        return Kc((t = 1 === t.length && Yu(t[0]) ? t[0] : t), null).pipe(
          vc(function (t) {
            return i.apply(void 0, t)
          })
        )
      }
      return Kc(t, null)
    },
    from: Bc,
    fromEvent: function t(e, n, r, i) {
      return (
        zu(r) && ((i = r), (r = void 0)),
        i
          ? t(e, n, r).pipe(
              vc(function (t) {
                return Yu(t) ? i.apply(void 0, t) : i(t)
              })
            )
          : new ss(function (t) {
              Yc(
                e,
                n,
                function (e) {
                  arguments.length > 1
                    ? t.next(Array.prototype.slice.call(arguments))
                    : t.next(e)
                },
                t,
                r
              )
            })
      )
    },
    fromEventPattern: function t(e, n, r) {
      return r
        ? t(e, n).pipe(
            vc(function (t) {
              return Yu(t) ? r.apply(void 0, t) : r(t)
            })
          )
        : new ss(function (t) {
            var r,
              i = function () {
                for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n]
                return t.next(1 === e.length ? e[0] : e)
              }
            try {
              r = e(i)
            } catch (e) {
              return void t.error(e)
            }
            if (zu(n))
              return function () {
                return n(i, r)
              }
          })
    },
    generate: function (t, e, n, r, i) {
      var o, u
      if (1 == arguments.length) {
        var s = t
        ;(u = s.initialState),
          (e = s.condition),
          (n = s.iterate),
          (o = s.resultSelector || is),
          (i = s.scheduler)
      } else void 0 === r || Ns(r) ? ((u = t), (o = is), (i = r)) : ((u = t), (o = r))
      return new ss(function (t) {
        var r = u
        if (i)
          return i.schedule(Hc, 0, {
            subscriber: t,
            iterate: n,
            condition: e,
            resultSelector: o,
            state: r
          })
        for (;;) {
          if (e) {
            var s = void 0
            try {
              s = e(r)
            } catch (e) {
              return void t.error(e)
            }
            if (!s) {
              t.complete()
              break
            }
          }
          var c = void 0
          try {
            c = o(r)
          } catch (e) {
            return void t.error(e)
          }
          if ((t.next(c), t.closed)) break
          try {
            r = n(r)
          } catch (e) {
            return void t.error(e)
          }
        }
      })
    },
    iif: function (t, e, n) {
      return (
        void 0 === e && (e = Is),
        void 0 === n && (n = Is),
        Gc(function () {
          return t() ? e : n
        })
      )
    },
    interval: function (t, e) {
      return (
        void 0 === t && (t = 0),
        void 0 === e && (e = oc),
        (!Xc(t) || t < 0) && (t = 0),
        (e && 'function' == typeof e.schedule) || (e = oc),
        new ss(function (n) {
          return n.add(e.schedule(Jc, t, { subscriber: n, counter: 0, period: t })), n
        })
      )
    },
    merge: Zc,
    never: function () {
      return Qc
    },
    of: Ms,
    onErrorResumeNext: function t() {
      for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n]
      if (0 === e.length) return Is
      var r = e[0],
        i = e.slice(1)
      return 1 === e.length && Yu(r)
        ? t.apply(void 0, r)
        : new ss(function (e) {
            var n = function () {
              return e.add(t.apply(void 0, i).subscribe(e))
            }
            return Bc(r).subscribe({
              next: function (t) {
                e.next(t)
              },
              error: n,
              complete: n
            })
          })
    },
    pairs: function (t, e) {
      return new ss(
        e
          ? function (n) {
              var r = Object.keys(t),
                i = new Ju()
              return (
                i.add(
                  e.schedule(ta, 0, {
                    keys: r,
                    index: 0,
                    subscriber: n,
                    subscription: i,
                    obj: t
                  })
                ),
                i
              )
            }
          : function (e) {
              for (var n = Object.keys(t), r = 0; r < n.length && !e.closed; r++) {
                var i = n[r]
                t.hasOwnProperty(i) && e.next([i, t[i]])
              }
              e.complete()
            }
      )
    },
    partition: function (t, e, n) {
      return [na(e, n)(new ss(jc(t))), na(ea(e, n))(new ss(jc(t)))]
    },
    race: oa,
    range: function (t, e, n) {
      return (
        void 0 === t && (t = 0),
        new ss(function (r) {
          void 0 === e && ((e = t), (t = 0))
          var i = 0,
            o = t
          if (n) return n.schedule(ca, 0, { index: i, count: e, start: t, subscriber: r })
          for (;;) {
            if (i++ >= e) {
              r.complete()
              break
            }
            if ((r.next(o++), r.closed)) break
          }
        })
      )
    },
    throwError: Us,
    timer: aa,
    using: function (t, e) {
      return new ss(function (n) {
        var r, i
        try {
          r = t()
        } catch (t) {
          return void n.error(t)
        }
        try {
          i = e(r)
        } catch (t) {
          return void n.error(t)
        }
        var o = (i ? Bc(i) : Is).subscribe(n)
        return function () {
          o.unsubscribe(), r && r.unsubscribe()
        }
      })
    },
    zip: la,
    scheduled: Nc,
    EMPTY: Is,
    NEVER: Qc,
    config: Wu
  })
function ga(t) {
  return function (e) {
    return e.lift(new ma(t))
  }
}
var ma = (function () {
    function t(t) {
      this.durationSelector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Da(t, this.durationSelector))
      }),
      t
    )
  })(),
  Da = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.durationSelector = n), (r.hasValue = !1), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        if (((this.value = t), (this.hasValue = !0), !this.throttled)) {
          var e = void 0
          try {
            e = (0, this.durationSelector)(t)
          } catch (t) {
            return this.destination.error(t)
          }
          var n = Lc(e, new Pc(this))
          !n || n.closed ? this.clearThrottle() : this.add((this.throttled = n))
        }
      }),
      (e.prototype.clearThrottle = function () {
        var t = this,
          e = t.value,
          n = t.hasValue,
          r = t.throttled
        r && (this.remove(r), (this.throttled = void 0), r.unsubscribe()),
          n && ((this.value = void 0), (this.hasValue = !1), this.destination.next(e))
      }),
      (e.prototype.notifyNext = function () {
        this.clearThrottle()
      }),
      (e.prototype.notifyComplete = function () {
        this.clearThrottle()
      }),
      e
    )
  })(Rc)
var wa = (function () {
    function t(t) {
      this.closingNotifier = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new _a(t, this.closingNotifier))
      }),
      t
    )
  })(),
  _a = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.buffer = []), r.add(Lc(n, new Pc(r))), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.buffer.push(t)
      }),
      (e.prototype.notifyNext = function () {
        var t = this.buffer
        ;(this.buffer = []), this.destination.next(t)
      }),
      e
    )
  })(Rc)
var Ea = (function () {
    function t(t, e) {
      ;(this.bufferSize = t),
        (this.startBufferEvery = e),
        (this.subscriberClass = e && t !== e ? Sa : xa)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(
          new this.subscriberClass(t, this.bufferSize, this.startBufferEvery)
        )
      }),
      t
    )
  })(),
  xa = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.bufferSize = n), (r.buffer = []), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this.buffer
        e.push(t),
          e.length == this.bufferSize && (this.destination.next(e), (this.buffer = []))
      }),
      (e.prototype._complete = function () {
        var e = this.buffer
        e.length > 0 && this.destination.next(e), t.prototype._complete.call(this)
      }),
      e
    )
  })(ts),
  Sa = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.bufferSize = n), (i.startBufferEvery = r), (i.buffers = []), (i.count = 0), i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this,
          n = e.bufferSize,
          r = e.startBufferEvery,
          i = e.buffers,
          o = e.count
        this.count++, o % r == 0 && i.push([])
        for (var u = i.length; u--; ) {
          var s = i[u]
          s.push(t), s.length === n && (i.splice(u, 1), this.destination.next(s))
        }
      }),
      (e.prototype._complete = function () {
        for (var e = this.buffers, n = this.destination; e.length > 0; ) {
          var r = e.shift()
          r.length > 0 && n.next(r)
        }
        t.prototype._complete.call(this)
      }),
      e
    )
  })(ts)
var Ca = (function () {
    function t(t, e, n, r) {
      ;(this.bufferTimeSpan = t),
        (this.bufferCreationInterval = e),
        (this.maxBufferSize = n),
        (this.scheduler = r)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(
          new Oa(
            t,
            this.bufferTimeSpan,
            this.bufferCreationInterval,
            this.maxBufferSize,
            this.scheduler
          )
        )
      }),
      t
    )
  })(),
  Fa = (function () {
    return function () {
      this.buffer = []
    }
  })(),
  Oa = (function (t) {
    function e(e, n, r, i, o) {
      var u = t.call(this, e) || this
      ;(u.bufferTimeSpan = n),
        (u.bufferCreationInterval = r),
        (u.maxBufferSize = i),
        (u.scheduler = o),
        (u.contexts = [])
      var s = u.openContext()
      if (((u.timespanOnly = null == r || r < 0), u.timespanOnly)) {
        var c = { subscriber: u, context: s, bufferTimeSpan: n }
        u.add((s.closeAction = o.schedule(ja, n, c)))
      } else {
        var a = { subscriber: u, context: s },
          f = {
            bufferTimeSpan: n,
            bufferCreationInterval: r,
            subscriber: u,
            scheduler: o
          }
        u.add((s.closeAction = o.schedule(ka, n, a))), u.add(o.schedule(Aa, r, f))
      }
      return u
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        for (var e, n = this.contexts, r = n.length, i = 0; i < r; i++) {
          var o = n[i],
            u = o.buffer
          u.push(t), u.length == this.maxBufferSize && (e = o)
        }
        e && this.onBufferFull(e)
      }),
      (e.prototype._error = function (e) {
        ;(this.contexts.length = 0), t.prototype._error.call(this, e)
      }),
      (e.prototype._complete = function () {
        for (var e = this.contexts, n = this.destination; e.length > 0; ) {
          var r = e.shift()
          n.next(r.buffer)
        }
        t.prototype._complete.call(this)
      }),
      (e.prototype._unsubscribe = function () {
        this.contexts = null
      }),
      (e.prototype.onBufferFull = function (t) {
        this.closeContext(t)
        var e = t.closeAction
        if ((e.unsubscribe(), this.remove(e), !this.closed && this.timespanOnly)) {
          t = this.openContext()
          var n = this.bufferTimeSpan,
            r = { subscriber: this, context: t, bufferTimeSpan: n }
          this.add((t.closeAction = this.scheduler.schedule(ja, n, r)))
        }
      }),
      (e.prototype.openContext = function () {
        var t = new Fa()
        return this.contexts.push(t), t
      }),
      (e.prototype.closeContext = function (t) {
        this.destination.next(t.buffer)
        var e = this.contexts
        ;(e ? e.indexOf(t) : -1) >= 0 && e.splice(e.indexOf(t), 1)
      }),
      e
    )
  })(ts)
function ja(t) {
  var e = t.subscriber,
    n = t.context
  n && e.closeContext(n),
    e.closed ||
      ((t.context = e.openContext()),
      (t.context.closeAction = this.schedule(t, t.bufferTimeSpan)))
}
function Aa(t) {
  var e = t.bufferCreationInterval,
    n = t.bufferTimeSpan,
    r = t.subscriber,
    i = t.scheduler,
    o = r.openContext()
  r.closed ||
    (r.add((o.closeAction = i.schedule(ka, n, { subscriber: r, context: o }))),
    this.schedule(t, e))
}
function ka(t) {
  var e = t.subscriber,
    n = t.context
  e.closeContext(n)
}
var Ia = (function () {
    function t(t, e) {
      ;(this.openings = t), (this.closingSelector = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ta(t, this.openings, this.closingSelector))
      }),
      t
    )
  })(),
  Ta = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.closingSelector = r), (i.contexts = []), i.add(Ac(i, n)), i
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        for (var e = this.contexts, n = e.length, r = 0; r < n; r++) e[r].buffer.push(t)
      }),
      (e.prototype._error = function (e) {
        for (var n = this.contexts; n.length > 0; ) {
          var r = n.shift()
          r.subscription.unsubscribe(), (r.buffer = null), (r.subscription = null)
        }
        ;(this.contexts = null), t.prototype._error.call(this, e)
      }),
      (e.prototype._complete = function () {
        for (var e = this.contexts; e.length > 0; ) {
          var n = e.shift()
          this.destination.next(n.buffer),
            n.subscription.unsubscribe(),
            (n.buffer = null),
            (n.subscription = null)
        }
        ;(this.contexts = null), t.prototype._complete.call(this)
      }),
      (e.prototype.notifyNext = function (t, e) {
        t ? this.closeBuffer(t) : this.openBuffer(e)
      }),
      (e.prototype.notifyComplete = function (t) {
        this.closeBuffer(t.context)
      }),
      (e.prototype.openBuffer = function (t) {
        try {
          var e = this.closingSelector.call(this, t)
          e && this.trySubscribe(e)
        } catch (t) {
          this._error(t)
        }
      }),
      (e.prototype.closeBuffer = function (t) {
        var e = this.contexts
        if (e && t) {
          var n = t.buffer,
            r = t.subscription
          this.destination.next(n),
            e.splice(e.indexOf(t), 1),
            this.remove(r),
            r.unsubscribe()
        }
      }),
      (e.prototype.trySubscribe = function (t) {
        var e = this.contexts,
          n = new Ju(),
          r = { buffer: [], subscription: n }
        e.push(r)
        var i = Ac(this, t, r)
        !i || i.closed ? this.closeBuffer(r) : ((i.context = r), this.add(i), n.add(i))
      }),
      e
    )
  })(Ec)
var Na = (function () {
    function t(t) {
      this.closingSelector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ba(t, this.closingSelector))
      }),
      t
    )
  })(),
  Ba = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.closingSelector = n), (r.subscribing = !1), r.openBuffer(), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.buffer.push(t)
      }),
      (e.prototype._complete = function () {
        var e = this.buffer
        e && this.destination.next(e), t.prototype._complete.call(this)
      }),
      (e.prototype._unsubscribe = function () {
        ;(this.buffer = void 0), (this.subscribing = !1)
      }),
      (e.prototype.notifyNext = function () {
        this.openBuffer()
      }),
      (e.prototype.notifyComplete = function () {
        this.subscribing ? this.complete() : this.openBuffer()
      }),
      (e.prototype.openBuffer = function () {
        var t = this.closingSubscription
        t && (this.remove(t), t.unsubscribe())
        var e,
          n = this.buffer
        this.buffer && this.destination.next(n), (this.buffer = [])
        try {
          e = (0, this.closingSelector)()
        } catch (t) {
          return this.error(t)
        }
        ;(t = new Ju()),
          (this.closingSubscription = t),
          this.add(t),
          (this.subscribing = !0),
          t.add(Lc(e, new Pc(this))),
          (this.subscribing = !1)
      }),
      e
    )
  })(Rc)
var Pa = (function () {
    function t(t) {
      this.selector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ra(t, this.selector, this.caught))
      }),
      t
    )
  })(),
  Ra = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.selector = n), (i.caught = r), i
    }
    return (
      $u(e, t),
      (e.prototype.error = function (e) {
        if (!this.isStopped) {
          var n = void 0
          try {
            n = this.selector(e, this.caught)
          } catch (e) {
            return void t.prototype.error.call(this, e)
          }
          this._unsubscribeAndRecycle()
          var r = new Pc(this)
          this.add(r)
          var i = Lc(n, r)
          i !== r && this.add(i)
        }
      }),
      e
    )
  })(Rc)
function La(t, e) {
  return Mc(t, e, 1)
}
var Ma = (function () {
    function t(t, e) {
      ;(this.predicate = t), (this.source = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ua(t, this.predicate, this.source))
      }),
      t
    )
  })(),
  Ua = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.predicate = n), (i.source = r), (i.count = 0), (i.index = 0), i
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.predicate ? this._tryPredicate(t) : this.count++
      }),
      (e.prototype._tryPredicate = function (t) {
        var e
        try {
          e = this.predicate(t, this.index++, this.source)
        } catch (t) {
          return void this.destination.error(t)
        }
        e && this.count++
      }),
      (e.prototype._complete = function () {
        this.destination.next(this.count), this.destination.complete()
      }),
      e
    )
  })(ts)
var Va = (function () {
    function t(t) {
      this.durationSelector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new $a(t, this.durationSelector))
      }),
      t
    )
  })(),
  $a = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.durationSelector = n), (r.hasValue = !1), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        try {
          var e = this.durationSelector.call(this, t)
          e && this._tryNext(t, e)
        } catch (t) {
          this.destination.error(t)
        }
      }),
      (e.prototype._complete = function () {
        this.emitValue(), this.destination.complete()
      }),
      (e.prototype._tryNext = function (t, e) {
        var n = this.durationSubscription
        ;(this.value = t),
          (this.hasValue = !0),
          n && (n.unsubscribe(), this.remove(n)),
          (n = Lc(e, new Pc(this))) &&
            !n.closed &&
            this.add((this.durationSubscription = n))
      }),
      (e.prototype.notifyNext = function () {
        this.emitValue()
      }),
      (e.prototype.notifyComplete = function () {
        this.emitValue()
      }),
      (e.prototype.emitValue = function () {
        if (this.hasValue) {
          var e = this.value,
            n = this.durationSubscription
          n && ((this.durationSubscription = void 0), n.unsubscribe(), this.remove(n)),
            (this.value = void 0),
            (this.hasValue = !1),
            t.prototype._next.call(this, e)
        }
      }),
      e
    )
  })(Rc)
var za = (function () {
    function t(t, e) {
      ;(this.dueTime = t), (this.scheduler = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new qa(t, this.dueTime, this.scheduler))
      }),
      t
    )
  })(),
  qa = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.dueTime = n),
        (i.scheduler = r),
        (i.debouncedSubscription = null),
        (i.lastValue = null),
        (i.hasValue = !1),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.clearDebounce(),
          (this.lastValue = t),
          (this.hasValue = !0),
          this.add(
            (this.debouncedSubscription = this.scheduler.schedule(Wa, this.dueTime, this))
          )
      }),
      (e.prototype._complete = function () {
        this.debouncedNext(), this.destination.complete()
      }),
      (e.prototype.debouncedNext = function () {
        if ((this.clearDebounce(), this.hasValue)) {
          var t = this.lastValue
          ;(this.lastValue = null), (this.hasValue = !1), this.destination.next(t)
        }
      }),
      (e.prototype.clearDebounce = function () {
        var t = this.debouncedSubscription
        null !== t &&
          (this.remove(t), t.unsubscribe(), (this.debouncedSubscription = null))
      }),
      e
    )
  })(ts)
function Wa(t) {
  t.debouncedNext()
}
function Ga(t) {
  return (
    void 0 === t && (t = null),
    function (e) {
      return e.lift(new Ka(t))
    }
  )
}
var Ka = (function () {
    function t(t) {
      this.defaultValue = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ya(t, this.defaultValue))
      }),
      t
    )
  })(),
  Ya = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.defaultValue = n), (r.isEmpty = !0), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        ;(this.isEmpty = !1), this.destination.next(t)
      }),
      (e.prototype._complete = function () {
        this.isEmpty && this.destination.next(this.defaultValue),
          this.destination.complete()
      }),
      e
    )
  })(ts)
function Ha(t) {
  return t instanceof Date && !isNaN(+t)
}
var Xa = (function () {
    function t(t, e) {
      ;(this.delay = t), (this.scheduler = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ja(t, this.delay, this.scheduler))
      }),
      t
    )
  })(),
  Ja = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.delay = n),
        (i.scheduler = r),
        (i.queue = []),
        (i.active = !1),
        (i.errored = !1),
        i
      )
    }
    return (
      $u(e, t),
      (e.dispatch = function (t) {
        for (
          var e = t.source, n = e.queue, r = t.scheduler, i = t.destination;
          n.length > 0 && n[0].time - r.now() <= 0;

        )
          n.shift().notification.observe(i)
        if (n.length > 0) {
          var o = Math.max(0, n[0].time - r.now())
          this.schedule(t, o)
        } else this.unsubscribe(), (e.active = !1)
      }),
      (e.prototype._schedule = function (t) {
        ;(this.active = !0),
          this.destination.add(
            t.schedule(e.dispatch, this.delay, {
              source: this,
              destination: this.destination,
              scheduler: t
            })
          )
      }),
      (e.prototype.scheduleNotification = function (t) {
        if (!0 !== this.errored) {
          var e = this.scheduler,
            n = new Za(e.now() + this.delay, t)
          this.queue.push(n), !1 === this.active && this._schedule(e)
        }
      }),
      (e.prototype._next = function (t) {
        this.scheduleNotification($s.createNext(t))
      }),
      (e.prototype._error = function (t) {
        ;(this.errored = !0),
          (this.queue = []),
          this.destination.error(t),
          this.unsubscribe()
      }),
      (e.prototype._complete = function () {
        this.scheduleNotification($s.createComplete()), this.unsubscribe()
      }),
      e
    )
  })(ts),
  Za = (function () {
    return function (t, e) {
      ;(this.time = t), (this.notification = e)
    }
  })()
var Qa = (function () {
    function t(t) {
      this.delayDurationSelector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new tf(t, this.delayDurationSelector))
      }),
      t
    )
  })(),
  tf = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (
        (r.delayDurationSelector = n),
        (r.completed = !1),
        (r.delayNotifierSubscriptions = []),
        (r.index = 0),
        r
      )
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function (t, e, n, r, i) {
        this.destination.next(t), this.removeSubscription(i), this.tryComplete()
      }),
      (e.prototype.notifyError = function (t, e) {
        this._error(t)
      }),
      (e.prototype.notifyComplete = function (t) {
        var e = this.removeSubscription(t)
        e && this.destination.next(e), this.tryComplete()
      }),
      (e.prototype._next = function (t) {
        var e = this.index++
        try {
          var n = this.delayDurationSelector(t, e)
          n && this.tryDelay(n, t)
        } catch (t) {
          this.destination.error(t)
        }
      }),
      (e.prototype._complete = function () {
        ;(this.completed = !0), this.tryComplete(), this.unsubscribe()
      }),
      (e.prototype.removeSubscription = function (t) {
        t.unsubscribe()
        var e = this.delayNotifierSubscriptions.indexOf(t)
        return -1 !== e && this.delayNotifierSubscriptions.splice(e, 1), t.outerValue
      }),
      (e.prototype.tryDelay = function (t, e) {
        var n = Ac(this, t, e)
        n &&
          !n.closed &&
          (this.destination.add(n), this.delayNotifierSubscriptions.push(n))
      }),
      (e.prototype.tryComplete = function () {
        this.completed &&
          0 === this.delayNotifierSubscriptions.length &&
          this.destination.complete()
      }),
      e
    )
  })(Ec),
  ef = (function (t) {
    function e(e, n) {
      var r = t.call(this) || this
      return (r.source = e), (r.subscriptionDelay = n), r
    }
    return (
      $u(e, t),
      (e.prototype._subscribe = function (t) {
        this.subscriptionDelay.subscribe(new nf(t, this.source))
      }),
      e
    )
  })(ss),
  nf = (function (t) {
    function e(e, n) {
      var r = t.call(this) || this
      return (r.parent = e), (r.source = n), (r.sourceSubscribed = !1), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.subscribeToSource()
      }),
      (e.prototype._error = function (t) {
        this.unsubscribe(), this.parent.error(t)
      }),
      (e.prototype._complete = function () {
        this.unsubscribe(), this.subscribeToSource()
      }),
      (e.prototype.subscribeToSource = function () {
        this.sourceSubscribed ||
          ((this.sourceSubscribed = !0),
          this.unsubscribe(),
          this.source.subscribe(this.parent))
      }),
      e
    )
  })(ts)
var rf = (function () {
    function t() {}
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new of(t))
      }),
      t
    )
  })(),
  of = (function (t) {
    function e(e) {
      return t.call(this, e) || this
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        t.observe(this.destination)
      }),
      e
    )
  })(ts)
var uf = (function () {
    function t(t, e) {
      ;(this.keySelector = t), (this.flushes = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new sf(t, this.keySelector, this.flushes))
      }),
      t
    )
  })(),
  sf = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.keySelector = n), (i.values = new Set()), r && i.add(Lc(r, new Pc(i))), i
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function () {
        this.values.clear()
      }),
      (e.prototype.notifyError = function (t) {
        this._error(t)
      }),
      (e.prototype._next = function (t) {
        this.keySelector ? this._useKeySelector(t) : this._finalizeNext(t, t)
      }),
      (e.prototype._useKeySelector = function (t) {
        var e,
          n = this.destination
        try {
          e = this.keySelector(t)
        } catch (t) {
          return void n.error(t)
        }
        this._finalizeNext(e, t)
      }),
      (e.prototype._finalizeNext = function (t, e) {
        var n = this.values
        n.has(t) || (n.add(t), this.destination.next(e))
      }),
      e
    )
  })(Rc)
function cf(t, e) {
  return function (n) {
    return n.lift(new af(t, e))
  }
}
var af = (function () {
    function t(t, e) {
      ;(this.compare = t), (this.keySelector = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new ff(t, this.compare, this.keySelector))
      }),
      t
    )
  })(),
  ff = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.keySelector = r), (i.hasKey = !1), 'function' == typeof n && (i.compare = n), i
      )
    }
    return (
      $u(e, t),
      (e.prototype.compare = function (t, e) {
        return t === e
      }),
      (e.prototype._next = function (t) {
        var e
        try {
          var n = this.keySelector
          e = n ? n(t) : t
        } catch (t) {
          return this.destination.error(t)
        }
        var r = !1
        if (this.hasKey)
          try {
            r = (0, this.compare)(this.key, e)
          } catch (t) {
            return this.destination.error(t)
          }
        else this.hasKey = !0
        r || ((this.key = e), this.destination.next(t))
      }),
      e
    )
  })(ts)
function lf(t) {
  return (
    void 0 === t && (t = df),
    function (e) {
      return e.lift(new hf(t))
    }
  )
}
var hf = (function () {
    function t(t) {
      this.errorFactory = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new pf(t, this.errorFactory))
      }),
      t
    )
  })(),
  pf = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.errorFactory = n), (r.hasValue = !1), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        ;(this.hasValue = !0), this.destination.next(t)
      }),
      (e.prototype._complete = function () {
        if (this.hasValue) return this.destination.complete()
        var t = void 0
        try {
          t = this.errorFactory()
        } catch (e) {
          t = e
        }
        this.destination.error(t)
      }),
      e
    )
  })(ts)
function df() {
  return new pc()
}
function vf(t) {
  return function (e) {
    return 0 === t ? Ts() : e.lift(new yf(t))
  }
}
var yf = (function () {
    function t(t) {
      if (((this.total = t), this.total < 0)) throw new hc()
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new bf(t, this.total))
      }),
      t
    )
  })(),
  bf = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.total = n), (r.count = 0), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this.total,
          n = ++this.count
        n <= e &&
          (this.destination.next(t),
          n === e && (this.destination.complete(), this.unsubscribe()))
      }),
      e
    )
  })(ts)
var gf = (function () {
    function t(t, e, n) {
      ;(this.predicate = t), (this.thisArg = e), (this.source = n)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new mf(t, this.predicate, this.thisArg, this.source))
      }),
      t
    )
  })(),
  mf = (function (t) {
    function e(e, n, r, i) {
      var o = t.call(this, e) || this
      return (
        (o.predicate = n),
        (o.thisArg = r),
        (o.source = i),
        (o.index = 0),
        (o.thisArg = r || o),
        o
      )
    }
    return (
      $u(e, t),
      (e.prototype.notifyComplete = function (t) {
        this.destination.next(t), this.destination.complete()
      }),
      (e.prototype._next = function (t) {
        var e = !1
        try {
          e = this.predicate.call(this.thisArg, t, this.index++, this.source)
        } catch (t) {
          return void this.destination.error(t)
        }
        e || this.notifyComplete(!1)
      }),
      (e.prototype._complete = function () {
        this.notifyComplete(!0)
      }),
      e
    )
  })(ts)
var Df = (function () {
    function t() {}
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new wf(t))
      }),
      t
    )
  })(),
  wf = (function (t) {
    function e(e) {
      var n = t.call(this, e) || this
      return (n.hasCompleted = !1), (n.hasSubscription = !1), n
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.hasSubscription ||
          ((this.hasSubscription = !0), this.add(Lc(t, new Pc(this))))
      }),
      (e.prototype._complete = function () {
        ;(this.hasCompleted = !0), this.hasSubscription || this.destination.complete()
      }),
      (e.prototype.notifyComplete = function () {
        ;(this.hasSubscription = !1), this.hasCompleted && this.destination.complete()
      }),
      e
    )
  })(Rc)
var _f = (function () {
    function t(t) {
      this.project = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ef(t, this.project))
      }),
      t
    )
  })(),
  Ef = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (
        (r.project = n), (r.hasSubscription = !1), (r.hasCompleted = !1), (r.index = 0), r
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.hasSubscription || this.tryNext(t)
      }),
      (e.prototype.tryNext = function (t) {
        var e,
          n = this.index++
        try {
          e = this.project(t, n)
        } catch (t) {
          return void this.destination.error(t)
        }
        ;(this.hasSubscription = !0), this._innerSub(e)
      }),
      (e.prototype._innerSub = function (t) {
        var e = new Pc(this),
          n = this.destination
        n.add(e)
        var r = Lc(t, e)
        r !== e && n.add(r)
      }),
      (e.prototype._complete = function () {
        ;(this.hasCompleted = !0),
          this.hasSubscription || this.destination.complete(),
          this.unsubscribe()
      }),
      (e.prototype.notifyNext = function (t) {
        this.destination.next(t)
      }),
      (e.prototype.notifyError = function (t) {
        this.destination.error(t)
      }),
      (e.prototype.notifyComplete = function () {
        ;(this.hasSubscription = !1), this.hasCompleted && this.destination.complete()
      }),
      e
    )
  })(Rc)
var xf = (function () {
    function t(t, e, n) {
      ;(this.project = t), (this.concurrent = e), (this.scheduler = n)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Sf(t, this.project, this.concurrent, this.scheduler))
      }),
      t
    )
  })(),
  Sf = (function (t) {
    function e(e, n, r, i) {
      var o = t.call(this, e) || this
      return (
        (o.project = n),
        (o.concurrent = r),
        (o.scheduler = i),
        (o.index = 0),
        (o.active = 0),
        (o.hasCompleted = !1),
        r < Number.POSITIVE_INFINITY && (o.buffer = []),
        o
      )
    }
    return (
      $u(e, t),
      (e.dispatch = function (t) {
        var e = t.subscriber,
          n = t.result,
          r = t.value,
          i = t.index
        e.subscribeToProjection(n, r, i)
      }),
      (e.prototype._next = function (t) {
        var n = this.destination
        if (n.closed) this._complete()
        else {
          var r = this.index++
          if (this.active < this.concurrent) {
            n.next(t)
            try {
              var i = (0, this.project)(t, r)
              if (this.scheduler) {
                var o = { subscriber: this, result: i, value: t, index: r }
                this.destination.add(this.scheduler.schedule(e.dispatch, 0, o))
              } else this.subscribeToProjection(i, t, r)
            } catch (t) {
              n.error(t)
            }
          } else this.buffer.push(t)
        }
      }),
      (e.prototype.subscribeToProjection = function (t, e, n) {
        this.active++, this.destination.add(Lc(t, new Pc(this)))
      }),
      (e.prototype._complete = function () {
        ;(this.hasCompleted = !0),
          this.hasCompleted && 0 === this.active && this.destination.complete(),
          this.unsubscribe()
      }),
      (e.prototype.notifyNext = function (t) {
        this._next(t)
      }),
      (e.prototype.notifyComplete = function () {
        var t = this.buffer
        this.active--,
          t && t.length > 0 && this._next(t.shift()),
          this.hasCompleted && 0 === this.active && this.destination.complete()
      }),
      e
    )
  })(Rc)
var Cf = (function () {
    function t(t) {
      this.callback = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ff(t, this.callback))
      }),
      t
    )
  })(),
  Ff = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return r.add(new Ju(n)), r
    }
    return $u(e, t), e
  })(ts)
var Of = (function () {
    function t(t, e, n, r) {
      ;(this.predicate = t), (this.source = e), (this.yieldIndex = n), (this.thisArg = r)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(
          new jf(t, this.predicate, this.source, this.yieldIndex, this.thisArg)
        )
      }),
      t
    )
  })(),
  jf = (function (t) {
    function e(e, n, r, i, o) {
      var u = t.call(this, e) || this
      return (
        (u.predicate = n),
        (u.source = r),
        (u.yieldIndex = i),
        (u.thisArg = o),
        (u.index = 0),
        u
      )
    }
    return (
      $u(e, t),
      (e.prototype.notifyComplete = function (t) {
        var e = this.destination
        e.next(t), e.complete(), this.unsubscribe()
      }),
      (e.prototype._next = function (t) {
        var e = this.predicate,
          n = this.thisArg,
          r = this.index++
        try {
          e.call(n || this, t, r, this.source) &&
            this.notifyComplete(this.yieldIndex ? r : t)
        } catch (t) {
          this.destination.error(t)
        }
      }),
      (e.prototype._complete = function () {
        this.notifyComplete(this.yieldIndex ? -1 : void 0)
      }),
      e
    )
  })(ts)
var Af = (function () {
    function t() {}
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new kf(t))
      }),
      t
    )
  })(),
  kf = (function (t) {
    function e() {
      return (null !== t && t.apply(this, arguments)) || this
    }
    return $u(e, t), (e.prototype._next = function (t) {}), e
  })(ts)
var If = (function () {
    function t() {}
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Tf(t))
      }),
      t
    )
  })(),
  Tf = (function (t) {
    function e(e) {
      return t.call(this, e) || this
    }
    return (
      $u(e, t),
      (e.prototype.notifyComplete = function (t) {
        var e = this.destination
        e.next(t), e.complete()
      }),
      (e.prototype._next = function (t) {
        this.notifyComplete(!1)
      }),
      (e.prototype._complete = function () {
        this.notifyComplete(!0)
      }),
      e
    )
  })(ts)
function Nf(t) {
  return function (e) {
    return 0 === t ? Ts() : e.lift(new Bf(t))
  }
}
var Bf = (function () {
    function t(t) {
      if (((this.total = t), this.total < 0)) throw new hc()
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Pf(t, this.total))
      }),
      t
    )
  })(),
  Pf = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.total = n), (r.ring = new Array()), (r.count = 0), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this.ring,
          n = this.total,
          r = this.count++
        e.length < n ? e.push(t) : (e[r % n] = t)
      }),
      (e.prototype._complete = function () {
        var t = this.destination,
          e = this.count
        if (e > 0)
          for (
            var n = this.count >= this.total ? this.total : this.count,
              r = this.ring,
              i = 0;
            i < n;
            i++
          ) {
            var o = e++ % n
            t.next(r[o])
          }
        t.complete()
      }),
      e
    )
  })(ts)
var Rf = (function () {
    function t(t) {
      this.value = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Lf(t, this.value))
      }),
      t
    )
  })(),
  Lf = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.value = n), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.destination.next(this.value)
      }),
      e
    )
  })(ts)
var Mf = (function () {
    function t() {}
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Uf(t))
      }),
      t
    )
  })(),
  Uf = (function (t) {
    function e(e) {
      return t.call(this, e) || this
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.destination.next($s.createNext(t))
      }),
      (e.prototype._error = function (t) {
        var e = this.destination
        e.next($s.createError(t)), e.complete()
      }),
      (e.prototype._complete = function () {
        var t = this.destination
        t.next($s.createComplete()), t.complete()
      }),
      e
    )
  })(ts)
function Vf(t, e) {
  var n = !1
  return (
    arguments.length >= 2 && (n = !0),
    function (r) {
      return r.lift(new $f(t, e, n))
    }
  )
}
var $f = (function () {
    function t(t, e, n) {
      void 0 === n && (n = !1),
        (this.accumulator = t),
        (this.seed = e),
        (this.hasSeed = n)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new zf(t, this.accumulator, this.seed, this.hasSeed))
      }),
      t
    )
  })(),
  zf = (function (t) {
    function e(e, n, r, i) {
      var o = t.call(this, e) || this
      return (o.accumulator = n), (o._seed = r), (o.hasSeed = i), (o.index = 0), o
    }
    return (
      $u(e, t),
      Object.defineProperty(e.prototype, 'seed', {
        get: function () {
          return this._seed
        },
        set: function (t) {
          ;(this.hasSeed = !0), (this._seed = t)
        },
        enumerable: !0,
        configurable: !0
      }),
      (e.prototype._next = function (t) {
        if (this.hasSeed) return this._tryNext(t)
        ;(this.seed = t), this.destination.next(t)
      }),
      (e.prototype._tryNext = function (t) {
        var e,
          n = this.index++
        try {
          e = this.accumulator(this.seed, t, n)
        } catch (t) {
          this.destination.error(t)
        }
        ;(this.seed = e), this.destination.next(e)
      }),
      e
    )
  })(ts)
function qf(t, e) {
  return arguments.length >= 2
    ? function (n) {
        return os(Vf(t, e), Nf(1), Ga(e))(n)
      }
    : function (e) {
        return os(
          Vf(function (e, n, r) {
            return t(e, n, r + 1)
          }),
          Nf(1)
        )(e)
      }
}
var Wf = (function () {
    function t(t, e, n) {
      ;(this.accumulator = t), (this.seed = e), (this.concurrent = n)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Gf(t, this.accumulator, this.seed, this.concurrent))
      }),
      t
    )
  })(),
  Gf = (function (t) {
    function e(e, n, r, i) {
      var o = t.call(this, e) || this
      return (
        (o.accumulator = n),
        (o.acc = r),
        (o.concurrent = i),
        (o.hasValue = !1),
        (o.hasCompleted = !1),
        (o.buffer = []),
        (o.active = 0),
        (o.index = 0),
        o
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        if (this.active < this.concurrent) {
          var e = this.index++,
            n = this.destination,
            r = void 0
          try {
            r = (0, this.accumulator)(this.acc, t, e)
          } catch (t) {
            return n.error(t)
          }
          this.active++, this._innerSub(r)
        } else this.buffer.push(t)
      }),
      (e.prototype._innerSub = function (t) {
        var e = new Pc(this),
          n = this.destination
        n.add(e)
        var r = Lc(t, e)
        r !== e && n.add(r)
      }),
      (e.prototype._complete = function () {
        ;(this.hasCompleted = !0),
          0 === this.active &&
            0 === this.buffer.length &&
            (!1 === this.hasValue && this.destination.next(this.acc),
            this.destination.complete()),
          this.unsubscribe()
      }),
      (e.prototype.notifyNext = function (t) {
        var e = this.destination
        ;(this.acc = t), (this.hasValue = !0), e.next(t)
      }),
      (e.prototype.notifyComplete = function () {
        var t = this.buffer
        this.active--,
          t.length > 0
            ? this._next(t.shift())
            : 0 === this.active &&
              this.hasCompleted &&
              (!1 === this.hasValue && this.destination.next(this.acc),
              this.destination.complete())
      }),
      e
    )
  })(Rc)
function Kf(t, e) {
  return function (n) {
    var r
    if (
      ((r =
        'function' == typeof t
          ? t
          : function () {
              return t
            }),
      'function' == typeof e)
    )
      return n.lift(new Yf(r, e))
    var i = Object.create(n, gs)
    return (i.source = n), (i.subjectFactory = r), i
  }
}
var Yf = (function () {
  function t(t, e) {
    ;(this.subjectFactory = t), (this.selector = e)
  }
  return (
    (t.prototype.call = function (t, e) {
      var n = this.selector,
        r = this.subjectFactory(),
        i = n(r).subscribe(t)
      return i.add(e.subscribe(r)), i
    }),
    t
  )
})()
var Hf = (function () {
    function t(t) {
      this.nextSources = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Xf(t, this.nextSources))
      }),
      t
    )
  })(),
  Xf = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.destination = e), (r.nextSources = n), r
    }
    return (
      $u(e, t),
      (e.prototype.notifyError = function () {
        this.subscribeToNextSource()
      }),
      (e.prototype.notifyComplete = function () {
        this.subscribeToNextSource()
      }),
      (e.prototype._error = function (t) {
        this.subscribeToNextSource(), this.unsubscribe()
      }),
      (e.prototype._complete = function () {
        this.subscribeToNextSource(), this.unsubscribe()
      }),
      (e.prototype.subscribeToNextSource = function () {
        var t = this.nextSources.shift()
        if (t) {
          var e = new Pc(this),
            n = this.destination
          n.add(e)
          var r = Lc(t, e)
          r !== e && n.add(r)
        } else this.destination.complete()
      }),
      e
    )
  })(Rc)
var Jf = (function () {
    function t() {}
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Zf(t))
      }),
      t
    )
  })(),
  Zf = (function (t) {
    function e(e) {
      var n = t.call(this, e) || this
      return (n.hasPrev = !1), n
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e
        this.hasPrev ? (e = [this.prev, t]) : (this.hasPrev = !0),
          (this.prev = t),
          e && this.destination.next(e)
      }),
      e
    )
  })(ts)
function Qf(t, e) {
  return function (n) {
    for (var r = n, i = 0; i < e; i++) {
      var o = null != r ? r[t[i]] : void 0
      if (void 0 === o) return
      r = o
    }
    return r
  }
}
var tl = (function () {
    function t(t, e) {
      ;(this.count = t), (this.source = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new el(t, this.count, this.source))
      }),
      t
    )
  })(),
  el = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.count = n), (i.source = r), i
    }
    return (
      $u(e, t),
      (e.prototype.complete = function () {
        if (!this.isStopped) {
          var e = this.source,
            n = this.count
          if (0 === n) return t.prototype.complete.call(this)
          n > -1 && (this.count = n - 1), e.subscribe(this._unsubscribeAndRecycle())
        }
      }),
      e
    )
  })(ts)
var nl = (function () {
    function t(t) {
      this.notifier = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new rl(t, this.notifier, e))
      }),
      t
    )
  })(),
  rl = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.notifier = n), (i.source = r), (i.sourceIsBeingSubscribedTo = !0), i
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function () {
        ;(this.sourceIsBeingSubscribedTo = !0), this.source.subscribe(this)
      }),
      (e.prototype.notifyComplete = function () {
        if (!1 === this.sourceIsBeingSubscribedTo) return t.prototype.complete.call(this)
      }),
      (e.prototype.complete = function () {
        if (((this.sourceIsBeingSubscribedTo = !1), !this.isStopped)) {
          if (
            (this.retries || this.subscribeToRetries(),
            !this.retriesSubscription || this.retriesSubscription.closed)
          )
            return t.prototype.complete.call(this)
          this._unsubscribeAndRecycle(), this.notifications.next(void 0)
        }
      }),
      (e.prototype._unsubscribe = function () {
        var t = this.notifications,
          e = this.retriesSubscription
        t && (t.unsubscribe(), (this.notifications = void 0)),
          e && (e.unsubscribe(), (this.retriesSubscription = void 0)),
          (this.retries = void 0)
      }),
      (e.prototype._unsubscribeAndRecycle = function () {
        var e = this._unsubscribe
        return (
          (this._unsubscribe = null),
          t.prototype._unsubscribeAndRecycle.call(this),
          (this._unsubscribe = e),
          this
        )
      }),
      (e.prototype.subscribeToRetries = function () {
        var e
        this.notifications = new hs()
        try {
          e = (0, this.notifier)(this.notifications)
        } catch (e) {
          return t.prototype.complete.call(this)
        }
        ;(this.retries = e), (this.retriesSubscription = Lc(e, new Pc(this)))
      }),
      e
    )
  })(Rc)
var il = (function () {
    function t(t, e) {
      ;(this.count = t), (this.source = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new ol(t, this.count, this.source))
      }),
      t
    )
  })(),
  ol = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.count = n), (i.source = r), i
    }
    return (
      $u(e, t),
      (e.prototype.error = function (e) {
        if (!this.isStopped) {
          var n = this.source,
            r = this.count
          if (0 === r) return t.prototype.error.call(this, e)
          r > -1 && (this.count = r - 1), n.subscribe(this._unsubscribeAndRecycle())
        }
      }),
      e
    )
  })(ts)
var ul = (function () {
    function t(t, e) {
      ;(this.notifier = t), (this.source = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new sl(t, this.notifier, this.source))
      }),
      t
    )
  })(),
  sl = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.notifier = n), (i.source = r), i
    }
    return (
      $u(e, t),
      (e.prototype.error = function (e) {
        if (!this.isStopped) {
          var n = this.errors,
            r = this.retries,
            i = this.retriesSubscription
          if (r) (this.errors = void 0), (this.retriesSubscription = void 0)
          else {
            n = new hs()
            try {
              r = (0, this.notifier)(n)
            } catch (e) {
              return t.prototype.error.call(this, e)
            }
            i = Lc(r, new Pc(this))
          }
          this._unsubscribeAndRecycle(),
            (this.errors = n),
            (this.retries = r),
            (this.retriesSubscription = i),
            n.next(e)
        }
      }),
      (e.prototype._unsubscribe = function () {
        var t = this.errors,
          e = this.retriesSubscription
        t && (t.unsubscribe(), (this.errors = void 0)),
          e && (e.unsubscribe(), (this.retriesSubscription = void 0)),
          (this.retries = void 0)
      }),
      (e.prototype.notifyNext = function () {
        var t = this._unsubscribe
        ;(this._unsubscribe = null),
          this._unsubscribeAndRecycle(),
          (this._unsubscribe = t),
          this.source.subscribe(this)
      }),
      e
    )
  })(Rc)
var cl = (function () {
    function t(t) {
      this.notifier = t
    }
    return (
      (t.prototype.call = function (t, e) {
        var n = new al(t),
          r = e.subscribe(n)
        return r.add(Lc(this.notifier, new Pc(n))), r
      }),
      t
    )
  })(),
  al = (function (t) {
    function e() {
      var e = (null !== t && t.apply(this, arguments)) || this
      return (e.hasValue = !1), e
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        ;(this.value = t), (this.hasValue = !0)
      }),
      (e.prototype.notifyNext = function () {
        this.emitValue()
      }),
      (e.prototype.notifyComplete = function () {
        this.emitValue()
      }),
      (e.prototype.emitValue = function () {
        this.hasValue && ((this.hasValue = !1), this.destination.next(this.value))
      }),
      e
    )
  })(Rc)
var fl = (function () {
    function t(t, e) {
      ;(this.period = t), (this.scheduler = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new ll(t, this.period, this.scheduler))
      }),
      t
    )
  })(),
  ll = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.period = n),
        (i.scheduler = r),
        (i.hasValue = !1),
        i.add(r.schedule(hl, n, { subscriber: i, period: n })),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        ;(this.lastValue = t), (this.hasValue = !0)
      }),
      (e.prototype.notifyNext = function () {
        this.hasValue && ((this.hasValue = !1), this.destination.next(this.lastValue))
      }),
      e
    )
  })(ts)
function hl(t) {
  var e = t.subscriber,
    n = t.period
  e.notifyNext(), this.schedule(t, n)
}
var pl = (function () {
    function t(t, e) {
      ;(this.compareTo = t), (this.comparator = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new dl(t, this.compareTo, this.comparator))
      }),
      t
    )
  })(),
  dl = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.compareTo = n),
        (i.comparator = r),
        (i._a = []),
        (i._b = []),
        (i._oneComplete = !1),
        i.destination.add(n.subscribe(new vl(e, i))),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this._oneComplete && 0 === this._b.length
          ? this.emit(!1)
          : (this._a.push(t), this.checkValues())
      }),
      (e.prototype._complete = function () {
        this._oneComplete
          ? this.emit(0 === this._a.length && 0 === this._b.length)
          : (this._oneComplete = !0),
          this.unsubscribe()
      }),
      (e.prototype.checkValues = function () {
        for (
          var t = this, e = t._a, n = t._b, r = t.comparator;
          e.length > 0 && n.length > 0;

        ) {
          var i = e.shift(),
            o = n.shift(),
            u = !1
          try {
            u = r ? r(i, o) : i === o
          } catch (t) {
            this.destination.error(t)
          }
          u || this.emit(!1)
        }
      }),
      (e.prototype.emit = function (t) {
        var e = this.destination
        e.next(t), e.complete()
      }),
      (e.prototype.nextB = function (t) {
        this._oneComplete && 0 === this._a.length
          ? this.emit(!1)
          : (this._b.push(t), this.checkValues())
      }),
      (e.prototype.completeB = function () {
        this._oneComplete
          ? this.emit(0 === this._a.length && 0 === this._b.length)
          : (this._oneComplete = !0)
      }),
      e
    )
  })(ts),
  vl = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.parent = n), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.parent.nextB(t)
      }),
      (e.prototype._error = function (t) {
        this.parent.error(t), this.unsubscribe()
      }),
      (e.prototype._complete = function () {
        this.parent.completeB(), this.unsubscribe()
      }),
      e
    )
  })(ts)
function yl() {
  return new hs()
}
var bl = (function () {
    function t(t, e) {
      ;(this.predicate = t), (this.source = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new gl(t, this.predicate, this.source))
      }),
      t
    )
  })(),
  gl = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.predicate = n), (i.source = r), (i.seenValue = !1), (i.index = 0), i
    }
    return (
      $u(e, t),
      (e.prototype.applySingleValue = function (t) {
        this.seenValue
          ? this.destination.error('Sequence contains more than one element')
          : ((this.seenValue = !0), (this.singleValue = t))
      }),
      (e.prototype._next = function (t) {
        var e = this.index++
        this.predicate ? this.tryNext(t, e) : this.applySingleValue(t)
      }),
      (e.prototype.tryNext = function (t, e) {
        try {
          this.predicate(t, e, this.source) && this.applySingleValue(t)
        } catch (t) {
          this.destination.error(t)
        }
      }),
      (e.prototype._complete = function () {
        var t = this.destination
        this.index > 0
          ? (t.next(this.seenValue ? this.singleValue : void 0), t.complete())
          : t.error(new pc())
      }),
      e
    )
  })(ts)
var ml = (function () {
    function t(t) {
      this.total = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Dl(t, this.total))
      }),
      t
    )
  })(),
  Dl = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.total = n), (r.count = 0), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        ++this.count > this.total && this.destination.next(t)
      }),
      e
    )
  })(ts)
var wl = (function () {
    function t(t) {
      if (((this._skipCount = t), this._skipCount < 0)) throw new hc()
    }
    return (
      (t.prototype.call = function (t, e) {
        return 0 === this._skipCount
          ? e.subscribe(new ts(t))
          : e.subscribe(new _l(t, this._skipCount))
      }),
      t
    )
  })(),
  _l = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r._skipCount = n), (r._count = 0), (r._ring = new Array(n)), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this._skipCount,
          n = this._count++
        if (n < e) this._ring[n] = t
        else {
          var r = n % e,
            i = this._ring,
            o = i[r]
          ;(i[r] = t), this.destination.next(o)
        }
      }),
      e
    )
  })(ts)
var El = (function () {
    function t(t) {
      this.notifier = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new xl(t, this.notifier))
      }),
      t
    )
  })(),
  xl = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      r.hasValue = !1
      var i = new Pc(r)
      r.add(i), (r.innerSubscription = i)
      var o = Lc(n, i)
      return o !== i && (r.add(o), (r.innerSubscription = o)), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (e) {
        this.hasValue && t.prototype._next.call(this, e)
      }),
      (e.prototype.notifyNext = function () {
        ;(this.hasValue = !0),
          this.innerSubscription && this.innerSubscription.unsubscribe()
      }),
      (e.prototype.notifyComplete = function () {}),
      e
    )
  })(Rc)
var Sl = (function () {
    function t(t) {
      this.predicate = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Cl(t, this.predicate))
      }),
      t
    )
  })(),
  Cl = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.predicate = n), (r.skipping = !0), (r.index = 0), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this.destination
        this.skipping && this.tryCallPredicate(t), this.skipping || e.next(t)
      }),
      (e.prototype.tryCallPredicate = function (t) {
        try {
          var e = this.predicate(t, this.index++)
          this.skipping = Boolean(e)
        } catch (t) {
          this.destination.error(t)
        }
      }),
      e
    )
  })(ts)
var Fl = (function (t) {
  function e(e, n, r) {
    void 0 === n && (n = 0), void 0 === r && (r = rc)
    var i = t.call(this) || this
    return (
      (i.source = e),
      (i.delayTime = n),
      (i.scheduler = r),
      (!Xc(n) || n < 0) && (i.delayTime = 0),
      (r && 'function' == typeof r.schedule) || (i.scheduler = rc),
      i
    )
  }
  return (
    $u(e, t),
    (e.create = function (t, n, r) {
      return void 0 === n && (n = 0), void 0 === r && (r = rc), new e(t, n, r)
    }),
    (e.dispatch = function (t) {
      var e = t.source,
        n = t.subscriber
      return this.add(e.subscribe(n))
    }),
    (e.prototype._subscribe = function (t) {
      var n = this.delayTime,
        r = this.source
      return this.scheduler.schedule(e.dispatch, n, { source: r, subscriber: t })
    }),
    e
  )
})(ss)
var Ol = (function () {
  function t(t, e) {
    ;(this.scheduler = t), (this.delay = e)
  }
  return (
    (t.prototype.call = function (t, e) {
      return new Fl(e, this.delay, this.scheduler).subscribe(t)
    }),
    t
  )
})()
function jl(t, e) {
  return 'function' == typeof e
    ? function (n) {
        return n.pipe(
          jl(function (n, r) {
            return Bc(t(n, r)).pipe(
              vc(function (t, i) {
                return e(n, t, r, i)
              })
            )
          })
        )
      }
    : function (e) {
        return e.lift(new Al(t))
      }
}
var Al = (function () {
    function t(t) {
      this.project = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new kl(t, this.project))
      }),
      t
    )
  })(),
  kl = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.project = n), (r.index = 0), r
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e,
          n = this.index++
        try {
          e = this.project(t, n)
        } catch (t) {
          return void this.destination.error(t)
        }
        this._innerSub(e)
      }),
      (e.prototype._innerSub = function (t) {
        var e = this.innerSubscription
        e && e.unsubscribe()
        var n = new Pc(this),
          r = this.destination
        r.add(n),
          (this.innerSubscription = Lc(t, n)),
          this.innerSubscription !== n && r.add(this.innerSubscription)
      }),
      (e.prototype._complete = function () {
        var e = this.innerSubscription
        ;(e && !e.closed) || t.prototype._complete.call(this), this.unsubscribe()
      }),
      (e.prototype._unsubscribe = function () {
        this.innerSubscription = void 0
      }),
      (e.prototype.notifyComplete = function () {
        ;(this.innerSubscription = void 0),
          this.isStopped && t.prototype._complete.call(this)
      }),
      (e.prototype.notifyNext = function (t) {
        this.destination.next(t)
      }),
      e
    )
  })(Rc)
var Il = (function () {
    function t(t) {
      this.notifier = t
    }
    return (
      (t.prototype.call = function (t, e) {
        var n = new Tl(t),
          r = Lc(this.notifier, new Pc(n))
        return r && !n.seenValue ? (n.add(r), e.subscribe(n)) : n
      }),
      t
    )
  })(),
  Tl = (function (t) {
    function e(e) {
      var n = t.call(this, e) || this
      return (n.seenValue = !1), n
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function () {
        ;(this.seenValue = !0), this.complete()
      }),
      (e.prototype.notifyComplete = function () {}),
      e
    )
  })(Rc)
var Nl = (function () {
    function t(t, e) {
      ;(this.predicate = t), (this.inclusive = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Bl(t, this.predicate, this.inclusive))
      }),
      t
    )
  })(),
  Bl = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (i.predicate = n), (i.inclusive = r), (i.index = 0), i
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e,
          n = this.destination
        try {
          e = this.predicate(t, this.index++)
        } catch (t) {
          return void n.error(t)
        }
        this.nextOrComplete(t, e)
      }),
      (e.prototype.nextOrComplete = function (t, e) {
        var n = this.destination
        Boolean(e) ? n.next(t) : (this.inclusive && n.next(t), n.complete())
      }),
      e
    )
  })(ts)
var Pl = (function () {
    function t(t, e, n) {
      ;(this.nextOrObserver = t), (this.error = e), (this.complete = n)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Rl(t, this.nextOrObserver, this.error, this.complete))
      }),
      t
    )
  })(),
  Rl = (function (t) {
    function e(e, n, r, i) {
      var o = t.call(this, e) || this
      return (
        (o._tapNext = lc),
        (o._tapError = lc),
        (o._tapComplete = lc),
        (o._tapError = r || lc),
        (o._tapComplete = i || lc),
        zu(n)
          ? ((o._context = o), (o._tapNext = n))
          : n &&
            ((o._context = n),
            (o._tapNext = n.next || lc),
            (o._tapError = n.error || lc),
            (o._tapComplete = n.complete || lc)),
        o
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        try {
          this._tapNext.call(this._context, t)
        } catch (t) {
          return void this.destination.error(t)
        }
        this.destination.next(t)
      }),
      (e.prototype._error = function (t) {
        try {
          this._tapError.call(this._context, t)
        } catch (t) {
          return void this.destination.error(t)
        }
        this.destination.error(t)
      }),
      (e.prototype._complete = function () {
        try {
          this._tapComplete.call(this._context)
        } catch (t) {
          return void this.destination.error(t)
        }
        return this.destination.complete()
      }),
      e
    )
  })(ts),
  Ll = { leading: !0, trailing: !1 }
var Ml = (function () {
    function t(t, e, n) {
      ;(this.durationSelector = t), (this.leading = e), (this.trailing = n)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ul(t, this.durationSelector, this.leading, this.trailing))
      }),
      t
    )
  })(),
  Ul = (function (t) {
    function e(e, n, r, i) {
      var o = t.call(this, e) || this
      return (
        (o.destination = e),
        (o.durationSelector = n),
        (o._leading = r),
        (o._trailing = i),
        (o._hasValue = !1),
        o
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        ;(this._hasValue = !0),
          (this._sendValue = t),
          this._throttled || (this._leading ? this.send() : this.throttle(t))
      }),
      (e.prototype.send = function () {
        var t = this._hasValue,
          e = this._sendValue
        t && (this.destination.next(e), this.throttle(e)),
          (this._hasValue = !1),
          (this._sendValue = void 0)
      }),
      (e.prototype.throttle = function (t) {
        var e = this.tryDurationSelector(t)
        e && this.add((this._throttled = Lc(e, new Pc(this))))
      }),
      (e.prototype.tryDurationSelector = function (t) {
        try {
          return this.durationSelector(t)
        } catch (t) {
          return this.destination.error(t), null
        }
      }),
      (e.prototype.throttlingDone = function () {
        var t = this._throttled,
          e = this._trailing
        t && t.unsubscribe(), (this._throttled = void 0), e && this.send()
      }),
      (e.prototype.notifyNext = function () {
        this.throttlingDone()
      }),
      (e.prototype.notifyComplete = function () {
        this.throttlingDone()
      }),
      e
    )
  })(Rc)
var Vl = (function () {
    function t(t, e, n, r) {
      ;(this.duration = t), (this.scheduler = e), (this.leading = n), (this.trailing = r)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(
          new $l(t, this.duration, this.scheduler, this.leading, this.trailing)
        )
      }),
      t
    )
  })(),
  $l = (function (t) {
    function e(e, n, r, i, o) {
      var u = t.call(this, e) || this
      return (
        (u.duration = n),
        (u.scheduler = r),
        (u.leading = i),
        (u.trailing = o),
        (u._hasTrailingValue = !1),
        (u._trailingValue = null),
        u
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        this.throttled
          ? this.trailing && ((this._trailingValue = t), (this._hasTrailingValue = !0))
          : (this.add(
              (this.throttled = this.scheduler.schedule(zl, this.duration, {
                subscriber: this
              }))
            ),
            this.leading
              ? this.destination.next(t)
              : this.trailing &&
                ((this._trailingValue = t), (this._hasTrailingValue = !0)))
      }),
      (e.prototype._complete = function () {
        this._hasTrailingValue
          ? (this.destination.next(this._trailingValue), this.destination.complete())
          : this.destination.complete()
      }),
      (e.prototype.clearThrottle = function () {
        var t = this.throttled
        t &&
          (this.trailing &&
            this._hasTrailingValue &&
            (this.destination.next(this._trailingValue),
            (this._trailingValue = null),
            (this._hasTrailingValue = !1)),
          t.unsubscribe(),
          this.remove(t),
          (this.throttled = null))
      }),
      e
    )
  })(ts)
function zl(t) {
  t.subscriber.clearThrottle()
}
var ql = (function () {
  return function (t, e) {
    ;(this.value = t), (this.interval = e)
  }
})()
function Wl(t, e, n) {
  return (
    void 0 === n && (n = oc),
    function (r) {
      var i = Ha(t),
        o = i ? +t - n.now() : Math.abs(t)
      return r.lift(new Gl(o, i, e, n))
    }
  )
}
var Gl = (function () {
    function t(t, e, n, r) {
      ;(this.waitFor = t),
        (this.absoluteTimeout = e),
        (this.withObservable = n),
        (this.scheduler = r)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(
          new Kl(
            t,
            this.absoluteTimeout,
            this.waitFor,
            this.withObservable,
            this.scheduler
          )
        )
      }),
      t
    )
  })(),
  Kl = (function (t) {
    function e(e, n, r, i, o) {
      var u = t.call(this, e) || this
      return (
        (u.absoluteTimeout = n),
        (u.waitFor = r),
        (u.withObservable = i),
        (u.scheduler = o),
        u.scheduleTimeout(),
        u
      )
    }
    return (
      $u(e, t),
      (e.dispatchTimeout = function (t) {
        var e = t.withObservable
        t._unsubscribeAndRecycle(), t.add(Lc(e, new Pc(t)))
      }),
      (e.prototype.scheduleTimeout = function () {
        var t = this.action
        t
          ? (this.action = t.schedule(this, this.waitFor))
          : this.add(
              (this.action = this.scheduler.schedule(
                e.dispatchTimeout,
                this.waitFor,
                this
              ))
            )
      }),
      (e.prototype._next = function (e) {
        this.absoluteTimeout || this.scheduleTimeout(), t.prototype._next.call(this, e)
      }),
      (e.prototype._unsubscribe = function () {
        ;(this.action = void 0), (this.scheduler = null), (this.withObservable = null)
      }),
      e
    )
  })(Rc)
var Yl = (function () {
  return function (t, e) {
    ;(this.value = t), (this.timestamp = e)
  }
})()
function Hl(t, e, n) {
  return 0 === n ? [e] : (t.push(e), t)
}
var Xl = (function () {
    function t(t) {
      this.windowBoundaries = t
    }
    return (
      (t.prototype.call = function (t, e) {
        var n = new Jl(t),
          r = e.subscribe(n)
        return r.closed || n.add(Lc(this.windowBoundaries, new Pc(n))), r
      }),
      t
    )
  })(),
  Jl = (function (t) {
    function e(e) {
      var n = t.call(this, e) || this
      return (n.window = new hs()), e.next(n.window), n
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function () {
        this.openWindow()
      }),
      (e.prototype.notifyError = function (t) {
        this._error(t)
      }),
      (e.prototype.notifyComplete = function () {
        this._complete()
      }),
      (e.prototype._next = function (t) {
        this.window.next(t)
      }),
      (e.prototype._error = function (t) {
        this.window.error(t), this.destination.error(t)
      }),
      (e.prototype._complete = function () {
        this.window.complete(), this.destination.complete()
      }),
      (e.prototype._unsubscribe = function () {
        this.window = null
      }),
      (e.prototype.openWindow = function () {
        var t = this.window
        t && t.complete()
        var e = this.destination,
          n = (this.window = new hs())
        e.next(n)
      }),
      e
    )
  })(Rc)
var Zl = (function () {
    function t(t, e) {
      ;(this.windowSize = t), (this.startWindowEvery = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new Ql(t, this.windowSize, this.startWindowEvery))
      }),
      t
    )
  })(),
  Ql = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.destination = e),
        (i.windowSize = n),
        (i.startWindowEvery = r),
        (i.windows = [new hs()]),
        (i.count = 0),
        e.next(i.windows[0]),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        for (
          var e = this.startWindowEvery > 0 ? this.startWindowEvery : this.windowSize,
            n = this.destination,
            r = this.windowSize,
            i = this.windows,
            o = i.length,
            u = 0;
          u < o && !this.closed;
          u++
        )
          i[u].next(t)
        var s = this.count - r + 1
        if (
          (s >= 0 && s % e == 0 && !this.closed && i.shift().complete(),
          ++this.count % e == 0 && !this.closed)
        ) {
          var c = new hs()
          i.push(c), n.next(c)
        }
      }),
      (e.prototype._error = function (t) {
        var e = this.windows
        if (e) for (; e.length > 0 && !this.closed; ) e.shift().error(t)
        this.destination.error(t)
      }),
      (e.prototype._complete = function () {
        var t = this.windows
        if (t) for (; t.length > 0 && !this.closed; ) t.shift().complete()
        this.destination.complete()
      }),
      (e.prototype._unsubscribe = function () {
        ;(this.count = 0), (this.windows = null)
      }),
      e
    )
  })(ts)
var th = (function () {
    function t(t, e, n, r) {
      ;(this.windowTimeSpan = t),
        (this.windowCreationInterval = e),
        (this.maxWindowSize = n),
        (this.scheduler = r)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(
          new nh(
            t,
            this.windowTimeSpan,
            this.windowCreationInterval,
            this.maxWindowSize,
            this.scheduler
          )
        )
      }),
      t
    )
  })(),
  eh = (function (t) {
    function e() {
      var e = (null !== t && t.apply(this, arguments)) || this
      return (e._numberOfNextedValues = 0), e
    }
    return (
      $u(e, t),
      (e.prototype.next = function (e) {
        this._numberOfNextedValues++, t.prototype.next.call(this, e)
      }),
      Object.defineProperty(e.prototype, 'numberOfNextedValues', {
        get: function () {
          return this._numberOfNextedValues
        },
        enumerable: !0,
        configurable: !0
      }),
      e
    )
  })(hs),
  nh = (function (t) {
    function e(e, n, r, i, o) {
      var u = t.call(this, e) || this
      ;(u.destination = e),
        (u.windowTimeSpan = n),
        (u.windowCreationInterval = r),
        (u.maxWindowSize = i),
        (u.scheduler = o),
        (u.windows = [])
      var s = u.openWindow()
      if (null !== r && r >= 0) {
        var c = { subscriber: u, window: s, context: null },
          a = {
            windowTimeSpan: n,
            windowCreationInterval: r,
            subscriber: u,
            scheduler: o
          }
        u.add(o.schedule(oh, n, c)), u.add(o.schedule(ih, r, a))
      } else {
        var f = { subscriber: u, window: s, windowTimeSpan: n }
        u.add(o.schedule(rh, n, f))
      }
      return u
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        for (var e = this.windows, n = e.length, r = 0; r < n; r++) {
          var i = e[r]
          i.closed ||
            (i.next(t),
            i.numberOfNextedValues >= this.maxWindowSize && this.closeWindow(i))
        }
      }),
      (e.prototype._error = function (t) {
        for (var e = this.windows; e.length > 0; ) e.shift().error(t)
        this.destination.error(t)
      }),
      (e.prototype._complete = function () {
        for (var t = this.windows; t.length > 0; ) {
          var e = t.shift()
          e.closed || e.complete()
        }
        this.destination.complete()
      }),
      (e.prototype.openWindow = function () {
        var t = new eh()
        return this.windows.push(t), this.destination.next(t), t
      }),
      (e.prototype.closeWindow = function (t) {
        t.complete()
        var e = this.windows
        e.splice(e.indexOf(t), 1)
      }),
      e
    )
  })(ts)
function rh(t) {
  var e = t.subscriber,
    n = t.windowTimeSpan,
    r = t.window
  r && e.closeWindow(r), (t.window = e.openWindow()), this.schedule(t, n)
}
function ih(t) {
  var e = t.windowTimeSpan,
    n = t.subscriber,
    r = t.scheduler,
    i = t.windowCreationInterval,
    o = n.openWindow(),
    u = this,
    s = { action: u, subscription: null },
    c = { subscriber: n, window: o, context: s }
  ;(s.subscription = r.schedule(oh, e, c)), u.add(s.subscription), u.schedule(t, i)
}
function oh(t) {
  var e = t.subscriber,
    n = t.window,
    r = t.context
  r && r.action && r.subscription && r.action.remove(r.subscription), e.closeWindow(n)
}
var uh = (function () {
    function t(t, e) {
      ;(this.openings = t), (this.closingSelector = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new sh(t, this.openings, this.closingSelector))
      }),
      t
    )
  })(),
  sh = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      return (
        (i.openings = n),
        (i.closingSelector = r),
        (i.contexts = []),
        i.add((i.openSubscription = Ac(i, n, n))),
        i
      )
    }
    return (
      $u(e, t),
      (e.prototype._next = function (t) {
        var e = this.contexts
        if (e) for (var n = e.length, r = 0; r < n; r++) e[r].window.next(t)
      }),
      (e.prototype._error = function (e) {
        var n = this.contexts
        if (((this.contexts = null), n))
          for (var r = n.length, i = -1; ++i < r; ) {
            var o = n[i]
            o.window.error(e), o.subscription.unsubscribe()
          }
        t.prototype._error.call(this, e)
      }),
      (e.prototype._complete = function () {
        var e = this.contexts
        if (((this.contexts = null), e))
          for (var n = e.length, r = -1; ++r < n; ) {
            var i = e[r]
            i.window.complete(), i.subscription.unsubscribe()
          }
        t.prototype._complete.call(this)
      }),
      (e.prototype._unsubscribe = function () {
        var t = this.contexts
        if (((this.contexts = null), t))
          for (var e = t.length, n = -1; ++n < e; ) {
            var r = t[n]
            r.window.unsubscribe(), r.subscription.unsubscribe()
          }
      }),
      (e.prototype.notifyNext = function (t, e, n, r, i) {
        if (t === this.openings) {
          var o = void 0
          try {
            o = (0, this.closingSelector)(e)
          } catch (t) {
            return this.error(t)
          }
          var u = new hs(),
            s = new Ju(),
            c = { window: u, subscription: s }
          this.contexts.push(c)
          var a = Ac(this, o, c)
          a.closed
            ? this.closeWindow(this.contexts.length - 1)
            : ((a.context = c), s.add(a)),
            this.destination.next(u)
        } else this.closeWindow(this.contexts.indexOf(t))
      }),
      (e.prototype.notifyError = function (t) {
        this.error(t)
      }),
      (e.prototype.notifyComplete = function (t) {
        t !== this.openSubscription && this.closeWindow(this.contexts.indexOf(t.context))
      }),
      (e.prototype.closeWindow = function (t) {
        if (-1 !== t) {
          var e = this.contexts,
            n = e[t],
            r = n.window,
            i = n.subscription
          e.splice(t, 1), r.complete(), i.unsubscribe()
        }
      }),
      e
    )
  })(Ec)
var ch = (function () {
    function t(t) {
      this.closingSelector = t
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new ah(t, this.closingSelector))
      }),
      t
    )
  })(),
  ah = (function (t) {
    function e(e, n) {
      var r = t.call(this, e) || this
      return (r.destination = e), (r.closingSelector = n), r.openWindow(), r
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function (t, e, n, r, i) {
        this.openWindow(i)
      }),
      (e.prototype.notifyError = function (t) {
        this._error(t)
      }),
      (e.prototype.notifyComplete = function (t) {
        this.openWindow(t)
      }),
      (e.prototype._next = function (t) {
        this.window.next(t)
      }),
      (e.prototype._error = function (t) {
        this.window.error(t),
          this.destination.error(t),
          this.unsubscribeClosingNotification()
      }),
      (e.prototype._complete = function () {
        this.window.complete(),
          this.destination.complete(),
          this.unsubscribeClosingNotification()
      }),
      (e.prototype.unsubscribeClosingNotification = function () {
        this.closingNotification && this.closingNotification.unsubscribe()
      }),
      (e.prototype.openWindow = function (t) {
        void 0 === t && (t = null), t && (this.remove(t), t.unsubscribe())
        var e = this.window
        e && e.complete()
        var n,
          r = (this.window = new hs())
        this.destination.next(r)
        try {
          n = (0, this.closingSelector)()
        } catch (t) {
          return this.destination.error(t), void this.window.error(t)
        }
        this.add((this.closingNotification = Ac(this, n)))
      }),
      e
    )
  })(Ec)
var fh = (function () {
    function t(t, e) {
      ;(this.observables = t), (this.project = e)
    }
    return (
      (t.prototype.call = function (t, e) {
        return e.subscribe(new lh(t, this.observables, this.project))
      }),
      t
    )
  })(),
  lh = (function (t) {
    function e(e, n, r) {
      var i = t.call(this, e) || this
      ;(i.observables = n), (i.project = r), (i.toRespond = [])
      var o = n.length
      i.values = new Array(o)
      for (var u = 0; u < o; u++) i.toRespond.push(u)
      for (u = 0; u < o; u++) {
        var s = n[u]
        i.add(Ac(i, s, void 0, u))
      }
      return i
    }
    return (
      $u(e, t),
      (e.prototype.notifyNext = function (t, e, n) {
        this.values[n] = e
        var r = this.toRespond
        if (r.length > 0) {
          var i = r.indexOf(n)
          ;-1 !== i && r.splice(i, 1)
        }
      }),
      (e.prototype.notifyComplete = function () {}),
      (e.prototype._next = function (t) {
        if (0 === this.toRespond.length) {
          var e = [t].concat(this.values)
          this.project ? this._tryProject(e) : this.destination.next(e)
        }
      }),
      (e.prototype._tryProject = function (t) {
        var e
        try {
          e = this.project.apply(this, t)
        } catch (t) {
          return void this.destination.error(t)
        }
        this.destination.next(e)
      }),
      e
    )
  })(Ec)
var hh = Object.freeze({
    __proto__: null,
    audit: ga,
    auditTime: function (t, e) {
      return (
        void 0 === e && (e = oc),
        ga(function () {
          return aa(t, e)
        })
      )
    },
    buffer: function (t) {
      return function (e) {
        return e.lift(new wa(t))
      }
    },
    bufferCount: function (t, e) {
      return (
        void 0 === e && (e = null),
        function (n) {
          return n.lift(new Ea(t, e))
        }
      )
    },
    bufferTime: function (t) {
      var e = arguments.length,
        n = oc
      Ns(arguments[arguments.length - 1]) && ((n = arguments[arguments.length - 1]), e--)
      var r = null
      e >= 2 && (r = arguments[1])
      var i = Number.POSITIVE_INFINITY
      return (
        e >= 3 && (i = arguments[2]),
        function (e) {
          return e.lift(new Ca(t, r, i, n))
        }
      )
    },
    bufferToggle: function (t, e) {
      return function (n) {
        return n.lift(new Ia(t, e))
      }
    },
    bufferWhen: function (t) {
      return function (e) {
        return e.lift(new Na(t))
      }
    },
    catchError: function (t) {
      return function (e) {
        var n = new Pa(t),
          r = e.lift(n)
        return (n.caught = r)
      }
    },
    combineAll: function (t) {
      return function (e) {
        return e.lift(new Ic(t))
      }
    },
    combineLatest: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      var n = null
      return (
        'function' == typeof t[t.length - 1] && (n = t.pop()),
        1 === t.length && Yu(t[0]) && (t = t[0].slice()),
        function (e) {
          return e.lift.call(Bc([e].concat(t)), new Ic(n))
        }
      )
    },
    concat: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return function (e) {
        return e.lift.call(Wc.apply(void 0, [e].concat(t)))
      }
    },
    concatAll: qc,
    concatMap: La,
    concatMapTo: function (t, e) {
      return La(function () {
        return t
      }, e)
    },
    count: function (t) {
      return function (e) {
        return e.lift(new Ma(t, e))
      }
    },
    debounce: function (t) {
      return function (e) {
        return e.lift(new Va(t))
      }
    },
    debounceTime: function (t, e) {
      return (
        void 0 === e && (e = oc),
        function (n) {
          return n.lift(new za(t, e))
        }
      )
    },
    defaultIfEmpty: Ga,
    delay: function (t, e) {
      void 0 === e && (e = oc)
      var n = Ha(t) ? +t - e.now() : Math.abs(t)
      return function (t) {
        return t.lift(new Xa(n, e))
      }
    },
    delayWhen: function (t, e) {
      return e
        ? function (n) {
            return new ef(n, e).lift(new Qa(t))
          }
        : function (e) {
            return e.lift(new Qa(t))
          }
    },
    dematerialize: function () {
      return function (t) {
        return t.lift(new rf())
      }
    },
    distinct: function (t, e) {
      return function (n) {
        return n.lift(new uf(t, e))
      }
    },
    distinctUntilChanged: cf,
    distinctUntilKeyChanged: function (t, e) {
      return cf(function (n, r) {
        return e ? e(n[t], r[t]) : n[t] === r[t]
      })
    },
    elementAt: function (t, e) {
      if (t < 0) throw new hc()
      var n = arguments.length >= 2
      return function (r) {
        return r.pipe(
          na(function (e, n) {
            return n === t
          }),
          vf(1),
          n
            ? Ga(e)
            : lf(function () {
                return new hc()
              })
        )
      }
    },
    endWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return function (e) {
        return Wc(e, Ms.apply(void 0, t))
      }
    },
    every: function (t, e) {
      return function (n) {
        return n.lift(new gf(t, e, n))
      }
    },
    exhaust: function () {
      return function (t) {
        return t.lift(new Df())
      }
    },
    exhaustMap: function t(e, n) {
      return n
        ? function (r) {
            return r.pipe(
              t(function (t, r) {
                return Bc(e(t, r)).pipe(
                  vc(function (e, i) {
                    return n(t, e, r, i)
                  })
                )
              })
            )
          }
        : function (t) {
            return t.lift(new _f(e))
          }
    },
    expand: function (t, e, n) {
      return (
        void 0 === e && (e = Number.POSITIVE_INFINITY),
        (e = (e || 0) < 1 ? Number.POSITIVE_INFINITY : e),
        function (r) {
          return r.lift(new xf(t, e, n))
        }
      )
    },
    filter: na,
    finalize: function (t) {
      return function (e) {
        return e.lift(new Cf(t))
      }
    },
    find: function (t, e) {
      if ('function' != typeof t) throw new TypeError('predicate is not a function')
      return function (n) {
        return n.lift(new Of(t, n, !1, e))
      }
    },
    findIndex: function (t, e) {
      return function (n) {
        return n.lift(new Of(t, n, !0, e))
      }
    },
    first: function (t, e) {
      var n = arguments.length >= 2
      return function (r) {
        return r.pipe(
          t
            ? na(function (e, n) {
                return t(e, n, r)
              })
            : is,
          vf(1),
          n
            ? Ga(e)
            : lf(function () {
                return new pc()
              })
        )
      }
    },
    groupBy: function (t, e, n, r) {
      return function (i) {
        return i.lift(new Ds(t, e, n, r))
      }
    },
    ignoreElements: function () {
      return function (t) {
        return t.lift(new Af())
      }
    },
    isEmpty: function () {
      return function (t) {
        return t.lift(new If())
      }
    },
    last: function (t, e) {
      var n = arguments.length >= 2
      return function (r) {
        return r.pipe(
          t
            ? na(function (e, n) {
                return t(e, n, r)
              })
            : is,
          Nf(1),
          n
            ? Ga(e)
            : lf(function () {
                return new pc()
              })
        )
      }
    },
    map: vc,
    mapTo: function (t) {
      return function (e) {
        return e.lift(new Rf(t))
      }
    },
    materialize: function () {
      return function (t) {
        return t.lift(new Mf())
      }
    },
    max: function (t) {
      return qf(
        'function' == typeof t
          ? function (e, n) {
              return t(e, n) > 0 ? e : n
            }
          : function (t, e) {
              return t > e ? t : e
            }
      )
    },
    merge: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return function (e) {
        return e.lift.call(Zc.apply(void 0, [e].concat(t)))
      }
    },
    mergeAll: zc,
    mergeMap: Mc,
    flatMap: $c,
    mergeMapTo: function (t, e, n) {
      return (
        void 0 === n && (n = Number.POSITIVE_INFINITY),
        'function' == typeof e
          ? Mc(
              function () {
                return t
              },
              e,
              n
            )
          : ('number' == typeof e && (n = e),
            Mc(function () {
              return t
            }, n))
      )
    },
    mergeScan: function (t, e, n) {
      return (
        void 0 === n && (n = Number.POSITIVE_INFINITY),
        function (r) {
          return r.lift(new Wf(t, e, n))
        }
      )
    },
    min: function (t) {
      return qf(
        'function' == typeof t
          ? function (e, n) {
              return t(e, n) < 0 ? e : n
            }
          : function (t, e) {
              return t < e ? t : e
            }
      )
    },
    multicast: Kf,
    observeOn: function (t, e) {
      return (
        void 0 === e && (e = 0),
        function (n) {
          return n.lift(new zs(t, e))
        }
      )
    },
    onErrorResumeNext: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return (
        1 === t.length && Yu(t[0]) && (t = t[0]),
        function (e) {
          return e.lift(new Hf(t))
        }
      )
    },
    pairwise: function () {
      return function (t) {
        return t.lift(new Jf())
      }
    },
    partition: function (t, e) {
      return function (n) {
        return [na(t, e)(n), na(ea(t, e))(n)]
      }
    },
    pluck: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      var n = t.length
      if (0 === n) throw new Error('list of properties cannot be empty.')
      return function (e) {
        return vc(Qf(t, n))(e)
      }
    },
    publish: function (t) {
      return t
        ? Kf(function () {
            return new hs()
          }, t)
        : Kf(new hs())
    },
    publishBehavior: function (t) {
      return function (e) {
        return Kf(new Ss(t))(e)
      }
    },
    publishLast: function () {
      return function (t) {
        return Kf(new Ys())(t)
      }
    },
    publishReplay: function (t, e, n, r) {
      n && 'function' != typeof n && (r = n)
      var i = 'function' == typeof n ? n : void 0,
        o = new Gs(t, e, r)
      return function (t) {
        return Kf(function () {
          return o
        }, i)(t)
      }
    },
    race: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return function (e) {
        return (
          1 === t.length && Yu(t[0]) && (t = t[0]),
          e.lift.call(oa.apply(void 0, [e].concat(t)))
        )
      }
    },
    reduce: qf,
    repeat: function (t) {
      return (
        void 0 === t && (t = -1),
        function (e) {
          return 0 === t ? Ts() : t < 0 ? e.lift(new tl(-1, e)) : e.lift(new tl(t - 1, e))
        }
      )
    },
    repeatWhen: function (t) {
      return function (e) {
        return e.lift(new nl(t))
      }
    },
    retry: function (t) {
      return (
        void 0 === t && (t = -1),
        function (e) {
          return e.lift(new il(t, e))
        }
      )
    },
    retryWhen: function (t) {
      return function (e) {
        return e.lift(new ul(t, e))
      }
    },
    refCount: ds,
    sample: function (t) {
      return function (e) {
        return e.lift(new cl(t))
      }
    },
    sampleTime: function (t, e) {
      return (
        void 0 === e && (e = oc),
        function (n) {
          return n.lift(new fl(t, e))
        }
      )
    },
    scan: Vf,
    sequenceEqual: function (t, e) {
      return function (n) {
        return n.lift(new pl(t, e))
      }
    },
    share: function () {
      return function (t) {
        return ds()(Kf(yl)(t))
      }
    },
    shareReplay: function (t, e, n) {
      var r
      return (
        (r =
          t && 'object' == typeof t
            ? t
            : { bufferSize: t, windowTime: e, refCount: !1, scheduler: n }),
        function (t) {
          return t.lift(
            (function (t) {
              var e,
                n,
                r = t.bufferSize,
                i = void 0 === r ? Number.POSITIVE_INFINITY : r,
                o = t.windowTime,
                u = void 0 === o ? Number.POSITIVE_INFINITY : o,
                s = t.refCount,
                c = t.scheduler,
                a = 0,
                f = !1,
                l = !1
              return function (t) {
                var r
                a++,
                  !e || f
                    ? ((f = !1),
                      (e = new Gs(i, u, c)),
                      (r = e.subscribe(this)),
                      (n = t.subscribe({
                        next: function (t) {
                          e.next(t)
                        },
                        error: function (t) {
                          ;(f = !0), e.error(t)
                        },
                        complete: function () {
                          ;(l = !0), (n = void 0), e.complete()
                        }
                      })),
                      l && (n = void 0))
                    : (r = e.subscribe(this)),
                  this.add(function () {
                    a--,
                      r.unsubscribe(),
                      (r = void 0),
                      n &&
                        !l &&
                        s &&
                        0 === a &&
                        (n.unsubscribe(), (n = void 0), (e = void 0))
                  })
              }
            })(r)
          )
        }
      )
    },
    single: function (t) {
      return function (e) {
        return e.lift(new bl(t, e))
      }
    },
    skip: function (t) {
      return function (e) {
        return e.lift(new ml(t))
      }
    },
    skipLast: function (t) {
      return function (e) {
        return e.lift(new wl(t))
      }
    },
    skipUntil: function (t) {
      return function (e) {
        return e.lift(new El(t))
      }
    },
    skipWhile: function (t) {
      return function (e) {
        return e.lift(new Sl(t))
      }
    },
    startWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      var n = t[t.length - 1]
      return Ns(n)
        ? (t.pop(),
          function (e) {
            return Wc(t, e, n)
          })
        : function (e) {
            return Wc(t, e)
          }
    },
    subscribeOn: function (t, e) {
      return (
        void 0 === e && (e = 0),
        function (n) {
          return n.lift(new Ol(t, e))
        }
      )
    },
    switchAll: function () {
      return jl(is)
    },
    switchMap: jl,
    switchMapTo: function (t, e) {
      return e
        ? jl(function () {
            return t
          }, e)
        : jl(function () {
            return t
          })
    },
    take: vf,
    takeLast: Nf,
    takeUntil: function (t) {
      return function (e) {
        return e.lift(new Il(t))
      }
    },
    takeWhile: function (t, e) {
      return (
        void 0 === e && (e = !1),
        function (n) {
          return n.lift(new Nl(t, e))
        }
      )
    },
    tap: function (t, e, n) {
      return function (r) {
        return r.lift(new Pl(t, e, n))
      }
    },
    throttle: function (t, e) {
      return (
        void 0 === e && (e = Ll),
        function (n) {
          return n.lift(new Ml(t, !!e.leading, !!e.trailing))
        }
      )
    },
    throttleTime: function (t, e, n) {
      return (
        void 0 === e && (e = oc),
        void 0 === n && (n = Ll),
        function (r) {
          return r.lift(new Vl(t, e, n.leading, n.trailing))
        }
      )
    },
    throwIfEmpty: lf,
    timeInterval: function (t) {
      return (
        void 0 === t && (t = oc),
        function (e) {
          return Gc(function () {
            return e.pipe(
              Vf(
                function (e, n) {
                  var r = e.current
                  return { value: n, current: t.now(), last: r }
                },
                { current: t.now(), value: void 0, last: void 0 }
              ),
              vc(function (t) {
                var e = t.current,
                  n = t.last,
                  r = t.value
                return new ql(r, e - n)
              })
            )
          })
        }
      )
    },
    timeout: function (t, e) {
      return void 0 === e && (e = oc), Wl(t, Us(new dc()), e)
    },
    timeoutWith: Wl,
    timestamp: function (t) {
      return (
        void 0 === t && (t = oc),
        vc(function (e) {
          return new Yl(e, t.now())
        })
      )
    },
    toArray: function () {
      return qf(Hl, [])
    },
    window: function (t) {
      return function (e) {
        return e.lift(new Xl(t))
      }
    },
    windowCount: function (t, e) {
      return (
        void 0 === e && (e = 0),
        function (n) {
          return n.lift(new Zl(t, e))
        }
      )
    },
    windowTime: function (t) {
      var e = oc,
        n = null,
        r = Number.POSITIVE_INFINITY
      return (
        Ns(arguments[3]) && (e = arguments[3]),
        Ns(arguments[2])
          ? (e = arguments[2])
          : Xc(arguments[2]) && (r = Number(arguments[2])),
        Ns(arguments[1])
          ? (e = arguments[1])
          : Xc(arguments[1]) && (n = Number(arguments[1])),
        function (i) {
          return i.lift(new th(t, n, r, e))
        }
      )
    },
    windowToggle: function (t, e) {
      return function (n) {
        return n.lift(new uh(t, e))
      }
    },
    windowWhen: function (t) {
      return function (e) {
        return e.lift(new ch(t))
      }
    },
    withLatestFrom: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return function (e) {
        var n
        'function' == typeof t[t.length - 1] && (n = t.pop())
        var r = t
        return e.lift(new fh(r, n))
      }
    },
    zip: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e]
      return function (e) {
        return e.lift.call(la.apply(void 0, [e].concat(t)))
      }
    },
    zipAll: function (t) {
      return function (e) {
        return e.lift(new ha(t))
      }
    }
  }),
  ph = Ft(function (t) {
    function e(t) {
      return (
        !!t &&
        ('object' == typeof t || 'function' == typeof t) &&
        'function' == typeof t.then
      )
    }
    var n = (t.exports = function (t, n) {
      return (
        (n = n || function () {}),
        function () {
          var r = arguments,
            i = new Promise(function (n, i) {
              var o = !1
              const u = function (t) {
                o && console.warn('Run-async promise already resolved.'), (o = !0), n(t)
              }
              var s = !1
              const c = function (t) {
                s && console.warn('Run-async promise already rejected.'), (s = !0), i(t)
              }
              var a = !1,
                f = !1,
                l = !1,
                h = t.apply(
                  {
                    async: function () {
                      return l
                        ? (console.warn(
                            'Run-async async() called outside a valid run-async context, callback will be ignored.'
                          ),
                          function () {})
                        : (f &&
                            console.warn(
                              'Run-async wrapped function (async) returned a promise.\nCalls to async() callback can have unexpected results.'
                            ),
                          (a = !0),
                          function (t, e) {
                            t ? c(t) : u(e)
                          })
                    }
                  },
                  Array.prototype.slice.call(r)
                )
              a
                ? e(h) &&
                  console.warn(
                    'Run-async wrapped function (sync) returned a promise but async() callback must be executed to resolve.'
                  )
                : e(h)
                ? ((f = !0), h.then(u, c))
                : u(h),
                (l = !0)
            })
          return i.then(n.bind(null, null), n), i
        }
      )
    })
    n.cb = function (t, e) {
      return n(function () {
        var e = Array.prototype.slice.call(arguments)
        return e.length === t.length - 1 && e.push(this.async()), t.apply(this, e)
      }, e)
    }
  }),
  dh = Ct(ba),
  vh = { isFunction: Qn },
  { from: yh, of: bh } = dh,
  gh = function (t, e, n) {
    return vh.isFunction(t[e]) ? yh(ph(t[e])(n).then((n) => ((t[e] = n), t))) : bh(t)
  },
  mh = Ct(hh),
  Dh = { isPlainObject: gu, clone: Lu, isArray: $r, set: Uu, isFunction: Qn },
  { defer: wh, empty: _h, from: Eh, of: xh } = dh,
  { concatMap: Sh, filter: Ch, publish: Fh, reduce: Oh } = mh
var jh = class extends ju {
  constructor(t, e) {
    super(e), (this.prompts = t)
  }
  run(t, e) {
    Dh.isPlainObject(e) ? (this.answers = Dh.clone(e)) : (this.answers = {}),
      Dh.isPlainObject(t) && (t = [t])
    var n = Dh.isArray(t) ? Eh(t) : t
    return (
      (this.process = n.pipe(Sh(this.processQuestion.bind(this)), Fh())),
      this.process.connect(),
      this.process
        .pipe(Oh((t, e) => (Dh.set(t, e.name, e.answer), t), this.answers))
        .toPromise(Promise)
        .then(this.onCompletion.bind(this), this.onError.bind(this))
    )
  }
  onCompletion() {
    return this.close(), this.answers
  }
  onError(t) {
    return this.close(), Promise.reject(t)
  }
  processQuestion(t) {
    return (
      (t = Dh.clone(t)),
      wh(() =>
        xh(t).pipe(
          Sh(this.setDefaultType.bind(this)),
          Sh(this.filterIfRunnable.bind(this)),
          Sh(() => gh(t, 'message', this.answers)),
          Sh(() => gh(t, 'default', this.answers)),
          Sh(() => gh(t, 'choices', this.answers)),
          Sh(this.fetchAnswer.bind(this))
        )
      )
    )
  }
  fetchAnswer(t) {
    var e = this.prompts[t.type]
    return (
      (this.activePrompt = new e(t, this.rl, this.answers)),
      wh(() => Eh(this.activePrompt.run().then((e) => ({ name: t.name, answer: e }))))
    )
  }
  setDefaultType(t) {
    return this.prompts[t.type] || (t.type = 'input'), wh(() => xh(t))
  }
  filterIfRunnable(t) {
    if (!0 !== t.askAnswered && void 0 !== this.answers[t.name]) return _h()
    if (!1 === t.when) return _h()
    if (!Dh.isFunction(t.when)) return xh(t)
    var e = this.answers
    return wh(() =>
      Eh(
        ph(t.when)(e).then((e) => {
          if (e) return t
        })
      ).pipe(Ch((t) => null != t))
    )
  }
}
var Ah = function (t) {
  return 'number' == typeof t || (Pr(t) && '[object Number]' == Xn(t))
}
var kh = function (t, e, n, r) {
  for (var i = t.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i; )
    if (e(t[o], o, t)) return o
  return -1
}
var Ih = function (t) {
  return this.__data__.set(t, '__lodash_hash_undefined__'), this
}
var Th = function (t) {
  return this.__data__.has(t)
}
function Nh(t) {
  var e = -1,
    n = null == t ? 0 : t.length
  for (this.__data__ = new Mi(); ++e < n; ) this.add(t[e])
}
;(Nh.prototype.add = Nh.prototype.push = Ih), (Nh.prototype.has = Th)
var Bh = Nh
var Ph = function (t, e) {
  for (var n = -1, r = null == t ? 0 : t.length; ++n < r; ) if (e(t[n], n, t)) return !0
  return !1
}
var Rh = function (t, e) {
  return t.has(e)
}
var Lh = function (t, e, n, r, i, o) {
  var u = 1 & n,
    s = t.length,
    c = e.length
  if (s != c && !(u && c > s)) return !1
  var a = o.get(t),
    f = o.get(e)
  if (a && f) return a == e && f == t
  var l = -1,
    h = !0,
    p = 2 & n ? new Bh() : void 0
  for (o.set(t, e), o.set(e, t); ++l < s; ) {
    var d = t[l],
      v = e[l]
    if (r) var y = u ? r(v, d, l, e, t, o) : r(d, v, l, t, e, o)
    if (void 0 !== y) {
      if (y) continue
      h = !1
      break
    }
    if (p) {
      if (
        !Ph(e, function (t, e) {
          if (!Rh(p, e) && (d === t || i(d, t, n, r, o))) return p.push(e)
        })
      ) {
        h = !1
        break
      }
    } else if (d !== v && !i(d, v, n, r, o)) {
      h = !1
      break
    }
  }
  return o.delete(t), o.delete(e), h
}
var Mh = function (t) {
  var e = -1,
    n = Array(t.size)
  return (
    t.forEach(function (t, r) {
      n[++e] = [r, t]
    }),
    n
  )
}
var Uh = function (t) {
    var e = -1,
      n = Array(t.size)
    return (
      t.forEach(function (t) {
        n[++e] = t
      }),
      n
    )
  },
  Vh = Vn ? Vn.prototype : void 0,
  $h = Vh ? Vh.valueOf : void 0
var zh = function (t, e, n, r, i, o, u) {
    switch (n) {
      case '[object DataView]':
        if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1
        ;(t = t.buffer), (e = e.buffer)
      case '[object ArrayBuffer]':
        return !(t.byteLength != e.byteLength || !o(new Co(t), new Co(e)))
      case '[object Boolean]':
      case '[object Date]':
      case '[object Number]':
        return yr(+t, +e)
      case '[object Error]':
        return t.name == e.name && t.message == e.message
      case '[object RegExp]':
      case '[object String]':
        return t == e + ''
      case '[object Map]':
        var s = Mh
      case '[object Set]':
        var c = 1 & r
        if ((s || (s = Uh), t.size != e.size && !c)) return !1
        var a = u.get(t)
        if (a) return a == e
        ;(r |= 2), u.set(t, e)
        var f = Lh(s(t), s(e), r, i, o, u)
        return u.delete(t), f
      case '[object Symbol]':
        if ($h) return $h.call(t) == $h.call(e)
    }
    return !1
  },
  qh = Object.prototype.hasOwnProperty
var Wh = function (t, e, n, r, i, o) {
    var u = 1 & n,
      s = fo(t),
      c = s.length
    if (c != fo(e).length && !u) return !1
    for (var a = c; a--; ) {
      var f = s[a]
      if (!(u ? f in e : qh.call(e, f))) return !1
    }
    var l = o.get(t),
      h = o.get(e)
    if (l && h) return l == e && h == t
    var p = !0
    o.set(t, e), o.set(e, t)
    for (var d = u; ++a < c; ) {
      var v = t[(f = s[a])],
        y = e[f]
      if (r) var b = u ? r(y, v, f, e, t, o) : r(v, y, f, t, e, o)
      if (!(void 0 === b ? v === y || i(v, y, n, r, o) : b)) {
        p = !1
        break
      }
      d || (d = 'constructor' == f)
    }
    if (p && !d) {
      var g = t.constructor,
        m = e.constructor
      g == m ||
        !('constructor' in t) ||
        !('constructor' in e) ||
        ('function' == typeof g &&
          g instanceof g &&
          'function' == typeof m &&
          m instanceof m) ||
        (p = !1)
    }
    return o.delete(t), o.delete(e), p
  },
  Gh = '[object Object]',
  Kh = Object.prototype.hasOwnProperty
var Yh = function (t, e, n, r, i, o) {
  var u = $r(t),
    s = $r(e),
    c = u ? '[object Array]' : Eo(t),
    a = s ? '[object Array]' : Eo(e),
    f = (c = '[object Arguments]' == c ? Gh : c) == Gh,
    l = (a = '[object Arguments]' == a ? Gh : a) == Gh,
    h = c == a
  if (h && qr(t)) {
    if (!qr(e)) return !1
    ;(u = !0), (f = !1)
  }
  if (h && !f)
    return (
      o || (o = new $i()), u || Xr(t) ? Lh(t, e, n, r, i, o) : zh(t, e, c, n, r, i, o)
    )
  if (!(1 & n)) {
    var p = f && Kh.call(t, '__wrapped__'),
      d = l && Kh.call(e, '__wrapped__')
    if (p || d) {
      var v = p ? t.value() : t,
        y = d ? e.value() : e
      return o || (o = new $i()), i(v, y, n, r, o)
    }
  }
  return !!h && (o || (o = new $i()), Wh(t, e, n, r, i, o))
}
var Hh = function t(e, n, r, i, o) {
  return (
    e === n ||
    (null == e || null == n || (!Pr(e) && !Pr(n))
      ? e != e && n != n
      : Yh(e, n, r, i, t, o))
  )
}
var Xh = function (t, e, n, r) {
  var i = n.length,
    o = i,
    u = !r
  if (null == t) return !o
  for (t = Object(t); i--; ) {
    var s = n[i]
    if (u && s[2] ? s[1] !== t[s[0]] : !(s[0] in t)) return !1
  }
  for (; ++i < o; ) {
    var c = (s = n[i])[0],
      a = t[c],
      f = s[1]
    if (u && s[2]) {
      if (void 0 === a && !(c in t)) return !1
    } else {
      var l = new $i()
      if (r) var h = r(a, f, c, t, e, l)
      if (!(void 0 === h ? Hh(f, a, 3, r, l) : h)) return !1
    }
  }
  return !0
}
var Jh = function (t) {
  return t == t && !Jn(t)
}
var Zh = function (t) {
  for (var e = Yi(t), n = e.length; n--; ) {
    var r = e[n],
      i = t[r]
    e[n] = [r, i, Jh(i)]
  }
  return e
}
var Qh = function (t, e) {
  return function (n) {
    return null != n && n[t] === e && (void 0 !== e || t in Object(n))
  }
}
var tp = function (t) {
  var e = Zh(t)
  return 1 == e.length && e[0][2]
    ? Qh(e[0][0], e[0][1])
    : function (n) {
        return n === t || Xh(n, t, e)
      }
}
var ep = function (t, e, n) {
  var r = null == t ? void 0 : au(t, e)
  return void 0 === r ? n : r
}
var np = function (t, e) {
  return null != t && e in Object(t)
}
var rp = function (t, e, n) {
  for (var r = -1, i = (e = uu(e, t)).length, o = !1; ++r < i; ) {
    var u = cu(e[r])
    if (!(o = null != t && n(t, u))) break
    t = t[u]
  }
  return o || ++r != i
    ? o
    : !!(i = null == t ? 0 : t.length) && jr(i) && Ir(u, i) && ($r(t) || Vr(t))
}
var ip = function (t, e) {
  return null != t && rp(t, e, np)
}
var op = function (t, e) {
  return Xo(t) && Jh(e)
    ? Qh(cu(t), e)
    : function (n) {
        var r = ep(n, t)
        return void 0 === r && r === e ? ip(n, t) : Hh(e, r, 3)
      }
}
var up = function (t) {
  return function (e) {
    return null == e ? void 0 : e[t]
  }
}
var sp = function (t) {
  return function (e) {
    return au(e, t)
  }
}
var cp = function (t) {
  return Xo(t) ? up(cu(t)) : sp(t)
}
var ap = function (t) {
    return 'function' == typeof t
      ? t
      : null == t
      ? Dr
      : 'object' == typeof t
      ? $r(t)
        ? op(t[0], t[1])
        : tp(t)
      : cp(t)
  },
  fp = /\s/
var lp = function (t) {
    for (var e = t.length; e-- && fp.test(t.charAt(e)); );
    return e
  },
  hp = /^\s+/
var pp = function (t) {
    return t ? t.slice(0, lp(t) + 1).replace(hp, '') : t
  },
  dp = /^[-+]0x[0-9a-f]+$/i,
  vp = /^0b[01]+$/i,
  yp = /^0o[0-7]+$/i,
  bp = parseInt
var gp = function (t) {
  if ('number' == typeof t) return t
  if (Ko(t)) return NaN
  if (Jn(t)) {
    var e = 'function' == typeof t.valueOf ? t.valueOf() : t
    t = Jn(e) ? e + '' : e
  }
  if ('string' != typeof t) return 0 === t ? t : +t
  t = pp(t)
  var n = vp.test(t)
  return n || yp.test(t) ? bp(t.slice(2), n ? 2 : 8) : dp.test(t) ? NaN : +t
}
var mp = function (t) {
  return t
    ? Infinity === (t = gp(t)) || -Infinity === t
      ? 17976931348623157e292 * (t < 0 ? -1 : 1)
      : t == t
      ? t
      : 0
    : 0 === t
    ? t
    : 0
}
var Dp = function (t) {
    var e = mp(t),
      n = e % 1
    return e == e ? (n ? e - n : e) : 0
  },
  wp = Math.max
var _p = function (t, e, n) {
  var r = null == t ? 0 : t.length
  if (!r) return -1
  var i = null == n ? 0 : Dp(n)
  return i < 0 && (i = wp(r + i, 0)), kh(t, ap(e), i)
}
var Ep = function (t) {
  return 'string' == typeof t || (!$r(t) && Pr(t) && '[object String]' == Xn(t))
}
const xp = (t, e) => {
  for (const n of Reflect.ownKeys(e))
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n))
  return t
}
var Sp = xp,
  Cp = xp
Sp.default = Cp
const Fp = new WeakMap(),
  Op = (t, e = {}) => {
    if ('function' != typeof t) throw new TypeError('Expected a function')
    let n,
      r = 0
    const i = t.displayName || t.name || '<anonymous>',
      o = function (...u) {
        if ((Fp.set(o, ++r), 1 === r)) (n = t.apply(this, u)), (t = null)
        else if (!0 === e.throw)
          throw new Error(`Function \`${i}\` can only be called once`)
        return n
      }
    return Sp(o, t), Fp.set(o, r), o
  }
var jp = Op,
  Ap = Op
;(jp.default = Ap),
  (jp.callCount = (t) => {
    if (!Fp.has(t))
      throw new Error(
        `The given function \`${t.name}\` is not wrapped by the \`onetime\` package`
      )
    return Fp.get(t)
  })
var kp,
  Ip = Ft(function (t) {
    ;(t.exports = ['SIGABRT', 'SIGALRM', 'SIGHUP', 'SIGINT', 'SIGTERM']),
      'win32' !== process.platform &&
        t.exports.push(
          'SIGVTALRM',
          'SIGXCPU',
          'SIGXFSZ',
          'SIGUSR2',
          'SIGTRAP',
          'SIGSYS',
          'SIGQUIT',
          'SIGIOT'
        ),
      'linux' === process.platform &&
        t.exports.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT', 'SIGUNUSED')
  }),
  Tp = /^win/i.test(process.platform),
  Np = j.default
'function' != typeof Np && (Np = Np.EventEmitter),
  process.__signal_exit_emitter__
    ? (kp = process.__signal_exit_emitter__)
    : (((kp = process.__signal_exit_emitter__ = new Np()).count = 0), (kp.emitted = {})),
  kp.infinite || (kp.setMaxListeners(1 / 0), (kp.infinite = !0))
var Bp = function (t, e) {
    O.default.equal(typeof t, 'function', 'a callback must be provided for exit handler'),
      !1 === Vp && $p()
    var n = 'exit'
    e && e.alwaysLast && (n = 'afterexit')
    return (
      kp.on(n, t),
      function () {
        kp.removeListener(n, t),
          0 === kp.listeners('exit').length &&
            0 === kp.listeners('afterexit').length &&
            Rp()
      }
    )
  },
  Pp = Rp
function Rp() {
  Vp &&
    ((Vp = !1),
    Ip.forEach(function (t) {
      try {
        process.removeListener(t, Mp[t])
      } catch (t) {}
    }),
    (process.emit = Wp),
    (process.reallyExit = zp),
    (kp.count -= 1))
}
function Lp(t, e, n) {
  kp.emitted[t] || ((kp.emitted[t] = !0), kp.emit(t, e, n))
}
var Mp = {}
Ip.forEach(function (t) {
  Mp[t] = function () {
    process.listeners(t).length === kp.count &&
      (Rp(),
      Lp('exit', null, t),
      Lp('afterexit', null, t),
      Tp && 'SIGHUP' === t && (t = 'SIGINT'),
      process.kill(process.pid, t))
  }
})
var Up = $p,
  Vp = !1
function $p() {
  Vp ||
    ((Vp = !0),
    (kp.count += 1),
    (Ip = Ip.filter(function (t) {
      try {
        return process.on(t, Mp[t]), !0
      } catch (t) {
        return !1
      }
    })),
    (process.emit = Gp),
    (process.reallyExit = qp))
}
var zp = process.reallyExit
function qp(t) {
  ;(process.exitCode = t || 0),
    Lp('exit', process.exitCode, null),
    Lp('afterexit', process.exitCode, null),
    zp.call(process, process.exitCode)
}
var Wp = process.emit
function Gp(t, e) {
  if ('exit' === t) {
    void 0 !== e && (process.exitCode = e)
    var n = Wp.apply(this, arguments)
    return Lp('exit', process.exitCode, null), Lp('afterexit', process.exitCode, null), n
  }
  return Wp.apply(this, arguments)
}
;(Bp.unload = Pp),
  (Bp.signals = function () {
    return Ip
  }),
  (Bp.load = Up)
var Kp = jp(() => {
    Bp(
      () => {
        process.stderr.write('[?25h')
      },
      { alwaysLast: !0 }
    )
  }),
  Yp = Ft(function (t, e) {
    let n = !1
    ;(e.show = (t = process.stderr) => {
      t.isTTY && ((n = !1), t.write('[?25h'))
    }),
      (e.hide = (t = process.stderr) => {
        t.isTTY && (Kp(), (n = !0), t.write('[?25l'))
      }),
      (e.toggle = (t, r) => {
        void 0 !== t && (n = t), n ? e.show(r) : e.hide(r)
      })
  }),
  Hp = Object.prototype.hasOwnProperty,
  Xp = Nr(function (t, e) {
    if (ti(e) || Ar(e)) mr(e, Yi(e), t)
    else for (var n in e) Hp.call(e, n) && gr(t, n, e[n])
  }),
  Jp = Object.prototype,
  Zp = Jp.hasOwnProperty,
  Qp = Or(function (t, e) {
    t = Object(t)
    var n = -1,
      r = e.length,
      i = r > 2 ? e[2] : void 0
    for (i && Tr(e[0], e[1], i) && (r = 1); ++n < r; )
      for (var o = e[n], u = ii(o), s = -1, c = u.length; ++s < c; ) {
        var a = u[s],
          f = t[a]
        ;(void 0 === f || (yr(f, Jp[a]) && !Zp.call(t, a))) && (t[a] = o[a])
      }
    return t
  })
var td = (function (t) {
  return function (e, n, r) {
    for (var i = -1, o = Object(e), u = r(e), s = u.length; s--; ) {
      var c = u[t ? s : ++i]
      if (!1 === n(o[c], c, o)) break
    }
    return e
  }
})()
var ed = (function (t, e) {
  return function (n, r) {
    if (null == n) return n
    if (!Ar(n)) return t(n, r)
    for (
      var i = n.length, o = e ? i : -1, u = Object(n);
      (e ? o-- : ++o < i) && !1 !== r(u[o], o, u);

    );
    return n
  }
})(function (t, e) {
  return t && td(t, e, Yi)
})
var nd = function (t, e) {
  var n = []
  return (
    ed(t, function (t, r, i) {
      e(t, r, i) && n.push(t)
    }),
    n
  )
}
var rd = function (t, e) {
  return ($r(t) ? Qi : nd)(t, ap(e))
}
var id = function (t, e) {
  var n = -1,
    r = Ar(t) ? Array(t.length) : []
  return (
    ed(t, function (t, i, o) {
      r[++n] = e(t, i, o)
    }),
    r
  )
}
var od = function (t, e) {
  return ($r(t) ? ui : id)(t, ap(e))
}
var ud = (function (t) {
    return function (e, n, r) {
      var i = Object(e)
      if (!Ar(e)) {
        var o = ap(n)
        ;(e = Yi(e)),
          (n = function (t) {
            return o(i[t], t, i)
          })
      }
      var u = t(e, n, r)
      return u > -1 ? i[o ? e[u] : u] : void 0
    }
  })(_p),
  sd = { isString: Ep, isNumber: Ah, extend: oi, isFunction: Qn },
  cd = class t {
    constructor(e, n) {
      if (e instanceof t || 'separator' === e.type) return e
      sd.isString(e) || sd.isNumber(e)
        ? ((this.name = String(e)), (this.value = e), (this.short = String(e)))
        : sd.extend(this, e, {
            name: e.name || e.value,
            value: 'value' in e ? e.value : e.name,
            short: e.short || e.name || e.value
          }),
        sd.isFunction(e.disabled)
          ? (this.disabled = e.disabled(n))
          : (this.disabled = e.disabled)
    }
  },
  ad = { isNumber: Ah, filter: rd, map: od, find: ud },
  fd = Ft(function (t, e) {
    t.exports = function (t) {
      let e = (function (t) {
        let e = { defaultWidth: 0, output: process.stdout, tty: x.default }
        if (!t) return e
        return (
          Object.keys(e).forEach(function (n) {
            t[n] || (t[n] = e[n])
          }),
          t
        )
      })(t)
      if (e.output.getWindowSize) return e.output.getWindowSize()[0] || e.defaultWidth
      if (e.tty.getWindowSize) return e.tty.getWindowSize()[1] || e.defaultWidth
      if (e.output.columns) return e.output.columns
      if (process.env.CLI_WIDTH) {
        let t = parseInt(process.env.CLI_WIDTH, 10)
        if (!isNaN(t) && 0 !== t) return t
      }
      return e.defaultWidth
    }
  })
const ld = (t) =>
  !Number.isNaN(t) &&
  t >= 4352 &&
  (t <= 4447 ||
    9001 === t ||
    9002 === t ||
    (11904 <= t && t <= 12871 && 12351 !== t) ||
    (12880 <= t && t <= 19903) ||
    (19968 <= t && t <= 42182) ||
    (43360 <= t && t <= 43388) ||
    (44032 <= t && t <= 55203) ||
    (63744 <= t && t <= 64255) ||
    (65040 <= t && t <= 65049) ||
    (65072 <= t && t <= 65131) ||
    (65281 <= t && t <= 65376) ||
    (65504 <= t && t <= 65510) ||
    (110592 <= t && t <= 110593) ||
    (127488 <= t && t <= 127569) ||
    (131072 <= t && t <= 262141))
var hd = ld,
  pd = ld
hd.default = pd
const dd = (t) => {
  if ('string' != typeof t || 0 === t.length) return 0
  if (0 === (t = Jt(t)).length) return 0
  t = t.replace(
    /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g,
    '  '
  )
  let e = 0
  for (let n = 0; n < t.length; n++) {
    const r = t.codePointAt(n)
    r <= 31 ||
      (r >= 127 && r <= 159) ||
      (r >= 768 && r <= 879) ||
      (r > 65535 && n++, (e += hd(r) ? 2 : 1))
  }
  return e
}
var vd = dd,
  yd = dd
vd.default = yd
var bd = { last: su, flatten: Eu }
function gd(t) {
  return t.split('\n').length
}
function md(t) {
  return bd.last(t.split('\n'))
}
var Dd = class {
    constructor(t) {
      ;(this.height = 0), (this.extraLinesUnderPrompt = 0), (this.rl = t)
    }
    render(t, e) {
      this.rl.output.unmute(), this.clean(this.extraLinesUnderPrompt)
      var n = md(t),
        r = Jt(n),
        i = r
      this.rl.line.length && (i = i.slice(0, -this.rl.line.length)), this.rl.setPrompt(i)
      var o = this.rl._getCursorPos(),
        u = this.normalizedCliWidth()
      ;(t = this.forceLineReturn(t, u)),
        e && (e = this.forceLineReturn(e, u)),
        r.length % u == 0 && (t += '\n')
      var s = t + (e ? '\n' + e : '')
      this.rl.output.write(s)
      var c = Math.floor(r.length / u) - o.rows + (e ? gd(e) : 0)
      c > 0 && Tu(this.rl, c),
        ku(this.rl, vd(md(s))),
        o.cols > 0 && Iu(this.rl, o.cols),
        (this.extraLinesUnderPrompt = c),
        (this.height = gd(s)),
        this.rl.output.mute()
    }
    clean(t) {
      t > 0 && Nu(this.rl, t), Bu(this.rl, this.height)
    }
    done() {
      this.rl.setPrompt(''), this.rl.output.unmute(), this.rl.output.write('\n')
    }
    releaseCursor() {
      this.extraLinesUnderPrompt > 0 && Nu(this.rl, this.extraLinesUnderPrompt)
    }
    normalizedCliWidth() {
      return fd({ defaultWidth: 80, output: this.rl.output })
    }
    breakLines(t, e) {
      e = e || this.normalizedCliWidth()
      var n = new RegExp('(?:(?:\\033[[0-9;]*m)*.?){1,' + e + '}', 'g')
      return t.map((t) => {
        var e = t.match(n)
        return e.pop(), e || ''
      })
    }
    forceLineReturn(t, e) {
      return (
        (e = e || this.normalizedCliWidth()),
        bd.flatten(this.breakLines(t.split('\n'), e)).join('\n')
      )
    }
  },
  wd = { assign: Xp, defaults: Qp, clone: Lu },
  { filter: _d, flatMap: Ed, share: xd, take: Sd, takeUntil: Cd } = mh
var Fd = class {
    constructor(t, e, n) {
      wd.assign(this, { answers: n, status: 'pending' }),
        (this.opt = wd.defaults(wd.clone(t), {
          validate: () => !0,
          filter: (t) => t,
          when: () => !0,
          suffix: '',
          prefix: Sn.green('?')
        })),
        this.opt.name || this.throwParamError('name'),
        this.opt.message || (this.opt.message = this.opt.name + ':'),
        Array.isArray(this.opt.choices) &&
          (this.opt.choices = new (class {
            constructor(t, e) {
              ;(this.choices = t.map((t) =>
                'separator' === t.type
                  ? (t instanceof Pn || (t = new Pn(t.line)), t)
                  : new cd(t, e)
              )),
                (this.realChoices = this.choices
                  .filter(Pn.exclude)
                  .filter((t) => !t.disabled)),
                Object.defineProperty(this, 'length', {
                  get() {
                    return this.choices.length
                  },
                  set(t) {
                    this.choices.length = t
                  }
                }),
                Object.defineProperty(this, 'realLength', {
                  get() {
                    return this.realChoices.length
                  },
                  set() {
                    throw new Error('Cannot set `realLength` of a Choices collection')
                  }
                })
            }
            getChoice(t) {
              return O.default(ad.isNumber(t)), this.realChoices[t]
            }
            get(t) {
              return O.default(ad.isNumber(t)), this.choices[t]
            }
            where(t) {
              return ad.filter(this.realChoices, t)
            }
            pluck(t) {
              return ad.map(this.realChoices, t)
            }
            indexOf() {
              return this.choices.indexOf.apply(this.choices, arguments)
            }
            forEach() {
              return this.choices.forEach.apply(this.choices, arguments)
            }
            filter() {
              return this.choices.filter.apply(this.choices, arguments)
            }
            reduce() {
              return this.choices.reduce.apply(this.choices, arguments)
            }
            find(t) {
              return ad.find(this.choices, t)
            }
            push() {
              var t = ad.map(arguments, (t) => new cd(t))
              return (
                this.choices.push.apply(this.choices, t),
                (this.realChoices = this.choices
                  .filter(Pn.exclude)
                  .filter((t) => !t.disabled)),
                this.choices
              )
            }
          })(this.opt.choices, n)),
        (this.rl = e),
        (this.screen = new Dd(this.rl))
    }
    run() {
      return new Promise((t, e) => {
        this._run(
          (e) => t(e),
          (t) => e(t)
        )
      })
    }
    _run(t) {
      t()
    }
    throwParamError(t) {
      throw new Error('You must provide a `' + t + '` parameter')
    }
    close() {
      this.screen.releaseCursor()
    }
    handleSubmitEvents(t) {
      var e = this,
        n = ph(this.opt.validate),
        r = ph(this.opt.filter),
        i = t.pipe(
          Ed((t) =>
            r(t, e.answers).then(
              (t) =>
                n(t, e.answers).then(
                  (e) => ({ isValid: e, value: t }),
                  (e) => ({ isValid: e, value: t })
                ),
              (t) => ({ isValid: t })
            )
          ),
          xd()
        ),
        o = i.pipe(
          _d((t) => !0 === t.isValid),
          Sd(1)
        )
      return {
        success: o,
        error: i.pipe(
          _d((t) => !0 !== t.isValid),
          Cd(o)
        )
      }
    }
    getQuestion() {
      var t =
        this.opt.prefix +
        ' ' +
        Sn.bold(this.opt.message) +
        this.opt.suffix +
        Sn.reset(' ')
      return (
        null != this.opt.default &&
          'answered' !== this.status &&
          ('password' === this.opt.type
            ? (t += Sn.italic.dim('[hidden] '))
            : (t += Sn.dim('(' + this.opt.default + ') '))),
        t
      )
    }
  },
  { fromEvent: Od } = dh,
  { filter: jd, map: Ad, share: kd, takeUntil: Id } = mh
function Td(t, e) {
  return { value: t, key: e || {} }
}
var Nd = function (t) {
  var e = Od(t.input, 'keypress', Td)
    .pipe(Id(Od(t, 'close')))
    .pipe(jd(({ key: t }) => 'enter' !== t.name && 'return' !== t.name))
  return {
    line: Od(t, 'line'),
    keypress: e,
    normalizedUpKey: e.pipe(
      jd(({ key: t }) => 'up' === t.name || 'k' === t.name || ('p' === t.name && t.ctrl)),
      kd()
    ),
    normalizedDownKey: e.pipe(
      jd(
        ({ key: t }) => 'down' === t.name || 'j' === t.name || ('n' === t.name && t.ctrl)
      ),
      kd()
    ),
    numberKey: e.pipe(
      jd((t) => t.value && '123456789'.indexOf(t.value) >= 0),
      Ad((t) => Number(t.value)),
      kd()
    ),
    spaceKey: e.pipe(
      jd(({ key: t }) => t && 'space' === t.name),
      kd()
    ),
    aKey: e.pipe(
      jd(({ key: t }) => t && 'a' === t.name),
      kd()
    ),
    iKey: e.pipe(
      jd(({ key: t }) => t && 'i' === t.name),
      kd()
    )
  }
}
var Bd = function (t, e) {
  for (var n, r = -1, i = t.length; ++r < i; ) {
    var o = e(t[r])
    void 0 !== o && (n = void 0 === n ? o : n + o)
  }
  return n
}
var Pd = {
  sum: function (t) {
    return t && t.length ? Bd(t, Dr) : 0
  },
  flatten: Eu
}
var Rd = class {
  constructor(t, e = {}) {
    const { isInfinite: n = !0 } = e
    ;(this.lastIndex = 0), (this.screen = t), (this.isInfinite = n)
  }
  paginate(t, e, n) {
    n = n || 7
    var r = t.split('\n')
    if (
      (this.screen &&
        ((r = this.screen.breakLines(r)),
        (e = Pd.sum(r.map((t) => t.length).splice(0, e))),
        (r = Pd.flatten(r))),
      r.length <= n)
    )
      return t
    const i = this.isInfinite
      ? this.getInfiniteLines(r, e, n)
      : this.getFiniteLines(r, e, n)
    return (
      (this.lastIndex = e),
      i.join('\n') + '\n' + Sn.dim('(Move up and down to reveal more choices)')
    )
  }
  getInfiniteLines(t, e, n) {
    void 0 === this.pointer && (this.pointer = 0)
    var r = Math.floor(n / 2)
    this.pointer < r &&
      this.lastIndex < e &&
      e - this.lastIndex < n &&
      (this.pointer = Math.min(r, this.pointer + e - this.lastIndex))
    var i = Pd.flatten([t, t, t]),
      o = Math.max(0, e + t.length - this.pointer)
    return i.splice(o, n)
  }
  getFiniteLines(t, e, n) {
    var r = e - n / 2
    return r < 0 ? (r = 0) : r + n > t.length && (r = t.length - n), t.splice(r, n)
  }
}
var Ld = function (t, e, n) {
    var r = n.choices.realLength,
      i = !('loop' in n) || Boolean(n.loop)
    if ('up' === e) return t > 0 ? t - 1 : i ? r - 1 : t
    if ('down' === e) return t < r - 1 ? t + 1 : i ? 0 : t
    throw new Error('dir must be up or down')
  },
  Md = { isNumber: Ah, findIndex: _p, isString: Ep },
  { flatMap: Ud, map: Vd, take: $d, takeUntil: zd } = mh
var qd = class extends Fd {
    constructor(t, e, n) {
      super(t, e, n),
        this.opt.choices || this.throwParamError('choices'),
        (this.firstRender = !0),
        (this.selected = 0)
      var r = this.opt.default
      if (Md.isNumber(r) && r >= 0 && r < this.opt.choices.realLength) this.selected = r
      else if (!Md.isNumber(r) && null != r) {
        let t = Md.findIndex(this.opt.choices.realChoices, ({ value: t }) => t === r)
        this.selected = Math.max(t, 0)
      }
      this.opt.default = null
      const i = void 0 === this.opt.loop || this.opt.loop
      this.paginator = new Rd(this.screen, { isInfinite: i })
    }
    _run(t) {
      this.done = t
      var e = this,
        n = Nd(this.rl)
      return (
        n.normalizedUpKey.pipe(zd(n.line)).forEach(this.onUpKey.bind(this)),
        n.normalizedDownKey.pipe(zd(n.line)).forEach(this.onDownKey.bind(this)),
        n.numberKey.pipe(zd(n.line)).forEach(this.onNumberKey.bind(this)),
        n.line
          .pipe(
            $d(1),
            Vd(this.getCurrentValue.bind(this)),
            Ud((t) => ph(e.opt.filter)(t, e.answers).catch((t) => t))
          )
          .forEach(this.onSubmit.bind(this)),
        Yp.hide(),
        this.render(),
        this
      )
    }
    render() {
      var t = this.getQuestion()
      if (
        (this.firstRender && (t += Sn.dim('(Use arrow keys)')),
        'answered' === this.status)
      )
        t += Sn.cyan(this.opt.choices.getChoice(this.selected).short)
      else {
        var e = (function (t, e) {
            var n = '',
              r = 0
            return (
              t.forEach((t, i) => {
                if ('separator' === t.type) return r++, void (n += '  ' + t + '\n')
                if (t.disabled)
                  return (
                    r++,
                    (n += '  - ' + t.name),
                    (n +=
                      ' (' + (Md.isString(t.disabled) ? t.disabled : 'Disabled') + ')'),
                    void (n += '\n')
                  )
                var o = i - r === e,
                  u = (o ? In.pointer + ' ' : '  ') + t.name
                o && (u = Sn.cyan(u)), (n += u + ' \n')
              }),
              n.replace(/\n$/, '')
            )
          })(this.opt.choices, this.selected),
          n = this.opt.choices.indexOf(this.opt.choices.getChoice(this.selected)),
          r =
            this.opt.choices.reduce(function (t, e, r) {
              if (r > n) return t
              if ('separator' === e.type) return t + 1
              var i = e.name
              return 'string' != typeof i ? t + 1 : t + (i = i.split('\n')).length
            }, 0) - 1
        t += '\n' + this.paginator.paginate(e, r, this.opt.pageSize)
      }
      ;(this.firstRender = !1), this.screen.render(t)
    }
    onSubmit(t) {
      ;(this.status = 'answered'),
        this.render(),
        this.screen.done(),
        Yp.show(),
        this.done(t)
    }
    getCurrentValue() {
      return this.opt.choices.getChoice(this.selected).value
    }
    onUpKey() {
      ;(this.selected = Ld(this.selected, 'up', this.opt)), this.render()
    }
    onDownKey() {
      ;(this.selected = Ld(this.selected, 'down', this.opt)), this.render()
    }
    onNumberKey(t) {
      t <= this.opt.choices.realLength && (this.selected = t - 1), this.render()
    }
  },
  { map: Wd, takeUntil: Gd } = mh
var Kd = class extends Fd {
  _run(t) {
    this.done = t
    var e = Nd(this.rl),
      n = e.line.pipe(Wd(this.filterInput.bind(this))),
      r = this.handleSubmitEvents(n)
    return (
      r.success.forEach(this.onEnd.bind(this)),
      r.error.forEach(this.onError.bind(this)),
      e.keypress.pipe(Gd(r.success)).forEach(this.onKeypress.bind(this)),
      this.render(),
      this
    )
  }
  render(t) {
    var e = '',
      n = '',
      r = this.getQuestion(),
      i = this.opt.transformer,
      o = 'answered' === this.status
    ;(n = o ? this.answer : this.rl.line),
      (r += i ? i(n, this.answers, { isFinal: o }) : o ? Sn.cyan(n) : n),
      t && (e = Sn.red('>> ') + t),
      this.screen.render(r, e)
  }
  filterInput(t) {
    return t || (null == this.opt.default ? '' : this.opt.default)
  }
  onEnd(t) {
    ;(this.answer = t.value),
      (this.status = 'answered'),
      this.render(),
      this.screen.done(),
      this.done(t.value)
  }
  onError({ value: t = '', isValid: e }) {
    ;(this.rl.line += t), (this.rl.cursor += t.length), this.render(e)
  }
  onKeypress() {
    this.opt.default && (this.opt.default = void 0), this.render()
  }
}
var Yd = class extends Kd {
  filterInput(t) {
    if (t && 'string' == typeof t) {
      let e = (t = t.trim()).match(/(^-?\d+|^\d+\.\d*|^\d*\.\d+)(e\d+)?$/)
      if (e) return Number(e[0])
    }
    return null == this.opt.default ? NaN : this.opt.default
  }
}
var Hd = {
    extend: oi,
    isBoolean: function (t) {
      return !0 === t || !1 === t || (Pr(t) && '[object Boolean]' == Xn(t))
    }
  },
  { take: Xd, takeUntil: Jd } = mh
var Zd = class extends Fd {
    constructor(t, e, n) {
      super(t, e, n)
      var r = !0
      Hd.extend(this.opt, {
        filter: function (t) {
          var e = r
          return null != t && '' !== t && (e = /^y(es)?/i.test(t)), e
        }
      }),
        Hd.isBoolean(this.opt.default) && (r = this.opt.default),
        (this.opt.default = r ? 'Y/n' : 'y/N')
    }
    _run(t) {
      this.done = t
      var e = Nd(this.rl)
      return (
        e.keypress.pipe(Jd(e.line)).forEach(this.onKeypress.bind(this)),
        e.line.pipe(Xd(1)).forEach(this.onEnd.bind(this)),
        this.render(),
        this
      )
    }
    render(t) {
      var e = this.getQuestion()
      return (
        (e += 'boolean' == typeof t ? Sn.cyan(t ? 'Yes' : 'No') : this.rl.line),
        this.screen.render(e),
        this
      )
    }
    onEnd(t) {
      this.status = 'answered'
      var e = this.opt.filter(t)
      this.render(e), this.screen.done(), this.done(e)
    }
    onKeypress() {
      this.render()
    }
  },
  Qd = { extend: oi, isNumber: Ah, findIndex: _p },
  { map: tv, takeUntil: ev } = mh
var nv = class extends Fd {
  constructor(t, e, n) {
    super(t, e, n),
      this.opt.choices || this.throwParamError('choices'),
      (this.opt.validChoices = this.opt.choices.filter(Pn.exclude)),
      (this.selected = 0),
      (this.rawDefault = 0),
      Qd.extend(this.opt, {
        validate: function (t) {
          return null != t
        }
      })
    var r = this.opt.default
    if (Qd.isNumber(r) && r >= 0 && r < this.opt.choices.realLength)
      (this.selected = r), (this.rawDefault = r)
    else if (!Qd.isNumber(r) && null != r) {
      let t = Qd.findIndex(this.opt.choices.realChoices, ({ value: t }) => t === r),
        e = Math.max(t, 0)
      ;(this.selected = e), (this.rawDefault = e)
    }
    this.opt.default = null
    const i = void 0 === this.opt.loop || this.opt.loop
    this.paginator = new Rd(void 0, { isInfinite: i })
  }
  _run(t) {
    this.done = t
    var e = Nd(this.rl),
      n = e.line.pipe(tv(this.getCurrentValue.bind(this))),
      r = this.handleSubmitEvents(n)
    return (
      r.success.forEach(this.onEnd.bind(this)),
      r.error.forEach(this.onError.bind(this)),
      e.normalizedUpKey.pipe(ev(e.line)).forEach(this.onUpKey.bind(this)),
      e.normalizedDownKey.pipe(ev(e.line)).forEach(this.onDownKey.bind(this)),
      e.keypress.pipe(ev(r.success)).forEach(this.onKeypress.bind(this)),
      this.render(),
      this
    )
  }
  render(t) {
    var e = this.getQuestion(),
      n = ''
    if ('answered' === this.status) e += Sn.cyan(this.answer)
    else {
      var r = (function (t, e) {
        var n = '',
          r = 0
        return (
          t.forEach(function (t, i) {
            if (((n += '\n  '), 'separator' === t.type)) return r++, void (n += ' ' + t)
            var o = i - r,
              u = o + 1 + ') ' + t.name
            o === e && (u = Sn.cyan(u)), (n += u)
          }),
          n
        )
      })(this.opt.choices, this.selected)
      ;(e += '\n' + this.paginator.paginate(r, this.selected, this.opt.pageSize)),
        (e += '\n  Answer: ')
    }
    ;(e += this.rl.line), t && (n = '\n' + Sn.red('>> ') + t), this.screen.render(e, n)
  }
  getCurrentValue(t) {
    null == t ? (t = this.rawDefault) : '' === t ? (t = this.selected) : (t -= 1)
    var e = this.opt.choices.getChoice(t)
    return e ? e.value : null
  }
  onEnd(t) {
    ;(this.status = 'answered'),
      (this.answer = t.value),
      this.render(),
      this.screen.done(),
      this.done(t.value)
  }
  onError() {
    this.render('Please enter a valid index')
  }
  onKeypress() {
    var t = this.rl.line.length ? Number(this.rl.line) - 1 : 0
    this.opt.choices.getChoice(t) ? (this.selected = t) : (this.selected = void 0),
      this.render()
  }
  onUpKey() {
    this.onArrowKey('up')
  }
  onDownKey() {
    this.onArrowKey('down')
  }
  onArrowKey(t) {
    ;(this.selected = Ld(this.selected, t, this.opt)),
      (this.rl.line = String(this.selected + 1))
  }
}
var rv = function (t) {
  return t != t
}
var iv = function (t, e, n) {
  for (var r = n - 1, i = t.length; ++r < i; ) if (t[r] === e) return r
  return -1
}
var ov = function (t, e, n) {
  return e == e ? iv(t, e, n) : kh(t, rv, n)
}
var uv = function (t, e) {
  return !!(null == t ? 0 : t.length) && ov(t, e, 0) > -1
}
var sv = function (t, e, n) {
  for (var r = -1, i = null == t ? 0 : t.length; ++r < i; ) if (n(e, t[r])) return !0
  return !1
}
var cv = function () {},
  av =
    vo && 1 / Uh(new vo([, -0]))[1] == 1 / 0
      ? function (t) {
          return new vo(t)
        }
      : cv
var fv = function (t, e, n) {
  var r = -1,
    i = uv,
    o = t.length,
    u = !0,
    s = [],
    c = s
  if (n) (u = !1), (i = sv)
  else if (o >= 200) {
    var a = e ? null : av(t)
    if (a) return Uh(a)
    ;(u = !1), (i = Rh), (c = new Bh())
  } else c = e ? [] : s
  t: for (; ++r < o; ) {
    var f = t[r],
      l = e ? e(f) : f
    if (((f = n || 0 !== f ? f : 0), u && l == l)) {
      for (var h = c.length; h--; ) if (c[h] === l) continue t
      e && c.push(l), s.push(f)
    } else i(c, l, n) || (c !== s && c.push(l), s.push(f))
  }
  return s
}
var lv = {
    uniq: function (t) {
      return t && t.length ? fv(t) : []
    },
    isString: Ep,
    isNumber: Ah,
    findIndex: _p
  },
  { map: hv, takeUntil: pv } = mh
var dv = class extends Fd {
    constructor(t, e, n) {
      super(t, e, n),
        this.opt.choices || this.throwParamError('choices'),
        this.validateChoices(this.opt.choices),
        this.opt.choices.push({
          key: 'h',
          name: 'Help, list all options',
          value: 'help'
        }),
        (this.opt.validate = (t) =>
          null == t ? 'Please enter a valid command' : 'help' !== t),
        (this.opt.default = this.generateChoicesString(
          this.opt.choices,
          this.opt.default
        )),
        (this.paginator = new Rd(this.screen))
    }
    _run(t) {
      this.done = t
      var e = Nd(this.rl),
        n = this.handleSubmitEvents(e.line.pipe(hv(this.getCurrentValue.bind(this))))
      return (
        n.success.forEach(this.onSubmit.bind(this)),
        n.error.forEach(this.onError.bind(this)),
        (this.keypressObs = e.keypress
          .pipe(pv(n.success))
          .forEach(this.onKeypress.bind(this))),
        this.render(),
        this
      )
    }
    render(t, e) {
      var n = this.getQuestion(),
        r = ''
      if ('answered' === this.status) n += Sn.cyan(this.answer)
      else if ('expanded' === this.status) {
        var i = (function (t, e) {
          var n = ''
          return (
            t.forEach((t) => {
              if (((n += '\n  '), 'separator' !== t.type)) {
                var r = t.key + ') ' + t.name
                e === t.key && (r = Sn.cyan(r)), (n += r)
              } else n += ' ' + t
            }),
            n
          )
        })(this.opt.choices, this.selectedKey)
        ;(n += this.paginator.paginate(i, this.selectedKey, this.opt.pageSize)),
          (n += '\n  Answer: ')
      }
      ;(n += this.rl.line),
        t && (r = Sn.red('>> ') + t),
        e && (r = Sn.cyan('>> ') + e),
        this.screen.render(n, r)
    }
    getCurrentValue(t) {
      t || (t = this.rawDefault)
      var e = this.opt.choices.where({ key: t.toLowerCase().trim() })[0]
      return e ? e.value : null
    }
    getChoices() {
      var t = ''
      return (
        this.opt.choices.forEach((e) => {
          if (((t += '\n  '), 'separator' !== e.type)) {
            var n = e.key + ') ' + e.name
            this.selectedKey === e.key && (n = Sn.cyan(n)), (t += n)
          } else t += ' ' + e
        }),
        t
      )
    }
    onError(t) {
      if ('help' === t.value)
        return (this.selectedKey = ''), (this.status = 'expanded'), void this.render()
      this.render(t.isValid)
    }
    onSubmit(t) {
      this.status = 'answered'
      var e = this.opt.choices.where({ value: t.value })[0]
      ;(this.answer = e.short || e.name),
        this.render(),
        this.screen.done(),
        this.done(t.value)
    }
    onKeypress() {
      this.selectedKey = this.rl.line.toLowerCase()
      var t = this.opt.choices.where({ key: this.selectedKey })[0]
      'expanded' === this.status ? this.render() : this.render(null, t ? t.name : null)
    }
    validateChoices(t) {
      var e,
        n = [],
        r = {}
      if (
        (t.filter(Pn.exclude).forEach((t) => {
          ;(t.key && 1 === t.key.length) || (e = !0),
            r[t.key] && n.push(t.key),
            (r[t.key] = !0),
            (t.key = String(t.key).toLowerCase())
        }),
        e)
      )
        throw new Error(
          'Format error: `key` param must be a single letter and is required.'
        )
      if (r.h)
        throw new Error(
          'Reserved key error: `key` param cannot be `h` - this value is reserved.'
        )
      if (n.length)
        throw new Error(
          'Duplicate key error: `key` param must be unique. Duplicates: ' +
            lv.uniq(n).join(', ')
        )
    }
    generateChoicesString(t, e) {
      var n = t.realLength - 1
      if (lv.isNumber(e) && this.opt.choices.getChoice(e)) n = e
      else if (lv.isString(e)) {
        let r = lv.findIndex(t.realChoices, ({ value: t }) => t === e)
        n = -1 === r ? n : r
      }
      var r = this.opt.choices.pluck('key')
      return (this.rawDefault = r[n]), (r[n] = String(r[n]).toUpperCase()), r.join('')
    }
  },
  vv = { isArray: $r, map: od, isString: Ep },
  { map: yv, takeUntil: bv } = mh
var gv = class extends Fd {
    constructor(t, e, n) {
      super(t, e, n),
        this.opt.choices || this.throwParamError('choices'),
        vv.isArray(this.opt.default) &&
          this.opt.choices.forEach(function (t) {
            this.opt.default.indexOf(t.value) >= 0 && (t.checked = !0)
          }, this),
        (this.pointer = 0),
        (this.opt.default = null)
      const r = void 0 === this.opt.loop || this.opt.loop
      this.paginator = new Rd(this.screen, { isInfinite: r })
    }
    _run(t) {
      this.done = t
      var e = Nd(this.rl),
        n = this.handleSubmitEvents(e.line.pipe(yv(this.getCurrentValue.bind(this))))
      return (
        n.success.forEach(this.onEnd.bind(this)),
        n.error.forEach(this.onError.bind(this)),
        e.normalizedUpKey.pipe(bv(n.success)).forEach(this.onUpKey.bind(this)),
        e.normalizedDownKey.pipe(bv(n.success)).forEach(this.onDownKey.bind(this)),
        e.numberKey.pipe(bv(n.success)).forEach(this.onNumberKey.bind(this)),
        e.spaceKey.pipe(bv(n.success)).forEach(this.onSpaceKey.bind(this)),
        e.aKey.pipe(bv(n.success)).forEach(this.onAllKey.bind(this)),
        e.iKey.pipe(bv(n.success)).forEach(this.onInverseKey.bind(this)),
        Yp.hide(),
        this.render(),
        (this.firstRender = !1),
        this
      )
    }
    render(t) {
      var e = this.getQuestion(),
        n = ''
      if (
        (this.spaceKeyPressed ||
          (e +=
            '(Press ' +
            Sn.cyan.bold('<space>') +
            ' to select, ' +
            Sn.cyan.bold('<a>') +
            ' to toggle all, ' +
            Sn.cyan.bold('<i>') +
            ' to invert selection)'),
        'answered' === this.status)
      )
        e += Sn.cyan(this.selection.join(', '))
      else {
        var r = (function (t, e) {
            var n = '',
              r = 0
            return (
              t.forEach(function (t, i) {
                if ('separator' === t.type) return r++, void (n += ' ' + t + '\n')
                if (t.disabled)
                  r++,
                    (n += ' - ' + t.name),
                    (n +=
                      ' (' + (vv.isString(t.disabled) ? t.disabled : 'Disabled') + ')')
                else {
                  var o = (t.checked ? Sn.green(In.radioOn) : In.radioOff) + ' ' + t.name
                  n += i - r === e ? Sn.cyan(In.pointer + o) : ' ' + o
                }
                n += '\n'
              }),
              n.replace(/\n$/, '')
            )
          })(this.opt.choices, this.pointer),
          i = this.opt.choices.indexOf(this.opt.choices.getChoice(this.pointer)),
          o =
            this.opt.choices.reduce(function (t, e, n) {
              if (n > i) return t
              if ('separator' === e.type) return t + 1
              var r = e.name
              return 'string' != typeof r ? t + 1 : t + (r = r.split('\n')).length
            }, 0) - 1
        e += '\n' + this.paginator.paginate(r, o, this.opt.pageSize)
      }
      t && (n = Sn.red('>> ') + t), this.screen.render(e, n)
    }
    onEnd(t) {
      ;(this.status = 'answered'),
        (this.spaceKeyPressed = !0),
        this.render(),
        this.screen.done(),
        Yp.show(),
        this.done(t.value)
    }
    onError(t) {
      this.render(t.isValid)
    }
    getCurrentValue() {
      var t = this.opt.choices.filter(function (t) {
        return Boolean(t.checked) && !t.disabled
      })
      return (this.selection = vv.map(t, 'short')), vv.map(t, 'value')
    }
    onUpKey() {
      ;(this.pointer = Ld(this.pointer, 'up', this.opt)), this.render()
    }
    onDownKey() {
      ;(this.pointer = Ld(this.pointer, 'down', this.opt)), this.render()
    }
    onNumberKey(t) {
      t <= this.opt.choices.realLength &&
        ((this.pointer = t - 1), this.toggleChoice(this.pointer)),
        this.render()
    }
    onSpaceKey() {
      ;(this.spaceKeyPressed = !0), this.toggleChoice(this.pointer), this.render()
    }
    onAllKey() {
      var t = Boolean(
        this.opt.choices.find(function (t) {
          return 'separator' !== t.type && !t.checked
        })
      )
      this.opt.choices.forEach(function (e) {
        'separator' !== e.type && (e.checked = t)
      }),
        this.render()
    }
    onInverseKey() {
      this.opt.choices.forEach(function (t) {
        'separator' !== t.type && (t.checked = !t.checked)
      }),
        this.render()
    }
    toggleChoice(t) {
      var e = this.opt.choices.getChoice(t)
      void 0 !== e && (this.opt.choices.getChoice(t).checked = !e.checked)
    }
  },
  { map: mv, takeUntil: Dv } = mh
function wv(t, e) {
  return (
    (e = 'string' == typeof e ? e : '*'),
    0 === (t = String(t)).length ? '' : new Array(t.length + 1).join(e)
  )
}
var _v,
  Ev = class extends Fd {
    _run(t) {
      this.done = t
      var e = Nd(this.rl),
        n = e.line.pipe(mv(this.filterInput.bind(this))),
        r = this.handleSubmitEvents(n)
      return (
        r.success.forEach(this.onEnd.bind(this)),
        r.error.forEach(this.onError.bind(this)),
        e.keypress.pipe(Dv(r.success)).forEach(this.onKeypress.bind(this)),
        this.render(),
        this
      )
    }
    render(t) {
      var e = this.getQuestion(),
        n = ''
      'answered' === this.status
        ? (e += this.opt.mask
            ? Sn.cyan(wv(this.answer, this.opt.mask))
            : Sn.italic.dim('[hidden]'))
        : this.opt.mask
        ? (e += wv(this.rl.line || '', this.opt.mask))
        : (e += Sn.italic.dim('[input is hidden] ')),
        t && (n = '\n' + Sn.red('>> ') + t),
        this.screen.render(e, n)
    }
    filterInput(t) {
      return t || (null == this.opt.default ? '' : this.opt.default)
    }
    onEnd(t) {
      ;(this.status = 'answered'),
        (this.answer = t.value),
        this.render(),
        this.screen.done(),
        this.done(t.value)
    }
    onError(t) {
      this.render(t.isValid)
    }
    onKeypress() {
      this.opt.default && (this.opt.default = void 0), this.render()
    }
  },
  xv = function (t, e, n, r, i) {
    ;(this.confidence = n), (this.name = r || e.name(t)), (this.lang = i)
  },
  Sv = Ft(function (t) {
    function e() {}
    ;(t.exports.UTF_16BE = function () {
      ;(this.name = function () {
        return 'UTF-16BE'
      }),
        (this.match = function (t) {
          var e = t.fRawInput
          return e.length >= 2 && 254 == (255 & e[0]) && 255 == (255 & e[1])
            ? new xv(t, this, 100)
            : null
        })
    }),
      (t.exports.UTF_16LE = function () {
        ;(this.name = function () {
          return 'UTF-16LE'
        }),
          (this.match = function (t) {
            var e = t.fRawInput
            return e.length >= 2 && 255 == (255 & e[0]) && 254 == (255 & e[1])
              ? e.length >= 4 && 0 == e[2] && 0 == e[3]
                ? null
                : new xv(t, this, 100)
              : null
          })
      }),
      (e.prototype.match = function (t) {
        var e = t.fRawInput,
          n = (t.fRawLength / 4) * 4,
          r = 0,
          i = 0,
          o = !1,
          u = 0
        if (0 == n) return null
        65279 == this.getChar(e, 0) && (o = !0)
        for (var s = 0; s < n; s += 4) {
          var c = this.getChar(e, s)
          c < 0 || c >= 1114111 || (c >= 55296 && c <= 57343) ? (i += 1) : (r += 1)
        }
        return (
          o && 0 == i
            ? (u = 100)
            : o && r > 10 * i
            ? (u = 80)
            : r > 3 && 0 == i
            ? (u = 100)
            : r > 0 && 0 == i
            ? (u = 80)
            : r > 10 * i && (u = 25),
          0 == u ? null : new xv(t, this, u)
        )
      }),
      (t.exports.UTF_32BE = function () {
        ;(this.name = function () {
          return 'UTF-32BE'
        }),
          (this.getChar = function (t, e) {
            return (
              ((255 & t[e + 0]) << 24) |
              ((255 & t[e + 1]) << 16) |
              ((255 & t[e + 2]) << 8) |
              (255 & t[e + 3])
            )
          })
      }),
      w.default.inherits(t.exports.UTF_32BE, e),
      (t.exports.UTF_32LE = function () {
        ;(this.name = function () {
          return 'UTF-32LE'
        }),
          (this.getChar = function (t, e) {
            return (
              ((255 & t[e + 3]) << 24) |
              ((255 & t[e + 2]) << 16) |
              ((255 & t[e + 1]) << 8) |
              (255 & t[e + 0])
            )
          })
      }),
      w.default.inherits(t.exports.UTF_32LE, e)
  }),
  Cv = Ft(function (t) {
    function e() {
      ;(this.charValue = 0),
        (this.index = 0),
        (this.nextIndex = 0),
        (this.error = !1),
        (this.done = !1),
        (this.reset = function () {
          ;(this.charValue = 0),
            (this.index = -1),
            (this.nextIndex = 0),
            (this.error = !1),
            (this.done = !1)
        }),
        (this.nextByte = function (t) {
          return this.nextIndex >= t.fRawLength
            ? ((this.done = !0), -1)
            : 255 & t.fRawInput[this.nextIndex++]
        })
    }
    function n() {}
    function r(t, e) {
      ;(t.index = t.nextIndex), (t.error = !1)
      var n = 0,
        r = 0,
        i = 0
      return (
        (n = t.charValue = t.nextByte(e)) < 0
          ? (t.done = !0)
          : n <= 141 ||
            ((r = t.nextByte(e)),
            (t.charValue = (t.charValue << 8) | r),
            n >= 161 && n <= 254
              ? r < 161 && (t.error = !0)
              : 142 != n
              ? 143 == n &&
                ((i = t.nextByte(e)),
                (t.charValue = (t.charValue << 8) | i),
                i < 161 && (t.error = !0))
              : r < 161 && (t.error = !0)),
        0 == t.done
      )
    }
    ;(n.prototype.match = function (t) {
      var n,
        r = 0,
        i = 0,
        o = 0,
        u = 0,
        s = 0,
        c = new e()
      t: {
        for (c.reset(); this.nextChar(c, t); ) {
          if ((u++, c.error)) o++
          else {
            var a = 4294967295 & c.charValue
            a <= 255 ||
              (r++,
              null != this.commonChars &&
                (function t(e, n, r, i) {
                  if (i < r) return -1
                  var o = Math.floor((r + i) >>> 1)
                  return n > e[o] ? t(e, n, o + 1, i) : n < e[o] ? t(e, n, r, o - 1) : o
                })((n = this.commonChars), a, 0, n.length - 1) >= 0 &&
                i++)
          }
          if (o >= 2 && 5 * o >= r) break t
        }
        if (r <= 10 && 0 == o) s = 0 == r && u < 10 ? 0 : 10
        else if (r < 20 * o) s = 0
        else if (null == this.commonChars) (s = 30 + r - 20 * o) > 100 && (s = 100)
        else {
          var f = 90 / Math.log(parseFloat(r) / 4)
          ;(s = Math.floor(Math.log(i + 1) * f + 10)), (s = Math.min(s, 100))
        }
      }
      return 0 == s ? null : new xv(t, this, s)
    }),
      (n.prototype.nextChar = function (t, e) {}),
      (t.exports.sjis = function () {
        ;(this.name = function () {
          return 'Shift-JIS'
        }),
          (this.language = function () {
            return 'ja'
          }),
          (this.commonChars = [
            33088,
            33089,
            33090,
            33093,
            33115,
            33129,
            33130,
            33141,
            33142,
            33440,
            33442,
            33444,
            33449,
            33450,
            33451,
            33453,
            33455,
            33457,
            33459,
            33461,
            33463,
            33469,
            33470,
            33473,
            33476,
            33477,
            33478,
            33480,
            33481,
            33484,
            33485,
            33500,
            33504,
            33511,
            33512,
            33513,
            33514,
            33520,
            33521,
            33601,
            33603,
            33614,
            33615,
            33624,
            33630,
            33634,
            33639,
            33653,
            33654,
            33673,
            33674,
            33675,
            33677,
            33683,
            36502,
            37882,
            38314
          ]),
          (this.nextChar = function (t, e) {
            var n
            if (
              ((t.index = t.nextIndex),
              (t.error = !1),
              (n = t.charValue = t.nextByte(e)) < 0)
            )
              return !1
            if (n <= 127 || (n > 160 && n <= 223)) return !0
            var r = t.nextByte(e)
            return (
              !(r < 0) &&
              ((t.charValue = (n << 8) | r),
              (r >= 64 && r <= 127) || (r >= 128 && r <= 255) || (t.error = !0),
              !0)
            )
          })
      }),
      w.default.inherits(t.exports.sjis, n),
      (t.exports.big5 = function () {
        ;(this.name = function () {
          return 'Big5'
        }),
          (this.language = function () {
            return 'zh'
          }),
          (this.commonChars = [
            41280,
            41281,
            41282,
            41283,
            41287,
            41289,
            41333,
            41334,
            42048,
            42054,
            42055,
            42056,
            42065,
            42068,
            42071,
            42084,
            42090,
            42092,
            42103,
            42147,
            42148,
            42151,
            42177,
            42190,
            42193,
            42207,
            42216,
            42237,
            42304,
            42312,
            42328,
            42345,
            42445,
            42471,
            42583,
            42593,
            42594,
            42600,
            42608,
            42664,
            42675,
            42681,
            42707,
            42715,
            42726,
            42738,
            42816,
            42833,
            42841,
            42970,
            43171,
            43173,
            43181,
            43217,
            43219,
            43236,
            43260,
            43456,
            43474,
            43507,
            43627,
            43706,
            43710,
            43724,
            43772,
            44103,
            44111,
            44208,
            44242,
            44377,
            44745,
            45024,
            45290,
            45423,
            45747,
            45764,
            45935,
            46156,
            46158,
            46412,
            46501,
            46525,
            46544,
            46552,
            46705,
            47085,
            47207,
            47428,
            47832,
            47940,
            48033,
            48593,
            49860,
            50105,
            50240,
            50271
          ]),
          (this.nextChar = function (t, e) {
            ;(t.index = t.nextIndex), (t.error = !1)
            var n = (t.charValue = t.nextByte(e))
            if (n < 0) return !1
            if (n <= 127 || 255 == n) return !0
            var r = t.nextByte(e)
            return (
              !(r < 0) &&
              ((t.charValue = (t.charValue << 8) | r),
              (r < 64 || 127 == r || 255 == r) && (t.error = !0),
              !0)
            )
          })
      }),
      w.default.inherits(t.exports.big5, n),
      (t.exports.euc_jp = function () {
        ;(this.name = function () {
          return 'EUC-JP'
        }),
          (this.language = function () {
            return 'ja'
          }),
          (this.commonChars = [
            41377,
            41378,
            41379,
            41382,
            41404,
            41418,
            41419,
            41430,
            41431,
            42146,
            42148,
            42150,
            42152,
            42154,
            42155,
            42156,
            42157,
            42159,
            42161,
            42163,
            42165,
            42167,
            42169,
            42171,
            42173,
            42175,
            42176,
            42177,
            42179,
            42180,
            42182,
            42183,
            42184,
            42185,
            42186,
            42187,
            42190,
            42191,
            42192,
            42206,
            42207,
            42209,
            42210,
            42212,
            42216,
            42217,
            42218,
            42219,
            42220,
            42223,
            42226,
            42227,
            42402,
            42403,
            42404,
            42406,
            42407,
            42410,
            42413,
            42415,
            42416,
            42419,
            42421,
            42423,
            42424,
            42425,
            42431,
            42435,
            42438,
            42439,
            42440,
            42441,
            42443,
            42448,
            42453,
            42454,
            42455,
            42462,
            42464,
            42465,
            42469,
            42473,
            42474,
            42475,
            42476,
            42477,
            42483,
            47273,
            47572,
            47854,
            48072,
            48880,
            49079,
            50410,
            50940,
            51133,
            51896,
            51955,
            52188,
            52689
          ]),
          (this.nextChar = r)
      }),
      w.default.inherits(t.exports.euc_jp, n),
      (t.exports.euc_kr = function () {
        ;(this.name = function () {
          return 'EUC-KR'
        }),
          (this.language = function () {
            return 'ko'
          }),
          (this.commonChars = [
            45217,
            45235,
            45253,
            45261,
            45268,
            45286,
            45293,
            45304,
            45306,
            45308,
            45496,
            45497,
            45511,
            45527,
            45538,
            45994,
            46011,
            46274,
            46287,
            46297,
            46315,
            46501,
            46517,
            46527,
            46535,
            46569,
            46835,
            47023,
            47042,
            47054,
            47270,
            47278,
            47286,
            47288,
            47291,
            47337,
            47531,
            47534,
            47564,
            47566,
            47613,
            47800,
            47822,
            47824,
            47857,
            48103,
            48115,
            48125,
            48301,
            48314,
            48338,
            48374,
            48570,
            48576,
            48579,
            48581,
            48838,
            48840,
            48863,
            48878,
            48888,
            48890,
            49057,
            49065,
            49088,
            49124,
            49131,
            49132,
            49144,
            49319,
            49327,
            49336,
            49338,
            49339,
            49341,
            49351,
            49356,
            49358,
            49359,
            49366,
            49370,
            49381,
            49403,
            49404,
            49572,
            49574,
            49590,
            49622,
            49631,
            49654,
            49656,
            50337,
            50637,
            50862,
            51151,
            51153,
            51154,
            51160,
            51173,
            51373
          ]),
          (this.nextChar = r)
      }),
      w.default.inherits(t.exports.euc_kr, n),
      (t.exports.gb_18030 = function () {
        ;(this.name = function () {
          return 'GB18030'
        }),
          (this.language = function () {
            return 'zh'
          }),
          (this.nextChar = function (t, e) {
            ;(t.index = t.nextIndex), (t.error = !1)
            var n = 0,
              r = 0,
              i = 0,
              o = 0
            t: if ((n = t.charValue = t.nextByte(e)) < 0) t.done = !0
            else if (!(n <= 128))
              if (
                ((r = t.nextByte(e)),
                (t.charValue = (t.charValue << 8) | r),
                n >= 129 && n <= 254)
              ) {
                if ((r >= 64 && r <= 126) || (r >= 80 && r <= 254)) break t
                if (
                  r >= 48 &&
                  r <= 57 &&
                  (i = t.nextByte(e)) >= 129 &&
                  i <= 254 &&
                  (o = t.nextByte(e)) >= 48 &&
                  o <= 57
                ) {
                  t.charValue = (t.charValue << 16) | (i << 8) | o
                  break t
                }
                t.error = !0
              } else;
            return 0 == t.done
          }),
          (this.commonChars = [
            41377,
            41378,
            41379,
            41380,
            41392,
            41393,
            41457,
            41459,
            41889,
            41900,
            41914,
            45480,
            45496,
            45502,
            45755,
            46025,
            46070,
            46323,
            46525,
            46532,
            46563,
            46767,
            46804,
            46816,
            47010,
            47016,
            47037,
            47062,
            47069,
            47284,
            47327,
            47350,
            47531,
            47561,
            47576,
            47610,
            47613,
            47821,
            48039,
            48086,
            48097,
            48122,
            48316,
            48347,
            48382,
            48588,
            48845,
            48861,
            49076,
            49094,
            49097,
            49332,
            49389,
            49611,
            49883,
            50119,
            50396,
            50410,
            50636,
            50935,
            51192,
            51371,
            51403,
            51413,
            51431,
            51663,
            51706,
            51889,
            51893,
            51911,
            51920,
            51926,
            51957,
            51965,
            52460,
            52728,
            52906,
            52932,
            52946,
            52965,
            53173,
            53186,
            53206,
            53442,
            53445,
            53456,
            53460,
            53671,
            53930,
            53938,
            53941,
            53947,
            53972,
            54211,
            54224,
            54269,
            54466,
            54490,
            54754,
            54992
          ])
      }),
      w.default.inherits(t.exports.gb_18030, n)
  }),
  Fv = Ft(function (t) {
    function e(t, e) {
      ;(this.byteIndex = 0),
        (this.ngram = 0),
        (this.ngramList = t),
        (this.byteMap = e),
        (this.ngramCount = 0),
        (this.hitCount = 0),
        this.spaceChar,
        (this.search = function (t, e) {
          var n = 0
          return (
            t[n + 32] <= e && (n += 32),
            t[n + 16] <= e && (n += 16),
            t[n + 8] <= e && (n += 8),
            t[n + 4] <= e && (n += 4),
            t[n + 2] <= e && (n += 2),
            t[n + 1] <= e && (n += 1),
            t[n] > e && (n -= 1),
            n < 0 || t[n] != e ? -1 : n
          )
        }),
        (this.lookup = function (t) {
          ;(this.ngramCount += 1),
            this.search(this.ngramList, t) >= 0 && (this.hitCount += 1)
        }),
        (this.addByte = function (t) {
          ;(this.ngram = ((this.ngram << 8) + (255 & t)) & 16777215),
            this.lookup(this.ngram)
        }),
        (this.nextByte = function (t) {
          return this.byteIndex >= t.fInputLen
            ? -1
            : 255 & t.fInputBytes[this.byteIndex++]
        }),
        (this.parse = function (t, e) {
          var n,
            r = !1
          for (this.spaceChar = e; (n = this.nextByte(t)) >= 0; ) {
            var i = this.byteMap[n]
            0 != i &&
              ((i == this.spaceChar && r) || this.addByte(i), (r = i == this.spaceChar))
          }
          this.addByte(this.spaceChar)
          var o = this.hitCount / this.ngramCount
          return o > 0.33 ? 98 : Math.floor(300 * o)
        })
    }
    function n(t, e) {
      ;(this.fLang = t), (this.fNGrams = e)
    }
    function r() {}
    ;(r.prototype.spaceChar = 32),
      (r.prototype.ngrams = function () {}),
      (r.prototype.byteMap = function () {}),
      (r.prototype.match = function (t) {
        var r = this.ngrams()
        if (!(Array.isArray(r) && r[0] instanceof n))
          return (s = new e(r, this.byteMap()).parse(t, this.spaceChar)) <= 0
            ? null
            : new xv(t, this, s)
        for (var i = -1, o = null, u = r.length - 1; u >= 0; u--) {
          var s,
            c = r[u]
          ;(s = new e(c.fNGrams, this.byteMap()).parse(t, this.spaceChar)) > i &&
            ((i = s), (o = c.fLang))
        }
        var a = this.name(t)
        return i <= 0 ? null : new xv(t, this, i, a, o)
      }),
      (t.exports.ISO_8859_1 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            170,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            181,
            32,
            32,
            32,
            32,
            186,
            32,
            32,
            32,
            32,
            32,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            32,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            32,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            255
          ]
        }),
          (this.ngrams = function () {
            return [
              new n('da', [
                2122086,
                2122100,
                2122853,
                2123118,
                2123122,
                2123375,
                2123873,
                2124064,
                2125157,
                2125671,
                2126053,
                2126697,
                2126708,
                2126953,
                2127465,
                6383136,
                6385184,
                6385252,
                6386208,
                6386720,
                6579488,
                6579566,
                6579570,
                6579572,
                6627443,
                6644768,
                6644837,
                6647328,
                6647396,
                6648352,
                6648421,
                6648608,
                6648864,
                6713202,
                6776096,
                6776174,
                6776178,
                6907749,
                6908960,
                6909543,
                7038240,
                7039845,
                7103858,
                7104871,
                7105637,
                7169380,
                7234661,
                7234848,
                7235360,
                7235429,
                7300896,
                7302432,
                7303712,
                7398688,
                7479396,
                7479397,
                7479411,
                7496992,
                7566437,
                7610483,
                7628064,
                7628146,
                7629164,
                7759218
              ]),
              new n('de', [
                2122094,
                2122101,
                2122341,
                2122849,
                2122853,
                2122857,
                2123113,
                2123621,
                2123873,
                2124142,
                2125161,
                2126691,
                2126693,
                2127214,
                2127461,
                2127471,
                2127717,
                2128501,
                6448498,
                6514720,
                6514789,
                6514804,
                6578547,
                6579566,
                6579570,
                6580581,
                6627428,
                6627443,
                6646126,
                6646132,
                6647328,
                6648352,
                6648608,
                6776174,
                6841710,
                6845472,
                6906728,
                6907168,
                6909472,
                6909541,
                6911008,
                7104867,
                7105637,
                7217249,
                7217252,
                7217267,
                7234592,
                7234661,
                7234848,
                7235360,
                7235429,
                7238757,
                7479396,
                7496805,
                7497065,
                7562088,
                7566437,
                7610468,
                7628064,
                7628142,
                7628146,
                7695972,
                7695975,
                7759218
              ]),
              new n('en', [
                2122016,
                2122094,
                2122341,
                2122607,
                2123375,
                2123873,
                2123877,
                2124142,
                2125153,
                2125670,
                2125938,
                2126437,
                2126689,
                2126708,
                2126952,
                2126959,
                2127720,
                6383972,
                6384672,
                6385184,
                6385252,
                6386464,
                6386720,
                6386789,
                6386793,
                6561889,
                6561908,
                6627425,
                6627443,
                6627444,
                6644768,
                6647412,
                6648352,
                6648608,
                6713202,
                6840692,
                6841632,
                6841714,
                6906912,
                6909472,
                6909543,
                6909806,
                6910752,
                7217249,
                7217268,
                7234592,
                7235360,
                7238688,
                7300640,
                7302688,
                7303712,
                7496992,
                7500576,
                7544929,
                7544948,
                7561577,
                7566368,
                7610484,
                7628146,
                7628897,
                7628901,
                7629167,
                7630624,
                7631648
              ]),
              new n('es', [
                2122016,
                2122593,
                2122607,
                2122853,
                2123116,
                2123118,
                2123123,
                2124142,
                2124897,
                2124911,
                2125921,
                2125935,
                2125938,
                2126197,
                2126437,
                2126693,
                2127214,
                2128160,
                6365283,
                6365284,
                6365285,
                6365292,
                6365296,
                6382441,
                6382703,
                6384672,
                6386208,
                6386464,
                6515187,
                6516590,
                6579488,
                6579564,
                6582048,
                6627428,
                6627429,
                6627436,
                6646816,
                6647328,
                6647412,
                6648608,
                6648692,
                6907246,
                6943598,
                7102752,
                7106419,
                7217253,
                7238757,
                7282788,
                7282789,
                7302688,
                7303712,
                7303968,
                7364978,
                7435621,
                7495968,
                7497075,
                7544932,
                7544933,
                7544944,
                7562528,
                7628064,
                7630624,
                7693600,
                15953440
              ]),
              new n('fr', [
                2122101,
                2122607,
                2122849,
                2122853,
                2122869,
                2123118,
                2123124,
                2124897,
                2124901,
                2125921,
                2125935,
                2125938,
                2126197,
                2126693,
                2126703,
                2127214,
                2154528,
                6385268,
                6386793,
                6513952,
                6516590,
                6579488,
                6579571,
                6583584,
                6627425,
                6627427,
                6627428,
                6627429,
                6627436,
                6627440,
                6627443,
                6647328,
                6647412,
                6648352,
                6648608,
                6648864,
                6649202,
                6909806,
                6910752,
                6911008,
                7102752,
                7103776,
                7103859,
                7169390,
                7217252,
                7234848,
                7238432,
                7238688,
                7302688,
                7302772,
                7304562,
                7435621,
                7479404,
                7496992,
                7544929,
                7544932,
                7544933,
                7544940,
                7544944,
                7610468,
                7628064,
                7629167,
                7693600,
                7696928
              ]),
              new n('it', [
                2122092,
                2122600,
                2122607,
                2122853,
                2122857,
                2123040,
                2124140,
                2124142,
                2124897,
                2125925,
                2125938,
                2127214,
                6365283,
                6365284,
                6365296,
                6365299,
                6386799,
                6514789,
                6516590,
                6579564,
                6580512,
                6627425,
                6627427,
                6627428,
                6627433,
                6627436,
                6627440,
                6627443,
                6646816,
                6646892,
                6647412,
                6648352,
                6841632,
                6889569,
                6889571,
                6889572,
                6889587,
                6906144,
                6908960,
                6909472,
                6909806,
                7102752,
                7103776,
                7104800,
                7105633,
                7234848,
                7235872,
                7237408,
                7238757,
                7282785,
                7282788,
                7282793,
                7282803,
                7302688,
                7302757,
                7366002,
                7495968,
                7496992,
                7563552,
                7627040,
                7628064,
                7629088,
                7630624,
                8022383
              ]),
              new n('nl', [
                2122092,
                2122341,
                2122849,
                2122853,
                2122857,
                2123109,
                2123118,
                2123621,
                2123877,
                2124142,
                2125153,
                2125157,
                2125680,
                2126949,
                2127457,
                2127461,
                2127471,
                2127717,
                2128489,
                6381934,
                6381938,
                6385184,
                6385252,
                6386208,
                6386720,
                6514804,
                6579488,
                6579566,
                6579570,
                6627426,
                6627446,
                6645102,
                6645106,
                6647328,
                6648352,
                6648435,
                6648864,
                6776174,
                6841716,
                6907168,
                6909472,
                6909543,
                6910752,
                7217250,
                7217252,
                7217253,
                7217256,
                7217263,
                7217270,
                7234661,
                7235360,
                7302756,
                7303026,
                7303200,
                7303712,
                7562088,
                7566437,
                7610468,
                7628064,
                7628142,
                7628146,
                7758190,
                7759218,
                7761775
              ]),
              new n('no', [
                2122100,
                2122102,
                2122853,
                2123118,
                2123122,
                2123375,
                2123873,
                2124064,
                2125157,
                2125671,
                2126053,
                2126693,
                2126699,
                2126703,
                2126708,
                2126953,
                2127465,
                2155808,
                6385252,
                6386208,
                6386720,
                6579488,
                6579566,
                6579572,
                6627443,
                6644768,
                6647328,
                6647397,
                6648352,
                6648421,
                6648864,
                6648948,
                6713202,
                6776174,
                6908779,
                6908960,
                6909543,
                7038240,
                7039845,
                7103776,
                7105637,
                7169380,
                7169390,
                7217267,
                7234848,
                7235360,
                7235429,
                7237221,
                7300896,
                7302432,
                7303712,
                7398688,
                7479411,
                7496992,
                7565165,
                7566437,
                7610483,
                7628064,
                7628142,
                7628146,
                7629164,
                7631904,
                7631973,
                7759218
              ]),
              new n('pt', [
                2122016,
                2122607,
                2122849,
                2122853,
                2122863,
                2123040,
                2123123,
                2125153,
                2125423,
                2125600,
                2125921,
                2125935,
                2125938,
                2126197,
                2126437,
                2126693,
                2127213,
                6365281,
                6365283,
                6365284,
                6365296,
                6382693,
                6382703,
                6384672,
                6386208,
                6386273,
                6386464,
                6516589,
                6516590,
                6578464,
                6579488,
                6582048,
                6582131,
                6627425,
                6627428,
                6647072,
                6647412,
                6648608,
                6648692,
                6906144,
                6906721,
                7169390,
                7238757,
                7238767,
                7282785,
                7282787,
                7282788,
                7282789,
                7282800,
                7303968,
                7364978,
                7435621,
                7495968,
                7497075,
                7544929,
                7544932,
                7544933,
                7544944,
                7566433,
                7628064,
                7630624,
                7693600,
                14905120,
                15197039
              ]),
              new n('sv', [
                2122100,
                2122102,
                2122853,
                2123118,
                2123510,
                2123873,
                2124064,
                2124142,
                2124655,
                2125157,
                2125667,
                2126053,
                2126699,
                2126703,
                2126708,
                2126953,
                2127457,
                2127465,
                2155634,
                6382693,
                6385184,
                6385252,
                6386208,
                6386804,
                6514720,
                6579488,
                6579566,
                6579570,
                6579572,
                6644768,
                6647328,
                6648352,
                6648864,
                6747762,
                6776174,
                6909036,
                6909543,
                7037216,
                7105568,
                7169380,
                7217267,
                7233824,
                7234661,
                7235360,
                7235429,
                7235950,
                7299944,
                7302432,
                7302688,
                7398688,
                7479393,
                7479411,
                7495968,
                7564129,
                7565165,
                7610483,
                7627040,
                7628064,
                7628146,
                7629164,
                7631904,
                7758194,
                14971424,
                16151072
              ])
            ]
          }),
          (this.name = function (t) {
            return t && t.fC1Bytes ? 'windows-1252' : 'ISO-8859-1'
          })
      }),
      w.default.inherits(t.exports.ISO_8859_1, r),
      (t.exports.ISO_8859_2 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            177,
            32,
            179,
            32,
            181,
            182,
            32,
            32,
            185,
            186,
            187,
            188,
            32,
            190,
            191,
            32,
            177,
            32,
            179,
            32,
            181,
            182,
            183,
            32,
            185,
            186,
            187,
            188,
            32,
            190,
            191,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            32,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            32,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            32
          ]
        }),
          (this.ngrams = function () {
            return [
              new n('cs', [
                2122016,
                2122361,
                2122863,
                2124389,
                2125409,
                2125413,
                2125600,
                2125668,
                2125935,
                2125938,
                2126072,
                2126447,
                2126693,
                2126703,
                2126708,
                2126959,
                2127392,
                2127481,
                2128481,
                6365296,
                6513952,
                6514720,
                6627440,
                6627443,
                6627446,
                6647072,
                6647533,
                6844192,
                6844260,
                6910836,
                6972704,
                7042149,
                7103776,
                7104800,
                7233824,
                7268640,
                7269408,
                7269664,
                7282800,
                7300206,
                7301737,
                7304052,
                7304480,
                7304801,
                7368548,
                7368554,
                7369327,
                7403621,
                7562528,
                7565173,
                7566433,
                7566441,
                7566446,
                7628146,
                7630573,
                7630624,
                7676016,
                12477728,
                14773997,
                15296623,
                15540336,
                15540339,
                15559968,
                16278884
              ]),
              new n('hu', [
                2122016,
                2122106,
                2122341,
                2123111,
                2123116,
                2123365,
                2123873,
                2123887,
                2124147,
                2124645,
                2124649,
                2124790,
                2124901,
                2125153,
                2125157,
                2125161,
                2125413,
                2126714,
                2126949,
                2156915,
                6365281,
                6365291,
                6365293,
                6365299,
                6384416,
                6385184,
                6388256,
                6447470,
                6448494,
                6645625,
                6646560,
                6646816,
                6646885,
                6647072,
                6647328,
                6648421,
                6648864,
                6648933,
                6648948,
                6781216,
                6844263,
                6909556,
                6910752,
                7020641,
                7075450,
                7169383,
                7170414,
                7217249,
                7233899,
                7234923,
                7234925,
                7238688,
                7300985,
                7544929,
                7567973,
                7567988,
                7568097,
                7596391,
                7610465,
                7631904,
                7659891,
                8021362,
                14773792,
                15299360
              ]),
              new n('pl', [
                2122618,
                2122863,
                2124064,
                2124389,
                2124655,
                2125153,
                2125161,
                2125409,
                2125417,
                2125668,
                2125935,
                2125938,
                2126697,
                2127648,
                2127721,
                2127737,
                2128416,
                2128481,
                6365296,
                6365303,
                6385257,
                6514720,
                6519397,
                6519417,
                6582048,
                6584937,
                6627440,
                6627443,
                6627447,
                6627450,
                6645615,
                6646304,
                6647072,
                6647401,
                6778656,
                6906144,
                6907168,
                6907242,
                7037216,
                7039264,
                7039333,
                7170405,
                7233824,
                7235937,
                7235941,
                7282800,
                7305057,
                7305065,
                7368556,
                7369313,
                7369327,
                7369338,
                7502437,
                7502457,
                7563754,
                7564137,
                7566433,
                7825765,
                7955304,
                7957792,
                8021280,
                8022373,
                8026400,
                15955744
              ]),
              new n('ro', [
                2122016,
                2122083,
                2122593,
                2122597,
                2122607,
                2122613,
                2122853,
                2122857,
                2124897,
                2125153,
                2125925,
                2125938,
                2126693,
                2126819,
                2127214,
                2144873,
                2158190,
                6365283,
                6365284,
                6386277,
                6386720,
                6386789,
                6386976,
                6513010,
                6516590,
                6518048,
                6546208,
                6579488,
                6627425,
                6627427,
                6627428,
                6627440,
                6627443,
                6644e3,
                6646048,
                6646885,
                6647412,
                6648692,
                6889569,
                6889571,
                6889572,
                6889584,
                6907168,
                6908192,
                6909472,
                7102752,
                7103776,
                7106418,
                7107945,
                7234848,
                7238770,
                7303712,
                7365998,
                7496992,
                7497057,
                7501088,
                7594784,
                7628064,
                7631477,
                7660320,
                7694624,
                7695392,
                12216608,
                15625760
              ])
            ]
          }),
          (this.name = function (t) {
            return t && t.fC1Bytes ? 'windows-1250' : 'ISO-8859-2'
          })
      }),
      w.default.inherits(t.exports.ISO_8859_2, r),
      (t.exports.ISO_8859_5 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            251,
            252,
            32,
            254,
            255,
            208,
            209,
            210,
            211,
            212,
            213,
            214,
            215,
            216,
            217,
            218,
            219,
            220,
            221,
            222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            208,
            209,
            210,
            211,
            212,
            213,
            214,
            215,
            216,
            217,
            218,
            219,
            220,
            221,
            222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            32,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            251,
            252,
            32,
            254,
            255
          ]
        }),
          (this.ngrams = function () {
            return [
              2150944,
              2151134,
              2151646,
              2152400,
              2152480,
              2153168,
              2153182,
              2153936,
              2153941,
              2154193,
              2154462,
              2154464,
              2154704,
              2154974,
              2154978,
              2155230,
              2156514,
              2158050,
              13688280,
              13689580,
              13884960,
              14015468,
              14015960,
              14016994,
              14017056,
              14164191,
              14210336,
              14211104,
              14216992,
              14407133,
              14407712,
              14413021,
              14536736,
              14538016,
              14538965,
              14538991,
              14540320,
              14540498,
              14557394,
              14557407,
              14557409,
              14602784,
              14602960,
              14603230,
              14604576,
              14605292,
              14605344,
              14606818,
              14671579,
              14672085,
              14672088,
              14672094,
              14733522,
              14734804,
              14803664,
              14803666,
              14803672,
              14806816,
              14865883,
              14868e3,
              14868192,
              14871584,
              15196894,
              15459616
            ]
          }),
          (this.name = function (t) {
            return 'ISO-8859-5'
          }),
          (this.language = function () {
            return 'ru'
          })
      }),
      w.default.inherits(t.exports.ISO_8859_5, r),
      (t.exports.ISO_8859_6 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            193,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            210,
            211,
            212,
            213,
            214,
            215,
            216,
            217,
            218,
            32,
            32,
            32,
            32,
            32,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32
          ]
        }),
          (this.ngrams = function () {
            return [
              2148324,
              2148326,
              2148551,
              2152932,
              2154986,
              2155748,
              2156006,
              2156743,
              13050055,
              13091104,
              13093408,
              13095200,
              13100064,
              13100227,
              13100231,
              13100232,
              13100234,
              13100236,
              13100237,
              13100239,
              13100243,
              13100249,
              13100258,
              13100261,
              13100264,
              13100266,
              13100320,
              13100576,
              13100746,
              13115591,
              13181127,
              13181153,
              13181156,
              13181157,
              13181160,
              13246663,
              13574343,
              13617440,
              13705415,
              13748512,
              13836487,
              14229703,
              14279913,
              14805536,
              14950599,
              14993696,
              15001888,
              15002144,
              15016135,
              15058720,
              15059232,
              15066656,
              15081671,
              15147207,
              15189792,
              15255524,
              15263264,
              15278279,
              15343815,
              15343845,
              15343848,
              15386912,
              15388960,
              15394336
            ]
          }),
          (this.name = function (t) {
            return 'ISO-8859-6'
          }),
          (this.language = function () {
            return 'ar'
          })
      }),
      w.default.inherits(t.exports.ISO_8859_6, r),
      (t.exports.ISO_8859_7 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            161,
            162,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            220,
            32,
            221,
            222,
            223,
            32,
            252,
            32,
            253,
            254,
            192,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            32,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            251,
            220,
            221,
            222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            32
          ]
        }),
          (this.ngrams = function () {
            return [
              2154989,
              2154992,
              2155497,
              2155753,
              2156016,
              2156320,
              2157281,
              2157797,
              2158049,
              2158368,
              2158817,
              2158831,
              2158833,
              2159604,
              2159605,
              2159847,
              2159855,
              14672160,
              14754017,
              14754036,
              14805280,
              14806304,
              14807292,
              14807584,
              14936545,
              15067424,
              15069728,
              15147252,
              15199520,
              15200800,
              15278324,
              15327520,
              15330014,
              15331872,
              15393257,
              15393268,
              15525152,
              15540449,
              15540453,
              15540464,
              15589664,
              15725088,
              15725856,
              15790069,
              15790575,
              15793184,
              15868129,
              15868133,
              15868138,
              15868144,
              15868148,
              15983904,
              15984416,
              15987951,
              16048416,
              16048617,
              16050157,
              16050162,
              16050666,
              16052e3,
              16052213,
              16054765,
              16379168,
              16706848
            ]
          }),
          (this.name = function (t) {
            return t && t.fC1Bytes ? 'windows-1253' : 'ISO-8859-7'
          }),
          (this.language = function () {
            return 'el'
          })
      }),
      w.default.inherits(t.exports.ISO_8859_7, r),
      (t.exports.ISO_8859_8 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            181,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            32,
            32,
            32,
            32,
            32
          ]
        }),
          (this.ngrams = function () {
            return [
              new n('he', [
                2154725,
                2154727,
                2154729,
                2154746,
                2154985,
                2154990,
                2155744,
                2155749,
                2155753,
                2155758,
                2155762,
                2155769,
                2155770,
                2157792,
                2157796,
                2158304,
                2159340,
                2161132,
                14744096,
                14950624,
                14950625,
                14950628,
                14950636,
                14950638,
                14950649,
                15001056,
                15065120,
                15068448,
                15068960,
                15071264,
                15071776,
                15278308,
                15328288,
                15328762,
                15329773,
                15330592,
                15331104,
                15333408,
                15333920,
                15474912,
                15474916,
                15523872,
                15524896,
                15540448,
                15540449,
                15540452,
                15540460,
                15540462,
                15540473,
                15655968,
                15671524,
                15787040,
                15788320,
                15788525,
                15920160,
                16261348,
                16312813,
                16378912,
                16392416,
                16392417,
                16392420,
                16392428,
                16392430,
                16392441
              ]),
              new n('he', [
                2154725,
                2154732,
                2155753,
                2155756,
                2155758,
                2155760,
                2157040,
                2157810,
                2157817,
                2158053,
                2158057,
                2158565,
                2158569,
                2160869,
                2160873,
                2161376,
                2161381,
                2161385,
                14688484,
                14688492,
                14688493,
                14688506,
                14738464,
                14738916,
                14740512,
                14741024,
                14754020,
                14754029,
                14754042,
                14950628,
                14950633,
                14950636,
                14950637,
                14950639,
                14950648,
                14950650,
                15002656,
                15065120,
                15066144,
                15196192,
                15327264,
                15327520,
                15328288,
                15474916,
                15474925,
                15474938,
                15528480,
                15530272,
                15591913,
                15591920,
                15591928,
                15605988,
                15605997,
                15606010,
                15655200,
                15655968,
                15918112,
                16326884,
                16326893,
                16326906,
                16376864,
                16441376,
                16442400,
                16442857
              ])
            ]
          }),
          (this.name = function (t) {
            return t && t.fC1Bytes ? 'windows-1255' : 'ISO-8859-8'
          }),
          (this.language = function () {
            return 'he'
          })
      }),
      w.default.inherits(t.exports.ISO_8859_8, r),
      (t.exports.ISO_8859_9 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            170,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            181,
            32,
            32,
            32,
            32,
            186,
            32,
            32,
            32,
            32,
            32,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            32,
            248,
            249,
            250,
            251,
            252,
            105,
            254,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            32,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            255
          ]
        }),
          (this.ngrams = function () {
            return [
              2122337,
              2122345,
              2122357,
              2122849,
              2122853,
              2123621,
              2123873,
              2124140,
              2124641,
              2124655,
              2125153,
              2125676,
              2126689,
              2126945,
              2127461,
              2128225,
              6365282,
              6384416,
              6384737,
              6384993,
              6385184,
              6385405,
              6386208,
              6386273,
              6386429,
              6386685,
              6388065,
              6449522,
              6578464,
              6579488,
              6580512,
              6627426,
              6627435,
              6644841,
              6647328,
              6648352,
              6648425,
              6648681,
              6909029,
              6909472,
              6909545,
              6910496,
              7102830,
              7102834,
              7103776,
              7103858,
              7217249,
              7217250,
              7217259,
              7234657,
              7234661,
              7234848,
              7235872,
              7235950,
              7273760,
              7498094,
              7535982,
              7759136,
              7954720,
              7958386,
              16608800,
              16608868,
              16609021,
              16642301
            ]
          }),
          (this.name = function (t) {
            return t && t.fC1Bytes ? 'windows-1254' : 'ISO-8859-9'
          }),
          (this.language = function () {
            return 'tr'
          })
      }),
      w.default.inherits(t.exports.ISO_8859_9, r),
      (t.exports.windows_1251 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            144,
            131,
            32,
            131,
            32,
            32,
            32,
            32,
            32,
            32,
            154,
            32,
            156,
            157,
            158,
            159,
            144,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            154,
            32,
            156,
            157,
            158,
            159,
            32,
            162,
            162,
            188,
            32,
            180,
            32,
            32,
            184,
            32,
            186,
            32,
            32,
            32,
            32,
            191,
            32,
            32,
            179,
            179,
            180,
            181,
            32,
            32,
            184,
            32,
            186,
            32,
            188,
            190,
            190,
            191,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            255,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            255
          ]
        }),
          (this.ngrams = function () {
            return [
              2155040,
              2155246,
              2155758,
              2156512,
              2156576,
              2157280,
              2157294,
              2158048,
              2158053,
              2158305,
              2158574,
              2158576,
              2158816,
              2159086,
              2159090,
              2159342,
              2160626,
              2162162,
              14740968,
              14742268,
              14937632,
              15068156,
              15068648,
              15069682,
              15069728,
              15212783,
              15263008,
              15263776,
              15269664,
              15459821,
              15460384,
              15465709,
              15589408,
              15590688,
              15591653,
              15591679,
              15592992,
              15593186,
              15605986,
              15605999,
              15606001,
              15655456,
              15655648,
              15655918,
              15657248,
              15657980,
              15658016,
              15659506,
              15724267,
              15724773,
              15724776,
              15724782,
              15786210,
              15787492,
              15856352,
              15856354,
              15856360,
              15859488,
              15918571,
              15920672,
              15920880,
              15924256,
              16249582,
              16512288
            ]
          }),
          (this.name = function (t) {
            return 'windows-1251'
          }),
          (this.language = function () {
            return 'ru'
          })
      }),
      w.default.inherits(t.exports.windows_1251, r),
      (t.exports.windows_1256 = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            129,
            32,
            131,
            32,
            32,
            32,
            32,
            136,
            32,
            138,
            32,
            156,
            141,
            142,
            143,
            144,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            152,
            32,
            154,
            32,
            156,
            32,
            32,
            159,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            170,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            181,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            192,
            193,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            210,
            211,
            212,
            213,
            214,
            32,
            216,
            217,
            218,
            219,
            220,
            221,
            222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237,
            238,
            239,
            32,
            32,
            32,
            32,
            244,
            32,
            32,
            32,
            32,
            249,
            32,
            251,
            252,
            32,
            32,
            255
          ]
        }),
          (this.ngrams = function () {
            return [
              2148321,
              2148324,
              2148551,
              2153185,
              2153965,
              2154977,
              2155492,
              2156231,
              13050055,
              13091104,
              13093408,
              13095200,
              13099296,
              13099459,
              13099463,
              13099464,
              13099466,
              13099468,
              13099469,
              13099471,
              13099475,
              13099482,
              13099486,
              13099491,
              13099494,
              13099501,
              13099808,
              13100064,
              13100234,
              13115591,
              13181127,
              13181149,
              13181153,
              13181155,
              13181158,
              13246663,
              13574343,
              13617440,
              13705415,
              13748512,
              13836487,
              14295239,
              14344684,
              14544160,
              14753991,
              14797088,
              14806048,
              14806304,
              14885063,
              14927648,
              14928160,
              14935072,
              14950599,
              15016135,
              15058720,
              15124449,
              15131680,
              15474887,
              15540423,
              15540451,
              15540454,
              15583520,
              15585568,
              15590432
            ]
          }),
          (this.name = function (t) {
            return 'windows-1256'
          }),
          (this.language = function () {
            return 'ar'
          })
      }),
      w.default.inherits(t.exports.windows_1256, r),
      (t.exports.KOI8_R = function () {
        ;(this.byteMap = function () {
          return [
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            0,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            163,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            163,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            32,
            192,
            193,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            210,
            211,
            212,
            213,
            214,
            215,
            216,
            217,
            218,
            219,
            220,
            221,
            222,
            223,
            192,
            193,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            210,
            211,
            212,
            213,
            214,
            215,
            216,
            217,
            218,
            219,
            220,
            221,
            222,
            223
          ]
        }),
          (this.ngrams = function () {
            return [
              2147535,
              2148640,
              2149313,
              2149327,
              2150081,
              2150085,
              2150338,
              2150607,
              2150610,
              2151105,
              2151375,
              2151380,
              2151631,
              2152224,
              2152399,
              2153153,
              2153684,
              2154196,
              12701385,
              12702936,
              12963032,
              12963529,
              12964820,
              12964896,
              13094688,
              13181136,
              13223200,
              13224224,
              13226272,
              13419982,
              13420832,
              13424846,
              13549856,
              13550880,
              13552069,
              13552081,
              13553440,
              13553623,
              13574352,
              13574355,
              13574359,
              13617103,
              13617696,
              13618392,
              13618464,
              13620180,
              13621024,
              13621185,
              13684684,
              13685445,
              13685449,
              13685455,
              13812183,
              13813188,
              13881632,
              13882561,
              13882569,
              13882583,
              13944268,
              13946656,
              13946834,
              13948960,
              14272544,
              14603471
            ]
          }),
          (this.name = function (t) {
            return 'KOI8-R'
          }),
          (this.language = function () {
            return 'ru'
          })
      }),
      w.default.inherits(t.exports.KOI8_R, r)
  }),
  Ov = Ft(function (t) {
    function e() {}
    ;(e.prototype.match = function (t) {
      var e,
        n,
        r,
        i,
        o = 0,
        u = 0,
        s = 0,
        c = t.fInputBytes,
        a = t.fInputLen
      t: for (e = 0; e < a; e++) {
        if (27 == c[e]) {
          e: for (r = 0; r < this.escapeSequences.length; r++) {
            var f = this.escapeSequences[r]
            if (!(a - e < f.length)) {
              for (n = 1; n < f.length; n++) if (f[n] != c[e + n]) continue e
              o++, (e += f.length - 1)
              continue t
            }
          }
          u++
        }
        ;(14 != c[e] && 15 != c[e]) || s++
      }
      return 0 == o
        ? null
        : ((i = (100 * o - 100 * u) / (o + u)),
          o + s < 5 && (i -= 10 * (5 - (o + s))),
          i <= 0 ? null : new xv(t, this, i))
    }),
      (t.exports.ISO_2022_JP = function () {
        ;(this.name = function () {
          return 'ISO-2022-JP'
        }),
          (this.escapeSequences = [
            [27, 36, 40, 67],
            [27, 36, 40, 68],
            [27, 36, 64],
            [27, 36, 65],
            [27, 36, 66],
            [27, 38, 64],
            [27, 40, 66],
            [27, 40, 72],
            [27, 40, 73],
            [27, 40, 74],
            [27, 46, 65],
            [27, 46, 70]
          ])
      }),
      w.default.inherits(t.exports.ISO_2022_JP, e),
      (t.exports.ISO_2022_KR = function () {
        ;(this.name = function () {
          return 'ISO-2022-KR'
        }),
          (this.escapeSequences = [[27, 36, 41, 67]])
      }),
      w.default.inherits(t.exports.ISO_2022_KR, e),
      (t.exports.ISO_2022_CN = function () {
        ;(this.name = function () {
          return 'ISO-2022-CN'
        }),
          (this.escapeSequences = [
            [27, 36, 41, 65],
            [27, 36, 41, 71],
            [27, 36, 42, 72],
            [27, 36, 41, 69],
            [27, 36, 43, 73],
            [27, 36, 43, 74],
            [27, 36, 43, 75],
            [27, 36, 43, 76],
            [27, 36, 43, 77],
            [27, 78],
            [27, 79]
          ])
      }),
      w.default.inherits(t.exports.ISO_2022_CN, e)
  }),
  jv = [
    new (function () {
      ;(this.name = function () {
        return 'UTF-8'
      }),
        (this.match = function (t) {
          var e,
            n = !1,
            r = 0,
            i = 0,
            o = t.fRawInput,
            u = 0
          t.fRawLength >= 3 &&
            239 == (255 & o[0]) &&
            187 == (255 & o[1]) &&
            191 == (255 & o[2]) &&
            (n = !0)
          for (var s = 0; s < t.fRawLength; s++) {
            var c = o[s]
            if (0 != (128 & c)) {
              if (192 == (224 & c)) u = 1
              else if (224 == (240 & c)) u = 2
              else if (240 == (248 & c)) u = 3
              else {
                if (++i > 5) break
                u = 0
              }
              for (; !(++s >= t.fRawLength); ) {
                if (128 != (192 & o[s])) {
                  i++
                  break
                }
                if (0 == --u) {
                  r++
                  break
                }
              }
            }
          }
          if (((e = 0), n && 0 == i)) e = 100
          else if (n && r > 10 * i) e = 80
          else if (r > 3 && 0 == i) e = 100
          else if (r > 0 && 0 == i) e = 80
          else if (0 == r && 0 == i) e = 10
          else {
            if (!(r > 10 * i)) return null
            e = 25
          }
          return new xv(t, this, e)
        })
    })(),
    new Sv.UTF_16BE(),
    new Sv.UTF_16LE(),
    new Sv.UTF_32BE(),
    new Sv.UTF_32LE(),
    new Cv.sjis(),
    new Cv.big5(),
    new Cv.euc_jp(),
    new Cv.euc_kr(),
    new Cv.gb_18030(),
    new Ov.ISO_2022_JP(),
    new Ov.ISO_2022_KR(),
    new Ov.ISO_2022_CN(),
    new Fv.ISO_8859_1(),
    new Fv.ISO_8859_2(),
    new Fv.ISO_8859_5(),
    new Fv.ISO_8859_6(),
    new Fv.ISO_8859_7(),
    new Fv.ISO_8859_8(),
    new Fv.ISO_8859_9(),
    new Fv.windows_1251(),
    new Fv.windows_1256(),
    new Fv.KOI8_R()
  ],
  Av = function (t, e) {
    for (var n = [], r = 0; r < 256; r++) n[r] = 0
    for (r = t.length - 1; r >= 0; r--) n[255 & t[r]]++
    var i = !1
    for (r = 128; r <= 159; r += 1)
      if (0 != n[r]) {
        i = !0
        break
      }
    var o = {
        fByteStats: n,
        fC1Bytes: i,
        fRawInput: t,
        fRawLength: t.length,
        fInputBytes: t,
        fInputLen: t.length
      },
      u = jv
        .map(function (t) {
          return t.match(o)
        })
        .filter(function (t) {
          return !!t
        })
        .sort(function (t, e) {
          return e.confidence - t.confidence
        })
    return e && !0 === e.returnAllMatches ? u : u.length > 0 ? u[0].name : null
  },
  kv = k.default.Buffer,
  Iv = {}
for (_v in k.default)
  k.default.hasOwnProperty(_v) &&
    'SlowBuffer' !== _v &&
    'Buffer' !== _v &&
    (Iv[_v] = k.default[_v])
var Tv = (Iv.Buffer = {})
for (_v in kv)
  kv.hasOwnProperty(_v) &&
    'allocUnsafe' !== _v &&
    'allocUnsafeSlow' !== _v &&
    (Tv[_v] = kv[_v])
if (
  ((Iv.Buffer.prototype = kv.prototype),
  (Tv.from && Tv.from !== Uint8Array.from) ||
    (Tv.from = function (t, e, n) {
      if ('number' == typeof t)
        throw new TypeError(
          'The "value" argument must not be of type number. Received type ' + typeof t
        )
      if (t && void 0 === t.length)
        throw new TypeError(
          'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
            typeof t
        )
      return kv(t, e, n)
    }),
  Tv.alloc ||
    (Tv.alloc = function (t, e, n) {
      if ('number' != typeof t)
        throw new TypeError(
          'The "size" argument must be of type number. Received type ' + typeof t
        )
      if (t < 0 || t >= 2 * (1 << 30))
        throw new RangeError('The value "' + t + '" is invalid for option "size"')
      var r = kv(t)
      return (
        e && 0 !== e.length
          ? 'string' == typeof n
            ? r.fill(e, n)
            : r.fill(e)
          : r.fill(0),
        r
      )
    }),
  !Iv.kStringMaxLength)
)
  try {
    Iv.kStringMaxLength = process.binding('buffer').kStringMaxLength
  } catch (t) {}
Iv.constants ||
  ((Iv.constants = { MAX_LENGTH: Iv.kMaxLength }),
  Iv.kStringMaxLength && (Iv.constants.MAX_STRING_LENGTH = Iv.kStringMaxLength))
var Nv = Iv,
  Bv = Pv
function Pv(t, e) {
  ;(this.encoder = t), (this.addBOM = !0)
}
;(Pv.prototype.write = function (t) {
  return this.addBOM && ((t = '\ufeff' + t), (this.addBOM = !1)), this.encoder.write(t)
}),
  (Pv.prototype.end = function () {
    return this.encoder.end()
  })
var Rv = Lv
function Lv(t, e) {
  ;(this.decoder = t), (this.pass = !1), (this.options = e || {})
}
;(Lv.prototype.write = function (t) {
  var e = this.decoder.write(t)
  return (
    this.pass ||
      !e ||
      ('\ufeff' === e[0] &&
        ((e = e.slice(1)),
        'function' == typeof this.options.stripBOM && this.options.stripBOM()),
      (this.pass = !0)),
    e
  )
}),
  (Lv.prototype.end = function () {
    return this.decoder.end()
  })
var Mv = { PrependBOM: Bv, StripBOM: Rv },
  Uv = Nv.Buffer,
  Vv = {
    utf8: { type: '_internal', bomAware: !0 },
    cesu8: { type: '_internal', bomAware: !0 },
    unicode11utf8: 'utf8',
    ucs2: { type: '_internal', bomAware: !0 },
    utf16le: 'ucs2',
    binary: { type: '_internal' },
    base64: { type: '_internal' },
    hex: { type: '_internal' },
    _internal: $v
  }
function $v(t, e) {
  ;(this.enc = t.encodingName),
    (this.bomAware = t.bomAware),
    'base64' === this.enc
      ? (this.encoder = Gv)
      : 'cesu8' === this.enc &&
        ((this.enc = 'utf8'),
        (this.encoder = Kv),
        '💩' !== Uv.from('eda0bdedb2a9', 'hex').toString() &&
          ((this.decoder = Yv), (this.defaultCharUnicode = e.defaultCharUnicode)))
}
;($v.prototype.encoder = Wv), ($v.prototype.decoder = qv)
var zv = I.default.StringDecoder
function qv(t, e) {
  zv.call(this, e.enc)
}
function Wv(t, e) {
  this.enc = e.enc
}
function Gv(t, e) {
  this.prevStr = ''
}
function Kv(t, e) {}
function Yv(t, e) {
  ;(this.acc = 0),
    (this.contBytes = 0),
    (this.accBytes = 0),
    (this.defaultCharUnicode = e.defaultCharUnicode)
}
zv.prototype.end || (zv.prototype.end = function () {}),
  (qv.prototype = zv.prototype),
  (Wv.prototype.write = function (t) {
    return Uv.from(t, this.enc)
  }),
  (Wv.prototype.end = function () {}),
  (Gv.prototype.write = function (t) {
    var e = (t = this.prevStr + t).length - (t.length % 4)
    return (this.prevStr = t.slice(e)), (t = t.slice(0, e)), Uv.from(t, 'base64')
  }),
  (Gv.prototype.end = function () {
    return Uv.from(this.prevStr, 'base64')
  }),
  (Kv.prototype.write = function (t) {
    for (var e = Uv.alloc(3 * t.length), n = 0, r = 0; r < t.length; r++) {
      var i = t.charCodeAt(r)
      i < 128
        ? (e[n++] = i)
        : i < 2048
        ? ((e[n++] = 192 + (i >>> 6)), (e[n++] = 128 + (63 & i)))
        : ((e[n++] = 224 + (i >>> 12)),
          (e[n++] = 128 + ((i >>> 6) & 63)),
          (e[n++] = 128 + (63 & i)))
    }
    return e.slice(0, n)
  }),
  (Kv.prototype.end = function () {}),
  (Yv.prototype.write = function (t) {
    for (
      var e = this.acc, n = this.contBytes, r = this.accBytes, i = '', o = 0;
      o < t.length;
      o++
    ) {
      var u = t[o]
      128 != (192 & u)
        ? (n > 0 && ((i += this.defaultCharUnicode), (n = 0)),
          u < 128
            ? (i += String.fromCharCode(u))
            : u < 224
            ? ((e = 31 & u), (n = 1), (r = 1))
            : u < 240
            ? ((e = 15 & u), (n = 2), (r = 1))
            : (i += this.defaultCharUnicode))
        : n > 0
        ? ((e = (e << 6) | (63 & u)),
          r++,
          0 === --n &&
            (i +=
              (2 === r && e < 128 && e > 0) || (3 === r && e < 2048)
                ? this.defaultCharUnicode
                : String.fromCharCode(e)))
        : (i += this.defaultCharUnicode)
    }
    return (this.acc = e), (this.contBytes = n), (this.accBytes = r), i
  }),
  (Yv.prototype.end = function () {
    var t = 0
    return this.contBytes > 0 && (t += this.defaultCharUnicode), t
  })
var Hv = Nv.Buffer,
  Xv = Jv
function Jv() {}
function Zv() {}
function Qv() {
  this.overflowByte = -1
}
;(Jv.prototype.encoder = Zv),
  (Jv.prototype.decoder = Qv),
  (Jv.prototype.bomAware = !0),
  (Zv.prototype.write = function (t) {
    for (var e = Hv.from(t, 'ucs2'), n = 0; n < e.length; n += 2) {
      var r = e[n]
      ;(e[n] = e[n + 1]), (e[n + 1] = r)
    }
    return e
  }),
  (Zv.prototype.end = function () {}),
  (Qv.prototype.write = function (t) {
    if (0 == t.length) return ''
    var e = Hv.alloc(t.length + 1),
      n = 0,
      r = 0
    for (
      -1 !== this.overflowByte &&
      ((e[0] = t[0]), (e[1] = this.overflowByte), (n = 1), (r = 2));
      n < t.length - 1;
      n += 2, r += 2
    )
      (e[r] = t[n + 1]), (e[r + 1] = t[n])
    return (
      (this.overflowByte = n == t.length - 1 ? t[t.length - 1] : -1),
      e.slice(0, r).toString('ucs2')
    )
  }),
  (Qv.prototype.end = function () {})
var ty = ey
function ey(t, e) {
  this.iconv = e
}
function ny(t, e) {
  void 0 === (t = t || {}).addBOM && (t.addBOM = !0),
    (this.encoder = e.iconv.getEncoder('utf-16le', t))
}
function ry(t, e) {
  ;(this.decoder = null),
    (this.initialBytes = []),
    (this.initialBytesLen = 0),
    (this.options = t || {}),
    (this.iconv = e.iconv)
}
function iy(t, e) {
  var n = e || 'utf-16le'
  if (t.length >= 2)
    if (254 == t[0] && 255 == t[1]) n = 'utf-16be'
    else if (255 == t[0] && 254 == t[1]) n = 'utf-16le'
    else {
      for (
        var r = 0, i = 0, o = Math.min(t.length - (t.length % 2), 64), u = 0;
        u < o;
        u += 2
      )
        0 === t[u] && 0 !== t[u + 1] && i++, 0 !== t[u] && 0 === t[u + 1] && r++
      i > r ? (n = 'utf-16be') : i < r && (n = 'utf-16le')
    }
  return n
}
;(ey.prototype.encoder = ny),
  (ey.prototype.decoder = ry),
  (ny.prototype.write = function (t) {
    return this.encoder.write(t)
  }),
  (ny.prototype.end = function () {
    return this.encoder.end()
  }),
  (ry.prototype.write = function (t) {
    if (!this.decoder) {
      if (
        (this.initialBytes.push(t),
        (this.initialBytesLen += t.length),
        this.initialBytesLen < 16)
      )
        return ''
      var e = iy((t = Hv.concat(this.initialBytes)), this.options.defaultEncoding)
      ;(this.decoder = this.iconv.getDecoder(e, this.options)),
        (this.initialBytes.length = this.initialBytesLen = 0)
    }
    return this.decoder.write(t)
  }),
  (ry.prototype.end = function () {
    if (!this.decoder) {
      var t = Hv.concat(this.initialBytes),
        e = iy(t, this.options.defaultEncoding)
      this.decoder = this.iconv.getDecoder(e, this.options)
      var n = this.decoder.write(t),
        r = this.decoder.end()
      return r ? n + r : n
    }
    return this.decoder.end()
  })
var oy = { utf16be: Xv, utf16: ty },
  uy = Nv.Buffer,
  sy = cy
function cy(t, e) {
  this.iconv = e
}
;(cy.prototype.encoder = fy), (cy.prototype.decoder = ly), (cy.prototype.bomAware = !0)
var ay = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g
function fy(t, e) {
  this.iconv = e.iconv
}
function ly(t, e) {
  ;(this.iconv = e.iconv), (this.inBase64 = !1), (this.base64Accum = '')
}
;(fy.prototype.write = function (t) {
  return uy.from(
    t.replace(
      ay,
      function (t) {
        return (
          '+' +
          ('+' === t
            ? ''
            : this.iconv.encode(t, 'utf16-be').toString('base64').replace(/=+$/, '')) +
          '-'
        )
      }.bind(this)
    )
  )
}),
  (fy.prototype.end = function () {})
for (var hy = /[A-Za-z0-9\/+]/, py = [], dy = 0; dy < 256; dy++)
  py[dy] = hy.test(String.fromCharCode(dy))
var vy = '+'.charCodeAt(0),
  yy = '-'.charCodeAt(0),
  by = '&'.charCodeAt(0)
;(ly.prototype.write = function (t) {
  for (
    var e = '', n = 0, r = this.inBase64, i = this.base64Accum, o = 0;
    o < t.length;
    o++
  )
    if (r) {
      if (!py[t[o]]) {
        if (o == n && t[o] == yy) e += '+'
        else {
          var u = i + t.slice(n, o).toString()
          e += this.iconv.decode(uy.from(u, 'base64'), 'utf16-be')
        }
        t[o] != yy && o--, (n = o + 1), (r = !1), (i = '')
      }
    } else
      t[o] == vy &&
        ((e += this.iconv.decode(t.slice(n, o), 'ascii')), (n = o + 1), (r = !0))
  if (r) {
    var s = (u = i + t.slice(n).toString()).length - (u.length % 8)
    ;(i = u.slice(s)),
      (u = u.slice(0, s)),
      (e += this.iconv.decode(uy.from(u, 'base64'), 'utf16-be'))
  } else e += this.iconv.decode(t.slice(n), 'ascii')
  return (this.inBase64 = r), (this.base64Accum = i), e
}),
  (ly.prototype.end = function () {
    var t = ''
    return (
      this.inBase64 &&
        this.base64Accum.length > 0 &&
        (t = this.iconv.decode(uy.from(this.base64Accum, 'base64'), 'utf16-be')),
      (this.inBase64 = !1),
      (this.base64Accum = ''),
      t
    )
  })
var gy = my
function my(t, e) {
  this.iconv = e
}
function Dy(t, e) {
  ;(this.iconv = e.iconv),
    (this.inBase64 = !1),
    (this.base64Accum = uy.alloc(6)),
    (this.base64AccumIdx = 0)
}
function wy(t, e) {
  ;(this.iconv = e.iconv), (this.inBase64 = !1), (this.base64Accum = '')
}
;(my.prototype.encoder = Dy),
  (my.prototype.decoder = wy),
  (my.prototype.bomAware = !0),
  (Dy.prototype.write = function (t) {
    for (
      var e = this.inBase64,
        n = this.base64Accum,
        r = this.base64AccumIdx,
        i = uy.alloc(5 * t.length + 10),
        o = 0,
        u = 0;
      u < t.length;
      u++
    ) {
      var s = t.charCodeAt(u)
      32 <= s && s <= 126
        ? (e &&
            (r > 0 &&
              ((o += i.write(
                n.slice(0, r).toString('base64').replace(/\//g, ',').replace(/=+$/, ''),
                o
              )),
              (r = 0)),
            (i[o++] = yy),
            (e = !1)),
          e || ((i[o++] = s), s === by && (i[o++] = yy)))
        : (e || ((i[o++] = by), (e = !0)),
          e &&
            ((n[r++] = s >> 8),
            (n[r++] = 255 & s),
            r == n.length &&
              ((o += i.write(n.toString('base64').replace(/\//g, ','), o)), (r = 0))))
    }
    return (this.inBase64 = e), (this.base64AccumIdx = r), i.slice(0, o)
  }),
  (Dy.prototype.end = function () {
    var t = uy.alloc(10),
      e = 0
    return (
      this.inBase64 &&
        (this.base64AccumIdx > 0 &&
          ((e += t.write(
            this.base64Accum
              .slice(0, this.base64AccumIdx)
              .toString('base64')
              .replace(/\//g, ',')
              .replace(/=+$/, ''),
            e
          )),
          (this.base64AccumIdx = 0)),
        (t[e++] = yy),
        (this.inBase64 = !1)),
      t.slice(0, e)
    )
  })
var _y = py.slice()
;(_y[','.charCodeAt(0)] = !0),
  (wy.prototype.write = function (t) {
    for (
      var e = '', n = 0, r = this.inBase64, i = this.base64Accum, o = 0;
      o < t.length;
      o++
    )
      if (r) {
        if (!_y[t[o]]) {
          if (o == n && t[o] == yy) e += '&'
          else {
            var u = i + t.slice(n, o).toString().replace(/,/g, '/')
            e += this.iconv.decode(uy.from(u, 'base64'), 'utf16-be')
          }
          t[o] != yy && o--, (n = o + 1), (r = !1), (i = '')
        }
      } else
        t[o] == by &&
          ((e += this.iconv.decode(t.slice(n, o), 'ascii')), (n = o + 1), (r = !0))
    if (r) {
      var s = (u = i + t.slice(n).toString().replace(/,/g, '/')).length - (u.length % 8)
      ;(i = u.slice(s)),
        (u = u.slice(0, s)),
        (e += this.iconv.decode(uy.from(u, 'base64'), 'utf16-be'))
    } else e += this.iconv.decode(t.slice(n), 'ascii')
    return (this.inBase64 = r), (this.base64Accum = i), e
  }),
  (wy.prototype.end = function () {
    var t = ''
    return (
      this.inBase64 &&
        this.base64Accum.length > 0 &&
        (t = this.iconv.decode(uy.from(this.base64Accum, 'base64'), 'utf16-be')),
      (this.inBase64 = !1),
      (this.base64Accum = ''),
      t
    )
  })
var Ey = { utf7: sy, unicode11utf7: 'utf7', utf7imap: gy },
  xy = Nv.Buffer,
  Sy = Cy
function Cy(t, e) {
  if (!t) throw new Error('SBCS codec is called without the data.')
  if (!t.chars || (128 !== t.chars.length && 256 !== t.chars.length))
    throw new Error(
      "Encoding '" + t.type + "' has incorrect 'chars' (must be of len 128 or 256)"
    )
  if (128 === t.chars.length) {
    for (var n = '', r = 0; r < 128; r++) n += String.fromCharCode(r)
    t.chars = n + t.chars
  }
  this.decodeBuf = xy.from(t.chars, 'ucs2')
  var i = xy.alloc(65536, e.defaultCharSingleByte.charCodeAt(0))
  for (r = 0; r < t.chars.length; r++) i[t.chars.charCodeAt(r)] = r
  this.encodeBuf = i
}
function Fy(t, e) {
  this.encodeBuf = e.encodeBuf
}
function Oy(t, e) {
  this.decodeBuf = e.decodeBuf
}
;(Cy.prototype.encoder = Fy),
  (Cy.prototype.decoder = Oy),
  (Fy.prototype.write = function (t) {
    for (var e = xy.alloc(t.length), n = 0; n < t.length; n++)
      e[n] = this.encodeBuf[t.charCodeAt(n)]
    return e
  }),
  (Fy.prototype.end = function () {}),
  (Oy.prototype.write = function (t) {
    for (
      var e = this.decodeBuf, n = xy.alloc(2 * t.length), r = 0, i = 0, o = 0;
      o < t.length;
      o++
    )
      (r = 2 * t[o]), (n[(i = 2 * o)] = e[r]), (n[i + 1] = e[r + 1])
    return n.toString('ucs2')
  }),
  (Oy.prototype.end = function () {})
for (
  var jy = { _sbcs: Sy },
    Ay = {
      10029: 'maccenteuro',
      maccenteuro: {
        type: '_sbcs',
        chars:
          'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ'
      },
      808: 'cp808',
      ibm808: 'cp808',
      cp808: {
        type: '_sbcs',
        chars:
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ '
      },
      mik: {
        type: '_sbcs',
        chars:
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
      },
      ascii8bit: 'ascii',
      usascii: 'ascii',
      ansix34: 'ascii',
      ansix341968: 'ascii',
      ansix341986: 'ascii',
      csascii: 'ascii',
      cp367: 'ascii',
      ibm367: 'ascii',
      isoir6: 'ascii',
      iso646us: 'ascii',
      iso646irv: 'ascii',
      us: 'ascii',
      latin1: 'iso88591',
      latin2: 'iso88592',
      latin3: 'iso88593',
      latin4: 'iso88594',
      latin5: 'iso88599',
      latin6: 'iso885910',
      latin7: 'iso885913',
      latin8: 'iso885914',
      latin9: 'iso885915',
      latin10: 'iso885916',
      csisolatin1: 'iso88591',
      csisolatin2: 'iso88592',
      csisolatin3: 'iso88593',
      csisolatin4: 'iso88594',
      csisolatincyrillic: 'iso88595',
      csisolatinarabic: 'iso88596',
      csisolatingreek: 'iso88597',
      csisolatinhebrew: 'iso88598',
      csisolatin5: 'iso88599',
      csisolatin6: 'iso885910',
      l1: 'iso88591',
      l2: 'iso88592',
      l3: 'iso88593',
      l4: 'iso88594',
      l5: 'iso88599',
      l6: 'iso885910',
      l7: 'iso885913',
      l8: 'iso885914',
      l9: 'iso885915',
      l10: 'iso885916',
      isoir14: 'iso646jp',
      isoir57: 'iso646cn',
      isoir100: 'iso88591',
      isoir101: 'iso88592',
      isoir109: 'iso88593',
      isoir110: 'iso88594',
      isoir144: 'iso88595',
      isoir127: 'iso88596',
      isoir126: 'iso88597',
      isoir138: 'iso88598',
      isoir148: 'iso88599',
      isoir157: 'iso885910',
      isoir166: 'tis620',
      isoir179: 'iso885913',
      isoir199: 'iso885914',
      isoir203: 'iso885915',
      isoir226: 'iso885916',
      cp819: 'iso88591',
      ibm819: 'iso88591',
      cyrillic: 'iso88595',
      arabic: 'iso88596',
      arabic8: 'iso88596',
      ecma114: 'iso88596',
      asmo708: 'iso88596',
      greek: 'iso88597',
      greek8: 'iso88597',
      ecma118: 'iso88597',
      elot928: 'iso88597',
      hebrew: 'iso88598',
      hebrew8: 'iso88598',
      turkish: 'iso88599',
      turkish8: 'iso88599',
      thai: 'iso885911',
      thai8: 'iso885911',
      celtic: 'iso885914',
      celtic8: 'iso885914',
      isoceltic: 'iso885914',
      tis6200: 'tis620',
      tis62025291: 'tis620',
      tis62025330: 'tis620',
      1e4: 'macroman',
      10006: 'macgreek',
      10007: 'maccyrillic',
      10079: 'maciceland',
      10081: 'macturkish',
      cspc8codepage437: 'cp437',
      cspc775baltic: 'cp775',
      cspc850multilingual: 'cp850',
      cspcp852: 'cp852',
      cspc862latinhebrew: 'cp862',
      cpgr: 'cp869',
      msee: 'cp1250',
      mscyrl: 'cp1251',
      msansi: 'cp1252',
      msgreek: 'cp1253',
      msturk: 'cp1254',
      mshebr: 'cp1255',
      msarab: 'cp1256',
      winbaltrim: 'cp1257',
      cp20866: 'koi8r',
      20866: 'koi8r',
      ibm878: 'koi8r',
      cskoi8r: 'koi8r',
      cp21866: 'koi8u',
      21866: 'koi8u',
      ibm1168: 'koi8u',
      strk10482002: 'rk1048',
      tcvn5712: 'tcvn',
      tcvn57121: 'tcvn',
      gb198880: 'iso646cn',
      cn: 'iso646cn',
      csiso14jisc6220ro: 'iso646jp',
      jisc62201969ro: 'iso646jp',
      jp: 'iso646jp',
      cshproman8: 'hproman8',
      r8: 'hproman8',
      roman8: 'hproman8',
      xroman8: 'hproman8',
      ibm1051: 'hproman8',
      mac: 'macintosh',
      csmacintosh: 'macintosh'
    },
    ky = {
      437: 'cp437',
      737: 'cp737',
      775: 'cp775',
      850: 'cp850',
      852: 'cp852',
      855: 'cp855',
      856: 'cp856',
      857: 'cp857',
      858: 'cp858',
      860: 'cp860',
      861: 'cp861',
      862: 'cp862',
      863: 'cp863',
      864: 'cp864',
      865: 'cp865',
      866: 'cp866',
      869: 'cp869',
      874: 'windows874',
      922: 'cp922',
      1046: 'cp1046',
      1124: 'cp1124',
      1125: 'cp1125',
      1129: 'cp1129',
      1133: 'cp1133',
      1161: 'cp1161',
      1162: 'cp1162',
      1163: 'cp1163',
      1250: 'windows1250',
      1251: 'windows1251',
      1252: 'windows1252',
      1253: 'windows1253',
      1254: 'windows1254',
      1255: 'windows1255',
      1256: 'windows1256',
      1257: 'windows1257',
      1258: 'windows1258',
      28591: 'iso88591',
      28592: 'iso88592',
      28593: 'iso88593',
      28594: 'iso88594',
      28595: 'iso88595',
      28596: 'iso88596',
      28597: 'iso88597',
      28598: 'iso88598',
      28599: 'iso88599',
      28600: 'iso885910',
      28601: 'iso885911',
      28603: 'iso885913',
      28604: 'iso885914',
      28605: 'iso885915',
      28606: 'iso885916',
      windows874: {
        type: '_sbcs',
        chars:
          '€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����'
      },
      win874: 'windows874',
      cp874: 'windows874',
      windows1250: {
        type: '_sbcs',
        chars:
          '€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙'
      },
      win1250: 'windows1250',
      cp1250: 'windows1250',
      windows1251: {
        type: '_sbcs',
        chars:
          'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя'
      },
      win1251: 'windows1251',
      cp1251: 'windows1251',
      windows1252: {
        type: '_sbcs',
        chars:
          '€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
      },
      win1252: 'windows1252',
      cp1252: 'windows1252',
      windows1253: {
        type: '_sbcs',
        chars:
          '€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�'
      },
      win1253: 'windows1253',
      cp1253: 'windows1253',
      windows1254: {
        type: '_sbcs',
        chars:
          '€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ'
      },
      win1254: 'windows1254',
      cp1254: 'windows1254',
      windows1255: {
        type: '_sbcs',
        chars:
          '€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�'
      },
      win1255: 'windows1255',
      cp1255: 'windows1255',
      windows1256: {
        type: '_sbcs',
        chars:
          '€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے'
      },
      win1256: 'windows1256',
      cp1256: 'windows1256',
      windows1257: {
        type: '_sbcs',
        chars:
          '€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙'
      },
      win1257: 'windows1257',
      cp1257: 'windows1257',
      windows1258: {
        type: '_sbcs',
        chars:
          '€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ'
      },
      win1258: 'windows1258',
      cp1258: 'windows1258',
      iso88591: {
        type: '_sbcs',
        chars:
          ' ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
      },
      cp28591: 'iso88591',
      iso88592: {
        type: '_sbcs',
        chars:
          ' Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙'
      },
      cp28592: 'iso88592',
      iso88593: {
        type: '_sbcs',
        chars:
          ' Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙'
      },
      cp28593: 'iso88593',
      iso88594: {
        type: '_sbcs',
        chars:
          ' ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙'
      },
      cp28594: 'iso88594',
      iso88595: {
        type: '_sbcs',
        chars:
          ' ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ'
      },
      cp28595: 'iso88595',
      iso88596: {
        type: '_sbcs',
        chars:
          ' ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������'
      },
      cp28596: 'iso88596',
      iso88597: {
        type: '_sbcs',
        chars:
          ' ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�'
      },
      cp28597: 'iso88597',
      iso88598: {
        type: '_sbcs',
        chars:
          ' �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�'
      },
      cp28598: 'iso88598',
      iso88599: {
        type: '_sbcs',
        chars:
          ' ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ'
      },
      cp28599: 'iso88599',
      iso885910: {
        type: '_sbcs',
        chars:
          ' ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ'
      },
      cp28600: 'iso885910',
      iso885911: {
        type: '_sbcs',
        chars:
          ' กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����'
      },
      cp28601: 'iso885911',
      iso885913: {
        type: '_sbcs',
        chars:
          ' ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’'
      },
      cp28603: 'iso885913',
      iso885914: {
        type: '_sbcs',
        chars:
          ' Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ'
      },
      cp28604: 'iso885914',
      iso885915: {
        type: '_sbcs',
        chars:
          ' ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
      },
      cp28605: 'iso885915',
      iso885916: {
        type: '_sbcs',
        chars:
          ' ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ'
      },
      cp28606: 'iso885916',
      cp437: {
        type: '_sbcs',
        chars:
          'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
      },
      ibm437: 'cp437',
      csibm437: 'cp437',
      cp737: {
        type: '_sbcs',
        chars:
          'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ '
      },
      ibm737: 'cp737',
      csibm737: 'cp737',
      cp775: {
        type: '_sbcs',
        chars:
          'ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ '
      },
      ibm775: 'cp775',
      csibm775: 'cp775',
      cp850: {
        type: '_sbcs',
        chars:
          'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ '
      },
      ibm850: 'cp850',
      csibm850: 'cp850',
      cp852: {
        type: '_sbcs',
        chars:
          'ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ '
      },
      ibm852: 'cp852',
      csibm852: 'cp852',
      cp855: {
        type: '_sbcs',
        chars:
          'ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ '
      },
      ibm855: 'cp855',
      csibm855: 'cp855',
      cp856: {
        type: '_sbcs',
        chars:
          'אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ '
      },
      ibm856: 'cp856',
      csibm856: 'cp856',
      cp857: {
        type: '_sbcs',
        chars:
          'ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ '
      },
      ibm857: 'cp857',
      csibm857: 'cp857',
      cp858: {
        type: '_sbcs',
        chars:
          'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ '
      },
      ibm858: 'cp858',
      csibm858: 'cp858',
      cp860: {
        type: '_sbcs',
        chars:
          'ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
      },
      ibm860: 'cp860',
      csibm860: 'cp860',
      cp861: {
        type: '_sbcs',
        chars:
          'ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
      },
      ibm861: 'cp861',
      csibm861: 'cp861',
      cp862: {
        type: '_sbcs',
        chars:
          'אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
      },
      ibm862: 'cp862',
      csibm862: 'cp862',
      cp863: {
        type: '_sbcs',
        chars:
          'ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
      },
      ibm863: 'cp863',
      csibm863: 'cp863',
      cp864: {
        type: '_sbcs',
        chars:
          '\0\b\t\n\v\f\r !"#$٪&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�'
      },
      ibm864: 'cp864',
      csibm864: 'cp864',
      cp865: {
        type: '_sbcs',
        chars:
          'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
      },
      ibm865: 'cp865',
      csibm865: 'cp865',
      cp866: {
        type: '_sbcs',
        chars:
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ '
      },
      ibm866: 'cp866',
      csibm866: 'cp866',
      cp869: {
        type: '_sbcs',
        chars:
          '������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ '
      },
      ibm869: 'cp869',
      csibm869: 'cp869',
      cp922: {
        type: '_sbcs',
        chars:
          ' ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ'
      },
      ibm922: 'cp922',
      csibm922: 'cp922',
      cp1046: {
        type: '_sbcs',
        chars:
          'ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�'
      },
      ibm1046: 'cp1046',
      csibm1046: 'cp1046',
      cp1124: {
        type: '_sbcs',
        chars:
          ' ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ'
      },
      ibm1124: 'cp1124',
      csibm1124: 'cp1124',
      cp1125: {
        type: '_sbcs',
        chars:
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ '
      },
      ibm1125: 'cp1125',
      csibm1125: 'cp1125',
      cp1129: {
        type: '_sbcs',
        chars:
          ' ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ'
      },
      ibm1129: 'cp1129',
      csibm1129: 'cp1129',
      cp1133: {
        type: '_sbcs',
        chars:
          ' ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�'
      },
      ibm1133: 'cp1133',
      csibm1133: 'cp1133',
      cp1161: {
        type: '_sbcs',
        chars:
          '��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ '
      },
      ibm1161: 'cp1161',
      csibm1161: 'cp1161',
      cp1162: {
        type: '_sbcs',
        chars:
          '€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����'
      },
      ibm1162: 'cp1162',
      csibm1162: 'cp1162',
      cp1163: {
        type: '_sbcs',
        chars:
          ' ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ'
      },
      ibm1163: 'cp1163',
      csibm1163: 'cp1163',
      maccroatian: {
        type: '_sbcs',
        chars:
          'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ'
      },
      maccyrillic: {
        type: '_sbcs',
        chars:
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤'
      },
      macgreek: {
        type: '_sbcs',
        chars:
          'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�'
      },
      maciceland: {
        type: '_sbcs',
        chars:
          'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ'
      },
      macroman: {
        type: '_sbcs',
        chars:
          'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ'
      },
      macromania: {
        type: '_sbcs',
        chars:
          'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ'
      },
      macthai: {
        type: '_sbcs',
        chars:
          '«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\ufeff​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����'
      },
      macturkish: {
        type: '_sbcs',
        chars:
          'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ'
      },
      macukraine: {
        type: '_sbcs',
        chars:
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤'
      },
      koi8r: {
        type: '_sbcs',
        chars:
          '─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
      },
      koi8u: {
        type: '_sbcs',
        chars:
          '─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
      },
      koi8ru: {
        type: '_sbcs',
        chars:
          '─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
      },
      koi8t: {
        type: '_sbcs',
        chars:
          'қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
      },
      armscii8: {
        type: '_sbcs',
        chars:
          ' �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�'
      },
      rk1048: {
        type: '_sbcs',
        chars:
          'ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя'
      },
      tcvn: {
        type: '_sbcs',
        chars:
          '\0ÚỤỪỬỮ\b\t\n\v\f\rỨỰỲỶỸÝỴ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ'
      },
      georgianacademy: {
        type: '_sbcs',
        chars:
          '‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
      },
      georgianps: {
        type: '_sbcs',
        chars:
          '‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
      },
      pt154: {
        type: '_sbcs',
        chars:
          'ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя'
      },
      viscii: {
        type: '_sbcs',
        chars:
          '\0ẲẴẪ\b\t\n\v\f\rỶỸỴ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ'
      },
      iso646cn: {
        type: '_sbcs',
        chars:
          '\0\b\t\n\v\f\r !"#¥%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������'
      },
      iso646jp: {
        type: '_sbcs',
        chars:
          '\0\b\t\n\v\f\r !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������'
      },
      hproman8: {
        type: '_sbcs',
        chars:
          ' ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�'
      },
      macintosh: {
        type: '_sbcs',
        chars:
          'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ'
      },
      ascii: {
        type: '_sbcs',
        chars:
          '��������������������������������������������������������������������������������������������������������������������������������'
      },
      tis620: {
        type: '_sbcs',
        chars:
          '���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����'
      }
    },
    Iy = Nv.Buffer,
    Ty = Py,
    Ny = new Array(256),
    By = 0;
  By < 256;
  By++
)
  Ny[By] = -1
function Py(t, e) {
  if (((this.encodingName = t.encodingName), !t))
    throw new Error('DBCS codec is called without the data.')
  if (!t.table) throw new Error("Encoding '" + this.encodingName + "' has no data.")
  var n = t.table()
  ;(this.decodeTables = []),
    (this.decodeTables[0] = Ny.slice(0)),
    (this.decodeTableSeq = [])
  for (var r = 0; r < n.length; r++) this._addDecodeChunk(n[r])
  ;(this.defaultCharUnicode = e.defaultCharUnicode),
    (this.encodeTable = []),
    (this.encodeTableSeq = [])
  var i = {}
  if (t.encodeSkipVals)
    for (r = 0; r < t.encodeSkipVals.length; r++) {
      var o = t.encodeSkipVals[r]
      if ('number' == typeof o) i[o] = !0
      else for (var u = o.from; u <= o.to; u++) i[u] = !0
    }
  if ((this._fillEncodeTable(0, 0, i), t.encodeAdd))
    for (var s in t.encodeAdd)
      Object.prototype.hasOwnProperty.call(t.encodeAdd, s) &&
        this._setEncodeChar(s.charCodeAt(0), t.encodeAdd[s])
  if (
    ((this.defCharSB = this.encodeTable[0][e.defaultCharSingleByte.charCodeAt(0)]),
    -1 === this.defCharSB && (this.defCharSB = this.encodeTable[0]['?']),
    -1 === this.defCharSB && (this.defCharSB = '?'.charCodeAt(0)),
    'function' == typeof t.gb18030)
  ) {
    this.gb18030 = t.gb18030()
    var c = this.decodeTables.length,
      a = (this.decodeTables[c] = Ny.slice(0)),
      f = this.decodeTables.length,
      l = (this.decodeTables[f] = Ny.slice(0))
    for (r = 129; r <= 254; r++) {
      var h = -1e3 - this.decodeTables[0][r],
        p = this.decodeTables[h]
      for (u = 48; u <= 57; u++) p[u] = -1e3 - c
    }
    for (r = 129; r <= 254; r++) a[r] = -1e3 - f
    for (r = 48; r <= 57; r++) l[r] = -2
  }
}
function Ry(t, e) {
  ;(this.leadSurrogate = -1),
    (this.seqObj = void 0),
    (this.encodeTable = e.encodeTable),
    (this.encodeTableSeq = e.encodeTableSeq),
    (this.defaultCharSingleByte = e.defCharSB),
    (this.gb18030 = e.gb18030)
}
function Ly(t, e) {
  ;(this.nodeIdx = 0),
    (this.prevBuf = Iy.alloc(0)),
    (this.decodeTables = e.decodeTables),
    (this.decodeTableSeq = e.decodeTableSeq),
    (this.defaultCharUnicode = e.defaultCharUnicode),
    (this.gb18030 = e.gb18030)
}
function My(t, e) {
  if (t[0] > e) return -1
  for (var n = 0, r = t.length; n < r - 1; ) {
    var i = n + Math.floor((r - n + 1) / 2)
    t[i] <= e ? (n = i) : (r = i)
  }
  return n
}
;(Py.prototype.encoder = Ry),
  (Py.prototype.decoder = Ly),
  (Py.prototype._getDecodeTrieNode = function (t) {
    for (var e = []; t > 0; t >>= 8) e.push(255 & t)
    0 == e.length && e.push(0)
    for (var n = this.decodeTables[0], r = e.length - 1; r > 0; r--) {
      var i = n[e[r]]
      if (-1 == i)
        (n[e[r]] = -1e3 - this.decodeTables.length),
          this.decodeTables.push((n = Ny.slice(0)))
      else {
        if (!(i <= -1e3))
          throw new Error(
            'Overwrite byte in ' + this.encodingName + ', addr: ' + t.toString(16)
          )
        n = this.decodeTables[-1e3 - i]
      }
    }
    return n
  }),
  (Py.prototype._addDecodeChunk = function (t) {
    var e = parseInt(t[0], 16),
      n = this._getDecodeTrieNode(e)
    e &= 255
    for (var r = 1; r < t.length; r++) {
      var i = t[r]
      if ('string' == typeof i)
        for (var o = 0; o < i.length; ) {
          var u = i.charCodeAt(o++)
          if (55296 <= u && u < 56320) {
            var s = i.charCodeAt(o++)
            if (!(56320 <= s && s < 57344))
              throw new Error(
                'Incorrect surrogate pair in ' + this.encodingName + ' at chunk ' + t[0]
              )
            n[e++] = 65536 + 1024 * (u - 55296) + (s - 56320)
          } else if (4080 < u && u <= 4095) {
            for (var c = 4095 - u + 2, a = [], f = 0; f < c; f++)
              a.push(i.charCodeAt(o++))
            ;(n[e++] = -10 - this.decodeTableSeq.length), this.decodeTableSeq.push(a)
          } else n[e++] = u
        }
      else {
        if ('number' != typeof i)
          throw new Error(
            "Incorrect type '" +
              typeof i +
              "' given in " +
              this.encodingName +
              ' at chunk ' +
              t[0]
          )
        var l = n[e - 1] + 1
        for (o = 0; o < i; o++) n[e++] = l++
      }
    }
    if (e > 255)
      throw new Error(
        'Incorrect chunk in ' + this.encodingName + ' at addr ' + t[0] + ': too long' + e
      )
  }),
  (Py.prototype._getEncodeBucket = function (t) {
    var e = t >> 8
    return (
      void 0 === this.encodeTable[e] && (this.encodeTable[e] = Ny.slice(0)),
      this.encodeTable[e]
    )
  }),
  (Py.prototype._setEncodeChar = function (t, e) {
    var n = this._getEncodeBucket(t),
      r = 255 & t
    n[r] <= -10 ? (this.encodeTableSeq[-10 - n[r]][-1] = e) : -1 == n[r] && (n[r] = e)
  }),
  (Py.prototype._setEncodeSequence = function (t, e) {
    var n,
      r = t[0],
      i = this._getEncodeBucket(r),
      o = 255 & r
    i[o] <= -10
      ? (n = this.encodeTableSeq[-10 - i[o]])
      : ((n = {}),
        -1 !== i[o] && (n[-1] = i[o]),
        (i[o] = -10 - this.encodeTableSeq.length),
        this.encodeTableSeq.push(n))
    for (var u = 1; u < t.length - 1; u++) {
      var s = n[r]
      'object' == typeof s ? (n = s) : ((n = n[r] = {}), void 0 !== s && (n[-1] = s))
    }
    n[(r = t[t.length - 1])] = e
  }),
  (Py.prototype._fillEncodeTable = function (t, e, n) {
    for (var r = this.decodeTables[t], i = 0; i < 256; i++) {
      var o = r[i],
        u = e + i
      n[u] ||
        (o >= 0
          ? this._setEncodeChar(o, u)
          : o <= -1e3
          ? this._fillEncodeTable(-1e3 - o, u << 8, n)
          : o <= -10 && this._setEncodeSequence(this.decodeTableSeq[-10 - o], u))
    }
  }),
  (Ry.prototype.write = function (t) {
    for (
      var e = Iy.alloc(t.length * (this.gb18030 ? 4 : 3)),
        n = this.leadSurrogate,
        r = this.seqObj,
        i = -1,
        o = 0,
        u = 0;
      ;

    ) {
      if (-1 === i) {
        if (o == t.length) break
        var s = t.charCodeAt(o++)
      } else {
        s = i
        i = -1
      }
      if (55296 <= s && s < 57344)
        if (s < 56320) {
          if (-1 === n) {
            n = s
            continue
          }
          ;(n = s), (s = -1)
        } else
          -1 !== n ? ((s = 65536 + 1024 * (n - 55296) + (s - 56320)), (n = -1)) : (s = -1)
      else -1 !== n && ((i = s), (s = -1), (n = -1))
      var c = -1
      if (void 0 !== r && -1 != s) {
        var a = r[s]
        if ('object' == typeof a) {
          r = a
          continue
        }
        'number' == typeof a
          ? (c = a)
          : null == a && void 0 !== (a = r[-1]) && ((c = a), (i = s)),
          (r = void 0)
      } else if (s >= 0) {
        var f = this.encodeTable[s >> 8]
        if ((void 0 !== f && (c = f[255 & s]), c <= -10)) {
          r = this.encodeTableSeq[-10 - c]
          continue
        }
        if (-1 == c && this.gb18030) {
          var l = My(this.gb18030.uChars, s)
          if (-1 != l) {
            c = this.gb18030.gbChars[l] + (s - this.gb18030.uChars[l])
            ;(e[u++] = 129 + Math.floor(c / 12600)),
              (c %= 12600),
              (e[u++] = 48 + Math.floor(c / 1260)),
              (c %= 1260),
              (e[u++] = 129 + Math.floor(c / 10)),
              (c %= 10),
              (e[u++] = 48 + c)
            continue
          }
        }
      }
      ;-1 === c && (c = this.defaultCharSingleByte),
        c < 256
          ? (e[u++] = c)
          : c < 65536
          ? ((e[u++] = c >> 8), (e[u++] = 255 & c))
          : ((e[u++] = c >> 16), (e[u++] = (c >> 8) & 255), (e[u++] = 255 & c))
    }
    return (this.seqObj = r), (this.leadSurrogate = n), e.slice(0, u)
  }),
  (Ry.prototype.end = function () {
    if (-1 !== this.leadSurrogate || void 0 !== this.seqObj) {
      var t = Iy.alloc(10),
        e = 0
      if (this.seqObj) {
        var n = this.seqObj[-1]
        void 0 !== n &&
          (n < 256 ? (t[e++] = n) : ((t[e++] = n >> 8), (t[e++] = 255 & n))),
          (this.seqObj = void 0)
      }
      return (
        -1 !== this.leadSurrogate &&
          ((t[e++] = this.defaultCharSingleByte), (this.leadSurrogate = -1)),
        t.slice(0, e)
      )
    }
  }),
  (Ry.prototype.findIdx = My),
  (Ly.prototype.write = function (t) {
    var e = Iy.alloc(2 * t.length),
      n = this.nodeIdx,
      r = this.prevBuf,
      i = this.prevBuf.length,
      o = -this.prevBuf.length
    i > 0 && (r = Iy.concat([r, t.slice(0, 10)]))
    for (var u = 0, s = 0; u < t.length; u++) {
      var c,
        a = u >= 0 ? t[u] : r[u + i]
      if ((c = this.decodeTables[n][a]) >= 0);
      else if (-1 === c) (u = o), (c = this.defaultCharUnicode.charCodeAt(0))
      else if (-2 === c) {
        var f = o >= 0 ? t.slice(o, u + 1) : r.slice(o + i, u + 1 + i),
          l = 12600 * (f[0] - 129) + 1260 * (f[1] - 48) + 10 * (f[2] - 129) + (f[3] - 48),
          h = My(this.gb18030.gbChars, l)
        c = this.gb18030.uChars[h] + l - this.gb18030.gbChars[h]
      } else {
        if (c <= -1e3) {
          n = -1e3 - c
          continue
        }
        if (!(c <= -10))
          throw new Error(
            'iconv-lite internal error: invalid decoding table value ' +
              c +
              ' at ' +
              n +
              '/' +
              a
          )
        for (var p = this.decodeTableSeq[-10 - c], d = 0; d < p.length - 1; d++)
          (c = p[d]), (e[s++] = 255 & c), (e[s++] = c >> 8)
        c = p[p.length - 1]
      }
      if (c > 65535) {
        c -= 65536
        var v = 55296 + Math.floor(c / 1024)
        ;(e[s++] = 255 & v), (e[s++] = v >> 8), (c = 56320 + (c % 1024))
      }
      ;(e[s++] = 255 & c), (e[s++] = c >> 8), (n = 0), (o = u + 1)
    }
    return (
      (this.nodeIdx = n),
      (this.prevBuf = o >= 0 ? t.slice(o) : r.slice(o + i)),
      e.slice(0, s).toString('ucs2')
    )
  }),
  (Ly.prototype.end = function () {
    for (var t = ''; this.prevBuf.length > 0; ) {
      t += this.defaultCharUnicode
      var e = this.prevBuf.slice(1)
      ;(this.prevBuf = Iy.alloc(0)),
        (this.nodeIdx = 0),
        e.length > 0 && (t += this.write(e))
    }
    return (this.nodeIdx = 0), t
  })
var Uy = { _dbcs: Ty },
  Vy = [
    ['0', '\0', 128],
    ['a1', '｡', 62],
    [
      '8140',
      '　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈',
      9,
      '＋－±×'
    ],
    ['8180', '÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓'],
    ['81b8', '∈∋⊆⊇⊂⊃∪∩'],
    ['81c8', '∧∨￢⇒⇔∀∃'],
    ['81da', '∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬'],
    ['81f0', 'Å‰♯♭♪†‡¶'],
    ['81fc', '◯'],
    ['824f', '０', 9],
    ['8260', 'Ａ', 25],
    ['8281', 'ａ', 25],
    ['829f', 'ぁ', 82],
    ['8340', 'ァ', 62],
    ['8380', 'ム', 22],
    ['839f', 'Α', 16, 'Σ', 6],
    ['83bf', 'α', 16, 'σ', 6],
    ['8440', 'А', 5, 'ЁЖ', 25],
    ['8470', 'а', 5, 'ёж', 7],
    ['8480', 'о', 17],
    ['849f', '─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂'],
    ['8740', '①', 19, 'Ⅰ', 9],
    ['875f', '㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡'],
    ['877e', '㍻'],
    ['8780', '〝〟№㏍℡㊤', 4, '㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪'],
    [
      '889f',
      '亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭'
    ],
    [
      '8940',
      '院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円'
    ],
    [
      '8980',
      '園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改'
    ],
    [
      '8a40',
      '魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫'
    ],
    [
      '8a80',
      '橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄'
    ],
    [
      '8b40',
      '機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救'
    ],
    [
      '8b80',
      '朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈'
    ],
    [
      '8c40',
      '掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨'
    ],
    [
      '8c80',
      '劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向'
    ],
    [
      '8d40',
      '后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降'
    ],
    [
      '8d80',
      '項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷'
    ],
    [
      '8e40',
      '察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止'
    ],
    [
      '8e80',
      '死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周'
    ],
    [
      '8f40',
      '宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳'
    ],
    [
      '8f80',
      '準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾'
    ],
    [
      '9040',
      '拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨'
    ],
    [
      '9080',
      '逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線'
    ],
    [
      '9140',
      '繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻'
    ],
    [
      '9180',
      '操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只'
    ],
    [
      '9240',
      '叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄'
    ],
    [
      '9280',
      '逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓'
    ],
    [
      '9340',
      '邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬'
    ],
    [
      '9380',
      '凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入'
    ],
    [
      '9440',
      '如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅'
    ],
    [
      '9480',
      '楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美'
    ],
    [
      '9540',
      '鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷'
    ],
    [
      '9580',
      '斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋'
    ],
    [
      '9640',
      '法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆'
    ],
    [
      '9680',
      '摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒'
    ],
    [
      '9740',
      '諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲'
    ],
    [
      '9780',
      '沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯'
    ],
    [
      '9840',
      '蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕'
    ],
    [
      '989f',
      '弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲'
    ],
    [
      '9940',
      '僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭'
    ],
    [
      '9980',
      '凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨'
    ],
    [
      '9a40',
      '咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸'
    ],
    [
      '9a80',
      '噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩'
    ],
    [
      '9b40',
      '奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀'
    ],
    [
      '9b80',
      '它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏'
    ],
    [
      '9c40',
      '廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠'
    ],
    [
      '9c80',
      '怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛'
    ],
    [
      '9d40',
      '戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫'
    ],
    [
      '9d80',
      '捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼'
    ],
    [
      '9e40',
      '曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎'
    ],
    [
      '9e80',
      '梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣'
    ],
    [
      '9f40',
      '檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯'
    ],
    [
      '9f80',
      '麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌'
    ],
    [
      'e040',
      '漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝'
    ],
    [
      'e080',
      '烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱'
    ],
    [
      'e140',
      '瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿'
    ],
    [
      'e180',
      '痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬'
    ],
    [
      'e240',
      '磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰'
    ],
    [
      'e280',
      '窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆'
    ],
    [
      'e340',
      '紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷'
    ],
    [
      'e380',
      '縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋'
    ],
    [
      'e440',
      '隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤'
    ],
    [
      'e480',
      '艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈'
    ],
    [
      'e540',
      '蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬'
    ],
    [
      'e580',
      '蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞'
    ],
    [
      'e640',
      '襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧'
    ],
    [
      'e680',
      '諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊'
    ],
    [
      'e740',
      '蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜'
    ],
    [
      'e780',
      '轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮'
    ],
    [
      'e840',
      '錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙'
    ],
    [
      'e880',
      '閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰'
    ],
    [
      'e940',
      '顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃'
    ],
    [
      'e980',
      '騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈'
    ],
    [
      'ea40',
      '鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯'
    ],
    [
      'ea80',
      '黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙'
    ],
    [
      'ed40',
      '纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏'
    ],
    [
      'ed80',
      '塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱'
    ],
    [
      'ee40',
      '犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙'
    ],
    [
      'ee80',
      '蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑'
    ],
    ['eeef', 'ⅰ', 9, '￢￤＇＂'],
    ['f040', '', 62],
    ['f080', '', 124],
    ['f140', '', 62],
    ['f180', '', 124],
    ['f240', '', 62],
    ['f280', '', 124],
    ['f340', '', 62],
    ['f380', '', 124],
    ['f440', '', 62],
    ['f480', '', 124],
    ['f540', '', 62],
    ['f580', '', 124],
    ['f640', '', 62],
    ['f680', '', 124],
    ['f740', '', 62],
    ['f780', '', 124],
    ['f840', '', 62],
    ['f880', '', 124],
    ['f940', ''],
    [
      'fa40',
      'ⅰ',
      9,
      'Ⅰ',
      9,
      '￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊'
    ],
    [
      'fa80',
      '兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯'
    ],
    [
      'fb40',
      '涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神'
    ],
    [
      'fb80',
      '祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙'
    ],
    ['fc40', '髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑']
  ],
  $y = [
    ['0', '\0', 127],
    ['8ea1', '｡', 62],
    [
      'a1a1',
      '　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈',
      9,
      '＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇'
    ],
    ['a2a1', '◆□■△▲▽▼※〒→←↑↓〓'],
    ['a2ba', '∈∋⊆⊇⊂⊃∪∩'],
    ['a2ca', '∧∨￢⇒⇔∀∃'],
    ['a2dc', '∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬'],
    ['a2f2', 'Å‰♯♭♪†‡¶'],
    ['a2fe', '◯'],
    ['a3b0', '０', 9],
    ['a3c1', 'Ａ', 25],
    ['a3e1', 'ａ', 25],
    ['a4a1', 'ぁ', 82],
    ['a5a1', 'ァ', 85],
    ['a6a1', 'Α', 16, 'Σ', 6],
    ['a6c1', 'α', 16, 'σ', 6],
    ['a7a1', 'А', 5, 'ЁЖ', 25],
    ['a7d1', 'а', 5, 'ёж', 25],
    ['a8a1', '─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂'],
    ['ada1', '①', 19, 'Ⅰ', 9],
    ['adc0', '㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡'],
    ['addf', '㍻〝〟№㏍℡㊤', 4, '㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪'],
    [
      'b0a1',
      '亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭'
    ],
    [
      'b1a1',
      '院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応'
    ],
    [
      'b2a1',
      '押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改'
    ],
    [
      'b3a1',
      '魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱'
    ],
    [
      'b4a1',
      '粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄'
    ],
    [
      'b5a1',
      '機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京'
    ],
    [
      'b6a1',
      '供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈'
    ],
    [
      'b7a1',
      '掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲'
    ],
    [
      'b8a1',
      '検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向'
    ],
    [
      'b9a1',
      '后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込'
    ],
    [
      'baa1',
      '此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷'
    ],
    [
      'bba1',
      '察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時'
    ],
    [
      'bca1',
      '次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周'
    ],
    [
      'bda1',
      '宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償'
    ],
    [
      'bea1',
      '勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾'
    ],
    [
      'bfa1',
      '拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾'
    ],
    [
      'c0a1',
      '澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線'
    ],
    [
      'c1a1',
      '繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎'
    ],
    [
      'c2a1',
      '臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只'
    ],
    [
      'c3a1',
      '叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵'
    ],
    [
      'c4a1',
      '帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓'
    ],
    [
      'c5a1',
      '邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到'
    ],
    [
      'c6a1',
      '董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入'
    ],
    [
      'c7a1',
      '如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦'
    ],
    [
      'c8a1',
      '函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美'
    ],
    [
      'c9a1',
      '鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服'
    ],
    [
      'caa1',
      '福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋'
    ],
    [
      'cba1',
      '法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満'
    ],
    [
      'cca1',
      '漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒'
    ],
    [
      'cda1',
      '諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃'
    ],
    [
      'cea1',
      '痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯'
    ],
    [
      'cfa1',
      '蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕'
    ],
    [
      'd0a1',
      '弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲'
    ],
    [
      'd1a1',
      '僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨'
    ],
    [
      'd2a1',
      '辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨'
    ],
    [
      'd3a1',
      '咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉'
    ],
    [
      'd4a1',
      '圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩'
    ],
    [
      'd5a1',
      '奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓'
    ],
    [
      'd6a1',
      '屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏'
    ],
    [
      'd7a1',
      '廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚'
    ],
    [
      'd8a1',
      '悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛'
    ],
    [
      'd9a1',
      '戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼'
    ],
    [
      'daa1',
      '據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼'
    ],
    [
      'dba1',
      '曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍'
    ],
    [
      'dca1',
      '棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣'
    ],
    [
      'dda1',
      '檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾'
    ],
    [
      'dea1',
      '沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌'
    ],
    [
      'dfa1',
      '漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼'
    ],
    [
      'e0a1',
      '燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱'
    ],
    [
      'e1a1',
      '瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰'
    ],
    [
      'e2a1',
      '癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬'
    ],
    [
      'e3a1',
      '磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐'
    ],
    [
      'e4a1',
      '筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆'
    ],
    [
      'e5a1',
      '紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺'
    ],
    [
      'e6a1',
      '罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋'
    ],
    [
      'e7a1',
      '隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙'
    ],
    [
      'e8a1',
      '茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈'
    ],
    [
      'e9a1',
      '蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙'
    ],
    [
      'eaa1',
      '蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞'
    ],
    [
      'eba1',
      '襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫'
    ],
    [
      'eca1',
      '譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊'
    ],
    [
      'eda1',
      '蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸'
    ],
    [
      'eea1',
      '遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮'
    ],
    [
      'efa1',
      '錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞'
    ],
    [
      'f0a1',
      '陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰'
    ],
    [
      'f1a1',
      '顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷'
    ],
    [
      'f2a1',
      '髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈'
    ],
    [
      'f3a1',
      '鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠'
    ],
    ['f4a1', '堯槇遙瑤凜熙'],
    [
      'f9a1',
      '纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德'
    ],
    [
      'faa1',
      '忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱'
    ],
    [
      'fba1',
      '犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚'
    ],
    [
      'fca1',
      '釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑'
    ],
    ['fcf1', 'ⅰ', 9, '￢￤＇＂'],
    ['8fa2af', '˘ˇ¸˙˝¯˛˚～΄΅'],
    ['8fa2c2', '¡¦¿'],
    ['8fa2eb', 'ºª©®™¤№'],
    ['8fa6e1', 'ΆΈΉΊΪ'],
    ['8fa6e7', 'Ό'],
    ['8fa6e9', 'ΎΫ'],
    ['8fa6ec', 'Ώ'],
    ['8fa6f1', 'άέήίϊΐόςύϋΰώ'],
    ['8fa7c2', 'Ђ', 10, 'ЎЏ'],
    ['8fa7f2', 'ђ', 10, 'ўџ'],
    ['8fa9a1', 'ÆĐ'],
    ['8fa9a4', 'Ħ'],
    ['8fa9a6', 'Ĳ'],
    ['8fa9a8', 'ŁĿ'],
    ['8fa9ab', 'ŊØŒ'],
    ['8fa9af', 'ŦÞ'],
    ['8fa9c1', 'æđðħıĳĸłŀŉŋøœßŧþ'],
    ['8faaa1', 'ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ'],
    ['8faaba', 'ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ'],
    ['8faba1', 'áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ'],
    ['8fabbd', 'ġĥíìïîǐ'],
    ['8fabc5', 'īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż'],
    [
      '8fb0a1',
      '丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄'
    ],
    [
      '8fb1a1',
      '侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐'
    ],
    [
      '8fb2a1',
      '傒傓傔傖傛傜傞',
      4,
      '傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂'
    ],
    [
      '8fb3a1',
      '凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋'
    ],
    [
      '8fb4a1',
      '匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿'
    ],
    [
      '8fb5a1',
      '咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒'
    ],
    [
      '8fb6a1',
      '嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍',
      5,
      '嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤',
      4,
      '囱囫园'
    ],
    [
      '8fb7a1',
      '囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭',
      4,
      '坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡'
    ],
    [
      '8fb8a1',
      '堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭'
    ],
    [
      '8fb9a1',
      '奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿'
    ],
    [
      '8fbaa1',
      '嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖',
      4,
      '寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩'
    ],
    [
      '8fbba1',
      '屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤'
    ],
    [
      '8fbca1',
      '巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪',
      4,
      '幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧'
    ],
    [
      '8fbda1',
      '彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐',
      4,
      '忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷'
    ],
    [
      '8fbea1',
      '悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐',
      4,
      '愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥'
    ],
    [
      '8fbfa1',
      '懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵'
    ],
    [
      '8fc0a1',
      '捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿'
    ],
    [
      '8fc1a1',
      '擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝'
    ],
    [
      '8fc2a1',
      '昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝'
    ],
    [
      '8fc3a1',
      '杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮',
      4,
      '桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏'
    ],
    [
      '8fc4a1',
      '棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲'
    ],
    [
      '8fc5a1',
      '樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽'
    ],
    [
      '8fc6a1',
      '歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖'
    ],
    [
      '8fc7a1',
      '泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞'
    ],
    [
      '8fc8a1',
      '湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊'
    ],
    [
      '8fc9a1',
      '濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔',
      4,
      '炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃',
      4,
      '焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠'
    ],
    [
      '8fcaa1',
      '煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻'
    ],
    [
      '8fcba1',
      '狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽'
    ],
    [
      '8fcca1',
      '珿琀琁琄琇琊琑琚琛琤琦琨',
      9,
      '琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆'
    ],
    [
      '8fcda1',
      '甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹',
      5,
      '疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹'
    ],
    [
      '8fcea1',
      '瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢',
      6,
      '皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢'
    ],
    [
      '8fcfa1',
      '睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳'
    ],
    [
      '8fd0a1',
      '碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞'
    ],
    [
      '8fd1a1',
      '秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰'
    ],
    [
      '8fd2a1',
      '笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙',
      5
    ],
    [
      '8fd3a1',
      '籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝'
    ],
    [
      '8fd4a1',
      '綞綦綧綪綳綶綷綹緂',
      4,
      '緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭'
    ],
    [
      '8fd5a1',
      '罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮'
    ],
    [
      '8fd6a1',
      '胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆'
    ],
    [
      '8fd7a1',
      '艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸'
    ],
    [
      '8fd8a1',
      '荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓'
    ],
    [
      '8fd9a1',
      '蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏',
      4,
      '蕖蕙蕜',
      6,
      '蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼'
    ],
    [
      '8fdaa1',
      '藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠',
      4,
      '虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣'
    ],
    [
      '8fdba1',
      '蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃',
      6,
      '螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵'
    ],
    [
      '8fdca1',
      '蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊',
      4,
      '裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺'
    ],
    [
      '8fdda1',
      '襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔',
      4,
      '觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳'
    ],
    [
      '8fdea1',
      '誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂',
      4,
      '譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆'
    ],
    [
      '8fdfa1',
      '貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢'
    ],
    [
      '8fe0a1',
      '踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁'
    ],
    [
      '8fe1a1',
      '轃轇轏轑',
      4,
      '轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃'
    ],
    [
      '8fe2a1',
      '郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿'
    ],
    [
      '8fe3a1',
      '釂釃釅釓釔釗釙釚釞釤釥釩釪釬',
      5,
      '釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵',
      4,
      '鉻鉼鉽鉿銈銉銊銍銎銒銗'
    ],
    [
      '8fe4a1',
      '銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿',
      4,
      '鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶'
    ],
    [
      '8fe5a1',
      '鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉',
      4,
      '鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹'
    ],
    [
      '8fe6a1',
      '镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂'
    ],
    [
      '8fe7a1',
      '霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦'
    ],
    [
      '8fe8a1',
      '頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱',
      4,
      '餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵'
    ],
    [
      '8fe9a1',
      '馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿',
      4
    ],
    [
      '8feaa1',
      '鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪',
      4,
      '魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸'
    ],
    [
      '8feba1',
      '鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦',
      4,
      '鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻'
    ],
    [
      '8feca1',
      '鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵'
    ],
    [
      '8feda1',
      '黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃',
      4,
      '齓齕齖齗齘齚齝齞齨齩齭',
      4,
      '齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥'
    ]
  ],
  zy = [
    ['0', '\0', 127, '€'],
    [
      '8140',
      '丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪',
      5,
      '乲乴',
      9,
      '乿',
      6,
      '亇亊'
    ],
    [
      '8180',
      '亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂',
      6,
      '伋伌伒',
      4,
      '伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾',
      4,
      '佄佅佇',
      5,
      '佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢'
    ],
    [
      '8240',
      '侤侫侭侰',
      4,
      '侶',
      8,
      '俀俁係俆俇俈俉俋俌俍俒',
      4,
      '俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿',
      11
    ],
    [
      '8280',
      '個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯',
      10,
      '倻倽倿偀偁偂偄偅偆偉偊偋偍偐',
      4,
      '偖偗偘偙偛偝',
      7,
      '偦',
      5,
      '偭',
      8,
      '偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎',
      20,
      '傤傦傪傫傭',
      4,
      '傳',
      6,
      '傼'
    ],
    ['8340', '傽', 17, '僐', 5, '僗僘僙僛', 10, '僨僩僪僫僯僰僱僲僴僶', 4, '僼', 9, '儈'],
    [
      '8380',
      '儉儊儌',
      5,
      '儓',
      13,
      '儢',
      28,
      '兂兇兊兌兎兏児兒兓兗兘兙兛兝',
      4,
      '兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦',
      4,
      '冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒',
      5
    ],
    [
      '8440',
      '凘凙凚凜凞凟凢凣凥',
      5,
      '凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄',
      5,
      '剋剎剏剒剓剕剗剘'
    ],
    [
      '8480',
      '剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳',
      9,
      '剾劀劃',
      4,
      '劉',
      6,
      '劑劒劔',
      6,
      '劜劤劥劦劧劮劯劰労',
      9,
      '勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務',
      5,
      '勠勡勢勣勥',
      10,
      '勱',
      7,
      '勻勼勽匁匂匃匄匇匉匊匋匌匎'
    ],
    [
      '8540',
      '匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯',
      9,
      '匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏'
    ],
    [
      '8580',
      '厐',
      4,
      '厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯',
      6,
      '厷厸厹厺厼厽厾叀參',
      4,
      '収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝',
      4,
      '呣呥呧呩',
      7,
      '呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡'
    ],
    [
      '8640',
      '咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠',
      4,
      '哫哬哯哰哱哴',
      5,
      '哻哾唀唂唃唄唅唈唊',
      4,
      '唒唓唕',
      5,
      '唜唝唞唟唡唥唦'
    ],
    [
      '8680',
      '唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋',
      4,
      '啑啒啓啔啗',
      4,
      '啝啞啟啠啢啣啨啩啫啯',
      5,
      '啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠',
      6,
      '喨',
      8,
      '喲喴営喸喺喼喿',
      4,
      '嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗',
      4,
      '嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸',
      4,
      '嗿嘂嘃嘄嘅'
    ],
    [
      '8740',
      '嘆嘇嘊嘋嘍嘐',
      7,
      '嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀',
      11,
      '噏',
      4,
      '噕噖噚噛噝',
      4
    ],
    [
      '8780',
      '噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽',
      7,
      '嚇',
      6,
      '嚐嚑嚒嚔',
      14,
      '嚤',
      10,
      '嚰',
      6,
      '嚸嚹嚺嚻嚽',
      12,
      '囋',
      8,
      '囕囖囘囙囜団囥',
      5,
      '囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國',
      6
    ],
    [
      '8840',
      '園',
      9,
      '圝圞圠圡圢圤圥圦圧圫圱圲圴',
      4,
      '圼圽圿坁坃坄坅坆坈坉坋坒',
      4,
      '坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀'
    ],
    [
      '8880',
      '垁垇垈垉垊垍',
      4,
      '垔',
      6,
      '垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹',
      8,
      '埄',
      6,
      '埌埍埐埑埓埖埗埛埜埞埡埢埣埥',
      7,
      '埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥',
      4,
      '堫',
      4,
      '報堲堳場堶',
      7
    ],
    [
      '8940',
      '堾',
      5,
      '塅',
      6,
      '塎塏塐塒塓塕塖塗塙',
      4,
      '塟',
      5,
      '塦',
      4,
      '塭',
      16,
      '塿墂墄墆墇墈墊墋墌'
    ],
    [
      '8980',
      '墍',
      4,
      '墔',
      4,
      '墛墜墝墠',
      7,
      '墪',
      17,
      '墽墾墿壀壂壃壄壆',
      10,
      '壒壓壔壖',
      13,
      '壥',
      5,
      '壭壯壱売壴壵壷壸壺',
      7,
      '夃夅夆夈',
      4,
      '夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻'
    ],
    [
      '8a40',
      '夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛',
      4,
      '奡奣奤奦',
      12,
      '奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦'
    ],
    [
      '8a80',
      '妧妬妭妰妱妳',
      5,
      '妺妼妽妿',
      6,
      '姇姈姉姌姍姎姏姕姖姙姛姞',
      4,
      '姤姦姧姩姪姫姭',
      11,
      '姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪',
      6,
      '娳娵娷',
      4,
      '娽娾娿婁',
      4,
      '婇婈婋',
      9,
      '婖婗婘婙婛',
      5
    ],
    ['8b40', '婡婣婤婥婦婨婩婫', 8, '婸婹婻婼婽婾媀', 17, '媓', 6, '媜', 13, '媫媬'],
    [
      '8b80',
      '媭',
      4,
      '媴媶媷媹',
      4,
      '媿嫀嫃',
      5,
      '嫊嫋嫍',
      4,
      '嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬',
      4,
      '嫲',
      22,
      '嬊',
      11,
      '嬘',
      25,
      '嬳嬵嬶嬸',
      7,
      '孁',
      6
    ],
    [
      '8c40',
      '孈',
      7,
      '孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏'
    ],
    [
      '8c80',
      '寑寔',
      8,
      '寠寢寣實寧審',
      4,
      '寯寱',
      6,
      '寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧',
      6,
      '屰屲',
      6,
      '屻屼屽屾岀岃',
      4,
      '岉岊岋岎岏岒岓岕岝',
      4,
      '岤',
      4
    ],
    [
      '8d40',
      '岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅',
      5,
      '峌',
      5,
      '峓',
      5,
      '峚',
      6,
      '峢峣峧峩峫峬峮峯峱',
      9,
      '峼',
      4
    ],
    [
      '8d80',
      '崁崄崅崈',
      5,
      '崏',
      4,
      '崕崗崘崙崚崜崝崟',
      4,
      '崥崨崪崫崬崯',
      4,
      '崵',
      7,
      '崿',
      7,
      '嵈嵉嵍',
      10,
      '嵙嵚嵜嵞',
      10,
      '嵪嵭嵮嵰嵱嵲嵳嵵',
      12,
      '嶃',
      21,
      '嶚嶛嶜嶞嶟嶠'
    ],
    ['8e40', '嶡', 21, '嶸', 12, '巆', 6, '巎', 12, '巜巟巠巣巤巪巬巭'],
    [
      '8e80',
      '巰巵巶巸',
      4,
      '巿帀帄帇帉帊帋帍帎帒帓帗帞',
      7,
      '帨',
      4,
      '帯帰帲',
      4,
      '帹帺帾帿幀幁幃幆',
      5,
      '幍',
      6,
      '幖',
      4,
      '幜幝幟幠幣',
      14,
      '幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨',
      4,
      '庮',
      4,
      '庴庺庻庼庽庿',
      6
    ],
    [
      '8f40',
      '廆廇廈廋',
      5,
      '廔廕廗廘廙廚廜',
      11,
      '廩廫',
      8,
      '廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤'
    ],
    [
      '8f80',
      '弨弫弬弮弰弲',
      6,
      '弻弽弾弿彁',
      14,
      '彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢',
      5,
      '復徫徬徯',
      5,
      '徶徸徹徺徻徾',
      4,
      '忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇'
    ],
    [
      '9040',
      '怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰',
      4,
      '怶',
      4,
      '怽怾恀恄',
      6,
      '恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀'
    ],
    [
      '9080',
      '悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽',
      7,
      '惇惈惉惌',
      4,
      '惒惓惔惖惗惙惛惞惡',
      4,
      '惪惱惲惵惷惸惻',
      4,
      '愂愃愄愅愇愊愋愌愐',
      4,
      '愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬',
      18,
      '慀',
      6
    ],
    [
      '9140',
      '慇慉態慍慏慐慒慓慔慖',
      6,
      '慞慟慠慡慣慤慥慦慩',
      6,
      '慱慲慳慴慶慸',
      18,
      '憌憍憏',
      4,
      '憕'
    ],
    [
      '9180',
      '憖',
      6,
      '憞',
      8,
      '憪憫憭',
      9,
      '憸',
      5,
      '憿懀懁懃',
      4,
      '應懌',
      4,
      '懓懕',
      16,
      '懧',
      13,
      '懶',
      8,
      '戀',
      5,
      '戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸',
      4,
      '扂扄扅扆扊'
    ],
    [
      '9240',
      '扏扐払扖扗扙扚扜',
      6,
      '扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋',
      5,
      '抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁'
    ],
    [
      '9280',
      '拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳',
      5,
      '挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖',
      7,
      '捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙',
      6,
      '採掤掦掫掯掱掲掵掶掹掻掽掿揀'
    ],
    [
      '9340',
      '揁揂揃揅揇揈揊揋揌揑揓揔揕揗',
      6,
      '揟揢揤',
      4,
      '揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆',
      4,
      '損搎搑搒搕',
      5,
      '搝搟搢搣搤'
    ],
    [
      '9380',
      '搥搧搨搩搫搮',
      5,
      '搵',
      4,
      '搻搼搾摀摂摃摉摋',
      6,
      '摓摕摖摗摙',
      4,
      '摟',
      7,
      '摨摪摫摬摮',
      9,
      '摻',
      6,
      '撃撆撈',
      8,
      '撓撔撗撘撚撛撜撝撟',
      4,
      '撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆',
      6,
      '擏擑擓擔擕擖擙據'
    ],
    ['9440', '擛擜擝擟擠擡擣擥擧', 24, '攁', 7, '攊', 7, '攓', 4, '攙', 8],
    [
      '9480',
      '攢攣攤攦',
      4,
      '攬攭攰攱攲攳攷攺攼攽敀',
      4,
      '敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數',
      14,
      '斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱',
      7,
      '斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘',
      7,
      '旡旣旤旪旫'
    ],
    [
      '9540',
      '旲旳旴旵旸旹旻',
      4,
      '昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷',
      4,
      '昽昿晀時晄',
      6,
      '晍晎晐晑晘'
    ],
    [
      '9580',
      '晙晛晜晝晞晠晢晣晥晧晩',
      4,
      '晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘',
      4,
      '暞',
      8,
      '暩',
      4,
      '暯',
      4,
      '暵暶暷暸暺暻暼暽暿',
      25,
      '曚曞',
      7,
      '曧曨曪',
      5,
      '曱曵曶書曺曻曽朁朂會'
    ],
    [
      '9640',
      '朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠',
      5,
      '朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗',
      4,
      '杝杢杣杤杦杧杫杬杮東杴杶'
    ],
    [
      '9680',
      '杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹',
      7,
      '柂柅',
      9,
      '柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵',
      7,
      '柾栁栂栃栄栆栍栐栒栔栕栘',
      4,
      '栞栟栠栢',
      6,
      '栫',
      6,
      '栴栵栶栺栻栿桇桋桍桏桒桖',
      5
    ],
    [
      '9740',
      '桜桝桞桟桪桬',
      7,
      '桵桸',
      8,
      '梂梄梇',
      7,
      '梐梑梒梔梕梖梘',
      9,
      '梣梤梥梩梪梫梬梮梱梲梴梶梷梸'
    ],
    [
      '9780',
      '梹',
      6,
      '棁棃',
      5,
      '棊棌棎棏棐棑棓棔棖棗棙棛',
      4,
      '棡棢棤',
      9,
      '棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆',
      4,
      '椌椏椑椓',
      11,
      '椡椢椣椥',
      7,
      '椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃',
      16,
      '楕楖楘楙楛楜楟'
    ],
    [
      '9840',
      '楡楢楤楥楧楨楩楪楬業楯楰楲',
      4,
      '楺楻楽楾楿榁榃榅榊榋榌榎',
      5,
      '榖榗榙榚榝',
      9,
      '榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽'
    ],
    [
      '9880',
      '榾榿槀槂',
      7,
      '構槍槏槑槒槓槕',
      5,
      '槜槝槞槡',
      11,
      '槮槯槰槱槳',
      9,
      '槾樀',
      9,
      '樋',
      11,
      '標',
      5,
      '樠樢',
      5,
      '権樫樬樭樮樰樲樳樴樶',
      6,
      '樿',
      4,
      '橅橆橈',
      7,
      '橑',
      6,
      '橚'
    ],
    [
      '9940',
      '橜',
      4,
      '橢橣橤橦',
      10,
      '橲',
      6,
      '橺橻橽橾橿檁檂檃檅',
      8,
      '檏檒',
      4,
      '檘',
      7,
      '檡',
      5
    ],
    ['9980', '檧檨檪檭', 114, '欥欦欨', 6],
    [
      '9a40',
      '欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍',
      11,
      '歚',
      7,
      '歨歩歫',
      13,
      '歺歽歾歿殀殅殈'
    ],
    [
      '9a80',
      '殌殎殏殐殑殔殕殗殘殙殜',
      4,
      '殢',
      7,
      '殫',
      7,
      '殶殸',
      6,
      '毀毃毄毆',
      4,
      '毌毎毐毑毘毚毜',
      4,
      '毢',
      7,
      '毬毭毮毰毱毲毴毶毷毸毺毻毼毾',
      6,
      '氈',
      4,
      '氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋',
      4,
      '汑汒汓汖汘'
    ],
    [
      '9b40',
      '汙汚汢汣汥汦汧汫',
      4,
      '汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘'
    ],
    [
      '9b80',
      '泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟',
      5,
      '洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽',
      4,
      '涃涄涆涇涊涋涍涏涐涒涖',
      4,
      '涜涢涥涬涭涰涱涳涴涶涷涹',
      5,
      '淁淂淃淈淉淊'
    ],
    [
      '9c40',
      '淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽',
      7,
      '渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵'
    ],
    [
      '9c80',
      '渶渷渹渻',
      7,
      '湅',
      7,
      '湏湐湑湒湕湗湙湚湜湝湞湠',
      10,
      '湬湭湯',
      14,
      '満溁溂溄溇溈溊',
      4,
      '溑',
      6,
      '溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪',
      5
    ],
    [
      '9d40',
      '滰滱滲滳滵滶滷滸滺',
      7,
      '漃漄漅漇漈漊',
      4,
      '漐漑漒漖',
      9,
      '漡漢漣漥漦漧漨漬漮漰漲漴漵漷',
      6,
      '漿潀潁潂'
    ],
    [
      '9d80',
      '潃潄潅潈潉潊潌潎',
      9,
      '潙潚潛潝潟潠潡潣潤潥潧',
      5,
      '潯潰潱潳潵潶潷潹潻潽',
      6,
      '澅澆澇澊澋澏',
      12,
      '澝澞澟澠澢',
      4,
      '澨',
      10,
      '澴澵澷澸澺',
      5,
      '濁濃',
      5,
      '濊',
      6,
      '濓',
      10,
      '濟濢濣濤濥'
    ],
    ['9e40', '濦', 7, '濰', 32, '瀒', 7, '瀜', 6, '瀤', 6],
    [
      '9e80',
      '瀫',
      9,
      '瀶瀷瀸瀺',
      17,
      '灍灎灐',
      13,
      '灟',
      11,
      '灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞',
      12,
      '炰炲炴炵炶為炾炿烄烅烆烇烉烋',
      12,
      '烚'
    ],
    [
      '9f40',
      '烜烝烞烠烡烢烣烥烪烮烰',
      6,
      '烸烺烻烼烾',
      10,
      '焋',
      4,
      '焑焒焔焗焛',
      10,
      '焧',
      7,
      '焲焳焴'
    ],
    [
      '9f80',
      '焵焷',
      13,
      '煆煇煈煉煋煍煏',
      12,
      '煝煟',
      4,
      '煥煩',
      4,
      '煯煰煱煴煵煶煷煹煻煼煾',
      5,
      '熅',
      4,
      '熋熌熍熎熐熑熒熓熕熖熗熚',
      4,
      '熡',
      6,
      '熩熪熫熭',
      5,
      '熴熶熷熸熺',
      8,
      '燄',
      9,
      '燏',
      4
    ],
    ['a040', '燖', 9, '燡燢燣燤燦燨', 5, '燯', 9, '燺', 11, '爇', 19],
    [
      'a080',
      '爛爜爞',
      9,
      '爩爫爭爮爯爲爳爴爺爼爾牀',
      6,
      '牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅',
      4,
      '犌犎犐犑犓',
      11,
      '犠',
      11,
      '犮犱犲犳犵犺',
      6,
      '狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛'
    ],
    [
      'a1a1',
      '　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈',
      7,
      '〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓'
    ],
    ['a2a1', 'ⅰ', 9],
    ['a2b1', '⒈', 19, '⑴', 19, '①', 9],
    ['a2e5', '㈠', 9],
    ['a2f1', 'Ⅰ', 11],
    ['a3a1', '！＂＃￥％', 88, '￣'],
    ['a4a1', 'ぁ', 82],
    ['a5a1', 'ァ', 85],
    ['a6a1', 'Α', 16, 'Σ', 6],
    ['a6c1', 'α', 16, 'σ', 6],
    ['a6e0', '︵︶︹︺︿﹀︽︾﹁﹂﹃﹄'],
    ['a6ee', '︻︼︷︸︱'],
    ['a6f4', '︳︴'],
    ['a7a1', 'А', 5, 'ЁЖ', 25],
    ['a7d1', 'а', 5, 'ёж', 25],
    ['a840', 'ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═', 35, '▁', 6],
    ['a880', '█', 7, '▓▔▕▼▽◢◣◤◥☉⊕〒〝〞'],
    ['a8a1', 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ'],
    ['a8bd', 'ńň'],
    ['a8c0', 'ɡ'],
    ['a8c5', 'ㄅ', 36],
    ['a940', '〡', 8, '㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤'],
    ['a959', '℡㈱'],
    ['a95c', '‐'],
    ['a960', 'ー゛゜ヽヾ〆ゝゞ﹉', 9, '﹔﹕﹖﹗﹙', 8],
    ['a980', '﹢', 4, '﹨﹩﹪﹫'],
    ['a996', '〇'],
    ['a9a4', '─', 75],
    [
      'aa40',
      '狜狝狟狢',
      5,
      '狪狫狵狶狹狽狾狿猀猂猄',
      5,
      '猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀',
      8
    ],
    ['aa80', '獉獊獋獌獎獏獑獓獔獕獖獘', 7, '獡', 10, '獮獰獱'],
    [
      'ab40',
      '獲',
      11,
      '獿',
      4,
      '玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣',
      5,
      '玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃',
      4
    ],
    ['ab80', '珋珌珎珒', 6, '珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳', 4],
    [
      'ac40',
      '珸',
      10,
      '琄琇琈琋琌琍琎琑',
      8,
      '琜',
      5,
      '琣琤琧琩琫琭琯琱琲琷',
      4,
      '琽琾琿瑀瑂',
      11
    ],
    ['ac80', '瑎', 6, '瑖瑘瑝瑠', 12, '瑮瑯瑱', 4, '瑸瑹瑺'],
    ['ad40', '瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑', 10, '璝璟', 7, '璪', 15, '璻', 12],
    ['ad80', '瓈', 9, '瓓', 8, '瓝瓟瓡瓥瓧', 6, '瓰瓱瓲'],
    [
      'ae40',
      '瓳瓵瓸',
      6,
      '甀甁甂甃甅',
      7,
      '甎甐甒甔甕甖甗甛甝甞甠',
      4,
      '甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘'
    ],
    ['ae80', '畝', 7, '畧畨畩畫', 6, '畳畵當畷畺', 4, '疀疁疂疄疅疇'],
    [
      'af40',
      '疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦',
      4,
      '疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇'
    ],
    ['af80', '瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄'],
    [
      'b040',
      '癅',
      6,
      '癎',
      5,
      '癕癗',
      4,
      '癝癟癠癡癢癤',
      6,
      '癬癭癮癰',
      7,
      '癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛'
    ],
    [
      'b080',
      '皜',
      7,
      '皥',
      8,
      '皯皰皳皵',
      9,
      '盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥'
    ],
    [
      'b140',
      '盄盇盉盋盌盓盕盙盚盜盝盞盠',
      4,
      '盦',
      7,
      '盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎',
      10,
      '眛眜眝眞眡眣眤眥眧眪眫'
    ],
    [
      'b180',
      '眬眮眰',
      4,
      '眹眻眽眾眿睂睄睅睆睈',
      7,
      '睒',
      7,
      '睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳'
    ],
    [
      'b240',
      '睝睞睟睠睤睧睩睪睭',
      11,
      '睺睻睼瞁瞂瞃瞆',
      5,
      '瞏瞐瞓',
      11,
      '瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶',
      4
    ],
    [
      'b280',
      '瞼瞾矀',
      12,
      '矎',
      8,
      '矘矙矚矝',
      4,
      '矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖'
    ],
    [
      'b340',
      '矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃',
      5,
      '砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚'
    ],
    [
      'b380',
      '硛硜硞',
      11,
      '硯',
      7,
      '硸硹硺硻硽',
      6,
      '场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚'
    ],
    [
      'b440',
      '碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨',
      7,
      '碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚',
      9
    ],
    [
      'b480',
      '磤磥磦磧磩磪磫磭',
      4,
      '磳磵磶磸磹磻',
      5,
      '礂礃礄礆',
      6,
      '础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮'
    ],
    [
      'b540',
      '礍',
      5,
      '礔',
      9,
      '礟',
      4,
      '礥',
      14,
      '礵',
      4,
      '礽礿祂祃祄祅祇祊',
      8,
      '祔祕祘祙祡祣'
    ],
    [
      'b580',
      '祤祦祩祪祫祬祮祰',
      6,
      '祹祻',
      4,
      '禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠'
    ],
    [
      'b640',
      '禓',
      6,
      '禛',
      11,
      '禨',
      10,
      '禴',
      4,
      '禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙',
      5,
      '秠秡秢秥秨秪'
    ],
    [
      'b680',
      '秬秮秱',
      6,
      '秹秺秼秾秿稁稄稅稇稈稉稊稌稏',
      4,
      '稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二'
    ],
    ['b740', '稝稟稡稢稤', 14, '稴稵稶稸稺稾穀', 5, '穇', 9, '穒', 4, '穘', 16],
    [
      'b780',
      '穩',
      6,
      '穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服'
    ],
    [
      'b840',
      '窣窤窧窩窪窫窮',
      4,
      '窴',
      10,
      '竀',
      10,
      '竌',
      9,
      '竗竘竚竛竜竝竡竢竤竧',
      5,
      '竮竰竱竲竳'
    ],
    [
      'b880',
      '竴',
      4,
      '竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹'
    ],
    [
      'b940',
      '笯笰笲笴笵笶笷笹笻笽笿',
      5,
      '筆筈筊筍筎筓筕筗筙筜筞筟筡筣',
      10,
      '筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆',
      6,
      '箎箏'
    ],
    [
      'b980',
      '箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹',
      7,
      '篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈'
    ],
    [
      'ba40',
      '篅篈築篊篋篍篎篏篐篒篔',
      4,
      '篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲',
      4,
      '篸篹篺篻篽篿',
      7,
      '簈簉簊簍簎簐',
      5,
      '簗簘簙'
    ],
    [
      'ba80',
      '簚',
      4,
      '簠',
      5,
      '簨簩簫',
      12,
      '簹',
      5,
      '籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖'
    ],
    ['bb40', '籃', 9, '籎', 36, '籵', 5, '籾', 9],
    [
      'bb80',
      '粈粊',
      6,
      '粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴',
      4,
      '粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕'
    ],
    [
      'bc40',
      '粿糀糂糃糄糆糉糋糎',
      6,
      '糘糚糛糝糞糡',
      6,
      '糩',
      5,
      '糰',
      7,
      '糹糺糼',
      13,
      '紋',
      5
    ],
    [
      'bc80',
      '紑',
      14,
      '紡紣紤紥紦紨紩紪紬紭紮細',
      6,
      '肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件'
    ],
    ['bd40', '紷', 54, '絯', 7],
    [
      'bd80',
      '絸',
      32,
      '健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸'
    ],
    ['be40', '継', 12, '綧', 6, '綯', 42],
    [
      'be80',
      '線',
      32,
      '尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻'
    ],
    ['bf40', '緻', 62],
    [
      'bf80',
      '縺縼',
      4,
      '繂',
      4,
      '繈',
      21,
      '俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀'
    ],
    ['c040', '繞', 35, '纃', 23, '纜纝纞'],
    [
      'c080',
      '纮纴纻纼绖绤绬绹缊缐缞缷缹缻',
      6,
      '罃罆',
      9,
      '罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐'
    ],
    [
      'c140',
      '罖罙罛罜罝罞罠罣',
      4,
      '罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂',
      7,
      '羋羍羏',
      4,
      '羕',
      4,
      '羛羜羠羢羣羥羦羨',
      6,
      '羱'
    ],
    [
      'c180',
      '羳',
      4,
      '羺羻羾翀翂翃翄翆翇翈翉翋翍翏',
      4,
      '翖翗翙',
      5,
      '翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿'
    ],
    [
      'c240',
      '翤翧翨翪翫翬翭翯翲翴',
      6,
      '翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫',
      5,
      '耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗'
    ],
    [
      'c280',
      '聙聛',
      13,
      '聫',
      5,
      '聲',
      11,
      '隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫'
    ],
    [
      'c340',
      '聾肁肂肅肈肊肍',
      5,
      '肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇',
      4,
      '胏',
      6,
      '胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋'
    ],
    [
      'c380',
      '脌脕脗脙脛脜脝脟',
      12,
      '脭脮脰脳脴脵脷脹',
      4,
      '脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸'
    ],
    [
      'c440',
      '腀',
      5,
      '腇腉腍腎腏腒腖腗腘腛',
      4,
      '腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃',
      4,
      '膉膋膌膍膎膐膒',
      5,
      '膙膚膞',
      4,
      '膤膥'
    ],
    [
      'c480',
      '膧膩膫',
      7,
      '膴',
      5,
      '膼膽膾膿臄臅臇臈臉臋臍',
      6,
      '摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁'
    ],
    [
      'c540',
      '臔',
      14,
      '臤臥臦臨臩臫臮',
      4,
      '臵',
      5,
      '臽臿舃與',
      4,
      '舎舏舑舓舕',
      5,
      '舝舠舤舥舦舧舩舮舲舺舼舽舿'
    ],
    [
      'c580',
      '艀艁艂艃艅艆艈艊艌艍艎艐',
      7,
      '艙艛艜艝艞艠',
      7,
      '艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗'
    ],
    [
      'c640',
      '艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸'
    ],
    [
      'c680',
      '苺苼',
      4,
      '茊茋茍茐茒茓茖茘茙茝',
      9,
      '茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐'
    ],
    [
      'c740',
      '茾茿荁荂荄荅荈荊',
      4,
      '荓荕',
      4,
      '荝荢荰',
      6,
      '荹荺荾',
      6,
      '莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡',
      6,
      '莬莭莮'
    ],
    [
      'c780',
      '莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠'
    ],
    [
      'c840',
      '菮華菳',
      4,
      '菺菻菼菾菿萀萂萅萇萈萉萊萐萒',
      5,
      '萙萚萛萞',
      5,
      '萩',
      7,
      '萲',
      5,
      '萹萺萻萾',
      7,
      '葇葈葉'
    ],
    [
      'c880',
      '葊',
      6,
      '葒',
      4,
      '葘葝葞葟葠葢葤',
      4,
      '葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁'
    ],
    [
      'c940',
      '葽',
      4,
      '蒃蒄蒅蒆蒊蒍蒏',
      7,
      '蒘蒚蒛蒝蒞蒟蒠蒢',
      12,
      '蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗'
    ],
    [
      'c980',
      '蓘',
      4,
      '蓞蓡蓢蓤蓧',
      4,
      '蓭蓮蓯蓱',
      10,
      '蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳'
    ],
    [
      'ca40',
      '蔃',
      8,
      '蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢',
      8,
      '蔭',
      9,
      '蔾',
      4,
      '蕄蕅蕆蕇蕋',
      10
    ],
    [
      'ca80',
      '蕗蕘蕚蕛蕜蕝蕟',
      4,
      '蕥蕦蕧蕩',
      8,
      '蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱'
    ],
    [
      'cb40',
      '薂薃薆薈',
      6,
      '薐',
      10,
      '薝',
      6,
      '薥薦薧薩薫薬薭薱',
      5,
      '薸薺',
      6,
      '藂',
      6,
      '藊',
      4,
      '藑藒'
    ],
    [
      'cb80',
      '藔藖',
      5,
      '藝',
      6,
      '藥藦藧藨藪',
      14,
      '恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔'
    ],
    ['cc40', '藹藺藼藽藾蘀', 4, '蘆', 10, '蘒蘓蘔蘕蘗', 15, '蘨蘪', 13, '蘹蘺蘻蘽蘾蘿虀'],
    [
      'cc80',
      '虁',
      11,
      '虒虓處',
      4,
      '虛虜虝號虠虡虣',
      7,
      '獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃'
    ],
    [
      'cd40',
      '虭虯虰虲',
      6,
      '蚃',
      6,
      '蚎',
      4,
      '蚔蚖',
      5,
      '蚞',
      4,
      '蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻',
      4,
      '蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜'
    ],
    [
      'cd80',
      '蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威'
    ],
    [
      'ce40',
      '蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀',
      6,
      '蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚',
      5,
      '蝡蝢蝦',
      7,
      '蝯蝱蝲蝳蝵'
    ],
    [
      'ce80',
      '蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎',
      4,
      '螔螕螖螘',
      6,
      '螠',
      4,
      '巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺'
    ],
    [
      'cf40',
      '螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁',
      4,
      '蟇蟈蟉蟌',
      4,
      '蟔',
      6,
      '蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯',
      9
    ],
    [
      'cf80',
      '蟺蟻蟼蟽蟿蠀蠁蠂蠄',
      5,
      '蠋',
      7,
      '蠔蠗蠘蠙蠚蠜',
      4,
      '蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓'
    ],
    [
      'd040',
      '蠤',
      13,
      '蠳',
      5,
      '蠺蠻蠽蠾蠿衁衂衃衆',
      5,
      '衎',
      5,
      '衕衖衘衚',
      6,
      '衦衧衪衭衯衱衳衴衵衶衸衹衺'
    ],
    [
      'd080',
      '衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗',
      4,
      '袝',
      4,
      '袣袥',
      5,
      '小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄'
    ],
    [
      'd140',
      '袬袮袯袰袲',
      4,
      '袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚',
      4,
      '裠裡裦裧裩',
      6,
      '裲裵裶裷裺裻製裿褀褁褃',
      5
    ],
    [
      'd180',
      '褉褋',
      4,
      '褑褔',
      4,
      '褜',
      4,
      '褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶'
    ],
    ['d240', '褸', 8, '襂襃襅', 24, '襠', 5, '襧', 19, '襼'],
    [
      'd280',
      '襽襾覀覂覄覅覇',
      26,
      '摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐'
    ],
    ['d340', '覢', 30, '觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴', 6],
    [
      'd380',
      '觻',
      4,
      '訁',
      5,
      '計',
      21,
      '印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉'
    ],
    ['d440', '訞', 31, '訿', 8, '詉', 21],
    [
      'd480',
      '詟',
      25,
      '詺',
      6,
      '浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧'
    ],
    ['d540', '誁', 7, '誋', 7, '誔', 46],
    [
      'd580',
      '諃',
      32,
      '铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政'
    ],
    ['d640', '諤', 34, '謈', 27],
    [
      'd680',
      '謤謥謧',
      30,
      '帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑'
    ],
    ['d740', '譆', 31, '譧', 4, '譭', 25],
    [
      'd780',
      '讇',
      24,
      '讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座'
    ],
    [
      'd840',
      '谸',
      8,
      '豂豃豄豅豈豊豋豍',
      7,
      '豖豗豘豙豛',
      5,
      '豣',
      6,
      '豬',
      6,
      '豴豵豶豷豻',
      6,
      '貃貄貆貇'
    ],
    [
      'd880',
      '貈貋貍',
      6,
      '貕貖貗貙',
      20,
      '亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝'
    ],
    ['d940', '貮', 62],
    [
      'd980',
      '賭',
      32,
      '佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼'
    ],
    [
      'da40',
      '贎',
      14,
      '贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸',
      8,
      '趂趃趆趇趈趉趌',
      4,
      '趒趓趕',
      9,
      '趠趡'
    ],
    [
      'da80',
      '趢趤',
      12,
      '趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺'
    ],
    [
      'db40',
      '跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾',
      6,
      '踆踇踈踋踍踎踐踑踒踓踕',
      7,
      '踠踡踤',
      4,
      '踫踭踰踲踳踴踶踷踸踻踼踾'
    ],
    [
      'db80',
      '踿蹃蹅蹆蹌',
      4,
      '蹓',
      5,
      '蹚',
      11,
      '蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝'
    ],
    [
      'dc40',
      '蹳蹵蹷',
      4,
      '蹽蹾躀躂躃躄躆躈',
      6,
      '躑躒躓躕',
      6,
      '躝躟',
      11,
      '躭躮躰躱躳',
      6,
      '躻',
      7
    ],
    [
      'dc80',
      '軃',
      10,
      '軏',
      21,
      '堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥'
    ],
    ['dd40', '軥', 62],
    [
      'dd80',
      '輤',
      32,
      '荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺'
    ],
    ['de40', '轅', 32, '轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆'],
    [
      'de80',
      '迉',
      4,
      '迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖'
    ],
    [
      'df40',
      '這逜連逤逥逧',
      5,
      '逰',
      4,
      '逷逹逺逽逿遀遃遅遆遈',
      4,
      '過達違遖遙遚遜',
      5,
      '遤遦遧適遪遫遬遯',
      4,
      '遶',
      6,
      '遾邁'
    ],
    [
      'df80',
      '還邅邆邇邉邊邌',
      4,
      '邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼'
    ],
    [
      'e040',
      '郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅',
      19,
      '鄚鄛鄜'
    ],
    [
      'e080',
      '鄝鄟鄠鄡鄤',
      10,
      '鄰鄲',
      6,
      '鄺',
      8,
      '酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼'
    ],
    [
      'e140',
      '酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀',
      4,
      '醆醈醊醎醏醓',
      6,
      '醜',
      5,
      '醤',
      5,
      '醫醬醰醱醲醳醶醷醸醹醻'
    ],
    [
      'e180',
      '醼',
      10,
      '釈釋釐釒',
      9,
      '針',
      8,
      '帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺'
    ],
    ['e240', '釦', 62],
    [
      'e280',
      '鈥',
      32,
      '狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧',
      5,
      '饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂'
    ],
    ['e340', '鉆', 45, '鉵', 16],
    [
      'e380',
      '銆',
      7,
      '銏',
      24,
      '恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾'
    ],
    ['e440', '銨', 5, '銯', 24, '鋉', 31],
    [
      'e480',
      '鋩',
      32,
      '洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑'
    ],
    ['e540', '錊', 51, '錿', 10],
    [
      'e580',
      '鍊',
      31,
      '鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣'
    ],
    ['e640', '鍬', 34, '鎐', 27],
    [
      'e680',
      '鎬',
      29,
      '鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩'
    ],
    ['e740', '鏎', 7, '鏗', 54],
    [
      'e780',
      '鐎',
      32,
      '纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡',
      6,
      '缪缫缬缭缯',
      4,
      '缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬'
    ],
    ['e840', '鐯', 14, '鐿', 43, '鑬鑭鑮鑯'],
    [
      'e880',
      '鑰',
      20,
      '钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹'
    ],
    ['e940', '锧锳锽镃镈镋镕镚镠镮镴镵長', 7, '門', 42],
    [
      'e980',
      '閫',
      32,
      '椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋'
    ],
    [
      'ea40',
      '闌',
      27,
      '闬闿阇阓阘阛阞阠阣',
      6,
      '阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗'
    ],
    [
      'ea80',
      '陘陙陚陜陝陞陠陣陥陦陫陭',
      4,
      '陳陸',
      12,
      '隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰'
    ],
    [
      'eb40',
      '隌階隑隒隓隕隖隚際隝',
      9,
      '隨',
      7,
      '隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖',
      9,
      '雡',
      6,
      '雫'
    ],
    [
      'eb80',
      '雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗',
      4,
      '霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻'
    ],
    [
      'ec40',
      '霡',
      8,
      '霫霬霮霯霱霳',
      4,
      '霺霻霼霽霿',
      18,
      '靔靕靗靘靚靜靝靟靣靤靦靧靨靪',
      7
    ],
    [
      'ec80',
      '靲靵靷',
      4,
      '靽',
      7,
      '鞆',
      4,
      '鞌鞎鞏鞐鞓鞕鞖鞗鞙',
      4,
      '臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐'
    ],
    ['ed40', '鞞鞟鞡鞢鞤', 6, '鞬鞮鞰鞱鞳鞵', 46],
    [
      'ed80',
      '韤韥韨韮',
      4,
      '韴韷',
      23,
      '怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨'
    ],
    ['ee40', '頏', 62],
    [
      'ee80',
      '顎',
      32,
      '睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶',
      4,
      '钼钽钿铄铈',
      6,
      '铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪'
    ],
    ['ef40', '顯', 5, '颋颎颒颕颙颣風', 37, '飏飐飔飖飗飛飜飝飠', 4],
    [
      'ef80',
      '飥飦飩',
      30,
      '铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒',
      4,
      '锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤',
      8,
      '镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔'
    ],
    ['f040', '餈', 4, '餎餏餑', 28, '餯', 26],
    [
      'f080',
      '饊',
      9,
      '饖',
      12,
      '饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨',
      4,
      '鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦',
      6,
      '鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙'
    ],
    ['f140', '馌馎馚', 10, '馦馧馩', 47],
    [
      'f180',
      '駙',
      32,
      '瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃'
    ],
    ['f240', '駺', 62],
    [
      'f280',
      '騹',
      32,
      '颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒'
    ],
    [
      'f340',
      '驚',
      17,
      '驲骃骉骍骎骔骕骙骦骩',
      6,
      '骲骳骴骵骹骻骽骾骿髃髄髆',
      4,
      '髍髎髏髐髒體髕髖髗髙髚髛髜'
    ],
    [
      'f380',
      '髝髞髠髢髣髤髥髧髨髩髪髬髮髰',
      8,
      '髺髼',
      6,
      '鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋'
    ],
    [
      'f440',
      '鬇鬉',
      5,
      '鬐鬑鬒鬔',
      10,
      '鬠鬡鬢鬤',
      10,
      '鬰鬱鬳',
      7,
      '鬽鬾鬿魀魆魊魋魌魎魐魒魓魕',
      5
    ],
    [
      'f480',
      '魛',
      32,
      '簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤'
    ],
    ['f540', '魼', 62],
    [
      'f580',
      '鮻',
      32,
      '酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜'
    ],
    ['f640', '鯜', 62],
    [
      'f680',
      '鰛',
      32,
      '觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅',
      5,
      '龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞',
      5,
      '鲥',
      4,
      '鲫鲭鲮鲰',
      7,
      '鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋'
    ],
    ['f740', '鰼', 62],
    [
      'f780',
      '鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾',
      4,
      '鳈鳉鳑鳒鳚鳛鳠鳡鳌',
      4,
      '鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄'
    ],
    ['f840', '鳣', 62],
    ['f880', '鴢', 32],
    ['f940', '鵃', 62],
    ['f980', '鶂', 32],
    ['fa40', '鶣', 62],
    ['fa80', '鷢', 32],
    ['fb40', '鸃', 27, '鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴', 9, '麀'],
    ['fb80', '麁麃麄麅麆麉麊麌', 5, '麔', 8, '麞麠', 5, '麧麨麩麪'],
    [
      'fc40',
      '麫',
      8,
      '麵麶麷麹麺麼麿',
      4,
      '黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰',
      8,
      '黺黽黿',
      6
    ],
    ['fc80', '鼆', 4, '鼌鼏鼑鼒鼔鼕鼖鼘鼚', 5, '鼡鼣', 8, '鼭鼮鼰鼱'],
    ['fd40', '鼲', 4, '鼸鼺鼼鼿', 4, '齅', 10, '齒', 38],
    ['fd80', '齹', 5, '龁龂龍', 11, '龜龝龞龡', 4, '郎凉秊裏隣'],
    ['fe40', '兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩']
  ],
  qy = [
    ['a140', '', 62],
    ['a180', '', 32],
    ['a240', '', 62],
    ['a280', '', 32],
    ['a2ab', '', 5],
    ['a2e3', '€'],
    ['a2ef', ''],
    ['a2fd', ''],
    ['a340', '', 62],
    ['a380', '', 31, '　'],
    ['a440', '', 62],
    ['a480', '', 32],
    ['a4f4', '', 10],
    ['a540', '', 62],
    ['a580', '', 32],
    ['a5f7', '', 7],
    ['a640', '', 62],
    ['a680', '', 32],
    ['a6b9', '', 7],
    ['a6d9', '', 6],
    ['a6ec', ''],
    ['a6f3', ''],
    ['a6f6', '', 8],
    ['a740', '', 62],
    ['a780', '', 32],
    ['a7c2', '', 14],
    ['a7f2', '', 12],
    ['a896', '', 10],
    ['a8bc', ''],
    ['a8bf', 'ǹ'],
    ['a8c1', ''],
    ['a8ea', '', 20],
    ['a958', ''],
    ['a95b', ''],
    ['a95d', ''],
    ['a989', '〾⿰', 11],
    ['a997', '', 12],
    ['a9f0', '', 14],
    ['aaa1', '', 93],
    ['aba1', '', 93],
    ['aca1', '', 93],
    ['ada1', '', 93],
    ['aea1', '', 93],
    ['afa1', '', 93],
    ['d7fa', '', 4],
    ['f8a1', '', 93],
    ['f9a1', '', 93],
    ['faa1', '', 93],
    ['fba1', '', 93],
    ['fca1', '', 93],
    ['fda1', '', 93],
    [
      'fe50',
      '⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌'
    ],
    ['fe80', '䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓', 6, '䶮', 93]
  ],
  Wy = {
    uChars: [
      128,
      165,
      169,
      178,
      184,
      216,
      226,
      235,
      238,
      244,
      248,
      251,
      253,
      258,
      276,
      284,
      300,
      325,
      329,
      334,
      364,
      463,
      465,
      467,
      469,
      471,
      473,
      475,
      477,
      506,
      594,
      610,
      712,
      716,
      730,
      930,
      938,
      962,
      970,
      1026,
      1104,
      1106,
      8209,
      8215,
      8218,
      8222,
      8231,
      8241,
      8244,
      8246,
      8252,
      8365,
      8452,
      8454,
      8458,
      8471,
      8482,
      8556,
      8570,
      8596,
      8602,
      8713,
      8720,
      8722,
      8726,
      8731,
      8737,
      8740,
      8742,
      8748,
      8751,
      8760,
      8766,
      8777,
      8781,
      8787,
      8802,
      8808,
      8816,
      8854,
      8858,
      8870,
      8896,
      8979,
      9322,
      9372,
      9548,
      9588,
      9616,
      9622,
      9634,
      9652,
      9662,
      9672,
      9676,
      9680,
      9702,
      9735,
      9738,
      9793,
      9795,
      11906,
      11909,
      11913,
      11917,
      11928,
      11944,
      11947,
      11951,
      11956,
      11960,
      11964,
      11979,
      12284,
      12292,
      12312,
      12319,
      12330,
      12351,
      12436,
      12447,
      12535,
      12543,
      12586,
      12842,
      12850,
      12964,
      13200,
      13215,
      13218,
      13253,
      13263,
      13267,
      13270,
      13384,
      13428,
      13727,
      13839,
      13851,
      14617,
      14703,
      14801,
      14816,
      14964,
      15183,
      15471,
      15585,
      16471,
      16736,
      17208,
      17325,
      17330,
      17374,
      17623,
      17997,
      18018,
      18212,
      18218,
      18301,
      18318,
      18760,
      18811,
      18814,
      18820,
      18823,
      18844,
      18848,
      18872,
      19576,
      19620,
      19738,
      19887,
      40870,
      59244,
      59336,
      59367,
      59413,
      59417,
      59423,
      59431,
      59437,
      59443,
      59452,
      59460,
      59478,
      59493,
      63789,
      63866,
      63894,
      63976,
      63986,
      64016,
      64018,
      64021,
      64025,
      64034,
      64037,
      64042,
      65074,
      65093,
      65107,
      65112,
      65127,
      65132,
      65375,
      65510,
      65536
    ],
    gbChars: [
      0,
      36,
      38,
      45,
      50,
      81,
      89,
      95,
      96,
      100,
      103,
      104,
      105,
      109,
      126,
      133,
      148,
      172,
      175,
      179,
      208,
      306,
      307,
      308,
      309,
      310,
      311,
      312,
      313,
      341,
      428,
      443,
      544,
      545,
      558,
      741,
      742,
      749,
      750,
      805,
      819,
      820,
      7922,
      7924,
      7925,
      7927,
      7934,
      7943,
      7944,
      7945,
      7950,
      8062,
      8148,
      8149,
      8152,
      8164,
      8174,
      8236,
      8240,
      8262,
      8264,
      8374,
      8380,
      8381,
      8384,
      8388,
      8390,
      8392,
      8393,
      8394,
      8396,
      8401,
      8406,
      8416,
      8419,
      8424,
      8437,
      8439,
      8445,
      8482,
      8485,
      8496,
      8521,
      8603,
      8936,
      8946,
      9046,
      9050,
      9063,
      9066,
      9076,
      9092,
      9100,
      9108,
      9111,
      9113,
      9131,
      9162,
      9164,
      9218,
      9219,
      11329,
      11331,
      11334,
      11336,
      11346,
      11361,
      11363,
      11366,
      11370,
      11372,
      11375,
      11389,
      11682,
      11686,
      11687,
      11692,
      11694,
      11714,
      11716,
      11723,
      11725,
      11730,
      11736,
      11982,
      11989,
      12102,
      12336,
      12348,
      12350,
      12384,
      12393,
      12395,
      12397,
      12510,
      12553,
      12851,
      12962,
      12973,
      13738,
      13823,
      13919,
      13933,
      14080,
      14298,
      14585,
      14698,
      15583,
      15847,
      16318,
      16434,
      16438,
      16481,
      16729,
      17102,
      17122,
      17315,
      17320,
      17402,
      17418,
      17859,
      17909,
      17911,
      17915,
      17916,
      17936,
      17939,
      17961,
      18664,
      18703,
      18814,
      18962,
      19043,
      33469,
      33470,
      33471,
      33484,
      33485,
      33490,
      33497,
      33501,
      33505,
      33513,
      33520,
      33536,
      33550,
      37845,
      37921,
      37948,
      38029,
      38038,
      38064,
      38065,
      38066,
      38069,
      38075,
      38076,
      38078,
      39108,
      39109,
      39113,
      39114,
      39115,
      39116,
      39265,
      39394,
      189e3
    ]
  },
  Gy = [
    ['0', '\0', 127],
    ['8141', '갂갃갅갆갋', 4, '갘갞갟갡갢갣갥', 6, '갮갲갳갴'],
    ['8161', '갵갶갷갺갻갽갾갿걁', 9, '걌걎', 5, '걕'],
    [
      '8181',
      '걖걗걙걚걛걝',
      18,
      '걲걳걵걶걹걻',
      4,
      '겂겇겈겍겎겏겑겒겓겕',
      6,
      '겞겢',
      5,
      '겫겭겮겱',
      6,
      '겺겾겿곀곂곃곅곆곇곉곊곋곍',
      7,
      '곖곘',
      7,
      '곢곣곥곦곩곫곭곮곲곴곷',
      4,
      '곾곿괁괂괃괅괇',
      4,
      '괎괐괒괓'
    ],
    ['8241', '괔괕괖괗괙괚괛괝괞괟괡', 7, '괪괫괮', 5],
    ['8261', '괶괷괹괺괻괽', 6, '굆굈굊', 5, '굑굒굓굕굖굗'],
    [
      '8281',
      '굙',
      7,
      '굢굤',
      7,
      '굮굯굱굲굷굸굹굺굾궀궃',
      4,
      '궊궋궍궎궏궑',
      10,
      '궞',
      5,
      '궥',
      17,
      '궸',
      7,
      '귂귃귅귆귇귉',
      6,
      '귒귔',
      7,
      '귝귞귟귡귢귣귥',
      18
    ],
    ['8341', '귺귻귽귾긂', 5, '긊긌긎', 5, '긕', 7],
    ['8361', '긝', 18, '긲긳긵긶긹긻긼'],
    [
      '8381',
      '긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗',
      4,
      '깞깢깣깤깦깧깪깫깭깮깯깱',
      6,
      '깺깾',
      5,
      '꺆',
      5,
      '꺍',
      46,
      '꺿껁껂껃껅',
      6,
      '껎껒',
      5,
      '껚껛껝',
      8
    ],
    ['8441', '껦껧껩껪껬껮', 5, '껵껶껷껹껺껻껽', 8],
    ['8461', '꼆꼉꼊꼋꼌꼎꼏꼑', 18],
    [
      '8481',
      '꼤',
      7,
      '꼮꼯꼱꼳꼵',
      6,
      '꼾꽀꽄꽅꽆꽇꽊',
      5,
      '꽑',
      10,
      '꽞',
      5,
      '꽦',
      18,
      '꽺',
      5,
      '꾁꾂꾃꾅꾆꾇꾉',
      6,
      '꾒꾓꾔꾖',
      5,
      '꾝',
      26,
      '꾺꾻꾽꾾'
    ],
    ['8541', '꾿꿁', 5, '꿊꿌꿏', 4, '꿕', 6, '꿝', 4],
    ['8561', '꿢', 5, '꿪', 5, '꿲꿳꿵꿶꿷꿹', 6, '뀂뀃'],
    [
      '8581',
      '뀅',
      6,
      '뀍뀎뀏뀑뀒뀓뀕',
      6,
      '뀞',
      9,
      '뀩',
      26,
      '끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞',
      29,
      '끾끿낁낂낃낅',
      6,
      '낎낐낒',
      5,
      '낛낝낞낣낤'
    ],
    ['8641', '낥낦낧낪낰낲낶낷낹낺낻낽', 6, '냆냊', 5, '냒'],
    ['8661', '냓냕냖냗냙', 6, '냡냢냣냤냦', 10],
    [
      '8681',
      '냱',
      22,
      '넊넍넎넏넑넔넕넖넗넚넞',
      4,
      '넦넧넩넪넫넭',
      6,
      '넶넺',
      5,
      '녂녃녅녆녇녉',
      6,
      '녒녓녖녗녙녚녛녝녞녟녡',
      22,
      '녺녻녽녾녿놁놃',
      4,
      '놊놌놎놏놐놑놕놖놗놙놚놛놝'
    ],
    ['8741', '놞', 9, '놩', 15],
    ['8761', '놹', 18, '뇍뇎뇏뇑뇒뇓뇕'],
    [
      '8781',
      '뇖',
      5,
      '뇞뇠',
      7,
      '뇪뇫뇭뇮뇯뇱',
      7,
      '뇺뇼뇾',
      5,
      '눆눇눉눊눍',
      6,
      '눖눘눚',
      5,
      '눡',
      18,
      '눵',
      6,
      '눽',
      26,
      '뉙뉚뉛뉝뉞뉟뉡',
      6,
      '뉪',
      4
    ],
    ['8841', '뉯', 4, '뉶', 5, '뉽', 6, '늆늇늈늊', 4],
    ['8861', '늏늒늓늕늖늗늛', 4, '늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷'],
    [
      '8881',
      '늸',
      15,
      '닊닋닍닎닏닑닓',
      4,
      '닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉',
      6,
      '댒댖',
      5,
      '댝',
      54,
      '덗덙덚덝덠덡덢덣'
    ],
    ['8941', '덦덨덪덬덭덯덲덳덵덶덷덹', 6, '뎂뎆', 5, '뎍'],
    ['8961', '뎎뎏뎑뎒뎓뎕', 10, '뎢', 5, '뎩뎪뎫뎭'],
    [
      '8981',
      '뎮',
      21,
      '돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩',
      18,
      '돽',
      18,
      '됑',
      6,
      '됙됚됛됝됞됟됡',
      6,
      '됪됬',
      7,
      '됵',
      15
    ],
    ['8a41', '둅', 10, '둒둓둕둖둗둙', 6, '둢둤둦'],
    ['8a61', '둧', 4, '둭', 18, '뒁뒂'],
    [
      '8a81',
      '뒃',
      4,
      '뒉',
      19,
      '뒞',
      5,
      '뒥뒦뒧뒩뒪뒫뒭',
      7,
      '뒶뒸뒺',
      5,
      '듁듂듃듅듆듇듉',
      6,
      '듑듒듓듔듖',
      5,
      '듞듟듡듢듥듧',
      4,
      '듮듰듲',
      5,
      '듹',
      26,
      '딖딗딙딚딝'
    ],
    ['8b41', '딞', 5, '딦딫', 4, '딲딳딵딶딷딹', 6, '땂땆'],
    ['8b61', '땇땈땉땊땎땏땑땒땓땕', 6, '땞땢', 8],
    [
      '8b81',
      '땫',
      52,
      '떢떣떥떦떧떩떬떭떮떯떲떶',
      4,
      '떾떿뗁뗂뗃뗅',
      6,
      '뗎뗒',
      5,
      '뗙',
      18,
      '뗭',
      18
    ],
    ['8c41', '똀', 15, '똒똓똕똖똗똙', 4],
    ['8c61', '똞', 6, '똦', 5, '똭', 6, '똵', 5],
    ['8c81', '똻', 12, '뙉', 26, '뙥뙦뙧뙩', 50, '뚞뚟뚡뚢뚣뚥', 5, '뚭뚮뚯뚰뚲', 16],
    ['8d41', '뛃', 16, '뛕', 8],
    ['8d61', '뛞', 17, '뛱뛲뛳뛵뛶뛷뛹뛺'],
    [
      '8d81',
      '뛻',
      4,
      '뜂뜃뜄뜆',
      33,
      '뜪뜫뜭뜮뜱',
      6,
      '뜺뜼',
      7,
      '띅띆띇띉띊띋띍',
      6,
      '띖',
      9,
      '띡띢띣띥띦띧띩',
      6,
      '띲띴띶',
      5,
      '띾띿랁랂랃랅',
      6,
      '랎랓랔랕랚랛랝랞'
    ],
    ['8e41', '랟랡', 6, '랪랮', 5, '랶랷랹', 8],
    ['8e61', '럂', 4, '럈럊', 19],
    [
      '8e81',
      '럞',
      13,
      '럮럯럱럲럳럵',
      6,
      '럾렂',
      4,
      '렊렋렍렎렏렑',
      6,
      '렚렜렞',
      5,
      '렦렧렩렪렫렭',
      6,
      '렶렺',
      5,
      '롁롂롃롅',
      11,
      '롒롔',
      7,
      '롞롟롡롢롣롥',
      6,
      '롮롰롲',
      5,
      '롹롺롻롽',
      7
    ],
    ['8f41', '뢅', 7, '뢎', 17],
    ['8f61', '뢠', 7, '뢩', 6, '뢱뢲뢳뢵뢶뢷뢹', 4],
    [
      '8f81',
      '뢾뢿룂룄룆',
      5,
      '룍룎룏룑룒룓룕',
      7,
      '룞룠룢',
      5,
      '룪룫룭룮룯룱',
      6,
      '룺룼룾',
      5,
      '뤅',
      18,
      '뤙',
      6,
      '뤡',
      26,
      '뤾뤿륁륂륃륅',
      6,
      '륍륎륐륒',
      5
    ],
    ['9041', '륚륛륝륞륟륡', 6, '륪륬륮', 5, '륶륷륹륺륻륽'],
    ['9061', '륾', 5, '릆릈릋릌릏', 15],
    [
      '9081',
      '릟',
      12,
      '릮릯릱릲릳릵',
      6,
      '릾맀맂',
      5,
      '맊맋맍맓',
      4,
      '맚맜맟맠맢맦맧맩맪맫맭',
      6,
      '맶맻',
      4,
      '먂',
      5,
      '먉',
      11,
      '먖',
      33,
      '먺먻먽먾먿멁멃멄멅멆'
    ],
    ['9141', '멇멊멌멏멐멑멒멖멗멙멚멛멝', 6, '멦멪', 5],
    ['9161', '멲멳멵멶멷멹', 9, '몆몈몉몊몋몍', 5],
    [
      '9181',
      '몓',
      20,
      '몪몭몮몯몱몳',
      4,
      '몺몼몾',
      5,
      '뫅뫆뫇뫉',
      14,
      '뫚',
      33,
      '뫽뫾뫿묁묂묃묅',
      7,
      '묎묐묒',
      5,
      '묙묚묛묝묞묟묡',
      6
    ],
    ['9241', '묨묪묬', 7, '묷묹묺묿', 4, '뭆뭈뭊뭋뭌뭎뭑뭒'],
    ['9261', '뭓뭕뭖뭗뭙', 7, '뭢뭤', 7, '뭭', 4],
    [
      '9281',
      '뭲',
      21,
      '뮉뮊뮋뮍뮎뮏뮑',
      18,
      '뮥뮦뮧뮩뮪뮫뮭',
      6,
      '뮵뮶뮸',
      7,
      '믁믂믃믅믆믇믉',
      6,
      '믑믒믔',
      35,
      '믺믻믽믾밁'
    ],
    ['9341', '밃', 4, '밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵'],
    ['9361', '밶밷밹', 6, '뱂뱆뱇뱈뱊뱋뱎뱏뱑', 8],
    [
      '9381',
      '뱚뱛뱜뱞',
      37,
      '벆벇벉벊벍벏',
      4,
      '벖벘벛',
      4,
      '벢벣벥벦벩',
      6,
      '벲벶',
      5,
      '벾벿볁볂볃볅',
      7,
      '볎볒볓볔볖볗볙볚볛볝',
      22,
      '볷볹볺볻볽'
    ],
    ['9441', '볾', 5, '봆봈봊', 5, '봑봒봓봕', 8],
    ['9461', '봞', 5, '봥', 6, '봭', 12],
    [
      '9481',
      '봺',
      5,
      '뵁',
      6,
      '뵊뵋뵍뵎뵏뵑',
      6,
      '뵚',
      9,
      '뵥뵦뵧뵩',
      22,
      '붂붃붅붆붋',
      4,
      '붒붔붖붗붘붛붝',
      6,
      '붥',
      10,
      '붱',
      6,
      '붹',
      24
    ],
    ['9541', '뷒뷓뷖뷗뷙뷚뷛뷝', 11, '뷪', 5, '뷱'],
    ['9561', '뷲뷳뷵뷶뷷뷹', 6, '븁븂븄븆', 5, '븎븏븑븒븓'],
    [
      '9581',
      '븕',
      6,
      '븞븠',
      35,
      '빆빇빉빊빋빍빏',
      4,
      '빖빘빜빝빞빟빢빣빥빦빧빩빫',
      4,
      '빲빶',
      4,
      '빾빿뺁뺂뺃뺅',
      6,
      '뺎뺒',
      5,
      '뺚',
      13,
      '뺩',
      14
    ],
    ['9641', '뺸', 23, '뻒뻓'],
    ['9661', '뻕뻖뻙', 6, '뻡뻢뻦', 5, '뻭', 8],
    ['9681', '뻶', 10, '뼂', 5, '뼊', 13, '뼚뼞', 33, '뽂뽃뽅뽆뽇뽉', 6, '뽒뽓뽔뽖', 44],
    ['9741', '뾃', 16, '뾕', 8],
    ['9761', '뾞', 17, '뾱', 7],
    ['9781', '뾹', 11, '뿆', 5, '뿎뿏뿑뿒뿓뿕', 6, '뿝뿞뿠뿢', 89, '쀽쀾쀿'],
    ['9841', '쁀', 16, '쁒', 5, '쁙쁚쁛'],
    ['9861', '쁝쁞쁟쁡', 6, '쁪', 15],
    [
      '9881',
      '쁺',
      21,
      '삒삓삕삖삗삙',
      6,
      '삢삤삦',
      5,
      '삮삱삲삷',
      4,
      '삾샂샃샄샆샇샊샋샍샎샏샑',
      6,
      '샚샞',
      5,
      '샦샧샩샪샫샭',
      6,
      '샶샸샺',
      5,
      '섁섂섃섅섆섇섉',
      6,
      '섑섒섓섔섖',
      5,
      '섡섢섥섨섩섪섫섮'
    ],
    ['9941', '섲섳섴섵섷섺섻섽섾섿셁', 6, '셊셎', 5, '셖셗'],
    ['9961', '셙셚셛셝', 6, '셦셪', 5, '셱셲셳셵셶셷셹셺셻'],
    [
      '9981',
      '셼',
      8,
      '솆',
      5,
      '솏솑솒솓솕솗',
      4,
      '솞솠솢솣솤솦솧솪솫솭솮솯솱',
      11,
      '솾',
      5,
      '쇅쇆쇇쇉쇊쇋쇍',
      6,
      '쇕쇖쇙',
      6,
      '쇡쇢쇣쇥쇦쇧쇩',
      6,
      '쇲쇴',
      7,
      '쇾쇿숁숂숃숅',
      6,
      '숎숐숒',
      5,
      '숚숛숝숞숡숢숣'
    ],
    ['9a41', '숤숥숦숧숪숬숮숰숳숵', 16],
    ['9a61', '쉆쉇쉉', 6, '쉒쉓쉕쉖쉗쉙', 6, '쉡쉢쉣쉤쉦'],
    [
      '9a81',
      '쉧',
      4,
      '쉮쉯쉱쉲쉳쉵',
      6,
      '쉾슀슂',
      5,
      '슊',
      5,
      '슑',
      6,
      '슙슚슜슞',
      5,
      '슦슧슩슪슫슮',
      5,
      '슶슸슺',
      33,
      '싞싟싡싢싥',
      5,
      '싮싰싲싳싴싵싷싺싽싾싿쌁',
      6,
      '쌊쌋쌎쌏'
    ],
    ['9b41', '쌐쌑쌒쌖쌗쌙쌚쌛쌝', 6, '쌦쌧쌪', 8],
    ['9b61', '쌳', 17, '썆', 7],
    [
      '9b81',
      '썎',
      25,
      '썪썫썭썮썯썱썳',
      4,
      '썺썻썾',
      5,
      '쎅쎆쎇쎉쎊쎋쎍',
      50,
      '쏁',
      22,
      '쏚'
    ],
    ['9c41', '쏛쏝쏞쏡쏣', 4, '쏪쏫쏬쏮', 5, '쏶쏷쏹', 5],
    ['9c61', '쏿', 8, '쐉', 6, '쐑', 9],
    [
      '9c81',
      '쐛',
      8,
      '쐥',
      6,
      '쐭쐮쐯쐱쐲쐳쐵',
      6,
      '쐾',
      9,
      '쑉',
      26,
      '쑦쑧쑩쑪쑫쑭',
      6,
      '쑶쑷쑸쑺',
      5,
      '쒁',
      18,
      '쒕',
      6,
      '쒝',
      12
    ],
    ['9d41', '쒪', 13, '쒹쒺쒻쒽', 8],
    ['9d61', '쓆', 25],
    [
      '9d81',
      '쓠',
      8,
      '쓪',
      5,
      '쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂',
      9,
      '씍씎씏씑씒씓씕',
      6,
      '씝',
      10,
      '씪씫씭씮씯씱',
      6,
      '씺씼씾',
      5,
      '앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩',
      6,
      '앲앶',
      5,
      '앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔'
    ],
    ['9e41', '얖얙얚얛얝얞얟얡', 7, '얪', 9, '얶'],
    ['9e61', '얷얺얿', 4, '엋엍엏엒엓엕엖엗엙', 6, '엢엤엦엧'],
    [
      '9e81',
      '엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑',
      6,
      '옚옝',
      6,
      '옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉',
      6,
      '왒왖',
      5,
      '왞왟왡',
      10,
      '왭왮왰왲',
      5,
      '왺왻왽왾왿욁',
      6,
      '욊욌욎',
      5,
      '욖욗욙욚욛욝',
      6,
      '욦'
    ],
    ['9f41', '욨욪', 5, '욲욳욵욶욷욻', 4, '웂웄웆', 5, '웎'],
    ['9f61', '웏웑웒웓웕', 6, '웞웟웢', 5, '웪웫웭웮웯웱웲'],
    [
      '9f81',
      '웳',
      4,
      '웺웻웼웾',
      5,
      '윆윇윉윊윋윍',
      6,
      '윖윘윚',
      5,
      '윢윣윥윦윧윩',
      6,
      '윲윴윶윸윹윺윻윾윿읁읂읃읅',
      4,
      '읋읎읐읙읚읛읝읞읟읡',
      6,
      '읩읪읬',
      7,
      '읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛',
      4,
      '잢잧',
      4,
      '잮잯잱잲잳잵잶잷'
    ],
    ['a041', '잸잹잺잻잾쟂', 5, '쟊쟋쟍쟏쟑', 6, '쟙쟚쟛쟜'],
    ['a061', '쟞', 5, '쟥쟦쟧쟩쟪쟫쟭', 13],
    [
      'a081',
      '쟻',
      4,
      '젂젃젅젆젇젉젋',
      4,
      '젒젔젗',
      4,
      '젞젟젡젢젣젥',
      6,
      '젮젰젲',
      5,
      '젹젺젻젽젾젿졁',
      6,
      '졊졋졎',
      5,
      '졕',
      26,
      '졲졳졵졶졷졹졻',
      4,
      '좂좄좈좉좊좎',
      5,
      '좕',
      7,
      '좞좠좢좣좤'
    ],
    ['a141', '좥좦좧좩', 18, '좾좿죀죁'],
    ['a161', '죂죃죅죆죇죉죊죋죍', 6, '죖죘죚', 5, '죢죣죥'],
    [
      'a181',
      '죦',
      14,
      '죶',
      5,
      '죾죿줁줂줃줇',
      4,
      '줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈',
      9,
      '±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢'
    ],
    ['a241', '줐줒', 5, '줙', 18],
    ['a261', '줭', 6, '줵', 18],
    [
      'a281',
      '쥈',
      7,
      '쥒쥓쥕쥖쥗쥙',
      6,
      '쥢쥤',
      7,
      '쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®'
    ],
    ['a341', '쥱쥲쥳쥵', 6, '쥽', 10, '즊즋즍즎즏'],
    ['a361', '즑', 6, '즚즜즞', 16],
    ['a381', '즯', 16, '짂짃짅짆짉짋', 4, '짒짔짗짘짛！', 58, '￦］', 32, '￣'],
    ['a441', '짞짟짡짣짥짦짨짩짪짫짮짲', 5, '짺짻짽짾짿쨁쨂쨃쨄'],
    ['a461', '쨅쨆쨇쨊쨎', 5, '쨕쨖쨗쨙', 12],
    ['a481', '쨦쨧쨨쨪', 28, 'ㄱ', 93],
    ['a541', '쩇', 4, '쩎쩏쩑쩒쩓쩕', 6, '쩞쩢', 5, '쩩쩪'],
    ['a561', '쩫', 17, '쩾', 5, '쪅쪆'],
    ['a581', '쪇', 16, '쪙', 14, 'ⅰ', 9],
    ['a5b0', 'Ⅰ', 9],
    ['a5c1', 'Α', 16, 'Σ', 6],
    ['a5e1', 'α', 16, 'σ', 6],
    ['a641', '쪨', 19, '쪾쪿쫁쫂쫃쫅'],
    ['a661', '쫆', 5, '쫎쫐쫒쫔쫕쫖쫗쫚', 5, '쫡', 6],
    [
      'a681',
      '쫨쫩쫪쫫쫭',
      6,
      '쫵',
      18,
      '쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃',
      7
    ],
    ['a741', '쬋', 4, '쬑쬒쬓쬕쬖쬗쬙', 6, '쬢', 7],
    ['a761', '쬪', 22, '쭂쭃쭄'],
    [
      'a781',
      '쭅쭆쭇쭊쭋쭍쭎쭏쭑',
      6,
      '쭚쭛쭜쭞',
      5,
      '쭥',
      7,
      '㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙',
      9,
      '㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰',
      9,
      '㎀',
      4,
      '㎺',
      5,
      '㎐',
      4,
      'Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆'
    ],
    ['a841', '쭭', 10, '쭺', 14],
    ['a861', '쮉', 18, '쮝', 6],
    ['a881', '쮤', 19, '쮹', 11, 'ÆÐªĦ'],
    ['a8a6', 'Ĳ'],
    ['a8a8', 'ĿŁØŒºÞŦŊ'],
    ['a8b1', '㉠', 27, 'ⓐ', 25, '①', 14, '½⅓⅔¼¾⅛⅜⅝⅞'],
    ['a941', '쯅', 14, '쯕', 10],
    ['a961', '쯠쯡쯢쯣쯥쯦쯨쯪', 18],
    [
      'a981',
      '쯽',
      14,
      '찎찏찑찒찓찕',
      6,
      '찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀',
      27,
      '⒜',
      25,
      '⑴',
      14,
      '¹²³⁴ⁿ₁₂₃₄'
    ],
    ['aa41', '찥찦찪찫찭찯찱', 6, '찺찿', 4, '챆챇챉챊챋챍챎'],
    ['aa61', '챏', 4, '챖챚', 5, '챡챢챣챥챧챩', 6, '챱챲'],
    ['aa81', '챳챴챶', 29, 'ぁ', 82],
    ['ab41', '첔첕첖첗첚첛첝첞첟첡', 6, '첪첮', 5, '첶첷첹'],
    ['ab61', '첺첻첽', 6, '쳆쳈쳊', 5, '쳑쳒쳓쳕', 5],
    ['ab81', '쳛', 8, '쳥', 6, '쳭쳮쳯쳱', 12, 'ァ', 85],
    ['ac41', '쳾쳿촀촂', 5, '촊촋촍촎촏촑', 6, '촚촜촞촟촠'],
    ['ac61', '촡촢촣촥촦촧촩촪촫촭', 11, '촺', 4],
    ['ac81', '촿', 28, '쵝쵞쵟А', 5, 'ЁЖ', 25],
    ['acd1', 'а', 5, 'ёж', 25],
    ['ad41', '쵡쵢쵣쵥', 6, '쵮쵰쵲', 5, '쵹', 7],
    ['ad61', '춁', 6, '춉', 10, '춖춗춙춚춛춝춞춟'],
    ['ad81', '춠춡춢춣춦춨춪', 5, '춱', 18, '췅'],
    ['ae41', '췆', 5, '췍췎췏췑', 16],
    ['ae61', '췢', 5, '췩췪췫췭췮췯췱', 6, '췺췼췾', 4],
    ['ae81', '츃츅츆츇츉츊츋츍', 6, '츕츖츗츘츚', 5, '츢츣츥츦츧츩츪츫'],
    ['af41', '츬츭츮츯츲츴츶', 19],
    ['af61', '칊', 13, '칚칛칝칞칢', 5, '칪칬'],
    ['af81', '칮', 5, '칶칷칹칺칻칽', 6, '캆캈캊', 5, '캒캓캕캖캗캙'],
    ['b041', '캚', 5, '캢캦', 5, '캮', 12],
    ['b061', '캻', 5, '컂', 19],
    [
      'b081',
      '컖',
      13,
      '컦컧컩컪컭',
      6,
      '컶컺',
      5,
      '가각간갇갈갉갊감',
      7,
      '같',
      4,
      '갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆'
    ],
    ['b141', '켂켃켅켆켇켉', 6, '켒켔켖', 5, '켝켞켟켡켢켣'],
    ['b161', '켥', 6, '켮켲', 5, '켹', 11],
    [
      'b181',
      '콅',
      14,
      '콖콗콙콚콛콝',
      6,
      '콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸'
    ],
    ['b241', '콭콮콯콲콳콵콶콷콹', 6, '쾁쾂쾃쾄쾆', 5, '쾍'],
    ['b261', '쾎', 18, '쾢', 5, '쾩'],
    [
      'b281',
      '쾪',
      5,
      '쾱',
      18,
      '쿅',
      6,
      '깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙'
    ],
    ['b341', '쿌', 19, '쿢쿣쿥쿦쿧쿩'],
    ['b361', '쿪', 5, '쿲쿴쿶', 5, '쿽쿾쿿퀁퀂퀃퀅', 5],
    [
      'b381',
      '퀋',
      5,
      '퀒',
      5,
      '퀙',
      19,
      '끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫',
      4,
      '낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝'
    ],
    ['b441', '퀮', 5, '퀶퀷퀹퀺퀻퀽', 6, '큆큈큊', 5],
    ['b461', '큑큒큓큕큖큗큙', 6, '큡', 10, '큮큯'],
    [
      'b481',
      '큱큲큳큵',
      6,
      '큾큿킀킂',
      18,
      '뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫',
      4,
      '닳담답닷',
      4,
      '닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥'
    ],
    ['b541', '킕', 14, '킦킧킩킪킫킭', 5],
    ['b561', '킳킶킸킺', 5, '탂탃탅탆탇탊', 5, '탒탖', 4],
    [
      'b581',
      '탛탞탟탡탢탣탥',
      6,
      '탮탲',
      5,
      '탹',
      11,
      '덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸'
    ],
    ['b641', '턅', 7, '턎', 17],
    ['b661', '턠', 15, '턲턳턵턶턷턹턻턼턽턾'],
    [
      'b681',
      '턿텂텆',
      5,
      '텎텏텑텒텓텕',
      6,
      '텞텠텢',
      5,
      '텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗'
    ],
    ['b741', '텮', 13, '텽', 6, '톅톆톇톉톊'],
    ['b761', '톋', 20, '톢톣톥톦톧'],
    [
      'b781',
      '톩',
      6,
      '톲톴톶톷톸톹톻톽톾톿퇁',
      14,
      '래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩'
    ],
    ['b841', '퇐', 7, '퇙', 17],
    ['b861', '퇫', 8, '퇵퇶퇷퇹', 13],
    [
      'b881',
      '툈툊',
      5,
      '툑',
      24,
      '륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많',
      4,
      '맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼'
    ],
    ['b941', '툪툫툮툯툱툲툳툵', 6, '툾퉀퉂', 5, '퉉퉊퉋퉌'],
    ['b961', '퉍', 14, '퉝', 6, '퉥퉦퉧퉨'],
    [
      'b981',
      '퉩',
      22,
      '튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바',
      4,
      '받',
      4,
      '밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗'
    ],
    ['ba41', '튍튎튏튒튓튔튖', 5, '튝튞튟튡튢튣튥', 6, '튭'],
    ['ba61', '튮튯튰튲', 5, '튺튻튽튾틁틃', 4, '틊틌', 5],
    [
      'ba81',
      '틒틓틕틖틗틙틚틛틝',
      6,
      '틦',
      9,
      '틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤'
    ],
    ['bb41', '틻', 4, '팂팄팆', 5, '팏팑팒팓팕팗', 4, '팞팢팣'],
    ['bb61', '팤팦팧팪팫팭팮팯팱', 6, '팺팾', 5, '퍆퍇퍈퍉'],
    [
      'bb81',
      '퍊',
      31,
      '빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤'
    ],
    ['bc41', '퍪', 17, '퍾퍿펁펂펃펅펆펇'],
    ['bc61', '펈펉펊펋펎펒', 5, '펚펛펝펞펟펡', 6, '펪펬펮'],
    [
      'bc81',
      '펯',
      4,
      '펵펶펷펹펺펻펽',
      6,
      '폆폇폊',
      5,
      '폑',
      5,
      '샥샨샬샴샵샷샹섀섄섈섐섕서',
      4,
      '섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭'
    ],
    ['bd41', '폗폙', 7, '폢폤', 7, '폮폯폱폲폳폵폶폷'],
    ['bd61', '폸폹폺폻폾퐀퐂', 5, '퐉', 13],
    [
      'bd81',
      '퐗',
      5,
      '퐞',
      25,
      '숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰'
    ],
    ['be41', '퐸', 7, '푁푂푃푅', 14],
    ['be61', '푔', 7, '푝푞푟푡푢푣푥', 7, '푮푰푱푲'],
    [
      'be81',
      '푳',
      4,
      '푺푻푽푾풁풃',
      4,
      '풊풌풎',
      5,
      '풕',
      8,
      '쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄',
      6,
      '엌엎'
    ],
    ['bf41', '풞', 10, '풪', 14],
    ['bf61', '풹', 18, '퓍퓎퓏퓑퓒퓓퓕'],
    [
      'bf81',
      '퓖',
      5,
      '퓝퓞퓠',
      7,
      '퓩퓪퓫퓭퓮퓯퓱',
      6,
      '퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염',
      5,
      '옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨'
    ],
    ['c041', '퓾', 5, '픅픆픇픉픊픋픍', 6, '픖픘', 5],
    ['c061', '픞', 25],
    [
      'c081',
      '픸픹픺픻픾픿핁핂핃핅',
      6,
      '핎핐핒',
      5,
      '핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응',
      7,
      '읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊'
    ],
    ['c141', '핤핦핧핪핬핮', 5, '핶핷핹핺핻핽', 6, '햆햊햋'],
    ['c161', '햌햍햎햏햑', 19, '햦햧'],
    [
      'c181',
      '햨',
      31,
      '점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓'
    ],
    ['c241', '헊헋헍헎헏헑헓', 4, '헚헜헞', 5, '헦헧헩헪헫헭헮'],
    ['c261', '헯', 4, '헶헸헺', 5, '혂혃혅혆혇혉', 6, '혒'],
    [
      'c281',
      '혖',
      5,
      '혝혞혟혡혢혣혥',
      7,
      '혮',
      9,
      '혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻'
    ],
    ['c341', '혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝', 4],
    ['c361', '홢', 4, '홨홪', 5, '홲홳홵', 11],
    [
      'c381',
      '횁횂횄횆',
      5,
      '횎횏횑횒횓횕',
      7,
      '횞횠횢',
      5,
      '횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층'
    ],
    ['c441', '횫횭횮횯횱', 7, '횺횼', 7, '훆훇훉훊훋'],
    ['c461', '훍훎훏훐훒훓훕훖훘훚', 5, '훡훢훣훥훦훧훩', 4],
    [
      'c481',
      '훮훯훱훲훳훴훶',
      5,
      '훾훿휁휂휃휅',
      11,
      '휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼'
    ],
    ['c541', '휕휖휗휚휛휝휞휟휡', 6, '휪휬휮', 5, '휶휷휹'],
    ['c561', '휺휻휽', 6, '흅흆흈흊', 5, '흒흓흕흚', 4],
    [
      'c581',
      '흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵',
      6,
      '흾흿힀힂',
      5,
      '힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜'
    ],
    ['c641', '힍힎힏힑', 6, '힚힜힞', 5],
    [
      'c6a1',
      '퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁'
    ],
    [
      'c7a1',
      '퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠'
    ],
    [
      'c8a1',
      '혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝'
    ],
    [
      'caa1',
      '伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕'
    ],
    [
      'cba1',
      '匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢'
    ],
    [
      'cca1',
      '瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械'
    ],
    [
      'cda1',
      '棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜'
    ],
    [
      'cea1',
      '科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾'
    ],
    [
      'cfa1',
      '區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴'
    ],
    [
      'd0a1',
      '鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣'
    ],
    [
      'd1a1',
      '朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩',
      5,
      '那樂',
      4,
      '諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉'
    ],
    [
      'd2a1',
      '納臘蠟衲囊娘廊',
      4,
      '乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧',
      5,
      '駑魯',
      10,
      '濃籠聾膿農惱牢磊腦賂雷尿壘',
      7,
      '嫩訥杻紐勒',
      5,
      '能菱陵尼泥匿溺多茶'
    ],
    [
      'd3a1',
      '丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃'
    ],
    [
      'd4a1',
      '棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅'
    ],
    [
      'd5a1',
      '蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣'
    ],
    [
      'd6a1',
      '煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼'
    ],
    [
      'd7a1',
      '遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬'
    ],
    [
      'd8a1',
      '立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅'
    ],
    [
      'd9a1',
      '蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文'
    ],
    [
      'daa1',
      '汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑'
    ],
    [
      'dba1',
      '發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖'
    ],
    [
      'dca1',
      '碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦'
    ],
    [
      'dda1',
      '孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥'
    ],
    [
      'dea1',
      '脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索'
    ],
    [
      'dfa1',
      '傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署'
    ],
    [
      'e0a1',
      '胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬'
    ],
    [
      'e1a1',
      '聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁'
    ],
    [
      'e2a1',
      '戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧'
    ],
    [
      'e3a1',
      '嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁'
    ],
    [
      'e4a1',
      '沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額'
    ],
    [
      'e5a1',
      '櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬'
    ],
    [
      'e6a1',
      '旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒'
    ],
    [
      'e7a1',
      '簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳'
    ],
    [
      'e8a1',
      '烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療'
    ],
    [
      'e9a1',
      '窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓'
    ],
    [
      'eaa1',
      '運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜'
    ],
    [
      'eba1',
      '濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼'
    ],
    [
      'eca1',
      '議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄'
    ],
    [
      'eda1',
      '立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長'
    ],
    [
      'eea1',
      '障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱'
    ],
    [
      'efa1',
      '煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖'
    ],
    [
      'f0a1',
      '靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫'
    ],
    [
      'f1a1',
      '踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只'
    ],
    [
      'f2a1',
      '咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯'
    ],
    [
      'f3a1',
      '鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策'
    ],
    [
      'f4a1',
      '責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢'
    ],
    [
      'f5a1',
      '椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃'
    ],
    [
      'f6a1',
      '贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託'
    ],
    [
      'f7a1',
      '鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑'
    ],
    [
      'f8a1',
      '阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃'
    ],
    [
      'f9a1',
      '品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航'
    ],
    [
      'faa1',
      '行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型'
    ],
    [
      'fba1',
      '形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵'
    ],
    [
      'fca1',
      '禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆'
    ],
    [
      'fda1',
      '爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰'
    ]
  ],
  Ky = [
    ['0', '\0', 127],
    [
      'a140',
      '　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚'
    ],
    [
      'a1a1',
      '﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢',
      4,
      '～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／'
    ],
    [
      'a240',
      '＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁',
      7,
      '▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭'
    ],
    ['a2a1', '╮╰╯═╞╪╡◢◣◥◤╱╲╳０', 9, 'Ⅰ', 9, '〡', 8, '十卄卅Ａ', 25, 'ａ', 21],
    ['a340', 'ｗｘｙｚΑ', 16, 'Σ', 6, 'α', 16, 'σ', 6, 'ㄅ', 10],
    ['a3a1', 'ㄐ', 25, '˙ˉˊˇˋ'],
    ['a3e1', '€'],
    [
      'a440',
      '一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才'
    ],
    [
      'a4a1',
      '丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙'
    ],
    [
      'a540',
      '世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外'
    ],
    [
      'a5a1',
      '央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全'
    ],
    [
      'a640',
      '共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年'
    ],
    [
      'a6a1',
      '式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣'
    ],
    [
      'a740',
      '作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍'
    ],
    [
      'a7a1',
      '均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠'
    ],
    [
      'a840',
      '杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒'
    ],
    [
      'a8a1',
      '芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵'
    ],
    [
      'a940',
      '咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居'
    ],
    [
      'a9a1',
      '屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊'
    ],
    [
      'aa40',
      '昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠'
    ],
    [
      'aaa1',
      '炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附'
    ],
    [
      'ab40',
      '陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品'
    ],
    [
      'aba1',
      '哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷'
    ],
    [
      'ac40',
      '拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗'
    ],
    [
      'aca1',
      '活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄'
    ],
    [
      'ad40',
      '耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥'
    ],
    [
      'ada1',
      '迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪'
    ],
    [
      'ae40',
      '哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙'
    ],
    [
      'aea1',
      '恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓'
    ],
    [
      'af40',
      '浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷'
    ],
    [
      'afa1',
      '砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃'
    ],
    [
      'b040',
      '虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡'
    ],
    [
      'b0a1',
      '陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀'
    ],
    [
      'b140',
      '娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽'
    ],
    [
      'b1a1',
      '情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺'
    ],
    [
      'b240',
      '毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶'
    ],
    [
      'b2a1',
      '瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼'
    ],
    [
      'b340',
      '莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途'
    ],
    [
      'b3a1',
      '部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠'
    ],
    [
      'b440',
      '婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍'
    ],
    [
      'b4a1',
      '插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋'
    ],
    [
      'b540',
      '溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘'
    ],
    [
      'b5a1',
      '窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁'
    ],
    [
      'b640',
      '詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑'
    ],
    [
      'b6a1',
      '間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼'
    ],
    [
      'b740',
      '媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業'
    ],
    [
      'b7a1',
      '楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督'
    ],
    [
      'b840',
      '睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫'
    ],
    [
      'b8a1',
      '腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊'
    ],
    [
      'b940',
      '辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴'
    ],
    [
      'b9a1',
      '飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇'
    ],
    [
      'ba40',
      '愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢'
    ],
    [
      'baa1',
      '滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬'
    ],
    [
      'bb40',
      '罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤'
    ],
    [
      'bba1',
      '說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜'
    ],
    [
      'bc40',
      '劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂'
    ],
    [
      'bca1',
      '慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃'
    ],
    [
      'bd40',
      '瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯'
    ],
    [
      'bda1',
      '翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞'
    ],
    [
      'be40',
      '輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉'
    ],
    [
      'bea1',
      '鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡'
    ],
    [
      'bf40',
      '濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊'
    ],
    [
      'bfa1',
      '縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚'
    ],
    [
      'c040',
      '錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇'
    ],
    [
      'c0a1',
      '嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬'
    ],
    [
      'c140',
      '瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪'
    ],
    [
      'c1a1',
      '薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁'
    ],
    [
      'c240',
      '駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘'
    ],
    [
      'c2a1',
      '癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦'
    ],
    [
      'c340',
      '鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸'
    ],
    [
      'c3a1',
      '獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類'
    ],
    [
      'c440',
      '願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼'
    ],
    [
      'c4a1',
      '纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴'
    ],
    [
      'c540',
      '護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬'
    ],
    [
      'c5a1',
      '禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒'
    ],
    [
      'c640',
      '讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲'
    ],
    [
      'c940',
      '乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕'
    ],
    [
      'c9a1',
      '氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋'
    ],
    [
      'ca40',
      '汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘'
    ],
    [
      'caa1',
      '吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇'
    ],
    [
      'cb40',
      '杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓'
    ],
    [
      'cba1',
      '芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢'
    ],
    [
      'cc40',
      '坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋'
    ],
    [
      'cca1',
      '怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲'
    ],
    [
      'cd40',
      '泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺'
    ],
    [
      'cda1',
      '矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏'
    ],
    [
      'ce40',
      '哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛'
    ],
    [
      'cea1',
      '峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺'
    ],
    [
      'cf40',
      '柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂'
    ],
    [
      'cfa1',
      '洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀'
    ],
    [
      'd040',
      '穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪'
    ],
    [
      'd0a1',
      '苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱'
    ],
    [
      'd140',
      '唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧'
    ],
    [
      'd1a1',
      '恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤'
    ],
    [
      'd240',
      '毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸'
    ],
    [
      'd2a1',
      '牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐'
    ],
    [
      'd340',
      '笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢'
    ],
    [
      'd3a1',
      '荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐'
    ],
    [
      'd440',
      '酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅'
    ],
    [
      'd4a1',
      '唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏'
    ],
    [
      'd540',
      '崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟'
    ],
    [
      'd5a1',
      '捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉'
    ],
    [
      'd640',
      '淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏'
    ],
    [
      'd6a1',
      '痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟'
    ],
    [
      'd740',
      '耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷'
    ],
    [
      'd7a1',
      '蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪'
    ],
    [
      'd840',
      '釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷'
    ],
    [
      'd8a1',
      '堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔'
    ],
    [
      'd940',
      '惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒'
    ],
    [
      'd9a1',
      '晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞'
    ],
    [
      'da40',
      '湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖'
    ],
    [
      'daa1',
      '琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥'
    ],
    [
      'db40',
      '罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳'
    ],
    [
      'dba1',
      '菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺'
    ],
    [
      'dc40',
      '軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈'
    ],
    [
      'dca1',
      '隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆'
    ],
    [
      'dd40',
      '媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤'
    ],
    [
      'dda1',
      '搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼'
    ],
    [
      'de40',
      '毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓'
    ],
    [
      'dea1',
      '煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓'
    ],
    [
      'df40',
      '稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯'
    ],
    [
      'dfa1',
      '腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤'
    ],
    [
      'e040',
      '觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿'
    ],
    [
      'e0a1',
      '遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠'
    ],
    [
      'e140',
      '凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠'
    ],
    [
      'e1a1',
      '寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉'
    ],
    [
      'e240',
      '榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊'
    ],
    [
      'e2a1',
      '漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓'
    ],
    [
      'e340',
      '禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞'
    ],
    [
      'e3a1',
      '耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻'
    ],
    [
      'e440',
      '裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍'
    ],
    [
      'e4a1',
      '銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘'
    ],
    [
      'e540',
      '噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉'
    ],
    [
      'e5a1',
      '憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒'
    ],
    [
      'e640',
      '澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙'
    ],
    [
      'e6a1',
      '獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟'
    ],
    [
      'e740',
      '膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢'
    ],
    [
      'e7a1',
      '蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧'
    ],
    [
      'e840',
      '踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓'
    ],
    [
      'e8a1',
      '銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮'
    ],
    [
      'e940',
      '噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺'
    ],
    [
      'e9a1',
      '憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸'
    ],
    [
      'ea40',
      '澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙'
    ],
    [
      'eaa1',
      '瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘'
    ],
    [
      'eb40',
      '蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠'
    ],
    [
      'eba1',
      '諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌'
    ],
    [
      'ec40',
      '錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕'
    ],
    [
      'eca1',
      '魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎'
    ],
    [
      'ed40',
      '檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶'
    ],
    [
      'eda1',
      '瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞'
    ],
    [
      'ee40',
      '蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞'
    ],
    [
      'eea1',
      '謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜'
    ],
    [
      'ef40',
      '鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰'
    ],
    [
      'efa1',
      '鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶'
    ],
    [
      'f040',
      '璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒'
    ],
    [
      'f0a1',
      '臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧'
    ],
    [
      'f140',
      '蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪'
    ],
    [
      'f1a1',
      '鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰'
    ],
    [
      'f240',
      '徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛'
    ],
    [
      'f2a1',
      '礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕'
    ],
    [
      'f340',
      '譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦'
    ],
    [
      'f3a1',
      '鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲'
    ],
    [
      'f440',
      '嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩'
    ],
    [
      'f4a1',
      '禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿'
    ],
    [
      'f540',
      '鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛'
    ],
    [
      'f5a1',
      '鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥'
    ],
    [
      'f640',
      '蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺'
    ],
    [
      'f6a1',
      '騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚'
    ],
    [
      'f740',
      '糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊'
    ],
    [
      'f7a1',
      '驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾'
    ],
    [
      'f840',
      '讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏'
    ],
    [
      'f8a1',
      '齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚'
    ],
    [
      'f940',
      '纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊'
    ],
    [
      'f9a1',
      '龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓'
    ]
  ],
  Yy = [
    [
      '8740',
      '䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻'
    ],
    ['8767', '綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬'],
    [
      '87a1',
      '𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋'
    ],
    [
      '8840',
      '㇀',
      4,
      '𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ'
    ],
    ['88a1', 'ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛'],
    ['8940', '𪎩𡅅'],
    ['8943', '攊'],
    ['8946', '丽滝鵎釟'],
    [
      '894c',
      '𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮'
    ],
    ['89a1', '琑糼緍楆竉刧'],
    ['89ab', '醌碸酞肼'],
    ['89b0', '贋胶𠧧'],
    ['89b5', '肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁'],
    ['89c1', '溚舾甙'],
    [
      '89c5',
      '䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅'
    ],
    ['8a40', '𧶄唥'],
    ['8a43', '𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓'],
    ['8a64', '𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕'],
    ['8a76', '䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯'],
    ['8aa1', '𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱'],
    ['8aac', '䠋𠆩㿺塳𢶍'],
    ['8ab2', '𤗈𠓼𦂗𠽌𠶖啹䂻䎺'],
    ['8abb', '䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃'],
    ['8ac9', '𪘁𠸉𢫏𢳉'],
    ['8ace', '𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻'],
    ['8adf', '𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌'],
    ['8af6', '𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭'],
    ['8b40', '𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹'],
    [
      '8b55',
      '𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑'
    ],
    [
      '8ba1',
      '𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁'
    ],
    ['8bde', '𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢'],
    [
      '8c40',
      '倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋'
    ],
    ['8ca1', '𣏹椙橃𣱣泿'],
    ['8ca7', '爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚'],
    ['8cc9', '顨杫䉶圽'],
    ['8cce', '藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶'],
    ['8ce6', '峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻'],
    ['8d40', '𠮟'],
    [
      '8d42',
      '𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱'
    ],
    [
      '8da1',
      '㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘'
    ],
    [
      '8e40',
      '𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎'
    ],
    [
      '8ea1',
      '繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛'
    ],
    [
      '8f40',
      '蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖'
    ],
    [
      '8fa1',
      '𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起'
    ],
    [
      '9040',
      '趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛'
    ],
    [
      '90a1',
      '𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜'
    ],
    [
      '9140',
      '𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈'
    ],
    [
      '91a1',
      '鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨'
    ],
    [
      '9240',
      '𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘'
    ],
    [
      '92a1',
      '働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃'
    ],
    [
      '9340',
      '媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍'
    ],
    [
      '93a1',
      '摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋'
    ],
    [
      '9440',
      '銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻'
    ],
    [
      '94a1',
      '㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡'
    ],
    [
      '9540',
      '𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂'
    ],
    [
      '95a1',
      '衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰'
    ],
    [
      '9640',
      '桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸'
    ],
    [
      '96a1',
      '𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉'
    ],
    [
      '9740',
      '愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫'
    ],
    [
      '97a1',
      '𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎'
    ],
    [
      '9840',
      '𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦'
    ],
    [
      '98a1',
      '咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃'
    ],
    [
      '9940',
      '䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚'
    ],
    [
      '99a1',
      '䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿'
    ],
    [
      '9a40',
      '鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺'
    ],
    [
      '9aa1',
      '黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪'
    ],
    ['9b40', '𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌'],
    ['9b62', '𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎'],
    [
      '9ba1',
      '椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊'
    ],
    [
      '9c40',
      '嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶'
    ],
    [
      '9ca1',
      '㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏'
    ],
    [
      '9d40',
      '𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁'
    ],
    [
      '9da1',
      '辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢'
    ],
    [
      '9e40',
      '𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺'
    ],
    ['9ea1', '鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭'],
    ['9ead', '𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹'],
    [
      '9ec5',
      '㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲'
    ],
    ['9ef5', '噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼'],
    ['9f40', '籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱'],
    [
      '9f4f',
      '凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰'
    ],
    ['9fa1', '椬叚鰊鴂䰻陁榀傦畆𡝭駚剳'],
    ['9fae', '酙隁酜'],
    ['9fb2', '酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽'],
    ['9fc1', '𤤙盖鮝个𠳔莾衂'],
    ['9fc9', '届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳'],
    ['9fdb', '歒酼龥鮗頮颴骺麨麄煺笔'],
    ['9fe7', '毺蠘罸'],
    ['9feb', '嘠𪙊蹷齓'],
    ['9ff0', '跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇'],
    ['a040', '𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷'],
    ['a055', '𡠻𦸅'],
    ['a058', '詾𢔛'],
    ['a05b', '惽癧髗鵄鍮鮏蟵'],
    ['a063', '蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽'],
    ['a073', '坟慯抦戹拎㩜懢厪𣏵捤栂㗒'],
    ['a0a1', '嵗𨯂迚𨸹'],
    ['a0a6', '僙𡵆礆匲阸𠼻䁥'],
    ['a0ae', '矾'],
    ['a0b0', '糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦'],
    ['a0d4', '覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷'],
    ['a0e2', '罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫'],
    ['a3c0', '␀', 31, '␡'],
    [
      'c6a1',
      '①',
      9,
      '⑴',
      9,
      'ⅰ',
      9,
      '丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ',
      23
    ],
    ['c740', 'す', 58, 'ァアィイ'],
    ['c7a1', 'ゥ', 81, 'А', 5, 'ЁЖ', 4],
    ['c840', 'Л', 26, 'ёж', 25, '⇧↸↹㇏𠃌乚𠂊刂䒑'],
    ['c8a1', '龰冈龱𧘇'],
    ['c8cd', '￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣'],
    ['c8f5', 'ʃɐɛɔɵœøŋʊɪ'],
    ['f9fe', '￭'],
    [
      'fa40',
      '𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸'
    ],
    [
      'faa1',
      '鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍'
    ],
    [
      'fb40',
      '𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙'
    ],
    [
      'fba1',
      '𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂'
    ],
    [
      'fc40',
      '廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷'
    ],
    [
      'fca1',
      '𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝'
    ],
    [
      'fd40',
      '𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀'
    ],
    [
      'fda1',
      '𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎'
    ],
    [
      'fe40',
      '鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌'
    ],
    [
      'fea1',
      '𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔'
    ]
  ],
  Hy = {
    shiftjis: {
      type: '_dbcs',
      table: function () {
        return Vy
      },
      encodeAdd: { '¥': 92, '‾': 126 },
      encodeSkipVals: [{ from: 60736, to: 63808 }]
    },
    csshiftjis: 'shiftjis',
    mskanji: 'shiftjis',
    sjis: 'shiftjis',
    windows31j: 'shiftjis',
    ms31j: 'shiftjis',
    xsjis: 'shiftjis',
    windows932: 'shiftjis',
    ms932: 'shiftjis',
    932: 'shiftjis',
    cp932: 'shiftjis',
    eucjp: {
      type: '_dbcs',
      table: function () {
        return $y
      },
      encodeAdd: { '¥': 92, '‾': 126 }
    },
    gb2312: 'cp936',
    gb231280: 'cp936',
    gb23121980: 'cp936',
    csgb2312: 'cp936',
    csiso58gb231280: 'cp936',
    euccn: 'cp936',
    windows936: 'cp936',
    ms936: 'cp936',
    936: 'cp936',
    cp936: {
      type: '_dbcs',
      table: function () {
        return zy
      }
    },
    gbk: {
      type: '_dbcs',
      table: function () {
        return zy.concat(qy)
      }
    },
    xgbk: 'gbk',
    isoir58: 'gbk',
    gb18030: {
      type: '_dbcs',
      table: function () {
        return zy.concat(qy)
      },
      gb18030: function () {
        return Wy
      },
      encodeSkipVals: [128],
      encodeAdd: { '€': 41699 }
    },
    chinese: 'gb18030',
    windows949: 'cp949',
    ms949: 'cp949',
    949: 'cp949',
    cp949: {
      type: '_dbcs',
      table: function () {
        return Gy
      }
    },
    cseuckr: 'cp949',
    csksc56011987: 'cp949',
    euckr: 'cp949',
    isoir149: 'cp949',
    korean: 'cp949',
    ksc56011987: 'cp949',
    ksc56011989: 'cp949',
    ksc5601: 'cp949',
    windows950: 'cp950',
    ms950: 'cp950',
    950: 'cp950',
    cp950: {
      type: '_dbcs',
      table: function () {
        return Ky
      }
    },
    big5: 'big5hkscs',
    big5hkscs: {
      type: '_dbcs',
      table: function () {
        return Ky.concat(Yy)
      },
      encodeSkipVals: [41676]
    },
    cnbig5: 'big5hkscs',
    csbig5: 'big5hkscs',
    xxbig5: 'big5hkscs'
  },
  Xy = Ft(function (t, e) {
    for (var n = [Vv, oy, Ey, jy, Ay, ky, Uy, Hy], r = 0; r < n.length; r++) {
      t = n[r]
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
    }
  }),
  Jy = k.default.Buffer,
  Zy = S.default.Transform
function Qy(t, e) {
  ;(this.conv = t), ((e = e || {}).decodeStrings = !1), Zy.call(this, e)
}
function tb(t, e) {
  ;(this.conv = t), ((e = e || {}).encoding = this.encoding = 'utf8'), Zy.call(this, e)
}
;(Qy.prototype = Object.create(Zy.prototype, { constructor: { value: Qy } })),
  (Qy.prototype._transform = function (t, e, n) {
    if ('string' != typeof t)
      return n(new Error('Iconv encoding stream needs strings as its input.'))
    try {
      var r = this.conv.write(t)
      r && r.length && this.push(r), n()
    } catch (t) {
      n(t)
    }
  }),
  (Qy.prototype._flush = function (t) {
    try {
      var e = this.conv.end()
      e && e.length && this.push(e), t()
    } catch (e) {
      t(e)
    }
  }),
  (Qy.prototype.collect = function (t) {
    var e = []
    return (
      this.on('error', t),
      this.on('data', function (t) {
        e.push(t)
      }),
      this.on('end', function () {
        t(null, Jy.concat(e))
      }),
      this
    )
  }),
  (tb.prototype = Object.create(Zy.prototype, { constructor: { value: tb } })),
  (tb.prototype._transform = function (t, e, n) {
    if (!Jy.isBuffer(t))
      return n(new Error('Iconv decoding stream needs buffers as its input.'))
    try {
      var r = this.conv.write(t)
      r && r.length && this.push(r, this.encoding), n()
    } catch (t) {
      n(t)
    }
  }),
  (tb.prototype._flush = function (t) {
    try {
      var e = this.conv.end()
      e && e.length && this.push(e, this.encoding), t()
    } catch (e) {
      t(e)
    }
  }),
  (tb.prototype.collect = function (t) {
    var e = ''
    return (
      this.on('error', t),
      this.on('data', function (t) {
        e += t
      }),
      this.on('end', function () {
        t(null, e)
      }),
      this
    )
  })
var eb = k.default.Buffer,
  nb = Ft(function (t) {
    var e = Nv.Buffer,
      n = t.exports
    ;(n.encodings = null),
      (n.defaultCharUnicode = '�'),
      (n.defaultCharSingleByte = '?'),
      (n.encode = function (t, r, i) {
        t = '' + (t || '')
        var o = n.getEncoder(r, i),
          u = o.write(t),
          s = o.end()
        return s && s.length > 0 ? e.concat([u, s]) : u
      }),
      (n.decode = function (t, r, i) {
        'string' == typeof t &&
          (n.skipDecodeWarning ||
            (console.error(
              'Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding'
            ),
            (n.skipDecodeWarning = !0)),
          (t = e.from('' + (t || ''), 'binary')))
        var o = n.getDecoder(r, i),
          u = o.write(t),
          s = o.end()
        return s ? u + s : u
      }),
      (n.encodingExists = function (t) {
        try {
          return n.getCodec(t), !0
        } catch (t) {
          return !1
        }
      }),
      (n.toEncoding = n.encode),
      (n.fromEncoding = n.decode),
      (n._codecDataCache = {}),
      (n.getCodec = function (t) {
        n.encodings || (n.encodings = Xy)
        for (var e = n._canonicalizeEncoding(t), r = {}; ; ) {
          var i = n._codecDataCache[e]
          if (i) return i
          var o = n.encodings[e]
          switch (typeof o) {
            case 'string':
              e = o
              break
            case 'object':
              for (var u in o) r[u] = o[u]
              r.encodingName || (r.encodingName = e), (e = o.type)
              break
            case 'function':
              return (
                r.encodingName || (r.encodingName = e),
                (i = new o(r, n)),
                (n._codecDataCache[r.encodingName] = i),
                i
              )
            default:
              throw new Error(
                "Encoding not recognized: '" + t + "' (searched as: '" + e + "')"
              )
          }
        }
      }),
      (n._canonicalizeEncoding = function (t) {
        return ('' + t).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, '')
      }),
      (n.getEncoder = function (t, e) {
        var r = n.getCodec(t),
          i = new r.encoder(e, r)
        return r.bomAware && e && e.addBOM && (i = new Mv.PrependBOM(i, e)), i
      }),
      (n.getDecoder = function (t, e) {
        var r = n.getCodec(t),
          i = new r.decoder(e, r)
        return !r.bomAware || (e && !1 === e.stripBOM) || (i = new Mv.StripBOM(i, e)), i
      })
    var r = 'undefined' != typeof process && process.versions && process.versions.node
    if (r) {
      var i = r.split('.').map(Number)
      ;(i[0] > 0 || i[1] >= 10) &&
        (function (t) {
          ;(t.encodeStream = function (e, n) {
            return new Qy(t.getEncoder(e, n), n)
          }),
            (t.decodeStream = function (e, n) {
              return new tb(t.getDecoder(e, n), n)
            }),
            (t.supportsStreams = !0),
            (t.IconvLiteEncoderStream = Qy),
            (t.IconvLiteDecoderStream = tb),
            (t._collect = tb.prototype.collect)
        })(n),
        (function (t) {
          var e = void 0
          ;(t.supportsNodeEncodingsExtension = !(
            eb.from || new eb(0) instanceof Uint8Array
          )),
            (t.extendNodeEncodings = function () {
              if (!e) {
                if (((e = {}), !t.supportsNodeEncodingsExtension))
                  return (
                    console.error(
                      "ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node"
                    ),
                    void console.error(
                      'See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility'
                    )
                  )
                var n = {
                  hex: !0,
                  utf8: !0,
                  'utf-8': !0,
                  ascii: !0,
                  binary: !0,
                  base64: !0,
                  ucs2: !0,
                  'ucs-2': !0,
                  utf16le: !0,
                  'utf-16le': !0
                }
                eb.isNativeEncoding = function (t) {
                  return t && n[t.toLowerCase()]
                }
                var r = k.default.SlowBuffer
                if (
                  ((e.SlowBufferToString = r.prototype.toString),
                  (r.prototype.toString = function (n, r, i) {
                    return (
                      (n = String(n || 'utf8').toLowerCase()),
                      eb.isNativeEncoding(n)
                        ? e.SlowBufferToString.call(this, n, r, i)
                        : (void 0 === r && (r = 0),
                          void 0 === i && (i = this.length),
                          t.decode(this.slice(r, i), n))
                    )
                  }),
                  (e.SlowBufferWrite = r.prototype.write),
                  (r.prototype.write = function (n, r, i, o) {
                    if (isFinite(r)) isFinite(i) || ((o = i), (i = void 0))
                    else {
                      var u = o
                      ;(o = r), (r = i), (i = u)
                    }
                    r = +r || 0
                    var s = this.length - r
                    if (
                      (i ? (i = +i) > s && (i = s) : (i = s),
                      (o = String(o || 'utf8').toLowerCase()),
                      eb.isNativeEncoding(o))
                    )
                      return e.SlowBufferWrite.call(this, n, r, i, o)
                    if (n.length > 0 && (i < 0 || r < 0))
                      throw new RangeError('attempt to write beyond buffer bounds')
                    var c = t.encode(n, o)
                    return c.length < i && (i = c.length), c.copy(this, r, 0, i), i
                  }),
                  (e.BufferIsEncoding = eb.isEncoding),
                  (eb.isEncoding = function (e) {
                    return eb.isNativeEncoding(e) || t.encodingExists(e)
                  }),
                  (e.BufferByteLength = eb.byteLength),
                  (eb.byteLength = r.byteLength = function (n, r) {
                    return (
                      (r = String(r || 'utf8').toLowerCase()),
                      eb.isNativeEncoding(r)
                        ? e.BufferByteLength.call(this, n, r)
                        : t.encode(n, r).length
                    )
                  }),
                  (e.BufferToString = eb.prototype.toString),
                  (eb.prototype.toString = function (n, r, i) {
                    return (
                      (n = String(n || 'utf8').toLowerCase()),
                      eb.isNativeEncoding(n)
                        ? e.BufferToString.call(this, n, r, i)
                        : (void 0 === r && (r = 0),
                          void 0 === i && (i = this.length),
                          t.decode(this.slice(r, i), n))
                    )
                  }),
                  (e.BufferWrite = eb.prototype.write),
                  (eb.prototype.write = function (n, r, i, o) {
                    var u = r,
                      s = i,
                      c = o
                    if (isFinite(r)) isFinite(i) || ((o = i), (i = void 0))
                    else {
                      var a = o
                      ;(o = r), (r = i), (i = a)
                    }
                    if (((o = String(o || 'utf8').toLowerCase()), eb.isNativeEncoding(o)))
                      return e.BufferWrite.call(this, n, u, s, c)
                    r = +r || 0
                    var f = this.length - r
                    if (
                      (i ? (i = +i) > f && (i = f) : (i = f),
                      n.length > 0 && (i < 0 || r < 0))
                    )
                      throw new RangeError('attempt to write beyond buffer bounds')
                    var l = t.encode(n, o)
                    return l.length < i && (i = l.length), l.copy(this, r, 0, i), i
                  }),
                  t.supportsStreams)
                ) {
                  var i = S.default.Readable
                  ;(e.ReadableSetEncoding = i.prototype.setEncoding),
                    (i.prototype.setEncoding = function (e, n) {
                      ;(this._readableState.decoder = t.getDecoder(e, n)),
                        (this._readableState.encoding = e)
                    }),
                    (i.prototype.collect = t._collect)
                }
              }
            }),
            (t.undoExtendNodeEncodings = function () {
              if (t.supportsNodeEncodingsExtension) {
                if (!e)
                  throw new Error(
                    "require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called."
                  )
                delete eb.isNativeEncoding
                var n = k.default.SlowBuffer
                if (
                  ((n.prototype.toString = e.SlowBufferToString),
                  (n.prototype.write = e.SlowBufferWrite),
                  (eb.isEncoding = e.BufferIsEncoding),
                  (eb.byteLength = e.BufferByteLength),
                  (eb.prototype.toString = e.BufferToString),
                  (eb.prototype.write = e.BufferWrite),
                  t.supportsStreams)
                ) {
                  var r = S.default.Readable
                  ;(r.prototype.setEncoding = e.ReadableSetEncoding),
                    delete r.prototype.collect
                }
                e = void 0
              }
            })
        })(n)
    }
  }),
  rb = 'win32' === process.platform,
  ib = rb ? /[^:]\\$/ : /.\/$/
/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */
const ob = process.binding('constants'),
  ub = (function () {
    var t
    return (
      (t = rb
        ? process.env.TEMP ||
          process.env.TMP ||
          (process.env.SystemRoot || process.env.windir) + '\\temp'
        : process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp'),
      ib.test(t) && (t = t.slice(0, -1)),
      t
    )
  })(),
  sb = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  cb = /XXXXXX/,
  ab =
    (ob.O_CREAT || ob.fs.O_CREAT) |
    (ob.O_EXCL || ob.fs.O_EXCL) |
    (ob.O_RDWR || ob.fs.O_RDWR),
  fb = ob.EBADF || ob.os.errno.EBADF,
  lb = ob.ENOENT || ob.os.errno.ENOENT,
  hb = []
var pb = !1,
  db = !1
function vb(t) {
  var e = [],
    n = null
  try {
    n = T.default.randomBytes(t)
  } catch (e) {
    n = T.default.pseudoRandomBytes(t)
  }
  for (var r = 0; r < t; r++) e.push(sb[n[r] % sb.length])
  return e.join('')
}
function yb(t) {
  return void 0 === t
}
function bb(t, e) {
  return 'function' == typeof t ? [e || {}, t] : yb(t) ? [{}, e] : [t, e]
}
function gb(t) {
  if (t.name) return D.default.join(t.dir || ub, t.name)
  if (t.template) return t.template.replace(cb, vb(6))
  const e = [t.prefix || 'tmp-', process.pid, vb(12), t.postfix || ''].join('')
  return D.default.join(t.dir || ub, e)
}
function mb(t, e) {
  var n = bb(t, e),
    r = n[0],
    i = n[1],
    o = r.name ? 1 : r.tries || 3
  return isNaN(o) || o < 0
    ? i(new Error('Invalid tries'))
    : r.template && !r.template.match(cb)
    ? i(new Error('Invalid template provided'))
    : void (function t() {
        const e = gb(r)
        m.default.stat(e, function (n) {
          if (!n)
            return o-- > 0
              ? t()
              : i(
                  new Error('Could not get a unique tmp filename, max tries reached ' + e)
                )
          i(null, e)
        })
      })()
}
function Db(t) {
  var e = bb(t)[0],
    n = e.name ? 1 : e.tries || 3
  if (isNaN(n) || n < 0) throw new Error('Invalid tries')
  if (e.template && !e.template.match(cb)) throw new Error('Invalid template provided')
  do {
    const t = gb(e)
    try {
      m.default.statSync(t)
    } catch (e) {
      return t
    }
  } while (n-- > 0)
  throw new Error('Could not get a unique tmp filename, max tries reached')
}
function wb(t) {
  const e = [t]
  do {
    for (
      var n = e.pop(), r = !1, i = m.default.readdirSync(n), o = 0, u = i.length;
      o < u;
      o++
    ) {
      var s = D.default.join(n, i[o])
      m.default.lstatSync(s).isDirectory()
        ? (r || ((r = !0), e.push(n)), e.push(s))
        : m.default.unlinkSync(s)
    }
    r || m.default.rmdirSync(n)
  } while (0 !== e.length)
}
function _b(t, e, n) {
  const r = xb(
    function (t) {
      try {
        0 <= t[0] && m.default.closeSync(t[0])
      } catch (t) {
        if (!((e = t), Fb(e, -fb, 'EBADF') || Cb(t))) throw t
      }
      var e
      try {
        m.default.unlinkSync(t[1])
      } catch (t) {
        if (!Cb(t)) throw t
      }
    },
    [e, t]
  )
  return n.keep || hb.unshift(r), r
}
function Eb(t, e) {
  const n = xb(e.unsafeCleanup ? wb : m.default.rmdirSync.bind(m.default), t)
  return e.keep || hb.unshift(n), n
}
function xb(t, e) {
  var n = !1
  return function r(i) {
    if (!n) {
      const i = hb.indexOf(r)
      i >= 0 && hb.splice(i, 1), (n = !0), t(e)
    }
    i && i(null)
  }
}
function Sb() {
  if (!db || pb)
    for (; hb.length; )
      try {
        hb[0].call(null)
      } catch (t) {}
}
function Cb(t) {
  return Fb(t, -lb, 'ENOENT')
}
function Fb(t, e, n) {
  return t.code == e || t.code == n
}
const Ob = process.versions.node.split('.').map(function (t) {
  return parseInt(t, 10)
})
0 === Ob[0] &&
  (Ob[1] < 9 || (9 === Ob[1] && Ob[2] < 5)) &&
  process.addListener('uncaughtException', function (t) {
    throw ((db = !0), Sb(), t)
  }),
  process.addListener('exit', function (t) {
    t && (db = !0), Sb()
  })
var jb = {
    tmpdir: ub,
    dir: function (t, e) {
      var n = bb(t, e),
        r = n[0],
        i = n[1]
      mb(r, function (t, e) {
        if (t) return i(t)
        m.default.mkdir(e, r.mode || 448, function (t) {
          if (t) return i(t)
          i(null, e, Eb(e, r))
        })
      })
    },
    dirSync: function (t) {
      var e = bb(t)[0]
      const n = Db(e)
      return m.default.mkdirSync(n, e.mode || 448), { name: n, removeCallback: Eb(n, e) }
    },
    file: function (t, e) {
      var n = bb(t, e),
        r = n[0],
        i = n[1]
      ;(r.postfix = yb(r.postfix) ? '.tmp' : r.postfix),
        mb(r, function (t, e) {
          if (t) return i(t)
          m.default.open(e, ab, r.mode || 384, function (t, n) {
            return t
              ? i(t)
              : r.discardDescriptor
              ? m.default.close(n, function (t) {
                  if (t) {
                    try {
                      m.default.unlinkSync(e)
                    } catch (e) {
                      Cb(e) || (t = e)
                    }
                    return i(t)
                  }
                  i(null, e, void 0, _b(e, -1, r))
                })
              : r.detachDescriptor
              ? i(null, e, n, _b(e, -1, r))
              : void i(null, e, n, _b(e, n, r))
          })
        })
    },
    fileSync: function (t) {
      var e = bb(t)[0]
      e.postfix = e.postfix || '.tmp'
      const n = e.discardDescriptor || e.detachDescriptor,
        r = Db(e)
      var i = m.default.openSync(r, ab, e.mode || 384)
      return (
        e.discardDescriptor && (m.default.closeSync(i), (i = void 0)),
        { name: r, fd: i, removeCallback: _b(r, n ? -1 : i, e) }
      )
    },
    tmpName: mb,
    tmpNameSync: Db,
    setGracefulCleanup: function () {
      pb = !0
    }
  },
  Ab =
    (St && St.__extends) ||
    (function () {
      var t = function (e, n) {
        return (t =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e
            }) ||
          function (t, e) {
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
          })(e, n)
      }
      return function (e, n) {
        function r() {
          this.constructor = e
        }
        t(e, n),
          (e.prototype =
            null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
      }
    })(),
  kb = (function (t) {
    function e(e) {
      var n = this.constructor,
        r = t.call(this, 'Failed to create temporary file for editor') || this
      r.originalError = e
      var i = n.prototype
      return (
        Object.setPrototypeOf ? Object.setPrototypeOf(r, i) : (r.__proto__ = n.prototype),
        r
      )
    }
    return Ab(e, t), e
  })(Error),
  Ib = Object.defineProperty({ CreateFileError: kb }, '__esModule', { value: !0 }),
  Tb =
    (St && St.__extends) ||
    (function () {
      var t = function (e, n) {
        return (t =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e
            }) ||
          function (t, e) {
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
          })(e, n)
      }
      return function (e, n) {
        function r() {
          this.constructor = e
        }
        t(e, n),
          (e.prototype =
            null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
      }
    })(),
  Nb = (function (t) {
    function e(e) {
      var n = this.constructor,
        r = t.call(this, 'Failed launch editor') || this
      r.originalError = e
      var i = n.prototype
      return (
        Object.setPrototypeOf ? Object.setPrototypeOf(r, i) : (r.__proto__ = n.prototype),
        r
      )
    }
    return Tb(e, t), e
  })(Error),
  Bb = Object.defineProperty({ LaunchEditorError: Nb }, '__esModule', { value: !0 }),
  Pb =
    (St && St.__extends) ||
    (function () {
      var t = function (e, n) {
        return (t =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e
            }) ||
          function (t, e) {
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
          })(e, n)
      }
      return function (e, n) {
        function r() {
          this.constructor = e
        }
        t(e, n),
          (e.prototype =
            null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
      }
    })(),
  Rb = (function (t) {
    function e(e) {
      var n = this.constructor,
        r = t.call(this, 'Failed to read temporary file') || this
      r.originalError = e
      var i = n.prototype
      return (
        Object.setPrototypeOf ? Object.setPrototypeOf(r, i) : (r.__proto__ = n.prototype),
        r
      )
    }
    return Pb(e, t), e
  })(Error),
  Lb = Object.defineProperty({ ReadFileError: Rb }, '__esModule', { value: !0 }),
  Mb =
    (St && St.__extends) ||
    (function () {
      var t = function (e, n) {
        return (t =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e
            }) ||
          function (t, e) {
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
          })(e, n)
      }
      return function (e, n) {
        function r() {
          this.constructor = e
        }
        t(e, n),
          (e.prototype =
            null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
      }
    })(),
  Ub = (function (t) {
    function e(e) {
      var n = this.constructor,
        r = t.call(this, 'Failed to cleanup temporary file') || this
      r.originalError = e
      var i = n.prototype
      return (
        Object.setPrototypeOf ? Object.setPrototypeOf(r, i) : (r.__proto__ = n.prototype),
        r
      )
    }
    return Mb(e, t), e
  })(Error),
  Vb = Object.defineProperty({ RemoveFileError: Ub }, '__esModule', { value: !0 }),
  $b = Ib.CreateFileError,
  zb = Bb.LaunchEditorError,
  qb = Lb.ReadFileError,
  Wb = Vb.RemoveFileError
var Gb = function (t, e) {
  void 0 === t && (t = '')
  var n = new Yb(t, e)
  return n.run(), n.cleanup(), n.text
}
var Kb = function (t, e, n) {
    void 0 === t && (t = '')
    var r = new Yb(t, n)
    r.runAsync(function (t, n) {
      if (t) setImmediate(e, t, null)
      else
        try {
          r.cleanup(), setImmediate(e, null, n)
        } catch (t) {
          setImmediate(e, t, null)
        }
    })
  },
  Yb = (function () {
    function t(t, e) {
      void 0 === t && (t = ''),
        (this.text = ''),
        (this.fileOptions = {}),
        (this.text = t),
        e && (this.fileOptions = e),
        this.determineEditor(),
        this.createTemporaryFile()
    }
    return (
      (t.splitStringBySpace = function (t) {
        for (var e = [], n = '', r = 0; r < t.length; r++) {
          var i = t[r]
          r > 0 && ' ' === i && '\\' !== t[r - 1] && n.length > 0
            ? (e.push(n), (n = ''))
            : (n += i)
        }
        return n.length > 0 && e.push(n), e
      }),
      Object.defineProperty(t.prototype, 'temp_file', {
        get: function () {
          return (
            console.log('DEPRECATED: temp_file. Use tempFile moving forward.'),
            this.tempFile
          )
        },
        enumerable: !0,
        configurable: !0
      }),
      Object.defineProperty(t.prototype, 'last_exit_status', {
        get: function () {
          return (
            console.log(
              'DEPRECATED: last_exit_status. Use lastExitStatus moving forward.'
            ),
            this.lastExitStatus
          )
        },
        enumerable: !0,
        configurable: !0
      }),
      (t.prototype.run = function () {
        return this.launchEditor(), this.readTemporaryFile(), this.text
      }),
      (t.prototype.runAsync = function (t) {
        var e = this
        try {
          this.launchEditorAsync(function () {
            try {
              e.readTemporaryFile(), setImmediate(t, null, e.text)
            } catch (e) {
              setImmediate(t, e, null)
            }
          })
        } catch (e) {
          setImmediate(t, e, null)
        }
      }),
      (t.prototype.cleanup = function () {
        this.removeTemporaryFile()
      }),
      (t.prototype.determineEditor = function () {
        var e = process.env.VISUAL
            ? process.env.VISUAL
            : process.env.EDITOR
            ? process.env.EDITOR
            : /^win/.test(process.platform)
            ? 'notepad'
            : 'vim',
          n = t.splitStringBySpace(e).map(function (t) {
            return t.replace('\\ ', ' ')
          }),
          r = n.shift()
        this.editor = { args: n, bin: r }
      }),
      (t.prototype.createTemporaryFile = function () {
        try {
          this.tempFile = jb.tmpNameSync(this.fileOptions)
          var t = { encoding: 'utf8' }
          this.fileOptions.hasOwnProperty('mode') && (t.mode = this.fileOptions.mode),
            m.default.writeFileSync(this.tempFile, this.text, t)
        } catch (t) {
          throw new Ib.CreateFileError(t)
        }
      }),
      (t.prototype.readTemporaryFile = function () {
        try {
          var t = m.default.readFileSync(this.tempFile)
          if (0 === t.length) this.text = ''
          else {
            var e = Av(t).toString()
            nb.encodingExists(e) || (e = 'utf8'), (this.text = nb.decode(t, e))
          }
        } catch (t) {
          throw new Lb.ReadFileError(t)
        }
      }),
      (t.prototype.removeTemporaryFile = function () {
        try {
          m.default.unlinkSync(this.tempFile)
        } catch (t) {
          throw new Vb.RemoveFileError(t)
        }
      }),
      (t.prototype.launchEditor = function () {
        try {
          var t = A.default.spawnSync(
            this.editor.bin,
            this.editor.args.concat([this.tempFile]),
            { stdio: 'inherit' }
          )
          this.lastExitStatus = t.status
        } catch (t) {
          throw new Bb.LaunchEditorError(t)
        }
      }),
      (t.prototype.launchEditorAsync = function (t) {
        var e = this
        try {
          A.default
            .spawn(this.editor.bin, this.editor.args.concat([this.tempFile]), {
              stdio: 'inherit'
            })
            .on('exit', function (n) {
              ;(e.lastExitStatus = n), setImmediate(t)
            })
        } catch (t) {
          throw new Bb.LaunchEditorError(t)
        }
      }),
      t
    )
  })(),
  Hb = Yb,
  Xb = Object.defineProperty(
    {
      CreateFileError: $b,
      LaunchEditorError: zb,
      ReadFileError: qb,
      RemoveFileError: Wb,
      edit: Gb,
      editAsync: Kb,
      ExternalEditor: Hb
    },
    '__esModule',
    { value: !0 }
  ).editAsync,
  { Subject: Jb } = dh
var Zb = class extends Fd {
    _run(t) {
      ;(this.done = t), (this.editorResult = new Jb())
      var e = Nd(this.rl)
      this.lineSubscription = e.line.subscribe(this.startExternalEditor.bind(this))
      var n = this.handleSubmitEvents(this.editorResult)
      return (
        n.success.forEach(this.onEnd.bind(this)),
        n.error.forEach(this.onError.bind(this)),
        (this.currentText = this.opt.default),
        (this.opt.default = null),
        this.render(),
        this
      )
    }
    render(t) {
      var e = '',
        n = this.getQuestion()
      'answered' === this.status
        ? (n += Sn.dim('Received'))
        : (n += Sn.dim('Press <enter> to launch your preferred editor.')),
        t && (e = Sn.red('>> ') + t),
        this.screen.render(n, e)
    }
    startExternalEditor() {
      this.rl.pause(), Xb(this.currentText, this.endExternalEditor.bind(this))
    }
    endExternalEditor(t, e) {
      this.rl.resume(), t ? this.editorResult.error(t) : this.editorResult.next(e)
    }
    onEnd(t) {
      this.editorResult.unsubscribe(),
        this.lineSubscription.unsubscribe(),
        (this.answer = t.value),
        (this.status = 'answered'),
        this.render(),
        this.screen.done(),
        this.done(this.answer)
    }
    onError(t) {
      this.render(t.isValid)
    }
  },
  Qb = Ft(function (t) {
    var e = t.exports
    ;(e.prompts = {}),
      (e.Separator = Pn),
      (e.ui = { BottomBar: Ru, Prompt: jh }),
      (e.createPromptModule = function (t) {
        var n = function (r, i) {
          var o
          try {
            o = new e.ui.Prompt(n.prompts, t)
          } catch (t) {
            return Promise.reject(t)
          }
          var u = o.run(r, i)
          return (u.ui = o), u
        }
        return (
          (n.prompts = {}),
          (n.registerPrompt = function (t, e) {
            return (n.prompts[t] = e), this
          }),
          (n.restoreDefaultPrompts = function () {
            this.registerPrompt('list', qd),
              this.registerPrompt('input', Kd),
              this.registerPrompt('number', Yd),
              this.registerPrompt('confirm', Zd),
              this.registerPrompt('rawlist', nv),
              this.registerPrompt('expand', dv),
              this.registerPrompt('checkbox', gv),
              this.registerPrompt('password', Ev),
              this.registerPrompt('editor', Zb)
          }),
          n.restoreDefaultPrompts(),
          n
        )
      }),
      (e.prompt = e.createPromptModule()),
      (e.registerPrompt = function (t, n) {
        e.prompt.registerPrompt(t, n)
      }),
      (e.restoreDefaultPrompts = function () {
        e.prompt.restoreDefaultPrompts()
      })
  }),
  tg = function (t) {
    return Object.defineProperty(
      function (...e) {
        if ('function' != typeof e[e.length - 1])
          return new Promise((n, r) => {
            t.call(this, ...e, (t, e) => (null != t ? r(t) : n(e)))
          })
        t.apply(this, e)
      },
      'name',
      { value: t.name }
    )
  },
  eg = function (t) {
    return Object.defineProperty(
      function (...e) {
        const n = e[e.length - 1]
        if ('function' != typeof n) return t.apply(this, e)
        t.apply(this, e.slice(0, -1)).then((t) => n(null, t), n)
      },
      'name',
      { value: t.name }
    )
  },
  ng = process.cwd,
  rg = null,
  ig = process.env.GRACEFUL_FS_PLATFORM || process.platform
process.cwd = function () {
  return rg || (rg = ng.call(process)), rg
}
try {
  process.cwd()
} catch (t) {}
if ('function' == typeof process.chdir) {
  var og = process.chdir
  ;(process.chdir = function (t) {
    ;(rg = null), og.call(process, t)
  }),
    Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, og)
}
var ug = function (t) {
  N.default.hasOwnProperty('O_SYMLINK') &&
    process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) &&
    (function (t) {
      ;(t.lchmod = function (e, n, r) {
        t.open(e, N.default.O_WRONLY | N.default.O_SYMLINK, n, function (e, i) {
          e
            ? r && r(e)
            : t.fchmod(i, n, function (e) {
                t.close(i, function (t) {
                  r && r(e || t)
                })
              })
        })
      }),
        (t.lchmodSync = function (e, n) {
          var r,
            i = t.openSync(e, N.default.O_WRONLY | N.default.O_SYMLINK, n),
            o = !0
          try {
            ;(r = t.fchmodSync(i, n)), (o = !1)
          } finally {
            if (o)
              try {
                t.closeSync(i)
              } catch (t) {}
            else t.closeSync(i)
          }
          return r
        })
    })(t)
  t.lutimes ||
    (function (t) {
      N.default.hasOwnProperty('O_SYMLINK')
        ? ((t.lutimes = function (e, n, r, i) {
            t.open(e, N.default.O_SYMLINK, function (e, o) {
              e
                ? i && i(e)
                : t.futimes(o, n, r, function (e) {
                    t.close(o, function (t) {
                      i && i(e || t)
                    })
                  })
            })
          }),
          (t.lutimesSync = function (e, n, r) {
            var i,
              o = t.openSync(e, N.default.O_SYMLINK),
              u = !0
            try {
              ;(i = t.futimesSync(o, n, r)), (u = !1)
            } finally {
              if (u)
                try {
                  t.closeSync(o)
                } catch (t) {}
              else t.closeSync(o)
            }
            return i
          }))
        : ((t.lutimes = function (t, e, n, r) {
            r && process.nextTick(r)
          }),
          (t.lutimesSync = function () {}))
    })(t)
  ;(t.chown = i(t.chown)),
    (t.fchown = i(t.fchown)),
    (t.lchown = i(t.lchown)),
    (t.chmod = n(t.chmod)),
    (t.fchmod = n(t.fchmod)),
    (t.lchmod = n(t.lchmod)),
    (t.chownSync = o(t.chownSync)),
    (t.fchownSync = o(t.fchownSync)),
    (t.lchownSync = o(t.lchownSync)),
    (t.chmodSync = r(t.chmodSync)),
    (t.fchmodSync = r(t.fchmodSync)),
    (t.lchmodSync = r(t.lchmodSync)),
    (t.stat = u(t.stat)),
    (t.fstat = u(t.fstat)),
    (t.lstat = u(t.lstat)),
    (t.statSync = s(t.statSync)),
    (t.fstatSync = s(t.fstatSync)),
    (t.lstatSync = s(t.lstatSync)),
    t.lchmod ||
      ((t.lchmod = function (t, e, n) {
        n && process.nextTick(n)
      }),
      (t.lchmodSync = function () {}))
  t.lchown ||
    ((t.lchown = function (t, e, n, r) {
      r && process.nextTick(r)
    }),
    (t.lchownSync = function () {}))
  'win32' === ig &&
    (t.rename =
      ((e = t.rename),
      function (n, r, i) {
        var o = Date.now(),
          u = 0
        e(n, r, function s(c) {
          if (c && ('EACCES' === c.code || 'EPERM' === c.code) && Date.now() - o < 6e4)
            return (
              setTimeout(function () {
                t.stat(r, function (t, o) {
                  t && 'ENOENT' === t.code ? e(n, r, s) : i(c)
                })
              }, u),
              void (u < 100 && (u += 10))
            )
          i && i(c)
        })
      }))
  var e
  function n(e) {
    return e
      ? function (n, r, i) {
          return e.call(t, n, r, function (t) {
            c(t) && (t = null), i && i.apply(this, arguments)
          })
        }
      : e
  }
  function r(e) {
    return e
      ? function (n, r) {
          try {
            return e.call(t, n, r)
          } catch (t) {
            if (!c(t)) throw t
          }
        }
      : e
  }
  function i(e) {
    return e
      ? function (n, r, i, o) {
          return e.call(t, n, r, i, function (t) {
            c(t) && (t = null), o && o.apply(this, arguments)
          })
        }
      : e
  }
  function o(e) {
    return e
      ? function (n, r, i) {
          try {
            return e.call(t, n, r, i)
          } catch (t) {
            if (!c(t)) throw t
          }
        }
      : e
  }
  function u(e) {
    return e
      ? function (n, r, i) {
          function o(t, e) {
            e && (e.uid < 0 && (e.uid += 4294967296), e.gid < 0 && (e.gid += 4294967296)),
              i && i.apply(this, arguments)
          }
          return (
            'function' == typeof r && ((i = r), (r = null)),
            r ? e.call(t, n, r, o) : e.call(t, n, o)
          )
        }
      : e
  }
  function s(e) {
    return e
      ? function (n, r) {
          var i = r ? e.call(t, n, r) : e.call(t, n)
          return i.uid < 0 && (i.uid += 4294967296), i.gid < 0 && (i.gid += 4294967296), i
        }
      : e
  }
  function c(t) {
    return (
      !t ||
      'ENOSYS' === t.code ||
      !(
        (process.getuid && 0 === process.getuid()) ||
        ('EINVAL' !== t.code && 'EPERM' !== t.code)
      )
    )
  }
  ;(t.read = (function (e) {
    function n(n, r, i, o, u, s) {
      var c
      if (s && 'function' == typeof s) {
        var a = 0
        c = function (f, l, h) {
          if (f && 'EAGAIN' === f.code && a < 10) return a++, e.call(t, n, r, i, o, u, c)
          s.apply(this, arguments)
        }
      }
      return e.call(t, n, r, i, o, u, c)
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(n, e), n
  })(t.read)),
    (t.readSync =
      ((a = t.readSync),
      function (e, n, r, i, o) {
        for (var u = 0; ; )
          try {
            return a.call(t, e, n, r, i, o)
          } catch (t) {
            if ('EAGAIN' === t.code && u < 10) {
              u++
              continue
            }
            throw t
          }
      }))
  var a
}
var sg = S.default.Stream,
  cg = function (t) {
    return {
      ReadStream: function e(n, r) {
        if (!(this instanceof e)) return new e(n, r)
        sg.call(this)
        var i = this
        ;(this.path = n),
          (this.fd = null),
          (this.readable = !0),
          (this.paused = !1),
          (this.flags = 'r'),
          (this.mode = 438),
          (this.bufferSize = 65536),
          (r = r || {})
        for (var o = Object.keys(r), u = 0, s = o.length; u < s; u++) {
          var c = o[u]
          this[c] = r[c]
        }
        this.encoding && this.setEncoding(this.encoding)
        if (void 0 !== this.start) {
          if ('number' != typeof this.start) throw TypeError('start must be a Number')
          if (void 0 === this.end) this.end = 1 / 0
          else if ('number' != typeof this.end) throw TypeError('end must be a Number')
          if (this.start > this.end) throw new Error('start must be <= end')
          this.pos = this.start
        }
        if (null !== this.fd)
          return void process.nextTick(function () {
            i._read()
          })
        t.open(this.path, this.flags, this.mode, function (t, e) {
          if (t) return i.emit('error', t), void (i.readable = !1)
          ;(i.fd = e), i.emit('open', e), i._read()
        })
      },
      WriteStream: function e(n, r) {
        if (!(this instanceof e)) return new e(n, r)
        sg.call(this),
          (this.path = n),
          (this.fd = null),
          (this.writable = !0),
          (this.flags = 'w'),
          (this.encoding = 'binary'),
          (this.mode = 438),
          (this.bytesWritten = 0),
          (r = r || {})
        for (var i = Object.keys(r), o = 0, u = i.length; o < u; o++) {
          var s = i[o]
          this[s] = r[s]
        }
        if (void 0 !== this.start) {
          if ('number' != typeof this.start) throw TypeError('start must be a Number')
          if (this.start < 0) throw new Error('start must be >= zero')
          this.pos = this.start
        }
        ;(this.busy = !1),
          (this._queue = []),
          null === this.fd &&
            ((this._open = t.open),
            this._queue.push([this._open, this.path, this.flags, this.mode, void 0]),
            this.flush())
      }
    }
  }
var ag = function (t) {
    if (null === t || 'object' != typeof t) return t
    if (t instanceof Object) var e = { __proto__: fg(t) }
    else e = Object.create(null)
    return (
      Object.getOwnPropertyNames(t).forEach(function (n) {
        Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n))
      }),
      e
    )
  },
  fg =
    Object.getPrototypeOf ||
    function (t) {
      return t.__proto__
    }
var lg = Ft(function (t) {
    var e, n
    function r(t, n) {
      Object.defineProperty(t, e, {
        get: function () {
          return n
        }
      })
    }
    'function' == typeof Symbol && 'function' == typeof Symbol.for
      ? ((e = Symbol.for('graceful-fs.queue')), (n = Symbol.for('graceful-fs.previous')))
      : ((e = '___graceful-fs.queue'), (n = '___graceful-fs.previous'))
    var i = function () {}
    if (
      (w.default.debuglog
        ? (i = w.default.debuglog('gfs4'))
        : /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
          (i = function () {
            var t = w.default.format.apply(w.default, arguments)
            ;(t = 'GFS4: ' + t.split(/\n/).join('\nGFS4: ')), console.error(t)
          }),
      !m.default[e])
    ) {
      var o = St[e] || []
      r(m.default, o),
        (m.default.close = (function (t) {
          function e(e, n) {
            return t.call(m.default, e, function (t) {
              t || c(), 'function' == typeof n && n.apply(this, arguments)
            })
          }
          return Object.defineProperty(e, n, { value: t }), e
        })(m.default.close)),
        (m.default.closeSync = (function (t) {
          function e(e) {
            t.apply(m.default, arguments), c()
          }
          return Object.defineProperty(e, n, { value: t }), e
        })(m.default.closeSync)),
        /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
          process.on('exit', function () {
            i(m.default[e]), O.default.equal(m.default[e].length, 0)
          })
    }
    function u(t) {
      ug(t),
        (t.gracefulify = u),
        (t.createReadStream = function (e, n) {
          return new t.ReadStream(e, n)
        }),
        (t.createWriteStream = function (e, n) {
          return new t.WriteStream(e, n)
        })
      var e = t.readFile
      t.readFile = function (t, n, r) {
        'function' == typeof n && ((r = n), (n = null))
        return (function t(n, r, i) {
          return e(n, r, function (e) {
            !e || ('EMFILE' !== e.code && 'ENFILE' !== e.code)
              ? ('function' == typeof i && i.apply(this, arguments), c())
              : s([t, [n, r, i]])
          })
        })(t, n, r)
      }
      var n = t.writeFile
      t.writeFile = function (t, e, r, i) {
        'function' == typeof r && ((i = r), (r = null))
        return (function t(e, r, i, o) {
          return n(e, r, i, function (n) {
            !n || ('EMFILE' !== n.code && 'ENFILE' !== n.code)
              ? ('function' == typeof o && o.apply(this, arguments), c())
              : s([t, [e, r, i, o]])
          })
        })(t, e, r, i)
      }
      var r = t.appendFile
      r &&
        (t.appendFile = function (t, e, n, i) {
          'function' == typeof n && ((i = n), (n = null))
          return (function t(e, n, i, o) {
            return r(e, n, i, function (r) {
              !r || ('EMFILE' !== r.code && 'ENFILE' !== r.code)
                ? ('function' == typeof o && o.apply(this, arguments), c())
                : s([t, [e, n, i, o]])
            })
          })(t, e, n, i)
        })
      var i = t.copyFile
      i &&
        (t.copyFile = function (t, e, n, r) {
          'function' == typeof n && ((r = n), (n = 0))
          return i(t, e, n, function (o) {
            !o || ('EMFILE' !== o.code && 'ENFILE' !== o.code)
              ? ('function' == typeof r && r.apply(this, arguments), c())
              : s([i, [t, e, n, r]])
          })
        })
      var o = t.readdir
      function a(e) {
        return o.apply(t, e)
      }
      if (
        ((t.readdir = function (t, e, n) {
          var r = [t]
          'function' != typeof e ? r.push(e) : (n = e)
          return (
            r.push(function (t, e) {
              e && e.sort && e.sort()
              !t || ('EMFILE' !== t.code && 'ENFILE' !== t.code)
                ? ('function' == typeof n && n.apply(this, arguments), c())
                : s([a, [r]])
            }),
            a(r)
          )
        }),
        'v0.8' === process.version.substr(0, 4))
      ) {
        var f = cg(t)
        ;(v = f.ReadStream), (y = f.WriteStream)
      }
      var l = t.ReadStream
      l &&
        ((v.prototype = Object.create(l.prototype)),
        (v.prototype.open = function () {
          var t = this
          g(t.path, t.flags, t.mode, function (e, n) {
            e
              ? (t.autoClose && t.destroy(), t.emit('error', e))
              : ((t.fd = n), t.emit('open', n), t.read())
          })
        }))
      var h = t.WriteStream
      h &&
        ((y.prototype = Object.create(h.prototype)),
        (y.prototype.open = function () {
          var t = this
          g(t.path, t.flags, t.mode, function (e, n) {
            e ? (t.destroy(), t.emit('error', e)) : ((t.fd = n), t.emit('open', n))
          })
        })),
        Object.defineProperty(t, 'ReadStream', {
          get: function () {
            return v
          },
          set: function (t) {
            v = t
          },
          enumerable: !0,
          configurable: !0
        }),
        Object.defineProperty(t, 'WriteStream', {
          get: function () {
            return y
          },
          set: function (t) {
            y = t
          },
          enumerable: !0,
          configurable: !0
        })
      var p = v
      Object.defineProperty(t, 'FileReadStream', {
        get: function () {
          return p
        },
        set: function (t) {
          p = t
        },
        enumerable: !0,
        configurable: !0
      })
      var d = y
      function v(t, e) {
        return this instanceof v
          ? (l.apply(this, arguments), this)
          : v.apply(Object.create(v.prototype), arguments)
      }
      function y(t, e) {
        return this instanceof y
          ? (h.apply(this, arguments), this)
          : y.apply(Object.create(y.prototype), arguments)
      }
      Object.defineProperty(t, 'FileWriteStream', {
        get: function () {
          return d
        },
        set: function (t) {
          d = t
        },
        enumerable: !0,
        configurable: !0
      })
      var b = t.open
      function g(t, e, n, r) {
        return (
          'function' == typeof n && ((r = n), (n = null)),
          (function t(e, n, r, i) {
            return b(e, n, r, function (o, u) {
              !o || ('EMFILE' !== o.code && 'ENFILE' !== o.code)
                ? ('function' == typeof i && i.apply(this, arguments), c())
                : s([t, [e, n, r, i]])
            })
          })(t, e, n, r)
        )
      }
      return (t.open = g), t
    }
    function s(t) {
      i('ENQUEUE', t[0].name, t[1]), m.default[e].push(t)
    }
    function c() {
      var t = m.default[e].shift()
      t && (i('RETRY', t[0].name, t[1]), t[0].apply(null, t[1]))
    }
    St[e] || r(St, m.default[e]),
      (t.exports = u(ag(m.default))),
      process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH &&
        !m.default.__patched &&
        ((t.exports = u(m.default)), (m.default.__patched = !0))
  }),
  hg = Ft(function (t, e) {
    const n = tg,
      r = [
        'access',
        'appendFile',
        'chmod',
        'chown',
        'close',
        'copyFile',
        'fchmod',
        'fchown',
        'fdatasync',
        'fstat',
        'fsync',
        'ftruncate',
        'futimes',
        'lchmod',
        'lchown',
        'link',
        'lstat',
        'mkdir',
        'mkdtemp',
        'open',
        'opendir',
        'readdir',
        'readFile',
        'readlink',
        'realpath',
        'rename',
        'rm',
        'rmdir',
        'stat',
        'symlink',
        'truncate',
        'unlink',
        'utimes',
        'writeFile'
      ].filter((t) => 'function' == typeof lg[t])
    Object.keys(lg).forEach((t) => {
      'promises' !== t && (e[t] = lg[t])
    }),
      r.forEach((t) => {
        e[t] = n(lg[t])
      }),
      (e.exists = function (t, e) {
        return 'function' == typeof e
          ? lg.exists(t, e)
          : new Promise((e) => lg.exists(t, e))
      }),
      (e.read = function (t, e, n, r, i, o) {
        return 'function' == typeof o
          ? lg.read(t, e, n, r, i, o)
          : new Promise((o, u) => {
              lg.read(t, e, n, r, i, (t, e, n) => {
                if (t) return u(t)
                o({ bytesRead: e, buffer: n })
              })
            })
      }),
      (e.write = function (t, e, ...n) {
        return 'function' == typeof n[n.length - 1]
          ? lg.write(t, e, ...n)
          : new Promise((r, i) => {
              lg.write(t, e, ...n, (t, e, n) => {
                if (t) return i(t)
                r({ bytesWritten: e, buffer: n })
              })
            })
      }),
      'function' == typeof lg.writev &&
        (e.writev = function (t, e, ...n) {
          return 'function' == typeof n[n.length - 1]
            ? lg.writev(t, e, ...n)
            : new Promise((r, i) => {
                lg.writev(t, e, ...n, (t, e, n) => {
                  if (t) return i(t)
                  r({ bytesWritten: e, buffers: n })
                })
              })
        }),
      'function' == typeof lg.realpath.native &&
        (e.realpath.native = n(lg.realpath.native))
  }),
  pg = (t) => {
    const e = process.versions.node.split('.').map((t) => parseInt(t, 10))
    return (
      (t = t.split('.').map((t) => parseInt(t, 10))),
      e[0] > t[0] || (e[0] === t[0] && (e[1] > t[1] || (e[1] === t[1] && e[2] >= t[2])))
    )
  }
const dg = pg('10.12.0'),
  vg = (t) => {
    if ('win32' === process.platform) {
      if (/[<>:"|?*]/.test(t.replace(D.default.parse(t).root, ''))) {
        const e = new Error(`Path contains invalid characters: ${t}`)
        throw ((e.code = 'EINVAL'), e)
      }
    }
  },
  yg = (t) => ('number' == typeof t && (t = { mode: t }), { mode: 511, ...t }),
  bg = (t) => {
    const e = new Error(`operation not permitted, mkdir '${t}'`)
    return (e.code = 'EPERM'), (e.errno = -4048), (e.path = t), (e.syscall = 'mkdir'), e
  }
var gg = {
  makeDir: async (t, e) => {
    if ((vg(t), (e = yg(e)), dg)) {
      const n = D.default.resolve(t)
      return hg.mkdir(n, { mode: e.mode, recursive: !0 })
    }
    const n = async (t) => {
      try {
        await hg.mkdir(t, e.mode)
      } catch (e) {
        if ('EPERM' === e.code) throw e
        if ('ENOENT' === e.code) {
          if (D.default.dirname(t) === t) throw bg(t)
          if (e.message.includes('null bytes')) throw e
          return await n(D.default.dirname(t)), n(t)
        }
        try {
          if (!(await hg.stat(t)).isDirectory())
            throw new Error('The path is not a directory')
        } catch {
          throw e
        }
      }
    }
    return n(D.default.resolve(t))
  },
  makeDirSync: (t, e) => {
    if ((vg(t), (e = yg(e)), dg)) {
      const n = D.default.resolve(t)
      return hg.mkdirSync(n, { mode: e.mode, recursive: !0 })
    }
    const n = (t) => {
      try {
        hg.mkdirSync(t, e.mode)
      } catch (e) {
        if ('EPERM' === e.code) throw e
        if ('ENOENT' === e.code) {
          if (D.default.dirname(t) === t) throw bg(t)
          if (e.message.includes('null bytes')) throw e
          return n(D.default.dirname(t)), n(t)
        }
        try {
          if (!hg.statSync(t).isDirectory())
            throw new Error('The path is not a directory')
        } catch {
          throw e
        }
      }
    }
    return n(D.default.resolve(t))
  }
}
const mg = eg,
  { makeDir: Dg, makeDirSync: wg } = gg,
  _g = mg(Dg)
var Eg = {
  mkdirs: _g,
  mkdirsSync: wg,
  mkdirp: _g,
  mkdirpSync: wg,
  ensureDir: _g,
  ensureDirSync: wg
}
var xg = function (t, e, n, r) {
    lg.open(t, 'r+', (t, i) => {
      if (t) return r(t)
      lg.futimes(i, e, n, (t) => {
        lg.close(i, (e) => {
          r && r(t || e)
        })
      })
    })
  },
  Sg = function (t, e, n) {
    const r = lg.openSync(t, 'r+')
    return lg.futimesSync(r, e, n), lg.closeSync(r)
  }
const Cg = pg('10.5.0'),
  Fg = (t) => (Cg ? hg.stat(t, { bigint: !0 }) : hg.stat(t)),
  Og = (t) => (Cg ? hg.statSync(t, { bigint: !0 }) : hg.statSync(t))
function jg(t, e) {
  return Promise.all([
    Fg(t),
    Fg(e).catch((t) => {
      if ('ENOENT' === t.code) return null
      throw t
    })
  ]).then(([t, e]) => ({ srcStat: t, destStat: e }))
}
function Ag(t, e) {
  if (e.ino && e.dev && e.ino === t.ino && e.dev === t.dev) {
    if (Cg || e.ino < Number.MAX_SAFE_INTEGER) return !0
    if (
      e.size === t.size &&
      e.mode === t.mode &&
      e.nlink === t.nlink &&
      e.atimeMs === t.atimeMs &&
      e.mtimeMs === t.mtimeMs &&
      e.ctimeMs === t.ctimeMs &&
      e.birthtimeMs === t.birthtimeMs
    )
      return !0
  }
  return !1
}
function kg(t, e) {
  const n = D.default
      .resolve(t)
      .split(D.default.sep)
      .filter((t) => t),
    r = D.default
      .resolve(e)
      .split(D.default.sep)
      .filter((t) => t)
  return n.reduce((t, e, n) => t && r[n] === e, !0)
}
function Ig(t, e, n) {
  return `Cannot ${n} '${t}' to a subdirectory of itself, '${e}'.`
}
var Tg = {
  checkPaths: function (t, e, n, r) {
    w.default.callbackify(jg)(t, e, (i, o) => {
      if (i) return r(i)
      const { srcStat: u, destStat: s } = o
      return s && Ag(u, s)
        ? r(new Error('Source and destination must not be the same.'))
        : u.isDirectory() && kg(t, e)
        ? r(new Error(Ig(t, e, n)))
        : r(null, { srcStat: u, destStat: s })
    })
  },
  checkPathsSync: function (t, e, n) {
    const { srcStat: r, destStat: i } = (function (t, e) {
      let n
      const r = Og(t)
      try {
        n = Og(e)
      } catch (t) {
        if ('ENOENT' === t.code) return { srcStat: r, destStat: null }
        throw t
      }
      return { srcStat: r, destStat: n }
    })(t, e)
    if (i && Ag(r, i)) throw new Error('Source and destination must not be the same.')
    if (r.isDirectory() && kg(t, e)) throw new Error(Ig(t, e, n))
    return { srcStat: r, destStat: i }
  },
  checkParentPaths: function t(e, n, r, i, o) {
    const u = D.default.resolve(D.default.dirname(e)),
      s = D.default.resolve(D.default.dirname(r))
    if (s === u || s === D.default.parse(s).root) return o()
    const c = (u, c) =>
      u
        ? 'ENOENT' === u.code
          ? o()
          : o(u)
        : Ag(n, c)
        ? o(new Error(Ig(e, r, i)))
        : t(e, n, s, i, o)
    Cg ? hg.stat(s, { bigint: !0 }, c) : hg.stat(s, c)
  },
  checkParentPathsSync: function t(e, n, r, i) {
    const o = D.default.resolve(D.default.dirname(e)),
      u = D.default.resolve(D.default.dirname(r))
    if (u === o || u === D.default.parse(u).root) return
    let s
    try {
      s = Og(u)
    } catch (t) {
      if ('ENOENT' === t.code) return
      throw t
    }
    if (Ag(n, s)) throw new Error(Ig(e, r, i))
    return t(e, n, u, i)
  },
  isSrcSubdir: kg
}
const Ng = Eg.mkdirsSync,
  Bg = Sg
function Pg(t, e, n, r) {
  if (!r.filter || r.filter(e, n))
    return (function (t, e, n, r) {
      const i = (r.dereference ? lg.statSync : lg.lstatSync)(e)
      if (i.isDirectory())
        return (function (t, e, n, r, i) {
          if (!e)
            return (function (t, e, n, r) {
              return lg.mkdirSync(n), Mg(e, n, r), Lg(n, t)
            })(t.mode, n, r, i)
          if (e && !e.isDirectory())
            throw new Error(
              `Cannot overwrite non-directory '${r}' with directory '${n}'.`
            )
          return Mg(n, r, i)
        })(i, t, e, n, r)
      if (i.isFile() || i.isCharacterDevice() || i.isBlockDevice())
        return (function (t, e, n, r, i) {
          return e
            ? (function (t, e, n, r) {
                if (r.overwrite) return lg.unlinkSync(n), Rg(t, e, n, r)
                if (r.errorOnExist) throw new Error(`'${n}' already exists`)
              })(t, n, r, i)
            : Rg(t, n, r, i)
        })(i, t, e, n, r)
      if (i.isSymbolicLink())
        return (function (t, e, n, r) {
          let i = lg.readlinkSync(e)
          r.dereference && (i = D.default.resolve(process.cwd(), i))
          if (t) {
            let t
            try {
              t = lg.readlinkSync(n)
            } catch (t) {
              if ('EINVAL' === t.code || 'UNKNOWN' === t.code) return lg.symlinkSync(i, n)
              throw t
            }
            if (
              (r.dereference && (t = D.default.resolve(process.cwd(), t)),
              Tg.isSrcSubdir(i, t))
            )
              throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${t}'.`)
            if (lg.statSync(n).isDirectory() && Tg.isSrcSubdir(t, i))
              throw new Error(`Cannot overwrite '${t}' with '${i}'.`)
            return (function (t, e) {
              return lg.unlinkSync(e), lg.symlinkSync(t, e)
            })(i, n)
          }
          return lg.symlinkSync(i, n)
        })(t, e, n, r)
    })(t, e, n, r)
}
function Rg(t, e, n, r) {
  return (
    lg.copyFileSync(e, n),
    r.preserveTimestamps &&
      (function (t, e, n) {
        ;(function (t) {
          return 0 == (128 & t)
        })(t) &&
          (function (t, e) {
            Lg(t, 128 | e)
          })(n, t)
        ;(function (t, e) {
          const n = lg.statSync(t)
          Bg(e, n.atime, n.mtime)
        })(e, n)
      })(t.mode, e, n),
    Lg(n, t.mode)
  )
}
function Lg(t, e) {
  return lg.chmodSync(t, e)
}
function Mg(t, e, n) {
  lg.readdirSync(t).forEach((r) =>
    (function (t, e, n, r) {
      const i = D.default.join(e, t),
        o = D.default.join(n, t),
        { destStat: u } = Tg.checkPathsSync(i, o, 'copy')
      return Pg(u, i, o, r)
    })(r, t, e, n)
  )
}
var Ug = {
  copySync: function (t, e, n) {
    'function' == typeof n && (n = { filter: n }),
      ((n = n || {}).clobber = !('clobber' in n) || !!n.clobber),
      (n.overwrite = 'overwrite' in n ? !!n.overwrite : n.clobber),
      n.preserveTimestamps &&
        'ia32' === process.arch &&
        console.warn(
          'fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269'
        )
    const { srcStat: r, destStat: i } = Tg.checkPathsSync(t, e, 'copy')
    return (
      Tg.checkParentPathsSync(t, r, e, 'copy'),
      (function (t, e, n, r) {
        if (r.filter && !r.filter(e, n)) return
        const i = D.default.dirname(n)
        lg.existsSync(i) || Ng(i)
        return Pg(t, e, n, r)
      })(i, t, e, n)
    )
  }
}
var Vg = {
  pathExists: eg(function (t) {
    return hg
      .access(t)
      .then(() => !0)
      .catch(() => !1)
  }),
  pathExistsSync: hg.existsSync
}
const $g = Eg.mkdirs,
  zg = Vg.pathExists,
  qg = xg
function Wg(t, e, n, r, i) {
  const o = D.default.dirname(n)
  zg(o, (u, s) =>
    u ? i(u) : s ? Kg(t, e, n, r, i) : void $g(o, (o) => (o ? i(o) : Kg(t, e, n, r, i)))
  )
}
function Gg(t, e, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then(
    (u) => (u ? t(e, n, r, i, o) : o()),
    (t) => o(t)
  )
}
function Kg(t, e, n, r, i) {
  return r.filter ? Gg(Yg, t, e, n, r, i) : Yg(t, e, n, r, i)
}
function Yg(t, e, n, r, i) {
  ;(r.dereference ? lg.stat : lg.lstat)(e, (o, u) =>
    o
      ? i(o)
      : u.isDirectory()
      ? (function (t, e, n, r, i, o) {
          if (!e)
            return (function (t, e, n, r, i) {
              lg.mkdir(n, (o) => {
                if (o) return i(o)
                Zg(e, n, r, (e) => (e ? i(e) : Jg(n, t, i)))
              })
            })(t.mode, n, r, i, o)
          if (e && !e.isDirectory())
            return o(
              new Error(`Cannot overwrite non-directory '${r}' with directory '${n}'.`)
            )
          return Zg(n, r, i, o)
        })(u, t, e, n, r, i)
      : u.isFile() || u.isCharacterDevice() || u.isBlockDevice()
      ? (function (t, e, n, r, i, o) {
          return e
            ? (function (t, e, n, r, i) {
                if (!r.overwrite)
                  return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i()
                lg.unlink(n, (o) => (o ? i(o) : Hg(t, e, n, r, i)))
              })(t, n, r, i, o)
            : Hg(t, n, r, i, o)
        })(u, t, e, n, r, i)
      : u.isSymbolicLink()
      ? (function (t, e, n, r, i) {
          lg.readlink(e, (e, o) =>
            e
              ? i(e)
              : (r.dereference && (o = D.default.resolve(process.cwd(), o)),
                t
                  ? void lg.readlink(n, (e, u) =>
                      e
                        ? 'EINVAL' === e.code || 'UNKNOWN' === e.code
                          ? lg.symlink(o, n, i)
                          : i(e)
                        : (r.dereference && (u = D.default.resolve(process.cwd(), u)),
                          Tg.isSrcSubdir(o, u)
                            ? i(
                                new Error(
                                  `Cannot copy '${o}' to a subdirectory of itself, '${u}'.`
                                )
                              )
                            : t.isDirectory() && Tg.isSrcSubdir(u, o)
                            ? i(new Error(`Cannot overwrite '${u}' with '${o}'.`))
                            : (function (t, e, n) {
                                lg.unlink(e, (r) => (r ? n(r) : lg.symlink(t, e, n)))
                              })(o, n, i))
                    )
                  : lg.symlink(o, n, i))
          )
        })(t, e, n, r, i)
      : void 0
  )
}
function Hg(t, e, n, r, i) {
  lg.copyFile(e, n, (o) =>
    o
      ? i(o)
      : r.preserveTimestamps
      ? (function (t, e, n, r) {
          if (
            (function (t) {
              return 0 == (128 & t)
            })(t)
          )
            return (function (t, e, n) {
              return Jg(t, 128 | e, n)
            })(n, t, (i) => (i ? r(i) : Xg(t, e, n, r)))
          return Xg(t, e, n, r)
        })(t.mode, e, n, i)
      : Jg(n, t.mode, i)
  )
}
function Xg(t, e, n, r) {
  !(function (t, e, n) {
    lg.stat(t, (t, r) => (t ? n(t) : qg(e, r.atime, r.mtime, n)))
  })(e, n, (e) => (e ? r(e) : Jg(n, t, r)))
}
function Jg(t, e, n) {
  return lg.chmod(t, e, n)
}
function Zg(t, e, n, r) {
  lg.readdir(t, (i, o) => (i ? r(i) : Qg(o, t, e, n, r)))
}
function Qg(t, e, n, r, i) {
  const o = t.pop()
  return o
    ? (function (t, e, n, r, i, o) {
        const u = D.default.join(n, e),
          s = D.default.join(r, e)
        Tg.checkPaths(u, s, 'copy', (e, c) => {
          if (e) return o(e)
          const { destStat: a } = c
          Kg(a, u, s, i, (e) => (e ? o(e) : Qg(t, n, r, i, o)))
        })
      })(t, o, e, n, r, i)
    : i()
}
var tm = {
  copy: tg(function (t, e, n, r) {
    'function' != typeof n || r
      ? 'function' == typeof n && (n = { filter: n })
      : ((r = n), (n = {})),
      (r = r || function () {}),
      ((n = n || {}).clobber = !('clobber' in n) || !!n.clobber),
      (n.overwrite = 'overwrite' in n ? !!n.overwrite : n.clobber),
      n.preserveTimestamps &&
        'ia32' === process.arch &&
        console.warn(
          'fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269'
        ),
      Tg.checkPaths(t, e, 'copy', (i, o) => {
        if (i) return r(i)
        const { srcStat: u, destStat: s } = o
        Tg.checkParentPaths(t, u, e, 'copy', (i) =>
          i ? r(i) : n.filter ? Gg(Wg, s, t, e, n, r) : Wg(s, t, e, n, r)
        )
      })
  })
}
const em = 'win32' === process.platform
function nm(t) {
  ;['unlink', 'chmod', 'stat', 'lstat', 'rmdir', 'readdir'].forEach((e) => {
    ;(t[e] = t[e] || lg[e]), (t[(e += 'Sync')] = t[e] || lg[e])
  }),
    (t.maxBusyTries = t.maxBusyTries || 3)
}
function rm(t, e, n) {
  let r = 0
  'function' == typeof e && ((n = e), (e = {})),
    O.default(t, 'rimraf: missing path'),
    O.default.strictEqual(typeof t, 'string', 'rimraf: path should be a string'),
    O.default.strictEqual(typeof n, 'function', 'rimraf: callback function required'),
    O.default(e, 'rimraf: invalid options argument provided'),
    O.default.strictEqual(typeof e, 'object', 'rimraf: options should be object'),
    nm(e),
    im(t, e, function i(o) {
      if (o) {
        if (
          ('EBUSY' === o.code || 'ENOTEMPTY' === o.code || 'EPERM' === o.code) &&
          r < e.maxBusyTries
        ) {
          r++
          return setTimeout(() => im(t, e, i), 100 * r)
        }
        'ENOENT' === o.code && (o = null)
      }
      n(o)
    })
}
function im(t, e, n) {
  O.default(t),
    O.default(e),
    O.default('function' == typeof n),
    e.lstat(t, (r, i) =>
      r && 'ENOENT' === r.code
        ? n(null)
        : r && 'EPERM' === r.code && em
        ? om(t, e, r, n)
        : i && i.isDirectory()
        ? sm(t, e, r, n)
        : void e.unlink(t, (r) => {
            if (r) {
              if ('ENOENT' === r.code) return n(null)
              if ('EPERM' === r.code) return em ? om(t, e, r, n) : sm(t, e, r, n)
              if ('EISDIR' === r.code) return sm(t, e, r, n)
            }
            return n(r)
          })
    )
}
function om(t, e, n, r) {
  O.default(t),
    O.default(e),
    O.default('function' == typeof r),
    e.chmod(t, 438, (i) => {
      i
        ? r('ENOENT' === i.code ? null : n)
        : e.stat(t, (i, o) => {
            i
              ? r('ENOENT' === i.code ? null : n)
              : o.isDirectory()
              ? sm(t, e, n, r)
              : e.unlink(t, r)
          })
    })
}
function um(t, e, n) {
  let r
  O.default(t), O.default(e)
  try {
    e.chmodSync(t, 438)
  } catch (t) {
    if ('ENOENT' === t.code) return
    throw n
  }
  try {
    r = e.statSync(t)
  } catch (t) {
    if ('ENOENT' === t.code) return
    throw n
  }
  r.isDirectory() ? am(t, e, n) : e.unlinkSync(t)
}
function sm(t, e, n, r) {
  O.default(t),
    O.default(e),
    O.default('function' == typeof r),
    e.rmdir(t, (i) => {
      !i || ('ENOTEMPTY' !== i.code && 'EEXIST' !== i.code && 'EPERM' !== i.code)
        ? i && 'ENOTDIR' === i.code
          ? r(n)
          : r(i)
        : (function (t, e, n) {
            O.default(t),
              O.default(e),
              O.default('function' == typeof n),
              e.readdir(t, (r, i) => {
                if (r) return n(r)
                let o,
                  u = i.length
                if (0 === u) return e.rmdir(t, n)
                i.forEach((r) => {
                  rm(D.default.join(t, r), e, (r) => {
                    if (!o) return r ? n((o = r)) : void (0 == --u && e.rmdir(t, n))
                  })
                })
              })
          })(t, e, r)
    })
}
function cm(t, e) {
  let n
  nm((e = e || {})),
    O.default(t, 'rimraf: missing path'),
    O.default.strictEqual(typeof t, 'string', 'rimraf: path should be a string'),
    O.default(e, 'rimraf: missing options'),
    O.default.strictEqual(typeof e, 'object', 'rimraf: options should be object')
  try {
    n = e.lstatSync(t)
  } catch (n) {
    if ('ENOENT' === n.code) return
    'EPERM' === n.code && em && um(t, e, n)
  }
  try {
    n && n.isDirectory() ? am(t, e, null) : e.unlinkSync(t)
  } catch (n) {
    if ('ENOENT' === n.code) return
    if ('EPERM' === n.code) return em ? um(t, e, n) : am(t, e, n)
    if ('EISDIR' !== n.code) throw n
    am(t, e, n)
  }
}
function am(t, e, n) {
  O.default(t), O.default(e)
  try {
    e.rmdirSync(t)
  } catch (r) {
    if ('ENOTDIR' === r.code) throw n
    if ('ENOTEMPTY' === r.code || 'EEXIST' === r.code || 'EPERM' === r.code)
      !(function (t, e) {
        if (
          (O.default(t),
          O.default(e),
          e.readdirSync(t).forEach((n) => cm(D.default.join(t, n), e)),
          !em)
        ) {
          return e.rmdirSync(t, e)
        }
        {
          const n = Date.now()
          do {
            try {
              return e.rmdirSync(t, e)
            } catch {}
          } while (Date.now() - n < 500)
        }
      })(t, e)
    else if ('ENOENT' !== r.code) throw r
  }
}
var fm = rm
rm.sync = cm
var lm = { remove: tg(fm), removeSync: fm.sync }
const hm = tg(function (t, e) {
  ;(e = e || function () {}),
    lg.readdir(t, (n, r) => {
      if (n) return Eg.mkdirs(t, e)
      ;(r = r.map((e) => D.default.join(t, e))),
        (function t() {
          const n = r.pop()
          if (!n) return e()
          lm.remove(n, (n) => {
            if (n) return e(n)
            t()
          })
        })()
    })
})
function pm(t) {
  let e
  try {
    e = lg.readdirSync(t)
  } catch {
    return Eg.mkdirsSync(t)
  }
  e.forEach((e) => {
    ;(e = D.default.join(t, e)), lm.removeSync(e)
  })
}
var dm = { emptyDirSync: pm, emptydirSync: pm, emptyDir: hm, emptydir: hm }
var vm = {
  createFile: tg(function (t, e) {
    function n() {
      lg.writeFile(t, '', (t) => {
        if (t) return e(t)
        e()
      })
    }
    lg.stat(t, (r, i) => {
      if (!r && i.isFile()) return e()
      const o = D.default.dirname(t)
      lg.stat(o, (t, r) => {
        if (t)
          return 'ENOENT' === t.code
            ? Eg.mkdirs(o, (t) => {
                if (t) return e(t)
                n()
              })
            : e(t)
        r.isDirectory()
          ? n()
          : lg.readdir(o, (t) => {
              if (t) return e(t)
            })
      })
    })
  }),
  createFileSync: function (t) {
    let e
    try {
      e = lg.statSync(t)
    } catch {}
    if (e && e.isFile()) return
    const n = D.default.dirname(t)
    try {
      lg.statSync(n).isDirectory() || lg.readdirSync(n)
    } catch (t) {
      if (!t || 'ENOENT' !== t.code) throw t
      Eg.mkdirsSync(n)
    }
    lg.writeFileSync(t, '')
  }
}
const ym = Vg.pathExists
var bm = {
  createLink: tg(function (t, e, n) {
    function r(t, e) {
      lg.link(t, e, (t) => {
        if (t) return n(t)
        n(null)
      })
    }
    ym(e, (i, o) =>
      i
        ? n(i)
        : o
        ? n(null)
        : void lg.lstat(t, (i) => {
            if (i) return (i.message = i.message.replace('lstat', 'ensureLink')), n(i)
            const o = D.default.dirname(e)
            ym(o, (i, u) =>
              i
                ? n(i)
                : u
                ? r(t, e)
                : void Eg.mkdirs(o, (i) => {
                    if (i) return n(i)
                    r(t, e)
                  })
            )
          })
    )
  }),
  createLinkSync: function (t, e) {
    if (lg.existsSync(e)) return
    try {
      lg.lstatSync(t)
    } catch (t) {
      throw ((t.message = t.message.replace('lstat', 'ensureLink')), t)
    }
    const n = D.default.dirname(e)
    return lg.existsSync(n) || Eg.mkdirsSync(n), lg.linkSync(t, e)
  }
}
const gm = Vg.pathExists
var mm = function (t, e, n) {
    if (D.default.isAbsolute(t))
      return lg.lstat(t, (e) =>
        e
          ? ((e.message = e.message.replace('lstat', 'ensureSymlink')), n(e))
          : n(null, { toCwd: t, toDst: t })
      )
    {
      const r = D.default.dirname(e),
        i = D.default.join(r, t)
      return gm(i, (e, o) =>
        e
          ? n(e)
          : o
          ? n(null, { toCwd: i, toDst: t })
          : lg.lstat(t, (e) =>
              e
                ? ((e.message = e.message.replace('lstat', 'ensureSymlink')), n(e))
                : n(null, { toCwd: t, toDst: D.default.relative(r, t) })
            )
      )
    }
  },
  Dm = function (t, e) {
    let n
    if (D.default.isAbsolute(t)) {
      if (((n = lg.existsSync(t)), !n)) throw new Error('absolute srcpath does not exist')
      return { toCwd: t, toDst: t }
    }
    {
      const r = D.default.dirname(e),
        i = D.default.join(r, t)
      if (((n = lg.existsSync(i)), n)) return { toCwd: i, toDst: t }
      if (((n = lg.existsSync(t)), !n)) throw new Error('relative srcpath does not exist')
      return { toCwd: t, toDst: D.default.relative(r, t) }
    }
  }
var wm = function (t, e, n) {
    if (((n = 'function' == typeof e ? e : n), (e = 'function' != typeof e && e)))
      return n(null, e)
    lg.lstat(t, (t, r) => {
      if (t) return n(null, 'file')
      ;(e = r && r.isDirectory() ? 'dir' : 'file'), n(null, e)
    })
  },
  _m = function (t, e) {
    let n
    if (e) return e
    try {
      n = lg.lstatSync(t)
    } catch {
      return 'file'
    }
    return n && n.isDirectory() ? 'dir' : 'file'
  }
const Em = tg,
  xm = Eg.mkdirs,
  Sm = Eg.mkdirsSync,
  Cm = mm,
  Fm = Dm,
  Om = wm,
  jm = _m,
  Am = Vg.pathExists
var km = {
    createSymlink: Em(function (t, e, n, r) {
      ;(r = 'function' == typeof n ? n : r),
        (n = 'function' != typeof n && n),
        Am(e, (i, o) =>
          i
            ? r(i)
            : o
            ? r(null)
            : void Cm(t, e, (i, o) => {
                if (i) return r(i)
                ;(t = o.toDst),
                  Om(o.toCwd, n, (n, i) => {
                    if (n) return r(n)
                    const o = D.default.dirname(e)
                    Am(o, (n, u) =>
                      n
                        ? r(n)
                        : u
                        ? lg.symlink(t, e, i, r)
                        : void xm(o, (n) => {
                            if (n) return r(n)
                            lg.symlink(t, e, i, r)
                          })
                    )
                  })
              })
        )
    }),
    createSymlinkSync: function (t, e, n) {
      if (lg.existsSync(e)) return
      const r = Fm(t, e)
      ;(t = r.toDst), (n = jm(r.toCwd, n))
      const i = D.default.dirname(e)
      return lg.existsSync(i) || Sm(i), lg.symlinkSync(t, e, n)
    }
  },
  Im = {
    createFile: vm.createFile,
    createFileSync: vm.createFileSync,
    ensureFile: vm.createFile,
    ensureFileSync: vm.createFileSync,
    createLink: bm.createLink,
    createLinkSync: bm.createLinkSync,
    ensureLink: bm.createLink,
    ensureLinkSync: bm.createLinkSync,
    createSymlink: km.createSymlink,
    createSymlinkSync: km.createSymlinkSync,
    ensureSymlink: km.createSymlink,
    ensureSymlinkSync: km.createSymlinkSync
  }
var Tm = {
  stringify: function (
    t,
    { EOL: e = '\n', finalEOL: n = !0, replacer: r = null, spaces: i } = {}
  ) {
    const o = n ? e : ''
    return JSON.stringify(t, r, i).replace(/\n/g, e) + o
  },
  stripBom: function (t) {
    return Buffer.isBuffer(t) && (t = t.toString('utf8')), t.replace(/^\uFEFF/, '')
  }
}
let Nm
try {
  Nm = lg
} catch (vv) {
  Nm = m.default
}
const { stringify: Bm, stripBom: Pm } = Tm
const Rm = {
  readFile: eg(async function (t, e = {}) {
    'string' == typeof e && (e = { encoding: e })
    const n = e.fs || Nm,
      r = !('throws' in e) || e.throws
    let i,
      o = await tg(n.readFile)(t, e)
    o = Pm(o)
    try {
      i = JSON.parse(o, e ? e.reviver : null)
    } catch (e) {
      if (r) throw ((e.message = `${t}: ${e.message}`), e)
      return null
    }
    return i
  }),
  readFileSync: function (t, e = {}) {
    'string' == typeof e && (e = { encoding: e })
    const n = e.fs || Nm,
      r = !('throws' in e) || e.throws
    try {
      let r = n.readFileSync(t, e)
      return (r = Pm(r)), JSON.parse(r, e.reviver)
    } catch (e) {
      if (r) throw ((e.message = `${t}: ${e.message}`), e)
      return null
    }
  },
  writeFile: eg(async function (t, e, n = {}) {
    const r = n.fs || Nm,
      i = Bm(e, n)
    await tg(r.writeFile)(t, i, n)
  }),
  writeFileSync: function (t, e, n = {}) {
    const r = n.fs || Nm,
      i = Bm(e, n)
    return r.writeFileSync(t, i, n)
  }
}
var Lm = {
  readJson: Rm.readFile,
  readJsonSync: Rm.readFileSync,
  writeJson: Rm.writeFile,
  writeJsonSync: Rm.writeFileSync
}
const Mm = Vg.pathExists
var Um = {
  outputFile: tg(function (t, e, n, r) {
    'function' == typeof n && ((r = n), (n = 'utf8'))
    const i = D.default.dirname(t)
    Mm(i, (o, u) =>
      o
        ? r(o)
        : u
        ? lg.writeFile(t, e, n, r)
        : void Eg.mkdirs(i, (i) => {
            if (i) return r(i)
            lg.writeFile(t, e, n, r)
          })
    )
  }),
  outputFileSync: function (t, ...e) {
    const n = D.default.dirname(t)
    if (lg.existsSync(n)) return lg.writeFileSync(t, ...e)
    Eg.mkdirsSync(n), lg.writeFileSync(t, ...e)
  }
}
const { stringify: Vm } = Tm,
  { outputFile: $m } = Um
var zm = async function (t, e, n = {}) {
  const r = Vm(e, n)
  await $m(t, r, n)
}
const { stringify: qm } = Tm,
  { outputFileSync: Wm } = Um
var Gm = function (t, e, n) {
  const r = qm(e, n)
  Wm(t, r, n)
}
const Km = eg
;(Lm.outputJson = Km(zm)),
  (Lm.outputJsonSync = Gm),
  (Lm.outputJSON = Lm.outputJson),
  (Lm.outputJSONSync = Lm.outputJsonSync),
  (Lm.writeJSON = Lm.writeJson),
  (Lm.writeJSONSync = Lm.writeJsonSync),
  (Lm.readJSON = Lm.readJson),
  (Lm.readJSONSync = Lm.readJsonSync)
var Ym = Lm
const Hm = Ug.copySync,
  Xm = lm.removeSync,
  Jm = Eg.mkdirpSync
function Zm(t, e, n) {
  try {
    lg.renameSync(t, e)
  } catch (r) {
    if ('EXDEV' !== r.code) throw r
    return (function (t, e, n) {
      return Hm(t, e, { overwrite: n, errorOnExist: true }), Xm(t)
    })(t, e, n)
  }
}
var Qm = {
  moveSync: function (t, e, n) {
    const r = (n = n || {}).overwrite || n.clobber || !1,
      { srcStat: i } = Tg.checkPathsSync(t, e, 'move')
    return (
      Tg.checkParentPathsSync(t, i, e, 'move'),
      Jm(D.default.dirname(e)),
      (function (t, e, n) {
        if (n) return Xm(e), Zm(t, e, n)
        if (lg.existsSync(e)) throw new Error('dest already exists.')
        return Zm(t, e, n)
      })(t, e, r)
    )
  }
}
const tD = tm.copy,
  eD = lm.remove,
  nD = Eg.mkdirp,
  rD = Vg.pathExists
function iD(t, e, n, r) {
  lg.rename(t, e, (i) =>
    i
      ? 'EXDEV' !== i.code
        ? r(i)
        : (function (t, e, n, r) {
            tD(t, e, { overwrite: n, errorOnExist: !0 }, (e) => (e ? r(e) : eD(t, r)))
          })(t, e, n, r)
      : r()
  )
}
var oD = {
    move: tg(function (t, e, n, r) {
      'function' == typeof n && ((r = n), (n = {}))
      const i = n.overwrite || n.clobber || !1
      Tg.checkPaths(t, e, 'move', (n, o) => {
        if (n) return r(n)
        const { srcStat: u } = o
        Tg.checkParentPaths(t, u, e, 'move', (n) => {
          if (n) return r(n)
          nD(D.default.dirname(e), (n) =>
            n
              ? r(n)
              : (function (t, e, n, r) {
                  if (n) return eD(e, (i) => (i ? r(i) : iD(t, e, n, r)))
                  rD(e, (i, o) =>
                    i ? r(i) : o ? r(new Error('dest already exists.')) : iD(t, e, n, r)
                  )
                })(t, e, i, r)
          )
        })
      })
    })
  },
  uD = Ft(function (t) {
    ;(t.exports = {
      ...hg,
      ...Ug,
      ...tm,
      ...dm,
      ...Im,
      ...Ym,
      ...Eg,
      ...Qm,
      ...oD,
      ...Um,
      ...Vg,
      ...lm
    }),
      Object.getOwnPropertyDescriptor(m.default, 'promises') &&
        Object.defineProperty(t.exports, 'promises', { get: () => m.default.promises })
  }),
  sD = Ft(function (t, e) {
    var n
    ;(e = t.exports = l),
      (n =
        'object' == typeof process &&
        process.env &&
        process.env.NODE_DEBUG &&
        /\bsemver\b/i.test(process.env.NODE_DEBUG)
          ? function () {
              var t = Array.prototype.slice.call(arguments, 0)
              t.unshift('SEMVER'), console.log.apply(console, t)
            }
          : function () {}),
      (e.SEMVER_SPEC_VERSION = '2.0.0')
    var r = Number.MAX_SAFE_INTEGER || 9007199254740991,
      i = (e.re = []),
      o = (e.src = []),
      u = (e.tokens = {}),
      s = 0
    function c(t) {
      u[t] = s++
    }
    c('NUMERICIDENTIFIER'),
      (o[u.NUMERICIDENTIFIER] = '0|[1-9]\\d*'),
      c('NUMERICIDENTIFIERLOOSE'),
      (o[u.NUMERICIDENTIFIERLOOSE] = '[0-9]+'),
      c('NONNUMERICIDENTIFIER'),
      (o[u.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'),
      c('MAINVERSION'),
      (o[u.MAINVERSION] =
        '(' +
        o[u.NUMERICIDENTIFIER] +
        ')\\.(' +
        o[u.NUMERICIDENTIFIER] +
        ')\\.(' +
        o[u.NUMERICIDENTIFIER] +
        ')'),
      c('MAINVERSIONLOOSE'),
      (o[u.MAINVERSIONLOOSE] =
        '(' +
        o[u.NUMERICIDENTIFIERLOOSE] +
        ')\\.(' +
        o[u.NUMERICIDENTIFIERLOOSE] +
        ')\\.(' +
        o[u.NUMERICIDENTIFIERLOOSE] +
        ')'),
      c('PRERELEASEIDENTIFIER'),
      (o[u.PRERELEASEIDENTIFIER] =
        '(?:' + o[u.NUMERICIDENTIFIER] + '|' + o[u.NONNUMERICIDENTIFIER] + ')'),
      c('PRERELEASEIDENTIFIERLOOSE'),
      (o[u.PRERELEASEIDENTIFIERLOOSE] =
        '(?:' + o[u.NUMERICIDENTIFIERLOOSE] + '|' + o[u.NONNUMERICIDENTIFIER] + ')'),
      c('PRERELEASE'),
      (o[u.PRERELEASE] =
        '(?:-(' +
        o[u.PRERELEASEIDENTIFIER] +
        '(?:\\.' +
        o[u.PRERELEASEIDENTIFIER] +
        ')*))'),
      c('PRERELEASELOOSE'),
      (o[u.PRERELEASELOOSE] =
        '(?:-?(' +
        o[u.PRERELEASEIDENTIFIERLOOSE] +
        '(?:\\.' +
        o[u.PRERELEASEIDENTIFIERLOOSE] +
        ')*))'),
      c('BUILDIDENTIFIER'),
      (o[u.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'),
      c('BUILD'),
      (o[u.BUILD] =
        '(?:\\+(' + o[u.BUILDIDENTIFIER] + '(?:\\.' + o[u.BUILDIDENTIFIER] + ')*))'),
      c('FULL'),
      c('FULLPLAIN'),
      (o[u.FULLPLAIN] =
        'v?' + o[u.MAINVERSION] + o[u.PRERELEASE] + '?' + o[u.BUILD] + '?'),
      (o[u.FULL] = '^' + o[u.FULLPLAIN] + '$'),
      c('LOOSEPLAIN'),
      (o[u.LOOSEPLAIN] =
        '[v=\\s]*' +
        o[u.MAINVERSIONLOOSE] +
        o[u.PRERELEASELOOSE] +
        '?' +
        o[u.BUILD] +
        '?'),
      c('LOOSE'),
      (o[u.LOOSE] = '^' + o[u.LOOSEPLAIN] + '$'),
      c('GTLT'),
      (o[u.GTLT] = '((?:<|>)?=?)'),
      c('XRANGEIDENTIFIERLOOSE'),
      (o[u.XRANGEIDENTIFIERLOOSE] = o[u.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'),
      c('XRANGEIDENTIFIER'),
      (o[u.XRANGEIDENTIFIER] = o[u.NUMERICIDENTIFIER] + '|x|X|\\*'),
      c('XRANGEPLAIN'),
      (o[u.XRANGEPLAIN] =
        '[v=\\s]*(' +
        o[u.XRANGEIDENTIFIER] +
        ')(?:\\.(' +
        o[u.XRANGEIDENTIFIER] +
        ')(?:\\.(' +
        o[u.XRANGEIDENTIFIER] +
        ')(?:' +
        o[u.PRERELEASE] +
        ')?' +
        o[u.BUILD] +
        '?)?)?'),
      c('XRANGEPLAINLOOSE'),
      (o[u.XRANGEPLAINLOOSE] =
        '[v=\\s]*(' +
        o[u.XRANGEIDENTIFIERLOOSE] +
        ')(?:\\.(' +
        o[u.XRANGEIDENTIFIERLOOSE] +
        ')(?:\\.(' +
        o[u.XRANGEIDENTIFIERLOOSE] +
        ')(?:' +
        o[u.PRERELEASELOOSE] +
        ')?' +
        o[u.BUILD] +
        '?)?)?'),
      c('XRANGE'),
      (o[u.XRANGE] = '^' + o[u.GTLT] + '\\s*' + o[u.XRANGEPLAIN] + '$'),
      c('XRANGELOOSE'),
      (o[u.XRANGELOOSE] = '^' + o[u.GTLT] + '\\s*' + o[u.XRANGEPLAINLOOSE] + '$'),
      c('COERCE'),
      (o[u.COERCE] =
        '(^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])'),
      c('COERCERTL'),
      (i[u.COERCERTL] = new RegExp(o[u.COERCE], 'g')),
      c('LONETILDE'),
      (o[u.LONETILDE] = '(?:~>?)'),
      c('TILDETRIM'),
      (o[u.TILDETRIM] = '(\\s*)' + o[u.LONETILDE] + '\\s+'),
      (i[u.TILDETRIM] = new RegExp(o[u.TILDETRIM], 'g'))
    c('TILDE'),
      (o[u.TILDE] = '^' + o[u.LONETILDE] + o[u.XRANGEPLAIN] + '$'),
      c('TILDELOOSE'),
      (o[u.TILDELOOSE] = '^' + o[u.LONETILDE] + o[u.XRANGEPLAINLOOSE] + '$'),
      c('LONECARET'),
      (o[u.LONECARET] = '(?:\\^)'),
      c('CARETTRIM'),
      (o[u.CARETTRIM] = '(\\s*)' + o[u.LONECARET] + '\\s+'),
      (i[u.CARETTRIM] = new RegExp(o[u.CARETTRIM], 'g'))
    c('CARET'),
      (o[u.CARET] = '^' + o[u.LONECARET] + o[u.XRANGEPLAIN] + '$'),
      c('CARETLOOSE'),
      (o[u.CARETLOOSE] = '^' + o[u.LONECARET] + o[u.XRANGEPLAINLOOSE] + '$'),
      c('COMPARATORLOOSE'),
      (o[u.COMPARATORLOOSE] = '^' + o[u.GTLT] + '\\s*(' + o[u.LOOSEPLAIN] + ')$|^$'),
      c('COMPARATOR'),
      (o[u.COMPARATOR] = '^' + o[u.GTLT] + '\\s*(' + o[u.FULLPLAIN] + ')$|^$'),
      c('COMPARATORTRIM'),
      (o[u.COMPARATORTRIM] =
        '(\\s*)' + o[u.GTLT] + '\\s*(' + o[u.LOOSEPLAIN] + '|' + o[u.XRANGEPLAIN] + ')'),
      (i[u.COMPARATORTRIM] = new RegExp(o[u.COMPARATORTRIM], 'g'))
    c('HYPHENRANGE'),
      (o[u.HYPHENRANGE] =
        '^\\s*(' + o[u.XRANGEPLAIN] + ')\\s+-\\s+(' + o[u.XRANGEPLAIN] + ')\\s*$'),
      c('HYPHENRANGELOOSE'),
      (o[u.HYPHENRANGELOOSE] =
        '^\\s*(' +
        o[u.XRANGEPLAINLOOSE] +
        ')\\s+-\\s+(' +
        o[u.XRANGEPLAINLOOSE] +
        ')\\s*$'),
      c('STAR'),
      (o[u.STAR] = '(<|>)?=?\\s*\\*')
    for (var a = 0; a < s; a++) n(a, o[a]), i[a] || (i[a] = new RegExp(o[a]))
    function f(t, e) {
      if (
        ((e && 'object' == typeof e) || (e = { loose: !!e, includePrerelease: !1 }),
        t instanceof l)
      )
        return t
      if ('string' != typeof t) return null
      if (t.length > 256) return null
      if (!(e.loose ? i[u.LOOSE] : i[u.FULL]).test(t)) return null
      try {
        return new l(t, e)
      } catch (t) {
        return null
      }
    }
    function l(t, e) {
      if (
        ((e && 'object' == typeof e) || (e = { loose: !!e, includePrerelease: !1 }),
        t instanceof l)
      ) {
        if (t.loose === e.loose) return t
        t = t.version
      } else if ('string' != typeof t) throw new TypeError('Invalid Version: ' + t)
      if (t.length > 256) throw new TypeError('version is longer than 256 characters')
      if (!(this instanceof l)) return new l(t, e)
      n('SemVer', t, e), (this.options = e), (this.loose = !!e.loose)
      var o = t.trim().match(e.loose ? i[u.LOOSE] : i[u.FULL])
      if (!o) throw new TypeError('Invalid Version: ' + t)
      if (
        ((this.raw = t),
        (this.major = +o[1]),
        (this.minor = +o[2]),
        (this.patch = +o[3]),
        this.major > r || this.major < 0)
      )
        throw new TypeError('Invalid major version')
      if (this.minor > r || this.minor < 0) throw new TypeError('Invalid minor version')
      if (this.patch > r || this.patch < 0) throw new TypeError('Invalid patch version')
      o[4]
        ? (this.prerelease = o[4].split('.').map(function (t) {
            if (/^[0-9]+$/.test(t)) {
              var e = +t
              if (e >= 0 && e < r) return e
            }
            return t
          }))
        : (this.prerelease = []),
        (this.build = o[5] ? o[5].split('.') : []),
        this.format()
    }
    ;(e.parse = f),
      (e.valid = function (t, e) {
        var n = f(t, e)
        return n ? n.version : null
      }),
      (e.clean = function (t, e) {
        var n = f(t.trim().replace(/^[=v]+/, ''), e)
        return n ? n.version : null
      }),
      (e.SemVer = l),
      (l.prototype.format = function () {
        return (
          (this.version = this.major + '.' + this.minor + '.' + this.patch),
          this.prerelease.length && (this.version += '-' + this.prerelease.join('.')),
          this.version
        )
      }),
      (l.prototype.toString = function () {
        return this.version
      }),
      (l.prototype.compare = function (t) {
        return (
          n('SemVer.compare', this.version, this.options, t),
          t instanceof l || (t = new l(t, this.options)),
          this.compareMain(t) || this.comparePre(t)
        )
      }),
      (l.prototype.compareMain = function (t) {
        return (
          t instanceof l || (t = new l(t, this.options)),
          p(this.major, t.major) || p(this.minor, t.minor) || p(this.patch, t.patch)
        )
      }),
      (l.prototype.comparePre = function (t) {
        if (
          (t instanceof l || (t = new l(t, this.options)),
          this.prerelease.length && !t.prerelease.length)
        )
          return -1
        if (!this.prerelease.length && t.prerelease.length) return 1
        if (!this.prerelease.length && !t.prerelease.length) return 0
        var e = 0
        do {
          var r = this.prerelease[e],
            i = t.prerelease[e]
          if ((n('prerelease compare', e, r, i), void 0 === r && void 0 === i)) return 0
          if (void 0 === i) return 1
          if (void 0 === r) return -1
          if (r !== i) return p(r, i)
        } while (++e)
      }),
      (l.prototype.compareBuild = function (t) {
        t instanceof l || (t = new l(t, this.options))
        var e = 0
        do {
          var r = this.build[e],
            i = t.build[e]
          if ((n('prerelease compare', e, r, i), void 0 === r && void 0 === i)) return 0
          if (void 0 === i) return 1
          if (void 0 === r) return -1
          if (r !== i) return p(r, i)
        } while (++e)
      }),
      (l.prototype.inc = function (t, e) {
        switch (t) {
          case 'premajor':
            ;(this.prerelease.length = 0),
              (this.patch = 0),
              (this.minor = 0),
              this.major++,
              this.inc('pre', e)
            break
          case 'preminor':
            ;(this.prerelease.length = 0),
              (this.patch = 0),
              this.minor++,
              this.inc('pre', e)
            break
          case 'prepatch':
            ;(this.prerelease.length = 0), this.inc('patch', e), this.inc('pre', e)
            break
          case 'prerelease':
            0 === this.prerelease.length && this.inc('patch', e), this.inc('pre', e)
            break
          case 'major':
            ;(0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length) ||
              this.major++,
              (this.minor = 0),
              (this.patch = 0),
              (this.prerelease = [])
            break
          case 'minor':
            ;(0 === this.patch && 0 !== this.prerelease.length) || this.minor++,
              (this.patch = 0),
              (this.prerelease = [])
            break
          case 'patch':
            0 === this.prerelease.length && this.patch++, (this.prerelease = [])
            break
          case 'pre':
            if (0 === this.prerelease.length) this.prerelease = [0]
            else {
              for (var n = this.prerelease.length; --n >= 0; )
                'number' == typeof this.prerelease[n] && (this.prerelease[n]++, (n = -2))
              ;-1 === n && this.prerelease.push(0)
            }
            e &&
              (this.prerelease[0] === e
                ? isNaN(this.prerelease[1]) && (this.prerelease = [e, 0])
                : (this.prerelease = [e, 0]))
            break
          default:
            throw new Error('invalid increment argument: ' + t)
        }
        return this.format(), (this.raw = this.version), this
      }),
      (e.inc = function (t, e, n, r) {
        'string' == typeof n && ((r = n), (n = void 0))
        try {
          return new l(t, n).inc(e, r).version
        } catch (t) {
          return null
        }
      }),
      (e.diff = function (t, e) {
        if (b(t, e)) return null
        var n = f(t),
          r = f(e),
          i = ''
        if (n.prerelease.length || r.prerelease.length) {
          i = 'pre'
          var o = 'prerelease'
        }
        for (var u in n)
          if (('major' === u || 'minor' === u || 'patch' === u) && n[u] !== r[u])
            return i + u
        return o
      }),
      (e.compareIdentifiers = p)
    var h = /^[0-9]+$/
    function p(t, e) {
      var n = h.test(t),
        r = h.test(e)
      return (
        n && r && ((t = +t), (e = +e)),
        t === e ? 0 : n && !r ? -1 : r && !n ? 1 : t < e ? -1 : 1
      )
    }
    function d(t, e, n) {
      return new l(t, n).compare(new l(e, n))
    }
    function v(t, e, n) {
      return d(t, e, n) > 0
    }
    function y(t, e, n) {
      return d(t, e, n) < 0
    }
    function b(t, e, n) {
      return 0 === d(t, e, n)
    }
    function g(t, e, n) {
      return 0 !== d(t, e, n)
    }
    function m(t, e, n) {
      return d(t, e, n) >= 0
    }
    function D(t, e, n) {
      return d(t, e, n) <= 0
    }
    function w(t, e, n, r) {
      switch (e) {
        case '===':
          return (
            'object' == typeof t && (t = t.version),
            'object' == typeof n && (n = n.version),
            t === n
          )
        case '!==':
          return (
            'object' == typeof t && (t = t.version),
            'object' == typeof n && (n = n.version),
            t !== n
          )
        case '':
        case '=':
        case '==':
          return b(t, n, r)
        case '!=':
          return g(t, n, r)
        case '>':
          return v(t, n, r)
        case '>=':
          return m(t, n, r)
        case '<':
          return y(t, n, r)
        case '<=':
          return D(t, n, r)
        default:
          throw new TypeError('Invalid operator: ' + e)
      }
    }
    function _(t, e) {
      if (
        ((e && 'object' == typeof e) || (e = { loose: !!e, includePrerelease: !1 }),
        t instanceof _)
      ) {
        if (t.loose === !!e.loose) return t
        t = t.value
      }
      if (!(this instanceof _)) return new _(t, e)
      n('comparator', t, e),
        (this.options = e),
        (this.loose = !!e.loose),
        this.parse(t),
        this.semver === E
          ? (this.value = '')
          : (this.value = this.operator + this.semver.version),
        n('comp', this)
    }
    ;(e.rcompareIdentifiers = function (t, e) {
      return p(e, t)
    }),
      (e.major = function (t, e) {
        return new l(t, e).major
      }),
      (e.minor = function (t, e) {
        return new l(t, e).minor
      }),
      (e.patch = function (t, e) {
        return new l(t, e).patch
      }),
      (e.compare = d),
      (e.compareLoose = function (t, e) {
        return d(t, e, !0)
      }),
      (e.compareBuild = function (t, e, n) {
        var r = new l(t, n),
          i = new l(e, n)
        return r.compare(i) || r.compareBuild(i)
      }),
      (e.rcompare = function (t, e, n) {
        return d(e, t, n)
      }),
      (e.sort = function (t, n) {
        return t.sort(function (t, r) {
          return e.compareBuild(t, r, n)
        })
      }),
      (e.rsort = function (t, n) {
        return t.sort(function (t, r) {
          return e.compareBuild(r, t, n)
        })
      }),
      (e.gt = v),
      (e.lt = y),
      (e.eq = b),
      (e.neq = g),
      (e.gte = m),
      (e.lte = D),
      (e.cmp = w),
      (e.Comparator = _)
    var E = {}
    function x(t, e) {
      if (
        ((e && 'object' == typeof e) || (e = { loose: !!e, includePrerelease: !1 }),
        t instanceof x)
      )
        return t.loose === !!e.loose && t.includePrerelease === !!e.includePrerelease
          ? t
          : new x(t.raw, e)
      if (t instanceof _) return new x(t.value, e)
      if (!(this instanceof x)) return new x(t, e)
      if (
        ((this.options = e),
        (this.loose = !!e.loose),
        (this.includePrerelease = !!e.includePrerelease),
        (this.raw = t),
        (this.set = t
          .split(/\s*\|\|\s*/)
          .map(function (t) {
            return this.parseRange(t.trim())
          }, this)
          .filter(function (t) {
            return t.length
          })),
        !this.set.length)
      )
        throw new TypeError('Invalid SemVer Range: ' + t)
      this.format()
    }
    function S(t, e) {
      for (var n = !0, r = t.slice(), i = r.pop(); n && r.length; )
        (n = r.every(function (t) {
          return i.intersects(t, e)
        })),
          (i = r.pop())
      return n
    }
    function C(t) {
      return !t || 'x' === t.toLowerCase() || '*' === t
    }
    function F(t, e, n, r, i, o, u, s, c, a, f, l, h) {
      return (
        (e = C(n)
          ? ''
          : C(r)
          ? '>=' + n + '.0.0'
          : C(i)
          ? '>=' + n + '.' + r + '.0'
          : '>=' + e) +
        ' ' +
        (s = C(c)
          ? ''
          : C(a)
          ? '<' + (+c + 1) + '.0.0'
          : C(f)
          ? '<' + c + '.' + (+a + 1) + '.0'
          : l
          ? '<=' + c + '.' + a + '.' + f + '-' + l
          : '<=' + s)
      ).trim()
    }
    function O(t, e, r) {
      for (var i = 0; i < t.length; i++) if (!t[i].test(e)) return !1
      if (e.prerelease.length && !r.includePrerelease) {
        for (i = 0; i < t.length; i++)
          if ((n(t[i].semver), t[i].semver !== E && t[i].semver.prerelease.length > 0)) {
            var o = t[i].semver
            if (o.major === e.major && o.minor === e.minor && o.patch === e.patch)
              return !0
          }
        return !1
      }
      return !0
    }
    function j(t, e, n) {
      try {
        e = new x(e, n)
      } catch (t) {
        return !1
      }
      return e.test(t)
    }
    function A(t, e, n, r) {
      var i, o, u, s, c
      switch (((t = new l(t, r)), (e = new x(e, r)), n)) {
        case '>':
          ;(i = v), (o = D), (u = y), (s = '>'), (c = '>=')
          break
        case '<':
          ;(i = y), (o = m), (u = v), (s = '<'), (c = '<=')
          break
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"')
      }
      if (j(t, e, r)) return !1
      for (var a = 0; a < e.set.length; ++a) {
        var f = e.set[a],
          h = null,
          p = null
        if (
          (f.forEach(function (t) {
            t.semver === E && (t = new _('>=0.0.0')),
              (h = h || t),
              (p = p || t),
              i(t.semver, h.semver, r) ? (h = t) : u(t.semver, p.semver, r) && (p = t)
          }),
          h.operator === s || h.operator === c)
        )
          return !1
        if ((!p.operator || p.operator === s) && o(t, p.semver)) return !1
        if (p.operator === c && u(t, p.semver)) return !1
      }
      return !0
    }
    ;(_.prototype.parse = function (t) {
      var e = this.options.loose ? i[u.COMPARATORLOOSE] : i[u.COMPARATOR],
        n = t.match(e)
      if (!n) throw new TypeError('Invalid comparator: ' + t)
      ;(this.operator = void 0 !== n[1] ? n[1] : ''),
        '=' === this.operator && (this.operator = ''),
        n[2] ? (this.semver = new l(n[2], this.options.loose)) : (this.semver = E)
    }),
      (_.prototype.toString = function () {
        return this.value
      }),
      (_.prototype.test = function (t) {
        if ((n('Comparator.test', t, this.options.loose), this.semver === E || t === E))
          return !0
        if ('string' == typeof t)
          try {
            t = new l(t, this.options)
          } catch (t) {
            return !1
          }
        return w(t, this.operator, this.semver, this.options)
      }),
      (_.prototype.intersects = function (t, e) {
        if (!(t instanceof _)) throw new TypeError('a Comparator is required')
        var n
        if (
          ((e && 'object' == typeof e) || (e = { loose: !!e, includePrerelease: !1 }),
          '' === this.operator)
        )
          return '' === this.value || ((n = new x(t.value, e)), j(this.value, n, e))
        if ('' === t.operator)
          return '' === t.value || ((n = new x(this.value, e)), j(t.semver, n, e))
        var r = !(
            ('>=' !== this.operator && '>' !== this.operator) ||
            ('>=' !== t.operator && '>' !== t.operator)
          ),
          i = !(
            ('<=' !== this.operator && '<' !== this.operator) ||
            ('<=' !== t.operator && '<' !== t.operator)
          ),
          o = this.semver.version === t.semver.version,
          u = !(
            ('>=' !== this.operator && '<=' !== this.operator) ||
            ('>=' !== t.operator && '<=' !== t.operator)
          ),
          s =
            w(this.semver, '<', t.semver, e) &&
            ('>=' === this.operator || '>' === this.operator) &&
            ('<=' === t.operator || '<' === t.operator),
          c =
            w(this.semver, '>', t.semver, e) &&
            ('<=' === this.operator || '<' === this.operator) &&
            ('>=' === t.operator || '>' === t.operator)
        return r || i || (o && u) || s || c
      }),
      (e.Range = x),
      (x.prototype.format = function () {
        return (
          (this.range = this.set
            .map(function (t) {
              return t.join(' ').trim()
            })
            .join('||')
            .trim()),
          this.range
        )
      }),
      (x.prototype.toString = function () {
        return this.range
      }),
      (x.prototype.parseRange = function (t) {
        var e = this.options.loose
        t = t.trim()
        var r = e ? i[u.HYPHENRANGELOOSE] : i[u.HYPHENRANGE]
        ;(t = t.replace(r, F)),
          n('hyphen replace', t),
          (t = t.replace(i[u.COMPARATORTRIM], '$1$2$3')),
          n('comparator trim', t, i[u.COMPARATORTRIM]),
          (t = (t = (t = t.replace(i[u.TILDETRIM], '$1~')).replace(i[u.CARETTRIM], '$1^'))
            .split(/\s+/)
            .join(' '))
        var o = e ? i[u.COMPARATORLOOSE] : i[u.COMPARATOR],
          s = t
            .split(' ')
            .map(function (t) {
              return (function (t, e) {
                return (
                  n('comp', t, e),
                  (t = (function (t, e) {
                    return t
                      .trim()
                      .split(/\s+/)
                      .map(function (t) {
                        return (function (t, e) {
                          n('caret', t, e)
                          var r = e.loose ? i[u.CARETLOOSE] : i[u.CARET]
                          return t.replace(r, function (e, r, i, o, u) {
                            var s
                            return (
                              n('caret', t, e, r, i, o, u),
                              C(r)
                                ? (s = '')
                                : C(i)
                                ? (s = '>=' + r + '.0.0 <' + (+r + 1) + '.0.0')
                                : C(o)
                                ? (s =
                                    '0' === r
                                      ? '>=' +
                                        r +
                                        '.' +
                                        i +
                                        '.0 <' +
                                        r +
                                        '.' +
                                        (+i + 1) +
                                        '.0'
                                      : '>=' + r + '.' + i + '.0 <' + (+r + 1) + '.0.0')
                                : u
                                ? (n('replaceCaret pr', u),
                                  (s =
                                    '0' === r
                                      ? '0' === i
                                        ? '>=' +
                                          r +
                                          '.' +
                                          i +
                                          '.' +
                                          o +
                                          '-' +
                                          u +
                                          ' <' +
                                          r +
                                          '.' +
                                          i +
                                          '.' +
                                          (+o + 1)
                                        : '>=' +
                                          r +
                                          '.' +
                                          i +
                                          '.' +
                                          o +
                                          '-' +
                                          u +
                                          ' <' +
                                          r +
                                          '.' +
                                          (+i + 1) +
                                          '.0'
                                      : '>=' +
                                        r +
                                        '.' +
                                        i +
                                        '.' +
                                        o +
                                        '-' +
                                        u +
                                        ' <' +
                                        (+r + 1) +
                                        '.0.0'))
                                : (n('no pr'),
                                  (s =
                                    '0' === r
                                      ? '0' === i
                                        ? '>=' +
                                          r +
                                          '.' +
                                          i +
                                          '.' +
                                          o +
                                          ' <' +
                                          r +
                                          '.' +
                                          i +
                                          '.' +
                                          (+o + 1)
                                        : '>=' +
                                          r +
                                          '.' +
                                          i +
                                          '.' +
                                          o +
                                          ' <' +
                                          r +
                                          '.' +
                                          (+i + 1) +
                                          '.0'
                                      : '>=' +
                                        r +
                                        '.' +
                                        i +
                                        '.' +
                                        o +
                                        ' <' +
                                        (+r + 1) +
                                        '.0.0')),
                              n('caret return', s),
                              s
                            )
                          })
                        })(t, e)
                      })
                      .join(' ')
                  })(t, e)),
                  n('caret', t),
                  (t = (function (t, e) {
                    return t
                      .trim()
                      .split(/\s+/)
                      .map(function (t) {
                        return (function (t, e) {
                          var r = e.loose ? i[u.TILDELOOSE] : i[u.TILDE]
                          return t.replace(r, function (e, r, i, o, u) {
                            var s
                            return (
                              n('tilde', t, e, r, i, o, u),
                              C(r)
                                ? (s = '')
                                : C(i)
                                ? (s = '>=' + r + '.0.0 <' + (+r + 1) + '.0.0')
                                : C(o)
                                ? (s =
                                    '>=' +
                                    r +
                                    '.' +
                                    i +
                                    '.0 <' +
                                    r +
                                    '.' +
                                    (+i + 1) +
                                    '.0')
                                : u
                                ? (n('replaceTilde pr', u),
                                  (s =
                                    '>=' +
                                    r +
                                    '.' +
                                    i +
                                    '.' +
                                    o +
                                    '-' +
                                    u +
                                    ' <' +
                                    r +
                                    '.' +
                                    (+i + 1) +
                                    '.0'))
                                : (s =
                                    '>=' +
                                    r +
                                    '.' +
                                    i +
                                    '.' +
                                    o +
                                    ' <' +
                                    r +
                                    '.' +
                                    (+i + 1) +
                                    '.0'),
                              n('tilde return', s),
                              s
                            )
                          })
                        })(t, e)
                      })
                      .join(' ')
                  })(t, e)),
                  n('tildes', t),
                  (t = (function (t, e) {
                    return (
                      n('replaceXRanges', t, e),
                      t
                        .split(/\s+/)
                        .map(function (t) {
                          return (function (t, e) {
                            t = t.trim()
                            var r = e.loose ? i[u.XRANGELOOSE] : i[u.XRANGE]
                            return t.replace(r, function (r, i, o, u, s, c) {
                              n('xRange', t, r, i, o, u, s, c)
                              var a = C(o),
                                f = a || C(u),
                                l = f || C(s),
                                h = l
                              return (
                                '=' === i && h && (i = ''),
                                (c = e.includePrerelease ? '-0' : ''),
                                a
                                  ? (r = '>' === i || '<' === i ? '<0.0.0-0' : '*')
                                  : i && h
                                  ? (f && (u = 0),
                                    (s = 0),
                                    '>' === i
                                      ? ((i = '>='),
                                        f
                                          ? ((o = +o + 1), (u = 0), (s = 0))
                                          : ((u = +u + 1), (s = 0)))
                                      : '<=' === i &&
                                        ((i = '<'), f ? (o = +o + 1) : (u = +u + 1)),
                                    (r = i + o + '.' + u + '.' + s + c))
                                  : f
                                  ? (r =
                                      '>=' +
                                      o +
                                      '.0.0' +
                                      c +
                                      ' <' +
                                      (+o + 1) +
                                      '.0.0' +
                                      c)
                                  : l &&
                                    (r =
                                      '>=' +
                                      o +
                                      '.' +
                                      u +
                                      '.0' +
                                      c +
                                      ' <' +
                                      o +
                                      '.' +
                                      (+u + 1) +
                                      '.0' +
                                      c),
                                n('xRange return', r),
                                r
                              )
                            })
                          })(t, e)
                        })
                        .join(' ')
                    )
                  })(t, e)),
                  n('xrange', t),
                  (t = (function (t, e) {
                    return n('replaceStars', t, e), t.trim().replace(i[u.STAR], '')
                  })(t, e)),
                  n('stars', t),
                  t
                )
              })(t, this.options)
            }, this)
            .join(' ')
            .split(/\s+/)
        return (
          this.options.loose &&
            (s = s.filter(function (t) {
              return !!t.match(o)
            })),
          (s = s.map(function (t) {
            return new _(t, this.options)
          }, this))
        )
      }),
      (x.prototype.intersects = function (t, e) {
        if (!(t instanceof x)) throw new TypeError('a Range is required')
        return this.set.some(function (n) {
          return (
            S(n, e) &&
            t.set.some(function (t) {
              return (
                S(t, e) &&
                n.every(function (n) {
                  return t.every(function (t) {
                    return n.intersects(t, e)
                  })
                })
              )
            })
          )
        })
      }),
      (e.toComparators = function (t, e) {
        return new x(t, e).set.map(function (t) {
          return t
            .map(function (t) {
              return t.value
            })
            .join(' ')
            .trim()
            .split(' ')
        })
      }),
      (x.prototype.test = function (t) {
        if (!t) return !1
        if ('string' == typeof t)
          try {
            t = new l(t, this.options)
          } catch (t) {
            return !1
          }
        for (var e = 0; e < this.set.length; e++)
          if (O(this.set[e], t, this.options)) return !0
        return !1
      }),
      (e.satisfies = j),
      (e.maxSatisfying = function (t, e, n) {
        var r = null,
          i = null
        try {
          var o = new x(e, n)
        } catch (t) {
          return null
        }
        return (
          t.forEach(function (t) {
            o.test(t) && ((r && -1 !== i.compare(t)) || (i = new l((r = t), n)))
          }),
          r
        )
      }),
      (e.minSatisfying = function (t, e, n) {
        var r = null,
          i = null
        try {
          var o = new x(e, n)
        } catch (t) {
          return null
        }
        return (
          t.forEach(function (t) {
            o.test(t) && ((r && 1 !== i.compare(t)) || (i = new l((r = t), n)))
          }),
          r
        )
      }),
      (e.minVersion = function (t, e) {
        t = new x(t, e)
        var n = new l('0.0.0')
        if (t.test(n)) return n
        if (((n = new l('0.0.0-0')), t.test(n))) return n
        n = null
        for (var r = 0; r < t.set.length; ++r) {
          t.set[r].forEach(function (t) {
            var e = new l(t.semver.version)
            switch (t.operator) {
              case '>':
                0 === e.prerelease.length ? e.patch++ : e.prerelease.push(0),
                  (e.raw = e.format())
              case '':
              case '>=':
                ;(n && !v(n, e)) || (n = e)
                break
              case '<':
              case '<=':
                break
              default:
                throw new Error('Unexpected operation: ' + t.operator)
            }
          })
        }
        if (n && t.test(n)) return n
        return null
      }),
      (e.validRange = function (t, e) {
        try {
          return new x(t, e).range || '*'
        } catch (t) {
          return null
        }
      }),
      (e.ltr = function (t, e, n) {
        return A(t, e, '<', n)
      }),
      (e.gtr = function (t, e, n) {
        return A(t, e, '>', n)
      }),
      (e.outside = A),
      (e.prerelease = function (t, e) {
        var n = f(t, e)
        return n && n.prerelease.length ? n.prerelease : null
      }),
      (e.intersects = function (t, e, n) {
        return (t = new x(t, n)), (e = new x(e, n)), t.intersects(e)
      }),
      (e.coerce = function (t, e) {
        if (t instanceof l) return t
        'number' == typeof t && (t = String(t))
        if ('string' != typeof t) return null
        var n = null
        if ((e = e || {}).rtl) {
          for (
            var r;
            (r = i[u.COERCERTL].exec(t)) && (!n || n.index + n[0].length !== t.length);

          )
            (n && r.index + r[0].length === n.index + n[0].length) || (n = r),
              (i[u.COERCERTL].lastIndex = r.index + r[1].length + r[2].length)
          i[u.COERCERTL].lastIndex = -1
        } else n = t.match(i[u.COERCE])
        if (null === n) return null
        return f(n[2] + '.' + (n[3] || '0') + '.' + (n[4] || '0'), e)
      })
  })
const { promisify: cD } = w.default,
  aD = sD.satisfies(process.version, '>=10.12.0'),
  fD = (t) => {
    if ('win32' === process.platform) {
      if (/[<>:"|?*]/.test(t.replace(D.default.parse(t).root, ''))) {
        const e = new Error(`Path contains invalid characters: ${t}`)
        throw ((e.code = 'EINVAL'), e)
      }
    }
  },
  lD = (t) => ({ ...{ mode: 511, fs: m.default }, ...t }),
  hD = (t) => {
    const e = new Error(`operation not permitted, mkdir '${t}'`)
    return (e.code = 'EPERM'), (e.errno = -4048), (e.path = t), (e.syscall = 'mkdir'), e
  }
var pD = async (t, e) => {
  fD(t), (e = lD(e))
  const n = cD(e.fs.mkdir),
    r = cD(e.fs.stat)
  if (aD && e.fs.mkdir === m.default.mkdir) {
    const r = D.default.resolve(t)
    return await n(r, { mode: e.mode, recursive: !0 }), r
  }
  const i = async (t) => {
    try {
      return await n(t, e.mode), t
    } catch (e) {
      if ('EPERM' === e.code) throw e
      if ('ENOENT' === e.code) {
        if (D.default.dirname(t) === t) throw hD(t)
        if (e.message.includes('null bytes')) throw e
        return await i(D.default.dirname(t)), i(t)
      }
      try {
        if (!(await r(t)).isDirectory()) throw new Error('The path is not a directory')
      } catch (t) {
        throw e
      }
      return t
    }
  }
  return i(D.default.resolve(t))
}
pD.sync = (t, e) => {
  if ((fD(t), (e = lD(e)), aD && e.fs.mkdirSync === m.default.mkdirSync)) {
    const n = D.default.resolve(t)
    return m.default.mkdirSync(n, { mode: e.mode, recursive: !0 }), n
  }
  const n = (t) => {
    try {
      e.fs.mkdirSync(t, e.mode)
    } catch (r) {
      if ('EPERM' === r.code) throw r
      if ('ENOENT' === r.code) {
        if (D.default.dirname(t) === t) throw hD(t)
        if (r.message.includes('null bytes')) throw r
        return n(D.default.dirname(t)), n(t)
      }
      try {
        if (!e.fs.statSync(t).isDirectory())
          throw new Error('The path is not a directory')
      } catch (t) {
        throw r
      }
    }
    return t
  }
  return n(D.default.resolve(t))
}
var dD = function () {
    var t = Error.prepareStackTrace
    Error.prepareStackTrace = function (t, e) {
      return e
    }
    var e = new Error().stack
    return (Error.prepareStackTrace = t), e[2].getFileName()
  },
  vD = Ft(function (t) {
    var e = 'win32' === process.platform,
      n = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/,
      r = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/,
      i = {}
    i.parse = function (t) {
      if ('string' != typeof t)
        throw new TypeError("Parameter 'pathString' must be a string, not " + typeof t)
      var e,
        i,
        o,
        u,
        s,
        c =
          ((e = t),
          (i = n.exec(e)),
          (o = (i[1] || '') + (i[2] || '')),
          (u = i[3] || ''),
          (s = r.exec(u)),
          [o, s[1], s[2], s[3]])
      if (!c || 4 !== c.length) throw new TypeError("Invalid path '" + t + "'")
      return {
        root: c[0],
        dir: c[0] + c[1].slice(0, -1),
        base: c[2],
        ext: c[3],
        name: c[2].slice(0, c[2].length - c[3].length)
      }
    }
    var o = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
      u = {}
    ;(u.parse = function (t) {
      if ('string' != typeof t)
        throw new TypeError("Parameter 'pathString' must be a string, not " + typeof t)
      var e,
        n = ((e = t), o.exec(e).slice(1))
      if (!n || 4 !== n.length) throw new TypeError("Invalid path '" + t + "'")
      return (
        (n[1] = n[1] || ''),
        (n[2] = n[2] || ''),
        (n[3] = n[3] || ''),
        {
          root: n[0],
          dir: n[0] + n[1].slice(0, -1),
          base: n[2],
          ext: n[3],
          name: n[2].slice(0, n[2].length - n[3].length)
        }
      )
    }),
      (t.exports = e ? i.parse : u.parse),
      (t.exports.posix = u.parse),
      (t.exports.win32 = i.parse)
  }),
  yD = D.default.parse || vD,
  bD = function (t, e) {
    var n = '/'
    ;/^([A-Za-z]:)/.test(t) ? (n = '') : /^\\\\/.test(t) && (n = '\\\\')
    for (var r = [t], i = yD(t); i.dir !== r[r.length - 1]; )
      r.push(i.dir), (i = yD(i.dir))
    return r.reduce(function (t, r) {
      return t.concat(
        e.map(function (t) {
          return D.default.resolve(n, r, t)
        })
      )
    }, [])
  },
  gD = function (t, e, n) {
    var r = e && e.moduleDirectory ? [].concat(e.moduleDirectory) : ['node_modules']
    if (e && 'function' == typeof e.paths)
      return e.paths(
        n,
        t,
        function () {
          return bD(t, r)
        },
        e
      )
    var i = bD(t, r)
    return e && e.paths ? i.concat(e.paths) : i
  },
  mD = function (t, e) {
    return e || {}
  },
  DD = 'Function.prototype.bind called on incompatible ',
  wD = Array.prototype.slice,
  _D = Object.prototype.toString,
  ED = (
    Function.prototype.bind ||
    function (t) {
      var e = this
      if ('function' != typeof e || '[object Function]' !== _D.call(e))
        throw new TypeError(DD + e)
      for (
        var n,
          r = wD.call(arguments, 1),
          i = function () {
            if (this instanceof n) {
              var i = e.apply(this, r.concat(wD.call(arguments)))
              return Object(i) === i ? i : this
            }
            return e.apply(t, r.concat(wD.call(arguments)))
          },
          o = Math.max(0, e.length - r.length),
          u = [],
          s = 0;
        s < o;
        s++
      )
        u.push('$' + s)
      if (
        ((n = Function(
          'binder',
          'return function (' + u.join(',') + '){ return binder.apply(this,arguments); }'
        )(i)),
        e.prototype)
      ) {
        var c = function () {}
        ;(c.prototype = e.prototype), (n.prototype = new c()), (c.prototype = null)
      }
      return n
    }
  ).call(Function.call, Object.prototype.hasOwnProperty),
  xD = {
    assert: !0,
    'assert/strict': '>= 15',
    async_hooks: '>= 8',
    buffer_ieee754: '< 0.9.7',
    buffer: !0,
    child_process: !0,
    cluster: !0,
    console: !0,
    constants: !0,
    crypto: !0,
    _debug_agent: '>= 1 && < 8',
    _debugger: '< 8',
    dgram: !0,
    diagnostics_channel: '>= 15.1',
    dns: !0,
    'dns/promises': '>= 15',
    domain: '>= 0.7.12',
    events: !0,
    freelist: '< 6',
    fs: !0,
    'fs/promises': ['>= 10 && < 10.1', '>= 14'],
    _http_agent: '>= 0.11.1',
    _http_client: '>= 0.11.1',
    _http_common: '>= 0.11.1',
    _http_incoming: '>= 0.11.1',
    _http_outgoing: '>= 0.11.1',
    _http_server: '>= 0.11.1',
    http: !0,
    http2: '>= 8.8',
    https: !0,
    inspector: '>= 8.0.0',
    _linklist: '< 8',
    module: !0,
    net: !0,
    'node-inspect/lib/_inspect': '>= 7.6.0 && < 12',
    'node-inspect/lib/internal/inspect_client': '>= 7.6.0 && < 12',
    'node-inspect/lib/internal/inspect_repl': '>= 7.6.0 && < 12',
    os: !0,
    path: !0,
    'path/posix': '>= 15.3',
    'path/win32': '>= 15.3',
    perf_hooks: '>= 8.5',
    process: '>= 1',
    punycode: !0,
    querystring: !0,
    readline: !0,
    repl: !0,
    smalloc: '>= 0.11.5 && < 3',
    _stream_duplex: '>= 0.9.4',
    _stream_transform: '>= 0.9.4',
    _stream_wrap: '>= 1.4.1',
    _stream_passthrough: '>= 0.9.4',
    _stream_readable: '>= 0.9.4',
    _stream_writable: '>= 0.9.4',
    stream: !0,
    'stream/promises': '>= 15',
    string_decoder: !0,
    sys: ['>= 0.6 && < 0.7', '>= 0.8'],
    timers: !0,
    'timers/promises': '>= 15',
    _tls_common: '>= 0.11.13',
    _tls_legacy: '>= 0.11.3 && < 10',
    _tls_wrap: '>= 0.11.3',
    tls: !0,
    trace_events: '>= 10',
    tty: !0,
    url: !0,
    util: !0,
    'util/types': '>= 15.3',
    'v8/tools/arguments': '>= 10 && < 12',
    'v8/tools/codemap': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/consarray': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/csvparser': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/logreader': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/profile_view': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/splaytree': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    v8: '>= 1',
    vm: !0,
    wasi: '>= 13.4 && < 13.5',
    worker_threads: '>= 11.7',
    zlib: !0
  }
function SD(t, e) {
  for (
    var n = t.split('.'),
      r = e.split(' '),
      i = r.length > 1 ? r[0] : '=',
      o = (r.length > 1 ? r[1] : r[0]).split('.'),
      u = 0;
    u < 3;
    ++u
  ) {
    var s = parseInt(n[u] || 0, 10),
      c = parseInt(o[u] || 0, 10)
    if (s !== c) return '<' === i ? s < c : '>=' === i && s >= c
  }
  return '>=' === i
}
function CD(t, e) {
  var n = e.split(/ ?&& ?/)
  if (0 === n.length) return !1
  for (var r = 0; r < n.length; ++r) if (!SD(t, n[r])) return !1
  return !0
}
var FD = function (t, e) {
    return (
      ED(xD, t) &&
      (function (t, e) {
        if ('boolean' == typeof e) return e
        var n =
          void 0 === t
            ? process.versions && process.versions.node && process.versions.node
            : t
        if ('string' != typeof n)
          throw new TypeError(
            void 0 === t
              ? 'Unable to determine current node version'
              : 'If provided, a valid node version is required'
          )
        if (e && 'object' == typeof e) {
          for (var r = 0; r < e.length; ++r) if (CD(n, e[r])) return !0
          return !1
        }
        return CD(n, e)
      })(e, xD[t])
    )
  },
  OD =
    m.default.realpath && 'function' == typeof m.default.realpath.native
      ? m.default.realpath.native
      : m.default.realpath,
  jD = function (t, e) {
    m.default.stat(t, function (t, n) {
      return t
        ? 'ENOENT' === t.code || 'ENOTDIR' === t.code
          ? e(null, !1)
          : e(t)
        : e(null, n.isFile() || n.isFIFO())
    })
  },
  AD = function (t, e) {
    m.default.stat(t, function (t, n) {
      return t
        ? 'ENOENT' === t.code || 'ENOTDIR' === t.code
          ? e(null, !1)
          : e(t)
        : e(null, n.isDirectory())
    })
  },
  kD = function (t, e) {
    OD(t, function (n, r) {
      n && 'ENOENT' !== n.code ? e(n) : e(null, n ? t : r)
    })
  },
  ID = function (t, e, n, r) {
    n && !1 === n.preserveSymlinks ? t(e, r) : r(null, e)
  },
  TD = function (t, e, n) {
    t(e, function (t, e) {
      if (t) n(t)
      else
        try {
          var r = JSON.parse(e)
          n(null, r)
        } catch (t) {
          n(null)
        }
    })
  },
  ND = function (t, e, n) {
    var r = n,
      i = e
    if (('function' == typeof e && ((r = i), (i = {})), 'string' != typeof t)) {
      var o = new TypeError('Path must be a string.')
      return process.nextTick(function () {
        r(o)
      })
    }
    var u = (i = mD(0, i)).isFile || jD,
      s = i.isDirectory || AD,
      c = i.readFile || m.default.readFile,
      a = i.realpath || kD,
      f = i.readPackage || TD
    if (i.readFile && i.readPackage) {
      var l = new TypeError('`readFile` and `readPackage` are mutually exclusive.')
      return process.nextTick(function () {
        r(l)
      })
    }
    var h = i.packageIterator,
      p = i.extensions || ['.js'],
      d = !1 !== i.includeCoreModules,
      v = i.basedir || D.default.dirname(dD()),
      y = i.filename || v
    i.paths = i.paths || []
    var b,
      g = D.default.resolve(v)
    function w(e, n, o) {
      e
        ? r(e)
        : n
        ? r(null, n, o)
        : x(b, function (e, n, o) {
            if (e) r(e)
            else if (n)
              ID(a, n, i, function (t, e) {
                t ? r(t) : r(null, e, o)
              })
            else {
              var u = new Error("Cannot find module '" + t + "' from '" + y + "'")
              ;(u.code = 'MODULE_NOT_FOUND'), r(u)
            }
          })
    }
    function _(t, e, n) {
      var r = e,
        o = n
      'function' == typeof r && ((o = r), (r = void 0)),
        (function t(e, n, r) {
          if (0 === e.length) return o(null, void 0, r)
          var s = n + e[0],
            c = r
          c ? a(null, c) : E(D.default.dirname(s), a)
          function a(r, a, l) {
            if (((c = a), r)) return o(r)
            if (l && c && i.pathFilter) {
              var h = D.default.relative(l, s),
                d = h.slice(0, h.length - e[0].length),
                v = i.pathFilter(c, n, d)
              if (v) return t([''].concat(p.slice()), D.default.resolve(l, v), c)
            }
            u(s, f)
          }
          function f(r, i) {
            return r ? o(r) : i ? o(null, s, c) : void t(e.slice(1), n, c)
          }
        })([''].concat(p), t, r)
    }
    function E(t, e) {
      return '' === t ||
        '/' === t ||
        ('win32' === process.platform && /^\w:[/\\]*$/.test(t)) ||
        /[/\\]node_modules[/\\]*$/.test(t)
        ? e(null)
        : void ID(a, t, i, function (n, r) {
            if (n) return E(D.default.dirname(t), e)
            var o = D.default.join(r, 'package.json')
            u(o, function (n, r) {
              if (!r) return E(D.default.dirname(t), e)
              f(c, o, function (n, r) {
                n && e(n)
                var u = r
                u && i.packageFilter && (u = i.packageFilter(u, o)), e(null, u, t)
              })
            })
          })
    }
    function x(t, e, n) {
      var r = n,
        o = e
      'function' == typeof o && ((r = o), (o = i.package)),
        ID(a, t, i, function (e, n) {
          if (e) return r(e)
          var s = D.default.join(n, 'package.json')
          u(s, function (e, n) {
            return e
              ? r(e)
              : n
              ? void f(c, s, function (e, n) {
                  if (e) return r(e)
                  var o = n
                  if (
                    (o && i.packageFilter && (o = i.packageFilter(o, s)), o && o.main)
                  ) {
                    if ('string' != typeof o.main) {
                      var u = new TypeError(
                        'package “' + o.name + '” `main` must be a string'
                      )
                      return (u.code = 'INVALID_PACKAGE_MAIN'), r(u)
                    }
                    return (
                      ('.' !== o.main && './' !== o.main) || (o.main = 'index'),
                      void _(D.default.resolve(t, o.main), o, function (e, n, i) {
                        return e
                          ? r(e)
                          : n
                          ? r(null, n, i)
                          : i
                          ? void x(D.default.resolve(t, i.main), i, function (e, n, i) {
                              return e
                                ? r(e)
                                : n
                                ? r(null, n, i)
                                : void _(D.default.join(t, 'index'), i, r)
                            })
                          : _(D.default.join(t, 'index'), i, r)
                      })
                    )
                  }
                  _(D.default.join(t, '/index'), o, r)
                })
              : _(D.default.join(t, 'index'), o, r)
          })
        })
    }
    function S(t, e) {
      if (0 === e.length) return t(null, void 0)
      var n = e[0]
      function r(e, r, u) {
        return e ? t(e) : r ? t(null, r, u) : void x(n, i.package, o)
      }
      function o(n, r, i) {
        return n ? t(n) : r ? t(null, r, i) : void S(t, e.slice(1))
      }
      s(D.default.dirname(n), function (o, u) {
        if (o) return t(o)
        if (!u) return S(t, e.slice(1))
        _(n, i.package, r)
      })
    }
    ID(a, g, i, function (e, n) {
      e
        ? r(e)
        : (function (e) {
            if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(t))
              (b = D.default.resolve(e, t)),
                ('.' !== t && '..' !== t && '/' !== t.slice(-1)) || (b += '/'),
                /\/$/.test(t) && b === e ? x(b, i.package, w) : _(b, i.package, w)
            else {
              if (d && FD(t)) return r(null, t)
              !(function (t, e, n) {
                var r = function () {
                  return (function (t, e, n) {
                    for (var r = gD(e, n, t), i = 0; i < r.length; i++)
                      r[i] = D.default.join(r[i], t)
                    return r
                  })(t, e, i)
                }
                S(n, h ? h(t, e, r, i) : r())
              })(t, e, function (e, n, o) {
                if (e) r(e)
                else {
                  if (n)
                    return ID(a, n, i, function (t, e) {
                      t ? r(t) : r(null, e, o)
                    })
                  var u = new Error("Cannot find module '" + t + "' from '" + y + "'")
                  ;(u.code = 'MODULE_NOT_FOUND'), r(u)
                }
              })
            }
          })(n)
    })
  },
  BD = {
    assert: !0,
    'assert/strict': '>= 15',
    async_hooks: '>= 8',
    buffer_ieee754: '< 0.9.7',
    buffer: !0,
    child_process: !0,
    cluster: !0,
    console: !0,
    constants: !0,
    crypto: !0,
    _debug_agent: '>= 1 && < 8',
    _debugger: '< 8',
    dgram: !0,
    diagnostics_channel: '>= 15.1',
    dns: !0,
    'dns/promises': '>= 15',
    domain: '>= 0.7.12',
    events: !0,
    freelist: '< 6',
    fs: !0,
    'fs/promises': ['>= 10 && < 10.1', '>= 14'],
    _http_agent: '>= 0.11.1',
    _http_client: '>= 0.11.1',
    _http_common: '>= 0.11.1',
    _http_incoming: '>= 0.11.1',
    _http_outgoing: '>= 0.11.1',
    _http_server: '>= 0.11.1',
    http: !0,
    http2: '>= 8.8',
    https: !0,
    inspector: '>= 8.0.0',
    _linklist: '< 8',
    module: !0,
    net: !0,
    'node-inspect/lib/_inspect': '>= 7.6.0 && < 12',
    'node-inspect/lib/internal/inspect_client': '>= 7.6.0 && < 12',
    'node-inspect/lib/internal/inspect_repl': '>= 7.6.0 && < 12',
    os: !0,
    path: !0,
    'path/posix': '>= 15.3',
    'path/win32': '>= 15.3',
    perf_hooks: '>= 8.5',
    process: '>= 1',
    punycode: !0,
    querystring: !0,
    readline: !0,
    repl: !0,
    smalloc: '>= 0.11.5 && < 3',
    _stream_duplex: '>= 0.9.4',
    _stream_transform: '>= 0.9.4',
    _stream_wrap: '>= 1.4.1',
    _stream_passthrough: '>= 0.9.4',
    _stream_readable: '>= 0.9.4',
    _stream_writable: '>= 0.9.4',
    stream: !0,
    'stream/promises': '>= 15',
    string_decoder: !0,
    sys: ['>= 0.6 && < 0.7', '>= 0.8'],
    timers: !0,
    'timers/promises': '>= 15',
    _tls_common: '>= 0.11.13',
    _tls_legacy: '>= 0.11.3 && < 10',
    _tls_wrap: '>= 0.11.3',
    tls: !0,
    trace_events: '>= 10',
    tty: !0,
    url: !0,
    util: !0,
    'util/types': '>= 15.3',
    'v8/tools/arguments': '>= 10 && < 12',
    'v8/tools/codemap': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/consarray': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/csvparser': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/logreader': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/profile_view': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    'v8/tools/splaytree': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
    v8: '>= 1',
    vm: !0,
    wasi: '>= 13.4 && < 13.5',
    worker_threads: '>= 11.7',
    zlib: !0
  },
  PD =
    (process.versions && process.versions.node && process.versions.node.split('.')) || []
function RD(t) {
  for (
    var e = t.split(' '),
      n = e.length > 1 ? e[0] : '=',
      r = (e.length > 1 ? e[1] : e[0]).split('.'),
      i = 0;
    i < 3;
    ++i
  ) {
    var o = parseInt(PD[i] || 0, 10),
      u = parseInt(r[i] || 0, 10)
    if (o !== u) return '<' === n ? o < u : '>=' === n && o >= u
  }
  return '>=' === n
}
function LD(t) {
  var e = t.split(/ ?&& ?/)
  if (0 === e.length) return !1
  for (var n = 0; n < e.length; ++n) if (!RD(e[n])) return !1
  return !0
}
function MD(t) {
  if ('boolean' == typeof t) return t
  if (t && 'object' == typeof t) {
    for (var e = 0; e < t.length; ++e) if (LD(t[e])) return !0
    return !1
  }
  return LD(t)
}
var UD = {}
for (var VD in BD) Object.prototype.hasOwnProperty.call(BD, VD) && (UD[VD] = MD(BD[VD]))
var $D = UD,
  zD =
    m.default.realpathSync && 'function' == typeof m.default.realpathSync.native
      ? m.default.realpathSync.native
      : m.default.realpathSync,
  qD = function (t) {
    try {
      var e = m.default.statSync(t)
    } catch (t) {
      if (t && ('ENOENT' === t.code || 'ENOTDIR' === t.code)) return !1
      throw t
    }
    return e.isFile() || e.isFIFO()
  },
  WD = function (t) {
    try {
      var e = m.default.statSync(t)
    } catch (t) {
      if (t && ('ENOENT' === t.code || 'ENOTDIR' === t.code)) return !1
      throw t
    }
    return e.isDirectory()
  },
  GD = function (t) {
    try {
      return zD(t)
    } catch (t) {
      if ('ENOENT' !== t.code) throw t
    }
    return t
  },
  KD = function (t, e, n) {
    return n && !1 === n.preserveSymlinks ? t(e) : e
  },
  YD = function (t, e) {
    var n = t(e)
    try {
      return JSON.parse(n)
    } catch (t) {}
  }
;(ND.core = $D),
  (ND.isCore = function (t) {
    return FD(t)
  }),
  (ND.sync = function (t, e) {
    if ('string' != typeof t) throw new TypeError('Path must be a string.')
    var n = mD(0, e),
      r = n.isFile || qD,
      i = n.readFileSync || m.default.readFileSync,
      o = n.isDirectory || WD,
      u = n.realpathSync || GD,
      s = n.readPackageSync || YD
    if (n.readFileSync && n.readPackageSync)
      throw new TypeError('`readFileSync` and `readPackageSync` are mutually exclusive.')
    var c = n.packageIterator,
      a = n.extensions || ['.js'],
      f = !1 !== n.includeCoreModules,
      l = n.basedir || D.default.dirname(dD()),
      h = n.filename || l
    n.paths = n.paths || []
    var p = KD(u, D.default.resolve(l), n)
    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(t)) {
      var d = D.default.resolve(p, t)
      ;('.' !== t && '..' !== t && '/' !== t.slice(-1)) || (d += '/')
      var v = g(d) || _(d)
      if (v) return KD(u, v, n)
    } else {
      if (f && FD(t)) return t
      var y = (function (t, e) {
        for (
          var r = function () {
              return (function (t, e, n) {
                for (var r = gD(e, n, t), i = 0; i < r.length; i++)
                  r[i] = D.default.join(r[i], t)
                return r
              })(t, e, n)
            },
            i = c ? c(t, e, r, n) : r(),
            u = 0;
          u < i.length;
          u++
        ) {
          var s = i[u]
          if (o(D.default.dirname(s))) {
            var a = g(s)
            if (a) return a
            var f = _(s)
            if (f) return f
          }
        }
      })(t, p)
      if (y) return KD(u, y, n)
    }
    var b = new Error("Cannot find module '" + t + "' from '" + h + "'")
    throw ((b.code = 'MODULE_NOT_FOUND'), b)
    function g(t) {
      var e = w(D.default.dirname(t))
      if (e && e.dir && e.pkg && n.pathFilter) {
        var i = D.default.relative(e.dir, t),
          o = n.pathFilter(e.pkg, t, i)
        o && (t = D.default.resolve(e.dir, o))
      }
      if (r(t)) return t
      for (var u = 0; u < a.length; u++) {
        var s = t + a[u]
        if (r(s)) return s
      }
    }
    function w(t) {
      if (
        '' !== t &&
        '/' !== t &&
        !(
          ('win32' === process.platform && /^\w:[/\\]*$/.test(t)) ||
          /[/\\]node_modules[/\\]*$/.test(t)
        )
      ) {
        var e = D.default.join(KD(u, t, n), 'package.json')
        if (!r(e)) return w(D.default.dirname(t))
        var o = s(i, e)
        return o && n.packageFilter && (o = n.packageFilter(o, t)), { pkg: o, dir: t }
      }
    }
    function _(t) {
      var e = D.default.join(KD(u, t, n), '/package.json')
      if (r(e)) {
        try {
          var o = s(i, e)
        } catch (t) {}
        if ((o && n.packageFilter && (o = n.packageFilter(o, t)), o && o.main)) {
          if ('string' != typeof o.main) {
            var c = new TypeError('package “' + o.name + '” `main` must be a string')
            throw ((c.code = 'INVALID_PACKAGE_MAIN'), c)
          }
          ;('.' !== o.main && './' !== o.main) || (o.main = 'index')
          try {
            var a = g(D.default.resolve(t, o.main))
            if (a) return a
            var f = _(D.default.resolve(t, o.main))
            if (f) return f
          } catch (t) {}
        }
      }
      return g(D.default.join(t, '/index'))
    }
  })
var HD = ND
function XD() {
  var t = 'eth',
    e = _.default.platform()
  return 'darwin' === e ? (t = 'en') : 'win32' === e && (t = null), t
}
function JD(t, e) {
  'function' == typeof t && ((e = t), (t = null))
  var n = { ip: JD.ip(t), ipv6: JD.ipv6(t), mac: null }
  JD.mac(t, function (t, r) {
    r && (n.mac = r), e(t, n)
  })
}
;(JD.interface = function (t, e) {
  var n = _.default.networkInterfaces(),
    r = !e
  ;(e = e || XD()), (t = t || 'IPv4')
  for (var i = -1; i < 8; i++) {
    if ((s = n[e + (i >= 0 ? i : '')]))
      for (var o = 0; o < s.length; o++) {
        if ((c = s[o]).family === t) return c
      }
  }
  if (r)
    for (var u in n) {
      var s = n[u]
      for (i = 0; i < s.length; i++) {
        var c
        if ((c = s[i]).family === t && '127.0.0.1' !== c.address) return c
      }
    }
}),
  (JD.ip = function (t) {
    var e = JD.interface('IPv4', t)
    return e && e.address
  }),
  (JD.ipv6 = function (t) {
    var e = JD.interface('IPv6', t)
    return e && e.address
  })
var ZD = /^(\w+)\:\s+flags=/,
  QD = /^(\w+)\s{2,}link encap:\w+/i,
  tw = (JD.MAC_RE = /(?:ether|HWaddr)\s+((?:[a-z0-9]{2}\:){5}[a-z0-9]{2})/i),
  ew = (JD.MAC_IP_RE = /inet\s(?:addr\:)?(\d+\.\d+\.\d+\.\d+)/)
JD.mac = function (t, e) {
  'function' == typeof t && ((e = t), (t = null)), (t = t || XD())
  var n = JD.interface('IPv4', t)
  return n
    ? (process.env.CI ||
        ('ff:00:00:00:00:00' !== n.mac && '00:00:00:00:00:00' !== n.mac) ||
        (n.mac = ''),
      n.mac
        ? e(null, n.mac)
        : void A.default.exec(
            'win32' === _.default.platform() ? 'ipconfig/all' : '/sbin/ifconfig',
            { timeout: 5e3 },
            function (r, i, o) {
              if (r || !i) return e(r)
              var u = (function (t, e, n) {
                for (var r = t.split('\n'), i = 0; i < r.length; i++) {
                  var o = r[i].trimRight(),
                    u = ZD.exec(o) || QD.exec(o)
                  if (u && 0 === u[1].indexOf(e)) {
                    var s = null,
                      c = null,
                      a = tw.exec(o)
                    for (a && (c = a[1]), i++; ; ) {
                      if (!(o = r[i]) || ZD.exec(o) || QD.exec(o)) {
                        i--
                        break
                      }
                      c || ((a = tw.exec(o)) && (c = a[1])),
                        s || ((a = ew.exec(o)) && (s = a[1])),
                        i++
                    }
                    if (s === n) return c
                  }
                }
              })(i || '', t, n.address)
              e(null, u)
            }
          ))
    : e()
}
var nw = /^nameserver\s+(\d+\.\d+\.\d+\.\d+)$/i
JD.dns = function (t, e) {
  'function' == typeof t && ((e = t), (t = null)),
    (t = t || '/etc/resolv.conf'),
    m.default.readFile(t, 'utf8', function (t, n) {
      if (t) return e(t)
      for (var r = [], i = (n = n || '').split('\n'), o = 0; o < i.length; o++) {
        var u = i[o].trim(),
          s = nw.exec(u)
        s && r.push(s[1])
      }
      e(null, r)
    })
}
var rw = JD,
  iw = (t) =>
    new Promise((e) => {
      m.default.access(t, (t) => {
        e(!t)
      })
    })
iw.sync = (t) => {
  try {
    return m.default.accessSync(t), !0
  } catch (t) {
    return !1
  }
}
const ow = (t, ...e) =>
  new Promise((n) => {
    n(t(...e))
  })
var uw = ow,
  sw = ow
uw.default = sw
const cw = (t) => {
  if ((!Number.isInteger(t) && t !== 1 / 0) || !(t > 0))
    return Promise.reject(
      new TypeError('Expected `concurrency` to be a number from 1 and up')
    )
  const e = []
  let n = 0
  const r = () => {
      n--, e.length > 0 && e.shift()()
    },
    i = (t, e, ...i) => {
      n++
      const o = uw(t, ...i)
      e(o), o.then(r, r)
    },
    o = (r, ...o) =>
      new Promise((u) =>
        ((r, o, ...u) => {
          n < t ? i(r, o, ...u) : e.push(i.bind(null, r, o, ...u))
        })(r, u, ...o)
      )
  return (
    Object.defineProperties(o, {
      activeCount: { get: () => n },
      pendingCount: { get: () => e.length },
      clearQueue: {
        value: () => {
          e.length = 0
        }
      }
    }),
    o
  )
}
var aw = cw,
  fw = cw
aw.default = fw
class lw extends Error {
  constructor(t) {
    super(), (this.value = t)
  }
}
const hw = (t, e) => Promise.resolve(t).then(e),
  pw = (t) => Promise.all(t).then((t) => !0 === t[1] && Promise.reject(new lw(t[0])))
var dw = (t, e) =>
  ((t, e, n) => {
    n = Object.assign({ concurrency: 1 / 0, preserveOrder: !0 }, n)
    const r = aw(n.concurrency),
      i = [...t].map((t) => [t, r(hw, t, e)]),
      o = aw(n.preserveOrder ? 1 : 1 / 0)
    return Promise.all(i.map((t) => o(pw, t)))
      .then(() => {})
      .catch((t) => (t instanceof lw ? t.value : Promise.reject(t)))
  })(
    t,
    (t) => iw(D.default.resolve(e.cwd, t)),
    (e = Object.assign({ cwd: process.cwd() }, e))
  )
dw.sync = (t, e) => {
  e = Object.assign({ cwd: process.cwd() }, e)
  for (const n of t) if (iw.sync(D.default.resolve(e.cwd, n))) return n
}
var vw = (t, e = {}) => {
  const n = D.default.resolve(e.cwd || ''),
    { root: r } = D.default.parse(n),
    i = [].concat(t)
  return new Promise((t) => {
    !(function e(n) {
      dw(i, { cwd: n }).then((i) => {
        i ? t(D.default.join(n, i)) : n === r ? t(null) : e(D.default.dirname(n))
      })
    })(n)
  })
}
vw.sync = (t, e = {}) => {
  let n = D.default.resolve(e.cwd || '')
  const { root: r } = D.default.parse(n),
    i = [].concat(t)
  for (;;) {
    const t = dw.sync(i, { cwd: n })
    if (t) return D.default.join(n, t)
    if (n === r) return null
    n = D.default.dirname(n)
  }
}
var yw = async ({ cwd: t } = {}) => vw('package.json', { cwd: t })
yw.sync = ({ cwd: t } = {}) => vw.sync('package.json', { cwd: t })
var bw = {
  stringReplaceAll: (t, e, n) => {
    let r = t.indexOf(e)
    if (-1 === r) return t
    const i = e.length
    let o = 0,
      u = ''
    do {
      ;(u += t.substr(o, r - o) + e + n), (o = r + i), (r = t.indexOf(e, o))
    } while (-1 !== r)
    return (u += t.substr(o)), u
  },
  stringEncaseCRLFWithFirstIndex: (t, e, n, r) => {
    let i = 0,
      o = ''
    do {
      const u = '\r' === t[r - 1]
      ;(o += t.substr(i, (u ? r - 1 : r) - i) + e + (u ? '\r\n' : '\n') + n),
        (i = r + 1),
        (r = t.indexOf('\n', i))
    } while (-1 !== r)
    return (o += t.substr(i)), o
  }
}
const gw = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
  mw = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
  Dw = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
  ww = /\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.)|([^\\])/gi,
  _w = new Map([
    ['n', '\n'],
    ['r', '\r'],
    ['t', '\t'],
    ['b', '\b'],
    ['f', '\f'],
    ['v', '\v'],
    ['0', '\0'],
    ['\\', '\\'],
    ['e', ''],
    ['a', '']
  ])
function Ew(t) {
  const e = 'u' === t[0],
    n = '{' === t[1]
  return (e && !n && 5 === t.length) || ('x' === t[0] && 3 === t.length)
    ? String.fromCharCode(parseInt(t.slice(1), 16))
    : e && n
    ? String.fromCodePoint(parseInt(t.slice(2, -1), 16))
    : _w.get(t) || t
}
function xw(t, e) {
  const n = [],
    r = e.trim().split(/\s*,\s*/g)
  let i
  for (const e of r) {
    const r = Number(e)
    if (Number.isNaN(r)) {
      if (!(i = e.match(Dw)))
        throw new Error(`Invalid Chalk template style argument: ${e} (in style '${t}')`)
      n.push(i[2].replace(ww, (t, e, n) => (e ? Ew(e) : n)))
    } else n.push(r)
  }
  return n
}
function Sw(t) {
  mw.lastIndex = 0
  const e = []
  let n
  for (; null !== (n = mw.exec(t)); ) {
    const t = n[1]
    if (n[2]) {
      const r = xw(t, n[2])
      e.push([t].concat(r))
    } else e.push([t])
  }
  return e
}
function Cw(t, e) {
  const n = {}
  for (const t of e) for (const e of t.styles) n[e[0]] = t.inverse ? null : e.slice(1)
  let r = t
  for (const [t, e] of Object.entries(n))
    if (Array.isArray(e)) {
      if (!(t in r)) throw new Error(`Unknown Chalk style: ${t}`)
      r = e.length > 0 ? r[t](...e) : r[t]
    }
  return r
}
var Fw = (t, e) => {
  const n = [],
    r = []
  let i = []
  if (
    (e.replace(gw, (e, o, u, s, c, a) => {
      if (o) i.push(Ew(o))
      else if (s) {
        const e = i.join('')
        ;(i = []),
          r.push(0 === n.length ? e : Cw(t, n)(e)),
          n.push({ inverse: u, styles: Sw(s) })
      } else if (c) {
        if (0 === n.length)
          throw new Error('Found extraneous } in Chalk template literal')
        r.push(Cw(t, n)(i.join(''))), (i = []), n.pop()
      } else i.push(a)
    }),
    r.push(i.join('')),
    n.length > 0)
  ) {
    const t = `Chalk template literal is missing ${n.length} closing bracket${
      1 === n.length ? '' : 's'
    } (\`}\`)`
    throw new Error(t)
  }
  return r.join('')
}
const { stdout: Ow, stderr: jw } = qt,
  { stringReplaceAll: Aw, stringEncaseCRLFWithFirstIndex: kw } = bw,
  Iw = ['ansi', 'ansi', 'ansi256', 'ansi16m'],
  Tw = Object.create(null)
class Nw {
  constructor(t) {
    return Bw(t)
  }
}
const Bw = (t) => {
  const e = {}
  return (
    ((t, e = {}) => {
      if (e.level > 3 || e.level < 0)
        throw new Error('The `level` option should be an integer from 0 to 3')
      const n = Ow ? Ow.level : 0
      t.level = void 0 === e.level ? n : e.level
    })(e, t),
    (e.template = (...t) => zw(e.template, ...t)),
    Object.setPrototypeOf(e, Pw.prototype),
    Object.setPrototypeOf(e.template, e),
    (e.template.constructor = () => {
      throw new Error(
        '`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.'
      )
    }),
    (e.template.Instance = Nw),
    e.template
  )
}
function Pw(t) {
  return Bw(t)
}
for (const [t, e] of Object.entries(Ye))
  Tw[t] = {
    get() {
      const n = Uw(this, Mw(e.open, e.close, this._styler), this._isEmpty)
      return Object.defineProperty(this, t, { value: n }), n
    }
  }
Tw.visible = {
  get() {
    const t = Uw(this, this._styler, !0)
    return Object.defineProperty(this, 'visible', { value: t }), t
  }
}
const Rw = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256']
for (const t of Rw)
  Tw[t] = {
    get() {
      const { level: e } = this
      return function (...n) {
        const r = Mw(Ye.color[Iw[e]][t](...n), Ye.color.close, this._styler)
        return Uw(this, r, this._isEmpty)
      }
    }
  }
for (const t of Rw) {
  Tw['bg' + t[0].toUpperCase() + t.slice(1)] = {
    get() {
      const { level: e } = this
      return function (...n) {
        const r = Mw(Ye.bgColor[Iw[e]][t](...n), Ye.bgColor.close, this._styler)
        return Uw(this, r, this._isEmpty)
      }
    }
  }
}
const Lw = Object.defineProperties(() => {}, {
    ...Tw,
    level: {
      enumerable: !0,
      get() {
        return this._generator.level
      },
      set(t) {
        this._generator.level = t
      }
    }
  }),
  Mw = (t, e, n) => {
    let r, i
    return (
      void 0 === n ? ((r = t), (i = e)) : ((r = n.openAll + t), (i = e + n.closeAll)),
      { open: t, close: e, openAll: r, closeAll: i, parent: n }
    )
  },
  Uw = (t, e, n) => {
    const r = (...t) => Vw(r, 1 === t.length ? '' + t[0] : t.join(' '))
    return (r.__proto__ = Lw), (r._generator = t), (r._styler = e), (r._isEmpty = n), r
  },
  Vw = (t, e) => {
    if (t.level <= 0 || !e) return t._isEmpty ? '' : e
    let n = t._styler
    if (void 0 === n) return e
    const { openAll: r, closeAll: i } = n
    if (-1 !== e.indexOf(''))
      for (; void 0 !== n; ) (e = Aw(e, n.close, n.open)), (n = n.parent)
    const o = e.indexOf('\n')
    return -1 !== o && (e = kw(e, i, r, o)), r + e + i
  }
let $w
const zw = (t, ...e) => {
  const [n] = e
  if (!Array.isArray(n)) return e.join(' ')
  const r = e.slice(1),
    i = [n.raw[0]]
  for (let t = 1; t < n.length; t++)
    i.push(String(r[t - 1]).replace(/[{}\\]/g, '\\$&'), String(n.raw[t]))
  return void 0 === $w && ($w = Fw), $w(t, i.join(''))
}
Object.defineProperties(Pw.prototype, Tw)
const qw = Pw()
;(qw.supportsColor = Ow),
  (qw.stderr = Pw({ level: jw ? jw.level : 0 })),
  (qw.stderr.supportsColor = jw),
  (qw.Level = {
    None: 0,
    Basic: 1,
    Ansi256: 2,
    TrueColor: 3,
    0: 'None',
    1: 'Basic',
    2: 'Ansi256',
    3: 'TrueColor'
  })
var Ww = qw,
  Gw = (t) => {
    const e = /^\\\\\?\\/.test(t),
      n = /[^\u0000-\u0080]+/.test(t)
    return e || n ? t : t.replace(/\\/g, '/')
  },
  Kw = Ft(function (t, e) {
    var n = 9007199254740991,
      r = '[object Map]',
      i = '[object Promise]',
      o = '[object Set]',
      u = '[object WeakMap]',
      s = '[object DataView]',
      c = /^\[object .+?Constructor\]$/,
      a = 'object' == typeof St && St && St.Object === Object && St,
      f = 'object' == typeof self && self && self.Object === Object && self,
      l = a || f || Function('return this')(),
      h = e && !e.nodeType && e,
      p = h && t && !t.nodeType && t,
      d = p && p.exports === h
    var v,
      y,
      b = Function.prototype,
      g = Object.prototype,
      m = l['__core-js_shared__'],
      D = (function () {
        var t = /[^.]+$/.exec((m && m.keys && m.keys.IE_PROTO) || '')
        return t ? 'Symbol(src)_1.' + t : ''
      })(),
      w = b.toString,
      _ = g.hasOwnProperty,
      E = g.toString,
      x = RegExp(
        '^' +
          w
            .call(_)
            .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
          '$'
      ),
      S = d ? l.Buffer : void 0,
      C = g.propertyIsEnumerable,
      F = S ? S.isBuffer : void 0,
      O =
        ((v = Object.keys),
        (y = Object),
        function (t) {
          return v(y(t))
        }),
      j = V(l, 'DataView'),
      A = V(l, 'Map'),
      k = V(l, 'Promise'),
      I = V(l, 'Set'),
      T = V(l, 'WeakMap'),
      N = !C.call({ valueOf: 1 }, 'valueOf'),
      B = z(j),
      P = z(A),
      R = z(k),
      L = z(I),
      M = z(T)
    function U(t) {
      return (
        !(
          !H(t) ||
          (function (t) {
            return !!D && D in t
          })(t)
        ) &&
        (Y(t) ||
        (function (t) {
          var e = !1
          if (null != t && 'function' != typeof t.toString)
            try {
              e = !!(t + '')
            } catch (t) {}
          return e
        })(t)
          ? x
          : c
        ).test(z(t))
      )
    }
    function V(t, e) {
      var n = (function (t, e) {
        return null == t ? void 0 : t[e]
      })(t, e)
      return U(n) ? n : void 0
    }
    var $ = function (t) {
      return E.call(t)
    }
    function z(t) {
      if (null != t) {
        try {
          return w.call(t)
        } catch (t) {}
        try {
          return t + ''
        } catch (t) {}
      }
      return ''
    }
    function q(t) {
      return (
        (function (t) {
          return (
            (function (t) {
              return !!t && 'object' == typeof t
            })(t) && G(t)
          )
        })(t) &&
        _.call(t, 'callee') &&
        (!C.call(t, 'callee') || '[object Arguments]' == E.call(t))
      )
    }
    ;((j && $(new j(new ArrayBuffer(1))) != s) ||
      (A && $(new A()) != r) ||
      (k && $(k.resolve()) != i) ||
      (I && $(new I()) != o) ||
      (T && $(new T()) != u)) &&
      ($ = function (t) {
        var e = E.call(t),
          n = '[object Object]' == e ? t.constructor : void 0,
          c = n ? z(n) : void 0
        if (c)
          switch (c) {
            case B:
              return s
            case P:
              return r
            case R:
              return i
            case L:
              return o
            case M:
              return u
          }
        return e
      })
    var W = Array.isArray
    function G(t) {
      return (
        null != t &&
        (function (t) {
          return 'number' == typeof t && t > -1 && t % 1 == 0 && t <= n
        })(t.length) &&
        !Y(t)
      )
    }
    var K =
      F ||
      function () {
        return !1
      }
    function Y(t) {
      var e = H(t) ? E.call(t) : ''
      return '[object Function]' == e || '[object GeneratorFunction]' == e
    }
    function H(t) {
      var e = typeof t
      return !!t && ('object' == e || 'function' == e)
    }
    t.exports = function (t) {
      if (
        G(t) &&
        (W(t) || 'string' == typeof t || 'function' == typeof t.splice || K(t) || q(t))
      )
        return !t.length
      var e = $(t)
      if (e == r || e == o) return !t.size
      if (
        N ||
        (function (t) {
          var e = t && t.constructor
          return t === (('function' == typeof e && e.prototype) || g)
        })(t)
      )
        return !O(t).length
      for (var n in t) if (_.call(t, n)) return !1
      return !0
    }
  }),
  Yw = Ft(function (t, e) {
    var n = '__lodash_hash_undefined__',
      r = 9007199254740991,
      i = '[object Arguments]',
      o = '[object Array]',
      u = '[object Boolean]',
      s = '[object Date]',
      c = '[object Error]',
      a = '[object Function]',
      f = '[object Map]',
      l = '[object Number]',
      h = '[object Object]',
      p = '[object Promise]',
      d = '[object RegExp]',
      v = '[object Set]',
      y = '[object String]',
      b = '[object Symbol]',
      g = '[object WeakMap]',
      m = '[object ArrayBuffer]',
      D = '[object DataView]',
      w = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      _ = /^\w*$/,
      E = /^\./,
      x = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      S = /\\(\\)?/g,
      C = /^\[object .+?Constructor\]$/,
      F = /^(?:0|[1-9]\d*)$/,
      O = {}
    ;(O['[object Float32Array]'] = O['[object Float64Array]'] = O[
      '[object Int8Array]'
    ] = O['[object Int16Array]'] = O['[object Int32Array]'] = O[
      '[object Uint8Array]'
    ] = O['[object Uint8ClampedArray]'] = O['[object Uint16Array]'] = O[
      '[object Uint32Array]'
    ] = !0),
      (O[i] = O[o] = O[m] = O[u] = O[D] = O[s] = O[c] = O[a] = O[f] = O[l] = O[h] = O[
        d
      ] = O[v] = O[y] = O[g] = !1)
    var j = 'object' == typeof St && St && St.Object === Object && St,
      A = 'object' == typeof self && self && self.Object === Object && self,
      k = j || A || Function('return this')(),
      I = e && !e.nodeType && e,
      T = I && t && !t.nodeType && t,
      N = T && T.exports === I && j.process,
      B = (function () {
        try {
          return N && N.binding('util')
        } catch (t) {}
      })(),
      P = B && B.isTypedArray
    function R(t, e) {
      for (var n = -1, r = t ? t.length : 0; ++n < r; ) if (e(t[n], n, t)) return !0
      return !1
    }
    function L(t) {
      var e = !1
      if (null != t && 'function' != typeof t.toString)
        try {
          e = !!(t + '')
        } catch (t) {}
      return e
    }
    function M(t) {
      var e = -1,
        n = Array(t.size)
      return (
        t.forEach(function (t, r) {
          n[++e] = [r, t]
        }),
        n
      )
    }
    function U(t) {
      var e = -1,
        n = Array(t.size)
      return (
        t.forEach(function (t) {
          n[++e] = t
        }),
        n
      )
    }
    var V,
      $,
      z = Array.prototype,
      q = Function.prototype,
      W = Object.prototype,
      G = k['__core-js_shared__'],
      K = (function () {
        var t = /[^.]+$/.exec((G && G.keys && G.keys.IE_PROTO) || '')
        return t ? 'Symbol(src)_1.' + t : ''
      })(),
      Y = q.toString,
      H = W.hasOwnProperty,
      X = W.toString,
      J = RegExp(
        '^' +
          Y.call(H)
            .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
          '$'
      ),
      Z = k.Symbol,
      Q = k.Uint8Array,
      tt = W.propertyIsEnumerable,
      et = z.splice,
      nt =
        ((V = Object.keys),
        ($ = Object),
        function (t) {
          return V($(t))
        }),
      rt = Pt(k, 'DataView'),
      it = Pt(k, 'Map'),
      ot = Pt(k, 'Promise'),
      ut = Pt(k, 'Set'),
      st = Pt(k, 'WeakMap'),
      ct = Pt(Object, 'create'),
      at = qt(rt),
      ft = qt(it),
      lt = qt(ot),
      ht = qt(ut),
      pt = qt(st),
      dt = Z ? Z.prototype : void 0,
      vt = dt ? dt.valueOf : void 0,
      yt = dt ? dt.toString : void 0
    function bt(t) {
      var e = -1,
        n = t ? t.length : 0
      for (this.clear(); ++e < n; ) {
        var r = t[e]
        this.set(r[0], r[1])
      }
    }
    function gt(t) {
      var e = -1,
        n = t ? t.length : 0
      for (this.clear(); ++e < n; ) {
        var r = t[e]
        this.set(r[0], r[1])
      }
    }
    function mt(t) {
      var e = -1,
        n = t ? t.length : 0
      for (this.clear(); ++e < n; ) {
        var r = t[e]
        this.set(r[0], r[1])
      }
    }
    function Dt(t) {
      var e = -1,
        n = t ? t.length : 0
      for (this.__data__ = new mt(); ++e < n; ) this.add(t[e])
    }
    function wt(t) {
      this.__data__ = new gt(t)
    }
    function _t(t, e) {
      var n =
          Yt(t) || Kt(t)
            ? (function (t, e) {
                for (var n = -1, r = Array(t); ++n < t; ) r[n] = e(n)
                return r
              })(t.length, String)
            : [],
        r = n.length,
        i = !!r
      for (var o in t)
        (!e && !H.call(t, o)) || (i && ('length' == o || Lt(o, r))) || n.push(o)
      return n
    }
    function Et(t, e) {
      for (var n = t.length; n--; ) if (Gt(t[n][0], e)) return n
      return -1
    }
    ;(bt.prototype.clear = function () {
      this.__data__ = ct ? ct(null) : {}
    }),
      (bt.prototype.delete = function (t) {
        return this.has(t) && delete this.__data__[t]
      }),
      (bt.prototype.get = function (t) {
        var e = this.__data__
        if (ct) {
          var r = e[t]
          return r === n ? void 0 : r
        }
        return H.call(e, t) ? e[t] : void 0
      }),
      (bt.prototype.has = function (t) {
        var e = this.__data__
        return ct ? void 0 !== e[t] : H.call(e, t)
      }),
      (bt.prototype.set = function (t, e) {
        return (this.__data__[t] = ct && void 0 === e ? n : e), this
      }),
      (gt.prototype.clear = function () {
        this.__data__ = []
      }),
      (gt.prototype.delete = function (t) {
        var e = this.__data__,
          n = Et(e, t)
        return !(n < 0) && (n == e.length - 1 ? e.pop() : et.call(e, n, 1), !0)
      }),
      (gt.prototype.get = function (t) {
        var e = this.__data__,
          n = Et(e, t)
        return n < 0 ? void 0 : e[n][1]
      }),
      (gt.prototype.has = function (t) {
        return Et(this.__data__, t) > -1
      }),
      (gt.prototype.set = function (t, e) {
        var n = this.__data__,
          r = Et(n, t)
        return r < 0 ? n.push([t, e]) : (n[r][1] = e), this
      }),
      (mt.prototype.clear = function () {
        this.__data__ = { hash: new bt(), map: new (it || gt)(), string: new bt() }
      }),
      (mt.prototype.delete = function (t) {
        return Bt(this, t).delete(t)
      }),
      (mt.prototype.get = function (t) {
        return Bt(this, t).get(t)
      }),
      (mt.prototype.has = function (t) {
        return Bt(this, t).has(t)
      }),
      (mt.prototype.set = function (t, e) {
        return Bt(this, t).set(t, e), this
      }),
      (Dt.prototype.add = Dt.prototype.push = function (t) {
        return this.__data__.set(t, n), this
      }),
      (Dt.prototype.has = function (t) {
        return this.__data__.has(t)
      }),
      (wt.prototype.clear = function () {
        this.__data__ = new gt()
      }),
      (wt.prototype.delete = function (t) {
        return this.__data__.delete(t)
      }),
      (wt.prototype.get = function (t) {
        return this.__data__.get(t)
      }),
      (wt.prototype.has = function (t) {
        return this.__data__.has(t)
      }),
      (wt.prototype.set = function (t, e) {
        var n = this.__data__
        if (n instanceof gt) {
          var r = n.__data__
          if (!it || r.length < 199) return r.push([t, e]), this
          n = this.__data__ = new mt(r)
        }
        return n.set(t, e), this
      })
    var xt,
      Ct = function (t, e, n) {
        for (var r = -1, i = Object(t), o = n(t), u = o.length; u--; ) {
          var s = o[xt ? u : ++r]
          if (!1 === e(i[s], s, i)) break
        }
        return t
      }
    function Ft(t, e) {
      for (var n = 0, r = (e = Mt(e, t) ? [e] : Tt(e)).length; null != t && n < r; )
        t = t[zt(e[n++])]
      return n && n == r ? t : void 0
    }
    function Ot(t, e) {
      return null != t && e in Object(t)
    }
    function jt(t, e, n, r, a) {
      return (
        t === e ||
        (null == t || null == e || (!Zt(t) && !Qt(e))
          ? t != t && e != e
          : (function (t, e, n, r, a, p) {
              var g = Yt(t),
                w = Yt(e),
                _ = o,
                E = o
              g || (_ = (_ = Rt(t)) == i ? h : _)
              w || (E = (E = Rt(e)) == i ? h : E)
              var x = _ == h && !L(t),
                S = E == h && !L(e),
                C = _ == E
              if (C && !x)
                return (
                  p || (p = new wt()),
                  g || ee(t)
                    ? Nt(t, e, n, r, a, p)
                    : (function (t, e, n, r, i, o, a) {
                        switch (n) {
                          case D:
                            if (
                              t.byteLength != e.byteLength ||
                              t.byteOffset != e.byteOffset
                            )
                              return !1
                            ;(t = t.buffer), (e = e.buffer)
                          case m:
                            return !(
                              t.byteLength != e.byteLength || !r(new Q(t), new Q(e))
                            )
                          case u:
                          case s:
                          case l:
                            return Gt(+t, +e)
                          case c:
                            return t.name == e.name && t.message == e.message
                          case d:
                          case y:
                            return t == e + ''
                          case f:
                            var h = M
                          case v:
                            var p = 2 & o
                            if ((h || (h = U), t.size != e.size && !p)) return !1
                            var g = a.get(t)
                            if (g) return g == e
                            ;(o |= 1), a.set(t, e)
                            var w = Nt(h(t), h(e), r, i, o, a)
                            return a.delete(t), w
                          case b:
                            if (vt) return vt.call(t) == vt.call(e)
                        }
                        return !1
                      })(t, e, _, n, r, a, p)
                )
              if (!(2 & a)) {
                var F = x && H.call(t, '__wrapped__'),
                  O = S && H.call(e, '__wrapped__')
                if (F || O) {
                  var j = F ? t.value() : t,
                    A = O ? e.value() : e
                  return p || (p = new wt()), n(j, A, r, a, p)
                }
              }
              if (!C) return !1
              return (
                p || (p = new wt()),
                (function (t, e, n, r, i, o) {
                  var u = 2 & i,
                    s = ne(t),
                    c = s.length,
                    a = ne(e).length
                  if (c != a && !u) return !1
                  var f = c
                  for (; f--; ) {
                    var l = s[f]
                    if (!(u ? l in e : H.call(e, l))) return !1
                  }
                  var h = o.get(t)
                  if (h && o.get(e)) return h == e
                  var p = !0
                  o.set(t, e), o.set(e, t)
                  var d = u
                  for (; ++f < c; ) {
                    var v = t[(l = s[f])],
                      y = e[l]
                    if (r) var b = u ? r(y, v, l, e, t, o) : r(v, y, l, t, e, o)
                    if (!(void 0 === b ? v === y || n(v, y, r, i, o) : b)) {
                      p = !1
                      break
                    }
                    d || (d = 'constructor' == l)
                  }
                  if (p && !d) {
                    var g = t.constructor,
                      m = e.constructor
                    g == m ||
                      !('constructor' in t) ||
                      !('constructor' in e) ||
                      ('function' == typeof g &&
                        g instanceof g &&
                        'function' == typeof m &&
                        m instanceof m) ||
                      (p = !1)
                  }
                  return o.delete(t), o.delete(e), p
                })(t, e, n, r, a, p)
              )
            })(t, e, jt, n, r, a))
      )
    }
    function At(t) {
      return (
        !(
          !Zt(t) ||
          (function (t) {
            return !!K && K in t
          })(t)
        ) && (Xt(t) || L(t) ? J : C).test(qt(t))
      )
    }
    function kt(t) {
      return 'function' == typeof t
        ? t
        : null == t
        ? re
        : 'object' == typeof t
        ? Yt(t)
          ? (function (t, e) {
              if (Mt(t) && Ut(e)) return Vt(zt(t), e)
              return function (n) {
                var r = (function (t, e, n) {
                  var r = null == t ? void 0 : Ft(t, e)
                  return void 0 === r ? n : r
                })(n, t)
                return void 0 === r && r === e
                  ? (function (t, e) {
                      return (
                        null != t &&
                        (function (t, e, n) {
                          e = Mt(e, t) ? [e] : Tt(e)
                          var r,
                            i = -1,
                            o = e.length
                          for (; ++i < o; ) {
                            var u = zt(e[i])
                            if (!(r = null != t && n(t, u))) break
                            t = t[u]
                          }
                          if (r) return r
                          return (
                            !!(o = t ? t.length : 0) &&
                            Jt(o) &&
                            Lt(u, o) &&
                            (Yt(t) || Kt(t))
                          )
                        })(t, e, Ot)
                      )
                    })(n, t)
                  : jt(e, r, void 0, 3)
              }
            })(t[0], t[1])
          : (function (t) {
              var e = (function (t) {
                var e = ne(t),
                  n = e.length
                for (; n--; ) {
                  var r = e[n],
                    i = t[r]
                  e[n] = [r, i, Ut(i)]
                }
                return e
              })(t)
              if (1 == e.length && e[0][2]) return Vt(e[0][0], e[0][1])
              return function (n) {
                return (
                  n === t ||
                  (function (t, e, n, r) {
                    var i = n.length,
                      o = i,
                      u = !r
                    if (null == t) return !o
                    for (t = Object(t); i--; ) {
                      var s = n[i]
                      if (u && s[2] ? s[1] !== t[s[0]] : !(s[0] in t)) return !1
                    }
                    for (; ++i < o; ) {
                      var c = (s = n[i])[0],
                        a = t[c],
                        f = s[1]
                      if (u && s[2]) {
                        if (void 0 === a && !(c in t)) return !1
                      } else {
                        var l = new wt()
                        if (r) var h = r(a, f, c, t, e, l)
                        if (!(void 0 === h ? jt(f, a, r, 3, l) : h)) return !1
                      }
                    }
                    return !0
                  })(n, t, e)
                )
              }
            })(t)
        : (function (t) {
            return Mt(t)
              ? (function (t) {
                  return function (e) {
                    return null == e ? void 0 : e[t]
                  }
                })(zt(t))
              : (function (t) {
                  return function (e) {
                    return Ft(e, t)
                  }
                })(t)
          })(t)
    }
    function It(t) {
      if (
        !(function (t) {
          var e = t && t.constructor,
            n = ('function' == typeof e && e.prototype) || W
          return t === n
        })(t)
      )
        return nt(t)
      var e = []
      for (var n in Object(t)) H.call(t, n) && 'constructor' != n && e.push(n)
      return e
    }
    function Tt(t) {
      return Yt(t) ? t : $t(t)
    }
    function Nt(t, e, n, r, i, o) {
      var u = 2 & i,
        s = t.length,
        c = e.length
      if (s != c && !(u && c > s)) return !1
      var a = o.get(t)
      if (a && o.get(e)) return a == e
      var f = -1,
        l = !0,
        h = 1 & i ? new Dt() : void 0
      for (o.set(t, e), o.set(e, t); ++f < s; ) {
        var p = t[f],
          d = e[f]
        if (r) var v = u ? r(d, p, f, e, t, o) : r(p, d, f, t, e, o)
        if (void 0 !== v) {
          if (v) continue
          l = !1
          break
        }
        if (h) {
          if (
            !R(e, function (t, e) {
              if (!h.has(e) && (p === t || n(p, t, r, i, o))) return h.add(e)
            })
          ) {
            l = !1
            break
          }
        } else if (p !== d && !n(p, d, r, i, o)) {
          l = !1
          break
        }
      }
      return o.delete(t), o.delete(e), l
    }
    function Bt(t, e) {
      var n,
        r,
        i = t.__data__
      return (
        'string' == (r = typeof (n = e)) ||
        'number' == r ||
        'symbol' == r ||
        'boolean' == r
          ? '__proto__' !== n
          : null === n
      )
        ? i['string' == typeof e ? 'string' : 'hash']
        : i.map
    }
    function Pt(t, e) {
      var n = (function (t, e) {
        return null == t ? void 0 : t[e]
      })(t, e)
      return At(n) ? n : void 0
    }
    var Rt = function (t) {
      return X.call(t)
    }
    function Lt(t, e) {
      return (
        !!(e = null == e ? r : e) &&
        ('number' == typeof t || F.test(t)) &&
        t > -1 &&
        t % 1 == 0 &&
        t < e
      )
    }
    function Mt(t, e) {
      if (Yt(t)) return !1
      var n = typeof t
      return (
        !('number' != n && 'symbol' != n && 'boolean' != n && null != t && !te(t)) ||
        _.test(t) ||
        !w.test(t) ||
        (null != e && t in Object(e))
      )
    }
    function Ut(t) {
      return t == t && !Zt(t)
    }
    function Vt(t, e) {
      return function (n) {
        return null != n && n[t] === e && (void 0 !== e || t in Object(n))
      }
    }
    ;((rt && Rt(new rt(new ArrayBuffer(1))) != D) ||
      (it && Rt(new it()) != f) ||
      (ot && Rt(ot.resolve()) != p) ||
      (ut && Rt(new ut()) != v) ||
      (st && Rt(new st()) != g)) &&
      (Rt = function (t) {
        var e = X.call(t),
          n = e == h ? t.constructor : void 0,
          r = n ? qt(n) : void 0
        if (r)
          switch (r) {
            case at:
              return D
            case ft:
              return f
            case lt:
              return p
            case ht:
              return v
            case pt:
              return g
          }
        return e
      })
    var $t = Wt(function (t) {
      var e
      t =
        null == (e = t)
          ? ''
          : (function (t) {
              if ('string' == typeof t) return t
              if (te(t)) return yt ? yt.call(t) : ''
              var e = t + ''
              return '0' == e && 1 / t == -1 / 0 ? '-0' : e
            })(e)
      var n = []
      return (
        E.test(t) && n.push(''),
        t.replace(x, function (t, e, r, i) {
          n.push(r ? i.replace(S, '$1') : e || t)
        }),
        n
      )
    })
    function zt(t) {
      if ('string' == typeof t || te(t)) return t
      var e = t + ''
      return '0' == e && 1 / t == -1 / 0 ? '-0' : e
    }
    function qt(t) {
      if (null != t) {
        try {
          return Y.call(t)
        } catch (t) {}
        try {
          return t + ''
        } catch (t) {}
      }
      return ''
    }
    function Wt(t, e) {
      if ('function' != typeof t || (e && 'function' != typeof e))
        throw new TypeError('Expected a function')
      var n = function () {
        var r = arguments,
          i = e ? e.apply(this, r) : r[0],
          o = n.cache
        if (o.has(i)) return o.get(i)
        var u = t.apply(this, r)
        return (n.cache = o.set(i, u)), u
      }
      return (n.cache = new (Wt.Cache || mt)()), n
    }
    function Gt(t, e) {
      return t === e || (t != t && e != e)
    }
    function Kt(t) {
      return (
        (function (t) {
          return Qt(t) && Ht(t)
        })(t) &&
        H.call(t, 'callee') &&
        (!tt.call(t, 'callee') || X.call(t) == i)
      )
    }
    Wt.Cache = mt
    var Yt = Array.isArray
    function Ht(t) {
      return null != t && Jt(t.length) && !Xt(t)
    }
    function Xt(t) {
      var e = Zt(t) ? X.call(t) : ''
      return e == a || '[object GeneratorFunction]' == e
    }
    function Jt(t) {
      return 'number' == typeof t && t > -1 && t % 1 == 0 && t <= r
    }
    function Zt(t) {
      var e = typeof t
      return !!t && ('object' == e || 'function' == e)
    }
    function Qt(t) {
      return !!t && 'object' == typeof t
    }
    function te(t) {
      return 'symbol' == typeof t || (Qt(t) && X.call(t) == b)
    }
    var ee = P
      ? (function (t) {
          return function (e) {
            return t(e)
          }
        })(P)
      : function (t) {
          return Qt(t) && Jt(t.length) && !!O[X.call(t)]
        }
    function ne(t) {
      return Ht(t) ? _t(t) : It(t)
    }
    function re(t) {
      return t
    }
    t.exports = function (t, e) {
      var n = {}
      return (
        (e = kt(e)),
        (function (t, e) {
          t && Ct(t, e, ne)
        })(t, function (t, r, i) {
          n[r] = e(t, r, i)
        }),
        n
      )
    }
  })
function Hw(t, e, n) {
  if (e != e)
    return (function (t, e, n, r) {
      for (var i = t.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i; )
        if (e(t[o], o, t)) return o
      return -1
    })(t, Jw, n)
  for (var r = n - 1, i = t.length; ++r < i; ) if (t[r] === e) return r
  return -1
}
function Xw(t, e, n, r) {
  for (var i = n - 1, o = t.length; ++i < o; ) if (r(t[i], e)) return i
  return -1
}
function Jw(t) {
  return t != t
}
var Zw = Array.prototype.splice
function Qw(t, e, n, r) {
  var i,
    o = r ? Xw : Hw,
    u = -1,
    s = e.length,
    c = t
  for (
    t === e &&
      (e = (function (t, e) {
        var n = -1,
          r = t.length
        e || (e = Array(r))
        for (; ++n < r; ) e[n] = t[n]
        return e
      })(e)),
      n &&
        (c = (function (t, e) {
          for (var n = -1, r = t ? t.length : 0, i = Array(r); ++n < r; )
            i[n] = e(t[n], n, t)
          return i
        })(
          t,
          ((i = n),
          function (t) {
            return i(t)
          })
        ));
    ++u < s;

  )
    for (var a = 0, f = e[u], l = n ? n(f) : f; (a = o(c, l, a, r)) > -1; )
      c !== t && Zw.call(c, a, 1), Zw.call(t, a, 1)
  return t
}
var t_ = function (t, e) {
  return t && t.length && e && e.length ? Qw(t, e) : t
}
var e_ = function (t, e, n) {
    if (
      (!0 === e && ((n = !0), (e = null)),
      -1 == t.indexOf('require') && -1 == t.indexOf('import'))
    )
      return e ? t : []
    for (
      var r, i, o, u, s, c = 0, a = t.length, f = 1, l = 0, h = [], p = 0, d = [], v = [];
      c < a;

    )
      if ((g(), /\s/.test(r))) !o || ('\n' != r && '\r' != r) || ((i = 0), (o = 0))
      else if ('"' == r || "'" == r) m(), (f = 1), (o = 0), (i = 0)
      else if ('/' == r)
        if ((g(), '/' == r)) -1 == (c = t.indexOf('\n', c)) && (c = t.length)
        else if ('*' == r) {
          var y = t.indexOf('\n', c)
          ;-1 == (c = t.indexOf('*/', c)) ? (c = a) : (c += 2),
            o && -1 != y && y < c && ((i = 0), (o = 0))
        } else f ? (D(), (f = 0), (o = 0), (i = 0)) : (c--, (f = 1), (o = 0), (i = 1))
      else if (/[a-z_$]/i.test(r)) w()
      else if (/\d/.test(r) || ('.' == r && /\d/.test(t.charAt(c)))) _(), (o = 0), (i = 0)
      else if ('(' == r) d.push(p), (f = 1), (o = 0), (i = 1)
      else if (')' == r) (f = d.pop()), (o = 0), (i = 0)
      else if ('{' == r) o && (i = 1), v.push(i), (o = 0), (f = 1)
      else if ('}' == r) (i = v.pop()), (f = !i), (o = 0)
      else {
        var b = t.charAt(c)
        ';' == r
          ? (i = 0)
          : ('-' == r && '-' == b) || ('+' == r && '+' == b) || ('=' == r && '>' == b)
          ? ((i = 0), c++)
          : (i = 1),
          (f = ']' != r),
          (o = 0)
      }
    return e ? t : h
    function g() {
      r = t.charAt(c++)
    }
    function m() {
      var n = c,
        i = r,
        o = t.indexOf(i, n)
      if (-1 == o) c = a
      else if ('\\' != t.charAt(o - 1)) c = o + 1
      else
        for (; c < a; )
          if ((g(), '\\' == r)) c++
          else if (r == i) break
      if (l) {
        var f = {
          string: 2 == l ? t.slice(u, c) : t.slice(u, t.indexOf(')', c) + 1),
          path: t.slice(n, c - 1),
          index: u,
          flag: s
        }
        if ((h.push(f), e)) {
          var p = e(f)
          ;(t = t.slice(0, u) + p + t.slice(u + f.string.length)),
            p.length != f.string.length && ((c = u + p.length), (a = t.length))
        }
        l = 0
      }
    }
    function D() {
      for (c--; c < a; )
        if ((g(), '\\' == r)) c++
        else {
          if ('/' == r) break
          if ('[' == r)
            for (; c < a; )
              if ((g(), '\\' == r)) c++
              else if (']' == r) break
        }
    }
    function w() {
      var e = t.slice(c - 1),
        r = /^[\w$]+/.exec(e)[0]
      ;(p = { if: 1, for: 1, while: 1, with: 1 }[r]),
        (f = {
          break: 1,
          case: 1,
          continue: 1,
          debugger: 1,
          delete: 1,
          do: 1,
          else: 1,
          false: 1,
          if: 1,
          in: 1,
          instanceof: 1,
          return: 1,
          typeof: 1,
          void: 1
        }[r]),
        (o = 'return' == r),
        (i = { instanceof: 1, delete: 1, void: 1, typeof: 1, return: 1 }.hasOwnProperty(
          r
        )),
        'require' == r
          ? (l = n
              ? /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?[.\w$]*\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*(['"]).+?\1\s*[),]/.test(
                  e
                )
              : /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*(['"]).+?\1\s*[),]/.test(e))
          : 'import' == r && (l = /^import[^(]*?['"]/.test(e)) && (l = 2),
        l
          ? ((u = c - 1),
            'require' == r
              ? ((r = n
                  ? /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?[.\w$]*\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*['"]/.exec(
                      e
                    )[0]
                  : /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*['"]/.exec(e)[0]),
                (c += r.length - 2),
                (s = /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?([.\w$]+)/.test(e)
                  ? /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?([.\w$]+)/.exec(e)[1]
                  : null))
              : 'import' === r &&
                ((r = /^import[^(]*?['"]/.exec(e)[0]),
                (c += r.length - 2),
                r.charAt(r.length - 1)))
          : (c += /^[\w$]+(?:\s*\.\s*[\w$]+)*/.exec(e)[0].length - 1)
    }
    function _() {
      var e,
        n = t.slice(c - 1)
      ;(e =
        '.' == r
          ? /^\.\d+(?:E[+-]?\d*)?\s*/i.exec(n)[0]
          : /^0x[\da-f]*/i.test(n)
          ? /^0x[\da-f]*\s*/i.exec(n)[0]
          : /^\d+\.?\d*(?:E[+-]?\d*)?\s*/i.exec(n)[0]),
        (c += e.length - 1),
        (f = 0)
    }
  },
  n_ = Ft(function (t, e) {
    ;(function () {
      var n,
        r = 'Expected a function',
        i = '__lodash_hash_undefined__',
        o = '__lodash_placeholder__',
        u = 16,
        s = 32,
        c = 64,
        a = 128,
        f = 256,
        l = 1 / 0,
        h = 9007199254740991,
        p = NaN,
        d = 4294967295,
        v = [
          ['ary', a],
          ['bind', 1],
          ['bindKey', 2],
          ['curry', 8],
          ['curryRight', u],
          ['flip', 512],
          ['partial', s],
          ['partialRight', c],
          ['rearg', f]
        ],
        y = '[object Arguments]',
        b = '[object Array]',
        g = '[object Boolean]',
        m = '[object Date]',
        D = '[object Error]',
        w = '[object Function]',
        _ = '[object GeneratorFunction]',
        E = '[object Map]',
        x = '[object Number]',
        S = '[object Object]',
        C = '[object Promise]',
        F = '[object RegExp]',
        O = '[object Set]',
        j = '[object String]',
        A = '[object Symbol]',
        k = '[object WeakMap]',
        I = '[object ArrayBuffer]',
        T = '[object DataView]',
        N = '[object Float32Array]',
        B = '[object Float64Array]',
        P = '[object Int8Array]',
        R = '[object Int16Array]',
        L = '[object Int32Array]',
        M = '[object Uint8Array]',
        U = '[object Uint8ClampedArray]',
        V = '[object Uint16Array]',
        $ = '[object Uint32Array]',
        z = /\b__p \+= '';/g,
        q = /\b(__p \+=) '' \+/g,
        W = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
        G = /&(?:amp|lt|gt|quot|#39);/g,
        K = /[&<>"']/g,
        Y = RegExp(G.source),
        H = RegExp(K.source),
        X = /<%-([\s\S]+?)%>/g,
        J = /<%([\s\S]+?)%>/g,
        Z = /<%=([\s\S]+?)%>/g,
        Q = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        tt = /^\w*$/,
        et = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        nt = /[\\^$.*+?()[\]{}|]/g,
        rt = RegExp(nt.source),
        it = /^\s+/,
        ot = /\s/,
        ut = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
        st = /\{\n\/\* \[wrapped with (.+)\] \*/,
        ct = /,? & /,
        at = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
        ft = /[()=,{}\[\]\/\s]/,
        lt = /\\(\\)?/g,
        ht = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
        pt = /\w*$/,
        dt = /^[-+]0x[0-9a-f]+$/i,
        vt = /^0b[01]+$/i,
        yt = /^\[object .+?Constructor\]$/,
        bt = /^0o[0-7]+$/i,
        gt = /^(?:0|[1-9]\d*)$/,
        mt = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
        Dt = /($^)/,
        wt = /['\n\r\u2028\u2029\\]/g,
        _t = '\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff',
        Et = '\\u2700-\\u27bf',
        xt = 'a-z\\xdf-\\xf6\\xf8-\\xff',
        Ct = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
        Ft = '\\ufe0e\\ufe0f',
        Ot =
          '\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
        jt = "['’]",
        At = '[\\ud800-\\udfff]',
        kt = '[' + Ot + ']',
        It = '[' + _t + ']',
        Tt = '\\d+',
        Nt = '[\\u2700-\\u27bf]',
        Bt = '[' + xt + ']',
        Pt = '[^\\ud800-\\udfff' + Ot + Tt + Et + xt + Ct + ']',
        Rt = '\\ud83c[\\udffb-\\udfff]',
        Lt = '[^\\ud800-\\udfff]',
        Mt = '(?:\\ud83c[\\udde6-\\uddff]){2}',
        Ut = '[\\ud800-\\udbff][\\udc00-\\udfff]',
        Vt = '[' + Ct + ']',
        $t = '(?:' + Bt + '|' + Pt + ')',
        zt = '(?:' + Vt + '|' + Pt + ')',
        qt = "(?:['’](?:d|ll|m|re|s|t|ve))?",
        Wt = "(?:['’](?:D|LL|M|RE|S|T|VE))?",
        Gt = '(?:' + It + '|' + Rt + ')' + '?',
        Kt = '[\\ufe0e\\ufe0f]?',
        Yt = Kt + Gt + ('(?:\\u200d(?:' + [Lt, Mt, Ut].join('|') + ')' + Kt + Gt + ')*'),
        Ht = '(?:' + [Nt, Mt, Ut].join('|') + ')' + Yt,
        Xt = '(?:' + [Lt + It + '?', It, Mt, Ut, At].join('|') + ')',
        Jt = RegExp(jt, 'g'),
        Zt = RegExp(It, 'g'),
        Qt = RegExp(Rt + '(?=' + Rt + ')|' + Xt + Yt, 'g'),
        te = RegExp(
          [
            Vt + '?' + Bt + '+' + qt + '(?=' + [kt, Vt, '$'].join('|') + ')',
            zt + '+' + Wt + '(?=' + [kt, Vt + $t, '$'].join('|') + ')',
            Vt + '?' + $t + '+' + qt,
            Vt + '+' + Wt,
            '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
            '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
            Tt,
            Ht
          ].join('|'),
          'g'
        ),
        ee = RegExp('[\\u200d\\ud800-\\udfff' + _t + Ft + ']'),
        ne = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
        re = [
          'Array',
          'Buffer',
          'DataView',
          'Date',
          'Error',
          'Float32Array',
          'Float64Array',
          'Function',
          'Int8Array',
          'Int16Array',
          'Int32Array',
          'Map',
          'Math',
          'Object',
          'Promise',
          'RegExp',
          'Set',
          'String',
          'Symbol',
          'TypeError',
          'Uint8Array',
          'Uint8ClampedArray',
          'Uint16Array',
          'Uint32Array',
          'WeakMap',
          '_',
          'clearTimeout',
          'isFinite',
          'parseInt',
          'setTimeout'
        ],
        ie = -1,
        oe = {}
      ;(oe[N] = oe[B] = oe[P] = oe[R] = oe[L] = oe[M] = oe[U] = oe[V] = oe[$] = !0),
        (oe[y] = oe[b] = oe[I] = oe[g] = oe[T] = oe[m] = oe[D] = oe[w] = oe[E] = oe[
          x
        ] = oe[S] = oe[F] = oe[O] = oe[j] = oe[k] = !1)
      var ue = {}
      ;(ue[y] = ue[b] = ue[I] = ue[T] = ue[g] = ue[m] = ue[N] = ue[B] = ue[P] = ue[
        R
      ] = ue[L] = ue[E] = ue[x] = ue[S] = ue[F] = ue[O] = ue[j] = ue[A] = ue[M] = ue[
        U
      ] = ue[V] = ue[$] = !0),
        (ue[D] = ue[w] = ue[k] = !1)
      var se = {
          '\\': '\\',
          "'": "'",
          '\n': 'n',
          '\r': 'r',
          '\u2028': 'u2028',
          '\u2029': 'u2029'
        },
        ce = parseFloat,
        ae = parseInt,
        fe = 'object' == typeof St && St && St.Object === Object && St,
        le = 'object' == typeof self && self && self.Object === Object && self,
        he = fe || le || Function('return this')(),
        pe = e && !e.nodeType && e,
        de = pe && t && !t.nodeType && t,
        ve = de && de.exports === pe,
        ye = ve && fe.process,
        be = (function () {
          try {
            var t = de && de.require && de.require('util').types
            return t || (ye && ye.binding && ye.binding('util'))
          } catch (t) {}
        })(),
        ge = be && be.isArrayBuffer,
        me = be && be.isDate,
        De = be && be.isMap,
        we = be && be.isRegExp,
        _e = be && be.isSet,
        Ee = be && be.isTypedArray
      function xe(t, e, n) {
        switch (n.length) {
          case 0:
            return t.call(e)
          case 1:
            return t.call(e, n[0])
          case 2:
            return t.call(e, n[0], n[1])
          case 3:
            return t.call(e, n[0], n[1], n[2])
        }
        return t.apply(e, n)
      }
      function Se(t, e, n, r) {
        for (var i = -1, o = null == t ? 0 : t.length; ++i < o; ) {
          var u = t[i]
          e(r, u, n(u), t)
        }
        return r
      }
      function Ce(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r && !1 !== e(t[n], n, t); );
        return t
      }
      function Fe(t, e) {
        for (var n = null == t ? 0 : t.length; n-- && !1 !== e(t[n], n, t); );
        return t
      }
      function Oe(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r; )
          if (!e(t[n], n, t)) return !1
        return !0
      }
      function je(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length, i = 0, o = []; ++n < r; ) {
          var u = t[n]
          e(u, n, t) && (o[i++] = u)
        }
        return o
      }
      function Ae(t, e) {
        return !!(null == t ? 0 : t.length) && Ue(t, e, 0) > -1
      }
      function ke(t, e, n) {
        for (var r = -1, i = null == t ? 0 : t.length; ++r < i; )
          if (n(e, t[r])) return !0
        return !1
      }
      function Ie(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length, i = Array(r); ++n < r; )
          i[n] = e(t[n], n, t)
        return i
      }
      function Te(t, e) {
        for (var n = -1, r = e.length, i = t.length; ++n < r; ) t[i + n] = e[n]
        return t
      }
      function Ne(t, e, n, r) {
        var i = -1,
          o = null == t ? 0 : t.length
        for (r && o && (n = t[++i]); ++i < o; ) n = e(n, t[i], i, t)
        return n
      }
      function Be(t, e, n, r) {
        var i = null == t ? 0 : t.length
        for (r && i && (n = t[--i]); i--; ) n = e(n, t[i], i, t)
        return n
      }
      function Pe(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r; )
          if (e(t[n], n, t)) return !0
        return !1
      }
      var Re = qe('length')
      function Le(t, e, n) {
        var r
        return (
          n(t, function (t, n, i) {
            if (e(t, n, i)) return (r = n), !1
          }),
          r
        )
      }
      function Me(t, e, n, r) {
        for (var i = t.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i; )
          if (e(t[o], o, t)) return o
        return -1
      }
      function Ue(t, e, n) {
        return e == e
          ? (function (t, e, n) {
              var r = n - 1,
                i = t.length
              for (; ++r < i; ) if (t[r] === e) return r
              return -1
            })(t, e, n)
          : Me(t, $e, n)
      }
      function Ve(t, e, n, r) {
        for (var i = n - 1, o = t.length; ++i < o; ) if (r(t[i], e)) return i
        return -1
      }
      function $e(t) {
        return t != t
      }
      function ze(t, e) {
        var n = null == t ? 0 : t.length
        return n ? Ke(t, e) / n : p
      }
      function qe(t) {
        return function (e) {
          return null == e ? n : e[t]
        }
      }
      function We(t) {
        return function (e) {
          return null == t ? n : t[e]
        }
      }
      function Ge(t, e, n, r, i) {
        return (
          i(t, function (t, i, o) {
            n = r ? ((r = !1), t) : e(n, t, i, o)
          }),
          n
        )
      }
      function Ke(t, e) {
        for (var r, i = -1, o = t.length; ++i < o; ) {
          var u = e(t[i])
          u !== n && (r = r === n ? u : r + u)
        }
        return r
      }
      function Ye(t, e) {
        for (var n = -1, r = Array(t); ++n < t; ) r[n] = e(n)
        return r
      }
      function He(t) {
        return t ? t.slice(0, dn(t) + 1).replace(it, '') : t
      }
      function Xe(t) {
        return function (e) {
          return t(e)
        }
      }
      function Je(t, e) {
        return Ie(e, function (e) {
          return t[e]
        })
      }
      function Ze(t, e) {
        return t.has(e)
      }
      function Qe(t, e) {
        for (var n = -1, r = t.length; ++n < r && Ue(e, t[n], 0) > -1; );
        return n
      }
      function tn(t, e) {
        for (var n = t.length; n-- && Ue(e, t[n], 0) > -1; );
        return n
      }
      function en(t, e) {
        for (var n = t.length, r = 0; n--; ) t[n] === e && ++r
        return r
      }
      var nn = We({
          À: 'A',
          Á: 'A',
          Â: 'A',
          Ã: 'A',
          Ä: 'A',
          Å: 'A',
          à: 'a',
          á: 'a',
          â: 'a',
          ã: 'a',
          ä: 'a',
          å: 'a',
          Ç: 'C',
          ç: 'c',
          Ð: 'D',
          ð: 'd',
          È: 'E',
          É: 'E',
          Ê: 'E',
          Ë: 'E',
          è: 'e',
          é: 'e',
          ê: 'e',
          ë: 'e',
          Ì: 'I',
          Í: 'I',
          Î: 'I',
          Ï: 'I',
          ì: 'i',
          í: 'i',
          î: 'i',
          ï: 'i',
          Ñ: 'N',
          ñ: 'n',
          Ò: 'O',
          Ó: 'O',
          Ô: 'O',
          Õ: 'O',
          Ö: 'O',
          Ø: 'O',
          ò: 'o',
          ó: 'o',
          ô: 'o',
          õ: 'o',
          ö: 'o',
          ø: 'o',
          Ù: 'U',
          Ú: 'U',
          Û: 'U',
          Ü: 'U',
          ù: 'u',
          ú: 'u',
          û: 'u',
          ü: 'u',
          Ý: 'Y',
          ý: 'y',
          ÿ: 'y',
          Æ: 'Ae',
          æ: 'ae',
          Þ: 'Th',
          þ: 'th',
          ß: 'ss',
          Ā: 'A',
          Ă: 'A',
          Ą: 'A',
          ā: 'a',
          ă: 'a',
          ą: 'a',
          Ć: 'C',
          Ĉ: 'C',
          Ċ: 'C',
          Č: 'C',
          ć: 'c',
          ĉ: 'c',
          ċ: 'c',
          č: 'c',
          Ď: 'D',
          Đ: 'D',
          ď: 'd',
          đ: 'd',
          Ē: 'E',
          Ĕ: 'E',
          Ė: 'E',
          Ę: 'E',
          Ě: 'E',
          ē: 'e',
          ĕ: 'e',
          ė: 'e',
          ę: 'e',
          ě: 'e',
          Ĝ: 'G',
          Ğ: 'G',
          Ġ: 'G',
          Ģ: 'G',
          ĝ: 'g',
          ğ: 'g',
          ġ: 'g',
          ģ: 'g',
          Ĥ: 'H',
          Ħ: 'H',
          ĥ: 'h',
          ħ: 'h',
          Ĩ: 'I',
          Ī: 'I',
          Ĭ: 'I',
          Į: 'I',
          İ: 'I',
          ĩ: 'i',
          ī: 'i',
          ĭ: 'i',
          į: 'i',
          ı: 'i',
          Ĵ: 'J',
          ĵ: 'j',
          Ķ: 'K',
          ķ: 'k',
          ĸ: 'k',
          Ĺ: 'L',
          Ļ: 'L',
          Ľ: 'L',
          Ŀ: 'L',
          Ł: 'L',
          ĺ: 'l',
          ļ: 'l',
          ľ: 'l',
          ŀ: 'l',
          ł: 'l',
          Ń: 'N',
          Ņ: 'N',
          Ň: 'N',
          Ŋ: 'N',
          ń: 'n',
          ņ: 'n',
          ň: 'n',
          ŋ: 'n',
          Ō: 'O',
          Ŏ: 'O',
          Ő: 'O',
          ō: 'o',
          ŏ: 'o',
          ő: 'o',
          Ŕ: 'R',
          Ŗ: 'R',
          Ř: 'R',
          ŕ: 'r',
          ŗ: 'r',
          ř: 'r',
          Ś: 'S',
          Ŝ: 'S',
          Ş: 'S',
          Š: 'S',
          ś: 's',
          ŝ: 's',
          ş: 's',
          š: 's',
          Ţ: 'T',
          Ť: 'T',
          Ŧ: 'T',
          ţ: 't',
          ť: 't',
          ŧ: 't',
          Ũ: 'U',
          Ū: 'U',
          Ŭ: 'U',
          Ů: 'U',
          Ű: 'U',
          Ų: 'U',
          ũ: 'u',
          ū: 'u',
          ŭ: 'u',
          ů: 'u',
          ű: 'u',
          ų: 'u',
          Ŵ: 'W',
          ŵ: 'w',
          Ŷ: 'Y',
          ŷ: 'y',
          Ÿ: 'Y',
          Ź: 'Z',
          Ż: 'Z',
          Ž: 'Z',
          ź: 'z',
          ż: 'z',
          ž: 'z',
          Ĳ: 'IJ',
          ĳ: 'ij',
          Œ: 'Oe',
          œ: 'oe',
          ŉ: "'n",
          ſ: 's'
        }),
        rn = We({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })
      function on(t) {
        return '\\' + se[t]
      }
      function un(t) {
        return ee.test(t)
      }
      function sn(t) {
        var e = -1,
          n = Array(t.size)
        return (
          t.forEach(function (t, r) {
            n[++e] = [r, t]
          }),
          n
        )
      }
      function cn(t, e) {
        return function (n) {
          return t(e(n))
        }
      }
      function an(t, e) {
        for (var n = -1, r = t.length, i = 0, u = []; ++n < r; ) {
          var s = t[n]
          ;(s !== e && s !== o) || ((t[n] = o), (u[i++] = n))
        }
        return u
      }
      function fn(t) {
        var e = -1,
          n = Array(t.size)
        return (
          t.forEach(function (t) {
            n[++e] = t
          }),
          n
        )
      }
      function ln(t) {
        var e = -1,
          n = Array(t.size)
        return (
          t.forEach(function (t) {
            n[++e] = [t, t]
          }),
          n
        )
      }
      function hn(t) {
        return un(t)
          ? (function (t) {
              var e = (Qt.lastIndex = 0)
              for (; Qt.test(t); ) ++e
              return e
            })(t)
          : Re(t)
      }
      function pn(t) {
        return un(t)
          ? (function (t) {
              return t.match(Qt) || []
            })(t)
          : (function (t) {
              return t.split('')
            })(t)
      }
      function dn(t) {
        for (var e = t.length; e-- && ot.test(t.charAt(e)); );
        return e
      }
      var vn = We({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })
      var yn = (function t(e) {
        var ot = (e = null == e ? he : yn.defaults(he.Object(), e, yn.pick(he, re)))
            .Array,
          _t = e.Date,
          Et = e.Error,
          xt = e.Function,
          St = e.Math,
          Ct = e.Object,
          Ft = e.RegExp,
          Ot = e.String,
          jt = e.TypeError,
          At = ot.prototype,
          kt = xt.prototype,
          It = Ct.prototype,
          Tt = e['__core-js_shared__'],
          Nt = kt.toString,
          Bt = It.hasOwnProperty,
          Pt = 0,
          Rt = (function () {
            var t = /[^.]+$/.exec((Tt && Tt.keys && Tt.keys.IE_PROTO) || '')
            return t ? 'Symbol(src)_1.' + t : ''
          })(),
          Lt = It.toString,
          Mt = Nt.call(Ct),
          Ut = he._,
          Vt = Ft(
            '^' +
              Nt.call(Bt)
                .replace(nt, '\\$&')
                .replace(
                  /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                  '$1.*?'
                ) +
              '$'
          ),
          $t = ve ? e.Buffer : n,
          zt = e.Symbol,
          qt = e.Uint8Array,
          Wt = $t ? $t.allocUnsafe : n,
          Gt = cn(Ct.getPrototypeOf, Ct),
          Kt = Ct.create,
          Yt = It.propertyIsEnumerable,
          Ht = At.splice,
          Xt = zt ? zt.isConcatSpreadable : n,
          Qt = zt ? zt.iterator : n,
          ee = zt ? zt.toStringTag : n,
          se = (function () {
            try {
              var t = ho(Ct, 'defineProperty')
              return t({}, '', {}), t
            } catch (t) {}
          })(),
          fe = e.clearTimeout !== he.clearTimeout && e.clearTimeout,
          le = _t && _t.now !== he.Date.now && _t.now,
          pe = e.setTimeout !== he.setTimeout && e.setTimeout,
          de = St.ceil,
          ye = St.floor,
          be = Ct.getOwnPropertySymbols,
          Re = $t ? $t.isBuffer : n,
          We = e.isFinite,
          bn = At.join,
          gn = cn(Ct.keys, Ct),
          mn = St.max,
          Dn = St.min,
          wn = _t.now,
          _n = e.parseInt,
          En = St.random,
          xn = At.reverse,
          Sn = ho(e, 'DataView'),
          Cn = ho(e, 'Map'),
          Fn = ho(e, 'Promise'),
          On = ho(e, 'Set'),
          jn = ho(e, 'WeakMap'),
          An = ho(Ct, 'create'),
          kn = jn && new jn(),
          In = {},
          Tn = Uo(Sn),
          Nn = Uo(Cn),
          Bn = Uo(Fn),
          Pn = Uo(On),
          Rn = Uo(jn),
          Ln = zt ? zt.prototype : n,
          Mn = Ln ? Ln.valueOf : n,
          Un = Ln ? Ln.toString : n
        function Vn(t) {
          if (rs(t) && !Gu(t) && !(t instanceof Wn)) {
            if (t instanceof qn) return t
            if (Bt.call(t, '__wrapped__')) return Vo(t)
          }
          return new qn(t)
        }
        var $n = (function () {
          function t() {}
          return function (e) {
            if (!ns(e)) return {}
            if (Kt) return Kt(e)
            t.prototype = e
            var r = new t()
            return (t.prototype = n), r
          }
        })()
        function zn() {}
        function qn(t, e) {
          ;(this.__wrapped__ = t),
            (this.__actions__ = []),
            (this.__chain__ = !!e),
            (this.__index__ = 0),
            (this.__values__ = n)
        }
        function Wn(t) {
          ;(this.__wrapped__ = t),
            (this.__actions__ = []),
            (this.__dir__ = 1),
            (this.__filtered__ = !1),
            (this.__iteratees__ = []),
            (this.__takeCount__ = d),
            (this.__views__ = [])
        }
        function Gn(t) {
          var e = -1,
            n = null == t ? 0 : t.length
          for (this.clear(); ++e < n; ) {
            var r = t[e]
            this.set(r[0], r[1])
          }
        }
        function Kn(t) {
          var e = -1,
            n = null == t ? 0 : t.length
          for (this.clear(); ++e < n; ) {
            var r = t[e]
            this.set(r[0], r[1])
          }
        }
        function Yn(t) {
          var e = -1,
            n = null == t ? 0 : t.length
          for (this.clear(); ++e < n; ) {
            var r = t[e]
            this.set(r[0], r[1])
          }
        }
        function Hn(t) {
          var e = -1,
            n = null == t ? 0 : t.length
          for (this.__data__ = new Yn(); ++e < n; ) this.add(t[e])
        }
        function Xn(t) {
          var e = (this.__data__ = new Kn(t))
          this.size = e.size
        }
        function Jn(t, e) {
          var n = Gu(t),
            r = !n && Wu(t),
            i = !n && !r && Xu(t),
            o = !n && !r && !i && ls(t),
            u = n || r || i || o,
            s = u ? Ye(t.length, Ot) : [],
            c = s.length
          for (var a in t)
            (!e && !Bt.call(t, a)) ||
              (u &&
                ('length' == a ||
                  (i && ('offset' == a || 'parent' == a)) ||
                  (o && ('buffer' == a || 'byteLength' == a || 'byteOffset' == a)) ||
                  Do(a, c))) ||
              s.push(a)
          return s
        }
        function Zn(t) {
          var e = t.length
          return e ? t[Hr(0, e - 1)] : n
        }
        function Qn(t, e) {
          return Ro(Ai(t), cr(e, 0, t.length))
        }
        function tr(t) {
          return Ro(Ai(t))
        }
        function er(t, e, r) {
          ;((r !== n && !$u(t[e], r)) || (r === n && !(e in t))) && ur(t, e, r)
        }
        function nr(t, e, r) {
          var i = t[e]
          ;(Bt.call(t, e) && $u(i, r) && (r !== n || e in t)) || ur(t, e, r)
        }
        function rr(t, e) {
          for (var n = t.length; n--; ) if ($u(t[n][0], e)) return n
          return -1
        }
        function ir(t, e, n, r) {
          return (
            pr(t, function (t, i, o) {
              e(r, t, n(t), o)
            }),
            r
          )
        }
        function or(t, e) {
          return t && ki(e, Ts(e), t)
        }
        function ur(t, e, n) {
          '__proto__' == e && se
            ? se(t, e, { configurable: !0, enumerable: !0, value: n, writable: !0 })
            : (t[e] = n)
        }
        function sr(t, e) {
          for (var r = -1, i = e.length, o = ot(i), u = null == t; ++r < i; )
            o[r] = u ? n : Os(t, e[r])
          return o
        }
        function cr(t, e, r) {
          return (
            t == t && (r !== n && (t = t <= r ? t : r), e !== n && (t = t >= e ? t : e)),
            t
          )
        }
        function ar(t, e, r, i, o, u) {
          var s,
            c = 1 & e,
            a = 2 & e,
            f = 4 & e
          if ((r && (s = o ? r(t, i, o, u) : r(t)), s !== n)) return s
          if (!ns(t)) return t
          var l = Gu(t)
          if (l) {
            if (
              ((s = (function (t) {
                var e = t.length,
                  n = new t.constructor(e)
                e &&
                  'string' == typeof t[0] &&
                  Bt.call(t, 'index') &&
                  ((n.index = t.index), (n.input = t.input))
                return n
              })(t)),
              !c)
            )
              return Ai(t, s)
          } else {
            var h = yo(t),
              p = h == w || h == _
            if (Xu(t)) return xi(t, c)
            if (h == S || h == y || (p && !o)) {
              if (((s = a || p ? {} : go(t)), !c))
                return a
                  ? (function (t, e) {
                      return ki(t, vo(t), e)
                    })(
                      t,
                      (function (t, e) {
                        return t && ki(e, Ns(e), t)
                      })(s, t)
                    )
                  : (function (t, e) {
                      return ki(t, po(t), e)
                    })(t, or(s, t))
            } else {
              if (!ue[h]) return o ? t : {}
              s = (function (t, e, n) {
                var r = t.constructor
                switch (e) {
                  case I:
                    return Si(t)
                  case g:
                  case m:
                    return new r(+t)
                  case T:
                    return (function (t, e) {
                      var n = e ? Si(t.buffer) : t.buffer
                      return new t.constructor(n, t.byteOffset, t.byteLength)
                    })(t, n)
                  case N:
                  case B:
                  case P:
                  case R:
                  case L:
                  case M:
                  case U:
                  case V:
                  case $:
                    return Ci(t, n)
                  case E:
                    return new r()
                  case x:
                  case j:
                    return new r(t)
                  case F:
                    return (function (t) {
                      var e = new t.constructor(t.source, pt.exec(t))
                      return (e.lastIndex = t.lastIndex), e
                    })(t)
                  case O:
                    return new r()
                  case A:
                    return (i = t), Mn ? Ct(Mn.call(i)) : {}
                }
                var i
              })(t, h, c)
            }
          }
          u || (u = new Xn())
          var d = u.get(t)
          if (d) return d
          u.set(t, s),
            cs(t)
              ? t.forEach(function (n) {
                  s.add(ar(n, e, r, n, t, u))
                })
              : is(t) &&
                t.forEach(function (n, i) {
                  s.set(i, ar(n, e, r, i, t, u))
                })
          var v = l ? n : (f ? (a ? oo : io) : a ? Ns : Ts)(t)
          return (
            Ce(v || t, function (n, i) {
              v && (n = t[(i = n)]), nr(s, i, ar(n, e, r, i, t, u))
            }),
            s
          )
        }
        function fr(t, e, r) {
          var i = r.length
          if (null == t) return !i
          for (t = Ct(t); i--; ) {
            var o = r[i],
              u = e[o],
              s = t[o]
            if ((s === n && !(o in t)) || !u(s)) return !1
          }
          return !0
        }
        function lr(t, e, i) {
          if ('function' != typeof t) throw new jt(r)
          return To(function () {
            t.apply(n, i)
          }, e)
        }
        function hr(t, e, n, r) {
          var i = -1,
            o = Ae,
            u = !0,
            s = t.length,
            c = [],
            a = e.length
          if (!s) return c
          n && (e = Ie(e, Xe(n))),
            r
              ? ((o = ke), (u = !1))
              : e.length >= 200 && ((o = Ze), (u = !1), (e = new Hn(e)))
          t: for (; ++i < s; ) {
            var f = t[i],
              l = null == n ? f : n(f)
            if (((f = r || 0 !== f ? f : 0), u && l == l)) {
              for (var h = a; h--; ) if (e[h] === l) continue t
              c.push(f)
            } else o(e, l, r) || c.push(f)
          }
          return c
        }
        ;(Vn.templateSettings = {
          escape: X,
          evaluate: J,
          interpolate: Z,
          variable: '',
          imports: { _: Vn }
        }),
          (Vn.prototype = zn.prototype),
          (Vn.prototype.constructor = Vn),
          (qn.prototype = $n(zn.prototype)),
          (qn.prototype.constructor = qn),
          (Wn.prototype = $n(zn.prototype)),
          (Wn.prototype.constructor = Wn),
          (Gn.prototype.clear = function () {
            ;(this.__data__ = An ? An(null) : {}), (this.size = 0)
          }),
          (Gn.prototype.delete = function (t) {
            var e = this.has(t) && delete this.__data__[t]
            return (this.size -= e ? 1 : 0), e
          }),
          (Gn.prototype.get = function (t) {
            var e = this.__data__
            if (An) {
              var r = e[t]
              return r === i ? n : r
            }
            return Bt.call(e, t) ? e[t] : n
          }),
          (Gn.prototype.has = function (t) {
            var e = this.__data__
            return An ? e[t] !== n : Bt.call(e, t)
          }),
          (Gn.prototype.set = function (t, e) {
            var r = this.__data__
            return (
              (this.size += this.has(t) ? 0 : 1), (r[t] = An && e === n ? i : e), this
            )
          }),
          (Kn.prototype.clear = function () {
            ;(this.__data__ = []), (this.size = 0)
          }),
          (Kn.prototype.delete = function (t) {
            var e = this.__data__,
              n = rr(e, t)
            return (
              !(n < 0) &&
              (n == e.length - 1 ? e.pop() : Ht.call(e, n, 1), --this.size, !0)
            )
          }),
          (Kn.prototype.get = function (t) {
            var e = this.__data__,
              r = rr(e, t)
            return r < 0 ? n : e[r][1]
          }),
          (Kn.prototype.has = function (t) {
            return rr(this.__data__, t) > -1
          }),
          (Kn.prototype.set = function (t, e) {
            var n = this.__data__,
              r = rr(n, t)
            return r < 0 ? (++this.size, n.push([t, e])) : (n[r][1] = e), this
          }),
          (Yn.prototype.clear = function () {
            ;(this.size = 0),
              (this.__data__ = {
                hash: new Gn(),
                map: new (Cn || Kn)(),
                string: new Gn()
              })
          }),
          (Yn.prototype.delete = function (t) {
            var e = fo(this, t).delete(t)
            return (this.size -= e ? 1 : 0), e
          }),
          (Yn.prototype.get = function (t) {
            return fo(this, t).get(t)
          }),
          (Yn.prototype.has = function (t) {
            return fo(this, t).has(t)
          }),
          (Yn.prototype.set = function (t, e) {
            var n = fo(this, t),
              r = n.size
            return n.set(t, e), (this.size += n.size == r ? 0 : 1), this
          }),
          (Hn.prototype.add = Hn.prototype.push = function (t) {
            return this.__data__.set(t, i), this
          }),
          (Hn.prototype.has = function (t) {
            return this.__data__.has(t)
          }),
          (Xn.prototype.clear = function () {
            ;(this.__data__ = new Kn()), (this.size = 0)
          }),
          (Xn.prototype.delete = function (t) {
            var e = this.__data__,
              n = e.delete(t)
            return (this.size = e.size), n
          }),
          (Xn.prototype.get = function (t) {
            return this.__data__.get(t)
          }),
          (Xn.prototype.has = function (t) {
            return this.__data__.has(t)
          }),
          (Xn.prototype.set = function (t, e) {
            var n = this.__data__
            if (n instanceof Kn) {
              var r = n.__data__
              if (!Cn || r.length < 199)
                return r.push([t, e]), (this.size = ++n.size), this
              n = this.__data__ = new Yn(r)
            }
            return n.set(t, e), (this.size = n.size), this
          })
        var pr = Ni(wr),
          dr = Ni(_r, !0)
        function vr(t, e) {
          var n = !0
          return (
            pr(t, function (t, r, i) {
              return (n = !!e(t, r, i))
            }),
            n
          )
        }
        function yr(t, e, r) {
          for (var i = -1, o = t.length; ++i < o; ) {
            var u = t[i],
              s = e(u)
            if (null != s && (c === n ? s == s && !fs(s) : r(s, c)))
              var c = s,
                a = u
          }
          return a
        }
        function br(t, e) {
          var n = []
          return (
            pr(t, function (t, r, i) {
              e(t, r, i) && n.push(t)
            }),
            n
          )
        }
        function gr(t, e, n, r, i) {
          var o = -1,
            u = t.length
          for (n || (n = mo), i || (i = []); ++o < u; ) {
            var s = t[o]
            e > 0 && n(s)
              ? e > 1
                ? gr(s, e - 1, n, r, i)
                : Te(i, s)
              : r || (i[i.length] = s)
          }
          return i
        }
        var mr = Bi(),
          Dr = Bi(!0)
        function wr(t, e) {
          return t && mr(t, e, Ts)
        }
        function _r(t, e) {
          return t && Dr(t, e, Ts)
        }
        function Er(t, e) {
          return je(e, function (e) {
            return Qu(t[e])
          })
        }
        function xr(t, e) {
          for (var r = 0, i = (e = Di(e, t)).length; null != t && r < i; )
            t = t[Mo(e[r++])]
          return r && r == i ? t : n
        }
        function Sr(t, e, n) {
          var r = e(t)
          return Gu(t) ? r : Te(r, n(t))
        }
        function Cr(t) {
          return null == t
            ? t === n
              ? '[object Undefined]'
              : '[object Null]'
            : ee && ee in Ct(t)
            ? (function (t) {
                var e = Bt.call(t, ee),
                  r = t[ee]
                try {
                  t[ee] = n
                  var i = !0
                } catch (t) {}
                var o = Lt.call(t)
                i && (e ? (t[ee] = r) : delete t[ee])
                return o
              })(t)
            : (function (t) {
                return Lt.call(t)
              })(t)
        }
        function Fr(t, e) {
          return t > e
        }
        function Or(t, e) {
          return null != t && Bt.call(t, e)
        }
        function jr(t, e) {
          return null != t && e in Ct(t)
        }
        function Ar(t, e, r) {
          for (
            var i = r ? ke : Ae,
              o = t[0].length,
              u = t.length,
              s = u,
              c = ot(u),
              a = 1 / 0,
              f = [];
            s--;

          ) {
            var l = t[s]
            s && e && (l = Ie(l, Xe(e))),
              (a = Dn(l.length, a)),
              (c[s] = !r && (e || (o >= 120 && l.length >= 120)) ? new Hn(s && l) : n)
          }
          l = t[0]
          var h = -1,
            p = c[0]
          t: for (; ++h < o && f.length < a; ) {
            var d = l[h],
              v = e ? e(d) : d
            if (((d = r || 0 !== d ? d : 0), !(p ? Ze(p, v) : i(f, v, r)))) {
              for (s = u; --s; ) {
                var y = c[s]
                if (!(y ? Ze(y, v) : i(t[s], v, r))) continue t
              }
              p && p.push(v), f.push(d)
            }
          }
          return f
        }
        function kr(t, e, r) {
          var i = null == (t = jo(t, (e = Di(e, t)))) ? t : t[Mo(Zo(e))]
          return null == i ? n : xe(i, t, r)
        }
        function Ir(t) {
          return rs(t) && Cr(t) == y
        }
        function Tr(t, e, r, i, o) {
          return (
            t === e ||
            (null == t || null == e || (!rs(t) && !rs(e))
              ? t != t && e != e
              : (function (t, e, r, i, o, u) {
                  var s = Gu(t),
                    c = Gu(e),
                    a = s ? b : yo(t),
                    f = c ? b : yo(e),
                    l = (a = a == y ? S : a) == S,
                    h = (f = f == y ? S : f) == S,
                    p = a == f
                  if (p && Xu(t)) {
                    if (!Xu(e)) return !1
                    ;(s = !0), (l = !1)
                  }
                  if (p && !l)
                    return (
                      u || (u = new Xn()),
                      s || ls(t)
                        ? no(t, e, r, i, o, u)
                        : (function (t, e, n, r, i, o, u) {
                            switch (n) {
                              case T:
                                if (
                                  t.byteLength != e.byteLength ||
                                  t.byteOffset != e.byteOffset
                                )
                                  return !1
                                ;(t = t.buffer), (e = e.buffer)
                              case I:
                                return !(
                                  t.byteLength != e.byteLength || !o(new qt(t), new qt(e))
                                )
                              case g:
                              case m:
                              case x:
                                return $u(+t, +e)
                              case D:
                                return t.name == e.name && t.message == e.message
                              case F:
                              case j:
                                return t == e + ''
                              case E:
                                var s = sn
                              case O:
                                var c = 1 & r
                                if ((s || (s = fn), t.size != e.size && !c)) return !1
                                var a = u.get(t)
                                if (a) return a == e
                                ;(r |= 2), u.set(t, e)
                                var f = no(s(t), s(e), r, i, o, u)
                                return u.delete(t), f
                              case A:
                                if (Mn) return Mn.call(t) == Mn.call(e)
                            }
                            return !1
                          })(t, e, a, r, i, o, u)
                    )
                  if (!(1 & r)) {
                    var d = l && Bt.call(t, '__wrapped__'),
                      v = h && Bt.call(e, '__wrapped__')
                    if (d || v) {
                      var w = d ? t.value() : t,
                        _ = v ? e.value() : e
                      return u || (u = new Xn()), o(w, _, r, i, u)
                    }
                  }
                  if (!p) return !1
                  return (
                    u || (u = new Xn()),
                    (function (t, e, r, i, o, u) {
                      var s = 1 & r,
                        c = io(t),
                        a = c.length,
                        f = io(e).length
                      if (a != f && !s) return !1
                      var l = a
                      for (; l--; ) {
                        var h = c[l]
                        if (!(s ? h in e : Bt.call(e, h))) return !1
                      }
                      var p = u.get(t),
                        d = u.get(e)
                      if (p && d) return p == e && d == t
                      var v = !0
                      u.set(t, e), u.set(e, t)
                      var y = s
                      for (; ++l < a; ) {
                        var b = t[(h = c[l])],
                          g = e[h]
                        if (i) var m = s ? i(g, b, h, e, t, u) : i(b, g, h, t, e, u)
                        if (!(m === n ? b === g || o(b, g, r, i, u) : m)) {
                          v = !1
                          break
                        }
                        y || (y = 'constructor' == h)
                      }
                      if (v && !y) {
                        var D = t.constructor,
                          w = e.constructor
                        D == w ||
                          !('constructor' in t) ||
                          !('constructor' in e) ||
                          ('function' == typeof D &&
                            D instanceof D &&
                            'function' == typeof w &&
                            w instanceof w) ||
                          (v = !1)
                      }
                      return u.delete(t), u.delete(e), v
                    })(t, e, r, i, o, u)
                  )
                })(t, e, r, i, Tr, o))
          )
        }
        function Nr(t, e, r, i) {
          var o = r.length,
            u = o,
            s = !i
          if (null == t) return !u
          for (t = Ct(t); o--; ) {
            var c = r[o]
            if (s && c[2] ? c[1] !== t[c[0]] : !(c[0] in t)) return !1
          }
          for (; ++o < u; ) {
            var a = (c = r[o])[0],
              f = t[a],
              l = c[1]
            if (s && c[2]) {
              if (f === n && !(a in t)) return !1
            } else {
              var h = new Xn()
              if (i) var p = i(f, l, a, t, e, h)
              if (!(p === n ? Tr(l, f, 3, i, h) : p)) return !1
            }
          }
          return !0
        }
        function Br(t) {
          return !(!ns(t) || ((e = t), Rt && Rt in e)) && (Qu(t) ? Vt : yt).test(Uo(t))
          var e
        }
        function Pr(t) {
          return 'function' == typeof t
            ? t
            : null == t
            ? oc
            : 'object' == typeof t
            ? Gu(t)
              ? $r(t[0], t[1])
              : Vr(t)
            : dc(t)
        }
        function Rr(t) {
          if (!So(t)) return gn(t)
          var e = []
          for (var n in Ct(t)) Bt.call(t, n) && 'constructor' != n && e.push(n)
          return e
        }
        function Lr(t) {
          if (!ns(t))
            return (function (t) {
              var e = []
              if (null != t) for (var n in Ct(t)) e.push(n)
              return e
            })(t)
          var e = So(t),
            n = []
          for (var r in t) ('constructor' != r || (!e && Bt.call(t, r))) && n.push(r)
          return n
        }
        function Mr(t, e) {
          return t < e
        }
        function Ur(t, e) {
          var n = -1,
            r = Yu(t) ? ot(t.length) : []
          return (
            pr(t, function (t, i, o) {
              r[++n] = e(t, i, o)
            }),
            r
          )
        }
        function Vr(t) {
          var e = lo(t)
          return 1 == e.length && e[0][2]
            ? Fo(e[0][0], e[0][1])
            : function (n) {
                return n === t || Nr(n, t, e)
              }
        }
        function $r(t, e) {
          return _o(t) && Co(e)
            ? Fo(Mo(t), e)
            : function (r) {
                var i = Os(r, t)
                return i === n && i === e ? js(r, t) : Tr(e, i, 3)
              }
        }
        function zr(t, e, r, i, o) {
          t !== e &&
            mr(
              e,
              function (u, s) {
                if ((o || (o = new Xn()), ns(u)))
                  !(function (t, e, r, i, o, u, s) {
                    var c = ko(t, r),
                      a = ko(e, r),
                      f = s.get(a)
                    if (f) return void er(t, r, f)
                    var l = u ? u(c, a, r + '', t, e, s) : n,
                      h = l === n
                    if (h) {
                      var p = Gu(a),
                        d = !p && Xu(a),
                        v = !p && !d && ls(a)
                      ;(l = a),
                        p || d || v
                          ? Gu(c)
                            ? (l = c)
                            : Hu(c)
                            ? (l = Ai(c))
                            : d
                            ? ((h = !1), (l = xi(a, !0)))
                            : v
                            ? ((h = !1), (l = Ci(a, !0)))
                            : (l = [])
                          : us(a) || Wu(a)
                          ? ((l = c),
                            Wu(c) ? (l = ms(c)) : (ns(c) && !Qu(c)) || (l = go(a)))
                          : (h = !1)
                    }
                    h && (s.set(a, l), o(l, a, i, u, s), s.delete(a))
                    er(t, r, l)
                  })(t, e, s, r, zr, i, o)
                else {
                  var c = i ? i(ko(t, s), u, s + '', t, e, o) : n
                  c === n && (c = u), er(t, s, c)
                }
              },
              Ns
            )
        }
        function qr(t, e) {
          var r = t.length
          if (r) return Do((e += e < 0 ? r : 0), r) ? t[e] : n
        }
        function Wr(t, e, n) {
          e = e.length
            ? Ie(e, function (t) {
                return Gu(t)
                  ? function (e) {
                      return xr(e, 1 === t.length ? t[0] : t)
                    }
                  : t
              })
            : [oc]
          var r = -1
          return (
            (e = Ie(e, Xe(ao()))),
            (function (t, e) {
              var n = t.length
              for (t.sort(e); n--; ) t[n] = t[n].value
              return t
            })(
              Ur(t, function (t, n, i) {
                return {
                  criteria: Ie(e, function (e) {
                    return e(t)
                  }),
                  index: ++r,
                  value: t
                }
              }),
              function (t, e) {
                return (function (t, e, n) {
                  var r = -1,
                    i = t.criteria,
                    o = e.criteria,
                    u = i.length,
                    s = n.length
                  for (; ++r < u; ) {
                    var c = Fi(i[r], o[r])
                    if (c) return r >= s ? c : c * ('desc' == n[r] ? -1 : 1)
                  }
                  return t.index - e.index
                })(t, e, n)
              }
            )
          )
        }
        function Gr(t, e, n) {
          for (var r = -1, i = e.length, o = {}; ++r < i; ) {
            var u = e[r],
              s = xr(t, u)
            n(s, u) && ti(o, Di(u, t), s)
          }
          return o
        }
        function Kr(t, e, n, r) {
          var i = r ? Ve : Ue,
            o = -1,
            u = e.length,
            s = t
          for (t === e && (e = Ai(e)), n && (s = Ie(t, Xe(n))); ++o < u; )
            for (var c = 0, a = e[o], f = n ? n(a) : a; (c = i(s, f, c, r)) > -1; )
              s !== t && Ht.call(s, c, 1), Ht.call(t, c, 1)
          return t
        }
        function Yr(t, e) {
          for (var n = t ? e.length : 0, r = n - 1; n--; ) {
            var i = e[n]
            if (n == r || i !== o) {
              var o = i
              Do(i) ? Ht.call(t, i, 1) : hi(t, i)
            }
          }
          return t
        }
        function Hr(t, e) {
          return t + ye(En() * (e - t + 1))
        }
        function Xr(t, e) {
          var n = ''
          if (!t || e < 1 || e > h) return n
          do {
            e % 2 && (n += t), (e = ye(e / 2)) && (t += t)
          } while (e)
          return n
        }
        function Jr(t, e) {
          return No(Oo(t, e, oc), t + '')
        }
        function Zr(t) {
          return Zn($s(t))
        }
        function Qr(t, e) {
          var n = $s(t)
          return Ro(n, cr(e, 0, n.length))
        }
        function ti(t, e, r, i) {
          if (!ns(t)) return t
          for (
            var o = -1, u = (e = Di(e, t)).length, s = u - 1, c = t;
            null != c && ++o < u;

          ) {
            var a = Mo(e[o]),
              f = r
            if ('__proto__' === a || 'constructor' === a || 'prototype' === a) return t
            if (o != s) {
              var l = c[a]
              ;(f = i ? i(l, a, c) : n) === n && (f = ns(l) ? l : Do(e[o + 1]) ? [] : {})
            }
            nr(c, a, f), (c = c[a])
          }
          return t
        }
        var ei = kn
            ? function (t, e) {
                return kn.set(t, e), t
              }
            : oc,
          ni = se
            ? function (t, e) {
                return se(t, 'toString', {
                  configurable: !0,
                  enumerable: !1,
                  value: nc(e),
                  writable: !0
                })
              }
            : oc
        function ri(t) {
          return Ro($s(t))
        }
        function ii(t, e, n) {
          var r = -1,
            i = t.length
          e < 0 && (e = -e > i ? 0 : i + e),
            (n = n > i ? i : n) < 0 && (n += i),
            (i = e > n ? 0 : (n - e) >>> 0),
            (e >>>= 0)
          for (var o = ot(i); ++r < i; ) o[r] = t[r + e]
          return o
        }
        function oi(t, e) {
          var n
          return (
            pr(t, function (t, r, i) {
              return !(n = e(t, r, i))
            }),
            !!n
          )
        }
        function ui(t, e, n) {
          var r = 0,
            i = null == t ? r : t.length
          if ('number' == typeof e && e == e && i <= 2147483647) {
            for (; r < i; ) {
              var o = (r + i) >>> 1,
                u = t[o]
              null !== u && !fs(u) && (n ? u <= e : u < e) ? (r = o + 1) : (i = o)
            }
            return i
          }
          return si(t, e, oc, n)
        }
        function si(t, e, r, i) {
          var o = 0,
            u = null == t ? 0 : t.length
          if (0 === u) return 0
          for (var s = (e = r(e)) != e, c = null === e, a = fs(e), f = e === n; o < u; ) {
            var l = ye((o + u) / 2),
              h = r(t[l]),
              p = h !== n,
              d = null === h,
              v = h == h,
              y = fs(h)
            if (s) var b = i || v
            else
              b = f
                ? v && (i || p)
                : c
                ? v && p && (i || !d)
                : a
                ? v && p && !d && (i || !y)
                : !d && !y && (i ? h <= e : h < e)
            b ? (o = l + 1) : (u = l)
          }
          return Dn(u, 4294967294)
        }
        function ci(t, e) {
          for (var n = -1, r = t.length, i = 0, o = []; ++n < r; ) {
            var u = t[n],
              s = e ? e(u) : u
            if (!n || !$u(s, c)) {
              var c = s
              o[i++] = 0 === u ? 0 : u
            }
          }
          return o
        }
        function ai(t) {
          return 'number' == typeof t ? t : fs(t) ? p : +t
        }
        function fi(t) {
          if ('string' == typeof t) return t
          if (Gu(t)) return Ie(t, fi) + ''
          if (fs(t)) return Un ? Un.call(t) : ''
          var e = t + ''
          return '0' == e && 1 / t == -1 / 0 ? '-0' : e
        }
        function li(t, e, n) {
          var r = -1,
            i = Ae,
            o = t.length,
            u = !0,
            s = [],
            c = s
          if (n) (u = !1), (i = ke)
          else if (o >= 200) {
            var a = e ? null : Xi(t)
            if (a) return fn(a)
            ;(u = !1), (i = Ze), (c = new Hn())
          } else c = e ? [] : s
          t: for (; ++r < o; ) {
            var f = t[r],
              l = e ? e(f) : f
            if (((f = n || 0 !== f ? f : 0), u && l == l)) {
              for (var h = c.length; h--; ) if (c[h] === l) continue t
              e && c.push(l), s.push(f)
            } else i(c, l, n) || (c !== s && c.push(l), s.push(f))
          }
          return s
        }
        function hi(t, e) {
          return null == (t = jo(t, (e = Di(e, t)))) || delete t[Mo(Zo(e))]
        }
        function pi(t, e, n, r) {
          return ti(t, e, n(xr(t, e)), r)
        }
        function di(t, e, n, r) {
          for (var i = t.length, o = r ? i : -1; (r ? o-- : ++o < i) && e(t[o], o, t); );
          return n ? ii(t, r ? 0 : o, r ? o + 1 : i) : ii(t, r ? o + 1 : 0, r ? i : o)
        }
        function vi(t, e) {
          var n = t
          return (
            n instanceof Wn && (n = n.value()),
            Ne(
              e,
              function (t, e) {
                return e.func.apply(e.thisArg, Te([t], e.args))
              },
              n
            )
          )
        }
        function yi(t, e, n) {
          var r = t.length
          if (r < 2) return r ? li(t[0]) : []
          for (var i = -1, o = ot(r); ++i < r; )
            for (var u = t[i], s = -1; ++s < r; )
              s != i && (o[i] = hr(o[i] || u, t[s], e, n))
          return li(gr(o, 1), e, n)
        }
        function bi(t, e, r) {
          for (var i = -1, o = t.length, u = e.length, s = {}; ++i < o; ) {
            var c = i < u ? e[i] : n
            r(s, t[i], c)
          }
          return s
        }
        function gi(t) {
          return Hu(t) ? t : []
        }
        function mi(t) {
          return 'function' == typeof t ? t : oc
        }
        function Di(t, e) {
          return Gu(t) ? t : _o(t, e) ? [t] : Lo(Ds(t))
        }
        var wi = Jr
        function _i(t, e, r) {
          var i = t.length
          return (r = r === n ? i : r), !e && r >= i ? t : ii(t, e, r)
        }
        var Ei =
          fe ||
          function (t) {
            return he.clearTimeout(t)
          }
        function xi(t, e) {
          if (e) return t.slice()
          var n = t.length,
            r = Wt ? Wt(n) : new t.constructor(n)
          return t.copy(r), r
        }
        function Si(t) {
          var e = new t.constructor(t.byteLength)
          return new qt(e).set(new qt(t)), e
        }
        function Ci(t, e) {
          var n = e ? Si(t.buffer) : t.buffer
          return new t.constructor(n, t.byteOffset, t.length)
        }
        function Fi(t, e) {
          if (t !== e) {
            var r = t !== n,
              i = null === t,
              o = t == t,
              u = fs(t),
              s = e !== n,
              c = null === e,
              a = e == e,
              f = fs(e)
            if (
              (!c && !f && !u && t > e) ||
              (u && s && a && !c && !f) ||
              (i && s && a) ||
              (!r && a) ||
              !o
            )
              return 1
            if (
              (!i && !u && !f && t < e) ||
              (f && r && o && !i && !u) ||
              (c && r && o) ||
              (!s && o) ||
              !a
            )
              return -1
          }
          return 0
        }
        function Oi(t, e, n, r) {
          for (
            var i = -1,
              o = t.length,
              u = n.length,
              s = -1,
              c = e.length,
              a = mn(o - u, 0),
              f = ot(c + a),
              l = !r;
            ++s < c;

          )
            f[s] = e[s]
          for (; ++i < u; ) (l || i < o) && (f[n[i]] = t[i])
          for (; a--; ) f[s++] = t[i++]
          return f
        }
        function ji(t, e, n, r) {
          for (
            var i = -1,
              o = t.length,
              u = -1,
              s = n.length,
              c = -1,
              a = e.length,
              f = mn(o - s, 0),
              l = ot(f + a),
              h = !r;
            ++i < f;

          )
            l[i] = t[i]
          for (var p = i; ++c < a; ) l[p + c] = e[c]
          for (; ++u < s; ) (h || i < o) && (l[p + n[u]] = t[i++])
          return l
        }
        function Ai(t, e) {
          var n = -1,
            r = t.length
          for (e || (e = ot(r)); ++n < r; ) e[n] = t[n]
          return e
        }
        function ki(t, e, r, i) {
          var o = !r
          r || (r = {})
          for (var u = -1, s = e.length; ++u < s; ) {
            var c = e[u],
              a = i ? i(r[c], t[c], c, r, t) : n
            a === n && (a = t[c]), o ? ur(r, c, a) : nr(r, c, a)
          }
          return r
        }
        function Ii(t, e) {
          return function (n, r) {
            var i = Gu(n) ? Se : ir,
              o = e ? e() : {}
            return i(n, t, ao(r, 2), o)
          }
        }
        function Ti(t) {
          return Jr(function (e, r) {
            var i = -1,
              o = r.length,
              u = o > 1 ? r[o - 1] : n,
              s = o > 2 ? r[2] : n
            for (
              u = t.length > 3 && 'function' == typeof u ? (o--, u) : n,
                s && wo(r[0], r[1], s) && ((u = o < 3 ? n : u), (o = 1)),
                e = Ct(e);
              ++i < o;

            ) {
              var c = r[i]
              c && t(e, c, i, u)
            }
            return e
          })
        }
        function Ni(t, e) {
          return function (n, r) {
            if (null == n) return n
            if (!Yu(n)) return t(n, r)
            for (
              var i = n.length, o = e ? i : -1, u = Ct(n);
              (e ? o-- : ++o < i) && !1 !== r(u[o], o, u);

            );
            return n
          }
        }
        function Bi(t) {
          return function (e, n, r) {
            for (var i = -1, o = Ct(e), u = r(e), s = u.length; s--; ) {
              var c = u[t ? s : ++i]
              if (!1 === n(o[c], c, o)) break
            }
            return e
          }
        }
        function Pi(t) {
          return function (e) {
            var r = un((e = Ds(e))) ? pn(e) : n,
              i = r ? r[0] : e.charAt(0),
              o = r ? _i(r, 1).join('') : e.slice(1)
            return i[t]() + o
          }
        }
        function Ri(t) {
          return function (e) {
            return Ne(Qs(Ws(e).replace(Jt, '')), t, '')
          }
        }
        function Li(t) {
          return function () {
            var e = arguments
            switch (e.length) {
              case 0:
                return new t()
              case 1:
                return new t(e[0])
              case 2:
                return new t(e[0], e[1])
              case 3:
                return new t(e[0], e[1], e[2])
              case 4:
                return new t(e[0], e[1], e[2], e[3])
              case 5:
                return new t(e[0], e[1], e[2], e[3], e[4])
              case 6:
                return new t(e[0], e[1], e[2], e[3], e[4], e[5])
              case 7:
                return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6])
            }
            var n = $n(t.prototype),
              r = t.apply(n, e)
            return ns(r) ? r : n
          }
        }
        function Mi(t) {
          return function (e, r, i) {
            var o = Ct(e)
            if (!Yu(e)) {
              var u = ao(r, 3)
              ;(e = Ts(e)),
                (r = function (t) {
                  return u(o[t], t, o)
                })
            }
            var s = t(e, r, i)
            return s > -1 ? o[u ? e[s] : s] : n
          }
        }
        function Ui(t) {
          return ro(function (e) {
            var i = e.length,
              o = i,
              u = qn.prototype.thru
            for (t && e.reverse(); o--; ) {
              var s = e[o]
              if ('function' != typeof s) throw new jt(r)
              if (u && !c && 'wrapper' == so(s)) var c = new qn([], !0)
            }
            for (o = c ? o : i; ++o < i; ) {
              var a = so((s = e[o])),
                f = 'wrapper' == a ? uo(s) : n
              c =
                f && Eo(f[0]) && 424 == f[1] && !f[4].length && 1 == f[9]
                  ? c[so(f[0])].apply(c, f[3])
                  : 1 == s.length && Eo(s)
                  ? c[a]()
                  : c.thru(s)
            }
            return function () {
              var t = arguments,
                n = t[0]
              if (c && 1 == t.length && Gu(n)) return c.plant(n).value()
              for (var r = 0, o = i ? e[r].apply(this, t) : n; ++r < i; )
                o = e[r].call(this, o)
              return o
            }
          })
        }
        function Vi(t, e, r, i, o, u, s, c, f, l) {
          var h = e & a,
            p = 1 & e,
            d = 2 & e,
            v = 24 & e,
            y = 512 & e,
            b = d ? n : Li(t)
          return function n() {
            for (var a = arguments.length, g = ot(a), m = a; m--; ) g[m] = arguments[m]
            if (v)
              var D = co(n),
                w = en(g, D)
            if (
              (i && (g = Oi(g, i, o, v)), u && (g = ji(g, u, s, v)), (a -= w), v && a < l)
            ) {
              var _ = an(g, D)
              return Yi(t, e, Vi, n.placeholder, r, g, _, c, f, l - a)
            }
            var E = p ? r : this,
              x = d ? E[t] : t
            return (
              (a = g.length),
              c ? (g = Ao(g, c)) : y && a > 1 && g.reverse(),
              h && f < a && (g.length = f),
              this && this !== he && this instanceof n && (x = b || Li(x)),
              x.apply(E, g)
            )
          }
        }
        function $i(t, e) {
          return function (n, r) {
            return (function (t, e, n, r) {
              return (
                wr(t, function (t, i, o) {
                  e(r, n(t), i, o)
                }),
                r
              )
            })(n, t, e(r), {})
          }
        }
        function zi(t, e) {
          return function (r, i) {
            var o
            if (r === n && i === n) return e
            if ((r !== n && (o = r), i !== n)) {
              if (o === n) return i
              'string' == typeof r || 'string' == typeof i
                ? ((r = fi(r)), (i = fi(i)))
                : ((r = ai(r)), (i = ai(i))),
                (o = t(r, i))
            }
            return o
          }
        }
        function qi(t) {
          return ro(function (e) {
            return (
              (e = Ie(e, Xe(ao()))),
              Jr(function (n) {
                var r = this
                return t(e, function (t) {
                  return xe(t, r, n)
                })
              })
            )
          })
        }
        function Wi(t, e) {
          var r = (e = e === n ? ' ' : fi(e)).length
          if (r < 2) return r ? Xr(e, t) : e
          var i = Xr(e, de(t / hn(e)))
          return un(e) ? _i(pn(i), 0, t).join('') : i.slice(0, t)
        }
        function Gi(t) {
          return function (e, r, i) {
            return (
              i && 'number' != typeof i && wo(e, r, i) && (r = i = n),
              (e = vs(e)),
              r === n ? ((r = e), (e = 0)) : (r = vs(r)),
              (function (t, e, n, r) {
                for (var i = -1, o = mn(de((e - t) / (n || 1)), 0), u = ot(o); o--; )
                  (u[r ? o : ++i] = t), (t += n)
                return u
              })(e, r, (i = i === n ? (e < r ? 1 : -1) : vs(i)), t)
            )
          }
        }
        function Ki(t) {
          return function (e, n) {
            return (
              ('string' == typeof e && 'string' == typeof n) ||
                ((e = gs(e)), (n = gs(n))),
              t(e, n)
            )
          }
        }
        function Yi(t, e, r, i, o, u, a, f, l, h) {
          var p = 8 & e
          ;(e |= p ? s : c), 4 & (e &= ~(p ? c : s)) || (e &= -4)
          var d = [t, e, o, p ? u : n, p ? a : n, p ? n : u, p ? n : a, f, l, h],
            v = r.apply(n, d)
          return Eo(t) && Io(v, d), (v.placeholder = i), Bo(v, t, e)
        }
        function Hi(t) {
          var e = St[t]
          return function (t, n) {
            if (((t = gs(t)), (n = null == n ? 0 : Dn(ys(n), 292)) && We(t))) {
              var r = (Ds(t) + 'e').split('e')
              return +(
                (r = (Ds(e(r[0] + 'e' + (+r[1] + n))) + 'e').split('e'))[0] +
                'e' +
                (+r[1] - n)
              )
            }
            return e(t)
          }
        }
        var Xi =
          On && 1 / fn(new On([, -0]))[1] == l
            ? function (t) {
                return new On(t)
              }
            : fc
        function Ji(t) {
          return function (e) {
            var n = yo(e)
            return n == E
              ? sn(e)
              : n == O
              ? ln(e)
              : (function (t, e) {
                  return Ie(e, function (e) {
                    return [e, t[e]]
                  })
                })(e, t(e))
          }
        }
        function Zi(t, e, i, l, h, p, d, v) {
          var y = 2 & e
          if (!y && 'function' != typeof t) throw new jt(r)
          var b = l ? l.length : 0
          if (
            (b || ((e &= -97), (l = h = n)),
            (d = d === n ? d : mn(ys(d), 0)),
            (v = v === n ? v : ys(v)),
            (b -= h ? h.length : 0),
            e & c)
          ) {
            var g = l,
              m = h
            l = h = n
          }
          var D = y ? n : uo(t),
            w = [t, e, i, l, h, g, m, p, d, v]
          if (
            (D &&
              (function (t, e) {
                var n = t[1],
                  r = e[1],
                  i = n | r,
                  u = i < 131,
                  s =
                    (r == a && 8 == n) ||
                    (r == a && n == f && t[7].length <= e[8]) ||
                    (384 == r && e[7].length <= e[8] && 8 == n)
                if (!u && !s) return t
                1 & r && ((t[2] = e[2]), (i |= 1 & n ? 0 : 4))
                var c = e[3]
                if (c) {
                  var l = t[3]
                  ;(t[3] = l ? Oi(l, c, e[4]) : c), (t[4] = l ? an(t[3], o) : e[4])
                }
                ;(c = e[5]) &&
                  ((l = t[5]),
                  (t[5] = l ? ji(l, c, e[6]) : c),
                  (t[6] = l ? an(t[5], o) : e[6]))
                ;(c = e[7]) && (t[7] = c)
                r & a && (t[8] = null == t[8] ? e[8] : Dn(t[8], e[8]))
                null == t[9] && (t[9] = e[9])
                ;(t[0] = e[0]), (t[1] = i)
              })(w, D),
            (t = w[0]),
            (e = w[1]),
            (i = w[2]),
            (l = w[3]),
            (h = w[4]),
            !(v = w[9] = w[9] === n ? (y ? 0 : t.length) : mn(w[9] - b, 0)) &&
              24 & e &&
              (e &= -25),
            e && 1 != e)
          )
            _ =
              8 == e || e == u
                ? (function (t, e, r) {
                    var i = Li(t)
                    return function o() {
                      for (var u = arguments.length, s = ot(u), c = u, a = co(o); c--; )
                        s[c] = arguments[c]
                      var f = u < 3 && s[0] !== a && s[u - 1] !== a ? [] : an(s, a)
                      return (u -= f.length) < r
                        ? Yi(t, e, Vi, o.placeholder, n, s, f, n, n, r - u)
                        : xe(this && this !== he && this instanceof o ? i : t, this, s)
                    }
                  })(t, e, v)
                : (e != s && 33 != e) || h.length
                ? Vi.apply(n, w)
                : (function (t, e, n, r) {
                    var i = 1 & e,
                      o = Li(t)
                    return function e() {
                      for (
                        var u = -1,
                          s = arguments.length,
                          c = -1,
                          a = r.length,
                          f = ot(a + s),
                          l = this && this !== he && this instanceof e ? o : t;
                        ++c < a;

                      )
                        f[c] = r[c]
                      for (; s--; ) f[c++] = arguments[++u]
                      return xe(l, i ? n : this, f)
                    }
                  })(t, e, i, l)
          else
            var _ = (function (t, e, n) {
              var r = 1 & e,
                i = Li(t)
              return function e() {
                return (this && this !== he && this instanceof e ? i : t).apply(
                  r ? n : this,
                  arguments
                )
              }
            })(t, e, i)
          return Bo((D ? ei : Io)(_, w), t, e)
        }
        function Qi(t, e, r, i) {
          return t === n || ($u(t, It[r]) && !Bt.call(i, r)) ? e : t
        }
        function to(t, e, r, i, o, u) {
          return ns(t) && ns(e) && (u.set(e, t), zr(t, e, n, to, u), u.delete(e)), t
        }
        function eo(t) {
          return us(t) ? n : t
        }
        function no(t, e, r, i, o, u) {
          var s = 1 & r,
            c = t.length,
            a = e.length
          if (c != a && !(s && a > c)) return !1
          var f = u.get(t),
            l = u.get(e)
          if (f && l) return f == e && l == t
          var h = -1,
            p = !0,
            d = 2 & r ? new Hn() : n
          for (u.set(t, e), u.set(e, t); ++h < c; ) {
            var v = t[h],
              y = e[h]
            if (i) var b = s ? i(y, v, h, e, t, u) : i(v, y, h, t, e, u)
            if (b !== n) {
              if (b) continue
              p = !1
              break
            }
            if (d) {
              if (
                !Pe(e, function (t, e) {
                  if (!Ze(d, e) && (v === t || o(v, t, r, i, u))) return d.push(e)
                })
              ) {
                p = !1
                break
              }
            } else if (v !== y && !o(v, y, r, i, u)) {
              p = !1
              break
            }
          }
          return u.delete(t), u.delete(e), p
        }
        function ro(t) {
          return No(Oo(t, n, Ko), t + '')
        }
        function io(t) {
          return Sr(t, Ts, po)
        }
        function oo(t) {
          return Sr(t, Ns, vo)
        }
        var uo = kn
          ? function (t) {
              return kn.get(t)
            }
          : fc
        function so(t) {
          for (var e = t.name + '', n = In[e], r = Bt.call(In, e) ? n.length : 0; r--; ) {
            var i = n[r],
              o = i.func
            if (null == o || o == t) return i.name
          }
          return e
        }
        function co(t) {
          return (Bt.call(Vn, 'placeholder') ? Vn : t).placeholder
        }
        function ao() {
          var t = Vn.iteratee || uc
          return (
            (t = t === uc ? Pr : t), arguments.length ? t(arguments[0], arguments[1]) : t
          )
        }
        function fo(t, e) {
          var n,
            r,
            i = t.__data__
          return (
            'string' == (r = typeof (n = e)) ||
            'number' == r ||
            'symbol' == r ||
            'boolean' == r
              ? '__proto__' !== n
              : null === n
          )
            ? i['string' == typeof e ? 'string' : 'hash']
            : i.map
        }
        function lo(t) {
          for (var e = Ts(t), n = e.length; n--; ) {
            var r = e[n],
              i = t[r]
            e[n] = [r, i, Co(i)]
          }
          return e
        }
        function ho(t, e) {
          var r = (function (t, e) {
            return null == t ? n : t[e]
          })(t, e)
          return Br(r) ? r : n
        }
        var po = be
            ? function (t) {
                return null == t
                  ? []
                  : ((t = Ct(t)),
                    je(be(t), function (e) {
                      return Yt.call(t, e)
                    }))
              }
            : bc,
          vo = be
            ? function (t) {
                for (var e = []; t; ) Te(e, po(t)), (t = Gt(t))
                return e
              }
            : bc,
          yo = Cr
        function bo(t, e, n) {
          for (var r = -1, i = (e = Di(e, t)).length, o = !1; ++r < i; ) {
            var u = Mo(e[r])
            if (!(o = null != t && n(t, u))) break
            t = t[u]
          }
          return o || ++r != i
            ? o
            : !!(i = null == t ? 0 : t.length) && es(i) && Do(u, i) && (Gu(t) || Wu(t))
        }
        function go(t) {
          return 'function' != typeof t.constructor || So(t) ? {} : $n(Gt(t))
        }
        function mo(t) {
          return Gu(t) || Wu(t) || !!(Xt && t && t[Xt])
        }
        function Do(t, e) {
          var n = typeof t
          return (
            !!(e = null == e ? h : e) &&
            ('number' == n || ('symbol' != n && gt.test(t))) &&
            t > -1 &&
            t % 1 == 0 &&
            t < e
          )
        }
        function wo(t, e, n) {
          if (!ns(n)) return !1
          var r = typeof e
          return (
            !!('number' == r ? Yu(n) && Do(e, n.length) : 'string' == r && e in n) &&
            $u(n[e], t)
          )
        }
        function _o(t, e) {
          if (Gu(t)) return !1
          var n = typeof t
          return (
            !('number' != n && 'symbol' != n && 'boolean' != n && null != t && !fs(t)) ||
            tt.test(t) ||
            !Q.test(t) ||
            (null != e && t in Ct(e))
          )
        }
        function Eo(t) {
          var e = so(t),
            n = Vn[e]
          if ('function' != typeof n || !(e in Wn.prototype)) return !1
          if (t === n) return !0
          var r = uo(n)
          return !!r && t === r[0]
        }
        ;((Sn && yo(new Sn(new ArrayBuffer(1))) != T) ||
          (Cn && yo(new Cn()) != E) ||
          (Fn && yo(Fn.resolve()) != C) ||
          (On && yo(new On()) != O) ||
          (jn && yo(new jn()) != k)) &&
          (yo = function (t) {
            var e = Cr(t),
              r = e == S ? t.constructor : n,
              i = r ? Uo(r) : ''
            if (i)
              switch (i) {
                case Tn:
                  return T
                case Nn:
                  return E
                case Bn:
                  return C
                case Pn:
                  return O
                case Rn:
                  return k
              }
            return e
          })
        var xo = Tt ? Qu : gc
        function So(t) {
          var e = t && t.constructor
          return t === (('function' == typeof e && e.prototype) || It)
        }
        function Co(t) {
          return t == t && !ns(t)
        }
        function Fo(t, e) {
          return function (r) {
            return null != r && r[t] === e && (e !== n || t in Ct(r))
          }
        }
        function Oo(t, e, r) {
          return (
            (e = mn(e === n ? t.length - 1 : e, 0)),
            function () {
              for (
                var n = arguments, i = -1, o = mn(n.length - e, 0), u = ot(o);
                ++i < o;

              )
                u[i] = n[e + i]
              i = -1
              for (var s = ot(e + 1); ++i < e; ) s[i] = n[i]
              return (s[e] = r(u)), xe(t, this, s)
            }
          )
        }
        function jo(t, e) {
          return e.length < 2 ? t : xr(t, ii(e, 0, -1))
        }
        function Ao(t, e) {
          for (var r = t.length, i = Dn(e.length, r), o = Ai(t); i--; ) {
            var u = e[i]
            t[i] = Do(u, r) ? o[u] : n
          }
          return t
        }
        function ko(t, e) {
          if (('constructor' !== e || 'function' != typeof t[e]) && '__proto__' != e)
            return t[e]
        }
        var Io = Po(ei),
          To =
            pe ||
            function (t, e) {
              return he.setTimeout(t, e)
            },
          No = Po(ni)
        function Bo(t, e, n) {
          var r = e + ''
          return No(
            t,
            (function (t, e) {
              var n = e.length
              if (!n) return t
              var r = n - 1
              return (
                (e[r] = (n > 1 ? '& ' : '') + e[r]),
                (e = e.join(n > 2 ? ', ' : ' ')),
                t.replace(ut, '{\n/* [wrapped with ' + e + '] */\n')
              )
            })(
              r,
              (function (t, e) {
                return (
                  Ce(v, function (n) {
                    var r = '_.' + n[0]
                    e & n[1] && !Ae(t, r) && t.push(r)
                  }),
                  t.sort()
                )
              })(
                (function (t) {
                  var e = t.match(st)
                  return e ? e[1].split(ct) : []
                })(r),
                n
              )
            )
          )
        }
        function Po(t) {
          var e = 0,
            r = 0
          return function () {
            var i = wn(),
              o = 16 - (i - r)
            if (((r = i), o > 0)) {
              if (++e >= 800) return arguments[0]
            } else e = 0
            return t.apply(n, arguments)
          }
        }
        function Ro(t, e) {
          var r = -1,
            i = t.length,
            o = i - 1
          for (e = e === n ? i : e; ++r < e; ) {
            var u = Hr(r, o),
              s = t[u]
            ;(t[u] = t[r]), (t[r] = s)
          }
          return (t.length = e), t
        }
        var Lo = (function (t) {
          var e = Pu(t, function (t) {
              return 500 === n.size && n.clear(), t
            }),
            n = e.cache
          return e
        })(function (t) {
          var e = []
          return (
            46 === t.charCodeAt(0) && e.push(''),
            t.replace(et, function (t, n, r, i) {
              e.push(r ? i.replace(lt, '$1') : n || t)
            }),
            e
          )
        })
        function Mo(t) {
          if ('string' == typeof t || fs(t)) return t
          var e = t + ''
          return '0' == e && 1 / t == -1 / 0 ? '-0' : e
        }
        function Uo(t) {
          if (null != t) {
            try {
              return Nt.call(t)
            } catch (t) {}
            try {
              return t + ''
            } catch (t) {}
          }
          return ''
        }
        function Vo(t) {
          if (t instanceof Wn) return t.clone()
          var e = new qn(t.__wrapped__, t.__chain__)
          return (
            (e.__actions__ = Ai(t.__actions__)),
            (e.__index__ = t.__index__),
            (e.__values__ = t.__values__),
            e
          )
        }
        var $o = Jr(function (t, e) {
            return Hu(t) ? hr(t, gr(e, 1, Hu, !0)) : []
          }),
          zo = Jr(function (t, e) {
            var r = Zo(e)
            return Hu(r) && (r = n), Hu(t) ? hr(t, gr(e, 1, Hu, !0), ao(r, 2)) : []
          }),
          qo = Jr(function (t, e) {
            var r = Zo(e)
            return Hu(r) && (r = n), Hu(t) ? hr(t, gr(e, 1, Hu, !0), n, r) : []
          })
        function Wo(t, e, n) {
          var r = null == t ? 0 : t.length
          if (!r) return -1
          var i = null == n ? 0 : ys(n)
          return i < 0 && (i = mn(r + i, 0)), Me(t, ao(e, 3), i)
        }
        function Go(t, e, r) {
          var i = null == t ? 0 : t.length
          if (!i) return -1
          var o = i - 1
          return (
            r !== n && ((o = ys(r)), (o = r < 0 ? mn(i + o, 0) : Dn(o, i - 1))),
            Me(t, ao(e, 3), o, !0)
          )
        }
        function Ko(t) {
          return (null == t ? 0 : t.length) ? gr(t, 1) : []
        }
        function Yo(t) {
          return t && t.length ? t[0] : n
        }
        var Ho = Jr(function (t) {
            var e = Ie(t, gi)
            return e.length && e[0] === t[0] ? Ar(e) : []
          }),
          Xo = Jr(function (t) {
            var e = Zo(t),
              r = Ie(t, gi)
            return (
              e === Zo(r) ? (e = n) : r.pop(),
              r.length && r[0] === t[0] ? Ar(r, ao(e, 2)) : []
            )
          }),
          Jo = Jr(function (t) {
            var e = Zo(t),
              r = Ie(t, gi)
            return (
              (e = 'function' == typeof e ? e : n) && r.pop(),
              r.length && r[0] === t[0] ? Ar(r, n, e) : []
            )
          })
        function Zo(t) {
          var e = null == t ? 0 : t.length
          return e ? t[e - 1] : n
        }
        var Qo = Jr(tu)
        function tu(t, e) {
          return t && t.length && e && e.length ? Kr(t, e) : t
        }
        var eu = ro(function (t, e) {
          var n = null == t ? 0 : t.length,
            r = sr(t, e)
          return (
            Yr(
              t,
              Ie(e, function (t) {
                return Do(t, n) ? +t : t
              }).sort(Fi)
            ),
            r
          )
        })
        function nu(t) {
          return null == t ? t : xn.call(t)
        }
        var ru = Jr(function (t) {
            return li(gr(t, 1, Hu, !0))
          }),
          iu = Jr(function (t) {
            var e = Zo(t)
            return Hu(e) && (e = n), li(gr(t, 1, Hu, !0), ao(e, 2))
          }),
          ou = Jr(function (t) {
            var e = Zo(t)
            return (e = 'function' == typeof e ? e : n), li(gr(t, 1, Hu, !0), n, e)
          })
        function uu(t) {
          if (!t || !t.length) return []
          var e = 0
          return (
            (t = je(t, function (t) {
              if (Hu(t)) return (e = mn(t.length, e)), !0
            })),
            Ye(e, function (e) {
              return Ie(t, qe(e))
            })
          )
        }
        function su(t, e) {
          if (!t || !t.length) return []
          var r = uu(t)
          return null == e
            ? r
            : Ie(r, function (t) {
                return xe(e, n, t)
              })
        }
        var cu = Jr(function (t, e) {
            return Hu(t) ? hr(t, e) : []
          }),
          au = Jr(function (t) {
            return yi(je(t, Hu))
          }),
          fu = Jr(function (t) {
            var e = Zo(t)
            return Hu(e) && (e = n), yi(je(t, Hu), ao(e, 2))
          }),
          lu = Jr(function (t) {
            var e = Zo(t)
            return (e = 'function' == typeof e ? e : n), yi(je(t, Hu), n, e)
          }),
          hu = Jr(uu)
        var pu = Jr(function (t) {
          var e = t.length,
            r = e > 1 ? t[e - 1] : n
          return (r = 'function' == typeof r ? (t.pop(), r) : n), su(t, r)
        })
        function du(t) {
          var e = Vn(t)
          return (e.__chain__ = !0), e
        }
        function vu(t, e) {
          return e(t)
        }
        var yu = ro(function (t) {
          var e = t.length,
            r = e ? t[0] : 0,
            i = this.__wrapped__,
            o = function (e) {
              return sr(e, t)
            }
          return !(e > 1 || this.__actions__.length) && i instanceof Wn && Do(r)
            ? ((i = i.slice(r, +r + (e ? 1 : 0))).__actions__.push({
                func: vu,
                args: [o],
                thisArg: n
              }),
              new qn(i, this.__chain__).thru(function (t) {
                return e && !t.length && t.push(n), t
              }))
            : this.thru(o)
        })
        var bu = Ii(function (t, e, n) {
          Bt.call(t, n) ? ++t[n] : ur(t, n, 1)
        })
        var gu = Mi(Wo),
          mu = Mi(Go)
        function Du(t, e) {
          return (Gu(t) ? Ce : pr)(t, ao(e, 3))
        }
        function wu(t, e) {
          return (Gu(t) ? Fe : dr)(t, ao(e, 3))
        }
        var _u = Ii(function (t, e, n) {
          Bt.call(t, n) ? t[n].push(e) : ur(t, n, [e])
        })
        var Eu = Jr(function (t, e, n) {
            var r = -1,
              i = 'function' == typeof e,
              o = Yu(t) ? ot(t.length) : []
            return (
              pr(t, function (t) {
                o[++r] = i ? xe(e, t, n) : kr(t, e, n)
              }),
              o
            )
          }),
          xu = Ii(function (t, e, n) {
            ur(t, n, e)
          })
        function Su(t, e) {
          return (Gu(t) ? Ie : Ur)(t, ao(e, 3))
        }
        var Cu = Ii(
          function (t, e, n) {
            t[n ? 0 : 1].push(e)
          },
          function () {
            return [[], []]
          }
        )
        var Fu = Jr(function (t, e) {
            if (null == t) return []
            var n = e.length
            return (
              n > 1 && wo(t, e[0], e[1])
                ? (e = [])
                : n > 2 && wo(e[0], e[1], e[2]) && (e = [e[0]]),
              Wr(t, gr(e, 1), [])
            )
          }),
          Ou =
            le ||
            function () {
              return he.Date.now()
            }
        function ju(t, e, r) {
          return (
            (e = r ? n : e), (e = t && null == e ? t.length : e), Zi(t, a, n, n, n, n, e)
          )
        }
        function Au(t, e) {
          var i
          if ('function' != typeof e) throw new jt(r)
          return (
            (t = ys(t)),
            function () {
              return --t > 0 && (i = e.apply(this, arguments)), t <= 1 && (e = n), i
            }
          )
        }
        var ku = Jr(function (t, e, n) {
            var r = 1
            if (n.length) {
              var i = an(n, co(ku))
              r |= s
            }
            return Zi(t, r, e, n, i)
          }),
          Iu = Jr(function (t, e, n) {
            var r = 3
            if (n.length) {
              var i = an(n, co(Iu))
              r |= s
            }
            return Zi(e, r, t, n, i)
          })
        function Tu(t, e, i) {
          var o,
            u,
            s,
            c,
            a,
            f,
            l = 0,
            h = !1,
            p = !1,
            d = !0
          if ('function' != typeof t) throw new jt(r)
          function v(e) {
            var r = o,
              i = u
            return (o = u = n), (l = e), (c = t.apply(i, r))
          }
          function y(t) {
            return (l = t), (a = To(g, e)), h ? v(t) : c
          }
          function b(t) {
            var r = t - f
            return f === n || r >= e || r < 0 || (p && t - l >= s)
          }
          function g() {
            var t = Ou()
            if (b(t)) return m(t)
            a = To(
              g,
              (function (t) {
                var n = e - (t - f)
                return p ? Dn(n, s - (t - l)) : n
              })(t)
            )
          }
          function m(t) {
            return (a = n), d && o ? v(t) : ((o = u = n), c)
          }
          function D() {
            var t = Ou(),
              r = b(t)
            if (((o = arguments), (u = this), (f = t), r)) {
              if (a === n) return y(f)
              if (p) return Ei(a), (a = To(g, e)), v(f)
            }
            return a === n && (a = To(g, e)), c
          }
          return (
            (e = gs(e) || 0),
            ns(i) &&
              ((h = !!i.leading),
              (s = (p = 'maxWait' in i) ? mn(gs(i.maxWait) || 0, e) : s),
              (d = 'trailing' in i ? !!i.trailing : d)),
            (D.cancel = function () {
              a !== n && Ei(a), (l = 0), (o = f = u = a = n)
            }),
            (D.flush = function () {
              return a === n ? c : m(Ou())
            }),
            D
          )
        }
        var Nu = Jr(function (t, e) {
            return lr(t, 1, e)
          }),
          Bu = Jr(function (t, e, n) {
            return lr(t, gs(e) || 0, n)
          })
        function Pu(t, e) {
          if ('function' != typeof t || (null != e && 'function' != typeof e))
            throw new jt(r)
          var n = function () {
            var r = arguments,
              i = e ? e.apply(this, r) : r[0],
              o = n.cache
            if (o.has(i)) return o.get(i)
            var u = t.apply(this, r)
            return (n.cache = o.set(i, u) || o), u
          }
          return (n.cache = new (Pu.Cache || Yn)()), n
        }
        function Ru(t) {
          if ('function' != typeof t) throw new jt(r)
          return function () {
            var e = arguments
            switch (e.length) {
              case 0:
                return !t.call(this)
              case 1:
                return !t.call(this, e[0])
              case 2:
                return !t.call(this, e[0], e[1])
              case 3:
                return !t.call(this, e[0], e[1], e[2])
            }
            return !t.apply(this, e)
          }
        }
        Pu.Cache = Yn
        var Lu = wi(function (t, e) {
            var n = (e =
              1 == e.length && Gu(e[0]) ? Ie(e[0], Xe(ao())) : Ie(gr(e, 1), Xe(ao())))
              .length
            return Jr(function (r) {
              for (var i = -1, o = Dn(r.length, n); ++i < o; )
                r[i] = e[i].call(this, r[i])
              return xe(t, this, r)
            })
          }),
          Mu = Jr(function (t, e) {
            var r = an(e, co(Mu))
            return Zi(t, s, n, e, r)
          }),
          Uu = Jr(function (t, e) {
            var r = an(e, co(Uu))
            return Zi(t, c, n, e, r)
          }),
          Vu = ro(function (t, e) {
            return Zi(t, f, n, n, n, e)
          })
        function $u(t, e) {
          return t === e || (t != t && e != e)
        }
        var zu = Ki(Fr),
          qu = Ki(function (t, e) {
            return t >= e
          }),
          Wu = Ir(
            (function () {
              return arguments
            })()
          )
            ? Ir
            : function (t) {
                return rs(t) && Bt.call(t, 'callee') && !Yt.call(t, 'callee')
              },
          Gu = ot.isArray,
          Ku = ge
            ? Xe(ge)
            : function (t) {
                return rs(t) && Cr(t) == I
              }
        function Yu(t) {
          return null != t && es(t.length) && !Qu(t)
        }
        function Hu(t) {
          return rs(t) && Yu(t)
        }
        var Xu = Re || gc,
          Ju = me
            ? Xe(me)
            : function (t) {
                return rs(t) && Cr(t) == m
              }
        function Zu(t) {
          if (!rs(t)) return !1
          var e = Cr(t)
          return (
            e == D ||
            '[object DOMException]' == e ||
            ('string' == typeof t.message && 'string' == typeof t.name && !us(t))
          )
        }
        function Qu(t) {
          if (!ns(t)) return !1
          var e = Cr(t)
          return (
            e == w || e == _ || '[object AsyncFunction]' == e || '[object Proxy]' == e
          )
        }
        function ts(t) {
          return 'number' == typeof t && t == ys(t)
        }
        function es(t) {
          return 'number' == typeof t && t > -1 && t % 1 == 0 && t <= h
        }
        function ns(t) {
          var e = typeof t
          return null != t && ('object' == e || 'function' == e)
        }
        function rs(t) {
          return null != t && 'object' == typeof t
        }
        var is = De
          ? Xe(De)
          : function (t) {
              return rs(t) && yo(t) == E
            }
        function os(t) {
          return 'number' == typeof t || (rs(t) && Cr(t) == x)
        }
        function us(t) {
          if (!rs(t) || Cr(t) != S) return !1
          var e = Gt(t)
          if (null === e) return !0
          var n = Bt.call(e, 'constructor') && e.constructor
          return 'function' == typeof n && n instanceof n && Nt.call(n) == Mt
        }
        var ss = we
          ? Xe(we)
          : function (t) {
              return rs(t) && Cr(t) == F
            }
        var cs = _e
          ? Xe(_e)
          : function (t) {
              return rs(t) && yo(t) == O
            }
        function as(t) {
          return 'string' == typeof t || (!Gu(t) && rs(t) && Cr(t) == j)
        }
        function fs(t) {
          return 'symbol' == typeof t || (rs(t) && Cr(t) == A)
        }
        var ls = Ee
          ? Xe(Ee)
          : function (t) {
              return rs(t) && es(t.length) && !!oe[Cr(t)]
            }
        var hs = Ki(Mr),
          ps = Ki(function (t, e) {
            return t <= e
          })
        function ds(t) {
          if (!t) return []
          if (Yu(t)) return as(t) ? pn(t) : Ai(t)
          if (Qt && t[Qt])
            return (function (t) {
              for (var e, n = []; !(e = t.next()).done; ) n.push(e.value)
              return n
            })(t[Qt]())
          var e = yo(t)
          return (e == E ? sn : e == O ? fn : $s)(t)
        }
        function vs(t) {
          return t
            ? (t = gs(t)) === l || t === -1 / 0
              ? 17976931348623157e292 * (t < 0 ? -1 : 1)
              : t == t
              ? t
              : 0
            : 0 === t
            ? t
            : 0
        }
        function ys(t) {
          var e = vs(t),
            n = e % 1
          return e == e ? (n ? e - n : e) : 0
        }
        function bs(t) {
          return t ? cr(ys(t), 0, d) : 0
        }
        function gs(t) {
          if ('number' == typeof t) return t
          if (fs(t)) return p
          if (ns(t)) {
            var e = 'function' == typeof t.valueOf ? t.valueOf() : t
            t = ns(e) ? e + '' : e
          }
          if ('string' != typeof t) return 0 === t ? t : +t
          t = He(t)
          var n = vt.test(t)
          return n || bt.test(t) ? ae(t.slice(2), n ? 2 : 8) : dt.test(t) ? p : +t
        }
        function ms(t) {
          return ki(t, Ns(t))
        }
        function Ds(t) {
          return null == t ? '' : fi(t)
        }
        var ws = Ti(function (t, e) {
            if (So(e) || Yu(e)) ki(e, Ts(e), t)
            else for (var n in e) Bt.call(e, n) && nr(t, n, e[n])
          }),
          _s = Ti(function (t, e) {
            ki(e, Ns(e), t)
          }),
          Es = Ti(function (t, e, n, r) {
            ki(e, Ns(e), t, r)
          }),
          xs = Ti(function (t, e, n, r) {
            ki(e, Ts(e), t, r)
          }),
          Ss = ro(sr)
        var Cs = Jr(function (t, e) {
            t = Ct(t)
            var r = -1,
              i = e.length,
              o = i > 2 ? e[2] : n
            for (o && wo(e[0], e[1], o) && (i = 1); ++r < i; )
              for (var u = e[r], s = Ns(u), c = -1, a = s.length; ++c < a; ) {
                var f = s[c],
                  l = t[f]
                ;(l === n || ($u(l, It[f]) && !Bt.call(t, f))) && (t[f] = u[f])
              }
            return t
          }),
          Fs = Jr(function (t) {
            return t.push(n, to), xe(Ps, n, t)
          })
        function Os(t, e, r) {
          var i = null == t ? n : xr(t, e)
          return i === n ? r : i
        }
        function js(t, e) {
          return null != t && bo(t, e, jr)
        }
        var As = $i(function (t, e, n) {
            null != e && 'function' != typeof e.toString && (e = Lt.call(e)), (t[e] = n)
          }, nc(oc)),
          ks = $i(function (t, e, n) {
            null != e && 'function' != typeof e.toString && (e = Lt.call(e)),
              Bt.call(t, e) ? t[e].push(n) : (t[e] = [n])
          }, ao),
          Is = Jr(kr)
        function Ts(t) {
          return Yu(t) ? Jn(t) : Rr(t)
        }
        function Ns(t) {
          return Yu(t) ? Jn(t, !0) : Lr(t)
        }
        var Bs = Ti(function (t, e, n) {
            zr(t, e, n)
          }),
          Ps = Ti(function (t, e, n, r) {
            zr(t, e, n, r)
          }),
          Rs = ro(function (t, e) {
            var n = {}
            if (null == t) return n
            var r = !1
            ;(e = Ie(e, function (e) {
              return (e = Di(e, t)), r || (r = e.length > 1), e
            })),
              ki(t, oo(t), n),
              r && (n = ar(n, 7, eo))
            for (var i = e.length; i--; ) hi(n, e[i])
            return n
          })
        var Ls = ro(function (t, e) {
          return null == t
            ? {}
            : (function (t, e) {
                return Gr(t, e, function (e, n) {
                  return js(t, n)
                })
              })(t, e)
        })
        function Ms(t, e) {
          if (null == t) return {}
          var n = Ie(oo(t), function (t) {
            return [t]
          })
          return (
            (e = ao(e)),
            Gr(t, n, function (t, n) {
              return e(t, n[0])
            })
          )
        }
        var Us = Ji(Ts),
          Vs = Ji(Ns)
        function $s(t) {
          return null == t ? [] : Je(t, Ts(t))
        }
        var zs = Ri(function (t, e, n) {
          return (e = e.toLowerCase()), t + (n ? qs(e) : e)
        })
        function qs(t) {
          return Zs(Ds(t).toLowerCase())
        }
        function Ws(t) {
          return (t = Ds(t)) && t.replace(mt, nn).replace(Zt, '')
        }
        var Gs = Ri(function (t, e, n) {
            return t + (n ? '-' : '') + e.toLowerCase()
          }),
          Ks = Ri(function (t, e, n) {
            return t + (n ? ' ' : '') + e.toLowerCase()
          }),
          Ys = Pi('toLowerCase')
        var Hs = Ri(function (t, e, n) {
          return t + (n ? '_' : '') + e.toLowerCase()
        })
        var Xs = Ri(function (t, e, n) {
          return t + (n ? ' ' : '') + Zs(e)
        })
        var Js = Ri(function (t, e, n) {
            return t + (n ? ' ' : '') + e.toUpperCase()
          }),
          Zs = Pi('toUpperCase')
        function Qs(t, e, r) {
          return (
            (t = Ds(t)),
            (e = r ? n : e) === n
              ? (function (t) {
                  return ne.test(t)
                })(t)
                ? (function (t) {
                    return t.match(te) || []
                  })(t)
                : (function (t) {
                    return t.match(at) || []
                  })(t)
              : t.match(e) || []
          )
        }
        var tc = Jr(function (t, e) {
            try {
              return xe(t, n, e)
            } catch (t) {
              return Zu(t) ? t : new Et(t)
            }
          }),
          ec = ro(function (t, e) {
            return (
              Ce(e, function (e) {
                ;(e = Mo(e)), ur(t, e, ku(t[e], t))
              }),
              t
            )
          })
        function nc(t) {
          return function () {
            return t
          }
        }
        var rc = Ui(),
          ic = Ui(!0)
        function oc(t) {
          return t
        }
        function uc(t) {
          return Pr('function' == typeof t ? t : ar(t, 1))
        }
        var sc = Jr(function (t, e) {
            return function (n) {
              return kr(n, t, e)
            }
          }),
          cc = Jr(function (t, e) {
            return function (n) {
              return kr(t, n, e)
            }
          })
        function ac(t, e, n) {
          var r = Ts(e),
            i = Er(e, r)
          null != n ||
            (ns(e) && (i.length || !r.length)) ||
            ((n = e), (e = t), (t = this), (i = Er(e, Ts(e))))
          var o = !(ns(n) && 'chain' in n && !n.chain),
            u = Qu(t)
          return (
            Ce(i, function (n) {
              var r = e[n]
              ;(t[n] = r),
                u &&
                  (t.prototype[n] = function () {
                    var e = this.__chain__
                    if (o || e) {
                      var n = t(this.__wrapped__),
                        i = (n.__actions__ = Ai(this.__actions__))
                      return (
                        i.push({ func: r, args: arguments, thisArg: t }),
                        (n.__chain__ = e),
                        n
                      )
                    }
                    return r.apply(t, Te([this.value()], arguments))
                  })
            }),
            t
          )
        }
        function fc() {}
        var lc = qi(Ie),
          hc = qi(Oe),
          pc = qi(Pe)
        function dc(t) {
          return _o(t)
            ? qe(Mo(t))
            : (function (t) {
                return function (e) {
                  return xr(e, t)
                }
              })(t)
        }
        var vc = Gi(),
          yc = Gi(!0)
        function bc() {
          return []
        }
        function gc() {
          return !1
        }
        var mc = zi(function (t, e) {
            return t + e
          }, 0),
          Dc = Hi('ceil'),
          wc = zi(function (t, e) {
            return t / e
          }, 1),
          _c = Hi('floor')
        var Ec = zi(function (t, e) {
            return t * e
          }, 1),
          xc = Hi('round'),
          Sc = zi(function (t, e) {
            return t - e
          }, 0)
        return (
          (Vn.after = function (t, e) {
            if ('function' != typeof e) throw new jt(r)
            return (
              (t = ys(t)),
              function () {
                if (--t < 1) return e.apply(this, arguments)
              }
            )
          }),
          (Vn.ary = ju),
          (Vn.assign = ws),
          (Vn.assignIn = _s),
          (Vn.assignInWith = Es),
          (Vn.assignWith = xs),
          (Vn.at = Ss),
          (Vn.before = Au),
          (Vn.bind = ku),
          (Vn.bindAll = ec),
          (Vn.bindKey = Iu),
          (Vn.castArray = function () {
            if (!arguments.length) return []
            var t = arguments[0]
            return Gu(t) ? t : [t]
          }),
          (Vn.chain = du),
          (Vn.chunk = function (t, e, r) {
            e = (r ? wo(t, e, r) : e === n) ? 1 : mn(ys(e), 0)
            var i = null == t ? 0 : t.length
            if (!i || e < 1) return []
            for (var o = 0, u = 0, s = ot(de(i / e)); o < i; ) s[u++] = ii(t, o, (o += e))
            return s
          }),
          (Vn.compact = function (t) {
            for (var e = -1, n = null == t ? 0 : t.length, r = 0, i = []; ++e < n; ) {
              var o = t[e]
              o && (i[r++] = o)
            }
            return i
          }),
          (Vn.concat = function () {
            var t = arguments.length
            if (!t) return []
            for (var e = ot(t - 1), n = arguments[0], r = t; r--; )
              e[r - 1] = arguments[r]
            return Te(Gu(n) ? Ai(n) : [n], gr(e, 1))
          }),
          (Vn.cond = function (t) {
            var e = null == t ? 0 : t.length,
              n = ao()
            return (
              (t = e
                ? Ie(t, function (t) {
                    if ('function' != typeof t[1]) throw new jt(r)
                    return [n(t[0]), t[1]]
                  })
                : []),
              Jr(function (n) {
                for (var r = -1; ++r < e; ) {
                  var i = t[r]
                  if (xe(i[0], this, n)) return xe(i[1], this, n)
                }
              })
            )
          }),
          (Vn.conforms = function (t) {
            return (function (t) {
              var e = Ts(t)
              return function (n) {
                return fr(n, t, e)
              }
            })(ar(t, 1))
          }),
          (Vn.constant = nc),
          (Vn.countBy = bu),
          (Vn.create = function (t, e) {
            var n = $n(t)
            return null == e ? n : or(n, e)
          }),
          (Vn.curry = function t(e, r, i) {
            var o = Zi(e, 8, n, n, n, n, n, (r = i ? n : r))
            return (o.placeholder = t.placeholder), o
          }),
          (Vn.curryRight = function t(e, r, i) {
            var o = Zi(e, u, n, n, n, n, n, (r = i ? n : r))
            return (o.placeholder = t.placeholder), o
          }),
          (Vn.debounce = Tu),
          (Vn.defaults = Cs),
          (Vn.defaultsDeep = Fs),
          (Vn.defer = Nu),
          (Vn.delay = Bu),
          (Vn.difference = $o),
          (Vn.differenceBy = zo),
          (Vn.differenceWith = qo),
          (Vn.drop = function (t, e, r) {
            var i = null == t ? 0 : t.length
            return i ? ii(t, (e = r || e === n ? 1 : ys(e)) < 0 ? 0 : e, i) : []
          }),
          (Vn.dropRight = function (t, e, r) {
            var i = null == t ? 0 : t.length
            return i ? ii(t, 0, (e = i - (e = r || e === n ? 1 : ys(e))) < 0 ? 0 : e) : []
          }),
          (Vn.dropRightWhile = function (t, e) {
            return t && t.length ? di(t, ao(e, 3), !0, !0) : []
          }),
          (Vn.dropWhile = function (t, e) {
            return t && t.length ? di(t, ao(e, 3), !0) : []
          }),
          (Vn.fill = function (t, e, r, i) {
            var o = null == t ? 0 : t.length
            return o
              ? (r && 'number' != typeof r && wo(t, e, r) && ((r = 0), (i = o)),
                (function (t, e, r, i) {
                  var o = t.length
                  for (
                    (r = ys(r)) < 0 && (r = -r > o ? 0 : o + r),
                      (i = i === n || i > o ? o : ys(i)) < 0 && (i += o),
                      i = r > i ? 0 : bs(i);
                    r < i;

                  )
                    t[r++] = e
                  return t
                })(t, e, r, i))
              : []
          }),
          (Vn.filter = function (t, e) {
            return (Gu(t) ? je : br)(t, ao(e, 3))
          }),
          (Vn.flatMap = function (t, e) {
            return gr(Su(t, e), 1)
          }),
          (Vn.flatMapDeep = function (t, e) {
            return gr(Su(t, e), l)
          }),
          (Vn.flatMapDepth = function (t, e, r) {
            return (r = r === n ? 1 : ys(r)), gr(Su(t, e), r)
          }),
          (Vn.flatten = Ko),
          (Vn.flattenDeep = function (t) {
            return (null == t ? 0 : t.length) ? gr(t, l) : []
          }),
          (Vn.flattenDepth = function (t, e) {
            return (null == t ? 0 : t.length) ? gr(t, (e = e === n ? 1 : ys(e))) : []
          }),
          (Vn.flip = function (t) {
            return Zi(t, 512)
          }),
          (Vn.flow = rc),
          (Vn.flowRight = ic),
          (Vn.fromPairs = function (t) {
            for (var e = -1, n = null == t ? 0 : t.length, r = {}; ++e < n; ) {
              var i = t[e]
              r[i[0]] = i[1]
            }
            return r
          }),
          (Vn.functions = function (t) {
            return null == t ? [] : Er(t, Ts(t))
          }),
          (Vn.functionsIn = function (t) {
            return null == t ? [] : Er(t, Ns(t))
          }),
          (Vn.groupBy = _u),
          (Vn.initial = function (t) {
            return (null == t ? 0 : t.length) ? ii(t, 0, -1) : []
          }),
          (Vn.intersection = Ho),
          (Vn.intersectionBy = Xo),
          (Vn.intersectionWith = Jo),
          (Vn.invert = As),
          (Vn.invertBy = ks),
          (Vn.invokeMap = Eu),
          (Vn.iteratee = uc),
          (Vn.keyBy = xu),
          (Vn.keys = Ts),
          (Vn.keysIn = Ns),
          (Vn.map = Su),
          (Vn.mapKeys = function (t, e) {
            var n = {}
            return (
              (e = ao(e, 3)),
              wr(t, function (t, r, i) {
                ur(n, e(t, r, i), t)
              }),
              n
            )
          }),
          (Vn.mapValues = function (t, e) {
            var n = {}
            return (
              (e = ao(e, 3)),
              wr(t, function (t, r, i) {
                ur(n, r, e(t, r, i))
              }),
              n
            )
          }),
          (Vn.matches = function (t) {
            return Vr(ar(t, 1))
          }),
          (Vn.matchesProperty = function (t, e) {
            return $r(t, ar(e, 1))
          }),
          (Vn.memoize = Pu),
          (Vn.merge = Bs),
          (Vn.mergeWith = Ps),
          (Vn.method = sc),
          (Vn.methodOf = cc),
          (Vn.mixin = ac),
          (Vn.negate = Ru),
          (Vn.nthArg = function (t) {
            return (
              (t = ys(t)),
              Jr(function (e) {
                return qr(e, t)
              })
            )
          }),
          (Vn.omit = Rs),
          (Vn.omitBy = function (t, e) {
            return Ms(t, Ru(ao(e)))
          }),
          (Vn.once = function (t) {
            return Au(2, t)
          }),
          (Vn.orderBy = function (t, e, r, i) {
            return null == t
              ? []
              : (Gu(e) || (e = null == e ? [] : [e]),
                Gu((r = i ? n : r)) || (r = null == r ? [] : [r]),
                Wr(t, e, r))
          }),
          (Vn.over = lc),
          (Vn.overArgs = Lu),
          (Vn.overEvery = hc),
          (Vn.overSome = pc),
          (Vn.partial = Mu),
          (Vn.partialRight = Uu),
          (Vn.partition = Cu),
          (Vn.pick = Ls),
          (Vn.pickBy = Ms),
          (Vn.property = dc),
          (Vn.propertyOf = function (t) {
            return function (e) {
              return null == t ? n : xr(t, e)
            }
          }),
          (Vn.pull = Qo),
          (Vn.pullAll = tu),
          (Vn.pullAllBy = function (t, e, n) {
            return t && t.length && e && e.length ? Kr(t, e, ao(n, 2)) : t
          }),
          (Vn.pullAllWith = function (t, e, r) {
            return t && t.length && e && e.length ? Kr(t, e, n, r) : t
          }),
          (Vn.pullAt = eu),
          (Vn.range = vc),
          (Vn.rangeRight = yc),
          (Vn.rearg = Vu),
          (Vn.reject = function (t, e) {
            return (Gu(t) ? je : br)(t, Ru(ao(e, 3)))
          }),
          (Vn.remove = function (t, e) {
            var n = []
            if (!t || !t.length) return n
            var r = -1,
              i = [],
              o = t.length
            for (e = ao(e, 3); ++r < o; ) {
              var u = t[r]
              e(u, r, t) && (n.push(u), i.push(r))
            }
            return Yr(t, i), n
          }),
          (Vn.rest = function (t, e) {
            if ('function' != typeof t) throw new jt(r)
            return Jr(t, (e = e === n ? e : ys(e)))
          }),
          (Vn.reverse = nu),
          (Vn.sampleSize = function (t, e, r) {
            return (e = (r ? wo(t, e, r) : e === n) ? 1 : ys(e)), (Gu(t) ? Qn : Qr)(t, e)
          }),
          (Vn.set = function (t, e, n) {
            return null == t ? t : ti(t, e, n)
          }),
          (Vn.setWith = function (t, e, r, i) {
            return (i = 'function' == typeof i ? i : n), null == t ? t : ti(t, e, r, i)
          }),
          (Vn.shuffle = function (t) {
            return (Gu(t) ? tr : ri)(t)
          }),
          (Vn.slice = function (t, e, r) {
            var i = null == t ? 0 : t.length
            return i
              ? (r && 'number' != typeof r && wo(t, e, r)
                  ? ((e = 0), (r = i))
                  : ((e = null == e ? 0 : ys(e)), (r = r === n ? i : ys(r))),
                ii(t, e, r))
              : []
          }),
          (Vn.sortBy = Fu),
          (Vn.sortedUniq = function (t) {
            return t && t.length ? ci(t) : []
          }),
          (Vn.sortedUniqBy = function (t, e) {
            return t && t.length ? ci(t, ao(e, 2)) : []
          }),
          (Vn.split = function (t, e, r) {
            return (
              r && 'number' != typeof r && wo(t, e, r) && (e = r = n),
              (r = r === n ? d : r >>> 0)
                ? (t = Ds(t)) &&
                  ('string' == typeof e || (null != e && !ss(e))) &&
                  !(e = fi(e)) &&
                  un(t)
                  ? _i(pn(t), 0, r)
                  : t.split(e, r)
                : []
            )
          }),
          (Vn.spread = function (t, e) {
            if ('function' != typeof t) throw new jt(r)
            return (
              (e = null == e ? 0 : mn(ys(e), 0)),
              Jr(function (n) {
                var r = n[e],
                  i = _i(n, 0, e)
                return r && Te(i, r), xe(t, this, i)
              })
            )
          }),
          (Vn.tail = function (t) {
            var e = null == t ? 0 : t.length
            return e ? ii(t, 1, e) : []
          }),
          (Vn.take = function (t, e, r) {
            return t && t.length
              ? ii(t, 0, (e = r || e === n ? 1 : ys(e)) < 0 ? 0 : e)
              : []
          }),
          (Vn.takeRight = function (t, e, r) {
            var i = null == t ? 0 : t.length
            return i ? ii(t, (e = i - (e = r || e === n ? 1 : ys(e))) < 0 ? 0 : e, i) : []
          }),
          (Vn.takeRightWhile = function (t, e) {
            return t && t.length ? di(t, ao(e, 3), !1, !0) : []
          }),
          (Vn.takeWhile = function (t, e) {
            return t && t.length ? di(t, ao(e, 3)) : []
          }),
          (Vn.tap = function (t, e) {
            return e(t), t
          }),
          (Vn.throttle = function (t, e, n) {
            var i = !0,
              o = !0
            if ('function' != typeof t) throw new jt(r)
            return (
              ns(n) &&
                ((i = 'leading' in n ? !!n.leading : i),
                (o = 'trailing' in n ? !!n.trailing : o)),
              Tu(t, e, { leading: i, maxWait: e, trailing: o })
            )
          }),
          (Vn.thru = vu),
          (Vn.toArray = ds),
          (Vn.toPairs = Us),
          (Vn.toPairsIn = Vs),
          (Vn.toPath = function (t) {
            return Gu(t) ? Ie(t, Mo) : fs(t) ? [t] : Ai(Lo(Ds(t)))
          }),
          (Vn.toPlainObject = ms),
          (Vn.transform = function (t, e, n) {
            var r = Gu(t),
              i = r || Xu(t) || ls(t)
            if (((e = ao(e, 4)), null == n)) {
              var o = t && t.constructor
              n = i ? (r ? new o() : []) : ns(t) && Qu(o) ? $n(Gt(t)) : {}
            }
            return (
              (i ? Ce : wr)(t, function (t, r, i) {
                return e(n, t, r, i)
              }),
              n
            )
          }),
          (Vn.unary = function (t) {
            return ju(t, 1)
          }),
          (Vn.union = ru),
          (Vn.unionBy = iu),
          (Vn.unionWith = ou),
          (Vn.uniq = function (t) {
            return t && t.length ? li(t) : []
          }),
          (Vn.uniqBy = function (t, e) {
            return t && t.length ? li(t, ao(e, 2)) : []
          }),
          (Vn.uniqWith = function (t, e) {
            return (e = 'function' == typeof e ? e : n), t && t.length ? li(t, n, e) : []
          }),
          (Vn.unset = function (t, e) {
            return null == t || hi(t, e)
          }),
          (Vn.unzip = uu),
          (Vn.unzipWith = su),
          (Vn.update = function (t, e, n) {
            return null == t ? t : pi(t, e, mi(n))
          }),
          (Vn.updateWith = function (t, e, r, i) {
            return (
              (i = 'function' == typeof i ? i : n), null == t ? t : pi(t, e, mi(r), i)
            )
          }),
          (Vn.values = $s),
          (Vn.valuesIn = function (t) {
            return null == t ? [] : Je(t, Ns(t))
          }),
          (Vn.without = cu),
          (Vn.words = Qs),
          (Vn.wrap = function (t, e) {
            return Mu(mi(e), t)
          }),
          (Vn.xor = au),
          (Vn.xorBy = fu),
          (Vn.xorWith = lu),
          (Vn.zip = hu),
          (Vn.zipObject = function (t, e) {
            return bi(t || [], e || [], nr)
          }),
          (Vn.zipObjectDeep = function (t, e) {
            return bi(t || [], e || [], ti)
          }),
          (Vn.zipWith = pu),
          (Vn.entries = Us),
          (Vn.entriesIn = Vs),
          (Vn.extend = _s),
          (Vn.extendWith = Es),
          ac(Vn, Vn),
          (Vn.add = mc),
          (Vn.attempt = tc),
          (Vn.camelCase = zs),
          (Vn.capitalize = qs),
          (Vn.ceil = Dc),
          (Vn.clamp = function (t, e, r) {
            return (
              r === n && ((r = e), (e = n)),
              r !== n && (r = (r = gs(r)) == r ? r : 0),
              e !== n && (e = (e = gs(e)) == e ? e : 0),
              cr(gs(t), e, r)
            )
          }),
          (Vn.clone = function (t) {
            return ar(t, 4)
          }),
          (Vn.cloneDeep = function (t) {
            return ar(t, 5)
          }),
          (Vn.cloneDeepWith = function (t, e) {
            return ar(t, 5, (e = 'function' == typeof e ? e : n))
          }),
          (Vn.cloneWith = function (t, e) {
            return ar(t, 4, (e = 'function' == typeof e ? e : n))
          }),
          (Vn.conformsTo = function (t, e) {
            return null == e || fr(t, e, Ts(e))
          }),
          (Vn.deburr = Ws),
          (Vn.defaultTo = function (t, e) {
            return null == t || t != t ? e : t
          }),
          (Vn.divide = wc),
          (Vn.endsWith = function (t, e, r) {
            ;(t = Ds(t)), (e = fi(e))
            var i = t.length,
              o = (r = r === n ? i : cr(ys(r), 0, i))
            return (r -= e.length) >= 0 && t.slice(r, o) == e
          }),
          (Vn.eq = $u),
          (Vn.escape = function (t) {
            return (t = Ds(t)) && H.test(t) ? t.replace(K, rn) : t
          }),
          (Vn.escapeRegExp = function (t) {
            return (t = Ds(t)) && rt.test(t) ? t.replace(nt, '\\$&') : t
          }),
          (Vn.every = function (t, e, r) {
            var i = Gu(t) ? Oe : vr
            return r && wo(t, e, r) && (e = n), i(t, ao(e, 3))
          }),
          (Vn.find = gu),
          (Vn.findIndex = Wo),
          (Vn.findKey = function (t, e) {
            return Le(t, ao(e, 3), wr)
          }),
          (Vn.findLast = mu),
          (Vn.findLastIndex = Go),
          (Vn.findLastKey = function (t, e) {
            return Le(t, ao(e, 3), _r)
          }),
          (Vn.floor = _c),
          (Vn.forEach = Du),
          (Vn.forEachRight = wu),
          (Vn.forIn = function (t, e) {
            return null == t ? t : mr(t, ao(e, 3), Ns)
          }),
          (Vn.forInRight = function (t, e) {
            return null == t ? t : Dr(t, ao(e, 3), Ns)
          }),
          (Vn.forOwn = function (t, e) {
            return t && wr(t, ao(e, 3))
          }),
          (Vn.forOwnRight = function (t, e) {
            return t && _r(t, ao(e, 3))
          }),
          (Vn.get = Os),
          (Vn.gt = zu),
          (Vn.gte = qu),
          (Vn.has = function (t, e) {
            return null != t && bo(t, e, Or)
          }),
          (Vn.hasIn = js),
          (Vn.head = Yo),
          (Vn.identity = oc),
          (Vn.includes = function (t, e, n, r) {
            ;(t = Yu(t) ? t : $s(t)), (n = n && !r ? ys(n) : 0)
            var i = t.length
            return (
              n < 0 && (n = mn(i + n, 0)),
              as(t) ? n <= i && t.indexOf(e, n) > -1 : !!i && Ue(t, e, n) > -1
            )
          }),
          (Vn.indexOf = function (t, e, n) {
            var r = null == t ? 0 : t.length
            if (!r) return -1
            var i = null == n ? 0 : ys(n)
            return i < 0 && (i = mn(r + i, 0)), Ue(t, e, i)
          }),
          (Vn.inRange = function (t, e, r) {
            return (
              (e = vs(e)),
              r === n ? ((r = e), (e = 0)) : (r = vs(r)),
              (function (t, e, n) {
                return t >= Dn(e, n) && t < mn(e, n)
              })((t = gs(t)), e, r)
            )
          }),
          (Vn.invoke = Is),
          (Vn.isArguments = Wu),
          (Vn.isArray = Gu),
          (Vn.isArrayBuffer = Ku),
          (Vn.isArrayLike = Yu),
          (Vn.isArrayLikeObject = Hu),
          (Vn.isBoolean = function (t) {
            return !0 === t || !1 === t || (rs(t) && Cr(t) == g)
          }),
          (Vn.isBuffer = Xu),
          (Vn.isDate = Ju),
          (Vn.isElement = function (t) {
            return rs(t) && 1 === t.nodeType && !us(t)
          }),
          (Vn.isEmpty = function (t) {
            if (null == t) return !0
            if (
              Yu(t) &&
              (Gu(t) ||
                'string' == typeof t ||
                'function' == typeof t.splice ||
                Xu(t) ||
                ls(t) ||
                Wu(t))
            )
              return !t.length
            var e = yo(t)
            if (e == E || e == O) return !t.size
            if (So(t)) return !Rr(t).length
            for (var n in t) if (Bt.call(t, n)) return !1
            return !0
          }),
          (Vn.isEqual = function (t, e) {
            return Tr(t, e)
          }),
          (Vn.isEqualWith = function (t, e, r) {
            var i = (r = 'function' == typeof r ? r : n) ? r(t, e) : n
            return i === n ? Tr(t, e, n, r) : !!i
          }),
          (Vn.isError = Zu),
          (Vn.isFinite = function (t) {
            return 'number' == typeof t && We(t)
          }),
          (Vn.isFunction = Qu),
          (Vn.isInteger = ts),
          (Vn.isLength = es),
          (Vn.isMap = is),
          (Vn.isMatch = function (t, e) {
            return t === e || Nr(t, e, lo(e))
          }),
          (Vn.isMatchWith = function (t, e, r) {
            return (r = 'function' == typeof r ? r : n), Nr(t, e, lo(e), r)
          }),
          (Vn.isNaN = function (t) {
            return os(t) && t != +t
          }),
          (Vn.isNative = function (t) {
            if (xo(t))
              throw new Et(
                'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.'
              )
            return Br(t)
          }),
          (Vn.isNil = function (t) {
            return null == t
          }),
          (Vn.isNull = function (t) {
            return null === t
          }),
          (Vn.isNumber = os),
          (Vn.isObject = ns),
          (Vn.isObjectLike = rs),
          (Vn.isPlainObject = us),
          (Vn.isRegExp = ss),
          (Vn.isSafeInteger = function (t) {
            return ts(t) && t >= -9007199254740991 && t <= h
          }),
          (Vn.isSet = cs),
          (Vn.isString = as),
          (Vn.isSymbol = fs),
          (Vn.isTypedArray = ls),
          (Vn.isUndefined = function (t) {
            return t === n
          }),
          (Vn.isWeakMap = function (t) {
            return rs(t) && yo(t) == k
          }),
          (Vn.isWeakSet = function (t) {
            return rs(t) && '[object WeakSet]' == Cr(t)
          }),
          (Vn.join = function (t, e) {
            return null == t ? '' : bn.call(t, e)
          }),
          (Vn.kebabCase = Gs),
          (Vn.last = Zo),
          (Vn.lastIndexOf = function (t, e, r) {
            var i = null == t ? 0 : t.length
            if (!i) return -1
            var o = i
            return (
              r !== n && (o = (o = ys(r)) < 0 ? mn(i + o, 0) : Dn(o, i - 1)),
              e == e
                ? (function (t, e, n) {
                    for (var r = n + 1; r--; ) if (t[r] === e) return r
                    return r
                  })(t, e, o)
                : Me(t, $e, o, !0)
            )
          }),
          (Vn.lowerCase = Ks),
          (Vn.lowerFirst = Ys),
          (Vn.lt = hs),
          (Vn.lte = ps),
          (Vn.max = function (t) {
            return t && t.length ? yr(t, oc, Fr) : n
          }),
          (Vn.maxBy = function (t, e) {
            return t && t.length ? yr(t, ao(e, 2), Fr) : n
          }),
          (Vn.mean = function (t) {
            return ze(t, oc)
          }),
          (Vn.meanBy = function (t, e) {
            return ze(t, ao(e, 2))
          }),
          (Vn.min = function (t) {
            return t && t.length ? yr(t, oc, Mr) : n
          }),
          (Vn.minBy = function (t, e) {
            return t && t.length ? yr(t, ao(e, 2), Mr) : n
          }),
          (Vn.stubArray = bc),
          (Vn.stubFalse = gc),
          (Vn.stubObject = function () {
            return {}
          }),
          (Vn.stubString = function () {
            return ''
          }),
          (Vn.stubTrue = function () {
            return !0
          }),
          (Vn.multiply = Ec),
          (Vn.nth = function (t, e) {
            return t && t.length ? qr(t, ys(e)) : n
          }),
          (Vn.noConflict = function () {
            return he._ === this && (he._ = Ut), this
          }),
          (Vn.noop = fc),
          (Vn.now = Ou),
          (Vn.pad = function (t, e, n) {
            t = Ds(t)
            var r = (e = ys(e)) ? hn(t) : 0
            if (!e || r >= e) return t
            var i = (e - r) / 2
            return Wi(ye(i), n) + t + Wi(de(i), n)
          }),
          (Vn.padEnd = function (t, e, n) {
            t = Ds(t)
            var r = (e = ys(e)) ? hn(t) : 0
            return e && r < e ? t + Wi(e - r, n) : t
          }),
          (Vn.padStart = function (t, e, n) {
            t = Ds(t)
            var r = (e = ys(e)) ? hn(t) : 0
            return e && r < e ? Wi(e - r, n) + t : t
          }),
          (Vn.parseInt = function (t, e, n) {
            return (
              n || null == e ? (e = 0) : e && (e = +e), _n(Ds(t).replace(it, ''), e || 0)
            )
          }),
          (Vn.random = function (t, e, r) {
            if (
              (r && 'boolean' != typeof r && wo(t, e, r) && (e = r = n),
              r === n &&
                ('boolean' == typeof e
                  ? ((r = e), (e = n))
                  : 'boolean' == typeof t && ((r = t), (t = n))),
              t === n && e === n
                ? ((t = 0), (e = 1))
                : ((t = vs(t)), e === n ? ((e = t), (t = 0)) : (e = vs(e))),
              t > e)
            ) {
              var i = t
              ;(t = e), (e = i)
            }
            if (r || t % 1 || e % 1) {
              var o = En()
              return Dn(t + o * (e - t + ce('1e-' + ((o + '').length - 1))), e)
            }
            return Hr(t, e)
          }),
          (Vn.reduce = function (t, e, n) {
            var r = Gu(t) ? Ne : Ge,
              i = arguments.length < 3
            return r(t, ao(e, 4), n, i, pr)
          }),
          (Vn.reduceRight = function (t, e, n) {
            var r = Gu(t) ? Be : Ge,
              i = arguments.length < 3
            return r(t, ao(e, 4), n, i, dr)
          }),
          (Vn.repeat = function (t, e, r) {
            return (e = (r ? wo(t, e, r) : e === n) ? 1 : ys(e)), Xr(Ds(t), e)
          }),
          (Vn.replace = function () {
            var t = arguments,
              e = Ds(t[0])
            return t.length < 3 ? e : e.replace(t[1], t[2])
          }),
          (Vn.result = function (t, e, r) {
            var i = -1,
              o = (e = Di(e, t)).length
            for (o || ((o = 1), (t = n)); ++i < o; ) {
              var u = null == t ? n : t[Mo(e[i])]
              u === n && ((i = o), (u = r)), (t = Qu(u) ? u.call(t) : u)
            }
            return t
          }),
          (Vn.round = xc),
          (Vn.runInContext = t),
          (Vn.sample = function (t) {
            return (Gu(t) ? Zn : Zr)(t)
          }),
          (Vn.size = function (t) {
            if (null == t) return 0
            if (Yu(t)) return as(t) ? hn(t) : t.length
            var e = yo(t)
            return e == E || e == O ? t.size : Rr(t).length
          }),
          (Vn.snakeCase = Hs),
          (Vn.some = function (t, e, r) {
            var i = Gu(t) ? Pe : oi
            return r && wo(t, e, r) && (e = n), i(t, ao(e, 3))
          }),
          (Vn.sortedIndex = function (t, e) {
            return ui(t, e)
          }),
          (Vn.sortedIndexBy = function (t, e, n) {
            return si(t, e, ao(n, 2))
          }),
          (Vn.sortedIndexOf = function (t, e) {
            var n = null == t ? 0 : t.length
            if (n) {
              var r = ui(t, e)
              if (r < n && $u(t[r], e)) return r
            }
            return -1
          }),
          (Vn.sortedLastIndex = function (t, e) {
            return ui(t, e, !0)
          }),
          (Vn.sortedLastIndexBy = function (t, e, n) {
            return si(t, e, ao(n, 2), !0)
          }),
          (Vn.sortedLastIndexOf = function (t, e) {
            if (null == t ? 0 : t.length) {
              var n = ui(t, e, !0) - 1
              if ($u(t[n], e)) return n
            }
            return -1
          }),
          (Vn.startCase = Xs),
          (Vn.startsWith = function (t, e, n) {
            return (
              (t = Ds(t)),
              (n = null == n ? 0 : cr(ys(n), 0, t.length)),
              (e = fi(e)),
              t.slice(n, n + e.length) == e
            )
          }),
          (Vn.subtract = Sc),
          (Vn.sum = function (t) {
            return t && t.length ? Ke(t, oc) : 0
          }),
          (Vn.sumBy = function (t, e) {
            return t && t.length ? Ke(t, ao(e, 2)) : 0
          }),
          (Vn.template = function (t, e, r) {
            var i = Vn.templateSettings
            r && wo(t, e, r) && (e = n), (t = Ds(t)), (e = Es({}, e, i, Qi))
            var o,
              u,
              s = Es({}, e.imports, i.imports, Qi),
              c = Ts(s),
              a = Je(s, c),
              f = 0,
              l = e.interpolate || Dt,
              h = "__p += '",
              p = Ft(
                (e.escape || Dt).source +
                  '|' +
                  l.source +
                  '|' +
                  (l === Z ? ht : Dt).source +
                  '|' +
                  (e.evaluate || Dt).source +
                  '|$',
                'g'
              ),
              d =
                '//# sourceURL=' +
                (Bt.call(e, 'sourceURL')
                  ? (e.sourceURL + '').replace(/\s/g, ' ')
                  : 'lodash.templateSources[' + ++ie + ']') +
                '\n'
            t.replace(p, function (e, n, r, i, s, c) {
              return (
                r || (r = i),
                (h += t.slice(f, c).replace(wt, on)),
                n && ((o = !0), (h += "' +\n__e(" + n + ") +\n'")),
                s && ((u = !0), (h += "';\n" + s + ";\n__p += '")),
                r && (h += "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'"),
                (f = c + e.length),
                e
              )
            }),
              (h += "';\n")
            var v = Bt.call(e, 'variable') && e.variable
            if (v) {
              if (ft.test(v))
                throw new Et('Invalid `variable` option passed into `_.template`')
            } else h = 'with (obj) {\n' + h + '\n}\n'
            ;(h = (u ? h.replace(z, '') : h).replace(q, '$1').replace(W, '$1;')),
              (h =
                'function(' +
                (v || 'obj') +
                ') {\n' +
                (v ? '' : 'obj || (obj = {});\n') +
                "var __t, __p = ''" +
                (o ? ', __e = _.escape' : '') +
                (u
                  ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n"
                  : ';\n') +
                h +
                'return __p\n}')
            var y = tc(function () {
              return xt(c, d + 'return ' + h).apply(n, a)
            })
            if (((y.source = h), Zu(y))) throw y
            return y
          }),
          (Vn.times = function (t, e) {
            if ((t = ys(t)) < 1 || t > h) return []
            var n = d,
              r = Dn(t, d)
            ;(e = ao(e)), (t -= d)
            for (var i = Ye(r, e); ++n < t; ) e(n)
            return i
          }),
          (Vn.toFinite = vs),
          (Vn.toInteger = ys),
          (Vn.toLength = bs),
          (Vn.toLower = function (t) {
            return Ds(t).toLowerCase()
          }),
          (Vn.toNumber = gs),
          (Vn.toSafeInteger = function (t) {
            return t ? cr(ys(t), -9007199254740991, h) : 0 === t ? t : 0
          }),
          (Vn.toString = Ds),
          (Vn.toUpper = function (t) {
            return Ds(t).toUpperCase()
          }),
          (Vn.trim = function (t, e, r) {
            if ((t = Ds(t)) && (r || e === n)) return He(t)
            if (!t || !(e = fi(e))) return t
            var i = pn(t),
              o = pn(e)
            return _i(i, Qe(i, o), tn(i, o) + 1).join('')
          }),
          (Vn.trimEnd = function (t, e, r) {
            if ((t = Ds(t)) && (r || e === n)) return t.slice(0, dn(t) + 1)
            if (!t || !(e = fi(e))) return t
            var i = pn(t)
            return _i(i, 0, tn(i, pn(e)) + 1).join('')
          }),
          (Vn.trimStart = function (t, e, r) {
            if ((t = Ds(t)) && (r || e === n)) return t.replace(it, '')
            if (!t || !(e = fi(e))) return t
            var i = pn(t)
            return _i(i, Qe(i, pn(e))).join('')
          }),
          (Vn.truncate = function (t, e) {
            var r = 30,
              i = '...'
            if (ns(e)) {
              var o = 'separator' in e ? e.separator : o
              ;(r = 'length' in e ? ys(e.length) : r),
                (i = 'omission' in e ? fi(e.omission) : i)
            }
            var u = (t = Ds(t)).length
            if (un(t)) {
              var s = pn(t)
              u = s.length
            }
            if (r >= u) return t
            var c = r - hn(i)
            if (c < 1) return i
            var a = s ? _i(s, 0, c).join('') : t.slice(0, c)
            if (o === n) return a + i
            if ((s && (c += a.length - c), ss(o))) {
              if (t.slice(c).search(o)) {
                var f,
                  l = a
                for (
                  o.global || (o = Ft(o.source, Ds(pt.exec(o)) + 'g')), o.lastIndex = 0;
                  (f = o.exec(l));

                )
                  var h = f.index
                a = a.slice(0, h === n ? c : h)
              }
            } else if (t.indexOf(fi(o), c) != c) {
              var p = a.lastIndexOf(o)
              p > -1 && (a = a.slice(0, p))
            }
            return a + i
          }),
          (Vn.unescape = function (t) {
            return (t = Ds(t)) && Y.test(t) ? t.replace(G, vn) : t
          }),
          (Vn.uniqueId = function (t) {
            var e = ++Pt
            return Ds(t) + e
          }),
          (Vn.upperCase = Js),
          (Vn.upperFirst = Zs),
          (Vn.each = Du),
          (Vn.eachRight = wu),
          (Vn.first = Yo),
          ac(
            Vn,
            (function () {
              var t = {}
              return (
                wr(Vn, function (e, n) {
                  Bt.call(Vn.prototype, n) || (t[n] = e)
                }),
                t
              )
            })(),
            { chain: !1 }
          ),
          (Vn.VERSION = '4.17.21'),
          Ce(
            ['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'],
            function (t) {
              Vn[t].placeholder = Vn
            }
          ),
          Ce(['drop', 'take'], function (t, e) {
            ;(Wn.prototype[t] = function (r) {
              r = r === n ? 1 : mn(ys(r), 0)
              var i = this.__filtered__ && !e ? new Wn(this) : this.clone()
              return (
                i.__filtered__
                  ? (i.__takeCount__ = Dn(r, i.__takeCount__))
                  : i.__views__.push({
                      size: Dn(r, d),
                      type: t + (i.__dir__ < 0 ? 'Right' : '')
                    }),
                i
              )
            }),
              (Wn.prototype[t + 'Right'] = function (e) {
                return this.reverse()[t](e).reverse()
              })
          }),
          Ce(['filter', 'map', 'takeWhile'], function (t, e) {
            var n = e + 1,
              r = 1 == n || 3 == n
            Wn.prototype[t] = function (t) {
              var e = this.clone()
              return (
                e.__iteratees__.push({ iteratee: ao(t, 3), type: n }),
                (e.__filtered__ = e.__filtered__ || r),
                e
              )
            }
          }),
          Ce(['head', 'last'], function (t, e) {
            var n = 'take' + (e ? 'Right' : '')
            Wn.prototype[t] = function () {
              return this[n](1).value()[0]
            }
          }),
          Ce(['initial', 'tail'], function (t, e) {
            var n = 'drop' + (e ? '' : 'Right')
            Wn.prototype[t] = function () {
              return this.__filtered__ ? new Wn(this) : this[n](1)
            }
          }),
          (Wn.prototype.compact = function () {
            return this.filter(oc)
          }),
          (Wn.prototype.find = function (t) {
            return this.filter(t).head()
          }),
          (Wn.prototype.findLast = function (t) {
            return this.reverse().find(t)
          }),
          (Wn.prototype.invokeMap = Jr(function (t, e) {
            return 'function' == typeof t
              ? new Wn(this)
              : this.map(function (n) {
                  return kr(n, t, e)
                })
          })),
          (Wn.prototype.reject = function (t) {
            return this.filter(Ru(ao(t)))
          }),
          (Wn.prototype.slice = function (t, e) {
            t = ys(t)
            var r = this
            return r.__filtered__ && (t > 0 || e < 0)
              ? new Wn(r)
              : (t < 0 ? (r = r.takeRight(-t)) : t && (r = r.drop(t)),
                e !== n && (r = (e = ys(e)) < 0 ? r.dropRight(-e) : r.take(e - t)),
                r)
          }),
          (Wn.prototype.takeRightWhile = function (t) {
            return this.reverse().takeWhile(t).reverse()
          }),
          (Wn.prototype.toArray = function () {
            return this.take(d)
          }),
          wr(Wn.prototype, function (t, e) {
            var r = /^(?:filter|find|map|reject)|While$/.test(e),
              i = /^(?:head|last)$/.test(e),
              o = Vn[i ? 'take' + ('last' == e ? 'Right' : '') : e],
              u = i || /^find/.test(e)
            o &&
              (Vn.prototype[e] = function () {
                var e = this.__wrapped__,
                  s = i ? [1] : arguments,
                  c = e instanceof Wn,
                  a = s[0],
                  f = c || Gu(e),
                  l = function (t) {
                    var e = o.apply(Vn, Te([t], s))
                    return i && h ? e[0] : e
                  }
                f && r && 'function' == typeof a && 1 != a.length && (c = f = !1)
                var h = this.__chain__,
                  p = !!this.__actions__.length,
                  d = u && !h,
                  v = c && !p
                if (!u && f) {
                  e = v ? e : new Wn(this)
                  var y = t.apply(e, s)
                  return (
                    y.__actions__.push({ func: vu, args: [l], thisArg: n }), new qn(y, h)
                  )
                }
                return d && v
                  ? t.apply(this, s)
                  : ((y = this.thru(l)), d ? (i ? y.value()[0] : y.value()) : y)
              })
          }),
          Ce(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function (t) {
            var e = At[t],
              n = /^(?:push|sort|unshift)$/.test(t) ? 'tap' : 'thru',
              r = /^(?:pop|shift)$/.test(t)
            Vn.prototype[t] = function () {
              var t = arguments
              if (r && !this.__chain__) {
                var i = this.value()
                return e.apply(Gu(i) ? i : [], t)
              }
              return this[n](function (n) {
                return e.apply(Gu(n) ? n : [], t)
              })
            }
          }),
          wr(Wn.prototype, function (t, e) {
            var n = Vn[e]
            if (n) {
              var r = n.name + ''
              Bt.call(In, r) || (In[r] = []), In[r].push({ name: e, func: n })
            }
          }),
          (In[Vi(n, 2).name] = [{ name: 'wrapper', func: n }]),
          (Wn.prototype.clone = function () {
            var t = new Wn(this.__wrapped__)
            return (
              (t.__actions__ = Ai(this.__actions__)),
              (t.__dir__ = this.__dir__),
              (t.__filtered__ = this.__filtered__),
              (t.__iteratees__ = Ai(this.__iteratees__)),
              (t.__takeCount__ = this.__takeCount__),
              (t.__views__ = Ai(this.__views__)),
              t
            )
          }),
          (Wn.prototype.reverse = function () {
            if (this.__filtered__) {
              var t = new Wn(this)
              ;(t.__dir__ = -1), (t.__filtered__ = !0)
            } else (t = this.clone()).__dir__ *= -1
            return t
          }),
          (Wn.prototype.value = function () {
            var t = this.__wrapped__.value(),
              e = this.__dir__,
              n = Gu(t),
              r = e < 0,
              i = n ? t.length : 0,
              o = (function (t, e, n) {
                var r = -1,
                  i = n.length
                for (; ++r < i; ) {
                  var o = n[r],
                    u = o.size
                  switch (o.type) {
                    case 'drop':
                      t += u
                      break
                    case 'dropRight':
                      e -= u
                      break
                    case 'take':
                      e = Dn(e, t + u)
                      break
                    case 'takeRight':
                      t = mn(t, e - u)
                  }
                }
                return { start: t, end: e }
              })(0, i, this.__views__),
              u = o.start,
              s = o.end,
              c = s - u,
              a = r ? s : u - 1,
              f = this.__iteratees__,
              l = f.length,
              h = 0,
              p = Dn(c, this.__takeCount__)
            if (!n || (!r && i == c && p == c)) return vi(t, this.__actions__)
            var d = []
            t: for (; c-- && h < p; ) {
              for (var v = -1, y = t[(a += e)]; ++v < l; ) {
                var b = f[v],
                  g = b.iteratee,
                  m = b.type,
                  D = g(y)
                if (2 == m) y = D
                else if (!D) {
                  if (1 == m) continue t
                  break t
                }
              }
              d[h++] = y
            }
            return d
          }),
          (Vn.prototype.at = yu),
          (Vn.prototype.chain = function () {
            return du(this)
          }),
          (Vn.prototype.commit = function () {
            return new qn(this.value(), this.__chain__)
          }),
          (Vn.prototype.next = function () {
            this.__values__ === n && (this.__values__ = ds(this.value()))
            var t = this.__index__ >= this.__values__.length
            return { done: t, value: t ? n : this.__values__[this.__index__++] }
          }),
          (Vn.prototype.plant = function (t) {
            for (var e, r = this; r instanceof zn; ) {
              var i = Vo(r)
              ;(i.__index__ = 0), (i.__values__ = n), e ? (o.__wrapped__ = i) : (e = i)
              var o = i
              r = r.__wrapped__
            }
            return (o.__wrapped__ = t), e
          }),
          (Vn.prototype.reverse = function () {
            var t = this.__wrapped__
            if (t instanceof Wn) {
              var e = t
              return (
                this.__actions__.length && (e = new Wn(this)),
                (e = e.reverse()).__actions__.push({ func: vu, args: [nu], thisArg: n }),
                new qn(e, this.__chain__)
              )
            }
            return this.thru(nu)
          }),
          (Vn.prototype.toJSON = Vn.prototype.valueOf = Vn.prototype.value = function () {
            return vi(this.__wrapped__, this.__actions__)
          }),
          (Vn.prototype.first = Vn.prototype.head),
          Qt &&
            (Vn.prototype[Qt] = function () {
              return this
            }),
          Vn
        )
      })()
      de ? (((de.exports = yn)._ = yn), (pe._ = yn)) : (he._ = yn)
    }.call(St))
  })
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ function r_(t) {
  const e = m.default.readFileSync(t, 'utf-8')
  return e_(e)
    .map((t) => t.path)
    .filter((t) => '.' === t.charAt(0))
    .map((e) =>
      Gw(
        HD.sync(e, {
          basedir: D.default.dirname(t),
          extensions: ['.tsx', '.ts', '.jsx', '.js']
        })
      )
    )
}
const i_ = {
  javascript: ['.ts', '.tsx', '.js', '.jsx'],
  css: ['.less', '.sass', '.scss', '.stylus', '.css']
}
const o_ = 'win32' === process.platform,
  u_ = { isEmpty: Kw, mapValues: Yw, pullAll: t_ }
Object.defineProperty(exports, 'cheerio', {
  enumerable: !0,
  get: function () {
    return B.default
  }
}),
  Object.defineProperty(exports, 'glob', {
    enumerable: !0,
    get: function () {
      return P.default
    }
  }),
  (exports.address = rw),
  (exports.chalk = Ww),
  (exports.clearConsole = function () {
    'true' !== process.env.ZMI_TEST &&
      process.stdout.write('win32' === process.platform ? '[2J[0f' : '[2J[3J[H')
  }),
  (exports.compatibleWithESModule = function (t) {
    return t.__esModule ? t.default : t
  }),
  (exports.deepmerge = fe),
  (exports.dyo = { alias: { version: ['v'], help: ['h'] }, boolean: ['version'] }),
  (exports.filesize = ge),
  (exports.flatDeep = function t(e, n = []) {
    return (
      e.forEach((e) => {
        Array.isArray(e) ? t(e, n) : n.push(e)
      }),
      n
    )
  }),
  (exports.fsExtra = uD),
  (exports.getFile = function (t) {
    const e = [...i_[t.type]]
    for (; e.length; ) {
      const n = `${t.fileNameWithoutExt}${e.shift()}`,
        r = Gw(D.default.join(t.base, n))
      if (m.default.existsSync(r)) return { paths: r, filename: n }
    }
    return null
  }),
  (exports.gzipSize = be),
  (exports.inquirer = Qb),
  (exports.isLerna = function (t) {
    return m.default.existsSync(D.default.join(t, 'lerna.json'))
  }),
  (exports.isWin = o_),
  (exports.launchDevice = (t) => {
    const e = xt(process.argv.slice(2), t)
    return { args: e, command: e._[0] }
  }),
  (exports.lodash = u_),
  (exports.makeDir = pD),
  (exports.mergeConfig = function (t, ...e) {
    const n = Object.assign({}, t)
    return (
      e.forEach((t) => {
        t &&
          Object.keys(t).forEach((e) => {
            const r = t[e]
            n[e] = 'function' == typeof r ? r(n[e]) : r
          })
      }),
      n
    )
  }),
  (exports.mustache = Pe),
  (exports.parseRequireDeps = function (t) {
    const e = [t],
      n = [Gw(t)]
    for (; e.length; ) {
      const t = n_.pullAll(r_(e.shift()), n)
      t.length && (e.push(...t), n.push(...t))
    }
    return n
  }),
  (exports.pkgUp = yw),
  (exports.portfinder = Xt),
  (exports.recursiveReaddir = dt),
  (exports.resolve = HD),
  (exports.slash = Gw),
  (exports.stripAnsi = Jt),
  (exports.textTable = function (t, e) {
    e || (e = {})
    var n = void 0 === e.hsep ? '  ' : e.hsep,
      r = e.align || [],
      i =
        e.stringLength ||
        function (t) {
          return String(t).length
        },
      o = Qt(
        t,
        function (t, e) {
          return (
            te(e, function (e, n) {
              var r = Zt(e)
              ;(!t[n] || r > t[n]) && (t[n] = r)
            }),
            t
          )
        },
        []
      ),
      u = ee(t, function (t) {
        return ee(t, function (t, e) {
          var n = String(t)
          if ('.' === r[e]) {
            var u = Zt(n),
              s = o[e] + (/\./.test(n) ? 1 : 2) - (i(n) - u)
            return n + Array(s).join(' ')
          }
          return n
        })
      }),
      s = Qt(
        u,
        function (t, e) {
          return (
            te(e, function (e, n) {
              var r = i(e)
              ;(!t[n] || r > t[n]) && (t[n] = r)
            }),
            t
          )
        },
        []
      )
    return ee(u, function (t) {
      return ee(t, function (t, e) {
        var n = s[e] - i(t) || 0,
          o = Array(Math.max(n + 1, 1)).join(' ')
        return 'r' === r[e] || '.' === r[e]
          ? o + t
          : 'c' === r[e]
          ? Array(Math.ceil(n / 2 + 1)).join(' ') +
            t +
            Array(Math.floor(n / 2 + 1)).join(' ')
          : t + o
      })
        .join(n)
        .replace(/\s+$/, '')
    }).join('\n')
  }),
  (exports.yargsParser = xt)
