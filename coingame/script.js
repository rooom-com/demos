// init the viewer with the viewerID and an iframe element
const viewerID = 'd57add7ee756c9cce86f16117e6d20'
const iframe = document.getElementById('iframe')
const viewer = new SpaceViewer(iframe)

// the maximum number of coins that the user can find
const maxCoins = 6
// sotre the ids of the coins that the user has clicked
var collectedCoins = []
// the score/title HTML element. here we will show the score
const score = document.getElementById('score')

viewer.init(viewerID, {
	autostart: true, // autostart the viewer
	render_background: true, // render in the background

	onSuccess: (api) => {
		api.on('viewer.start', () => {
			api.on('click', (event) => {
				console.log(event)
				collectedCoins.push(event.nodeId)
				api.hide(event.nodeId)

				score.innerHTML = `You have found ${collectedCoins.length} out of ${maxCoins}`

				// if user found all coins, show them again after 2 seconds
				if (collectedCoins.length === maxCoins) {
					score.innerHTML = 'Congratulation. You did it!'
					setTimeout(() => {
						collectedCoins.forEach((nodeId) => api.show(nodeId))
						collectedCoins = []
						score.innerHTML = 'Find all coins and click them.'
					}, 2000)
				}
			})
		})
	},
})
