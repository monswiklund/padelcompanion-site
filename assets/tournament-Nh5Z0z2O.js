import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},J=[],dt=20;function se(){const e=JSON.parse(JSON.stringify(n));J.push(e),J.length>dt&&J.shift()}function ct(){if(J.length===0)return!1;const e=J.pop();return Ie(e),!0}const Be="tournament-state";function v(){localStorage.setItem(Be,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function ut(){const e=localStorage.getItem(Be);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function mt(){return JSON.parse(JSON.stringify(n))}function Ie(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],v())}function ee(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function b(e,t=3e3){const s=document.querySelector(".toast");s&&s.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10),setTimeout(()=>{o.classList.remove("visible"),setTimeout(()=>o.remove(),300)},t)}function oe(){return Date.now()+Math.random()}let te=null;function $e(){return te={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn")},te}function S(){return te||$e(),te}function pt(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function Pe(){var i;const e=S(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const o=parseInt(t.value)||1,r=((i=e.format)==null?void 0:i.value)||n.format,a=r==="team"||r==="teamMexicano"?2:4,d=Math.floor(n.players.length/a);return t.max=Math.max(1,d),o>d&&d>0?(s.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(s.textContent=`⚠️ Need at least ${a} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function Me(){const e=S();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",ke()):e.customCourtNamesSection.style.display="none"}function ke(){const e=S();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,o)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[o]||`Court ${o+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${o}, this.value)"
             placeholder="Court ${o+1}">
    </div>
  `).join("")}function yt(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,v()}function ft(){const e=S(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)});const s=n.players.filter(o=>!t.has(o.id));e.addPartnerPairBtn.disabled=s.length<2}function W(){const e=S(),t=s=>{const o=new Set;return n.preferredPartners.forEach(r=>{r.id!==s&&(o.add(r.player1Id),o.add(r.player2Id))}),o};e.preferredPartnersList.innerHTML=n.preferredPartners.map(s=>{const o=t(s.id),r=n.players.filter(i=>i.id===s.player1Id||i.id===s.player2Id||!o.has(i.id)),a=r.filter(i=>i.id!==s.player2Id||i.id===s.player1Id),d=r.filter(i=>i.id!==s.player1Id||i.id===s.player2Id);return`
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
      `}).join("")}function H(){const e=S();e.playerList.innerHTML=n.players.map((t,s)=>`
    <li class="player-item" data-id="${t.id}">
      <span><span class="player-number">${s+1}.</span> ${t.name}</span>
      <button class="player-remove" data-action="remove-player" data-id="${t.id}">×</button>
    </li>
  `).join(""),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4?(e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"):(e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color=""),W(),ft(),ht(),Pe()}function gt(){const e=S();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function Se(){const e=S();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function Te(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function ht(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function vt(){const e=S();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function le(){const e=S();e.importModal.style.display="none"}let ce=!1;function ae(){const e=S(),t=n.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(o=>{o.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function Re(){var o;const e=((o=document.getElementById("scoringMode"))==null?void 0:o.value)||n.scoringMode,t=document.getElementById("scoringValueLabel"),s=document.getElementById("points");!t||!s||(e==="total"?(t.textContent="Total Points (Score A + B)",s.value=24):e==="race"?(t.textContent="Winning Score (First to...)",s.value=21):e==="time"&&(t.textContent="Match Duration (Minutes)",s.value=12))}function bt(){const e=S();e.gridColumns&&(e.gridColumns.max=6)}function wt(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,o=Math.floor(t/180),r=n.maxCourts||n.courts||2;return Math.min(Math.max(o,1),r)}function Ae(){const e=S();if(ce||n.gridColumns!==0)return;const t=wt();document.querySelectorAll(".matches-grid").forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function Ct(){const e=S(),t=parseInt(e.gridColumns.value);t===0?(ce=!1,Ae()):ce=!0,n.gridColumns=t,ae(),v()}function Ne(){const e=S(),t=n.textSize,s=t/100,o=document.getElementById("scheduleSection");o&&o.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function St(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(n.roundScale=parseInt(e.value)/100,v());const s=n.roundScale||1,o=document.getElementById("roundsContainer");o&&o.style.setProperty("--card-scale",s),e&&(e.value=Math.round(s*100)),t&&(t.textContent=`${Math.round(s*100)}%`)}function R(){const e=S(),t=document.getElementById("toggleVisibilityBtn");t&&(n.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const s=document.getElementById("togglePositionBtn");if(s&&(n.showPositionChanges?(s.innerHTML="Ranks",s.classList.add("toggle-on"),s.classList.remove("toggle-off")):(s.innerHTML="Ranks",s.classList.add("toggle-off"),s.classList.remove("toggle-on")),s.title="Click to toggle rank change indicators"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const o=[...n.leaderboard].sort((r,a)=>{switch(n.rankingCriteria){case"wins":return a.wins!==r.wins?a.wins-r.wins:a.points!==r.points?a.points-r.points:a.points-a.pointsLost-(r.points-r.pointsLost);case"winRatio":const d=r.played>0?r.wins/r.played:0,i=a.played>0?a.wins/a.played:0;return Math.abs(i-d)>.001?i-d:a.wins!==r.wins?a.wins-r.wins:a.points-r.points;case"pointRatio":const l=r.points+r.pointsLost,u=a.points+a.pointsLost,p=l>0?r.points/l:0,c=u>0?a.points/u:0;return Math.abs(c-p)>.001?c-p:a.points-r.points;case"points":default:return a.points!==r.points?a.points-r.points:a.wins!==r.wins?a.wins-r.wins:a.points-a.pointsLost-(r.points-r.pointsLost)}});if(n.hideLeaderboard){const r=[...o].sort(()=>Math.random()-.5);e.leaderboardBody.innerHTML=r.map(a=>`
    <tr>
      <td>-</td>
      <td>${a.name}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>${a.played}</td>
    </tr>
  `).join("")}else o.forEach((r,a)=>{const d=a+1,i=r.previousRank||d;r.rankChange=i-d,r.previousRank=d}),e.leaderboardBody.innerHTML=o.map((r,a)=>{let d="";n.showPositionChanges&&r.played>0&&(r.rankChange>0?d='<span class="rank-up">▲</span>':r.rankChange<0?d='<span class="rank-down">▼</span>':d='<span class="rank-same">●</span>');const i=r.points-(r.pointsLost||0),l=r.played>0?Math.round((r.wins||0)/r.played*100):0,u=i>0?"+":"";return`
    <tr>
      <td>${a+1} ${d}</td>
      <td class="player-name-cell">${r.name}</td>
      <td class="font-bold">${r.points}</td>
      <td>${r.wins||0}</td>
      <td class="${i>0?"text-success":i<0?"text-error":""}">${u}${i}</td>
      <td>${l}%</td>
      <td>${r.played}</td>
    </tr>
  `}).join("")}function De(){n.hideLeaderboard=!n.hideLeaderboard,R()}function Fe(){n.showPositionChanges=!n.showPositionChanges,R()}function He(e){n.rankingCriteria=e,R()}let x,M,N,D,Y=[],ue,K=!1;const xe=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Le(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function xt(){this.x=Math.random()*N,this.y=Math.random()*D-D,this.r=Le(10,30),this.d=Math.random()*150+10,this.color=xe[Le(0,xe.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return M.beginPath(),M.lineWidth=this.r/2,M.strokeStyle=this.color,M.moveTo(this.x+this.tilt+this.r/4,this.y),M.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),M.stroke()}}function ze(){if(K){M.clearRect(0,0,N,D);for(let e=0;e<Y.length;e++)Y[e].draw();Lt(),ue=requestAnimationFrame(ze)}}function Lt(){for(let e=0;e<Y.length;e++){const t=Y[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>N+20||t.x<-20||t.y>D)&&K&&(t.x=Math.random()*N,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Et(){if(!K){x||(x=document.createElement("canvas"),x.id="confetti-canvas",x.style.position="fixed",x.style.top="0",x.style.left="0",x.style.width="100%",x.style.height="100%",x.style.pointerEvents="none",x.style.zIndex="9999",document.body.appendChild(x),M=x.getContext("2d")),N=window.innerWidth,D=window.innerHeight,x.width=N,x.height=D,window.addEventListener("resize",()=>{N=window.innerWidth,D=window.innerHeight,x.width=N,x.height=D}),K=!0,Y=[];for(let e=0;e<150;e++)Y.push(new xt);ze()}}function Bt(){K=!1,M&&M.clearRect(0,0,N,D),ue&&cancelAnimationFrame(ue),x&&x.remove(),x=null}function It(){Et(),setTimeout(Bt,5e3)}function T(e,t,s="Confirm",o,r=!1,a=null,d=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const l=document.createElement("div");l.className="modal-overlay confirm-modal",l.style.display="flex";const u=r?"btn btn-danger":"btn btn-primary";l.innerHTML=`
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
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const p=l.querySelector(".modal");p&&p.addEventListener("click",f=>f.stopPropagation());const c=l.querySelector("#modalCancelBtn"),m=l.querySelector("#modalConfirmBtn"),y=l.querySelector("#modalSecondaryBtn"),h=()=>l.remove();c&&c.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),h()}),m&&m.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),h(),o()}),y&&d&&y.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),h(),d()}),l.addEventListener("click",f=>{f.target===l&&h()})}function qe(e,t,s){const o=document.querySelector(".input-modal");o&&o.remove();const r=document.createElement("div");r.className="modal-overlay input-modal",r.style.display="flex",r.innerHTML=`
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
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("visible"),10);const a=r.querySelector("#modalInput"),d=r.querySelector("#modalCancelBtn"),i=r.querySelector("#modalConfirmBtn"),l=()=>r.remove();d.onclick=l;const u=()=>{const p=a.value;p&&p.trim()&&(l(),s(p.trim()))};i.onclick=u,a.onkeydown=p=>{p.key==="Enter"&&u(),p.key==="Escape"&&l()},setTimeout(()=>a.focus(),100)}function Oe(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=r=>r===0?"🥇":r===1?"🥈":r===2?"🥉":`${r+1}.`,o=document.createElement("div");o.className="final-modal",o.innerHTML=`
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
  `,document.body.appendChild(o),It(),setTimeout(()=>o.classList.add("visible"),10)}function $t(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function Pt(e,t,s){const o=document.querySelector(".alert-modal");o&&o.remove();const r=document.createElement("div");r.className="modal-overlay alert-modal",r.style.display="flex",r.innerHTML=`
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
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("visible"),10);const a=r.querySelector(".modal");a&&a.addEventListener("click",l=>l.stopPropagation());const d=r.querySelector("#modalOkBtn"),i=()=>{r.remove()};d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),i()}),r.addEventListener("click",l=>{l.target===r&&i()}),r.addEventListener("click",l=>{l.target===r&&i()})}function de(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay info-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const r=o.querySelector(".modal");r&&r.addEventListener("click",l=>l.stopPropagation());const a=o.querySelector("#modalOkBtn"),d=o.querySelector("#modalCloseX"),i=()=>o.remove();a&&(a.onclick=i),d&&(d.onclick=i),o.addEventListener("click",l=>{l.target===o&&i()})}window.closeFinalModal=$t;function Mt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,r=[],a=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[a,...d],u=[];for(let f=0;f<o/2;f++){const w=l[f],A=l[o-1-f];!w.isBye&&!A.isBye&&u.push([w,A])}const p=[],c=new Set;for(let f=0;f<u.length-1;f+=2)u[f]&&u[f+1]&&(p.push({court:Math.floor(f/2)+1,team1:u[f],team2:u[f+1]}),u[f].forEach(w=>c.add(w.id)),u[f+1].forEach(w=>c.add(w.id)));const m=p.slice(0,s),y=new Set;m.forEach(f=>{f.team1.forEach(w=>y.add(w.id)),f.team2.forEach(w=>y.add(w.id))});const h=n.players.filter(f=>!f.isBye&&!y.has(f.id));m.length>0&&r.push({number:r.length+1,matches:m,byes:h}),d.unshift(d.pop())}return r}function kt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,r=[],a=e[0],d=e.slice(1);for(let i=0;i<o-1;i++){const l=[a,...d],u=[],p=new Set;for(let h=0;h<o/2;h++){const f=l[h],w=l[o-1-h];!f.isBye&&!w.isBye&&(u.push({court:u.length+1,team1:[f],team2:[w]}),p.add(f.id),p.add(w.id))}const c=u.slice(0,s),m=new Set;c.forEach(h=>{h.team1.forEach(f=>m.add(f.id)),h.team2.forEach(f=>m.add(f.id))});const y=n.players.filter(h=>!h.isBye&&!m.has(h.id));c.length>0&&r.push({number:r.length+1,matches:c,byes:y}),d.unshift(d.pop())}return r}function Tt(){const e=[...n.players];ee(e);const t=n.courts,s=[],o=new Set;for(let a=0;a<e.length-1&&s.length<t;a+=2)s.push({court:s.length+1,team1:[e[a]],team2:[e[a+1]]}),o.add(e[a].id),o.add(e[a+1].id);const r=e.filter(a=>!o.has(a.id));return[{number:1,matches:s,byes:r}]}function Rt(){const e=[...n.leaderboard].sort((i,l)=>l.points-i.points),t=n.courts,s=e.filter(i=>!n.manualByes.includes(i.id)),o=e.filter(i=>n.manualByes.includes(i.id)),r=[],a=new Set;for(let i=0;i<s.length-1&&r.length<t;i+=2)r.push({court:r.length+1,team1:[s[i]],team2:[s[i+1]]}),a.add(s[i].id),a.add(s[i+1].id);const d=[...o,...s.filter(i=>!a.has(i.id))];return{number:n.schedule.length+1,matches:r,byes:d}}function At(){const e=n.courts,t=e*4,s=[],o=new Set,r=[...n.players],a=[];r.forEach(c=>{if(o.has(c.id))return;const m=We(c.id);if(m){const y=r.find(h=>h.id===m);y?(s.push({type:"pair",players:[c,y]}),o.add(y.id)):s.push({type:"single",players:[c]})}else s.push({type:"single",players:[c]});o.add(c.id)}),ee(s);const d=[];let i=0;for(const c of s)i+c.players.length<=t?(d.push(c),i+=c.players.length):a.push(...c.players);const l=[],u=[];d.forEach(c=>{c.type==="pair"?l.push(c.players):u.push(c.players[0])}),ee(u);for(let c=0;c<u.length-1;c+=2)l.push([u[c],u[c+1]]);ee(l);const p=[];for(let c=0;c<l.length-1&&p.length<e;c+=2)p.push({court:p.length+1,team1:l[c],team2:l[c+1]});return l.length%2!==0&&p.length<l.length/2&&a.push(...l[l.length-1]),[{number:1,matches:p,byes:a}]}function We(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function Nt(e){const t=n.courts,s=t*4,o=new Set(n.manualByes),r=[],a=new Set,d=[...e];d.forEach(g=>{if(a.has(g.id)||o.has(g.id))return;const C=We(g.id);if(C){const L=d.find(I=>I.id===C);L?o.has(L.id)?r.push({type:"single",players:[g]}):(r.push({type:"pair",players:[g,L]}),a.add(L.id)):r.push({type:"single",players:[g]})}else r.push({type:"single",players:[g]});a.add(g.id)}),r.sort((g,C)=>{const L=$=>{const O=$.players.reduce((B,P)=>B+(P.byeCount||0),0),_=$.players.reduce((B,P)=>B+(P.played||0),0);return{bye:O/$.players.length,play:_/$.players.length}},I=L(g),q=L(C);return Math.abs(q.bye-I.bye)>.1?q.bye-I.bye:I.play-q.play});const i=[],l=[];let u=0;for(const g of r)u+g.players.length<=s&&(l.push(g),i.push(...g.players),u+=g.players.length);const p=new Set(i.map(g=>g.id)),c=d.filter(g=>!p.has(g.id)),m=[],y=[];l.forEach(g=>{g.type==="pair"?m.push(g.players):y.push(g.players[0])}),y.sort((g,C)=>C.points-g.points);let h=0;for(;h<y.length-3;h+=4){const g=y[h],C=y[h+1],L=y[h+2],I=y[h+3],q=[{name:"oneThree",team1:[g,L],team2:[C,I]},{name:"oneTwo",team1:[g,C],team2:[L,I]},{name:"oneFour",team1:[g,I],team2:[C,L]}];let $;if(n.pairingStrategy==="optimal"||!n.strictStrategy){const O=q.map(B=>{let P=0;const at=B.team1[0].id,rt=B.team1[1].id,it=B.team2[0].id,lt=B.team2[1].id,fe=(X,G)=>{const Z=e.find(j=>j.id===X);let re=0;Z!=null&&Z.playedWith&&(re+=Z.playedWith.filter(j=>j===G).length);const ge=n.maxRepeats!==void 0?n.maxRepeats:99;if(ge<99&&n.schedule&&n.schedule.length>0){let j=0;for(let ie=n.schedule.length-1;ie>=0;ie--){const he=n.schedule[ie];if(!he.completed)continue;if(he.matches.some(F=>{var ve,be,we,Ce;return F.team1[0].id===X&&((ve=F.team1[1])==null?void 0:ve.id)===G||F.team1[0].id===G&&((be=F.team1[1])==null?void 0:be.id)===X||F.team2[0].id===X&&((we=F.team2[1])==null?void 0:we.id)===G||F.team2[0].id===G&&((Ce=F.team2[1])==null?void 0:Ce.id)===X}))j++;else break}j>ge&&(re+=1e3)}return re};return P+=fe(at,rt),P+=fe(it,lt),{...B,score:P}}),_=[...O].sort((B,P)=>B.score-P.score)[0];if(n.pairingStrategy==="optimal")$=_;else{const B=O.find(P=>P.name===n.pairingStrategy)||O[0];!n.strictStrategy&&B.score>=1e3&&_.score<1e3?$=_:$=B}}else $=q.find(O=>O.name===n.pairingStrategy)||q[0];m.push($.team1),m.push($.team2)}h<y.length-1&&m.push([y[h],y[h+1]]);const f=m.map(g=>({players:g,points:g.reduce((C,L)=>C+L.points,0)}));f.sort((g,C)=>C.points-g.points);const w=[],A=new Set;for(let g=0;g<f.length-1&&w.length<t;g+=2){const C=f[g],L=f[g+1];w.push({court:w.length+1,team1:C.players,team2:L.players}),C.players.forEach(I=>A.add(I.id)),L.players.forEach(I=>A.add(I.id))}return f.forEach(g=>{g.players.some(C=>A.has(C.id))||g.players.forEach(C=>c.push(C))}),{number:n.schedule.length+1,matches:w,byes:c}}function U(e,t,s,o,r,a=null){const d=n.leaderboard.find(i=>i.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+s,o?d.wins=(d.wins||0)+1:r||(d.losses=(d.losses||0)+1),a&&!d.playedWith&&(d.playedWith=[]),a&&d.playedWith.push(a))}function V(e,t,s,o,r){const a=n.leaderboard.find(d=>d.id===e);a&&(a.points-=t,a.played-=1,a.pointsLost=(a.pointsLost||0)-s,o?a.wins=(a.wins||0)-1:r||(a.losses=(a.losses||0)-1),a.played<0&&(a.played=0),a.points<0&&(a.points=0),a.wins<0&&(a.wins=0),a.losses<0&&(a.losses=0),a.pointsLost<0&&(a.pointsLost=0))}let me=null;function Dt(e){me=e}function k(){const e=S(),t=n.format,s=t==="team"||t==="teamMexicano",o=document.getElementById("playersHeader");o&&o.firstChild&&(o.firstChild.textContent=s?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const r=document.querySelector(".setup-card");if(!r)return;r.querySelectorAll("input, select, button").forEach(m=>{n.isLocked&&!m.classList.contains("always-enabled")?(m.disabled=!0,m.classList.add("locked")):(m.disabled=!1,m.classList.remove("locked"))});const d=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",d&&(d.style.display="inline-flex")):(e.generateBtn.style.display="block",d&&(d.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=n.players.length<4);const i=String(t).trim(),p=i.toLowerCase()==="mexicano"||i==="teamMexicano",c=e.advancedSettingsContent;c&&(p?(c.classList.remove("collapsed"),c.classList.add("expanded")):(c.classList.remove("expanded"),c.classList.add("collapsed")))}function Ft(){const e=S();n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const t=n.format==="team"||n.format==="teamMexicano"?2:4,s=Math.floor(n.players.length/t),o=()=>{se(),n.leaderboard=n.players.map(a=>({...a,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=Mt(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=kt(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=Tt(),n.allRounds=null):(n.schedule=At(),n.allRounds=null),e.leaderboardSection.style.display="block",R(),me&&me(),e.scheduleSection.style.display="block";const r=document.getElementById("tournamentActionsSection");r&&(r.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),n.isLocked=!0,k(),v()};if(n.courts>s){if(s===0){Pt("Not Enough Players",`You need at least ${t} players/teams to start!`);return}const r=n.courts;n.courts=s,e.courts&&(e.courts.value=n.courts),b(`Adjusted courts: ${r} → ${s}`)}o()}function Ht(){const e=S();T("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{se(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",k(),v(),b("Tournament reset")},!0)}function je(e){T("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,k();const t=[...n.leaderboard].sort((s,o)=>o.points-s.points);Wt(),b("Tournament saved to history"),e&&e(t),v()},!0)}function Ue(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function Ve(e=null){const t=e||n,s=new Date().toLocaleDateString(),o=new Date().toLocaleTimeString();let r="data:text/csv;charset=utf-8,";r+=`Tournament Results
`,r+=`Date,${s} ${o}
`,r+=`Format,${t.format}
`,r+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,r+=`Final Standings
`,r+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((l,u)=>u.points-l.points).forEach((l,u)=>{const p=(l.points||0)-(l.pointsLost||0);r+=`${u+1},"${l.name}",${l.points},${l.wins},${l.played},${l.pointsLost||0},${p}
`}),r+=`
`,r+=`Match History
`,r+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(l=>{l.completed&&l.matches.forEach(u=>{const p=u.team1.map(y=>y.name).join(" & "),c=u.team2.map(y=>y.name).join(" & ");let m=`Court ${u.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[u.court-1]?m=t.customCourtNames[u.court-1]:t.courtFormat==="number"&&(m=`${u.court}`),r+=`Round ${l.number},"${m}","${p}",${u.score1},${u.score2},"${c}"
`})});const d=encodeURI(r),i=document.createElement("a");i.setAttribute("href",d),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function Ye(e=null){var a;const t=e||n;let o=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;o+=`Winner: ${((a=t.leaderboard[0])==null?void 0:a.name)||"Unknown"}
`,o+=`Format: ${t.format}

`,o+=`Top Standings:
`,[...t.leaderboard].sort((d,i)=>i.points-d.points).slice(0,5).forEach((d,i)=>{o+=`${i+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),o+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(o),b("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),b("Failed to copy results","error")}}class zt{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),o=t%60;return`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const o=this.audioContext.createOscillator(),r=this.audioContext.createGain();o.type="sine",o.frequency.value=t,o.connect(r),r.connect(this.audioContext.destination),o.start(),r.gain.setValueAtTime(.1,this.audioContext.currentTime),r.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),o.stop(this.audioContext.currentTime+s)}catch(o){console.warn("Audio play failed",o)}}}let E=null;function qt(){const e=S();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",E&&(E.pause(),E=null);return}if(e.matchTimerContainer.style.display="flex",E)E.duration!==n.pointsPerMatch&&E.setDuration(n.pointsPerMatch);else{E=new zt({duration:n.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed")):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!")}}),e.timerDisplay.textContent=E.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>E.start(),e.timerPauseBtn.onclick=()=>E.pause(),e.timerResetBtn.onclick=()=>E.reset(),e.timerAddBtn.onclick=()=>E.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>E.addTime(-60));const t=()=>{const s=()=>{qe("Set Timer Duration","Enter minutes (e.g. 12)",o=>{const r=parseInt(o);r>0?(n.pointsPerMatch=r,v(),E.setDuration(r),b(`Timer set to ${r} minutes`)):b("Invalid minutes","error")})};E.isRunning?T("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{E.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function z(){const e=S();qt();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((s,o)=>{const r=o===t,a=s.completed,d=a&&!r,i=a?s.matches.map(l=>`${l.score1}-${l.score2}`).join(" · "):"";return`
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
                <span class="court-label">${pt(l.court)}</span>
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
  `}).join(""),bt(),ae(),Ne()}Dt(z);function _e(e,t,s,o){let r=parseInt(o);if(isNaN(r)||r<0||n.scoringMode!=="total")return;const a=parseInt(n.pointsPerMatch);if(isNaN(a)||a<=0)return;if(r>a){r=a;const u=document.getElementById(`score-${e}-${t}-${s}`);u&&(u.value=r)}const d=s===1||s==="1"?2:1,i=a-r,l=document.getElementById(`score-${e}-${t}-${d}`);if(l&&i>=0){l.value=i;const u=document.getElementById(`score-${e}-${t}-${s}`);u&&u.classList.remove("error"),l.classList.remove("error")}}function Xe(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▼");const r=t.querySelector(".round-summary");r&&(r.style.display="none")}else{t.classList.add("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▶");const r=t.querySelector(".round-summary");r&&(r.style.display="")}}function Ge(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),z();return}const s=n.courts*4,o=n.leaderboard.length,r=Math.max(0,o-s);if(r===0){b(`All ${o} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=r){b(`Max ${r} can rest. Deselect someone first.`);return}n.manualByes.push(e),z()}function Je(){const e=n.schedule.length-1,t=n.schedule[e];let s=!0;if(t.matches.forEach((a,d)=>{const i=document.getElementById(`score-${e}-${d}-1`),l=document.getElementById(`score-${e}-${d}-2`),u=parseInt(i==null?void 0:i.value)||0,p=parseInt(l==null?void 0:l.value)||0;n.scoringMode==="total"?u+p!==n.pointsPerMatch?(s=!1,i==null||i.classList.add("error"),l==null||l.classList.add("error")):(i==null||i.classList.remove("error"),l==null||l.classList.remove("error")):u<0||p<0?(s=!1,i==null||i.classList.add("error"),l==null||l.classList.add("error")):(i==null||i.classList.remove("error"),l==null||l.classList.remove("error")),a.score1=u,a.score2=p;const c=u===p,m=u>p,y=p>u;a.team1[1]?(U(a.team1[0].id,u,p,m,c,a.team1[1].id),U(a.team1[1].id,u,p,m,c,a.team1[0].id),U(a.team2[0].id,p,u,y,c,a.team2[1].id),U(a.team2[1].id,p,u,y,c,a.team2[0].id)):(U(a.team1[0].id,u,p,m,c,null),U(a.team2[0].id,p,u,y,c,null))}),!s){n.scoringMode==="total"?b(`Scores must sum to ${n.pointsPerMatch}`):b("Please enter valid positive scores");return}if(se(),t.completed=!0,t.byes&&t.byes.length>0&&t.byes.forEach(a=>{const d=n.leaderboard.find(i=>i.id===a.id);d&&(d.byeCount=(d.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const a={...n.allRounds[n.currentRound-1]};n.schedule.push(a)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const a={...n.allRounds[n.currentRound-1]};n.schedule.push(a)}else if(n.format==="teamMexicano"){if(n.currentRound<=8){const a=Rt();a.matches.length>0&&n.schedule.push(a)}}else if(n.format==="mexicano"&&n.currentRound<=8){const a=Nt(n.leaderboard);a.matches.length>0&&n.schedule.push(a)}R(),z(),v();const o=t.number,r=n.schedule.length>e+1;b(r?`✓ Round ${o} complete! Round ${o+1} ready`:`✓ Round ${o} complete!`),setTimeout(()=>{const a=n.schedule.length-1,d=document.getElementById(`round-${a}`);d&&d.scrollIntoView({behavior:"smooth",block:"start"})},100)}function Ke(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){se();for(let o=e;o<n.schedule.length;o++){const r=n.schedule[o];r.completed&&r.matches.forEach(a=>{a.team1[1]?(V(a.team1[0].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),V(a.team1[1].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),V(a.team2[0].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2),V(a.team2[1].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2)):(V(a.team1[0].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),V(a.team2[0].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,R(),z(),v(),b(`Editing Round ${e+1}`)}}function Ot(){document.querySelectorAll(".form-select").forEach(t=>{if(t.closest(".custom-select-wrapper")||t.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),t.parentNode.insertBefore(s,t),s.appendChild(t);const o=document.createElement("div");o.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),t.classList.contains("btn-sm")&&r.classList.add("btn-sm"),r.innerHTML=`<span>${t.options[t.selectedIndex].text}</span>`;const a=document.createElement("div");a.classList.add("custom-options"),Array.from(t.options).forEach(d=>{const i=document.createElement("div");i.classList.add("custom-option"),i.textContent=d.text,i.dataset.value=d.value,d.selected&&i.classList.add("selected"),i.addEventListener("click",()=>{t.value=i.dataset.value,t.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${i.textContent}</span>`,a.querySelectorAll(".custom-option").forEach(l=>l.classList.remove("selected")),i.classList.add("selected"),o.classList.remove("open"),a.classList.remove("show")}),a.appendChild(i)}),o.appendChild(r),o.appendChild(a),s.appendChild(o),r.addEventListener("click",d=>{d.stopPropagation(),document.querySelectorAll(".custom-select.open").forEach(i=>{i!==o&&(i.classList.remove("open"),i.querySelector(".custom-options").classList.remove("show"))}),o.classList.toggle("open"),a.classList.toggle("show")}),t.style.display="none"}),document.addEventListener("click",t=>{t.target.closest(".custom-select")||document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open"),s.querySelector(".custom-options").classList.remove("show")})})}const ye="padel_history_v1";function Wt(){var o;const e=Q(),t=mt(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((o=t.leaderboard[0])==null?void 0:o.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(ye,JSON.stringify(e)),s}function Q(){try{const e=localStorage.getItem(ye);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function jt(e){T("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=Q().filter(o=>o.id!==e);localStorage.setItem(ye,JSON.stringify(s)),Qe(),b("Tournament deleted")},!0)}function Ut(e){const s=Q().find(o=>o.id===e);if(!s){b("Tournament details not found","error");return}T("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{Ie(s.data),z(),R(),v(),b("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(o){console.error("Failed to load tournament",o),b("Error loading tournament","error")}},!1)}let ne=[];function Vt(){Qe();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Yt(s)})}function Yt(e){if(!e){pe(ne);return}const t=ne.filter(s=>{var p,c,m,y,h,f,w,A;const o=(((p=s.summary)==null?void 0:p.winner)||((m=(c=s.players)==null?void 0:c[0])==null?void 0:m.name)||"").toLowerCase(),r=(((y=s.summary)==null?void 0:y.format)||s.format||"").toLowerCase(),a=((h=s.summary)==null?void 0:h.date)||s.date||"",d=String(((f=s.summary)==null?void 0:f.playerCount)||((w=s.players)==null?void 0:w.length)||""),i=String(((A=s.summary)==null?void 0:A.roundCount)||""),u=new Date(a).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return o.includes(e)||r.includes(e)||u.includes(e)||d.includes(e)||i.includes(e)});pe(t)}function Qe(){ne=Q(),pe(ne)}function pe(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=jt,window.loadTournament=Ut,window.downloadHistoryItem=_t,t.innerHTML=e.map(o=>{var m,y,h;const r=o.summary?o.summary.date:o.date,a=o.summary?o.summary.format:o.format||"Unknown",d=o.summary?o.summary.winner:((y=(m=o.players)==null?void 0:m[0])==null?void 0:y.name)||"Unknown",i=o.summary?o.summary.playerCount:((h=o.players)==null?void 0:h.length)||0,l=new Date(r),u=l.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),p=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),c=!!o.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${u}</span>
            <span class="date-sub">${p}</span>
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
                ${c?"":"disabled"}
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
      `}).join("")}}function _t(e){const s=Q().find(o=>o.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}document.addEventListener("DOMContentLoaded",()=>{});const Ze="padelcompanion-theme";function Xt(){const e=localStorage.getItem(Ze),t=!e||e==="dark";return document.documentElement.setAttribute("data-theme",t?"dark":"light"),t?"dark":"light"}function Gt(){const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";return document.documentElement.setAttribute("data-theme",t),localStorage.setItem(Ze,t),t}function et(e,t){if(!e)return;const s=e.querySelector(".theme-icon");s&&(s.textContent=t==="dark"?"🌙":"☀️")}function Ee(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(b("Maximum 24 players allowed"),!1):n.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(b(`Player "${t}" already exists`),!1):(n.players.push({id:oe(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),v(),!0)}function tt(e){n.players=n.players.filter(t=>t.id!==e),v()}function Jt(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}T("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],v(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function Kt(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(a=>a.trim()).filter(a=>a);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,o=0,r=!1;for(const a of t){if(n.players.length>=24){r=!0;break}if(n.players.some(d=>d.name.toLowerCase()===a.toLowerCase())){o++;continue}n.players.push({id:oe(),name:a,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}return v(),{added:s,duplicates:o,hitLimit:r}}function Qt(e){const t={id:oe(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),v(),!0}function Zt(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function en(){const e=Zt();e.length<2||(n.preferredPartners.push({id:oe(),player1Id:e[0].id,player2Id:e[1].id}),v())}function nt(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),v()}function st(e,t,s){const o=n.preferredPartners.find(r=>r.id===e);o&&(t===1?o.player1Id=s:o.player2Id=s,v())}function tn(e){let t;const s=document.getElementById(e);window.addEventListener("beforeinstallprompt",o=>{o.preventDefault(),t=o,s&&(s.style.display="inline-flex",s.addEventListener("click",async()=>{s.style.display="none",t.prompt(),(await t.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),t=null}))}),window.addEventListener("appinstalled",()=>{s&&(s.style.display="none"),t=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function nn(){tn("installBtn");const e=Xt(),t=$e();et(t.themeToggle,e),ut(),t.format.value=n.format,t.courts.value=n.courts,t.scoringMode.value=n.scoringMode,t.points.value=n.pointsPerMatch,t.courtFormat.value=n.courtFormat,t.maxRepeats.value=n.maxRepeats,t.pairingStrategy&&(t.pairingStrategy.value=n.pairingStrategy);const s=document.getElementById("rankingCriteria");s&&(s.value=n.rankingCriteria);const o=document.getElementById("strictStrategy");if(o&&(o.checked=n.strictStrategy||!1),Me(),H(),n.schedule.length>0){t.scheduleSection.style.display="block",t.leaderboardSection.style.display="block";const r=document.getElementById("tournamentActionsSection");r&&(r.style.display="block"),z(),R(),ae()}sn(t),Ot(),on(),Vt(),window.addEventListener("resize",Ae),k(),Re()}function sn(e){e.themeToggle.addEventListener("click",()=>{const c=Gt();et(e.themeToggle,c)});const t=document.getElementById("navToggle"),s=document.getElementById("nav");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("open"),t.classList.toggle("active")}),document.addEventListener("click",c=>{s.classList.contains("open")&&!s.contains(c.target)&&!t.contains(c.target)&&(s.classList.remove("open"),t.classList.remove("active"))}),s.querySelectorAll("a").forEach(c=>{c.addEventListener("click",()=>{s.classList.remove("open"),t.classList.remove("active")})}));const o=document.getElementById("undoBtn");o&&(o.addEventListener("click",()=>{if(ct())if(b("Undo successful"),e.format.value=n.format,H(),z(),R(),k(),ae(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="none")}}),document.addEventListener("keydown",c=>{(c.ctrlKey||c.metaKey)&&c.key==="z"&&!c.shiftKey&&(c.preventDefault(),o.click())})),e.addPlayerBtn.addEventListener("click",gt),e.cancelAddBtn.addEventListener("click",Se),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Jt(()=>{H(),W(),k()})}),e.importPlayersBtn.addEventListener("click",vt),e.closeImportModal.addEventListener("click",le),e.cancelImportBtn.addEventListener("click",le),e.confirmImportBtn.addEventListener("click",()=>{const c=e.importTextarea.value,m=Kt(c);let y=`Added ${m.added} players.`;m.duplicates>0&&(y+=` Skipped ${m.duplicates} duplicates.`),m.hitLimit&&(y+=" Stopped at 24 max limit."),e.importStatus.textContent=y,H(),m.added>0&&m.duplicates===0&&!m.hitLimit&&(setTimeout(le,1500),b(`Imported ${m.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{Ee(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),H())}),e.playerNameInput.addEventListener("keydown",c=>{c.key==="Enter"?Ee(e.playerNameInput.value)&&(e.playerNameInput.value="",H()):c.key==="Escape"&&Se()}),e.format.addEventListener("change",()=>{n.format=e.format.value,k(),v()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),v()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),v()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,Re(),v()});const r=document.getElementById("rankingCriteria");r&&r.addEventListener("change",()=>{n.rankingCriteria=r.value,He(),v()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Me(),v()}),e.courts.addEventListener("input",()=>{const m=e.courts.value;if(m==="")return;let y=parseInt(m)||1;y=Math.max(1,Math.min(50,y)),e.courts.value=y,n.courts=y,v(),n.courtFormat==="custom"&&ke()}),e.maxRepeats.addEventListener("change",c=>{const m=parseInt(c.target.value),y=n.maxRepeats;n.isLocked?(c.target.value=y,T("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=m,e.maxRepeats.value=m,v(),b("Max Partner Repeats updated")})):(n.maxRepeats=m,v())});const a=document.getElementById("strictStrategy");a&&a.addEventListener("change",c=>{const m=c.target.checked,y=n.strictStrategy;n.isLocked?(c.target.checked=!!y,T("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=m,a.checked=m,v(),b("Strict Mode updated")})):(n.strictStrategy=m,v())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",c=>{const m=c.target.value,y=n.pairingStrategy;n.isLocked?(c.target.value=y,T("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.pairingStrategy=m,e.pairingStrategy.value=m,v(),k(),b("Pairing Strategy updated")})):(n.pairingStrategy=m,v(),k())}),e.addPartnerPairBtn.addEventListener("click",()=>{en(),W()});const d=document.getElementById("helpFormat");d&&d.addEventListener("click",()=>{de("Tournament Formats",`
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 20px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Americano</div>
            <div style="margin-bottom: 8px;">Individual scoring. You rotate partner every round based on a fixed schedule.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Very social – you play with everyone.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Skill gaps can lead to one-sided matches.</div>
            </div>
          </li>
          <li style="margin-bottom: 20px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Mexicano</div>
            <div style="margin-bottom: 8px;">Dynamic matchmaking. After each round, similar-ranked players face off.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Competitive, exciting, close matches.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Less mixing – you play with fewer people overall.</div>
            </div>
          </li>
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Team Formats</div>
            <div style="margin-bottom: 8px;">Fixed partners throughout. Enter as a duo.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Play with your friend, build chemistry.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Need an even number of teams.</div>
            </div>
          </li>
        </ul>
        `)});const i=document.getElementById("helpScoring");i&&i.addEventListener("click",()=>{de("Scoring Modes",`
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 20px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Total Points (e.g. 24)</div>
            <div style="margin-bottom: 8px;">Play all 24 points. Both teams score their actual points (e.g., 15-9).</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Every point matters, fixed duration.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Closing games can feel slow if one team is far ahead.</div>
            </div>
          </li>
          <li style="margin-bottom: 20px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Race (First to X)</div>
            <div style="margin-bottom: 8px;">First to X wins (e.g., first to 21). Winner gets X, loser keeps their score.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Classic feel, dramatic comebacks possible.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Game length is unpredictable.</div>
            </div>
          </li>
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Timed (X minutes)</div>
            <div style="margin-bottom: 8px;">Play for a set time. Whoever has more points when time runs out wins.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Perfect scheduling, maximize court time.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Buzzer beaters can feel anticlimactic.</div>
            </div>
          </li>
        </ul>
        `)});const l=document.getElementById("helpMatchup");l&&l.addEventListener("click",()=>{de("Matchup Rules",`
        <p style="margin-bottom: 20px;">Fine-tune how players are paired in <strong>Mexicano</strong> and <strong>Team Mexicano</strong>.</p>
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 24px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Max Partner Repeats</div>
            <div style="margin-bottom: 8px;">Limits consecutive rounds with the same partner. Set to 0 to prevent back-to-back repeats.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> More variety, fairer mixing.</div>
               <div class="text-error"><strong>❌ Cons:</strong> May create slightly less balanced games.</div>
            </div>
          </li>
          <li style="margin-bottom: 24px;">
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
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Strict Pattern</div>
            <div style="margin-bottom: 8px; font-size: 0.9em;">What happens when a fixed strategy (e.g., Standard) conflicts with Max Repeats.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr; gap: 8px;">
               <div class="text-success"><strong>🔳 OFF (Smart):</strong> Automatically deviates from the pattern to avoid repeats.</div>
               <div class="text-error"><strong>✅ ON (Strict):</strong> Forces the pattern even if it causes repeating partners.</div>
            </div>
          </li>
        </ul>
        `)}),e.generateBtn.addEventListener("click",Ft),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",Ht),e.gridColumns&&e.gridColumns.addEventListener("input",Ct),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),Ne(),v()});const u=document.getElementById("factoryResetBtn");u&&u.addEventListener("click",()=>{T("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const p=document.getElementById("roundScale");p&&p.addEventListener("input",St)}function on(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.id?parseInt(t.dataset.id):null,r=t.dataset.round?parseInt(t.dataset.round):null;switch(s){case"remove-player":o!==null&&(tt(o),H());break;case"toggle-player-list":Te();break;case"remove-pair":o!==null&&(nt(o),W());break;case"toggle-bye":o!==null&&Ge(o);break;case"toggle-round":r!==null&&Xe(r);break;case"complete-round":Je();break;case"edit-round":r!==null&&Ke(r);break;case"toggle-visibility":De();break;case"toggle-position":Fe();break;case"end-tournament":je(Oe);break;case"toggle-toolbar":Ue();break;case"export-data":Ve();break;case"share-results":Ye();break;case"add-late-player":ot();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.pairId?parseInt(t.dataset.pairId):null,r=t.dataset.which?parseInt(t.dataset.which):null;s==="update-partner"&&o!==null&&r!==null&&(st(o,r,parseInt(t.value)),W())}),document.addEventListener("input",e=>{const t=e.target.closest("[data-action='autofill-score']");if(!t)return;const s=parseInt(t.dataset.round),o=parseInt(t.dataset.match),r=parseInt(t.dataset.team);_e(s,o,r,t.value)})}function ot(){const e=n.format==="team"||n.format==="teamMexicano";qe(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,b("Switched to Mexicano format")}Qt(t.trim());const s=document.getElementById("playerCount");s&&(s.textContent=`(${n.players.length})`),R(),b(`Added ${t.trim()} to tournament`)}})}window.removePlayer=e=>{tt(e),H()};window.togglePlayerList=Te;window.updatePreferredPair=(e,t,s)=>{st(e,t,s),W()};window.removePreferredPair=e=>{nt(e),W()};window.updateCustomCourtName=yt;window.autoFillScore=_e;window.toggleManualBye=Ge;window.toggleRoundCollapse=Xe;window.completeRound=Je;window.editRound=Ke;window.toggleLeaderboardVisibility=De;window.togglePositionChanges=Fe;window.updateRankingCriteria=He;window.updateSetupUI=k;window.endTournament=()=>je(Oe);window.validateCourts=Pe;window.toggleToolbar=Ue;window.exportTournamentData=Ve;window.shareResults=Ye;window.promptAddLatePlayer=ot;nn();
