"""
Builds complete 20 skills x 20 questions = 400 MCQ dataset for SkillNav Prepare & Practice module.
Loads existing fresher_catalog.json, updates test_categories and skill_quizzes, and validates.
"""

import json
import os

CATALOG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "fresher_catalog.json"))

def get_all_quizzes():
    quizzes = [
        # 1. SQL basics
        {
            "id": "sql-basics",
            "name": "SQL basics",
            "displayName": "SQL Basics & Relational Queries",
            "category": "Databases & Backend",
            "description": "DDL/DML queries, SELECT filters, JOIN operations, GROUP BY, aggregations, and constraints.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "Which SQL keyword is used to retrieve only unique values from a column?",
                    "options": ["DISTINCT", "UNIQUE", "DIFFERENT", "FILTER"],
                    "correctIndex": 0,
                    "explanation": "SELECT DISTINCT removes duplicate rows from the query output."
                },
                {
                    "id": 2,
                    "question": "Which SQL clause is used to filter records after an aggregate function (e.g., COUNT or SUM) is computed?",
                    "options": ["WHERE", "HAVING", "GROUP FILTER", "ORDER BY"],
                    "correctIndex": 1,
                    "explanation": "HAVING filters groups created by GROUP BY; WHERE filters rows before aggregation."
                },
                {
                    "id": 3,
                    "question": "Which type of JOIN returns all records from the left table and matched records from the right table?",
                    "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
                    "correctIndex": 1,
                    "explanation": "LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table and matched rows from the right table (NULL if no match)."
                },
                {
                    "id": 4,
                    "question": "What is the difference between DELETE and TRUNCATE in SQL?",
                    "options": [
                        "DELETE removes the table structure; TRUNCATE only removes rows.",
                        "TRUNCATE is a DDL command that resets identity counters and cannot be selectively filtered by a WHERE clause; DELETE is DML and can use WHERE.",
                        "TRUNCATE cannot be rolled back under any circumstance, whereas DELETE cannot be logged.",
                        "Both perform identical physical page reclamation in all relational engines."
                    ],
                    "correctIndex": 1,
                    "explanation": "TRUNCATE quickly empties a table by deallocating pages and does not accept a WHERE clause; DELETE deletes rows one by one and accepts WHERE."
                },
                {
                    "id": 5,
                    "question": "Which SQL constraint uniquely identifies each row in a database table and disallows NULL values?",
                    "options": ["FOREIGN KEY", "UNIQUE", "PRIMARY KEY", "CHECK"],
                    "correctIndex": 2,
                    "explanation": "A PRIMARY KEY uniquely identifies each record in a table and must not contain NULL values."
                },
                {
                    "id": 6,
                    "question": "What does the SQL command 'ROLLBACK' do during a transaction?",
                    "options": [
                        "Permanently saves all pending changes to the disk.",
                        "Undoes all changes made within the current uncommitted transaction.",
                        "Restores the database to its initial installation state.",
                        "Deletes the latest index created."
                    ],
                    "correctIndex": 1,
                    "explanation": "ROLLBACK reverts all database modifications made within the active transaction prior to a COMMIT."
                },
                {
                    "id": 7,
                    "question": "Which wildcard character in SQL LIKE operator represents zero, one, or multiple characters?",
                    "options": ["_", "%", "*", "?"],
                    "correctIndex": 1,
                    "explanation": "In SQL LIKE clauses, '%' matches zero or more characters; '_' matches exactly one character."
                },
                {
                    "id": 8,
                    "question": "Which aggregate function calculates the total number of non-null rows matching a criteria?",
                    "options": ["SUM()", "COUNT()", "TOTAL()", "AVG()"],
                    "correctIndex": 1,
                    "explanation": "COUNT(column) counts non-null occurrences of that column; COUNT(*) counts all matching rows."
                },
                {
                    "id": 9,
                    "question": "How do you sort a query result in descending order by the 'created_at' column?",
                    "options": ["ORDER BY created_at DESC", "SORT BY created_at DESC", "GROUP BY created_at DOWN", "FILTER BY created_at DESCENDING"],
                    "correctIndex": 0,
                    "explanation": "ORDER BY column_name DESC sorts results from highest to lowest."
                },
                {
                    "id": 10,
                    "question": "What is the primary function of a database INDEX?",
                    "options": [
                        "To enforce referential integrity between parent and child tables.",
                        "To accelerate data retrieval operations (SELECTs) at the expense of slower write operations.",
                        "To compress disk storage by 50%.",
                        "To automatically encrypt sensitive database columns."
                    ],
                    "correctIndex": 1,
                    "explanation": "An index (such as B-Tree) provides fast lookups without scanning every row, though it requires overhead during INSERT/UPDATE/DELETE."
                },
                {
                    "id": 11,
                    "question": "What will the expression 'SELECT NULL = NULL' evaluate to in SQL standard?",
                    "options": ["TRUE", "FALSE", "UNKNOWN / NULL", "ERROR"],
                    "correctIndex": 2,
                    "explanation": "In three-valued SQL logic, NULL cannot equal NULL; you must use 'IS NULL' or 'IS NOT NULL'."
                },
                {
                    "id": 12,
                    "question": "Which SQL keyword is used to restrict the number of rows returned in PostgreSQL and MySQL?",
                    "options": ["TOP", "LIMIT", "ROWNUM", "RESTRICT"],
                    "correctIndex": 1,
                    "explanation": "LIMIT specifies the maximum number of rows to return (e.g., LIMIT 10)."
                },
                {
                    "id": 13,
                    "question": "What is a FOREIGN KEY used for?",
                    "options": [
                        "Connecting to an external cloud database server.",
                        "Enforcing referential integrity by linking a column to the primary key of another table.",
                        "Storing international currency values.",
                        "Automatically converting character sets."
                    ],
                    "correctIndex": 1,
                    "explanation": "A FOREIGN KEY ensures that values in a child table match an existing valid primary key in the referenced parent table."
                },
                {
                    "id": 14,
                    "question": "What is the difference between UNION and UNION ALL?",
                    "options": [
                        "UNION eliminates duplicate rows; UNION ALL includes all rows including duplicates.",
                        "UNION only works with numbers; UNION ALL works with strings.",
                        "UNION ALL is slower because it sorts data in memory.",
                        "There is no functional difference between them."
                    ],
                    "correctIndex": 0,
                    "explanation": "UNION performs an internal distinct sorting operation to eliminate duplicate rows, while UNION ALL simply concatenates result sets without deduplication."
                },
                {
                    "id": 15,
                    "question": "Which DML statement is used to modify existing data in a table?",
                    "options": ["ALTER", "MODIFY", "UPDATE", "CHANGE"],
                    "correctIndex": 2,
                    "explanation": "UPDATE table_name SET col = val WHERE condition is used to modify existing row values."
                },
                {
                    "id": 16,
                    "question": "What is the result of applying GROUP BY on a column?",
                    "options": [
                        "It groups identical column values into summary rows so aggregate functions can be applied.",
                        "It permanently re-sorts table rows on the disk storage.",
                        "It deletes all rows that have duplicate keys.",
                        "It creates a virtual foreign key relationship."
                    ],
                    "correctIndex": 0,
                    "explanation": "GROUP BY summarizes rows with identical values into single rows for computing aggregates like COUNT, SUM, or AVG."
                },
                {
                    "id": 17,
                    "question": "Which clause is used to combine conditions where AT LEAST ONE condition must be true?",
                    "options": ["AND", "OR", "BOTH", "EITHER"],
                    "correctIndex": 1,
                    "explanation": "OR evaluates to true if either condition is true."
                },
                {
                    "id": 18,
                    "question": "What does ACID stand for in database management systems?",
                    "options": [
                        "Atomicity, Consistency, Isolation, Durability",
                        "Accuracy, Concurrency, Indexing, Data",
                        "Availability, Consistency, Integrity, Durability",
                        "Asynchronous, Coherent, Isolated, Distributed"
                    ],
                    "correctIndex": 0,
                    "explanation": "ACID properties (Atomicity, Consistency, Isolation, Durability) guarantee reliable transaction processing in relational databases."
                },
                {
                    "id": 19,
                    "question": "What is a SQL View?",
                    "options": [
                        "A physical copy of table data stored in RAM.",
                        "A virtual table based on the result-set of a stored SQL query.",
                        "A tool used only for generating graphical charts.",
                        "An encrypted backup file on cloud storage."
                    ],
                    "correctIndex": 1,
                    "explanation": "A View contains no physical data of its own; it dynamically executes a predefined query whenever referenced."
                },
                {
                    "id": 20,
                    "question": "Which SQL statement is used to remove an entire table including its schema and definitions from the database?",
                    "options": ["DELETE TABLE", "DROP TABLE", "REMOVE TABLE", "TRUNCATE SCHEMA"],
                    "correctIndex": 1,
                    "explanation": "DROP TABLE table_name permanently removes both the data and the table definition from the database catalog."
                }
            ]
        },

        # 2. HTTP & REST
        {
            "id": "http-rest",
            "name": "HTTP & REST",
            "displayName": "HTTP Protocol & RESTful API Architecture",
            "category": "Backend & Networking",
            "description": "HTTP verbs, response status codes, statelessness, headers, idempotency, and RESTful resource modeling.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "Which HTTP status code should be returned when a new resource is successfully created via a POST request?",
                    "options": ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
                    "correctIndex": 1,
                    "explanation": "201 Created is the standard HTTP response indicating successful resource creation."
                },
                {
                    "id": 2,
                    "question": "What does it mean for an HTTP method to be 'idempotent'?",
                    "options": [
                        "The method cannot be cached by intermediate proxies.",
                        "Executing the request multiple times produces the exact same server state as executing it once.",
                        "The request must always return an empty response body.",
                        "The request can only be transmitted over HTTPS."
                    ],
                    "correctIndex": 1,
                    "explanation": "An idempotent method (like GET, PUT, DELETE) can be called multiple times without altering the final server state beyond the initial call."
                },
                {
                    "id": 3,
                    "question": "What is the primary architectural difference between PUT and PATCH in RESTful APIs?",
                    "options": [
                        "PUT replaces the entire resource representation; PATCH applies partial modifications.",
                        "PATCH is idempotent whereas PUT is non-idempotent.",
                        "PUT cannot include a request body; PATCH requires URL parameters.",
                        "PATCH is only supported in HTTP/3."
                    ],
                    "correctIndex": 0,
                    "explanation": "PUT represents a full replacement of the resource; PATCH applies partial updates to specific fields."
                },
                {
                    "id": 4,
                    "question": "Which HTTP status code represents 'Unauthorized' (authentication required or invalid credentials)?",
                    "options": ["400", "401", "403", "404"],
                    "correctIndex": 1,
                    "explanation": "401 Unauthorized indicates that the request lacks valid authentication credentials for the target resource."
                },
                {
                    "id": 5,
                    "question": "What is the key difference between status codes 401 Unauthorized and 403 Forbidden?",
                    "options": [
                        "401 means the client identity is not authenticated; 403 means the identity is known but lacks permission/authorization.",
                        "401 applies to GET requests; 403 applies to POST requests.",
                        "401 indicates server failure; 403 indicates client DNS failure.",
                        "They are interchangeable synonyms in the HTTP specification."
                    ],
                    "correctIndex": 0,
                    "explanation": "401 represents an authentication failure (who are you?), while 403 represents an authorization failure (you cannot access this resource)."
                },
                {
                    "id": 6,
                    "question": "What does HTTP 'statelessness' mean?",
                    "options": [
                        "The server retains client memory across requests without tokens.",
                        "Every request from client to server must contain all the information necessary to understand and process the request.",
                        "The server must not store any data in a relational database.",
                        "The API must run purely in serverless containers without disk."
                    ],
                    "correctIndex": 1,
                    "explanation": "In a stateless protocol, the server stores no session context about the client between requests; every request must carry its own authorization and state."
                },
                {
                    "id": 7,
                    "question": "Which HTTP response code indicates that an operation succeeded but returns no response body?",
                    "options": ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
                    "correctIndex": 2,
                    "explanation": "204 No Content confirms that the server has fulfilled the request and that there is no additional content to send in the payload."
                },
                {
                    "id": 8,
                    "question": "Which HTTP header is used by the client to inform the server of the media type of the request body being sent?",
                    "options": ["Accept", "Content-Type", "User-Agent", "Authorization"],
                    "correctIndex": 1,
                    "explanation": "Content-Type specifies the MIME type of the payload being transmitted (e.g., application/json)."
                },
                {
                    "id": 9,
                    "question": "Which HTTP header is sent by the client to indicate which content types it can understand in the response?",
                    "options": ["Accept", "Content-Type", "Content-Encoding", "Host"],
                    "correctIndex": 0,
                    "explanation": "The Accept request header advertises which content types the client is able to process (e.g., Accept: application/json)."
                },
                {
                    "id": 10,
                    "question": "What is CORS (Cross-Origin Resource Sharing)?",
                    "options": [
                        "A database clustering protocol for multi-region replication.",
                        "A browser security mechanism that allows or restricts resources requested from another origin.",
                        "An encryption standard replacing SSL certificates.",
                        "A load balancer algorithm for distributing traffic."
                    ],
                    "correctIndex": 1,
                    "explanation": "CORS is an HTTP-header based browser security mechanism allowing a server to indicate any origins other than its own from which a browser should permit loading resources."
                },
                {
                    "id": 11,
                    "question": "Which HTTP method should be used to safely read or retrieve data without causing side effects on the server?",
                    "options": ["GET", "POST", "DELETE", "PATCH"],
                    "correctIndex": 0,
                    "explanation": "GET is defined as a 'safe' method by RFC 7231, meaning it is intended only for information retrieval and causes no side effects."
                },
                {
                    "id": 12,
                    "question": "What status code category represents server-side errors?",
                    "options": ["2xx", "3xx", "4xx", "5xx"],
                    "correctIndex": 3,
                    "explanation": "5xx status codes (such as 500, 502, 503, 504) represent server-side internal errors."
                },
                {
                    "id": 13,
                    "question": "What is the recommended RESTful URL pattern for retrieving a specific book with ID 42 from a collection?",
                    "options": ["/get_book?id=42", "/books/42", "/bookAction/retrieve/42", "/books.php?select=42"],
                    "correctIndex": 1,
                    "explanation": "REST design uses plural nouns for collections and resource identifiers in the path: /books/{id}."
                },
                {
                    "id": 14,
                    "question": "What is the purpose of the HTTP 'ETag' header?",
                    "options": [
                        "Assigning a unique tracking identifier to every user.",
                        "An identifier for a specific version of a resource used for web cache validation and conditional requests.",
                        "Enforcing password complexity rules.",
                        "Compressing image assets in the payload."
                    ],
                    "correctIndex": 1,
                    "explanation": "An ETag (entity tag) allows caches to be more efficient and saves bandwidth when the content has not changed (via If-None-Match)."
                },
                {
                    "id": 15,
                    "question": "What status code is returned when a client sends an invalid request, such as malformed JSON syntax?",
                    "options": ["400 Bad Request", "404 Not Found", "405 Method Not Allowed", "500 Internal Server Error"],
                    "correctIndex": 0,
                    "explanation": "400 Bad Request indicates that the server cannot process the request due to perceived client error (e.g., malformed syntax)."
                },
                {
                    "id": 16,
                    "question": "What is the function of the HTTP 301 status code?",
                    "options": ["Temporary Redirect", "Moved Permanently", "Found", "See Other"],
                    "correctIndex": 1,
                    "explanation": "301 Moved Permanently tells clients and search engine crawlers that the target resource has been permanently assigned a new URI."
                },
                {
                    "id": 17,
                    "question": "Which HTTP method is specifically used during CORS preflight checks by web browsers?",
                    "options": ["HEAD", "OPTIONS", "TRACE", "CONNECT"],
                    "correctIndex": 1,
                    "explanation": "Browsers send an OPTIONS request before certain cross-origin requests to verify permitted methods and headers."
                },
                {
                    "id": 18,
                    "question": "What is the purpose of HTTP Query Parameters (e.g., /users?role=developer&page=2)?",
                    "options": [
                        "Filtering, sorting, and paginating collection resources.",
                        "Encrypting payload content.",
                        "Modifying the database schema.",
                        "Specifying the SSL cipher algorithm."
                    ],
                    "correctIndex": 0,
                    "explanation": "Query parameters are primarily used for searching, sorting, filtering, and paginating collection items."
                },
                {
                    "id": 19,
                    "question": "What status code should be returned when a requested route or endpoint does not exist?",
                    "options": ["401", "403", "404", "502"],
                    "correctIndex": 2,
                    "explanation": "404 Not Found indicates that the origin server did not find a current representation for the target resource."
                },
                {
                    "id": 20,
                    "question": "What is the primary difference between HTTP/1.1 and HTTP/2?",
                    "options": [
                        "HTTP/2 uses binary framing and multiplexing over a single TCP connection, eliminating head-of-line blocking.",
                        "HTTP/2 removes headers and only transmits raw bytes.",
                        "HTTP/2 requires relational SQL databases to operate.",
                        "HTTP/2 cannot transmit JSON objects."
                    ],
                    "correctIndex": 0,
                    "explanation": "HTTP/2 introduces binary framing and request/response multiplexing over a single TCP connection to drastically improve page load speed."
                }
            ]
        },

        # 3. Databases (relational vs NoSQL)
        {
            "id": "relational-vs-nosql",
            "name": "Databases (relational vs NoSQL)",
            "displayName": "Relational (SQL) vs NoSQL Databases",
            "category": "Databases & Architecture",
            "description": "ACID vs BASE, schema models, document vs key-value vs graph stores, normalization, scaling, and CAP theorem.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is the fundamental difference in data modeling between relational databases and Document NoSQL databases?",
                    "options": [
                        "Relational databases use rigid tabular schemas with foreign keys; Document NoSQL databases store semi-structured records (JSON/BSON).",
                        "NoSQL databases cannot store numbers.",
                        "Relational databases cannot perform mathematical queries.",
                        "Document databases do not permit reading data."
                    ],
                    "correctIndex": 0,
                    "explanation": "Relational DBs (PostgreSQL, MySQL, HANA) enforce schema tables with relations; Document DBs (MongoDB) store flexible JSON-like documents."
                },
                {
                    "id": 2,
                    "question": "What does the CAP theorem state regarding distributed data systems?",
                    "options": [
                        "A distributed data store can simultaneously provide at most two of: Consistency, Availability, and Partition Tolerance.",
                        "A database must always prioritize Speed over Accuracy.",
                        "Any database can provide 100% Consistency, Availability, and Partitioning simultaneously under network failure.",
                        "Cloud systems never experience network partitions."
                    ],
                    "correctIndex": 0,
                    "explanation": "The CAP theorem proves that in the event of a network partition (P), a distributed system must choose between Consistency (C) and Availability (A)."
                },
                {
                    "id": 3,
                    "question": "Which database type is Redis primarily categorized as?",
                    "options": ["In-memory Key-Value store", "Document Store", "Graph Database", "Relational OLAP Database"],
                    "correctIndex": 0,
                    "explanation": "Redis is an open-source, in-memory data structure store used primarily as a fast key-value cache and message broker."
                },
                {
                    "id": 4,
                    "question": "What type of NoSQL database is Neo4j?",
                    "options": ["Document Database", "Columnar Database", "Graph Database", "Key-Value Database"],
                    "correctIndex": 2,
                    "explanation": "Neo4j is a Graph database designed specifically for interconnected data models (nodes, relationships, properties)."
                },
                {
                    "id": 5,
                    "question": "What is 'Database Normalization' primarily intended to achieve in relational design?",
                    "options": [
                        "Minimize data redundancy and prevent insertion, update, and deletion anomalies.",
                        "Increase file size on disk for redundancy.",
                        "Convert all relational tables into raw JSON text.",
                        "Make all query operations unindexed."
                    ],
                    "correctIndex": 0,
                    "explanation": "Normalization organizes fields and tables to reduce duplicate data (redundancy) and prevent anomalies."
                },
                {
                    "id": 6,
                    "question": "What is Horizontal Scaling (Sharding) in database systems?",
                    "options": [
                        "Adding more CPU, RAM, or SSD to a single server instance.",
                        "Distributing data across multiple independent server nodes.",
                        "Converting table columns into rows.",
                        "Enforcing foreign key constraints on every column."
                    ],
                    "correctIndex": 1,
                    "explanation": "Horizontal scaling (scale-out / sharding) partitions data across multiple machines, whereas vertical scaling (scale-up) adds power to one machine."
                },
                {
                    "id": 7,
                    "question": "What does BASE stand for in NoSQL distributed architectures?",
                    "options": [
                        "Basically Available, Soft state, Eventual consistency",
                        "Binary Architecture, Synchronous Execution",
                        "Basic Access, Standard Encryption",
                        "Buffered Allocations, Scalable Entities"
                    ],
                    "correctIndex": 0,
                    "explanation": "BASE (Basically Available, Soft state, Eventual consistency) models trade immediate strong consistency for higher availability and partition tolerance."
                },
                {
                    "id": 8,
                    "question": "When is a NoSQL Document Store (like MongoDB) typically preferred over a strict relational database?",
                    "options": [
                        "When data structures are rapidly evolving and hierarchical/nested documents map naturally to application objects.",
                        "When processing double-entry financial accounting ledger transactions requiring multi-table strict foreign keys.",
                        "When database queries only involve mathematical matrix multiplication.",
                        "When data must strictly adhere to third normal form (3NF)."
                    ],
                    "correctIndex": 0,
                    "explanation": "Document databases excel when working with polymorphic, semi-structured, or rapidly evolving JSON payloads without migrations."
                },
                {
                    "id": 9,
                    "question": "What is a Read Replica used for?",
                    "options": [
                        "Handling write and delete operations exclusively.",
                        "Offloading read-heavy query traffic from the primary master database node.",
                        "Compressing backup files into zip format.",
                        "Managing user authorization sessions."
                    ],
                    "correctIndex": 1,
                    "explanation": "Read replicas replicate data from the primary node to serve read traffic asynchronously, preventing saturation of the write master."
                },
                {
                    "id": 10,
                    "question": "Which NoSQL category does Apache Cassandra belong to?",
                    "options": ["Wide-column / Column-family store", "Graph store", "Document store", "Relational database"],
                    "correctIndex": 0,
                    "explanation": "Apache Cassandra is a distributed wide-column store designed for massive write throughput across multi-datacenter clusters."
                },
                {
                    "id": 11,
                    "question": "What is 'Eventual Consistency'?",
                    "options": [
                        "The guarantee that if no new updates are made, all replicas will eventually return the latest value.",
                        "The guarantee that data will never be consistent across nodes.",
                        "A guarantee that every read operation is permanently blocked until written.",
                        "A concept found only in relational SQL databases."
                    ],
                    "correctIndex": 0,
                    "explanation": "Eventual consistency guarantees that all replicas will converge to the same value given sufficient time without updates."
                },
                {
                    "id": 12,
                    "question": "What is the main drawback of over-normalizing a relational database (e.g., beyond 3NF)?",
                    "options": [
                        "Queries require numerous complex JOIN operations, degrading read query performance.",
                        "The database can no longer store strings.",
                        "Foreign keys are permanently disabled.",
                        "The database cannot be backed up."
                    ],
                    "correctIndex": 0,
                    "explanation": "Excessive normalization splits data into many small tables, requiring expensive multi-table JOINs for simple read lookups."
                },
                {
                    "id": 13,
                    "question": "What is Denormalization?",
                    "options": [
                        "Purposely introducing redundancy into a database to optimize read performance and reduce JOINs.",
                        "Corrupting the database index files.",
                        "Deleting all primary keys in a table.",
                        "Converting relational schemas into raw text files."
                    ],
                    "correctIndex": 0,
                    "explanation": "Denormalization deliberately combines data to improve read query performance at the cost of some write redundancy."
                },
                {
                    "id": 14,
                    "question": "What is a Database Transaction?",
                    "options": [
                        "A sequence of database operations treated as a single indivisible unit of work.",
                        "A monetary fee paid to a cloud provider per query.",
                        "A single SELECT query with no parameters.",
                        "A network packet sent between client and server."
                    ],
                    "correctIndex": 0,
                    "explanation": "A transaction bundles multiple operations so they either all succeed together or all fail together (Atomicity)."
                },
                {
                    "id": 15,
                    "question": "What is Connection Pooling in database architectures?",
                    "options": [
                        "Maintaining a cache of open database connections that can be reused for subsequent requests.",
                        "Connecting two separate databases using a network cable.",
                        "Merging all user queries into a single SQL file.",
                        "Storing database backups in a shared data lake."
                    ],
                    "correctIndex": 0,
                    "explanation": "Connection pooling avoids the significant latency and resource overhead of establishing a new TCP/TLS connection for every single query."
                },
                {
                    "id": 16,
                    "question": "Which database model is optimal for social networks and recommendation engines showing mutual friendships?",
                    "options": ["Graph Database", "Flat File CSV", "Key-Value Store", "Relational Database with 20 JOINs"],
                    "correctIndex": 0,
                    "explanation": "Graph databases (like Neo4j) traverse relationships (edges) between entities (nodes) in constant time without multi-table JOIN bottlenecks."
                },
                {
                    "id": 17,
                    "question": "What is 'Schema-on-Read'?",
                    "options": [
                        "Data is stored in raw format, and the structure is applied only when the data is read by an application.",
                        "Data must strictly conform to a predefined schema before being inserted into disk.",
                        "The database reads the schema every millisecond to update indexes.",
                        "A technique exclusive to SQLite."
                    ],
                    "correctIndex": 0,
                    "explanation": "Schema-on-read formats raw data dynamically during query execution (typical of data lakes and NoSQL), unlike schema-on-write (RDBMS)."
                },
                {
                    "id": 18,
                    "question": "What is Database Sharding?",
                    "options": [
                        "Partitioning a very large database horizontally across multiple servers based on a shard key.",
                        "Compressing table data into smaller disk blocks.",
                        "Encrypting data using hash algorithms.",
                        "Rebuilding primary keys after server restart."
                    ],
                    "correctIndex": 0,
                    "explanation": "Sharding distributes rows of a table across multiple database nodes based on a partition/shard key."
                },
                {
                    "id": 19,
                    "question": "What does 'Time-to-Live' (TTL) in a Key-Value database (e.g. Redis) indicate?",
                    "options": [
                        "The time duration before a key is automatically expired and deleted from memory.",
                        "The lifespan of the physical server hardware.",
                        "The network latency round-trip time.",
                        "The time taken to write a backup to disk."
                    ],
                    "correctIndex": 0,
                    "explanation": "TTL configures a lifespan after which a key automatically expires, ideal for session tokens and caching."
                },
                {
                    "id": 20,
                    "question": "Which relational database engine is embedded directly into client applications without a standalone server daemon?",
                    "options": ["SQLite", "PostgreSQL", "Oracle 21c", "Microsoft SQL Server"],
                    "correctIndex": 0,
                    "explanation": "SQLite is a lightweight, serverless, self-contained SQL database engine embedded directly into mobile and desktop applications."
                }
            ]
        },

        # 4. Cloud basics (IaaS/PaaS/SaaS)
        {
            "id": "cloud-basics",
            "name": "Cloud basics (IaaS/PaaS/SaaS)",
            "displayName": "Cloud Fundamentals (IaaS, PaaS, SaaS & Shared Responsibility)",
            "category": "Cloud & Infrastructure",
            "description": "Cloud service models, Capex vs Opex, shared responsibility, regions, availability zones, and virtualization.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "Which cloud service model provides virtualized computing resources (virtual machines, storage, and networks) where the customer manages the OS, middleware, and applications?",
                    "options": ["SaaS", "PaaS", "IaaS", "FaaS"],
                    "correctIndex": 2,
                    "explanation": "Infrastructure as a Service (IaaS, e.g. Amazon EC2, Azure VMs, Google Compute Engine) leaves OS and application management to the user."
                },
                {
                    "id": 2,
                    "question": "Which cloud model allows developers to deploy code without managing the underlying operating system, server hardware, or runtime patches?",
                    "options": ["IaaS", "PaaS", "Hardware as a Service", "On-Premises Data Center"],
                    "correctIndex": 1,
                    "explanation": "Platform as a Service (PaaS, e.g. SAP BTP, Heroku, AWS Elastic Beanstalk) manages the OS, runtime, and infrastructure so developers only focus on code."
                },
                {
                    "id": 3,
                    "question": "Which category does Google Workspace, Microsoft 365, or Salesforce represent?",
                    "options": ["IaaS", "PaaS", "SaaS", "BaaS"],
                    "correctIndex": 2,
                    "explanation": "Software as a Service (SaaS) delivers complete end-user software applications managed entirely by the provider."
                },
                {
                    "id": 4,
                    "question": "What is the Shared Responsibility Model in cloud computing?",
                    "options": [
                        "The division of security and operational responsibilities between the cloud provider and the cloud customer.",
                        "Sharing cloud subscription costs among multiple employees.",
                        "A contract where two competing cloud vendors share the same physical server.",
                        "Requiring two passwords to access the cloud console."
                    ],
                    "correctIndex": 0,
                    "explanation": "The provider is responsible for security 'of' the cloud (hardware, facilities); the customer is responsible for security 'in' the cloud (data, access, configuration)."
                },
                {
                    "id": 5,
                    "question": "What financial transition does cloud computing enable by replacing upfront data center purchases with pay-as-you-go pricing?",
                    "options": [
                        "Shifting from CapEx (Capital Expenditure) to OpEx (Operational Expenditure).",
                        "Shifting from OpEx to CapEx.",
                        "Eliminating all operational costs permanently.",
                        "Converting taxes into hardware assets."
                    ],
                    "correctIndex": 0,
                    "explanation": "Cloud models reduce large upfront Capital Expenditures (CapEx) on servers and replace them with variable, ongoing Operational Expenditures (OpEx)."
                },
                {
                    "id": 6,
                    "question": "What is a Cloud Availability Zone (AZ)?",
                    "options": [
                        "One or more discrete physical data centers with redundant power, networking, and cooling within a geographic Region.",
                        "The entire continent where a cloud provider operates.",
                        "A software container deployed on a client laptop.",
                        "A backup hard drive stored in a vault."
                    ],
                    "correctIndex": 0,
                    "explanation": "An Availability Zone is an isolated data center location within a Region engineered to be resilient against local failures."
                },
                {
                    "id": 7,
                    "question": "What is Cloud Elasticity?",
                    "options": [
                        "The ability to dynamically scale computing resources up or down automatically based on real-time workload demands.",
                        "The physical flexibility of server cables.",
                        "The capacity to run code on any operating system without changes.",
                        "An SLA metric for network cables."
                    ],
                    "correctIndex": 0,
                    "explanation": "Elasticity allows systems to automatically adapt capacity to match current demand, avoiding over-provisioning or downtime."
                },
                {
                    "id": 8,
                    "question": "What is a 'Public Cloud'?",
                    "options": [
                        "Cloud infrastructure owned and operated by a third-party provider, delivering computing resources over the public internet to multiple tenants.",
                        "A government-only supercomputer accessible to all citizens.",
                        "A computer network with zero password protection.",
                        "A free website hosting platform with no commercial services."
                    ],
                    "correctIndex": 0,
                    "explanation": "Public clouds (AWS, Azure, GCP, SAP) share pooled hardware across multiple customer organizations securely via virtualization."
                },
                {
                    "id": 9,
                    "question": "What is a 'Hybrid Cloud' architecture?",
                    "options": [
                        "An environment combining on-premises private infrastructure with one or more public cloud services, connected seamlessly.",
                        "A data center powered exclusively by wind and solar power.",
                        "An app running on both Android and iOS.",
                        "A computer with two CPU processors."
                    ],
                    "correctIndex": 0,
                    "explanation": "A hybrid cloud binds on-premises private data centers with public cloud infrastructure for workload mobility and data governance."
                },
                {
                    "id": 10,
                    "question": "Under the IaaS shared responsibility model, who is responsible for applying operating system security patches to a virtual machine?",
                    "options": ["The cloud customer", "The cloud provider", "The hardware manufacturer", "The internet service provider"],
                    "correctIndex": 0,
                    "explanation": "In IaaS, the customer chooses and controls the guest operating system, making OS-level security patching the customer's responsibility."
                },
                {
                    "id": 11,
                    "question": "What is 'Multi-Tenancy' in cloud architecture?",
                    "options": [
                        "A single physical instance of software and hardware serving multiple separate customer organizations (tenants) with logical isolation.",
                        "A user having multiple cloud passwords.",
                        "A tenant renting multiple physical buildings.",
                        "Deploying a separate physical server for every individual user."
                    ],
                    "correctIndex": 0,
                    "explanation": "Multi-tenancy allows cloud systems to share underlying hardware across multiple distinct customers while maintaining strict data isolation."
                },
                {
                    "id": 12,
                    "question": "What is Serverless Computing (Function-as-a-Service / FaaS)?",
                    "options": [
                        "Execution of code where the cloud provider dynamically manages server provisioning, scaling, and billing occurs strictly per invocation/millisecond.",
                        "Computing that does not use any physical computers in the universe.",
                        "A server running with no operating system.",
                        "A private mainframe installed in an office basement."
                    ],
                    "correctIndex": 0,
                    "explanation": "In serverless (e.g. AWS Lambda, Google Cloud Functions), developers write event-driven code without provisioning servers, paying only for execution time."
                },
                {
                    "id": 13,
                    "question": "What is a Cloud Region?",
                    "options": [
                        "A distinct geographic area containing multiple, isolated Availability Zones interconnected by low-latency networks.",
                        "A single server rack in a computer room.",
                        "An entire country with one data center.",
                        "A software license jurisdiction."
                    ],
                    "correctIndex": 0,
                    "explanation": "A Region (e.g., us-east-1, eu-central-1) represents a physical geographic zone containing several isolated data centers (AZs)."
                },
                {
                    "id": 14,
                    "question": "What is the primary benefit of deploying an application across Multi-Availability Zones (Multi-AZ)?",
                    "options": [
                        "High availability and fault tolerance against data center outages.",
                        "Reducing network bandwidth to zero.",
                        "Eliminating the need for software testing.",
                        "Making code run twice as fast automatically."
                    ],
                    "correctIndex": 0,
                    "explanation": "Multi-AZ deployment ensures that if a fire, flood, or power loss impacts one data center, the secondary AZ takes over traffic immediately."
                },
                {
                    "id": 15,
                    "question": "Which metric in a Cloud Service Level Agreement (SLA) measures 'five nines' availability?",
                    "options": ["99.999% uptime (less than 5.26 minutes downtime per year)", "95.555% uptime", "99.9% uptime (8.76 hours downtime)", "90% uptime"],
                    "correctIndex": 0,
                    "explanation": "'Five nines' (99.999%) represents high-availability enterprise tolerance permitting at most ~5 minutes of unscheduled outage per year."
                },
                {
                    "id": 16,
                    "question": "What is Cloud Vendor Lock-In?",
                    "options": [
                        "The difficulty and expense of migrating applications and data from one cloud provider to another due to proprietary APIs and services.",
                        "Being locked out of a cloud account due to forgotten password.",
                        "A physical door lock on server cages.",
                        "An annual maintenance contract with no software updates."
                    ],
                    "correctIndex": 0,
                    "explanation": "Vendor lock-in occurs when an organization heavily uses proprietary features of a single vendor that are incompatible with competitors."
                },
                {
                    "id": 17,
                    "question": "What role does a Hypervisor play in cloud virtualization?",
                    "options": [
                        "Software that creates and runs multiple virtual machines by sharing physical host hardware resources.",
                        "A network router that connects internet cables.",
                        "A specialized monitor for system administrators.",
                        "An encryption key generator for cloud storage."
                    ],
                    "correctIndex": 0,
                    "explanation": "A hypervisor (e.g., KVM, VMware ESXi, Hyper-V) isolates and manages virtual machines on physical host hardware."
                },
                {
                    "id": 18,
                    "question": "Which cloud computing deployment model is operated solely for a single organization, whether managed internally or by a third party?",
                    "options": ["Private Cloud", "Public Cloud", "Community Cloud", "Social Cloud"],
                    "correctIndex": 0,
                    "explanation": "A Private Cloud provides dedicated infrastructure solely for one organization, often for regulatory or compliance requirements."
                },
                {
                    "id": 19,
                    "question": "Under SaaS (Software as a Service), what is the customer responsible for managing?",
                    "options": ["Customer data and user access permissions", "Operating system kernel updates", "Physical network switches", "Data center cooling"],
                    "correctIndex": 0,
                    "explanation": "In SaaS, the vendor manages infrastructure, operating systems, and application code; the customer only configures user access and their own data."
                },
                {
                    "id": 20,
                    "question": "What is Cloud FinOps?",
                    "options": [
                        "The operational and cultural framework of bringing financial accountability to the variable spend model of cloud computing.",
                        "A financial software tool for filing taxes.",
                        "A crypto-currency used for cloud bills.",
                        "A banking institution specializing in technology loans."
                    ],
                    "correctIndex": 0,
                    "explanation": "FinOps combines engineering, finance, and business teams to optimize cloud costs and maintain budgetary governance."
                }
            ]
        }
    ]

    # Return initial 4 core, and we will append the other 16 modularly
    return quizzes

def load_or_update_all_quizzes():
    print(f"Loading catalog from {CATALOG_PATH}...")
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    # We will build the full 20 skills dictionary
    # Import the remaining 16 modules
    import generate_all_20_skills
    all_20_quizzes = generate_all_20_skills.build_complete_20_quizzes()

    print(f"Total categories built: {len(all_20_quizzes)}")
    total_q = sum(len(q["questions"]) for q in all_20_quizzes)
    print(f"Total questions built: {total_q} (Target: 400 questions)")

    # Validate all 20 skills have exactly 20 questions
    for idx, quiz in enumerate(all_20_quizzes, 1):
        q_count = len(quiz["questions"])
        print(f"  [{idx:02d}/20] {quiz['name']}: {q_count} questions")
        assert q_count == 20, f"Skill '{quiz['name']}' has {q_count} questions, expected 20!"
        for q in quiz["questions"]:
            assert "question" in q and len(q["question"]) > 5
            assert "options" in q and len(q["options"]) == 4
            assert "correctIndex" in q and q["correctIndex"] in (0, 1, 2, 3)
            assert "explanation" in q and len(q["explanation"]) > 5

    # Update fresher_catalog.json with test_categories
    catalog["test_categories"] = all_20_quizzes
    catalog["skill_quizzes"] = all_20_quizzes

    # Also update skills array if needed
    catalog["skills_20"] = [q["name"] for q in all_20_quizzes]

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)

    print(f"Successfully saved {len(all_20_quizzes)} categories ({total_q} questions) into {CATALOG_PATH}!")

if __name__ == "__main__":
    load_or_update_all_quizzes()
