(function(){
  self.port.on('backFileName', function(path) {
    window.sessionStorage.setItem('downloadFilePath',path);
  });
  
  function click_btn(e){
    var data = e.data;
    var fileName = window.sessionStorage.getItem('downloadFileName');
    var msg = {
      fileName: fileName,
      type : 'fetchFileName'
    };
    self.postMessage(msg);
  }
  
  var ffFileNameDiv = document.getElementsByName('fetchFilePathDiv')[0];
  if(!ffFileNameDiv){
    ffFileNameDiv = document.createElement('div');
  }
  ffFileNameDiv.setAttribute('name','fetchFilePathDiv');
  ffFileNameDiv.style.display = 'none';
  ffFileNameDiv.onclick = click_btn;
  document.body.appendChild(ffFileNameDiv);  
  window.addEventListener('message', click_btn, false);
})()
