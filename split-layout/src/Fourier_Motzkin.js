function first_non_zero(row) {
    for (var el of row) {
    	if (el !== 0) {
        	return el;
        }
    }
}

function print_matrix(mx) {
    for (var s of mx) {
        console.log('\t'.join(s));
    }
}

function normalize(mx) {
	return mx.map(y => y.map(x => first_non_zero(y) !== 0 ? x/Math.abs(first_non_zero(y)) : 1));
}

function partition(mx, col) {
	var parts = {'-1': [], '0': [], '1': []}; 

	for (var row of mx) {
        parts[row[col].toString()].push(row);
	}
    return parts;
}

function add(a, b) {
	var d = a.map((i, ai) => ai + b[i]);
    console.log(d);
    return d;
}

function pairs(a, b) {
    if (a.length === 0) {
        return [];
    }
    else {
        var c = b.map(bi => add(a[0], bi));
        c.concat(pairs(a.splice(1, a.length), b));
        console.log(c);
        return c;
    }
}

function find_singles_row(mx) {
	var singles_row = [];
	for (var row of mx) {
		if (row[row.length-2].reduce( ( p, c ) => p + c, 0 )  === 0) {
			singles_row.push(row);
		}
	}
	return singles_row;
}

function get_bounds(rows) {
	var bounds = []
	var mi = rows.filter(x => x[-2] === -1)[-1];
	bounds.push(mi.length > 0 ? Math.max(mi) : -10);
	var ma = rows.filter(x => x[-2] === 1)[-1];
	bounds.push(ma.length > 0 ? Math.max(mi) : -10);

    if (bounds[0] > bounds[1]) {
        throw 'Unsolvable';
   	}
    
    return bounds;
}

function replace_last(mx, value) {
    for (var row of mx) {
        row[-1] += row[-2]*value;
        row.splice(-2,-2);
    }
        
    return mx;
}

function fourierMotzkin(mx) {
    var orig_mx = mx;
    var parts = {};
    var row_counter = 0;
    for (var col_counter = 0; col_counter < mx[0].length-3; col_counter++) {
        mx = normalize(mx);
        parts = partition(mx.slice(row_counter, mx.length), col_counter);
        mx = mx.slice(row_counter, mx.length);
        mx = mx.concat(parts['1']);
        console.log(pairs(parts['1'], parts['-1']));
        mx = mx.concat(pairs(parts['1'], parts['-1']));
        mx = mx.concat(parts['0']);
        row_counter += parts['1'].length;
    }
    
    mx = normalize(mx);
    mx = mx.concat(orig_mx);
    console.log(mx);
    return mx;
}

function remove_empty_cols(mx) {
	var indexes = {};

	for (var i = 0; i < mx.length; i++) {
		for (var j = 0; j < mx[i].length; j++) {
			if (j !== 0) {
				indexes[j] = 1;
			}
		}
	}

	indexes[mx[0].length] = 1;

	var newMx = [];

	for (var i = 0; i < mx.length; i++) {
		var newRow = [];
		for (var j = 0; j < mx[i].length; j++) {
			if (indexes.keys.includes(j)) {
				newRow[j] = mx[i][j];
			}
		}
		newMx.push(newRow);
	}
    
    return {mx: newMx, indexes: indexes};
}

function bounds_int_range(bounds) {
    return bounds[1]-bounds[0] >= 2;
}

function get_closest_to_zero(bounds) {
    return bounds[bounds.indexOf(Math.min(bounds.map(b => Math.abs(b))))];
}
            
export function get_variables(mx) {
    mx = fourierMotzkin(mx);
    var vs = [1];

    for (var i = 0; i < mx[0].length-1; i++) {
        var bounds = get_bounds(find_singles_row(mx));
        
        if (bounds_int_range(bounds)) {
            var v = get_closest_to_zero(bounds);
        }
        else {
            var v = Math.floor(Math.random() * bounds[1]) + bounds[0];
        }
        
        vs.push(v);
        mx = replace_last(mx, v);
    }
        
    return vs.reverse();
}

export function test_variables(mx, vs) {
    console.log(vs);
    for (var row of mx) {
        console.log(row.map((i,x) => x*vs[i]).reduce( ( p, c ) => p + c, 0 ));
    }
}
