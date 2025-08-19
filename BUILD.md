### Building from Source

To build the extension from the source code, you'll need Node.js and npm.

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Build the extension:**
    ```bash
    npm run build
    ```
    This will create a `dist` directory with the unpacked extension. You can load this directory directly into Chrome.
3.  **Package for distribution:**
    ```bash
    npm run package
    ```
    This will create a distributable `.zip` file inside the `dist` directory.
