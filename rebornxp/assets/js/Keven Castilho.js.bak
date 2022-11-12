var site = `kevencastilho.github.io/`;

function browserGo(loc, guid) {
	if (!loc) {
		loc = document.getElementById('url_' + guid).value;
	}
	if (loc.indexOf('http://') == -1 && loc.indexOf('https://') == -1) {
		loc = location.protocol + '//' + loc;
	}
	document.getElementById('webPage_' + guid).src = loc;
	document.getElementById('url_' + guid).value = loc;
	document.getElementById('loading_' + guid).style.display = 'block';
	document.getElementById('webPage_' + guid).style.display = 'none';
}
function iframeContentUnload(guid) {
	document.getElementById('loading_' + guid).style.display = 'block';
	document.getElementById('webPage_' + guid).style.display = 'none';
}
function iframeContentLoaded(guid) {
	document.getElementById('loading_' + guid).style.display = 'none';
	document.getElementById('webPage_' + guid).style.display = 'block';
}

$(window).on('xpboot', function () {
	xp.applications.add('Keven Castilho', (args) => {
		var guid = generate_guid();
		var el = $.parseHTML(`<window title="Keven Castilho" width="640" height="480">
		<style>
	.load-overlay {
	  position: absolute;
	  top: 24;
	  left: 0;
	  width: 100%;
	  height: calc(100% - 24px);
	  background: #d6d6ce;
	  z-index: 9999;
	  text-align: center;
	}

	.load-overlay-cell {
	  position: absolute;
	  top: calc(50% - 100px);
	  left: calc(50% - 100px);
	}

	@keyframes lds-dual-ring{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes lds-dual-ring{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.lds-dual-ring{position:relative}.lds-dual-ring div{position:absolute;width:40px;height:40px;top:80px;left:80px;border-radius:50%;border:4px solid #000;border-color:#51CACC transparent;-webkit-animation:lds-dual-ring 1s linear infinite;animation:lds-dual-ring 1s linear infinite}.lds-dual-ring{width:200px!important;height:200px!important;-webkit-transform:translate(-100px,-100px) scale(1) translate(100px,100px);transform:translate(-100px,-100px) scale(1) translate(100px,100px)}
		</style>
		<div id="webBrowserContent">
		  <div style="width:calc(100% - 5px);height:calc(100% - 27px);">
			<div style="display: none" id="loading_` + guid + `" title="Loading..." class="load-overlay">
			  <div class="load-overlay-cell">
				<div class="lds-css ng-scope"><div style="width:100%;height:100%" class="lds-dual-ring"><div></div></div></div>
			  </div>
			</div>
			<iframe style="width: calc(100.75%);height: calc(106%);position: relative;top: 0px;left: 0px;display: block;border: 0px;" onload="iframeContentLoaded('` + guid + `')" onunload="iframeContentUnload('` + guid + `')" src="` + location.protocol + `//` + site + `" id="webPage_` + guid + `"></iframe>
		  </div>
		</div>
	  </window>`);
		document.body.appendChild(el[0]);
		$(el).updateWindow();
		var widthOffset = 30;
		var heightOffset = 80;
		window.iFrameChanges = -1;
	});

	xp.applications.add('html', (args) => {
		var el = $.parseHTML(`<window title="` + args[1] + `" width="640" height="480">
	<style>
	  iframe[seamless]{
		background-color: transparent;
		border: 0px none transparent;
		padding: 0px;
		overflow: hidden;
	  }
	  .frame-container {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 0px;
		margin: 0px;
	  }
	</style>
	<div class="frame-container">
	  <iframe seamless="seamless" width="100%" height="100%" id="frame" src="` + args[1] + `"></iframe>
	</div>
  </window>`);
		document.body.appendChild(el[0]);
		$(el).updateWindow();
	});

	xp.startmenu.add('Keven Castilho', 'Keven Castilho', 'assets/imagens/keven.ico');
});