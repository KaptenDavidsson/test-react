
# coding: utf-8

# In[1]:

import random


# In[2]:

def first_non_zero(row):
    for i,el in enumerate(row):
        if el != 0:
            return el

def print_matrix(mx):
    for s in mx:
        print('\t'.join([str(x)[:6] for x in s]))

def normalize(mx):
    return [[x/abs(first_non_zero(y) if first_non_zero(y) != 0 else 1) for x in y] for y in mx]

def partition(mx, col):
    parts = {-1: [], 0: [], 1: []}
    for row in mx:
        parts[int(row[col])].append(row)
    return parts


# In[20]:

def add(a, b):
    return [x+y for x,y in zip(a,b)]

def pairs(a, b):
    return  [] if len(a) == 0 else [add(a[0], bi) for bi in b] + pairs(a[1:], b)


def find_singles_row(mx):
    singles_row = []
    for row in mx:
        if sum(row[:-2]) == 0:
            singles_row.append(row)
    return singles_row
            
def get_bounds(rows):
    bounds = []
    mi = [x[-1] for x in rows if x[-2] == -1]
    bounds.append(max(mi) if len(mi) > 0 else -10)
    ma = [-x[-1] for x in rows if x[-2] == 1]
    bounds.append(min(ma) if len(ma) > 0 else 10)
    
    if (bounds[0] > bounds[1]):
        raise Exception('Unsolvable')
    
    return bounds

def replace_last(mx, value):
    for row in mx:
        row[-1] += row[-2]*value
        del row[-2]
        
    return mx

def fourierMotzkin(mx):
    orig_mx = mx
    parts = {}
    row_counter = 0
    for col_counter in (range(len(mx[0])-2) if len(mx[0]) > 2 else [0]):
        mx = normalize(mx)
        parts = partition(mx[row_counter:], col_counter)
        mx = mx[:row_counter] + parts[1] + pairs(parts[1], parts[-1]) + parts[0]
        row_counter += len(parts[1])
        
    mx = normalize(mx)
    return normalize(orig_mx) + mx

def remove_empty_cols(mx):
    indexes = [i for i,x in enumerate(list(zip(*mx))) if sum([abs(z) for z in x]) != 0]
    
    if len(mx[0])-1 not in indexes:
        indexes.append(len(mx[0])-1)
    
    return [[el for i,el in enumerate(row) if i in indexes] for row in mx], indexes

def bounds_int_range(bounds):
    return bounds[1]-bounds[0] >= 2

def get_closest_to_zero(bounds):
    return bounds[bounds.index(min([abs(b) for b in bounds]))]
            
def get_variables(mx):
    mx = fourierMotzkin(mx)
    vs = [1]

    for i in range(len(mx[0])-1):
        bounds = get_bounds(find_singles_row(mx))
        
        if bounds_int_range(bounds):
#             v = random.randint(int(bounds[0]), int(bounds[1]))
            v = get_closest_to_zero(bounds)
        else:
            v = random.uniform(*bounds)
        
        vs.append(v)
        mx = replace_last(mx, v)
        
    return vs[::-1]

def test_variables(mx, vs):
    print(vs)
    for row in mx:
        print(sum([x*vs[i] for i,x in enumerate(row)]))
        


# In[21]:

mx = [[ 1,  1,  1,  -1],
     [ -2,  1,  -1,  1],
     [ -1,  0,  0,  0],
     [ 0, -1,  0,  0],
     [ 0,  0, -1,  0]]

vs = get_variables(mx)
test_variables(mx, vs)    


# In[32]:

mx = [[ 1,  1,  1,  -1],
     [ -2,  1,  -1,  1],
     [ -1,  0,  0,  0],
     [ 0, -1,  0,  0]]

vs = get_variables(mx)
test_variables(mx, vs) 


# In[26]:

mx = [[1, -1, 2], [-1, 0, 0], [0, 1, 0]]

vs = get_variables(mx)
test_variables(mx, vs) 


# In[27]:

mx = [[1, -1, 0, 2], [-1, 0, 0, 0], [0, -1, 0, 0]]

mx, indexes = remove_empty_cols(mx)
vs = get_variables(mx)
test_variables(mx, vs) 


# In[33]:

mx = [[1, 0, 1, 0], [0, 1, 0, 0]]

mx, indexes = remove_empty_cols(mx)
vs = get_variables(mx)
test_variables(mx, vs) 

