/** SEAMUN I 2027 registration forms (embed URLs). */
(function (global) {
  function embedUrl(viewUrl) {
    return viewUrl.split("?")[0] + "?embedded=true";
  }

  global.SEAMUNForms = {
    delegate: {
      id: "delegate",
      label: "Delegate Sign Up",
      description: "Independent delegate registration for SEAMUN I 2027.",
      viewUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSdKwhkLsqoRydiE-7NrF9cnjQLnAhQXQU5Fmq_GPwPLJrBf0Q/viewform",
      embedUrl: embedUrl(
        "https://docs.google.com/forms/d/e/1FAIpQLSdKwhkLsqoRydiE-7NrF9cnjQLnAhQXQU5Fmq_GPwPLJrBf0Q/viewform"
      ),
    },
    advisor: {
      id: "advisor",
      label: "Advisor Sign Up",
      description: "Advisor registration for SEAMUN I 2027.",
      viewUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSfFSjKegswoOKVyBQIZ6ihEs8qQv9FpAjAMFOGe8-tqmArSzQ/viewform",
      embedUrl: embedUrl(
        "https://docs.google.com/forms/d/e/1FAIpQLSfFSjKegswoOKVyBQIZ6ihEs8qQv9FpAjAMFOGe8-tqmArSzQ/viewform"
      ),
    },
    chair: {
      id: "chair",
      label: "Chair Application",
      description: "Apply to chair a committee at SEAMUN I 2027.",
      viewUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLScrnEHiXci3JQC4SQVEjqgM8ESdEbkbAwnOk8Z6xPOcMIxj7w/viewform",
      embedUrl: embedUrl(
        "https://docs.google.com/forms/d/e/1FAIpQLScrnEHiXci3JQC4SQVEjqgM8ESdEbkbAwnOk8Z6xPOcMIxj7w/viewform"
      ),
    },
  };
})(typeof window !== "undefined" ? window : this);
