pragma circom 2.1.5;

include "../../../node_modules/circomlib/circuits/eddsamimc.circom";
include "./bigsin.circom";
include "./bigcos.circom";

template DistanceProof () {
    signal input lat1;
    signal input lat2;
    signal input lon1;
    signal input lon2;
    signal input Ax;
    signal input Ay;
    signal input S;
    signal input R8x;
    signal input R8y;

    signal output bigdeltaA; // distance in angle of radius

    var complementC1 = (24 * 10**12)**2;

    component sin1 = Bigsin();
    component sin2 = Bigsin();
    component cos1 = Bigcos();
    component cos2 = Bigcos();
    component eddsacom = EdDSAMiMCVerifier();
    eddsacom.enabled <== 1;
    eddsacom.Ax <== Ax;
    eddsacom.Ay <== Ay;
    eddsacom.S <== S;
    eddsacom.R8x <== R8x;
    eddsacom.R8y <== R8y;
    eddsacom.M <== lat2 * 1000 + lon2;

    signal half_delta_lat <== (lat1 - lat2) / 2;
    signal half_delta_lon <== (lon1 - lon2) / 2;
    log("half_delta_lat", half_delta_lat);
    log("half_delta_lon", half_delta_lon);

    sin1.x <== half_delta_lat;
    signal sin_delta_half_lat <== sin1.sinx;
    log("sin_delta_half_lat", sin_delta_half_lat);

    sin2.x <== half_delta_lon;
    signal sin_delta_half_lon <== sin2.sinx;
    log("sin_delta_half_lon", sin_delta_half_lon);

    cos1.x <== lat1;
    cos2.x <== lat2;

    signal mul_cos <== cos1.cosx * cos2.cosx;
    signal sin2_lat <== sin_delta_half_lat * sin_delta_half_lat;
    signal sin2_lon <== sin_delta_half_lon * sin_delta_half_lon;

    bigdeltaA <== complementC1 * sin2_lat + mul_cos * sin2_lon;
}

component main{ public [lat1, lon1, Ax, Ay, R8x, R8y, S] } = DistanceProof();