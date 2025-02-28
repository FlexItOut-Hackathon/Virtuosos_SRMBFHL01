import { useState } from 'react'
import PixelPanel from './pixel-panel'
import PixelButton from './pixel-button'
import PixelAvatar from './pixel-avatar'
import { FacialFeatures } from '@/types/avatar'

interface PixelAvatarEditorProps {
  initialFeatures: FacialFeatures
  onSave: (features: FacialFeatures) => void
  onCancel: () => void
}

const PixelAvatarEditor = ({ initialFeatures, onSave, onCancel }: PixelAvatarEditorProps) => {
  const [features, setFeatures] = useState(initialFeatures)

  const colorOptions = {
    skin: ['#FFD5B4', '#F1C27D', '#C68642', '#8D5524'],
    hair: ['#000000', '#4A4A4A', '#A8806F', '#E6BE8A', '#C4C4C4'],
    eyes: ['#4A4A4A', '#634E34', '#2C8DDB', '#37946E', '#946B37']
  }

  return (
    <PixelPanel className="w-full max-w-md p-4">
      <h2 className="text-xl font-pixelFont mb-4 text-pixel-light">Customize Avatar</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <PixelAvatar size="large" features={features} />
        </div>
        
        <div className="space-y-4">
          {/* Skin Color */}
          <div>
            <label className="block text-pixel-light font-pixelFont mb-2">Skin Color</label>
            <div className="flex gap-2">
              {colorOptions.skin.map((color) => (
                <button
                  key={color}
                  onClick={() => setFeatures({ ...features, skinColor: color })}
                  className={`w-8 h-8 rounded-full`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div>
            <label className="block text-pixel-light font-pixelFont mb-2">Hair Style</label>
            <select
              value={features.hairStyle}
              onChange={(e) => setFeatures({ ...features, hairStyle: e.target.value as any })}
              className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md p-2 text-pixel-light"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>

          {/* Hair Color */}
          <div>
            <label className="block text-pixel-light font-pixelFont mb-2">Hair Color</label>
            <div className="flex gap-2">
              {colorOptions.hair.map((color) => (
                <button
                  key={color}
                  onClick={() => setFeatures({ ...features, hairColor: color })}
                  className={`w-8 h-8 rounded-full`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Eye Style */}
          <div>
            <label className="block text-pixel-light font-pixelFont mb-2">Eye Style</label>
            <select
              value={features.eyeStyle}
              onChange={(e) => setFeatures({ ...features, eyeStyle: e.target.value as any })}
              className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md p-2 text-pixel-light"
            >
              <option value="round">Round</option>
              <option value="almond">Almond</option>
              <option value="wide">Wide</option>
            </select>
          </div>

          {/* Eye Color */}
          <div>
            <label className="block text-pixel-light font-pixelFont mb-2">Eye Color</label>
            <div className="flex gap-2">
              {colorOptions.eyes.map((color) => (
                <button
                  key={color}
                  onClick={() => setFeatures({ ...features, eyeColor: color })}
                  className={`w-8 h-8 rounded-full`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <PixelButton className="flex-1" onClick={() => onSave(features)}>
          Save Changes
        </PixelButton>
        <PixelButton color="red" className="flex-1" onClick={onCancel}>
          Cancel
        </PixelButton>
      </div>
    </PixelPanel>
  )
}

export default PixelAvatarEditor 