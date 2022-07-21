var langs_url = [];
var langs = {}
var lang_check = 0;
async function gitJson(url, campos){
	var jSon = await $.ajax({url});
	var repos = await destrinchaJson(jSon,campos,false);
	var numRepos = await destrinchaJson(repos,campos,true);
	var cards = await criarCards(repos,numRepos,3,'#gitLista','#indicadores','#gitcont');
	var langg = await linguagens_url(langs_url);
	var lang_loop = await linguagens_loop(langg);
	var langs_html = await trataLinguagens(langs);
}

function criarCards(arr,numRepos,numCards,divID,indicadoresID,gitcontID){
	var contar = 1;
	var conta_indicadores = 0;
	var div = $(divID);
	var indica = $(indicadoresID);
	var gitcont = $(gitcontID);
	var itens = '';
	var itens_indicadores = '';
	for(var i=0;i<numRepos; i++){
		if(contar == 1){
			itens += '<div class="carousel-item';
			if(i==0){itens += ' active'}
			itens +='"><div class="row">';
		}
		itens +=
		'<div class="col-12 col-sm-4">'+
		'<div class="card text-center">'+
		'<div class="card-header">'+arr["Repositorio_"+i]["full_name"]+'</div>'+
		'<div class="card-body">'+
		'<p class="card-text">'+arr["Repositorio_"+i]["description"]+'</p>'+
		'<a href="'+arr["Repositorio_"+i]["html_url"]+'" class="btn btn-primary">Acessar</a>'+
		'</div>'+
		'<div class="card-footer text-muted">'+
		arr["Repositorio_"+i]["data"]+' '+arr["Repositorio_"+i]["hora"]+
		'</div>'+
		'</div>'+
		'</div>';
		if(contar == numCards){
			itens += '</div></div>';
			itens_indicadores += '<button type="button"'+
			'data-bs-target="#githubLista" data-bs-slide-to="'+
			conta_indicadores+'"';
			if(i==2){itens_indicadores += 'class="active"'}
			itens_indicadores += 'aria-current="true" aria-label="Slide '+
			conta_indicadores+'"></button>';
			conta_indicadores++;
		}
		contar++;
		if(contar > numCards){
			contar = 1;
		}
	}
	div.html(itens);
	indica.html(itens_indicadores);
	gitcont.html(numRepos);
	return i;
}

function timestampBR(datahora,retorno){
	var data_cria_separa = datahora.split('T');
	var data_solo = data_cria_separa[0];
	var data_separa = data_solo.split('-');
	var data = data_separa[2]+'/'+data_separa[1]+'/'+data_separa[0];
	var hora = data_cria_separa[1].replace('Z','');
	if(retorno == true){
		return data;
	} else {
		return hora;
	}
}

function destrinchaJson(arr,cmps,retorno){
	var arrRetorno = {};
	var obj = {};
	var indice = 00;
	Object.entries(arr).forEach(([chave, valor]) => {
		obj = {};
		Object.entries(valor).forEach(([subChave, subValor]) => {
			cmps.forEach(item => {
				if(
					subChave != undefined &&
					subChave != null &&
					subChave != '' &&
					subValor != undefined &&
					subValor != null &&
					subValor != '' &&
					subChave == item){
						if(item == 'created_at'){
							obj['data'] = timestampBR(subValor,true);
							obj['hora'] = timestampBR(subValor,false);
						} else {
							obj[subChave] = subValor;
						}
					}
				})
				if(lang_check == 0){
					if(subChave == 'languages_url'){
						if(
							subChave != undefined &&
							subChave != null &&
							subChave != '' &&
							subValor != undefined &&
							subValor != null &&
							subValor != '' ){
								langs_url.push(subValor);
							}
						}
					}
				})
				if(
					valor.hasOwnProperty('description') == false ||
					valor.description == null
				){ obj['description'] = 'Nenhuma descrição disponivel.'; }
				var objNome = 'Repositorio_'+indice;
				arrRetorno[objNome] = obj;
				indice++;
			})
			if(lang_check == 0){
				lang_check = 1;
			}
			if(retorno == true){
				return indice;
			} else {
				return arrRetorno;
			}
		}

		async function linguagens_url(arr){
			var req = [];
			arr.forEach(item => {
				req.push($.ajax({url: item}));
			})
			var ret = await Promise.all(req);
			return ret;
		}

		function linguagens_loop(ret){
			ret.forEach(item => {
				if(Array.isArray(item)){
					linguagens_loop(item);
				} else {
					Object.entries(ret).forEach(([subChave, subValor]) => {
						var Atual = Object.entries(subValor);
						if(Atual.length > 0){
							Atual.forEach(([itemNome,itemValor]) => {
								if(langs[itemNome]){
									langs[itemNome] += itemValor;
								} else {
									langs[itemNome] = itemValor;
								}
							})
						}
					})
				}
			})
			langs = Object.keys(langs).map(lang => {
				return {
					lang,
					value: langs[lang]
				}
			})
			langs.sort((a,b) => b.value - a.value);
		}

		function trataLinguagens(arrObj){
			var divLinguagens = $('#linguagem_utilizada');
			var tbLinguagens = $('#langs_table');
			var htmlLinguagens = '';
			var tableLinguagens = '';
			var valores = 0;
			var linhas = 1;
			arrObj.forEach(item => {
				valores += item.value;
			});
			arrObj.forEach(item => {
				var porcentagem = (item.value/valores)*100;
				tableLinguagens +=
				'<tr>'+
					'<th class="table-active" scope="row">'+linhas+
					'<td>'+item.lang+'</td>'+
					'<td>'+item.value+'</td>'+
				'</tr>';
				linhas++;
				if(Math.floor(porcentagem) > 0){
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
			tbLinguagens.html(tableLinguagens);
		}

		$(document).ready(function(){
			gitJson('https://api.github.com/users/KevenCastilho/repos',
			['full_name','created_at','description','url','html_url','languages_url']);
		});
