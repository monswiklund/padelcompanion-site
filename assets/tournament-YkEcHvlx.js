import{i as fn,a as yn}from"./layout-Chv5WU75.js";const Se=1,a={version:Se,players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,bracketScale:100,isLocked:!1,tournamentName:"",tournamentNotes:"",schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2,tournament:{format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},winnersCourt:null,ui:{currentRoute:"",selectedMatchId:null,activeBracketTab:"A"}},le=[],hn=20;function Bt(){const e=document.getElementById("undoBtn");e&&(e.disabled=le.length===0)}function Ie(){const e=JSON.parse(JSON.stringify(a));le.push(e),le.length>hn&&le.shift(),Bt()}function vn(){if(le.length===0)return!1;const e=le.pop();return tt(e),Bt(),!0}const Ct="tournament-state";function k(){localStorage.setItem(Ct,JSON.stringify({version:a.version,players:a.players,format:a.format,courts:a.courts,scoringMode:a.scoringMode,pointsPerMatch:a.pointsPerMatch,rankingCriteria:a.rankingCriteria,courtFormat:a.courtFormat,customCourtNames:a.customCourtNames,maxRepeats:a.maxRepeats,pairingStrategy:a.pairingStrategy,preferredPartners:a.preferredPartners,tournamentName:a.tournamentName,tournamentNotes:a.tournamentNotes,schedule:a.schedule,currentRound:a.currentRound,leaderboard:a.leaderboard,allRounds:a.allRounds,isLocked:a.isLocked,hideLeaderboard:a.hideLeaderboard,manualByes:a.manualByes,gridColumns:a.gridColumns,textSize:a.textSize,tournament:a.tournament,ui:a.ui,winnersCourt:a.winnersCourt}))}function bn(){const e=localStorage.getItem(Ct);if(!e)return!1;try{let t=JSON.parse(e);return t=xn(t),a.players=Array.isArray(t.players)?t.players.slice(0,200):[],a.format=t.format||"americano",a.courts=Math.max(1,Math.min(50,t.courts||2)),a.scoringMode=t.scoringMode||"total",a.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),a.rankingCriteria=t.rankingCriteria||"points",a.courtFormat=t.courtFormat||"court",a.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],a.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),a.pairingStrategy=t.pairingStrategy||"optimal",a.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],a.tournamentName=t.tournamentName||"",a.tournamentNotes=t.tournamentNotes||"",a.schedule=Array.isArray(t.schedule)?t.schedule:[],a.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),a.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],a.allRounds=t.allRounds||null,a.isLocked=t.isLocked||!1,a.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,a.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],a.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),a.textSize=Math.max(50,Math.min(200,t.textSize||100)),a.bracketScale=Math.max(50,Math.min(200,t.bracketScale||100)),t.tournament&&(a.tournament={format:t.tournament.format||"single",teams:t.tournament.teams||[],matches:t.tournament.matches||[],standings:t.tournament.standings||[],meta:t.tournament.meta||{name:"",notes:"",createdAt:null}}),t.ui&&t.ui&&(a.ui={currentRoute:t.ui.currentRoute||"",selectedMatchId:t.ui.selectedMatchId||null,activeBracketTab:t.ui.activeBracketTab||"A"}),a.winnersCourt=t.winnersCourt||null,!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function xn(e){const t=e.version||0;return t<Se&&(console.log(`[State] Migrating from v${t} to v${Se}`),t<1&&(e.tournament=e.tournament||{format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},e.ui=e.ui||{currentRoute:"",selectedMatchId:null}),e.version=Se),e}function wn(){return JSON.parse(JSON.stringify(a))}function tt(e){e&&(Object.keys(a).forEach(t=>{e.hasOwnProperty(t)&&(a[t]=e[t])}),a.players=a.players||[],a.schedule=a.schedule||[],a.leaderboard=a.leaderboard||[],k())}function ke(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function w(e,t={}){let n="default",s,o;typeof t=="number"?s=t:typeof t=="string"?n=t:typeof t=="object"&&(n=t.type??"default",s=t.duration,o=t.dismissible);const r={success:{duration:2500,dismissible:!1},info:{duration:3e3,dismissible:!1},warning:{duration:5e3,dismissible:!0},error:{duration:0,dismissible:!0},default:{duration:3e3,dismissible:!1}},l=r[n]||r.default;s=s??l.duration,o=o??l.dismissible;const i=document.querySelector(".toast");i&&i.remove();const c={success:"✓",error:"✕",warning:"⚠",info:"ℹ",default:""},d=document.createElement("div");d.className=`toast ${n}`,n==="error"?(d.setAttribute("role","alert"),d.setAttribute("aria-live","assertive")):(d.setAttribute("role","status"),d.setAttribute("aria-live","polite"));const p=c[n]||"";if(p){const m=document.createElement("span");m.className="toast-icon",m.textContent=p,d.appendChild(m)}const u=document.createElement("span");u.className="toast-message",u.textContent=e,d.appendChild(u);const g=()=>{d.classList.remove("visible"),setTimeout(()=>d.remove(),300)};if(o){const m=document.createElement("button");m.className="toast-close",m.setAttribute("aria-label","Close notification"),m.textContent="×",m.addEventListener("click",g),d.appendChild(m)}document.body.appendChild(d);const y=m=>{m.key==="Escape"&&o&&(g(),document.removeEventListener("keydown",y))};o&&document.addEventListener("keydown",y),setTimeout(()=>d.classList.add("visible"),10),s>0&&setTimeout(()=>{g(),document.removeEventListener("keydown",y)},s)}function ye(){return Math.floor(Date.now()+Math.random()*1e6)}let Be=null;function nt(){return Be={playersSection:document.querySelector(".players-section"),tournamentConfig:document.getElementById("tournamentConfig"),format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("genPlayerList")||document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn"),runningBadge:document.getElementById("runningBadge")},Be}function T(){return Be||nt(),Be}function De(e){switch(a.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return a.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function Oe(){var i;const e=T(),t=e.courts,n=document.getElementById("courtsWarning");if(!t||!n)return!0;const s=parseInt(t.value)||1,o=((i=e.format)==null?void 0:i.value)||a.format,r=o==="team"||o==="teamMexicano"?2:4,l=Math.floor(a.players.length/r);return t.max=Math.max(1,l),s>l&&l>0?(n.textContent=`⚠️ ${a.players.length} players can only fill ${l} court${l!==1?"s":""}`,n.style.display="block",t.classList.add("input-warning"),!1):l===0&&a.players.length>0?(n.textContent=`⚠️ Need at least ${r} players for 1 court`,n.style.display="block",t.classList.add("input-warning"),!1):(n.style.display="none",t.classList.remove("input-warning"),!0)}function st(){const e=T();if(!e.customCourtNamesSection)return;a.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",ge()):e.customCourtNamesSection.style.display="none"}function ge(){const e=T();if(!e.customCourtNamesList)return;const t=Math.max(1,a.courts||2);for(Array.isArray(a.customCourtNames)||(a.customCourtNames=[]);a.customCourtNames.length<t;)a.customCourtNames.push(`Court ${a.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(n,s)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(a.customCourtNames[s]||`Court ${s+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${s}, this.value)"
             placeholder="Court ${s+1}">
    </div>
  `).join("")}function Sn(e,t){a.customCourtNames[e]=t||`Court ${e+1}`,k()}function Lt(){const e=T(),t=new Set;a.preferredPartners.forEach(n=>{t.add(n.player1Id),t.add(n.player2Id)}),a.players.filter(n=>!t.has(n.id)),e.addPartnerPairBtn.disabled=!1}function ee(){const e=T(),t=n=>{const s=new Set;return a.preferredPartners.forEach(o=>{o.id!==n&&(s.add(o.player1Id),s.add(o.player2Id))}),s};if(e.preferredPartnersList){if(a.preferredPartners.length===0){e.preferredPartnersList.innerHTML="";return}e.preferredPartnersList.innerHTML=`
    <ul class="pairs-bullet-list">
      ${a.preferredPartners.map(n=>{const s=t(n.id),o=a.players.filter(i=>i.id===n.player1Id||i.id===n.player2Id||!s.has(i.id)),r=o.filter(i=>i.id!==n.player2Id||i.id===n.player1Id),l=o.filter(i=>i.id!==n.player1Id||i.id===n.player2Id);return`
            <li class="partner-pair-item" data-pair-id="${n.id}">
              <div class="pair-inputs">
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${n.id}" data-which="1">
                  ${r.map(i=>`<option value="${i.id}" ${i.id===n.player1Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
                <span class="pair-separator">&</span>
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${n.id}" data-which="2">
                  ${l.map(i=>`<option value="${i.id}" ${i.id===n.player2Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
              </div>
              <button class="remove-pair-btn" data-action="remove-pair" data-id="${n.id}">
                <span class="remove-icon">×</span>
              </button>
            </li>
          `}).join("")}
    </ul>
  `}}function ae(){document.querySelectorAll(".form-select").forEach(n=>{if(n.closest(".custom-select-wrapper")||n.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),n.parentNode.insertBefore(s,n),s.appendChild(n);const o=document.createElement("div");o.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),n.classList.contains("btn-sm")&&r.classList.add("btn-sm"),n.classList.contains("compact-select")&&(s.classList.add("compact-select"),r.classList.add("compact-select"));const l=n.selectedIndex>=0?n.options[n.selectedIndex]:n.options.length>0?n.options[0]:null;r.innerHTML=`<span>${l?l.text:"Select..."}</span>`;const i=document.createElement("div");i.classList.add("custom-options"),Array.from(n.options).forEach(d=>{const p=document.createElement("div");p.classList.add("custom-option"),p.textContent=d.text,p.dataset.value=d.value,d.selected&&p.classList.add("selected"),p.addEventListener("click",()=>{n.value=p.dataset.value,n.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${p.textContent}</span>`,i.querySelectorAll(".custom-option").forEach(u=>u.classList.remove("selected")),p.classList.add("selected"),o.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width=""}),i.appendChild(p)}),o.appendChild(r),o.appendChild(i),s.appendChild(o),(()=>{document.querySelectorAll("body > .custom-options").forEach(d=>{d._owner&&!document.body.contains(d._owner)&&d.remove()})})(),r.addEventListener("click",d=>{d.stopPropagation();const p=o.classList.contains("open");if(document.querySelectorAll(".custom-select.open").forEach(u=>{u!==o&&(u.classList.remove("open"),u.customOptions&&(u.customOptions.classList.remove("show"),u.customOptions.parentElement===document.body&&u.appendChild(u.customOptions),u.customOptions.style.position="",u.customOptions.style.top="",u.customOptions.style.left="",u.customOptions.style.width="",u.customOptions.style.margin=""))}),p)o.classList.remove("open"),i.classList.remove("show"),i.parentElement===document.body&&o.appendChild(i),i.style.position="",i.style.top="",i.style.left="",i.style.width="",i.style.margin="";else{o.classList.add("open"),document.body.appendChild(i),i.classList.add("show");const u=o.getBoundingClientRect();i.style.position="fixed",i.style.top=`${u.bottom+4}px`,i.style.left=`${u.left}px`,i.style.width=`${u.width}px`,i.style.zIndex="9999",i.style.margin="0"}}),n.style.display="none",o.customOptions=i,i._owner=o}),document.addEventListener("click",n=>{n.target.closest(".custom-select")||t()}),document.addEventListener("scroll",n=>{n.target.closest&&n.target.closest(".custom-options")||t()},!0);function t(){document.querySelectorAll(".custom-select.open").forEach(n=>{n.classList.remove("open");const s=n.customOptions||n.querySelector(".custom-options");s&&(s.classList.remove("show"),s.parentElement===document.body&&n.appendChild(s),s.style.position="",s.style.top="",s.style.left="",s.style.width="",s.style.margin="")})}}const kn="modulepreload",$n=function(e){return"/"+e},gt={},ft=function(t,n,s){let o=Promise.resolve();if(n&&n.length>0){let l=function(d){return Promise.all(d.map(p=>Promise.resolve(p).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),c=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));o=l(n.map(d=>{if(d=$n(d),d in gt)return;gt[d]=!0;const p=d.endsWith(".css"),u=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const g=document.createElement("link");if(g.rel=p?"stylesheet":kn,p||(g.as="script"),g.crossOrigin="",g.href=d,c&&g.setAttribute("nonce",c),document.head.appendChild(g),p)return new Promise((y,m)=>{g.addEventListener("load",y),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(l){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=l,window.dispatchEvent(i),!i.defaultPrevented)throw l}return o.then(l=>{for(const i of l||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};let A,X,Q,Z,ce=[],je,fe=!1;const yt=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function ht(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function Bn(){this.x=Math.random()*Q,this.y=Math.random()*Z-Z,this.r=ht(10,30),this.d=Math.random()*150+10,this.color=yt[ht(0,yt.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return X.beginPath(),X.lineWidth=this.r/2,X.strokeStyle=this.color,X.moveTo(this.x+this.tilt+this.r/4,this.y),X.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),X.stroke()}}function Et(){if(fe){X.clearRect(0,0,Q,Z);for(let e=0;e<ce.length;e++)ce[e].draw();Cn(),je=requestAnimationFrame(Et)}}function Cn(){for(let e=0;e<ce.length;e++){const t=ce[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>Q+20||t.x<-20||t.y>Z)&&fe&&(t.x=Math.random()*Q,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Ln(){if(!fe){A||(A=document.createElement("canvas"),A.id="confetti-canvas",A.style.position="fixed",A.style.top="0",A.style.left="0",A.style.width="100%",A.style.height="100%",A.style.pointerEvents="none",A.style.zIndex="9999",document.body.appendChild(A),X=A.getContext("2d")),Q=window.innerWidth,Z=window.innerHeight,A.width=Q,A.height=Z,window.addEventListener("resize",()=>{Q=window.innerWidth,Z=window.innerHeight,A.width=Q,A.height=Z}),fe=!0,ce=[];for(let e=0;e<150;e++)ce.push(new Bn);Et()}}function En(){fe=!1,X&&X.clearRect(0,0,Q,Z),je&&cancelAnimationFrame(je),A&&A.remove(),A=null}function In(){Ln(),setTimeout(En,5e3)}function z(e,t,n="Confirm",s,o=!1,r=null,l=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const c=document.createElement("div");c.className="modal-overlay confirm-modal",c.style.display="flex";const d=o?"btn btn-danger":"btn btn-primary";c.innerHTML=`
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
          <button class="${d}" id="modalConfirmBtn" style="flex: 1;">${n}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(c),setTimeout(()=>c.classList.add("visible"),10);const p=c.querySelector(".modal");p&&p.addEventListener("click",f=>f.stopPropagation());const u=c.querySelector("#modalCancelBtn"),g=c.querySelector("#modalConfirmBtn"),y=c.querySelector("#modalSecondaryBtn"),m=()=>c.remove();u&&u.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),m()}),g&&g.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),m(),s()}),y&&l&&y.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),m(),l()}),c.addEventListener("click",f=>{f.target===c&&m()})}function Pe(e,t,n,s="",o="text"){const r=document.querySelector(".input-modal");r&&r.remove();const l=document.createElement("div");l.className="modal-overlay input-modal",l.style.display="flex";const i=s?`<p class="modal-hint" style="margin-bottom: var(--space-md); text-align: left;">${s}</p>`:"",c=o==="textarea"?`<textarea id="modalInput" class="form-input" placeholder="${t}" style="width: 100%; min-height: 120px; resize: vertical;"></textarea>`:`<input type="text" id="modalInput" class="form-input" placeholder="${t}" style="width: 100%;">`;l.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        ${i}
        <div class="form-group">
          ${c}
        </div>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: 10px;">
        <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Add</button>
      </div>
    </div>
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const d=l.querySelector("#modalInput"),p=l.querySelector("#modalCancelBtn"),u=l.querySelector("#modalConfirmBtn"),g=()=>l.remove();p.onclick=g;const y=()=>{const m=d.value;m&&m.trim()&&(g(),n(m.trim()))};u.onclick=y,d.onkeydown=m=>{m.key==="Enter"&&y(),m.key==="Escape"&&g()},setTimeout(()=>d.focus(),100)}function It(e){const t=document.querySelector(".final-modal");t&&t.remove();const n=o=>o===0?"🥇":o===1?"🥈":o===2?"🥉":`${o+1}.`,s=document.createElement("div");s.className="final-modal",s.innerHTML=`
    <div class="final-modal-content">
      <h2>Tournament Complete!</h2>
      <div class="final-standings">
        ${e.map((o,r)=>`
          <div class="final-standing-row ${r<3?"top-three":""}">
            <span class="medal">${n(r)}</span>
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
  `,document.body.appendChild(s),In(),setTimeout(()=>s.classList.add("visible"),10)}function Pn(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function _e(e,t,n){const s=document.querySelector(".alert-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay alert-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const r=o.querySelector(".modal");r&&r.addEventListener("click",c=>c.stopPropagation());const l=o.querySelector("#modalOkBtn"),i=()=>{o.remove()};l&&l.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),i()}),o.addEventListener("click",c=>{c.target===o&&i()}),o.addEventListener("click",c=>{c.target===o&&i()})}function K(e,t){const n=document.querySelector(".info-modal");n&&n.remove();const s=document.createElement("div");s.className="modal-overlay info-modal",s.style.display="flex",s.innerHTML=`
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
  `,document.body.appendChild(s),setTimeout(()=>s.classList.add("visible"),10);const o=s.querySelector(".modal");o&&o.addEventListener("click",c=>c.stopPropagation());const r=s.querySelector("#modalOkBtn"),l=s.querySelector("#modalCloseX"),i=()=>s.remove();r&&(r.onclick=i),l&&(l.onclick=i),s.addEventListener("click",c=>{c.target===s&&i()})}function Mn(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',t.style.cursor="pointer",document.body.appendChild(t);let n=!1,s=null;const o=()=>{n||(n=!0,s&&clearTimeout(s),t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},100))};t.addEventListener("click",o),requestAnimationFrame(()=>{t.classList.add("active")});const r=t.querySelector(".countdown-number"),l=["3","2","1","GO!"];let i=0;const c=()=>{if(n)return;if(i>=l.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const d=l[i];r.textContent=d,r.className="countdown-number"+(d==="GO!"?" countdown-go":""),r.style.animation="none",requestAnimationFrame(()=>{r.style.animation=""}),i++,s=setTimeout(c,d==="GO!"?600:800)};s=setTimeout(c,100)})}window.closeFinalModal=Pn;function Ce(e){if(!e.trim())return!1;const t=e.trim();return a.players.length>=24?(w("Maximum 24 players allowed"),!1):a.players.some(n=>n.name.toLowerCase()===t.toLowerCase())?(w(`Player "${t}" already exists`),!1):(a.players.push({id:ye(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),a.players.length%4===0&&(a.courts=a.players.length/4),k(),!0)}function Pt(e){a.players=a.players.filter(t=>t.id!==e),k()}function Mt(e){if(console.log("removeAllPlayers called, players:",a.players.length),a.players.length===0){console.log("No players to remove");return}z("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),a.players=[],a.preferredPartners=[],k(),console.log("Players cleared, state:",a.players),e&&e()},!0)}function Tt(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(l=>l.trim()).filter(l=>l);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let n=0,s=0,o=!1;for(const l of t){if(a.players.length>=24){o=!0;break}if(a.players.some(i=>i.name.toLowerCase()===l.toLowerCase())){s++;continue}a.players.push({id:ye(),name:l,points:0,wins:0,losses:0,pointsLost:0,played:0}),n++}const r=Math.floor(a.players.length/4);return r>a.courts&&(a.courts=r),k(),{added:n,duplicates:s,hitLimit:o}}function Tn(e){const t={id:ye(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return a.players.push(t),a.leaderboard.push(t),k(),!0}function At(){const e=new Set;return a.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),a.players.filter(t=>!e.has(t.id))}function An(){const e=At();e.length<2||(a.preferredPartners.push({id:ye(),player1Id:e[0].id,player2Id:e[1].id}),k())}function at(e){a.preferredPartners=a.preferredPartners.filter(t=>t.id!==e),k()}function Rt(e,t,n){const s=a.preferredPartners.find(o=>o.id===e);s&&(t===1?s.player1Id=n:s.player2Id=n,k())}const zt={format:{label:"Format",type:"select",options:[{value:"americano",label:"Americano"},{value:"mexicano",label:"Mexicano"},{value:"team",label:"Team Americano"},{value:"teamMexicano",label:"Team Mexicano"}],helpId:"helpFormat"},courts:{label:"Courts",type:"number",min:1,max:50},scoringMode:{label:"Scoring",type:"select",options:[{value:"total",label:"Total Points"},{value:"race",label:"Race to"},{value:"time",label:"Timed"}],helpId:"helpScoring"},pointsPerMatch:{label:"Points",type:"number",min:4,max:50},maxRepeats:{label:"Repeats",type:"select",options:[{value:0,label:"No repeats"},{value:1,label:"Max 1x"},{value:2,label:"Max 2x"},{value:3,label:"Max 3x"},{value:99,label:"Unlimited"}],mexicanoOnly:!0,helpId:"helpMatchup"},pairingStrategy:{label:"Pairing",type:"select",options:[{value:"optimal",label:"Optimal"},{value:"oneThree",label:"1&3 vs 2&4"},{value:"oneTwo",label:"1&2 vs 3&4"},{value:"oneFour",label:"1&4 vs 2&3"}],mexicanoOnly:!0,helpId:"helpMatchup"},strictStrategy:{label:"Prioritize Pattern",type:"toggle",mexicanoOnly:!0,helpId:"helpMatchup"}};function vt(){return a.scoringMode==="time"?"Minutes":a.scoringMode==="race"?"Race to":"Total Points"}function D(){var r,l;const e=document.getElementById("tournamentConfig");if(!e)return;qn(e),e.style.display="block",a.format==="team"||a.format;const t=a.format==="mexicano"||a.format==="teamMexicano",n=((r=a.players)==null?void 0:r.length)||0,s=Math.max(1,Math.floor(n/4));a.courts>s&&(a.courts=s,k()),a.pointsPerMatch<4?(a.pointsPerMatch=4,k()):a.pointsPerMatch>50&&(a.pointsPerMatch=50,k());let o='<div class="config-grid">';if(o+=J("format",a.format),t?(o+='<div class="config-spacer"></div>',o+=J("scoringMode",a.scoringMode),o+=J("pointsPerMatch",a.pointsPerMatch,{label:vt()}),o+=J("maxRepeats",a.maxRepeats),o+=J("courts",a.courts),o+=J("pairingStrategy",a.pairingStrategy),o+=J("strictStrategy",a.strictStrategy,{disabled:a.pairingStrategy==="optimal"}),a.pairingStrategy!=="optimal"&&a.strictStrategy&&a.maxRepeats===0&&(o+=`
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `)):(o+=J("courts",a.courts),o+=J("scoringMode",a.scoringMode),o+=J("pointsPerMatch",a.pointsPerMatch,{label:vt()})),o+="</div>",t&&((l=a.preferredPartners)==null?void 0:l.length)>0){const i=a.preferredPartners.map(c=>{const d=a.players.find(u=>u.id===c.player1Id),p=a.players.find(u=>u.id===c.player2Id);return d&&p?`${d.name} & ${p.name}`:null}).filter(Boolean);i.length>0&&(o+=`
        <div class="config-pairs-section">
          <div class="config-pairs-header">
            <span class="config-pairs-label">Fixed Pairs:</span>
            <button class="btn btn-ghost btn-sm" data-action="edit-pairs">Edit</button>
          </div>
          <ul class="config-pairs-bullet-list">
            ${i.map(c=>`<li>${c}</li>`).join("")}
          </ul>
        </div>
      `)}else t&&(o+=`
      <div class="config-pairs-section config-pairs-empty">
        <button class="btn btn-dashed btn-sm" data-action="add-pair">+ Add Fixed Pair</button>
      </div>
    `);e.innerHTML=o}function Rn(e,t,n){const s=n.options.find(r=>String(r.value)===String(t)),o=s?s.label:t;return`
    <div class="ui-select-wrapper" data-key="${e}" tabindex="0">
      <div class="ui-trigger">
        <span>${o}</span>
        <div class="ui-arrow"></div>
      </div>
      <div class="ui-options">
        ${n.options.map(r=>`<div class="ui-option ${String(r.value)===String(t)?"selected":""}" data-value="${r.value}">${r.label}</div>`).join("")}
      </div>
    </div>
  `}function zn(e,t,n){const s=n.min??1,o=n.max??99,r=Number.isFinite(t)?t:s,l=r<=s,i=r>=o,c=e==="pointsPerMatch"&&a.scoringMode!=="time"?2:1;return`
    <div class="ui-stepper" data-key="${e}" data-min="${s}" data-max="${o}">
      <button type="button" class="stepper-btn" data-delta="-${c}" ${l?"disabled":""} aria-label="Decrease ${e}">−</button>
      <input type="number" class="stepper-input" value="${r}" min="${s}" max="${o}" step="${c}" aria-label="${e} value">
      <button type="button" class="stepper-btn" data-delta="${c}" ${i?"disabled":""} aria-label="Increase ${e}">+</button>
    </div>
  `}function Nn(e,t,n={}){const s=!!t,o=!!n.disabled;return`
    <div class="ui-toggle ${s?"active":""} ${o?"disabled":""}" 
         data-key="${e}" 
         role="switch" 
         aria-checked="${s}"
         tabindex="${o?"-1":"0"}">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  `}function We(e){var n;const t={...zt[e]};if(e==="courts"){const s=((n=a.players)==null?void 0:n.length)||0,o=Math.floor(s/4);t.max=Math.max(1,o)}return t}function J(e,t,n={}){const s=We(e),o=n.readonly,r=n.label??(s==null?void 0:s.label)??e;let l="";if(!s||o){let i=t;if(s&&s.options){const c=s.options.find(d=>d.value===t);c&&(i=c.label)}l=`<span class="config-value-static">${i}</span>`}else s.type==="select"?l=Rn(e,t,s):s.type==="number"?l=zn(e,t,s):s.type==="toggle"?l=Nn(e,t,n):l=`<span class="config-value">${t}</span>`;return`
    <div class="config-row ${(s==null?void 0:s.type)==="toggle"?"toggle-row":""}" data-config-key="${e}">
      <div class="config-label-container">
        <span class="config-label">${r}:</span>
        ${s!=null&&s.helpId?`<button class="config-help" data-action="show-help" data-help-id="${s.helpId}">?</button>`:""}
      </div>
      ${l}
    </div>
  `}function Ne(e,t){a[e]=t,k();const n=T();if(e==="format"&&n.format&&(n.format.value=t),e==="courts"&&n.courts&&(n.courts.value=t),e==="scoringMode"&&n.scoringMode){n.scoringMode.value=t;const s={time:10,race:14,total:28};a.pointsPerMatch=s[t]||28,n.points&&(n.points.value=a.pointsPerMatch)}e==="pointsPerMatch"&&n.points&&(n.points.value=t),e==="maxRepeats"&&n.maxRepeats&&(n.maxRepeats.value=t),e==="pairingStrategy"&&n.pairingStrategy&&(n.pairingStrategy.value=t,t==="optimal"&&(a.strictStrategy=!1)),e==="strictStrategy"&&document.getElementById("strictStrategy")&&(document.getElementById("strictStrategy").checked=t),D(),ft(()=>Promise.resolve().then(()=>On),void 0).then(s=>s.renderPlayers&&s.renderPlayers()),e==="format"&&ft(()=>Promise.resolve().then(()=>Zn),void 0).then(s=>s.updateSetupUI&&s.updateSetupUI())}function qn(e){if(e.dataset.listenersAttached){console.log("Tournament Config: Listeners already attached");return}e.dataset.listenersAttached="true",console.log("Tournament Config: Attaching listeners to",e),e.addEventListener("change",t=>{var s;console.log("Tournament Config: Change event",t.target);const n=t.target;if(n.classList.contains("config-input")||n.classList.contains("stepper-input")){const o=n.closest(".ui-stepper"),r=n.dataset.key||(o==null?void 0:o.dataset.key);if(!r)return;const l=We(r),i=(l==null?void 0:l.min)??1,c=(l==null?void 0:l.max)??99;let d=parseInt(n.value,10);isNaN(d)&&(d=i),r==="courts"&&d>c&&_e("Too many courts",`You need at least ${d*4} players to use ${d} courts. With ${((s=a.players)==null?void 0:s.length)||0} players, you can have a maximum of ${c} courts.`)}}),e.addEventListener("click",t=>{console.log("Tournament Config: Click event",t.target);const n=t.target.closest(".stepper-btn");if(n){const c=n.closest(".ui-stepper"),d=c==null?void 0:c.dataset.key;if(!d)return;const p=We(d),u=parseInt(n.dataset.delta,10)||0,g=(p==null?void 0:p.min)??1,y=(p==null?void 0:p.max)??99,m=parseInt(a[d],10);if(u>0&&m>=y&&d==="courts"){_e("Too many courts",`You need at least ${(m+1)*4} players to use ${m+1} courts.`);return}const f=Math.min(y,Math.max(g,(Number.isFinite(m)?m:g)+u));f!==m&&Ne(d,f);return}const s=t.target.closest(".ui-toggle");if(s&&!s.classList.contains("disabled")){const c=s.dataset.key,d=!a[c];Ne(c,d);return}const o=t.target.closest(".ui-select-wrapper");if(o&&!t.target.closest(".ui-option")){const c=o.classList.contains("open");if(document.querySelectorAll(".ui-select-wrapper.open").forEach(d=>{d.classList.remove("open");const p=d.querySelector(".ui-options");p&&(p.style.display="none"),d.closest(".config-row")&&(d.closest(".config-row").style.zIndex="")}),!c){o.classList.add("open");const d=o.querySelector(".ui-options");d&&(d.style.display="block"),o.closest(".config-row")&&(o.closest(".config-row").style.zIndex="100")}}const r=t.target.closest(".ui-option");if(r){const c=r.closest(".ui-select-wrapper"),d=r.dataset.value,p=c.dataset.key,u=zt[p];let g=d;(u.type==="number"||p==="courts"||p==="maxRepeats"||p==="pointsPerMatch")&&!isNaN(d)&&d.trim()!==""&&(g=parseInt(d)),Ne(p,g)}const l=t.target.closest("[data-action]");if(!l)return;const i=l.dataset.action;if(i==="show-help"){const c=l.dataset.helpId,d=document.getElementById(c);d&&d.click()}if(i==="edit-pairs"||i==="add-pair"){if(i==="add-pair")try{const c=new Set;if(a.preferredPartners&&a.preferredPartners.forEach(p=>{c.add(String(p.player1Id)),c.add(String(p.player2Id))}),a.players.filter(p=>!c.has(String(p.id))).length<2){w("Not enough available players to form a pair","error");return}}catch(c){console.error("Validation error:",c)}Fn()}})}function Hn(e){e.target.closest(".ui-select-wrapper")||document.querySelectorAll(".ui-select-wrapper.open").forEach(t=>{t.classList.remove("open");const n=t.querySelector(".ui-options");n&&(n.style.display="none"),t.closest(".config-row")&&(t.closest(".config-row").style.zIndex="")})}function Fn(){a.preferredPartners||(a.preferredPartners=[]);const e=document.createElement("div");e.className="modal-overlay active",e.style.display="flex";const t=(v,x)=>String(v)===String(x),n=v=>a.players.find(x=>t(x.id,v)),s=v=>a.preferredPartners.find(x=>t(x.id,v));let o=null,r=null;const l=`
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
  `,document.body.appendChild(e);const i=v=>{v.key==="Escape"&&d()};document.addEventListener("keydown",i);const c=()=>document.removeEventListener("keydown",i),d=()=>{c(),e.remove()},p=e.querySelector("#sel1"),u=e.querySelector("#sel2"),g=e.querySelector("#addBtn"),y=e.querySelector("#pairsList"),m=(v,x,$)=>{const B=a.players.find(M=>t(M.id,x)),h=B?B.name:$;let C=`
      <div class="select-trigger ${!!B?"filled":""}">
        <span>${h}</span>
        <span class="select-arrow">▼</span>
      </div>
      <div class="select-options">
    `;const L=new Set;a.preferredPartners.forEach(M=>{M.player1Id&&L.add(String(M.player1Id)),M.player2Id&&L.add(String(M.player2Id))}),a.players.forEach(M=>{const O=String(M.id),oe=t(M.id,x);if(L.has(O)&&!oe)return;const P=v.id==="sel1"&&t(M.id,r)||v.id==="sel2"&&t(M.id,o);C+=`<div class="option ${oe?"selected":""} ${P?"disabled":""}" data-val="${M.id}">${M.name}</div>`}),C+="</div>",v.innerHTML=C},f=()=>{if(a.preferredPartners.length===0){y.innerHTML='<div style="text-align: center; padding: 2rem; color: #52525b;">No fixed pairs yet</div>';return}y.innerHTML=a.preferredPartners.map(v=>{const x=a.players.find(B=>t(B.id,v.player1Id)),$=a.players.find(B=>t(B.id,v.player2Id));return!x||!$?"":`
        <div class="pair-item-clean">
          <span class="pair-names">${x.name} & ${$.name}</span>
          <div class="pair-remove-icon" data-remove="${String(v.id)}">✕</div>
        </div>
      `}).join("")},b=()=>{m(p,o,"Select Player 1"),m(u,r,"Select Player 2"),f(),o&&r&&!t(o,r)?(g.classList.add("ready"),g.disabled=!1):(g.classList.remove("ready"),g.disabled=!0)};b(),e.addEventListener("click",v=>{if(v.target===e||v.target.id==="closePairsModal"){d();return}v.target.closest(".custom-select")||(e.querySelectorAll(".select-options").forEach(h=>h.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(h=>h.classList.remove("active")));const x=v.target.closest(".select-trigger");if(x){const S=x.parentElement.querySelector(".select-options"),C=S.classList.contains("open");e.querySelectorAll(".select-options").forEach(L=>L.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(L=>L.classList.remove("active")),C||(S.classList.add("open"),x.classList.add("active"))}const $=v.target.closest(".option");if($){const h=$.dataset.val,S=n(h);if(S){const C=$.closest(".custom-select").id;C==="sel1"&&(o=S.id),C==="sel2"&&(r=S.id),b(),e.querySelectorAll(".select-options").forEach(L=>L.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(L=>L.classList.remove("active"))}}if(v.target.closest("#addBtn")&&!g.disabled){if(a.preferredPartners.some(C=>t(C.player1Id,o)&&t(C.player2Id,r)||t(C.player1Id,r)&&t(C.player2Id,o))){alert("Pair already exists");return}if(a.preferredPartners.some(C=>t(C.player1Id,o)||t(C.player2Id,o)||t(C.player1Id,r)||t(C.player2Id,r))&&!confirm("One of these players is already in another pair. Create anyway?"))return;a.preferredPartners.push({id:ye(),player1Id:o,player2Id:r}),k(),o=null,r=null,b(),D()}const B=v.target.closest(".pair-remove-icon");if(B){const h=B.dataset.remove,S=s(h);S&&(at(S.id),b(),D())}})}document.addEventListener("click",Hn);function qe(e,t,n={}){const{isTeam:s=!1,showSkill:o=!1,showSide:r=!1,onRemove:l=null,onToggleSide:i=null}=n,c=typeof e=="string"?e:e.name,d=e.skill||0,p=e.side||null;let u="";r&&(u=`
      <label class="side-toggle" data-index="${t}" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.75rem; margin: 0 8px;">
        <span style="color: ${p!=="B"?"var(--accent)":"var(--text-muted)"}; font-weight: ${p!=="B"?"600":"400"};">A</span>
        <div class="toggle-track" style="width: 28px; height: 16px; background: ${p==="B"?"var(--warning)":"var(--accent)"}; border-radius: 8px; position: relative;">
          <div class="toggle-thumb" style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: ${p==="B"?"14px":"2px"}; transition: left 0.2s;"></div>
        </div>
        <span style="color: ${p==="B"?"var(--warning)":"var(--text-muted)"}; font-weight: ${p==="B"?"600":"400"};">B</span>
      </label>
    `);let g="";if(o)if(n.editableSkill){const y=Array.from({length:11},(m,f)=>{const b=f;return`<option value="${b}" ${d===b?"selected":""}>${f===0?"-":f}</option>`}).join("");g=`
        <select class="form-select wc-skill-select compact-select skill-select" data-action="update-skill" data-index="${t}" style="margin-left:8px; width:50px; padding-right: 20px;">
          ${y}
        </select>
      `}else g=`<span class="player-skill">${d===0?"-":d}</span>`;return`
    <li class="player-item slide-in-up" data-index="${t}" style="animation-duration: 0.3s;">
      <span class="player-number">${t+1}.</span>
      <span class="player-name text-truncate" title="${c}">${c}</span>
      
      ${u}
      ${g}
      
      <button class="player-remove" data-index="${t}" title="Remove">×</button>
    </li>
  `}function _(){const e=T();if(e.playerList.innerHTML=a.players.map((t,n)=>{const s=['<option value="">Auto</option>'];for(let o=1;o<=a.courts;o++){const r=t.lockedCourt===o?"selected":"";s.push(`<option value="${o}" ${r}>Court ${o}</option>`)}return`
    <li class="player-item slide-in-up" data-id="${t.id}" style="animation-duration: 0.3s;">
      <span class="player-number">${n+1}.</span>
      <span class="player-name text-truncate" title="${t.name}">${t.name}</span>
      
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
  `}).join(""),window.updatePlayerCourtLock||(window.updatePlayerCourtLock=(t,n)=>{const s=a.players.find(o=>o.id===t);s&&(s.lockedCourt=n?parseInt(n):null,k())}),e.playerCount.textContent=`(${a.players.length})`,e.generateBtn.disabled=a.players.length<4,a.players.length>=4){const t=a.players.length%4===0,n=a.courts*4,s=a.players.length>n;if(!t||s){const o=s?`exceeds capacity for ${a.courts} court${a.courts>1?"s":""}`:`uneven number for ${a.courts} court${a.courts>1?"s":""}`;e.playersHint.textContent=`${a.players.length} players ready! Since it ${o}, a queue system will be applied.`,e.playersHint.style.color="var(--warning)"}else e.playersHint.textContent=`${a.players.length} players ready`,e.playersHint.style.color="var(--success)"}else e.playersHint.textContent=`Add at least ${4-a.players.length} more player${4-a.players.length>1?"s":""}`,e.playersHint.style.color="";ee(),Lt(),Dn(),Oe(),Oe(),ae(),D()}function Nt(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("genPlayerList")||document.getElementById("playerList"),n=document.getElementById("genExpandBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t&&t.style.setProperty("max-height","400px","important"),n.innerHTML=`Show All Players (${a.players.length}) ▼`):(e.classList.add("expanded"),t&&t.style.setProperty("max-height","2000px","important"),n.innerHTML="Show Less ▲")}function Dn(){let e=document.getElementById("genExpandBtn");e||(console.warn("genExpandBtn not found by ID, trying querySelector"),e=document.querySelector("#playerListWrapper .btn"));const t=document.getElementById("playerListWrapper");if(!e){console.error("Expand button STILL not found");return}console.log("Found expand button:",e),a.players.length<=8?e.style.display="none":(e.style.setProperty("display","block","important"),t!=null&&t.classList.contains("expanded")||(e.innerHTML=`Show All Players (${a.players.length}) ▼`))}function ot(){const e=T();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function ne(){const e=T();e.importModal.style.display="none"}const On=Object.freeze(Object.defineProperty({__proto__:null,hideImportModal:ne,renderPlayers:_,showImportModal:ot,togglePlayerList:Nt},Symbol.toStringTag,{value:"Module"}));let Ge=!1;function Me(){const e=T(),t=a.gridColumns,n=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),n.forEach(s=>{s.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),n.forEach(s=>{s.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function Te(){var s;const e=((s=document.getElementById("scoringMode"))==null?void 0:s.value)||a.scoringMode,t=document.getElementById("scoringValueLabel"),n=document.getElementById("points");!t||!n||(e==="total"?(t.textContent="Points",n.value=24):e==="race"?(t.textContent="Target",n.value=21):e==="time"&&(t.textContent="Minutes",n.value=12))}function jn(){const e=T();e.gridColumns&&(e.gridColumns.max=6)}function _n(){const e=document.querySelector(".matches-grid");if(!e)return a.maxCourts||2;const t=e.offsetWidth,s=Math.floor(t/180),o=a.maxCourts||a.courts||2;return Math.min(Math.max(s,1),o)}function qt(){const e=T();if(Ge||a.gridColumns!==0)return;const t=_n();document.querySelectorAll(".matches-grid").forEach(s=>{s.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function Wn(){const e=T(),t=parseInt(e.gridColumns.value);t===0?(Ge=!1,qt()):Ge=!0,a.gridColumns=t,Me(),k()}function Ht(){const e=T(),t=a.textSize,n=t/100,s=document.getElementById("scheduleSection");s&&s.style.setProperty("--text-scale",n),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function Gn(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(a.roundScale=parseInt(e.value)/100,k());const n=a.roundScale||1,s=document.getElementById("roundsContainer");s&&s.style.setProperty("--card-scale",n),e&&(e.value=Math.round(n*100)),t&&(t.textContent=`${Math.round(n*100)}%`)}function Ft(){return[...a.leaderboard].sort((e,t)=>{switch(a.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const n=e.played>0?e.wins/e.played:0,s=t.played>0?t.wins/t.played:0;return Math.abs(s-n)>.001?s-n:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const o=e.points+e.pointsLost,r=t.points+t.pointsLost,l=o>0?e.points/o:0,i=r>0?t.points/r:0;return Math.abs(i-l)>.001?i-l:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function U(){const e=T(),t=document.getElementById("toggleVisibilityBtn");t&&(a.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const n=document.getElementById("togglePositionBtn");if(n&&(a.showPositionChanges?(n.innerHTML="Ranks",n.classList.add("toggle-on"),n.classList.remove("toggle-off")):(n.innerHTML="Ranks",n.classList.add("toggle-off"),n.classList.remove("toggle-on")),n.title="Click to toggle rank change indicators"),!a.leaderboard||a.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const s=!a.hideLeaderboard,o=a.showPositionChanges,r=!s&&!o,l=Ft();l.forEach((c,d)=>{const p=d+1,u=c.previousRank||p;c.rankChange=u-p});let i=r?[...l].sort(()=>Math.random()-.5):l;e.leaderboardBody.innerHTML=i.map((c,d)=>{const p=l.findIndex(h=>h.id===c.id)+1,u=r?"-":p;let g="";o&&c.played>0&&!r&&(c.rankChange>0?g='<span class="rank-up">▲</span>':c.rankChange<0?g='<span class="rank-down">▼</span>':g='<span class="rank-same">-</span>');const y=c.points-(c.pointsLost||0),m=c.played>0?Math.round((c.wins||0)/c.played*100)+"%":"0%",f=y>0?"+":"",b=s?c.points:"-",v=s?c.wins||0:"-",x=s?`<span class="${y>0?"text-success":y<0?"text-error":""}">${f}${y}</span>`:"-",$=s?m:"-",B=s||o?c.played:"-";return`
    <tr>
      <td>${u} ${g}</td>
      <td class="player-name-cell">${c.name}</td>
      <td class="font-bold">${b}</td>
      <td>${v}</td>
      <td>${x}</td>
      <td>${$}</td>
      <td>${B}</td>
    </tr>
  `}).join("")}function Dt(){a.hideLeaderboard=!a.hideLeaderboard,U()}function Ot(){a.showPositionChanges=!a.showPositionChanges,U()}function jt(e){a.rankingCriteria=e,U()}function Un(){const e=[...a.players],t=e.length,n=a.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const s=e.length,o=[],r=e[0],l=e.slice(1);for(let i=0;i<s-1;i++){const c=[r,...l],d=[];for(let f=0;f<s/2;f++){const b=c[f],v=c[s-1-f];!b.isBye&&!v.isBye&&d.push([b,v])}const p=[],u=new Set;for(let f=0;f<d.length-1;f+=2)d[f]&&d[f+1]&&(p.push({court:Math.floor(f/2)+1,team1:d[f],team2:d[f+1]}),d[f].forEach(b=>u.add(b.id)),d[f+1].forEach(b=>u.add(b.id)));const g=p.slice(0,n),y=new Set;g.forEach(f=>{f.team1.forEach(b=>y.add(b.id)),f.team2.forEach(b=>y.add(b.id))});const m=a.players.filter(f=>!f.isBye&&!y.has(f.id));g.length>0&&o.push({number:o.length+1,matches:g,byes:m}),l.unshift(l.pop())}return o}function Vn(){const e=[...a.players],t=e.length,n=a.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const s=e.length,o=[],r=e[0],l=e.slice(1);for(let i=0;i<s-1;i++){const c=[r,...l],d=[],p=new Set;for(let m=0;m<s/2;m++){const f=c[m],b=c[s-1-m];!f.isBye&&!b.isBye&&(d.push({court:d.length+1,team1:[f],team2:[b]}),p.add(f.id),p.add(b.id))}const u=d.slice(0,n),g=new Set;u.forEach(m=>{m.team1.forEach(f=>g.add(f.id)),m.team2.forEach(f=>g.add(f.id))});const y=a.players.filter(m=>!m.isBye&&!g.has(m.id));u.length>0&&o.push({number:o.length+1,matches:u,byes:y}),l.unshift(l.pop())}return o}function Yn(){const e=[...a.players];ke(e);const t=a.courts,n=[],s=new Set;for(let r=0;r<e.length-1&&n.length<t;r+=2)n.push({court:n.length+1,team1:[e[r]],team2:[e[r+1]]}),s.add(e[r].id),s.add(e[r+1].id);const o=e.filter(r=>!s.has(r.id));return[{number:1,matches:n,byes:o}]}function Jn(){const e=[...a.leaderboard].sort((i,c)=>c.points-i.points),t=a.courts,n=e.filter(i=>!a.manualByes.includes(i.id)),s=e.filter(i=>a.manualByes.includes(i.id)),o=[],r=new Set;for(let i=0;i<n.length-1&&o.length<t;i+=2)o.push({court:o.length+1,team1:[n[i]],team2:[n[i+1]]}),r.add(n[i].id),r.add(n[i+1].id);const l=[...s,...n.filter(i=>!r.has(i.id))];return{number:a.schedule.length+1,matches:o,byes:l}}function Xn(){const e=a.courts,t=e*4,n=[],s=new Set,o=[...a.players],r=[];o.forEach(m=>{if(s.has(m.id))return;const f=_t(m.id);if(f){const b=o.find(v=>v.id===f);b?(n.push({type:"pair",players:[m,b]}),s.add(b.id)):n.push({type:"single",players:[m]})}else n.push({type:"single",players:[m]});s.add(m.id)}),ke(n);const l=[];let i=0;for(const m of n)i+m.players.length<=t?(l.push(m),i+=m.players.length):r.push(...m.players);const c=[],d=[];l.forEach(m=>{m.type==="pair"?c.push(m.players):d.push(m.players[0])}),ke(d);for(let m=0;m<d.length-1;m+=2)c.push([d[m],d[m+1]]);ke(c);const p=[],u=new Set,g=[],y=[];for(let m=0;m<c.length-1;m+=2){const f=c[m],b=c[m+1],v=[...f,...b].find(x=>x.lockedCourt);v?g.push({team1:f,team2:b,lockedCourt:v.lockedCourt}):y.push({team1:f,team2:b})}return g.forEach(m=>{if(p.length>=e)return;let f=m.lockedCourt;(u.has(f)||f>e)&&(f=null),f?(u.add(f),p.push({court:f,team1:m.team1,team2:m.team2})):y.push({team1:m.team1,team2:m.team2})}),y.forEach(m=>{if(p.length>=e)return;let f=1;for(;u.has(f);)f++;f<=e&&(u.add(f),p.push({court:f,team1:m.team1,team2:m.team2}))}),p.sort((m,f)=>m.court-f.court),c.length%2!==0&&p.length<c.length/2&&r.push(...c[c.length-1]),[{number:1,matches:p,byes:r}]}function _t(e){if(!a.preferredPartners)return null;const t=a.preferredPartners.find(n=>n.player1Id===e||n.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function Kn(e){const t=a.courts,n=t*4,s=new Set(a.manualByes),o=[],r=new Set,l=[...e];l.forEach(h=>{if(r.has(h.id)||s.has(h.id))return;const S=_t(h.id);if(S){const C=l.find(L=>L.id===S);C?s.has(C.id)?o.push({type:"single",players:[h]}):(o.push({type:"pair",players:[h,C]}),r.add(C.id)):o.push({type:"single",players:[h]})}else o.push({type:"single",players:[h]});r.add(h.id)}),o.sort((h,S)=>{const C=O=>{const oe=O.players.reduce((V,P)=>V+(P.byeCount||0),0),ue=O.players.reduce((V,P)=>V+(P.played||0),0);return{bye:oe/O.players.length,play:ue/O.players.length}},L=C(h),M=C(S);return Math.abs(M.bye-L.bye)>.1?M.bye-L.bye:L.play-M.play});const i=[],c=[];let d=0;for(const h of o)d+h.players.length<=n&&(c.push(h),i.push(...h.players),d+=h.players.length);const p=new Set(i.map(h=>h.id)),u=l.filter(h=>!p.has(h.id)),g=[],y=[];c.forEach(h=>{h.type==="pair"?g.push(h.players):y.push(h.players[0])}),y.sort((h,S)=>S.points-h.points);let m=0;for(;m<y.length-3;m+=4){const h=y[m],S=y[m+1],C=y[m+2],L=y[m+3],M=[{name:"oneThree",team1:[h,C],team2:[S,L]},{name:"oneTwo",team1:[h,S],team2:[C,L]},{name:"oneFour",team1:[h,L],team2:[S,C]}];let O;const oe=a.pairingStrategy!=="optimal"&&a.strictStrategy;a.strictStrategy;const ue=a.maxRepeats!==void 0?a.maxRepeats:99,V=M.map(P=>{const F=P.team1[0].id,G=P.team1[1].id,q=P.team2[0].id,j=P.team2[1].id,pt=(mn,gn)=>{const he=e.find(ze=>ze.id===mn);return he!=null&&he.playedWith?he.playedWith.filter(ze=>ze===gn).length:0},mt=pt(F,G)+pt(q,j),rn=P.team1[0].points+P.team1[1].points,ln=P.team2[0].points+P.team2[1].points,cn=Math.abs(rn-ln),dn=ue<99&&mt>ue,un=P.name===a.pairingStrategy,pn=F*1e6+G*1e4+q*100+j;return{...P,repeatPenalty:mt,violatesRepeats:dn,isPreferred:un,rankingImbalance:cn,tieBreaker:pn}});if(V.sort((P,F)=>P.tieBreaker-F.tieBreaker),a.pairingStrategy==="optimal")O={...[...V].sort((F,G)=>F.repeatPenalty!==G.repeatPenalty?F.repeatPenalty-G.repeatPenalty:F.rankingImbalance!==G.rankingImbalance?F.rankingImbalance-G.rankingImbalance:F.tieBreaker-G.tieBreaker)[0],relaxedConstraint:null};else{const P=V.find(F=>F.isPreferred)||V[0];if(!P.violatesRepeats)O={...P,relaxedConstraint:null};else if(oe)O={...P,relaxedConstraint:"repeats"};else{const F=V.filter(G=>!G.violatesRepeats);F.length>0?O={...[...F].sort((q,j)=>q.isPreferred!==j.isPreferred?q.isPreferred?-1:1:q.rankingImbalance!==j.rankingImbalance?q.rankingImbalance-j.rankingImbalance:q.tieBreaker-j.tieBreaker)[0],relaxedConstraint:"pattern"}:O={...[...V].sort((q,j)=>q.repeatPenalty!==j.repeatPenalty?q.repeatPenalty-j.repeatPenalty:q.isPreferred!==j.isPreferred?q.isPreferred?-1:1:q.rankingImbalance!==j.rankingImbalance?q.rankingImbalance-j.rankingImbalance:q.tieBreaker-j.tieBreaker)[0],relaxedConstraint:"tier3"}}}g.push(O.team1),g.push(O.team2)}m<y.length-1&&g.push([y[m],y[m+1]]);const f=g.map(h=>({players:h,points:h.reduce((S,C)=>S+C.points,0)}));f.sort((h,S)=>S.points-h.points);const b=[],v=new Set,x=new Set,$=[],B=[];for(let h=0;h<f.length-1;h+=2){const S=f[h],C=f[h+1],L=[...S.players,...C.players].find(M=>M.lockedCourt);L?$.push({t1:S,t2:C,lockedCourt:L.lockedCourt}):B.push({t1:S,t2:C})}return $.forEach(h=>{if(b.length>=t)return;let S=h.lockedCourt;(x.has(S)||S>t)&&(S=null),S?(x.add(S),b.push({court:S,team1:h.t1.players,team2:h.t2.players}),h.t1.players.forEach(C=>v.add(C.id)),h.t2.players.forEach(C=>v.add(C.id))):B.push({t1:h.t1,t2:h.t2})}),B.forEach(h=>{if(b.length>=t)return;let S=1;for(;x.has(S);)S++;S<=t&&(x.add(S),b.push({court:S,team1:h.t1.players,team2:h.t2.players}),h.t1.players.forEach(C=>v.add(C.id)),h.t2.players.forEach(C=>v.add(C.id)))}),b.sort((h,S)=>h.court-S.court),f.forEach(h=>{h.players.some(S=>v.has(S.id))||h.players.forEach(S=>u.push(S))}),{number:a.schedule.length+1,matches:b,byes:u}}function re(e,t,n,s,o,r=null){const l=a.leaderboard.find(i=>i.id===e);l&&(l.points+=t,l.played+=1,l.pointsLost=(l.pointsLost||0)+n,s?l.wins=(l.wins||0)+1:o||(l.losses=(l.losses||0)+1),r&&!l.playedWith&&(l.playedWith=[]),r&&l.playedWith.push(r))}function ie(e,t,n,s,o){const r=a.leaderboard.find(l=>l.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-n,s?r.wins=(r.wins||0)-1:o||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let Ue=null;function Wt(e){Ue=e}let Ve=null;function Gt(e){Ve=e}function N(){const e=T(),t=a.format,n=t==="team"||t==="teamMexicano",s={americano:{title:"Americano Setup",description:"Add players and configure your tournament settings."},mexicano:{title:"Mexicano Setup",description:"Dynamic schedule that adjusts pairings based on leaderboard."},team:{title:"Team Americano Setup",description:"Play with fixed teams."},teamMexicano:{title:"Team Mexicano Setup",description:"Dynamic schedule for fixed teams."}},o=s[a.format]||s.americano,r=document.querySelector(".page-title"),l=document.querySelector(".page-subtitle");r&&(r.textContent=o.title),l&&(l.textContent=o.description);const i=document.getElementById("playersHeader");i&&i.firstChild&&(i.firstChild.textContent=n?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=n?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=n?"Enter team name...":"Enter name...");const c=document.getElementById("advancedSettingsContent");c&&(c.querySelectorAll("input, select, button").forEach(v=>{if(v.disabled=!1,v.classList.remove("locked"),v.tagName==="SELECT"){const x=v.closest(".custom-select-wrapper");if(x){const $=x.querySelector(".custom-select");$&&$.classList.remove("disabled")}}}),Lt());const d=document.getElementById("runningBadge");a.isLocked?(e.generateBtn&&(e.generateBtn.style.display="none"),d&&(d.style.display="inline-flex")):(e.generateBtn&&(e.generateBtn.style.display="block",e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=!1),d&&(d.style.display="none"));const p=String(t).trim(),y=p.toLowerCase()==="mexicano"||p==="teamMexicano",m=e.advancedSettingsContent;m&&(y?(m.classList.remove("collapsed"),m.classList.add("expanded")):(m.classList.remove("expanded"),m.classList.add("collapsed")));const f=document.getElementById("strictStrategy");f&&(f.disabled=!1),Ve&&Ve()}function Qn(){var c,d;const e=document.getElementById("summaryList"),t=document.getElementById("tournamentSummary");if(!e||!t)return;if(a.isLocked){t.style.display="none";return}t.style.display="block";const n={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},s=a.format==="team"||a.format==="teamMexicano",o=a.format==="mexicano"||a.format==="teamMexicano",r=((c=a.players)==null?void 0:c.length)||0,l=s?"teams":"players",i=[{label:"Format",value:n[a.format]||a.format},{label:s?"Teams":"Players",value:r>0?`${r} ${l}`:"None added"},{label:"Courts",value:a.courts||2},{label:"Scoring",value:a.scoringMode==="time"?`${a.pointsPerMatch} minutes`:a.scoringMode==="race"?`First to ${a.pointsPerMatch}`:`${a.pointsPerMatch} total points`}];if(o){const p=a.maxRepeats===99?"Unlimited":a.maxRepeats===0?"No repeats":`Max ${a.maxRepeats}x`;i.push({label:"Repeats",value:p});const u={oneThree:"1&3 vs 2&4",oneTwo:"1&2 vs 3&4",oneFour:"1&4 vs 2&3",optimal:"Optimal"};if(i.push({label:"Pairing",value:u[a.pairingStrategy]||a.pairingStrategy}),((d=a.preferredPartners)==null?void 0:d.length)>0){const g=a.preferredPartners.map(y=>{const m=a.players.find(b=>b.id===y.player1Id),f=a.players.find(b=>b.id===y.player2Id);return m&&f?`${m.name} & ${f.name}`:null}).filter(Boolean);g.length>0&&i.push({label:"Fixed Pairs",value:g,isChips:!0})}}e.innerHTML=i.map(p=>p.isChips?`
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
      `).join("")}function Ut(){const e=T(),t=e.format.value,n=t==="team"||t==="teamMexicano",s=n?2:4;if(a.players.length<s){w(`Not enough ${n?"teams":"players"} (min ${s})`,"error");return}a.format=e.format.value,a.courts=parseInt(e.courts.value),a.scoringMode=e.scoringMode.value,a.pointsPerMatch=parseInt(e.points.value),a.currentRound=1;const o=a.format==="team"||a.format==="teamMexicano"?2:4,r=Math.floor(a.players.length/o),l=()=>{Ie(),a.leaderboard=a.players.map(c=>({...c,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),a.format==="americano"?(a.allRounds=Un(),a.schedule=[a.allRounds[0]]):a.format==="team"?(a.allRounds=Vn(),a.schedule=[a.allRounds[0]]):a.format==="teamMexicano"?(a.schedule=Yn(),a.allRounds=null):(a.schedule=Xn(),a.allRounds=null),e.leaderboardSection.style.display="block",U(),Ue&&Ue(),e.scheduleSection.style.display="block";const i=document.getElementById("tournamentActionsSection");i&&(i.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const c=document.getElementById("round-0");c&&(c.classList.add("animate-in","highlight"),setTimeout(()=>{c.classList.remove("animate-in","highlight")},1600))},100),a.isLocked=!0,N(),k(),w("🎾 Tournament started! Round 1 ready")};if(a.courts>r){if(r===0){_e("Not Enough Players",`You need at least ${o} players/teams to start!`);return}const i=a.courts;a.courts=r,e.courts&&(e.courts.value=a.courts),w(`Adjusted courts: ${i} → ${r}`)}Mn().then(()=>{l()})}function Vt(){const e=T();z("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{Ie(),a.schedule=[],a.currentRound=0,a.leaderboard=[],a.allRounds=null,a.isLocked=!1,a.hideLeaderboard=!1,a.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",N(),k(),w("Tournament reset")},!0)}function rt(e){z("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{a.isLocked=!1,a.hideLeaderboard=!1,N();const t=[...a.leaderboard].sort((n,s)=>s.points-n.points);ns(),Re(),w("Tournament saved to history"),e&&e(t),U(),k()},!0)}function it(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function lt(e=null){const t=e||a,n=new Date().toLocaleDateString(),s=new Date().toLocaleTimeString();let o="data:text/csv;charset=utf-8,";o+=`Tournament Results
`,o+=`Date,${n} ${s}
`,o+=`Format,${t.format}
`,o+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,o+=`Final Standings
`,o+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((c,d)=>d.points-c.points).forEach((c,d)=>{const p=(c.points||0)-(c.pointsLost||0);o+=`${d+1},"${c.name}",${c.points},${c.wins},${c.played},${c.pointsLost||0},${p}
`}),o+=`
`,o+=`Match History
`,o+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(c=>{c.completed&&c.matches.forEach(d=>{const p=d.team1.map(y=>y.name).join(" & "),u=d.team2.map(y=>y.name).join(" & ");let g=`Court ${d.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[d.court-1]?g=t.customCourtNames[d.court-1]:t.courtFormat==="number"&&(g=`${d.court}`),o+=`Round ${c.number},"${g}","${p}",${d.score1},${d.score2},"${u}"
`})});const l=encodeURI(o),i=document.createElement("a");i.setAttribute("href",l),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function ct(e=null){var r;const t=e||a;let s=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;s+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,s+=`Format: ${t.format}

`,s+=`Top Standings:
`,[...t.leaderboard].sort((l,i)=>i.points-l.points).slice(0,5).forEach((l,i)=>{s+=`${i+1}. ${l.name}: ${l.points} pts (${l.wins}W)
`}),s+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(s),w("Results copied to clipboard")}catch(l){console.error("Failed to copy: ",l),w("Failed to copy results","error")}}const Zn=Object.freeze(Object.defineProperty({__proto__:null,endTournament:rt,exportTournamentData:lt,generateSchedule:Ut,renderTournamentSummary:Qn,resetSchedule:Vt,setRenderScheduleCallback:Wt,setRenderTournamentConfigCallback:Gt,shareResults:ct,toggleToolbar:it,updateSetupUI:N},Symbol.toStringTag,{value:"Module"}));class es{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const n=Math.floor(t/60),s=t%60;return`${n.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`}playBeep(t=440,n=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const s=this.audioContext.createOscillator(),o=this.audioContext.createGain();s.type="sine",s.frequency.value=t,s.connect(o),o.connect(this.audioContext.destination),s.start(),o.gain.setValueAtTime(.1,this.audioContext.currentTime),o.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+n),s.stop(this.audioContext.currentTime+n)}catch(s){console.warn("Audio play failed",s)}}}let H=null;function ts(){const e=T();if(e.matchTimerContainer){if(a.scoringMode!=="time"){e.matchTimerContainer.style.display="none",H&&(H.pause(),H=null);return}if(e.matchTimerContainer.style.display="flex",H)H.duration!==a.pointsPerMatch&&H.setDuration(a.pointsPerMatch);else{H=new es({duration:a.pointsPerMatch||12,onTimeUpdate:n=>{e.timerDisplay&&(e.timerDisplay.textContent=n),document.title=`${n} - Tournament`},onStatusChange:n=>{n==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed"),e.runningBadge&&(e.runningBadge.style.display="inline-flex",e.runningBadge.classList.add("running"))):n==="paused"||n==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),e.runningBadge&&(e.runningBadge.style.display="none",e.runningBadge.classList.remove("running")),n==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):n==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=H.formatTime(a.pointsPerMatch*60),e.timerStartBtn.onclick=()=>H.start(),e.timerPauseBtn.onclick=()=>H.pause(),e.timerResetBtn.onclick=()=>H.reset(),e.timerAddBtn.onclick=()=>H.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>H.addTime(-60));const t=()=>{const n=()=>{Pe("Set Timer Duration","Enter minutes (e.g. 12)",s=>{const o=parseInt(s);o>0?(a.pointsPerMatch=o,k(),H.setDuration(o),w(`Timer set to ${o} minutes`)):w("Invalid minutes","error")})};H.isRunning?z("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{H.pause(),n()}):n()};e.timerDisplay.onclick=t}}}function W(){const e=T();ts(),se();const t=a.schedule.length-1;e.roundsContainer.innerHTML=a.schedule.map((r,l)=>{const i=l===t,c=r.completed,d=c&&!i,p=c?r.matches.map(u=>`${u.score1}-${u.score2}`).join(" · "):"";return`
    <div class="round ${c?"completed":"ongoing"} ${d?"collapsed":""}" 
         id="round-${l}" 
         data-round="${l}">
      <div class="round-header" data-action="toggle-round" data-round="${l}">
        <span class="round-title">
          Round ${r.number}
          ${c?'<span class="round-status completed">✓ Completed</span>':'<span class="round-status ongoing">● Ongoing</span>'}
        </span>
        ${c?`<span class="round-summary" style="${d?"":"display: none"}">${p}</span>`:""}
        ${c?`<span class="collapse-icon">${d?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${r.matches.map((u,g)=>`
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${De(u.court)}</span>
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
                ${c?`
                <div class="score-input-row">
                  <span class="score-display">${u.score1} - ${u.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${l}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${l}-${g}-1" 
                         min="0" max="${a.scoringMode==="total"?a.pointsPerMatch:999}" placeholder="0" 
                         value="${u.score1||""}"
                         data-action="autofill-score" data-round="${l}" data-match="${g}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${l}-${g}-2" 
                         min="0" max="${a.scoringMode==="total"?a.pointsPerMatch:999}" placeholder="0"
                         value="${u.score2||""}"
                         data-action="autofill-score" data-round="${l}" data-match="${g}" data-team="2">
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
        ${!c&&i?`
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
  `}).join(""),jn(),Me(),Ht(),Yt();const n=a.schedule.findIndex(r=>!r.completed),s=n>=0?n:0,o=document.getElementById(`round-${s}`);o&&setTimeout(()=>{o.scrollIntoView({behavior:"smooth",block:"start"})},100)}function se(){const e=document.getElementById("gameDetails");if(!e)return;const t={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},n={total:"Total Points",race:"Race to Points",time:"Time Based"},s=[{label:t[a.format]||"Tournament"},{label:`${a.courts} Courts`},{label:n[a.scoringMode]},{label:a.scoringMode==="time"?`${a.pointsPerMatch} Mins`:`${a.pointsPerMatch} Pts`}];e.innerHTML=s.map(o=>`
    <div class="game-detail-item">
      <span class="detail-label">${o.label}</span>
    </div>
  `).join("")}Wt(W);function Ye(e,t,n,s){setTimeout(Yt,0);let o=parseInt(s);if(isNaN(o)||o<0)return;const r=parseInt(a.pointsPerMatch);if(!(isNaN(r)||r<=0)){if(a.scoringMode==="total"){if(o>r){o=r;const d=document.getElementById(`score-${e}-${t}-${n}`);d&&(d.value=o)}const l=n===1||n==="1"?2:1,i=r-o,c=document.getElementById(`score-${e}-${t}-${l}`);c&&i>=0&&(c.value=i)}else if(a.scoringMode==="race"){if(o<r){const l=n===1||n==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${l}`);i&&(i.value=r)}else if(o===r){const l=n===1||n==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${l}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function Yt(){const e=a.schedule.findIndex(r=>!r.completed);if(e===-1)return;const t=a.schedule[e],n=document.querySelector(".complete-round-btn");if(!n)return;let s=!0;const o=parseInt(a.pointsPerMatch);for(let r=0;r<t.matches.length;r++){const l=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`);if(!l||!i)continue;const c=l.value,d=i.value;if(c===""||d===""){s=!1;break}const p=parseInt(c),u=parseInt(d);if(a.scoringMode==="total"){if(p+u!==o){s=!1;break}}else if(p<0||u<0){s=!1;break}}n.disabled=!1,s?(n.classList.remove("btn-warning"),n.classList.add("btn-success"),n.textContent=`Complete Round ${t.number}`):(n.classList.add("btn-warning"),n.classList.remove("btn-success"),n.textContent="Complete Anyway")}function Jt(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const s=t.querySelector(".collapse-icon");s&&(s.textContent="▼");const o=t.querySelector(".round-summary");o&&(o.style.display="none")}else{t.classList.add("collapsed");const s=t.querySelector(".collapse-icon");s&&(s.textContent="▶");const o=t.querySelector(".round-summary");o&&(o.style.display="")}}function Xt(e){const t=a.manualByes.indexOf(e);if(t!==-1){a.manualByes.splice(t,1),W();return}const n=a.courts*4,s=a.leaderboard.length,o=Math.max(0,s-n);if(o===0){w(`All ${s} players needed for ${a.courts} courts.`);return}if(a.manualByes.length>=o){w(`Max ${o} can rest. Deselect someone first.`);return}a.manualByes.push(e),W()}function Kt(){const e=a.schedule.length-1,t=a.schedule[e];let n=!0;const s=[];if(t.matches.forEach((o,r)=>{const l=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`),c=l==null?void 0:l.value,d=i==null?void 0:i.value;let p=!0;(c===""||d==="")&&(p=!1,c===""&&(l==null||l.classList.add("error")),d===""&&(i==null||i.classList.add("error")));const u=parseInt(c)||0,g=parseInt(d)||0;if(a.scoringMode==="total"){const y=parseInt(a.pointsPerMatch,10);u+g!==y?(p=!1,l==null||l.classList.add("error"),i==null||i.classList.add("error")):c!==""&&d!==""&&(l==null||l.classList.remove("error"),i==null||i.classList.remove("error"))}else u<0||g<0?(p=!1,l==null||l.classList.add("error"),i==null||i.classList.add("error")):c!==""&&d!==""&&(l==null||l.classList.remove("error"),i==null||i.classList.remove("error"));p||(n=!1,s.push(De(o.court)))}),!n){let o="Some matches have missing or invalid scores.";s.length>0&&(o=`
        <p style="margin-bottom: var(--space-md);">The following matches need scores:</p>
        <ul style="text-align: left; margin: 0 0 var(--space-md) var(--space-lg); list-style: disc;">
          ${s.map(l=>`<li>${l}</li>`).join("")}
        </ul>
        <p>Do you want to complete the round anyway?</p>
      `),z("Incomplete/Invalid Scores",o,"Yes, Complete Anyway",()=>{He(t)},!0);return}if(a.scoringMode==="race"){const o=[],r=a.pointsPerMatch;if(t.matches.forEach((l,i)=>{const c=document.getElementById(`score-${e}-${i}-1`),d=document.getElementById(`score-${e}-${i}-2`),p=parseInt(c==null?void 0:c.value)||0,u=parseInt(d==null?void 0:d.value)||0;p<r&&u<r&&o.push(De(l.court))}),o.length>0){const l=o.join(", ");z("Low Scores Detected",`On ${l}, neither team reached the target of ${r}. Is this correct?`,"Yes, Complete Round",()=>{He(t)},!0);return}}He(t)}function He(e){const t=a.schedule.findIndex(i=>i===e);Ft().forEach((i,c)=>{const d=a.leaderboard.find(p=>p.id===i.id);d&&(d.previousRank=c+1)}),e.matches.forEach((i,c)=>{const d=document.getElementById(`score-${t}-${c}-1`),p=document.getElementById(`score-${t}-${c}-2`),u=parseInt(d==null?void 0:d.value)||0,g=parseInt(p==null?void 0:p.value)||0;i.score1=u,i.score2=g;const y=u===g,m=u>g,f=g>u;i.team1[1]?(re(i.team1[0].id,u,g,m,y,i.team1[1].id),re(i.team1[1].id,u,g,m,y,i.team1[0].id),re(i.team2[0].id,g,u,f,y,i.team2[1].id),re(i.team2[1].id,g,u,f,y,i.team2[0].id)):(re(i.team1[0].id,u,g,m,y,null),re(i.team2[0].id,g,u,f,y,null))});const s=document.querySelector(".complete-round-btn");if(s&&(s.classList.add("completing"),s.textContent="✓ Completing..."),Ie(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const c=a.leaderboard.find(d=>d.id===i.id);c&&(c.byeCount=(c.byeCount||0)+1)}),a.manualByes=[],a.currentRound++,a.format==="americano"&&a.allRounds&&a.currentRound<=a.allRounds.length){const i={...a.allRounds[a.currentRound-1]};a.schedule.push(i)}else if(a.format==="team"&&a.allRounds&&a.currentRound<=a.allRounds.length){const i={...a.allRounds[a.currentRound-1]};a.schedule.push(i)}else if(a.format==="teamMexicano"){if(a.currentRound<=20){const i=Jn();i.matches.length>0&&a.schedule.push(i)}}else if(a.format==="mexicano"&&a.currentRound<=20){const i=Kn(a.leaderboard);i.matches.length>0&&a.schedule.push(i)}U(),W(),k();const o=document.getElementById(`round-${t}`);o&&(o.classList.add("complete-flash"),setTimeout(()=>o.classList.remove("complete-flash"),1e3));const r=e.number,l=a.schedule.length>t+1;w(l?`✓ Round ${r} complete! Round ${r+1} ready`:`✓ Round ${r} complete!`),setTimeout(()=>{const i=a.schedule.length-1,c=document.getElementById(`round-${i}`);c&&(c.classList.add("animate-in","highlight"),c.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{c.classList.remove("animate-in","highlight")},1600))},100)}function Qt(e){const t=a.schedule[e];if(!(!t||!t.completed||a.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${a.schedule.length-e-1} subsequent round(s). Continue?`))){Ie();for(let s=e;s<a.schedule.length;s++){const o=a.schedule[s];o.completed&&o.matches.forEach(r=>{r.team1[1]?(ie(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ie(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ie(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),ie(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(ie(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ie(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}a.schedule=a.schedule.slice(0,e+1),t.completed=!1,a.currentRound=e,U(),W(),k(),w(`Editing Round ${e+1}`)}}const dt="padel_history_v1";function ns(){var s;const e=de(),t=wn(),n={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),name:t.tournamentName||"",notes:t.tournamentNotes||"",format:t.format,winner:((s=t.leaderboard[0])==null?void 0:s.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(n),e.length>20&&e.pop(),localStorage.setItem(dt,JSON.stringify(e)),n}function de(){try{const e=localStorage.getItem(dt);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function ss(e){z("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const n=de().filter(s=>s.id!==e);localStorage.setItem(dt,JSON.stringify(n)),Re(),w("Tournament deleted")},!0)}function as(e){const n=de().find(s=>s.id===e);if(!n){w("Tournament details not found","error");return}z("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{tt(n.data),W(),U(),k(),w("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(s){console.error("Failed to load tournament",s),w("Error loading tournament","error")}},!1)}let Le=[];function Ae(){Re();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const n=t.target.value.toLowerCase();os(n)})}function os(e){if(!e){Je(Le);return}const t=Le.filter(n=>{var p,u,g,y,m,f,b,v;const s=(((p=n.summary)==null?void 0:p.winner)||((g=(u=n.players)==null?void 0:u[0])==null?void 0:g.name)||"").toLowerCase(),o=(((y=n.summary)==null?void 0:y.format)||n.format||"").toLowerCase(),r=((m=n.summary)==null?void 0:m.date)||n.date||"",l=String(((f=n.summary)==null?void 0:f.playerCount)||((b=n.players)==null?void 0:b.length)||""),i=String(((v=n.summary)==null?void 0:v.roundCount)||""),d=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return s.includes(e)||o.includes(e)||d.includes(e)||l.includes(e)||i.includes(e)});Je(t)}function Re(){Le=de(),Je(Le)}const ut=Re;function Je(e){const t=document.getElementById("historyTableBody"),n=document.getElementById("historyEmptyStatePage");if(!(!t||!n)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",n.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn btn-primary">
        Start a Tournament
      </button>
    `,n.style.display="block";return}t.parentElement.style.display="table",n.style.display="none",window.deleteHistoryItem=ss,window.loadTournament=as,window.downloadHistoryItem=rs,t.innerHTML=e.map(s=>{var m,f,b,v,x,$,B,h;const o=s.summary?s.summary.date:s.date,r=s.summary?s.summary.format:s.format||"Unknown",l=r.charAt(0).toUpperCase()+r.slice(1);let i="Unknown";((f=(m=s.data)==null?void 0:m.leaderboard)==null?void 0:f.length)>0?i=((b=[...s.data.leaderboard].sort((C,L)=>L.points-C.points)[0])==null?void 0:b.name)||"Unknown":(v=s.summary)!=null&&v.winner&&(i=s.summary.winner);const c=s.summary?s.summary.playerCount:((x=s.players)==null?void 0:x.length)||0,d=(($=s.summary)==null?void 0:$.roundCount)||((h=(B=s.data)==null?void 0:B.schedule)==null?void 0:h.length)||0,p=new Date(o),u=p.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),g=p.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),y=!!s.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${u}</span>
            <span class="date-sub">${g}</span>
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
        <td>${c}</td>
        <td>${d}</td>
        <td class="text-right">
           <!-- Desktop: Show all buttons -->
           <div class="action-buttons desktop-only">
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
                ${y?"":"disabled"}
                title="Restore this tournament"
              >
                Load
              </button>
              <button 
                onclick="duplicateTournament('${s.id}')" 
                class="btn btn-sm btn-ghost"
                ${y?"":"disabled"}
                title="Copy settings to new tournament"
              >
                Duplicate
              </button>
              <button 
                onclick="deleteHistoryItem('${s.id}')" 
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
                <button onclick="loadTournament('${s.id}')" ${y?"":"disabled"}>Load</button>
                <button onclick="duplicateTournament('${s.id}')" ${y?"":"disabled"}>Duplicate</button>
                <button onclick="downloadHistoryItem('${s.id}')">CSV</button>
                <button class="text-danger" onclick="deleteHistoryItem('${s.id}')">Delete</button>
              </div>
           </div>
        </td>
      </tr>
      `}).join("")}}function rs(e){const n=de().find(s=>s.id===e);n&&n.data&&window.exportTournamentData&&window.exportTournamentData(n.data)}function is(e){const n=de().find(s=>s.id===e);if(!n||!n.data){w("Tournament details not found","error");return}z("Duplicate this tournament?","This will copy settings and players but reset all scores.","Duplicate",()=>{try{const o={...n.data,leaderboard:[],schedule:[],currentRound:0,allRounds:null,isLocked:!1,hideLeaderboard:!0,manualByes:[]};tt(o),W(),U(),k(),w("Tournament duplicated - ready to start!"),window.scrollTo({top:0,behavior:"smooth"})}catch(s){console.error("Failed to duplicate tournament",s),w("Error duplicating tournament","error")}},!1)}function ls(e){const t=e.nextElementSibling,n=t.classList.contains("open");document.querySelectorAll(".action-menu-dropdown.open").forEach(s=>{s.classList.remove("open")}),n||t.classList.add("open")}document.addEventListener("click",e=>{e.target.closest(".action-menu")||document.querySelectorAll(".action-menu-dropdown.open").forEach(t=>{t.classList.remove("open")})});window.duplicateTournament=is;window.toggleActionMenu=ls;document.addEventListener("DOMContentLoaded",()=>{});let te=null;const $e={};function ve(e,t){$e[e]=t}function cs(){window.addEventListener("hashchange",bt),bt()}function Zt(){const{route:e,params:t}=en();return{route:e,params:t}}function en(){const e=location.hash.slice(2)||"",[t,n]=e.split("?"),s=t.replace(/\/$/,""),o=new URLSearchParams(n||"");return{route:s,params:o}}function bt(){const{route:e,params:t}=en(),n=$e[e]||$e[""]||$e.generator;if(!n){console.warn(`[Router] No page found for route: ${e}`);return}if(te!=null&&te.unmount)try{te.unmount()}catch(o){console.error("[Router] Error unmounting page:",o)}const s=document.getElementById("pageContainer");s&&(s.innerHTML=`
      <div style="padding: 20px;">
        <div class="loading-skeleton skeleton-header" style="width: 50%; height: 40px; margin-bottom: 30px;"></div>
        <div class="loading-skeleton skeleton-card" style="height: 200px; margin-bottom: 20px;"></div>
        <div class="loading-skeleton skeleton-card" style="height: 150px;"></div>
      </div>
    `),setTimeout(()=>{if(te=n,s&&te.mount)try{te.mount(s,t)}catch(o){console.error("[Router] Error mounting page:",o),s.innerHTML=`
          <div class="alert alert-danger" style="margin: 20px;">
            <h3>Error Loading Page</h3>
            <pre>${o.message}
${o.stack}</pre>
            <button class="btn btn-secondary" onclick="window.location.reload()">Reload</button>
          </div>
        `}},50)}function ds(e,t){let n;const s=document.getElementById(e),o=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",l=>{l.preventDefault(),n=l,s&&(s.style.display="inline-flex",s.addEventListener("click",async()=>{s.style.display="none",n.prompt(),(await n.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),n=null}))}),o&&!r&&s&&t&&(s.style.display="inline-flex",s.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{s&&(s.style.display="none"),n=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}const Ee=()=>`
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
`,us=()=>`
  <!-- Standard Header -->
  <div class="page-intro-header">
    <h2>Americano Setup</h2>
    <p>Add players and configure your tournament settings.</p>
  </div>

  <!-- Setup Section -->
  <div class="players-section" style="max-width: 700px; margin: 0 auto;">
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

    <div class="player-list-wrapper" id="playerListWrapper">
      <ul class="player-list custom-scrollbar-y" id="genPlayerList" style="display: grid !important; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; gap: 10px !important; padding: 4px; max-height: 400px !important; overflow-y: auto !important; transition: max-height 0.3s ease-out !important;">
        <!-- Players will be added here -->
      </ul>
    </div>
    <button class="btn btn-sm btn-secondary" id="genExpandBtn" data-action="toggle-player-list" style="width: 100%; margin-top: 8px;">Show All Players</button>
    
    <!-- Preferred Partners Section (Hidden by default or empty) -->
    <div id="preferredPartnersList" class="preferred-partners-list"></div>
    <div style="text-align: center; margin: 10px 0; display: none;">
      <button id="addPartnerPairBtn" class="btn btn-secondary btn-sm">Add Fixed Pair</button>
    </div>
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
  ${Ee()}
`,xt={mount(e,t){if(console.log("[GeneratorPage] Mounting..."),!e){console.error("[GeneratorPage] Mount failed: Container is null");return}e.innerHTML=us(),nt(),window.dispatchEvent(new CustomEvent("tournament-generator-mounted")),N(),Te(),D(),_(),ee();const n=document.querySelector(".players-header h3");if(n&&n.classList.add("animate-in"),ae(),Ae(),document.getElementById("historySectionPage")&&ut(),a.schedule.length>0){const o=getElements();o.scheduleSection&&(o.scheduleSection.style.display="block"),o.leaderboardSection&&(o.leaderboardSection.style.display="block");const r=document.getElementById("tournamentActionsSection");r&&(r.style.display="block"),W(),U(),Me()}},unmount(){console.log("[GeneratorPage] Unmounting...")}};function Xe(e){if(!e||e.length<2)throw new Error("Need at least 2 teams for a bracket");const t=Math.pow(2,Math.ceil(Math.log2(e.length))),n=Math.log2(t);t-e.length;const s=ps(e,t),o=[];let r=1;const l=[];for(let c=0;c<t/2;c++){const d=s[c],p=s[t-1-c],u={id:r++,round:1,position:c,team1:d||null,team2:p||null,score1:null,score2:null,winner:null,nextMatchId:null};d&&!p?(u.winner=d.id,u.isBye=!0):p&&!d&&(u.winner=p.id,u.isBye=!0),l.push(u),o.push(u)}let i=l;for(let c=2;c<=n;c++){const d=[];for(let p=0;p<i.length/2;p++){const u={id:r++,round:c,position:p,team1:null,team2:null,score1:null,score2:null,winner:null,nextMatchId:null};d.push(u),o.push(u);const g=i[p*2],y=i[p*2+1];g.nextMatchId=u.id,y.nextMatchId=u.id,g.winner&&(u.team1=wt(s,g.winner)),y.winner&&(u.team2=wt(s,y.winner))}i=d}return{teams:s.filter(Boolean),matches:o,numRounds:n,format:"single"}}function ps(e,t){const n=e.filter(p=>p.side==="A"),s=e.filter(p=>p.side==="B"),o=e.filter(p=>!p.side||p.side!=="A"&&p.side!=="B"),r=Math.ceil(o.length/2),l=[...n,...o.slice(0,r)],i=[...s,...o.slice(r)],c=t/2,d=new Array(t).fill(null);return l.forEach((p,u)=>{u<c&&(d[u]=p)}),i.forEach((p,u)=>{c+u<t&&(d[c+u]=p)}),d}function wt(e,t){return e.find(n=>(n==null?void 0:n.id)===t)||null}function ms(e,t,n){var o,r,l,i;const s=a.tournament.matches.find(c=>c.id===e);if(!s)return!1;if(s.winner!=null&&tn(s),s.score1=t,s.score2=n,t>n)s.winner=(o=s.team1)==null?void 0:o.id;else if(n>t)s.winner=(r=s.team2)==null?void 0:r.id;else return s.winner=null,!1;if(s.nextMatchId){const c=a.tournament.matches.find(d=>d.id===s.nextMatchId);if(c){const d=s.winner===((l=s.team1)==null?void 0:l.id)?s.team1:s.team2;((i=a.tournament.matches.filter(g=>g.nextMatchId===c.id)[0])==null?void 0:i.id)===s.id?c.team1=d:c.team2=d}}return k(),!0}function tn(e){var o;if(!e.nextMatchId)return;const t=a.tournament.matches.find(r=>r.id===e.nextMatchId);if(!t)return;((o=a.tournament.matches.filter(r=>r.nextMatchId===t.id)[0])==null?void 0:o.id)===e.id?t.team1=null:t.team2=null,t.winner!=null&&(t.score1=null,t.score2=null,t.winner=null,tn(t))}function gs(){const e=a.tournament.matches;if(!e.length)return[];const t=Math.max(...e.map(s=>s.round)),n=[];for(let s=1;s<=t;s++)n.push(e.filter(o=>o.round===s).sort((o,r)=>o.position-r.position));return n}function Fe(e,t){const n=t-e;return n===0?"Final":n===1?"Semi-Finals":n===2?"Quarter-Finals":`Round ${e}`}function St(){const e=a.tournament.matches;if(!e.length)return!1;const t=e.find(n=>n.round===Math.max(...e.map(s=>s.round)));return(t==null?void 0:t.winner)!=null}function fs(){var r,l;const e=a.tournament.matches;if(!e.length)return[];const t=Math.max(...e.map(i=>i.round)),n=e.find(i=>i.round===t),s=e.filter(i=>i.round===t-1),o=[];if(n!=null&&n.winner){const i=n.winner===((r=n.team1)==null?void 0:r.id)?n.team1:n.team2;o.push({place:1,team:i});const c=n.winner===((l=n.team1)==null?void 0:l.id)?n.team2:n.team1;o.push({place:2,team:c})}return s.forEach(i=>{var c;if(i.winner){const d=i.winner===((c=i.team1)==null?void 0:c.id)?i.team2:i.team1;d&&o.push({place:3,team:d})}}),o}function ys(e){const t=e.map((s,o)=>{const r=typeof s=="string"?s:s.name,l=typeof s=="object"?s.side:null;return{id:`team-${Date.now()}-${o}`,name:r.trim(),side:l}}),n=Xe(t);return a.tournament={format:"single",teams:n.teams,matches:n.matches,standings:[],meta:{name:"",notes:"",createdAt:new Date().toISOString()}},k(),n}function kt(){a.tournament={format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},k()}function hs(e,t){const n=Xe(e),s=Xe(t),o=Math.max(...n.matches.map(u=>u.id));s.matches.forEach(u=>{u.id+=o,u.nextMatchId&&(u.nextMatchId+=o),u.bracket="B"}),n.matches.forEach(u=>{u.bracket="A"});const r=n.matches.find(u=>u.round===n.numRounds),l=s.matches.find(u=>u.round===s.numRounds),i=o+Math.max(...s.matches.map(u=>u.id))+1,c={id:i,round:Math.max(n.numRounds,s.numRounds)+1,position:0,team1:null,team2:null,score1:null,score2:null,winner:null,nextMatchId:null,bracket:"FINAL",isGrandFinal:!0};r.nextMatchId=i,l.nextMatchId=i;const d=[...n.matches,...s.matches,c];return{teams:[...n.teams,...s.teams],teamsA:n.teams,teamsB:s.teams,matches:d,matchesA:n.matches,matchesB:s.matches,grandFinal:c,numRoundsA:n.numRounds,numRoundsB:s.numRounds,format:"dual"}}function vs(e,t=!0){const n=e.map((p,u)=>{const g=typeof p=="string"?p:p.name,y=typeof p=="object"?p.side:null;return{id:`team-${Date.now()}-${u}`,name:g.trim(),side:y}}),s=n.filter(p=>p.side==="A"),o=n.filter(p=>p.side==="B"),r=n.filter(p=>!p.side||p.side!=="A"&&p.side!=="B"),l=Math.ceil(r.length/2),i=[...s,...r.slice(0,l)],c=[...o,...r.slice(l)];if(i.length<2||c.length<2)throw new Error("Need at least 2 teams on each side for dual bracket");const d=hs(i,c);return a.tournament={format:"dual",teams:d.teams,teamsA:d.teamsA,teamsB:d.teamsB,matches:d.matches,matchesA:d.matchesA,matchesB:d.matchesB,grandFinal:d.grandFinal,numRoundsA:d.numRoundsA,numRoundsB:d.numRoundsB,sharedFinal:t,standings:[],meta:{name:"",notes:"",createdAt:new Date().toISOString()}},k(),d}const me={A:{name:"Side A",color:"var(--accent)",bgColor:"rgba(59, 130, 246, 0.05)"},B:{name:"Side B",color:"var(--warning)",bgColor:"rgba(245, 158, 11, 0.05)"},C:{name:"Side C",color:"var(--success)",bgColor:"rgba(34, 197, 94, 0.05)"},D:{name:"Side D",color:"var(--error)",bgColor:"rgba(239, 68, 68, 0.05)"},E:{name:"Side E",color:"#a855f7",bgColor:"rgba(168, 85, 247, 0.05)"},F:{name:"Side F",color:"#06b6d4",bgColor:"rgba(6, 182, 212, 0.05)"}};function bs(e){return["A","B","C","D","E","F"].slice(0,e).map(n=>me[n])}function nn(e,t){const n=t-e;return n===0?"Final":n===1?"SF":n===2?"QF":`R${Math.pow(2,n+1)}`}function Ke(e,t,n=!0){const s=Math.ceil(Math.log2(e)),o=t.color;let r='<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';for(let l=0;l<s;l++){const i=Math.pow(2,s-l-1),c=nn(l+1,s);l>0&&(r+='<div style="color: var(--text-muted); font-size: 0.8rem;">→</div>'),r+=`
      <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
        <div style="font-size: 0.65rem; color: ${o}; font-weight: 600;">${c}</div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
          ${Array.from({length:i},()=>`
            <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
              <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
            </div>
          `).join("")}
        </div>
      </div>
    `}return n&&(r+=`
      <div style="color: var(--text-muted); font-size: 0.8rem;">→</div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
        <div style="font-size: 1.2rem;">🏆</div>
        <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
      </div>
    `),r+="</div>",r}function sn(e,t,n=!0){const s=Math.ceil(Math.log2(e)),o=t.color,r=[];for(let i=0;i<s;i++){const c=Math.pow(2,s-i-1);r.push({name:nn(i+1,s),matches:c})}r.reverse();let l='<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';n&&(l+=`
      <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
        <div style="font-size: 1.2rem;">🏆</div>
        <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
      </div>
      <div style="color: var(--text-muted); font-size: 0.8rem;">←</div>
    `);for(let i=0;i<r.length;i++){const{name:c,matches:d}=r[i];i>0&&(l+='<div style="color: var(--text-muted); font-size: 0.8rem;">←</div>'),l+=`
      <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
        <div style="font-size: 0.65rem; color: ${o}; font-weight: 600;">${c}</div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
          ${Array.from({length:d},()=>`
            <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
              <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
            </div>
          `).join("")}
        </div>
      </div>
    `}return l+="</div>",l}function Qe(e,t,n,s=!1){return`
    <div style="flex: 1; border: 2px solid ${e.color}; border-radius: 12px; padding: 16px; background: ${e.bgColor};">
      <div style="text-align: center; margin-bottom: 16px;">
        <span style="font-weight: 700; font-size: 1.1rem; color: ${e.color};">${e.name}</span>
        <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">(${t} teams)</span>
        ${s?'<span style="color: var(--warning); font-size: 0.75rem;" title="Has byes"> ⚠️</span>':""}
      </div>
      ${n}
    </div>
  `}function an(e,t){return`
    <div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
      <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">GRAND FINAL</div>
      <div style="width: 80px; height: 50px; background: linear-gradient(135deg, ${e.color}, ${t.color}); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
        <span style="font-size: 1.2rem;">🏆</span>
      </div>
      <div style="display: flex; gap: 4px; font-size: 0.65rem; font-weight: 600;">
        <span style="color: ${e.color};">${e.name.split(" ")[1]||"L"}</span>
        <span style="color: var(--text-muted);">vs</span>
        <span style="color: ${t.color};">${t.name.split(" ")[1]||"R"}</span>
      </div>
    </div>
  `}function xs(e,t,n,s=!0){const o=Math.ceil(e/2),r=o,l=e-o,i=Math.ceil(Math.log2(r)),c=Math.ceil(Math.log2(l)),d=Math.pow(2,i)-r,p=Math.pow(2,c)-l,u=Ke(r,t,!s),g=sn(l,n,!s),y=Qe(t,r,u,d>0),m=Qe(n,l,g,p>0);return`
    <div style="text-align: center; margin-bottom: 12px;">
      <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${e} Teams → 2 ${s?"Brackets":"Separate Tournaments"}</span>
    </div>
    <div class="dual-bracket-container" style="display: flex; align-items: stretch; justify-content: center; gap: 10px; flex-wrap: wrap;">
      ${y}
      ${s?an(t,n):""}
      ${m}
    </div>
  `}function ws(e,t=2,n=!0){if(t<=1)return Ke(e,me.A,!0);const s=bs(t),o=Math.ceil(e/t),r=s.map((u,g)=>{const m=g===s.length-1?e-o*g:o,f=Math.ceil(Math.log2(Math.max(m,2))),b=Math.pow(2,f)-m,x=g%2===1?sn(m,u,!n):Ke(m,u,!n);return Qe(u,m,x,b>0)});if(t===2){const u=n?an(s[0],s[1]):"";return`
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${e} Teams → 2 Brackets</span>
      </div>
      
      <!-- Mobile Preview Tabs (visible on small screens via CSS) -->
      <div class="preview-mobile-tabs" style="display: none; justify-content: center; gap: 8px; margin-bottom: 12px;">
        <button class="preview-tab-btn active" data-preview="A" style="padding: 6px 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--accent); color: white; font-size: 0.8rem; cursor: pointer;">Side A</button>
        <button class="preview-tab-btn" data-preview="Final" style="padding: 6px 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-muted); font-size: 0.8rem; cursor: pointer;">Final</button>
        <button class="preview-tab-btn" data-preview="B" style="padding: 6px 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-muted); font-size: 0.8rem; cursor: pointer;">Side B</button>
      </div>
      
      <div class="dual-bracket-container" style="display: flex; align-items: stretch; justify-content: center; gap: 10px; overflow-x: auto; padding-bottom: 10px;">
        <div class="preview-side preview-side-a" style="flex: 1; min-width: 200px;">${r[0]}</div>
        <div class="preview-final">${u}</div>
        <div class="preview-side preview-side-b" style="flex: 1; min-width: 200px;">${r[1]}</div>
      </div>
    `}const l=[],i=[];for(let u=0;u<r.length;u++){const g=s[u],y=g.name.split(" ")[1];i.push({label:y,index:u,color:g.color}),l.push(`
      <div class="preview-bracket preview-bracket-${u}" data-bracket="${u}" style="display: flex; align-items: stretch; justify-content: center; gap: 8px; overflow-x: auto;">
        ${r[u]}
      </div>
    `)}const c=Math.ceil(t/2),d=n&&c===2?`
    <div class="preview-grand-final preview-bracket preview-bracket-final" data-bracket="final" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 15px; margin-top: 10px; border-top: 1px solid var(--border-color);">
      <div style="font-size: 0.7rem; color: var(--success); font-weight: 700;">🏆 GRAND FINAL 🏆</div>
      <div style="width: 100px; height: 50px; background: linear-gradient(135deg, ${s.filter((u,g)=>g%2===0).map(u=>u.color).join(", ")}); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 1.3rem;">👑</span>
      </div>
      <div style="font-size: 0.6rem; color: var(--text-muted);">
        ${Array.from({length:c},(u,g)=>`${String.fromCharCode(65+g*2)}/${String.fromCharCode(66+g*2)}`).join(" vs ")} Winner
      </div>
    </div>
  `:"",p=i.map((u,g)=>`<button class="preview-tab-btn ${g===0?"active":""}" data-preview-bracket="${u.index}" style="padding: 6px 12px; border-radius: 16px; border: 2px solid ${u.color}; background: ${g===0?u.color:"var(--bg-surface)"}; color: ${g===0?"white":u.color}; font-size: 0.8rem; font-weight: 600; cursor: pointer;">${u.label}</button>`).join("");return`
    <div style="text-align: center; margin-bottom: 12px;">
      <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${e} Teams → ${t} Brackets</span>
    </div>
    
    <!-- Mobile Preview Tabs for each bracket -->
    <div class="preview-mobile-tabs preview-bracket-tabs" style="display: none; justify-content: center; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
      ${p}
    </div>
    
    <div class="multi-bracket-container" style="display: flex; flex-direction: column; gap: 15px; overflow-x: auto;">
      ${l.join("")}
      ${d}
    </div>
  `}const Ze=[];let E=[],Y=localStorage.getItem("bracket_mode")||"teams";function Ss(){return Y==="players"?"Players":"Teams"}function ks(){return Y==="players"?"Player":"Team"}function $s(){return Y==="players"?"Enter player name...":"Enter team name..."}function I(e,t,n){e&&(e.addEventListener(t,n),Ze.push({el:e,event:t,handler:n}))}function pe(){localStorage.setItem("bracket_teams",JSON.stringify(E))}function Bs(){try{const e=localStorage.getItem("bracket_teams");e&&(E=JSON.parse(e).map(n=>typeof n=="string"?{name:n,side:null}:n))}catch(e){console.error("Failed to load bracket teams",e),E=[]}}function Cs(){const e=E.length;if(e<2)return`Add at least ${2-e} more team${2-e>1?"s":""}`;if((e&e-1)===0&&e>=4)return`<span style="color: var(--success)">✓ ${e} teams ready (perfect bracket)</span>`;{const n=Math.ceil(Math.log2(e)),o=Math.pow(2,n)-e;return`<span style="color: var(--warning)">${e} teams • ${o} bye${o>1?"s":""} will be assigned</span>`}}function be(e){return typeof e=="string"?e:e.name}const Ls={mount(e,t){var s,o;if(console.log("[BracketPage] Mounting..."),Bs(),!((o=(s=a.tournament)==null?void 0:s.matches)!=null&&o.length)){this.renderEmptyState(e);return}this.renderDualBracket(e);const n=document.createElement("div");n.innerHTML=Ee(),e.appendChild(n),Ae(),ut()},renderEmptyState(e){const t=localStorage.getItem("bracket_dual_mode")==="true";e.innerHTML=`
      <div class="bracket-empty-state">
        <div class="page-intro-header">
          <h2>Create a Bracket</h2>
          <p>Set up a single elimination tournament bracket.</p>
        </div>
        
        <!-- Section 1: Players/Teams List -->
        <div class="bracket-setup-card" style="max-width: 700px; margin: 0 auto 20px; padding: 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="margin: 0;">${Ss()} <span id="bracketTeamCount">(${E.length})</span></h3>
              <button class="help-icon" id="bracketHelpBtn" style="width: 24px; height: 24px; font-size: 0.9rem; font-weight: bold;">?</button>
            </div>
            <div class="player-actions">
              <button class="btn btn-sm btn-secondary" id="importTeamsBtn">Import...</button>
              <button class="btn btn-sm btn-danger" id="clearAllTeamsBtn">Clear All</button>
            </div>
          </div>
          
          <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end; margin-bottom: 16px;">
            <div class="input-group" style="flex: 1;">
              <label for="bracketTeamInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">${ks()} Name</label>
              <input type="text" id="bracketTeamInput" class="form-input" placeholder="${$s()}" />
            </div>
            <button class="btn btn-primary" id="addTeamBtn" style="height: 44px;">Add</button>
          </div>
          
          <ul id="bracketTeamsList" class="player-list custom-scrollbar-y" style="max-height: 300px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; padding: 4px; margin: 0;">
            ${this.renderTeamItems()}
          </ul>
          <button class="btn btn-sm btn-secondary" id="bracketToggleTeamsBtn" style="width: 100%; margin-top: 8px; display: none;">Show All (${E.length})</button>
          
          <p class="players-hint" id="bracketTeamsHint" style="margin-top: 12px; text-align: center;">${Cs()}</p>
          <p class="form-hint" style="margin-top: 8px; text-align: center;">
            Use 4, 8, 16, or 32 ${Y==="players"?"players":"teams"} for perfect brackets. 
            <button type="button" id="bracketHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
          </p>
        </div>
        
        <!-- Section 2: Settings -->
        <div class="bracket-setup-card" style="max-width: 700px; margin: 0 auto 20px; padding: 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div class="settings-section" style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <label class="wc-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span style="color: ${Y==="teams"?"var(--accent)":"var(--text-muted)"}; font-weight: ${Y==="teams"?"600":"400"};">Teams</span>
              <input type="checkbox" id="bracketModeToggle" ${Y==="players"?"checked":""} />
              <span class="slider round"></span>
              <span style="color: ${Y==="players"?"var(--accent)":"var(--text-muted)"}; font-weight: ${Y==="players"?"600":"400"};">Players</span>
            </label>
            <label class="wc-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="bracketDualMode" ${t?"checked":""} />
              <span class="slider round"></span>
              <span>Pool Play</span>
            </label>
            
            <!-- Score Type -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.85rem; color: var(--text-secondary);">Score:</span>
              <select id="bracketScoreType" class="form-input" style="padding: 4px 8px; font-size: 0.85rem;">
                <option value="points" ${localStorage.getItem("bracket_score_type")==="points"||!localStorage.getItem("bracket_score_type")?"selected":""}>Points</option>
                <option value="games" ${localStorage.getItem("bracket_score_type")==="games"?"selected":""}>Games</option>
                <option value="sets" ${localStorage.getItem("bracket_score_type")==="sets"?"selected":""}>Sets</option>
              </select>
            </div>
          </div>
          
          <!-- Pool Settings Section (only visible when Multi-Brackets enabled) -->
          <div id="poolSettingsSection" style="display: ${t?"flex":"none"}; flex-direction: column; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md); margin-top: 16px;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Pool Settings</div>
            
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: center;">
              <!-- Number of Pools -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.85rem; color: var(--text-secondary);">Pools:</span>
                <select id="bracketCount" class="form-input" style="padding: 4px 8px; font-size: 0.85rem;">
                  ${[2,3,4,5,6].map(n=>`<option value="${n}" ${parseInt(localStorage.getItem("bracket_count")||"2")===n?"selected":""}>${n} (A...${String.fromCharCode(64+n)})</option>`).join("")}
                </select>
              </div>
              
              <!-- Pair Finals Toggle -->
              <label class="wc-toggle" id="sharedFinalLabel" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="bracketSharedFinal" ${localStorage.getItem("bracket_shared_final")!=="false"?"checked":""} />
                <span class="slider round"></span>
                <span>Pair Finals 🏆</span>
              </label>

              <!-- Assignment Method -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.85rem; color: var(--text-secondary);">Assign:</span>
                <select id="bracketSideAssign" class="form-input" style="padding: 4px 8px; font-size: 0.85rem;">
                  <option value="random" ${localStorage.getItem("bracket_side_assign")==="random"||!localStorage.getItem("bracket_side_assign")?"selected":""}>Random</option>
                  <option value="alternate" ${localStorage.getItem("bracket_side_assign")==="alternate"?"selected":""}>Alternate</option>
                  <option value="half" ${localStorage.getItem("bracket_side_assign")==="half"?"selected":""}>Split by Pool</option>
                  <option value="manual" ${localStorage.getItem("bracket_side_assign")==="manual"?"selected":""}>Manual</option>
                </select>
                <button type="button" id="assignHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Section 3: Preview (Full Width) -->
        <div id="bracketPreview" class="bracket-preview" style="margin: 20px auto; padding: 15px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: ${E.length>=2?"block":"none"};">
          <div id="bracketPreviewContent"></div>
        </div>
        
        <button class="btn btn-primary" id="createBracketBtn" ${E.length<2?"disabled":""} style="display: block; margin: 0 auto;">Create Bracket</button>
      </div>
    `,this.updatePreview(e),this.attachSetupListeners(e)},renderTeamItems(){return E.map((e,t)=>{const n=be(e),s=e.side||null,o=s?me[s]:null;return`
          <li class="player-item slide-in-up" data-index="${t}" style="animation-duration: 0.3s;">
            <span class="player-number">${t+1}.</span>
            <span class="player-name text-truncate" title="${n}" style="text-align: left; flex: 1;">${n}</span>
            
            <label class="side-toggle" data-index="${t}" style="display: flex; align-items: center; gap: 6px; cursor: pointer; margin: 0 8px;">
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Pool:</span>
              <div class="pool-badge" style="
                min-width: 28px; 
                height: 28px; 
                border-radius: 6px; 
                background: ${o?o.bgColor:"var(--bg-tertiary)"}; 
                border: 1px solid ${o?o.color:"var(--border-color)"};
                color: ${o?o.color:"var(--text-muted)"};
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.85rem;
                transition: all 0.2s;
              ">
                ${s||"-"}
              </div>
            </label>
            
            <button class="player-remove" data-index="${t}">×</button>
          </li>
        `}).join("")},updatePreview(e){const t=e.querySelector("#bracketPreview"),n=e.querySelector("#bracketPreviewContent"),s=e.querySelector("#bracketDualMode"),o=e.querySelector("#bracketSharedFinal"),r=e.querySelector("#bracketCount");if(!(!t||!n))if(E.length>=2){t.style.display="block";const l=(s==null?void 0:s.checked)||!1,i=(o==null?void 0:o.checked)??!0,c=l?parseInt((r==null?void 0:r.value)||"2"):1;l&&c>1?(n.innerHTML=ws(E.length,c,i),this.attachPreviewTabListeners(e)):n.innerHTML=this.renderBracketPreview(E,!1,!0)}else t.style.display="none"},attachPreviewTabListeners(e){const t=e.querySelectorAll(".preview-tab-btn"),n=e.querySelector(".preview-side-a"),s=e.querySelector(".preview-side-b"),o=e.querySelector(".preview-final"),r=e.querySelectorAll(".preview-bracket");t.forEach(l=>{I(l,"click",()=>{const i=l.dataset.preview,c=l.dataset.previewBracket,d=l.style.borderColor||"var(--accent)";if(t.forEach(p=>{p.classList.remove("active");const u=p.style.borderColor||"var(--accent)";p.style.background="var(--bg-surface)",p.style.color=u}),l.classList.add("active"),l.style.background=d,l.style.color="white",i&&(n&&(n.classList.remove("preview-active"),n.classList.add("preview-hidden")),s&&(s.classList.remove("preview-active"),s.classList.add("preview-hidden")),o&&o.classList.remove("preview-active"),i==="A"&&n&&(n.classList.add("preview-active"),n.classList.remove("preview-hidden")),i==="B"&&s&&(s.classList.add("preview-active"),s.classList.remove("preview-hidden")),i==="Final"&&o&&o.classList.add("preview-active")),c!==void 0){r.forEach(u=>{u.classList.remove("preview-active"),u.classList.add("preview-hidden")});const p=e.querySelector(`.preview-bracket-${c}`);p&&(p.classList.add("preview-active"),p.classList.remove("preview-hidden"))}})})},attachSetupListeners(e){const t=e.querySelector("#bracketTeamInput"),n=e.querySelector("#addTeamBtn"),s=e.querySelector("#importTeamsBtn"),o=e.querySelector("#clearAllTeamsBtn"),r=e.querySelector("#createBracketBtn"),l=e.querySelector("#bracketDualMode"),i=e.querySelector("#bracketSharedFinal"),c=e.querySelector("#bracketSideAssign"),d=e.querySelector("#bracketModeToggle");d&&I(d,"change",()=>{Y=d.checked?"players":"teams",localStorage.setItem("bracket_mode",Y),this.renderEmptyState(e)});const p=e.querySelector("#bracketScoreType");p&&I(p,"change",()=>{localStorage.setItem("bracket_score_type",p.value)});const u=()=>{var $;const x=t.value.trim();if(x){if(E.some(B=>be(B).toLowerCase()===x.toLowerCase())){w("Team already exists!","error");return}if(E.length>=32){w("Maximum 32 teams allowed","error");return}E.push({name:x,side:null}),pe(),t.value="",this.renderEmptyState(e),($=e.querySelector("#bracketTeamInput"))==null||$.focus(),w(`${x} added`,"success")}};I(n,"click",u),I(t,"keypress",x=>{x.key==="Enter"&&u()}),s&&I(s,"click",()=>{Pe("Import Teams",`Team Alpha
Team Beta
Team Gamma`,x=>{const $=x.split(`
`);let B=0;$.forEach(h=>{const S=h.trim();S&&(E.some(C=>be(C).toLowerCase()===S.toLowerCase())||E.length>=32||(E.push({name:S,side:null}),B++))}),B>0&&(pe(),this.renderEmptyState(e),w(`Imported ${B} teams`,"success"))},"Enter team names, one per line.")}),I(o,"click",()=>{z("Clear All Teams?","This will remove all teams from the list.","Clear",()=>{E=[],pe(),this.renderEmptyState(e),w("All teams cleared")},!0)});const g=e.querySelector("#bracketTeamsList");g&&I(g,"click",x=>{if(x.target.classList.contains("player-remove")){const B=parseInt(x.target.dataset.index),h=E.splice(B,1)[0];pe(),this.renderEmptyState(e),w(`${be(h)} removed`);return}const $=x.target.closest(".side-toggle");if($){const B=parseInt($.dataset.index),h=E[B],S=parseInt(localStorage.getItem("bracket_count")||"2"),C=["A","B","C","D","E","F"].slice(0,S);if(h.side===null)h.side=C[0];else{const L=C.indexOf(h.side);L>=0&&L<C.length-1?h.side=C[L+1]:h.side=null}pe(),this.renderEmptyState(e),this.updatePreview(e)}});const y=e.querySelector("#bracketToggleTeamsBtn");y&&(E.length>10?(y.style.display="block",y.innerHTML=this.listExpanded?"Show Less ▲":`Show All (${E.length}) ▼`):y.style.display="none",I(y,"click",()=>{const $=e.querySelector("#bracketTeamsList");this.listExpanded=!this.listExpanded,this.listExpanded?($.style.setProperty("max-height","2000px","important"),y.innerHTML="Show Less ▲"):($.style.setProperty("max-height","400px","important"),y.innerHTML=`Show All (${E.length}) ▼`)})),I(l,"change",()=>{const x=e.querySelector("#poolSettingsSection");localStorage.setItem("bracket_dual_mode",l.checked?"true":"false"),x&&(x.style.display=l.checked?"flex":"none"),this.updatePreview(e)});const m=e.querySelector("#bracketCount");m&&I(m,"change",()=>{localStorage.setItem("bracket_count",m.value),this.updatePreview(e)}),i&&I(i,"change",()=>{localStorage.setItem("bracket_shared_final",i.checked?"true":"false"),this.updatePreview(e)}),c&&I(c,"change",()=>{localStorage.setItem("bracket_side_assign",c.value)});const f=e.querySelector("#assignHelp");f&&I(f,"click",x=>{x.preventDefault(),K("Pool Assignment Explained",`<p><strong>How teams are distributed across pools:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li><strong>🎲 Random</strong> – Teams are shuffled randomly into pools</li>
            <li><strong>↔️ Alternate</strong> – Team 1→A, Team 2→B, Team 3→C, etc.</li>
            <li><strong>½ Split by Pool</strong> – Teams divided evenly (first third to A, second to B, etc.)</li>
            <li><strong>✋ Manual</strong> – You set each team's pool using the A/B/C/D/E/F toggle on each team</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 10px;">💡 With <strong>Pair Finals</strong> enabled, each pair of pools (A vs B, C vs D) has its own final match!</p>`)});const b=e.querySelector("#bracketHelpBtn");b&&I(b,"click",x=>{x.preventDefault(),K("Bracket Tournament Guide",`<div style="text-align: left;">
            <h4 style="margin-bottom: 10px; color: var(--accent);">🏆 How It Works</h4>
            <p>Create a single-elimination bracket where teams compete head-to-head. Losers are eliminated, winners advance until one champion remains.</p>
            
            <hr style="margin: 12px 0; border-color: var(--border-color);">
            
            <h4 style="margin-bottom: 10px; color: var(--accent);">📋 Setup Tips</h4>
            <ul style="padding-left: 20px; margin-bottom: 12px;">
              <li><strong>Perfect sizes:</strong> 4, 8, 16, or 32 teams</li>
              <li><strong>Other sizes:</strong> "Byes" are assigned automatically</li>
              <li><strong>A/B Toggle:</strong> Pre-assign teams to bracket sides</li>
            </ul>
            
            <h4 style="margin-bottom: 10px; color: var(--warning);">🔀 A/B Side Toggle</h4>
            <p>Click the toggle next to each team to assign them:</p>
            <ul style="padding-left: 20px; margin-bottom: 12px;">
              <li><strong>A (Blue):</strong> Left side of bracket</li>
              <li><strong>B (Orange):</strong> Right side of bracket</li>
              <li><strong>Gray:</strong> Unassigned (auto-distributed)</li>
            </ul>
            
            <hr style="margin: 12px 0; border-color: var(--border-color);">
            
            <h4 style="margin-bottom: 10px; color: var(--success);">⚡ Dual Brackets Mode</h4>
            <p>Enable "Dual Brackets" for two separate brackets (A vs B) with a shared Grand Final where the winners of each side face off!</p>
          </div>`)});const v=e.querySelector("#bracketHelp");v&&I(v,"click",x=>{x.preventDefault(),K("Bracket Sizes Explained",`<p><strong>Perfect bracket sizes:</strong> 4, 8, 16, or 32 teams</p>
          <p>With these numbers, all teams play every round—no one gets a free pass!</p>
          <hr style="margin: 12px 0; border-color: var(--border-color);">
          <p><strong>What are "byes"?</strong></p>
          <p>If you don't have a perfect number (e.g., 10 teams), some teams get a <strong>bye</strong>—they skip round 1 and go directly to round 2.</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">Example: With 10 teams, 6 teams get byes (advance automatically), and 4 teams play in round 1.</p>
          <hr style="margin: 12px 0; border-color: var(--border-color);">
          <p><strong>Dual Brackets mode:</strong></p>
          <p>Splits teams into Side A and Side B. Each side has its own bracket, and the winners face off in a Grand Final!</p>`)}),I(r,"click",()=>{if(E.length<2){w("Need at least 2 teams","error");return}if(E.length>32){w("Maximum 32 teams allowed","error");return}const x=(l==null?void 0:l.checked)||!1,$=(i==null?void 0:i.checked)??!0;try{x?(vs(E,$),w(`Dual bracket created with ${E.length} teams`,"success"),this.renderDualBracket(e)):(ys(E),w(`Bracket created with ${E.length} teams`,"success"),this.renderBracket(e))}catch(B){w("Error creating bracket: "+B.message,"error")}})},renderBracketPreview(e,t=!1,n=!0){return t?this.renderDualBracketPreview(e,n):this.renderSingleBracketPreview(e)},renderSingleBracketPreview(e){const t=e.length,n=Math.ceil(Math.log2(t)),s=t-1,r=(t&t-1)===0?0:Math.pow(2,n)-t,l=Math.pow(2,Math.floor(Math.log2(t))),i=Math.pow(2,n),c=t-l,d=i-t,p=this.renderMiniBracket(t,"var(--accent)"),u=r>0?`
      <div style="margin-top: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); text-align: center;">
        💡 <strong>${r} teams get byes</strong> (auto-advance to round 2)
        <div style="margin-top: 4px; color: var(--text-muted);">
          For perfect brackets: remove ${c} team${c>1?"s":""} → ${l} teams 
          <span style="margin: 0 6px;">|</span> 
          add ${d} team${d>1?"s":""} → ${i} teams
        </div>
      </div>
    `:`
      <div style="margin-top: 10px; padding: 8px 12px; background: rgba(34, 197, 94, 0.1); border-radius: 6px; font-size: 0.8rem; color: var(--success); text-align: center;">
        ✓ Perfect bracket size! No byes needed.
      </div>
    `;return`
      <div style="text-align: center; margin-bottom: 8px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${t} Teams</span>
        <span style="color: var(--text-muted); font-size: 0.85rem;"> • ${n} rounds • ${s} matches</span>
      </div>
      ${p}
      ${u}
    `},renderDualBracketPreview(e,t=!0){return xs(e.length,me.A,me.B,t)},renderMiniBracketReversed(e,t,n=!0){const s=Math.ceil(Math.log2(e)),o=[];for(let l=0;l<s;l++){const i=Math.pow(2,s-l-1);let c;i===1?c="F":i===2?c="SF":i===4?c="QF":c=`R${i*2}`,o.push({name:c,matches:i})}o.reverse();let r='<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';n&&(r+=`
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <div style="font-size: 1.2rem;">🏆</div>
          <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
        </div>
        <div style="color: var(--text-muted); font-size: 0.8rem;">←</div>
      `);for(let l=0;l<o.length;l++){const{name:i,matches:c}=o[l];l>0&&(r+='<div style="color: var(--text-muted); font-size: 0.8rem;">←</div>'),r+=`
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: ${t}; font-weight: 600;">${i}</div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            ${Array.from({length:c},()=>`
              <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
                <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
              </div>
            `).join("")}
          </div>
        </div>
      `}return r+="</div>",r},renderMiniBracket(e,t,n=!0){const s=Math.ceil(Math.log2(e)),o=[];for(let l=0;l<s;l++){const i=Math.pow(2,s-l-1);i===1?o.push("F"):i===2?o.push("SF"):i===4?o.push("QF"):o.push(`R${i*2}`)}let r='<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';for(let l=0;l<s;l++){const i=Math.pow(2,s-l-1);l>0&&(r+='<div style="color: var(--text-muted); font-size: 0.8rem;">→</div>'),r+=`
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: ${t}; font-weight: 600;">${o[l]}</div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            ${Array.from({length:i},()=>`
              <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
                <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
              </div>
            `).join("")}
          </div>
        </div>
      `}return n&&(r+=`
        <div style="color: var(--text-muted); font-size: 0.8rem;">→</div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <div style="font-size: 1.2rem;">🏆</div>
          <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
        </div>
      `),r+="</div>",r},updateBracketScale(e,t){const n=e.querySelector(".bracket-container"),s=e.querySelector(".dual-bracket-layout"),o=t/100;n&&n.style.setProperty("--bracket-scale",o),s&&s.style.setProperty("--bracket-scale",o)},renderBracket(e){const t=gs(),n=t.length,s=St();e.innerHTML=`
      <div class="page-intro-header">
        <h2>Tournament Bracket</h2>
        <p>Single elimination tournament bracket</p>
      </div>
      <div class="bracket-actions" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
        
        <!-- Size Control -->
        <div class="scale-control" style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">Size</span>
          <input type="range" id="bracketScale" min="50" max="150" value="${a.bracketScale}" style="width: 100px; accent-color: var(--accent);">
          <span id="bracketScaleLabel" style="font-size: 0.85rem; width: 36px;">${a.bracketScale}%</span>
        </div>

        <div style="width: 1px; height: 20px; background: var(--border-color);"></div>

        <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
        <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
      </div>
      <div class="bracket-container">
        ${t.map((d,p)=>`
          <div class="bracket-round" data-round="${p+1}">
            <div class="round-header">${Fe(p+1,n)}</div>
            <div class="round-matches">
              ${d.map(u=>this.renderMatch(u)).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      ${s?this.renderChampions():""}
    `,this.updateBracketScale(e,a.bracketScale);const o=e.querySelector("#bracketScale"),r=e.querySelector("#bracketScaleLabel");o&&(I(o,"input",d=>{const p=parseInt(d.target.value);r.textContent=`${p}%`,this.updateBracketScale(e,p)}),I(o,"change",d=>{const p=parseInt(d.target.value);a.bracketScale=p,k()}));const l=e.querySelector(".bracket-container");I(l,"click",d=>{const p=d.target.closest(".bracket-match");if(p&&!p.classList.contains("bye")){const u=parseInt(p.dataset.matchId);this.openScoreEntry(e,u)}});const i=e.querySelector("#clearBracketBtn");I(i,"click",()=>{z("Clear Bracket?","This will delete the entire bracket and all results.","Clear",()=>{kt(),this.renderEmptyState(e),w("Bracket cleared")},!0)});const c=e.querySelector("#printBracketBtn");c&&I(c,"click",()=>window.print())},renderDualBracket(e){var b,v,x;const t=a.tournament;if(!t||t.format!=="dual"){this.renderBracket(e);return}const n=t.matchesA||[],s=t.matchesB||[],o=t.grandFinal,r=t.numRoundsA||0,l=t.numRoundsB||0,i=$=>{const B={};return $.forEach(h=>{B[h.round]||(B[h.round]=[]),B[h.round].push(h)}),Object.values(B)},c=i(n),d=i(s);e.innerHTML=`
      <div class="page-intro-header">
        <h2>Dual Bracket Tournament</h2>
        <p>Side A vs Side B • Winners meet in Grand Final</p>
      </div>
      <div class="bracket-actions" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
        
        <!-- Size Control -->
        <div class="scale-control" style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">Size</span>
          <input type="range" id="bracketScale" min="50" max="150" value="${a.bracketScale}" style="width: 100px; accent-color: var(--accent);">
          <span id="bracketScaleLabel" style="font-size: 0.85rem; width: 36px;">${a.bracketScale}%</span>
        </div>

        <div style="width: 1px; height: 20px; background: var(--border-color);"></div>

        <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
        <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
      </div>

      <!-- Mobile Tabs -->
      <div class="mobile-bracket-tabs">
        <button class="tab-btn ${a.ui.activeBracketTab==="A"?"active":""}" data-tab="A">Side A</button>
        <button class="tab-btn ${a.ui.activeBracketTab==="Final"?"active":""}" data-tab="Final">Final</button>
        <button class="tab-btn ${a.ui.activeBracketTab==="B"?"active":""}" data-tab="B">Side B</button>
      </div>
      
      <div class="dual-bracket-layout" style="display: flex; gap: 20px; align-items: flex-start; justify-content: center; flex-wrap: wrap; padding: 20px 0;">
        
        <!-- Side A Bracket (Left) -->
        <div class="bracket-side side-a ${a.ui.activeBracketTab==="A"?"mobile-active":""}" style="flex: 1; border: 2px solid var(--accent); border-radius: 12px; padding: 16px; background: rgba(59, 130, 246, 0.05);">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="font-weight: 700; font-size: 1.1rem; color: var(--accent);">Side A</span>
            <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">(${((b=t.teamsA)==null?void 0:b.length)||0} teams)</span>
          </div>
          <div class="bracket-container" style="display: flex; gap: 12px; overflow-x: auto;">
            ${c.map(($,B)=>`
              <div class="bracket-round" data-round="${B+1}">
                <div class="round-header">${Fe(B+1,r)}</div>
                <div class="round-matches">
                  ${$.map(h=>this.renderMatch(h)).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        
        <!-- Grand Final (Center) -->
        <div class="bracket-final ${a.ui.activeBracketTab==="Final"?"mobile-active":""}" style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
          <div style="font-size: 0.85rem; color: var(--success); font-weight: 700; margin-bottom: 8px;">🏆 GRAND FINAL 🏆</div>
          ${o?this.renderMatch(o):'<div style="color: var(--text-muted);">TBD</div>'}
          ${o!=null&&o.winner?`
            <div style="margin-top: 12px; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">Champion</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--success);">
                ${((v=t.teams.find($=>$.id===o.winner))==null?void 0:v.name)||"?"}
              </div>
            </div>
          `:""}
        </div>
        
        <!-- Side B Bracket (Right) -->
        <div class="bracket-side side-b ${a.ui.activeBracketTab==="B"?"mobile-active":""}" style="flex: 1; border: 2px solid var(--warning); border-radius: 12px; padding: 16px; background: rgba(245, 158, 11, 0.05);">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="font-weight: 700; font-size: 1.1rem; color: var(--warning);">Side B</span>
            <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">(${((x=t.teamsB)==null?void 0:x.length)||0} teams)</span>
          </div>
          <div class="bracket-container" style="display: flex; gap: 12px; overflow-x: auto;">
            ${[...d].reverse().map(($,B)=>{const h=l-B;return`
              <div class="bracket-round" data-round="${h}">
                <div class="round-header">${Fe(h,l)}</div>
                <div class="round-matches">
                  ${$.map(S=>this.renderMatch(S)).join("")}
                </div>
              </div>
            `}).join("")}
          </div>
        </div>
        
      </div>
    `,this.updateBracketScale(e,a.bracketScale);const p=e.querySelector("#bracketScale"),u=e.querySelector("#bracketScaleLabel");p&&(I(p,"input",$=>{const B=parseInt($.target.value);u.textContent=`${B}%`,this.updateBracketScale(e,B)}),I(p,"change",$=>{const B=parseInt($.target.value);a.bracketScale=B,k()})),e.querySelectorAll(".mobile-bracket-tabs .tab-btn").forEach($=>{I($,"click",()=>{a.ui.activeBracketTab=$.dataset.tab,k(),this.renderDualBracket(e)})});const y=e.querySelector(".dual-bracket-layout");I(y,"click",$=>{const B=$.target.closest(".bracket-match");if(B&&!B.classList.contains("bye")){const h=parseInt(B.dataset.matchId);this.openScoreEntry(e,h)}});const m=e.querySelector("#clearBracketBtn");I(m,"click",()=>{z("Clear Bracket?","This will delete the entire bracket and all results.","Clear",()=>{kt(),this.renderEmptyState(e),w("Bracket cleared")},!0)});const f=e.querySelector("#printBracketBtn");f&&I(f,"click",()=>window.print())},renderMatch(e){var p,u,g,y;const t=e.team1||e.team2,n=e.isBye,s=e.winner!=null,o=t&&e.team1&&e.team2&&!n,r=s&&e.winner===((p=e.team1)==null?void 0:p.id),l=s&&e.winner===((u=e.team2)==null?void 0:u.id),i=r?"winner":s?"loser":"",c=l?"winner":s?"loser":"",d=m=>!m||!m.side?"":`<span style="background: ${m.side==="A"?"var(--accent)":"var(--warning)"}; color: white; font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; margin-right: 4px; font-weight: bold;">${m.side}</span>`;return`
      <div class="bracket-match ${n?"bye":""} ${s?"complete":""} ${o?"editable":""}" 
           data-match-id="${e.id}">
        <div class="match-team ${i}">
          ${d(e.team1)}<span class="team-name">${((g=e.team1)==null?void 0:g.name)||"TBD"}</span>
          <span class="team-score">${e.score1??"-"}</span>
        </div>
        <div class="match-team ${c}">
          ${d(e.team2)}<span class="team-name">${((y=e.team2)==null?void 0:y.name)||"TBD"}</span>
          <span class="team-score">${e.score2??"-"}</span>
        </div>
        ${n?'<div class="bye-label">BYE</div>':""}
      </div>
    `},renderChampions(){var o,r,l,i;const e=fs(),t=e.find(c=>c.place===1),n=e.find(c=>c.place===2),s=e.filter(c=>c.place===3);return`
      <div class="bracket-champions">
        <h3>Champions</h3>
        <div class="podium">
          <div class="podium-place second">
            <div class="podium-medal">2</div>
            <div class="podium-team">${((o=n==null?void 0:n.team)==null?void 0:o.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
          <div class="podium-place first">
            <div class="podium-medal">1</div>
            <div class="podium-team">${((r=t==null?void 0:t.team)==null?void 0:r.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
          <div class="podium-place third">
            <div class="podium-medal">3</div>
            <div class="podium-team">${((i=(l=s[0])==null?void 0:l.team)==null?void 0:i.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
        </div>
        ${s.length>1?`<div class="also-third"><span class="also-label">Also 3rd:</span> ${s.slice(1).map(c=>{var d;return(d=c.team)==null?void 0:d.name}).join(", ")}</div>`:""}
      </div>
    `},openScoreEntry(e,t){const n=a.tournament.matches.find(c=>c.id===t);if(!n||!n.team1||!n.team2)return;const s=localStorage.getItem("bracket_score_type")||"points",o=s.charAt(0).toUpperCase()+s.slice(1),r=document.createElement("div");r.className="modal-overlay",r.style.display="flex",r.innerHTML=`
      <div class="modal score-modal">
        <div class="modal-header">
          <h3>Enter Score</h3>
          <button class="close-modal" id="closeScoreModal">Close</button>
        </div>
        <div class="modal-body">
          <div class="score-type-label" style="text-align: center; margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted);">
            Scoring: <strong style="color: var(--accent);">${o}</strong>
          </div>
          <div class="score-entry-cards">
            <div class="score-card">
              <div class="score-card-team">${n.team1.name}</div>
              <input type="number" id="score1Input" class="form-input score-input" 
                     value="${n.score1??""}" min="0" max="99" placeholder="0" />
            </div>
            <div class="score-divider">VS</div>
            <div class="score-card">
              <div class="score-card-team">${n.team2.name}</div>
              <input type="number" id="score2Input" class="form-input score-input" 
                     value="${n.score2??""}" min="0" max="99" placeholder="0" />
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="cancelScoreBtn">Cancel</button>
          <button class="btn btn-primary" id="saveScoreBtn">Save Score</button>
        </div>
      </div>
    `,document.body.appendChild(r);const l=()=>{r.remove()},i=()=>{const c=parseInt(document.getElementById("score1Input").value||"0"),d=parseInt(document.getElementById("score2Input").value||"0");if(c===d){w("Scores cannot be tied in elimination","error");return}ms(t,c,d),l(),this.renderDualBracket(e),St()&&w("Tournament complete! View the winners.","success")};r.querySelector("#closeScoreModal").addEventListener("click",l),r.querySelector("#cancelScoreBtn").addEventListener("click",l),r.querySelector("#saveScoreBtn").addEventListener("click",i),r.addEventListener("click",c=>{c.target===r&&l()}),setTimeout(()=>{var c;return(c=document.getElementById("score1Input"))==null?void 0:c.focus()},100)},unmount(){console.log("[BracketPage] Unmounting..."),Ze.forEach(({el:e,event:t,handler:n})=>{e.removeEventListener(t,n)}),Ze.length=0}};function Es(e,t){if(e.length<t*4)throw new Error(`Need at least ${t*4} players for ${t} courts`);const n=[...e].sort((l,i)=>i.skill-l.skill),s=Array.from({length:t},(l,i)=>({id:i+1,players:[],totalSkill:0}));let o=1,r=0;return n.forEach(l=>{s[r].players.push(l),s[r].totalSkill+=l.skill,r+=o,(r>=t||r<0)&&(o*=-1,r+=o)}),s}function Is(e,t=!1,n=1){if(e.length<4)return null;if(t){const s=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]],o=(n-1)%3,[[r,l],[i,c]]=s[o];return{team1:[e[r],e[l]],team2:[e[i],e[c]]}}return{team1:[e[0],e[1]],team2:[e[2],e[3]]}}function Ps(e,t){if(e.length<2)return e;const n=JSON.parse(JSON.stringify(e));for(let s=0;s<n.length;s++){const o=n[s];o.winner===1?s>0&&(xe(n,s,0,s-1,2),xe(n,s,1,s-1,3)):o.winner===2&&s<n.length-1&&(xe(n,s,2,s+1,0),xe(n,s,3,s+1,1)),o.winner=null,o.score1=null,o.score2=null}return n}function xe(e,t,n,s,o){const r=e[t].players[n];e[t].players[n]=e[s].players[o],e[s].players[o]=r}function Ms(e,t,n=!1){const s={};for(const o of["A","B"]){const r=e[o]||[],l=t[o]||0;if(r.length>=4&&l>0){const i=Es(r,l);s[o]={players:r,courts:i,courtCount:l,twist:n,round:1,history:[]}}}return a.winnersCourt={sides:s,twist:n},k(),s}function we(){return a.winnersCourt||null}function Ts(){a.winnersCourt=null,k()}function As(e,t,n,s,o){var l,i;if(!((i=(l=a.winnersCourt)==null?void 0:l.sides)!=null&&i[e]))return!1;const r=a.winnersCourt.sides[e].courts.find(c=>c.id===t);return r?(r.winner=n,r.score1=s,r.score2=o,k(),!0):!1}function Rs(e){var r,l;if(!((l=(r=a.winnersCourt)==null?void 0:r.sides)!=null&&l[e]))return null;const t=a.winnersCourt.sides[e],{courts:n,twist:s}=t;return n.filter(i=>i.winner==null).length>0?{error:"Complete all matches first"}:(t.history=t.history||[],t.history.push({round:t.round,courts:JSON.parse(JSON.stringify(n))}),t.courts=Ps(n),t.round++,k(),t.courts)}const et=[];function R(e,t,n){e&&(e.addEventListener(t,n),et.push({el:e,event:t,handler:n}))}const zs={tempPlayers:[],splitSidesEnabled:!1,listExpanded:!1,mount(e,t){console.log("[WinnersCourtPage] Mounting...");try{const n=localStorage.getItem("wc_setup_players");n&&(this.tempPlayers=JSON.parse(n)),this.splitSidesEnabled=localStorage.getItem("wc_split_sides")==="true"}catch(n){console.error("Failed to load WC setup players",n)}we(),this.render(e)},tempPlayers:[],saveSetup(){localStorage.setItem("wc_setup_players",JSON.stringify(this.tempPlayers))},showHelp(){K("How to Play",`
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
      
      ${Ee()}
    `,this.renderSetup(e.querySelector("#wcSetupContainer")),this.renderActiveGame(e.querySelector("#wcActiveContainer"));const t=document.createElement("div");t.innerHTML=Ee(),e.appendChild(t),Ae(),ut()},renderSetup(e){if(!e)return;const n=!!we(),s=Math.max(1,Math.floor(this.tempPlayers.length/4));e.innerHTML=`
      <div class="wc-setup ${n?"compact":""}">
        <div class="wc-header-row" style="display: flex; align-items: center; justify-content: flex-end; margin-bottom: 8px;">
          <button class="help-icon" id="wcHelpBtn" style="width: 28px; height: 28px; font-size: 1rem; font-weight: bold;">?</button>
        </div>

        ${n?`<p class="wc-description" style="margin-bottom: 12px; color: var(--success);">
            <span style="font-weight: bold;">Game in Progress</span> • You can modify players here for the next game.
           </p>`:'<p class="wc-description">Enter players with skill ratings (1-10) to create balanced court assignments.</p>'}
        
        <div class="wc-form">
          <!-- Players Section -->
          <div class="players-section" style="${n?"border-color: var(--accent);":""} max-width: 700px; margin: 0 auto;">
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
            
            <ul class="player-list custom-scrollbar-y" id="wcPlayersList" style="display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; padding: 4px; max-height: 400px !important; overflow-y: auto !important; transition: max-height 0.3s ease-out !important;">
              ${this.renderPlayerItems()}
            </ul>
             <button class="btn btn-sm btn-secondary" id="wcTogglePlayersBtn" style="width: 100%; margin-top: 8px; display: none;">Show All (${this.tempPlayers.length})</button>
            
            ${this.renderSideSummary()}
            
            <p class="players-hint" id="wcPlayersHint">${this.getPlayersHint()}</p>
          </div>
          
          <!-- Options Section -->
          <div class="wc-options">
            ${this.splitSidesEnabled?"":`
            <div class="wc-option">
              <label for="wcCourts">Courts</label>
              <select id="wcCourts" class="form-input">
                ${Array.from({length:s+1},(o,r)=>r+1).filter(o=>o<=s||o===1).map(o=>`<option value="${o}" ${o===s?"selected":""}>${o} Court${o>1?"s":""} (${o*4} players)</option>`).join("")}
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
          
          ${n?`<div style="text-align: center; margin-top: 10px;">
               <button class="btn btn-secondary btn-sm" id="restartWcBtn">Restart / New Game</button>
             </div>`:`<button class="btn btn-primary btn-lg" id="generateWcBtn" ${this.tempPlayers.length<4?"disabled":""}>Generate Winners Court</button>`}
        </div>
      </div>
    `,this.attachSetupListeners(e),ae()},renderPlayerItems(){const e={showSkill:!0,editableSkill:!0,showSide:this.splitSidesEnabled};if(!this.splitSidesEnabled)return this.tempPlayers.map((o,r)=>qe(o,r,e)).join("");const t=this.tempPlayers.map((o,r)=>({...o,originalIndex:r})).filter(o=>o.side!=="B"),n=this.tempPlayers.map((o,r)=>({...o,originalIndex:r})).filter(o=>o.side==="B");let s="";return t.length>0&&(s+=`<li class="side-header" style="padding: 4px 8px; background: rgba(59, 130, 246, 0.1); color: var(--accent); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-bottom: 4px;">Side A (${t.length})</li>`,s+=t.map(o=>qe(o,o.originalIndex,e)).join("")),n.length>0&&(s+=`<li class="side-header" style="padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: var(--warning); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-top: 8px; margin-bottom: 4px;">Side B (${n.length})</li>`,s+=n.map(o=>qe(o,o.originalIndex,e)).join("")),s},renderPlayerItem(e,t){return""},renderSideSummary(){if(!this.splitSidesEnabled||this.tempPlayers.length===0)return"";const e=this.tempPlayers.filter(s=>s.side!=="B"),t=this.tempPlayers.filter(s=>s.side==="B"),n=(s,o,r)=>{if(s.length===0)return"";const l=Math.floor(s.length/4),i=s.length%4;return`
        <div style="flex: 1; min-width: 120px;">
          <div style="font-weight: 600; color: ${r}; margin-bottom: 4px;">
            ${o}: ${s.length} player${s.length!==1?"s":""}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">
            ${l} court${l!==1?"s":""}${i>0?` (+${i} bench)`:""}
          </div>
          <ul style="margin: 0; padding-left: 16px; font-size: 0.8rem; color: var(--text-secondary);">
            ${s.map(c=>`<li>${c.name} <span style="opacity: 0.6;">(${c.skill===0?"-":c.skill})</span></li>`).join("")}
          </ul>
        </div>
      `};return`
      <div style="display: flex; gap: 16px; margin-top: 12px; padding: 10px; background: var(--bg-tertiary); border-radius: var(--radius-sm); flex-wrap: wrap;">
        ${n(e,"Side A","var(--accent)")}
        ${n(t,"Side B","var(--warning)")}
      </div>
    `},getPlayersHint(){const e=this.tempPlayers.length;if(e<4)return`Add at least ${4-e} more player${4-e>1?"s":""}`;const t=Math.floor(e/4),n=e%4;if(n===0)return`<span style="color: var(--success)">${e} players ready (${t} court${t>1?"s":""})</span>`;{const s=4-n;return`<span style="color: var(--warning)">${e} ready (${t} court${t>1?"s":""}). Need ${s} more for ${t+1} courts!</span>`}},attachSetupListeners(e){const t=e.querySelector("#wcNameInput"),n=e.querySelector("#wcSkillInput"),s=e.querySelector("#addPlayerBtn"),o=e.querySelector("#importBtn"),r=e.querySelector("#clearAllBtn"),l=e.querySelector("#generateWcBtn"),i=e.querySelector("#restartWcBtn"),c=e.querySelector("#wcHelpBtn");c&&R(c,"click",()=>this.showHelp());const d=e.querySelector("#wcSplitSides");d&&R(d,"change",()=>{this.splitSidesEnabled=d.checked,localStorage.setItem("wc_split_sides",this.splitSidesEnabled?"true":"false"),this.renderSetup(e)});const p=e.querySelector("#wcAutoAssignBtn");p&&R(p,"click",()=>{const m=[];this.tempPlayers.forEach((v,x)=>{v.skill===0?(m.push(x),v.side=null):v.side=v.skill>=5?"A":"B"});let f=this.tempPlayers.filter(v=>v.side==="A").length,b=this.tempPlayers.filter(v=>v.side==="B").length;for(let v=m.length-1;v>0;v--){const x=Math.floor(Math.random()*(v+1));[m[v],m[x]]=[m[x],m[v]]}m.forEach(v=>{f<=b?(this.tempPlayers[v].side="A",f++):(this.tempPlayers[v].side="B",b++)}),this.saveSetup(),this.renderSetup(e),w(`Auto-assigned: Side A (${f}) / Side B (${b})`,"success")});const u=e.querySelector("#wcSkillHelp");u&&R(u,"click",m=>{m.preventDefault(),m.stopPropagation(),K("About Skill Levels",`<p><strong>Skill levels are optional!</strong></p>
          <p>Use them to help create balanced teams for the <strong>first round</strong>:</p>
          <ul style="margin: 12px 0; padding-left: 20px;">
            <li><strong>1-3:</strong> Beginner</li>
            <li><strong>4-6:</strong> Intermediate</li>
            <li><strong>7-9:</strong> Advanced</li>
            <li><strong>10:</strong> Pro</li>
            <li><strong>-:</strong> Unknown/Skip</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem;">After round 1, matchups are based on wins/losses only—skill ratings won't affect later rounds.</p>`)}),o&&R(o,"click",()=>{Pe("Import Players",`John
Jane : 8
Bob`,m=>{const f=m.split(`
`);let b=0;f.forEach(v=>{const x=v.split(":"),$=x[0].trim();if(!$)return;let B=0;if(x.length>1){const h=parseInt(x[1].trim());!isNaN(h)&&h>=1&&h<=10&&(B=h)}this.tempPlayers.push({name:$,skill:B}),b++}),b>0&&(this.saveSetup(),this.renderSetup(e),w(`Imported ${b} players`,"success"))},"Enter names, one per line. Optionally add skill level with : # (e.g. 'John : 8'). Default skill is -.","textarea")});const g=()=>{const m=t.value.trim(),f=parseInt(n.value);if(this.tempPlayers.some(v=>v.name.toLowerCase()===m.toLowerCase())){w("Player already exists!","error");return}if(m&&f>=0&&f<=10){const v=this.splitSidesEnabled&&f>0&&f<5?"B":"A";this.tempPlayers.push({name:m,skill:f,side:v}),this.saveSetup(),t.value="",this.renderSetup(e),e.querySelector("#wcNameInput").focus();const x=f===0?"-":f,$=this.splitSidesEnabled?` → Side ${v}`:"";w(`${m} (${x}) added${$}`,"success")}};R(s,"click",g),R(t,"keypress",m=>{m.key==="Enter"&&g()}),R(r,"click",()=>{this.tempPlayers=[],this.saveSetup(),this.renderSetup(e)}),R(e.querySelector("#wcPlayersList"),"click",m=>{const f=m.target.closest(".side-toggle");if(f){const b=parseInt(f.dataset.index);this.tempPlayers[b].side=this.tempPlayers[b].side==="B"?"A":"B",this.saveSetup();const v=e.querySelector("#wcPlayersList");e.parentElement.querySelector(".wc-setup"),v&&(v.innerHTML=this.renderPlayerItems()),this.renderSetup(e)}});const y=e.querySelector("#wcTogglePlayersBtn");y&&(this.tempPlayers.length>10?(y.style.display="block",y.innerHTML=this.listExpanded?"Show Less ▲":`Show All (${this.tempPlayers.length}) ▼`):y.style.display="none",R(y,"click",()=>{const m=e.querySelector("#wcPlayersList");this.listExpanded=!this.listExpanded,this.listExpanded?(m.style.setProperty("max-height","2000px","important"),y.innerHTML="Show Less ▲"):(m.style.setProperty("max-height","400px","important"),y.innerHTML=`Show All (${this.tempPlayers.length}) ▼`)})),R(e.querySelector("#wcPlayersList"),"change",m=>{if(m.target.dataset.action==="update-skill"){const f=parseInt(m.target.dataset.index),b=parseInt(m.target.value);this.tempPlayers[f]&&(this.tempPlayers[f].skill=b,this.saveSetup())}}),R(e.querySelector("#wcPlayersList"),"click",m=>{if(m.target.classList.contains("player-remove")){const f=parseInt(m.target.dataset.index);this.tempPlayers.splice(f,1),this.saveSetup(),this.renderSetup(e)}}),l&&R(l,"click",()=>{this.handleGenerate(e.parentElement)}),i&&R(i,"click",()=>{z("Start New Game?","Current progress will be lost.","Start New",()=>{Ts();const m=e.parentElement;this.render(m)})})},handleGenerate(e){const t=document.getElementById("wcTwist").checked,n=this.tempPlayers.filter(c=>c.side!=="B"),s=this.tempPlayers.filter(c=>c.side==="B"),o={A:n,B:s},r=Math.floor(n.length/4),l=Math.floor(s.length/4),i={A:r,B:l};if(r===0&&l===0){w("Need at least 4 players on a side to start","error");return}try{Ms(o,i,t);const c=r+l;w(`Winners Court created with ${c} court(s)`,"success"),this.render(e)}catch(c){w(c.message,"error")}},renderActiveGame(e){const t=we();if(!t||!t.sides||!e){e&&(e.innerHTML="");return}const{sides:n,twist:s}=t,o=Object.keys(n).filter(r=>{var l,i;return((i=(l=n[r])==null?void 0:l.courts)==null?void 0:i.length)>0});if(o.length===0){e.innerHTML="";return}e.innerHTML=`
      <div class="wc-view" style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 20px; display: flex; gap: 20px; flex-wrap: wrap;">
        ${o.map(r=>this.renderSide(r,n[r],s)).join("")}
      </div>
    `,o.forEach(r=>{const l=e.querySelector(`[data-side="${r}"]`);if(!l)return;const i=l.querySelector(".wc-clear-btn");i&&R(i,"click",()=>{z(`Clear Side ${r}?`,"This will reset this side.","Clear",()=>{t.sides[r]&&(delete t.sides[r],k()),this.render(e.parentElement),w(`Side ${r} cleared`)},!0)});const c=l.querySelector(".wc-next-btn");c&&R(c,"click",()=>{const d=Rs(r);d!=null&&d.error?w(d.error,"error"):(w(`Side ${r} - Round ${t.sides[r].round} started`),this.renderActiveGame(e))}),l.querySelectorAll(".wc-court").forEach(d=>{const p=d.querySelector(".wc-team-horizontal.wc-team1"),u=d.querySelector(".wc-team-horizontal.wc-team2");p&&R(p,"click",()=>{const g=parseInt(d.dataset.courtId);this.handleTeamWin(e,r,g,1)}),u&&R(u,"click",()=>{const g=parseInt(d.dataset.courtId);this.handleTeamWin(e,r,g,2)})})})},renderSide(e,t,n){const{courts:s,round:o}=t,r=e==="A"?"Side A":"Side B",l=e==="A"?"var(--accent)":"var(--warning)";return`
      <div class="wc-side" data-side="${e}" style="flex: 1; min-width: 300px; padding: 15px; border: 2px solid ${l}; border-radius: var(--radius-md); background: rgba(0,0,0,0.2);">
        <div class="wc-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="margin: 0; color: ${l};">${r} — Round ${o}</h3>
          <div class="wc-actions" style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm wc-next-btn">Next Round</button>
            <button class="btn btn-danger btn-sm wc-clear-btn">Clear</button>
          </div>
        </div>
        ${n?'<p class="wc-twist-badge" style="margin-bottom: 10px;">Twist Mode Active</p>':""}
        <div class="wc-courts-grid">
          ${s.map(i=>this.renderCourt(i,n,o)).join("")}
        </div>
      </div>
    `},renderHistory(e){const t=we();if(!t||!t.sides)return;let n=!1,s="";for(const o of["A","B"]){const r=t.sides[o];if(!r||!r.history||r.history.length===0)continue;n=!0;const l=[...r.history].reverse();s+=`
        <div style="margin-bottom: 20px;">
          <h4 style="color: ${o==="A"?"var(--accent)":"var(--warning)"}; margin-bottom: 10px;">Side ${o} History</h4>
          ${l.map(c=>`
            <div class="wc-history-round" style="margin-bottom: 15px; opacity: 0.7;">
              <span style="color: var(--text-muted); font-size: 0.85rem;">Round ${c.round}</span>
              <div class="wc-courts-grid" style="margin-top: 8px;">
                ${c.courts.map(d=>this.renderCourt(d,!1,c.round,!0)).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `}n&&(e.innerHTML=`
      <div style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 20px;">
        <h3 style="color: var(--text-muted); margin-bottom: 20px;">Previous Rounds</h3>
        ${s}
      </div>
    `)},renderCourt(e,t,n,s=!1){var i,c,d,p;const o=Is(e.players,t,n),r=e.winner!=null;return`
      <div class="wc-court ${r?"complete":""} ${!s&&!r?"interactive":""}" data-court-id="${e.id}" style="${s?"pointer-events: none;":""}">
        <div class="wc-court-header">Court ${e.id}</div>
        <div class="wc-court-body-horizontal">
          <div class="wc-team-horizontal wc-team1 ${e.winner===1?"winner":e.winner===2?"loser":""}">
            <div class="wc-player-name">${((i=o==null?void 0:o.team1[0])==null?void 0:i.name)||"?"}</div>
            <div class="wc-player-name">${((c=o==null?void 0:o.team1[1])==null?void 0:c.name)||"?"}</div>
          </div>
          <div class="wc-vs-horizontal">VS</div>
          <div class="wc-team-horizontal wc-team2 ${e.winner===2?"winner":e.winner===1?"loser":""}">
            <div class="wc-player-name">${((d=o==null?void 0:o.team2[0])==null?void 0:d.name)||"?"}</div>
            <div class="wc-player-name">${((p=o==null?void 0:o.team2[1])==null?void 0:p.name)||"?"}</div>
          </div>
        </div>
        ${e.players.length>4?`<div class="wc-bench">
               <strong>Bench:</strong> ${e.players.slice(4).map(u=>u.name).join(", ")}
             </div>`:""}
      </div>
    `},handleTeamWin(e,t,n,s){As(t,n,s,0,0),this.renderActiveGame(e)},unmount(){console.log("[WinnersCourtPage] Unmounting..."),et.forEach(({el:e,event:t,handler:n})=>{e.removeEventListener(t,n)}),et.length=0}};function Ns(){try{console.log("Tournament App: Initialized"),fn({activeLink:"tournament"}),ds("installBtn",()=>{K("Install App on iPhone",`
        <div style="text-align: center;">
          <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
          <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
            <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
            <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
            <li>Tap <strong>Add</strong> in the top right corner.</li>
          </ol>
        </div>
        `)});const e=yn(),t=nt(),n=bn();st(),Gt(D),Os(t),ae(),js(),Ae(),window.addEventListener("resize",qt),Ds(),N(),Te(),D(),qs(),Fs(),ve("",xt),ve("generator",xt),ve("bracket",Ls),ve("winners-court",zs),Hs(),cs(),console.log("[Tournament] Router initialized. Current route:",Zt())}catch(e){console.error("CRITICAL ERROR IN INIT:",e),w("Application failed to start: "+e.message,"error")}}function qs(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const n=t.getBoundingClientRect(),s=document.createElement("span");s.className="ripple",s.style.width=s.style.height=`${Math.max(n.width,n.height)}px`,s.style.left=`${e.clientX-n.left-s.offsetWidth/2}px`,s.style.top=`${e.clientY-n.top-s.offsetHeight/2}px`,t.appendChild(s),setTimeout(()=>s.remove(),600)})}function Hs(){const e=document.querySelector(".tournament-page .container"),t=e==null?void 0:e.querySelector(".tool-header");if(!t){console.error("[Router] Could not find .tool-header to inject navigation. Check HTML structure."),e||console.error("[Router] .tournament-page .container not found either.");return}const n=document.createElement("nav");n.className="page-nav",n.innerHTML=`
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
  `,t.after(n);let s=document.getElementById("pageContainer");s||(s=document.createElement("div"),s.id="pageContainer",s.className="page-container",s.style.display="none",n.after(s));function o(){const{route:r}=Zt(),l=r||"generator";n.querySelectorAll(".page-nav-tab").forEach(d=>{d.dataset.route===l?d.classList.add("active"):d.classList.remove("active")});const i=document.getElementById("toolTitle"),c=document.getElementById("toolSubtitle");if(i&&c){const d={generator:{title:"Americano & Mexicano Generator",subtitle:"Create Americano and Mexicano schedules for your padel group in seconds."},bracket:{title:"Bracket Generator",subtitle:"Create single or dual elimination tournament brackets."},"winners-court":{title:"Winners Court",subtitle:"Skill-based court placement for balanced matches."}},p=d[l]||d.generator;i.textContent=p.title,c.textContent=p.subtitle}s.style.display==="none"&&(s.style.display="block")}o(),window.addEventListener("hashchange",o)}function Fs(){const e=document.querySelectorAll(".section-title, .leaderboard-header h3, .players-header h3");e.forEach(n=>n.classList.add("animate-in"));const t=new IntersectionObserver(n=>{n.forEach(s=>{s.isIntersecting&&s.target.classList.add("animate-in")})},{threshold:.1});e.forEach(n=>t.observe(n))}function Ds(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function Os(e){window.addEventListener("tournament-generator-mounted",()=>{const t=T();t.format&&t.format.addEventListener("change",()=>{a.format=t.format.value,N(),k(),a.schedule.length>0&&se()}),t.scoringMode&&t.scoringMode.addEventListener("change",()=>{a.scoringMode=t.scoringMode.value,Te(),k(),D(),a.schedule.length>0&&W()}),t.points&&t.points.addEventListener("change",()=>{a.pointsPerMatch=parseInt(t.points.value),k(),D(),a.schedule.length>0&&W()}),t.courts&&(t.courts.addEventListener("change",()=>{a.courts=parseInt(t.courts.value),k(),D(),a.schedule.length>0&&se(),a.courtFormat==="custom"&&ge()}),t.courts.addEventListener("input",()=>{const p=t.courts.value;if(p==="")return;let u=parseInt(p)||1;u=Math.max(1,Math.min(50,u)),!a.isLocked&&(t.courts.value=u,a.courts=u,k(),a.courtFormat==="custom"&&ge(),a.schedule.length>0&&se())})),t.courtFormat&&t.courtFormat.addEventListener("change",()=>{a.courtFormat=t.courtFormat.value,st(),k()});const n=document.getElementById("playerNameInput");n&&n.addEventListener("keydown",d=>{d.key==="Enter"&&Ce(n.value)&&(n.value="",_())});const s=document.getElementById("confirmAddBtn");s&&n&&s.addEventListener("click",()=>{Ce(n.value)&&(n.value="",n.focus(),_())}),t.clearAllPlayersBtn&&t.clearAllPlayersBtn.addEventListener("click",()=>{Mt(()=>{_(),ee(),N()})});const o=document.getElementById("importPlayersBtn"),r=document.getElementById("closeImportModal"),l=document.getElementById("cancelImportBtn"),i=document.getElementById("confirmImportBtn");o&&o.addEventListener("click",ot),r&&r.addEventListener("click",ne),l&&l.addEventListener("click",ne),i&&i.addEventListener("click",()=>{const d=document.getElementById("importTextarea");if(!d)return;const p=d.value,u=Tt(p);let g=`Added ${u.added} players.`;u.duplicates>0&&(g+=` Skipped ${u.duplicates} duplicates.`),u.hitLimit&&(g+=" Stopped at 24 max limit.");const y=document.getElementById("importStatus");y&&(y.textContent=g),_(),u.added>0&&u.duplicates===0&&!u.hitLimit&&(setTimeout(ne,1500),w(`Imported ${u.added} players`))});const c=document.getElementById("helpFormat");c&&c.addEventListener("click",()=>{}),$t(t)}),$t(e)}function $t(e){const t=document.getElementById("undoBtn");t&&(t.addEventListener("click",()=>{if(vn())if(w("Undo successful"),e.format.value=a.format,_(),W(),U(),N(),Me(),a.schedule.length>0){e.scheduleSection&&(e.scheduleSection.style.display="block"),e.leaderboardSection&&(e.leaderboardSection.style.display="block");const p=document.getElementById("tournamentActionsSection");p&&(p.style.display="block")}else{e.scheduleSection&&(e.scheduleSection.style.display="none"),e.leaderboardSection&&(e.leaderboardSection.style.display="none");const p=document.getElementById("tournamentActionsSection");p&&(p.style.display="none")}}),window._undoListenerAttached||(document.addEventListener("keydown",p=>{if((p.ctrlKey||p.metaKey)&&p.key==="z"&&!p.shiftKey){p.preventDefault();const u=document.getElementById("undoBtn");u&&!u.disabled&&u.click()}}),window._undoListenerAttached=!0)),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Mt(()=>{_(),ee(),N()})}),e.importPlayersBtn&&e.importPlayersBtn.addEventListener("click",ot),e.closeImportModal&&e.closeImportModal.addEventListener("click",ne),e.cancelImportBtn&&e.cancelImportBtn.addEventListener("click",ne),e.confirmImportBtn&&e.confirmImportBtn.addEventListener("click",()=>{const p=e.importTextarea?e.importTextarea.value:"",u=Tt(p);let g=`Added ${u.added} players.`;u.duplicates>0&&(g+=` Skipped ${u.duplicates} duplicates.`),u.hitLimit&&(g+=" Stopped at 24 max limit."),e.importStatus&&(e.importStatus.textContent=g),_(),u.added>0&&u.duplicates===0&&!u.hitLimit&&(setTimeout(ne,1500),w(`Imported ${u.added} players`))}),e.confirmAddBtn&&e.confirmAddBtn.addEventListener("click",()=>{Ce(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),_())}),e.playerNameInput&&e.playerNameInput.addEventListener("keydown",p=>{p.key==="Enter"&&Ce(e.playerNameInput.value)&&(e.playerNameInput.value="",_())}),e.format&&e.format.addEventListener("change",()=>{a.format=e.format.value,N(),k(),a.schedule.length>0&&se()}),e.courts&&e.courts.addEventListener("change",()=>{a.courts=parseInt(e.courts.value),k(),D(),a.schedule.length>0&&se(),a.courtFormat==="custom"&&ge()}),e.points&&e.points.addEventListener("change",()=>{a.pointsPerMatch=parseInt(e.points.value),k(),D(),a.schedule.length>0&&W()}),e.scoringMode&&e.scoringMode.addEventListener("change",()=>{a.scoringMode=e.scoringMode.value,Te(),k(),D(),a.schedule.length>0&&W()});const n=document.getElementById("rankingCriteria");n&&n.addEventListener("change",()=>{a.rankingCriteria=n.value,jt(),k()}),e.courtFormat&&e.courtFormat.addEventListener("change",()=>{a.courtFormat=e.courtFormat.value,st(),k()}),e.courts&&e.courts.addEventListener("input",()=>{const u=e.courts.value;if(u==="")return;let g=parseInt(u)||1;g=Math.max(1,Math.min(50,g)),!a.isLocked&&(e.courts.value=g,a.courts=g,k(),a.courtFormat==="custom"&&ge(),a.schedule.length>0&&se())}),e.maxRepeats&&e.maxRepeats.addEventListener("change",p=>{const u=parseInt(p.target.value),g=a.maxRepeats;a.isLocked?(p.target.value=g,z("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{a.maxRepeats=u,e.maxRepeats.value=u,k(),D(),w("Max Partner Repeats updated")},!0)):(a.maxRepeats=u,k(),D())});const s=document.getElementById("strictStrategy");s&&s.addEventListener("change",p=>{if(a.pairingStrategy==="optimal"){p.target.checked=!1,w("Strict Pattern is not available with Optimal pairing","info");return}const u=p.target.checked,g=a.strictStrategy;a.isLocked?(p.target.checked=!!g,z("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{a.strictStrategy=u,s.checked=u,k(),w("Strict Mode updated")},!0)):(a.strictStrategy=u,k())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",p=>{const u=p.target.value,g=a.pairingStrategy;if(a.isLocked)p.target.value=g,z("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(a.pairingStrategy=u,e.pairingStrategy.value=u,u==="optimal"){a.strictStrategy=!1;const y=document.getElementById("strictStrategy");y&&(y.checked=!1)}k(),N(),w("Pairing Strategy updated")},!0);else{if(a.pairingStrategy=u,u==="optimal"){a.strictStrategy=!1;const y=document.getElementById("strictStrategy");y&&(y.checked=!1)}k(),N()}}),e.addPartnerPairBtn&&e.addPartnerPairBtn.addEventListener("click",()=>{if(At().length<2){w("Not enough available players to form a pair","error");return}An(),ee(),N(),ae(),w("Fixed pair added","success")});const o=document.getElementById("helpFormat");o&&o.addEventListener("click",()=>{K("Tournament Formats",`
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
        `)});const r=document.getElementById("helpScoring");r&&r.addEventListener("click",()=>{K("Scoring Modes",`
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
        `)});const l=document.getElementById("helpMatchup");l&&l.addEventListener("click",()=>{K("Matchup Rules",`
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
        `)});const i=document.getElementById("helpLeaderboard");i&&i.addEventListener("click",()=>{K("Leaderboard Guide",`
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
        `)}),e.generateBtn&&e.generateBtn.addEventListener("click",Ut),e.printBtn&&e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn&&e.resetBtn.addEventListener("click",Vt),e.gridColumns&&e.gridColumns.addEventListener("input",Wn),e.textSize&&e.textSize.addEventListener("input",()=>{a.textSize=parseInt(e.textSize.value),Ht(),k()});const c=document.getElementById("factoryResetBtn");c&&c.addEventListener("click",()=>{z("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const d=document.getElementById("roundScale");d&&d.addEventListener("input",Gn)}function js(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const n=t.dataset.action,s=t.dataset.id?Number(t.dataset.id):null,o=t.dataset.round?parseInt(t.dataset.round):null;switch(n){case"remove-player":s!==null&&(Pt(s),_());break;case"toggle-player-list":Nt();break;case"remove-pair":s!==null&&(at(s),ee(),N(),ae());break;case"toggle-bye":s!==null&&Xt(s);break;case"toggle-round":o!==null&&Jt(o);break;case"complete-round":Kt();break;case"edit-round":o!==null&&Qt(o);break;case"toggle-visibility":Dt();break;case"toggle-position":Ot();break;case"end-tournament":rt(It);break;case"toggle-toolbar":it();break;case"export-data":lt();break;case"share-results":ct();break;case"add-late-player":on();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const n=t.dataset.action,s=t.dataset.pairId?Number(t.dataset.pairId):null,o=t.dataset.which?parseInt(t.dataset.which):null;if(n==="update-partner"&&s!==null&&o!==null&&(Rt(s,o,Number(t.value)),ee(),N(),ae()),n==="autofill-score"&&a.scoringMode==="race"){const r=parseInt(t.dataset.round),l=parseInt(t.dataset.match),i=parseInt(t.dataset.team),c=t.value;Ye(r,l,i,c)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||a.scoringMode==="race")return;const n=parseInt(t.dataset.round),s=parseInt(t.dataset.match),o=parseInt(t.dataset.team),r=t.value;Ye(n,s,o,r)})}function on(){const e=a.format==="team"||a.format==="teamMexicano";Pe(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",s=>{if(s&&s.trim()){if(a.format==="americano"||a.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;a.format="mexicano",a.allRounds=null,w("Switched to Mexicano format")}Tn(s.trim());const o=document.getElementById("playerCount");o&&(o.textContent=`(${a.players.length})`),U(),w(`Added ${s.trim()} to tournament`)}},`The new ${e?"team":"player"} will join with 0 points and be included starting from the next round. Their ranking will adjust based on future match results.`)}window.removePlayer=e=>{Pt(e),_()};window.updatePreferredPair=(e,t,n)=>{Rt(e,t,n),ee()};window.removePreferredPair=e=>{at(e),ee()};window.updateCustomCourtName=Sn;window.autoFillScore=Ye;window.toggleManualBye=Xt;window.toggleRoundCollapse=Jt;window.completeRound=Kt;window.editRound=Qt;window.toggleLeaderboardVisibility=Dt;window.togglePositionChanges=Ot;window.updateRankingCriteria=jt;window.updateSetupUI=N;window.endTournament=()=>rt(It);window.validateCourts=Oe;window.toggleToolbar=it;window.exportTournamentData=lt;window.shareResults=ct;window.promptAddLatePlayer=on;Ns();
