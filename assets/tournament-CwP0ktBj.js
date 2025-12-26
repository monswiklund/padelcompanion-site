import{i as on,a as rn}from"./layout-SYb1dC3V.js";const we=1,a={version:we,players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,tournamentName:"",tournamentNotes:"",schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2,tournament:{format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},winnersCourt:null,ui:{currentRoute:"",selectedMatchId:null}},le=[],ln=20;function bt(){const e=document.getElementById("undoBtn");e&&(e.disabled=le.length===0)}function Ee(){const e=JSON.parse(JSON.stringify(a));le.push(e),le.length>ln&&le.shift(),bt()}function dn(){if(le.length===0)return!1;const e=le.pop();return Je(e),bt(),!0}const xt="tournament-state";function w(){localStorage.setItem(xt,JSON.stringify({version:a.version,players:a.players,format:a.format,courts:a.courts,scoringMode:a.scoringMode,pointsPerMatch:a.pointsPerMatch,rankingCriteria:a.rankingCriteria,courtFormat:a.courtFormat,customCourtNames:a.customCourtNames,maxRepeats:a.maxRepeats,pairingStrategy:a.pairingStrategy,preferredPartners:a.preferredPartners,tournamentName:a.tournamentName,tournamentNotes:a.tournamentNotes,schedule:a.schedule,currentRound:a.currentRound,leaderboard:a.leaderboard,allRounds:a.allRounds,isLocked:a.isLocked,hideLeaderboard:a.hideLeaderboard,manualByes:a.manualByes,gridColumns:a.gridColumns,textSize:a.textSize,tournament:a.tournament,ui:a.ui,winnersCourt:a.winnersCourt}))}function cn(){const e=localStorage.getItem(xt);if(!e)return!1;try{let t=JSON.parse(e);return t=un(t),a.players=Array.isArray(t.players)?t.players.slice(0,200):[],a.format=t.format||"americano",a.courts=Math.max(1,Math.min(50,t.courts||2)),a.scoringMode=t.scoringMode||"total",a.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),a.rankingCriteria=t.rankingCriteria||"points",a.courtFormat=t.courtFormat||"court",a.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],a.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),a.pairingStrategy=t.pairingStrategy||"optimal",a.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],a.tournamentName=t.tournamentName||"",a.tournamentNotes=t.tournamentNotes||"",a.schedule=Array.isArray(t.schedule)?t.schedule:[],a.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),a.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],a.allRounds=t.allRounds||null,a.isLocked=t.isLocked||!1,a.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,a.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],a.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),a.textSize=Math.max(50,Math.min(200,t.textSize||100)),t.tournament&&(a.tournament={format:t.tournament.format||"single",teams:t.tournament.teams||[],matches:t.tournament.matches||[],standings:t.tournament.standings||[],meta:t.tournament.meta||{name:"",notes:"",createdAt:null}}),t.ui&&(a.ui={currentRoute:t.ui.currentRoute||"",selectedMatchId:t.ui.selectedMatchId||null}),a.winnersCourt=t.winnersCourt||null,!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function un(e){const t=e.version||0;return t<we&&(console.log(`[State] Migrating from v${t} to v${we}`),t<1&&(e.tournament=e.tournament||{format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},e.ui=e.ui||{currentRoute:"",selectedMatchId:null}),e.version=we),e}function pn(){return JSON.parse(JSON.stringify(a))}function Je(e){e&&(Object.keys(a).forEach(t=>{e.hasOwnProperty(t)&&(a[t]=e[t])}),a.players=a.players||[],a.schedule=a.schedule||[],a.leaderboard=a.leaderboard||[],w())}function Se(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function x(e,t={}){let s="default",n,o;typeof t=="number"?n=t:typeof t=="string"?s=t:typeof t=="object"&&(s=t.type??"default",n=t.duration,o=t.dismissible);const r={success:{duration:2500,dismissible:!1},info:{duration:3e3,dismissible:!1},warning:{duration:5e3,dismissible:!0},error:{duration:0,dismissible:!0},default:{duration:3e3,dismissible:!1}},l=r[s]||r.default;n=n??l.duration,o=o??l.dismissible;const i=document.querySelector(".toast");i&&i.remove();const d={success:"✓",error:"✕",warning:"⚠",info:"ℹ",default:""},c=document.createElement("div");c.className=`toast ${s}`,s==="error"?(c.setAttribute("role","alert"),c.setAttribute("aria-live","assertive")):(c.setAttribute("role","status"),c.setAttribute("aria-live","polite"));const p=d[s]||"";if(p){const m=document.createElement("span");m.className="toast-icon",m.textContent=p,c.appendChild(m)}const u=document.createElement("span");u.className="toast-message",u.textContent=e,c.appendChild(u);const f=()=>{c.classList.remove("visible"),setTimeout(()=>c.remove(),300)};if(o){const m=document.createElement("button");m.className="toast-close",m.setAttribute("aria-label","Close notification"),m.textContent="×",m.addEventListener("click",f),c.appendChild(m)}document.body.appendChild(c);const g=m=>{m.key==="Escape"&&o&&(f(),document.removeEventListener("keydown",g))};o&&document.addEventListener("keydown",g),setTimeout(()=>c.classList.add("visible"),10),n>0&&setTimeout(()=>{f(),document.removeEventListener("keydown",g)},n)}function fe(){return Math.floor(Date.now()+Math.random()*1e6)}let $e=null;function Xe(){return $e={playersSection:document.querySelector(".players-section"),tournamentConfig:document.getElementById("tournamentConfig"),format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn"),runningBadge:document.getElementById("runningBadge")},$e}function M(){return $e||Xe(),$e}function qe(e){switch(a.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return a.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function wt(){var i;const e=M(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const n=parseInt(t.value)||1,o=((i=e.format)==null?void 0:i.value)||a.format,r=o==="team"||o==="teamMexicano"?2:4,l=Math.floor(a.players.length/r);return t.max=Math.max(1,l),n>l&&l>0?(s.textContent=`⚠️ ${a.players.length} players can only fill ${l} court${l!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):l===0&&a.players.length>0?(s.textContent=`⚠️ Need at least ${r} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function Ke(){const e=M();if(!e.customCourtNamesSection)return;a.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",me()):e.customCourtNamesSection.style.display="none"}function me(){const e=M();if(!e.customCourtNamesList)return;const t=Math.max(1,a.courts||2);for(Array.isArray(a.customCourtNames)||(a.customCourtNames=[]);a.customCourtNames.length<t;)a.customCourtNames.push(`Court ${a.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,n)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(a.customCourtNames[n]||`Court ${n+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${n}, this.value)"
             placeholder="Court ${n+1}">
    </div>
  `).join("")}function mn(e,t){a.customCourtNames[e]=t||`Court ${e+1}`,w()}function St(){const e=M(),t=new Set;a.preferredPartners.forEach(s=>{t.add(s.player1Id),t.add(s.player2Id)}),a.players.filter(s=>!t.has(s.id)),e.addPartnerPairBtn.disabled=!1}function ee(){const e=M(),t=s=>{const n=new Set;return a.preferredPartners.forEach(o=>{o.id!==s&&(n.add(o.player1Id),n.add(o.player2Id))}),n};if(e.preferredPartnersList){if(a.preferredPartners.length===0){e.preferredPartnersList.innerHTML="";return}e.preferredPartnersList.innerHTML=`
    <ul class="pairs-bullet-list">
      ${a.preferredPartners.map(s=>{const n=t(s.id),o=a.players.filter(i=>i.id===s.player1Id||i.id===s.player2Id||!n.has(i.id)),r=o.filter(i=>i.id!==s.player2Id||i.id===s.player1Id),l=o.filter(i=>i.id!==s.player1Id||i.id===s.player2Id);return`
            <li class="partner-pair-item" data-pair-id="${s.id}">
              <div class="pair-inputs">
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${s.id}" data-which="1">
                  ${r.map(i=>`<option value="${i.id}" ${i.id===s.player1Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
                <span class="pair-separator">&</span>
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${s.id}" data-which="2">
                  ${l.map(i=>`<option value="${i.id}" ${i.id===s.player2Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
              </div>
              <button class="remove-pair-btn" data-action="remove-pair" data-id="${s.id}">
                <span class="remove-icon">×</span>
              </button>
            </li>
          `}).join("")}
    </ul>
  `}}function ae(){document.querySelectorAll(".form-select").forEach(s=>{if(s.closest(".custom-select-wrapper")||s.classList.contains("no-custom"))return;const n=document.createElement("div");n.classList.add("custom-select-wrapper"),s.parentNode.insertBefore(n,s),n.appendChild(s);const o=document.createElement("div");o.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),s.classList.contains("btn-sm")&&r.classList.add("btn-sm"),s.classList.contains("compact-select")&&(n.classList.add("compact-select"),r.classList.add("compact-select"));const l=s.selectedIndex>=0?s.options[s.selectedIndex]:s.options.length>0?s.options[0]:null;r.innerHTML=`<span>${l?l.text:"Select..."}</span>`;const i=document.createElement("div");i.classList.add("custom-options"),Array.from(s.options).forEach(d=>{const c=document.createElement("div");c.classList.add("custom-option"),c.textContent=d.text,c.dataset.value=d.value,d.selected&&c.classList.add("selected"),c.addEventListener("click",()=>{s.value=c.dataset.value,s.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${c.textContent}</span>`,i.querySelectorAll(".custom-option").forEach(p=>p.classList.remove("selected")),c.classList.add("selected"),o.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width=""}),i.appendChild(c)}),o.appendChild(r),o.appendChild(i),n.appendChild(o),r.addEventListener("click",d=>{d.stopPropagation();const c=o.classList.contains("open");if(document.querySelectorAll(".custom-select.open").forEach(p=>{if(p!==o){p.classList.remove("open"),p.querySelector(".custom-options").classList.remove("show");const u=p.querySelector(".custom-options");u.style.position="",u.style.top="",u.style.left="",u.style.width="",u.style.margin=""}}),c)o.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width="",i.style.margin="";else{o.classList.add("open"),i.classList.add("show");const p=o.getBoundingClientRect();i.style.position="fixed",i.style.top=`${p.bottom+4}px`,i.style.left=`${p.left}px`,i.style.width=`${p.width}px`,i.style.zIndex="9999",i.style.margin="0"}}),s.style.display="none"}),document.addEventListener("click",s=>{s.target.closest(".custom-select")||t()}),document.addEventListener("scroll",s=>{s.target.closest&&s.target.closest(".custom-options")||t()},!0);function t(){document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open");const n=s.querySelector(".custom-options");n.classList.remove("show"),n.style.position="",n.style.top="",n.style.left="",n.style.width="",n.style.margin=""})}}const yn="modulepreload",fn=function(e){return"/"+e},dt={},ct=function(t,s,n){let o=Promise.resolve();if(s&&s.length>0){let l=function(c){return Promise.all(c.map(p=>Promise.resolve(p).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),d=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));o=l(s.map(c=>{if(c=fn(c),c in dt)return;dt[c]=!0;const p=c.endsWith(".css"),u=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const f=document.createElement("link");if(f.rel=p?"stylesheet":yn,p||(f.as="script"),f.crossOrigin="",f.href=c,d&&f.setAttribute("nonce",d),document.head.appendChild(f),p)return new Promise((g,m)=>{f.addEventListener("load",g),f.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(l){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=l,window.dispatchEvent(i),!i.defaultPrevented)throw l}return o.then(l=>{for(const i of l||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};let T,X,K,Q,de=[],Fe,ye=!1;const ut=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function pt(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function gn(){this.x=Math.random()*K,this.y=Math.random()*Q-Q,this.r=pt(10,30),this.d=Math.random()*150+10,this.color=ut[pt(0,ut.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return X.beginPath(),X.lineWidth=this.r/2,X.strokeStyle=this.color,X.moveTo(this.x+this.tilt+this.r/4,this.y),X.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),X.stroke()}}function kt(){if(ye){X.clearRect(0,0,K,Q);for(let e=0;e<de.length;e++)de[e].draw();hn(),Fe=requestAnimationFrame(kt)}}function hn(){for(let e=0;e<de.length;e++){const t=de[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>K+20||t.x<-20||t.y>Q)&&ye&&(t.x=Math.random()*K,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function vn(){if(!ye){T||(T=document.createElement("canvas"),T.id="confetti-canvas",T.style.position="fixed",T.style.top="0",T.style.left="0",T.style.width="100%",T.style.height="100%",T.style.pointerEvents="none",T.style.zIndex="9999",document.body.appendChild(T),X=T.getContext("2d")),K=window.innerWidth,Q=window.innerHeight,T.width=K,T.height=Q,window.addEventListener("resize",()=>{K=window.innerWidth,Q=window.innerHeight,T.width=K,T.height=Q}),ye=!0,de=[];for(let e=0;e<150;e++)de.push(new gn);kt()}}function bn(){ye=!1,X&&X.clearRect(0,0,K,Q),Fe&&cancelAnimationFrame(Fe),T&&T.remove(),T=null}function xn(){vn(),setTimeout(bn,5e3)}function N(e,t,s="Confirm",n,o=!1,r=null,l=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const d=document.createElement("div");d.className="modal-overlay confirm-modal",d.style.display="flex";const c=o?"btn btn-danger":"btn btn-primary";d.innerHTML=`
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
          <button class="${c}" id="modalConfirmBtn" style="flex: 1;">${s}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(d),setTimeout(()=>d.classList.add("visible"),10);const p=d.querySelector(".modal");p&&p.addEventListener("click",y=>y.stopPropagation());const u=d.querySelector("#modalCancelBtn"),f=d.querySelector("#modalConfirmBtn"),g=d.querySelector("#modalSecondaryBtn"),m=()=>d.remove();u&&u.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),m()}),f&&f.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),m(),n()}),g&&l&&g.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),m(),l()}),d.addEventListener("click",y=>{y.target===d&&m()})}function Ie(e,t,s,n="",o="text"){const r=document.querySelector(".input-modal");r&&r.remove();const l=document.createElement("div");l.className="modal-overlay input-modal",l.style.display="flex";const i=n?`<p class="modal-hint" style="margin-bottom: var(--space-md); text-align: left;">${n}</p>`:"",d=o==="textarea"?`<textarea id="modalInput" class="form-input" placeholder="${t}" style="width: 100%; min-height: 120px; resize: vertical;"></textarea>`:`<input type="text" id="modalInput" class="form-input" placeholder="${t}" style="width: 100%;">`;l.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        ${i}
        <div class="form-group">
          ${d}
        </div>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: 10px;">
        <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Add</button>
      </div>
    </div>
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const c=l.querySelector("#modalInput"),p=l.querySelector("#modalCancelBtn"),u=l.querySelector("#modalConfirmBtn"),f=()=>l.remove();p.onclick=f;const g=()=>{const m=c.value;m&&m.trim()&&(f(),s(m.trim()))};u.onclick=g,c.onkeydown=m=>{m.key==="Enter"&&g(),m.key==="Escape"&&f()},setTimeout(()=>c.focus(),100)}function $t(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=o=>o===0?"🥇":o===1?"🥈":o===2?"🥉":`${o+1}.`,n=document.createElement("div");n.className="final-modal",n.innerHTML=`
    <div class="final-modal-content">
      <h2>Tournament Complete!</h2>
      <div class="final-standings">
        ${e.map((o,r)=>`
          <div class="final-standing-row ${r<3?"top-three":""}">
            <span class="medal">${s(r)}</span>
            <span class="name">${o.name}</span>
            <span class="stats">${o.points} pts · ${o.played} games</span>
          </div>
        `).join("")}
      </div>
      <div class="modal-actions-row" style="margin-top: 20px; gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-secondary" data-action="share-results">Share</button>
        <button class="btn btn-secondary" data-action="export-data">Download CSV</button>
        <button class="btn btn-primary" onclick="window.closeFinalModal()">Close</button>
      </div>
    </div>
  `,document.body.appendChild(n),xn(),setTimeout(()=>n.classList.add("visible"),10)}function wn(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function De(e,t,s){const n=document.querySelector(".alert-modal");n&&n.remove();const o=document.createElement("div");o.className="modal-overlay alert-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const r=o.querySelector(".modal");r&&r.addEventListener("click",d=>d.stopPropagation());const l=o.querySelector("#modalOkBtn"),i=()=>{o.remove()};l&&l.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),i()}),o.addEventListener("click",d=>{d.target===o&&i()}),o.addEventListener("click",d=>{d.target===o&&i()})}function Z(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const n=document.createElement("div");n.className="modal-overlay info-modal",n.style.display="flex",n.innerHTML=`
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
  `,document.body.appendChild(n),setTimeout(()=>n.classList.add("visible"),10);const o=n.querySelector(".modal");o&&o.addEventListener("click",d=>d.stopPropagation());const r=n.querySelector("#modalOkBtn"),l=n.querySelector("#modalCloseX"),i=()=>n.remove();r&&(r.onclick=i),l&&(l.onclick=i),n.addEventListener("click",d=>{d.target===n&&i()})}function Sn(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',t.style.cursor="pointer",document.body.appendChild(t);let s=!1,n=null;const o=()=>{s||(s=!0,n&&clearTimeout(n),t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},100))};t.addEventListener("click",o),requestAnimationFrame(()=>{t.classList.add("active")});const r=t.querySelector(".countdown-number"),l=["3","2","1","GO!"];let i=0;const d=()=>{if(s)return;if(i>=l.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const c=l[i];r.textContent=c,r.className="countdown-number"+(c==="GO!"?" countdown-go":""),r.style.animation="none",requestAnimationFrame(()=>{r.style.animation=""}),i++,n=setTimeout(d,c==="GO!"?600:800)};n=setTimeout(d,100)})}window.closeFinalModal=wn;function Ce(e){if(!e.trim())return!1;const t=e.trim();return a.players.length>=24?(x("Maximum 24 players allowed"),!1):a.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(x(`Player "${t}" already exists`),!1):(a.players.push({id:fe(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),a.players.length%4===0&&(a.courts=a.players.length/4),w(),!0)}function Ct(e){a.players=a.players.filter(t=>t.id!==e),w()}function Bt(e){if(console.log("removeAllPlayers called, players:",a.players.length),a.players.length===0){console.log("No players to remove");return}N("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),a.players=[],a.preferredPartners=[],w(),console.log("Players cleared, state:",a.players),e&&e()},!0)}function Lt(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(l=>l.trim()).filter(l=>l);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,n=0,o=!1;for(const l of t){if(a.players.length>=24){o=!0;break}if(a.players.some(i=>i.name.toLowerCase()===l.toLowerCase())){n++;continue}a.players.push({id:fe(),name:l,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}const r=Math.floor(a.players.length/4);return r>a.courts&&(a.courts=r),w(),{added:s,duplicates:n,hitLimit:o}}function kn(e){const t={id:fe(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return a.players.push(t),a.leaderboard.push(t),w(),!0}function Et(){const e=new Set;return a.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),a.players.filter(t=>!e.has(t.id))}function $n(){const e=Et();e.length<2||(a.preferredPartners.push({id:fe(),player1Id:e[0].id,player2Id:e[1].id}),w())}function Qe(e){a.preferredPartners=a.preferredPartners.filter(t=>t.id!==e),w()}function It(e,t,s){const n=a.preferredPartners.find(o=>o.id===e);n&&(t===1?n.player1Id=s:n.player2Id=s,w())}const Pt={format:{label:"Format",type:"select",options:[{value:"americano",label:"Americano"},{value:"mexicano",label:"Mexicano"},{value:"team",label:"Team Americano"},{value:"teamMexicano",label:"Team Mexicano"}],helpId:"helpFormat"},courts:{label:"Courts",type:"number",min:1,max:50},scoringMode:{label:"Scoring",type:"select",options:[{value:"total",label:"Total Points"},{value:"race",label:"Race to"},{value:"time",label:"Timed"}],helpId:"helpScoring"},pointsPerMatch:{label:"Points",type:"number",min:4,max:50},maxRepeats:{label:"Repeats",type:"select",options:[{value:0,label:"No repeats"},{value:1,label:"Max 1x"},{value:2,label:"Max 2x"},{value:3,label:"Max 3x"},{value:99,label:"Unlimited"}],mexicanoOnly:!0,helpId:"helpMatchup"},pairingStrategy:{label:"Pairing",type:"select",options:[{value:"optimal",label:"Optimal"},{value:"oneThree",label:"1&3 vs 2&4"},{value:"oneTwo",label:"1&2 vs 3&4"},{value:"oneFour",label:"1&4 vs 2&3"}],mexicanoOnly:!0,helpId:"helpMatchup"},strictStrategy:{label:"Prioritize Pattern",type:"toggle",mexicanoOnly:!0,helpId:"helpMatchup"}};function mt(){return a.scoringMode==="time"?"Minutes":a.scoringMode==="race"?"Race to":"Total Points"}function D(){var r,l;const e=document.getElementById("tournamentConfig");if(!e)return;En(e),e.style.display="block",a.format==="team"||a.format;const t=a.format==="mexicano"||a.format==="teamMexicano",s=((r=a.players)==null?void 0:r.length)||0,n=Math.max(1,Math.floor(s/4));a.courts>n&&(a.courts=n,w()),a.pointsPerMatch<4?(a.pointsPerMatch=4,w()):a.pointsPerMatch>50&&(a.pointsPerMatch=50,w());let o='<div class="config-grid">';if(o+=J("format",a.format),t?(o+='<div class="config-spacer"></div>',o+=J("scoringMode",a.scoringMode),o+=J("pointsPerMatch",a.pointsPerMatch,{label:mt()}),o+=J("maxRepeats",a.maxRepeats),o+=J("courts",a.courts),o+=J("pairingStrategy",a.pairingStrategy),o+=J("strictStrategy",a.strictStrategy,{disabled:a.pairingStrategy==="optimal"}),a.pairingStrategy!=="optimal"&&a.strictStrategy&&a.maxRepeats===0&&(o+=`
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `)):(o+=J("courts",a.courts),o+=J("scoringMode",a.scoringMode),o+=J("pointsPerMatch",a.pointsPerMatch,{label:mt()})),o+="</div>",t&&((l=a.preferredPartners)==null?void 0:l.length)>0){const i=a.preferredPartners.map(d=>{const c=a.players.find(u=>u.id===d.player1Id),p=a.players.find(u=>u.id===d.player2Id);return c&&p?`${c.name} & ${p.name}`:null}).filter(Boolean);i.length>0&&(o+=`
        <div class="config-pairs-section">
          <div class="config-pairs-header">
            <span class="config-pairs-label">Fixed Pairs:</span>
            <button class="btn btn-ghost btn-sm" data-action="edit-pairs">Edit</button>
          </div>
          <ul class="config-pairs-bullet-list">
            ${i.map(d=>`<li>${d}</li>`).join("")}
          </ul>
        </div>
      `)}else t&&(o+=`
      <div class="config-pairs-section config-pairs-empty">
        <button class="btn btn-dashed btn-sm" data-action="add-pair">+ Add Fixed Pair</button>
      </div>
    `);e.innerHTML=o}function Cn(e,t,s){const n=s.options.find(r=>String(r.value)===String(t)),o=n?n.label:t;return`
    <div class="ui-select-wrapper" data-key="${e}" tabindex="0">
      <div class="ui-trigger">
        <span>${o}</span>
        <div class="ui-arrow"></div>
      </div>
      <div class="ui-options">
        ${s.options.map(r=>`<div class="ui-option ${String(r.value)===String(t)?"selected":""}" data-value="${r.value}">${r.label}</div>`).join("")}
      </div>
    </div>
  `}function Bn(e,t,s){const n=s.min??1,o=s.max??99,r=Number.isFinite(t)?t:n,l=r<=n,i=r>=o,d=e==="pointsPerMatch"&&a.scoringMode!=="time"?2:1;return`
    <div class="ui-stepper" data-key="${e}" data-min="${n}" data-max="${o}">
      <button type="button" class="stepper-btn" data-delta="-${d}" ${l?"disabled":""} aria-label="Decrease ${e}">−</button>
      <input type="number" class="stepper-input" value="${r}" min="${n}" max="${o}" step="${d}" aria-label="${e} value">
      <button type="button" class="stepper-btn" data-delta="${d}" ${i?"disabled":""} aria-label="Increase ${e}">+</button>
    </div>
  `}function Ln(e,t,s={}){const n=!!t,o=!!s.disabled;return`
    <div class="ui-toggle ${n?"active":""} ${o?"disabled":""}" 
         data-key="${e}" 
         role="switch" 
         aria-checked="${n}"
         tabindex="${o?"-1":"0"}">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  `}function Oe(e){var s;const t={...Pt[e]};if(e==="courts"){const n=((s=a.players)==null?void 0:s.length)||0,o=Math.floor(n/4);t.max=Math.max(1,o)}return t}function J(e,t,s={}){const n=Oe(e),o=s.readonly,r=s.label??(n==null?void 0:n.label)??e;let l="";if(!n||o){let i=t;if(n&&n.options){const d=n.options.find(c=>c.value===t);d&&(i=d.label)}l=`<span class="config-value-static">${i}</span>`}else n.type==="select"?l=Cn(e,t,n):n.type==="number"?l=Bn(e,t,n):n.type==="toggle"?l=Ln(e,t,s):l=`<span class="config-value">${t}</span>`;return`
    <div class="config-row ${(n==null?void 0:n.type)==="toggle"?"toggle-row":""}" data-config-key="${e}">
      <div class="config-label-container">
        <span class="config-label">${r}:</span>
        ${n!=null&&n.helpId?`<button class="config-help" data-action="show-help" data-help-id="${n.helpId}">?</button>`:""}
      </div>
      ${l}
    </div>
  `}function Ne(e,t){a[e]=t,w();const s=M();if(e==="format"&&s.format&&(s.format.value=t),e==="courts"&&s.courts&&(s.courts.value=t),e==="scoringMode"&&s.scoringMode){s.scoringMode.value=t;const n={time:10,race:14,total:28};a.pointsPerMatch=n[t]||28,s.points&&(s.points.value=a.pointsPerMatch)}e==="pointsPerMatch"&&s.points&&(s.points.value=t),e==="maxRepeats"&&s.maxRepeats&&(s.maxRepeats.value=t),e==="pairingStrategy"&&s.pairingStrategy&&(s.pairingStrategy.value=t,t==="optimal"&&(a.strictStrategy=!1)),e==="strictStrategy"&&document.getElementById("strictStrategy")&&(document.getElementById("strictStrategy").checked=t),D(),ct(()=>Promise.resolve().then(()=>Tn),void 0).then(n=>n.renderPlayers&&n.renderPlayers()),e==="format"&&ct(()=>Promise.resolve().then(()=>Wn),void 0).then(n=>n.updateSetupUI&&n.updateSetupUI())}function En(e){if(e.dataset.listenersAttached){console.log("Tournament Config: Listeners already attached");return}e.dataset.listenersAttached="true",console.log("Tournament Config: Attaching listeners to",e),e.addEventListener("change",t=>{var n;console.log("Tournament Config: Change event",t.target);const s=t.target;if(s.classList.contains("config-input")||s.classList.contains("stepper-input")){const o=s.closest(".ui-stepper"),r=s.dataset.key||(o==null?void 0:o.dataset.key);if(!r)return;const l=Oe(r),i=(l==null?void 0:l.min)??1,d=(l==null?void 0:l.max)??99;let c=parseInt(s.value,10);isNaN(c)&&(c=i),r==="courts"&&c>d&&De("Too many courts",`You need at least ${c*4} players to use ${c} courts. With ${((n=a.players)==null?void 0:n.length)||0} players, you can have a maximum of ${d} courts.`)}}),e.addEventListener("click",t=>{console.log("Tournament Config: Click event",t.target);const s=t.target.closest(".stepper-btn");if(s){const d=s.closest(".ui-stepper"),c=d==null?void 0:d.dataset.key;if(!c)return;const p=Oe(c),u=parseInt(s.dataset.delta,10)||0,f=(p==null?void 0:p.min)??1,g=(p==null?void 0:p.max)??99,m=parseInt(a[c],10);if(u>0&&m>=g&&c==="courts"){De("Too many courts",`You need at least ${(m+1)*4} players to use ${m+1} courts.`);return}const y=Math.min(g,Math.max(f,(Number.isFinite(m)?m:f)+u));y!==m&&Ne(c,y);return}const n=t.target.closest(".ui-toggle");if(n&&!n.classList.contains("disabled")){const d=n.dataset.key,c=!a[d];Ne(d,c);return}const o=t.target.closest(".ui-select-wrapper");if(o&&!t.target.closest(".ui-option")){const d=o.classList.contains("open");if(document.querySelectorAll(".ui-select-wrapper.open").forEach(c=>{c.classList.remove("open");const p=c.querySelector(".ui-options");p&&(p.style.display="none"),c.closest(".config-row")&&(c.closest(".config-row").style.zIndex="")}),!d){o.classList.add("open");const c=o.querySelector(".ui-options");c&&(c.style.display="block"),o.closest(".config-row")&&(o.closest(".config-row").style.zIndex="100")}}const r=t.target.closest(".ui-option");if(r){const d=r.closest(".ui-select-wrapper"),c=r.dataset.value,p=d.dataset.key,u=Pt[p];let f=c;(u.type==="number"||p==="courts"||p==="maxRepeats"||p==="pointsPerMatch")&&!isNaN(c)&&c.trim()!==""&&(f=parseInt(c)),Ne(p,f)}const l=t.target.closest("[data-action]");if(!l)return;const i=l.dataset.action;if(i==="show-help"){const d=l.dataset.helpId,c=document.getElementById(d);c&&c.click()}if(i==="edit-pairs"||i==="add-pair"){if(i==="add-pair")try{const d=new Set;if(a.preferredPartners&&a.preferredPartners.forEach(p=>{d.add(String(p.player1Id)),d.add(String(p.player2Id))}),a.players.filter(p=>!d.has(String(p.id))).length<2){x("Not enough available players to form a pair","error");return}}catch(d){console.error("Validation error:",d)}Pn()}})}function In(e){e.target.closest(".ui-select-wrapper")||document.querySelectorAll(".ui-select-wrapper.open").forEach(t=>{t.classList.remove("open");const s=t.querySelector(".ui-options");s&&(s.style.display="none"),t.closest(".config-row")&&(t.closest(".config-row").style.zIndex="")})}function Pn(){a.preferredPartners||(a.preferredPartners=[]);const e=document.createElement("div");e.className="modal-overlay active",e.style.display="flex";const t=(h,$)=>String(h)===String($),s=h=>a.players.find($=>t($.id,h)),n=h=>a.preferredPartners.find($=>t($.id,h));let o=null,r=null;const l=`
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
    ${l}
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
  `,document.body.appendChild(e);const i=h=>{h.key==="Escape"&&c()};document.addEventListener("keydown",i);const d=()=>document.removeEventListener("keydown",i),c=()=>{d(),e.remove()},p=e.querySelector("#sel1"),u=e.querySelector("#sel2"),f=e.querySelector("#addBtn"),g=e.querySelector("#pairsList"),m=(h,$,C)=>{const L=a.players.find(P=>t(P.id,$)),v=L?L.name:C;let k=`
      <div class="select-trigger ${!!L?"filled":""}">
        <span>${v}</span>
        <span class="select-arrow">▼</span>
      </div>
      <div class="select-options">
    `;const B=new Set;a.preferredPartners.forEach(P=>{P.player1Id&&B.add(String(P.player1Id)),P.player2Id&&B.add(String(P.player2Id))}),a.players.forEach(P=>{const O=String(P.id),oe=t(P.id,$);if(B.has(O)&&!oe)return;const I=h.id==="sel1"&&t(P.id,r)||h.id==="sel2"&&t(P.id,o);k+=`<div class="option ${oe?"selected":""} ${I?"disabled":""}" data-val="${P.id}">${P.name}</div>`}),k+="</div>",h.innerHTML=k},y=()=>{if(a.preferredPartners.length===0){g.innerHTML='<div style="text-align: center; padding: 2rem; color: #52525b;">No fixed pairs yet</div>';return}g.innerHTML=a.preferredPartners.map(h=>{const $=a.players.find(L=>t(L.id,h.player1Id)),C=a.players.find(L=>t(L.id,h.player2Id));return!$||!C?"":`
        <div class="pair-item-clean">
          <span class="pair-names">${$.name} & ${C.name}</span>
          <div class="pair-remove-icon" data-remove="${String(h.id)}">✕</div>
        </div>
      `}).join("")},b=()=>{m(p,o,"Select Player 1"),m(u,r,"Select Player 2"),y(),o&&r&&!t(o,r)?(f.classList.add("ready"),f.disabled=!1):(f.classList.remove("ready"),f.disabled=!0)};b(),e.addEventListener("click",h=>{if(h.target===e||h.target.id==="closePairsModal"){c();return}h.target.closest(".custom-select")||(e.querySelectorAll(".select-options").forEach(v=>v.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(v=>v.classList.remove("active")));const $=h.target.closest(".select-trigger");if($){const S=$.parentElement.querySelector(".select-options"),k=S.classList.contains("open");e.querySelectorAll(".select-options").forEach(B=>B.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(B=>B.classList.remove("active")),k||(S.classList.add("open"),$.classList.add("active"))}const C=h.target.closest(".option");if(C){const v=C.dataset.val,S=s(v);if(S){const k=C.closest(".custom-select").id;k==="sel1"&&(o=S.id),k==="sel2"&&(r=S.id),b(),e.querySelectorAll(".select-options").forEach(B=>B.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(B=>B.classList.remove("active"))}}if(h.target.closest("#addBtn")&&!f.disabled){if(a.preferredPartners.some(k=>t(k.player1Id,o)&&t(k.player2Id,r)||t(k.player1Id,r)&&t(k.player2Id,o))){alert("Pair already exists");return}if(a.preferredPartners.some(k=>t(k.player1Id,o)||t(k.player2Id,o)||t(k.player1Id,r)||t(k.player2Id,r))&&!confirm("One of these players is already in another pair. Create anyway?"))return;a.preferredPartners.push({id:fe(),player1Id:o,player2Id:r}),w(),o=null,r=null,b(),D()}const L=h.target.closest(".pair-remove-icon");if(L){const v=L.dataset.remove,S=n(v);S&&(Qe(S.id),b(),D())}})}document.addEventListener("click",In);function ze(e,t,s={}){const{isTeam:n=!1,showSkill:o=!1,showSide:r=!1,onRemove:l=null,onToggleSide:i=null}=s,d=typeof e=="string"?e:e.name,c=e.skill||0,p=e.side||null;let u="";r&&(u=`
      <label class="side-toggle" data-index="${t}" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.75rem; margin: 0 8px;">
        <span style="color: ${p!=="B"?"var(--accent)":"var(--text-muted)"}; font-weight: ${p!=="B"?"600":"400"};">A</span>
        <div class="toggle-track" style="width: 28px; height: 16px; background: ${p==="B"?"var(--warning)":"var(--accent)"}; border-radius: 8px; position: relative;">
          <div class="toggle-thumb" style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: ${p==="B"?"14px":"2px"}; transition: left 0.2s;"></div>
        </div>
        <span style="color: ${p==="B"?"var(--warning)":"var(--text-muted)"}; font-weight: ${p==="B"?"600":"400"};">B</span>
      </label>
    `);let f="";return o&&(f=`<span class="player-skill">${c===0?"-":c}</span>`),`
    <li class="player-item slide-in-up" data-index="${t}" style="animation-duration: 0.3s;">
      <span class="player-number">${t+1}.</span>
      <span class="player-name text-truncate" title="${d}">${d}</span>
      
      ${u}
      ${f}
      
      <button class="player-remove" data-index="${t}" title="Remove">×</button>
    </li>
  `}function _(){const e=M();if(e.playerList.innerHTML=a.players.map((t,s)=>{const n=['<option value="">Auto</option>'];for(let o=1;o<=a.courts;o++){const r=t.lockedCourt===o?"selected":"";n.push(`<option value="${o}" ${r}>Court ${o}</option>`)}return`
    <li class="player-item slide-in-up" data-id="${t.id}" style="animation-duration: 0.3s;">
      <span class="player-number">${s+1}.</span>
      <span class="player-name text-truncate" title="${t.name}">${t.name}</span>
      
      <select 
        class="court-lock-select form-select btn-sm" 
        onchange="window.updatePlayerCourtLock(${t.id}, this.value)"
        onclick="event.stopPropagation()"
        title="Lock to specific court"
      >
        ${n.join("")}
      </select>
      <button class="player-remove" data-action="remove-player" data-id="${t.id}">×</button>
    </li>
  `}).join(""),window.updatePlayerCourtLock||(window.updatePlayerCourtLock=(t,s)=>{const n=a.players.find(o=>o.id===t);n&&(n.lockedCourt=s?parseInt(s):null,w())}),e.playerCount.textContent=`(${a.players.length})`,e.generateBtn.disabled=a.players.length<4,a.players.length>=4){const t=a.players.length%4===0,s=a.courts*4,n=a.players.length>s;if(!t||n){const o=n?`exceeds capacity for ${a.courts} court${a.courts>1?"s":""}`:`uneven number for ${a.courts} court${a.courts>1?"s":""}`;e.playersHint.textContent=`${a.players.length} players ready! Since it ${o}, a queue system will be applied.`,e.playersHint.style.color="var(--warning)"}else e.playersHint.textContent=`${a.players.length} players ready`,e.playersHint.style.color="var(--success)"}else e.playersHint.textContent=`Add at least ${4-a.players.length} more player${4-a.players.length>1?"s":""}`,e.playersHint.style.color="";ee(),St(),Mn(),wt(),ae(),D()}function Ze(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${a.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function Mn(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");if(!e)return;a.players.length<6?(e.style.display="none",t&&t.classList.add("expanded")):(e.style.display="block",t!=null&&t.classList.contains("expanded")||(e.innerHTML=`Show All Players (${a.players.length}) ▼`))}function et(){const e=M();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function ne(){const e=M();e.importModal.style.display="none"}const Tn=Object.freeze(Object.defineProperty({__proto__:null,hideImportModal:ne,renderPlayers:_,showImportModal:et,togglePlayerList:Ze},Symbol.toStringTag,{value:"Module"}));let je=!1;function Pe(){const e=M(),t=a.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(n=>{n.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(n=>{n.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function Me(){var n;const e=((n=document.getElementById("scoringMode"))==null?void 0:n.value)||a.scoringMode,t=document.getElementById("scoringValueLabel"),s=document.getElementById("points");!t||!s||(e==="total"?(t.textContent="Points",s.value=24):e==="race"?(t.textContent="Target",s.value=21):e==="time"&&(t.textContent="Minutes",s.value=12))}function An(){const e=M();e.gridColumns&&(e.gridColumns.max=6)}function Rn(){const e=document.querySelector(".matches-grid");if(!e)return a.maxCourts||2;const t=e.offsetWidth,n=Math.floor(t/180),o=a.maxCourts||a.courts||2;return Math.min(Math.max(n,1),o)}function Mt(){const e=M();if(je||a.gridColumns!==0)return;const t=Rn();document.querySelectorAll(".matches-grid").forEach(n=>{n.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function Nn(){const e=M(),t=parseInt(e.gridColumns.value);t===0?(je=!1,Mt()):je=!0,a.gridColumns=t,Pe(),w()}function Tt(){const e=M(),t=a.textSize,s=t/100,n=document.getElementById("scheduleSection");n&&n.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function zn(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(a.roundScale=parseInt(e.value)/100,w());const s=a.roundScale||1,n=document.getElementById("roundsContainer");n&&n.style.setProperty("--card-scale",s),e&&(e.value=Math.round(s*100)),t&&(t.textContent=`${Math.round(s*100)}%`)}function At(){return[...a.leaderboard].sort((e,t)=>{switch(a.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const s=e.played>0?e.wins/e.played:0,n=t.played>0?t.wins/t.played:0;return Math.abs(n-s)>.001?n-s:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const o=e.points+e.pointsLost,r=t.points+t.pointsLost,l=o>0?e.points/o:0,i=r>0?t.points/r:0;return Math.abs(i-l)>.001?i-l:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function V(){const e=M(),t=document.getElementById("toggleVisibilityBtn");t&&(a.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const s=document.getElementById("togglePositionBtn");if(s&&(a.showPositionChanges?(s.innerHTML="Ranks",s.classList.add("toggle-on"),s.classList.remove("toggle-off")):(s.innerHTML="Ranks",s.classList.add("toggle-off"),s.classList.remove("toggle-on")),s.title="Click to toggle rank change indicators"),!a.leaderboard||a.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const n=!a.hideLeaderboard,o=a.showPositionChanges,r=!n&&!o,l=At();l.forEach((d,c)=>{const p=c+1,u=d.previousRank||p;d.rankChange=u-p});let i=r?[...l].sort(()=>Math.random()-.5):l;e.leaderboardBody.innerHTML=i.map((d,c)=>{const p=l.findIndex(v=>v.id===d.id)+1,u=r?"-":p;let f="";o&&d.played>0&&!r&&(d.rankChange>0?f='<span class="rank-up">▲</span>':d.rankChange<0?f='<span class="rank-down">▼</span>':f='<span class="rank-same">-</span>');const g=d.points-(d.pointsLost||0),m=d.played>0?Math.round((d.wins||0)/d.played*100)+"%":"0%",y=g>0?"+":"",b=n?d.points:"-",h=n?d.wins||0:"-",$=n?`<span class="${g>0?"text-success":g<0?"text-error":""}">${y}${g}</span>`:"-",C=n?m:"-",L=n||o?d.played:"-";return`
    <tr>
      <td>${u} ${f}</td>
      <td class="player-name-cell">${d.name}</td>
      <td class="font-bold">${b}</td>
      <td>${h}</td>
      <td>${$}</td>
      <td>${C}</td>
      <td>${L}</td>
    </tr>
  `}).join("")}function Rt(){a.hideLeaderboard=!a.hideLeaderboard,V()}function Nt(){a.showPositionChanges=!a.showPositionChanges,V()}function zt(e){a.rankingCriteria=e,V()}function Hn(){const e=[...a.players],t=e.length,s=a.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const n=e.length,o=[],r=e[0],l=e.slice(1);for(let i=0;i<n-1;i++){const d=[r,...l],c=[];for(let y=0;y<n/2;y++){const b=d[y],h=d[n-1-y];!b.isBye&&!h.isBye&&c.push([b,h])}const p=[],u=new Set;for(let y=0;y<c.length-1;y+=2)c[y]&&c[y+1]&&(p.push({court:Math.floor(y/2)+1,team1:c[y],team2:c[y+1]}),c[y].forEach(b=>u.add(b.id)),c[y+1].forEach(b=>u.add(b.id)));const f=p.slice(0,s),g=new Set;f.forEach(y=>{y.team1.forEach(b=>g.add(b.id)),y.team2.forEach(b=>g.add(b.id))});const m=a.players.filter(y=>!y.isBye&&!g.has(y.id));f.length>0&&o.push({number:o.length+1,matches:f,byes:m}),l.unshift(l.pop())}return o}function qn(){const e=[...a.players],t=e.length,s=a.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const n=e.length,o=[],r=e[0],l=e.slice(1);for(let i=0;i<n-1;i++){const d=[r,...l],c=[],p=new Set;for(let m=0;m<n/2;m++){const y=d[m],b=d[n-1-m];!y.isBye&&!b.isBye&&(c.push({court:c.length+1,team1:[y],team2:[b]}),p.add(y.id),p.add(b.id))}const u=c.slice(0,s),f=new Set;u.forEach(m=>{m.team1.forEach(y=>f.add(y.id)),m.team2.forEach(y=>f.add(y.id))});const g=a.players.filter(m=>!m.isBye&&!f.has(m.id));u.length>0&&o.push({number:o.length+1,matches:u,byes:g}),l.unshift(l.pop())}return o}function Fn(){const e=[...a.players];Se(e);const t=a.courts,s=[],n=new Set;for(let r=0;r<e.length-1&&s.length<t;r+=2)s.push({court:s.length+1,team1:[e[r]],team2:[e[r+1]]}),n.add(e[r].id),n.add(e[r+1].id);const o=e.filter(r=>!n.has(r.id));return[{number:1,matches:s,byes:o}]}function Dn(){const e=[...a.leaderboard].sort((i,d)=>d.points-i.points),t=a.courts,s=e.filter(i=>!a.manualByes.includes(i.id)),n=e.filter(i=>a.manualByes.includes(i.id)),o=[],r=new Set;for(let i=0;i<s.length-1&&o.length<t;i+=2)o.push({court:o.length+1,team1:[s[i]],team2:[s[i+1]]}),r.add(s[i].id),r.add(s[i+1].id);const l=[...n,...s.filter(i=>!r.has(i.id))];return{number:a.schedule.length+1,matches:o,byes:l}}function On(){const e=a.courts,t=e*4,s=[],n=new Set,o=[...a.players],r=[];o.forEach(m=>{if(n.has(m.id))return;const y=Ht(m.id);if(y){const b=o.find(h=>h.id===y);b?(s.push({type:"pair",players:[m,b]}),n.add(b.id)):s.push({type:"single",players:[m]})}else s.push({type:"single",players:[m]});n.add(m.id)}),Se(s);const l=[];let i=0;for(const m of s)i+m.players.length<=t?(l.push(m),i+=m.players.length):r.push(...m.players);const d=[],c=[];l.forEach(m=>{m.type==="pair"?d.push(m.players):c.push(m.players[0])}),Se(c);for(let m=0;m<c.length-1;m+=2)d.push([c[m],c[m+1]]);Se(d);const p=[],u=new Set,f=[],g=[];for(let m=0;m<d.length-1;m+=2){const y=d[m],b=d[m+1],h=[...y,...b].find($=>$.lockedCourt);h?f.push({team1:y,team2:b,lockedCourt:h.lockedCourt}):g.push({team1:y,team2:b})}return f.forEach(m=>{if(p.length>=e)return;let y=m.lockedCourt;(u.has(y)||y>e)&&(y=null),y?(u.add(y),p.push({court:y,team1:m.team1,team2:m.team2})):g.push({team1:m.team1,team2:m.team2})}),g.forEach(m=>{if(p.length>=e)return;let y=1;for(;u.has(y);)y++;y<=e&&(u.add(y),p.push({court:y,team1:m.team1,team2:m.team2}))}),p.sort((m,y)=>m.court-y.court),d.length%2!==0&&p.length<d.length/2&&r.push(...d[d.length-1]),[{number:1,matches:p,byes:r}]}function Ht(e){if(!a.preferredPartners)return null;const t=a.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function jn(e){const t=a.courts,s=t*4,n=new Set(a.manualByes),o=[],r=new Set,l=[...e];l.forEach(v=>{if(r.has(v.id)||n.has(v.id))return;const S=Ht(v.id);if(S){const k=l.find(B=>B.id===S);k?n.has(k.id)?o.push({type:"single",players:[v]}):(o.push({type:"pair",players:[v,k]}),r.add(k.id)):o.push({type:"single",players:[v]})}else o.push({type:"single",players:[v]});r.add(v.id)}),o.sort((v,S)=>{const k=O=>{const oe=O.players.reduce((G,I)=>G+(I.byeCount||0),0),ue=O.players.reduce((G,I)=>G+(I.played||0),0);return{bye:oe/O.players.length,play:ue/O.players.length}},B=k(v),P=k(S);return Math.abs(P.bye-B.bye)>.1?P.bye-B.bye:B.play-P.play});const i=[],d=[];let c=0;for(const v of o)c+v.players.length<=s&&(d.push(v),i.push(...v.players),c+=v.players.length);const p=new Set(i.map(v=>v.id)),u=l.filter(v=>!p.has(v.id)),f=[],g=[];d.forEach(v=>{v.type==="pair"?f.push(v.players):g.push(v.players[0])}),g.sort((v,S)=>S.points-v.points);let m=0;for(;m<g.length-3;m+=4){const v=g[m],S=g[m+1],k=g[m+2],B=g[m+3],P=[{name:"oneThree",team1:[v,k],team2:[S,B]},{name:"oneTwo",team1:[v,S],team2:[k,B]},{name:"oneFour",team1:[v,B],team2:[S,k]}];let O;const oe=a.pairingStrategy!=="optimal"&&a.strictStrategy;a.strictStrategy;const ue=a.maxRepeats!==void 0?a.maxRepeats:99,G=P.map(I=>{const F=I.team1[0].id,U=I.team1[1].id,z=I.team2[0].id,j=I.team2[1].id,it=(sn,an)=>{const ge=e.find(Re=>Re.id===sn);return ge!=null&&ge.playedWith?ge.playedWith.filter(Re=>Re===an).length:0},lt=it(F,U)+it(z,j),Kt=I.team1[0].points+I.team1[1].points,Qt=I.team2[0].points+I.team2[1].points,Zt=Math.abs(Kt-Qt),en=ue<99&&lt>ue,tn=I.name===a.pairingStrategy,nn=F*1e6+U*1e4+z*100+j;return{...I,repeatPenalty:lt,violatesRepeats:en,isPreferred:tn,rankingImbalance:Zt,tieBreaker:nn}});if(G.sort((I,F)=>I.tieBreaker-F.tieBreaker),a.pairingStrategy==="optimal")O={...[...G].sort((F,U)=>F.repeatPenalty!==U.repeatPenalty?F.repeatPenalty-U.repeatPenalty:F.rankingImbalance!==U.rankingImbalance?F.rankingImbalance-U.rankingImbalance:F.tieBreaker-U.tieBreaker)[0],relaxedConstraint:null};else{const I=G.find(F=>F.isPreferred)||G[0];if(!I.violatesRepeats)O={...I,relaxedConstraint:null};else if(oe)O={...I,relaxedConstraint:"repeats"};else{const F=G.filter(U=>!U.violatesRepeats);F.length>0?O={...[...F].sort((z,j)=>z.isPreferred!==j.isPreferred?z.isPreferred?-1:1:z.rankingImbalance!==j.rankingImbalance?z.rankingImbalance-j.rankingImbalance:z.tieBreaker-j.tieBreaker)[0],relaxedConstraint:"pattern"}:O={...[...G].sort((z,j)=>z.repeatPenalty!==j.repeatPenalty?z.repeatPenalty-j.repeatPenalty:z.isPreferred!==j.isPreferred?z.isPreferred?-1:1:z.rankingImbalance!==j.rankingImbalance?z.rankingImbalance-j.rankingImbalance:z.tieBreaker-j.tieBreaker)[0],relaxedConstraint:"tier3"}}}f.push(O.team1),f.push(O.team2)}m<g.length-1&&f.push([g[m],g[m+1]]);const y=f.map(v=>({players:v,points:v.reduce((S,k)=>S+k.points,0)}));y.sort((v,S)=>S.points-v.points);const b=[],h=new Set,$=new Set,C=[],L=[];for(let v=0;v<y.length-1;v+=2){const S=y[v],k=y[v+1],B=[...S.players,...k.players].find(P=>P.lockedCourt);B?C.push({t1:S,t2:k,lockedCourt:B.lockedCourt}):L.push({t1:S,t2:k})}return C.forEach(v=>{if(b.length>=t)return;let S=v.lockedCourt;($.has(S)||S>t)&&(S=null),S?($.add(S),b.push({court:S,team1:v.t1.players,team2:v.t2.players}),v.t1.players.forEach(k=>h.add(k.id)),v.t2.players.forEach(k=>h.add(k.id))):L.push({t1:v.t1,t2:v.t2})}),L.forEach(v=>{if(b.length>=t)return;let S=1;for(;$.has(S);)S++;S<=t&&($.add(S),b.push({court:S,team1:v.t1.players,team2:v.t2.players}),v.t1.players.forEach(k=>h.add(k.id)),v.t2.players.forEach(k=>h.add(k.id)))}),b.sort((v,S)=>v.court-S.court),y.forEach(v=>{v.players.some(S=>h.has(S.id))||v.players.forEach(S=>u.push(S))}),{number:a.schedule.length+1,matches:b,byes:u}}function re(e,t,s,n,o,r=null){const l=a.leaderboard.find(i=>i.id===e);l&&(l.points+=t,l.played+=1,l.pointsLost=(l.pointsLost||0)+s,n?l.wins=(l.wins||0)+1:o||(l.losses=(l.losses||0)+1),r&&!l.playedWith&&(l.playedWith=[]),r&&l.playedWith.push(r))}function ie(e,t,s,n,o){const r=a.leaderboard.find(l=>l.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-s,n?r.wins=(r.wins||0)-1:o||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let _e=null;function qt(e){_e=e}let We=null;function Ft(e){We=e}function R(){const e=M(),t=a.format,s=t==="team"||t==="teamMexicano",n={americano:{title:"Americano Setup",description:"Add players and configure your tournament settings."},mexicano:{title:"Mexicano Setup",description:"Dynamic schedule that adjusts pairings based on leaderboard."},team:{title:"Team Americano Setup",description:"Play with fixed teams."},teamMexicano:{title:"Team Mexicano Setup",description:"Dynamic schedule for fixed teams."}},o=n[a.format]||n.americano,r=document.querySelector(".page-title"),l=document.querySelector(".page-subtitle");r&&(r.textContent=o.title),l&&(l.textContent=o.description);const i=document.getElementById("playersHeader");i&&i.firstChild&&(i.firstChild.textContent=s?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const d=document.getElementById("advancedSettingsContent");d&&(d.querySelectorAll("input, select, button").forEach(h=>{if(h.disabled=!1,h.classList.remove("locked"),h.tagName==="SELECT"){const $=h.closest(".custom-select-wrapper");if($){const C=$.querySelector(".custom-select");C&&C.classList.remove("disabled")}}}),St());const c=document.getElementById("runningBadge");a.isLocked?(e.generateBtn&&(e.generateBtn.style.display="none"),c&&(c.style.display="inline-flex")):(e.generateBtn&&(e.generateBtn.style.display="block",e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=!1),c&&(c.style.display="none"));const p=String(t).trim(),g=p.toLowerCase()==="mexicano"||p==="teamMexicano",m=e.advancedSettingsContent;m&&(g?(m.classList.remove("collapsed"),m.classList.add("expanded")):(m.classList.remove("expanded"),m.classList.add("collapsed")));const y=document.getElementById("strictStrategy");y&&(y.disabled=!1),We&&We()}function _n(){var d,c;const e=document.getElementById("summaryList"),t=document.getElementById("tournamentSummary");if(!e||!t)return;if(a.isLocked){t.style.display="none";return}t.style.display="block";const s={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},n=a.format==="team"||a.format==="teamMexicano",o=a.format==="mexicano"||a.format==="teamMexicano",r=((d=a.players)==null?void 0:d.length)||0,l=n?"teams":"players",i=[{label:"Format",value:s[a.format]||a.format},{label:n?"Teams":"Players",value:r>0?`${r} ${l}`:"None added"},{label:"Courts",value:a.courts||2},{label:"Scoring",value:a.scoringMode==="time"?`${a.pointsPerMatch} minutes`:a.scoringMode==="race"?`First to ${a.pointsPerMatch}`:`${a.pointsPerMatch} total points`}];if(o){const p=a.maxRepeats===99?"Unlimited":a.maxRepeats===0?"No repeats":`Max ${a.maxRepeats}x`;i.push({label:"Repeats",value:p});const u={oneThree:"1&3 vs 2&4",oneTwo:"1&2 vs 3&4",oneFour:"1&4 vs 2&3",optimal:"Optimal"};if(i.push({label:"Pairing",value:u[a.pairingStrategy]||a.pairingStrategy}),((c=a.preferredPartners)==null?void 0:c.length)>0){const f=a.preferredPartners.map(g=>{const m=a.players.find(b=>b.id===g.player1Id),y=a.players.find(b=>b.id===g.player2Id);return m&&y?`${m.name} & ${y.name}`:null}).filter(Boolean);f.length>0&&i.push({label:"Fixed Pairs",value:f,isChips:!0})}}e.innerHTML=i.map(p=>p.isChips?`
          <li class="summary-item summary-item-chips">
            <span class="summary-label">${p.label}:</span>
            <div class="summary-chips">
              ${p.value.map(u=>`<span class="summary-chip">${u}</span>`).join("")}
            </div>
          </li>
        `:`
        <li class="summary-item">
          <span class="summary-label">${p.label}:</span>
          <span class="summary-value">${p.value}</span>
        </li>
      `).join("")}function Dt(){const e=M(),t=e.format.value,s=t==="team"||t==="teamMexicano",n=s?2:4;if(a.players.length<n){x(`Not enough ${s?"teams":"players"} (min ${n})`,"error");return}a.format=e.format.value,a.courts=parseInt(e.courts.value),a.scoringMode=e.scoringMode.value,a.pointsPerMatch=parseInt(e.points.value),a.currentRound=1;const o=a.format==="team"||a.format==="teamMexicano"?2:4,r=Math.floor(a.players.length/o),l=()=>{Ee(),a.leaderboard=a.players.map(d=>({...d,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),a.format==="americano"?(a.allRounds=Hn(),a.schedule=[a.allRounds[0]]):a.format==="team"?(a.allRounds=qn(),a.schedule=[a.allRounds[0]]):a.format==="teamMexicano"?(a.schedule=Fn(),a.allRounds=null):(a.schedule=On(),a.allRounds=null),e.leaderboardSection.style.display="block",V(),_e&&_e(),e.scheduleSection.style.display="block";const i=document.getElementById("tournamentActionsSection");i&&(i.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const d=document.getElementById("round-0");d&&(d.classList.add("animate-in","highlight"),setTimeout(()=>{d.classList.remove("animate-in","highlight")},1600))},100),a.isLocked=!0,R(),w(),x("🎾 Tournament started! Round 1 ready")};if(a.courts>r){if(r===0){De("Not Enough Players",`You need at least ${o} players/teams to start!`);return}const i=a.courts;a.courts=r,e.courts&&(e.courts.value=a.courts),x(`Adjusted courts: ${i} → ${r}`)}Sn().then(()=>{l()})}function Ot(){const e=M();N("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{Ee(),a.schedule=[],a.currentRound=0,a.leaderboard=[],a.allRounds=null,a.isLocked=!1,a.hideLeaderboard=!1,a.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",R(),w(),x("Tournament reset")},!0)}function tt(e){N("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{a.isLocked=!1,a.hideLeaderboard=!1,R();const t=[...a.leaderboard].sort((s,n)=>n.points-s.points);Gn(),Ae(),x("Tournament saved to history"),e&&e(t),V(),w()},!0)}function nt(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function st(e=null){const t=e||a,s=new Date().toLocaleDateString(),n=new Date().toLocaleTimeString();let o="data:text/csv;charset=utf-8,";o+=`Tournament Results
`,o+=`Date,${s} ${n}
`,o+=`Format,${t.format}
`,o+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,o+=`Final Standings
`,o+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((d,c)=>c.points-d.points).forEach((d,c)=>{const p=(d.points||0)-(d.pointsLost||0);o+=`${c+1},"${d.name}",${d.points},${d.wins},${d.played},${d.pointsLost||0},${p}
`}),o+=`
`,o+=`Match History
`,o+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(d=>{d.completed&&d.matches.forEach(c=>{const p=c.team1.map(g=>g.name).join(" & "),u=c.team2.map(g=>g.name).join(" & ");let f=`Court ${c.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[c.court-1]?f=t.customCourtNames[c.court-1]:t.courtFormat==="number"&&(f=`${c.court}`),o+=`Round ${d.number},"${f}","${p}",${c.score1},${c.score2},"${u}"
`})});const l=encodeURI(o),i=document.createElement("a");i.setAttribute("href",l),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function at(e=null){var r;const t=e||a;let n=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;n+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,n+=`Format: ${t.format}

`,n+=`Top Standings:
`,[...t.leaderboard].sort((l,i)=>i.points-l.points).slice(0,5).forEach((l,i)=>{n+=`${i+1}. ${l.name}: ${l.points} pts (${l.wins}W)
`}),n+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(n),x("Results copied to clipboard")}catch(l){console.error("Failed to copy: ",l),x("Failed to copy results","error")}}const Wn=Object.freeze(Object.defineProperty({__proto__:null,endTournament:tt,exportTournamentData:st,generateSchedule:Dt,renderTournamentSummary:_n,resetSchedule:Ot,setRenderScheduleCallback:qt,setRenderTournamentConfigCallback:Ft,shareResults:at,toggleToolbar:nt,updateSetupUI:R},Symbol.toStringTag,{value:"Module"}));class Un{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),n=t%60;return`${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const n=this.audioContext.createOscillator(),o=this.audioContext.createGain();n.type="sine",n.frequency.value=t,n.connect(o),o.connect(this.audioContext.destination),n.start(),o.gain.setValueAtTime(.1,this.audioContext.currentTime),o.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),n.stop(this.audioContext.currentTime+s)}catch(n){console.warn("Audio play failed",n)}}}let H=null;function Vn(){const e=M();if(e.matchTimerContainer){if(a.scoringMode!=="time"){e.matchTimerContainer.style.display="none",H&&(H.pause(),H=null);return}if(e.matchTimerContainer.style.display="flex",H)H.duration!==a.pointsPerMatch&&H.setDuration(a.pointsPerMatch);else{H=new Un({duration:a.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed"),e.runningBadge&&(e.runningBadge.style.display="inline-flex",e.runningBadge.classList.add("running"))):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),e.runningBadge&&(e.runningBadge.style.display="none",e.runningBadge.classList.remove("running")),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=H.formatTime(a.pointsPerMatch*60),e.timerStartBtn.onclick=()=>H.start(),e.timerPauseBtn.onclick=()=>H.pause(),e.timerResetBtn.onclick=()=>H.reset(),e.timerAddBtn.onclick=()=>H.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>H.addTime(-60));const t=()=>{const s=()=>{Ie("Set Timer Duration","Enter minutes (e.g. 12)",n=>{const o=parseInt(n);o>0?(a.pointsPerMatch=o,w(),H.setDuration(o),x(`Timer set to ${o} minutes`)):x("Invalid minutes","error")})};H.isRunning?N("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{H.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function W(){const e=M();Vn(),se();const t=a.schedule.length-1;e.roundsContainer.innerHTML=a.schedule.map((r,l)=>{const i=l===t,d=r.completed,c=d&&!i,p=d?r.matches.map(u=>`${u.score1}-${u.score2}`).join(" · "):"";return`
    <div class="round ${d?"completed":"ongoing"} ${c?"collapsed":""}" 
         id="round-${l}" 
         data-round="${l}">
      <div class="round-header" data-action="toggle-round" data-round="${l}">
        <span class="round-title">
          Round ${r.number}
          ${d?'<span class="round-status completed">✓ Completed</span>':'<span class="round-status ongoing">● Ongoing</span>'}
        </span>
        ${d?`<span class="round-summary" style="${c?"":"display: none"}">${p}</span>`:""}
        ${d?`<span class="collapse-icon">${c?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${r.matches.map((u,f)=>`
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${qe(u.court)}</span>
                <span class="match-info-sub">
                  ${a.scoringMode==="total"?`Total ${a.pointsPerMatch}`:a.scoringMode==="race"?`Race to ${a.pointsPerMatch}`:`${a.pointsPerMatch} mins`}
                </span>
                ${u.relaxedConstraint?`<span class="constraint-badge" title="${u.relaxedConstraint==="repeats"?"Repeat allowed (Priority: Pattern)":u.relaxedConstraint==="pattern"?"Pattern override (Priority: Repeats)":"Constraint relaxed (Best effort)"}">i</span>`:""}
              </div>
              <div class="match-card">
                <div class="match-teams">
                  <div class="team">
                    <span>${u.team1[0].name}</span>
                    ${u.team1[1]?`<span>${u.team1[1].name}</span>`:""}
                  </div>
                  <div class="team">
                    <span>${u.team2[0].name}</span>
                    ${u.team2[1]?`<span>${u.team2[1].name}</span>`:""}
                  </div>
                </div>
              </div>
              <div class="match-card-footer">
                ${d?`
                <div class="score-input-row">
                  <span class="score-display">${u.score1} - ${u.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${l}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${l}-${f}-1" 
                         min="0" max="${a.scoringMode==="total"?a.pointsPerMatch:999}" placeholder="0" 
                         value="${u.score1||""}"
                         data-action="autofill-score" data-round="${l}" data-match="${f}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${l}-${f}-2" 
                         min="0" max="${a.scoringMode==="total"?a.pointsPerMatch:999}" placeholder="0"
                         value="${u.score2||""}"
                         data-action="autofill-score" data-round="${l}" data-match="${f}" data-team="2">
                </div>
                `}
              </div>
            </div>
          `).join("")}
        </div>
        ${r.byes&&r.byes.length>0?`
        <div class="waiting-players">
          <span class="waiting-label">Resting:</span>
          <span class="waiting-names">${r.byes.map(u=>u.name).join(", ")}</span>
        </div>
        `:""}
        ${!d&&i?`
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${a.manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${a.leaderboard.map(u=>`
              <button class="bye-chip ${a.manualByes.includes(u.id)?"selected":""}" 
                      data-action="toggle-bye" data-id="${u.id}">
                ${u.name}
                <span class="bye-count">(${u.byeCount||0})</span>
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
  `}).join(""),An(),Pe(),Tt(),jt();const s=a.schedule.findIndex(r=>!r.completed),n=s>=0?s:0,o=document.getElementById(`round-${n}`);o&&setTimeout(()=>{o.scrollIntoView({behavior:"smooth",block:"start"})},100)}function se(){const e=document.getElementById("gameDetails");if(!e)return;const t={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},s={total:"Total Points",race:"Race to Points",time:"Time Based"},n=[{label:t[a.format]||"Tournament"},{label:`${a.courts} Courts`},{label:s[a.scoringMode]},{label:a.scoringMode==="time"?`${a.pointsPerMatch} Mins`:`${a.pointsPerMatch} Pts`}];e.innerHTML=n.map(o=>`
    <div class="game-detail-item">
      <span class="detail-label">${o.label}</span>
    </div>
  `).join("")}qt(W);function Ue(e,t,s,n){setTimeout(jt,0);let o=parseInt(n);if(isNaN(o)||o<0)return;const r=parseInt(a.pointsPerMatch);if(!(isNaN(r)||r<=0)){if(a.scoringMode==="total"){if(o>r){o=r;const c=document.getElementById(`score-${e}-${t}-${s}`);c&&(c.value=o)}const l=s===1||s==="1"?2:1,i=r-o,d=document.getElementById(`score-${e}-${t}-${l}`);d&&i>=0&&(d.value=i)}else if(a.scoringMode==="race"){if(o<r){const l=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${l}`);i&&(i.value=r)}else if(o===r){const l=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${l}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function jt(){const e=a.schedule.findIndex(r=>!r.completed);if(e===-1)return;const t=a.schedule[e],s=document.querySelector(".complete-round-btn");if(!s)return;let n=!0;const o=parseInt(a.pointsPerMatch);for(let r=0;r<t.matches.length;r++){const l=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`);if(!l||!i)continue;const d=l.value,c=i.value;if(d===""||c===""){n=!1;break}const p=parseInt(d),u=parseInt(c);if(a.scoringMode==="total"){if(p+u!==o){n=!1;break}}else if(p<0||u<0){n=!1;break}}s.disabled=!1,n?(s.classList.remove("btn-warning"),s.classList.add("btn-success"),s.textContent=`Complete Round ${t.number}`):(s.classList.add("btn-warning"),s.classList.remove("btn-success"),s.textContent="Complete Anyway")}function _t(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const n=t.querySelector(".collapse-icon");n&&(n.textContent="▼");const o=t.querySelector(".round-summary");o&&(o.style.display="none")}else{t.classList.add("collapsed");const n=t.querySelector(".collapse-icon");n&&(n.textContent="▶");const o=t.querySelector(".round-summary");o&&(o.style.display="")}}function Wt(e){const t=a.manualByes.indexOf(e);if(t!==-1){a.manualByes.splice(t,1),W();return}const s=a.courts*4,n=a.leaderboard.length,o=Math.max(0,n-s);if(o===0){x(`All ${n} players needed for ${a.courts} courts.`);return}if(a.manualByes.length>=o){x(`Max ${o} can rest. Deselect someone first.`);return}a.manualByes.push(e),W()}function Ut(){const e=a.schedule.length-1,t=a.schedule[e];let s=!0;const n=[];if(t.matches.forEach((o,r)=>{const l=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`),d=l==null?void 0:l.value,c=i==null?void 0:i.value;let p=!0;(d===""||c==="")&&(p=!1,d===""&&(l==null||l.classList.add("error")),c===""&&(i==null||i.classList.add("error")));const u=parseInt(d)||0,f=parseInt(c)||0;if(a.scoringMode==="total"){const g=parseInt(a.pointsPerMatch,10);u+f!==g?(p=!1,l==null||l.classList.add("error"),i==null||i.classList.add("error")):d!==""&&c!==""&&(l==null||l.classList.remove("error"),i==null||i.classList.remove("error"))}else u<0||f<0?(p=!1,l==null||l.classList.add("error"),i==null||i.classList.add("error")):d!==""&&c!==""&&(l==null||l.classList.remove("error"),i==null||i.classList.remove("error"));p||(s=!1,n.push(qe(o.court)))}),!s){let o="Some matches have missing or invalid scores.";n.length>0&&(o=`
        <p style="margin-bottom: var(--space-md);">The following matches need scores:</p>
        <ul style="text-align: left; margin: 0 0 var(--space-md) var(--space-lg); list-style: disc;">
          ${n.map(l=>`<li>${l}</li>`).join("")}
        </ul>
        <p>Do you want to complete the round anyway?</p>
      `),N("Incomplete/Invalid Scores",o,"Yes, Complete Anyway",()=>{He(t)},!0);return}if(a.scoringMode==="race"){const o=[],r=a.pointsPerMatch;if(t.matches.forEach((l,i)=>{const d=document.getElementById(`score-${e}-${i}-1`),c=document.getElementById(`score-${e}-${i}-2`),p=parseInt(d==null?void 0:d.value)||0,u=parseInt(c==null?void 0:c.value)||0;p<r&&u<r&&o.push(qe(l.court))}),o.length>0){const l=o.join(", ");N("Low Scores Detected",`On ${l}, neither team reached the target of ${r}. Is this correct?`,"Yes, Complete Round",()=>{He(t)},!0);return}}He(t)}function He(e){const t=a.schedule.findIndex(i=>i===e);At().forEach((i,d)=>{const c=a.leaderboard.find(p=>p.id===i.id);c&&(c.previousRank=d+1)}),e.matches.forEach((i,d)=>{const c=document.getElementById(`score-${t}-${d}-1`),p=document.getElementById(`score-${t}-${d}-2`),u=parseInt(c==null?void 0:c.value)||0,f=parseInt(p==null?void 0:p.value)||0;i.score1=u,i.score2=f;const g=u===f,m=u>f,y=f>u;i.team1[1]?(re(i.team1[0].id,u,f,m,g,i.team1[1].id),re(i.team1[1].id,u,f,m,g,i.team1[0].id),re(i.team2[0].id,f,u,y,g,i.team2[1].id),re(i.team2[1].id,f,u,y,g,i.team2[0].id)):(re(i.team1[0].id,u,f,m,g,null),re(i.team2[0].id,f,u,y,g,null))});const n=document.querySelector(".complete-round-btn");if(n&&(n.classList.add("completing"),n.textContent="✓ Completing..."),Ee(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const d=a.leaderboard.find(c=>c.id===i.id);d&&(d.byeCount=(d.byeCount||0)+1)}),a.manualByes=[],a.currentRound++,a.format==="americano"&&a.allRounds&&a.currentRound<=a.allRounds.length){const i={...a.allRounds[a.currentRound-1]};a.schedule.push(i)}else if(a.format==="team"&&a.allRounds&&a.currentRound<=a.allRounds.length){const i={...a.allRounds[a.currentRound-1]};a.schedule.push(i)}else if(a.format==="teamMexicano"){if(a.currentRound<=20){const i=Dn();i.matches.length>0&&a.schedule.push(i)}}else if(a.format==="mexicano"&&a.currentRound<=20){const i=jn(a.leaderboard);i.matches.length>0&&a.schedule.push(i)}V(),W(),w();const o=document.getElementById(`round-${t}`);o&&(o.classList.add("complete-flash"),setTimeout(()=>o.classList.remove("complete-flash"),1e3));const r=e.number,l=a.schedule.length>t+1;x(l?`✓ Round ${r} complete! Round ${r+1} ready`:`✓ Round ${r} complete!`),setTimeout(()=>{const i=a.schedule.length-1,d=document.getElementById(`round-${i}`);d&&(d.classList.add("animate-in","highlight"),d.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{d.classList.remove("animate-in","highlight")},1600))},100)}function Vt(e){const t=a.schedule[e];if(!(!t||!t.completed||a.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${a.schedule.length-e-1} subsequent round(s). Continue?`))){Ee();for(let n=e;n<a.schedule.length;n++){const o=a.schedule[n];o.completed&&o.matches.forEach(r=>{r.team1[1]?(ie(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ie(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ie(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),ie(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(ie(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ie(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}a.schedule=a.schedule.slice(0,e+1),t.completed=!1,a.currentRound=e,V(),W(),w(),x(`Editing Round ${e+1}`)}}const ot="padel_history_v1";function Gn(){var n;const e=ce(),t=pn(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),name:t.tournamentName||"",notes:t.tournamentNotes||"",format:t.format,winner:((n=t.leaderboard[0])==null?void 0:n.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(ot,JSON.stringify(e)),s}function ce(){try{const e=localStorage.getItem(ot);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function Yn(e){N("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=ce().filter(n=>n.id!==e);localStorage.setItem(ot,JSON.stringify(s)),Ae(),x("Tournament deleted")},!0)}function Jn(e){const s=ce().find(n=>n.id===e);if(!s){x("Tournament details not found","error");return}N("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{Je(s.data),W(),V(),w(),x("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(n){console.error("Failed to load tournament",n),x("Error loading tournament","error")}},!1)}let Be=[];function Te(){Ae();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Xn(s)})}function Xn(e){if(!e){Ve(Be);return}const t=Be.filter(s=>{var p,u,f,g,m,y,b,h;const n=(((p=s.summary)==null?void 0:p.winner)||((f=(u=s.players)==null?void 0:u[0])==null?void 0:f.name)||"").toLowerCase(),o=(((g=s.summary)==null?void 0:g.format)||s.format||"").toLowerCase(),r=((m=s.summary)==null?void 0:m.date)||s.date||"",l=String(((y=s.summary)==null?void 0:y.playerCount)||((b=s.players)==null?void 0:b.length)||""),i=String(((h=s.summary)==null?void 0:h.roundCount)||""),c=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return n.includes(e)||o.includes(e)||c.includes(e)||l.includes(e)||i.includes(e)});Ve(t)}function Ae(){Be=ce(),Ve(Be)}const rt=Ae;function Ve(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn btn-primary">
        Start a Tournament
      </button>
    `,s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=Yn,window.loadTournament=Jn,window.downloadHistoryItem=Kn,t.innerHTML=e.map(n=>{var m,y,b,h,$,C,L,v;const o=n.summary?n.summary.date:n.date,r=n.summary?n.summary.format:n.format||"Unknown",l=r.charAt(0).toUpperCase()+r.slice(1);let i="Unknown";((y=(m=n.data)==null?void 0:m.leaderboard)==null?void 0:y.length)>0?i=((b=[...n.data.leaderboard].sort((k,B)=>B.points-k.points)[0])==null?void 0:b.name)||"Unknown":(h=n.summary)!=null&&h.winner&&(i=n.summary.winner);const d=n.summary?n.summary.playerCount:(($=n.players)==null?void 0:$.length)||0,c=((C=n.summary)==null?void 0:C.roundCount)||((v=(L=n.data)==null?void 0:L.schedule)==null?void 0:v.length)||0,p=new Date(o),u=p.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),f=p.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),g=!!n.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${u}</span>
            <span class="date-sub">${f}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-sm badge-outline">${l}</span>
        </td>
        <td>
          <div class="winner-cell">
            <span class="trophy-icon">🏆</span>
            <span class="winner-name">${i}</span>
          </div>
        </td>
        <td>${d}</td>
        <td>${c}</td>
        <td class="text-right">
           <!-- Desktop: Show all buttons -->
           <div class="action-buttons desktop-only">
              <button 
                onclick="downloadHistoryItem('${n.id}')" 
                class="btn btn-sm btn-ghost"
                title="Download CSV"
              >
                CSV
              </button>
              <button 
                onclick="loadTournament('${n.id}')" 
                class="btn btn-sm btn-primary"
                ${g?"":"disabled"}
                title="Restore this tournament"
              >
                Load
              </button>
              <button 
                onclick="duplicateTournament('${n.id}')" 
                class="btn btn-sm btn-ghost"
                ${g?"":"disabled"}
                title="Copy settings to new tournament"
              >
                Duplicate
              </button>
              <button 
                onclick="deleteHistoryItem('${n.id}')" 
                class="btn btn-sm btn-danger"
                title="Delete permanently"
              >
                🗑️
              </button>
           </div>
           <!-- Mobile: Dropdown menu -->
           <div class="action-menu mobile-only">
              <button class="btn btn-sm btn-ghost action-menu-trigger" onclick="toggleActionMenu(this)">⋮</button>
              <div class="action-menu-dropdown">
                <button onclick="loadTournament('${n.id}')" ${g?"":"disabled"}>Load</button>
                <button onclick="duplicateTournament('${n.id}')" ${g?"":"disabled"}>Duplicate</button>
                <button onclick="downloadHistoryItem('${n.id}')">CSV</button>
                <button class="text-danger" onclick="deleteHistoryItem('${n.id}')">Delete</button>
              </div>
           </div>
        </td>
      </tr>
      `}).join("")}}function Kn(e){const s=ce().find(n=>n.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}function Qn(e){const s=ce().find(n=>n.id===e);if(!s||!s.data){x("Tournament details not found","error");return}N("Duplicate this tournament?","This will copy settings and players but reset all scores.","Duplicate",()=>{try{const o={...s.data,leaderboard:[],schedule:[],currentRound:0,allRounds:null,isLocked:!1,hideLeaderboard:!0,manualByes:[]};Je(o),W(),V(),w(),x("Tournament duplicated - ready to start!"),window.scrollTo({top:0,behavior:"smooth"})}catch(n){console.error("Failed to duplicate tournament",n),x("Error duplicating tournament","error")}},!1)}function Zn(e){const t=e.nextElementSibling,s=t.classList.contains("open");document.querySelectorAll(".action-menu-dropdown.open").forEach(n=>{n.classList.remove("open")}),s||t.classList.add("open")}document.addEventListener("click",e=>{e.target.closest(".action-menu")||document.querySelectorAll(".action-menu-dropdown.open").forEach(t=>{t.classList.remove("open")})});window.duplicateTournament=Qn;window.toggleActionMenu=Zn;document.addEventListener("DOMContentLoaded",()=>{});let te=null;const ke={};function he(e,t){ke[e]=t}function es(){window.addEventListener("hashchange",yt),yt()}function Gt(){const{route:e,params:t}=Yt();return{route:e,params:t}}function Yt(){const e=location.hash.slice(2)||"",[t,s]=e.split("?"),n=t.replace(/\/$/,""),o=new URLSearchParams(s||"");return{route:n,params:o}}function yt(){const{route:e,params:t}=Yt(),s=ke[e]||ke[""]||ke.generator;if(!s){console.warn(`[Router] No page found for route: ${e}`);return}if(te!=null&&te.unmount)try{te.unmount()}catch(o){console.error("[Router] Error unmounting page:",o)}const n=document.getElementById("pageContainer");n&&(n.innerHTML=`
      <div style="padding: 20px;">
        <div class="loading-skeleton skeleton-header" style="width: 50%; height: 40px; margin-bottom: 30px;"></div>
        <div class="loading-skeleton skeleton-card" style="height: 200px; margin-bottom: 20px;"></div>
        <div class="loading-skeleton skeleton-card" style="height: 150px;"></div>
      </div>
    `),setTimeout(()=>{if(te=s,n&&te.mount)try{te.mount(n,t)}catch(o){console.error("[Router] Error mounting page:",o),n.innerHTML=`
          <div class="alert alert-danger" style="margin: 20px;">
            <h3>Error Loading Page</h3>
            <pre>${o.message}
${o.stack}</pre>
            <button class="btn btn-secondary" onclick="window.location.reload()">Reload</button>
          </div>
        `}},50)}function ts(e,t){let s;const n=document.getElementById(e),o=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",l=>{l.preventDefault(),s=l,n&&(n.style.display="inline-flex",n.addEventListener("click",async()=>{n.style.display="none",s.prompt(),(await s.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),s=null}))}),o&&!r&&n&&t&&(n.style.display="inline-flex",n.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{n&&(n.style.display="none"),s=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}const Le=()=>`
  <section class="section history-section-page" id="historySectionPage" style="display: block; margin-top: var(--space-xl);">
    <div class="container">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
         <h2>Past Tournaments</h2>
         <div class="search-wrapper">
           <input type="text" id="historySearch" placeholder="Filter by winner, date..." class="form-input search-input" />
         </div>
      </div>

      <div class="table-responsive history-table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Format</th>
              <th>Winner</th>
              <th>Players</th>
              <th>Rounds</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="historyTableBody"></tbody>
        </table>
        <div id="historyEmptyStatePage" class="empty-state-page" style="display: none; padding: 2rem; text-align: center;">
           <p class="text-muted">No history found.</p>
        </div>
      </div>
    </div>
  </section>
`,ns=()=>`
  <!-- Standard Header -->
  <div class="page-intro-header">
    <h2 class="page-title">Americano Setup</h2>
    <p class="page-subtitle">Add players and configure your tournament settings.</p>
  </div>

  <!-- Setup Section -->
  <div class="players-section">
    <!-- Inner title removed -->
    
    <div class="section-header">
      <h3 id="playersHeader">Players <span class="player-count" id="playerCount">(0)</span></h3>
      <div class="player-actions">
        <button class="btn btn-secondary btn-sm" id="importPlayersBtn">Import...</button>
        <button class="btn btn-danger btn-sm" id="clearAllPlayersBtn" title="Remove All Players">Clear All</button>
      </div>
    </div>

    <!-- Import Modal -->
    <div class="modal-overlay" id="importModal" style="display: none">
      <div class="modal">
        <div class="modal-header">
          <h3>Import Players</h3>
          <button class="close-modal" id="closeImportModal">Close</button>
        </div>
        <div class="modal-body">
          <p class="modal-hint">Paste names below (one per line, or comma separated). Duplicates will be skipped.</p>
          <textarea id="importTextarea" class="form-input" rows="8" placeholder="Anna&#10;Bertil&#10;Cecilia, David..."></textarea>
        </div>
        <div class="modal-footer">
          <span id="importStatus" class="import-status"></span>
          <div class="modal-actions">
            <button class="btn btn-ghost" id="cancelImportBtn">Cancel</button>
            <button class="btn btn-primary" id="confirmImportBtn">Import Players</button>
          </div>
        </div>
      </div>
    </div>

    <div class="player-input-row" id="playerInputRow" style="display: flex; gap: 12px; align-items: flex-end;">
      <div class="input-group" style="flex: 1;">
        <label for="playerNameInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Player Name</label>
        <input type="text" class="form-input" id="playerNameInput" placeholder="Enter name..." maxlength="20" />
      </div>
      <button class="btn btn-primary" id="confirmAddBtn" style="height: 44px;">Add</button>
    </div>

    <div class="player-list-wrapper expanded" id="playerListWrapper">
      <ul class="player-list" id="playerList">
        <!-- Players will be added here -->
      </ul>
    </div>
    <button class="expand-players-btn" id="expandPlayersBtn" data-action="toggle-player-list">Show Less ▲</button>

    <!-- Preferred Partners Section (Hidden by default or empty) -->
    <div id="preferredPartnersList" class="preferred-partners-list"></div>
    <div style="text-align: center; margin: 10px 0; display: none;">
      <button id="addPartnerPairBtn" class="btn btn-secondary btn-sm">Add Fixed Pair</button>
    </div>

    <p class="players-hint" id="playersHint">Add at least 4 players to generate a schedule</p>
  </div>

  <!-- Interactive Tournament Configuration -->
  <div class="tournament-config" id="tournamentConfig">
    <!-- Generated by tournamentConfig.js -->
  </div>

  <!-- Old summary for fallback (hidden) -->
  <div class="tournament-summary" id="tournamentSummary" style="display: none;">
    <h4 class="summary-title">Your Tournament</h4>
    <ul class="summary-list" id="summaryList"></ul>
  </div>

  <!-- Generate Button -->
  <button class="btn btn-primary btn-lg" id="generateBtn" disabled>Generate Schedule</button>
  
  <!-- Schedule Section (Hidden initially) -->
  <div class="schedule-section" id="scheduleSection" style="display: none">
    <div class="sticky-wrapper">
      <div class="schedule-toolbar" id="scheduleToolbar">
        <span class="toolbar-label">View:</span>
        <div class="schedule-controls" id="scheduleControlsContent">
          <div class="control-group">
            <label for="gridColumns">Cols:</label>
            <input type="range" id="gridColumns" min="0" max="6" value="0" step="1" />
            <span id="gridColumnsLabel" class="range-value">Auto</span>
          </div>
          <div class="control-divider"></div>
          <div class="control-group">
            <label for="textSize">Text:</label>
            <input type="range" id="textSize" min="50" max="250" value="100" step="10" />
            <span id="textSizeLabel" class="range-value">100%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Timer -->
    <div id="matchTimerContainer" class="timer-container" style="display: none">
      <div class="timer-wrapper">
        <div class="timer-display" id="timerDisplay" title="Click to edit time" style="cursor: pointer;">12:00</div>
      </div>
      <div class="timer-controls">
        <button class="btn btn-primary btn-sm" id="timerStartBtn">Start</button>
        <button class="btn btn-secondary btn-sm" id="timerPauseBtn" style="display: none">Pause</button>
        <button class="btn btn-ghost btn-sm" id="timerResetBtn">Reset</button>
        <button class="btn btn-ghost btn-sm" id="timerSubBtn">-1m</button>
        <button class="btn btn-ghost btn-sm" id="timerAddBtn">+1m</button>
      </div>
    </div>

    <div class="schedule-header-row">
      <h2 class="section-title">Tournament Schedule</h2>
      <span class="status-badge" id="runningBadge" style="display: none;">Running</span>
    </div>
    
    <div id="gameDetails" class="game-details"></div>

    <div class="rounds-container" id="roundsContainer"></div>
  </div>

  <!-- Tournament Actions -->
  <div id="tournamentActionsSection" class="tournament-actions" style="display: none;">
    <div class="actions-header">
      <h3>Tournament Controls</h3>
    </div>
    <div class="actions-grid">
      <button class="btn btn-secondary action-btn" data-action="add-late-player" title="Add a player who arrived late">
        <span class="action-text">Add Late Player</span>
      </button>
      <button class="btn btn-secondary action-btn" id="undoBtn" title="Undo last action (Ctrl+Z)" disabled>
        <span class="action-text">Undo Last Action</span>
      </button>
      <button class="btn btn-secondary action-btn" id="resetBtn" title="Reset Tournament - Start over with same players">
        <span class="action-text">Reset Tournament</span>
      </button>
      <button class="btn btn-danger action-btn" data-action="end-tournament" title="End Tournament - Finalize results">
        <span class="action-text">End Tournament</span>
      </button>
    </div>
  </div>

  <!-- Leaderboard -->
  <div class="leaderboard-section" id="leaderboardSection" style="display: none">
    <div class="leaderboard-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <h3>Leaderboard</h3>
        <button type="button" class="help-icon always-enabled" id="helpLeaderboard">?</button>
      </div>
      <div class="leaderboard-controls">
        <div class="controls-left">
          <button id="togglePositionBtn" class="btn btn-secondary btn-sm toggle-off" data-action="toggle-position" title="Toggle rank change indicators">Ranks</button>
          <button id="toggleVisibilityBtn" class="btn btn-secondary btn-sm toggle-off" data-action="toggle-visibility" title="Toggle score visibility">Scores</button>
        </div>
        <div class="controls-right">
          <select id="rankingCriteria" class="form-select btn-sm">
            <option value="points" selected>Points</option>
            <option value="wins">Wins</option>
            <option value="winRatio">Win %</option>
            <option value="pointRatio">Pts %</option>
          </select>
          <button class="btn btn-secondary btn-sm" id="printBtn" title="Print Schedule/Result">Print</button>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Pts</th>
            <th>W</th>
            <th title="Score Difference">Diff</th>
            <th title="Win Rate">%</th>
            <th>Pl</th>
          </tr>
        </thead>
        <tbody id="leaderboardBody"></tbody>
      </table>
    </div>
  </div>

  <!-- History Section -->
  ${Le()}
`,ft={mount(e,t){if(console.log("[GeneratorPage] Mounting..."),!e){console.error("[GeneratorPage] Mount failed: Container is null");return}e.innerHTML=ns(),Xe(),window.dispatchEvent(new CustomEvent("tournament-generator-mounted")),R(),Me(),D(),_(),ee();const s=document.querySelector(".players-header h3");if(s&&s.classList.add("animate-in"),ae(),Te(),document.getElementById("historySectionPage")&&rt(),a.schedule.length>0){const o=getElements();o.scheduleSection&&(o.scheduleSection.style.display="block"),o.leaderboardSection&&(o.leaderboardSection.style.display="block");const r=document.getElementById("tournamentActionsSection");r&&(r.style.display="block"),W(),V(),Pe()}},unmount(){console.log("[GeneratorPage] Unmounting...")}};function ss(e){if(!e||e.length<2)throw new Error("Need at least 2 teams for a bracket");const t=Math.pow(2,Math.ceil(Math.log2(e.length))),s=Math.log2(t);t-e.length;const n=as(e,t),o=[];let r=1;const l=[];for(let d=0;d<t/2;d++){const c=n[d],p=n[t-1-d],u={id:r++,round:1,position:d,team1:c||null,team2:p||null,score1:null,score2:null,winner:null,nextMatchId:null};c&&!p?(u.winner=c.id,u.isBye=!0):p&&!c&&(u.winner=p.id,u.isBye=!0),l.push(u),o.push(u)}let i=l;for(let d=2;d<=s;d++){const c=[];for(let p=0;p<i.length/2;p++){const u={id:r++,round:d,position:p,team1:null,team2:null,score1:null,score2:null,winner:null,nextMatchId:null};c.push(u),o.push(u);const f=i[p*2],g=i[p*2+1];f.nextMatchId=u.id,g.nextMatchId=u.id,f.winner&&(u.team1=gt(n,f.winner)),g.winner&&(u.team2=gt(n,g.winner))}i=c}return{teams:n.filter(Boolean),matches:o,numRounds:s,format:"single"}}function as(e,t){const s=new Array(t).fill(null);for(let n=0;n<e.length;n++)s[n]=e[n];return s}function gt(e,t){return e.find(s=>(s==null?void 0:s.id)===t)||null}function os(e,t,s){var o,r,l,i;const n=a.tournament.matches.find(d=>d.id===e);if(!n)return!1;if(n.winner!=null&&Jt(n),n.score1=t,n.score2=s,t>s)n.winner=(o=n.team1)==null?void 0:o.id;else if(s>t)n.winner=(r=n.team2)==null?void 0:r.id;else return n.winner=null,!1;if(n.nextMatchId){const d=a.tournament.matches.find(c=>c.id===n.nextMatchId);if(d){const c=n.winner===((l=n.team1)==null?void 0:l.id)?n.team1:n.team2;((i=a.tournament.matches.filter(f=>f.nextMatchId===d.id)[0])==null?void 0:i.id)===n.id?d.team1=c:d.team2=c}}return w(),!0}function Jt(e){var o;if(!e.nextMatchId)return;const t=a.tournament.matches.find(r=>r.id===e.nextMatchId);if(!t)return;((o=a.tournament.matches.filter(r=>r.nextMatchId===t.id)[0])==null?void 0:o.id)===e.id?t.team1=null:t.team2=null,t.winner!=null&&(t.score1=null,t.score2=null,t.winner=null,Jt(t))}function rs(){const e=a.tournament.matches;if(!e.length)return[];const t=Math.max(...e.map(n=>n.round)),s=[];for(let n=1;n<=t;n++)s.push(e.filter(o=>o.round===n).sort((o,r)=>o.position-r.position));return s}function is(e,t){const s=t-e;return s===0?"Final":s===1?"Semi-Finals":s===2?"Quarter-Finals":`Round ${e}`}function ht(){const e=a.tournament.matches;if(!e.length)return!1;const t=e.find(s=>s.round===Math.max(...e.map(n=>n.round)));return(t==null?void 0:t.winner)!=null}function ls(){var r,l;const e=a.tournament.matches;if(!e.length)return[];const t=Math.max(...e.map(i=>i.round)),s=e.find(i=>i.round===t),n=e.filter(i=>i.round===t-1),o=[];if(s!=null&&s.winner){const i=s.winner===((r=s.team1)==null?void 0:r.id)?s.team1:s.team2;o.push({place:1,team:i});const d=s.winner===((l=s.team1)==null?void 0:l.id)?s.team2:s.team1;o.push({place:2,team:d})}return n.forEach(i=>{var d;if(i.winner){const c=i.winner===((d=i.team1)==null?void 0:d.id)?i.team2:i.team1;c&&o.push({place:3,team:c})}}),o}function ds(e){const t=e.map((n,o)=>({id:`team-${Date.now()}-${o}`,name:n.trim()})),s=ss(t);return a.tournament={format:"single",teams:s.teams,matches:s.matches,standings:[],meta:{name:"",notes:"",createdAt:new Date().toISOString()}},w(),s}function cs(){a.tournament={format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},w()}const Ge=[];let E=[],pe=!1,Y=localStorage.getItem("bracket_mode")||"teams";function us(){return Y==="players"?"Players":"Teams"}function ps(){return Y==="players"?"Player":"Team"}function ms(){return Y==="players"?"Enter player name...":"Enter team name..."}function q(e,t,s){e&&(e.addEventListener(t,s),Ge.push({el:e,event:t,handler:s}))}function ve(){localStorage.setItem("bracket_teams",JSON.stringify(E))}function ys(){try{const e=localStorage.getItem("bracket_teams");e&&(E=JSON.parse(e))}catch(e){console.error("Failed to load bracket teams",e),E=[]}}function fs(){const e=E.length;if(e<2)return`Add at least ${2-e} more team${2-e>1?"s":""}`;if((e&e-1)===0&&e>=4)return`<span style="color: var(--success)">✓ ${e} teams ready (perfect bracket)</span>`;{const s=Math.ceil(Math.log2(e)),o=Math.pow(2,s)-e;return`<span style="color: var(--warning)">${e} teams • ${o} bye${o>1?"s":""} will be assigned</span>`}}const gs={mount(e,t){var n,o;if(console.log("[BracketPage] Mounting..."),ys(),!((o=(n=a.tournament)==null?void 0:n.matches)!=null&&o.length)){this.renderEmptyState(e);return}this.renderBracket(e);const s=document.createElement("div");s.innerHTML=Le(),e.appendChild(s),Te(),rt()},renderEmptyState(e){const t=localStorage.getItem("bracket_dual_mode")==="true";e.innerHTML=`
      <div class="bracket-empty-state">
        <div class="page-intro-header">
          <h2>Create a Bracket</h2>
          <p>Set up a single elimination tournament bracket.</p>
        </div>
        
        <div class="players-section" style="max-width: 500px; margin: 0 auto;">
          <div class="section-header">
            <h3>${us()} <span id="bracketTeamCount">(${E.length})</span></h3>
            <div class="player-actions">
              <button class="btn btn-sm btn-secondary" id="importTeamsBtn">Import...</button>
              <button class="btn btn-sm btn-danger" id="clearAllTeamsBtn">Clear All</button>
            </div>
          </div>
          
          <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end;">
            <div class="input-group" style="flex: 1;">
              <label for="bracketTeamInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">${ps()} Name</label>
              <input type="text" id="bracketTeamInput" class="form-input" placeholder="${ms()}" />
            </div>
            <button class="btn btn-primary" id="addTeamBtn" style="height: 44px;">Add</button>
          </div>
          
          <ul class="player-list" id="bracketTeamsList" style="max-height: ${pe?"2000px":"200px"}; overflow-y: auto; transition: max-height 0.3s ease;">
            ${this.renderTeamItems()}
          </ul>
          
          ${E.length>5?`
            <button class="btn btn-sm btn-secondary" id="bracketToggleTeamsBtn" data-expanded="${pe}" style="width: 100%; margin-top: 8px;">
              ${pe?"Show Less":`Show All (${E.length})`}
            </button>
          `:""}
          
          <p class="players-hint" id="bracketTeamsHint">${fs()}</p>
          <p class="form-hint" style="margin-top: 8px;">
            Use 4, 8, 16, or 32 ${Y==="players"?"players":"teams"} for perfect brackets. 
            <button type="button" id="bracketHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
          </p>
        </div>
        
        <div class="bracket-options" style="display: flex; gap: 20px; justify-content: center; margin: 15px 0; flex-wrap: wrap;">
          <label class="wc-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <span style="color: ${Y==="teams"?"var(--accent)":"var(--text-muted)"}; font-weight: ${Y==="teams"?"600":"400"};">Teams</span>
            <input type="checkbox" id="bracketModeToggle" ${Y==="players"?"checked":""} />
            <span class="slider round"></span>
            <span style="color: ${Y==="players"?"var(--accent)":"var(--text-muted)"}; font-weight: ${Y==="players"?"600":"400"};">Players</span>
          </label>
          <label class="wc-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="bracketDualMode" ${t?"checked":""} />
            <span class="slider round"></span>
            <span>Dual Brackets (A vs B)</span>
          </label>
          <label class="wc-toggle" id="sharedFinalLabel" style="display: ${t?"flex":"none"}; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="bracketSharedFinal" ${localStorage.getItem("bracket_shared_final")!=="false"?"checked":""} />
            <span class="slider round"></span>
            <span>Shared Grand Final 🏆</span>
          </label>
          <div id="sideAssignLabel" style="display: ${t?"flex":"none"}; align-items: center; gap: 8px;">
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Assign:</span>
            <select id="bracketSideAssign" class="form-input" style="padding: 4px 8px; font-size: 0.85rem;">
              <option value="random" ${localStorage.getItem("bracket_side_assign")==="random"||!localStorage.getItem("bracket_side_assign")?"selected":""}>Random</option>
              <option value="alternate" ${localStorage.getItem("bracket_side_assign")==="alternate"?"selected":""}>Alternate (1-A, 2-B...)</option>
              <option value="half" ${localStorage.getItem("bracket_side_assign")==="half"?"selected":""}>First Half A / Second B</option>
            </select>
            <button type="button" id="assignHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
          </div>
        </div>
        
        <div id="bracketPreview" class="bracket-preview" style="margin: 20px auto; padding: 15px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: ${E.length>=2?"block":"none"}; width: fit-content; max-width: 100%;">
          <div id="bracketPreviewContent"></div>
        </div>
        
        <button class="btn btn-primary" id="createBracketBtn" ${E.length<2?"disabled":""}>Create Bracket</button>
      </div>
    `,this.updatePreview(e),this.attachSetupListeners(e)},renderTeamItems(){return E.map((e,t)=>`
        <li class="player-item" data-index="${t}">
          <span class="player-number">${t+1}.</span>
          <span class="player-name">${e}</span>
          <button class="player-remove" data-index="${t}">×</button>
        </li>
      `).join("")},updatePreview(e){const t=e.querySelector("#bracketPreview"),s=e.querySelector("#bracketPreviewContent"),n=e.querySelector("#bracketDualMode"),o=e.querySelector("#bracketSharedFinal");if(!(!t||!s))if(E.length>=2){t.style.display="block";const r=(n==null?void 0:n.checked)||!1,l=(o==null?void 0:o.checked)??!0;s.innerHTML=this.renderBracketPreview(E,r,l)}else t.style.display="none"},attachSetupListeners(e){const t=e.querySelector("#bracketTeamInput"),s=e.querySelector("#addTeamBtn"),n=e.querySelector("#importTeamsBtn"),o=e.querySelector("#clearAllTeamsBtn"),r=e.querySelector("#createBracketBtn"),l=e.querySelector("#bracketDualMode"),i=e.querySelector("#bracketSharedFinal"),d=e.querySelector("#bracketSideAssign"),c=e.querySelector("#bracketModeToggle");c&&q(c,"change",()=>{Y=c.checked?"players":"teams",localStorage.setItem("bracket_mode",Y),this.renderEmptyState(e)});const p=()=>{var b;const y=t.value.trim();if(y){if(E.some(h=>h.toLowerCase()===y.toLowerCase())){x("Team already exists!","error");return}if(E.length>=32){x("Maximum 32 teams allowed","error");return}E.push(y),ve(),t.value="",this.renderEmptyState(e),(b=e.querySelector("#bracketTeamInput"))==null||b.focus(),x(`${y} added`,"success")}};q(s,"click",p),q(t,"keypress",y=>{y.key==="Enter"&&p()}),n&&q(n,"click",()=>{Ie("Import Teams",`Team Alpha
Team Beta
Team Gamma`,y=>{const b=y.split(`
`);let h=0;b.forEach($=>{const C=$.trim();C&&(E.some(L=>L.toLowerCase()===C.toLowerCase())||E.length>=32||(E.push(C),h++))}),h>0&&(ve(),this.renderEmptyState(e),x(`Imported ${h} teams`,"success"))},"Enter team names, one per line.")}),q(o,"click",()=>{N("Clear All Teams?","This will remove all teams from the list.","Clear",()=>{E=[],ve(),this.renderEmptyState(e),x("All teams cleared")},!0)});const u=e.querySelector("#bracketTeamsList");u&&q(u,"click",y=>{if(y.target.classList.contains("player-remove")){const b=parseInt(y.target.dataset.index),h=E.splice(b,1)[0];ve(),this.renderEmptyState(e),x(`${h} removed`)}});const f=e.querySelector("#bracketToggleTeamsBtn");f&&q(f,"click",()=>{pe=!pe,this.renderEmptyState(e)}),q(l,"change",()=>{const y=e.querySelector("#sharedFinalLabel"),b=e.querySelector("#sideAssignLabel");localStorage.setItem("bracket_dual_mode",l.checked?"true":"false"),y&&(y.style.display=l.checked?"flex":"none"),b&&(b.style.display=l.checked?"flex":"none"),this.updatePreview(e)}),i&&q(i,"change",()=>{localStorage.setItem("bracket_shared_final",i.checked?"true":"false"),this.updatePreview(e)}),d&&q(d,"change",()=>{localStorage.setItem("bracket_side_assign",d.value)});const g=e.querySelector("#assignHelp");g&&q(g,"click",y=>{y.preventDefault(),Z("Side Assignment Explained",`<p><strong>How teams are divided between Side A and Side B:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li><strong>🎲 Random</strong> – Teams are shuffled randomly between sides</li>
            <li><strong>↔️ Alternate</strong> – Team 1→A, Team 2→B, Team 3→A, Team 4→B, etc.</li>
            <li><strong>½ First Half A / Second Half B</strong> – Top half of your list goes to Side A, bottom half to Side B</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 10px;">Tip: Use 'First Half' if you've ordered teams by seed/skill and want to keep top seeds separated!</p>`)});const m=e.querySelector("#bracketHelp");m&&q(m,"click",y=>{y.preventDefault(),Z("Bracket Sizes Explained",`<p><strong>Perfect bracket sizes:</strong> 4, 8, 16, or 32 teams</p>
          <p>With these numbers, all teams play every round—no one gets a free pass!</p>
          <hr style="margin: 12px 0; border-color: var(--border-color);">
          <p><strong>What are "byes"?</strong></p>
          <p>If you don't have a perfect number (e.g., 10 teams), some teams get a <strong>bye</strong>—they skip round 1 and go directly to round 2.</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">Example: With 10 teams, 6 teams get byes (advance automatically), and 4 teams play in round 1.</p>
          <hr style="margin: 12px 0; border-color: var(--border-color);">
          <p><strong>Dual Brackets mode:</strong></p>
          <p>Splits teams into Side A and Side B. Each side has its own bracket, and the winners face off in a Grand Final!</p>`)}),q(r,"click",()=>{if(E.length<2){x("Need at least 2 teams","error");return}if(E.length>32){x("Maximum 32 teams allowed","error");return}try{ds(E),x(`Bracket created with ${E.length} teams`,"success"),this.renderBracket(e)}catch(y){x("Error creating bracket: "+y.message,"error")}})},renderBracketPreview(e,t=!1,s=!0){return t?this.renderDualBracketPreview(e,s):this.renderSingleBracketPreview(e)},renderSingleBracketPreview(e){const t=e.length,s=Math.ceil(Math.log2(t)),n=t-1,r=(t&t-1)===0?0:Math.pow(2,s)-t,l=Math.pow(2,Math.floor(Math.log2(t))),i=Math.pow(2,s),d=t-l,c=i-t,p=this.renderMiniBracket(t,"var(--accent)"),u=r>0?`
      <div style="margin-top: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); text-align: center;">
        💡 <strong>${r} teams get byes</strong> (auto-advance to round 2)
        <div style="margin-top: 4px; color: var(--text-muted);">
          For perfect brackets: remove ${d} team${d>1?"s":""} → ${l} teams 
          <span style="margin: 0 6px;">|</span> 
          add ${c} team${c>1?"s":""} → ${i} teams
        </div>
      </div>
    `:`
      <div style="margin-top: 10px; padding: 8px 12px; background: rgba(34, 197, 94, 0.1); border-radius: 6px; font-size: 0.8rem; color: var(--success); text-align: center;">
        ✓ Perfect bracket size! No byes needed.
      </div>
    `;return`
      <div style="text-align: center; margin-bottom: 8px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${t} Teams</span>
        <span style="color: var(--text-muted); font-size: 0.85rem;"> • ${s} rounds • ${n} matches</span>
      </div>
      ${p}
      ${u}
    `},renderDualBracketPreview(e,t=!0){const s=e.length,n=Math.ceil(s/2),o=n,r=s-n,l=this.renderMiniBracket(o,"var(--accent)",!t),i=this.renderMiniBracketReversed(r,"var(--warning)"),d=Math.ceil(Math.log2(o)),c=Math.ceil(Math.log2(r)),p=Math.pow(2,d)-o,u=Math.pow(2,c)-r;return`
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${s} Teams → 2 ${t?"Brackets":"Separate Tournaments"}</span>
      </div>
      <div class="dual-bracket-container" style="display: flex; align-items: stretch; justify-content: center; gap: 10px; flex-wrap: wrap;">
        <!-- Side A -->
        <div style="flex: 0 1 auto; width: fit-content; padding: 10px; border: 2px solid var(--accent); border-radius: 8px; background: rgba(59, 130, 246, 0.05);">
          <div style="text-align: center; margin-bottom: 8px; font-weight: 600; color: var(--accent);">
            Side A (${o}) ${t?"":"🏆"}
            ${p>0?`<span style="color: var(--warning); font-size: 0.75rem;" title="${p} byes"> ⚠️</span>`:""}
          </div>
          ${l}
        </div>
        
        <!-- Center: Grand Final or Separator -->
        ${t?`
          <div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
            <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">GRAND FINAL</div>
            <div style="width: 60px; height: 30px; background: linear-gradient(135deg, var(--accent), var(--warning)); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 1.2rem;">🏆</span>
            </div>
            <div style="font-size: 0.6rem; color: var(--text-muted);">A 🆚 B</div>
          </div>
        `:""}
        
        <!-- Side B -->
        <div style="flex: 0 1 auto; width: fit-content; padding: 10px; border: 2px solid var(--warning); border-radius: 8px; background: rgba(245, 158, 11, 0.05);">
          <div style="text-align: center; margin-bottom: 8px; font-weight: 600; color: var(--warning);">
            Side B (${r}) ${t?"":"🏆"}
            ${u>0?`<span style="color: var(--warning); font-size: 0.75rem;" title="${u} byes"> ⚠️</span>`:""}
          </div>
          ${i}
        </div>
      </div>
    `},renderMiniBracketReversed(e,t){const s=Math.ceil(Math.log2(e)),n=[];for(let r=0;r<s;r++){const l=Math.pow(2,s-r-1);let i;l===1?i="F":l===2?i="SF":l===4?i="QF":i=`R${l*2}`,n.push({name:i,matches:l})}n.reverse();let o='<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';for(let r=0;r<n.length;r++){const{name:l,matches:i}=n[r];r>0&&(o+='<div style="color: var(--text-muted); font-size: 0.8rem;">←</div>'),o+=`
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: ${t}; font-weight: 600;">${l}</div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            ${Array.from({length:i},()=>`
              <div style="width: 60px; height: 20px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 3px;"></div>
            `).join("")}
          </div>
        </div>
      `}return o+="</div>",o},renderMiniBracket(e,t,s=!0){const n=Math.ceil(Math.log2(e)),o=[];for(let l=0;l<n;l++){const i=Math.pow(2,n-l-1);i===1?o.push("F"):i===2?o.push("SF"):i===4?o.push("QF"):o.push(`R${i*2}`)}let r='<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';for(let l=0;l<n;l++){const i=Math.pow(2,n-l-1);l>0&&(r+='<div style="color: var(--text-muted); font-size: 0.8rem;">→</div>'),r+=`
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: ${t}; font-weight: 600;">${o[l]}</div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            ${Array.from({length:i},()=>`
              <div style="width: 60px; height: 20px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 3px;"></div>
            `).join("")}
          </div>
        </div>
      `}return s&&(r+=`
        <div style="color: var(--text-muted); font-size: 0.8rem;">→</div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: var(--success);">🏆</div>
          <div style="width: 60px; height: 20px; background: linear-gradient(135deg, ${t}, var(--success)); border-radius: 3px;"></div>
        </div>
      `),r+="</div>",r},renderBracket(e){const t=rs(),s=t.length,n=ht();e.innerHTML=`
      <div class="bracket-header">
        <h2>Tournament Bracket</h2>
        <div class="bracket-actions">
          <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
          <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
        </div>
      </div>
      <div class="bracket-container">
        ${t.map((i,d)=>`
          <div class="bracket-round" data-round="${d+1}">
            <div class="round-header">${is(d+1,s)}</div>
            <div class="round-matches">
              ${i.map(c=>this.renderMatch(c)).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      ${n?this.renderChampions():""}
    `;const o=e.querySelector(".bracket-container");q(o,"click",i=>{const d=i.target.closest(".bracket-match");if(d&&!d.classList.contains("bye")){const c=parseInt(d.dataset.matchId);this.openScoreEntry(e,c)}});const r=e.querySelector("#clearBracketBtn");q(r,"click",()=>{N("Clear Bracket?","This will delete the entire bracket and all results.","Clear",()=>{cs(),this.renderEmptyState(e),x("Bracket cleared")},!0)});const l=e.querySelector("#printBracketBtn");l&&q(l,"click",()=>window.print())},renderMatch(e){var c,p,u,f;const t=e.team1||e.team2,s=e.isBye,n=e.winner!=null,o=t&&e.team1&&e.team2&&!s,r=n&&e.winner===((c=e.team1)==null?void 0:c.id),l=n&&e.winner===((p=e.team2)==null?void 0:p.id),i=r?"winner":n?"loser":"",d=l?"winner":n?"loser":"";return`
      <div class="bracket-match ${s?"bye":""} ${n?"complete":""} ${o?"editable":""}" 
           data-match-id="${e.id}">
        <div class="match-team ${i}">
          <span class="team-name">${((u=e.team1)==null?void 0:u.name)||"TBD"}</span>
          <span class="team-score">${e.score1??"-"}</span>
        </div>
        <div class="match-team ${d}">
          <span class="team-name">${((f=e.team2)==null?void 0:f.name)||"TBD"}</span>
          <span class="team-score">${e.score2??"-"}</span>
        </div>
        ${s?'<div class="bye-label">BYE</div>':""}
      </div>
    `},renderChampions(){var o,r,l,i;const e=ls(),t=e.find(d=>d.place===1),s=e.find(d=>d.place===2),n=e.filter(d=>d.place===3);return`
      <div class="bracket-champions">
        <h3>Champions</h3>
        <div class="podium">
          <div class="podium-place second">
            <div class="podium-medal">2</div>
            <div class="podium-team">${((o=s==null?void 0:s.team)==null?void 0:o.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
          <div class="podium-place first">
            <div class="podium-medal">1</div>
            <div class="podium-team">${((r=t==null?void 0:t.team)==null?void 0:r.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
          <div class="podium-place third">
            <div class="podium-medal">3</div>
            <div class="podium-team">${((i=(l=n[0])==null?void 0:l.team)==null?void 0:i.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
        </div>
        ${n.length>1?`<div class="also-third"><span class="also-label">Also 3rd:</span> ${n.slice(1).map(d=>{var c;return(c=d.team)==null?void 0:c.name}).join(", ")}</div>`:""}
      </div>
    `},openScoreEntry(e,t){const s=a.tournament.matches.find(l=>l.id===t);if(!s||!s.team1||!s.team2)return;const n=document.createElement("div");n.className="modal-overlay",n.style.display="flex",n.innerHTML=`
      <div class="modal score-modal">
        <div class="modal-header">
          <h3>Enter Score</h3>
          <button class="close-modal" id="closeScoreModal">Close</button>
        </div>
        <div class="modal-body">
          <div class="score-type-selector">
            <label>Score Type:</label>
            <div class="score-type-buttons">
              <button class="btn btn-sm score-type-btn active" data-type="points">Points</button>
              <button class="btn btn-sm score-type-btn" data-type="games">Games</button>
              <button class="btn btn-sm score-type-btn" data-type="sets">Sets</button>
            </div>
          </div>
          <div class="score-entry-cards">
            <div class="score-card">
              <div class="score-card-team">${s.team1.name}</div>
              <input type="number" id="score1Input" class="form-input score-input" 
                     value="${s.score1??""}" min="0" max="99" placeholder="0" />
            </div>
            <div class="score-divider">VS</div>
            <div class="score-card">
              <div class="score-card-team">${s.team2.name}</div>
              <input type="number" id="score2Input" class="form-input score-input" 
                     value="${s.score2??""}" min="0" max="99" placeholder="0" />
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="cancelScoreBtn">Cancel</button>
          <button class="btn btn-primary" id="saveScoreBtn">Save Score</button>
        </div>
      </div>
    `,document.body.appendChild(n);const o=()=>{n.remove()},r=()=>{const l=parseInt(document.getElementById("score1Input").value||"0"),i=parseInt(document.getElementById("score2Input").value||"0");if(l===i){x("Scores cannot be tied in elimination","error");return}os(t,l,i),o(),this.renderBracket(e),ht()&&x("Tournament complete! View the winners.","success")};n.querySelector("#closeScoreModal").addEventListener("click",o),n.querySelector("#cancelScoreBtn").addEventListener("click",o),n.querySelector("#saveScoreBtn").addEventListener("click",r),n.addEventListener("click",l=>{l.target===n&&o()}),n.querySelectorAll(".score-type-btn").forEach(l=>{l.addEventListener("click",()=>{n.querySelectorAll(".score-type-btn").forEach(i=>i.classList.remove("active")),l.classList.add("active")})}),setTimeout(()=>{var l;return(l=document.getElementById("score1Input"))==null?void 0:l.focus()},100)},unmount(){console.log("[BracketPage] Unmounting..."),Ge.forEach(({el:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),Ge.length=0}};function hs(e,t){if(e.length<t*4)throw new Error(`Need at least ${t*4} players for ${t} courts`);const s=[...e].sort((l,i)=>i.skill-l.skill),n=Array.from({length:t},(l,i)=>({id:i+1,players:[],totalSkill:0}));let o=1,r=0;return s.forEach(l=>{n[r].players.push(l),n[r].totalSkill+=l.skill,r+=o,(r>=t||r<0)&&(o*=-1,r+=o)}),n}function vs(e,t=!1,s=1){if(e.length<4)return null;if(t){const n=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]],o=(s-1)%3,[[r,l],[i,d]]=n[o];return{team1:[e[r],e[l]],team2:[e[i],e[d]]}}return{team1:[e[0],e[1]],team2:[e[2],e[3]]}}function bs(e,t){if(e.length<2)return e;const s=JSON.parse(JSON.stringify(e));for(let n=0;n<s.length;n++){const o=s[n];o.winner===1?n>0&&(be(s,n,0,n-1,2),be(s,n,1,n-1,3)):o.winner===2&&n<s.length-1&&(be(s,n,2,n+1,0),be(s,n,3,n+1,1)),o.winner=null,o.score1=null,o.score2=null}return s}function be(e,t,s,n,o){const r=e[t].players[s];e[t].players[s]=e[n].players[o],e[n].players[o]=r}function xs(e,t,s=!1){const n={};for(const o of["A","B"]){const r=e[o]||[],l=t[o]||0;if(r.length>=4&&l>0){const i=hs(r,l);n[o]={players:r,courts:i,courtCount:l,twist:s,round:1,history:[]}}}return a.winnersCourt={sides:n,twist:s},w(),n}function xe(){return a.winnersCourt||null}function ws(){a.winnersCourt=null,w()}function Ss(e,t,s,n,o){var l,i;if(!((i=(l=a.winnersCourt)==null?void 0:l.sides)!=null&&i[e]))return!1;const r=a.winnersCourt.sides[e].courts.find(d=>d.id===t);return r?(r.winner=s,r.score1=n,r.score2=o,w(),!0):!1}function ks(e){var r,l;if(!((l=(r=a.winnersCourt)==null?void 0:r.sides)!=null&&l[e]))return null;const t=a.winnersCourt.sides[e],{courts:s,twist:n}=t;return s.filter(i=>i.winner==null).length>0?{error:"Complete all matches first"}:(t.history=t.history||[],t.history.push({round:t.round,courts:JSON.parse(JSON.stringify(s))}),t.courts=bs(s),t.round++,w(),t.courts)}const Ye=[];function A(e,t,s){e&&(e.addEventListener(t,s),Ye.push({el:e,event:t,handler:s}))}const $s={tempPlayers:[],splitSidesEnabled:!1,listExpanded:!1,mount(e,t){console.log("[WinnersCourtPage] Mounting...");try{const s=localStorage.getItem("wc_setup_players");s&&(this.tempPlayers=JSON.parse(s)),this.splitSidesEnabled=localStorage.getItem("wc_split_sides")==="true"}catch(s){console.error("Failed to load WC setup players",s)}xe(),this.render(e)},tempPlayers:[],saveSetup(){localStorage.setItem("wc_setup_players",JSON.stringify(this.tempPlayers))},showHelp(){Z("How to Play",`
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <p><strong>Winners Court (Americano Mexicano hybrid)</strong> is a fun, skill-based king of the hill format.</p>
        
        <h4 style="margin: 12px 0 6px; color: var(--accent);">How it works</h4>
        <ul style="padding-left: 20px; margin: 0;">
          <li><strong>Win match:</strong> Move UP one court (e.g. Court 2 → Court 1).</li>
          <li><strong>Lose match:</strong> Move DOWN one court (e.g. Court 1 → Court 2).</li>
          <li><strong>Top Court Winners</strong> stay on Court 1.</li>
          <li><strong>Bottom Court Losers</strong> stay on the last court.</li>
        </ul>

        <h4 style="margin: 12px 0 6px; color: var(--accent);">Twist Mode</h4>
        <p style="margin: 0;">If enabled, partners rotate every round so you play with different people on your court. Great for socializing!</p>

        <h4 style="margin: 12px 0 6px; color: var(--accent);">Tips</h4>
        <ul style="padding-left: 20px; margin: 0;">
          <li>Initial placement is based on the <strong>Skill Level</strong> you enter.</li>
          <li>Default skill is (-) which is treated as 0.</li>
        </ul>
      </div>
    `)},render(e){e.innerHTML=`
      <div class="page-intro-header">
        <h2>Winners Court</h2>
        <p>Skill-based court promotion</p>
      </div>

      <div id="wcSetupContainer"></div>
      <div id="wcActiveContainer"></div>
      
      ${Le()}
    `,this.renderSetup(e.querySelector("#wcSetupContainer")),this.renderActiveGame(e.querySelector("#wcActiveContainer"));const t=document.createElement("div");t.innerHTML=Le(),e.appendChild(t),Te(),rt()},renderSetup(e){if(!e)return;const s=!!xe(),n=Math.max(1,Math.floor(this.tempPlayers.length/4));e.innerHTML=`
      <div class="wc-setup ${s?"compact":""}">
        <div class="wc-header-row" style="display: flex; align-items: center; justify-content: flex-end; margin-bottom: 8px;">
          <button class="help-icon" id="wcHelpBtn" style="width: 28px; height: 28px; font-size: 1rem; font-weight: bold;">?</button>
        </div>

        ${s?`<p class="wc-description" style="margin-bottom: 12px; color: var(--success);">
            <span style="font-weight: bold;">Game in Progress</span> • You can modify players here for the next game.
           </p>`:'<p class="wc-description">Enter players with skill ratings (1-10) to create balanced court assignments.</p>'}
        
        <div class="wc-form">
          <!-- Players Section -->
          <div class="players-section" style="${s?"border-color: var(--accent);":""}">
            <div class="section-header">
              <h3>Players <span id="wcPlayerCount">(${this.tempPlayers.length})</span></h3>
              <div class="player-actions">
                <button class="btn btn-sm btn-secondary" id="importBtn">Import...</button>
                <button class="btn btn-sm btn-danger" id="clearAllBtn">Clear All</button>
              </div>
            </div>
            
            <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end;">
              <div class="input-group" style="flex: 1;">
                <label for="wcNameInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Name</label>
                <input type="text" id="wcNameInput" class="form-input" placeholder="Enter name..." />
              </div>
              <div class="input-group" style="width: 70px;">
                <label for="wcSkillInput" style="display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
                  Skill 
                  <span id="wcSkillHelp" style="cursor: pointer; opacity: 0.7; font-size: 0.65rem; background: var(--bg-tertiary); border-radius: 50%; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center;">?</span>
                </label>
                <select id="wcSkillInput" class="form-select wc-skill-select compact-select">
                  <option value="0" selected>-</option>
                  ${Array.from({length:10},(o,r)=>`<option value="${r+1}">${r+1}</option>`).join("")}
                </select>
              </div>
              <button class="btn btn-primary" id="addPlayerBtn" style="height: 44px;">Add</button>
            </div>
            
            <ul class="player-list" id="wcPlayersList" style="max-height: ${this.listExpanded?"2000px":s?"200px":"280px"}; overflow-y: auto; transition: max-height 0.3s ease;">
              ${this.renderPlayerItems()}
            </ul>
            
            ${this.tempPlayers.length>5?`
              <button class="btn btn-sm btn-secondary" id="wcTogglePlayersBtn" data-expanded="${this.listExpanded}" style="width: 100%; margin-top: 8px;">
                ${this.listExpanded?"Show Less":`Show All (${this.tempPlayers.length})`}
              </button>
            `:""}
            
            ${this.renderSideSummary()}
            
            <p class="players-hint" id="wcPlayersHint">${this.getPlayersHint()}</p>
          </div>
          
          <!-- Options Section -->
          <div class="wc-options">
            ${this.splitSidesEnabled?"":`
            <div class="wc-option">
              <label for="wcCourts">Courts</label>
              <select id="wcCourts" class="form-input">
                ${Array.from({length:n+1},(o,r)=>r+1).filter(o=>o<=n||o===1).map(o=>`<option value="${o}" ${o===n?"selected":""}>${o} Court${o>1?"s":""} (${o*4} players)</option>`).join("")}
              </select>
            </div>
            `}
            
            <label class="wc-toggle">
              <input type="checkbox" id="wcTwist" />
              <span class="slider round"></span>
              <span class="toggle-label">Twist Mode</span>
            </label>
            
            <label class="wc-toggle">
              <input type="checkbox" id="wcSplitSides" ${this.splitSidesEnabled?"checked":""} />
              <span class="slider round"></span>
              <span class="toggle-label">Split Sides (A/B)</span>
            </label>
            
            ${this.splitSidesEnabled?`
              <button class="btn btn-sm btn-secondary" id="wcAutoAssignBtn" style="white-space: nowrap;">
                Auto-Assign by Skill
              </button>
            `:""}
          </div>
          
          ${s?`<div style="text-align: center; margin-top: 10px;">
               <button class="btn btn-secondary btn-sm" id="restartWcBtn">Restart / New Game</button>
             </div>`:`<button class="btn btn-primary btn-lg" id="generateWcBtn" ${this.tempPlayers.length<4?"disabled":""}>Generate Winners Court</button>`}
        </div>
      </div>
    `,this.attachSetupListeners(e),ae()},renderPlayerItems(){const e={showSkill:!0,showSide:this.splitSidesEnabled};if(!this.splitSidesEnabled)return this.tempPlayers.map((o,r)=>ze(o,r,e)).join("");const t=this.tempPlayers.map((o,r)=>({...o,originalIndex:r})).filter(o=>o.side!=="B"),s=this.tempPlayers.map((o,r)=>({...o,originalIndex:r})).filter(o=>o.side==="B");let n="";return t.length>0&&(n+=`<li class="side-header" style="padding: 4px 8px; background: rgba(59, 130, 246, 0.1); color: var(--accent); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-bottom: 4px;">Side A (${t.length})</li>`,n+=t.map(o=>ze(o,o.originalIndex,e)).join("")),s.length>0&&(n+=`<li class="side-header" style="padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: var(--warning); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-top: 8px; margin-bottom: 4px;">Side B (${s.length})</li>`,n+=s.map(o=>ze(o,o.originalIndex,e)).join("")),n},renderPlayerItem(e,t){return""},renderSideSummary(){if(!this.splitSidesEnabled||this.tempPlayers.length===0)return"";const e=this.tempPlayers.filter(n=>n.side!=="B"),t=this.tempPlayers.filter(n=>n.side==="B"),s=(n,o,r)=>{if(n.length===0)return"";const l=Math.floor(n.length/4),i=n.length%4;return`
        <div style="flex: 1; min-width: 120px;">
          <div style="font-weight: 600; color: ${r}; margin-bottom: 4px;">
            ${o}: ${n.length} player${n.length!==1?"s":""}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">
            ${l} court${l!==1?"s":""}${i>0?` (+${i} bench)`:""}
          </div>
          <ul style="margin: 0; padding-left: 16px; font-size: 0.8rem; color: var(--text-secondary);">
            ${n.map(d=>`<li>${d.name} <span style="opacity: 0.6;">(${d.skill===0?"-":d.skill})</span></li>`).join("")}
          </ul>
        </div>
      `};return`
      <div style="display: flex; gap: 16px; margin-top: 12px; padding: 10px; background: var(--bg-tertiary); border-radius: var(--radius-sm); flex-wrap: wrap;">
        ${s(e,"Side A","var(--accent)")}
        ${s(t,"Side B","var(--warning)")}
      </div>
    `},getPlayersHint(){const e=this.tempPlayers.length;if(e<4)return`Add at least ${4-e} more player${4-e>1?"s":""}`;const t=Math.floor(e/4),s=e%4;if(s===0)return`<span style="color: var(--success)">${e} players ready (${t} court${t>1?"s":""})</span>`;{const n=4-s;return`<span style="color: var(--warning)">${e} ready (${t} court${t>1?"s":""}). Need ${n} more for ${t+1} courts!</span>`}},attachSetupListeners(e){const t=e.querySelector("#wcNameInput"),s=e.querySelector("#wcSkillInput"),n=e.querySelector("#addPlayerBtn"),o=e.querySelector("#importBtn"),r=e.querySelector("#clearAllBtn"),l=e.querySelector("#generateWcBtn"),i=e.querySelector("#restartWcBtn"),d=e.querySelector("#wcHelpBtn");d&&A(d,"click",()=>this.showHelp());const c=e.querySelector("#wcSplitSides");c&&A(c,"change",()=>{this.splitSidesEnabled=c.checked,localStorage.setItem("wc_split_sides",this.splitSidesEnabled?"true":"false"),this.renderSetup(e)});const p=e.querySelector("#wcAutoAssignBtn");p&&A(p,"click",()=>{const m=[];this.tempPlayers.forEach((h,$)=>{h.skill===0?(m.push($),h.side=null):h.side=h.skill>=5?"A":"B"});let y=this.tempPlayers.filter(h=>h.side==="A").length,b=this.tempPlayers.filter(h=>h.side==="B").length;for(let h=m.length-1;h>0;h--){const $=Math.floor(Math.random()*(h+1));[m[h],m[$]]=[m[$],m[h]]}m.forEach(h=>{y<=b?(this.tempPlayers[h].side="A",y++):(this.tempPlayers[h].side="B",b++)}),this.saveSetup(),this.renderSetup(e),x(`Auto-assigned: Side A (${y}) / Side B (${b})`,"success")});const u=e.querySelector("#wcSkillHelp");u&&A(u,"click",m=>{m.preventDefault(),m.stopPropagation(),Z("About Skill Levels",`<p><strong>Skill levels are optional!</strong></p>
          <p>Use them to help create balanced teams for the <strong>first round</strong>:</p>
          <ul style="margin: 12px 0; padding-left: 20px;">
            <li><strong>1-3:</strong> Beginner</li>
            <li><strong>4-6:</strong> Intermediate</li>
            <li><strong>7-9:</strong> Advanced</li>
            <li><strong>10:</strong> Pro</li>
            <li><strong>-:</strong> Unknown/Skip</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem;">After round 1, matchups are based on wins/losses only—skill ratings won't affect later rounds.</p>`)}),o&&A(o,"click",()=>{Ie("Import Players",`John
Jane : 8
Bob`,m=>{const y=m.split(`
`);let b=0;y.forEach(h=>{const $=h.split(":"),C=$[0].trim();if(!C)return;let L=0;if($.length>1){const v=parseInt($[1].trim());!isNaN(v)&&v>=1&&v<=10&&(L=v)}this.tempPlayers.push({name:C,skill:L}),b++}),b>0&&(this.saveSetup(),this.renderSetup(e),x(`Imported ${b} players`,"success"))},"Enter names, one per line. Optionally add skill level with : # (e.g. 'John : 8'). Default skill is -.","textarea")});const f=()=>{const m=t.value.trim(),y=parseInt(s.value);if(this.tempPlayers.some(h=>h.name.toLowerCase()===m.toLowerCase())){x("Player already exists!","error");return}if(m&&y>=0&&y<=10){const h=this.splitSidesEnabled&&y>0&&y<5?"B":"A";this.tempPlayers.push({name:m,skill:y,side:h}),this.saveSetup(),t.value="",this.renderSetup(e),e.querySelector("#wcNameInput").focus();const $=y===0?"-":y,C=this.splitSidesEnabled?` → Side ${h}`:"";x(`${m} (${$}) added${C}`,"success")}};A(n,"click",f),A(t,"keypress",m=>{m.key==="Enter"&&f()}),A(r,"click",()=>{this.tempPlayers=[],this.saveSetup(),this.renderSetup(e)}),A(e.querySelector("#wcPlayersList"),"click",m=>{const y=m.target.closest(".side-toggle");if(y){const b=parseInt(y.dataset.index);this.tempPlayers[b].side=this.tempPlayers[b].side==="B"?"A":"B",this.saveSetup();const h=e.querySelector("#wcPlayersList");e.parentElement.querySelector(".wc-setup"),h&&(h.innerHTML=this.renderPlayerItems()),this.renderSetup(e)}}),A(e.querySelector("#wcPlayersList"),"click",m=>{if(m.target.classList.contains("player-remove")){const y=parseInt(m.target.dataset.index);this.tempPlayers.splice(y,1),this.saveSetup(),this.renderSetup(e)}});const g=e.querySelector("#wcTogglePlayersBtn");g&&A(g,"click",()=>{const m=e.querySelector("#wcPlayersList");this.listExpanded=!this.listExpanded,this.listExpanded?(m.style.maxHeight=m.scrollHeight+"px",g.textContent="Show Less",g.dataset.expanded="true"):(m.style.maxHeight="280px",g.textContent=`Show All (${this.tempPlayers.length})`,g.dataset.expanded="false")}),l&&A(l,"click",()=>{this.handleGenerate(e.parentElement)}),i&&A(i,"click",()=>{N("Start New Game?","Current progress will be lost.","Start New",()=>{ws();const m=e.parentElement;this.render(m)})})},handleGenerate(e){const t=document.getElementById("wcTwist").checked,s=this.tempPlayers.filter(d=>d.side!=="B"),n=this.tempPlayers.filter(d=>d.side==="B"),o={A:s,B:n},r=Math.floor(s.length/4),l=Math.floor(n.length/4),i={A:r,B:l};if(r===0&&l===0){x("Need at least 4 players on a side to start","error");return}try{xs(o,i,t);const d=r+l;x(`Winners Court created with ${d} court(s)`,"success"),this.render(e)}catch(d){x(d.message,"error")}},renderActiveGame(e){const t=xe();if(!t||!t.sides||!e){e&&(e.innerHTML="");return}const{sides:s,twist:n}=t,o=Object.keys(s).filter(r=>{var l,i;return((i=(l=s[r])==null?void 0:l.courts)==null?void 0:i.length)>0});if(o.length===0){e.innerHTML="";return}e.innerHTML=`
      <div class="wc-view" style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 20px; display: flex; gap: 20px; flex-wrap: wrap;">
        ${o.map(r=>this.renderSide(r,s[r],n)).join("")}
      </div>
    `,o.forEach(r=>{const l=e.querySelector(`[data-side="${r}"]`);if(!l)return;const i=l.querySelector(".wc-clear-btn");i&&A(i,"click",()=>{N(`Clear Side ${r}?`,"This will reset this side.","Clear",()=>{t.sides[r]&&(delete t.sides[r],w()),this.render(e.parentElement),x(`Side ${r} cleared`)},!0)});const d=l.querySelector(".wc-next-btn");d&&A(d,"click",()=>{const c=ks(r);c!=null&&c.error?x(c.error,"error"):(x(`Side ${r} - Round ${t.sides[r].round} started`),this.renderActiveGame(e))}),l.querySelectorAll(".wc-court").forEach(c=>{const p=c.querySelector(".wc-team-horizontal.wc-team1"),u=c.querySelector(".wc-team-horizontal.wc-team2");p&&A(p,"click",()=>{const f=parseInt(c.dataset.courtId);this.handleTeamWin(e,r,f,1)}),u&&A(u,"click",()=>{const f=parseInt(c.dataset.courtId);this.handleTeamWin(e,r,f,2)})})})},renderSide(e,t,s){const{courts:n,round:o}=t,r=e==="A"?"Side A":"Side B",l=e==="A"?"var(--accent)":"var(--warning)";return`
      <div class="wc-side" data-side="${e}" style="flex: 1; min-width: 300px; padding: 15px; border: 2px solid ${l}; border-radius: var(--radius-md); background: rgba(0,0,0,0.2);">
        <div class="wc-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="margin: 0; color: ${l};">${r} — Round ${o}</h3>
          <div class="wc-actions" style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm wc-next-btn">Next Round</button>
            <button class="btn btn-danger btn-sm wc-clear-btn">Clear</button>
          </div>
        </div>
        ${s?'<p class="wc-twist-badge" style="margin-bottom: 10px;">Twist Mode Active</p>':""}
        <div class="wc-courts-grid">
          ${n.map(i=>this.renderCourt(i,s,o)).join("")}
        </div>
      </div>
    `},renderHistory(e){const t=xe();if(!t||!t.sides)return;let s=!1,n="";for(const o of["A","B"]){const r=t.sides[o];if(!r||!r.history||r.history.length===0)continue;s=!0;const l=[...r.history].reverse();n+=`
        <div style="margin-bottom: 20px;">
          <h4 style="color: ${o==="A"?"var(--accent)":"var(--warning)"}; margin-bottom: 10px;">Side ${o} History</h4>
          ${l.map(d=>`
            <div class="wc-history-round" style="margin-bottom: 15px; opacity: 0.7;">
              <span style="color: var(--text-muted); font-size: 0.85rem;">Round ${d.round}</span>
              <div class="wc-courts-grid" style="margin-top: 8px;">
                ${d.courts.map(c=>this.renderCourt(c,!1,d.round,!0)).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `}s&&(e.innerHTML=`
      <div style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 20px;">
        <h3 style="color: var(--text-muted); margin-bottom: 20px;">Previous Rounds</h3>
        ${n}
      </div>
    `)},renderCourt(e,t,s,n=!1){var i,d,c,p;const o=vs(e.players,t,s),r=e.winner!=null;return`
      <div class="wc-court ${r?"complete":""} ${!n&&!r?"interactive":""}" data-court-id="${e.id}" style="${n?"pointer-events: none;":""}">
        <div class="wc-court-header">Court ${e.id}</div>
        <div class="wc-court-body-horizontal">
          <div class="wc-team-horizontal wc-team1 ${e.winner===1?"winner":e.winner===2?"loser":""}">
            <div class="wc-player-name">${((i=o==null?void 0:o.team1[0])==null?void 0:i.name)||"?"}</div>
            <div class="wc-player-name">${((d=o==null?void 0:o.team1[1])==null?void 0:d.name)||"?"}</div>
          </div>
          <div class="wc-vs-horizontal">VS</div>
          <div class="wc-team-horizontal wc-team2 ${e.winner===2?"winner":e.winner===1?"loser":""}">
            <div class="wc-player-name">${((c=o==null?void 0:o.team2[0])==null?void 0:c.name)||"?"}</div>
            <div class="wc-player-name">${((p=o==null?void 0:o.team2[1])==null?void 0:p.name)||"?"}</div>
          </div>
        </div>
        ${e.players.length>4?`<div class="wc-bench">
               <strong>Bench:</strong> ${e.players.slice(4).map(u=>u.name).join(", ")}
             </div>`:""}
      </div>
    `},handleTeamWin(e,t,s,n){Ss(t,s,n,0,0),this.renderActiveGame(e)},unmount(){console.log("[WinnersCourtPage] Unmounting..."),Ye.forEach(({el:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),Ye.length=0}};function Cs(){try{console.log("Tournament App: Initialized"),on({activeLink:"tournament"}),ts("installBtn",()=>{Z("Install App on iPhone",`
        <div style="text-align: center;">
          <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
          <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
            <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
            <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
            <li>Tap <strong>Add</strong> in the top right corner.</li>
          </ol>
        </div>
        `)});const e=rn(),t=Xe(),s=cn();Ke(),Ft(D),Ps(t),ae(),Ms(),Te(),window.addEventListener("resize",Mt),Is(),R(),Me(),D(),Bs(),Es(),he("",ft),he("generator",ft),he("bracket",gs),he("winners-court",$s),Ls(),es(),console.log("[Tournament] Router initialized. Current route:",Gt())}catch(e){console.error("CRITICAL ERROR IN INIT:",e),x("Application failed to start: "+e.message,"error")}}function Bs(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const s=t.getBoundingClientRect(),n=document.createElement("span");n.className="ripple",n.style.width=n.style.height=`${Math.max(s.width,s.height)}px`,n.style.left=`${e.clientX-s.left-n.offsetWidth/2}px`,n.style.top=`${e.clientY-s.top-n.offsetHeight/2}px`,t.appendChild(n),setTimeout(()=>n.remove(),600)})}function Ls(){const e=document.querySelector(".tournament-page .container"),t=e==null?void 0:e.querySelector(".tool-header");if(!t){console.error("[Router] Could not find .tool-header to inject navigation. Check HTML structure."),e||console.error("[Router] .tournament-page .container not found either.");return}const s=document.createElement("nav");s.className="page-nav",s.innerHTML=`
    <div class="page-nav-tabs">
      <a href="#/generator" class="page-nav-tab" data-route="generator">
        <span class="tab-label">Generator</span>
      </a>
      <a href="#/bracket" class="page-nav-tab" data-route="bracket">
        <span class="tab-label">Bracket</span>
      </a>
      <a href="#/winners-court" class="page-nav-tab" data-route="winners-court">
        <span class="tab-label">Winners Court</span>
      </a>
    </div>
  `,t.after(s);let n=document.getElementById("pageContainer");n||(n=document.createElement("div"),n.id="pageContainer",n.className="page-container",n.style.display="none",s.after(n));function o(){const{route:r}=Gt(),l=r||"generator";s.querySelectorAll(".page-nav-tab").forEach(c=>{c.dataset.route===l?c.classList.add("active"):c.classList.remove("active")});const i=document.getElementById("toolTitle"),d=document.getElementById("toolSubtitle");if(i&&d){const c={generator:{title:"Americano & Mexicano Generator",subtitle:"Create Americano and Mexicano schedules for your padel group in seconds."},bracket:{title:"Bracket Generator",subtitle:"Create single or dual elimination tournament brackets."},"winners-court":{title:"Winners Court",subtitle:"Skill-based court placement for balanced matches."}},p=c[l]||c.generator;i.textContent=p.title,d.textContent=p.subtitle}n.style.display==="none"&&(n.style.display="block")}o(),window.addEventListener("hashchange",o)}function Es(){const e=document.querySelectorAll(".section-title, .leaderboard-header h3, .players-header h3");e.forEach(s=>s.classList.add("animate-in"));const t=new IntersectionObserver(s=>{s.forEach(n=>{n.isIntersecting&&n.target.classList.add("animate-in")})},{threshold:.1});e.forEach(s=>t.observe(s))}function Is(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function Ps(e){window.addEventListener("tournament-generator-mounted",()=>{const t=M();t.format&&t.format.addEventListener("change",()=>{a.format=t.format.value,R(),w(),a.schedule.length>0&&se()}),t.scoringMode&&t.scoringMode.addEventListener("change",()=>{a.scoringMode=t.scoringMode.value,Me(),w(),D(),a.schedule.length>0&&W()}),t.points&&t.points.addEventListener("change",()=>{a.pointsPerMatch=parseInt(t.points.value),w(),D(),a.schedule.length>0&&W()}),t.courts&&(t.courts.addEventListener("change",()=>{a.courts=parseInt(t.courts.value),w(),D(),a.schedule.length>0&&se(),a.courtFormat==="custom"&&me()}),t.courts.addEventListener("input",()=>{const p=t.courts.value;if(p==="")return;let u=parseInt(p)||1;u=Math.max(1,Math.min(50,u)),!a.isLocked&&(t.courts.value=u,a.courts=u,w(),a.courtFormat==="custom"&&me(),a.schedule.length>0&&se())})),t.courtFormat&&t.courtFormat.addEventListener("change",()=>{a.courtFormat=t.courtFormat.value,Ke(),w()});const s=document.getElementById("playerNameInput");s&&s.addEventListener("keydown",c=>{c.key==="Enter"&&Ce(s.value)&&(s.value="",_())});const n=document.getElementById("confirmAddBtn");n&&s&&n.addEventListener("click",()=>{Ce(s.value)&&(s.value="",s.focus(),_())}),t.clearAllPlayersBtn&&t.clearAllPlayersBtn.addEventListener("click",()=>{Bt(()=>{_(),ee(),R()})});const o=document.getElementById("importPlayersBtn"),r=document.getElementById("closeImportModal"),l=document.getElementById("cancelImportBtn"),i=document.getElementById("confirmImportBtn");o&&o.addEventListener("click",et),r&&r.addEventListener("click",ne),l&&l.addEventListener("click",ne),i&&i.addEventListener("click",()=>{const c=document.getElementById("importTextarea");if(!c)return;const p=c.value,u=Lt(p);let f=`Added ${u.added} players.`;u.duplicates>0&&(f+=` Skipped ${u.duplicates} duplicates.`),u.hitLimit&&(f+=" Stopped at 24 max limit.");const g=document.getElementById("importStatus");g&&(g.textContent=f),_(),u.added>0&&u.duplicates===0&&!u.hitLimit&&(setTimeout(ne,1500),x(`Imported ${u.added} players`))});const d=document.getElementById("helpFormat");d&&d.addEventListener("click",()=>{}),vt(t)}),vt(e)}function vt(e){const t=document.getElementById("undoBtn");t&&(t.addEventListener("click",()=>{if(dn())if(x("Undo successful"),e.format.value=a.format,_(),W(),V(),R(),Pe(),a.schedule.length>0){e.scheduleSection&&(e.scheduleSection.style.display="block"),e.leaderboardSection&&(e.leaderboardSection.style.display="block");const p=document.getElementById("tournamentActionsSection");p&&(p.style.display="block")}else{e.scheduleSection&&(e.scheduleSection.style.display="none"),e.leaderboardSection&&(e.leaderboardSection.style.display="none");const p=document.getElementById("tournamentActionsSection");p&&(p.style.display="none")}}),window._undoListenerAttached||(document.addEventListener("keydown",p=>{if((p.ctrlKey||p.metaKey)&&p.key==="z"&&!p.shiftKey){p.preventDefault();const u=document.getElementById("undoBtn");u&&!u.disabled&&u.click()}}),window._undoListenerAttached=!0)),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Bt(()=>{_(),ee(),R()})}),e.importPlayersBtn&&e.importPlayersBtn.addEventListener("click",et),e.closeImportModal&&e.closeImportModal.addEventListener("click",ne),e.cancelImportBtn&&e.cancelImportBtn.addEventListener("click",ne),e.confirmImportBtn&&e.confirmImportBtn.addEventListener("click",()=>{const p=e.importTextarea?e.importTextarea.value:"",u=Lt(p);let f=`Added ${u.added} players.`;u.duplicates>0&&(f+=` Skipped ${u.duplicates} duplicates.`),u.hitLimit&&(f+=" Stopped at 24 max limit."),e.importStatus&&(e.importStatus.textContent=f),_(),u.added>0&&u.duplicates===0&&!u.hitLimit&&(setTimeout(ne,1500),x(`Imported ${u.added} players`))}),e.confirmAddBtn&&e.confirmAddBtn.addEventListener("click",()=>{Ce(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),_())}),e.playerNameInput&&e.playerNameInput.addEventListener("keydown",p=>{p.key==="Enter"&&Ce(e.playerNameInput.value)&&(e.playerNameInput.value="",_())}),e.format&&e.format.addEventListener("change",()=>{a.format=e.format.value,R(),w(),a.schedule.length>0&&se()}),e.courts&&e.courts.addEventListener("change",()=>{a.courts=parseInt(e.courts.value),w(),D(),a.schedule.length>0&&se(),a.courtFormat==="custom"&&me()}),e.points&&e.points.addEventListener("change",()=>{a.pointsPerMatch=parseInt(e.points.value),w(),D(),a.schedule.length>0&&W()}),e.scoringMode&&e.scoringMode.addEventListener("change",()=>{a.scoringMode=e.scoringMode.value,Me(),w(),D(),a.schedule.length>0&&W()});const s=document.getElementById("rankingCriteria");s&&s.addEventListener("change",()=>{a.rankingCriteria=s.value,zt(),w()}),e.courtFormat&&e.courtFormat.addEventListener("change",()=>{a.courtFormat=e.courtFormat.value,Ke(),w()}),e.courts&&e.courts.addEventListener("input",()=>{const u=e.courts.value;if(u==="")return;let f=parseInt(u)||1;f=Math.max(1,Math.min(50,f)),!a.isLocked&&(e.courts.value=f,a.courts=f,w(),a.courtFormat==="custom"&&me(),a.schedule.length>0&&se())}),e.maxRepeats&&e.maxRepeats.addEventListener("change",p=>{const u=parseInt(p.target.value),f=a.maxRepeats;a.isLocked?(p.target.value=f,N("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{a.maxRepeats=u,e.maxRepeats.value=u,w(),D(),x("Max Partner Repeats updated")},!0)):(a.maxRepeats=u,w(),D())});const n=document.getElementById("strictStrategy");n&&n.addEventListener("change",p=>{if(a.pairingStrategy==="optimal"){p.target.checked=!1,x("Strict Pattern is not available with Optimal pairing","info");return}const u=p.target.checked,f=a.strictStrategy;a.isLocked?(p.target.checked=!!f,N("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{a.strictStrategy=u,n.checked=u,w(),x("Strict Mode updated")},!0)):(a.strictStrategy=u,w())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",p=>{const u=p.target.value,f=a.pairingStrategy;if(a.isLocked)p.target.value=f,N("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(a.pairingStrategy=u,e.pairingStrategy.value=u,u==="optimal"){a.strictStrategy=!1;const g=document.getElementById("strictStrategy");g&&(g.checked=!1)}w(),R(),x("Pairing Strategy updated")},!0);else{if(a.pairingStrategy=u,u==="optimal"){a.strictStrategy=!1;const g=document.getElementById("strictStrategy");g&&(g.checked=!1)}w(),R()}}),e.addPartnerPairBtn&&e.addPartnerPairBtn.addEventListener("click",()=>{if(Et().length<2){x("Not enough available players to form a pair","error");return}$n(),ee(),R(),ae(),x("Fixed pair added","success")});const o=document.getElementById("helpFormat");o&&o.addEventListener("click",()=>{Z("Tournament Formats",`
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
        `)});const r=document.getElementById("helpScoring");r&&r.addEventListener("click",()=>{Z("Scoring Modes",`
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
        `)});const l=document.getElementById("helpMatchup");l&&l.addEventListener("click",()=>{Z("Matchup Rules",`
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
        `)});const i=document.getElementById("helpLeaderboard");i&&i.addEventListener("click",()=>{Z("Leaderboard Guide",`
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
        `)}),e.generateBtn&&e.generateBtn.addEventListener("click",Dt),e.printBtn&&e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn&&e.resetBtn.addEventListener("click",Ot),e.gridColumns&&e.gridColumns.addEventListener("input",Nn),e.textSize&&e.textSize.addEventListener("input",()=>{a.textSize=parseInt(e.textSize.value),Tt(),w()});const d=document.getElementById("factoryResetBtn");d&&d.addEventListener("click",()=>{N("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const c=document.getElementById("roundScale");c&&c.addEventListener("input",zn)}function Ms(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,n=t.dataset.id?Number(t.dataset.id):null,o=t.dataset.round?parseInt(t.dataset.round):null;switch(s){case"remove-player":n!==null&&(Ct(n),_());break;case"toggle-player-list":Ze();break;case"remove-pair":n!==null&&(Qe(n),ee(),R(),ae());break;case"toggle-bye":n!==null&&Wt(n);break;case"toggle-round":o!==null&&_t(o);break;case"complete-round":Ut();break;case"edit-round":o!==null&&Vt(o);break;case"toggle-visibility":Rt();break;case"toggle-position":Nt();break;case"end-tournament":tt($t);break;case"toggle-toolbar":nt();break;case"export-data":st();break;case"share-results":at();break;case"add-late-player":Xt();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,n=t.dataset.pairId?Number(t.dataset.pairId):null,o=t.dataset.which?parseInt(t.dataset.which):null;if(s==="update-partner"&&n!==null&&o!==null&&(It(n,o,Number(t.value)),ee(),R(),ae()),s==="autofill-score"&&a.scoringMode==="race"){const r=parseInt(t.dataset.round),l=parseInt(t.dataset.match),i=parseInt(t.dataset.team),d=t.value;Ue(r,l,i,d)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||a.scoringMode==="race")return;const s=parseInt(t.dataset.round),n=parseInt(t.dataset.match),o=parseInt(t.dataset.team),r=t.value;Ue(s,n,o,r)})}function Xt(){const e=a.format==="team"||a.format==="teamMexicano";Ie(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",n=>{if(n&&n.trim()){if(a.format==="americano"||a.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;a.format="mexicano",a.allRounds=null,x("Switched to Mexicano format")}kn(n.trim());const o=document.getElementById("playerCount");o&&(o.textContent=`(${a.players.length})`),V(),x(`Added ${n.trim()} to tournament`)}},`The new ${e?"team":"player"} will join with 0 points and be included starting from the next round. Their ranking will adjust based on future match results.`)}window.removePlayer=e=>{Ct(e),_()};window.togglePlayerList=Ze;window.updatePreferredPair=(e,t,s)=>{It(e,t,s),ee()};window.removePreferredPair=e=>{Qe(e),ee()};window.updateCustomCourtName=mn;window.autoFillScore=Ue;window.toggleManualBye=Wt;window.toggleRoundCollapse=_t;window.completeRound=Ut;window.editRound=Vt;window.toggleLeaderboardVisibility=Rt;window.togglePositionChanges=Nt;window.updateRankingCriteria=zt;window.updateSetupUI=R;window.endTournament=()=>tt($t);window.validateCourts=wt;window.toggleToolbar=nt;window.exportTournamentData=st;window.shareResults=at;window.promptAddLatePlayer=Xt;Cs();
