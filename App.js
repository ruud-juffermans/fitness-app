import Router from '@router';
import { RootProvider } from "@state/RootProvider";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from "react-native-portalize";
import { RecoilRoot } from 'recoil';
import { ToastProvider } from '@state/ToastProvider';



export default function App() {
      return (
  <RecoilRoot>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Host>
          <ToastProvider>
          <RootProvider>
            <Router />
          </RootProvider>
          </ToastProvider>
        </Host>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
}