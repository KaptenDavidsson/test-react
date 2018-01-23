first_non_zero(row) {
    for (var el of row) {
    	if (el !== 0) {
        	return el
        }
    }
}

print_matrix(mx) {
    for (var s in mx) {
        console.log('\t'.join([str(x)[:6] for x in s]))
    }
}

normalize(mx) {
	mx.map(y => y.map(x => first_non_zero(y) !== 0 ? x/Math.abs(first_non_zero(y)) : 1))
}

partition(mx, col) {
	parts = {-1: [], 0: [], 1: []}    

	for (var row in mx) {
        parts[int(row[col])].append(row)
	}
    return parts
}

add(a, b) {
	
}