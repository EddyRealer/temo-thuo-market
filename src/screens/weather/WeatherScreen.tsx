// Weather Screen - Temo Thuo Market
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants/theme";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

interface WeatherScreenProps { navigation: any; }

const WeatherScreen: React.FC<WeatherScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const current = { temp: 28, condition: "Sunny", humidity: 45, wind: 12, icon: "☀️" };
  const forecast = [
    { day: "Today", high: 28, low: 18, condition: "sunny", icon: "☀️" },
    { day: "Tomorrow", high: 26, low: 17, condition: "partly_cloudy", icon: "⛅" },
    { day: "Wednesday", high: 24, low: 16, condition: "rainy", icon: "🌧️" },
    { day: "Thursday", high: 25, low: 17, condition: "rainy", icon: "🌧️" },
    { day: "Friday", high: 27, low: 18, condition: "sunny", icon: "☀️" },
  ];
  const alerts = [{ type: "rain", severity: "medium", message: "Heavy rain expected on Wednesday. Consider delaying irrigation." }];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Weather</Text>
        <TouchableOpacity><Ionicons name="location" size={22} color={COLORS.primary} /></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.currentWeather} variant="elevated">
          <View style={styles.currentMain}>
            <Text style={styles.currentTemp}>{current.temp}°C</Text>
            <Text style={styles.currentIcon}>{current.icon}</Text>
          </View>
          <Text style={styles.currentCondition}>{current.condition}</Text>
          <View style={styles.currentDetails}>
            <View style={styles.detailItem}><Ionicons name="water" size={20} color={COLORS.info} /><Text style={styles.detailText}>Humidity: {current.humidity}%</Text></View>
            <View style={styles.detailItem}><Ionicons name="flag" size={20} color={COLORS.warning} /><Text style={styles.detailText}>Wind: {current.wind} km/h</Text></View>
          </View>
        </Card>
        <Text style={styles.sectionTitle}>7-Day Forecast</Text>
        <Card>
          {forecast.map((day, i) => (
            <View key={i} style={[styles.forecastRow, i < forecast.length - 1 && styles.forecastBorder]}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <Text style={styles.forecastIcon}>{day.icon}</Text>
              <View style={styles.forecastTemps}><Text style={styles.forecastHigh}>{day.high}°</Text><Text style={styles.forecastLow}>{day.low}°</Text></View>
            </View>
          ))}
        </Card>
        <Text style={styles.sectionTitle}>Farming Recommendations</Text>
        <Card>
          <View style={styles.recommendation}><Ionicons name="leaf" size={24} color={COLORS.success} /><View style={styles.recContent}><Text style={styles.recTitle}>Good day for planting</Text><Text style={styles.recDesc}>Weather conditions are ideal for sowing maize and sorghum.</Text></View></View>
          <View style={styles.recommendation}><Ionicons name="water" size={24} color={COLORS.info} /><View style={styles.recContent}><Text style={styles.recTitle}>Irrigation recommended</Text><Text style={styles.recDesc}>No rain expected for the next 2 days. Water your crops.</Text></View></View>
        </Card>
        {alerts.length > 0 && <><Text style={styles.sectionTitle}>Weather Alerts</Text><Card><View style={styles.alertItem}><Ionicons name="warning" size={24} color={COLORS.warning} /><View style={styles.alertContent}><Badge text="Rain Alert" variant="warning" size="small" /><Text style={styles.alertMessage}>{alerts[0].message}</Text></View></View></Card></>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text },
  currentWeather: { margin: SPACING.lg, backgroundColor: COLORS.primary, padding: SPACING.xl },
  currentMain: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  currentTemp: { fontSize: 72, fontWeight: "bold", color: COLORS.white },
  currentIcon: { fontSize: 60, marginLeft: SPACING.md },
  currentCondition: { textAlign: "center", fontSize: FONT_SIZES.xl, color: COLORS.white, marginTop: SPACING.xs },
  currentDetails: { flexDirection: "row", justifyContent: "center", marginTop: SPACING.lg, gap: SPACING.xl },
  detailItem: { flexDirection: "row", alignItems: "center" },
  detailText: { color: COLORS.white, marginLeft: SPACING.xs, fontSize: FONT_SIZES.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: "600", color: COLORS.text, marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.md },
  forecastRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm },
  forecastBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  forecastDay: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text },
  forecastIcon: { fontSize: 24, marginHorizontal: SPACING.md },
  forecastTemps: { flexDirection: "row", gap: SPACING.sm },
  forecastHigh: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text },
  forecastLow: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  recommendation: { flexDirection: "row", alignItems: "flex-start", paddingVertical: SPACING.sm },
  recContent: { marginLeft: SPACING.md, flex: 1 },
  recTitle: { fontSize: FONT_SIZES.md, fontWeight: "600", color: COLORS.text },
  recDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  alertItem: { flexDirection: "row", alignItems: "flex-start" },
  alertContent: { marginLeft: SPACING.md, flex: 1 },
  alertMessage: { fontSize: FONT_SIZES.sm, color: COLORS.text, marginTop: SPACING.xs },
});

export default WeatherScreen;
