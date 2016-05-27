/**
 * Class: Color
 * Version: 0.0.3
 * Author: Gray Young
 * 
 * Copyright 2016 Released under the MIT license.
 *
 * Constructor: opional parameter(s) [Hex Code(a string with start at # or a hex number)|RGB|CMYK]
 */

#include 'Marching.jsx'

function Color() {
	if(this instanceof Color) {
		this.rgb = {};
		this.cmyk = {};
		this.setColor.apply(this, arguments);
	} else {
		switch(arguments.length) {
			case 1:
				return new Color(arguments[0]);
			case 3:
				return new Color(arguments[0], arguments[1], arguments[2]);
			case 4:
				return new Color(arguments[0], arguments[1], arguments[2], arguments[3]);
			default:
				return new Color();
		}
	}
};

Color.prototype = {
	constructor: Color,
	MODE: {
		RGB: 0,
		CMYK: 1,
		HEX: 2
	},
	MESSAGE: {
		ILLEGAL_PARAMETER: 'Illegal parameter(s). [Hex Code(a string with start at # or a hex number)|RGB|CMYK].',
		NOT_NUMBER: 'arguments[$1] is not a number.',
		UNKNOWN_COLOR_MODEL: 'Unknown color mode.'
	},
	_convert: function(mode) {
		switch(mode) {
			case this.MODE.RGB:
				/**
				 * Initialize RGB via Hex or CMYK.
				 * if else if Logic cannot be exchange.
				 */
				if(!Marching.isEmptyObject(this.cmyk)) {
					var c = 0, m = 0, y = 0, k = 0;

					c = this.cmyk.cyan / 100, m = this.cmyk.magenta / 100, y = this.cmyk.yellow / 100, k = this.cmyk.key / 100;
					this.rgb.red = Math.round((1 - Math.min( 1, c * ( 1 - k ) + k )) * 255 );
					this.rgb.green = Math.round((1 - Math.min( 1, m * ( 1 - k ) + k )) * 255 );
					this.rgb .blue = Math.round((1 - Math.min( 1, y * ( 1 - k ) + k )) * 255 );
				} else if(typeof this.hex == 'string') {
					var pattern = /([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, execResult = new Array(4);

					execResult = pattern.exec(this.hex);
					this.rgb.red = parseInt(execResult[1], 16);
					this.rgb.green = parseInt(execResult[2], 16);
					this.rgb.blue = parseInt(execResult[3], 16);
				}
				break;
			case this.MODE.CMYK:
				/**
				 * Initialize CMYK via RGB.
				 */
				if(Marching.isEmptyObject(this.rgb)) {
					this._convert(this.MODE.RGB);
				}
				var result = {};
				var r = this.rgb.red / 255, g = this.rgb.green / 255, b = this.rgb.blue / 255;
		 
				result.key = Math.min(1 - r, 1 - g, 1 - b);
				result.cyan = (1 - r - result.key) / (1 - result.key);
				result.magenta = (1 - g - result.key) / (1 - result.key);
				result.yellow = (1 - b - result.key) / (1 - result.key);

				this.cmyk.cyan = Math.round( result.cyan * 100 );
				this.cmyk.magenta = Math.round( result.magenta * 100 );
				this.cmyk.yellow = Math.round( result.yellow * 100 );
				this.cmyk.key = Math.round( result.key * 100 );
				break;
			case this.MODE.HEX:
				/**
				 * Initialize Hex via RGB.
				 */
				if(Marching.isEmptyObject(this.rgb)) {
					this._convert(this.MODE.RGB);
				}
				var rStr = this.rgb.red.toString(16), gStr = this.rgb.green.toString(16), bStr = this.rgb.blue.toString(16);
				this.hex = '00'.slice(0, 2 - rStr.length).concat(rStr) + '00'.slice(0, 2 - gStr.length).concat(gStr) + '00'.slice(0, 2 - bStr.length).concat(bStr);
				break;
			default:
				alert(this.MESSAGE.UNKNOWN_COLOR_MODEL);
		}
	},
	RGBNumber: function() {
		arguments[0] = Math.max(arguments[0], 0);
		arguments[0] = Math.min(arguments[0], 255);
		if(isNaN(arguments[0])) {
			throw new Error(this.MESSAGE.NOT_NUMBER.replace(/\$1/, 0));
		}

		return arguments[0];
	},
	CMYKNumber: function() {
		arguments[0] = Math.max(arguments[0], 0);
		arguments[0] = Math.min(arguments[0], 100);
		if(isNaN(arguments[0])) {
			throw new Error(this.MESSAGE.NOT_NUMBER.replace(/\$1/, 0));
		}

		return arguments[0];
	},
	setColor: function() {
		switch(arguments.length) {
			case 1:
				var param = arguments[0], hexPattern = /^(?:#|(?:0x))?([0-9,a-f]{0,6})/gi, match = null;

				if(typeof param == 'number') {
					param = param.toString(16);
				} else {
					match = hexPattern.exec(param.toLowerCase());
					if(match instanceof Array) {
						param = match[1];
					} else {
						throw new Error(this.MESSAGE.ILLEGAL_PARAMETER);
					}
				}
				if(isNaN(parseInt(param, 16))) {
					throw new Error(this.MESSAGE.ILLEGAL_PARAMETER);
				}
				param = '000000'.slice(0, 6 - param.length).concat(param);
				this.hex = param;
				this.cmyk = {};
				this._convert(this.MODE.RGB);
				this._convert(this.MODE.CMYK);
				break;
			case 3:
				this.setRed(arguments[0]);
				this.setGreen(arguments[1]);
				this.setBlue(arguments[2]);
				break;
			case 4:
				this.setCyan(arguments[0]);
				this.setMagenta(arguments[1]);
				this.setYellow(arguments[2]);
				this.setKey(arguments[3]);
				break;
			default:
				throw new Error(this.MESSAGE.ILLEGAL_PARAMETER);
		}
	},
	setRed: function() {
		this.rgb.red = this.RGBNumber.apply(this, arguments);
		if(typeof this.rgb.green == 'number' && typeof this.rgb.blue == 'number' ) {
			this._convert(this.MODE.HEX);
			this._convert(this.MODE.CMYK);
		}
	},
	setGreen: function() {
		this.rgb.green = this.RGBNumber.apply(this, arguments);
		if(typeof this.rgb.red == 'number' && typeof this.rgb.blue == 'number' ) {
			this._convert(this.MODE.HEX);
			this._convert(this.MODE.CMYK);
		}
	},
	setBlue: function() {
		this.rgb.blue = this.RGBNumber.apply(this, arguments);
		if(typeof this.rgb.green == 'number' && typeof this.rgb.red == 'number' ) {
			this._convert(this.MODE.HEX);
			this._convert(this.MODE.CMYK);
		}
	},
	setCyan: function() {
		this.cmyk.cyan = this.CMYKNumber.apply(this, arguments);
		if(typeof this.cmyk.magenta == 'number' && typeof this.cmyk.yellow == 'number' && typeof this.cmyk.key == 'number') {
			this._convert(this.MODE.RGB);
			this._convert(this.MODE.HEX);
		}
	},
	setMagenta: function() {
		this.cmyk.magenta = this.CMYKNumber.apply(this, arguments);
		if(typeof this.cmyk.cyan == 'number' && typeof this.cmyk.yellow == 'number' && typeof this.cmyk.key == 'number') {
			this._convert(this.MODE.RGB);
			this._convert(this.MODE.HEX);
		}
	},
	setYellow: function() {
		this.cmyk.yellow = this.CMYKNumber.apply(this, arguments);
		if(typeof this.cmyk.cyan == 'number' && typeof this.cmyk.magenta == 'number' && typeof this.cmyk.key == 'number') {
			this._convert(this.MODE.RGB);
			this._convert(this.MODE.HEX);
		}
	},
	setKey: function() {
		this.cmyk.key = this.CMYKNumber.apply(this, arguments);
		if(typeof this.cmyk.cyan == 'number' && typeof this.cmyk.magenta == 'number' && typeof this.cmyk.yellow == 'number') {
			this._convert(this.MODE.RGB);
			this._convert(this.MODE.HEX);
		}
	},
	toString: function() {
		switch(arguments[0]) {
			case this.MODE.CMYK:
				return 'cmyk(' + this.cmyk.cyan + ',' + this.cmyk.magenta + ',' + this.cmyk.yellow + ',' + this.cmyk.key + ')';
			case this.MODE.HEX:
				return '#' + this.hex;
			default:
				return 'rgb(' + this.rgb.red + ',' + this.rgb.green + ',' + this.rgb.blue + ')';
		}
	}
};