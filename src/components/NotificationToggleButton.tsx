import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface NotificationToggleButtonProps {
  isOn: boolean;
  label: string; // '7', '3', '1', 'D'
  onPress: () => void;
}

const BRAND_COLOR = '#4A90D9';
const OFF_COLOR = '#CCCCCC';
const ON_TEXT_COLOR = '#FFFFFF';
const OFF_TEXT_COLOR = '#666666';

export default function NotificationToggleButton({
  isOn,
  label,
  onPress,
}: NotificationToggleButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isOn ? BRAND_COLOR : OFF_COLOR }]}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityState={{ selected: isOn }}
      accessibilityLabel={`${label} 알림 ${isOn ? '활성화' : '비활성화'}`}
    >
      <Text style={[styles.label, { color: isOn ? ON_TEXT_COLOR : OFF_TEXT_COLOR }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
