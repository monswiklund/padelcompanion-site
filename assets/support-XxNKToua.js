import"./layout-BrqSt11f.js";/* empty css                */import"./main-sI7hfvj0.js";document.addEventListener("DOMContentLoaded",()=>{m(),f(),g()});function m(){const n=document.getElementById("faqSearch"),o=document.querySelectorAll(".faq-category"),t=document.getElementById("no-results");n&&n.addEventListener("input",l=>{const s=l.target.value.toLowerCase();let i=!1;o.forEach(e=>{const a=e.querySelectorAll(".faq-item");let r=!1;a.forEach(c=>{const d=c.querySelector("summary").textContent.toLowerCase(),u=c.querySelector(".faq-answer").textContent.toLowerCase();d.includes(s)||u.includes(s)?(c.style.display="block",r=!0,i=!0):c.style.display="none"}),e.style.display=r?"block":"none"}),t&&t.classList.toggle("hidden",i)})}function f(){document.querySelectorAll(".faq-feedback button").forEach(o=>{o.addEventListener("click",function(){const t=this.closest(".faq-feedback");t.innerHTML='<span class="feedback-thanks">Thanks for your feedback!</span>'})})}function g(){const n=document.getElementById("contactForm");n&&n.addEventListener("submit",o=>{o.preventDefault();const t=document.getElementById("name").value,l=document.getElementById("email").value,s=document.getElementById("subject").value;let e=`${document.getElementById("message").value}

`;e+=`--------------------------------
`,e+=`Sender: ${t}
`,e+=`Email: ${l}
`,s==="Bug Report"&&(e+=`--------------------------------
`,e+=`Technical Details:
`,e+=`Browser: ${navigator.userAgent}
`,e+=`Screen: ${window.screen.width}x${window.screen.height}
`,e+=`Page: ${window.location.pathname}
`);const a=`mailto:wiklund.labs@gmail.com?subject=${encodeURIComponent(s)} - ${encodeURIComponent(t)}&body=${encodeURIComponent(e)}`;if(a.length>2e3){alert("Your message is too long for the default email client. Please shorten it or email us directly at wiklund.labs@gmail.com");return}window.location.href=a})}
