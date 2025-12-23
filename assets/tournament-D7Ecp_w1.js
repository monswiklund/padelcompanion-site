import{i as Pt,a as $t}from"./layout-Bam87DKj.js";const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},Z=[],Bt=20;function He(){const e=document.getElementById("undoBtn");e&&(e.disabled=Z.length===0)}function pe(){const e=JSON.parse(JSON.stringify(n));Z.push(e),Z.length>Bt&&Z.shift(),He()}function Mt(){if(Z.length===0)return!1;const e=Z.pop();return Fe(e),He(),!0}const Oe="tournament-state";function S(){localStorage.setItem(Oe,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function Tt(){const e=localStorage.getItem(Oe);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function Rt(){return JSON.parse(JSON.stringify(n))}function Fe(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],S())}function le(e){for(let t=e.length-1;t>0;t--){const o=Math.floor(Math.random()*(t+1));[e[t],e[o]]=[e[o],e[t]]}return e}function C(e,t={}){let o="default",s,a;typeof t=="number"?s=t:typeof t=="string"?o=t:typeof t=="object"&&(o=t.type??"default",s=t.duration,a=t.dismissible);const r={success:{duration:2500,dismissible:!1},info:{duration:3e3,dismissible:!1},warning:{duration:5e3,dismissible:!0},error:{duration:0,dismissible:!0},default:{duration:3e3,dismissible:!1}},d=r[o]||r.default;s=s??d.duration,a=a??d.dismissible;const i=document.querySelector(".toast");i&&i.remove();const l={success:"✓",error:"✕",warning:"⚠",info:"ℹ",default:""},c=document.createElement("div");c.className=`toast ${o}`,o==="error"?(c.setAttribute("role","alert"),c.setAttribute("aria-live","assertive")):(c.setAttribute("role","status"),c.setAttribute("aria-live","polite"));const u=l[o]||"";if(u){const p=document.createElement("span");p.className="toast-icon",p.textContent=u,c.appendChild(p)}const m=document.createElement("span");m.className="toast-message",m.textContent=e,c.appendChild(m);const f=()=>{c.classList.remove("visible"),setTimeout(()=>c.remove(),300)};if(a){const p=document.createElement("button");p.className="toast-close",p.setAttribute("aria-label","Close notification"),p.textContent="×",p.addEventListener("click",f),c.appendChild(p)}document.body.appendChild(c);const h=p=>{p.key==="Escape"&&a&&(f(),document.removeEventListener("keydown",h))};a&&document.addEventListener("keydown",h),setTimeout(()=>c.classList.add("visible"),10),s>0&&setTimeout(()=>{f(),document.removeEventListener("keydown",h)},s)}function ae(){return Math.floor(Date.now()+Math.random()*1e6)}let ue=null;function je(){return ue={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn"),runningBadge:document.getElementById("runningBadge")},ue}function k(){return ue||je(),ue}function ve(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function We(){var i;const e=k(),t=e.courts,o=document.getElementById("courtsWarning");if(!t||!o)return!0;const s=parseInt(t.value)||1,a=((i=e.format)==null?void 0:i.value)||n.format,r=a==="team"||a==="teamMexicano"?2:4,d=Math.floor(n.players.length/r);return t.max=Math.max(1,d),s>d&&d>0?(o.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,o.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(o.textContent=`⚠️ Need at least ${r} players for 1 court`,o.style.display="block",t.classList.add("input-warning"),!1):(o.style.display="none",t.classList.remove("input-warning"),!0)}function Ve(){const e=k();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",be()):e.customCourtNamesSection.style.display="none"}function be(){const e=k();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(o,s)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[s]||`Court ${s+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${s}, this.value)"
             placeholder="Court ${s+1}">
    </div>
  `).join("")}function At(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,S()}function Ue(){const e=k(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)}),n.players.filter(o=>!t.has(o.id)),e.addPartnerPairBtn.disabled=!1}function J(){const e=k(),t=o=>{const s=new Set;return n.preferredPartners.forEach(a=>{a.id!==o&&(s.add(a.player1Id),s.add(a.player2Id))}),s};if(n.preferredPartners.length===0){e.preferredPartnersList.innerHTML="";return}e.preferredPartnersList.innerHTML=`
    <ul class="pairs-bullet-list">
      ${n.preferredPartners.map(o=>{const s=t(o.id),a=n.players.filter(i=>i.id===o.player1Id||i.id===o.player2Id||!s.has(i.id)),r=a.filter(i=>i.id!==o.player2Id||i.id===o.player1Id),d=a.filter(i=>i.id!==o.player1Id||i.id===o.player2Id);return`
            <li class="partner-pair-item" data-pair-id="${o.id}">
              <div class="pair-inputs">
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${o.id}" data-which="1">
                  ${r.map(i=>`<option value="${i.id}" ${i.id===o.player1Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
                <span class="pair-separator">&</span>
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${o.id}" data-which="2">
                  ${d.map(i=>`<option value="${i.id}" ${i.id===o.player2Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
              </div>
              <button class="remove-pair-btn" data-action="remove-pair" data-id="${o.id}">
                <span class="remove-icon">×</span>
              </button>
            </li>
          `}).join("")}
    </ul>
  `}function oe(){document.querySelectorAll(".form-select").forEach(o=>{if(o.closest(".custom-select-wrapper")||o.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),o.parentNode.insertBefore(s,o),s.appendChild(o);const a=document.createElement("div");a.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),o.classList.contains("btn-sm")&&r.classList.add("btn-sm"),o.classList.contains("compact-select")&&(s.classList.add("compact-select"),r.classList.add("compact-select"));const d=o.selectedIndex>=0?o.options[o.selectedIndex]:o.options.length>0?o.options[0]:null;r.innerHTML=`<span>${d?d.text:"Select..."}</span>`;const i=document.createElement("div");i.classList.add("custom-options"),Array.from(o.options).forEach(l=>{const c=document.createElement("div");c.classList.add("custom-option"),c.textContent=l.text,c.dataset.value=l.value,l.selected&&c.classList.add("selected"),c.addEventListener("click",()=>{o.value=c.dataset.value,o.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${c.textContent}</span>`,i.querySelectorAll(".custom-option").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),a.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width=""}),i.appendChild(c)}),a.appendChild(r),a.appendChild(i),s.appendChild(a),r.addEventListener("click",l=>{l.stopPropagation();const c=a.classList.contains("open");if(document.querySelectorAll(".custom-select.open").forEach(u=>{if(u!==a){u.classList.remove("open"),u.querySelector(".custom-options").classList.remove("show");const m=u.querySelector(".custom-options");m.style.position="",m.style.top="",m.style.left="",m.style.width="",m.style.margin=""}}),c)a.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width="",i.style.margin="";else{a.classList.add("open"),i.classList.add("show");const u=a.getBoundingClientRect();i.style.position="fixed",i.style.top=`${u.bottom+4}px`,i.style.left=`${u.left}px`,i.style.width=`${u.width}px`,i.style.zIndex="9999",i.style.margin="0"}}),o.style.display="none"}),document.addEventListener("click",o=>{o.target.closest(".custom-select")||t()}),document.addEventListener("scroll",()=>{t()},!0);function t(){document.querySelectorAll(".custom-select.open").forEach(o=>{o.classList.remove("open");const s=o.querySelector(".custom-options");s.classList.remove("show"),s.style.position="",s.style.top="",s.style.left="",s.style.width="",s.style.margin=""})}}const Nt="modulepreload",zt=function(e){return"/"+e},Ae={},qt=function(t,o,s){let a=Promise.resolve();if(o&&o.length>0){let d=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));a=d(o.map(c=>{if(c=zt(c),c in Ae)return;Ae[c]=!0;const u=c.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":Nt,u||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),u)return new Promise((h,p)=>{f.addEventListener("load",h),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(d){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=d,window.dispatchEvent(i),!i.defaultPrevented)throw d}return a.then(d=>{for(const i of d||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};let $,V,_,G,ee=[],xe,se=!1;const Ne=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function ze(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function Dt(){this.x=Math.random()*_,this.y=Math.random()*G-G,this.r=ze(10,30),this.d=Math.random()*150+10,this.color=Ne[ze(0,Ne.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return V.beginPath(),V.lineWidth=this.r/2,V.strokeStyle=this.color,V.moveTo(this.x+this.tilt+this.r/4,this.y),V.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),V.stroke()}}function Ye(){if(se){V.clearRect(0,0,_,G);for(let e=0;e<ee.length;e++)ee[e].draw();Ht(),xe=requestAnimationFrame(Ye)}}function Ht(){for(let e=0;e<ee.length;e++){const t=ee[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>_+20||t.x<-20||t.y>G)&&se&&(t.x=Math.random()*_,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Ot(){if(!se){$||($=document.createElement("canvas"),$.id="confetti-canvas",$.style.position="fixed",$.style.top="0",$.style.left="0",$.style.width="100%",$.style.height="100%",$.style.pointerEvents="none",$.style.zIndex="9999",document.body.appendChild($),V=$.getContext("2d")),_=window.innerWidth,G=window.innerHeight,$.width=_,$.height=G,window.addEventListener("resize",()=>{_=window.innerWidth,G=window.innerHeight,$.width=_,$.height=G}),se=!0,ee=[];for(let e=0;e<150;e++)ee.push(new Dt);Ye()}}function Ft(){se=!1,V&&V.clearRect(0,0,_,G),xe&&cancelAnimationFrame(xe),$&&$.remove(),$=null}function jt(){Ot(),setTimeout(Ft,5e3)}function H(e,t,o="Confirm",s,a=!1,r=null,d=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const l=document.createElement("div");l.className="modal-overlay confirm-modal",l.style.display="flex";const c=a?"btn btn-danger":"btn btn-primary";l.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        <p>${t}</p>
      </div>
      <div class="modal-footer" style="flex-direction: column; gap: 12px;">
        <div class="modal-actions-row" style="display: flex; gap: 10px; width: 100%;">
          ${r?`<button class="btn btn-outline" id="modalSecondaryBtn" style="flex: 1;">${r}</button>`:""}
          <button class="${c}" id="modalConfirmBtn" style="flex: 1;">${o}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const u=l.querySelector(".modal");u&&u.addEventListener("click",y=>y.stopPropagation());const m=l.querySelector("#modalCancelBtn"),f=l.querySelector("#modalConfirmBtn"),h=l.querySelector("#modalSecondaryBtn"),p=()=>l.remove();m&&m.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),p()}),f&&f.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),p(),s()}),h&&d&&h.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),p(),d()}),l.addEventListener("click",y=>{y.target===l&&p()})}function _e(e,t,o){const s=document.querySelector(".input-modal");s&&s.remove();const a=document.createElement("div");a.className="modal-overlay input-modal",a.style.display="flex",a.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <input type="text" id="modalInput" class="form-input" placeholder="${t}" style="width: 100%;">
        </div>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: 10px;">
        <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Add</button>
      </div>
    </div>
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector("#modalInput"),d=a.querySelector("#modalCancelBtn"),i=a.querySelector("#modalConfirmBtn"),l=()=>a.remove();d.onclick=l;const c=()=>{const u=r.value;u&&u.trim()&&(l(),o(u.trim()))};i.onclick=c,r.onkeydown=u=>{u.key==="Enter"&&c(),u.key==="Escape"&&l()},setTimeout(()=>r.focus(),100)}function Ge(e){const t=document.querySelector(".final-modal");t&&t.remove();const o=a=>a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,s=document.createElement("div");s.className="final-modal",s.innerHTML=`
    <div class="final-modal-content">
      <h2>Tournament Complete!</h2>
      <div class="final-standings">
        ${e.map((a,r)=>`
          <div class="final-standing-row ${r<3?"top-three":""}">
            <span class="medal">${o(r)}</span>
            <span class="name">${a.name}</span>
            <span class="stats">${a.points} pts · ${a.played} games</span>
          </div>
        `).join("")}
      </div>
      <div class="modal-actions-row" style="margin-top: 20px; gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-secondary" data-action="share-results">Share</button>
        <button class="btn btn-secondary" data-action="export-data">Download CSV</button>
        <button class="btn btn-primary" onclick="window.closeFinalModal()">Close</button>
      </div>
    </div>
  `,document.body.appendChild(s),jt(),setTimeout(()=>s.classList.add("visible"),10)}function Wt(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function we(e,t,o){const s=document.querySelector(".alert-modal");s&&s.remove();const a=document.createElement("div");a.className="modal-overlay alert-modal",a.style.display="flex",a.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        <p>${t}</p>
      </div>
      <div class="modal-footer" style="justify-content: center;">
        <button class="btn btn-primary" id="modalOkBtn">OK</button>
      </div>
    </div>
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector(".modal");r&&r.addEventListener("click",l=>l.stopPropagation());const d=a.querySelector("#modalOkBtn"),i=()=>{a.remove()};d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),i()}),a.addEventListener("click",l=>{l.target===a&&i()}),a.addEventListener("click",l=>{l.target===a&&i()})}function ne(e,t){const o=document.querySelector(".info-modal");o&&o.remove();const s=document.createElement("div");s.className="modal-overlay info-modal",s.style.display="flex",s.innerHTML=`
    <div class="modal" style="max-width: 500px; text-align: left;">
      <div class="modal-header">
        <h3>${e}</h3>
        <button class="close-modal" id="modalCloseX" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--text-muted);">&times;</button>
      </div>
      <div class="modal-body" style="font-size: 0.95rem; line-height: 1.6;">
        ${t}
      </div>
      <div class="modal-footer" style="justify-content: flex-end;">
        <button class="btn btn-primary btn-sm" id="modalOkBtn">Got it</button>
      </div>
    </div>
  `,document.body.appendChild(s),setTimeout(()=>s.classList.add("visible"),10);const a=s.querySelector(".modal");a&&a.addEventListener("click",l=>l.stopPropagation());const r=s.querySelector("#modalOkBtn"),d=s.querySelector("#modalCloseX"),i=()=>s.remove();r&&(r.onclick=i),d&&(d.onclick=i),s.addEventListener("click",l=>{l.target===s&&i()})}function Vt(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',t.style.cursor="pointer",document.body.appendChild(t);let o=!1,s=null;const a=()=>{o||(o=!0,s&&clearTimeout(s),t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},100))};t.addEventListener("click",a),requestAnimationFrame(()=>{t.classList.add("active")});const r=t.querySelector(".countdown-number"),d=["3","2","1","GO!"];let i=0;const l=()=>{if(o)return;if(i>=d.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const c=d[i];r.textContent=c,r.className="countdown-number"+(c==="GO!"?" countdown-go":""),r.style.animation="none",requestAnimationFrame(()=>{r.style.animation=""}),i++,s=setTimeout(l,c==="GO!"?600:800)};s=setTimeout(l,100)})}window.closeFinalModal=Wt;function qe(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(C("Maximum 24 players allowed"),!1):n.players.some(o=>o.name.toLowerCase()===t.toLowerCase())?(C(`Player "${t}" already exists`),!1):(n.players.push({id:ae(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),n.players.length%4===0&&(n.courts=n.players.length/4),S(),!0)}function Je(e){n.players=n.players.filter(t=>t.id!==e),S()}function Ut(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}H("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],S(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function Yt(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(d=>d.trim()).filter(d=>d);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let o=0,s=0,a=!1;for(const d of t){if(n.players.length>=24){a=!0;break}if(n.players.some(i=>i.name.toLowerCase()===d.toLowerCase())){s++;continue}n.players.push({id:ae(),name:d,points:0,wins:0,losses:0,pointsLost:0,played:0}),o++}const r=Math.floor(n.players.length/4);return r>n.courts&&(n.courts=r),S(),{added:o,duplicates:s,hitLimit:a}}function _t(e){const t={id:ae(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),S(),!0}function Ke(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function Gt(){const e=Ke();e.length<2||(n.preferredPartners.push({id:ae(),player1Id:e[0].id,player2Id:e[1].id}),S())}function $e(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),S()}function Xe(e,t,o){const s=n.preferredPartners.find(a=>a.id===e);s&&(t===1?s.player1Id=o:s.player2Id=o,S())}const Qe={format:{label:"Format",type:"select",options:[{value:"americano",label:"Americano"},{value:"mexicano",label:"Mexicano"},{value:"team",label:"Team Americano"},{value:"teamMexicano",label:"Team Mexicano"}],helpId:"helpFormat"},courts:{label:"Courts",type:"number",min:1,max:50},scoringMode:{label:"Scoring",type:"select",options:[{value:"total",label:"Total Points"},{value:"race",label:"Race to"},{value:"time",label:"Timed"}],helpId:"helpScoring"},pointsPerMatch:{label:"Points",type:"number",min:4,max:50},maxRepeats:{label:"Repeats",type:"select",options:[{value:0,label:"No repeats"},{value:1,label:"Max 1x"},{value:2,label:"Max 2x"},{value:3,label:"Max 3x"},{value:99,label:"Unlimited"}],mexicanoOnly:!0,helpId:"helpMatchup"},pairingStrategy:{label:"Pairing",type:"select",options:[{value:"optimal",label:"Optimal"},{value:"oneThree",label:"1&3 vs 2&4"},{value:"oneTwo",label:"1&2 vs 3&4"},{value:"oneFour",label:"1&4 vs 2&3"}],mexicanoOnly:!0,helpId:"helpMatchup"},strictStrategy:{label:"Prioritize Pattern",type:"toggle",mexicanoOnly:!0,helpId:"helpMatchup"}};function De(){return n.scoringMode==="time"?"Minutes":n.scoringMode==="race"?"Race to":"Total Points"}function F(){var r,d;const e=document.getElementById("tournamentConfig");if(!e)return;if(Qt(e),n.isLocked){e.style.display="none";return}e.style.display="block",n.format==="team"||n.format;const t=n.format==="mexicano"||n.format==="teamMexicano",o=((r=n.players)==null?void 0:r.length)||0,s=Math.max(1,Math.floor(o/4));n.courts>s&&(n.courts=s,S()),n.pointsPerMatch<4?(n.pointsPerMatch=4,S()):n.pointsPerMatch>50&&(n.pointsPerMatch=50,S());let a='<div class="config-grid">';if(a+=W("format",n.format),t?(a+='<div class="config-spacer"></div>',a+=W("scoringMode",n.scoringMode),a+=W("pointsPerMatch",n.pointsPerMatch,{label:De()}),a+=W("maxRepeats",n.maxRepeats),a+=W("courts",n.courts),a+=W("pairingStrategy",n.pairingStrategy),a+=W("strictStrategy",n.strictStrategy,{disabled:n.pairingStrategy==="optimal"}),n.pairingStrategy!=="optimal"&&n.strictStrategy&&n.maxRepeats===0&&(a+=`
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `)):(a+=W("courts",n.courts),a+=W("scoringMode",n.scoringMode),a+=W("pointsPerMatch",n.pointsPerMatch,{label:De()})),a+="</div>",t&&((d=n.preferredPartners)==null?void 0:d.length)>0){const i=n.preferredPartners.map(l=>{const c=n.players.find(m=>m.id===l.player1Id),u=n.players.find(m=>m.id===l.player2Id);return c&&u?`${c.name} & ${u.name}`:null}).filter(Boolean);i.length>0&&(a+=`
        <div class="config-pairs-section">
          <div class="config-pairs-header">
            <span class="config-pairs-label">Fixed Pairs:</span>
            <button class="btn btn-ghost btn-sm" data-action="edit-pairs">Edit</button>
          </div>
          <ul class="config-pairs-bullet-list">
            ${i.map(l=>`<li>${l}</li>`).join("")}
          </ul>
        </div>
      `)}else t&&(a+=`
      <div class="config-pairs-section config-pairs-empty">
        <button class="btn btn-dashed btn-sm" data-action="add-pair">+ Add Fixed Pair</button>
      </div>
    `);e.innerHTML=a}function Jt(e,t,o){const s=o.options.find(r=>String(r.value)===String(t)),a=s?s.label:t;return`
    <div class="ui-select-wrapper" data-key="${e}" tabindex="0">
      <div class="ui-trigger">
        <span>${a}</span>
        <div class="ui-arrow"></div>
      </div>
      <div class="ui-options">
        ${o.options.map(r=>`<div class="ui-option ${String(r.value)===String(t)?"selected":""}" data-value="${r.value}">${r.label}</div>`).join("")}
      </div>
    </div>
  `}function Kt(e,t,o){const s=o.min??1,a=o.max??99,r=Number.isFinite(t)?t:s,d=r<=s,i=r>=a,l=e==="pointsPerMatch"&&n.scoringMode!=="time"?2:1;return`
    <div class="ui-stepper" data-key="${e}" data-min="${s}" data-max="${a}">
      <button type="button" class="stepper-btn" data-delta="-${l}" ${d?"disabled":""} aria-label="Decrease ${e}">−</button>
      <input type="number" class="stepper-input" value="${r}" min="${s}" max="${a}" step="${l}" aria-label="${e} value">
      <button type="button" class="stepper-btn" data-delta="${l}" ${i?"disabled":""} aria-label="Increase ${e}">+</button>
    </div>
  `}function Xt(e,t,o={}){const s=!!t,a=!!o.disabled;return`
    <div class="ui-toggle ${s?"active":""} ${a?"disabled":""}" 
         data-key="${e}" 
         role="switch" 
         aria-checked="${s}"
         tabindex="${a?"-1":"0"}">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  `}function Se(e){var o;const t={...Qe[e]};if(e==="courts"){const s=((o=n.players)==null?void 0:o.length)||0,a=Math.floor(s/4);t.max=Math.max(1,a)}return t}function W(e,t,o={}){const s=Se(e),a=o.readonly,r=o.label??(s==null?void 0:s.label)??e;let d="";if(!s||a){let i=t;if(s&&s.options){const l=s.options.find(c=>c.value===t);l&&(i=l.label)}d=`<span class="config-value-static">${i}</span>`}else s.type==="select"?d=Jt(e,t,s):s.type==="number"?d=Kt(e,t,s):s.type==="toggle"?d=Xt(e,t,o):d=`<span class="config-value">${t}</span>`;return`
    <div class="config-row ${(s==null?void 0:s.type)==="toggle"?"toggle-row":""}" data-config-key="${e}">
      <div class="config-label-container">
        <span class="config-label">${r}:</span>
        ${s!=null&&s.helpId?`<button class="config-help" data-action="show-help" data-help-id="${s.helpId}">?</button>`:""}
      </div>
      ${d}
    </div>
  `}function ge(e,t){n[e]=t,S();const o=k();if(e==="format"&&o.format&&(o.format.value=t),e==="courts"&&o.courts&&(o.courts.value=t),e==="scoringMode"&&o.scoringMode){o.scoringMode.value=t;const s={time:10,race:14,total:28};n.pointsPerMatch=s[t]||28,o.points&&(o.points.value=n.pointsPerMatch)}e==="pointsPerMatch"&&o.points&&(o.points.value=t),e==="maxRepeats"&&o.maxRepeats&&(o.maxRepeats.value=t),e==="pairingStrategy"&&o.pairingStrategy&&(o.pairingStrategy.value=t,t==="optimal"&&(n.strictStrategy=!1)),e==="strictStrategy"&&document.getElementById("strictStrategy")&&(document.getElementById("strictStrategy").checked=t),F(),qt(()=>Promise.resolve().then(()=>nn),void 0).then(s=>s.renderPlayers&&s.renderPlayers())}function Qt(e){if(e.dataset.listenersAttached){console.log("Tournament Config: Listeners already attached");return}e.dataset.listenersAttached="true",console.log("Tournament Config: Attaching listeners to",e),e.addEventListener("change",t=>{var s;console.log("Tournament Config: Change event",t.target);const o=t.target;if(o.classList.contains("config-input")||o.classList.contains("stepper-input")){const a=o.closest(".ui-stepper"),r=o.dataset.key||(a==null?void 0:a.dataset.key);if(!r)return;const d=Se(r),i=(d==null?void 0:d.min)??1,l=(d==null?void 0:d.max)??99;let c=parseInt(o.value,10);isNaN(c)&&(c=i),r==="courts"&&c>l&&we("Too many courts",`You need at least ${c*4} players to use ${c} courts. With ${((s=n.players)==null?void 0:s.length)||0} players, you can have a maximum of ${l} courts.`)}}),e.addEventListener("click",t=>{console.log("Tournament Config: Click event",t.target);const o=t.target.closest(".stepper-btn");if(o){const l=o.closest(".ui-stepper"),c=l==null?void 0:l.dataset.key;if(!c)return;const u=Se(c),m=parseInt(o.dataset.delta,10)||0,f=(u==null?void 0:u.min)??1,h=(u==null?void 0:u.max)??99,p=parseInt(n[c],10);if(m>0&&p>=h&&c==="courts"){we("Too many courts",`You need at least ${(p+1)*4} players to use ${p+1} courts.`);return}const y=Math.min(h,Math.max(f,(Number.isFinite(p)?p:f)+m));y!==p&&ge(c,y);return}const s=t.target.closest(".ui-toggle");if(s&&!s.classList.contains("disabled")){const l=s.dataset.key,c=!n[l];ge(l,c);return}const a=t.target.closest(".ui-select-wrapper");if(a&&!t.target.closest(".ui-option")){const l=a.classList.contains("open");if(document.querySelectorAll(".ui-select-wrapper.open").forEach(c=>{c.classList.remove("open");const u=c.querySelector(".ui-options");u&&(u.style.display="none"),c.closest(".config-row")&&(c.closest(".config-row").style.zIndex="")}),!l){a.classList.add("open");const c=a.querySelector(".ui-options");c&&(c.style.display="block"),a.closest(".config-row")&&(a.closest(".config-row").style.zIndex="100")}}const r=t.target.closest(".ui-option");if(r){const l=r.closest(".ui-select-wrapper"),c=r.dataset.value,u=l.dataset.key,m=Qe[u];let f=c;(m.type==="number"||u==="courts"||u==="maxRepeats"||u==="pointsPerMatch")&&!isNaN(c)&&c.trim()!==""&&(f=parseInt(c)),ge(u,f)}const d=t.target.closest("[data-action]");if(!d)return;const i=d.dataset.action;if(i==="show-help"){const l=d.dataset.helpId,c=document.getElementById(l);c&&c.click()}if(i==="edit-pairs"||i==="add-pair"){if(i==="add-pair")try{const l=new Set;if(n.preferredPartners&&n.preferredPartners.forEach(u=>{l.add(String(u.player1Id)),l.add(String(u.player2Id))}),n.players.filter(u=>!l.has(String(u.id))).length<2){C("Not enough available players to form a pair","error");return}}catch(l){console.error("Validation error:",l)}en()}})}function Zt(e){e.target.closest(".ui-select-wrapper")||document.querySelectorAll(".ui-select-wrapper.open").forEach(t=>{t.classList.remove("open");const o=t.querySelector(".ui-options");o&&(o.style.display="none"),t.closest(".config-row")&&(t.closest(".config-row").style.zIndex="")})}function en(){n.preferredPartners||(n.preferredPartners=[]);const e=document.createElement("div");e.className="modal-overlay active",e.style.display="flex";const t=(b,L)=>String(b)===String(L),o=b=>n.players.find(L=>t(L.id,b)),s=b=>n.preferredPartners.find(L=>t(L.id,b));let a=null,r=null;const d=`
    <style>
      .pair-modal-content { 
        max-width: 500px; width: 90%; 
        min-height: 420px;
        background: var(--bg-card); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        padding: 2rem;
        display: flex; flex-direction: column;
      }
      .custom-select { position: relative; flex: 1; font-family: inherit; }
      .select-trigger { 
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 14px; 
        background: var(--input-bg); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-md); cursor: pointer; 
        color: var(--text-muted); 
        transition: all 0.2s;
        font-size: 0.95rem; user-select: none;
      }
      .select-trigger.filled { color: var(--text-primary); border-color: var(--border-color); }
      .select-trigger:hover { background: var(--bg-card-hover); border-color: var(--text-secondary); }
      .select-trigger.active { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
      .select-arrow { transition: transform 0.2s; opacity: 0.5; }
      .select-trigger.active .select-arrow { transform: rotate(180deg); opacity: 1; }
      
      .select-options {
        position: absolute; top: calc(100% + 8px); left: 0; right: 0;
        background: var(--bg-card); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-md);
        max-height: 240px; overflow-y: auto; z-index: 100; display: none;
        box-shadow: var(--shadow-lg); padding: 4px;
        -webkit-overflow-scrolling: touch;
      }
      .select-options.open { display: block; animation: slideDown 0.15s ease-out; }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      
      .option { 
        padding: 12px 14px; cursor: pointer; border-radius: var(--radius-sm); 
        color: var(--text-secondary);
        display: flex; align-items: center; font-size: 0.95rem;
        border-bottom: 1px solid transparent;
      }
      .option:hover { background: var(--bg-card-hover); color: var(--text-primary); }
      .option.selected { color: var(--accent); background: rgba(59, 130, 246, 0.1); }
      .option.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; text-decoration: line-through; }
      
      .add-action-btn {
        padding: 0 20px; height: 44px; border-radius: var(--radius-md); border: none;
        font-weight: 600; cursor: pointer; transition: 0.2s;
        background: var(--bg-secondary); color: var(--text-muted);
        border: 1px solid var(--border-color);
      }
      .add-action-btn.ready { background: var(--accent); color: #fff; border-color: var(--accent); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
      .add-action-btn.ready:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); filter: brightness(1.1); }

      .pair-list-clean { 
        margin-top: 1rem; max-height: 300px; overflow-y: auto; padding-right: 4px;
        -webkit-overflow-scrolling: touch;
        border-top: 1px solid var(--border-color);
      }
      .pair-item-clean { 
        display: flex; justify-content: space-between; align-items: center; 
        padding: 16px 0; border-bottom: 1px solid var(--border-color); 
      }
      .pair-names { font-size: 1rem; color: var(--text-primary); font-weight: 500; }
      .pair-remove-icon { 
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        color: var(--text-muted); cursor: pointer; border-radius: 50%; transition: 0.2s;
      }
      .pair-remove-icon:hover { color: #fff; background: var(--error); }

      .btn-text { 
        background: rgba(59, 130, 246, 0.1); 
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: var(--accent) !important; 
        padding: 10px 24px; 
        border-radius: 999px; 
        font-weight: 600; 
        cursor: pointer; 
        transition: all 0.2s;
      }
      .btn-text:hover { 
        background: rgba(59, 130, 246, 0.2); 
        border-color: var(--accent);
        color: #fff !important;
      }

      /* Custom Scrollbar */
      .pair-list-clean, .select-options {
        scrollbar-width: thin;
        scrollbar-color: var(--text-muted) transparent;
      }
      .pair-list-clean::-webkit-scrollbar,
      .select-options::-webkit-scrollbar { width: 6px; }
      .pair-list-clean::-webkit-scrollbar-thumb,
      .select-options::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 999px;
      }
      .pair-list-clean::-webkit-scrollbar-thumb:hover,
      .select-options::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted);
      }
    </style>
  `;e.innerHTML=`
    ${d}
    <div class="modal-content pair-modal-content">
      <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem; color: var(--text-primary);">Manage Fixed Pairs</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Select two players to pair together consistently.</p>
      
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 2rem;">
        <div class="custom-select" id="sel1"></div>
        <span style="color: var(--text-muted); font-weight: bold;">&</span>
        <div class="custom-select" id="sel2"></div>
        <button class="add-action-btn" id="addBtn">Add</button>
      </div>

      <div class="pair-list-clean" id="pairsList" style="flex: 1; min-height: 150px;"></div>
      
      <div style="margin-top: auto; padding-top: 1.5rem; display: flex; justify-content: flex-end;">
        <button class="btn-text" id="closePairsModal" style="color:var(--text-muted);">Done</button>
      </div>
    </div>
  `,document.body.appendChild(e);const i=b=>{b.key==="Escape"&&c()};document.addEventListener("keydown",i);const l=()=>document.removeEventListener("keydown",i),c=()=>{l(),e.remove()},u=e.querySelector("#sel1"),m=e.querySelector("#sel2"),f=e.querySelector("#addBtn"),h=e.querySelector("#pairsList"),p=(b,L,z)=>{const B=n.players.find(P=>t(P.id,L)),g=B?B.name:z;let w=`
      <div class="select-trigger ${!!B?"filled":""}">
        <span>${g}</span>
        <span class="select-arrow">▼</span>
      </div>
      <div class="select-options">
    `;const E=new Set;n.preferredPartners.forEach(P=>{P.player1Id&&E.add(String(P.player1Id)),P.player2Id&&E.add(String(P.player2Id))}),n.players.forEach(P=>{const A=String(P.id),K=t(P.id,L);if(E.has(A)&&!K)return;const I=b.id==="sel1"&&t(P.id,r)||b.id==="sel2"&&t(P.id,a);w+=`<div class="option ${K?"selected":""} ${I?"disabled":""}" data-val="${P.id}">${P.name}</div>`}),w+="</div>",b.innerHTML=w},y=()=>{if(n.preferredPartners.length===0){h.innerHTML='<div style="text-align: center; padding: 2rem; color: #52525b;">No fixed pairs yet</div>';return}h.innerHTML=n.preferredPartners.map(b=>{const L=n.players.find(B=>t(B.id,b.player1Id)),z=n.players.find(B=>t(B.id,b.player2Id));return!L||!z?"":`
        <div class="pair-item-clean">
          <span class="pair-names">${L.name} & ${z.name}</span>
          <div class="pair-remove-icon" data-remove="${String(b.id)}">✕</div>
        </div>
      `}).join("")},v=()=>{p(u,a,"Select Player 1"),p(m,r,"Select Player 2"),y(),a&&r&&!t(a,r)?(f.classList.add("ready"),f.disabled=!1):(f.classList.remove("ready"),f.disabled=!0)};v(),e.addEventListener("click",b=>{if(b.target===e||b.target.id==="closePairsModal"){c();return}b.target.closest(".custom-select")||(e.querySelectorAll(".select-options").forEach(g=>g.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(g=>g.classList.remove("active")));const L=b.target.closest(".select-trigger");if(L){const x=L.parentElement.querySelector(".select-options"),w=x.classList.contains("open");e.querySelectorAll(".select-options").forEach(E=>E.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(E=>E.classList.remove("active")),w||(x.classList.add("open"),L.classList.add("active"))}const z=b.target.closest(".option");if(z){const g=z.dataset.val,x=o(g);if(x){const w=z.closest(".custom-select").id;w==="sel1"&&(a=x.id),w==="sel2"&&(r=x.id),v(),e.querySelectorAll(".select-options").forEach(E=>E.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(E=>E.classList.remove("active"))}}if(b.target.closest("#addBtn")&&!f.disabled){if(n.preferredPartners.some(w=>t(w.player1Id,a)&&t(w.player2Id,r)||t(w.player1Id,r)&&t(w.player2Id,a))){alert("Pair already exists");return}if(n.preferredPartners.some(w=>t(w.player1Id,a)||t(w.player2Id,a)||t(w.player1Id,r)||t(w.player2Id,r))&&!confirm("One of these players is already in another pair. Create anyway?"))return;n.preferredPartners.push({id:ae(),player1Id:a,player2Id:r}),S(),a=null,r=null,v(),F()}const B=b.target.closest(".pair-remove-icon");if(B){const g=B.dataset.remove,x=s(g);x&&($e(x.id),v(),F())}})}document.addEventListener("click",Zt);function Y(){const e=k();if(e.playerList.innerHTML=n.players.map((t,o)=>{const s=['<option value="">Auto</option>'];for(let a=1;a<=n.courts;a++){const r=t.lockedCourt===a?"selected":"";s.push(`<option value="${a}" ${r}>Court ${a}</option>`)}return`
    <li class="player-item" data-id="${t.id}">
      <span class="player-number">${o+1}.</span>
      <span class="player-name">${t.name}</span>
      
      <select 
        class="court-lock-select form-select btn-sm" 
        onchange="window.updatePlayerCourtLock(${t.id}, this.value)"
        onclick="event.stopPropagation()"
        title="Lock to specific court"
      >
        ${s.join("")}
      </select>
      <button class="player-remove" data-action="remove-player" data-id="${t.id}">×</button>
    </li>
  `}).join(""),window.updatePlayerCourtLock||(window.updatePlayerCourtLock=(t,o)=>{const s=n.players.find(a=>a.id===t);s&&(s.lockedCourt=o?parseInt(o):null,S())}),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4){const t=n.players.length%4===0,o=n.courts*4,s=n.players.length>o;if(!t||s){const a=s?`exceeds capacity for ${n.courts} court${n.courts>1?"s":""}`:`uneven number for ${n.courts} court${n.courts>1?"s":""}`;e.playersHint.textContent=`${n.players.length} players ready! Since it ${a}, a queue system will be applied.`,e.playersHint.style.color="var(--warning)"}else e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"}else e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color="";J(),Ue(),tn(),We(),oe(),F()}function Ze(){const e=k();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function Ce(){const e=k();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function Be(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function tn(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function et(){const e=k();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function de(){const e=k();e.importModal.style.display="none"}const nn=Object.freeze(Object.defineProperty({__proto__:null,hideImportModal:de,hidePlayerInput:Ce,renderPlayers:Y,showImportModal:et,showPlayerInput:Ze,togglePlayerList:Be},Symbol.toStringTag,{value:"Module"}));let Le=!1;function fe(){const e=k(),t=n.gridColumns,o=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),o.forEach(s=>{s.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),o.forEach(s=>{s.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function tt(){var s;const e=((s=document.getElementById("scoringMode"))==null?void 0:s.value)||n.scoringMode,t=document.getElementById("scoringValueLabel"),o=document.getElementById("points");!t||!o||(e==="total"?(t.textContent="Points",o.value=24):e==="race"?(t.textContent="Target",o.value=21):e==="time"&&(t.textContent="Minutes",o.value=12))}function on(){const e=k();e.gridColumns&&(e.gridColumns.max=6)}function sn(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,s=Math.floor(t/180),a=n.maxCourts||n.courts||2;return Math.min(Math.max(s,1),a)}function nt(){const e=k();if(Le||n.gridColumns!==0)return;const t=sn();document.querySelectorAll(".matches-grid").forEach(s=>{s.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function an(){const e=k(),t=parseInt(e.gridColumns.value);t===0?(Le=!1,nt()):Le=!0,n.gridColumns=t,fe(),S()}function ot(){const e=k(),t=n.textSize,o=t/100,s=document.getElementById("scheduleSection");s&&s.style.setProperty("--text-scale",o),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function rn(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(n.roundScale=parseInt(e.value)/100,S());const o=n.roundScale||1,s=document.getElementById("roundsContainer");s&&s.style.setProperty("--card-scale",o),e&&(e.value=Math.round(o*100)),t&&(t.textContent=`${Math.round(o*100)}%`)}function st(){return[...n.leaderboard].sort((e,t)=>{switch(n.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const o=e.played>0?e.wins/e.played:0,s=t.played>0?t.wins/t.played:0;return Math.abs(s-o)>.001?s-o:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const a=e.points+e.pointsLost,r=t.points+t.pointsLost,d=a>0?e.points/a:0,i=r>0?t.points/r:0;return Math.abs(i-d)>.001?i-d:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function j(){const e=k(),t=document.getElementById("toggleVisibilityBtn");t&&(n.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const o=document.getElementById("togglePositionBtn");if(o&&(n.showPositionChanges?(o.innerHTML="Ranks",o.classList.add("toggle-on"),o.classList.remove("toggle-off")):(o.innerHTML="Ranks",o.classList.add("toggle-off"),o.classList.remove("toggle-on")),o.title="Click to toggle rank change indicators"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const s=!n.hideLeaderboard,a=n.showPositionChanges,r=!s&&!a,d=st();d.forEach((l,c)=>{const u=c+1,m=l.previousRank||u;l.rankChange=m-u});let i=r?[...d].sort(()=>Math.random()-.5):d;e.leaderboardBody.innerHTML=i.map((l,c)=>{const u=d.findIndex(g=>g.id===l.id)+1,m=r?"-":u;let f="";a&&l.played>0&&!r&&(l.rankChange>0?f='<span class="rank-up">▲</span>':l.rankChange<0?f='<span class="rank-down">▼</span>':f='<span class="rank-same">-</span>');const h=l.points-(l.pointsLost||0),p=l.played>0?Math.round((l.wins||0)/l.played*100)+"%":"0%",y=h>0?"+":"",v=s?l.points:"-",b=s?l.wins||0:"-",L=s?`<span class="${h>0?"text-success":h<0?"text-error":""}">${y}${h}</span>`:"-",z=s?p:"-",B=s||a?l.played:"-";return`
    <tr>
      <td>${m} ${f}</td>
      <td class="player-name-cell">${l.name}</td>
      <td class="font-bold">${v}</td>
      <td>${b}</td>
      <td>${L}</td>
      <td>${z}</td>
      <td>${B}</td>
    </tr>
  `}).join("")}function at(){n.hideLeaderboard=!n.hideLeaderboard,j()}function rt(){n.showPositionChanges=!n.showPositionChanges,j()}function it(e){n.rankingCriteria=e,j()}function ln(){const e=[...n.players],t=e.length,o=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const s=e.length,a=[],r=e[0],d=e.slice(1);for(let i=0;i<s-1;i++){const l=[r,...d],c=[];for(let y=0;y<s/2;y++){const v=l[y],b=l[s-1-y];!v.isBye&&!b.isBye&&c.push([v,b])}const u=[],m=new Set;for(let y=0;y<c.length-1;y+=2)c[y]&&c[y+1]&&(u.push({court:Math.floor(y/2)+1,team1:c[y],team2:c[y+1]}),c[y].forEach(v=>m.add(v.id)),c[y+1].forEach(v=>m.add(v.id)));const f=u.slice(0,o),h=new Set;f.forEach(y=>{y.team1.forEach(v=>h.add(v.id)),y.team2.forEach(v=>h.add(v.id))});const p=n.players.filter(y=>!y.isBye&&!h.has(y.id));f.length>0&&a.push({number:a.length+1,matches:f,byes:p}),d.unshift(d.pop())}return a}function dn(){const e=[...n.players],t=e.length,o=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const s=e.length,a=[],r=e[0],d=e.slice(1);for(let i=0;i<s-1;i++){const l=[r,...d],c=[],u=new Set;for(let p=0;p<s/2;p++){const y=l[p],v=l[s-1-p];!y.isBye&&!v.isBye&&(c.push({court:c.length+1,team1:[y],team2:[v]}),u.add(y.id),u.add(v.id))}const m=c.slice(0,o),f=new Set;m.forEach(p=>{p.team1.forEach(y=>f.add(y.id)),p.team2.forEach(y=>f.add(y.id))});const h=n.players.filter(p=>!p.isBye&&!f.has(p.id));m.length>0&&a.push({number:a.length+1,matches:m,byes:h}),d.unshift(d.pop())}return a}function cn(){const e=[...n.players];le(e);const t=n.courts,o=[],s=new Set;for(let r=0;r<e.length-1&&o.length<t;r+=2)o.push({court:o.length+1,team1:[e[r]],team2:[e[r+1]]}),s.add(e[r].id),s.add(e[r+1].id);const a=e.filter(r=>!s.has(r.id));return[{number:1,matches:o,byes:a}]}function un(){const e=[...n.leaderboard].sort((i,l)=>l.points-i.points),t=n.courts,o=e.filter(i=>!n.manualByes.includes(i.id)),s=e.filter(i=>n.manualByes.includes(i.id)),a=[],r=new Set;for(let i=0;i<o.length-1&&a.length<t;i+=2)a.push({court:a.length+1,team1:[o[i]],team2:[o[i+1]]}),r.add(o[i].id),r.add(o[i+1].id);const d=[...s,...o.filter(i=>!r.has(i.id))];return{number:n.schedule.length+1,matches:a,byes:d}}function mn(){const e=n.courts,t=e*4,o=[],s=new Set,a=[...n.players],r=[];a.forEach(p=>{if(s.has(p.id))return;const y=lt(p.id);if(y){const v=a.find(b=>b.id===y);v?(o.push({type:"pair",players:[p,v]}),s.add(v.id)):o.push({type:"single",players:[p]})}else o.push({type:"single",players:[p]});s.add(p.id)}),le(o);const d=[];let i=0;for(const p of o)i+p.players.length<=t?(d.push(p),i+=p.players.length):r.push(...p.players);const l=[],c=[];d.forEach(p=>{p.type==="pair"?l.push(p.players):c.push(p.players[0])}),le(c);for(let p=0;p<c.length-1;p+=2)l.push([c[p],c[p+1]]);le(l);const u=[],m=new Set,f=[],h=[];for(let p=0;p<l.length-1;p+=2){const y=l[p],v=l[p+1],b=[...y,...v].find(L=>L.lockedCourt);b?f.push({team1:y,team2:v,lockedCourt:b.lockedCourt}):h.push({team1:y,team2:v})}return f.forEach(p=>{if(u.length>=e)return;let y=p.lockedCourt;(m.has(y)||y>e)&&(y=null),y?(m.add(y),u.push({court:y,team1:p.team1,team2:p.team2})):h.push({team1:p.team1,team2:p.team2})}),h.forEach(p=>{if(u.length>=e)return;let y=1;for(;m.has(y);)y++;y<=e&&(m.add(y),u.push({court:y,team1:p.team1,team2:p.team2}))}),u.sort((p,y)=>p.court-y.court),l.length%2!==0&&u.length<l.length/2&&r.push(...l[l.length-1]),[{number:1,matches:u,byes:r}]}function lt(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(o=>o.player1Id===e||o.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function pn(e){const t=n.courts,o=t*4,s=new Set(n.manualByes),a=[],r=new Set,d=[...e];d.forEach(g=>{if(r.has(g.id)||s.has(g.id))return;const x=lt(g.id);if(x){const w=d.find(E=>E.id===x);w?s.has(w.id)?a.push({type:"single",players:[g]}):(a.push({type:"pair",players:[g,w]}),r.add(w.id)):a.push({type:"single",players:[g]})}else a.push({type:"single",players:[g]});r.add(g.id)}),a.sort((g,x)=>{const w=A=>{const K=A.players.reduce((O,I)=>O+(I.byeCount||0),0),te=A.players.reduce((O,I)=>O+(I.played||0),0);return{bye:K/A.players.length,play:te/A.players.length}},E=w(g),P=w(x);return Math.abs(P.bye-E.bye)>.1?P.bye-E.bye:E.play-P.play});const i=[],l=[];let c=0;for(const g of a)c+g.players.length<=o&&(l.push(g),i.push(...g.players),c+=g.players.length);const u=new Set(i.map(g=>g.id)),m=d.filter(g=>!u.has(g.id)),f=[],h=[];l.forEach(g=>{g.type==="pair"?f.push(g.players):h.push(g.players[0])}),h.sort((g,x)=>x.points-g.points);let p=0;for(;p<h.length-3;p+=4){const g=h[p],x=h[p+1],w=h[p+2],E=h[p+3],P=[{name:"oneThree",team1:[g,w],team2:[x,E]},{name:"oneTwo",team1:[g,x],team2:[w,E]},{name:"oneFour",team1:[g,E],team2:[x,w]}];let A;const K=n.pairingStrategy!=="optimal"&&n.strictStrategy;n.strictStrategy;const te=n.maxRepeats!==void 0?n.maxRepeats:99,O=P.map(I=>{const R=I.team1[0].id,D=I.team1[1].id,M=I.team2[0].id,N=I.team2[1].id,Te=(It,kt)=>{const ie=e.find(ye=>ye.id===It);return ie!=null&&ie.playedWith?ie.playedWith.filter(ye=>ye===kt).length:0},Re=Te(R,D)+Te(M,N),xt=I.team1[0].points+I.team1[1].points,wt=I.team2[0].points+I.team2[1].points,St=Math.abs(xt-wt),Ct=te<99&&Re>te,Lt=I.name===n.pairingStrategy,Et=R*1e6+D*1e4+M*100+N;return{...I,repeatPenalty:Re,violatesRepeats:Ct,isPreferred:Lt,rankingImbalance:St,tieBreaker:Et}});if(O.sort((I,R)=>I.tieBreaker-R.tieBreaker),n.pairingStrategy==="optimal")A={...[...O].sort((R,D)=>R.repeatPenalty!==D.repeatPenalty?R.repeatPenalty-D.repeatPenalty:R.rankingImbalance!==D.rankingImbalance?R.rankingImbalance-D.rankingImbalance:R.tieBreaker-D.tieBreaker)[0],relaxedConstraint:null};else{const I=O.find(R=>R.isPreferred)||O[0];if(!I.violatesRepeats)A={...I,relaxedConstraint:null};else if(K)A={...I,relaxedConstraint:"repeats"};else{const R=O.filter(D=>!D.violatesRepeats);R.length>0?A={...[...R].sort((M,N)=>M.isPreferred!==N.isPreferred?M.isPreferred?-1:1:M.rankingImbalance!==N.rankingImbalance?M.rankingImbalance-N.rankingImbalance:M.tieBreaker-N.tieBreaker)[0],relaxedConstraint:"pattern"}:A={...[...O].sort((M,N)=>M.repeatPenalty!==N.repeatPenalty?M.repeatPenalty-N.repeatPenalty:M.isPreferred!==N.isPreferred?M.isPreferred?-1:1:M.rankingImbalance!==N.rankingImbalance?M.rankingImbalance-N.rankingImbalance:M.tieBreaker-N.tieBreaker)[0],relaxedConstraint:"tier3"}}}f.push(A.team1),f.push(A.team2)}p<h.length-1&&f.push([h[p],h[p+1]]);const y=f.map(g=>({players:g,points:g.reduce((x,w)=>x+w.points,0)}));y.sort((g,x)=>x.points-g.points);const v=[],b=new Set,L=new Set,z=[],B=[];for(let g=0;g<y.length-1;g+=2){const x=y[g],w=y[g+1],E=[...x.players,...w.players].find(P=>P.lockedCourt);E?z.push({t1:x,t2:w,lockedCourt:E.lockedCourt}):B.push({t1:x,t2:w})}return z.forEach(g=>{if(v.length>=t)return;let x=g.lockedCourt;(L.has(x)||x>t)&&(x=null),x?(L.add(x),v.push({court:x,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(w=>b.add(w.id)),g.t2.players.forEach(w=>b.add(w.id))):B.push({t1:g.t1,t2:g.t2})}),B.forEach(g=>{if(v.length>=t)return;let x=1;for(;L.has(x);)x++;x<=t&&(L.add(x),v.push({court:x,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(w=>b.add(w.id)),g.t2.players.forEach(w=>b.add(w.id)))}),v.sort((g,x)=>g.court-x.court),y.forEach(g=>{g.players.some(x=>b.has(x.id))||g.players.forEach(x=>m.push(x))}),{number:n.schedule.length+1,matches:v,byes:m}}function X(e,t,o,s,a,r=null){const d=n.leaderboard.find(i=>i.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+o,s?d.wins=(d.wins||0)+1:a||(d.losses=(d.losses||0)+1),r&&!d.playedWith&&(d.playedWith=[]),r&&d.playedWith.push(r))}function Q(e,t,o,s,a){const r=n.leaderboard.find(d=>d.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-o,s?r.wins=(r.wins||0)-1:a||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let Ee=null;function fn(e){Ee=e}let Ie=null;function yn(e){Ie=e}function q(){const e=k(),t=n.format,o=t==="team"||t==="teamMexicano",s=document.getElementById("playersHeader");s&&s.firstChild&&(s.firstChild.textContent=o?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=o?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=o?"Enter team name...":"Enter name...");const a=document.querySelector(".setup-card");if(!a)return;[a.querySelector(".setup-grid"),a.querySelector(".setup-grid-3"),document.getElementById("customCourtNamesSection")].forEach(p=>{if(!p)return;p.querySelectorAll("input, select, button").forEach(v=>{if(!v.classList.contains("always-enabled")){if(n.isLocked){if(v.disabled=!0,v.classList.add("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const L=b.querySelector(".custom-select");L&&L.classList.add("disabled")}}}else if(v.disabled=!1,v.classList.remove("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const L=b.querySelector(".custom-select");L&&L.classList.remove("disabled")}}}})});const d=document.getElementById("advancedSettingsContent");d&&(d.querySelectorAll("input, select, button").forEach(y=>{if(y.disabled=!1,y.classList.remove("locked"),y.tagName==="SELECT"){const v=y.closest(".custom-select-wrapper");if(v){const b=v.querySelector(".custom-select");b&&b.classList.remove("disabled")}}}),Ue());const i=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",i&&(i.style.display="inline-flex")):(e.generateBtn.style.display="block",i&&(i.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=!1);const l=String(t).trim(),m=l.toLowerCase()==="mexicano"||l==="teamMexicano",f=e.advancedSettingsContent;f&&(m?(f.classList.remove("collapsed"),f.classList.add("expanded")):(f.classList.remove("expanded"),f.classList.add("collapsed")));const h=document.getElementById("strictStrategy");h&&(h.disabled=!1),Ie&&Ie()}function gn(){const e=k(),t=e.format.value,o=t==="team"||t==="teamMexicano",s=o?2:4;if(n.players.length<s){C(`Not enough ${o?"teams":"players"} (min ${s})`,"error");return}n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const a=n.format==="team"||n.format==="teamMexicano"?2:4,r=Math.floor(n.players.length/a),d=()=>{pe(),n.leaderboard=n.players.map(l=>({...l,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=ln(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=dn(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=cn(),n.allRounds=null):(n.schedule=mn(),n.allRounds=null),e.leaderboardSection.style.display="block",j(),Ee&&Ee(),e.scheduleSection.style.display="block";const i=document.getElementById("tournamentActionsSection");i&&(i.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const l=document.getElementById("round-0");l&&(l.classList.add("animate-in","highlight"),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100),n.isLocked=!0,q(),S(),C("🎾 Tournament started! Round 1 ready")};if(n.courts>r){if(r===0){we("Not Enough Players",`You need at least ${a} players/teams to start!`);return}const i=n.courts;n.courts=r,e.courts&&(e.courts.value=n.courts),C(`Adjusted courts: ${i} → ${r}`)}Vt().then(()=>{d()})}function hn(){const e=k();H("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{pe(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",q(),S(),C("Tournament reset")},!0)}function dt(e){H("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,q();const t=[...n.leaderboard].sort((o,s)=>s.points-o.points);xn(),C("Tournament saved to history"),e&&e(t),j(),S()},!0)}function ct(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function ut(e=null){const t=e||n,o=new Date().toLocaleDateString(),s=new Date().toLocaleTimeString();let a="data:text/csv;charset=utf-8,";a+=`Tournament Results
`,a+=`Date,${o} ${s}
`,a+=`Format,${t.format}
`,a+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,a+=`Final Standings
`,a+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((l,c)=>c.points-l.points).forEach((l,c)=>{const u=(l.points||0)-(l.pointsLost||0);a+=`${c+1},"${l.name}",${l.points},${l.wins},${l.played},${l.pointsLost||0},${u}
`}),a+=`
`,a+=`Match History
`,a+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(l=>{l.completed&&l.matches.forEach(c=>{const u=c.team1.map(h=>h.name).join(" & "),m=c.team2.map(h=>h.name).join(" & ");let f=`Court ${c.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[c.court-1]?f=t.customCourtNames[c.court-1]:t.courtFormat==="number"&&(f=`${c.court}`),a+=`Round ${l.number},"${f}","${u}",${c.score1},${c.score2},"${m}"
`})});const d=encodeURI(a),i=document.createElement("a");i.setAttribute("href",d),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function mt(e=null){var r;const t=e||n;let s=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;s+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,s+=`Format: ${t.format}

`,s+=`Top Standings:
`,[...t.leaderboard].sort((d,i)=>i.points-d.points).slice(0,5).forEach((d,i)=>{s+=`${i+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),s+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(s),C("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),C("Failed to copy results","error")}}class vn{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const o=Math.floor(t/60),s=t%60;return`${o.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`}playBeep(t=440,o=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const s=this.audioContext.createOscillator(),a=this.audioContext.createGain();s.type="sine",s.frequency.value=t,s.connect(a),a.connect(this.audioContext.destination),s.start(),a.gain.setValueAtTime(.1,this.audioContext.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+o),s.stop(this.audioContext.currentTime+o)}catch(s){console.warn("Audio play failed",s)}}}let T=null;function bn(){const e=k();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",T&&(T.pause(),T=null);return}if(e.matchTimerContainer.style.display="flex",T)T.duration!==n.pointsPerMatch&&T.setDuration(n.pointsPerMatch);else{T=new vn({duration:n.pointsPerMatch||12,onTimeUpdate:o=>{e.timerDisplay&&(e.timerDisplay.textContent=o),document.title=`${o} - Tournament`},onStatusChange:o=>{o==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed"),e.runningBadge&&(e.runningBadge.style.display="inline-flex",e.runningBadge.classList.add("running"))):o==="paused"||o==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),e.runningBadge&&(e.runningBadge.style.display="none",e.runningBadge.classList.remove("running")),o==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):o==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=T.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>T.start(),e.timerPauseBtn.onclick=()=>T.pause(),e.timerResetBtn.onclick=()=>T.reset(),e.timerAddBtn.onclick=()=>T.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>T.addTime(-60));const t=()=>{const o=()=>{_e("Set Timer Duration","Enter minutes (e.g. 12)",s=>{const a=parseInt(s);a>0?(n.pointsPerMatch=a,S(),T.setDuration(a),C(`Timer set to ${a} minutes`)):C("Invalid minutes","error")})};T.isRunning?H("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{T.pause(),o()}):o()};e.timerDisplay.onclick=t}}}function U(){const e=k();bn(),ce();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((r,d)=>{const i=d===t,l=r.completed,c=l&&!i,u=l?r.matches.map(m=>`${m.score1}-${m.score2}`).join(" · "):"";return`
    <div class="round ${l?"completed":""} ${c?"collapsed":""}" 
         id="round-${d}" 
         data-round="${d}">
      <div class="round-header" data-action="toggle-round" data-round="${d}">
        <span class="round-title">
          Round ${r.number} ${l?"(done)":""}
        </span>
        ${l?`<span class="round-summary" style="${c?"":"display: none"}">${u}</span>`:""}
        ${l?`<span class="collapse-icon">${c?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${r.matches.map((m,f)=>`
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${ve(m.court)}</span>
                <span class="match-info-sub">
                  ${n.scoringMode==="total"?`Total ${n.pointsPerMatch}`:n.scoringMode==="race"?`Race to ${n.pointsPerMatch}`:`${n.pointsPerMatch} mins`}
                </span>
                ${m.relaxedConstraint?`<span class="constraint-badge" title="${m.relaxedConstraint==="repeats"?"Repeat allowed (Priority: Pattern)":m.relaxedConstraint==="pattern"?"Pattern override (Priority: Repeats)":"Constraint relaxed (Best effort)"}">i</span>`:""}
              </div>
              <div class="match-card">
                <div class="match-teams">
                  <div class="team">
                    <span>${m.team1[0].name}</span>
                    ${m.team1[1]?`<span>${m.team1[1].name}</span>`:""}
                  </div>
                  <div class="team">
                    <span>${m.team2[0].name}</span>
                    ${m.team2[1]?`<span>${m.team2[1].name}</span>`:""}
                  </div>
                </div>
              </div>
              <div class="match-card-footer">
                ${l?`
                <div class="score-input-row">
                  <span class="score-display">${m.score1} - ${m.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${d}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${d}-${f}-1" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                         value="${m.score1||""}"
                         data-action="autofill-score" data-round="${d}" data-match="${f}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${d}-${f}-2" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                         value="${m.score2||""}"
                         data-action="autofill-score" data-round="${d}" data-match="${f}" data-team="2">
                </div>
                `}
              </div>
            </div>
          `).join("")}
        </div>
        ${r.byes&&r.byes.length>0?`
        <div class="waiting-players">
          <span class="waiting-label">Resting:</span>
          <span class="waiting-names">${r.byes.map(m=>m.name).join(", ")}</span>
        </div>
        `:""}
        ${!l&&i?`
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${n.manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${n.leaderboard.map(m=>`
              <button class="bye-chip ${n.manualByes.includes(m.id)?"selected":""}" 
                      data-action="toggle-bye" data-id="${m.id}">
                ${m.name}
                <span class="bye-count">(${m.byeCount||0})</span>
              </button>
            `).join("")}
          </div>
        </div>
        <button class="btn btn-success complete-round-btn" data-action="complete-round">
          Complete Round ${r.number}
        </button>
        `:""}
      </div>
    </div>
  `}).join(""),on(),fe(),ot(),pt();const o=n.schedule.findIndex(r=>!r.completed),s=o>=0?o:0,a=document.getElementById(`round-${s}`);a&&setTimeout(()=>{a.scrollIntoView({behavior:"smooth",block:"start"})},100)}function ce(){const e=document.getElementById("gameDetails");if(!e)return;const t={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},o={total:"Total Points",race:"Race to Points",time:"Time Based"},s=[{label:t[n.format]||"Tournament"},{label:`${n.courts} Courts`},{label:o[n.scoringMode]},{label:n.scoringMode==="time"?`${n.pointsPerMatch} Mins`:`${n.pointsPerMatch} Pts`}];e.innerHTML=s.map(a=>`
    <div class="game-detail-item">
      <span class="detail-label">${a.label}</span>
    </div>
  `).join("")}fn(U);function ke(e,t,o,s){setTimeout(pt,0);let a=parseInt(s);if(isNaN(a)||a<0)return;const r=parseInt(n.pointsPerMatch);if(!(isNaN(r)||r<=0)){if(n.scoringMode==="total"){if(a>r){a=r;const c=document.getElementById(`score-${e}-${t}-${o}`);c&&(c.value=a)}const d=o===1||o==="1"?2:1,i=r-a,l=document.getElementById(`score-${e}-${t}-${d}`);l&&i>=0&&(l.value=i)}else if(n.scoringMode==="race"){if(a<r){const d=o===1||o==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&(i.value=r)}else if(a===r){const d=o===1||o==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function pt(){const e=n.schedule.findIndex(r=>!r.completed);if(e===-1)return;const t=n.schedule[e],o=document.querySelector(".complete-round-btn");if(!o)return;let s=!0;const a=parseInt(n.pointsPerMatch);for(let r=0;r<t.matches.length;r++){const d=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`);if(!d||!i)continue;const l=d.value,c=i.value;if(l===""||c===""){s=!1;break}const u=parseInt(l),m=parseInt(c);if(n.scoringMode==="total"){if(u+m!==a){s=!1;break}}else if(u<0||m<0){s=!1;break}}o.disabled=!1,s?(o.classList.remove("btn-warning"),o.classList.add("btn-success"),o.textContent=`Complete Round ${t.number}`):(o.classList.add("btn-warning"),o.classList.remove("btn-success"),o.textContent="Complete Anyway")}function ft(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const s=t.querySelector(".collapse-icon");s&&(s.textContent="▼");const a=t.querySelector(".round-summary");a&&(a.style.display="none")}else{t.classList.add("collapsed");const s=t.querySelector(".collapse-icon");s&&(s.textContent="▶");const a=t.querySelector(".round-summary");a&&(a.style.display="")}}function yt(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),U();return}const o=n.courts*4,s=n.leaderboard.length,a=Math.max(0,s-o);if(a===0){C(`All ${s} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=a){C(`Max ${a} can rest. Deselect someone first.`);return}n.manualByes.push(e),U()}function gt(){const e=n.schedule.length-1,t=n.schedule[e];let o=!0;const s=[];if(t.matches.forEach((a,r)=>{const d=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`),l=d==null?void 0:d.value,c=i==null?void 0:i.value;let u=!0;(l===""||c==="")&&(u=!1,l===""&&(d==null||d.classList.add("error")),c===""&&(i==null||i.classList.add("error")));const m=parseInt(l)||0,f=parseInt(c)||0;if(n.scoringMode==="total"){const h=parseInt(n.pointsPerMatch,10);m+f!==h?(u=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&c!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error"))}else m<0||f<0?(u=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&c!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error"));u||(o=!1,s.push(ve(a.court)))}),!o){const a=s.length>0?` on ${s.join(", ")}`:"";H("Incomplete/Invalid Scores",`Some matches have missing or invalid scores${a}. Do you want to complete the round anyway?`,"Yes, Complete Anyway",()=>{he(t)},!0);return}if(n.scoringMode==="race"){const a=[],r=n.pointsPerMatch;if(t.matches.forEach((d,i)=>{const l=document.getElementById(`score-${e}-${i}-1`),c=document.getElementById(`score-${e}-${i}-2`),u=parseInt(l==null?void 0:l.value)||0,m=parseInt(c==null?void 0:c.value)||0;u<r&&m<r&&a.push(ve(d.court))}),a.length>0){const d=a.join(", ");H("Low Scores Detected",`On ${d}, neither team reached the target of ${r}. Is this correct?`,"Yes, Complete Round",()=>{he(t)},!0);return}}he(t)}function he(e){const t=n.schedule.findIndex(i=>i===e);st().forEach((i,l)=>{const c=n.leaderboard.find(u=>u.id===i.id);c&&(c.previousRank=l+1)}),e.matches.forEach((i,l)=>{const c=document.getElementById(`score-${t}-${l}-1`),u=document.getElementById(`score-${t}-${l}-2`),m=parseInt(c==null?void 0:c.value)||0,f=parseInt(u==null?void 0:u.value)||0;i.score1=m,i.score2=f;const h=m===f,p=m>f,y=f>m;i.team1[1]?(X(i.team1[0].id,m,f,p,h,i.team1[1].id),X(i.team1[1].id,m,f,p,h,i.team1[0].id),X(i.team2[0].id,f,m,y,h,i.team2[1].id),X(i.team2[1].id,f,m,y,h,i.team2[0].id)):(X(i.team1[0].id,m,f,p,h,null),X(i.team2[0].id,f,m,y,h,null))});const s=document.querySelector(".complete-round-btn");if(s&&(s.classList.add("completing"),s.textContent="✓ Completing..."),pe(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const l=n.leaderboard.find(c=>c.id===i.id);l&&(l.byeCount=(l.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="teamMexicano"){if(n.currentRound<=20){const i=un();i.matches.length>0&&n.schedule.push(i)}}else if(n.format==="mexicano"&&n.currentRound<=20){const i=pn(n.leaderboard);i.matches.length>0&&n.schedule.push(i)}j(),U(),S();const a=document.getElementById(`round-${t}`);a&&(a.classList.add("complete-flash"),setTimeout(()=>a.classList.remove("complete-flash"),1e3));const r=e.number,d=n.schedule.length>t+1;C(d?`✓ Round ${r} complete! Round ${r+1} ready`:`✓ Round ${r} complete!`),setTimeout(()=>{const i=n.schedule.length-1,l=document.getElementById(`round-${i}`);l&&(l.classList.add("animate-in","highlight"),l.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100)}function ht(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){pe();for(let s=e;s<n.schedule.length;s++){const a=n.schedule[s];a.completed&&a.matches.forEach(r=>{r.team1[1]?(Q(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),Q(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(Q(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,j(),U(),S(),C(`Editing Round ${e+1}`)}}const Me="padel_history_v1";function xn(){var s;const e=re(),t=Rt(),o={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((s=t.leaderboard[0])==null?void 0:s.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(o),e.length>20&&e.pop(),localStorage.setItem(Me,JSON.stringify(e)),o}function re(){try{const e=localStorage.getItem(Me);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function wn(e){H("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const o=re().filter(s=>s.id!==e);localStorage.setItem(Me,JSON.stringify(o)),vt(),C("Tournament deleted")},!0)}function Sn(e){const o=re().find(s=>s.id===e);if(!o){C("Tournament details not found","error");return}H("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{Fe(o.data),U(),j(),S(),C("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(s){console.error("Failed to load tournament",s),C("Error loading tournament","error")}},!1)}let me=[];function Cn(){vt();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const o=t.target.value.toLowerCase();Ln(o)})}function Ln(e){if(!e){Pe(me);return}const t=me.filter(o=>{var u,m,f,h,p,y,v,b;const s=(((u=o.summary)==null?void 0:u.winner)||((f=(m=o.players)==null?void 0:m[0])==null?void 0:f.name)||"").toLowerCase(),a=(((h=o.summary)==null?void 0:h.format)||o.format||"").toLowerCase(),r=((p=o.summary)==null?void 0:p.date)||o.date||"",d=String(((y=o.summary)==null?void 0:y.playerCount)||((v=o.players)==null?void 0:v.length)||""),i=String(((b=o.summary)==null?void 0:b.roundCount)||""),c=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return s.includes(e)||a.includes(e)||c.includes(e)||d.includes(e)||i.includes(e)});Pe(t)}function vt(){me=re(),Pe(me)}function Pe(e){const t=document.getElementById("historyTableBody"),o=document.getElementById("historyEmptyStatePage");if(!(!t||!o)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",o.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn btn-primary">
        Start a Tournament
      </button>
    `,o.style.display="block";return}t.parentElement.style.display="table",o.style.display="none",window.deleteHistoryItem=wn,window.loadTournament=Sn,window.downloadHistoryItem=En,t.innerHTML=e.map(s=>{var f,h,p;const a=s.summary?s.summary.date:s.date,r=s.summary?s.summary.format:s.format||"Unknown",d=s.summary?s.summary.winner:((h=(f=s.players)==null?void 0:f[0])==null?void 0:h.name)||"Unknown",i=s.summary?s.summary.playerCount:((p=s.players)==null?void 0:p.length)||0,l=new Date(a),c=l.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),u=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),m=!!s.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${c}</span>
            <span class="date-sub">${u}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-sm badge-outline">${r}</span>
        </td>
        <td>
          <div class="winner-cell">
            <span class="trophy-icon">🏆</span>
            <span class="winner-name">${d}</span>
          </div>
        </td>
        <td>${i}</td>
        <td class="text-right">
           <div class="action-buttons">
              <button 
                onclick="downloadHistoryItem('${s.id}')" 
                class="btn btn-sm btn-ghost"
                title="Download CSV"
              >
                CSV
              </button>
              <button 
                onclick="loadTournament('${s.id}')" 
                class="btn btn-sm btn-primary"
                ${m?"":"disabled"}
                title="Restore this tournament"
              >
                Load
              </button>
              <button 
                onclick="deleteHistoryItem('${s.id}')" 
                class="btn btn-sm btn-ghost text-error"
                title="Delete permanently"
              >
                <i class="fas fa-trash"></i>
              </button>
           </div>
        </td>
      </tr>
      `}).join("")}}function En(e){const o=re().find(s=>s.id===e);o&&o.data&&window.exportTournamentData&&window.exportTournamentData(o.data)}document.addEventListener("DOMContentLoaded",()=>{});function In(e,t){let o;const s=document.getElementById(e),a=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",d=>{d.preventDefault(),o=d,s&&(s.style.display="inline-flex",s.addEventListener("click",async()=>{s.style.display="none",o.prompt(),(await o.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),o=null}))}),a&&!r&&s&&t&&(s.style.display="inline-flex",s.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{s&&(s.style.display="none"),o=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function kn(){console.log("Tournament App: Initialized"),Pt({activeLink:"tournament"}),In("installBtn",()=>{ne("Install App on iPhone",`
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `)}),$t();const e=je();Tt(),e.format.value=n.format,e.courts.value=n.courts,e.scoringMode.value=n.scoringMode,e.points.value=n.pointsPerMatch,e.courtFormat.value=n.courtFormat,e.maxRepeats.value=n.maxRepeats,e.pairingStrategy&&(e.pairingStrategy.value=n.pairingStrategy);const t=document.getElementById("rankingCriteria");t&&(t.value=n.rankingCriteria);const o=document.getElementById("strictStrategy");if(o&&(o.checked=n.strictStrategy||!1),Ve(),yn(F),Y(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const s=document.getElementById("tournamentActionsSection");s&&(s.style.display="block"),U(),j(),fe()}Mn(e),oe(),Tn(),Cn(),window.addEventListener("resize",nt),Bn(),q(),tt(),F(),Pn(),$n()}function Pn(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const o=t.getBoundingClientRect(),s=document.createElement("span");s.className="ripple",s.style.width=s.style.height=`${Math.max(o.width,o.height)}px`,s.style.left=`${e.clientX-o.left-s.offsetWidth/2}px`,s.style.top=`${e.clientY-o.top-s.offsetHeight/2}px`,t.appendChild(s),setTimeout(()=>s.remove(),600)})}function $n(){const e=document.querySelectorAll(".section-title, .card-header-basic h3, .card-header-advanced h3, .leaderboard-header h3, .players-header h3");e.forEach(o=>o.classList.add("animate-in"));const t=new IntersectionObserver(o=>{o.forEach(s=>{s.isIntersecting&&s.target.classList.add("animate-in")})},{threshold:.1});e.forEach(o=>t.observe(o))}function Bn(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function Mn(e){const t=document.getElementById("undoBtn");t&&(t.addEventListener("click",()=>{if(Mt())if(C("Undo successful"),e.format.value=n.format,Y(),U(),j(),q(),fe(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="none")}}),document.addEventListener("keydown",u=>{(u.ctrlKey||u.metaKey)&&u.key==="z"&&!u.shiftKey&&(u.preventDefault(),t.click())})),e.addPlayerBtn.addEventListener("click",Ze),e.cancelAddBtn.addEventListener("click",Ce),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Ut(()=>{Y(),J(),q()})}),e.importPlayersBtn.addEventListener("click",et),e.closeImportModal.addEventListener("click",de),e.cancelImportBtn.addEventListener("click",de),e.confirmImportBtn.addEventListener("click",()=>{const u=e.importTextarea.value,m=Yt(u);let f=`Added ${m.added} players.`;m.duplicates>0&&(f+=` Skipped ${m.duplicates} duplicates.`),m.hitLimit&&(f+=" Stopped at 24 max limit."),e.importStatus.textContent=f,Y(),m.added>0&&m.duplicates===0&&!m.hitLimit&&(setTimeout(de,1500),C(`Imported ${m.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{qe(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),Y())}),e.playerNameInput.addEventListener("keydown",u=>{u.key==="Enter"?qe(e.playerNameInput.value)&&(e.playerNameInput.value="",Y()):u.key==="Escape"&&Ce()}),e.format.addEventListener("change",()=>{n.format=e.format.value,q(),S(),n.schedule.length>0&&ce()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),S(),F(),n.schedule.length>0&&ce(),n.courtFormat==="custom"&&be()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),S(),F(),n.schedule.length>0&&U()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,tt(),S(),F(),n.schedule.length>0&&U()});const o=document.getElementById("rankingCriteria");o&&o.addEventListener("change",()=>{n.rankingCriteria=o.value,it(),S()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Ve(),S()}),e.courts.addEventListener("input",()=>{const m=e.courts.value;if(m==="")return;let f=parseInt(m)||1;f=Math.max(1,Math.min(50,f)),!n.isLocked&&(e.courts.value=f,n.courts=f,S(),n.courtFormat==="custom"&&be(),n.schedule.length>0&&ce())}),e.maxRepeats.addEventListener("change",u=>{const m=parseInt(u.target.value),f=n.maxRepeats;n.isLocked?(u.target.value=f,H("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=m,e.maxRepeats.value=m,S(),F(),C("Max Partner Repeats updated")},!0)):(n.maxRepeats=m,S(),F())});const s=document.getElementById("strictStrategy");s&&s.addEventListener("change",u=>{if(n.pairingStrategy==="optimal"){u.target.checked=!1,C("Strict Pattern is not available with Optimal pairing","info");return}const m=u.target.checked,f=n.strictStrategy;n.isLocked?(u.target.checked=!!f,H("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=m,s.checked=m,S(),C("Strict Mode updated")},!0)):(n.strictStrategy=m,S())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",u=>{const m=u.target.value,f=n.pairingStrategy;if(n.isLocked)u.target.value=f,H("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(n.pairingStrategy=m,e.pairingStrategy.value=m,m==="optimal"){n.strictStrategy=!1;const h=document.getElementById("strictStrategy");h&&(h.checked=!1)}S(),q(),C("Pairing Strategy updated")},!0);else{if(n.pairingStrategy=m,m==="optimal"){n.strictStrategy=!1;const h=document.getElementById("strictStrategy");h&&(h.checked=!1)}S(),q()}}),e.addPartnerPairBtn.addEventListener("click",()=>{if(Ke().length<2){C("Not enough available players to form a pair","error");return}Gt(),J(),q(),oe(),C("Fixed pair added","success")});const a=document.getElementById("helpFormat");a&&a.addEventListener("click",()=>{ne("Tournament Formats",`
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>Americano</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">The ultimate social format. You play with a different partner every round, ensuring everyone mixes and gets to know each other.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #4ade80;">✅ Social mixing:</strong> Perfect for corporate events or social clubs.</div>
               <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
                 <span style="font-size: 1.1em;">ℹ️</span> <span>Players collect individual points for every game won.</span>
               </div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>Mexicano</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Competitive and dynamic. The system matches players of similar skill levels. As the tournament progresses, matches become tighter and more exciting.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #60a5fa;">🏆 Level matches:</strong> Smart matchmaking based on current leaderboard rank.</div>
               <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
                 <span style="font-size: 1.1em;">ℹ️</span> <span>"Winners play winners" logic keeps the competition fierce.</span>
               </div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>Team Formats</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Bring your own partner. You stay together as a fixed duo throughout the entire tournament. Can be played using Americano or Mexicano rules.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #f472b6;">🤝 Fixed Teams:</strong> Ideal for club championships or pre-defined pairs.</div>
               <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
                 <span style="font-size: 1.1em;">ℹ️</span> <span>The leaderboard tracks team performance instead of individuals.</span>
               </div>
            </div>
          </section>
        </div>
        `)});const r=document.getElementById("helpScoring");r&&r.addEventListener("click",()=>{ne("Scoring Modes",`
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Total Points</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Every single point matters. You play a fixed number of points (e.g., 24), and the final score is recorded exactly as it ends.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 4px; font-size: 0.9em;"><strong>Example:</strong> Team A: 14, Team B: 10</div>
               <div style="font-size: 0.9em; opacity: 0.8;">These points are added directly to each player's global total.</div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Race (First to X)</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">A classic match feel. The first team to reach the target score wins the match immediately.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 4px; font-size: 0.9em;"><strong>Example:</strong> First to 21 wins.</div>
               <div style="font-size: 0.9em; opacity: 0.8;">Perfect for keeping that "winning the set" excitement.</div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Timed (Minutes)</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Play against the clock. When the buzzer sounds, the team currently leading wins the match.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 4px; font-size: 0.9em;">⏱️ <strong>Strict Schedule:</strong> Ensures all matches finish at the exact same time.</div>
               <div style="font-size: 0.9em; opacity: 0.8;">Great for tournaments with limited court time.</div>
            </div>
          </section>
        </div>
        `)});const d=document.getElementById("helpMatchup");d&&d.addEventListener("click",()=>{ne("Matchup Rules",`
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">Fine-tune how the <strong>Mexicano</strong> engine pairs players together.</p>

          <section>
            <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Max Partner Repeats</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">Controls variety. How many times can you play with the same partner?</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;">🔄 <strong>Set to 0:</strong> Maximum variety (never repeat if possible).</div>
               <div style="font-size: 0.9em; opacity: 0.8;">♾️ <strong>Unlimited:</strong> Purest competition (best pairing always used).</div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Pairing Strategy</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">How to form teams from the top 4 available players (Rank 1-4) each round.</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="padding-left: 12px; border-left: 2px solid #60a5fa;">
                <div style="font-weight: 600; font-size: 0.95em; color: var(--text-primary);">Optimal (Smart)</div>
                <div style="font-size: 0.9em; color: var(--text-secondary);">AI analyzes all options to find the pair that best avoids partner repeats.</div>
              </div>
              <div style="padding-left: 12px; border-left: 2px solid rgba(255, 255, 255, 0.2);">
                <div style="font-weight: 600; font-size: 0.95em; color: var(--text-primary);">Standard (1&3 vs 2&4)</div>
                <div style="font-size: 0.9em; color: var(--text-secondary);">The classic Mexicano logic. Always pairs 1st with 3rd against 2nd & 4th.</div>
              </div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Strict Pattern</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">What happens when the "Standard" pattern conflicts with your "Max Repeats" setting?</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;">⬜ <strong>OFF (Smart):</strong> Pattern is broken to avoid repeats.</div>
               <div style="font-size: 0.9em;">✅ <strong>ON (Strict):</strong> Pattern is forced, even if it causes a repeat.</div>
            </div>
          </section>
        </div>
        `)});const i=document.getElementById("helpLeaderboard");i&&i.addEventListener("click",()=>{ne("Leaderboard Guide",`
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">Track player standings throughout the tournament. Rankings update automatically after each round.</p>
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;"># (Rank)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Current position based on your chosen criteria. Arrows indicate movement since the last round.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Pts (Points)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Total points won across all matches. This is the primary way players are ranked.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">W (Wins)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">The total number of matches you have won.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Diff (Difference)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Point difference (Points Won - Points Lost). Crucial for breaking ties in the rankings.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">% (Win Rate)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Your efficiency. The percentage of wins compared to matches played.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Pl (Played)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Total matches played. Note: Bye rounds do not count as played matches.</div>
            </section>
          </div>
        </div>
        `)}),e.generateBtn.addEventListener("click",gn),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",hn),e.gridColumns&&e.gridColumns.addEventListener("input",an),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),ot(),S()});const l=document.getElementById("factoryResetBtn");l&&l.addEventListener("click",()=>{H("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const c=document.getElementById("roundScale");c&&c.addEventListener("input",rn)}function Tn(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const o=t.dataset.action,s=t.dataset.id?Number(t.dataset.id):null,a=t.dataset.round?parseInt(t.dataset.round):null;switch(o){case"remove-player":s!==null&&(Je(s),Y());break;case"toggle-player-list":Be();break;case"remove-pair":s!==null&&($e(s),J(),q(),oe());break;case"toggle-bye":s!==null&&yt(s);break;case"toggle-round":a!==null&&ft(a);break;case"complete-round":gt();break;case"edit-round":a!==null&&ht(a);break;case"toggle-visibility":at();break;case"toggle-position":rt();break;case"end-tournament":dt(Ge);break;case"toggle-toolbar":ct();break;case"export-data":ut();break;case"share-results":mt();break;case"add-late-player":bt();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const o=t.dataset.action,s=t.dataset.pairId?Number(t.dataset.pairId):null,a=t.dataset.which?parseInt(t.dataset.which):null;if(o==="update-partner"&&s!==null&&a!==null&&(Xe(s,a,Number(t.value)),J(),q(),oe()),o==="autofill-score"&&n.scoringMode==="race"){const r=parseInt(t.dataset.round),d=parseInt(t.dataset.match),i=parseInt(t.dataset.team),l=t.value;ke(r,d,i,l)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||n.scoringMode==="race")return;const o=parseInt(t.dataset.round),s=parseInt(t.dataset.match),a=parseInt(t.dataset.team),r=t.value;ke(o,s,a,r)})}function bt(){const e=n.format==="team"||n.format==="teamMexicano";_e(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,C("Switched to Mexicano format")}_t(t.trim());const o=document.getElementById("playerCount");o&&(o.textContent=`(${n.players.length})`),j(),C(`Added ${t.trim()} to tournament`)}})}window.removePlayer=e=>{Je(e),Y()};window.togglePlayerList=Be;window.updatePreferredPair=(e,t,o)=>{Xe(e,t,o),J()};window.removePreferredPair=e=>{$e(e),J()};window.updateCustomCourtName=At;window.autoFillScore=ke;window.toggleManualBye=yt;window.toggleRoundCollapse=ft;window.completeRound=gt;window.editRound=ht;window.toggleLeaderboardVisibility=at;window.togglePositionChanges=rt;window.updateRankingCriteria=it;window.updateSetupUI=q;window.endTournament=()=>dt(Ge);window.validateCourts=We;window.toggleToolbar=ct;window.exportTournamentData=ut;window.shareResults=mt;window.promptAddLatePlayer=bt;kn();
