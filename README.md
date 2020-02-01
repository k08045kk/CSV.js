CSV.js
=========

CSV parsing / stringification.


## Description
Provides the function of converting CSV character string data and converting the array into a CSV character string.


## Usage
	var csv = 'aaa,bbb,ccc\r\n12345,67890,"ddd,eee""fff""\r\nggg"';
	var records = CSV.parse(csv);
	console.log(records);
	// (2) [Array(3), Array(3)]
	// 0: (3) ["aaa", "bbb", "ccc"]
	// 1: (3) ["12345", "67890", "ddd,eee"fff"
	// ↵ggg"]
	// length: 2
	
	var text = CSV.stringify(records);
	console.log(text);
	// aaa,bbb,ccc
	// 12345,67890,"ddd,eee""fff""
	// ggg"



## License
[MIT](https://github.com/k08045kk/CSV.js/blob/master/LICENSE)



## Author
[toshi](https://www.bugbugnow.net/p/profile.html)
