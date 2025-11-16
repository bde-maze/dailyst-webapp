import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
          }}
        >
          <div
            style={{
              fontSize: 100,
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Dailyst
          </div>
          <div
            style={{
              fontSize: 48,
              textAlign: 'center',
              opacity: 0.9,
              maxWidth: '900px',
            }}
          >
            3 Most Important Things Today
          </div>
          <div
            style={{
              fontSize: 32,
              textAlign: 'center',
              opacity: 0.8,
              marginTop: '20px',
              maxWidth: '800px',
            }}
          >
            A minimalistic app to track your 3 most important tasks each day
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
