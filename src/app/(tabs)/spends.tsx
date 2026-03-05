import { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, IconButton, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTravel } from '../../hooks/useCurrentTravel';
import { getExpensesByDate, deleteExpense } from '../../db/queries/expense';
import { DateSelector } from '../../components/common/DateSelector';
import { TravelSelector } from '../../components/common/TravelSelector';
import { EmptyState } from '../../components/common/EmptyState';
import { FAB } from '../../components/common/FAB';
import { formatEUR, formatLocal } from '../../utils/currency';
import { getCategoryLabel, getCategoryIcon } from '../../utils/categories';
import { toISODate, formatDate } from '../../utils/date';
import { CATEGORY_COLORS } from '../../constants/theme';
import type { Expense } from '../../types/database';

function ExpenseRow({ item, onPress, onDelete }: { item: Expense; onPress: () => void; onDelete: () => void }) {
  const color = CATEGORY_COLORS[item.category] ?? '#9E9E9E';
  return (
    <Pressable onPress={onPress} style={styles.expenseRow}>
      <View style={[styles.catIcon, { backgroundColor: color + '18' }]}>
        <MaterialCommunityIcons
          name={getCategoryIcon(item.category) as any}
          size={20}
          color={color}
        />
      </View>
      <View style={styles.expenseInfo}>
        <Text variant="bodyLarge" style={styles.expenseDesc} numberOfLines={1}>
          {item.description}
        </Text>
        <Text variant="bodySmall" style={styles.expenseCat}>
          {getCategoryLabel(item.category)}
          {item.amount_local != null && item.local_currency_code
            ? ` · ${formatLocal(item.amount_local, item.local_currency_code)}`
            : ''}
        </Text>
      </View>
      <Text variant="titleSmall" style={styles.expenseAmount}>
        {formatEUR(item.amount_eur)}
      </Text>
      {item.receipt_image_uri && (
        <Image source={{ uri: item.receipt_image_uri }} style={styles.receiptThumb} />
      )}
      <IconButton
        icon="close"
        size={16}
        iconColor="#bbb"
        onPress={onDelete}
        style={styles.deleteBtn}
      />
    </Pressable>
  );
}

export default function SpendsTab() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { currentTravel } = useCurrentTravel();
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadExpenses = useCallback(async () => {
    if (currentTravel) {
      const list = await getExpensesByDate(db, currentTravel.travel_id, selectedDate);
      setExpenses(list);
    } else {
      setExpenses([]);
    }
  }, [currentTravel?.travel_id, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses])
  );

  const handleDelete = async (expenseId: number) => {
    await deleteExpense(db, expenseId);
    loadExpenses();
  };

  const dayTotal = expenses.reduce((sum, e) => sum + e.amount_eur, 0);

  return (
    <View style={styles.container}>
      <TravelSelector />

      {currentTravel && (
        <DateSelector
          startDate={currentTravel.start_date}
          endDate={currentTravel.end_date}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {/* Day header bar */}
      {currentTravel && (
        <View style={styles.dayHeader}>
          <Text variant="titleSmall" style={styles.dayHeaderDate}>
            {formatDate(selectedDate)}
          </Text>
          {dayTotal > 0 && (
            <Text variant="titleSmall" style={styles.dayHeaderTotal}>
              {formatEUR(dayTotal)}
            </Text>
          )}
        </View>
      )}

      {expenses.length === 0 ? (
        <EmptyState
          icon="currency-eur"
          title="No Expenses"
          subtitle={
            currentTravel
              ? 'Tap + to add an expense for this day'
              : 'Create a trip first'
          }
        />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.expense_id)}
          ItemSeparatorComponent={() => <Divider style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ExpenseRow
              item={item}
              onPress={() => router.push(`/expense/${item.expense_id}`)}
              onDelete={() => handleDelete(item.expense_id)}
            />
          )}
        />
      )}

      {currentTravel && (
        <FAB
          icon="plus"
          onPress={() =>
            router.push({
              pathname: '/expense/add',
              params: { date: selectedDate },
            })
          }
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
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  dayHeaderDate: {
    color: '#333',
  },
  dayHeaderTotal: {
    color: '#1B5E20',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 80,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
    minWidth: 0,
  },
  expenseDesc: {
    fontWeight: '500',
    color: '#222',
  },
  expenseCat: {
    color: '#999',
    marginTop: 1,
  },
  expenseAmount: {
    color: '#1B5E20',
    fontWeight: '700',
    minWidth: 60,
    textAlign: 'right',
  },
  receiptThumb: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  deleteBtn: {
    margin: 0,
  },
  separator: {
    marginLeft: 60,
  },
});
