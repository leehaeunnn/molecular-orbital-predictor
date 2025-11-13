import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import AppSimple from './App-simple.tsx'
// import AppTest from './App-test.tsx'
// import AppWorking from './App-working.tsx'
import AppFinal from './App-final.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppFinal />
  </StrictMode>,
)
