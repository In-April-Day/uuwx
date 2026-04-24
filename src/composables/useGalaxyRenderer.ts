import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { fragmentShader, vertexShader, type GalaxyOptions, defaultOptions } from "@/shaders/galaxy";

export interface UseGalaxyRendererReturn {
  init: (container: HTMLElement) => void;
  destroy: () => void;
  updateOptions: (options: Partial<GalaxyOptions>) => void;
}

export function useGalaxyRenderer(options: GalaxyOptions = {}): UseGalaxyRendererReturn {
  const mergedOptions = { ...defaultOptions, ...options };

  let renderer: Renderer | null = null;
  let program: Program | null = null;
  let animationId: number | null = null;
  let container: HTMLElement | null = null;

  // 鼠标状态
  const targetMousePos = { x: 0.5, y: 0.5 };
  const smoothMousePos = { x: 0.5, y: 0.5 };
  let targetMouseActive = 0.0;
  let smoothMouseActive = 0.0;

  // 鼠标事件处理
  const mouseHandlers = {
    move: (e: MouseEvent) => {
      if (!mergedOptions.mouseInteraction) return;
      targetMousePos.x = e.clientX / window.innerWidth;
      targetMousePos.y = 1.0 - (e.clientY / window.innerHeight);
      targetMouseActive = 1.0;
    },
    leave: () => {
      targetMouseActive = 0.0;
    },
  };

  function resize() {
    if (!renderer || !container) return;
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    if (program) {
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }
  }

  let gl: ReturnType<Renderer["gl"]> | null = null;

  function update(t: number) {
    animationId = requestAnimationFrame(update);
    if (program) {
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uStarSpeed.value = (t * 0.001 * mergedOptions.starSpeed) / 10.0;
    }

    // 平滑插值
    const lerpFactor = 0.05;
    smoothMousePos.x += (targetMousePos.x - smoothMousePos.x) * lerpFactor;
    smoothMousePos.y += (targetMousePos.y - smoothMousePos.y) * lerpFactor;
    smoothMouseActive += (targetMouseActive - smoothMouseActive) * lerpFactor;

    if (program) {
      program.uniforms.uMouse.value[0] = smoothMousePos.x;
      program.uniforms.uMouse.value[1] = smoothMousePos.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive;
    }

    renderer?.render({ scene: mesh });
  }

  let mesh: Mesh | null = null;

  function init(containerEl: HTMLElement) {
    container = containerEl;

    renderer = new Renderer({
      alpha: false,
      premultipliedAlpha: false,
    });
    gl = renderer.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 1);

    window.addEventListener("resize", resize);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        uFocal: { value: new Float32Array([0.5, 0.5]) },
        uRotation: { value: new Float32Array([1.0, 0.0]) },
        uStarSpeed: { value: mergedOptions.starSpeed },
        uDensity: { value: mergedOptions.density },
        uHueShift: { value: mergedOptions.hueShift },
        uSpeed: { value: mergedOptions.speed },
        uMouse: { value: new Float32Array([smoothMousePos.x, smoothMousePos.y]) },
        uGlowIntensity: { value: mergedOptions.glowIntensity },
        uSaturation: { value: mergedOptions.saturation },
        uMouseRepulsion: { value: mergedOptions.mouseInteraction },
        uTwinkleIntensity: { value: mergedOptions.twinkleIntensity },
        uRotationSpeed: { value: mergedOptions.rotationSpeed },
        uRepulsionStrength: { value: mergedOptions.repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: mergedOptions.autoCenterRepulsion },
      },
    });

    mesh = new Mesh(gl, { geometry, program });

    animationId = requestAnimationFrame(update);
    container.appendChild(gl.canvas);

    // 添加鼠标事件
    window.addEventListener("mousemove", mouseHandlers.move);
    window.addEventListener("mouseleave", mouseHandlers.leave);
  }

  function destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    window.removeEventListener("mousemove", mouseHandlers.move);
    window.removeEventListener("mouseleave", mouseHandlers.leave);
    window.removeEventListener("resize", resize);

    if (container && gl) {
      container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }

    renderer = null;
    program = null;
    mesh = null;
    container = null;
    gl = null;
  }

  function updateOptions(newOptions: Partial<GalaxyOptions>) {
    Object.assign(mergedOptions, newOptions);
    if (program) {
      if (newOptions.density !== undefined) {
        program.uniforms.uDensity.value = newOptions.density;
      }
      if (newOptions.glowIntensity !== undefined) {
        program.uniforms.uGlowIntensity.value = newOptions.glowIntensity;
      }
      if (newOptions.saturation !== undefined) {
        program.uniforms.uSaturation.value = newOptions.saturation;
      }
      if (newOptions.hueShift !== undefined) {
        program.uniforms.uHueShift.value = newOptions.hueShift;
      }
      if (newOptions.twinkleIntensity !== undefined) {
        program.uniforms.uTwinkleIntensity.value = newOptions.twinkleIntensity;
      }
      if (newOptions.rotationSpeed !== undefined) {
        program.uniforms.uRotationSpeed.value = newOptions.rotationSpeed;
      }
      if (newOptions.starSpeed !== undefined) {
        program.uniforms.uStarSpeed.value = newOptions.starSpeed;
      }
      if (newOptions.speed !== undefined) {
        program.uniforms.uSpeed.value = newOptions.speed;
      }
      if (newOptions.repulsionStrength !== undefined) {
        program.uniforms.uRepulsionStrength.value = newOptions.repulsionStrength;
      }
      if (newOptions.autoCenterRepulsion !== undefined) {
        program.uniforms.uAutoCenterRepulsion.value = newOptions.autoCenterRepulsion;
      }
    }
  }

  return {
    init,
    destroy,
    updateOptions,
  };
}
