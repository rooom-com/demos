// init the viewer with the viewerID and an iframe element
const viewerID = '6bf713aa942d1173375e3687e055b2'
const iframe = document.getElementById('iframe')
const viewer = new SpaceViewer(iframe)

const teleport = {
	// up arrow => teleport to first level
	'64160839296f0c4f514242a5-64f6fa7bb70a472dfc5cea47': { position: [-1.4, 7, -0.7], rotation: [0, -Math.PI / 2, 0] },
	// down arrow => teleport to ground level
	'64160839296f0c4f514242a5-64f6fae2d220d628f90910dc': { position: [0, 1.6, 0], rotation: [0, Math.PI / 2, 0] },
}

viewer.init(viewerID, {
	autostart: true, // autostart the viewer
	render_background: true, // render in the background

	onSuccess: (api) => {
		api.on('viewer.start', () => {
			api.on('click', (event) => {
				// get some useful information about the click event; e.g. the node id
				console.log(event)

				// use this to get the current camera position and rotation
				api.getCameraOrientation((camera) => console.log(camera.position, camera.rotation))

				// get the clicked nodeId and check if it is in the teleport object
				// then animate the camera to a specific position and rotation in space
				if (event.nodeId in teleport) {
					const { position, rotation } = teleport[event.nodeId]
					api.setCameraOrientation(position, rotation, 1)
				}
			})
		})
	},
})
