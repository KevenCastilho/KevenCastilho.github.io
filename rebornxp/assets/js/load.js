var scripts = [
  'assets/js/core.js',
  'assets/js/window-api.js',
  'assets/js/contextmenus.js',
  'assets/js/filesystem.js',
  'assets/js/xp.js',
  'assets/js/jquery.terminal-2.0.0.min.js',
  'assets/js/unix_formatting.js',
  'assets/js/terminal.js',
  'assets/js/script.js',
  'assets/js/explorer.js',
  'assets/js/help.js',
  'assets/js/browser.js',
  'assets/js/Keven Castilho.js',
  'assets/js/ps.js',
  'assets/js/browserquest.js',
  'assets/js/paint.js',
  'assets/js/arquivos.js',
  'assets/js/notepad.js',
  'assets/js/imageviewer.js',
  'assets/js/mediaplayer.js',
  'assets/js/config.js',
  'assets/js/controlpanel.js',
  'assets/js/uac.js',
  'assets/js/audio.js',
  'assets/js/lambda.js',
  'assets/js/minesweeper.js',
  'assets/js/appstore.js',
  'assets/js/boot.js',
//    NÃO FUNCIONAM
//   'assets/js/skype.js',
//   'assets/js/discord.js',
//   'assets/js/fo3radio.js',
//   'assets/js/mineroom.js',
//   'assets/js/vscode.js',
//   'assets/js/whatsapp.js',
];
var stylesheets = [
  'assets/css/fonts.css',
  'assets/css/xp.css',
  'assets/css/icons.css',
  'assets/css/widgets.css',
  'assets/css/window.css',
  'assets/css/contextmenus.css',
  'assets/css/cursors.css',
  'assets/css/desktop.css',
  'assets/css/startmenu.css',
  'assets/css/explorer.css',
  'assets/css/jquery.terminal-2.0.0.min.css'
];
var requiredDirectories = [];

$(function() {
  $('windows').html(`
<div class="_ui_boot">
  <div class="_ui_boot_copyright"></div>
  <div class="_ui_boot_companylogo"></div>
  <center class="_ui_boot_logo">
    <div class="_ui_boot_winlogo"></div>
    <div class="_ui_boot_progress"></div>
    <!--<div style="bottom:0;position:absolute;width:100%;" id="loadingstatus"></div>-->
  </center>
</div>`);
  console.log('Loading scripts and stylesheets...');
	$('<link/>', { rel: 'stylesheet', href: 'assets/css/boot.css'}).appendTo('head');
  var scriptsindex = 0;
  var stylesindex = 0;
  
  function loadStylesheets() {
    $.ajax({
      url: stylesheets[stylesindex],
      dataType: "html",
	  contentType : 'text/plain',
      success: function(data){
        $("#res").append(data);
        stylesindex ++;
        if (stylesindex < stylesheets.length) {
          loadStylesheets();
        } else {
          loadScripts();
        }
      }
    });
  }
  
  function loadScripts() {
    $.ajax({
      url: scripts[scriptsindex],
      dataType: "script",
      success: function(data){
        scriptsindex ++;
        if (scriptsindex < scripts.length) {
          loadScripts();
        } else {
          console.log('Finished loading');
          console.log('Checking for necessary directories');
          
          function checkDir(path, callback) {
            var times = 0;
            xp.filesystem.listDir(path, (e) => {
              if (times === 0)
                callback(typeof e === 'string');
              times ++;
            });
          }
          
          var i = 0;
          function checkNextDir(t) {
            var dirToCreate = requiredDirectories[i];
            if (dirToCreate !== undefined) {
              xp.filesystem.createDir(dirToCreate, (e) => {
                i ++;
                checkNextDir();
              });
            } else {
              xp.audio.init();
              var event = new Event('xpboot');
              window.dispatchEvent(event);
              console.log('Dispatched boot event');
              $('windows').html('<div class="_ui_wallpaper fullscreen"><img class="_ui_wallpaper_image" src="https://i.redd.it/p0j4iwha2q351.png"/></div>');
              $.getScript('assets/js/login.js');
              xp.audio.playURL('https://cdn.glitch.com/01d2e04f-e49d-4304-aa9e-55b9849b4cce%2FWindows%20XP%20Startup.wav?1522620562681');
            }
          }
          
          xp.filesystem.create(512*1024*1024, () => {
            xp.filesystem.fs.root.getDirectory('/', {create: false}, function(dirEntry) {
              var dirReader = dirEntry.createReader();
              var entries = [];

              function readEntries() {
                dirReader.readEntries (function(results) {
                  if (results.length === 0) {
                    $('._ui_boot').remove();
                    $('windows').html('<div class="_ui_wallpaper fullscreen"><img class="_ui_wallpaper_image" src="https://i.redd.it/p0j4iwha2q351.png"/></div>');
                    $.getScript('assets/js/setup.js');
                  } else {
                    xp.filesystem.createDir('/WINDOWS', (e) => {
                      requiredDirectories = [
                        '/WINDOWS',
                        '/WINDOWS/system32',
                        '/WINDOWS/startup',
                        '/Program Files',
                        '/Documents and Settings'
                      ];
                      checkNextDir();
                    });
                  }
                }, console.error);
              };

              readEntries();
            }, console.error);
          });
        }
      }
    });
  }
  
  loadStylesheets();
});
