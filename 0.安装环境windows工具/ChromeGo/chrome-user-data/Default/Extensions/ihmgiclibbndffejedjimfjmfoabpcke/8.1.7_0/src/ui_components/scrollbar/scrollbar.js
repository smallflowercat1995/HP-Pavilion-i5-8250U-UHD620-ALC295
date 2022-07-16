/*
 Scrolling Divs code from Dynamic Web Coding at dyn-web.com
 Copyright 2001-2012 by Sharon Paine
 See Terms of Use at www.dyn-web.com/business/terms.php
 This notice must be retained in the code as is!

 For demos, documentation and updates, visit http://www.dyn-web.com/code/scroll/
 version date: Feb 2012
 */

/*
 Resources:
 detecting if touch device: http://modernizr.github.com/Modernizr/touch.html
 mousewheel code: http://adomas.org/javascript-mouse-wheel/
 switchKeyEvents (keypress/keydown): http://www.quirksmode.org/js/dragdrop.html
 addEvent for custom scroll events: Mark Wubben (see http://simonwillison.net/2004/May/26/addLoadEvent/)
 dw_Util.getCurrentStyle: jquery and dean edwards (http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291)
 */

function dw_scrollObj(a, b, c) {
    var d = document.getElementById(a);
    this.id = a, dw_scrollObj.col[this.id] = this, this.animString = dw_scrollObj.col[this.id], this.load(b, c), d.addEventListener && d.addEventListener("DOMMouseScroll", dw_scrollObj.doOnMouseWheel, !1), d.onmousewheel = dw_scrollObj.doOnMouseWheel
}
function dw_Slidebar(a, b, c, d, e) {
    var f = document.getElementById(a), g = document.getElementById(b);
    this.barId = a, this.trackId = b, this.axis = c, this.x = d || 0, this.y = e || 0, dw_Slidebar.col[this.barId] = this, this.bar = f, this.shiftTo(d, e), c == "v" ? (this.maxY = g.offsetHeight - f.offsetHeight - e, this.minY = e, this.minX = this.maxX = d) : (this.maxX = g.offsetWidth - f.offsetWidth - d, this.minX = d, this.minY = this.maxY = e), this.on_drag_start = this.on_drag = this.on_drag_end = this.on_slide_start = this.on_slide = this.on_slide_end = function () {
    }, dw_Event.add(f, "mousedown", function (b) {
        dw_Slidebar.prepDrag(b, a)
    }), dw_Event.add(g, "mousedown", function (b) {
        dw_Slidebar.prepSlide(b, a)
    }), g = this.bar = f = null
}
var dw_Event = {add: function (a, b, c, d) {
    a.addEventListener ? a.addEventListener(b, c, d || !1) : a.attachEvent && a.attachEvent("on" + b, c)
}, remove: function (a, b, c, d) {
    a.removeEventListener ? a.removeEventListener(b, c, d || !1) : a.detachEvent && a.detachEvent("on" + b, c)
}, DOMit: function (a) {
    return a = a ? a : window.event, a.target || (a.target = a.srcElement), a.preventDefault || (a.preventDefault = function () {
        return a.returnValue = !1
    }), a.stopPropagation || (a.stopPropagation = function () {
        a.cancelBubble = !0
    }), a
}, getTarget: function (a) {
    return a = dw_Event.DOMit(a), a = a.target, a.nodeType != 1 && (a = a.parentNode), a
}};
dw_scrollObj.printEnabled = !1, dw_scrollObj.defaultSpeed = dw_scrollObj.prototype.speed = 100, dw_scrollObj.defaultSlideDur = dw_scrollObj.prototype.slideDur = 500, dw_scrollObj.mousewheelSpeed = 20, dw_scrollObj.mousewheelHorizSpeed = 60, dw_scrollObj.isSupported = function () {
    return document.getElementById && document.getElementsByTagName && document.addEventListener || document.attachEvent ? !0 : !1
}, dw_scrollObj.col = {}, dw_scrollObj.prototype.on_load = function () {
}, dw_scrollObj.prototype.on_scroll = function (a, b, c) {
}, dw_scrollObj.prototype.on_scroll_start = function () {
}, dw_scrollObj.prototype.on_scroll_stop = function (a, b) {
}, dw_scrollObj.prototype.on_scroll_end = function (a, b) {
}, dw_scrollObj.prototype.on_update = function () {
}, dw_scrollObj.prototype.on_glidescroll = function () {
}, dw_scrollObj.prototype.on_glidescroll_start = function () {
}, dw_scrollObj.prototype.on_glidescroll_stop = function () {
}, dw_scrollObj.prototype.on_glidescroll_end = function () {
}, dw_scrollObj.prototype.load = function (a, b) {
    var c, d;
    this.lyrId && (d = document.getElementById(this.lyrId), d.style.visibility = "hidden"), dw_scrollObj.scrdy && (this.lyr = d = document.getElementById(a), dw_scrollObj.printEnabled || (this.lyr.style.position = "absolute"), this.lyrId = a, this.horizId = b || null, c = document.getElementById(this.id), this.x = this.y = 0, this.shiftTo(0, 0), this.getDims(c, d), d.style.visibility = "visible", this.ready = !0, this.on_load())
}, dw_scrollObj.prototype.shiftTo = function (a, b) {
    this.lyr && !isNaN(a) && !isNaN(b) && (this.x = a, this.y = b, this.lyr.style.left = Math.round(a) + "px", this.lyr.style.top = Math.round(b) + "px")
}, dw_scrollObj.prototype.getX = function () {
    return this.x
}, dw_scrollObj.prototype.getY = function () {
    return this.y
}, dw_scrollObj.prototype.getDims = function (a, b) {
    this.wd = this.horizId ? document.getElementById(this.horizId).offsetWidth : b.offsetWidth;
    var c = this.wd - a.offsetWidth, d = b.offsetHeight - a.offsetHeight;
    this.maxX = c > 0 ? c : 0, this.maxY = d > 0 ? d : 0
}, dw_scrollObj.prototype.updateDims = function () {
    var a = document.getElementById(this.id), b = document.getElementById(this.lyrId);
    this.getDims(a, b), this.on_update()
}, dw_scrollObj.prototype.initScrollVals = function (a, b) {
    var c = this;
    this.ready && (this.timerId && (clearInterval(this.timerId), this.timerId = 0), this.speed = b || dw_scrollObj.defaultSpeed, this.fx = a == 0 ? -1 : a == 180 ? 1 : 0, this.fy = a == 90 ? 1 : a == 270 ? -1 : 0, this.endX = a == 90 || a == 270 ? this.x : a == 0 ? -this.maxX : 0, this.endY = a == 0 || a == 180 ? this.y : a == 90 ? 0 : -this.maxY, this.lyr = document.getElementById(this.lyrId), this.lastTime = (new Date).getTime(), this.on_scroll_start(this.x, this.y), this.timerId = setInterval(function () {
        c.animString.scroll()
    }, 10))
}, dw_scrollObj.prototype.scroll = function () {
    var a = (new Date).getTime(), b = (a - this.lastTime) / 1e3 * this.speed;
    if (b > 0) {
        var c = this.x + this.fx * b, b = this.y + this.fy * b;
        this.fx == -1 && c > -this.maxX || this.fx == 1 && c < 0 || this.fy == -1 && b > -this.maxY || this.fy == 1 && b < 0 ? (this.lastTime = a, this.shiftTo(c, b), this.on_scroll(c, b)) : (clearInterval(this.timerId), this.timerId = 0, this.shiftTo(this.endX, this.endY), this.on_scroll(this.endX, this.endY), this.on_scroll_end(this.endX, this.endY))
    }
}, dw_scrollObj.prototype.ceaseScroll = function () {
    this.ready && (this.timerId && (clearInterval(this.timerId), this.timerId = 0), this.on_scroll_stop(this.x, this.y))
}, dw_scrollObj.prototype.initScrollByVals = function (a, b, c) {
    this.ready && !this.sliding && (this.startX = this.x, this.startY = this.y, this.destX = this.destY = this.distX = this.distY = 0, b < 0 ? this.distY = this.startY + b >= -this.maxY ? b : -(this.startY + this.maxY) : b > 0 && (this.distY = this.startY + b <= 0 ? b : -this.startY), a < 0 ? this.distX = this.startX + a >= -this.maxX ? a : -(this.startX + this.maxX) : a > 0 && (this.distX = this.startX + a <= 0 ? a : -this.startX), this.destX = this.startX + this.distX, this.destY = this.startY + this.distY, this.glideScrollPrep(this.destX, this.destY, c))
}, dw_scrollObj.prototype.initScrollToVals = function (a, b, c) {
    this.ready && !this.sliding && (this.startX = this.x, this.startY = this.y, this.destX = -Math.max(Math.min(a, this.maxX), 0), this.destY = -Math.max(Math.min(b, this.maxY), 0), this.distY = this.destY - this.startY, this.distX = this.destX - this.startX, this.glideScrollPrep(this.destX, this.destY, c))
}, dw_scrollObj.prototype.glideScrollPrep = function (a, b, c) {
    var d = this;
    this.slideDur = typeof c == "number" ? c : dw_scrollObj.defaultSlideDur, this.per = Math.PI / (2 * this.slideDur), this.sliding = !0, this.lyr = document.getElementById(this.lyrId), this.startTime = (new Date).getTime(), this.timerId = setInterval(function () {
        d.animString.doGlideScroll()
    }, 10), this.on_glidescroll_start(this.startX, this.startY)
}, dw_scrollObj.prototype.doGlideScroll = function () {
    var a = (new Date).getTime() - this.startTime;
    if (a < this.slideDur) {
        var b = this.startX + this.distX * Math.sin(this.per * a), a = this.startY + this.distY * Math.sin(this.per * a);
        this.shiftTo(b, a), this.on_glidescroll(b, a)
    } else(clearInterval(this.timerId), this.timerId = 0, this.sliding = !1, this.shiftTo(this.destX, this.destY), this.on_glidescroll(this.destX, this.destY), this.on_glidescroll_stop(this.destX, this.destY), this.distX && (this.destX == 0 || this.destX == -this.maxX) || this.distY && (this.destY == 0 || this.destY == -this.maxY)) && this.on_glidescroll_end(this.destX, this.destY)
}, dw_scrollObj.handleMouseWheel = function (a, b, c) {
    b = dw_scrollObj.col[b];
    if (b.maxY > 0 || b.maxX > 0) {
        var d = b.x, e = b.y, f;
        b.maxY > 0 ? (c *= dw_scrollObj.mousewheelSpeed, f = c + e, c = d, f = f >= 0 ? 0 : f >= -b.maxY ? f : -b.maxY) : (c *= dw_scrollObj.mousewheelHorizSpeed, c += d, f = e, c = c >= 0 ? 0 : c >= -b.maxX ? c : -b.maxX), b.on_scroll_start(d, e), b.shiftTo(c, f), b.on_scroll(c, f), a.preventDefault && a.preventDefault();
    }
}, dw_scrollObj.doOnMouseWheel = function (a) {
    var b = 0;
    a || (a = window.event), a.wheelDelta ? b = a.wheelDelta / 120 : a.detail && (b = -a.detail / 3), b && dw_scrollObj.handleMouseWheel(a, this.id, b)
}, dw_scrollObj.GeckoTableBugFix = function () {
}, dw_scrollObj.scrdy = !0, dw_Slidebar.col = {}, dw_Slidebar.current = null, dw_Slidebar.prototype.slideDur = 500, dw_Slidebar.prepSlide = function (a, b) {
    var c = dw_Slidebar.col[b];
    dw_Slidebar.current = c;
    var d = c.bar = document.getElementById(b);
    c.timer && (clearInterval(c.timer), c.timer = 0), a = a ? a : window.event, a.offX = typeof a.layerX != "undefined" ? a.layerX : a.offsetX, a.offY = typeof a.layerY != "undefined" ? a.layerY : a.offsetY, c.startX = parseInt(d.style.left), c.startY = parseInt(d.style.top), c.axis == "v" ? (c.destX = c.startX, c.destY = a.offY < c.startY ? a.offY : a.offY - d.offsetHeight, c.destY = Math.min(Math.max(c.destY, c.minY), c.maxY)) : (c.destX = a.offX < c.startX ? a.offX : a.offX - d.offsetWidth, c.destX = Math.min(Math.max(c.destX, c.minX), c.maxX), c.destY = c.startY), c.distX = c.destX - c.startX, c.distY = c.destY - c.startY, c.per = Math.PI / (2 * c.slideDur), c.slideStartTime = (new Date).getTime(), c.on_slide_start(c.startX, c.startY), c.timer = setInterval(dw_Slidebar.doSlide, 10)
}, dw_Slidebar.doSlide = function () {
    var a = dw_Slidebar.current, b = (new Date).getTime() - a.slideStartTime;
    if (b < a.slideDur) {
        var c = a.startX + a.distX * Math.sin(a.per * b), b = a.startY + a.distY * Math.sin(a.per * b);
        a.shiftTo(c, b), a.on_slide(c, b)
    } else clearInterval(a.timer), a.shiftTo(a.destX, a.destY), a.on_slide(a.destX, a.destY), a.on_slide_end(a.destX, a.destY), dw_Slidebar.current = null
}, dw_Slidebar.prepDrag = function (a, b) {
    var c = document.getElementById(b), d = dw_Slidebar.col[b];
    dw_Slidebar.current = d, d.bar = c, d.timer && (clearInterval(d.timer), d.timer = 0), a = dw_Event.DOMit(a), d.downX = a.clientX, d.downY = a.clientY, d.startX = parseInt(c.style.left), d.startY = parseInt(c.style.top), d.on_drag_start(d.startX, d.startY), dw_Event.add(document, "mousemove", dw_Slidebar.doDrag, !0), dw_Event.add(document, "mouseup", dw_Slidebar.endDrag, !0), a.preventDefault(), a.stopPropagation()
}, dw_Slidebar.doDrag = function (a) {
    if (dw_Slidebar.current) {
        var b = dw_Slidebar.current, a = dw_Event.DOMit(a), c = b.startX + a.clientX - b.downX, d = b.startY + a.clientY - b.downY, c = Math.min(Math.max(b.minX, c), b.maxX), d = Math.min(Math.max(b.minY, d), b.maxY);
        b.shiftTo(c, d), b.on_drag(c, d), a.preventDefault(), a.stopPropagation()
    }
}, dw_Slidebar.endDrag = function () {
    if (dw_Slidebar.current) {
        var a = dw_Slidebar.current, b = a.bar;
        dw_Event.remove(document, "mousemove", dw_Slidebar.doDrag, !0), dw_Event.remove(document, "mouseup", dw_Slidebar.endDrag, !0), a.on_drag_end(parseInt(b.style.left), parseInt(b.style.top)), dw_Slidebar.current = null
    }
}, dw_Slidebar.prototype.shiftTo = function (a, b) {
    this.bar && !isNaN(a) && !isNaN(b) && (this.bar.style.left = Math.round(a) + "px", this.bar.style.top = Math.round(b) + "px")
}, dw_scrollObj.prototype.setUpScrollbar = function (a, b, c, d, e, f) {
    b = new dw_Slidebar(a, b, c, d, e), c == "v" ? this.vBarId = a : this.hBarId = a, b.wndoId = this.id, b.bSizeDragBar = f == 0 ? !1 : !0, b.bSizeDragBar && dw_Scrollbar_Co.setBarSize(this, b), dw_Scrollbar_Co.setEvents(this, b)
}, dw_Scrollbar_Co = {setBarSize: function (a, b) {
    var c, d = document.getElementById(a.lyrId), e = document.getElementById(a.id), f = document.getElementById(b.trackId);
    b.axis == "v" ? (c = document.getElementById(a.vBarId), f = f.offsetHeight, e = d.offsetHeight > e.offsetHeight ? f / (d.offsetHeight / e.offsetHeight) : f - 2 * b.minY, c.style.height = (!isNaN(e) && e > 0 ? Math.round(e) : 0) + "px", b.maxY = f - c.offsetHeight - b.minY) : b.axis == "h" && (c = document.getElementById(a.hBarId), d = f.offsetWidth, e = a.wd > e.offsetWidth ? d / (a.wd / e.offsetWidth) : d - 2 * b.minX, c.style.width = (!isNaN(e) && e > 0 ? Math.round(e) : 0) + "px", b.maxX = d - c.offsetWidth - b.minX)
}, resetBars: function (a) {
    var b, c;
    a.vBarId && (b = dw_Slidebar.col[a.vBarId], c = document.getElementById(a.vBarId), c.style.left = b.minX + "px", c.style.top = b.minY + "px", b.bSizeDragBar && dw_Scrollbar_Co.setBarSize(a, b)), a.hBarId && (b = dw_Slidebar.col[a.hBarId], c = document.getElementById(a.hBarId), c.style.left = b.minX + "px", c.style.top = b.minY + "px", b.bSizeDragBar && dw_Scrollbar_Co.setBarSize(a, b))
},

    setEvents: function (a, b) {
        this.addEvent(a, "on_load", function () {
            dw_Scrollbar_Co.resetBars(a)
        }), this.addEvent(a, "on_scroll_start", function () {
            dw_Scrollbar_Co.getBarRefs(a)
        }), this.addEvent(a, "on_glidescroll_start", function () {
            dw_Scrollbar_Co.getBarRefs(a)
        }), this.addEvent(a, "on_scroll", function (b, c) {
            dw_Scrollbar_Co.updateScrollbar(a, b, c);
        }), this.addEvent(a, "on_glidescroll", function (b, c) {
            dw_Scrollbar_Co.updateScrollbar(a, b, c)
        }), this.addEvent(a, "on_scroll_stop", function (b, c) {
            dw_Scrollbar_Co.updateScrollbar(a, b, c);
        }), this.addEvent(a, "on_glidescroll_stop", function (b, c) {
            dw_Scrollbar_Co.updateScrollbar(a, b, c)
        }), this.addEvent(a, "on_scroll_end", function (b, c) {
            dw_Scrollbar_Co.updateScrollbar(a, b, c);
        }), this.addEvent(a, "on_glidescroll_end", function (b, c) {
            dw_Scrollbar_Co.updateScrollbar(a, b, c)
        }), this.addEvent(a, "on_update", function () {
            dw_Scrollbar_Co.getBarRefs(a), dw_Scrollbar_Co.updateScrollValues(a)
        }), this.addEvent(b, "on_slide_start", function () {
            dw_Scrollbar_Co.getWndoLyrRef(b)
        }), this.addEvent(b, "on_drag_start", function () {
            dw_Scrollbar_Co.getWndoLyrRef(b)
        }), this.addEvent(b, "on_slide", function (a, c) {
            dw_Scrollbar_Co.updateScrollPosition(b, a, c)
        }), this.addEvent(b, "on_drag", function (a, c) {
            dw_Scrollbar_Co.updateScrollPosition(b, a, c)
        }), this.addEvent(b, "on_slide_end", function (a, c) {
            dw_Scrollbar_Co.updateScrollPosition(b, a, c)
        }), this.addEvent(b, "on_drag_end", function (a, c) {
            dw_Scrollbar_Co.updateScrollPosition(b, a, c)
        })
    },
    addEvent: function (a, b, c) {
        var d = a[b];
        a[b] = typeof d != "function" ? function (a, b) {
            c(a, b)
        } : function (a, b) {
            d(a, b), c(a, b)
        }
    },
    updateScrollbar: function (a, b, c) {
        var d;
        if (a.vBar && a.maxY) {
            var e = a.vBar;
            d = -(c * ((e.maxY - e.minY) / a.maxY) - e.minY), d = Math.min(Math.max(d, e.minY), e.maxY), e.bar && (c = parseInt(e.bar.style.left), e.shiftTo(c, d))
        }
        a.hBar && a.maxX && (e = a.hBar, c = -(b * ((e.maxX - e.minX) / a.maxX) - e.minX), c = Math.min(Math.max(c, e.minX), e.maxX), e.bar && (d = parseInt(e.bar.style.top), e.shiftTo(c, d)))
    },
    updateScrollPosition: function (a, b, c) {
        var d = a.wndo;
        a.axis == "v" ? (b = d.x, c = -(c - a.minY) * (d.maxY / (a.maxY - a.minY))) : (c = d.y, b = -(b - a.minX) * (d.maxX / (a.maxX - a.minX))), d.shiftTo(b, c)
    },
    updateScrollValues: function (a) {
        var b = a.getX(), c = a.getY();
        b < -a.maxX && (b = -a.maxX), c < -a.maxY && (c = -a.maxY), a.shiftTo(b, c), this.resetBars(a), this.updateScrollbar(a, b, c)
    },
    getBarRefs: function (a) {
        a.vBarId && !a.vBar && (a.vBar = dw_Slidebar.col[a.vBarId], a.vBar.bar = document.getElementById(a.vBarId)), a.hBarId && !a.hBar && (a.hBar = dw_Slidebar.col[a.hBarId], a.hBar.bar = document.getElementById(a.hBarId))
    },
    getWndoLyrRef: function (a) {
        var b;
        !a.wndo && (b = a.wndo = dw_scrollObj.col[a.wndoId], a = b) && !a.lyr && (a.lyr = document.getElementById(a.lyrId))
    }
}
;
var dw_Util;
dw_Util || (dw_Util = {}), dw_writeStyleSheet = dw_Util.writeStyleSheet, dw_addLinkCSS = dw_Util.addLinkCSS, dw_Util.contained = function (a, b) {
    if (!a)return null;
    for (; a = a.parentNode;)if (a == b)return!0;
    return!1
}, dw_Util.getLayerOffsets = function (a, b) {
    var c = 0, d = 0;
    if (dw_Util.contained(a, b))do c += a.offsetLeft, d += a.offsetTop; while ((a = a.offsetParent) != b);
    return{x: c, y: d}
}, dw_Util.get_DelimitedClassList = function (a) {
    var b = [], c = 0;
    if (a.indexOf("_") != -1) {
        var d = /\s+/;
        if (d.test(a)) {
            a = a.split(d);
            for (d = 0; a[d]; d++)a[d].indexOf("_") != -1 && (b[c++] = a[d])
        } else b[0] = a
    }
    return b
}, dw_Util.inArray = function (a, b) {
    for (var c = 0; b[c]; c++)if (b[c] == a)return!0;
    return!1
}, dw_scrollObj.prototype.setUpLoadLinks = function (a) {
    var b = document.getElementById(a);
    if (b) {
        var a = this.id, b = b.getElementsByTagName("a"), c, d, e, f, g, h;
        e = "load_" + a + "_";
        for (var i = 0; b[i]; i++) {
            c = dw_Util.get_DelimitedClassList(b[i].className), g = h = "";
            for (var j = 0; d = c[j]; j++)if (f = d.indexOf(e), f != -1) {
                c = d.slice(e.length), document.getElementById(c) ? (g = c, h = null) : c.indexOf("_") != -1 && (c = c.split("_"), document.getElementById(c[0]) && (g = c[0], h = c[1]));
                break
            }
            g && dw_Event.add(b[i], "click", function (a, b, c) {
                return function (d) {
                    return dw_scrollObj.col[a].load(b, c), d && d.preventDefault && d.preventDefault(), !1
                }
            }(a, g, h))
        }
    }
}, dw_scrollObj.prototype.setUpScrollControls = function (a, b, c) {
    var d = document.getElementById(a);
    if (d) {
        var e = this.id;
        if (b && c == "v" || c == "h")dw_scrollObj.handleControlVis(a, e, c), dw_Scrollbar_Co.addEvent(this, "on_load", function () {
            dw_scrollObj.handleControlVis(a, e, c)
        }), dw_Scrollbar_Co.addEvent(this, "on_update", function () {
            dw_scrollObj.handleControlVis(a, e, c)
        });
        for (var b = d.getElementsByTagName("a"), f, g, h = "mouseover,mousedown,scrollToId,scrollTo,scrollBy,click".split(","), i = 0; b[i]; i++)for (var d = dw_Util.get_DelimitedClassList(b[i].className), j = 0; f = d[j]; j++)if (g = f.slice(0, f.indexOf("_")), dw_Util.inArray(g, h)) {
            switch (g) {
                case"mouseover":
                case"mousedown":
                    dw_scrollObj.handleMouseOverDownLinks(b[i], e, f);
                    break;
                case"scrollToId":
                    dw_scrollObj.handleScrollToId(b[i], e, f);
                    break;
                case"scrollTo":
                case"scrollBy":
                case"click":
                    dw_scrollObj.handleClick(b[i], e, f)
            }
            break
        }
    }
}, dw_scrollObj.handleMouseOverDownLinks = function (a, b, c) {
    var d = c.split("_"), e = d[0];
    if (/^(mouseover|mousedown)_(up|down|left|right)(_[\d]+)?$/.test(c)) {
        var c = d[1], f = d[2] || null, g = c == "up" ? 90 : c == "down" ? 270 : c == "left" ? 180 : 0;
        e == "mouseover" ? (dw_Event.add(a, "mouseover", function () {
            dw_scrollObj.col[b].initScrollVals(g, f)
        }), dw_Event.add(a, "mouseout", function () {
            dw_scrollObj.col[b].ceaseScroll()
        }), dw_Event.add(a, "mousedown", function () {
            dw_scrollObj.col[b].speed *= 3
        }), dw_Event.add(a, "mouseup", function () {
            dw_scrollObj.col[b].speed = dw_scrollObj.prototype.speed
        })) : (dw_Event.add(a, "mousedown", function (a) {
            dw_scrollObj.col[b].initScrollVals(g, f), a = dw_Event.DOMit(a), a.preventDefault()
        }), dw_Event.add(a, "dragstart", function (a) {
            a = dw_Event.DOMit(a), a.preventDefault()
        }), dw_Event.add(a, "mouseup", function () {
            dw_scrollObj.col[b].ceaseScroll()
        }), dw_Event.add(a, "mouseout", function () {
            dw_scrollObj.col[b].ceaseScroll()
        })), dw_Event.add(a, "click", function (a) {
            return a && a.preventDefault && a.preventDefault(), !1
        })
    }
}, dw_scrollObj.handleScrollToId = function (a, b, c) {
    var d, e, f;
    d = c.slice(11), document.getElementById(d) || (c = c.split("_"), d = c[1], c[2] && (isNaN(parseInt(c[2])) ? (e = c[2], f = c[3] && !isNaN(parseInt(c[3])) ? parseInt(c[3]) : null) : f = parseInt(c[2]))), dw_Event.add(a, "click", function (a) {
        return dw_scrollObj.scrollToId(b, d, e, f), a && a.preventDefault && a.preventDefault(), !1
    })
}, dw_scrollObj.scrollToId = function (a, b, c, d) {
    var e = dw_scrollObj.col[a], a = document.getElementById(a), f = document.getElementById(b);
    f && dw_Util.contained(f, a) && (c && (b = document.getElementById(c)) && dw_Util.contained(b, a) && e.lyrId != c && e.load(c), b = document.getElementById(e.lyrId), c = dw_Util.getLayerOffsets(f, b), e.initScrollToVals(c.x, c.y, d))
}, dw_scrollObj.handleClick = function (a, b, c) {
    var d = c.split("_"), e = /^([\d]+)$/, f, g, h, i;
    switch (d[0]) {
        case"scrollTo":
            f = "scrollTo", c = /^(null|end|[\d]+)$/, g = c.test(d[1]) ? d[1] : "", h = c.test(d[2]) ? d[2] : "", i = d[3] && e.test(d[3]) ? d[3] : null;
            break;
        case"scrollBy":
            f = "scrollBy", c = /^(([m]?[\d]+)|null)$/, g = c.test(d[1]) ? d[1] : "", h = c.test(d[2]) ? d[2] : "", isNaN(parseInt(g)) ? typeof g == "string" && (g = g.indexOf("m") != -1 ? g.replace("m", "") : g) : g = -parseInt(g), isNaN(parseInt(h)) ? typeof h == "string" && (h = h.indexOf("m") != -1 ? h.replace("m", "") : h) : h = -parseInt(h), i = d[3] && e.test(d[3]) ? d[3] : null;
            break;
        case"click":
            d = dw_scrollObj.getClickParts(c), f = d.fn, g = d.x, h = d.y, i = d.dur
    }
    g !== "" && h !== "" && (i = isNaN(parseInt(i)) ? null : parseInt(i), f == "scrollBy" ? dw_Event.add(a, "click", function (a) {
        return dw_scrollObj.scrollBy(b, g, h, i), a && a.preventDefault && a.preventDefault(), !1
    }) : f == "scrollTo" && dw_Event.add(a, "click", function (a) {
        return dw_scrollObj.scrollTo(b, g, h, i), a && a.preventDefault && a.preventDefault(), !1
    }))
}, dw_scrollObj.scrollBy = function (a, b, c, d) {
    dw_scrollObj.col[a] && (a = dw_scrollObj.col[a], b = b === null ? -a.x : parseInt(b), c = c === null ? -a.y : parseInt(c), a.initScrollByVals(b, c, d))
}, dw_scrollObj.scrollTo = function (a, b, c, d) {
    dw_scrollObj.col[a] && (a = dw_scrollObj.col[a], b = b === "end" ? a.maxX : b, c = c === "end" ? a.maxY : c, b = b === null ? -a.x : parseInt(b), c = c === null ? -a.y : parseInt(c), a.initScrollToVals(b, c, d))
}, dw_scrollObj.getClickParts = function (a) {
    var a = a.split("_"), b = /^(up|down|left|right)$/, c, d = "", e, f, g = "", h = "";
    if (a.length >= 4)switch (c = (e = a[1].match(b)) ? e[1] : null, b = /^(to|by)$/, (e = a[2].match(b)) && (d = e[0] == "to" ? "scrollTo" : "scrollBy"), f = a[3], b = /^([\d]+)$/, e = a[4] && b.test(a[4]) ? a[4] : null, d) {
        case"scrollBy":
            if (!b.test(f)) {
                h = g = "";
                break
            }
            switch (c) {
                case"up":
                    g = 0, h = f;
                    break;
                case"down":
                    g = 0, h = -f;
                    break;
                case"left":
                    g = f, h = 0;
                    break;
                case"right":
                    g = -f, h = 0
            }
            break;
        case"scrollTo":
            b = /^(end|[\d]+)$/;
            if (!b.test(f)) {
                h = g = "";
                break
            }
            switch (c) {
                case"up":
                    g = null, h = f;
                    break;
                case"down":
                    g = null, h = f == "end" ? f : -f;
                    break;
                case"left":
                    g = f, h = null;
                    break;
                case"right":
                    g = f == "end" ? f : -f, h = null
            }
    }
    return{fn: d, x: g, y: h, dur: e}
}, dw_scrollObj.handleControlVis = function (a, b, c) {
    b = dw_scrollObj.col[b], document.getElementById(a).style.visibility = c == "v" && b.maxY > 0 || c == "h" && b.maxX > 0 ? "visible" : "hidden"
}