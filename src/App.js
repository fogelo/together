import {useEffect, useState, useRef} from 'react'

let ctx

function App() {
  const [lastPoints, setLastPoints] = useState([])
  const [pointCount, setPointCount] = useState(3)

  let canvas = useRef(null)

  useEffect(() => {
    ctx = canvas.current.getContext('2d')
    canvas.current.width = window.innerWidth
    canvas.current.height = window.innerHeight
  }, [])

  useEffect(() => {
    getRandomColor()

    // рисуем линии при добавении новых точек
    if(lastPoints.length > 1) {
      let tmpPoints = [...lastPoints]
      let startPoint = tmpPoints.shift()

      for(let i = 0; i < lastPoints.length; i++) {
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(lastPoints[i].x, lastPoints[i].y)
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
  }, [lastPoints])

  useEffect(() => {
    // удаляем лишние точки из стэйта при уменьшении кол-ва соединяемых точек
    let filtredPoints = lastPoints.filter((item, index) => {
      return (index <= pointCount)
    })

    setLastPoints(filtredPoints)
  }, [pointCount])

  const getRandomColor = () => {
    return '#' + (Math.random().toString(16) + '000000').substring(2,8)
  }

  const addPoint = e => {
    // рисуем точку
    let color = getRandomColor()
    ctx.beginPath()
    ctx.arc(e.clientX, e.clientY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.fill()
    
    // добавляем n последних точек в стэйт
    if(lastPoints.length < pointCount) {
      let tmpLastPoints = [...lastPoints]
      tmpLastPoints.unshift({x: e.clientX, y: e.clientY})
      setLastPoints(tmpLastPoints)
    }
    else {
      let tmpLastPoints = [...lastPoints]
      tmpLastPoints.pop()
      tmpLastPoints.unshift({x: e.clientX, y: e.clientY})
      setLastPoints(tmpLastPoints)
    }
  }

  const handleInput = (e) => {
    if(e.target.value.length) {
      setPointCount(parseInt(e.target.value))
    }
    else {
      setPointCount(0)
    }
  }

  return (
    <>
      <div style={{position: 'absolute', display: 'flex', left: 0, right: 0, top: 30, flexDirection: 'column', alignItems: 'center'}}>
        <label htmlFor='count'>Сколько точек соединять?</label>
        <input id='count' onChange={handleInput} placeholder='Сколько точек соединять?' value={pointCount} />
      </div>
      <canvas ref={canvas} onClick={addPoint}></canvas>
    </>
  )
}

export default App
