function urlCorreta(url) {
	var separa = url.split('/');
	var urlOK = 'http://' + separa[0] + '/rebornxp/' + separa[0] + '/' + separa[1];
	return urlOK;
}

function nome(name){
	var sep = name.split('.');
	return NomeArquivo = sep[0];
}

$(function(){

	var filemanager = $('.filemanager'),
		breadcrumbs = $('.breadcrumbs'),
		fileList = filemanager.find('.data');

	// Start by fetching the file data from scan.php with an AJAX request

	$.get('scan.php', function(data) {

		var response = [data],
			currentPath = '',
			breadcrumbsUrls = [];

		var folders = [],
			files = [];

		// This event listener monitors changes on the URL. We use it to
		// capture back/forward navigation in the browser.

		$(window).on('hashchange', function(){

			goto(window.location.hash);

			// We are triggering the event. This will execute 
			// this function on page load, so that we show the correct folder:

		}).trigger('hashchange');


		// Hiding and showing the search box

		$('#topBar').find('.search').click(function(){
			var search = $(this);

			// search.find('span').hide();
			// search.find('input[type=search]').show().focus();

		});


		// Listening for keyboard input on the search field.
		// We are using the "input" event which detects cut and paste
		// in addition to keyboard input.
		
		$('#topBar').find('.search').on('input', function(e){
			folders = [];
			files = [];

			var value = this.value.trim();

			if(value.length) {

				filemanager.addClass('searching');

				// Update the hash on every key stroke
				window.location.hash = 'search=' + value.trim();

			}

			else {

				filemanager.removeClass('searching');
				window.location.hash = encodeURIComponent(currentPath);

			}

		}).on('keyup', function(e){
			
			// Clicking 'ESC' button triggers focusout and cancels the search

			var search = $(this);

			if(e.keyCode == 27) {

				search.trigger('focusout');

			}

		}).focusout(function(e){

			// Cancel the search

			var search = $(this);

			if(!search.val().trim().length) {

				window.location.hash = encodeURIComponent(currentPath);
				// search.hide();
				// search.parent().find('span').show();

			}

		});


		// Clicking on folders

		fileList.on('click', 'li.folders', function(e){
			e.preventDefault();

			var nextDir = $(this).find('a.folders').attr('href');

			if(filemanager.hasClass('searching')) {

				// Building the breadcrumbs

				breadcrumbsUrls = generateBreadcrumbs(nextDir);

				filemanager.removeClass('searching');
				filemanager.find('input[type=search]').val('').hide();
				filemanager.find('span').show();
			}
			else {
				breadcrumbsUrls.push(nextDir);
			}

			window.location.hash = encodeURIComponent(nextDir);
			currentPath = nextDir;
		});


		// Clicking on breadcrumbs

		breadcrumbs.on('click', 'a', function(e){
			e.preventDefault();

			var index = breadcrumbs.find('a').index($(this)),
				nextDir = breadcrumbsUrls[index];

			breadcrumbsUrls.length = Number(index);

			window.location.hash = encodeURIComponent(nextDir);

		});


		// Navigates to the given hash (path)

		function goto(hash) {

			hash = decodeURIComponent(hash).slice(1).split('=');

			if (hash.length) {
				var rendered = '';

				// if hash has search in it

				if (hash[0] === 'search') {

					filemanager.addClass('searching');
					rendered = searchData(response, hash[1].toLowerCase());

					if (rendered.length) {
						currentPath = hash[0];
						render(rendered);
					}
					else {
						render(rendered);
					}

				}

				// if hash is some path

				else if (hash[0].trim().length) {

					rendered = searchByPath(hash[0]);

					if (rendered.length) {

						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);

					}
					else {
						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);
					}

				}

				// if there is no hash

				else {
					currentPath = data.path;
					breadcrumbsUrls.push(data.path);
					render(searchByPath(data.path));
				}
			}
		}

		// Splits a file path and turns it into clickable breadcrumbs

		function generateBreadcrumbs(nextDir){
			var path = nextDir.split('/').slice(0);
			for(var i=1;i<path.length;i++){
				path[i] = path[i-1]+ '/' +path[i];
			}
			return path;
		}


		// Locates a file by path

		function searchByPath(dir) {
			var path = dir.split('/'),
				demo = response,
				flag = 0;

			for(var i=0;i<path.length;i++){
				for(var j=0;j<demo.length;j++){
					if(demo[j].name === path[i]){
						flag = 1;
						demo = demo[j].items;
						break;
					}
				}
			}

			demo = flag ? demo : [];
			return demo;
		}


		// Recursively search through the file tree

		function searchData(data, searchTerms) {

			data.forEach(function(d){
				if(d.type === 'folder') {

					searchData(d.items,searchTerms);

					if(d.name.toLowerCase().match(searchTerms)) {
						folders.push(d);
					}
				}
				else if(d.type === 'file') {
					if(d.name.toLowerCase().match(searchTerms)) {
						files.push(d);
					}
				}
			});
			return {folders: folders, files: files};
		}


		// Render the HTML for the file manager

		function render(data) {

			var scannedFolders = [],
				scannedFiles = [];

			if(Array.isArray(data)) {

				data.forEach(function (d) {

					if (d.type === 'folder') {
						scannedFolders.push(d);
					}
					else if (d.type === 'file') {
						scannedFiles.push(d);
					}

				});

			}
			else if(typeof data === 'object') {

				scannedFolders = data.folders;
				scannedFiles = data.files;

			}


			// Empty the old result and make the new one

			fileList.empty().hide();

			if(!scannedFolders.length && !scannedFiles.length) {
				filemanager.find('.nothingfound').show();
			}
			else {
				filemanager.find('.nothingfound').hide();
			}

			if(scannedFolders.length) {

				scannedFolders.forEach(function(f) {

					var itemsLength = f.items.length,
						name = escapeHTML(f.name),
						icon = '<img class="icon" src="assets/imagens/icons/shell32.dll_14_4.ico" />';

					if(itemsLength) {
						icon = '<img class="icon" src="assets/imagens/icons/shell32.dll_14_4.ico" />';
					}

					if(itemsLength == 1) {
						itemsLength += ' item';
					}
					else if(itemsLength > 1) {
						itemsLength += ' items';
					}
					else {
						itemsLength = 'Empty';
					}
					var folder = $('<li class="folders"><a href="' + f.path + '" title="' + f.path + '" class="folders">' + icon + '</br><center><span class="name">' + name + '</span></center></a></li>');
					folder.appendTo(fileList);
				});

			}

			if(scannedFiles.length) {

				scannedFiles.forEach(function(f) {

					var fileSize = bytesToSize(f.size),
						name = escapeHTML(f.name),
						fileType = name.split('.'),
						icon = '<span class="icon file"></span>';

					fileType = fileType[fileType.length-1];
					switch(fileType) {
						// Tipo Imagem
						case "jpg":
						case "jpeg":
							ico = "shimgvw.dll_14_4.ico";
							break;

						case "png":
							ico = "shimgvw.dll_14_5.ico";
							break;

						case "bmp":
							ico = "shimgvw.dll_14_2.ico";
							break;

						case "gif":
						case "ico":
							ico = "shimgvw.dll_14_3.ico";
							break;

						// Tipo Video
						case "avi":
						case "mpeg":
						case "mov":
						case "mkv":
						case "mp4":
							ico = "wmploc.dll_14_466.ico";
						break;

						case "rm":
						case "rmvb":
							ico = "121 RealPlayerFile.ico";
						break;

						// Tipo Audio
						case "mp3":
						case "wma":
						case "aac":
						case "ogg":
						case "wave":
							ico = "shell32.dll_14_277.ico";
						break;

						case "wav":
							ico = "mmsys.cpl_14_4370.ico";
						break;

						case "mdi":
						case "mid":
						case "midi":
							ico = "mmsys.cpl_14_4371.ico";
						break;

						// Tipo Word
						case "doc":
						case "docx":
						case "docm":
						case "dotx":
						case "dotm":
						case "odt":
							ico = "moricons.dll_14_109.ico";
						break;

						// Tipo Excel
						case "xlsx":
						case "xlsm":
						case "xltx":
						case "xltm":
						case "xlsb":
						case "xlam":
						case "xls":
							ico = "moricons.dll_14_110.ico";
						break;

						// Tipo Power Point
						case "pptx":
						case "pptm":
						case "potx":
						case "ppam":
						case "ppsx":
						case "ppsm":
						case "sldx":
						case "sldm":
						case "thmx":
						case "ppt":
							ico = "moricons.dll_14_112.ico";
						break;

						// Tipo Texto
						case "txt":
							ico = "shell32.dll_14_152.ico";
						break;

						// Tipo PDF
						case "pdf":
							ico = "000 pdf_Acrobat Document.ico";
						break;

						// Tipo Flash
						case "fla":
							ico = "002 fla_spa_Flash Documents.ico";
						break;

						case "swf":
							ico = "012 spl_swf_swt_Shockwave Flash Movie.ico"
						break;

						// Tipo Web
						case "js":
							ico = "053 js_JScript Script File.ico";
						break;

						case "html":
							ico = "083 html_HTMLDocument.ico";
						break;

						case "php":
							ico = "084 php_PHPFile.ico";
						break;

						case "shtml":
							ico = "086 shtml_ServerSideIncludes.ico";
						break;

						case "xhtml":
							ico = "087 xhtml_XHTMLFile.ico";
						break;

						case "css":
							ico = "088 css_Cascading Style Sheet.ico";
						break;
						
						case "mht":
						case "mhtml":
							ico = "089 mht_mhtml_MHTMLDocument.ico";
						break;

						case "svg":
						case "svgz":
							ico = "090 svg_svgz_SVGDocument.ico";
						break;

						case "xml":
							ico = "091 xml_XMLDocument.ico";
						break;

						case "hta":
							ico = "095 hta_HTMLApplication.ico";
						break;

						// Tipo Fonte
						case "tff":
							ico = "fontext.dll_14_2.ico";
						break;

						case "otf":
							ico = "fontext.dll_14_4.ico";
						break;

						case "woff":
							ico = "fontext.dll_14_6.ico";
						break;

						// Tipo Arquivos Interno do Windows
						case "reg":
							ico = "regedit.exe_14_101.ico";
						break;

						case "lnk":
							ico = "shell32.dll_14_30.ico";
						break;

						case "ini":
							ico = "shell32.dll_14_151.ico";
						break;

						case "run":
						case "bat":
							ico = "shell32.dll_14_153.ico";
						break;

						case "dll":
							ico = "shell32.dll_14_154.ico";
						break;

						case "theme":
							ico = "themeui.dll_14_701.ico";
						break;

						// Tipo Executavel
						case "msi":
							ico = "wextract.exe_14_3000.ico";
						break;

						case "exe":
							ico = "shell32.dll_14_271.ico";
						break;

						// Tipo Impressão
						case "xps":
							ico = "xps.png";
						break;

						// Tipo Text Rich
						case "rtf":
							ico = "shell32.dll_14_2.ico";
						break;

						// Tipo Zip
						case "zip":
							ico = "zipfldr.dll_14_101.ico";
						break;

						// Tipo 7Zip
						case "7z":
						case "7zip":
							ico = "7z.png";
						break;

						// Tipo Rar
						case "rar":
							ico = "069 rar_WinRar File.ico";
						break;

						default:
							ico = 'cabview.dll_14_105.ico';
						break;
					}

					icon = '<img class="icon" src="assets/imagens/icons/' + ico + '" />';

					var urlAtual = urlCorreta(f.path);
					var nomeArquivo = nome(name);
					var file = "";

					switch(fileType) {
						case 'doc':
						case "txt":
						case "odt":
						case "docx":
						case "xls":
						case "ods":
						case "xlsx":
						case "csv":
						case "pptx":
						case "pdf":
						case "xml":
							file = $('<li class="files"><a data-fancybox data-type="iframe" data-src="https://docs.google.com/gview?url=' + urlAtual + '&amp;embedded=true" title="' + nomeArquivo + '" href="javascript:;" class="files">' + icon + '</br><center><span class="name">' + name + '</span></center></a></li>');
						break;

						case "jpg":
						case "jpeg":
						case "png":
						case "bmp":
						case "gif":
						case "ico":
						case "svg":
							file = $('<li class="files"><a data-fancybox data-fancybox="images" href="' + urlAtual + '" title="' + nomeArquivo + '" href="javascript:;" class="files">' + icon + '</br><center><span class="name">' + name + '</span></center></a></li>');
							break;

						case "avi":
						case "mpeg":
						case "mov":
						case "mkv":
						case "mp4":
						case "mp3":
						case "wma":
						case "aac":
						case "ogg":
						case "wave":
						case "wav":
						case "mdi":
						case "mid":
						case "midi":
							file = $('<li class="files"><a data-fancybox data-type="iframe" href="' + urlAtual + '" title="' + nomeArquivo + '" href="javascript:;" class="files">' + icon + '</br><center><span class="name">' + name + '</span></center></a></li>');
							break;

						default:
							file = $('<li class="files"><a href="' + urlAtual + '" title="' + nomeArquivo + '" class="files" download="' + nomeArquivo + '">' + icon + '</br><center><span class="name">' + name + '</span></center></a></li>')
						break;
					}
					
					file.appendTo(fileList);
				});

			}


			// Generate the breadcrumbs

			var url = '';

			if(filemanager.hasClass('searching')){

				url = '<span>Search results: </span>';
				fileList.removeClass('animated');

			}
			else {

				fileList.addClass('animated');

				breadcrumbsUrls.forEach(function (u, i) {

					var name = u.split('/');

					if (i !== breadcrumbsUrls.length - 1) {
						url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">/</span> ';
					}
					else {
						url += '<span class="folderName">' + name[name.length-1] + '</span>';
					}

				});

			}

			breadcrumbs.text('').append(url);


			// Show the generated elements

			fileList.animate({'display':'inline-block'});

		}


		// This function escapes special html characters in names

		function escapeHTML(text) {
			return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
		}


		// Convert file sizes from bytes to human readable units

		function bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}

	});
});