/** Committee logo paths (full logos; black background removed without aggressive chroma). */
(function (global) {
  var v = "20260711a";
  function logo(path) {
    return path + "?v=" + v;
  }
  global.SEAMUNCommitteeLogos = {
    ecosoc: logo("assets/committee-logos/ecosoc.png"),
    press: logo("assets/committee-logos/press.png"),
    unhrc: logo("assets/committee-logos/unhrc.png"),
    unodc: logo("assets/committee-logos/unodc.png"),
    unsc: logo("assets/committee-logos/unsc.png"),
    unwomen: logo("assets/committee-logos/unwomen.png"),
    disec: logo("assets/committee-logos/disec.png"),
    fwc: logo("assets/committee-logos/fwc.png"),
    interpol: logo("assets/committee-logos/interpol.png"),
    who: logo("assets/committee-logos/who.png"),
  };
})(typeof window !== "undefined" ? window : this);
