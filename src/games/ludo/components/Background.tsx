import React from 'react';

const Background: React.FC = React.memo(() => (
  <div className="fixed inset-0" style={{ zIndex: -1 }}>
    {/* Base gradient */}
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(127,29,29,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(20,83,45,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(113,63,18,0.10) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(30,58,95,0.10) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(88,28,135,0.06) 0%, transparent 60%),
          linear-gradient(160deg, #050510 0%, #0a0a1e 30%, #080816 60%, #060d18 100%)
        `,
      }}
    />

    {/* Wooden table texture overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(139,90,43,0.3) 40px,
            rgba(139,90,43,0.3) 41px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 80px,
            rgba(101,67,33,0.2) 80px,
            rgba(101,67,33,0.2) 81px
          )
        `,
      }}
    />

    {/* Vignette */}
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)
        `,
      }}
    />

    {/* Ambient light spots */}
    <div
      className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(251,191,36,0.03) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  </div>
));

Background.displayName = 'Background';
export default Background;
