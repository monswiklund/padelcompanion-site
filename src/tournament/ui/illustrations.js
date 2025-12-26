/**
 * SVG Illustrations for empty states
 */

const primaryColor = "var(--accent)";
const secondaryColor = "var(--text-muted)";
const bgShapeColor = "var(--bg-tertiary)";

export function getEmptyBracketIllustration() {
  return `
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; margin-bottom: 20px;">
      <!-- Background Shape -->
      <path d="M100 150C149.706 150 190 118.66 190 80C190 41.3401 149.706 10 100 10C50.2944 10 10 41.3401 10 80C10 118.66 50.2944 150 100 150Z" fill="${bgShapeColor}" fill-opacity="0.5"/>
      
      <!-- Bracket Structure -->
      <path d="M40 40H60V60H40V40Z" stroke="${secondaryColor}" stroke-width="2" rx="4"/>
      <path d="M40 100H60V120H40V100Z" stroke="${secondaryColor}" stroke-width="2" rx="4"/>
      
      <path d="M60 50H70V110H60" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      <path d="M70 80H90" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      
      <path d="M90 70H110V90H90V70Z" stroke="${primaryColor}" stroke-width="2" rx="4" fill="none"/>
      
      <path d="M110 80H130" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Trophy small -->
      <path d="M140 70C140 70 142 90 150 90C158 90 160 70 160 70" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round"/>
      <path d="M140 70H160" stroke="${primaryColor}" stroke-width="2"/>
      <path d="M150 90V100" stroke="${primaryColor}" stroke-width="2"/>
      <path d="M145 100H155" stroke="${primaryColor}" stroke-width="2"/>
    </svg>
  `;
}

export function getEmptyWinnersIllustration() {
  return `
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; margin-bottom: 20px;">
      <!-- Background Shape -->
      <path d="M100 140C144.183 140 180 113.137 180 80C180 46.8629 144.183 20 100 20C55.8172 20 20 46.8629 20 80C20 113.137 55.8172 140 100 140Z" fill="${bgShapeColor}" fill-opacity="0.5"/>
      
      <!-- Court Stack -->
      <rect x="70" y="40" width="60" height="30" rx="4" stroke="${primaryColor}" stroke-width="2" fill="none"/>
      <path d="M100 40V70" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="2 2"/>
      
      <path d="M100 70V85" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      <path d="M100 85L95 80" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      <path d="M100 85L105 80" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      
      <rect x="70" y="90" width="60" height="30" rx="4" stroke="${secondaryColor}" stroke-width="2" fill="none"/>
      <path d="M100 90V120" stroke="${secondaryColor}" stroke-width="1" stroke-dasharray="2 2"/>
      
      <!-- Crown -->
      <path d="M90 28L95 35L100 25L105 35L110 28" stroke="var(--warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

export function getWelcomeIllustration() {
  return `
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
       <path d="M120 160C175.228 160 220 128.66 220 90C220 51.3401 175.228 20 120 20C64.7715 20 20 51.3401 20 90C20 128.66 64.7715 160 120 160Z" fill="${bgShapeColor}" fill-opacity="0.5"/>
       
       <!-- Racket -->
       <path d="M100 120L110 110" stroke="${secondaryColor}" stroke-width="6" stroke-linecap="round"/>
       <ellipse cx="130" cy="90" rx="25" ry="30" transform="rotate(-45 130 90)" stroke="${primaryColor}" stroke-width="3" fill="none"/>
       
       <!-- Ball -->
       <circle cx="150" cy="70" r="6" fill="var(--warning)"/>
       
       <!-- Speed lines -->
       <path d="M160 70L175 60" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
       <path d="M158 78L170 80" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}
