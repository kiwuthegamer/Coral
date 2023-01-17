// Remove Loader
document.querySelector("#loadingWrapper").style.opacity = 0;
setTimeout(function(){ document.querySelector("#loadingWrapper").style.display = "none" },500)

// Too Small Check
if(screen.width < 650 || screen.height < 450){
  document.body.innerHTML = "<div>We're sorry, your device screen is too small for Coral</div>";
}

function rename() {
  var fileName = document.getElementById("fileName");
  var newFileName = prompt("Enter New Name", fileName.value);
  if (newFileName) {
    fileName.value = newFileName;
  }
}

function opentab(num) {
  var tabs = document.querySelectorAll(".tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].hidden = true;
  }
  tabs[num].hidden = false;
}

if(localStorage.getItem("savedTitle") == undefined){
  localStorage.setItem("savedTitle", "Untitled Coral Document");
}

if(localStorage.getItem("savedText")){
  document.querySelector("#textarea").innerHTML = localStorage.getItem("savedText");
  document.querySelector(".faintTextarea").innerHTML = "";
}
document.querySelector("#fileName").value = localStorage.getItem("savedTitle");

document.querySelector("#textarea").addEventListener('paste', function (e) {
  e.preventDefault()
  var text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
})

document.addEventListener('keyup', function(e) {
  var textarea = document.querySelector("#textarea");
  var ftextarea = document.querySelector(".faintTextarea");
  var text = textarea.innerText;
  if (e.key == "ArrowRight" || e.key == "Tab") {
    if(ftextarea.innerHTML.length > 0){
      e.preventDefault();
      textarea.innerHTML = ftextarea.innerHTML;
    }
  }
  var wordList = text.replaceAll("\n", " \n ").split(" ");
  /* Word Prediction */
  var currword = wordList[wordList.length - 1];
  var suggestedWord = "";
  // if (text[text.length - 1].trim().length == 0) {//New Word Prediction
  //   var suggestedWord = newWordPrediction()[0];
  // } else {//In Word Prediction
    if (currword.length > 2) {
      var suggestedWord = inWordPrediction(currword)[0];
    }
  // }
  if (suggestedWord && suggestedWord != currword) {
    wordList.splice(wordList.length - 1, 1)
    if(wordList.length > 0){
      document.querySelector(".faintTextarea").innerHTML = wordList.join(" ") + " " + suggestedWord;
    } else {
      document.querySelector(".faintTextarea").innerHTML = suggestedWord;
    }
    var selection = window.getSelection();
    selection.setBaseAndExtent(textarea, 1, textarea, 1);
  } else {
    document.querySelector(".faintTextarea").innerHTML = "";
  }
  localStorage.setItem('savedTitle', document.getElementById("fileName").value);
  localStorage.setItem('savedText', document.querySelector("#textarea").innerHTML);
});

function inWordPrediction(currword) {
  var maxWords = 10;
  var finalList = [];
  for (var i = 0; i < commonWords.length; i++) {
    if (commonWords[i].startsWith(currword) && finalList.length != maxWords) {
      finalList.push(commonWords[i]);
    }
  }
  if (finalList.length != maxWords) {
    for (var i = 0; i < words.length; i++) {
      if (words[i].startsWith(currword) && finalList.length != maxWords) {
        finalList.push(words[i]);
      }
    }
  }
  return (finalList);
}

function newWordPrediction() {
  var wordlist = textarea.innerText.replaceAll("\n"," ").split(" ")
  var lastWord = wordlist[wordlist.length - 1].trim()
  if(!wordlist.includes(lastWord)) return;
  var nextWords = []
  var possibleNextWords = []
  for(var i=1;i<wordlist.length;i++){
    if(nextWords.includes(wordlist[i])){
      possibleNextWords.push(wordlist[i])
    }
    if(wordlist[i-1] == lastWord){
      nextWords.push(wordlist[i])
      wordlist.splice(i, 1)
    }
  }
  return(possibleNextWords)
}

function isWord(word){
  var word = word.toLowerCase().replace(/[^A-z]/g, "");
  if(word != ""){
    if(words.includes(word)) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

//
// File
//

//Download
function fileDownload() {
  var name = document.getElementById("fileName").value;
  var text = document.querySelector("#textarea").innerHTML;
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', name + ".txt");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//New
function fileNew() {
  if (confirm("Download File before Resetting?")) {
    fileDownload();
  }
  document.querySelector("#textarea").innerHTML = "";
  document.getElementById("fileName").value = "Untitled Coral Document";
  localStorage.setItem('savedText', "");
  localStorage.setItem('savedTitle', "Untitled Coral Document");
}

document.querySelector("#openButton").onchange = fileOpen;

function fileOpen() {
  var file = document.querySelector("#openButton").files[0]
  document.getElementById("fileName").value = file.name.replaceAll(".txt","");
  var fr = new FileReader();
  fr.onload = function(){
    document.querySelector("#textarea").innerHTML = fr.result.replaceAll("\n", "<br>");
  }
  fr.readAsText(file)
}

// Quick Select Pins

var pinnedItems = [];

if(localStorage.getItem("pinnedItems") == undefined){
  localStorage.setItem("pinnedItems", "");
}

pinnedItems = localStorage.getItem("pinnedItems").split(",").map(function(e){return e.split("-")})
if(pinnedItems[0] == ""){ pinnedItems.splice(0,1) }

for(var i=0;i<pinnedItems.length;i++){
  document.getElementById("quickselect").innerHTML += '<span><button onclick="'+pinnedItems[i][0]+'">'+pinnedItems[i][1]+'</button><button class="pinButton" onclick="unpin(this.parentElement);">❌</button><br></span>';
}

function pin(name, func){
  document.getElementById("quickselect").innerHTML += '<span><button onclick="'+func+'">'+name+'</button><button class="pinButton" onclick="unpin(this.parentElement);">❌</button><br></span>';
  pinnedItems.push([func, name]);
  updatePinnedItems();
}

function unpin(elem){
  elem.remove();
  pinnedItems.splice(pinnedItems.indexOf([elem.onclick, elem.innerHTML]), 1);
  updatePinnedItems();
}

function updatePinnedItems(){
  var outs = [];
  for(var i=0;i<pinnedItems.length;i++){
    var currOut = pinnedItems[i].join("-");
    outs.push(currOut);
  }
  localStorage.setItem("pinnedItems", outs.join(","));
}

// Info Menu

function toggleInfo(){
  document.querySelector(".logoWrapper").classList.toggle("full");
}

// Themes

var themes = [["#FF9770","#FFD670","#70D6FF","#F7F7F7","#000000","#CDCBCD"],["#e3e3e3","#f7f7f7","#abe7ff","#e9f2ff","#000000","#c2ddff"],["#2f343d","#535a5e","#686868","#6e6c78","#ffffff","#000000"],["#0f3059","#083671","#052146","#1b4f93","#679ae3","#0f1524"],["#b87540","#bc9b4c","#0da391","#b44a4a","#380b55","#126b9a"]]

if(localStorage.getItem("theme")){
  setTheme(localStorage.getItem("theme"))
}

function setTheme(themeId){
  localStorage.setItem("theme", themeId)
  document.documentElement.style.setProperty('--primary', themes[themeId][0]);
  document.documentElement.style.setProperty('--secondary', themes[themeId][1]);
  document.documentElement.style.setProperty('--tertiary', themes[themeId][2]);
  document.documentElement.style.setProperty('--white', themes[themeId][3]);
  document.documentElement.style.setProperty('--black', themes[themeId][4]);
  document.documentElement.style.setProperty('--body-bg', themes[themeId][5]);
}

