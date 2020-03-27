import '../scss/main.scss'
import $ from './query'

function setupCanvas(canvas) {
	const dpr = window.devicePixelRatio || 1
	const ctx = canvas.getContext('2d')
	const rect = canvas.getBoundingClientRect()
	canvas.width = rect.width * dpr
	canvas.height = rect.height * dpr

	return ctx
}

const canvas = $('#mycan').el
const ctx = setupCanvas(canvas)
const width = canvas.width
const height = canvas.height

$('#fileInp').bind('change', function() {
	const file = this.files[0]
	const reader = new FileReader()

	function readLoad() {
		const img = new Image()
		img.src = reader.result
		$(img).bind('load', function() {
			canvas._uploaded = true
			ctx.drawImage(img, 0, 0, width, height)
		})
	}

	$(reader).bind('load', readLoad)

	if (file) {
		reader.readAsDataURL(file)
	}
})

function toGray(data) {
	for (var i = 0, size = width * height; i <= size; i++) {
		const base = i*4
		const average = Math.round((data[base] + data[base+1] + data[base+2])/3)
		data[base] = data[base+1] = data[base+2] = average
	}
}

function toGrid(data) {
	const num = 7

	function render(x, y, nX, nY, r, g, b, a) {
		for (let m = 0; m < nX; m++) {
			for (let n = 0; n < nY; n++) {
				const base = ((y*num + n)*width + x*num + m)*4
				data[base] = r
				data[base+1] = g
				data[base+2] = b
				data[base+3] = a
			}
		}
	}

	for (let x = 0, xSize = Math.floor(width/num); x < xSize; x++) {
		for (let y = 0, ySize = Math.floor(height/num); y < ySize; y++) {
			const nX = x === xSize ? width%num : num
			const nY = y === ySize ? height%num : num
			const pX = x*num + Math.ceil(nX/2)
			const pY = y*num + Math.ceil(nY/2)
			const base = (pY*width + pX)*4
			render(x, y, nX, nY, data[base], data[base+1], data[base+2], data[base+4])
		}
	}
}

function clickHandler(process) {
	if (!canvas._uploaded) return alert('请先导入图片')
	const imgData = ctx.getImageData(0, 0, width, height)
	const data = imgData.data
	process(data)
	ctx.putImageData(imgData, 0, 0)
}

$('#grayBtn').bind('click', function() {
	clickHandler(toGray)
})

$('#gridBtn').bind('click', function() {
	clickHandler(toGrid)
})