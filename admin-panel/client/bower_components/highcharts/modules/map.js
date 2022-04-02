/*
 Highmaps JS v6.0.7 (2018-02-16)
 Highmaps as a plugin for Highcharts or Highstock.

 (c) 2011-2017 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(w){"object"===typeof module&&module.exports?module.exports=w:w(Highcharts)})(function(w){(function(a){var h=a.Axis,q=a.each,g=a.pick;a=a.wrap;a(h.prototype,"getSeriesExtremes",function(a){var e=this.isXAxis,x,t,h=[],f;e&&q(this.series,function(a,b){a.useMapGeometry&&(h[b]=a.xData,a.xData=[])});a.call(this);e&&(x=g(this.dataMin,Number.MAX_VALUE),t=g(this.dataMax,-Number.MAX_VALUE),q(this.series,function(a,b){a.useMapGeometry&&(x=Math.min(x,g(a.minX,x)),t=Math.max(t,g(a.maxX,t)),a.xData=h[b],
f=!0)}),f&&(this.dataMin=x,this.dataMax=t))});a(h.prototype,"setAxisTranslation",function(a){var l=this.chart,e=l.plotWidth/l.plotHeight,l=l.xAxis[0],g;a.call(this);"yAxis"===this.coll&&void 0!==l.transA&&q(this.series,function(a){a.preserveAspectRatio&&(g=!0)});if(g&&(this.transA=l.transA=Math.min(this.transA,l.transA),a=e/((l.max-l.min)/(this.max-this.min)),a=1>a?this:l,e=(a.max-a.min)*a.transA,a.pixelPadding=a.len-e,a.minPixelPadding=a.pixelPadding/2,e=a.fixTo)){e=e[1]-a.toValue(e[0],!0);e*=a.transA;
if(Math.abs(e)>a.minPixelPadding||a.min===a.dataMin&&a.max===a.dataMax)e=0;a.minPixelPadding-=e}});a(h.prototype,"render",function(a){a.call(this);this.fixTo=null})})(w);(function(a){var h=a.Axis,q=a.Chart,g=a.color,e,l=a.each,x=a.extend,t=a.isNumber,u=a.Legend,f=a.LegendSymbolMixin,c=a.noop,b=a.merge,n=a.pick,r=a.wrap;a.ColorAxis||(e=a.ColorAxis=function(){this.init.apply(this,arguments)},x(e.prototype,h.prototype),x(e.prototype,{defaultColorAxisOptions:{lineWidth:0,minPadding:0,maxPadding:0,gridLineWidth:1,
tickPixelInterval:72,startOnTick:!0,endOnTick:!0,offset:0,marker:{animation:{duration:50},width:.01,color:"#999999"},labels:{overflow:"justify",rotation:0},minColor:"#e6ebf5",maxColor:"#003399",tickLength:5,showInLegend:!0},keepProps:["legendGroup","legendItemHeight","legendItemWidth","legendItem","legendSymbol"].concat(h.prototype.keepProps),init:function(a,m){var d="vertical"!==a.options.legend.layout,k;this.coll="colorAxis";k=b(this.defaultColorAxisOptions,{side:d?2:1,reversed:!d},m,{opposite:!d,
showEmpty:!1,title:null,visible:a.options.legend.enabled});h.prototype.init.call(this,a,k);m.dataClasses&&this.initDataClasses(m);this.initStops();this.horiz=d;this.zoomEnabled=!1;this.defaultLegendLength=200},initDataClasses:function(a){var k=this.chart,d,p=0,v=k.options.chart.colorCount,c=this.options,f=a.dataClasses.length;this.dataClasses=d=[];this.legendItems=[];l(a.dataClasses,function(a,m){a=b(a);d.push(a);a.color||("category"===c.dataClassColor?(m=k.options.colors,v=m.length,a.color=m[p],
a.colorIndex=p,p++,p===v&&(p=0)):a.color=g(c.minColor).tweenTo(g(c.maxColor),2>f?.5:m/(f-1)))})},setTickPositions:function(){if(!this.dataClasses)return h.prototype.setTickPositions.call(this)},initStops:function(){this.stops=this.options.stops||[[0,this.options.minColor],[1,this.options.maxColor]];l(this.stops,function(a){a.color=g(a[1])})},setOptions:function(a){h.prototype.setOptions.call(this,a);this.options.crosshair=this.options.marker},setAxisSize:function(){var a=this.legendSymbol,m=this.chart,
d=m.options.legend||{},p,b;a?(this.left=d=a.attr("x"),this.top=p=a.attr("y"),this.width=b=a.attr("width"),this.height=a=a.attr("height"),this.right=m.chartWidth-d-b,this.bottom=m.chartHeight-p-a,this.len=this.horiz?b:a,this.pos=this.horiz?d:p):this.len=(this.horiz?d.symbolWidth:d.symbolHeight)||this.defaultLegendLength},normalizedValue:function(a){this.isLog&&(a=this.val2lin(a));return 1-(this.max-a)/(this.max-this.min||1)},toColor:function(a,m){var d=this.stops,p,k,b=this.dataClasses,c,f;if(b)for(f=
b.length;f--;){if(c=b[f],p=c.from,d=c.to,(void 0===p||a>=p)&&(void 0===d||a<=d)){k=c.color;m&&(m.dataClass=f,m.colorIndex=c.colorIndex);break}}else{a=this.normalizedValue(a);for(f=d.length;f--&&!(a>d[f][0]););p=d[f]||d[f+1];d=d[f+1]||p;a=1-(d[0]-a)/(d[0]-p[0]||1);k=p.color.tweenTo(d.color,a)}return k},getOffset:function(){var a=this.legendGroup,b=this.chart.axisOffset[this.side];a&&(this.axisParent=a,h.prototype.getOffset.call(this),this.added||(this.added=!0,this.labelLeft=0,this.labelRight=this.width),
this.chart.axisOffset[this.side]=b)},setLegendColor:function(){var a,b=this.reversed;a=b?1:0;b=b?0:1;a=this.horiz?[a,0,b,0]:[0,b,0,a];this.legendColor={linearGradient:{x1:a[0],y1:a[1],x2:a[2],y2:a[3]},stops:this.stops}},drawLegendSymbol:function(a,b){var d=a.padding,p=a.options,k=this.horiz,c=n(p.symbolWidth,k?this.defaultLegendLength:12),m=n(p.symbolHeight,k?12:this.defaultLegendLength),f=n(p.labelPadding,k?16:30),p=n(p.itemDistance,10);this.setLegendColor();b.legendSymbol=this.chart.renderer.rect(0,
a.baseline-11,c,m).attr({zIndex:1}).add(b.legendGroup);this.legendItemWidth=c+d+(k?p:f);this.legendItemHeight=m+d+(k?f:0)},setState:function(a){l(this.series,function(b){b.setState(a)})},visible:!0,setVisible:c,getSeriesExtremes:function(){var a=this.series,b=a.length;this.dataMin=Infinity;for(this.dataMax=-Infinity;b--;)void 0!==a[b].valueMin&&(this.dataMin=Math.min(this.dataMin,a[b].valueMin),this.dataMax=Math.max(this.dataMax,a[b].valueMax))},drawCrosshair:function(a,b){var d=b&&b.plotX,p=b&&b.plotY,
c,k=this.pos,f=this.len;b&&(c=this.toPixels(b[b.series.colorKey]),c<k?c=k-2:c>k+f&&(c=k+f+2),b.plotX=c,b.plotY=this.len-c,h.prototype.drawCrosshair.call(this,a,b),b.plotX=d,b.plotY=p,this.cross&&!this.cross.addedToColorAxis&&this.legendGroup&&(this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup),this.cross.addedToColorAxis=!0,this.cross.attr({fill:this.crosshair.color})))},getPlotLinePath:function(a,b,d,p,c){return t(c)?this.horiz?["M",c-4,this.top-6,"L",c+4,this.top-6,c,this.top,
"Z"]:["M",this.left,c,"L",this.left-6,c+6,this.left-6,c-6,"Z"]:h.prototype.getPlotLinePath.call(this,a,b,d,p)},update:function(a,c){var d=this.chart,p=d.legend;l(this.series,function(a){a.isDirtyData=!0});a.dataClasses&&p.allItems&&(l(p.allItems,function(a){a.isDataClass&&a.legendGroup&&a.legendGroup.destroy()}),d.isDirtyLegend=!0);d.options[this.coll]=b(this.userOptions,a);h.prototype.update.call(this,a,c);this.legendItem&&(this.setLegendColor(),p.colorizeItem(this,!0))},remove:function(){this.legendItem&&
this.chart.legend.destroyItem(this);h.prototype.remove.call(this)},getDataClassLegendSymbols:function(){var b=this,m=this.chart,d=this.legendItems,p=m.options.legend,v=p.valueDecimals,n=p.valueSuffix||"",r;d.length||l(this.dataClasses,function(p,k){var e=!0,y=p.from,g=p.to;r="";void 0===y?r="\x3c ":void 0===g&&(r="\x3e ");void 0!==y&&(r+=a.numberFormat(y,v)+n);void 0!==y&&void 0!==g&&(r+=" - ");void 0!==g&&(r+=a.numberFormat(g,v)+n);d.push(x({chart:m,name:r,options:{},drawLegendSymbol:f.drawRectangle,
visible:!0,setState:c,isDataClass:!0,setVisible:function(){e=this.visible=!e;l(b.series,function(a){l(a.points,function(a){a.dataClass===k&&a.setVisible(e)})});m.legend.colorizeItem(this,e)}},p))});return d},name:""}),l(["fill","stroke"],function(b){a.Fx.prototype[b+"Setter"]=function(){this.elem.attr(b,g(this.start).tweenTo(g(this.end),this.pos),null,!0)}}),r(q.prototype,"getAxes",function(a){var b=this.options.colorAxis;a.call(this);this.colorAxis=[];b&&new e(this,b)}),r(u.prototype,"getAllItems",
function(a){var b=[],d=this.chart.colorAxis[0];d&&d.options&&(d.options.showInLegend&&(d.options.dataClasses?b=b.concat(d.getDataClassLegendSymbols()):b.push(d)),l(d.series,function(a){a.options.showInLegend=!1}));return b.concat(a.call(this))}),r(u.prototype,"colorizeItem",function(a,b,d){a.call(this,b,d);d&&b.legendColor&&b.legendSymbol.attr({fill:b.legendColor})}),r(u.prototype,"update",function(a){a.apply(this,[].slice.call(arguments,1));this.chart.colorAxis[0]&&this.chart.colorAxis[0].update({},
arguments[2])}))})(w);(function(a){var h=a.defined,q=a.each,g=a.noop,e=a.seriesTypes;a.colorPointMixin={isValid:function(){return null!==this.value&&Infinity!==this.value&&-Infinity!==this.value},setVisible:function(a){var e=this,l=a?"show":"hide";q(["graphic","dataLabel"],function(a){if(e[a])e[a][l]()})},setState:function(e){a.Point.prototype.setState.call(this,e);this.graphic&&this.graphic.attr({zIndex:"hover"===e?1:0})}};a.colorSeriesMixin={pointArrayMap:["value"],axisTypes:["xAxis","yAxis","colorAxis"],
optionalAxis:"colorAxis",trackerGroups:["group","markerGroup","dataLabelsGroup"],getSymbol:g,parallelArrays:["x","y","value"],colorKey:"value",pointAttribs:e.column.prototype.pointAttribs,translateColors:function(){var a=this,e=this.options.nullColor,g=this.colorAxis,h=this.colorKey;q(this.data,function(f){var c=f[h];if(c=f.options.color||(f.isNull?e:g&&void 0!==c?g.toColor(c,f):f.color||a.color))f.color=c})},colorAttribs:function(a){var e={};h(a.color)&&(e[this.colorProp||"fill"]=a.color);return e}}})(w);
(function(a){function h(a){a&&(a.preventDefault&&a.preventDefault(),a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)}function q(a){this.init(a)}var g=a.addEvent,e=a.Chart,l=a.doc,x=a.each,t=a.extend,u=a.merge,f=a.pick,c=a.wrap;q.prototype.init=function(a){this.chart=a;a.mapNavButtons=[]};q.prototype.update=function(b){var c=this.chart,e=c.options.mapNavigation,k,m,d,p,v,l=function(a){this.handler.call(c,a);h(a)},y=c.mapNavButtons;b&&(e=c.options.mapNavigation=u(c.options.mapNavigation,b));
for(;y.length;)y.pop().destroy();f(e.enableButtons,e.enabled)&&!c.renderer.forExport&&a.objectEach(e.buttons,function(a,b){k=u(e.buttonOptions,a);m=k.theme;m.style=u(k.theme.style,k.style);p=(d=m.states)&&d.hover;v=d&&d.select;a=c.renderer.button(k.text,0,0,l,m,p,v,0,"zoomIn"===b?"topbutton":"bottombutton").addClass("highcharts-map-navigation").attr({width:k.width,height:k.height,title:c.options.lang[b],padding:k.padding,zIndex:5}).add();a.handler=k.onclick;a.align(t(k,{width:a.width,height:2*a.height}),
null,k.alignTo);g(a.element,"dblclick",h);y.push(a)});this.updateEvents(e)};q.prototype.updateEvents=function(a){var b=this.chart;f(a.enableDoubleClickZoom,a.enabled)||a.enableDoubleClickZoomTo?this.unbindDblClick=this.unbindDblClick||g(b.container,"dblclick",function(a){b.pointer.onContainerDblClick(a)}):this.unbindDblClick&&(this.unbindDblClick=this.unbindDblClick());f(a.enableMouseWheelZoom,a.enabled)?this.unbindMouseWheel=this.unbindMouseWheel||g(b.container,void 0===l.onmousewheel?"DOMMouseScroll":
"mousewheel",function(a){b.pointer.onContainerMouseWheel(a);h(a);return!1}):this.unbindMouseWheel&&(this.unbindMouseWheel=this.unbindMouseWheel())};t(e.prototype,{fitToBox:function(a,c){x([["x","width"],["y","height"]],function(b){var k=b[0];b=b[1];a[k]+a[b]>c[k]+c[b]&&(a[b]>c[b]?(a[b]=c[b],a[k]=c[k]):a[k]=c[k]+c[b]-a[b]);a[b]>c[b]&&(a[b]=c[b]);a[k]<c[k]&&(a[k]=c[k])});return a},mapZoom:function(a,c,e,k,m){var d=this.xAxis[0],b=d.max-d.min,v=f(c,d.min+b/2),l=b*a,b=this.yAxis[0],g=b.max-b.min,n=f(e,
b.min+g/2),g=g*a,v=this.fitToBox({x:v-l*(k?(k-d.pos)/d.len:.5),y:n-g*(m?(m-b.pos)/b.len:.5),width:l,height:g},{x:d.dataMin,y:b.dataMin,width:d.dataMax-d.dataMin,height:b.dataMax-b.dataMin}),l=v.x<=d.dataMin&&v.width>=d.dataMax-d.dataMin&&v.y<=b.dataMin&&v.height>=b.dataMax-b.dataMin;k&&(d.fixTo=[k-d.pos,c]);m&&(b.fixTo=[m-b.pos,e]);void 0===a||l?(d.setExtremes(void 0,void 0,!1),b.setExtremes(void 0,void 0,!1)):(d.setExtremes(v.x,v.x+v.width,!1),b.setExtremes(v.y,v.y+v.height,!1));this.redraw()}});
c(e.prototype,"render",function(a){this.mapNavigation=new q(this);this.mapNavigation.update();a.call(this)})})(w);(function(a){var h=a.extend,q=a.pick,g=a.Pointer;a=a.wrap;h(g.prototype,{onContainerDblClick:function(a){var e=this.chart;a=this.normalize(a);e.options.mapNavigation.enableDoubleClickZoomTo?e.pointer.inClass(a.target,"highcharts-tracker")&&e.hoverPoint&&e.hoverPoint.zoomTo():e.isInsidePlot(a.chartX-e.plotLeft,a.chartY-e.plotTop)&&e.mapZoom(.5,e.xAxis[0].toValue(a.chartX),e.yAxis[0].toValue(a.chartY),
a.chartX,a.chartY)},onContainerMouseWheel:function(a){var e=this.chart,g;a=this.normalize(a);g=a.detail||-(a.wheelDelta/120);e.isInsidePlot(a.chartX-e.plotLeft,a.chartY-e.plotTop)&&e.mapZoom(Math.pow(e.options.mapNavigation.mouseWheelSensitivity,g),e.xAxis[0].toValue(a.chartX),e.yAxis[0].toValue(a.chartY),a.chartX,a.chartY)}});a(g.prototype,"zoomOption",function(a){var e=this.chart.options.mapNavigation;q(e.enableTouchZoom,e.enabled)&&(this.chart.options.chart.pinchType="xy");a.apply(this,[].slice.call(arguments,
1))});a(g.prototype,"pinchTranslate",function(a,g,q,h,u,f,c){a.call(this,g,q,h,u,f,c);"map"===this.chart.options.chart.type&&this.hasZoom&&(a=h.scaleX>h.scaleY,this.pinchTranslateDirection(!a,g,q,h,u,f,c,a?h.scaleX:h.scaleY))})})(w);(function(a){var h=a.colorPointMixin,q=a.each,g=a.extend,e=a.isNumber,l=a.map,x=a.merge,t=a.noop,u=a.pick,f=a.isArray,c=a.Point,b=a.Series,n=a.seriesType,r=a.seriesTypes,k=a.splat,m=void 0!==a.doc.documentElement.style.vectorEffect;n("map","scatter",{allAreas:!0,animation:!1,
nullColor:"#f7f7f7",borderColor:"#cccccc",borderWidth:1,marker:null,stickyTracking:!1,joinBy:"hc-key",dataLabels:{formatter:function(){return this.point.value},inside:!0,verticalAlign:"middle",crop:!1,overflow:!1,padding:0},turboThreshold:0,tooltip:{followPointer:!0,pointFormat:"{point.name}: {point.value}\x3cbr/\x3e"},states:{normal:{animation:!0},hover:{halo:null,brightness:.2},select:{color:"#cccccc"}}},x(a.colorSeriesMixin,{type:"map",getExtremesFromAll:!0,useMapGeometry:!0,forceDL:!0,searchPoint:t,
directTouch:!0,preserveAspectRatio:!0,pointArrayMap:["value"],getBox:function(d){var b=Number.MAX_VALUE,c=-b,k=b,f=-b,m=b,g=b,n=this.xAxis,l=this.yAxis,r;q(d||[],function(d){if(d.path){"string"===typeof d.path&&(d.path=a.splitPath(d.path));var p=d.path||[],v=p.length,n=!1,l=-b,h=b,y=-b,q=b,A=d.properties;if(!d._foundBox){for(;v--;)e(p[v])&&(n?(l=Math.max(l,p[v]),h=Math.min(h,p[v])):(y=Math.max(y,p[v]),q=Math.min(q,p[v])),n=!n);d._midX=h+(l-h)*u(d.middleX,A&&A["hc-middle-x"],.5);d._midY=q+(y-q)*u(d.middleY,
A&&A["hc-middle-y"],.5);d._maxX=l;d._minX=h;d._maxY=y;d._minY=q;d.labelrank=u(d.labelrank,(l-h)*(y-q));d._foundBox=!0}c=Math.max(c,d._maxX);k=Math.min(k,d._minX);f=Math.max(f,d._maxY);m=Math.min(m,d._minY);g=Math.min(d._maxX-d._minX,d._maxY-d._minY,g);r=!0}});r&&(this.minY=Math.min(m,u(this.minY,b)),this.maxY=Math.max(f,u(this.maxY,-b)),this.minX=Math.min(k,u(this.minX,b)),this.maxX=Math.max(c,u(this.maxX,-b)),n&&void 0===n.options.minRange&&(n.minRange=Math.min(5*g,(this.maxX-this.minX)/5,n.minRange||
b)),l&&void 0===l.options.minRange&&(l.minRange=Math.min(5*g,(this.maxY-this.minY)/5,l.minRange||b)))},getExtremes:function(){b.prototype.getExtremes.call(this,this.valueData);this.chart.hasRendered&&this.isDirtyData&&this.getBox(this.options.data);this.valueMin=this.dataMin;this.valueMax=this.dataMax;this.dataMin=this.minY;this.dataMax=this.maxY},translatePath:function(a){var d=!1,b=this.xAxis,c=this.yAxis,k=b.min,f=b.transA,b=b.minPixelPadding,m=c.min,g=c.transA,c=c.minPixelPadding,n,l=[];if(a)for(n=
a.length;n--;)e(a[n])?(l[n]=d?(a[n]-k)*f+b:(a[n]-m)*g+c,d=!d):l[n]=a[n];return l},setData:function(d,c,m,g){var p=this.options,v=this.chart.options.chart,n=v&&v.map,h=p.mapData,r=p.joinBy,u=null===r,B=p.keys||this.pointArrayMap,t=[],w={},z=this.chart.mapTransforms;!h&&n&&(h="string"===typeof n?a.maps[n]:n);u&&(r="_i");r=this.joinBy=k(r);r[1]||(r[1]=r[0]);d&&q(d,function(a,b){var c=0;if(e(a))d[b]={value:a};else if(f(a)){d[b]={};!p.keys&&a.length>B.length&&"string"===typeof a[0]&&(d[b]["hc-key"]=a[0],
++c);for(var k=0;k<B.length;++k,++c)B[k]&&(d[b][B[k]]=a[c])}u&&(d[b]._i=b)});this.getBox(d);(this.chart.mapTransforms=z=v&&v.mapTransforms||h&&h["hc-transform"]||z)&&a.objectEach(z,function(a){a.rotation&&(a.cosAngle=Math.cos(a.rotation),a.sinAngle=Math.sin(a.rotation))});if(h){"FeatureCollection"===h.type&&(this.mapTitle=h.title,h=a.geojson(h,this.type,this));this.mapData=h;this.mapMap={};for(z=0;z<h.length;z++)v=h[z],n=v.properties,v._i=z,r[0]&&n&&n[r[0]]&&(v[r[0]]=n[r[0]]),w[v[r[0]]]=v;this.mapMap=
w;d&&r[1]&&q(d,function(a){w[a[r[1]]]&&t.push(w[a[r[1]]])});p.allAreas?(this.getBox(h),d=d||[],r[1]&&q(d,function(a){t.push(a[r[1]])}),t="|"+l(t,function(a){return a&&a[r[0]]}).join("|")+"|",q(h,function(a){r[0]&&-1!==t.indexOf("|"+a[r[0]]+"|")||(d.push(x(a,{value:null})),g=!1)})):this.getBox(t)}b.prototype.setData.call(this,d,c,m,g)},drawGraph:t,drawDataLabels:t,doFullTranslate:function(){return this.isDirtyData||this.chart.isResizing||this.chart.renderer.isVML||!this.baseTrans},translate:function(){var a=
this,b=a.xAxis,c=a.yAxis,k=a.doFullTranslate();a.generatePoints();q(a.data,function(d){d.plotX=b.toPixels(d._midX,!0);d.plotY=c.toPixels(d._midY,!0);k&&(d.shapeType="path",d.shapeArgs={d:a.translatePath(d.path)})});a.translateColors()},pointAttribs:function(a,b){a=r.column.prototype.pointAttribs.call(this,a,b);m?a["vector-effect"]="non-scaling-stroke":a["stroke-width"]="inherit";return a},drawPoints:function(){var a=this,b=a.xAxis,c=a.yAxis,k=a.group,f=a.chart,e=f.renderer,n,g,h,l,t=this.baseTrans,
u,x,z,w,G;a.transformGroup||(a.transformGroup=e.g().attr({scaleX:1,scaleY:1}).add(k),a.transformGroup.survive=!0);a.doFullTranslate()?(f.hasRendered&&q(a.points,function(b){b.shapeArgs&&(b.shapeArgs.fill=a.pointAttribs(b,b.state).fill)}),a.group=a.transformGroup,r.column.prototype.drawPoints.apply(a),a.group=k,q(a.points,function(a){a.graphic&&(a.name&&a.graphic.addClass("highcharts-name-"+a.name.replace(/ /g,"-").toLowerCase()),a.properties&&a.properties["hc-key"]&&a.graphic.addClass("highcharts-key-"+
a.properties["hc-key"].toLowerCase()))}),this.baseTrans={originX:b.min-b.minPixelPadding/b.transA,originY:c.min-c.minPixelPadding/c.transA+(c.reversed?0:c.len/c.transA),transAX:b.transA,transAY:c.transA},this.transformGroup.animate({translateX:0,translateY:0,scaleX:1,scaleY:1})):(n=b.transA/t.transAX,g=c.transA/t.transAY,h=b.toPixels(t.originX,!0),l=c.toPixels(t.originY,!0),.99<n&&1.01>n&&.99<g&&1.01>g&&(g=n=1,h=Math.round(h),l=Math.round(l)),u=this.transformGroup,f.renderer.globalAnimation?(x=u.attr("translateX"),
z=u.attr("translateY"),w=u.attr("scaleX"),G=u.attr("scaleY"),u.attr({animator:0}).animate({animator:1},{step:function(a,b){u.attr({translateX:x+(h-x)*b.pos,translateY:z+(l-z)*b.pos,scaleX:w+(n-w)*b.pos,scaleY:G+(g-G)*b.pos})}})):u.attr({translateX:h,translateY:l,scaleX:n,scaleY:g}));m||a.group.element.setAttribute("stroke-width",a.options[a.pointAttrToOptions&&a.pointAttrToOptions["stroke-width"]||"borderWidth"]/(n||1));this.drawMapDataLabels()},drawMapDataLabels:function(){b.prototype.drawDataLabels.call(this);
this.dataLabelsGroup&&this.dataLabelsGroup.clip(this.chart.clipRect)},render:function(){var a=this,c=b.prototype.render;a.chart.renderer.isVML&&3E3<a.data.length?setTimeout(function(){c.call(a)}):c.call(a)},animate:function(a){var b=this.options.animation,d=this.group,c=this.xAxis,k=this.yAxis,f=c.pos,m=k.pos;this.chart.renderer.isSVG&&(!0===b&&(b={duration:1E3}),a?d.attr({translateX:f+c.len/2,translateY:m+k.len/2,scaleX:.001,scaleY:.001}):(d.animate({translateX:f,translateY:m,scaleX:1,scaleY:1},
b),this.animate=null))},animateDrilldown:function(a){var b=this.chart.plotBox,d=this.chart.drilldownLevels[this.chart.drilldownLevels.length-1],c=d.bBox,k=this.chart.options.drilldown.animation;a||(a=Math.min(c.width/b.width,c.height/b.height),d.shapeArgs={scaleX:a,scaleY:a,translateX:c.x,translateY:c.y},q(this.points,function(a){a.graphic&&a.graphic.attr(d.shapeArgs).animate({scaleX:1,scaleY:1,translateX:0,translateY:0},k)}),this.animate=null)},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,
animateDrillupFrom:function(a){r.column.prototype.animateDrillupFrom.call(this,a)},animateDrillupTo:function(a){r.column.prototype.animateDrillupTo.call(this,a)}}),g({applyOptions:function(a,b){a=c.prototype.applyOptions.call(this,a,b);b=this.series;var d=b.joinBy;b.mapData&&((d=void 0!==a[d[1]]&&b.mapMap[a[d[1]]])?(b.xyFromShape&&(a.x=d._midX,a.y=d._midY),g(a,d)):a.value=a.value||null);return a},onMouseOver:function(a){clearTimeout(this.colorInterval);if(null!==this.value||this.series.options.nullInteraction)c.prototype.onMouseOver.call(this,
a);else this.series.onMouseOut(a)},zoomTo:function(){var a=this.series;a.xAxis.setExtremes(this._minX,this._maxX,!1);a.yAxis.setExtremes(this._minY,this._maxY,!1);a.chart.redraw()}},h))})(w);(function(a){var h=a.seriesType,q=a.seriesTypes;h("mapline","map",{lineWidth:1,fillColor:"none"},{type:"mapline",colorProp:"stroke",pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth"},pointAttribs:function(a,e){a=q.map.prototype.pointAttribs.call(this,a,e);a.fill=this.options.fillColor;return a},drawLegendSymbol:q.line.prototype.drawLegendSymbol})})(w);
(function(a){var h=a.merge,q=a.Point;a=a.seriesType;a("mappoint","scatter",{dataLabels:{enabled:!0,formatter:function(){return this.point.name},crop:!1,defer:!1,overflow:!1,style:{color:"#000000"}}},{type:"mappoint",forceDL:!0},{applyOptions:function(a,e){a=void 0!==a.lat&&void 0!==a.lon?h(a,this.series.chart.fromLatLonToPoint(a)):a;return q.prototype.applyOptions.call(this,a,e)}})})(w);(function(a){var h=a.arrayMax,q=a.arrayMin,g=a.Axis,e=a.color,l=a.each,x=a.isNumber,t=a.noop,u=a.pick,f=a.pInt,
c=a.Point,b=a.Series,n=a.seriesType,r=a.seriesTypes;n("bubble","scatter",{dataLabels:{formatter:function(){return this.point.z},inside:!0,verticalAlign:"middle"},marker:{lineColor:null,lineWidth:1,fillOpacity:.5,radius:null,states:{hover:{radiusPlus:0}},symbol:"circle"},minSize:8,maxSize:"20%",softThreshold:!1,states:{hover:{halo:{size:5}}},tooltip:{pointFormat:"({point.x}, {point.y}), Size: {point.z}"},turboThreshold:0,zThreshold:0,zoneAxis:"z"},{pointArrayMap:["y","z"],parallelArrays:["x","y","z"],
trackerGroups:["group","dataLabelsGroup"],specialGroup:"group",bubblePadding:!0,zoneAxis:"z",directTouch:!0,pointAttribs:function(a,c){var d=this.options.marker.fillOpacity;a=b.prototype.pointAttribs.call(this,a,c);1!==d&&(a.fill=e(a.fill).setOpacity(d).get("rgba"));return a},getRadii:function(a,b,c,f){var d,k,m,p=this.zData,n=[],e=this.options,h="width"!==e.sizeBy,g=e.zThreshold,r=b-a;k=0;for(d=p.length;k<d;k++)m=p[k],e.sizeByAbsoluteValue&&null!==m&&(m=Math.abs(m-g),b=Math.max(b-g,Math.abs(a-g)),
a=0),null===m?m=null:m<a?m=c/2-1:(m=0<r?(m-a)/r:.5,h&&0<=m&&(m=Math.sqrt(m)),m=Math.ceil(c+m*(f-c))/2),n.push(m);this.radii=n},animate:function(a){var b=this.options.animation;a||(l(this.points,function(a){var c=a.graphic,d;c&&c.width&&(d={x:c.x,y:c.y,width:c.width,height:c.height},c.attr({x:a.plotX,y:a.plotY,width:1,height:1}),c.animate(d,b))}),this.animate=null)},translate:function(){var b,c=this.data,d,f,e=this.radii;r.scatter.prototype.translate.call(this);for(b=c.length;b--;)d=c[b],f=e?e[b]:
0,x(f)&&f>=this.minPxSize/2?(d.marker=a.extend(d.marker,{radius:f,width:2*f,height:2*f}),d.dlBox={x:d.plotX-f,y:d.plotY-f,width:2*f,height:2*f}):d.shapeArgs=d.plotY=d.dlBox=void 0},alignDataLabel:r.column.prototype.alignDataLabel,buildKDTree:t,applyZones:t},{haloPath:function(a){return c.prototype.haloPath.call(this,0===a?0:(this.marker?this.marker.radius||0:0)+a)},ttBelow:!1});g.prototype.beforePadding=function(){var a=this,b=this.len,c=this.chart,e=0,n=b,g=this.isXAxis,r=g?"xData":"yData",t=this.min,
w={},H=Math.min(c.plotWidth,c.plotHeight),A=Number.MAX_VALUE,D=-Number.MAX_VALUE,E=this.max-t,C=b/E,F=[];l(this.series,function(b){var d=b.options;!b.bubblePadding||!b.visible&&c.options.chart.ignoreHiddenSeries||(a.allowZoomOutside=!0,F.push(b),g&&(l(["minSize","maxSize"],function(a){var b=d[a],c=/%$/.test(b),b=f(b);w[a]=c?H*b/100:b}),b.minPxSize=w.minSize,b.maxPxSize=Math.max(w.maxSize,w.minSize),b=b.zData,b.length&&(A=u(d.zMin,Math.min(A,Math.max(q(b),!1===d.displayNegative?d.zThreshold:-Number.MAX_VALUE))),
D=u(d.zMax,Math.max(D,h(b))))))});l(F,function(b){var c=b[r],d=c.length,f;g&&b.getRadii(A,D,b.minPxSize,b.maxPxSize);if(0<E)for(;d--;)x(c[d])&&a.dataMin<=c[d]&&c[d]<=a.dataMax&&(f=b.radii[d],e=Math.min((c[d]-t)*C-f,e),n=Math.max((c[d]-t)*C+f,n))});F.length&&0<E&&!this.isLog&&(n-=b,C*=(b+e-n)/b,l([["min","userMin",e],["max","userMax",n]],function(b){void 0===u(a.options[b[0]],a[b[1]])&&(a[b[0]]+=b[2]/C)}))}})(w);(function(a){var h=a.merge,q=a.Point,g=a.seriesType,e=a.seriesTypes;e.bubble&&g("mapbubble",
"bubble",{animationLimit:500,tooltip:{pointFormat:"{point.name}: {point.z}"}},{xyFromShape:!0,type:"mapbubble",pointArrayMap:["z"],getMapData:e.map.prototype.getMapData,getBox:e.map.prototype.getBox,setData:e.map.prototype.setData},{applyOptions:function(a,g){return a&&void 0!==a.lat&&void 0!==a.lon?q.prototype.applyOptions.call(this,h(a,this.series.chart.fromLatLonToPoint(a)),g):e.map.prototype.pointClass.prototype.applyOptions.call(this,a,g)},isValid:function(){return"number"===typeof this.z},ttBelow:!1})})(w);
(function(a){var h=a.colorPointMixin,q=a.each,g=a.merge,e=a.noop,l=a.pick,w=a.Series,t=a.seriesType,u=a.seriesTypes;t("heatmap","scatter",{animation:!1,borderWidth:0,nullColor:"#f7f7f7",dataLabels:{formatter:function(){return this.point.value},inside:!0,verticalAlign:"middle",crop:!1,overflow:!1,padding:0},marker:null,pointRange:null,tooltip:{pointFormat:"{point.x}, {point.y}: {point.value}\x3cbr/\x3e"},states:{hover:{halo:!1,brightness:.2}}},g(a.colorSeriesMixin,{pointArrayMap:["y","value"],hasPointSpecificOptions:!0,
getExtremesFromAll:!0,directTouch:!0,init:function(){var a;u.scatter.prototype.init.apply(this,arguments);a=this.options;a.pointRange=l(a.pointRange,a.colsize||1);this.yAxis.axisPointRange=a.rowsize||1},translate:function(){var a=this.options,c=this.xAxis,b=this.yAxis,e=a.pointPadding||0,g=function(a,b,c){return Math.min(Math.max(b,a),c)};this.generatePoints();q(this.points,function(f){var n=(a.colsize||1)/2,d=(a.rowsize||1)/2,k=g(Math.round(c.len-c.translate(f.x-n,0,1,0,1)),-c.len,2*c.len),n=g(Math.round(c.len-
c.translate(f.x+n,0,1,0,1)),-c.len,2*c.len),h=g(Math.round(b.translate(f.y-d,0,1,0,1)),-b.len,2*b.len),d=g(Math.round(b.translate(f.y+d,0,1,0,1)),-b.len,2*b.len),r=l(f.pointPadding,e);f.plotX=f.clientX=(k+n)/2;f.plotY=(h+d)/2;f.shapeType="rect";f.shapeArgs={x:Math.min(k,n)+r,y:Math.min(h,d)+r,width:Math.abs(n-k)-2*r,height:Math.abs(d-h)-2*r}});this.translateColors()},drawPoints:function(){u.column.prototype.drawPoints.call(this);q(this.points,function(a){a.graphic.attr(this.colorAttribs(a))},this)},
animate:e,getBox:e,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,alignDataLabel:u.column.prototype.alignDataLabel,getExtremes:function(){w.prototype.getExtremes.call(this,this.valueData);this.valueMin=this.dataMin;this.valueMax=this.dataMax;w.prototype.getExtremes.call(this)}}),a.extend({haloPath:function(a){if(!a)return[];var c=this.shapeArgs;return["M",c.x-a,c.y-a,"L",c.x-a,c.y+c.height+a,c.x+c.width+a,c.y+c.height+a,c.x+c.width+a,c.y-a,"Z"]}},h))})(w);(function(a){function h(a,c){var b,f,
e,k=!1,m=a.x,d=a.y;a=0;for(b=c.length-1;a<c.length;b=a++)f=c[a][1]>d,e=c[b][1]>d,f!==e&&m<(c[b][0]-c[a][0])*(d-c[a][1])/(c[b][1]-c[a][1])+c[a][0]&&(k=!k);return k}var q=a.Chart,g=a.each,e=a.extend,l=a.format,w=a.merge,t=a.win,u=a.wrap;q.prototype.transformFromLatLon=function(f,c){if(void 0===t.proj4)return a.error(21),{x:0,y:null};f=t.proj4(c.crs,[f.lon,f.lat]);var b=c.cosAngle||c.rotation&&Math.cos(c.rotation),e=c.sinAngle||c.rotation&&Math.sin(c.rotation);f=c.rotation?[f[0]*b+f[1]*e,-f[0]*e+f[1]*
b]:f;return{x:((f[0]-(c.xoffset||0))*(c.scale||1)+(c.xpan||0))*(c.jsonres||1)+(c.jsonmarginX||0),y:(((c.yoffset||0)-f[1])*(c.scale||1)+(c.ypan||0))*(c.jsonres||1)-(c.jsonmarginY||0)}};q.prototype.transformToLatLon=function(f,c){if(void 0===t.proj4)a.error(21);else{f={x:((f.x-(c.jsonmarginX||0))/(c.jsonres||1)-(c.xpan||0))/(c.scale||1)+(c.xoffset||0),y:((-f.y-(c.jsonmarginY||0))/(c.jsonres||1)+(c.ypan||0))/(c.scale||1)+(c.yoffset||0)};var b=c.cosAngle||c.rotation&&Math.cos(c.rotation),e=c.sinAngle||
c.rotation&&Math.sin(c.rotation);c=t.proj4(c.crs,"WGS84",c.rotation?{x:f.x*b+f.y*-e,y:f.x*e+f.y*b}:f);return{lat:c.y,lon:c.x}}};q.prototype.fromPointToLatLon=function(f){var c=this.mapTransforms,b;if(c){for(b in c)if(c.hasOwnProperty(b)&&c[b].hitZone&&h({x:f.x,y:-f.y},c[b].hitZone.coordinates[0]))return this.transformToLatLon(f,c[b]);return this.transformToLatLon(f,c["default"])}a.error(22)};q.prototype.fromLatLonToPoint=function(f){var c=this.mapTransforms,b,e;if(!c)return a.error(22),{x:0,y:null};
for(b in c)if(c.hasOwnProperty(b)&&c[b].hitZone&&(e=this.transformFromLatLon(f,c[b]),h({x:e.x,y:-e.y},c[b].hitZone.coordinates[0])))return e;return this.transformFromLatLon(f,c["default"])};a.geojson=function(a,c,b){var f=[],h=[],k=function(a){var b,c=a.length;h.push("M");for(b=0;b<c;b++)1===b&&h.push("L"),h.push(a[b][0],-a[b][1])};c=c||"map";g(a.features,function(a){var b=a.geometry,n=b.type,b=b.coordinates;a=a.properties;var m;h=[];"map"===c||"mapbubble"===c?("Polygon"===n?(g(b,k),h.push("Z")):
"MultiPolygon"===n&&(g(b,function(a){g(a,k)}),h.push("Z")),h.length&&(m={path:h})):"mapline"===c?("LineString"===n?k(b):"MultiLineString"===n&&g(b,k),h.length&&(m={path:h})):"mappoint"===c&&"Point"===n&&(m={x:b[0],y:-b[1]});m&&f.push(e(m,{name:a.name||a.NAME,properties:a}))});b&&a.copyrightShort&&(b.chart.mapCredits=l(b.chart.options.credits.mapText,{geojson:a}),b.chart.mapCreditsFull=l(b.chart.options.credits.mapTextFull,{geojson:a}));return f};u(q.prototype,"addCredits",function(a,c){c=w(!0,this.options.credits,
c);this.mapCredits&&(c.href=null);a.call(this,c);this.credits&&this.mapCreditsFull&&this.credits.attr({title:this.mapCreditsFull})})})(w);(function(a){function h(a,c,e,f,h,d,g,l){return["M",a+h,c,"L",a+e-d,c,"C",a+e-d/2,c,a+e,c+d/2,a+e,c+d,"L",a+e,c+f-g,"C",a+e,c+f-g/2,a+e-g/2,c+f,a+e-g,c+f,"L",a+l,c+f,"C",a+l/2,c+f,a,c+f-l/2,a,c+f-l,"L",a,c+h,"C",a,c+h/2,a+h/2,c,a+h,c,"Z"]}var q=a.Chart,g=a.defaultOptions,e=a.each,l=a.extend,w=a.merge,t=a.pick,u=a.Renderer,f=a.SVGRenderer,c=a.VMLRenderer;l(g.lang,
{zoomIn:"Zoom in",zoomOut:"Zoom out"});g.mapNavigation={buttonOptions:{alignTo:"plotBox",align:"left",verticalAlign:"top",x:0,width:18,height:18,padding:5,style:{fontSize:"15px",fontWeight:"bold"},theme:{"stroke-width":1,"text-align":"center"}},buttons:{zoomIn:{onclick:function(){this.mapZoom(.5)},text:"+",y:0},zoomOut:{onclick:function(){this.mapZoom(2)},text:"-",y:28}},mouseWheelSensitivity:1.1};a.splitPath=function(a){var b;a=a.replace(/([A-Za-z])/g," $1 ");a=a.replace(/^\s*/,"").replace(/\s*$/,
"");a=a.split(/[ ,]+/);for(b=0;b<a.length;b++)/[a-zA-Z]/.test(a[b])||(a[b]=parseFloat(a[b]));return a};a.maps={};f.prototype.symbols.topbutton=function(a,c,e,f,g){return h(a-1,c-1,e,f,g.r,g.r,0,0)};f.prototype.symbols.bottombutton=function(a,c,e,f,g){return h(a-1,c-1,e,f,0,0,g.r,g.r)};u===c&&e(["topbutton","bottombutton"],function(a){c.prototype.symbols[a]=f.prototype.symbols[a]});a.Map=a.mapChart=function(b,c,e){var f="string"===typeof b||b.nodeName,g=arguments[f?1:0],d={endOnTick:!1,visible:!1,
minPadding:0,maxPadding:0,startOnTick:!1},h,l=a.getOptions().credits;h=g.series;g.series=null;g=w({chart:{panning:"xy",type:"map"},credits:{mapText:t(l.mapText,' \u00a9 \x3ca href\x3d"{geojson.copyrightUrl}"\x3e{geojson.copyrightShort}\x3c/a\x3e'),mapTextFull:t(l.mapTextFull,"{geojson.copyright}")},tooltip:{followTouchMove:!1},xAxis:d,yAxis:w(d,{reversed:!0})},g,{chart:{inverted:!1,alignTicks:!1}});g.series=h;return f?new q(b,g,e):new q(g,c)}})(w)});
