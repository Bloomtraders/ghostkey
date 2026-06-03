/**
 * VaultX BlackOps — Countdown + Auto-Price Patch
 * Add to GhostKeys HTML:  <script src="vaultx-patch.js"></script>  before </body>
 *
 * Current price : $59,000  (until June 16 2026 midnight PKT)
 * Price after   : $73,000  (auto-switch on June 17 00:00 PKT / UTC+5)
 */

(function(){

  /* ── Config ── */
  var VX_END   = new Date('2026-06-17T00:00:00+05:00'); // June 16 midnight PKT
  var PRICE_NOW   = '59,000';
  var PRICE_AFTER = '73,000';

  /* ── Inject countdown div + IDs into the VaultX card ── */
  function init(){
    /* Find the VaultX .pp price block via its known content */
    var amEls = document.querySelectorAll('.prod-card .am');
    var vxAm = null;
    for(var i=0;i<amEls.length;i++){
      if(amEls[i].textContent.trim()==='59,000' || amEls[i].textContent.trim()==='73,000'){
        /* double check parent is the VaultX card */
        var card = amEls[i].closest('.prod-card');
        if(card){
          var pnEl = card.querySelector('.pn');
          if(pnEl && pnEl.textContent.toUpperCase().indexOf('VAULTX')!==-1){
            vxAm = amEls[i];
            break;
          }
        }
      }
    }

    if(!vxAm){
      /* fallback: find by text scan */
      var all = document.querySelectorAll('.am');
      for(var j=0;j<all.length;j++){
        if(all[j].parentElement && all[j].closest && all[j].closest('.prod-card')){
          var txt = all[j].textContent.trim();
          if(txt==='59,000'||txt==='73,000'){
            var crd = all[j].closest('.prod-card');
            if(crd && crd.querySelector('.pn') && crd.querySelector('.pn').textContent.toUpperCase().indexOf('VAULT')!==-1){
              vxAm = all[j];
              break;
            }
          }
        }
      }
    }

    if(!vxAm){ console.warn('[vaultx-patch] Could not locate VaultX price element'); return; }

    /* tag it */
    vxAm.id = 'vxPrice';

    /* find the .pp parent and insert countdown after it */
    var ppEl = vxAm.closest('.pp');
    if(ppEl && !document.getElementById('vxCountdown')){
      var cdDiv = document.createElement('div');
      cdDiv.id = 'vxCountdown';
      cdDiv.style.cssText =
        "font-family:'Share Tech Mono',monospace;font-size:10px;" +
        "color:rgba(255,80,80,0.9);border:1px solid rgba(255,80,80,0.35);" +
        "padding:5px 10px;margin-bottom:10px;display:inline-block;letter-spacing:1px;";
      cdDiv.innerHTML = '&#9888; DISCOUNT ENDS: <span id="vxTimer">--d --h --m --s</span>';
      ppEl.parentNode.insertBefore(cdDiv, ppEl.nextSibling);
    }

    /* tag the payment form <select> option */
    var opts = document.querySelectorAll('select option');
    for(var k=0;k<opts.length;k++){
      if(opts[k].textContent.indexOf('VaultX')!==-1 || opts[k].textContent.indexOf('vaultx')!==-1){
        opts[k].id = 'vxOption';
        break;
      }
    }
  }

  /* ── Tick every second ── */
  function tick(){
    var now = new Date();
    var exp = now >= VX_END;

    var pEl  = document.getElementById('vxPrice');
    var cdEl = document.getElementById('vxCountdown');
    var tEl  = document.getElementById('vxTimer');
    var optEl= document.getElementById('vxOption');

    if(exp){
      if(pEl)  pEl.textContent  = PRICE_AFTER;
      if(cdEl) cdEl.style.display = 'none';
      if(optEl) optEl.textContent = 'VaultX BlackOps Lifetime \u2014 $' + PRICE_AFTER;
    } else {
      if(pEl)  pEl.textContent  = PRICE_NOW;
      if(optEl) optEl.textContent = 'VaultX BlackOps Lifetime \u2014 $' + PRICE_NOW;
      var diff = VX_END - now;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000)  / 60000);
      var s = Math.floor((diff % 60000)    / 1000);
      if(tEl) tEl.textContent =
        d+'d  '+
        String(h).padStart(2,'0')+'h  '+
        String(m).padStart(2,'0')+'m  '+
        String(s).padStart(2,'0')+'s';
    }
  }

  /* ── Bootstrap ── */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ init(); tick(); setInterval(tick,1000); });
  } else {
    init(); tick(); setInterval(tick,1000);
  }

})();
