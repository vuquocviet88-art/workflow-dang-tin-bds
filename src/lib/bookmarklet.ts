// Script that runs INSIDE the user's own browser tab on a batdongsan.com.vn result page.
// It only reads the page the user is already looking at (no extra requests), because the site
// blocks automated page fetching (Cloudflare 403). Phones are masked by the site, so none are collected.
export const EXTRACT_SCRIPT = String.raw`(function(){
var rows=[];
var txt=function(el,s){var n=el.querySelector(s);return n?n.textContent.replace(/\s+/g,' ').trim():'';};
var m=location.pathname.match(/\/p(\d+)$/);
var page=m?parseInt(m[1],10):1;
var pos=0;
document.querySelectorAll('.js__card').forEach(function(c){
var tEl=c.querySelector('.js__card-title');
var title='';
if(tEl){var cl=tEl.cloneNode(true);cl.querySelectorAll('.m-on-title,[raw]').forEach(function(x){x.remove();});title=cl.textContent.replace(/\s+/g,' ').trim();}
var a=c.querySelector('[data-bds-pa-link]');
var link=c.querySelector('a.js__product-link-for-product-id');
pos++;
rows.push({id:c.getAttribute('prid')||'',tier:(c.getAttribute('vtp')||'').replace('vip-',''),page:page,pos:pos,title:title,price:txt(c,'.re__card-config-price'),area:txt(c,'.re__card-config-area').replace(/^[·\s]+/,''),pricePerM2:txt(c,'.re__card-config-price_per_m2'),location:txt(c,'.re__card-location').replace(/^[·\s]+/,''),description:txt(c,'.js__card-description').slice(0,300),published:txt(c,'.re__card-published-info-published-at'),broker:txt(c,'.agent-name').replace(/[‎‏]/g,'').trim(),brokerProfile:a?((a.getAttribute('data-bds-pa-link')||'').split('?')[0].split('/pa/')[1]||''):'',url:link?link.href:''});
});
if(!rows.length){alert('Không tìm thấy tin nào. Hãy mở trang KẾT QUẢ TÌM KIẾM của batdongsan.com.vn (không phải trang chi tiết) rồi bấm lại.');return;}
var json=JSON.stringify({source:'batdongsan.com.vn',url:location.href,scrapedAt:new Date().toLocaleString('vi-VN'),rows:rows});
var box=document.createElement('div');
box.style.cssText='position:fixed;z-index:2147483647;top:16px;right:16px;width:420px;background:#fff;color:#111;border:2px solid #1B3A2D;border-radius:12px;padding:14px;font:14px/1.4 sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3)';
var msg=document.createElement('div');
msg.style.cssText='font-weight:700;margin-bottom:8px';
var ta=document.createElement('textarea');
ta.value=json;
ta.style.cssText='width:100%;height:90px;font:11px monospace';
var close=document.createElement('button');
close.textContent='Đóng';
close.style.cssText='margin-top:8px;padding:6px 14px;cursor:pointer';
close.onclick=function(){box.remove();};
box.appendChild(msg);box.appendChild(ta);box.appendChild(close);
document.body.appendChild(box);
var head='Đã lấy '+rows.length+' tin của trang '+page+'. ';
var manual=function(){msg.textContent=head+'Bấm vào ô dưới, nhấn Ctrl+C rồi dán vào app.';ta.focus();ta.select();};
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(json).then(function(){msg.textContent=head+'ĐÃ COPY. Quay lại app và dán (Ctrl+V).';},manual);}else{manual();}
})();`;

export const bookmarkletHref = () => 'javascript:' + encodeURIComponent(EXTRACT_SCRIPT.replace(/\n/g, ''));
