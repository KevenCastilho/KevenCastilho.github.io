var arr = ['k','m','c'];
var arrMenuItens = ['i','t','e','m'];
var arrTriForce = ['t','r','i','f','o','c','e',''];
var arrZelda = ['z','e','l','d','a'];
var cbm = [];
var secreto = new Audio('assets/sounds/secret.wav');
var ba = new Audio('assets/sounds/chest_open.wav');
var pi = new Audio('assets/sounds/item_get.wav');
var caiu = new Audio('assets/sounds/fall.wav');
var ocarina_sound = new Audio('assets/sounds/ocarina.wav');
var triforce_sound = new Audio('assets/sounds/triforce.wav');
var mb_ocarina_count = 0;
var mb_ocarina = document.getElementById("mb_ocarina");
var ocarina = document.getElementById("ocarina");
var menuItens = document.getElementById("menu_itens");
var container = document.getElementById("container");
var vid = document.getElementById("vid");

function compArrays(arr1,arr2){
	var check = null;
	// comapring each element of array
	for(var i=0;i<arr1.length;i++){
		if(arr1[i] == arr2[i]){
			check = "OK";
			//console.log("arr1[i]: "+arr1[i]+"arr2[i]: "+arr2[i]);
		} else {
			check = "NOK";
			break;
		}
	}
	return check;
}

document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	document.addEventListener('keydown', event => {
		var tecla = event.key.toLowerCase();
		var letra = String(tecla);
		let lastKeyTime = Date.now();
		const currentTime = Date.now();
		if (currentTime - lastKeyTime > 1000) {
			cbm = [];
		}

		cbm.push(letra);
		//console.log(cbm);
		lastKeyTime = currentTime;

		switch(cbm.length) {
			case 3:
			if(compArrays(cbm,arr) == "OK"){
				if(mb_ocarina_count == 0) {
					secreto.play();
					mb_ocarina.style.display = "inline-block";
					mb_ocarina_count = 1;
					cbm = [];
				}
			}
			break;

			case 4:
			if(compArrays(cbm,arrMenuItens) == "OK"){
				caiu.play();
				menuItens.style.display = "inline-block";
				for(var j=0;j<10;j++) {
					var val = j*10;
					var top_val = String(val);
					setTimeout(() => { menuItens.style.top = top_val+"px"; }, 100);
				}
				cbm = [];
			}
			break;

			case 5:
			if(compArrays(cbm,arrZelda) == "OK"){
				var emulador = new bootstrap.Modal(document.getElementById('emulador'), {
					keyboard: false
				});
				emulador.show();
			}
			break;

			case 7:
			if(compArrays(cbm,arrTriForce) == "OK"){
				triforce_sound.play();
				vid.style.backgroundImage = " url('assets/images/triforce.gif')";
				vid.style.opacity = "0.2";
				setTimeout(() => {
					vid.style.opacity = "0.4"; //console.log(vid);
					setTimeout(() => {
						vid.style.opacity = "0.6"; //console.log(vid);
							setTimeout(() => {
								vid.style.opacity = "0.8"; //console.log(vid);
								setTimeout(() => {
									vid.style.opacity = "1"; //console.log(vid);
									setTimeout(() => {
										vid.style.opacity = "0.8"; //console.log(vid);
										setTimeout(() => {
											vid.style.opacity = "0.6"; //console.log(vid);
											setTimeout(() => {
												vid.style.opacity = "0.4"; //console.log(vid);
												setTimeout(() => {
													vid.style.opacity = "1";
													vid.style.backgroundImage = " url('assets/images/anima.png')";
												}, 1500);
											}, 1500);
										}, 1500);
									}, 1500);
								}, 1500);
							}, 1500);
						}, 1500);
					}, 1500);
				}
			break;

			case 8:
				cbm = [];
			break;

		}
	});
});

function ombo(){
	ocarina.style.display = "inline-block";
	mb_ocarina.style.backgroundImage = " url('assets/images/mb_a.png')";
	ba.play();
	mb_ocarina.onclick = "";

}

function p_ocarina() {
	pi.play();
	ocarina.style.display = "none";
	ocarina.onclick = "";
	document.getElementById("ocarina_menu_itens").style.display = "flow-root"
}

function ocarina_menu() {
	var oca_play = 0;
	if(oca_play == 0){
		oca_play = 1;
		ocarina_sound.play();
		setTimeout(() => { oca_play = 0; }, 5000);
	}
}
