# Broccoli's File Mover

## Usage

Removing a single file from `app/main`:

```javascript
var removeFile = require('broccoli-file-remover');

var tree = removeFile('app', {
  srcFile: 'app/main.js'
});
```

Removing `app/main` and `test/main`:

```javacript
var removeFile = require('broccoli-file-remover');

var tree = removeFile('app', {
  files: ['app/main.js', 'test/main.js']
});
```

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm test
```

## Documentation

### `removeFile(inputTree, options)`

---

`options.srcFile` *{String}*

The path of the file to remove.

---

`options.files` *{Array}*

This allows specifying more than one remove operation at a time (and reduced the total number of trees/steps
needed if you need to move many files). Each file listed in the array will be removed.

## License

This project is distributed under the MIT license.
