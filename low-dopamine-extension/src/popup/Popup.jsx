import { useState, useEffect } from 'react'
import './Popup.css'

export const Popup = () => {
  const [isGrayscale, setIsGrayscale] = useState(false)
  const [error, setError] = useState(null)

  const sendMessageToContentScript = (action) => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message)
          return
        }
        chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message)
            return
          }
          resolve(response)
        })
      })
    })
  }

  const toggleGrayscale = async () => {
    try {
      const response = await sendMessageToContentScript('toggleGrayscale')
      if (response && response.isGrayscale !== undefined) {
        setIsGrayscale(response.isGrayscale)
      }
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => {
    const getInitialState = async () => {
      try {
        const response = await sendMessageToContentScript('getGrayscaleStatus')
        if (response && response.isGrayscale !== undefined) {
          setIsGrayscale(response.isGrayscale)
        }
      } catch (err) {
        setError(err)
      }
    }
    getInitialState()
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