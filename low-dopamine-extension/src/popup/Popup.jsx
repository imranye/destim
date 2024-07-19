import { useState, useEffect } from 'react'
import './Popup.css'

export const Popup = () => {
  const [isGrayscale, setIsGrayscale] = useState(false)
  const [isHalfGrayscale, setIsHalfGrayscale] = useState(false)
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
        setIsHalfGrayscale(false)
      }
    } catch (err) {
      setError(err)
    }
  }

  const toggleHalfGrayscale = async () => {
    try {
      const response = await sendMessageToContentScript('toggleHalfGrayscale')
      if (response && response.isHalfGrayscale !== undefined) {
        setIsHalfGrayscale(response.isHalfGrayscale)
        setIsGrayscale(false)
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
        if (response && response.isHalfGrayscale !== undefined) {
          setIsHalfGrayscale(response.isHalfGrayscale)
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
      <label>
        <input
          type="checkbox"
          checked={isGrayscale}
          onChange={toggleGrayscale}
        />
        Enable Grayscale
      </label>
      <label>
        <input
          type="checkbox"
          checked={isHalfGrayscale}
          onChange={toggleHalfGrayscale}
        />
        Enable 50% Grayscale
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  )
}

export default Popup