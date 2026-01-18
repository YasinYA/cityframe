"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { LANDMARKS, Landmark } from "@/lib/landmarks";

interface ThreeJsLayerProps {
  mapRef: React.RefObject<MapRef>;
  styleId: string;
  accentColor: string;
}

// Convert lat/lng to Mercator coordinates
function lngLatToMercator(lng: number, lat: number): [number, number] {
  const mercatorX = lng * 20037508.34 / 180;
  let mercatorY = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
  mercatorY = mercatorY * 20037508.34 / 180;
  return [mercatorX, mercatorY];
}

// Create a 3D model for a landmark
function createLandmarkModel(landmark: Landmark, color: THREE.Color): THREE.Group {
  const group = new THREE.Group();
  group.name = landmark.id;

  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.7,
  });

  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.BackSide,
  });

  switch (landmark.id) {
    case "eiffel-tower": {
      // Eiffel Tower - tapered tower with lattice structure
      const base = new THREE.BoxGeometry(800, 200, 800);
      const baseMesh = new THREE.Mesh(base, material);
      baseMesh.position.y = 100;
      group.add(baseMesh);

      // Main tower body (tapered)
      const towerGeom = new THREE.CylinderGeometry(100, 400, 1500, 4);
      const tower = new THREE.Mesh(towerGeom, material);
      tower.position.y = 950;
      tower.rotation.y = Math.PI / 4;
      group.add(tower);

      // Observation deck
      const deck = new THREE.BoxGeometry(500, 80, 500);
      const deckMesh = new THREE.Mesh(deck, material);
      deckMesh.position.y = 500;
      group.add(deckMesh);

      // Top spire
      const spire = new THREE.ConeGeometry(50, 400, 4);
      const spireMesh = new THREE.Mesh(spire, material);
      spireMesh.position.y = 1900;
      group.add(spireMesh);
      break;
    }

    case "statue-of-liberty": {
      // Pedestal
      const pedestal = new THREE.BoxGeometry(400, 500, 400);
      const pedestalMesh = new THREE.Mesh(pedestal, material);
      pedestalMesh.position.y = 250;
      group.add(pedestalMesh);

      // Body
      const body = new THREE.CylinderGeometry(150, 200, 600, 8);
      const bodyMesh = new THREE.Mesh(body, material);
      bodyMesh.position.y = 800;
      group.add(bodyMesh);

      // Head
      const head = new THREE.SphereGeometry(100, 8, 8);
      const headMesh = new THREE.Mesh(head, material);
      headMesh.position.y = 1200;
      group.add(headMesh);

      // Crown
      const crown = new THREE.ConeGeometry(120, 100, 7);
      const crownMesh = new THREE.Mesh(crown, material);
      crownMesh.position.y = 1300;
      group.add(crownMesh);

      // Torch arm
      const arm = new THREE.CylinderGeometry(30, 40, 400, 8);
      const armMesh = new THREE.Mesh(arm, material);
      armMesh.position.set(200, 1200, 0);
      armMesh.rotation.z = -Math.PI / 4;
      group.add(armMesh);

      // Torch
      const torch = new THREE.ConeGeometry(60, 150, 8);
      const torchMesh = new THREE.Mesh(torch, new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffa500, emissiveIntensity: 0.3 }));
      torchMesh.position.set(350, 1450, 0);
      group.add(torchMesh);
      break;
    }

    case "big-ben": {
      // Clock tower base
      const base = new THREE.BoxGeometry(300, 800, 300);
      const baseMesh = new THREE.Mesh(base, material);
      baseMesh.position.y = 400;
      group.add(baseMesh);

      // Clock section
      const clockSection = new THREE.BoxGeometry(350, 300, 350);
      const clockMesh = new THREE.Mesh(clockSection, material);
      clockMesh.position.y = 950;
      group.add(clockMesh);

      // Clock faces (4 sides)
      const clockFace = new THREE.CircleGeometry(100, 32);
      const clockMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let i = 0; i < 4; i++) {
        const face = new THREE.Mesh(clockFace, clockMat);
        face.position.y = 950;
        face.rotation.y = (i * Math.PI) / 2;
        face.position.x = Math.sin(face.rotation.y) * 176;
        face.position.z = Math.cos(face.rotation.y) * 176;
        group.add(face);
      }

      // Spire roof
      const roof = new THREE.ConeGeometry(200, 400, 4);
      const roofMesh = new THREE.Mesh(roof, material);
      roofMesh.position.y = 1300;
      roofMesh.rotation.y = Math.PI / 4;
      group.add(roofMesh);
      break;
    }

    case "sydney-opera-house": {
      // Base platform
      const platform = new THREE.BoxGeometry(1500, 100, 800);
      const platformMesh = new THREE.Mesh(platform, material);
      platformMesh.position.y = 50;
      group.add(platformMesh);

      // Shell roofs - multiple curved shells
      const shellMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.3 });
      for (let i = 0; i < 4; i++) {
        const shell = new THREE.SphereGeometry(400, 32, 16, 0, Math.PI, 0, Math.PI / 2);
        const shellMesh = new THREE.Mesh(shell, shellMat);
        shellMesh.position.set(-400 + i * 300, 100, 0);
        shellMesh.rotation.x = -Math.PI / 2;
        shellMesh.rotation.z = Math.PI / 6;
        shellMesh.scale.set(1, 0.5, 1);
        group.add(shellMesh);
      }
      break;
    }

    case "burj-khalifa": {
      // Stepped tower design
      const sections = [
        { width: 400, height: 400, y: 200 },
        { width: 350, height: 500, y: 650 },
        { width: 280, height: 500, y: 1150 },
        { width: 200, height: 400, y: 1600 },
        { width: 120, height: 300, y: 1950 },
        { width: 60, height: 200, y: 2200 },
      ];

      sections.forEach(({ width, height, y }) => {
        const section = new THREE.BoxGeometry(width, height, width);
        const sectionMesh = new THREE.Mesh(section, material);
        sectionMesh.position.y = y;
        group.add(sectionMesh);
      });

      // Top spire
      const spire = new THREE.ConeGeometry(30, 300, 8);
      const spireMesh = new THREE.Mesh(spire, material);
      spireMesh.position.y = 2450;
      group.add(spireMesh);
      break;
    }

    case "tokyo-tower": {
      // Red/orange color for Tokyo Tower
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        metalness: 0.4,
        roughness: 0.6,
      });

      // Main tower - tapered lattice
      const tower = new THREE.CylinderGeometry(80, 350, 1400, 4);
      const towerMesh = new THREE.Mesh(tower, towerMat);
      towerMesh.position.y = 700;
      towerMesh.rotation.y = Math.PI / 4;
      group.add(towerMesh);

      // Main observation deck
      const deck1 = new THREE.BoxGeometry(400, 80, 400);
      const deck1Mesh = new THREE.Mesh(deck1, towerMat);
      deck1Mesh.position.y = 500;
      group.add(deck1Mesh);

      // Upper observation deck
      const deck2 = new THREE.BoxGeometry(250, 60, 250);
      const deck2Mesh = new THREE.Mesh(deck2, towerMat);
      deck2Mesh.position.y = 900;
      group.add(deck2Mesh);

      // Antenna
      const antenna = new THREE.CylinderGeometry(20, 40, 400, 8);
      const antennaMesh = new THREE.Mesh(antenna, towerMat);
      antennaMesh.position.y = 1600;
      group.add(antennaMesh);
      break;
    }

    case "colosseum": {
      // Elliptical arena
      const outerRing = new THREE.TorusGeometry(500, 150, 8, 32, Math.PI * 2);
      const ringMesh = new THREE.Mesh(outerRing, material);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 150;
      group.add(ringMesh);

      // Inner floor
      const floor = new THREE.CylinderGeometry(350, 350, 50, 32);
      const floorMesh = new THREE.Mesh(floor, material);
      floorMesh.position.y = 25;
      group.add(floorMesh);

      // Arches around (simplified)
      for (let i = 0; i < 16; i++) {
        const arch = new THREE.BoxGeometry(60, 200, 40);
        const archMesh = new THREE.Mesh(arch, material);
        const angle = (i / 16) * Math.PI * 2;
        archMesh.position.set(Math.cos(angle) * 500, 200, Math.sin(angle) * 500);
        archMesh.rotation.y = angle;
        group.add(archMesh);
      }
      break;
    }

    case "golden-gate-bridge": {
      // Bridge deck
      const deck = new THREE.BoxGeometry(2000, 30, 200);
      const deckMesh = new THREE.Mesh(deck, new THREE.MeshStandardMaterial({ color: 0xc0392b }));
      deckMesh.position.y = 200;
      group.add(deckMesh);

      // Two towers
      const towerMat = new THREE.MeshStandardMaterial({ color: 0xc0392b });
      [-500, 500].forEach(x => {
        const tower = new THREE.BoxGeometry(80, 600, 80);
        const towerMesh = new THREE.Mesh(tower, towerMat);
        towerMesh.position.set(x, 400, 0);
        group.add(towerMesh);
      });

      // Cables (simplified as lines)
      const cableMat = new THREE.LineBasicMaterial({ color: 0xc0392b });
      const cableGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1000, 200, 0),
        new THREE.Vector3(-500, 700, 0),
        new THREE.Vector3(0, 400, 0),
        new THREE.Vector3(500, 700, 0),
        new THREE.Vector3(1000, 200, 0),
      ]);
      const cable = new THREE.Line(cableGeom, cableMat);
      group.add(cable);
      break;
    }

    case "christ-the-redeemer": {
      // Pedestal
      const pedestal = new THREE.BoxGeometry(300, 200, 300);
      const pedestalMesh = new THREE.Mesh(pedestal, material);
      pedestalMesh.position.y = 100;
      group.add(pedestalMesh);

      // Body/robes
      const body = new THREE.ConeGeometry(200, 600, 8);
      const bodyMesh = new THREE.Mesh(body, material);
      bodyMesh.position.y = 500;
      group.add(bodyMesh);

      // Head
      const head = new THREE.SphereGeometry(80, 16, 16);
      const headMesh = new THREE.Mesh(head, material);
      headMesh.position.y = 900;
      group.add(headMesh);

      // Arms (outstretched)
      const armGeom = new THREE.BoxGeometry(800, 60, 60);
      const armMesh = new THREE.Mesh(armGeom, material);
      armMesh.position.y = 750;
      group.add(armMesh);
      break;
    }

    case "saint-basils-cathedral": {
      // Base building
      const base = new THREE.BoxGeometry(600, 400, 600);
      const baseMesh = new THREE.Mesh(base, material);
      baseMesh.position.y = 200;
      group.add(baseMesh);

      // Onion domes - central and surrounding
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
      const domePositions = [
        { x: 0, y: 600, z: 0, scale: 1.2 },
        { x: 200, y: 500, z: 0, scale: 0.8 },
        { x: -200, y: 500, z: 0, scale: 0.8 },
        { x: 0, y: 500, z: 200, scale: 0.8 },
        { x: 0, y: 500, z: -200, scale: 0.8 },
      ];

      domePositions.forEach(({ x, y, z, scale }) => {
        // Onion dome shape
        const dome = new THREE.SphereGeometry(80 * scale, 16, 16);
        const domeMesh = new THREE.Mesh(dome, domeMat);
        domeMesh.position.set(x, y, z);
        domeMesh.scale.y = 1.5;
        group.add(domeMesh);

        // Cross on top
        const cross = new THREE.CylinderGeometry(5, 5, 50, 8);
        const crossMesh = new THREE.Mesh(cross, new THREE.MeshBasicMaterial({ color: 0xffd700 }));
        crossMesh.position.set(x, y + 150 * scale, z);
        group.add(crossMesh);
      });
      break;
    }

    case "pyramids-of-giza": {
      // Main pyramid
      const pyramid1 = new THREE.ConeGeometry(500, 700, 4);
      const pyramid1Mesh = new THREE.Mesh(pyramid1, new THREE.MeshStandardMaterial({ color: 0xd4a574 }));
      pyramid1Mesh.position.set(0, 350, 0);
      pyramid1Mesh.rotation.y = Math.PI / 4;
      group.add(pyramid1Mesh);

      // Second pyramid
      const pyramid2 = new THREE.ConeGeometry(400, 550, 4);
      const pyramid2Mesh = new THREE.Mesh(pyramid2, new THREE.MeshStandardMaterial({ color: 0xc9a066 }));
      pyramid2Mesh.position.set(600, 275, 400);
      pyramid2Mesh.rotation.y = Math.PI / 4;
      group.add(pyramid2Mesh);

      // Third smaller pyramid
      const pyramid3 = new THREE.ConeGeometry(250, 350, 4);
      const pyramid3Mesh = new THREE.Mesh(pyramid3, new THREE.MeshStandardMaterial({ color: 0xbf9960 }));
      pyramid3Mesh.position.set(900, 175, 700);
      pyramid3Mesh.rotation.y = Math.PI / 4;
      group.add(pyramid3Mesh);
      break;
    }

    case "marina-bay-sands": {
      // Three towers
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, metalness: 0.8, roughness: 0.2 });
      [-400, 0, 400].forEach((x, i) => {
        const tower = new THREE.BoxGeometry(200, 1000, 150);
        const towerMesh = new THREE.Mesh(tower, towerMat);
        towerMesh.position.set(x, 500, 0);
        // Slight lean
        towerMesh.rotation.z = (i - 1) * 0.05;
        group.add(towerMesh);
      });

      // SkyPark on top (boat shape)
      const skypark = new THREE.BoxGeometry(1400, 50, 300);
      const skyparkMesh = new THREE.Mesh(skypark, towerMat);
      skyparkMesh.position.y = 1050;
      group.add(skyparkMesh);

      // Curved front of skypark
      const curve = new THREE.CylinderGeometry(150, 150, 50, 32, 1, false, 0, Math.PI);
      const curveMesh = new THREE.Mesh(curve, towerMat);
      curveMesh.position.set(700, 1050, 0);
      curveMesh.rotation.z = Math.PI / 2;
      group.add(curveMesh);
      break;
    }

    case "brandenburg-gate": {
      // Base platform
      const base = new THREE.BoxGeometry(1000, 100, 400);
      const baseMesh = new THREE.Mesh(base, material);
      baseMesh.position.y = 50;
      group.add(baseMesh);

      // Columns
      for (let i = 0; i < 6; i++) {
        const column = new THREE.CylinderGeometry(40, 50, 500, 16);
        const columnMesh = new THREE.Mesh(column, material);
        columnMesh.position.set(-400 + i * 160, 350, 0);
        group.add(columnMesh);
      }

      // Top entablature
      const top = new THREE.BoxGeometry(1000, 80, 400);
      const topMesh = new THREE.Mesh(top, material);
      topMesh.position.y = 640;
      group.add(topMesh);

      // Quadriga (simplified chariot on top)
      const quadriga = new THREE.BoxGeometry(200, 150, 100);
      const quadrigaMesh = new THREE.Mesh(quadriga, new THREE.MeshStandardMaterial({ color: 0xd4af37 }));
      quadrigaMesh.position.y = 760;
      group.add(quadrigaMesh);
      break;
    }

    case "parthenon": {
      // Base platform (stepped)
      const step1 = new THREE.BoxGeometry(1000, 40, 500);
      const step1Mesh = new THREE.Mesh(step1, material);
      step1Mesh.position.y = 20;
      group.add(step1Mesh);

      const step2 = new THREE.BoxGeometry(950, 40, 450);
      const step2Mesh = new THREE.Mesh(step2, material);
      step2Mesh.position.y = 60;
      group.add(step2Mesh);

      // Columns - front and back rows
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 8; i++) {
          const column = new THREE.CylinderGeometry(30, 40, 350, 16);
          const columnMesh = new THREE.Mesh(column, material);
          columnMesh.position.set(-350 + i * 100, 255, row === 0 ? 180 : -180);
          group.add(columnMesh);
        }
      }

      // Roof/pediment
      const roof = new THREE.BoxGeometry(900, 50, 400);
      const roofMesh = new THREE.Mesh(roof, material);
      roofMesh.position.y = 455;
      group.add(roofMesh);

      // Triangular pediment
      const pediment = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -450, 480, 200,  450, 480, 200,  0, 600, 200,
        -450, 480, -200, 450, 480, -200, 0, 600, -200,
      ]);
      pediment.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      pediment.computeVertexNormals();
      const pedimentMesh = new THREE.Mesh(pediment, material);
      group.add(pedimentMesh);
      break;
    }

    case "space-needle": {
      // Base legs (tripod)
      const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      for (let i = 0; i < 3; i++) {
        const leg = new THREE.CylinderGeometry(30, 60, 500, 8);
        const legMesh = new THREE.Mesh(leg, legMat);
        const angle = (i / 3) * Math.PI * 2;
        legMesh.position.set(Math.cos(angle) * 150, 250, Math.sin(angle) * 150);
        legMesh.rotation.z = Math.cos(angle) * 0.2;
        legMesh.rotation.x = Math.sin(angle) * 0.2;
        group.add(legMesh);
      }

      // Main shaft
      const shaft = new THREE.CylinderGeometry(40, 60, 800, 16);
      const shaftMesh = new THREE.Mesh(shaft, legMat);
      shaftMesh.position.y = 900;
      group.add(shaftMesh);

      // Observation deck (flying saucer shape)
      const discTop = new THREE.CylinderGeometry(250, 200, 60, 32);
      const discTopMesh = new THREE.Mesh(discTop, legMat);
      discTopMesh.position.y = 1350;
      group.add(discTopMesh);

      const discBottom = new THREE.ConeGeometry(200, 80, 32);
      const discBottomMesh = new THREE.Mesh(discBottom, legMat);
      discBottomMesh.position.y = 1280;
      discBottomMesh.rotation.x = Math.PI;
      group.add(discBottomMesh);

      // Top spire
      const spire = new THREE.ConeGeometry(20, 150, 8);
      const spireMesh = new THREE.Mesh(spire, legMat);
      spireMesh.position.y = 1460;
      group.add(spireMesh);
      break;
    }

    default: {
      // Default: simple obelisk
      const obelisk = new THREE.ConeGeometry(100, 500, 4);
      const obeliskMesh = new THREE.Mesh(obelisk, material);
      obeliskMesh.position.y = 250;
      group.add(obeliskMesh);
    }
  }

  return group;
}

export function ThreeJsLayer({ mapRef, styleId, accentColor }: ThreeJsLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const landmarkModelsRef = useRef<Map<string, THREE.Group>>(new Map());

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - will be synced with map
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e9);
    cameraRef.current = camera;

    // Renderer with transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);

    // Parse accent color
    const color = new THREE.Color(accentColor);

    // Create landmarks
    LANDMARKS.forEach(landmark => {
      const model = createLandmarkModel(landmark, color);

      // Position based on lat/lng
      const [mercX, mercY] = lngLatToMercator(landmark.lng, landmark.lat);
      model.userData = { landmark, mercX, mercY };

      scene.add(model);
      landmarkModelsRef.current.set(landmark.id, model);
    });

    // Function to sync 3D scene with map
    const syncWithMap = () => {
      if (!map || !cameraRef.current || !rendererRef.current || !sceneRef.current) return;

      const mapCenter = map.getCenter();
      const zoom = map.getZoom();
      const pitch = map.getPitch();
      const bearing = map.getBearing();

      // Calculate scale based on zoom - adjust for proper sizing
      const scale = Math.pow(2, zoom - 10) * 0.1;

      // Update camera position based on map view
      const [centerX, centerY] = lngLatToMercator(mapCenter.lng, mapCenter.lat);

      // Update all landmark positions relative to camera
      landmarkModelsRef.current.forEach((model) => {
        const { mercX, mercY, landmark } = model.userData;

        // Position relative to map center
        const relX = (mercX - centerX) * scale;
        const relZ = -(mercY - centerY) * scale;

        model.position.set(relX, 0, relZ);

        // Scale based on zoom and landmark scale
        const modelScale = scale * 0.3 * (landmark.scale || 1);
        model.scale.set(modelScale, modelScale, modelScale);

        // Rotate to face camera based on bearing
        model.rotation.y = -bearing * Math.PI / 180;
      });

      // Position camera - adjust based on pitch for proper 3D view
      const cameraHeight = 2000 / Math.pow(2, zoom - 12);
      const pitchRad = pitch * Math.PI / 180;

      cameraRef.current.position.set(
        0,
        cameraHeight * Math.cos(pitchRad) + 100,
        cameraHeight * Math.sin(pitchRad)
      );
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.rotation.z = -bearing * Math.PI / 180;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Render loop
    let animationId: number;
    const animate = () => {
      syncWithMap();
      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Also sync on map events for smoother updates
    map.on('move', syncWithMap);
    map.on('moveend', syncWithMap);

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      map.off('move', syncWithMap);
      map.off('moveend', syncWithMap);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      // Dispose of geometries and materials
      landmarkModelsRef.current.forEach(model => {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });
      landmarkModelsRef.current.clear();
    };
  }, [mapRef, accentColor]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
