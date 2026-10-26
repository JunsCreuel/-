import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../motion'

// 사진 한 장(얕은 물 아래 모래)을 물결처럼 일렁이게 그린다(WebGL).
// 처음 INTRO_S초 동안은 흰 포말이 이는 파도 한 줄기가 왼쪽 위에서 오른쪽 아래로 화면을 쓸고 지나간다(onStart는 그 시작 순간).
// 그 뒤로는 겹친 사인파로 화면을 살짝 굴절시키고, 모래 위로 흐르는 빛 무늬(커스틱)를 옅게 얹는다.
// 모션 줄이기·WebGL을 못 쓰는 기기·그리기 실패 시에는 아래 깔린 같은 사진(img)만 보인다.
// 화면 밖에 있거나 탭이 숨겨지면 그리기를 멈춘다.

const VERT = `attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform vec2 u_img;
uniform vec2 u_focus;
uniform float u_t;
uniform float u_intro;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 q){return n(q)*.5+n(q*2.03+7.1)*.3+n(q*4.11+3.7)*.2;}
void main(){
  // object-fit: cover와 같은 잘라 맞추기(u_focus는 object-position)
  float rs=u_res.x/u_res.y, ri=u_img.x/u_img.y;
  vec2 sc=rs>ri?vec2(1.,ri/rs):vec2(rs/ri,1.);
  vec2 uv=vec2(v.x,1.-v.y);
  uv=(uv-.5)*sc+.5+(u_focus-.5)*(1.-sc);
  vec2 p=uv*vec2(ri,1.);
  float t=u_t;
  float w1=sin(p.y*16.+t*1.1+sin(p.x*7.+t*.6)*1.6);
  float w2=sin(p.x*19.-t*.9+sin(p.y*6.-t*.45)*1.9);
  float w3=sin((p.x+p.y)*11.+t*.7);
  // 들어오는 파도: 화면 기준 왼쪽 위 → 오른쪽 아래로 움직이는 물마루(front)
  vec2 sv=vec2(v.x,1.-v.y);
  float s=dot(sv,normalize(vec2(1.,.75)))+ (n(sv*vec2(6.,3.)+t*.4)-.5)*.12;
  float front=mix(-.25,1.45,u_intro);
  float d=s-front;
  float crest=exp(-d*d*90.)*step(u_intro,.999);
  float wake=smoothstep(.0,-.35,d)*exp(d*3.)*step(u_intro,.999);
  vec2 off=vec2(w1+w3*.5,w2-w3*.4)*(.0032+.018*crest+.006*wake);
  off+=normalize(vec2(1.,.75))*crest*.012;
  vec3 c=texture2D(u_tex,clamp(uv+off,.001,.999)).rgb;
  // 물마루의 흰 포말과 지나간 자리의 젖은 윤기
  float foam=crest*(smoothstep(.42,.78,fbm(sv*vec2(9.,6.)+vec2(t*.9,-t*.5)))*.9+.3);
  c=mix(c,vec3(.97,.98,.96),clamp(foam,0.,.85));
  c+=wake*.05;
  // 흐르는 빛 무늬
  float k=sin(p.x*24.+w2*2.2+t*.8)*sin(p.y*21.+w1*2.4-t*.7);
  c+=pow(max(k,0.),6.)*.10;
  gl_FragColor=vec4(c,1.);
}`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
}

const CENTER = [0.5, 0.5]
const INTRO_S = 1.9

// paused면 마지막 장면에서 멈춘다(히어로의 '멈춤' 버튼).
export default function WaterCanvas({ src, focus = CENTER, paused = false, onStart, className = '' }) {
  const canvasRef = useRef(null)
  const pausedRef = useRef(paused)
  const onStartRef = useRef(onStart)
  useEffect(() => {
    onStartRef.current = onStart
  })
  const kickRef = useRef(() => {})
  useEffect(() => {
    pausedRef.current = paused
    kickRef.current()
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return undefined
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false })
    if (!gl) return undefined
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return undefined
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = (n) => gl.getUniformLocation(prog, n)
    const uRes = u('u_res')
    const uImg = u('u_img')
    const uT = u('u_t')
    const uIntro = u('u_intro')
    gl.uniform2f(u('u_focus'), focus[0], focus[1])

    let raf = 0
    let ready = false
    let visible = true
    let disposed = false
    let start = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, w, h)
    }

    const frame = (now) => {
      raf = 0
      if (!ready || !visible || disposed || pausedRef.current) return
      resize()
      if (!start) {
        start = now
        onStartRef.current?.()
      }
      const sec = (now - start) / 1000
      gl.uniform1f(uT, sec)
      gl.uniform1f(uIntro, Math.min(1, sec / INTRO_S))
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      canvas.dataset.on = ''
      raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      if (!raf && ready && visible && !pausedRef.current && !document.hidden) raf = requestAnimationFrame(frame)
    }
    kickRef.current = kick

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (disposed) return
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
      gl.uniform2f(uImg, img.naturalWidth, img.naturalHeight)
      ready = true
      kick()
    }
    img.src = src

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      kick()
    })
    io.observe(canvas)
    const onVis = () => kick()
    document.addEventListener('visibilitychange', onVis)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [src, focus])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
