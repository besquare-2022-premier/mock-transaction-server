# Mock Transaction Server

## Structure

| Folder    | Usage             |
| --------- | ----------------- |
| `src`     | The source code   |
| `test`    | The test suite    |
| `.github` | CI related stuffs |

## Public Endpoints

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/session/all`                  | Get all session              |
| POST   | `/session`                      | Perform operation on session |
| GET    | `/session/:id`                  | Get session info             |
| GET    | `/session/checkout?session_id=` | Checkout page                |
| PUT    | `/session`                      | New session                  |
