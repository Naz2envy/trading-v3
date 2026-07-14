import './styles.css';
import type {Metadata, Viewport} from 'next';
export const metadata:Metadata={title:'TradeSea',description:'Private AI trading journal',applicationName:'TradeSea',appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'TradeSea'},icons:{icon:'/icon.svg',apple:'/icon.svg'},manifest:'/manifest.webmanifest'};
export const viewport:Viewport={width:'device-width',initialScale:1,maximumScale:1,viewportFit:'cover',themeColor:[{media:'(prefers-color-scheme: light)',color:'#f5f5f7'},{media:'(prefers-color-scheme: dark)',color:'#09090b'}]};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
