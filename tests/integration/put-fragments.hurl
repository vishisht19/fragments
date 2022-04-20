# tests/integration/put-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
[Captures]
url: header "Location"

# 2. Try to PUT new data in the fragment we just posted by its URL
PUT {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a new fragment!```

HTTP/1.1 200

# 3.
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "This is a new fragment!"
