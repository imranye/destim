import { useState, useEffect } from 'react'
import './Popup.css'

export const Popup = () => {
  const [isGrayscale, setIsGrayscale] = useState(false)
  const [error, setError] = useState(null)

  const toggleGrayscale = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message)
        return
      }
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleGrayscale' }, (response) => {
        if (chrome.runtime.lastError) {
          setError(chrome.runtime.lastError.message)
          return
        }
        if (response && response.isGrayscale !== undefined) {
          setIsGrayscale(response.isGrayscale)
        }
      })
    })
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message)
        return
      }
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getGrayscaleStatus' }, (response) => {
        if (chrome.runtime.lastError) {
          setError(chrome.runtime.lastError.message)
          return
        }
        if (response && response.isGrayscale !== undefined) {
          setIsGrayscale(response.isGrayscale)
        }
      })
    })
  }, [])

  return (
    <main>
      <h3>Low Dopamine Extension</h3>
      <button onClick={toggleGrayscale}>
        {isGrayscale ? 'Disable Grayscale' : 'Enable Grayscale'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  )
}

export default Popup