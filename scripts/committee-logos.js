/** Committee logo paths (full logos; black background removed without aggressive chroma). */
(function (global) {
  var v = "20260603";
  function logo(path) {
    return path + "?v=" + v;
  }
  global.SEAMUNCommitteeLogos = {
    ecosoc: logo("assets/ecosoclogotrans-full.png"),
    press: logo("assets/presscorpslogotrans-full.png"),
    unhrc: logo("assets/unhrclogotrans-full.png"),
    unodc: logo("assets/unodclogotrans-full.png"),
    unsc: logo("assets/unsclogotrans-full.png"),
    unwomen: logo("assets/unwomenlogotrans-full.png"),
    disec: logo("assets/diseclogotrans-full.png"),
    fwc: logo("assets/fwclogotrans-full.png"),
    interpol: logo("assets/interpollogotrans-full.png"),
    who: logo("assets/whologotrans-full.png"),
  };
})(typeof window !== "undefined" ? window : this);
