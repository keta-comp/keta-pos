import { useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { AppState, Linking, Modal, Pressable, Text, View } from "react-native";
import { useEffect } from "react";

export default function BarcodeScanner({ onScan, onClose }: { onScan: (code: string) => void; onClose: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const locked = useRef(false);
  const [active, setActive] = useState(AppState.currentState === "active");
  useEffect(() => {
    const subscription = AppState.addEventListener("change", value => setActive(value === "active"));
    return () => subscription.remove();
  }, []);
  const button = { padding: 18, borderRadius: 16, backgroundColor: "#DDE1E5" };
  return <Modal animationType="slide" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: "#17191C", paddingTop: 60, paddingBottom: 40, gap: 20 }}>
      <Text style={{ color: "white", fontSize: 22, textAlign: "center" }}>Shtrix-kodni kameraga tuting</Text>
      {permission?.granted && active ? <CameraView style={{ flex: 1 }} facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39"] }}
        onBarcodeScanned={({ data }) => {
          if (locked.current) return;
          locked.current = true;
          onScan(data.trim());
        }} /> : <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 20 }}>
          <Text style={{ color: "white" }}>Mahsulot shtrix-kodini o‘qish uchun kameraga ruxsat kerak.</Text>
          <Pressable accessibilityRole="button" style={button} onPress={() => {
            if (permission?.canAskAgain === false) void Linking.openSettings();
            else void requestPermission();
          }}><Text>{permission?.canAskAgain === false ? "Sozlamalarni ochish" : "Kameraga ruxsat berish"}</Text></Pressable>
        </View>}
      <Pressable accessibilityRole="button" style={[button, { marginHorizontal: 24 }]} onPress={onClose}><Text style={{ textAlign: "center" }}>Yopish</Text></Pressable>
    </View>
  </Modal>;
}
