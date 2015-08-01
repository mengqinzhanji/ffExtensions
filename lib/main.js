
const {Cc,Cu,Ci,Cm} = require("chrome");
const {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm");
const {FileUtils} = Cu.import("resource://gre/modules/FileUtils.jsm");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;

tabs.on('ready',function(tab){
  if(!isBKTab(tab.url)){
    return;
  }
	var worker = tab.attach({
  		contentScriptFile:[data.url("content-script.js")],
  		onMessage : function(msg){
  		  onMessage(worker,msg);
  		}
  	});
  // startListening(worker);
});

function onMessage(worker,msg) {
  switch (msg.type) {
    case "fetchFileName":
        try {
           let systemDirectory = Downloads.getSystemDownloadsDirectory();
    	     let temporaryDirectory = Downloads.getTemporaryDownloadsDirectory();
    	     var fileName = msg.fileName;
    	     if(fileName){
    	       fechFileFullPath(worker,fileName);
    	     }
        } catch(e) {
          
        };

      break;
    default:
      console.log("onMessage :: type = " + msg.type);
      break;
  }
}

function fechFileFullPath(worker,fileName){
      let systemDirectory = Downloads.getSystemDownloadsDirectory();
      let temporaryDirectory = Downloads.getTemporaryDownloadsDirectory();
      if(fileName){
    	       systemDirectory.then(function(directory){
      	         var dir = directory || '';
      	         if(!dir || dir.trim() ==''){
      	           return;
      	         }
                 if(dir.substring(dir.length -1, dir.length) == '\\'){
                   dir += fileName;
                 }else{
                   dir += '\\'+fileName;
                 }
                 var file = FileUtils.File(dir);
                 if(file.exists()){
                   worker.port.emit('backFileName', dir);
                 }else{
                   fechTempFileFullPath(worker,fileName);
                 }
          	  },function(err){});
    }
}

function fechTempFileFullPath(worker,fileName){
  let temporaryDirectory = Downloads.getTemporaryDownloadsDirectory();
  temporaryDirectory.then(function(directory){
       var dir = directory || '';
       if(!dir || dir.trim() ==''){
         return;
       }
       if(dir.substring(dir.length -1, dir.length) == '\\'){
         dir += fileName;
       }else{
         dir += '\\'+fileName;
       }
       var file = FileUtils.File(dir);
       if(file.exists()){
         worker.port.emit('backFileName', dir);
       }
  },function(err){});
}

function isBKTab(url){
  return true;
  // return /(qa|uat|)booking\.oocllogistics\.com/.test(url);
}

function startListening(worker) {
  worker.port.on('fetchFileName', function(html) {
    var systemDirectory = Downloads.getSystemDownloadsDirectory();
	  var temporaryDirectory = Downloads.getTemporaryDownloadsDirectory();
	  systemDirectory.then(function(directory){
	     worker.port.emit('backFileName', directory);
	  });
  });
}

