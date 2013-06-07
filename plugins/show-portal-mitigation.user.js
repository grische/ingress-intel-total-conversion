// ==UserScript==
// @id             iitc-plugin-show-mitigation
// @name           IITC plugin: show portal mitigation
// @version        0.1.0.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Uses the fill color of the portals to see the mitigation due to shields.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.portalMitigation = function() {};

window.plugin.portalMitigation.highlightMitigation = function(data) {
  var d = data.portal.options.details;
  var mitigation = 0;
  if(getTeam(d) !== TEAM_NONE) {
    $.each(d.portalV2.linkedModArray, function(ind, mod) {
      if(mod !== null) {
        if(mod.type === 'RES_SHIELD') {
            mitigation += parseInt(mod.stats.MITIGATION);
        }
      }
    });
    //console.debug("Portal: mit="+mitigation+" at "+d.portalV2.descriptiveText.TITLE);

    var fill_opacity = 0.9;
    var color = 'DarkMagenta';
    if (mitigation == 0) {
      color = COLORS[getTeam(data.portal.options.details)];
      fill_opacity = 0.7;
    }
    else if (mitigation < 15) {
      color = 'white';
      fill_opacity = 1.0;
    }
    else if (mitigation < 31) {
      color = 'gray';
      fill_opacity = 0.7;
    }
    else if (mitigation < 51) {
      color = 'yellow';
    }
    else if (mitigation < 76) {
      color = 'orange';
    }
    else if (mitigation < 95) {
      color = 'red';
    }
    var params = {fillColor: color, fillOpacity: fill_opacity};
    data.portal.setStyle(params);
  }
  window.COLOR_SELECTED_PORTAL = '#f0f';
}

var setup =  function() {
  window.addPortalHighlighter('Portal Shield Mitigation', window.plugin.portalMitigation.highlightMitigation);
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
