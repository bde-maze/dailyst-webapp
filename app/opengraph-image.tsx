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
          background: '#fcfcfc', // Light background matching the theme
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333333', // Dark foreground text
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
            maxWidth: '1000px',
          }}
        >
          {/* Logo/Title Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontSize: 96,
                fontWeight: 'bold',
                color: '#8B6F47', // Primary color (warm brown/orange from oklch(0.55 0.15 45))
                letterSpacing: '-0.02em',
              }}
            >
              Dailyst
            </div>
            <div
              style={{
                width: '120px',
                height: '4px',
                background: '#8B6F47',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: '600',
                color: '#1a1a1a',
                lineHeight: '1.2',
              }}
            >
              3 Most Important Things Today
            </div>
            <div
              style={{
                fontSize: 32,
                color: '#666666',
                lineHeight: '1.4',
                maxWidth: '900px',
              }}
            >
              A minimalistic app to track your 3 most important tasks each day
            </div>
          </div>

          {/* Decorative Elements - Three dots representing the 3 tasks */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#8B6F47',
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
