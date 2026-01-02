function f(n){const{className:t,maxWidth:o="400px",dismissOnOutsideClick:s=!0,dismissOnEscape:a=!0,onClose:r=null}=n,i=document.querySelector(`.${t}`);i&&i.remove();const e=document.createElement("div");e.className=`modal-overlay ${t}`,e.style.display="flex";const l=document.createElement("div");l.className="modal",l.style.maxWidth=o,e.appendChild(l);let d=null;const m=()=>{e.classList.remove("visible"),setTimeout(()=>{e.remove(),d&&document.removeEventListener("keydown",d),r&&r()},300)};return l.addEventListener("click",u=>u.stopPropagation()),s&&e.addEventListener("click",u=>{u.target===e&&m()}),a&&(d=u=>{u.key==="Escape"&&m()},document.addEventListener("keydown",d)),{overlay:e,innerModal:l,close:m}}function v(n){document.body.appendChild(n),setTimeout(()=>n.classList.add("visible"),10)}function b(n,t=!1){return`
    <div class="modal-header">
      <h3>${n}</h3>
      ${t?'<button class="close-modal modal-close-x" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--text-muted);">&times;</button>':""}
    </div>
  `}function x(n,t={}){const o=Object.entries(t).map(([s,a])=>`${s}:${a}`).join(";");return`<div class="modal-body"${o?` style="${o}"`:""}>${n}</div>`}function $(n,t={}){const o=Object.entries(t).map(([s,a])=>`${s}:${a}`).join(";");return`<div class="modal-footer"${o?` style="${o}"`:""}>${n}</div>`}function h(n,t,o="Confirm",s,a=!1,r=null,i=null){const{overlay:e,innerModal:l,close:d}=f({className:"confirm-modal",maxWidth:"400px"}),m=a?"btn btn-danger":"btn btn-primary";l.style.textAlign="center",l.innerHTML=`
    ${b(n)}
    ${x(`<p>${t}</p>`)}
    <div class="modal-footer" style="flex-direction: column; gap: 12px;">
      <div class="modal-actions-row" style="display: flex; gap: 10px; width: 100%;">
        ${r?`<button class="btn btn-outline" id="modalSecondaryBtn" style="flex: 1;">${r}</button>`:""}
        <button class="${m}" id="modalConfirmBtn" style="flex: 1;">${o}</button>
      </div>
      <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
    </div>
  `,v(e);const u=l.querySelector("#modalCancelBtn"),y=l.querySelector("#modalConfirmBtn"),p=l.querySelector("#modalSecondaryBtn");u?.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),d()}),y?.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),d(),s()}),p&&i&&p.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),d(),i()})}function k(n,t,o,s="",a="text"){const{overlay:r,innerModal:i,close:e}=f({className:"input-modal",maxWidth:"400px",dismissOnEscape:!1}),l=s?`<p class="modal-hint" style="margin-bottom: var(--space-md); text-align: left;">${s}</p>`:"",d=a==="textarea"?`<textarea id="modalInput" class="form-input" placeholder="${t}" style="width: 100%; min-height: 120px; resize: vertical;"></textarea>`:`<input type="text" id="modalInput" class="form-input" placeholder="${t}" style="width: 100%;">`;i.style.textAlign="center",i.innerHTML=`
    ${b(n)}
    <div class="modal-body">
      ${l}
      <div class="form-group">
        ${d}
      </div>
    </div>
    ${$(`<button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
       <button class="btn btn-primary" id="modalConfirmBtn">Add</button>`,{"justify-content":"center",gap:"10px"})}
  `,v(r);const m=i.querySelector("#modalInput"),u=i.querySelector("#modalCancelBtn"),y=i.querySelector("#modalConfirmBtn");u.onclick=e;const p=()=>{const c=m.value;c&&c.trim()&&(e(),o(c.trim()))};y.onclick=p,m.onkeydown=c=>{c.key==="Enter"&&p(),c.key==="Escape"&&e()},setTimeout(()=>m.focus(),100)}function B(n,t,o){const{overlay:s,innerModal:a,close:r}=f({className:"alert-modal",maxWidth:"400px",onClose:o});a.style.textAlign="center",a.innerHTML=`
    ${b(n)}
    ${x(`<p>${t}</p>`)}
    ${$('<button class="btn btn-primary" id="modalOkBtn">OK</button>',{"justify-content":"center"})}
  `,v(s),a.querySelector("#modalOkBtn")?.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),r()})}function C(){return new Promise(n=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',t.style.cursor="pointer",document.body.appendChild(t);let o=!1,s=null;const a=()=>{o||(o=!0,s&&clearTimeout(s),t.classList.remove("active"),setTimeout(()=>{t.remove(),n()},100))};t.addEventListener("click",a),requestAnimationFrame(()=>{t.classList.add("active")});const r=t.querySelector(".countdown-number"),i=["3","2","1","GO!"];let e=0;const l=()=>{if(o)return;if(e>=i.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),n()},300);return}const d=i[e];r.textContent=d,r.className="countdown-number"+(d==="GO!"?" countdown-go":""),r.style.animation="none",requestAnimationFrame(()=>{r.style.animation=""}),e++,s=setTimeout(l,d==="GO!"?600:800)};s=setTimeout(l,100)})}export{C as a,h as b,k as c,B as s};
