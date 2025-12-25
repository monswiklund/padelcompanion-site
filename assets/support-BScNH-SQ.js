document.addEventListener("DOMContentLoaded",()=>{b(),f(),g()});function b(){const l=document.getElementById("faqSearch"),c=document.querySelectorAll(".faq-category"),t=document.getElementById("no-results");l&&l.addEventListener("input",n=>{const i=n.target.value.toLowerCase();let s=!1;c.forEach(o=>{const a=o.querySelectorAll(".faq-item");let r=!1;a.forEach(e=>{const u=e.querySelector("summary").textContent.toLowerCase(),m=e.querySelector(".faq-answer").textContent.toLowerCase();u.includes(i)||m.includes(i)?(e.style.display="block",r=!0,s=!0):e.style.display="none"}),o.style.display=r?"block":"none"}),t&&t.classList.toggle("hidden",s)})}function f(){document.querySelectorAll(".faq-feedback button").forEach(c=>{c.addEventListener("click",function(){const t=this.closest(".faq-feedback");t.innerHTML='<span class="feedback-thanks">Thanks for your feedback!</span>'})})}const d={"General Inquiry":{subtitle:"We'll get back to you within 24 hours.",body:`Hi Padel Companion,

I have a question about...`},"Bug Report":{subtitle:"Help us squash this bug! Please be as detailed as possible.",body:`Hi Team,

I found a bug.

Steps to reproduce:
1. 
2. 
3. 

Expected behavior:

Actual behavior:
`},"Feature Request":{subtitle:"We love new ideas! Tell us what would make the app better.",body:`Hi Team,

I have an idea for a feature:

`},Partnership:{subtitle:"Let's work together!",body:`Hi,

I'm interested in partnering with Padel Companion because...`}};function g(){const l=document.getElementById("contactForm");if(!l)return;const c=document.getElementById("subject"),t=document.getElementById("message"),n=document.getElementById("formSubtitle");c&&t&&c.addEventListener("change",i=>{const s=i.target.value,o=d[s];if(o){n&&(n.textContent=o.subtitle,n.style.display="block",n.className="form-hint animate-fade-in",n.style.color="var(--accent)",n.style.marginTop="8px");const a=t.value.trim(),r=Object.values(d).some(e=>e.body.trim()===a);(!a||r)&&(t.value=o.body)}}),l.addEventListener("submit",i=>{i.preventDefault();const s=document.getElementById("name").value,o=document.getElementById("email").value,a=document.getElementById("subject").value;let e=`${document.getElementById("message").value}

`;e+=`--------------------------------
`,e+=`Sender: ${s}
`,e+=`Email: ${o}
`,a==="Bug Report"&&(e+=`--------------------------------
`,e+=`Technical Details:
`,e+=`Browser: ${navigator.userAgent}
`,e+=`Screen: ${window.screen.width}x${window.screen.height}
`,e+=`Page: ${window.location.pathname}
`);const u=`mailto:wiklund.labs@gmail.com?subject=${encodeURIComponent(a)} - ${encodeURIComponent(s)}&body=${encodeURIComponent(e)}`;if(u.length>2e3){alert("Your message is too long for the default email client. Please shorten it or email us directly at wiklund.labs@gmail.com");return}window.location.href=u})}
