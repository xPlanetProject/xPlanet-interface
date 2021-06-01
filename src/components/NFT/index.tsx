import React, { useState, useRef } from 'react'
import styled from 'styled-components'

const NFTGrid = styled.div`
display: grid;
grid-template: 'overlap';
min-height: 400px;
`

const NFTCanvas = styled.canvas`
grid-area: overlap;
`

const NFTImage = styled.img`
grid-area: overlap;
height: 400px;
z-index: 1;
`

function getSnapshot(src: HTMLImageElement, canvas: HTMLCanvasElement, targetHeight: number) {
  try {
    const context = canvas.getContext('2d')

    if (context) {
      let { width, height } = src
  
      // src may be hidden and not have the target dimensions
      const ratio = width / height
      height = targetHeight
      width = Math.round(ratio * targetHeight)
  
      // Ensure crispness at high DPIs
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      context.scale(devicePixelRatio, devicePixelRatio)
  
      context.clearRect(0, 0, width, height)
      context.drawImage(src, 0, 0, width, height)
    }
  } catch (e) {

  }
}

export function NFT({ image, height: targetHeight }: { image: string; height: number }) {
  const [animate, setAnimate] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <NFTGrid
      onMouseEnter={() => {
        setAnimate(true)
      }}
      onMouseLeave={() => {
        // snapshot the current frame so the transition to the canvas is smooth
        if (imageRef.current && canvasRef.current) {
          getSnapshot(imageRef.current, canvasRef.current, targetHeight)
        }
        setAnimate(false)
      }}
    >
      <NFTCanvas ref={canvasRef} />
      <NFTImage
        ref={imageRef}
        src={image}
        hidden={!animate}
        onLoad={() => {
          // snapshot for the canvas
          if (imageRef.current && canvasRef.current) {
            getSnapshot(imageRef.current, canvasRef.current, targetHeight)
          }
        }}
      />
    </NFTGrid>
  )
}