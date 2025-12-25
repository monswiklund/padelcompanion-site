import{i as Ut,a as _t}from"./layout-Bz-GQuZ0.js";const fe=1,o={version:fe,players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,tournamentName:"",tournamentNotes:"",schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2,tournament:{format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},winnersCourt:null,ui:{currentRoute:"",selectedMatchId:null}},ne=[],Gt=20;function st(){const e=document.getElementById("undoBtn");e&&(e.disabled=ne.length===0)}function xe(){const e=JSON.parse(JSON.stringify(o));ne.push(e),ne.length>Gt&&ne.shift(),st()}function Yt(){if(ne.length===0)return!1;const e=ne.pop();return He(e),st(),!0}const ot="tournament-state";function S(){localStorage.setItem(ot,JSON.stringify({version:o.version,players:o.players,format:o.format,courts:o.courts,scoringMode:o.scoringMode,pointsPerMatch:o.pointsPerMatch,rankingCriteria:o.rankingCriteria,courtFormat:o.courtFormat,customCourtNames:o.customCourtNames,maxRepeats:o.maxRepeats,pairingStrategy:o.pairingStrategy,preferredPartners:o.preferredPartners,tournamentName:o.tournamentName,tournamentNotes:o.tournamentNotes,schedule:o.schedule,currentRound:o.currentRound,leaderboard:o.leaderboard,allRounds:o.allRounds,isLocked:o.isLocked,hideLeaderboard:o.hideLeaderboard,manualByes:o.manualByes,gridColumns:o.gridColumns,textSize:o.textSize,tournament:o.tournament,ui:o.ui,winnersCourt:o.winnersCourt}))}function Jt(){const e=localStorage.getItem(ot);if(!e)return!1;try{let t=JSON.parse(e);return t=Xt(t),o.players=Array.isArray(t.players)?t.players.slice(0,200):[],o.format=t.format||"americano",o.courts=Math.max(1,Math.min(50,t.courts||2)),o.scoringMode=t.scoringMode||"total",o.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),o.rankingCriteria=t.rankingCriteria||"points",o.courtFormat=t.courtFormat||"court",o.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],o.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),o.pairingStrategy=t.pairingStrategy||"optimal",o.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],o.tournamentName=t.tournamentName||"",o.tournamentNotes=t.tournamentNotes||"",o.schedule=Array.isArray(t.schedule)?t.schedule:[],o.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),o.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],o.allRounds=t.allRounds||null,o.isLocked=t.isLocked||!1,o.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,o.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],o.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),o.textSize=Math.max(50,Math.min(200,t.textSize||100)),t.tournament&&(o.tournament={format:t.tournament.format||"single",teams:t.tournament.teams||[],matches:t.tournament.matches||[],standings:t.tournament.standings||[],meta:t.tournament.meta||{name:"",notes:"",createdAt:null}}),t.ui&&(o.ui={currentRoute:t.ui.currentRoute||"",selectedMatchId:t.ui.selectedMatchId||null}),o.winnersCourt=t.winnersCourt||null,!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function Xt(e){const t=e.version||0;return t<fe&&(console.log(`[State] Migrating from v${t} to v${fe}`),t<1&&(e.tournament=e.tournament||{format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},e.ui=e.ui||{currentRoute:"",selectedMatchId:null}),e.version=fe),e}function Kt(){return JSON.parse(JSON.stringify(o))}function He(e){e&&(Object.keys(o).forEach(t=>{e.hasOwnProperty(t)&&(o[t]=e[t])}),o.players=o.players||[],o.schedule=o.schedule||[],o.leaderboard=o.leaderboard||[],S())}function ye(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function x(e,t={}){let s="default",n,a;typeof t=="number"?n=t:typeof t=="string"?s=t:typeof t=="object"&&(s=t.type??"default",n=t.duration,a=t.dismissible);const r={success:{duration:2500,dismissible:!1},info:{duration:3e3,dismissible:!1},warning:{duration:5e3,dismissible:!0},error:{duration:0,dismissible:!0},default:{duration:3e3,dismissible:!1}},c=r[s]||r.default;n=n??c.duration,a=a??c.dismissible;const i=document.querySelector(".toast");i&&i.remove();const l={success:"✓",error:"✕",warning:"⚠",info:"ℹ",default:""},d=document.createElement("div");d.className=`toast ${s}`,s==="error"?(d.setAttribute("role","alert"),d.setAttribute("aria-live","assertive")):(d.setAttribute("role","status"),d.setAttribute("aria-live","polite"));const m=l[s]||"";if(m){const f=document.createElement("span");f.className="toast-icon",f.textContent=m,d.appendChild(f)}const u=document.createElement("span");u.className="toast-message",u.textContent=e,d.appendChild(u);const p=()=>{d.classList.remove("visible"),setTimeout(()=>d.remove(),300)};if(a){const f=document.createElement("button");f.className="toast-close",f.setAttribute("aria-label","Close notification"),f.textContent="×",f.addEventListener("click",p),d.appendChild(f)}document.body.appendChild(d);const g=f=>{f.key==="Escape"&&a&&(p(),document.removeEventListener("keydown",g))};a&&document.addEventListener("keydown",g),setTimeout(()=>d.classList.add("visible"),10),n>0&&setTimeout(()=>{p(),document.removeEventListener("keydown",g)},n)}function le(){return Math.floor(Date.now()+Math.random()*1e6)}let be=null;function at(){return be={playersSection:document.querySelector(".players-section"),tournamentConfig:document.getElementById("tournamentConfig"),format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn"),runningBadge:document.getElementById("runningBadge")},be}function B(){return be||at(),be}function $e(e){switch(o.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return o.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function rt(){var i;const e=B(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const n=parseInt(t.value)||1,a=((i=e.format)==null?void 0:i.value)||o.format,r=a==="team"||a==="teamMexicano"?2:4,c=Math.floor(o.players.length/r);return t.max=Math.max(1,c),n>c&&c>0?(s.textContent=`⚠️ ${o.players.length} players can only fill ${c} court${c!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):c===0&&o.players.length>0?(s.textContent=`⚠️ Need at least ${r} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function it(){const e=B();if(!e.customCourtNamesSection)return;o.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",Ee()):e.customCourtNamesSection.style.display="none"}function Ee(){const e=B();if(!e.customCourtNamesList)return;const t=Math.max(1,o.courts||2);for(Array.isArray(o.customCourtNames)||(o.customCourtNames=[]);o.customCourtNames.length<t;)o.customCourtNames.push(`Court ${o.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,n)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(o.customCourtNames[n]||`Court ${n+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${n}, this.value)"
             placeholder="Court ${n+1}">
    </div>
  `).join("")}function Qt(e,t){o.customCourtNames[e]=t||`Court ${e+1}`,S()}function lt(){const e=B(),t=new Set;o.preferredPartners.forEach(s=>{t.add(s.player1Id),t.add(s.player2Id)}),o.players.filter(s=>!t.has(s.id)),e.addPartnerPairBtn.disabled=!1}function K(){const e=B(),t=s=>{const n=new Set;return o.preferredPartners.forEach(a=>{a.id!==s&&(n.add(a.player1Id),n.add(a.player2Id))}),n};if(o.preferredPartners.length===0){e.preferredPartnersList.innerHTML="";return}e.preferredPartnersList.innerHTML=`
    <ul class="pairs-bullet-list">
      ${o.preferredPartners.map(s=>{const n=t(s.id),a=o.players.filter(i=>i.id===s.player1Id||i.id===s.player2Id||!n.has(i.id)),r=a.filter(i=>i.id!==s.player2Id||i.id===s.player1Id),c=a.filter(i=>i.id!==s.player1Id||i.id===s.player2Id);return`
            <li class="partner-pair-item" data-pair-id="${s.id}">
              <div class="pair-inputs">
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${s.id}" data-which="1">
                  ${r.map(i=>`<option value="${i.id}" ${i.id===s.player1Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
                <span class="pair-separator">&</span>
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${s.id}" data-which="2">
                  ${c.map(i=>`<option value="${i.id}" ${i.id===s.player2Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
              </div>
              <button class="remove-pair-btn" data-action="remove-pair" data-id="${s.id}">
                <span class="remove-icon">×</span>
              </button>
            </li>
          `}).join("")}
    </ul>
  `}function se(){document.querySelectorAll(".form-select").forEach(s=>{if(s.closest(".custom-select-wrapper")||s.classList.contains("no-custom"))return;const n=document.createElement("div");n.classList.add("custom-select-wrapper"),s.parentNode.insertBefore(n,s),n.appendChild(s);const a=document.createElement("div");a.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),s.classList.contains("btn-sm")&&r.classList.add("btn-sm"),s.classList.contains("compact-select")&&(n.classList.add("compact-select"),r.classList.add("compact-select"));const c=s.selectedIndex>=0?s.options[s.selectedIndex]:s.options.length>0?s.options[0]:null;r.innerHTML=`<span>${c?c.text:"Select..."}</span>`;const i=document.createElement("div");i.classList.add("custom-options"),Array.from(s.options).forEach(l=>{const d=document.createElement("div");d.classList.add("custom-option"),d.textContent=l.text,d.dataset.value=l.value,l.selected&&d.classList.add("selected"),d.addEventListener("click",()=>{s.value=d.dataset.value,s.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${d.textContent}</span>`,i.querySelectorAll(".custom-option").forEach(m=>m.classList.remove("selected")),d.classList.add("selected"),a.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width=""}),i.appendChild(d)}),a.appendChild(r),a.appendChild(i),n.appendChild(a),r.addEventListener("click",l=>{l.stopPropagation();const d=a.classList.contains("open");if(document.querySelectorAll(".custom-select.open").forEach(m=>{if(m!==a){m.classList.remove("open"),m.querySelector(".custom-options").classList.remove("show");const u=m.querySelector(".custom-options");u.style.position="",u.style.top="",u.style.left="",u.style.width="",u.style.margin=""}}),d)a.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width="",i.style.margin="";else{a.classList.add("open"),i.classList.add("show");const m=a.getBoundingClientRect();i.style.position="fixed",i.style.top=`${m.bottom+4}px`,i.style.left=`${m.left}px`,i.style.width=`${m.width}px`,i.style.zIndex="9999",i.style.margin="0"}}),s.style.display="none"}),document.addEventListener("click",s=>{s.target.closest(".custom-select")||t()}),document.addEventListener("scroll",s=>{s.target.closest&&s.target.closest(".custom-options")||t()},!0);function t(){document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open");const n=s.querySelector(".custom-options");n.classList.remove("show"),n.style.position="",n.style.top="",n.style.left="",n.style.width="",n.style.margin=""})}}const Zt="modulepreload",en=function(e){return"/"+e},_e={},tn=function(t,s,n){let a=Promise.resolve();if(s&&s.length>0){let c=function(d){return Promise.all(d.map(m=>Promise.resolve(m).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));a=c(s.map(d=>{if(d=en(d),d in _e)return;_e[d]=!0;const m=d.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const p=document.createElement("link");if(p.rel=m?"stylesheet":Zt,m||(p.as="script"),p.crossOrigin="",p.href=d,l&&p.setAttribute("nonce",l),document.head.appendChild(p),m)return new Promise((g,f)=>{p.addEventListener("load",g),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(c){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=c,window.dispatchEvent(i),!i.defaultPrevented)throw c}return a.then(c=>{for(const i of c||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};let P,_,Y,J,oe=[],Be,ie=!1;const Ge=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Ye(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function nn(){this.x=Math.random()*Y,this.y=Math.random()*J-J,this.r=Ye(10,30),this.d=Math.random()*150+10,this.color=Ge[Ye(0,Ge.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return _.beginPath(),_.lineWidth=this.r/2,_.strokeStyle=this.color,_.moveTo(this.x+this.tilt+this.r/4,this.y),_.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),_.stroke()}}function ct(){if(ie){_.clearRect(0,0,Y,J);for(let e=0;e<oe.length;e++)oe[e].draw();sn(),Be=requestAnimationFrame(ct)}}function sn(){for(let e=0;e<oe.length;e++){const t=oe[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>Y+20||t.x<-20||t.y>J)&&ie&&(t.x=Math.random()*Y,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function on(){if(!ie){P||(P=document.createElement("canvas"),P.id="confetti-canvas",P.style.position="fixed",P.style.top="0",P.style.left="0",P.style.width="100%",P.style.height="100%",P.style.pointerEvents="none",P.style.zIndex="9999",document.body.appendChild(P),_=P.getContext("2d")),Y=window.innerWidth,J=window.innerHeight,P.width=Y,P.height=J,window.addEventListener("resize",()=>{Y=window.innerWidth,J=window.innerHeight,P.width=Y,P.height=J}),ie=!0,oe=[];for(let e=0;e<150;e++)oe.push(new nn);ct()}}function an(){ie=!1,_&&_.clearRect(0,0,Y,J),Be&&cancelAnimationFrame(Be),P&&P.remove(),P=null}function rn(){on(),setTimeout(an,5e3)}function A(e,t,s="Confirm",n,a=!1,r=null,c=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const l=document.createElement("div");l.className="modal-overlay confirm-modal",l.style.display="flex";const d=a?"btn btn-danger":"btn btn-primary";l.innerHTML=`
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
          <button class="${d}" id="modalConfirmBtn" style="flex: 1;">${s}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const m=l.querySelector(".modal");m&&m.addEventListener("click",y=>y.stopPropagation());const u=l.querySelector("#modalCancelBtn"),p=l.querySelector("#modalConfirmBtn"),g=l.querySelector("#modalSecondaryBtn"),f=()=>l.remove();u&&u.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),f()}),p&&p.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),f(),n()}),g&&c&&g.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),f(),c()}),l.addEventListener("click",y=>{y.target===l&&f()})}function De(e,t,s,n="",a="text"){const r=document.querySelector(".input-modal");r&&r.remove();const c=document.createElement("div");c.className="modal-overlay input-modal",c.style.display="flex";const i=n?`<p class="modal-hint" style="margin-bottom: var(--space-md); text-align: left;">${n}</p>`:"",l=a==="textarea"?`<textarea id="modalInput" class="form-input" placeholder="${t}" style="width: 100%; min-height: 120px; resize: vertical;"></textarea>`:`<input type="text" id="modalInput" class="form-input" placeholder="${t}" style="width: 100%;">`;c.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        ${i}
        <div class="form-group">
          ${l}
        </div>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: 10px;">
        <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Add</button>
      </div>
    </div>
  `,document.body.appendChild(c),setTimeout(()=>c.classList.add("visible"),10);const d=c.querySelector("#modalInput"),m=c.querySelector("#modalCancelBtn"),u=c.querySelector("#modalConfirmBtn"),p=()=>c.remove();m.onclick=p;const g=()=>{const f=d.value;f&&f.trim()&&(p(),s(f.trim()))};u.onclick=g,d.onkeydown=f=>{f.key==="Enter"&&g(),f.key==="Escape"&&p()},setTimeout(()=>d.focus(),100)}function dt(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=a=>a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,n=document.createElement("div");n.className="final-modal",n.innerHTML=`
    <div class="final-modal-content">
      <h2>Tournament Complete!</h2>
      <div class="final-standings">
        ${e.map((a,r)=>`
          <div class="final-standing-row ${r<3?"top-three":""}">
            <span class="medal">${s(r)}</span>
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
  `,document.body.appendChild(n),rn(),setTimeout(()=>n.classList.add("visible"),10)}function ln(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function Ie(e,t,s){const n=document.querySelector(".alert-modal");n&&n.remove();const a=document.createElement("div");a.className="modal-overlay alert-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector(".modal");r&&r.addEventListener("click",l=>l.stopPropagation());const c=a.querySelector("#modalOkBtn"),i=()=>{a.remove()};c&&c.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),i()}),a.addEventListener("click",l=>{l.target===a&&i()}),a.addEventListener("click",l=>{l.target===a&&i()})}function te(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const n=document.createElement("div");n.className="modal-overlay info-modal",n.style.display="flex",n.innerHTML=`
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
  `,document.body.appendChild(n),setTimeout(()=>n.classList.add("visible"),10);const a=n.querySelector(".modal");a&&a.addEventListener("click",l=>l.stopPropagation());const r=n.querySelector("#modalOkBtn"),c=n.querySelector("#modalCloseX"),i=()=>n.remove();r&&(r.onclick=i),c&&(c.onclick=i),n.addEventListener("click",l=>{l.target===n&&i()})}function cn(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',t.style.cursor="pointer",document.body.appendChild(t);let s=!1,n=null;const a=()=>{s||(s=!0,n&&clearTimeout(n),t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},100))};t.addEventListener("click",a),requestAnimationFrame(()=>{t.classList.add("active")});const r=t.querySelector(".countdown-number"),c=["3","2","1","GO!"];let i=0;const l=()=>{if(s)return;if(i>=c.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const d=c[i];r.textContent=d,r.className="countdown-number"+(d==="GO!"?" countdown-go":""),r.style.animation="none",requestAnimationFrame(()=>{r.style.animation=""}),i++,n=setTimeout(l,d==="GO!"?600:800)};n=setTimeout(l,100)})}window.closeFinalModal=ln;function Je(e){if(!e.trim())return!1;const t=e.trim();return o.players.length>=24?(x("Maximum 24 players allowed"),!1):o.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(x(`Player "${t}" already exists`),!1):(o.players.push({id:le(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),o.players.length%4===0&&(o.courts=o.players.length/4),S(),!0)}function ut(e){o.players=o.players.filter(t=>t.id!==e),S()}function dn(e){if(console.log("removeAllPlayers called, players:",o.players.length),o.players.length===0){console.log("No players to remove");return}A("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),o.players=[],o.preferredPartners=[],S(),console.log("Players cleared, state:",o.players),e&&e()},!0)}function un(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(c=>c.trim()).filter(c=>c);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,n=0,a=!1;for(const c of t){if(o.players.length>=24){a=!0;break}if(o.players.some(i=>i.name.toLowerCase()===c.toLowerCase())){n++;continue}o.players.push({id:le(),name:c,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}const r=Math.floor(o.players.length/4);return r>o.courts&&(o.courts=r),S(),{added:s,duplicates:n,hitLimit:a}}function mn(e){const t={id:le(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return o.players.push(t),o.leaderboard.push(t),S(),!0}function mt(){const e=new Set;return o.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),o.players.filter(t=>!e.has(t.id))}function pn(){const e=mt();e.length<2||(o.preferredPartners.push({id:le(),player1Id:e[0].id,player2Id:e[1].id}),S())}function Fe(e){o.preferredPartners=o.preferredPartners.filter(t=>t.id!==e),S()}function pt(e,t,s){const n=o.preferredPartners.find(a=>a.id===e);n&&(t===1?n.player1Id=s:n.player2Id=s,S())}const ft={format:{label:"Format",type:"select",options:[{value:"americano",label:"Americano"},{value:"mexicano",label:"Mexicano"},{value:"team",label:"Team Americano"},{value:"teamMexicano",label:"Team Mexicano"}],helpId:"helpFormat"},courts:{label:"Courts",type:"number",min:1,max:50},scoringMode:{label:"Scoring",type:"select",options:[{value:"total",label:"Total Points"},{value:"race",label:"Race to"},{value:"time",label:"Timed"}],helpId:"helpScoring"},pointsPerMatch:{label:"Points",type:"number",min:4,max:50},maxRepeats:{label:"Repeats",type:"select",options:[{value:0,label:"No repeats"},{value:1,label:"Max 1x"},{value:2,label:"Max 2x"},{value:3,label:"Max 3x"},{value:99,label:"Unlimited"}],mexicanoOnly:!0,helpId:"helpMatchup"},pairingStrategy:{label:"Pairing",type:"select",options:[{value:"optimal",label:"Optimal"},{value:"oneThree",label:"1&3 vs 2&4"},{value:"oneTwo",label:"1&2 vs 3&4"},{value:"oneFour",label:"1&4 vs 2&3"}],mexicanoOnly:!0,helpId:"helpMatchup"},strictStrategy:{label:"Prioritize Pattern",type:"toggle",mexicanoOnly:!0,helpId:"helpMatchup"}};function Xe(){return o.scoringMode==="time"?"Minutes":o.scoringMode==="race"?"Race to":"Total Points"}function j(){var r,c;const e=document.getElementById("tournamentConfig");if(!e)return;if(hn(e),o.isLocked){e.style.display="none";return}e.style.display="block",o.format==="team"||o.format;const t=o.format==="mexicano"||o.format==="teamMexicano",s=((r=o.players)==null?void 0:r.length)||0,n=Math.max(1,Math.floor(s/4));o.courts>n&&(o.courts=n,S()),o.pointsPerMatch<4?(o.pointsPerMatch=4,S()):o.pointsPerMatch>50&&(o.pointsPerMatch=50,S());let a='<div class="config-grid">';if(a+=U("format",o.format),t?(a+='<div class="config-spacer"></div>',a+=U("scoringMode",o.scoringMode),a+=U("pointsPerMatch",o.pointsPerMatch,{label:Xe()}),a+=U("maxRepeats",o.maxRepeats),a+=U("courts",o.courts),a+=U("pairingStrategy",o.pairingStrategy),a+=U("strictStrategy",o.strictStrategy,{disabled:o.pairingStrategy==="optimal"}),o.pairingStrategy!=="optimal"&&o.strictStrategy&&o.maxRepeats===0&&(a+=`
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `)):(a+=U("courts",o.courts),a+=U("scoringMode",o.scoringMode),a+=U("pointsPerMatch",o.pointsPerMatch,{label:Xe()})),a+="</div>",t&&((c=o.preferredPartners)==null?void 0:c.length)>0){const i=o.preferredPartners.map(l=>{const d=o.players.find(u=>u.id===l.player1Id),m=o.players.find(u=>u.id===l.player2Id);return d&&m?`${d.name} & ${m.name}`:null}).filter(Boolean);i.length>0&&(a+=`
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
    `);e.innerHTML=a}function fn(e,t,s){const n=s.options.find(r=>String(r.value)===String(t)),a=n?n.label:t;return`
    <div class="ui-select-wrapper" data-key="${e}" tabindex="0">
      <div class="ui-trigger">
        <span>${a}</span>
        <div class="ui-arrow"></div>
      </div>
      <div class="ui-options">
        ${s.options.map(r=>`<div class="ui-option ${String(r.value)===String(t)?"selected":""}" data-value="${r.value}">${r.label}</div>`).join("")}
      </div>
    </div>
  `}function yn(e,t,s){const n=s.min??1,a=s.max??99,r=Number.isFinite(t)?t:n,c=r<=n,i=r>=a,l=e==="pointsPerMatch"&&o.scoringMode!=="time"?2:1;return`
    <div class="ui-stepper" data-key="${e}" data-min="${n}" data-max="${a}">
      <button type="button" class="stepper-btn" data-delta="-${l}" ${c?"disabled":""} aria-label="Decrease ${e}">−</button>
      <input type="number" class="stepper-input" value="${r}" min="${n}" max="${a}" step="${l}" aria-label="${e} value">
      <button type="button" class="stepper-btn" data-delta="${l}" ${i?"disabled":""} aria-label="Increase ${e}">+</button>
    </div>
  `}function gn(e,t,s={}){const n=!!t,a=!!s.disabled;return`
    <div class="ui-toggle ${n?"active":""} ${a?"disabled":""}" 
         data-key="${e}" 
         role="switch" 
         aria-checked="${n}"
         tabindex="${a?"-1":"0"}">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  `}function Pe(e){var s;const t={...ft[e]};if(e==="courts"){const n=((s=o.players)==null?void 0:s.length)||0,a=Math.floor(n/4);t.max=Math.max(1,a)}return t}function U(e,t,s={}){const n=Pe(e),a=s.readonly,r=s.label??(n==null?void 0:n.label)??e;let c="";if(!n||a){let i=t;if(n&&n.options){const l=n.options.find(d=>d.value===t);l&&(i=l.label)}c=`<span class="config-value-static">${i}</span>`}else n.type==="select"?c=fn(e,t,n):n.type==="number"?c=yn(e,t,n):n.type==="toggle"?c=gn(e,t,s):c=`<span class="config-value">${t}</span>`;return`
    <div class="config-row ${(n==null?void 0:n.type)==="toggle"?"toggle-row":""}" data-config-key="${e}">
      <div class="config-label-container">
        <span class="config-label">${r}:</span>
        ${n!=null&&n.helpId?`<button class="config-help" data-action="show-help" data-help-id="${n.helpId}">?</button>`:""}
      </div>
      ${c}
    </div>
  `}function Le(e,t){o[e]=t,S();const s=B();if(e==="format"&&s.format&&(s.format.value=t),e==="courts"&&s.courts&&(s.courts.value=t),e==="scoringMode"&&s.scoringMode){s.scoringMode.value=t;const n={time:10,race:14,total:28};o.pointsPerMatch=n[t]||28,s.points&&(s.points.value=o.pointsPerMatch)}e==="pointsPerMatch"&&s.points&&(s.points.value=t),e==="maxRepeats"&&s.maxRepeats&&(s.maxRepeats.value=t),e==="pairingStrategy"&&s.pairingStrategy&&(s.pairingStrategy.value=t,t==="optimal"&&(o.strictStrategy=!1)),e==="strictStrategy"&&document.getElementById("strictStrategy")&&(document.getElementById("strictStrategy").checked=t),j(),tn(()=>Promise.resolve().then(()=>xn),void 0).then(n=>n.renderPlayers&&n.renderPlayers())}function hn(e){if(e.dataset.listenersAttached){console.log("Tournament Config: Listeners already attached");return}e.dataset.listenersAttached="true",console.log("Tournament Config: Attaching listeners to",e),e.addEventListener("change",t=>{var n;console.log("Tournament Config: Change event",t.target);const s=t.target;if(s.classList.contains("config-input")||s.classList.contains("stepper-input")){const a=s.closest(".ui-stepper"),r=s.dataset.key||(a==null?void 0:a.dataset.key);if(!r)return;const c=Pe(r),i=(c==null?void 0:c.min)??1,l=(c==null?void 0:c.max)??99;let d=parseInt(s.value,10);isNaN(d)&&(d=i),r==="courts"&&d>l&&Ie("Too many courts",`You need at least ${d*4} players to use ${d} courts. With ${((n=o.players)==null?void 0:n.length)||0} players, you can have a maximum of ${l} courts.`)}}),e.addEventListener("click",t=>{console.log("Tournament Config: Click event",t.target);const s=t.target.closest(".stepper-btn");if(s){const l=s.closest(".ui-stepper"),d=l==null?void 0:l.dataset.key;if(!d)return;const m=Pe(d),u=parseInt(s.dataset.delta,10)||0,p=(m==null?void 0:m.min)??1,g=(m==null?void 0:m.max)??99,f=parseInt(o[d],10);if(u>0&&f>=g&&d==="courts"){Ie("Too many courts",`You need at least ${(f+1)*4} players to use ${f+1} courts.`);return}const y=Math.min(g,Math.max(p,(Number.isFinite(f)?f:p)+u));y!==f&&Le(d,y);return}const n=t.target.closest(".ui-toggle");if(n&&!n.classList.contains("disabled")){const l=n.dataset.key,d=!o[l];Le(l,d);return}const a=t.target.closest(".ui-select-wrapper");if(a&&!t.target.closest(".ui-option")){const l=a.classList.contains("open");if(document.querySelectorAll(".ui-select-wrapper.open").forEach(d=>{d.classList.remove("open");const m=d.querySelector(".ui-options");m&&(m.style.display="none"),d.closest(".config-row")&&(d.closest(".config-row").style.zIndex="")}),!l){a.classList.add("open");const d=a.querySelector(".ui-options");d&&(d.style.display="block"),a.closest(".config-row")&&(a.closest(".config-row").style.zIndex="100")}}const r=t.target.closest(".ui-option");if(r){const l=r.closest(".ui-select-wrapper"),d=r.dataset.value,m=l.dataset.key,u=ft[m];let p=d;(u.type==="number"||m==="courts"||m==="maxRepeats"||m==="pointsPerMatch")&&!isNaN(d)&&d.trim()!==""&&(p=parseInt(d)),Le(m,p)}const c=t.target.closest("[data-action]");if(!c)return;const i=c.dataset.action;if(i==="show-help"){const l=c.dataset.helpId,d=document.getElementById(l);d&&d.click()}if(i==="edit-pairs"||i==="add-pair"){if(i==="add-pair")try{const l=new Set;if(o.preferredPartners&&o.preferredPartners.forEach(m=>{l.add(String(m.player1Id)),l.add(String(m.player2Id))}),o.players.filter(m=>!l.has(String(m.id))).length<2){x("Not enough available players to form a pair","error");return}}catch(l){console.error("Validation error:",l)}bn()}})}function vn(e){e.target.closest(".ui-select-wrapper")||document.querySelectorAll(".ui-select-wrapper.open").forEach(t=>{t.classList.remove("open");const s=t.querySelector(".ui-options");s&&(s.style.display="none"),t.closest(".config-row")&&(t.closest(".config-row").style.zIndex="")})}function bn(){o.preferredPartners||(o.preferredPartners=[]);const e=document.createElement("div");e.className="modal-overlay active",e.style.display="flex";const t=(b,L)=>String(b)===String(L),s=b=>o.players.find(L=>t(L.id,b)),n=b=>o.preferredPartners.find(L=>t(L.id,b));let a=null,r=null;const c=`
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
    ${c}
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
  `,document.body.appendChild(e);const i=b=>{b.key==="Escape"&&d()};document.addEventListener("keydown",i);const l=()=>document.removeEventListener("keydown",i),d=()=>{l(),e.remove()},m=e.querySelector("#sel1"),u=e.querySelector("#sel2"),p=e.querySelector("#addBtn"),g=e.querySelector("#pairsList"),f=(b,L,M)=>{const I=o.players.find(E=>t(E.id,L)),h=I?I.name:M;let C=`
      <div class="select-trigger ${!!I?"filled":""}">
        <span>${h}</span>
        <span class="select-arrow">▼</span>
      </div>
      <div class="select-options">
    `;const k=new Set;o.preferredPartners.forEach(E=>{E.player1Id&&k.add(String(E.player1Id)),E.player2Id&&k.add(String(E.player2Id))}),o.players.forEach(E=>{const q=String(E.id),Q=t(E.id,L);if(k.has(q)&&!Q)return;const $=b.id==="sel1"&&t(E.id,r)||b.id==="sel2"&&t(E.id,a);C+=`<div class="option ${Q?"selected":""} ${$?"disabled":""}" data-val="${E.id}">${E.name}</div>`}),C+="</div>",b.innerHTML=C},y=()=>{if(o.preferredPartners.length===0){g.innerHTML='<div style="text-align: center; padding: 2rem; color: #52525b;">No fixed pairs yet</div>';return}g.innerHTML=o.preferredPartners.map(b=>{const L=o.players.find(I=>t(I.id,b.player1Id)),M=o.players.find(I=>t(I.id,b.player2Id));return!L||!M?"":`
        <div class="pair-item-clean">
          <span class="pair-names">${L.name} & ${M.name}</span>
          <div class="pair-remove-icon" data-remove="${String(b.id)}">✕</div>
        </div>
      `}).join("")},v=()=>{f(m,a,"Select Player 1"),f(u,r,"Select Player 2"),y(),a&&r&&!t(a,r)?(p.classList.add("ready"),p.disabled=!1):(p.classList.remove("ready"),p.disabled=!0)};v(),e.addEventListener("click",b=>{if(b.target===e||b.target.id==="closePairsModal"){d();return}b.target.closest(".custom-select")||(e.querySelectorAll(".select-options").forEach(h=>h.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(h=>h.classList.remove("active")));const L=b.target.closest(".select-trigger");if(L){const w=L.parentElement.querySelector(".select-options"),C=w.classList.contains("open");e.querySelectorAll(".select-options").forEach(k=>k.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(k=>k.classList.remove("active")),C||(w.classList.add("open"),L.classList.add("active"))}const M=b.target.closest(".option");if(M){const h=M.dataset.val,w=s(h);if(w){const C=M.closest(".custom-select").id;C==="sel1"&&(a=w.id),C==="sel2"&&(r=w.id),v(),e.querySelectorAll(".select-options").forEach(k=>k.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(k=>k.classList.remove("active"))}}if(b.target.closest("#addBtn")&&!p.disabled){if(o.preferredPartners.some(C=>t(C.player1Id,a)&&t(C.player2Id,r)||t(C.player1Id,r)&&t(C.player2Id,a))){alert("Pair already exists");return}if(o.preferredPartners.some(C=>t(C.player1Id,a)||t(C.player2Id,a)||t(C.player1Id,r)||t(C.player2Id,r))&&!confirm("One of these players is already in another pair. Create anyway?"))return;o.preferredPartners.push({id:le(),player1Id:a,player2Id:r}),S(),a=null,r=null,v(),j()}const I=b.target.closest(".pair-remove-icon");if(I){const h=I.dataset.remove,w=n(h);w&&(Fe(w.id),v(),j())}})}document.addEventListener("click",vn);function G(){const e=B();if(e.playerList.innerHTML=o.players.map((t,s)=>{const n=['<option value="">Auto</option>'];for(let a=1;a<=o.courts;a++){const r=t.lockedCourt===a?"selected":"";n.push(`<option value="${a}" ${r}>Court ${a}</option>`)}return`
    <li class="player-item" data-id="${t.id}">
      <span class="player-number">${s+1}.</span>
      <span class="player-name">${t.name}</span>
      
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
  `}).join(""),window.updatePlayerCourtLock||(window.updatePlayerCourtLock=(t,s)=>{const n=o.players.find(a=>a.id===t);n&&(n.lockedCourt=s?parseInt(s):null,S())}),e.playerCount.textContent=`(${o.players.length})`,e.generateBtn.disabled=o.players.length<4,o.players.length>=4){const t=o.players.length%4===0,s=o.courts*4,n=o.players.length>s;if(!t||n){const a=n?`exceeds capacity for ${o.courts} court${o.courts>1?"s":""}`:`uneven number for ${o.courts} court${o.courts>1?"s":""}`;e.playersHint.textContent=`${o.players.length} players ready! Since it ${a}, a queue system will be applied.`,e.playersHint.style.color="var(--warning)"}else e.playersHint.textContent=`${o.players.length} players ready`,e.playersHint.style.color="var(--success)"}else e.playersHint.textContent=`Add at least ${4-o.players.length} more player${4-o.players.length>1?"s":""}`,e.playersHint.style.color="";K(),lt(),wn(),rt(),se(),j()}function Oe(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${o.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function wn(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");if(!e)return;o.players.length<6?(e.style.display="none",t&&t.classList.add("expanded")):(e.style.display="block",t!=null&&t.classList.contains("expanded")||(e.innerHTML=`Show All Players (${o.players.length}) ▼`))}function yt(){const e=B();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function ge(){const e=B();e.importModal.style.display="none"}const xn=Object.freeze(Object.defineProperty({__proto__:null,hideImportModal:ge,renderPlayers:G,showImportModal:yt,togglePlayerList:Oe},Symbol.toStringTag,{value:"Module"}));let Me=!1;function Se(){const e=B(),t=o.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(n=>{n.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(n=>{n.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function gt(){var n;const e=((n=document.getElementById("scoringMode"))==null?void 0:n.value)||o.scoringMode,t=document.getElementById("scoringValueLabel"),s=document.getElementById("points");!t||!s||(e==="total"?(t.textContent="Points",s.value=24):e==="race"?(t.textContent="Target",s.value=21):e==="time"&&(t.textContent="Minutes",s.value=12))}function Sn(){const e=B();e.gridColumns&&(e.gridColumns.max=6)}function Cn(){const e=document.querySelector(".matches-grid");if(!e)return o.maxCourts||2;const t=e.offsetWidth,n=Math.floor(t/180),a=o.maxCourts||o.courts||2;return Math.min(Math.max(n,1),a)}function ht(){const e=B();if(Me||o.gridColumns!==0)return;const t=Cn();document.querySelectorAll(".matches-grid").forEach(n=>{n.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function Ln(){const e=B(),t=parseInt(e.gridColumns.value);t===0?(Me=!1,ht()):Me=!0,o.gridColumns=t,Se(),S()}function vt(){const e=B(),t=o.textSize,s=t/100,n=document.getElementById("scheduleSection");n&&n.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function kn(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(o.roundScale=parseInt(e.value)/100,S());const s=o.roundScale||1,n=document.getElementById("roundsContainer");n&&n.style.setProperty("--card-scale",s),e&&(e.value=Math.round(s*100)),t&&(t.textContent=`${Math.round(s*100)}%`)}function bt(){return[...o.leaderboard].sort((e,t)=>{switch(o.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const s=e.played>0?e.wins/e.played:0,n=t.played>0?t.wins/t.played:0;return Math.abs(n-s)>.001?n-s:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const a=e.points+e.pointsLost,r=t.points+t.pointsLost,c=a>0?e.points/a:0,i=r>0?t.points/r:0;return Math.abs(i-c)>.001?i-c:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function O(){const e=B(),t=document.getElementById("toggleVisibilityBtn");t&&(o.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const s=document.getElementById("togglePositionBtn");if(s&&(o.showPositionChanges?(s.innerHTML="Ranks",s.classList.add("toggle-on"),s.classList.remove("toggle-off")):(s.innerHTML="Ranks",s.classList.add("toggle-off"),s.classList.remove("toggle-on")),s.title="Click to toggle rank change indicators"),!o.leaderboard||o.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const n=!o.hideLeaderboard,a=o.showPositionChanges,r=!n&&!a,c=bt();c.forEach((l,d)=>{const m=d+1,u=l.previousRank||m;l.rankChange=u-m});let i=r?[...c].sort(()=>Math.random()-.5):c;e.leaderboardBody.innerHTML=i.map((l,d)=>{const m=c.findIndex(h=>h.id===l.id)+1,u=r?"-":m;let p="";a&&l.played>0&&!r&&(l.rankChange>0?p='<span class="rank-up">▲</span>':l.rankChange<0?p='<span class="rank-down">▼</span>':p='<span class="rank-same">-</span>');const g=l.points-(l.pointsLost||0),f=l.played>0?Math.round((l.wins||0)/l.played*100)+"%":"0%",y=g>0?"+":"",v=n?l.points:"-",b=n?l.wins||0:"-",L=n?`<span class="${g>0?"text-success":g<0?"text-error":""}">${y}${g}</span>`:"-",M=n?f:"-",I=n||a?l.played:"-";return`
    <tr>
      <td>${u} ${p}</td>
      <td class="player-name-cell">${l.name}</td>
      <td class="font-bold">${v}</td>
      <td>${b}</td>
      <td>${L}</td>
      <td>${M}</td>
      <td>${I}</td>
    </tr>
  `}).join("")}function wt(){o.hideLeaderboard=!o.hideLeaderboard,O()}function xt(){o.showPositionChanges=!o.showPositionChanges,O()}function St(e){o.rankingCriteria=e,O()}function $n(){const e=[...o.players],t=e.length,s=o.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const n=e.length,a=[],r=e[0],c=e.slice(1);for(let i=0;i<n-1;i++){const l=[r,...c],d=[];for(let y=0;y<n/2;y++){const v=l[y],b=l[n-1-y];!v.isBye&&!b.isBye&&d.push([v,b])}const m=[],u=new Set;for(let y=0;y<d.length-1;y+=2)d[y]&&d[y+1]&&(m.push({court:Math.floor(y/2)+1,team1:d[y],team2:d[y+1]}),d[y].forEach(v=>u.add(v.id)),d[y+1].forEach(v=>u.add(v.id)));const p=m.slice(0,s),g=new Set;p.forEach(y=>{y.team1.forEach(v=>g.add(v.id)),y.team2.forEach(v=>g.add(v.id))});const f=o.players.filter(y=>!y.isBye&&!g.has(y.id));p.length>0&&a.push({number:a.length+1,matches:p,byes:f}),c.unshift(c.pop())}return a}function En(){const e=[...o.players],t=e.length,s=o.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const n=e.length,a=[],r=e[0],c=e.slice(1);for(let i=0;i<n-1;i++){const l=[r,...c],d=[],m=new Set;for(let f=0;f<n/2;f++){const y=l[f],v=l[n-1-f];!y.isBye&&!v.isBye&&(d.push({court:d.length+1,team1:[y],team2:[v]}),m.add(y.id),m.add(v.id))}const u=d.slice(0,s),p=new Set;u.forEach(f=>{f.team1.forEach(y=>p.add(y.id)),f.team2.forEach(y=>p.add(y.id))});const g=o.players.filter(f=>!f.isBye&&!p.has(f.id));u.length>0&&a.push({number:a.length+1,matches:u,byes:g}),c.unshift(c.pop())}return a}function Bn(){const e=[...o.players];ye(e);const t=o.courts,s=[],n=new Set;for(let r=0;r<e.length-1&&s.length<t;r+=2)s.push({court:s.length+1,team1:[e[r]],team2:[e[r+1]]}),n.add(e[r].id),n.add(e[r+1].id);const a=e.filter(r=>!n.has(r.id));return[{number:1,matches:s,byes:a}]}function In(){const e=[...o.leaderboard].sort((i,l)=>l.points-i.points),t=o.courts,s=e.filter(i=>!o.manualByes.includes(i.id)),n=e.filter(i=>o.manualByes.includes(i.id)),a=[],r=new Set;for(let i=0;i<s.length-1&&a.length<t;i+=2)a.push({court:a.length+1,team1:[s[i]],team2:[s[i+1]]}),r.add(s[i].id),r.add(s[i+1].id);const c=[...n,...s.filter(i=>!r.has(i.id))];return{number:o.schedule.length+1,matches:a,byes:c}}function Pn(){const e=o.courts,t=e*4,s=[],n=new Set,a=[...o.players],r=[];a.forEach(f=>{if(n.has(f.id))return;const y=Ct(f.id);if(y){const v=a.find(b=>b.id===y);v?(s.push({type:"pair",players:[f,v]}),n.add(v.id)):s.push({type:"single",players:[f]})}else s.push({type:"single",players:[f]});n.add(f.id)}),ye(s);const c=[];let i=0;for(const f of s)i+f.players.length<=t?(c.push(f),i+=f.players.length):r.push(...f.players);const l=[],d=[];c.forEach(f=>{f.type==="pair"?l.push(f.players):d.push(f.players[0])}),ye(d);for(let f=0;f<d.length-1;f+=2)l.push([d[f],d[f+1]]);ye(l);const m=[],u=new Set,p=[],g=[];for(let f=0;f<l.length-1;f+=2){const y=l[f],v=l[f+1],b=[...y,...v].find(L=>L.lockedCourt);b?p.push({team1:y,team2:v,lockedCourt:b.lockedCourt}):g.push({team1:y,team2:v})}return p.forEach(f=>{if(m.length>=e)return;let y=f.lockedCourt;(u.has(y)||y>e)&&(y=null),y?(u.add(y),m.push({court:y,team1:f.team1,team2:f.team2})):g.push({team1:f.team1,team2:f.team2})}),g.forEach(f=>{if(m.length>=e)return;let y=1;for(;u.has(y);)y++;y<=e&&(u.add(y),m.push({court:y,team1:f.team1,team2:f.team2}))}),m.sort((f,y)=>f.court-y.court),l.length%2!==0&&m.length<l.length/2&&r.push(...l[l.length-1]),[{number:1,matches:m,byes:r}]}function Ct(e){if(!o.preferredPartners)return null;const t=o.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function Mn(e){const t=o.courts,s=t*4,n=new Set(o.manualByes),a=[],r=new Set,c=[...e];c.forEach(h=>{if(r.has(h.id)||n.has(h.id))return;const w=Ct(h.id);if(w){const C=c.find(k=>k.id===w);C?n.has(C.id)?a.push({type:"single",players:[h]}):(a.push({type:"pair",players:[h,C]}),r.add(C.id)):a.push({type:"single",players:[h]})}else a.push({type:"single",players:[h]});r.add(h.id)}),a.sort((h,w)=>{const C=q=>{const Q=q.players.reduce((W,$)=>W+($.byeCount||0),0),re=q.players.reduce((W,$)=>W+($.played||0),0);return{bye:Q/q.players.length,play:re/q.players.length}},k=C(h),E=C(w);return Math.abs(E.bye-k.bye)>.1?E.bye-k.bye:k.play-E.play});const i=[],l=[];let d=0;for(const h of a)d+h.players.length<=s&&(l.push(h),i.push(...h.players),d+=h.players.length);const m=new Set(i.map(h=>h.id)),u=c.filter(h=>!m.has(h.id)),p=[],g=[];l.forEach(h=>{h.type==="pair"?p.push(h.players):g.push(h.players[0])}),g.sort((h,w)=>w.points-h.points);let f=0;for(;f<g.length-3;f+=4){const h=g[f],w=g[f+1],C=g[f+2],k=g[f+3],E=[{name:"oneThree",team1:[h,C],team2:[w,k]},{name:"oneTwo",team1:[h,w],team2:[C,k]},{name:"oneFour",team1:[h,k],team2:[w,C]}];let q;const Q=o.pairingStrategy!=="optimal"&&o.strictStrategy;o.strictStrategy;const re=o.maxRepeats!==void 0?o.maxRepeats:99,W=E.map($=>{const N=$.team1[0].id,F=$.team1[1].id,T=$.team2[0].id,z=$.team2[1].id,Ve=(jt,Vt)=>{const ce=e.find(Ce=>Ce.id===jt);return ce!=null&&ce.playedWith?ce.playedWith.filter(Ce=>Ce===Vt).length:0},Ue=Ve(N,F)+Ve(T,z),zt=$.team1[0].points+$.team1[1].points,Ht=$.team2[0].points+$.team2[1].points,Dt=Math.abs(zt-Ht),Ft=re<99&&Ue>re,Ot=$.name===o.pairingStrategy,Wt=N*1e6+F*1e4+T*100+z;return{...$,repeatPenalty:Ue,violatesRepeats:Ft,isPreferred:Ot,rankingImbalance:Dt,tieBreaker:Wt}});if(W.sort(($,N)=>$.tieBreaker-N.tieBreaker),o.pairingStrategy==="optimal")q={...[...W].sort((N,F)=>N.repeatPenalty!==F.repeatPenalty?N.repeatPenalty-F.repeatPenalty:N.rankingImbalance!==F.rankingImbalance?N.rankingImbalance-F.rankingImbalance:N.tieBreaker-F.tieBreaker)[0],relaxedConstraint:null};else{const $=W.find(N=>N.isPreferred)||W[0];if(!$.violatesRepeats)q={...$,relaxedConstraint:null};else if(Q)q={...$,relaxedConstraint:"repeats"};else{const N=W.filter(F=>!F.violatesRepeats);N.length>0?q={...[...N].sort((T,z)=>T.isPreferred!==z.isPreferred?T.isPreferred?-1:1:T.rankingImbalance!==z.rankingImbalance?T.rankingImbalance-z.rankingImbalance:T.tieBreaker-z.tieBreaker)[0],relaxedConstraint:"pattern"}:q={...[...W].sort((T,z)=>T.repeatPenalty!==z.repeatPenalty?T.repeatPenalty-z.repeatPenalty:T.isPreferred!==z.isPreferred?T.isPreferred?-1:1:T.rankingImbalance!==z.rankingImbalance?T.rankingImbalance-z.rankingImbalance:T.tieBreaker-z.tieBreaker)[0],relaxedConstraint:"tier3"}}}p.push(q.team1),p.push(q.team2)}f<g.length-1&&p.push([g[f],g[f+1]]);const y=p.map(h=>({players:h,points:h.reduce((w,C)=>w+C.points,0)}));y.sort((h,w)=>w.points-h.points);const v=[],b=new Set,L=new Set,M=[],I=[];for(let h=0;h<y.length-1;h+=2){const w=y[h],C=y[h+1],k=[...w.players,...C.players].find(E=>E.lockedCourt);k?M.push({t1:w,t2:C,lockedCourt:k.lockedCourt}):I.push({t1:w,t2:C})}return M.forEach(h=>{if(v.length>=t)return;let w=h.lockedCourt;(L.has(w)||w>t)&&(w=null),w?(L.add(w),v.push({court:w,team1:h.t1.players,team2:h.t2.players}),h.t1.players.forEach(C=>b.add(C.id)),h.t2.players.forEach(C=>b.add(C.id))):I.push({t1:h.t1,t2:h.t2})}),I.forEach(h=>{if(v.length>=t)return;let w=1;for(;L.has(w);)w++;w<=t&&(L.add(w),v.push({court:w,team1:h.t1.players,team2:h.t2.players}),h.t1.players.forEach(C=>b.add(C.id)),h.t2.players.forEach(C=>b.add(C.id)))}),v.sort((h,w)=>h.court-w.court),y.forEach(h=>{h.players.some(w=>b.has(w.id))||h.players.forEach(w=>u.push(w))}),{number:o.schedule.length+1,matches:v,byes:u}}function Z(e,t,s,n,a,r=null){const c=o.leaderboard.find(i=>i.id===e);c&&(c.points+=t,c.played+=1,c.pointsLost=(c.pointsLost||0)+s,n?c.wins=(c.wins||0)+1:a||(c.losses=(c.losses||0)+1),r&&!c.playedWith&&(c.playedWith=[]),r&&c.playedWith.push(r))}function ee(e,t,s,n,a){const r=o.leaderboard.find(c=>c.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-s,n?r.wins=(r.wins||0)-1:a||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let Te=null;function Tn(e){Te=e}let Re=null;function Rn(e){Re=e}function D(){const e=B(),t=o.format,s=t==="team"||t==="teamMexicano",n=document.getElementById("playersHeader");n&&n.firstChild&&(n.firstChild.textContent=s?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const a=document.querySelector(".setup-card");if(!a)return;[a.querySelector(".setup-grid"),a.querySelector(".setup-grid-3"),document.getElementById("customCourtNamesSection")].forEach(f=>{if(!f)return;f.querySelectorAll("input, select, button").forEach(v=>{if(!v.classList.contains("always-enabled")){if(o.isLocked){if(v.disabled=!0,v.classList.add("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const L=b.querySelector(".custom-select");L&&L.classList.add("disabled")}}}else if(v.disabled=!1,v.classList.remove("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const L=b.querySelector(".custom-select");L&&L.classList.remove("disabled")}}}})});const c=document.getElementById("advancedSettingsContent");c&&(c.querySelectorAll("input, select, button").forEach(y=>{if(y.disabled=!1,y.classList.remove("locked"),y.tagName==="SELECT"){const v=y.closest(".custom-select-wrapper");if(v){const b=v.querySelector(".custom-select");b&&b.classList.remove("disabled")}}}),lt());const i=document.getElementById("runningBadge");o.isLocked?(e.generateBtn.style.display="none",i&&(i.style.display="inline-flex")):(e.generateBtn.style.display="block",i&&(i.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=!1);const l=String(t).trim(),u=l.toLowerCase()==="mexicano"||l==="teamMexicano",p=e.advancedSettingsContent;p&&(u?(p.classList.remove("collapsed"),p.classList.add("expanded")):(p.classList.remove("expanded"),p.classList.add("collapsed")));const g=document.getElementById("strictStrategy");g&&(g.disabled=!1),Re&&Re()}function An(){const e=B(),t=e.format.value,s=t==="team"||t==="teamMexicano",n=s?2:4;if(o.players.length<n){x(`Not enough ${s?"teams":"players"} (min ${n})`,"error");return}o.format=e.format.value,o.courts=parseInt(e.courts.value),o.scoringMode=e.scoringMode.value,o.pointsPerMatch=parseInt(e.points.value),o.currentRound=1;const a=o.format==="team"||o.format==="teamMexicano"?2:4,r=Math.floor(o.players.length/a),c=()=>{xe(),o.leaderboard=o.players.map(l=>({...l,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),o.format==="americano"?(o.allRounds=$n(),o.schedule=[o.allRounds[0]]):o.format==="team"?(o.allRounds=En(),o.schedule=[o.allRounds[0]]):o.format==="teamMexicano"?(o.schedule=Bn(),o.allRounds=null):(o.schedule=Pn(),o.allRounds=null),e.leaderboardSection.style.display="block",O(),Te&&Te(),e.scheduleSection.style.display="block";const i=document.getElementById("tournamentActionsSection");i&&(i.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const l=document.getElementById("round-0");l&&(l.classList.add("animate-in","highlight"),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100),o.isLocked=!0,D(),S(),x("🎾 Tournament started! Round 1 ready")};if(o.courts>r){if(r===0){Ie("Not Enough Players",`You need at least ${a} players/teams to start!`);return}const i=o.courts;o.courts=r,e.courts&&(e.courts.value=o.courts),x(`Adjusted courts: ${i} → ${r}`)}cn().then(()=>{c()})}function Nn(){const e=B();A("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{xe(),o.schedule=[],o.currentRound=0,o.leaderboard=[],o.allRounds=null,o.isLocked=!1,o.hideLeaderboard=!1,o.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",D(),S(),x("Tournament reset")},!0)}function Lt(e){A("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{o.isLocked=!1,o.hideLeaderboard=!1,D();const t=[...o.leaderboard].sort((s,n)=>n.points-s.points);Hn(),je(),x("Tournament saved to history"),e&&e(t),O(),S()},!0)}function kt(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function $t(e=null){const t=e||o,s=new Date().toLocaleDateString(),n=new Date().toLocaleTimeString();let a="data:text/csv;charset=utf-8,";a+=`Tournament Results
`,a+=`Date,${s} ${n}
`,a+=`Format,${t.format}
`,a+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,a+=`Final Standings
`,a+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((l,d)=>d.points-l.points).forEach((l,d)=>{const m=(l.points||0)-(l.pointsLost||0);a+=`${d+1},"${l.name}",${l.points},${l.wins},${l.played},${l.pointsLost||0},${m}
`}),a+=`
`,a+=`Match History
`,a+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(l=>{l.completed&&l.matches.forEach(d=>{const m=d.team1.map(g=>g.name).join(" & "),u=d.team2.map(g=>g.name).join(" & ");let p=`Court ${d.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[d.court-1]?p=t.customCourtNames[d.court-1]:t.courtFormat==="number"&&(p=`${d.court}`),a+=`Round ${l.number},"${p}","${m}",${d.score1},${d.score2},"${u}"
`})});const c=encodeURI(a),i=document.createElement("a");i.setAttribute("href",c),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function Et(e=null){var r;const t=e||o;let n=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;n+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,n+=`Format: ${t.format}

`,n+=`Top Standings:
`,[...t.leaderboard].sort((c,i)=>i.points-c.points).slice(0,5).forEach((c,i)=>{n+=`${i+1}. ${c.name}: ${c.points} pts (${c.wins}W)
`}),n+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(n),x("Results copied to clipboard")}catch(c){console.error("Failed to copy: ",c),x("Failed to copy results","error")}}class qn{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),n=t%60;return`${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const n=this.audioContext.createOscillator(),a=this.audioContext.createGain();n.type="sine",n.frequency.value=t,n.connect(a),a.connect(this.audioContext.destination),n.start(),a.gain.setValueAtTime(.1,this.audioContext.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),n.stop(this.audioContext.currentTime+s)}catch(n){console.warn("Audio play failed",n)}}}let R=null;function zn(){const e=B();if(e.matchTimerContainer){if(o.scoringMode!=="time"){e.matchTimerContainer.style.display="none",R&&(R.pause(),R=null);return}if(e.matchTimerContainer.style.display="flex",R)R.duration!==o.pointsPerMatch&&R.setDuration(o.pointsPerMatch);else{R=new qn({duration:o.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed"),e.runningBadge&&(e.runningBadge.style.display="inline-flex",e.runningBadge.classList.add("running"))):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),e.runningBadge&&(e.runningBadge.style.display="none",e.runningBadge.classList.remove("running")),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=R.formatTime(o.pointsPerMatch*60),e.timerStartBtn.onclick=()=>R.start(),e.timerPauseBtn.onclick=()=>R.pause(),e.timerResetBtn.onclick=()=>R.reset(),e.timerAddBtn.onclick=()=>R.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>R.addTime(-60));const t=()=>{const s=()=>{De("Set Timer Duration","Enter minutes (e.g. 12)",n=>{const a=parseInt(n);a>0?(o.pointsPerMatch=a,S(),R.setDuration(a),x(`Timer set to ${a} minutes`)):x("Invalid minutes","error")})};R.isRunning?A("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{R.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function V(){const e=B();zn(),he();const t=o.schedule.length-1;e.roundsContainer.innerHTML=o.schedule.map((r,c)=>{const i=c===t,l=r.completed,d=l&&!i,m=l?r.matches.map(u=>`${u.score1}-${u.score2}`).join(" · "):"";return`
    <div class="round ${l?"completed":"ongoing"} ${d?"collapsed":""}" 
         id="round-${c}" 
         data-round="${c}">
      <div class="round-header" data-action="toggle-round" data-round="${c}">
        <span class="round-title">
          Round ${r.number}
          ${l?'<span class="round-status completed">✓ Completed</span>':'<span class="round-status ongoing">● Ongoing</span>'}
        </span>
        ${l?`<span class="round-summary" style="${d?"":"display: none"}">${m}</span>`:""}
        ${l?`<span class="collapse-icon">${d?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${r.matches.map((u,p)=>`
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${$e(u.court)}</span>
                <span class="match-info-sub">
                  ${o.scoringMode==="total"?`Total ${o.pointsPerMatch}`:o.scoringMode==="race"?`Race to ${o.pointsPerMatch}`:`${o.pointsPerMatch} mins`}
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
                ${l?`
                <div class="score-input-row">
                  <span class="score-display">${u.score1} - ${u.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${c}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${c}-${p}-1" 
                         min="0" max="${o.scoringMode==="total"?o.pointsPerMatch:999}" placeholder="0" 
                         value="${u.score1||""}"
                         data-action="autofill-score" data-round="${c}" data-match="${p}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${c}-${p}-2" 
                         min="0" max="${o.scoringMode==="total"?o.pointsPerMatch:999}" placeholder="0"
                         value="${u.score2||""}"
                         data-action="autofill-score" data-round="${c}" data-match="${p}" data-team="2">
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
        ${!l&&i?`
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${o.manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${o.leaderboard.map(u=>`
              <button class="bye-chip ${o.manualByes.includes(u.id)?"selected":""}" 
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
  `}).join(""),Sn(),Se(),vt(),Bt();const s=o.schedule.findIndex(r=>!r.completed),n=s>=0?s:0,a=document.getElementById(`round-${n}`);a&&setTimeout(()=>{a.scrollIntoView({behavior:"smooth",block:"start"})},100)}function he(){const e=document.getElementById("gameDetails");if(!e)return;const t={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},s={total:"Total Points",race:"Race to Points",time:"Time Based"},n=[{label:t[o.format]||"Tournament"},{label:`${o.courts} Courts`},{label:s[o.scoringMode]},{label:o.scoringMode==="time"?`${o.pointsPerMatch} Mins`:`${o.pointsPerMatch} Pts`}];e.innerHTML=n.map(a=>`
    <div class="game-detail-item">
      <span class="detail-label">${a.label}</span>
    </div>
  `).join("")}Tn(V);function Ae(e,t,s,n){setTimeout(Bt,0);let a=parseInt(n);if(isNaN(a)||a<0)return;const r=parseInt(o.pointsPerMatch);if(!(isNaN(r)||r<=0)){if(o.scoringMode==="total"){if(a>r){a=r;const d=document.getElementById(`score-${e}-${t}-${s}`);d&&(d.value=a)}const c=s===1||s==="1"?2:1,i=r-a,l=document.getElementById(`score-${e}-${t}-${c}`);l&&i>=0&&(l.value=i)}else if(o.scoringMode==="race"){if(a<r){const c=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${c}`);i&&(i.value=r)}else if(a===r){const c=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${c}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function Bt(){const e=o.schedule.findIndex(r=>!r.completed);if(e===-1)return;const t=o.schedule[e],s=document.querySelector(".complete-round-btn");if(!s)return;let n=!0;const a=parseInt(o.pointsPerMatch);for(let r=0;r<t.matches.length;r++){const c=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`);if(!c||!i)continue;const l=c.value,d=i.value;if(l===""||d===""){n=!1;break}const m=parseInt(l),u=parseInt(d);if(o.scoringMode==="total"){if(m+u!==a){n=!1;break}}else if(m<0||u<0){n=!1;break}}s.disabled=!1,n?(s.classList.remove("btn-warning"),s.classList.add("btn-success"),s.textContent=`Complete Round ${t.number}`):(s.classList.add("btn-warning"),s.classList.remove("btn-success"),s.textContent="Complete Anyway")}function It(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const n=t.querySelector(".collapse-icon");n&&(n.textContent="▼");const a=t.querySelector(".round-summary");a&&(a.style.display="none")}else{t.classList.add("collapsed");const n=t.querySelector(".collapse-icon");n&&(n.textContent="▶");const a=t.querySelector(".round-summary");a&&(a.style.display="")}}function Pt(e){const t=o.manualByes.indexOf(e);if(t!==-1){o.manualByes.splice(t,1),V();return}const s=o.courts*4,n=o.leaderboard.length,a=Math.max(0,n-s);if(a===0){x(`All ${n} players needed for ${o.courts} courts.`);return}if(o.manualByes.length>=a){x(`Max ${a} can rest. Deselect someone first.`);return}o.manualByes.push(e),V()}function Mt(){const e=o.schedule.length-1,t=o.schedule[e];let s=!0;const n=[];if(t.matches.forEach((a,r)=>{const c=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`),l=c==null?void 0:c.value,d=i==null?void 0:i.value;let m=!0;(l===""||d==="")&&(m=!1,l===""&&(c==null||c.classList.add("error")),d===""&&(i==null||i.classList.add("error")));const u=parseInt(l)||0,p=parseInt(d)||0;if(o.scoringMode==="total"){const g=parseInt(o.pointsPerMatch,10);u+p!==g?(m=!1,c==null||c.classList.add("error"),i==null||i.classList.add("error")):l!==""&&d!==""&&(c==null||c.classList.remove("error"),i==null||i.classList.remove("error"))}else u<0||p<0?(m=!1,c==null||c.classList.add("error"),i==null||i.classList.add("error")):l!==""&&d!==""&&(c==null||c.classList.remove("error"),i==null||i.classList.remove("error"));m||(s=!1,n.push($e(a.court)))}),!s){let a="Some matches have missing or invalid scores.";n.length>0&&(a=`
        <p style="margin-bottom: var(--space-md);">The following matches need scores:</p>
        <ul style="text-align: left; margin: 0 0 var(--space-md) var(--space-lg); list-style: disc;">
          ${n.map(c=>`<li>${c}</li>`).join("")}
        </ul>
        <p>Do you want to complete the round anyway?</p>
      `),A("Incomplete/Invalid Scores",a,"Yes, Complete Anyway",()=>{ke(t)},!0);return}if(o.scoringMode==="race"){const a=[],r=o.pointsPerMatch;if(t.matches.forEach((c,i)=>{const l=document.getElementById(`score-${e}-${i}-1`),d=document.getElementById(`score-${e}-${i}-2`),m=parseInt(l==null?void 0:l.value)||0,u=parseInt(d==null?void 0:d.value)||0;m<r&&u<r&&a.push($e(c.court))}),a.length>0){const c=a.join(", ");A("Low Scores Detected",`On ${c}, neither team reached the target of ${r}. Is this correct?`,"Yes, Complete Round",()=>{ke(t)},!0);return}}ke(t)}function ke(e){const t=o.schedule.findIndex(i=>i===e);bt().forEach((i,l)=>{const d=o.leaderboard.find(m=>m.id===i.id);d&&(d.previousRank=l+1)}),e.matches.forEach((i,l)=>{const d=document.getElementById(`score-${t}-${l}-1`),m=document.getElementById(`score-${t}-${l}-2`),u=parseInt(d==null?void 0:d.value)||0,p=parseInt(m==null?void 0:m.value)||0;i.score1=u,i.score2=p;const g=u===p,f=u>p,y=p>u;i.team1[1]?(Z(i.team1[0].id,u,p,f,g,i.team1[1].id),Z(i.team1[1].id,u,p,f,g,i.team1[0].id),Z(i.team2[0].id,p,u,y,g,i.team2[1].id),Z(i.team2[1].id,p,u,y,g,i.team2[0].id)):(Z(i.team1[0].id,u,p,f,g,null),Z(i.team2[0].id,p,u,y,g,null))});const n=document.querySelector(".complete-round-btn");if(n&&(n.classList.add("completing"),n.textContent="✓ Completing..."),xe(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const l=o.leaderboard.find(d=>d.id===i.id);l&&(l.byeCount=(l.byeCount||0)+1)}),o.manualByes=[],o.currentRound++,o.format==="americano"&&o.allRounds&&o.currentRound<=o.allRounds.length){const i={...o.allRounds[o.currentRound-1]};o.schedule.push(i)}else if(o.format==="team"&&o.allRounds&&o.currentRound<=o.allRounds.length){const i={...o.allRounds[o.currentRound-1]};o.schedule.push(i)}else if(o.format==="teamMexicano"){if(o.currentRound<=20){const i=In();i.matches.length>0&&o.schedule.push(i)}}else if(o.format==="mexicano"&&o.currentRound<=20){const i=Mn(o.leaderboard);i.matches.length>0&&o.schedule.push(i)}O(),V(),S();const a=document.getElementById(`round-${t}`);a&&(a.classList.add("complete-flash"),setTimeout(()=>a.classList.remove("complete-flash"),1e3));const r=e.number,c=o.schedule.length>t+1;x(c?`✓ Round ${r} complete! Round ${r+1} ready`:`✓ Round ${r} complete!`),setTimeout(()=>{const i=o.schedule.length-1,l=document.getElementById(`round-${i}`);l&&(l.classList.add("animate-in","highlight"),l.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100)}function Tt(e){const t=o.schedule[e];if(!(!t||!t.completed||o.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${o.schedule.length-e-1} subsequent round(s). Continue?`))){xe();for(let n=e;n<o.schedule.length;n++){const a=o.schedule[n];a.completed&&a.matches.forEach(r=>{r.team1[1]?(ee(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ee(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ee(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),ee(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(ee(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),ee(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}o.schedule=o.schedule.slice(0,e+1),t.completed=!1,o.currentRound=e,O(),V(),S(),x(`Editing Round ${e+1}`)}}const We="padel_history_v1";function Hn(){var n;const e=ae(),t=Kt(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),name:t.tournamentName||"",notes:t.tournamentNotes||"",format:t.format,winner:((n=t.leaderboard[0])==null?void 0:n.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(We,JSON.stringify(e)),s}function ae(){try{const e=localStorage.getItem(We);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function Dn(e){A("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=ae().filter(n=>n.id!==e);localStorage.setItem(We,JSON.stringify(s)),je(),x("Tournament deleted")},!0)}function Fn(e){const s=ae().find(n=>n.id===e);if(!s){x("Tournament details not found","error");return}A("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{He(s.data),V(),O(),S(),x("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(n){console.error("Failed to load tournament",n),x("Error loading tournament","error")}},!1)}let we=[];function On(){je();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Wn(s)})}function Wn(e){if(!e){Ne(we);return}const t=we.filter(s=>{var m,u,p,g,f,y,v,b;const n=(((m=s.summary)==null?void 0:m.winner)||((p=(u=s.players)==null?void 0:u[0])==null?void 0:p.name)||"").toLowerCase(),a=(((g=s.summary)==null?void 0:g.format)||s.format||"").toLowerCase(),r=((f=s.summary)==null?void 0:f.date)||s.date||"",c=String(((y=s.summary)==null?void 0:y.playerCount)||((v=s.players)==null?void 0:v.length)||""),i=String(((b=s.summary)==null?void 0:b.roundCount)||""),d=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return n.includes(e)||a.includes(e)||d.includes(e)||c.includes(e)||i.includes(e)});Ne(t)}function je(){we=ae(),Ne(we)}function Ne(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn btn-primary">
        Start a Tournament
      </button>
    `,s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=Dn,window.loadTournament=Fn,window.downloadHistoryItem=jn,t.innerHTML=e.map(n=>{var f,y,v,b,L,M,I,h;const a=n.summary?n.summary.date:n.date,r=n.summary?n.summary.format:n.format||"Unknown",c=r.charAt(0).toUpperCase()+r.slice(1);let i="Unknown";((y=(f=n.data)==null?void 0:f.leaderboard)==null?void 0:y.length)>0?i=((v=[...n.data.leaderboard].sort((C,k)=>k.points-C.points)[0])==null?void 0:v.name)||"Unknown":(b=n.summary)!=null&&b.winner&&(i=n.summary.winner);const l=n.summary?n.summary.playerCount:((L=n.players)==null?void 0:L.length)||0,d=((M=n.summary)==null?void 0:M.roundCount)||((h=(I=n.data)==null?void 0:I.schedule)==null?void 0:h.length)||0,m=new Date(a),u=m.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),p=m.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),g=!!n.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${u}</span>
            <span class="date-sub">${p}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-sm badge-outline">${c}</span>
        </td>
        <td>
          <div class="winner-cell">
            <span class="trophy-icon">🏆</span>
            <span class="winner-name">${i}</span>
          </div>
        </td>
        <td>${l}</td>
        <td>${d}</td>
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
      `}).join("")}}function jn(e){const s=ae().find(n=>n.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}function Vn(e){const s=ae().find(n=>n.id===e);if(!s||!s.data){x("Tournament details not found","error");return}A("Duplicate this tournament?","This will copy settings and players but reset all scores.","Duplicate",()=>{try{const a={...s.data,leaderboard:[],schedule:[],currentRound:0,allRounds:null,isLocked:!1,hideLeaderboard:!0,manualByes:[]};He(a),V(),O(),S(),x("Tournament duplicated - ready to start!"),window.scrollTo({top:0,behavior:"smooth"})}catch(n){console.error("Failed to duplicate tournament",n),x("Error duplicating tournament","error")}},!1)}function Un(e){const t=e.nextElementSibling,s=t.classList.contains("open");document.querySelectorAll(".action-menu-dropdown.open").forEach(n=>{n.classList.remove("open")}),s||t.classList.add("open")}document.addEventListener("click",e=>{e.target.closest(".action-menu")||document.querySelectorAll(".action-menu-dropdown.open").forEach(t=>{t.classList.remove("open")})});window.duplicateTournament=Vn;window.toggleActionMenu=Un;document.addEventListener("DOMContentLoaded",()=>{});let X=null;const ve={};function de(e,t){ve[e]=t}function _n(){window.addEventListener("hashchange",Ke),Ke()}function Rt(){const{route:e,params:t}=At();return{route:e,params:t}}function At(){const e=location.hash.slice(2)||"",[t,s]=e.split("?"),n=t.replace(/\/$/,""),a=new URLSearchParams(s||"");return{route:n,params:a}}function Ke(){const{route:e,params:t}=At(),s=ve[e]||ve[""]||ve.generator;if(!s){console.warn(`[Router] No page found for route: ${e}`);return}if(X!=null&&X.unmount)try{X.unmount()}catch(a){console.error("[Router] Error unmounting page:",a)}X=s;const n=document.getElementById("pageContainer");if(n&&X.mount)try{X.mount(n,t)}catch(a){console.error("[Router] Error mounting page:",a)}}function Gn(e,t){let s;const n=document.getElementById(e),a=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),s=c,n&&(n.style.display="inline-flex",n.addEventListener("click",async()=>{n.style.display="none",s.prompt(),(await s.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),s=null}))}),a&&!r&&n&&t&&(n.style.display="inline-flex",n.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{n&&(n.style.display="none"),s=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}const Qe=[],Ze={mount(e,t){console.log("[GeneratorPage] Mounting...");const s=B();s.playersSection&&(s.playersSection.style.display=""),s.tournamentConfig&&(s.tournamentConfig.style.display=""),s.generateBtn&&(s.generateBtn.style.display="")},unmount(){console.log("[GeneratorPage] Unmounting..."),Qe.forEach(({el:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),Qe.length=0}};function Yn(e){if(!e||e.length<2)throw new Error("Need at least 2 teams for a bracket");const t=Math.pow(2,Math.ceil(Math.log2(e.length))),s=Math.log2(t);t-e.length;const n=Jn(e,t),a=[];let r=1;const c=[];for(let l=0;l<t/2;l++){const d=n[l],m=n[t-1-l],u={id:r++,round:1,position:l,team1:d||null,team2:m||null,score1:null,score2:null,winner:null,nextMatchId:null};d&&!m?(u.winner=d.id,u.isBye=!0):m&&!d&&(u.winner=m.id,u.isBye=!0),c.push(u),a.push(u)}let i=c;for(let l=2;l<=s;l++){const d=[];for(let m=0;m<i.length/2;m++){const u={id:r++,round:l,position:m,team1:null,team2:null,score1:null,score2:null,winner:null,nextMatchId:null};d.push(u),a.push(u);const p=i[m*2],g=i[m*2+1];p.nextMatchId=u.id,g.nextMatchId=u.id,p.winner&&(u.team1=et(n,p.winner)),g.winner&&(u.team2=et(n,g.winner))}i=d}return{teams:n.filter(Boolean),matches:a,numRounds:s,format:"single"}}function Jn(e,t){const s=new Array(t).fill(null);for(let n=0;n<e.length;n++)s[n]=e[n];return s}function et(e,t){return e.find(s=>(s==null?void 0:s.id)===t)||null}function Xn(e,t,s){var a,r,c,i;const n=o.tournament.matches.find(l=>l.id===e);if(!n)return!1;if(n.winner!=null&&Nt(n),n.score1=t,n.score2=s,t>s)n.winner=(a=n.team1)==null?void 0:a.id;else if(s>t)n.winner=(r=n.team2)==null?void 0:r.id;else return n.winner=null,!1;if(n.nextMatchId){const l=o.tournament.matches.find(d=>d.id===n.nextMatchId);if(l){const d=n.winner===((c=n.team1)==null?void 0:c.id)?n.team1:n.team2;((i=o.tournament.matches.filter(p=>p.nextMatchId===l.id)[0])==null?void 0:i.id)===n.id?l.team1=d:l.team2=d}}return S(),!0}function Nt(e){var a;if(!e.nextMatchId)return;const t=o.tournament.matches.find(r=>r.id===e.nextMatchId);if(!t)return;((a=o.tournament.matches.filter(r=>r.nextMatchId===t.id)[0])==null?void 0:a.id)===e.id?t.team1=null:t.team2=null,t.winner!=null&&(t.score1=null,t.score2=null,t.winner=null,Nt(t))}function Kn(){const e=o.tournament.matches;if(!e.length)return[];const t=Math.max(...e.map(n=>n.round)),s=[];for(let n=1;n<=t;n++)s.push(e.filter(a=>a.round===n).sort((a,r)=>a.position-r.position));return s}function Qn(e,t){const s=t-e;return s===0?"Final":s===1?"Semi-Finals":s===2?"Quarter-Finals":`Round ${e}`}function tt(){const e=o.tournament.matches;if(!e.length)return!1;const t=e.find(s=>s.round===Math.max(...e.map(n=>n.round)));return(t==null?void 0:t.winner)!=null}function Zn(){var r,c;const e=o.tournament.matches;if(!e.length)return[];const t=Math.max(...e.map(i=>i.round)),s=e.find(i=>i.round===t),n=e.filter(i=>i.round===t-1),a=[];if(s!=null&&s.winner){const i=s.winner===((r=s.team1)==null?void 0:r.id)?s.team1:s.team2;a.push({place:1,team:i});const l=s.winner===((c=s.team1)==null?void 0:c.id)?s.team2:s.team1;a.push({place:2,team:l})}return n.forEach(i=>{var l;if(i.winner){const d=i.winner===((l=i.team1)==null?void 0:l.id)?i.team2:i.team1;d&&a.push({place:3,team:d})}}),a}function es(e){const t=e.map((n,a)=>({id:`team-${Date.now()}-${a}`,name:n.trim()})),s=Yn(t);return o.tournament={format:"single",teams:s.teams,matches:s.matches,standings:[],meta:{name:"",notes:"",createdAt:new Date().toISOString()}},S(),s}function ts(){o.tournament={format:"single",teams:[],matches:[],standings:[],meta:{name:"",notes:"",createdAt:null}},S()}const qe=[];function ue(e,t,s){e&&(e.addEventListener(t,s),qe.push({el:e,event:t,handler:s}))}const ns={mount(e,t){var s,n;if(console.log("[BracketPage] Mounting..."),!((n=(s=o.tournament)==null?void 0:s.matches)!=null&&n.length)){this.renderEmptyState(e);return}this.renderBracket(e)},renderEmptyState(e){e.innerHTML=`
      <div class="bracket-empty-state">
        <h2>Create a Bracket</h2>
        <p>Set up a single elimination tournament bracket.</p>
        <div class="bracket-team-input">
          <textarea 
            id="bracketTeamsInput" 
            class="form-input" 
            rows="6" 
            placeholder="Enter team names (one per line)&#10;&#10;Team Alpha&#10;Team Beta&#10;Team Gamma&#10;Team Delta"
          ></textarea>
          <p class="form-hint">Minimum 2 teams. Best with 4, 8, or 16 teams.</p>
        </div>
        <button class="btn btn-primary" id="createBracketBtn">Create Bracket</button>
      </div>
    `;const t=e.querySelector("#createBracketBtn"),s=e.querySelector("#bracketTeamsInput");ue(t,"click",()=>{const a=s.value.trim().split(`
`).map(r=>r.trim()).filter(r=>r.length>0);if(a.length<2){x("Need at least 2 teams","error");return}if(a.length>32){x("Maximum 32 teams allowed","error");return}try{es(a),x(`Bracket created with ${a.length} teams`,"success"),this.renderBracket(e)}catch(r){x("Error creating bracket: "+r.message,"error")}})},renderBracket(e){const t=Kn(),s=t.length,n=tt();e.innerHTML=`
      <div class="bracket-header">
        <h2>Tournament Bracket</h2>
        <div class="bracket-actions">
          <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
          <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
        </div>
      </div>
      <div class="bracket-container">
        ${t.map((i,l)=>`
          <div class="bracket-round" data-round="${l+1}">
            <div class="round-header">${Qn(l+1,s)}</div>
            <div class="round-matches">
              ${i.map(d=>this.renderMatch(d)).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      ${n?this.renderChampions():""}
    `;const a=e.querySelector(".bracket-container");ue(a,"click",i=>{const l=i.target.closest(".bracket-match");if(l&&!l.classList.contains("bye")){const d=parseInt(l.dataset.matchId);this.openScoreEntry(e,d)}});const r=e.querySelector("#clearBracketBtn");ue(r,"click",()=>{A("Clear Bracket?","This will delete the entire bracket and all results.","Clear",()=>{ts(),this.renderEmptyState(e),x("Bracket cleared")},!0)});const c=e.querySelector("#printBracketBtn");c&&ue(c,"click",()=>window.print())},renderMatch(e){var d,m,u,p;const t=e.team1||e.team2,s=e.isBye,n=e.winner!=null,a=t&&e.team1&&e.team2&&!s,r=n&&e.winner===((d=e.team1)==null?void 0:d.id),c=n&&e.winner===((m=e.team2)==null?void 0:m.id),i=r?"winner":n?"loser":"",l=c?"winner":n?"loser":"";return`
      <div class="bracket-match ${s?"bye":""} ${n?"complete":""} ${a?"editable":""}" 
           data-match-id="${e.id}">
        <div class="match-team ${i}">
          <span class="team-name">${((u=e.team1)==null?void 0:u.name)||"TBD"}</span>
          <span class="team-score">${e.score1??"-"}</span>
        </div>
        <div class="match-team ${l}">
          <span class="team-name">${((p=e.team2)==null?void 0:p.name)||"TBD"}</span>
          <span class="team-score">${e.score2??"-"}</span>
        </div>
        ${s?'<div class="bye-label">BYE</div>':""}
      </div>
    `},renderChampions(){var a,r,c,i;const e=Zn(),t=e.find(l=>l.place===1),s=e.find(l=>l.place===2),n=e.filter(l=>l.place===3);return`
      <div class="bracket-champions">
        <h3>Champions</h3>
        <div class="podium">
          <div class="podium-place second">
            <div class="podium-medal">2</div>
            <div class="podium-team">${((a=s==null?void 0:s.team)==null?void 0:a.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
          <div class="podium-place first">
            <div class="podium-medal">1</div>
            <div class="podium-team">${((r=t==null?void 0:t.team)==null?void 0:r.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
          <div class="podium-place third">
            <div class="podium-medal">3</div>
            <div class="podium-team">${((i=(c=n[0])==null?void 0:c.team)==null?void 0:i.name)||"-"}</div>
            <div class="podium-block"></div>
          </div>
        </div>
        ${n.length>1?`<div class="also-third"><span class="also-label">Also 3rd:</span> ${n.slice(1).map(l=>{var d;return(d=l.team)==null?void 0:d.name}).join(", ")}</div>`:""}
      </div>
    `},openScoreEntry(e,t){const s=o.tournament.matches.find(c=>c.id===t);if(!s||!s.team1||!s.team2)return;const n=document.createElement("div");n.className="modal-overlay",n.style.display="flex",n.innerHTML=`
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
    `,document.body.appendChild(n);const a=()=>{n.remove()},r=()=>{const c=parseInt(document.getElementById("score1Input").value||"0"),i=parseInt(document.getElementById("score2Input").value||"0");if(c===i){x("Scores cannot be tied in elimination","error");return}Xn(t,c,i),a(),this.renderBracket(e),tt()&&x("Tournament complete! View the winners.","success")};n.querySelector("#closeScoreModal").addEventListener("click",a),n.querySelector("#cancelScoreBtn").addEventListener("click",a),n.querySelector("#saveScoreBtn").addEventListener("click",r),n.addEventListener("click",c=>{c.target===n&&a()}),n.querySelectorAll(".score-type-btn").forEach(c=>{c.addEventListener("click",()=>{n.querySelectorAll(".score-type-btn").forEach(i=>i.classList.remove("active")),c.classList.add("active")})}),setTimeout(()=>{var c;return(c=document.getElementById("score1Input"))==null?void 0:c.focus()},100)},unmount(){console.log("[BracketPage] Unmounting..."),qe.forEach(({el:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),qe.length=0}};function ss(e,t){if(e.length<t*4)throw new Error(`Need at least ${t*4} players for ${t} courts`);const s=[...e].sort((c,i)=>i.skill-c.skill),n=Array.from({length:t},(c,i)=>({id:i+1,players:[],totalSkill:0}));let a=1,r=0;return s.forEach(c=>{n[r].players.push(c),n[r].totalSkill+=c.skill,r+=a,(r>=t||r<0)&&(a*=-1,r+=a)}),n}function os(e,t=!1,s=1){if(e.length<4)return null;if(t){const n=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]],a=(s-1)%3,[[r,c],[i,l]]=n[a];return{team1:[e[r],e[c]],team2:[e[i],e[l]]}}return{team1:[e[0],e[1]],team2:[e[2],e[3]]}}function as(e,t){if(e.length<2)return e;const s=JSON.parse(JSON.stringify(e));for(let n=0;n<s.length;n++){const a=s[n];a.winner===1?n>0&&(me(s,n,0,n-1,2),me(s,n,1,n-1,3)):a.winner===2&&n<s.length-1&&(me(s,n,2,n+1,0),me(s,n,3,n+1,1)),a.winner=null,a.score1=null,a.score2=null}return s}function me(e,t,s,n,a){const r=e[t].players[s];e[t].players[s]=e[n].players[a],e[n].players[a]=r}function rs(e,t,s=!1){const n=ss(e,t);return o.winnersCourt={players:e,courts:n,courtCount:t,twist:s,points:0,courts:n,courtCount:t,twist:s,round:1,history:[]},S(),n}function pe(){return o.winnersCourt||null}function nt(){o.winnersCourt=null,S()}function is(e,t,s,n){if(!o.winnersCourt)return!1;const a=o.winnersCourt.courts.find(r=>r.id===e);return a?(a.winner=t,a.score1=s,a.score2=n,S(),!0):!1}function ls(){if(!o.winnersCourt)return null;const{courts:e,twist:t}=o.winnersCourt;return e.filter(n=>n.winner==null).length>0?{error:"Complete all matches first"}:(o.winnersCourt.history=o.winnersCourt.history||[],o.winnersCourt.history.push({round:o.winnersCourt.round,courts:JSON.parse(JSON.stringify(e))}),o.winnersCourt.courts=as(e),o.winnersCourt.round++,S(),o.winnersCourt.courts)}const ze=[];function H(e,t,s){e&&(e.addEventListener(t,s),ze.push({el:e,event:t,handler:s}))}const cs={mount(e,t){console.log("[WinnersCourtPage] Mounting...");try{const s=localStorage.getItem("wc_setup_players");s&&(this.tempPlayers=JSON.parse(s))}catch(s){console.error("Failed to load WC setup players",s)}pe(),this.render(e)},tempPlayers:[],saveSetup(){localStorage.setItem("wc_setup_players",JSON.stringify(this.tempPlayers))},showHelp(){te("How to Play",`
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
      <div id="wcSetupContainer"></div>
      <div id="wcActiveContainer"></div>
    `,this.renderSetup(e.querySelector("#wcSetupContainer")),this.renderActiveGame(e.querySelector("#wcActiveContainer"))},renderSetup(e){if(!e)return;const s=!!pe(),n=Math.max(1,Math.floor(this.tempPlayers.length/4));e.innerHTML=`
      <div class="wc-setup ${s?"compact":""}">
        <div class="wc-header-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <h2 style="margin: 0;">Winners Court Setup</h2>
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
                <label for="wcSkillInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; text-align: center;">Skill</label>
                <select id="wcSkillInput" class="form-select wc-skill-select compact-select">
                  <option value="0" selected>-</option>
                  ${Array.from({length:10},(a,r)=>`<option value="${r+1}">${r+1}</option>`).join("")}
                </select>
              </div>
              <button class="btn btn-primary" id="addPlayerBtn" style="height: 44px;">Add</button>
            </div>
            
            <ul class="player-list" id="wcPlayersList" style="max-height: ${s?"200px":"280px"}; overflow-y: auto; transition: max-height 0.3s ease;">
              ${this.renderPlayerItems()}
            </ul>
            
            ${this.tempPlayers.length>5?`
              <button class="btn btn-sm btn-secondary" id="wcTogglePlayersBtn" style="width: 100%; margin-top: 8px;">
                Show All (${this.tempPlayers.length})
              </button>
            `:""}
            
            <p class="players-hint" id="wcPlayersHint">${this.getPlayersHint()}</p>
          </div>
          
          <!-- Options Section -->
          <div class="wc-options">
            <div class="wc-option">
              <label for="wcCourts">Courts</label>
              <select id="wcCourts" class="form-input">
                ${Array.from({length:n+1},(a,r)=>r+1).filter(a=>a<=n||a===1).map(a=>`<option value="${a}" ${a===n?"selected":""}>${a} Court${a>1?"s":""} (${a*4} players)</option>`).join("")}
              </select>
            </div>
            
            <label class="wc-toggle">
              <input type="checkbox" id="wcTwist" />
              <span class="slider round"></span>
              <span class="toggle-label">Twist Mode</span>
            </label>
          </div>
          
          ${s?`<div style="text-align: center; margin-top: 10px;">
               <button class="btn btn-secondary btn-sm" id="restartWcBtn">Restart / New Game</button>
             </div>`:`<button class="btn btn-primary btn-lg" id="generateWcBtn" ${this.tempPlayers.length<4?"disabled":""}>Generate Winners Court</button>`}
        </div>
      </div>
    `,this.attachSetupListeners(e),se()},renderPlayerItems(){return this.tempPlayers.map((e,t)=>`
      <li class="player-item" data-index="${t}">
        <span class="player-number">${t+1}.</span>
        <span class="player-name">${e.name}</span>
        <span class="player-skill">${e.skill===0?"-":e.skill}</span>
        <button class="player-remove" data-index="${t}">×</button>
      </li>
    `).join("")},getPlayersHint(){const e=this.tempPlayers.length;if(e<4)return`Add at least ${4-e} more player${4-e>1?"s":""}`;const t=Math.floor(e/4),s=e%4;if(s===0)return`<span style="color: var(--success)">${e} players ready (${t} court${t>1?"s":""})</span>`;{const n=4-s;return`<span style="color: var(--warning)">${e} ready (${t} court${t>1?"s":""}). Need ${n} more for ${t+1} courts!</span>`}},attachSetupListeners(e){const t=e.querySelector("#wcNameInput"),s=e.querySelector("#wcSkillInput"),n=e.querySelector("#addPlayerBtn"),a=e.querySelector("#importBtn"),r=e.querySelector("#clearAllBtn"),c=e.querySelector("#generateWcBtn"),i=e.querySelector("#restartWcBtn"),l=e.querySelector("#wcHelpBtn");l&&H(l,"click",()=>this.showHelp()),a&&H(a,"click",()=>{De("Import Players",`John
Jane : 8
Bob`,u=>{const p=u.split(`
`);let g=0;p.forEach(f=>{const y=f.split(":"),v=y[0].trim();if(!v)return;let b=0;if(y.length>1){const L=parseInt(y[1].trim());!isNaN(L)&&L>=1&&L<=10&&(b=L)}this.tempPlayers.push({name:v,skill:b}),g++}),g>0&&(this.saveSetup(),this.renderSetup(e),x(`Imported ${g} players`,"success"))},"Enter names, one per line. Optionally add skill level with : # (e.g. 'John : 8'). Default skill is -.","textarea")});const d=()=>{const u=t.value.trim(),p=parseInt(s.value);u&&p>=0&&p<=10&&(this.tempPlayers.push({name:u,skill:p}),this.saveSetup(),t.value="",this.renderSetup(e),e.querySelector("#wcNameInput").focus())};H(n,"click",d),H(t,"keypress",u=>{u.key==="Enter"&&d()}),H(r,"click",()=>{this.tempPlayers=[],this.saveSetup(),this.renderSetup(e)}),H(e.querySelector("#wcPlayersList"),"click",u=>{if(u.target.classList.contains("player-remove")){const p=parseInt(u.target.dataset.index);this.tempPlayers.splice(p,1),this.saveSetup(),this.renderSetup(e)}});const m=e.querySelector("#wcTogglePlayersBtn");m&&H(m,"click",()=>{const u=e.querySelector("#wcPlayersList");m.dataset.expanded==="true"?(u.style.maxHeight="280px",m.textContent=`Show All (${this.tempPlayers.length})`,m.dataset.expanded="false"):(u.style.maxHeight="none",m.textContent="Show Less",m.dataset.expanded="true")}),c&&H(c,"click",()=>{this.handleGenerate(e.parentElement)}),i&&H(i,"click",()=>{A("Start New Game?","Current progress will be lost.","Start New",()=>{nt();const u=e.parentElement;this.render(u)})})},handleGenerate(e){const t=parseInt(document.getElementById("wcCourts").value),s=document.getElementById("wcTwist").checked,n=[...this.tempPlayers],a=t*4;if(n.length<a){x(`Need at least ${a} players for ${t} courts`,"error");return}try{rs(n,t,s),x(`Winners Court created with ${n.length} players`,"success"),this.render(e)}catch(r){x(r.message,"error")}},renderActiveGame(e){const t=pe();if(!t||!e){e&&(e.innerHTML="");return}const{courts:s,twist:n,round:a}=t;e.innerHTML=`
      <div class="wc-view" style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 20px;">
        <div class="wc-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="margin:0;">Active Round (${a})</h2>
          </div>
          <div class="wc-actions">
            <button class="btn btn-secondary btn-sm" id="wcNextRoundBtn">Next Round</button>
            <button class="btn btn-danger btn-sm" id="wcClearBtn">Clear Game</button>
          </div>
        </div>
        ${n?'<p class="wc-twist-badge">Twist Mode Active</p>':""}
        
        <div class="wc-courts-grid">
          ${s.map(l=>this.renderCourt(l,n,a)).join("")}
        </div>
      </div>
    `;const r=e.querySelector("#wcClearBtn");H(r,"click",()=>{A("Clear Winners Court?","This will reset everything.","Clear",()=>{nt(),this.render(e.parentElement),x("Winners Court cleared")},!0)});const c=e.querySelector("#wcNextRoundBtn");H(c,"click",()=>{const l=ls();l!=null&&l.error?x(l.error,"error"):(x(`Round ${t.round+1} started`),this.renderActiveGame(e))}),e.querySelectorAll(".wc-court").forEach(l=>{H(l.querySelector(".wc-team1"),"click",()=>{const d=parseInt(l.dataset.courtId);this.handleTeamWin(e,d,1)}),H(l.querySelector(".wc-team2"),"click",()=>{const d=parseInt(l.dataset.courtId);this.handleTeamWin(e,d,2)})});const i=document.createElement("div");i.id="wcHistoryContainer",e.appendChild(i),this.renderHistory(i)},renderHistory(e){const t=pe();if(!t||!t.history||t.history.length===0)return;const s=[...t.history].reverse();e.innerHTML=`
      <div style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 20px;">
        <h3 style="color: var(--text-muted); margin-bottom: 20px;">Previous Rounds</h3>
        ${s.map(n=>`
          <div class="wc-history-round" style="margin-bottom: 30px; opacity: 0.8;">
            <h4 style="margin-bottom: 10px; color: var(--text-secondary);">Round ${n.round}</h4>
            <div class="wc-courts-grid">
              ${n.courts.map(a=>this.renderCourt(a,!1,n.round,!0)).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `},renderCourt(e,t,s,n=!1){var i,l,d,m;const a=os(e.players,t,s),r=e.winner!=null;return`
      <div class="wc-court ${r?"complete":""} ${!n&&!r?"interactive":""}" data-court-id="${e.id}" style="${n?"pointer-events: none;":""}">
        <div class="wc-court-header">Court ${e.id}</div>
        <div class="wc-court-body">
          <div class="wc-team wc-team1 ${e.winner===1?"winner":e.winner===2?"loser":""}">
            <div class="wc-player">${((i=a==null?void 0:a.team1[0])==null?void 0:i.name)||"?"}</div>
            <div class="wc-player">${((l=a==null?void 0:a.team1[1])==null?void 0:l.name)||"?"}</div>
          </div>
          <div class="wc-vs">VS</div>
          <div class="wc-team wc-team2 ${e.winner===2?"winner":e.winner===1?"loser":""}">
            <div class="wc-player">${((d=a==null?void 0:a.team2[0])==null?void 0:d.name)||"?"}</div>
            <div class="wc-player">${((m=a==null?void 0:a.team2[1])==null?void 0:m.name)||"?"}</div>
          </div>
          </div>
        </div>
        ${e.players.length>4?`<div class="wc-bench" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; color: var(--text-secondary);">
               <strong style="color: var(--warning);">Bench:</strong> ${e.players.slice(4).map(u=>u.name).join(", ")}
             </div>`:""}
        ${!n&&!r?'<div class="wc-hint">Click winning team</div>':""}
      </div>
    `},handleTeamWin(e,t,s){is(t,s,0,0),this.renderActiveGame(e)},unmount(){console.log("[WinnersCourtPage] Unmounting..."),ze.forEach(({el:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),ze.length=0}};function ds(){console.log("Tournament App: Initialized"),Ut({activeLink:"tournament"}),Gn("installBtn",()=>{te("Install App on iPhone",`
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `)}),_t();const e=at();Jt(),e.format.value=o.format,e.courts.value=o.courts,e.scoringMode.value=o.scoringMode,e.points.value=o.pointsPerMatch,e.courtFormat.value=o.courtFormat,e.maxRepeats.value=o.maxRepeats,e.pairingStrategy&&(e.pairingStrategy.value=o.pairingStrategy);const t=document.getElementById("rankingCriteria");t&&(t.value=o.rankingCriteria);const s=document.getElementById("strictStrategy");if(s&&(s.checked=o.strictStrategy||!1),it(),Rn(j),G(),o.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const n=document.getElementById("tournamentActionsSection");n&&(n.style.display="block"),V(),O(),Se()}ys(e),se(),gs(),On(),window.addEventListener("resize",ht),fs(),D(),gt(),j(),us(),ps(),de("",Ze),de("generator",Ze),de("bracket",ns),de("winners-court",cs),ms(),_n(),console.log("[Tournament] Router initialized. Current route:",Rt())}function us(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const s=t.getBoundingClientRect(),n=document.createElement("span");n.className="ripple",n.style.width=n.style.height=`${Math.max(s.width,s.height)}px`,n.style.left=`${e.clientX-s.left-n.offsetWidth/2}px`,n.style.top=`${e.clientY-s.top-n.offsetHeight/2}px`,t.appendChild(n),setTimeout(()=>n.remove(),600)})}function ms(){const e=document.querySelector(".tournament-page .container"),t=e==null?void 0:e.querySelector(".tool-header");if(!t){console.warn("[Router] Could not find .tool-header to inject navigation");return}const s=document.createElement("nav");s.className="page-nav",s.innerHTML=`
    <div class="page-nav-tabs">
      <a href="#/generator" class="page-nav-tab" data-route="generator">
        <span class="tab-icon">🎯</span>
        <span class="tab-label">Generator</span>
      </a>
      <a href="#/bracket" class="page-nav-tab" data-route="bracket">
        <span class="tab-icon">🏆</span>
        <span class="tab-label">Bracket</span>
      </a>
      <a href="#/winners-court" class="page-nav-tab" data-route="winners-court">
        <span class="tab-icon">🥇</span>
        <span class="tab-label">Winners</span>
      </a>
    </div>
  `,t.after(s);let n=document.getElementById("pageContainer");n||(n=document.createElement("div"),n.id="pageContainer",n.className="page-container",n.style.display="none",s.after(n));function a(){const{route:r}=Rt(),c=r||"generator";s.querySelectorAll(".page-nav-tab").forEach(f=>{f.dataset.route===c?f.classList.add("active"):f.classList.remove("active")}),document.querySelector(".players-section, .tournament-config, .schedule-section, .leaderboard-section");const i=document.querySelector(".players-section"),l=document.getElementById("tournamentConfig"),d=document.getElementById("generateBtn"),m=document.getElementById("scheduleSection"),u=document.getElementById("leaderboardSection"),p=document.getElementById("tournamentActionsSection"),g=document.getElementById("historySectionPage");c==="generator"||c===""?(i&&(i.style.display=""),l&&(l.style.display=""),d&&(d.style.display=""),g&&(g.style.display=""),n.style.display="none"):(i&&(i.style.display="none"),l&&(l.style.display="none"),d&&(d.style.display="none"),m&&(m.style.display="none"),u&&(u.style.display="none"),p&&(p.style.display="none"),g&&(g.style.display="none"),n.style.display="block")}a(),window.addEventListener("hashchange",a)}function ps(){const e=document.querySelectorAll(".section-title, .card-header-basic h3, .card-header-advanced h3, .leaderboard-header h3, .players-header h3");e.forEach(s=>s.classList.add("animate-in"));const t=new IntersectionObserver(s=>{s.forEach(n=>{n.isIntersecting&&n.target.classList.add("animate-in")})},{threshold:.1});e.forEach(s=>t.observe(s))}function fs(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function ys(e){const t=document.getElementById("undoBtn");t&&(t.addEventListener("click",()=>{if(Yt())if(x("Undo successful"),e.format.value=o.format,G(),V(),O(),D(),Se(),o.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const m=document.getElementById("tournamentActionsSection");m&&(m.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const m=document.getElementById("tournamentActionsSection");m&&(m.style.display="none")}}),document.addEventListener("keydown",m=>{(m.ctrlKey||m.metaKey)&&m.key==="z"&&!m.shiftKey&&(m.preventDefault(),t.click())})),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{dn(()=>{G(),K(),D()})}),e.importPlayersBtn.addEventListener("click",yt),e.closeImportModal.addEventListener("click",ge),e.cancelImportBtn.addEventListener("click",ge),e.confirmImportBtn.addEventListener("click",()=>{const m=e.importTextarea.value,u=un(m);let p=`Added ${u.added} players.`;u.duplicates>0&&(p+=` Skipped ${u.duplicates} duplicates.`),u.hitLimit&&(p+=" Stopped at 24 max limit."),e.importStatus.textContent=p,G(),u.added>0&&u.duplicates===0&&!u.hitLimit&&(setTimeout(ge,1500),x(`Imported ${u.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{Je(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),G())}),e.playerNameInput.addEventListener("keydown",m=>{m.key==="Enter"&&Je(e.playerNameInput.value)&&(e.playerNameInput.value="",G())}),e.format.addEventListener("change",()=>{o.format=e.format.value,D(),S(),o.schedule.length>0&&he()}),e.courts.addEventListener("change",()=>{o.courts=parseInt(e.courts.value),S(),j(),o.schedule.length>0&&he(),o.courtFormat==="custom"&&Ee()}),e.points.addEventListener("change",()=>{o.pointsPerMatch=parseInt(e.points.value),S(),j(),o.schedule.length>0&&V()}),e.scoringMode.addEventListener("change",()=>{o.scoringMode=e.scoringMode.value,gt(),S(),j(),o.schedule.length>0&&V()});const s=document.getElementById("rankingCriteria");s&&s.addEventListener("change",()=>{o.rankingCriteria=s.value,St(),S()}),e.courtFormat.addEventListener("change",()=>{o.courtFormat=e.courtFormat.value,it(),S()}),e.courts.addEventListener("input",()=>{const u=e.courts.value;if(u==="")return;let p=parseInt(u)||1;p=Math.max(1,Math.min(50,p)),!o.isLocked&&(e.courts.value=p,o.courts=p,S(),o.courtFormat==="custom"&&Ee(),o.schedule.length>0&&he())}),e.maxRepeats.addEventListener("change",m=>{const u=parseInt(m.target.value),p=o.maxRepeats;o.isLocked?(m.target.value=p,A("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{o.maxRepeats=u,e.maxRepeats.value=u,S(),j(),x("Max Partner Repeats updated")},!0)):(o.maxRepeats=u,S(),j())});const n=document.getElementById("strictStrategy");n&&n.addEventListener("change",m=>{if(o.pairingStrategy==="optimal"){m.target.checked=!1,x("Strict Pattern is not available with Optimal pairing","info");return}const u=m.target.checked,p=o.strictStrategy;o.isLocked?(m.target.checked=!!p,A("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{o.strictStrategy=u,n.checked=u,S(),x("Strict Mode updated")},!0)):(o.strictStrategy=u,S())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",m=>{const u=m.target.value,p=o.pairingStrategy;if(o.isLocked)m.target.value=p,A("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(o.pairingStrategy=u,e.pairingStrategy.value=u,u==="optimal"){o.strictStrategy=!1;const g=document.getElementById("strictStrategy");g&&(g.checked=!1)}S(),D(),x("Pairing Strategy updated")},!0);else{if(o.pairingStrategy=u,u==="optimal"){o.strictStrategy=!1;const g=document.getElementById("strictStrategy");g&&(g.checked=!1)}S(),D()}}),e.addPartnerPairBtn.addEventListener("click",()=>{if(mt().length<2){x("Not enough available players to form a pair","error");return}pn(),K(),D(),se(),x("Fixed pair added","success")});const a=document.getElementById("helpFormat");a&&a.addEventListener("click",()=>{te("Tournament Formats",`
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
        `)});const r=document.getElementById("helpScoring");r&&r.addEventListener("click",()=>{te("Scoring Modes",`
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
        `)});const c=document.getElementById("helpMatchup");c&&c.addEventListener("click",()=>{te("Matchup Rules",`
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
        `)});const i=document.getElementById("helpLeaderboard");i&&i.addEventListener("click",()=>{te("Leaderboard Guide",`
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
        `)}),e.generateBtn.addEventListener("click",An),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",Nn),e.gridColumns&&e.gridColumns.addEventListener("input",Ln),e.textSize&&e.textSize.addEventListener("input",()=>{o.textSize=parseInt(e.textSize.value),vt(),S()});const l=document.getElementById("factoryResetBtn");l&&l.addEventListener("click",()=>{A("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const d=document.getElementById("roundScale");d&&d.addEventListener("input",kn)}function gs(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,n=t.dataset.id?Number(t.dataset.id):null,a=t.dataset.round?parseInt(t.dataset.round):null;switch(s){case"remove-player":n!==null&&(ut(n),G());break;case"toggle-player-list":Oe();break;case"remove-pair":n!==null&&(Fe(n),K(),D(),se());break;case"toggle-bye":n!==null&&Pt(n);break;case"toggle-round":a!==null&&It(a);break;case"complete-round":Mt();break;case"edit-round":a!==null&&Tt(a);break;case"toggle-visibility":wt();break;case"toggle-position":xt();break;case"end-tournament":Lt(dt);break;case"toggle-toolbar":kt();break;case"export-data":$t();break;case"share-results":Et();break;case"add-late-player":qt();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,n=t.dataset.pairId?Number(t.dataset.pairId):null,a=t.dataset.which?parseInt(t.dataset.which):null;if(s==="update-partner"&&n!==null&&a!==null&&(pt(n,a,Number(t.value)),K(),D(),se()),s==="autofill-score"&&o.scoringMode==="race"){const r=parseInt(t.dataset.round),c=parseInt(t.dataset.match),i=parseInt(t.dataset.team),l=t.value;Ae(r,c,i,l)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||o.scoringMode==="race")return;const s=parseInt(t.dataset.round),n=parseInt(t.dataset.match),a=parseInt(t.dataset.team),r=t.value;Ae(s,n,a,r)})}function qt(){const e=o.format==="team"||o.format==="teamMexicano";De(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",n=>{if(n&&n.trim()){if(o.format==="americano"||o.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;o.format="mexicano",o.allRounds=null,x("Switched to Mexicano format")}mn(n.trim());const a=document.getElementById("playerCount");a&&(a.textContent=`(${o.players.length})`),O(),x(`Added ${n.trim()} to tournament`)}},`The new ${e?"team":"player"} will join with 0 points and be included starting from the next round. Their ranking will adjust based on future match results.`)}window.removePlayer=e=>{ut(e),G()};window.togglePlayerList=Oe;window.updatePreferredPair=(e,t,s)=>{pt(e,t,s),K()};window.removePreferredPair=e=>{Fe(e),K()};window.updateCustomCourtName=Qt;window.autoFillScore=Ae;window.toggleManualBye=Pt;window.toggleRoundCollapse=It;window.completeRound=Mt;window.editRound=Tt;window.toggleLeaderboardVisibility=wt;window.togglePositionChanges=xt;window.updateRankingCriteria=St;window.updateSetupUI=D;window.endTournament=()=>Lt(dt);window.validateCourts=rt;window.toggleToolbar=kt;window.exportTournamentData=$t;window.shareResults=Et;window.promptAddLatePlayer=qt;ds();
