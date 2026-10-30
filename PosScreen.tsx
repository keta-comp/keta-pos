import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Product = { id: number; name: string; price: number };
type Line = Product & { quantity: number };
type Sale = { id: number; total: number; lines: Line[]; table: string; payment: string };
const money = (value: number) => value.toLocaleString("uz-UZ") + " so‘m";

export default function PosScreen({ businessName, mode }: { businessName: string; mode: "shop" | "cafe" }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Line[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [table, setTable] = useState("");
  const [payment, setPayment] = useState("Naqd");
  const [tab, setTab] = useState<"cash" | "history">("cash");
  const [sequence, setSequence] = useState(1);
  const total = cart.reduce((sum, row) => sum + row.price * row.quantity, 0);

  function addProduct() {
    const value = Number(price.replace(/\s/g, ""));
    if (!name.trim() || !Number.isSafeInteger(value) || value <= 0) {
      Alert.alert("Ma’lumotni tekshiring", "Nom va musbat butun so‘mdagi narxni kiriting.");
      return;
    }
    setProducts(rows => [...rows, { id: sequence, name: name.trim(), price: value }]);
    setSequence(n => n + 1);
    setName("");
    setPrice("");
  }

  function changeQuantity(product: Product, delta: number) {
    setCart(rows => {
      const existing = rows.find(row => row.id === product.id);
      if (!existing) return delta > 0 ? [...rows, { ...product, quantity: 1 }] : rows;
      return rows.map(row => row.id === product.id ? { ...row, quantity: row.quantity + delta } : row)
        .filter(row => row.quantity > 0);
    });
  }

  function checkout() {
    if (!cart.length || !Number.isSafeInteger(total)) return;
    Alert.alert("Savdoni yakunlash", money(total) + " · " + payment, [
      { text: "Bekor qilish", style: "cancel" },
      { text: "Tasdiqlash", onPress: () => {
        setSales(rows => [{ id: sequence, lines: cart.map(row => ({ ...row })), total, table: table.trim(), payment }, ...rows]);
        setSequence(n => n + 1);
        setCart([]);
        setTable("");
      } },
    ]);
  }

  return <View style={s.container}>
    <Text style={s.caption}>{mode === "shop" ? "DO‘KON KASSASI" : "KAFE / RESTORAN KASSASI"}</Text>
    <Text style={s.title}>{businessName}</Text>
    <View style={s.tabs}>
      <Action label="Kassa" onPress={() => setTab("cash")} active={tab === "cash"} />
      <Action label={"Savdolar (" + sales.length + ")"} onPress={() => setTab("history")} active={tab === "history"} />
    </View>
    {tab === "history" ? <>
      {!sales.length && <Text style={s.muted}>Hali yakunlangan savdo yo‘q.</Text>}
      {sales.map(sale => <View key={sale.id} style={s.card}>
        <Text style={s.heading}>Savdo #{sale.id} · {money(sale.total)}</Text>
        <Text style={s.muted}>{sale.payment}{sale.table ? " · Stol: " + sale.table : ""}</Text>
        {sale.lines.map(line => <Text key={line.id} style={s.detail}>{line.name} × {line.quantity} — {money(line.price * line.quantity)}</Text>)}
      </View>)}
    </> : <>
      <View style={s.card}>
        <Text style={s.heading}>{mode === "shop" ? "Mahsulot qo‘shish" : "Taom qo‘shish"}</Text>
        <TextInput accessibilityLabel="Nomi" style={s.input} placeholder="Nomi" value={name} onChangeText={setName} />
        <TextInput accessibilityLabel="Narx, so‘m" style={s.input} placeholder="Narx, so‘m" keyboardType="number-pad" value={price} onChangeText={setPrice} />
        <Action label="Qo‘shish" onPress={addProduct} active />
      </View>
      <Text style={s.heading}>{mode === "shop" ? "Mahsulotlar" : "Menyu"}</Text>
      {!products.length && <Text style={s.muted}>Birinchi mahsulot yoki taomni yuqorida kiriting.</Text>}
      {products.map(product => <Pressable accessibilityRole="button" accessibilityLabel={product.name + " savatga qo‘shish"} key={product.id} style={s.product} onPress={() => changeQuantity(product, 1)}>
        <View style={s.grow}><Text style={s.heading}>{product.name}</Text><Text style={s.muted}>{money(product.price)}</Text></View>
        <Text style={s.plus}>＋</Text>
      </Pressable>)}
      <View style={s.card}>
        <Text style={s.heading}>Savat</Text>
        {mode === "cafe" && <TextInput accessibilityLabel="Stol raqami" style={s.input} placeholder="Stol raqami (ixtiyoriy)" value={table} onChangeText={setTable} />}
        {!cart.length && <Text style={s.muted}>Savat hozircha bo‘sh.</Text>}
        {cart.map(line => <View key={line.id} style={s.row}>
          <View style={s.grow}><Text style={s.detail}>{line.name}</Text><Text style={s.muted}>{money(line.price * line.quantity)}</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel={line.name + " miqdorini kamaytirish"} style={s.quantity} onPress={() => changeQuantity(line, -1)}><Text>−</Text></Pressable>
          <Text>{line.quantity}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={line.name + " miqdorini oshirish"} style={s.quantity} onPress={() => changeQuantity(line, 1)}><Text>＋</Text></Pressable>
        </View>)}
        <View style={s.tabs}>{["Naqd", "Karta"].map(method => <Action key={method} label={method} active={payment === method} onPress={() => setPayment(method)} />)}</View>
        <Text style={s.total}>Jami: {money(total)}</Text>
        <Action label="Savdoni yakunlash" onPress={checkout} disabled={!cart.length || !Number.isSafeInteger(total)} active />
      </View>
    </>}
  </View>;
}

function Action({ label, onPress, active = false, disabled = false }: { label: string; onPress: () => void; active?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[s.button, active && s.active, disabled && { opacity: 0.4 }]}>
    <Text style={[s.buttonText, active && { color: "#fff" }]}>{label}</Text>
  </Pressable>;
}
const s = StyleSheet.create({
  container: { gap: 16 }, caption: { color: "#67717A", fontWeight: "700", fontSize: 10, letterSpacing: 1.4 },
  title: { color: "#17191C", fontWeight: "800", fontSize: 28 },
  tabs: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  card: { padding: 18, borderRadius: 24, backgroundColor: "#F8F9FA", borderWidth: 1, borderColor: "#fff", gap: 12,
    shadowColor: "#9CA5AE", shadowOffset: { width: 4, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  heading: { fontWeight: "700", color: "#17191C", fontSize: 16 },
  muted: { color: "#66717A", fontSize: 13, lineHeight: 19 },
  detail: { color: "#242A30", fontSize: 14 },
  input: { backgroundColor: "#E9EDF0", borderRadius: 14, padding: 14, color: "#17191C", minHeight: 50 },
  button: { minHeight: 48, justifyContent: "center", alignItems: "center", paddingHorizontal: 18, borderRadius: 16, backgroundColor: "#DCE1E5" },
  active: { backgroundColor: "#17191C" }, buttonText: { fontWeight: "700", color: "#30373E" },
  product: { flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#F9FAFB", borderRadius: 20, borderColor: "#fff", borderWidth: 1 },
  grow: { flex: 1 }, plus: { fontSize: 26, color: "#57636F" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  quantity: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center", backgroundColor: "#E2E7EB", borderRadius: 14 },
  total: { fontWeight: "800", fontSize: 22, color: "#17191C" },
});
