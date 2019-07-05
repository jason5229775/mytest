set_size();
window.onresize = function(){
	set_size();
}
function set_size(){
	var ele=document.getElementsByTagName("html")[0],  
  size=ele.clientWidth/19.2;  
	ele.style.fontSize=size+"px"  
}

	document.oncontextmenu = new Function("return false");	// 禁用右键
	document.ondragstart = new Function("return false");	// 禁用拖拽
	document.onselectstart = new Function("return false");	// 禁用选中，包括全选和拖选
	document.oncopy = new Function("return false");		// 禁止复制
	document.onpaste = new Function("return false");	// 禁止粘贴
	document.oncut = new Function("return false");		// 禁止剪切