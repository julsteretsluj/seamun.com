/** Committee logo paths (full logos; black background removed without aggressive chroma). */
(function (global) {
  var v = "20260711b";
  function logo(path) {
    return path + "?v=" + v;
  }
  global.SEAMUNCommitteeLogos = {
    ecosoc: logo("assets/committee-logos/ecosoc.png"),
    press: logo("assets/committee-logos/press.png"),
    unhrc: "assets/committee-logos/unhrc.png?v=20260712e",
    unodc: "assets/committee-logos/unodc.png?v=20260712f",
    unsc: "assets/committee-logos/unsc.png?v=20260712g",
    unwomen: "assets/committee-logos/unwomen.png?v=20260712h",
    disec: "assets/committee-logos/disec.png?v=20260712i",
    fwc: "assets/committee-logos/fwc.png?v=20260712j",
    interpol: "assets/committee-logos/interpol.png?v=20260712k",
    who: "assets/committee-logos/who.png?v=20260712l",
  };
})(typeof window !== "undefined" ? window : this);
