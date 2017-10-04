/*global logger*/
/*
    Slideshow
    ========================

    @file      : Slideshow.js
    @version   : 1.0.0
    @author    : Christopher James Hodges
    @date      : 7/13/2017
    @copyright : Mendix Technology Ltd
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "Slideshow/lib/jquery-1.11.2",
    "dojo/text!Slideshow/widget/template/Slideshow.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoAttr, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, _jQuery, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("Slideshow.widget.Slideshow", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        sliderNode: null,
        slidelistNode: null,
        
        slide1Node: null,
        img1Node: null,
        header1Node: null,
        content1Node: null,
        action1Node: null,
        
        slide2Node: null,
        img2Node: null,
        header2Node: null,
        content2Node: null,
        action2Node: null,
        
        slide3Node: null,
        img3Node: null,
        header3Node: null,
        content3Node: null,
        action3Node: null,
        
        slide4Node: null,
        img4Node: null,
        header4Node: null,
        content4Node: null,
        action4Node: null,
        
        slide5Node: null,
        img5Node: null,
        header5Node: null,
        content5Node: null,
        action5Node: null,
        

        // Parameters configured in the Modeler.
        img1: "",
        header1: "",
        content1: "",
        mf1: "",
        mf1Caption: "",
        
        img2: "",
        header2: "",
        content2: "",
        mf2: "",
        mf2Caption: "",
        
        img3: "",
        header3: "",
        content3: "",
        mf3: "",
        mf3Caption: "",
        
        img4: "",
        header4: "",
        content4: "",
        mf4: "",
        mf4Caption: "",
        
        img5: "",
        header5: "",
        content5: "",
        mf5: "",
        mf5Caption: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        _readOnly: false,
        _images: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
            this._handles = [];
            this._images =[];
            
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            
            var url = location.origin + "/";
            
            this._preloadImages([url + this.img1, url + this.img2, url + this.img3, url + this.img4, url + this.img5]);

            this._updateRendering(callback);
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._updateRendering(callback);
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
          logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
          logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
          logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {
            logger.debug(this.id + "._setupEvents");

        },
        
        _createNavigation: function(current, prev, next){
            logger.debug(this.id + "._createNavigation");
            
            var nextNode = dojoConstruct.create("a", {
                class: "next"
            });
            
            var prevNode = dojoConstruct.create("a", {
                class: "prev"
            });
            
            this.connect(nextNode, "onclick", dojoLang.hitch(this, function(e) {
                 dojoStyle.set(current, "z-index", "-1");
                 dojoStyle.set(current, "visibility", "hidden");
                
                 dojoStyle.set(next, "z-index", "100");
                 dojoStyle.set(next, "visibility", "visible");
                
                 dojoClass.remove(current, "animate");
                 dojoClass.add(next, "animate");
             }));
            
            this.connect(prevNode, "onclick", dojoLang.hitch(this, function(e) {
                 dojoStyle.set(current, "z-index", "-1");
                 dojoStyle.set(current, "visibility", "hidden");
                
                 dojoStyle.set(prev, "z-index", "100");
                 dojoStyle.set(prev, "visibility", "visible");
                
                 dojoClass.remove(current, "animate");
                 dojoClass.add(prev, "animate");
             }));
            
            dojoConstruct.place(prevNode, current);
            dojoConstruct.place(nextNode, current);
            
            
        },
        
       _preloadImages: function(array) {
           
           var i = 0;
           
           for (i = 0; i < array.length; i++) {
					var img = new Image();
					img.src = array[i];
                    this._images.push(img);
				}
        },

        // Rerender the interface.
        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");
            
            var url = location.origin + "/";
            
            dojoStyle.set(this.slide1Node, "z-index", "100");
            dojoStyle.set(this.slide1Node, "visibility", "visible");
            dojoClass.add(this.slide1Node, "animate");
            
            dojoStyle.set(this.slide2Node, "z-index", "-1");
            dojoClass.remove(this.slide2Node, "animate");
            
            dojoStyle.set(this.slide3Node, "z-index", "-1");
            dojoClass.remove(this.slide3Node, "animate");
            
            dojoStyle.set(this.slide4Node, "z-index", "-1");
            dojoClass.remove(this.slide4Node, "animate");
            
            dojoStyle.set(this.slide5Node, "z-index", "-1");
            dojoClass.remove(this.slide5Node, "animate");
            
            dojoStyle.set(this.img1Node, "background-image", 'url("'+ this._images[0].src +'")');
            dojoStyle.set(this.img2Node, "background-image", 'url("'+ this._images[1].src +'")');
            dojoStyle.set(this.img3Node, "background-image", 'url("'+ this._images[2].src +'")');
            dojoStyle.set(this.img4Node, "background-image", 'url("'+ this._images[3].src +'")');
            dojoStyle.set(this.img5Node, "background-image", 'url("'+ this._images[4].src +'")');
            
            this._createNavigation(this.slide1Node, this.slide5Node, this.slide2Node);
            this._createNavigation(this.slide2Node, this.slide1Node, this.slide3Node);
            this._createNavigation(this.slide3Node, this.slide2Node, this.slide4Node);
            this._createNavigation(this.slide4Node, this.slide3Node, this.slide5Node);
            this._createNavigation(this.slide5Node, this.slide4Node, this.slide1Node);
            
            dojoHtml.set(this.header1Node, this.header1);
            dojoHtml.set(this.header2Node, this.header2);
            dojoHtml.set(this.header3Node, this.header3);
            dojoHtml.set(this.header4Node, this.header4);
            dojoHtml.set(this.header5Node, this.header5);
            
            dojoHtml.set(this.content1Node, this.content1);
            dojoHtml.set(this.content2Node, this.content2);
            dojoHtml.set(this.content3Node, this.content3);
            dojoHtml.set(this.content4Node, this.content4);
            dojoHtml.set(this.content5Node, this.content5);
            
            dojoHtml.set(this.action1Node, this.mf1Caption);
            dojoHtml.set(this.action2Node, this.mf2Caption);
            dojoHtml.set(this.action3Node, this.mf3Caption);
            dojoHtml.set(this.action4Node, this.mf4Caption);
            dojoHtml.set(this.action5Node, this.mf5Caption);
            
             this.connect(this.action1Node, "onclick", dojoLang.hitch(this, function(e) {
                 this._execMF(null, this.mf1, callback);
             }));
            this.connect(this.action2Node, "onclick", dojoLang.hitch(this, function(e) {
                 this._execMF(null, this.mf2, callback);
             }));
            this.connect(this.action3Node, "onclick", dojoLang.hitch(this, function(e) {
                 this._execMF(null, this.mf3, callback);
             }));
            this.connect(this.action4Node, "onclick", dojoLang.hitch(this, function(e) {
                 this._execMF(null, this.mf4, callback);
             }));
            this.connect(this.action5Node, "onclick", dojoLang.hitch(this, function(e) {
                 this._execMF(null, this.mf5, callback);
             }));
            
            mendix.lang.nullExec(callback);

        },
        
        _execMF: function(obj, mf, callback) {
            logger.debug(this.id + "._execMF");
    
            var params = {
                applyto: "selection",
                actionname: mf,
                guids: []
            };
            if (obj) {
                params.guids = [obj.getGuid()];
            }
            mx.data.action({
                params: params,
                store: {
                    caller: this.mxform
                },
                callback: function(objs) {
                    if (typeof callback !== "undefined") {
                        callback(objs);
                    }
                },
                error: function(error) {
                    if (typeof callback !== "undefined") {
                        callback();
                    }
                    console.error(error.description);
                }
            }, this);
        },

        _executeCallback: function (cb) {
          if (cb && typeof cb === "function") {
            cb();
          }
        }
    });
});

require(["Slideshow/widget/Slideshow"]);
