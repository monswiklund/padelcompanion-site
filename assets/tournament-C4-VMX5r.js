import{i as vt,a as bt}from"./layout-DCA26Yf3.js";const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},X=[],wt=20;function Ne(){const e=document.getElementById("undoBtn");e&&(e.disabled=X.length===0)}function de(){const e=JSON.parse(JSON.stringify(n));X.push(e),X.length>wt&&X.shift(),Ne()}function Ct(){if(X.length===0)return!1;const e=X.pop();return De(e),Ne(),!0}const ze="tournament-state";function w(){localStorage.setItem(ze,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function xt(){const e=localStorage.getItem(ze);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function St(){return JSON.parse(JSON.stringify(n))}function De(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],w())}function ae(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function x(e,t,s){let o=3e3,a="default";typeof t=="number"?o=t:typeof t=="string"&&(a=t);const r=document.querySelector(".toast");r&&r.remove();const d=document.createElement("div");d.className=`toast ${a}`,d.textContent=e,document.body.appendChild(d),setTimeout(()=>d.classList.add("visible"),10),setTimeout(()=>{d.classList.remove("visible"),setTimeout(()=>d.remove(),300)},o)}function ce(){return Math.floor(Date.now()+Math.random()*1e6)}let ie=null;function He(){return ie={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn"),runningBadge:document.getElementById("runningBadge")},ie}function L(){return ie||He(),ie}function ge(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function Fe(){var i;const e=L(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const o=parseInt(t.value)||1,a=((i=e.format)==null?void 0:i.value)||n.format,r=a==="team"||a==="teamMexicano"?2:4,d=Math.floor(n.players.length/r);return t.max=Math.max(1,d),o>d&&d>0?(s.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(s.textContent=`⚠️ Need at least ${r} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function qe(){const e=L();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",he()):e.customCourtNamesSection.style.display="none"}function he(){const e=L();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,o)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[o]||`Court ${o+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${o}, this.value)"
             placeholder="Court ${o+1}">
    </div>
  `).join("")}function Lt(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,w()}function Oe(){const e=L(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)});const s=n.players.filter(o=>!t.has(o.id));e.addPartnerPairBtn.disabled=s.length<2}function V(){const e=L(),t=s=>{const o=new Set;return n.preferredPartners.forEach(a=>{a.id!==s&&(o.add(a.player1Id),o.add(a.player2Id))}),o};e.preferredPartnersList.innerHTML=n.preferredPartners.map(s=>{const o=t(s.id),a=n.players.filter(i=>i.id===s.player1Id||i.id===s.player2Id||!o.has(i.id)),r=a.filter(i=>i.id!==s.player2Id||i.id===s.player1Id),d=a.filter(i=>i.id!==s.player1Id||i.id===s.player2Id);return`
        <div class="partner-pair" data-pair-id="${s.id}">
          <select class="form-select" data-action="update-partner" data-pair-id="${s.id}" data-which="1">
            ${r.map(i=>`<option value="${i.id}" ${i.id===s.player1Id?"selected":""}>${i.name}</option>`).join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" data-action="update-partner" data-pair-id="${s.id}" data-which="2">
            ${d.map(i=>`<option value="${i.id}" ${i.id===s.player2Id?"selected":""}>${i.name}</option>`).join("")}
          </select>
          <button class="remove-pair-btn" data-action="remove-pair" data-id="${s.id}">Remove</button>
        </div>
      `}).join("")}function te(){document.querySelectorAll(".form-select").forEach(t=>{if(t.closest(".custom-select-wrapper")||t.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),t.parentNode.insertBefore(s,t),s.appendChild(t);const o=document.createElement("div");o.classList.add("custom-select");const a=document.createElement("div");a.classList.add("custom-select-trigger"),t.classList.contains("btn-sm")&&a.classList.add("btn-sm"),a.innerHTML=`<span>${t.options[t.selectedIndex].text}</span>`;const r=document.createElement("div");r.classList.add("custom-options"),Array.from(t.options).forEach(d=>{const i=document.createElement("div");i.classList.add("custom-option"),i.textContent=d.text,i.dataset.value=d.value,d.selected&&i.classList.add("selected"),i.addEventListener("click",()=>{t.value=i.dataset.value,t.dispatchEvent(new Event("change",{bubbles:!0})),a.innerHTML=`<span>${i.textContent}</span>`,r.querySelectorAll(".custom-option").forEach(l=>l.classList.remove("selected")),i.classList.add("selected"),o.classList.remove("open"),r.classList.remove("show")}),r.appendChild(i)}),o.appendChild(a),o.appendChild(r),s.appendChild(o),a.addEventListener("click",d=>{d.stopPropagation(),document.querySelectorAll(".custom-select.open").forEach(i=>{i!==o&&(i.classList.remove("open"),i.querySelector(".custom-options").classList.remove("show"))}),o.classList.toggle("open"),r.classList.toggle("show")}),t.style.display="none"}),document.addEventListener("click",t=>{t.target.closest(".custom-select")||document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open"),s.querySelector(".custom-options").classList.remove("show")})})}function W(){const e=L();e.playerList.innerHTML=n.players.map((t,s)=>{const o=['<option value="">Auto</option>'];for(let a=1;a<=n.courts;a++){const r=t.lockedCourt===a?"selected":"";o.push(`<option value="${a}" ${r}>Court ${a}</option>`)}return`
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
  `}).join(""),window.updatePlayerCourtLock||(window.updatePlayerCourtLock=(t,s)=>{const o=n.players.find(a=>a.id===t);o&&(o.lockedCourt=s?parseInt(s):null,w())}),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4?(e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"):(e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color=""),V(),Oe(),Bt(),Fe(),te()}function Et(){const e=L();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function Me(){const e=L();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function We(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function Bt(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function It(){const e=L();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function fe(){const e=L();e.importModal.style.display="none"}let ve=!1;function ue(){const e=L(),t=n.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(o=>{o.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function je(){var o;const e=((o=document.getElementById("scoringMode"))==null?void 0:o.value)||n.scoringMode,t=document.getElementById("scoringValueLabel"),s=document.getElementById("points");!t||!s||(e==="total"?(t.textContent="Points",s.value=24):e==="race"?(t.textContent="Target",s.value=21):e==="time"&&(t.textContent="Minutes",s.value=12))}function $t(){const e=L();e.gridColumns&&(e.gridColumns.max=6)}function Pt(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,o=Math.floor(t/180),a=n.maxCourts||n.courts||2;return Math.min(Math.max(o,1),a)}function Ve(){const e=L();if(ve||n.gridColumns!==0)return;const t=Pt();document.querySelectorAll(".matches-grid").forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function kt(){const e=L(),t=parseInt(e.gridColumns.value);t===0?(ve=!1,Ve()):ve=!0,n.gridColumns=t,ue(),w()}function Ue(){const e=L(),t=n.textSize,s=t/100,o=document.getElementById("scheduleSection");o&&o.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function Mt(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(n.roundScale=parseInt(e.value)/100,w());const s=n.roundScale||1,o=document.getElementById("roundsContainer");o&&o.style.setProperty("--card-scale",s),e&&(e.value=Math.round(s*100)),t&&(t.textContent=`${Math.round(s*100)}%`)}function Ye(){return[...n.leaderboard].sort((e,t)=>{switch(n.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const s=e.played>0?e.wins/e.played:0,o=t.played>0?t.wins/t.played:0;return Math.abs(o-s)>.001?o-s:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const a=e.points+e.pointsLost,r=t.points+t.pointsLost,d=a>0?e.points/a:0,i=r>0?t.points/r:0;return Math.abs(i-d)>.001?i-d:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function D(){const e=L(),t=document.getElementById("toggleVisibilityBtn");t&&(n.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const s=document.getElementById("togglePositionBtn");if(s&&(n.showPositionChanges?(s.innerHTML="Ranks",s.classList.add("toggle-on"),s.classList.remove("toggle-off")):(s.innerHTML="Ranks",s.classList.add("toggle-off"),s.classList.remove("toggle-on")),s.title="Click to toggle rank change indicators"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const o=!n.hideLeaderboard,a=n.showPositionChanges,r=!o&&!a,d=Ye();d.forEach((l,p)=>{const y=p+1,h=l.previousRank||y;l.rankChange=h-y});let i=r?[...d].sort(()=>Math.random()-.5):d;e.leaderboardBody.innerHTML=i.map((l,p)=>{const y=d.findIndex(g=>g.id===l.id)+1,h=r?"-":y;let m="";a&&l.played>0&&!r&&(l.rankChange>0?m='<span class="rank-up">▲</span>':l.rankChange<0?m='<span class="rank-down">▼</span>':m='<span class="rank-same">-</span>');const f=l.points-(l.pointsLost||0),c=l.played>0?Math.round((l.wins||0)/l.played*100)+"%":"0%",u=f>0?"+":"",v=o?l.points:"-",C=o?l.wins||0:"-",B=o?`<span class="${f>0?"text-success":f<0?"text-error":""}">${u}${f}</span>`:"-",A=o?c:"-",J=o||a?l.played:"-";return`
    <tr>
      <td>${h} ${m}</td>
      <td class="player-name-cell">${l.name}</td>
      <td class="font-bold">${v}</td>
      <td>${C}</td>
      <td>${B}</td>
      <td>${A}</td>
      <td>${J}</td>
    </tr>
  `}).join("")}function Ge(){n.hideLeaderboard=!n.hideLeaderboard,D()}function Xe(){n.showPositionChanges=!n.showPositionChanges,D()}function _e(e){n.rankingCriteria=e,D()}let E,N,F,q,_=[],be,ne=!1;const Te=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Re(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function Tt(){this.x=Math.random()*F,this.y=Math.random()*q-q,this.r=Re(10,30),this.d=Math.random()*150+10,this.color=Te[Re(0,Te.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return N.beginPath(),N.lineWidth=this.r/2,N.strokeStyle=this.color,N.moveTo(this.x+this.tilt+this.r/4,this.y),N.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),N.stroke()}}function Je(){if(ne){N.clearRect(0,0,F,q);for(let e=0;e<_.length;e++)_[e].draw();Rt(),be=requestAnimationFrame(Je)}}function Rt(){for(let e=0;e<_.length;e++){const t=_[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>F+20||t.x<-20||t.y>q)&&ne&&(t.x=Math.random()*F,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function At(){if(!ne){E||(E=document.createElement("canvas"),E.id="confetti-canvas",E.style.position="fixed",E.style.top="0",E.style.left="0",E.style.width="100%",E.style.height="100%",E.style.pointerEvents="none",E.style.zIndex="9999",document.body.appendChild(E),N=E.getContext("2d")),F=window.innerWidth,q=window.innerHeight,E.width=F,E.height=q,window.addEventListener("resize",()=>{F=window.innerWidth,q=window.innerHeight,E.width=F,E.height=q}),ne=!0,_=[];for(let e=0;e<150;e++)_.push(new Tt);Je()}}function Nt(){ne=!1,N&&N.clearRect(0,0,F,q),be&&cancelAnimationFrame(be),E&&E.remove(),E=null}function zt(){At(),setTimeout(Nt,5e3)}function M(e,t,s="Confirm",o,a=!1,r=null,d=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const l=document.createElement("div");l.className="modal-overlay confirm-modal",l.style.display="flex";const p=a?"btn btn-danger":"btn btn-primary";l.innerHTML=`
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
          <button class="${p}" id="modalConfirmBtn" style="flex: 1;">${s}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const y=l.querySelector(".modal");y&&y.addEventListener("click",u=>u.stopPropagation());const h=l.querySelector("#modalCancelBtn"),m=l.querySelector("#modalConfirmBtn"),f=l.querySelector("#modalSecondaryBtn"),c=()=>l.remove();h&&h.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),c()}),m&&m.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),c(),o()}),f&&d&&f.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),c(),d()}),l.addEventListener("click",u=>{u.target===l&&c()})}function Ke(e,t,s){const o=document.querySelector(".input-modal");o&&o.remove();const a=document.createElement("div");a.className="modal-overlay input-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector("#modalInput"),d=a.querySelector("#modalCancelBtn"),i=a.querySelector("#modalConfirmBtn"),l=()=>a.remove();d.onclick=l;const p=()=>{const y=r.value;y&&y.trim()&&(l(),s(y.trim()))};i.onclick=p,r.onkeydown=y=>{y.key==="Enter"&&p(),y.key==="Escape"&&l()},setTimeout(()=>r.focus(),100)}function Qe(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=a=>a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,o=document.createElement("div");o.className="final-modal",o.innerHTML=`
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
        <button class="btn btn-secondary" onclick="window.shareResults()">Share</button>
        <button class="btn btn-secondary" onclick="window.exportTournamentData()">Download CSV</button>
        <button class="btn btn-primary" onclick="window.closeFinalModal()">Close</button>
      </div>
    </div>
  `,document.body.appendChild(o),zt(),setTimeout(()=>o.classList.add("visible"),10)}function Dt(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function Ht(e,t,s){const o=document.querySelector(".alert-modal");o&&o.remove();const a=document.createElement("div");a.className="modal-overlay alert-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector(".modal");r&&r.addEventListener("click",l=>l.stopPropagation());const d=a.querySelector("#modalOkBtn"),i=()=>{a.remove()};d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),i()}),a.addEventListener("click",l=>{l.target===a&&i()}),a.addEventListener("click",l=>{l.target===a&&i()})}function ee(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay info-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const a=o.querySelector(".modal");a&&a.addEventListener("click",l=>l.stopPropagation());const r=o.querySelector("#modalOkBtn"),d=o.querySelector("#modalCloseX"),i=()=>o.remove();r&&(r.onclick=i),d&&(d.onclick=i),o.addEventListener("click",l=>{l.target===o&&i()})}function Ft(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("active")});const s=t.querySelector(".countdown-number"),o=["3","2","1","GO!"];let a=0;const r=()=>{if(a>=o.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const d=o[a];s.textContent=d,s.className="countdown-number"+(d==="GO!"?" countdown-go":""),s.style.animation="none",requestAnimationFrame(()=>{s.style.animation=""}),a++,setTimeout(r,d==="GO!"?600:800)};setTimeout(r,100)})}window.closeFinalModal=Dt;function qt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],r=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[r,...d],p=[];for(let u=0;u<o/2;u++){const v=l[u],C=l[o-1-u];!v.isBye&&!C.isBye&&p.push([v,C])}const y=[],h=new Set;for(let u=0;u<p.length-1;u+=2)p[u]&&p[u+1]&&(y.push({court:Math.floor(u/2)+1,team1:p[u],team2:p[u+1]}),p[u].forEach(v=>h.add(v.id)),p[u+1].forEach(v=>h.add(v.id)));const m=y.slice(0,s),f=new Set;m.forEach(u=>{u.team1.forEach(v=>f.add(v.id)),u.team2.forEach(v=>f.add(v.id))});const c=n.players.filter(u=>!u.isBye&&!f.has(u.id));m.length>0&&a.push({number:a.length+1,matches:m,byes:c}),d.unshift(d.pop())}return a}function Ot(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],r=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[r,...d],p=[],y=new Set;for(let c=0;c<o/2;c++){const u=l[c],v=l[o-1-c];!u.isBye&&!v.isBye&&(p.push({court:p.length+1,team1:[u],team2:[v]}),y.add(u.id),y.add(v.id))}const h=p.slice(0,s),m=new Set;h.forEach(c=>{c.team1.forEach(u=>m.add(u.id)),c.team2.forEach(u=>m.add(u.id))});const f=n.players.filter(c=>!c.isBye&&!m.has(c.id));h.length>0&&a.push({number:a.length+1,matches:h,byes:f}),d.unshift(d.pop())}return a}function Wt(){const e=[...n.players];ae(e);const t=n.courts,s=[],o=new Set;for(let r=0;r<e.length-1&&s.length<t;r+=2)s.push({court:s.length+1,team1:[e[r]],team2:[e[r+1]]}),o.add(e[r].id),o.add(e[r+1].id);const a=e.filter(r=>!o.has(r.id));return[{number:1,matches:s,byes:a}]}function jt(){const e=[...n.leaderboard].sort((i,l)=>l.points-i.points),t=n.courts,s=e.filter(i=>!n.manualByes.includes(i.id)),o=e.filter(i=>n.manualByes.includes(i.id)),a=[],r=new Set;for(let i=0;i<s.length-1&&a.length<t;i+=2)a.push({court:a.length+1,team1:[s[i]],team2:[s[i+1]]}),r.add(s[i].id),r.add(s[i+1].id);const d=[...o,...s.filter(i=>!r.has(i.id))];return{number:n.schedule.length+1,matches:a,byes:d}}function Vt(){const e=n.courts,t=e*4,s=[],o=new Set,a=[...n.players],r=[];a.forEach(c=>{if(o.has(c.id))return;const u=Ze(c.id);if(u){const v=a.find(C=>C.id===u);v?(s.push({type:"pair",players:[c,v]}),o.add(v.id)):s.push({type:"single",players:[c]})}else s.push({type:"single",players:[c]});o.add(c.id)}),ae(s);const d=[];let i=0;for(const c of s)i+c.players.length<=t?(d.push(c),i+=c.players.length):r.push(...c.players);const l=[],p=[];d.forEach(c=>{c.type==="pair"?l.push(c.players):p.push(c.players[0])}),ae(p);for(let c=0;c<p.length-1;c+=2)l.push([p[c],p[c+1]]);ae(l);const y=[],h=new Set,m=[],f=[];for(let c=0;c<l.length-1;c+=2){const u=l[c],v=l[c+1],C=[...u,...v].find(B=>B.lockedCourt);C?m.push({team1:u,team2:v,lockedCourt:C.lockedCourt}):f.push({team1:u,team2:v})}return m.forEach(c=>{if(y.length>=e)return;let u=c.lockedCourt;(h.has(u)||u>e)&&(u=null),u?(h.add(u),y.push({court:u,team1:c.team1,team2:c.team2})):f.push({team1:c.team1,team2:c.team2})}),f.forEach(c=>{if(y.length>=e)return;let u=1;for(;h.has(u);)u++;u<=e&&(h.add(u),y.push({court:u,team1:c.team1,team2:c.team2}))}),y.sort((c,u)=>c.court-u.court),l.length%2!==0&&y.length<l.length/2&&r.push(...l[l.length-1]),[{number:1,matches:y,byes:r}]}function Ze(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function Ut(e){const t=n.courts,s=t*4,o=new Set(n.manualByes),a=[],r=new Set,d=[...e];d.forEach(g=>{if(r.has(g.id)||o.has(g.id))return;const b=Ze(g.id);if(b){const S=d.find(k=>k.id===b);S?o.has(S.id)?a.push({type:"single",players:[g]}):(a.push({type:"pair",players:[g,S]}),r.add(S.id)):a.push({type:"single",players:[g]})}else a.push({type:"single",players:[g]});r.add(g.id)}),a.sort((g,b)=>{const S=T=>{const j=T.players.reduce(($,R)=>$+(R.byeCount||0),0),K=T.players.reduce(($,R)=>$+(R.played||0),0);return{bye:j/T.players.length,play:K/T.players.length}},k=S(g),H=S(b);return Math.abs(H.bye-k.bye)>.1?H.bye-k.bye:k.play-H.play});const i=[],l=[];let p=0;for(const g of a)p+g.players.length<=s&&(l.push(g),i.push(...g.players),p+=g.players.length);const y=new Set(i.map(g=>g.id)),h=d.filter(g=>!y.has(g.id)),m=[],f=[];l.forEach(g=>{g.type==="pair"?m.push(g.players):f.push(g.players[0])}),f.sort((g,b)=>b.points-g.points);let c=0;for(;c<f.length-3;c+=4){const g=f[c],b=f[c+1],S=f[c+2],k=f[c+3],H=[{name:"oneThree",team1:[g,S],team2:[b,k]},{name:"oneTwo",team1:[g,b],team2:[S,k]},{name:"oneFour",team1:[g,k],team2:[b,S]}];let T;if(n.pairingStrategy==="optimal"||!n.strictStrategy){const j=H.map($=>{let R=0;const ft=$.team1[0].id,yt=$.team1[1].id,gt=$.team2[0].id,ht=$.team2[1].id,Le=(Q,Z)=>{const se=e.find(U=>U.id===Q);let me=0;se!=null&&se.playedWith&&(me+=se.playedWith.filter(U=>U===Z).length);const Ee=n.maxRepeats!==void 0?n.maxRepeats:99;if(Ee<99&&n.schedule&&n.schedule.length>0){let U=0;for(let pe=n.schedule.length-1;pe>=0;pe--){const Be=n.schedule[pe];if(!Be.completed)continue;if(Be.matches.some(O=>{var Ie,$e,Pe,ke;return O.team1[0].id===Q&&((Ie=O.team1[1])==null?void 0:Ie.id)===Z||O.team1[0].id===Z&&(($e=O.team1[1])==null?void 0:$e.id)===Q||O.team2[0].id===Q&&((Pe=O.team2[1])==null?void 0:Pe.id)===Z||O.team2[0].id===Z&&((ke=O.team2[1])==null?void 0:ke.id)===Q}))U++;else break}U>Ee&&(me+=1e3)}return me};return R+=Le(ft,yt),R+=Le(gt,ht),{...$,score:R}}),K=[...j].sort(($,R)=>$.score-R.score)[0];if(n.pairingStrategy==="optimal")T=K;else{const $=j.find(R=>R.name===n.pairingStrategy)||j[0];!n.strictStrategy&&$.score>=1e3&&K.score<1e3?T=K:T=$}}else T=H.find(j=>j.name===n.pairingStrategy)||H[0];m.push(T.team1),m.push(T.team2)}c<f.length-1&&m.push([f[c],f[c+1]]);const u=m.map(g=>({players:g,points:g.reduce((b,S)=>b+S.points,0)}));u.sort((g,b)=>b.points-g.points);const v=[],C=new Set,B=new Set,A=[],J=[];for(let g=0;g<u.length-1;g+=2){const b=u[g],S=u[g+1],k=[...b.players,...S.players].find(H=>H.lockedCourt);k?A.push({t1:b,t2:S,lockedCourt:k.lockedCourt}):J.push({t1:b,t2:S})}return A.forEach(g=>{if(v.length>=t)return;let b=g.lockedCourt;(B.has(b)||b>t)&&(b=null),b?(B.add(b),v.push({court:b,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(S=>C.add(S.id)),g.t2.players.forEach(S=>C.add(S.id))):J.push({t1:g.t1,t2:g.t2})}),J.forEach(g=>{if(v.length>=t)return;let b=1;for(;B.has(b);)b++;b<=t&&(B.add(b),v.push({court:b,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(S=>C.add(S.id)),g.t2.players.forEach(S=>C.add(S.id)))}),v.sort((g,b)=>g.court-b.court),u.forEach(g=>{g.players.some(b=>C.has(b.id))||g.players.forEach(b=>h.push(b))}),{number:n.schedule.length+1,matches:v,byes:h}}function Y(e,t,s,o,a,r=null){const d=n.leaderboard.find(i=>i.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+s,o?d.wins=(d.wins||0)+1:a||(d.losses=(d.losses||0)+1),r&&!d.playedWith&&(d.playedWith=[]),r&&d.playedWith.push(r))}function G(e,t,s,o,a){const r=n.leaderboard.find(d=>d.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-s,o?r.wins=(r.wins||0)-1:a||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let we=null;function Yt(e){we=e}function P(){const e=L(),t=n.format,s=t==="team"||t==="teamMexicano",o=document.getElementById("playersHeader");o&&o.firstChild&&(o.firstChild.textContent=s?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const a=document.querySelector(".setup-card");if(!a)return;[a.querySelector(".setup-grid"),a.querySelector(".setup-grid-3"),document.getElementById("customCourtNamesSection")].forEach(u=>{if(!u)return;u.querySelectorAll("input, select, button").forEach(C=>{if(!C.classList.contains("always-enabled")){if(n.isLocked){if(C.disabled=!0,C.classList.add("locked"),C.tagName==="SELECT"){const B=C.closest(".custom-select-wrapper");if(B){const A=B.querySelector(".custom-select");A&&A.classList.add("disabled")}}}else if(C.disabled=!1,C.classList.remove("locked"),C.tagName==="SELECT"){const B=C.closest(".custom-select-wrapper");if(B){const A=B.querySelector(".custom-select");A&&A.classList.remove("disabled")}}}})});const d=document.getElementById("advancedSettingsContent");d&&(d.querySelectorAll("input, select, button").forEach(v=>{if(v.disabled=!1,v.classList.remove("locked"),v.tagName==="SELECT"){const C=v.closest(".custom-select-wrapper");if(C){const B=C.querySelector(".custom-select");B&&B.classList.remove("disabled")}}}),Oe());const i=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",i&&(i.style.display="inline-flex")):(e.generateBtn.style.display="block",i&&(i.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=n.players.length<4);const l=String(t).trim(),h=l.toLowerCase()==="mexicano"||l==="teamMexicano",m=e.advancedSettingsContent;m&&(h?(m.classList.remove("collapsed"),m.classList.add("expanded")):(m.classList.remove("expanded"),m.classList.add("collapsed")));const f=document.getElementById("strictStrategy"),c=f==null?void 0:f.closest(".form-check");if(f){const u=n.pairingStrategy==="optimal";f.disabled=u,c&&(c.style.opacity=u?"0.5":"1",c.style.pointerEvents=u?"none":"auto")}}function Gt(){const e=L();n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const t=n.format==="team"||n.format==="teamMexicano"?2:4,s=Math.floor(n.players.length/t),o=()=>{de(),n.leaderboard=n.players.map(r=>({...r,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=qt(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=Ot(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=Wt(),n.allRounds=null):(n.schedule=Vt(),n.allRounds=null),e.leaderboardSection.style.display="block",D(),we&&we(),e.scheduleSection.style.display="block";const a=document.getElementById("tournamentActionsSection");a&&(a.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const r=document.getElementById("round-0");r&&(r.classList.add("animate-in","highlight"),setTimeout(()=>{r.classList.remove("animate-in","highlight")},1600))},100),n.isLocked=!0,P(),w(),x("🎾 Tournament started! Round 1 ready")};if(n.courts>s){if(s===0){Ht("Not Enough Players",`You need at least ${t} players/teams to start!`);return}const a=n.courts;n.courts=s,e.courts&&(e.courts.value=n.courts),x(`Adjusted courts: ${a} → ${s}`)}Ft().then(()=>{o()})}function Xt(){const e=L();M("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{de(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",P(),w(),x("Tournament reset")},!0)}function et(e){M("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,P();const t=[...n.leaderboard].sort((s,o)=>o.points-s.points);Kt(),x("Tournament saved to history"),e&&e(t),w()},!0)}function tt(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function nt(e=null){const t=e||n,s=new Date().toLocaleDateString(),o=new Date().toLocaleTimeString();let a="data:text/csv;charset=utf-8,";a+=`Tournament Results
`,a+=`Date,${s} ${o}
`,a+=`Format,${t.format}
`,a+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,a+=`Final Standings
`,a+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((l,p)=>p.points-l.points).forEach((l,p)=>{const y=(l.points||0)-(l.pointsLost||0);a+=`${p+1},"${l.name}",${l.points},${l.wins},${l.played},${l.pointsLost||0},${y}
`}),a+=`
`,a+=`Match History
`,a+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(l=>{l.completed&&l.matches.forEach(p=>{const y=p.team1.map(f=>f.name).join(" & "),h=p.team2.map(f=>f.name).join(" & ");let m=`Court ${p.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[p.court-1]?m=t.customCourtNames[p.court-1]:t.courtFormat==="number"&&(m=`${p.court}`),a+=`Round ${l.number},"${m}","${y}",${p.score1},${p.score2},"${h}"
`})});const d=encodeURI(a),i=document.createElement("a");i.setAttribute("href",d),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function ot(e=null){var r;const t=e||n;let o=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;o+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,o+=`Format: ${t.format}

`,o+=`Top Standings:
`,[...t.leaderboard].sort((d,i)=>i.points-d.points).slice(0,5).forEach((d,i)=>{o+=`${i+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),o+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(o),x("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),x("Failed to copy results","error")}}class _t{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),o=t%60;return`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const o=this.audioContext.createOscillator(),a=this.audioContext.createGain();o.type="sine",o.frequency.value=t,o.connect(a),a.connect(this.audioContext.destination),o.start(),a.gain.setValueAtTime(.1,this.audioContext.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),o.stop(this.audioContext.currentTime+s)}catch(o){console.warn("Audio play failed",o)}}}let I=null;function Jt(){const e=L();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",I&&(I.pause(),I=null);return}if(e.matchTimerContainer.style.display="flex",I)I.duration!==n.pointsPerMatch&&I.setDuration(n.pointsPerMatch);else{I=new _t({duration:n.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed"),e.runningBadge&&(e.runningBadge.style.display="inline-flex",e.runningBadge.classList.add("running"))):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),e.runningBadge&&(e.runningBadge.style.display="none",e.runningBadge.classList.remove("running")),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=I.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>I.start(),e.timerPauseBtn.onclick=()=>I.pause(),e.timerResetBtn.onclick=()=>I.reset(),e.timerAddBtn.onclick=()=>I.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>I.addTime(-60));const t=()=>{const s=()=>{Ke("Set Timer Duration","Enter minutes (e.g. 12)",o=>{const a=parseInt(o);a>0?(n.pointsPerMatch=a,w(),I.setDuration(a),x(`Timer set to ${a} minutes`)):x("Invalid minutes","error")})};I.isRunning?M("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{I.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function z(){const e=L();Jt(),re();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((s,o)=>{const a=o===t,r=s.completed,d=r&&!a,i=r?s.matches.map(l=>`${l.score1}-${l.score2}`).join(" · "):"";return`
    <div class="round ${r?"completed":""} ${d?"collapsed":""}" 
         id="round-${o}" 
         data-round="${o}">
      <div class="round-header" data-action="toggle-round" data-round="${o}">
        <span class="round-title">
          Round ${s.number} ${r?"(done)":""}
        </span>
        ${d?`<span class="round-summary">${i}</span>`:""}
        ${r?`<span class="collapse-icon">${d?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${s.matches.map((l,p)=>`
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${ge(l.court)}</span>
                <span class="match-info-sub">
                  ${n.scoringMode==="total"?`Total ${n.pointsPerMatch}`:n.scoringMode==="race"?`Race to ${n.pointsPerMatch}`:`${n.pointsPerMatch} mins`}
                </span>
              </div>
              <div class="match-card">
                <div class="match-teams">
                  <div class="team">
                    <span>${l.team1[0].name}</span>
                    ${l.team1[1]?`<span>${l.team1[1].name}</span>`:""}
                  </div>
                  <div class="team">
                    <span>${l.team2[0].name}</span>
                    ${l.team2[1]?`<span>${l.team2[1].name}</span>`:""}
                  </div>
                </div>
              </div>
              <div class="match-card-footer">
                ${r?`
                <div class="score-input-row">
                  <span class="score-display">${l.score1} - ${l.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${o}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${o}-${p}-1" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                         value="${l.score1||""}"
                         data-action="autofill-score" data-round="${o}" data-match="${p}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${o}-${p}-2" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                         value="${l.score2||""}"
                         data-action="autofill-score" data-round="${o}" data-match="${p}" data-team="2">
                </div>
                `}
              </div>
            </div>
          `).join("")}
        </div>
        ${s.byes&&s.byes.length>0?`
        <div class="waiting-players">
          <span class="waiting-label">Resting:</span>
          <span class="waiting-names">${s.byes.map(l=>l.name).join(", ")}</span>
        </div>
        `:""}
        ${!r&&a?`
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${n.manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${n.leaderboard.map(l=>`
              <button class="bye-chip ${n.manualByes.includes(l.id)?"selected":""}" 
                      data-action="toggle-bye" data-id="${l.id}">
                ${l.name}
                <span class="bye-count">(${l.byeCount||0})</span>
              </button>
            `).join("")}
          </div>
        </div>
        <button class="btn btn-primary complete-round-btn" data-action="complete-round">
          Complete Round ${s.number}
        </button>
        `:""}
      </div>
    </div>
  `}).join(""),$t(),ue(),Ue(),st()}function re(){const e=document.getElementById("gameDetails");if(!e)return;const t={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},s={total:"Total Points",race:"Race to Points",time:"Time Based"},o=[{label:t[n.format]||"Tournament",icon:"🏆"},{label:`${n.courts} Courts`,icon:"🎾"},{label:s[n.scoringMode],icon:"⚡"},{label:n.scoringMode==="time"?`${n.pointsPerMatch} Mins`:`${n.pointsPerMatch} Pts`,icon:"🎯"}];e.innerHTML=o.map(a=>`
    <div class="game-detail-item">
      <span>${a.label}</span>
    </div>
  `).join("")}Yt(z);function Ce(e,t,s,o){setTimeout(st,0);let a=parseInt(o);if(isNaN(a)||a<0)return;const r=parseInt(n.pointsPerMatch);if(!(isNaN(r)||r<=0)){if(n.scoringMode==="total"){if(a>r){a=r;const p=document.getElementById(`score-${e}-${t}-${s}`);p&&(p.value=a)}const d=s===1||s==="1"?2:1,i=r-a,l=document.getElementById(`score-${e}-${t}-${d}`);l&&i>=0&&(l.value=i)}else if(n.scoringMode==="race"){if(a<r){const d=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&(i.value=r)}else if(a===r){const d=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function st(){const e=n.schedule.findIndex(r=>!r.completed);if(e===-1)return;const t=n.schedule[e],s=document.querySelector(".complete-round-btn");if(!s)return;let o=!0;const a=parseInt(n.pointsPerMatch);for(let r=0;r<t.matches.length;r++){const d=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`);if(!d||!i)continue;const l=d.value,p=i.value;if(l===""||p===""){o=!1;break}const y=parseInt(l),h=parseInt(p);if(n.scoringMode==="total"){if(y+h!==a){o=!1;break}}else if(y<0||h<0){o=!1;break}}s.disabled=!1,o?(s.classList.remove("btn-warning"),s.textContent=`Complete Round ${t.number}`):(s.classList.add("btn-warning"),s.textContent="Complete Anyway")}function at(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▼");const a=t.querySelector(".round-summary");a&&(a.style.display="none")}else{t.classList.add("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▶");const a=t.querySelector(".round-summary");a&&(a.style.display="")}}function rt(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),z();return}const s=n.courts*4,o=n.leaderboard.length,a=Math.max(0,o-s);if(a===0){x(`All ${o} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=a){x(`Max ${a} can rest. Deselect someone first.`);return}n.manualByes.push(e),z()}function it(){const e=n.schedule.length-1,t=n.schedule[e];let s=!0;const o=[];if(t.matches.forEach((a,r)=>{const d=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`),l=d==null?void 0:d.value,p=i==null?void 0:i.value;let y=!0;(l===""||p==="")&&(y=!1,l===""&&(d==null||d.classList.add("error")),p===""&&(i==null||i.classList.add("error")));const h=parseInt(l)||0,m=parseInt(p)||0;n.scoringMode==="total"?h+m!==n.pointsPerMatch?(y=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&p!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error")):h<0||m<0?(y=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&p!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error")),y||(s=!1,o.push(ge(a.court)))}),!s){const a=o.length>0?` on ${o.join(", ")}`:"";M("Incomplete/Invalid Scores",`Some matches have missing or invalid scores${a}. Do you want to complete the round anyway?`,"Yes, Complete Anyway",()=>{ye(t)},!0);return}if(n.scoringMode==="race"){const a=[],r=n.pointsPerMatch;if(t.matches.forEach((d,i)=>{const l=document.getElementById(`score-${e}-${i}-1`),p=document.getElementById(`score-${e}-${i}-2`),y=parseInt(l==null?void 0:l.value)||0,h=parseInt(p==null?void 0:p.value)||0;y<r&&h<r&&a.push(ge(d.court))}),a.length>0){const d=a.join(", ");M("Low Scores Detected",`On ${d}, neither team reached the target of ${r}. Is this correct?`,"Yes, Complete Round",()=>{ye(t)},!0);return}}ye(t)}function ye(e){const t=n.schedule.findIndex(i=>i===e);if(Ye().forEach((i,l)=>{const p=n.leaderboard.find(y=>y.id===i.id);p&&(p.previousRank=l+1)}),e.matches.forEach((i,l)=>{const p=document.getElementById(`score-${t}-${l}-1`),y=document.getElementById(`score-${t}-${l}-2`),h=parseInt(p==null?void 0:p.value)||0,m=parseInt(y==null?void 0:y.value)||0;i.score1=h,i.score2=m;const f=h===m,c=h>m,u=m>h;i.team1[1]?(Y(i.team1[0].id,h,m,c,f,i.team1[1].id),Y(i.team1[1].id,h,m,c,f,i.team1[0].id),Y(i.team2[0].id,m,h,u,f,i.team2[1].id),Y(i.team2[1].id,m,h,u,f,i.team2[0].id)):(Y(i.team1[0].id,h,m,c,f,null),Y(i.team2[0].id,m,h,u,f,null))}),!allScoresValid){n.scoringMode==="total"?x(`Scores must sum to ${n.pointsPerMatch}`):x("Please enter valid positive scores");return}const o=document.querySelector(".complete-round-btn");if(o&&(o.classList.add("completing"),o.textContent="✓ Completing..."),de(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const l=n.leaderboard.find(p=>p.id===i.id);l&&(l.byeCount=(l.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="teamMexicano"){if(n.currentRound<=20){const i=jt();i.matches.length>0&&n.schedule.push(i)}}else if(n.format==="mexicano"&&n.currentRound<=20){const i=Ut(n.leaderboard);i.matches.length>0&&n.schedule.push(i)}D(),z(),w();const a=document.getElementById(`round-${t}`);a&&(a.classList.add("complete-flash"),setTimeout(()=>a.classList.remove("complete-flash"),1e3));const r=e.number,d=n.schedule.length>t+1;x(d?`✓ Round ${r} complete! Round ${r+1} ready`:`✓ Round ${r} complete!`),setTimeout(()=>{const i=n.schedule.length-1,l=document.getElementById(`round-${i}`);l&&(l.classList.add("animate-in","highlight"),l.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100)}function lt(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){de();for(let o=e;o<n.schedule.length;o++){const a=n.schedule[o];a.completed&&a.matches.forEach(r=>{r.team1[1]?(G(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),G(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),G(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),G(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(G(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),G(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,D(),z(),w(),x(`Editing Round ${e+1}`)}}const Se="padel_history_v1";function Kt(){var o;const e=oe(),t=St(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((o=t.leaderboard[0])==null?void 0:o.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(Se,JSON.stringify(e)),s}function oe(){try{const e=localStorage.getItem(Se);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function Qt(e){M("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=oe().filter(o=>o.id!==e);localStorage.setItem(Se,JSON.stringify(s)),dt(),x("Tournament deleted")},!0)}function Zt(e){const s=oe().find(o=>o.id===e);if(!s){x("Tournament details not found","error");return}M("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{De(s.data),z(),D(),w(),x("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(o){console.error("Failed to load tournament",o),x("Error loading tournament","error")}},!1)}let le=[];function en(){dt();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();tn(s)})}function tn(e){if(!e){xe(le);return}const t=le.filter(s=>{var y,h,m,f,c,u,v,C;const o=(((y=s.summary)==null?void 0:y.winner)||((m=(h=s.players)==null?void 0:h[0])==null?void 0:m.name)||"").toLowerCase(),a=(((f=s.summary)==null?void 0:f.format)||s.format||"").toLowerCase(),r=((c=s.summary)==null?void 0:c.date)||s.date||"",d=String(((u=s.summary)==null?void 0:u.playerCount)||((v=s.players)==null?void 0:v.length)||""),i=String(((C=s.summary)==null?void 0:C.roundCount)||""),p=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return o.includes(e)||a.includes(e)||p.includes(e)||d.includes(e)||i.includes(e)});xe(t)}function dt(){le=oe(),xe(le)}function xe(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <a href="#" onclick="document.getElementById('format').scrollIntoView({behavior: 'smooth'}); return false;" class="btn btn-primary">
        Start a Tournament
      </a>
    `,s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=Qt,window.loadTournament=Zt,window.downloadHistoryItem=nn,t.innerHTML=e.map(o=>{var m,f,c;const a=o.summary?o.summary.date:o.date,r=o.summary?o.summary.format:o.format||"Unknown",d=o.summary?o.summary.winner:((f=(m=o.players)==null?void 0:m[0])==null?void 0:f.name)||"Unknown",i=o.summary?o.summary.playerCount:((c=o.players)==null?void 0:c.length)||0,l=new Date(a),p=l.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),y=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),h=!!o.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${p}</span>
            <span class="date-sub">${y}</span>
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
                onclick="deleteHistoryItem('${o.id}')" 
                class="btn btn-sm btn-ghost text-error"
                title="Delete permanently"
              >
                <i class="fas fa-trash"></i>
              </button>
           </div>
        </td>
      </tr>
      `}).join("")}}function nn(e){const s=oe().find(o=>o.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}document.addEventListener("DOMContentLoaded",()=>{});function Ae(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(x("Maximum 24 players allowed"),!1):n.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(x(`Player "${t}" already exists`),!1):(n.players.push({id:ce(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),w(),!0)}function ct(e){n.players=n.players.filter(t=>t.id!==e),w()}function on(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}M("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],w(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function sn(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(r=>r.trim()).filter(r=>r);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,o=0,a=!1;for(const r of t){if(n.players.length>=24){a=!0;break}if(n.players.some(d=>d.name.toLowerCase()===r.toLowerCase())){o++;continue}n.players.push({id:ce(),name:r,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}return w(),{added:s,duplicates:o,hitLimit:a}}function an(e){const t={id:ce(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),w(),!0}function rn(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function ln(){const e=rn();e.length<2||(n.preferredPartners.push({id:ce(),player1Id:e[0].id,player2Id:e[1].id}),w())}function ut(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),w()}function mt(e,t,s){const o=n.preferredPartners.find(a=>a.id===e);o&&(t===1?o.player1Id=s:o.player2Id=s,w())}function dn(e,t){let s;const o=document.getElementById(e),a=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",d=>{d.preventDefault(),s=d,o&&(o.style.display="inline-flex",o.addEventListener("click",async()=>{o.style.display="none",s.prompt(),(await s.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),s=null}))}),a&&!r&&o&&t&&(o.style.display="inline-flex",o.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{o&&(o.style.display="none"),s=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function cn(){vt({activeLink:"tournament"}),dn("installBtn",()=>{ee("Install App on iPhone",`
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `)}),bt();const e=He();xt(),e.format.value=n.format,e.courts.value=n.courts,e.scoringMode.value=n.scoringMode,e.points.value=n.pointsPerMatch,e.courtFormat.value=n.courtFormat,e.maxRepeats.value=n.maxRepeats,e.pairingStrategy&&(e.pairingStrategy.value=n.pairingStrategy);const t=document.getElementById("rankingCriteria");t&&(t.value=n.rankingCriteria);const s=document.getElementById("strictStrategy");if(s&&(s.checked=n.strictStrategy||!1),qe(),W(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const o=document.getElementById("tournamentActionsSection");o&&(o.style.display="block"),z(),D(),ue()}fn(e),te(),yn(),en(),window.addEventListener("resize",Ve),pn(),P(),je(),un(),mn()}function un(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const s=t.getBoundingClientRect(),o=document.createElement("span");o.className="ripple",o.style.width=o.style.height=`${Math.max(s.width,s.height)}px`,o.style.left=`${e.clientX-s.left-o.offsetWidth/2}px`,o.style.top=`${e.clientY-s.top-o.offsetHeight/2}px`,t.appendChild(o),setTimeout(()=>o.remove(),600)})}function mn(){const e=document.querySelectorAll(".section-title, .card-header-basic h3, .card-header-advanced h3, .leaderboard-header h3, .players-header h3");e.forEach(s=>s.classList.add("animate-in"));const t=new IntersectionObserver(s=>{s.forEach(o=>{o.isIntersecting&&o.target.classList.add("animate-in")})},{threshold:.1});e.forEach(s=>t.observe(s))}function pn(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function fn(e){const t=document.getElementById("navToggle"),s=document.getElementById("nav");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("open"),t.classList.toggle("active")}),document.addEventListener("click",m=>{s.classList.contains("open")&&!s.contains(m.target)&&!t.contains(m.target)&&(s.classList.remove("open"),t.classList.remove("active"))}),s.querySelectorAll("a").forEach(m=>{m.addEventListener("click",()=>{s.classList.remove("open"),t.classList.remove("active")})}));const o=document.getElementById("undoBtn");o&&(o.addEventListener("click",()=>{if(Ct())if(x("Undo successful"),e.format.value=n.format,W(),z(),D(),P(),ue(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const m=document.getElementById("tournamentActionsSection");m&&(m.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const m=document.getElementById("tournamentActionsSection");m&&(m.style.display="none")}}),document.addEventListener("keydown",m=>{(m.ctrlKey||m.metaKey)&&m.key==="z"&&!m.shiftKey&&(m.preventDefault(),o.click())})),e.addPlayerBtn.addEventListener("click",Et),e.cancelAddBtn.addEventListener("click",Me),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{on(()=>{W(),V(),P()})}),e.importPlayersBtn.addEventListener("click",It),e.closeImportModal.addEventListener("click",fe),e.cancelImportBtn.addEventListener("click",fe),e.confirmImportBtn.addEventListener("click",()=>{const m=e.importTextarea.value,f=sn(m);let c=`Added ${f.added} players.`;f.duplicates>0&&(c+=` Skipped ${f.duplicates} duplicates.`),f.hitLimit&&(c+=" Stopped at 24 max limit."),e.importStatus.textContent=c,W(),f.added>0&&f.duplicates===0&&!f.hitLimit&&(setTimeout(fe,1500),x(`Imported ${f.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{Ae(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),W())}),e.playerNameInput.addEventListener("keydown",m=>{m.key==="Enter"?Ae(e.playerNameInput.value)&&(e.playerNameInput.value="",W()):m.key==="Escape"&&Me()}),e.format.addEventListener("change",()=>{n.format=e.format.value,P(),w(),n.schedule.length>0&&re()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),w(),n.schedule.length>0&&re(),n.courtFormat==="custom"&&he()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),w(),n.schedule.length>0&&z()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,je(),w(),n.schedule.length>0&&z()});const a=document.getElementById("rankingCriteria");a&&a.addEventListener("change",()=>{n.rankingCriteria=a.value,_e(),w()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,qe(),w()}),e.courts.addEventListener("input",()=>{const f=e.courts.value;if(f==="")return;let c=parseInt(f)||1;c=Math.max(1,Math.min(50,c)),!n.isLocked&&(e.courts.value=c,n.courts=c,w(),n.courtFormat==="custom"&&he(),n.schedule.length>0&&re())}),e.maxRepeats.addEventListener("change",m=>{const f=parseInt(m.target.value),c=n.maxRepeats;n.isLocked?(m.target.value=c,M("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=f,e.maxRepeats.value=f,w(),x("Max Partner Repeats updated")},!0)):(n.maxRepeats=f,w())});const r=document.getElementById("strictStrategy");r&&r.addEventListener("change",m=>{const f=m.target.checked,c=n.strictStrategy;n.isLocked?(m.target.checked=!!c,M("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=f,r.checked=f,w(),x("Strict Mode updated")},!0)):(n.strictStrategy=f,w())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",m=>{const f=m.target.value,c=n.pairingStrategy;if(n.isLocked)m.target.value=c,M("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(n.pairingStrategy=f,e.pairingStrategy.value=f,f==="optimal"){n.strictStrategy=!1;const u=document.getElementById("strictStrategy");u&&(u.checked=!1)}w(),P(),x("Pairing Strategy updated")},!0);else{if(n.pairingStrategy=f,f==="optimal"){n.strictStrategy=!1;const u=document.getElementById("strictStrategy");u&&(u.checked=!1)}w(),P()}}),e.addPartnerPairBtn.addEventListener("click",()=>{ln(),V(),P(),te()});const d=document.getElementById("helpFormat");d&&d.addEventListener("click",()=>{ee("Tournament Formats",`
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Americano</div>
            <div style="margin-bottom: 8px;">Individual scoring. You rotate partner every round based on a fixed schedule.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Very social – you play with everyone.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Skill gaps can lead to one-sided matches.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Mexicano</div>
            <div style="margin-bottom: 8px;">Dynamic matchmaking. After each round, similar-ranked players face off.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Competitive, exciting, close matches.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Less mixing – you play with fewer people overall.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Team Formats</div>
            <div style="margin-bottom: 8px;">Fixed partners throughout. Enter as a duo.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Play with your friend, build chemistry.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Need an even number of teams.</div>
            </div>
          </li>
        </ul>
        `)});const i=document.getElementById("helpScoring");i&&i.addEventListener("click",()=>{ee("Scoring Modes",`
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Total Points (e.g. 24)</div>
            <div style="margin-bottom: 8px;">Play all 24 points. Both teams score their actual points (e.g., 15-9).</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Every point matters, fixed duration.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Closing games can feel slow if one team is far ahead.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Race (First to X)</div>
            <div style="margin-bottom: 8px;">First to X wins (e.g., first to 21). Winner gets X, loser keeps their score.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Classic feel, dramatic comebacks possible.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Game length is unpredictable.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Timed (X minutes)</div>
            <div style="margin-bottom: 8px;">Play for a set time. Whoever has more points when time runs out wins.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Perfect scheduling, maximize court time.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Buzzer beaters can feel anticlimactic.</div>
            </div>
          </li>
        </ul>
        `)});const l=document.getElementById("helpMatchup");l&&l.addEventListener("click",()=>{ee("Matchup Rules",`
        <p style="margin-bottom: 20px;">Fine-tune how players are paired in <strong>Mexicano</strong> and <strong>Team Mexicano</strong>.</p>
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Max Partner Repeats</div>
            <div style="margin-bottom: 8px;">Limits consecutive rounds with the same partner. Set to 0 to prevent back-to-back repeats.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> More variety, fairer mixing.</div>
               <div class="text-error"><strong>❌ Cons:</strong> May create slightly less balanced games.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Pairing Strategy</div>
            <div style="margin-bottom: 8px;">How to form teams from the top 4 players each round.</div>
            <ul style="padding-left: 0; margin-top: 8px; list-style: none;">
              <li style="margin-bottom: 8px; padding-left: 12px; border-left: 2px solid var(--border-color);">
                <strong>Optimal (Recommended)</strong>
                <div style="font-size: 0.85em; margin-top: 2px;">Automatically picks the pairing that avoids the most partner repeats.</div>
              </li>
              <li style="margin-bottom: 8px; padding-left: 12px; border-left: 2px solid var(--border-color);">
                <strong>Standard (1&3 vs 2&4)</strong>
                <div style="font-size: 0.85em; margin-top: 2px;">Balanced and predictable. Classic Mexicano pattern.</div>
              </li>
            </ul>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Strict Pattern</div>
            <div style="margin-bottom: 8px; font-size: 0.9em;">What happens when a fixed strategy (e.g., Standard) conflicts with Max Repeats.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr; gap: 8px;">
               <div class="text-success"><strong>🔳 OFF (Smart):</strong> Automatically deviates from the pattern to avoid repeats.</div>
               <div class="text-error"><strong>✅ ON (Strict):</strong> Forces the pattern even if it causes repeating partners.</div>
            </div>
          </li>
        </ul>
        `)});const p=document.getElementById("helpLeaderboard");p&&p.addEventListener("click",()=>{ee("Leaderboard",`
        <p style="margin-bottom: 20px;">Track player standings throughout the tournament. Rankings update after each completed round.</p>
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;"># (Rank)</div>
            <div style="font-size: 0.9em;">Current position based on the selected ranking criteria. Arrows indicate movement since last round.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Pts (Points)</div>
            <div style="font-size: 0.9em;">Total points scored across all matches. This is the default ranking criteria.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">W (Wins)</div>
            <div style="font-size: 0.9em;">Number of matches won.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Diff (Point Difference)</div>
            <div style="font-size: 0.9em;">Points scored minus points conceded. Positive = scoring more than you give up.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">% (Win Rate)</div>
            <div style="font-size: 0.9em;">Percentage of matches won out of total matches played.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Pl (Played)</div>
            <div style="font-size: 0.9em;">Total number of matches played. Players on bye rounds are not counted.</div>
          </li>
        </ul>
        `)}),e.generateBtn.addEventListener("click",Gt),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",Xt),e.gridColumns&&e.gridColumns.addEventListener("input",kt),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),Ue(),w()});const y=document.getElementById("factoryResetBtn");y&&y.addEventListener("click",()=>{M("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const h=document.getElementById("roundScale");h&&h.addEventListener("input",Mt)}function yn(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.id?Number(t.dataset.id):null,a=t.dataset.round?parseInt(t.dataset.round):null;switch(s){case"remove-player":o!==null&&(ct(o),W());break;case"toggle-player-list":We();break;case"remove-pair":o!==null&&(ut(o),V(),P(),te());break;case"toggle-bye":o!==null&&rt(o);break;case"toggle-round":a!==null&&at(a);break;case"complete-round":it();break;case"edit-round":a!==null&&lt(a);break;case"toggle-visibility":Ge();break;case"toggle-position":Xe();break;case"end-tournament":et(Qe);break;case"toggle-toolbar":tt();break;case"export-data":nt();break;case"share-results":ot();break;case"add-late-player":pt();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.pairId?Number(t.dataset.pairId):null,a=t.dataset.which?parseInt(t.dataset.which):null;if(s==="update-partner"&&o!==null&&a!==null&&(mt(o,a,Number(t.value)),V(),P(),te()),s==="autofill-score"&&n.scoringMode==="race"){const r=parseInt(t.dataset.round),d=parseInt(t.dataset.match),i=parseInt(t.dataset.team),l=t.value;Ce(r,d,i,l)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||n.scoringMode==="race")return;const s=parseInt(t.dataset.round),o=parseInt(t.dataset.match),a=parseInt(t.dataset.team),r=t.value;Ce(s,o,a,r)})}function pt(){const e=n.format==="team"||n.format==="teamMexicano";Ke(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,x("Switched to Mexicano format")}an(t.trim());const s=document.getElementById("playerCount");s&&(s.textContent=`(${n.players.length})`),D(),x(`Added ${t.trim()} to tournament`)}})}window.removePlayer=e=>{ct(e),W()};window.togglePlayerList=We;window.updatePreferredPair=(e,t,s)=>{mt(e,t,s),V()};window.removePreferredPair=e=>{ut(e),V()};window.updateCustomCourtName=Lt;window.autoFillScore=Ce;window.toggleManualBye=rt;window.toggleRoundCollapse=at;window.completeRound=it;window.editRound=lt;window.toggleLeaderboardVisibility=Ge;window.togglePositionChanges=Xe;window.updateRankingCriteria=_e;window.updateSetupUI=P;window.endTournament=()=>et(Qe);window.validateCourts=Fe;window.toggleToolbar=tt;window.exportTournamentData=nt;window.shareResults=ot;window.promptAddLatePlayer=pt;cn();
