SO API
====

Unofficial Stack Overflow API to retrieve questions on different topics built using node.js and cheerio.js.


Usage
====

**Output:** JSON

### Get questions based on specific sort

#### `GET /newest  /featured  /frequent  /unanswered`

Example Query:

```
http://localhost:3000/newest
```

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tag` | string | Returns questions in the specified sort for the given tag |

Example Query:

```
http://localhost:3000/newest/java
```

**Query Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `max` | integer | Returns at most this many stories. Default is 10. |

Example Query:

```
http://localhost:3000/newest/java?max=30
```

### Example Response

