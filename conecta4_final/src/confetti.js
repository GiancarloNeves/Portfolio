export function startConfetti(canvas){
  if(!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const pieces = [];
  const colors = ['#ff4d4f','#ffec3d','#40a9ff','#73d13d','#9254de'];
  for(let i=0;i<120;i++){
    pieces.push({
      x: Math.random()*canvas.width,
      y: -Math.random()*canvas.height,
      vx: (Math.random()-0.5)*4,
      vy: 2 + Math.random()*4,
      size: 6 + Math.random()*8,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*10
    });
  }
  let raf;
  function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(const p of pieces){
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if(p.y > canvas.height + 20){
        p.y = -20;
        p.x = Math.random()*canvas.width;
      }
    }
    raf = requestAnimationFrame(draw);
    canvas.__confettiRAF = raf;
  }
  draw();
  setTimeout(()=>{
    if(canvas.__confettiRAF) cancelAnimationFrame(canvas.__confettiRAF);
    try{ ctx.clearRect(0,0,canvas.width, canvas.height); }catch(e){}
    canvas.__confettiRAF = null;
  }, 6000);
}

export function stopConfetti(canvas){
  if(!canvas) return;
  try{ if(canvas.__confettiRAF) cancelAnimationFrame(canvas.__confettiRAF); }catch(e){}
  const ctx = canvas.getContext && canvas.getContext('2d');
  if(ctx) ctx.clearRect(0,0,canvas.width, canvas.height);
  canvas.__confettiRAF = null;
}
