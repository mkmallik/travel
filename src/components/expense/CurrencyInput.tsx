import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Menu, Button } from 'react-native-paper';
import { useState } from 'react';
import { CURRENCY_CODES } from '../../utils/currency';

interface CurrencyInputProps {
  amountEur: string;
  onChangeEur: (val: string) => void;
  amountLocal: string;
  onChangeLocal: (val: string) => void;
  localCurrency: string;
  onChangeCurrency: (code: string) => void;
}

export function CurrencyInput({
  amountEur,
  onChangeEur,
  amountLocal,
  onChangeLocal,
  localCurrency,
  onChangeCurrency,
}: CurrencyInputProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        label="Amount (EUR)"
        value={amountEur}
        onChangeText={onChangeEur}
        keyboardType="decimal-pad"
        mode="outlined"
        left={<TextInput.Icon icon="currency-eur" />}
        style={styles.eurInput}
      />
      <View style={styles.localRow}>
        <TextInput
          label="Local Amount"
          value={amountLocal}
          onChangeText={onChangeLocal}
          keyboardType="decimal-pad"
          mode="outlined"
          style={styles.localInput}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.currencyButton}
            >
              {localCurrency || 'Currency'}
            </Button>
          }
        >
          {CURRENCY_CODES.map((code) => (
            <Menu.Item
              key={code}
              onPress={() => {
                onChangeCurrency(code);
                setMenuVisible(false);
              }}
              title={code}
            />
          ))}
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  eurInput: {},
  localRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  localInput: {
    flex: 1,
  },
  currencyButton: {
    marginTop: 6,
  },
});
