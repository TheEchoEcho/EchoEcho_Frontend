pragma circom 2.1.5;

template Bigcos() {
    signal input x; // which is actually 1000x
    signal output cosx;

    var c1 = 24 * 10**12;
    var c2 = 12 * 10**6;

    signal xp2 <== x * x;
    signal xp4 <== xp2 * xp2;

    cosx <== c1 - c2 * xp2 + xp4;
}