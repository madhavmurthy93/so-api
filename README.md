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

{
  "count": 2,
  "questions": [
    {
      "question": "Unknown issue in a indexOf?",
      "question-id": "26665723",
      "link": "http://www.stackoverflow.com/questions/26665723",
      "views": "3",
      "answers": "0",
      "votes": "0",
      "tags": "javascript jquery",
      "asker": "GEspinha",
      "time": "2014-10-31 00:32:53",
      "reputation-score": "1,159"
    },
    {
      "question": "Calling Method with Arrays Pass To Them In Java",
      "question-id": "26665714",
      "link": "http://www.stackoverflow.com/questions/26665714",
      "views": "7",
      "answers": "0",
      "votes": "0",
      "tags": "java arrays parameters arguments",
      "asker": "user3692506",
      "time": "2014-10-31 00:31:35",
      "reputation-score": "7"
    }
  ]
}
