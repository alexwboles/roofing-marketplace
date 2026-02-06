import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';
import '../lib/fixLeaflet';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
