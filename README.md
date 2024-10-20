<div align="center">

# Texto

Texto is a simple API server for serving MDX content, built with Bun and Elysia.

</div>

## Features

- Serves MDX content so you can use any version control system to manage your content
- Multiple categories of posts based on directory structure
- API endpoints for listing posts and retrieving individual posts
- Rate limiting, logging and compression for production

## Prerequisites

- [Bun](https://bun.sh) v1.1.31 or later

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/climactic/texto.git
   cd texto
   ```

2. Install dependencies:
   ```bash
   bun i
   ```

3. Create a `.env` file based on the `.env.example` and adjust the values as needed:
   ```bash
   cp .env.example .env
   ```

4. Write some content in the `content` directory and start the server:
   ```bash
   bun dev
   ```

5. Access the API at `http://localhost:3000/api/posts`

6. Get a post by its slug:
   ```bash
   http://localhost:3000/api/posts/{category}/{slug}
   ```

## Configuration

The following environment variables can be set in the `.env` file:

- `PORT`: The port on which the server will run (default: 3000)
- `RATE_LIMIT_MAX`: Maximum number of requests per duration (default: 100)
- `RATE_LIMIT_DURATION`: Duration for rate limiting in milliseconds (default: 60000)

## License

This project is licensed under the Apache2.0 License. See the [LICENSE](LICENSE) file for details.
