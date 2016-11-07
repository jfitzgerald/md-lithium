
# md-lithium

Takes a .md file and converts it to Tealium's custom Lithium styled HTML.

# Installation
Install all dependencies with:
```
npm install
```

# Usage
With the .md to be converted in the md-lithium root folder:
```
node md-lithium.js [file.md] [flag]
```


`md-lithium` takes an optional flag to open a local draft of the recently converted HTML:

```
node md-lithium.js file.md -d
```


# Supported Custom MD Tokens

- `NOTE:  //with trailing space` 
- `TIP:  //with trailing space `
- `PRE:  //with trailing space`

## Note

For custom tokens, the trailing space is required.  For example, to include a preprocessed code block in your .md file:

```
PRE: var myStringArray = ["Hello","World"];
var arrayLength = myStringArray.length;
for (var i = 0; i < arrayLength; i++) {
    alert(myStringArray[i]);
}
```