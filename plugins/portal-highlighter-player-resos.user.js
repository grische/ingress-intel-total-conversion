// ==UserScript==
// @id             iitc-plugin-players-resonator-highlighter
// @name           IITC plugin: Highlight Player Resonators
// @version        0.1.5.20130902.80212
// @description    [jonatkins-test-2013-09-02-080204] The plugins finds the resonators of a given player. The input is in the sidebar.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==


function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if (typeof window.plugin !== 'function') window.plugin = function() {};



// PLUGIN START ////////////////////////////////////////////////////////

/*********************************************************************************************************
* Changelog:
*
* 0.1.0 First private release
*********************************************************************************************************/

// use own namespace for plugin
window.plugin.playersResonatorHighlighter = function() {};

window.plugin.playersResonatorHighlighter.findReso = function(playername) {
  var s = "";
  var effectiveNick = "";
  var portalCounter = 0;
  // Assuming there can be no agents with same nick with different lower/uppercase
  var nickToFind = playername.toLowerCase();
  $.each(window.portals, function(ind, portal){
      var resoCounter = 0;
      var r = portal.options.details.resonatorArray.resonators;
      $.each(r, function(ind, reso) {
          if (!reso) return true; 
          var nick = getPlayerName(reso.ownerGuid);
          if (nick.toLowerCase() === nickToFind){
              resoCounter += 1;
              if (!effectiveNick) {
                effectiveNick = nick;              
              }
              if ( resoCounter == 1 ) {
                portalCounter += 1;
              }
          }
      });
      
      if (resoCounter == 0) {
        var params = {fillColor: COLORS[TEAM_NONE], color: COLORS[TEAM_NONE], opacity: 0.1, fillOpacity: 0.1, radius: 0, weight: 0};
        portal.setStyle(params);
      }
  });
  if ( portalCounter > 0 ) {
    s = 'Found ' + portalCounter + ' portals of ' + effectiveNick;
  } else {
    s = playername + " has no resonators in this range\n";  
  }
  alert(s);
}

var setup = function() {
  var content = '<input id="playerResoHighlight" placeholder="Enter playername to hide all portals without resos of player..." type="text">';
  $('#sidebar').append(content);
  $('#toolbox').append('  <a onclick=$("#playerResoHighlight").focus() title="Hide all portals with no resonators of a certain player">Player\'s Reso</a>');
  $("#playerResoHighlight").keypress(function(e) {
    if((e.keyCode ? e.keyCode : e.which) !== 13) return;
    var data = $(this).val();
    window.plugin.playersResonatorHighlighter.findReso(data);
  });
}

// PLUGIN END //////////////////////////////////////////////////////////


if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);


