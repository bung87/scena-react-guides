/*
Copyright (c) 2019 Daybrush
name: @scena/react-guides
license: MIT
author: Daybrush
repository: https://github.com/daybrush/guides/blob/master/packages/react-guides
version: 0.9.0
*/
import { createElement, PureComponent } from 'react';
import Ruler from '@scena/react-ruler';
import { prefixNames, prefixCSS, ref, refs } from 'framework-utils';
import Dragger from '@daybrush/drag';
import styled from 'react-css-styled';
import { addClass, removeClass, hasClass } from '@daybrush/utils';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

function prefix() {
  var classNames = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    classNames[_i] = arguments[_i];
  }

  return prefixNames.apply(void 0, ["scena-"].concat(classNames));
}

var RULER = prefix("ruler");
var ADDER = prefix("guide", "adder");
var GUIDES = prefix("guides");
var GUIDE = prefix("guide");
var DRAGGING = prefix("dragging");
var DISPLAY_DRAG = prefix("display-drag");
var GUIDES_CSS = prefixCSS("scena-", "\n{\n    position: relative;\n}\ncanvas {\n    position: relative;\n}\n.guides {\n    position: absolute;\n    top: 0;\n    left: 0;\n    will-change: transform;\n    z-index: 2000;\n}\n.display-drag {\n    position: absolute;\n    will-change: transform;\n    z-index: 2000;\n    font-weight: bold;\n    font-size: 12px;\n    display: none;\n    left: 20px;\n    top: -20px;\n    color: #f33;\n}\n:host.horizontal .guides {\n    width: 100%;\n    height: 0;\n    top: 30px;\n}\n:host.vertical .guides {\n    height: 100%;\n    width: 0;\n    left: 30px;\n}\n.guide {\n    position: absolute;\n    background: #f33;\n    z-index: 2;\n}\n.guide.dragging:before {\n    position: absolute;\n    content: \"\";\n    width: 100%;\n    height: 100%;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n:host.horizontal .guide {\n    width: 100%;\n    height: 1px;\n    cursor: row-resize;\n}\n:host.vertical .guide {\n    width: 1px;\n    height: 100%;\n    cursor: col-resize;\n}\n.mobile :host.horizontal .guide {\n    transform: scale(1, 2);\n}\n.mobile :host.vertical .guide {\n    transform: scale(2, 1);\n}\n:host.horizontal .guide:before {\n    height: 20px;\n}\n:host.vertical .guide:before {\n    width: 20px;\n}\n.adder {\n    display: none;\n}\n.adder.dragging {\n    display: block;\n}\n");

var GuidesElement = styled("div", GUIDES_CSS);

var Guides =
/*#__PURE__*/
function (_super) {
  __extends(Guides, _super);

  function Guides() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.state = {
      guides: []
    };
    _this.scrollPos = 0;
    _this.guideElements = [];

    _this.onDragStart = function (e) {
      var datas = e.datas,
          clientX = e.clientX,
          clientY = e.clientY,
          inputEvent = e.inputEvent;
      var _a = _this.props,
          type = _a.type,
          onDragStart = _a.onDragStart;
      var isHorizontal = type === "horizontal";

      var rect = _this.guidesElement.getBoundingClientRect();

      datas.rect = rect;
      datas.offset = isHorizontal ? rect.top : rect.left;
      addClass(datas.target, DRAGGING);

      _this.onDrag({
        datas: datas,
        clientX: clientX,
        clientY: clientY
      });
      /**
       * When the drag starts, the dragStart event is called.
       * @event dragStart
       * @param {OnDragStart} - Parameters for the dragStart event
       */


      onDragStart(__assign({}, e, {
        dragElement: datas.target
      }));
      inputEvent.stopPropagation();
      inputEvent.preventDefault();
    };

    _this.onDrag = function (e) {
      var nextPos = _this.movePos(e);
      /**
       * When dragging, the drag event is called.
       * @event drag
       * @param {OnDrag} - Parameters for the drag event
       */


      _this.props.onDrag(__assign({}, e, {
        dragElement: e.datas.target
      }));

      return nextPos;
    };

    _this.onDragEnd = function (e) {
      var datas = e.datas,
          clientX = e.clientX,
          clientY = e.clientY,
          isDouble = e.isDouble,
          distX = e.distX,
          distY = e.distY;

      var pos = _this.movePos({
        datas: datas,
        clientX: clientX,
        clientY: clientY
      });

      var guides = _this.state.guides;
      var _a = _this.props,
          setGuides = _a.setGuides,
          onChangeGuides = _a.onChangeGuides,
          zoom = _a.zoom,
          displayDragPos = _a.displayDragPos;
      var guidePos = Math.round(pos / zoom);

      if (displayDragPos) {
        _this.displayElement.style.cssText += "display: none;";
      }

      removeClass(datas.target, DRAGGING);
      /**
       * When the drag finishes, the dragEnd event is called.
       * @event dragEnd
       * @param {OnDragEnd} - Parameters for the dragEnd event
       */

      _this.props.onDragEnd(__assign({}, e, {
        dragElement: datas.target
      }));
      /**
      * The `changeGuides` event occurs when the guideline is added / removed / changed.
      * @memberof Guides
      * @event changeGuides
      * @param {OnChangeGuides} - Parameters for the changeGuides event
      */


      if (datas.fromRuler) {
        if (pos >= _this.scrollPos && guides.indexOf(guidePos) < 0) {
          _this.setState({
            guides: guides.concat([guidePos])
          }, function () {
            onChangeGuides({
              guides: _this.state.guides,
              distX: distX,
              distY: distY
            });
            setGuides(_this.state.guides);
          });
        }
      } else {
        var index = datas.target.getAttribute("data-index");

        if (isDouble || pos < _this.scrollPos) {
          guides.splice(index, 1);
        } else if (guides.indexOf(guidePos) > -1) {
          return;
        } else {
          guides[index] = guidePos;
        }

        _this.setState({
          guides: guides.slice()
        }, function () {
          var nextGuides = _this.state.guides;
          setGuides(nextGuides);
          onChangeGuides({
            distX: distX,
            distY: distY,
            guides: nextGuides
          });
        });
      }
    };

    return _this;
  }

  var __proto = Guides.prototype;

  __proto.render = function () {
    var _a = this.props,
        className = _a.className,
        type = _a.type,
        width = _a.width,
        height = _a.height,
        unit = _a.unit,
        zoom = _a.zoom,
        style = _a.style,
        rulerStyle = _a.rulerStyle,
        backgroundColor = _a.backgroundColor,
        lineColor = _a.lineColor,
        textColor = _a.textColor,
        direction = _a.direction,
        displayDragPos = _a.displayDragPos,
        cspNonce = _a.cspNonce;
    return createElement(GuidesElement, {
      ref: ref(this, "manager"),
      cspNonce: cspNonce,
      className: prefix("manager", type) + " " + className,
      style: style
    }, createElement(Ruler, {
      ref: ref(this, "ruler"),
      type: type,
      width: width,
      height: height,
      unit: unit,
      zoom: zoom,
      backgroundColor: backgroundColor,
      lineColor: lineColor,
      style: rulerStyle,
      textColor: textColor,
      direction: direction
    }), createElement("div", {
      className: GUIDES,
      ref: ref(this, "guidesElement")
    }, displayDragPos && createElement("div", {
      className: DISPLAY_DRAG,
      ref: ref(this, "displayElement")
    }), createElement("div", {
      className: ADDER,
      ref: ref(this, "adderElement")
    }), this.renderGuides()));
  };

  __proto.renderGuides = function () {
    var _this = this;

    var _a = this.props,
        type = _a.type,
        zoom = _a.zoom,
        showGuides = _a.showGuides;
    var translateName = type === "horizontal" ? "translateY" : "translateX";
    var guides = this.state.guides;
    this.guideElements = [];

    if (showGuides) {
      return guides.map(function (pos, i) {
        return createElement("div", {
          className: prefix("guide", type),
          ref: refs(_this, "guideElements", i),
          key: i,
          "data-index": i,
          "data-pos": pos,
          style: {
            transform: translateName + "(" + pos * zoom + "px)"
          }
        });
      });
    } else {
      return createElement("div", null);
    }
  };

  __proto.componentDidMount = function () {
    var _this = this;

    this.dragger = new Dragger(this.manager.getElement(), {
      container: document.body,
      dragstart: function (e) {
        var target = e.inputEvent.target;
        var datas = e.datas;

        if (target === _this.ruler.canvasElement) {
          e.datas.fromRuler = true;
          datas.target = _this.adderElement;
        } else if (!hasClass(target, GUIDE)) {
          return false;
        } else {
          datas.target = target;
        }

        _this.onDragStart(e);
      },
      drag: this.onDrag,
      dragend: this.onDragEnd
    });
    this.setState({
      guides: this.props.defaultGuides || []
    }); // pass array of guides on mount data to create gridlines or something like that in ui 
  };

  __proto.componentWillUnmount = function () {
    this.dragger.unset();
  };

  __proto.componentDidUpdate = function (prevProps) {
    var _this = this;

    if (prevProps.defaultGuides !== this.props.defaultGuides) {
      //to dynamically update guides from code rather than dragging guidelines
      this.setState({
        guides: this.props.defaultGuides || []
      }, function () {
        _this.renderGuides();
      });
    }
  };
  /**
   * Load the current guidelines.
   * @memberof Guides
   * @instance
   */


  __proto.loadGuides = function (guides) {
    this.setState({
      guides: guides
    });
  };
  /**
   * Get current guidelines.
   * @memberof Guides
   * @instance
   */


  __proto.getGuides = function () {
    return this.state.guides;
  };
  /**
   * Scroll the positions of the guidelines opposite the ruler.
   * @memberof Guides
   * @instance
   */


  __proto.scrollGuides = function (pos) {
    var zoom = this.props.zoom;
    var guidesElement = this.guidesElement;
    this.scrollPos = pos;
    guidesElement.style.transform = this.getTranslateName() + "(" + -pos * zoom + "px)";
    var guides = this.state.guides;
    this.guideElements.forEach(function (el, i) {
      if (!el) {
        return;
      }

      el.style.display = -pos + guides[i] < 0 ? "none" : "block";
    });
  };
  /**
   * Recalculate the size of the ruler.
   * @memberof Guides
   * @instance
   */


  __proto.resize = function () {
    this.ruler.resize();
  };
  /**
   * Scroll the position of the ruler.
   * @memberof Guides
   * @instance
   */


  __proto.scroll = function (pos) {
    this.ruler.scroll(pos);
  };

  __proto.movePos = function (e) {
    var datas = e.datas,
        clientX = e.clientX,
        clientY = e.clientY;
    var _a = this.props,
        type = _a.type,
        zoom = _a.zoom,
        snaps = _a.snaps,
        snapThreshold = _a.snapThreshold,
        displayDragPos = _a.displayDragPos,
        dragPosFormat = _a.dragPosFormat;
    var isHorizontal = type === "horizontal";
    var nextPos = Math.round((isHorizontal ? clientY : clientX) - datas.offset);
    var guidePos = Math.round(nextPos / zoom);
    var guideSnaps = snaps.slice().sort(function (a, b) {
      return Math.abs(guidePos - a) - Math.abs(guidePos - b);
    });

    if (guideSnaps.length && Math.abs(guideSnaps[0] - guidePos) < snapThreshold) {
      guidePos = guideSnaps[0];
      nextPos = guidePos * zoom;
    }

    if (displayDragPos) {
      var rect = datas.rect;
      var displayPos = type === "horizontal" ? [clientX - rect.left, guidePos] : [guidePos, clientY - rect.top];
      this.displayElement.style.cssText += "display: block;transform: translate(-50%, -50%) translate(" + displayPos.map(function (v) {
        return v + "px";
      }).join(", ") + ")";
      this.displayElement.innerHTML = "" + dragPosFormat(guidePos);
    }

    datas.target.setAttribute("data-pos", guidePos);
    datas.target.style.transform = this.getTranslateName() + "(" + nextPos + "px)";
    return nextPos;
  };

  __proto.getTranslateName = function () {
    return this.props.type === "horizontal" ? "translateY" : "translateX";
  };

  Guides.defaultProps = {
    className: "",
    type: "horizontal",
    setGuides: function () {},
    zoom: 1,
    style: {
      width: "100%",
      height: "100%"
    },
    snapThreshold: 5,
    snaps: [],
    onChangeGuides: function () {},
    onDragStart: function () {},
    onDrag: function () {},
    onDragEnd: function () {},
    displayDragPos: false,
    dragPosFormat: function (v) {
      return v;
    },
    defaultGuides: [],
    showGuides: true
  };
  return Guides;
}(PureComponent);

export default Guides;
//# sourceMappingURL=guides.esm.js.map
