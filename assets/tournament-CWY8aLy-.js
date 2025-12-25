import{i as $t,a as kt}from"./layout-wepprbzU.js";const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,tournamentName:"",tournamentNotes:"",schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},Z=[],It=20;function Fe(){const e=document.getElementById("undoBtn");e&&(e.disabled=Z.length===0)}function pe(){const e=JSON.parse(JSON.stringify(n));Z.push(e),Z.length>It&&Z.shift(),Fe()}function Pt(){if(Z.length===0)return!1;const e=Z.pop();return Ie(e),Fe(),!0}const He="tournament-state";function S(){localStorage.setItem(He,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,tournamentName:n.tournamentName,tournamentNotes:n.tournamentNotes,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function Bt(){const e=localStorage.getItem(He);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.tournamentName=t.tournamentName||"",n.tournamentNotes=t.tournamentNotes||"",n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function Mt(){return JSON.parse(JSON.stringify(n))}function Ie(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],S())}function le(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function C(e,t={}){let s="default",o,a;typeof t=="number"?o=t:typeof t=="string"?s=t:typeof t=="object"&&(s=t.type??"default",o=t.duration,a=t.dismissible);const r={success:{duration:2500,dismissible:!1},info:{duration:3e3,dismissible:!1},warning:{duration:5e3,dismissible:!0},error:{duration:0,dismissible:!0},default:{duration:3e3,dismissible:!1}},d=r[s]||r.default;o=o??d.duration,a=a??d.dismissible;const i=document.querySelector(".toast");i&&i.remove();const l={success:"✓",error:"✕",warning:"⚠",info:"ℹ",default:""},c=document.createElement("div");c.className=`toast ${s}`,s==="error"?(c.setAttribute("role","alert"),c.setAttribute("aria-live","assertive")):(c.setAttribute("role","status"),c.setAttribute("aria-live","polite"));const u=l[s]||"";if(u){const f=document.createElement("span");f.className="toast-icon",f.textContent=u,c.appendChild(f)}const m=document.createElement("span");m.className="toast-message",m.textContent=e,c.appendChild(m);const p=()=>{c.classList.remove("visible"),setTimeout(()=>c.remove(),300)};if(a){const f=document.createElement("button");f.className="toast-close",f.setAttribute("aria-label","Close notification"),f.textContent="×",f.addEventListener("click",p),c.appendChild(f)}document.body.appendChild(c);const h=f=>{f.key==="Escape"&&a&&(p(),document.removeEventListener("keydown",h))};a&&document.addEventListener("keydown",h),setTimeout(()=>c.classList.add("visible"),10),o>0&&setTimeout(()=>{p(),document.removeEventListener("keydown",h)},o)}function re(){return Math.floor(Date.now()+Math.random()*1e6)}let ue=null;function je(){return ue={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn"),runningBadge:document.getElementById("runningBadge")},ue}function I(){return ue||je(),ue}function ve(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function We(){var i;const e=I(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const o=parseInt(t.value)||1,a=((i=e.format)==null?void 0:i.value)||n.format,r=a==="team"||a==="teamMexicano"?2:4,d=Math.floor(n.players.length/r);return t.max=Math.max(1,d),o>d&&d>0?(s.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(s.textContent=`⚠️ Need at least ${r} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function Ve(){const e=I();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",be()):e.customCourtNamesSection.style.display="none"}function be(){const e=I();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,o)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[o]||`Court ${o+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${o}, this.value)"
             placeholder="Court ${o+1}">
    </div>
  `).join("")}function Tt(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,S()}function Ue(){const e=I(),t=new Set;n.preferredPartners.forEach(s=>{t.add(s.player1Id),t.add(s.player2Id)}),n.players.filter(s=>!t.has(s.id)),e.addPartnerPairBtn.disabled=!1}function X(){const e=I(),t=s=>{const o=new Set;return n.preferredPartners.forEach(a=>{a.id!==s&&(o.add(a.player1Id),o.add(a.player2Id))}),o};if(n.preferredPartners.length===0){e.preferredPartnersList.innerHTML="";return}e.preferredPartnersList.innerHTML=`
    <ul class="pairs-bullet-list">
      ${n.preferredPartners.map(s=>{const o=t(s.id),a=n.players.filter(i=>i.id===s.player1Id||i.id===s.player2Id||!o.has(i.id)),r=a.filter(i=>i.id!==s.player2Id||i.id===s.player1Id),d=a.filter(i=>i.id!==s.player1Id||i.id===s.player2Id);return`
            <li class="partner-pair-item" data-pair-id="${s.id}">
              <div class="pair-inputs">
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${s.id}" data-which="1">
                  ${r.map(i=>`<option value="${i.id}" ${i.id===s.player1Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
                <span class="pair-separator">&</span>
                <select class="form-select btn-sm compact-select" data-action="update-partner" data-pair-id="${s.id}" data-which="2">
                  ${d.map(i=>`<option value="${i.id}" ${i.id===s.player2Id?"selected":""}>${i.name}</option>`).join("")}
                </select>
              </div>
              <button class="remove-pair-btn" data-action="remove-pair" data-id="${s.id}">
                <span class="remove-icon">×</span>
              </button>
            </li>
          `}).join("")}
    </ul>
  `}function se(){document.querySelectorAll(".form-select").forEach(s=>{if(s.closest(".custom-select-wrapper")||s.classList.contains("no-custom"))return;const o=document.createElement("div");o.classList.add("custom-select-wrapper"),s.parentNode.insertBefore(o,s),o.appendChild(s);const a=document.createElement("div");a.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),s.classList.contains("btn-sm")&&r.classList.add("btn-sm"),s.classList.contains("compact-select")&&(o.classList.add("compact-select"),r.classList.add("compact-select"));const d=s.selectedIndex>=0?s.options[s.selectedIndex]:s.options.length>0?s.options[0]:null;r.innerHTML=`<span>${d?d.text:"Select..."}</span>`;const i=document.createElement("div");i.classList.add("custom-options"),Array.from(s.options).forEach(l=>{const c=document.createElement("div");c.classList.add("custom-option"),c.textContent=l.text,c.dataset.value=l.value,l.selected&&c.classList.add("selected"),c.addEventListener("click",()=>{s.value=c.dataset.value,s.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${c.textContent}</span>`,i.querySelectorAll(".custom-option").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),a.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width=""}),i.appendChild(c)}),a.appendChild(r),a.appendChild(i),o.appendChild(a),r.addEventListener("click",l=>{l.stopPropagation();const c=a.classList.contains("open");if(document.querySelectorAll(".custom-select.open").forEach(u=>{if(u!==a){u.classList.remove("open"),u.querySelector(".custom-options").classList.remove("show");const m=u.querySelector(".custom-options");m.style.position="",m.style.top="",m.style.left="",m.style.width="",m.style.margin=""}}),c)a.classList.remove("open"),i.classList.remove("show"),i.style.position="",i.style.top="",i.style.left="",i.style.width="",i.style.margin="";else{a.classList.add("open"),i.classList.add("show");const u=a.getBoundingClientRect();i.style.position="fixed",i.style.top=`${u.bottom+4}px`,i.style.left=`${u.left}px`,i.style.width=`${u.width}px`,i.style.zIndex="9999",i.style.margin="0"}}),s.style.display="none"}),document.addEventListener("click",s=>{s.target.closest(".custom-select")||t()}),document.addEventListener("scroll",()=>{t()},!0);function t(){document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open");const o=s.querySelector(".custom-options");o.classList.remove("show"),o.style.position="",o.style.top="",o.style.left="",o.style.width="",o.style.margin=""})}}const Rt="modulepreload",At=function(e){return"/"+e},Ne={},Nt=function(t,s,o){let a=Promise.resolve();if(s&&s.length>0){let d=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));a=d(s.map(c=>{if(c=At(c),c in Ne)return;Ne[c]=!0;const u=c.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":Rt,u||(p.as="script"),p.crossOrigin="",p.href=c,l&&p.setAttribute("nonce",l),document.head.appendChild(p),u)return new Promise((h,f)=>{p.addEventListener("load",h),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(d){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=d,window.dispatchEvent(i),!i.defaultPrevented)throw d}return a.then(d=>{for(const i of d||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};let B,U,Y,G,ee=[],xe,ae=!1;const ze=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function De(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function zt(){this.x=Math.random()*Y,this.y=Math.random()*G-G,this.r=De(10,30),this.d=Math.random()*150+10,this.color=ze[De(0,ze.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return U.beginPath(),U.lineWidth=this.r/2,U.strokeStyle=this.color,U.moveTo(this.x+this.tilt+this.r/4,this.y),U.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),U.stroke()}}function _e(){if(ae){U.clearRect(0,0,Y,G);for(let e=0;e<ee.length;e++)ee[e].draw();Dt(),xe=requestAnimationFrame(_e)}}function Dt(){for(let e=0;e<ee.length;e++){const t=ee[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>Y+20||t.x<-20||t.y>G)&&ae&&(t.x=Math.random()*Y,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function qt(){if(!ae){B||(B=document.createElement("canvas"),B.id="confetti-canvas",B.style.position="fixed",B.style.top="0",B.style.left="0",B.style.width="100%",B.style.height="100%",B.style.pointerEvents="none",B.style.zIndex="9999",document.body.appendChild(B),U=B.getContext("2d")),Y=window.innerWidth,G=window.innerHeight,B.width=Y,B.height=G,window.addEventListener("resize",()=>{Y=window.innerWidth,G=window.innerHeight,B.width=Y,B.height=G}),ae=!0,ee=[];for(let e=0;e<150;e++)ee.push(new zt);_e()}}function Ot(){ae=!1,U&&U.clearRect(0,0,Y,G),xe&&cancelAnimationFrame(xe),B&&B.remove(),B=null}function Ft(){qt(),setTimeout(Ot,5e3)}function q(e,t,s="Confirm",o,a=!1,r=null,d=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const l=document.createElement("div");l.className="modal-overlay confirm-modal",l.style.display="flex";const c=a?"btn btn-danger":"btn btn-primary";l.innerHTML=`
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
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const u=l.querySelector(".modal");u&&u.addEventListener("click",y=>y.stopPropagation());const m=l.querySelector("#modalCancelBtn"),p=l.querySelector("#modalConfirmBtn"),h=l.querySelector("#modalSecondaryBtn"),f=()=>l.remove();m&&m.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),f()}),p&&p.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),f(),o()}),h&&d&&h.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),f(),d()}),l.addEventListener("click",y=>{y.target===l&&f()})}function Ye(e,t,s,o=""){const a=document.querySelector(".input-modal");a&&a.remove();const r=document.createElement("div");r.className="modal-overlay input-modal",r.style.display="flex";const d=o?`<p class="modal-hint" style="margin-bottom: var(--space-md); text-align: left;">${o}</p>`:"";r.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        ${d}
        <div class="form-group">
          <input type="text" id="modalInput" class="form-input" placeholder="${t}" style="width: 100%;">
        </div>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: 10px;">
        <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Add</button>
      </div>
    </div>
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("visible"),10);const i=r.querySelector("#modalInput"),l=r.querySelector("#modalCancelBtn"),c=r.querySelector("#modalConfirmBtn"),u=()=>r.remove();l.onclick=u;const m=()=>{const p=i.value;p&&p.trim()&&(u(),s(p.trim()))};c.onclick=m,i.onkeydown=p=>{p.key==="Enter"&&m(),p.key==="Escape"&&u()},setTimeout(()=>i.focus(),100)}function Ge(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=a=>a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,o=document.createElement("div");o.className="final-modal",o.innerHTML=`
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
  `,document.body.appendChild(o),Ft(),setTimeout(()=>o.classList.add("visible"),10)}function Ht(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function we(e,t,s){const o=document.querySelector(".alert-modal");o&&o.remove();const a=document.createElement("div");a.className="modal-overlay alert-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector(".modal");r&&r.addEventListener("click",l=>l.stopPropagation());const d=a.querySelector("#modalOkBtn"),i=()=>{a.remove()};d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),i()}),a.addEventListener("click",l=>{l.target===a&&i()}),a.addEventListener("click",l=>{l.target===a&&i()})}function oe(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay info-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const a=o.querySelector(".modal");a&&a.addEventListener("click",l=>l.stopPropagation());const r=o.querySelector("#modalOkBtn"),d=o.querySelector("#modalCloseX"),i=()=>o.remove();r&&(r.onclick=i),d&&(d.onclick=i),o.addEventListener("click",l=>{l.target===o&&i()})}function jt(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',t.style.cursor="pointer",document.body.appendChild(t);let s=!1,o=null;const a=()=>{s||(s=!0,o&&clearTimeout(o),t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},100))};t.addEventListener("click",a),requestAnimationFrame(()=>{t.classList.add("active")});const r=t.querySelector(".countdown-number"),d=["3","2","1","GO!"];let i=0;const l=()=>{if(s)return;if(i>=d.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const c=d[i];r.textContent=c,r.className="countdown-number"+(c==="GO!"?" countdown-go":""),r.style.animation="none",requestAnimationFrame(()=>{r.style.animation=""}),i++,o=setTimeout(l,c==="GO!"?600:800)};o=setTimeout(l,100)})}window.closeFinalModal=Ht;function qe(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(C("Maximum 24 players allowed"),!1):n.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(C(`Player "${t}" already exists`),!1):(n.players.push({id:re(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),n.players.length%4===0&&(n.courts=n.players.length/4),S(),!0)}function Xe(e){n.players=n.players.filter(t=>t.id!==e),S()}function Wt(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}q("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],S(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function Vt(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(d=>d.trim()).filter(d=>d);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,o=0,a=!1;for(const d of t){if(n.players.length>=24){a=!0;break}if(n.players.some(i=>i.name.toLowerCase()===d.toLowerCase())){o++;continue}n.players.push({id:re(),name:d,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}const r=Math.floor(n.players.length/4);return r>n.courts&&(n.courts=r),S(),{added:s,duplicates:o,hitLimit:a}}function Ut(e){const t={id:re(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),S(),!0}function Je(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function _t(){const e=Je();e.length<2||(n.preferredPartners.push({id:re(),player1Id:e[0].id,player2Id:e[1].id}),S())}function Pe(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),S()}function Ke(e,t,s){const o=n.preferredPartners.find(a=>a.id===e);o&&(t===1?o.player1Id=s:o.player2Id=s,S())}const Qe={format:{label:"Format",type:"select",options:[{value:"americano",label:"Americano"},{value:"mexicano",label:"Mexicano"},{value:"team",label:"Team Americano"},{value:"teamMexicano",label:"Team Mexicano"}],helpId:"helpFormat"},courts:{label:"Courts",type:"number",min:1,max:50},scoringMode:{label:"Scoring",type:"select",options:[{value:"total",label:"Total Points"},{value:"race",label:"Race to"},{value:"time",label:"Timed"}],helpId:"helpScoring"},pointsPerMatch:{label:"Points",type:"number",min:4,max:50},maxRepeats:{label:"Repeats",type:"select",options:[{value:0,label:"No repeats"},{value:1,label:"Max 1x"},{value:2,label:"Max 2x"},{value:3,label:"Max 3x"},{value:99,label:"Unlimited"}],mexicanoOnly:!0,helpId:"helpMatchup"},pairingStrategy:{label:"Pairing",type:"select",options:[{value:"optimal",label:"Optimal"},{value:"oneThree",label:"1&3 vs 2&4"},{value:"oneTwo",label:"1&2 vs 3&4"},{value:"oneFour",label:"1&4 vs 2&3"}],mexicanoOnly:!0,helpId:"helpMatchup"},strictStrategy:{label:"Prioritize Pattern",type:"toggle",mexicanoOnly:!0,helpId:"helpMatchup"}};function Oe(){return n.scoringMode==="time"?"Minutes":n.scoringMode==="race"?"Race to":"Total Points"}function j(){var r,d;const e=document.getElementById("tournamentConfig");if(!e)return;if(Jt(e),n.isLocked){e.style.display="none";return}e.style.display="block",n.format==="team"||n.format;const t=n.format==="mexicano"||n.format==="teamMexicano",s=((r=n.players)==null?void 0:r.length)||0,o=Math.max(1,Math.floor(s/4));n.courts>o&&(n.courts=o,S()),n.pointsPerMatch<4?(n.pointsPerMatch=4,S()):n.pointsPerMatch>50&&(n.pointsPerMatch=50,S());let a='<div class="config-grid">';if(a+=V("format",n.format),t?(a+='<div class="config-spacer"></div>',a+=V("scoringMode",n.scoringMode),a+=V("pointsPerMatch",n.pointsPerMatch,{label:Oe()}),a+=V("maxRepeats",n.maxRepeats),a+=V("courts",n.courts),a+=V("pairingStrategy",n.pairingStrategy),a+=V("strictStrategy",n.strictStrategy,{disabled:n.pairingStrategy==="optimal"}),n.pairingStrategy!=="optimal"&&n.strictStrategy&&n.maxRepeats===0&&(a+=`
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `)):(a+=V("courts",n.courts),a+=V("scoringMode",n.scoringMode),a+=V("pointsPerMatch",n.pointsPerMatch,{label:Oe()})),a+="</div>",t&&((d=n.preferredPartners)==null?void 0:d.length)>0){const i=n.preferredPartners.map(l=>{const c=n.players.find(m=>m.id===l.player1Id),u=n.players.find(m=>m.id===l.player2Id);return c&&u?`${c.name} & ${u.name}`:null}).filter(Boolean);i.length>0&&(a+=`
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
    `);e.innerHTML=a}function Yt(e,t,s){const o=s.options.find(r=>String(r.value)===String(t)),a=o?o.label:t;return`
    <div class="ui-select-wrapper" data-key="${e}" tabindex="0">
      <div class="ui-trigger">
        <span>${a}</span>
        <div class="ui-arrow"></div>
      </div>
      <div class="ui-options">
        ${s.options.map(r=>`<div class="ui-option ${String(r.value)===String(t)?"selected":""}" data-value="${r.value}">${r.label}</div>`).join("")}
      </div>
    </div>
  `}function Gt(e,t,s){const o=s.min??1,a=s.max??99,r=Number.isFinite(t)?t:o,d=r<=o,i=r>=a,l=e==="pointsPerMatch"&&n.scoringMode!=="time"?2:1;return`
    <div class="ui-stepper" data-key="${e}" data-min="${o}" data-max="${a}">
      <button type="button" class="stepper-btn" data-delta="-${l}" ${d?"disabled":""} aria-label="Decrease ${e}">−</button>
      <input type="number" class="stepper-input" value="${r}" min="${o}" max="${a}" step="${l}" aria-label="${e} value">
      <button type="button" class="stepper-btn" data-delta="${l}" ${i?"disabled":""} aria-label="Increase ${e}">+</button>
    </div>
  `}function Xt(e,t,s={}){const o=!!t,a=!!s.disabled;return`
    <div class="ui-toggle ${o?"active":""} ${a?"disabled":""}" 
         data-key="${e}" 
         role="switch" 
         aria-checked="${o}"
         tabindex="${a?"-1":"0"}">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  `}function Se(e){var s;const t={...Qe[e]};if(e==="courts"){const o=((s=n.players)==null?void 0:s.length)||0,a=Math.floor(o/4);t.max=Math.max(1,a)}return t}function V(e,t,s={}){const o=Se(e),a=s.readonly,r=s.label??(o==null?void 0:o.label)??e;let d="";if(!o||a){let i=t;if(o&&o.options){const l=o.options.find(c=>c.value===t);l&&(i=l.label)}d=`<span class="config-value-static">${i}</span>`}else o.type==="select"?d=Yt(e,t,o):o.type==="number"?d=Gt(e,t,o):o.type==="toggle"?d=Xt(e,t,s):d=`<span class="config-value">${t}</span>`;return`
    <div class="config-row ${(o==null?void 0:o.type)==="toggle"?"toggle-row":""}" data-config-key="${e}">
      <div class="config-label-container">
        <span class="config-label">${r}:</span>
        ${o!=null&&o.helpId?`<button class="config-help" data-action="show-help" data-help-id="${o.helpId}">?</button>`:""}
      </div>
      ${d}
    </div>
  `}function ge(e,t){n[e]=t,S();const s=I();if(e==="format"&&s.format&&(s.format.value=t),e==="courts"&&s.courts&&(s.courts.value=t),e==="scoringMode"&&s.scoringMode){s.scoringMode.value=t;const o={time:10,race:14,total:28};n.pointsPerMatch=o[t]||28,s.points&&(s.points.value=n.pointsPerMatch)}e==="pointsPerMatch"&&s.points&&(s.points.value=t),e==="maxRepeats"&&s.maxRepeats&&(s.maxRepeats.value=t),e==="pairingStrategy"&&s.pairingStrategy&&(s.pairingStrategy.value=t,t==="optimal"&&(n.strictStrategy=!1)),e==="strictStrategy"&&document.getElementById("strictStrategy")&&(document.getElementById("strictStrategy").checked=t),j(),Nt(()=>Promise.resolve().then(()=>en),void 0).then(o=>o.renderPlayers&&o.renderPlayers())}function Jt(e){if(e.dataset.listenersAttached){console.log("Tournament Config: Listeners already attached");return}e.dataset.listenersAttached="true",console.log("Tournament Config: Attaching listeners to",e),e.addEventListener("change",t=>{var o;console.log("Tournament Config: Change event",t.target);const s=t.target;if(s.classList.contains("config-input")||s.classList.contains("stepper-input")){const a=s.closest(".ui-stepper"),r=s.dataset.key||(a==null?void 0:a.dataset.key);if(!r)return;const d=Se(r),i=(d==null?void 0:d.min)??1,l=(d==null?void 0:d.max)??99;let c=parseInt(s.value,10);isNaN(c)&&(c=i),r==="courts"&&c>l&&we("Too many courts",`You need at least ${c*4} players to use ${c} courts. With ${((o=n.players)==null?void 0:o.length)||0} players, you can have a maximum of ${l} courts.`)}}),e.addEventListener("click",t=>{console.log("Tournament Config: Click event",t.target);const s=t.target.closest(".stepper-btn");if(s){const l=s.closest(".ui-stepper"),c=l==null?void 0:l.dataset.key;if(!c)return;const u=Se(c),m=parseInt(s.dataset.delta,10)||0,p=(u==null?void 0:u.min)??1,h=(u==null?void 0:u.max)??99,f=parseInt(n[c],10);if(m>0&&f>=h&&c==="courts"){we("Too many courts",`You need at least ${(f+1)*4} players to use ${f+1} courts.`);return}const y=Math.min(h,Math.max(p,(Number.isFinite(f)?f:p)+m));y!==f&&ge(c,y);return}const o=t.target.closest(".ui-toggle");if(o&&!o.classList.contains("disabled")){const l=o.dataset.key,c=!n[l];ge(l,c);return}const a=t.target.closest(".ui-select-wrapper");if(a&&!t.target.closest(".ui-option")){const l=a.classList.contains("open");if(document.querySelectorAll(".ui-select-wrapper.open").forEach(c=>{c.classList.remove("open");const u=c.querySelector(".ui-options");u&&(u.style.display="none"),c.closest(".config-row")&&(c.closest(".config-row").style.zIndex="")}),!l){a.classList.add("open");const c=a.querySelector(".ui-options");c&&(c.style.display="block"),a.closest(".config-row")&&(a.closest(".config-row").style.zIndex="100")}}const r=t.target.closest(".ui-option");if(r){const l=r.closest(".ui-select-wrapper"),c=r.dataset.value,u=l.dataset.key,m=Qe[u];let p=c;(m.type==="number"||u==="courts"||u==="maxRepeats"||u==="pointsPerMatch")&&!isNaN(c)&&c.trim()!==""&&(p=parseInt(c)),ge(u,p)}const d=t.target.closest("[data-action]");if(!d)return;const i=d.dataset.action;if(i==="show-help"){const l=d.dataset.helpId,c=document.getElementById(l);c&&c.click()}if(i==="edit-pairs"||i==="add-pair"){if(i==="add-pair")try{const l=new Set;if(n.preferredPartners&&n.preferredPartners.forEach(u=>{l.add(String(u.player1Id)),l.add(String(u.player2Id))}),n.players.filter(u=>!l.has(String(u.id))).length<2){C("Not enough available players to form a pair","error");return}}catch(l){console.error("Validation error:",l)}Qt()}})}function Kt(e){e.target.closest(".ui-select-wrapper")||document.querySelectorAll(".ui-select-wrapper.open").forEach(t=>{t.classList.remove("open");const s=t.querySelector(".ui-options");s&&(s.style.display="none"),t.closest(".config-row")&&(t.closest(".config-row").style.zIndex="")})}function Qt(){n.preferredPartners||(n.preferredPartners=[]);const e=document.createElement("div");e.className="modal-overlay active",e.style.display="flex";const t=(b,L)=>String(b)===String(L),s=b=>n.players.find(L=>t(L.id,b)),o=b=>n.preferredPartners.find(L=>t(L.id,b));let a=null,r=null;const d=`
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
  `,document.body.appendChild(e);const i=b=>{b.key==="Escape"&&c()};document.addEventListener("keydown",i);const l=()=>document.removeEventListener("keydown",i),c=()=>{l(),e.remove()},u=e.querySelector("#sel1"),m=e.querySelector("#sel2"),p=e.querySelector("#addBtn"),h=e.querySelector("#pairsList"),f=(b,L,M)=>{const P=n.players.find(k=>t(k.id,L)),g=P?P.name:M;let w=`
      <div class="select-trigger ${!!P?"filled":""}">
        <span>${g}</span>
        <span class="select-arrow">▼</span>
      </div>
      <div class="select-options">
    `;const E=new Set;n.preferredPartners.forEach(k=>{k.player1Id&&E.add(String(k.player1Id)),k.player2Id&&E.add(String(k.player2Id))}),n.players.forEach(k=>{const N=String(k.id),J=t(k.id,L);if(E.has(N)&&!J)return;const $=b.id==="sel1"&&t(k.id,r)||b.id==="sel2"&&t(k.id,a);w+=`<div class="option ${J?"selected":""} ${$?"disabled":""}" data-val="${k.id}">${k.name}</div>`}),w+="</div>",b.innerHTML=w},y=()=>{if(n.preferredPartners.length===0){h.innerHTML='<div style="text-align: center; padding: 2rem; color: #52525b;">No fixed pairs yet</div>';return}h.innerHTML=n.preferredPartners.map(b=>{const L=n.players.find(P=>t(P.id,b.player1Id)),M=n.players.find(P=>t(P.id,b.player2Id));return!L||!M?"":`
        <div class="pair-item-clean">
          <span class="pair-names">${L.name} & ${M.name}</span>
          <div class="pair-remove-icon" data-remove="${String(b.id)}">✕</div>
        </div>
      `}).join("")},v=()=>{f(u,a,"Select Player 1"),f(m,r,"Select Player 2"),y(),a&&r&&!t(a,r)?(p.classList.add("ready"),p.disabled=!1):(p.classList.remove("ready"),p.disabled=!0)};v(),e.addEventListener("click",b=>{if(b.target===e||b.target.id==="closePairsModal"){c();return}b.target.closest(".custom-select")||(e.querySelectorAll(".select-options").forEach(g=>g.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(g=>g.classList.remove("active")));const L=b.target.closest(".select-trigger");if(L){const x=L.parentElement.querySelector(".select-options"),w=x.classList.contains("open");e.querySelectorAll(".select-options").forEach(E=>E.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(E=>E.classList.remove("active")),w||(x.classList.add("open"),L.classList.add("active"))}const M=b.target.closest(".option");if(M){const g=M.dataset.val,x=s(g);if(x){const w=M.closest(".custom-select").id;w==="sel1"&&(a=x.id),w==="sel2"&&(r=x.id),v(),e.querySelectorAll(".select-options").forEach(E=>E.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(E=>E.classList.remove("active"))}}if(b.target.closest("#addBtn")&&!p.disabled){if(n.preferredPartners.some(w=>t(w.player1Id,a)&&t(w.player2Id,r)||t(w.player1Id,r)&&t(w.player2Id,a))){alert("Pair already exists");return}if(n.preferredPartners.some(w=>t(w.player1Id,a)||t(w.player2Id,a)||t(w.player1Id,r)||t(w.player2Id,r))&&!confirm("One of these players is already in another pair. Create anyway?"))return;n.preferredPartners.push({id:re(),player1Id:a,player2Id:r}),S(),a=null,r=null,v(),j()}const P=b.target.closest(".pair-remove-icon");if(P){const g=P.dataset.remove,x=o(g);x&&(Pe(x.id),v(),j())}})}document.addEventListener("click",Kt);function _(){const e=I();if(e.playerList.innerHTML=n.players.map((t,s)=>{const o=['<option value="">Auto</option>'];for(let a=1;a<=n.courts;a++){const r=t.lockedCourt===a?"selected":"";o.push(`<option value="${a}" ${r}>Court ${a}</option>`)}return`
    <li class="player-item" data-id="${t.id}">
      <span class="player-number">${s+1}.</span>
      <span class="player-name">${t.name}</span>
      
      <select 
        class="court-lock-select form-select btn-sm" 
        onchange="window.updatePlayerCourtLock(${t.id}, this.value)"
        onclick="event.stopPropagation()"
        title="Lock to specific court"
      >
        ${o.join("")}
      </select>
      <button class="player-remove" data-action="remove-player" data-id="${t.id}">×</button>
    </li>
  `}).join(""),window.updatePlayerCourtLock||(window.updatePlayerCourtLock=(t,s)=>{const o=n.players.find(a=>a.id===t);o&&(o.lockedCourt=s?parseInt(s):null,S())}),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4){const t=n.players.length%4===0,s=n.courts*4,o=n.players.length>s;if(!t||o){const a=o?`exceeds capacity for ${n.courts} court${n.courts>1?"s":""}`:`uneven number for ${n.courts} court${n.courts>1?"s":""}`;e.playersHint.textContent=`${n.players.length} players ready! Since it ${a}, a queue system will be applied.`,e.playersHint.style.color="var(--warning)"}else e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"}else e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color="";X(),Ue(),Zt(),We(),se(),j()}function Be(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function Zt(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");if(!e)return;n.players.length<6?(e.style.display="none",t&&t.classList.add("expanded")):(e.style.display="block",t!=null&&t.classList.contains("expanded")||(e.innerHTML=`Show All Players (${n.players.length}) ▼`))}function Ze(){const e=I();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function de(){const e=I();e.importModal.style.display="none"}const en=Object.freeze(Object.defineProperty({__proto__:null,hideImportModal:de,renderPlayers:_,showImportModal:Ze,togglePlayerList:Be},Symbol.toStringTag,{value:"Module"}));let Ce=!1;function fe(){const e=I(),t=n.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(o=>{o.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function et(){var o;const e=((o=document.getElementById("scoringMode"))==null?void 0:o.value)||n.scoringMode,t=document.getElementById("scoringValueLabel"),s=document.getElementById("points");!t||!s||(e==="total"?(t.textContent="Points",s.value=24):e==="race"?(t.textContent="Target",s.value=21):e==="time"&&(t.textContent="Minutes",s.value=12))}function tn(){const e=I();e.gridColumns&&(e.gridColumns.max=6)}function nn(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,o=Math.floor(t/180),a=n.maxCourts||n.courts||2;return Math.min(Math.max(o,1),a)}function tt(){const e=I();if(Ce||n.gridColumns!==0)return;const t=nn();document.querySelectorAll(".matches-grid").forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function on(){const e=I(),t=parseInt(e.gridColumns.value);t===0?(Ce=!1,tt()):Ce=!0,n.gridColumns=t,fe(),S()}function nt(){const e=I(),t=n.textSize,s=t/100,o=document.getElementById("scheduleSection");o&&o.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function sn(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(n.roundScale=parseInt(e.value)/100,S());const s=n.roundScale||1,o=document.getElementById("roundsContainer");o&&o.style.setProperty("--card-scale",s),e&&(e.value=Math.round(s*100)),t&&(t.textContent=`${Math.round(s*100)}%`)}function ot(){return[...n.leaderboard].sort((e,t)=>{switch(n.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const s=e.played>0?e.wins/e.played:0,o=t.played>0?t.wins/t.played:0;return Math.abs(o-s)>.001?o-s:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const a=e.points+e.pointsLost,r=t.points+t.pointsLost,d=a>0?e.points/a:0,i=r>0?t.points/r:0;return Math.abs(i-d)>.001?i-d:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function F(){const e=I(),t=document.getElementById("toggleVisibilityBtn");t&&(n.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const s=document.getElementById("togglePositionBtn");if(s&&(n.showPositionChanges?(s.innerHTML="Ranks",s.classList.add("toggle-on"),s.classList.remove("toggle-off")):(s.innerHTML="Ranks",s.classList.add("toggle-off"),s.classList.remove("toggle-on")),s.title="Click to toggle rank change indicators"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const o=!n.hideLeaderboard,a=n.showPositionChanges,r=!o&&!a,d=ot();d.forEach((l,c)=>{const u=c+1,m=l.previousRank||u;l.rankChange=m-u});let i=r?[...d].sort(()=>Math.random()-.5):d;e.leaderboardBody.innerHTML=i.map((l,c)=>{const u=d.findIndex(g=>g.id===l.id)+1,m=r?"-":u;let p="";a&&l.played>0&&!r&&(l.rankChange>0?p='<span class="rank-up">▲</span>':l.rankChange<0?p='<span class="rank-down">▼</span>':p='<span class="rank-same">-</span>');const h=l.points-(l.pointsLost||0),f=l.played>0?Math.round((l.wins||0)/l.played*100)+"%":"0%",y=h>0?"+":"",v=o?l.points:"-",b=o?l.wins||0:"-",L=o?`<span class="${h>0?"text-success":h<0?"text-error":""}">${y}${h}</span>`:"-",M=o?f:"-",P=o||a?l.played:"-";return`
    <tr>
      <td>${m} ${p}</td>
      <td class="player-name-cell">${l.name}</td>
      <td class="font-bold">${v}</td>
      <td>${b}</td>
      <td>${L}</td>
      <td>${M}</td>
      <td>${P}</td>
    </tr>
  `}).join("")}function st(){n.hideLeaderboard=!n.hideLeaderboard,F()}function at(){n.showPositionChanges=!n.showPositionChanges,F()}function rt(e){n.rankingCriteria=e,F()}function an(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],r=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[r,...d],c=[];for(let y=0;y<o/2;y++){const v=l[y],b=l[o-1-y];!v.isBye&&!b.isBye&&c.push([v,b])}const u=[],m=new Set;for(let y=0;y<c.length-1;y+=2)c[y]&&c[y+1]&&(u.push({court:Math.floor(y/2)+1,team1:c[y],team2:c[y+1]}),c[y].forEach(v=>m.add(v.id)),c[y+1].forEach(v=>m.add(v.id)));const p=u.slice(0,s),h=new Set;p.forEach(y=>{y.team1.forEach(v=>h.add(v.id)),y.team2.forEach(v=>h.add(v.id))});const f=n.players.filter(y=>!y.isBye&&!h.has(y.id));p.length>0&&a.push({number:a.length+1,matches:p,byes:f}),d.unshift(d.pop())}return a}function rn(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],r=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[r,...d],c=[],u=new Set;for(let f=0;f<o/2;f++){const y=l[f],v=l[o-1-f];!y.isBye&&!v.isBye&&(c.push({court:c.length+1,team1:[y],team2:[v]}),u.add(y.id),u.add(v.id))}const m=c.slice(0,s),p=new Set;m.forEach(f=>{f.team1.forEach(y=>p.add(y.id)),f.team2.forEach(y=>p.add(y.id))});const h=n.players.filter(f=>!f.isBye&&!p.has(f.id));m.length>0&&a.push({number:a.length+1,matches:m,byes:h}),d.unshift(d.pop())}return a}function ln(){const e=[...n.players];le(e);const t=n.courts,s=[],o=new Set;for(let r=0;r<e.length-1&&s.length<t;r+=2)s.push({court:s.length+1,team1:[e[r]],team2:[e[r+1]]}),o.add(e[r].id),o.add(e[r+1].id);const a=e.filter(r=>!o.has(r.id));return[{number:1,matches:s,byes:a}]}function dn(){const e=[...n.leaderboard].sort((i,l)=>l.points-i.points),t=n.courts,s=e.filter(i=>!n.manualByes.includes(i.id)),o=e.filter(i=>n.manualByes.includes(i.id)),a=[],r=new Set;for(let i=0;i<s.length-1&&a.length<t;i+=2)a.push({court:a.length+1,team1:[s[i]],team2:[s[i+1]]}),r.add(s[i].id),r.add(s[i+1].id);const d=[...o,...s.filter(i=>!r.has(i.id))];return{number:n.schedule.length+1,matches:a,byes:d}}function cn(){const e=n.courts,t=e*4,s=[],o=new Set,a=[...n.players],r=[];a.forEach(f=>{if(o.has(f.id))return;const y=it(f.id);if(y){const v=a.find(b=>b.id===y);v?(s.push({type:"pair",players:[f,v]}),o.add(v.id)):s.push({type:"single",players:[f]})}else s.push({type:"single",players:[f]});o.add(f.id)}),le(s);const d=[];let i=0;for(const f of s)i+f.players.length<=t?(d.push(f),i+=f.players.length):r.push(...f.players);const l=[],c=[];d.forEach(f=>{f.type==="pair"?l.push(f.players):c.push(f.players[0])}),le(c);for(let f=0;f<c.length-1;f+=2)l.push([c[f],c[f+1]]);le(l);const u=[],m=new Set,p=[],h=[];for(let f=0;f<l.length-1;f+=2){const y=l[f],v=l[f+1],b=[...y,...v].find(L=>L.lockedCourt);b?p.push({team1:y,team2:v,lockedCourt:b.lockedCourt}):h.push({team1:y,team2:v})}return p.forEach(f=>{if(u.length>=e)return;let y=f.lockedCourt;(m.has(y)||y>e)&&(y=null),y?(m.add(y),u.push({court:y,team1:f.team1,team2:f.team2})):h.push({team1:f.team1,team2:f.team2})}),h.forEach(f=>{if(u.length>=e)return;let y=1;for(;m.has(y);)y++;y<=e&&(m.add(y),u.push({court:y,team1:f.team1,team2:f.team2}))}),u.sort((f,y)=>f.court-y.court),l.length%2!==0&&u.length<l.length/2&&r.push(...l[l.length-1]),[{number:1,matches:u,byes:r}]}function it(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function un(e){const t=n.courts,s=t*4,o=new Set(n.manualByes),a=[],r=new Set,d=[...e];d.forEach(g=>{if(r.has(g.id)||o.has(g.id))return;const x=it(g.id);if(x){const w=d.find(E=>E.id===x);w?o.has(w.id)?a.push({type:"single",players:[g]}):(a.push({type:"pair",players:[g,w]}),r.add(w.id)):a.push({type:"single",players:[g]})}else a.push({type:"single",players:[g]});r.add(g.id)}),a.sort((g,x)=>{const w=N=>{const J=N.players.reduce((H,$)=>H+($.byeCount||0),0),ne=N.players.reduce((H,$)=>H+($.played||0),0);return{bye:J/N.players.length,play:ne/N.players.length}},E=w(g),k=w(x);return Math.abs(k.bye-E.bye)>.1?k.bye-E.bye:E.play-k.play});const i=[],l=[];let c=0;for(const g of a)c+g.players.length<=s&&(l.push(g),i.push(...g.players),c+=g.players.length);const u=new Set(i.map(g=>g.id)),m=d.filter(g=>!u.has(g.id)),p=[],h=[];l.forEach(g=>{g.type==="pair"?p.push(g.players):h.push(g.players[0])}),h.sort((g,x)=>x.points-g.points);let f=0;for(;f<h.length-3;f+=4){const g=h[f],x=h[f+1],w=h[f+2],E=h[f+3],k=[{name:"oneThree",team1:[g,w],team2:[x,E]},{name:"oneTwo",team1:[g,x],team2:[w,E]},{name:"oneFour",team1:[g,E],team2:[x,w]}];let N;const J=n.pairingStrategy!=="optimal"&&n.strictStrategy;n.strictStrategy;const ne=n.maxRepeats!==void 0?n.maxRepeats:99,H=k.map($=>{const A=$.team1[0].id,O=$.team1[1].id,T=$.team2[0].id,z=$.team2[1].id,Re=(Lt,Et)=>{const ie=e.find(ye=>ye.id===Lt);return ie!=null&&ie.playedWith?ie.playedWith.filter(ye=>ye===Et).length:0},Ae=Re(A,O)+Re(T,z),vt=$.team1[0].points+$.team1[1].points,bt=$.team2[0].points+$.team2[1].points,xt=Math.abs(vt-bt),wt=ne<99&&Ae>ne,St=$.name===n.pairingStrategy,Ct=A*1e6+O*1e4+T*100+z;return{...$,repeatPenalty:Ae,violatesRepeats:wt,isPreferred:St,rankingImbalance:xt,tieBreaker:Ct}});if(H.sort(($,A)=>$.tieBreaker-A.tieBreaker),n.pairingStrategy==="optimal")N={...[...H].sort((A,O)=>A.repeatPenalty!==O.repeatPenalty?A.repeatPenalty-O.repeatPenalty:A.rankingImbalance!==O.rankingImbalance?A.rankingImbalance-O.rankingImbalance:A.tieBreaker-O.tieBreaker)[0],relaxedConstraint:null};else{const $=H.find(A=>A.isPreferred)||H[0];if(!$.violatesRepeats)N={...$,relaxedConstraint:null};else if(J)N={...$,relaxedConstraint:"repeats"};else{const A=H.filter(O=>!O.violatesRepeats);A.length>0?N={...[...A].sort((T,z)=>T.isPreferred!==z.isPreferred?T.isPreferred?-1:1:T.rankingImbalance!==z.rankingImbalance?T.rankingImbalance-z.rankingImbalance:T.tieBreaker-z.tieBreaker)[0],relaxedConstraint:"pattern"}:N={...[...H].sort((T,z)=>T.repeatPenalty!==z.repeatPenalty?T.repeatPenalty-z.repeatPenalty:T.isPreferred!==z.isPreferred?T.isPreferred?-1:1:T.rankingImbalance!==z.rankingImbalance?T.rankingImbalance-z.rankingImbalance:T.tieBreaker-z.tieBreaker)[0],relaxedConstraint:"tier3"}}}p.push(N.team1),p.push(N.team2)}f<h.length-1&&p.push([h[f],h[f+1]]);const y=p.map(g=>({players:g,points:g.reduce((x,w)=>x+w.points,0)}));y.sort((g,x)=>x.points-g.points);const v=[],b=new Set,L=new Set,M=[],P=[];for(let g=0;g<y.length-1;g+=2){const x=y[g],w=y[g+1],E=[...x.players,...w.players].find(k=>k.lockedCourt);E?M.push({t1:x,t2:w,lockedCourt:E.lockedCourt}):P.push({t1:x,t2:w})}return M.forEach(g=>{if(v.length>=t)return;let x=g.lockedCourt;(L.has(x)||x>t)&&(x=null),x?(L.add(x),v.push({court:x,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(w=>b.add(w.id)),g.t2.players.forEach(w=>b.add(w.id))):P.push({t1:g.t1,t2:g.t2})}),P.forEach(g=>{if(v.length>=t)return;let x=1;for(;L.has(x);)x++;x<=t&&(L.add(x),v.push({court:x,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(w=>b.add(w.id)),g.t2.players.forEach(w=>b.add(w.id)))}),v.sort((g,x)=>g.court-x.court),y.forEach(g=>{g.players.some(x=>b.has(x.id))||g.players.forEach(x=>m.push(x))}),{number:n.schedule.length+1,matches:v,byes:m}}function K(e,t,s,o,a,r=null){const d=n.leaderboard.find(i=>i.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+s,o?d.wins=(d.wins||0)+1:a||(d.losses=(d.losses||0)+1),r&&!d.playedWith&&(d.playedWith=[]),r&&d.playedWith.push(r))}function Q(e,t,s,o,a){const r=n.leaderboard.find(d=>d.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-s,o?r.wins=(r.wins||0)-1:a||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let Le=null;function mn(e){Le=e}let Ee=null;function pn(e){Ee=e}function D(){const e=I(),t=n.format,s=t==="team"||t==="teamMexicano",o=document.getElementById("playersHeader");o&&o.firstChild&&(o.firstChild.textContent=s?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const a=document.querySelector(".setup-card");if(!a)return;[a.querySelector(".setup-grid"),a.querySelector(".setup-grid-3"),document.getElementById("customCourtNamesSection")].forEach(f=>{if(!f)return;f.querySelectorAll("input, select, button").forEach(v=>{if(!v.classList.contains("always-enabled")){if(n.isLocked){if(v.disabled=!0,v.classList.add("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const L=b.querySelector(".custom-select");L&&L.classList.add("disabled")}}}else if(v.disabled=!1,v.classList.remove("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const L=b.querySelector(".custom-select");L&&L.classList.remove("disabled")}}}})});const d=document.getElementById("advancedSettingsContent");d&&(d.querySelectorAll("input, select, button").forEach(y=>{if(y.disabled=!1,y.classList.remove("locked"),y.tagName==="SELECT"){const v=y.closest(".custom-select-wrapper");if(v){const b=v.querySelector(".custom-select");b&&b.classList.remove("disabled")}}}),Ue());const i=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",i&&(i.style.display="inline-flex")):(e.generateBtn.style.display="block",i&&(i.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=!1);const l=String(t).trim(),m=l.toLowerCase()==="mexicano"||l==="teamMexicano",p=e.advancedSettingsContent;p&&(m?(p.classList.remove("collapsed"),p.classList.add("expanded")):(p.classList.remove("expanded"),p.classList.add("collapsed")));const h=document.getElementById("strictStrategy");h&&(h.disabled=!1),Ee&&Ee()}function fn(){const e=I(),t=e.format.value,s=t==="team"||t==="teamMexicano",o=s?2:4;if(n.players.length<o){C(`Not enough ${s?"teams":"players"} (min ${o})`,"error");return}n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const a=n.format==="team"||n.format==="teamMexicano"?2:4,r=Math.floor(n.players.length/a),d=()=>{pe(),n.leaderboard=n.players.map(l=>({...l,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=an(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=rn(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=ln(),n.allRounds=null):(n.schedule=cn(),n.allRounds=null),e.leaderboardSection.style.display="block",F(),Le&&Le(),e.scheduleSection.style.display="block";const i=document.getElementById("tournamentActionsSection");i&&(i.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const l=document.getElementById("round-0");l&&(l.classList.add("animate-in","highlight"),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100),n.isLocked=!0,D(),S(),C("🎾 Tournament started! Round 1 ready")};if(n.courts>r){if(r===0){we("Not Enough Players",`You need at least ${a} players/teams to start!`);return}const i=n.courts;n.courts=r,e.courts&&(e.courts.value=n.courts),C(`Adjusted courts: ${i} → ${r}`)}jt().then(()=>{d()})}function yn(){const e=I();q("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{pe(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",D(),S(),C("Tournament reset")},!0)}function lt(e){q("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,D();const t=[...n.leaderboard].sort((s,o)=>o.points-s.points);vn(),Te(),C("Tournament saved to history"),e&&e(t),F(),S()},!0)}function dt(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function ct(e=null){const t=e||n,s=new Date().toLocaleDateString(),o=new Date().toLocaleTimeString();let a="data:text/csv;charset=utf-8,";a+=`Tournament Results
`,a+=`Date,${s} ${o}
`,a+=`Format,${t.format}
`,a+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,a+=`Final Standings
`,a+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((l,c)=>c.points-l.points).forEach((l,c)=>{const u=(l.points||0)-(l.pointsLost||0);a+=`${c+1},"${l.name}",${l.points},${l.wins},${l.played},${l.pointsLost||0},${u}
`}),a+=`
`,a+=`Match History
`,a+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(l=>{l.completed&&l.matches.forEach(c=>{const u=c.team1.map(h=>h.name).join(" & "),m=c.team2.map(h=>h.name).join(" & ");let p=`Court ${c.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[c.court-1]?p=t.customCourtNames[c.court-1]:t.courtFormat==="number"&&(p=`${c.court}`),a+=`Round ${l.number},"${p}","${u}",${c.score1},${c.score2},"${m}"
`})});const d=encodeURI(a),i=document.createElement("a");i.setAttribute("href",d),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function ut(e=null){var r;const t=e||n;let o=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;o+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,o+=`Format: ${t.format}

`,o+=`Top Standings:
`,[...t.leaderboard].sort((d,i)=>i.points-d.points).slice(0,5).forEach((d,i)=>{o+=`${i+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),o+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(o),C("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),C("Failed to copy results","error")}}class gn{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),o=t%60;return`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const o=this.audioContext.createOscillator(),a=this.audioContext.createGain();o.type="sine",o.frequency.value=t,o.connect(a),a.connect(this.audioContext.destination),o.start(),a.gain.setValueAtTime(.1,this.audioContext.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),o.stop(this.audioContext.currentTime+s)}catch(o){console.warn("Audio play failed",o)}}}let R=null;function hn(){const e=I();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",R&&(R.pause(),R=null);return}if(e.matchTimerContainer.style.display="flex",R)R.duration!==n.pointsPerMatch&&R.setDuration(n.pointsPerMatch);else{R=new gn({duration:n.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed"),e.runningBadge&&(e.runningBadge.style.display="inline-flex",e.runningBadge.classList.add("running"))):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),e.runningBadge&&(e.runningBadge.style.display="none",e.runningBadge.classList.remove("running")),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=R.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>R.start(),e.timerPauseBtn.onclick=()=>R.pause(),e.timerResetBtn.onclick=()=>R.reset(),e.timerAddBtn.onclick=()=>R.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>R.addTime(-60));const t=()=>{const s=()=>{Ye("Set Timer Duration","Enter minutes (e.g. 12)",o=>{const a=parseInt(o);a>0?(n.pointsPerMatch=a,S(),R.setDuration(a),C(`Timer set to ${a} minutes`)):C("Invalid minutes","error")})};R.isRunning?q("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{R.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function W(){const e=I();hn(),ce();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((r,d)=>{const i=d===t,l=r.completed,c=l&&!i,u=l?r.matches.map(m=>`${m.score1}-${m.score2}`).join(" · "):"";return`
    <div class="round ${l?"completed":"ongoing"} ${c?"collapsed":""}" 
         id="round-${d}" 
         data-round="${d}">
      <div class="round-header" data-action="toggle-round" data-round="${d}">
        <span class="round-title">
          Round ${r.number}
          ${l?'<span class="round-status completed">✓ Completed</span>':'<span class="round-status ongoing">● Ongoing</span>'}
        </span>
        ${l?`<span class="round-summary" style="${c?"":"display: none"}">${u}</span>`:""}
        ${l?`<span class="collapse-icon">${c?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${r.matches.map((m,p)=>`
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
                  <input type="number" class="score-input" id="score-${d}-${p}-1" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                         value="${m.score1||""}"
                         data-action="autofill-score" data-round="${d}" data-match="${p}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${d}-${p}-2" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                         value="${m.score2||""}"
                         data-action="autofill-score" data-round="${d}" data-match="${p}" data-team="2">
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
  `}).join(""),tn(),fe(),nt(),mt();const s=n.schedule.findIndex(r=>!r.completed),o=s>=0?s:0,a=document.getElementById(`round-${o}`);a&&setTimeout(()=>{a.scrollIntoView({behavior:"smooth",block:"start"})},100)}function ce(){const e=document.getElementById("gameDetails");if(!e)return;const t={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},s={total:"Total Points",race:"Race to Points",time:"Time Based"},o=[{label:t[n.format]||"Tournament"},{label:`${n.courts} Courts`},{label:s[n.scoringMode]},{label:n.scoringMode==="time"?`${n.pointsPerMatch} Mins`:`${n.pointsPerMatch} Pts`}];e.innerHTML=o.map(a=>`
    <div class="game-detail-item">
      <span class="detail-label">${a.label}</span>
    </div>
  `).join("")}mn(W);function $e(e,t,s,o){setTimeout(mt,0);let a=parseInt(o);if(isNaN(a)||a<0)return;const r=parseInt(n.pointsPerMatch);if(!(isNaN(r)||r<=0)){if(n.scoringMode==="total"){if(a>r){a=r;const c=document.getElementById(`score-${e}-${t}-${s}`);c&&(c.value=a)}const d=s===1||s==="1"?2:1,i=r-a,l=document.getElementById(`score-${e}-${t}-${d}`);l&&i>=0&&(l.value=i)}else if(n.scoringMode==="race"){if(a<r){const d=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&(i.value=r)}else if(a===r){const d=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function mt(){const e=n.schedule.findIndex(r=>!r.completed);if(e===-1)return;const t=n.schedule[e],s=document.querySelector(".complete-round-btn");if(!s)return;let o=!0;const a=parseInt(n.pointsPerMatch);for(let r=0;r<t.matches.length;r++){const d=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`);if(!d||!i)continue;const l=d.value,c=i.value;if(l===""||c===""){o=!1;break}const u=parseInt(l),m=parseInt(c);if(n.scoringMode==="total"){if(u+m!==a){o=!1;break}}else if(u<0||m<0){o=!1;break}}s.disabled=!1,o?(s.classList.remove("btn-warning"),s.classList.add("btn-success"),s.textContent=`Complete Round ${t.number}`):(s.classList.add("btn-warning"),s.classList.remove("btn-success"),s.textContent="Complete Anyway")}function pt(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▼");const a=t.querySelector(".round-summary");a&&(a.style.display="none")}else{t.classList.add("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▶");const a=t.querySelector(".round-summary");a&&(a.style.display="")}}function ft(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),W();return}const s=n.courts*4,o=n.leaderboard.length,a=Math.max(0,o-s);if(a===0){C(`All ${o} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=a){C(`Max ${a} can rest. Deselect someone first.`);return}n.manualByes.push(e),W()}function yt(){const e=n.schedule.length-1,t=n.schedule[e];let s=!0;const o=[];if(t.matches.forEach((a,r)=>{const d=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`),l=d==null?void 0:d.value,c=i==null?void 0:i.value;let u=!0;(l===""||c==="")&&(u=!1,l===""&&(d==null||d.classList.add("error")),c===""&&(i==null||i.classList.add("error")));const m=parseInt(l)||0,p=parseInt(c)||0;if(n.scoringMode==="total"){const h=parseInt(n.pointsPerMatch,10);m+p!==h?(u=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&c!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error"))}else m<0||p<0?(u=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&c!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error"));u||(s=!1,o.push(ve(a.court)))}),!s){let a="Some matches have missing or invalid scores.";o.length>0&&(a=`
        <p style="margin-bottom: var(--space-md);">The following matches need scores:</p>
        <ul style="text-align: left; margin: 0 0 var(--space-md) var(--space-lg); list-style: disc;">
          ${o.map(d=>`<li>${d}</li>`).join("")}
        </ul>
        <p>Do you want to complete the round anyway?</p>
      `),q("Incomplete/Invalid Scores",a,"Yes, Complete Anyway",()=>{he(t)},!0);return}if(n.scoringMode==="race"){const a=[],r=n.pointsPerMatch;if(t.matches.forEach((d,i)=>{const l=document.getElementById(`score-${e}-${i}-1`),c=document.getElementById(`score-${e}-${i}-2`),u=parseInt(l==null?void 0:l.value)||0,m=parseInt(c==null?void 0:c.value)||0;u<r&&m<r&&a.push(ve(d.court))}),a.length>0){const d=a.join(", ");q("Low Scores Detected",`On ${d}, neither team reached the target of ${r}. Is this correct?`,"Yes, Complete Round",()=>{he(t)},!0);return}}he(t)}function he(e){const t=n.schedule.findIndex(i=>i===e);ot().forEach((i,l)=>{const c=n.leaderboard.find(u=>u.id===i.id);c&&(c.previousRank=l+1)}),e.matches.forEach((i,l)=>{const c=document.getElementById(`score-${t}-${l}-1`),u=document.getElementById(`score-${t}-${l}-2`),m=parseInt(c==null?void 0:c.value)||0,p=parseInt(u==null?void 0:u.value)||0;i.score1=m,i.score2=p;const h=m===p,f=m>p,y=p>m;i.team1[1]?(K(i.team1[0].id,m,p,f,h,i.team1[1].id),K(i.team1[1].id,m,p,f,h,i.team1[0].id),K(i.team2[0].id,p,m,y,h,i.team2[1].id),K(i.team2[1].id,p,m,y,h,i.team2[0].id)):(K(i.team1[0].id,m,p,f,h,null),K(i.team2[0].id,p,m,y,h,null))});const o=document.querySelector(".complete-round-btn");if(o&&(o.classList.add("completing"),o.textContent="✓ Completing..."),pe(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const l=n.leaderboard.find(c=>c.id===i.id);l&&(l.byeCount=(l.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="teamMexicano"){if(n.currentRound<=20){const i=dn();i.matches.length>0&&n.schedule.push(i)}}else if(n.format==="mexicano"&&n.currentRound<=20){const i=un(n.leaderboard);i.matches.length>0&&n.schedule.push(i)}F(),W(),S();const a=document.getElementById(`round-${t}`);a&&(a.classList.add("complete-flash"),setTimeout(()=>a.classList.remove("complete-flash"),1e3));const r=e.number,d=n.schedule.length>t+1;C(d?`✓ Round ${r} complete! Round ${r+1} ready`:`✓ Round ${r} complete!`),setTimeout(()=>{const i=n.schedule.length-1,l=document.getElementById(`round-${i}`);l&&(l.classList.add("animate-in","highlight"),l.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100)}function gt(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){pe();for(let o=e;o<n.schedule.length;o++){const a=n.schedule[o];a.completed&&a.matches.forEach(r=>{r.team1[1]?(Q(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),Q(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(Q(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,F(),W(),S(),C(`Editing Round ${e+1}`)}}const Me="padel_history_v1";function vn(){var o;const e=te(),t=Mt(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),name:t.tournamentName||"",notes:t.tournamentNotes||"",format:t.format,winner:((o=t.leaderboard[0])==null?void 0:o.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(Me,JSON.stringify(e)),s}function te(){try{const e=localStorage.getItem(Me);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function bn(e){q("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=te().filter(o=>o.id!==e);localStorage.setItem(Me,JSON.stringify(s)),Te(),C("Tournament deleted")},!0)}function xn(e){const s=te().find(o=>o.id===e);if(!s){C("Tournament details not found","error");return}q("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{Ie(s.data),W(),F(),S(),C("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(o){console.error("Failed to load tournament",o),C("Error loading tournament","error")}},!1)}let me=[];function wn(){Te();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Sn(s)})}function Sn(e){if(!e){ke(me);return}const t=me.filter(s=>{var u,m,p,h,f,y,v,b;const o=(((u=s.summary)==null?void 0:u.winner)||((p=(m=s.players)==null?void 0:m[0])==null?void 0:p.name)||"").toLowerCase(),a=(((h=s.summary)==null?void 0:h.format)||s.format||"").toLowerCase(),r=((f=s.summary)==null?void 0:f.date)||s.date||"",d=String(((y=s.summary)==null?void 0:y.playerCount)||((v=s.players)==null?void 0:v.length)||""),i=String(((b=s.summary)==null?void 0:b.roundCount)||""),c=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return o.includes(e)||a.includes(e)||c.includes(e)||d.includes(e)||i.includes(e)});ke(t)}function Te(){me=te(),ke(me)}function ke(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn btn-primary">
        Start a Tournament
      </button>
    `,s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=bn,window.loadTournament=xn,window.downloadHistoryItem=Cn,t.innerHTML=e.map(o=>{var f,y,v,b,L,M,P,g;const a=o.summary?o.summary.date:o.date,r=o.summary?o.summary.format:o.format||"Unknown",d=r.charAt(0).toUpperCase()+r.slice(1);let i="Unknown";((y=(f=o.data)==null?void 0:f.leaderboard)==null?void 0:y.length)>0?i=((v=[...o.data.leaderboard].sort((w,E)=>E.points-w.points)[0])==null?void 0:v.name)||"Unknown":(b=o.summary)!=null&&b.winner&&(i=o.summary.winner);const l=o.summary?o.summary.playerCount:((L=o.players)==null?void 0:L.length)||0,c=((M=o.summary)==null?void 0:M.roundCount)||((g=(P=o.data)==null?void 0:P.schedule)==null?void 0:g.length)||0,u=new Date(a),m=u.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),p=u.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),h=!!o.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${m}</span>
            <span class="date-sub">${p}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-sm badge-outline">${d}</span>
        </td>
        <td>
          <div class="winner-cell">
            <span class="trophy-icon">🏆</span>
            <span class="winner-name">${i}</span>
          </div>
        </td>
        <td>${l}</td>
        <td>${c}</td>
        <td class="text-right">
           <!-- Desktop: Show all buttons -->
           <div class="action-buttons desktop-only">
              <button 
                onclick="downloadHistoryItem('${o.id}')" 
                class="btn btn-sm btn-ghost"
                title="Download CSV"
              >
                CSV
              </button>
              <button 
                onclick="loadTournament('${o.id}')" 
                class="btn btn-sm btn-primary"
                ${h?"":"disabled"}
                title="Restore this tournament"
              >
                Load
              </button>
              <button 
                onclick="duplicateTournament('${o.id}')" 
                class="btn btn-sm btn-ghost"
                ${h?"":"disabled"}
                title="Copy settings to new tournament"
              >
                Duplicate
              </button>
              <button 
                onclick="deleteHistoryItem('${o.id}')" 
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
                <button onclick="loadTournament('${o.id}')" ${h?"":"disabled"}>Load</button>
                <button onclick="duplicateTournament('${o.id}')" ${h?"":"disabled"}>Duplicate</button>
                <button onclick="downloadHistoryItem('${o.id}')">CSV</button>
                <button class="text-danger" onclick="deleteHistoryItem('${o.id}')">Delete</button>
              </div>
           </div>
        </td>
      </tr>
      `}).join("")}}function Cn(e){const s=te().find(o=>o.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}function Ln(e){const s=te().find(o=>o.id===e);if(!s||!s.data){C("Tournament details not found","error");return}q("Duplicate this tournament?","This will copy settings and players but reset all scores.","Duplicate",()=>{try{const a={...s.data,leaderboard:[],schedule:[],currentRound:0,allRounds:null,isLocked:!1,hideLeaderboard:!0,manualByes:[]};Ie(a),W(),F(),S(),C("Tournament duplicated - ready to start!"),window.scrollTo({top:0,behavior:"smooth"})}catch(o){console.error("Failed to duplicate tournament",o),C("Error duplicating tournament","error")}},!1)}function En(e){const t=e.nextElementSibling,s=t.classList.contains("open");document.querySelectorAll(".action-menu-dropdown.open").forEach(o=>{o.classList.remove("open")}),s||t.classList.add("open")}document.addEventListener("click",e=>{e.target.closest(".action-menu")||document.querySelectorAll(".action-menu-dropdown.open").forEach(t=>{t.classList.remove("open")})});window.duplicateTournament=Ln;window.toggleActionMenu=En;document.addEventListener("DOMContentLoaded",()=>{});function $n(e,t){let s;const o=document.getElementById(e),a=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",d=>{d.preventDefault(),s=d,o&&(o.style.display="inline-flex",o.addEventListener("click",async()=>{o.style.display="none",s.prompt(),(await s.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),s=null}))}),a&&!r&&o&&t&&(o.style.display="inline-flex",o.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{o&&(o.style.display="none"),s=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function kn(){console.log("Tournament App: Initialized"),$t({activeLink:"tournament"}),$n("installBtn",()=>{oe("Install App on iPhone",`
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `)}),kt();const e=je();Bt(),e.format.value=n.format,e.courts.value=n.courts,e.scoringMode.value=n.scoringMode,e.points.value=n.pointsPerMatch,e.courtFormat.value=n.courtFormat,e.maxRepeats.value=n.maxRepeats,e.pairingStrategy&&(e.pairingStrategy.value=n.pairingStrategy);const t=document.getElementById("rankingCriteria");t&&(t.value=n.rankingCriteria);const s=document.getElementById("strictStrategy");if(s&&(s.checked=n.strictStrategy||!1),Ve(),pn(j),_(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const o=document.getElementById("tournamentActionsSection");o&&(o.style.display="block"),W(),F(),fe()}Mn(e),se(),Tn(),wn(),window.addEventListener("resize",tt),Bn(),D(),et(),j(),In(),Pn()}function In(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const s=t.getBoundingClientRect(),o=document.createElement("span");o.className="ripple",o.style.width=o.style.height=`${Math.max(s.width,s.height)}px`,o.style.left=`${e.clientX-s.left-o.offsetWidth/2}px`,o.style.top=`${e.clientY-s.top-o.offsetHeight/2}px`,t.appendChild(o),setTimeout(()=>o.remove(),600)})}function Pn(){const e=document.querySelectorAll(".section-title, .card-header-basic h3, .card-header-advanced h3, .leaderboard-header h3, .players-header h3");e.forEach(s=>s.classList.add("animate-in"));const t=new IntersectionObserver(s=>{s.forEach(o=>{o.isIntersecting&&o.target.classList.add("animate-in")})},{threshold:.1});e.forEach(s=>t.observe(s))}function Bn(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function Mn(e){const t=document.getElementById("undoBtn");t&&(t.addEventListener("click",()=>{if(Pt())if(C("Undo successful"),e.format.value=n.format,_(),W(),F(),D(),fe(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="none")}}),document.addEventListener("keydown",u=>{(u.ctrlKey||u.metaKey)&&u.key==="z"&&!u.shiftKey&&(u.preventDefault(),t.click())})),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Wt(()=>{_(),X(),D()})}),e.importPlayersBtn.addEventListener("click",Ze),e.closeImportModal.addEventListener("click",de),e.cancelImportBtn.addEventListener("click",de),e.confirmImportBtn.addEventListener("click",()=>{const u=e.importTextarea.value,m=Vt(u);let p=`Added ${m.added} players.`;m.duplicates>0&&(p+=` Skipped ${m.duplicates} duplicates.`),m.hitLimit&&(p+=" Stopped at 24 max limit."),e.importStatus.textContent=p,_(),m.added>0&&m.duplicates===0&&!m.hitLimit&&(setTimeout(de,1500),C(`Imported ${m.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{qe(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),_())}),e.playerNameInput.addEventListener("keydown",u=>{u.key==="Enter"&&qe(e.playerNameInput.value)&&(e.playerNameInput.value="",_())}),e.format.addEventListener("change",()=>{n.format=e.format.value,D(),S(),n.schedule.length>0&&ce()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),S(),j(),n.schedule.length>0&&ce(),n.courtFormat==="custom"&&be()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),S(),j(),n.schedule.length>0&&W()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,et(),S(),j(),n.schedule.length>0&&W()});const s=document.getElementById("rankingCriteria");s&&s.addEventListener("change",()=>{n.rankingCriteria=s.value,rt(),S()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Ve(),S()}),e.courts.addEventListener("input",()=>{const m=e.courts.value;if(m==="")return;let p=parseInt(m)||1;p=Math.max(1,Math.min(50,p)),!n.isLocked&&(e.courts.value=p,n.courts=p,S(),n.courtFormat==="custom"&&be(),n.schedule.length>0&&ce())}),e.maxRepeats.addEventListener("change",u=>{const m=parseInt(u.target.value),p=n.maxRepeats;n.isLocked?(u.target.value=p,q("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=m,e.maxRepeats.value=m,S(),j(),C("Max Partner Repeats updated")},!0)):(n.maxRepeats=m,S(),j())});const o=document.getElementById("strictStrategy");o&&o.addEventListener("change",u=>{if(n.pairingStrategy==="optimal"){u.target.checked=!1,C("Strict Pattern is not available with Optimal pairing","info");return}const m=u.target.checked,p=n.strictStrategy;n.isLocked?(u.target.checked=!!p,q("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=m,o.checked=m,S(),C("Strict Mode updated")},!0)):(n.strictStrategy=m,S())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",u=>{const m=u.target.value,p=n.pairingStrategy;if(n.isLocked)u.target.value=p,q("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(n.pairingStrategy=m,e.pairingStrategy.value=m,m==="optimal"){n.strictStrategy=!1;const h=document.getElementById("strictStrategy");h&&(h.checked=!1)}S(),D(),C("Pairing Strategy updated")},!0);else{if(n.pairingStrategy=m,m==="optimal"){n.strictStrategy=!1;const h=document.getElementById("strictStrategy");h&&(h.checked=!1)}S(),D()}}),e.addPartnerPairBtn.addEventListener("click",()=>{if(Je().length<2){C("Not enough available players to form a pair","error");return}_t(),X(),D(),se(),C("Fixed pair added","success")});const a=document.getElementById("helpFormat");a&&a.addEventListener("click",()=>{oe("Tournament Formats",`
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
        `)});const r=document.getElementById("helpScoring");r&&r.addEventListener("click",()=>{oe("Scoring Modes",`
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
        `)});const d=document.getElementById("helpMatchup");d&&d.addEventListener("click",()=>{oe("Matchup Rules",`
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
        `)});const i=document.getElementById("helpLeaderboard");i&&i.addEventListener("click",()=>{oe("Leaderboard Guide",`
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
        `)}),e.generateBtn.addEventListener("click",fn),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",yn),e.gridColumns&&e.gridColumns.addEventListener("input",on),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),nt(),S()});const l=document.getElementById("factoryResetBtn");l&&l.addEventListener("click",()=>{q("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const c=document.getElementById("roundScale");c&&c.addEventListener("input",sn)}function Tn(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.id?Number(t.dataset.id):null,a=t.dataset.round?parseInt(t.dataset.round):null;switch(s){case"remove-player":o!==null&&(Xe(o),_());break;case"toggle-player-list":Be();break;case"remove-pair":o!==null&&(Pe(o),X(),D(),se());break;case"toggle-bye":o!==null&&ft(o);break;case"toggle-round":a!==null&&pt(a);break;case"complete-round":yt();break;case"edit-round":a!==null&&gt(a);break;case"toggle-visibility":st();break;case"toggle-position":at();break;case"end-tournament":lt(Ge);break;case"toggle-toolbar":dt();break;case"export-data":ct();break;case"share-results":ut();break;case"add-late-player":ht();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.pairId?Number(t.dataset.pairId):null,a=t.dataset.which?parseInt(t.dataset.which):null;if(s==="update-partner"&&o!==null&&a!==null&&(Ke(o,a,Number(t.value)),X(),D(),se()),s==="autofill-score"&&n.scoringMode==="race"){const r=parseInt(t.dataset.round),d=parseInt(t.dataset.match),i=parseInt(t.dataset.team),l=t.value;$e(r,d,i,l)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||n.scoringMode==="race")return;const s=parseInt(t.dataset.round),o=parseInt(t.dataset.match),a=parseInt(t.dataset.team),r=t.value;$e(s,o,a,r)})}function ht(){const e=n.format==="team"||n.format==="teamMexicano";Ye(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",o=>{if(o&&o.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,C("Switched to Mexicano format")}Ut(o.trim());const a=document.getElementById("playerCount");a&&(a.textContent=`(${n.players.length})`),F(),C(`Added ${o.trim()} to tournament`)}},`The new ${e?"team":"player"} will join with 0 points and be included starting from the next round. Their ranking will adjust based on future match results.`)}window.removePlayer=e=>{Xe(e),_()};window.togglePlayerList=Be;window.updatePreferredPair=(e,t,s)=>{Ke(e,t,s),X()};window.removePreferredPair=e=>{Pe(e),X()};window.updateCustomCourtName=Tt;window.autoFillScore=$e;window.toggleManualBye=ft;window.toggleRoundCollapse=pt;window.completeRound=yt;window.editRound=gt;window.toggleLeaderboardVisibility=st;window.togglePositionChanges=at;window.updateRankingCriteria=rt;window.updateSetupUI=D;window.endTournament=()=>lt(Ge);window.validateCourts=We;window.toggleToolbar=dt;window.exportTournamentData=ct;window.shareResults=ut;window.promptAddLatePlayer=ht;kn();
