const fs = require('fs-extra');
const path = require('path');

const src = path.join(__dirname, '../node_modules/three/examples/jsm/libs/draco/gltf');
const output = path.join(__dirname, '../public/draco');

try {
  if (fs.existsSync(src)) {
    fs.ensureDirSync(output);
    fs.copySync(path.join(src, 'draco_decoder.wasm'), path.join(output, 'draco_decoder.wasm'));
    fs.copySync(path.join(src, 'draco_wasm_wrapper.js'), path.join(output, 'draco_wasm_wrapper.js'));
    console.log('Draco decoder assets successfully prepared in public/draco');
  } else {
    console.warn('Three.js Draco decoder files not found at expected source path:', src);
  }
} catch (err) {
  console.error('Error copying Draco decoder assets:', err);
}
