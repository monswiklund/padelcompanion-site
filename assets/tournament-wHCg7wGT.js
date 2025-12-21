import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */const n={players:[],format:"americano",courts:2,scoringMode:"total",pointsPerMatch:24,rankingCriteria:"points",courtFormat:"court",customCourtNames:[],maxRepeats:99,pairingStrategy:"optimal",preferredPartners:[],manualByes:[],hideLeaderboard:!0,showPositionChanges:!0,gridColumns:0,textSize:100,isLocked:!1,schedule:[],currentRound:0,leaderboard:[],allRounds:null,maxCourts:2},V=[],je=20;function se(){const e=JSON.parse(JSON.stringify(n));V.push(e),V.length>je&&V.shift()}function Ue(){if(V.length===0)return!1;const e=V.pop();return Be(e),!0}function Ve(){return V.length>0}const Ee="tournament-state";function h(){localStorage.setItem(Ee,JSON.stringify({players:n.players,format:n.format,courts:n.courts,scoringMode:n.scoringMode,pointsPerMatch:n.pointsPerMatch,rankingCriteria:n.rankingCriteria,courtFormat:n.courtFormat,customCourtNames:n.customCourtNames,maxRepeats:n.maxRepeats,pairingStrategy:n.pairingStrategy,preferredPartners:n.preferredPartners,schedule:n.schedule,currentRound:n.currentRound,leaderboard:n.leaderboard,allRounds:n.allRounds,isLocked:n.isLocked,hideLeaderboard:n.hideLeaderboard,manualByes:n.manualByes,gridColumns:n.gridColumns,textSize:n.textSize}))}function _e(){const e=localStorage.getItem(Ee);if(!e)return!1;try{const t=JSON.parse(e);return n.players=Array.isArray(t.players)?t.players.slice(0,200):[],n.format=t.format||"americano",n.courts=Math.max(1,Math.min(50,t.courts||2)),n.scoringMode=t.scoringMode||"total",n.pointsPerMatch=Math.max(1,Math.min(999,t.pointsPerMatch||24)),n.rankingCriteria=t.rankingCriteria||"points",n.courtFormat=t.courtFormat||"court",n.customCourtNames=Array.isArray(t.customCourtNames)?t.customCourtNames.slice(0,50):[],n.maxRepeats=Math.max(0,Math.min(99,t.maxRepeats!==void 0?t.maxRepeats:99)),n.pairingStrategy=t.pairingStrategy||"optimal",n.preferredPartners=Array.isArray(t.preferredPartners)?t.preferredPartners.slice(0,100):[],n.schedule=Array.isArray(t.schedule)?t.schedule:[],n.currentRound=Math.max(0,Math.min(100,t.currentRound||0)),n.leaderboard=Array.isArray(t.leaderboard)?t.leaderboard:[],n.allRounds=t.allRounds||null,n.isLocked=t.isLocked||!1,n.hideLeaderboard=t.hideLeaderboard!==void 0?t.hideLeaderboard:!0,n.manualByes=Array.isArray(t.manualByes)?t.manualByes:[],n.gridColumns=Math.max(0,Math.min(10,t.gridColumns||0)),n.textSize=Math.max(50,Math.min(200,t.textSize||100)),!0}catch(t){return console.error("Failed to load tournament state:",t),!1}}function Ge(){return JSON.parse(JSON.stringify(n))}function Be(e){e&&(Object.keys(n).forEach(t=>{e.hasOwnProperty(t)&&(n[t]=e[t])}),n.players=n.players||[],n.schedule=n.schedule||[],n.leaderboard=n.leaderboard||[],h())}function te(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function w(e,t=3e3){const s=document.querySelector(".toast");s&&s.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10),setTimeout(()=>{o.classList.remove("visible"),setTimeout(()=>o.remove(),300)},t)}function ae(){return Date.now()+Math.random()}let x,M,A,N,_=[],ce,J=!1;const Se=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"];function Ce(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function Xe(){this.x=Math.random()*A,this.y=Math.random()*N-N,this.r=Ce(10,30),this.d=Math.random()*150+10,this.color=Se[Ce(0,Se.length-1)],this.tilt=Math.floor(Math.random()*10)-10,this.tiltAngleIncremental=Math.random()*.07+.05,this.tiltAngle=0,this.draw=function(){return M.beginPath(),M.lineWidth=this.r/2,M.strokeStyle=this.color,M.moveTo(this.x+this.tilt+this.r/4,this.y),M.lineTo(this.x+this.tilt,this.y+this.tilt+this.r/4),M.stroke()}}function Pe(){if(J){M.clearRect(0,0,A,N);for(let e=0;e<_.length;e++)_[e].draw();Ye(),ce=requestAnimationFrame(Pe)}}function Ye(){for(let e=0;e<_.length;e++){const t=_[e];t.tiltAngle+=t.tiltAngleIncremental,t.y+=(Math.cos(t.d)+3+t.r/2)/2,t.tilt=Math.sin(t.tiltAngle-e/3)*15,(t.x>A+20||t.x<-20||t.y>N)&&J&&(t.x=Math.random()*A,t.y=-10,t.tilt=Math.floor(Math.random()*10)-10)}}function Je(){if(!J){x||(x=document.createElement("canvas"),x.id="confetti-canvas",x.style.position="fixed",x.style.top="0",x.style.left="0",x.style.width="100%",x.style.height="100%",x.style.pointerEvents="none",x.style.zIndex="9999",document.body.appendChild(x),M=x.getContext("2d")),A=window.innerWidth,N=window.innerHeight,x.width=A,x.height=N,window.addEventListener("resize",()=>{A=window.innerWidth,N=window.innerHeight,x.width=A,x.height=N}),J=!0,_=[];for(let e=0;e<150;e++)_.push(new Xe);Pe()}}function Ke(){J=!1,M&&M.clearRect(0,0,A,N),ce&&cancelAnimationFrame(ce),x&&x.remove(),x=null}function Qe(){Je(),setTimeout(Ke,5e3)}function D(e,t,s="Confirm",o,a=!1,i=null,d=null){const r=document.querySelector(".confirm-modal");r&&r.remove();const l=document.createElement("div");l.className="modal-overlay confirm-modal",l.style.display="flex";const c=a?"btn btn-danger":"btn btn-primary";l.innerHTML=`
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${e}</h3>
      </div>
      <div class="modal-body">
        <p>${t}</p>
      </div>
      <div class="modal-footer" style="flex-direction: column; gap: 12px;">
        <div class="modal-actions-row" style="display: flex; gap: 10px; width: 100%;">
          ${i?`<button class="btn btn-outline" id="modalSecondaryBtn" style="flex: 1;">${i}</button>`:""}
          <button class="${c}" id="modalConfirmBtn" style="flex: 1;">${s}</button>
        </div>
        <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(l),setTimeout(()=>l.classList.add("visible"),10);const m=l.querySelector(".modal");m&&m.addEventListener("click",p=>p.stopPropagation());const u=l.querySelector("#modalCancelBtn"),b=l.querySelector("#modalConfirmBtn"),g=l.querySelector("#modalSecondaryBtn"),f=()=>l.remove();u&&u.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),f()}),b&&b.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),f(),o()}),g&&d&&g.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),f(),d()}),l.addEventListener("click",p=>{p.target===l&&f()})}function Ie(e,t,s){const o=document.querySelector(".input-modal");o&&o.remove();const a=document.createElement("div");a.className="modal-overlay input-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const i=a.querySelector("#modalInput"),d=a.querySelector("#modalCancelBtn"),r=a.querySelector("#modalConfirmBtn"),l=()=>a.remove();d.onclick=l;const c=()=>{const m=i.value;m&&m.trim()&&(l(),s(m.trim()))};r.onclick=c,i.onkeydown=m=>{m.key==="Enter"&&c(),m.key==="Escape"&&l()},setTimeout(()=>i.focus(),100)}function Ze(e){const t=document.querySelector(".final-modal");t&&t.remove();const s=a=>a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,o=document.createElement("div");o.className="final-modal",o.innerHTML=`
    <div class="final-modal-content">
      <h2>Tournament Complete!</h2>
      <div class="final-standings">
        ${e.map((a,i)=>`
          <div class="final-standing-row ${i<3?"top-three":""}">
            <span class="medal">${s(i)}</span>
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
  `,document.body.appendChild(o),Qe(),setTimeout(()=>o.classList.add("visible"),10)}function et(){const e=document.querySelector(".final-modal");e&&(e.classList.remove("visible"),setTimeout(()=>{e.remove();const t=document.getElementById("leaderboardSection");t&&t.scrollIntoView({behavior:"smooth"})},300))}function tt(e,t,s){const o=document.querySelector(".alert-modal");o&&o.remove();const a=document.createElement("div");a.className="modal-overlay alert-modal",a.style.display="flex",a.innerHTML=`
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
  `,document.body.appendChild(a),setTimeout(()=>a.classList.add("visible"),10);const i=a.querySelector(".modal");i&&i.addEventListener("click",l=>l.stopPropagation());const d=a.querySelector("#modalOkBtn"),r=()=>{a.remove()};d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),r()}),a.addEventListener("click",l=>{l.target===a&&r()}),a.addEventListener("click",l=>{l.target===a&&r()})}function le(e,t){const s=document.querySelector(".info-modal");s&&s.remove();const o=document.createElement("div");o.className="modal-overlay info-modal",o.style.display="flex",o.innerHTML=`
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
  `,document.body.appendChild(o),setTimeout(()=>o.classList.add("visible"),10);const a=o.querySelector(".modal");a&&a.addEventListener("click",l=>l.stopPropagation());const i=o.querySelector("#modalOkBtn"),d=o.querySelector("#modalCloseX"),r=()=>o.remove();i&&(i.onclick=r),d&&(d.onclick=r),o.addEventListener("click",l=>{l.target===o&&r()})}window.closeFinalModal=et;function nt(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],i=e[0],d=e.slice(1);for(let r=0;r<o-1;r++){const l=[i,...d],c=[];for(let p=0;p<o/2;p++){const v=l[p],T=l[o-1-p];!v.isBye&&!T.isBye&&c.push([v,T])}const m=[],u=new Set;for(let p=0;p<c.length-1;p+=2)c[p]&&c[p+1]&&(m.push({court:Math.floor(p/2)+1,team1:c[p],team2:c[p+1]}),c[p].forEach(v=>u.add(v.id)),c[p+1].forEach(v=>u.add(v.id)));const b=m.slice(0,s),g=new Set;b.forEach(p=>{p.team1.forEach(v=>g.add(v.id)),p.team2.forEach(v=>g.add(v.id))});const f=n.players.filter(p=>!p.isBye&&!g.has(p.id));b.length>0&&a.push({number:a.length+1,matches:b,byes:f}),d.unshift(d.pop())}return a}function ot(){const e=[...n.players],t=e.length,s=n.courts;t%2!==0&&e.push({id:-1,name:"BYE",isBye:!0});const o=e.length,a=[],i=e[0],d=e.slice(1);for(let r=0;r<o-1;r++){const l=[i,...d],c=[],m=new Set;for(let f=0;f<o/2;f++){const p=l[f],v=l[o-1-f];!p.isBye&&!v.isBye&&(c.push({court:c.length+1,team1:[p],team2:[v]}),m.add(p.id),m.add(v.id))}const u=c.slice(0,s),b=new Set;u.forEach(f=>{f.team1.forEach(p=>b.add(p.id)),f.team2.forEach(p=>b.add(p.id))});const g=n.players.filter(f=>!f.isBye&&!b.has(f.id));u.length>0&&a.push({number:a.length+1,matches:u,byes:g}),d.unshift(d.pop())}return a}function st(){const e=[...n.players];te(e);const t=n.courts,s=[],o=new Set;for(let i=0;i<e.length-1&&s.length<t;i+=2)s.push({court:s.length+1,team1:[e[i]],team2:[e[i+1]]}),o.add(e[i].id),o.add(e[i+1].id);const a=e.filter(i=>!o.has(i.id));return[{number:1,matches:s,byes:a}]}function at(){const e=[...n.leaderboard].sort((r,l)=>l.points-r.points),t=n.courts,s=e.filter(r=>!n.manualByes.includes(r.id)),o=e.filter(r=>n.manualByes.includes(r.id)),a=[],i=new Set;for(let r=0;r<s.length-1&&a.length<t;r+=2)a.push({court:a.length+1,team1:[s[r]],team2:[s[r+1]]}),i.add(s[r].id),i.add(s[r+1].id);const d=[...o,...s.filter(r=>!i.has(r.id))];return{number:n.schedule.length+1,matches:a,byes:d}}function it(){const e=n.courts,t=e*4,s=[],o=new Set,a=[...n.players],i=[];a.forEach(u=>{if(o.has(u.id))return;const b=$e(u.id);if(b){const g=a.find(f=>f.id===b);g?(s.push({type:"pair",players:[u,g]}),o.add(g.id)):s.push({type:"single",players:[u]})}else s.push({type:"single",players:[u]});o.add(u.id)}),te(s);const d=[];let r=0;for(const u of s)r+u.players.length<=t?(d.push(u),r+=u.players.length):i.push(...u.players);const l=[],c=[];d.forEach(u=>{u.type==="pair"?l.push(u.players):c.push(u.players[0])}),te(c);for(let u=0;u<c.length-1;u+=2)l.push([c[u],c[u+1]]);te(l);const m=[];for(let u=0;u<l.length-1&&m.length<e;u+=2)m.push({court:m.length+1,team1:l[u],team2:l[u+1]});return l.length%2!==0&&m.length<l.length/2&&i.push(...l[l.length-1]),[{number:1,matches:m,byes:i}]}function $e(e){if(!n.preferredPartners)return null;const t=n.preferredPartners.find(s=>s.player1Id===e||s.player2Id===e);return t?t.player1Id===e?t.player2Id:t.player1Id:null}function rt(e){const t=n.courts,s=t*4,o=new Set(n.manualByes),a=[],i=new Set,d=[...e];d.forEach(y=>{if(i.has(y.id)||o.has(y.id))return;const C=$e(y.id);if(C){const L=d.find(P=>P.id===C);L?o.has(L.id)?a.push({type:"single",players:[y]}):(a.push({type:"pair",players:[y,L]}),i.add(L.id)):a.push({type:"single",players:[y]})}else a.push({type:"single",players:[y]});i.add(y.id)}),a.sort((y,C)=>{const L=I=>{const q=I.players.reduce((B,$)=>B+($.byeCount||0),0),G=I.players.reduce((B,$)=>B+($.played||0),0);return{bye:q/I.players.length,play:G/I.players.length}},P=L(y),z=L(C);return Math.abs(z.bye-P.bye)>.1?z.bye-P.bye:P.play-z.play});const r=[],l=[];let c=0;for(const y of a)c+y.players.length<=s&&(l.push(y),r.push(...y.players),c+=y.players.length);const m=new Set(r.map(y=>y.id)),u=d.filter(y=>!m.has(y.id)),b=[],g=[];l.forEach(y=>{y.type==="pair"?b.push(y.players):g.push(y.players[0])}),g.sort((y,C)=>C.points-y.points);let f=0;for(;f<g.length-3;f+=4){const y=g[f],C=g[f+1],L=g[f+2],P=g[f+3],z=[{name:"oneThree",team1:[y,L],team2:[C,P]},{name:"oneTwo",team1:[y,C],team2:[L,P]},{name:"oneFour",team1:[y,P],team2:[C,L]}];let I;if(n.pairingStrategy==="optimal"||!n.strictStrategy){const q=z.map(B=>{let $=0;const ze=B.team1[0].id,qe=B.team1[1].id,Oe=B.team2[0].id,We=B.team2[1].id,ye=(X,Y)=>{const ee=e.find(W=>W.id===X);let ie=0;ee!=null&&ee.playedWith&&(ie+=ee.playedWith.filter(W=>W===Y).length);const fe=n.maxRepeats!==void 0?n.maxRepeats:99;if(fe<99&&n.schedule&&n.schedule.length>0){let W=0;for(let re=n.schedule.length-1;re>=0;re--){const ge=n.schedule[re];if(!ge.completed)continue;if(ge.matches.some(H=>{var he,ve,be,we;return H.team1[0].id===X&&((he=H.team1[1])==null?void 0:he.id)===Y||H.team1[0].id===Y&&((ve=H.team1[1])==null?void 0:ve.id)===X||H.team2[0].id===X&&((be=H.team2[1])==null?void 0:be.id)===Y||H.team2[0].id===Y&&((we=H.team2[1])==null?void 0:we.id)===X}))W++;else break}W>fe&&(ie+=1e3)}return ie};return $+=ye(ze,qe),$+=ye(Oe,We),{...B,score:$}}),G=[...q].sort((B,$)=>B.score-$.score)[0];if(n.pairingStrategy==="optimal")I=G;else{const B=q.find($=>$.name===n.pairingStrategy)||q[0];!n.strictStrategy&&B.score>=1e3&&G.score<1e3?I=G:I=B}}else I=z.find(q=>q.name===n.pairingStrategy)||z[0];b.push(I.team1),b.push(I.team2)}f<g.length-1&&b.push([g[f],g[f+1]]);const p=b.map(y=>({players:y,points:y.reduce((C,L)=>C+L.points,0)}));p.sort((y,C)=>C.points-y.points);const v=[],T=new Set;for(let y=0;y<p.length-1&&v.length<t;y+=2){const C=p[y],L=p[y+1];v.push({court:v.length+1,team1:C.players,team2:L.players}),C.players.forEach(P=>T.add(P.id)),L.players.forEach(P=>T.add(P.id))}return p.forEach(y=>{y.players.some(C=>T.has(C.id))||y.players.forEach(C=>u.push(C))}),{number:n.schedule.length+1,matches:v,byes:u}}function j(e,t,s,o,a,i=null){const d=n.leaderboard.find(r=>r.id===e);d&&(d.points+=t,d.played+=1,d.pointsLost=(d.pointsLost||0)+s,o?d.wins=(d.wins||0)+1:a||(d.losses=(d.losses||0)+1),i&&!d.playedWith&&(d.playedWith=[]),i&&d.playedWith.push(i))}function U(e,t,s,o,a){const i=n.leaderboard.find(d=>d.id===e);i&&(i.points-=t,i.played-=1,i.pointsLost=(i.pointsLost||0)-s,o?i.wins=(i.wins||0)-1:a||(i.losses=(i.losses||0)-1),i.played<0&&(i.played=0),i.points<0&&(i.points=0),i.wins<0&&(i.wins=0),i.losses<0&&(i.losses=0),i.pointsLost<0&&(i.pointsLost=0))}class lt{constructor(t={}){this.duration=t.duration||12,this.onTimeUpdate=t.onTimeUpdate||(()=>{}),this.onStatusChange=t.onStatusChange||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.remainingSeconds=this.duration*60,this.isRunning=!1,this.intervalId=null,this.audioContext=null}start(){this.isRunning||(this.remainingSeconds<=0&&this.reset(),this.isRunning=!0,this.onStatusChange("running"),this.intervalId=setInterval(()=>{this.tick()},1e3),this.playBeep(880,.1))}pause(){this.isRunning&&(this.isRunning=!1,clearInterval(this.intervalId),this.onStatusChange("paused"))}reset(){this.pause(),this.remainingSeconds=this.duration*60,this.onTimeUpdate(this.formatTime(this.remainingSeconds)),this.onStatusChange("idle")}setDuration(t){this.duration=t,this.reset()}addTime(t){this.remainingSeconds+=t,this.onTimeUpdate(this.formatTime(this.remainingSeconds))}tick(){this.remainingSeconds--,this.remainingSeconds<=3&&this.remainingSeconds>0&&this.playBeep(440,.2),this.remainingSeconds<=0?this.complete():this.onTimeUpdate(this.formatTime(this.remainingSeconds))}complete(){this.remainingSeconds=0,this.pause(),this.onTimeUpdate("00:00"),this.onStatusChange("completed"),this.playBeep(880,1),this.onComplete()}formatTime(t){const s=Math.floor(t/60),o=t%60;return`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}playBeep(t=440,s=.5){try{this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext.state==="suspended"&&this.audioContext.resume();const o=this.audioContext.createOscillator(),a=this.audioContext.createGain();o.type="sine",o.frequency.value=t,o.connect(a),a.connect(this.audioContext.destination),o.start(),a.gain.setValueAtTime(.1,this.audioContext.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+s),o.stop(this.audioContext.currentTime+s)}catch(o){console.warn("Audio play failed",o)}}}let ne=null,E=null;function Me(){return ne={format:document.getElementById("format"),courts:document.getElementById("courts"),scoringMode:document.getElementById("scoringMode"),points:document.getElementById("points"),matchTimerContainer:document.getElementById("matchTimerContainer"),timerDisplay:document.getElementById("timerDisplay"),timerStartBtn:document.getElementById("timerStartBtn"),timerPauseBtn:document.getElementById("timerPauseBtn"),timerResetBtn:document.getElementById("timerResetBtn"),timerAddBtn:document.getElementById("timerAddBtn"),timerSubBtn:document.getElementById("timerSubBtn"),courtFormat:document.getElementById("courtFormat"),customCourtNamesSection:document.getElementById("customCourtNamesSection"),customCourtNamesList:document.getElementById("customCourtNamesList"),maxRepeats:document.getElementById("maxRepeats"),pairingStrategy:document.getElementById("pairingStrategy"),preferredPartnersList:document.getElementById("preferredPartnersList"),addPartnerPairBtn:document.getElementById("addPartnerPairBtn"),playerList:document.getElementById("playerList"),playerCount:document.getElementById("playerCount"),playersHint:document.getElementById("playersHint"),addPlayerBtn:document.getElementById("addPlayerBtn"),playerInputRow:document.getElementById("playerInputRow"),playerNameInput:document.getElementById("playerNameInput"),confirmAddBtn:document.getElementById("confirmAddBtn"),cancelAddBtn:document.getElementById("cancelAddBtn"),generateBtn:document.getElementById("generateBtn"),scheduleSection:document.getElementById("scheduleSection"),roundsContainer:document.getElementById("roundsContainer"),leaderboardSection:document.getElementById("leaderboardSection"),leaderboardBody:document.getElementById("leaderboardBody"),printBtn:document.getElementById("printBtn"),resetBtn:document.getElementById("resetBtn"),gridColumns:document.getElementById("gridColumns"),gridColumnsLabel:document.getElementById("gridColumnsLabel"),textSize:document.getElementById("textSize"),textSizeLabel:document.getElementById("textSizeLabel"),themeToggle:document.getElementById("themeToggle"),importPlayersBtn:document.getElementById("importPlayersBtn"),importModal:document.getElementById("importModal"),closeImportModal:document.getElementById("closeImportModal"),importTextarea:document.getElementById("importTextarea"),importStatus:document.getElementById("importStatus"),cancelImportBtn:document.getElementById("cancelImportBtn"),confirmImportBtn:document.getElementById("confirmImportBtn"),clearAllPlayersBtn:document.getElementById("clearAllPlayersBtn")},ne}function S(){return ne||Me(),ne}function dt(e){switch(n.courtFormat){case"number":return`${e}`;case"court":return`Court ${e}`;case"custom":return n.customCourtNames[e-1]||`Court ${e}`;default:return`Court ${e}`}}function ke(){var r;const e=S(),t=e.courts,s=document.getElementById("courtsWarning");if(!t||!s)return!0;const o=parseInt(t.value)||1,a=((r=e.format)==null?void 0:r.value)||n.format,i=a==="team"||a==="teamMexicano"?2:4,d=Math.floor(n.players.length/i);return t.max=Math.max(1,d),o>d&&d>0?(s.textContent=`⚠️ ${n.players.length} players can only fill ${d} court${d!==1?"s":""}`,s.style.display="block",t.classList.add("input-warning"),!1):d===0&&n.players.length>0?(s.textContent=`⚠️ Need at least ${i} players for 1 court`,s.style.display="block",t.classList.add("input-warning"),!1):(s.style.display="none",t.classList.remove("input-warning"),!0)}function Te(){const e=S();if(!e.customCourtNamesSection)return;n.courtFormat==="custom"?(e.customCourtNamesSection.style.display="flex",Re()):e.customCourtNamesSection.style.display="none"}function Re(){const e=S();if(!e.customCourtNamesList)return;const t=Math.max(1,n.courts||2);for(Array.isArray(n.customCourtNames)||(n.customCourtNames=[]);n.customCourtNames.length<t;)n.customCourtNames.push(`Court ${n.customCourtNames.length+1}`);e.customCourtNamesList.innerHTML=Array.from({length:t},(s,o)=>`
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(n.customCourtNames[o]||`Court ${o+1}`).replace(/"/g,"&quot;")}"
             oninput="window.updateCustomCourtName(${o}, this.value)"
             placeholder="Court ${o+1}">
    </div>
  `).join("")}function ct(e,t){n.customCourtNames[e]=t||`Court ${e+1}`,h()}function O(){const e=S();e.playerList.innerHTML=n.players.map((t,s)=>`
    <li class="player-item" data-id="${t.id}">
      <span><span class="player-number">${s+1}.</span> ${t.name}</span>
      <button class="player-remove" onclick="window.removePlayer(${t.id})">×</button>
    </li>
  `).join(""),e.playerCount.textContent=`(${n.players.length})`,e.generateBtn.disabled=n.players.length<4,n.players.length>=4?(e.playersHint.textContent=`${n.players.length} players ready`,e.playersHint.style.color="var(--success)"):(e.playersHint.textContent=`Add at least ${4-n.players.length} more player${4-n.players.length>1?"s":""}`,e.playersHint.style.color=""),K(),yt(),pt(),ke()}function ut(){const e=S();e.playerInputRow.style.display="flex",e.addPlayerBtn.style.display="none",e.playerNameInput.focus()}function xe(){const e=S();e.playerInputRow.style.display="none",e.addPlayerBtn.style.display="block",e.playerNameInput.value=""}function mt(){const e=document.getElementById("playerListWrapper"),t=document.getElementById("expandPlayersBtn");e.classList.contains("expanded")?(e.classList.remove("expanded"),t.innerHTML=`Show All Players (${n.players.length}) ▼`):(e.classList.add("expanded"),t.innerHTML="Show Less ▲")}function pt(){const e=document.getElementById("expandPlayersBtn"),t=document.getElementById("playerListWrapper");e&&!(t!=null&&t.classList.contains("expanded"))&&(e.innerHTML=`Show All Players (${n.players.length}) ▼`)}function yt(){const e=S(),t=new Set;n.preferredPartners.forEach(o=>{t.add(o.player1Id),t.add(o.player2Id)});const s=n.players.filter(o=>!t.has(o.id));e.addPartnerPairBtn.disabled=s.length<2}function K(){const e=S(),t=s=>{const o=new Set;return n.preferredPartners.forEach(a=>{a.id!==s&&(o.add(a.player1Id),o.add(a.player2Id))}),o};e.preferredPartnersList.innerHTML=n.preferredPartners.map(s=>{const o=t(s.id),a=n.players.filter(r=>r.id===s.player1Id||r.id===s.player2Id||!o.has(r.id)),i=a.filter(r=>r.id!==s.player2Id||r.id===s.player1Id),d=a.filter(r=>r.id!==s.player1Id||r.id===s.player2Id);return`
        <div class="partner-pair" data-pair-id="${s.id}">
          <select class="form-select" onchange="window.updatePreferredPair(${s.id}, 1, parseInt(this.value))">
            ${i.map(r=>`<option value="${r.id}" ${r.id===s.player1Id?"selected":""}>${r.name}</option>`).join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" onchange="window.updatePreferredPair(${s.id}, 2, parseInt(this.value))">
            ${d.map(r=>`<option value="${r.id}" ${r.id===s.player2Id?"selected":""}>${r.name}</option>`).join("")}
          </select>
          <button class="remove-pair-btn" onclick="window.removePreferredPair(${s.id})">Remove</button>
        </div>
      `}).join("")}function ft(){const e=S();e.importModal.style.display="flex",e.importTextarea.value="",e.importStatus.textContent="",e.importTextarea.focus()}function de(){const e=S();e.importModal.style.display="none"}function gt(){const e=S();if(e.matchTimerContainer){if(n.scoringMode!=="time"){e.matchTimerContainer.style.display="none",E&&(E.pause(),E=null);return}if(e.matchTimerContainer.style.display="flex",E)E.duration!==n.pointsPerMatch&&E.setDuration(n.pointsPerMatch);else{E=new lt({duration:n.pointsPerMatch||12,onTimeUpdate:s=>{e.timerDisplay&&(e.timerDisplay.textContent=s),document.title=`${s} - Tournament`},onStatusChange:s=>{s==="running"?(e.timerStartBtn.style.display="none",e.timerPauseBtn.style.display="inline-block",e.matchTimerContainer.classList.add("running"),e.matchTimerContainer.classList.remove("completed")):s==="paused"||s==="idle"?(e.timerStartBtn.style.display="inline-block",e.timerPauseBtn.style.display="none",e.matchTimerContainer.classList.remove("running"),s==="idle"&&e.matchTimerContainer.classList.remove("completed"),document.title="Tournament Generator - Padel Companion"):s==="completed"&&(e.matchTimerContainer.classList.remove("running"),e.matchTimerContainer.classList.add("completed"),document.title="TIME UP!")}}),e.timerDisplay.textContent=E.formatTime(n.pointsPerMatch*60),e.timerStartBtn.onclick=()=>E.start(),e.timerPauseBtn.onclick=()=>E.pause(),e.timerResetBtn.onclick=()=>E.reset(),e.timerAddBtn.onclick=()=>E.addTime(60),e.timerSubBtn&&(e.timerSubBtn.onclick=()=>E.addTime(-60));const t=()=>{const s=()=>{Ie("Set Timer Duration","Enter minutes (e.g. 12)",o=>{const a=parseInt(o);a>0?(n.pointsPerMatch=a,h(),E.setDuration(a),w(`Timer set to ${a} minutes`)):w("Invalid minutes","error")})};E.isRunning?D("Pause Timer?","The timer is currently running. Pause to change duration?","Pause & Edit",()=>{E.pause(),s()}):s()};e.timerDisplay.onclick=t}}}function F(){const e=S();gt();const t=n.schedule.length-1;e.roundsContainer.innerHTML=n.schedule.map((s,o)=>{const a=o===t,i=s.completed,d=i&&!a,r=i?s.matches.map(l=>`${l.score1}-${l.score2}`).join(" · "):"";return`
    <div class="round ${i?"completed":""} ${d?"collapsed":""}" 
         id="round-${o}" 
         data-round="${o}">
      <div class="round-header" onclick="window.toggleRoundCollapse(${o})">
        <span class="round-title">
          Round ${s.number} ${i?"(done)":""}
        </span>
        ${d?`<span class="round-summary">${r}</span>`:""}
        ${i?`<span class="collapse-icon">${d?"▶":"▼"}</span>`:""}
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${s.matches.map((l,c)=>`
            <div class="match-card">
              <div class="court-label">${dt(l.court)}</div>
              <div class="match-info-sub" style="font-size: 0.8em; color: var(--text-secondary); margin-bottom: 4px;">
                ${n.scoringMode==="total"?`Total ${n.pointsPerMatch}`:n.scoringMode==="race"?`Race to ${n.pointsPerMatch}`:`${n.pointsPerMatch} mins`}
              </div>
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
              ${i?`
              <div class="score-input-row">
                <span class="score-display">${l.score1} - ${l.score2}</span>
                <button class="btn btn-sm btn-ghost edit-score-btn" onclick="window.editRound(${o})">Edit</button>
              </div>
              `:`
              <div class="score-input-row">
                <input type="number" class="score-input" id="score-${o}-${c}-1" 
                       min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0" 
                       value="${l.score1||""}"
                       oninput="window.autoFillScore(${o}, ${c}, 1, this.value)">
                <span class="score-separator">-</span>
                <input type="number" class="score-input" id="score-${o}-${c}-2" 
                       min="0" max="${n.scoringMode==="total"?n.pointsPerMatch:999}" placeholder="0"
                       value="${l.score2||""}"
                       oninput="window.autoFillScore(${o}, ${c}, 2, this.value)">
              </div>
              `}
            </div>
          `).join("")}
        </div>
        ${s.byes&&s.byes.length>0?`
        <div class="waiting-players">
          <span class="waiting-label">Resting:</span>
          <span class="waiting-names">${s.byes.map(l=>l.name).join(", ")}</span>
        </div>
        `:""}
        ${!i&&a?`
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${n.manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${n.leaderboard.map(l=>`
              <button class="bye-chip ${n.manualByes.includes(l.id)?"selected":""}" 
                      onclick="window.toggleManualBye(${l.id})">
                ${l.name}
                <span class="bye-count">(${l.byeCount||0})</span>
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
  `}).join(""),ht(),Q(),Ne()}function k(){const e=S(),t=document.getElementById("toggleVisibilityBtn");t&&(t.textContent=n.hideLeaderboard?"Show Standings":"Hide Standings",t.title=n.hideLeaderboard?"Show Leaderboard":"Hide Leaderboard");const s=document.getElementById("togglePositionBtn");if(s&&(s.textContent=n.showPositionChanges?"Hide Rank Diff":"Show Rank Diff",s.title=n.showPositionChanges?"Hide Rank Changes":"Show Rank Changes"),!n.leaderboard||n.leaderboard.length===0){e.leaderboardBody.innerHTML='<tr><td colspan="7" class="text-center">No players yet</td></tr>';return}const o=[...n.leaderboard].sort((a,i)=>{switch(n.rankingCriteria){case"wins":return i.wins!==a.wins?i.wins-a.wins:i.points!==a.points?i.points-a.points:i.points-i.pointsLost-(a.points-a.pointsLost);case"winRatio":const d=a.played>0?a.wins/a.played:0,r=i.played>0?i.wins/i.played:0;return Math.abs(r-d)>.001?r-d:i.wins!==a.wins?i.wins-a.wins:i.points-a.points;case"pointRatio":const l=a.points+a.pointsLost,c=i.points+i.pointsLost,m=l>0?a.points/l:0,u=c>0?i.points/c:0;return Math.abs(u-m)>.001?u-m:i.points-a.points;case"points":default:return i.points!==a.points?i.points-a.points:i.wins!==a.wins?i.wins-a.wins:i.points-i.pointsLost-(a.points-a.pointsLost)}});if(n.hideLeaderboard){const a=[...o].sort(()=>Math.random()-.5);e.leaderboardBody.innerHTML=a.map(i=>`
    <tr>
      <td>-</td>
      <td>${i.name}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>${i.played}</td>
    </tr>
  `).join("")}else o.forEach((a,i)=>{const d=i+1,r=a.previousRank||d;a.rankChange=r-d,a.previousRank=d}),e.leaderboardBody.innerHTML=o.map((a,i)=>{let d="";n.showPositionChanges&&a.played>0&&(a.rankChange>0?d='<span class="rank-up">▲</span>':a.rankChange<0?d='<span class="rank-down">▼</span>':d='<span class="rank-same">●</span>');const r=a.points-(a.pointsLost||0),l=a.played>0?Math.round((a.wins||0)/a.played*100):0,c=r>0?"+":"";return`
    <tr>
      <td>${i+1} ${d}</td>
      <td class="player-name-cell">${a.name}</td>
      <td class="font-bold">${a.points}</td>
      <td>${a.wins||0}</td>
      <td class="${r>0?"text-success":r<0?"text-error":""}">${c}${r}</td>
      <td>${l}%</td>
      <td>${a.played}</td>
    </tr>
  `}).join("")}function R(){const e=S(),t=e.format?e.format.value:"americano",s=t==="team"||t==="teamMexicano",o=document.getElementById("playersHeader");o&&(o.querySelector(".player-count"),o.firstChild&&(o.firstChild.textContent=s?"Teams ":"Players ")),e.addPlayerBtn&&(e.addPlayerBtn.textContent=s?"+ Add Team":"+ Add Player"),e.playerNameInput&&(e.playerNameInput.placeholder=s?"Enter team name...":"Enter name...");const a=document.querySelector(".setup-card");if(!a)return;a.querySelectorAll("input, select, button").forEach(v=>{n.isLocked&&!v.classList.contains("always-enabled")?(v.disabled=!0,v.classList.add("locked")):(v.disabled=!1,v.classList.remove("locked"))});const d=document.getElementById("runningBadge");n.isLocked?(e.generateBtn.style.display="none",d&&(d.style.display="inline-flex")):(e.generateBtn.style.display="block",d&&(d.style.display="none"),e.generateBtn.textContent="Generate Schedule",e.generateBtn.disabled=n.players.length<4);const r=document.getElementById("advancedSettingsContent"),l=document.getElementById("maxRepeatsContainer"),c=document.getElementById("pairingStrategyContainer"),m=document.getElementById("preferredPartnersContainer"),u=t==="mexicano",g=u||t==="teamMexicano";r&&(r.style.display=g?"block":"none"),l&&(l.style.display=g?"flex":"none"),c&&(c.style.display=u?"flex":"none"),m&&(m.style.display=u?"block":"none");const f=document.getElementById("strictStrategy");if(f&&e.pairingStrategy){const v=e.pairingStrategy.value==="optimal";f.disabled=v,f.parentElement&&(f.parentElement.style.opacity=v?"0.5":"1")}const p=document.getElementById("undoBtn");p&&(p.disabled=!Ve())}let ue=!1;function Q(){const e=S(),t=n.gridColumns,s=document.querySelectorAll(".matches-grid");e.gridColumns&&(e.gridColumns.value=t),t===0?(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent="Auto"),s.forEach(o=>{o.style.gridTemplateColumns=""})):(e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=t),s.forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}))}function ht(){const e=S();if(!e.gridColumns)return;let t=n.courts||2;if(n.schedule.length>0){const s=n.schedule[n.schedule.length-1];s&&s.matches&&(t=Math.max(t,s.matches.length))}t=Math.min(Math.max(t,1),6),e.gridColumns.max=t,n.maxCourts=t,n.gridColumns>t&&n.gridColumns!==0&&(n.gridColumns=t,Q())}function vt(){const e=document.querySelector(".matches-grid");if(!e)return n.maxCourts||2;const t=e.offsetWidth,o=Math.floor(t/180),a=n.maxCourts||n.courts||2;return Math.min(Math.max(o,1),a)}function Ae(){const e=S();if(ue||n.gridColumns!==0)return;const t=vt();document.querySelectorAll(".matches-grid").forEach(o=>{o.style.gridTemplateColumns=`repeat(${t}, 1fr)`}),e.gridColumns&&(e.gridColumns.value=t),e.gridColumnsLabel&&(e.gridColumnsLabel.textContent=`Auto (${t})`)}function bt(){const e=S(),t=parseInt(e.gridColumns.value);t===0?(ue=!1,Ae()):ue=!0,n.gridColumns=t,Q(),h()}function Ne(){const e=S(),t=n.textSize,s=t/100,o=document.getElementById("scheduleSection");o&&o.style.setProperty("--text-scale",s),e.textSize&&(e.textSize.value=t),e.textSizeLabel&&(e.textSizeLabel.textContent=`${t}%`)}function wt(){const e=document.getElementById("roundScale"),t=document.getElementById("roundScaleLabel"),s=document.getElementById("scheduleSection");if(!e)return;const o=parseInt(e.value),a=o/100;s&&s.style.setProperty("--round-scale",a),t&&(t.textContent=`${o}%`)}function St(){document.querySelectorAll(".form-select").forEach(t=>{if(t.closest(".custom-select-wrapper")||t.classList.contains("no-custom"))return;const s=document.createElement("div");s.classList.add("custom-select-wrapper"),t.parentNode.insertBefore(s,t),s.appendChild(t);const o=document.createElement("div");o.classList.add("custom-select");const a=document.createElement("div");a.classList.add("custom-select-trigger"),t.classList.contains("btn-sm")&&a.classList.add("btn-sm"),a.innerHTML=`<span>${t.options[t.selectedIndex].text}</span>`;const i=document.createElement("div");i.classList.add("custom-options"),Array.from(t.options).forEach(d=>{const r=document.createElement("div");r.classList.add("custom-option"),r.textContent=d.text,r.dataset.value=d.value,d.selected&&r.classList.add("selected"),r.addEventListener("click",()=>{t.value=d.dataset.value,t.dispatchEvent(new Event("change",{bubbles:!0})),a.innerHTML=`<span>${d.text}</span>`,i.querySelectorAll(".custom-option").forEach(l=>l.classList.remove("selected")),r.classList.add("selected"),o.classList.remove("open"),i.classList.remove("show")}),i.appendChild(r)}),o.appendChild(a),o.appendChild(i),s.appendChild(o),a.addEventListener("click",d=>{d.stopPropagation(),document.querySelectorAll(".custom-select.open").forEach(r=>{r!==o&&(r.classList.remove("open"),r.querySelector(".custom-options").classList.remove("show"))}),o.classList.toggle("open"),i.classList.toggle("show")}),t.style.display="none"}),document.addEventListener("click",t=>{t.target.closest(".custom-select")||document.querySelectorAll(".custom-select.open").forEach(s=>{s.classList.remove("open"),s.querySelector(".custom-options").classList.remove("show")})})}function Ct(e,t,s,o){let a=parseInt(o);if(isNaN(a)||a<0||n.scoringMode!=="total")return;const i=parseInt(n.pointsPerMatch);if(isNaN(i)||i<=0)return;if(a>i){a=i;const c=document.getElementById(`score-${e}-${t}-${s}`);c&&(c.value=a)}const d=s===1||s==="1"?2:1,r=i-a,l=document.getElementById(`score-${e}-${t}-${d}`);if(l&&r>=0){l.value=r;const c=document.getElementById(`score-${e}-${t}-${s}`);c&&c.classList.remove("error"),l.classList.remove("error")}}function xt(e){const t=document.getElementById(`round-${e}`);if(!t)return;if(t.classList.contains("collapsed")){t.classList.remove("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▼");const a=t.querySelector(".round-summary");a&&(a.style.display="none")}else{t.classList.add("collapsed");const o=t.querySelector(".collapse-icon");o&&(o.textContent="▶");const a=t.querySelector(".round-summary");a&&(a.style.display="")}}function Lt(e){const t=n.manualByes.indexOf(e);if(t!==-1){n.manualByes.splice(t,1),F();return}const s=n.courts*4,o=n.leaderboard.length,a=Math.max(0,o-s);if(a===0){w(`All ${o} players needed for ${n.courts} courts.`);return}if(n.manualByes.length>=a){w(`Max ${a} can rest. Deselect someone first.`);return}n.manualByes.push(e),F()}function Et(){const e=n.schedule.length-1,t=n.schedule[e];let s=!0;if(t.matches.forEach((o,a)=>{const i=document.getElementById(`score-${e}-${a}-1`),d=document.getElementById(`score-${e}-${a}-2`),r=parseInt(i==null?void 0:i.value)||0,l=parseInt(d==null?void 0:d.value)||0;n.scoringMode==="total"?r+l!==n.pointsPerMatch?(s=!1,i==null||i.classList.add("error"),d==null||d.classList.add("error")):(i==null||i.classList.remove("error"),d==null||d.classList.remove("error")):r<0||l<0?(s=!1,i==null||i.classList.add("error"),d==null||d.classList.add("error")):(i==null||i.classList.remove("error"),d==null||d.classList.remove("error")),o.score1=r,o.score2=l;const c=r===l,m=r>l,u=l>r;o.team1[1]?(j(o.team1[0].id,r,l,m,c,o.team1[1].id),j(o.team1[1].id,r,l,m,c,o.team1[0].id),j(o.team2[0].id,l,r,u,c,o.team2[1].id),j(o.team2[1].id,l,r,u,c,o.team2[0].id)):(j(o.team1[0].id,r,l,m,c,null),j(o.team2[0].id,l,r,u,c,null))}),!s){n.scoringMode==="total"?w(`Scores must sum to ${n.pointsPerMatch}`):w("Please enter valid positive scores");return}if(se(),t.completed=!0,t.byes&&t.byes.length>0&&t.byes.forEach(o=>{const a=n.leaderboard.find(i=>i.id===o.id);a&&(a.byeCount=(a.byeCount||0)+1)}),n.manualByes=[],n.currentRound++,n.format==="americano"&&n.allRounds&&n.currentRound<=n.allRounds.length){const o={...n.allRounds[n.currentRound-1]};n.schedule.push(o)}else if(n.format==="team"&&n.allRounds&&n.currentRound<=n.allRounds.length){const o={...n.allRounds[n.currentRound-1]};n.schedule.push(o)}else if(n.format==="teamMexicano"){if(n.currentRound<=8){const o=at();o.matches.length>0&&n.schedule.push(o)}}else if(n.format==="mexicano"&&n.currentRound<=8){const o=rt(n.leaderboard);o.matches.length>0&&n.schedule.push(o)}S(),k(),F(),h(),setTimeout(()=>{const o=n.schedule.length-1,a=document.getElementById(`round-${o}`);a&&a.scrollIntoView({behavior:"smooth",block:"start"})},100)}function Bt(e){const t=n.schedule[e];if(!(!t||!t.completed||n.schedule.length>e+1&&!confirm(`Editing Round ${e+1} will remove ${n.schedule.length-e-1} subsequent round(s). Continue?`))){se();for(let o=e;o<n.schedule.length;o++){const a=n.schedule[o];a.completed&&a.matches.forEach(i=>{i.team1[1]?(U(i.team1[0].id,i.score1||0,i.score2||0,i.score1>i.score2,i.score1===i.score2),U(i.team1[1].id,i.score1||0,i.score2||0,i.score1>i.score2,i.score1===i.score2),U(i.team2[0].id,i.score2||0,i.score1||0,i.score2>i.score1,i.score1===i.score2),U(i.team2[1].id,i.score2||0,i.score1||0,i.score2>i.score1,i.score1===i.score2)):(U(i.team1[0].id,i.score1||0,i.score2||0,i.score1>i.score2,i.score1===i.score2),U(i.team2[0].id,i.score2||0,i.score1||0,i.score2>i.score1,i.score1===i.score2))})}n.schedule=n.schedule.slice(0,e+1),t.completed=!1,n.currentRound=e,k(),F(),h(),w(`Editing Round ${e+1}`)}}function Pt(){const e=S();n.format=e.format.value,n.courts=parseInt(e.courts.value),n.scoringMode=e.scoringMode.value,n.pointsPerMatch=parseInt(e.points.value),n.currentRound=1;const t=n.format==="team"||n.format==="teamMexicano"?2:4,s=Math.floor(n.players.length/t),o=()=>{se(),n.leaderboard=n.players.map(i=>({...i,points:0,wins:0,losses:0,pointsLost:0,played:0,byeCount:0,playedWith:[]})),n.format==="americano"?(n.allRounds=nt(),n.schedule=[n.allRounds[0]]):n.format==="team"?(n.allRounds=ot(),n.schedule=[n.allRounds[0]]):n.format==="teamMexicano"?(n.schedule=st(),n.allRounds=null):(n.schedule=it(),n.allRounds=null),e.leaderboardSection.style.display="block",k(),F(),e.scheduleSection.style.display="block";const a=document.getElementById("tournamentActionsSection");a&&(a.style.display="block"),e.scheduleSection.scrollIntoView({behavior:"smooth"}),n.isLocked=!0,R(),h()};if(n.courts>s){if(s===0){tt("Not Enough Players",`You need at least ${t} players/teams to start!`);return}const a=n.courts;n.courts=s,e.courts&&(e.courts.value=n.courts),w(`Adjusted courts: ${a} → ${s}`)}o()}function It(){const e=S();D("Reset Tournament?","This will clear all rounds and scores.","Reset",()=>{se(),n.schedule=[],n.currentRound=0,n.leaderboard=[],n.allRounds=null,n.isLocked=!1,n.hideLeaderboard=!1,n.manualByes=[],e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none",R(),h(),w("Tournament reset")},!0)}function $t(){n.hideLeaderboard=!n.hideLeaderboard;const e=document.getElementById("toggleVisibilityBtn");e&&(e.textContent=n.hideLeaderboard?"Show Standings":"Hide Standings",e.title=n.hideLeaderboard?"Show Leaderboard":"Hide Leaderboard"),k(),h()}function Mt(){n.showPositionChanges=!n.showPositionChanges;const e=document.getElementById("togglePositionBtn");e&&(e.textContent=n.showPositionChanges?"Hide Rank Diff":"Show Rank Diff",e.title=n.showPositionChanges?"Hide Rank Changes":"Show Rank Changes"),k(),h()}function kt(){const e=document.getElementById("rankingCriteria");e&&(n.rankingCriteria=e.value,k(),h())}function Tt(e){D("End Tournament?","This will show final standings. This action cannot be undone.","End Tournament",()=>{n.isLocked=!1,n.hideLeaderboard=!1,R();const t=[...n.leaderboard].sort((s,o)=>o.points-s.points);Ht(),w("Tournament saved to history"),e&&e(t),h()},!0)}function Rt(){const e=document.getElementById("advancedSettingsContent"),t=document.getElementById("advancedSettingsToggle"),s=t.querySelector(".toggle-text"),o=t.querySelector(".toggle-icon");e.style.display==="none"?(e.style.display="block",t.classList.add("expanded"),s&&(s.textContent="Hide Advanced Settings"),o&&(o.style.transform="rotate(180deg)")):(e.style.display="none",t.classList.remove("expanded"),s&&(s.textContent="Show Advanced Settings"),o&&(o.style.transform="rotate(0deg)"))}function At(){document.getElementById("scheduleToolbar").classList.toggle("collapsed")}function Nt(e=null){const t=e||n,s=new Date().toLocaleDateString(),o=new Date().toLocaleTimeString();let a="data:text/csv;charset=utf-8,";a+=`Tournament Results
`,a+=`Date,${s} ${o}
`,a+=`Format,${t.format}
`,a+=`Scoring,${t.scoringMode} (${t.pointsPerMatch})

`,a+=`Final Standings
`,a+=`Rank,Player,Points,Wins,Played,Points Lost,Diff
`,[...t.leaderboard].sort((l,c)=>c.points-l.points).forEach((l,c)=>{const m=(l.points||0)-(l.pointsLost||0);a+=`${c+1},"${l.name}",${l.points},${l.wins},${l.played},${l.pointsLost||0},${m}
`}),a+=`
`,a+=`Match History
`,a+=`Round,Court,Team 1,Score T1,Score T2,Team 2
`,t.schedule.forEach(l=>{l.completed&&l.matches.forEach(c=>{const m=c.team1.map(g=>g.name).join(" & "),u=c.team2.map(g=>g.name).join(" & ");let b=`Court ${c.court}`;t.courtFormat==="custom"&&t.customCourtNames&&t.customCourtNames[c.court-1]?b=t.customCourtNames[c.court-1]:t.courtFormat==="number"&&(b=`${c.court}`),a+=`Round ${l.number},"${b}","${m}",${c.score1},${c.score2},"${u}"
`})});const d=encodeURI(a),r=document.createElement("a");r.setAttribute("href",d),r.setAttribute("download",`padel_tournament_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(r),r.click(),document.body.removeChild(r)}async function Dt(e=null){var i;const t=e||n;let o=`Padel Tournament Results - ${new Date().toLocaleDateString()}

`;o+=`Winner: ${((i=t.leaderboard[0])==null?void 0:i.name)||"Unknown"}
`,o+=`Format: ${t.format}

`,o+=`Top Standings:
`,[...t.leaderboard].sort((d,r)=>r.points-d.points).slice(0,5).forEach((d,r)=>{o+=`${r+1}. ${d.name}: ${d.points} pts (${d.wins}W)
`}),o+=`
Full results: https://padelcompanion.se/tournament/`;try{await navigator.clipboard.writeText(o),w("Results copied to clipboard")}catch(d){console.error("Failed to copy: ",d),w("Failed to copy results","error")}}const pe="padel_history_v1";function Ht(){var o;const e=Z(),t=Ge(),s={id:Date.now().toString(),savedAt:new Date().toISOString(),summary:{date:new Date().toISOString(),format:t.format,winner:((o=t.leaderboard[0])==null?void 0:o.name)||"Unknown",playerCount:t.players.length,roundCount:t.schedule.length},data:t};return e.unshift(s),e.length>20&&e.pop(),localStorage.setItem(pe,JSON.stringify(e)),s}function Z(){try{const e=localStorage.getItem(pe);return e?JSON.parse(e):[]}catch(e){return console.error("Failed to parse history",e),[]}}function Ft(e){D("Delete this tournament from history?","This action cannot be undone.","Delete",()=>{const s=Z().filter(o=>o.id!==e);localStorage.setItem(pe,JSON.stringify(s)),De(),w("Tournament deleted")},!0)}function zt(e){const s=Z().find(o=>o.id===e);if(!s){w("Tournament details not found","error");return}D("Load this tournament?","This will overwrite the current tournament.","Load",()=>{try{Be(s.data),F(),k(),h(),w("Tournament loaded successfully"),document.getElementById("scheduleSection").style.display="block",document.getElementById("leaderboardSection").style.display="block"}catch(o){console.error("Failed to load tournament",o),w("Error loading tournament","error")}},!1)}let oe=[];function qt(){De();const e=document.getElementById("historySearch");e&&e.addEventListener("input",t=>{const s=t.target.value.toLowerCase();Ot(s)})}function Ot(e){if(!e){me(oe);return}const t=oe.filter(s=>{var m,u,b,g,f,p,v,T;const o=(((m=s.summary)==null?void 0:m.winner)||((b=(u=s.players)==null?void 0:u[0])==null?void 0:b.name)||"").toLowerCase(),a=(((g=s.summary)==null?void 0:g.format)||s.format||"").toLowerCase(),i=((f=s.summary)==null?void 0:f.date)||s.date||"",d=String(((p=s.summary)==null?void 0:p.playerCount)||((v=s.players)==null?void 0:v.length)||""),r=String(((T=s.summary)==null?void 0:T.roundCount)||""),c=new Date(i).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}).toLowerCase();return o.includes(e)||a.includes(e)||c.includes(e)||d.includes(e)||r.includes(e)});me(t)}function De(){oe=Z(),me(oe)}function me(e){const t=document.getElementById("historyTableBody"),s=document.getElementById("historyEmptyStatePage");if(!(!t||!s)){if(t.innerHTML="",e.length===0){t.parentElement.style.display="none",s.style.display="block";return}t.parentElement.style.display="table",s.style.display="none",window.deleteHistoryItem=Ft,window.loadTournament=zt,window.downloadHistoryItem=Wt,t.innerHTML=e.map(o=>{var b,g,f;const a=o.summary?o.summary.date:o.date,i=o.summary?o.summary.format:o.format||"Unknown",d=o.summary?o.summary.winner:((g=(b=o.players)==null?void 0:b[0])==null?void 0:g.name)||"Unknown",r=o.summary?o.summary.playerCount:((f=o.players)==null?void 0:f.length)||0,l=new Date(a),c=l.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),m=l.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),u=!!o.data;return`
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${c}</span>
            <span class="date-sub">${m}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-sm badge-outline">${i}</span>
        </td>
        <td>
          <div class="winner-cell">
            <span class="trophy-icon">🏆</span>
            <span class="winner-name">${d}</span>
          </div>
        </td>
        <td>${r}</td>
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
                ${u?"":"disabled"}
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
      `}).join("")}}function Wt(e){const s=Z().find(o=>o.id===e);s&&s.data&&window.exportTournamentData&&window.exportTournamentData(s.data)}document.addEventListener("DOMContentLoaded",()=>{});const He="padelcompanion-theme";function jt(){const e=localStorage.getItem(He),t=!e||e==="dark";return document.documentElement.setAttribute("data-theme",t?"dark":"light"),t?"dark":"light"}function Ut(){const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";return document.documentElement.setAttribute("data-theme",t),localStorage.setItem(He,t),t}function Fe(e,t){if(!e)return;const s=e.querySelector(".theme-icon");s&&(s.textContent=t==="dark"?"🌙":"☀️")}function Le(e){if(!e.trim())return!1;const t=e.trim();return n.players.length>=24?(w("Maximum 24 players allowed"),!1):n.players.some(s=>s.name.toLowerCase()===t.toLowerCase())?(w(`Player "${t}" already exists`),!1):(n.players.push({id:ae(),name:t,points:0,wins:0,losses:0,pointsLost:0,played:0}),h(),!0)}function Vt(e){n.players=n.players.filter(t=>t.id!==e),h()}function _t(e){if(console.log("removeAllPlayers called, players:",n.players.length),n.players.length===0){console.log("No players to remove");return}D("Remove All Players?","Are you sure you want to clear the entire player list? This action cannot be undone.","Yes, Remove All",()=>{console.log("Confirm callback executed"),n.players=[],n.preferredPartners=[],h(),console.log("Players cleared, state:",n.players),e&&e()},!0)}function Gt(e){if(!e.trim())return{added:0,duplicates:0,hitLimit:!1};const t=e.split(/[\n,]+/).map(i=>i.trim()).filter(i=>i);if(t.length===0)return{added:0,duplicates:0,hitLimit:!1};let s=0,o=0,a=!1;for(const i of t){if(n.players.length>=24){a=!0;break}if(n.players.some(d=>d.name.toLowerCase()===i.toLowerCase())){o++;continue}n.players.push({id:ae(),name:i,points:0,wins:0,losses:0,pointsLost:0,played:0}),s++}return h(),{added:s,duplicates:o,hitLimit:a}}function Xt(e){const t={id:ae(),name:e,points:0,wins:0,losses:0,played:0,pointsLost:0,byeCount:0,playedWith:[]};return n.players.push(t),n.leaderboard.push(t),h(),!0}function Yt(){const e=new Set;return n.preferredPartners.forEach(t=>{e.add(t.player1Id),e.add(t.player2Id)}),n.players.filter(t=>!e.has(t.id))}function Jt(){const e=Yt();e.length<2||(n.preferredPartners.push({id:ae(),player1Id:e[0].id,player2Id:e[1].id}),h())}function Kt(e){n.preferredPartners=n.preferredPartners.filter(t=>t.id!==e),h()}function Qt(e,t,s){const o=n.preferredPartners.find(a=>a.id===e);o&&(t===1?o.player1Id=s:o.player2Id=s,h())}function Zt(e){let t;const s=document.getElementById(e);window.addEventListener("beforeinstallprompt",o=>{o.preventDefault(),t=o,s&&(s.style.display="inline-flex",s.addEventListener("click",async()=>{s.style.display="none",t.prompt(),(await t.userChoice).outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),t=null}))}),window.addEventListener("appinstalled",()=>{s&&(s.style.display="none"),t=null,console.log("PWA was installed")}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/registerSW.js")})}function en(){Zt("installBtn");const e=jt(),t=Me();Fe(t.themeToggle,e),_e(),t.format.value=n.format,t.courts.value=n.courts,t.scoringMode.value=n.scoringMode,t.points.value=n.pointsPerMatch,t.courtFormat.value=n.courtFormat,t.maxRepeats.value=n.maxRepeats,t.pairingStrategy&&(t.pairingStrategy.value=n.pairingStrategy);const s=document.getElementById("rankingCriteria");s&&(s.value=n.rankingCriteria);const o=document.getElementById("strictStrategy");if(o&&(o.checked=n.strictStrategy||!1),Te(),O(),n.schedule.length>0){t.scheduleSection.style.display="block",t.leaderboardSection.style.display="block";const a=document.getElementById("tournamentActionsSection");a&&(a.style.display="block"),F(),k(),R(),Q()}tn(t),St(),qt(),window.addEventListener("resize",Ae)}function tn(e){e.themeToggle.addEventListener("click",()=>{const c=Ut();Fe(e.themeToggle,c)});const t=document.getElementById("navToggle"),s=document.getElementById("nav");t&&s&&(t.addEventListener("click",()=>{s.classList.toggle("open"),t.classList.toggle("active")}),document.addEventListener("click",c=>{s.classList.contains("open")&&!s.contains(c.target)&&!t.contains(c.target)&&(s.classList.remove("open"),t.classList.remove("active"))}),s.querySelectorAll("a").forEach(c=>{c.addEventListener("click",()=>{s.classList.remove("open"),t.classList.remove("active")})}));const o=document.getElementById("undoBtn");o&&(o.addEventListener("click",()=>{if(Ue())if(w("Undo successful"),e.format.value=n.format,O(),F(),k(),R(),Q(),n.schedule.length>0){e.scheduleSection.style.display="block",e.leaderboardSection.style.display="block";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="block")}else{e.scheduleSection.style.display="none",e.leaderboardSection.style.display="none";const c=document.getElementById("tournamentActionsSection");c&&(c.style.display="none")}}),document.addEventListener("keydown",c=>{(c.ctrlKey||c.metaKey)&&c.key==="z"&&!c.shiftKey&&(c.preventDefault(),o.click())})),e.addPlayerBtn.addEventListener("click",ut),e.cancelAddBtn.addEventListener("click",xe),e.clearAllPlayersBtn&&e.clearAllPlayersBtn.addEventListener("click",()=>{_t(()=>{O(),K(),R()})}),e.importPlayersBtn.addEventListener("click",ft),e.closeImportModal.addEventListener("click",de),e.cancelImportBtn.addEventListener("click",de),e.confirmImportBtn.addEventListener("click",()=>{const c=e.importTextarea.value,m=Gt(c);let u=`Added ${m.added} players.`;m.duplicates>0&&(u+=` Skipped ${m.duplicates} duplicates.`),m.hitLimit&&(u+=" Stopped at 24 max limit."),e.importStatus.textContent=u,O(),m.added>0&&m.duplicates===0&&!m.hitLimit&&(setTimeout(de,1500),w(`Imported ${m.added} players`))}),e.confirmAddBtn.addEventListener("click",()=>{Le(e.playerNameInput.value)&&(e.playerNameInput.value="",e.playerNameInput.focus(),O())}),e.playerNameInput.addEventListener("keydown",c=>{c.key==="Enter"?Le(e.playerNameInput.value)&&(e.playerNameInput.value="",O()):c.key==="Escape"&&xe()}),e.format.addEventListener("change",()=>{n.format=e.format.value,R(),h()}),e.courts.addEventListener("change",()=>{n.courts=parseInt(e.courts.value),h()}),e.points.addEventListener("change",()=>{n.pointsPerMatch=parseInt(e.points.value),h()}),e.scoringMode.addEventListener("change",()=>{n.scoringMode=e.scoringMode.value,h()}),e.courtFormat.addEventListener("change",()=>{n.courtFormat=e.courtFormat.value,Te(),h()}),e.courts.addEventListener("input",()=>{const m=e.courts.value;if(m==="")return;let u=parseInt(m)||1;u=Math.max(1,Math.min(50,u)),e.courts.value=u,n.courts=u,h(),n.courtFormat==="custom"&&Re()}),e.maxRepeats.addEventListener("change",c=>{const m=parseInt(c.target.value),u=n.maxRepeats;n.isLocked?(c.target.value=u,D("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.maxRepeats=m,e.maxRepeats.value=m,h(),w("Max Partner Repeats updated")})):(n.maxRepeats=m,h())});const a=document.getElementById("strictStrategy");a&&a.addEventListener("change",c=>{const m=c.target.checked,u=n.strictStrategy;n.isLocked?(c.target.checked=!!u,D("Update Strict Mode?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.strictStrategy=m,a.checked=m,h(),w("Strict Mode updated")})):(n.strictStrategy=m,h())}),e.pairingStrategy&&e.pairingStrategy.addEventListener("change",c=>{const m=c.target.value,u=n.pairingStrategy;n.isLocked?(c.target.value=u,D("Change Matchup Setting?","The tournament is running. This change will affect how future rounds are generated.","Apply Change",()=>{n.pairingStrategy=m,e.pairingStrategy.value=m,h(),R(),w("Pairing Strategy updated")})):(n.pairingStrategy=m,h(),R())}),e.addPartnerPairBtn.addEventListener("click",()=>{Jt(),K()});const i=document.getElementById("helpFormat");i&&i.addEventListener("click",()=>{le("Tournament Formats",`
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
        `)});const r=document.getElementById("helpMatchup");r&&r.addEventListener("click",()=>{le("Matchup Rules",`
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
        `)}),e.generateBtn.addEventListener("click",Pt),e.printBtn.addEventListener("click",()=>window.print()),e.resetBtn.addEventListener("click",It),e.gridColumns&&e.gridColumns.addEventListener("input",bt),e.textSize&&e.textSize.addEventListener("input",()=>{n.textSize=parseInt(e.textSize.value),Ne(),h()});const l=document.getElementById("roundScale");l&&l.addEventListener("input",wt)}window.removePlayer=e=>{Vt(e),O()};window.togglePlayerList=mt;window.updatePreferredPair=(e,t,s)=>{Qt(e,t,s),K()};window.removePreferredPair=e=>{Kt(e),K()};window.updateCustomCourtName=ct;window.autoFillScore=Ct;window.toggleManualBye=Lt;window.toggleRoundCollapse=xt;window.completeRound=Et;window.editRound=Bt;window.toggleLeaderboardVisibility=$t;window.togglePositionChanges=Mt;window.updateRankingCriteria=kt;window.endTournament=()=>Tt(Ze);window.validateCourts=ke;window.toggleAdvancedSettings=Rt;window.toggleToolbar=At;window.exportTournamentData=Nt;window.shareResults=Dt;console.log("Global functions registered:",{autoFillScore:typeof window.autoFillScore,validateCourts:typeof window.validateCourts});window.promptAddLatePlayer=()=>{const e=n.format==="team"||n.format==="teamMexicano";Ie(e?"Add Late Team":"Add Late Player",e?"Enter new team name:":"Enter new player name:",t=>{if(t&&t.trim()){if(n.format==="americano"||n.format==="team"){if(!confirm("Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"))return;n.format="mexicano",n.allRounds=null,w("Switched to Mexicano format")}Xt(t.trim());const s=document.getElementById("playerCount");s&&(s.textContent=`(${n.players.length})`),k(),w(`Added ${t.trim()} to tournament`)}})};en();
