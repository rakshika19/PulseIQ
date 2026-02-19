import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PatientHome  from './Components/PatientHome.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <HomePage /> */}
      <PatientHome
      patientName="Sarah"
      onNavigate={(id) => console.log("Navigate to:", id)}
      onStartAnalysis={() => console.log("Start symptom analysis")}
    />
    </>
  )
}

export default App
