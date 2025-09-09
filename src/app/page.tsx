import React from 'react';

export default function Page() {
  return (
    <main style={{padding:20}}>
      <h1>Health Check</h1>
      <p>Application is running. Check /assets and /pulse for data.</p>
      <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0,40)}...</p>
    </main>
  )
}
