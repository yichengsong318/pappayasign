import classnames from 'classnames';
// core components
import HeaderDefault from 'components/Headers/HeaderDefault.js';
import React from 'react';
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	Container,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from 'reactstrap';
import './signaturestles.css';

const axios = require('axios').default;

class Signature extends React.Component {
	state = {
		tabs: 1,
	};
	toggleNavs = (e, state, index) => {
		e.preventDefault();
		this.setState({
			[state]: index,
		});
	};

	componentDidMount() {
		var userid = '';

		function getCookie(name) {
			var nameEQ = name + '=';
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0)
					return c.substring(nameEQ.length, c.length);
			}
			return null;
		}

		var userid = getCookie('uid');

		var Point = (function() {
			function Point(x, y, time) {
				this.x = x;
				this.y = y;
				this.time = time || Date.now();
			}
			Point.prototype.distanceTo = function(start) {
				return Math.sqrt(
					Math.pow(this.x - start.x, 2) +
						Math.pow(this.y - start.y, 2),
				);
			};
			Point.prototype.equals = function(other) {
				return (
					this.x === other.x &&
					this.y === other.y &&
					this.time === other.time
				);
			};
			Point.prototype.velocityFrom = function(start) {
				return this.time !== start.time
					? this.distanceTo(start) / (this.time - start.time)
					: 0;
			};
			return Point;
		})();

		var Bezier = (function() {
			function Bezier(
				startPoint,
				control2,
				control1,
				endPoint,
				startWidth,
				endWidth,
			) {
				this.startPoint = startPoint;
				this.control2 = control2;
				this.control1 = control1;
				this.endPoint = endPoint;
				this.startWidth = startWidth;
				this.endWidth = endWidth;
			}
			Bezier.fromPoints = function(points, widths) {
				var c2 = this.calculateControlPoints(
					points[0],
					points[1],
					points[2],
				).c2;
				var c3 = this.calculateControlPoints(
					points[1],
					points[2],
					points[3],
				).c1;
				return new Bezier(
					points[1],
					c2,
					c3,
					points[2],
					widths.start,
					widths.end,
				);
			};
			Bezier.calculateControlPoints = function(s1, s2, s3) {
				var dx1 = s1.x - s2.x;
				var dy1 = s1.y - s2.y;
				var dx2 = s2.x - s3.x;
				var dy2 = s2.y - s3.y;
				var m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
				var m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };
				var l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
				var l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
				var dxm = m1.x - m2.x;
				var dym = m1.y - m2.y;
				var k = l2 / (l1 + l2);
				var cm = { x: m2.x + dxm * k, y: m2.y + dym * k };
				var tx = s2.x - cm.x;
				var ty = s2.y - cm.y;
				return {
					c1: new Point(m1.x + tx, m1.y + ty),
					c2: new Point(m2.x + tx, m2.y + ty),
				};
			};
			Bezier.prototype.length = function() {
				var steps = 10;
				var length = 0;
				var px;
				var py;
				for (var i = 0; i <= steps; i += 1) {
					var t = i / steps;
					var cx = this.point(
						t,
						this.startPoint.x,
						this.control1.x,
						this.control2.x,
						this.endPoint.x,
					);
					var cy = this.point(
						t,
						this.startPoint.y,
						this.control1.y,
						this.control2.y,
						this.endPoint.y,
					);
					if (i > 0) {
						var xdiff = cx - px;
						var ydiff = cy - py;
						length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
					}
					px = cx;
					py = cy;
				}
				return length;
			};
			Bezier.prototype.point = function(t, start, c1, c2, end) {
				return (
					start * (1.0 - t) * (1.0 - t) * (1.0 - t) +
					3.0 * c1 * (1.0 - t) * (1.0 - t) * t +
					3.0 * c2 * (1.0 - t) * t * t +
					end * t * t * t
				);
			};
			return Bezier;
		})();

		function throttle(fn, wait) {
			if (wait === void 0) {
				wait = 250;
			}
			var previous = 0;
			var timeout = null;
			var result;
			var storedContext;
			var storedArgs;
			var later = function() {
				previous = Date.now();
				timeout = null;
				result = fn.apply(storedContext, storedArgs);
				if (!timeout) {
					storedContext = null;
					storedArgs = [];
				}
			};
			return function wrapper() {
				var args = [];
				for (var _i = 0; _i < arguments.length; _i++) {
					args[_i] = arguments[_i];
				}
				var now = Date.now();
				var remaining = wait - (now - previous);
				storedContext = this;
				storedArgs = args;
				if (remaining <= 0 || remaining > wait) {
					if (timeout) {
						clearTimeout(timeout);
						timeout = null;
					}
					previous = now;
					result = fn.apply(storedContext, storedArgs);
					if (!timeout) {
						storedContext = null;
						storedArgs = [];
					}
				} else if (!timeout) {
					timeout = window.setTimeout(later, remaining);
				}
				return result;
			};
		}

		var SignaturePad = (function() {
			function SignaturePad(canvas, options) {
				if (options === void 0) {
					options = {};
				}
				var _this = this;
				this.canvas = canvas;
				this.options = options;
				this._handleMouseDown = function(event) {
					if (event.which === 1) {
						_this._mouseButtonDown = true;
						_this._strokeBegin(event);
					}
				};
				this._handleMouseMove = function(event) {
					if (_this._mouseButtonDown) {
						_this._strokeMoveUpdate(event);
					}
				};
				this._handleMouseUp = function(event) {
					if (event.which === 1 && _this._mouseButtonDown) {
						_this._mouseButtonDown = false;
						_this._strokeEnd(event);
					}
				};
				this._handleTouchStart = function(event) {
					event.preventDefault();
					if (event.targetTouches.length === 1) {
						var touch = event.changedTouches[0];
						_this._strokeBegin(touch);
					}
				};
				this._handleTouchMove = function(event) {
					event.preventDefault();
					var touch = event.targetTouches[0];
					_this._strokeMoveUpdate(touch);
				};
				this._handleTouchEnd = function(event) {
					var wasCanvasTouched = event.target === _this.canvas;
					if (wasCanvasTouched) {
						event.preventDefault();
						var touch = event.changedTouches[0];
						_this._strokeEnd(touch);
					}
				};
				this.velocityFilterWeight = options.velocityFilterWeight || 0.7;
				this.minWidth = options.minWidth || 0.5;
				this.maxWidth = options.maxWidth || 2.5;
				this.throttle = 'throttle' in options ? options.throttle : 16;
				this.minDistance =
					'minDistance' in options ? options.minDistance : 5;
				if (this.throttle) {
					this._strokeMoveUpdate = throttle(
						SignaturePad.prototype._strokeUpdate,
						this.throttle,
					);
				} else {
					this._strokeMoveUpdate =
						SignaturePad.prototype._strokeUpdate;
				}
				this.dotSize =
					options.dotSize ||
					function dotSize() {
						return (this.minWidth + this.maxWidth) / 2;
					};
				this.penColor = options.penColor || 'black';
				this.backgroundColor =
					options.backgroundColor || 'rgba(0,0,0,0)';
				this.onBegin = options.onBegin;
				this.onEnd = options.onEnd;
				this._ctx = canvas.getContext('2d');
				this.clear();
				this.on();
			}
			SignaturePad.prototype.clear = function() {
				var ctx = this._ctx;
				var canvas = this.canvas;
				ctx.fillStyle = this.backgroundColor;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				this._data = [];
				this._reset();
				this._isEmpty = true;
			};
			SignaturePad.prototype.fromDataURL = function(
				dataUrl,
				options,
				callback,
			) {
				var _this = this;
				if (options === void 0) {
					options = {};
				}
				var image = new Image();
				var ratio = options.ratio || window.devicePixelRatio || 1;
				var width = options.width || this.canvas.width / ratio;
				var height = options.height || this.canvas.height / ratio;
				this._reset();
				image.onload = function() {
					_this._ctx.drawImage(image, 0, 0, width, height);
					if (callback) {
						callback();
					}
				};
				image.onerror = function(error) {
					if (callback) {
						callback(error);
					}
				};
				image.src = dataUrl;
				this._isEmpty = false;
			};
			SignaturePad.prototype.toDataURL = function(type, encoderOptions) {
				if (type === void 0) {
					type = 'image/png';
				}
				switch (type) {
					case 'image/svg+xml':
						return this._toSVG();
					default:
						return this.canvas.toDataURL(type, encoderOptions);
				}
			};
			SignaturePad.prototype.on = function() {
				this.canvas.style.touchAction = 'none';
				this.canvas.style.msTouchAction = 'none';
				if (window.PointerEvent) {
					this._handlePointerEvents();
				} else {
					this._handleMouseEvents();
					if ('ontouchstart' in window) {
						this._handleTouchEvents();
					}
				}
			};
			SignaturePad.prototype.off = function() {
				this.canvas.style.touchAction = 'auto';
				this.canvas.style.msTouchAction = 'auto';
				this.canvas.removeEventListener(
					'pointerdown',
					this._handleMouseDown,
				);
				this.canvas.removeEventListener(
					'pointermove',
					this._handleMouseMove,
				);
				document.removeEventListener('pointerup', this._handleMouseUp);
				this.canvas.removeEventListener(
					'mousedown',
					this._handleMouseDown,
				);
				this.canvas.removeEventListener(
					'mousemove',
					this._handleMouseMove,
				);
				document.removeEventListener('mouseup', this._handleMouseUp);
				this.canvas.removeEventListener(
					'touchstart',
					this._handleTouchStart,
				);
				this.canvas.removeEventListener(
					'touchmove',
					this._handleTouchMove,
				);
				this.canvas.removeEventListener(
					'touchend',
					this._handleTouchEnd,
				);
			};
			SignaturePad.prototype.isEmpty = function() {
				return this._isEmpty;
			};
			SignaturePad.prototype.fromData = function(pointGroups) {
				var _this = this;
				this.clear();
				this._fromData(
					pointGroups,
					function(_a) {
						var color = _a.color,
							curve = _a.curve;
						return _this._drawCurve({ color: color, curve: curve });
					},
					function(_a) {
						var color = _a.color,
							point = _a.point;
						return _this._drawDot({ color: color, point: point });
					},
				);
				this._data = pointGroups;
			};
			SignaturePad.prototype.toData = function() {
				return this._data;
			};
			SignaturePad.prototype._strokeBegin = function(event) {
				var newPointGroup = {
					color: this.penColor,
					points: [],
				};
				if (typeof this.onBegin === 'function') {
					this.onBegin(event);
				}
				this._data.push(newPointGroup);
				this._reset();
				this._strokeUpdate(event);
			};
			SignaturePad.prototype._strokeUpdate = function(event) {
				var x = event.clientX;
				var y = event.clientY;
				var point = this._createPoint(x, y);
				var lastPointGroup = this._data[this._data.length - 1];
				var lastPoints = lastPointGroup.points;
				var lastPoint =
					lastPoints.length > 0 && lastPoints[lastPoints.length - 1];
				var isLastPointTooClose = lastPoint
					? point.distanceTo(lastPoint) <= this.minDistance
					: false;
				var color = lastPointGroup.color;
				if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
					var curve = this._addPoint(point);
					if (!lastPoint) {
						this._drawDot({ color: color, point: point });
					} else if (curve) {
						this._drawCurve({ color: color, curve: curve });
					}
					lastPoints.push({
						time: point.time,
						x: point.x,
						y: point.y,
					});
				}
			};
			SignaturePad.prototype._strokeEnd = function(event) {
				this._strokeUpdate(event);
				if (typeof this.onEnd === 'function') {
					this.onEnd(event);
				}
			};
			SignaturePad.prototype._handlePointerEvents = function() {
				this._mouseButtonDown = false;
				this.canvas.addEventListener(
					'pointerdown',
					this._handleMouseDown,
				);
				this.canvas.addEventListener(
					'pointermove',
					this._handleMouseMove,
				);
				document.addEventListener('pointerup', this._handleMouseUp);
			};
			SignaturePad.prototype._handleMouseEvents = function() {
				this._mouseButtonDown = false;
				this.canvas.addEventListener(
					'mousedown',
					this._handleMouseDown,
				);
				this.canvas.addEventListener(
					'mousemove',
					this._handleMouseMove,
				);
				document.addEventListener('mouseup', this._handleMouseUp);
			};
			SignaturePad.prototype._handleTouchEvents = function() {
				this.canvas.addEventListener(
					'touchstart',
					this._handleTouchStart,
				);
				this.canvas.addEventListener(
					'touchmove',
					this._handleTouchMove,
				);
				this.canvas.addEventListener('touchend', this._handleTouchEnd);
			};
			SignaturePad.prototype._reset = function() {
				this._lastPoints = [];
				this._lastVelocity = 0;
				this._lastWidth = (this.minWidth + this.maxWidth) / 2;
				this._ctx.fillStyle = this.penColor;
			};
			SignaturePad.prototype._createPoint = function(x, y) {
				var rect = this.canvas.getBoundingClientRect();
				return new Point(
					x - rect.left,
					y - rect.top,
					new Date().getTime(),
				);
			};
			SignaturePad.prototype._addPoint = function(point) {
				var _lastPoints = this._lastPoints;
				_lastPoints.push(point);
				if (_lastPoints.length > 2) {
					if (_lastPoints.length === 3) {
						_lastPoints.unshift(_lastPoints[0]);
					}
					var widths = this._calculateCurveWidths(
						_lastPoints[1],
						_lastPoints[2],
					);
					var curve = Bezier.fromPoints(_lastPoints, widths);
					_lastPoints.shift();
					return curve;
				}
				return null;
			};
			SignaturePad.prototype._calculateCurveWidths = function(
				startPoint,
				endPoint,
			) {
				var velocity =
					this.velocityFilterWeight *
						endPoint.velocityFrom(startPoint) +
					(1 - this.velocityFilterWeight) * this._lastVelocity;
				var newWidth = this._strokeWidth(velocity);
				var widths = {
					end: newWidth,
					start: this._lastWidth,
				};
				this._lastVelocity = velocity;
				this._lastWidth = newWidth;
				return widths;
			};
			SignaturePad.prototype._strokeWidth = function(velocity) {
				return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
			};
			SignaturePad.prototype._drawCurveSegment = function(x, y, width) {
				var ctx = this._ctx;
				ctx.moveTo(x, y);
				ctx.arc(x, y, width, 0, 2 * Math.PI, false);
				this._isEmpty = false;
			};
			SignaturePad.prototype._drawCurve = function(_a) {
				var color = _a.color,
					curve = _a.curve;
				var ctx = this._ctx;
				var widthDelta = curve.endWidth - curve.startWidth;
				var drawSteps = Math.floor(curve.length()) * 2;
				ctx.beginPath();
				ctx.fillStyle = color;
				for (var i = 0; i < drawSteps; i += 1) {
					var t = i / drawSteps;
					var tt = t * t;
					var ttt = tt * t;
					var u = 1 - t;
					var uu = u * u;
					var uuu = uu * u;
					var x = uuu * curve.startPoint.x;
					x += 3 * uu * t * curve.control1.x;
					x += 3 * u * tt * curve.control2.x;
					x += ttt * curve.endPoint.x;
					var y = uuu * curve.startPoint.y;
					y += 3 * uu * t * curve.control1.y;
					y += 3 * u * tt * curve.control2.y;
					y += ttt * curve.endPoint.y;
					var width = curve.startWidth + ttt * widthDelta;
					this._drawCurveSegment(x, y, width);
				}
				ctx.closePath();
				ctx.fill();
			};
			SignaturePad.prototype._drawDot = function(_a) {
				var color = _a.color,
					point = _a.point;
				var ctx = this._ctx;
				var width =
					typeof this.dotSize === 'function'
						? this.dotSize()
						: this.dotSize;
				ctx.beginPath();
				this._drawCurveSegment(point.x, point.y, width);
				ctx.closePath();
				ctx.fillStyle = color;
				ctx.fill();
			};
			SignaturePad.prototype._fromData = function(
				pointGroups,
				drawCurve,
				drawDot,
			) {
				for (
					var _i = 0, pointGroups_1 = pointGroups;
					_i < pointGroups_1.length;
					_i++
				) {
					var group = pointGroups_1[_i];
					var color = group.color,
						points = group.points;
					if (points.length > 1) {
						for (var j = 0; j < points.length; j += 1) {
							var basicPoint = points[j];
							var point = new Point(
								basicPoint.x,
								basicPoint.y,
								basicPoint.time,
							);
							this.penColor = color;
							if (j === 0) {
								this._reset();
							}
							var curve = this._addPoint(point);
							if (curve) {
								drawCurve({ color: color, curve: curve });
							}
						}
					} else {
						this._reset();
						drawDot({
							color: color,
							point: points[0],
						});
					}
				}
			};
			SignaturePad.prototype._toSVG = function() {
				var _this = this;
				var pointGroups = this._data;
				var ratio = Math.max(window.devicePixelRatio || 1, 1);
				var minX = 0;
				var minY = 0;
				var maxX = this.canvas.width / ratio;
				var maxY = this.canvas.height / ratio;
				var svg = document.createElementNS(
					'http://www.w3.org/2000/svg',
					'svg',
				);
				svg.setAttribute('width', this.canvas.width.toString());
				svg.setAttribute('height', this.canvas.height.toString());
				this._fromData(
					pointGroups,
					function(_a) {
						var color = _a.color,
							curve = _a.curve;
						var path = document.createElement('path');
						if (
							!isNaN(curve.control1.x) &&
							!isNaN(curve.control1.y) &&
							!isNaN(curve.control2.x) &&
							!isNaN(curve.control2.y)
						) {
							var attr =
								'M ' +
								curve.startPoint.x.toFixed(3) +
								',' +
								curve.startPoint.y.toFixed(3) +
								' ' +
								('C ' +
									curve.control1.x.toFixed(3) +
									',' +
									curve.control1.y.toFixed(3) +
									' ') +
								(curve.control2.x.toFixed(3) +
									',' +
									curve.control2.y.toFixed(3) +
									' ') +
								(curve.endPoint.x.toFixed(3) +
									',' +
									curve.endPoint.y.toFixed(3));
							path.setAttribute('d', attr);
							path.setAttribute(
								'stroke-width',
								(curve.endWidth * 2.25).toFixed(3),
							);
							path.setAttribute('stroke', color);
							path.setAttribute('fill', 'none');
							path.setAttribute('stroke-linecap', 'round');
							svg.appendChild(path);
						}
					},
					function(_a) {
						var color = _a.color,
							point = _a.point;
						var circle = document.createElement('circle');
						var dotSize =
							typeof _this.dotSize === 'function'
								? _this.dotSize()
								: _this.dotSize;
						circle.setAttribute('r', dotSize.toString());
						circle.setAttribute('cx', point.x.toString());
						circle.setAttribute('cy', point.y.toString());
						circle.setAttribute('fill', color);
						svg.appendChild(circle);
					},
				);
				var prefix = 'data:image/svg+xml;base64,';
				var header =
					'<svg' +
					' xmlns="http://www.w3.org/2000/svg"' +
					' xmlns:xlink="http://www.w3.org/1999/xlink"' +
					(' viewBox="' +
						minX +
						' ' +
						minY +
						' ' +
						maxX +
						' ' +
						maxY +
						'"') +
					(' width="' + maxX + '"') +
					(' height="' + maxY + '"') +
					'>';
				var body = svg.innerHTML;
				if (body === undefined) {
					var dummy = document.createElement('dummy');
					var nodes = svg.childNodes;
					dummy.innerHTML = '';
					for (var i = 0; i < nodes.length; i += 1) {
						dummy.appendChild(nodes[i].cloneNode(true));
					}
					body = dummy.innerHTML;
				}
				var footer = '</svg>';
				var data = header + body + footer;
				return prefix + btoa(data);
			};
			return SignaturePad;
		})();

		var wrapper = document.getElementById('signature-pad2');
		var clearButton = wrapper.querySelector('[data-action=clear2]');
		var AddtoDocBtn = wrapper.querySelector('[data-action=add-to-doc2]');
		var canvas = wrapper.querySelector('canvas');
		var signaturePad = new SignaturePad(canvas, {
			// It's Necessary to use an opaque color when saving image as JPEG;
			// this option can be omitted if only saving as PNG or SVG
			//backgroundColor: 'rgb(255, 255, 255)'
		});

		// Adjust canvas coordinate space taking into account pixel ratio,
		// to make it look crisp on mobile devices.
		// This also causes canvas to be cleared.
		function resizeCanvas() {
			// When zoomed out to less than 100%, for some very strange reason,
			// some browsers report devicePixelRatio as less than 1
			// and only part of the canvas is cleared then.
			var ratio = Math.max(window.devicePixelRatio || 1, 1);

			// This part causes the canvas to be cleared
			canvas.width = canvas.offsetWidth * ratio;
			canvas.height = canvas.offsetHeight * ratio;
			canvas.getContext('2d').scale(ratio, ratio);

			// This library does not listen for canvas changes, so after the canvas is automatically
			// cleared by the browser, SignaturePad#isEmpty might still return false, even though the
			// canvas looks empty, because the internal data of this library wasn't cleared. To make sure
			// that the state of this library is consistent with visual state of the canvas, you
			// have to clear it manually.
			signaturePad.clear();
		}

		// On mobile devices it might make more sense to listen to orientation change,
		// rather than window resize events.
		window.onresize = resizeCanvas;
		resizeCanvas();

		function download(dataURL, filename) {
			var link = document.createElement('a');
			link.href = dataURL;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		// One could simply use Canvas#toBlob method instead, but it's just to show
		// that it can be done using result of SignaturePad#toDataURL.
		function dataURLToBlob(dataURL) {
			// Code taken from https://github.com/ebidel/filer.js
			var parts = dataURL.split(';base64,');
			var contentType = parts[0].split(':')[1];
			var raw = window.atob(parts[1]);
			var rawLength = raw.length;
			var uInt8Array = new Uint8Array(rawLength);

			for (var i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
			}

			return new Blob([uInt8Array], { type: contentType });
		}

		clearButton.addEventListener('click', function(event) {
			signaturePad.clear();
		});

		AddtoDocBtn.addEventListener('click', function(event) {
			if (signaturePad.isEmpty()) {
				alert('Please provide a signature first.');
			} else {
				var dataURL = signaturePad.toDataURL();
				var blob = dataURLToBlob(dataURL);

				if (userid) {
					var filename = 'signature';
					//console.log(userid);
					var signid = randomString(20);

					axios
						.post('/api/signature', {
							SignID: signid,
							UserID: userid,
							SignImage: dataURL,
						})
						.then(function(response) {
							if (response.data === 'signed') {
								window.location.hash = '#/admin/index';
							}
						})
						.catch(function(error) {});
				} else {
					window.location.hash = '#/auth/login';
				}
			}
		});

		var randomString = function(len, bits) {
			bits = bits || 36;
			var outStr = '',
				newStr;
			while (outStr.length < len) {
				newStr = Math.random()
					.toString(bits)
					.slice(2);
				outStr += newStr.slice(
					0,
					Math.min(newStr.length, len - outStr.length),
				);
			}
			return outStr.toUpperCase();
		};
	}
	render() {
		return (
			<>
				<HeaderDefault />
				{/* Page content */}
				<Container className="mt--7">
					{/* Table */}
					<Row>
						<div className="col">
							<Card className="shadow">
								<CardHeader className="border-0">
									<h3 className="mb-0">Add Signature</h3>
								</CardHeader>
								<div id="signature-container2">
									<div className="nav-wrapper">
										<Nav
											className="nav-fill flex-column flex-md-row"
											id="tabs-icons-text"
											pills
											role="tablist">
											<NavItem>
												<NavLink
													aria-selected={
														this.state.tabs === 1
													}
													className={classnames(
														'mb-sm-1 mb-md-0',
														{
															active:
																this.state
																	.tabs === 1,
														},
													)}
													onClick={(e) =>
														this.toggleNavs(
															e,
															'tabs',
															1,
														)
													}
													href="#pablo"
													role="tab">
													Draw
												</NavLink>
											</NavItem>
										</Nav>
									</div>
									<TabContent
										activeTab={'tabs' + this.state.tabs}
										id="tabcontent">
										<TabPane tabId="tabs1">
											<div
												id="signatureview2"
												className="mdl-dialog mb-3 col-lg-12 col-md-12">
												<div className="card-body p-0">
													<div
														id="signature-pad2"
														className="signature-pad2">
														<div className="signature-pad--body2">
															<canvas />
														</div>
														<div className="signature-pad--footer2">
															<div className="description">
																Sign above
															</div>

															<div className="signature-pad--actions2">
																<div>
																	<Button
																		className="m-2 float-right"
																		color="neutral"
																		type="button"
																		data-action="clear2">
																		Clear
																	</Button>
																</div>
																<div>
																	<Button
																		className="m-2"
																		id="addtodoc2"
																		color="primary"
																		type="button"
																		data-action="add-to-doc2">
																		Save and
																		Continue
																	</Button>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</TabPane>
									</TabContent>
								</div>
							</Card>
						</div>
					</Row>
				</Container>
			</>
		);
	}
}

export default Signature;
