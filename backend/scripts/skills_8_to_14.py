"""
Quizzes for Skills 8 through 14:
8. Python basics
9. JavaScript basics
10. Data structures (arrays, stacks, queues)
11. Algorithms & complexity (Big-O)
12. Machine learning basics
13. Supervised vs unsupervised learning
14. Overfitting & train/test split
"""

def get_skills_8_to_14():
    return [
        # 8. Python basics
        {
            "id": "python-basics",
            "name": "Python basics",
            "displayName": "Python Programming Foundations",
            "category": "Programming Languages",
            "description": "Data types, mutability, list comprehensions, decorators, generators, error handling, and OOP.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "Which of the following built-in Python data types is mutable?",
                    "options": ["List", "Tuple", "String", "Frozenset"],
                    "correctIndex": 0,
                    "explanation": "Lists can be modified in place (append, extend, pop); tuples, strings, and frozensets are immutable."
                },
                {
                    "id": 2,
                    "question": "What will the expression '[x**2 for x in range(5) if x % 2 == 0]' evaluate to?",
                    "options": ["[0, 4, 16]", "[0, 1, 4, 9, 16]", "[4, 16]", "[1, 9]"],
                    "correctIndex": 0,
                    "explanation": "Even numbers in range(5) are 0, 2, 4. Their squares are 0, 4, 16."
                },
                {
                    "id": 3,
                    "question": "What is the difference between 'is' and '==' in Python?",
                    "options": [
                        "'is' checks for memory identity (same object in RAM); '==' checks for equality of values.",
                        "'==' is only for numbers; 'is' is only for strings.",
                        "'is' compares hash values; '==' compares lengths.",
                        "They are exact synonyms in Python 3."
                    ],
                    "correctIndex": 0,
                    "explanation": "'is' checks if id(a) == id(b); '==' invokes __eq__ to compare equality of contents."
                },
                {
                    "id": 4,
                    "question": "What does the 'yield' keyword do inside a Python function?",
                    "options": [
                        "Turns the function into a Generator that yields values one at a time lazily, maintaining execution state.",
                        "Terminates the program immediately.",
                        "Imports an external C library.",
                        "Converts variables into global scope."
                    ],
                    "correctIndex": 0,
                    "explanation": "yield pauses function execution and returns a generator iterator value, resuming on the next next() call."
                },
                {
                    "id": 5,
                    "question": "What is a Python Decorator?",
                    "options": [
                        "A function that takes another function as an argument, extends its behavior without modifying it, and returns a function.",
                        "A syntax theme in VS Code.",
                        "A tool for creating desktop graphical windows.",
                        "An HTML tag used inside Python."
                    ],
                    "correctIndex": 0,
                    "explanation": "Decorators (@decorator_name) wrap an existing function to execute pre- or post-processing logic cleanly."
                },
                {
                    "id": 6,
                    "question": "What do *args and **kwargs allow a function to accept in Python?",
                    "options": [
                        "*args accepts variable positional arguments as a tuple; **kwargs accepts variable keyword arguments as a dictionary.",
                        "*args is for integers; **kwargs is for floating numbers.",
                        "*args imports modules; **kwargs deletes variables.",
                        "*args runs asynchronous code; **kwargs runs synchronous code."
                    ],
                    "correctIndex": 0,
                    "explanation": "*args packs arbitrary positional parameters into a tuple; **kwargs packs arbitrary keyword arguments into a dict."
                },
                {
                    "id": 7,
                    "question": "What is the purpose of the 'finally' block in a try-except structure?",
                    "options": [
                        "Code in 'finally' always executes regardless of whether an exception was raised or handled.",
                        "It only executes if no exceptions occurred.",
                        "It replaces the except block.",
                        "It runs only when an out-of-memory error happens."
                    ],
                    "correctIndex": 0,
                    "explanation": "The 'finally' block executes cleanup operations (e.g., closing file descriptors or database sockets) unconditionally."
                },
                {
                    "id": 8,
                    "question": "What is the difference between a shallow copy and a deep copy using the 'copy' module?",
                    "options": [
                        "Shallow copy constructs a new object but references nested objects; deep copy recursively copies all nested objects.",
                        "Deep copy only works on strings.",
                        "Shallow copy deletes the original object.",
                        "They produce identical results on nested dictionaries."
                    ],
                    "correctIndex": 0,
                    "explanation": "copy.copy() duplicates the outer container while inner elements remain shared; copy.deepcopy() duplicates the entire object hierarchy."
                },
                {
                    "id": 9,
                    "question": "What does the '__init__' method represent in a Python class?",
                    "options": [
                        "The constructor / initializer method invoked automatically when a new instance of the class is instantiated.",
                        "A method that destroys class instances from RAM.",
                        "A private method that cannot be accessed by sub-classes.",
                        "A syntax validator for type hints."
                    ],
                    "correctIndex": 0,
                    "explanation": "__init__ initializes attributes when an object is created from a class."
                },
                {
                    "id": 10,
                    "question": "What will 'bool([])' and 'bool([0])' return in Python?",
                    "options": ["False and True", "True and False", "False and False", "True and True"],
                    "correctIndex": 0,
                    "explanation": "An empty list [] is falsy (False); a non-empty list [0] containing an element is truthy (True)."
                },
                {
                    "id": 11,
                    "question": "How do you create a virtual environment in Python 3 using the standard library?",
                    "options": ["python -m venv myenv", "python create env myenv", "pip install virtualenv-all", "python --make-virtual myenv"],
                    "correctIndex": 0,
                    "explanation": "'python -m venv <dir>' creates an isolated Python installation environment."
                },
                {
                    "id": 12,
                    "question": "What is a Lambda function in Python?",
                    "options": [
                        "A small, anonymous single-line function defined with the 'lambda' keyword.",
                        "A function that runs on AWS cloud only.",
                        "A function that cannot return any value.",
                        "A function imported from the math module."
                    ],
                    "correctIndex": 0,
                    "explanation": "Lambda expressions define inline anonymous functions, e.g., lambda x, y: x + y."
                },
                {
                    "id": 13,
                    "question": "What will 'a = (1)' and 'b = (1,)' create respectively?",
                    "options": [
                        "a is an integer (1); b is a single-element tuple (1,).",
                        "Both are tuples.",
                        "Both are integers.",
                        "a is a tuple; b is a syntax error."
                    ],
                    "correctIndex": 0,
                    "explanation": "A trailing comma is mandatory to distinguish a single-element tuple from parenthesized integer arithmetic."
                },
                {
                    "id": 14,
                    "question": "What is the Global Interpreter Lock (GIL) in standard CPython?",
                    "options": [
                        "A mutex lock that prevents multiple native threads from executing Python bytecodes simultaneously in one process.",
                        "A security firewall preventing unauthorized web access.",
                        "A database lock on SQL tables.",
                        "A lock on Git commit history."
                    ],
                    "correctIndex": 0,
                    "explanation": "The GIL ensures thread-safe memory management in CPython by restricting bytecode execution to one thread at a time."
                },
                {
                    "id": 15,
                    "question": "What is the output of '\"hello\"[::-1]' in Python?",
                    "options": ["\"olleh\"", "\"hello\"", "\"h\"", "\"o\""],
                    "correctIndex": 0,
                    "explanation": "Slice notation [start:stop:step] with a step of -1 reverses the sequence."
                },
                {
                    "id": 16,
                    "question": "What is the purpose of the 'with' statement (Context Manager) in Python?",
                    "options": [
                        "Ensures resources (like file streams and locks) are properly acquired and automatically released via __enter__ and __exit__.",
                        "Runs loops 10 times faster.",
                        "Creates a new thread.",
                        "Prevents syntax errors."
                    ],
                    "correctIndex": 0,
                    "explanation": "'with open(...) as f:' ensures files are closed automatically upon exiting the block, even if an exception occurs."
                },
                {
                    "id": 17,
                    "question": "Which dictionary method safely retrieves a value without raising a KeyError if the key is missing?",
                    "options": ["dict.get(key, default)", "dict.fetch(key)", "dict.find(key)", "dict.lookup(key)"],
                    "correctIndex": 0,
                    "explanation": "dict.get('missing_key', default_val) returns None or the specified fallback value instead of raising a KeyError."
                },
                {
                    "id": 18,
                    "question": "What does 'pass' keyword represent in Python?",
                    "options": [
                        "A null statement that serves as a syntactic placeholder where code is required but no action is taken.",
                        "Skips to the next iteration of a loop.",
                        "Returns True from a function.",
                        "Exits the application."
                    ],
                    "correctIndex": 0,
                    "explanation": "'pass' acts as a placeholder in empty functions, classes, or conditional branches."
                },
                {
                    "id": 19,
                    "question": "What is Method Resolution Order (MRO) in Python object-oriented programming?",
                    "options": [
                        "The order in which Python searches for a method in a class hierarchy under multiple inheritance.",
                        "The order in which methods are compiled into bytecode.",
                        "The alphabetical sorting of class variables.",
                        "The speed of function execution."
                    ],
                    "correctIndex": 0,
                    "explanation": "Python uses the C3 Linearization algorithm to determine the MRO order for attribute resolution in multiple inheritance."
                },
                {
                    "id": 20,
                    "question": "What does 'zip([1, 2], ['a', 'b'])' produce when converted to a list?",
                    "options": ["[(1, 'a'), (2, 'b')]", "[1, 2, 'a', 'b']", "[[1, 'a', 2, 'b']]", "{1: 'a', 2: 'b'}"],
                    "correctIndex": 0,
                    "explanation": "zip pairs elements from each iterable into tuples at matching index positions."
                }
            ]
        },

        # 9. JavaScript basics
        {
            "id": "javascript-basics",
            "name": "JavaScript basics",
            "displayName": "JavaScript Core Concepts & Modern ES6+",
            "category": "Programming Languages & Frontend",
            "description": "Event loop, closures, promises, async/await, scope (let/const/var), prototype inheritance, and DOM.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is the primary difference between 'let' and 'var' in JavaScript?",
                    "options": [
                        "'let' is block-scoped and not hoisted with initialization; 'var' is function-scoped and hoisted with undefined.",
                        "'let' can be redeclared in the same scope; 'var' cannot.",
                        "'var' creates constants that cannot be reassigned.",
                        "'let' only works in browser environments, not Node.js."
                    ],
                    "correctIndex": 0,
                    "explanation": "'let' restricts scope to the containing { } block and prevents temporal dead zone errors; 'var' is function-scoped."
                },
                {
                    "id": 2,
                    "question": "What is a Closure in JavaScript?",
                    "options": [
                        "A function that retains access to its outer lexical scope even when the function is executed outside that scope.",
                        "A tool used to close the browser tab.",
                        "A syntax error caused by missing curly brackets.",
                        "A method to delete variables from memory."
                    ],
                    "correctIndex": 0,
                    "explanation": "Closures allow inner functions to remember variables from their defining parent environment even after the parent returns."
                },
                {
                    "id": 3,
                    "question": "What will 'console.log(0 == false)' and 'console.log(0 === false)' output?",
                    "options": ["true and false", "false and true", "true and true", "false and false"],
                    "correctIndex": 0,
                    "explanation": "'==' performs loose type coercion (0 converts to false); '===' is strict equality without type coercion (number != boolean)."
                },
                {
                    "id": 4,
                    "question": "How does the JavaScript Event Loop prioritize the Microtask Queue (e.g. Promise.then) vs the Macrotask / Callback Queue (e.g. setTimeout)?",
                    "options": [
                        "Microtasks are executed immediately after current execution stack empties, before processing any pending macrotask.",
                        "Macrotasks are always executed before microtasks.",
                        "Both queues are processed in random order.",
                        "Promises are delegated to the operating system kernel."
                    ],
                    "correctIndex": 0,
                    "explanation": "The event loop empties all pending microtasks (Promise jobs, queueMicrotask) before picking the next macrotask (setTimeout)."
                },
                {
                    "id": 5,
                    "question": "What is the return value of 'typeof NaN' in JavaScript?",
                    "options": ["'number'", "'NaN'", "'undefined'", "'object'"],
                    "correctIndex": 0,
                    "explanation": "In IEEE 754 floating-point standard used by JS, NaN ('Not-a-Number') has a numeric type."
                },
                {
                    "id": 6,
                    "question": "What does an Arrow Function (() => {}) do regarding the 'this' keyword?",
                    "options": [
                        "It inherits 'this' lexically from the enclosing scope and does not bind its own 'this'.",
                        "It always binds 'this' to the global window object.",
                        "It creates a new constructor prototype.",
                        "It forbids using 'this' anywhere inside its body."
                    ],
                    "correctIndex": 0,
                    "explanation": "Arrow functions do not possess their own 'this'; they capture 'this' lexically from their containing context."
                },
                {
                    "id": 7,
                    "question": "What does 'Promise.all([p1, p2, p3])' do if one of the promises rejects?",
                    "options": [
                        "It immediately rejects with the reason of the first promise that rejects.",
                        "It waits for all other promises to resolve and ignores the rejection.",
                        "It returns null.",
                        "It retries the rejected promise 3 times."
                    ],
                    "correctIndex": 0,
                    "explanation": "Promise.all fails fast: if any input promise rejects, the returned promise immediately rejects with that error."
                },
                {
                    "id": 8,
                    "question": "What will '[1, 2, 3].map(x => x * 2)' return?",
                    "options": ["[2, 4, 6]", "[1, 2, 3]", "6", "undefined"],
                    "correctIndex": 0,
                    "explanation": "Array.map creates a new array by applying the transformation function to every item."
                },
                {
                    "id": 9,
                    "question": "What will 'console.log(typeof null)' output in JavaScript due to legacy historical implementation?",
                    "options": ["'object'", "'null'", "'undefined'", "'boolean'"],
                    "correctIndex": 0,
                    "explanation": "'typeof null === object' is a recognized bug in the first version of JS that has been preserved for backward compatibility."
                },
                {
                    "id": 10,
                    "question": "What is the purpose of 'async / await' syntax in modern JavaScript?",
                    "options": [
                        "Syntactic sugar over Promises allowing asynchronous code to be written in a cleaner, synchronous-like style.",
                        "Creating parallel operating system threads.",
                        "Compiling JavaScript into C++ binary.",
                        "Disabling error handling."
                    ],
                    "correctIndex": 0,
                    "explanation": "async/await allows developers to write Promise-based non-blocking code using try/catch and sequential flow."
                },
                {
                    "id": 11,
                    "question": "What is the difference between 'undefined' and 'null' in JavaScript?",
                    "options": [
                        "'undefined' means a variable has been declared but not assigned a value; 'null' is an intentional assignment of no value.",
                        "'undefined' is a number; 'null' is a string.",
                        "'null' cannot be stored in variables.",
                        "They are identical values with identical types."
                    ],
                    "correctIndex": 0,
                    "explanation": "undefined is the default initial state of unassigned variables; null is an explicit representation of absence of an object."
                },
                {
                    "id": 12,
                    "question": "What will the expression 'Boolean(\"\")' and 'Boolean(\"hello\")' evaluate to?",
                    "options": ["false and true", "true and false", "true and true", "false and false"],
                    "correctIndex": 0,
                    "explanation": "Empty strings \"\" are falsy; non-empty strings are truthy."
                },
                {
                    "id": 13,
                    "question": "What does Array.prototype.reduce() do?",
                    "options": [
                        "Executes a user-supplied reducer callback function on each element to condense the array into a single output value.",
                        "Reduces the memory footprint of the array by 50%.",
                        "Deletes duplicate elements from an array.",
                        "Sorts the array in ascending order."
                    ],
                    "correctIndex": 0,
                    "explanation": "reduce() iterates through the elements of an array accumulating values into a single summary output."
                },
                {
                    "id": 14,
                    "question": "What is 'Event Bubbling' in the browser Document Object Model (DOM)?",
                    "options": [
                        "When an event triggers on a DOM element, it bubbles up through its ancestors toward the document root.",
                        "Events creating visual animation bubbles on the screen.",
                        "A memory leak caused by too many event listeners.",
                        "Events traveling from the window down to the target only."
                    ],
                    "correctIndex": 0,
                    "explanation": "In event bubbling, the event triggers on the innermost target element and propagates upward through its parent hierarchy."
                },
                {
                    "id": 15,
                    "question": "How do you stop event propagation upward through the DOM hierarchy inside an event handler?",
                    "options": ["event.stopPropagation()", "event.preventDefault()", "event.cancel()", "event.stop()"],
                    "correctIndex": 0,
                    "explanation": "stopPropagation() stops the event from bubbling up the DOM tree; preventDefault() suppresses default browser actions."
                },
                {
                    "id": 16,
                    "question": "What is Object Destructuring in ES6 (e.g., const { name, age } = user)?",
                    "options": [
                        "A syntax for unpacking properties from objects into distinct variables.",
                        "A method that destroys the object to free RAM.",
                        "Converting an object into an XML string.",
                        "Making object properties read-only."
                    ],
                    "correctIndex": 0,
                    "explanation": "Destructuring assignment unpacks properties from objects or arrays into individual variables cleanly."
                },
                {
                    "id": 17,
                    "question": "What does JSON.stringify() do?",
                    "options": [
                        "Converts a JavaScript object or value into a valid JSON formatted string.",
                        "Parses a JSON string into a JavaScript object.",
                        "Encrypts JSON data using SHA-256.",
                        "Saves an object directly to disk."
                    ],
                    "correctIndex": 0,
                    "explanation": "JSON.stringify() serializes an object into a JSON string; JSON.parse() deserializes a JSON string into an object."
                },
                {
                    "id": 18,
                    "question": "What is the Temporal Dead Zone (TDZ) in JavaScript?",
                    "options": [
                        "The time between entering a scope and the variable declaration where accessing 'let' or 'const' causes a ReferenceError.",
                        "The delay between browser requests.",
                        "A server crash caused by an infinite loop.",
                        "A timeout in JavaScript timer events."
                    ],
                    "correctIndex": 0,
                    "explanation": "TDZ prevents accessing 'let' and 'const' before their declaration line is executed."
                },
                {
                    "id": 19,
                    "question": "What is the purpose of 'Set' in JavaScript?",
                    "options": [
                        "A collection of unique values where duplicate entries are automatically discarded.",
                        "A function that sets timer delays.",
                        "A syntax for modifying object prototypes.",
                        "An array that only stores strings."
                    ],
                    "correctIndex": 0,
                    "explanation": "Set stores unique values of any type, whether primitive values or object references."
                },
                {
                    "id": 20,
                    "question": "What is the purpose of the Spread Operator '...' (e.g. [...arr1, ...arr2])?",
                    "options": [
                        "Expands an iterable (like an array or string) into individual elements.",
                        "Calculates the statistical variance of numbers.",
                        "Multiplies two arrays.",
                        "Creates a private class variable."
                    ],
                    "correctIndex": 0,
                    "explanation": "The spread operator expands iterable collections into individual items, useful for copying and concatenating arrays/objects."
                }
            ]
        },

        # 10. Data structures (arrays, stacks, queues)
        {
            "id": "data-structures",
            "name": "Data structures (arrays, stacks, queues)",
            "displayName": "Data Structures (Arrays, Stacks, Queues & Linear Collections)",
            "category": "Computer Science Foundations",
            "description": "LIFO vs FIFO, memory layouts, circular queues, deques, stack applications, and time complexities.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "Which principle does a Stack data structure strictly follow?",
                    "options": ["LIFO (Last In, First Out)", "FIFO (First In, First Out)", "Random Access", "Priority Order"],
                    "correctIndex": 0,
                    "explanation": "A Stack follows LIFO: the last element added is the first one to be removed."
                },
                {
                    "id": 2,
                    "question": "Which principle does a standard Queue data structure strictly follow?",
                    "options": ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "Priority Access", "Random Access"],
                    "correctIndex": 0,
                    "explanation": "A Queue follows FIFO: the first element inserted is the first one removed (like a real-world checkout queue)."
                },
                {
                    "id": 3,
                    "question": "What is the average time complexity of accessing an element at a given index in a contiguous memory Array?",
                    "options": ["O(1) Constant Time", "O(n) Linear Time", "O(log n)", "O(n^2)"],
                    "correctIndex": 0,
                    "explanation": "Arrays store items in contiguous memory blocks, allowing direct address arithmetic: Address = Base + Index * Size."
                },
                {
                    "id": 4,
                    "question": "Which real-world computing problem is traditionally implemented using a Stack?",
                    "options": [
                        "Evaluating mathematical expressions and checking for balanced parentheses (e.g., '{[()]}').",
                        "Print spooling multiple document requests in order.",
                        "Network packet routing across routers.",
                        "CPU task scheduling in round-robin order."
                    ],
                    "correctIndex": 0,
                    "explanation": "Matching opening and closing brackets and call stack management are canonical stack applications."
                },
                {
                    "id": 5,
                    "question": "What is the primary operational advantage of a Circular Queue over a simple linear array queue?",
                    "options": [
                        "It reuses empty memory slots at the front created after dequeue operations without shifting elements.",
                        "It allows infinite data storage without RAM limits.",
                        "It automatically sorts elements during insertion.",
                        "It eliminates the need for pointers."
                    ],
                    "correctIndex": 0,
                    "explanation": "Circular queues wrap indices around using modulo arithmetic (rear = (rear + 1) % capacity), preventing false queue full conditions."
                },
                {
                    "id": 6,
                    "question": "What is a Deque (Double-Ended Queue)?",
                    "options": [
                        "A queue where elements can be inserted or deleted from either the front or the rear end.",
                        "A queue that holds twice as much data as normal.",
                        "A queue connected to two computers.",
                        "A stack that can never overflow."
                    ],
                    "correctIndex": 0,
                    "explanation": "A Deque (double-ended queue) supports O(1) push and pop operations at both its front and back ends."
                },
                {
                    "id": 7,
                    "question": "What happens when an application attempts to push an element onto a stack that has exceeded its allocated memory capacity?",
                    "options": ["Stack Overflow", "Stack Underflow", "Null Pointer Exception", "Deadlock"],
                    "correctIndex": 0,
                    "explanation": "Stack Overflow occurs when pushing onto an already full static stack; Stack Underflow occurs when popping from an empty stack."
                },
                {
                    "id": 8,
                    "question": "What is the worst-case time complexity of inserting an element at the beginning (index 0) of an array of size n?",
                    "options": ["O(n)", "O(1)", "O(log n)", "O(n log n)"],
                    "correctIndex": 0,
                    "explanation": "Inserting at index 0 requires shifting all n existing elements one position to the right in memory."
                },
                {
                    "id": 9,
                    "question": "Which graph traversal algorithm fundamentally relies on a Queue data structure?",
                    "options": ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Topological Sort via recursion", "Backtracking"],
                    "correctIndex": 0,
                    "explanation": "BFS visits nodes level by level using a FIFO queue; DFS visits along branch depth using a LIFO stack."
                },
                {
                    "id": 10,
                    "question": "What is a Priority Queue?",
                    "options": [
                        "A queue where each element has an associated priority, and elements with higher priority are served before lower priority elements.",
                        "A queue that costs money to use.",
                        "A queue that only accepts integers.",
                        "A queue that deletes elements after 5 seconds."
                    ],
                    "correctIndex": 0,
                    "explanation": "Priority queues (commonly implemented via Binary Heaps) dequeue items according to priority values rather than arrival time."
                },
                {
                    "id": 11,
                    "question": "What is the time complexity of the peek() operation on a stack?",
                    "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                    "correctIndex": 0,
                    "explanation": "peek() inspects the top element without removing it, requiring constant time O(1)."
                },
                {
                    "id": 12,
                    "question": "How does a dynamic array (like Python list or C++ std::vector) handle capacity when it becomes full?",
                    "options": [
                        "It allocates a new contiguous memory block (typically 1.5x or 2x larger), copies existing elements over, and frees the old block.",
                        "It crashes the operating system.",
                        "It discards the oldest element.",
                        "It converts itself into a linked list."
                    ],
                    "correctIndex": 0,
                    "explanation": "Dynamic arrays double or scale their capacity geometrically, achieving an amortized O(1) append time complexity."
                },
                {
                    "id": 13,
                    "question": "What is an Infix expression vs a Postfix expression?",
                    "options": [
                        "Infix places operators between operands (A + B); Postfix places operators after operands (A B +).",
                        "Infix is for numbers; Postfix is for strings.",
                        "Postfix requires parentheses; Infix never uses parentheses.",
                        "They are identical notations."
                    ],
                    "correctIndex": 0,
                    "explanation": "Postfix (Reverse Polish Notation) eliminates the need for operator precedence and parentheses, evaluated via a single stack pass."
                },
                {
                    "id": 14,
                    "question": "What is the memory overhead of a Singly Linked List node compared to an Array element?",
                    "options": [
                        "Each node must store an explicit memory pointer/reference to the next node in addition to the data payload.",
                        "Linked lists use no memory.",
                        "Array elements require 10 pointers each.",
                        "Linked lists cannot store 64-bit integers."
                    ],
                    "correctIndex": 0,
                    "explanation": "Linked list nodes require additional pointer overhead (8 bytes on 64-bit architectures) for every stored item."
                },
                {
                    "id": 15,
                    "question": "Which data structure is naturally utilized by compilers and runtimes to manage function calls, local variables, and return addresses?",
                    "options": ["Call Stack", "FIFO Queue", "Hash Table", "Binary Search Tree"],
                    "correctIndex": 0,
                    "explanation": "The runtime Call Stack pushes stack frames when functions are called and pops them when functions return."
                },
                {
                    "id": 16,
                    "question": "What is the time complexity to search for an unsorted element in an array of size n?",
                    "options": ["O(n) Linear Time", "O(1)", "O(log n)", "O(n^2)"],
                    "correctIndex": 0,
                    "explanation": "Without sorting or indexing, finding an element requires a linear scan through up to n items."
                },
                {
                    "id": 17,
                    "question": "How can you implement a Queue using two Stacks (in_stack and out_stack)?",
                    "options": [
                        "Push incoming elements to in_stack; on dequeue, pop from out_stack (if empty, transfer all items from in_stack to out_stack).",
                        "Push to both stacks simultaneously.",
                        "It is mathematically impossible to implement a queue using stacks.",
                        "Pop from both stacks and add the values."
                    ],
                    "correctIndex": 0,
                    "explanation": "Transferring items from in_stack to out_stack reverses the LIFO order back into FIFO, achieving amortized O(1) operations."
                },
                {
                    "id": 18,
                    "question": "What is the time complexity of deleting an element from the middle of an array of length n?",
                    "options": ["O(n) because subsequent elements must shift left", "O(1)", "O(log n)", "O(n^2)"],
                    "correctIndex": 0,
                    "explanation": "Removing an item from the middle leaves an empty gap requiring O(n) shifts to maintain contiguous storage."
                },
                {
                    "id": 19,
                    "question": "What is an Array Buffer in low-level memory?",
                    "options": [
                        "A fixed-length raw binary data buffer in memory.",
                        "A temporary array deleted after 1 millisecond.",
                        "A hard disk partition.",
                        "An array of string values only."
                    ],
                    "correctIndex": 0,
                    "explanation": "An ArrayBuffer represents a generic, fixed-length raw binary data buffer accessed via typed arrays."
                },
                {
                    "id": 20,
                    "question": "Which operation on a standard Stack has a time complexity of O(1)?",
                    "options": [
                        "Push, Pop, and Peek (all work only on the top element)",
                        "Searching for a random element",
                        "Sorting all items in the stack",
                        "Deleting the bottom element"
                    ],
                    "correctIndex": 0,
                    "explanation": "Stack operations strictly manipulate the top pointer in constant time O(1)."
                }
            ]
        },

        # 11. Algorithms & complexity (Big-O)
        {
            "id": "algorithms-complexity",
            "name": "Algorithms & complexity (Big-O)",
            "displayName": "Algorithms & Computational Complexity (Big-O)",
            "category": "Computer Science Foundations",
            "description": "Big-O notation, time and space complexity, sorting algorithms, binary search, and divide-and-conquer.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is the worst-case time complexity of Binary Search on a sorted array of size n?",
                    "options": ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
                    "correctIndex": 0,
                    "explanation": "Binary search divides the search interval in half at each step, yielding O(log n) time."
                },
                {
                    "id": 2,
                    "question": "What does Big-O notation specifically describe in algorithm analysis?",
                    "options": [
                        "The upper bound (worst-case scenario) on the growth rate of runtime or memory as input size n approaches infinity.",
                        "The exact number of CPU clock cycles an algorithm consumes on a specific processor.",
                        "The physical size of the binary compiled file on disk.",
                        "The number of lines of code in a function."
                    ],
                    "correctIndex": 0,
                    "explanation": "Big-O characterizes asymptotic performance, describing how resource requirements scale with input size n."
                },
                {
                    "id": 3,
                    "question": "What is the average and worst-case time complexity of Merge Sort?",
                    "options": ["O(n log n)", "O(n^2)", "O(n)", "O(2^n)"],
                    "correctIndex": 0,
                    "explanation": "Merge Sort consistently divides the array in half and takes O(n) to merge, guaranteeing O(n log n) in all cases."
                },
                {
                    "id": 4,
                    "question": "What is the time complexity of finding an element in an unsorted list of size n using Linear Search?",
                    "options": ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
                    "correctIndex": 0,
                    "explanation": "In the worst case (element at the end or not present), linear search inspects all n elements."
                },
                {
                    "id": 5,
                    "question": "Which of the following computational complexity classes represents the FASTEST growth (i.e. the least efficient / slowest algorithm for large n)?",
                    "options": ["O(2^n) Exponential", "O(n^2) Quadratic", "O(n log n)", "O(n) Linear"],
                    "correctIndex": 0,
                    "explanation": "Exponential complexity O(2^n) explodes rapidly and becomes computationally intractable for even modest inputs."
                },
                {
                    "id": 6,
                    "question": "What is the worst-case time complexity of Quick Sort (e.g. when the chosen pivot is consistently the minimum or maximum element)?",
                    "options": ["O(n^2)", "O(n log n)", "O(log n)", "O(n!)"],
                    "correctIndex": 0,
                    "explanation": "If the pivot divides poorly (e.g., already sorted array with first element as pivot), Quick Sort degenerates into O(n^2)."
                },
                {
                    "id": 7,
                    "question": "What is the time complexity of accessing an item in a Hash Table with a good hash function and minimal collisions?",
                    "options": ["O(1) Constant Time", "O(log n)", "O(n)", "O(n log n)"],
                    "correctIndex": 0,
                    "explanation": "Hash tables compute the bucket index in constant time O(1) on average."
                },
                {
                    "id": 8,
                    "question": "What is Space Complexity?",
                    "options": [
                        "The total amount of memory space required by the algorithm to execute as a function of the input size n.",
                        "The hard disk capacity of the server.",
                        "The physical space occupied by the computer in a room.",
                        "The length of variable names in source code."
                    ],
                    "correctIndex": 0,
                    "explanation": "Space complexity accounts for both auxiliary memory and input space needed by an algorithm during execution."
                },
                {
                    "id": 9,
                    "question": "What algorithm paradigm does Merge Sort utilize?",
                    "options": ["Divide and Conquer", "Greedy Algorithm", "Dynamic Programming", "Backtracking"],
                    "correctIndex": 0,
                    "explanation": "Merge sort divides the array into sub-arrays, recursively sorts them, and conquers by merging the sorted halves."
                },
                {
                    "id": 10,
                    "question": "What is the time complexity of two nested loops each iterating n times (for i in 0..n: for j in 0..n)?",
                    "options": ["O(n^2)", "O(2n)", "O(n log n)", "O(n)"],
                    "correctIndex": 0,
                    "explanation": "For each of the n outer iterations, the inner loop runs n times, resulting in n * n = n^2 operations."
                },
                {
                    "id": 11,
                    "question": "What does Big-Omega (Ω) notation describe?",
                    "options": [
                        "The asymptotic lower bound (best-case performance) of an algorithm.",
                        "The worst-case performance.",
                        "The average execution time.",
                        "Memory consumption only."
                    ],
                    "correctIndex": 0,
                    "explanation": "Big-O represents the upper bound; Big-Omega (Ω) represents the asymptotic lower bound."
                },
                {
                    "id": 12,
                    "question": "What is the time complexity of computing the n-th Fibonacci number using naive unmemoized recursion (fib(n) = fib(n-1) + fib(n-2))?",
                    "options": ["O(2^n) Exponential", "O(n)", "O(log n)", "O(n^2)"],
                    "correctIndex": 0,
                    "explanation": "Each call branches into two recursive calls, creating a binary recursion tree of depth n with ~2^n total calls."
                },
                {
                    "id": 13,
                    "question": "What is the time complexity of finding the maximum element in an unsorted array of size n?",
                    "options": ["O(n)", "O(1)", "O(log n)", "O(n log n)"],
                    "correctIndex": 0,
                    "explanation": "Every element must be checked at least once to guarantee that no larger element exists elsewhere."
                },
                {
                    "id": 14,
                    "question": "What does Dynamic Programming (DP) use to optimize recursive algorithms with overlapping subproblems?",
                    "options": [
                        "Memoization (top-down caching) or Tabulation (bottom-up table construction).",
                        "Random number generators.",
                        "Deleting previous variables.",
                        "Rebooting the CPU between loops."
                    ],
                    "correctIndex": 0,
                    "explanation": "Dynamic programming solves each subproblem once and stores the result in memory (memoization/tabulation) to eliminate redundant work."
                },
                {
                    "id": 15,
                    "question": "What is the time complexity of Bubble Sort in the average and worst cases?",
                    "options": ["O(n^2)", "O(n log n)", "O(n)", "O(1)"],
                    "correctIndex": 0,
                    "explanation": "Bubble Sort compares adjacent elements and repeatedly passes through the list, requiring O(n^2) comparisons."
                },
                {
                    "id": 16,
                    "question": "What is the best-case time complexity of Bubble Sort when an optimized flag checks if any swaps occurred?",
                    "options": ["O(n) Linear Time", "O(1)", "O(n^2)", "O(log n)"],
                    "correctIndex": 0,
                    "explanation": "If the array is already sorted, the algorithm makes a single pass of n-1 comparisons, detects zero swaps, and halts in O(n)."
                },
                {
                    "id": 17,
                    "question": "What is a Stable Sorting Algorithm?",
                    "options": [
                        "An algorithm that preserves the relative input order of records with equal keys.",
                        "An algorithm that never crashes the computer.",
                        "An algorithm that sorts only positive integers.",
                        "An algorithm with constant memory."
                    ],
                    "correctIndex": 0,
                    "explanation": "Stability ensures that if two elements have identical sorting keys, their initial relative order is maintained."
                },
                {
                    "id": 18,
                    "question": "What is the space complexity of an in-place sorting algorithm like Heapsort?",
                    "options": ["O(1) Auxiliary Space", "O(n)", "O(n log n)", "O(log n)"],
                    "correctIndex": 0,
                    "explanation": "An in-place algorithm sorts data within the original array without requiring significant auxiliary storage, using O(1) extra space."
                },
                {
                    "id": 19,
                    "question": "What is the time complexity of inserting an element into a Binary Heap of size n?",
                    "options": ["O(log n)", "O(1)", "O(n)", "O(n^2)"],
                    "correctIndex": 0,
                    "explanation": "Inserting adds the element at the end and 'bubbles up' along the tree height of log(n) levels."
                },
                {
                    "id": 20,
                    "question": "What is the Big-O simplification of O(3n^3 + 5n^2 + 100n + 5000)?",
                    "options": ["O(n^3)", "O(3n^3)", "O(n^2)", "O(5000)"],
                    "correctIndex": 0,
                    "explanation": "In asymptotic Big-O analysis, lower-order terms and constant coefficients are dropped, retaining only the dominant term O(n^3)."
                }
            ]
        },

        # 12. Machine learning basics
        {
            "id": "machine-learning-basics",
            "name": "Machine learning basics",
            "displayName": "Machine Learning Core Concepts",
            "category": "AI / ML & Data Science",
            "description": "Features, labels, training vs inference, parametric models, loss functions, gradient descent, and bias-variance tradeoff.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "In machine learning terminology, what is a 'Feature'?",
                    "options": [
                        "An individual measurable property or characteristic of a phenomenon being observed (input variable X).",
                        "The final prediction of the model.",
                        "A bug in the software.",
                        "The time taken to train the network."
                    ],
                    "correctIndex": 0,
                    "explanation": "Features are explanatory input variables (columns) fed into an algorithm to predict a target label."
                },
                {
                    "id": 2,
                    "question": "What is the primary objective of Gradient Descent in machine learning?",
                    "options": [
                        "Iteratively adjusting model parameters (weights and biases) to minimize the loss function.",
                        "Sorting a dataset in alphabetical order.",
                        "Splitting data into 10 folds.",
                        "Encrypting model weights for security."
                    ],
                    "correctIndex": 0,
                    "explanation": "Gradient descent calculates the gradient of the loss function with respect to weights and steps in the opposite direction to find the minimum."
                },
                {
                    "id": 3,
                    "question": "What is a 'Loss Function' (Cost Function)?",
                    "options": [
                        "A mathematical function that quantifies the difference between the model's predicted values and the actual true ground truth values.",
                        "The money spent on cloud GPUs.",
                        "A function that deletes corrupt data records.",
                        "A function that measures network latency."
                    ],
                    "correctIndex": 0,
                    "explanation": "The loss function evaluates how well a specific algorithm models the given data, producing a penalty for incorrect predictions."
                },
                {
                    "id": 4,
                    "question": "What is the difference between a Model Parameter and a Hyperparameter?",
                    "options": [
                        "Model parameters (weights, coefficients) are learned automatically from training data; Hyperparameters (learning rate, depth) are configured before training starts.",
                        "Hyperparameters are learned from data; parameters are set manually.",
                        "Parameters are only used in deep learning.",
                        "There is no distinction between them."
                    ],
                    "correctIndex": 0,
                    "explanation": "Parameters are internal to the model estimated from training data; hyperparameters are external tuning configurations set by the engineer."
                },
                {
                    "id": 5,
                    "question": "What is the Bias-Variance Tradeoff?",
                    "options": [
                        "The conflict in trying to simultaneously minimize underfitting (high bias) and overfitting (high variance).",
                        "A tradeoff between CPU and GPU clock speeds.",
                        "A method for compressing datasets.",
                        "Balancing positive and negative numbers in a matrix."
                    ],
                    "correctIndex": 0,
                    "explanation": "High bias leads to underfitting (oversimplifying patterns); high variance leads to overfitting (capturing noise). The goal is optimal balance."
                },
                {
                    "id": 6,
                    "question": "What does 'Inference' mean in machine learning?",
                    "options": [
                        "Using a trained model to make predictions on new, unseen input data.",
                        "The process of updating model weights with backpropagation.",
                        "Cleaning messy CSV files.",
                        "Writing documentation for the model."
                    ],
                    "correctIndex": 0,
                    "explanation": "Training is learning the weights from existing data; inference is running the trained model to generate output predictions."
                },
                {
                    "id": 7,
                    "question": "What is the Learning Rate in gradient descent?",
                    "options": [
                        "A tuning hyperparameter that determines the step size taken towards the minimum of the loss function at each iteration.",
                        "The number of hours a student studies.",
                        "The speed of RAM read operations.",
                        "The percentage of missing data in the dataset."
                    ],
                    "correctIndex": 0,
                    "explanation": "Learning rate controls step size: too small leads to slow convergence; too large can cause divergence or oscillating over the minimum."
                },
                {
                    "id": 8,
                    "question": "Which of the following is a common loss function for Linear Regression?",
                    "options": ["Mean Squared Error (MSE)", "Binary Cross-Entropy", "Categorical Cross-Entropy", "Hinge Loss"],
                    "correctIndex": 0,
                    "explanation": "MSE measures the average of the squared differences between the predicted and actual continuous values."
                },
                {
                    "id": 9,
                    "question": "Which loss function is standard for Binary Classification problems?",
                    "options": ["Binary Cross-Entropy (Log Loss)", "Mean Squared Error", "Mean Absolute Percentage Error", "Cosine Distance"],
                    "correctIndex": 0,
                    "explanation": "Binary Cross-Entropy quantifies the performance of a classification model whose output is a probability between 0 and 1."
                },
                {
                    "id": 10,
                    "question": "What is 'Feature Scaling' (e.g. Normalization or Standardization) and why is it important?",
                    "options": [
                        "Transforming features to a similar scale so gradient descent converges efficiently and distance-based algorithms are not dominated by large numbers.",
                        "Increasing image resolution.",
                        "Removing rows with missing data.",
                        "Converting categorical text into audio."
                    ],
                    "correctIndex": 0,
                    "explanation": "Algorithms calculating distances (like KNN, SVM, K-Means) or using gradient descent require features on comparable scales."
                },
                {
                    "id": 11,
                    "question": "What is One-Hot Encoding?",
                    "options": [
                        "Converting categorical variables into binary vectors where only one bit is 1 (hot) and the rest are 0.",
                        "Encrypting data using thermal sensors.",
                        "Normalizing numbers between 0 and 100.",
                        "Compressing files into gzip format."
                    ],
                    "correctIndex": 0,
                    "explanation": "One-hot encoding maps discrete categories (e.g., Red, Green, Blue) into boolean indicator columns without assuming an ordinal order."
                },
                {
                    "id": 12,
                    "question": "What is an Epoch in model training?",
                    "options": [
                        "One complete pass of the entire training dataset through the machine learning algorithm.",
                        "A time duration of 1 hour.",
                        "A single batch of 32 images.",
                        "The timestamp when the model was created."
                    ],
                    "correctIndex": 0,
                    "explanation": "An epoch represents a full cycle where every sample in the training dataset has had a chance to update internal parameters."
                },
                {
                    "id": 13,
                    "question": "What is a Baseline Model?",
                    "options": [
                        "A simple heuristic or dummy model (e.g. predicting the majority class or mean) used as a reference benchmark to measure if complex models add real value.",
                        "A model that runs in the bottom of a data center.",
                        "A model with zero parameters.",
                        "A model trained with zero data."
                    ],
                    "correctIndex": 0,
                    "explanation": "A baseline establishes minimum acceptable performance; an advanced model must significantly outperform the baseline to justify complexity."
                },
                {
                    "id": 14,
                    "question": "What is Stochastic Gradient Descent (SGD)?",
                    "options": [
                        "An optimization method that updates model weights using only one random training sample (or mini-batch) at each iteration instead of the entire dataset.",
                        "A random guess algorithm.",
                        "A method that never uses gradients.",
                        "An algorithm that calculates derivatives without calculus."
                    ],
                    "correctIndex": 0,
                    "explanation": "SGD updates weights per sample/mini-batch, making it computationally faster and better suited for large-scale datasets than full-batch gradient descent."
                },
                {
                    "id": 15,
                    "question": "What is the difference between Parametric and Non-Parametric models?",
                    "options": [
                        "Parametric models assume a fixed functional form with a fixed number of parameters (e.g. Linear Regression); Non-parametric models grow parameters with data (e.g. KNN, Decision Trees).",
                        "Non-parametric models use zero math.",
                        "Parametric models cannot be trained.",
                        "They are interchangeable terms."
                    ],
                    "correctIndex": 0,
                    "explanation": "Parametric models summarize data with a fixed set of weights; non-parametric models make fewer assumptions and their complexity grows with sample size."
                },
                {
                    "id": 16,
                    "question": "What does a Decision Tree use to decide the best split point at each internal node?",
                    "options": [
                        "Information Gain (Entropy reduction) or Gini Impurity.",
                        "Random coin toss.",
                        "Alphabetical sorting of column names.",
                        "The date when data was collected."
                    ],
                    "correctIndex": 0,
                    "explanation": "Decision trees choose splits that maximize homogeneity (purity) of the child nodes using Gini Impurity or Information Gain."
                },
                {
                    "id": 17,
                    "question": "What is Ensemble Learning?",
                    "options": [
                        "Combining the predictions of multiple individual models (e.g., Random Forest, Gradient Boosting) to achieve superior overall predictive accuracy and robustness.",
                        "Training a single neural network for 100 days.",
                        "Using models from different software vendors.",
                        "Listening to classical music while coding."
                    ],
                    "correctIndex": 0,
                    "explanation": "Ensemble methods (like Bagging and Boosting) aggregate multiple 'weak learners' into a strong, highly accurate predictor."
                },
                {
                    "id": 18,
                    "question": "What is the purpose of Early Stopping during training?",
                    "options": [
                        "Halting model training when performance on the validation set stops improving to prevent overfitting.",
                        "Shutting down the server to save electricity.",
                        "Stopping training when the loss reaches exactly zero.",
                        "Canceling training if the user presses Ctrl+C."
                    ],
                    "correctIndex": 0,
                    "explanation": "Early stopping monitors validation loss; when validation error starts climbing while training error decreases, it terminates training."
                },
                {
                    "id": 19,
                    "question": "What is Vector Embedding in machine learning?",
                    "options": [
                        "A low-dimensional, dense continuous numerical vector representation of high-dimensional entities (like text, images, or skills) capturing semantic meaning.",
                        "An arrow drawn on a chart.",
                        "A database column with only integers.",
                        "A graphic design technique."
                    ],
                    "correctIndex": 0,
                    "explanation": "Embeddings translate complex semantic objects into continuous vector spaces where geometric distance reflects conceptual similarity."
                },
                {
                    "id": 20,
                    "question": "Which metric measures the angle between two embedding vectors in multidimensional space regardless of their magnitude?",
                    "options": ["Cosine Similarity", "Euclidean Distance", "Manhattan Distance", "Hamming Distance"],
                    "correctIndex": 0,
                    "explanation": "Cosine similarity measures the cosine of the angle between two vectors, ranging from -1 to 1 (or 0 to 1 for normalized vectors)."
                }
            ]
        },

        # 13. Supervised vs unsupervised learning
        {
            "id": "supervised-vs-unsupervised",
            "name": "Supervised vs unsupervised learning",
            "displayName": "Supervised vs Unsupervised Learning Paradigms",
            "category": "AI / ML & Data Science",
            "description": "Classification vs regression, clustering (k-means), dimensionality reduction (PCA), and unlabeled data patterns.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is the primary defining characteristic of Supervised Learning?",
                    "options": [
                        "The training dataset contains both input features (X) and ground truth target labels (y).",
                        "A human programmer supervises the computer screen during training.",
                        "The model only works on supercomputers.",
                        "The dataset has zero labels."
                    ],
                    "correctIndex": 0,
                    "explanation": "Supervised learning learns a mapping function from input features to known target outputs provided during training."
                },
                {
                    "id": 2,
                    "question": "What is the primary goal of Unsupervised Learning?",
                    "options": [
                        "Discovering inherent patterns, groupings, and underlying structures in unlabeled data without predefined ground-truth targets.",
                        "Predicting tomorrow's exact stock price in dollars.",
                        "Translating French text to English with human correction.",
                        "Classifying emails as spam or not spam using labeled examples."
                    ],
                    "correctIndex": 0,
                    "explanation": "Unsupervised learning extracts hidden patterns (clustering, density, dimensionality) from data with no target labels."
                },
                {
                    "id": 3,
                    "question": "What is the fundamental difference between Classification and Regression in supervised learning?",
                    "options": [
                        "Classification predicts discrete categorical class labels; Regression predicts continuous numerical quantities.",
                        "Classification predicts continuous prices; Regression predicts yes/no categories.",
                        "Regression does not use data.",
                        "Classification cannot use numbers."
                    ],
                    "correctIndex": 0,
                    "explanation": "Classification predicts discrete classes (e.g. Dog vs Cat, Spam vs Ham); regression predicts continuous numbers (e.g. House Price)."
                },
                {
                    "id": 4,
                    "question": "Which algorithm is a classic example of an Unsupervised Clustering method?",
                    "options": ["K-Means Clustering", "Logistic Regression", "Random Forest Classifier", "Linear Regression"],
                    "correctIndex": 0,
                    "explanation": "K-Means partitions unlabeled observations into k distinct clusters based on feature similarity to cluster centroids."
                },
                {
                    "id": 5,
                    "question": "What is Principal Component Analysis (PCA) used for in unsupervised learning?",
                    "options": [
                        "Dimensionality reduction: projecting high-dimensional features into orthogonal components that capture maximum variance.",
                        "Predicting customer churn.",
                        "Encrypting data tables.",
                        "Removing all negative numbers."
                    ],
                    "correctIndex": 0,
                    "explanation": "PCA reduces the number of features in a dataset while preserving as much statistical information (variance) as possible."
                },
                {
                    "id": 6,
                    "question": "Which of the following is a Supervised Learning task?",
                    "options": [
                        "Predicting patient disease diagnosis based on historical labeled medical records.",
                        "Segmenting e-commerce customers into clusters with no prior tags.",
                        "Detecting novel unknown fraud patterns in unlabelled transaction logs.",
                        "Reducing 100 features down to 2 for 2D visualization."
                    ],
                    "correctIndex": 0,
                    "explanation": "Using labeled historical records to predict a target outcome (disease diagnosis) is a classic supervised classification problem."
                },
                {
                    "id": 7,
                    "question": "What is Semi-Supervised Learning?",
                    "options": [
                        "Training a model on a small amount of labeled data combined with a large amount of unlabeled data.",
                        "Having a human look at only 50% of the training output.",
                        "Running half of the code on a server and half on mobile.",
                        "A model that only works during half of the day."
                    ],
                    "correctIndex": 0,
                    "explanation": "Semi-supervised learning leverages cheap abundant unlabeled data alongside scarce expensive labeled data to improve accuracy."
                },
                {
                    "id": 8,
                    "question": "How does K-Means choose the cluster for a given data point?",
                    "options": [
                        "It assigns the point to the cluster whose centroid has the shortest Euclidean distance to that point.",
                        "By alphabetical order of feature names.",
                        "Using a decision tree split.",
                        "Random assignment on every query."
                    ],
                    "correctIndex": 0,
                    "explanation": "K-Means measures distance to all k centroids and assigns points to the nearest centroid, then recomputes centroids iteratively."
                },
                {
                    "id": 9,
                    "question": "What is the 'Elbow Method' used for in K-Means clustering?",
                    "options": [
                        "Determining the optimal number of clusters (k) by plotting inertia (within-cluster sum of squares) against k.",
                        "Measuring model training time on a clock.",
                        "Detecting outliers in a linear regression.",
                        "Splitting train and test data."
                    ],
                    "correctIndex": 0,
                    "explanation": "The elbow method looks for the point where adding another cluster yields diminishing returns in variance reduction."
                },
                {
                    "id": 10,
                    "question": "Which algorithm is typically used for Association Rule Mining (e.g. Market Basket Analysis: 'people who buy bread also buy butter')?",
                    "options": ["Apriori Algorithm", "Linear Regression", "Support Vector Machine", "Gradient Boosted Trees"],
                    "correctIndex": 0,
                    "explanation": "The Apriori algorithm mines frequent itemsets and association rules from transaction databases."
                },
                {
                    "id": 11,
                    "question": "What is Anomaly Detection (Outlier Detection) in unsupervised learning?",
                    "options": [
                        "Identifying rare items, events, or observations that deviate significantly from the majority of the data.",
                        "Fixing spelling mistakes in text.",
                        "Deleting zero values from spreadsheets.",
                        "Calculating average salary."
                    ],
                    "correctIndex": 0,
                    "explanation": "Anomaly detection (e.g. Isolation Forests, One-Class SVM) flags data points that do not conform to expected normal patterns."
                },
                {
                    "id": 12,
                    "question": "Is Logistic Regression a classification or regression algorithm?",
                    "options": [
                        "A Classification algorithm (despite its name), because it outputs probabilities of discrete class membership.",
                        "A Regression algorithm that only predicts continuous stock prices.",
                        "An unsupervised clustering algorithm.",
                        "A data visualization library."
                    ],
                    "correctIndex": 0,
                    "explanation": "Logistic regression applies the sigmoid function to model the probability of categorical binary outcomes."
                },
                {
                    "id": 13,
                    "question": "What is Hierarchical Clustering?",
                    "options": [
                        "A clustering method that builds a tree of clusters (dendrogram) either bottom-up (agglomerative) or top-down (divisive).",
                        "A database hierarchy with foreign keys.",
                        "A deep neural network with 100 layers.",
                        "A company organizational chart."
                    ],
                    "correctIndex": 0,
                    "explanation": "Hierarchical clustering groups data into nested clusters represented visually as a dendrogram."
                },
                {
                    "id": 14,
                    "question": "What is Reinforcement Learning (RL) compared to Supervised Learning?",
                    "options": [
                        "In RL, an agent learns by trial and error through interacting with an environment, guided by scalar rewards and penalties rather than explicit labeled examples.",
                        "RL is identical to supervised learning.",
                        "RL does not allow the computer to make mistakes.",
                        "RL only works on physical robots."
                    ],
                    "correctIndex": 0,
                    "explanation": "Reinforcement learning optimizes an agent's actions over time based on feedback signals (rewards/penalties) from an environment."
                },
                {
                    "id": 15,
                    "question": "What type of problem is predicting whether an incoming email is 'Spam' or 'Not Spam'?",
                    "options": ["Binary Classification (Supervised)", "Clustering (Unsupervised)", "Multi-output Regression", "Dimensionality Reduction"],
                    "correctIndex": 0,
                    "explanation": "Email spam detection is a classic supervised binary classification problem with two target classes: {Spam, Not Spam}."
                },
                {
                    "id": 16,
                    "question": "What type of problem is predicting house prices in dollars based on square footage, location, and bedrooms?",
                    "options": ["Regression (Supervised)", "Unsupervised Clustering", "Binary Classification", "Association Rule Mining"],
                    "correctIndex": 0,
                    "explanation": "Predicting a continuous dollar amount from labeled historical sales is a supervised regression task."
                },
                {
                    "id": 17,
                    "question": "What is t-SNE (t-Distributed Stochastic Neighbor Embedding)?",
                    "options": [
                        "An unsupervised non-linear dimensionality reduction technique primarily used for visualizing high-dimensional datasets in 2D or 3D.",
                        "A supervised classifier for image recognition.",
                        "A database query engine.",
                        "An email spam filter."
                    ],
                    "correctIndex": 0,
                    "explanation": "t-SNE maps multidimensional vectors to 2D/3D space while preserving local neighbor relationships, ideal for visualizing clusters."
                },
                {
                    "id": 18,
                    "question": "In unsupervised K-Means, what does 'Inertia' measure?",
                    "options": [
                        "The sum of squared distances of samples to their closest cluster center.",
                        "The time taken to run one iteration.",
                        "The number of features in the dataset.",
                        "The accuracy of predictions."
                    ],
                    "correctIndex": 0,
                    "explanation": "Inertia (Within-Cluster Sum of Squares) quantifies how internally coherent and dense the clusters are."
                },
                {
                    "id": 19,
                    "question": "What is the Silhouette Score used for in clustering analysis?",
                    "options": [
                        "Evaluating how similar an object is to its own cluster compared to other clusters (ranging from -1 to +1).",
                        "Measuring image brightness.",
                        "Testing for missing values.",
                        "Measuring the depth of a decision tree."
                    ],
                    "correctIndex": 0,
                    "explanation": "A high silhouette value indicates that the object is well matched to its own cluster and poorly matched to neighboring clusters."
                },
                {
                    "id": 20,
                    "question": "Which of the following requires labeled training data?",
                    "options": ["Support Vector Machine (SVM)", "K-Means Clustering", "Principal Component Analysis (PCA)", "Isolation Forest"],
                    "correctIndex": 0,
                    "explanation": "Support Vector Machines (SVM) are supervised models that find an optimal hyperplane separating labeled classes."
                }
            ]
        },

        # 14. Overfitting & train/test split
        {
            "id": "overfitting-train-test",
            "name": "Overfitting & train/test split",
            "displayName": "Overfitting, Regularization & Model Validation",
            "category": "AI / ML & Data Science",
            "description": "Overfitting vs underfitting, train/validation/test splits, k-fold cross validation, L1/L2 regularization, and data leakage.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is 'Overfitting' in machine learning?",
                    "options": [
                        "When a model learns the training data and noise too well, performing exceptionally on training data but failing to generalize to unseen test data.",
                        "When a model is too simple to learn the underlying trend in the data.",
                        "When the computer runs out of physical hard drive space.",
                        "When a dataset has too many duplicate rows."
                    ],
                    "correctIndex": 0,
                    "explanation": "Overfitting occurs when a high-capacity model memorizes noise and specific quirks of the training sample instead of real general patterns."
                },
                {
                    "id": 2,
                    "question": "What is 'Underfitting'?",
                    "options": [
                        "When a model is too simple (high bias) to capture the underlying structure of the data, resulting in poor performance on both training and test data.",
                        "When a model has 100% accuracy on test data.",
                        "When data is stored on a small hard disk.",
                        "When a model is trained for too many epochs."
                    ],
                    "correctIndex": 0,
                    "explanation": "Underfitting occurs when a model lacks the complexity or capacity to learn the true patterns (e.g. fitting a straight line to quadratic data)."
                },
                {
                    "id": 3,
                    "question": "Why do we split data into separate Training, Validation, and Test sets?",
                    "options": [
                        "Train to learn parameters; Validation to tune hyperparameters and prevent overfitting; Test for unbiased final evaluation.",
                        "Because machine learning libraries will crash without 3 files.",
                        "To make the files smaller for email attachments.",
                        "To duplicate data across multiple servers."
                    ],
                    "correctIndex": 0,
                    "explanation": "Keeping a pure holdout test set that is never seen during training or hyperparameter tuning ensures an honest evaluation of real-world generalization."
                },
                {
                    "id": 4,
                    "question": "What is K-Fold Cross-Validation?",
                    "options": [
                        "Partitioning the dataset into k equal subsets, training on k-1 subsets and validating on the remaining 1 subset, repeated k times.",
                        "Folding the paper printout of the code k times.",
                        "Multiplying the dataset size by k.",
                        "Deleting k random rows from the table."
                    ],
                    "correctIndex": 0,
                    "explanation": "K-fold cross-validation ensures every data point gets tested once, providing a robust estimate of model stability and variance."
                },
                {
                    "id": 5,
                    "question": "What is Data Leakage (Target Leakage)?",
                    "options": [
                        "When information from outside the training dataset (or future information not available at prediction time) is inadvertently used to train the model.",
                        "When a hacker steals data over the internet.",
                        "When memory leaks cause a crash.",
                        "When hard drive sectors are corrupted."
                    ],
                    "correctIndex": 0,
                    "explanation": "Data leakage creates unrealistically optimistic validation metrics during development that catastrophically fail in real production."
                },
                {
                    "id": 6,
                    "question": "What is L1 Regularization (Lasso)?",
                    "options": [
                        "Adding the sum of the absolute values of the coefficients to the loss function, which can drive irrelevant feature weights strictly to zero.",
                        "Adding the sum of squared weights.",
                        "Multiplying weights by 10.",
                        "Deleting 10% of rows randomly."
                    ],
                    "correctIndex": 0,
                    "explanation": "L1 regularization performs automatic feature selection by penalizing absolute magnitude, driving non-essential feature weights to zero."
                },
                {
                    "id": 7,
                    "question": "What is L2 Regularization (Ridge)?",
                    "options": [
                        "Adding the sum of the squared coefficients to the loss function, shrinking weights toward zero without forcing them exactly to zero.",
                        "Subtracting the square root of features.",
                        "Dividing weights by 2.",
                        "Doubling the learning rate."
                    ],
                    "correctIndex": 0,
                    "explanation": "L2 regularization penalizes extreme weight values smoothly, preventing any single feature from dominating model predictions."
                },
                {
                    "id": 8,
                    "question": "Which of the following techniques directly HELPS prevent overfitting?",
                    "options": [
                        "Increasing training data, applying regularization, pruning decision trees, or using dropout.",
                        "Adding 1,000 irrelevant random features.",
                        "Training a complex neural network for 500 unnecessary epochs.",
                        "Removing the test dataset."
                    ],
                    "correctIndex": 0,
                    "explanation": "Gathering more data, simplifying model complexity, applying weight penalties (L1/L2), and early stopping all mitigate overfitting."
                },
                {
                    "id": 9,
                    "question": "What is Dropout in deep learning neural networks?",
                    "options": [
                        "A regularization technique where randomly selected neurons are temporarily ignored (dropped out) during each training iteration.",
                        "Students dropping out of computer science courses.",
                        "Dropping rows with null values.",
                        "Disconnecting the internet cable during training."
                    ],
                    "correctIndex": 0,
                    "explanation": "Dropout prevents co-adaptation of neurons by forcing the network to learn redundant, robust internal representations."
                },
                {
                    "id": 10,
                    "question": "If training error is 1.5% but validation error is 28.0%, what condition is the model exhibiting?",
                    "options": ["Severe Overfitting (High Variance)", "Severe Underfitting (High Bias)", "Optimal Balance", "Zero Variance"],
                    "correctIndex": 0,
                    "explanation": "A massive gap between low training error and high validation error is the hallmark signature of overfitting."
                },
                {
                    "id": 11,
                    "question": "If both training error (35%) and validation error (37%) are unacceptably high, what is the model exhibiting?",
                    "options": ["Underfitting (High Bias)", "Overfitting (High Variance)", "Data Leakage", "Perfect Fit"],
                    "correctIndex": 0,
                    "explanation": "When a model fails to achieve low error even on its own training set, it is underfitting and needs more capacity/features."
                },
                {
                    "id": 12,
                    "question": "What is Stratified K-Fold Cross-Validation?",
                    "options": [
                        "A cross-validation variation where each fold preserves the exact percentage of samples for each class as the complete dataset.",
                        "Splitting data based on geographic regions.",
                        "Sorting data before splitting.",
                        "A method that skips cross-validation."
                    ],
                    "correctIndex": 0,
                    "explanation": "Stratification ensures that imbalanced target classes are proportionately represented across every training and validation split."
                },
                {
                    "id": 13,
                    "question": "Why should feature scaling (e.g. StandardScaler) be fit ONLY on the training set and not on the whole dataset prior to splitting?",
                    "options": [
                        "To prevent data leakage (information from the test set influencing the mean and standard deviation of the training pipeline).",
                        "Because the computer will run out of memory.",
                        "Because the test set does not have numbers.",
                        "There is no reason; scaling on the full dataset is encouraged."
                    ],
                    "correctIndex": 0,
                    "explanation": "Fitting scalers or imputers on the full dataset leaks test set distribution statistics into the training process."
                },
                {
                    "id": 14,
                    "question": "What is Tree Pruning in Decision Trees?",
                    "options": [
                        "Removing branches that provide little power to classify instances, reducing tree depth to prevent overfitting.",
                        "Cutting down trees to make paper manuals.",
                        "Deleting the root node.",
                        "Converting a decision tree into a neural net."
                    ],
                    "correctIndex": 0,
                    "explanation": "Pruning trims deep, leaf-heavy branches that capture noise, improving generalization to unseen data."
                },
                {
                    "id": 15,
                    "question": "What is a Learning Curve in machine learning diagnostics?",
                    "options": [
                        "A plot of training and validation loss/accuracy as a function of training iterations or training sample size.",
                        "A chart showing student grades over a semester.",
                        "The time taken to learn Python.",
                        "A curved line drawn by an artist."
                    ],
                    "correctIndex": 0,
                    "explanation": "Learning curves visualize how performance evolves, clearly indicating whether a model suffers from high bias or high variance."
                },
                {
                    "id": 16,
                    "question": "In scikit-learn, what does 'train_test_split(X, y, test_size=0.2, random_state=42)' do?",
                    "options": [
                        "Splits data into 80% training and 20% testing sets with a reproducible random seed (42).",
                        "Deletes 20% of data permanently.",
                        "Trains the model 42 times.",
                        "Splits data into 42 separate files."
                    ],
                    "correctIndex": 0,
                    "explanation": "random_state ensures deterministic pseudo-random shuffling so the exact same split is produced across runs."
                },
                {
                    "id": 17,
                    "question": "What is Data Augmentation and how does it affect overfitting?",
                    "options": [
                        "Artificially increasing the diversity of training data (e.g. flipping, rotating images), which reduces overfitting.",
                        "Inventing fake test metrics.",
                        "Deleting real data.",
                        "Buying more servers."
                    ],
                    "correctIndex": 0,
                    "explanation": "Data augmentation exposes the model to realistic variations, acting as a powerful regularizer against memorization."
                },
                {
                    "id": 18,
                    "question": "What is the consequence of evaluating a model on the same data it was trained on?",
                    "options": [
                        "The evaluation metric is overly optimistic and completely fails to assess whether the model will generalize to real-world data.",
                        "The computer will catch fire.",
                        "The model becomes 100% accurate forever.",
                        "The training process runs twice as fast."
                    ],
                    "correctIndex": 0,
                    "explanation": "Evaluating on training data tests memorization, not prediction; independent validation data is mandatory."
                },
                {
                    "id": 19,
                    "question": "What is ElasticNet Regularization?",
                    "options": [
                        "A linear combination of both L1 (Lasso) and L2 (Ridge) penalties in the loss function.",
                        "A physical rubber band around a server.",
                        "An algorithm that stretches dataset size.",
                        "An internet connectivity protocol."
                    ],
                    "correctIndex": 0,
                    "explanation": "ElasticNet balances the sparsity of L1 regularization with the stability of L2 regularization."
                },
                {
                    "id": 20,
                    "question": "How does increasing the number of training examples typically impact the gap between training and validation error?",
                    "options": [
                        "It narrows the gap, helping the model generalize better and mitigating overfitting.",
                        "It widens the gap indefinitely.",
                        "It forces training error to zero.",
                        "It has zero impact on variance."
                    ],
                    "correctIndex": 0,
                    "explanation": "More diverse training data constrains the model from memorizing specific samples, narrowing the gap between training and test loss."
                }
            ]
        }
    ]
