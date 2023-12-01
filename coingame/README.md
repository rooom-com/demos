# Coingame

### [Show Demo](https://rooom-com.github.io/demos/coingame/)

> [!NOTE]
> This demo mostly utilizes the [`show`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/camera.html#setcameraorientation) and [`hide`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/camera.html#getcameraorientation) method of the API of rooomSpaces.
> You can read more about it [here](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/camera.html).

## Goal
In this game the user must find and click all the coins in the room. Every time a coin is clicked, the score is increased by one and the coin disappears. If the user has found all coins, the game is over and the user can start again.

## Implementation

### HTML

First at all we will create our base structure.
In here the first thing we do is import the space-viewer script from rooom.
We also import our stylesheet and javascript which we will define further on.

```html
<!-- index.html -->
<html>
	<head>
		<title>Coingame</title>
		<link rel="stylesheet" href="style.css" />
		<script type="text/javascript" src="https://static.rooom.com/viewer-api/space-viewer-1.0.0.min.js"></script>
	</head>
	<body>
		<script src="script.js"></script>
	</body>
</html>
```

#### Add an iFrame
In order to show our space viewer, we need to add an iFrame inside our html body.
We don't need specify an `src` since the frame will be controlled by our script.
To use all features of the spaceViewer, the iFrame will also need some allowance as shown below.

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

#### Add Score
We only need a text line that displays the current game state

```html
<!-- Title and Score -->
<h1 id="score">Find all coins and click them</h1>
```

That's it for the UI. Let's move on to the more exciting part of this tutorial - the implementation of the logic.

---

### Script

#### Initialization
For the initialization of the SpaceViewer we need the Id of the Space and an iFrame element. Then we start the instance of the SpaceViewer with these parameters.

> [!NOTE]
> There are many options to influence the startup behavior and appearance of the viewer. You can read more about them [here](https://developers.rooom.com/docs/rooom-spaces/viewer/customization.html).

If the initialization is successful and the event ``viewer.start`` is triggered we can start all further logics within this function. 

> [!NOTE]
> More viewer events can be found [here](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/events.html).

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
We want to make the coins clickable. For this we need to add an event listener to the viewer. We can do this with the [``on``](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/events.html#on) function of the API. The first parameter is the name of the event [``click``](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/events.html#click) and the second parameter is the callback function. Let's see what the return value is:

```js
api.on('click', (event) => {
	console.log(event)
})
```

The event object contains the following properties: nodeId, screen- and world coordinates. The ``nodeId`` is the id of the clicked object. Thats what we are looking for.

> [!CAUTION]
> In order to make an object clickable, it must have an link attached to it. [Here](https://help.rooom.com/hc/en-us/articles/4468051345297-Web-links) you can read more about attaching links to objects. The link needs to be a magic string `/EXPO-X/`. This is a special link that is used to trigger the click event.
> In the future we will provide a more convenient way to make objects clickable.

#### Hiding objects
Now we know how to make objects clickable. But how can we hide them? We can do this with the [``hide``](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/objects.html#hide) function of the API. The first parameter is the id of the object we want to hide. The optional second parameter a callback function that is called when the object is hidden.

```js
api.on('click', (event) => {			
	api.hide(event.nodeId)
})
```	

#### Score
Every time a coin is clicked, the score is increased by one. The Id of node is stored in an array. If the array contains all Ids, the game is over and the user can start again.

```js
// define these variables outside the event listener
// the maximum number of coins that the user can find
const maxCoins = 6
// sotre the ids of the coins that the user has clicked
var collectedCoins = []
// the score/title HTML element. here we will show the score
const score = document.getElementById('score')
```

```js
api.on('click', (event) => {
	// add the id of the clicked coin to the array
	collectedCoins.push(event.nodeId)
	
	// hide the clicked coin
	api.hide(event.nodeId)

	// update the score in the HTML
	score.innerHTML = `You have found ${collectedCoins.length} out of ${maxCoins}`

	// if user found all coins print a message
	if (collectedCoins.length === maxCoins) {
		score.innerHTML = 'Congratulation. You did it!'
	}
})
```

#### Restart the game
We are nearly done. The last thing we need to do is to restart the game after the user has found all coins. We reset the score and show all coins again. To unhide all objects we can use the [``show``](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/objects.html#show) function of the API. Since we stored all ids of the coins in an array, we can iterate over it and call the ``show`` function for each id.

```js
// if user found all coins, show them again after 2 seconds
if (collectedCoins.length === maxCoins) {
	score.innerHTML = 'Congratulation. You did it!'
	setTimeout(() => {
		collectedCoins.forEach((nodeId) => api.show(nodeId))
		collectedCoins = []
		score.innerHTML = 'Find all coins and click them'
	}, 2000)
}
```

Have fun with your new game and feel free to add your own style and logic to it.
