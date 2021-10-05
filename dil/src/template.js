
export function Createsample(){
    var main = document.getElementsByClassName();
    var img_element = document.createElement("img");
	img_element.src = "../../image/0238_corner.png";
	img_element.alt = "sample1";
	img_element.width = main.width;
    img_element.height = main.height;
    $('.print-area').append(img_element);

}