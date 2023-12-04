// create an observer function to detect when a section is in view
// this will trigger a custom event with the state name
function initIntersectionObserver() {
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


// create a state object with all the states
const states = {
	// each state has the following properties:
	// groundColor: color of the ground,
	// skyColor: color of the sky,
	// animation: character animation to play,
	// rotateCamera: start rotating the camera?,
	// animateAnnotations: cycle through all annotations?,
	// annotationId: annotation to position the camera on,
	// texture: base64 string of the texture to use for the eye color,

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
			// set the loop mode for all animations
			function initAnimations() {
				api.setAnimationCycleMode('Idle', 'loop')
				;['talk', 'victory', 'hero', 'hey'].forEach((animation) => api.setAnimationCycleMode(animation, 'once'))
			}

			// temp function to create a texture from a base64 string
			function initTextures() {
				;['chapter1', 'chapter2', 'chapter3', 'chapter4'].forEach((state) => {
					api.addTexture(`data:image/png;base64,${states[state].texture}`, (textureId) => {
						states[state].textureId = textureId
					})
				})
			}

			// we use the annotations to position the camera
			// the annotation can be easyly setup in the ProductEditor
			function moveCamera(annotationId) {
				api.selectAnnotation(annotationId)
				api.unselectAnnotation()
			}

			// create random hex color for the eyes
			// not used because emissive color is broken in API
			function changeEyeColor(color) {
				'#' + ((Math.random() * 0xffffff) << 0).toString(16)
			}

			// start or stop camera rotation
			function rotateCamera(rotate = true) {
				rotate ? setTimeout(() => api.startRotateCamera(0.1), 2000) : api.stopRotateCamera()
			}

			// show or hide annotations
			// not used because getNodeList the API is broken in API
			function showAnnotations(show = true) {
				api.getNodeList((nodes) => nodes.filter((node) => node.id.startsWith('annotation')).forEach((node) => (show ? api.show(node) : api.hide(node))))
			}

			// temporary workaround to show annotations
			function showAnnotationsTemp(show = true) {
				;[
					'annotation-640f0c78be9f8a63b6600fb3-marker',
					'annotation-640f0cc92bbf656e195ff862-marker',
					'annotation-640f0e4272a4fd534e4b0132-marker',
					'annotation-640f34195a67d976a314a69d-marker',
				].forEach((node) => (show ? api.show(node) : api.hide(node)))
			}

			// cycle through annotations and store timeouts in array for later clearing
			const annotationTimouts = []
			function animateAnnotations(animate = true) {
				// if animate is false, clear all timeouts and return
				if (!animate) {
					// clear all timeouts
					annotationTimouts.forEach((timeout) => clearTimeout(timeout))

					// hide annotations
					showAnnotationsTemp(false)
					return
				}
				// otherwise, get all annotations and set a timeout for each one to select it after 4 seconds
				showAnnotationsTemp()
				api.getAnnotations((annotations) =>
					annotations.forEach((annotation, index) => {
						const timout = setTimeout(() => api.selectAnnotation(annotation.id), index * 4000)
						annotationTimouts.push(timout)
					})
				)
			}

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

			// init the Animations, Textures and the IntersectionObserver
			initAnimations()
			initTextures()
			initIntersectionObserver()
			

			// eventlistener on document for state change
			document.addEventListener('state', (e) => {
				setState(e.detail)
			})
		})
	},
})
