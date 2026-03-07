import { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Card, Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import {
  getCategoryTotals,
  getTotalExpenses,
} from "../../db/queries/expense";
import { TravelSelector } from "../../components/common/TravelSelector";
import { EmptyState } from "../../components/common/EmptyState";
import { formatEUR } from "../../utils/currency";
import { getCategoryLabel, getCategoryIcon, COLORS, CATEGORY_COLORS } from "../../utils/constants";
import type { CategoryTotalData } from "../../types/database";

export default function CategoryTotalsTab() {
  const db = useSQLiteContext();
  const { currentTravel } = useCurrentTravel();
  const [categories, setCategories] = useState<CategoryTotalData[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (currentTravel) {
        getCategoryTotals(db, currentTravel.travel_id).then(setCategories);
        getTotalExpenses(db, currentTravel.travel_id).then(setGrandTotal);
      } else {
        setCategories([]);
        setGrandTotal(0);
      }
    }, [currentTravel?.travel_id])
  );

  return (
    <View style={styles.container}>
      <TravelSelector />
      {grandTotal > 0 && (
        <View style={styles.grandTotalBar}>
          <Text variant="titleMedium" style={styles.grandTotalLabel}>Trip Total</Text>
          <Text variant="headlineSmall" style={styles.grandTotalAmount}>
            {formatEUR(grandTotal)}
          </Text>
        </View>
      )}
      {categories.length === 0 ? (
        <EmptyState
          icon="chart-pie"
          title="No Category Data"
          subtitle="Add expenses to see category breakdowns"
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.category}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const pct = grandTotal > 0 ? (item.total_eur / grandTotal) * 100 : 0;
            const color = CATEGORY_COLORS[item.category] ?? COLORS.others;
            return (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.row}>
                    <MaterialCommunityIcons
                      name={getCategoryIcon(item.category) as any}
                      size={24}
                      color={color}
                    />
                    <View style={styles.info}>
                      <Text variant="titleSmall" style={styles.categoryName}>
                        {getCategoryLabel(item.category)}
                      </Text>
                      <Text variant="bodySmall" style={styles.countText}>
                        {item.count} expense{item.count !== 1 ? "s" : ""}
                      </Text>
                    </View>
                    <View style={styles.amountSection}>
                      <Text variant="titleMedium" style={{ color }}>
                        {formatEUR(item.total_eur)}
                      </Text>
                      <Text variant="bodySmall" style={styles.pctText}>
                        {pct.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${pct}%`, backgroundColor: color },
                      ]}
                    />
                  </View>
                </Card.Content>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  grandTotalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary + "20",
  },
  grandTotalLabel: {
    color: COLORS.text,
  },
  grandTotalAmount: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  list: {
    padding: 8,
  },
  card: {
    marginVertical: 4,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  info: {
    flex: 1,
  },
  categoryName: {
    color: COLORS.text,
  },
  countText: {
    color: COLORS.textSecondary,
  },
  amountSection: {
    alignItems: "flex-end",
  },
  pctText: {
    color: COLORS.textSecondary,
  },
  barBg: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  divider: {
    backgroundColor: COLORS.border,
  },
});
