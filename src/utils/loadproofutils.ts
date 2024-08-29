export async function loadWasmBuffer() {
  try {
    const response = await fetch('/distanceproof.wasm');
    if (!response.ok) {
      throw new Error(`Failed to load WASM file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const ret = new Uint8Array(buffer);
    return ret;
  } catch (error) {
    console.error('Error loading WASM file:', error);
  }
}

export async function loadZkeyBuffer() {
  try {
    const res = await fetch('/distanceproof.zkey');
    if (!res.ok) {
      throw new Error(`Failed to load Zkey file: ${res.statusText}`);
    }
    const zkeyBuffer = await res.arrayBuffer();
    const ret = new Uint8Array(zkeyBuffer);
    return ret;
  } catch (error) {
    console.error('Error loading zkey file:', error);
  }
}