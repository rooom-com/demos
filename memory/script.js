// init the viewer with the viewerID and an iframe element
const viewerID = '345c123eb4f1a8f66caf94243396c6'
const iframe = document.getElementById('iframe')
const viewer = new SpaceViewer(iframe)

// the message HTML element. here we show score or messages
const message = document.getElementById('message')

// node IDs of the cards
const cards = [
	'6410fea2caacf155fe119106-6411914032a8a61285196912',
	'6410fea2caacf155fe119106-64119297ab7b4d48ad50afdd',
	'6410fea2caacf155fe119106-641177f7caacf155fe11910a',
	'6410fea2caacf155fe119106-6411781f60f6ca49392c97e7',
	'6410fea2caacf155fe119106-641177426b3d8b23e73bdbc2',
	'6410fea2caacf155fe119106-6411780edbba890b17148a70',
	'6410fea2caacf155fe119106-641177551456b142522ef378',
	'6410fea2caacf155fe119106-641177ad2926f10e666b8482',
	'6410fea2caacf155fe119106-64117993cc30ab0c9b383281',
	'6410fea2caacf155fe119106-64118f25ee2560549011380b',
	'6410fea2caacf155fe119106-641179c6b0a72005c717436a',
	'6410fea2caacf155fe119106-64118f51a9b5282e1446d32d',
	'6410fea2caacf155fe119106-64117a10ee256054901137f4',
	'6410fea2caacf155fe119106-64118f61b00aef2fa56a62a1',
	'6410fea2caacf155fe119106-64117a35efa50f786313b169',
	'6410fea2caacf155fe119106-64118f6c11a87a152c61be20',
	'6410fea2caacf155fe119106-64118fe4581f6f2287743cbc',
	'6410fea2caacf155fe119106-641192d36f8d17252101e290',
	'6410fea2caacf155fe119106-6411902fbc04a37d520a543e',
	'6410fea2caacf155fe119106-64119301e845b65b3964e110',
	'6410fea2caacf155fe119106-641190375a67d976a314a725',
	'6410fea2caacf155fe119106-6411c7afc5b65b44f97a0ca0',
	'6410fea2caacf155fe119106-6411905137686f74ae3adda7',
	'6410fea2caacf155fe119106-6411c7bff2b74d4f8e4dded3',
]

// the cards orientations
const orientations = []
for (let index = 0; index < 4; index++) {
	orientations.push(
		// right wall lower and upper row
		[[-7 + index * 3, 1, 7.5], 0],
		[[-7 + index * 3, 4, 7.5], 0],
		// left wall lower and upper row
		[[-7 + index * 3, 1, -7.5], 180],
		[[-7 + index * 3, 4, -7.5], 180],
		// front wall lower and upper row
		[[-11.5, 1, -4.5 + index * 3], -90],
		[[-11.5, 4, -4.5 + index * 3], -90]
	)
}

viewer.init(viewerID, {
	autostart: true, // autostart the viewer
	render_background: true, // render in the background

	onSuccess: (api) => {
		api.on('viewer.start', () => {
			// animation duration for translating and rotating the cards
			const duration = 2
			// store the indexes of the clicked cards in an array
			let clickedCards
			// store the indexes of the found cards in an array
			let foundCards
			// store the cards rotation in an array
			let cardsRotation
			// prevents turning the cards while they are turning
			let transition = false

			async function rotate(nodeId, rotation, { duration }) {
				return new Promise((resolve) => api.rotate(nodeId, [rotation, 0, 1, 0], { duration }, () => resolve()))
			}

			// shuffle the array of possible orientations and move the cards to the new positions
			// return array of the cards rotation
			function shuffleCards() {
				return [...orientations]
					.sort((l) => Math.random() - 0.5)
					.map((orientation, index) => {
						api.translate(cards[index], orientation[0], { duration })
						api.rotate(cards[index], [orientation[1], 0, 1, 0], { duration })
						return orientation[1]
					})
			}

			// start or restart the game function
			async function start() {
				// reset the clickedCards and foundCards arrays
				clickedCards = []
				foundCards = []

				// shuffle the cards
				message.innerHTML = 'Cards are shuffled'
				cardsRotation = shuffleCards()

				// update the title
				message.innerHTML = 'Find all matching pairs of cards.'
			}

			// Let's play!
			start()

			api.on('click', async (event) => {
				// find the index of the clicked card in the cards array
				const index = cards.indexOf(event.nodeId)

				// maximum 2 cards can be clicked at the same time and ignore the found cards
				if (transition || clickedCards.length === 2 || foundCards.includes(index)) return

				// add the index of the clicked card to the clickedCards array
				clickedCards.push(index)

				// reveal the clicked card async
				transition = true
				await rotate(cards[index], cardsRotation[index] + 180, { duration: 0.5 })
				transition = false

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
						transition = true
						await new Promise((resolve) => setTimeout(() => resolve(), 1000))
						await Promise.all(
							clickedCards.map(async (clickedCard) =>
								rotate(cards[clickedCard], cardsRotation[clickedCard], { duration: 0.5 })
							)
						)
						transition = false
					}
					clickedCards = []
				}
			})

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
		})
	},
})
