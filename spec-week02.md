Version 1
Feature 1: Book CRUD Operations and Author References
Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.
Data Model
Book documents will be stored in the books collection.

Required book fields:
- id: string, required, custom id such as b1
- authorId: string, required, references the id field of an author document
- title: string, required
- publicationDate: string, required
Books will continue to use custom string ids instead of MongoDB _id values for route parameters.
Relationship to Authors
Each book will identify its author with an authorId field. The value of authorId must match the custom id value of an existing author document.

When creating or updating a book, the API should reject the request with a 400 status code if the submitted authorId does not match an existing author.
Routes
GET /books
Purpose: Return all books.

Success:
- Status code: 200
- Response body: an array of book objects
Errors:
- 500 if an unexpected server or database error occurs
GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: 200
- Response body: the matching book object
Errors:
- 404 if no book exists with that id
- 500 if an unexpected server or database error occurs
POST /books
Purpose: Create a new book.

Request body:
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
Success:
- Status code: 201
- Response body: the newly created book object
Errors:
- 400 if a required field is missing
- 400 if the id already exists
- 400 if the authorId does not match an existing author
- 500 if an unexpected server or database error occurs
PUT /books/:id
Purpose: Update an existing book.

Request body:
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
Success:
- Status code: 200
- Response body: the updated book object
Errors:
- 400 if a required field is missing
- 400 if the authorId does not match an existing author
- 404 if no book exists with that id
- 500 if an unexpected server or database error occurs
DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: 204
- Response body: none
Errors:
- 404 if no book exists with that id
- 500 if an unexpected server or database error occurs
Swagger Documentation
Swagger must document every book route.
Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at /api-docs must allow someone to test every book route from the browser.
Feature 2: Author CRUD Operations
Goal
Add an Authors API that stores author information in a MongoDB collection and supports all CRUD operations. Every author route must be documented and testable in Swagger.
Data Model
Author documents will be stored in the authors collection.

Required author fields:
- id: string, required, custom id such as a1
- name: string, required
- birthYear: number, required, representing the author's year of birth
Authors will use custom string ids instead of MongoDB _id values for route parameters.
Routes
GET /authors
Purpose: Return all authors.

Success:
- Status code: 200
- Response body: an array of author objects
Errors:
- 500 if an unexpected server or database error occurs
GET /authors/:id
Purpose: Return one author by the custom author id.

Success:
- Status code: 200
- Response body: the matching author object
Errors:
- 404 if no author exists with that id
- 500 if an unexpected server or database error occurs
POST /authors
Purpose: Create a new author.

Request body:
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1985
}
Success:
- Status code: 201
- Response body: the newly created author object
Errors:
- 400 if a required field is missing or invalid
- 400 if the id already exists
- 500 if an unexpected server or database error occurs
PUT /authors/:id
Purpose: Update an existing author.

Request body:
{
  "name": "Maya A. Rivera",
  "birthYear": 1986
}
Success:
- Status code: 200
- Response body: the updated author object
Errors:
- 400 if a required field is missing or invalid
- 404 if no author exists with that id
- 500 if an unexpected server or database error occurs
DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: 204
- Response body: none
Errors:
- 404 if no author exists with that id
- 409 if the author still has one or more books referencing the author
- 500 if an unexpected server or database error occurs
Relationship to Books
Each book refers to an author through the book's authorId field. Before deleting an author, the API must check whether any book has that author's custom id as its authorId. If books still reference the author, the API must reject the deletion with 409 and leave the author in the database.
Swagger Documentation
Swagger must document every author route, including its purpose, path parameter, request body where applicable, success responses, and error responses. Every route must be testable from Swagger UI.
Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at /api-docs must allow someone to test every author route from the browser.
Evaluation of Version 1
The Version 1 specifications describe the required features, but some details need to be made more precise before implementation.
1. Bugs or short-sighted decisions
- The publicationDate field is only described as a string. The API should define a consistent date format so clients send and receive dates predictably.
- The birthYear field should be a number representing a year, not free-form text.
- The specifications should state exactly which fields are required when creating and updating records.
- The PUT routes should clarify whether they perform a complete update or a partial update. This specification will use PUT for a complete update of editable fields.
- The public custom id should remain unchanged during an update. The route parameter identifies the record being updated.
- The API should return a predictable order for list responses.
- The API should explain what happens when an author is deleted while books still reference that author.
2. Security considerations
- Validate all request data on the server. Swagger documentation does not replace server-side validation.
- Do not send MongoDB error messages, stack traces, database connection details, or secrets to clients.
- Keep database credentials in environment variables and do not commit the .env file.
- Reject malformed JSON and invalid field types with a client error.
- Only accept the fields defined by the API; clients should not be able to change internal MongoDB fields or an existing custom id through an update request.
3. Efficiency concerns
- The list routes should return only the fields defined in the public data models.
- The list routes should use a predictable sort order. This makes results easier to test and compare.
- The API should query by the custom id field because the assignment specifically requires custom ids such as b1 and a1.
- The API should check the author reference when creating or updating a book, and check for referencing books before deleting an author.
4. Unclear response examples and error behavior
- Each route should show an example success response.
- Not-found responses should use a consistent JSON error shape.
- A duplicate custom id should use 409 Conflict, because the requested id is already in use.
- Deleting an author that is still referenced by books should use 409 Conflict.
- A successful delete should return 204 No Content with no response body.
- Unexpected server errors should return a safe generic message, not internal database details.
Version 2
Feature 1: Book CRUD Operations and Author References
Goal
Update the Week 01 Books API to support creating, reading, updating, and deleting books. Each book must reference an existing author through the author's custom id. All book routes must be documented and testable through Swagger UI at /api-docs.
Data Model
- MongoDB database: cse341-books-db
- MongoDB collection: books
- Related MongoDB collection: authors
Book object:
- id: string, required, non-empty custom id such as b1
- authorId: string, required, non-empty value matching an existing author's custom id
- title: string, required, non-empty
- publicationDate: string, required, valid date in ISO 8601 YYYY-MM-DD format, for example 2021-08-17
Example book:
{
  "id": "b1",
  "authorId": "a1",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
MongoDB may create an internal _id for each document. The API will use the custom id for route parameters and public responses; _id is not part of the public book object.
General API Rules
- POST and PUT requests must use Content-Type: application/json.
- Request bodies must contain the required fields for that operation.
- id, authorId, and title must be non-empty strings.
- publicationDate must be a real calendar date in YYYY-MM-DD format.
- The API must reject unsupported extra fields rather than saving them.
- GET /books returns an array, including an empty array [] when there are no books.
- GET /books returns books ordered by id in ascending order.
- PUT updates all editable book fields and does not create a new book if the id does not exist.
- PUT does not change the book's custom id; the route parameter identifies the book.
- Successful JSON responses contain only the public book fields.
Routes
GET /books
Purpose: Return all books.

Success:
- Status code: 200 OK
- Response body: an array of book objects.
Example response:
[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  }
]
Errors:
- 500 Internal Server Error if an unexpected server or database error occurs.
GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: 200 OK
- Response body: the matching book object.
Example response:
{
  "id": "b1",
  "authorId": "a1",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
Errors:
- 404 Not Found if no book exists with that id.
- 500 Internal Server Error if an unexpected server or database error occurs.
POST /books
Purpose: Create a new book.

Request body:
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
Validation:
- All four fields are required.
- id, authorId, and title must be non-empty strings.
- publicationDate must be a real date in YYYY-MM-DD format.
- authorId must match an existing author.
- The custom book id must not already exist.
Success:
- Status code: 201 Created
- Response body: the newly created book object.
Errors:
- 400 Bad Request if a required field is missing, a value is invalid, the JSON is malformed, or an unsupported field is supplied.
- 400 Bad Request if the submitted authorId does not match an existing author.
- 409 Conflict if the custom book id already exists.
- 500 Internal Server Error if an unexpected server or database error occurs.
PUT /books/:id
Purpose: Completely update the editable fields of an existing book. The id in the URL identifies the book and cannot be changed.

Request body:
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
Validation:
- All three body fields are required.
- authorId and title must be non-empty strings.
- publicationDate must be a real date in YYYY-MM-DD format.
- authorId must match an existing author.
- The request body must not contain id or unsupported extra fields.
Success:
- Status code: 200 OK
- Response body: the updated book object, including its unchanged custom id.
Errors:
- 400 Bad Request if a required field is missing, a value is invalid, the JSON is malformed, or an unsupported field is supplied.
- 400 Bad Request if the submitted authorId does not match an existing author.
- 404 Not Found if no book exists with the id in the URL.
- 500 Internal Server Error if an unexpected server or database error occurs.
DELETE /books/:id
Purpose: Delete the book identified by its custom id.

Success:
- Status code: 204 No Content
- Response body: none.
Errors:
- 404 Not Found if no book exists with that id.
- 500 Internal Server Error if an unexpected server or database error occurs.
Book Error Response Format
For JSON error responses, use a consistent object containing a message field.

Example not-found response:
{
  "message": "Book not found"
}
Example server-error response:
{
  "message": "Internal server error"
}
Do not return stack traces, MongoDB error details, connection strings, or other internal implementation details.
Book Swagger Documentation
Swagger must document all five book routes:
- HTTP method, route path, summary, and description.
- Path parameter id for routes that use it.
- Required JSON request-body fields and their data types for POST and PUT.
- Example request bodies.
- Success response status codes and response schemas.
- Applicable 400, 404, 409, and 500 error responses with example JSON bodies.
- The Swagger UI at /api-docs must allow a user to try each route against the running API.
Book Deployment Expectations
All book routes must work locally and on the deployed Render application. The deployed /api-docs page must document and allow testing of every book route.
Feature 2: Author CRUD Operations
Goal
Create an Authors API that stores author records and supports creating, reading, updating, and deleting authors. All author routes must be documented and testable through Swagger UI at /api-docs.
Data Model
- MongoDB database: cse341-books-db
- MongoDB collection: authors
Author object:
- id: string, required, non-empty custom id such as a1
- name: string, required, non-empty author's name
- birthYear: integer, required, four-digit year from 1000 through the current calendar year
Example author:
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1985
}
MongoDB may create an internal _id for each document. The API will use the custom id for route parameters and public responses; _id is not part of the public author object.
General API Rules
- POST and PUT requests must use Content-Type: application/json.
- Request bodies must contain the required fields for that operation.
- id and name must be non-empty strings.
- birthYear must be an integer from 1000 through the current calendar year.
- The API must reject unsupported extra fields rather than saving them.
- GET /authors returns an array, including an empty array [] when there are no authors.
- GET /authors returns authors ordered by id in ascending order.
- PUT updates all editable author fields and does not create an author if the id does not exist.
- PUT does not change the author's custom id; the route parameter identifies the author.
- Successful JSON responses contain only the public author fields.
Routes
GET /authors
Purpose: Return all authors.

Success:
- Status code: 200 OK
- Response body: an array of author objects.
Example response:
[
  {
    "id": "a1",
    "name": "Maya Rivera",
    "birthYear": 1985
  }
]
Errors:
- 500 Internal Server Error if an unexpected server or database error occurs.
GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: 200 OK
- Response body: the matching author object.
Example response:
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1985
}
Errors:
- 404 Not Found if no author exists with that id.
- 500 Internal Server Error if an unexpected server or database error occurs.
POST /authors
Purpose: Create a new author.

Request body:
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1985
}
Validation:
- All three fields are required.
- id and name must be non-empty strings.
- birthYear must be an integer from 1000 through the current calendar year.
- The custom author id must not already exist.
Success:
- Status code: 201 Created
- Response body: the newly created author object.
Errors:
- 400 Bad Request if a required field is missing, a value is invalid, the JSON is malformed, or an unsupported field is supplied.
- 409 Conflict if the custom author id already exists.
- 500 Internal Server Error if an unexpected server or database error occurs.
PUT /authors/:id
Purpose: Completely update the editable fields of an existing author. The id in the URL identifies the author and cannot be changed.

Request body:
{
  "name": "Maya A. Rivera",
  "birthYear": 1986
}
Validation:
- Both body fields are required.
- name must be a non-empty string.
- birthYear must be an integer from 1000 through the current calendar year.
- The request body must not contain id or unsupported extra fields.
Success:
- Status code: 200 OK
- Response body: the updated author object, including its unchanged custom id.
Errors:
- 400 Bad Request if a required field is missing, a value is invalid, the JSON is malformed, or an unsupported field is supplied.
- 404 Not Found if no author exists with the id in the URL.
- 500 Internal Server Error if an unexpected server or database error occurs.
DELETE /authors/:id
Purpose: Delete the author identified by the custom id only when no books reference that author.

Before deletion, the API must search the books collection for a document whose authorId equals the author's custom id. If at least one matching book exists, the API must not delete the author.

Success:
- Status code: 204 No Content
- Response body: none.
Errors:
- 404 Not Found if no author exists with that id.
- 409 Conflict if one or more books still reference the author. The author must remain in the database.
- 500 Internal Server Error if an unexpected server or database error occurs.
Author Error Response Format
For JSON error responses, use a consistent object containing a message field.

Example not-found response:
{
  "message": "Author not found"
}
Example conflict response:
{
  "message": "Author cannot be deleted because books still reference this author"
}
Example server-error response:
{
  "message": "Internal server error"
}
Do not return stack traces, MongoDB error details, connection strings, or other internal implementation details.
Book-Author Relationship Rules
- Every book must reference an existing author through authorId.
- A book's authorId stores the author's custom id, not MongoDB _id.
- POST and PUT /books operations must verify that the referenced author exists before saving the book.
- DELETE /authors/:id must be rejected with 409 Conflict while one or more books reference that author.
- If no books reference an author, that author may be deleted.
- Updating an author's name or birth year does not change its custom id, so existing book references remain valid.
Author Swagger Documentation
Swagger must document all five author routes:
- HTTP method, route path, summary, and description.
- Path parameter id for routes that use it.
- Required JSON request-body fields and their data types for POST and PUT.
- Example request bodies.
- Success response status codes and response schemas.
- Applicable 400, 404, 409, and 500 error responses with example JSON bodies.
- The Swagger UI at /api-docs must allow a user to try each route against the running API.
Author Deployment Expectations
All author routes must work locally and on the deployed Render application. The deployed /api-docs page must document and allow testing of every author route.