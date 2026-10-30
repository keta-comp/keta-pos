import { useState } from "react";
import PosScreen from "./PosScreen";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type BusinessType = "shop" | "cafe";
type Step = "choose" | "details" | "complete";

const C = {
  background: "#F1F3F5",
  surface: "#F7F8FA",
  white: "#FFFFFF",
  ink: "#17191C",
  muted: "#737B84",
  metal: "#9AA3AD",
  metalLight: "#DDE1E5",
  line: "#E4E7EA",
  black: "#17191C",
};

const BUSINESS = {
  shop: {
    title: "Do‘kon",
    subtitle: "Mahsulot, shtrix-kod va ombor hisobi",
    name: "Do‘kon rejimi",
    next: "Mahsulot va shtrix-kodlarni sozlash",
    mark: "D",
  },
  cafe: {
    title: "Kafe / Restoran",
    subtitle: "Stollar, menyu va oshxona buyurtmalari",
    name: "Kafe / Restoran rejimi",
    next: "Menyu va stollarni sozlash",
    mark: "K",
  },
} satisfies Record<BusinessType, {
  title: string;
  subtitle: string;
  name: string;
  next: string;
  mark: string;
}>;

export default function App() {
  const [step, setStep] = useState<Step>("choose");
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [businessName, setBusinessName] = useState("");

  const business = businessType ? BUSINESS[businessType] : null;
  const canContinue = businessType !== null;
  const canFinish = businessName.trim().length >= 2;

  function reset() {
    setStep("choose");
    setBusinessType(null);
    setBusinessName("");
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.page}>
          <View style={s.brandRow}>
            <View style={s.brandMark}><Text style={s.brandMarkText}>K</Text></View>
            <View>
              <Text style={s.brandName}>KetaPOS</Text>
              <Text style={s.brandCaption}>SAVDO BOSHQARUVI</Text>
            </View>
            <View style={s.mobilePill}><Text style={s.mobilePillText}>MOBILE</Text></View>
          </View>

          <View style={s.progressTrack} accessibilityLabel="Sozlash bosqichi">
            <View style={[s.progressFill, step !== "choose" && s.progressDone]} />
          </View>

          {step === "choose" && (
            <View style={s.content}>
              <Eyebrow label="BOSHLANG‘ICH SOZLASH" />
              <Text style={s.heading}>Biznesingiz turini tanlang</Text>
              <Text style={s.description}>
                KetaPOS sizga kerakli kassa va boshqaruv bo‘limlarini tayyorlaydi.
              </Text>

              <View style={s.choiceList}>
                {(["shop", "cafe"] as const).map((type) => {
                  const item = BUSINESS[type];
                  const selected = businessType === type;
                  return (
                    <Pressable
                      key={type}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => setBusinessType(type)}
                      style={({ pressed }) => [
                        s.choiceCard,
                        selected && s.choiceSelected,
                        pressed && s.pressed,
                      ]}
                    >
                      <View style={[s.choiceIcon, selected && s.choiceIconSelected]}>
                        <Text style={[s.choiceIconText, selected && s.choiceIconTextSelected]}>
                          {item.mark}
                        </Text>
                      </View>
                      <View style={s.choiceCopy}>
                        <Text style={s.choiceTitle}>{item.title}</Text>
                        <Text style={s.choiceSubtitle}>{item.subtitle}</Text>
                      </View>
                      <View style={[s.radio, selected && s.radioSelected]}>
                        {selected && <View style={s.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View style={s.noteCard}>
                <Text style={s.noteLabel}>BIZNES TURI</Text>
                <Text style={s.noteText}>
                  Keyinroq filial va xodimlaringizni sozlamalardan qo‘shishingiz mumkin.
                </Text>
              </View>

              <PrimaryButton
                label="Davom etish"
                disabled={!canContinue}
                onPress={() => businessType && setStep("details")}
              />
            </View>
          )}

          {step === "details" && business && (
            <View style={s.content}>
              <Pressable onPress={() => setStep("choose")} style={s.backButton}>
                <Text style={s.backText}>‹  Orqaga</Text>
              </Pressable>
              <Eyebrow label={business.name.toUpperCase()} />
              <Text style={s.heading}>Biznesingiz haqida</Text>
              <Text style={s.description}>
                Bu ma’lumot KetaPOS ish joyini tayyorlash uchun kerak.
              </Text>

              <View style={s.formCard}>
                <Text style={s.inputLabel}>Biznes nomi</Text>
                <TextInput
                  accessibilityLabel="Biznes nomi"
                  autoCapitalize="words"
                  onChangeText={setBusinessName}
                  placeholder={businessType === "shop" ? "Masalan, Keta Market" : "Masalan, Keta Cafe"}
                  placeholderTextColor="#8D959E"
                  returnKeyType="done"
                  style={s.input}
                  value={businessName}
                />
                <Text style={s.helperText}>Nomni keyin o‘zgartirish mumkin.</Text>

                <View style={s.preview}>
                  <View style={s.previewMark}><Text style={s.previewMarkText}>{business.mark}</Text></View>
                  <View style={s.previewCopy}>
                    <Text style={s.previewLabel}>TANLANGAN REJIM</Text>
                    <Text style={s.previewTitle}>{business.name}</Text>
                    <Text style={s.previewHint}>{business.next}</Text>
                  </View>
                </View>
              </View>

              <PrimaryButton
                label="Sozlashni boshlash"
                disabled={!canFinish}
                onPress={() => canFinish && setStep("complete")}
              />
            </View>
          )}

          {step === "complete" && businessType && (
            <PosScreen businessName={businessName.trim()} mode={businessType} />
          )}

          <View style={s.footer}>
            <View style={s.footerLine} />
            <Text style={s.footerText}>KetaPOS  ·  Savdo bir joyda</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Eyebrow({ label }: { label: string }) {
  return (
    <View style={s.eyebrow}>
      <View style={s.eyebrowDot} />
      <Text style={s.eyebrowText}>{label}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  disabled = false,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.primaryButton,
        disabled && s.primaryDisabled,
        pressed && !disabled && s.pressed,
      ]}
    >
      <Text style={[s.primaryText, disabled && s.primaryTextDisabled]}>{label}</Text>
      <Text style={[s.primaryArrow, disabled && s.primaryTextDisabled]}>→</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  scroll: { flexGrow: 1 },
  page: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 26,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 25 },
  brandMark: {
    width: 44, height: 44, borderRadius: 15, backgroundColor: C.black,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#747C84", shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  brandMarkText: { color: C.white, fontSize: 22, fontWeight: "800" },
  brandName: { color: C.ink, fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
  brandCaption: { color: C.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1.5, marginTop: 2 },
  mobilePill: {
    marginLeft: "auto", borderRadius: 10, backgroundColor: "#E5E8EB",
    borderWidth: 1, borderColor: C.white, paddingHorizontal: 10, paddingVertical: 7,
    shadowColor: "#A4ABB2", shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 2,
  },
  mobilePillText: { color: "#555D65", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  progressTrack: { height: 5, borderRadius: 5, backgroundColor: "#E1E4E7", marginBottom: 31, overflow: "hidden" },
  progressFill: { width: "50%", height: "100%", borderRadius: 5, backgroundColor: C.metal },
  progressDone: { width: "100%", backgroundColor: C.ink },
  content: { flexGrow: 1 },
  eyebrow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  eyebrowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.metal },
  eyebrowText: { color: "#66707A", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  heading: { color: C.ink, fontSize: 29, lineHeight: 36, fontWeight: "800", letterSpacing: -0.8 },
  description: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 9 },
  choiceList: { gap: 14, marginTop: 25 },
  choiceCard: {
    minHeight: 94, flexDirection: "row", alignItems: "center", padding: 15,
    borderRadius: 22, backgroundColor: C.surface, borderWidth: 1, borderColor: C.white,
    shadowColor: "#AEB5BC", shadowOffset: { width: 5, height: 7 },
    shadowOpacity: 0.36, shadowRadius: 12, elevation: 5,
  },
  choiceSelected: { borderColor: "#8E969F", backgroundColor: C.white, shadowColor: "#727A82", shadowOpacity: 0.32, elevation: 7 },
  choiceIcon: {
    width: 50, height: 50, borderRadius: 17, backgroundColor: "#E8EBEE",
    borderWidth: 1, borderColor: C.white, alignItems: "center", justifyContent: "center",
    shadowColor: "#B2B8BE", shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 5, elevation: 2,
  },
  choiceIconSelected: { backgroundColor: "#202327" },
  choiceIconText: { color: "#454C54", fontSize: 19, fontWeight: "800" },
  choiceIconTextSelected: { color: C.white },
  choiceCopy: { flex: 1, marginLeft: 13, marginRight: 7 },
  choiceTitle: { color: C.ink, fontSize: 16, fontWeight: "800" },
  choiceSubtitle: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  radio: {
    width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, borderColor: "#AAB1B8",
    alignItems: "center", justifyContent: "center",
  },
  radioSelected: { borderColor: C.ink },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: C.ink },
  noteCard: {
    marginTop: 20, marginBottom: 22, padding: 16, borderRadius: 18,
    backgroundColor: "#E8EBEE", borderTopWidth: 1, borderTopColor: C.white,
    shadowColor: "#AEB5BC", shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 7, elevation: 2,
  },
  noteLabel: { color: "#747D86", fontSize: 9, fontWeight: "800", letterSpacing: 1.3 },
  noteText: { color: "#4E565E", fontSize: 12, lineHeight: 18, marginTop: 7 },
  primaryButton: {
    minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingHorizontal: 18, borderRadius: 17, backgroundColor: C.black,
    shadowColor: "#747C84", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.26, shadowRadius: 9, elevation: 5,
  },
  primaryDisabled: { backgroundColor: "#D5D9DD", shadowOpacity: 0.08, elevation: 1 },
  primaryText: { color: C.white, fontSize: 14, fontWeight: "800" },
  primaryTextDisabled: { color: "#8A929A" },
  primaryArrow: { color: C.white, fontSize: 18, fontWeight: "700" },
  pressed: { transform: [{ scale: 0.985 }] },
  backButton: { alignSelf: "flex-start", paddingVertical: 7, paddingRight: 12, marginBottom: 18 },
  backText: { color: "#636C75", fontSize: 13, fontWeight: "700" },
  formCard: {
    marginTop: 25, marginBottom: 23, padding: 18, borderRadius: 22,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.white,
    shadowColor: "#AEB5BC", shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  inputLabel: { color: C.ink, fontSize: 12, fontWeight: "800", marginBottom: 9 },
  input: {
    minHeight: 52, borderRadius: 14, paddingHorizontal: 14, color: C.ink,
    fontSize: 14, backgroundColor: "#EAEDF0", borderTopWidth: 1, borderTopColor: C.white,
  },
  helperText: { color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 8 },
  preview: {
    flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 17,
    marginTop: 18, borderTopWidth: 1, borderTopColor: C.line,
  },
  previewMark: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "#DDE1E5",
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.white,
  },
  previewMarkText: { color: "#48515A", fontSize: 17, fontWeight: "800" },
  previewCopy: { flex: 1 },
  previewLabel: { color: "#818A93", fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  previewTitle: { color: C.ink, fontSize: 13, fontWeight: "800", marginTop: 4 },
  previewHint: { color: C.muted, fontSize: 10, marginTop: 3 },
  successMark: {
    width: 58, height: 58, borderRadius: 20, backgroundColor: "#E1E5E8",
    borderWidth: 1, borderColor: C.white, alignItems: "center", justifyContent: "center",
    marginBottom: 22, shadowColor: "#AEB5BC", shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
  },
  successCheck: { color: C.ink, fontSize: 26, fontWeight: "800" },
  completeCard: {
    marginTop: 24, marginBottom: 23, padding: 18, borderRadius: 22,
    backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.white,
    shadowColor: "#AEB5BC", shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 4,
  },
  completeTitle: { color: C.ink, fontSize: 16, fontWeight: "800", marginTop: 9 },
  completeText: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  footer: { alignItems: "center", marginTop: "auto", paddingTop: 28 },
  footerLine: { width: 40, height: 3, borderRadius: 3, backgroundColor: C.metalLight, marginBottom: 10 },
  footerText: { color: "#929AA2", fontSize: 10, fontWeight: "600", letterSpacing: 0.3 },
});
