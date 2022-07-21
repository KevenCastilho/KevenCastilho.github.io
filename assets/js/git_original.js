var git;
var linguagensLinksArray = new Array();
var arrLinguagem = [];
var arrAllLang = new Array();
var arrAllLangLimpo = new Array();
$.ajax({
	url: 'https://api.github.com/users/KevenCastilho/repos',
	beforeSend: function(xhr) {
	}, success: function(jsonGit){
		var tempArray;
		var itens = '';
		var itens_indicadores = '';

		var titulo;
		var desc;
		var link;
		var data_cria;

		var conta_item = 1;
		var conta_repos = 0;
		var conta_indicadores = 0;

		var repoLinguagem;

		var gitLista = document.getElementById('gitLista');
		var indicadores = document.getElementById('indicadores');
		var gitcont = document.getElementById('gitcont');
		for(var i = 0; i < jsonGit.length; i++){
			tempArray = jsonGit[i];
			titulo = tempArray['name'];
			if(tempArray['description'] == null){
				desc = 'Nenhuma descrição disponivel.'
			} else {
				desc = tempArray['description'];
			}
			link = tempArray['html_url'];
			data_cria = tempArray['created_at'];
			var data_cria_separa = data_cria.split('T');
			var data_solo = data_cria_separa[0];
			var data_separa = data_solo.split('-');
			var data = data_separa[2]+'/'+data_separa[1]+'/'+data_separa[0];
			var hora = data_cria_separa[1].replace('Z','');
			var linguagens = String(tempArray['languages_url']);

			linguagensLinksArray.push(linguagens);

			if(conta_item == 1){
				itens += '<div class="carousel-item'; if(i==0){itens += ' active'} itens +='"><div class="row">';
			}

			itens +=
			'<div class="col-12 col-sm-4">'+
			'<div class="card text-center">'+
			'<div class="card-header">'+titulo+'</div>'+
			'<div class="card-body">'+
			'<p class="card-text">'+desc+'</p>'+
			'<a href="'+link+'" class="btn btn-primary">Acessar</a>'+
			'</div>'+
			'<div class="card-footer text-muted">'+data+' '+hora+'</div>'+
			'</div>'+
			'</div>';

			if(conta_item == 3){
				itens += '</div></div>';
				itens_indicadores += '<button type="button" data-bs-target="#githubLista" data-bs-slide-to="'+conta_indicadores+'"'; if(i==2){itens_indicadores += 'class="active"'} itens_indicadores += 'aria-current="true" aria-label="Slide '+conta_indicadores+'"></button>';
				conta_indicadores++;
			}
			conta_item++;
			if(conta_item > 3){
				conta_item = 1;
			}
			indicadores.innerHTML = itens_indicadores;
			gitLista.innerHTML = itens;
			conta_repos++;
		}
		gitcont.innerHTML = conta_repos;
		for(let i = 0; i < linguagensLinksArray.length; i++) {
			var arr = linguagensLinksArray[i];
			$.ajax({
				url: arr,
				beforeSend: function(xhr) {},
				success: function(links){
					arrLinguagem.push(links);
					if(i == linguagensLinksArray.length-1){
						var arrs = 0;
						function isKeyExists(obj,key){
							return key in obj;
						}
						function rodarArray(arr){
							for(var j = 0; j < arr.length; j++){
								var itemAtual = arr[j];
								var Atual = Object.entries(itemAtual);
								if(Atual.length > 0){
									for(var k = 0; k < Atual.length; k++){
										var subItem = Atual[k];
										if(subItem.length > 0){
											for(var l = 0; l < subItem.length; l++){
												var sub = subItem[l];
												var chave = Object.keys(sub);
												var subCont = 1;
												if(l == 0){
													var iAtual = sub;
												} else {
													var iAtual = subItem[l-1];
												}
												if(l > 0){
													var existeChave = iAtual in arrAllLang;
													if(existeChave == true){
														arrAllLang[iAtual] = arrAllLang[iAtual] + sub;
													} else {
														arrAllLang[iAtual] = sub;
													}
												}
											}
										}
									}
								}
							}
						}
						rodarArray(arrLinguagem);
						arrAllLang = Object.keys(arrAllLang).map(lang => {
							return {
								lang,
								value: arrAllLang[lang]
							}
						})
						arrAllLang.sort((a,b) => b.value - a.value);
						var divLinguagens = $('#linguagem_utilizada');
						var htmlLinguagens = '';
						var valores = 0;
						arrAllLang.forEach(item => {
							valores += item.value;
						});
						arrAllLang.forEach(item => {
							var porcentagem = (item.value/valores)*100;
							if(Math.floor(porcentagem) > 0){
								// '<img src="https://img.shields.io/badge/'+item.lang+'-%23E34F26.svg?style=for-the-badge&amp;logo='+item.lang+'&amp;logoColor=white" alt="'+item.lang+'">'+
								htmlLinguagens +=
								'<div class="col-6 col-sm-2 card-left">'+
								'<span class="svg">'+item.lang+'</span>'+
								'</div>'+
								'<div class="col-9 d-none d-sm-block">'+
								'<p class="has-line-data" data-line-start="7" data-line-end="8">'+
								'<div class="progress">'+
								'<div class="progress-bar progress-bar-striped progress-bar-animated bg-site" role="progressbar" aria-valuenow="'+porcentagem+'" aria-valuemin="0" aria-valuemax="100" style="width: '+porcentagem+'%;"></div>'+
								'</div>'+
								'</p>'+
								'</div>'+
								'<div class="col-6 col-sm-1 card-right">'+
								porcentagem.toFixed(2)+'%'+
								'</div>';
							}
						});
						divLinguagens.html(htmlLinguagens);
					}
				}
			})
		}
	}
})
