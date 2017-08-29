
# md-lithium

Converts a markdown (*.md) file into Tealium's custom Lithium-styled HTML.

# Installation
Install all dependencies with:
```
npm install
```

# Usage
Running:
```
node md-lithium.js [folder/file.md] [folder/destination] [flags]
```
If no folder destination is provided, the resulting HTML will be placed in the script's root output folder.

`md-lithium` takes the following optional flags:

`node md-lithium.js folder/file.md -d` Opens a local draft of the recently converted HTML

`node md-lithium.js folder/file.md -p` Creates a Lithium-styled PDF of the document along with the converted HTML

# Images
As of now, images are hosted on the integration-documentation S3 bucket.
To embed screenshots or other images into your md file, use the standard md image syntax with a relative path to the integration folder where the images are.

For a Tealium custom container documentation, the image path might be:

`/client/custom_container/ui_config.jpg`

In md, it'd be:

`![](/client/custom_container/ui_config.jpg)`

# Supported Custom MD Tokens
- `NOTE: //with trailing space`
- `TIP: //with trailing space `
- `PRE: //without trailing space`
- `S_PRE: //without trailing space`

## Using Note/Tip
Make sure to add a space after the colon. Because there are no opening or closing tokens, the md script converter keys off of the whitespace to render the CSS. Here's a simple example:

```
NOTE: lorem ipsum
TIP: lorem ipsum
```
## Using Preformatted Code Blocks
Use `PRE:` and `S_PRE:` tokens for code blocks. Close them with `:PRE` or `:S_PRE` respectively.  The tokens should be placed alone in a line, and not on the same line as any code.

### Do This
```
PRE:
console.log("All Done!")
:PRE
```

### Not This
```
PRE: console.log("All Done!") :PRE
```

### Not Recommended
The converter script will parse any code block where either the opening or closing token is inline with the code, however it is not recommended.
```
PRE: console.log("All Done!")
:PRE
```

```
S_PRE: console.log("All Done!")
:S_PRE
```

```
PRE:
console.log("All Done!") :PRE
```

```
S_PRE:
console.log("All Done!") :S_PRE
```
