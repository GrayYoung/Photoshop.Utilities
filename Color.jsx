/**
 * Color Class
 * Version: 0.0.3
 * Author: Gray Young
 * 
 * Copyright 2016 Released under the MIT license.
 *
 * Constructor: opional parameter(s) [Hex Code(a string with start at # or a hex number)|RGB|CMYK]
 */

function Color() {
	if(this instanceof Color) {
		this.rgb = {
			red: 0,
			green: 0,
			blue: 0
		};
		this.cmyk = {
			cyan: 0,
			magenta: 0,
			yellow: 0,
			key: 0
		};
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
	_convert: function(fromMode) {
		switch(fromMode) {
			case this.MODE.RGB:
				break;
			case this.MODE.CMYK:
				var c = 0, m = 0, y = 0, k = 0;

				c = this.cmyk.cyan / 100, m = this.cmyk.magenta / 100, y = this.cmyk.yellow / 100, k = this.cmyk.key / 100;
				this.rgb.red = Math.round((1 - Math.min( 1, c * ( 1 - k ) + k )) * 255 );
				this.rgb.green = Math.round((1 - Math.min( 1, m * ( 1 - k ) + k )) * 255 );
				this.rgb .blue = Math.round((1 - Math.min( 1, y * ( 1 - k ) + k )) * 255 );
				break;
			case this.MODE.HEX:
				var hexStr = '';
				var pattern = /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, execResult = new Array(3);
				
				if(typeof hex == 'number') {
					hexStr = hex.toString(16);
				} else {
					hexStr = hex.replace(/^#/g, '');
				}
				hexStr.toLowerCase();
				execResult = pattern.exec(hexStr);
				this.red = parseInt(execResult[ 1 ], 16);
				this.green = parseInt(execResult[ 2 ], 16);
				this.blue = parseInt(execResult[ 3 ], 16);
				break;
			default:
				alert(this.MESSAGE.UNKNOWN_COLOR_MODEL);
		}
		var result = new Object(this.cmyk);
		var r = this.rgb.red / 255, g = this.rgb.green / 255, b = this.rgb.blue / 255;
 
		result.key = Math.min(1 - r, 1 - g, 1 - b);
		result.cyan = (1 - r - result.key) / (1 - result.key);
		result.magenta = (1 - g - result.key) / (1 - result.key);
		result.yellow = (1 - b - result.key) / (1 - result.key);

		/**
		 * Initialize CMYK
		 */
		this.cmyk.cyan = Math.round( result.c * 100 );
		this.cmyk.magenta = Math.round( result.m * 100 );
		this.cmyk.yellow = Math.round( result.y * 100 );
		this.cmyk.key = Math.round( result.k * 100 );

		/**
		 * Initialize Hex
		 */
		this.hex = (this.rgb.red).toString(16) + (this.rgb.green).toString(16) + (this.rgb.blue).toString(16);
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
				var param = arguments[0], hexPattern = (/^(?:#|(?:0x))?([0-9,a-f]{6})/gi);

				if(typeof param == 'number') {
					param = param.toString(16);
				} else {
					param = hexPattern.exct(param.toLowerCase())[1];
				}
				if(isNaN(parseInt(param, 16))) {
					throw new Error(this.MESSAGE.ILLEGAL_PARAMETER);
				}
				'000000'.slice(0, 6 - param.length).concat(param);
				this.hex = param;
				this._convert(this.MODE.HEX, arguments);
				break;
			case 3:
				this.setRed(arguments[0]);
				this.setGreen(arguments[1]);
				this.setBlue(arguments[2]);
				this._convert(this.MODE.RGB, arguments);
				break;
			case 4:
				this.setCyan(arguments[0]);
				this.setMagenta(arguments[1]);
				this.setYellow(arguments[2]);
				this.setKey(arguments[3]);
				this._convert(this.MODE.CMYK, arguments);
				break;
			default:
				throw new Error(this.MESSAGE.ILLEGAL_PARAMETER);
		}
	},
	setRed: function() {
		this.rgb.red = this.RGBNumber.apply(this, arguments);
	},
	setGreen: function() {
		this.rgb.green = this.RGBNumber.apply(this, arguments);
	},
	setBlue: function() {
		this.rgb.blue = this.RGBNumber.apply(this, arguments);
	},
	setCyan: function() {
		this.cmyk.cyan = this.CMYKNumber.apply(this, arguments);
	},
	setMagenta: function() {
		this.cmyk.magenta = this.CMYKNumber.apply(this, arguments);
	},
	setYellow: function() {
		this.cmyk.yellow = this.CMYKNumber.apply(this, arguments);
	},
	setKey: function() {
		this.cmyk.key = this.CMYKNumber.apply(this, arguments);
	},
	toString: function() {
		switch(arguments[0]) {
			case this.MODE.CMYK:
				return 'cmyk(' + this.cmyk.cyan + ',' + this.cmyk.magenta + ',' + this.cmyk.yellow + ',' + this.cmyk.key ')';
			case this.MODE.HEX:
				return '#' + this.hex;
			default:
				return 'rgb(' + this.rgb.red + ',' + this.rgb.green + ',' + this.rgb.blue ')';
		}
	}
};