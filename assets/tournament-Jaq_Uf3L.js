import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},Y=[],ut=20;function Be(){const e=document.getElementById("undoBtn");e&&(e.disabled=Y.length===0)}function se(){const e=JSON.parse(JSON.stringify(n));Y.push(e),Y.length>ut&&Y.shift(),Be()}function mt(){if(Y.length===0)return!1;const e=Y.pop();return Ie(e),Be(),!0}const Pe="tournament-state";function v(){localStorage.setItem(Pe,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function pt(){const e=localStorage.getItem(Pe);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function yt(){return JSON.parse(JSON.stringify(n))}function Ie(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],v())}function te(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function b(e,t=3e3){const s=document.querySelector(".toast");s&&s.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10),setTimeout(()=>{o.classList.remove("visible"),setTimeout(()=>o.remove(),300)},t)}function ae(){return Date.now()+Math.random()}let ne=null;function $e(){return ne={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn")},ne}function S(){return ne||$e(),ne}function ft(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function ke(){var l;const e=S(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const o=parseInt(t.value)||1,a=((l=e.format)==null?void 0:l.value)||n.format,r=a==="team"||a==="teamMexicano"?2:4,d=Math.floor(n.players.length/r);return t.max=Math.max(1,d),o>d&&d>0?(s.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(s.textContent=`⚠️ Need at least ${r} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function Me(){const e=S();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",Te()):e.customCourtNamesSection.style.display="none"}function Te(){const e=S();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,o)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[o]||`Court ${o+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${o}, this.value)"
             placeholder="Court ${o+1}">
    </div>
  `).join("")}function gt(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,v()}function ht(){const e=S(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)});const s=n.players.filter(o=>!t.has(o.id));e.addPartnerPairBtn.disabled=s.length<2}function W(){const e=S(),t=s=>{const o=new Set;return n.preferredPartners.forEach(a=>{a.id!==s&&(o.add(a.player1Id),o.add(a.player2Id))}),o};e.preferredPartnersList.innerHTML=n.preferredPartners.map(s=>{const o=t(s.id),a=n.players.filter(l=>l.id===s.player1Id||l.id===s.player2Id||!o.has(l.id)),r=a.filter(l=>l.id!==s.player2Id||l.id===s.player1Id),d=a.filter(l=>l.id!==s.player1Id||l.id===s.player2Id);return`
        <div class="partner-pair" data-pair-id="${s.id}">
          <select class="form-select" data-action="update-partner" data-pair-id="${s.id}" data-which="1">
            ${r.map(l=>`<option value="${l.id}" ${l.id===s.player1Id?"selected":""}>${l.name}</option>`).join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" data-action="update-partner" data-pair-id="${s.id}" data-which="2">
            ${d.map(l=>`<option value="${l.id}" ${l.id===s.player2Id?"selected":""}>${l.name}</option>`).join("")}
          </select>
          <button class="remove-pair-btn" data-action="remove-pair" data-id="${s.id}">Remove</button>
        </div>
      `}).join("")}function H(){const e=S();e.playerList.innerHTML=n.players.map((t,s)=>`
    <li class="player-item" data-id="${t.id}">
      <span><span class="player-number">${s+1}.</span> ${t.name}</span>
      <button class="player-remove" data-action="remove-player" data-id="${t.id}">×</button>
    </li>
  `).join(""),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4?(e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"):(e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color=""),W(),ht(),bt(),ke()}function vt(){const e=S();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function Se(){const e=S();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function Re(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function bt(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function wt(){const e=S();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function de(){const e=S();e.importModal.style.display="none"}let ce=!1;function re(){const e=S(),t=n.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(o=>{o.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function Ae(){var o;const e=((o=document.getElementById("scoringMode"))==null?void 0:o.value)||n.scoringMode,t=document.getElementById("scoringValueLabel"),s=document.getElementById("points");!t||!s||(e==="total"?(t.textContent="Points",s.value=24):e==="race"?(t.textContent="Target",s.value=21):e==="time"&&(t.textContent="Minutes",s.value=12))}function xt(){const e=S();e.gridColumns&&(e.gridColumns.max=6)}function St(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,o=Math.floor(t/180),a=n.maxCourts||n.courts||2;return Math.min(Math.max(o,1),a)}function Ne(){const e=S();if(ce||n.gridColumns!==0)return;const t=St();document.querySelectorAll(".matches-grid").forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function Ct(){const e=S(),t=parseInt(e.gridColumns.value);t===0?(ce=!1,Ne()):ce=!0,n.gridColumns=t,re(),v()}function ze(){const e=S(),t=n.textSize,s=t/100,o=document.getElementById("scheduleSection");o&&o.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function Lt(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(n.roundScale=parseInt(e.value)/100,v());const s=n.roundScale||1,o=document.getElementById("roundsContainer");o&&o.style.setProperty("--card-scale",s),e&&(e.value=Math.round(s*100)),t&&(t.textContent=`${Math.round(s*100)}%`)}function De(){return[...n.leaderboard].sort((e,t)=>{switch(n.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const s=e.played>0?e.wins/e.played:0,o=t.played>0?t.wins/t.played:0;return Math.abs(o-s)>.001?o-s:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const a=e.points+e.pointsLost,r=t.points+t.pointsLost,d=a>0?e.points/a:0,l=r>0?t.points/r:0;return Math.abs(l-d)>.001?l-d:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function N(){const e=S(),t=document.getElementById("toggleVisibilityBtn");t&&(n.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const s=document.getElementById("togglePositionBtn");if(s&&(n.showPositionChanges?(s.innerHTML="Ranks",s.classList.add("toggle-on"),s.classList.remove("toggle-off")):(s.innerHTML="Ranks",s.classList.add("toggle-off"),s.classList.remove("toggle-on")),s.title="Click to toggle rank change indicators"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const o=!n.hideLeaderboard,a=n.showPositionChanges,r=!o&&!a,d=De();d.forEach((i,p)=>{const f=p+1,m=i.previousRank||f;i.rankChange=m-f});let l=r?[...d].sort(()=>Math.random()-.5):d;e.leaderboardBody.innerHTML=l.map((i,p)=>{const f=d.findIndex(B=>B.id===i.id)+1,m=r?"-":f;let c="";a&&i.played>0&&!r&&(i.rankChange>0?c='<span class="rank-up">▲</span>':i.rankChange<0?c='<span class="rank-down">▼</span>':c='<span class="rank-same">-</span>');const u=i.points-(i.pointsLost||0),y=i.played>0?Math.round((i.wins||0)/i.played*100)+"%":"0%",g=u>0?"+":"",w=o?i.points:"-",I=o?i.wins||0:"-",h=o?`<span class="${u>0?"text-success":u<0?"text-error":""}">${g}${u}</span>`:"-",x=o?y:"-",L=o||a?i.played:"-";return`
    <tr>
      <td>${m} ${c}</td>
      <td class="player-name-cell">${i.name}</td>
      <td class="font-bold">${w}</td>
      <td>${I}</td>
      <td>${h}</td>
      <td>${x}</td>
      <td>${L}</td>
    </tr>
  `}).join("")}function Fe(){n.hideLeaderboard=!n.hideLeaderboard,N()}function He(){n.showPositionChanges=!n.showPositionChanges,N()}function qe(e){n.rankingCriteria=e,N()}let C,M,z,D,_=[],ue,Q=!1;const Ce=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Le(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function Et(){this.x=Math.random()*z,this.y=Math.random()*D-D,this.r=Le(10,30),this.d=Math.random()*150+10,this.color=Ce[Le(0,Ce.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return M.beginPath(),M.lineWidth=this.r/2,M.strokeStyle=this.color,M.moveTo(this.x+this.tilt+this.r/4,this.y),M.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),M.stroke()}}function Oe(){if(Q){M.clearRect(0,0,z,D);for(let e=0;e<_.length;e++)_[e].draw();Bt(),ue=requestAnimationFrame(Oe)}}function Bt(){for(let e=0;e<_.length;e++){const t=_[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>z+20||t.x<-20||t.y>D)&&Q&&(t.x=Math.random()*z,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Pt(){if(!Q){C||(C=document.createElement("canvas"),C.id="confetti-canvas",C.style.position="fixed",C.style.top="0",C.style.left="0",C.style.width="100%",C.style.height="100%",C.style.pointerEvents="none",C.style.zIndex="9999",document.body.appendChild(C),M=C.getContext("2d")),z=window.innerWidth,D=window.innerHeight,C.width=z,C.height=D,window.addEventListener("resize",()=>{z=window.innerWidth,D=window.innerHeight,C.width=z,C.height=D}),Q=!0,_=[];for(let e=0;e<150;e++)_.push(new Et);Oe()}}function It(){Q=!1,M&&M.clearRect(0,0,z,D),ue&&cancelAnimationFrame(ue),C&&C.remove(),C=null}function $t(){Pt(),setTimeout(It,5e3)}function R(e,t,s="Confirm",o,a=!1,r=null,d=null){const l=document.querySelector(".confirm-modal");l&&l.remove();const i=document.createElement("div");i.className="modal-overlay confirm-modal",i.style.display="flex";const p=a?"btn btn-danger":"btn btn-primary";i.innerHTML=`
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
  `,document.body.appendChild(i),setTimeout(()=>i.classList.add("visible"),10);const f=i.querySelector(".modal");f&&f.addEventListener("click",g=>g.stopPropagation());const m=i.querySelector("#modalCancelBtn"),c=i.querySelector("#modalConfirmBtn"),u=i.querySelector("#modalSecondaryBtn"),y=()=>i.remove();m&&m.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),y()}),c&&c.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),y(),o()}),u&&d&&u.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),y(),d()}),i.addEventListener("click",g=>{g.target===i&&y()})}function We(e,t,s){const o=document.querySelector(".input-modal");o&&o.remove();const a=document.createElement("div");a.className="modal-overlay input-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector("#modalInput"),d=a.querySelector("#modalCancelBtn"),l=a.querySelector("#modalConfirmBtn"),i=()=>a.remove();d.onclick=i;const p=()=>{const f=r.value;f&&f.trim()&&(i(),s(f.trim()))};l.onclick=p,r.onkeydown=f=>{f.key==="Enter"&&p(),f.key==="Escape"&&i()},setTimeout(()=>r.focus(),100)}function je(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=a=>a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,o=document.createElement("div");o.className="final-modal",o.innerHTML=`
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
  `,document.body.appendChild(o),$t(),setTimeout(()=>o.classList.add("visible"),10)}function kt(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function Mt(e,t,s){const o=document.querySelector(".alert-modal");o&&o.remove();const a=document.createElement("div");a.className="modal-overlay alert-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector(".modal");r&&r.addEventListener("click",i=>i.stopPropagation());const d=a.querySelector("#modalOkBtn"),l=()=>{a.remove()};d&&d.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),l()}),a.addEventListener("click",i=>{i.target===a&&l()}),a.addEventListener("click",i=>{i.target===a&&l()})}function K(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay info-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const a=o.querySelector(".modal");a&&a.addEventListener("click",i=>i.stopPropagation());const r=o.querySelector("#modalOkBtn"),d=o.querySelector("#modalCloseX"),l=()=>o.remove();r&&(r.onclick=l),d&&(d.onclick=l),o.addEventListener("click",i=>{i.target===o&&l()})}window.closeFinalModal=kt;function Tt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],r=e[0],d=e.slice(1);for(let l=0;l<o-1;l++){const i=[r,...d],p=[];for(let g=0;g<o/2;g++){const w=i[g],I=i[o-1-g];!w.isBye&&!I.isBye&&p.push([w,I])}const f=[],m=new Set;for(let g=0;g<p.length-1;g+=2)p[g]&&p[g+1]&&(f.push({court:Math.floor(g/2)+1,team1:p[g],team2:p[g+1]}),p[g].forEach(w=>m.add(w.id)),p[g+1].forEach(w=>m.add(w.id)));const c=f.slice(0,s),u=new Set;c.forEach(g=>{g.team1.forEach(w=>u.add(w.id)),g.team2.forEach(w=>u.add(w.id))});const y=n.players.filter(g=>!g.isBye&&!u.has(g.id));c.length>0&&a.push({number:a.length+1,matches:c,byes:y}),d.unshift(d.pop())}return a}function Rt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],r=e[0],d=e.slice(1);for(let l=0;l<o-1;l++){const i=[r,...d],p=[],f=new Set;for(let y=0;y<o/2;y++){const g=i[y],w=i[o-1-y];!g.isBye&&!w.isBye&&(p.push({court:p.length+1,team1:[g],team2:[w]}),f.add(g.id),f.add(w.id))}const m=p.slice(0,s),c=new Set;m.forEach(y=>{y.team1.forEach(g=>c.add(g.id)),y.team2.forEach(g=>c.add(g.id))});const u=n.players.filter(y=>!y.isBye&&!c.has(y.id));m.length>0&&a.push({number:a.length+1,matches:m,byes:u}),d.unshift(d.pop())}return a}function At(){const e=[...n.players];te(e);const t=n.courts,s=[],o=new Set;for(let r=0;r<e.length-1&&s.length<t;r+=2)s.push({court:s.length+1,team1:[e[r]],team2:[e[r+1]]}),o.add(e[r].id),o.add(e[r+1].id);const a=e.filter(r=>!o.has(r.id));return[{number:1,matches:s,byes:a}]}function Nt(){const e=[...n.leaderboard].sort((l,i)=>i.points-l.points),t=n.courts,s=e.filter(l=>!n.manualByes.includes(l.id)),o=e.filter(l=>n.manualByes.includes(l.id)),a=[],r=new Set;for(let l=0;l<s.length-1&&a.length<t;l+=2)a.push({court:a.length+1,team1:[s[l]],team2:[s[l+1]]}),r.add(s[l].id),r.add(s[l+1].id);const d=[...o,...s.filter(l=>!r.has(l.id))];return{number:n.schedule.length+1,matches:a,byes:d}}function zt(){const e=n.courts,t=e*4,s=[],o=new Set,a=[...n.players],r=[];a.forEach(m=>{if(o.has(m.id))return;const c=Ue(m.id);if(c){const u=a.find(y=>y.id===c);u?(s.push({type:"pair",players:[m,u]}),o.add(u.id)):s.push({type:"single",players:[m]})}else s.push({type:"single",players:[m]});o.add(m.id)}),te(s);const d=[];let l=0;for(const m of s)l+m.players.length<=t?(d.push(m),l+=m.players.length):r.push(...m.players);const i=[],p=[];d.forEach(m=>{m.type==="pair"?i.push(m.players):p.push(m.players[0])}),te(p);for(let m=0;m<p.length-1;m+=2)i.push([p[m],p[m+1]]);te(i);const f=[];for(let m=0;m<i.length-1&&f.length<e;m+=2)f.push({court:f.length+1,team1:i[m],team2:i[m+1]});return i.length%2!==0&&f.length<i.length/2&&r.push(...i[i.length-1]),[{number:1,matches:f,byes:r}]}function Ue(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function Dt(e){const t=n.courts,s=t*4,o=new Set(n.manualByes),a=[],r=new Set,d=[...e];d.forEach(h=>{if(r.has(h.id)||o.has(h.id))return;const x=Ue(h.id);if(x){const L=d.find(B=>B.id===x);L?o.has(L.id)?a.push({type:"single",players:[h]}):(a.push({type:"pair",players:[h,L]}),r.add(L.id)):a.push({type:"single",players:[h]})}else a.push({type:"single",players:[h]});r.add(h.id)}),a.sort((h,x)=>{const L=$=>{const O=$.players.reduce((P,k)=>P+(k.byeCount||0),0),X=$.players.reduce((P,k)=>P+(k.played||0),0);return{bye:O/$.players.length,play:X/$.players.length}},B=L(h),q=L(x);return Math.abs(q.bye-B.bye)>.1?q.bye-B.bye:B.play-q.play});const l=[],i=[];let p=0;for(const h of a)p+h.players.length<=s&&(i.push(h),l.push(...h.players),p+=h.players.length);const f=new Set(l.map(h=>h.id)),m=d.filter(h=>!f.has(h.id)),c=[],u=[];i.forEach(h=>{h.type==="pair"?c.push(h.players):u.push(h.players[0])}),u.sort((h,x)=>x.points-h.points);let y=0;for(;y<u.length-3;y+=4){const h=u[y],x=u[y+1],L=u[y+2],B=u[y+3],q=[{name:"oneThree",team1:[h,L],team2:[x,B]},{name:"oneTwo",team1:[h,x],team2:[L,B]},{name:"oneFour",team1:[h,B],team2:[x,L]}];let $;if(n.pairingStrategy==="optimal"||!n.strictStrategy){const O=q.map(P=>{let k=0;const it=P.team1[0].id,lt=P.team1[1].id,dt=P.team2[0].id,ct=P.team2[1].id,fe=(G,J)=>{const ee=e.find(j=>j.id===G);let ie=0;ee!=null&&ee.playedWith&&(ie+=ee.playedWith.filter(j=>j===J).length);const ge=n.maxRepeats!==void 0?n.maxRepeats:99;if(ge<99&&n.schedule&&n.schedule.length>0){let j=0;for(let le=n.schedule.length-1;le>=0;le--){const he=n.schedule[le];if(!he.completed)continue;if(he.matches.some(F=>{var ve,be,we,xe;return F.team1[0].id===G&&((ve=F.team1[1])==null?void 0:ve.id)===J||F.team1[0].id===J&&((be=F.team1[1])==null?void 0:be.id)===G||F.team2[0].id===G&&((we=F.team2[1])==null?void 0:we.id)===J||F.team2[0].id===J&&((xe=F.team2[1])==null?void 0:xe.id)===G}))j++;else break}j>ge&&(ie+=1e3)}return ie};return k+=fe(it,lt),k+=fe(dt,ct),{...P,score:k}}),X=[...O].sort((P,k)=>P.score-k.score)[0];if(n.pairingStrategy==="optimal")$=X;else{const P=O.find(k=>k.name===n.pairingStrategy)||O[0];!n.strictStrategy&&P.score>=1e3&&X.score<1e3?$=X:$=P}}else $=q.find(O=>O.name===n.pairingStrategy)||q[0];c.push($.team1),c.push($.team2)}y<u.length-1&&c.push([u[y],u[y+1]]);const g=c.map(h=>({players:h,points:h.reduce((x,L)=>x+L.points,0)}));g.sort((h,x)=>x.points-h.points);const w=[],I=new Set;for(let h=0;h<g.length-1&&w.length<t;h+=2){const x=g[h],L=g[h+1];w.push({court:w.length+1,team1:x.players,team2:L.players}),x.players.forEach(B=>I.add(B.id)),L.players.forEach(B=>I.add(B.id))}return g.forEach(h=>{h.players.some(x=>I.has(x.id))||h.players.forEach(x=>m.push(x))}),{number:n.schedule.length+1,matches:w,byes:m}}function U(e,t,s,o,a,r=null){const d=n.leaderboard.find(l=>l.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+s,o?d.wins=(d.wins||0)+1:a||(d.losses=(d.losses||0)+1),r&&!d.playedWith&&(d.playedWith=[]),r&&d.playedWith.push(r))}function V(e,t,s,o,a){const r=n.leaderboard.find(d=>d.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-s,o?r.wins=(r.wins||0)-1:a||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let me=null;function Ft(e){me=e}function T(){const e=S(),t=n.format,s=t==="team"||t==="teamMexicano",o=document.getElementById("playersHeader");o&&o.firstChild&&(o.firstChild.textContent=s?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const a=document.querySelector(".setup-card");if(!a)return;a.querySelectorAll("input, select, button").forEach(y=>{n.isLocked&&!y.classList.contains("always-enabled")?(y.disabled=!0,y.classList.add("locked")):(y.disabled=!1,y.classList.remove("locked"))});const d=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",d&&(d.style.display="inline-flex")):(e.generateBtn.style.display="block",d&&(d.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=n.players.length<4);const l=String(t).trim(),f=l.toLowerCase()==="mexicano"||l==="teamMexicano",m=e.advancedSettingsContent;m&&(f?(m.classList.remove("collapsed"),m.classList.add("expanded")):(m.classList.remove("expanded"),m.classList.add("collapsed")));const c=document.getElementById("strictStrategy"),u=c==null?void 0:c.closest(".form-check");if(c){const y=n.pairingStrategy==="optimal";c.disabled=y,u&&(u.style.opacity=y?"0.5":"1",u.style.pointerEvents=y?"none":"auto")}}function Ht(){const e=S();n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const t=n.format==="team"||n.format==="teamMexicano"?2:4,s=Math.floor(n.players.length/t),o=()=>{se(),n.leaderboard=n.players.map(r=>({...r,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=Tt(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=Rt(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=At(),n.allRounds=null):(n.schedule=zt(),n.allRounds=null),e.leaderboardSection.style.display="block",N(),me&&me(),e.scheduleSection.style.display="block";const a=document.getElementById("tournamentActionsSection");a&&(a.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const r=document.getElementById("round-0");r&&(r.classList.add("animate-in","highlight"),setTimeout(()=>{r.classList.remove("animate-in","highlight")},1600))},100),n.isLocked=!0,T(),v(),b("🎾 Tournament started! Round 1 ready")};if(n.courts>s){if(s===0){Mt("Not Enough Players",`You need at least ${t} players/teams to start!`);return}const a=n.courts;n.courts=s,e.courts&&(e.courts.value=n.courts),b(`Adjusted courts: ${a} → ${s}`)}o()}function qt(){const e=S();R("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{se(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",T(),v(),b("Tournament reset")},!0)}function Ve(e){R("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,T();const t=[...n.leaderboard].sort((s,o)=>o.points-s.points);Ut(),b("Tournament saved to history"),e&&e(t),v()},!0)}function Ye(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function _e(e=null){const t=e||n,s=new Date().toLocaleDateString(),o=new Date().toLocaleTimeString();let a="data:text/csv;charset=utf-8,";a+=`Tournament Results
`,a+=`Date,${s} ${o}
`,a+=`Format,${t.format}
`,a+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,a+=`Final Standings
`,a+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((i,p)=>p.points-i.points).forEach((i,p)=>{const f=(i.points||0)-(i.pointsLost||0);a+=`${p+1},"${i.name}",${i.points},${i.wins},${i.played},${i.pointsLost||0},${f}
`}),a+=`
`,a+=`Match History
`,a+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(i=>{i.completed&&i.matches.forEach(p=>{const f=p.team1.map(u=>u.name).join(" & "),m=p.team2.map(u=>u.name).join(" & ");let c=`Court ${p.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[p.court-1]?c=t.customCourtNames[p.court-1]:t.courtFormat==="number"&&(c=`${p.court}`),a+=`Round ${i.number},"${c}","${f}",${p.score1},${p.score2},"${m}"
`})});const d=encodeURI(a),l=document.createElement("a");l.setAttribute("href",d),l.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(l),l.click(),document.body.removeChild(l)}async function Xe(e=null){var r;const t=e||n;let o=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;o+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,o+=`Format: ${t.format}

`,o+=`Top Standings:
`,[...t.leaderboard].sort((d,l)=>l.points-d.points).slice(0,5).forEach((d,l)=>{o+=`${l+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),o+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(o),b("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),b("Failed to copy results","error")}}class Ot{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),o=t%60;return`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const o=this.audioContext.createOscillator(),a=this.audioContext.createGain();o.type="sine",o.frequency.value=t,o.connect(a),a.connect(this.audioContext.destination),o.start(),a.gain.setValueAtTime(.1,this.audioContext.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),o.stop(this.audioContext.currentTime+s)}catch(o){console.warn("Audio play failed",o)}}}let E=null;function Wt(){const e=S();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",E&&(E.pause(),E=null);return}if(e.matchTimerContainer.style.display="flex",E)E.duration!==n.pointsPerMatch&&E.setDuration(n.pointsPerMatch);else{E=new Ot({duration:n.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed")):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!")}}),e.timerDisplay.textContent=E.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>E.start(),e.timerPauseBtn.onclick=()=>E.pause(),e.timerResetBtn.onclick=()=>E.reset(),e.timerAddBtn.onclick=()=>E.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>E.addTime(-60));const t=()=>{const s=()=>{We("Set Timer Duration","Enter minutes (e.g. 12)",o=>{const a=parseInt(o);a>0?(n.pointsPerMatch=a,v(),E.setDuration(a),b(`Timer set to ${a} minutes`)):b("Invalid minutes","error")})};E.isRunning?R("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{E.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function A(){const e=S();Wt();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((s,o)=>{const a=o===t,r=s.completed,d=r&&!a,l=r?s.matches.map(i=>`${i.score1}-${i.score2}`).join(" · "):"";return`
    <div class="round ${r?"completed":""} ${d?"collapsed":""}" 
         id="round-${o}" 
         data-round="${o}">
      <div class="round-header" data-action="toggle-round" data-round="${o}">
        <span class="round-title">
          Round ${s.number} ${r?"(done)":""}
        </span>
        ${d?`<span class="round-summary">${l}</span>`:""}
        ${r?`<span class="collapse-icon">${d?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${s.matches.map((i,p)=>`
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${ft(i.court)}</span>
                <span class="match-info-sub">
                  ${n.scoringMode==="total"?`Total ${n.pointsPerMatch}`:n.scoringMode==="race"?`Race to ${n.pointsPerMatch}`:`${n.pointsPerMatch} mins`}
                </span>
              </div>
              <div class="match-card">
                <div class="match-teams">
                  <div class="team">
                    <span>${i.team1[0].name}</span>
                    ${i.team1[1]?`<span>${i.team1[1].name}</span>`:""}
                  </div>
                  <div class="team">
                    <span>${i.team2[0].name}</span>
                    ${i.team2[1]?`<span>${i.team2[1].name}</span>`:""}
                  </div>
                </div>
              </div>
              <div class="match-card-footer">
                ${r?`
                <div class="score-input-row">
                  <span class="score-display">${i.score1} - ${i.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${o}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${o}-${p}-1" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                         value="${i.score1||""}"
                         data-action="autofill-score" data-round="${o}" data-match="${p}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${o}-${p}-2" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                         value="${i.score2||""}"
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
          <span class="waiting-names">${s.byes.map(i=>i.name).join(", ")}</span>
        </div>
        `:""}
        ${!r&&a?`
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${n.manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${n.leaderboard.map(i=>`
              <button class="bye-chip ${n.manualByes.includes(i.id)?"selected":""}" 
                      data-action="toggle-bye" data-id="${i.id}">
                ${i.name}
                <span class="bye-count">(${i.byeCount||0})</span>
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
  `}).join(""),xt(),re(),ze()}Ft(A);function Ge(e,t,s,o){let a=parseInt(o);if(isNaN(a)||a<0||n.scoringMode!=="total")return;const r=parseInt(n.pointsPerMatch);if(isNaN(r)||r<=0)return;if(a>r){a=r;const p=document.getElementById(`score-${e}-${t}-${s}`);p&&(p.value=a)}const d=s===1||s==="1"?2:1,l=r-a,i=document.getElementById(`score-${e}-${t}-${d}`);if(i&&l>=0){i.value=l;const p=document.getElementById(`score-${e}-${t}-${s}`);p&&p.classList.remove("error"),i.classList.remove("error")}}function Je(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▼");const a=t.querySelector(".round-summary");a&&(a.style.display="none")}else{t.classList.add("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▶");const a=t.querySelector(".round-summary");a&&(a.style.display="")}}function Ke(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),A();return}const s=n.courts*4,o=n.leaderboard.length,a=Math.max(0,o-s);if(a===0){b(`All ${o} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=a){b(`Max ${a} can rest. Deselect someone first.`);return}n.manualByes.push(e),A()}function Qe(){const e=n.schedule.length-1,t=n.schedule[e];let s=!0;if(t.matches.forEach((i,p)=>{const f=document.getElementById(`score-${e}-${p}-1`),m=document.getElementById(`score-${e}-${p}-2`),c=parseInt(f==null?void 0:f.value)||0,u=parseInt(m==null?void 0:m.value)||0;n.scoringMode==="total"?c+u!==n.pointsPerMatch?(s=!1,f==null||f.classList.add("error"),m==null||m.classList.add("error")):(f==null||f.classList.remove("error"),m==null||m.classList.remove("error")):c<0||u<0?(s=!1,f==null||f.classList.add("error"),m==null||m.classList.add("error")):(f==null||f.classList.remove("error"),m==null||m.classList.remove("error"))}),!s){n.scoringMode==="total"?b(`Scores must sum to ${n.pointsPerMatch}`):b("Please enter valid positive scores");return}if(De().forEach((i,p)=>{const f=n.leaderboard.find(m=>m.id===i.id);f&&(f.previousRank=p+1)}),t.matches.forEach((i,p)=>{const f=document.getElementById(`score-${e}-${p}-1`),m=document.getElementById(`score-${e}-${p}-2`),c=parseInt(f==null?void 0:f.value)||0,u=parseInt(m==null?void 0:m.value)||0;i.score1=c,i.score2=u;const y=c===u,g=c>u,w=u>c;i.team1[1]?(U(i.team1[0].id,c,u,g,y,i.team1[1].id),U(i.team1[1].id,c,u,g,y,i.team1[0].id),U(i.team2[0].id,u,c,w,y,i.team2[1].id),U(i.team2[1].id,u,c,w,y,i.team2[0].id)):(U(i.team1[0].id,c,u,g,y,null),U(i.team2[0].id,u,c,w,y,null))}),!s){n.scoringMode==="total"?b(`Scores must sum to ${n.pointsPerMatch}`):b("Please enter valid positive scores");return}const a=document.querySelector(".complete-round-btn");if(a&&(a.classList.add("completing"),a.textContent="✓ Completing..."),se(),t.completed=!0,t.byes&&t.byes.length>0&&t.byes.forEach(i=>{const p=n.leaderboard.find(f=>f.id===i.id);p&&(p.byeCount=(p.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="teamMexicano"){if(n.currentRound<=20){const i=Nt();i.matches.length>0&&n.schedule.push(i)}}else if(n.format==="mexicano"&&n.currentRound<=20){const i=Dt(n.leaderboard);i.matches.length>0&&n.schedule.push(i)}N(),A(),v();const r=document.getElementById(`round-${e}`);r&&(r.classList.add("complete-flash"),setTimeout(()=>r.classList.remove("complete-flash"),1e3));const d=t.number,l=n.schedule.length>e+1;b(l?`✓ Round ${d} complete! Round ${d+1} ready`:`✓ Round ${d} complete!`),setTimeout(()=>{const i=n.schedule.length-1,p=document.getElementById(`round-${i}`);p&&(p.classList.add("animate-in","highlight"),p.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{p.classList.remove("animate-in","highlight")},1600))},100)}function Ze(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){se();for(let o=e;o<n.schedule.length;o++){const a=n.schedule[o];a.completed&&a.matches.forEach(r=>{r.team1[1]?(V(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),V(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),V(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),V(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(V(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),V(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,N(),A(),v(),b(`Editing Round ${e+1}`)}}function jt(){document.querySelectorAll(".form-select").forEach(t=>{if(t.closest(".custom-select-wrapper")||t.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),t.parentNode.insertBefore(s,t),s.appendChild(t);const o=document.createElement("div");o.classList.add("custom-select");const a=document.createElement("div");a.classList.add("custom-select-trigger"),t.classList.contains("btn-sm")&&a.classList.add("btn-sm"),a.innerHTML=`<span>${t.options[t.selectedIndex].text}</span>`;const r=document.createElement("div");r.classList.add("custom-options"),Array.from(t.options).forEach(d=>{const l=document.createElement("div");l.classList.add("custom-option"),l.textContent=d.text,l.dataset.value=d.value,d.selected&&l.classList.add("selected"),l.addEventListener("click",()=>{t.value=l.dataset.value,t.dispatchEvent(new Event("change",{bubbles:!0})),a.innerHTML=`<span>${l.textContent}</span>`,r.querySelectorAll(".custom-option").forEach(i=>i.classList.remove("selected")),l.classList.add("selected"),o.classList.remove("open"),r.classList.remove("show")}),r.appendChild(l)}),o.appendChild(a),o.appendChild(r),s.appendChild(o),a.addEventListener("click",d=>{d.stopPropagation(),document.querySelectorAll(".custom-select.open").forEach(l=>{l!==o&&(l.classList.remove("open"),l.querySelector(".custom-options").classList.remove("show"))}),o.classList.toggle("open"),r.classList.toggle("show")}),t.style.display="none"}),document.addEventListener("click",t=>{t.target.closest(".custom-select")||document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open"),s.querySelector(".custom-options").classList.remove("show")})})}const ye="padel_history_v1";function Ut(){var o;const e=Z(),t=yt(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((o=t.leaderboard[0])==null?void 0:o.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(ye,JSON.stringify(e)),s}function Z(){try{const e=localStorage.getItem(ye);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function Vt(e){R("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=Z().filter(o=>o.id!==e);localStorage.setItem(ye,JSON.stringify(s)),et(),b("Tournament deleted")},!0)}function Yt(e){const s=Z().find(o=>o.id===e);if(!s){b("Tournament details not found","error");return}R("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{Ie(s.data),A(),N(),v(),b("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(o){console.error("Failed to load tournament",o),b("Error loading tournament","error")}},!1)}let oe=[];function _t(){et();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Xt(s)})}function Xt(e){if(!e){pe(oe);return}const t=oe.filter(s=>{var f,m,c,u,y,g,w,I;const o=(((f=s.summary)==null?void 0:f.winner)||((c=(m=s.players)==null?void 0:m[0])==null?void 0:c.name)||"").toLowerCase(),a=(((u=s.summary)==null?void 0:u.format)||s.format||"").toLowerCase(),r=((y=s.summary)==null?void 0:y.date)||s.date||"",d=String(((g=s.summary)==null?void 0:g.playerCount)||((w=s.players)==null?void 0:w.length)||""),l=String(((I=s.summary)==null?void 0:I.roundCount)||""),p=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return o.includes(e)||a.includes(e)||p.includes(e)||d.includes(e)||l.includes(e)});pe(t)}function et(){oe=Z(),pe(oe)}function pe(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=Vt,window.loadTournament=Yt,window.downloadHistoryItem=Gt,t.innerHTML=e.map(o=>{var c,u,y;const a=o.summary?o.summary.date:o.date,r=o.summary?o.summary.format:o.format||"Unknown",d=o.summary?o.summary.winner:((u=(c=o.players)==null?void 0:c[0])==null?void 0:u.name)||"Unknown",l=o.summary?o.summary.playerCount:((y=o.players)==null?void 0:y.length)||0,i=new Date(a),p=i.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),f=i.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),m=!!o.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${p}</span>
            <span class="date-sub">${f}</span>
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
        <td>${l}</td>
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
      `}).join("")}}function Gt(e){const s=Z().find(o=>o.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}document.addEventListener("DOMContentLoaded",()=>{});const tt="padelcompanion-theme";function Jt(){const e=localStorage.getItem(tt),t=!e||e==="dark";return document.documentElement.setAttribute("data-theme",t?"dark":"light"),t?"dark":"light"}function Kt(){const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";return document.documentElement.setAttribute("data-theme",t),localStorage.setItem(tt,t),t}function nt(e,t){if(!e)return;const s=e.querySelector(".theme-icon");s&&(s.textContent=t==="dark"?"🌙":"☀️")}function Ee(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(b("Maximum 24 players allowed"),!1):n.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(b(`Player "${t}" already exists`),!1):(n.players.push({id:ae(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),v(),!0)}function ot(e){n.players=n.players.filter(t=>t.id!==e),v()}function Qt(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}R("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],v(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function Zt(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(r=>r.trim()).filter(r=>r);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,o=0,a=!1;for(const r of t){if(n.players.length>=24){a=!0;break}if(n.players.some(d=>d.name.toLowerCase()===r.toLowerCase())){o++;continue}n.players.push({id:ae(),name:r,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}return v(),{added:s,duplicates:o,hitLimit:a}}function en(e){const t={id:ae(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),v(),!0}function tn(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function nn(){const e=tn();e.length<2||(n.preferredPartners.push({id:ae(),player1Id:e[0].id,player2Id:e[1].id}),v())}function st(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),v()}function at(e,t,s){const o=n.preferredPartners.find(a=>a.id===e);o&&(t===1?o.player1Id=s:o.player2Id=s,v())}function on(e,t){let s;const o=document.getElementById(e),a=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",d=>{d.preventDefault(),s=d,o&&(o.style.display="inline-flex",o.addEventListener("click",async()=>{o.style.display="none",s.prompt(),(await s.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),s=null}))}),a&&!r&&o&&t&&(o.style.display="inline-flex",o.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{o&&(o.style.display="none"),s=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function sn(){on("installBtn",()=>{K("Install App on iPhone",`
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `)});const e=Jt(),t=$e();nt(t.themeToggle,e),pt(),t.format.value=n.format,t.courts.value=n.courts,t.scoringMode.value=n.scoringMode,t.points.value=n.pointsPerMatch,t.courtFormat.value=n.courtFormat,t.maxRepeats.value=n.maxRepeats,t.pairingStrategy&&(t.pairingStrategy.value=n.pairingStrategy);const s=document.getElementById("rankingCriteria");s&&(s.value=n.rankingCriteria);const o=document.getElementById("strictStrategy");if(o&&(o.checked=n.strictStrategy||!1),Me(),H(),n.schedule.length>0){t.scheduleSection.style.display="block",t.leaderboardSection.style.display="block";const a=document.getElementById("tournamentActionsSection");a&&(a.style.display="block"),A(),N(),re()}an(t),jt(),rn(),_t(),window.addEventListener("resize",Ne),T(),Ae()}function an(e){e.themeToggle.addEventListener("click",()=>{const c=Kt();nt(e.themeToggle,c)});const t=document.getElementById("navToggle"),s=document.getElementById("nav");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("open"),t.classList.toggle("active")}),document.addEventListener("click",c=>{s.classList.contains("open")&&!s.contains(c.target)&&!t.contains(c.target)&&(s.classList.remove("open"),t.classList.remove("active"))}),s.querySelectorAll("a").forEach(c=>{c.addEventListener("click",()=>{s.classList.remove("open"),t.classList.remove("active")})}));const o=document.getElementById("undoBtn");o&&(o.addEventListener("click",()=>{if(mt())if(b("Undo successful"),e.format.value=n.format,H(),A(),N(),T(),re(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="none")}}),document.addEventListener("keydown",c=>{(c.ctrlKey||c.metaKey)&&c.key==="z"&&!c.shiftKey&&(c.preventDefault(),o.click())})),e.addPlayerBtn.addEventListener("click",vt),e.cancelAddBtn.addEventListener("click",Se),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Qt(()=>{H(),W(),T()})}),e.importPlayersBtn.addEventListener("click",wt),e.closeImportModal.addEventListener("click",de),e.cancelImportBtn.addEventListener("click",de),e.confirmImportBtn.addEventListener("click",()=>{const c=e.importTextarea.value,u=Zt(c);let y=`Added ${u.added} players.`;u.duplicates>0&&(y+=` Skipped ${u.duplicates} duplicates.`),u.hitLimit&&(y+=" Stopped at 24 max limit."),e.importStatus.textContent=y,H(),u.added>0&&u.duplicates===0&&!u.hitLimit&&(setTimeout(de,1500),b(`Imported ${u.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{Ee(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),H())}),e.playerNameInput.addEventListener("keydown",c=>{c.key==="Enter"?Ee(e.playerNameInput.value)&&(e.playerNameInput.value="",H()):c.key==="Escape"&&Se()}),e.format.addEventListener("change",()=>{n.format=e.format.value,T(),v()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),v()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),v(),n.schedule.length>0&&A()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,Ae(),v(),n.schedule.length>0&&A()});const a=document.getElementById("rankingCriteria");a&&a.addEventListener("change",()=>{n.rankingCriteria=a.value,qe(),v()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Me(),v()}),e.courts.addEventListener("input",()=>{const u=e.courts.value;if(u==="")return;let y=parseInt(u)||1;y=Math.max(1,Math.min(50,y)),e.courts.value=y,n.courts=y,v(),n.courtFormat==="custom"&&Te()}),e.maxRepeats.addEventListener("change",c=>{const u=parseInt(c.target.value),y=n.maxRepeats;n.isLocked?(c.target.value=y,R("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=u,e.maxRepeats.value=u,v(),b("Max Partner Repeats updated")})):(n.maxRepeats=u,v())});const r=document.getElementById("strictStrategy");r&&r.addEventListener("change",c=>{const u=c.target.checked,y=n.strictStrategy;n.isLocked?(c.target.checked=!!y,R("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=u,r.checked=u,v(),b("Strict Mode updated")})):(n.strictStrategy=u,v())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",c=>{const u=c.target.value,y=n.pairingStrategy;if(n.isLocked)c.target.value=y,R("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(n.pairingStrategy=u,e.pairingStrategy.value=u,u==="optimal"){n.strictStrategy=!1;const g=document.getElementById("strictStrategy");g&&(g.checked=!1)}v(),T(),b("Pairing Strategy updated")});else{if(n.pairingStrategy=u,u==="optimal"){n.strictStrategy=!1;const g=document.getElementById("strictStrategy");g&&(g.checked=!1)}v(),T()}}),e.addPartnerPairBtn.addEventListener("click",()=>{nn(),W()});const d=document.getElementById("helpFormat");d&&d.addEventListener("click",()=>{K("Tournament Formats",`
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
        `)});const l=document.getElementById("helpScoring");l&&l.addEventListener("click",()=>{K("Scoring Modes",`
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
        `)});const i=document.getElementById("helpMatchup");i&&i.addEventListener("click",()=>{K("Matchup Rules",`
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
        `)});const p=document.getElementById("helpLeaderboard");p&&p.addEventListener("click",()=>{K("Leaderboard",`
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
        `)}),e.generateBtn.addEventListener("click",Ht),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",qt),e.gridColumns&&e.gridColumns.addEventListener("input",Ct),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),ze(),v()});const f=document.getElementById("factoryResetBtn");f&&f.addEventListener("click",()=>{R("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const m=document.getElementById("roundScale");m&&m.addEventListener("input",Lt)}function rn(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.id?parseInt(t.dataset.id):null,a=t.dataset.round?parseInt(t.dataset.round):null;switch(s){case"remove-player":o!==null&&(ot(o),H());break;case"toggle-player-list":Re();break;case"remove-pair":o!==null&&(st(o),W());break;case"toggle-bye":o!==null&&Ke(o);break;case"toggle-round":a!==null&&Je(a);break;case"complete-round":Qe();break;case"edit-round":a!==null&&Ze(a);break;case"toggle-visibility":Fe();break;case"toggle-position":He();break;case"end-tournament":Ve(je);break;case"toggle-toolbar":Ye();break;case"export-data":_e();break;case"share-results":Xe();break;case"add-late-player":rt();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action,o=t.dataset.pairId?parseInt(t.dataset.pairId):null,a=t.dataset.which?parseInt(t.dataset.which):null;s==="update-partner"&&o!==null&&a!==null&&(at(o,a,parseInt(t.value)),W())}),document.addEventListener("input",e=>{const t=e.target.closest("[data-action='autofill-score']");if(!t)return;const s=parseInt(t.dataset.round),o=parseInt(t.dataset.match),a=parseInt(t.dataset.team);Ge(s,o,a,t.value)})}function rt(){const e=n.format==="team"||n.format==="teamMexicano";We(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,b("Switched to Mexicano format")}en(t.trim());const s=document.getElementById("playerCount");s&&(s.textContent=`(${n.players.length})`),N(),b(`Added ${t.trim()} to tournament`)}})}window.removePlayer=e=>{ot(e),H()};window.togglePlayerList=Re;window.updatePreferredPair=(e,t,s)=>{at(e,t,s),W()};window.removePreferredPair=e=>{st(e),W()};window.updateCustomCourtName=gt;window.autoFillScore=Ge;window.toggleManualBye=Ke;window.toggleRoundCollapse=Je;window.completeRound=Qe;window.editRound=Ze;window.toggleLeaderboardVisibility=Fe;window.togglePositionChanges=He;window.updateRankingCriteria=qe;window.updateSetupUI=T;window.endTournament=()=>Ve(je);window.validateCourts=ke;window.toggleToolbar=Ye;window.exportTournamentData=_e;window.shareResults=Xe;window.promptAddLatePlayer=rt;sn();
