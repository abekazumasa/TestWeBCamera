<<<<<<< HEAD
const image = document.getElementById("image_file");
const showImage = document.getElementById("viewImage");


image.addEventListener("change", () => {
  var inputFile = image.files[0];
  console.log(inputFile);
  if (inputFile.type.indexOf("image") == 0) {
      var reader = new FileReader();
      reader.onload = function(evt){
        showImage.src = reader.result;
      }
      reader.readAsDataURL(inputFile);
  }
});
=======

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;
var video = document.getElementById('myVideo');
var localStream = null;
navigator.getUserMedia({video: true, audio: false}, 
 function(stream) { // for success case
  console.log(stream);
  var userAngent = window.navigator.userAgent.toLowerCase();

  if(userAngent.indexOf('chrome')!=-1){
    video.srcObject = stream;
  }else{
  video.src = window.URL.createObjectURL(stream);
  }
},
 function(err) { // for error case
  console.log(err);
 }
);
>>>>>>> remotes/origin/main
