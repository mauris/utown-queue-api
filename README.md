# UTown Queue API Application

This app serves as the API-service application for the frontend application to help the queue managers track the status of the queue and call groups of people in the queue to the physical location when it is their turn. This app was made possible using the [SEAN Stack](https://github.com/sean-js).

## Commands

### Clean Start

To start using the stack, you need several dependencies installed globally and accessible in your command line  interface / terminal:

    $ npm -g install gulp mocha

### Starting Server

To run the server, use the command:

    $ npm start

Running the server by default will launch multi-threaded version even in development mode.

When in development mode, you can use [nodemon](https://github.com/remy/nodemon) by running the gulp task:

    $ gulp

### Running Tests

To run the tests, use the command:

    $ npm test

The tests will launch a single-thread instance of the server listening at the port defined by `PORT` environment variable.

## Configuration

The stack can be configured using the a few environment variables. In the event that modifying environment variables is difficult (such as on Windows), `dotenv` is enabled and you can create a `.env` file on the application root and place the variables in the file.

| Variable | Type | Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | String | `'development'` | Description of the current runtime environment. On production, it should be set to `'production'` instead. |
| `PORT` | Integer, 0 - 65535 | 3000 | The port number that the web server should listen to for incoming requests. |
| `DB_NAME` | String | `null` | The name of the database. |
| `DB_USER` | String | `null` | The username for the database connection. |
| `DB_PASS` | String | `null` | The password for the database connection. |
| `DB_CONFIG` | JSON String | `null` | The configuration object accepted by Sequelize. You can configure what flavour of database to use in this parameter. |
| `LOG_FORMAT` | String | `'dev'` | The log format to print using Morgan for HTTP requests and responses. See https://github.com/expressjs/morgan |
| `LOG_SILENT` | Boolean | `false` | Whether request logs should be printed. |
| `HTTPS_ENABLE_REDIRECT` | Boolean | `false` | Whether switch the protocol for HTTPS if the current traffic is on HTTP.
| `SINGLE_THREAD` | Boolean | `false` | Whether or not to use a single thread. |

## License
Code released licensed under MIT License.
