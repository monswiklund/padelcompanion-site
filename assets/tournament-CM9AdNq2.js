import{i as mt,a as pt}from"./layout-DCA26Yf3.js";const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},Y=[],yt=20;function Pe(){const e=document.getElementById("undoBtn");e&&(e.disabled=Y.length===0)}function se(){const e=JSON.parse(JSON.stringify(n));Y.push(e),Y.length>yt&&Y.shift(),Pe()}function ft(){if(Y.length===0)return!1;const e=Y.pop();return ke(e),Pe(),!0}const Me="tournament-state";function v(){localStorage.setItem(Me,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function gt(){const e=localStorage.getItem(Me);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function ht(){return JSON.parse(JSON.stringify(n))}function ke(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],v())}function te(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function b(e,t,s){let o=3e3,r="default";typeof t=="number"?o=t:typeof t=="string"&&(r=t);const a=document.querySelector(".toast");a&&a.remove();const d=document.createElement("div");d.className=`toast ${r}`,d.textContent=e,document.body.appendChild(d),setTimeout(()=>d.classList.add("visible"),10),setTimeout(()=>{d.classList.remove("visible"),setTimeout(()=>d.remove(),300)},o)}function ae(){return Date.now()+Math.random()}let ne=null;function Te(){return ne={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn")},ne}function S(){return ne||Te(),ne}function ue(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function Re(){var i;const e=S(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const o=parseInt(t.value)||1,r=((i=e.format)==null?void 0:i.value)||n.format,a=r==="team"||r==="teamMexicano"?2:4,d=Math.floor(n.players.length/a);return t.max=Math.max(1,d),o>d&&d>0?(s.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(s.textContent=`⚠️ Need at least ${a} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function Ae(){const e=S();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",Ne()):e.customCourtNamesSection.style.display="none"}function Ne(){const e=S();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,o)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[o]||`Court ${o+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${o}, this.value)"
             placeholder="Court ${o+1}">
    </div>
  `).join("")}function vt(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,v()}function bt(){const e=S(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)});const s=n.players.filter(o=>!t.has(o.id));e.addPartnerPairBtn.disabled=s.length<2}function W(){const e=S(),t=s=>{const o=new Set;return n.preferredPartners.forEach(r=>{r.id!==s&&(o.add(r.player1Id),o.add(r.player2Id))}),o};e.preferredPartnersList.innerHTML=n.preferredPartners.map(s=>{const o=t(s.id),r=n.players.filter(i=>i.id===s.player1Id||i.id===s.player2Id||!o.has(i.id)),a=r.filter(i=>i.id!==s.player2Id||i.id===s.player1Id),d=r.filter(i=>i.id!==s.player1Id||i.id===s.player2Id);return`
        <div class="partner-pair" data-pair-id="${s.id}">
          <select class="form-select" data-action="update-partner" data-pair-id="${s.id}" data-which="1">
            ${a.map(i=>`<option value="${i.id}" ${i.id===s.player1Id?"selected":""}>${i.name}</option>`).join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" data-action="update-partner" data-pair-id="${s.id}" data-which="2">
            ${d.map(i=>`<option value="${i.id}" ${i.id===s.player2Id?"selected":""}>${i.name}</option>`).join("")}
          </select>
          <button class="remove-pair-btn" data-action="remove-pair" data-id="${s.id}">Remove</button>
        </div>
      `}).join("")}function F(){const e=S();e.playerList.innerHTML=n.players.map((t,s)=>`
    <li class="player-item" data-id="${t.id}">
      <span><span class="player-number">${s+1}.</span> ${t.name}</span>
      <button class="player-remove" data-action="remove-player" data-id="${t.id}">×</button>
    </li>
  `).join(""),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4?(e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"):(e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color=""),W(),bt(),xt(),Re()}function wt(){const e=S();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function Ee(){const e=S();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function ze(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function xt(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function St(){const e=S();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function de(){const e=S();e.importModal.style.display="none"}let me=!1;function re(){const e=S(),t=n.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(o=>{o.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function De(){var o;const e=((o=document.getElementById("scoringMode"))==null?void 0:o.value)||n.scoringMode,t=document.getElementById("scoringValueLabel"),s=document.getElementById("points");!t||!s||(e==="total"?(t.textContent="Points",s.value=24):e==="race"?(t.textContent="Target",s.value=21):e==="time"&&(t.textContent="Minutes",s.value=12))}function Ct(){const e=S();e.gridColumns&&(e.gridColumns.max=6)}function Lt(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,o=Math.floor(t/180),r=n.maxCourts||n.courts||2;return Math.min(Math.max(o,1),r)}function He(){const e=S();if(me||n.gridColumns!==0)return;const t=Lt();document.querySelectorAll(".matches-grid").forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function Et(){const e=S(),t=parseInt(e.gridColumns.value);t===0?(me=!1,He()):me=!0,n.gridColumns=t,re(),v()}function Fe(){const e=S(),t=n.textSize,s=t/100,o=document.getElementById("scheduleSection");o&&o.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function Bt(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(n.roundScale=parseInt(e.value)/100,v());const s=n.roundScale||1,o=document.getElementById("roundsContainer");o&&o.style.setProperty("--card-scale",s),e&&(e.value=Math.round(s*100)),t&&(t.textContent=`${Math.round(s*100)}%`)}function qe(){return[...n.leaderboard].sort((e,t)=>{switch(n.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const s=e.played>0?e.wins/e.played:0,o=t.played>0?t.wins/t.played:0;return Math.abs(o-s)>.001?o-s:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const r=e.points+e.pointsLost,a=t.points+t.pointsLost,d=r>0?e.points/r:0,i=a>0?t.points/a:0;return Math.abs(i-d)>.001?i-d:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function N(){const e=S(),t=document.getElementById("toggleVisibilityBtn");t&&(n.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const s=document.getElementById("togglePositionBtn");if(s&&(n.showPositionChanges?(s.innerHTML="Ranks",s.classList.add("toggle-on"),s.classList.remove("toggle-off")):(s.innerHTML="Ranks",s.classList.add("toggle-off"),s.classList.remove("toggle-on")),s.title="Click to toggle rank change indicators"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const o=!n.hideLeaderboard,r=n.showPositionChanges,a=!o&&!r,d=qe();d.forEach((l,u)=>{const g=u+1,m=l.previousRank||g;l.rankChange=m-g});let i=a?[...d].sort(()=>Math.random()-.5):d;e.leaderboardBody.innerHTML=i.map((l,u)=>{const g=d.findIndex(B=>B.id===l.id)+1,m=a?"-":g;let c="";r&&l.played>0&&!a&&(l.rankChange>0?c='<span class="rank-up">▲</span>':l.rankChange<0?c='<span class="rank-down">▼</span>':c='<span class="rank-same">-</span>');const p=l.points-(l.pointsLost||0),y=l.played>0?Math.round((l.wins||0)/l.played*100)+"%":"0%",f=p>0?"+":"",w=o?l.points:"-",P=o?l.wins||0:"-",h=o?`<span class="${p>0?"text-success":p<0?"text-error":""}">${f}${p}</span>`:"-",x=o?y:"-",L=o||r?l.played:"-";return`
    <tr>
      <td>${m} ${c}</td>
      <td class="player-name-cell">${l.name}</td>
      <td class="font-bold">${w}</td>
      <td>${P}</td>
      <td>${h}</td>
      <td>${x}</td>
      <td>${L}</td>
    </tr>
  `}).join("")}function Oe(){n.hideLeaderboard=!n.hideLeaderboard,N()}function We(){n.showPositionChanges=!n.showPositionChanges,N()}function je(e){n.rankingCriteria=e,N()}let C,T,z,D,G=[],pe,Q=!1;const Be=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Ie(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function It(){this.x=Math.random()*z,this.y=Math.random()*D-D,this.r=Ie(10,30),this.d=Math.random()*150+10,this.color=Be[Ie(0,Be.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return T.beginPath(),T.lineWidth=this.r/2,T.strokeStyle=this.color,T.moveTo(this.x+this.tilt+this.r/4,this.y),T.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),T.stroke()}}function Ve(){if(Q){T.clearRect(0,0,z,D);for(let e=0;e<G.length;e++)G[e].draw();$t(),pe=requestAnimationFrame(Ve)}}function $t(){for(let e=0;e<G.length;e++){const t=G[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>z+20||t.x<-20||t.y>D)&&Q&&(t.x=Math.random()*z,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Pt(){if(!Q){C||(C=document.createElement("canvas"),C.id="confetti-canvas",C.style.position="fixed",C.style.top="0",C.style.left="0",C.style.width="100%",C.style.height="100%",C.style.pointerEvents="none",C.style.zIndex="9999",document.body.appendChild(C),T=C.getContext("2d")),z=window.innerWidth,D=window.innerHeight,C.width=z,C.height=D,window.addEventListener("resize",()=>{z=window.innerWidth,D=window.innerHeight,C.width=z,C.height=D}),Q=!0,G=[];for(let e=0;e<150;e++)G.push(new It);Ve()}}function Mt(){Q=!1,T&&T.clearRect(0,0,z,D),pe&&cancelAnimationFrame(pe),C&&C.remove(),C=null}function kt(){Pt(),setTimeout(Mt,5e3)}function $(e,t,s="Confirm",o,r=!1,a=null,d=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const l=document.createElement("div");l.className="modal-overlay confirm-modal",l.style.display="flex";const u=r?"btn btn-danger":"btn btn-primary";l.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        <p>${t}</p>
      </div>
      <div class="modal-footer" style="flex-direction: column; gap: 12px;">
        <div class="modal-actions-row" style="display: flex; gap: 10px; width: 100%;">
          ${a?`<button class="btn btn-outline" id="modalSecondaryBtn" style="flex: 1;">${a}</button>`:""}
          <button class="${u}" id="modalConfirmBtn" style="flex: 1;">${s}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const g=l.querySelector(".modal");g&&g.addEventListener("click",f=>f.stopPropagation());const m=l.querySelector("#modalCancelBtn"),c=l.querySelector("#modalConfirmBtn"),p=l.querySelector("#modalSecondaryBtn"),y=()=>l.remove();m&&m.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),y()}),c&&c.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),y(),o()}),p&&d&&p.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),y(),d()}),l.addEventListener("click",f=>{f.target===l&&y()})}function Ue(e,t,s){const o=document.querySelector(".input-modal");o&&o.remove();const r=document.createElement("div");r.className="modal-overlay input-modal",r.style.display="flex",r.innerHTML=`
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
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("visible"),10);const a=r.querySelector("#modalInput"),d=r.querySelector("#modalCancelBtn"),i=r.querySelector("#modalConfirmBtn"),l=()=>r.remove();d.onclick=l;const u=()=>{const g=a.value;g&&g.trim()&&(l(),s(g.trim()))};i.onclick=u,a.onkeydown=g=>{g.key==="Enter"&&u(),g.key==="Escape"&&l()},setTimeout(()=>a.focus(),100)}function Ye(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=r=>r===0?"🥇":r===1?"🥈":r===2?"🥉":`${r+1}.`,o=document.createElement("div");o.className="final-modal",o.innerHTML=`
    <div class="final-modal-content">
      <h2>Tournament Complete!</h2>
      <div class="final-standings">
        ${e.map((r,a)=>`
          <div class="final-standing-row ${a<3?"top-three":""}">
            <span class="medal">${s(a)}</span>
            <span class="name">${r.name}</span>
            <span class="stats">${r.points} pts · ${r.played} games</span>
          </div>
        `).join("")}
      </div>
      <div class="modal-actions-row" style="margin-top: 20px; gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="window.shareResults()">Share</button>
        <button class="btn btn-secondary" onclick="window.exportTournamentData()">Download CSV</button>
        <button class="btn btn-primary" onclick="window.closeFinalModal()">Close</button>
      </div>
    </div>
  `,document.body.appendChild(o),kt(),setTimeout(()=>o.classList.add("visible"),10)}function Tt(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function Rt(e,t,s){const o=document.querySelector(".alert-modal");o&&o.remove();const r=document.createElement("div");r.className="modal-overlay alert-modal",r.style.display="flex",r.innerHTML=`
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
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("visible"),10);const a=r.querySelector(".modal");a&&a.addEventListener("click",l=>l.stopPropagation());const d=r.querySelector("#modalOkBtn"),i=()=>{r.remove()};d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),i()}),r.addEventListener("click",l=>{l.target===r&&i()}),r.addEventListener("click",l=>{l.target===r&&i()})}function K(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay info-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const r=o.querySelector(".modal");r&&r.addEventListener("click",l=>l.stopPropagation());const a=o.querySelector("#modalOkBtn"),d=o.querySelector("#modalCloseX"),i=()=>o.remove();a&&(a.onclick=i),d&&(d.onclick=i),o.addEventListener("click",l=>{l.target===o&&i()})}function At(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("active")});const s=t.querySelector(".countdown-number"),o=["3","2","1","GO!"];let r=0;const a=()=>{if(r>=o.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const d=o[r];s.textContent=d,s.className="countdown-number"+(d==="GO!"?" countdown-go":""),s.style.animation="none",requestAnimationFrame(()=>{s.style.animation=""}),r++,setTimeout(a,d==="GO!"?600:800)};setTimeout(a,100)})}window.closeFinalModal=Tt;function Nt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,r=[],a=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[a,...d],u=[];for(let f=0;f<o/2;f++){const w=l[f],P=l[o-1-f];!w.isBye&&!P.isBye&&u.push([w,P])}const g=[],m=new Set;for(let f=0;f<u.length-1;f+=2)u[f]&&u[f+1]&&(g.push({court:Math.floor(f/2)+1,team1:u[f],team2:u[f+1]}),u[f].forEach(w=>m.add(w.id)),u[f+1].forEach(w=>m.add(w.id)));const c=g.slice(0,s),p=new Set;c.forEach(f=>{f.team1.forEach(w=>p.add(w.id)),f.team2.forEach(w=>p.add(w.id))});const y=n.players.filter(f=>!f.isBye&&!p.has(f.id));c.length>0&&r.push({number:r.length+1,matches:c,byes:y}),d.unshift(d.pop())}return r}function zt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,r=[],a=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[a,...d],u=[],g=new Set;for(let y=0;y<o/2;y++){const f=l[y],w=l[o-1-y];!f.isBye&&!w.isBye&&(u.push({court:u.length+1,team1:[f],team2:[w]}),g.add(f.id),g.add(w.id))}const m=u.slice(0,s),c=new Set;m.forEach(y=>{y.team1.forEach(f=>c.add(f.id)),y.team2.forEach(f=>c.add(f.id))});const p=n.players.filter(y=>!y.isBye&&!c.has(y.id));m.length>0&&r.push({number:r.length+1,matches:m,byes:p}),d.unshift(d.pop())}return r}function Dt(){const e=[...n.players];te(e);const t=n.courts,s=[],o=new Set;for(let a=0;a<e.length-1&&s.length<t;a+=2)s.push({court:s.length+1,team1:[e[a]],team2:[e[a+1]]}),o.add(e[a].id),o.add(e[a+1].id);const r=e.filter(a=>!o.has(a.id));return[{number:1,matches:s,byes:r}]}function Ht(){const e=[...n.leaderboard].sort((i,l)=>l.points-i.points),t=n.courts,s=e.filter(i=>!n.manualByes.includes(i.id)),o=e.filter(i=>n.manualByes.includes(i.id)),r=[],a=new Set;for(let i=0;i<s.length-1&&r.length<t;i+=2)r.push({court:r.length+1,team1:[s[i]],team2:[s[i+1]]}),a.add(s[i].id),a.add(s[i+1].id);const d=[...o,...s.filter(i=>!a.has(i.id))];return{number:n.schedule.length+1,matches:r,byes:d}}function Ft(){const e=n.courts,t=e*4,s=[],o=new Set,r=[...n.players],a=[];r.forEach(m=>{if(o.has(m.id))return;const c=Ge(m.id);if(c){const p=r.find(y=>y.id===c);p?(s.push({type:"pair",players:[m,p]}),o.add(p.id)):s.push({type:"single",players:[m]})}else s.push({type:"single",players:[m]});o.add(m.id)}),te(s);const d=[];let i=0;for(const m of s)i+m.players.length<=t?(d.push(m),i+=m.players.length):a.push(...m.players);const l=[],u=[];d.forEach(m=>{m.type==="pair"?l.push(m.players):u.push(m.players[0])}),te(u);for(let m=0;m<u.length-1;m+=2)l.push([u[m],u[m+1]]);te(l);const g=[];for(let m=0;m<l.length-1&&g.length<e;m+=2)g.push({court:g.length+1,team1:l[m],team2:l[m+1]});return l.length%2!==0&&g.length<l.length/2&&a.push(...l[l.length-1]),[{number:1,matches:g,byes:a}]}function Ge(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function qt(e){const t=n.courts,s=t*4,o=new Set(n.manualByes),r=[],a=new Set,d=[...e];d.forEach(h=>{if(a.has(h.id)||o.has(h.id))return;const x=Ge(h.id);if(x){const L=d.find(B=>B.id===x);L?o.has(L.id)?r.push({type:"single",players:[h]}):(r.push({type:"pair",players:[h,L]}),a.add(L.id)):r.push({type:"single",players:[h]})}else r.push({type:"single",players:[h]});a.add(h.id)}),r.sort((h,x)=>{const L=M=>{const O=M.players.reduce((I,k)=>I+(k.byeCount||0),0),X=M.players.reduce((I,k)=>I+(k.played||0),0);return{bye:O/M.players.length,play:X/M.players.length}},B=L(h),q=L(x);return Math.abs(q.bye-B.bye)>.1?q.bye-B.bye:B.play-q.play});const i=[],l=[];let u=0;for(const h of r)u+h.players.length<=s&&(l.push(h),i.push(...h.players),u+=h.players.length);const g=new Set(i.map(h=>h.id)),m=d.filter(h=>!g.has(h.id)),c=[],p=[];l.forEach(h=>{h.type==="pair"?c.push(h.players):p.push(h.players[0])}),p.sort((h,x)=>x.points-h.points);let y=0;for(;y<p.length-3;y+=4){const h=p[y],x=p[y+1],L=p[y+2],B=p[y+3],q=[{name:"oneThree",team1:[h,L],team2:[x,B]},{name:"oneTwo",team1:[h,x],team2:[L,B]},{name:"oneFour",team1:[h,B],team2:[x,L]}];let M;if(n.pairingStrategy==="optimal"||!n.strictStrategy){const O=q.map(I=>{let k=0;const lt=I.team1[0].id,dt=I.team1[1].id,ct=I.team2[0].id,ut=I.team2[1].id,ve=(_,J)=>{const ee=e.find(j=>j.id===_);let ie=0;ee!=null&&ee.playedWith&&(ie+=ee.playedWith.filter(j=>j===J).length);const be=n.maxRepeats!==void 0?n.maxRepeats:99;if(be<99&&n.schedule&&n.schedule.length>0){let j=0;for(let le=n.schedule.length-1;le>=0;le--){const we=n.schedule[le];if(!we.completed)continue;if(we.matches.some(H=>{var xe,Se,Ce,Le;return H.team1[0].id===_&&((xe=H.team1[1])==null?void 0:xe.id)===J||H.team1[0].id===J&&((Se=H.team1[1])==null?void 0:Se.id)===_||H.team2[0].id===_&&((Ce=H.team2[1])==null?void 0:Ce.id)===J||H.team2[0].id===J&&((Le=H.team2[1])==null?void 0:Le.id)===_}))j++;else break}j>be&&(ie+=1e3)}return ie};return k+=ve(lt,dt),k+=ve(ct,ut),{...I,score:k}}),X=[...O].sort((I,k)=>I.score-k.score)[0];if(n.pairingStrategy==="optimal")M=X;else{const I=O.find(k=>k.name===n.pairingStrategy)||O[0];!n.strictStrategy&&I.score>=1e3&&X.score<1e3?M=X:M=I}}else M=q.find(O=>O.name===n.pairingStrategy)||q[0];c.push(M.team1),c.push(M.team2)}y<p.length-1&&c.push([p[y],p[y+1]]);const f=c.map(h=>({players:h,points:h.reduce((x,L)=>x+L.points,0)}));f.sort((h,x)=>x.points-h.points);const w=[],P=new Set;for(let h=0;h<f.length-1&&w.length<t;h+=2){const x=f[h],L=f[h+1];w.push({court:w.length+1,team1:x.players,team2:L.players}),x.players.forEach(B=>P.add(B.id)),L.players.forEach(B=>P.add(B.id))}return f.forEach(h=>{h.players.some(x=>P.has(x.id))||h.players.forEach(x=>m.push(x))}),{number:n.schedule.length+1,matches:w,byes:m}}function V(e,t,s,o,r,a=null){const d=n.leaderboard.find(i=>i.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+s,o?d.wins=(d.wins||0)+1:r||(d.losses=(d.losses||0)+1),a&&!d.playedWith&&(d.playedWith=[]),a&&d.playedWith.push(a))}function U(e,t,s,o,r){const a=n.leaderboard.find(d=>d.id===e);a&&(a.points-=t,a.played-=1,a.pointsLost=(a.pointsLost||0)-s,o?a.wins=(a.wins||0)-1:r||(a.losses=(a.losses||0)-1),a.played<0&&(a.played=0),a.points<0&&(a.points=0),a.wins<0&&(a.wins=0),a.losses<0&&(a.losses=0),a.pointsLost<0&&(a.pointsLost=0))}let ye=null;function Ot(e){ye=e}function R(){const e=S(),t=n.format,s=t==="team"||t==="teamMexicano",o=document.getElementById("playersHeader");o&&o.firstChild&&(o.firstChild.textContent=s?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const r=document.querySelector(".setup-card");if(!r)return;r.querySelectorAll("input, select, button").forEach(y=>{n.isLocked&&!y.classList.contains("always-enabled")?(y.disabled=!0,y.classList.add("locked")):(y.disabled=!1,y.classList.remove("locked"))});const d=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",d&&(d.style.display="inline-flex")):(e.generateBtn.style.display="block",d&&(d.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=n.players.length<4);const i=String(t).trim(),g=i.toLowerCase()==="mexicano"||i==="teamMexicano",m=e.advancedSettingsContent;m&&(g?(m.classList.remove("collapsed"),m.classList.add("expanded")):(m.classList.remove("expanded"),m.classList.add("collapsed")));const c=document.getElementById("strictStrategy"),p=c==null?void 0:c.closest(".form-check");if(c){const y=n.pairingStrategy==="optimal";c.disabled=y,p&&(p.style.opacity=y?"0.5":"1",p.style.pointerEvents=y?"none":"auto")}}function Wt(){const e=S();n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const t=n.format==="team"||n.format==="teamMexicano"?2:4,s=Math.floor(n.players.length/t),o=()=>{se(),n.leaderboard=n.players.map(a=>({...a,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=Nt(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=zt(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=Dt(),n.allRounds=null):(n.schedule=Ft(),n.allRounds=null),e.leaderboardSection.style.display="block",N(),ye&&ye(),e.scheduleSection.style.display="block";const r=document.getElementById("tournamentActionsSection");r&&(r.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const a=document.getElementById("round-0");a&&(a.classList.add("animate-in","highlight"),setTimeout(()=>{a.classList.remove("animate-in","highlight")},1600))},100),n.isLocked=!0,R(),v(),b("🎾 Tournament started! Round 1 ready")};if(n.courts>s){if(s===0){Rt("Not Enough Players",`You need at least ${t} players/teams to start!`);return}const r=n.courts;n.courts=s,e.courts&&(e.courts.value=n.courts),b(`Adjusted courts: ${r} → ${s}`)}At().then(()=>{o()})}function jt(){const e=S();$("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{se(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",R(),v(),b("Tournament reset")},!0)}function Xe(e){$("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,R();const t=[...n.leaderboard].sort((s,o)=>o.points-s.points);Gt(),b("Tournament saved to history"),e&&e(t),v()},!0)}function _e(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function Je(e=null){const t=e||n,s=new Date().toLocaleDateString(),o=new Date().toLocaleTimeString();let r="data:text/csv;charset=utf-8,";r+=`Tournament Results
`,r+=`Date,${s} ${o}
`,r+=`Format,${t.format}
`,r+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,r+=`Final Standings
`,r+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((l,u)=>u.points-l.points).forEach((l,u)=>{const g=(l.points||0)-(l.pointsLost||0);r+=`${u+1},"${l.name}",${l.points},${l.wins},${l.played},${l.pointsLost||0},${g}
`}),r+=`
`,r+=`Match History
`,r+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(l=>{l.completed&&l.matches.forEach(u=>{const g=u.team1.map(p=>p.name).join(" & "),m=u.team2.map(p=>p.name).join(" & ");let c=`Court ${u.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[u.court-1]?c=t.customCourtNames[u.court-1]:t.courtFormat==="number"&&(c=`${u.court}`),r+=`Round ${l.number},"${c}","${g}",${u.score1},${u.score2},"${m}"
`})});const d=encodeURI(r),i=document.createElement("a");i.setAttribute("href",d),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function Ke(e=null){var a;const t=e||n;let o=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;o+=`Winner: ${((a=t.leaderboard[0])==null?void 0:a.name)||"Unknown"}
`,o+=`Format: ${t.format}

`,o+=`Top Standings:
`,[...t.leaderboard].sort((d,i)=>i.points-d.points).slice(0,5).forEach((d,i)=>{o+=`${i+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),o+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(o),b("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),b("Failed to copy results","error")}}class Vt{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),o=t%60;return`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const o=this.audioContext.createOscillator(),r=this.audioContext.createGain();o.type="sine",o.frequency.value=t,o.connect(r),r.connect(this.audioContext.destination),o.start(),r.gain.setValueAtTime(.1,this.audioContext.currentTime),r.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),o.stop(this.audioContext.currentTime+s)}catch(o){console.warn("Audio play failed",o)}}}let E=null;function Ut(){const e=S();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",E&&(E.pause(),E=null);return}if(e.matchTimerContainer.style.display="flex",E)E.duration!==n.pointsPerMatch&&E.setDuration(n.pointsPerMatch);else{E=new Vt({duration:n.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed")):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=E.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>E.start(),e.timerPauseBtn.onclick=()=>E.pause(),e.timerResetBtn.onclick=()=>E.reset(),e.timerAddBtn.onclick=()=>E.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>E.addTime(-60));const t=()=>{const s=()=>{Ue("Set Timer Duration","Enter minutes (e.g. 12)",o=>{const r=parseInt(o);r>0?(n.pointsPerMatch=r,v(),E.setDuration(r),b(`Timer set to ${r} minutes`)):b("Invalid minutes","error")})};E.isRunning?$("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{E.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function A(){const e=S();Ut();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((s,o)=>{const r=o===t,a=s.completed,d=a&&!r,i=a?s.matches.map(l=>`${l.score1}-${l.score2}`).join(" · "):"";return`
    <div class="round ${a?"completed":""} ${d?"collapsed":""}" 
         id="round-${o}" 
         data-round="${o}">
      <div class="round-header" data-action="toggle-round" data-round="${o}">
        <span class="round-title">
          Round ${s.number} ${a?"(done)":""}
        </span>
        ${d?`<span class="round-summary">${i}</span>`:""}
        ${a?`<span class="collapse-icon">${d?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${s.matches.map((l,u)=>`
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${ue(l.court)}</span>
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
                ${a?`
                <div class="score-input-row">
                  <span class="score-display">${l.score1} - ${l.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${o}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${o}-${u}-1" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                         value="${l.score1||""}"
                         data-action="autofill-score" data-round="${o}" data-match="${u}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${o}-${u}-2" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                         value="${l.score2||""}"
                         data-action="autofill-score" data-round="${o}" data-match="${u}" data-team="2">
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
        ${!a&&r?`
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
  `}).join(""),Ct(),re(),Fe(),Qe()}Ot(A);function fe(e,t,s,o){setTimeout(Qe,0);let r=parseInt(o);if(isNaN(r)||r<0)return;const a=parseInt(n.pointsPerMatch);if(!(isNaN(a)||a<=0)){if(n.scoringMode==="total"){if(r>a){r=a;const u=document.getElementById(`score-${e}-${t}-${s}`);u&&(u.value=r)}const d=s===1||s==="1"?2:1,i=a-r,l=document.getElementById(`score-${e}-${t}-${d}`);l&&i>=0&&(l.value=i)}else if(n.scoringMode==="race"){if(r<a){const d=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&(i.value=a)}else if(r===a){const d=s===1||s==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${d}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function Qe(){const e=n.schedule.findIndex(a=>!a.completed);if(e===-1)return;const t=n.schedule[e],s=document.querySelector(".complete-round-btn");if(!s)return;let o=!0;const r=parseInt(n.pointsPerMatch);for(let a=0;a<t.matches.length;a++){const d=document.getElementById(`score-${e}-${a}-1`),i=document.getElementById(`score-${e}-${a}-2`);if(!d||!i)continue;const l=d.value,u=i.value;if(l===""||u===""){o=!1;break}const g=parseInt(l),m=parseInt(u);if(n.scoringMode==="total"){if(g+m!==r){o=!1;break}}else if(g<0||m<0){o=!1;break}}s.disabled=!1,o?(s.classList.remove("btn-warning"),s.textContent=`Complete Round ${t.number}`):(s.classList.add("btn-warning"),s.textContent="Complete Anyway")}function Ze(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▼");const r=t.querySelector(".round-summary");r&&(r.style.display="none")}else{t.classList.add("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▶");const r=t.querySelector(".round-summary");r&&(r.style.display="")}}function et(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),A();return}const s=n.courts*4,o=n.leaderboard.length,r=Math.max(0,o-s);if(r===0){b(`All ${o} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=r){b(`Max ${r} can rest. Deselect someone first.`);return}n.manualByes.push(e),A()}function tt(){const e=n.schedule.length-1,t=n.schedule[e];let s=!0;const o=[];if(t.matches.forEach((r,a)=>{const d=document.getElementById(`score-${e}-${a}-1`),i=document.getElementById(`score-${e}-${a}-2`),l=d==null?void 0:d.value,u=i==null?void 0:i.value;let g=!0;(l===""||u==="")&&(g=!1,l===""&&(d==null||d.classList.add("error")),u===""&&(i==null||i.classList.add("error")));const m=parseInt(l)||0,c=parseInt(u)||0;n.scoringMode==="total"?m+c!==n.pointsPerMatch?(g=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&u!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error")):m<0||c<0?(g=!1,d==null||d.classList.add("error"),i==null||i.classList.add("error")):l!==""&&u!==""&&(d==null||d.classList.remove("error"),i==null||i.classList.remove("error")),g||(s=!1,o.push(ue(r.court)))}),!s){const r=o.length>0?` on ${o.join(", ")}`:"";$("Incomplete/Invalid Scores",`Some matches have missing or invalid scores${r}. Do you want to complete the round anyway?`,"Yes, Complete Anyway",()=>{ce(t)},!0);return}if(n.scoringMode==="race"){const r=[],a=n.pointsPerMatch;if(t.matches.forEach((d,i)=>{const l=document.getElementById(`score-${e}-${i}-1`),u=document.getElementById(`score-${e}-${i}-2`),g=parseInt(l==null?void 0:l.value)||0,m=parseInt(u==null?void 0:u.value)||0;g<a&&m<a&&r.push(ue(d.court))}),r.length>0){const d=r.join(", ");$("Low Scores Detected",`On ${d}, neither team reached the target of ${a}. Is this correct?`,"Yes, Complete Round",()=>{ce(t)},!0);return}}ce(t)}function ce(e){const t=n.schedule.findIndex(i=>i===e);if(qe().forEach((i,l)=>{const u=n.leaderboard.find(g=>g.id===i.id);u&&(u.previousRank=l+1)}),e.matches.forEach((i,l)=>{const u=document.getElementById(`score-${t}-${l}-1`),g=document.getElementById(`score-${t}-${l}-2`),m=parseInt(u==null?void 0:u.value)||0,c=parseInt(g==null?void 0:g.value)||0;i.score1=m,i.score2=c;const p=m===c,y=m>c,f=c>m;i.team1[1]?(V(i.team1[0].id,m,c,y,p,i.team1[1].id),V(i.team1[1].id,m,c,y,p,i.team1[0].id),V(i.team2[0].id,c,m,f,p,i.team2[1].id),V(i.team2[1].id,c,m,f,p,i.team2[0].id)):(V(i.team1[0].id,m,c,y,p,null),V(i.team2[0].id,c,m,f,p,null))}),!allScoresValid){n.scoringMode==="total"?b(`Scores must sum to ${n.pointsPerMatch}`):b("Please enter valid positive scores");return}const o=document.querySelector(".complete-round-btn");if(o&&(o.classList.add("completing"),o.textContent="✓ Completing..."),se(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const l=n.leaderboard.find(u=>u.id===i.id);l&&(l.byeCount=(l.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="teamMexicano"){if(n.currentRound<=20){const i=Ht();i.matches.length>0&&n.schedule.push(i)}}else if(n.format==="mexicano"&&n.currentRound<=20){const i=qt(n.leaderboard);i.matches.length>0&&n.schedule.push(i)}N(),A(),v();const r=document.getElementById(`round-${t}`);r&&(r.classList.add("complete-flash"),setTimeout(()=>r.classList.remove("complete-flash"),1e3));const a=e.number,d=n.schedule.length>t+1;b(d?`✓ Round ${a} complete! Round ${a+1} ready`:`✓ Round ${a} complete!`),setTimeout(()=>{const i=n.schedule.length-1,l=document.getElementById(`round-${i}`);l&&(l.classList.add("animate-in","highlight"),l.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{l.classList.remove("animate-in","highlight")},1600))},100)}function nt(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){se();for(let o=e;o<n.schedule.length;o++){const r=n.schedule[o];r.completed&&r.matches.forEach(a=>{a.team1[1]?(U(a.team1[0].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),U(a.team1[1].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),U(a.team2[0].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2),U(a.team2[1].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2)):(U(a.team1[0].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),U(a.team2[0].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,N(),A(),v(),b(`Editing Round ${e+1}`)}}function Yt(){document.querySelectorAll(".form-select").forEach(t=>{if(t.closest(".custom-select-wrapper")||t.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),t.parentNode.insertBefore(s,t),s.appendChild(t);const o=document.createElement("div");o.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),t.classList.contains("btn-sm")&&r.classList.add("btn-sm"),r.innerHTML=`<span>${t.options[t.selectedIndex].text}</span>`;const a=document.createElement("div");a.classList.add("custom-options"),Array.from(t.options).forEach(d=>{const i=document.createElement("div");i.classList.add("custom-option"),i.textContent=d.text,i.dataset.value=d.value,d.selected&&i.classList.add("selected"),i.addEventListener("click",()=>{t.value=i.dataset.value,t.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${i.textContent}</span>`,a.querySelectorAll(".custom-option").forEach(l=>l.classList.remove("selected")),i.classList.add("selected"),o.classList.remove("open"),a.classList.remove("show")}),a.appendChild(i)}),o.appendChild(r),o.appendChild(a),s.appendChild(o),r.addEventListener("click",d=>{d.stopPropagation(),document.querySelectorAll(".custom-select.open").forEach(i=>{i!==o&&(i.classList.remove("open"),i.querySelector(".custom-options").classList.remove("show"))}),o.classList.toggle("open"),a.classList.toggle("show")}),t.style.display="none"}),document.addEventListener("click",t=>{t.target.closest(".custom-select")||document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open"),s.querySelector(".custom-options").classList.remove("show")})})}const he="padel_history_v1";function Gt(){var o;const e=Z(),t=ht(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((o=t.leaderboard[0])==null?void 0:o.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(he,JSON.stringify(e)),s}function Z(){try{const e=localStorage.getItem(he);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function Xt(e){$("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=Z().filter(o=>o.id!==e);localStorage.setItem(he,JSON.stringify(s)),ot(),b("Tournament deleted")},!0)}function _t(e){const s=Z().find(o=>o.id===e);if(!s){b("Tournament details not found","error");return}$("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{ke(s.data),A(),N(),v(),b("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(o){console.error("Failed to load tournament",o),b("Error loading tournament","error")}},!1)}let oe=[];function Jt(){ot();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Kt(s)})}function Kt(e){if(!e){ge(oe);return}const t=oe.filter(s=>{var g,m,c,p,y,f,w,P;const o=(((g=s.summary)==null?void 0:g.winner)||((c=(m=s.players)==null?void 0:m[0])==null?void 0:c.name)||"").toLowerCase(),r=(((p=s.summary)==null?void 0:p.format)||s.format||"").toLowerCase(),a=((y=s.summary)==null?void 0:y.date)||s.date||"",d=String(((f=s.summary)==null?void 0:f.playerCount)||((w=s.players)==null?void 0:w.length)||""),i=String(((P=s.summary)==null?void 0:P.roundCount)||""),u=new Date(a).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return o.includes(e)||r.includes(e)||u.includes(e)||d.includes(e)||i.includes(e)});ge(t)}function ot(){oe=Z(),ge(oe)}function ge(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <a href="#" onclick="document.getElementById('format').scrollIntoView({behavior: 'smooth'}); return false;" class="btn btn-primary">
        Start a Tournament
      </a>
    `,s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=Xt,window.loadTournament=_t,window.downloadHistoryItem=Qt,t.innerHTML=e.map(o=>{var c,p,y;const r=o.summary?o.summary.date:o.date,a=o.summary?o.summary.format:o.format||"Unknown",d=o.summary?o.summary.winner:((p=(c=o.players)==null?void 0:c[0])==null?void 0:p.name)||"Unknown",i=o.summary?o.summary.playerCount:((y=o.players)==null?void 0:y.length)||0,l=new Date(r),u=l.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),g=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),m=!!o.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${u}</span>
            <span class="date-sub">${g}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-sm badge-outline">${a}</span>
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
                ${m?"":"disabled"}
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
      `}).join("")}}function Qt(e){const s=Z().find(o=>o.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}document.addEventListener("DOMContentLoaded",()=>{});function $e(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(b("Maximum 24 players allowed"),!1):n.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(b(`Player "${t}" already exists`),!1):(n.players.push({id:ae(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),v(),!0)}function st(e){n.players=n.players.filter(t=>t.id!==e),v()}function Zt(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}$("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],v(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function en(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(a=>a.trim()).filter(a=>a);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,o=0,r=!1;for(const a of t){if(n.players.length>=24){r=!0;break}if(n.players.some(d=>d.name.toLowerCase()===a.toLowerCase())){o++;continue}n.players.push({id:ae(),name:a,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}return v(),{added:s,duplicates:o,hitLimit:r}}function tn(e){const t={id:ae(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),v(),!0}function nn(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function on(){const e=nn();e.length<2||(n.preferredPartners.push({id:ae(),player1Id:e[0].id,player2Id:e[1].id}),v())}function at(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),v()}function rt(e,t,s){const o=n.preferredPartners.find(r=>r.id===e);o&&(t===1?o.player1Id=s:o.player2Id=s,v())}function sn(e,t){let s;const o=document.getElementById(e),r=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,a=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",d=>{d.preventDefault(),s=d,o&&(o.style.display="inline-flex",o.addEventListener("click",async()=>{o.style.display="none",s.prompt(),(await s.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),s=null}))}),r&&!a&&o&&t&&(o.style.display="inline-flex",o.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{o&&(o.style.display="none"),s=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function an(){mt({activeLink:"tournament"}),sn("installBtn",()=>{K("Install App on iPhone",`
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `)}),pt();const e=Te();gt(),e.format.value=n.format,e.courts.value=n.courts,e.scoringMode.value=n.scoringMode,e.points.value=n.pointsPerMatch,e.courtFormat.value=n.courtFormat,e.maxRepeats.value=n.maxRepeats,e.pairingStrategy&&(e.pairingStrategy.value=n.pairingStrategy);const t=document.getElementById("rankingCriteria");t&&(t.value=n.rankingCriteria);const s=document.getElementById("strictStrategy");if(s&&(s.checked=n.strictStrategy||!1),Ae(),F(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const o=document.getElementById("tournamentActionsSection");o&&(o.style.display="block"),A(),N(),re()}cn(e),Yt(),un(),Jt(),window.addEventListener("resize",He),dn(),R(),De(),rn(),ln()}function rn(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const s=t.getBoundingClientRect(),o=document.createElement("span");o.className="ripple",o.style.width=o.style.height=`${Math.max(s.width,s.height)}px`,o.style.left=`${e.clientX-s.left-o.offsetWidth/2}px`,o.style.top=`${e.clientY-s.top-o.offsetHeight/2}px`,t.appendChild(o),setTimeout(()=>o.remove(),600)})}function ln(){const e=document.querySelectorAll(".section-title, .card-header-basic h3, .card-header-advanced h3, .leaderboard-header h3, .players-header h3");e.forEach(s=>s.classList.add("animate-in"));const t=new IntersectionObserver(s=>{s.forEach(o=>{o.isIntersecting&&o.target.classList.add("animate-in")})},{threshold:.1});e.forEach(s=>t.observe(s))}function dn(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function cn(e){const t=document.getElementById("navToggle"),s=document.getElementById("nav");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("open"),t.classList.toggle("active")}),document.addEventListener("click",c=>{s.classList.contains("open")&&!s.contains(c.target)&&!t.contains(c.target)&&(s.classList.remove("open"),t.classList.remove("active"))}),s.querySelectorAll("a").forEach(c=>{c.addEventListener("click",()=>{s.classList.remove("open"),t.classList.remove("active")})}));const o=document.getElementById("undoBtn");o&&(o.addEventListener("click",()=>{if(ft())if(b("Undo successful"),e.format.value=n.format,F(),A(),N(),R(),re(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="none")}}),document.addEventListener("keydown",c=>{(c.ctrlKey||c.metaKey)&&c.key==="z"&&!c.shiftKey&&(c.preventDefault(),o.click())})),e.addPlayerBtn.addEventListener("click",wt),e.cancelAddBtn.addEventListener("click",Ee),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Zt(()=>{F(),W(),R()})}),e.importPlayersBtn.addEventListener("click",St),e.closeImportModal.addEventListener("click",de),e.cancelImportBtn.addEventListener("click",de),e.confirmImportBtn.addEventListener("click",()=>{const c=e.importTextarea.value,p=en(c);let y=`Added ${p.added} players.`;p.duplicates>0&&(y+=` Skipped ${p.duplicates} duplicates.`),p.hitLimit&&(y+=" Stopped at 24 max limit."),e.importStatus.textContent=y,F(),p.added>0&&p.duplicates===0&&!p.hitLimit&&(setTimeout(de,1500),b(`Imported ${p.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{$e(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),F())}),e.playerNameInput.addEventListener("keydown",c=>{c.key==="Enter"?$e(e.playerNameInput.value)&&(e.playerNameInput.value="",F()):c.key==="Escape"&&Ee()}),e.format.addEventListener("change",()=>{n.format=e.format.value,R(),v()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),v()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),v(),n.schedule.length>0&&A()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,De(),v(),n.schedule.length>0&&A()});const r=document.getElementById("rankingCriteria");r&&r.addEventListener("change",()=>{n.rankingCriteria=r.value,je(),v()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Ae(),v()}),e.courts.addEventListener("input",()=>{const p=e.courts.value;if(p==="")return;let y=parseInt(p)||1;y=Math.max(1,Math.min(50,y)),e.courts.value=y,n.courts=y,v(),n.courtFormat==="custom"&&Ne()}),e.maxRepeats.addEventListener("change",c=>{const p=parseInt(c.target.value),y=n.maxRepeats;n.isLocked?(c.target.value=y,$("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=p,e.maxRepeats.value=p,v(),b("Max Partner Repeats updated")})):(n.maxRepeats=p,v())});const a=document.getElementById("strictStrategy");a&&a.addEventListener("change",c=>{const p=c.target.checked,y=n.strictStrategy;n.isLocked?(c.target.checked=!!y,$("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=p,a.checked=p,v(),b("Strict Mode updated")})):(n.strictStrategy=p,v())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",c=>{const p=c.target.value,y=n.pairingStrategy;if(n.isLocked)c.target.value=y,$("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(n.pairingStrategy=p,e.pairingStrategy.value=p,p==="optimal"){n.strictStrategy=!1;const f=document.getElementById("strictStrategy");f&&(f.checked=!1)}v(),R(),b("Pairing Strategy updated")});else{if(n.pairingStrategy=p,p==="optimal"){n.strictStrategy=!1;const f=document.getElementById("strictStrategy");f&&(f.checked=!1)}v(),R()}}),e.addPartnerPairBtn.addEventListener("click",()=>{on(),W()});const d=document.getElementById("helpFormat");d&&d.addEventListener("click",()=>{K("Tournament Formats",`
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
        `)});const i=document.getElementById("helpScoring");i&&i.addEventListener("click",()=>{K("Scoring Modes",`
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
        `)});const l=document.getElementById("helpMatchup");l&&l.addEventListener("click",()=>{K("Matchup Rules",`
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
        `)});const u=document.getElementById("helpLeaderboard");u&&u.addEventListener("click",()=>{K("Leaderboard",`
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
        `)}),e.generateBtn.addEventListener("click",Wt),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",jt),e.gridColumns&&e.gridColumns.addEventListener("input",Et),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),Fe(),v()});const g=document.getElementById("factoryResetBtn");g&&g.addEventListener("click",()=>{$("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const m=document.getElementById("roundScale");m&&m.addEventListener("input",Bt)}function un(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.id?parseInt(t.dataset.id):null,r=t.dataset.round?parseInt(t.dataset.round):null;switch(s){case"remove-player":o!==null&&(st(o),F());break;case"toggle-player-list":ze();break;case"remove-pair":o!==null&&(at(o),W());break;case"toggle-bye":o!==null&&et(o);break;case"toggle-round":r!==null&&Ze(r);break;case"complete-round":tt();break;case"edit-round":r!==null&&nt(r);break;case"toggle-visibility":Oe();break;case"toggle-position":We();break;case"end-tournament":Xe(Ye);break;case"toggle-toolbar":_e();break;case"export-data":Je();break;case"share-results":Ke();break;case"add-late-player":it();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.pairId?parseInt(t.dataset.pairId):null,r=t.dataset.which?parseInt(t.dataset.which):null;if(s==="update-partner"&&o!==null&&r!==null&&(rt(o,r,parseInt(t.value)),W()),s==="autofill-score"&&n.scoringMode==="race"){const a=parseInt(t.dataset.round),d=parseInt(t.dataset.match),i=parseInt(t.dataset.team),l=t.value;fe(a,d,i,l)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||n.scoringMode==="race")return;const s=parseInt(t.dataset.round),o=parseInt(t.dataset.match),r=parseInt(t.dataset.team),a=t.value;fe(s,o,r,a)})}function it(){const e=n.format==="team"||n.format==="teamMexicano";Ue(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,b("Switched to Mexicano format")}tn(t.trim());const s=document.getElementById("playerCount");s&&(s.textContent=`(${n.players.length})`),N(),b(`Added ${t.trim()} to tournament`)}})}window.removePlayer=e=>{st(e),F()};window.togglePlayerList=ze;window.updatePreferredPair=(e,t,s)=>{rt(e,t,s),W()};window.removePreferredPair=e=>{at(e),W()};window.updateCustomCourtName=vt;window.autoFillScore=fe;window.toggleManualBye=et;window.toggleRoundCollapse=Ze;window.completeRound=tt;window.editRound=nt;window.toggleLeaderboardVisibility=Oe;window.togglePositionChanges=We;window.updateRankingCriteria=je;window.updateSetupUI=R;window.endTournament=()=>Xe(Ye);window.validateCourts=Re;window.toggleToolbar=_e;window.exportTournamentData=Je;window.shareResults=Ke;window.promptAddLatePlayer=it;an();
