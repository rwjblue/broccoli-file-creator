# Broccoli's File Creator

## Usage

Create a file named `app/main.js` with "some content goes here":

```javascript
var writeFile = require('broccoli-file-creator');

var tree = writeFile('/app/main.js', 'some content goes here');
```

## Documentation

### `writeFile(filename, content, fileOptions)`

---

`filename` *{String}*

The path of the file to create.

---

`content` *{String}*

The contents to write into the file.

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm install
npm test
```

## License

This project is distributed under the MIT license.
