// pois
const pois = {
  "poi-1": {
    position: [5, 1.6, 2.25],
    rotation: [0, 0, 0],
  },
  "poi-2": {
    position: [-5, 1.6, 2.25],
    rotation: [0, 0, 0],
  },
  "poi-3": {
    position: [-6.75, 1.6, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  "poi-4": {
    position: [-5, 1.6, -2.25],
    rotation: [0, Math.PI, 0],
  },
  "poi-5": {
    position: [5, 1.6, -2.25],
    rotation: [0, Math.PI, 0],
  },
  "poi-6": {
    position: [6.75, 1.6, 0],
    rotation: [0, Math.PI / 2, 0],
  },
};

// space dimension in x and z direction
let spaceDimension = {
  min: [-12, -7.9],
  max: [11.8, 7.6],
};
spaceDimension.width = spaceDimension.max[0] - spaceDimension.min[0];
spaceDimension.length = spaceDimension.max[1] - spaceDimension.min[1];

// calculate the 2d position of the camera relative to the space dimension and update camera marker in minimap
const cameraElement = document.getElementById("camera");
function updateCameraMarker(transform) {
  const left =
    ((transform.position[0] - spaceDimension.min[0]) / spaceDimension.width) *
    100;
  const bottom =
    ((transform.position[2] - spaceDimension.min[1]) / spaceDimension.length) *
    100;
  const angle = (transform.rotation[1] * 180) / Math.PI;

  // update css styles
  cameraElement.style.left = `${left}%`;
  cameraElement.style.bottom = `${bottom}%`;
  cameraElement.style.transform = `translate(-50%, 50%) rotate(${angle}deg)`;
}

// init the viewer with the viewerID and an iframe element
const viewerID = "187593a5531f0dbbed9c9f11f8d363";
const iframe = document.getElementById("iframe");
const viewer = new SpaceViewer(iframe);

viewer.init(viewerID, {
  autostart: true, // autostart the viewer
  render_background: true, // render in the background

  onSuccess: (api) => {
    api.on("viewer.start", () => {
      // unhide the minimap
      document.getElementById("minimap").style.visibility = "visible";

      // attach eventListeners to the pois
      for (const key in pois) {
        const poi = pois[key];
        const element = document.getElementById(key);
        element.addEventListener("click", () => {
          api.setCameraOrientation(poi.position, poi.rotation, 2);
        });
      }

      // get the current camera orientation and update the minimap
      setInterval(() => {
        api.getCameraOrientation((transform) => updateCameraMarker(transform));
      }, 10);
    });
  },
});
