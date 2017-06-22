//Currently does not support embedded lithium stylings ie Code inside of TIP.  Can be added if requested, requires brief reconstruction.
// Currently does not support multiple S3 hosted images in one line, support will be added next iteration.
//Redo process of parsing, it should be done before the md.lithium script
var Markdown = require('markdown-to-html').GithubMarkdown;
var md = new Markdown();
var fs = require('file-system');
var open = require('open');
var readline = require('readline');
var path = require('path');

//May need to be changed
md.bufmax = 2048;
//Normalize args
var args = process.argv.slice(2);
var fileName = args[0];
var flagArr = args.slice(1);
//Check for destination
if ((flagArr.length>0) && (flagArr[0].length !== 2)) {
  //Destination
  var destArg = flagArr[0];
  //Slash check
  if (destArg[destArg.length -1] !== "/") {
    destArg += "/";
  }
}
//Check for file name vs path
var dest = destArg || "output/";
if (fileName.indexOf("/") !== -1) {
  console.log(fileName);
  var pathArr = fileName.split("/");
  var onlyFileName = pathArr[pathArr.length-1];
  var rawOutputFileName = onlyFileName.slice(0, -3) + "-raw.html";
  var finalOutputName = dest + onlyFileName.slice(0, -3) + ".html";
} else {
  var rawOutputFileName = fileName.slice(0, -3) + "-raw.html";
  var finalOutputName = dest + fileName.slice(0, -3) + ".html";
}

console.log(finalOutputName);

var opts = {
  flavor: 'markdown'
};

//flags
var draft = false;
//Used for replacing non-same line HTML tags
var skipLine = false;
var unclosedTags = [];
var preBlockFlag = false;

var editLithium = function(line, outputTarget, outputDraft) {
  //Custom lithium edits, line by line. Looking for keywords like maybe @@TIP
  // May need flags
  // console.log(line);
  // console.log(" ");
  var hasClassAttr = false;
  //Used to replace tokens 
  var tokenIdx = 0;
  var tokenLength;
  var token;
  var editClassNeeded = false;
  var editElementNeeded = false;
  var imageRoot = "http://images.tealiumiq.com/documentation-integrations";

  //Image handling
  //TODO: Handle side by side images by abstracting image test into a function and loop.
  var containsRelativeImage = /="(\/client\/.+?)"|(\/server\/.+?)"|(\/mobile\/.+?)"/.test(line);
  if (containsRelativeImage) {
    //Replace path, but only if it has an image extension
    var relativeImagePath = /="(\/.+?)\.(?:gif|jpg|jp?g|tiff|png|svg)"/.exec(line);
    if (relativeImagePath !== null) {
      line = line.replace(new RegExp(relativeImagePath[1], 'g'), imageRoot + relativeImagePath[1]);
    }
  }

  //Check for class attr
  if (line.search("<p class=") !== -1) {
    hasClassAttr = true;
  }

  if (line.search("TIP: ") !== -1) {
    tokenIdx = line.search("TIP: ");
    tokenLength = 5;
    editClassNeeded = true;
  } else if (line.search("NOTE: ") !== -1) {
    tokenIdx = line.search("NOTE: ");
    tokenLength = 6;
    editClassNeeded = true;
  }


  // If there is a token index
  if (tokenIdx) {
    //Isolate token: TIP: :: tip
    token = line.substr(tokenIdx, tokenLength - 2).toLowerCase();
    //Strip token from line 'TIP: Start of line' :: 'Start of line'
    line = line.replace((line.substr(tokenIdx, tokenLength)), "");
  }


  // ******* Initital edit *******
  if (editClassNeeded) {
    if (hasClassAttr) {
      // TODO add an attr to the class instead of replacing
      //Can this even be a case w  vanilla markdown
    } else {
      line = line.replace("<p>", "<p class='" + token + "'>");
    }
  }

  //Need to prettify html?
  line += "\n";
  //remove auto generated
  if (line.indexOf('id="user-content-') !== -1) {
    line = line.replace('user-content-', "");
  }

  // Handle PRE blocks
  if (line.indexOf('<pre>SIMPLE') !== -1) {
    line = line.replace('<pre>SIMPLE', '<pre class="simple_pre">');
  }


  // Forcing all links to open new tab
  // EXCEPT anchor jumps
  if ((line.indexOf('a href')) !== -1 && (line.indexOf('href="#') === -1)) {
    line = line.replace('a href', 'a target="_blank" href');
  }
  outputTarget.write(line);
  if (draft) {
    outputDraft.write(line);
  }
  //return line;
};

console.log('Processing...');

//Flag setting
if (flagArr.indexOf('-d') !== -1) {
  draft = true;
}

//Pre process code blocks
fs.unlink("post-processed.md", function(err) {
  if (err) {
    //console.log("Post Prcoess file not found.");
  }
});
var postProcessed = fs.createWriteStream('post-processed.md', {
  'flags': 'a'
});

var postprocess = readline.createInterface({
  input: fs.createReadStream(fileName),
  output: process.stdout,
  terminal: false
});

postprocess.on('line', function(preprocessed) {
  // Encode on the lines with Opening HTML tags.
  if ((preprocessed.search("S_PRE:") !== -1)) {
    // The third party node module doesn't allow for non standard HTML tags, so we will flag this pre tag and replace it later.
    preprocessed = preprocessed.replace('<', '&lt;');
    preprocessed = preprocessed.replace("S_PRE:", '<pre>SIMPLE');
    preBlockFlag = true;
  }
  if (preprocessed.search(":S_PRE") !== -1) {
    preprocessed = preprocessed.replace('<', '&lt;');
    preprocessed = preprocessed.replace(":S_PRE", "</pre>");
        preBlockFlag = false;
  }
  if ((preprocessed.search("PRE:") !== -1)) {
    preprocessed = preprocessed.replace('<', '&lt;');
    preprocessed = preprocessed.replace("PRE:", "<pre>");
    preBlockFlag = true;
  }
  if ((preprocessed.search(":PRE") !== -1)) {
    preprocessed = preprocessed.replace('<', '&lt;');
    preprocessed = preprocessed.replace(":PRE", "</pre>");
        preBlockFlag = false;
  }
  //Encode within PRE blocks
  if ((preprocessed.indexOf('<') !== -1) && preBlockFlag) {
    if ((preprocessed.search('<pre>') == -1) && (preprocessed.search('</pre>') == -1)){
      preprocessed = preprocessed.replace('<', '&lt;');
    }
  }
  postProcessed.write(preprocessed + "\n");
});
postprocess.on('close', function() {

  //Begin MD-Lithium conversion
  md.render("post-processed.md", opts, function(err) {
    if (err) {
      console.error('>>>' + err);
      process.exit();
    }

    var writeTarget = fs.createWriteStream(rawOutputFileName);
    md.pipe(writeTarget);
  });
});

md.once('end', function() {
  console.log('Raw HTML generation completed.');
  console.log('Checking for output overwrite.');
  fs.unlink(finalOutputName, function(err) {
    if (err) {
      console.log("No file overwrite needed.");
    } else {
      console.log("Output file has been overwritten.");
    }
  });

  //Remove previous draft if a new one will be generated
  if (draft) {
    fs.unlink('draft/draft.html', function(err) {
      if (err) {
        console.log("No draft overwrite needed.");
      } else {
        console.log("Draft file has been overwritten.");
      }
    });
  }

  console.log('Starting custom Lithium styled HTML generation.');

  var rd = readline.createInterface({
    input: fs.createReadStream(rawOutputFileName),
    output: process.stdout,
    terminal: false
  });

  var targetStream = fs.createWriteStream(finalOutputName, {
    'flags': 'a'
  }, function(err){
    if (err) {
      console.log("Output folder doesn't exist");
    }
  });

  if (draft) {
    var draftStream = fs.createWriteStream('draft/draft.html', {
      'flags': 'a'
    });

    //Insert style, centering, and title for draft.
    console.log("writing styles");
    draftStream.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"><link rel="stylesheet" type="text/css" href="lithium-style.css"><link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"><div class="container"><div class="row"><div class="col-md-10 col-md-offset-1 col-lg-10 col-md-offset-1"><h1 class="title">Local Lithium Preview</h1>');
  }
  rd.on('line', function(line) {
    editLithium(line, targetStream, draftStream);
    //console.log("-" + line);
  });

  rd.on('close', function() {
    if (draft) {
      //Close divs & open in browser
      fs.appendFileSync('draft/draft.html', '</div></div></div><br>', encoding = 'utf8');
      open('draft/draft.html');
    }

    console.log("Markdown to Lithium Styled HTML complete.");

    fs.unlink(rawOutputFileName, function(err) {
      if (err) {
        console.log("No raw output file");
      }
    });
    //Delete post process
    fs.unlink("post-processed.md", function(err) {
      if (err) {
        console.log("Post Prcoess file not found.");
      }
    });
  });

});