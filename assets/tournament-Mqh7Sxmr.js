import{i as Bt,a as $t}from"./layout-ieK_gW-G.js";const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},Z=[],kt=20;function Fe(){const e=document.getElementById("undoBtn");e&&(e.disabled=Z.length===0)}function pe(){const e=JSON.parse(JSON.stringify(n));Z.push(e),Z.length>kt&&Z.shift(),Fe()}function Mt(){if(Z.length===0)return!1;const e=Z.pop();return He(e),Fe(),!0}const Oe="tournament-state";function S(){localStorage.setItem(Oe,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function Tt(){const e=localStorage.getItem(Oe);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function Rt(){return JSON.parse(JSON.stringify(n))}function He(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],S())}function le(e){for(let t=e.length-1;t>0;t--){const o=Math.floor(Math.random()*(t+1));[e[t],e[o]]=[e[o],e[t]]}return e}function L(e,t={}){let o="default",s,a;typeof t=="number"?s=t:typeof t=="string"?o=t:typeof t=="object"&&(o=t.type??"default",s=t.duration,a=t.dismissible);const r={success:{duration:2500,dismissible:!1},info:{duration:3e3,dismissible:!1},warning:{duration:5e3,dismissible:!0},error:{duration:0,dismissible:!0},default:{duration:3e3,dismissible:!1}},l=r[o]||r.default;s=s??l.duration,a=a??l.dismissible;const i=document.querySelector(".toast");i&&i.remove();const d={success:"✓",error:"✕",warning:"⚠",info:"ℹ",default:""},c=document.createElement("div");c.className=`toast ${o}`,o==="error"?(c.setAttribute("role","alert"),c.setAttribute("aria-live","assertive")):(c.setAttribute("role","status"),c.setAttribute("aria-live","polite"));const u=d[o]||"";if(u){const p=document.createElement("span");p.className="toast-icon",p.textContent=u,c.appendChild(p)}const m=document.createElement("span");m.className="toast-message",m.textContent=e,c.appendChild(m);const f=()=>{c.classList.remove("visible"),setTimeout(()=>c.remove(),300)};if(a){const p=document.createElement("button");p.className="toast-close",p.setAttribute("aria-label","Close notification"),p.textContent="×",p.addEventListener("click",f),c.appendChild(p)}document.body.appendChild(c);const h=p=>{p.key==="Escape"&&a&&(f(),document.removeEventListener("keydown",h))};a&&document.addEventListener("keydown",h),setTimeout(()=>c.classList.add("visible"),10),s>0&&setTimeout(()=>{f(),document.removeEventListener("keydown",h)},s)}function ae(){return Math.floor(Date.now()+Math.random()*1e6)}let ue=null;function je(){return ue={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),advancedSettingsContent:document.getElementById("advancedSettingsContent"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn"),runningBadge:document.getElementById("runningBadge")},ue}function P(){return ue||je(),ue}function ve(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function We(){var i;const e=P(),t=e.courts,o=document.getElementById("courtsWarning");if(!t||!o)return!0;const s=parseInt(t.value)||1,a=((i=e.format)==null?void 0:i.value)||n.format,r=a==="team"||a==="teamMexicano"?2:4,l=Math.floor(n.players.length/r);return t.max=Math.max(1,l),s>l&&l>0?(o.textContent=`⚠️ ${n.players.length} players can only fill ${l} court${l!==1?"s":""}`,o.style.display="block",t.classList.add("input-warning"),!1):l===0&&n.players.length>0?(o.textContent=`⚠️ Need at least ${r} players for 1 court`,o.style.display="block",t.classList.add("input-warning"),!1):(o.style.display="none",t.classList.remove("input-warning"),!0)}function Ve(){const e=P();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",be()):e.customCourtNamesSection.style.display="none"}function be(){const e=P();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(o,s)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[s]||`Court ${s+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${s}, this.value)"
             placeholder="Court ${s+1}">
    </div>
  `).join("")}function At(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,S()}function Ue(){const e=P(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)}),n.players.filter(o=>!t.has(o.id)),e.addPartnerPairBtn.disabled=!1}function X(){const e=P(),t=o=>{const s=new Set;return n.preferredPartners.forEach(a=>{a.id!==o&&(s.add(a.player1Id),s.add(a.player2Id))}),s};e.preferredPartnersList.innerHTML=n.preferredPartners.map(o=>{const s=t(o.id),a=n.players.filter(i=>i.id===o.player1Id||i.id===o.player2Id||!s.has(i.id)),r=a.filter(i=>i.id!==o.player2Id||i.id===o.player1Id),l=a.filter(i=>i.id!==o.player1Id||i.id===o.player2Id);return`
        <div class="partner-pair" data-pair-id="${o.id}">
          <select class="form-select" data-action="update-partner" data-pair-id="${o.id}" data-which="1">
            ${r.map(i=>`<option value="${i.id}" ${i.id===o.player1Id?"selected":""}>${i.name}</option>`).join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" data-action="update-partner" data-pair-id="${o.id}" data-which="2">
            ${l.map(i=>`<option value="${i.id}" ${i.id===o.player2Id?"selected":""}>${i.name}</option>`).join("")}
          </select>
          <button class="remove-pair-btn" data-action="remove-pair" data-id="${o.id}">Remove</button>
        </div>
      `}).join("")}function oe(){document.querySelectorAll(".form-select").forEach(o=>{if(o.closest(".custom-select-wrapper")||o.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),o.parentNode.insertBefore(s,o),s.appendChild(o);const a=document.createElement("div");a.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),o.classList.contains("btn-sm")&&r.classList.add("btn-sm"),r.innerHTML=`<span>${o.options[o.selectedIndex].text}</span>`;const l=document.createElement("div");l.classList.add("custom-options"),Array.from(o.options).forEach(i=>{const d=document.createElement("div");d.classList.add("custom-option"),d.textContent=i.text,d.dataset.value=i.value,i.selected&&d.classList.add("selected"),d.addEventListener("click",()=>{o.value=d.dataset.value,o.dispatchEvent(new Event("change",{bubbles:!0})),r.innerHTML=`<span>${d.textContent}</span>`,l.querySelectorAll(".custom-option").forEach(c=>c.classList.remove("selected")),d.classList.add("selected"),a.classList.remove("open"),l.classList.remove("show"),l.style.position="",l.style.top="",l.style.left="",l.style.width=""}),l.appendChild(d)}),a.appendChild(r),a.appendChild(l),s.appendChild(a),r.addEventListener("click",i=>{i.stopPropagation();const d=a.classList.contains("open");if(document.querySelectorAll(".custom-select.open").forEach(c=>{if(c!==a){c.classList.remove("open"),c.querySelector(".custom-options").classList.remove("show");const u=c.querySelector(".custom-options");u.style.position="",u.style.top="",u.style.left="",u.style.width="",u.style.margin=""}}),d)a.classList.remove("open"),l.classList.remove("show"),l.style.position="",l.style.top="",l.style.left="",l.style.width="",l.style.margin="";else{a.classList.add("open"),l.classList.add("show");const c=a.getBoundingClientRect();l.style.position="fixed",l.style.top=`${c.bottom+4}px`,l.style.left=`${c.left}px`,l.style.width=`${c.width}px`,l.style.zIndex="9999",l.style.margin="0"}}),o.style.display="none"}),document.addEventListener("click",o=>{o.target.closest(".custom-select")||t()}),document.addEventListener("scroll",()=>{t()},!0);function t(){document.querySelectorAll(".custom-select.open").forEach(o=>{o.classList.remove("open");const s=o.querySelector(".custom-options");s.classList.remove("show"),s.style.position="",s.style.top="",s.style.left="",s.style.width="",s.style.margin=""})}}function _(){const e=P();e.playerList.innerHTML=n.players.map((t,o)=>{const s=['<option value="">Auto</option>'];for(let a=1;a<=n.courts;a++){const r=t.lockedCourt===a?"selected":"";s.push(`<option value="${a}" ${r}>Court ${a}</option>`)}return`
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
  `}).join(""),window.updatePlayerCourtLock||(window.updatePlayerCourtLock=(t,o)=>{const s=n.players.find(a=>a.id===t);s&&(s.lockedCourt=o?parseInt(o):null,S())}),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4?(e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"):(e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color=""),X(),Ue(),Nt(),We(),oe()}function _e(){const e=P();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function xe(){const e=P();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function $e(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function Nt(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function Ye(){const e=P();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function de(){const e=P();e.importModal.style.display="none"}const zt=Object.freeze(Object.defineProperty({__proto__:null,hideImportModal:de,hidePlayerInput:xe,renderPlayers:_,showImportModal:Ye,showPlayerInput:_e,togglePlayerList:$e},Symbol.toStringTag,{value:"Module"}));let we=!1;function fe(){const e=P(),t=n.gridColumns,o=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),o.forEach(s=>{s.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),o.forEach(s=>{s.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function Ge(){var s;const e=((s=document.getElementById("scoringMode"))==null?void 0:s.value)||n.scoringMode,t=document.getElementById("scoringValueLabel"),o=document.getElementById("points");!t||!o||(e==="total"?(t.textContent="Points",o.value=24):e==="race"?(t.textContent="Target",o.value=21):e==="time"&&(t.textContent="Minutes",o.value=12))}function Dt(){const e=P();e.gridColumns&&(e.gridColumns.max=6)}function qt(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,s=Math.floor(t/180),a=n.maxCourts||n.courts||2;return Math.min(Math.max(s,1),a)}function Xe(){const e=P();if(we||n.gridColumns!==0)return;const t=qt();document.querySelectorAll(".matches-grid").forEach(s=>{s.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function Ft(){const e=P(),t=parseInt(e.gridColumns.value);t===0?(we=!1,Xe()):we=!0,n.gridColumns=t,fe(),S()}function Je(){const e=P(),t=n.textSize,o=t/100,s=document.getElementById("scheduleSection");s&&s.style.setProperty("--text-scale",o),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function Ot(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel");e&&(n.roundScale=parseInt(e.value)/100,S());const o=n.roundScale||1,s=document.getElementById("roundsContainer");s&&s.style.setProperty("--card-scale",o),e&&(e.value=Math.round(o*100)),t&&(t.textContent=`${Math.round(o*100)}%`)}function Ke(){return[...n.leaderboard].sort((e,t)=>{switch(n.rankingCriteria){case"wins":return t.wins!==e.wins?t.wins-e.wins:t.points!==e.points?t.points-e.points:t.points-t.pointsLost-(e.points-e.pointsLost);case"winRatio":const o=e.played>0?e.wins/e.played:0,s=t.played>0?t.wins/t.played:0;return Math.abs(s-o)>.001?s-o:t.wins!==e.wins?t.wins-e.wins:t.points-e.points;case"pointRatio":const a=e.points+e.pointsLost,r=t.points+t.pointsLost,l=a>0?e.points/a:0,i=r>0?t.points/r:0;return Math.abs(i-l)>.001?i-l:t.points-e.points;case"points":default:return t.points!==e.points?t.points-e.points:t.wins!==e.wins?t.wins-e.wins:t.points-t.pointsLost-(e.points-e.pointsLost)}})}function H(){const e=P(),t=document.getElementById("toggleVisibilityBtn");t&&(n.hideLeaderboard?(t.innerHTML="Scores",t.classList.add("toggle-off"),t.classList.remove("toggle-on")):(t.innerHTML="Scores",t.classList.add("toggle-on"),t.classList.remove("toggle-off")),t.title="Click to toggle score visibility");const o=document.getElementById("togglePositionBtn");if(o&&(n.showPositionChanges?(o.innerHTML="Ranks",o.classList.add("toggle-on"),o.classList.remove("toggle-off")):(o.innerHTML="Ranks",o.classList.add("toggle-off"),o.classList.remove("toggle-on")),o.title="Click to toggle rank change indicators"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const s=!n.hideLeaderboard,a=n.showPositionChanges,r=!s&&!a,l=Ke();l.forEach((d,c)=>{const u=c+1,m=d.previousRank||u;d.rankChange=m-u});let i=r?[...l].sort(()=>Math.random()-.5):l;e.leaderboardBody.innerHTML=i.map((d,c)=>{const u=l.findIndex(g=>g.id===d.id)+1,m=r?"-":u;let f="";a&&d.played>0&&!r&&(d.rankChange>0?f='<span class="rank-up">▲</span>':d.rankChange<0?f='<span class="rank-down">▼</span>':f='<span class="rank-same">-</span>');const h=d.points-(d.pointsLost||0),p=d.played>0?Math.round((d.wins||0)/d.played*100)+"%":"0%",y=h>0?"+":"",v=s?d.points:"-",b=s?d.wins||0:"-",C=s?`<span class="${h>0?"text-success":h<0?"text-error":""}">${y}${h}</span>`:"-",z=s?p:"-",k=s||a?d.played:"-";return`
    <tr>
      <td>${m} ${f}</td>
      <td class="player-name-cell">${d.name}</td>
      <td class="font-bold">${v}</td>
      <td>${b}</td>
      <td>${C}</td>
      <td>${z}</td>
      <td>${k}</td>
    </tr>
  `}).join("")}function Qe(){n.hideLeaderboard=!n.hideLeaderboard,H()}function Ze(){n.showPositionChanges=!n.showPositionChanges,H()}function et(e){n.rankingCriteria=e,H()}let $,W,Y,G,ee=[],Se,se=!1;const Ae=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Ne(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function Ht(){this.x=Math.random()*Y,this.y=Math.random()*G-G,this.r=Ne(10,30),this.d=Math.random()*150+10,this.color=Ae[Ne(0,Ae.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return W.beginPath(),W.lineWidth=this.r/2,W.strokeStyle=this.color,W.moveTo(this.x+this.tilt+this.r/4,this.y),W.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),W.stroke()}}function tt(){if(se){W.clearRect(0,0,Y,G);for(let e=0;e<ee.length;e++)ee[e].draw();jt(),Se=requestAnimationFrame(tt)}}function jt(){for(let e=0;e<ee.length;e++){const t=ee[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>Y+20||t.x<-20||t.y>G)&&se&&(t.x=Math.random()*Y,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Wt(){if(!se){$||($=document.createElement("canvas"),$.id="confetti-canvas",$.style.position="fixed",$.style.top="0",$.style.left="0",$.style.width="100%",$.style.height="100%",$.style.pointerEvents="none",$.style.zIndex="9999",document.body.appendChild($),W=$.getContext("2d")),Y=window.innerWidth,G=window.innerHeight,$.width=Y,$.height=G,window.addEventListener("resize",()=>{Y=window.innerWidth,G=window.innerHeight,$.width=Y,$.height=G}),se=!0,ee=[];for(let e=0;e<150;e++)ee.push(new Ht);tt()}}function Vt(){se=!1,W&&W.clearRect(0,0,Y,G),Se&&cancelAnimationFrame(Se),$&&$.remove(),$=null}function Ut(){Wt(),setTimeout(Vt,5e3)}function F(e,t,o="Confirm",s,a=!1,r=null,l=null){const i=document.querySelector(".confirm-modal");i&&i.remove();const d=document.createElement("div");d.className="modal-overlay confirm-modal",d.style.display="flex";const c=a?"btn btn-danger":"btn btn-primary";d.innerHTML=`
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
  `,document.body.appendChild(d),setTimeout(()=>d.classList.add("visible"),10);const u=d.querySelector(".modal");u&&u.addEventListener("click",y=>y.stopPropagation());const m=d.querySelector("#modalCancelBtn"),f=d.querySelector("#modalConfirmBtn"),h=d.querySelector("#modalSecondaryBtn"),p=()=>d.remove();m&&m.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),p()}),f&&f.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),p(),s()}),h&&l&&h.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),p(),l()}),d.addEventListener("click",y=>{y.target===d&&p()})}function nt(e,t,o){const s=document.querySelector(".input-modal");s&&s.remove();const a=document.createElement("div");a.className="modal-overlay input-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector("#modalInput"),l=a.querySelector("#modalCancelBtn"),i=a.querySelector("#modalConfirmBtn"),d=()=>a.remove();l.onclick=d;const c=()=>{const u=r.value;u&&u.trim()&&(d(),o(u.trim()))};i.onclick=c,r.onkeydown=u=>{u.key==="Enter"&&c(),u.key==="Escape"&&d()},setTimeout(()=>r.focus(),100)}function ot(e){const t=document.querySelector(".final-modal");t&&t.remove();const o=a=>a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,s=document.createElement("div");s.className="final-modal",s.innerHTML=`
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
  `,document.body.appendChild(s),Ut(),setTimeout(()=>s.classList.add("visible"),10)}function _t(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function Ce(e,t,o){const s=document.querySelector(".alert-modal");s&&s.remove();const a=document.createElement("div");a.className="modal-overlay alert-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const r=a.querySelector(".modal");r&&r.addEventListener("click",d=>d.stopPropagation());const l=a.querySelector("#modalOkBtn"),i=()=>{a.remove()};l&&l.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),i()}),a.addEventListener("click",d=>{d.target===a&&i()}),a.addEventListener("click",d=>{d.target===a&&i()})}function ne(e,t){const o=document.querySelector(".info-modal");o&&o.remove();const s=document.createElement("div");s.className="modal-overlay info-modal",s.style.display="flex",s.innerHTML=`
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
  `,document.body.appendChild(s),setTimeout(()=>s.classList.add("visible"),10);const a=s.querySelector(".modal");a&&a.addEventListener("click",d=>d.stopPropagation());const r=s.querySelector("#modalOkBtn"),l=s.querySelector("#modalCloseX"),i=()=>s.remove();r&&(r.onclick=i),l&&(l.onclick=i),s.addEventListener("click",d=>{d.target===s&&i()})}function Yt(){return new Promise(e=>{const t=document.createElement("div");t.className="countdown-overlay",t.innerHTML='<div class="countdown-number">3</div>',t.style.cursor="pointer",document.body.appendChild(t);let o=!1,s=null;const a=()=>{o||(o=!0,s&&clearTimeout(s),t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},100))};t.addEventListener("click",a),requestAnimationFrame(()=>{t.classList.add("active")});const r=t.querySelector(".countdown-number"),l=["3","2","1","GO!"];let i=0;const d=()=>{if(o)return;if(i>=l.length){t.classList.remove("active"),setTimeout(()=>{t.remove(),e()},300);return}const c=l[i];r.textContent=c,r.className="countdown-number"+(c==="GO!"?" countdown-go":""),r.style.animation="none",requestAnimationFrame(()=>{r.style.animation=""}),i++,s=setTimeout(d,c==="GO!"?600:800)};s=setTimeout(d,100)})}window.closeFinalModal=_t;function Gt(){const e=[...n.players],t=e.length,o=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const s=e.length,a=[],r=e[0],l=e.slice(1);for(let i=0;i<s-1;i++){const d=[r,...l],c=[];for(let y=0;y<s/2;y++){const v=d[y],b=d[s-1-y];!v.isBye&&!b.isBye&&c.push([v,b])}const u=[],m=new Set;for(let y=0;y<c.length-1;y+=2)c[y]&&c[y+1]&&(u.push({court:Math.floor(y/2)+1,team1:c[y],team2:c[y+1]}),c[y].forEach(v=>m.add(v.id)),c[y+1].forEach(v=>m.add(v.id)));const f=u.slice(0,o),h=new Set;f.forEach(y=>{y.team1.forEach(v=>h.add(v.id)),y.team2.forEach(v=>h.add(v.id))});const p=n.players.filter(y=>!y.isBye&&!h.has(y.id));f.length>0&&a.push({number:a.length+1,matches:f,byes:p}),l.unshift(l.pop())}return a}function Xt(){const e=[...n.players],t=e.length,o=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const s=e.length,a=[],r=e[0],l=e.slice(1);for(let i=0;i<s-1;i++){const d=[r,...l],c=[],u=new Set;for(let p=0;p<s/2;p++){const y=d[p],v=d[s-1-p];!y.isBye&&!v.isBye&&(c.push({court:c.length+1,team1:[y],team2:[v]}),u.add(y.id),u.add(v.id))}const m=c.slice(0,o),f=new Set;m.forEach(p=>{p.team1.forEach(y=>f.add(y.id)),p.team2.forEach(y=>f.add(y.id))});const h=n.players.filter(p=>!p.isBye&&!f.has(p.id));m.length>0&&a.push({number:a.length+1,matches:m,byes:h}),l.unshift(l.pop())}return a}function Jt(){const e=[...n.players];le(e);const t=n.courts,o=[],s=new Set;for(let r=0;r<e.length-1&&o.length<t;r+=2)o.push({court:o.length+1,team1:[e[r]],team2:[e[r+1]]}),s.add(e[r].id),s.add(e[r+1].id);const a=e.filter(r=>!s.has(r.id));return[{number:1,matches:o,byes:a}]}function Kt(){const e=[...n.leaderboard].sort((i,d)=>d.points-i.points),t=n.courts,o=e.filter(i=>!n.manualByes.includes(i.id)),s=e.filter(i=>n.manualByes.includes(i.id)),a=[],r=new Set;for(let i=0;i<o.length-1&&a.length<t;i+=2)a.push({court:a.length+1,team1:[o[i]],team2:[o[i+1]]}),r.add(o[i].id),r.add(o[i+1].id);const l=[...s,...o.filter(i=>!r.has(i.id))];return{number:n.schedule.length+1,matches:a,byes:l}}function Qt(){const e=n.courts,t=e*4,o=[],s=new Set,a=[...n.players],r=[];a.forEach(p=>{if(s.has(p.id))return;const y=st(p.id);if(y){const v=a.find(b=>b.id===y);v?(o.push({type:"pair",players:[p,v]}),s.add(v.id)):o.push({type:"single",players:[p]})}else o.push({type:"single",players:[p]});s.add(p.id)}),le(o);const l=[];let i=0;for(const p of o)i+p.players.length<=t?(l.push(p),i+=p.players.length):r.push(...p.players);const d=[],c=[];l.forEach(p=>{p.type==="pair"?d.push(p.players):c.push(p.players[0])}),le(c);for(let p=0;p<c.length-1;p+=2)d.push([c[p],c[p+1]]);le(d);const u=[],m=new Set,f=[],h=[];for(let p=0;p<d.length-1;p+=2){const y=d[p],v=d[p+1],b=[...y,...v].find(C=>C.lockedCourt);b?f.push({team1:y,team2:v,lockedCourt:b.lockedCourt}):h.push({team1:y,team2:v})}return f.forEach(p=>{if(u.length>=e)return;let y=p.lockedCourt;(m.has(y)||y>e)&&(y=null),y?(m.add(y),u.push({court:y,team1:p.team1,team2:p.team2})):h.push({team1:p.team1,team2:p.team2})}),h.forEach(p=>{if(u.length>=e)return;let y=1;for(;m.has(y);)y++;y<=e&&(m.add(y),u.push({court:y,team1:p.team1,team2:p.team2}))}),u.sort((p,y)=>p.court-y.court),d.length%2!==0&&u.length<d.length/2&&r.push(...d[d.length-1]),[{number:1,matches:u,byes:r}]}function st(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(o=>o.player1Id===e||o.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function Zt(e){const t=n.courts,o=t*4,s=new Set(n.manualByes),a=[],r=new Set,l=[...e];l.forEach(g=>{if(r.has(g.id)||s.has(g.id))return;const x=st(g.id);if(x){const w=l.find(E=>E.id===x);w?s.has(w.id)?a.push({type:"single",players:[g]}):(a.push({type:"pair",players:[g,w]}),r.add(w.id)):a.push({type:"single",players:[g]})}else a.push({type:"single",players:[g]});r.add(g.id)}),a.sort((g,x)=>{const w=A=>{const J=A.players.reduce((O,I)=>O+(I.byeCount||0),0),te=A.players.reduce((O,I)=>O+(I.played||0),0);return{bye:J/A.players.length,play:te/A.players.length}},E=w(g),B=w(x);return Math.abs(B.bye-E.bye)>.1?B.bye-E.bye:E.play-B.play});const i=[],d=[];let c=0;for(const g of a)c+g.players.length<=o&&(d.push(g),i.push(...g.players),c+=g.players.length);const u=new Set(i.map(g=>g.id)),m=l.filter(g=>!u.has(g.id)),f=[],h=[];d.forEach(g=>{g.type==="pair"?f.push(g.players):h.push(g.players[0])}),h.sort((g,x)=>x.points-g.points);let p=0;for(;p<h.length-3;p+=4){const g=h[p],x=h[p+1],w=h[p+2],E=h[p+3],B=[{name:"oneThree",team1:[g,w],team2:[x,E]},{name:"oneTwo",team1:[g,x],team2:[w,E]},{name:"oneFour",team1:[g,E],team2:[x,w]}];let A;const J=n.pairingStrategy!=="optimal"&&n.strictStrategy;n.strictStrategy;const te=n.maxRepeats!==void 0?n.maxRepeats:99,O=B.map(I=>{const R=I.team1[0].id,q=I.team1[1].id,M=I.team2[0].id,N=I.team2[1].id,Te=(It,Pt)=>{const ie=e.find(ye=>ye.id===It);return ie!=null&&ie.playedWith?ie.playedWith.filter(ye=>ye===Pt).length:0},Re=Te(R,q)+Te(M,N),xt=I.team1[0].points+I.team1[1].points,wt=I.team2[0].points+I.team2[1].points,St=Math.abs(xt-wt),Ct=te<99&&Re>te,Lt=I.name===n.pairingStrategy,Et=R*1e6+q*1e4+M*100+N;return{...I,repeatPenalty:Re,violatesRepeats:Ct,isPreferred:Lt,rankingImbalance:St,tieBreaker:Et}});if(O.sort((I,R)=>I.tieBreaker-R.tieBreaker),n.pairingStrategy==="optimal")A={...[...O].sort((R,q)=>R.repeatPenalty!==q.repeatPenalty?R.repeatPenalty-q.repeatPenalty:R.rankingImbalance!==q.rankingImbalance?R.rankingImbalance-q.rankingImbalance:R.tieBreaker-q.tieBreaker)[0],relaxedConstraint:null};else{const I=O.find(R=>R.isPreferred)||O[0];if(!I.violatesRepeats)A={...I,relaxedConstraint:null};else if(J)A={...I,relaxedConstraint:"repeats"};else{const R=O.filter(q=>!q.violatesRepeats);R.length>0?A={...[...R].sort((M,N)=>M.isPreferred!==N.isPreferred?M.isPreferred?-1:1:M.rankingImbalance!==N.rankingImbalance?M.rankingImbalance-N.rankingImbalance:M.tieBreaker-N.tieBreaker)[0],relaxedConstraint:"pattern"}:A={...[...O].sort((M,N)=>M.repeatPenalty!==N.repeatPenalty?M.repeatPenalty-N.repeatPenalty:M.isPreferred!==N.isPreferred?M.isPreferred?-1:1:M.rankingImbalance!==N.rankingImbalance?M.rankingImbalance-N.rankingImbalance:M.tieBreaker-N.tieBreaker)[0],relaxedConstraint:"tier3"}}}f.push(A.team1),f.push(A.team2)}p<h.length-1&&f.push([h[p],h[p+1]]);const y=f.map(g=>({players:g,points:g.reduce((x,w)=>x+w.points,0)}));y.sort((g,x)=>x.points-g.points);const v=[],b=new Set,C=new Set,z=[],k=[];for(let g=0;g<y.length-1;g+=2){const x=y[g],w=y[g+1],E=[...x.players,...w.players].find(B=>B.lockedCourt);E?z.push({t1:x,t2:w,lockedCourt:E.lockedCourt}):k.push({t1:x,t2:w})}return z.forEach(g=>{if(v.length>=t)return;let x=g.lockedCourt;(C.has(x)||x>t)&&(x=null),x?(C.add(x),v.push({court:x,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(w=>b.add(w.id)),g.t2.players.forEach(w=>b.add(w.id))):k.push({t1:g.t1,t2:g.t2})}),k.forEach(g=>{if(v.length>=t)return;let x=1;for(;C.has(x);)x++;x<=t&&(C.add(x),v.push({court:x,team1:g.t1.players,team2:g.t2.players}),g.t1.players.forEach(w=>b.add(w.id)),g.t2.players.forEach(w=>b.add(w.id)))}),v.sort((g,x)=>g.court-x.court),y.forEach(g=>{g.players.some(x=>b.has(x.id))||g.players.forEach(x=>m.push(x))}),{number:n.schedule.length+1,matches:v,byes:m}}function K(e,t,o,s,a,r=null){const l=n.leaderboard.find(i=>i.id===e);l&&(l.points+=t,l.played+=1,l.pointsLost=(l.pointsLost||0)+o,s?l.wins=(l.wins||0)+1:a||(l.losses=(l.losses||0)+1),r&&!l.playedWith&&(l.playedWith=[]),r&&l.playedWith.push(r))}function Q(e,t,o,s,a){const r=n.leaderboard.find(l=>l.id===e);r&&(r.points-=t,r.played-=1,r.pointsLost=(r.pointsLost||0)-o,s?r.wins=(r.wins||0)-1:a||(r.losses=(r.losses||0)-1),r.played<0&&(r.played=0),r.points<0&&(r.points=0),r.wins<0&&(r.wins=0),r.losses<0&&(r.losses=0),r.pointsLost<0&&(r.pointsLost=0))}let Le=null;function en(e){Le=e}let Ee=null;function tn(e){Ee=e}function D(){const e=P(),t=n.format,o=t==="team"||t==="teamMexicano",s=document.getElementById("playersHeader");s&&s.firstChild&&(s.firstChild.textContent=o?"Teams ":"Players "),e.addPlayerBtn&&(e.addPlayerBtn.textContent=o?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=o?"Enter team name...":"Enter name...");const a=document.querySelector(".setup-card");if(!a)return;[a.querySelector(".setup-grid"),a.querySelector(".setup-grid-3"),document.getElementById("customCourtNamesSection")].forEach(p=>{if(!p)return;p.querySelectorAll("input, select, button").forEach(v=>{if(!v.classList.contains("always-enabled")){if(n.isLocked){if(v.disabled=!0,v.classList.add("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const C=b.querySelector(".custom-select");C&&C.classList.add("disabled")}}}else if(v.disabled=!1,v.classList.remove("locked"),v.tagName==="SELECT"){const b=v.closest(".custom-select-wrapper");if(b){const C=b.querySelector(".custom-select");C&&C.classList.remove("disabled")}}}})});const l=document.getElementById("advancedSettingsContent");l&&(l.querySelectorAll("input, select, button").forEach(y=>{if(y.disabled=!1,y.classList.remove("locked"),y.tagName==="SELECT"){const v=y.closest(".custom-select-wrapper");if(v){const b=v.querySelector(".custom-select");b&&b.classList.remove("disabled")}}}),Ue());const i=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",i&&(i.style.display="inline-flex")):(e.generateBtn.style.display="block",i&&(i.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=!1);const d=String(t).trim(),m=d.toLowerCase()==="mexicano"||d==="teamMexicano",f=e.advancedSettingsContent;f&&(m?(f.classList.remove("collapsed"),f.classList.add("expanded")):(f.classList.remove("expanded"),f.classList.add("collapsed")));const h=document.getElementById("strictStrategy");h&&(h.disabled=!1),Ee&&Ee()}function nn(){const e=P(),t=e.format.value,o=t==="team"||t==="teamMexicano",s=o?2:4;if(n.players.length<s){L(`Not enough ${o?"teams":"players"} (min ${s})`,"error");return}n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const a=n.format==="team"||n.format==="teamMexicano"?2:4,r=Math.floor(n.players.length/a),l=()=>{pe(),n.leaderboard=n.players.map(d=>({...d,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=Gt(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=Xt(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=Jt(),n.allRounds=null):(n.schedule=Qt(),n.allRounds=null),e.leaderboardSection.style.display="block",H(),Le&&Le(),e.scheduleSection.style.display="block";const i=document.getElementById("tournamentActionsSection");i&&(i.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{const d=document.getElementById("round-0");d&&(d.classList.add("animate-in","highlight"),setTimeout(()=>{d.classList.remove("animate-in","highlight")},1600))},100),n.isLocked=!0,D(),S(),L("🎾 Tournament started! Round 1 ready")};if(n.courts>r){if(r===0){Ce("Not Enough Players",`You need at least ${a} players/teams to start!`);return}const i=n.courts;n.courts=r,e.courts&&(e.courts.value=n.courts),L(`Adjusted courts: ${i} → ${r}`)}Yt().then(()=>{l()})}function on(){const e=P();F("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{pe(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",D(),S(),L("Tournament reset")},!0)}function at(e){F("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,D();const t=[...n.leaderboard].sort((o,s)=>s.points-o.points);xn(),L("Tournament saved to history"),e&&e(t),H(),S()},!0)}function rt(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function it(e=null){const t=e||n,o=new Date().toLocaleDateString(),s=new Date().toLocaleTimeString();let a="data:text/csv;charset=utf-8,";a+=`Tournament Results
`,a+=`Date,${o} ${s}
`,a+=`Format,${t.format}
`,a+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,a+=`Final Standings
`,a+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((d,c)=>c.points-d.points).forEach((d,c)=>{const u=(d.points||0)-(d.pointsLost||0);a+=`${c+1},"${d.name}",${d.points},${d.wins},${d.played},${d.pointsLost||0},${u}
`}),a+=`
`,a+=`Match History
`,a+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(d=>{d.completed&&d.matches.forEach(c=>{const u=c.team1.map(h=>h.name).join(" & "),m=c.team2.map(h=>h.name).join(" & ");let f=`Court ${c.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[c.court-1]?f=t.customCourtNames[c.court-1]:t.courtFormat==="number"&&(f=`${c.court}`),a+=`Round ${d.number},"${f}","${u}",${c.score1},${c.score2},"${m}"
`})});const l=encodeURI(a),i=document.createElement("a");i.setAttribute("href",l),i.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}async function lt(e=null){var r;const t=e||n;let s=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;s+=`Winner: ${((r=t.leaderboard[0])==null?void 0:r.name)||"Unknown"}
`,s+=`Format: ${t.format}

`,s+=`Top Standings:
`,[...t.leaderboard].sort((l,i)=>i.points-l.points).slice(0,5).forEach((l,i)=>{s+=`${i+1}. ${l.name}: ${l.points} pts (${l.wins}W)
`}),s+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(s),L("Results copied to clipboard")}catch(l){console.error("Failed to copy: ",l),L("Failed to copy results","error")}}class sn{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const o=Math.floor(t/60),s=t%60;return`${o.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`}playBeep(t=440,o=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const s=this.audioContext.createOscillator(),a=this.audioContext.createGain();s.type="sine",s.frequency.value=t,s.connect(a),a.connect(this.audioContext.destination),s.start(),a.gain.setValueAtTime(.1,this.audioContext.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+o),s.stop(this.audioContext.currentTime+o)}catch(s){console.warn("Audio play failed",s)}}}let T=null;function an(){const e=P();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",T&&(T.pause(),T=null);return}if(e.matchTimerContainer.style.display="flex",T)T.duration!==n.pointsPerMatch&&T.setDuration(n.pointsPerMatch);else{T=new sn({duration:n.pointsPerMatch||12,onTimeUpdate:o=>{e.timerDisplay&&(e.timerDisplay.textContent=o),document.title=`${o} - Tournament`},onStatusChange:o=>{o==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed"),e.runningBadge&&(e.runningBadge.style.display="inline-flex",e.runningBadge.classList.add("running"))):o==="paused"||o==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),e.runningBadge&&(e.runningBadge.style.display="none",e.runningBadge.classList.remove("running")),o==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):o==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!",document.body.classList.add("timer-finished-flash"),setTimeout(()=>{document.body.classList.remove("timer-finished-flash")},1e3))}}),e.timerDisplay.textContent=T.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>T.start(),e.timerPauseBtn.onclick=()=>T.pause(),e.timerResetBtn.onclick=()=>T.reset(),e.timerAddBtn.onclick=()=>T.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>T.addTime(-60));const t=()=>{const o=()=>{nt("Set Timer Duration","Enter minutes (e.g. 12)",s=>{const a=parseInt(s);a>0?(n.pointsPerMatch=a,S(),T.setDuration(a),L(`Timer set to ${a} minutes`)):L("Invalid minutes","error")})};T.isRunning?F("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{T.pause(),o()}):o()};e.timerDisplay.onclick=t}}}function U(){const e=P();an(),ce();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((r,l)=>{const i=l===t,d=r.completed,c=d&&!i,u=d?r.matches.map(m=>`${m.score1}-${m.score2}`).join(" · "):"";return`
    <div class="round ${d?"completed":""} ${c?"collapsed":""}" 
         id="round-${l}" 
         data-round="${l}">
      <div class="round-header" data-action="toggle-round" data-round="${l}">
        <span class="round-title">
          Round ${r.number} ${d?"(done)":""}
        </span>
        ${d?`<span class="round-summary" style="${c?"":"display: none"}">${u}</span>`:""}
        ${d?`<span class="collapse-icon">${c?"▶":"▼"}</span>`:""}
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
                ${d?`
                <div class="score-input-row">
                  <span class="score-display">${m.score1} - ${m.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${l}">Edit</button>
                </div>
                `:`
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${l}-${f}-1" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                         value="${m.score1||""}"
                         data-action="autofill-score" data-round="${l}" data-match="${f}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${l}-${f}-2" 
                         min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                         value="${m.score2||""}"
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
          <span class="waiting-names">${r.byes.map(m=>m.name).join(", ")}</span>
        </div>
        `:""}
        ${!d&&i?`
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
  `}).join(""),Dt(),fe(),Je(),dt();const o=n.schedule.findIndex(r=>!r.completed),s=o>=0?o:0,a=document.getElementById(`round-${s}`);a&&setTimeout(()=>{a.scrollIntoView({behavior:"smooth",block:"start"})},100)}function ce(){const e=document.getElementById("gameDetails");if(!e)return;const t={americano:"Americano",mexicano:"Mexicano",team:"Team Americano",teamMexicano:"Team Mexicano"},o={total:"Total Points",race:"Race to Points",time:"Time Based"},s=[{label:t[n.format]||"Tournament"},{label:`${n.courts} Courts`},{label:o[n.scoringMode]},{label:n.scoringMode==="time"?`${n.pointsPerMatch} Mins`:`${n.pointsPerMatch} Pts`}];e.innerHTML=s.map(a=>`
    <div class="game-detail-item">
      <span class="detail-label">${a.label}</span>
    </div>
  `).join("")}en(U);function Ie(e,t,o,s){setTimeout(dt,0);let a=parseInt(s);if(isNaN(a)||a<0)return;const r=parseInt(n.pointsPerMatch);if(!(isNaN(r)||r<=0)){if(n.scoringMode==="total"){if(a>r){a=r;const c=document.getElementById(`score-${e}-${t}-${o}`);c&&(c.value=a)}const l=o===1||o==="1"?2:1,i=r-a,d=document.getElementById(`score-${e}-${t}-${l}`);d&&i>=0&&(d.value=i)}else if(n.scoringMode==="race"){if(a<r){const l=o===1||o==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${l}`);i&&(i.value=r)}else if(a===r){const l=o===1||o==="1"?2:1,i=document.getElementById(`score-${e}-${t}-${l}`);i&&i.value===""&&(i.value=0)}}(score1Input==null?void 0:score1Input.value)!==""&&(score2Input==null?void 0:score2Input.value)!==""&&(score1Input==null||score1Input.classList.remove("error"),score2Input==null||score2Input.classList.remove("error"))}}function dt(){const e=n.schedule.findIndex(r=>!r.completed);if(e===-1)return;const t=n.schedule[e],o=document.querySelector(".complete-round-btn");if(!o)return;let s=!0;const a=parseInt(n.pointsPerMatch);for(let r=0;r<t.matches.length;r++){const l=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`);if(!l||!i)continue;const d=l.value,c=i.value;if(d===""||c===""){s=!1;break}const u=parseInt(d),m=parseInt(c);if(n.scoringMode==="total"){if(u+m!==a){s=!1;break}}else if(u<0||m<0){s=!1;break}}o.disabled=!1,s?(o.classList.remove("btn-warning"),o.classList.add("btn-success"),o.textContent=`Complete Round ${t.number}`):(o.classList.add("btn-warning"),o.classList.remove("btn-success"),o.textContent="Complete Anyway")}function ct(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const s=t.querySelector(".collapse-icon");s&&(s.textContent="▼");const a=t.querySelector(".round-summary");a&&(a.style.display="none")}else{t.classList.add("collapsed");const s=t.querySelector(".collapse-icon");s&&(s.textContent="▶");const a=t.querySelector(".round-summary");a&&(a.style.display="")}}function ut(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),U();return}const o=n.courts*4,s=n.leaderboard.length,a=Math.max(0,s-o);if(a===0){L(`All ${s} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=a){L(`Max ${a} can rest. Deselect someone first.`);return}n.manualByes.push(e),U()}function mt(){const e=n.schedule.length-1,t=n.schedule[e];let o=!0;const s=[];if(t.matches.forEach((a,r)=>{const l=document.getElementById(`score-${e}-${r}-1`),i=document.getElementById(`score-${e}-${r}-2`),d=l==null?void 0:l.value,c=i==null?void 0:i.value;let u=!0;(d===""||c==="")&&(u=!1,d===""&&(l==null||l.classList.add("error")),c===""&&(i==null||i.classList.add("error")));const m=parseInt(d)||0,f=parseInt(c)||0;if(n.scoringMode==="total"){const h=parseInt(n.pointsPerMatch,10);m+f!==h?(u=!1,l==null||l.classList.add("error"),i==null||i.classList.add("error")):d!==""&&c!==""&&(l==null||l.classList.remove("error"),i==null||i.classList.remove("error"))}else m<0||f<0?(u=!1,l==null||l.classList.add("error"),i==null||i.classList.add("error")):d!==""&&c!==""&&(l==null||l.classList.remove("error"),i==null||i.classList.remove("error"));u||(o=!1,s.push(ve(a.court)))}),!o){const a=s.length>0?` on ${s.join(", ")}`:"";F("Incomplete/Invalid Scores",`Some matches have missing or invalid scores${a}. Do you want to complete the round anyway?`,"Yes, Complete Anyway",()=>{ge(t)},!0);return}if(n.scoringMode==="race"){const a=[],r=n.pointsPerMatch;if(t.matches.forEach((l,i)=>{const d=document.getElementById(`score-${e}-${i}-1`),c=document.getElementById(`score-${e}-${i}-2`),u=parseInt(d==null?void 0:d.value)||0,m=parseInt(c==null?void 0:c.value)||0;u<r&&m<r&&a.push(ve(l.court))}),a.length>0){const l=a.join(", ");F("Low Scores Detected",`On ${l}, neither team reached the target of ${r}. Is this correct?`,"Yes, Complete Round",()=>{ge(t)},!0);return}}ge(t)}function ge(e){const t=n.schedule.findIndex(i=>i===e);Ke().forEach((i,d)=>{const c=n.leaderboard.find(u=>u.id===i.id);c&&(c.previousRank=d+1)}),e.matches.forEach((i,d)=>{const c=document.getElementById(`score-${t}-${d}-1`),u=document.getElementById(`score-${t}-${d}-2`),m=parseInt(c==null?void 0:c.value)||0,f=parseInt(u==null?void 0:u.value)||0;i.score1=m,i.score2=f;const h=m===f,p=m>f,y=f>m;i.team1[1]?(K(i.team1[0].id,m,f,p,h,i.team1[1].id),K(i.team1[1].id,m,f,p,h,i.team1[0].id),K(i.team2[0].id,f,m,y,h,i.team2[1].id),K(i.team2[1].id,f,m,y,h,i.team2[0].id)):(K(i.team1[0].id,m,f,p,h,null),K(i.team2[0].id,f,m,y,h,null))});const s=document.querySelector(".complete-round-btn");if(s&&(s.classList.add("completing"),s.textContent="✓ Completing..."),pe(),e.completed=!0,e.byes&&e.byes.length>0&&e.byes.forEach(i=>{const d=n.leaderboard.find(c=>c.id===i.id);d&&(d.byeCount=(d.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const i={...n.allRounds[n.currentRound-1]};n.schedule.push(i)}else if(n.format==="teamMexicano"){if(n.currentRound<=20){const i=Kt();i.matches.length>0&&n.schedule.push(i)}}else if(n.format==="mexicano"&&n.currentRound<=20){const i=Zt(n.leaderboard);i.matches.length>0&&n.schedule.push(i)}H(),U(),S();const a=document.getElementById(`round-${t}`);a&&(a.classList.add("complete-flash"),setTimeout(()=>a.classList.remove("complete-flash"),1e3));const r=e.number,l=n.schedule.length>t+1;L(l?`✓ Round ${r} complete! Round ${r+1} ready`:`✓ Round ${r} complete!`),setTimeout(()=>{const i=n.schedule.length-1,d=document.getElementById(`round-${i}`);d&&(d.classList.add("animate-in","highlight"),d.scrollIntoView({behavior:"smooth",block:"start"}),setTimeout(()=>{d.classList.remove("animate-in","highlight")},1600))},100)}function pt(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){pe();for(let s=e;s<n.schedule.length;s++){const a=n.schedule[s];a.completed&&a.matches.forEach(r=>{r.team1[1]?(Q(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team1[1].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2),Q(r.team2[1].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2)):(Q(r.team1[0].id,r.score1||0,r.score2||0,r.score1>r.score2,r.score1===r.score2),Q(r.team2[0].id,r.score2||0,r.score1||0,r.score2>r.score1,r.score1===r.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,H(),U(),S(),L(`Editing Round ${e+1}`)}}const rn="modulepreload",ln=function(e){return"/"+e},ze={},dn=function(t,o,s){let a=Promise.resolve();if(o&&o.length>0){let l=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),d=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));a=l(o.map(c=>{if(c=ln(c),c in ze)return;ze[c]=!0;const u=c.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":rn,u||(f.as="script"),f.crossOrigin="",f.href=c,d&&f.setAttribute("nonce",d),document.head.appendChild(f),u)return new Promise((h,p)=>{f.addEventListener("load",h),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(l){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=l,window.dispatchEvent(i),!i.defaultPrevented)throw l}return a.then(l=>{for(const i of l||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};function De(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(L("Maximum 24 players allowed"),!1):n.players.some(o=>o.name.toLowerCase()===t.toLowerCase())?(L(`Player "${t}" already exists`),!1):(n.players.push({id:ae(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),S(),!0)}function ft(e){n.players=n.players.filter(t=>t.id!==e),S()}function cn(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}F("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],S(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function un(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(r=>r.trim()).filter(r=>r);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let o=0,s=0,a=!1;for(const r of t){if(n.players.length>=24){a=!0;break}if(n.players.some(l=>l.name.toLowerCase()===r.toLowerCase())){s++;continue}n.players.push({id:ae(),name:r,points:0,wins:0,losses:0,pointsLost:0,played:0}),o++}return S(),{added:o,duplicates:s,hitLimit:a}}function mn(e){const t={id:ae(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),S(),!0}function yt(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function pn(){const e=yt();e.length<2||(n.preferredPartners.push({id:ae(),player1Id:e[0].id,player2Id:e[1].id}),S())}function ke(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),S()}function gt(e,t,o){const s=n.preferredPartners.find(a=>a.id===e);s&&(t===1?s.player1Id=o:s.player2Id=o,S())}const ht={format:{label:"Format",type:"select",options:[{value:"americano",label:"Americano"},{value:"mexicano",label:"Mexicano"},{value:"team",label:"Team Americano"},{value:"teamMexicano",label:"Team Mexicano"}],helpId:"helpFormat"},courts:{label:"Courts",type:"number",min:1,max:50},scoringMode:{label:"Scoring",type:"select",options:[{value:"total",label:"Total Points"},{value:"race",label:"Race to"},{value:"time",label:"Timed"}],helpId:"helpScoring"},pointsPerMatch:{label:"Points",type:"number",min:4,max:50},maxRepeats:{label:"Repeats",type:"select",options:[{value:0,label:"No repeats"},{value:1,label:"Max 1x"},{value:2,label:"Max 2x"},{value:3,label:"Max 3x"},{value:99,label:"Unlimited"}],mexicanoOnly:!0,helpId:"helpMatchup"},pairingStrategy:{label:"Pairing",type:"select",options:[{value:"optimal",label:"Optimal"},{value:"oneThree",label:"1&3 vs 2&4"},{value:"oneTwo",label:"1&2 vs 3&4"},{value:"oneFour",label:"1&4 vs 2&3"}],mexicanoOnly:!0,helpId:"helpMatchup"},strictStrategy:{label:"Prioritize Pattern",type:"toggle",mexicanoOnly:!0,helpId:"helpMatchup"}};function qe(){return n.scoringMode==="time"?"Minutes":n.scoringMode==="race"?"Race to":"Total Points"}function V(){var r,l;const e=document.getElementById("tournamentConfig");if(!e)return;if(hn(e),n.isLocked){e.style.display="none";return}e.style.display="block",n.format==="team"||n.format;const t=n.format==="mexicano"||n.format==="teamMexicano",o=((r=n.players)==null?void 0:r.length)||0,s=Math.max(1,Math.floor(o/4));n.courts>s&&(n.courts=s,S()),n.pointsPerMatch<4?(n.pointsPerMatch=4,S()):n.pointsPerMatch>50&&(n.pointsPerMatch=50,S());let a='<div class="config-grid">';if(a+=j("format",n.format),t?(a+='<div class="config-spacer"></div>',a+=j("scoringMode",n.scoringMode),a+=j("pointsPerMatch",n.pointsPerMatch,{label:qe()}),a+=j("maxRepeats",n.maxRepeats),a+=j("courts",n.courts),a+=j("pairingStrategy",n.pairingStrategy),a+=j("strictStrategy",n.strictStrategy,{disabled:n.pairingStrategy==="optimal"}),n.pairingStrategy!=="optimal"&&n.strictStrategy&&n.maxRepeats===0&&(a+=`
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `)):(a+=j("courts",n.courts),a+=j("scoringMode",n.scoringMode),a+=j("pointsPerMatch",n.pointsPerMatch,{label:qe()})),a+="</div>",t&&((l=n.preferredPartners)==null?void 0:l.length)>0){const i=n.preferredPartners.map(d=>{const c=n.players.find(m=>m.id===d.player1Id),u=n.players.find(m=>m.id===d.player2Id);return c&&u?`${c.name} & ${u.name}`:null}).filter(Boolean);i.length>0&&(a+=`
        <div class="config-pairs-section">
          <span class="config-pairs-label">Fixed Pairs:</span>
          <div class="config-pairs-list">
            ${i.map(d=>`<span class="config-pair-chip">${d}</span>`).join("")}
          </div>
          <button class="btn btn-ghost btn-sm" data-action="edit-pairs">Edit</button>
        </div>
      `)}else t&&(a+=`
      <div class="config-pairs-section config-pairs-empty">
        <button class="btn btn-dashed btn-sm" data-action="add-pair">+ Add Fixed Pair</button>
      </div>
    `);e.innerHTML=a}function fn(e,t,o){const s=o.options.find(r=>String(r.value)===String(t)),a=s?s.label:t;return`
    <div class="ui-select-wrapper" data-key="${e}" tabindex="0">
      <div class="ui-trigger">
        <span>${a}</span>
        <div class="ui-arrow"></div>
      </div>
      <div class="ui-options">
        ${o.options.map(r=>`<div class="ui-option ${String(r.value)===String(t)?"selected":""}" data-value="${r.value}">${r.label}</div>`).join("")}
      </div>
    </div>
  `}function yn(e,t,o){const s=o.min??1,a=o.max??99,r=Number.isFinite(t)?t:s,l=r<=s,i=r>=a,d=e==="pointsPerMatch"&&n.scoringMode!=="time"?2:1;return`
    <div class="ui-stepper" data-key="${e}" data-min="${s}" data-max="${a}">
      <button type="button" class="stepper-btn" data-delta="-${d}" ${l?"disabled":""} aria-label="Decrease ${e}">−</button>
      <input type="number" class="stepper-input" value="${r}" min="${s}" max="${a}" step="${d}" aria-label="${e} value">
      <button type="button" class="stepper-btn" data-delta="${d}" ${i?"disabled":""} aria-label="Increase ${e}">+</button>
    </div>
  `}function gn(e,t,o={}){const s=!!t,a=!!o.disabled;return`
    <div class="ui-toggle ${s?"active":""} ${a?"disabled":""}" 
         data-key="${e}" 
         role="switch" 
         aria-checked="${s}"
         tabindex="${a?"-1":"0"}">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  `}function Pe(e){var o;const t={...ht[e]};if(e==="courts"){const s=((o=n.players)==null?void 0:o.length)||0,a=Math.floor(s/4);t.max=Math.max(1,a)}return t}function j(e,t,o={}){const s=Pe(e),a=o.readonly,r=o.label??(s==null?void 0:s.label)??e;let l="";if(!s||a){let i=t;if(s&&s.options){const d=s.options.find(c=>c.value===t);d&&(i=d.label)}l=`<span class="config-value-static">${i}</span>`}else s.type==="select"?l=fn(e,t,s):s.type==="number"?l=yn(e,t,s):s.type==="toggle"?l=gn(e,t,o):l=`<span class="config-value">${t}</span>`;return`
    <div class="config-row ${(s==null?void 0:s.type)==="toggle"?"toggle-row":""}" data-config-key="${e}">
      <div class="config-label-container">
        <span class="config-label">${r}:</span>
        ${s!=null&&s.helpId?`<button class="config-help" data-action="show-help" data-help-id="${s.helpId}">?</button>`:""}
      </div>
      ${l}
    </div>
  `}function he(e,t){n[e]=t,S();const o=P();if(e==="format"&&o.format&&(o.format.value=t),e==="courts"&&o.courts&&(o.courts.value=t),e==="scoringMode"&&o.scoringMode){o.scoringMode.value=t;const s={time:10,race:14,total:28};n.pointsPerMatch=s[t]||28,o.points&&(o.points.value=n.pointsPerMatch)}e==="pointsPerMatch"&&o.points&&(o.points.value=t),e==="maxRepeats"&&o.maxRepeats&&(o.maxRepeats.value=t),e==="pairingStrategy"&&o.pairingStrategy&&(o.pairingStrategy.value=t,t==="optimal"&&(n.strictStrategy=!1)),e==="strictStrategy"&&document.getElementById("strictStrategy")&&(document.getElementById("strictStrategy").checked=t),V(),dn(()=>Promise.resolve().then(()=>zt),void 0).then(s=>s.renderPlayers&&s.renderPlayers())}function hn(e){e.dataset.listenersAttached||(e.dataset.listenersAttached="true",e.addEventListener("change",t=>{var s;const o=t.target;if(o.classList.contains("config-input")||o.classList.contains("stepper-input")){const a=o.closest(".ui-stepper"),r=o.dataset.key||(a==null?void 0:a.dataset.key);if(!r)return;const l=Pe(r),i=(l==null?void 0:l.min)??1,d=(l==null?void 0:l.max)??99;let c=parseInt(o.value,10);isNaN(c)&&(c=i),r==="courts"&&c>d&&Ce("Too many courts",`You need at least ${c*4} players to use ${c} courts. With ${((s=n.players)==null?void 0:s.length)||0} players, you can have a maximum of ${d} courts.`)}}),e.addEventListener("click",t=>{const o=t.target.closest(".stepper-btn");if(o){const d=o.closest(".ui-stepper"),c=d==null?void 0:d.dataset.key;if(!c)return;const u=Pe(c),m=parseInt(o.dataset.delta,10)||0,f=(u==null?void 0:u.min)??1,h=(u==null?void 0:u.max)??99,p=parseInt(n[c],10);if(m>0&&p>=h&&c==="courts"){Ce("Too many courts",`You need at least ${(p+1)*4} players to use ${p+1} courts.`);return}const y=Math.min(h,Math.max(f,(Number.isFinite(p)?p:f)+m));y!==p&&he(c,y);return}const s=t.target.closest(".ui-toggle");if(s&&!s.classList.contains("disabled")){const d=s.dataset.key,c=!n[d];he(d,c);return}const a=t.target.closest(".ui-select-wrapper");if(a&&!t.target.closest(".ui-option")){const d=a.classList.contains("open");if(document.querySelectorAll(".ui-select-wrapper.open").forEach(c=>{c.classList.remove("open");const u=c.querySelector(".ui-options");u&&(u.style.display="none"),c.closest(".config-row")&&(c.closest(".config-row").style.zIndex="")}),!d){a.classList.add("open");const c=a.querySelector(".ui-options");c&&(c.style.display="block"),a.closest(".config-row")&&(a.closest(".config-row").style.zIndex="100")}}const r=t.target.closest(".ui-option");if(r){const d=r.closest(".ui-select-wrapper"),c=r.dataset.value,u=d.dataset.key,m=ht[u];let f=c;(m.type==="number"||u==="courts"||u==="maxRepeats"||u==="pointsPerMatch")&&!isNaN(c)&&c.trim()!==""&&(f=parseInt(c)),he(u,f)}const l=t.target.closest("[data-action]");if(!l)return;const i=l.dataset.action;if(i==="show-help"){const d=l.dataset.helpId,c=document.getElementById(d);c&&c.click()}(i==="edit-pairs"||i==="add-pair")&&bn()}))}function vn(e){e.target.closest(".ui-select-wrapper")||document.querySelectorAll(".ui-select-wrapper.open").forEach(t=>{t.classList.remove("open");const o=t.querySelector(".ui-options");o&&(o.style.display="none"),t.closest(".config-row")&&(t.closest(".config-row").style.zIndex="")})}function bn(){n.preferredPartners||(n.preferredPartners=[]);const e=document.createElement("div");e.className="modal-overlay active";const t=(b,C)=>String(b)===String(C),o=b=>n.players.find(C=>t(C.id,b)),s=b=>n.preferredPartners.find(C=>t(C.id,b));let a=null,r=null;const l=`
    <style>
      .pair-modal-content { 
        max-width: 500px; width: 90%; 
        min-height: 420px;
        background: var(--bg-surface); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 2rem;
        display: flex; flex-direction: column;
      }
      .custom-select { position: relative; flex: 1; font-family: inherit; }
      .select-trigger { 
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 14px; 
        background: var(--input-bg); 
        border: 1px solid var(--border-color); 
        border-radius: 10px; cursor: pointer; 
        color: var(--text-muted); 
        transition: all 0.2s;
        font-size: 0.95rem; user-select: none;
      }
      .select-trigger.filled { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }
      .select-trigger:hover { background: var(--bg-card-hover); }
      .select-trigger.active { border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
      .select-arrow { transition: transform 0.2s; opacity: 0.5; }
      .select-trigger.active .select-arrow { transform: rotate(180deg); opacity: 1; }
      
      .select-options {
        position: absolute; top: calc(100% + 8px); left: 0; right: 0;
        background: var(--bg-surface); 
        border: 1px solid var(--border-color); 
        border-radius: 12px;
        max-height: 240px; overflow-y: auto; z-index: 100; display: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); padding: 4px;
        -webkit-overflow-scrolling: touch;
      }
      .select-options.open { display: block; animation: slideDown 0.15s ease-out; }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      
      .option { 
        padding: 12px 14px; cursor: pointer; border-radius: 0; 
        color: var(--text-secondary);
        display: flex; align-items: center; font-size: 0.95rem;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .option:last-child { border-bottom: none; }
      .option:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); }
      .option.selected { color: #3B82F6; background: rgba(59, 130, 246, 0.1); }
      .option.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; text-decoration: line-through; }
      
      .add-action-btn {
        padding: 0 20px; height: 44px; border-radius: 10px; border: none;
        font-weight: 600; cursor: pointer; transition: 0.2s;
        background: #3f3f46; color: #71717a;
      }
      .add-action-btn.ready { background: #3B82F6; color: #fff; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
      .add-action-btn.ready:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); }

      .pair-list-clean { 
        margin-top: 1rem; max-height: 300px; overflow-y: auto; padding-right: 4px;
        -webkit-overflow-scrolling: touch;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .pair-item-clean { 
        display: flex; justify-content: space-between; align-items: center; 
        padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.1); 
      }
      .pair-names { font-size: 1rem; color: #fff; font-weight: 500; }
      .pair-remove-icon { 
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        color: #71717a; cursor: pointer; border-radius: 50%; transition: 0.2s;
      }
      .pair-remove-icon:hover { color: #fff; background: rgba(255, 80, 80, 0.8); }

      .btn-text { 
        background: rgba(59, 130, 246, 0.1); 
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: var(--accent-light) !important; 
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
        scrollbar-color: rgba(255,255,255,0.25) transparent;
      }
      .pair-list-clean::-webkit-scrollbar,
      .select-options::-webkit-scrollbar { width: 10px; }
      .pair-list-clean::-webkit-scrollbar-thumb,
      .select-options::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.18);
        border-radius: 999px;
      }
      .pair-list-clean::-webkit-scrollbar-thumb:hover,
      .select-options::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.28);
      }
    </style>
  `;e.innerHTML=`
    ${l}
    <div class="modal-content pair-modal-content">
      <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">Manage Fixed Pairs</h3>
      <p style="color: #a1a1aa; margin-bottom: 2rem;">Select two players to pair together consistently.</p>
      
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 2rem;">
        <div class="custom-select" id="sel1"></div>
        <span style="color: #71717a; font-weight: bold;">&</span>
        <div class="custom-select" id="sel2"></div>
        <button class="add-action-btn" id="addBtn">Add</button>
      </div>

      <div class="pair-list-clean" id="pairsList" style="flex: 1; min-height: 150px;"></div>
      
      <div style="margin-top: auto; padding-top: 1.5rem; display: flex; justify-content: flex-end;">
        <button class="btn-text" id="closePairsModal" style="color:#a1a1aa;">Done</button>
      </div>
    </div>
  `,document.body.appendChild(e);const i=b=>{b.key==="Escape"&&c()};document.addEventListener("keydown",i);const d=()=>document.removeEventListener("keydown",i),c=()=>{d(),e.remove()},u=e.querySelector("#sel1"),m=e.querySelector("#sel2"),f=e.querySelector("#addBtn"),h=e.querySelector("#pairsList"),p=(b,C,z)=>{const k=n.players.find(B=>t(B.id,C)),g=k?k.name:z;let w=`
      <div class="select-trigger ${!!k?"filled":""}">
        <span>${g}</span>
        <span class="select-arrow">▼</span>
      </div>
      <div class="select-options">
    `;const E=new Set;n.preferredPartners.forEach(B=>{B.player1Id&&E.add(String(B.player1Id)),B.player2Id&&E.add(String(B.player2Id))}),n.players.forEach(B=>{const A=String(B.id),J=t(B.id,C);if(E.has(A)&&!J)return;const I=b.id==="sel1"&&t(B.id,r)||b.id==="sel2"&&t(B.id,a);w+=`<div class="option ${J?"selected":""} ${I?"disabled":""}" data-val="${B.id}">${B.name}</div>`}),w+="</div>",b.innerHTML=w},y=()=>{if(n.preferredPartners.length===0){h.innerHTML='<div style="text-align: center; padding: 2rem; color: #52525b;">No fixed pairs yet</div>';return}h.innerHTML=n.preferredPartners.map(b=>{const C=n.players.find(k=>t(k.id,b.player1Id)),z=n.players.find(k=>t(k.id,b.player2Id));return!C||!z?"":`
        <div class="pair-item-clean">
          <span class="pair-names">${C.name} & ${z.name}</span>
          <div class="pair-remove-icon" data-remove="${String(b.id)}">✕</div>
        </div>
      `}).join("")},v=()=>{p(u,a,"Select Player 1"),p(m,r,"Select Player 2"),y(),a&&r&&!t(a,r)?(f.classList.add("ready"),f.disabled=!1):(f.classList.remove("ready"),f.disabled=!0)};v(),e.addEventListener("click",b=>{if(b.target===e||b.target.id==="closePairsModal"){c();return}b.target.closest(".custom-select")||(e.querySelectorAll(".select-options").forEach(g=>g.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(g=>g.classList.remove("active")));const C=b.target.closest(".select-trigger");if(C){const x=C.parentElement.querySelector(".select-options"),w=x.classList.contains("open");e.querySelectorAll(".select-options").forEach(E=>E.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(E=>E.classList.remove("active")),w||(x.classList.add("open"),C.classList.add("active"))}const z=b.target.closest(".option");if(z){const g=z.dataset.val,x=o(g);if(x){const w=z.closest(".custom-select").id;w==="sel1"&&(a=x.id),w==="sel2"&&(r=x.id),v(),e.querySelectorAll(".select-options").forEach(E=>E.classList.remove("open")),e.querySelectorAll(".select-trigger").forEach(E=>E.classList.remove("active"))}}if(b.target.closest("#addBtn")&&!f.disabled){if(n.preferredPartners.some(w=>t(w.player1Id,a)&&t(w.player2Id,r)||t(w.player1Id,r)&&t(w.player2Id,a))){alert("Pair already exists");return}if(n.preferredPartners.some(w=>t(w.player1Id,a)||t(w.player2Id,a)||t(w.player1Id,r)||t(w.player2Id,r))&&!confirm("One of these players is already in another pair. Create anyway?"))return;n.preferredPartners.push({id:ae(),player1Id:a,player2Id:r}),S(),a=null,r=null,v(),V()}const k=b.target.closest(".pair-remove-icon");if(k){const g=k.dataset.remove,x=s(g);x&&(ke(x.id),v(),V())}})}document.addEventListener("click",vn);const Me="padel_history_v1";function xn(){var s;const e=re(),t=Rt(),o={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((s=t.leaderboard[0])==null?void 0:s.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(o),e.length>20&&e.pop(),localStorage.setItem(Me,JSON.stringify(e)),o}function re(){try{const e=localStorage.getItem(Me);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function wn(e){F("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const o=re().filter(s=>s.id!==e);localStorage.setItem(Me,JSON.stringify(o)),vt(),L("Tournament deleted")},!0)}function Sn(e){const o=re().find(s=>s.id===e);if(!o){L("Tournament details not found","error");return}F("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{He(o.data),U(),H(),S(),L("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(s){console.error("Failed to load tournament",s),L("Error loading tournament","error")}},!1)}let me=[];function Cn(){vt();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const o=t.target.value.toLowerCase();Ln(o)})}function Ln(e){if(!e){Be(me);return}const t=me.filter(o=>{var u,m,f,h,p,y,v,b;const s=(((u=o.summary)==null?void 0:u.winner)||((f=(m=o.players)==null?void 0:m[0])==null?void 0:f.name)||"").toLowerCase(),a=(((h=o.summary)==null?void 0:h.format)||o.format||"").toLowerCase(),r=((p=o.summary)==null?void 0:p.date)||o.date||"",l=String(((y=o.summary)==null?void 0:y.playerCount)||((v=o.players)==null?void 0:v.length)||""),i=String(((b=o.summary)==null?void 0:b.roundCount)||""),c=new Date(r).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return s.includes(e)||a.includes(e)||c.includes(e)||l.includes(e)||i.includes(e)});Be(t)}function vt(){me=re(),Be(me)}function Be(e){const t=document.getElementById("historyTableBody"),o=document.getElementById("historyEmptyStatePage");if(!(!t||!o)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",o.innerHTML=`
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn btn-primary">
        Start a Tournament
      </button>
    `,o.style.display="block";return}t.parentElement.style.display="table",o.style.display="none",window.deleteHistoryItem=wn,window.loadTournament=Sn,window.downloadHistoryItem=En,t.innerHTML=e.map(s=>{var f,h,p;const a=s.summary?s.summary.date:s.date,r=s.summary?s.summary.format:s.format||"Unknown",l=s.summary?s.summary.winner:((h=(f=s.players)==null?void 0:f[0])==null?void 0:h.name)||"Unknown",i=s.summary?s.summary.playerCount:((p=s.players)==null?void 0:p.length)||0,d=new Date(a),c=d.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),u=d.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),m=!!s.data;return`
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
            <span class="winner-name">${l}</span>
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
      `}).join("")}}function En(e){const o=re().find(s=>s.id===e);o&&o.data&&window.exportTournamentData&&window.exportTournamentData(o.data)}document.addEventListener("DOMContentLoaded",()=>{});function In(e,t){let o;const s=document.getElementById(e),a=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;window.addEventListener("beforeinstallprompt",l=>{l.preventDefault(),o=l,s&&(s.style.display="inline-flex",s.addEventListener("click",async()=>{s.style.display="none",o.prompt(),(await o.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),o=null}))}),a&&!r&&s&&t&&(s.style.display="inline-flex",s.addEventListener("click",()=>{t()})),window.addEventListener("appinstalled",()=>{s&&(s.style.display="none"),o=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function Pn(){Bt({activeLink:"tournament"}),In("installBtn",()=>{ne("Install App on iPhone",`
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `)}),$t();const e=je();Tt(),e.format.value=n.format,e.courts.value=n.courts,e.scoringMode.value=n.scoringMode,e.points.value=n.pointsPerMatch,e.courtFormat.value=n.courtFormat,e.maxRepeats.value=n.maxRepeats,e.pairingStrategy&&(e.pairingStrategy.value=n.pairingStrategy);const t=document.getElementById("rankingCriteria");t&&(t.value=n.rankingCriteria);const o=document.getElementById("strictStrategy");if(o&&(o.checked=n.strictStrategy||!1),Ve(),tn(V),_(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const s=document.getElementById("tournamentActionsSection");s&&(s.style.display="block"),U(),H(),fe()}Mn(e),oe(),Tn(),Cn(),window.addEventListener("resize",Xe),kn(),D(),Ge(),V(),Bn(),$n()}function Bn(){document.addEventListener("click",e=>{const t=e.target.closest(".btn");if(!t)return;const o=t.getBoundingClientRect(),s=document.createElement("span");s.className="ripple",s.style.width=s.style.height=`${Math.max(o.width,o.height)}px`,s.style.left=`${e.clientX-o.left-s.offsetWidth/2}px`,s.style.top=`${e.clientY-o.top-s.offsetHeight/2}px`,t.appendChild(s),setTimeout(()=>s.remove(),600)})}function $n(){const e=document.querySelectorAll(".section-title, .card-header-basic h3, .card-header-advanced h3, .leaderboard-header h3, .players-header h3");e.forEach(o=>o.classList.add("animate-in"));const t=new IntersectionObserver(o=>{o.forEach(s=>{s.isIntersecting&&s.target.classList.add("animate-in")})},{threshold:.1});e.forEach(o=>t.observe(o))}function kn(){const e=document.getElementById("scrollTopBtn");e&&(window.addEventListener("scroll",()=>{window.scrollY>400?e.classList.add("visible"):e.classList.remove("visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function Mn(e){const t=document.getElementById("undoBtn");t&&(t.addEventListener("click",()=>{if(Mt())if(L("Undo successful"),e.format.value=n.format,_(),U(),H(),D(),fe(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="none")}}),document.addEventListener("keydown",u=>{(u.ctrlKey||u.metaKey)&&u.key==="z"&&!u.shiftKey&&(u.preventDefault(),t.click())})),e.addPlayerBtn.addEventListener("click",_e),e.cancelAddBtn.addEventListener("click",xe),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{cn(()=>{_(),X(),D()})}),e.importPlayersBtn.addEventListener("click",Ye),e.closeImportModal.addEventListener("click",de),e.cancelImportBtn.addEventListener("click",de),e.confirmImportBtn.addEventListener("click",()=>{const u=e.importTextarea.value,m=un(u);let f=`Added ${m.added} players.`;m.duplicates>0&&(f+=` Skipped ${m.duplicates} duplicates.`),m.hitLimit&&(f+=" Stopped at 24 max limit."),e.importStatus.textContent=f,_(),m.added>0&&m.duplicates===0&&!m.hitLimit&&(setTimeout(de,1500),L(`Imported ${m.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{De(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),_())}),e.playerNameInput.addEventListener("keydown",u=>{u.key==="Enter"?De(e.playerNameInput.value)&&(e.playerNameInput.value="",_()):u.key==="Escape"&&xe()}),e.format.addEventListener("change",()=>{n.format=e.format.value,D(),S(),n.schedule.length>0&&ce()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),S(),V(),n.schedule.length>0&&ce(),n.courtFormat==="custom"&&be()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),S(),V(),n.schedule.length>0&&U()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,Ge(),S(),V(),n.schedule.length>0&&U()});const o=document.getElementById("rankingCriteria");o&&o.addEventListener("change",()=>{n.rankingCriteria=o.value,et(),S()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Ve(),S()}),e.courts.addEventListener("input",()=>{const m=e.courts.value;if(m==="")return;let f=parseInt(m)||1;f=Math.max(1,Math.min(50,f)),!n.isLocked&&(e.courts.value=f,n.courts=f,S(),n.courtFormat==="custom"&&be(),n.schedule.length>0&&ce())}),e.maxRepeats.addEventListener("change",u=>{const m=parseInt(u.target.value),f=n.maxRepeats;n.isLocked?(u.target.value=f,F("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=m,e.maxRepeats.value=m,S(),V(),L("Max Partner Repeats updated")},!0)):(n.maxRepeats=m,S(),V())});const s=document.getElementById("strictStrategy");s&&s.addEventListener("change",u=>{if(n.pairingStrategy==="optimal"){u.target.checked=!1,L("Strict Pattern is not available with Optimal pairing","info");return}const m=u.target.checked,f=n.strictStrategy;n.isLocked?(u.target.checked=!!f,F("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=m,s.checked=m,S(),L("Strict Mode updated")},!0)):(n.strictStrategy=m,S())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",u=>{const m=u.target.value,f=n.pairingStrategy;if(n.isLocked)u.target.value=f,F("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{if(n.pairingStrategy=m,e.pairingStrategy.value=m,m==="optimal"){n.strictStrategy=!1;const h=document.getElementById("strictStrategy");h&&(h.checked=!1)}S(),D(),L("Pairing Strategy updated")},!0);else{if(n.pairingStrategy=m,m==="optimal"){n.strictStrategy=!1;const h=document.getElementById("strictStrategy");h&&(h.checked=!1)}S(),D()}}),e.addPartnerPairBtn.addEventListener("click",()=>{if(yt().length<2){L("Not enough available players to form a pair","error");return}pn(),X(),D(),oe()});const a=document.getElementById("helpFormat");a&&a.addEventListener("click",()=>{ne("Tournament Formats",`
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
        `)});const r=document.getElementById("helpScoring");r&&r.addEventListener("click",()=>{ne("Scoring Modes",`
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
        `)});const l=document.getElementById("helpMatchup");l&&l.addEventListener("click",()=>{ne("Matchup Rules",`
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
        `)});const i=document.getElementById("helpLeaderboard");i&&i.addEventListener("click",()=>{ne("Leaderboard",`
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
        `)}),e.generateBtn.addEventListener("click",nn),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",on),e.gridColumns&&e.gridColumns.addEventListener("input",Ft),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),Je(),S()});const d=document.getElementById("factoryResetBtn");d&&d.addEventListener("click",()=>{F("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const c=document.getElementById("roundScale");c&&c.addEventListener("input",Ot)}function Tn(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const o=t.dataset.action,s=t.dataset.id?Number(t.dataset.id):null,a=t.dataset.round?parseInt(t.dataset.round):null;switch(o){case"remove-player":s!==null&&(ft(s),_());break;case"toggle-player-list":$e();break;case"remove-pair":s!==null&&(ke(s),X(),D(),oe());break;case"toggle-bye":s!==null&&ut(s);break;case"toggle-round":a!==null&&ct(a);break;case"complete-round":mt();break;case"edit-round":a!==null&&pt(a);break;case"toggle-visibility":Qe();break;case"toggle-position":Ze();break;case"end-tournament":at(ot);break;case"toggle-toolbar":rt();break;case"export-data":it();break;case"share-results":lt();break;case"add-late-player":bt();break}}),document.addEventListener("change",e=>{const t=e.target.closest("[data-action]");if(!t)return;const o=t.dataset.action,s=t.dataset.pairId?Number(t.dataset.pairId):null,a=t.dataset.which?parseInt(t.dataset.which):null;if(o==="update-partner"&&s!==null&&a!==null&&(gt(s,a,Number(t.value)),X(),D(),oe()),o==="autofill-score"&&n.scoringMode==="race"){const r=parseInt(t.dataset.round),l=parseInt(t.dataset.match),i=parseInt(t.dataset.team),d=t.value;Ie(r,l,i,d)}}),document.addEventListener("input",e=>{e.target.classList.contains("score-input")&&e.target.value.length>2&&(e.target.value=e.target.value.slice(0,2))}),document.addEventListener("input",e=>{const t=e.target.closest('[data-action="autofill-score"]');if(!t||n.scoringMode==="race")return;const o=parseInt(t.dataset.round),s=parseInt(t.dataset.match),a=parseInt(t.dataset.team),r=t.value;Ie(o,s,a,r)})}function bt(){const e=n.format==="team"||n.format==="teamMexicano";nt(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,L("Switched to Mexicano format")}mn(t.trim());const o=document.getElementById("playerCount");o&&(o.textContent=`(${n.players.length})`),H(),L(`Added ${t.trim()} to tournament`)}})}window.removePlayer=e=>{ft(e),_()};window.togglePlayerList=$e;window.updatePreferredPair=(e,t,o)=>{gt(e,t,o),X()};window.removePreferredPair=e=>{ke(e),X()};window.updateCustomCourtName=At;window.autoFillScore=Ie;window.toggleManualBye=ut;window.toggleRoundCollapse=ct;window.completeRound=mt;window.editRound=pt;window.toggleLeaderboardVisibility=Qe;window.togglePositionChanges=Ze;window.updateRankingCriteria=et;window.updateSetupUI=D;window.endTournament=()=>at(ot);window.validateCourts=We;window.toggleToolbar=rt;window.exportTournamentData=it;window.shareResults=lt;window.promptAddLatePlayer=bt;Pn();
