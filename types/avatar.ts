export interface FacialFeatures {
  skinColor: string
  eyeStyle: 'round' | 'almond' | 'wide'
  eyeColor: string
  eyebrowStyle: 'straight' | 'curved' | 'angry'
  noseStyle: 'small' | 'medium' | 'large'
  mouthStyle: 'smile' | 'neutral' | 'frown'
  hairStyle: 'short' | 'medium' | 'long'
  hairColor: string
}

export const defaultFeatures: FacialFeatures = {
  skinColor: '#FFD5B4',
  eyeStyle: 'round',
  eyeColor: '#4A4A4A',
  eyebrowStyle: 'straight',
  noseStyle: 'small',
  mouthStyle: 'smile',
  hairStyle: 'short',
  hairColor: '#4A4A4A'
} 