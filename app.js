import fs from 'fs';

let matrixOriginal = []
let n; let m;
let drop;
let bestPath;

// Calculates the path length matrix (matrixPath[i][j])
function pathLongestCell( i, j, matrixOriginal, matrixPath){
	if (i < 0 || i >= n || j < 0 || j >= m)
		return 0;

	// if the path is already solved
	if (matrixPath[i][j] != -1)
		return matrixPath[i][j];

	// save path lengths in all the four directions	allowed
	let x, y, z, w;
	x = -1; y = -1; z = -1; w = -1;

	// there is at least one possible direction from any cell in the array
	if (j < m - 1 && ((matrixOriginal[i][j]) > matrixOriginal[i][j + 1]))		
		x = 1 + pathLongestCell(i, j + 1, matrixOriginal, matrixPath);		

	if (j > 0 && (matrixOriginal[i][j] > matrixOriginal[i][j - 1]))
		y = 1 + pathLongestCell(i, j - 1, matrixOriginal, matrixPath);

	if (i > 0 && (matrixOriginal[i][j] > matrixOriginal[i - 1][j]))
		z = 1 + pathLongestCell(i - 1, j, matrixOriginal, matrixPath);

	if (i < n - 1 && (matrixOriginal[i][j] > matrixOriginal[i + 1][j]))
		w = 1 + pathLongestCell(i + 1, j, matrixOriginal, matrixPath);
	
	// we choose the maximum of all 4 directions, otherwise we will take a length of 1
	matrixPath[i][j] = Math.max(x, Math.max(y, Math.max(z, Math.max(w, 1))));
	return matrixPath[i][j];
}

// Computes longest path values
function getPath(matrixOriginal, matrixPath, result) {
	let matrixPath2 = []; let matrixOriginal2 = []

	for (let i = 0; i < n+2; i++) {
		matrixPath2[i] = []
		matrixOriginal2[i] = []
		for (let j = 0; j < m+2; j++) {			
			if (i == 0 || i == n+1 || j == 0 || j == m+1) {
				matrixPath2[i][j] = 0
				matrixOriginal2[i][j] = 0
			}
			else {
				matrixPath2[i][j] = matrixPath[i-1][j-1] 
				matrixOriginal2[i][j] = matrixOriginal[i-1][j-1] 
			}
		}
	}
	//console.log(matrixPath2)
	//console.log(matrixOriginal2)

	let cont = 0; let xi = []; let yi = []

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			if(matrixPath[i][j] == result){
				cont += 1
				xi.push(i)
				yi.push(j)
			}
		}
	}
	//console.log("number of equal paths: ")
	//console.log(cont)

	let allPath = []
	for (let i=0; i < cont; i++) {
		let salto = result-1
		let path = [matrixOriginal[xi[i]][yi[i]]]
		let xn = xi[i]+1; let yn = yi[i]+1	

		while (salto != 0) {
			if(matrixPath2[xn][yn-1] == salto && (matrixOriginal2[xn][yn] > matrixOriginal2[xn][yn-1])){
				yn = yn-1 			
			}
			else if(matrixPath2[xn][yn+1] == salto && (matrixOriginal2[xn][yn] > matrixOriginal2[xn][yn+1])){
				yn = yn+1 			
			}
			else if(matrixPath2[xn-1][yn] == salto && (matrixOriginal2[xn][yn] > matrixOriginal2[xn-1][yn])){
				xn = xn-1 			
			}
			else if(matrixPath2[xn+1][yn] == salto && (matrixOriginal2[xn][yn] > matrixOriginal2[xn+1][yn])){
				xn = xn+1 			
			}			
			path.push(matrixOriginal2[xn][yn])
			salto = salto - 1
		}
		allPath.push(path)
		//console.log("Longest path " + (i+1) + ": ")
		//console.log(path)
	}
	
	drop = allPath[0][0] - allPath[0][result-1]
	bestPath = allPath[0]
	for(let i=0; i < cont; i++) {
		if (allPath[i][0] - allPath[i][result-1] > drop ) {			
			drop = allPath[i][0] - allPath[i][result-1] 
			bestPath = allPath[i]
		}
	}		
}

// Returns length of the longest path beginning with any cell
function pathLongestAll( matrixOriginal){
	let result = 1; 

	// create a lookup table of -1
	var matrixPath = [];

	for( let i = 0; i < n; i++) {
		matrixPath[i] = [];
		for( let j = 0; j < m; j++ ) {
			matrixPath[i][j] = -1;
		}		
	}

	// calculate longest path beginning from all cells
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			if (matrixPath[i][j] == -1)				 
				pathLongestCell(i, j, matrixOriginal, matrixPath);				

			// update the length of the new longest path			
			result = Math.max(result, matrixPath[i][j]);									
		}			
	}	
	getPath(matrixOriginal, matrixPath, result)
	return result;	
}

// Get the data from the txt file and create the 1000 x 1000 matrix
function readFile() {
	let vectorFile = []
	let array = fs.readFileSync('./data/map.txt').toString().split("\n");
	for(let i in array) {
		array[i] = array[i].replace(/(\r\n|\n|\r)/gm, "");	
		let row = []	
		row = array[i].split(" ")
		vectorFile = []
		if(i != 0) {
			for (let j = 0; j < row.length; j++) {		
				vectorFile.push(parseInt(row[j]))
			}
			matrixOriginal.push(vectorFile)
		}
		else {
			n = parseInt(row[0])
			m = parseInt(row[1])
		}
	}
}

// Printing of resulting data
readFile()
let longitud = pathLongestAll(matrixOriginal)
console.log("Length of calculated path: ");
console.log(longitud);
console.log("Drop of calculated path: ")
console.log(drop)
console.log("Calculated path: ")
//bestPath=bestPath.toString().replace(/,/g, '-')
console.log(bestPath)