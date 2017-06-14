
# md-lithium

Takes a .md file and converts it to Tealium's custom Lithium styled HTML.

# Installation
Install all dependencies with:
```
npm install
```

# Usage
Running:
```
node md-lithium.js [folder/file.md] [folder/destination] [flag]
```
If no destination is provided, the result will be placed in the script's root output folder.

`md-lithium` takes an optional flag to open a local draft of the recently converted HTML:

```
node md-lithium.js folder/file.md -d
```



# Images
As of now, images are hosted on the integration-documentation S3 bucket.
To embed screenshots or other images into your md file, use the standard md image syntax with a relative path to the integration folder where the images are.

For a Tealium custom container documentation, the image path might be:

`/client/custom_container/ui_config.jpg`

In md, it'd be:

`![](/client/custom_container/ui_config.jpg)`

# Supported Custom MD Tokens
- `NOTE:  //with trailing space` 
- `TIP:  //with trailing space `
- `PRE:  //with trailing space`
- `S_PRE: //with trailing space`

## Note

For custom tokens, the trailing space is required. For preformatted code blocks `PRE: ` and `S_PRE: `, close them with `:PRE` or `:S_PRE` respectively.  These closing tags should not be on the same line as the openers.   For example, to include a code block in your .md file:

```
PRE: var myStringArray = ["Hello","World"];
var arrayLength = myStringArray.length;
for (var i = 0; i < arrayLength; i++) {
    alert(myStringArray[i]);
}

console.log("All Done!")
:PRE
```