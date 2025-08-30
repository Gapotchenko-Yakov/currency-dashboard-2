import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { CurrencyChart } from './components/CurrencyChart';

function App() {
  return (
    <Theme preset={presetGpnDefault}>
      <div className='app'>
        <CurrencyChart initialCurrency="USD" />
      </div>
    </Theme>
  );
}

export default App;
