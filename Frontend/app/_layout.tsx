import { Stack } from 'expo-router';
import { AccessibilityProvider } from '../components/Accessibility';
export default function LayoutPrincipal() {
  return <AccessibilityProvider><Stack screenOptions={{ headerShown: false }} /></AccessibilityProvider>;
}
