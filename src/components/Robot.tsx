import { useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, useAnimations, Environment } from '@react-three/drei';
import * as THREE from 'three';

function RobotModel() {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/robot/scene.gltf');
    const { actions, names } = useAnimations(animations, group);

    useEffect(() => {
        if (names.length > 0) {
            // Play all animations or just the first one
            const action = actions[names[0]];
            if (action) {
                action.reset().fadeIn(0.5).play();
            }
        }
    }, [actions, names]);

    return (
        <group ref={group} dispose={null}>
            <primitive
                object={scene}
                scale={7.5}
                position={[4, -5, -2]}
                rotation={[0, Math.PI, 0]}
            />
        </group>
    );
}

// Preload the model
useGLTF.preload('/robot/scene.gltf');

export function Robot() {
    return (
        <div className="absolute inset-0 pointer-events-none z-20">
            <Canvas
                shadows
                camera={{ position: [0, 0, 15], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.5
                }}
            >
                <Suspense fallback={null}>
                    {/* Manual Lighting Setup */}
                    <ambientLight intensity={1.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#5b8def" />
                    <directionalLight position={[0, 5, 5]} intensity={1} />

                    <Float
                        speed={2}
                        rotationIntensity={0.3}
                        floatIntensity={1}
                        floatingRange={[-0.3, 0.3]}
                    >
                        <RobotModel />
                    </Float>

                    <Environment preset="city" />

                    <ContactShadows
                        position={[4, -6, -2]}
                        opacity={0.4}
                        scale={15}
                        blur={2}
                        far={10}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
