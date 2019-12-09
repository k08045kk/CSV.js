CSV.js
=========

CSV parsing / stringification.


## Description
Provides the function of converting CSV character string data and converting the array into a CSV character string.


## Usage
	var text = 'aaa,bbb,ccc\r\n111,222,333\r\n';
	var ret = CSV.parse(text);

	var records = [['aaa', 'bbb', 'ccc'], [111, 222, 333]];
	var ret = CSV.stringify(records);


## Copyright
Copyright (c) 2019 toshi (https://www.bugbugnow.net/p/profile.html)  
Released under the MIT license.  
see https://opensource.org/licenses/MIT
