# Stair

### [Show Demo](https://rooom-com.github.io/demos/stair/)

> [!NOTE]
> In this demo we only use [`setCameraOrientation`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/camera.html#setcameraorientation) and [`getCameraOrientation`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/camera.html#getcameraorientation) functions of the API of rooomSpaces.

## Goal

Never use the elevator when there are stairs. What may be true and healthy for the real world is bad for usability in the virtual world. Trying to walk up a spiral staircase is not only exhausting, but also very annoying.
Design your worlds so that all places can be reached comfortably and quickly.
[Minimaps](https://demos.rooom.io/spaces/minimap/), clickable signs, arrows or portals are a good way to teleport the user to distant and interesting places.
In the case of a staircase, this is usually the next floor. Clicking on arrows (up/down) teleports the user to the next floor.

## Implementation

### HTML

First at all we will create our base structure.
In here the first thing we do is import the space-viewer script from rooom.
In order to show our space viewer, we need to add an iFrame inside our html body.
We don't need specify an `src` since the frame will be controlled by our script.
To use all features of the spaceViewer, the iFrame will also need some allowance as shown below.
We also import our stylesheet and javascript which we will define further on.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Stair</title>
		<link rel="dns-prefetch" href="https://storage.rooom.com" />
		<link rel="stylesheet" href="style.css" />
		<script type="text/javascript" src="https://static.rooom.com/viewer-api/space-viewer-latest.min.js"></script>
	</head>

	<body>
		<iframe
			src=""
			allow="autoplay; fullscreen; vr; xr"
			allowvr
			allowfullscreen
			mozallowfullscreen="true"
			webkitallowfullscreen="true"
			id="iframe"
		>
		</iframe>

		<script src="script.js"></script>
	</body>
</html>
```

That's it for the UI. Let's move on to the more exciting part of this tutorial - the implementation of the logic.

---

### Script

#### Initialization

For the initialization of the SpaceViewer we need the Id of the Space and an iFrame element. Then we start the instance of the SpaceViewer with these parameters.

If the initialization is successful and the event `viewer.start` is triggered we can start all further logics within this function.

```js
// script.js

// init the viewer with the viewerId and an iFrame element
const viewerID = '187593a5531f0dbbed9c9f11f8d363'
const iframe = document.getElementById('iframe')
const viewer = new SpaceViewer(iframe)

viewer.init(viewerID, {
	// options to influence the startup behavior
	autostart: true,
	render_background: true,

	// handler if initialization of api succeeded
	onSuccess: (api) => {
		// viewer started successfully event
		api.on('viewer.start', () => {
			// logic here
		})
	},
})
```

#### Make me clickable!

We want to make the arrows clickable. For this we need to add an event listener to the viewer. We can do this with the [`on`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/events.html#on) function of the API. The first parameter is the name of the event [`click`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/events.html#click) and the second parameter is the callback function. Let's see what the return value is:

> [!CAUTION]
> In order to make an object clickable, it must have an link attached to it. [Here](https://help.rooom.com/hc/en-us/articles/4468051345297-Web-links) you can read more about attaching links to objects. The link needs to be a magic string `/EXPO-X/`. This is a special link that is used to trigger the click event.
> In the future we will provide a more convenient way to make objects clickable.

```js
api.on('click', (event) => {
	// get some useful information about the click event; e.g. the node id
	console.log(event)
})
```

The event object contains the following properties: nodeId, screen- and world coordinates. The `nodeId` is the id of the clicked object. Thats what we are looking for.


#### Moving the camera
But how do we get the new position and rotation of the camera? We can use the [`getCameraOrientation`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/camera.html#getcameraorientation) function of the API. This function returns an object with the properties `position` and `rotation`. We use our previously created `click` event to get the current position and rotation of the camera. We move the camera to the positions where we want to go click the arrows and store the new position and rotation in a variable.

```js
api.on('click', (event) => {
	//...
	
	// use this to get the current camera position and rotation
	api.getCameraOrientation((camera) => console.log(camera.position, camera.rotation))
})
```	

```js
const teleport = {
	// up arrow => teleport to first level
	'64160839296f0c4f514242a5-6416e33dec2e7826043a83c5': { position: [-1.4, 7, -0.7], rotation: [0, -Math.PI / 2, 0] },
	
	// down arrow => teleport to ground level
	'64160839296f0c4f514242a5-6416e8125bc89d54541a3883': { position: [0, 1.6, 0], rotation: [0, Math.PI / 2, 0] },
}
```	

Finally we can use the [`setCameraOrientation`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/camera.html#setcameraorientation) function to animate the camera to the new position.

This function takes three parameters. The first is the position of the camera, the second is the rotation of the camera and the third is the duration of the animation from the current position to the new position in seconds.

```js
api.on('click', (event) => {
	//...
	
	// get the clicked nodeId and check if it is in the teleport object
	// then animate the camera to a specific position and rotation in space
	if (event.nodeId in teleport) {
		const { position, rotation } = teleport[event.nodeId]
		api.setCameraOrientation(position, rotation, 1)
	}
})
```	

That's it! Now you can teleport in your space and your users have a better user experience.