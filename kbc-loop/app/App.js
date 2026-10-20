import { SafeAreaProvider } from 'react-native-safe-area-context'
import LoopApp from './src/LoopApp.js'

export default function App() {
  return (
    <SafeAreaProvider>
      <LoopApp />
    </SafeAreaProvider>
  )
}
