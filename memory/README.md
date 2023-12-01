# Memory

### [Show Demo](https://rooom-com.github.io/demos/memory/)

> [!NOTE]
> This demo mostly utilizes the [`rotate`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/objects.html#rotate), [`translate`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/objects.html#translate), [`setHighlight`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/objects.html#sethighlight) functions of the API of rooomSpaces.

## Goal

We will create a memory game with the rooomSpaces API.
At the beginning of the game, all cards are shuffled and turned face down.
The user can click on the cards and the cards will be flipped. If the user finds two cards with the same image, the cards will remain open otherwise the cards will be flipped back. The game ends when all 12 pairs are found.

## Implementation

### HTML

First at all we will create our base structure. In here the first thing we do is import the space-viewer script from rooom. We also import our stylesheet and javascript which we will define further on.

```html
<!-- index.html -->
<html>
	<head>
		<title>Memory</title>
		<link rel="stylesheet" href="style.css" />
		<script type="text/javascript" src="https://static.rooom.com/viewer-api/space-viewer-latest.min.js"></script>
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

#### Add message

We only need a text line that displays the current game state

```html
<!-- Messages -->
<h1 id="message">Find all matching pairs of cards.</h1>
```

That's it for the UI. Now we can start with the logic.

---

### Script

#### Initialization

For the initialization of the SpaceViewer we need the Id of the Space and an iFrame element. Then we start the instance of the SpaceViewer with these parameters.

If the initialization is successful and the event [`viewer.start`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/general.html#start) is triggered we can start all further logics within this function.

The message HTML element is used to display the current game state.

```js
// script.js

// init the viewer with the viewerId and an iFrame element
const viewerID = '187593a5531f0dbbed9c9f11f8d363'
const iframe = document.getElementById('iframe')
const viewer = new SpaceViewer(iframe)

// the message HTML element. here we show score or messages
const message = document.getElementById('message')

viewer.init(viewerID, {
	// options to influence the startup behavior
	autostart: true, // autostart the viewer
	render_background: true, // render in the background

	// handler if initialization of api succeeded
	onSuccess: (api) => {
		// viewer started successfully event
		api.on('viewer.start', () => {
			// logic here
		})
	},
})
```

#### Prepare the game

First we need a list of all cards and store the objects nodeIds in an array.

```js
// node IDs of the cards
const cards = [
	'6410fea2caacf155fe119106-6411914032a8a61285196912',
	'6410fea2caacf155fe119106-64119297ab7b4d48ad50afdd',
	'6410fea2caacf155fe119106-641177f7caacf155fe11910a',
	// ...
]
```

And we create a function to store the possible 24 orientations (position and horizontal rotaion) inside the space where the cards can be placed.

```js
// the cards orientations
const orientations = []
for (let index = 0; index < 4; index++) {
	orientations.push(
        // right wall lower and upper row
		[[-7 + index * 3, 1, 7.5], 180],
		[[-7 + index * 3, 4, 7.5], 180],
        // left wall lower and upper row
		[[-7 + index * 3, 1, -7.5], 0],
		[[-7 + index * 3, 4, -7.5], 0],
        // front wall lower and upper row
		[[-11.5, 1, -4.5 + index * 3], 90],
		[[-11.5, 4, -4.5 + index * 3], 90]
	)
}
```

Later we will we shuffle this array and use the orientations to place the cards.

```js
// shuffle the array of possible orientations and move the cards to the new positions
// return array of the cards rotation
async function shuffleCards() {
	return [...orientations]
		.sort((l) => Math.random() - 0.5)
		.map((orientation, index) => {
			api.translate(cards[index], orientation[0], { duration }, () => {
				api.rotate(cards[index], [orientation[1], 0, 1, 0], { duration })
			})
			return orientation[1]
		})
}
```

#### Start the game

We will create a function to start the game. This function will be called at the beginning and after the user has found all pairs.
We will reset the arrays of clicked and found cards and show a message that the cards are shuffled and then we will call the `shuffleCards` function.

```js
// start or restart the game function
async function start() {
	// reset the clickedCards and foundCards arrays
	clickedCards = []
	foundCards = []

	// shuffle the cards
	message.innerHTML = 'Cards are shuffled'
	cardsRotation = await shuffleCards()

	// update the title
	message.innerHTML = 'Find all matching pairs of cards.'
}

// Let's play!
start()
```

#### Flip the cards

In order to flip the cards we need to create a function that will be called when the user clicks on a card. We will use the [`rotate`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/objects.html#rotate) function of the SpaceViewer API to rotate the card by 180° around the y-axis.
It is only allowed to flip two cards at the same time. Therefore we will check if the clicked card is already flipped or if there are already two cards flipped. If not, we will flip the card and add it to the clickedCards array.

```js
// find the index of the clicked card in the cards array
const index = cards.indexOf(event.nodeId)

// maximum 2 cards can be clicked at the same time and ignore the found cards
if (clickedCards.length === 2 || foundCards.includes(index)) return

// add the index of the clicked card to the clickedCards array
clickedCards.push(index)
// reveal the clicked card
api.rotate(cards[index], [cardsRotation[index] + 180, 0, 1, 0], { duration })
```

#### Check if the cards match

After the user has clicked on two cards we need to check if the cards match. Therefore we will compare the indexes of the clicked cards in the cards array.
If the difference between the indexes is 1 and the smaller index is even, the cards are a pair. We will add the indexes of the found cards to the foundCards array and check if all pairs are found. If so, we will show a message and restart the game after 2 seconds. Otherwise we will show a message with the current score.

```js
// after 2 cards are clicked...
if (clickedCards.length === 2) {
	// Pair found! They are pairs if they are next to each other and the first card is even, eg. 0 and 1 or 6 and 7
	if (Math.abs(clickedCards[0] - clickedCards[1]) === 1 && Math.min(...clickedCards) % 2 == 0) {
		// add the indexes of the found cards to the foundCards array
		foundCards.push(...clickedCards)

		// restart the game if all pairs are found
		if (foundCards.length === 24) {
			message.innerHTML = `Congratulation. You have found all pairs.`
			setTimeout(() => start(), 2000)
		} else {
			message.innerHTML = `You have found ${foundCards.length / 2} out of 12 pairs`
		}
	} else {
		// rotate the clicked cards back
		clickedCards.forEach((clickedCard) => {
			api.rotate(cards[clickedCard], [cardsRotation[clickedCard], 0, 1, 0], { duration })
		})
	}
	// clear the clickedCards array after 3 seconds
	setTimeout(() => {
		clickedCards = []
	}, 3000)
}
```

#### Cheat Mode

While developing the game we noticed that it is not easy to find all pairs. Therefore we added a cheat mode. If the user clicks on the message HTML, a random pair of matching cards will be highlighted for 1 second.
Here we will use the [`setHighlight`](https://developers.rooom.com/docs/rooom-spaces/viewer/viewer-api/objects.html#sethighlight) function of the SpaceViewer API to highlight the cards.

```js
message.addEventListener('click', () => {
	// get a random pair of matching cards. The first card is even, eg. 0 or 6 and the second card is odd, eg. 1 or 7
	const random = Math.floor(Math.random() * 12) * 2
	cards.slice(random, random + 2).forEach((nodeId) =>
		// highlight the card for 1 second
		api.setHighlight(
			nodeId,
			{ enabled: true, alpha: 0.8, color: '#00aeb3' },
			setTimeout(() => api.setHighlight(nodeId, { enabled: false }), 1000)
		)
	)
})
```

We hope you enjoyed this tutorial and that you will create your own games with the SpaceViewer API.
