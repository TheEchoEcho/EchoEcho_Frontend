import { buildBabyjub, buildEddsa } from "circomlibjs";
import { prvKey } from "./privateKey";
import { plonk, PlonkProof, PublicSignals } from "snarkjs";
import { vkey } from "./zkey";
import { loadWasmBuffer, loadZkeyBuffer } from "./loadproofutils";

export interface DistanceProps {
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
}

export interface ProofAndPubs {
  proof: PlonkProof,
  publicSignals: PublicSignals
}

export async function generateDistanceProof({
  lat1, lon1, lat2, lon2
}: DistanceProps){
  const eddsa = await buildEddsa();
  const babyJub = await buildBabyjub();
  const F = babyJub.F;

  const msg = F.e(lat2 * 1000 + lon2);
  const pubKey = eddsa.prv2pub(prvKey);
  const sig = eddsa.signMiMC(prvKey, msg);

  const inputs = {
    lat1: lat1,
    lat2: lat2,
    lon1: lon1,
    lon2: lon2,
    Ax: F.toObject(pubKey[0]),
    Ay: F.toObject(pubKey[1]),
    R8x: F.toObject(sig.R8[0]),
    R8y: F.toObject(sig.R8[1]),
    S: sig.S,
  };

  const distancewasm = await loadWasmBuffer();
  const zkey = await loadZkeyBuffer();

  const { proof, publicSignals } = await plonk.fullProve(
    inputs,
    distancewasm!,
    zkey!
  );
  
  return {proof, publicSignals};
}

export async function verifyDistanceProof({
  proof, publicSignals
}: ProofAndPubs){
  const isValid = await plonk.verify(
    vkey,
    publicSignals,
    proof
  );
  if(isValid){
    const bigDeltaA = Number(publicSignals[0]);
    const magnification = 24*24*120*120*10**54;
    const radius = bigDeltaA / magnification;

    const distance = 2 * 6371 * Math.asin(Math.sqrt(radius));
    return distance;
  } else {
    return false;
  }
}

const bigcos = (x: number) => {
  return 24 * 10**12 - 12 * 10**6 * x**2 + x**4;
}
const bigsin = (x: number) => {
  return 120 * 10**12 * x - 20 * 10**6 * x**3 + x**5;
}

// const test = async() => {
//   const {proof, publicSignals} = await generateDistanceProof(
//     {lat1: 657, lat2: 659, lon1: 455, lon2: 453}
//   );
//   const ret = await verifyDistanceProof({proof, publicSignals});
//   console.log("proof passed?", ret);
//   return;
// }

// test().catch((err) => {console.error(err)})