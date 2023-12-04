# Scroller

[Show Demo](https://rooom-com.github.io/demos/scroller/)

> [!NOTE]
> In this tutorial we will use annotaion functions like[`selectAnnotation`]() and [`unselectAnnotation`]() of the API to animate the camera. But we are also using functions like [`setGroundColor`]() and [`setSkyColor`]() to change the overall color of the scene. Finally we are playing around with [`addTexture`]() and [`updateMaterialChannel`]() to change the texture of the product.

## Goal

Create a website with multiple sections and a product viewer as background. Depending on the scroll position, the product viewer will show different parts of the product (actually its an character) and play different animations. The color of the background will change depending on the scroll position.

## Implementation

### HTML

First at all we will create our base structure.
In here the first thing we do is import the product-viewer script from rooom.
We also import our stylesheet and javascript which we will define further on.

```html
<!-- index.html -->
<html>
	<head>
		<title>Once upon a time...</title>
		<script src="https://static.rooom.com/viewer-api/product-viewer-latest.min.js"></script>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<script src="script.js"></script>
	</body>
</html>
```

### Add an iFrame

In order to show our product viewer, we need to add an iFrame inside our html body.
We don't need specify an `src` since the frame will be controlled by our script.
To use all features of the product viewer, the iFrame will also need some allowance as shown below.

```html
<body>
	<iframe
		id="iframe"
		src=""
		allow="autoplay; fullscreen; vr; xr"
		allowvr
		allowfullscreen
		mozallowfullscreen="true"
		webkitallowfullscreen="true"
	></iframe>
</body>
```

### Add Sections

For our scroller we create a container with 4 sections, each of the hight of the viewport. So that we have a nice scrollbar and scrolling effect. Each section has a `data-state` attribute which will be used to change the state.

```html
<!-- Scroller with sections -->
<div id="container">
	<div data-state="chapter1">Once upon a time...</div>
	<div data-state="chapter2">there was a robot...</div>
	<div data-state="chapter3">who lived...</div>
	<div data-state="chapter4">happily ever after.</div>
</div>
```

That's it for the HTML. Now we can start with the JavaScript.

### Script

#### IntersectionObserver

First we need to create an IntersectionObserver which will observe the sections and trigger a custom event with the name of the state stored in the data-attribute. When the section is 50% visible in the view the event is fired.

```js
function sectionObserver() {
	const sections = document.querySelectorAll('#container div')

	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach(
				(entry) => entry.isIntersecting && document.dispatchEvent(new CustomEvent('state', { detail: entry.target.dataset.state }))
			),
		{
			threshold: 0,
			rootMargin: '-50% 0% -50% 0%', // trigger when 50% of the section is in view
		}
	)

	sections.forEach((section) => observer.observe(section))
}
```

#### States

Now we define our 4 states in an object. The key is the state name and the value is an object with the following properties:

-   `groundColor`: color of the ground
-   `skyColor`: color of the sky
-   `animation`: character animation to play
-   `rotateCamera`: start rotating the camera around the object?
-   `annotationId`: annotation to position the camera on
-   `texture`: base64 string of the texture to use for the eye color
-   `animateAnnotations`: cycle through all annotations?

The `_base` state is the default state and will be used as a base for all other states. So that we don't have to define all properties for each state.

```js
const states = {
	// this is the default state, all following states will override/merge with this one
	_base: {
		groundColor: '#ffd700',
		skyColor: '#FFBE0B',
		animation: 'Idle',
		rotateCamera: false,
		animateAnnotations: false,
	},

	// in this state the character will be in the start postition and say "hey"
	chapter1: {
		skyColor: '#4b96ff',
		animation: 'hey',
		groundColor: '#c9e0ff',
		annotationId: '640f34195a67d976a314a69d',
		texture: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP0nvb/PwAF9QLh+blqCAAAAABJRU5ErkJggg==',
	},

	// in this state the camera will be positioned in front of the character and the camera will start rotating after 2 seconds
	chapter2: {
		animation: 'talk',
		skyColor: '#FB5607',
		groundColor: '#fed227',
		annotationId: '640f0cc92bbf656e195ff862',
		rotateCamera: true,
		texture: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8Hcb+HwAGBQJZ82usCQAAAABJRU5ErkJggg==',
	},

	// in this state we will animate through all annotations
	chapter3: {
		animation: 'victory',
		skyColor: '#FF006E',
		groundColor: '#ffb3d9',
		animateAnnotations: true,
		texture: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z5D3HwAF4QJuy6gIuQAAAABJRU5ErkJggg==',
	},

	// in the last state we will show the head and animate the eye color
	chapter4: {
		animation: 'hero',
		skyColor: '#8338EC',
		groundColor: '#dfc9fa',
		annotationId: '640f0c78be9f8a63b6600fb3',
		texture: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNstnjzHwAFlQKo04ZIEAAAAABJRU5ErkJggg==',
	},
}
```

#### Initialization

For the initialization of the ProductViewer we need the Id of the Product and an iFrame element. Then we start the instance of the ProductViewer with these parameters.

We will hide all UI Controls and annotations and set the `autostart` to `true` so that the viewer will start automatically when the iFrame is loaded.

```js
// init the viewer with the viewerID and an iframe element
const viewerID = 'd16500283eacfe6cfbdc33db1ee327'
const iframe = document.getElementById('iframe')
const viewer = new ProductViewer(iframe)

viewer.init(viewerID, {
	autostart: true, // autostart the viewer
	render_background: true, // render in the background
	ui_hint: false, // hide the UI hint
	ui_logo: false, // hide the UI logo on the bottom left

	// hide all the UI controls
	ui_controls: false, // hide the UI controls
	ui_annotations: false, // hide the UI annotations control
	ui_animations: false, // hide the UI animations control

	onSuccess: (api) => {
		api.on('viewer.start', () => {
			// ... here we start our custom logic
		})
	},
})
```

#### Custom Logic

We are listening for the `state` event and call the `setState` function with the name of the state.

```js
// eventlistener on document for state change
document.addEventListener('state', (e) => {
	setState(e.detail)
})

// set states for GroundColor, SkyColor, Animation, Annotations, Camera, ...
function setState(key) {
	// get the state from the states object
	let state = states[key]

	// make sure we have a valid state
	if (!state) return

	// merge the state with the base state
	state = { ...states._base, ...state }

	// set the ground and sky color
	api.setGroundColor(state.groundColor)
	api.setSkyColor(state.skyColor)

	// play the animation of the character
	api.playAnimation(state.animation)

	// move the camera to the position stored in the annotation marker
	moveCamera(state.annotationId)

	// rotate the camera around the character
	rotateCamera(state.rotateCamera)

	// cycle through annotations
	animateAnnotations(state.animateAnnotations)

	// set the texture on the eyes
	api.updateMaterialChannel('Material #42', 'emissiveTexture', state.textureId)
}
```

Inside the `setState` function we are merging the state with the `_base` state. This way we don't have to define all properties for each state.

Then for every property we call the corresponding function on the API.
Some are pretty self-explanatory like [`setGroundColor`]() and [`setSkyColor`](). But some are a bit more complex.

Lets have a look at the `moveCamera` function.

```js
function moveCamera(annotationId) {
	api.selectAnnotation(annotationId)
	api.unselectAnnotation()
}
```

api.selectAnnotation(annotationId) will move the camera to the position of the annotation. But it will also show the annotation and label. So we need to call [`api.unselectAnnotation()`]() to hide the annotation.

In the `rotateCamera` function we are using the [`api.setCameraRotation`]() function to rotate the camera around the character with a speed of 0.1. We are also using `setTimeout` to start the rotation after 2 seconds.
Or we can stop the rotation with [`api.stopRotateCamera`]().

```js
function rotateCamera(rotate = true) {
	rotate ? setTimeout(() => api.startRotateCamera(0.1), 2000) : api.stopRotateCamera()
}
```

The `animateAnnotations` function is a bit more complex. We are using the [(`api.getAnnotations`)]() function to get all annotations. Then we are using `setTimeout` to select each annotation after 4 seconds. We are also storing the timeouts in an array so that we can clear them later.

`showAnnotations` is a helper function to show or hide all annotations. Here we are using the [`api.getNodeList`]() function to get all nodes and then we are filtering for the nodes that start with `annotation` and then we are hiding or showing them with [`api.hide`]() and [`api.show`]().

```js
// show or hide annotations
function showAnnotations(show = true) {
	api.getNodeList((nodes) =>
		nodes.filter((node) => node.id.startsWith('annotation')).forEach((node) => (show ? api.show(node) : api.hide(node)))
	)
}

// cycle through annotations and store timeouts in array for later clearing
const annotationTimouts = []
function animateAnnotations(animate = true) {
	// if animate is false, clear all timeouts and return
	if (!animate) {
		// clear all timeouts
		annotationTimouts.forEach((timeout) => clearTimeout(timeout))

		// hide annotations
		showAnnotations(false)
		return
	}
	// otherwise, get all annotations and set a timeout for each one to select it after 4 seconds
	showAnnotations()
	api.getAnnotations((annotations) =>
		annotations.forEach((annotation, index) => {
			const timout = setTimeout(() => api.selectAnnotation(annotation.id), index * 4000)
			annotationTimouts.push(timout)
		})
	)
}
```

#### Conclusion

In this tutorial we have created a simple state machine to manage the different states of the viewer. We have used the [`setGroundColor`](), [`setSkyColor`](), [`playAnimation`](), [`updateMaterialChannel`](), [`setCameraRotation`](), [`startRotateCamera`]() and [`stopRotateCamera`]() and many more functions to create a custom viewer and experience.

I hope you enjoyed this tutorial and learned something new.
