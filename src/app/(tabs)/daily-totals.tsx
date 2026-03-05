import { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Card, Text, Divider } from 'react-native-paper';
import { useCurrentTravel } from '../../hooks/useCurrentTravel';
import {
  getDailyTotals,
  getTotalExpenses,
  type DailyTotal,
} from '../../db/queries/expense';
import { TravelSelector } from '../../components/common/TravelSelector';
import { EmptyState } from '../../components/common/EmptyState';
import { formatEUR } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export default function DailyTotalsTab() {
  const db = useSQLiteContext();
  const { currentTravel } = useCurrentTravel();
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (currentTravel) {
        getDailyTotals(db, currentTravel.travel_id).then(setDailyTotals);
        getTotalExpenses(db, currentTravel.travel_id).then(setGrandTotal);
      } else {
        setDailyTotals([]);
        setGrandTotal(0);
      }
    }, [currentTravel?.travel_id])
  );

  let runningTotal = 0;

  return (
    <View style={styles.container}>
      <TravelSelector />
      {grandTotal > 0 && (
        <View style={styles.grandTotalBar}>
          <Text variant="titleMedium">Trip Total</Text>
          <Text variant="headlineSmall" style={styles.grandTotalAmount}>
            {formatEUR(grandTotal)}
          </Text>
        </View>
      )}
      {dailyTotals.length === 0 ? (
        <EmptyState
          icon="calendar-text"
          title="No Daily Totals"
          subtitle="Add expenses to see daily breakdowns"
        />
      ) : (
        <FlatList
          data={dailyTotals}
          keyExtractor={(item) => item.date}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item }) => {
            runningTotal += item.total_eur;
            return (
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.dateSection}>
                    <Text variant="titleSmall">{formatDate(item.date)}</Text>
                    <Text variant="bodySmall" style={styles.countText}>
                      {item.count} expense{item.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.amountSection}>
                    <Text variant="titleMedium" style={styles.dayAmount}>
                      {formatEUR(item.total_eur)}
                    </Text>
                    <Text variant="bodySmall" style={styles.runningTotal}>
                      Running: {formatEUR(runningTotal)}
                    </Text>
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
    backgroundColor: '#FAFAFA',
  },
  grandTotalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
  },
  grandTotalAmount: {
    color: '#1B5E20',
    fontWeight: '700',
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSection: {},
  countText: {
    color: '#757575',
    marginTop: 2,
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  dayAmount: {
    color: '#1B5E20',
    fontWeight: '600',
  },
  runningTotal: {
    color: '#9E9E9E',
    marginTop: 2,
  },
});
