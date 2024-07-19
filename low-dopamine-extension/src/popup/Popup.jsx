import { useState, useEffect } from 'react'
import './Popup.css'

export const Popup = () => {
  const [isGrayscale, setIsGrayscale] = useState(false)

  const toggleGrayscale = () => {
    setIsGrayscale(!isGrayscale)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleGrayscale' })
    })
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getGrayscaleStatus' }, (response) => {
        setIsGrayscale(response.isGrayscale)
      })
    })
  }, [])

  return (
    <main>
      <h3>Low Dopamine Extension</h3>
      <button onClick={toggleGrayscale}>
        {isGrayscale ? 'Disable Grayscale' : 'Enable Grayscale'}
      </button>
    </main>
  )
}

export default Popup