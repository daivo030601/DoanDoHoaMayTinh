import { useEffect } from 'react';

import * as THREE from 'three';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { GUI } from 'dat.gui';

import SceneInit from './lib/SceneInit';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();
    
    const gui = new GUI();

    const uvTexture = new THREE.TextureLoader().load('./assets/uv.jpeg');
    const crateTexture = new THREE.TextureLoader().load('./assets/crate.png');
    const earthTexture = new THREE.TextureLoader().load('./assets/earth.jpeg');
    const brickTexture = new THREE.TextureLoader().load('./assets/brick.jpeg');

    test.camera.position.set(0, 0, 32);
    const mainGroup = new THREE.Group();
    mainGroup.position.y = 0.5;
    test.scene.add(mainGroup);
    
    const groundGeometry = new THREE.BoxGeometry(8, 0.5, 8);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b2b2,  });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -2;
    mainGroup.add(groundMesh);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ map: uvTexture });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.castShadow = true;
    boxMesh.position.x = -2;
    mainGroup.add(boxMesh);
    
    const sphereGeometry = new THREE.SphereGeometry(0.5);
    const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.castShadow = true;
    sphere.position.y = 1.5;
    mainGroup.add( sphere );
    
    const conegeometry = new THREE.ConeGeometry( 0.5, 1, 9, 1, false, 0);
    const conematerial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cone = new THREE.Mesh( conegeometry, conematerial );
    cone.castShadow = true;
    cone.position.x = 2;
    mainGroup.add( cone );
    
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 16);
    const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinderMesh.castShadow = true;
    cylinderMesh.position.x = 2;
    cylinderMesh.position.y = 1.5;
    mainGroup.add(cylinderMesh);
    
    const torusGeometry = new THREE.TorusGeometry(0.5, 0.25, 20, 20);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    torusMesh.castShadow = true;
    mainGroup.add(torusMesh);
    
    const teapotGeometry = new TeapotGeometry(0.5, 7);
    const teapotMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial);
    teapotMesh.castShadow = true;
    teapotMesh.position.x = -2;
    teapotMesh.position.y = 1.5;
    mainGroup.add(teapotMesh);
    
    
    
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.open();
    const rotationFolder = cameraFolder.addFolder('Điều khiển');
    rotationFolder.add(test.camera.position, 'x', -50.0, 50.0).name('X');
    rotationFolder.add(test.camera.position, 'y', -50.0, 50.0).name('Y');
    rotationFolder.add(test.camera.position, 'z', -50.0, 50.0).name('Z');
    rotationFolder.add(test.camera,'near', 0.1, 100.0).name('near');
    rotationFolder.add(test.camera, 'far', 0.0, 1000.0).name('far');
    
    const al = new THREE.AmbientLight(0xffffff, 0.5);
    mainGroup.add(al);

    // set up ambient light gui
    const alFolder = gui.addFolder('ambient light');
    const alSettings = { color: al.color.getHex() };
    alFolder.add(al, 'visible');
    alFolder.add(al, 'intensity', 0, 1, 0.1);
    alFolder
      .addColor(alSettings, 'color')
      .onChange((value) => al.color.set(value));
    // alFolder.open();

    const dl = new THREE.DirectionalLight(0xffffff, 0.5);
    // use this for YouTube thumbnail
    dl.position.set(1, 2, 2);
    // dl.position.set(0, 2, 0);
    dl.castShadow = true;
    const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
    mainGroup.add(dl);
    // mainGroup.add(dlHelper);

    // set up directional light gui
    const dlSettings = {
      visible: true,
      color: dl.color.getHex(),
    };
    const dlFolder = gui.addFolder('directional light');
    dlFolder.add(dlSettings, 'visible').onChange((value) => {
      dl.visible = value;
      dlHelper.visible = value;
    });
    dlFolder.add(dl, 'intensity', 0, 1, 0.25);
    dlFolder.add(dl.position, 'y', 1, 4, 0.5);
    dlFolder.add(dl, 'castShadow');
    dlFolder
      .addColor(dlSettings, 'color')
      .onChange((value) => dl.color.set(value));
    // dlFolder.open();

    const sl = new THREE.SpotLight(0x00ff00, 1, 8, Math.PI / 8, 0);
    sl.position.set(2, 3, 2);
    const slHelper = new THREE.SpotLightHelper(sl);
    mainGroup.add(sl, slHelper);

    // set up spot light gui
    const slSettings = {
      visible: true,
    };
    const slFolder = gui.addFolder('spot light');
    slFolder.add(slSettings, 'visible').onChange((value) => {
      sl.visible = value;
      slHelper.visible = value;
    });
    slFolder.add(sl, 'intensity', 0, 4, 0.5);
    slFolder.add(sl, 'angle', Math.PI / 16, Math.PI / 2, Math.PI / 16);
    slFolder.add(sl, 'castShadow');
    // slFolder.open();

    const pl = new THREE.PointLight(0xffffff, 1, 8, 2);
    pl.position.set(2, 2, 2);
    const plHelper = new THREE.PointLightHelper(pl, 0.5);
    mainGroup.add(pl, plHelper);

    // set up point light gui
    const plSettings = {
      visible: true,
      color: pl.color.getHex(),
    };
    const plFolder = gui.addFolder('point light');
    plFolder.add(plSettings, 'visible').onChange((value) => {
      pl.visible = value;
      plHelper.visible = value;
    });
    plFolder.add(pl, 'intensity', 0, 2, 0.25);
    plFolder.add(pl.position, 'x', -2, 4, 0.5);
    plFolder.add(pl.position, 'y', -2, 4, 0.5);
    plFolder.add(pl.position, 'z', -2, 4, 0.5);
    plFolder.add(pl, 'castShadow');
    plFolder
      .addColor(plSettings, 'color')
      .onChange((value) => pl.color.set(value));
    // plFolder.open();


    function animate(){
      requestAnimationFrame(animate);
      test.camera.lookAt(test.scene.position);
      test.renderer.render(test.scene, test.camera);
    }
    animate();

  }, []);
  
  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
