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
