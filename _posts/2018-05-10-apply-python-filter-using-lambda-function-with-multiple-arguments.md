Python provides filter(func, iterable) capability so you can quickly filter out rows that you want by constructing a function
use lambda function. However, of all the examples I found online, the lambda function only takes one argument which is the iterator. 
It's not really helpful if you cannot use a dynamic lambda with multiple arguments. Say if you have list of dicts, and you want 
to filter the list based on one of the key in the dict. However, you want to pass the key name and the value to the lambda function. 
For a simple example, you have a list like the following:
```python
[{'capacityUsed': 2, 'quantitySent': 3, 'storeId': '234'},
 {'capacityUsed': 1, 'quantitySent': 2, 'storeId': '123'}]
```

You want to filter this list with key('quantitySent') being value=2. You want to pass the key and value to the lambda function:
```python
func = lambda _dict, col, val: _dict.get(col) == val
```

With this set up, you cannot really do (try yourself)
``` python 
list(filter(func, rows))
```
or
``` python 
list(filter(func('capacityUsed',2), rows))
```

The solution is to use *functools.partial* tool, if you use:
``` python 
list(filter(functools.partial(func, col='capacityUsed', val=2),rows))
```
See what you get!
