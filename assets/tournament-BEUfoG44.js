import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},V=[],je=20;function se(){const e=JSON.parse(JSON.stringify(n));V.push(e),V.length>je&&V.shift()}function Ue(){if(V.length===0)return!1;const e=V.pop();return Be(e),!0}function Ve(){return V.length>0}const Le="tournament-state";function v(){localStorage.setItem(Le,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function Ye(){const e=localStorage.getItem(Le);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function _e(){return JSON.parse(JSON.stringify(n))}function Be(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],v())}function te(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function b(e,t=3e3){const s=document.querySelector(".toast");s&&s.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10),setTimeout(()=>{o.classList.remove("visible"),setTimeout(()=>o.remove(),300)},t)}function ae(){return Date.now()+Math.random()}let x,M,N,F,Y=[],ce,J=!1;const Se=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Ce(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function Ge(){this.x=Math.random()*N,this.y=Math.random()*F-F,this.r=Ce(10,30),this.d=Math.random()*150+10,this.color=Se[Ce(0,Se.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return M.beginPath(),M.lineWidth=this.r/2,M.strokeStyle=this.color,M.moveTo(this.x+this.tilt+this.r/4,this.y),M.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),M.stroke()}}function Pe(){if(J){M.clearRect(0,0,N,F);for(let e=0;e<Y.length;e++)Y[e].draw();Xe(),ce=requestAnimationFrame(Pe)}}function Xe(){for(let e=0;e<Y.length;e++){const t=Y[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>N+20||t.x<-20||t.y>F)&&J&&(t.x=Math.random()*N,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Je(){if(!J){x||(x=document.createElement("canvas"),x.id="confetti-canvas",x.style.position="fixed",x.style.top="0",x.style.left="0",x.style.width="100%",x.style.height="100%",x.style.pointerEvents="none",x.style.zIndex="9999",document.body.appendChild(x),M=x.getContext("2d")),N=window.innerWidth,F=window.innerHeight,x.width=N,x.height=F,window.addEventListener("resize",()=>{N=window.innerWidth,F=window.innerHeight,x.width=N,x.height=F}),J=!0,Y=[];for(let e=0;e<150;e++)Y.push(new Ge);Pe()}}function Ke(){J=!1,M&&M.clearRect(0,0,N,F),ce&&cancelAnimationFrame(ce),x&&x.remove(),x=null}function Qe(){Je(),setTimeout(Ke,5e3)}function k(e,t,s="Confirm",o,r=!1,a=null,d=null){const l=document.querySelector(".confirm-modal");l&&l.remove();const i=document.createElement("div");i.className="modal-overlay confirm-modal",i.style.display="flex";const m=r?"btn btn-danger":"btn btn-primary";i.innerHTML=`
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
          <button class="${m}" id="modalConfirmBtn" style="flex: 1;">${s}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(i),setTimeout(()=>i.classList.add("visible"),10);const u=i.querySelector(".modal");u&&u.addEventListener("click",p=>p.stopPropagation());const c=i.querySelector("#modalCancelBtn"),y=i.querySelector("#modalConfirmBtn"),f=i.querySelector("#modalSecondaryBtn"),h=()=>i.remove();c&&c.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),h()}),y&&y.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),h(),o()}),f&&d&&f.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),h(),d()}),i.addEventListener("click",p=>{p.target===i&&h()})}function $e(e,t,s){const o=document.querySelector(".input-modal");o&&o.remove();const r=document.createElement("div");r.className="modal-overlay input-modal",r.style.display="flex",r.innerHTML=`
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
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("visible"),10);const a=r.querySelector("#modalInput"),d=r.querySelector("#modalCancelBtn"),l=r.querySelector("#modalConfirmBtn"),i=()=>r.remove();d.onclick=i;const m=()=>{const u=a.value;u&&u.trim()&&(i(),s(u.trim()))};l.onclick=m,a.onkeydown=u=>{u.key==="Enter"&&m(),u.key==="Escape"&&i()},setTimeout(()=>a.focus(),100)}function Ze(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=r=>r===0?"🥇":r===1?"🥈":r===2?"🥉":`${r+1}.`,o=document.createElement("div");o.className="final-modal",o.innerHTML=`
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
  `,document.body.appendChild(o),Qe(),setTimeout(()=>o.classList.add("visible"),10)}function et(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function tt(e,t,s){const o=document.querySelector(".alert-modal");o&&o.remove();const r=document.createElement("div");r.className="modal-overlay alert-modal",r.style.display="flex",r.innerHTML=`
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
  `,document.body.appendChild(r),setTimeout(()=>r.classList.add("visible"),10);const a=r.querySelector(".modal");a&&a.addEventListener("click",i=>i.stopPropagation());const d=r.querySelector("#modalOkBtn"),l=()=>{r.remove()};d&&d.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),l()}),r.addEventListener("click",i=>{i.target===r&&l()}),r.addEventListener("click",i=>{i.target===r&&l()})}function le(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay info-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const r=o.querySelector(".modal");r&&r.addEventListener("click",i=>i.stopPropagation());const a=o.querySelector("#modalOkBtn"),d=o.querySelector("#modalCloseX"),l=()=>o.remove();a&&(a.onclick=l),d&&(d.onclick=l),o.addEventListener("click",i=>{i.target===o&&l()})}window.closeFinalModal=et;function nt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,r=[],a=e[0],d=e.slice(1);for(let l=0;l<o-1;l++){const i=[a,...d],m=[];for(let p=0;p<o/2;p++){const w=i[p],R=i[o-1-p];!w.isBye&&!R.isBye&&m.push([w,R])}const u=[],c=new Set;for(let p=0;p<m.length-1;p+=2)m[p]&&m[p+1]&&(u.push({court:Math.floor(p/2)+1,team1:m[p],team2:m[p+1]}),m[p].forEach(w=>c.add(w.id)),m[p+1].forEach(w=>c.add(w.id)));const y=u.slice(0,s),f=new Set;y.forEach(p=>{p.team1.forEach(w=>f.add(w.id)),p.team2.forEach(w=>f.add(w.id))});const h=n.players.filter(p=>!p.isBye&&!f.has(p.id));y.length>0&&r.push({number:r.length+1,matches:y,byes:h}),d.unshift(d.pop())}return r}function ot(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,r=[],a=e[0],d=e.slice(1);for(let l=0;l<o-1;l++){const i=[a,...d],m=[],u=new Set;for(let h=0;h<o/2;h++){const p=i[h],w=i[o-1-h];!p.isBye&&!w.isBye&&(m.push({court:m.length+1,team1:[p],team2:[w]}),u.add(p.id),u.add(w.id))}const c=m.slice(0,s),y=new Set;c.forEach(h=>{h.team1.forEach(p=>y.add(p.id)),h.team2.forEach(p=>y.add(p.id))});const f=n.players.filter(h=>!h.isBye&&!y.has(h.id));c.length>0&&r.push({number:r.length+1,matches:c,byes:f}),d.unshift(d.pop())}return r}function st(){const e=[...n.players];te(e);const t=n.courts,s=[],o=new Set;for(let a=0;a<e.length-1&&s.length<t;a+=2)s.push({court:s.length+1,team1:[e[a]],team2:[e[a+1]]}),o.add(e[a].id),o.add(e[a+1].id);const r=e.filter(a=>!o.has(a.id));return[{number:1,matches:s,byes:r}]}function at(){const e=[...n.leaderboard].sort((l,i)=>i.points-l.points),t=n.courts,s=e.filter(l=>!n.manualByes.includes(l.id)),o=e.filter(l=>n.manualByes.includes(l.id)),r=[],a=new Set;for(let l=0;l<s.length-1&&r.length<t;l+=2)r.push({court:r.length+1,team1:[s[l]],team2:[s[l+1]]}),a.add(s[l].id),a.add(s[l+1].id);const d=[...o,...s.filter(l=>!a.has(l.id))];return{number:n.schedule.length+1,matches:r,byes:d}}function rt(){const e=n.courts,t=e*4,s=[],o=new Set,r=[...n.players],a=[];r.forEach(c=>{if(o.has(c.id))return;const y=Ie(c.id);if(y){const f=r.find(h=>h.id===y);f?(s.push({type:"pair",players:[c,f]}),o.add(f.id)):s.push({type:"single",players:[c]})}else s.push({type:"single",players:[c]});o.add(c.id)}),te(s);const d=[];let l=0;for(const c of s)l+c.players.length<=t?(d.push(c),l+=c.players.length):a.push(...c.players);const i=[],m=[];d.forEach(c=>{c.type==="pair"?i.push(c.players):m.push(c.players[0])}),te(m);for(let c=0;c<m.length-1;c+=2)i.push([m[c],m[c+1]]);te(i);const u=[];for(let c=0;c<i.length-1&&u.length<e;c+=2)u.push({court:u.length+1,team1:i[c],team2:i[c+1]});return i.length%2!==0&&u.length<i.length/2&&a.push(...i[i.length-1]),[{number:1,matches:u,byes:a}]}function Ie(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function it(e){const t=n.courts,s=t*4,o=new Set(n.manualByes),r=[],a=new Set,d=[...e];d.forEach(g=>{if(a.has(g.id)||o.has(g.id))return;const C=Ie(g.id);if(C){const E=d.find(P=>P.id===C);E?o.has(E.id)?r.push({type:"single",players:[g]}):(r.push({type:"pair",players:[g,E]}),a.add(E.id)):r.push({type:"single",players:[g]})}else r.push({type:"single",players:[g]});a.add(g.id)}),r.sort((g,C)=>{const E=$=>{const q=$.players.reduce((B,I)=>B+(I.byeCount||0),0),_=$.players.reduce((B,I)=>B+(I.played||0),0);return{bye:q/$.players.length,play:_/$.players.length}},P=E(g),H=E(C);return Math.abs(H.bye-P.bye)>.1?H.bye-P.bye:P.play-H.play});const l=[],i=[];let m=0;for(const g of r)m+g.players.length<=s&&(i.push(g),l.push(...g.players),m+=g.players.length);const u=new Set(l.map(g=>g.id)),c=d.filter(g=>!u.has(g.id)),y=[],f=[];i.forEach(g=>{g.type==="pair"?y.push(g.players):f.push(g.players[0])}),f.sort((g,C)=>C.points-g.points);let h=0;for(;h<f.length-3;h+=4){const g=f[h],C=f[h+1],E=f[h+2],P=f[h+3],H=[{name:"oneThree",team1:[g,E],team2:[C,P]},{name:"oneTwo",team1:[g,C],team2:[E,P]},{name:"oneFour",team1:[g,P],team2:[C,E]}];let $;if(n.pairingStrategy==="optimal"||!n.strictStrategy){const q=H.map(B=>{let I=0;const He=B.team1[0].id,qe=B.team1[1].id,Oe=B.team2[0].id,We=B.team2[1].id,ye=(G,X)=>{const ee=e.find(W=>W.id===G);let re=0;ee!=null&&ee.playedWith&&(re+=ee.playedWith.filter(W=>W===X).length);const fe=n.maxRepeats!==void 0?n.maxRepeats:99;if(fe<99&&n.schedule&&n.schedule.length>0){let W=0;for(let ie=n.schedule.length-1;ie>=0;ie--){const ge=n.schedule[ie];if(!ge.completed)continue;if(ge.matches.some(D=>{var he,ve,be,we;return D.team1[0].id===G&&((he=D.team1[1])==null?void 0:he.id)===X||D.team1[0].id===X&&((ve=D.team1[1])==null?void 0:ve.id)===G||D.team2[0].id===G&&((be=D.team2[1])==null?void 0:be.id)===X||D.team2[0].id===X&&((we=D.team2[1])==null?void 0:we.id)===G}))W++;else break}W>fe&&(re+=1e3)}return re};return I+=ye(He,qe),I+=ye(Oe,We),{...B,score:I}}),_=[...q].sort((B,I)=>B.score-I.score)[0];if(n.pairingStrategy==="optimal")$=_;else{const B=q.find(I=>I.name===n.pairingStrategy)||q[0];!n.strictStrategy&&B.score>=1e3&&_.score<1e3?$=_:$=B}}else $=H.find(q=>q.name===n.pairingStrategy)||H[0];y.push($.team1),y.push($.team2)}h<f.length-1&&y.push([f[h],f[h+1]]);const p=y.map(g=>({players:g,points:g.reduce((C,E)=>C+E.points,0)}));p.sort((g,C)=>C.points-g.points);const w=[],R=new Set;for(let g=0;g<p.length-1&&w.length<t;g+=2){const C=p[g],E=p[g+1];w.push({court:w.length+1,team1:C.players,team2:E.players}),C.players.forEach(P=>R.add(P.id)),E.players.forEach(P=>R.add(P.id))}return p.forEach(g=>{g.players.some(C=>R.has(C.id))||g.players.forEach(C=>c.push(C))}),{number:n.schedule.length+1,matches:w,byes:c}}function j(e,t,s,o,r,a=null){const d=n.leaderboard.find(l=>l.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+s,o?d.wins=(d.wins||0)+1:r||(d.losses=(d.losses||0)+1),a&&!d.playedWith&&(d.playedWith=[]),a&&d.playedWith.push(a))}function U(e,t,s,o,r){const a=n.leaderboard.find(d=>d.id===e);a&&(a.points-=t,a.played-=1,a.pointsLost=(a.pointsLost||0)-s,o?a.wins=(a.wins||0)-1:r||(a.losses=(a.losses||0)-1),a.played<0&&(a.played=0),a.points<0&&(a.points=0),a.wins<0&&(a.wins=0),a.losses<0&&(a.losses=0),a.pointsLost<0&&(a.pointsLost=0))}class lt{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),o=t%60;return`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const o=this.audioContext.createOscillator(),r=this.audioContext.createGain();o.type="sine",o.frequency.value=t,o.connect(r),r.connect(this.audioContext.destination),o.start(),r.gain.setValueAtTime(.1,this.audioContext.currentTime),r.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),o.stop(this.audioContext.currentTime+s)}catch(o){console.warn("Audio play failed",o)}}}let ne=null,L=null;function Me(){return ne={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn")},ne}function S(){return ne||Me(),ne}function dt(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function ke(){var l;const e=S(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const o=parseInt(t.value)||1,r=((l=e.format)==null?void 0:l.value)||n.format,a=r==="team"||r==="teamMexicano"?2:4,d=Math.floor(n.players.length/a);return t.max=Math.max(1,d),o>d&&d>0?(s.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(s.textContent=`⚠️ Need at least ${a} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function Te(){const e=S(),t=n.courtFormat==="custom";e.customCourtNamesSection.style.display=t?"block":"none",t&&Re()}function Re(){const e=S(),t=n.courts||2;for(;n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,o)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${n.customCourtNames[o]||`Court ${o+1}`}"
             onchange="window.updateCustomCourtName(${o}, this.value)"
             placeholder="Court ${o+1}">
    </div>
  `).join("")}function ct(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,v()}function O(){const e=S();e.playerList.innerHTML=n.players.map((t,s)=>`
    <li class="player-item" data-id="${t.id}">
      <span><span class="player-number">${s+1}.</span> ${t.name}</span>
      <button class="player-remove" onclick="window.removePlayer(${t.id})">×</button>
    </li>
  `).join(""),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4?(e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"):(e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color=""),K(),yt(),pt(),ke()}function ut(){const e=S();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function xe(){const e=S();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function mt(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function pt(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function yt(){const e=S(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)});const s=n.players.filter(o=>!t.has(o.id));e.addPartnerPairBtn.disabled=s.length<2}function K(){const e=S(),t=s=>{const o=new Set;return n.preferredPartners.forEach(r=>{r.id!==s&&(o.add(r.player1Id),o.add(r.player2Id))}),o};e.preferredPartnersList.innerHTML=n.preferredPartners.map(s=>{const o=t(s.id),r=n.players.filter(l=>l.id===s.player1Id||l.id===s.player2Id||!o.has(l.id)),a=r.filter(l=>l.id!==s.player2Id||l.id===s.player1Id),d=r.filter(l=>l.id!==s.player1Id||l.id===s.player2Id);return`
        <div class="partner-pair" data-pair-id="${s.id}">
          <select class="form-select" onchange="window.updatePreferredPair(${s.id}, 1, parseInt(this.value))">
            ${a.map(l=>`<option value="${l.id}" ${l.id===s.player1Id?"selected":""}>${l.name}</option>`).join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" onchange="window.updatePreferredPair(${s.id}, 2, parseInt(this.value))">
            ${d.map(l=>`<option value="${l.id}" ${l.id===s.player2Id?"selected":""}>${l.name}</option>`).join("")}
          </select>
          <button class="remove-pair-btn" onclick="window.removePreferredPair(${s.id})">Remove</button>
        </div>
      `}).join("")}function ft(){const e=S();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function de(){const e=S();e.importModal.style.display="none"}function gt(){const e=S();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",L&&(L.pause(),L=null);return}if(e.matchTimerContainer.style.display="flex",L)L.duration!==n.pointsPerMatch&&L.setDuration(n.pointsPerMatch);else{L=new lt({duration:n.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed")):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!")}}),e.timerDisplay.textContent=L.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>L.start(),e.timerPauseBtn.onclick=()=>L.pause(),e.timerResetBtn.onclick=()=>L.reset(),e.timerAddBtn.onclick=()=>L.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>L.addTime(-60));const t=()=>{const s=()=>{$e("Set Timer Duration","Enter minutes (e.g. 12)",o=>{const r=parseInt(o);r>0?(n.pointsPerMatch=r,v(),L.setDuration(r),b(`Timer set to ${r} minutes`)):b("Invalid minutes","error")})};L.isRunning?k("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{L.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function z(){const e=S();gt();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((s,o)=>{const r=o===t,a=s.completed,d=a&&!r,l=a?s.matches.map(i=>`${i.score1}-${i.score2}`).join(" · "):"";return`
    <div class="round ${a?"completed":""} ${d?"collapsed":""}" 
         id="round-${o}" 
         data-round="${o}">
      <div class="round-header" onclick="window.toggleRoundCollapse(${o})">
        <span class="round-title">
          Round ${s.number} ${a?"(done)":""}
        </span>
        ${d?`<span class="round-summary">${l}</span>`:""}
        ${a?`<span class="collapse-icon">${d?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${s.matches.map((i,m)=>`
            <div class="match-card">
              <div class="court-label">${dt(i.court)}</div>
              <div class="match-info-sub" style="font-size: 0.8em; color: var(--text-secondary); margin-bottom: 4px;">
                ${n.scoringMode==="total"?`Total ${n.pointsPerMatch}`:n.scoringMode==="race"?`Race to ${n.pointsPerMatch}`:`${n.pointsPerMatch} mins`}
              </div>
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
              ${a?`
              <div class="score-input-row">
                <span class="score-display">${i.score1} - ${i.score2}</span>
                <button class="btn btn-sm btn-ghost edit-score-btn" onclick="window.editRound(${o})">Edit</button>
              </div>
              `:`
              <div class="score-input-row">
                <input type="number" class="score-input" id="score-${o}-${m}-1" 
                       min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                       value="${i.score1||""}"
                       oninput="window.autoFillScore(${o}, ${m}, 1, this.value)">
                <span class="score-separator">-</span>
                <input type="number" class="score-input" id="score-${o}-${m}-2" 
                       min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                       value="${i.score2||""}"
                       oninput="window.autoFillScore(${o}, ${m}, 2, this.value)">
              </div>
              `}
            </div>
          `).join("")}
        </div>
        ${s.byes&&s.byes.length>0?`
        <div class="waiting-players">
          <span class="waiting-label">Resting:</span>
          <span class="waiting-names">${s.byes.map(i=>i.name).join(", ")}</span>
        </div>
        `:""}
        ${!a&&r?`
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${n.manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${n.leaderboard.map(i=>`
              <button class="bye-chip ${n.manualByes.includes(i.id)?"selected":""}" 
                      onclick="window.toggleManualBye(${i.id})">
                ${i.name}
                <span class="bye-count">(${i.byeCount||0})</span>
              </button>
            `).join("")}
          </div>
        </div>
        <button class="btn btn-primary complete-round-btn" onclick="window.completeRound()">
          Complete Round ${s.number}
        </button>
        `:""}
      </div>
    </div>
  `}).join(""),ht(),Q(),Ne()}function T(){const e=S();if(!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const t=[...n.leaderboard].sort((s,o)=>{switch(n.rankingCriteria){case"wins":return o.wins!==s.wins?o.wins-s.wins:o.points!==s.points?o.points-s.points:o.points-o.pointsLost-(s.points-s.pointsLost);case"winRatio":const r=s.played>0?s.wins/s.played:0,a=o.played>0?o.wins/o.played:0;return Math.abs(a-r)>.001?a-r:o.wins!==s.wins?o.wins-s.wins:o.points-s.points;case"pointRatio":const d=s.points+s.pointsLost,l=o.points+o.pointsLost,i=d>0?s.points/d:0,m=l>0?o.points/l:0;return Math.abs(m-i)>.001?m-i:o.points-s.points;case"points":default:return o.points!==s.points?o.points-s.points:o.wins!==s.wins?o.wins-s.wins:o.points-o.pointsLost-(s.points-s.pointsLost)}});if(n.hideLeaderboard){const s=[...t].sort(()=>Math.random()-.5);e.leaderboardBody.innerHTML=s.map(o=>`
    <tr>
      <td>-</td>
      <td>${o.name}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>${o.played}</td>
    </tr>
  `).join("")}else t.forEach((s,o)=>{const r=o+1,a=s.previousRank||r;s.rankChange=a-r,s.previousRank=r}),e.leaderboardBody.innerHTML=t.map((s,o)=>{let r="";n.showPositionChanges&&s.played>0&&(s.rankChange>0?r='<span class="rank-up">▲</span>':s.rankChange<0?r='<span class="rank-down">▼</span>':r='<span class="rank-same">●</span>');const a=s.points-(s.pointsLost||0),d=s.played>0?Math.round((s.wins||0)/s.played*100):0,l=a>0?"+":"";return`
    <tr>
      <td>${o+1} ${r}</td>
      <td class="player-name-cell">${s.name}</td>
      <td class="font-bold">${s.points}</td>
      <td>${s.wins||0}</td>
      <td class="${a>0?"text-success":a<0?"text-error":""}">${l}${a}</td>
      <td>${d}%</td>
      <td>${s.played}</td>
    </tr>
  `}).join("")}function A(){const e=S(),t=e.format?e.format.value:"americano",s=t==="team"||t==="teamMexicano",o=document.getElementById("playersHeader");o&&(o.querySelector(".player-count"),o.firstChild&&(o.firstChild.textContent=s?"Teams ":"Players ")),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const r=document.querySelector(".setup-card");if(!r)return;r.querySelectorAll("input, select, button").forEach(f=>{n.isLocked&&!f.classList.contains("always-enabled")?(f.disabled=!0,f.classList.add("locked")):(f.disabled=!1,f.classList.remove("locked"))});const d=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",d&&(d.style.display="inline-flex")):(e.generateBtn.style.display="block",d&&(d.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=n.players.length<4);const l=document.getElementById("maxRepeatsContainer"),i=document.getElementById("pairingStrategyContainer"),m=document.getElementById("preferredPartnersContainer"),u=t==="mexicano";l&&(l.style.display=u?"flex":"none"),i&&(i.style.display=u?"flex":"none"),m&&(m.style.display=u?"block":"none");const c=document.getElementById("strictStrategy");if(c&&i){const f=e.pairingStrategy?e.pairingStrategy.value==="optimal":n.pairingStrategy==="optimal";c.disabled=f,f?c.checked=!1:c.checked=n.strictStrategy||!1;const h=c.closest(".form-check");h&&(h.style.opacity=f?"0.5":"1",h.title=f?"Recursive by definition in Optimal strategy":"",h.style.display="block")}const y=document.getElementById("undoBtn");y&&(y.disabled=!Ve())}let ue=!1;function Q(){const e=S(),t=n.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(o=>{o.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function ht(){const e=S();if(!e.gridColumns)return;let t=n.courts||2;if(n.schedule.length>0){const s=n.schedule[n.schedule.length-1];s&&s.matches&&(t=Math.max(t,s.matches.length))}t=Math.min(Math.max(t,1),6),e.gridColumns.max=t,n.maxCourts=t,n.gridColumns>t&&n.gridColumns!==0&&(n.gridColumns=t,Q())}function vt(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,o=Math.floor(t/180),r=n.maxCourts||n.courts||2;return Math.min(Math.max(o,1),r)}function Ae(){const e=S();if(ue||n.gridColumns!==0)return;const t=vt();document.querySelectorAll(".matches-grid").forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function bt(){const e=S(),t=parseInt(e.gridColumns.value);t===0?(ue=!1,Ae()):ue=!0,n.gridColumns=t,Q(),v()}function Ne(){const e=S(),t=n.textSize,s=t/100,o=document.getElementById("scheduleSection");o&&o.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function wt(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel"),s=document.getElementById("scheduleSection");if(!e)return;const o=parseInt(e.value),r=o/100;s&&s.style.setProperty("--round-scale",r),t&&(t.textContent=`${o}%`)}function St(){document.querySelectorAll(".form-select").forEach(t=>{if(t.closest(".custom-select-wrapper")||t.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),t.parentNode.insertBefore(s,t),s.appendChild(t);const o=document.createElement("div");o.classList.add("custom-select");const r=document.createElement("div");r.classList.add("custom-select-trigger"),r.innerHTML=`<span>${t.options[t.selectedIndex].text}</span>`;const a=document.createElement("div");a.classList.add("custom-options"),Array.from(t.options).forEach(d=>{const l=document.createElement("div");l.classList.add("custom-option"),l.textContent=d.text,l.dataset.value=d.value,d.selected&&l.classList.add("selected"),l.addEventListener("click",()=>{t.value=d.dataset.value,t.dispatchEvent(new Event("change")),r.innerHTML=`<span>${d.text}</span>`,a.querySelectorAll(".custom-option").forEach(i=>i.classList.remove("selected")),l.classList.add("selected"),o.classList.remove("open"),a.classList.remove("show")}),a.appendChild(l)}),o.appendChild(r),o.appendChild(a),s.appendChild(o),r.addEventListener("click",d=>{d.stopPropagation(),document.querySelectorAll(".custom-select.open").forEach(l=>{l!==o&&(l.classList.remove("open"),l.querySelector(".custom-options").classList.remove("show"))}),o.classList.toggle("open"),a.classList.toggle("show")}),t.style.display="none"}),document.addEventListener("click",t=>{t.target.closest(".custom-select")||document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open"),s.querySelector(".custom-options").classList.remove("show")})})}function Ct(e,t,s,o){let r=parseInt(o);if(isNaN(r)||r<0||n.scoringMode!=="total")return;const a=parseInt(n.pointsPerMatch);if(isNaN(a)||a<=0)return;if(r>a){r=a;const m=document.getElementById(`score-${e}-${t}-${s}`);m&&(m.value=r)}const d=s===1||s==="1"?2:1,l=a-r,i=document.getElementById(`score-${e}-${t}-${d}`);if(i&&l>=0){i.value=l;const m=document.getElementById(`score-${e}-${t}-${s}`);m&&m.classList.remove("error"),i.classList.remove("error")}}function xt(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▼");const r=t.querySelector(".round-summary");r&&(r.style.display="none")}else{t.classList.add("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▶");const r=t.querySelector(".round-summary");r&&(r.style.display="")}}function Et(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),z();return}const s=n.courts*4,o=n.leaderboard.length,r=Math.max(0,o-s);if(r===0){b(`All ${o} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=r){b(`Max ${r} can rest. Deselect someone first.`);return}n.manualByes.push(e),z()}function Lt(){const e=n.schedule.length-1,t=n.schedule[e];let s=!0;if(t.matches.forEach((o,r)=>{const a=document.getElementById(`score-${e}-${r}-1`),d=document.getElementById(`score-${e}-${r}-2`),l=parseInt(a==null?void 0:a.value)||0,i=parseInt(d==null?void 0:d.value)||0;n.scoringMode==="total"?l+i!==n.pointsPerMatch?(s=!1,a==null||a.classList.add("error"),d==null||d.classList.add("error")):(a==null||a.classList.remove("error"),d==null||d.classList.remove("error")):l<0||i<0?(s=!1,a==null||a.classList.add("error"),d==null||d.classList.add("error")):(a==null||a.classList.remove("error"),d==null||d.classList.remove("error")),o.score1=l,o.score2=i;const m=l===i,u=l>i,c=i>l;o.team1[1]?(j(o.team1[0].id,l,i,u,m,o.team1[1].id),j(o.team1[1].id,l,i,u,m,o.team1[0].id),j(o.team2[0].id,i,l,c,m,o.team2[1].id),j(o.team2[1].id,i,l,c,m,o.team2[0].id)):(j(o.team1[0].id,l,i,u,m,null),j(o.team2[0].id,i,l,c,m,null))}),!s){n.scoringMode==="total"?b(`Scores must sum to ${n.pointsPerMatch}`):b("Please enter valid positive scores");return}if(se(),t.completed=!0,t.byes&&t.byes.length>0&&t.byes.forEach(o=>{const r=n.leaderboard.find(a=>a.id===o.id);r&&(r.byeCount=(r.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const o={...n.allRounds[n.currentRound-1]};n.schedule.push(o)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const o={...n.allRounds[n.currentRound-1]};n.schedule.push(o)}else if(n.format==="teamMexicano"){if(n.currentRound<=8){const o=at();o.matches.length>0&&n.schedule.push(o)}}else if(n.format==="mexicano"&&n.currentRound<=8){const o=it(n.leaderboard);o.matches.length>0&&n.schedule.push(o)}S(),T(),z(),v(),setTimeout(()=>{const o=n.schedule.length-1,r=document.getElementById(`round-${o}`);r&&r.scrollIntoView({behavior:"smooth",block:"start"})},100)}function Bt(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){se();for(let o=e;o<n.schedule.length;o++){const r=n.schedule[o];r.completed&&r.matches.forEach(a=>{a.team1[1]?(U(a.team1[0].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),U(a.team1[1].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),U(a.team2[0].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2),U(a.team2[1].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2)):(U(a.team1[0].id,a.score1||0,a.score2||0,a.score1>a.score2,a.score1===a.score2),U(a.team2[0].id,a.score2||0,a.score1||0,a.score2>a.score1,a.score1===a.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,T(),z(),v(),b(`Editing Round ${e+1}`)}}function Pt(){const e=S();n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const t=n.format==="team"||n.format==="teamMexicano"?2:4,s=Math.floor(n.players.length/t),o=()=>{se(),n.leaderboard=n.players.map(a=>({...a,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=nt(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=ot(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=st(),n.allRounds=null):(n.schedule=rt(),n.allRounds=null),e.leaderboardSection.style.display="block",T(),z(),e.scheduleSection.style.display="block";const r=document.getElementById("tournamentActionsSection");r&&(r.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),n.isLocked=!0,A(),v()};if(n.courts>s){if(s===0){tt("Not Enough Players",`You need at least ${t} players/teams to start!`);return}const r=n.courts;n.courts=s,e.courts&&(e.courts.value=n.courts),b(`Adjusted courts: ${r} → ${s}`)}o()}function $t(){const e=S();k("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{se(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",A(),v(),b("Tournament reset")},!0)}function It(){n.hideLeaderboard=!n.hideLeaderboard,T(),v()}function Mt(){n.showPositionChanges=!n.showPositionChanges,T(),v()}function kt(){const e=document.getElementById("rankingCriteria");e&&(n.rankingCriteria=e.value,T(),v())}function Tt(e){k("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,A();const t=[...n.leaderboard].sort((s,o)=>o.points-s.points);Dt(),b("Tournament saved to history"),e&&e(t),v()},!0)}function Rt(){const e=document.getElementById("advancedSettingsContent"),t=document.getElementById("advancedSettingsToggle"),s=t.querySelector(".toggle-text"),o=t.querySelector(".toggle-icon");e.style.display==="none"?(e.style.display="block",t.classList.add("expanded"),s&&(s.textContent="Hide Advanced Settings"),o&&(o.style.transform="rotate(180deg)")):(e.style.display="none",t.classList.remove("expanded"),s&&(s.textContent="Show Advanced Settings"),o&&(o.style.transform="rotate(0deg)"))}function At(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function Nt(e=null){const t=e||n,s=new Date().toLocaleDateString(),o=new Date().toLocaleTimeString();let r="data:text/csv;charset=utf-8,";r+=`Tournament Results
`,r+=`Date,${s} ${o}
`,r+=`Format,${t.format}
`,r+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,r+=`Final Standings
`,r+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((i,m)=>m.points-i.points).forEach((i,m)=>{const u=(i.points||0)-(i.pointsLost||0);r+=`${m+1},"${i.name}",${i.points},${i.wins},${i.played},${i.pointsLost||0},${u}
`}),r+=`
`,r+=`Match History
`,r+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(i=>{i.completed&&i.matches.forEach(m=>{const u=m.team1.map(f=>f.name).join(" & "),c=m.team2.map(f=>f.name).join(" & ");let y=`Court ${m.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[m.court-1]?y=t.customCourtNames[m.court-1]:t.courtFormat==="number"&&(y=`${m.court}`),r+=`Round ${i.number},"${y}","${u}",${m.score1},${m.score2},"${c}"
`})});const d=encodeURI(r),l=document.createElement("a");l.setAttribute("href",d),l.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(l),l.click(),document.body.removeChild(l)}async function Ft(e=null){var a;const t=e||n;let o=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;o+=`Winner: ${((a=t.leaderboard[0])==null?void 0:a.name)||"Unknown"}
`,o+=`Format: ${t.format}

`,o+=`Top Standings:
`,[...t.leaderboard].sort((d,l)=>l.points-d.points).slice(0,5).forEach((d,l)=>{o+=`${l+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),o+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(o),b("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),b("Failed to copy results","error")}}const pe="padel_history_v1";function Dt(){var o;const e=Z(),t=_e(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((o=t.leaderboard[0])==null?void 0:o.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(pe,JSON.stringify(e)),s}function Z(){try{const e=localStorage.getItem(pe);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function zt(e){k("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=Z().filter(o=>o.id!==e);localStorage.setItem(pe,JSON.stringify(s)),Fe(),b("Tournament deleted")},!0)}function Ht(e){const s=Z().find(o=>o.id===e);if(!s){b("Tournament details not found","error");return}k("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{Be(s.data),z(),T(),v(),b("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(o){console.error("Failed to load tournament",o),b("Error loading tournament","error")}},!1)}let oe=[];function qt(){Fe();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Ot(s)})}function Ot(e){if(!e){me(oe);return}const t=oe.filter(s=>{var u,c,y,f,h,p,w,R;const o=(((u=s.summary)==null?void 0:u.winner)||((y=(c=s.players)==null?void 0:c[0])==null?void 0:y.name)||"").toLowerCase(),r=(((f=s.summary)==null?void 0:f.format)||s.format||"").toLowerCase(),a=((h=s.summary)==null?void 0:h.date)||s.date||"",d=String(((p=s.summary)==null?void 0:p.playerCount)||((w=s.players)==null?void 0:w.length)||""),l=String(((R=s.summary)==null?void 0:R.roundCount)||""),m=new Date(a).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return o.includes(e)||r.includes(e)||m.includes(e)||d.includes(e)||l.includes(e)});me(t)}function Fe(){oe=Z(),me(oe)}function me(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=zt,window.loadTournament=Ht,window.downloadHistoryItem=Wt,t.innerHTML=e.map(o=>{var y,f,h;const r=o.summary?o.summary.date:o.date,a=o.summary?o.summary.format:o.format||"Unknown",d=o.summary?o.summary.winner:((f=(y=o.players)==null?void 0:y[0])==null?void 0:f.name)||"Unknown",l=o.summary?o.summary.playerCount:((h=o.players)==null?void 0:h.length)||0,i=new Date(r),m=i.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),u=i.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),c=!!o.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${m}</span>
            <span class="date-sub">${u}</span>
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
      `}).join("")}}function Wt(e){const s=Z().find(o=>o.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}document.addEventListener("DOMContentLoaded",()=>{});const De="padelcompanion-theme";function jt(){const e=localStorage.getItem(De),t=!e||e==="dark";return document.documentElement.setAttribute("data-theme",t?"dark":"light"),t?"dark":"light"}function Ut(){const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";return document.documentElement.setAttribute("data-theme",t),localStorage.setItem(De,t),t}function ze(e,t){if(!e)return;const s=e.querySelector(".theme-icon");s&&(s.textContent=t==="dark"?"🌙":"☀️")}function Ee(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(b("Maximum 24 players allowed"),!1):n.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(b(`Player "${t}" already exists`),!1):(n.players.push({id:ae(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),v(),!0)}function Vt(e){n.players=n.players.filter(t=>t.id!==e),v()}function Yt(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}k("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],v(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function _t(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(a=>a.trim()).filter(a=>a);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,o=0,r=!1;for(const a of t){if(n.players.length>=24){r=!0;break}if(n.players.some(d=>d.name.toLowerCase()===a.toLowerCase())){o++;continue}n.players.push({id:ae(),name:a,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}return v(),{added:s,duplicates:o,hitLimit:r}}function Gt(e){const t={id:ae(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),v(),!0}function Xt(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function Jt(){const e=Xt();e.length<2||(n.preferredPartners.push({id:ae(),player1Id:e[0].id,player2Id:e[1].id}),v())}function Kt(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),v()}function Qt(e,t,s){const o=n.preferredPartners.find(r=>r.id===e);o&&(t===1?o.player1Id=s:o.player2Id=s,v())}function Zt(e){let t;const s=document.getElementById(e);window.addEventListener("beforeinstallprompt",o=>{o.preventDefault(),t=o,s&&(s.style.display="inline-flex",s.addEventListener("click",async()=>{s.style.display="none",t.prompt(),(await t.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),t=null}))}),window.addEventListener("appinstalled",()=>{s&&(s.style.display="none"),t=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function en(){Zt("installBtn");const e=jt(),t=Me();ze(t.themeToggle,e),Ye(),t.format.value=n.format,t.courts.value=n.courts,t.scoringMode.value=n.scoringMode,t.points.value=n.pointsPerMatch,t.courtFormat.value=n.courtFormat,t.maxRepeats.value=n.maxRepeats,t.pairingStrategy&&(t.pairingStrategy.value=n.pairingStrategy);const s=document.getElementById("strictStrategy");if(s&&(s.checked=n.strictStrategy||!1),Te(),O(),n.schedule.length>0){t.scheduleSection.style.display="block",t.leaderboardSection.style.display="block";const o=document.getElementById("tournamentActionsSection");o&&(o.style.display="block"),z(),T(),A(),Q()}St(),tn(t),qt(),window.addEventListener("resize",Ae)}function tn(e){e.themeToggle.addEventListener("click",()=>{const u=Ut();ze(e.themeToggle,u)});const t=document.getElementById("navToggle"),s=document.getElementById("nav");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("open"),t.classList.toggle("active")}),document.addEventListener("click",u=>{s.classList.contains("open")&&!s.contains(u.target)&&!t.contains(u.target)&&(s.classList.remove("open"),t.classList.remove("active"))}),s.querySelectorAll("a").forEach(u=>{u.addEventListener("click",()=>{s.classList.remove("open"),t.classList.remove("active")})}));const o=document.getElementById("undoBtn");o&&(o.addEventListener("click",()=>{if(Ue())if(b("Undo successful"),e.format.value=n.format,O(),z(),T(),A(),Q(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const u=document.getElementById("tournamentActionsSection");u&&(u.style.display="none")}}),document.addEventListener("keydown",u=>{(u.ctrlKey||u.metaKey)&&u.key==="z"&&!u.shiftKey&&(u.preventDefault(),o.click())})),e.addPlayerBtn.addEventListener("click",ut),e.cancelAddBtn.addEventListener("click",xe),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{Yt(()=>{O(),K(),A()})}),e.importPlayersBtn.addEventListener("click",ft),e.closeImportModal.addEventListener("click",de),e.cancelImportBtn.addEventListener("click",de),e.confirmImportBtn.addEventListener("click",()=>{const u=e.importTextarea.value,c=_t(u);let y=`Added ${c.added} players.`;c.duplicates>0&&(y+=` Skipped ${c.duplicates} duplicates.`),c.hitLimit&&(y+=" Stopped at 24 max limit."),e.importStatus.textContent=y,O(),c.added>0&&c.duplicates===0&&!c.hitLimit&&(setTimeout(de,1500),b(`Imported ${c.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{Ee(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),O())}),e.playerNameInput.addEventListener("keydown",u=>{u.key==="Enter"?Ee(e.playerNameInput.value)&&(e.playerNameInput.value="",O()):u.key==="Escape"&&xe()}),e.format.addEventListener("change",()=>{n.format=e.format.value,A(),v()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),v()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),v()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,v()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Te(),v()}),e.courts.addEventListener("input",()=>{const c=e.courts.value;if(c==="")return;let y=parseInt(c)||1;y=Math.max(1,Math.min(50,y)),e.courts.value=y,n.courts=y,v(),n.courtFormat==="custom"&&Re()}),e.maxRepeats.addEventListener("change",u=>{const c=parseInt(u.target.value),y=n.maxRepeats;n.isLocked?(u.target.value=y,k("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=c,e.maxRepeats.value=c,v(),b("Max Partner Repeats updated")})):(n.maxRepeats=c,v())});const r=document.getElementById("strictStrategy");r&&r.addEventListener("change",u=>{const c=u.target.checked,y=n.strictStrategy;n.isLocked?(u.target.checked=!!y,k("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=c,r.checked=c,v(),b("Strict Mode updated")})):(n.strictStrategy=c,v())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",u=>{const c=u.target.value,y=n.pairingStrategy;n.isLocked?(u.target.value=y,k("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.pairingStrategy=c,e.pairingStrategy.value=c,v(),A(),b("Pairing Strategy updated")})):(n.pairingStrategy=c,v(),A())}),e.addPartnerPairBtn.addEventListener("click",()=>{Jt(),K()});const a=document.getElementById("helpFormat");a&&a.addEventListener("click",()=>{le("Tournament Formats",`
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
        `)});const d=document.getElementById("helpScoring");d&&d.addEventListener("click",()=>{le("Scoring Modes",`
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
        `)});const l=document.getElementById("helpMatchup");l&&l.addEventListener("click",()=>{le("Matchup Rules",`
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
        `)}),e.generateBtn.addEventListener("click",Pt),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",$t),e.gridColumns&&e.gridColumns.addEventListener("input",bt),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),Ne(),v()});const i=document.getElementById("factoryResetBtn");i&&i.addEventListener("click",()=>{k("⚠️ Factory Reset","This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?","Yes, Reset App",()=>{localStorage.removeItem("tournament-state"),window.location.reload()},!0)});const m=document.getElementById("roundScale");m&&m.addEventListener("input",wt)}window.removePlayer=e=>{Vt(e),O()};window.togglePlayerList=mt;window.updatePreferredPair=(e,t,s)=>{Qt(e,t,s),K()};window.removePreferredPair=e=>{Kt(e),K()};window.updateCustomCourtName=ct;window.autoFillScore=Ct;window.toggleManualBye=Et;window.toggleRoundCollapse=xt;window.completeRound=Lt;window.editRound=Bt;window.toggleLeaderboardVisibility=It;window.togglePositionChanges=Mt;window.updateRankingCriteria=kt;window.endTournament=()=>Tt(Ze);window.validateCourts=ke;window.toggleAdvancedSettings=Rt;window.toggleToolbar=At;window.exportTournamentData=Nt;window.shareResults=Ft;console.log("Global functions registered:",{autoFillScore:typeof window.autoFillScore,validateCourts:typeof window.validateCourts});window.promptAddLatePlayer=()=>{const e=n.format==="team"||n.format==="teamMexicano";$e(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,b("Switched to Mexicano format")}Gt(t.trim());const s=document.getElementById("playerCount");s&&(s.textContent=`(${n.players.length})`),T(),b(`Added ${t.trim()} to tournament`)}})};en();
