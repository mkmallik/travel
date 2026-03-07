import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Menu, Button } from "react-native-paper";
import { CURRENCY_CODES } from "../../utils/currency";
import { COLORS } from "../../utils/constants";

interface CurrencyInputProps {
  amountEur: string;
  onChangeEur: (val: string) => void;
  amountLocal: string;
  onChangeLocal: (val: string) => void;
  localCurrency: string;
  onChangeCurrency: (code: string) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amountEur,
  onChangeEur,
  amountLocal,
  onChangeLocal,
  localCurrency,
  onChangeCurrency,
}) => {
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
              textColor={COLORS.text}
            >
              {localCurrency || "Currency"}
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
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  eurInput: {},
  localRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  localInput: {
    flex: 1,
  },
  currencyButton: {
    marginTop: 6,
    borderColor: COLORS.border,
  },
});

export default CurrencyInput;
export { CurrencyInput };
