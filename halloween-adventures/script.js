function initializeTipObject(tipObject) {
  // var newTipObject = new Object();
  if (tipObject == null) {
    var newTipObject = {
      halloween: [],
    };
    return newTipObject;
  } else {
    return JSON.parse(tipObject);
  }
}

const tipNodes = {
  halloween: [
    "6356a1c08ac68c0e86087e2b-635b8a47ae47034ec87a2fc7",
    "6356a1c08ac68c0e86087e2b-635b8976204ec040037ec907",
    "6356a1c08ac68c0e86087e2b-635a6956b015df118675f64c", //Werwolf
    "6356a1c08ac68c0e86087e2b-635b88efda1c6a791817d49f",
    "6356a1c08ac68c0e86087e2b-635b88a702ad0d15d8462674",
    "6356a1c08ac68c0e86087e2b-6356ae70bf994b07ee79bd3e",
    "6356a1c08ac68c0e86087e2b-6356ae7a2da479172369b0cb",
    "6356a1c08ac68c0e86087e2b-6356ae838e689254372d7081",
    "6356a1c08ac68c0e86087e2b-6356ae8e833c5c01012bafbb",
    "6356a1c08ac68c0e86087e2b-6356aebcac632d12ed1538a5",
  ],
};

window.onload = function () {
  window.addEventListener("message", function (message) {
    // console.log(message.data)
  });
  // localStorage.clear();

  //read out tips objects from local storage
  let localStorageObject = localStorage.getItem("tipCountHalloween");
  // console.log(localStorageObject);

  var collectedTips = initializeTipObject(localStorageObject);

  const iframe = document.getElementById("viewer");
  const idExterior = "b0b222748f769ec225070479ec89c0"; // Trianel Start
  const counterbox = document.getElementById("counterbox");
  const tipsFoundSpan = document.getElementById("tips-found");
  const tipsAllSpan = document.getElementById("tips-all");
  const pdfBox = document.getElementById("pdf-box");
  let viewer = new SpaceViewer(iframe);

  //add functionality to X
  document.querySelectorAll(".close-screen-button").forEach(function (e) {
    e.addEventListener("click", function () {
      pdfBox.classList.add("hidden");
    });
  });

  viewer.init(idExterior, {
    ui_infos: false,
    ui_hint: 1,
    onSuccess: function onSuccessFn(api) {
      api.on("viewer.start", function () {
        counterbox.classList.remove("hidden");
      });

      api.on("click", function (obj) {
        var nodeId = obj.nodeId;

        if (nodeId != "") {
          console.log(nodeId);
          if (tipNodes["halloween"].includes(nodeId)) {
            addTipToCounter("halloween", nodeId);
          }
        }
      });

      tipsAllSpan.innerText = tipNodes["halloween"].length;
      tipsFoundSpan.innerText = collectedTips["halloween"].length;
    },
  });

  function addTipToCounter(area, node) {
    if (
      area != "" &&
      area != undefined &&
      area != null &&
      node != "" &&
      node != undefined &&
      node != null
    ) {
      if (!collectedTips[area].includes(node)) collectedTips[area].push(node);

      localStorage.setItem("tipCountHalloween", JSON.stringify(collectedTips));
      tipsFoundSpan.innerText = collectedTips[area].length;

      if (collectedTips[area].length >= tipNodes[area].length) {
        const controller = new AbortController();
        window.addEventListener(
          "message",
          function (message) {
            // console.log(message.data)
            if (
              message.data.key &&
              message.data.key == "modal" &&
              message.data.value == 0
            ) {
              pdfBox.classList.remove("hidden");
              var pdfLinkElement = pdfBox
                .getElementsByTagName("button")
                .item(0);
              pdfLinkElement.setAttribute(
                "onclick",
                `window.open("${areaPDFs[area]}")`
              );
              controller.abort();
            }
          },
          { signal: controller.signal }
        );
      }
    }
  }
};
