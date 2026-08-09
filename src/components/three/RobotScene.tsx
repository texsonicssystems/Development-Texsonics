import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Smooth collaborative-robot arm — pearl-white capsule links with
 * spherical joints and mint accent rings, modeled on the CS series.
 * Idle kinematic motion + mouse parallax on a deep-navy stage.
 */
const RobotScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0f16, 8, 22);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4.4, 2.6, 6.4);
    camera.lookAt(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ---------- Lights ----------
    scene.add(new THREE.AmbientLight(0x4c5a66, 1.9));

    const key = new THREE.DirectionalLight(0xeef6f8, 2.4);
    key.position.set(5, 8, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    scene.add(key);

    const mint = new THREE.PointLight(0x5eead4, 26, 14);
    mint.position.set(-3, 2.5, 2.5);
    scene.add(mint);

    const blueRim = new THREE.PointLight(0x2fbdff, 24, 18);
    blueRim.position.set(3, 4, -4);
    scene.add(blueRim);

    const fill = new THREE.DirectionalLight(0xcfe6ea, 0.7);
    fill.position.set(-4, 3, 6);
    scene.add(fill);

    // ---------- Materials ----------
    const shell = new THREE.MeshStandardMaterial({
      color: 0xe9edef, // pearl white cobot shell
      metalness: 0.15,
      roughness: 0.38,
    });
    const joint = new THREE.MeshStandardMaterial({
      color: 0x141c26, // deep navy joint caps
      metalness: 0.7,
      roughness: 0.4,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0x7de3c3, // mint accent rings
      metalness: 0.4,
      roughness: 0.35,
      emissive: 0x2fd4a8,
      emissiveIntensity: 0.45,
    });

    // ---------- Floor ----------
    const grid = new THREE.GridHelper(30, 60, 0x2fbdff, 0x16222e);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.3;
    scene.add(grid);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.ShadowMaterial({ opacity: 0.4 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Soft mint halo under the base
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.95, 1.5, 64),
      new THREE.MeshBasicMaterial({
        color: 0x2fd4a8,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.01;
    scene.add(halo);

    // ---------- Robot hierarchy (smooth cobot) ----------
    const robot = new THREE.Group();
    scene.add(robot);

    const castAll = (m: THREE.Mesh) => {
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };

    /** Capsule link lying along +Y from origin, with rounded ends. */
    const link = (radius: number, length: number, material: THREE.Material) => {
      const m = castAll(
        new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, 32), material)
      );
      m.position.y = length / 2;
      return m;
    };

    /** Spherical joint with a slim accent ring around its equator. */
    const jointBall = (radius: number, ringAxis: "x" | "y" | "z" = "z") => {
      const g = new THREE.Group();
      g.add(castAll(new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 24), joint)));
      const ring = castAll(
        new THREE.Mesh(new THREE.TorusGeometry(radius * 0.98, radius * 0.1, 16, 48), accent)
      );
      if (ringAxis === "x") ring.rotation.y = Math.PI / 2;
      if (ringAxis === "y") ring.rotation.x = Math.PI / 2;
      g.add(ring);
      return g;
    };

    // Base — smooth tapered pedestal
    const base = castAll(
      new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.95, 0.42, 48), joint)
    );
    base.position.y = 0.21;
    robot.add(base);

    const baseCollar = castAll(
      new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.72, 0.22, 48), shell)
    );
    baseCollar.position.y = 0.52;
    robot.add(baseCollar);

    const baseRing = castAll(
      new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.035, 16, 64), accent)
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.42;
    robot.add(baseRing);

    // J1 — waist rotation
    const j1 = new THREE.Group();
    j1.position.y = 0.62;
    robot.add(j1);

    const shoulderBall = jointBall(0.46, "y");
    shoulderBall.position.y = 0.3;
    j1.add(shoulderBall);

    // J2 — shoulder pitch
    const j2 = new THREE.Group();
    j2.position.set(0, 0.3, 0);
    j1.add(j2);
    j2.add(link(0.3, 1.6, shell)); // upper arm capsule

    // J3 — elbow
    const j3 = new THREE.Group();
    j3.position.set(0, 1.75, 0);
    j2.add(j3);
    const elbowBall = jointBall(0.34, "x");
    j3.add(elbowBall);
    j3.add(link(0.24, 1.3, shell)); // forearm capsule (slimmer)

    // J5 — wrist pitch
    const j5 = new THREE.Group();
    j5.position.set(0, 1.5, 0);
    j3.add(j5);
    const wristBall = jointBall(0.24, "x");
    j5.add(wristBall);

    // J6 — tool rotation
    const j6 = new THREE.Group();
    j6.position.y = 0.24;
    j5.add(j6);

    const toolNeck = castAll(
      new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 0.3, 32), shell)
    );
    toolNeck.position.y = 0.15;
    j6.add(toolNeck);

    const toolRing = castAll(
      new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.028, 16, 48), accent)
    );
    toolRing.rotation.x = Math.PI / 2;
    toolRing.position.y = 0.32;
    j6.add(toolRing);

    // Rounded two-finger gripper
    const fingerGeo = new THREE.CapsuleGeometry(0.035, 0.2, 6, 16);
    const fingerL = castAll(new THREE.Mesh(fingerGeo, joint));
    fingerL.position.set(-0.08, 0.46, 0);
    const fingerR = castAll(new THREE.Mesh(fingerGeo, joint));
    fingerR.position.set(0.08, 0.46, 0);
    j6.add(fingerL, fingerR);

    // ---------- Sizing ----------
    let sizedW = 0;
    let sizedH = 0;
    const camBase = { x: 4.4, y: 2.6, z: 6.4 };
    const setSize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h || (w === sizedW && h === sizedH)) return;
      sizedW = w;
      sizedH = h;
      camera.aspect = w / h;
      // Pull back on narrow/portrait viewports so the arm stays framed
      const zoom = camera.aspect < 0.9 ? 1.55 : 1;
      camBase.x = 4.4 * zoom;
      camBase.y = 2.6 + (zoom - 1) * 1.2;
      camBase.z = 6.4 * zoom;
      camera.position.set(camBase.x, camBase.y, camBase.z);
      camera.lookAt(0, 1.6, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);
    window.addEventListener("resize", setSize);

    // ---------- Mouse parallax ----------
    const mouse = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer);

    // ---------- Animation loop ----------
    let raf = 0;
    const clock = new THREE.Clock();

    // Static, presentable pose for reduced motion
    j1.rotation.y = -0.4;
    j2.rotation.x = 0.5;
    j3.rotation.x = -0.85;
    j5.rotation.x = 0.45;

    const tick = () => {
      const t = clock.getElapsedTime();

      // Self-heal if the container was measured at 0 during mount
      if (!sizedW || !sizedH) setSize();

      if (!reduced) {
        // Graceful kinematic idle — slow, overlapping sine phases
        j1.rotation.y = -0.4 + Math.sin(t * 0.32) * 0.6;
        j2.rotation.x = 0.5 + Math.sin(t * 0.45 + 1.2) * 0.16;
        j3.rotation.x = -0.85 + Math.sin(t * 0.4 + 0.6) * 0.24;
        j5.rotation.x = 0.45 + Math.sin(t * 0.6 + 2.1) * 0.3;
        j6.rotation.y = Math.sin(t * 0.5) * 1.2;

        // Halo breathes with the mint light
        const pulse = 0.5 + Math.sin(t * 1.4) * 0.5;
        (halo.material as THREE.MeshBasicMaterial).opacity = 0.08 + pulse * 0.08;
        mint.intensity = 22 + pulse * 10;

        // Camera parallax around the aspect-corrected base position
        camera.position.x += (camBase.x + mouse.x * 0.7 - camera.position.x) * 0.04;
        camera.position.y += (camBase.y - mouse.y * 0.45 - camera.position.y) * 0.04;
        camera.position.z += (camBase.z - camera.position.z) * 0.04;
        camera.lookAt(0, 1.6, 0);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause when tab is hidden
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        clock.getDelta();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", setSize);
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
};

export default RobotScene;
