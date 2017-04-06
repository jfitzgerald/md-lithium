//Currently does not support embedded lithium stylings ie Code inside of TIP.  Can be added if requested, requires brief reconstruction.
// Currently does not support multiple S3 hosted images in one line, support will be added next iteration.

var Markdown = require('markdown-to-html').GithubMarkdown;
var md = new Markdown();
var fs = require('file-system');
var open = require('open');
var readline = require('readline');
//May need to be changed
md.bufmax = 2048;
//Normalize args
var args = process.argv.slice(2);
var fileName = args[0];
var flagArr = args.slice(1);
var rawOutputFileName = fileName.slice(0, -3) + "-raw.html";
var finalOutputName = "output/" + fileName.slice(0, -3) + ".html";
console.log(finalOutputName)
var opts = {flavor: 'markdown'};

//flags
var draft = false;
//Used for replacing non-same line HTML tags
var skipLine = false;
var unclosedTags = [];

var editLithium = function(line, outputTarget, outputDraft) {
  //Custom lithium edits, line by line. Looking for keywords like maybe @@TIP
  // May need flags
  // console.log(line);
  // console.log(" ");
  var hasClassAttr = false;
  //Used to replace tokens 
  var tokenIdx =0;
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
    if (relativeImagePath !== null){
      line = line.replace(new RegExp(relativeImagePath[1], 'g'), imageRoot+relativeImagePath[1]);
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
  } else if (line.search("NOTE: ") !== -1){
    tokenIdx = line.search("NOTE: ");
    tokenLength = 6;
    editClassNeeded = true;
  }else if ((line.search("S_PRE: ") !== -1)){
    tokenIdx = line.search("S_PRE: ");
    tokenLength = 7;
    editElementNeeded = true;
  } else if (line.search("PRE: ") !== -1){
    tokenIdx = line.search("PRE: ");
    tokenLength = 5;
    editElementNeeded = true;
  }

  // If there is a token index
  if (tokenIdx){
    //Isolate token: TIP: :: tip
    token = line.substr(tokenIdx, tokenLength-2).toLowerCase();
    //Strip token from line 'TIP: Start of line' :: 'Start of line'
    line = line.replace((line.substr(tokenIdx, tokenLength)), "");
  }


  // ******* Closing Edit *******
  if (unclosedTags.length>0) {
    if (line.search("</p>") !== -1) {
      line = line.replace("</p>", unclosedTags.pop());
    }
  }

  // ******* Initital edit *******
  if (editClassNeeded) {
    if (hasClassAttr) {
      // TODO add an attr to the class instead of replacing
      //Can this even be a case w  vanilla markdown
    } else {
      line = line.replace("<p>","<p class='" + token +"'>");
    }
  } else if (editElementNeeded) {
    //Add support for colorized code blocks (simple_pre)
    var openToken = token;
    if (openToken === "s_pre") {
      openToken = "pre class='simple_pre'";
      token = "pre";
    }
    line = line.replace("<p>","<" + openToken +">");
    //skipLine = true;
    unclosedTags.push("</" + token +">");
  }

  //Need to prettify html?
  line += "\n";
  //remove auto generated
   if (line.indexOf('id="user-content-') !== -1){
     line = line.replace('user-content-', "");
  }
  // Forcing all links to open new tab
  if(line.indexOf('a href') !== -1) {
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

md.render(fileName, opts, function(err) {
  if (err) {
    console.error('>>>' + err);
    process.exit();
  }

  var writeTarget = fs.createWriteStream(rawOutputFileName);
  md.pipe(writeTarget);
});



md.once('end', function() {
  console.log('Raw HTML generation completed.');
  console.log('Checking for output overwrite.');
  fs.unlink(finalOutputName, function(err){
    if (err){
      console.log("No file overwrite needed.");
    } else {
      console.log("Output file has been overwritten.");
    }
  });

  //Remove previous draft if a new one will be generated
  if (draft) {
    fs.unlink('draft/draft.html', function(err){
      if (err){
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

  var targetStream = fs.createWriteStream(finalOutputName, {'flags': 'a'});

  if (draft) {
    var draftStream = fs.createWriteStream('draft/draft.html', {'flags': 'a'});

    //Insert style, centering, and title for draft.
    console.log("writing styles");
    draftStream.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"><link rel="stylesheet" type="text/css" href="lithium-style.css"><link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"><div class="container"><div class="row"><div class="col-md-10 col-md-offset-1 col-lg-10 col-md-offset-1"><h1 class="title">Local Lithium Preview</h1>');
  }
  rd.on('line', function(line) {
    editLithium(line, targetStream, draftStream);
    //console.log("-" + line);
  });

  rd.on('close', function(){
    if (draft) {
      //Close divs & open in browser
      fs.appendFileSync('draft/draft.html', '</div></div></div><br>', encoding='utf8');
      open('draft/draft.html');
    }
    
    console.log("Markdown to Lithium Styled HTML complete.");
    
    fs.unlink(rawOutputFileName);
  });

});

